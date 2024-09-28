import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import {
  CAMERA_ENTITY_DOMAINS,
  LIGHT_ENTITY_DOMAINS,
  SWITCH_ENTITY_DOMAINS,
} from "../../../const";

import { fireEvent } from "../../../fire_event";

import {
  getDefaultCardConfig,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterSensorStateObj,
  isLCDPrinter,
} from "../../../helpers";

import {
  AnycubicCardConfig,
  CalculatedTimeType,
  HassDeviceList,
  HassEntityInfos,
  HaFormBaseSchema,
  HomeAssistant,
  PrinterCardStatType,
  StatTypeGeneral,
  StatTypeFDM,
  StatTypeACE,
  StatTypeLCD,
  TemperatureUnit,
} from "../../../types";

import "../../ui/multi-select-reorder.ts";

const defaultConfig = getDefaultCardConfig();

@customElement("anycubic-printercard-configure")
export class AnycubicPrintercardConfigure extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public cardConfig!: AnycubicCardConfig;

  @property()
  public printers!: HassDeviceList;

  @state()
  private configPage: string = "main";

  @state()
  private availableStats: PrinterCardStatType[] = [];

  @state()
  private formSchemaMain: HaFormBaseSchema[] = [];

  @state()
  private formSchemaColours: HaFormBaseSchema[] = [];

  @state()
  private printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  @state({ type: Boolean })
  private hasColorbox: boolean = false;

  @state({ type: Boolean })
  private isLCD: boolean = false;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") || changedProperties.has("cardConfig")) {
      this.printerEntities = getPrinterEntities(
        this.hass,
        this.cardConfig.printer_id,
      );

      this.printerEntityIdPart = getPrinterEntityIdPart(this.printerEntities);

      this.isLCD = isLCDPrinter(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
      );
      this.hasColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "ace_spools",
          "inactive",
        ).state === "active";
      this.availableStats = {
        ...StatTypeGeneral,
        ...CalculatedTimeType,
      };
      if (this.isLCD) {
        this.availableStats = {
          ...this.availableStats,
          ...StatTypeLCD,
        };
      } else {
        this.availableStats = {
          ...this.availableStats,
          ...StatTypeFDM,
        };
      }
      if (this.hasColorbox) {
        this.availableStats = {
          ...this.availableStats,
          ...StatTypeACE,
        };
      }
    }

    if (changedProperties.has("printers")) {
      this.formSchemaMain = this._computeSchemaMain();
      this.formSchemaColours = this._computeSchemaColours();
    }
  }

  render(): any {
    return html`
      <div class="ac-printer-card-configure-cont">
        ${this._renderMenu()} ${this._renderConfMain()}
        ${this._renderConfColours()} ${this._renderConfStats()}
      </div>
    `;
  }

  private _renderConfMain(): any {
    return this.configPage === "main"
      ? html`
          <div class="ac-printer-card-configure-conf">
            <ha-form
              .hass=${this.hass}
              .data=${this.cardConfig}
              .schema=${this.formSchemaMain}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._formValueChanged}
            ></ha-form>
          </div>
        `
      : nothing;
  }

  private _renderConfStats(): any {
    return this.configPage === "stats"
      ? html`
          <div class="ac-printer-card-configure-conf">
            <p class="ac-cconf-label">Choose Monitored Stats</p>
            <anycubic-ui-multi-select-reorder
              .availableOptions=${this.availableStats}
              .initialItems=${this.cardConfig.monitoredStats}
              .onChange=${(sel: any[]): void => this._selectedStatsChanged(sel)}
            ></anycubic-ui-multi-select-reorder>
          </div>
        `
      : nothing;
  }

  private _renderConfColours(): any {
    return this.configPage === "colours"
      ? html`
          <div class="ac-printer-card-configure-conf">
            <ha-form
              .hass=${this.hass}
              .data=${this.cardConfig}
              .schema=${this.formSchemaColours}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._formValueChanged}
            ></ha-form>
          </div>
        `
      : nothing;
  }

  private _renderMenu(): HTMLElement {
    return html`
      <div class="header">
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${this.configPage}
          @iron-activate=${this._handlePageSelected}
        >
          <paper-tab page-name="main"> Main </paper-tab>
          <paper-tab page-name="stats"> Stats </paper-tab>
          ${this.hasColorbox
            ? html`<paper-tab page-name="colours">
                ACE Colour Presets
              </paper-tab>`
            : nothing}
        </ha-tabs>
      </div>
    `;
  }

  private _handlePageSelected = (ev): void => {
    const newPage = ev.detail.item.getAttribute("page-name");
    if (newPage !== this.configPage) {
      this.configPage = newPage;
    }
  };

  private _selectedStatsChanged(selected: any[]): void {
    this.cardConfig.monitoredStats = selected;
    this._configChanged(this.cardConfig);
  }

  private _configChanged(newConfig: AnycubicCardConfig): void {
    const filteredConfig = Object.keys(newConfig)
      .filter((key) => newConfig[key] !== defaultConfig[key])
      .reduce((fConf, key) => {
        fConf[key] = newConfig[key];
        return fConf;
      }, {});
    fireEvent(this, "config-changed", { config: filteredConfig });
  }

  private _formValueChanged(ev: Event): void {
    this.cardConfig = ev.detail.value;
    this._configChanged(this.cardConfig);
  }

  private _computeLabel = (schema: HaFormBaseSchema): string => {
    switch (schema.name) {
      case "printer_id":
        return "Select Printer";
      case "vertical":
        return "Vertical Layout?";
      case "round":
        return "Round Stats?";
      case "use_24hr":
        return "Use 24hr Time?";
      case "showSettingsButton":
        return "Always show print settings button?";
      case "alwaysShow":
        return "Always show card?";
      case "temperatureUnit":
        return "Temperature Unit";
      case "lightEntityId":
        return "Light Entity";
      case "powerEntityId":
        return "Power Entity";
      case "cameraEntityId":
        return "Camera Entity";
      case "scaleFactor":
        return "Scale Factor";
      case "slotColors":
        return "Slot Colour Presets";
      default:
        return "Select Printer";
    }
  };

  private _computeSchemaMain(): HaFormBaseSchema[] {
    const printerOptions = Object.keys(this.printers).map(
      (printerID, _index) => ({
        value: printerID,
        label: this.printers[printerID].name,
      }),
    );
    return this.printers
      ? [
          {
            name: "printer_id",
            selector: {
              select: {
                options: printerOptions,
                mode: "dropdown",
                multiple: false,
              },
            },
          },
          {
            name: "vertical",
            selector: { boolean: {} },
          },
          {
            name: "round",
            selector: { boolean: {} },
          },
          {
            name: "use_24hr",
            selector: { boolean: {} },
          },
          {
            name: "temperatureUnit",
            selector: {
              select: {
                options: [
                  {
                    value: TemperatureUnit.C,
                    label: `°${TemperatureUnit.C}`,
                  },
                  {
                    value: TemperatureUnit.F,
                    label: `°${TemperatureUnit.F}`,
                  },
                ],
                mode: "list",
                multiple: false,
              },
            },
          },
          {
            name: "alwaysShow",
            selector: { boolean: {} },
          },
          {
            name: "showSettingsButton",
            selector: { boolean: {} },
          },
          {
            name: "scaleFactor",
            selector: {
              select: {
                options: [
                  {
                    value: 1,
                    label: "1",
                  },
                  {
                    value: 0.75,
                    label: "0.75",
                  },
                  {
                    value: 0.5,
                    label: "0.5",
                  },
                ],
                mode: "list",
                multiple: false,
              },
            },
          },
          {
            name: "lightEntityId",
            selector: { entity: { domain: LIGHT_ENTITY_DOMAINS } },
          },
          {
            name: "powerEntityId",
            selector: { entity: { domain: SWITCH_ENTITY_DOMAINS } },
          },
          {
            name: "cameraEntityId",
            selector: { entity: { domain: CAMERA_ENTITY_DOMAINS } },
          },
        ]
      : [];
  }

  private _computeSchemaColours(): HaFormBaseSchema[] {
    return this.printers
      ? [
          {
            name: "slotColors",
            description: "Slot Colour Presets",
            selector: {
              text: {
                multiple: true,
              },
            },
          },
        ]
      : [];
  }

  static get styles(): any {
    return css`
      :host {
        display: block;
      }

      .header {
        color: var(--primary-text-color);
      }

      ha-tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --paper-tabs-selection-bar-color: var(--primary-color);
        text-transform: uppercase;
      }

      .ac-printer-card-configure-conf {
        margin-top: 10px;
      }

      .ac-cconf-label {
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 14px;
      }
    `;
  }
}
