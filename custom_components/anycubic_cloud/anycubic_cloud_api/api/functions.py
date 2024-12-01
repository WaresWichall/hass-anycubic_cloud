from __future__ import annotations

import asyncio
import json
from typing import (
    Any,
    Literal,
    overload,
)

from ..const.api_endpoints import API_ENDPOINT
from ..const.const import (
    MAX_PROJECT_IMAGE_SEARCH_COUNT,
    MAX_PROJECT_LIST_RESULTS,
    AnycubicServerMessage,
)
from ..const.enums import (
    AnycubicFeedType,
    AnycubicOrderID,
    AnycubicPrintStatus,
)
from ..data_models.files import AnycubicCloudFile, AnycubicCloudStore
from ..data_models.gcode_file import AnycubicGcodeFile
from ..data_models.orders import (
    AnycubicBaseOrderRequest,
    AnycubicBaseProjectOrderRequest,
    AnycubicBaseStartPrintRequest,
    AnycubicCameraToken,
    AnycubicProjectCtrlOrderRequest,
    AnycubicProjectOrderRequest,
    AnycubicStartPrintRequestCloud,
    AnycubicStartPrintRequestLocal,
)
from ..data_models.print_response import AnycubicPrintResponse
from ..data_models.printer import AnycubicPrinter
from ..data_models.printer_properties import AnycubicMaterialColor, AnycubicMaterialMapping
from ..data_models.printing_settings import AnycubicPrintingSettings
from ..data_models.project import AnycubicProject
from ..exceptions.error_strings import (
    ErrorsAPIParsing,
    ErrorsCloudUpload,
    ErrorsDataParsing,
    ErrorsFileNotFound,
    ErrorsGcodeParsing,
    ErrorsGeneral,
)
from ..exceptions.exceptions import (
    AnycubicAPIError,
    AnycubicAPIParsingError,
    AnycubicCloudUploadError,
    AnycubicDataParsingError,
    AnycubicFileNotFoundError,
    AnycubicGcodeParsingError,
)
from ..models.cloud_upload import AnycubicCloudUpload
from .base import AnycubicAPIBase


class AnycubicAPIFunctions(AnycubicAPIBase):

    #
    #
    # General API Calls
    # ------------------------------------------

    async def _lock_storage_space(
        self,
        file_size: int,
        file_name: str | None,
        is_temp_file: int | bool = 0,
        raw_data: bool = False,
    ) -> dict[str, Any]:
        params = {
            'size': file_size,
            'name': file_name,
            'is_temp_file': int(is_temp_file),
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.lock_storage_space, params=params)
        if raw_data:
            return resp

        data: dict[str, Any] = resp['data']

        return data

    async def _unlock_storage_space(
        self,
        file_id: int,
        is_delete_cos: int | bool = 0,
        raw_data: bool = False,
    ) -> dict[str, Any] | str:
        params = {
            'id': file_id,
            'is_delete_cos': int(is_delete_cos),
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.unlock_storage_space, params=params)
        if raw_data:
            return resp

        data: dict[str, Any] = resp['data']

        return data

    @overload
    async def _claim_file_upload_from_aws(
        self,
        file_id: int,
    ) -> int: ...

    @overload
    async def _claim_file_upload_from_aws(
        self,
        file_id: int,
        raw_data: Literal[True] = ...,
    ) -> dict[str, Any]: ...

    async def _claim_file_upload_from_aws(
        self,
        file_id: int,
        raw_data: bool = False,
    ) -> dict[str, Any] | int:
        params = {
            'user_lock_space_id': file_id,
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.new_file_upload, params=params)
        if raw_data:
            return resp

        if (
            not resp or (
                'data' not in resp
                or not resp['data']
                or 'id' not in resp['data']
            )
        ):
            raise AnycubicCloudUploadError(
                ErrorsCloudUpload.file_claim_failed.format(resp)
            )

        data = resp['data']

        return int(data['id'])

    async def _set_printer_name(
        self,
        printer_id: int,
        new_name: str,
        raw_data: bool = False,
    ) -> dict[str, Any]:
        params = {
            'id': str(printer_id),
            'name': str(new_name),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_update_name,
            params=params
        )
        if raw_data:
            return resp

        data: dict[str, Any] = resp['data']

        return data

    async def _update_printer_firmware(
        self,
        printer_id: int,
        current_fw_version: str,
        raw_data: bool = False,
    ) -> dict[str, Any]:
        query = {
            'id': str(printer_id),
            'target_version': str(current_fw_version),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_firmware_update,
            query=query
        )
        if raw_data:
            return resp

        data: dict[str, Any] = resp['data']

        return data

    async def _update_muli_color_box_firmware(
        self,
        printer_id: int,
        box_id: int,
        raw_data: bool = False,
    ) -> dict[str, Any]:
        params = {
            'id': int(printer_id),
            'box_id': int(box_id),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.printer_multi_color_box_firmware_update,
            params=params,
        )
        if raw_data:
            return resp

        data: dict[str, Any] = resp['data']

        return data

    @overload
    async def get_user_cloud_store(
        self,
    ) -> AnycubicCloudStore | None: ...

    @overload
    async def get_user_cloud_store(
        self,
        raw_data: Literal[True] = ...,
    ) -> dict[str, Any]: ...

    async def get_user_cloud_store(
        self,
        raw_data: bool = False,
    ) -> AnycubicCloudStore | None | dict[str, Any]:
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_store)
        if raw_data:
            return resp

        data = resp['data']

        return AnycubicCloudStore.from_json(data)

    @overload
    async def get_user_cloud_files(
        self,
        printable: int | None = None,
        machine_type: int | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> list[AnycubicCloudFile] | None: ...

    @overload
    async def get_user_cloud_files(
        self,
        printable: int | None = None,
        machine_type: int | None = None,
        page: int = 1,
        limit: int = 10,
        raw_data: Literal[True] = ...,
    ) -> dict[str, Any]: ...

    async def get_user_cloud_files(
        self,
        printable: int | None = None,
        machine_type: int | None = None,
        page: int = 1,
        limit: int = 10,
        raw_data: bool = False,
    ) -> list[AnycubicCloudFile] | None | dict[str, Any]:
        params = {
            'page': page,
            'limit': limit,
        }
        if printable is not None:
            params['printable'] = int(printable)
        if machine_type is not None:
            params['machine_type'] = int(machine_type)

        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.user_files, params=params)
        if raw_data:
            return resp

        data = resp['data']

        if not data:
            return list()

        file_list = list()

        for x in data:
            file = AnycubicCloudFile.from_json(x)
            if file:
                file_list.append(file)
            else:
                raise AnycubicDataParsingError(ErrorsDataParsing.user_cloud_files.format(data))

        return file_list

    async def get_user_cloud_files_data_object(
        self,
        printable: int | None = None,
        machine_type: int | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> list[dict[str, Any]] | None:
        user_files = await self.get_user_cloud_files(
            printable=printable,
            machine_type=machine_type,
            page=page,
            limit=limit,
        )

        if not user_files or len(user_files) < 1:
            return None

        file_list = list([
            file.data_object for file in user_files
        ])
        return file_list

    @overload
    async def fetch_project_gcode_info_fdm(
        self,
        project_id: int,
    ) -> AnycubicProject | None: ...

    @overload
    async def fetch_project_gcode_info_fdm(
        self,
        project_id: int,
        raw_data: Literal[True] = ...,
    ) -> dict[str, Any]: ...

    async def fetch_project_gcode_info_fdm(
        self,
        project_id: int,
        raw_data: bool = False,
    ) -> AnycubicProject | None | dict[str, Any]:
        query = {
            'id': str(project_id),
        }
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.project_gcode_info_fdm,
            query=query
        )
        if raw_data:
            return resp

        data = resp['data']

        return AnycubicProject.from_gcode_json(self, data)

    @overload
    async def delete_file_from_cloud(
        self,
        file_id: int,
    ) -> bool: ...

    @overload
    async def delete_file_from_cloud(
        self,
        file_id: int,
        raw_data: Literal[True] = ...,
    ) -> dict[str, Any]: ...

    async def delete_file_from_cloud(
        self,
        file_id: int,
        raw_data: bool = False,
    ) -> bool | dict[str, Any]:
        params = {
            'idArr': [file_id],
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.delete_cloud_file, params=params)
        if raw_data:
            return resp

        data = resp['data']

        return True if data == '' else False

    #
    #
    # WIP Unused API Calls
    # ------------------------------------------

    async def _get_print_history(self) -> None:
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.print_history)
        self._log_to_debug(f"print_history output:\n{json.dumps(resp)}")

    async def _get_project_monitor(self, project_id: int) -> None:
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_monitor, query=query)
        self._log_to_debug(f"project_monitor output:\n{json.dumps(resp)}")

    #
    #
    # ORDER Functions
    # ------------------------------------------

    @overload
    async def _send_anycubic_order(
        self,
        order_request: AnycubicBaseOrderRequest,
    ) -> str | None: ...

    @overload
    async def _send_anycubic_order(
        self,
        order_request: AnycubicBaseOrderRequest,
        raw_data: Literal[True] = ...
    ) -> dict[str, Any]: ...

    @overload
    async def _send_anycubic_order(
        self,
        order_request: AnycubicBaseOrderRequest,
        raw_data: bool = False,
    ) -> str | None | dict[str, Any]: ...

    async def _send_anycubic_order(
        self,
        order_request: AnycubicBaseOrderRequest,
        raw_data: bool = False,
    ) -> str | None | dict[str, Any]:
        params = order_request.order_request_data

        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.send_order, params=params)
        if raw_data:
            return resp

        error_message = resp.get('msg') if resp is not None else None

        if resp is None or resp.get('data') is None:
            if resp is not None and resp.get('data') is None and error_message == AnycubicServerMessage.FILE_NOT_FOUND:
                raise AnycubicFileNotFoundError(ErrorsFileNotFound.in_cloud)
            else:
                raise AnycubicAPIError(ErrorsGeneral.send_order_fail.format(error_message))

        data: str | None = resp['data'].get('msgid')

        if data is None:
            self._log_to_error(f"Empty reply when sending order to Anycubic Cloud, message: {error_message}")

        return data

    async def _send_order_multi_color_box_set_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        slot_material_type: str,
        box_id: int = 0,
    ) -> str | None:
        if not printer:
            return None

        slot_params = {
            'color': slot_color.data,
            'index': slot_index,
            'type': slot_material_type,
        }

        order_params = {
            'id': box_id,
            'slots': [
                slot_params,
            ]
        }

        order_data = {
            'multi_color_box': [
                order_params,
            ]
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_SET_SLOT,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_box_feed_filament(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        feed_type: int,
        box_id: int = 0,
    ) -> str | None:
        if not printer:
            return None

        if feed_type == AnycubicFeedType.Feed and slot_index < 0:
            return None

        if feed_type == AnycubicFeedType.Retract:
            slot_index = -1

        feed_params = {
            'slot_index': slot_index,
            'type': feed_type,
        }

        order_params = {
            'id': box_id,
            'feed_status': feed_params
        }

        order_data = {
            'multi_color_box': [
                order_params,
            ]
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.FEED_FILAMENT,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_box_dry(
        self,
        printer: AnycubicPrinter,
        order_params: dict[str, Any] | list[dict[str, Any]],
    ) -> str | None:
        if not printer:
            return None

        if not isinstance(order_params, list):
            order_params = [order_params]

        box_list = list()

        for box_id, order in enumerate(order_params):
            box_list.append({
                'drying_status': {
                    'duration': int(order.get('duration', 0)),
                    'remain_time': None,
                    'status': int(order.get('status', 0)),
                    'target_temp': int(order.get('target_temp', 40)),
                },
                'id': int(order.get('box_id', box_id)),
            })

        order_data = {
            'multi_color_box': box_list
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_DRY,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_multi_color_auto_feed(
        self,
        printer: AnycubicPrinter,
        enabled: bool,
        box_id: int = 0,
    ) -> str | None:
        if not printer:
            return None

        box_list = list([
            {
                'id': box_id,
                'auto_feed': int(enabled),
            }
        ])

        order_data = {
            'multi_color_box': box_list
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_AUTO_FEED,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_start_print(
        self,
        printer: AnycubicPrinter,
        print_request: AnycubicBaseStartPrintRequest,
        ams_box_mapping: list[AnycubicMaterialMapping] | None = None,
    ) -> str | None:
        if not printer:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.START_PRINT,
                printer_id=printer.id,
                project_id=0,
                order_data=print_request.data,
                ams_box_mapping=ams_box_mapping,
                print_settings=None,
            ),
        )

    async def _send_order_pause_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject,
    ) -> str | None:
        if not printer:
            return None

        if not project:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.PAUSE_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_resume_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject,
    ) -> str | None:
        if not printer:
            return None

        if not project:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.RESUME_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_stop_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject,
    ) -> str | None:
        if not printer:
            return None

        if not project:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectCtrlOrderRequest(
                order_id=AnycubicOrderID.STOP_PRINT,
                printer_id=printer.id,
                project_id=project.id,
                order_data=None,
                ams_box_mapping=None,
                print_settings=None,
            ),
        )

    async def _send_order_change_print_settings(
        self,
        printer: AnycubicPrinter,
        print_settings: AnycubicPrintingSettings,
        project: AnycubicProject | None = None,
    ) -> str | None:
        if not printer:
            return None

        if not project and not printer.latest_project:
            return None

        if not project:
            project = printer.latest_project

        assert project

        project.validate_new_print_settings(print_settings)

        order_data = {
            'settings': print_settings.settings_data
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.PRINT_SETTINGS,
                printer_id=printer.id,
                project_id=project.id,
                order_data=order_data,
            ),
        )

    async def _send_order_list_local_files(
        self,
        printer: AnycubicPrinter,
    ) -> str | None:
        """ Response sent via MQTT """
        if not printer:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.LIST_LOCAL_FILES,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_list_udisk_files(
        self,
        printer: AnycubicPrinter,
    ) -> str | None:
        """ Response sent via MQTT """
        if not printer:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.LIST_UDISK_FILES,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_delete_local_file(
        self,
        printer: AnycubicPrinter,
        file_name: str,
    ) -> str | None:
        """ Response sent via MQTT """
        if not printer:
            return None

        order_data = {
            'filename': file_name,
            'filetype': -1,
            'path': '/',
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.DELETE_LOCAL_FILE,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_delete_udisk_file(
        self,
        printer: AnycubicPrinter,
        file_name: str,
    ) -> str | None:
        """ Response sent via MQTT """
        if not printer:
            return None

        order_data = {
            'filename': file_name,
            'filetype': -1,
            'path': '/',
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.DELETE_UDISK_FILE,
                printer_id=printer.id,
                project_id=0,
                order_data=order_data,
            ),
        )

    async def _send_order_query_peripherals(
        self,
        printer: AnycubicPrinter,
    ) -> str | None:
        """
        Response is sent over MQTT.
        """
        if not printer:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.QUERY_PERIPHERALS,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_get_light_status(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject,
    ) -> str | None:
        """
        Response is sent over MQTT.
        """
        if not printer:
            return None

        if not project:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.GET_LIGHT_STATUS,
                printer_id=printer.id,
                project_id=project.id,
            ),
        )

    #
    #
    # WIP Unused ORDER Functions
    # ------------------------------------------

    async def _send_anycubic_camera_open_order(
        self,
        printer: AnycubicPrinter,
        raw_data: bool = False,
    ) -> AnycubicCameraToken | None | dict[str, Any]:
        if not printer:
            return None

        order_request = AnycubicBaseOrderRequest(
            order_id=int(AnycubicOrderID.CAMERA_OPEN),
            printer_id=printer.id,
        )
        resp = await self._fetch_api_resp(
            endpoint=API_ENDPOINT.send_order,
            params=order_request.order_request_data
        )
        if raw_data:
            return resp

        data = resp['data']

        token = AnycubicCameraToken(
            secret_id=data['token']['tmpSecretId'],
            secret_key=data['token']['tmpSecretKey'],
            session_token=data['token']['sessionToken'],
            region=data['token']['region'],
            msg_id=data['msgid'],
        )
        return token

    async def _send_order_multi_color_box_get_info(
        self,
        printer: AnycubicPrinter,
    ) -> str | None:
        """
        Response is sent over MQTT.
        """
        if not printer:
            return None

        return await self._send_anycubic_order(
            order_request=AnycubicBaseProjectOrderRequest(
                order_id=AnycubicOrderID.MULTI_COLOR_BOX_GET_INFO,
                printer_id=printer.id,
                project_id=0,
            ),
        )

    async def _send_order_set_light_status(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject,
        light_on: bool,
        light_type: int = 1,
    ) -> str | None:
        if not printer:
            return None

        if not project:
            return None

        order_data = {
            'type': light_type,
            'status': 1 if light_on else 0,
            'brightness': 100 if light_on else 0,
        }

        return await self._send_anycubic_order(
            order_request=AnycubicProjectOrderRequest(
                order_id=AnycubicOrderID.SET_LIGHT_STATUS,
                printer_id=printer.id,
                project_id=project.id,
                order_data=order_data,
            ),
        )

    async def _send_order_print_local_file(
        self,
        printer: AnycubicPrinter,
        file_name: str,
        file_path: str = "",
    ) -> str | None:
        if not printer:
            return None

        print_request = AnycubicStartPrintRequestLocal(
            filename=file_name,
            filepath=file_path,
        )

        return await self._send_order_start_print(
            printer=printer,
            print_request=print_request
        )

    #
    #
    # Main API Functions
    # ------------------------------------------

    async def set_printer_name(
        self,
        printer: AnycubicPrinter,
        new_name: str,
    ) -> str | None:
        if not printer:
            return None

        if not new_name or len(str(new_name)) < 1:
            return None

        new_name = str(new_name)

        old_name = printer.name

        resp = await self._set_printer_name(
            printer_id=printer.id,
            new_name=new_name,
        )

        if resp.get('name') == new_name:
            return new_name

        elif resp.get('name') == old_name:
            raise AnycubicAPIError(ErrorsGeneral.name_change_fail_revert)

        else:
            raise AnycubicAPIError(ErrorsGeneral.name_change_fail_unknown)

    async def update_printer_firmware(
        self,
        printer: AnycubicPrinter,
    ) -> str | None:
        if not printer:
            return None

        if not printer.fw_version:
            return None

        if not printer.fw_version.update_available:
            return None

        expected_version = printer.fw_version.available_version

        resp = await self._update_printer_firmware(
            printer_id=printer.id,
            current_fw_version=printer.fw_version.firmware_version,
        )

        if resp.get('update_status') == 1:
            return expected_version

        return None

    async def update_printer_multi_color_box_firmware(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        if (
            not printer.multi_color_box_fw_version or
            len(printer.multi_color_box_fw_version) < (box_id + 1)
        ):
            return None

        if (
            not printer.multi_color_box_fw_version[box_id].update_available
        ):
            return None

        expected_version = printer.multi_color_box_fw_version[box_id].available_version

        resp = await self._update_muli_color_box_firmware(
            printer_id=printer.id,
            box_id=box_id,
        )

        target_version = resp.get('target_version')

        if expected_version != target_version:
            return None

        return target_version

    async def update_printer_all_multi_color_box_firmware(
        self,
        printer: AnycubicPrinter,
    ) -> list[str | None] | None:
        if (
            not printer.multi_color_box_fw_version or
            len(printer.multi_color_box_fw_version) < 0
        ):
            return None

        updated_versions = list()

        for x in range(len(printer.multi_color_box_fw_version)):
            resp = await self.update_printer_multi_color_box_firmware(
                printer,
                x
            )
            updated_versions.append(resp)

        return updated_versions

    async def get_latest_cloud_file(
        self,
    ) -> AnycubicCloudFile | None:
        cloud_files = await self.get_user_cloud_files(
            printable=True,
            machine_type=0,
        )

        return cloud_files[0] if cloud_files and len(cloud_files) > 0 else None

    async def pause_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject | None = None,
    ) -> str | None:
        if not printer:
            return None

        if not project and not printer.latest_project:
            return None

        if not project:
            project = printer.latest_project

        assert project

        resp = await self._send_order_pause_print(
            printer,
            project,
        )

        return resp

    async def resume_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject | None = None,
    ) -> str | None:
        if not printer:
            return None

        if not project and not printer.latest_project:
            return None

        if not project:
            project = printer.latest_project

        assert project

        resp = await self._send_order_resume_print(
            printer,
            project,
        )

        return resp

    async def cancel_print(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject | None = None,
    ) -> str | None:
        if not printer:
            return None

        if not project and not printer.latest_project:
            return None

        if not project:
            project = printer.latest_project

        assert project

        resp = await self._send_order_stop_print(
            printer,
            project,
        )

        return resp

    async def multi_color_box_feed_filament(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        box_id: int = -1,
        finish: bool = False,
    ) -> str | None:
        """
        Must send a finish command when done.
        """
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_box_feed_filament(
            printer=printer,
            slot_index=slot_index,
            feed_type=(
                AnycubicFeedType.Feed
                if not finish else
                AnycubicFeedType.Finish
            ),
            box_id=box_id,
        )

        return resp

    async def multi_color_box_retract_filament(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_box_feed_filament(
            printer=printer,
            slot_index=-1,
            feed_type=AnycubicFeedType.Retract,
            box_id=box_id,
        )

        return resp

    async def multi_color_box_set_auto_feed(
        self,
        printer: AnycubicPrinter,
        enabled: bool,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            enabled,
            box_id,
        )

        return resp

    async def multi_color_box_toggle_auto_feed(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        assert printer.multi_color_box

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        printer.multi_color_box[box_id].set_auto_feed(not current_auto_feed)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            (not current_auto_feed),
            box_id,
        )

        return resp

    async def multi_color_box_switch_on_auto_feed(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        assert printer.multi_color_box

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        if current_auto_feed:
            return None

        printer.multi_color_box[box_id].set_auto_feed(True)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            True,
            box_id,
        )

        return resp

    async def multi_color_box_switch_off_auto_feed(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id < 0:
            box_id = 0

        assert printer.multi_color_box

        current_auto_feed = bool(printer.multi_color_box[box_id].auto_feed)

        if not current_auto_feed:
            return None

        printer.multi_color_box[box_id].set_auto_feed(False)

        resp = await self._send_order_multi_color_auto_feed(
            printer,
            False,
            box_id,
        )

        return resp

    async def multi_color_box_set_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor | None = None,
        slot_material_type: str = "PLA",
        slot_color_red: int | None = None,
        slot_color_green: int | None = None,
        slot_color_blue: int | None = None,
        box_id: int = 0,
    ) -> str | None:
        if (
            slot_color is None and
            any([x is None for x in [
                slot_color_red,
                slot_color_green,
                slot_color_blue
            ]])
        ):
            raise AnycubicAPIError(ErrorsGeneral.set_slot_color_invalid)

        if slot_color is None:
            assert slot_color_red
            assert slot_color_green
            assert slot_color_blue
            slot_color = AnycubicMaterialColor(
                slot_color_red,
                slot_color_green,
                slot_color_blue,
            )

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type=slot_material_type,
            box_id=box_id,
        )

    async def multi_color_box_set_pla_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PLA",
            box_id=box_id,
        )

    async def multi_color_box_set_petg_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PETG",
            box_id=box_id,
        )

    async def multi_color_box_set_abs_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="ABS",
            box_id=box_id,
        )

    async def multi_color_box_set_pacf_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PACF",
            box_id=box_id,
        )

    async def multi_color_box_set_pc_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PC",
            box_id=box_id,
        )

    async def multi_color_box_set_asa_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="ASA",
            box_id=box_id,
        )

    async def multi_color_box_set_hips_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="HIPS",
            box_id=box_id,
        )

    async def multi_color_box_set_pa_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PA",
            box_id=box_id,
        )

    async def multi_color_box_set_pla_se_slot(
        self,
        printer: AnycubicPrinter,
        slot_index: int,
        slot_color: AnycubicMaterialColor,
        box_id: int = 0,
    ) -> str | None:

        return await self._send_order_multi_color_box_set_slot(
            printer=printer,
            slot_index=slot_index,
            slot_color=slot_color,
            slot_material_type="PLA SE",
            box_id=box_id,
        )

    async def multi_color_box_drying_start(
        self,
        printer: AnycubicPrinter,
        duration: int,
        target_temp: int,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        order_params = {
            'duration': duration,
            'target_temp': target_temp,
            'status': 1,
        }
        if box_id > 0:
            order_params['box_id'] = box_id

        resp = await self._send_order_multi_color_box_dry(
            printer,
            order_params,
        )

        return resp

    async def multi_color_box_drying_stop(
        self,
        printer: AnycubicPrinter,
        box_id: int = -1,
    ) -> str | None:
        if not printer:
            return None

        if not printer.primary_multi_color_box:
            return None

        if box_id >= 0:
            order_params: list[dict[str, Any]] | dict[str, Any] = {
                'status': 0,
            }
        else:
            order_params = [
                {
                    'status': 0
                } for x in range(printer.connected_ace_units)
            ]

        resp = await self._send_order_multi_color_box_dry(
            printer,
            order_params,
        )

        return resp

    async def anycubic_full_available_printer_list(
        self,
    ) -> list[AnycubicPrinter]:
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_all)
        data = list([AnycubicPrinter.from_basic_json(self, x) for x in resp['data']['printer_type']])
        return data

    async def list_printers_status(
        self,
    ) -> list[AnycubicPrinter]:
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printers_status)
        data = list([AnycubicPrinter.from_status_json(self, x) for x in resp['data']])
        return data

    @overload
    async def list_my_printers(
        self,
        ignore_init_errors: bool = False,
    ) -> list[AnycubicPrinter]: ...

    @overload
    async def list_my_printers(
        self,
        ignore_init_errors: bool = False,
        raw_data: Literal[True] = ...
    ) -> dict[str, Any]: ...

    async def list_my_printers(
        self,
        ignore_init_errors: bool = False,
        raw_data: bool = False,
    ) -> list[AnycubicPrinter] | dict[str, Any]:
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_get_printers)
        if raw_data:
            return resp

        data = list([
            AnycubicPrinter.from_status_json(
                self,
                x,
                ignore_init_errors=ignore_init_errors,
            ) for x in resp['data']
        ])
        if ignore_init_errors:
            for x in data:
                if x is None or x.initialisation_error:
                    self._log_to_error(
                        f"Failed to load data for printer list from response: {resp}"
                    )
                    break

        return data

    async def printer_status_for_id(
        self,
        printer_id: int,
    ) -> None:
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_status, query=query)
        data = resp['data']
        self._log_to_debug(f"printer_status output:\n{json.dumps(data)}")

    @overload
    async def printer_info_for_id(
        self,
        printer_id: int,
        update_object: AnycubicPrinter | None = None,
        ignore_init_errors: bool = False,
    ) -> AnycubicPrinter | None: ...

    @overload
    async def printer_info_for_id(
        self,
        printer_id: int,
        update_object: AnycubicPrinter | None = None,
        ignore_init_errors: bool = False,
        raw_data: Literal[True] = ...
    ) -> dict[str, Any]: ...

    async def printer_info_for_id(
        self,
        printer_id: int,
        update_object: AnycubicPrinter | None = None,
        ignore_init_errors: bool = False,
        raw_data: bool = False,
    ) -> AnycubicPrinter | None | dict[str, Any]:
        query = {
            'id': str(printer_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.printer_info, query=query)

        if raw_data:
            return resp

        if update_object is not None:
            update_object.update_from_info_json(resp['data'])
            return None

        try:
            data = AnycubicPrinter.from_info_json(
                self,
                resp['data'],
                ignore_init_errors=ignore_init_errors,
            )

            if ignore_init_errors:
                if data is None or data.initialisation_error:
                    self._log_to_error(
                        f"Failed to load data for printer list from response: {resp}"
                    )
        except Exception as e:
            if resp and (
                resp_msg := resp.get('msg')
            ):
                if resp_msg == 'request error':
                    raise AnycubicAPIParsingError(ErrorsAPIParsing.api_error_rate_limited)

            self._log_to_error(f"Failed to load printer from anycubic response: {resp}")
            raise e

        return data

    @overload
    async def list_all_projects(
        self,
        page: int = 1,
        print_status: AnycubicPrintStatus | None = None,
    ) -> list[AnycubicProject]: ...

    @overload
    async def list_all_projects(
        self,
        page: int = 1,
        print_status: AnycubicPrintStatus | None = None,
        raw_data: Literal[True] = ...
    ) -> dict[str, Any]: ...

    async def list_all_projects(
        self,
        page: int = 1,
        print_status: AnycubicPrintStatus | None = None,
        raw_data: bool = False
    ) -> list[AnycubicProject] | dict[str, Any]:
        query = {
            'page': str(int(page)),
            'limit': MAX_PROJECT_LIST_RESULTS,
        }
        if print_status is not None:
            query['print_status'] = str(int(print_status))

        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_get_projects, query=query)
        if raw_data:
            return resp

        if resp is None or resp.get('data') is None:
            return list()

        proj_list = list()
        for x in resp['data']:
            proj = AnycubicProject.from_list_json(self, x)
            if proj:
                proj_list.append(proj)
            else:
                raise AnycubicDataParsingError(ErrorsDataParsing.projects.format(resp['data']))

        return proj_list

    async def project_info_for_id(
        self,
        project_id: int,
    ) -> dict[str, Any]:
        query = {
            'id': str(project_id)
        }
        resp = await self._fetch_api_resp(endpoint=API_ENDPOINT.project_info, query=query)
        data: dict[str, Any] = resp['data']
        return data

    async def get_latest_project(
        self,
        printer_id: int | None = None,
        project_to_update: AnycubicProject | None = None,
    ) -> AnycubicProject | None:
        projects = await self.list_all_projects()

        latest_project = None

        image_search_counter = 0

        if projects and len(projects) > 0:
            for proj in projects:
                # Look for matching project and fill image URL from previous cloud print if available
                if (
                    latest_project is None and
                    (printer_id is None or proj.printer_id == printer_id)
                ):
                    if project_to_update and project_to_update.update_with_project(proj):
                        latest_project = project_to_update
                    else:
                        latest_project = proj

                    if latest_project.image_url or not latest_project.name:
                        break

                elif latest_project and image_search_counter < MAX_PROJECT_IMAGE_SEARCH_COUNT:
                    image_search_counter += 1

                    if proj.name == latest_project.name and proj.image_url:
                        latest_project.set_image_url(proj.image_url)
                        break

                elif latest_project:
                    break

        if latest_project:
            extra_proj_data = await self.project_info_for_id(latest_project.id)
            latest_project.update_extra_data(extra_proj_data)
        return latest_project

    async def read_gcode_file(
        self,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
    ) -> AnycubicGcodeFile:
        if (not full_file_path or len(full_file_path) <= 0) and file_bytes is None:
            raise AnycubicGcodeParsingError(ErrorsGcodeParsing.invalid_path)

        elif (
            (full_file_path and not full_file_path.endswith('.gcode'))
            or
            (file_name and not file_name.endswith('.gcode'))
        ):
            raise AnycubicGcodeParsingError(ErrorsGcodeParsing.invalid_ext)

        return await AnycubicGcodeFile.async_read_from_file(
            full_file_path=full_file_path,
            file_bytes=file_bytes,
        )

    async def upload_file_to_cloud(
        self,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        temp_file: bool = False,
    ) -> int:
        file_upload = AnycubicCloudUpload(
            api_parent=self,
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            is_temp_file=temp_file
        )

        return await file_upload.async_process_upload()

    async def print_with_cloud_file_id(
        self,
        printer: AnycubicPrinter,
        cloud_file_id: int,
        ams_box_mapping: list[AnycubicMaterialMapping] | None = None,
        temp_file: bool = False,
    ) -> str | None:
        if printer is None:
            raise AnycubicAPIError(ErrorsGeneral.no_printer_to_print)

        if ams_box_mapping and not printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_ace_for_map)

        if ams_box_mapping is None and printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_map_for_ace)

        print_request = AnycubicStartPrintRequestCloud(
            file_id=cloud_file_id,
            is_delete_file=temp_file,
        )

        result = None
        try_count = 0

        while result is None and try_count < 3:
            try:
                result = await self._send_order_start_print(
                    printer=printer,
                    print_request=print_request,
                    ams_box_mapping=ams_box_mapping,
                )
            except AnycubicFileNotFoundError:
                await asyncio.sleep(3)

            try_count += 1

        return result

    async def print_with_cloud_gcode_id(
        self,
        printer: AnycubicPrinter,
        gcode_id: int,
        slot_index_list: list[int] | None = None,
        file_name: str | None = None,
    ) -> AnycubicPrintResponse:
        if printer is None:
            raise AnycubicAPIError(ErrorsGeneral.no_printer_to_print)

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_ace_for_slot_list)

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_slot_list_for_ace)

        proj = await self.fetch_project_gcode_info_fdm(gcode_id)

        if not proj:
            raise AnycubicGcodeParsingError(ErrorsGcodeParsing.fetch_failed)

        if slot_index_list is not None:

            material_list = proj.slice_material_info_list

            if not material_list:
                raise AnycubicGcodeParsingError(ErrorsGcodeParsing.material_list_empty)

            if len(slot_index_list) != len(material_list):
                raise AnycubicGcodeParsingError(ErrorsGcodeParsing.slot_material_list_mismatch.format(
                    len(slot_index_list),
                    len(material_list),
                ))

            ams_box_mapping = printer.build_mapping_for_material_list(
                slot_index_list=slot_index_list,
                material_list=material_list,
            )

        else:
            ams_box_mapping = None

        order_msg_id = await self.print_with_cloud_file_id(
            printer=printer,
            cloud_file_id=proj.id,
            ams_box_mapping=ams_box_mapping,
        )

        return AnycubicPrintResponse(
            order_msg_id=str(order_msg_id),
            printer_id=printer.id,
            saved_in_cloud=True,
            file_name=file_name,
            cloud_file_id=proj.id,
            gcode_id=gcode_id,
            material_list=proj.slice_material_info_list,
            ams_box_mapping=ams_box_mapping,
        )

    async def print_and_upload_save_in_cloud(
        self,
        printer: AnycubicPrinter,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        slot_index_list: list[int] | None = None,
    ) -> AnycubicPrintResponse:
        if printer is None:
            raise AnycubicAPIError(ErrorsGeneral.no_printer_to_print)

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_ace_for_slot_list)

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_slot_list_for_ace)

        cloud_file_id = await self.upload_file_to_cloud(
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
        )
        latest_cloud_file = await self.get_latest_cloud_file()

        if not latest_cloud_file or latest_cloud_file.id != cloud_file_id:
            raise AnycubicAPIError(ErrorsGeneral.file_upload_mismatch)

        if latest_cloud_file.gcode_id is None:
            raise AnycubicAPIError(ErrorsGeneral.cloud_file_no_gcodeid)

        return await self.print_with_cloud_gcode_id(
            printer=printer,
            gcode_id=latest_cloud_file.gcode_id,
            slot_index_list=slot_index_list,
            file_name=file_name,
        )

    async def print_and_upload_no_cloud_save(
        self,
        printer: AnycubicPrinter,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        slot_index_list: list[int] | None = None,
    ) -> AnycubicPrintResponse:
        if printer is None:
            raise AnycubicAPIError(ErrorsGeneral.no_printer_to_print)

        if slot_index_list is not None and not printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_ace_for_slot_list)

        if slot_index_list is None and printer.primary_multi_color_box:
            raise AnycubicAPIError(ErrorsGeneral.no_slot_list_for_ace)

        if slot_index_list is not None:
            gcode_file = await self.read_gcode_file(
                full_file_path=full_file_path,
                file_name=file_name,
                file_bytes=file_bytes,
            )
            material_list = gcode_file.material_list

            if not material_list:
                raise AnycubicGcodeParsingError(ErrorsGcodeParsing.material_list_empty)

            if len(slot_index_list) != len(material_list):
                raise AnycubicGcodeParsingError(ErrorsGcodeParsing.slot_material_list_mismatch.format(
                    len(slot_index_list),
                    len(material_list),
                ))

            ams_box_mapping = printer.build_mapping_for_material_list(
                slot_index_list=slot_index_list,
                material_list=material_list,
            )

        else:
            material_list = None
            ams_box_mapping = None

        cloud_file_id = await self.upload_file_to_cloud(
            full_file_path=full_file_path,
            file_name=file_name,
            file_bytes=file_bytes,
            temp_file=True,
        )

        order_msg_id = await self.print_with_cloud_file_id(
            printer=printer,
            cloud_file_id=cloud_file_id,
            ams_box_mapping=ams_box_mapping,
            temp_file=True,
        )

        return AnycubicPrintResponse(
            order_msg_id=str(order_msg_id),
            printer_id=printer.id,
            saved_in_cloud=False,
            file_name=file_name,
            cloud_file_id=cloud_file_id,
            material_list=material_list,
            ams_box_mapping=ams_box_mapping,
        )

    async def query_printer_options(
        self,
        printer: AnycubicPrinter,
        project: AnycubicProject | None = None,
    ) -> None:
        """ Responses are sent via MQTT """

        if not printer:
            return None

        await self._send_order_query_peripherals(
            printer=printer,
        )

        if not project and not printer.latest_project:
            return None

        if not project:
            project = printer.latest_project

        assert project

        await self._send_order_get_light_status(
            printer=printer,
            project=project,
        )
