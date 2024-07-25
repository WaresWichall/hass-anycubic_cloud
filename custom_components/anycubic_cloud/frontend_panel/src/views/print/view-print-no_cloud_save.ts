import { mdiPlay } from "@mdi/js";
import { LitElement, html, css } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import { getPrinterDevID, getSelectedPrinter } from "../../helpers";
import { loadHaServiceControl } from "../../load-ha-elements";
import {
  HomeAssistant,
  HassDeviceList,
  HassPanel,
  HassRoute,
} from "../../types";

@customElement("anycubic-view-print-no_cloud_save")
export class AnycubicViewPrintNoCloudSave extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public printers?: HassDeviceList;

  @state() private _scriptData: Record<string, any> = {
    service: "anycubic_cloud.print_and_upload_no_cloud_save",
    data: {},
  };

  @state() private narrow = false;

  async firstUpdated() {
    await loadHaServiceControl();
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    const selectedPrinterID = getPrinterDevID(this.route);
    const selectedPrinter = getSelectedPrinter(
      this.printers,
      selectedPrinterID,
    );

    if (selectedPrinter) {
      this._scriptData = {
        ...this._scriptData,
        data: {
          ...(this._scriptData.data || {}),
          config_entry: selectedPrinter.primary_config_entry,
          device_id: selectedPrinter.id,
        },
      };
    }
  }

  render() {
    return html`
      <ac-print-view elevation="2">
        <ha-service-control
          hidePicker
          .hass=${this.hass}
          .value=${this._scriptData}
          .showAdvanced=${true}
          .narrow=${this.narrow}
          @value-changed=${this._scriptDataChanged}
        ></ha-service-control>
        <ha-control-button
          class="print-button"
          @click=${this._runScript}
          .disabled=${false}
        >
          <ha-svg-icon .path=${mdiPlay}></ha-svg-icon>
          ${localize(
            "panels.print_no_cloud_save.actions.print",
            this.hass.language,
          )}
        </ha-control-button>
      </ac-print-view>
    `;
  }

  static get styles() {
    return css`
      :host {
        padding: 16px;
        display: block;
      }
      ac-print-view {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .print-button {
        margin: auto;
        width: 200px;
        height: 60px;
      }
    `;
  }

  private _scriptDataChanged(ev: CustomEvent): void {
    this._scriptData = { ...this._scriptData, ...ev.detail.value };
  }

  private async _runScript(ev: Event) {
    ev.stopPropagation();
    this.hass.callService(
      "anycubic_cloud",
      "print_and_upload_no_cloud_save",
      this._scriptData.data,
    );
  }
}
