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

    @property
    def data_object(self):
        return {
            'id': self.id,
            'name': self.old_filename,
            'size_mb': self.size_mb,
        }

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
            f"used={self._used_str}, "
            f"total={self._total_str}, "
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
