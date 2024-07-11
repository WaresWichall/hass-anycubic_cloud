import argparse
import asyncio

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Cloud Upload & Print')
    parser.add_argument(
        '--file-id',
        help='File ID.',
        type=int,
        required=True,
    )
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self):
        await self.check_api_tokens()

        if not self._args['file_id'] or self._args['file_id'] < 1:
            raise Exception('Invalid file ID.')

        response = await self.delete_file_from_cloud(self._args['file_id'])
        self._debug_log(f"Success: {response}")


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
