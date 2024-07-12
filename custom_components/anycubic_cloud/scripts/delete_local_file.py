import argparse
import asyncio

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Cloud Upload & Print')
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

    async def script_runner(self):
        await self.check_api_tokens()

        if not self._args['filename'] or len(self._args['filename']) < 1:
            raise Exception('Invalid file name.')

        if not self._args['printer_id'] or self._args['printer_id'] < 1:
            raise Exception('Invalid printer ID.')

        printer = await self.printer_info_for_id(self._args['printer_id'])

        response = await printer.delete_local_file(self._args['filename'])

        self._debug_log(f"Success: {response}")


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
