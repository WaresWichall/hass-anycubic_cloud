from __future__ import annotations

import json
import time
from typing import TYPE_CHECKING, Any

from ..const.const import PROJECT_IMAGE_URL_BASE, REX_GCODE_EXT
from ..const.enums import AnycubicPrintStatus
from ..exceptions.error_strings import (
    ErrorsDataParsing,
    ErrorsInvalidValue,
    ErrorsLoadingProps,
)
from ..exceptions.exceptions import (
    AnycubicDataParsingError,
    AnycubicInvalidValue,
    AnycubicPropertiesNotLoaded,
)
from ..helpers.helpers import (
    time_duration_string_to_delta,
    timedelta_to_dhm_string,
    timedelta_to_total_minutes,
)
from .print_speed_mode import AnycubicPrintSpeedMode

if TYPE_CHECKING:
    from datetime import timedelta

    from ..anycubic_api import AnycubicAPI
    from .consumable import AnycubicConsumableData
    from .printing_settings import AnycubicPrintingSettings


class AnycubicProject:
    __slots__ = (
        "_api_parent",
        "_id",
        "_taskid",
        "_user_id",
        "_printer_id",
        "_gcode_id",
        "_model",
        "_image_url",
        "_estimate",
        "_remain_time",
        "_material",
        "_material_type",
        "_pause",
        "_progress",
        "_connect_status",
        "_print_status",
        "_reason",
        "_slice_data",
        "_slice_status",
        "_status",
        "_ischeck",
        "_project_type",
        "_printed",
        "_create_time",
        "_start_time",
        "_end_time",
        "_slice_start_time",
        "_slice_end_time",
        "_total_time",
        "_total_time_delta",
        "_total_time_minutes",
        "_total_time_dhm_str",
        "_print_time",
        "_slice_param",
        "_delete",
        "_auto_operation",
        "_monitor",
        "_last_update_time",
        "_settings",
        "_localtask",
        "_source",
        "_device_message",
        "_signal_strength",
        "_key",
        "_printer_type",
        "_machine_type",
        "_printer_name",
        "_machine_name",
        "_device_status",
        "_slice_result",
        "_gcode_name",
        "_post_title",
        "_file_size",
        "_machine_class",
        "_material_unit",
        "_reason_id",
        "_z_thick",
        "_print_speed_mode",
        "_print_speed_pct",
        "_fan_speed_pct",
        "_task_mode",
        "_type_function_ids",
        "_available_print_speed_modes",
        "_target_nozzle_temp",
        "_target_hotbed_temp",
        "_temp_min_hotbed",
        "_temp_max_hotbed",
        "_temp_min_nozzle",
        "_temp_max_nozzle",
        "_download_progress",
    )

    def __init__(
        self,
        api_parent: AnycubicAPI,
        id: int | str,
        taskid: int | str,
        gcode_id: int | str,
        estimate: int | str,
        progress: int | str,
        status: int | str,
        create_time: int | str,
        gcode_name: str,
        slice_param: str | dict[str, Any] | None = None,
        slice_result: str | dict[str, Any] | None = None,
        user_id: int | str | None = None,
        printer_id: int | str | None = None,
        model: int | str | None = None,
        img: str | None = None,
        remain_time: int | str | None = None,
        material: str | None = None,
        material_type: int | str | None = None,
        pause: int | str | None = None,
        connect_status: int | str | None = None,
        print_status: int | str | None = None,
        reason: str | int | None = None,
        slice_data: Any = None,
        slice_status: int | str | None = None,
        ischeck: int | str | None = None,
        project_type: int | str | None = None,
        printed: int | str | None = None,
        start_time: int | str | None = None,
        end_time: int | str | None = None,
        slice_start_time: int | str | None = None,
        slice_end_time: int | str | None = None,
        total_time: str | None = None,
        print_time: int | str | None = None,
        delete: int | str | None = None,
        auto_operation: Any = None,
        monitor: Any = None,
        last_update_time: int | str | None = None,
        settings: dict[str, Any] | None = None,
        localtask: str | None = None,
        source: str | None = None,
        device_message: Any = None,
        signal_strength: int | str | None = None,
        key: str | None = None,
        printer_type: str | None = None,
        machine_type: int | str | None = None,
        printer_name: str | None = None,
        machine_name: str | None = None,
        device_status: int | str | None = None,
        post_title: Any = None,
        file_size: int | str | None = None,
        machine_class: int | str | None = None,
        material_unit: str | None = None,
        reason_id: int | str | None = None,
        z_thick: float | int | str | None = None,
        print_speed_mode: int | str | None = None,
        print_speed_pct: int | str | None = None,
        fan_speed_pct: int | str | None = None,
        task_mode: int | str | None = None,
        type_function_ids: Any = None,
        available_print_speed_modes: Any = None,
    ) -> None:
        self._api_parent: AnycubicAPI = api_parent
        self._id: int = int(id)
        self._taskid: int = int(taskid)
        self._set_user_id(user_id)
        self._set_printer_id(printer_id)
        self._set_gcode_id(gcode_id)
        self._set_model(model)
        self.set_image_url(img)
        self._set_estimate(estimate)
        self._set_remain_time(remain_time)
        self._set_material(material)
        self._set_material_type(material_type)
        self._set_pause(pause)
        self._set_progress(progress)
        self._set_connect_status(connect_status)
        self._print_status: int | None = None
        self._set_print_status(print_status)
        self._set_reason(reason)
        self._slice_data = slice_data  # check
        self._set_slice_status(slice_status)
        self._set_status(status)
        self._set_ischeck(ischeck)
        self._set_project_type(project_type)
        self._set_printed(printed)
        self._set_create_time(create_time)
        self._set_start_time(start_time)
        self._set_end_time(end_time)
        self._set_slice_start_time(slice_start_time)
        self._set_slice_end_time(slice_end_time)
        self._set_total_time(total_time)
        self._set_print_time(print_time)
        self.set_slice_param(slice_param)
        self._set_delete(delete)
        self._auto_operation = auto_operation
        self._monitor = monitor
        self._set_last_update_time(last_update_time)
        self._set_settings(settings)
        self._set_localtask(localtask)
        self._set_source(source)
        self._device_message = device_message
        self._set_signal_strength(signal_strength)
        self._set_key(key)
        self._set_printer_type(printer_type)
        self._set_machine_type(machine_type)
        self._set_printer_name(printer_name)
        self._set_machine_name(machine_name)
        self._set_device_status(device_status)
        self.set_slice_result(slice_result)
        self.set_filename(gcode_name)
        self._post_title = post_title
        self._set_file_size(file_size)
        self._set_machine_class(machine_class)
        self._set_material_unit(material_unit)
        self._set_reason_id(reason_id)
        self._set_z_thick(z_thick)
        self._set_print_speed_mode(print_speed_mode)
        self._set_print_speed_pct(print_speed_pct)
        self._set_fan_speed_pct(fan_speed_pct)
        self._set_task_mode(task_mode)
        self._set_type_function_ids(type_function_ids)
        self._set_available_print_speed_modes(available_print_speed_modes)

        self._target_nozzle_temp: int | None = None
        self._target_hotbed_temp: int | None = None
        self._temp_min_hotbed: int | None = None
        self._temp_max_hotbed: int | None = None
        self._temp_min_nozzle: int | None = None
        self._temp_max_nozzle: int | None = None
        self._download_progress: int = 0

    @classmethod
    def from_list_json(
        cls,
        api_parent: AnycubicAPI,
        data: dict[str, Any] | None,
    ) -> AnycubicProject | None:
        if data is None:
            return None

        return cls(
            api_parent=api_parent,
            id=data['id'],
            taskid=data['taskid'],
            user_id=data['user_id'],
            printer_id=data['printer_id'],
            gcode_id=data['gcode_id'],
            model=data['model'],
            img=data['img'],
            estimate=data['estimate'],
            remain_time=data['remain_time'],
            material=data['material'],
            material_type=data['material_type'],
            pause=data['pause'],
            progress=data['progress'],
            connect_status=data['connect_status'],
            print_status=data['print_status'],
            reason=data['reason'],
            slice_data=data['slice_data'],
            slice_status=data['slice_status'],
            status=data['status'],
            ischeck=data['ischeck'],
            project_type=data['project_type'],
            printed=data['printed'],
            create_time=data['create_time'],
            start_time=data['start_time'],
            end_time=data['end_time'],
            slice_start_time=data['slice_start_time'],
            slice_end_time=data['slice_end_time'],
            total_time=data['total_time'],
            print_time=data['print_time'],
            slice_param=data['slice_param'],
            delete=data['delete'],
            auto_operation=data['auto_operation'],
            monitor=data['monitor'],
            last_update_time=data['last_update_time'],
            settings=data['settings'],
            localtask=data['localtask'],
            source=data['source'],
            device_message=data['device_message'],
            signal_strength=data['signal_strength'],
            key=data['key'],
            printer_type=data['type'],
            machine_type=data['machine_type'],
            printer_name=data['printer_name'],
            machine_name=data['machine_name'],
            device_status=data['device_status'],
            slice_result=data['slice_result'],
            gcode_name=data['gcode_name'],
            post_title=data['post_title'],
        )

    @classmethod
    def from_gcode_json(
        cls,
        api_parent: AnycubicAPI,
        data: dict[str, Any] | None,
    ) -> AnycubicProject | None:
        if data is None:
            return None

        return cls(
            api_parent=api_parent,
            id=data['file_id'],
            taskid=data['file_id'],
            create_time=data['create_time'],
            file_size=data['size'],
            gcode_name=data['name'],
            estimate=data['estimate'],
            status=data['status'],
            progress=data['progress'],
            gcode_id=data['gcode_id'],
            machine_class=data['machine_class'],
            img=data['image_id'],
            slice_result=data['slice_result'],
            slice_param=data['slice_param'],
        )

    def _set_user_id(self, user_id: int | str | None) -> None:
        self._user_id = int(user_id) if user_id is not None else None

    def _set_printer_id(self, printer_id: int | str | None) -> None:
        self._printer_id = int(printer_id) if printer_id is not None else None

    def _set_gcode_id(self, gcode_id: int | str) -> None:
        self._gcode_id = int(gcode_id)

    def _set_model(self, model: int | str | None) -> None:
        self._model = int(model) if model is not None else None

    def _set_estimate(self, estimate: int | str) -> None:
        self._estimate = int(estimate)

    def _set_remain_time(self, remain_time: int | str | None) -> None:
        self._remain_time = int(remain_time) if remain_time is not None else None

    def _set_material(self, material: str | None) -> None:
        self._material = str(material) if material is not None else None

    def _set_material_type(self, material_type: int | str | None) -> None:
        self._material_type = int(material_type) if material_type is not None else None

    def _set_pause(self, pause: int | str | None) -> None:
        self._pause = int(pause) if pause is not None else None

    def _set_progress(self, progress: int | str) -> None:
        self._progress = int(progress)

    def _set_connect_status(self, connect_status: int | str | None) -> None:
        self._connect_status = int(connect_status) if connect_status is not None else None

    def _set_print_status(self, print_status: int | str | None) -> None:
        if self._print_status not in [AnycubicPrintStatus.Complete, AnycubicPrintStatus.Cancelled]:
            self._print_status = int(print_status) if print_status is not None else None

    def _set_reason(self, reason: str | int | None) -> None:
        self._reason: str | None = (
            str(reason)
            if reason is not None and reason != 0
            else None
        )

    def _set_slice_status(self, slice_status: int | str | None) -> None:
        self._slice_status = int(slice_status) if slice_status is not None else None

    def _set_status(self, status: int | str) -> None:
        self._status = int(status)

    def _set_ischeck(self, ischeck: int | str | None) -> None:
        self._ischeck = int(ischeck) if ischeck is not None else None

    def _set_project_type(self, project_type: int | str | None) -> None:
        self._project_type = int(project_type) if project_type is not None else None

    def _set_printed(self, printed: int | str | None) -> None:
        self._printed = int(printed) if printed is not None else None

    def _set_create_time(self, create_time: int | str) -> None:
        self._create_time = int(create_time)

    def _set_start_time(self, start_time: int | str | None) -> None:
        self._start_time = int(start_time) if start_time is not None else None

    def _set_end_time(self, end_time: int | str | None) -> None:
        self._end_time = int(end_time) if end_time is not None else None

    def _set_slice_start_time(self, slice_start_time: int | str | None) -> None:
        self._slice_start_time = int(slice_start_time) if slice_start_time is not None else None

    def _set_slice_end_time(self, slice_end_time: int | str | None) -> None:
        self._slice_end_time = int(slice_end_time) if slice_end_time is not None else None

    def _set_total_time(self, total_time: str | None) -> None:
        self._total_time = str(total_time) if total_time is not None else None
        self._total_time_delta: timedelta = time_duration_string_to_delta(self._total_time)
        self._total_time_minutes: int = int(timedelta_to_total_minutes(self._total_time_delta))
        self._total_time_dhm_str: str = timedelta_to_dhm_string(self._total_time_delta)

    def _set_print_time(self, print_time: int | str | None) -> None:
        self._print_time = int(print_time) if print_time is not None else None

    def _set_delete(self, delete: int | str | None) -> None:
        self._delete = int(delete) if delete is not None else None

    def _set_last_update_time(self, last_update_time: int | str | None) -> None:
        self._last_update_time = int(last_update_time) if last_update_time is not None else None

    def _set_localtask(self, localtask: str | None) -> None:
        self._localtask = str(localtask) if localtask is not None else None

    def _set_source(self, source: str | None) -> None:
        self._source = str(source) if source is not None else None

    def _set_signal_strength(self, signal_strength: int | str | None) -> None:
        self._signal_strength = int(signal_strength) if signal_strength is not None else None

    def _set_key(self, key: str | None) -> None:
        self._key = str(key) if key is not None else None

    def _set_printer_type(self, printer_type: str | None) -> None:
        self._printer_type = str(printer_type) if printer_type is not None else None

    def _set_machine_type(self, machine_type: int | str | None) -> None:
        self._machine_type = int(machine_type) if machine_type is not None else None

    def _set_printer_name(self, printer_name: str | None) -> None:
        self._printer_name = str(printer_name) if printer_name is not None else None

    def _set_machine_name(self, machine_name: str | None) -> None:
        self._machine_name = str(machine_name) if machine_name is not None else None

    def _set_device_status(self, device_status: int | str | None) -> None:
        self._device_status = int(device_status) if device_status is not None else None

    def _set_file_size(self, file_size: int | str | None) -> None:
        self._file_size = int(file_size) if file_size is not None else None

    def _set_machine_class(self, machine_class: int | str | None) -> None:
        self._machine_class = int(machine_class) if machine_class is not None else None

    def _set_material_unit(self, material_unit: str | None) -> None:
        self._material_unit = str(material_unit) if material_unit is not None else None

    def set_image_url(self, image_url: str | None) -> None:
        self._image_url = str(image_url) if image_url is not None else None

    def set_filename(self, filename: str) -> None:
        self._gcode_name = REX_GCODE_EXT.sub('', str(filename))

    def _set_reason_id(self, reason_id: int | str | None) -> None:
        self._reason_id = int(reason_id) if reason_id is not None else None

    def _set_z_thick(self, z_thick: float | int | str | None) -> None:
        self._z_thick = float(z_thick) if z_thick is not None else None

    def _set_print_speed_mode(self, print_speed_mode: int | str | None) -> None:
        self._print_speed_mode = int(print_speed_mode) if print_speed_mode is not None else None

    def _set_print_speed_pct(self, print_speed_pct: int | str | None) -> None:
        self._print_speed_pct = int(print_speed_pct) if print_speed_pct is not None else None

    def _set_fan_speed_pct(self, fan_speed_pct: int | str | None) -> None:
        self._fan_speed_pct = int(fan_speed_pct) if fan_speed_pct is not None else None

    def _set_task_mode(self, task_mode: int | str | None) -> None:
        self._task_mode = int(task_mode) if task_mode is not None else None

    def _set_type_function_ids(self, type_function_ids: Any) -> None:
        if isinstance(type_function_ids, list):
            self._type_function_ids = type_function_ids
        else:
            self._type_function_ids = list()

    def _set_available_print_speed_modes(self, print_speed_model_des: Any) -> None:
        self._available_print_speed_modes: list[AnycubicPrintSpeedMode] = list()
        if isinstance(print_speed_model_des, list):
            for x in print_speed_model_des:
                smode = AnycubicPrintSpeedMode.from_json(x)
                if smode:
                    self._available_print_speed_modes.append(smode)
                else:
                    raise AnycubicDataParsingError(
                        ErrorsDataParsing.available_print_speed_modes.format(print_speed_model_des)
                    )

    def _set_temperature_data(self, temperature_data: dict[str, Any] | None) -> None:
        if temperature_data is None:
            return

        temp_limit_data = temperature_data.get('limit', {})

        hotbed_temp_limit = temp_limit_data.get('hotbed_temp_limit', [])
        nozzle_temp_limit = temp_limit_data.get('nozzle_temp_limit', [])

        target_nozzle_temp = temperature_data.get('target_nozzle_temp')
        target_hotbed_temp = temperature_data.get('target_hotbed_temp')

        temp_min_hotbed = hotbed_temp_limit[0] if len(hotbed_temp_limit) == 2 else None
        temp_max_hotbed = hotbed_temp_limit[1] if len(hotbed_temp_limit) == 2 else None
        temp_min_nozzle = nozzle_temp_limit[0] if len(nozzle_temp_limit) == 2 else None
        temp_max_nozzle = nozzle_temp_limit[1] if len(nozzle_temp_limit) == 2 else None

        self._target_nozzle_temp = int(target_nozzle_temp) if target_nozzle_temp is not None else None
        self._target_hotbed_temp = int(target_hotbed_temp) if target_hotbed_temp is not None else None

        self._temp_min_hotbed = int(temp_min_hotbed) if temp_min_hotbed is not None else None
        self._temp_max_hotbed = int(temp_max_hotbed) if temp_max_hotbed is not None else None
        self._temp_min_nozzle = int(temp_min_nozzle) if temp_min_nozzle is not None else None
        self._temp_max_nozzle = int(temp_max_nozzle) if temp_max_nozzle is not None else None

    def update_extra_data(self, data: dict[str, Any] | None) -> None:
        if data is None:
            return

        self._set_reason_id(data.get('reason_id'))
        self._set_z_thick(data.get('z_thick'))
        self._set_print_speed_mode(data.get('print_speed_mode'))
        self._set_print_speed_pct(data.get('print_speed_pct'))
        self._set_fan_speed_pct(data.get('fan_speed_pct'))
        self._set_task_mode(data.get('task_mode'))
        self._set_type_function_ids(data.get('type_function_ids'))
        self._set_temperature_data(data.get('temp'))
        self._set_available_print_speed_modes(data.get('print_speed_model_des'))

    def update_with_project(self, update_project: AnycubicProject | None) -> bool:
        if update_project is None:
            return False

        if update_project.id != self._id:
            return False

        self._set_user_id(update_project._user_id)
        self._set_printer_id(update_project._printer_id)
        self._set_gcode_id(update_project._gcode_id)
        self._set_model(update_project._model)
        if self._image_url is None:
            self.set_image_url(update_project.image_url)
        self._set_estimate(update_project._estimate)
        self._set_remain_time(update_project._remain_time)
        self._set_material(update_project._material)
        self._set_material_type(update_project._material_type)
        self._set_pause(update_project._pause)
        self._set_progress(update_project._progress)
        self._set_connect_status(update_project._connect_status)
        self._set_print_status(update_project._print_status)
        self._set_reason(update_project._reason)
        self._slice_data = update_project._slice_data  # check
        self._set_slice_status(update_project._slice_status)
        self._set_status(update_project._status)
        self._set_ischeck(update_project._ischeck)
        self._set_project_type(update_project._project_type)
        self._set_printed(update_project._printed)
        self._set_create_time(update_project._create_time)
        self._set_start_time(update_project._start_time)
        self._set_end_time(update_project._end_time)
        self._set_slice_start_time(update_project._slice_start_time)
        self._set_slice_end_time(update_project._slice_end_time)
        self._set_total_time(update_project._total_time)
        self._set_print_time(update_project._print_time)
        self.set_slice_param(update_project._slice_param)
        self._set_delete(update_project._delete)
        self._auto_operation = update_project._auto_operation
        self._monitor = update_project._monitor
        self._set_last_update_time(update_project._last_update_time)
        self._set_settings(update_project._settings)
        self._set_localtask(update_project._localtask)
        self._set_source(update_project._source)
        self._device_message = update_project._device_message
        self._set_signal_strength(update_project._signal_strength)
        self._set_key(update_project._key)
        self._set_printer_type(update_project._printer_type)
        self._set_machine_type(update_project._machine_type)
        self._set_printer_name(update_project._printer_name)
        self._set_machine_name(update_project._machine_name)
        self._set_device_status(update_project._device_status)
        self.set_slice_result(update_project._slice_result)
        self.set_filename(update_project._gcode_name)
        self._post_title = update_project._post_title
        self._set_file_size(update_project._file_size)
        self._set_machine_class(update_project._machine_class)
        self._set_material_unit(update_project._material_unit)
        self._set_reason_id(update_project._reason_id)
        self._set_z_thick(update_project._z_thick)
        self._set_print_speed_mode(update_project._print_speed_mode)
        self._set_print_speed_pct(update_project._print_speed_pct)
        self._set_fan_speed_pct(update_project._fan_speed_pct)
        self._set_task_mode(update_project._task_mode)
        self._set_type_function_ids(update_project._type_function_ids)
        self._available_print_speed_modes = update_project._available_print_speed_modes

        return True

    def update_target_temps(
        self,
        new_target_hotbed_temp: int,
        new_target_nozzle_temp: int,
    ) -> None:
        self._target_hotbed_temp = int(new_target_hotbed_temp)
        self._target_nozzle_temp = int(new_target_nozzle_temp)

    def update_with_mqtt_print_status_data(
        self,
        print_status: AnycubicPrintStatus,
        mqtt_data: AnycubicConsumableData | None = None,
        paused: int | None = None,
        reason: str | None = None,
    ) -> None:
        self._print_status = int(print_status)

        if paused is not None:
            self._set_pause(paused)

        if reason is not None:
            self._set_reason(reason)

        if not mqtt_data:
            return

        if 'curr_layer' in mqtt_data:
            self._settings['curr_layer'] = int(mqtt_data['curr_layer'])

        if 'total_layers' in mqtt_data:
            self._settings['total_layers'] = int(mqtt_data['total_layers'])

        if 'filename' in mqtt_data:
            self.set_filename(mqtt_data['filename'])

        if 'print_time' in mqtt_data:
            self._print_time = int(mqtt_data['print_time'])

        if 'progress' in mqtt_data:
            self._progress = int(mqtt_data['progress'])

        if 'remain_time' in mqtt_data:
            self._remain_time = int(mqtt_data['remain_time'])

        if 'supplies_usage' in mqtt_data:
            self._set_print_setting(
                'supplies_usage',
                int(mqtt_data['supplies_usage'])
            )

    def update_with_mqtt_download_status_data(
        self,
        mqtt_data: AnycubicConsumableData,
    ) -> None:
        self._download_progress = int(mqtt_data['progress'])
        self._print_status = int(AnycubicPrintStatus.Downloading)

    def update_with_mqtt_checking_status_data(
        self,
    ) -> None:
        self._print_status = int(AnycubicPrintStatus.Checking)

    def _set_settings(
        self,
        new_settings: str | dict[str, Any] | None,
    ) -> None:
        self._settings: dict[str, Any] = {}

        if new_settings and isinstance(new_settings, str):
            try:
                self._settings.update(json.loads(new_settings))
            except Exception as e:
                raise AnycubicDataParsingError(
                    ErrorsDataParsing.project_settings_json.format(e, new_settings)
                )

        elif new_settings and isinstance(new_settings, dict):
            self._settings.update(new_settings)

        elif new_settings:
            raise AnycubicDataParsingError(
                ErrorsDataParsing.project_settings_unknown.format(new_settings)
            )

    def set_slice_param(
        self,
        new_slice_param: str | dict[str, Any] | None,
    ) -> None:
        self._slice_param: dict[str, Any] = {}

        if new_slice_param and isinstance(new_slice_param, str):
            try:
                self._slice_param.update(json.loads(new_slice_param))
            except Exception as e:
                raise AnycubicDataParsingError(
                    ErrorsDataParsing.project_slice_param_json.format(e, new_slice_param)
                )

        elif new_slice_param and isinstance(new_slice_param, dict):
            self._slice_param.update(new_slice_param)

        elif new_slice_param:
            raise AnycubicDataParsingError(
                ErrorsDataParsing.project_slice_param_unknown.format(new_slice_param)
            )

    def set_slice_result(
        self,
        new_slice_result: str | dict[str, Any] | None,
    ) -> None:
        self._slice_result: dict[str, Any] = {}

        if new_slice_result and isinstance(new_slice_result, str):
            try:
                self._slice_result.update(json.loads(new_slice_result))
            except Exception as e:
                raise AnycubicDataParsingError(
                    ErrorsDataParsing.project_slice_result_json.format(e, new_slice_result)
                )

        elif new_slice_result and isinstance(new_slice_result, dict):
            self._slice_result.update(new_slice_result)

        elif new_slice_result:
            raise AnycubicDataParsingError(
                ErrorsDataParsing.project_slice_result_unknown.format(new_slice_result)
            )

    def _get_print_setting(
        self,
        key: str,
    ) -> Any:
        return self._settings.get(key)

    def _set_print_setting(
        self,
        key: str,
        value: Any,
    ) -> None:
        if self._settings.get(key):
            self._settings[key] = value

    def _get_inner_print_setting(self, key: str) -> Any:
        return self._settings.get('settings', {}).get(key)

    def _get_print_setting_as_int(self, key: str) -> int | None:
        val = self._get_print_setting(key)

        if val is not None:
            return int(val)

        return None

    def _get_print_setting_as_float(self, key: str) -> float | None:
        val = self._get_print_setting(key)

        if val is not None:
            return float(val)

        return None

    def _get_inner_print_setting_as_int(self, key: str) -> int | None:
        val = self._get_inner_print_setting(key)

        if val is not None:
            return int(val)

        return None

    def _get_inner_print_setting_as_float(self, key: str) -> float | None:
        val = self._get_inner_print_setting(key)

        if val is not None:
            return float(val)

        return None

    @property
    def id(self) -> int:
        return self._id

    @property
    def user_id(self) -> int | None:
        return self._user_id

    @property
    def printer_id(self) -> int | None:
        return self._printer_id

    @property
    def gcode_id(self) -> int | None:
        return self._gcode_id

    @property
    def name(self) -> str:
        return self._gcode_name

    @property
    def print_status_message(self) -> str | None:
        return self._reason

    @property
    def print_total_time(self) -> str | None:
        return self._total_time

    @property
    def print_total_time_delta(self) -> timedelta:
        return self._total_time_delta

    @property
    def print_total_time_minutes(self) -> int:
        return self._total_time_minutes

    @property
    def print_total_time_dhm_str(self) -> str:
        return self._total_time_dhm_str

    @property
    def print_time_elapsed_minutes(self) -> int | None:
        return self._print_time

    @property
    def print_time_remaining_minutes(self) -> int | None:
        return self._remain_time

    @property
    def print_approximate_completion_time(self) -> int:
        if self._end_time and self._end_time > 0:
            return self._end_time

        if self._remain_time is None:
            return 0

        return int(time.time() + (self._remain_time * 60))

    @property
    def created_timestamp(self) -> int:
        return self._create_time

    @property
    def finished_timestamp(self) -> int | None:
        return self._end_time

    @property
    def progress_percentage(self) -> int:
        return self._progress

    @property
    def download_progress_percentage(self) -> int:
        return self._download_progress

    @property
    def raw_print_status(self) -> int | None:
        return self._print_status

    @property
    def print_in_progress(self) -> bool:
        return (
            self._print_status == AnycubicPrintStatus.Printing or
            self._print_status == AnycubicPrintStatus.Downloading or
            self._print_status == AnycubicPrintStatus.Checking or
            self._print_status == AnycubicPrintStatus.Preheating
        )

    @property
    def print_preheating(self) -> bool:
        return self._print_status == AnycubicPrintStatus.Preheating

    @property
    def print_complete(self) -> bool:
        return self._print_status == AnycubicPrintStatus.Complete

    @property
    def print_failed(self) -> bool:
        return self._print_status == AnycubicPrintStatus.Cancelled

    @property
    def print_is_paused(self) -> bool:
        return self._pause != 0 and self.print_in_progress

    @property
    def print_supplies_usage(self) -> int | None:
        return self._get_print_setting_as_int('supplies_usage')

    @property
    def print_current_layer(self) -> int | None:
        return self._get_print_setting_as_int('curr_layer')

    @property
    def print_total_layers(self) -> int | None:
        return self._get_print_setting_as_int('total_layers')

    @property
    def print_model_height(self) -> float | None:
        return self._get_print_setting_as_float('model_hight')

    @property
    def print_anti_alias_count(self) -> int | None:
        return self._get_print_setting_as_int('anti_count')

    @property
    def print_on_time(self) -> float | None:
        return self._get_inner_print_setting_as_float('on_time')

    @property
    def print_off_time(self) -> float | None:
        return self._get_inner_print_setting_as_float('off_time')

    @property
    def print_bottom_time(self) -> float | None:
        return self._get_inner_print_setting_as_float('bottom_time')

    @property
    def print_bottom_layers(self) -> int | None:
        return self._get_inner_print_setting_as_int('bottom_layers')

    @property
    def print_z_up_height(self) -> float | None:
        return self._get_inner_print_setting_as_float('z_up_height')

    @property
    def print_z_up_speed(self) -> int | None:
        return self._get_inner_print_setting_as_int('z_up_speed')

    @property
    def print_z_down_speed(self) -> int | None:
        return self._get_inner_print_setting_as_int('z_down_speed')

    @property
    def print_status(self) -> str:
        if self.print_is_paused:
            return "paused"
        elif self._print_status == AnycubicPrintStatus.Printing:
            return "printing"
        elif self._print_status == AnycubicPrintStatus.Complete:
            return "finished"
        elif self._print_status == AnycubicPrintStatus.Cancelled:
            return "failed"
        elif self._print_status == AnycubicPrintStatus.Downloading:
            return "downloading"
        elif self._print_status == AnycubicPrintStatus.Checking:
            return "checking"
        elif self._print_status == AnycubicPrintStatus.Preheating:
            return "preheating"
        elif self._print_status == AnycubicPrintStatus.Slicing:
            return "slicing"
        else:
            return "unknown"

    @property
    def target_nozzle_temp(self) -> int | None:
        return self._target_nozzle_temp

    @property
    def target_hotbed_temp(self) -> int | None:
        return self._target_hotbed_temp

    @property
    def temp_min_hotbed(self) -> int | None:
        return self._temp_min_hotbed

    @property
    def temp_max_hotbed(self) -> int | None:
        return self._temp_max_hotbed

    @property
    def temp_min_nozzle(self) -> int | None:
        return self._temp_min_nozzle

    @property
    def temp_max_nozzle(self) -> int | None:
        return self._temp_max_nozzle

    @property
    def print_speed_mode(self) -> int | None:
        return self._print_speed_mode

    @property
    def print_speed_mode_string(self) -> str | None:
        mode_string = None

        for mode in self.available_print_speed_modes:
            if mode == self.print_speed_mode:
                mode_string = mode.title
                break

        return mode_string

    @property
    def print_speed_pct(self) -> int | None:
        return self._print_speed_pct

    @property
    def z_thick(self) -> float | None:
        return self._z_thick

    @property
    def fan_speed_pct(self) -> int | None:
        return self._fan_speed_pct

    @property
    def available_print_speed_modes(self) -> list[AnycubicPrintSpeedMode]:
        return self._available_print_speed_modes

    @property
    def available_print_speed_modes_data_object(self) -> list[dict[str, str | int]]:
        return list([
            x.data_object for x in self._available_print_speed_modes
        ])

    @property
    def slice_material_info_list(self) -> list[dict[str, Any]] | None:
        material_info_list = self._slice_param.get('paint_infos')

        if not isinstance(material_info_list, list):
            return None

        return material_info_list

    @property
    def slice_total_filament_used(self) -> float | None:
        material_info_list = self.slice_material_info_list

        if material_info_list is None:
            return None

        total_filament = 0.0

        for material in material_info_list:
            total_filament += material.get('filament_used', 0.0)

        return total_filament

    @property
    def image_url(self) -> str | None:
        if isinstance(self._image_url, str) and self._image_url.startswith("http"):
            return self._image_url

        img_endpoint = self._slice_param.get('image_id')

        if img_endpoint and isinstance(img_endpoint, str):
            return str(PROJECT_IMAGE_URL_BASE + img_endpoint)

        return None

    def validate_target_nozzle_temperature(
        self,
        target_nozzle_temperature: int,
    ) -> None:
        try:
            target_nozzle_temperature = int(target_nozzle_temperature)
        except Exception:
            raise AnycubicInvalidValue(ErrorsInvalidValue.invalid_nozzle_temp)

        if self._temp_min_nozzle is None or self._temp_max_nozzle is None:
            raise AnycubicPropertiesNotLoaded(ErrorsLoadingProps.range_nozzle_temp)

        if target_nozzle_temperature < self._temp_min_nozzle:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_low_nozzle_temp)

        if target_nozzle_temperature > self._temp_max_nozzle:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_high_nozzle_temp)

    def validate_target_hotbed_temperature(
        self,
        target_hotbed_temperature: int,
    ) -> None:
        try:
            target_hotbed_temperature = int(target_hotbed_temperature)
        except Exception:
            raise AnycubicInvalidValue(ErrorsInvalidValue.invalid_hotbed_temp)

        if self._temp_min_hotbed is None or self._temp_max_hotbed is None:
            raise AnycubicPropertiesNotLoaded(ErrorsLoadingProps.range_hotbed_temp)

        if target_hotbed_temperature < self._temp_min_hotbed:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_low_hotbed_temp)

        if target_hotbed_temperature > self._temp_max_hotbed:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_high_hotbed_temp)

    def validate_print_speed_mode(
        self,
        print_speed_mode: int,
    ) -> None:
        try:
            print_speed_mode = int(print_speed_mode)
        except Exception:
            raise AnycubicInvalidValue(ErrorsInvalidValue.invalid_speed_mode)

        if len(self._available_print_speed_modes) < 1:
            raise AnycubicPropertiesNotLoaded(ErrorsLoadingProps.speed_modes_not_loaded)

        mode_valid = False

        for mode in self._available_print_speed_modes:
            if mode == print_speed_mode:
                mode_valid = True
                break

        if not mode_valid:
            raise AnycubicInvalidValue(ErrorsInvalidValue.speed_mode_not_found.format(print_speed_mode))

    def validate_fan_speed_pct(
        self,
        fan_speed_pct: int,
    ) -> None:
        try:
            fan_speed_pct = int(fan_speed_pct)
        except Exception:
            raise AnycubicInvalidValue(ErrorsInvalidValue.invalid_fan_speed)

        if fan_speed_pct < 0:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_low_fan_speed)

        if fan_speed_pct > 100:
            raise AnycubicInvalidValue(ErrorsInvalidValue.too_high_fan_speed)

    def validate_new_print_settings(
        self,
        new_print_settings: AnycubicPrintingSettings,
    ) -> None:
        if new_print_settings.print_speed_mode is not None:
            self.validate_print_speed_mode(new_print_settings.print_speed_mode)

        if new_print_settings.target_nozzle_temp is not None:
            self.validate_target_nozzle_temperature(new_print_settings.target_nozzle_temp)

        if new_print_settings.target_hotbed_temp is not None:
            self.validate_target_hotbed_temperature(new_print_settings.target_hotbed_temp)

        if new_print_settings.fan_speed_pct is not None:
            self.validate_fan_speed_pct(new_print_settings.fan_speed_pct)

        if new_print_settings.aux_fan_speed_pct is not None:
            self.validate_fan_speed_pct(new_print_settings.aux_fan_speed_pct)

        if new_print_settings.box_fan_level is not None:
            self.validate_fan_speed_pct(new_print_settings.box_fan_level)

    def __repr__(self) -> str:
        return (
            f"AnycubicProject(id={self._id}, name={self.name}, printer_id={self.printer_id},\n "
            f"progress_percentage={self.progress_percentage}, print_time_elapsed_minutes={self.print_time_elapsed_minutes}, "
            f"print_time_remaining_minutes={self.print_time_remaining_minutes}, pause={self._pause}, progress={self._progress}, "
            f"create_time={self._create_time}, total_time={self._total_time},\n "
            f"print_in_progress={self.print_in_progress}, print_complete={self.print_complete}, print_failed={self.print_failed}, "
            f"print_is_paused={self.print_is_paused}, raw_print_status={self.raw_print_status},\n "
            f"print_approximate_completion_time={self.print_approximate_completion_time}, "
            f"print_current_layer={self.print_current_layer}, print_total_layers={self.print_total_layers},\n "
            f"finished_timestamp={self.finished_timestamp}, target_nozzle_temp={self.target_nozzle_temp}, "
            f"target_hotbed_temp={self.target_hotbed_temp}, print_status={self.print_status})")
