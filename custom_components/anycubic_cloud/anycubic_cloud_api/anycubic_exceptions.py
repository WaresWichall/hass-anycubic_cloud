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
        *args,
        unhandled_mqtt_data=None,
        unhandled_mqtt_type=None,
        unhandled_mqtt_action=None,
        unhandled_mqtt_state=None,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self._unhandled_mqtt_data = unhandled_mqtt_data
        self._unhandled_mqtt_type = unhandled_mqtt_type
        self._unhandled_mqtt_action = unhandled_mqtt_action
        self._unhandled_mqtt_state = unhandled_mqtt_state

    @property
    def unhandled_mqtt_data(self):
        return self._unhandled_mqtt_data

    @property
    def unhandled_mqtt_type(self):
        return self._unhandled_mqtt_type

    @property
    def unhandled_mqtt_action(self):
        return self._unhandled_mqtt_action

    @property
    def unhandled_mqtt_state(self):
        return self._unhandled_mqtt_state


class AnycubicErrorMessage:
    no_printer_to_print = AnycubicAPIError('No printer to print with.')
    no_multi_color_box_for_map = AnycubicAPIError('No multi color box found for supplied box mapping.')
    no_map_for_multi_color_box = AnycubicAPIError('Must supply box mapping when using multi color box.')
    no_multi_color_box_for_slot_list = AnycubicAPIError('No multi color box found for slot list.')
    no_slot_list_for_multi_color_box = AnycubicAPIError('Must supply a slot list when using multi color box.')
