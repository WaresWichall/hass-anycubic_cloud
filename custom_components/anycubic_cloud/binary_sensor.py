"""Binary sensors for Anycubic Cloud."""
from __future__ import annotations
from dataclasses import dataclass
from typing import Any, TYPE_CHECKING

from homeassistant.components.binary_sensor import (
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    COORDINATOR,
    DOMAIN,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity
from .helpers import printer_attributes_for_key, printer_state_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicBinarySensorEntityDescription(BinarySensorEntityDescription):
    """Describes Anycubic Cloud binary sensor entity."""

    printer_entity_type: PrinterEntityType | None = None


PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES = list([
    AnycubicBinarySensorEntityDescription(
        key="dry_status_is_drying",
        translation_key="dry_status_is_drying",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
])

SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES = list([
    AnycubicBinarySensorEntityDescription(
        key="secondary_dry_status_is_drying",
        translation_key="secondary_dry_status_is_drying",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
])

SENSOR_TYPES = list([
    AnycubicBinarySensorEntityDescription(
        key="job_in_progress",
        translation_key="job_in_progress",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="job_complete",
        translation_key="job_complete",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="job_failed",
        translation_key="job_failed",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="job_is_paused",
        translation_key="job_is_paused",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="printer_online",
        translation_key="printer_online",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="is_busy",
        translation_key="is_busy",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="is_available",
        translation_key="is_available",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicBinarySensorEntityDescription(
        key="mqtt_connection_active",
        translation_key="mqtt_connection_active",
        entity_category=EntityCategory.DIAGNOSTIC,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
])

GLOBAL_SENSOR_TYPES = list([
])


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud binary sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicBinarySensor,
        platform=Platform.BINARY_SENSOR,
        available_descriptors=(
            SENSOR_TYPES
            + PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES
            + SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES
            + GLOBAL_SENSOR_TYPES
        ),
    )


class AnycubicBinarySensor(AnycubicCloudEntity, BinarySensorEntity):
    """Representation of a Anycubic binary sensor."""

    entity_description: AnycubicBinarySensorEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicBinarySensorEntityDescription,
    ) -> None:
        """Initiate Anycubic Binary Sensor."""
        super().__init__(coordinator, printer_id, entity_description)

    @property
    def is_on(self) -> bool:
        """Return true if the binary sensor is on."""
        return bool(
            printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return extra state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return None
