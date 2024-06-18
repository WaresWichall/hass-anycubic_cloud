import json
import time


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
        self._gcode_name = str(gcode_name)
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

    def update_extra_data(self, data):
        self._target_nozzle_temp = data.get('temp', {}).get('target_nozzle_temp')
        self._target_hotbed_temp = data.get('temp', {}).get('target_hotbed_temp')

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
    def print_in_progress(self):
        return self._print_status == 1

    @property
    def print_complete(self):
        return self._print_status == 2

    @property
    def print_failed(self):
        return self._print_status == 3

    @property
    def print_is_paused(self):
        return self._pause != 0

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
        if self.print_in_progress:
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
            f"print_is_paused={self.print_is_paused},\n "
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

    def __repr__(self):
        return (
            f"AnycubicDryingStatus(status={self._status}, target_temp={self._target_temp}, duration={self._duration}, "
            f"remain_time={self._remain_time})"
        )


class AnycubicSpoolInfo:
    def __init__(
        self,
        index,
        sku,
        type,
        color,
        edit_status,
        status,
    ):
        self._index = int(index)
        self._sku = str(sku)
        self._type = str(type)
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
            type=data['type'],
            color=data['color'],
            edit_status=data['edit_status'],
            status=data['status'],
        )

    def __repr__(self):
        return (
            f"AnycubicSpoolInfo(index={self._index}, sku={self._sku}, type={self._type}, color={self._color}, "
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
        self._temp = int(temp)
        self._drying_status = AnycubicDryingStatus.from_json(drying_status)
        self._curr_nozzle_temp = int(curr_nozzle_temp)
        self._target_nozzle_temp = int(target_nozzle_temp)
        self._slots = list([AnycubicSpoolInfo.from_json(x) for x in slots])

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
            curr_nozzle_temp=data['curr_nozzle_temp'],
            target_nozzle_temp=data['target_nozzle_temp'],
            slots=data['slots'],
        )

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
        self._multi_color_box = AnycubicMultiColorBox.from_json(multi_color_box)

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
        self._multi_color_box = AnycubicMultiColorBox.from_json(data['multi_color_box'])

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
    def ready_status(self):
        return self._ready_status

    @property
    def is_printing(self):
        return self._is_printing

    @property
    def reason(self):
        return self._reason

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

    async def update_info_from_api(self):
        await self._api_parent.printer_info_for_id(self._id, self)

    def __repr__(self):
        if self._id is None:
            return f"AnycubicPrinter(machine_type={self._machine_type}, machine_name={self._machine_name})"
        else:
            return (
                f"AnycubicPrinter(machine_type={self._machine_type}, machine_name={self._machine_name},\n "
                f"id={self.id}, name={self.name}, key={self.key}, printer_type={self.printer_type}, status={self.status}, "
                f"available={self.available},\n "
                f"device_status={self.device_status}, ready_status={self.ready_status}, is_printing={self.is_printing}, "
                f"reason={self.reason},\n "
                f"machine_data=\n{self.machine_data},\n "
                f"parameter=\n{self.parameter},\n "
                f"fw_version=\n{self.fw_version},\n "
                f"color=\n{self.color},\n "
                f"tools=\n{self.tools},\n "
                f"multi_color_box_fw_version=\n{self.multi_color_box_fw_version},\n "
                f"external_shelves=\n{self.external_shelves},\n "
                f"multi_color_box=\n{self.multi_color_box},\n "
                f")")
