import { mdiPlay } from "@mdi/js";
import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import { fireHaptic } from "../../fire_haptic";
import { loadHaServiceControl } from "../../load-ha-elements";
import { HomeAssistant, HassDevice, HassPanel, HassRoute } from "../../types";

@customElement("anycubic-view-print-save_in_cloud")
export class AnycubicViewPrintSaveInCloud extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property()
  public route!: HassRoute;

  @property()
  public panel!: HassPanel;

  @property()
  public selectedPrinterID: string | undefined;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @state() private _scriptData: Record<string, any> = {
    service: "anycubic_cloud.print_and_upload_save_in_cloud",
    data: {},
  };

  @state() private narrow = false;

  async firstUpdated(): void {
    await loadHaServiceControl();
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("selectedPrinterDevice")) {
      return;
    }

    if (this.selectedPrinterDevice) {
      this._scriptData = {
        ...this._scriptData,
        data: {
          ...(this._scriptData.data || {}),
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
        },
      };
    }
  }

  render(): any {
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
            "panels.print_save_in_cloud.actions.print",
            this.hass.language,
          )}
        </ha-control-button>
      </ac-print-view>
    `;
  }

  static get styles(): any {
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

  private async _runScript(ev: Event): void {
    ev.stopPropagation();
    fireHaptic();
    this.hass.callService(
      "anycubic_cloud",
      "print_and_upload_save_in_cloud",
      this._scriptData.data,
    );
  }
}
