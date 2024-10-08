import aiohttp
import asyncio
import hashlib
import json
import time
from aiofiles import (
    open as aio_file_open,
)
from aiofiles.os import (
    path as aio_path,
)

from .anycubic_data_model_files import (
    AnycubicCloudFile,
    AnycubicCloudStore,
)

from .anycubic_data_model_orders import (
    AnycubicBaseOrderRequest,
    AnycubicBaseProjectOrderRequest,
    AnycubicBaseStartPrintRequest,
    AnycubicCameraToken,
    AnycubicProjectCtrlOrderRequest,
    AnycubicProjectOrderRequest,
    AnycubicStartPrintRequestCloud,
    AnycubicStartPrintRequestLocal,
)

from .anycubic_data_model_printer import (
    AnycubicPrinter,
)

from .anycubic_data_model_printer_properties import (
    AnycubicMaterialColor,
    AnycubicMaterialMapping,
)

from .anycubic_data_model_printing_settings import (
    AnycubicPrintingSettings,
)

from .anycubic_data_model_project import (
    AnycubicProject,
)

from .anycubic_model_base import (
    AnycubicCloudUpload,
)

from .anycubic_api_base import (
    HTTP_METHODS,
    API_ENDPOINT,
)

from .anycubic_exceptions import (
    AnycubicAPIError,
    AnycubicAPIParsingError,
    AnycubicErrorMessage,
    AnycubicFileNotFoundError,
    APIAuthTokensExpired,
)

from .anycubic_const import (
    BASE_DOMAIN,
    APP_REDIRECT_URI,
    AUTH_DOMAIN,
    PUBLIC_API_ENDPOINT,
    REX_JS_FILE,
    REX_CLIENT_ID,
    REX_APP_ID_BASIC,
    REX_APP_ID_OBF,
    REX_APP_VERSION,
    REX_APP_SECRET_BASIC,
    REX_APP_SECRET_OBF,
    DEFAULT_USER_AGENT,
    AC_KNOWN_CID_APP,
    AC_KNOWN_CID_WEB,
    AC_KNOWN_AID,
    AC_KNOWN_VID_APP,
    AC_KNOWN_VID_WEB,
    AC_KNOWN_SEC,
    AnycubicServerMessage,
)

from .anycubic_enums import (
    AnycubicFeedType,
    AnycubicOrderID,
)

from .anycubic_helpers import (
    async_read_material_list_from_gcode_file,
    generate_app_nonce,
    generate_cookie_state,
    generate_fake_device_id,
    generate_web_nonce,
)


class AnycubicAPI:
    def __init__(
        self,
        session,
        cookie_jar,
        debug_logger=None,
        auth_as_app=False,
        auth_sig_token=None,
    ):
        # Cache
        self._cache_key_path = None
        self._cache_tokens_path = None
        self._cache_sig_token_path = None
        # API
        self.base_url = f"https://{BASE_DOMAIN}/"
        self._public_api_root = f"{self.base_url}{PUBLIC_API_ENDPOINT}"
        # Internal
        self._api_username = None
        self._api_password = None
        self._api_user_id = None
        self._api_user_email = None
        self._session: aiohttp.ClientSession = session
        self._sessionjar = cookie_jar
        self._cookie_state = generate_cookie_state()
        self._debug_logger = debug_logger
        self._tokens_changed = False
        self._auth_as_app = auth_as_app
        self._redirect_uri = self.base_url if not self._auth_as_app else APP_REDIRECT_URI
        # ANYCUBIC APP VARS
        self._client_id = None
        self._app_id = None
        self._app_version = None
        self._app_secret = None
        self._device_id = None
        # ANYCUBIC AUTH VARS
        self._login_auth_code = None
        self._auth_access_token = None
        self._auth_sig_token = auth_sig_token
        self._auth_referer = None

    def set_username_password(
        self,
        api_username,
        api_password,
    ):
        self._api_username = api_username
        self._api_password = api_password

    def set_auth_sig_token(
        self,
        auth_sig_token,
    ):
        self._auth_sig_token = auth_sig_token

    @property
    def tokens_changed(self):
        return self._tokens_changed

    @property
    def api_user_id(self):
        return self._api_user_id

    @property
    def api_user_email(self):
        return self._api_user_email

    @property
    def api_user_identifier(self):
        return self._api_user_email or self._api_user_id

    def _log_to_debug(self, msg):
        if self._debug_logger:
            self._debug_logger.debug(msg)

    def _log_to_warn(self, msg):
        if self._debug_logger:
            self._debug_logger.warn(msg)

    def _log_to_error(self, msg):
        if self._debug_logger:
            self._debug_logger.error(msg)

    #
    #
    # API Functions
    # ------------------------------------------

    def _web_headers(self, with_origin=AUTH_DOMAIN):
        header_dict = {
            'User-Agent': DEFAULT_USER_AGENT
        }
        if with_origin:
            header_dict['Origin'] = f'https://{with_origin}'
        return header_dict

    def _build_api_url(self, endpoint):
        return f"{self._public_api_root}{endpoint.endpoint}"

    def _build_auth_url(self, endpoint):
        return f"https://{AUTH_DOMAIN}{endpoint}"

    def _build_public_root_url(self, endpoint):
        return f"{self.base_url}{endpoint}"

    async def _fetch_ext_resp(
        self,
        method,
        base_url,
        query=None,
        params={},
        is_json=True,
        extra_headers={},
        with_origin=AUTH_DOMAIN,
        with_response=False,
        put_data=None,
    ):
        url = base_url
        headers = {**self._web_headers(with_origin=with_origin), **extra_headers}
        if method == HTTP_METHODS.POST:
            if params is not None and (isinstance(params, dict) or isinstance(params, list)):
                data = json.dumps(params)
            elif params is not None:
                data = str(params)
            else:
                data = None
            h_coro = self._session.post(url, params=query, data=data, headers=headers)
        elif method == HTTP_METHODS.PUT:
            h_coro = self._session.put(url, params=query, data=put_data, headers=headers)
        else:
            h_coro = self._session.get(url, params=query, headers=headers)

        try:
            async with h_coro as resp:
                if is_json:
                    resp_data = await resp.json()
                else:
                    resp_data = await resp.text()
        except Exception:
            raise AnycubicAPIParsingError('Unexpected error parsing Anycubic response, server maintenance?')

        if with_response:
            return resp_data, resp
        return resp_data

    async def _fetch_pub_get_resp(self, endpoint, is_json=True):
        return await self._fetch_ext_resp(
            method=HTTP_METHODS.GET,
            base_url=self._build_public_root_url(endpoint),
            is_json=is_json,
        )

    async def _fetch_aws_put_resp(self, final_url, put_data):
        return await self._fetch_ext_resp(
            method=HTTP_METHODS.PUT,
            base_url=final_url,
            is_json=False,
            put_data=put_data,
        )

    async def _fetch_api_resp(
        self,
        endpoint,
        query=None,
        params={},
        is_json=True,
        extra_headers={},
        with_origin=BASE_DOMAIN,
        with_token=True,
    ):
        return await self._fetch_ext_resp(
            method=endpoint.method,
            base_url=self._build_api_url(endpoint),
            query=query,
            params=params,
            is_json=is_json,
            extra_headers=self._build_auth_headers(with_token=with_token),
            with_origin=with_origin,
        )

    #
    #
    # Login Functions
    # ------------------------------------------

    async def _fetch_js_body(self):
        body = await self._fetch_pub_get_resp("ai", is_json=False)
        js_files = REX_JS_FILE.search(body)
        if js_files is None:
            raise Exception("Could not find js file in source.")
        js_file = js_files.group(1)
        return await self._fetch_pub_get_resp(js_file[1:], is_json=False)

    def _generate_device_id(self):
        self._device_id = generate_fake_device_id()

    def _get_known_var_cid(self):
        return AC_KNOWN_CID_WEB if not self._auth_as_app else AC_KNOWN_CID_APP

    def _get_known_var_vid(self):
        return AC_KNOWN_VID_WEB if not self._auth_as_app else AC_KNOWN_VID_APP

    def _set_known_app_vars(self):
        self._client_id = self._get_known_var_cid()
        self._app_id = AC_KNOWN_AID
        self._app_version = self._get_known_var_vid()
        self._app_secret = AC_KNOWN_SEC

    async def _extract_current_app_vars(self):
        js_body = await self._fetch_js_body()

        basic_app_id_found = False

        client_matches = REX_CLIENT_ID.findall(js_body)
        if len(client_matches) == 1:
            self._client_id = client_matches[0]
        else:
            self._log_to_debug("Falling back to known Client ID.")
            self._client_id = self._get_known_var_cid()

        app_id_matches = REX_APP_ID_BASIC.findall(js_body)
        if len(app_id_matches) == 1:
            self._app_id = app_id_matches[0]
            basic_app_id_found = True
        else:
            app_id_matches = REX_APP_ID_OBF.findall(js_body)
            if len(app_id_matches) == 1:
                self._app_id = app_id_matches[0]
            else:
                self._log_to_debug("Falling back to known App ID.")
                self._app_id = AC_KNOWN_AID

        app_version_matches = REX_APP_VERSION.findall(js_body)
        if len(app_version_matches) == 1:
            self._app_version = app_version_matches[0]
        else:
            self._log_to_debug("Falling back to known Version.")
            self._app_version = self._get_known_var_vid()

        if basic_app_id_found:
            app_secret_matches = REX_APP_SECRET_OBF.findall(js_body)
        else:
            app_secret_matches = REX_APP_SECRET_BASIC.findall(js_body)
        if len(app_secret_matches) == 1:
            self._app_secret = app_secret_matches[0]
        else:
            self._log_to_debug("Falling back to known Secret.")
            self._app_secret = AC_KNOWN_SEC

        return self._client_id

    async def _init_oauth_session(self):
        query = {
            'clientId': self._client_id,
            'responseType': 'code',
            'redirectUri': self._redirect_uri,
            'scope': 'read',
            'state': self._cookie_state,
        }
        await self._fetch_ext_resp(
            method=HTTP_METHODS.GET,
            base_url=self._build_auth_url("/login/oauth/authorize"),
            query=query,
            is_json=False
        )

    async def _password_logon(self):
        query = {
            'clientId': self._client_id,
            'responseType': 'code',
            'redirectUri': self._redirect_uri,
            'type': 'code',
            'scope': 'read',
            'state': self._cookie_state,
            'nonce': '',
            'code_challenge_method': '',
            'code_challenge': '',
        }
        params = {
            'application': 'ac_web',
            'organization': 'anycubic',
            'password': self._api_password,
            'type': 'code',
            'username': self._api_username,
        }
        resp = await self._fetch_ext_resp(
            method=HTTP_METHODS.POST,
            base_url=self._build_auth_url("/api/login"),
            query=query,
            params=params
        )

        if resp is None or not isinstance(resp['data'], str):
            err_msg = "Unexpected response for login, rate limited?"
            self._log_to_warn(err_msg)
            raise AnycubicAPIParsingError(err_msg)

        self._login_auth_code = resp['data']
        self._log_to_debug("Successfully logged in.")

    async def _fetch_ac_code_state(self):
        query = {
            'code': self._login_auth_code,
            'state': self._cookie_state,
        }
        _, resp = await self._fetch_ext_resp(
            method=HTTP_METHODS.GET,
            base_url=self.base_url,
            query=query,
            is_json=False,
            with_response=True,
        )
        self._auth_referer = resp.url

    def _build_auth_headers(self, with_token=False):
        auth_nonce = generate_app_nonce() if self._auth_as_app else generate_web_nonce()
        timestamp = int(time.time() * 1e3)
        sig_input = f"{self._app_id}{timestamp}{self._app_version}{self._app_secret}{auth_nonce}{self._app_id}"
        signature = hashlib.md5(sig_input.encode('utf-8'))
        auth_headers = {
            'Xx-Device-Type': 'web' if not self._auth_as_app else 'android',
            'Xx-Is-Cn': '1' if not self._auth_as_app else '0',
            'Xx-Nonce': auth_nonce,
            'Xx-Signature': signature.hexdigest(),
            'Xx-Timestamp': str(timestamp),
            'Xx-Version': self._app_version,
            'Content-Type': 'application/json',
        }
        if self._auth_as_app:
            auth_headers['XX-Device-Id'] = self._device_id
        if with_token:
            if self._auth_sig_token is None:
                raise Exception("No sig token.")
            auth_headers['XX-Token'] = self._auth_sig_token
            auth_headers['XX-LANGUAGE'] = 'US'
        return auth_headers

    async def _get_oauth_token(self):
        query = {
            'code': self._login_auth_code,
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.oauth_token_url, query=query, with_token=False)
        self._auth_access_token = resp['data']['access_token']
        self._log_to_debug("Successfully got auth token.")

    async def _get_sig_token(self):
        params = {
            'access_token': self._auth_access_token,
            'device_type': 'web' if not self._auth_as_app else 'android',
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.auth_sig_token, query=None, params=params, with_token=False)
        self._auth_sig_token = resp['data']['token']
        self._log_to_debug("Successfully got sig token.")

    async def _login_retrieve_tokens(
        self,
        use_known=True,
    ):
        if use_known:
            self._set_known_app_vars()
        else:
            await self._extract_current_app_vars()
        self._generate_device_id()
        await self._init_oauth_session()
        await self._password_logon()
        await self._fetch_ac_code_state()
        await self._get_oauth_token()
        await self._get_sig_token()

    def build_token_dict(self):
        self._tokens_changed = False

        return {
            'client_id': self._client_id,
            'app_id': self._app_id,
            'app_version': self._app_version,
            'app_secret': self._app_secret,
            'auth_access_token': self._auth_access_token,
            'auth_sig_token': self._auth_sig_token,
            'device_id': self._device_id,
        }

    def load_tokens_from_dict(self, data):
        self._client_id = data['client_id']
        self._app_id = data['app_id']
        self._app_version = data['app_version']
        self._app_secret = data['app_secret']
        self._auth_access_token = data['auth_access_token']
        self._auth_sig_token = data['auth_sig_token']
        if 'device_id' in data:
            self._device_id = data['device_id']
        else:
            self._generate_device_id()

    def clear_all_tokens(self):
        self._client_id = None
        self._app_id = None
        self._app_version = None
        self._app_secret = None
        self._auth_access_token = None
        self._auth_sig_token = None
        self._device_id = None

    async def _save_main_tokens(self):
        self._tokens_changed = True
        if self._cache_key_path is None:
            return False

        async with aio_file_open(self._cache_key_path, mode='w') as wo:
            await wo.write(json.dumps(self.build_token_dict()))

    async def _load_cached_sig_token(self):
        if self._cache_sig_token_path is not None and (await aio_path.exists(self._cache_sig_token_path)):

            try:
                async with aio_file_open(self._cache_sig_token_path, mode='r') as wo:
                    self._auth_sig_token = await wo.read()

            except Exception:
                pass

    async def _load_main_tokens(self):
        tokens_loaded = False
        if self._cache_tokens_path is not None and (await aio_path.exists(self._cache_tokens_path)):

            try:
                async with aio_file_open(self._cache_tokens_path, mode='r') as wo:
                    json_data = await wo.read()
                    data = json.loads(json_data)
                self.load_tokens_from_dict(data['data'])
                tokens_loaded = True

            except Exception:
                pass

        if tokens_loaded:
            return True

        if self._cache_key_path is not None and (await aio_path.exists(self._cache_key_path)):

            try:
                async with aio_file_open(self._cache_key_path, mode='r') as wo:
                    json_data = await wo.read()
                    data = json.loads(json_data)
                self.load_tokens_from_dict(data)
                tokens_loaded = True

            except Exception:
                pass

        if tokens_loaded:
            return True

        self._log_to_debug("No cached tokens found.")
        return False

    def _api_tokens_loaded(self):
        all_tokens = [
            self._client_id,
            self._app_id,
            self._app_version,
            self._app_secret,
            self._auth_access_token,
            self._auth_sig_token]
        return all([x is not None for x in all_tokens])

    async def _check_can_access_api(
        self,
        use_known=True,
    ):
        self._set_known_app_vars()
        await self._load_cached_sig_token()
        try:
            await self.get_user_info()
            return True
        except APIAuthTokensExpired:
            self._log_to_debug("Tokens expired.")
            return False

    # async def _check_can_access_api(
    #     self,
    #     use_known=True,
    # ):
    #     if not self._api_tokens_loaded():
    #         cached_tokens = await self._load_main_tokens()
    #     else:
    #         cached_tokens = True
    #     if cached_tokens:
    #         try:
    #             await self.get_user_info()
    #             return True
    #         except APIAuthTokensExpired:
    #             cached_tokens = None
    #             self._log_to_debug("Tokens expired.")
    #     if not cached_tokens:
    #         try:
    #             await self._login_retrieve_tokens(
    #                 use_known=use_known
    #             )
    #             await self._save_main_tokens()
    #         except Exception:
    #             return False
    #     try:
    #         await self.get_user_info()
    #     except Exception:
    #         return False
    #     return True

    async def check_api_tokens(self):
        if not await self._check_can_access_api(True):
            return False

            # if self._api_tokens_loaded() and not self._auth_as_app:
            #     self._log_to_debug(
            #         "Login failed, retrying with new variables..."
            #     )
            #     return await self._check_can_access_api(False)
            # else:
            #     return False

        return True

    #
    #
    # General API Calls
    # ------------------------------------------

    async def _lock_storage_space(
        self,
        file_size,
        file_name,
        is_temp_file=0,
        raw_data=False,
    ):
        params = {
            'size': file_size,
            'name': file_name,
            'is_temp_file': int(is_temp_file),
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.lock_storage_space, params=params)
        if raw_data:
            return resp

        data = resp['data']

        return data

    async def _unlock_storage_space(
        self,
        file_id,
        is_delete_cos=0,
        raw_data=False,
    ):
        params = {
            'id': file_id,
            'is_delete_cos': int(is_delete_cos),
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.unlock_storage_space, params=params)
        if raw_data:
            return resp

        data = resp['data']

        return data

    async def _claim_file_upload_from_aws(
        self,
        file_id,
        raw_data=False,
    ):
        params = {
            'user_lock_space_id': file_id,
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.new_file_upload, params=params)
        if raw_data:
            return resp

        data = resp['data']

        return data['id']

    async def _set_printer_name(
        self,
        printer_id,
        new_name,
        raw_data=False,
    ):
        params = {
            'id': str(printer_id),
            'name': str(new_name),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_update_name,
            params=params
        )
        if raw_data:
            return resp

        data = resp['data']

        return data

    async def _update_printer_firmware(
        self,
        printer_id,
        current_fw_version,
        raw_data=False,
    ):
        query = {
            'id': str(printer_id),
            'target_version': str(current_fw_version),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_firmware_update,
            query=query
        )
        if raw_data:
            return resp

        data = resp['data']

        return data

    async def _update_muli_color_box_firmware(
        self,
        printer_id,
        box_id,
        raw_data=False,
    ):
        params = {
            'id': int(printer_id),
            'box_id': int(box_id),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_multi_color_box_firmware_update,
            params=params,
        )
        if raw_data:
            return resp

        data = resp['data']

        return data

    async def get_user_info(
        self,
        raw_data=False,
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_info)
        if raw_data:
            return resp

        data = resp['data']
        if data is None:
            raise APIAuthTokensExpired('Invalid credentials.')

        self._api_user_id = data['id']
        self._api_user_email = data['user_email']

        return data

    async def get_user_cloud_store(
        self,
        raw_data=False,
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_store)
        if raw_data:
            return resp

        data = resp['data']

        return AnycubicCloudStore.from_json(data)

    async def get_user_cloud_files(
        self,
        printable=None,
        machine_type=None,
        page=1,
        limit=10,
        raw_data=False,
    ):
        params = {
            'page': page,
            'limit': limit,
        }
        if printable is not None:
            params['printable'] = int(printable)
        if machine_type is not None:
            params['machine_type'] = int(machine_type)

        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_files, params=params)
        if raw_data:
            return resp

        data = resp['data']

        if not data:
            return list()

        file_list = list([AnycubicCloudFile.from_json(x) for x in data])

        return file_list

    async def get_user_cloud_files_data_object(
        self,
        printable=None,
        machine_type=None,
        page=1,
        limit=10,
    ):
        file_list = await self.get_user_cloud_files(
            printable=printable,
            machine_type=machine_type,
            page=page,
            limit=limit,
        )

        if not file_list or len(file_list) < 1:
            return None

        file_list = list([
            file.data_object for file in file_list
        ])
        return file_list

    async def fetch_project_gcode_info_fdm(
        self,
        project_id,
        raw_data=False,
    ):
        query = {
            'id': str(project_id),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.project_gcode_info_fdm,
            query=query
        )
        if raw_data:
            return resp

        data = resp['data']

        return AnycubicProject.from_gcode_json(self, data)

    async def delete_file_from_cloud(
        self,
        file_id,
        raw_data=False,
    ):
        params = {
            'idArr': [file_id],
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.delete_cloud_file, params=params)
        if raw_data:
            return resp

        data = resp['data']

        return True if data == '' else False

    #
    #
    # WIP Unused API Calls
    # ------------------------------------------

    async def _get_print_history(self):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.print_history)
        self._log_to_debug(f"print_history output:\n{json.dumps(resp)}")

    async def _get_project_monitor(self, project_id):
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_monitor, query=query)
        self._log_to_debug(f"project_monitor output:\n{json.dumps(resp)}")

    #
    #
    # ORDER Functions
    # ------------------------------------------

    async def _send_anycubic_order(
        self,
        order_request,
        raw_data=False,
    ):
        params = order_request.order_request_data

        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.send_order, params=params)
        if raw_data:
            return resp

        error_message = resp.get('msg') if resp is not None else None

        if resp is None or resp.get('data') is None:
            if resp is not None and resp.get('data') is None and error_message == AnycubicServerMessage.FILE_NOT_FOUND:
                raise AnycubicFileNotFoundError('File not found in cloud.')
            else:
                raise AnycubicAPIError(
                    f"Error sending order to Anycubic Cloud, is the printer online? Message: {error_message}"
                )

        data = resp['data'].get('msgid')

        if data is None:
            self._log_to_error(f"Empty reply when sending order to Anycubic Cloud, message: {error_message}")

        return data

    async def _send_order_multi_color_box_set_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        slot_material_type: str,
        box_id=0,
    ):
        if not printer:
            return

        slot_params = {
            'color': slot_color.data,
            'index': slot_index,
            'type': slot_material_type,
        }

        order_params = {
            'id': box_id,
            'slots': [
                slot_params,
            ]
        }

        order_data = {
            'multi_color_box': [
                order_params,
            ]
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_SET_SLOT,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_box_feed_filament(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        feed_type: int,
        box_id=0,
    ):
        if not printer:
            return

        if feed_type == AnycubicFeedType.Feed and slot_index < 0:
            return

        if feed_type == AnycubicFeedType.Retract:
            slot_index = -1

        feed_params = {
            'slot_index': slot_index,
            'type': feed_type,
        }

        order_params = {
            'id': box_id,
            'feed_status': feed_params
        }

        order_data = {
            'multi_color_box': [
                order_params,
            ]
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.FEED_FILAMENT,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_box_dry(
        self,
        printer,
        order_params,
    ):
        if not printer:
            return

        if not isinstance(order_params, list):
            order_params = [order_params]

        box_list = list()

        for box_id, order in enumerate(order_params):
            box_list.append({
                'drying_status': {
                    'duration': int(order.get('duration', 0)),
                    'remain_time': None,
                    'status': int(order.get('status', 0)),
                    'target_temp': int(order.get('target_temp', 40)),
                },
                'id': int(order.get('box_id', box_id)),
            })

        order_data = {
            'multi_color_box': box_list
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_DRY,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_auto_feed(
        self,
        printer,
        enabled: bool,
        box_id=0,
    ):
        if not printer:
            return

        box_list = list([
            {
                'id': box_id,
                'auto_feed': int(enabled),
            }
        ])

        order_data = {
            'multi_color_box': box_list
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_AUTO_FEED,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_start_print(
        self,
        printer,
        print_request: AnycubicBaseStartPrintRequest,
        ams_box_mapping: AnycubicMaterialMapping | None = None,
    ):
        if not printer:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.START_PRINT,
                printer_id=printer.id,
                project_id=0,
                order_data=print_request.data,
                ams_box_mapping=ams_box_mapping,
                print_settings=None,
            ),
        )

    async def _send_order_pause_print(
        self,
        printer,
        project,
    ):
        if not printer:
            return

        if not project:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.PAUSE_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_resume_print(
        self,
        printer,
        project,
    ):
        if not printer:
            return

        if not project:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.RESUME_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_stop_print(
        self,
        printer,
        project,
    ):
        if not printer:
            return

        if not project:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.STOP_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_change_print_settings(
        self,
        printer,
        print_settings: AnycubicPrintingSettings,
        project=None,
    ):
        if not printer:
            return

        if not project and not printer.latest_project:
            return

        if not project:
            project = printer.latest_project

        project.validate_new_print_settings(print_settings)

        order_data = {
            'settings': print_settings.settings_data
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.PRINT_SETTINGS,
                printer_id=printer.id,
                project_id=project.id,
                order_data=order_data,
            ),
        )

    async def _send_order_list_local_files(
        self,
        printer,
    ):
        """ Response sent via MQTT """
        if not printer:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.LIST_LOCAL_FILES,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_list_udisk_files(
        self,
        printer,
    ):
        """ Response sent via MQTT """
        if not printer:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.LIST_UDISK_FILES,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_delete_local_file(
        self,
        printer,
        file_name: str,
    ):
        """ Response sent via MQTT """
        if not printer:
            return

        order_data = {
            'filename': file_name,
            'filetype': -1,
            'path': '/',
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.DELETE_LOCAL_FILE,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_delete_udisk_file(
        self,
        printer,
        file_name: str,
    ):
        """ Response sent via MQTT """
        if not printer:
            return

        order_data = {
            'filename': file_name,
            'filetype': -1,
            'path': '/',
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.DELETE_UDISK_FILE,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    #
    #
    # WIP Unused ORDER Functions
    # ------------------------------------------

    async def _send_anycubic_camera_open_order(
        self,
        printer,
        raw_data=False,
    ):
        if not printer:
            return

        order_request = AnycubicBaseOrderRequest(
            order_id=int(AnycubicOrderID.CAMERA_OPEN),
            printer_id=printer.id,
        )
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.send_order,
            params=order_request.order_request_data
        )
        if raw_data:
            return resp

        data = resp['data']

        token = AnycubicCameraToken(
            secret_id=data['token']['tmpSecretId'],
            secret_key=data['token']['tmpSecretKey'],
            session_token=data['token']['sessionToken'],
            region=data['token']['region'],
            msg_id=data['msgid'],
        )
        return token

    async def _send_order_multi_color_box_get_info(
        self,
        printer,
    ):
        """
        Response is sent over MQTT.
        """
        if not printer:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_GET_INFO,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_query_peripherals(
        self,
        printer,
    ):
        """
        Response is sent over MQTT.
        """
        if not printer:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.QUERY_PERIPHERALS,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_get_light_status(
        self,
        printer,
        project,
    ):
        """
        Response is sent over MQTT.
        """
        if not printer:
            return

        if not project:
            return

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.GET_LIGHT_STATUS,
                printer_id=printer.id,
                project_id=project.id,
            ),
        )

    async def _send_order_set_light_status(
        self,
        printer,
        project,
        light_on: bool,
        light_type: int = 1,
    ):
        if not printer:
            return

        if not project:
            return

        order_data = {
            'type': light_type,
            'status': 1 if light_on else 0,
            'brightness': 100 if light_on else 0,
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.SET_LIGHT_STATUS,
                printer_id=printer.id,
                project_id=project.id,
                order_data=order_data,
            ),
        )

    async def _send_order_print_local_file(
        self,
        printer,
        file_name: str,
        file_path: str = "",
    ):
        if not printer:
            return

        print_request = AnycubicStartPrintRequestLocal(
            filename=file_name,
            filepath=file_path,
        )

        return await self._send_order_start_print(
            printer=printer,
            print_request=print_request
        )

    #
    #
    # Main API Functions
    # ------------------------------------------

    async def set_printer_name(
        self,
        printer,
        new_name,
    ):
        if not printer:
            return None

        if not new_name or len(str(new_name)) < 1:
            return None

        new_name = str(new_name)

        old_name = printer.name

        resp = await self._set_printer_name(
            printer_id=printer.id,
            new_name=new_name,
        )

        if resp.get('name') == new_name:
            return new_name

        elif resp.get('name') == old_name:
            raise AnycubicAPIError('Failed to change printer name, reverted to previous.')

        else:
            raise AnycubicAPIError('Failed to change printer name, unknown error.')

    async def update_printer_firmware(
        self,
        printer,
    ):
        if not printer:
            return None

        if not printer.fw_version:
            return None

        if not printer.fw_version.update_available:
            return None

        expected_version = printer.fw_version.available_version

        resp = await self._update_printer_firmware(
            printer_id=printer.id,
            current_fw_version=printer.fw_version.firmware_version,
        )

        if resp.get('update_status') == 1:
            return expected_version

        return None

    async def update_printer_multi_color_box_firmware(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        if (
            not printer.multi_color_box_fw_version or
            len(printer.multi_color_box_fw_version) < (box_id + 1)
        ):
            return None

        if (
            not printer.multi_color_box_fw_version[box_id].update_available
        ):
            return None

        expected_version = printer.multi_color_box_fw_version[box_id].available_version

        resp = await self._update_muli_color_box_firmware(
            printer_id=printer.id,
            box_id=box_id,
        )

        target_version = resp.get('target_version')

        if expected_version != target_version:
            return None

        return target_version

    async def update_printer_all_multi_color_box_firmware(
        self,
        printer,
    ):
        if (
            not printer.multi_color_box_fw_version or
            len(printer.multi_color_box_fw_version) < 0
        ):
            return None

        updated_versions = list()

        for x in range(len(printer.multi_color_box_fw_version)):
            resp = await self.update_printer_multi_color_box_firmware(
                printer,
                x
            )
            updated_versions.append(resp)

        return updated_versions

    async def get_latest_cloud_file(
        self
    ):
        cloud_files = await self.get_user_cloud_files(
            printable=True,
            machine_type=0,
        )

        return cloud_files[0]

    async def pause_print(
        self,
        printer,
        project=None,
    ):
        if not printer:
            return

        if not project and not printer.latest_project:
            return

        if not project:
            project = printer.latest_project

        resp = await self._send_order_pause_print(
            printer,
            project,
        )

        return resp

    async def resume_print(
        self,
        printer,
        project=None,
    ):
        if not printer:
            return

        if not project and not printer.latest_project:
            return

        if not project:
            project = printer.latest_project

        resp = await self._send_order_resume_print(
            printer,
            project,
        )

        return resp

    async def cancel_print(
        self,
        printer,
        project=None,
    ):
        if not printer:
            return

        if not project and not printer.latest_project:
            return

        if not project:
            project = printer.latest_project

        resp = await self._send_order_stop_print(
            printer,
            project,
        )

        return resp

    async def multi_color_box_feed_filament(
        self,
        printer,
        slot_index: int,
        box_id=-1,
        finish=False,
    ):
        """
        Must send a finish command when done.
        """
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_box_feed_filament(
            printer=printer,
            slot_index=slot_index,
            feed_type=(
                AnycubicFeedType.Feed
                if not finish else
                AnycubicFeedType.Finish
            ),
            box_id=box_id,
        )

        return resp

    async def multi_color_box_retract_filament(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_box_feed_filament(
            printer=printer,
            slot_index=-1,
            feed_type=AnycubicFeedType.Retract,
            box_id=box_id,
        )

        return resp

    async def multi_color_box_set_auto_feed(
        self,
        printer,
        enabled: bool,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            enabled,
            box_id,
        )

        return resp

    async def multi_color_box_toggle_auto_feed(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        printer.multi_color_box[box_id].set_auto_feed(not current_auto_feed)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            (not current_auto_feed),
            box_id,
        )

        return resp

    async def multi_color_box_switch_on_auto_feed(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        if current_auto_feed:
            return

        printer.multi_color_box[box_id].set_auto_feed(True)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            True,
            box_id,
        )

        return resp

    async def multi_color_box_switch_off_auto_feed(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id < 0:
            box_id = 0

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        if not current_auto_feed:
            return

        printer.multi_color_box[box_id].set_auto_feed(False)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            False,
            box_id,
        )

        return resp

    async def multi_color_box_set_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor | None = None,
        slot_material_type: str = "PLA",
        slot_color_red: int | None = None,
        slot_color_green: int | None = None,
        slot_color_blue: int | None = None,
        box_id=0,
    ):
        if (
            slot_color is None and
            any([x is None for x in [
                slot_color_red,
                slot_color_green,
                slot_color_blue
            ]])
        ):
            raise TypeError(
                "Must use either `slot_color` or "
                "`slot_color_red`, `slot_color_green`, `slot_color_blue`"
            )

        if slot_color is None:
            slot_color = AnycubicMaterialColor(
                slot_color_red,
                slot_color_green,
                slot_color_blue,
            )

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type=slot_material_type,
            box_id=box_id,
        )

    async def multi_color_box_set_pla_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PLA",
            box_id=box_id,
        )

    async def multi_color_box_set_petg_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PETG",
            box_id=box_id,
        )

    async def multi_color_box_set_abs_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="ABS",
            box_id=box_id,
        )

    async def multi_color_box_set_pacf_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PACF",
            box_id=box_id,
        )

    async def multi_color_box_set_pc_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PC",
            box_id=box_id,
        )

    async def multi_color_box_set_asa_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="ASA",
            box_id=box_id,
        )

    async def multi_color_box_set_hips_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="HIPS",
            box_id=box_id,
        )

    async def multi_color_box_set_pa_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PA",
            box_id=box_id,
        )

    async def multi_color_box_set_pla_se_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id=0,
    ):

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PLA SE",
            box_id=box_id,
        )

    async def multi_color_box_drying_start(
        self,
        printer,
        duration,
        target_temp,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        order_params = {
            'duration': duration,
            'target_temp': target_temp,
            'status': 1,
        }
        if box_id > 0:
            order_params['box_id'] = box_id

        resp = await self._send_order_multi_color_box_dry(
            printer,
            order_params,
        )

        return resp

    async def multi_color_box_drying_stop(
        self,
        printer,
        box_id=-1,
    ):
        if not printer:
            return

        if not printer.primary_multi_color_box:
            return

        if box_id >= 0:
            order_params = {
                'status': 0,
            }
        else:
            order_params = [
                {
                    'status': 0
                } for x in range(printer.connected_ace_units)
            ]

        resp = await self._send_order_multi_color_box_dry(
            printer,
            order_params,
        )

        return resp

    async def anycubic_full_available_printer_list(self):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_all)
        data = list([AnycubicPrinter.from_basic_json(self, x) for x in resp['data']['printer_type']])
        return data

    async def list_printers_status(self):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printers_status)
        data = list([AnycubicPrinter.from_status_json(self, x) for x in resp['data']])
        return data

    async def list_my_printers(
        self,
        ignore_init_errors=False,
        raw_data=False,
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_get_printers)
        if raw_data:
            return resp

        data = list([
            AnycubicPrinter.from_status_json(
                self,
                x,
                ignore_init_errors=ignore_init_errors,
            ) for x in resp['data']
        ])
        if ignore_init_errors:
            for x in data:
                if x is None or x.initialisation_error:
                    self._log_to_error(
                        f"Failed to load data for printer list from response: {resp}"
                    )
                    break

        return data

    async def printer_status_for_id(self, printer_id):
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_status, query=query)
        data = resp['data']
        self._log_to_debug(f"printer_status output:\n{json.dumps(data)}")

    async def printer_info_for_id(
        self,
        printer_id,
        update_object=None,
        ignore_init_errors=False,
        raw_data=False,
    ):
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_info, query=query)

        if raw_data:
            return resp

        if update_object is not None:
            update_object.update_from_info_json(resp['data'])
            return None

        try:
            data = AnycubicPrinter.from_info_json(
                self,
                resp['data'],
                ignore_init_errors=ignore_init_errors,
            )

            if ignore_init_errors:
                if data is None or data.initialisation_error:
                    self._log_to_error(
                        f"Failed to load data for printer list from response: {resp}"
                    )
        except Exception as e:
            self._log_to_error(f"Failed to load printer from anycubic response: {resp}")
            raise e

        return data

    async def list_all_projects(
        self,
        raw_data=False
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_get_projects)
        if raw_data:
            return resp

        if resp is None or resp.get('data') is None:
            return list()

        data = list([AnycubicProject.from_list_json(self, x) for x in resp['data']])
        return data

    async def project_info_for_id(
        self,
        project_id,
    ):
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_info, query=query)
        return resp['data']

    async def get_latest_project(
        self,
        printer_id=None,
    ):
        projects = await self.list_all_projects()

        latest_project = None

        if projects and len(projects) > 0:
            for proj in projects:
                # Look for matching project and fill image URL from previous cloud print if available
                if (
                    latest_project is None and
                    (printer_id is None or proj.printer_id == printer_id)
                ):
                    latest_project = proj

                    if latest_project.image_url or not latest_project.name:
                        break

                elif latest_project and proj.name == latest_project.name:
                    if proj.image_url:
                        latest_project.set_image_url(proj.image_url)
                        break

                elif latest_project:
                    break

        if latest_project:
            extra_proj_data = await self.project_info_for_id(latest_project.id)
            latest_project.update_extra_data(extra_proj_data)
        return latest_project

    async def read_material_list_from_gcode_file(
        self,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
    ):
        if (not full_file_path or len(full_file_path) <= 0) and file_bytes is None:
            raise AnycubicAPIError(
                "Cannot parse an empty file path."
            )

        elif (
            (full_file_path and not full_file_path.endswith('.gcode'))
            or
            (file_name and not file_name.endswith('.gcode'))
        ):
            raise AnycubicAPIError(
                "Can only parse gcode files."
            )

        return await async_read_material_list_from_gcode_file(
            full_file_path=full_file_path,
            file_bytes=file_bytes,
        )

    async def upload_file_to_cloud(
        self,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
        temp_file=False,
    ):
        file_upload = AnycubicCloudUpload(
            api_parent=self,
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            is_temp_file=temp_file
        )

        return await file_upload.async_process_upload()

    async def print_with_cloud_file_id(
        self,
        printer,
        cloud_file_id,
        ams_box_mapping=None,
        temp_file=False,
    ):
        if printer is None:
            raise AnycubicErrorMessage.no_printer_to_print

        if ams_box_mapping and not printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_multi_color_box_for_map

        if ams_box_mapping is None and printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_map_for_multi_color_box

        print_request = AnycubicStartPrintRequestCloud(
            file_id=cloud_file_id,
            is_delete_file=temp_file,
        )

        result = None
        try_count = 0

        while result is None and try_count < 3:
            try:
                result = await self._send_order_start_print(
                    printer=printer,
                    print_request=print_request,
                    ams_box_mapping=ams_box_mapping,
                )
            except AnycubicFileNotFoundError:
                await asyncio.sleep(3)

            try_count += 1

        return result

    async def print_with_cloud_gcode_id(
        self,
        printer,
        gcode_id,
        slot_index_list=None,
    ):
        if printer is None:
            raise AnycubicErrorMessage.no_printer_to_print

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_multi_color_box_for_slot_list

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_slot_list_for_multi_color_box

        proj = await self.fetch_project_gcode_info_fdm(gcode_id)

        if slot_index_list is not None:

            material_list = proj.slice_material_info_list

            if not material_list:
                raise AnycubicAPIError('Empty material list in gcode file.')

            if len(slot_index_list) != len(material_list):
                raise AnycubicAPIError(
                    f"{len(slot_index_list)} slots supplied but {len(material_list)} materials found in gcode file."
                )

            ams_box_mapping = printer.build_mapping_for_material_list(
                slot_index_list=slot_index_list,
                material_list=material_list,
            )

        else:
            ams_box_mapping = None

        return await self.print_with_cloud_file_id(
            printer=printer,
            cloud_file_id=proj.id,
            ams_box_mapping=ams_box_mapping,
        )

    async def print_and_upload_save_in_cloud(
        self,
        printer,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
        slot_index_list=None,
    ):
        if printer is None:
            raise AnycubicErrorMessage.no_printer_to_print

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_multi_color_box_for_slot_list

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_slot_list_for_multi_color_box

        cloud_file_id = await self.upload_file_to_cloud(
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
        )
        latest_cloud_file = await self.get_latest_cloud_file()

        if latest_cloud_file.id != cloud_file_id:
            raise AnycubicAPIError('File upload mis-match, cannot print.')

        return await self.print_with_cloud_gcode_id(
            printer=printer,
            gcode_id=latest_cloud_file.gcode_id,
            slot_index_list=slot_index_list,
        )

    async def print_and_upload_no_cloud_save(
        self,
        printer,
        full_file_path=None,
        file_name=None,
        file_bytes=None,
        slot_index_list=None,
    ):
        if printer is None:
            raise AnycubicErrorMessage.no_printer_to_print

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_multi_color_box_for_slot_list

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicErrorMessage.no_slot_list_for_multi_color_box

        if slot_index_list is not None:
            material_list = await self.read_material_list_from_gcode_file(
                full_file_path=full_file_path,
                file_name=file_name,
                file_bytes=file_bytes,
            )

            if not material_list:
                raise AnycubicAPIError('Empty material list read from gcode file.')

            if len(slot_index_list) != len(material_list):
                raise AnycubicAPIError(
                    f"{len(slot_index_list)} slots supplied but {len(material_list)} materials read from gcode file."
                )

            ams_box_mapping = printer.build_mapping_for_material_list(
                slot_index_list=slot_index_list,
                material_list=material_list,
            )

        else:
            ams_box_mapping = None

        cloud_file_id = await self.upload_file_to_cloud(
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            temp_file=True,
        )

        return await self.print_with_cloud_file_id(
            printer=printer,
            cloud_file_id=cloud_file_id,
            ams_box_mapping=ams_box_mapping,
            temp_file=True,
        )
