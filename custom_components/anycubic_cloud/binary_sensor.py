"""Binary sensors for Anycubic Cloud."""
from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_PRINTER_ID_LIST, COORDINATOR, DOMAIN
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_entity_unique_id, printer_state_for_key

MULTI_COLOR_BOX_SENSOR_TYPES = (
    BinarySensorEntityDescription(
        key="dry_status_is_drying",
        translation_key="dry_status_is_drying",
    ),
)

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
        key="is_busy",
        translation_key="is_busy",
    ),
    BinarySensorEntityDescription(
        key="is_available",
        translation_key="is_available",
    ),
    BinarySensorEntityDescription(
        key="mqtt_connection_active",
        translation_key="mqtt_connection_active",
    ),
)

GLOBAL_SENSOR_TYPES = (
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud binary sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    sensors: list[AnycubicBinarySensor] = []
    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        if printer_state_for_key(coordinator, printer_id, 'supports_function_multi_color_box'):
            for description in MULTI_COLOR_BOX_SENSOR_TYPES:
                sensors.append(AnycubicBinarySensor(coordinator, printer_id, description))

        for description in SENSOR_TYPES:
            sensors.append(AnycubicBinarySensor(coordinator, printer_id, description))

    for description in GLOBAL_SENSOR_TYPES:
        sensors.append(AnycubicBinarySensor(coordinator, entry.data[CONF_PRINTER_ID_LIST][0], description))

    async_add_entities(sensors)


class AnycubicBinarySensor(AnycubicCloudEntity, BinarySensorEntity):
    """Representation of a Anycubic binary sensor."""

    entity_description: BinarySensorEntityDescription

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: BinarySensorEntityDescription,
    ) -> None:
        """Initiate Anycubic Binary Sensor."""
        super().__init__(coordinator, printer_id)
        self.entity_description = entity_description
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, entity_description.key)

    @property
    def is_on(self) -> bool:
        """Return true if the binary sensor is on."""
        return bool(
            printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        )
