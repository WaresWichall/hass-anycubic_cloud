from __future__ import annotations

from typing import Any


class AnycubicAPIError(Exception):
    pass


class AnycubicAuthTokensExpired(AnycubicAPIError):
    pass


class AnycubicAPIParsingError(AnycubicAPIError):
    pass


class AnycubicFileNotFoundError(AnycubicAPIError):
    pass


class AnycubicPropertiesNotLoaded(AnycubicAPIError):
    pass


class AnycubicInvalidValue(AnycubicAPIError):
    pass


class AnycubicAuthError(AnycubicAPIError):
    pass


class AnycubicMQTTClientError(AnycubicAPIError):
    pass


class AnycubicCloudUploadError(AnycubicAPIError):
    pass


class AnycubicDataParsingError(AnycubicAPIError):
    pass


class AnycubicGcodeParsingError(AnycubicDataParsingError):
    pass


class AnycubicMQTTUnknownUpdate(AnycubicDataParsingError):
    pass


class AnycubicMQTTUnhandledData(AnycubicDataParsingError):
    __slots__ = (
        "_unhandled_mqtt_data",
        "_unhandled_mqtt_type",
        "_unhandled_mqtt_action",
        "_unhandled_mqtt_state",
    )

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
