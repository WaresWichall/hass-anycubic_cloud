import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { localize } from "../../../../localize/localize";

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
  public language!: string;

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

  @state()
  private _tabMain: string;

  @state()
  private _tabStats: string;

  @state()
  private _tabColours: string;

  @state()
  private _labelPrinter_id: string;

  @state()
  private _labelVertical: string;

  @state()
  private _labelRound: string;

  @state()
  private _labelUse_24hr: string;

  @state()
  private _labelShowSettingsButton: string;

  @state()
  private _labelAlwaysShow: string;

  @state()
  private _labelTemperatureUnit: string;

  @state()
  private _labelLightEntityId: string;

  @state()
  private _labelPowerEntityId: string;

  @state()
  private _labelCameraEntityId: string;

  @state()
  private _labelScaleFactor: string;

  @state()
  private _labelSlotColors: string;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._tabMain = localize("card.configure.tabs.main", this.language);
      this._tabStats = localize("card.configure.tabs.stats", this.language);
      this._tabColours = localize("card.configure.tabs.colours", this.language);
      this._labelPrinter_id = localize(
        "card.configure.labels.printer_id",
        this.language,
      );
      this._labelVertical = localize(
        "card.configure.labels.vertical",
        this.language,
      );
      this._labelRound = localize("card.configure.labels.round", this.language);
      this._labelUse_24hr = localize(
        "card.configure.labels.use_24hr",
        this.language,
      );
      this._labelShowSettingsButton = localize(
        "card.configure.labels.show_settings_button",
        this.language,
      );
      this._labelAlwaysShow = localize(
        "card.configure.labels.always_show",
        this.language,
      );
      this._labelTemperatureUnit = localize(
        "card.configure.labels.temperature_unit",
        this.language,
      );
      this._labelLightEntityId = localize(
        "card.configure.labels.light_entity_id",
        this.language,
      );
      this._labelPowerEntityId = localize(
        "card.configure.labels.power_entity_id",
        this.language,
      );
      this._labelCameraEntityId = localize(
        "card.configure.labels.camera_entity_id",
        this.language,
      );
      this._labelScaleFactor = localize(
        "card.configure.labels.scale_factor",
        this.language,
      );
      this._labelSlotColors = localize(
        "card.configure.labels.slot_colors",
        this.language,
      );
    }

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

    if (
      changedProperties.has("printers") ||
      changedProperties.has("language")
    ) {
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
          <paper-tab page-name="main">${this._tabMain}</paper-tab>
          <paper-tab page-name="stats">${this._tabStats}</paper-tab>
          ${this.hasColorbox
            ? html`<paper-tab page-name="colours">
                ${this._tabColours}
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
        return this._labelPrinter_id;
      case "vertical":
        return this._labelVertical;
      case "round":
        return this._labelRound;
      case "use_24hr":
        return this._labelUse_24hr;
      case "showSettingsButton":
        return this._labelShowSettingsButton;
      case "alwaysShow":
        return this._labelAlwaysShow;
      case "temperatureUnit":
        return this._labelTemperatureUnit;
      case "lightEntityId":
        return this._labelLightEntityId;
      case "powerEntityId":
        return this._labelPowerEntityId;
      case "cameraEntityId":
        return this._labelCameraEntityId;
      case "scaleFactor":
        return this._labelScaleFactor;
      case "slotColors":
        return this._labelSlotColors;
      default:
        return this._labelPrinter_id;
    }
  };

  private _computeSchemaMain(): HaFormBaseSchema[] {
    if (!this.printers) {
      return [];
    }
    const printerOptions = Object.keys(this.printers).map(
      (printerID, _index) => ({
        value: printerID,
        label: this.printers[printerID].name,
      }),
    );
    return [
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
    ];
  }

  private _computeSchemaColours(): HaFormBaseSchema[] {
    return this.printers
      ? [
          {
            name: "slotColors",
            description: this._labelSlotColors,
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
