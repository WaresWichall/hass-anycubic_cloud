import moment from "moment";

import { fireEvent } from "./fire_event";
import {
  AnycubicCardConfig,
  AnycubicSpeedMode,
  AnycubicSpeedModes,
  CalculatedTimeType,
  HomeAssistant,
  HassDevice,
  HassDeviceList,
  HassEntity,
  HassEntityInfo,
  HassEntityInfos,
  HassRoute,
  PrinterCardStatType,
  TemperatureUnit,
} from "./types";

const stylePxKeys = ["width", "height", "left", "top"];

export function updateElementStyleWithObject(
  el: HTMLElement | undefined,
  updateObj: any,
): void {
  Object.keys(updateObj).forEach((key) => {
    if (stylePxKeys.includes(key) && !isNaN(updateObj[key])) {
      updateObj[key] = updateObj[key].toString() + "px";
    }
  });
  if (el) {
    Object.assign(el.style, updateObj);
  }
}

export function numberFromString(str: string): number {
  return Number(str.match(/\d+/)[0]);
}

export function toTitleCase(str: any): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: any) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function prettyFilename(str: string): string {
  const splitI = str.indexOf("-0.");
  const splitName =
    splitI > 0 ? [str.slice(0, splitI), str.slice(splitI + 1)] : [str];
  const chunksFirst = splitName[0].match(/.{1,10}/g);
  const joinFirst = chunksFirst.join("\n");
  return splitName.length > 1
    ? joinFirst + "-" + splitName.slice(1)
    : joinFirst;
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
  onValue: string | boolean,
  offValue: string | boolean,
): string | boolean {
  const entityState = getEntityStateString(hass, entityInfo);
  return entityState === "on" ? onValue : offValue;
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

export function getPrinterEntityId(
  printerEntityIdPart: string | undefined,
  domain: string,
  suffix: string,
): string {
  return domain + "." + printerEntityIdPart + suffix;
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

export function getPrinterSwitchStateObj(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
): HassEntity | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "switch",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return stateObj;
}

export function getPrinterSwitchState(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  onValue: string | boolean = true,
  offValue: string | boolean = false,
): string | boolean | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "switch",
    suffix,
  );
  return entInfo
    ? getEntityStateBinary(hass, entInfo, onValue, offValue)
    : undefined;
}

export function getPrinterButtonStateObj(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  defaultState: any = "unavailable",
  defaultAttributes: any = {},
): HassEntity {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "button",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return stateObj || { state: defaultState, attributes: defaultAttributes };
}

export function getPrinterDryingButtonStateObj(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
): HassEntity {
  return getPrinterButtonStateObj(
    hass,
    entities,
    printerEntityIdPart,
    suffix,
    "unavailable",
    { duration: 0, temperature: 0 },
  );
}

export function isPrinterButtonStateAvailable(stateObj: HassEntity): boolean {
  return !["unavailable"].includes(stateObj.state) ? true : false;
}

export function getPrinterSensorStateObj(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  defaultState: any = "unavailable",
  defaultAttributes: any = {},
): HassEntity {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "sensor",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return stateObj || { state: defaultState, attributes: defaultAttributes };
}

export function getPrinterSensorStateString(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  titleCase: boolean = false,
): string | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "sensor",
    suffix,
  );
  if (entInfo) {
    const str = getEntityStateString(hass, entInfo);
    if (titleCase) {
      return toTitleCase(str);
    } else {
      return str;
    }
  } else {
    return undefined;
  }
}

export function getPrinterSensorStateFloat(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
): number | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "sensor",
    suffix,
  );
  return entInfo ? getEntityStateFloat(hass, entInfo) : undefined;
}

export function getPrinterBinarySensorState(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  onValue: string | boolean,
  offValue: string | boolean,
): string | boolean | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "binary_sensor",
    suffix,
  );
  return entInfo
    ? getEntityStateBinary(hass, entInfo, onValue, offValue)
    : undefined;
}

export function getPrinterUpdateEntityState(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
): string | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "update",
    suffix,
  );
  if (entInfo) {
    return getEntityStateBinary(
      hass,
      entInfo,
      "Update Available",
      "Up To Date",
    );
  } else {
    return undefined;
  }
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

export function isPrintStatePrinting(printStateString: string): boolean {
  return ["printing", "preheating"].includes(printStateString);
}

export function printStateStatusColor(printStateString: string): string {
  return isPrintStatePrinting(printStateString)
    ? "#4caf50"
    : printStateString === "unknown"
      ? "#f44336"
      : printStateString === "operational" || printStateString === "finished"
        ? "#00bcd4"
        : "#ffc107";
}

export const navigateToPrinter = (
  node: any,
  printerID: string,
  replace: boolean = false,
): void => {
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
): void => {
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

export const formatDuration = (time: number, round: boolean): string => {
  return round
    ? moment.duration(time, "seconds").humanize()
    : ((): string => {
        const t = moment.duration(time, "seconds");

        const d = t.days();
        const h = t.hours();
        const m = t.minutes();
        const s = t.seconds();

        return `${d > 0 ? `${d}d` : ""}${h > 0 ? ` ${h}h` : ""}${m > 0 ? ` ${m}m` : ""}${s > 0 ? ` ${s}s` : ""}`;
      })();
};

export const calculateTimeStat = (
  time: number,
  timeType: CalculatedTimeType,
  round: boolean = false,
  use_24hr: boolean = false,
): string => {
  switch (timeType) {
    case CalculatedTimeType.Remaining:
      return formatDuration(time, round);
    case CalculatedTimeType.ETA:
      return moment()
        .add(time, "seconds")
        .format(use_24hr ? "HH:mm" : "h:mm a");
    case CalculatedTimeType.Elapsed:
      return formatDuration(time, round);
    default:
      return "<unknown>";
  }
};

export function getEntityTotalSeconds(
  timeEntity: HassEntity,
  isSeconds: boolean = false,
): number {
  let result;
  if (timeEntity.state) {
    if (timeEntity.state.includes(", ")) {
      const [days_string, time_string] = timeEntity.state.split(", ");
      const [hours, minutes, seconds] = time_string.split(":");
      const days = days_string.match(/\d+/)[0];
      result =
        +days * 60 * 60 * 24 + +hours * 60 * 60 + +minutes * 60 + +seconds;
    } else if (timeEntity.state.includes(":")) {
      const [hours, minutes, seconds] = timeEntity.state.split(":");
      result = +hours * 60 * 60 + +minutes * 60 + +seconds;
    } else if (isSeconds) {
      const seconds = timeEntity.state;
      result = +seconds;
    } else {
      const minutes = timeEntity.state;
      result = +minutes * 60;
    }
  } else {
    result = 0;
  }
  return result;
}

export const temperatureUnitFromEntity = (
  entity: HassEntity,
): TemperatureUnit => {
  switch (entity.attributes?.unit_of_measurement) {
    case "°C":
      return TemperatureUnit.C;
    case "°F":
      return TemperatureUnit.F;
    default:
      return TemperatureUnit.C;
  }
};

const temperatureMap = {
  [TemperatureUnit.C]: {
    [TemperatureUnit.C]: (t): number => t,
    [TemperatureUnit.F]: (t): number => (t * 9.0) / 5.0 + 32.0,
  },
  [TemperatureUnit.F]: {
    [TemperatureUnit.C]: (t): number => ((t - 32.0) * 5.0) / 9.0,
    [TemperatureUnit.F]: (t): number => t,
  },
};

export const convertTemperature = (
  temperature: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number => {
  if (!temperatureMap[from] || !temperatureMap[from][to]) {
    return -1;
  }

  return temperatureMap[from][to](temperature);
};

export const getEntityTemperature = (
  temperatureEntity: HassEntity,
  temperatureUnit: TemperatureUnit,
  round: boolean = false,
): string => {
  const t: number = parseFloat(temperatureEntity.state);
  const u: TemperatureUnit = temperatureUnitFromEntity(temperatureEntity);
  const tc: number = convertTemperature(t, u, temperatureUnit || u);

  return `${round ? Math.round(tc) : tc.toFixed(2)}°${temperatureUnit || u}`;
};

export function getDefaultMonitoredStats(): PrinterCardStatType[] {
  return [
    PrinterCardStatType.Status,
    PrinterCardStatType.ETA,
    PrinterCardStatType.Elapsed,
    PrinterCardStatType.Remaining,
  ];
}

export function getDefaultFDMMonitoredStats(): PrinterCardStatType[] {
  return [
    ...getDefaultMonitoredStats(),
    PrinterCardStatType.HotendCurrent,
    PrinterCardStatType.BedCurrent,
    PrinterCardStatType.HotendTarget,
    PrinterCardStatType.BedTarget,
  ];
}

export function getPanelBasicMonitoredStats(): PrinterCardStatType[] {
  return [
    ...getDefaultMonitoredStats(),
    PrinterCardStatType.PrinterOnline,
    PrinterCardStatType.Availability,
    PrinterCardStatType.ProjectName,
    PrinterCardStatType.CurrentLayer,
  ];
}

export function getPanelFDMMonitoredStats(): PrinterCardStatType[] {
  return [
    ...getDefaultFDMMonitoredStats(),
    PrinterCardStatType.PrinterOnline,
    PrinterCardStatType.Availability,
    PrinterCardStatType.ProjectName,
    PrinterCardStatType.CurrentLayer,
  ];
}

export function getPanelACEMonitoredStats(): PrinterCardStatType[] {
  return [
    ...getPanelFDMMonitoredStats(),
    PrinterCardStatType.DryingStatus,
    PrinterCardStatType.DryingTime,
  ];
}

export function getDefaultCardConfig(): AnycubicCardConfig {
  return {
    vertical: false,
    round: false,
    use_24hr: true,
    temperatureUnit: TemperatureUnit.C,
    monitoredStats: getDefaultMonitoredStats(),
    scaleFactor: 1,
    slotColors: [],
    showSettingsButton: false,
  };
}

export function undefinedDefault(value: any, defaultValue: any): any {
  return typeof value === "undefined" ? defaultValue : value;
}

export function speedModesFromStateObj(
  speedModeState: HassEntity,
): AnycubicSpeedModes {
  const speedModeAttr: AnycubicSpeedMode[] =
    speedModeState.attributes.available_modes;
  return speedModeAttr.reduce(
    (modes, mode) => ({ ...modes, [mode.mode]: mode.description }),
    {},
  );
}
