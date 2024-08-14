"""Switches for Anycubic Cloud."""
from __future__ import annotations
from typing import Any

from homeassistant.components.switch import (
    SwitchEntity,
    SwitchEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_PRINTER_ID_LIST, COORDINATOR, DOMAIN
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_entity_unique_id, printer_state_for_key

PRIMARY_MULTI_COLOR_BOX_SWITCH_TYPES = (
    SwitchEntityDescription(
        key="multi_color_box_runout_refill",
        translation_key="multi_color_box_runout_refill",
    ),
)

SECONDARY_MULTI_COLOR_BOX_SWITCH_TYPES = (
    SwitchEntityDescription(
        key="secondary_multi_color_box_runout_refill",
        translation_key="secondary_multi_color_box_runout_refill",
    ),
)

SWITCH_TYPES = (
)

GLOBAL_SWITCH_TYPES = (
    SwitchEntityDescription(
        key="manual_mqtt_connection_enabled",
        translation_key="manual_mqtt_connection_enabled",
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud switch entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    entities: list[AnycubicSwitch] = []
    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        if printer_state_for_key(coordinator, printer_id, 'supports_function_multi_color_box'):
            for description in PRIMARY_MULTI_COLOR_BOX_SWITCH_TYPES:
                entities.append(AnycubicSwitch(coordinator, printer_id, description))
        if printer_state_for_key(coordinator, printer_id, 'connected_ace_units') > 1:
            for description in SECONDARY_MULTI_COLOR_BOX_SWITCH_TYPES:
                entities.append(AnycubicSwitch(coordinator, printer_id, description))

        for description in SWITCH_TYPES:
            entities.append(AnycubicSwitch(coordinator, printer_id, description))

    for description in GLOBAL_SWITCH_TYPES:
        entities.append(AnycubicSwitch(coordinator, entry.data[CONF_PRINTER_ID_LIST][0], description))

    async_add_entities(entities)


class AnycubicSwitch(AnycubicCloudEntity, SwitchEntity):
    """Representation of a Anycubic switch."""

    entity_description: SwitchEntityDescription

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: SwitchEntityDescription,
    ) -> None:
        """Initiate Anycubic Switch."""
        super().__init__(coordinator, printer_id)
        self.entity_description = entity_description
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, entity_description.key)

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
