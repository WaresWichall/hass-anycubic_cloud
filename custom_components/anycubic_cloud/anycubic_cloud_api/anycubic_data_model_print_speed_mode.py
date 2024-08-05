class AnycubicPrintSpeedMode:
    def __init__(
        self,
        title,
        mode,
    ):
        self._title = str(title)
        self._mode = int(mode)

    @classmethod
    def from_json(cls, data):
        if data is None:
            return None

        return cls(
            title=data['title'],
            mode=data['print_speed_mode'],
        )

    @property
    def title(self):
        return self._title

    @property
    def mode(self):
        return self._mode

    @property
    def data_object(self):
        return {
            "description": self._title,
            "mode": self._mode,
        }

    def __repr__(self):
        return (
            f"AnycubicPrintSpeedMode("
            f"title={self._title}, "
            f"mode={self._mode})"
        )

    def __eq__(self, other):
        if isinstance(other, AnycubicPrintSpeedMode):
            return self.mode == other.mode
        else:
            try:
                return self.mode == int(other)
            except Exception:
                pass

        return False
