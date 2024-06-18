"""Base class for anycubic_cloud entity."""

from homeassistant.const import CONF_NAME, CONF_USERNAME
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.entity import Entity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, MANUFACTURER, MODEL
from .coordinator import AnycubicCloudDataUpdateCoordinator


class AnycubicCloudEntity(CoordinatorEntity[AnycubicCloudDataUpdateCoordinator], Entity):
    """Base implementation for Anycubic Printer device."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: AnycubicCloudDataUpdateCoordinator) -> None:
        """Initialize an Anycubic device."""
        super().__init__(coordinator)
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, f"{coordinator.entry.data[CONF_USERNAME]}-{coordinator.data['id']}")},
            manufacturer=MANUFACTURER,
            model=coordinator.data["machine_name"],
            name=coordinator.entry.data[CONF_NAME],
            connections={(CONNECTION_NETWORK_MAC, coordinator.data["machine_mac"])},
            sw_version=coordinator.data["fw_version"],
        )
