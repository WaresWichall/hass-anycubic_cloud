import aiohttp
import hashlib
import json
import time
import uuid
from os import path

from .anycubic_data_base import (
    AnycubicPrinter,
    AnycubicProject,
)

from .anycubic_api_base import (
    HTTP_METHODS,
    API_ENDPOINT,
    APIAuthTokensExpired,
)

from .anycubic_const import (
    BASE_DOMAIN,
    AUTH_DOMAIN,
    PUBLIC_API_ENDPOINT,
    REX_JS_FILE,
    REX_CLIENT_ID,
    REX_APP_ID,
    REX_APP_VERSION,
    REX_APP_SECRET,
    DEFAULT_USER_AGENT,
)


class AnycubicAPI:
    def __init__(
        self,
        api_username,
        api_password,
        session,
        cookie_jar,
        debug_logger=None,
    ):
        # Cache
        self._cache_key_path = None
        # API
        self.base_url = f"https://{BASE_DOMAIN}/"
        self._public_api_root = f"{self.base_url}{PUBLIC_API_ENDPOINT}"
        # Internal
        self._api_username = api_username
        self._api_password = api_password
        self._session: aiohttp.ClientSession = session
        self._sessionjar = cookie_jar
        self._cookie_state = str(uuid.uuid4())[-11:]
        self._debug_logger = debug_logger
        self._tokens_changed = False
        # ANYCUBIC APP VARS
        self._client_id = None
        self._app_id = None
        self._app_version = None
        self._app_secret = None
        # ANYCUBIC AUTH VARS
        self._login_auth_code = None
        self._auth_access_token = None
        self._auth_sig_token = None
        self._auth_referer = None

    @property
    def tokens_changed(self):
        return self._tokens_changed

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
    ):
        url = base_url
        headers = {**self._web_headers(with_origin=with_origin), **extra_headers}
        if method == HTTP_METHODS.POST:
            data = json.dumps(params) if params is not None else None
            h_coro = self._session.post(url, params=query, data=data, headers=headers)
        else:
            h_coro = self._session.get(url, params=query, headers=headers)
        async with h_coro as resp:
            if is_json:
                resp_data = await resp.json()
            else:
                resp_data = await resp.text()
        if with_response:
            return resp_data, resp
        return resp_data

    async def _fetch_pub_get_resp(self, endpoint, is_json=True):
        return await self._fetch_ext_resp(
            method=HTTP_METHODS.GET,
            base_url=self._build_public_root_url(endpoint),
            is_json=is_json,
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

    async def _extract_current_app_vars(self):
        body = await self._fetch_pub_get_resp("ai", is_json=False)
        js_files = REX_JS_FILE.search(body)
        if js_files is None:
            raise Exception("Could not find js file in source.")
        js_file = js_files.group(1)
        js_body = await self._fetch_pub_get_resp(js_file[1:], is_json=False)

        client_match = REX_CLIENT_ID.search(js_body)
        if client_match is None:
            raise Exception("Could not find client id in js source.")
        self._client_id = client_match.group(1)

        app_id_match = REX_APP_ID.search(js_body)
        if app_id_match is None:
            raise Exception("Could not find app id in js source.")
        self._app_id = app_id_match.group(1)

        app_version_match = REX_APP_VERSION.search(js_body)
        if app_version_match is None:
            raise Exception("Could not find app version in js source.")
        self._app_version = app_version_match.group(1)

        app_secret_match = REX_APP_SECRET.search(js_body)
        if app_secret_match is None:
            raise Exception("Could not find app secret in js source.")
        self._app_secret = app_secret_match.group(1)

        return self._client_id

    async def _init_oauth_session(self):
        query = {
            'clientId': self._client_id,
            'responseType': 'code',
            'redirectUri': self.base_url,
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
            'redirectUri': self.base_url,
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
        self._login_auth_code = resp['data']
        self._debug_log("Successfully logged in.")
        # self._debug_log(resp)

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
        # self._debug_log(_)

    def _build_auth_headers(self, with_token=False):
        auth_nonce = str(uuid.uuid1())
        timestamp = int(time.time() * 1e3)
        sig_input = f"{self._app_id}{timestamp}{self._app_version}{self._app_secret}{auth_nonce}{self._app_id}"
        signature = hashlib.md5(sig_input.encode('utf-8'))
        auth_headers = {
            'Xx-Device-Type': 'web',
            'Xx-Is-Cn': '1',
            'Xx-Nonce': auth_nonce,
            'Xx-Signature': signature.hexdigest(),
            'Xx-Timestamp': str(timestamp),
            'Xx-Version': self._app_version,
            'Content-Type': 'application/json',
        }
        if with_token:
            if self._auth_sig_token is None:
                raise Exception("No sig token.")
            auth_headers['XX-Token'] = self._auth_sig_token
        return auth_headers

    async def _get_oauth_token(self):
        query = {
            'code': self._login_auth_code,
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.oauth_token_url, query=query, with_token=False)
        self._auth_access_token = resp['data']['access_token']
        self._debug_log("Successfully got auth token.")

    async def _get_sig_token(self):
        params = {
            'access_token': self._auth_access_token,
            'device_type': 'web',
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.auth_sig_token, query=None, params=params, with_token=False)
        self._auth_sig_token = resp['data']['token']
        self._debug_log("Successfully got sig token.")

    async def _get_user_store(self):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_store)
        self._debug_log(f"user_store output:\n{json.dumps(resp)}")

    async def get_user_info(
        self,
        raw_data=False
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_info)
        if raw_data:
            return resp

        data = resp['data']
        if data is None:
            raise APIAuthTokensExpired('Invalid credentials.')
        return data

    async def _get_user_files(self):
        params = {
            'page': 1,
            'limit': 10,
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_files, params=params)
        self._debug_log(f"user_files output:\n{json.dumps(resp)}")

    async def _get_print_history(self):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.print_history)
        self._debug_log(f"print_history output:\n{json.dumps(resp)}")

    async def _get_project_monitor(self, project_id):
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_monitor, query=query)
        self._debug_log(f"project_monitor output:\n{json.dumps(resp)}")

    async def _login_retrieve_tokens(self):
        await self._extract_current_app_vars()
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
        }

    def load_tokens_from_dict(self, data):
        self._client_id = data['client_id']
        self._app_id = data['app_id']
        self._app_version = data['app_version']
        self._app_secret = data['app_secret']
        self._auth_access_token = data['auth_access_token']
        self._auth_sig_token = data['auth_sig_token']

    async def _save_main_tokens(self):
        self._tokens_changed = True
        if self._cache_key_path is None:
            return False

        with open(self._cache_key_path, "w") as wo:
            wo.write(json.dumps(self.build_token_dict()))

    async def _load_main_tokens(self):
        if self._cache_key_path is None:
            return False

        if not path.exists(self._cache_key_path):
            return False

        try:

            with open(self._cache_key_path, "r") as wo:
                data = json.load(wo)
            self.load_tokens_from_dict(data)
            return True

        except Exception:
            self._debug_log("No cached tokens found.")
            return False

    # Confirmed API Calls

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
        raw_data=False
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_get_printers)
        if raw_data:
            return resp

        data = list([AnycubicPrinter.from_status_json(self, x) for x in resp['data']])
        return data

    async def printer_status_for_id(self, printer_id):
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_status, query=query)
        data = resp['data']
        self._debug_log(f"printer_status output:\n{json.dumps(data)}")

    async def printer_info_for_id(self, printer_id, update_object=None):
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_info, query=query)

        if update_object is not None:
            update_object.update_from_info_json(resp['data'])
            return None

        data = AnycubicPrinter.from_info_json(self, resp['data'])
        return data

    async def list_all_projects(
        self,
        raw_data=False
    ):
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_get_projects)
        if raw_data:
            return resp

        data = list([AnycubicProject.from_basic_json(self, x) for x in resp['data']])
        return data

    async def project_info_for_id(self, project_id):
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_info, query=query)
        return resp['data']

    async def get_latest_project(self):
        projects = await self.list_all_projects()
        latest_project = projects[0] if projects and len(projects) > 0 else None
        if latest_project:
            extra_proj_data = await self.project_info_for_id(latest_project.id)
            latest_project.update_extra_data(extra_proj_data)
        return latest_project

    # Main Func

    async def check_api_tokens(self):
        all_tokens = [
            self._client_id,
            self._app_id,
            self._app_version,
            self._app_secret,
            self._auth_access_token,
            self._auth_sig_token]
        if not all([x is not None for x in all_tokens]):
            cached_tokens = await self._load_main_tokens()
        else:
            cached_tokens = True
        if cached_tokens:
            try:
                await self.get_user_info()
            except APIAuthTokensExpired:
                cached_tokens = None
                self._debug_log("Tokens expired.")
        if not cached_tokens:
            await self._login_retrieve_tokens()
            await self._save_main_tokens()
        try:
            await self.get_user_info()
        except Exception:
            return False
        return True

    async def update_printer_status(self):
        await self.check_api_tokens()

    def _debug_log(self, msg):
        if self._debug_logger:
            self._debug_logger(msg)
