from __future__ import annotations

import logging
import sys
from os import path
from typing import Any

import aiohttp

from ..anycubic_cloud_api.anycubic_api import AnycubicMQTTAPI

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.DEBUG)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
LOGGER.addHandler(handler)


class anycubic_api_with_script(AnycubicMQTTAPI):
    def __init__(
        self,
        sys_args: dict[str, Any],
        *args: Any,
        **kwargs: Any,
    ) -> None:
        super().__init__(*args, **kwargs)
        self._debug_logger = LOGGER
        self._args = sys_args
        script_dir_path = path.dirname(path.realpath(__file__))
        self._cached_web_auth_token_path = path.join(script_dir_path, "anycubic_cached_sig_token.token")

    async def script_runner(self) -> None:
        """Execute script."""
        raise NotImplementedError


async def main_mqtt_async(
    api_class: type[anycubic_api_with_script],
    sys_args: dict[str, Any],
) -> None:
    cookie_jar = aiohttp.CookieJar(unsafe=True)
    async with aiohttp.ClientSession(cookie_jar=cookie_jar) as session:
        ac = api_class(
            sys_args,
            session=session,
            cookie_jar=cookie_jar,
        )
        await ac.script_runner()
