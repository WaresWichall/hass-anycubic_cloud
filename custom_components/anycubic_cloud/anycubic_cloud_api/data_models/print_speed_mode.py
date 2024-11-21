from __future__ import annotations

from typing import Any


class AnycubicPrintSpeedMode:
    __slots__ = (
        "_title",
        "_mode",
    )

    def __init__(
        self,
        title: str,
        mode: int,
    ) -> None:
        self._title = str(title)
        self._mode = int(mode)

    @classmethod
    def from_json(cls, data: dict[str, Any] | None) -> AnycubicPrintSpeedMode | None:
        if data is None:
            return None

        return cls(
            title=data['title'],
            mode=data['print_speed_mode'],
        )

    @property
    def title(self) -> str:
        return self._title

    @property
    def mode(self) -> int:
        return self._mode

    @property
    def data_object(self) -> dict[str, str | int]:
        return {
            "description": self._title,
            "mode": self._mode,
        }

    def __repr__(self) -> str:
        return (
            f"AnycubicPrintSpeedMode("
            f"title={self._title}, "
            f"mode={self._mode})"
        )

    def __eq__(self, other: object) -> bool:
        if isinstance(other, AnycubicPrintSpeedMode):
            return self.mode == other.mode
        else:
            try:
                return bool(self.mode == int(other))  # type: ignore[call-overload]
            except Exception:
                pass

        return False
