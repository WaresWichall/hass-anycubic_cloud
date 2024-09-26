# Anycubic Cloud Helper Scripts

## WORK IN PROGRESS 


Install all requirements with

```bash
pip install homeassistant paho-mqtt aiofiles
```

Copy `anycubic_cached_sig_token.token.sample` to `anycubic_cached_sig_token.token` and replace the contents with your user token.

Open a terminal or command prompt inside the `custom_components` directory and run scripts with e.g.

### File Dump

```bash
python -m anycubic_cloud.scripts.debug_dump_raw --dump-file ../debug_dump.json
```

### Cloud upload and print

```bash
python -m anycubic_cloud.scripts.upload_to_cloud_and_print_with_ace --help
```
