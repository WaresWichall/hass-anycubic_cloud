from __future__ import annotations

import base64
import hashlib
import time
from enum import IntEnum
from os import path
from typing import Any

import bcrypt
from cryptography import x509
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicKey

from ..const.const import (
    AC_KNOWN_AID,
    AC_KNOWN_CID_APP,
    AC_KNOWN_CID_WEB,
    AC_KNOWN_SEC,
    AC_KNOWN_VID_APP,
    AC_KNOWN_VID_SLICER_NEXT,
    AC_KNOWN_VID_WEB,
)
from ..exceptions.error_strings import ErrorsAuth, ErrorsMQTTClient
from ..exceptions.exceptions import AnycubicAuthError, AnycubicMQTTClientError
from ..helpers.helpers import (
    generate_android_app_nonce,
    generate_fake_device_id,
    generate_web_nonce,
    get_mqtt_ssl_path_ca,
    get_ssl_cert_directory,
    md5_hex_of_string,
)


class AnycubicAuthMode(IntEnum):
    WEB = 1
    ANDROID = 2
    SLICER = 3


class AnycubicAuthentication:
    __slots__ = (
        "_auth_token",
        "_auth_mode",
        "_app_id",
        "_app_secret",
        "_app_version",
        "_app_client_id",
        "_device_id",
        "_device_type",
        "_auth_cn",
        "_auth_access_token",
        "_api_user_id",
        "_api_user_email",
    )

    def __init__(
        self,
        auth_token: str | None = None,
        auth_mode: AnycubicAuthMode | None = None,
        device_id: str | None = None,
        auth_access_token: str | None = None,
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
        self._auth_access_token: str | None = auth_access_token
        self._api_user_id: int | None = None
        self._api_user_email: str | None = None
        self._set_app_id()
        self._set_app_secret()
        self._set_version()
        self._set_client_id()
        self._set_device_type()
        self._set_cn()

    @property
    def auth_token(self) -> str:
        if not self._auth_token:
            raise AnycubicAuthError(ErrorsAuth.missing_auth_token)
        return self._auth_token

    @property
    def device_id(self) -> str | None:
        if not self._device_id and self._auth_mode == AnycubicAuthMode.ANDROID:
            self._generate_device_id()
        return self._device_id

    @property
    def api_user_id(self) -> int | None:
        return self._api_user_id

    @property
    def api_user_email(self) -> str | None:
        return self._api_user_email

    @property
    def api_user_identifier(self) -> str:
        return self._api_user_email or str(self._api_user_id)

    @property
    def requires_user_agent(self) -> bool:
        return (
            self._auth_mode == AnycubicAuthMode.WEB
        )

    @property
    def requires_access_token(self) -> bool:
        return (
            self._auth_mode == AnycubicAuthMode.SLICER
            and self._auth_access_token is not None
            and self._auth_token is None
        )

    @property
    def mqtt_app_id(self) -> str:
        if self._auth_mode == AnycubicAuthMode.SLICER:
            return "pcf"
        else:
            return "app"

    @property
    def supports_mqtt_login(self) -> bool:
        return (
            self._auth_mode == AnycubicAuthMode.SLICER
            or self._auth_mode == AnycubicAuthMode.ANDROID
        )

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

    def set_api_user_id(
        self,
        api_user_id: int,
    ) -> None:
        self._api_user_id = int(api_user_id)

    def set_api_user_email(
        self,
        api_user_email: str,
    ) -> None:
        self._api_user_email = api_user_email

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
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            self._auth_cn = '0'
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            self._auth_cn = '1'
        elif self._auth_mode == AnycubicAuthMode.WEB:
            self._auth_cn = '1'

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

    def clear_cached_access_user_token(self) -> bool:
        if (
            self._auth_mode == AnycubicAuthMode.SLICER
            and self._auth_access_token
            and self._auth_token
        ):
            self._auth_token = None
            return True

        return False

    def load_auth_config_from_dict(
        self,
        data: dict[str, Any],
        minimal: bool = False,
    ) -> None:
        if 'auth_token' in data:
            self._auth_token = data['auth_token']
        if 'device_id' in data:
            self._device_id = data['device_id']
        if 'auth_access_token' in data:
            self._auth_access_token = data['auth_access_token']

        if minimal:
            return

        if 'app_client_id' in data:
            self._app_client_id = data['app_client_id']
        if 'app_id' in data:
            self._app_id = data['app_id']
        if 'app_version' in data:
            self._app_version = data['app_version']
        if 'app_secret' in data:
            self._app_secret = data['app_secret']
        if 'auth_mode' in data:
            self._auth_mode = AnycubicAuthMode(data['auth_mode'])

    def get_auth_config_dict(self) -> dict[str, Any]:
        return {
            'app_client_id': self._app_client_id,
            'app_id': self._app_id,
            'app_version': self._app_version,
            'app_secret': self._app_secret,
            'auth_token': self._auth_token,
            'device_id': self._device_id,
            'auth_access_token': self._auth_access_token,
            'auth_mode': self._auth_mode,
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
        params: dict[str, Any] = {}
        if self._auth_mode == AnycubicAuthMode.ANDROID:
            params['device_type'] = 'android'
        elif self._auth_mode == AnycubicAuthMode.SLICER:
            params['device_type'] = 'pcf'
        else:
            params['device_type'] = 'web'

        params['access_token'] = self._auth_access_token

        return params

    def get_user_id_md5_tuple(self) -> tuple[int, str]:
        if not self.api_user_id:
            raise AnycubicAuthError(ErrorsAuth.user_id_md5_tuple_missing_id)
        user_id_md5 = md5_hex_of_string(f"{self.api_user_id}")
        return (
            self.api_user_id,
            user_id_md5,
        )

    def get_mqtt_client_id(self) -> str:
        if not self.api_user_email:
            raise AnycubicMQTTClientError(ErrorsMQTTClient.client_id_missing_email)
        client_id_string = self.api_user_email
        if self._auth_mode == AnycubicAuthMode.SLICER:
            # Slicer adds 'pcf' to the email before md5 hashing
            client_id_string += "pcf"
        return md5_hex_of_string(client_id_string)

    def get_anycubic_ca_public_key(self) -> RSAPublicKey:
        ssl_root = get_ssl_cert_directory()
        ca_path = get_mqtt_ssl_path_ca(ssl_root)

        if not path.exists(ca_path):
            raise AnycubicMQTTClientError(ErrorsMQTTClient.cert_ca_missing)

        with open(ca_path, "rb") as fp:
            pem_data = fp.read()
        cert: x509.Certificate = x509.load_pem_x509_certificate(pem_data)
        public_key = cert.public_key()

        if not isinstance(public_key, RSAPublicKey):
            raise AnycubicMQTTClientError(ErrorsMQTTClient.pub_key_invalid)

        return public_key

    def get_mqtt_token_slicer(self) -> str:
        """ Slicer token string is RSA encrypted with the CA certificate + base64 encoded. """

        public_key = self.get_anycubic_ca_public_key()
        token_bytes = self.auth_token.encode('utf-8')
        encrypted_token = public_key.encrypt(
            token_bytes,
            padding.PKCS1v15(),
        )
        encrypted_token_b64 = base64.b64encode(encrypted_token)

        return encrypted_token_b64.decode('utf-8')

    def get_mqtt_token_android(self) -> str:
        """ Android token string is MD5 hashed + Bcrypt hashed. """
        token_md5 = md5_hex_of_string(self.auth_token)
        token_bcrypt = bcrypt.hashpw(
            token_md5.encode('utf-8'),
            bcrypt.gensalt(),
        )

        return token_bcrypt.decode('utf-8')

    def get_mqtt_token(self) -> str:
        """ Return encrypted self.auth_token as required for MQTT logon. """
        if self._auth_mode == AnycubicAuthMode.SLICER:
            return self.get_mqtt_token_slicer()
        else:
            return self.get_mqtt_token_android()

    def get_mqtt_login_info(self) -> tuple[str, str]:
        mqtt_token = self.get_mqtt_token()
        username_md5 = self.get_mqtt_client_id()

        # Username-Token Sandwich
        user_token_sandwich = "{0}{1}{2}".format(
            username_md5,
            mqtt_token,
            username_md5,
        )
        sig_md5 = md5_hex_of_string(user_token_sandwich)

        sig_str = "{0}|{1}|{2}|{3}".format(
            "user",
            self.mqtt_app_id,
            self.api_user_email,
            sig_md5,
        )

        return (
            sig_str,
            mqtt_token,
        )
