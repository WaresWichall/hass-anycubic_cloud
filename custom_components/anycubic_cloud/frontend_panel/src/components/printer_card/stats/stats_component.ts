import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import {
  getPrinterBinarySensorState,
  getPrinterSensorStateObj,
  speedModesFromStateObj,
  toTitleCase,
} from "../../../helpers";
import {
  HassEntity,
  HassEntityInfos,
  HomeAssistant,
  PrinterCardStatType,
  TemperatureUnit,
  TranslationDict,
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
  public language!: string;

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

  @state()
  private _statTranslations: TranslationDict;

  @state()
  private _entETA: HassEntity;

  @state()
  private _entElapsed: HassEntity;

  @state()
  private _entRemaining: HassEntity;

  @state()
  private _entBedCurrent: HassEntity;

  @state()
  private _entHotendCurrent: HassEntity;

  @state()
  private _entBedTarget: HassEntity;

  @state()
  private _entHotendTarget: HassEntity;

  @state()
  private _valStatus: string;

  @state()
  private _valOnline: string;

  @state()
  private _valAvailability: string;

  @state()
  private _valJobName: string;

  @state()
  private _valCurrentLayer: string;

  @state()
  private _valSpeedMode: string;

  @state()
  private _valFanSpeed: string;

  @state()
  private _valDryStatus: string;

  @state()
  private _valDryRemain: string;

  @state()
  private _valDryProgress: number = 0;

  @state()
  private _valOnTime: string;

  @state()
  private _valOffTime: string;

  @state()
  private _valBottomTime: string;

  @state()
  private _valModelHeight: string;

  @state()
  private _valBottomLayers: string;

  @state()
  private _valZUpHeight: string;

  @state()
  private _valZUpSpeed: string;

  @state()
  private _valZDownSpeed: string;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has("hass") ||
      changedProperties.has("printerEntities") ||
      changedProperties.has("printerEntityIdPart")
    ) {
      this._entETA = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_time_remaining",
      );
      this._entElapsed = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_time_elapsed",
      );
      this._entRemaining = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_time_remaining",
      );
      this._entBedCurrent = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "hotbed_temperature",
      );
      this._entHotendCurrent = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "nozzle_temperature",
      );
      this._entBedTarget = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "target_hotbed_temperature",
      );
      this._entHotendTarget = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "target_nozzle_temperature",
      );
      this._valStatus = toTitleCase(
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "job_state",
        ).state,
      );
      this._valOnline = getPrinterBinarySensorState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "printer_online",
        "Online",
        "Offline",
      );
      this._valAvailability = toTitleCase(
        getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "current_status",
        ).state,
      );
      this._valJobName = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_name",
      ).state;
      this._valCurrentLayer = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_current_layer",
      ).state;
      const speedModeState = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_speed_mode",
        "",
        { available_modes: [], print_speed_mode_code: -1 },
      );
      const availableSpeedModes = speedModesFromStateObj(speedModeState);
      const currentSpeedModeKey =
        speedModeState.attributes.print_speed_mode_code;
      this._valSpeedMode =
        currentSpeedModeKey >= 0 && currentSpeedModeKey in availableSpeedModes
          ? availableSpeedModes[currentSpeedModeKey]
          : "Unknown";
      this._valFanSpeed = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "fan_speed",
        0,
      ).state;
      this._valDryStatus = getPrinterBinarySensorState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "drying_active",
        "Drying",
        "Not Drying",
      );
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
      this._valDryRemain = !isNaN(dryRemain) ? `${dryRemain} Mins` : "";
      this._valDryProgress =
        !isNaN(dryTotal) && dryTotal > 0 ? (dryRemain / dryTotal) * 100 : 0;
      this._valOnTime = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_on_time",
        0,
      ).state;
      this._valOffTime = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_off_time",
        0,
      ).state;
      this._valBottomTime = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_bottom_time",
        0,
      ).state;
      this._valModelHeight = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_model_height",
        0,
      ).state;
      this._valBottomLayers = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_bottom_layers",
        0,
      ).state;
      this._valZUpHeight = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_z_up_height",
        0,
      ).state;
      this._valZUpSpeed = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_z_up_speed",
        0,
      ).state;
      this._valZDownSpeed = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_z_down_speed",
        0,
      ).state;
    }

    if (
      changedProperties.has("language") ||
      changedProperties.has("monitoredStats")
    ) {
      this._statTranslations = this.monitoredStats.reduce((fConf, statKey) => {
        fConf[statKey] = localize(
          `card.monitored_stats.${statKey}`,
          this.language,
        );
        return fConf;
      }, {});
    }
  }

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
                .name=${this._statTranslations[condition]}
                .value=${this._valStatus}
              ></anycubic-printercard-stat-line>
            `;
          case PrinterCardStatType.ETA:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entETA}
                .timeType=${condition}
                .name=${this._statTranslations[condition]}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case PrinterCardStatType.Elapsed:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entElapsed}
                .timeType=${condition}
                .name=${this._statTranslations[condition]}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;

          case PrinterCardStatType.Remaining:
            return html`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entRemaining}
                .timeType=${condition}
                .name=${this._statTranslations[condition]}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;

          case PrinterCardStatType.BedCurrent:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[condition]}
                .temperatureEntity=${this._entBedCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.HotendCurrent:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[condition]}
                .temperatureEntity=${this._entHotendCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.BedTarget:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[condition]}
                .temperatureEntity=${this._entBedTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.HotendTarget:
            return html`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[condition]}
                .temperatureEntity=${this._entHotendTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;

          case PrinterCardStatType.PrinterOnline:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valOnline}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.Availability:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valAvailability}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ProjectName:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valJobName}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.CurrentLayer:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valCurrentLayer}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.SpeedMode:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valSpeedMode}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.FanSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valFanSpeed}
                .unit=${"%"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.DryingStatus:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valDryStatus}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.DryingTime:
            return html`
              <anycubic-printercard-progress-line
                .name=${this._statTranslations[condition]}
                .value=${this._valDryRemain}
                .progress=${this._valDryProgress}
              ></anycubic-printercard-progress-line>
            `;

          case PrinterCardStatType.OnTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valOnTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.OffTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valOffTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.BottomTime:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valBottomTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ModelHeight:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valModelHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.BottomLayers:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valBottomLayers}
                .unit=${"layers"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZUpHeight:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valZUpHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZUpSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valZUpSpeed}
              ></anycubic-printercard-stat-line>
            `;

          case PrinterCardStatType.ZDownSpeed:
            return html`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[condition]}
                .value=${this._valZDownSpeed}
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
