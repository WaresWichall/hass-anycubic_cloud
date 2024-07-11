from enum import Enum


class HTTP_METHODS(Enum):
    GET = 1
    POST = 2
    PUT = 3


class APIAuthTokensExpired(Exception):
    pass


class AnycubicAPIError(Exception):
    pass


class ac_api_endpoint:
    def __init__(self, method, endpoint):
        self._method = method
        self._endpoint = endpoint

    @property
    def method(self):
        return self._method

    @property
    def endpoint(self):
        return self._endpoint


class API_ENDPOINT:
    oauth_token_url = ac_api_endpoint(HTTP_METHODS.GET, '/v3/public/getoauthToken')
    auth_sig_token = ac_api_endpoint(HTTP_METHODS.POST, '/v3/public/loginWithAccessToken')
    user_store = ac_api_endpoint(HTTP_METHODS.POST, '/work/index/getUserStore')
    lock_storage_space = ac_api_endpoint(HTTP_METHODS.POST, '/v2/cloud_storage/lockStorageSpace')
    unlock_storage_space = ac_api_endpoint(HTTP_METHODS.POST, '/v2/cloud_storage/unlockStorageSpace')
    new_file_upload = ac_api_endpoint(HTTP_METHODS.POST, '/v2/profile/newUploadFile')
    delete_cloud_file = ac_api_endpoint(HTTP_METHODS.POST, '/work/index/delFiles')
    user_files = ac_api_endpoint(HTTP_METHODS.POST, '/work/index/files')
    user_info = ac_api_endpoint(HTTP_METHODS.GET, '/user/profile/userInfo')
    printer_status = ac_api_endpoint(HTTP_METHODS.GET, '/v2/Printer/status')
    printer_info = ac_api_endpoint(HTTP_METHODS.GET, '/v2/printer/info')
    printer_tool = ac_api_endpoint(HTTP_METHODS.GET, '/v2/printer/tool')
    printer_functions = ac_api_endpoint(HTTP_METHODS.GET, '/v2/printer/functions')
    printer_all = ac_api_endpoint(HTTP_METHODS.GET, '/v2/printer/all')
    printers_status = ac_api_endpoint(HTTP_METHODS.GET, '/work/printer/printersStatus')
    printer_get_printers = ac_api_endpoint(HTTP_METHODS.GET, '/work/printer/getPrinters')
    print_history = ac_api_endpoint(HTTP_METHODS.GET, '/v2/project/printHistory')
    project_info = ac_api_endpoint(HTTP_METHODS.GET, '/v2/project/info')
    project_monitor = ac_api_endpoint(HTTP_METHODS.GET, '/v2/project/monitor')
    project_get_projects = ac_api_endpoint(HTTP_METHODS.GET, '/work/project/getProjects')
    project_gcode_info_fdm = ac_api_endpoint(HTTP_METHODS.GET, '/work/gcode/infoFdm')
    send_order = ac_api_endpoint(HTTP_METHODS.POST, '/work/operation/sendOrder')
    printer_update_name = ac_api_endpoint(HTTP_METHODS.POST, '/work/printer/Info')
    printer_firmware_update = ac_api_endpoint(HTTP_METHODS.GET, '/work/printer/update_version')
    printer_multi_color_box_firmware_update = ac_api_endpoint(
        HTTP_METHODS.POST,
        '/v2/printer/update_multi_color_box_version'
    )
