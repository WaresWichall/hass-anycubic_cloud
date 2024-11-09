from __future__ import annotations

from typing import TYPE_CHECKING, Any

from .anycubic_data_model_consumable import AnycubicConsumableData
from .anycubic_data_model_files import AnycubicFile
from .anycubic_data_model_printer_properties import (
    AnycubicMachineColorInfo,
    AnycubicMachineData,
    AnycubicMachineExternalShelves,
    AnycubicMachineFirmwareInfo,
    AnycubicMachineParameter,
    AnycubicMachineToolInfo,
    AnycubicMaterialColor,
    AnycubicMultiColorBox,
)
from .anycubic_data_model_printing_settings import AnycubicPrintingSettings
from .anycubic_data_model_project import AnycubicProject
from .anycubic_enums import (
    AnycubicFunctionID,
    AnycubicPrinterMaterialType,
    AnycubicPrintStatus,
)
from .anycubic_exceptions import (
    AnycubicAPIError,
    AnycubicDataParsingError,
    AnycubicMQTTUnhandledData,
)
from .anycubic_helpers import (
    get_part_from_mqtt_topic,
    time_duration_string_to_delta,
    timedelta_to_dhm_string,
    timedelta_to_total_hours,
)

if TYPE_CHECKING:
    from datetime import timedelta

    from .anycubic_api import AnycubicAPI
    from .anycubic_data_model_print_response import AnycubicPrintResponse
    from .anycubic_data_model_printer_properties import AnycubicDryingStatus, AnycubicMaterialMapping


class AnycubicPrinter:
    def __init__(
        self,
        api_parent: AnycubicAPI,
        machine_type: int,
        machine_name: str,
        machine_img: str | None = None,
        net_function_ids: list[int] | None = None,
        net_default_function: int | None = None,
        id: int | None = None,
        user_id: int | None = None,
        name: str | None = None,
        nonce: str | int | None = None,
        key: str | None = None,
        user_img: str | None = None,
        description: str | None = None,
        printer_type: str | None = None,
        device_status: int | None = None,
        ready_status: int | None = None,
        is_printing: int | None = None,
        reason: str | None = None,
        video_taskid: int | None = None,
        msg: str | None = None,
        material_used: str | None = None,
        print_totaltime: str | None = None,
        print_count: int | None = None,
        status: int | None = None,
        machine_mac: str | None = None,
        delete: int | None = None,
        create_time: int | None = None,
        delete_time: int | None = None,
        last_update_time: int | None = None,
        machine_data: dict[str, Any] | None = None,
        type_function_ids: list[int] | None = None,
        material_type: str | None = None,
        parameter: dict[str, Any] | None = None,
        fw_version: dict[str, Any] | None = None,
        available: int | None = None,
        color: list[list[int]] | None = None,
        advance: list[Any] | None = None,
        tools: list[dict[str, Any]] | None = None,
        multi_color_box_fw_version: list[dict[str, Any]] | None = None,
        external_shelves: dict[str, Any] | None = None,
        multi_color_box: list[dict[str, Any]] | dict[str, Any] | None = None,
        ignore_init_errors: bool = False,
        # base_info=None,
    ) -> None:
        self._ignore_init_errors: bool = ignore_init_errors
        self._initialisation_error: bool = False

        self._api_parent: AnycubicAPI = api_parent
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
        self._is_printing: int = int(is_printing) if is_printing is not None else 1
        self._reason = reason
        self._video_taskid = video_taskid
        self._msg = msg
        self._material_used = material_used
        self._set_total_print_time(print_totaltime)
        self._print_count = print_count
        self._status = status
        self._machine_mac = machine_mac
        self._delete = delete
        self._create_time = create_time
        self._delete_time = delete_time
        self._last_update_time = last_update_time
        self._set_machine_data(machine_data)
        self._set_type_function_ids(type_function_ids)
        self._set_material_type(material_type)
        self._set_parameter(parameter)
        self._set_fw_version(fw_version)
        self._available = available
        self._set_color(color)
        self._advance = advance
        self._set_tools(tools)
        self._set_multi_color_box_fw_version(multi_color_box_fw_version)
        self._set_external_shelves(external_shelves)
        self._set_multi_color_box(multi_color_box)

        self._latest_project: AnycubicProject | None = None
        self._fan_speed: int = 0
        self._print_speed_pct: int = 0
        self._print_speed_mode: int = 0
        self._local_file_list: list[AnycubicFile] | None = None
        self._udisk_file_list: list[AnycubicFile] | None = None
        self._has_peripheral_camera: bool = False
        self._has_peripheral_multi_color_box: bool = False
        self._has_peripheral_udisk: bool = False
        self._is_bound_to_user: bool = True

        self._ignore_init_errors = False

    def _set_total_print_time(self, print_totaltime: str | None) -> None:
        self._total_print_time: str | None = print_totaltime
        self._total_print_time_delta: timedelta = time_duration_string_to_delta(print_totaltime)
        self._total_print_time_hrs: int = int(timedelta_to_total_hours(self._total_print_time_delta))
        self._total_print_time_dhm_str: str = timedelta_to_dhm_string(self._total_print_time_delta)

    def set_has_peripheral_camera(self, has_peripheral: bool) -> None:
        self._has_peripheral_camera = bool(has_peripheral)

    def set_has_peripheral_multi_color_box(self, has_peripheral: bool) -> None:
        self._has_peripheral_multi_color_box = bool(has_peripheral)

    def set_has_peripheral_udisk(self, has_peripheral: bool) -> None:
        self._has_peripheral_udisk = bool(has_peripheral)

    def _set_type_function_ids(self, type_function_ids: list[int] | None) -> None:
        if isinstance(type_function_ids, list):
            self._type_function_ids = type_function_ids
        else:
            self._type_function_ids = list()

    def _set_material_type(self, material_type: str | None) -> None:
        self._material_type: AnycubicPrinterMaterialType | str | None = None

        if material_type and isinstance(material_type, str):
            try:
                self._material_type = AnycubicPrinterMaterialType(material_type.title())

            except ValueError:
                self._material_type = material_type

    def _set_local_file_list(self, file_list: list[dict[str, Any]] | None) -> None:
        if file_list is None:
            return

        self._local_file_list = list()
        for x in file_list:
            file = AnycubicFile.from_json(x)
            if file:
                self._local_file_list.append(file)
            else:
                raise AnycubicDataParsingError(
                    f"Error parsing local_file_list: {file_list}"
                )

    def _set_udisk_file_list(self, file_list: list[dict[str, Any]] | None) -> None:
        if file_list is None:
            return

        self._udisk_file_list = list()
        for x in file_list:
            file = AnycubicFile.from_json(x)
            if file:
                self._udisk_file_list.append(file)
            else:
                raise AnycubicDataParsingError(
                    f"Error parsing udisk_file_list: {file_list}"
                )

    def _set_multi_color_box(self, multi_color_box: list[dict[str, Any]] | dict[str, Any] | None) -> None:
        self._multi_color_box: list[AnycubicMultiColorBox] | None = None
        try:
            if multi_color_box is None or isinstance(multi_color_box, list):
                multi_color_box_list = multi_color_box
            else:
                multi_color_box_list = list([multi_color_box])
            if multi_color_box_list is not None:
                self._multi_color_box = list()
                for x in multi_color_box_list:
                    ace = AnycubicMultiColorBox.from_json(x)
                    if ace:
                        self._multi_color_box.append(ace)
                    else:
                        raise AnycubicDataParsingError(
                            f"Error parsing multi_color_box: {multi_color_box}"
                        )

        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_machine_data(
        self,
        machine_data: dict[str, Any] | None,
    ) -> None:
        try:
            self._machine_data = AnycubicMachineData.from_json(machine_data)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_parameter(
        self,
        parameter: dict[str, Any] | None,
    ) -> None:
        try:
            self._parameter = AnycubicMachineParameter.from_json(parameter)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_fw_version(
        self,
        fw_version: dict[str, Any] | None,
    ) -> None:
        try:
            self._fw_version = AnycubicMachineFirmwareInfo.from_json(fw_version)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_color(
        self,
        color: list[list[int]] | None,
    ) -> None:
        try:
            self._color = AnycubicMachineColorInfo.from_json(color)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_tools(
        self,
        tools: list[dict[str, Any]] | None,
    ) -> None:
        self._tools: list[AnycubicMachineToolInfo] | None = None
        try:
            if tools is not None:
                self._tools = list()
                for x in tools:
                    tool = AnycubicMachineToolInfo.from_json(x)
                    if tool:
                        self._tools.append(tool)
                    else:
                        raise AnycubicDataParsingError(
                            f"Error parsing tools: {tools}"
                        )
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_multi_color_box_fw_version(
        self,
        multi_color_box_fw_version: list[dict[str, Any]] | None,
    ) -> None:
        self._multi_color_box_fw_version: list[AnycubicMachineFirmwareInfo] | None = None
        try:
            if multi_color_box_fw_version is not None:
                self._multi_color_box_fw_version = list()
                for x in multi_color_box_fw_version:
                    ace = AnycubicMachineFirmwareInfo.from_json(x)
                    if ace:
                        self._multi_color_box_fw_version.append(ace)
                    else:
                        raise AnycubicDataParsingError(
                            f"Error parsing multi_color_box_fw_version: {multi_color_box_fw_version}"
                        )
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_external_shelves(
        self,
        external_shelves: dict[str, Any] | None,
    ) -> None:
        try:
            self._external_shelves = AnycubicMachineExternalShelves.from_json(external_shelves)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _update_fw_version_from_json(
        self,
        fw_version: dict[str, Any] | None,
    ) -> None:
        if fw_version is None:
            return

        if self._fw_version:
            self._fw_version.update_from_json(fw_version)
        else:
            self._set_fw_version(fw_version)

    def _update_multi_color_box_fw_version_from_json(
        self,
        multi_color_box_fw_version: list[dict[str, Any]] | None,
    ) -> None:
        if (
            multi_color_box_fw_version is None or
            not isinstance(multi_color_box_fw_version, list) or
            len(multi_color_box_fw_version) < 1
        ):
            return

        if self._multi_color_box_fw_version and len(self._multi_color_box_fw_version) > 0:
            for x, fwver in enumerate(self._multi_color_box_fw_version):
                if fwver and len(multi_color_box_fw_version) >= x + 1:
                    fwver.update_from_json(multi_color_box_fw_version[x])
        else:
            self._set_multi_color_box_fw_version(multi_color_box_fw_version)

    @classmethod
    def from_basic_json(
        cls,
        api_parent: AnycubicAPI,
        data: dict[str, Any],
    ) -> AnycubicPrinter:
        return cls(
            api_parent=api_parent,
            machine_type=data['machine_type'],
            machine_name=data['name'],
            machine_img=data['img'],
            net_function_ids=data['net_function_ids'],
            net_default_function=data['net_default_function'],
        )

    @classmethod
    def from_status_json(
        cls,
        api_parent: AnycubicAPI,
        data: dict[str, Any],
        ignore_init_errors: bool = False,
    ) -> AnycubicPrinter:
        return cls(
            api_parent=api_parent,
            id=data['id'],
            user_id=data['user_id'],
            name=data['name'],
            nonce=data['nonce'],
            key=data['key'],
            machine_type=data['machine_type'],
            machine_name=data['model'],
            user_img=data.get('img'),
            description=data.get('description'),
            printer_type=data['type'],
            device_status=data['device_status'],
            ready_status=data['ready_status'],
            is_printing=data['is_printing'],
            reason=data.get('reason'),
            video_taskid=data.get('video_taskid'),
            msg=data.get('msg'),
            material_used=data.get('material_used'),
            print_totaltime=data.get('print_totaltime'),
            status=data['status'],
            machine_mac=data.get('machine_mac'),
            delete=data['delete'],
            create_time=data.get('create_time'),
            delete_time=data['delete_time'],
            last_update_time=data['last_update_time'],
            machine_data=data['machine_data'],
            type_function_ids=data['type_function_ids'],
            material_type=data.get('material_type'),
            parameter=data.get('parameter'),
            fw_version=data['version'],
            available=data.get('available'),
            color=data.get('color'),
            ignore_init_errors=ignore_init_errors,
        )

    @classmethod
    def from_info_json(
        cls,
        api_parent: AnycubicAPI,
        data: dict[str, Any],
        ignore_init_errors: bool = False,
    ) -> AnycubicPrinter:
        try:
            extra_data = data.get('base', {})
            return cls(
                api_parent=api_parent,
                id=data['id'],
                name=data['name'],
                key=data['key'],
                machine_type=data['machine_type'],
                machine_name=data['model'],
                user_img=data.get('img'),
                description=extra_data.get('description'),
                device_status=data['device_status'],
                is_printing=data['is_printing'],
                material_used=extra_data.get('material_used'),
                print_totaltime=extra_data.get('print_totaltime'),
                print_count=extra_data.get('print_count'),
                machine_mac=extra_data.get('machine_mac'),
                create_time=extra_data.get('create_time'),
                machine_data=data.get('machine_data'),
                type_function_ids=data['type_function_ids'],
                material_type=extra_data.get('material_type'),
                parameter=data.get('parameter'),
                fw_version=data['version'],
                tools=data.get('tools'),
                multi_color_box_fw_version=data.get('multi_color_box_version'),
                external_shelves=data.get('external_shelves'),
                multi_color_box=data.get('multi_color_box'),
                ignore_init_errors=ignore_init_errors,
            )
        except Exception as e:
            print(data)
            raise e

    def update_from_info_json(self, data: dict[str, Any] | None) -> None:
        if data is None:
            return

        if str(self._id) != str(data['id']):
            return

        extra_data = data.get('base', {})

        self._name = data['name']
        self._key = data['key']
        self._machine_type = data['machine_type']
        self._machine_name = data['model']
        self._user_img = data['img']
        self._description = extra_data.get('description')
        self._device_status = data['device_status']
        self._is_printing = data['is_printing']
        self._material_used = extra_data.get('material_used')
        self._set_total_print_time(extra_data.get('print_totaltime'))
        self._print_count = extra_data.get('print_count')
        self._machine_mac = extra_data.get('machine_mac')
        self._create_time = extra_data.get('create_time')
        self._set_machine_data(data.get('machine_data'))
        self._set_type_function_ids(data['type_function_ids'])
        self._set_material_type(extra_data.get('material_type'))
        self._set_parameter(data.get('parameter'))
        self._update_fw_version_from_json(data['version'])
        self._set_tools(data.get('tools'))
        self._update_multi_color_box_fw_version_from_json(data.get('multi_color_box_version'))
        self._set_external_shelves(data.get('external_shelves'))
        self._set_multi_color_box(data.get('multi_color_box'))

    def _check_latest_project_id_valid(
        self,
        incoming_project_id: int,
    ) -> bool:
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        return (
            self._latest_project is not None
            and (
                project_id < 0
                or project_id == self._latest_project.id
            )
        )

    def _update_latest_project_with_mqtt_print_status_data(
        self,
        incoming_project_id: int,
        print_status: AnycubicPrintStatus,
        mqtt_data: AnycubicConsumableData | None = None,
        paused: int | None = None,
    ) -> bool:
        if self._check_latest_project_id_valid(incoming_project_id):
            assert self._latest_project
            self._latest_project.update_with_mqtt_print_status_data(
                print_status,
                mqtt_data,
                paused=paused,
            )

            return True

        return False

    def _update_latest_project_with_mqtt_download_status_data(
        self,
        incoming_project_id: int,
        mqtt_data: AnycubicConsumableData,
    ) -> bool:
        if self._check_latest_project_id_valid(incoming_project_id):
            assert self._latest_project
            self._latest_project.update_with_mqtt_download_status_data(
                mqtt_data,
            )

            return True

        return False

    def _update_latest_project_with_mqtt_checking_status_data(
        self,
        incoming_project_id: int,
    ) -> bool:
        if self._check_latest_project_id_valid(incoming_project_id):
            assert self._latest_project
            self._latest_project.update_with_mqtt_checking_status_data()

            return True

        return False

    def _update_latest_project_slice_param(
        self,
        incoming_project_id: int,
        new_slice_param: str | dict[str, Any] | None,
    ) -> bool:
        if self._check_latest_project_id_valid(incoming_project_id):
            assert self._latest_project
            self._latest_project.set_slice_param(
                new_slice_param,
            )

            return True

        return False

    def _update_latest_project_target_temps(
        self,
        incoming_project_id: int,
        new_target_hotbed_temp: int,
        new_target_nozzle_temp: int,
    ) -> bool:
        if self._check_latest_project_id_valid(incoming_project_id):
            assert self._latest_project
            self._latest_project.update_target_temps(
                new_target_hotbed_temp,
                new_target_nozzle_temp,
            )

            return True

        return False

    def _process_mqtt_update_lastwill(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'onlineReport' and state == 'online':
            self._device_status = 1
            return
        elif action == 'onlineReport' and state == 'offline':
            self._device_status = 2
            return
        else:
            raise Exception('Unknown lastwill state.')

    def _process_mqtt_update_user(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'bindQuery' and state == 'done':
            self._is_bound_to_user = True
            return
        elif action == 'unbind' and state == 'done':
            self._is_bound_to_user = False
            return
        else:
            raise Exception('Unknown user update.')

    def _process_mqtt_update_status(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'workReport' and state == 'free':
            self._is_printing = 1
            return
        elif action == 'workReport' and state == 'busy':
            self._is_printing = 2
            return
        else:
            raise Exception('Unknown status/workReport.')

    def _process_mqtt_update_ota_multicolorbox(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
        box_id: int,
    ) -> None:
        data = payload.get('data', {})
        if (
            self.multi_color_box_fw_version is None or
            len(self.multi_color_box_fw_version) < (box_id + 1)
        ):
            return

        if action == 'update' and state == 'start':
            self.multi_color_box_fw_version[box_id].set_is_updating(True)
            return
        elif action == 'update' and state in ['update-success', 'updateSuccessProcessed']:
            # Not needed
            return
        elif action == 'reportVersion' and state == 'done':
            data.get('device_unionid')
            data.get('machine_version')
            data.get('peripheral_version')
            data.get('model_id')
            self.multi_color_box_fw_version[box_id].update_version(data['firmware_version'])
            return
        elif action == 'update' and state == 'downloading':
            self.multi_color_box_fw_version[box_id].set_is_updating(True)
            self.multi_color_box_fw_version[box_id].set_is_downloading(True)
            self.multi_color_box_fw_version[box_id].set_download_progress(data['progress'])
            return
        elif action == 'update' and state == 'updating':
            self.multi_color_box_fw_version[box_id].set_is_updating(True)
            self.multi_color_box_fw_version[box_id].set_is_downloading(False)
            self.multi_color_box_fw_version[box_id].set_update_progress(data['current_progress'])
            return
        else:
            raise Exception('Unknown ota multiColorBox data.')

    def _process_mqtt_update_ota_printer(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        data = payload.get('data', {})

        if action == 'reportVersion' and state == 'done':
            data.get('device_unionid')
            data.get('machine_version')
            data.get('peripheral_version')
            data.get('model_id')
            if self.fw_version is not None:
                self.fw_version.update_version(data['firmware_version'])
            return
        elif action == 'update' and state == 'start':
            if self.fw_version is not None:
                self.fw_version.set_is_updating(True)
            return
        elif action == 'update' and state == 'downloading':
            if self.fw_version is not None:
                self.fw_version.set_is_updating(True)
                self.fw_version.set_is_downloading(True)
                self.fw_version.set_download_progress(data['progress'])
            return
        elif action == 'update' and state == 'updating':
            if self.fw_version is not None:
                self.fw_version.set_is_updating(True)
                self.fw_version.set_is_downloading(False)
                self.fw_version.set_update_progress(data['current_progress'])
            return
        else:
            raise Exception('Unknown ota version.')

    def _process_mqtt_update_temperature(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'auto' and state == 'done':
            data = payload['data']

            if self.parameter:
                self.parameter.update_current_temps(
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

    def _process_mqtt_update_fan(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'auto' and state == 'done':
            data = payload['data']

            self._fan_speed = int(data['fan_speed_pct'])

            return
        else:
            raise Exception('Unknown fan data.')

    def _process_mqtt_update_print(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        project_id = payload.get('data', {}).get('taskid', -1)
        if action == 'start' and state == 'printing':
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
            )
            return
        elif action == 'start' and state == 'downloading':
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_download_status_data(
                project_id,
                data,
            )
            return
        elif action == 'start' and state == 'checking':
            self._is_printing = 2
            self._update_latest_project_with_mqtt_checking_status_data(
                project_id,
            )
            return
        elif action == 'start' and state == 'preheating':
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Preheating,
                data,
            )
            return
        elif action == 'start' and state == 'finished':
            data = payload['data']
            self._is_printing = 1
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Complete,
                data,
            )
            return
        elif action == 'pause' and state in ['pausing', 'paused']:
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
                paused=1,
            )
            return
        elif action == 'resume' and state in ['resuming', 'resumed']:
            data = payload['data']
            self._is_printing = 2
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Printing,
                data,
                paused=0 if state == 'resumed' else 1,
            )
            return
        elif action in ['start', 'stop'] and state in ['stoped', 'stopping']:
            data = payload['data']
            self._is_printing = 1
            self._update_latest_project_with_mqtt_print_status_data(
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
            if self.parameter:
                self.parameter.update_current_temps(
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
        elif action in ['start', 'stop'] and state in ['failed']:
            err_msg = payload.get('msg')
            self._is_printing = 1
            self._update_latest_project_with_mqtt_print_status_data(
                project_id,
                AnycubicPrintStatus.Cancelled,
            )
            raise AnycubicAPIError(f"Print Failed: {err_msg}")
        else:
            raise Exception('Unknown print status data.')

    def _process_mqtt_update_multicolorbox(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'getInfo' and state == 'success':
            data = payload['data']['multi_color_box']
            self._set_multi_color_box(data)
            return
        elif action in ['setInfo', 'refresh'] and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue
                assert self._multi_color_box
                self._multi_color_box[box_id].update_slots_with_mqtt_data(box['slots'])
            return

        elif action == 'autoUpdateInfo' and state == 'done':
            data = payload['data']
            box_id = int(data['id'])
            loaded_slot = int(data['loaded_slot'])
            if self.connected_ace_units < box_id + 1:
                return

            assert self._multi_color_box
            self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
            return
        elif action in ['autoUpdateDryStatus', 'setDry'] and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue

                assert self._multi_color_box
                self._multi_color_box[box_id].set_current_temperature(box['temp'])
                self._multi_color_box[box_id].set_drying_status(box['drying_status'])
            return
        elif action == 'feedFilament' and state == 'done':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue

                loaded_slot = int(box['loaded_slot'])

                assert self._multi_color_box
                self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
                self._multi_color_box[box_id].set_feed_status(box['feed_status'])
            return
        elif action == 'setAutoFeed' and state == 'done':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue

                assert self._multi_color_box
                self._multi_color_box[box_id].set_auto_feed(box['auto_feed'])
            return
        else:
            raise Exception('Unknown multiColorBox data.')

    def _process_mqtt_update_shelves(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'reportInfo' and state == 'success':
            data = payload['data']
            if self.external_shelves:
                self.external_shelves.update_with_mqtt_data(data)
            return
        else:
            raise Exception('Unknown shelves data.')

    def _process_mqtt_update_file(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'listLocal' and state == 'done':
            data = payload['data']['records']
            self._set_local_file_list(data)
            return
        elif action == 'deleteLocal' and state == 'success':
            # Not Yet Needed
            return
        elif action == 'listUdisk' and state == 'done':
            data = payload['data']['records']
            self._set_udisk_file_list(data)
            return
        elif action == 'deleteUdisk' and state == 'success':
            # Not Yet Needed
            return
        elif action == 'cloudRecommendList' and state == 'done':
            # Not Yet Needed
            payload.force_empty()
            return
        else:
            raise Exception('Unknown file data.')

    def _process_mqtt_update_peripherals(
        self,
        action: str,
        state: str,
        payload: AnycubicConsumableData,
    ) -> None:
        if action == 'query' and state == 'done':
            data = payload['data']

            if 'camera' in data:
                self.set_has_peripheral_camera(data['camera'])

            if 'multiColorBox' in data:
                self.set_has_peripheral_multi_color_box(data['multiColorBox'])

            if 'udisk' in data:
                self.set_has_peripheral_udisk(data['udisk'])

            return
        else:
            raise Exception('Unknown peripherals data.')

    def process_mqtt_update(
        self,
        topic: str,
        payload: AnycubicConsumableData,
    ) -> None:
        msg_type = payload['type']
        action = payload['action']
        state = payload.get('state')
        multi_color_topic = bool('multiColorBox' in topic)

        if msg_type == 'lastWill':
            self._process_mqtt_update_lastwill(action, state, payload)

        elif msg_type == 'user':
            self._process_mqtt_update_user(action, state, payload)

        elif msg_type == 'status':
            self._process_mqtt_update_status(action, state, payload)

        elif msg_type == 'ota' and multi_color_topic:
            box_id_str = get_part_from_mqtt_topic(topic, 9)
            box_id = int(box_id_str) if box_id_str and box_id_str.isdigit() else 0
            self._process_mqtt_update_ota_multicolorbox(action, state, payload, box_id)

        elif msg_type == 'ota':
            self._process_mqtt_update_ota_printer(action, state, payload)

        elif msg_type == 'tempature':
            self._process_mqtt_update_temperature(action, state, payload)

        elif msg_type == 'fan':
            self._process_mqtt_update_fan(action, state, payload)

        elif msg_type == 'print':
            self._process_mqtt_update_print(action, state, payload)

        elif msg_type == 'multiColorBox':
            self._process_mqtt_update_multicolorbox(action, state, payload)

        elif msg_type == 'extfilbox':
            self._process_mqtt_update_shelves(action, state, payload)

        elif msg_type == 'file':
            self._process_mqtt_update_file(action, state, payload)

        elif msg_type == 'peripherie':
            self._process_mqtt_update_peripherals(action, state, payload)

        else:
            raise Exception("Unknown mqtt update.")

        remaining_data: AnycubicConsumableData | None = payload.get('data')

        if remaining_data:
            remaining_data.get('taskid')
            remaining_data.get('localtask')

        payload.get('data')
        payload.get('msg')
        payload.get('timestamp')
        payload.get('msgid')
        payload.get('code')

        if not payload.is_empty:
            raise AnycubicMQTTUnhandledData(
                "process_mqtt_update",
                unhandled_mqtt_data=payload.remaining_data,
                unhandled_mqtt_type=msg_type,
                unhandled_mqtt_action=action,
                unhandled_mqtt_state=state,
            )

    @property
    def initialisation_error(self) -> bool:
        return self._initialisation_error

    @property
    def machine_type(self) -> int:
        return self._machine_type

    @property
    def model(self) -> str:
        return self._machine_name

    @property
    def machine_name(self) -> str:
        return self._machine_name

    @property
    def machine_img(self) -> str | None:
        return self._machine_img

    @property
    def net_function_ids(self) -> list[int] | None:
        return self._net_function_ids

    @property
    def net_default_function(self) -> int | None:
        return self._net_default_function

    @property
    def id(self) -> int:
        if self._id is None:
            raise TypeError("Printer is missing ID.")
        return self._id

    @property
    def user_id(self) -> int | None:
        return self._user_id

    @property
    def name(self) -> str | None:
        return self._name

    @property
    def nonce(self) -> str | int | None:
        return self._nonce

    @property
    def key(self) -> str | None:
        return self._key

    @property
    def user_img(self) -> str | None:
        return self._user_img

    @property
    def description(self) -> str | None:
        return self._description

    @property
    def printer_type(self) -> str | None:
        return self._printer_type

    @property
    def device_status(self) -> int | None:
        return self._device_status

    @property
    def printer_online(self) -> bool:
        return self._device_status == 1

    @property
    def ready_status(self) -> int | None:
        return self._ready_status

    @property
    def is_printing(self) -> int:
        return self._is_printing

    @property
    def is_available(self) -> bool:
        return self._is_printing == 1

    @property
    def is_busy(self) -> bool:
        return self._is_printing == 2

    @property
    def reason(self) -> str | None:
        return self._reason

    @property
    def current_status(self) -> str:
        if self.is_busy:
            return "busy"
        elif self.is_available:
            return "available"
        else:
            return "unknown"

    @property
    def video_taskid(self) -> int | None:
        return self._video_taskid

    @property
    def msg(self) -> str | None:
        return self._msg

    @property
    def material_used(self) -> str | None:
        return self._material_used

    @property
    def total_print_time(self) -> str | None:
        return self._total_print_time

    @property
    def total_print_time_delta(self) -> timedelta:
        return self._total_print_time_delta

    @property
    def total_print_time_hrs(self) -> int:
        return self._total_print_time_hrs

    @property
    def total_print_time_dhm_str(self) -> str:
        return self._total_print_time_dhm_str

    @property
    def print_count(self) -> int | None:
        return self._print_count

    @property
    def status(self) -> int | None:
        return self._status

    @property
    def machine_mac(self) -> str | None:
        return self._machine_mac

    @property
    def delete(self) -> int | None:
        return self._delete

    @property
    def create_time(self) -> int | None:
        return self._create_time

    @property
    def delete_time(self) -> int | None:
        return self._delete_time

    @property
    def last_update_time(self) -> int | None:
        return self._last_update_time

    @property
    def machine_data(self) -> AnycubicMachineData | None:
        return self._machine_data

    @property
    def type_function_ids(self) -> list[int]:
        return self._type_function_ids

    @property
    def supports_function_axle_movement(self) -> bool:
        return AnycubicFunctionID.AXLE_MOVEMENT in self._type_function_ids

    @property
    def supports_function_file_manager(self) -> bool:
        return AnycubicFunctionID.FILE_MANAGER in self._type_function_ids

    @property
    def supports_function_exposure_test(self) -> bool:
        return AnycubicFunctionID.EXPOSURE_TEST in self._type_function_ids

    @property
    def supports_function_lcd_peer_video(self) -> bool:
        return AnycubicFunctionID.LCD_PEER_VIDEO in self._type_function_ids

    @property
    def supports_function_fdm_axis_move(self) -> bool:
        return AnycubicFunctionID.FDM_AXIS_MOVE in self._type_function_ids

    @property
    def supports_function_fdm_peer_video(self) -> bool:
        return AnycubicFunctionID.FDM_PEER_VIDEO in self._type_function_ids

    @property
    def supports_function_device_startup_self_test(self) -> bool:
        return AnycubicFunctionID.DEVICE_STARTUP_SELF_TEST in self._type_function_ids

    @property
    def supports_function_print_startup_self_test(self) -> bool:
        return AnycubicFunctionID.PRINT_STARTUP_SELF_TEST in self._type_function_ids

    @property
    def supports_function_automatic_operation(self) -> bool:
        return AnycubicFunctionID.AUTOMATIC_OPERATION in self._type_function_ids

    @property
    def supports_function_residue_clean(self) -> bool:
        return AnycubicFunctionID.RESIDUE_CLEAN in self._type_function_ids

    @property
    def supports_function_novice_guide(self) -> bool:
        return AnycubicFunctionID.NOVICE_GUIDE in self._type_function_ids

    @property
    def supports_function_release_film(self) -> bool:
        return AnycubicFunctionID.RELEASE_FILM in self._type_function_ids

    @property
    def supports_function_task_mode(self) -> bool:
        return AnycubicFunctionID.TASK_MODE in self._type_function_ids

    @property
    def supports_function_lcd_intelligent_materials_box(self) -> bool:
        return AnycubicFunctionID.LCD_INTELLIGENT_MATERIALS_BOX in self._type_function_ids

    @property
    def supports_function_lcd_auto_out_in_materials(self) -> bool:
        return AnycubicFunctionID.LCD_AUTO_OUT_IN_MATERIALS in self._type_function_ids

    @property
    def supports_function_m7pro_automatic_operation(self) -> bool:
        return AnycubicFunctionID.M7PRO_AUTOMATIC_OPERATION in self._type_function_ids

    @property
    def supports_function_multi_color_box(self) -> bool:
        return AnycubicFunctionID.MULTI_COLOR_BOX in self._type_function_ids

    @property
    def supports_function_ai_detection(self) -> bool:
        return AnycubicFunctionID.AI_DETECTION in self._type_function_ids

    @property
    def supports_function_auto_leveler(self) -> bool:
        return AnycubicFunctionID.AUTO_LEVELER in self._type_function_ids

    @property
    def supports_function_vibration_compensation(self) -> bool:
        return AnycubicFunctionID.VIBRATION_COMPENSATION in self._type_function_ids

    @property
    def supports_function_time_lapse(self) -> bool:
        return AnycubicFunctionID.TIME_LAPSE in self._type_function_ids

    @property
    def supports_function_video_light(self) -> bool:
        return AnycubicFunctionID.VIDEO_LIGHT in self._type_function_ids

    @property
    def supports_function_box_light(self) -> bool:
        return AnycubicFunctionID.BOX_LIGHT in self._type_function_ids

    @property
    def supported_function_strings(self) -> list[str]:
        func_ids = list()
        for func_int in self._type_function_ids:
            try:
                func_ids.append(AnycubicFunctionID(int(func_int)))
            except ValueError:
                pass

        return list([
            func_id.name for func_id in func_ids
        ])

    @property
    def has_peripheral_camera(self) -> bool:
        return self._has_peripheral_camera

    @property
    def has_peripheral_multi_color_box(self) -> bool:
        return self._has_peripheral_multi_color_box

    @property
    def has_peripheral_udisk(self) -> bool:
        return self._has_peripheral_udisk

    @property
    def connected_peripherals(self) -> dict[str, bool]:
        return {
            "camera": self.has_peripheral_camera,
            "ace": self.has_peripheral_multi_color_box,
            "usb_disk": self.has_peripheral_udisk,
        }

    @property
    def material_type(self) -> AnycubicPrinterMaterialType | str | None:
        return self._material_type

    @property
    def parameter(self) -> AnycubicMachineParameter | None:
        if not self._parameter:
            return None

        return self._parameter

    @property
    def fw_version(self) -> AnycubicMachineFirmwareInfo | None:
        return self._fw_version

    @property
    def available(self) -> int | None:
        return self._available

    @property
    def color(self) -> AnycubicMachineColorInfo | None:
        return self._color

    @property
    def advance(self) -> list[Any] | None:
        return self._advance

    @property
    def tools(self) -> list[AnycubicMachineToolInfo] | None:
        return self._tools

    @property
    def multi_color_box_fw_version(self) -> list[AnycubicMachineFirmwareInfo] | None:
        return self._multi_color_box_fw_version

    @property
    def external_shelves(self) -> AnycubicMachineExternalShelves | None:
        return self._external_shelves

    @property
    def multi_color_box(self) -> list[AnycubicMultiColorBox] | None:
        return self._multi_color_box

    @property
    def connected_ace_units(self) -> int:
        if self._multi_color_box is None:
            return 0

        return len(self._multi_color_box)

    @property
    def primary_multi_color_box(self) -> AnycubicMultiColorBox | None:
        if self.connected_ace_units > 0:
            assert self._multi_color_box
            return self._multi_color_box[0]

        return None

    @property
    def secondary_multi_color_box(self) -> AnycubicMultiColorBox | None:
        if self.connected_ace_units > 1:
            assert self._multi_color_box
            return self._multi_color_box[1]

        return None

    @property
    def primary_drying_status(self) -> AnycubicDryingStatus | None:
        if self.primary_multi_color_box is None:
            return None

        return self.primary_multi_color_box.drying_status

    @property
    def secondary_drying_status(self) -> AnycubicDryingStatus | None:
        if self.secondary_multi_color_box is None:
            return None

        return self.secondary_multi_color_box.drying_status

    @property
    def latest_project(self) -> AnycubicProject | None:
        return self._latest_project

    @property
    def local_file_list_object(self) -> list[dict[str, str | float]] | None:
        if not self._local_file_list or len(self._local_file_list) < 1:
            return None

        file_list = list([
            file.data_object for file in self._local_file_list
        ])
        return file_list

    @property
    def udisk_file_list_object(self) -> list[dict[str, str | float]] | None:
        if not self._udisk_file_list or len(self._udisk_file_list) < 1:
            return None

        file_list = list([
            file.data_object for file in self._udisk_file_list
        ])
        return file_list

    @property
    def primary_multi_color_box_fw_firmware_version(self) -> str | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].firmware_version

        return None

    @property
    def primary_multi_color_box_fw_available_version(self) -> str | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].available_version

        return None

    @property
    def primary_multi_color_box_fw_total_progress(self) -> int | float | bool | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].total_progress

        return None

    @property
    def primary_multi_color_box_auto_feed(self) -> int | None:
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.auto_feed

        return None

    @property
    def primary_multi_color_box_spool_info_object(self) -> list[dict[str, Any]] | None:
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.spool_info_object

        return None

    @property
    def primary_multi_color_box_current_temperature(self) -> int:
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.current_temperature

        return 0

    @property
    def primary_drying_status_is_drying(self) -> bool | None:
        if self.primary_drying_status:
            return self.primary_drying_status.is_drying

        return None

    @property
    def primary_drying_status_raw_status_code(self) -> int | None:
        if self.primary_drying_status:
            return self.primary_drying_status.raw_status_code

        return None

    @property
    def primary_drying_status_target_temperature(self) -> int:
        if self.primary_drying_status:
            return self.primary_drying_status.target_temperature

        return 0

    @property
    def primary_drying_status_total_duration(self) -> int:
        if self.primary_drying_status:
            return self.primary_drying_status.total_duration

        return 0

    @property
    def primary_drying_status_remaining_time(self) -> int:
        if self.primary_drying_status:
            return self.primary_drying_status.remaining_time

        return 0

    @property
    def secondary_multi_color_box_fw_firmware_version(self) -> str | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].firmware_version

        return None

    @property
    def secondary_multi_color_box_fw_available_version(self) -> str | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].available_version

        return None

    @property
    def secondary_multi_color_box_fw_total_progress(self) -> int | float | bool | None:
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].total_progress

        return None

    @property
    def secondary_multi_color_box_auto_feed(self) -> int | None:
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.auto_feed

        return None

    @property
    def secondary_multi_color_box_spool_info_object(self) -> list[dict[str, Any]] | None:
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.spool_info_object

        return None

    @property
    def secondary_multi_color_box_current_temperature(self) -> int:
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.current_temperature

        return 0

    @property
    def secondary_drying_status_is_drying(self) -> bool | None:
        if self.secondary_drying_status:
            return self.secondary_drying_status.is_drying

        return None

    @property
    def secondary_drying_status_raw_status_code(self) -> int | None:
        if self.secondary_drying_status:
            return self.secondary_drying_status.raw_status_code

        return None

    @property
    def secondary_drying_status_target_temperature(self) -> int:
        if self.secondary_drying_status:
            return self.secondary_drying_status.target_temperature

        return 0

    @property
    def secondary_drying_status_total_duration(self) -> int:
        if self.secondary_drying_status:
            return self.secondary_drying_status.total_duration

        return 0

    @property
    def secondary_drying_status_remaining_time(self) -> int:
        if self.secondary_drying_status:
            return self.secondary_drying_status.remaining_time

        return 0

    @property
    def latest_project_name(self) -> str | None:
        if self.latest_project:
            return self.latest_project.name

        return None

    @property
    def latest_project_image_url(self) -> str | None:
        if self.latest_project:
            return self.latest_project.image_url

        return None

    @property
    def latest_project_progress_percentage(self) -> int | None:
        if self.latest_project:
            return self.latest_project.progress_percentage

        return None

    @property
    def latest_project_created_timestamp(self) -> int | None:
        if self.latest_project:
            return self.latest_project.created_timestamp

        return None

    @property
    def latest_project_finished_timestamp(self) -> int | None:
        if self.latest_project:
            return self.latest_project.finished_timestamp

        return None

    @property
    def latest_project_print_time_elapsed_minutes(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_time_elapsed_minutes

        return None

    @property
    def latest_project_print_time_remaining_minutes(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_time_remaining_minutes

        return None

    @property
    def latest_project_print_total_time(self) -> str | None:
        if self.latest_project:
            return self.latest_project.print_total_time

        return None

    @property
    def latest_project_print_total_time_delta(self) -> timedelta | None:
        if self.latest_project:
            return self.latest_project.print_total_time_delta

        return None

    @property
    def latest_project_print_total_time_minutes(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_total_time_minutes

        return None

    @property
    def latest_project_print_total_time_dhm_str(self) -> str | None:
        if self.latest_project:
            return self.latest_project.print_total_time_dhm_str

        return None

    @property
    def latest_project_print_in_progress(self) -> bool | None:
        if self.latest_project:
            return self.latest_project.print_in_progress

        return None

    @property
    def latest_project_print_complete(self) -> bool | None:
        if self.latest_project:
            return self.latest_project.print_complete

        return None

    @property
    def latest_project_print_failed(self) -> bool | None:
        if self.latest_project:
            return self.latest_project.print_failed

        return None

    @property
    def latest_project_print_is_paused(self) -> bool | None:
        if self.latest_project:
            return self.latest_project.print_is_paused

        return None

    @property
    def latest_project_print_status(self) -> str | None:
        if self.latest_project:
            return self.latest_project.print_status

        return None

    @property
    def latest_project_print_approximate_completion_time(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_approximate_completion_time

        return None

    @property
    def latest_project_print_current_layer(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_current_layer

        return None

    @property
    def latest_project_print_supplies_usage(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_supplies_usage

        return None

    @property
    def latest_project_print_total_layers(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_total_layers

        return None

    @property
    def latest_project_target_nozzle_temp(self) -> int | None:
        if self.latest_project:
            return self.latest_project.target_nozzle_temp

        return None

    @property
    def latest_project_temp_min_nozzle(self) -> int | None:
        if self.latest_project:
            return self.latest_project.temp_min_nozzle

        return None

    @property
    def latest_project_temp_max_nozzle(self) -> int | None:
        if self.latest_project:
            return self.latest_project.temp_max_nozzle

        return None

    @property
    def latest_project_target_hotbed_temp(self) -> int | None:
        if self.latest_project:
            return self.latest_project.target_hotbed_temp

        return None

    @property
    def latest_project_temp_min_hotbed(self) -> int | None:
        if self.latest_project:
            return self.latest_project.temp_min_hotbed

        return None

    @property
    def latest_project_temp_max_hotbed(self) -> int | None:
        if self.latest_project:
            return self.latest_project.temp_max_hotbed

        return None

    @property
    def latest_project_print_speed_mode(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_speed_mode

        return None

    @property
    def latest_project_print_speed_mode_string(self) -> str | None:
        if self.latest_project:
            return self.latest_project.print_speed_mode_string

        return None

    @property
    def latest_project_print_speed_pct(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_speed_pct

        return None

    @property
    def latest_project_z_thick(self) -> float | None:
        if self.latest_project:
            return self.latest_project.z_thick

        return None

    @property
    def latest_project_fan_speed_pct(self) -> int | None:
        if self.latest_project:
            return self.latest_project.fan_speed_pct

        return None

    @property
    def latest_project_raw_print_status(self) -> int | None:
        if self.latest_project:
            return self.latest_project.raw_print_status

        return None

    @property
    def latest_project_available_print_speed_modes_data_object(self) -> list[dict[str, str | int]] | None:
        if self.latest_project:
            return self.latest_project.available_print_speed_modes_data_object

        return None

    @property
    def latest_project_print_model_height(self) -> float | None:
        if self.latest_project:
            return self.latest_project.print_model_height

        return None

    @property
    def latest_project_print_anti_alias_count(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_anti_alias_count

        return None

    @property
    def latest_project_print_on_time(self) -> float | None:
        if self.latest_project:
            return self.latest_project.print_on_time

        return None

    @property
    def latest_project_print_off_time(self) -> float | None:
        if self.latest_project:
            return self.latest_project.print_off_time

        return None

    @property
    def latest_project_print_bottom_time(self) -> float | None:
        if self.latest_project:
            return self.latest_project.print_bottom_time

        return None

    @property
    def latest_project_print_bottom_layers(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_bottom_layers

        return None

    @property
    def latest_project_print_z_up_height(self) -> float | None:
        if self.latest_project:
            return self.latest_project.print_z_up_height

        return None

    @property
    def latest_project_print_z_up_speed(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_z_up_speed

        return None

    @property
    def latest_project_print_z_down_speed(self) -> int | None:
        if self.latest_project:
            return self.latest_project.print_z_down_speed

        return None

    @property
    def curr_nozzle_temp(self) -> int | None:
        if self.parameter:
            return self.parameter.curr_nozzle_temp

        return None

    @property
    def curr_hotbed_temp(self) -> int | None:
        if self.parameter:
            return self.parameter.curr_hotbed_temp

        return None

    def build_mapping_for_material_list(
        self,
        slot_index_list: list[int],
        material_list: list[dict[str, Any]],
    ) -> list[AnycubicMaterialMapping]:
        if not self._multi_color_box:
            return list()

        highest_box = max(slot_index_list) // 4

        if self.connected_ace_units < highest_box + 1:
            raise TypeError(
                f"Not enough ACE units connected for slot indexes (expected {highest_box + 1})."
            )

        ams_box_mapping = list()

        for mcb in self._multi_color_box:

            ams_box_mapping.extend(
                mcb.build_mapping_for_material_list(
                    slot_index_list=slot_index_list,
                    material_list=material_list,
                )
            )

        return sorted(ams_box_mapping, key=lambda x: x.paint_index)

    async def update_info_from_api(
        self,
        with_project: bool = True,
    ) -> None:
        if self._id is None:
            raise AnycubicAPIError('Error in printer update_info_from_api, missing id')

        await self._api_parent.printer_info_for_id(self._id, self)

        if with_project:
            self._latest_project = await self._api_parent.get_latest_project(
                printer_id=self.id,
                project_to_update=self._latest_project
            )

    async def request_local_file_list(
        self,
    ) -> str | None:

        return await self._api_parent._send_order_list_local_files(
            self,
        )

    async def request_udisk_file_list(
        self,
    ) -> str | None:

        return await self._api_parent._send_order_list_udisk_files(
            self,
        )

    async def delete_local_file(
        self,
        file_name: str,
    ) -> str | None:

        return await self._api_parent._send_order_delete_local_file(
            self,
            file_name=file_name,
        )

    async def delete_udisk_file(
        self,
        file_name: str,
    ) -> str | None:

        return await self._api_parent._send_order_delete_udisk_file(
            self,
            file_name=file_name,
        )

    async def multi_color_box_drying_start(
        self,
        duration: int,
        target_temp: int,
        box_id: int = 0,
    ) -> str | None:
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
        box_id: int = -1,
    ) -> str | None:
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_drying_stop(
            self,
            box_id=box_id,
        )

    async def multi_color_box_set_auto_feed(
        self,
        enabled: bool,
        box_id: int = -1,
    ) -> str | None:
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_set_auto_feed(
            self,
            enabled=enabled,
            box_id=box_id,
        )

    async def multi_color_box_toggle_auto_feed(
        self,
        box_id: int = -1,
    ) -> str | None:
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_toggle_auto_feed(
            self,
            box_id=box_id,
        )

    async def multi_color_box_switch_on_auto_feed(
        self,
        box_id: int = -1,
    ) -> str | None:
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_switch_on_auto_feed(
            self,
            box_id=box_id,
        )

    async def multi_color_box_switch_off_auto_feed(
        self,
        box_id: int = -1,
    ) -> str | None:
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_switch_off_auto_feed(
            self,
            box_id=box_id,
        )

    async def multi_color_box_set_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor | None = None,
        slot_material_type: str = "PLA",
        slot_color_red: int | None = None,
        slot_color_green: int | None = None,
        slot_color_blue: int | None = None,
        box_id: int = 0,
    ) -> str | None:
        return await self._api_parent.multi_color_box_set_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type=slot_material_type,
            slot_color_red=slot_color_red,
            slot_color_green=slot_color_green,
            slot_color_blue=slot_color_blue,
            box_id=box_id,
        )

    async def multi_color_box_set_pla_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_pla_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_petg_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_petg_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_abs_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_abs_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_pacf_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_pacf_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_pc_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_pc_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_asa_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_asa_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_hips_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_hips_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_pa_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_pa_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def multi_color_box_set_pla_se_slot(
        self,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._api_parent.multi_color_box_set_pla_se_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def pause_print(
        self,
        project: AnycubicProject | None = None,
    ) -> str | None:

        return await self._api_parent.pause_print(
            self,
            project=project,
        )

    async def resume_print(
        self,
        project: AnycubicProject | None = None,
    ) -> str | None:

        return await self._api_parent.resume_print(
            self,
            project=project,
        )

    async def cancel_print(
        self,
        project: AnycubicProject | None = None,
    ) -> str | None:

        return await self._api_parent.cancel_print(
            self,
            project=project,
        )

    async def multi_color_box_feed_filament(
        self,
        slot_index: int,
        box_id: int = -1,
        finish: bool = False,
    ) -> str | None:

        return await self._api_parent.multi_color_box_feed_filament(
            self,
            slot_index=slot_index,
            box_id=box_id,
            finish=finish,
        )

    async def multi_color_box_retract_filament(
        self,
        box_id: int = -1,
    ) -> str | None:

        return await self._api_parent.multi_color_box_retract_filament(
            self,
            box_id=box_id,
        )

    async def update_printer_firmware(
        self,
    ) -> str | None:

        return await self._api_parent.update_printer_firmware(
            self,
        )

    async def update_printer_multi_color_box_firmware(
        self,
        box_id: int = -1,
    ) -> str | None:

        return await self._api_parent.update_printer_multi_color_box_firmware(
            self,
            box_id=box_id,
        )

    async def update_printer_all_multi_color_box_firmware(
        self,
    ) -> list[str | None] | None:

        return await self._api_parent.update_printer_all_multi_color_box_firmware(
            self,
        )

    async def print_with_cloud_file_id(
        self,
        cloud_file_id: int,
        ams_box_mapping: list[AnycubicMaterialMapping] | None = None,
        temp_file: bool = False,
    ) -> str | None:
        return await self._api_parent.print_with_cloud_file_id(
            printer=self,
            cloud_file_id=cloud_file_id,
            ams_box_mapping=ams_box_mapping,
            temp_file=temp_file,
        )

    async def print_with_cloud_gcode_id(
        self,
        gcode_id: int,
        slot_index_list: list[int] | None = None,
    ) -> AnycubicPrintResponse:
        return await self._api_parent.print_with_cloud_gcode_id(
            printer=self,
            gcode_id=gcode_id,
            slot_index_list=slot_index_list,
        )

    async def print_and_upload_save_in_cloud(
        self,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        slot_index_list: list[int] | None = None,
    ) -> AnycubicPrintResponse:
        return await self._api_parent.print_and_upload_save_in_cloud(
            printer=self,
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            slot_index_list=slot_index_list,
        )

    async def print_and_upload_no_cloud_save(
        self,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        slot_index_list: list[int] | None = None,
    ) -> AnycubicPrintResponse:
        return await self._api_parent.print_and_upload_no_cloud_save(
            printer=self,
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            slot_index_list=slot_index_list,
        )

    async def change_print_setting_speed_mode(
        self,
        new_speed: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                print_speed_mode=new_speed,
            ),
        )

    async def change_print_setting_target_nozzle_temp(
        self,
        new_temperature: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                target_nozzle_temp=new_temperature,
            ),
        )

    async def change_print_setting_target_hotbed_temp(
        self,
        new_temperature: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                target_hotbed_temp=new_temperature,
            ),
        )

    async def change_print_setting_fan_speed_pct(
        self,
        new_pct: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                fan_speed_pct=new_pct,
            ),
        )

    async def change_print_setting_aux_fan_speed_pct(
        self,
        new_pct: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                aux_fan_speed_pct=new_pct,
            ),
        )

    async def change_print_setting_box_fan_level(
        self,
        new_level: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                box_fan_level=new_level,
            ),
        )

    async def change_print_setting_bottom_layers(
        self,
        new_layers: int
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                bottom_layers=new_layers,
            ),
        )

    async def change_print_setting_bottom_time(
        self,
        new_time: float
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                bottom_time=new_time,
            ),
        )

    async def change_print_setting_off_time(
        self,
        new_time: float
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                off_time=new_time,
            ),
        )

    async def change_print_setting_on_time(
        self,
        new_time: float
    ) -> str | None:
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                on_time=new_time,
            ),
        )

    async def query_printer_options(
        self,
        project: AnycubicProject | None = None,
    ) -> None:
        return await self._api_parent.query_printer_options(
            printer=self,
            project=project,
        )

    def __repr__(self) -> str:
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
                f"secondary_drying_status=\n{self.secondary_drying_status},\n "
                f")")
