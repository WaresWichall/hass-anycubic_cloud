import asyncio
import bcrypt
import hashlib
import json
# import logging
import ssl
import traceback
from os import path
from paho.mqtt import client as mqtt_client

from .anycubic_api import (
    AnycubicAPI,
)

from .anycubic_exceptions import (
    AnycubicAPIError,
)

from .anycubic_const_mqtt import (
    MQTT_HOST,
    MQTT_PORT,
    MQTT_ROOT_TOPIC_PLUS,
    MQTT_ROOT_TOPIC_PRINTER,
    MQTT_ROOT_TOPIC_PUBLISH_PRINTER,
    MQTT_ROOT_TOPIC_SERVER,
    MQTT_TIMEOUT,
)

from .anycubic_helpers import (
    get_part_from_mqtt_topic,
)

# DEBUG
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
# DEBUG


class AnycubicMQTTAPI(AnycubicAPI):
    def __init__(
        self,
        *args,
        mqtt_callback_printer_update=None,
        **kwargs,
    ):
        self._api_username = None
        self._api_password = None
        self._auth_sig_token = None
        self._api_user_id = None
        self._mqtt_client = None
        self._mqtt_subscribed_printers = dict()
        self._mqtt_log_all_messages = False
        self._mqtt_connected: asyncio.Event | None = None
        self._mqtt_disconnected: asyncio.Event | None = None
        self._mqtt_callback_printer_update = mqtt_callback_printer_update
        super().__init__(*args, **kwargs)

    @property
    def mqtt_is_started(self):
        return self._mqtt_client is not None

    def set_mqtt_log_all_messages(self, val):
        self._mqtt_log_all_messages = bool(val)

    async def mqtt_wait_for_connect(self):
        if self._mqtt_connected is None:
            return True

        try:
            async with asyncio.timeout(10):
                await self._mqtt_connected.wait()
            self._mqtt_connected = None
            await asyncio.sleep(2)
            return True
        except (asyncio.TimeoutError, asyncio.CancelledError):
            return False

    async def mqtt_wait_for_disconnect(self):
        if self._mqtt_disconnected is None:
            return True

        try:
            async with asyncio.timeout(10):
                await self._mqtt_disconnected.wait()
            self._mqtt_disconnected = None
            return True
        except (asyncio.TimeoutError, asyncio.CancelledError):
            return False

    def _md5_hex_of_string(self, input_string):
        return hashlib.md5(input_string.encode('utf-8')).hexdigest().lower()

    def _build_mqtt_client_id(self):
        username_md5 = self._md5_hex_of_string(self._api_username)
        return username_md5

    def _build_mqtt_login_info(self):
        token_md5 = self._md5_hex_of_string(self._auth_sig_token)
        token_bcrypt = bcrypt.hashpw(token_md5.encode('utf-8'), bcrypt.gensalt())
        username_md5 = self._md5_hex_of_string(self._api_username)
        sig_md5 = self._md5_hex_of_string(f"{username_md5}{token_bcrypt.decode('utf-8')}{username_md5}")
        sig_str = f"user|app|{self._api_username}|{sig_md5}"

        return (sig_str, token_bcrypt.decode('utf-8'))

    def _build_mqtt_printer_subscription(self, printer):
        topic_printer = f"{MQTT_ROOT_TOPIC_PRINTER}{printer.machine_type}/{printer.key}/#"
        topic_plus = f"{MQTT_ROOT_TOPIC_PLUS}{printer.machine_type}/{printer.key}/#"
        return list([topic_printer, topic_plus])

    def _build_mqtt_printer_publish_topic(self, printer, endpoint):
        return f"{MQTT_ROOT_TOPIC_PUBLISH_PRINTER}{printer.machine_type}/{printer.key}/{endpoint}"

    def _build_mqtt_user_subscription(self):
        user_id_md5 = self._md5_hex_of_string(f"{self._api_user_id}")
        root = f"{MQTT_ROOT_TOPIC_SERVER}{self._api_user_id}/{user_id_md5}"
        topic_slice_report = f"{root}/slice/report"
        topic_fdm_slice_report = f"{root}/fdmslice/report"

        return list([topic_slice_report, topic_fdm_slice_report])

    def _mqtt_topic_is_user_topic(self, topic):
        return get_part_from_mqtt_topic(topic, 3) == 'server'

    def _mqtt_message_router(self, message):
        try:
            topic = str(message.topic)
            payload = json.loads(message.payload.decode('utf-8'))
        except Exception as e:
            self._log_to_error(f"Anycubic MQTT Message decode error: {e}\n  on MQTT topic: {message.topic}\n    {message.payload}")
            return

        if self._mqtt_topic_is_user_topic(topic):
            self._log_to_debug(f"Anycubic MQTT USER Msg Received on `{topic}`:\n    {payload}")

        else:
            printer_key = get_part_from_mqtt_topic(topic, 6)

            if get_part_from_mqtt_topic(topic, 7) == 'response' and len(payload.keys()) == 1:
                return

            if printer_key not in self._mqtt_subscribed_printers:
                return

            printer = self._mqtt_subscribed_printers[printer_key]

            try:
                printer.process_mqtt_update(topic, payload)

                if self._mqtt_callback_printer_update:
                    self._mqtt_callback_printer_update()
            except Exception as e:
                tb = traceback.format_exc()
                self._log_to_error(f"Anycubic MQTT Message error: {e}\n  on MQTT topic: {topic}\n    {payload}\n{tb}")

            if self._mqtt_log_all_messages:
                self._log_to_debug(f"Anycubic MQTT Message processed on topic: {topic}\n    {payload}")

    def _mqtt_publish_on_topic(self, topic, payload):
        if self._mqtt_client is None:
            return

        mqtt_payload = json.dumps(payload) if isinstance(payload, dict) else payload

        self._mqtt_client.publish(topic, payload=mqtt_payload)

    def _mqtt_publish_to_printer(self, printer, endpoint, payload):
        mqtt_topic = self._build_mqtt_printer_publish_topic(printer, endpoint)
        self._mqtt_publish_on_topic(mqtt_topic, payload=payload)

    def _mqtt_build_ssl_context(self):
        ssl_root = path.dirname(__file__)

        if 'anycubic_cloud_api' not in ssl_root:
            ssl_root = path.join(ssl_root, 'anycubic_cloud_api')

        crt_path = path.join(ssl_root, 'anycubic_mqqt_tls_client.crt')

        if not path.exists(crt_path):
            self._log_to_error(f"Anycubic MQTT unable to start, no certificate found in root: {ssl_root}.")
            raise AnycubicAPIError('Unable to load MQTT Certificate.')

        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ssl_context.set_ciphers(('ALL:@SECLEVEL=0'),)
        ssl_context.load_cert_chain(
            crt_path,
            path.join(ssl_root, 'anycubic_mqqt_tls_client.key'),
            None,
        )
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        ssl_context.load_verify_locations(path.join(ssl_root, 'anycubic_mqqt_tls_ca.crt'))

        return ssl_context

    def _mqtt_on_subscribe(self, client, userdata, mid, granted_qos):
        if self._mqtt_connected is not None:
            self._mqtt_connected.set()

    def _mqtt_on_message(
        self,
        client,
        userdata,
        message,
    ):
        try:
            self._mqtt_message_router(message)
        except Exception as e:
            tb = traceback.format_exc()
            self._log_to_error(f"Anycubic MQTT internal error: {e}\n{tb}")
            return

    def _mqtt_on_disconnect(
        self,
        client,
        userdata,
        rc,
    ):
        if rc == 0:
            self._mqtt_client = None
            self._log_to_debug("Anycubic MQTT Disconnected.")
            if self._mqtt_disconnected is not None:
                self._mqtt_disconnected.set()
        else:
            self._log_to_debug("Anycubic MQTT unintentionally disconnected, will reconnect.")

    def _mqtt_on_connect(
        self,
        client,
        userdata,
        flags,
        rc,
    ):
        if rc == 0:
            if self._mqtt_connected is None:
                self._mqtt_connected = asyncio.Event()

            self._log_to_debug("Anycubic MQTT Connected.")

            for sub in self._build_mqtt_user_subscription():
                self._log_to_debug(f"Anycubic MQTT Subscribing to USER {sub}.")
                self._mqtt_client.subscribe(sub)

            for printer_id, printer in self._mqtt_subscribed_printers.items():
                self._mqtt_subscribe_printer_status(printer)

            self._log_to_debug("Anycubic MQTT Subscribed.")
        else:
            self._log_to_warn(f"Anycubic MQTT Failed to connect, return code {rc}")

    def connect_mqtt(self):
        self._mqtt_connected = asyncio.Event()
        self._mqtt_disconnected = asyncio.Event()

        mqtt_username, mqtt_password = self._build_mqtt_login_info()

        self._log_to_debug("Anycubic MQTT Connecting.")

        self._mqtt_client = mqtt_client.Client(
            client_id=self._build_mqtt_client_id(),
            clean_session=True,
        )

        self._mqtt_client.on_connect = self._mqtt_on_connect
        self._mqtt_client.on_message = self._mqtt_on_message
        self._mqtt_client.on_subscribe = self._mqtt_on_subscribe

        # DEBUG
        # self._mqtt_client.enable_logger(logger)
        # DEBUG

        self._mqtt_client.username_pw_set(
            username=mqtt_username,
            password=mqtt_password,
        )

        self._mqtt_client.tls_set_context(self._mqtt_build_ssl_context())
        self._mqtt_client.tls_insecure_set(True)

        self._mqtt_client.connect(
            host=MQTT_HOST,
            port=MQTT_PORT,
            keepalive=MQTT_TIMEOUT,
        )

        self._mqtt_client.loop_forever()
        self._mqtt_client = None
        if self._mqtt_disconnected is not None:
            self._mqtt_disconnected.set()
        self._mqtt_connected = None
        self._mqtt_disconnected = None
        self._log_to_debug("Anycubic MQTT Client removed.")

    def disconnect_mqtt(self):
        self._log_to_debug("Anycubic MQTT Disconnecting.")
        if self._mqtt_client is None:
            return

        self._mqtt_client.disconnect()

    def _mqtt_subscribe_printer_status(self, printer):
        for sub in self._build_mqtt_printer_subscription(printer):
            self._log_to_debug(f"Anycubic MQTT Subscribing to PRINTER {sub}.")
            self._mqtt_client.subscribe(sub)

    def mqtt_add_subscribed_printer(self, printer):
        if printer.key in self._mqtt_subscribed_printers:
            return

        self._mqtt_subscribed_printers[printer.key] = printer

    def mqtt_unsubscribe_printer_status(self, printer):

        if printer.key in self._mqtt_subscribed_printers:
            if self._mqtt_client is not None:
                for sub in self._build_mqtt_printer_subscription(printer):
                    self._log_to_debug(f"Anycubic MQTT Ubsubscribing to PRINTER {sub}.")
                    self._mqtt_client.unsubscribe(sub)

            del self._mqtt_subscribed_printers[printer.key]
