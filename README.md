# Anycubic Cloud Home Assistant Integration

## WORK IN PROGRESS 

Component is working very well so far with a Kobra 3 Combo but will still have bugs that I'll need help ironing out.

Should work with multiple printers but untested until someone buys me a second printer :)

## Gallery

![The card with Kobra 2 printer info](https://github.com/user-attachments/assets/430d4094-5255-4f39-8692-aa3979ffa7ab)
![Some of the sensors and buttons exposed by the integration](https://github.com/user-attachments/assets/2447d2d9-466c-4357-87db-198e4e616887)



## Features

- Pause/Resume/Cancel print buttons
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

## How to Install

1. Add this repository to HACS under ... > Custom Repositories as an **Integration**
2. Restart Home Assistant
3. Go to Settings>Integrations>Add New and search Anycubic
4. Enter your **email** and password, then press enter
5. Select your printer, then you're good to go!


## UI

This integration couples with my [modded version of the threedy card for Home Assistant](https://github.com/WaresWichall/hass-threedy_anycubic_card)

It also comes with a WORK IN PROGRESS frontend panel which will be added to your sidebar.
The main use-case of this panel is as a file manager, but my plan is to add more functionality to it as well as rebuild the card in Lit instead of react. Any help there is welcome.
