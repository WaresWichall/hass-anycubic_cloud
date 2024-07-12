"""DataUpdateCoordinator for the Anycubic Cloud integration."""
from __future__ import annotations

from datetime import timedelta
from typing import Any
import time

from aiohttp import CookieJar

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import CoreState, HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, HomeAssistantError
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .anycubic_api_base import AnycubicAPIError
from .anycubic_api_mqtt import AnycubicMQTTAPI as AnycubicAPI

from .const import (
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    CONF_PRINTER_ID_LIST,
    DEFAULT_SCAN_INTERVAL,
    FAILED_UPDATE_DELAY,
    MAX_FAILED_UPDATES,
    MQTT_IDLE_DISCONNECT_SECONDS,
    MQTT_SCAN_INTERVAL,
    DOMAIN,
    LOGGER,
    STORAGE_KEY,
    STORAGE_VERSION,
)


class AnycubicCloudDataUpdateCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """AnycubicCloud Data Update Coordinator."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize AnycubicCloud."""
        self.entry = entry
        self._anycubic_api: AnycubicAPI | None = None
        self._anycubic_printers = dict()
        self._last_state_update = None
        self._failed_updates = 0
        self._mqtt_task = None
        self._mqtt_manually_connected = False
        self._mqtt_idle_since = None
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
            printer.is_printing == 2 for printer_id, printer in self._anycubic_printers.items()
        ])

    def _no_printers_are_printing(self):
        return all([
            printer.is_printing != 2 and
            (printer.latest_project is None or not printer.latest_project.print_in_progress)
            for printer_id, printer in self._anycubic_printers.items()
        ])

    def _build_printer_dict(self, printer) -> dict[str, Any]:

        latest_project = printer.latest_project

        return {
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
            "fw_update_available": printer.fw_version.update_available,
            "fw_update_progress": printer.fw_version.update_progress,
            "fw_download_progress": printer.fw_version.download_progress,
            "fw_available_version": printer.fw_version.available_version,
            "fw_is_updating": printer.fw_version.is_updating,
            "fw_is_downloading": printer.fw_version.is_downloading,
            "file_list_local": printer.local_file_list_object,
            "supports_function_multi_color_box": printer.supports_function_multi_color_box,
            "multi_color_box_fw_version": (
                printer.multi_color_box_fw_version[0].firmware_version
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_update_available": (
                printer.multi_color_box_fw_version[0].update_available
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_update_progress": (
                printer.multi_color_box_fw_version[0].update_progress
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_download_progress": (
                printer.multi_color_box_fw_version[0].download_progress
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_available_version": (
                printer.multi_color_box_fw_version[0].available_version
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_is_updating": (
                printer.multi_color_box_fw_version[0].is_updating
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_fw_is_downloading": (
                printer.multi_color_box_fw_version[0].is_downloading
                if printer.multi_color_box_fw_version and len(
                    printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_spools": (
                printer.primary_multi_color_box.spool_info_object
                if printer.primary_multi_color_box
                else None
            ),
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
            "raw_print_status": latest_project.raw_print_status if latest_project else None,
            "manual_mqtt_connection_enabled": self._mqtt_manually_connected,
        }

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        if not self._last_state_update or int(time.time()) > self._last_state_update + DEFAULT_SCAN_INTERVAL:
            await self.get_anycubic_updates()

        data_dict = dict()

        for printer_id, printer in self._anycubic_printers.items():
            data_dict[printer_id] = self._build_printer_dict(printer)

        return data_dict

    def _anycubic_mqtt_connection_should_start(self):

        return (
            not self._anycubic_api.mqtt_is_started and
            not self.hass.is_stopping and
            self.hass.state is CoreState.running and
            (
                self._any_printers_are_printing() or
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
        if self._no_printers_are_printing():
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
                debug_logger=LOGGER.debug,
            )

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

    async def _setup_anycubic_printer_object(self):
        for printer_id in self.entry.data[CONF_PRINTER_ID_LIST]:
            try:
                self._anycubic_printers[int(printer_id)] = await self._anycubic_api.printer_info_for_id(printer_id)
            except Exception as error:
                raise UpdateFailed from error

    async def _check_or_save_tokens(self):
        await self._anycubic_api.check_api_tokens()

        if self._anycubic_api.tokens_changed:
            store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)
            await store.async_save(self._anycubic_api.build_token_dict())

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
            await self._setup_anycubic_printer_object()

        try:
            await self._check_or_save_tokens()

            for printer_id, printer in self._anycubic_printers.items():
                await printer.update_info_from_api(True)

            self._failed_updates = 0

            await self._check_anycubic_mqtt_connection()

        except Exception as error:
            LOGGER.debug(f"Anycubic update error: {error}")
            self._failed_updates += 1
            raise UpdateFailed from error

        return True

    def get_printer_for_id(self, printer_id):
        if printer_id is None or len(str(printer_id)) == 0:
            return None

        return self._anycubic_printers.get(int(printer_id))

    async def button_press_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        try:

            if printer and event_key.startswith('drying_start_preset_'):
                num = event_key[-1]
                preset_duration = self.entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
                preset_temperature = self.entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
                if preset_duration is None or preset_temperature is None:
                    return

                await printer.multi_color_box_drying_start(
                    duration=preset_duration,
                    target_temp=preset_temperature,
                )

            elif printer and event_key == 'request_file_list_local':
                await printer.request_local_file_list()

            elif printer and event_key == 'drying_stop':
                await printer.multi_color_box_drying_stop()

            elif printer and event_key == 'pause_print':
                await printer.pause_print()

            elif printer and event_key == 'resume_print':
                await printer.resume_print()

            elif printer and event_key == 'cancel_print':
                await printer.cancel_print()

            elif printer and event_key == 'update_printer_firmware':
                if not self._mqtt_manually_connected:
                    raise HomeAssistantError('Anycubic MQTT must be connected for printer firmware updates.')

                await printer.update_printer_firmware()

            elif printer and event_key == 'update_multi_color_box_firmware':
                if not self._mqtt_manually_connected:
                    raise HomeAssistantError('Anycubic MQTT must be connected for ACE firmware updates.')

                await printer.update_printer_all_multi_color_box_firmware()

            # elif printer and event_key == 'toggle_auto_feed':
            #     await printer.multi_color_box_toggle_auto_feed()

            # elif event_key == 'toggle_mqtt_connection':
            #     self._mqtt_manually_connected = not self._mqtt_manually_connected

            else:
                return

            self._last_state_update = None
            await self.async_refresh()
            self._last_state_update = int(time.time()) - DEFAULT_SCAN_INTERVAL + 10
        except AnycubicAPIError as ex:
            raise HomeAssistantError(ex) from ex

    async def switch_on_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        if event_key == 'manual_mqtt_connection_enabled':
            self._mqtt_manually_connected = True

        elif printer and event_key == 'multi_color_box_runout_refill':
            await printer.multi_color_box_switch_on_auto_feed()

        else:
            return

        self._last_state_update = None
        await self.async_refresh()
        self._last_state_update = int(time.time()) - DEFAULT_SCAN_INTERVAL + 10

    async def switch_off_event(self, printer_id, event_key):
        printer = self.get_printer_for_id(printer_id)

        if event_key == 'manual_mqtt_connection_enabled':
            self._mqtt_manually_connected = False

        elif printer and event_key == 'multi_color_box_runout_refill':
            await printer.multi_color_box_switch_off_auto_feed()

        else:
            return

        self._last_state_update = None
        await self.async_refresh()
        self._last_state_update = int(time.time()) - DEFAULT_SCAN_INTERVAL + 10
