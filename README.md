# Anycubic Cloud Home Assistant Integration

## WORK IN PROGRESS 

Component is working very well so far with Kobra 3 Combos and Kobra 2s but will still have bugs that I'll need help ironing out.

Should also work with multiple printers but untested until someone buys me a second printer :)

## Gallery


<img width="400" alt="" src="https://github.com/user-attachments/assets/80d15c03-fdbd-495c-be04-2d07fc68cc3a">
<img width="400" alt="Screenshot 2024-07-25 at 3 55 16 PM" src="https://github.com/user-attachments/assets/f557f362-2e08-461e-8416-83257a65f02e">
<img width="400" alt="Screenshot 2024-07-31 at 08 51 40" src="https://github.com/user-attachments/assets/8a033e2c-cd20-40b1-b48e-428a7952e552">
<img width="400" alt="Screenshot 2024-07-31 at 08 52 01" src="https://github.com/user-attachments/assets/42e07a10-e2a2-481a-b454-4498c1fb6181">





## Features

- Start print services / UI panel
- Pause/Resume/Cancel print buttons
- Edit ACE slot colours/settings via services
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

## How to Install

1. Add this repository to HACS under ... > Custom Repositories as an **Integration**
2. Restart Home Assistant
3. Go to Settings>Integrations>Add New and search Anycubic
4. Enter your **email** and password, then press enter
5. Select your printer, then you're good to go!


## UI

This integration couples with my [modded version of the threedy card for Home Assistant](https://github.com/WaresWichall/hass-threedy_anycubic_card)

It also comes with a WORK IN PROGRESS frontend panel which will be added to your sidebar.
The main use-case of this panel is as a file manager, but I'll continue to add more functionality to it.
