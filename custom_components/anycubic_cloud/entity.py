"""Base class for anycubic_cloud entity."""

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity, EntityDescription
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .coordinator import AnycubicCloudDataUpdateCoordinator
from .helpers import build_printer_device_info, printer_entity_unique_id


class AnycubicCloudEntity(CoordinatorEntity[AnycubicCloudDataUpdateCoordinator], Entity):
    """Base implementation for Anycubic Printer device."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: EntityDescription,
    ) -> None:
        """Initialize an Anycubic device."""
        super().__init__(coordinator)
        self._printer_id = int(printer_id)
        self._attr_device_info: DeviceInfo = build_printer_device_info(
            coordinator.entry.data,
            coordinator.data,
            self._printer_id,
        )
        self.entity_description = entity_description
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, entity_description.key)
