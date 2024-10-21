"""Sensors for Anycubic Cloud Printers."""
from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    PERCENTAGE,
    Platform,
    UnitOfLength,
    UnitOfTemperature,
    UnitOfTime,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    COORDINATOR,
    DOMAIN,
    UNIT_LAYERS,
    PrinterEntityType,
)
from .entity import AnycubicCloudEntity, AnycubicCloudEntityDescription
from .helpers import printer_attributes_for_key, printer_state_for_key

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator


@dataclass(frozen=True)
class AnycubicSensorEntityDescription(
    SensorEntityDescription, AnycubicCloudEntityDescription
):
    """Describes Anycubic Cloud sensor entity."""
    not_measured: bool = False


PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
    AnycubicSensorEntityDescription(
        key="ace_current_temperature",
        translation_key="ace_current_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
    AnycubicSensorEntityDescription(
        key="ace_spools",
        translation_key="ace_spools",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="dry_status_target_temperature",
        translation_key="dry_status_target_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
    AnycubicSensorEntityDescription(
        key="dry_status_total_duration",
        translation_key="dry_status_total_duration",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
    AnycubicSensorEntityDescription(
        key="dry_status_remaining_time",
        translation_key="dry_status_remaining_time",
        printer_entity_type=PrinterEntityType.ACE_PRIMARY,
    ),
])


SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
    AnycubicSensorEntityDescription(
        key="secondary_ace_current_temperature",
        translation_key="secondary_ace_current_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
    AnycubicSensorEntityDescription(
        key="secondary_ace_spools",
        translation_key="secondary_ace_spools",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="secondary_dry_status_target_temperature",
        translation_key="secondary_dry_status_target_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
    AnycubicSensorEntityDescription(
        key="secondary_dry_status_total_duration",
        translation_key="secondary_dry_status_total_duration",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
    AnycubicSensorEntityDescription(
        key="secondary_dry_status_remaining_time",
        translation_key="secondary_dry_status_remaining_time",
        printer_entity_type=PrinterEntityType.ACE_SECONDARY,
    ),
])

FDM_SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
    AnycubicSensorEntityDescription(
        key="job_speed_mode",
        translation_key="job_speed_mode",
        printer_entity_type=PrinterEntityType.FDM,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="print_speed_pct",
        translation_key="print_speed_pct",
        printer_entity_type=PrinterEntityType.FDM,
    ),
    AnycubicSensorEntityDescription(
        key="fan_speed_pct",
        translation_key="fan_speed_pct",
        printer_entity_type=PrinterEntityType.FDM,
    ),
    AnycubicSensorEntityDescription(
        key="curr_nozzle_temp",
        translation_key="curr_nozzle_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.FDM,
    ),
    AnycubicSensorEntityDescription(
        key="curr_hotbed_temp",
        translation_key="curr_hotbed_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.FDM,
    ),
    AnycubicSensorEntityDescription(
        key="target_nozzle_temp",
        translation_key="target_nozzle_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.FDM,
    ),
    AnycubicSensorEntityDescription(
        key="target_hotbed_temp",
        translation_key="target_hotbed_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        printer_entity_type=PrinterEntityType.FDM,
    ),
])

LCD_SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
    AnycubicSensorEntityDescription(
        key="job_on_time",
        translation_key="job_on_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_off_time",
        translation_key="job_off_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_bottom_time",
        translation_key="job_bottom_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_model_height",
        translation_key="job_model_height",
        native_unit_of_measurement=UnitOfLength.MILLIMETERS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_anti_alias_count",
        translation_key="job_anti_alias_count",
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_bottom_layers",
        translation_key="job_bottom_layers",
        native_unit_of_measurement=UNIT_LAYERS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_z_up_height",
        translation_key="job_z_up_height",
        native_unit_of_measurement=UnitOfLength.MILLIMETERS,
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_z_up_speed",
        translation_key="job_z_up_speed",
        printer_entity_type=PrinterEntityType.LCD,
    ),
    AnycubicSensorEntityDescription(
        key="job_z_down_speed",
        translation_key="job_z_down_speed",
        printer_entity_type=PrinterEntityType.LCD,
    ),
])

SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
    AnycubicSensorEntityDescription(
        key="current_status",
        translation_key="current_status",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="file_list_local",
        translation_key="file_list_local",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="file_list_udisk",
        translation_key="file_list_udisk",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="file_list_cloud",
        translation_key="file_list_cloud",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="job_name",
        translation_key="job_name",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="job_progress",
        translation_key="job_progress",
        native_unit_of_measurement=PERCENTAGE,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicSensorEntityDescription(
        key="job_time_elapsed",
        translation_key="job_time_elapsed",
        native_unit_of_measurement=UnitOfTime.MINUTES,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicSensorEntityDescription(
        key="job_time_remaining",
        translation_key="job_time_remaining",
        native_unit_of_measurement=UnitOfTime.MINUTES,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicSensorEntityDescription(
        key="job_state",
        translation_key="job_state",
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="job_eta",
        translation_key="job_eta",
        device_class=SensorDeviceClass.TIMESTAMP,
        printer_entity_type=PrinterEntityType.PRINTER,
        not_measured=True,
    ),
    AnycubicSensorEntityDescription(
        key="job_current_layer",
        translation_key="job_current_layer",
        native_unit_of_measurement=UNIT_LAYERS,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicSensorEntityDescription(
        key="job_total_layers",
        translation_key="job_total_layers",
        native_unit_of_measurement=UNIT_LAYERS,
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
    AnycubicSensorEntityDescription(
        key="job_z_thick",
        translation_key="job_z_thick",
        printer_entity_type=PrinterEntityType.PRINTER,
    ),
])

GLOBAL_SENSOR_TYPES: list[AnycubicSensorEntityDescription] = list([
])


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    coordinator.add_entities_for_seen_printers(
        async_add_entities=async_add_entities,
        entity_constructor=AnycubicSensor,
        platform=Platform.SENSOR,
        available_descriptors=list(
            SENSOR_TYPES
            + LCD_SENSOR_TYPES
            + FDM_SENSOR_TYPES
            + PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES
            + SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES
            + GLOBAL_SENSOR_TYPES
        ),
    )


class AnycubicSensor(AnycubicCloudEntity, SensorEntity):
    """Representation of a Anycubic Cloud sensor."""

    entity_description: AnycubicSensorEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: AnycubicSensorEntityDescription,
    ) -> None:
        """Initiate Anycubic Sensor."""
        super().__init__(hass, coordinator, printer_id, entity_description)

        if self.entity_description.native_unit_of_measurement == UnitOfTemperature.CELSIUS:
            self._attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

        if self.entity_description.not_measured:
            self._attr_state_class = None
        else:
            self._attr_state_class = SensorStateClass.MEASUREMENT

    @property
    def available(self) -> bool:
        return printer_state_for_key(
            self.coordinator,
            self._printer_id,
            self.entity_description.key
        ) is not None

    @property
    def native_value(self) -> Any:
        """Return the ...."""
        state = printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)

        if state is None:
            return None

        if self.entity_description.device_class == SensorDeviceClass.TIMESTAMP:
            return dt_util.utc_from_timestamp(state)

        elif (
            isinstance(state, float)
            or self.entity_description.native_unit_of_measurement == UnitOfTemperature.CELSIUS
        ):
            return float(state)

        elif (
            isinstance(state, int)
            or self.entity_description.native_unit_of_measurement == UNIT_LAYERS
            or self.entity_description.native_unit_of_measurement == PERCENTAGE
        ):
            return int(state)

        return str(state)

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return extra state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return None
