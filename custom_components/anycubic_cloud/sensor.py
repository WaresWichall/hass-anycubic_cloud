"""Sensors for Anycubic Cloud Printers."""
from __future__ import annotations
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntityDescription,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    PERCENTAGE,
    UnitOfLength,
    UnitOfTemperature,
    UnitOfTime,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .anycubic_cloud_api.anycubic_enums import (
    AnycubicPrinterMaterialType
)

from .const import (
    CONF_PRINTER_ID_LIST,
    COORDINATOR,
    DOMAIN,
    UNIT_LAYERS,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_attributes_for_key, printer_entity_unique_id, printer_state_for_key


PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES = (
    SensorEntityDescription(
        key="multi_color_box_current_temperature",
        translation_key="multi_color_box_current_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="multi_color_box_spools",
        translation_key="multi_color_box_spools",
    ),
    SensorEntityDescription(
        key="dry_status_raw_status_code",
        translation_key="dry_status_raw_status_code",
    ),
    SensorEntityDescription(
        key="dry_status_target_temperature",
        translation_key="dry_status_target_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="dry_status_total_duration",
        translation_key="dry_status_total_duration",
    ),
    SensorEntityDescription(
        key="dry_status_remaining_time",
        translation_key="dry_status_remaining_time",
    ),
)


SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES = (
    SensorEntityDescription(
        key="secondary_multi_color_box_current_temperature",
        translation_key="secondary_multi_color_box_current_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="secondary_multi_color_box_spools",
        translation_key="secondary_multi_color_box_spools",
    ),
    SensorEntityDescription(
        key="secondary_dry_status_raw_status_code",
        translation_key="secondary_dry_status_raw_status_code",
    ),
    SensorEntityDescription(
        key="secondary_dry_status_target_temperature",
        translation_key="secondary_dry_status_target_temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="secondary_dry_status_total_duration",
        translation_key="secondary_dry_status_total_duration",
    ),
    SensorEntityDescription(
        key="secondary_dry_status_remaining_time",
        translation_key="secondary_dry_status_remaining_time",
    ),
)

FDM_SENSOR_TYPES = (
    SensorEntityDescription(
        key="print_speed_mode",
        translation_key="print_speed_mode",
    ),
    SensorEntityDescription(
        key="print_speed_pct",
        translation_key="print_speed_pct",
    ),
    SensorEntityDescription(
        key="fan_speed_pct",
        translation_key="fan_speed_pct",
    ),
    SensorEntityDescription(
        key="curr_nozzle_temp",
        translation_key="curr_nozzle_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="curr_hotbed_temp",
        translation_key="curr_hotbed_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="target_nozzle_temp",
        translation_key="target_nozzle_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
    SensorEntityDescription(
        key="target_hotbed_temp",
        translation_key="target_hotbed_temp",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
    ),
)

LCD_SENSOR_TYPES = (
    SensorEntityDescription(
        key="print_on_time",
        translation_key="print_on_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
    ),
    SensorEntityDescription(
        key="print_off_time",
        translation_key="print_off_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
    ),
    SensorEntityDescription(
        key="print_bottom_time",
        translation_key="print_bottom_time",
        native_unit_of_measurement=UnitOfTime.SECONDS,
    ),
    SensorEntityDescription(
        key="print_model_height",
        translation_key="print_model_height",
        native_unit_of_measurement=UnitOfLength.MILLIMETERS,
    ),
    SensorEntityDescription(
        key="print_anti_alias_count",
        translation_key="print_anti_alias_count",
    ),
    SensorEntityDescription(
        key="print_bottom_layers",
        translation_key="print_bottom_layers",
        native_unit_of_measurement=UNIT_LAYERS,
    ),
    SensorEntityDescription(
        key="print_z_up_height",
        translation_key="print_z_up_height",
        native_unit_of_measurement=UnitOfLength.MILLIMETERS,
    ),
    SensorEntityDescription(
        key="print_z_up_speed",
        translation_key="print_z_up_speed",
    ),
    SensorEntityDescription(
        key="print_z_down_speed",
        translation_key="print_z_down_speed",
    ),
)

SENSOR_TYPES = (
    SensorEntityDescription(
        key="device_status",
        translation_key="device_status",
    ),
    SensorEntityDescription(
        key="is_printing",
        translation_key="is_printing",
    ),
    SensorEntityDescription(
        key="current_status",
        translation_key="current_status",
    ),
    SensorEntityDescription(
        key="file_list_local",
        translation_key="file_list_local",
    ),
    SensorEntityDescription(
        key="file_list_udisk",
        translation_key="file_list_udisk",
    ),
    SensorEntityDescription(
        key="file_list_cloud",
        translation_key="file_list_cloud",
    ),
    SensorEntityDescription(
        key="current_project_name",
        translation_key="current_project_name",
    ),
    SensorEntityDescription(
        key="current_project_progress",
        translation_key="current_project_progress",
        native_unit_of_measurement=PERCENTAGE,
    ),
    SensorEntityDescription(
        key="current_project_created_timestamp",
        translation_key="current_project_created_timestamp",
        device_class=SensorDeviceClass.TIMESTAMP,
    ),
    SensorEntityDescription(
        key="current_project_finished_timestamp",
        translation_key="current_project_finished_timestamp",
        device_class=SensorDeviceClass.TIMESTAMP,
    ),
    SensorEntityDescription(
        key="current_project_time_elapsed",
        translation_key="current_project_time_elapsed",
        native_unit_of_measurement=UnitOfTime.MINUTES,
    ),
    SensorEntityDescription(
        key="current_project_time_remaining",
        translation_key="current_project_time_remaining",
        native_unit_of_measurement=UnitOfTime.MINUTES,
    ),
    SensorEntityDescription(
        key="current_project_print_total_time",
        translation_key="current_project_print_total_time",
    ),
    SensorEntityDescription(
        key="print_state",
        translation_key="print_state",
    ),
    SensorEntityDescription(
        key="raw_print_status",
        translation_key="raw_print_status",
    ),
    SensorEntityDescription(
        key="print_approximate_completion_time",
        translation_key="print_approximate_completion_time",
        device_class=SensorDeviceClass.TIMESTAMP,
    ),
    SensorEntityDescription(
        key="print_current_layer",
        translation_key="print_current_layer",
        native_unit_of_measurement=UNIT_LAYERS,
    ),
    SensorEntityDescription(
        key="print_total_layers",
        translation_key="print_total_layers",
        native_unit_of_measurement=UNIT_LAYERS,
    ),
    SensorEntityDescription(
        key="print_z_thick",
        translation_key="print_z_thick",
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    sensors: list[AnycubicSensor] = []

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        if printer_state_for_key(coordinator, printer_id, 'supports_function_multi_color_box'):
            for description in PRIMARY_MULTI_COLOR_BOX_SENSOR_TYPES:
                sensors.append(AnycubicSensor(coordinator, printer_id, description))
        if printer_state_for_key(coordinator, printer_id, 'connected_ace_units') > 1:
            for description in SECONDARY_MULTI_COLOR_BOX_SENSOR_TYPES:
                sensors.append(AnycubicSensor(coordinator, printer_id, description))

        status_attr = printer_attributes_for_key(coordinator, printer_id, 'current_status')

        if status_attr['material_type'] == AnycubicPrinterMaterialType.FILAMENT:
            for description in FDM_SENSOR_TYPES:
                sensors.append(AnycubicSensor(coordinator, printer_id, description))

        elif status_attr['material_type'] == AnycubicPrinterMaterialType.RESIN:
            for description in LCD_SENSOR_TYPES:
                sensors.append(AnycubicSensor(coordinator, printer_id, description))

        for description in SENSOR_TYPES:
            sensors.append(AnycubicSensor(coordinator, printer_id, description))

    async_add_entities(sensors)


class AnycubicSensor(AnycubicCloudEntity, SensorEntity):
    """Representation of a Anycubic Cloud sensor."""

    entity_description: SensorEntityDescription
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(
        self,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: SensorEntityDescription,
    ) -> None:
        """Initiate Anycubic Sensor."""
        super().__init__(coordinator, printer_id)
        self.entity_description = entity_description
        self._attr_unique_id = printer_entity_unique_id(coordinator, self._printer_id, entity_description.key)

        if self.entity_description.native_unit_of_measurement == UnitOfTemperature.CELSIUS:
            self._attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    @property
    def available(self) -> bool:
        return printer_state_for_key(
            self.coordinator,
            self._printer_id,
            self.entity_description.key
        ) is not None

    @property
    def state(self) -> Any:
        """Return the ...."""
        state = printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)

        if state is None:
            return None

        if (
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

        elif self.entity_description.device_class == SensorDeviceClass.TIMESTAMP:
            return dt_util.utc_from_timestamp(state)

        return str(state)

    @property
    def state_attributes(self) -> dict[str, Any] | None:
        """Return state attributes."""
        attrib = printer_attributes_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if attrib is not None:
            return attrib
        else:
            return super().state_attributes
