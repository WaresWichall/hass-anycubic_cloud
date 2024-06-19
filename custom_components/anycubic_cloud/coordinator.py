"""DataUpdateCoordinator for the Anycubic Cloud integration."""
from __future__ import annotations

from datetime import timedelta
from typing import Any

from aiohttp import CookieJar

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

from .anycubic_api import AnycubicAPI

from .const import (
    CONF_PRINTER_ID,
    DEFAULT_SCAN_INTERVAL,
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
        self.latest_project = None
        super().__init__(
            hass,
            LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=DEFAULT_SCAN_INTERVAL),
            always_update=False,
        )

    async def _async_update_data(self) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

        await self.get_anycubic_updates()

        return {
            "id": self.anycubic_printer.id,
            "name": self.anycubic_printer.name,
            "device_status": self.anycubic_printer.device_status,
            "printer_online": self.anycubic_printer.printer_online,
            "is_printing": self.anycubic_printer.is_printing,
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
                self.anycubic_printer.multi_color_box.spool_info_object
                if self.anycubic_printer.multi_color_box
                else None
            ),
            "current_project_name": self.latest_project.name if self.latest_project else None,
            "current_project_progress": self.latest_project.progress_percentage if self.latest_project else None,
            "current_project_created_timestamp": self.latest_project.created_timestamp if self.latest_project else None,
            "current_project_time_elapsed": self.latest_project.print_time_elapsed_minutes if self.latest_project else None,
            "current_project_time_remaining": self.latest_project.print_time_remaining_minutes if self.latest_project else None,
            "current_project_print_total_time": self.latest_project.print_total_time if self.latest_project else None,
            "current_project_in_progress": self.latest_project.print_in_progress if self.latest_project else None,
            "current_project_complete": self.latest_project.print_complete if self.latest_project else None,
            "current_project_failed": self.latest_project.print_failed if self.latest_project else None,
            "current_project_is_paused": self.latest_project.print_is_paused if self.latest_project else None,
            "print_state": self.latest_project.print_status if self.latest_project else None,
            "print_approximate_completion_time": (
                self.latest_project.print_approximate_completion_time if self.latest_project else None),
            "print_current_layer": self.latest_project.print_current_layer if self.latest_project else None,
            "print_total_layers": self.latest_project.print_total_layers if self.latest_project else None,
            "target_nozzle_temp": self.latest_project.target_nozzle_temp if self.latest_project else None,
            "target_hotbed_temp": self.latest_project.target_hotbed_temp if self.latest_project else None,
            "raw_print_status": self.latest_project.raw_print_status if self.latest_project else None,
        }

    async def get_anycubic_updates(self, fresh_install: bool = False) -> dict[str, Any]:
        """Fetch data from AnycubicCloud."""

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

                if not fresh_install and config:
                    try:
                        self.anycubic_api.load_tokens_from_dict(config)
                    except Exception:
                        pass

                success = await self.anycubic_api.check_api_tokens()
                if not success:
                    raise ConfigEntryAuthFailed("Authentication failed. Check credentials.")

                if fresh_install or not config:
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

            await self.anycubic_printer.update_info_from_api()
            self.latest_project = await self.anycubic_api.get_latest_project()

        except Exception as error:
            raise UpdateFailed from error

        return True
