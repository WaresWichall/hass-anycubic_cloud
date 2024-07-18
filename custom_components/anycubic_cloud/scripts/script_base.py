import aiohttp
from os import path

from ..anycubic_cloud_api.anycubic_api_mqtt import AnycubicMQTTAPI
from . import anycubic_credentials


class anycubic_api_with_script(AnycubicMQTTAPI):
    def __init__(
        self,
        sys_args,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)
        self._debug_logger = print
        self._args = sys_args
        script_dir_path = path.dirname(path.realpath(__file__))
        self._cache_key_path = path.join(script_dir_path, "anycubic_cached_tokens.cache")
        self._cache_tokens_path = path.join(script_dir_path, "anycubic_cached_tokens.json")

    async def script_runner(self):
        """Execute script."""
        raise NotImplementedError


async def main_mqtt_async(api_class, sys_args):
    cookie_jar = aiohttp.CookieJar(unsafe=True)
    async with aiohttp.ClientSession(cookie_jar=cookie_jar) as session:
        ac = api_class(
            sys_args,
            api_username=anycubic_credentials.USERNAME,
            api_password=anycubic_credentials.PASSWORD,
            session=session,
            cookie_jar=cookie_jar,
        )
        await ac.script_runner()
