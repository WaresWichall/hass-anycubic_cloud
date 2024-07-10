from enum import IntEnum


class AnycubicFeedType(IntEnum):
    Feed = 1
    Retract = 2
    Finish = 3


class AnycubicPrintStatus(IntEnum):
    Printing = 1
    Complete = 2
    Cancelled = 3
    Downloading = 4
    Checking = 5
    Preheating = 6
    Slicing = 7


class AnycubicOrderID(IntEnum):
    START_PRINT = 1
    PAUSE_PRINT = 2
    RESUME_PRINT = 3
    STOP_PRINT = 4
    PRINT_SETTINGS = 6
    STOP_PRINT_FORCE = 44
    LIST_UDISK_FILES = 101
    DELETE_UDISK_FILE = 102
    LIST_LOCAL_FILES = 103
    DELETE_LOCAL_FILE = 104
    CAMERA_OPEN = 1001
    MULTI_COLOR_BOX_GET_INFO = 1206
    MULTI_COLOR_BOX_DRY = 1207
    FEED_FILAMENT = 1208
    MULTI_COLOR_BOX_SET_SLOT = 1211
    MULTI_COLOR_BOX_AUTO_FEED = 1212


class AnycubicFunctionID(IntEnum):
    AXLE_MOVEMENT = 1
    FILE_MANAGER = 2
    EXPOSURE_TEST = 3
    LCD_PEER_VIDEO = 7
    FDM_AXIS_MOVE = 13
    FDM_PEER_VIDEO = 22
    DEVICE_STARTUP_SELF_TEST = 26
    PRINT_STARTUP_SELF_TEST = 27
    AUTOMATIC_OPERATION = 28
    RESIDUE_CLEAN = 29
    NOVICE_GUIDE = 30
    RELEASE_FILM = 31
    TASK_MODE = 32
    LCD_INTELLIGENT_MATERIALS_BOX = 33
    LCD_AUTO_OUT_IN_MATERIALS = 34
    M7PRO_AUTOMATIC_OPERATION = 35
    MULTI_COLOR_BOX = 2006
