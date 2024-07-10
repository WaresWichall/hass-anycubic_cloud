def get_part_from_mqtt_topic(self, topic: str, part: int):
    split_topic = topic.split("/")
    if len(split_topic) < part + 1:
        return None

    return split_topic[part]
