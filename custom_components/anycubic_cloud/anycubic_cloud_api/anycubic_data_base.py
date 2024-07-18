import json
import time

from .anycubic_const import (
    REX_GCODE_EXT,
)

from .anycubic_enums import (
    AnycubicFunctionID,
    AnycubicPrintStatus,
)

from .anycubic_helpers import (
    get_part_from_mqtt_topic,
)


class AnycubicBaseOrderRequest:
    def __init__(
        self,
        order_id=None,
        printer_id=None,
    ):
        self._order_id = int(order_id)
        self._printer_id = int(printer_id)

    @property
    def order_request_data(self):
        return {
            'order_id': self._order_id,
            'printer_id': self._printer_id,
        }

    def __repr__(self):
        return (
            f"AnycubicBaseOrderRequest("
            f"order_id={self._order_id}, "
            f"printer_id={self._printer_id})"
        )


class AnycubicBaseProjectOrderRequest(AnycubicBaseOrderRequest):
    def __init__(
        self,
        project_id,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._project_id = int(project_id)

    @property
    def order_request_data(self):
        return {
            **super().order_request_data,
            'project_id': self._project_id,
        }

    def __repr__(self):
        return (
            f"AnycubicBaseProjectOrderRequest("
            f"order_id={self._order_id}, "
            f"printer_id={self._printer_id}, "
            f"project_id={self._project_id})"
        )


class AnycubicProjectOrderRequest(AnycubicBaseProjectOrderRequest):
    def __init__(
        self,
        order_data={},
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._order_data = order_data

    @property
    def order_request_data(self):
        return {
            **super().order_request_data,
            'data': self._order_data,
        }

    def __repr__(self):
        return (
            f"AnycubicProjectOrderRequest("
            f"order_id={self._order_id}, "
            f"printer_id={self._printer_id}, "
            f"project_id={self._project_id}, "
            f"order_data={self._order_data})"
        )


class AnycubicProjectCtrlOrderRequest(AnycubicProjectOrderRequest):
    def __init__(
        self,
        ams_box_mapping=None,
        print_settings=None,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._set_ams_info(ams_box_mapping)
        self._print_settings = print_settings

    def _set_ams_info(self, ams_box_mapping):
        if ams_box_mapping:
            self._ams_info = {
                'ams_box_mapping': [
                    x.as_box_mapping_data()
                    for x in ams_box_mapping
                ],
                'use_ams': (
                    True
                    if len(ams_box_mapping) > 0 else
                    False
                ),
            }
        else:
            self._ams_info = None

    @property
    def order_request_data(self):
        return {
            **super().order_request_data,
            'ams_info': self._ams_info,
            'settings': self._print_settings,
        }

    def __repr__(self):
        return (
            f"AnycubicProjectCtrlOrderRequest("
            f"order_id={self._order_id}, "
            f"printer_id={self._printer_id}, "
            f"project_id={self._project_id}, "
            f"order_data={self._order_data}, "
            f"ams_info={self._ams_info}, "
            f"print_settings={self._print_settings})"
        )


class AnycubicBaseStartPrintRequest:
    def __init__(
        self,
        file_key="",
        file_name="",
        filetype=0,
        task_setting_ai_detect=0,
        task_setting_camera_timelapse=0,
    ):
        self._file_key = file_key
        self._file_name = file_name
        self._filetype = filetype
        self._task_setting_ai_detect = task_setting_ai_detect
        self._task_setting_camera_timelapse = task_setting_camera_timelapse

    @property
    def task_settings(self):
        return {
            'ai_detect': self._task_setting_ai_detect,
            'camera_timelapse': self._task_setting_camera_timelapse,
        }

    @property
    def data(self):
        return {
            'filetype': self._filetype,
            'file_key': self._file_key,
            'file_name': self._file_name,
            'task_settings': self.task_settings,
        }

    def __repr__(self):
        return (
            f"AnycubicBaseStartPrintRequest("
            f"filetype={self._filetype}, "
            f"file_name={self._file_name}, "
            f"task_settings={self.task_settings})"
        )


class AnycubicStartPrintRequestLocal(AnycubicBaseStartPrintRequest):
    def __init__(
        self,
        filename="",
        filepath="",
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._filename = filename
        self._filepath = filepath
        self._filetype = 1

    @property
    def data(self):
        return {
            **super().data,
            'filename': self._filename,
            'filepath': f"/{self._filepath}",
        }

    def __repr__(self):
        return (
            f"AnycubicStartPrintRequestLocal("
            f"filetype={self._filetype}, "
            f"filename={self._filename}, "
            f"filepath={self._filepath}, "
            f"task_settings={self.task_settings})"
        )


class AnycubicStartPrintRequestUdisk(AnycubicStartPrintRequestLocal):
    def __init__(
        self,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._filetype = 2

    def __repr__(self):
        return (
            f"AnycubicStartPrintRequestUdisk("
            f"filetype={self._filetype}, "
            f"filename={self._filename}, "
            f"filepath={self._filepath}, "
            f"task_settings={self.task_settings})"
        )


class AnycubicStartPrintRequestCloud(AnycubicBaseStartPrintRequest):
    def __init__(
        self,
        file_id="",
        hollow_param=None,
        is_delete_file=0,
        matrix="",
        project_type=1,
        punching_param=None,
        slice_param=None,
        slice_size=None,
        template_id=0,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self._file_id = file_id
        self._hollow_param = hollow_param
        self._is_delete_file = is_delete_file
        self._matrix = matrix
        self._project_type = project_type
        self._punching_param = punching_param
        self._slice_param = slice_param
        self._slice_size = slice_size
        self._template_id = template_id

    @property
    def data(self):
        return {
            **super().data,
            'file_id': self._file_id,
            'hollow_param': self._hollow_param,
            'is_delete_file': self._is_delete_file,
            'matrix': self._matrix,
            'project_type': self._project_type,
            'punching_param': self._punching_param,
            'slice_param': self._slice_param,
            'slice_size': self._slice_size,
            'template_id': self._template_id,
        }

    def __repr__(self):
        return (
            f"AnycubicStartPrintRequestCloud("
            f"filetype={self._filetype}, "
            f"file_id={self._file_name}, "
            f"task_settings={self.task_settings})"
        )


class AnycubicCloudFile:
    def __init__(
        self,
        id=None,
        user_id=None,
        post_id=None,
        filename=None,
        time=None,
        size=None,
        status=None,
        ip=None,
        old_filename=None,
        img_status=None,
        device_type=None,
        file_type=None,
        md5=None,
        url=None,
        thumbnail=None,
        is_delete=None,
        update_time=None,
        uuid=None,
        store_type=None,
        bucket=None,
        region=None,
        path=None,
        thumbnail_nonce=None,
        sliceparse_nonce=None,
        file_extension=None,
        name_counts=None,
        source_user_upload_id=None,
        origin_post_id=None,
        stl_user_upload_id=None,
        is_official_slice=None,
        triangles_count=None,
        is_parse=None,
        source_type=None,
        file_source=None,
        user_lock_space_id=None,
        origin_file_md5=None,
        is_temp_file=None,
        official_file_key=None,
        official_file_id=None,
        simplify_model=None,
        size_x=None,
        size_y=None,
        size_z=None,
        estimate=None,
        material_name=None,
        layer_height=None,
        supplies_usage=None,
        gcode_id=None,
        printer_names=None,
        slice_param=None,
    ):
        self._id = id
        self._user_id = user_id
        self._post_id = post_id
        self._filename = filename
        self._time = time
        self._size = size
        self._status = status
        self._ip = ip
        self._old_filename = old_filename
        self._img_status = img_status
        self._device_type = device_type
        self._file_type = file_type
        self._md5 = md5
        self._url = url
        self._thumbnail = thumbnail
        self._is_delete = is_delete
        self._update_time = update_time
        self._uuid = uuid
        self._store_type = store_type
        self._bucket = bucket
        self._region = region
        self._path = path
        self._thumbnail_nonce = thumbnail_nonce
        self._sliceparse_nonce = sliceparse_nonce
        self._file_extension = file_extension
        self._name_counts = name_counts
        self._source_user_upload_id = source_user_upload_id
        self._origin_post_id = origin_post_id
        self._stl_user_upload_id = stl_user_upload_id
        self._is_official_slice = is_official_slice
        self._triangles_count = triangles_count
        self._is_parse = is_parse
        self._source_type = source_type
        self._file_source = file_source
        self._user_lock_space_id = user_lock_space_id
        self._origin_file_md5 = origin_file_md5
        self._is_temp_file = is_temp_file
        self._official_file_key = official_file_key
        self._official_file_id = official_file_id
        self._simplify_model = simplify_model
        self._size_x = size_x
        self._size_y = size_y
        self._size_z = size_z
        self._estimate = estimate
        self._material_name = material_name
        self._layer_height = layer_height
        self._supplies_usage = supplies_usage
        self._gcode_id = gcode_id
        self._printer_names = printer_names
        self._slice_param = slice_param

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            id=data.get('id'),
            user_id=data.get('user_id'),
            post_id=data.get('post_id'),
            filename=data.get('filename'),
            time=data.get('time'),
            size=data.get('size'),
            status=data.get('status'),
            ip=data.get('ip'),
            old_filename=data.get('old_filename'),
            img_status=data.get('img_status'),
            device_type=data.get('device_type'),
            file_type=data.get('file_type'),
            md5=data.get('md5'),
            url=data.get('url'),
            thumbnail=data.get('thumbnail'),
            is_delete=data.get('is_delete'),
            update_time=data.get('update_time'),
            uuid=data.get('uuid'),
            store_type=data.get('store_type'),
            bucket=data.get('bucket'),
            region=data.get('region'),
            path=data.get('path'),
            thumbnail_nonce=data.get('thumbnail_nonce'),
            sliceparse_nonce=data.get('sliceparse_nonce'),
            file_extension=data.get('file_extension'),
            name_counts=data.get('name_counts'),
            source_user_upload_id=data.get('source_user_upload_id'),
            origin_post_id=data.get('origin_post_id'),
            stl_user_upload_id=data.get('stl_user_upload_id'),
            is_official_slice=data.get('is_official_slice'),
            triangles_count=data.get('triangles_count'),
            is_parse=data.get('is_parse'),
            source_type=data.get('source_type'),
            file_source=data.get('file_source'),
            user_lock_space_id=data.get('user_lock_space_id'),
            origin_file_md5=data.get('origin_file_md5'),
            is_temp_file=data.get('is_temp_file'),
            official_file_key=data.get('official_file_key'),
            official_file_id=data.get('official_file_id'),
            simplify_model=data.get('simplify_model'),
            size_x=data.get('size_x'),
            size_y=data.get('size_y'),
            size_z=data.get('size_z'),
            estimate=data.get('estimate'),
            material_name=data.get('material_name'),
            layer_height=data.get('layer_height'),
            supplies_usage=data.get('supplies_usage'),
            gcode_id=data.get('gcode_id'),
            printer_names=data.get('printer_names'),
            slice_param=data.get('slice_param'),
        )

    @property
    def id(self):
        return self._id

    @property
    def gcode_id(self):
        return self._gcode_id

    @property
    def old_filename(self):
        return self._old_filename

    @property
    def size(self):
        return self._size

    @property
    def size_mb(self):
        return self._size / 1e6 if self._size else self._size

    def __repr__(self):
        return (
            f"AnycubicCloudFile("
            f"id={self._id}, "
            f"user_id={self._user_id}, "
            f"post_id={self._post_id}, "
            f"filename={self._filename}, "
            f"time={self._time}, "
            f"size={self._size}, "
            f"status={self._status}, "
            f"ip={self._ip}, "
            f"old_filename={self._old_filename}, "
            f"img_status={self._img_status}, "
            f"device_type={self._device_type}, "
            f"file_type={self._file_type}, "
            f"md5={self._md5}, "
            f"url={self._url}, "
            f"thumbnail={self._thumbnail}, "
            f"is_delete={self._is_delete}, "
            f"update_time={self._update_time}, "
            f"uuid={self._uuid}, "
            f"store_type={self._store_type}, "
            f"bucket={self._bucket}, "
            f"region={self._region}, "
            f"path={self._path}, "
            f"thumbnail_nonce={self._thumbnail_nonce}, "
            f"sliceparse_nonce={self._sliceparse_nonce}, "
            f"file_extension={self._file_extension}, "
            f"name_counts={self._name_counts}, "
            f"source_user_upload_id={self._source_user_upload_id}, "
            f"origin_post_id={self._origin_post_id}, "
            f"stl_user_upload_id={self._stl_user_upload_id}, "
            f"is_official_slice={self._is_official_slice}, "
            f"triangles_count={self._triangles_count}, "
            f"is_parse={self._is_parse}, "
            f"source_type={self._source_type}, "
            f"file_source={self._file_source}, "
            f"user_lock_space_id={self._user_lock_space_id}, "
            f"origin_file_md5={self._origin_file_md5}, "
            f"is_temp_file={self._is_temp_file}, "
            f"official_file_key={self._official_file_key}, "
            f"official_file_id={self._official_file_id}, "
            f"simplify_model={self._simplify_model}, "
            f"size_x={self._size_x}, "
            f"size_y={self._size_y}, "
            f"size_z={self._size_z}, "
            f"estimate={self._estimate}, "
            f"material_name={self._material_name}, "
            f"layer_height={self._layer_height}, "
            f"supplies_usage={self._supplies_usage}, "
            f"gcode_id={self._gcode_id}, "
            f"printer_names={self._printer_names}, "
            f"slice_param={self._slice_param})"
        )


class AnycubicMaterialMapping:
    def __init__(
        self,
        spool_index,
        filament_used,
        material_type,
        color_red,
        color_green,
        color_blue,
        paint_index=0,
    ):
        self._spool_index = int(spool_index)
        self._filament_used = float(filament_used)
        self._material_type = str(material_type)
        self._color_red = int(color_red)
        self._color_green = int(color_green)
        self._color_blue = int(color_blue)
        self._paint_index = int(paint_index)

    @property
    def spool_index(self):
        return self._spool_index

    @property
    def filament_used(self):
        return self._filament_used

    @property
    def material_type(self):
        return self._material_type

    @property
    def paint_index(self):
        return self._paint_index

    @property
    def color_data(self):
        return list([
            self._color_red,
            self._color_green,
            self._color_blue,
        ])

    def as_box_mapping_data(self):
        return {
            'ams_color': self.color_data,
            'ams_index': self._spool_index,
            'filament_used': self._filament_used,
            'material_type': self._material_type,
            'paint_color': self.color_data,
            'paint_index': self._paint_index,
        }

    def __repr__(self):
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


class AnycubicCloudStore:
    def __init__(
        self,
        used_bytes=0,
        total_bytes=0,
        used_str="",
        total_str="",
        user_file_exists=False,
    ):
        self._used_bytes = int(used_bytes)
        self._total_bytes = int(total_bytes)
        self._used_str = used_str
        self._total_str = total_str
        self._user_file_exists = bool(user_file_exists)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            used_bytes=data['used_bytes'],
            total_bytes=data['total_bytes'],
            used_str=data['used'],
            total_str=data['total'],
            user_file_exists=data['user_file_exists'],
        )

    @property
    def used_bytes(self):
        return self._used_bytes

    @property
    def total_bytes(self):
        return self._total_bytes

    @property
    def available_bytes(self):
        return self._total_bytes - self._used_bytes

    def __repr__(self):
        return (
            f"AnycubicCloudStore("
            f"used_bytes={self._used_bytes}, "
            f"total_bytes={self._total_bytes}, "
            f"used_str={self._used_str}, "
            f"total_str={self._total_str}, "
            f"user_file_exists={self._user_file_exists})"
        )


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
    def size_mb(self):
        return self._size / 1e6 if self._size else self._size

    @property
    def is_dir(self):
        return self._is_dir

    @property
    def data_object(self):
        return {
            'name': self._filename,
            'size_mb': self.size_mb,
        }

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
    def color_red(self):
        return self._color[0]

    @property
    def color_green(self):
        return self._color[1]

    @property
    def color_blue(self):
        return self._color[2]

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
        self.set_feed_status(feed_status)
        self.set_current_temperature(temp)
        self.set_drying_status(drying_status)
        self._curr_nozzle_temp = int(curr_nozzle_temp) if curr_nozzle_temp is not None else None
        self._target_nozzle_temp = int(target_nozzle_temp) if target_nozzle_temp is not None else None
        self._slots = list([AnycubicSpoolInfo.from_json(x) for x in slots])

    def set_auto_feed(self, auto_feed):
        self._auto_feed = int(auto_feed)

    def set_drying_status(self, drying_status):
        self._drying_status = AnycubicDryingStatus.from_json(drying_status)

    def set_feed_status(self, feed_status):
        self._feed_status = AnycubicFeedStatus.from_json(feed_status)

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

    def build_mapping_for_material_list(
        self,
        slot_index_list,
        material_list,
    ):
        box_slots = self.slots
        ams_box_mapping = list()

        for x, mat_conf in enumerate(material_list):
            slot_index = slot_index_list[x]
            ams_slot = box_slots[slot_index]
            material = AnycubicMaterialMapping(
                spool_index=slot_index,
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
        self._download_progress = 0
        self._is_downloading = False
        self._is_updating = False

    @property
    def firmware_version(self):
        return self._firmware_version

    @property
    def update_available(self):
        return self._need_update == 1

    @property
    def update_progress(self):
        return self._update_progress

    @property
    def download_progress(self):
        return self._download_progress

    @property
    def available_version(self):
        return self._target_version

    @property
    def is_updating(self):
        return self._is_updating

    @property
    def is_downloading(self):
        return self._is_downloading

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

            if self._is_updating:
                self._is_updating = False

            if self._is_downloading:
                self._is_downloading = False

            self._download_progress = 0
            self._update_progress = 0
            self._need_update = 0

    def set_is_updating(self, is_updating):
        self._is_updating = bool(is_updating)

    def set_is_downloading(self, is_downloading):
        self._is_downloading = bool(is_downloading)

    def set_update_progress(self, update_progress):
        self._update_progress = int(update_progress)

    def set_download_progress(self, download_progress):
        self._download_progress = int(download_progress)

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
        self._set_type_function_ids(type_function_ids)
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
        self._udisk_file_list = None
        self._has_peripheral_camera = False
        self._has_peripheral_multi_color_box = False
        self._has_peripheral_udisk = False
        self._is_bound_to_user = True

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
        )

    @classmethod
    def from_info_json(cls, api_parent, data):
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
            )
        except Exception as e:
            print(data)
            raise e

    def update_from_info_json(self, data):
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
        self._machine_data = AnycubicMachineData.from_json(data.get('machine_data'))
        self._set_type_function_ids(data['type_function_ids'])
        self._material_type = extra_data.get('material_type')
        self._parameter = AnycubicMachineParameter.from_json(data.get('parameter'))
        self._fw_version = AnycubicMachineFirmwareInfo.from_json(data['version'])
        self._tools = list([
            AnycubicMachineToolInfo.from_json(x)
            for x in data['tools']
        ]) if data.get('tools') is not None else None
        self._multi_color_box_fw_version = list([
            AnycubicMachineFirmwareInfo.from_json(x)
            for x in data['multi_color_box_version']
        ]) if data.get('multi_color_box_version') is not None else None
        self._external_shelves = AnycubicMachineExternalShelves.from_json(data.get('external_shelves'))
        self._set_multi_color_box(data.get('multi_color_box'))

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
        elif action in ['start', 'stop'] and state in ['stoped', 'stopping']:
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
        elif action in ['setInfo', 'refresh'] and state == 'success':
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
        elif action == 'feedFilament' and state == 'done':
            data = payload['data']['multi_color_box']
            for box in data:
                box_id = int(box['id'])
                if self._multi_color_box is None or len(self._multi_color_box) < box_id + 1:
                    continue

                loaded_slot = int(box['loaded_slot'])

                self._multi_color_box[box_id].set_slot_loaded(loaded_slot)
                self._multi_color_box[box_id].set_feed_status(box['feed_status'])
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
        return (
            self._multi_color_box[0]
            if self._multi_color_box is not None and len(self._multi_color_box) > 0
            else None
        )

    @property
    def primary_drying_status(self):
        if self.primary_multi_color_box is None:
            return None

        return self.primary_multi_color_box.drying_status

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

    async def delete_local_file(
        self,
        file_name: str,
    ):

        return await self._api_parent._send_order_delete_local_file(
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
