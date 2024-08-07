"""DataUpdateCoordinator for the Anycubic Cloud integration."""
from __future__ import annotations

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
    FAILED_UPDATE_DELAY,
    MAX_FAILED_UPDATES,
    MQTT_ACTION_RESPONSE_ALIVE_SECONDS,
    MQTT_IDLE_DISCONNECT_SECONDS,
    MQTT_SCAN_INTERVAL,
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
                printer.primary_drying_status is not None and
                printer.primary_drying_status.is_drying
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
            (printer.latest_project is None or not printer.latest_project.print_in_progress)
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

        latest_project = printer.latest_project

        multi_color_box_spool_info = (
            printer.primary_multi_color_box.spool_info_object
            if printer.primary_multi_color_box
            else None
        )

        file_list_local = printer.local_file_list_object
        file_list_udisk = printer.udisk_file_list_object
        file_list_cloud = self._cloud_file_list

        states = {
            "id": printer.id,
            "name": printer.name,
            "device_status": printer.device_status,
            "printer_online": printer.printer_online,
            "is_printing": printer.is_printing,
            "is_busy": printer.is_busy,
            "is_available": printer.is_available,
            "current_status": printer.current_status,
            "curr_nozzle_temp": printer.parameter.curr_nozzle_temp,
            "curr_hotbed_temp": printer.parameter.curr_hotbed_temp,
            "machine_mac": printer.machine_mac,
            "machine_name": printer.machine_name,
            "fw_version": printer.fw_version.firmware_version,
            "file_list_local": state_string_loaded(file_list_local),
            "file_list_udisk": state_string_loaded(file_list_udisk),
            "file_list_cloud": state_string_loaded(file_list_cloud),
            "supports_function_multi_color_box": printer.supports_function_multi_color_box,
            "multi_color_box_fw_version": (
                printer.multi_color_box_fw_version[0].firmware_version
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_spools": state_string_active(multi_color_box_spool_info),
            "multi_color_box_runout_refill": (
                printer.primary_multi_color_box.auto_feed
                if printer.primary_multi_color_box
                else None
            ),
            "multi_color_box_current_temperature": (
                printer.primary_multi_color_box.current_temperature
                if printer.primary_multi_color_box
                else 0
            ),
            "dry_status_is_drying": (
                printer.primary_drying_status.is_drying
                if printer.primary_drying_status
                else None
            ),
            "dry_status_raw_status_code": (
                printer.primary_drying_status.raw_status_code
                if printer.primary_drying_status
                else None
            ),
            "dry_status_target_temperature": (
                printer.primary_drying_status.target_temperature
                if printer.primary_drying_status
                else 0
            ),
            "dry_status_total_duration": (
                printer.primary_drying_status.total_duration
                if printer.primary_drying_status
                else None
            ),
            "dry_status_remaining_time": (
                printer.primary_drying_status.remaining_time
                if printer.primary_drying_status
                else None
            ),
            "current_project_name": latest_project.name if latest_project else None,
            "current_project_progress": latest_project.progress_percentage if latest_project else None,
            "current_project_created_timestamp": latest_project.created_timestamp if latest_project else None,
            "current_project_finished_timestamp": latest_project.finished_timestamp if latest_project else None,
            "current_project_time_elapsed": latest_project.print_time_elapsed_minutes if latest_project else None,
            "current_project_time_remaining": latest_project.print_time_remaining_minutes if latest_project else None,
            "current_project_print_total_time": latest_project.print_total_time if latest_project else None,
            "current_project_in_progress": latest_project.print_in_progress if latest_project else None,
            "current_project_complete": latest_project.print_complete if latest_project else None,
            "current_project_failed": latest_project.print_failed if latest_project else None,
            "current_project_is_paused": latest_project.print_is_paused if latest_project else None,
            "print_state": latest_project.print_status if latest_project else None,
            "print_approximate_completion_time": (
                latest_project.print_approximate_completion_time if latest_project else None),
            "print_current_layer": latest_project.print_current_layer if latest_project else None,
            "print_total_layers": latest_project.print_total_layers if latest_project else None,
            "target_nozzle_temp": latest_project.target_nozzle_temp if latest_project else None,
            "target_hotbed_temp": latest_project.target_hotbed_temp if latest_project else None,
            "print_speed_mode": latest_project.print_speed_mode if latest_project else None,
            "print_speed_pct": latest_project.print_speed_pct if latest_project else None,
            "print_z_thick": latest_project.z_thick if latest_project else None,
            "fan_speed_pct": latest_project.fan_speed_pct if latest_project else None,
            "raw_print_status": latest_project.raw_print_status if latest_project else None,
            "manual_mqtt_connection_enabled": self._mqtt_manually_connected,
            "mqtt_connection_active": self._anycubic_api.mqtt_is_started,
        }

        attributes = {
            "multi_color_box_spools": {
                "spool_info": multi_color_box_spool_info
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
                "limit_min": latest_project.temp_min_nozzle if latest_project else None,
                "limit_max": latest_project.temp_max_nozzle if latest_project else None,
            },
            "target_hotbed_temp": {
                "limit_min": latest_project.temp_min_hotbed if latest_project else None,
                "limit_max": latest_project.temp_max_hotbed if latest_project else None,
            },
            "print_speed_mode": {
                "available_modes": latest_project.available_print_speed_modes_data_object if latest_project else None,
            },
            "current_status": {
                "model": printer.model,
                "machine_type": printer.machine_type,
                "supported_functions": printer.supported_function_strings,
            },
            "fw_version": {
                "latest_version": printer.fw_version.available_version,
                "in_progress": printer.fw_version.total_progress,
            },
            "multi_color_box_fw_version": {
                "latest_version": (
                    printer.multi_color_box_fw_version[0].available_version
                    if printer.multi_color_box_fw_version and len(
                        printer.multi_color_box_fw_version
                    ) > 0
                    else None
                ),
                "in_progress": (
                    printer.multi_color_box_fw_version[0].total_progress
                    if printer.multi_color_box_fw_version and len(
                        printer.multi_color_box_fw_version
                    ) > 0
                    else None
                ),
            },
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
        self.async_set_updated_data(self._build_coordinator_data())

    @callback
    def _mqtt_callback_data_updated(self):
        self.hass.create_task(
            self._async_force_data_refresh(),
            f"Anycubic coordinator {self.entry.entry_id} data refresh",
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

    async def _check_anycubic_mqtt_connection(self):
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
                mqtt_callback_printer_update=self._mqtt_callback_data_updated
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

            if printer and event_key.startswith('drying_start_preset_'):
                num = event_key[-1]
                preset_duration = self.entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
                preset_temperature = self.entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
                if preset_duration is None or preset_temperature is None:
                    return

                await self._connect_mqtt_for_action_response()
                await printer.multi_color_box_drying_start(
                    duration=preset_duration,
                    target_temp=preset_temperature,
                )

            elif printer and event_key == 'request_file_list_cloud':
                await self._connect_mqtt_for_action_response()
                await self.refresh_cloud_files()

            elif printer and event_key == 'request_file_list_local':
                await self._connect_mqtt_for_action_response()
                await printer.request_local_file_list()

            elif printer and event_key == 'request_file_list_udisk':
                await self._connect_mqtt_for_action_response()
                await printer.request_udisk_file_list()

            elif printer and event_key == 'drying_stop':
                await self._connect_mqtt_for_action_response()
                await printer.multi_color_box_drying_stop()

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
                await printer.update_printer_all_multi_color_box_firmware()

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

        else:
            return

        await self.force_state_update()
