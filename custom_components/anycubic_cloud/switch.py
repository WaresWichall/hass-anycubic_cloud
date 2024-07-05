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

MULTI_COLOR_BOX_SWITCH_TYPES = (
    SwitchEntityDescription(
        key="multi_color_box_auto_feed",
        translation_key="multi_color_box_auto_feed",
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
        if coordinator.data[printer_id]["supports_function_multi_color_box"]:
            for description in MULTI_COLOR_BOX_SWITCH_TYPES:
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
        self._attr_unique_id = f"{coordinator.data[self._printer_id]['machine_mac']}-{entity_description.key}"

    @property
    def is_on(self) -> bool:
        """Return true if the switch is on."""
        return bool(
            self.coordinator.data[self._printer_id][self.entity_description.key]
        )

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the device on."""

        await self.coordinator.switch_on_event(self._printer_id, self.entity_description.key)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the device off."""

        await self.coordinator.switch_off_event(self._printer_id, self.entity_description.key)
