"""Anycubic Cloud integration constants."""
import logging
from enum import IntEnum

from homeassistant.const import Platform

DEFAULT_NAME = "Anycubic Cloud Printer"

MANUFACTURER = "Anycubic"
MODEL = "main"

DOMAIN = "anycubic_cloud"
COORDINATOR = "coordinator"

CUSTOM_COMPONENTS = "custom_components"
INTEGRATION_FOLDER = DOMAIN
PANEL_FOLDER = "frontend_panel"
PANEL_FILENAME = "dist/anycubic-cloud-panel.js"
PANEL_NAME = "anycubic-cloud-panel"
PANEL_TITLE = "Anycubic Cloud"
PANEL_ICON = "mdi:printer-3d"

ATTR_CONFIG_ENTRY = "config_entry"
ATTR_ANYCUBIC_EVENT = "anycubic_cloud"

ENTITY_ID_DRYING_START_PRESET_ = "drying_start_preset_"

CONF_USER_AUTH_MODE = "user_auth_mode"
CONF_USER_DEVICE_ID = "user_device_id"
CONF_USER_TOKEN = "user_token"
CONF_PRINTER_ID = "printer_id"
CONF_PRINTER_ID_LIST = "printer_ids"
CONF_PRINTER_NAME = "printer_name"
CONF_DRYING_PRESET_DURATION_ = "drying_preset_duration_"
CONF_DRYING_PRESET_TEMPERATURE_ = "drying_preset_temperature_"
CONF_SLOT_NUMBER = "slot_number"
CONF_SLOT_COLOR_RED = "slot_color_red"
CONF_SLOT_COLOR_GREEN = "slot_color_green"
CONF_SLOT_COLOR_BLUE = "slot_color_blue"
CONF_BOX_ID = "box_id"
CONF_FINISHED = "finished"
CONF_MQTT_CONNECT_MODE = "mqtt_connect_mode"
CONF_CARD_CONFIG = "card_config"
CONF_DEBUG = "debug"
CONF_UPLOADED_GCODE_FILE = "uploaded_gcode_file"
CONF_FILE_ID = "file_id"
CONF_SPEED_MODE = "speed_mode"
CONF_SPEED = "speed"
CONF_TEMPERATURE = "temperature"
CONF_LAYERS = "layers"
CONF_TIME = "time"

AC_EVENT_PRINT_CLOUD_START = "print_cloud_start"

UNIT_LAYERS = "Layers"

STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

API_SETUP_RETRIES = 3
API_SETUP_RETRY_INTERVAL_SECONDS = 10
DEFAULT_SCAN_INTERVAL = 60
MQTT_SCAN_INTERVAL = 15
FAILED_UPDATE_DELAY = DEFAULT_SCAN_INTERVAL * 4
MAX_FAILED_UPDATES = 3
MQTT_IDLE_DISCONNECT_SECONDS = 60 * 15
MQTT_ACTION_RESPONSE_ALIVE_SECONDS = 60 * 5
MQTT_REFRESH_INTERVAL = 60 * 5
MAX_FILE_UPLOAD_RETRIES = 3

MAX_DRYING_PRESETS = 4


class PrinterEntityType(IntEnum):
    GLOBAL = 1
    PRINTER = 2
    FDM = 3
    LCD = 4
    ACE_PRIMARY = 5
    ACE_SECONDARY = 6
    DRY_PRESET_PRIMARY = 7
    DRY_PRESET_SECONDARY = 8


LOGGER = logging.getLogger(__package__)

PLATFORMS = [
    Platform.BINARY_SENSOR,
    Platform.BUTTON,
    Platform.IMAGE,
    Platform.SENSOR,
    Platform.SWITCH,
    Platform.UPDATE,
]
