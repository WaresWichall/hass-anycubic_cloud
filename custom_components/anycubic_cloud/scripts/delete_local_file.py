from __future__ import annotations

import argparse
import asyncio
from typing import Any

from . import script_base


def get_sys_args() -> dict[str, Any]:
    parser = argparse.ArgumentParser(description='Anycubic Delete Local File')
    parser.add_argument(
        '--printer-id',
        help='Printer ID.',
        type=int,
        required=True,
    )
    parser.add_argument(
        '--filename',
        help='Local filename to delete.',
        type=str,
        required=True,
    )
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self) -> None:
        await self.check_api_tokens()

        if not self._args['filename'] or len(self._args['filename']) < 1:
            raise Exception('Invalid file name.')

        if not self._args['printer_id'] or self._args['printer_id'] < 1:
            raise Exception('Invalid printer ID.')

        printer = await self.printer_info_for_id(self._args['printer_id'])

        if not printer:
            raise Exception('No printer loaded from API.')

        response = await printer.delete_local_file(self._args['filename'])

        self._log_to_debug(f"Success: {response}")


def main() -> None:
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
