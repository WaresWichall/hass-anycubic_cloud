import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import {
  getPrinterBinarySensorState,
  getPrinterSensorStateObj,
  speedModesFromStateObj,
  toTitleCase,
} from "../../../helpers";
import {
  HassEntityInfos,
  HomeAssistant,
  PrinterCardStatType,
  TemperatureUnit,
} from "../../../types";

import "./progress_line.ts";
import "./stat_line.ts";
import "./temperature_stat.ts";
import "./time_stat.ts";

@customElementIfUndef("anycubic-printercard-stats-component")
export class AnycubicPrintercardStatsComponent extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public monitoredStats: PrinterCardStatType[];

  @property({ type: Boolean })
  public showPercent?: boolean;

  @property({ type: Boolean })
  public round?: boolean = true;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ type: String })
  public temperatureUnit: TemperatureUnit = TemperatureUnit.C;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @property()
  public progressPercent: number = 0;

  render(): any {
    return html`
      <div class="ac-stats-box ac-stats-section">
        ${this.showPercent
          ? html`
              <div class="ac-stats-box ac-stats-part-percent">
                <p class="ac-stats-part-percent-text">
                  ${this.round
                    ? Math.round(this.progressPercent)
                    : this.progressPercent}%
                </p>
              </div>
            `
          : null}
        <div class="ac-stats-box ac-stats-section">${this._renderStats()}</div>
      </div>
    `;
  }

  private _renderStats(): HTMLElement {
    return repeat(
      this.monitoredStats,
      (condition) => condition,
      (condition, _index) => {
        switch (condition) {
          case PrinterCardStatType.Status:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${toTitleCase(
                  getPrinterSensorStateObj(
                    this.hass,
                    this.printerEntities,
                    this.printerEntityIdPart,
                    "print_state",
                  ).state,
                )}
              ></anycubic-printercard-stat-line>
            `;
          case PrinterCardStatType.ETA:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "project_time_remaining",
                )}
                .timeType=${condition}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case PrinterCardStatType.Elapsed:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "project_time_elapsed",
                )}
                .timeType=${condition}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;

          case PrinterCardStatType.Remaining:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "project_time_remaining",
                )}
                .timeType=${condition}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;

          case PrinterCardStatType.BedCurrent:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${condition}
                .temperatureEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "hotbed_temperature",
                )}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.HotendCurrent:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${condition}
                .temperatureEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "nozzle_temperature",
                )}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.BedTarget:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${condition}
                .temperatureEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "target_hotbed_temperature",
                )}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.HotendTarget:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${condition}
                .temperatureEntity=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "target_nozzle_temperature",
                )}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.PrinterOnline:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterBinarySensorState(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "printer_online",
                  "Online",
                  "Offline",
                )}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.Availability:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${toTitleCase(
                  getPrinterSensorStateObj(
                    this.hass,
                    this.printerEntities,
                    this.printerEntityIdPart,
                    "current_status",
                  ).state,
                )}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ProjectName:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "project_name",
                ).state}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.CurrentLayer:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "current_layer",
                ).state}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.SpeedMode: {
            const speedModeState = getPrinterSensorStateObj(
              this.hass,
              this.printerEntities,
              this.printerEntityIdPart,
              "print_speed_mode",
              "",
              { available_modes: [], print_speed_mode_code: -1 },
            );
            const availableSpeedModes = speedModesFromStateObj(speedModeState);
            const currentSpeedModeKey =
              speedModeState.attributes.print_speed_mode_code;
            const currentSpeedModeDescr =
              currentSpeedModeKey >= 0 &&
              currentSpeedModeKey in availableSpeedModes
                ? availableSpeedModes[currentSpeedModeKey]
                : "Unknown";
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${currentSpeedModeDescr}
              ></anycubic-printercard-stat-line>
            `;
          }

          case PrinterCardStatType.FanSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "fan_speed",
                  0,
                ).state}
                .unit=${"%"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.DryingStatus:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterBinarySensorState(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "drying_active",
                  "Drying",
                  "Not Drying",
                )}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.DryingTime: {
            const dryTotal = Number(
              getPrinterSensorStateObj(
                this.hass,
                this.printerEntities,
                this.printerEntityIdPart,
                "drying_total_duration",
                0,
              ).state,
            );
            const dryRemain = Number(
              getPrinterSensorStateObj(
                this.hass,
                this.printerEntities,
                this.printerEntityIdPart,
                "drying_remaining_time",
                0,
              ).state,
            );
            const dryRemainMinutes = !isNaN(dryRemain)
              ? `${dryRemain} Mins`
              : "";
            const dryProgress =
              !isNaN(dryTotal) && dryTotal > 0
                ? (dryRemain / dryTotal) * 100
                : 0;
            return html`
              <anycubic-printercard-progress-line
                .name=${condition}
                .value=${dryRemainMinutes}
                .progress=${dryProgress}
              ></anycubic-printercard-progress-line>
            `;
          }

          case PrinterCardStatType.OnTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_on_time",
                  0,
                ).state}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.OffTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_off_time",
                  0,
                ).state}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.BottomTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_bottom_time",
                  0,
                ).state}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ModelHeight:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_model_height",
                  0,
                ).state}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.BottomLayers:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_bottom_layers",
                  0,
                ).state}
                .unit=${"layers"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZUpHeight:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_z_up_height",
                  0,
                ).state}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZUpSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_z_up_speed",
                  0,
                ).state}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZDownSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${condition}
                .value=${getPrinterSensorStateObj(
                  this.hass,
                  this.printerEntities,
                  this.printerEntityIdPart,
                  "print_z_down_speed",
                  0,
                ).state}
              ></anycubic-printercard-stat-line>
            `;

          default:
            return html`
              <anycubic-printercard-stat-line
                .name=${"Unknown"}
                .value=${"<unknown>"}
              ></anycubic-printercard-stat-line>
            `;
        }
      },
    );
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stats-box {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .ac-stats-section {
        flex-direction: column;
        justify-content: center;
      }

      .ac-stats-part-percent {
        justify-content: center;
        margin-bottom: 20px;
      }
      .ac-stats-part-percent-text {
        margin: 0px;
        font-size: 42px;
        font-weight: bold;
        height: 44px;
        line-height: 44px;
      }
    `;
  }
}
