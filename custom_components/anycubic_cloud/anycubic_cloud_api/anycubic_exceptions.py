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


class AnycubicErrorMessage:
    no_printer_to_print = AnycubicAPIError('No printer to print with.')
    no_multi_color_box_for_map = AnycubicAPIError('No multi color box found for supplied box mapping.')
    no_map_for_multi_color_box = AnycubicAPIError('Must supply box mapping when using multi color box.')
    no_multi_color_box_for_slot_list = AnycubicAPIError('No multi color box found for slot list.')
    no_slot_list_for_multi_color_box = AnycubicAPIError('Must supply a slot list when using multi color box.')
