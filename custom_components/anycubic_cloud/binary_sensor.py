"""Binary sensors for Anycubic Cloud."""
from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import COORDINATOR, DOMAIN
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity

SENSOR_TYPES = (
    BinarySensorEntityDescription(
        key="current_project_in_progress",
        translation_key="current_project_in_progress",
    ),
    BinarySensorEntityDescription(
        key="current_project_complete",
        translation_key="current_project_complete",
    ),
    BinarySensorEntityDescription(
        key="current_project_failed",
        translation_key="current_project_failed",
    ),
    BinarySensorEntityDescription(
        key="current_project_is_paused",
        translation_key="current_project_is_paused",
    ),
    BinarySensorEntityDescription(
        key="printer_online",
        translation_key="printer_online",
    ),
    BinarySensorEntityDescription(
        key="dry_status_is_drying",
        translation_key="dry_status_is_drying",
    ),
    BinarySensorEntityDescription(
        key="multi_color_box_auto_feed",
        translation_key="multi_color_box_auto_feed",
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud binary sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    sensors: list[AnycubicBinarySensor] = []
    for description in SENSOR_TYPES:
        sensors.append(AnycubicBinarySensor(coordinator, description))

    async_add_entities(sensors)


class AnycubicBinarySensor(AnycubicCloudEntity, BinarySensorEntity):
    """Representation of a Anycubic binary sensor."""

    entity_description: BinarySensorEntityDescription

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        entity_description: BinarySensorEntityDescription,
    ) -> None:
        """Initiate Anycubic Binary Sensor."""
        super().__init__(coordinator)
        self.entity_description = entity_description
        self._attr_unique_id = f"{coordinator.data['machine_mac']}-{entity_description.key}"

    @property
    def is_on(self) -> bool:
        """Return true if the binary sensor is on."""
        return bool(
            self.coordinator.data[self.entity_description.key]
        )
