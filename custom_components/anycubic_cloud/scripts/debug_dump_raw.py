import argparse
import asyncio
import json
from os import path

from aiofiles import open as aio_file_open

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Debug Dump')
    parser.add_argument(
        '--dump-file',
        help='Path to dump output to.',
        type=str,
        required=True,
    )
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self):
        await self.check_api_tokens()

        if not self._args['dump_file'] or len(self._args['dump_file']) < 1:
            raise Exception('Invalid file path.')

        output_file = path.expanduser(self._args['dump_file'])

        user_info = await self.get_user_info(raw_data=True)
        printer_info = await self.list_my_printers(raw_data=True)
        projects_info = await self.list_all_projects(raw_data=True)
        detailed_printer_info = list()
        if printer_info.get('data') is not None:
            for printer in printer_info['data']:
                printer_id = printer['id']
                detailed_printer_info.append(
                    await self.printer_info_for_id(
                        printer_id,
                        raw_data=True,
                    )
                )

        dump = {
            "user_info": user_info,
            "printer_info": printer_info,
            "projects_info": projects_info,
            "detailed_printer_info": detailed_printer_info,
        }

        json_dump = json.dumps(dump, indent=2)

        async with aio_file_open(output_file, mode='w') as f:
            await f.write(json_dump)

        self._log_to_debug(f"Dumped to {output_file}")


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
