from __future__ import annotations

from ..models.http import HTTP_METHODS, AnycubicAPIEndpoint


class API_ENDPOINT:
    oauth_token_url = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v3/public/getoauthToken',
    )
    auth_sig_token = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/v3/public/loginWithAccessToken',
    )
    user_store = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/work/index/getUserStore',
    )
    lock_storage_space = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/v2/cloud_storage/lockStorageSpace',
    )
    unlock_storage_space = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/v2/cloud_storage/unlockStorageSpace',
    )
    new_file_upload = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/v2/profile/newUploadFile',
    )
    delete_cloud_file = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/work/index/delFiles',
    )
    user_files = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/work/index/files',
    )
    user_info = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/user/profile/userInfo',
    )
    printer_status = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/Printer/status',
    )
    printer_info = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/printer/info',
    )
    printer_tool = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/printer/tool',
    )
    printer_functions = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/printer/functions',
    )
    printer_all = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/printer/all',
    )
    printers_status = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/work/printer/printersStatus',
    )
    printer_get_printers = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/work/printer/getPrinters',
    )
    print_history = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/project/printHistory',
    )
    project_info = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/project/info',
    )
    project_monitor = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/v2/project/monitor',
    )
    project_get_projects = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/work/project/getProjects',
    )
    project_gcode_info_fdm = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/work/gcode/infoFdm',
    )
    send_order = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/work/operation/sendOrder',
    )
    printer_update_name = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/work/printer/Info',
    )
    printer_firmware_update = AnycubicAPIEndpoint(
        HTTP_METHODS.GET,
        '/work/printer/update_version',
    )
    printer_multi_color_box_firmware_update = AnycubicAPIEndpoint(
        HTTP_METHODS.POST,
        '/v2/printer/update_multi_color_box_version'
    )
