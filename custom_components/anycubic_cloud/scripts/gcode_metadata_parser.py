from __future__ import annotations

import argparse
import asyncio
import json
from os import path
from typing import Any

from aiofiles import open as aio_file_open

from ..anycubic_cloud_api.anycubic_data_model_gcode_file import AnycubicGcodeFile
from . import script_base


def get_sys_args() -> dict[str, Any]:
    parser = argparse.ArgumentParser(description='Anycubic GCode metadata parser')
    parser.add_argument(
        '--filepath',
        help='Path to gcode file to parse.',
        type=str,
        required=True,
    )
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self) -> None:
        if not self._args['filepath'] or len(self._args['filepath']) < 1:
            raise Exception('Invalid file path.')

        file_path = path.expanduser(self._args['filepath'])

        path_parts = file_path.rsplit(".", 1)

        if not len(path_parts) == 2 or path_parts[1] != "gcode":
            raise Exception('Must be a .gcode file.')

        gcode_file = await AnycubicGcodeFile.async_read_from_file(
            full_file_path=file_path,
            file_bytes=None,
        )

        output_file = f"{path_parts[0]}.json"

        json_dump = json.dumps(gcode_file.data, indent=2)

        async with aio_file_open(output_file, mode='w') as f:
            await f.write(json_dump)

        self._log_to_debug(
            f"\nDumped gcode metadata to {output_file}\n"
        )


def main() -> None:
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
