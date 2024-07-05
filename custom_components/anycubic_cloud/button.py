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
    CONF_PRINTER_ID_LIST,
    COORDINATOR,
    DOMAIN,
    MAX_DRYING_PRESETS,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity

DRYING_PRESET_BUTTON_TYPES = list([
    ButtonEntityDescription(
        key=f"drying_start_preset_{x + 1}",
        translation_key=f"drying_start_preset_{x + 1}",
    ) for x in range(MAX_DRYING_PRESETS)
])

MULTI_COLOR_BOX_BUTTON_TYPES = (
    ButtonEntityDescription(
        key="drying_stop",
        translation_key="drying_stop",
    ),
)

BUTTON_TYPES = (
    ButtonEntityDescription(
        key="cancel_print",
        translation_key="cancel_print",
    ),
)

GLOBAL_BUTTON_TYPES = (
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

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:

        if coordinator.data[printer_id]["supports_function_multi_color_box"]:

            for description in DRYING_PRESET_BUTTON_TYPES:
                num = description.key[-1]
                preset_duration = entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
                preset_temperature = entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
                if preset_duration and preset_temperature and int(preset_temperature) > 0:
                    entity_list.append(AnycubicCloudButton(coordinator, printer_id, description))

            for description in MULTI_COLOR_BOX_BUTTON_TYPES:
                entity_list.append(AnycubicCloudButton(coordinator, printer_id, description))

        for description in BUTTON_TYPES:
            entity_list.append(AnycubicCloudButton(coordinator, printer_id, description))

    for description in GLOBAL_BUTTON_TYPES:
        entity_list.append(AnycubicCloudButton(coordinator, entry.data[CONF_PRINTER_ID_LIST][0], description))

    async_add_entities(entity_list)


class AnycubicCloudButton(AnycubicCloudEntity, ButtonEntity):
    """A button for Anycubic Cloud."""

    entity_description: ButtonEntityDescription

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        description: ButtonEntityDescription,
    ) -> None:
        """Initialize."""
        super().__init__(coordinator, printer_id)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.data[self._printer_id]['machine_mac']}-{self.entity_description.key}"

    async def async_press(self) -> None:
        """Press the button."""
        if TYPE_CHECKING:
            assert self.coordinator.anycubic_api, "Connection to API is missing"

        await self.coordinator.button_press_event(self._printer_id, self.entity_description.key)
