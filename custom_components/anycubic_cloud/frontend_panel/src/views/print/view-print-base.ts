import { mdiPlay } from "@mdi/js";
import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";

import { commonPrintStyle } from "./styles";
import { localize } from "../../../localize/localize";

import { platform } from "../../const";
import { HASSDomEvent } from "../../fire_event";
import { fireHaptic } from "../../fire_haptic";
import { loadHaServiceControl } from "../../load-ha-elements";
import {
  FormChangeDetail,
  HassDevice,
  HassPanel,
  HassProgressButton,
  HassRoute,
  HassServiceError,
  HomeAssistant,
  LitTemplateResult,
} from "../../types";

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

  @property({ attribute: "selected-printer-id" })
  public selectedPrinterID: string | undefined;

  @property({ attribute: "selected-printer-device" })
  public selectedPrinterDevice: HassDevice | undefined;

  @state() private _scriptData: Record<
    string,
    string | Record<string, string> | undefined
  > = {};

  @state()
  private _error: string | undefined;

  @state()
  protected _serviceName: string = "";

  @state()
  private _buttonPrint: string;

  @state()
  private _buttonProgress: boolean = false;

  async firstUpdated(): Promise<void> {
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
            ...((this._scriptData.data as object | undefined) ||
              ({} as object)),
            config_entry: this.selectedPrinterDevice.primary_config_entry,
            device_id: this.selectedPrinterDevice.id,
          },
        };
      }
    }
  }

  render(): LitTemplateResult {
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
          .progress=${this._buttonProgress}
        >
          <ha-svg-icon .path=${mdiPlay}></ha-svg-icon>
          ${this._buttonPrint}
        </ha-progress-button>
      </ac-print-view>
    `;
  }

  private _scriptDataChanged = (ev: HASSDomEvent<FormChangeDetail>): void => {
    this._scriptData = { ...this._scriptData, ...ev.detail.value };
    this._error = undefined;
  };

  private _runScript = (ev: Event): void => {
    const button = ev.currentTarget as unknown as HassProgressButton;
    this._error = undefined;
    ev.stopPropagation();
    this._buttonProgress = true;
    fireHaptic();
    this.hass
      .callService(platform, this._serviceName, this._scriptData.data as object)
      .then(() => {
        button.actionSuccess();
        this._buttonProgress = false;
      })
      .catch((e: unknown) => {
        this._error = (e as HassServiceError).message;
        button.actionError();
        this._buttonProgress = false;
      });
  };

  static get styles(): CSSResult {
    return css`
      ${commonPrintStyle}
    `;
  }
}
