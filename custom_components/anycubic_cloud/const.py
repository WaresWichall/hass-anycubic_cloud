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
CONF_DRYING_PRESET_DURATION_1 = "drying_preset_duration_1"
CONF_DRYING_PRESET_TEMPERATURE_1 = "drying_preset_temperature_1"
CONF_DRYING_PRESET_DURATION_2 = "drying_preset_duration_2"
CONF_DRYING_PRESET_TEMPERATURE_2 = "drying_preset_temperature_2"

UNIT_LAYERS = "Layers"

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

DEFAULT_SCAN_INTERVAL = 60
MQTT_SCAN_INTERVAL = 5

LOGGER = logging.getLogger(__package__)

PLATFORMS = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.SENSOR,
]
