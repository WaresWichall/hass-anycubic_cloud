import json
import time

from .anycubic_const import (
    REX_GCODE_EXT,
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
        self._print_time = str(print_time) if print_time is not None else None
        self._slice_param = slice_param
        self._delete = int(delete) if delete is not None else None
        self._auto_operation = auto_operation
        self._monitor = monitor
        self._last_update_time = int(last_update_time) if last_update_time is not None else None
        self._settings = settings
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
        self._target_nozzle_temp = None
        self._target_hotbed_temp = None
        self._download_progress = 0
        if self._slice_param and isinstance(self._slice_param, str):
            try:
                self._slice_param = json.loads(str(self._slice_param))
            except Exception as e:
                print(f"Error in json parsing slice_param: {e}\n{self._slice_param}")
        if self._settings and isinstance(self._settings, str):
            try:
                self._settings = json.loads(str(self._settings))
            except Exception as e:
                print(f"Error in json parsing settings: {e}\n{self._settings}")
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

    def update_extra_data(self, data):
        if data is None:
            return

        self._target_nozzle_temp = data.get('temp', {}).get('target_nozzle_temp')
        self._target_hotbed_temp = data.get('temp', {}).get('target_hotbed_temp')

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

    def update_settings(
        self,
        new_settings,
    ):
        self._settings = new_settings

    @property
    def id(self):
        return self._id

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
        if not self._settings:
            return None

        return self._settings.get('curr_layer')

    @property
    def print_total_layers(self):
        if not self._settings:
            return None

        return self._settings.get('total_layers')

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

    def __repr__(self):
        return (
            f"AnycubicProject(id={self._id}, name={self.name},\n "
            f"progress_percentage={self.progress_percentage}, print_time_elapsed_minutes={self.print_time_elapsed_minutes}, "
            f"print_time_remaining_minutes={self.print_time_remaining_minutes}, pause={self._pause}, progress={self._progress}, "
            f"create_time={self._create_time}, total_time={self._total_time},\n "
            f"print_in_progress={self.print_in_progress}, print_complete={self.print_complete}, print_failed={self.print_failed}, "
            f"print_is_paused={self.print_is_paused}, raw_print_status={self.raw_print_status},\n "
            f"print_approximate_completion_time={self.print_approximate_completion_time}, "
            f"print_current_layer={self.print_current_layer}, print_total_layers={self.print_total_layers},\n "
            f"finished_timestamp={self.finished_timestamp}, target_nozzle_temp={self.target_nozzle_temp}, "
            f"target_hotbed_temp={self.target_hotbed_temp}, print_status={self.print_status})")
