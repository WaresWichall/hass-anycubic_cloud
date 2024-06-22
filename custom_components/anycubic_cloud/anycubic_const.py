import re


BASE_DOMAIN = "cloud-universe.anycubic.com"
AUTH_DOMAIN = "uc.makeronline.com"

PUBLIC_API_ENDPOINT = "p/p/workbench/api"

REX_JS_FILE = re.compile(r'src="(/js/app\.[^.]+\.js)"')
# REX_CLIENT_ID = re.compile(r',clientId:"([^"]+)",')
# REX_APP_ID = re.compile(r',appid:"([^"]+)",')
REX_CLIENT_ID = re.compile(r'\'(?!getEl)([a-zA-Z0-9]{20})\'')
REX_APP_ID = re.compile(r'(?<!:)\'([a-zA-Z0-9]{32})\'')
REX_APP_VERSION = re.compile(r'version["\']?:["\']([^"\']+)["\'],')
REX_APP_SECRET = re.compile(r'appSecret["\']?:["\']([^"\']+)["\'],')

DEFAULT_USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 '
    'Safari/537.36'
)

AC_KNOWN_CID = '672efcd4ec11a66c8513'
# AC_KNOWN_CID = 'ca4c8416cced85a1dc02'
AC_KNOWN_AID = 'f9b3528877c94d5c9c5af32245db46ef'
AC_KNOWN_VID = '1.0.0'
AC_KNOWN_SEC = '0cf75926606049a3937f56b0373b99fb'

COMMAND_ID_CAMERA_OPEN = 1001
COMMAND_ID_MULTI_COLOR_BOX_DRY = 1207
