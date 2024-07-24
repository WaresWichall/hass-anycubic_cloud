import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import {
  getPrinterDevID,
  getPrinterEntities,
  getSelectedPrinter,
} from "../../helpers";
import {
  HomeAssistant,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "../../types";

@customElement("anycubic-view-debug")
export class AnycubicViewDebug extends LitElement {
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

    const printerEntities = getPrinterEntities(this.hass, selectedPrinterID);

    return html`
      <debug-data elevation="2">
        <p>There are ${Object.keys(this.hass.states).length} entities.</p>
        <p>The screen is${this.narrow ? "" : " not"} narrow.</p>
        Configured panel config
        <pre>${JSON.stringify(this.panel, undefined, 2)}</pre>
        Current route
        <pre>${JSON.stringify(this.route, undefined, 2)}</pre>
        Printers
        <pre>${JSON.stringify(this.printers, undefined, 2)}</pre>
        Printer Entities
        <pre>${JSON.stringify(printerEntities, undefined, 2)}</pre>
        Selected Printer
        <pre>${JSON.stringify(selectedPrinter, undefined, 2)}</pre>
      </debug-data>
    `;
  }

  static get styles() {
    return css`
      :host {
        padding: 16px;
        display: block;
      }
      debug-data {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `;
  }
}
