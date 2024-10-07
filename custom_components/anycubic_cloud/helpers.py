from __future__ import annotations
from typing import Any, TYPE_CHECKING
from enum import IntEnum
import re

from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo

from .anycubic_cloud_api.anycubic_enums import (
    AnycubicPrinterMaterialType
)

from .const import (
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    DOMAIN,
    MANUFACTURER,
    PrinterEntityType,
)

if TYPE_CHECKING:
    from homeassistant.helpers.entity import EntityDescription
    from .coordinator import AnycubicCloudDataUpdateCoordinator


class AnycubicMQTTConnectMode(IntEnum):
    Printing_Only = 1
    Printing_Drying = 2
    Device_Online = 3
    Always = 4


def build_printer_device_info(
    coordinator_data: dict[str, Any],
    printer_id: int,
) -> DeviceInfo:
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
        serial_number=f"{printer_id}",
    )


def get_drying_preset_from_entry_options(
    entry_options: dict[str, Any],
    preset_number: int,
):
    preset_duration = entry_options.get(f"{CONF_DRYING_PRESET_DURATION_}{preset_number}")
    preset_temperature = entry_options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{preset_number}")

    return (
        preset_duration,
        preset_temperature,
    )


def printer_state_for_key(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    state_key: str,
):
    return coordinator.data['printers'][printer_id]['states'][state_key]


def printer_attributes_for_key(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    attribute_key: str,
):
    return coordinator.data['printers'][printer_id]['attributes'].get(attribute_key)


def printer_state_connected_ace_units(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
):
    return printer_state_for_key(
        coordinator,
        printer_id,
        'connected_ace_units',
    )


def printer_state_supports_ace(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
):
    return printer_state_for_key(
        coordinator,
        printer_id,
        'supports_function_multi_color_box',
    )


def check_descriptor_status_not_lcd(
    description: EntityDescription,
    material_type: AnycubicPrinterMaterialType,
):
    return (
        description.printer_entity_type == PrinterEntityType.LCD
        and material_type != AnycubicPrinterMaterialType.RESIN
    )


def check_descriptor_status_not_fdm(
    description: EntityDescription,
    material_type: AnycubicPrinterMaterialType,
):
    return (
        description.printer_entity_type == PrinterEntityType.FDM
        and material_type != AnycubicPrinterMaterialType.FILAMENT
    )


def check_descriptor_state_ace_not_supported(
    description: EntityDescription,
    supports_ace: bool,
):
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_PRIMARY,
            PrinterEntityType.ACE_SECONDARY,
            PrinterEntityType.DRY_PRESET_PRIMARY,
            PrinterEntityType.DRY_PRESET_SECONDARY,
        ]
        and not supports_ace
    )


def check_descriptor_state_ace_primary_unavailable(
    description: EntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
):
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_PRIMARY,
            PrinterEntityType.DRY_PRESET_PRIMARY,
        ]
        and supports_ace
        and connected_ace_units < 1
    )


def check_descriptor_state_ace_secondary_unavailable(
    description: EntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
):
    return (
        description.printer_entity_type in [
            PrinterEntityType.ACE_SECONDARY,
            PrinterEntityType.DRY_PRESET_SECONDARY,
        ]
        and supports_ace
        and connected_ace_units < 2
    )


def check_descriptor_state_drying_available(
    description: EntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
):
    return (
        supports_ace
        and (
            description.printer_entity_type == PrinterEntityType.DRY_PRESET_PRIMARY
            and connected_ace_units >= 1
        ) or (
            description.printer_entity_type == PrinterEntityType.DRY_PRESET_SECONDARY
            and connected_ace_units >= 2
        )
    )


def check_descriptor_state_drying_unavailable(
    description: EntityDescription,
    supports_ace: bool,
    connected_ace_units: int,
    entry_options,
):
    drying_available = check_descriptor_state_drying_available(
        description,
        supports_ace,
        connected_ace_units,
    )

    if not drying_available:
        return False

    preset_duration, preset_temperature = get_drying_preset_from_entry_options(
        entry_options,
        description.key[-1],
    )

    return (
        not preset_duration
        or not preset_temperature
        or int(preset_temperature) <= 0
        or int(preset_duration) <= 0
    )


def printer_entity_unique_id(
    coordinator: AnycubicCloudDataUpdateCoordinator,
    printer_id: int,
    entity_suffix: str,
):
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
