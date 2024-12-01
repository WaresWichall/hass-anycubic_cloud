from __future__ import annotations


class ErrorsGeneral:
    no_printer_to_print = str(
        "No printer to print with."
    )
    no_ace_for_map = str(
        "No ACE found for supplied box mapping."
    )
    no_map_for_ace = str(
        "Must supply box mapping when using ACE."
    )
    no_ace_for_slot_list = str(
        "No ACE found for slot list."
    )
    no_slot_list_for_ace = str(
        "Must supply a slot list when using ACE."
    )
    name_change_fail_revert = str(
        "Failed to change printer name, reverted to previous."
    )
    name_change_fail_unknown = str(
        "Failed to change printer name, unknown error."
    )
    send_order_fail = str(
        "Error sending order to Anycubic Cloud, is the printer online? Message: {0}"
    )
    file_upload_mismatch = str(
        "File upload mis-match, cannot print."
    )
    cloud_file_no_gcodeid = str(
        "Cloud file data error, missing gcodeid."
    )
    set_slot_color_invalid = str(
        "Must use either `slot_color` or all 3 of `slot_color_red`, `slot_color_green`, `slot_color_blue`"
    )
    print_failed = str(
        "Print Failed: {0}"
    )
    noid_printer = str(
        "Printer is missing ID."
    )
    noid_update_info_from_api = str(
        "Error in printer update_info_from_api, missing id"
    )
    insufficent_ace_units = str(
        "Not enough ACE units connected for slot indexes (expected {0})."
    )


class ErrorsFileNotFound:
    in_cloud = str(
        "File not found in cloud."
    )


class ErrorsMQTTClient:
    client_id_missing_email = str(
        "Unable to build mqtt_client_id, missing user email."
    )
    pub_key_invalid = str(
        "Invalid Anycubic public key for MQTT signing."
    )
    cert_missing = str(
        "Unable to load MQTT Certificate, path does not exist."
    )
    cert_ca_missing = str(
        "Unable to load MQTT CA Certificate, path does not exist."
    )
    connect_client_missing = str(
        "Unexpected error in mqtt_on_connect, missing client."
    )
    sub_printer_status_client_missing = str(
        "Unexpected error in mqtt_subscribe_printer_status, missing client."
    )
    sub_printer_key_missing = str(
        "Unexpected error in mqtt_add_subscribed_printer, missing printer key."
    )


class ErrorsAPIParsing:
    api_error_rate_limited = str(
        "Unexpected response for login, rate limited?"
    )
    api_error_server_maintenance = str(
        "Unexpected error parsing Anycubic response, server maintenance?"
    )
    api_error_user_server_maintenance = str(
        "Unexpected error retrieving user info, server maintenance?"
    )
    api_error_aws = str(
        "Unexpected error parsing AWS response: {0}"
    )


class ErrorsDataParsing:
    user_cloud_files = str(
        "Error parsing user_cloud_files: {0}"
    )
    projects = str(
        "Error parsing projects: {0}"
    )
    local_file_list = str(
        "Error parsing local_file_list: {0}"
    )
    udisk_file_list = str(
        "Error parsing udisk_file_list: {0}"
    )
    tools = str(
        "Error parsing tools: {0}"
    )
    ace_fw_version = str(
        "Failed to load ACE FW version from: {0}"
    )
    ace = str(
        "Failed to load ACE spool info from: {0}"
    )
    available_print_speed_modes = str(
        "Error parsing available_print_speed_modes: {0}"
    )
    project_settings_json = str(
        "Error parsing project settings json: {0}\n{1}"
    )
    project_settings_unknown = str(
        "Unexpected data for project settings: {0}"
    )
    project_slice_param_json = str(
        "Error parsing project slice_param json: {0}\n{1}"
    )
    project_slice_param_unknown = str(
        "Unexpected data for project slice_param: {0}"
    )
    project_slice_result_json = str(
        "Error parsing project slice_result json: {0}\n{1}"
    )
    project_slice_result_unknown = str(
        "Unexpected data for project slice_result: {0}"
    )


class ErrorsGcodeParsing:
    invalid_path = str(
        "Cannot parse an empty file path."
    )
    invalid_ext = str(
        "Can only parse gcode files."
    )
    fetch_failed = str(
        "Failed to fetch project gcode data."
    )
    material_list_empty = str(
        "Empty material list in gcode file."
    )
    read_fail = str(
        "Failed to read gcode file, error: {0}"
    )
    byte_decode_fail = str(
        "Failed to decode gcode file bytes, error: {0}"
    )
    invalid_path_and_bytes = str(
        "Cannot read slicer data without file path or bytes."
    )
    parse_meta_fail = str(
        "Failed to parse gcode metadata, error: {0}"
    )
    empty_paint_info = str(
        "Cannot load AMS paint info from gcode."
    )
    empty_used_filament = str(
        "Cannot load used filament info from gcode."
    )
    invalid_used_filament = str(
        "Not enough used filament info parsed for AMS data."
    )
    slot_material_list_mismatch = str(
        "{0} slots supplied but {1} materials found in gcode file."
    )


class ErrorsAuth:
    missing_auth = str(
        "Cannot authenticate, anycubic_auth object is missing."
    )
    set_auth_missing_token = str(
        "Must supply token or access_token"
    )
    missing_auth_token = str(
        "Missing auth token."
    )
    user_id_md5_tuple_missing_id = str(
        "Unable to build user_id_md5_tuple, missing user id."
    )
    access_token_login_failed = str(
        "Failed to login with access_token, server message: {0}"
    )


class ErrorsAuthTokenExpired:
    invalid_credentials = str(
        "Invalid credentials."
    )


class ErrorsInvalidValue:
    invalid_nozzle_temp = str(
        "Invalid target nozzle temperature."
    )
    too_low_nozzle_temp = str(
        "Target nozzle temperature is below allowed minimum."
    )
    too_high_nozzle_temp = str(
        "Target nozzle temperature is above allowed maximum."
    )
    invalid_hotbed_temp = str(
        "Invalid target hotbed temperature."
    )
    too_low_hotbed_temp = str(
        "Target hotbed temperature is below allowed minimum."
    )
    too_high_hotbed_temp = str(
        "Target hotbed temperature is above allowed maximum."
    )
    invalid_speed_mode = str(
        "Invalid print speed mode."
    )
    speed_mode_not_found = str(
        "Print speed mode {0} not found in available modes."
    )
    invalid_fan_speed = str(
        "Invalid fan speed %."
    )
    too_low_fan_speed = str(
        "Fan speed is below allowed minimum."
    )
    too_high_fan_speed = str(
        "Fan speed is above allowed maximum."
    )


class ErrorsLoadingProps:
    range_nozzle_temp = str(
        "Allowed nozzle temperature range is not loaded."
    )
    range_hotbed_temp = str(
        "Allowed hotbed temperature range is not loaded."
    )
    speed_modes_not_loaded = str(
        "Available print speed modes not loaded."
    )


class ErrorsCloudUpload:
    missing_path_bytes = str(
        "AnycubicCloudUpload created without path or bytes."
    )
    missing_user_store_previous = str(
        "Error in set_previous_data_with_user_store, missing user_store"
    )
    missing_user_store_current = str(
        "Error in set_current_data_with_user_store, missing user_store"
    )
    missing_path = str(
        "Cannot upload an empty file path."
    )
    path_not_exist = str(
        "Cannot upload, path does not exist."
    )
    empty_file_size = str(
        "Cannot upload file: {0} - empty file."
    )
    empty_file_bytes = str(
        "Cannot upload file: {0} - no data."
    )
    unknown = str(
        "Error uploading file: {0} - {1}."
    )
    no_space_available = str(
        "Cannot upload file: {0} - no room on cloud."
    )
    not_found_cloud = str(
        "Unknown error uploading file: {0} - not found in cloud storage."
    )
    missing_unlock_file_id = str(
        "Error in unlock_storage_space, missing lock_file_id"
    )
    missing_lock_data = str(
        "Error in upload_and_set_cloud_file_id, missing lock_data"
    )
    missing_file_bytes = str(
        "Error in upload_and_set_cloud_file_id, missing file_bytes"
    )
    missing_lock_file_id = str(
        "Error in upload_and_set_cloud_file_id, missing lock_file_id"
    )
    file_claim_failed = str(
        "Failed to claim file upload, response: {0}"
    )


class ErrorsMQTTUpdate:
    unknown = str(
        "Unknown mqtt update, type: {0}."
    )
    lastwill = str(
        "Unknown lastwill state."
    )
    user = str(
        "Unknown user update."
    )
    printer_status = str(
        "Unknown status/workReport."
    )
    ota_ace = str(
        "Unknown ota multiColorBox data."
    )
    ota_printer = str(
        "Unknown ota version."
    )
    temperature = str(
        "Unknown temperature data."
    )
    fan = str(
        "Unknown fan data."
    )
    job_status = str(
        "Unknown print status data."
    )
    ace = str(
        "Unknown multiColorBox data."
    )
    shelves = str(
        "Unknown shelves data."
    )
    file = str(
        "Unknown file data."
    )
    peripherals = str(
        "Unknown peripherals data."
    )
