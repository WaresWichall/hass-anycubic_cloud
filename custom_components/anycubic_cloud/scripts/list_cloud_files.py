import argparse
import asyncio

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Cloud Upload & Print')
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self):
        await self.check_api_tokens()

        cloud_files = await self.get_user_cloud_files(
            printable=True,
            machine_type=0,
        )

        for file in cloud_files:
            self._debug_log(f"File ID: {file.id}, Name: {file.old_filename}, Size: {file.size_mb:.2f}MB")


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
