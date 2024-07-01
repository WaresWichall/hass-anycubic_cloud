import aiomqtt
import asyncio
import bcrypt
import hashlib
import json
# import logging
import ssl
import traceback
from os import path

from .anycubic_api import (
    AnycubicAPI,
)

from .anycubic_const_mqtt import (
    MQTT_HOST,
    MQTT_MESSAGE_TIMEOUT,
    MQTT_PORT,
    MQTT_RECONNECT_SECONDS_LONG,
    MQTT_RECONNECT_SECONDS_SHORT,
    MQTT_ROOT_TOPIC_PLUS,
    MQTT_ROOT_TOPIC_PRINTER,
    MQTT_ROOT_TOPIC_PUBLISH_PRINTER,
    MQTT_ROOT_TOPIC_SERVER,
    MQTT_SUBSCRIBE_TIMEOUT,
    MQTT_TIMEOUT,
)

# DEBUG
# logging.basicConfig(level=logging.DEBUG)
# logger = logging.getLogger(__name__)
# DEBUG


class AnycubicMQTTAPI(AnycubicAPI):
    def __init__(
        self,
        *args,
        **kwargs,
    ):
        self._api_username = None
        self._api_password = None
        self._auth_sig_token = None
        self._api_user_id = None
        self._mqtt_client = None
        self._mqtt_subscribed_printers = dict()
        self._mqtt_stopped: asyncio.Event | None = None
        super().__init__(*args, **kwargs)

    @property
    def mqtt_is_connected(self):
        return self._mqtt_stopped is not None

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

    def _mqtt_topic_get_part(self, topic: str, part: int):
        split_topic = topic.split("/")
        if len(split_topic) < part + 1:
            return None

        return split_topic[part]

    def _mqtt_topic_is_user_topic(self, topic):
        return self._mqtt_topic_get_part(topic, 3) == 'server'

    async def _listen_for_mqtt_messages(self):
        if self._mqtt_client is None:
            return

        while self._mqtt_stopped is not None and not self._mqtt_stopped.is_set():
            try:
                async with asyncio.timeout(MQTT_MESSAGE_TIMEOUT):
                    async for message in self._mqtt_client.messages:
                        if self._mqtt_stopped.is_set():
                            return
                        await self._mqtt_message_router(message)
            except (asyncio.TimeoutError, asyncio.CancelledError):
                pass

    async def _mqtt_message_router(self, message):
        topic = str(message.topic)
        payload = json.loads(message.payload.decode('utf-8'))

        if self._mqtt_topic_is_user_topic(topic):
            self._debug_log(f"Anycubic MQTT USER Msg Received on `{topic}`:\n    {payload}")

        else:
            printer_key = self._mqtt_topic_get_part(topic, 6)

            if self._mqtt_topic_get_part(topic, 7) == 'response' and len(payload.keys()) == 1:
                return

            if printer_key not in self._mqtt_subscribed_printers:
                return

            printer = self._mqtt_subscribed_printers[printer_key]

            try:
                printer.process_mqtt_update(topic, payload)
            except Exception as e:
                tb = traceback.format_exc()
                self._debug_log(f"Anycubic MQTT Message error: {e}\n{tb}\nMQTT topic: {topic}\n    {payload}")

    async def _mqtt_publish_on_topic(self, topic, payload):
        if self._mqtt_client is None:
            return

        mqtt_payload = json.dumps(payload) if isinstance(payload, dict) else payload

        await self._mqtt_client.publish(topic, payload=mqtt_payload)

    async def _mqtt_publish_to_printer(self, printer, endpoint, payload):
        mqtt_topic = self._build_mqtt_printer_publish_topic(printer, endpoint)
        await self._mqtt_publish_on_topic(mqtt_topic, payload=payload)

    def _mqtt_build_ssl_context(self):
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ssl_context.set_ciphers(('ALL:@SECLEVEL=0'),)
        ssl_context.load_cert_chain(
            path.join(path.dirname(__file__), 'anycubic_mqqt_tls_client.crt'),
            path.join(path.dirname(__file__), 'anycubic_mqqt_tls_client.key'),
            None,
        )
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        ssl_context.load_verify_locations(path.join(path.dirname(__file__), 'anycubic_mqqt_tls_ca.crt'))

        return ssl_context

    async def async_connect_mqtt(self):
        self._mqtt_stopped = asyncio.Event()
        mqtt_username, mqtt_password = self._build_mqtt_login_info()

        while not self._mqtt_stopped.is_set():
            try:
                self._debug_log("Anycubic MQTT Connecting.")

                async with aiomqtt.Client(
                    # DEBUG
                    # logger=logger,
                    # DEBUG
                    hostname=MQTT_HOST,
                    port=MQTT_PORT,
                    username=mqtt_username,
                    password=mqtt_password,
                    identifier=self._build_mqtt_client_id(),
                    tls_context=self._mqtt_build_ssl_context(),
                    clean_session=True,
                    tls_insecure=True,
                    timeout=MQTT_TIMEOUT,
                    keepalive=MQTT_TIMEOUT,
                ) as client:
                    self._mqtt_client = client
                    self._debug_log("Anycubic MQTT Connected.")

                    for sub in self._build_mqtt_user_subscription():
                        self._debug_log(f"Anycubic MQTT Subscribing to USER {sub}.")
                        await self._mqtt_client.subscribe(sub)

                    for printer_id, printer in self._mqtt_subscribed_printers.items():
                        await self._mqtt_subscribe_printer_status(printer)

                    self._debug_log("Anycubic MQTT Subscribed.")

                    await self._listen_for_mqtt_messages()

            except aiomqtt.exceptions.MqttError:
                if self._mqtt_stopped is not None and not self._mqtt_stopped.is_set():
                    self._mqtt_client = None
                    self._debug_log(f"Anycubic MQTT Connection Error, waiting {MQTT_RECONNECT_SECONDS_SHORT}s to reconnect.")
                    await asyncio.sleep(MQTT_RECONNECT_SECONDS_SHORT)

            except Exception as e:
                tb = traceback.format_exc()
                if self._mqtt_stopped is not None and not self._mqtt_stopped.is_set():
                    self._mqtt_client = None
                    self._debug_log(
                        f"Anycubic MQTT Connection Error: {e} - waiting {MQTT_RECONNECT_SECONDS_LONG}s to reconnect.\n{tb}"
                    )
                    await asyncio.sleep(MQTT_RECONNECT_SECONDS_LONG)

            finally:
                self._mqtt_client = None

        self._mqtt_stopped = None
        self._debug_log("Anycubic MQTT Disconnected.")

    async def async_disconnect_mqtt(self):
        self._debug_log("Anycubic MQTT Disconnecting.")
        if self._mqtt_stopped is not None:
            self._mqtt_stopped.set()

    async def _mqtt_subscribe_printer_status(self, printer):
        for sub in self._build_mqtt_printer_subscription(printer):
            self._debug_log(f"Anycubic MQTT Subscribing to PRINTER {sub}.")
            await self._mqtt_client.subscribe(sub)

    async def mqtt_subscribe_printer_status(self, printer):
        async with asyncio.timeout(MQTT_SUBSCRIBE_TIMEOUT):
            while self._mqtt_client is None:
                await asyncio.sleep(1)

        if self._mqtt_stopped is not None and self._mqtt_stopped.is_set():
            self._mqtt_stopped = asyncio.Event()

        if printer.key in self._mqtt_subscribed_printers:
            return

        self._mqtt_subscribed_printers[printer.key] = printer

        await self._mqtt_subscribe_printer_status(printer)

    async def mqtt_unsubscribe_printer_status(self, printer):

        if printer.key in self._mqtt_subscribed_printers:
            if self._mqtt_client is not None:
                for sub in self._build_mqtt_printer_subscription(printer):
                    self._debug_log(f"Anycubic MQTT Ubsubscribing to PRINTER {sub}.")
                    await self._mqtt_client.unsubscribe(sub)

            del self._mqtt_subscribed_printers[printer.key]
