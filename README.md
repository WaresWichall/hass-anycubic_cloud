> [!NOTE]  
> Anycubic have been attempting to block MQTT access, see [here](https://github.com/WaresWichall/hass-anycubic_cloud/issues/33)
> 
> I'm moving on to another printer brand and won't be active on this project as much but will still be fixing issues.
> 
> MQTT access is now available using Slicer Next (windows version) tokens.
> 
> Still works as of 01/12/2024.

---

# Anycubic Cloud Home Assistant Integration

Component is working very well so far with:
- Kobra 3 Combo
- Kobra 2
- Kobra 2 Max
- Kobra 2 Pro
- Kobra S1 Combo
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

It also comes with a frontend panel which will be added to your sidebar.
Current features:
- Basic printer info (+ the printer card above)
- File manager (requires MQTT connection to be active)
- Start print services


## How to Install

1. Pick a method of authentication and grab your logon token.
2. Add this repository to HACS under ... (menu) > Custom Repositories as an **Integration**
3. Restart Home Assistant
4. Go to Settings > Integrations > Add New and search Anycubic
5. Select your chosen authentication mode
6. Paste your **token** into the `User Token` or `Slicer Access Token` box.
7. Select your printer, then you're good to go!
8. Optionally configure more options in the home assistant integration `configure` menus.


### Slicer authentication

> [!IMPORTANT]  
> Only tested / supported with Slicer Next for Windows and Mac

1. Make sure your installation of Slicer Next is logged in, then close it.
2. Locate your `AnycubicSlicerNext` config directory.
> [!NOTE]  
> This is found in:
> ```
> %AppData%\AnycubicSlicerNext\AnycubicSlicerNext.conf
> ```
> or
> ```
> C:\Users\<USERNAME>\AppData\Roaming\AnycubicSlicerNext\AnycubicSlicerNext.conf
> ```
> or
> ```
> $HOME/Library/Application\ Support/AnycubicSlicerNext/AnycubicSlicerNext.conf
> ```
3. Copy/save the whole `access_token` string without the quotes, it should be a 344 character string.
4. Ideally you should now clear your login config for the slicer to prevent it logging in at the same time as Home Assistant.
    This can be done setting your `access_token` to an empty string in the config file, e.g. `"access_token": "",`

<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/dev/screenshots/auth_slicer_token.png">

> [!NOTE]  
> If you are on a mac and have `yq` installed. You can copy the access token using this command
> ```
> yq '.anycubic_cloud.access_token' $HOME/Library/Application\ Support/AnycubicSlicerNext/AnycubicSlicerNext.conf |pbcopy
> ```

### Web authentication

> [!IMPORTANT]  
> Unfortunately web authentication no longer supports MQTT updates.

1. Go to the [Anycubic Cloud Website](https://cloud-universe.anycubic.com/file)
2. Log in
3. Open Developer Tools in your browser
4. Paste `window.localStorage["XX-Token"]` into the **console**
5. Copy/save the long string of numbers and letters without the `''` - this is your token.

<img width="400" alt="" src="https://raw.githubusercontent.com/WaresWichall/hass-anycubic_cloud/dev/screenshots/anycubic_api_token.png">

### Re-Authentication

If you log yourself out or your token expires you'll get a re-authentication warning in Home Assistant, just grab a new token as above.


## Donations

<a href="https://www.buymeacoffee.com/wareswichall"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=wareswichall&button_colour=28303f&font_colour=ffffff&font_family=Lato&outline_colour=ffffff&coffee_colour=FFDD00" /></a>


## Thanks

Thanks to @dangreco for his original work on threedy which I first modded and then completely rewrote with Lit instead of React.
