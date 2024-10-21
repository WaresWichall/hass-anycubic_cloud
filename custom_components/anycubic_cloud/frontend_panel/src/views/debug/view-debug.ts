import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { getPrinterEntities } from "../../helpers";
import {
  HomeAssistant,
  HassDevice,
  HassDeviceList,
  HassEntityInfos,
  HassPanel,
  HassRoute,
} from "../../types";

@customElement("anycubic-view-debug")
export class AnycubicViewDebug extends LitElement {
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
  public printers?: HassDeviceList;

  @property()
  public selectedPrinterID: string | undefined;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @state()
  private printerEntities: HassEntityInfos;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("selectedPrinterID")) {
      return;
    }

    this.printerEntities = getPrinterEntities(
      this.hass,
      this.selectedPrinterID,
    );
  }

  render(): any {
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
        <pre>${JSON.stringify(this.printerEntities, undefined, 2)}</pre>
        Selected Printer
        <pre>${JSON.stringify(this.selectedPrinterDevice, undefined, 2)}</pre>
      </debug-data>
    `;
  }

  static get styles(): any {
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
