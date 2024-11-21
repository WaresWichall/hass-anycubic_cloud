from __future__ import annotations

import asyncio
import json
import ssl
import traceback
from collections.abc import Callable
from os import path
from typing import TYPE_CHECKING, Any

from paho.mqtt import client as mqtt_client

from ..const.mqtt import (
    MQTT_HOST,
    MQTT_PORT,
    MQTT_ROOT_TOPIC_PLUS,
    MQTT_ROOT_TOPIC_PRINTER,
    MQTT_ROOT_TOPIC_PUBLISH_PRINTER,
    MQTT_ROOT_TOPIC_SERVER,
    MQTT_TIMEOUT,
)
from ..data_models.consumable import AnycubicConsumableData
from ..exceptions.error_strings import ErrorsMQTTClient
from ..exceptions.exceptions import (
    AnycubicMQTTClientError,
    AnycubicMQTTUnhandledData,
    AnycubicMQTTUnknownUpdate,
)
from ..helpers.helpers import (
    get_mqtt_ssl_path_ca,
    get_mqtt_ssl_path_cert,
    get_mqtt_ssl_path_key,
    get_part_from_mqtt_topic,
    get_ssl_cert_directory,
    redact_part_from_mqtt_topic,
)
from .functions import AnycubicAPIFunctions

if TYPE_CHECKING:
    from ..data_models.printer import AnycubicPrinter


class AnycubicMQTTAPI(AnycubicAPIFunctions):
    __slots__ = (
        "_mqtt_client",
        "_mqtt_subscribed_printers",
        "_mqtt_log_all_messages",
        "_mqtt_connected",
        "_mqtt_disconnected",
        "_mqtt_callback_printer_update",
        "_mqtt_callback_printer_busy",
        "_mqtt_callback_subscribed",
    )

    def __init__(
        self,
        *args: Any,
        mqtt_callback_printer_update: Callable[[], None] | None = None,
        mqtt_callback_printer_busy: Callable[[], None] | None = None,
        mqtt_callback_subscribed: Callable[[], None] | None = None,
        **kwargs: Any,
    ) -> None:
        self._mqtt_client: mqtt_client.Client | None = None
        self._mqtt_subscribed_printers: dict[str, AnycubicPrinter] = dict()
        self._mqtt_log_all_messages: bool = False
        self._mqtt_connected: asyncio.Event | None = None
        self._mqtt_disconnected: asyncio.Event | None = None
        self._mqtt_callback_printer_update: Callable[[], None] | None = mqtt_callback_printer_update
        self._mqtt_callback_printer_busy: Callable[[], None] | None = mqtt_callback_printer_busy
        self._mqtt_callback_subscribed: Callable[[], None] | None = mqtt_callback_subscribed
        super().__init__(*args, **kwargs)

    @property
    def mqtt_is_started(self) -> bool:
        return self._mqtt_client is not None

    def set_mqtt_log_all_messages(self, val: bool) -> None:
        self._mqtt_log_all_messages = bool(val)

    async def mqtt_wait_for_connect(self) -> bool:
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

    async def mqtt_wait_for_disconnect(self) -> bool:
        if self._mqtt_disconnected is None:
            return True

        try:
            async with asyncio.timeout(10):
                await self._mqtt_disconnected.wait()
            self._mqtt_disconnected = None
            return True
        except (asyncio.TimeoutError, asyncio.CancelledError):
            return False

    def _build_mqtt_printer_subscription(self, printer: AnycubicPrinter) -> list[str]:
        # topic_slicer = f"{MQTT_ROOT_TOPIC_SLICER}{printer.machine_type}/{printer.key}/#"
        topic_printer = f"{MQTT_ROOT_TOPIC_PRINTER}{printer.machine_type}/{printer.key}/#"
        topic_plus = f"{MQTT_ROOT_TOPIC_PLUS}{printer.machine_type}/{printer.key}/#"
        return list([
            # topic_slicer,
            topic_printer,
            topic_plus
        ])

    def _build_mqtt_printer_publish_topic(self, printer: AnycubicPrinter, endpoint: str) -> str:
        return f"{MQTT_ROOT_TOPIC_PUBLISH_PRINTER}{printer.machine_type}/{printer.key}/{endpoint}"

    def _build_mqtt_user_subscription(self) -> list[str]:
        user_id, user_id_md5 = self.anycubic_auth.get_user_id_md5_tuple()
        root = f"{MQTT_ROOT_TOPIC_SERVER}{user_id}/{user_id_md5}"
        topic_slice_report = f"{root}/slice/report"
        topic_fdm_slice_report = f"{root}/fdmslice/report"

        return list([topic_slice_report, topic_fdm_slice_report])

    def _mqtt_topic_is_user_topic(self, topic: str) -> bool:
        return get_part_from_mqtt_topic(topic, 3) == 'server'

    def _mqtt_message_router(self, message: mqtt_client.MQTTMessage) -> None:
        try:
            topic = str(message.topic)
            payload = json.loads(message.payload.decode('utf-8'))
        except Exception as e:
            self._log_to_error(
                f"Anycubic MQTT Message decode error: {e}\n"
                f"  on MQTT topic: {message.topic}\n"
                f"    {message.payload!r}"
            )
            return

        if self._mqtt_topic_is_user_topic(topic):
            self._log_to_debug(
                f"Anycubic MQTT USER Msg Received on `{topic}`:\n"
                f"    {payload}"
            )

        else:
            printer_key = get_part_from_mqtt_topic(topic, 6)

            if get_part_from_mqtt_topic(topic, 7) == 'response' and len(payload.keys()) == 1:
                return

            if printer_key not in self._mqtt_subscribed_printers:
                return

            printer = self._mqtt_subscribed_printers[printer_key]

            printer_was_available = printer.is_available

            try:
                printer.process_mqtt_update(topic, AnycubicConsumableData(payload))

            except AnycubicMQTTUnhandledData as e:
                redacted_topic = redact_part_from_mqtt_topic(topic, 6)
                self._log_to_warn(
                    f"Anycubic MQTT Message unhandled data in: {e}\n"
                    f"  on MQTT topic: {redacted_topic}\n"
                    f"  with type: {e.unhandled_mqtt_type}, "
                    f"action: {e.unhandled_mqtt_action}, "
                    f"state: {e.unhandled_mqtt_state}\n"
                    f"    unhandled data: {e.unhandled_mqtt_data}"
                )

            except (AnycubicMQTTUnknownUpdate, Exception) as e:
                tb = traceback.format_exc()
                redacted_topic = redact_part_from_mqtt_topic(topic, 6)
                error_type = type(e)
                self._log_to_error(
                    f"Anycubic MQTT Message error: {error_type}: {e}\n"
                    f"  on MQTT topic: {redacted_topic}\n"
                    f"    {payload}\n"
                    f"{tb}"
                )

            try:
                if self._mqtt_callback_printer_update:
                    self._mqtt_callback_printer_update()

                if (
                    self._mqtt_callback_printer_busy and
                    printer_was_available and printer.is_busy
                ):
                    self._mqtt_callback_printer_busy()

            except Exception as e:
                tb = traceback.format_exc()
                self._log_to_error(
                    f"Anycubic MQTT Callback error: {e}\n"
                    f"{tb}"
                )

            if self._mqtt_log_all_messages:
                self._log_to_debug(
                    f"Anycubic MQTT Message processed on topic: {topic}\n"
                    f"    {payload}"
                )

    def _mqtt_publish_on_topic(
        self,
        topic: str,
        payload: dict[str, Any] | str,
    ) -> None:
        if self._mqtt_client is None:
            return

        mqtt_payload = json.dumps(payload) if isinstance(payload, dict) else payload

        self._mqtt_client.publish(topic, payload=mqtt_payload)

    def _mqtt_publish_to_printer(
        self,
        printer: AnycubicPrinter,
        endpoint: str,
        payload: dict[str, Any] | str,
    ) -> None:
        mqtt_topic = self._build_mqtt_printer_publish_topic(printer, endpoint)
        self._mqtt_publish_on_topic(mqtt_topic, payload=payload)

    def _mqtt_build_ssl_context(self) -> ssl.SSLContext:
        ssl_root = get_ssl_cert_directory()

        crt_path = get_mqtt_ssl_path_cert(ssl_root)

        if not path.exists(crt_path):
            self._log_to_error(f"Anycubic MQTT unable to start, no certificate found in root: {ssl_root}.")
            raise AnycubicMQTTClientError(ErrorsMQTTClient.cert_missing)

        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ssl_context.set_ciphers(('ALL:@SECLEVEL=0'),)
        ssl_context.load_cert_chain(
            crt_path,
            get_mqtt_ssl_path_key(ssl_root),
            None,
        )
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        ssl_context.load_verify_locations(get_mqtt_ssl_path_ca(ssl_root))

        return ssl_context

    def _mqtt_on_subscribe(
        self,
        client: mqtt_client.Client,
        userdata: Any,
        mid: int,
        granted_qos: tuple[int],
    ) -> None:
        if self._mqtt_connected is not None:
            self._mqtt_connected.set()

    def _mqtt_on_message(
        self,
        client: mqtt_client.Client,
        userdata: Any,
        message: mqtt_client.MQTTMessage,
    ) -> None:
        try:
            self._mqtt_message_router(message)
        except Exception as e:
            tb = traceback.format_exc()
            self._log_to_error(f"Anycubic MQTT internal error: {e}\n{tb}")
            return

    def _mqtt_on_disconnect(
        self,
        client: mqtt_client.Client,
        userdata: Any,
        rc: int,
    ) -> None:
        if rc == 0:
            self._mqtt_client = None
            self._log_to_debug("Anycubic MQTT Disconnected.")
            if self._mqtt_disconnected is not None:
                self._mqtt_disconnected.set()
        else:
            self._set_mqtt_username_password()
            self._log_to_debug("Anycubic MQTT unintentionally disconnected, will reconnect.")

    def _mqtt_on_connect(
        self,
        client: mqtt_client.Client,
        userdata: Any,
        flags: dict[str, Any],
        rc: int,
    ) -> None:
        if rc == 0:
            if self._mqtt_connected is None:
                self._mqtt_connected = asyncio.Event()

            self._log_to_debug("Anycubic MQTT Connected.")

            if not self._mqtt_client:
                raise AnycubicMQTTClientError(ErrorsMQTTClient.connect_client_missing)

            for sub in self._build_mqtt_user_subscription():
                self._log_to_debug(f"Anycubic MQTT Subscribing to USER {sub}.")
                self._mqtt_client.subscribe(sub)

            for printer_id, printer in self._mqtt_subscribed_printers.items():
                self._mqtt_subscribe_printer_status(printer)

            self._log_to_debug("Anycubic MQTT Subscribed.")

            if (self._mqtt_callback_subscribed):
                self._mqtt_callback_subscribed()
        else:
            self._log_to_warn(f"Anycubic MQTT Failed to connect, return code {rc}")

    def _set_mqtt_username_password(self) -> None:
        mqtt_username, mqtt_password = self.anycubic_auth.get_mqtt_login_info()

        if self._mqtt_client is None:
            return

        self._mqtt_client.username_pw_set(
            username=mqtt_username,
            password=mqtt_password,
        )

    def connect_mqtt(self) -> None:
        self._mqtt_connected = asyncio.Event()
        self._mqtt_disconnected = asyncio.Event()

        self._log_to_debug("Anycubic MQTT Connecting.")

        self._mqtt_client = mqtt_client.Client(
            client_id=self.anycubic_auth.get_mqtt_client_id(),
            clean_session=True,
        )

        self._mqtt_client.on_connect = self._mqtt_on_connect
        self._mqtt_client.on_disconnect = self._mqtt_on_disconnect
        self._mqtt_client.on_message = self._mqtt_on_message
        self._mqtt_client.on_subscribe = self._mqtt_on_subscribe

        self._set_mqtt_username_password()

        self._mqtt_client.tls_set_context(self._mqtt_build_ssl_context())
        self._mqtt_client.tls_insecure_set(True)

        self._mqtt_client.reconnect_delay_set(5)

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

    def disconnect_mqtt(self) -> None:
        self._log_to_debug("Anycubic MQTT Disconnecting.")
        if self._mqtt_client is None:
            return

        self._mqtt_client.disconnect()

    def _mqtt_subscribe_printer_status(self, printer: AnycubicPrinter) -> None:
        if not self._mqtt_client:
            raise AnycubicMQTTClientError(ErrorsMQTTClient.sub_printer_status_client_missing)
        for sub in self._build_mqtt_printer_subscription(printer):
            self._log_to_debug(f"Anycubic MQTT Subscribing to PRINTER {sub}.")
            self._mqtt_client.subscribe(sub)

    def mqtt_add_subscribed_printer(self, printer: AnycubicPrinter) -> None:
        if not printer.key:
            raise AnycubicMQTTClientError(ErrorsMQTTClient.sub_printer_key_missing)

        if printer.key in self._mqtt_subscribed_printers:
            return

        self._mqtt_subscribed_printers[printer.key] = printer

    def mqtt_unsubscribe_printer_status(self, printer: AnycubicPrinter) -> None:

        if printer.key in self._mqtt_subscribed_printers:
            if self._mqtt_client is not None:
                for sub in self._build_mqtt_printer_subscription(printer):
                    self._log_to_debug(f"Anycubic MQTT Ubsubscribing to PRINTER {sub}.")
                    self._mqtt_client.unsubscribe(sub)

            del self._mqtt_subscribed_printers[printer.key]
