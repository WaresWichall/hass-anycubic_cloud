MQTT_HOST = "mqtt-universe.anycubic.com"
MQTT_PORT = 8883

MQTT_TOPIC_PREFIX = "anycubic/anycubicCloud/v1"
MQTT_ROOT_TOPIC_PLUS = f"{MQTT_TOPIC_PREFIX}/+/public/"
MQTT_ROOT_TOPIC_PRINTER = f"{MQTT_TOPIC_PREFIX}/printer/app/"
MQTT_ROOT_TOPIC_PUBLISH = f"{MQTT_TOPIC_PREFIX}/app/"
MQTT_ROOT_TOPIC_PUBLISH_PRINTER = f"{MQTT_TOPIC_PREFIX}/printer/public/"
MQTT_ROOT_TOPIC_SERVER = f"{MQTT_TOPIC_PREFIX}/server/app/"
MQTT_ROOT_TOPIC_SLICER = f"{MQTT_TOPIC_PREFIX}/pc/printer/"
# Slicer MQTT topics seem to use /pc/ instead of /app/

MQTT_TIMEOUT = 60 * 20
