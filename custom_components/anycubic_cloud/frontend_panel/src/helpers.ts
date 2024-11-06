import moment, { duration as momentDuration } from "moment";

import { fireEvent } from "./fire_event";
import {
  AnycubicCardConfig,
  AnycubicLitNode,
  AnycubicMaterialType,
  AnycubicSpeedMode,
  AnycubicSpeedModeEntity,
  AnycubicSpeedModes,
  CalculatedTimeType,
  HassDevice,
  HassDeviceList,
  HassEmptyEntity,
  HassEntity,
  HassEntityInfo,
  HassEntityInfos,
  HassRoute,
  HomeAssistant,
  PrinterCardStatType,
  TemperatureUnit,
} from "./types";

const stylePxKeys = ["width", "height", "left", "top"];

export function updateElementStyleWithObject(
  el: HTMLElement | undefined,
  updateObj: any, // eslint-disable-line
): void {
  Object.keys(updateObj as object).forEach((key) => {
    // eslint-disable-next-line
    if (stylePxKeys.includes(key) && !isNaN(updateObj[key])) {
      // eslint-disable-next-line
      updateObj[key] = (updateObj[key].toString()) + "px";
    }
  });
  if (el) {
    Object.assign(el.style, updateObj);
  }
}

export function createEmptyEntity(entityParams: HassEmptyEntity): HassEntity {
  return {
    state: entityParams.state,
    attributes: entityParams.attributes,
    entity_id: "invalid_domain.invalid_entity",
    last_changed: "",
    last_updated: "",
    context: {
      id: "",
      parent_id: null,
      user_id: null,
    },
  };
}

export function numberFromString(str: string): number {
  const matches = str.match(/\d+/);
  return Number(matches ? matches[0] : -1);
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function buildImageUrlFromEntity(entityState: HassEntity): string {
  const token: string = entityState.attributes.access_token as string;
  return `${window.location.origin}/api/image_proxy/${entityState.entity_id}?token=${token}`;
}

export function buildCameraUrlFromEntity(entityState: HassEntity): string {
  const token: string = entityState.attributes.access_token as string;
  return `${window.location.origin}/api/camera_proxy_stream/${entityState.entity_id}?token=${token}`;
}

export function prettyFilename(str: string): string {
  const splitI = str.indexOf("-0.");
  const splitName =
    splitI > 0 ? [str.slice(0, splitI), str.slice(splitI + 1)] : [str];
  const chunksFirst = splitName[0].match(/.{1,10}/g);
  const joinFirst = chunksFirst ? chunksFirst.join("\n") : splitName[0];
  return splitName.length > 1
    ? joinFirst + "-" + splitName.slice(1)[0]
    : joinFirst;
}

export function getEntityState(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo | undefined,
): HassEntity | undefined {
  return entityInfo ? hass.states[entityInfo.entity_id] : undefined;
}

export function getEntityStateFloat(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo | undefined,
): number {
  const entityState = getEntityState(hass, entityInfo);
  const stateFloat = entityState ? parseFloat(entityState.state) : 0;
  return !isNaN(stateFloat) ? stateFloat : 0;
}

export function getEntityStateString(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo | undefined,
): string {
  const entityState = getEntityState(hass, entityInfo);
  return entityState ? String(entityState.state) : "";
}

export function getEntityStateBinary(
  hass: HomeAssistant,
  entityInfo: HassEntityInfo | undefined,
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
  deviceID: string | undefined,
): HassEntityInfos {
  const entities: HassEntityInfos = {};
  if (deviceID) {
    for (const key in hass.entities) {
      const ent = hass.entities[key];

      if (ent.device_id === deviceID) {
        entities[ent.entity_id] = ent;
      }
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
  return domain + "." + String(printerEntityIdPart) + suffix;
}

export function getStrictMatchingEntity(
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  match_domain: string,
  match_suffix: string,
): HassEntityInfo | undefined {
  if (!printerEntityIdPart) {
    return undefined;
  }
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
  defaultState: string | number = "unavailable",
  defaultAttributes: object = {},
): HassEntity {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "button",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return (
    stateObj ||
    createEmptyEntity({
      state: String(defaultState),
      attributes: defaultAttributes,
    })
  );
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
  return !["unavailable"].includes(stateObj.state);
}

export function getPrinterImageStateUrl(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
): string | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "image",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return stateObj ? buildImageUrlFromEntity(stateObj) : undefined;
}

export function getPrinterSensorStateObj(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
  suffix: string,
  defaultState: string | number = "unavailable",
  defaultAttributes: object = {},
): HassEntity {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "sensor",
    suffix,
  );
  const stateObj = getEntityState(hass, entInfo);
  return (
    stateObj ||
    createEmptyEntity({
      state: String(defaultState),
      attributes: defaultAttributes,
    })
  );
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
  undefValue: string | boolean | undefined = undefined,
): string | boolean | undefined {
  const entInfo = getStrictMatchingEntity(
    entities,
    printerEntityIdPart,
    "binary_sensor",
    suffix,
  );
  return entInfo
    ? getEntityStateBinary(hass, entInfo, onValue, offValue)
    : undefValue;
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
    ) as string;
  } else {
    return undefined;
  }
}

export function isFDMPrinter(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
): boolean {
  return (
    getPrinterSensorStateObj(
      hass,
      entities,
      printerEntityIdPart,
      "current_status",
    ).attributes.material_type === "Filament"
  );
}

export function isLCDPrinter(
  hass: HomeAssistant,
  entities: HassEntityInfos,
  printerEntityIdPart: string | undefined,
): boolean {
  return (
    getPrinterSensorStateObj(
      hass,
      entities,
      printerEntityIdPart,
      "current_status",
    ).attributes.material_type === "Resin"
  );
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
  return printer ? printer.serial_number : undefined;
}

export function getPage(route: HassRoute): string {
  const pathParts = route.path.split("/");
  return pathParts.length > 2 ? pathParts[2] : "main";
}

export function isPrintStatePrinting(printStateString: string): boolean {
  return [
    "printing",
    "preheating",
    "paused",
    "downloading",
    "checking",
  ].includes(printStateString);
}

export function printStateStatusColor(printStateString: string): string {
  if (printStateString === "preheating") {
    return "#ffc107";
  } else if (isPrintStatePrinting(printStateString)) {
    return "#4caf50";
  } else if (printStateString === "unknown") {
    return "#f44336";
  } else if (
    printStateString === "operational" ||
    printStateString === "finished"
  ) {
    return "#00bcd4";
  } else {
    return "#f44336";
  }
}

export const navigateToPrinter = (
  node: AnycubicLitNode,
  printerID: string,
  replace: boolean = false,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const prefix: string = node.route.prefix;
  const endpoint = printerID ? `${printerID}/main` : "";
  const url = `${prefix}/${endpoint}`;
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
  node: AnycubicLitNode,
  path: string,
  replace: boolean = false,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const prefix: string = node.route.prefix;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const printerID = getPrinterDevID(node.route);
  const endpoint = printerID ? `${printerID}/${path}` : "";
  const url = `${prefix}/${endpoint}`;
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
    ? momentDuration(time, "seconds").humanize()
    : ((): string => {
        const t = momentDuration(time, "seconds");

        const d = t.days();
        const h = t.hours();
        const m = t.minutes();
        const s = t.seconds();

        return `${d > 0 ? `${d}d` : ""}${h > 0 ? ` ${h}h` : ""}${m > 0 ? ` ${m}m` : ""}${s > 0 ? ` ${s}s` : "0s"}`;
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
  let result: number;
  if (timeEntity.state) {
    if (timeEntity.state.includes(", ")) {
      const [days_string, time_string] = timeEntity.state.split(", ");
      const [hours, minutes, seconds] = time_string.split(":");
      const day_match = days_string.match(/\d+/);
      const days = day_match ? day_match[0] : 0;
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
  switch (entity.attributes.unit_of_measurement) {
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
    [TemperatureUnit.C]: (t: number): number => t,
    [TemperatureUnit.F]: (t: number): number => (t * 9.0) / 5.0 + 32.0,
  },
  [TemperatureUnit.F]: {
    [TemperatureUnit.C]: (t: number): number => ((t - 32.0) * 5.0) / 9.0,
    [TemperatureUnit.F]: (t: number): number => t,
  },
};

export const convertTemperature = (
  temperature: number,
  from: TemperatureUnit,
  to: TemperatureUnit,
): number => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!temperatureMap[from] || !temperatureMap[from][to]) {
    return -1;
  }

  return temperatureMap[from][to](temperature);
};

export const getEntityTemperature = (
  temperatureEntity: HassEntity,
  temperatureUnit: TemperatureUnit | undefined,
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
    alwaysShow: false,
  };
}

// eslint-disable-next-line
export function undefinedDefault(value: any, defaultValue: any): any {
  return typeof value === "undefined" ? defaultValue : value;
}

export function speedModesFromStateObj(
  speedModeState: AnycubicSpeedModeEntity,
): AnycubicSpeedModes {
  const speedModeAttr: AnycubicSpeedMode[] =
    (speedModeState.attributes.available_modes as
      | AnycubicSpeedMode[]
      | undefined) ?? [];
  return speedModeAttr.reduce(
    (modes, mode) => ({ ...modes, [mode.mode]: mode.description }),
    {},
  );
}

export function materialTypeFromString(
  material_type?: string,
): AnycubicMaterialType | undefined {
  return material_type &&
    (Object.values(AnycubicMaterialType) as string[]).includes(material_type)
    ? AnycubicMaterialType[material_type.toUpperCase() as AnycubicMaterialType]
    : undefined;
}
