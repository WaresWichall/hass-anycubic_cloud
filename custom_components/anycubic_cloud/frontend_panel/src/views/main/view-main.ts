import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import {
  getEntityStateBinary,
  getEntityStateFloat,
  getEntityStateString,
  getPrinterDevID,
  getPrinterEntities,
  getPrinterEntityIdPart,
  getPrinterID,
  getPrinterMAC,
  getSelectedPrinter,
  getStrictMatchingEntity,
  toTitleCase,
} from "../../helpers";
import {
  HomeAssistant,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "../../types";

@customElement("anycubic-view-main")
export class AnycubicViewMain extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public printers?: HassDeviceList;

  private _renderInfoRow(fieldKey, rowData) {
    const languageKey = `panels.main.cards.main.fields.${fieldKey}.heading`;
    return html`
      <div class="info-row">
        <span class="info-heading">
          ${localize(languageKey, this.hass.language)}:</span
        >
        <span class="info-detail">${rowData}</span>
      </div>
    `;
  }

  private _renderOptionalInfoRow(shouldRender, fieldKey, rowData) {
    return shouldRender ? this._renderInfoRow(fieldKey, rowData) : null;
  }

  render() {
    const selectedPrinterID = getPrinterDevID(this.route);

    const selectedPrinter = getSelectedPrinter(
      this.printers,
      selectedPrinterID,
    );
    const printerID = getPrinterID(selectedPrinter);
    const printerMAC = getPrinterMAC(selectedPrinter);
    const printerEntities = getPrinterEntities(this.hass, selectedPrinterID);
    const printerEntityIdPart = getPrinterEntityIdPart(printerEntities);
    const aceEntityFwVersion = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "ace_fw_version",
    );
    const aceEntityDryingActive = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "binary_sensor",
      "drying_active",
    );
    const aceEntityDryingRemaining = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "drying_remaining_time",
    );
    const aceEntityDryingTotal = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "drying_total_duration",
    );
    const aceEntityFwUpdateAvailable = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "binary_sensor",
      "ace_firmware_update_available",
    );
    const printerEntityFwUpdateAvailable = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "binary_sensor",
      "firmware_update_available",
    );
    const printerEntityAvailable = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "binary_sensor",
      "is_available",
    );
    const printerEntityOnline = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "binary_sensor",
      "printer_online",
    );
    const printerEntityCurrNozzleTemp = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "nozzle_temperature",
    );
    const printerEntityCurrHotbedTemp = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "hotbed_temperature",
    );
    const printerEntityTargetNozzleTemp = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "target_nozzle_temperature",
    );
    const printerEntityTargetHotbedTemp = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "target_hotbed_temperature",
    );
    const projectEntityProgress = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "project_progress",
    );
    const projectEntityPrintState = getStrictMatchingEntity(
      printerEntities,
      printerEntityIdPart,
      "sensor",
      "print_state",
    );
    const printerStateFwUpdateAvailable = getEntityStateBinary(
      this.hass,
      printerEntityFwUpdateAvailable,
      "Update Available",
      "Up To Date",
    );
    const printerStateAvailable = getEntityStateBinary(
      this.hass,
      printerEntityAvailable,
      "Available",
      "Busy",
    );
    const printerStateOnline = getEntityStateBinary(
      this.hass,
      printerEntityOnline,
      "Online",
      "Offline",
    );
    const printerStateCurrNozzleTemp = getEntityStateFloat(
      this.hass,
      printerEntityCurrNozzleTemp,
    );
    const printerStateCurrHotbedTemp = getEntityStateFloat(
      this.hass,
      printerEntityCurrHotbedTemp,
    );
    const printerStateTargetNozzleTemp = getEntityStateFloat(
      this.hass,
      printerEntityTargetNozzleTemp,
    );
    const printerStateTargetHotbedTemp = getEntityStateFloat(
      this.hass,
      printerEntityTargetHotbedTemp,
    );
    const projectStateProgress = getEntityStateFloat(
      this.hass,
      projectEntityProgress,
    );
    const projectStatePrintState = getEntityStateString(
      this.hass,
      projectEntityPrintState,
    );
    const aceStateFwUpdateAvailable = getEntityStateBinary(
      this.hass,
      aceEntityFwUpdateAvailable,
      "Update Available",
      "Up To Date",
    );
    const aceStateDryingActive = getEntityStateBinary(
      this.hass,
      aceEntityDryingActive,
      "Drying",
      "Not Drying",
    );
    const aceStateFwVersion = getEntityStateString(
      this.hass,
      aceEntityFwVersion,
    );
    const aceStateDryingRemaining = getEntityStateFloat(
      this.hass,
      aceEntityDryingRemaining,
    );
    const aceStateDryingTotal = getEntityStateFloat(
      this.hass,
      aceEntityDryingTotal,
    );

    // prettier-ignore
    const aceDryingProgress = (
      aceStateDryingTotal > 0
        ? Math.round((1 - (aceStateDryingRemaining / aceStateDryingTotal)) * 10000) / 100
        : 0
    ).toFixed(2);

    return html`
      <printer-card elevation="2">
        ${this._renderInfoRow(
          "printer_name",
          selectedPrinter ? selectedPrinter.name : null,
        )}
        ${this._renderInfoRow("printer_id", printerID)}
        ${this._renderInfoRow("printer_mac", printerMAC)}
        ${this._renderInfoRow(
          "printer_model",
          selectedPrinter ? selectedPrinter.model : null,
        )}
        ${this._renderInfoRow(
          "printer_fw_version",
          selectedPrinter ? selectedPrinter.sw_version : null,
        )}
        ${this._renderInfoRow(
          "printer_fw_update_available",
          printerStateFwUpdateAvailable,
        )}
        ${this._renderInfoRow("printer_online", printerStateOnline)}
        ${this._renderInfoRow("printer_available", printerStateAvailable)}
        ${this._renderInfoRow("curr_nozzle_temp", printerStateCurrNozzleTemp)}
        ${this._renderInfoRow("curr_hotbed_temp", printerStateCurrHotbedTemp)}
        ${this._renderInfoRow(
          "target_nozzle_temp",
          printerStateTargetNozzleTemp,
        )}
        ${this._renderInfoRow(
          "target_hotbed_temp",
          printerStateTargetHotbedTemp,
        )}
        ${this._renderInfoRow(
          "print_state",
          toTitleCase(projectStatePrintState),
        )}
        ${this._renderInfoRow("project_progress", `${projectStateProgress}%`)}
        ${this._renderOptionalInfoRow(
          aceEntityFwVersion,
          "ace_fw_version",
          aceStateFwVersion,
        )}
        ${this._renderOptionalInfoRow(
          aceEntityFwUpdateAvailable,
          "ace_fw_update_available",
          aceStateFwUpdateAvailable,
        )}
        ${this._renderOptionalInfoRow(
          aceEntityDryingActive,
          "drying_active",
          aceStateDryingActive,
        )}
        ${this._renderOptionalInfoRow(
          aceEntityDryingRemaining,
          "drying_progress",
          `${aceDryingProgress}%`,
        )}
      </printer-card>
    `;
  }

  static get styles() {
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

      .info-row {
        margin-bottom: 6px;
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
