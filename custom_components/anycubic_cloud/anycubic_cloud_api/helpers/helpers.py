from __future__ import annotations

import hashlib
import json
import re
import struct
import uuid
from datetime import timedelta
from os import path
from typing import Any

ALPHANUMERIC_CHARS: str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
GCODE_STRING_FIRST_ATTR_LINE: str = '; filament used'

REX_GCODE_DATA_KEY_VALUE: re.Pattern[Any] = re.compile(r'; ([a-zA-Z0-9_\[\] ]+) = (.*)$')

REX_PRINT_TOTAL_TIME: re.Pattern[Any] = re.compile(r'^([\d]+)hour([\d]+)min$')


def timedelta_to_total_minutes(
    delta: timedelta,
) -> float:
    return delta.total_seconds() / 60.0


def timedelta_to_total_hours(
    delta: timedelta,
) -> float:
    return delta.total_seconds() / 3600.0


def timedelta_to_dhm_string(
    delta: timedelta,
) -> str:
    days = delta.days
    hours, remain_sec = divmod(delta.seconds, 3600)
    mins = int(remain_sec / 60)

    return f"{days}:{hours}:{mins}"


def hour_min_time_string_to_delta(
    time_string: str,
) -> timedelta:
    match = REX_PRINT_TOTAL_TIME.match(time_string)

    if match:
        hours = int(match.group(1))
        mins = int(match.group(2))

        return timedelta(
            minutes=mins,
            hours=hours,
        )

    raise ValueError("No hour min regex match.")


def int_seconds_string_to_delta(
    time_string: str,
) -> timedelta:
    try:
        total_seconds = int(time_string)
        return timedelta(
            seconds=total_seconds
        )
    except ValueError:
        raise


def float_minutes_string_to_delta(
    time_string: str,
) -> timedelta:
    try:
        minutes = float(time_string)
        total_seconds = int(minutes * 60)
        return timedelta(
            seconds=total_seconds
        )
    except ValueError:
        raise


def time_duration_string_to_delta(
    time_string: str | None,
) -> timedelta:
    if isinstance(time_string, str):
        # try:
        #     return int_seconds_string_to_delta(time_string)
        # except ValueError:
        #     pass

        try:
            return float_minutes_string_to_delta(time_string)
        except ValueError:
            pass

        try:
            return hour_min_time_string_to_delta(time_string)
        except ValueError:
            pass

    return timedelta()


def get_part_from_mqtt_topic(topic: str, part: int) -> str | None:
    split_topic = topic.split("/")
    if len(split_topic) < part + 1:
        return None

    return split_topic[part]


def redact_part_from_mqtt_topic(topic: str, part: int) -> str:
    split_topic = topic.split("/")
    new_chunk = list()
    if len(split_topic) < part + 1:
        return topic

    for idx, chunk in enumerate(split_topic):
        if idx != part:
            new_chunk.append(chunk)
        else:
            new_chunk.append("**REDACTED**")

    return "/".join(new_chunk)


def base_62_encode_int(num: int) -> str:
    rounds = 11
    enc_arr = list(['0' for x in range(rounds)])
    while num != -1 and num != 0:
        rounds -= 1
        enc_arr[rounds] = ALPHANUMERIC_CHARS[(61 & num)]
        num = num >> 6
    return "".join(enc_arr)


def generate_fake_device_id() -> str:
    return (uuid.uuid1().hex + uuid.uuid1().hex)[:33]


def generate_cookie_state() -> str:
    return str(uuid.uuid4())[-11:]


def get_msb_and_lsb_from_bytes(input_bytes: bytes) -> tuple[int, int]:
    return struct.unpack(">qq", input_bytes)


def generate_android_app_nonce() -> str:
    nonce = uuid.uuid1()
    msb, lsb = get_msb_and_lsb_from_bytes(nonce.bytes)
    return base_62_encode_int(msb) + base_62_encode_int(lsb)


def generate_web_nonce() -> str:
    return str(uuid.uuid1())


def string_to_int_float(value: str) -> int | float | str:
    if value.isdigit():
        return int(value)
    else:
        try:
            return float(value)
        except ValueError:
            pass

    return value


def gcode_key_value_pair_to_dict(
    rex: re.Pattern[Any],
    data_string: str,
) -> dict[str, Any]:
    data_key = rex.findall(data_string)

    if not data_key or len(data_key) < 1:
        return {}

    key = data_key[0][0]
    value = data_key[0][1]

    if value in ['begin', 'end']:
        return {}

    for repl in [' ', '[', ']', '(', ')', '__']:
        key = key.replace(repl, '_')

    if key[-1] == '_':
        key = key[:-1]

    try:
        value = json.loads(value)
    except json.decoder.JSONDecodeError:
        if "," in value:
            value = list([string_to_int_float(x.strip()) for x in value.split(',')])

        else:
            value = string_to_int_float(value)

    return {
        key: value
    }


def md5_hex_of_string(
    input_string: str,
) -> str:
    return hashlib.md5(input_string.encode('utf-8')).hexdigest().lower()


def get_ssl_cert_directory() -> str:
    library_root = path.dirname(path.dirname(__file__))

    if 'anycubic_cloud_api' not in library_root:
        library_root = path.join(library_root, 'anycubic_cloud_api')

    ssl_root = path.join(library_root, 'resources')

    return ssl_root


def get_mqtt_ssl_path_ca(
    ssl_root: str,
) -> str:
    return path.join(ssl_root, 'anycubic_mqqt_tls_ca.crt')


def get_mqtt_ssl_path_cert(
    ssl_root: str,
) -> str:
    return path.join(ssl_root, 'anycubic_mqqt_tls_client.crt')


def get_mqtt_ssl_path_key(
    ssl_root: str,
) -> str:
    return path.join(ssl_root, 'anycubic_mqqt_tls_client.key')
