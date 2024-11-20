from __future__ import annotations

from typing import Any

from .anycubic_error_strings import ErrorsDataParsing
from .anycubic_exceptions import AnycubicDataParsingError


class AnycubicMaterialMapping:
    def __init__(
        self,
        spool_index: int,
        filament_used: float,
        material_type: str,
        color_red: int,
        color_green: int,
        color_blue: int,
        paint_index: int = 0,
    ) -> None:
        self._spool_index = int(spool_index)
        self._filament_used = float(filament_used)
        self._material_type = str(material_type)
        self._color_red = int(color_red)
        self._color_green = int(color_green)
        self._color_blue = int(color_blue)
        self._paint_index = int(paint_index)

    @property
    def spool_index(self) -> int:
        return self._spool_index

    @property
    def filament_used(self) -> float:
        return self._filament_used

    @property
    def material_type(self) -> str:
        return self._material_type

    @property
    def paint_index(self) -> int:
        return self._paint_index

    @property
    def color_data(self) -> list[int]:
        return list([
            self._color_red,
            self._color_green,
            self._color_blue,
        ])

    def as_box_mapping_data(self) -> dict[str, Any]:
        return {
            'ams_color': self.color_data,
            'ams_index': self._spool_index,
            'filament_used': self._filament_used,
            'material_type': self._material_type,
            'paint_color': self.color_data,
            'paint_index': self._paint_index,
        }

    def __repr__(self) -> str:
        return (
            f"AnycubicMaterialMapping("
            f"spool_index={self._spool_index}, "
            f"filament_used={self._filament_used}, "
            f"material_type={self._material_type}, "
            f"color_red={self._color_red}, "
            f"color_green={self._color_green}, "
            f"color_blue={self._color_blue}, "
            f"paint_index={self._paint_index})"
        )


class AnycubicMaterialColor:
    def __init__(
        self,
        red: int,
        green: int,
        blue: int,
    ) -> None:
        self._red: int = red
        self._green: int = green
        self._blue: int = blue

    @property
    def red(self) -> int:
        return self._red

    @property
    def green(self) -> int:
        return self._green

    @property
    def blue(self) -> int:
        return self._blue

    @property
    def data(self) -> list[int]:
        return list([
            self._red,
            self._green,
            self._blue,
        ])

    def __repr__(self) -> str:
        return (
            f"AnycubicMaterialColor("
            f"red={self._red}, "
            f"green={self._green}, "
            f"blue={self._blue})"
        )


# class AnycubicMachineBaseInfo:
#     def __init__(
#         self,
#         print_count: int,
#         print_totaltime: str,
#         material_type: str,
#         material_used: str,
#         description: str,
#         create_time: int,
#         firmware_version: str,
#         machine_mac: str,
#     ) -> None:
#         self._print_count: int = int(print_count)
#         self._print_totaltime: str = str(print_totaltime)
#         self._material_type: str = str(material_type)
#         self._material_used: str = str(material_used)
#         self._description: str = str(description)
#         self._create_time: int = int(create_time)
#         self._firmware_version = str(firmware_version)
#         self._machine_mac: str = str(machine_mac)

#     @classmethod
#     def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineBaseInfo | None:
#         if data is None:
#             return None

#         return cls(
#             print_count=data['print_count'],
#             print_totaltime=data['print_totaltime'],
#             material_type=data['material_type'],
#             material_used=data['material_used'],
#             description=data['description'],
#             create_time=data['create_time'],
#             firmware_version=data['firmware_version'],
#             machine_mac=data['machine_mac'],
#         )

#     def __repr__(self) -> str:
#         return (
#             f"AnycubicMachineBaseInfo(print_count={self._print_count}, print_totaltime={self._print_totaltime}, "
#             f"material_type={self._material_type}, material_used={self._material_used},"
#             f"description={self._description}, create_time={self._create_time}, firmware_version={self._firmware_version}, "
#             f"machine_mac={self._machine_mac})"
#         )


class AnycubicMachineToolInfo:
    def __init__(
        self,
        id: int,
        typd_id: int,
        model_id: int,
        type_function_id: int,
        parent_id: int,
        function_name: str,
        function_des: str,
        control: int,
        param: Any,
        icon_url: str,
        function_type: int,
        status: int,
        show_place: int,
    ) -> None:
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
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineToolInfo | None:
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

    def __repr__(self) -> str:
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
        id: int,
        type: str,
        color: list[int],
        loaded: int,
        status_type: int,
        current_status: int,
    ) -> None:
        self._id = int(id)
        self._type = str(type)
        self._color = list([
            int(x) for x in color
        ])
        self._loaded = int(loaded)
        self._status_type = int(status_type)
        self._current_status = int(current_status)

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineExternalShelves | None:
        if data is None:
            return None

        return cls(
            id=data['id'],
            type=data['type'],
            color=data['color'],
            loaded=data.get('loaded', False),
            status_type=data.get('status_type', False),
            current_status=data.get('current_status', False),
        )

    def update_with_mqtt_data(self, data: dict[str, Any] | None) -> None:
        if data is None:
            return None

        self._type = data['type']
        self._color = data['color']
        self._loaded = data['loaded']
        self._status_type = data['status_type']
        self._current_status = data['current_status']

    def __repr__(self) -> str:
        return (
            f"AnycubicMachineExternalShelves(id={self._id}, type={self._type}, color={self._color}, loaded={self._loaded}, "
            f"status_type={self._status_type}, current_status={self._current_status})"
        )


class AnycubicFeedStatus:
    def __init__(
        self,
        code: int,
        type: int,
        current_status: int,
        slot_index: int,
    ) -> None:
        self._code = int(code)
        self._type = int(type)
        self._current_status = int(current_status)
        self._slot_index = int(slot_index)

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicFeedStatus | None:
        if data is None:
            return None

        return cls(
            code=data.get('code', -1),
            type=data['type'],
            current_status=data['current_status'],
            slot_index=data['slot_index'],
        )

    def __repr__(self) -> str:
        return (
            f"AnycubicFeedStatus(code={self._code}, type={self._type}, current_status={self._current_status}, "
            f"slot_index={self._slot_index})"
        )


class AnycubicDryingStatus:
    def __init__(
        self,
        status: int,
        target_temp: int,
        duration: int,
        remain_time: int,
    ) -> None:
        self._status = int(status)
        self._target_temp = int(target_temp)
        self._duration = int(duration)
        self._remain_time = int(remain_time)

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicDryingStatus | None:
        if data is None:
            return None

        return cls(
            status=data['status'],
            target_temp=data.get('target_temp', 0),
            duration=data.get('duration', 0),
            remain_time=data.get('remain_time', 0),
        )

    @property
    def is_drying(self) -> bool:
        return self._status == 1

    @property
    def raw_status_code(self) -> int:
        return self._status

    @property
    def target_temperature(self) -> int:
        return self._target_temp if self.is_drying else 0

    @property
    def total_duration(self) -> int:
        return self._duration if self.is_drying else 0

    @property
    def remaining_time(self) -> int:
        return self._remain_time if self.is_drying else 0

    def __repr__(self) -> str:
        return (
            f"AnycubicDryingStatus(is_drying={self.is_drying}, status={self._status}, target_temp={self._target_temp}, "
            f"duration={self._duration}, remain_time={self._remain_time})"
        )


class AnycubicSpoolInfo:
    def __init__(
        self,
        index: int,
        sku: str,
        material_type: str,
        color: list[int],
        edit_status: int,
        status: int,
    ) -> None:
        self._index = int(index)
        self._sku = str(sku)
        self._material_type = str(material_type)
        self._color = list([
            int(x) for x in color
        ])
        self._edit_status = int(edit_status)
        self._status = int(status)

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicSpoolInfo | None:
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
    def material_type(self) -> str:
        return self._material_type

    @property
    def color(self) -> list[int]:
        return self._color

    @property
    def color_red(self) -> int:
        return self._color[0]

    @property
    def color_green(self) -> int:
        return self._color[1]

    @property
    def color_blue(self) -> int:
        return self._color[2]

    @property
    def status(self) -> int:
        return self._status

    @property
    def spool_loaded(self) -> bool:
        return self._status == 5

    def set_spool_loaded(self, is_loaded: bool) -> None:
        if is_loaded:
            self._status = 5
        else:
            self._status = 4

    def __repr__(self) -> str:
        return (
            f"AnycubicSpoolInfo(index={self._index}, sku={self._sku}, material_type={self.material_type}, color={self._color}, "
            f"edit_status={self._edit_status}, status={self._status})"
        )


class AnycubicMultiColorBox:
    def __init__(
        self,
        id: int,
        status: int,
        model_id: int,
        auto_feed: int,
        loaded_slot: int,
        feed_status: dict[str, Any] | None,
        temp: int,
        drying_status: dict[str, Any] | None,
        curr_nozzle_temp: int | None,
        target_nozzle_temp: int | None,
        slots: list[dict[str, Any]],
    ) -> None:
        self._id: int = int(id)
        self._status: int = int(status)
        self._model_id: int = int(model_id)
        self._auto_feed: int = int(auto_feed)
        self._loaded_slot: int = int(loaded_slot)
        self.set_feed_status(feed_status)
        self.set_current_temperature(temp)
        self.set_drying_status(drying_status)
        self._curr_nozzle_temp: int | None = int(curr_nozzle_temp) if curr_nozzle_temp is not None else None
        self._target_nozzle_temp: int | None = int(target_nozzle_temp) if target_nozzle_temp is not None else None
        self._slots: list[AnycubicSpoolInfo] = list()
        for x in slots:
            if spool := AnycubicSpoolInfo.from_json(x):
                self._slots.append(spool)
            else:
                raise AnycubicDataParsingError(ErrorsDataParsing.ace.format(slots))

    def set_auto_feed(self, auto_feed: int) -> None:
        self._auto_feed = int(auto_feed)

    def set_drying_status(self, drying_status: dict[str, Any] | None) -> None:
        self._drying_status = AnycubicDryingStatus.from_json(drying_status)

    def set_feed_status(self, feed_status: dict[str, Any] | None) -> None:
        self._feed_status = AnycubicFeedStatus.from_json(feed_status)

    def set_slot_loaded(self, slot_num: int) -> None:
        self._loaded_slot = slot_num

    def set_current_temperature(self, temp: int) -> None:
        self._temp = int(temp)

    def update_slots_with_mqtt_data(self, slot_list: list[dict[str, Any]] | None) -> None:
        if slot_list is None:
            return

        for slot in slot_list:
            slot_index = slot['index']
            if spool := AnycubicSpoolInfo.from_json(slot):
                self._slots[slot_index] = spool
            else:
                raise AnycubicDataParsingError(ErrorsDataParsing.ace.format(slot_list))

    def build_mapping_for_material_list(
        self,
        slot_index_list: list[int],
        material_list: list[dict[str, Any]],
    ) -> list[AnycubicMaterialMapping]:
        box_slots = self.slots
        ams_box_mapping = list()

        for x, mat_conf in enumerate(material_list):
            slot_index = slot_index_list[x]
            spool_index = slot_index
            slot_index = slot_index - (4 * self.box_id)

            if slot_index < 0 or slot_index > 3:
                continue

            ams_slot = box_slots[slot_index]
            material = AnycubicMaterialMapping(
                spool_index=spool_index,
                filament_used=mat_conf['filament_used'],
                material_type=mat_conf['material_type'],
                color_red=ams_slot.color_red,
                color_green=ams_slot.color_green,
                color_blue=ams_slot.color_blue,
                paint_index=mat_conf['paint_index'],
            )
            ams_box_mapping.append(material)

        return ams_box_mapping

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMultiColorBox | None:
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
    def current_temperature(self) -> int:
        return self._temp

    @property
    def box_id(self) -> int:
        return self._id

    @property
    def auto_feed(self) -> int:
        return self._auto_feed

    @property
    def slots(self) -> list[AnycubicSpoolInfo]:
        return self._slots

    @property
    def total_slots(self) -> int:
        return len(self._slots)

    @property
    def drying_status(self) -> AnycubicDryingStatus | None:
        return self._drying_status

    @property
    def spool_info_object(self) -> list[dict[str, Any]] | None:
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

    def __repr__(self) -> str:
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
        name: str,
        pixel: float,
        res_x: int,
        res_y: int,
        format: str,
        size_x: float,
        size_y: float,
        size_z: float,
        suffix: str,
        anti_max: int,
    ) -> None:
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
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineData | None:
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

    def __repr__(self) -> str:
        return (
            f"AnycubicMachineData(name={self._name}, pixel={self._pixel}, format={self._format}, suffix={self._suffix},\n "
            f"res_x={self._res_x}, res_y={self._res_y}, size_x={self._size_x}, size_y={self._size_y}, size_z={self._size_z}, "
            f"anti_max={self._anti_max})"
        )


class AnycubicMachineParameter:
    def __init__(
        self,
        curr_hotbed_temp: int,
        curr_nozzle_temp: int,
    ) -> None:
        self._curr_hotbed_temp = int(curr_hotbed_temp)
        self._curr_nozzle_temp = int(curr_nozzle_temp)

    @property
    def curr_hotbed_temp(self) -> int:
        return self._curr_hotbed_temp

    @property
    def curr_nozzle_temp(self) -> int:
        return self._curr_nozzle_temp

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineParameter | None:
        if data is None:
            return None

        return cls(
            curr_hotbed_temp=data['curr_hotbed_temp'],
            curr_nozzle_temp=data['curr_nozzle_temp'],
        )

    def update_current_temps(self, new_hotbed_temp: int, new_nozzle_temp: int) -> None:
        self._curr_hotbed_temp = int(new_hotbed_temp)
        self._curr_nozzle_temp = int(new_nozzle_temp)

    def __repr__(self) -> str:
        return f"AnycubicMachineParameter(curr_hotbed_temp={self._curr_hotbed_temp}, curr_nozzle_temp={self._curr_nozzle_temp})"


class AnycubicMachineFirmwareInfo:
    def __init__(
        self,
        need_update: int,
        firmware_version: str,
        update_progress: int | None = None,
        update_date: int | None = None,
        update_status: str | None = None,
        update_desc: str | None = None,
        force_update: str | None = None,
        target_version: str | None = None,
        time_cost: int | None = None,
        box_id: int | None = None,
    ) -> None:
        self.set_need_update(need_update)
        self.set_firmware_version(firmware_version)
        self.set_update_progress(update_progress)
        self.set_update_date(update_date)
        self.set_update_status(update_status)
        self.set_update_desc(update_desc)
        self.set_force_update(force_update)
        self.set_target_version(target_version)
        self.set_time_cost(time_cost)
        self.set_box_id(box_id)

        self._download_progress: int = 0
        self._is_downloading: bool = False
        self._is_updating: bool = False

    @property
    def firmware_version(self) -> str:
        return self._firmware_version

    @property
    def update_available(self) -> bool:
        return self._need_update == 1

    @property
    def update_progress(self) -> int:
        return self._update_progress

    @property
    def download_progress(self) -> int:
        return self._download_progress

    @property
    def total_progress(self) -> int | float | bool:
        if self._is_updating or self._is_downloading:
            if self._update_progress == 0 and self._download_progress > 0:
                return min(self._download_progress / 2, 100)
            elif self._update_progress > 0:
                return min(self._update_progress / 2 + 50, 100)
            return 1
        return False

    @property
    def available_version(self) -> str | None:
        return self._target_version

    @property
    def is_updating(self) -> bool:
        return self._is_updating

    @property
    def is_downloading(self) -> bool:
        return self._is_downloading

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicMachineFirmwareInfo | None:
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

    def update_from_json(self, data: dict[str, Any] | None) -> None:
        if data is None:
            return

        self.set_need_update(data['need_update'])
        self.set_firmware_version(data['firmware_version'])

        if data.get('update_progress') is not None:
            self.set_update_progress(data['update_progress'])

        self.set_update_date(data.get('update_date'))
        self.set_update_status(data.get('update_status'))
        self.set_update_desc(data.get('update_desc'))
        self.set_force_update(data.get('force_update'))
        self.set_target_version(data.get('target_version'))
        self.set_time_cost(data.get('time_cost'))
        self.set_box_id(data.get('box_id'))

    def update_version(self, new_version: str) -> None:
        if self._firmware_version != str(new_version):
            self.set_firmware_version(new_version)

            if self._is_updating:
                self.set_is_updating(False)

            if self._is_downloading:
                self.set_is_downloading(False)

            self.set_download_progress(0)
            self.set_update_progress(0)
            self.set_need_update(0)

    def set_need_update(self, need_update: int) -> None:
        self._need_update = int(need_update)

    def set_firmware_version(self, firmware_version: str) -> None:
        self._firmware_version = str(firmware_version)

    def set_update_date(self, update_date: int | None) -> None:
        self._update_date = int(update_date) if update_date is not None else None

    def set_update_status(self, update_status: str | None) -> None:
        self._update_status = str(update_status) if update_status is not None else None

    def set_update_desc(self, update_desc: str | None) -> None:
        self._update_desc = str(update_desc) if update_desc is not None else None

    def set_force_update(self, force_update: str | None) -> None:
        self._force_update = str(force_update) if force_update is not None else None

    def set_target_version(self, target_version: str | None) -> None:
        self._target_version = str(target_version) if target_version is not None else None

    def set_time_cost(self, time_cost: int | None) -> None:
        self._time_cost = int(time_cost) if time_cost is not None else None

    def set_box_id(self, box_id: int | None) -> None:
        self._box_id = int(box_id) if box_id is not None else None

    def set_is_updating(self, is_updating: bool) -> None:
        self._is_updating = bool(is_updating)

    def set_is_downloading(self, is_downloading: bool) -> None:
        self._is_downloading = bool(is_downloading)

    def set_update_progress(self, update_progress: int | None) -> None:
        self._update_progress = int(update_progress) if update_progress is not None else 0

    def set_download_progress(self, download_progress: int) -> None:
        self._download_progress = int(download_progress)

    def __repr__(self) -> str:
        return f"AnycubicMachineFirmwareInfo(need_update={self._need_update}, firmware_version={self._firmware_version})"


class AnycubicMachineColorInfo:
    def __init__(
        self,
        color_list: list[list[int]],
    ) -> None:
        self._raw_color_list: list[list[int]] = color_list
        self._color_list: list[list[int]] = list()
        self._set_color_list()

    def _set_color_list(
        self,
    ) -> None:
        extended_colors_found = False
        if len(self._raw_color_list) > 4:
            for x in self._raw_color_list[4:]:
                if any([c != -2 for c in x]):
                    extended_colors_found = True

        self._color_list = (
            self._raw_color_list[:4]
            if not extended_colors_found else
            self._raw_color_list[:]
        )

    @classmethod
    def from_json(cls, data: list[list[int]] | None) -> AnycubicMachineColorInfo | None:
        if data is None or not isinstance(data, list):
            return None

        return cls(
            color_list=data,
        )

    @property
    def color_list(self) -> list[list[int]]:
        return self._color_list

    def __repr__(self) -> str:
        return f"AnycubicMachineColorInfo(color_list={self.color_list})"
