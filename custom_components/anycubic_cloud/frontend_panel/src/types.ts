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
