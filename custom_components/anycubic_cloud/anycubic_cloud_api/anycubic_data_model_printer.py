from .anycubic_data_model_files import (
    AnycubicFile,
)

from .anycubic_data_model_printer_properties import (
    AnycubicMaterialColor,
    AnycubicMachineToolInfo,
    AnycubicMachineExternalShelves,
    AnycubicMultiColorBox,
    AnycubicMachineData,
    AnycubicMachineParameter,
    AnycubicMachineFirmwareInfo,
    AnycubicMachineColorInfo,
)

from .anycubic_data_model_printing_settings import (
    AnycubicPrintingSettings,
)

from .anycubic_data_model_project import (
    AnycubicProject,
)

from .anycubic_enums import (
    AnycubicFunctionID,
    AnycubicPrintStatus,
)

from .anycubic_helpers import (
    get_part_from_mqtt_topic,
)


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
        ignore_init_errors=False,
        # base_info=None,
    ):
        self._ignore_init_errors = ignore_init_errors
        self._initialisation_error = False

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
        self._set_machine_data(machine_data)
        self._set_type_function_ids(type_function_ids)
        self._material_type = material_type
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
        self._fan_speed = 0
        self._print_speed_pct = 0
        self._print_speed_mode = 0
        self._local_file_list = None
        self._udisk_file_list = None
        self._has_peripheral_camera = False
        self._has_peripheral_multi_color_box = False
        self._has_peripheral_udisk = False
        self._is_bound_to_user = True

        self._ignore_init_errors = False

    def set_has_peripheral_camera(self, has_peripheral):
        self._has_peripheral_camera = bool(has_peripheral)

    def set_has_peripheral_multi_color_box(self, has_peripheral):
        self._has_peripheral_multi_color_box = bool(has_peripheral)

    def set_has_peripheral_udisk(self, has_peripheral):
        self._has_peripheral_udisk = bool(has_peripheral)

    def _set_type_function_ids(self, type_function_ids):
        if isinstance(type_function_ids, list):
            self._type_function_ids = type_function_ids
        else:
            self._type_function_ids = list()

    def _set_local_file_list(self, file_list):
        if file_list is None:
            return

        self._local_file_list = list([
            AnycubicFile.from_json(x) for x in file_list
        ])

    def _set_udisk_file_list(self, file_list):
        if file_list is None:
            return

        self._udisk_file_list = list([
            AnycubicFile.from_json(x) for x in file_list
        ])

    def _set_multi_color_box(self, multi_color_box):
        try:
            if multi_color_box is None or isinstance(multi_color_box, list):
                multi_color_box_list = multi_color_box
            else:
                multi_color_box_list = list([multi_color_box])
            self._multi_color_box = (
                list([AnycubicMultiColorBox.from_json(x) for x in multi_color_box_list])
                if multi_color_box_list is not None else None
            )
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_machine_data(
        self,
        machine_data,
    ):
        try:
            self._machine_data = AnycubicMachineData.from_json(machine_data)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_parameter(
        self,
        parameter,
    ):
        try:
            self._parameter = AnycubicMachineParameter.from_json(parameter)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_fw_version(
        self,
        fw_version,
    ):
        try:
            self._fw_version = AnycubicMachineFirmwareInfo.from_json(fw_version)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_color(
        self,
        color,
    ):
        try:
            self._color = AnycubicMachineColorInfo.from_json(color)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_tools(
        self,
        tools,
    ):
        try:
            self._tools = (
                list([AnycubicMachineToolInfo.from_json(x) for x in tools])
                if tools is not None else None
            )
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_multi_color_box_fw_version(
        self,
        multi_color_box_fw_version,
    ):
        try:
            self._multi_color_box_fw_version = (
                list([AnycubicMachineFirmwareInfo.from_json(x) for x in multi_color_box_fw_version])
                if multi_color_box_fw_version is not None else None
            )
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _set_external_shelves(
        self,
        external_shelves,
    ):
        try:
            self._external_shelves = AnycubicMachineExternalShelves.from_json(external_shelves)
        except Exception as e:
            self._initialisation_error = True
            if not self._ignore_init_errors:
                raise e

    def _update_fw_version_from_json(
        self,
        fw_version,
    ):
        if fw_version is None:
            return

        if self._fw_version:
            self._fw_version.update_from_json(fw_version)
        else:
            self._set_fw_version(fw_version)

    def _update_multi_color_box_fw_version_from_json(
        self,
        multi_color_box_fw_version,
    ):
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
    def from_status_json(
        cls,
        api_parent,
        data,
        ignore_init_errors=False,
    ):
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
        api_parent,
        data,
        ignore_init_errors=False,
    ):
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

    def update_from_info_json(self, data):
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
        self._print_totaltime = extra_data.get('print_totaltime')
        self._print_count = extra_data.get('print_count')
        self._machine_mac = extra_data.get('machine_mac')
        self._create_time = extra_data.get('create_time')
        self._set_machine_data(data.get('machine_data'))
        self._set_type_function_ids(data['type_function_ids'])
        self._material_type = extra_data.get('material_type')
        self._set_parameter(data.get('parameter'))
        self._update_fw_version_from_json(data['version'])
        self._set_tools(data.get('tools'))
        self._update_multi_color_box_fw_version_from_json(data.get('multi_color_box_version'))
        self._set_external_shelves(data.get('external_shelves'))
        self._set_multi_color_box(data.get('multi_color_box'))

    def _update_latest_project_with_mqtt_print_status_data(
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
            self._latest_project.update_with_mqtt_print_status_data(
                print_status,
                mqtt_data,
                paused=paused,
            )

            return True

        return False

    def _update_latest_project_with_mqtt_download_status_data(
        self,
        incoming_project_id,
        mqtt_data,
    ):
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        if self._latest_project and (project_id < 0 or project_id == self._latest_project.id):
            self._latest_project.update_with_mqtt_download_status_data(
                mqtt_data,
            )

            return True

        return False

    def _update_latest_project_with_mqtt_checking_status_data(
        self,
        incoming_project_id,
    ):
        try:
            project_id = int(incoming_project_id)
        except Exception:
            project_id = -1

        if self._latest_project and (project_id < 0 or project_id == self._latest_project.id):
            self._latest_project.update_with_mqtt_checking_status_data()

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
            self._is_bound_to_user = True
            return
        elif action == 'unbind' and state == 'done':
            self._is_bound_to_user = False
            return
        else:
            raise Exception('Unknown user update.')

    def _process_mqtt_update_status(self, action, state, payload):
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
        action,
        state,
        payload,
        box_id,
    ):
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
            data = payload['data']
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

    def _process_mqtt_update_ota_printer(self, action, state, payload):
        if action == 'reportVersion' and state == 'done':
            data = payload['data']
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
        elif action in ['setInfo', 'refresh'] and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue

                self._multi_color_box[box_id].update_slots_with_mqtt_data(box['slots'])
            return

        elif action == 'autoUpdateInfo' and state == 'done':
            data = payload['data']
            box_id = int(data['id'])
            loaded_slot = int(data['loaded_slot'])
            if self.connected_ace_units < box_id + 1:
                return

            self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
            return
        elif action in ['autoUpdateDryStatus', 'setDry'] and state == 'success':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
                    continue

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

                self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
                self._multi_color_box[box_id].set_feed_status(box['feed_status'])
            return
        elif action == 'setAutoFeed' and state == 'done':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self.connected_ace_units < box_id + 1:
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
            return
        else:
            raise Exception('Unknown file data.')

    def _process_mqtt_update_peripherals(
        self,
        action,
        state,
        payload,
    ):
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
            raise Exception('Unknown file data.')

    def process_mqtt_update(self, topic, payload):
        msg_type = payload['type']
        action = payload['action']
        state = payload.get('state')
        multi_color_topic = bool('multiColorBox' in topic)

        if msg_type == 'lastWill':
            return self._process_mqtt_update_lastwill(action, state, payload)

        elif msg_type == 'user':
            return self._process_mqtt_update_user(action, state, payload)

        elif msg_type == 'status':
            return self._process_mqtt_update_status(action, state, payload)

        elif msg_type == 'ota' and multi_color_topic:
            box_id_str = get_part_from_mqtt_topic(topic, 9)
            box_id = int(box_id_str) if box_id_str.isdigit() else 0
            return self._process_mqtt_update_ota_multicolorbox(action, state, payload, box_id)

        elif msg_type == 'ota':
            return self._process_mqtt_update_ota_printer(action, state, payload)

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

        elif msg_type == 'peripherie':
            return self._process_mqtt_update_peripherals(action, state, payload)

        else:
            raise Exception("Unknown mqtt update.")

    @property
    def initialisation_error(self):
        return self._initialisation_error

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
    def is_available(self):
        return self._is_printing == 1

    @property
    def is_busy(self):
        return self._is_printing == 2

    @property
    def reason(self):
        return self._reason

    @property
    def current_status(self):
        if self.is_busy:
            return "busy"
        elif self.is_available:
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
    def supports_function_axle_movement(self):
        return AnycubicFunctionID.AXLE_MOVEMENT in self._type_function_ids

    @property
    def supports_function_file_manager(self):
        return AnycubicFunctionID.FILE_MANAGER in self._type_function_ids

    @property
    def supports_function_exposure_test(self):
        return AnycubicFunctionID.EXPOSURE_TEST in self._type_function_ids

    @property
    def supports_function_lcd_peer_video(self):
        return AnycubicFunctionID.LCD_PEER_VIDEO in self._type_function_ids

    @property
    def supports_function_fdm_axis_move(self):
        return AnycubicFunctionID.FDM_AXIS_MOVE in self._type_function_ids

    @property
    def supports_function_fdm_peer_video(self):
        return AnycubicFunctionID.FDM_PEER_VIDEO in self._type_function_ids

    @property
    def supports_function_device_startup_self_test(self):
        return AnycubicFunctionID.DEVICE_STARTUP_SELF_TEST in self._type_function_ids

    @property
    def supports_function_print_startup_self_test(self):
        return AnycubicFunctionID.PRINT_STARTUP_SELF_TEST in self._type_function_ids

    @property
    def supports_function_automatic_operation(self):
        return AnycubicFunctionID.AUTOMATIC_OPERATION in self._type_function_ids

    @property
    def supports_function_residue_clean(self):
        return AnycubicFunctionID.RESIDUE_CLEAN in self._type_function_ids

    @property
    def supports_function_novice_guide(self):
        return AnycubicFunctionID.NOVICE_GUIDE in self._type_function_ids

    @property
    def supports_function_release_film(self):
        return AnycubicFunctionID.RELEASE_FILM in self._type_function_ids

    @property
    def supports_function_task_mode(self):
        return AnycubicFunctionID.TASK_MODE in self._type_function_ids

    @property
    def supports_function_lcd_intelligent_materials_box(self):
        return AnycubicFunctionID.LCD_INTELLIGENT_MATERIALS_BOX in self._type_function_ids

    @property
    def supports_function_lcd_auto_out_in_materials(self):
        return AnycubicFunctionID.LCD_AUTO_OUT_IN_MATERIALS in self._type_function_ids

    @property
    def supports_function_m7pro_automatic_operation(self):
        return AnycubicFunctionID.M7PRO_AUTOMATIC_OPERATION in self._type_function_ids

    @property
    def supports_function_multi_color_box(self):
        return AnycubicFunctionID.MULTI_COLOR_BOX in self._type_function_ids

    @property
    def supports_function_ai_detection(self):
        return AnycubicFunctionID.AI_DETECTION in self._type_function_ids

    @property
    def supports_function_auto_leveler(self):
        return AnycubicFunctionID.AUTO_LEVELER in self._type_function_ids

    @property
    def supports_function_vibration_compensation(self):
        return AnycubicFunctionID.VIBRATION_COMPENSATION in self._type_function_ids

    @property
    def supports_function_time_lapse(self):
        return AnycubicFunctionID.TIME_LAPSE in self._type_function_ids

    @property
    def supports_function_video_light(self):
        return AnycubicFunctionID.VIDEO_LIGHT in self._type_function_ids

    @property
    def supports_function_box_light(self):
        return AnycubicFunctionID.BOX_LIGHT in self._type_function_ids

    @property
    def supported_function_strings(self):
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
    def connected_ace_units(self):
        if self._multi_color_box is None:
            return 0

        return len(self._multi_color_box)

    @property
    def primary_multi_color_box(self):
        return (
            self._multi_color_box[0]
            if self.connected_ace_units > 0
            else None
        )

    @property
    def secondary_multi_color_box(self):
        return (
            self._multi_color_box[1]
            if self.connected_ace_units > 1
            else None
        )

    @property
    def primary_drying_status(self):
        if self.primary_multi_color_box is None:
            return None

        return self.primary_multi_color_box.drying_status

    @property
    def secondary_drying_status(self):
        if self.secondary_multi_color_box is None:
            return None

        return self.secondary_multi_color_box.drying_status

    @property
    def latest_project(self):
        return self._latest_project

    @property
    def local_file_list_object(self):
        if not self._local_file_list or len(self._local_file_list) < 1:
            return None

        file_list = list([
            file.data_object for file in self._local_file_list
        ])
        return file_list

    @property
    def udisk_file_list_object(self):
        if not self._udisk_file_list or len(self._udisk_file_list) < 1:
            return None

        file_list = list([
            file.data_object for file in self._udisk_file_list
        ])
        return file_list

    @property
    def primary_multi_color_box_fw_firmware_version(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].firmware_version

        return None

    @property
    def primary_multi_color_box_fw_available_version(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].available_version

        return None

    @property
    def primary_multi_color_box_fw_total_progress(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 0
        ):
            return self.multi_color_box_fw_version[0].total_progress

        return None

    @property
    def primary_multi_color_box_auto_feed(self):
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.auto_feed

        return None

    @property
    def primary_multi_color_box_spool_info_object(self):
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.spool_info_object

        return None

    @property
    def primary_multi_color_box_current_temperature(self):
        if self.primary_multi_color_box:
            return self.primary_multi_color_box.current_temperature

        return 0

    @property
    def primary_drying_status_is_drying(self):
        if self.primary_drying_status:
            return self.primary_drying_status.is_drying

        return None

    @property
    def primary_drying_status_raw_status_code(self):
        if self.primary_drying_status:
            return self.primary_drying_status.raw_status_code

        return None

    @property
    def primary_drying_status_target_temperature(self):
        if self.primary_drying_status:
            return self.primary_drying_status.target_temperature

        return 0

    @property
    def primary_drying_status_total_duration(self):
        if self.primary_drying_status:
            return self.primary_drying_status.total_duration

        return None

    @property
    def primary_drying_status_remaining_time(self):
        if self.primary_drying_status:
            return self.primary_drying_status.remaining_time

        return None

    @property
    def secondary_multi_color_box_fw_firmware_version(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].firmware_version

        return None

    @property
    def secondary_multi_color_box_fw_available_version(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].available_version

        return None

    @property
    def secondary_multi_color_box_fw_total_progress(self):
        if (
            self.multi_color_box_fw_version and
            len(self.multi_color_box_fw_version) > 1
        ):
            return self.multi_color_box_fw_version[1].total_progress

        return None

    @property
    def secondary_multi_color_box_auto_feed(self):
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.auto_feed

        return None

    @property
    def secondary_multi_color_box_spool_info_object(self):
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.spool_info_object

        return None

    @property
    def secondary_multi_color_box_current_temperature(self):
        if self.secondary_multi_color_box:
            return self.secondary_multi_color_box.current_temperature

        return 0

    @property
    def secondary_drying_status_is_drying(self):
        if self.secondary_drying_status:
            return self.secondary_drying_status.is_drying

        return None

    @property
    def secondary_drying_status_raw_status_code(self):
        if self.secondary_drying_status:
            return self.secondary_drying_status.raw_status_code

        return None

    @property
    def secondary_drying_status_target_temperature(self):
        if self.secondary_drying_status:
            return self.secondary_drying_status.target_temperature

        return 0

    @property
    def secondary_drying_status_total_duration(self):
        if self.secondary_drying_status:
            return self.secondary_drying_status.total_duration

        return None

    @property
    def secondary_drying_status_remaining_time(self):
        if self.secondary_drying_status:
            return self.secondary_drying_status.remaining_time

        return None

    @property
    def latest_project_name(self):
        if self.latest_project:
            return self.latest_project.name

        return None

    @property
    def latest_project_progress_percentage(self):
        if self.latest_project:
            return self.latest_project.progress_percentage

        return None

    @property
    def latest_project_created_timestamp(self):
        if self.latest_project:
            return self.latest_project.created_timestamp

        return None

    @property
    def latest_project_finished_timestamp(self):
        if self.latest_project:
            return self.latest_project.finished_timestamp

        return None

    @property
    def latest_project_print_time_elapsed_minutes(self):
        if self.latest_project:
            return self.latest_project.print_time_elapsed_minutes

        return None

    @property
    def latest_project_print_time_remaining_minutes(self):
        if self.latest_project:
            return self.latest_project.print_time_remaining_minutes

        return None

    @property
    def latest_project_print_total_time(self):
        if self.latest_project:
            return self.latest_project.print_total_time

        return None

    @property
    def latest_project_print_in_progress(self):
        if self.latest_project:
            return self.latest_project.print_in_progress

        return None

    @property
    def latest_project_print_complete(self):
        if self.latest_project:
            return self.latest_project.print_complete

        return None

    @property
    def latest_project_print_failed(self):
        if self.latest_project:
            return self.latest_project.print_failed

        return None

    @property
    def latest_project_print_is_paused(self):
        if self.latest_project:
            return self.latest_project.print_is_paused

        return None

    @property
    def latest_project_print_status(self):
        if self.latest_project:
            return self.latest_project.print_status

        return None

    @property
    def latest_project_print_approximate_completion_time(self):
        if self.latest_project:
            return self.latest_project.print_approximate_completion_time

        return None

    @property
    def latest_project_print_current_layer(self):
        if self.latest_project:
            return self.latest_project.print_current_layer

        return None

    @property
    def latest_project_print_total_layers(self):
        if self.latest_project:
            return self.latest_project.print_total_layers

        return None

    @property
    def latest_project_target_nozzle_temp(self):
        if self.latest_project:
            return self.latest_project.target_nozzle_temp

        return None

    @property
    def latest_project_temp_min_nozzle(self):
        if self.latest_project:
            return self.latest_project.temp_min_nozzle

        return None

    @property
    def latest_project_temp_max_nozzle(self):
        if self.latest_project:
            return self.latest_project.temp_max_nozzle

        return None

    @property
    def latest_project_target_hotbed_temp(self):
        if self.latest_project:
            return self.latest_project.target_hotbed_temp

        return None

    @property
    def latest_project_temp_min_hotbed(self):
        if self.latest_project:
            return self.latest_project.temp_min_hotbed

        return None

    @property
    def latest_project_temp_max_hotbed(self):
        if self.latest_project:
            return self.latest_project.temp_max_hotbed

        return None

    @property
    def latest_project_print_speed_mode(self):
        if self.latest_project:
            return self.latest_project.print_speed_mode

        return None

    @property
    def latest_project_print_speed_pct(self):
        if self.latest_project:
            return self.latest_project.print_speed_pct

        return None

    @property
    def latest_project_z_thick(self):
        if self.latest_project:
            return self.latest_project.z_thick

        return None

    @property
    def latest_project_fan_speed_pct(self):
        if self.latest_project:
            return self.latest_project.fan_speed_pct

        return None

    @property
    def latest_project_raw_print_status(self):
        if self.latest_project:
            return self.latest_project.raw_print_status

        return None

    @property
    def latest_project_available_print_speed_modes_data_object(self):
        if self.latest_project:
            return self.latest_project.available_print_speed_modes_data_object

        return None

    @property
    def curr_nozzle_temp(self):
        if self.parameter:
            return self.parameter.curr_nozzle_temp

        return None

    @property
    def curr_hotbed_temp(self):
        if self.parameter:
            return self.parameter.curr_hotbed_temp

        return None

    def build_mapping_for_material_list(
        self,
        slot_index_list,
        material_list,
    ):
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

    async def update_info_from_api(self, with_project=True):
        await self._api_parent.printer_info_for_id(self._id, self)

        if with_project:
            self._latest_project = await self._api_parent.get_latest_project()

    async def request_local_file_list(
        self,
    ):

        return await self._api_parent._send_order_list_local_files(
            self,
        )

    async def request_udisk_file_list(
        self,
    ):

        return await self._api_parent._send_order_list_udisk_files(
            self,
        )

    async def delete_local_file(
        self,
        file_name: str,
    ):

        return await self._api_parent._send_order_delete_local_file(
            self,
            file_name=file_name,
        )

    async def delete_udisk_file(
        self,
        file_name: str,
    ):

        return await self._api_parent._send_order_delete_udisk_file(
            self,
            file_name=file_name,
        )

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

    async def multi_color_box_switch_on_auto_feed(
        self,
        box_id=-1,
    ):
        if self.primary_multi_color_box is None:
            return None

        return await self._api_parent.multi_color_box_switch_on_auto_feed(
            self,
            box_id=box_id,
        )

    async def multi_color_box_switch_off_auto_feed(
        self,
        box_id=-1,
    ):
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
        box_id=0,
    ):
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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

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
        box_id=0,
    ):

        return await self._api_parent.multi_color_box_set_pla_se_slot(
            printer=self,
            slot_index=slot_index,
            slot_color=slot_color,
            box_id=box_id,
        )

    async def pause_print(
        self,
        project=None,
    ):

        return await self._api_parent.pause_print(
            self,
            project=project,
        )

    async def resume_print(
        self,
        project=None,
    ):

        return await self._api_parent.resume_print(
            self,
            project=project,
        )

    async def cancel_print(
        self,
        project=None,
    ):

        return await self._api_parent.cancel_print(
            self,
            project=project,
        )

    async def multi_color_box_feed_filament(
        self,
        slot_index: int,
        box_id=-1,
        finish=False,
    ):

        return await self._api_parent.multi_color_box_feed_filament(
            self,
            slot_index=slot_index,
            box_id=box_id,
            finish=finish,
        )

    async def multi_color_box_retract_filament(
        self,
        box_id=-1,
    ):

        return await self._api_parent.multi_color_box_retract_filament(
            self,
            box_id=box_id,
        )

    async def update_printer_firmware(
        self,
    ):

        return await self._api_parent.update_printer_firmware(
            self,
        )

    async def update_printer_multi_color_box_firmware(
        self,
        box_id=-1,
    ):

        return await self._api_parent.update_printer_multi_color_box_firmware(
            self,
            box_id=box_id,
        )

    async def update_printer_all_multi_color_box_firmware(
        self,
    ):

        return await self._api_parent.update_printer_all_multi_color_box_firmware(
            self,
        )

    async def print_with_cloud_file_id(
        self,
        cloud_file_id,
        ams_box_mapping=None,
        temp_file=False,
    ):
        return await self._api_parent.print_with_cloud_file_id(
            printer=self,
            cloud_file_id=cloud_file_id,
            ams_box_mapping=ams_box_mapping,
            temp_file=temp_file,
        )

    async def print_with_cloud_gcode_id(
        self,
        gcode_id,
        slot_index_list=None,
    ):
        return await self._api_parent.print_with_cloud_gcode_id(
            printer=self,
            gcode_id=gcode_id,
            slot_index_list=slot_index_list,
        )

    async def print_and_upload_save_in_cloud(
        self,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
        slot_index_list=None,
    ):
        return await self._api_parent.print_and_upload_save_in_cloud(
            printer=self,
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            slot_index_list=slot_index_list,
        )

    async def print_and_upload_no_cloud_save(
        self,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
        slot_index_list=None,
    ):
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
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                print_speed_mode=new_speed,
            ),
        )

    async def change_print_setting_target_nozzle_temp(
        self,
        new_temperature: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                target_nozzle_temp=new_temperature,
            ),
        )

    async def change_print_setting_target_hotbed_temp(
        self,
        new_temperature: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                target_hotbed_temp=new_temperature,
            ),
        )

    async def change_print_setting_fan_speed_pct(
        self,
        new_pct: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                fan_speed_pct=new_pct,
            ),
        )

    async def change_print_setting_aux_fan_speed_pct(
        self,
        new_pct: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                aux_fan_speed_pct=new_pct,
            ),
        )

    async def change_print_setting_box_fan_level(
        self,
        new_level: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                box_fan_level=new_level,
            ),
        )

    async def change_print_setting_bottom_layers(
        self,
        new_layers: int
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                bottom_layers=new_layers,
            ),
        )

    async def change_print_setting_bottom_time(
        self,
        new_time: float
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                bottom_time=new_time,
            ),
        )

    async def change_print_setting_off_time(
        self,
        new_time: float
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                off_time=new_time,
            ),
        )

    async def change_print_setting_on_time(
        self,
        new_time: float
    ):
        return await self._api_parent._send_order_change_print_settings(
            printer=self,
            print_settings=AnycubicPrintingSettings(
                on_time=new_time,
            ),
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
                f"secondary_drying_status=\n{self.secondary_drying_status},\n "
                f")")
