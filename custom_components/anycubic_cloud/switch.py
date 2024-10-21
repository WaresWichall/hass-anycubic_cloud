"""Switches for Anycubic Cloud."""
from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.components.switch import SwitchEntity, SwitchEntityDescription
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EntityCategory, Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    COORDINATOR,
    DOMAIN,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_state_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicSwitchEntityDescription(
    SwitchEntityDescription, AnycubicCloudEntityDescription
):
    """Describes Anycubic Cloud switch entity."""


PRIMARY_MULTI_COLOR_BOX_SWITCH_TYPES: list[AnycubicSwitchEntityDescription] = list([
    AnycubicSwitchEntityDescription(
        key="multi_color_box_runout_refill",
        translation_key="multi_color_box_runout_refill",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
])

SECONDARY_MULTI_COLOR_BOX_SWITCH_TYPES: list[AnycubicSwitchEntityDescription] = list([
    AnycubicSwitchEntityDescription(
        key="secondary_multi_color_box_runout_refill",
        translation_key="secondary_multi_color_box_runout_refill",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
])

SWITCH_TYPES: list[AnycubicSwitchEntityDescription] = list([
])

GLOBAL_SWITCH_TYPES: list[AnycubicSwitchEntityDescription] = list([
    AnycubicSwitchEntityDescription(
        key="manual_mqtt_connection_enabled",
        translation_key="manual_mqtt_connection_enabled",
        entity_category=EntityCategory.DIAGNOSTIC,
        printer_entity_type=PrinterEntityType.GLOBAL,
    ),
])


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud switch entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicSwitch,
        platform=Platform.SWITCH,
        available_descriptors=list(
            SWITCH_TYPES
            + PRIMARY_MULTI_COLOR_BOX_SWITCH_TYPES
            + SECONDARY_MULTI_COLOR_BOX_SWITCH_TYPES
            + GLOBAL_SWITCH_TYPES
        ),
    )


class AnycubicSwitch(AnycubicCloudEntity, SwitchEntity):
    """Representation of a Anycubic switch."""

    entity_description: AnycubicSwitchEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicSwitchEntityDescription,
    ) -> None:
        """Initiate Anycubic Switch."""
        super().__init__(hass, coordinator, printer_id, entity_description)

    @property
    def is_on(self) -> bool:
        """Return true if the switch is on."""
        return bool(
            printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the device on."""

        await self.coordinator.switch_on_event(self._printer_id, self.entity_description.key)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the device off."""

        await self.coordinator.switch_off_event(self._printer_id, self.entity_description.key)
