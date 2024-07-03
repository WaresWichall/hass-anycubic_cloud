"""Base class for anycubic_cloud entity."""

from homeassistant.const import CONF_USERNAME
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, MANUFACTURER
from .coordinator import AnycubicCloudDataUpdateCoordinator


class AnycubicCloudEntity(CoordinatorEntity[AnycubicCloudDataUpdateCoordinator], Entity):
    """Base implementation for Anycubic Printer device."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: AnycubicCloudDataUpdateCoordinator, printer_id: int) -> None:
        """Initialize an Anycubic device."""
        super().__init__(coordinator)
        self._printer_id = int(printer_id)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{coordinator.entry.data[CONF_USERNAME]}-{coordinator.data[self._printer_id]['id']}")},
            manufacturer=MANUFACTURER,
            model=coordinator.data[self._printer_id]["machine_name"],
            name=coordinator.data[self._printer_id]["name"],
            connections={(CONNECTION_NETWORK_MAC, coordinator.data[self._printer_id]["machine_mac"])},
            sw_version=coordinator.data[self._printer_id]["fw_version"],
        )
