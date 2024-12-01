from __future__ import annotations

from enum import Enum


class HTTP_METHODS(Enum):
    GET = 1
    POST = 2
    PUT = 3


class AnycubicAPIEndpoint:
    __slots__ = ("_method", "_endpoint")

    def __init__(
        self,
        method: HTTP_METHODS,
        endpoint: str,
    ) -> None:
        self._method: HTTP_METHODS = method
        self._endpoint: str = endpoint

    @property
    def method(self) -> HTTP_METHODS:
        return self._method

    @property
    def endpoint(self) -> str:
        return self._endpoint
