"""Adds config flow for Anycubic Cloud integration."""
from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from aiohttp import CookieJar
import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, OptionsFlow
from homeassistant.const import CONF_PASSWORD, CONF_USERNAME
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.storage import Store
import homeassistant.helpers.config_validation as cv

from .anycubic_cloud_api.anycubic_api_mqtt import AnycubicMQTTAPI as AnycubicAPI

from .const import (
    CONF_DEBUG,
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    CONF_MQTT_CONNECT_MODE,
    CONF_PRINTER_ID_LIST,
    DOMAIN,
    LOGGER,
    MAX_DRYING_PRESETS,
    STORAGE_KEY,
    STORAGE_VERSION,
)

from .helpers import (
    AnycubicMQTTConnectMode,
)

DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_USERNAME): cv.string,
        vol.Required(CONF_PASSWORD): cv.string,
    }
)

DATA_SCHEMA_AUTH = vol.Schema(
    {
        vol.Required(CONF_USERNAME): cv.string,
        vol.Required(CONF_PASSWORD): cv.string,
    }
)

MQTT_CONNECT_MODES = {
    AnycubicMQTTConnectMode.Printing_Only: "Printing Only",
    AnycubicMQTTConnectMode.Printing_Drying: "Printing & Drying",
    AnycubicMQTTConnectMode.Device_Online: "Device Online",
    AnycubicMQTTConnectMode.Always: "Always",
}


class AnycubicCloudConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AnycubicCloud integration."""

    VERSION = 1

    entry: ConfigEntry | None

    def __init__(self) -> None:
        """Initialize."""
        self._password: str | None = None
        self._username: str | None = None
        self._is_reconfigure: bool = False
        self._anycubic_api: AnycubicAPI | None = None
        self.entry: ConfigEntry | None = None

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> AnycubicCloudOptionsFlowHandler:
        """Get the options flow for this handler."""
        return AnycubicCloudOptionsFlowHandler(config_entry)

    async def async_step_reauth(self, entry_data: Mapping[str, Any]) -> FlowResult:
        """Handle initiation of re-authentication with AnycubicCloud."""
        self.entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
        return await self.async_step_reauth_confirm()

    def _async_create_anycubic_api(self):
        cookie_jar = CookieJar(unsafe=True)
        websession = async_create_clientsession(
            self.hass,
            cookie_jar=cookie_jar,
        )
        return AnycubicAPI(
            api_username=self._username,
            api_password=self._password,
            session=websession,
            cookie_jar=cookie_jar,
            debug_logger=LOGGER,
        )

    async def _async_check_anycubic_api_instance_exists(self):
        if self._anycubic_api is not None:
            return

        self._anycubic_api = self._async_create_anycubic_api()

        if not self.entry:
            return

        store = Store[dict[str, Any]](self.hass, STORAGE_VERSION, STORAGE_KEY)
        config = await store.async_load()

        if config:
            self._anycubic_api.load_tokens_from_dict(config)

    async def _async_check_login_errors(self):
        success = await self._anycubic_api.check_api_tokens()
        if not success:
            LOGGER.error("Authentication failed. Check credentials.")
            return {"base": "invalid_auth"}

        return {}

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Dialog that informs the user that reauth is required."""
        errors = {}

        if user_input is not None:
            self._username = user_input[CONF_USERNAME]
            self._password = user_input[CONF_PASSWORD]

            try:
                await self._async_check_anycubic_api_instance_exists()
                errors = await self._async_check_login_errors()

            except Exception as error:
                LOGGER.error("Authentication failed with unknown Error. Check credentials %s", error)
                errors = {"base": "cannot_connect"}

            if not errors:
                if self.entry:
                    self.hass.config_entries.async_update_entry(
                        self.entry,
                        data={
                            **self.entry.data,
                            CONF_USERNAME: self._username,
                            CONF_PASSWORD: self._password,
                        },
                    )
                    return await self.async_step_printer()

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=DATA_SCHEMA_AUTH,
            errors=errors,
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            self._username = user_input[CONF_USERNAME]
            self._password = user_input[CONF_PASSWORD]

            try:
                await self._async_check_anycubic_api_instance_exists()
                errors = await self._async_check_login_errors()

            except Exception as error:
                LOGGER.error("Authentication failed with unknown Error. Check credentials %s", error)
                errors = {"base": "cannot_connect"}

            if not errors:
                return await self.async_step_printer()

        return self.async_show_form(
            step_id="user",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )

    async def async_step_printer(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the printer step."""
        errors = {}

        try:
            if self._is_reconfigure:
                self.entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
                self._username = self.entry.data[CONF_USERNAME]
                self._password = self.entry.data[CONF_PASSWORD]

            await self._async_check_anycubic_api_instance_exists()
            errors = await self._async_check_login_errors()

            printer_list = await self._anycubic_api.list_my_printers(ignore_init_errors=True)

            if printer_list is None or len(printer_list) < 1:
                LOGGER.error("No printers found. Check config.")
                errors = {"base": "no_printers"}

            printer_id_map = {f"{x.id}": x.name for x in printer_list}

        except Exception as error:
            LOGGER.error("Authentication failed with unknown Error. Check credentials %s", error)
            errors = {"base": "cannot_connect"}

        if user_input and not errors:
            printer_id_list = list([int(x) for x in user_input[CONF_PRINTER_ID_LIST]])

            for printer_id in printer_id_list:
                try:
                    printer_status = await self._anycubic_api.printer_info_for_id(printer_id, ignore_init_errors=True)

                    if printer_status is None:
                        LOGGER.error("Printer not found. Check config.")
                        errors = {"base": "invalid_printer"}
                        break

                except Exception as error:
                    LOGGER.error("Authentication failed with unknown Error. Check credentials %s", error)
                    errors = {"base": "cannot_connect"}
                    break

            if not errors:
                existing_entry = await self.async_set_unique_id(f"{self._username}")
                if existing_entry and self.entry:
                    self.hass.config_entries.async_update_entry(
                        existing_entry,
                        data={
                            **self.entry.data,
                            CONF_USERNAME: self._username,
                            CONF_PASSWORD: self._password,
                            CONF_PRINTER_ID_LIST: printer_id_list,
                        },
                    )
                    await self.hass.config_entries.async_reload(existing_entry.entry_id)
                    if self._is_reconfigure:
                        self._is_reconfigure = False
                        return self.async_abort(reason="reconfigure_successful")
                    else:
                        return self.async_abort(reason="reauth_successful")
                else:
                    return self.async_create_entry(
                        title=self._username,
                        data={
                            CONF_USERNAME: self._username,
                            CONF_PASSWORD: self._password,
                            CONF_PRINTER_ID_LIST: printer_id_list,
                        },
                    )

        return self.async_show_form(
            step_id="printer",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_PRINTER_ID_LIST): cv.multi_select(printer_id_map),
                },
            ),
        )

    async def async_step_reconfigure(
        self, _: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle a reconfiguration flow initialized by the user."""

        self._is_reconfigure = True

        return await self.async_step_printer()


class AnycubicCloudOptionsFlowHandler(OptionsFlow):
    """Handle Anycubic Cloud options."""

    def __init__(self, entry: ConfigEntry) -> None:
        """Initialize Anycubic Cloud options flow."""
        self.entry = entry

    def _build_options_schema(self):
        schema = dict()

        schema[vol.Optional(
            CONF_MQTT_CONNECT_MODE,
            default=self.entry.options.get(CONF_MQTT_CONNECT_MODE, AnycubicMQTTConnectMode.Printing_Only)
        )] = vol.In(MQTT_CONNECT_MODES)

        for x in range(MAX_DRYING_PRESETS):
            num = x + 1

            dur_key = f"{CONF_DRYING_PRESET_DURATION_}{num}"
            schema[vol.Optional(
                dur_key,
                default=self.entry.options.get(dur_key, vol.UNDEFINED)
            )] = cv.positive_int

            temp_key = f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}"
            schema[vol.Optional(
                temp_key,
                default=self.entry.options.get(temp_key, vol.UNDEFINED)
            )] = cv.positive_int

        schema[vol.Optional(
            CONF_DEBUG,
            default=self.entry.options.get(CONF_DEBUG, False)
        )] = cv.boolean

        return vol.Schema(schema)

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage Anycubic Cloud options."""
        errors: dict[str, Any] = {}

        if user_input:
            return self.async_create_entry(data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=self._build_options_schema(),
            errors=errors,
        )
