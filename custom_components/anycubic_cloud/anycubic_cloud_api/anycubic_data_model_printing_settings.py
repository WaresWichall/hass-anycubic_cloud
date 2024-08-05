class AnycubicPrintingSettings:
    def __init__(
        self,
        print_speed_mode=None,
        target_nozzle_temp=None,
        target_hotbed_temp=None,
        fan_speed_pct=None,
        aux_fan_speed_pct=None,
        box_fan_level=None,
        bottom_layers=None,
        bottom_time=None,
        off_time=None,
        on_time=None,
    ):
        self._print_speed_mode = int(print_speed_mode) if print_speed_mode is not None else None
        self._target_nozzle_temp = int(target_nozzle_temp) if target_nozzle_temp is not None else None
        self._target_hotbed_temp = int(target_hotbed_temp) if target_hotbed_temp is not None else None
        self._fan_speed_pct = int(fan_speed_pct) if fan_speed_pct is not None else None
        self._aux_fan_speed_pct = int(aux_fan_speed_pct) if aux_fan_speed_pct is not None else None
        self._box_fan_level = int(box_fan_level) if box_fan_level is not None else None
        self._bottom_layers = int(bottom_layers) if bottom_layers is not None else None
        self._bottom_time = float(bottom_time) if bottom_time is not None else None
        self._off_time = float(off_time) if off_time is not None else None
        self._on_time = float(on_time) if on_time is not None else None

    @property
    def print_speed_mode(self):
        return self._print_speed_mode

    @property
    def target_nozzle_temp(self):
        return self._target_nozzle_temp

    @property
    def target_hotbed_temp(self):
        return self._target_hotbed_temp

    @property
    def fan_speed_pct(self):
        return self._fan_speed_pct

    @property
    def aux_fan_speed_pct(self):
        return self._aux_fan_speed_pct

    @property
    def box_fan_level(self):
        return self._box_fan_level

    @property
    def bottom_layers(self):
        return self._bottom_layers

    @property
    def bottom_time(self):
        return self._bottom_time

    @property
    def off_time(self):
        return self._off_time

    @property
    def on_time(self):
        return self._on_time

    @property
    def settings_data(self):
        print_settings = dict()
        if self._print_speed_mode is not None:
            print_settings['print_speed_mode'] = self._print_speed_mode

        if self._target_nozzle_temp is not None:
            print_settings['target_nozzle_temp'] = self._target_nozzle_temp

        if self._target_hotbed_temp is not None:
            print_settings['target_hotbed_temp'] = self._target_hotbed_temp

        if self._fan_speed_pct is not None:
            print_settings['fan_speed_pct'] = self._fan_speed_pct

        if self._aux_fan_speed_pct is not None:
            print_settings['aux_fan_speed_pct'] = self._aux_fan_speed_pct

        if self._box_fan_level is not None:
            print_settings['box_fan_level'] = self._box_fan_level

        if self._bottom_layers is not None:
            print_settings['bottom_layers'] = self._bottom_layers

        if self._bottom_time is not None:
            print_settings['bottom_time'] = self._bottom_time

        if self._off_time is not None:
            print_settings['off_time'] = self._off_time

        if self._on_time is not None:
            print_settings['on_time'] = self._on_time

        return print_settings

    def __repr__(self):
        return (
            f"AnycubicPrintingSettings("
            f"print_speed_mode={self._print_speed_mode}, "
            f"target_nozzle_temp={self._target_nozzle_temp}, "
            f"target_hotbed_temp={self._target_hotbed_temp}, "
            f"fan_speed_pct={self._fan_speed_pct}, "
            f"aux_fan_speed_pct={self._aux_fan_speed_pct}, "
            f"box_fan_level={self._box_fan_level}, "
            f"bottom_layers={self._bottom_layers}, "
            f"bottom_time={self._bottom_time}, "
            f"off_time={self._off_time}, "
            f"on_time={self._on_time})"
        )
