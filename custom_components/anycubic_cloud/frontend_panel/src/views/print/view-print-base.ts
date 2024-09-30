import { mdiPlay } from "@mdi/js";
import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { localize } from "../../../localize/localize";

import { platform } from "../../const";
import { fireHaptic } from "../../fire_haptic";
import { loadHaServiceControl } from "../../load-ha-elements";
import { HomeAssistant, HassDevice, HassPanel, HassRoute } from "../../types";

import { commonPrintStyle } from "./styles";

export class AnycubicViewPrintBase extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

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

  @state() private _scriptData: Record<string, any> = {};

  @state()
  private _error: string | undefined;

  @state()
  private _serviceName: string = "";

  @state()
  private _buttonPrint: string;

  async firstUpdated(): void {
    await loadHaServiceControl();
  }

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._buttonPrint = localize("common.actions.print", this.language);
    }

    if (changedProperties.has("selectedPrinterDevice")) {
      if (this.selectedPrinterDevice) {
        const srvName = `${platform}.${this._serviceName}`;
        this._scriptData = {
          ...this._scriptData,
          action: srvName,
          service: srvName,
          data: {
            ...(this._scriptData.data || {}),
            config_entry: this.selectedPrinterDevice.primary_config_entry,
            device_id: this.selectedPrinterDevice.id,
          },
        };
      }
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
        ${this._error !== undefined
          ? html`<ha-alert alert-type="error">${this._error}</ha-alert>`
          : nothing}
        <ha-progress-button
          class="print-button"
          raised
          @click=${this._runScript}
        >
          <ha-svg-icon .path=${mdiPlay}></ha-svg-icon>
          ${this._buttonPrint}
        </ha-progress-button>
      </ac-print-view>
    `;
  }

  private _scriptDataChanged(ev: CustomEvent): void {
    this._scriptData = { ...this._scriptData, ...ev.detail.value };
    this._error = undefined;
  }

  private async _runScript(ev: Event): void {
    const button = ev.currentTarget as any;
    this._error = undefined;
    ev.stopPropagation();
    fireHaptic();
    this.hass
      .callService(platform, this._serviceName, this._scriptData.data)
      .then(() => {
        button.actionSuccess();
      })
      .catch((e) => {
        this._error = e.message;
        button.actionError();
      });
  }

  static get styles(): any {
    return css`
      ${commonPrintStyle}
    `;
  }
}
