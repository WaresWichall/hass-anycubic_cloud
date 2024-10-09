import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import {
  getPanelACEMonitoredStats,
  getPanelBasicMonitoredStats,
  getPanelFDMMonitoredStats,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterID,
  getPrinterMAC,
  getPrinterSensorStateFloat,
  getPrinterSensorStateString,
  getPrinterBinarySensorState,
  getPrinterUpdateEntityState,
  isFDMPrinter,
} from "../../helpers";
import {
  HomeAssistant,
  HassDevice,
  HassEntityInfos,
  HassPanel,
  HassRoute,
  PrinterCardStatType,
  TranslationDict,
} from "../../types";

import "../../components/printer_card/card/card.ts";

const monitoredStatsACE: PrinterCardStatType[] = getPanelACEMonitoredStats();
const monitoredStatsBasic: PrinterCardStatType[] =
  getPanelBasicMonitoredStats();
const monitoredStatsFDM: PrinterCardStatType[] = getPanelFDMMonitoredStats();

const infoFields: string[] = [
  "printer_name",
  "printer_id",
  "printer_mac",
  "printer_model",
  "printer_fw_version",
  "printer_fw_update_available",
  "printer_online",
  "printer_available",
  "curr_nozzle_temp",
  "curr_hotbed_temp",
  "target_nozzle_temp",
  "target_hotbed_temp",
  "job_state",
  "job_progress",
  "ace_fw_version",
  "ace_fw_update_available",
  "drying_active",
  "drying_progress",
];

@customElement("anycubic-view-main")
export class AnycubicViewMain extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

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

  @state()
  private printerEntities: HassEntityInfos;

  @state()
  private printerEntityIdPart: string | undefined;

  @state()
  private printerID: string | undefined;

  @state()
  private printerMAC: string | null;

  @state()
  private printerStateFwUpdateAvailable: string | undefined;

  @state()
  private printerStateAvailable: string | boolean | undefined;

  @state()
  private printerStateOnline: string | boolean | undefined;

  @state()
  private printerStateCurrNozzleTemp: number | undefined;

  @state()
  private printerStateCurrHotbedTemp: number | undefined;

  @state()
  private printerStateTargetNozzleTemp: number | undefined;

  @state()
  private printerStateTargetHotbedTemp: number | undefined;

  @state()
  private jobStateProgress: string | undefined;

  @state()
  private jobStatePrintState: string | undefined;

  @state()
  private aceStateFwUpdateAvailable: string | boolean | undefined;

  @state()
  private aceStateDryingActive: string | boolean | undefined;

  @state()
  private aceStateDryingRemaining: number | undefined;

  @state()
  private aceStateDryingTotal: number | undefined;

  @state()
  private aceDryingProgress: string | undefined;

  @state()
  private isFDM: boolean = false;

  @state()
  private monitoredStats: PrinterCardStatType[] = monitoredStatsBasic;

  @state()
  private _statTranslations: TranslationDict;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._statTranslations = infoFields.reduce((fConf, fieldKey) => {
        fConf[fieldKey] = localize(
          `panels.main.cards.main.fields.${fieldKey}`,
          this.language,
        );
        return fConf;
      }, {});
    }

    if (changedProperties.has("selectedPrinterDevice")) {
      this.printerID = getPrinterID(this.selectedPrinterDevice);
      this.printerMAC = getPrinterMAC(this.selectedPrinterDevice);
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
      changedProperties.has("selectedPrinterID")
    ) {
      this.isFDM = isFDMPrinter(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
      );
      this.printerStateFwUpdateAvailable = getPrinterUpdateEntityState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "printer_firmware",
      );
      this.printerStateAvailable = getPrinterBinarySensorState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "is_available",
        "Available",
        "Busy",
      );
      this.printerStateOnline = getPrinterBinarySensorState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "printer_online",
        "Online",
        "Offline",
      );
      this.printerStateCurrNozzleTemp = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "nozzle_temperature",
      );
      this.printerStateCurrHotbedTemp = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "hotbed_temperature",
      );
      this.printerStateTargetNozzleTemp = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "target_nozzle_temperature",
      );
      this.printerStateTargetHotbedTemp = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "target_hotbed_temperature",
      );
      const projProgress = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_progress",
      );
      this.jobStateProgress =
        typeof projProgress !== "undefined" ? `${projProgress}%` : "0%";
      this.jobStatePrintState = getPrinterSensorStateString(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "job_state",
        true,
      );
      this.aceStateFwUpdateAvailable = getPrinterUpdateEntityState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "ace_firmware",
      );
      this.aceStateDryingActive = getPrinterBinarySensorState(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "drying_active",
        "Drying",
        "Not Drying",
      );
      this.aceStateDryingRemaining = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "drying_remaining_time",
      );
      this.aceStateDryingTotal = getPrinterSensorStateFloat(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "drying_total_duration",
      );
      this.aceDryingProgress =
        typeof this.aceStateDryingRemaining !== "undefined" &&
        typeof this.aceStateDryingTotal !== "undefined"
          ? String(
              (this.aceStateDryingTotal > 0
                ? Math.round(
                    (1 -
                      this.aceStateDryingRemaining / this.aceStateDryingTotal) *
                      10000,
                  ) / 100
                : 0
              ).toFixed(2),
            ) + "%"
          : undefined;
      if (this.aceStateFwUpdateAvailable) {
        this.monitoredStats = monitoredStatsACE;
      } else if (this.isFDM) {
        this.monitoredStats = monitoredStatsFDM;
      } else {
        this.monitoredStats = monitoredStatsBasic;
      }
    }
  }

  private _renderInfoRow(fieldKey, rowData): HTMLElement {
    return html`
      <div class="info-row">
        <span class="info-heading"> ${this._statTranslations[fieldKey]}:</span>
        <span class="info-detail">${rowData}</span>
      </div>
    `;
  }

  private _renderOptionalInfoRow(fieldKey, rowData): HTMLElement | null {
    return typeof rowData !== "undefined"
      ? this._renderInfoRow(fieldKey, rowData)
      : null;
  }

  render(): any {
    return html`
      <printer-card elevation="2">
        <anycubic-printercard-card
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterID=${this.selectedPrinterID}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .vertical=${false}
          .round=${false}
          .use_24hr=${true}
          .showSettingsButton=${true}
          .monitoredStats=${this.monitoredStats}
        ></anycubic-printercard-card>
        <div class="ac-extra-printer-info">
          ${this._renderInfoRow(
            "printer_name",
            this.selectedPrinterDevice ? this.selectedPrinterDevice.name : null,
          )}
          ${this._renderInfoRow("printer_id", this.printerID)}
          ${this._renderInfoRow("printer_mac", this.printerMAC)}
          ${this._renderInfoRow(
            "printer_model",
            this.selectedPrinterDevice
              ? this.selectedPrinterDevice.model
              : null,
          )}
          ${this._renderInfoRow(
            "printer_fw_version",
            this.selectedPrinterDevice
              ? this.selectedPrinterDevice.sw_version
              : null,
          )}
          ${this._renderInfoRow(
            "printer_fw_update_available",
            this.printerStateFwUpdateAvailable,
          )}
          ${this._renderInfoRow("printer_online", this.printerStateOnline)}
          ${this._renderInfoRow(
            "printer_available",
            this.printerStateAvailable,
          )}
          ${this.isFDM
            ? html`
                ${this._renderInfoRow(
                  "curr_nozzle_temp",
                  this.printerStateCurrNozzleTemp,
                )}
                ${this._renderInfoRow(
                  "curr_hotbed_temp",
                  this.printerStateCurrHotbedTemp,
                )}
                ${this._renderInfoRow(
                  "target_nozzle_temp",
                  this.printerStateTargetNozzleTemp,
                )}
                ${this._renderInfoRow(
                  "target_hotbed_temp",
                  this.printerStateTargetHotbedTemp,
                )}
              `
            : nothing}
          ${this._renderInfoRow("job_state", this.jobStatePrintState)}
          ${this._renderInfoRow("job_progress", this.jobStateProgress)}
          ${this._renderOptionalInfoRow(
            "ace_fw_update_available",
            this.aceStateFwUpdateAvailable,
          )}
          ${this._renderOptionalInfoRow(
            "drying_active",
            this.aceStateDryingActive,
          )}
          ${this._renderOptionalInfoRow(
            "drying_progress",
            this.aceDryingProgress,
          )}
        </div>
      </printer-card>
    `;
  }

  static get styles(): any {
    return css`
      :host {
        padding: 16px;
        display: block;
      }
      printer-card {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }

      anycubic-printercard-card {
        margin: 24px;
      }

      .ac-extra-printer-info {
        padding: 20px 40px;
      }

      .info-row {
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        box-sizing: border-box;
        width: 100%;
      }

      .info-heading {
        margin-right: 10px;
        font-size: 0.85em;
      }

      .info-detail {
        font-weight: 700;
      }
    `;
  }
}
