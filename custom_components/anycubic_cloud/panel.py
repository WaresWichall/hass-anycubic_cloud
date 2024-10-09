"""Anycubic Cloud frontend panel."""

import os

from homeassistant.components import frontend
from homeassistant.components import panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    CUSTOM_COMPONENTS,
    DOMAIN,
    INTEGRATION_FOLDER,
    LOGGER,
    PANEL_FOLDER,
    PANEL_FILENAME,
    PANEL_NAME,
    PANEL_TITLE,
    PANEL_ICON,
)


PANEL_URL = "/anycubic-cloud-panel-static"


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the Anycubic Cloud frontend panel."""
    if DOMAIN not in hass.data.get("frontend_panels", {}):
        root_dir = os.path.join(hass.config.path(CUSTOM_COMPONENTS), INTEGRATION_FOLDER)
        panel_dir = os.path.join(root_dir, PANEL_FOLDER)
        view_url = os.path.join(panel_dir, PANEL_FILENAME)

        try:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(PANEL_URL, view_url, cache_headers=False)]
            )
        except RuntimeError as e:
            if "already registered" not in str(e):
                raise e

        await panel_custom.async_register_panel(
            hass,
            webcomponent_name=PANEL_NAME,
            frontend_url_path=DOMAIN,
            module_url=PANEL_URL,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=False,
            config={},
        )


def async_unregister_panel(hass: HomeAssistant) -> None:
    frontend.async_remove_panel(hass, DOMAIN)
    LOGGER.debug("Removing panel")
