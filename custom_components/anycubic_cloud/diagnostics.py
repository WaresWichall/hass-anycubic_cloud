"""Diagnostics support for Anycubic Cloud."""
from __future__ import annotations

from typing import TYPE_CHECKING, Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import COORDINATOR, DOMAIN

if TYPE_CHECKING:
    from .coordinator import AnycubicCloudDataUpdateCoordinator

USER_TO_REDACT = {
    "birthday",
    "user_email",
    "password",
    "message_key",
    "last_login_ip",
    "casdoor_user_id",
    "casdoor_user",
    "user_nickname",
    "ip_country",
    "ip_province",
    "ip_city",
    "create_time",
    "create_day_time",
    "last_login_time",
}
PRINTER_TO_REDACT = {
    "machine_mac",
}
PROJECT_TO_REDACT = {
    "model",
}

TO_TAGGED_REDACT = {
    "id",
    "taskid",
    "user_id",
    "printer_id",
    "gcode_id",
    "key",
}


class TaggedRedacter:
    def __init__(self) -> None:
        self.redacted_values: dict[str, str] = dict()

    def _get_redacted_name(
        self,
        value: Any,
    ) -> str:
        if value not in self.redacted_values:
            num = len(self.redacted_values) + 1
            self.redacted_values[value] = f"**REDACTED_{num}**"

        return self.redacted_values[value]

    def redact_data(
        self,
        data: Any,
        to_redact: set[str],
    ) -> Any:
        if not isinstance(data, (dict, list)):
            return data

        if isinstance(data, list):
            return list([self.redact_data(val, to_redact) for val in data])

        redacted = {**data}

        for key, value in redacted.items():
            if value is None:
                continue
            if isinstance(value, str) and not value:
                continue
            if key in to_redact:
                redacted[key] = self._get_redacted_name(value)
            elif isinstance(value, dict):
                redacted[key] = self.redact_data(value, to_redact)
            elif isinstance(value, list):
                redacted[key] = list([self.redact_data(item, to_redact) for item in value])

        return redacted


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    tRedacter = TaggedRedacter()

    assert coordinator.anycubic_api
    user_info: dict[str, Any] = await coordinator.anycubic_api.get_user_info(raw_data=True)
    printer_info: dict[str, Any] = await coordinator.anycubic_api.list_my_printers(raw_data=True)
    projects_info: dict[str, Any] = await coordinator.anycubic_api.list_all_projects(raw_data=True)
    latest_project_info = {}

    if projects_info['data'] and len(projects_info['data']) > 0:
        latest_project_info = await coordinator.anycubic_api.project_info_for_id(
            project_id=projects_info['data'][0]['id'],
        )

    detailed_printer_info = list()
    if printer_info.get('data') is not None:
        for printer in printer_info['data']:
            printer_id = printer['id']
            detailed_printer_info.append(
                await coordinator.anycubic_api.printer_info_for_id(
                    printer_id,
                    raw_data=True,
                )
            )
    return {
        "user_info": tRedacter.redact_data(
            async_redact_data(user_info, USER_TO_REDACT),
            TO_TAGGED_REDACT
        ),
        "printer_info": {
            **printer_info,
            'data': tRedacter.redact_data(
                async_redact_data(printer_info['data'], PRINTER_TO_REDACT),
                TO_TAGGED_REDACT
            ),
        },
        "projects_info": {
            **projects_info,
            'data': [
                tRedacter.redact_data(
                    async_redact_data(x, PROJECT_TO_REDACT),
                    TO_TAGGED_REDACT
                ) for x in projects_info['data']
            ],
        },
        "detailed_printer_info": tRedacter.redact_data(
            async_redact_data(detailed_printer_info, PRINTER_TO_REDACT),
            TO_TAGGED_REDACT
        ),
        "latest_project_info": tRedacter.redact_data(
            async_redact_data(latest_project_info, PROJECT_TO_REDACT),
            TO_TAGGED_REDACT
        ),
    }
