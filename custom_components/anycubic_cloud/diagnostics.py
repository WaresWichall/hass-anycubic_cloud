"""Diagnostics support for Anycubic Cloud."""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import COORDINATOR, DOMAIN
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
    "id",
    "last_login_time",
}
PRINTER_TO_REDACT = {
    "id",
    "user_id",
    "key",
    "machine_mac",
}
PROJECT_TO_REDACT = {
    "id",
    "taskid",
    "user_id",
    "printer_id",
    "gcode_id",
    "key",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a config entry."""
    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    assert coordinator.anycubic_api
    user_info = await coordinator.anycubic_api.get_user_info(raw_data=True)
    printer_info = await coordinator.anycubic_api.list_my_printers(raw_data=True)
    projects_info = await coordinator.anycubic_api.list_all_projects(raw_data=True)
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
        "user_info": async_redact_data(user_info, USER_TO_REDACT),
        "printer_info": {
            **printer_info,
            'data': async_redact_data(printer_info['data'], PRINTER_TO_REDACT),
        },
        "projects_info": {
            **projects_info,
            'data': [async_redact_data(x, PROJECT_TO_REDACT) for x in projects_info['data']],
        },
        "detailed_printer_info": async_redact_data(detailed_printer_info, PRINTER_TO_REDACT),
    }
