"""Base class for anycubic_cloud entity."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import AnycubicCloudDataUpdateCoordinator
from .helpers import build_printer_device_info


class AnycubicCloudEntity(CoordinatorEntity[AnycubicCloudDataUpdateCoordinator], Entity):
    """Base implementation for Anycubic Printer device."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: AnycubicCloudDataUpdateCoordinator, printer_id: int) -> None:
        """Initialize an Anycubic device."""
        super().__init__(coordinator)
        self._printer_id = int(printer_id)
        self._attr_device_info: DeviceInfo = build_printer_device_info(
            coordinator.entry.data,
            coordinator.data,
            self._printer_id,
        )
