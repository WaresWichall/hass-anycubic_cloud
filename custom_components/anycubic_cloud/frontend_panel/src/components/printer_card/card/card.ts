import { mdiPower, mdiLightbulbOn, mdiLightbulbOff } from "@mdi/js";
import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit-html/directives/style-map.js";

import {
  HassDevice,
  HassEntityInfos,
  HassPanel,
  HassRoute,
  HomeAssistant,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../../types";

import {
  getDefaultMonitoredStats,
  getEntityStateBinary,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterSensorStateObj,
} from "../../../helpers";

import "../multicolorbox_view/multicolorbox_view.ts";
import "../printer_view/printer_view.ts";
import "../stats/stats_component.ts";

const monitoredStats: PrinterCardStatType[] = getDefaultMonitoredStats();

@customElement("anycubic-printercard-card")
export class AnycubicPrintercardCard extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public selectedPrinterID: string | undefined;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @property({ type: Boolean })
  public showPercent?: boolean;

  @property({ type: Boolean })
  public round?: boolean = true;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ type: String })
  public temperatureUnit: TemperatureUnit = TemperatureUnit.C;

  @property({ type: String })
  public lightEntityId?: string;

  @property({ type: String })
  public powerEntityId?: string;

  @state({ type: Boolean })
  private hiddenOverride: boolean = false;

  @state({ type: Boolean })
  private hasColorbox: boolean = false;

  @state({ type: Boolean })
  private lightIsOn: boolean = false;

  @state({ type: String })
  private statusColor: string = "#ffc107";

  @state()
  private printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  protected willUpdate(changedProperties: PropertyValues<this>) {
    super.willUpdate(changedProperties);

    if (changedProperties.has("selectedPrinterID")) {
      this.printerEntities = getPrinterEntities(
        this.hass,
        this.selectedPrinterID,
      );

      this.printerEntityIdPart = getPrinterEntityIdPart(this.printerEntities);
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterID")
    ) {
      this.hasColorbox =
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "multi_color_box_spools",
          "inactive",
        ).state === "active";
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId },
        true,
        false,
      );
      const printStateString = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "print_state",
        "unknown",
      ).state.toLowerCase();
      this.statusColor = ["printing", "preheating"].includes(printStateString)
        ? "#4caf50"
        : printStateString === "unknown"
          ? "#f44336"
          : printStateString === "operational" ||
              printStateString === "finished"
            ? "#00bcd4"
            : "#ffc107";
      this.lightIsOn = getEntityStateBinary(
        this.hass,
        { entity_id: this.lightEntityId },
        true,
        false,
      );
    }
  }

  render() {
    return html`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this.renderHeader()} ${this.renderPrinterContainer()}
        </div>
      </div>
    `;
  }

  renderHeader() {
    const classesHeader = {
      "ac-h-justifycenter":
        this.powerEntityId && this.lightEntityId ? false : true,
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
                @click="${(_e) => {
                  this.togglePowerEntity();
                }}"
              >
                <ha-svg-icon .path=${mdiPower}></ha-svg-icon>
              </button>
            `
          : null}

        <button
          class="ac-printer-card-button-name"
          @click="${(_e) => {
            this.toggleHiddenOveride();
          }}"
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
                @click="${(_e) => {
                  this.toggleLightEntity();
                }}"
              >
                <ha-svg-icon
                  .path=${this.lightIsOn ? mdiLightbulbOn : mdiLightbulbOff}
                ></ha-svg-icon>
              </button>
            `
          : null}
      </div>
    `;
  }

  renderPrinterContainer() {
    return html`
      <div class="ac-printer-card-infocontainer">
        <div class="ac-printer-card-info-animcontainer">
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
          ></anycubic-printercard-printer_view>
        </div>
        <div class="ac-printer-card-info-statscontainer">
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${this.route}
            .panel=${this.panel}
            .monitoredStats=${monitoredStats}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .showPercent=${this.showPercent}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this.renderMultiColorBoxContainer()}
    `;
  }

  renderMultiColorBoxContainer() {
    return this.hasColorbox
      ? html`
          <div class="ac-printer-card-infocontainer">
            <div class="ac-printer-card-mcbsection">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        `
      : null;
  }

  toggleLightEntity() {
    if (this.lightEntityId)
      this.hass.callService("homeassistant", "toggle", {
        entity_id: this.lightEntityId,
      });
  }

  togglePowerEntity() {
    if (this.powerEntityId)
      this.hass.callService("homeassistant", "toggle", {
        entity_id: this.powerEntityId,
      });
  }

  toggleHiddenOveride() {
    this.hiddenOverride = !this.hiddenOverride;
  }

  static get styles() {
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
        margin: 24px;
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

      .ac-printer-card-info-animcontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 16px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 16px;
      }

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 16px;
        padding-left: 16px;
        padding-right: 32px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 5px 32px 5px 32px;
        width: 100%;
        height: 100%;
      }
    `;
  }
}
