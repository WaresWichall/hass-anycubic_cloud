"""Support for Anycubic Cloud image."""
from __future__ import annotations

from datetime import datetime

from homeassistant.components.image import (
    Image,
    ImageEntity,
    ImageEntityDescription,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from .const import (
    CONF_PRINTER_ID_LIST,
    COORDINATOR,
    DOMAIN,
)
from .coordinator import AnycubicCloudDataUpdateCoordinator
from .entity import AnycubicCloudEntity
from .helpers import printer_state_for_key


IMAGE_TYPES = (
    ImageEntityDescription(
        key="job_image_url",
        translation_key="job_image_url",
    ),
)

GLOBAL_IMAGE_TYPES = (
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the image from a config entry."""

    coordinator: AnycubicCloudDataUpdateCoordinator = hass.data[DOMAIN][entry.entry_id][
        COORDINATOR
    ]

    entity_list = list()

    for printer_id in entry.data[CONF_PRINTER_ID_LIST]:
        for description in IMAGE_TYPES:
            entity_list.append(AnycubicCloudImage(
                hass,
                coordinator,
                printer_id,
                description,
            ))

    for description in GLOBAL_IMAGE_TYPES:
        entity_list.append(AnycubicCloudImage(
            hass,
            coordinator,
            entry.data[CONF_PRINTER_ID_LIST][0],
            description,
        ))

    async_add_entities(entity_list)


class AnycubicCloudImage(AnycubicCloudEntity, ImageEntity):
    """An image for Anycubic Cloud."""

    entity_description: ImageEntityDescription

    def __init__(
        self,
        hass: HomeAssistant,
        coordinator: AnycubicCloudDataUpdateCoordinator,
        printer_id: int,
        entity_description: ImageEntityDescription,
    ) -> None:
        """Initialize."""
        super().__init__(coordinator, printer_id, entity_description)
        ImageEntity.__init__(self, hass)
        self._known_image_url = None

    def _reset_cached_image(self):
        self._cached_image = None
        self._attr_image_last_updated = dt_util.utcnow()

    def _check_image_url(self):
        image_url = printer_state_for_key(self.coordinator, self._printer_id, self.entity_description.key)
        if self._known_image_url != image_url:
            self._reset_cached_image()

            self._known_image_url = image_url

    @property
    def image_url(self) -> str | None:
        return self._known_image_url

    @property
    def image_last_updated(self) -> datetime | None:
        return self._attr_image_last_updated

    @property
    def state(self) -> str | None:
        if self.image_last_updated is None:
            return None
        return self.image_last_updated.isoformat()

    async def _async_load_image_from_url(self, url: str) -> Image | None:
        """Load an image by url."""
        if response := await self._fetch_url(url):
            return Image(
                content=response.content,
                content_type="image/png",
            )
        return None

    async def async_image(self) -> bytes | None:
        """Return bytes of image."""

        self._check_image_url()

        return await ImageEntity.async_image(self)
