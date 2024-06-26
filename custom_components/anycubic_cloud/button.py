"""Support for Anycubic Cloud button."""
from __future__ import annotations

from typing import TYPE_CHECKING

from homeassistant.components.button import (
    ButtonEntity,
    ButtonEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_DRYING_PRESET_DURATION_,
    CONF_DRYING_PRESET_TEMPERATURE_,
    COORDINATOR,
    DOMAIN,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity

BUTTON_PRESET_TYPES = (
    ButtonEntityDescription(
        key="drying_start_preset_1",
        translation_key="drying_start_preset_1",
    ),
    ButtonEntityDescription(
        key="drying_start_preset_2",
        translation_key="drying_start_preset_2",
    ),
)

BUTTON_TYPES = (
    ButtonEntityDescription(
        key="drying_stop",
        translation_key="drying_stop",
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the button from a config entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    entity_list = list()

    for description in BUTTON_PRESET_TYPES:
        num = description.key[-1]
        preset_duration = entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
        preset_temperature = entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
        if preset_duration and preset_temperature:
            entity_list.append(AnycubicCloudButton(coordinator, description))

    for description in BUTTON_TYPES:
        entity_list.append(AnycubicCloudButton(coordinator, description))

    async_add_entities(entity_list)


class AnycubicCloudButton(AnycubicCloudEntity, ButtonEntity):
    """A button for Anycubic Cloud."""

    entity_description: ButtonEntityDescription

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        description: ButtonEntityDescription,
    ) -> None:
        """Initialize."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.data['machine_mac']}-{self.entity_description.key}"

    async def async_press(self) -> None:
        """Press the button."""
        if TYPE_CHECKING:
            assert self.coordinator.anycubic_api, "Connection to API is missing"

        await self.coordinator.button_press_event(self.entity_description.key)
