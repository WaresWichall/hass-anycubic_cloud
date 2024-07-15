# Anycubic Cloud Helper Scripts

## WORK IN PROGRESS 


Install all requirements with

```bash
pip install homeassistant paho-mqtt aiofiles
```

Copy `anycubic_credentials.sample.py` to `anycubic_credentials.py` and edit it with your credentials.

Open a terminal or command prompt inside the `custom_components` directory and run scripts with e.g.

### File Dump

```bash
python -m anycubic_cloud.scripts.debug_dump_raw --dump-file ../debug_dump.json
```

### Cloud upload and print

```bash
python -m anycubic_cloud.scripts.upload_to_cloud_and_print_with_ace --help
```
