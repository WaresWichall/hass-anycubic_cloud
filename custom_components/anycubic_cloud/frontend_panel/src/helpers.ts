import { fireEvent } from "./fire_event";
import {
  HomeAssistant,
  HassDevice,
  HassDeviceList,
  HassEntity,
  HassEntityInfo,
  HassEntityInfos,
  HassRoute,
} from "./types";

export function toTitleCase(str: any) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getEntityState(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo,
): HassEntity | undefined {
  return entityInfo ? hass.states[entityInfo.entity_id] : undefined;
}

export function getEntityStateFloat(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo,
): number {
  const entityState = getEntityState(hass, entityInfo);
  const stateFloat = entityState ? parseFloat(entityState.state) : 0;
  return !isNaN(stateFloat) ? stateFloat : 0;
}

export function getEntityStateString(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo,
): string {
  const entityState = getEntityState(hass, entityInfo);
  return entityState ? String(entityState.state) : "";
}

export function getEntityStateBinary(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo,
  onString: string,
  offString: string,
): string {
  const entityState = getEntityStateString(hass, entityInfo);
  return entityState == "on" ? onString : offString;
}

export function getPrinterDevices(hass: HomeAssistant): HassDeviceList {
  const printers: HassDeviceList = {};
  for (const key in hass.devices) {
    const dev = hass.devices[key];

    if (dev.manufacturer === "Anycubic") {
      printers[dev.id] = dev;
    }
  }
  return printers;
}

export function getPrinterEntities(
  hass: HomeAssistant,
  deviceID: string,
): HassEntityInfos {
  const entities: HassEntityInfos = {};
  for (const key in hass.entities) {
    const ent = hass.entities[key];

    if (ent.device_id === deviceID) {
      entities[ent.entity_id] = ent;
    }
  }
  return entities;
}

export function getMatchingEntity(
  entities: HassEntityInfos,
  match_domain: string,
  match_suffix: string,
): HassEntityInfo | undefined {
  for (const key in entities) {
    const ent = entities[key];
    const splitID = key.split(".");
    const domain: string = splitID[0];
    const entity_id: string = splitID[1];

    if (domain === match_domain && entity_id.endsWith(match_suffix)) {
      return ent;
    }
  }
  return undefined;
}

export function getStrictMatchingEntity(
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  match_domain: string,
  match_suffix: string,
): HassEntityInfo | undefined {
  for (const key in entities) {
    const ent = entities[key];
    const splitID = key.split(".");
    const domain: string = splitID[0];
    const entityIdPart: string = splitID[1].split(printerEntityIdPart)[1];

    if (domain === match_domain && entityIdPart === match_suffix) {
      return ent;
    }
  }
  return undefined;
}

export function getPrinterEntityIdPart(
  entities: HassEntityInfos,
): string | undefined {
  for (const key in entities) {
    const splitID = key.split(".");
    const domain: string = splitID[0];
    const entity_id: string = splitID[1];

    if (domain === "binary_sensor" && entity_id.endsWith("printer_online")) {
      return entity_id.split("printer_online")[0];
    }
  }
  return undefined;
}

export function getFileListLocalFilesEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "sensor", "file_list_local");
}

export function getFileListLocalRefreshEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "button", "request_file_list_local");
}

export function getFileListUdiskFilesEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "sensor", "file_list_udisk");
}

export function getFileListUdiskRefreshEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "button", "request_file_list_udisk");
}

export function getFileListCloudFilesEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "sensor", "file_list_cloud");
}

export function getFileListCloudRefreshEntity(
  entities: HassEntityInfos,
): HassEntityInfo | undefined {
  return getMatchingEntity(entities, "button", "request_file_list_cloud");
}

export function getPrinterDevID(route: HassRoute): string | undefined {
  const pathParts = route.path.split("/");
  return pathParts.length > 1 ? pathParts[1] : undefined;
}

export function getSelectedPrinter(
  deviceList: HassDeviceList | undefined,
  deviceID: string | undefined,
): HassDevice | undefined {
  return deviceList && deviceID ? deviceList[deviceID] : undefined;
}

export function getPrinterMAC(printer: HassDevice | undefined): string | null {
  return printer &&
    printer.connections.length > 0 &&
    printer.connections[0].length > 1
    ? printer.connections[0][1]
    : null;
}

export function getPrinterID(
  printer: HassDevice | undefined,
): string | undefined {
  return printer ? printer.hw_version.split("Printer ID: ")[1] : undefined;
}

export function getPage(route: HassRoute): string {
  const pathParts = route.path.split("/");
  return pathParts.length > 2 ? pathParts[2] : "main";
}

export const navigateToPrinter = (
  node: any,
  printerID: string,
  replace: boolean = false,
) => {
  const endpoint = printerID ? `${printerID}/main` : "";
  const url = `${node.route.prefix}/${endpoint}`;
  if (replace) {
    history.replaceState(null, "", url);
  } else {
    history.pushState(null, "", url);
  }
  fireEvent(window, "location-changed", {
    replace,
  });
};

export const navigateToPage = (
  node: any,
  path: string,
  replace: boolean = false,
) => {
  const printerID = getPrinterDevID(node.route);
  const endpoint = printerID ? `${printerID}/${path}` : "";
  const url = `${node.route.prefix}/${endpoint}`;
  if (replace) {
    history.replaceState(null, "", url);
  } else {
    history.pushState(null, "", url);
  }
  fireEvent(window, "location-changed", {
    replace,
  });
};
