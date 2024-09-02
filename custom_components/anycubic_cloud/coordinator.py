"""DataUpdateCoordinator for the Anycubic Cloud integration."""
from __future__ import annotations

import asyncio
from datetime import timedelta
from typing import Any
import time
import traceback

from aiohttp import CookieJar

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import callback, CoreState, HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.device_registry import (
    DeviceInfo,
    async_get as async_get_device_registry,
)
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .anycubic_cloud_api.anycubic_exceptions import AnycubicAPIError, AnycubicAPIParsingError
from .anycubic_cloud_api.anycubic_api_mqtt import AnycubicMQTTAPI as AnycubicAPI

from .const import (
    CONF_DEBUG,
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    CONF_MQTT_CONNECT_MODE,
    CONF_PRINTER_ID_LIST,
    DEFAULT_SCAN_INTERVAL,
    ENTITY_ID_DRYING_START_PRESET_,
    FAILED_UPDATE_DELAY,
    MAX_DRYING_PRESETS,
    MAX_FAILED_UPDATES,
    MQTT_ACTION_RESPONSE_ALIVE_SECONDS,
    MQTT_IDLE_DISCONNECT_SECONDS,
    MQTT_SCAN_INTERVAL,
    MQTT_REFRESH_INTERVAL,
    DOMAIN,
    LOGGER,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .helpers import (
    AnycubicMQTTConnectMode,
    build_printer_device_info,
    state_string_active,
    state_string_loaded,
)


class AnycubicCloudDataUpdateCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """AnycubicCloud Data Update Coordinator."""

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
    ) -> None:
        """Initialize AnycubicCloud."""
        self.entry = entry
        self._anycubic_api: AnycubicAPI | None = None
        self._anycubic_printers = dict()
        self._cloud_file_list = None
        self._last_state_update = None
        self._failed_updates = 0
        self._mqtt_task = None
        self._mqtt_manually_connected = False
        self._mqtt_idle_since = None
        self._mqtt_last_action = None
        self._mqtt_connect_check_lock = asyncio.Lock()
        self._mqtt_refresh_lock = asyncio.Lock()
        self._mqtt_file_list_check_lock = asyncio.Lock()
        self._mqtt_last_refresh = None
        self._printer_device_map = None
        mqtt_connect_mode = self.entry.options.get(CONF_MQTT_CONNECT_MODE)
        self._mqtt_connection_mode = (
            AnycubicMQTTConnectMode.Printing_Only
            if mqtt_connect_mode is None
            else mqtt_connect_mode
        )
        super().__init__(
            hass,
            LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=MQTT_SCAN_INTERVAL),
            always_update=False,
        )

    @property
    def anycubic_api(self) -> AnycubicAPI | None:
        return self._anycubic_api

    def _any_printers_are_printing(self):
        return any([
            printer.is_busy for printer_id, printer in self._anycubic_printers.items()
        ])

    def _any_printers_are_drying(self):
        return any([
            (
                printer.primary_drying_status_is_drying or
                printer.secondary_drying_status_is_drying
            ) for printer_id, printer in self._anycubic_printers.items()
        ])

    def _any_printers_are_online(self):
        return any([
            (
                printer.printer_online or printer.is_busy
            ) for printer_id, printer in self._anycubic_printers.items()
        ])

    def _no_printers_are_printing(self):
        return all([
            not printer.is_busy and
            (not printer.latest_project_print_in_progress)
            for printer_id, printer in self._anycubic_printers.items()
        ])

    def _check_mqtt_connection_last_action_waiting(self):
        if (
            self._mqtt_last_action is not None and
            int(time.time()) < self._mqtt_last_action + MQTT_ACTION_RESPONSE_ALIVE_SECONDS
        ):
            return True

        return False

    def _check_mqtt_connection_modes_active(self):
        if self._check_mqtt_connection_last_action_waiting():
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Printing_Only and
            self._any_printers_are_printing()
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Printing_Drying and
            (self._any_printers_are_printing() or self._any_printers_are_drying())
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Device_Online and
            self._any_printers_are_online()
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Always
        ):
            return True

        else:
            return False

    def _check_mqtt_connection_modes_inactive(self):
        if self._check_mqtt_connection_last_action_waiting():
            return False

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Printing_Only and
            self._no_printers_are_printing()
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Printing_Drying and
            (self._no_printers_are_printing() and not self._any_printers_are_drying())
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Device_Online and
            not self._any_printers_are_online()
        ):
            return True

        elif (
            self._mqtt_connection_mode == AnycubicMQTTConnectMode.Always
        ):
            return False

        else:
            return False

    def _build_printer_dict(self, printer) -> dict[str, Any]:

        primary_ace_spool_info = printer.primary_multi_color_box_spool_info_object
        secondary_ace_spool_info = printer.secondary_multi_color_box_spool_info_object

        file_list_local = printer.local_file_list_object
        file_list_udisk = printer.udisk_file_list_object
        file_list_cloud = self._cloud_file_list

        states = {
            "id": printer.id,
            "name": printer.name,
            "printer_online": printer.printer_online,
            "is_busy": printer.is_busy,
            "is_available": printer.is_available,
            "current_status": printer.current_status,
            "curr_nozzle_temp": printer.curr_nozzle_temp,
            "curr_hotbed_temp": printer.curr_hotbed_temp,
            "machine_mac": printer.machine_mac,
            "machine_name": printer.machine_name,
            "fw_version": printer.fw_version.firmware_version,
            "file_list_local": state_string_loaded(file_list_local),
            "file_list_udisk": state_string_loaded(file_list_udisk),
            "file_list_cloud": state_string_loaded(file_list_cloud),
            "supports_function_multi_color_box": printer.supports_function_multi_color_box,
            "connected_ace_units": printer.connected_ace_units,
            "multi_color_box_fw_version": printer.primary_multi_color_box_fw_firmware_version,
            "ace_spools": state_string_active(primary_ace_spool_info),
            "multi_color_box_runout_refill": printer.primary_multi_color_box_auto_feed,
            "ace_current_temperature": printer.primary_multi_color_box_current_temperature,
            "secondary_multi_color_box_fw_version": printer.secondary_multi_color_box_fw_firmware_version,
            "secondary_ace_spools": state_string_active(secondary_ace_spool_info),
            "secondary_multi_color_box_runout_refill": printer.secondary_multi_color_box_auto_feed,
            "secondary_ace_current_temperature": printer.secondary_multi_color_box_current_temperature,
            "dry_status_is_drying": printer.primary_drying_status_is_drying,
            "dry_status_target_temperature": printer.primary_drying_status_target_temperature,
            "dry_status_total_duration": printer.primary_drying_status_total_duration,
            "dry_status_remaining_time": printer.primary_drying_status_remaining_time,
            "secondary_dry_status_is_drying": printer.secondary_drying_status_is_drying,
            "secondary_dry_status_raw_status_code": printer.secondary_drying_status_raw_status_code,
            "secondary_dry_status_target_temperature": printer.secondary_drying_status_target_temperature,
            "secondary_dry_status_total_duration": printer.secondary_drying_status_total_duration,
            "secondary_dry_status_remaining_time": printer.secondary_drying_status_remaining_time,
            "job_name": printer.latest_project_name,
            "job_progress": printer.latest_project_progress_percentage,
            "job_time_elapsed": printer.latest_project_print_time_elapsed_minutes,
            "job_time_remaining": printer.latest_project_print_time_remaining_minutes,
            "job_in_progress": printer.latest_project_print_in_progress,
            "job_complete": printer.latest_project_print_complete,
            "job_failed": printer.latest_project_print_failed,
            "job_is_paused": printer.latest_project_print_is_paused,
            "job_image_url": printer.latest_project_image_url,
            "job_state": printer.latest_project_print_status,
            "job_eta": printer.latest_project_print_approximate_completion_time,
            "job_current_layer": printer.latest_project_print_current_layer,
            "job_total_layers": printer.latest_project_print_total_layers,
            "target_nozzle_temp": printer.latest_project_target_nozzle_temp,
            "target_hotbed_temp": printer.latest_project_target_hotbed_temp,
            "job_speed_mode": printer.latest_project_print_speed_mode_string,
            "print_speed_pct": printer.latest_project_print_speed_pct,
            "job_z_thick": printer.latest_project_z_thick,
            "fan_speed_pct": printer.latest_project_fan_speed_pct,
            "job_model_height": printer.latest_project_print_model_height,
            "job_anti_alias_count": printer.latest_project_print_anti_alias_count,
            "job_on_time": printer.latest_project_print_on_time,
            "job_off_time": printer.latest_project_print_off_time,
            "job_bottom_time": printer.latest_project_print_bottom_time,
            "job_bottom_layers": printer.latest_project_print_bottom_layers,
            "job_z_up_height": printer.latest_project_print_z_up_height,
            "job_z_up_speed": printer.latest_project_print_z_up_speed,
            "job_z_down_speed": printer.latest_project_print_z_down_speed,
            "manual_mqtt_connection_enabled": self._mqtt_manually_connected,
            "mqtt_connection_active": self._anycubic_api.mqtt_is_started,
        }

        attributes = {
            "ace_spools": {
                "spool_info": primary_ace_spool_info
            },
            "secondary_ace_spools": {
                "spool_info": secondary_ace_spool_info
            },
            "file_list_local": {
                "file_info": file_list_local,
            },
            "file_list_udisk": {
                "file_info": file_list_udisk,
            },
            "file_list_cloud": {
                "file_info": file_list_cloud,
            },
            "target_nozzle_temp": {
                "limit_min": printer.latest_project_temp_min_nozzle,
                "limit_max": printer.latest_project_temp_max_nozzle,
            },
            "target_hotbed_temp": {
                "limit_min": printer.latest_project_temp_min_hotbed,
                "limit_max": printer.latest_project_temp_max_hotbed,
            },
            "job_speed_mode": {
                "available_modes": printer.latest_project_available_print_speed_modes_data_object,
                "print_speed_mode_code": printer.latest_project_print_speed_mode,
            },
            "current_status": {
                "model": printer.model,
                "machine_type": printer.machine_type,
                "supported_functions": printer.supported_function_strings,
                "material_type": printer.material_type,
                "device_status_code": printer.device_status,
                "is_printing_code": printer.is_printing,
                "print_status_code": printer.latest_project_raw_print_status,
            },
            "dry_status_is_drying": {
                "dry_status_code": printer.primary_drying_status_raw_status_code,
            },
            "secondary_dry_status_is_drying": {
                "secondary_dry_status_code": printer.secondary_drying_status_raw_status_code,
            },
            "job_name": {
                "created_timestamp": printer.latest_project_created_timestamp,
                "finished_timestamp": printer.latest_project_finished_timestamp,
                "print_total_time": printer.latest_project_print_total_time,
            },
            "fw_version": {
                "latest_version": printer.fw_version.available_version,
                "in_progress": printer.fw_version.total_progress,
            },
            "multi_color_box_fw_version": {
                "latest_version": printer.primary_multi_color_box_fw_available_version,
                "in_progress": printer.primary_multi_color_box_fw_total_progress,
            },
            "secondary_multi_color_box_fw_version": {
                "latest_version": printer.secondary_multi_color_box_fw_available_version,
                "in_progress": printer.secondary_multi_color_box_fw_total_progress,
            },
        }

        for x in range(MAX_DRYING_PRESETS):
            num = x + 1
            preset_duration = self.entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
            preset_temperature = self.entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
            attributes[f"{ENTITY_ID_DRYING_START_PRESET_}{x + 1}"] = {
                "duration": preset_duration,
                "temperature": preset_temperature,
            }
            attributes[f"secondary_{ENTITY_ID_DRYING_START_PRESET_}{x + 1}"] = {
                "duration": preset_duration,
                "temperature": preset_temperature,
            }

        return {
            'states': states,
            'attributes': attributes,
        }

    def _build_coordinator_data(self):
        data_dict = dict()
        data_dict['printers'] = dict()

        for printer_id, printer in self._anycubic_printers.items():
            data_dict['printers'][printer_id] = self._build_printer_dict(printer)

        return data_dict

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        if not self._last_state_update or int(time.time()) > self._last_state_update + DEFAULT_SCAN_INTERVAL:
            await self.get_anycubic_updates()

        data_dict = self._build_coordinator_data()

        if self._printer_device_map is None:
            await self._register_printer_devices(data_dict)

        return data_dict

    async def _async_force_data_refresh(self):
        self.data = self._build_coordinator_data()
        self.last_update_success = True
        self.async_update_listeners()

    async def _async_print_job_started(self):
        self._last_state_update = int(time.time()) - DEFAULT_SCAN_INTERVAL + 25

    @callback
    def _mqtt_callback_data_updated(self):
        self.hass.create_task(
            self._async_force_data_refresh(),
            f"Anycubic coordinator {self.entry.entry_id} data refresh",
        )

    @callback
    def _mqtt_callback_print_job_started(
        self,
    ):
        self.hass.create_task(
            self._async_print_job_started(),
            f"Anycubic coordinator {self.entry.entry_id} print job started",
        )

    def _anycubic_mqtt_connection_should_start(self):

        return (
            not self._anycubic_api.mqtt_is_started and
            not self.hass.is_stopping and
            self.hass.state is CoreState.running and
            (
                self._check_mqtt_connection_modes_active() or
                self._mqtt_manually_connected
            )
        )

    def _anycubic_mqtt_connection_should_stop(self):

        return (
            self._anycubic_api.mqtt_is_started and
            (
                self.hass.is_stopping or
                (
                    self._anycubic_mqtt_connection_is_idle() and
                    not self._mqtt_manually_connected
                )
            )
        )

    def _anycubic_mqtt_connection_is_idle(self):
        if self._check_mqtt_connection_modes_inactive():
            if self._mqtt_idle_since is None:
                self._mqtt_idle_since = int(time.time())

            if int(time.time()) > self._mqtt_idle_since + MQTT_IDLE_DISCONNECT_SECONDS:
                self._mqtt_idle_since = None
                return True

        else:
            self._mqtt_idle_since = None

        return False

    async def _check_anycubic_mqtt_connection(self, refreshing=False):
        if not refreshing and self._mqtt_refresh_lock.locked():
            return

        async with self._mqtt_connect_check_lock:
            if self._anycubic_mqtt_connection_should_start():

                for printer_id, printer in self._anycubic_printers.items():
                    self._anycubic_api.mqtt_add_subscribed_printer(
                        printer
                    )

                if self._mqtt_task is None:
                    LOGGER.debug("Starting Anycubic MQTT Task.")
                    self._mqtt_task = self.hass.async_add_executor_job(
                        self._anycubic_api.connect_mqtt
                    )

            elif self._anycubic_mqtt_connection_should_stop():
                await self._stop_anycubic_mqtt_connection()

    async def _stop_anycubic_mqtt_connection(self):
        for printer_id, printer in self._anycubic_printers.items():
            await self.hass.async_add_executor_job(
                self._anycubic_api.mqtt_unsubscribe_printer_status,
                printer,
            )
        await self.hass.async_add_executor_job(
            self._anycubic_api.disconnect_mqtt,
        )

        await self._anycubic_api.mqtt_wait_for_disconnect()

        if self._mqtt_task is not None and not self._mqtt_task.done():
            self._mqtt_task.cancel()

        self._mqtt_task = None

    async def stop_anycubic_mqtt_connection_if_started(self):
        if self._anycubic_api and self._anycubic_api.mqtt_is_started:
            await self._stop_anycubic_mqtt_connection()

    async def refresh_anycubic_mqtt_connection(self):
        if self._mqtt_last_refresh and int(time.time()) < self._mqtt_last_refresh + MQTT_REFRESH_INTERVAL:
            return

        if self._mqtt_connect_check_lock.locked():
            return

        if self._anycubic_api and self._anycubic_api.mqtt_is_started:
            async with self._mqtt_refresh_lock:
                self._mqtt_last_refresh = int(time.time())
                await self._stop_anycubic_mqtt_connection()
                await asyncio.sleep(2)
                await self._check_anycubic_mqtt_connection(True)

    async def _async_check_local_file_list_changed(
        self,
        prev_file_list,
        printer,
    ):
        if self._mqtt_file_list_check_lock.locked():
            return

        async with self._mqtt_file_list_check_lock:
            if not printer.printer_online:
                return

            await asyncio.sleep(5)
            new_file_list = printer.local_file_list_object
            if prev_file_list is None and new_file_list is None:
                LOGGER.debug("Anycubic MQTT response for local file list appears to be empty, refreshing MQTT and retrying.")
                await self.refresh_anycubic_mqtt_connection()
                await self._anycubic_api.mqtt_wait_for_connect()
                await asyncio.sleep(2)
                await printer.request_local_file_list()

    async def _setup_anycubic_api_connection(self, start_up: bool = False):
        store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)

        try:
            config = await store.async_load()
            cookie_jar = CookieJar(unsafe=True)
            websession = async_create_clientsession(
                self.hass,
                cookie_jar=cookie_jar,
            )
            self._anycubic_api = AnycubicAPI(
                api_username=self.entry.data[CONF_USERNAME],
                api_password=self.entry.data[CONF_PASSWORD],
                session=websession,
                cookie_jar=cookie_jar,
                debug_logger=LOGGER,
                mqtt_callback_printer_update=self._mqtt_callback_data_updated,
                mqtt_callback_printer_busy=self._mqtt_callback_print_job_started,
            )

            self._anycubic_api.set_mqtt_log_all_messages(self.entry.options.get(CONF_DEBUG))

            if start_up and config is not None:
                LOGGER.debug("Loading tokens from store.")
                try:
                    self._anycubic_api.load_tokens_from_dict(config)
                except Exception as e:
                    LOGGER.debug(f"Error loading tokens from store: {e}")

            success = await self._anycubic_api.check_api_tokens()
            if not success:
                raise ConfigEntryAuthFailed("Authentication failed. Check credentials.")

            if start_up:
                # Create config
                await store.async_save(self._anycubic_api.build_token_dict())

            first_printer_id = self.entry.data[CONF_PRINTER_ID_LIST][0]

            printer_status = await self._anycubic_api.printer_info_for_id(first_printer_id)

            if printer_status is None:
                raise ConfigEntryAuthFailed("Printer not found. Check config.")

        except Exception as error:
            raise ConfigEntryAuthFailed(f"Authentication failed with unknown Error. Check credentials {error}")

    async def _setup_anycubic_printer_objects(self):
        for printer_id in self.entry.data[CONF_PRINTER_ID_LIST]:
            try:
                self._anycubic_printers[int(printer_id)] = await self._anycubic_api.printer_info_for_id(printer_id)
            except Exception as error:
                raise UpdateFailed(error) from error

    async def _register_printer_devices(self, data_dict):
        self._printer_device_map = dict()
        dev_reg = async_get_device_registry(self.hass)
        for printer_id in self.entry.data[CONF_PRINTER_ID_LIST]:
            printer_device_info: DeviceInfo = build_printer_device_info(self.entry.data, data_dict, printer_id)
            printer_device = dev_reg.async_get_or_create(config_entry_id=self.entry.entry_id, **printer_device_info)
            self._printer_device_map[printer_device.id] = printer_id

    async def _check_or_save_tokens(self):
        await self._anycubic_api.check_api_tokens()

        if self._anycubic_api.tokens_changed:
            store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)
            await store.async_save(self._anycubic_api.build_token_dict())

    async def _connect_mqtt_for_action_response(self):
        self._mqtt_last_action = int(time.time())
        await self._check_anycubic_mqtt_connection()
        if not await self._anycubic_api.mqtt_wait_for_connect():
            raise HomeAssistantError(
                "Anycubic MQTT Timed out waiting for connection, try manually enabling MQTT."
            )

    async def get_anycubic_updates(self, start_up: bool = False) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        if self._failed_updates >= MAX_FAILED_UPDATES:
            self._last_state_update = int(time.time()) + FAILED_UPDATE_DELAY
            self._failed_updates = 0
            return

        self._last_state_update = int(time.time())

        if self._anycubic_api is None:
            await self._setup_anycubic_api_connection(start_up=start_up)

        if len(self._anycubic_printers) < 1:
            await self._setup_anycubic_printer_objects()

        try:
            await self._check_or_save_tokens()

            for printer_id, printer in self._anycubic_printers.items():
                await printer.update_info_from_api(True)

            self._failed_updates = 0

            await self._check_anycubic_mqtt_connection()

        except AnycubicAPIParsingError as error:
            # self._anycubic_api.clear_all_tokens()
            self._failed_updates += 1
            raise UpdateFailed(error) from error

        except AnycubicAPIError as error:
            self._failed_updates += 1
            raise UpdateFailed(error) from error

        except Exception as error:
            tb = traceback.format_exc()
            LOGGER.debug(f"Anycubic update error: {error}\n{tb}")
            self._failed_updates += 1
            raise UpdateFailed(error) from error

        self._last_state_update = int(time.time())

        return True

    def get_printer_for_id(self, printer_id):
        if printer_id is None or len(str(printer_id)) == 0:
            return None

        return self._anycubic_printers.get(int(printer_id))

    def get_printer_for_device_id(self, device_id):
        if self._printer_device_map is None:
            return None

        if device_id is None or len(str(device_id)) == 0:
            return None

        printer_id = self._printer_device_map.get(device_id)

        if not printer_id:
            return None

        return self._anycubic_printers.get(int(printer_id))

    async def refresh_cloud_files(self):
        self._cloud_file_list = await self.anycubic_api.get_user_cloud_files_data_object()

    async def force_state_update(self):
        self._last_state_update = None
        await self.async_refresh()
        self._last_state_update = int(time.time()) - DEFAULT_SCAN_INTERVAL + 10

    async def button_press_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        try:

            if printer and (
                event_key.startswith(ENTITY_ID_DRYING_START_PRESET_) or
                event_key.startswith(f"secondary_{ENTITY_ID_DRYING_START_PRESET_}")
            ):
                num = event_key[-1]
                preset_duration = self.entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
                preset_temperature = self.entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
                if preset_duration is None or preset_temperature is None:
                    return

                if event_key.startswith(f"secondary_{ENTITY_ID_DRYING_START_PRESET_}"):
                    box_id = 1
                else:
                    box_id = 0

                await self._connect_mqtt_for_action_response()
                await printer.multi_color_box_drying_start(
                    duration=preset_duration,
                    target_temp=preset_temperature,
                    box_id=box_id,
                )

            elif printer and event_key == 'refresh_mqtt_connection':
                await self.refresh_anycubic_mqtt_connection()

            elif printer and event_key == 'request_file_list_cloud':
                await self._connect_mqtt_for_action_response()
                await self.refresh_cloud_files()

            elif printer and event_key == 'request_file_list_local':
                prev_file_list = printer.local_file_list_object
                await self._connect_mqtt_for_action_response()
                await printer.request_local_file_list()
                self.hass.create_task(
                    self._async_check_local_file_list_changed(prev_file_list, printer),
                    f"Anycubic coordinator {self.entry.entry_id} {printer.id} local file list check",
                )

            elif printer and event_key == 'request_file_list_udisk':
                await self._connect_mqtt_for_action_response()
                await printer.request_udisk_file_list()

            elif printer and event_key == 'drying_stop':
                await self._connect_mqtt_for_action_response()
                await printer.multi_color_box_drying_stop()

            elif printer and event_key == 'secondary_drying_stop':
                await self._connect_mqtt_for_action_response()
                await printer.multi_color_box_drying_stop(box_id=1)

            elif printer and event_key == 'pause_print':
                await self._connect_mqtt_for_action_response()
                await printer.pause_print()

            elif printer and event_key == 'resume_print':
                await self._connect_mqtt_for_action_response()
                await printer.resume_print()

            elif printer and event_key == 'cancel_print':
                await self._connect_mqtt_for_action_response()
                await printer.cancel_print()

            # elif printer and event_key == 'toggle_auto_feed':
            #     await printer.multi_color_box_toggle_auto_feed()

            # elif event_key == 'toggle_mqtt_connection':
            #     self._mqtt_manually_connected = not self._mqtt_manually_connected

            else:
                return

            await self.force_state_update()

        except AnycubicAPIError as ex:
            raise HomeAssistantError(ex) from ex

    async def fw_update_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        try:

            if printer and event_key == 'fw_version':
                await self._connect_mqtt_for_action_response()
                await printer.update_printer_firmware()

            elif printer and event_key == 'multi_color_box_fw_version':
                await self._connect_mqtt_for_action_response()
                await printer.update_printer_multi_color_box_firmware()

            elif printer and event_key == 'secondary_multi_color_box_fw_version':
                await self._connect_mqtt_for_action_response()
                await printer.update_printer_multi_color_box_firmware(box_id=1)

            else:
                return

            await self.force_state_update()

        except AnycubicAPIError as ex:
            raise HomeAssistantError(ex) from ex

    async def switch_on_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        if event_key == 'manual_mqtt_connection_enabled':
            self._mqtt_manually_connected = True

        elif printer and event_key == 'multi_color_box_runout_refill':
            await self._connect_mqtt_for_action_response()
            await printer.multi_color_box_switch_on_auto_feed()

        elif printer and event_key == 'secondary_multi_color_box_runout_refill':
            await self._connect_mqtt_for_action_response()
            await printer.multi_color_box_switch_on_auto_feed(box_id=1)

        else:
            return

        await self.force_state_update()

    async def switch_off_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        if event_key == 'manual_mqtt_connection_enabled':
            self._mqtt_manually_connected = False

        elif printer and event_key == 'multi_color_box_runout_refill':
            await self._connect_mqtt_for_action_response()
            await printer.multi_color_box_switch_off_auto_feed()

        elif printer and event_key == 'secondary_multi_color_box_runout_refill':
            await self._connect_mqtt_for_action_response()
            await printer.multi_color_box_switch_off_auto_feed(box_id=1)

        else:
            return

        await self.force_state_update()
