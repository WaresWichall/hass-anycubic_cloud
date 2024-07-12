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
    CONF_SLOT_NUMBER,
    CONF_SLOT_COLOR_RED,
    CONF_SLOT_COLOR_GREEN,
    CONF_SLOT_COLOR_BLUE,
    CONF_BOX_ID,
    CONF_FINISHED,
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
            vol.Required(CONF_SLOT_NUMBER): cv.positive_int,
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
        slot_index = service.data[CONF_SLOT_NUMBER] - 1
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


class MultiColorBoxSetSlotAbs(BaseMultiColorBoxSetSlot):
    """Set multi color box abs slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_abs_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPacf(BaseMultiColorBoxSetSlot):
    """Set multi color box pacf slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_pacf_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPc(BaseMultiColorBoxSetSlot):
    """Set multi color box pc slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_pc_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotAsa(BaseMultiColorBoxSetSlot):
    """Set multi color box asa slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_asa_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotHips(BaseMultiColorBoxSetSlot):
    """Set multi color box hips slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_hips_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPa(BaseMultiColorBoxSetSlot):
    """Set multi color box pa slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_pa_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxSetSlotPlaSe(BaseMultiColorBoxSetSlot):
    """Set multi color box pla se slot."""

    async def async_set_box_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int,
    ) -> None:

        await printer.multi_color_box_set_pla_se_slot(
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )


class MultiColorBoxFilamentExtrude(AnycubicCloudServiceCall):
    """Extrude filament."""

    schema = AnycubicCloudServiceCall.schema.extend(
        {
            vol.Required(CONF_SLOT_NUMBER): cv.positive_int,
            vol.Optional(CONF_BOX_ID): cv.positive_int,
            vol.Optional(CONF_FINISHED): cv.boolean,
        }
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self.get_printer(service)
        box_id = service.data.get(CONF_BOX_ID)
        finished = service.data.get(CONF_FINISHED)
        if box_id is None:
            box_id = 0
        slot_index = service.data[CONF_SLOT_NUMBER] - 1
        await printer.multi_color_box_feed_filament(
            slot_index=slot_index,
            box_id=box_id,
            finish=bool(finished)
        )


class MultiColorBoxFilamentRetract(AnycubicCloudServiceCall):
    """Retract filament."""

    schema = AnycubicCloudServiceCall.schema.extend(
        {
            vol.Optional(CONF_BOX_ID): cv.positive_int,
        }
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self.get_printer(service)
        box_id = service.data.get(CONF_BOX_ID)
        if box_id is None:
            box_id = 0
        await printer.multi_color_box_retract_filament(
            box_id=box_id,
        )


SERVICES = (
    ("multi_color_box_set_slot_pla", MultiColorBoxSetSlotPla),
    ("multi_color_box_set_slot_petg", MultiColorBoxSetSlotPetg),
    ("multi_color_box_set_slot_abs", MultiColorBoxSetSlotAbs),
    ("multi_color_box_set_slot_pacf", MultiColorBoxSetSlotPacf),
    ("multi_color_box_set_slot_pc", MultiColorBoxSetSlotPc),
    ("multi_color_box_set_slot_asa", MultiColorBoxSetSlotAsa),
    ("multi_color_box_set_slot_hips", MultiColorBoxSetSlotHips),
    ("multi_color_box_set_slot_pa", MultiColorBoxSetSlotPa),
    ("multi_color_box_set_slot_pla_se", MultiColorBoxSetSlotPlaSe),
    ("multi_color_box_filament_extrude", MultiColorBoxFilamentExtrude),
    ("multi_color_box_filament_retract", MultiColorBoxFilamentRetract),
)
