"""Adds config flow for Anycubic Cloud integration."""
from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any

import homeassistant.helpers.config_validation as cv
import voluptuous as vol
from aiohttp import CookieJar
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_create_clientsession
from homeassistant.helpers.selector import BooleanSelector, ObjectSelector
from homeassistant.helpers.storage import Store

from .anycubic_cloud_api.anycubic_api_mqtt import AnycubicMQTTAPI as AnycubicAPI
from .anycubic_cloud_api.anycubic_model_auth import AnycubicAuthMode
from .const import (
    CONF_CARD_CONFIG,
    CONF_DEBUG,
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    CONF_MQTT_CONNECT_MODE,
    CONF_PRINTER_ID_LIST,
    CONF_USER_AUTH_MODE,
    CONF_USER_DEVICE_ID,
    CONF_USER_TOKEN,
    DOMAIN,
    LOGGER,
    MAX_DRYING_PRESETS,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .helpers import (
    AnycubicMQTTConnectMode,
    extract_panel_card_config,
    remove_quotes_from_string,
)

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

AUTH_MODES = {
    AnycubicAuthMode.WEB: "Web (No MQTT)",
    AnycubicAuthMode.SLICER: "Slicer",
    AnycubicAuthMode.ANDROID: "Android",
}

DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_USER_TOKEN): cv.string,
        vol.Optional(CONF_USER_AUTH_MODE, default=int(AnycubicAuthMode.WEB)): vol.In(AUTH_MODES),
        vol.Optional(CONF_USER_DEVICE_ID): cv.string,
    }
)

MQTT_CONNECT_MODES = {
    AnycubicMQTTConnectMode.Printing_Only: "Printing Only",
    AnycubicMQTTConnectMode.Printing_Drying: "Printing & Drying",
    AnycubicMQTTConnectMode.Device_Online: "Device Online",
    AnycubicMQTTConnectMode.Always: "Always",
    AnycubicMQTTConnectMode.Never_Connect: "Never Connect",
}


def async_create_anycubic_api(
    hass: HomeAssistant,
    auth_token: str | None,
    auth_mode: AnycubicAuthMode | int | None = None,
    device_id: str | None = None,
) -> AnycubicAPI:
    if not auth_token:
        raise Exception("Missing auth token.")

    cookie_jar = CookieJar(unsafe=True)
    websession = async_create_clientsession(
        hass,
        cookie_jar=cookie_jar,
    )
    api = AnycubicAPI(
        session=websession,
        cookie_jar=cookie_jar,
        debug_logger=LOGGER,
    )

    api.set_authentication(
        auth_token=auth_token,
        auth_mode=auth_mode,
        device_id=device_id,
    )

    return api


async def async_load_tokens_from_store(
    hass: HomeAssistant,
    anycubic_api: AnycubicAPI,
) -> None:
    store = Store[dict[str, Any]](hass, STORAGE_VERSION, STORAGE_KEY)
    config = await store.async_load()

    if config:
        anycubic_api.load_auth_config_from_dict(config, minimal=True)


class AnycubicCloudConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AnycubicCloud integration."""

    VERSION = 1

    entry: ConfigEntry | None

    def __init__(self) -> None:
        """Initialize."""
        self._user_token: str | None = None
        self._user_auth_mode: AnycubicAuthMode | int | None = None
        self._user_device_id: str | None = None
        self._is_reconfigure: bool = False
        self._anycubic_api: AnycubicAPI | None = None
        self.entry: ConfigEntry | None = None

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> AnycubicCloudOptionsFlowHandler:
        """Get the options flow for this handler."""
        return AnycubicCloudOptionsFlowHandler(config_entry)

    async def async_step_reauth(self, entry_data: Mapping[str, Any]) -> ConfigFlowResult:
        """Handle initiation of re-authentication with AnycubicCloud."""
        self.entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])
        return await self.async_step_reauth_confirm()

    def _async_create_anycubic_api(self) -> AnycubicAPI:
        return async_create_anycubic_api(
            self.hass,
            self._user_token,
            self._user_auth_mode,
            self._user_device_id,
        )

    def _errors_unknown_authentication_failure(
        self,
        error: Exception,
    ) -> dict[str, str]:
        LOGGER.error("Authentication failed with unknown Error. Check credentials %s", error)
        return {"base": "cannot_connect"}

    async def _async_check_anycubic_api_instance_exists(self) -> None:
        if self._anycubic_api is not None:
            return

        self._anycubic_api = self._async_create_anycubic_api()

        if not self.entry:
            return

        await async_load_tokens_from_store(self.hass, self._anycubic_api)

    async def _async_check_login_errors(self) -> dict[str, str]:
        assert self._anycubic_api
        success = await self._anycubic_api.check_api_tokens()
        if not success:
            LOGGER.error("Authentication failed. Check credentials.")
            return {"base": "invalid_auth"}

        return {}

    async def _async_check_authentication_with_user_input(
        self,
        user_input: dict[str, Any],
    ) -> dict[str, str]:
        try:
            self._user_token = remove_quotes_from_string(user_input[CONF_USER_TOKEN])
        except TypeError as error:
            LOGGER.warning(f"Token appears invalid: {error}")

            self._user_token = user_input[CONF_USER_TOKEN]

        self._user_auth_mode = user_input.get(CONF_USER_AUTH_MODE)
        self._user_device_id = user_input.get(CONF_USER_DEVICE_ID)

        try:
            await self._async_check_anycubic_api_instance_exists()
            errors = await self._async_check_login_errors()

        except Exception as error:
            errors = self._errors_unknown_authentication_failure(error)

        return errors

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Dialog that informs the user that reauth is required."""
        errors = {}

        if user_input is not None:
            errors = await self._async_check_authentication_with_user_input(user_input)

            if not errors:
                if self.entry:
                    self.hass.config_entries.async_update_entry(
                        self.entry,
                        data={
                            **self.entry.data,
                            CONF_USER_TOKEN: self._user_token,
                            CONF_USER_AUTH_MODE: self._user_auth_mode,
                            CONF_USER_DEVICE_ID: self._user_device_id,
                        },
                    )
                    return await self.async_step_printer()

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            errors = await self._async_check_authentication_with_user_input(user_input)

            if not errors:
                return await self.async_step_printer()

        return self.async_show_form(
            step_id="user",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )

    async def async_step_printer(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the printer step."""
        errors = {}
        printer_id_map = {}

        try:
            if self._is_reconfigure:
                self.entry = self.hass.config_entries.async_get_entry(self.context["entry_id"])

                assert self.entry

                self._user_token = self.entry.data[CONF_USER_TOKEN]
                self._user_auth_mode = self.entry.data.get(CONF_USER_AUTH_MODE)
                self._user_device_id = self.entry.data.get(CONF_USER_DEVICE_ID)

            await self._async_check_anycubic_api_instance_exists()
            errors = await self._async_check_login_errors()

            assert self._anycubic_api

            printer_list = await self._anycubic_api.list_my_printers(ignore_init_errors=True)

            if printer_list is None or len(printer_list) < 1:
                LOGGER.error("No printers found. Check config.")
                errors = {"base": "no_printers"}

            printer_id_map = {f"{x.id}": x.name for x in printer_list}

        except Exception as error:
            errors = self._errors_unknown_authentication_failure(error)

        if user_input and not errors:
            assert self._anycubic_api

            printer_id_list = list([int(x) for x in user_input[CONF_PRINTER_ID_LIST]])

            for printer_id in printer_id_list:
                try:
                    printer_status = await self._anycubic_api.printer_info_for_id(printer_id, ignore_init_errors=True)

                    if printer_status is None:
                        LOGGER.error("Printer not found. Check config.")
                        errors = {"base": "invalid_printer"}
                        break

                except Exception as error:
                    errors = self._errors_unknown_authentication_failure(error)
                    break

            if not errors:
                existing_entry = await self.async_set_unique_id(
                    f"{self._anycubic_api.anycubic_auth.api_user_id}"
                )
                if existing_entry and self.entry:
                    self.hass.config_entries.async_update_entry(
                        existing_entry,
                        data={
                            **self.entry.data,
                            CONF_USER_TOKEN: self._user_token,
                            CONF_USER_AUTH_MODE: self._user_auth_mode,
                            CONF_USER_DEVICE_ID: self._user_device_id,
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
                        title=self._anycubic_api.anycubic_auth.api_user_identifier,
                        data={
                            CONF_USER_TOKEN: self._user_token,
                            CONF_USER_AUTH_MODE: self._user_auth_mode,
                            CONF_USER_DEVICE_ID: self._user_device_id,
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
    ) -> ConfigFlowResult:
        """Handle a reconfiguration flow initialized by the user."""

        self._is_reconfigure = True

        return await self.async_step_reauth_or_choose_printer()

    async def async_step_reauth_or_choose_printer(
        self, _: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Re-authenticate or select printer menu.."""

        return self.async_show_menu(
            step_id="reauth_or_choose_printer",
            menu_options=["reauth", "printer"],
        )


class AnycubicCloudOptionsFlowHandler(OptionsFlow):
    """Handle Anycubic Cloud options."""

    def __init__(self, entry: ConfigEntry) -> None:
        """Initialize Anycubic Cloud options flow."""
        self.entry = entry
        self._anycubic_api: AnycubicAPI | None = None
        self._supports_drying = False

    def _build_options_schema(self) -> vol.Schema:
        schema: dict[Any, Any] = dict()

        schema[vol.Optional(
            CONF_MQTT_CONNECT_MODE,
            default=self.entry.options.get(CONF_MQTT_CONNECT_MODE, AnycubicMQTTConnectMode.Printing_Only)
        )] = vol.In(MQTT_CONNECT_MODES)

        if self._supports_drying:

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
            CONF_CARD_CONFIG,
            default=self.entry.options.get(CONF_CARD_CONFIG, None)
        )] = ObjectSelector()

        schema[vol.Optional(
            CONF_DEBUG,
            default=self.entry.options.get(CONF_DEBUG, False)
        )] = BooleanSelector()

        return vol.Schema(schema)

    async def _async_check_printer_options(self) -> None:
        try:
            self._anycubic_api = async_create_anycubic_api(
                self.hass,
                self.entry.data[CONF_USER_TOKEN],
                self.entry.data.get(CONF_USER_AUTH_MODE),
                self.entry.data.get(CONF_USER_DEVICE_ID),
            )

            await async_load_tokens_from_store(
                self.hass,
                self._anycubic_api,
            )
            await self._anycubic_api.check_api_tokens()

            printer_list = await self._anycubic_api.list_my_printers()

            if printer_list and len(printer_list) > 0:
                for printer in printer_list:

                    if printer.supports_function_multi_color_box:
                        self._supports_drying = True
                        break

        except Exception:
            self._anycubic_api = None

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Manage Anycubic Cloud options."""
        errors: dict[str, Any] = {}

        if user_input:
            if CONF_CARD_CONFIG in user_input:
                if isinstance(user_input[CONF_CARD_CONFIG], dict):
                    user_input[CONF_CARD_CONFIG] = extract_panel_card_config(
                        user_input[CONF_CARD_CONFIG]
                    )
            return self.async_create_entry(data=user_input)

        await self._async_check_printer_options()

        return self.async_show_form(
            step_id="init",
            data_schema=self._build_options_schema(),
            errors=errors,
        )
