"""Binary sensors for Anycubic Cloud."""
from __future__ import annotations
from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_PRINTER_ID_LIST, COORDINATOR, DOMAIN
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_attributes_for_key, printer_entity_unique_id, printer_state_for_key

PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES = (
    BinarySensorEntityDescription(
        key="dry_status_is_drying",
        translation_key="dry_status_is_drying",
    ),
)

SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES = (
    BinarySensorEntityDescription(
        key="secondary_dry_status_is_drying",
        translation_key="secondary_dry_status_is_drying",
    ),
)

SENSOR_TYPES = (
    BinarySensorEntityDescription(
        key="job_in_progress",
        translation_key="job_in_progress",
    ),
    BinarySensorEntityDescription(
        key="job_complete",
        translation_key="job_complete",
    ),
    BinarySensorEntityDescription(
        key="job_failed",
        translation_key="job_failed",
    ),
    BinarySensorEntityDescription(
        key="job_is_paused",
        translation_key="job_is_paused",
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
        entity_category=EntityCategory.DIAGNOSTIC,
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
            for description in PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES:
                sensors.append(AnycubicBinarySensor(coordinator, printer_id, description))
        if printer_state_for_key(coordinator, printer_id, 'connected_ace_units') > 1:
            for description in SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES:
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

    @property
    def state_attributes(self) -> dict[str, Any] | None:
        """Return state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return super().state_attributes
