import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import {
  getEntityStateBinary,
  getEntityStateFloat,
  getEntityStateString,
  getMatchingEntity,
  getPrinterDevID,
  getPrinterEntities,
  getPrinterID,
  getPrinterMAC,
  getSelectedPrinter,
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

  render() {
    const selectedPrinterID = getPrinterDevID(this.route);

    const selectedPrinter = getSelectedPrinter(
      this.printers,
      selectedPrinterID,
    );
    const printerID = getPrinterID(selectedPrinter);
    const printerMAC = getPrinterMAC(selectedPrinter);
    const printerEntities = getPrinterEntities(this.hass, selectedPrinterID);
    const aceEntityFwVersion = getMatchingEntity(
      printerEntities,
      "sensor",
      "ace_fw_version",
    );
    const aceEntityDryingActive = getMatchingEntity(
      printerEntities,
      "binary_sensor",
      "drying_active",
    );
    const aceEntityDryingRemaining = getMatchingEntity(
      printerEntities,
      "sensor",
      "drying_remaining_time",
    );
    const aceEntityDryingTotal = getMatchingEntity(
      printerEntities,
      "sensor",
      "drying_total_duration",
    );
    const printerEntityAvailable = getMatchingEntity(
      printerEntities,
      "binary_sensor",
      "is_available",
    );
    const printerEntityOnline = getMatchingEntity(
      printerEntities,
      "binary_sensor",
      "printer_online",
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
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_name.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail"
            >${selectedPrinter ? selectedPrinter.name : null}</span
          >
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_id.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail">${printerID}</span>
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_mac.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail">${printerMAC}</span>
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_model.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail"
            >${selectedPrinter ? selectedPrinter.model : null}</span
          >
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_fw_version.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail"
            >${selectedPrinter ? selectedPrinter.sw_version : null}</span
          >
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_online.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail">${printerStateOnline}</span>
        </div>
        <div class="info-row">
          <span class="info-heading">
            ${localize(
              "panels.main.cards.main.fields.printer_available.heading",
              this.hass.language,
            )}:</span
          >
          <span class="info-detail">${printerStateAvailable}</span>
        </div>
        ${aceEntityFwVersion
          ? html`<div class="info-row">
              <span class="info-heading">
                ${localize(
                  "panels.main.cards.main.fields.ace_fw_version.heading",
                  this.hass.language,
                )}:</span
              >
              <span class="info-detail">${aceStateFwVersion}</span>
            </div>`
          : null}
        ${aceEntityDryingActive
          ? html`<div class="info-row">
              <span class="info-heading">
                ${localize(
                  "panels.main.cards.main.fields.drying_active.heading",
                  this.hass.language,
                )}:</span
              >
              <span class="info-detail">${aceStateDryingActive}</span>
            </div>`
          : null}
        ${aceEntityDryingRemaining
          ? html`<div class="info-row">
              <span class="info-heading">
                ${localize(
                  "panels.main.cards.main.fields.drying_progress.heading",
                  this.hass.language,
                )}:</span
              >
              <span class="info-detail">${aceDryingProgress}%</span>
            </div>`
          : null}
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
