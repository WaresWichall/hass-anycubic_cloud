# Anycubic Cloud Home Assistant Integration

## NEW LOGIN METHOD

Anycubic decided to break the login method I was using before, so you'll need to follow the install steps below to get a token, and set up the integration from a fresh start.

Unfortunately this means that if you get logged out (by logging in elsewhere), you'll need to get a fresh token as below and re-authenticate the integration.

## WORK IN PROGRESS 

Component is working very well so far with:
- Kobra 3 Combo
- Kobra 2
- Photon Mono M5s (Basic support still)

If you have success with other printers please report it :)

It will still have bugs that I'll need help ironing out.

Should also work with multiple printers now, although I can't test this myself :)

Anycubic Cloud is polled for data updates every 1 minute, whilst MQTT updates can be received multiple times per second.

If you find updates for any sensors are only received every minute, please open an issue.


## Gallery


<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-1.png">
<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-2.png">
<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-1.png">
<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-print.png">
<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/anycubic-ace-ui.gif">





## Features

- Start print services / UI panel
- Pause/Resume/Cancel print buttons
- Edit ACE slot colours/settings via services / UI panel
- File manager via services / UI panel
- Retraction/Extrude services
- Remaining/Elapsed time
- Current Layer
- Current Status
- FW Update Available
- FW Version
- Nozzle Temperature
- Hotbed Temperature
- Is Available
- Is Printing
- Printing file name
- Progress
- Configurable MQTT Connection Mode (Defaults to Printing Only)
- And more ...

## How to Install

1. Go to the [Anycubic Cloud Website](https://cloud-universe.anycubic.com/file)
2. Log in
3. Open Developer Tools in your browser
4. Paste `window.localStorage["XX-Token"]` into the **console**
5. Copy/save the long string of numbers and letters without the `''` - this is your user token.
6. Add this repository to HACS under ... > Custom Repositories as an **Integration**
7. Restart Home Assistant
8. Go to Settings > Integrations > Add New and search Anycubic
9. Paste your **user token** into the `User Token` box.
10. Select your printer, then you're good to go!

<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/dev/screenshots/anycubic_api_token.png">


## UI

This integration couples with my [Anycubic card for Home Assistant](https://github.com/WaresWichall/hass-anycubic_card)

It also comes with a WORK IN PROGRESS frontend panel which will be added to your sidebar.
Current features:
- Basic printer info (+ the printer card above)
- File manager (requires MQTT connection to be active)
- Start print services

### Old UI Card

Thanks to @dangreco for his original work on threedy which I first modded and then completely rewrote with Lit instead of React.

The modded threedy card is still available [here](https://github.com/WaresWichall/hass-threedy_anycubic_card)
