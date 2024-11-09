import { mdiCog, mdiLightbulbOff, mdiLightbulbOn, mdiPower } from "@mdi/js";
import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { animate, Options as motionOptions } from "@lit-labs/motion";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { fireEvent } from "../../../fire_event";

import {
  HassDevice,
  HassEntity,
  HassEntityInfos,
  HomeAssistant,
  LitTemplateResult,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../../types";

import {
  getDefaultMonitoredStats,
  getEntityState,
  getEntityStateBinary,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterSensorStateObj,
  isPrintStatePrinting,
  printStateStatusColor,
  undefinedDefault,
} from "../../../helpers";

import "../camera_view/camera_view.ts";
import "../multicolorbox_view/multicolorbox_view.ts";
import "../printer_view/printer_view.ts";
import "../stats/stats_component.ts";
import "../multicolorbox_view/multicolorbox_modal_drying.ts";
import "../multicolorbox_view/multicolorbox_modal_spool.ts";
import "../printsettings/printsettings_modal.ts";

const animOptionsCard: motionOptions = {
  keyframeOptions: {
    duration: 250,
    direction: "normal",
    easing: "ease-in-out",
  },
  properties: ["height", "opacity", "scale"],
};

const defaultMonitoredStats: PrinterCardStatType[] = getDefaultMonitoredStats();

@customElementIfUndef("anycubic-printercard-card")
export class AnycubicPrintercardCard extends LitElement {
  @query(".ac-printer-card")
  private _printerCardContainer!: HTMLElement | Window;

  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

  @property({ attribute: "monitored-stats" })
  public monitoredStats?: PrinterCardStatType[] = defaultMonitoredStats;

  @property({ attribute: "selected-printer-id" })
  public selectedPrinterID: string | undefined;

  @property({ attribute: "selected-printer-device" })
  public selectedPrinterDevice: HassDevice | undefined;

  @property({ type: Boolean })
  public round?: boolean = true;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ attribute: "show-settings-button", type: Boolean })
  public showSettingsButton?: boolean;

  @property({ attribute: "always-show", type: Boolean })
  public alwaysShow?: boolean;

  @property({ attribute: "temperature-unit", type: String })
  public temperatureUnit: TemperatureUnit = TemperatureUnit.C;

  @property({ attribute: "light-entity-id", type: String })
  public lightEntityId?: string;

  @property({ attribute: "power-entity-id", type: String })
  public powerEntityId?: string;

  @property({ attribute: "camera-entity-id", type: String })
  public cameraEntityId?: string;

  @property({ type: Boolean })
  public vertical?: boolean;

  @property({ attribute: "scale-factor" })
  public scaleFactor?: number;

  @property({ attribute: "slot-colors" })
  public slotColors?: string[];

  @state()
  private _showVideo: boolean = false;

  @state()
  private cameraEntityState: HassEntity | undefined = undefined;

  @state()
  private isHidden: boolean = false;

  @state()
  private isPrinting: boolean = false;

  @state()
  private hiddenOverride: boolean = false;

  @state()
  private hasColorbox: boolean = false;

  @state()
  private hasSecondaryColorbox: boolean = false;

  @state()
  private lightIsOn: boolean = false;

  @state()
  private statusColor: string = "#ffc107";

  @state()
  private printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  @state()
  private progressPercent: number = 0;

  @state()
  private _buttonPrintSettings: string;

  @state()
  private _togglingLight: boolean = false;

  @state()
  private _togglingPower: boolean = false;

  protected willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._buttonPrintSettings = localize(
        "card.buttons.print_settings",
        this.language,
      );
    }

    if (changedProperties.has("monitoredStats")) {
      this.monitoredStats = undefinedDefault(
        this.monitoredStats,
        defaultMonitoredStats,
      ) as PrinterCardStatType[];
    }

    if (changedProperties.has("selectedPrinterID")) {
      this.printerEntities = getPrinterEntities(
        this.hass,
        this.selectedPrinterID,
      );

      this.printerEntityIdPart = getPrinterEntityIdPart(this.printerEntities);
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("alwaysShow") ||
      changedProperties.has("hiddenOverride") ||
      changedProperties.has("selectedPrinterID")
    ) {
      this.progressPercent = this._percentComplete();
      this.hasColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "ace_spools",
          "inactive",
        ).state === "active";
      this.hasSecondaryColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "secondary_multi_color_box_spools",
          "inactive",
        ).state === "active";
      if (this.cameraEntityId) {
        this.cameraEntityState = getEntityState(this.hass, {
          entity_id: this.cameraEntityId,
        });
      }
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId ?? "" },
        true,
        false,
      ) as boolean;
      const printStateString = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_state",
        "unknown",
      ).state.toLowerCase();
      this.isPrinting = isPrintStatePrinting(printStateString);
      this.isHidden = !this.alwaysShow
        ? !this.hiddenOverride && !this.isPrinting
        : false;
      this.statusColor = printStateStatusColor(printStateString);
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId ?? "" },
        true,
        false,
      ) as boolean;
    }
  }

  render(): LitTemplateResult {
    const classesCam = {
      "ac-hidden": !this._showVideo,
    };

    return html`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        <anycubic-printercard-camera_view
          class=${classMap(classesCam)}
          .showVideo=${this._showVideo}
          .toggleVideo=${this._toggleVideo}
          .cameraEntity=${this.cameraEntityState}
        ></anycubic-printercard-camera_view>
        <anycubic-printercard-multicolorbox_modal_spool
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .slotColors=${this.slotColors}
        ></anycubic-printercard-multicolorbox_modal_spool>
        <anycubic-printercard-printsettings_modal
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-printsettings_modal>
        <anycubic-printercard-multicolorbox_modal_drying
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-multicolorbox_modal_drying>
      </div>
    `;
  }

  private _renderHeader(): LitTemplateResult {
    const classesHeader = {
      "ac-h-justifycenter": !(this.powerEntityId && this.lightEntityId),
    };

    const stylesDot = {
      "background-color": this.statusColor,
    };

    return html`
      <div class="ac-printer-card-header ${classMap(classesHeader)}">
        ${this.powerEntityId
          ? html`
              <button
                class="ac-printer-card-button-small"
                .disabled=${this._togglingPower}
                @click=${this._togglePowerEntity}
              >
                <ha-svg-icon .path=${mdiPower}></ha-svg-icon>
              </button>
            `
          : nothing}

        <button
          class="ac-printer-card-button-name"
          @click=${this._toggleHiddenOveride}
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${styleMap(stylesDot)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${this.selectedPrinterDevice?.name}
          </p>
        </button>
        ${this.lightEntityId
          ? html`
              <button
                class="ac-printer-card-button-small"
                .disabled=${this._togglingLight}
                @click=${this._toggleLightEntity}
              >
                <ha-svg-icon
                  .path=${this.lightIsOn ? mdiLightbulbOn : mdiLightbulbOff}
                ></ha-svg-icon>
              </button>
            `
          : nothing}
      </div>
    `;
  }

  private _renderPrinterContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };
    const stylesScaledColLeft = {
      width: this.vertical
        ? "100%"
        : this.scaleFactor
          ? String(50 * this.scaleFactor) + "%"
          : "50%",
    };
    const stylesScaledColRight = {
      width: this.vertical
        ? "100%"
        : this.scaleFactor
          ? String(50 / this.scaleFactor) + "%"
          : "50%",
    };

    return html`
      <div
        class="ac-printer-card-infocontainer ${classMap(classesMain)}"
        style=${styleMap(stylesMain)}
        ${animate({ ...animOptionsCard })}
      >
        <div
          class="ac-printer-card-info-animcontainer ${classMap(classesMain)}"
          style=${styleMap(stylesScaledColLeft)}
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .scaleFactor=${this.scaleFactor}
            .toggleVideo=${this._toggleVideo}
          ></anycubic-printercard-printer_view>
          ${this.vertical
            ? html`<p class="ac-printer-card-info-vertprog">
                ${this.round
                  ? Math.round(this.progressPercent)
                  : this.progressPercent}%
              </p>`
            : nothing}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${classMap(classesMain)}"
          style=${styleMap(stylesScaledColRight)}
        >
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .language=${this.language}
            .monitoredStats=${this.monitoredStats}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .progressPercent=${this.progressPercent}
            .showPercent=${!this.vertical}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this._renderPrintSettingsContainer()}
      ${this._renderMultiColorBoxContainer()}
      ${this._renderSecondaryMultiColorBoxContainer()}
    `;
  }

  private _toggleVideo = (): void => {
    this._showVideo = !!(this.cameraEntityState && !this._showVideo);
  };

  private _renderPrintSettingsContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.showSettingsButton || this.isPrinting
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div
              class="ac-printer-card-settingssection ${classMap(classesMain)}"
            >
              <button
                class="ac-printer-card-button-settings"
                @click=${this._openPrintSettingsModal}
              >
                <ha-svg-icon .path=${mdiCog}></ha-svg-icon>
                ${this._buttonPrintSettings}
              </button>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderMultiColorBoxContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.hasColorbox
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div class="ac-printer-card-mcbsection ${classMap(classesMain)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${0}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderSecondaryMultiColorBoxContainer(): LitTemplateResult {
    const classesMain = {
      "ac-card-vertical": !!this.vertical,
    };
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return this.hasSecondaryColorbox
      ? html`
          <div
            class="ac-printer-card-infocontainer ${classMap(classesMain)}"
            style=${styleMap(stylesMain)}
            ${animate({ ...animOptionsCard })}
          >
            <div class="ac-printer-card-mcbsection ${classMap(classesMain)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${1}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : nothing;
  }

  private _openPrintSettingsModal = (): void => {
    fireEvent(this._printerCardContainer, "ac-printset-modal", {
      modalOpen: true,
    });
  };

  private _toggleLightEntity = (): void => {
    if (this.lightEntityId) {
      this._togglingLight = true;
      this.hass
        .callService("homeassistant", "toggle", {
          entity_id: this.lightEntityId,
        })
        .then(() => {
          this._togglingLight = false;
        })
        .catch((_e: unknown) => {
          this._togglingLight = false;
        });
    }
  };

  private _togglePowerEntity = (): void => {
    if (this.powerEntityId) {
      this._togglingPower = true;
      this.hass
        .callService("homeassistant", "toggle", {
          entity_id: this.powerEntityId,
        })
        .then(() => {
          this._togglingPower = false;
        })
        .catch((_e: unknown) => {
          this._togglingPower = false;
        });
    }
  };

  private _toggleHiddenOveride = (): void => {
    this.hiddenOverride = !this.hiddenOverride;
  };

  private _percentComplete(): number {
    return Number(
      getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_progress",
        -1.0,
      ).state,
    );
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      .ac-printer-card {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        box-sizing: border-box;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        margin: 0px;
        box-shadow: var(
          --ha-card-box-shadow,
          0px 2px 1px -1px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12)
        );
      }

      .ac-printer-card-mainview {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printer-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
      }

      .ac-h-justifycenter {
        justify-content: center;
      }

      .ac-printer-card-button-small {
        border: none;
        outline: none;
        background-color: transparent;
        width: 32px;
        height: 32px;
        font-size: 22px;
        line-height: 22px;
        box-sizing: border-box;
        padding: 0px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings {
        border: none;
        border-radius: 6px;
        outline: none;
        background-color: transparent;
        font-size: 18px;
        box-sizing: border-box;
        padding: 4px 12px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings:hover {
        background-color: #7f7f7f36;
      }

      .ac-printer-card-button-settings:active {
        background-color: #7f7f7f5e;
      }

      .ac-printer-card-button-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        outline: none;
        background-color: transparent;
        padding: 24px;
      }
      .ac-printer-card-header-status-dot {
        margin: 0px 10px;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        box-sizing: border-box;
      }

      .ac-printer-card-header-status-text {
        font-weight: bold;
        font-size: 22px;
        margin: 0px;
        color: var(--primary-text-color);
      }

      .ac-printer-card-infocontainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-printer-card-infocontainer.ac-card-vertical {
        flex-direction: column;
      }

      .ac-printer-card-info-animcontainer {
        box-sizing: border-box;
        padding: 0px 8px 32px 8px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
      }

      anycubic-printercard-printer_view {
        width: 100%;
        flex-grow: 1;
      }

      .ac-printer-card-info-vertprog {
        width: 50%;
        font-size: 36px;
        text-align: center;
        font-weight: bold;
      }

      anycubic-printercard-printer_view.ac-card-vertical {
        width: auto;
      }

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 8px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-info-statscontainer.ac-card-vertical {
        padding-left: 32px;
        padding-right: 32px;
        width: 100%;
        height: auto;
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 6px;
        width: 100%;
        height: 100%;
      }

      .ac-printer-card-mcbsection.ac-card-vertical {
        height: auto;
      }

      .ac-hidden {
        display: none;
      }
    `;
  }
}
