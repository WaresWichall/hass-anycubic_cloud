import {
  HassEntity,
  HassEntityAttributeBase,
  MessageBase,
  Connection,
  HassEntities,
  HassEntity,
  HassServices,
} from "home-assistant-js-websocket";

export interface Dictionary<TValue> {
  [id: string]: TValue;
}

export interface ServiceCallRequest {
  domain: string;
  action: string;
  service: string;
  serviceData?: Record<string, any>;
  target?: {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
  };
}

export interface HassDevice {
  id: string;
  config_entries: string[];
  primary_config_entry: string;
  manufacturer: string | null;
}

export interface HassDeviceList {
  [id: string]: HassDevice;
}

export type HassEntities = HassEntities;
export type HassEntity = HassEntity;

export interface HomeAssistant {
  connection: Connection;
  language: string;
  panels: {
    [name: string]: {
      component_name: string;
      config: { [key: string]: any } | null;
      icon: string | null;
      title: string | null;
      url_path: string;
    };
  };
  devices: HassDeviceList;
  states: HassEntities;
  services: HassServices;
  localize: (key: string, ...args: any[]) => string;
  translationMetadata: {
    fragments: string[];
    translations: {
      [lang: string]: {
        nativeName: string;
        isRTL: boolean;
        fingerprints: { [fragment: string]: string };
      };
    };
  };
  callApi: <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    parameters?: { [key: string]: any },
  ) => Promise<T>;
  callService: (
    domain: ServiceCallRequest["domain"],
    action: ServiceCallRequest["action"],
    service: ServiceCallRequest["service"],
    serviceData?: ServiceCallRequest["serviceData"],
    target?: ServiceCallRequest["target"],
  ) => Promise<void>;
  callWS: <T>(msg: MessageBase) => Promise<T>;
}

export type HassEntityInfo = {
  entity_id: string;
  device_id: string;
  labels: string[];
  translation_key: string;
  platform: string;
  name: string;
};

export type HassEntityInfos = {
  [entity_id: string]: HassEntityInfo;
};

export interface HassPanel {
  config: object;
}

export interface HassRoute {
  prefix: string;
  path: string;
}

export interface HaTextField {
  name: string;
  value: string;
}

export type HaFormData = string | number | boolean | string[];

export interface HaFormBaseSchema {
  name: string;
  default?: HaFormData;
  required?: boolean;
  description?: {
    suffix?: string;
    suggested_value?: HaFormData;
  };
  context?: Record<string, string>;
}

export interface AnycubicFileLocal {
  name: string;
  size_mb: number;
}

export interface AnycubicFileCloud extends AnycubicFileLocal {
  id: number;
}

export interface AnycubicFileListEntity extends HassEntity {
  attributes: HassEntityAttributeBase & {
    file_info?: AnycubicFileLocal[];
  };
}

export interface AnycubicCloudFileListEntity extends HassEntity {
  attributes: HassEntityAttributeBase & {
    file_info?: AnycubicFileCloud[];
  };
}

export enum CalculatedTimeType {
  ETA = "ETA",
  Elapsed = "Elapsed",
  Remaining = "Remaining",
}

export enum TemperatureUnit {
  F = "F",
  C = "C",
}

export enum StatTypeGeneral {
  Status = "Status",
  PrinterOnline = "Online",
  Availability = "Availability",
  ProjectName = "Project",
  CurrentLayer = "Layer",
}

export enum StatTypeFDM {
  HotendCurrent = "Hotend",
  BedCurrent = "Bed",
  HotendTarget = "T Hotend",
  BedTarget = "T Bed",
  DryingStatus = "Dry Status",
  DryingTime = "Dry Time",
  SpeedMode = "Speed Mode",
  FanSpeed = "Fan Speed",
}

export enum StatTypeACE {
  DryingStatus = "Dry Status",
  DryingTime = "Dry Time",
}

export enum StatTypeLCD {
  OnTime = "On Time",
  OffTime = "Off Time",
  BottomTime = "Bottom Time",
  ModelHeight = "Model Height",
  BottomLayers = "Bottom Layers",
  ZUpHeight = "Z Up Height",
  ZUpSpeed = "Z Up Speed",
  ZDownSpeed = "Z Down Speed",
}

export const PrinterCardStatType = {
  ...CalculatedTimeType,
  ...StatTypeGeneral,
  ...StatTypeFDM,
  ...StatTypeACE,
  ...StatTypeLCD,
};
export type PrinterCardStatType = typeof PrinterCardStatType;

export interface AnimatedPrinterBasicDimension {
  width: number;
  height: number;
}

export interface AnimatedPrinterXYDimension {
  X: number;
  Y: number;
}

export interface AnimatedPrinterLTDimension
  extends AnimatedPrinterBasicDimension {
  left: number;
  top: number;
}

export interface AnimatedPrinterLTWidth {
  width: number;
  left: number;
  top: number;
}

export interface AnimatedPrinterBuildPlateDimension {
  maxWidth: number;
  maxHeight: number;
  verticalOffset: number;
}

export interface AnimatedPrinterAxisConfig
  extends AnimatedPrinterBasicDimension {
  stepper: boolean;
  offsetLeft: number;
  extruder: AnimatedPrinterBasicDimension;
}

export interface AnimatedPrinterConfig {
  top: AnimatedPrinterBasicDimension;
  bottom: AnimatedPrinterBasicDimension;
  left: AnimatedPrinterBasicDimension;
  right: AnimatedPrinterBasicDimension;
  buildplate: AnimatedPrinterBuildPlateDimension;
  xAxis: AnimatedPrinterAxisConfig;
}

export interface AnimatedPrinterDimensions {
  Scalable: AnimatedPrinterBasicDimension;
  Frame: AnimatedPrinterBasicDimension;
  Hole: AnimatedPrinterLTDimension;
  BuildArea: AnimatedPrinterLTDimension;
  BuildPlate: AnimatedPrinterLTWidth;
  XAxis: AnimatedPrinterLTDimension;
  Track: AnimatedPrinterBasicDimension;
  Basis: AnimatedPrinterXYDimension;
  Gantry: AnimatedPrinterLTDimension;
  Nozzle: AnimatedPrinterLTDimension;
  GantryMaxLeft: number;
}

export interface AnycubicSpoolInfo {
  material_type: string;
  color: number[];
  status: number;
  spool_loaded: boolean;
}

export interface AnycubicSpeedMode {
  description: string;
  mode: number;
}

export interface SelectDropdownProps {
  [key: any]: string;
}

export interface AnycubicSpeedModes {
  [key: number]: string;
}

export interface AnycubicCardConfig {
  printer_id?: string;
  vertical?: boolean;
  round?: boolean;
  use_24hr?: boolean;
  temperatureUnit?: TemperatureUnit;
  lightEntityId?: string;
  powerEntityId?: string;
  cameraEntityId?: string;
  monitoredStats?: PrinterCardStatType[];
  scaleFactor?: number;
  slotColors?: string[];
  showSettingsButton?: boolean;
  alwaysShow?: boolean;
}

export enum AnycubicMaterialType {
  PLA = "PLA",
  PETG = "PETG",
  ABS = "ABS",
  PACF = "PACF",
  PC = "PC",
  ASA = "ASA",
  HIPS = "HIPS",
  PA = "PA",
  PLA_SE = "PLA_SE",
}

export enum AnycubicPrintOptionConfirmationType {
  PAUSE = "pause",
  RESUME = "resume",
  CANCEL = "cancel",
}

export interface TranslationDict {
  [id: string]: string;
}
