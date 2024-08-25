import json
import time

from .anycubic_const import (
    REX_GCODE_EXT,
)

from .anycubic_data_model_print_speed_mode import (
    AnycubicPrintSpeedMode,
)

from .anycubic_exceptions import (
    AnycubicDataParsingError,
    AnycubicInvalidValue,
    AnycubicPropertiesNotLoaded,
)

from .anycubic_enums import (
    AnycubicPrintStatus,
)


class AnycubicProject:
    def __init__(
        self,
        api_parent,
        id,
        taskid,
        gcode_id,
        estimate,
        progress,
        status,
        create_time,
        gcode_name,
        slice_param=None,
        slice_result=None,
        user_id=None,
        printer_id=None,
        model=None,
        img=None,
        remain_time=None,
        material=None,
        material_type=None,
        pause=None,
        connect_status=None,
        print_status=None,
        reason=None,
        slice_data=None,
        slice_status=None,
        ischeck=None,
        project_type=None,
        printed=None,
        start_time=None,
        end_time=None,
        slice_start_time=None,
        slice_end_time=None,
        total_time=None,
        print_time=None,
        delete=None,
        auto_operation=None,
        monitor=None,
        last_update_time=None,
        settings=None,
        localtask=None,
        source=None,
        device_message=None,
        signal_strength=None,
        key=None,
        printer_type=None,
        machine_type=None,
        printer_name=None,
        machine_name=None,
        device_status=None,
        post_title=None,
        file_size=None,
        machine_class=None,
        material_unit=None,
        reason_id=None,
        z_thick=None,
        print_speed_mode=None,
        print_speed_pct=None,
        fan_speed_pct=None,
        task_mode=None,
        type_function_ids=None,
        available_print_speed_modes=None,
    ):
        self._api_parent = api_parent
        self._id = int(id)
        self._taskid = int(taskid)
        self._user_id = int(user_id) if user_id is not None else None
        self._printer_id = int(printer_id) if printer_id is not None else None
        self._gcode_id = int(gcode_id)
        self._model = int(model) if model is not None else None
        self._img = str(img) if img is not None else None
        self._estimate = int(estimate)
        self._remain_time = int(remain_time) if remain_time is not None else None
        self._material = str(material) if material is not None else None
        self._material_type = int(material_type) if material_type is not None else None
        self._pause = int(pause) if pause is not None else None
        self._progress = int(progress)
        self._connect_status = int(connect_status) if connect_status is not None else None
        self._print_status = int(print_status) if print_status is not None else None
        self._reason = str(reason) if reason is not None else None
        self._slice_data = slice_data  # check
        self._slice_status = int(slice_status) if slice_status is not None else None
        self._status = int(status)
        self._ischeck = int(ischeck) if ischeck is not None else None
        self._project_type = int(project_type) if project_type is not None else None
        self._printed = int(printed) if printed is not None else None
        self._create_time = int(create_time)
        self._start_time = int(start_time) if start_time is not None else None
        self._end_time = int(end_time) if end_time is not None else None
        self._slice_start_time = int(slice_start_time) if slice_start_time is not None else None
        self._slice_end_time = int(slice_end_time) if slice_end_time is not None else None
        self._total_time = str(total_time) if total_time is not None else None
        self._print_time = int(print_time) if print_time is not None else None
        self._slice_param = slice_param
        self._delete = int(delete) if delete is not None else None
        self._auto_operation = auto_operation
        self._monitor = monitor
        self._last_update_time = int(last_update_time) if last_update_time is not None else None
        self._set_settings(settings)
        self._localtask = str(localtask) if localtask is not None else None
        self._source = str(source) if source is not None else None
        self._device_message = device_message
        self._signal_strength = int(signal_strength) if signal_strength is not None else None
        self._key = str(key) if key is not None else None
        self._printer_type = str(printer_type) if printer_type is not None else None
        self._machine_type = int(machine_type) if machine_type is not None else None
        self._printer_name = str(printer_name) if printer_name is not None else None
        self._machine_name = str(machine_name) if machine_name is not None else None
        self._device_status = int(device_status) if device_status is not None else None
        self._slice_result = slice_result
        self.set_filename(gcode_name)
        self._post_title = post_title
        self._file_size = int(file_size) if file_size is not None else None
        self._machine_class = int(machine_class) if machine_class is not None else None
        self._material_unit = str(material_unit) if material_unit is not None else None
        self._set_reason_id(reason_id)
        self._set_z_thick(z_thick)
        self._set_print_speed_mode(print_speed_mode)
        self._set_print_speed_pct(print_speed_pct)
        self._set_fan_speed_pct(fan_speed_pct)
        self._set_task_mode(task_mode)
        self._set_type_function_ids(type_function_ids)
        self._set_available_print_speed_modes(available_print_speed_modes)

        self._target_nozzle_temp = None
        self._target_hotbed_temp = None
        self._temp_min_hotbed = None
        self._temp_max_hotbed = None
        self._temp_min_nozzle = None
        self._temp_max_nozzle = None
        self._download_progress = 0
        if self._slice_param and isinstance(self._slice_param, str):
            try:
                self._slice_param = json.loads(str(self._slice_param))
            except Exception as e:
                print(f"Error in json parsing slice_param: {e}\n{self._slice_param}")
        if self._slice_result and isinstance(self._slice_result, str):
            try:
                self._slice_result = json.loads(str(self._slice_result))
            except Exception as e:
                print(f"Error in json parsing slice_result: {e}\n{self._slice_result}")

    @classmethod
    def from_list_json(cls, api_parent, data):
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
    def from_gcode_json(cls, api_parent, data):
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

    def set_filename(self, filename):
        self._gcode_name = REX_GCODE_EXT.sub('', str(filename))

    def _set_reason_id(self, reason_id):
        self._reason_id = int(reason_id) if reason_id is not None else None

    def _set_z_thick(self, z_thick):
        self._z_thick = float(z_thick) if z_thick is not None else None

    def _set_print_speed_mode(self, print_speed_mode):
        self._print_speed_mode = int(print_speed_mode) if print_speed_mode is not None else None

    def _set_print_speed_pct(self, print_speed_pct):
        self._print_speed_pct = int(print_speed_pct) if print_speed_pct is not None else None

    def _set_fan_speed_pct(self, fan_speed_pct):
        self._fan_speed_pct = int(fan_speed_pct) if fan_speed_pct is not None else None

    def _set_task_mode(self, task_mode):
        self._task_mode = int(task_mode) if task_mode is not None else None

    def _set_type_function_ids(self, type_function_ids):
        if isinstance(type_function_ids, list):
            self._type_function_ids = type_function_ids
        else:
            self._type_function_ids = list()

    def _set_available_print_speed_modes(self, print_speed_model_des):
        if isinstance(print_speed_model_des, list):
            self._available_print_speed_modes = list([
                AnycubicPrintSpeedMode.from_json(x)
                for x in print_speed_model_des
            ])
        else:
            self._available_print_speed_modes = list()

    def _set_temperature_data(self, temperature_data):
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

    def update_extra_data(self, data):
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

    def update_target_temps(
        self,
        new_target_hotbed_temp,
        new_target_nozzle_temp,
    ):
        self._target_hotbed_temp = int(new_target_hotbed_temp)
        self._target_nozzle_temp = int(new_target_nozzle_temp)

    def update_with_mqtt_print_status_data(
        self,
        print_status: AnycubicPrintStatus,
        mqtt_data,
        paused=None,
    ):
        self._settings['curr_layer'] = int(mqtt_data['curr_layer'])
        self._settings['total_layers'] = int(mqtt_data['total_layers'])
        self.set_filename(mqtt_data['filename'])
        self._print_time = int(mqtt_data['print_time'])
        self._progress = int(mqtt_data['progress'])
        self._remain_time = int(mqtt_data['remain_time'])
        self._print_status = int(print_status)
        if paused is not None:
            self._pause = int(paused)

    def update_with_mqtt_download_status_data(
        self,
        mqtt_data,
    ):
        self._download_progress = int(mqtt_data['progress'])
        self._print_status = int(AnycubicPrintStatus.Downloading)

    def update_with_mqtt_checking_status_data(
        self,
    ):
        self._print_status = int(AnycubicPrintStatus.Checking)

    def update_slice_param(
        self,
        new_slice_param,
    ):
        self._slice_param = new_slice_param

    def _set_settings(
        self,
        new_settings,
    ):
        self._settings = {}

        if new_settings and isinstance(new_settings, str):
            try:
                self._settings.update(json.loads(new_settings))
            except Exception as e:
                raise AnycubicDataParsingError(
                    f"Error parsing project settings json: {e}\n{new_settings}"
                )

        elif new_settings and isinstance(new_settings, dict):
            self._settings.update(new_settings)

        elif new_settings:
            raise AnycubicDataParsingError(
                f"Unexpected data for project settings: {new_settings}"
            )

    def _get_print_setting(self, key):
        return self._settings.get(key)

    def _get_inner_print_setting(self, key):
        return self._settings.get('settings', {}).get(key)

    def _get_print_setting_as_int(self, key):
        val = self._get_print_setting(key)

        if val is not None:
            return int(val)

        return None

    def _get_print_setting_as_float(self, key):
        val = self._get_print_setting(key)

        if val is not None:
            return float(val)

        return None

    def _get_inner_print_setting_as_int(self, key):
        val = self._get_inner_print_setting(key)

        if val is not None:
            return int(val)

        return None

    def _get_inner_print_setting_as_float(self, key):
        val = self._get_inner_print_setting(key)

        if val is not None:
            return float(val)

        return None

    @property
    def id(self):
        return self._id

    @property
    def printer_id(self):
        return self._printer_id

    @property
    def name(self):
        return self._gcode_name

    @property
    def print_total_time(self):
        return self._total_time

    @property
    def print_time_elapsed_minutes(self):
        return self._print_time

    @property
    def print_time_remaining_minutes(self):
        return self._remain_time

    @property
    def print_approximate_completion_time(self):
        if self._end_time and self._end_time > 0:
            return self._end_time

        if self._remain_time is None:
            return 0

        return int(time.time() + (self._remain_time * 60))

    @property
    def created_timestamp(self):
        return self._create_time

    @property
    def finished_timestamp(self):
        return self._end_time

    @property
    def progress_percentage(self):
        return self._progress

    @property
    def download_progress_percentage(self):
        return self._download_progress

    @property
    def raw_print_status(self):
        return self._print_status

    @property
    def print_in_progress(self):
        return self._print_status == AnycubicPrintStatus.Printing or self._print_status == AnycubicPrintStatus.Preheating

    @property
    def print_preheating(self):
        return self._print_status == AnycubicPrintStatus.Preheating

    @property
    def print_complete(self):
        return self._print_status == AnycubicPrintStatus.Complete

    @property
    def print_failed(self):
        return self._print_status == AnycubicPrintStatus.Cancelled

    @property
    def print_is_paused(self):
        return self._pause != 0 and not self.print_failed

    @property
    def print_current_layer(self):
        return self._get_print_setting_as_int('curr_layer')

    @property
    def print_total_layers(self):
        return self._get_print_setting_as_int('total_layers')

    @property
    def print_model_height(self):
        return self._get_print_setting_as_float('model_hight')

    @property
    def print_anti_alias_count(self):
        return self._get_print_setting_as_int('anti_count')

    @property
    def print_on_time(self):
        return self._get_inner_print_setting_as_float('on_time')

    @property
    def print_off_time(self):
        return self._get_inner_print_setting_as_float('off_time')

    @property
    def print_bottom_time(self):
        return self._get_inner_print_setting_as_float('bottom_time')

    @property
    def print_bottom_layers(self):
        return self._get_inner_print_setting_as_int('bottom_layers')

    @property
    def print_z_up_height(self):
        return self._get_inner_print_setting_as_float('z_up_height')

    @property
    def print_z_up_speed(self):
        return self._get_inner_print_setting_as_int('z_up_speed')

    @property
    def print_z_down_speed(self):
        return self._get_inner_print_setting_as_int('z_down_speed')

    @property
    def print_status(self):
        if self.print_preheating:
            return "preheating"
        elif self.print_in_progress:
            return "printing"
        elif self.print_complete:
            return "finished"
        elif self.print_failed:
            return "failed"
        elif self.print_is_paused:
            return "paused"
        else:
            return "unknown"

    @property
    def target_nozzle_temp(self):
        return self._target_nozzle_temp

    @property
    def target_hotbed_temp(self):
        return self._target_hotbed_temp

    @property
    def temp_min_hotbed(self):
        return self._temp_min_hotbed

    @property
    def temp_max_hotbed(self):
        return self._temp_max_hotbed

    @property
    def temp_min_nozzle(self):
        return self._temp_min_nozzle

    @property
    def temp_max_nozzle(self):
        return self._temp_max_nozzle

    @property
    def print_speed_mode(self):
        return self._print_speed_mode

    @property
    def print_speed_pct(self):
        return self._print_speed_pct

    @property
    def z_thick(self):
        return self._z_thick

    @property
    def fan_speed_pct(self):
        return self._fan_speed_pct

    @property
    def available_print_speed_modes(self):
        return self._available_print_speed_modes

    @property
    def available_print_speed_modes_data_object(self):
        return list([
            x.data_object for x in self._available_print_speed_modes
        ])

    @property
    def slice_material_info_list(self):
        if not isinstance(self._slice_param, dict):
            return None

        material_info_list = self._slice_param.get('paint_infos')

        if not isinstance(material_info_list, list):
            return None

        return material_info_list

    @property
    def slice_total_filament_used(self):
        material_info_list = self.slice_material_info_list

        if material_info_list is None:
            return None

        total_filament = 0.0

        for material in material_info_list:
            total_filament += material.get('filament_used', 0.0)

        return total_filament

    def validate_target_nozzle_temperature(
        self,
        target_nozzle_temperature: int,
    ):
        try:
            target_nozzle_temperature = int(target_nozzle_temperature)
        except Exception:
            raise AnycubicInvalidValue("Invalid target nozzle temperature.")

        if self._temp_min_nozzle is None or self._temp_max_nozzle is None:
            raise AnycubicPropertiesNotLoaded("Allowed nozzle temperature range is not loaded.")

        if target_nozzle_temperature < self._temp_min_nozzle:
            raise AnycubicInvalidValue("Target nozzle temperature is below allowed minimum.")

        if target_nozzle_temperature > self._temp_max_nozzle:
            raise AnycubicInvalidValue("Target nozzle temperature is above allowed maximum.")

    def validate_target_hotbed_temperature(
        self,
        target_hotbed_temperature: int,
    ):
        try:
            target_hotbed_temperature = int(target_hotbed_temperature)
        except Exception:
            raise AnycubicInvalidValue("Invalid target hotbed temperature.")

        if self._temp_min_hotbed is None or self._temp_max_hotbed is None:
            raise AnycubicPropertiesNotLoaded("Allowed hotbed temperature range is not loaded.")

        if target_hotbed_temperature < self._temp_min_hotbed:
            raise AnycubicInvalidValue("Target hotbed temperature is below allowed minimum.")

        if target_hotbed_temperature > self._temp_max_hotbed:
            raise AnycubicInvalidValue("Target hotbed temperature is above allowed maximum.")

    def validate_print_speed_mode(
        self,
        print_speed_mode: int,
    ):
        try:
            print_speed_mode = int(print_speed_mode)
        except Exception:
            raise AnycubicInvalidValue("Invalid print speed mode.")

        if len(self._available_print_speed_modes) < 1:
            raise AnycubicPropertiesNotLoaded("Available print speed modes not loaded.")

        mode_valid = False

        for mode in self._available_print_speed_modes:
            if mode == print_speed_mode:
                mode_valid = True
                break

        if not mode_valid:
            raise AnycubicInvalidValue(f"Print speed mode {print_speed_mode} not found in available modes.")

    def validate_fan_speed_pct(
        self,
        fan_speed_pct: int,
    ):
        try:
            fan_speed_pct = int(fan_speed_pct)
        except Exception:
            raise AnycubicInvalidValue("Invalid fan speed %.")

        if fan_speed_pct < 0:
            raise AnycubicInvalidValue("Fan speed is below allowed minimum.")

        if fan_speed_pct > 100:
            raise AnycubicInvalidValue("Fan speed is above allowed maximum.")

    def validate_new_print_settings(
        self,
        new_print_settings,
    ):
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

    def __repr__(self):
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
