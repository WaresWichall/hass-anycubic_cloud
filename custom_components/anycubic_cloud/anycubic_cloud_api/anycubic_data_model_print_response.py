class AnycubicPrintResponse:
    def __init__(
        self,
        order_msg_id=None,
        printer_id=None,
        saved_in_cloud=False,
        file_name=None,
        cloud_file_id=None,
        gcode_id=None,
        material_list=None,
        ams_box_mapping=None,
    ):
        self._order_msg_id = order_msg_id
        self._printer_id = printer_id
        self._saved_in_cloud = bool(saved_in_cloud)
        self._file_name = file_name
        self._cloud_file_id = cloud_file_id
        self._gcode_id = gcode_id
        self._material_list = material_list
        self._ams_box_mapping = ams_box_mapping

    @property
    def event_dict(self):
        ams_box_mapping = None

        if self._ams_box_mapping:
            ams_box_mapping = list([
                x.as_box_mapping_data() for x in self._ams_box_mapping
            ])
        return {
            'order_msg_id': self._order_msg_id,
            'printer_id': self._printer_id,
            'saved_in_cloud': self._saved_in_cloud,
            'file_name': self._file_name,
            'cloud_file_id': self._cloud_file_id,
            'gcode_id': self._gcode_id,
            'material_list': self._material_list,
            'ams_box_mapping': ams_box_mapping,
        }

    def __repr__(self):
        return (
            f"AnycubicPrintResponse("
            f"order_msg_id={self._order_msg_id}, "
            f"printer_id={self._printer_id}, "
            f"saved_in_cloud={self._saved_in_cloud}, "
            f"file_name={self._file_name}, "
            f"cloud_file_id={self._cloud_file_id}, "
            f"gcode_id={self._gcode_id}, "
            f"material_list={self._material_list}, "
            f"ams_box_mapping={self._ams_box_mapping})"
        )
