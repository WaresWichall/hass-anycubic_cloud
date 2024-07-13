from enum import IntEnum

from homeassistant.const import CONF_USERNAME
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo

from .const import DOMAIN, MANUFACTURER


def build_printer_device_info(entry_data, coordinator_data, printer_id: int) -> DeviceInfo:
    return DeviceInfo(
        identifiers={(DOMAIN, f"{entry_data[CONF_USERNAME]}-{coordinator_data[printer_id]['id']}")},
        manufacturer=MANUFACTURER,
        model=coordinator_data[printer_id]["machine_name"],
        name=coordinator_data[printer_id]["name"],
        connections={(CONNECTION_NETWORK_MAC, coordinator_data[printer_id]["machine_mac"])},
        sw_version=coordinator_data[printer_id]["fw_version"],
        hw_version=f"Printer ID: {printer_id}",
    )


class AnycubicMQTTConnectMode(IntEnum):
    Printing_Only = 1
    Printing_Drying = 2
    Device_Online = 3
    Always = 4
