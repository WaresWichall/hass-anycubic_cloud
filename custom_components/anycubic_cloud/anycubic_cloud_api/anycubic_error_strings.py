from __future__ import annotations


class ErrorsGeneral:
    no_printer_to_print = "No printer to print with."
    no_multi_color_box_for_map = "No multi color box found for supplied box mapping."
    no_map_for_multi_color_box = "Must supply box mapping when using multi color box."
    no_multi_color_box_for_slot_list = "No multi color box found for slot list."
    no_slot_list_for_multi_color_box = "Must supply a slot list when using multi color box."


class ErrorsAPIParsing:
    api_error_rate_limited = "Unexpected response for login, rate limited?"
    api_error_server_maintenance = "Unexpected error parsing Anycubic response, server maintenance?"
    api_error_user_server_maintenance = "Unexpected error retrieving user info, server maintenance?"
