import argparse
import asyncio
from os import path

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Cloud Direct Print with ACE')
    parser.add_argument(
        '--printer-id',
        help='Printer ID.',
        type=int,
        required=True,
    )
    parser.add_argument(
        '--filepath',
        help='Path to file for upload & print.',
        type=str,
        required=True,
    )
    parser.add_argument(
        '--slots',
        nargs='+',
        type=int,
        help='ACE Slot Numbers to map to print colours.',
        required=True,
    )
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self):
        await self.check_api_tokens()

        if not self._args['filepath'] or len(self._args['filepath']) < 1:
            raise Exception('Invalid file path.')

        file_path = path.expanduser(self._args['filepath'])

        if not self._args['printer_id'] or self._args['printer_id'] < 1:
            raise Exception('Invalid printer ID.')

        printer = await self.printer_info_for_id(self._args['printer_id'])

        if not self._args['slots'] or len(self._args['slots']) < 1:
            raise Exception('No ACE Slots mapped to print.')

        slot_indexes = list([x - 1 for x in self._args['slots']])

        response = await self.print_and_upload_no_cloud_save(
            printer=printer,
            full_file_path=file_path,
            slot_index_list=slot_indexes,
        )
        self._debug_log(f"Success: {response}")


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
