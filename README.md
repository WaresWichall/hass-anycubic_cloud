# ABANDONED

Anycubic blocked MQTT access, see [here](https://github.com/WaresWichall/hass-anycubic_cloud/issues/33)

I'm moving on to another printer brand and abandoning this project.

Sorry to everyone using it but Anycubic won't respond to me so there's nothing else I can do.

---

---

# Anycubic Cloud Home Assistant Integration

## WORK IN PROGRESS 

Component is working very well so far with:
- Kobra 3 Combo
- Kobra 2
- Photon Mono M5s (Basic support still)
- M7 Pro (Basic support still)

If you have success with other printers please report it, or if you don't please report that too :)

Anycubic Cloud is polled for data updates every 1 minute, whilst MQTT updates can be received multiple times per second.

If you find updates for any sensors are only received every minute, please open an issue.


## Frontend Card

This integration couples with my [Anycubic card for Home Assistant](https://github.com/WaresWichall/hass-anycubic_card)


## Gallery


<img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-1.png"> <img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/anycubic-ace-ui.gif"> <img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-2.png">
<img width="300" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra3-print.png"> <img width="200" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/master/screenshots/kobra2-1.png">


## Features

- Supports multiple printers
- Start print services / UI panel
- Pause/Resume/Cancel print buttons
- Edit ACE slot colours/settings via services / UI panel
- File manager via services / UI panel
- Retraction/Extrude services
- Printer sensors e.g. temperature, fan, print speed etc
- Job sensors e.g. name, progress, image preview, time, print params
- ACE sensors
- Firmware Update entities
- ACE drying management with customisable presets
- ACE spool management with customisable colour presets
- Configurable MQTT Connection Mode (Defaults to Printing Only)
- And more ...


## Panel

It also comes with a WORK IN PROGRESS frontend panel which will be added to your sidebar.
Current features:
- Basic printer info (+ the printer card above)
- File manager (requires MQTT connection to be active)
- Start print services


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

### Re-Authentication

If you log yourself out or your token expires you'll get a re-authentication warning in Home Assistant, just grab a new token as above.


## Thanks

Thanks to @dangreco for his original work on threedy which I first modded and then completely rewrote with Lit instead of React.
