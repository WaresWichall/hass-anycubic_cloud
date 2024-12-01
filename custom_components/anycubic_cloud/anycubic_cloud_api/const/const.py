import re

BASE_DOMAIN = "cloud-universe.anycubic.com"
APP_REDIRECT_URI = "anycubic-i18n://cloud.anycubic.com:8088"
AUTH_DOMAIN = "uc.makeronline.com"

PUBLIC_API_ENDPOINT = "p/p/workbench/api"

PROJECT_IMAGE_URL_BASE = "https://workbentch.s3.us-east-2.amazonaws.com/"

REX_JS_FILE = re.compile(r'src="(/js/app\.[^.]+\.js)"')
# REX_CLIENT_ID = re.compile(r',clientId:"([^"]+)",')
REX_CLIENT_ID = re.compile(r'\'(?!getEl)([a-zA-Z0-9]{20})\'')
REX_APP_ID_BASIC = re.compile(r'appid["\']?:["\']([^"\']+)["\'],')
REX_APP_ID_OBF = re.compile(r'(?<!:)\'([a-zA-Z0-9]{32})\'')
REX_APP_VERSION = re.compile(r'version["\']?:["\']([^"\']+)["\'],')
REX_APP_SECRET_BASIC = re.compile(r'appSecret["\']?:["\']([^"\']+)["\'],')
REX_APP_SECRET_OBF = re.compile(r'(?<!:)\'([a-zA-Z0-9]{32})\'')
REX_GCODE_EXT = re.compile(r'\.gcode$')

DEFAULT_USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 '
    'Safari/537.36'
)

AC_KNOWN_CID_WEB = '672efcd4ec11a66c8513'
AC_KNOWN_CID_APP = 'ca4c8416cced85a1dc02'
AC_KNOWN_AID = 'f9b3528877c94d5c9c5af32245db46ef'
AC_KNOWN_VID_WEB = '1.0.0'
AC_KNOWN_VID_APP = '1.4.8'
AC_KNOWN_VID_SLICER_NEXT = 'V3.0.0'
AC_KNOWN_SEC = '0cf75926606049a3937f56b0373b99fb'

MAX_PROJECT_LIST_RESULTS = 2000
MAX_PROJECT_IMAGE_SEARCH_COUNT = 200

MAX_API_FETCH_TIME_WARN = 20

WARN_INTERVAL_API_DURATION = 60 * 10

ACCESS_TOKEN_LOGIN_RETRIES = 2
ACCESS_TOKEN_LOGIN_RETRY_INTERVAL = 2


class AnycubicServerMessage:
    FILE_NOT_FOUND = "No file found"
