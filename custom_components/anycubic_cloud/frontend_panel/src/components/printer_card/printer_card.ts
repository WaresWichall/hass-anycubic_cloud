import { LitElement, html, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import {
  AnycubicCardConfig,
  HassDevice,
  HassDeviceList,
  HomeAssistant,
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

const defaultConfig = getDefaultCardConfig();

@customElement("anycubic-card-editor")
export class AnycubicPrintercardEditor extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public config: AnycubicCardConfig = {};

  @state()
  private printers?: HassDeviceList;

  async firstUpdated(): void {
    this.printers = await getPrinterDevices(this.hass);
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("config")) {
      this.config.vertical = undefinedDefault(
        this.config.vertical,
        defaultConfig.vertical,
      );
      this.config.round = undefinedDefault(
        this.config.round,
        defaultConfig.round,
      );
      this.config.use_24hr = undefinedDefault(
        this.config.use_24hr,
        defaultConfig.use_24hr,
      );
      this.config.temperatureUnit = undefinedDefault(
        this.config.temperatureUnit,
        defaultConfig.temperatureUnit,
      );
      this.config.monitoredStats = undefinedDefault(
        this.config.monitoredStats,
        defaultConfig.monitoredStats,
      );
    }
  }

  public setConfig(config): void {
    this.config = config;
  }

  render(): any {
    return html`
      <anycubic-printercard-configure
        .hass=${this.hass}
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
  private selectedPrinterID: string | undefined;

  @state()
  private selectedPrinterDevice: HassDevice | undefined;

  @state({ type: Boolean })
  private vertical?: boolean;

  @state({ type: Boolean })
  private round?: boolean;

  @state({ type: Boolean })
  private use_24hr?: boolean;

  @state({ type: String })
  private temperatureUnit: TemperatureUnit | undefined;

  @state({ type: String })
  private lightEntityId?: string | undefined;

  @state({ type: String })
  private powerEntityId?: string | undefined;

  @state({ type: String })
  private cameraEntityId?: string | undefined;

  @state()
  private monitoredStats: PrinterCardStatType[] | undefined;

  async firstUpdated(): void {
    this.printers = await getPrinterDevices(this.hass);
    this.requestUpdate();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("config") || changedProperties.has("printers")) {
      this.vertical = undefinedDefault(
        this.config.vertical,
        defaultConfig.vertical,
      );
      this.round = undefinedDefault(this.config.round, defaultConfig.round);
      this.use_24hr = undefinedDefault(
        this.config.use_24hr,
        defaultConfig.use_24hr,
      );
      this.temperatureUnit = undefinedDefault(
        this.config.temperatureUnit,
        defaultConfig.temperatureUnit,
      );
      this.lightEntityId = this.config.lightEntityId;
      this.powerEntityId = this.config.powerEntityId;
      this.cameraEntityId = this.config.cameraEntityId;
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

  public setConfig(config): void {
    this.config = config;
  }

  render(): any {
    return html`
      <anycubic-printercard-card
        .hass=${this.hass}
        .monitoredStats=${this.config.monitoredStats}
        .selectedPrinterID=${this.selectedPrinterID}
        .selectedPrinterDevice=${this.selectedPrinterDevice}
        .vertical=${this.vertical}
        .round=${this.round}
        .use_24hr=${this.use_24hr}
        .temperatureUnit=${this.temperatureUnit}
        .lightEntityId=${this.lightEntityId}
        .powerEntityId=${this.powerEntityId}
        .cameraEntityId=${this.cameraEntityId}
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

window.customCards = window.customCards || [];
window.customCards.push({
  type: "anycubic-card",
  name: "Anycubic Card",
  preview: true,
  description: "Anycubic Cloud Integration Card",
});
