"""Anycubic Cloud integration constants."""
import logging

from homeassistant.const import (
    Platform,
)

DEFAULT_NAME = "Anycubic Cloud Printer"

MANUFACTURER = "Anycubic"
MODEL = "main"

DOMAIN = "anycubic_cloud"
COORDINATOR = "coordinator"

CONF_PRINTER_ID = "printer_id"
CONF_PRINTER_NAME = "printer_name"
CONF_DRYING_PRESET_DURATION_ = "drying_preset_duration_"
CONF_DRYING_PRESET_TEMPERATURE_ = "drying_preset_temperature_"

UNIT_LAYERS = "Layers"

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

DEFAULT_SCAN_INTERVAL = 60
MQTT_SCAN_INTERVAL = 5
FAILED_UPDATE_DELAY = DEFAULT_SCAN_INTERVAL * 4
MAX_FAILED_UPDATES = 3

MAX_DRYING_PRESETS = 4

LOGGER = logging.getLogger(__package__)

PLATFORMS = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.SENSOR,
]
