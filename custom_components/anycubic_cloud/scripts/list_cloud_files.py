from __future__ import annotations

import argparse
import asyncio
from typing import Any

from . import script_base


def get_sys_args() -> dict[str, Any]:
    parser = argparse.ArgumentParser(description='Anycubic List Cloud Files')
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self) -> None:
        await self.check_api_tokens()

        cloud_files = await self.get_user_cloud_files(
            printable=True,
            machine_type=0,
        )

        if not cloud_files or len(cloud_files) < 1:
            self._log_to_debug("No files.")
            return

        for file in cloud_files:
            self._log_to_debug(f"File ID: {file.id}, Name: {file.old_filename}, Size: {file.size_mb:.2f}MB")


def main() -> None:
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
