# Anycubic Cloud Home Assistant Integration

## WORK IN PROGRESS 

Component is working very well so far with a Kobra 3 Combo but will still have bugs that I'll need help ironing out.

Should work with multiple printers but untested until someone buys me a second printer :)

## Gallery


<img width="400" alt="" src="https://github.com/user-attachments/assets/80d15c03-fdbd-495c-be04-2d07fc68cc3a">
<img width="400" alt="Screenshot 2024-07-25 at 3 55 16 PM" src="https://github.com/user-attachments/assets/f557f362-2e08-461e-8416-83257a65f02e">



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
