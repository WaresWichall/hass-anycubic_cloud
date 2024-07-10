"""Service calls related dependencies for Anycubic Cloud component."""

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import (
    config_validation as cv,
    selector,
)

from .anycubic_data_base import (
    AnycubicMaterialColor,
    AnycubicPrinter,
)

from .const import (
    ATTR_CONFIG_ENTRY,
    CONF_PRINTER_ID,
    CONF_SLOT_INDEX,
    CONF_SLOT_COLOR_RED,
    CONF_SLOT_COLOR_GREEN,
    CONF_SLOT_COLOR_BLUE,
    CONF_BOX_ID,
    COORDINATOR,
    DOMAIN,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator


class AnycubicCloudServiceCall:
    """Parent class for all Anycubic Cloud service calls."""

    schema = vol.Schema({
        vol.Required(ATTR_CONFIG_ENTRY): selector.ConfigEntrySelector(
            {
                "integration": DOMAIN,
            }
        ),
        vol.Required(CONF_PRINTER_ID): cv.positive_int,
    })

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize service call."""
        self.hass = hass

    def get_coordinator(self, service: ServiceCall) -> AnycubicCloudDataUpdateCoordinator:
        """Get AnycubicCloudDataUpdateCoordinator object."""
        entry_id = service.data[ATTR_CONFIG_ENTRY]

        entry = self.hass.config_entries.async_get_entry(entry_id)

        coordinator: AnycubicCloudDataUpdateCoordinator = self.hass.data[DOMAIN][entry.entry_id][
            COORDINATOR
        ]

        return coordinator

    def get_printer(self, service: ServiceCall) -> AnycubicPrinter:
        """Get AnycubicPrinter object."""

        coordinator = self.get_coordinator(service)
        printer_id = service.data[CONF_PRINTER_ID]
        return coordinator.get_printer_for_id(printer_id)

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""
        raise NotImplementedError


class BaseMultiColorBoxSetSlot(AnycubicCloudServiceCall):
    """Base for setting multi color box slots."""

    schema = AnycubicCloudServiceCall.schema.extend(
        {
            vol.Optional(CONF_BOX_ID): cv.positive_int,
            vol.Required(CONF_SLOT_INDEX): cv.positive_int,
            vol.Required(CONF_SLOT_COLOR_RED): vol.All(
                vol.Coerce(int), vol.Range(min=0, max=255)
            ),
            vol.Required(CONF_SLOT_COLOR_GREEN): vol.All(
                vol.Coerce(int), vol.Range(min=0, max=255)
            ),
            vol.Required(CONF_SLOT_COLOR_BLUE): vol.All(
                vol.Coerce(int), vol.Range(min=0, max=255)
            ),
        }
    )

    async def async_set_box_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:
        raise NotImplementedError

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self.get_printer(service)
        box_id = service.data.get(CONF_BOX_ID)
        if box_id is None:
            box_id = 0
        slot_index = service.data[CONF_SLOT_INDEX]
        slot_color = AnycubicMaterialColor(
            int(service.data[CONF_SLOT_COLOR_RED]),
            int(service.data[CONF_SLOT_COLOR_GREEN]),
            int(service.data[CONF_SLOT_COLOR_BLUE]),
        )
        await self.async_set_box_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPla(BaseMultiColorBoxSetSlot):
    """Set multi color box pla slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_pla_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPetg(BaseMultiColorBoxSetSlot):
    """Set multi color box petg slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_petg_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


SERVICES = (
    ("multi_color_box_set_slot_pla", MultiColorBoxSetSlotPla),
    ("multi_color_box_set_slot_petg", MultiColorBoxSetSlotPetg),
)