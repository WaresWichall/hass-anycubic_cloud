import logging
import sys
from os import path

import aiohttp

from ..anycubic_cloud_api.anycubic_api_mqtt import AnycubicMQTTAPI

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
LOGGER.addHandler(handler)


class anycubic_api_with_script(AnycubicMQTTAPI):
    def __init__(
        self,
        sys_args,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self._debug_logger = LOGGER
        self._args = sys_args
        script_dir_path = path.dirname(path.realpath(__file__))
        self._cache_sig_token_path = path.join(script_dir_path, "anycubic_cached_sig_token.token")

    async def script_runner(self):
        """Execute script."""
        raise NotImplementedError


async def main_mqtt_async(api_class, sys_args):
    cookie_jar = aiohttp.CookieJar(unsafe=True)
    async with aiohttp.ClientSession(cookie_jar=cookie_jar) as session:
        ac = api_class(
            sys_args,
            session=session,
            cookie_jar=cookie_jar,
        )
        await ac.script_runner()
