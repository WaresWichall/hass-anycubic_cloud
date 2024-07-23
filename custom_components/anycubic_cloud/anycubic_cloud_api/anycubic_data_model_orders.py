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
        self._is_delete_file = int(is_delete_file)
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
