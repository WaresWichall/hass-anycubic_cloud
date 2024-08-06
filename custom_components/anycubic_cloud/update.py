"""Platform for update integration."""
from __future__ import annotations
from typing import Any

from homeassistant.components.update import (
    UpdateDeviceClass,
    UpdateEntity,
    UpdateEntityDescription,
    UpdateEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    EntityCategory,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    CONF_PRINTER_ID_LIST,
    COORDINATOR,
    DOMAIN,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_attributes_for_key, printer_entity_unique_id, printer_state_for_key


MULTI_COLOR_BOX_UPDATE_TYPES = (
    UpdateEntityDescription(
        key="multi_color_box_fw_version",
        translation_key="multi_color_box_fw_version",
        device_class=UpdateDeviceClass.FIRMWARE,
        entity_category=EntityCategory.CONFIG,
    ),
)

UPDATE_TYPES = (
    UpdateEntityDescription(
        key="fw_version",
        translation_key="fw_version",
        device_class=UpdateDeviceClass.FIRMWARE,
        entity_category=EntityCategory.CONFIG,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    update_entities: list[AnycubicUpdateEntity] = []

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        if printer_state_for_key(coordinator, printer_id, 'supports_function_multi_color_box'):
            for description in MULTI_COLOR_BOX_UPDATE_TYPES:
                update_entities.append(AnycubicUpdateEntity(coordinator, printer_id, description))

        for description in UPDATE_TYPES:
            update_entities.append(AnycubicUpdateEntity(coordinator, printer_id, description))

    async_add_entities(update_entities)


class AnycubicUpdateEntity(AnycubicCloudEntity, UpdateEntity):
    """Representation of a Anycubic Cloud sensor."""

    entity_description: UpdateEntityDescription
    _attr_supported_features = (
        UpdateEntityFeature.INSTALL | UpdateEntityFeature.PROGRESS
    )

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: UpdateEntityDescription,
    ) -> None:
        """Initiate Anycubic Sensor."""
        super().__init__(coordinator, printer_id)
        self.entity_description = entity_description
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, entity_description.key)

    @property
    def installed_version(self) -> str:
        """Version currently in use."""
        return printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)

    @property
    def latest_version(self) -> str:
        """Latest version available for install."""
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        return fw_attr['latest_version']

    @property
    def in_progress(self) -> bool:
        """Update installation in progress."""
        fw_attr = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        return fw_attr['in_progress']

    async def async_install(
        self, version: str | None, backup: bool, **kwargs: Any
    ) -> None:
        await self.coordinator.fw_update_event(self._printer_id, self.entity_description.key)
