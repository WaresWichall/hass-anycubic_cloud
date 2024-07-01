"""DataUpdateCoordinator for the Anycubic Cloud integration."""
from __future__ import annotations

from datetime import timedelta
from typing import Any
import time

from aiohttp import CookieJar

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .anycubic_api_mqtt import AnycubicMQTTAPI as AnycubicAPI

from .const import (
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    CONF_PRINTER_ID,
    DEFAULT_SCAN_INTERVAL,
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
        self.anycubic_api: AnycubicAPI | None = None
        self.anycubic_printer = None
        self._last_state_update = None
        super().__init__(
            hass,
            LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=MQTT_SCAN_INTERVAL),
            always_update=False,
        )

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        if not self._last_state_update or int(time.time()) > self._last_state_update + DEFAULT_SCAN_INTERVAL:
            await self.get_anycubic_updates()

        latest_project = self.anycubic_printer.latest_project

        return {
            "id": self.anycubic_printer.id,
            "name": self.anycubic_printer.name,
            "device_status": self.anycubic_printer.device_status,
            "printer_online": self.anycubic_printer.printer_online,
            "is_printing": self.anycubic_printer.is_printing,
            "current_status": self.anycubic_printer.current_status,
            "curr_nozzle_temp": self.anycubic_printer.parameter.curr_nozzle_temp,
            "curr_hotbed_temp": self.anycubic_printer.parameter.curr_hotbed_temp,
            "machine_mac": self.anycubic_printer.machine_mac,
            "machine_name": self.anycubic_printer.machine_name,
            "fw_version": self.anycubic_printer.fw_version.firmware_version,
            "multi_color_box_fw_version": (
                self.anycubic_printer.multi_color_box_fw_version[0].firmware_version
                if self.anycubic_printer.multi_color_box_fw_version and len(
                    self.anycubic_printer.multi_color_box_fw_version
                ) > 0
                else None
            ),
            "multi_color_box_spools": (
                self.anycubic_printer.primary_multi_color_box.spool_info_object
                if self.anycubic_printer.primary_multi_color_box
                else None
            ),
            "multi_color_box_auto_feed": (
                self.anycubic_printer.primary_multi_color_box.auto_feed
                if self.anycubic_printer.primary_multi_color_box
                else None
            ),
            "dry_status_is_drying": (
                self.anycubic_printer.drying_status.is_drying
                if self.anycubic_printer.drying_status
                else None
            ),
            "dry_status_raw_status_code": (
                self.anycubic_printer.drying_status.raw_status_code
                if self.anycubic_printer.drying_status
                else None
            ),
            "dry_status_target_temperature": (
                self.anycubic_printer.drying_status.target_temperature
                if self.anycubic_printer.drying_status
                else None
            ),
            "dry_status_total_duration": (
                self.anycubic_printer.drying_status.total_duration
                if self.anycubic_printer.drying_status
                else None
            ),
            "dry_status_remaining_time": (
                self.anycubic_printer.drying_status.remaining_time
                if self.anycubic_printer.drying_status
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
        }

    async def get_anycubic_updates(self, start_up: bool = False) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        self._last_state_update = int(time.time())

        if self.anycubic_api is None:
            store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)

            try:
                config = await store.async_load()
                cookie_jar = CookieJar(unsafe=True)
                websession = async_create_clientsession(
                    self.hass,
                    cookie_jar=cookie_jar,
                )
                self.anycubic_api = AnycubicAPI(
                    api_username=self.entry.data[CONF_USERNAME],
                    api_password=self.entry.data[CONF_PASSWORD],
                    session=websession,
                    cookie_jar=cookie_jar,
                    debug_logger=LOGGER.debug,
                )

                if start_up and config is not None:
                    LOGGER.debug("Loading tokens from store.")
                    try:
                        self.anycubic_api.load_tokens_from_dict(config)
                    except Exception as e:
                        LOGGER.debug(f"Error loading tokens from store: {e}")

                success = await self.anycubic_api.check_api_tokens()
                if not success:
                    raise ConfigEntryAuthFailed("Authentication failed. Check credentials.")

                if start_up:
                    # Create config
                    await store.async_save(self.anycubic_api.build_token_dict())

                printer_status = await self.anycubic_api.printer_info_for_id(self.entry.data[CONF_PRINTER_ID])

                if printer_status is None:
                    raise ConfigEntryAuthFailed("Printer not found. Check config.")

            except Exception as error:
                raise ConfigEntryAuthFailed(f"Authentication failed with unknown Error. Check credentials {error}")

        if self.anycubic_printer is None:
            try:
                self.anycubic_printer = await self.anycubic_api.printer_info_for_id(self.entry.data[CONF_PRINTER_ID])
            except Exception as error:
                raise UpdateFailed from error

        try:
            await self.anycubic_api.check_api_tokens()

            if self.anycubic_api.tokens_changed:
                store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)
                await store.async_save(self.anycubic_api.build_token_dict())

            await self.anycubic_printer.update_info_from_api(True)
            if (
                not self.anycubic_api.mqtt_is_connected and
                self.anycubic_printer.is_printing == 2 and
                not self.hass.is_stopping
            ):
                self.entry.async_create_background_task(
                    self.hass,
                    self.anycubic_api.async_connect_mqtt(),
                    "anycubic_cloud.mqtt_connection",
                )
                await self.anycubic_api.mqtt_subscribe_printer_status(self.anycubic_printer)
            elif (
                self.anycubic_api.mqtt_is_connected and
                (self.anycubic_printer.is_printing != 2 or self.hass.is_stopping)
            ):
                await self.anycubic_api.mqtt_unsubscribe_printer_status(self.anycubic_printer)
                await self.anycubic_api.async_disconnect_mqtt()

        except Exception as error:
            raise UpdateFailed from error

        return True

    async def button_press_event(self, event_key):
        if self.anycubic_printer is None:
            return

        if event_key.startswith('drying_start_preset_'):
            num = event_key[-1]
            preset_duration = self.entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
            preset_temperature = self.entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
            if preset_duration is None or preset_temperature is None:
                return

            await self.anycubic_printer.multi_color_box_drying_start(
                duration=preset_duration,
                target_temp=preset_temperature,
            )

        elif event_key == 'drying_stop':
            await self.anycubic_printer.multi_color_box_drying_stop()

        elif event_key == 'cancel_print':
            await self.anycubic_printer.cancel_print()

        elif event_key == 'toggle_auto_feed':
            await self.anycubic_printer.multi_color_box_toggle_auto_feed()

        else:
            return

        self._last_state_update = None
        await self.async_refresh()
