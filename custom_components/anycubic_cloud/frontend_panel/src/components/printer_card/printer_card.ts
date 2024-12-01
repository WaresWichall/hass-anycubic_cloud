import { LitElement, PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import * as pkgjson from "../../../package.json";

import {
  AnycubicCardConfig,
  CustomCardsWindow,
  HassDevice,
  HassDeviceList,
  HomeAssistant,
  LitTemplateResult,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../types";

import {
  getDefaultCardConfig,
  getPrinterDevices,
  getSelectedPrinter,
  undefinedDefault,
} from "../../helpers";

import "./card/card.ts";
import "./configure/configure.ts";

window.console.info(
  `%c ANYCUBIC-CARD %c v${pkgjson.version} `,
  "color: orange; font-weight: bold; background: black",
  "color: white; font-weight: bold; background: dimgray",
);

const defaultConfig = getDefaultCardConfig();

@customElement("anycubic-card-editor")
export class AnycubicPrintercardEditor extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public config: AnycubicCardConfig = {};

  @state()
  private printers?: HassDeviceList;

  @state()
  private language: string;

  // eslint-disable-next-line @typescript-eslint/require-await
  async firstUpdated(): Promise<void> {
    this.printers = getPrinterDevices(this.hass);
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
    }

    if (changedProperties.has("config")) {
      this.config.vertical = undefinedDefault(
        this.config.vertical,
        defaultConfig.vertical,
      ) as boolean;
      this.config.round = undefinedDefault(
        this.config.round,
        defaultConfig.round,
      ) as boolean;
      this.config.use_24hr = undefinedDefault(
        this.config.use_24hr,
        defaultConfig.use_24hr,
      ) as boolean;
      this.config.alwaysShow = undefinedDefault(
        this.config.alwaysShow,
        defaultConfig.alwaysShow,
      ) as boolean;
      this.config.showSettingsButton = undefinedDefault(
        this.config.showSettingsButton,
        defaultConfig.showSettingsButton,
      ) as boolean;
      this.config.temperatureUnit = undefinedDefault(
        this.config.temperatureUnit,
        defaultConfig.temperatureUnit,
      ) as TemperatureUnit;
      this.config.monitoredStats = undefinedDefault(
        this.config.monitoredStats,
        defaultConfig.monitoredStats,
      ) as PrinterCardStatType[];
      this.config.slotColors = undefinedDefault(
        this.config.slotColors,
        defaultConfig.slotColors,
      ) as string[];
      this.config.scaleFactor = undefinedDefault(
        this.config.scaleFactor,
        defaultConfig.scaleFactor,
      ) as number;
    }
  }

  public setConfig(config: AnycubicCardConfig): void {
    this.config = config;
  }

  render(): LitTemplateResult {
    return html`
      <anycubic-printercard-configure
        .hass=${this.hass}
        .language=${this.language}
        .printers=${this.printers}
        .cardConfig=${this.config}
      ></anycubic-printercard-configure>
    `;
  }
}

@customElement("anycubic-card")
export class AnycubicCard extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public config: AnycubicCardConfig = {};

  @state()
  private printers?: HassDeviceList;

  @state()
  private language: string;

  @state()
  private selectedPrinterID: string | undefined;

  @state()
  private selectedPrinterDevice: HassDevice | undefined;

  @state()
  private vertical?: boolean;

  @state()
  private round?: boolean;

  @state()
  private use_24hr?: boolean;

  @state()
  private showSettingsButton?: boolean;

  @state()
  private alwaysShow?: boolean;

  @state()
  private temperatureUnit: TemperatureUnit | undefined;

  @state()
  private lightEntityId?: string | undefined;

  @state()
  private powerEntityId?: string | undefined;

  @state()
  private cameraEntityId?: string | undefined;

  @state()
  private scaleFactor?: number | undefined;

  @state()
  private slotColors?: string[];

  @state()
  private monitoredStats: PrinterCardStatType[] | undefined;

  // eslint-disable-next-line @typescript-eslint/require-await
  async firstUpdated(): Promise<void> {
    this.printers = getPrinterDevices(this.hass);
    this.requestUpdate();
  }

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
    }

    if (changedProperties.has("config") || changedProperties.has("printers")) {
      this.vertical = undefinedDefault(
        this.config.vertical,
        defaultConfig.vertical,
      ) as boolean;
      this.round = undefinedDefault(
        this.config.round,
        defaultConfig.round,
      ) as boolean;
      this.use_24hr = undefinedDefault(
        this.config.use_24hr,
        defaultConfig.use_24hr,
      ) as boolean;
      this.alwaysShow = undefinedDefault(
        this.config.alwaysShow,
        defaultConfig.alwaysShow,
      ) as boolean;
      this.showSettingsButton = undefinedDefault(
        this.config.showSettingsButton,
        defaultConfig.showSettingsButton,
      ) as boolean;
      this.temperatureUnit = undefinedDefault(
        this.config.temperatureUnit,
        defaultConfig.temperatureUnit,
      ) as TemperatureUnit;
      this.lightEntityId = this.config.lightEntityId;
      this.powerEntityId = this.config.powerEntityId;
      this.cameraEntityId = this.config.cameraEntityId;
      this.scaleFactor = this.config.scaleFactor;
      this.slotColors = this.config.slotColors;
      this.monitoredStats = this.config.monitoredStats;
      if (this.config.printer_id && this.printers) {
        this.selectedPrinterID = this.config.printer_id;
        this.selectedPrinterDevice = getSelectedPrinter(
          this.printers,
          this.config.printer_id,
        );
      }
    }
  }

  public setConfig(config: AnycubicCardConfig): void {
    this.config = config;
  }

  render(): LitTemplateResult {
    return html`
      <anycubic-printercard-card
        .hass=${this.hass}
        .language=${this.language}
        .monitoredStats=${this.config.monitoredStats}
        .selectedPrinterID=${this.selectedPrinterID}
        .selectedPrinterDevice=${this.selectedPrinterDevice}
        .vertical=${this.vertical}
        .round=${this.round}
        .use_24hr=${this.use_24hr}
        .showSettingsButton=${this.showSettingsButton}
        .alwaysShow=${this.alwaysShow}
        .temperatureUnit=${this.temperatureUnit}
        .lightEntityId=${this.lightEntityId}
        .powerEntityId=${this.powerEntityId}
        .cameraEntityId=${this.cameraEntityId}
        .scaleFactor=${this.scaleFactor}
        .slotColors=${this.slotColors}
      ></anycubic-printercard-card>
    `;
  }

  public getCardSize(): number {
    return 2;
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("anycubic-card-editor");
  }

  static getStubConfig(
    hass: HomeAssistant,
    _entities: string[],
    _entitiesFallback: string[],
  ): AnycubicCardConfig {
    return { printer_id: Object.keys(getPrinterDevices(hass))[0] };
  }
}

const customCardsWindow = window as CustomCardsWindow;

customCardsWindow.customCards = customCardsWindow.customCards || [];
customCardsWindow.customCards.push({
  type: "anycubic-card",
  name: "Anycubic Card",
  preview: true,
  description: "Anycubic Cloud Integration Card",
});
