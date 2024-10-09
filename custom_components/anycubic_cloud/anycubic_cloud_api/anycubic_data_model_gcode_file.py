from collections import UserDict

from aiofiles import (
    open as aio_file_open,
)

from .anycubic_helpers import (
    gcode_key_value_pair_to_dict,
    GCODE_STRING_FIRST_ATTR_LINE,
    REX_GCODE_DATA_KEY_VALUE,
)


class AnycubicGcodeFile(UserDict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._material_list = None

        try:
            self.material_list
        except ValueError:
            pass

    @classmethod
    async def async_read_from_file(
        cls,
        full_file_path=None,
        file_bytes=None,
    ):
        data_found = False
        file_lines = list()
        slicer_data = dict()

        if full_file_path is not None:
            try:
                async with aio_file_open(full_file_path, mode='r') as f:
                    file_lines = await f.readlines()
            except Exception as error:
                raise Exception(f'Failed to read gcode file, error: {error}')
        elif file_bytes is not None:
            try:
                file_lines = file_bytes.decode('utf-8').split('\n')
            except Exception as error:
                raise Exception(f'Failed to decode gcode file bytes, error: {error}')
        else:
            raise Exception('Cannot read slicer data without file path or bytes.')

        for line in file_lines:
            if not data_found and line.startswith(GCODE_STRING_FIRST_ATTR_LINE):
                data_found = True
            if not data_found:
                continue
            try:
                slicer_data.update(gcode_key_value_pair_to_dict(REX_GCODE_DATA_KEY_VALUE, line))
            except Exception as error:
                raise Exception(f'Failed to parse gcode metadata, error: {error}')

        return cls(slicer_data)

    @property
    def material_list(self):
        if self._material_list is not None:
            return self._material_list

        filament_used_g = self.data.get('filament_used_g')
        filament_used_mm = self.data.get('filament_used_mm')
        filament_used_cm3 = self.data.get('filament_used_cm3')
        ams_data = self.data.get('paint_info')

        if not ams_data:
            raise ValueError('Cannot load AMS paint info from gcode.')

        if not filament_used_g or len(filament_used_g) < 1:
            raise ValueError('Cannot load used filament info from gcode.')

        if len(filament_used_g) < len(ams_data):
            raise ValueError('Not enough used filament info parsed for AMS data.')

        if not filament_used_mm or len(filament_used_mm) < len(ams_data):
            filament_used_mm = list([None for x in range(len(ams_data))])

        if not filament_used_cm3 or len(filament_used_cm3) < len(ams_data):
            filament_used_cm3 = list([None for x in range(len(ams_data))])

        self._material_list = list([
            {
                **paint_info,
                'filament_used': filament_used_g[paint_info['paint_index']],
                'filament_used_mm': filament_used_mm[paint_info['paint_index']],
                'filament_used_cm3': filament_used_cm3[paint_info['paint_index']],
            } for paint_info in ams_data
        ])

        self.data['material_list'] = self._material_list

        return self._material_list