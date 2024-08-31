"""Support for Anycubic Cloud button."""
from __future__ import annotations

from typing import Any, TYPE_CHECKING

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
    ENTITY_ID_DRYING_START_PRESET_,
    MAX_DRYING_PRESETS,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_attributes_for_key, printer_entity_unique_id, printer_state_for_key

PRIMARY_DRYING_PRESET_BUTTON_TYPES = list([
    ButtonEntityDescription(
        key=f"{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        translation_key=f"{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
    ) for x in range(MAX_DRYING_PRESETS)
])

SECONDARY_DRYING_PRESET_BUTTON_TYPES = list([
    ButtonEntityDescription(
        key=f"secondary_{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
        translation_key=f"secondary_{ENTITY_ID_DRYING_START_PRESET_}{x + 1}",
    ) for x in range(MAX_DRYING_PRESETS)
])

PRIMARY_MULTI_COLOR_BOX_BUTTON_TYPES = (
    ButtonEntityDescription(
        key="drying_stop",
        translation_key="drying_stop",
    ),
)

SECONDARY_MULTI_COLOR_BOX_BUTTON_TYPES = (
    ButtonEntityDescription(
        key="secondary_drying_stop",
        translation_key="secondary_drying_stop",
    ),
)

BUTTON_TYPES = (
    ButtonEntityDescription(
        key="pause_print",
        translation_key="pause_print",
    ),
    ButtonEntityDescription(
        key="resume_print",
        translation_key="resume_print",
    ),
    ButtonEntityDescription(
        key="cancel_print",
        translation_key="cancel_print",
    ),
    ButtonEntityDescription(
        key="request_file_list_local",
        translation_key="request_file_list_local",
    ),
    ButtonEntityDescription(
        key="request_file_list_udisk",
        translation_key="request_file_list_udisk",
    ),
)

GLOBAL_BUTTON_TYPES = (
    ButtonEntityDescription(
        key="request_file_list_cloud",
        translation_key="request_file_list_cloud",
    ),
    ButtonEntityDescription(
        key="refresh_mqtt_connection",
        translation_key="refresh_mqtt_connection",
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

    def add_ace_entities(main_button_types, drying_preset_types):
        for description in drying_preset_types:
            num = description.key[-1]
            preset_duration = entry.options.get(f"{CONF_DRYING_PRESET_DURATION_}{num}")
            preset_temperature = entry.options.get(f"{CONF_DRYING_PRESET_TEMPERATURE_}{num}")
            if preset_duration and preset_temperature and int(preset_temperature) > 0:
                entity_list.append(AnycubicCloudButton(coordinator, printer_id, description))

        for description in main_button_types:
            entity_list.append(AnycubicCloudButton(coordinator, printer_id, description))

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:

        if printer_state_for_key(coordinator, printer_id, 'supports_function_multi_color_box'):

            add_ace_entities(
                PRIMARY_MULTI_COLOR_BOX_BUTTON_TYPES,
                PRIMARY_DRYING_PRESET_BUTTON_TYPES
            )

        if printer_state_for_key(coordinator, printer_id, 'connected_ace_units') > 1:

            add_ace_entities(
                SECONDARY_MULTI_COLOR_BOX_BUTTON_TYPES,
                SECONDARY_DRYING_PRESET_BUTTON_TYPES
            )

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
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, description.key)

    async def async_press(self) -> None:
        """Press the button."""
        if TYPE_CHECKING:
            assert self.coordinator.anycubic_api, "Connection to API is missing"

        await self.coordinator.button_press_event(self._printer_id, self.entity_description.key)

    @property
    def state_attributes(self) -> dict[str, Any] | None:
        """Return state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return super().state_attributes
