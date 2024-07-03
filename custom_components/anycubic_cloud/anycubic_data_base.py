import json
import time
from enum import IntEnum

from .anycubic_const import REX_GCODE_EXT


class AnycubicPrintStatus(IntEnum):
    Printing = 1
    Complete = 2
    Cancelled = 3
    Downloading = 4
    Checking = 5
    Preheating = 6
    Slicing = 7


class AnycubicFile:
    def __init__(
        self,
        filename,
        timestamp,
        size,
        is_dir,
    ):
        self._filename = str(filename)
        self._timestamp = int(timestamp)
        self._size = int(size)
        self._is_dir = bool(is_dir)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            filename=data['filename'],
            timestamp=data['timestamp'],
            size=data['size'],
            is_dir=data['is_dir'],
        )

    @property
    def filename(self):
        return self._filename

    @property
    def timestamp(self):
        return self._timestamp

    @property
    def size(self):
        return self._size

    @property
    def is_dir(self):
        return self._is_dir

    def __repr__(self):
        return (
            f"AnycubicFile("
            f"filename={self._filename}, "
            f"timestamp={self._timestamp}, "
            f"size={self._size}, "
            f"is_dir={self._is_dir})"
        )


class AnycubicMaterialColor:
    def __init__(
        self,
        red,
        green,
        blue,
    ):
        self._red = red
        self._green = green
        self._blue = blue

    @property
    def red(self):
        return self._red

    @property
    def green(self):
        return self._green

    @property
    def blue(self):
        return self._blue

    @property
    def data(self):
        return list([
            self._red,
            self._green,
            self._blue,
        ])

    def __repr__(self):
        return (
            f"AnycubicMaterialColor("
            f"red={self._red}, "
            f"green={self._green}, "
            f"blue={self._blue})"
        )


class AnycubicCameraToken:
    def __init__(
        self,
        secret_id,
        secret_key,
        session_token,
        region,
        msg_id,
    ):
        self._secret_id = secret_id
        self._secret_key = secret_key
        self._session_token = session_token
        self._region = region
        self._msg_id = msg_id

    @property
    def secret_id(self):
        return self._secret_id

    @property
    def secret_key(self):
        return self._secret_key

    @property
    def session_token(self):
        return self._session_token

    @property
    def region(self):
        return self._region

    @property
    def msg_id(self):
        return self._msg_id

    def __repr__(self):
        return (
            f"AnycubicCameraToken("
            f"secret_id={self.secret_id}, "
            f"secret_key={self.secret_key}, "
            f"session_token={self.session_token}, "
            f"region={self.region}, "
            f"msg_id={self.msg_id})"
        )


class AnycubicProject:
    def __init__(
        self,
        api_parent,
        id,
        taskid,
        user_id,
        printer_id,
        gcode_id,
        model,
        img,
        estimate,
        remain_time,
        material,
        material_type,
        pause,
        progress,
        connect_status,
        print_status,
        reason,
        slice_data,
        slice_status,
        status,
        ischeck,
        project_type,
        printed,
        create_time,
        start_time,
        end_time,
        slice_start_time,
        slice_end_time,
        total_time,
        print_time,
        slice_param,
        delete,
        auto_operation,
        monitor,
        last_update_time,
        settings,
        localtask,
        source,
        device_message,
        signal_strength,
        key,
        printer_type,
        machine_type,
        printer_name,
        machine_name,
        device_status,
        slice_result,
        gcode_name,
        post_title,
    ):
        self._api_parent = api_parent
        self._id = int(id)
        self._taskid = int(taskid)
        self._user_id = int(user_id)
        self._printer_id = int(printer_id)
        self._gcode_id = int(gcode_id)
        self._model = int(model)
        self._img = str(img)
        self._estimate = int(estimate)
        self._remain_time = int(remain_time)
        self._material = str(material)
        self._material_type = int(material_type)
        self._pause = int(pause)
        self._progress = int(progress)
        self._connect_status = int(connect_status)
        self._print_status = int(print_status)
        self._reason = str(reason)
        self._slice_data = slice_data  # check
        self._slice_status = int(slice_status)
        self._status = int(status)
        self._ischeck = int(ischeck)
        self._project_type = int(project_type)
        self._printed = int(printed)
        self._create_time = int(create_time)
        self._start_time = int(start_time)
        self._end_time = int(end_time)
        self._slice_start_time = int(slice_start_time)
        self._slice_end_time = int(slice_end_time)
        self._total_time = str(total_time)
        self._print_time = str(print_time)
        self._slice_param = None
        self._delete = int(delete)
        self._auto_operation = auto_operation
        self._monitor = monitor
        self._last_update_time = int(last_update_time)
        self._settings = None
        self._localtask = str(localtask)
        self._source = str(source)
        self._device_message = device_message
        self._signal_strength = int(signal_strength)
        self._key = str(key)
        self._printer_type = str(printer_type)
        self._machine_type = int(machine_type)
        self._printer_name = str(printer_name)
        self._machine_name = str(machine_name)
        self._device_status = int(device_status)
        self._slice_result = None
        self.set_filename(gcode_name)
        self._post_title = post_title
        self._target_nozzle_temp = None
        self._target_hotbed_temp = None
        if slice_param:
            try:
                self._slice_param = json.loads(str(slice_param))
            except Exception as e:
                print(f"Error in json parsing slice_param: {e}\n{slice_param}")
        if settings:
            try:
                self._settings = json.loads(str(settings))
            except Exception as e:
                print(f"Error in json parsing settings: {e}\n{settings}")
        if slice_result:
            try:
                self._slice_result = json.loads(str(slice_result))
            except Exception as e:
                print(f"Error in json parsing slice_result: {e}\n{slice_result}")

    @classmethod
    def from_basic_json(cls, api_parent, data):
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

    def set_filename(self, filename):
        self._gcode_name = REX_GCODE_EXT.sub('', str(filename))

    def update_extra_data(self, data):
        self._target_nozzle_temp = data.get('temp', {}).get('target_nozzle_temp')
        self._target_hotbed_temp = data.get('temp', {}).get('target_hotbed_temp')

    def update_target_temps(
        self,
        new_target_hotbed_temp,
        new_target_nozzle_temp,
    ):
        self._target_hotbed_temp = int(new_target_hotbed_temp)
        self._target_nozzle_temp = int(new_target_nozzle_temp)

    def update_with_mqtt_data(
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


class AnycubicMachineBaseInfo:
    def __init__(
        self,
        print_count,
        print_totaltime,
        material_type,
        material_used,
        description,
        create_time,
        firmware_version,
        machine_mac,
    ):
        self._print_count = int(print_count)
        self._print_totaltime = str(print_totaltime)
        self._material_type = str(material_type)
        self._material_used = str(material_used)
        self._description = str(description)
        self._create_time = int(create_time)
        self._firmware_version = str(firmware_version)
        self._machine_mac = str(machine_mac)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            print_count=data['print_count'],
            print_totaltime=data['print_totaltime'],
            material_type=data['material_type'],
            material_used=data['material_used'],
            description=data['description'],
            create_time=data['create_time'],
            firmware_version=data['firmware_version'],
            machine_mac=data['machine_mac'],
        )

    def __repr__(self):
        return (
            f"AnycubicMachineBaseInfo(print_count={self._print_count}, print_totaltime={self._print_totaltime}, "
            f"material_type={self._material_type}, material_used={self._material_used},"
            f"description={self._description}, create_time={self._create_time}, firmware_version={self._firmware_version}, "
            f"machine_mac={self._machine_mac})"
        )


class AnycubicMachineToolInfo:
    def __init__(
        self,
        id,
        typd_id,
        model_id,
        type_function_id,
        parent_id,
        function_name,
        function_des,
        control,
        param,
        icon_url,
        function_type,
        status,
        show_place,
    ):
        self._id = int(id)
        self._typd_id = int(typd_id)
        self._model_id = int(model_id)
        self._type_function_id = int(type_function_id)
        self._parent_id = int(parent_id)
        self._function_name = str(function_name)
        self._function_des = str(function_des)
        self._control = int(control)
        self._param = param
        self._icon_url = str(icon_url)
        self._function_type = int(function_type)
        self._status = int(status)
        self._show_place = int(show_place)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            id=data['id'],
            typd_id=data['typd_id'],
            model_id=data['model_id'],
            type_function_id=data['type_function_id'],
            parent_id=data['parent_id'],
            function_name=data['function_name'],
            function_des=data['function_des'],
            control=data['control'],
            param=data['param'],
            icon_url=data['icon_url'],
            function_type=data['function_type'],
            status=data['status'],
            show_place=data['show_place'],
        )

    def __repr__(self):
        return (
            f"AnycubicMachineToolInfo(id={self._id}, typd_id={self._typd_id}, model_id={self._model_id}, "
            f"type_function_id={self._type_function_id}, parent_id={self._parent_id},\n "
            f"function_name={self._function_name}, function_des={self._function_des}, control={self._control}, "
            f"param={self._param}, icon_url={self._icon_url},\n "
            f"function_type={self._function_type}, status={self._status}, show_place={self._show_place})"
        )


class AnycubicMachineExternalShelves:
    def __init__(
        self,
        id,
        type,
        color,
        loaded,
        status_type,
        current_status,
    ):
        self._id = int(id)
        self._type = str(type)
        self._color = color
        self._loaded = int(loaded)
        self._status_type = int(status_type)
        self._current_status = int(current_status)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            id=data['id'],
            type=data['type'],
            color=data['color'],
            loaded=data['loaded'],
            status_type=data['status_type'],
            current_status=data['current_status'],
        )

    def update_with_mqtt_data(self, data):
        if data is None:
            return None

        self._type = data['type']
        self._color = data['color']
        self._loaded = data['loaded']
        self._status_type = data['status_type']
        self._current_status = data['current_status']

    def __repr__(self):
        return (
            f"AnycubicMachineExternalShelves(id={self._id}, type={self._type}, color={self._color}, loaded={self._loaded}, "
            f"status_type={self._status_type}, current_status={self._current_status})"
        )


class AnycubicFeedStatus:
    def __init__(
        self,
        code,
        type,
        current_status,
        slot_index,
    ):
        self._code = int(code)
        self._type = int(type)
        self._current_status = int(current_status)
        self._slot_index = int(slot_index)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            code=data.get('code', -1),
            type=data['type'],
            current_status=data['current_status'],
            slot_index=data['slot_index'],
        )

    def __repr__(self):
        return (
            f"AnycubicFeedStatus(code={self._code}, type={self._type}, current_status={self._current_status}, "
            f"slot_index={self._slot_index})"
        )


class AnycubicDryingStatus:
    def __init__(
        self,
        status,
        target_temp,
        duration,
        remain_time,
    ):
        self._status = int(status)
        self._target_temp = int(target_temp)
        self._duration = int(duration)
        self._remain_time = int(remain_time)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            status=data['status'],
            target_temp=data['target_temp'],
            duration=data['duration'],
            remain_time=data['remain_time'],
        )

    @property
    def is_drying(self):
        return self._status == 1

    @property
    def raw_status_code(self):
        return self._status

    @property
    def target_temperature(self):
        return self._target_temp

    @property
    def total_duration(self):
        return self._duration

    @property
    def remaining_time(self):
        return self._remain_time

    def __repr__(self):
        return (
            f"AnycubicDryingStatus(is_drying={self.is_drying}, status={self._status}, target_temp={self._target_temp}, "
            f"duration={self._duration}, remain_time={self._remain_time})"
        )


class AnycubicSpoolInfo:
    def __init__(
        self,
        index,
        sku,
        material_type,
        color,
        edit_status,
        status,
    ):
        self._index = int(index)
        self._sku = str(sku)
        self._material_type = str(material_type)
        self._color = color
        self._edit_status = int(edit_status)
        self._status = int(status)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            index=data['index'],
            sku=data['sku'],
            material_type=data['type'],
            color=data['color'],
            edit_status=data['edit_status'],
            status=data['status'],
        )

    @property
    def material_type(self):
        return self._material_type

    @property
    def color(self):
        return self._color

    @property
    def status(self):
        return self._status

    @property
    def spool_loaded(self):
        return self._status == 5

    def set_spool_loaded(self, is_loaded):
        if is_loaded:
            self._status = 5
        else:
            self._status = 4

    def __repr__(self):
        return (
            f"AnycubicSpoolInfo(index={self._index}, sku={self._sku}, material_type={self.material_type}, color={self._color}, "
            f"edit_status={self._edit_status}, status={self._status})"
        )


class AnycubicMultiColorBox:
    def __init__(
        self,
        id,
        status,
        model_id,
        auto_feed,
        loaded_slot,
        feed_status,
        temp,
        drying_status,
        curr_nozzle_temp,
        target_nozzle_temp,
        slots,
    ):
        self._id = int(id)
        self._status = int(status)
        self._model_id = int(model_id)
        self._auto_feed = int(auto_feed)
        self._loaded_slot = int(loaded_slot)
        self._feed_status = AnycubicFeedStatus.from_json(feed_status)
        self.set_current_temperature(temp)
        self.set_drying_status(drying_status)
        self._curr_nozzle_temp = int(curr_nozzle_temp) if curr_nozzle_temp is not None else None
        self._target_nozzle_temp = int(target_nozzle_temp) if target_nozzle_temp is not None else None
        self._slots = list([AnycubicSpoolInfo.from_json(x) for x in slots])

    def set_auto_feed(self, auto_feed):
        self._auto_feed = int(auto_feed)

    def set_drying_status(self, drying_status):
        self._drying_status = AnycubicDryingStatus.from_json(drying_status)

    def set_slot_loaded(self, slot_num: int):
        self._loaded_slot = slot_num

    def set_current_temperature(self, temp: int):
        self._temp = int(temp)

    def update_slots_with_mqtt_data(self, slot_list):
        if slot_list is None:
            return

        for slot in slot_list:
            slot_index = slot['index']
            self._slots[slot_index] = AnycubicSpoolInfo.from_json(slot)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            id=data['id'],
            status=data['status'],
            model_id=data['model_id'],
            auto_feed=data['auto_feed'],
            loaded_slot=data['loaded_slot'],
            feed_status=data['feed_status'],
            temp=data['temp'],
            drying_status=data['drying_status'],
            curr_nozzle_temp=data.get('curr_nozzle_temp'),
            target_nozzle_temp=data.get('target_nozzle_temp'),
            slots=data['slots'],
        )

    @property
    def current_temperature(self):
        return self._temp

    @property
    def auto_feed(self):
        return self._auto_feed

    @property
    def slots(self):
        return self._slots

    @property
    def total_slots(self):
        return len(self._slots)

    @property
    def drying_status(self):
        return self._drying_status

    @property
    def spool_info_object(self):
        if not self._slots or len(self._slots) < 1:
            return None

        spool_list = list([
            {
                "material_type": slot.material_type,
                "color": slot.color,
                "status": slot.status,
                "spool_loaded": slot.spool_loaded,
            } for slot in self._slots
        ])
        return spool_list

    def __repr__(self):
        return (
            f"AnycubicMultiColorBox(id={self._id}, status={self._status}, model_id={self._model_id}, auto_feed={self._auto_feed}, "
            f"loaded_slot={self._loaded_slot},\n "
            f"temp={self._temp}, curr_nozzle_temp={self._curr_nozzle_temp}, target_nozzle_temp={self._target_nozzle_temp},\n "
            f"feed_status={self._feed_status},\n "
            f"drying_status={self._drying_status},\n "
            f"slots={self._slots})"
        )


class AnycubicMachineData:
    def __init__(
        self,
        name,
        pixel,
        res_x,
        res_y,
        format,
        size_x,
        size_y,
        size_z,
        suffix,
        anti_max,
    ):
        self._name = str(name)
        self._pixel = float(pixel)
        self._res_x = int(res_x)
        self._res_y = int(res_y)
        self._format = str(format)
        self._size_x = float(size_x)
        self._size_y = float(size_y)
        self._size_z = float(size_z)
        self._suffix = str(suffix)
        self._anti_max = int(anti_max)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            name=data['name'],
            pixel=data['pixel'],
            res_x=data['res_x'],
            res_y=data['res_y'],
            format=data['format'],
            size_x=data['size_x'],
            size_y=data['size_y'],
            size_z=data['size_z'],
            suffix=data['suffix'],
            anti_max=data['anti_max'],
        )

    def __repr__(self):
        return (
            f"AnycubicMachineData(name={self._name}, pixel={self._pixel}, format={self._format}, suffix={self._suffix},\n "
            f"res_x={self._res_x}, res_y={self._res_y}, size_x={self._size_x}, size_y={self._size_y}, size_z={self._size_z}, "
            f"anti_max={self._anti_max})"
        )


class AnycubicMachineParameter:
    def __init__(
        self,
        curr_hotbed_temp,
        curr_nozzle_temp,
    ):
        self._curr_hotbed_temp = int(curr_hotbed_temp)
        self._curr_nozzle_temp = int(curr_nozzle_temp)

    @property
    def curr_hotbed_temp(self):
        return self._curr_hotbed_temp

    @property
    def curr_nozzle_temp(self):
        return self._curr_nozzle_temp

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            curr_hotbed_temp=data['curr_hotbed_temp'],
            curr_nozzle_temp=data['curr_nozzle_temp'],
        )

    def update_current_temps(self, new_hotbed_temp, new_nozzle_temp):
        self._curr_hotbed_temp = int(new_hotbed_temp)
        self._curr_nozzle_temp = int(new_nozzle_temp)

    def __repr__(self):
        return f"AnycubicMachineParameter(curr_hotbed_temp={self._curr_hotbed_temp}, curr_nozzle_temp={self._curr_nozzle_temp})"


class AnycubicMachineFirmwareInfo:
    def __init__(
        self,
        need_update,
        firmware_version,
        update_progress=None,
        update_date=None,
        update_status=None,
        update_desc=None,
        force_update=None,
        target_version=None,
        time_cost=None,
        box_id=None,
    ):
        self._need_update = int(need_update)
        self._firmware_version = str(firmware_version)
        self._update_progress = int(update_progress) if update_progress is not None else None
        self._update_date = int(update_date) if update_date is not None else None
        self._update_status = str(update_status) if update_status is not None else None
        self._update_desc = str(update_desc) if update_desc is not None else None
        self._force_update = str(force_update) if force_update is not None else None
        self._target_version = str(target_version) if target_version is not None else None
        self._time_cost = int(time_cost) if time_cost is not None else None
        self._box_id = int(box_id) if box_id is not None else None

    @property
    def firmware_version(self):
        return self._firmware_version

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            need_update=data['need_update'],
            firmware_version=data['firmware_version'],
            update_progress=data.get('update_progress'),
            update_date=data.get('update_date'),
            update_status=data.get('update_status'),
            update_desc=data.get('update_desc'),
            force_update=data.get('force_update'),
            target_version=data.get('target_version'),
            time_cost=data.get('time_cost'),
            box_id=data.get('box_id'),
        )

    def update_version(self, new_version):
        if self._firmware_version != str(new_version):
            self._firmware_version = str(new_version)

    def __repr__(self):
        return f"AnycubicMachineFirmwareInfo(need_update={self._need_update}, firmware_version={self._firmware_version})"


class AnycubicMachineColorInfo:
    def __init__(
        self,
        color_list,
    ):
        self._raw_color_list = color_list

    @classmethod
    def from_json(cls, data):
        if data is None or not isinstance(data, list):
            return None

        return cls(
            color_list=data,
        )

    @property
    def color_list(self):
        extended_colors_found = False
        if len(self._raw_color_list) > 4:
            for x in self._raw_color_list[4:]:
                if any([c != -2 for c in x]):
                    extended_colors_found = True
        return self._raw_color_list[:4] if not extended_colors_found else self._raw_color_list[:]

    def __repr__(self):
        return f"AnycubicMachineColorInfo(color_list={self.color_list})"


class AnycubicPrinter:
    def __init__(
        self,
        api_parent,
        machine_type,
        machine_name,
        machine_img=None,
        net_function_ids=None,
        net_default_function=None,
        id=None,
        user_id=None,
        name=None,
        nonce=None,
        key=None,
        user_img=None,
        description=None,
        printer_type=None,
        device_status=None,
        ready_status=None,
        is_printing=None,
        reason=None,
        video_taskid=None,
        msg=None,
        material_used=None,
        print_totaltime=None,
        print_count=None,
        status=None,
        machine_mac=None,
        delete=None,
        create_time=None,
        delete_time=None,
        last_update_time=None,
        machine_data=None,
        type_function_ids=None,
        material_type=None,
        parameter=None,
        fw_version=None,
        available=None,
        color=None,
        advance=None,
        tools=None,
        multi_color_box_fw_version=None,
        external_shelves=None,
        multi_color_box=None,
        # base_info=None,
    ):
        self._api_parent = api_parent
        self._machine_type = machine_type
        self._machine_name = machine_name
        self._machine_img = machine_img
        self._net_function_ids = net_function_ids
        self._net_default_function = net_default_function
        self._id = id
        self._user_id = user_id
        self._name = name
        self._nonce = nonce
        self._key = key
        self._user_img = user_img
        self._description = description
        self._printer_type = printer_type
        self._device_status = device_status
        self._ready_status = ready_status
        self._is_printing = is_printing
        self._reason = reason
        self._video_taskid = video_taskid
        self._msg = msg
        self._material_used = material_used
        self._print_totaltime = print_totaltime
        self._print_count = print_count
        self._status = status
        self._machine_mac = machine_mac
        self._delete = delete
        self._create_time = create_time
        self._delete_time = delete_time
        self._last_update_time = last_update_time
        self._machine_data = AnycubicMachineData.from_json(machine_data)
        self._type_function_ids = type_function_ids
        self._material_type = material_type
        self._parameter = AnycubicMachineParameter.from_json(parameter)
        self._fw_version = AnycubicMachineFirmwareInfo.from_json(fw_version)
        self._available = available
        self._color = AnycubicMachineColorInfo.from_json(color)
        self._advance = advance
        self._tools = list([AnycubicMachineToolInfo.from_json(x) for x in tools]) if tools is not None else None
        self._multi_color_box_fw_version = (
            list([AnycubicMachineFirmwareInfo.from_json(x) for x in multi_color_box_fw_version])
            if multi_color_box_fw_version is not None else None
        )
        self._external_shelves = AnycubicMachineExternalShelves.from_json(external_shelves)
        self._set_multi_color_box(multi_color_box)

        self._latest_project: AnycubicProject | None = None
        self._fan_speed = 0
        self._print_speed_pct = 0
        self._print_speed_mode = 0
        self._local_file_list = None

    def _set_local_file_list(self, local_file_list):
        if local_file_list is None:
            return

        self._local_file_list = list([
            AnycubicFile.from_json(x) for x in local_file_list
        ])

    def _set_multi_color_box(self, multi_color_box):
        if multi_color_box is None or isinstance(multi_color_box, list):
            multi_color_box_list = multi_color_box
        else:
            multi_color_box_list = list([multi_color_box])
        self._multi_color_box = (
            list([AnycubicMultiColorBox.from_json(x) for x in multi_color_box_list])
            if multi_color_box_list is not None else None
        )

    @classmethod
    def from_basic_json(cls, api_parent, data):
        return cls(
            api_parent=api_parent,
            machine_type=data['machine_type'],
            machine_name=data['name'],
            machine_img=data['img'],
            net_function_ids=data['net_function_ids'],
            net_default_function=data['net_default_function'],
        )

    @classmethod
    def from_status_json(cls, api_parent, data):
        return cls(
            api_parent=api_parent,
            id=data['id'],
            user_id=data['user_id'],
            name=data['name'],
            nonce=data['nonce'],
            key=data['key'],
            machine_type=data['machine_type'],
            machine_name=data['model'],
            user_img=data['img'],
            description=data['description'],
            printer_type=data['type'],
            device_status=data['device_status'],
            ready_status=data['ready_status'],
            is_printing=data['is_printing'],
            reason=data['reason'],
            video_taskid=data['video_taskid'],
            msg=data['msg'],
            material_used=data['material_used'],
            print_totaltime=data['print_totaltime'],
            status=data['status'],
            machine_mac=data['machine_mac'],
            delete=data['delete'],
            create_time=data['create_time'],
            delete_time=data['delete_time'],
            last_update_time=data['last_update_time'],
            machine_data=data['machine_data'],
            type_function_ids=data['type_function_ids'],
            material_type=data['material_type'],
            parameter=data['parameter'],
            fw_version=data['version'],
            available=data.get('available'),
            color=data.get('color'),
        )

    @classmethod
    def from_info_json(cls, api_parent, data):
        try:
            return cls(
                api_parent=api_parent,
                id=data['id'],
                name=data['name'],
                key=data['key'],
                machine_type=data['machine_type'],
                machine_name=data['model'],
                user_img=data['img'],
                description=data['base']['description'],
                device_status=data['device_status'],
                is_printing=data['is_printing'],
                material_used=data['base']['material_used'],
                print_totaltime=data['base']['print_totaltime'],
                print_count=data['base']['print_count'],
                machine_mac=data['base']['machine_mac'],
                create_time=data['base']['create_time'],
                machine_data=data['machine_data'],
                type_function_ids=data['type_function_ids'],
                material_type=data['base']['material_type'],
                parameter=data['parameter'],
                fw_version=data['version'],
                tools=data['tools'],
                multi_color_box_fw_version=data['multi_color_box_version'],
                external_shelves=data['external_shelves'],
                multi_color_box=data['multi_color_box'],
            )
        except Exception as e:
            print(data)
            raise e

    def update_from_info_json(self, data):
        if str(self._id) != str(data['id']):
            return

        self._name = data['name']
        self._key = data['key']
        self._machine_type = data['machine_type']
        self._machine_name = data['model']
        self._user_img = data['img']
        self._description = data['base']['description']
        self._device_status = data['device_status']
        self._is_printing = data['is_printing']
        self._material_used = data['base']['material_used']
        self._print_totaltime = data['base']['print_totaltime']
        self._print_count = data['base']['print_count']
        self._machine_mac = data['base']['machine_mac']
        self._create_time = data['base']['create_time']
        self._machine_data = AnycubicMachineData.from_json(data['machine_data'])
        self._type_function_ids = data['type_function_ids']
        self._material_type = data['base']['material_type']
        self._parameter = AnycubicMachineParameter.from_json(data['parameter'])
        self._fw_version = AnycubicMachineFirmwareInfo.from_json(data['version'])
        self._tools = list([
            AnycubicMachineToolInfo.from_json(x)
            for x in data['tools']
        ]) if data['tools'] is not None else None
        self._multi_color_box_fw_version = list([
            AnycubicMachineFirmwareInfo.from_json(x)
            for x in data['multi_color_box_version']
        ]) if data['multi_color_box_version'] is not None else None
        self._external_shelves = AnycubicMachineExternalShelves.from_json(data['external_shelves'])
        self._set_multi_color_box(data['multi_color_box'])

    def _update_latest_project_with_mqtt_data(
        self,
        incoming_project_id,
        print_status: AnycubicPrintStatus,
        mqtt_data,
        paused=None,
    ):
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        if self._latest_project and (project_id < 0 or project_id == self._latest_project.id):
            self._latest_project.update_with_mqtt_data(
                print_status,
                mqtt_data,
                paused=paused,
            )

            return True

        return False

    def _update_latest_project_slice_param(
        self,
        incoming_project_id,
        new_slice_param,
    ):
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        if self._latest_project and (project_id < 0 or project_id == self._latest_project.id):
            self._latest_project.update_slice_param(
                new_slice_param,
            )

            return True

        return False

    def _update_latest_project_target_temps(
        self,
        incoming_project_id,
        new_target_hotbed_temp,
        new_target_nozzle_temp,
    ):
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        if self._latest_project and (project_id < 0 or project_id == self._latest_project.id):
            self._latest_project.update_target_temps(
                new_target_hotbed_temp,
                new_target_nozzle_temp,
            )

            return True

        return False

    def _process_mqtt_update_lastwill(self, action, state, payload):
        if action == 'onlineReport' and state == 'online':
            self._device_status = 1
            return
        elif action == 'onlineReport' and state == 'offline':
            self._device_status = 2
            return
        else:
            raise Exception('Unknown lastwill state.')

    def _process_mqtt_update_user(self, action, state, payload):
        if action == 'bindQuery' and state == 'done':
            return
        else:
            raise Exception('Unknown user bindQuery state.')

    def _process_mqtt_update_status(self, action, state, payload):
        if action == 'workReport' and state == 'free':
            self._is_printing = 1
            return
        elif action == 'workReport' and state == 'busy':
            self._is_printing = 2
            return
        else:
            raise Exception('Unknown status/workReport.')

    def _process_mqtt_update_ota(self, action, state, payload):
        if action == 'reportVersion' and state == 'done':
            data = payload['data']
            self._fw_version.update_version(data['firmware_version'])
            return
        else:
            raise Exception('Unknown ota version.')

    def _process_mqtt_update_temperature(self, action, state, payload):
        if action == 'auto' and state == 'done':
            data = payload['data']
            self._parameter.update_current_temps(
                data['curr_hotbed_temp'],
                data['curr_nozzle_temp'],
            )
            if self._latest_project:
                self._latest_project.update_target_temps(
                    data['target_hotbed_temp'],
                    data['target_nozzle_temp'],
                )
            return
        else:
            raise Exception('Unknown temperature data.')

    def _process_mqtt_update_fan(self, action, state, payload):
        if action == 'auto' and state == 'done':
            data = payload['data']
            fan_speed_pct = int(data['fan_speed_pct'])
            self._fan_speed = fan_speed_pct
            return
        else:
            raise Exception('Unknown fan data.')

    def _process_mqtt_update_print(self, action, state, payload):
        project_id = payload.get('data', {}).get('taskid', -1)
        if action == 'start' and state == 'printing':
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
            )
            return
        elif action == 'start' and state == 'preheating':
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Preheating,
                data,
            )
            return
        elif action == 'start' and state == 'finished':
            data = payload['data']
            self._is_printing = 1
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Complete,
                data,
            )
            return
        elif action == 'pause' and state in ['pausing', 'paused']:
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
                paused=1,
            )
            return
        elif action == 'resume' and state in ['resuming', 'resumed']:
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
                paused=0 if state == 'resumed' else 1,
            )
            return
        elif action == 'stop' and state in ['stoped', 'stopping']:
            data = payload['data']
            self._is_printing = 1
            self._update_latest_project_with_mqtt_data(
                project_id,
                AnycubicPrintStatus.Cancelled,
                data,
            )
            return
        elif action == 'getSliceParam' and state == 'done':
            data = payload['data']['slice_param']
            self._update_latest_project_slice_param(
                project_id,
                data,
            )
            return
        elif action in ['start', 'update'] and state == 'updated':
            data = payload['data']
            self._parameter.update_current_temps(
                data['curr_hotbed_temp'],
                data['curr_nozzle_temp'],
            )
            self._fan_speed = int(data['settings']['fan_speed_pct'])
            self._print_speed_pct = int(data['settings']['print_speed_pct'])
            self._print_speed_mode = int(data['settings']['print_speed_mode'])
            self._update_latest_project_target_temps(
                project_id,
                data['settings']['target_hotbed_temp'],
                data['settings']['target_nozzle_temp'],
            )
            return
        else:
            raise Exception('Unknown print status data.')

    def _process_mqtt_update_multicolorbox(self, action, state, payload):
        if action == 'getInfo' and state == 'success':
            data = payload['data']['multi_color_box']
            self._set_multi_color_box(data)
            return
        elif action == 'refresh' and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self._multi_color_box is None or len(self._multi_color_box) < box_id + 1:
                    continue

                self._multi_color_box[box_id].update_slots_with_mqtt_data(box['slots'])
            return

        elif action == 'autoUpdateInfo' and state == 'done':
            data = payload['data']
            box_id = int(data['id'])
            loaded_slot = int(data['loaded_slot'])
            if self._multi_color_box is None or len(self._multi_color_box) < box_id + 1:
                return

            self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
            return
        elif action in ['autoUpdateDryStatus', 'setDry'] and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self._multi_color_box is None or len(self._multi_color_box) < box_id + 1:
                    continue

                self._multi_color_box[box_id].set_current_temperature(box['temp'])
                self._multi_color_box[box_id].set_drying_status(box['drying_status'])
            return
        elif action == 'setAutoFeed' and state == 'done':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self._multi_color_box is None or len(self._multi_color_box) < box_id + 1:
                    continue

                self._multi_color_box[box_id].set_auto_feed(box['auto_feed'])
            return
        else:
            raise Exception('Unknown multiColorBox data.')

    def _process_mqtt_update_shelves(self, action, state, payload):
        if action == 'reportInfo' and state == 'success':
            data = payload['data']
            self.external_shelves.update_with_mqtt_data(data)
            return
        else:
            raise Exception('Unknown shelves data.')

    def _process_mqtt_update_file(self, action, state, payload):
        if action == 'listLocal' and state == 'done':
            data = payload['data']['records']
            self._set_local_file_list(data)
            return
        else:
            raise Exception('Unknown file data.')

    def process_mqtt_update(self, topic, payload):
        msg_type = payload['type']
        action = payload['action']
        state = payload.get('state')

        if msg_type == 'lastWill':
            return self._process_mqtt_update_lastwill(action, state, payload)

        elif msg_type == 'user':
            return self._process_mqtt_update_user(action, state, payload)

        elif msg_type == 'status':
            return self._process_mqtt_update_status(action, state, payload)

        elif msg_type == 'ota':
            return self._process_mqtt_update_ota(action, state, payload)

        elif msg_type == 'tempature':
            return self._process_mqtt_update_temperature(action, state, payload)

        elif msg_type == 'fan':
            return self._process_mqtt_update_fan(action, state, payload)

        elif msg_type == 'print':
            return self._process_mqtt_update_print(action, state, payload)

        elif msg_type == 'multiColorBox':
            return self._process_mqtt_update_multicolorbox(action, state, payload)

        elif msg_type == 'extfilbox':
            return self._process_mqtt_update_shelves(action, state, payload)

        elif msg_type == 'file':
            return self._process_mqtt_update_file(action, state, payload)

        else:
            raise Exception("Unknown mqtt update.")

    @property
    def machine_type(self):
        return self._machine_type

    @property
    def model(self):
        return self._machine_name

    @property
    def machine_name(self):
        return self._machine_name

    @property
    def machine_img(self):
        return self._machine_img

    @property
    def net_function_ids(self):
        return self._net_function_ids

    @property
    def net_default_function(self):
        return self._net_default_function

    @property
    def id(self):
        return self._id

    @property
    def user_id(self):
        return self._user_id

    @property
    def name(self):
        return self._name

    @property
    def nonce(self):
        return self._nonce

    @property
    def key(self):
        return self._key

    @property
    def user_img(self):
        return self._user_img

    @property
    def description(self):
        return self._description

    @property
    def printer_type(self):
        return self._printer_type

    @property
    def device_status(self):
        return self._device_status

    @property
    def printer_online(self):
        return self._device_status == 1

    @property
    def ready_status(self):
        return self._ready_status

    @property
    def is_printing(self):
        return self._is_printing

    @property
    def reason(self):
        return self._reason

    @property
    def current_status(self):
        if self._is_printing == 2:
            return "busy"
        elif self._is_printing == 1:
            return "available"
        else:
            return "unknown"

    @property
    def video_taskid(self):
        return self._video_taskid

    @property
    def msg(self):
        return self._msg

    @property
    def material_used(self):
        return self._material_used

    @property
    def print_totaltime(self):
        return self._print_totaltime

    @property
    def print_count(self):
        return self._print_count

    @property
    def status(self):
        return self._status

    @property
    def machine_mac(self):
        return self._machine_mac

    @property
    def delete(self):
        return self._delete

    @property
    def create_time(self):
        return self._create_time

    @property
    def delete_time(self):
        return self._delete_time

    @property
    def last_update_time(self):
        return self._last_update_time

    @property
    def machine_data(self):
        return self._machine_data

    @property
    def type_function_ids(self):
        return self._type_function_ids

    @property
    def material_type(self):
        return self._material_type

    @property
    def parameter(self):
        return self._parameter

    @property
    def fw_version(self):
        return self._fw_version

    @property
    def available(self):
        return self._available

    @property
    def color(self):
        return self._color

    @property
    def advance(self):
        return self._advance

    @property
    def tools(self):
        return self._tools

    @property
    def multi_color_box_fw_version(self):
        return self._multi_color_box_fw_version

    @property
    def external_shelves(self):
        return self._external_shelves

    @property
    def multi_color_box(self):
        return self._multi_color_box

    @property
    def primary_multi_color_box(self):
        return self._multi_color_box[0] if self._multi_color_box is not None else None

    @property
    def primary_drying_status(self):
        if self.primary_multi_color_box is None:
            return None

        return self.primary_multi_color_box.drying_status

    @property
    def latest_project(self):
        return self._latest_project

    async def update_info_from_api(self, with_project=True):
        await self._api_parent.printer_info_for_id(self._id, self)

        if with_project:
            self._latest_project = await self._api_parent.get_latest_project()

    async def multi_color_box_drying_start(
        self,
        duration,
        target_temp,
        box_id=0,
    ):
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_drying_start(
            self,
            duration=duration,
            target_temp=target_temp,
            box_id=box_id,
        )

    async def multi_color_box_drying_stop(
        self,
        box_id=-1,
    ):
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_drying_stop(
            self,
            box_id=box_id,
        )

    async def multi_color_box_set_auto_feed(
        self,
        enabled: bool,
        box_id=-1,
    ):
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_set_auto_feed(
            self,
            enabled=enabled,
            box_id=box_id,
        )

    async def multi_color_box_toggle_auto_feed(
        self,
        box_id=-1,
    ):
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_toggle_auto_feed(
            self,
            box_id=box_id,
        )

    async def cancel_print(
        self,
        project=None,
    ):

        return await self._api_parent.cancel_print(
            self,
        )

    def __repr__(self):
        if self._id is None:
            return f"AnycubicPrinter(machine_type={self._machine_type}, machine_name={self._machine_name})"
        else:
            return (
                f"AnycubicPrinter(machine_type={self._machine_type}, machine_name={self._machine_name},\n "
                f"id={self.id}, name={self.name}, key={self.key}, printer_type={self.printer_type}, status={self.status}, "
                f"available={self.available},\n "
                f"device_status={self.device_status}, printer_online={self.printer_online}, ready_status={self.ready_status}, "
                f"is_printing={self.is_printing}, reason={self.reason},\n "
                f"machine_data=\n{self.machine_data},\n "
                f"parameter=\n{self.parameter},\n "
                f"fw_version=\n{self.fw_version},\n "
                f"color=\n{self.color},\n "
                f"tools=\n{self.tools},\n "
                f"multi_color_box_fw_version=\n{self.multi_color_box_fw_version},\n "
                f"external_shelves=\n{self.external_shelves},\n "
                f"multi_color_box=\n{self.multi_color_box},\n "
                f"primary_drying_status=\n{self.primary_drying_status},\n "
                f")")
