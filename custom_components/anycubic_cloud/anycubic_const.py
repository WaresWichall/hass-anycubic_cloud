import re


BASE_DOMAIN = "cloud-universe.anycubic.com"
AUTH_DOMAIN = "uc.makeronline.com"

PUBLIC_API_ENDPOINT = "p/p/workbench/api"

REX_JS_FILE = re.compile(r'src="(/js/app\.[^.]+\.js)"')
REX_CLIENT_ID = re.compile(r',clientId:"([^"]+)",')
REX_APP_ID = re.compile(r',appid:"([^"]+)",')
REX_APP_VERSION = re.compile(r',version:"([^"]+)",')
REX_APP_SECRET = re.compile(r',appSecret:"([^"]+)",')

DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
