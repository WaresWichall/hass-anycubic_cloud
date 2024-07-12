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
    UnitOfTemperature,
    UnitOfTime,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_PRINTER_ID_LIST,
    COORDINATOR,
    DOMAIN,
    UNIT_LAYERS,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity


MULTI_COLOR_BOX_SENSOR_TYPES = (
    SensorEntityDescription(
        key="multi_color_box_fw_version",
        translation_key="multi_color_box_fw_version",
    ),
    SensorEntityDescription(
        key="multi_color_box_fw_update_progress",
        translation_key="multi_color_box_fw_update_progress",
    ),
    SensorEntityDescription(
        key="multi_color_box_fw_download_progress",
        translation_key="multi_color_box_fw_download_progress",
    ),
    SensorEntityDescription(
        key="multi_color_box_fw_available_version",
        translation_key="multi_color_box_fw_available_version",
    ),
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
        key="file_list_local",
        translation_key="file_list_local",
    ),
    SensorEntityDescription(
        key="fw_version",
        translation_key="fw_version",
    ),
    SensorEntityDescription(
        key="fw_update_progress",
        translation_key="fw_update_progress",
    ),
    SensorEntityDescription(
        key="fw_download_progress",
        translation_key="fw_download_progress",
    ),
    SensorEntityDescription(
        key="fw_available_version",
        translation_key="fw_available_version",
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


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Set up the Anycubic Cloud sensor entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]
    sensors: list[AnycubicSensor] = []

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        if coordinator.data[printer_id]["supports_function_multi_color_box"]:
            for description in MULTI_COLOR_BOX_SENSOR_TYPES:
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
        self._attr_unique_id = f"{coordinator.data[self._printer_id]['machine_mac']}-{entity_description.key}"

        if self.entity_description.native_unit_of_measurement == UnitOfTemperature.CELSIUS:
            self._attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    @property
    def state(self) -> float:
        """Return the ...."""
        state = self.coordinator.data[self._printer_id][self.entity_description.key]

        if self.entity_description.native_unit_of_measurement == UnitOfTemperature.CELSIUS:
            return float(state)

        elif (
            self.entity_description.native_unit_of_measurement == UnitOfTime.MINUTES
            or self.entity_description.native_unit_of_measurement == UnitOfTime.SECONDS
            or self.entity_description.native_unit_of_measurement == UNIT_LAYERS
            or self.entity_description.native_unit_of_measurement == PERCENTAGE
        ):
            return int(state)

        elif self.entity_description.device_class == SensorDeviceClass.TIMESTAMP:
            return dt_util.utc_from_timestamp(state)

        elif self.entity_description.key == 'multi_color_box_spools':
            return "active" if state is not None else "inactive"

        elif self.entity_description.key == 'file_list_local':
            return "loaded" if state is not None else "not loaded"

        return str(state)

    @property
    def state_attributes(self) -> dict[str, Any] | None:
        """Return state attributes."""
        if self.entity_description.key == 'multi_color_box_spools':
            return {
                "spool_info": self.coordinator.data[self._printer_id][self.entity_description.key]
            }
        elif self.entity_description.key == 'file_list_local':
            return {
                "file_info": self.coordinator.data[self._printer_id][self.entity_description.key]
            }
        else:
            return super().state_attributes
