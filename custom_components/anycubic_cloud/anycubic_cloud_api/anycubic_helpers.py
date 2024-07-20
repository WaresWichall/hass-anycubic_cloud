import json
import re
import struct
import uuid

from aiofiles import (
    open as aio_file_open,
)


ALPHANUMERIC_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
GCODE_STRING_FIRST_ATTR_LINE = '; filament used'

REX_GCODE_DATA_KEY_VALUE = re.compile(r'; ([a-zA-Z0-9_\[\] ]+) = (.*)$')


def get_part_from_mqtt_topic(topic: str, part: int):
    split_topic = topic.split("/")
    if len(split_topic) < part + 1:
        return None

    return split_topic[part]


def base_62_encode_int(num):
    rounds = 11
    enc_arr = list(['0' for x in range(rounds)])
    while num != -1 and num != 0:
        rounds -= 1
        enc_arr[rounds] = ALPHANUMERIC_CHARS[(61 & num)]
        num = num >> 6
    return "".join(enc_arr)


def generate_fake_device_id():
    return (uuid.uuid1().hex + uuid.uuid1().hex)[:33]


def generate_cookie_state():
    return str(uuid.uuid4())[-11:]


def get_msb_and_lsb_from_bytes(input_bytes):
    return struct.unpack(">qq", input_bytes)


def generate_app_nonce():
    nonce = uuid.uuid1()
    msb, lsb = get_msb_and_lsb_from_bytes(nonce.bytes)
    return base_62_encode_int(msb) + base_62_encode_int(lsb)


def generate_web_nonce():
    return str(uuid.uuid1())


def string_to_int_float(value):
    if value.isdigit():
        value = int(value)
    else:
        try:
            value = float(value)
        except ValueError:
            pass

    return value


def gcode_key_value_pair_to_dict(
    rex,
    data_string,
):
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


async def async_read_slicer_data_from_gcode_file(
    full_file_path,
):
    data_found = False
    file_lines = list()
    slicer_data = dict()

    async with aio_file_open(full_file_path, mode='r') as f:
        file_lines = await f.readlines()

    for line in file_lines:
        if not data_found and line.startswith(GCODE_STRING_FIRST_ATTR_LINE):
            data_found = True
        if not data_found:
            continue
        slicer_data.update(gcode_key_value_pair_to_dict(REX_GCODE_DATA_KEY_VALUE, line))

    return slicer_data


async def async_read_material_list_from_gcode_file(
    full_file_path,
):
    slicer_data = await async_read_slicer_data_from_gcode_file(full_file_path)

    filament_used = slicer_data.get('filament_used_g')
    ams_data = slicer_data.get('paint_info')

    if not ams_data:
        raise ValueError('Cannot load AMS paint info from gcode.')

    if len(filament_used) < 1:
        raise ValueError('Cannot load used filament info from gcode.')

    if len(filament_used) < len(ams_data):
        raise ValueError('Not enough used filament info parsed for AMS data.')

    for paint_info in ams_data:
        paint_index = paint_info['paint_index']
        paint_info['filament_used'] = filament_used[paint_index]

    return ams_data
