from enum import IntEnum

import re

from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo

from .const import DOMAIN, MANUFACTURER


def build_printer_device_info(entry_data, coordinator_data, printer_id: int) -> DeviceInfo:
    printer_data = coordinator_data['printers'][printer_id]['states']
    user_data = coordinator_data['user_info']
    return DeviceInfo(
        identifiers={(DOMAIN, f"{user_data['id']}-{printer_data['id']}")},
        manufacturer=MANUFACTURER,
        model=printer_data["machine_name"],
        name=printer_data["name"],
        connections={(CONNECTION_NETWORK_MAC, printer_data["machine_mac"])},
        sw_version=printer_data["fw_version"],
        hw_version=f"Printer ID: {printer_id}",
    )


class AnycubicMQTTConnectMode(IntEnum):
    Printing_Only = 1
    Printing_Drying = 2
    Device_Online = 3
    Always = 4


def printer_state_for_key(coordinator, printer_id, state_key):
    return coordinator.data['printers'][printer_id]['states'][state_key]


def printer_attributes_for_key(coordinator, printer_id, attribute_key):
    return coordinator.data['printers'][printer_id]['attributes'].get(attribute_key)


def printer_entity_unique_id(coordinator, printer_id, entity_suffix):
    return f"{printer_state_for_key(coordinator, printer_id, 'machine_mac')}-{entity_suffix}"


def state_string_active(state):
    return "active" if state is not None else "inactive"


def state_string_loaded(state):
    return "loaded" if state is not None else "not loaded"


# REGEX_TOKEN_STRING = re.compile(r"^['\"]?([_-A-Za-z0-9+\/.]{236,238})['\"]?$")


# def clean_user_token(input_token):
#     token_length = len(input_token)
#     if token_length == 236:
#         return input_token
#     if token_length > 236:
#         matches = REGEX_TOKEN_STRING.findall(input_token)
#         if len(matches) == 1:
#             return matches[0]
#     raise TypeError(f"Invalid token, expected 236 or 238 chars, got {token_length}.")


REGEX_NOQUOTE_STRING = re.compile(r"^['\"]?([^'\"]+)['\"]?$")


def remove_quotes_from_string(input_string):
    matches = REGEX_NOQUOTE_STRING.findall(input_string)

    if len(matches) == 1:
        return matches[0]

    raise TypeError("Unexpected quotes in string.")
