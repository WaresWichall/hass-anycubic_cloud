from collections import UserDict


class AnycubicConsumableData(UserDict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.data = self._encode_items()
        self._consumed_data = dict()

    @property
    def is_empty(self):
        return len(self.data) == 0

    @property
    def remaining_data(self):
        return self.data
        new_data = dict()
        for k, v in self.data.items():
            if isinstance(v, AnycubicConsumableData):
                new_data[k] = v.remaining_data
            else:
                new_data[k] = v

        return new_data

    def _encode_list(
        self,
        data,
    ):
        new_data = list()
        for v in data:
            if isinstance(v, AnycubicConsumableData):
                new_data.append(v)
            elif isinstance(v, dict):
                new_data.append(AnycubicConsumableData(v))
            elif isinstance(v, list):
                new_data.append(self._encode_list(v))
            elif (
                isinstance(v, str) or
                isinstance(v, int) or
                isinstance(v, float) or
                isinstance(v, bool) or
                v is None
            ):
                new_data.append(v)
            else:
                raise TypeError(
                    f"Invalid type for AnycubicConsumableData: {type(v)}"
                )

        return new_data

    def _encode_items(
        self,
    ):
        new_data = dict()
        for k, v in self.data.items():
            if isinstance(v, AnycubicConsumableData):
                new_data[k] = v
            elif isinstance(v, dict):
                new_data[k] = AnycubicConsumableData(v)
            elif isinstance(v, list):
                new_data[k] = self._encode_list(v)
            elif (
                isinstance(v, str) or
                isinstance(v, int) or
                isinstance(v, float) or
                isinstance(v, bool) or
                v is None
            ):
                new_data[k] = v
            else:
                raise TypeError(
                    f"Invalid type for AnycubicConsumableData: {type(v)}"
                )

        return new_data

    def __getitem__(
        self,
        key,
    ):
        try:
            return self._consumed_data[key]
        except KeyError:
            pass

        try:
            value = self.data[key]
            if (
                not isinstance(value, AnycubicConsumableData) or
                value.is_empty
            ):
                self._consumed_data[key] = self.data.pop(key)
        except KeyError:
            raise

        return value
