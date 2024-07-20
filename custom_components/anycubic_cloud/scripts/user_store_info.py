import argparse
import asyncio

from . import script_base


def get_sys_args():
    parser = argparse.ArgumentParser(description='Anycubic Cloud User Store Info')
    return vars(parser.parse_args())


class anycubic_api_with_script(script_base.anycubic_api_with_script):

    async def script_runner(self):
        await self.check_api_tokens()

        user_store = await self.get_user_cloud_store()

        self._debug_log(user_store)


def main():
    sys_args = get_sys_args()
    asyncio.run(script_base.main_mqtt_async(anycubic_api_with_script, sys_args))


main()
