from __future__ import annotations

import traceback
from os.path import basename as path_basename
from typing import TYPE_CHECKING, Any

from aiofiles import open as aio_file_open
from aiofiles.os import path as aio_path

from ..exceptions.error_strings import ErrorsCloudUpload
from ..exceptions.exceptions import AnycubicAPIError

if TYPE_CHECKING:
    from ..anycubic_api import AnycubicAPI
    from ..data_models.files import AnycubicCloudStore


class AnycubicCloudUpload:
    __slots__ = (
        "_api_parent",
        "_is_temp_file",
        "_full_file_path",
        "_file_name",
        "_file_bytes",
        "_is_file",
        "_file_size",
        "_previous_available_bytes",
        "_current_available_bytes",
        "_cloud_file_id",
        "_lock_file_id",
        "_upload_error",
        "_lock_data",
    )

    def __init__(
        self,
        api_parent: AnycubicAPI,
        full_file_path: str | None = None,
        file_name: str | None = None,
        file_bytes: bytes | None = None,
        is_temp_file: bool = False,
    ) -> None:
        self._api_parent: AnycubicAPI = api_parent
        self._is_temp_file: bool = is_temp_file
        if full_file_path is not None:
            self._full_file_path: str | None = full_file_path
            assert self._full_file_path
            self._file_name: str | None = str(path_basename(self._full_file_path))
            self._file_bytes: bytes | None = None
            self._is_file: bool = True
        elif file_name is not None and file_bytes is not None:
            self._full_file_path = None
            self._file_name = file_name
            self._file_bytes = file_bytes
            self._is_file = False
        else:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_path_bytes)
        self._file_size: int = 0
        self._previous_available_bytes: int = 0
        self._current_available_bytes: int = 0
        self._cloud_file_id: int | None = None
        self._lock_file_id: int | None = None
        self._upload_error: str | None = None
        self._lock_data: dict[str, Any] | None = None

    @property
    def full_file_path(self) -> str | None:
        return self._full_file_path

    @property
    def file_name(self) -> str | None:
        return self._file_name

    @property
    def file_bytes(self) -> bytes | None:
        return self._file_bytes

    @property
    def file_size(self) -> int:
        return self._file_size

    @property
    def lock_file_id(self) -> int | None:
        return self._lock_file_id

    @property
    def cloud_file_id(self) -> int | None:
        return self._cloud_file_id

    @property
    def upload_error(self) -> str | None:
        return self._upload_error

    @property
    def valid_path(self) -> bool:
        return self.full_file_path is not None and len(self.full_file_path) > 0

    @property
    def valid_size(self) -> bool:
        return self._file_size > 0

    @property
    def valid_bytes(self) -> bool:
        return self._file_bytes is not None

    @property
    def valid_available_bytes(self) -> bool:
        return self._previous_available_bytes >= self._file_size

    @property
    def valid_check_available_bytes_decreased(self) -> bool:
        return self._current_available_bytes <= (self._previous_available_bytes - self._file_size)

    def set_file_size(self, filesize: int) -> None:
        self._file_size = int(filesize)

    def set_file_bytes(self, file_bytes: bytes | None) -> None:
        self._file_bytes = file_bytes

    def set_previous_data_with_user_store(self, user_store: AnycubicCloudStore | None) -> None:
        if not user_store:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_user_store_previous)
        self._previous_available_bytes = user_store.available_bytes

    def set_current_data_with_user_store(self, user_store: AnycubicCloudStore | None) -> None:
        if not user_store:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_user_store_current)
        self._current_available_bytes = user_store.available_bytes

    def set_cloud_file_id(self, cloud_file_id: int) -> None:
        self._cloud_file_id = cloud_file_id

    def set_lock_file_id(self, lock_file_id: int) -> None:
        self._lock_file_id = lock_file_id

    def set_error(self, upload_error: Any) -> None:
        self._upload_error = str(upload_error)

    async def async_check_path_is_valid(self) -> None:
        if self._is_file and not self.valid_path:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_path)
        elif self._is_file:
            assert self.full_file_path
            if not (await aio_path.exists(self.full_file_path)):
                raise AnycubicAPIError(ErrorsCloudUpload.path_not_exist)

    def check_size_is_valid(self) -> None:
        if not self.valid_size:
            raise AnycubicAPIError(ErrorsCloudUpload.empty_file_size.format(self.file_name))

    def check_data_is_valid(self) -> None:
        if not self.valid_bytes:
            raise AnycubicAPIError(ErrorsCloudUpload.empty_file_bytes.format(self.file_name))

    def check_upload_succeeded(self) -> None:
        if self.upload_error:
            raise AnycubicAPIError(ErrorsCloudUpload.unknown.format(self.file_name, self.upload_error))

    async def async_check_available_cloud_space(self) -> None:
        if not self._is_temp_file:
            self.set_previous_data_with_user_store(await self._api_parent.get_user_cloud_store())

            if not self.valid_available_bytes:
                raise AnycubicAPIError(ErrorsCloudUpload.no_space_available.format(self.file_name))

    async def async_check_decreased_cloud_space(self) -> None:
        if not self._is_temp_file:
            self.set_current_data_with_user_store(await self._api_parent.get_user_cloud_store())
            if not self.valid_check_available_bytes_decreased:
                raise AnycubicAPIError(ErrorsCloudUpload.not_found_cloud.format(self.file_name))

    async def async_read_file_bytes(self) -> None:
        if self._is_file:
            assert self.full_file_path
            async with aio_file_open(self.full_file_path, mode='rb') as f:
                self.set_file_bytes(await f.read())
        if self.file_bytes is not None:
            self.set_file_size(len(self.file_bytes))

    async def async_lock_storage_space(self) -> None:
        self._lock_data = await self._api_parent._lock_storage_space(
            file_size=self.file_size,
            file_name=self.file_name,
            is_temp_file=self._is_temp_file,
        )

        assert self._lock_data

        self.set_lock_file_id(int(self._lock_data['id']))

    async def async_unlock_storage_space(self) -> None:
        if self.lock_file_id is None:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_unlock_file_id)
        await self._api_parent._unlock_storage_space(
            self.lock_file_id,
            is_delete_cos=(self.upload_error is not None),
        )

    async def async_upload_and_set_cloud_file_id(self) -> None:
        if self._lock_data is None:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_lock_data)
        if self.file_bytes is None:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_file_bytes)
        if self.lock_file_id is None:
            raise AnycubicAPIError(ErrorsCloudUpload.missing_lock_file_id)

        try:
            await self._api_parent._fetch_aws_put_resp(
                final_url=self._lock_data['preSignUrl'],
                put_data=self.file_bytes,
            )

            cloud_file_id = await self._api_parent._claim_file_upload_from_aws(self.lock_file_id)

            self.set_cloud_file_id(cloud_file_id)

        except Exception as error:
            tb = traceback.format_exc()
            self._api_parent._log_to_debug(
                f"Error during async_upload_and_set_cloud_file_id: {error}\n{tb}"
            )
            self.set_error(error)

    async def async_process_upload(self) -> int:
        await self.async_check_path_is_valid()

        await self.async_read_file_bytes()

        self.check_data_is_valid()

        self.check_size_is_valid()

        await self.async_check_available_cloud_space()

        await self.async_lock_storage_space()

        await self.async_upload_and_set_cloud_file_id()

        self.check_upload_succeeded()

        assert self.cloud_file_id is not None

        await self.async_unlock_storage_space()

        self.check_upload_succeeded()

        await self.async_check_decreased_cloud_space()

        return self.cloud_file_id
