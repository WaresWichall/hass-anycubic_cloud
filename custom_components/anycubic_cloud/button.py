"""Support for Anycubic Cloud button."""
from __future__ import annotations
from dataclasses import dataclass

from typing import Any, TYPE_CHECKING

from homeassistant.components.button import (
    ButtonEntity,
    ButtonEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    COORDINATOR,
    DOMAIN,
    ENTITY_ID_DRYING_START_PRESET_,
    MAX_DRYING_PRESETS,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_attributes_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicButtonEntityDescription(
    ButtonEntityDescription, AnycubicCloudEntityDescription
):
    """Describes Anycubic Cloud button entity."""


PRIMARY_DRYING_PRESET_BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key=f"{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        translation_key=f"{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        printer_entity_type=PrinterEntityType.DRY_PRESET_PRIMARY,
    ) for x in range(MAX_DRYING_PRESETS)
])

SECONDARY_DRYING_PRESET_BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key=f"secondary_{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        translation_key=f"secondary_{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        printer_entity_type=PrinterEntityType.DRY_PRESET_SECONDARY,
    ) for x in range(MAX_DRYING_PRESETS)
])

PRIMARY_MULTI_COLOR_BOX_BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key="drying_stop",
        translation_key="drying_stop",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
])

SECONDARY_MULTI_COLOR_BOX_BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key="secondary_drying_stop",
        translation_key="secondary_drying_stop",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
])

BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key="pause_print",
        translation_key="pause_print",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicButtonEntityDescription(
        key="resume_print",
        translation_key="resume_print",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicButtonEntityDescription(
        key="cancel_print",
        translation_key="cancel_print",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicButtonEntityDescription(
        key="request_file_list_local",
        translation_key="request_file_list_local",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicButtonEntityDescription(
        key="request_file_list_udisk",
        translation_key="request_file_list_udisk",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
])

GLOBAL_BUTTON_TYPES: list[AnycubicButtonEntityDescription] = list([
    AnycubicButtonEntityDescription(
        key="request_file_list_cloud",
        translation_key="request_file_list_cloud",
        printer_entity_type=PrinterEntityType.GLOBAL,
    ),
    AnycubicButtonEntityDescription(
        key="refresh_mqtt_connection",
        translation_key="refresh_mqtt_connection",
        entity_category=EntityCategory.DIAGNOSTIC,
        printer_entity_type=PrinterEntityType.GLOBAL,
    ),
])


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the button from a config entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicCloudButton,
        platform=Platform.BUTTON,
        available_descriptors=list(
            BUTTON_TYPES
            + PRIMARY_MULTI_COLOR_BOX_BUTTON_TYPES
            + SECONDARY_MULTI_COLOR_BOX_BUTTON_TYPES
            + PRIMARY_DRYING_PRESET_BUTTON_TYPES
            + SECONDARY_DRYING_PRESET_BUTTON_TYPES
            + GLOBAL_BUTTON_TYPES
        ),
    )


class AnycubicCloudButton(AnycubicCloudEntity, ButtonEntity):
    """A button for Anycubic Cloud."""

    entity_description: AnycubicButtonEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicButtonEntityDescription,
    ) -> None:
        """Initialize."""
        super().__init__(hass, coordinator, printer_id, entity_description)

    async def async_press(self) -> None:
        """Press the button."""
        if TYPE_CHECKING:
            assert self.coordinator.anycubic_api, "Connection to API is missing"

        await self.coordinator.button_press_event(self._printer_id, self.entity_description.key)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return extra state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return None
