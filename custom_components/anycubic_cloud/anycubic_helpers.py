import struct
import uuid


ALPHANUMERIC_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"


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
