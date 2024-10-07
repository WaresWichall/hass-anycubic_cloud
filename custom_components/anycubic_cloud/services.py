"""Service calls related dependencies for Anycubic Cloud component."""
from __future__ import annotations
from typing import TYPE_CHECKING

import asyncio
import voluptuous as vol

from homeassistant.components.file_upload import process_uploaded_file
from homeassistant.const import (
    ATTR_DEVICE_ID,
    CONF_DEVICE_ID,
    CONF_EVENT_DATA,
    CONF_FILENAME,
    CONF_TYPE,
)
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers import (
    config_validation as cv,
    selector,
)

from .anycubic_cloud_api.anycubic_data_model_printer_properties import (
    AnycubicMaterialColor,
)

from .anycubic_cloud_api.anycubic_data_model_printer import (
    AnycubicPrinter,
)

from .anycubic_cloud_api.anycubic_data_model_print_response import (
    AnycubicPrintResponse,
)

from .const import (
    AC_EVENT_PRINT_CLOUD_START,
    ATTR_ANYCUBIC_EVENT,
    ATTR_CONFIG_ENTRY,
    CONF_BOX_ID,
    CONF_FILE_ID,
    CONF_FINISHED,
    CONF_LAYERS,
    CONF_PRINTER_ID,
    CONF_PRINTER_NAME,
    CONF_SLOT_COLOR_BLUE,
    CONF_SLOT_COLOR_GREEN,
    CONF_SLOT_COLOR_RED,
    CONF_SLOT_NUMBER,
    CONF_SPEED,
    CONF_SPEED_MODE,
    CONF_TEMPERATURE,
    CONF_TIME,
    CONF_UPLOADED_GCODE_FILE,
    COORDINATOR,
    DOMAIN,
    LOGGER,
    MAX_FILE_UPLOAD_RETRIES,
)

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


def build_anycubic_service_schema(
    input_service_schema={},
    with_slot_number=False,
    with_slot_colours=False,
    with_opt_box=False,
    with_speed=False,
    with_speed_mode=False,
    with_temperature=False,
    with_time=False,
    with_layers=False,
):
    service_schema = {
        **input_service_schema,
    }

    if with_slot_number:
        service_schema[vol.Required(CONF_SLOT_NUMBER)] = cv.positive_int

    if with_slot_colours:
        service_schema[vol.Required(CONF_SLOT_COLOR_RED)] = vol.All(
            vol.Coerce(int), vol.Range(min=0, max=255)
        )
        service_schema[vol.Required(CONF_SLOT_COLOR_GREEN)] = vol.All(
            vol.Coerce(int), vol.Range(min=0, max=255)
        )
        service_schema[vol.Required(CONF_SLOT_COLOR_BLUE)] = vol.All(
            vol.Coerce(int), vol.Range(min=0, max=255)
        )

    if with_opt_box:
        service_schema[vol.Optional(CONF_BOX_ID)] = cv.positive_int

    if with_speed:
        service_schema[vol.Required(CONF_SPEED)] = cv.positive_int

    if with_speed_mode:
        service_schema[vol.Required(CONF_SPEED_MODE)] = cv.positive_int

    if with_temperature:
        service_schema[vol.Required(CONF_TEMPERATURE)] = cv.positive_int

    if with_time:
        service_schema[vol.Required(CONF_TIME)] = cv.positive_float

    if with_layers:
        service_schema[vol.Required(CONF_LAYERS)] = cv.positive_int

    return vol.Schema(
        vol.All(
            cv.make_entity_service_schema(
                {
                    vol.Required(ATTR_CONFIG_ENTRY): selector.ConfigEntrySelector(
                        {
                            "integration": DOMAIN,
                        }
                    ),
                    vol.Optional(ATTR_DEVICE_ID): cv.string,
                    vol.Optional(CONF_PRINTER_ID): cv.positive_int,
                    **service_schema,
                }
            ),
            cv.has_at_least_one_key(
                ATTR_DEVICE_ID,
                CONF_PRINTER_ID,
            ),
        ),
    )


class AnycubicCloudServiceCall:
    """Parent class for all Anycubic Cloud service calls."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize service call."""
        self.hass = hass
        self._device_id = None

    def _get_coordinator(self, service: ServiceCall) -> AnycubicCloudDataUpdateCoordinator:
        """Get AnycubicCloudDataUpdateCoordinator object."""
        entry_id = service.data[ATTR_CONFIG_ENTRY]

        entry = self.hass.config_entries.async_get_entry(entry_id)

        coordinator: AnycubicCloudDataUpdateCoordinator = self.hass.data[DOMAIN][entry.entry_id][
            COORDINATOR
        ]

        return coordinator

    def _get_printer(self, service: ServiceCall) -> AnycubicPrinter:
        """Get AnycubicPrinter object."""

        coordinator = self._get_coordinator(service)

        if service.data.get(ATTR_DEVICE_ID) is not None:
            device_id = service.data[ATTR_DEVICE_ID]
            if isinstance(device_id, list):
                if len(device_id) == 1:
                    device_id = device_id[0]
                else:
                    raise ServiceValidationError(
                        "Can only call services for one printer at a time."
                    )

            self._device_id = device_id

            printer = coordinator.get_printer_for_device_id(self._device_id)
        else:
            printer_id = service.data[CONF_PRINTER_ID]
            printer = coordinator.get_printer_for_id(printer_id)

        if printer is None:
            raise ServiceValidationError(
                "Could not find Anycubic printer for service call."
            )

        return printer

    def _get_box_id(self, service: ServiceCall) -> int:
        box_id = service.data.get(CONF_BOX_ID)
        if box_id is None:
            box_id = 0

        return box_id

    def _get_slot_num_list(self, service: ServiceCall) -> list:
        slot_idx_list = None
        slot_num_list = service.data.get(CONF_SLOT_NUMBER)

        if slot_num_list is not None:
            slot_idx_list = list([x - 1 for x in slot_num_list])

        return slot_idx_list

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""
        raise NotImplementedError


class BaseMultiColorBoxSetSlot(AnycubicCloudServiceCall):
    """Base for setting multi color box slots."""

    schema = build_anycubic_service_schema(
        with_opt_box=True,
        with_slot_number=True,
        with_slot_colours=True,
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

        coordinator = self._get_coordinator(service)
        printer = self._get_printer(service)
        box_id = self._get_box_id(service)
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
        await coordinator.force_state_update()


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

    schema = build_anycubic_service_schema(
        input_service_schema={
            vol.Optional(CONF_FINISHED): cv.boolean,
        },
        with_opt_box=True,
        with_slot_number=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer(service)
        box_id = self._get_box_id(service)
        finished = service.data.get(CONF_FINISHED)
        slot_index = service.data[CONF_SLOT_NUMBER] - 1
        await printer.multi_color_box_feed_filament(
            slot_index=slot_index,
            box_id=box_id,
            finish=bool(finished)
        )


class MultiColorBoxFilamentRetract(AnycubicCloudServiceCall):
    """Retract filament."""

    schema = build_anycubic_service_schema(
        with_opt_box=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer(service)
        box_id = self._get_box_id(service)
        await printer.multi_color_box_retract_filament(
            box_id=box_id,
        )


class BasePrintWithFile(AnycubicCloudServiceCall):
    """ Base for print with file service calls """

    schema = build_anycubic_service_schema(
        input_service_schema={
            vol.Required(CONF_UPLOADED_GCODE_FILE): selector.FileSelector(
                selector.FileSelectorConfig(accept=".gcode")
            ),
            vol.Optional(CONF_SLOT_NUMBER): vol.All(cv.ensure_list, [cv.positive_int]),
        }
    )

    def _read_uploaded_file_bytes(
        self, uploaded_file_id: str
    ):
        with process_uploaded_file(self.hass, uploaded_file_id) as file_path:
            filename = file_path.name
            contents = file_path.read_bytes()

        return filename, contents

    async def _get_gcode_data(self, service: ServiceCall):
        try:
            for x in range(MAX_FILE_UPLOAD_RETRIES):
                try:
                    file_name, gcode_bytes = await self.hass.async_add_executor_job(
                        self._read_uploaded_file_bytes, service.data[CONF_UPLOADED_GCODE_FILE]
                    )
                    break
                except ValueError:
                    if x < MAX_FILE_UPLOAD_RETRIES - 1:
                        await asyncio.sleep(1)
                    else:
                        raise

        except Exception as e:
            LOGGER.warning(f"Gcode file read error: {e}")
            raise ServiceValidationError(
                "Could not read gcode file."
            )

        return file_name, gcode_bytes

    def _async_fire_event(
        self,
        service: ServiceCall,
        printer: AnycubicPrinter,
        print_response: AnycubicPrintResponse,
    ):
        # Fire event
        data = {
            CONF_PRINTER_ID: printer.id,
            CONF_PRINTER_NAME: printer.name,
            CONF_DEVICE_ID: self._device_id,
            CONF_TYPE: AC_EVENT_PRINT_CLOUD_START,
            CONF_EVENT_DATA: print_response.event_dict,
        }
        self.hass.bus.async_fire(ATTR_ANYCUBIC_EVENT, data)


class PrintAndUploadSaveInCloud(BasePrintWithFile):
    """Print and upload (save in user cloud)."""

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        file_name, gcode_bytes = await self._get_gcode_data(service)
        printer = self._get_printer(service)
        slot_idx_list = self._get_slot_num_list(service)

        print_response = await printer.print_and_upload_save_in_cloud(
            file_name=file_name,
            file_bytes=gcode_bytes,
            slot_index_list=slot_idx_list,
        )

        if print_response:
            self._async_fire_event(
                service=service,
                printer=printer,
                print_response=print_response,
            )


class PrintAndUploadNoCloudSave(BasePrintWithFile):
    """Print and upload (no user cloud save)."""

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        file_name, gcode_bytes = await self._get_gcode_data(service)
        printer = self._get_printer(service)
        slot_idx_list = self._get_slot_num_list(service)

        print_response = await printer.print_and_upload_no_cloud_save(
            file_name=file_name,
            file_bytes=gcode_bytes,
            slot_index_list=slot_idx_list,
        )

        if print_response:
            self._async_fire_event(
                service=service,
                printer=printer,
                print_response=print_response,
            )


class BaseDeletePrinterFile(AnycubicCloudServiceCall):
    """ Base for printer file deletions """

    schema = build_anycubic_service_schema(
        input_service_schema={
            vol.Required(CONF_FILENAME): cv.string,
        }
    )


class DeleteFileLocal(BaseDeletePrinterFile):
    """Delete a file (local)"""

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        file_name = service.data[CONF_FILENAME]
        printer = self._get_printer(service)

        try:

            await printer.delete_local_file(
                file_name=file_name,
            )
            await asyncio.sleep(2)
            await printer.request_local_file_list()
            await asyncio.sleep(5)
            await printer.request_local_file_list()

        except Exception as error:
            raise HomeAssistantError(error) from error


class DeleteFileUdisk(BaseDeletePrinterFile):
    """Delete a file (USB Disk)"""

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        file_name = service.data[CONF_FILENAME]
        printer = self._get_printer(service)

        try:

            await printer.delete_udisk_file(
                file_name=file_name,
            )
            await asyncio.sleep(2)
            await printer.request_udisk_file_list()
            await asyncio.sleep(5)
            await printer.request_udisk_file_list()

        except Exception as error:
            raise HomeAssistantError(error) from error


class DeleteFileCloud(AnycubicCloudServiceCall):
    """Delete a file (Cloud)"""

    schema = build_anycubic_service_schema(
        input_service_schema={
            vol.Required(CONF_FILE_ID): cv.positive_int,
        }
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        file_id = service.data[CONF_FILE_ID]

        coordinator = self._get_coordinator(service)

        try:

            success = await coordinator.anycubic_api.delete_file_from_cloud(
                file_id=file_id,
            )

        except Exception as error:
            raise HomeAssistantError(error) from error

        if not success:
            raise HomeAssistantError("Failed to delete cloud file.")

        else:
            await asyncio.sleep(5)
            await coordinator.refresh_cloud_files()


class BaseChangePrintSetting(AnycubicCloudServiceCall):
    """ Base for change print setting service calls """

    def _get_printer_if_printing(
        self,
        service: ServiceCall,
    ):
        printer = self._get_printer(service)

        if not printer.is_busy:
            raise ServiceValidationError(
                "Printer is currently idle."
            )

        if not printer.latest_project:
            raise ServiceValidationError(
                "No print project found."
            )

        if not printer.latest_project_print_in_progress:
            raise ServiceValidationError(
                "Printer is not currently printing."
            )

        return printer


class ChangePrintSpeedMode(BaseChangePrintSetting):
    """Change print speed mode"""

    schema = build_anycubic_service_schema(
        with_speed_mode=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_speed_mode(
                service.data[CONF_SPEED_MODE],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintTargetNozzleTemperature(BaseChangePrintSetting):
    """Change print target nozzle temperature"""

    schema = build_anycubic_service_schema(
        with_temperature=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_target_nozzle_temp(
                service.data[CONF_TEMPERATURE],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintTargetHotbedTemperature(BaseChangePrintSetting):
    """Change print target hotbed temperature"""

    schema = build_anycubic_service_schema(
        with_temperature=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_target_hotbed_temp(
                service.data[CONF_TEMPERATURE],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintFanSpeed(BaseChangePrintSetting):
    """Change print fan speed"""

    schema = build_anycubic_service_schema(
        with_speed=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_fan_speed_pct(
                service.data[CONF_SPEED],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintAuxFanSpeed(BaseChangePrintSetting):
    """Change print aux fan speed"""

    schema = build_anycubic_service_schema(
        with_speed=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_aux_fan_speed_pct(
                service.data[CONF_SPEED],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintBoxFanSpeed(BaseChangePrintSetting):
    """Change print box fan speed"""

    schema = build_anycubic_service_schema(
        with_speed=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_box_fan_level(
                service.data[CONF_SPEED],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintBottomLayers(BaseChangePrintSetting):
    """Change print bottom layers"""

    schema = build_anycubic_service_schema(
        with_layers=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_bottom_layers(
                service.data[CONF_LAYERS],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintBottomTime(BaseChangePrintSetting):
    """Change print bottom time"""

    schema = build_anycubic_service_schema(
        with_time=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_bottom_time(
                service.data[CONF_TIME],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintOffTime(BaseChangePrintSetting):
    """Change print off time"""

    schema = build_anycubic_service_schema(
        with_time=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_off_time(
                service.data[CONF_TIME],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


class ChangePrintOnTime(BaseChangePrintSetting):
    """Change print on time"""

    schema = build_anycubic_service_schema(
        with_time=True,
    )

    async def async_call_service(self, service: ServiceCall) -> None:
        """Execute service call."""

        printer = self._get_printer_if_printing(service)

        try:
            await printer.change_print_setting_on_time(
                service.data[CONF_TIME],
            )
        except Exception as error:
            raise HomeAssistantError(error) from error


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
    ("print_and_upload_save_in_cloud", PrintAndUploadSaveInCloud),
    ("print_and_upload_no_cloud_save", PrintAndUploadNoCloudSave),
    ("delete_file_local", DeleteFileLocal),
    ("delete_file_udisk", DeleteFileUdisk),
    ("delete_file_cloud", DeleteFileCloud),
    ("change_print_speed_mode", ChangePrintSpeedMode),
    ("change_print_target_nozzle_temperature", ChangePrintTargetNozzleTemperature),
    ("change_print_target_hotbed_temperature", ChangePrintTargetHotbedTemperature),
    ("change_print_fan_speed", ChangePrintFanSpeed),
    ("change_print_aux_fan_speed", ChangePrintAuxFanSpeed),
    ("change_print_box_fan_speed", ChangePrintBoxFanSpeed),
    ("change_print_bottom_layers", ChangePrintBottomLayers),
    ("change_print_bottom_time", ChangePrintBottomTime),
    ("change_print_off_time", ChangePrintOffTime),
    ("change_print_on_time", ChangePrintOnTime),
)
