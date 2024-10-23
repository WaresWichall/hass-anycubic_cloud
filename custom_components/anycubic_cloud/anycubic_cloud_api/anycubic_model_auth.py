from __future__ import annotations

import hashlib
import time
from enum import IntEnum
from typing import Any

from .anycubic_const import (
    AC_KNOWN_AID,
    AC_KNOWN_CID_APP,
    AC_KNOWN_CID_WEB,
    AC_KNOWN_SEC,
    AC_KNOWN_VID_APP,
    AC_KNOWN_VID_SLICER_NEXT,
    AC_KNOWN_VID_WEB,
)
from .anycubic_exceptions import AnycubicAPIError
from .anycubic_helpers import (
    generate_android_app_nonce,
    generate_fake_device_id,
    generate_web_nonce,
)


class AnycubicAuthMode(IntEnum):
    WEB = 1
    ANDROID = 2
    SLICER = 3


class AnycubicAuthentication:
    def __init__(
        self,
        auth_token: str | None = None,
        auth_mode: AnycubicAuthMode | None = None,
        device_id: str | None = None,
    ) -> None:
        self._auth_token: str | None = auth_token
        self._auth_mode: AnycubicAuthMode = auth_mode or AnycubicAuthMode.WEB
        self._app_id: str | None = None
        self._app_secret: str | None = None
        self._app_version: str | None = None
        self._app_client_id: str | None = None
        self._device_id: str | None = device_id
        self._device_type: str | None = None
        self._auth_cn: str | None = None
        self._auth_access_token: str | None = None
        self._set_app_id()
        self._set_app_secret()
        self._set_version()
        self._set_client_id()
        self._set_device_type()
        self._set_cn()

    @property
    def auth_token(self) -> str:
        if not self._auth_token:
            raise AnycubicAPIError('Missing auth token.')
        return self._auth_token

    @property
    def device_id(self) -> str | None:
        if not self._device_id and self._auth_mode == AnycubicAuthMode.ANDROID:
            self._generate_device_id()
        return self._device_id

    def set_auth_token(
        self,
        auth_token: str,
    ) -> None:
        self._auth_token = auth_token

    def set_access_token(
        self,
        access_token: str,
    ) -> None:
        self._auth_access_token = access_token

    def _set_app_id(self) -> None:
        self._app_id = AC_KNOWN_AID

    def _set_app_secret(self) -> None:
        self._app_secret = AC_KNOWN_SEC

    def _set_version(self) -> None:
        if self._auth_mode == AnycubicAuthMode.WEB:
            self._app_version = AC_KNOWN_VID_WEB
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            self._app_version = AC_KNOWN_VID_SLICER_NEXT
        else:
            self._app_version = AC_KNOWN_VID_APP

    def _set_client_id(self) -> None:
        if self._auth_mode == AnycubicAuthMode.WEB:
            self._app_client_id = AC_KNOWN_CID_WEB
        else:
            self._app_client_id = AC_KNOWN_CID_APP

    def _set_device_type(self) -> None:
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            self._device_type = 'android'
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            self._device_type = 'pcf'
        elif self._auth_mode == AnycubicAuthMode.WEB:
            self._device_type = 'web'

    def _set_cn(self) -> None:
        if self._auth_mode == AnycubicAuthMode.WEB:
            self._auth_cn = '1'
        else:
            self._auth_cn = '0'

    def _generate_device_id(self) -> None:
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            self._device_id = generate_fake_device_id()

    def _generate_nonce(self) -> str:
        if self._auth_mode == AnycubicAuthMode.WEB:
            return generate_web_nonce()
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            return generate_web_nonce()
        elif self._auth_mode == AnycubicAuthMode.ANDROID:
            return generate_android_app_nonce()

    def load_vars_from_dict(self, data: dict[str, Any]) -> None:
        if 'app_client_id' in data:
            self._app_client_id = data['app_client_id']
        if 'app_id' in data:
            self._app_id = data['app_id']
        if 'app_version' in data:
            self._app_version = data['app_version']
        if 'app_secret' in data:
            self._app_secret = data['app_secret']
        if 'auth_token' in data:
            self._auth_token = data['auth_token']
        if 'device_id' in data:
            self._device_id = data['device_id']

    def build_token_dict(self) -> dict[str, Any]:
        return {
            'app_client_id': self._app_client_id,
            'app_id': self._app_id,
            'app_version': self._app_version,
            'app_secret': self._app_secret,
            'auth_token': self._auth_token,
            'device_id': self._device_id,
        }

    def get_auth_headers(
        self,
        with_token: bool = False,
    ) -> dict[str, Any]:
        auth_nonce = self._generate_nonce()
        timestamp = int(time.time() * 1e3)
        sig_input = f"{self._app_id}{timestamp}{self._app_version}{self._app_secret}{auth_nonce}{self._app_id}"
        signature = hashlib.md5(sig_input.encode('utf-8'))
        auth_headers = {
            'Xx-Device-Type': self._device_type,
            'Xx-Is-Cn': self._auth_cn,
            'Xx-Nonce': auth_nonce,
            'Xx-Signature': signature.hexdigest(),
            'Xx-Timestamp': str(timestamp),
            'Xx-Version': self._app_version,
            'Content-Type': 'application/json',
        }
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            auth_headers['XX-Device-Id'] = self.device_id
        if with_token:
            auth_headers['XX-Token'] = self._auth_token
            auth_headers['XX-LANGUAGE'] = 'US'

        return auth_headers

    @property
    def auth_access_token_payload(
        self,
    ) -> dict[str, Any]:
        params = {
            'access_token': self._auth_access_token,
        }
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            params['device_type'] = 'android'
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            params['device_type'] = 'pcf'
        else:
            params['device_type'] = 'web'

        print(params)

        return params
