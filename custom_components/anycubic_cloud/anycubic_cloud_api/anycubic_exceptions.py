from __future__ import annotations

from typing import Any


class APIAuthTokensExpired(Exception):
    pass


class AnycubicAPIError(Exception):
    pass


class AnycubicAPIParsingError(AnycubicAPIError):
    pass


class AnycubicFileNotFoundError(AnycubicAPIError):
    pass


class AnycubicPropertiesNotLoaded(AnycubicAPIError):
    pass


class AnycubicInvalidValue(AnycubicAPIError):
    pass


class AnycubicDataParsingError(AnycubicAPIError):
    pass


class AnycubicMQTTUnhandledData(AnycubicDataParsingError):
    def __init__(
        self,
        *args: Any,
        unhandled_mqtt_data: dict[Any, Any] | None = None,
        unhandled_mqtt_type: str | None = None,
        unhandled_mqtt_action: str | None = None,
        unhandled_mqtt_state: str | None = None,
        **kwargs: Any,
    ):
        super().__init__(*args, **kwargs)
        self._unhandled_mqtt_data = unhandled_mqtt_data
        self._unhandled_mqtt_type = unhandled_mqtt_type
        self._unhandled_mqtt_action = unhandled_mqtt_action
        self._unhandled_mqtt_state = unhandled_mqtt_state

    @property
    def unhandled_mqtt_data(self) -> dict[Any, Any] | None:
        return self._unhandled_mqtt_data

    @property
    def unhandled_mqtt_type(self) -> str | None:
        return self._unhandled_mqtt_type

    @property
    def unhandled_mqtt_action(self) -> str | None:
        return self._unhandled_mqtt_action

    @property
    def unhandled_mqtt_state(self) -> str | None:
        return self._unhandled_mqtt_state


class AnycubicErrorMessage:
    no_printer_to_print = AnycubicAPIError('No printer to print with.')
    no_multi_color_box_for_map = AnycubicAPIError('No multi color box found for supplied box mapping.')
    no_map_for_multi_color_box = AnycubicAPIError('Must supply box mapping when using multi color box.')
    no_multi_color_box_for_slot_list = AnycubicAPIError('No multi color box found for slot list.')
    no_slot_list_for_multi_color_box = AnycubicAPIError('Must supply a slot list when using multi color box.')
    api_error_rate_limited = AnycubicAPIParsingError('Unexpected response for login, rate limited?')
