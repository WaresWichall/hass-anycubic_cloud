import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { animate } from "@lit-labs/motion";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import {
  getPrinterDryingButtonStateObj,
  getPrinterEntityId,
  isPrinterButtonStateAvailable,
} from "../../../helpers";

import { HomeAssistant, HassDevice, HassEntityInfos } from "../../../types";

import { commonModalStyle } from "../../ui/modal-styles";

import "../../ui/select-dropdown.ts";

const animOptionsCard = {
  keyframeOptions: {
    duration: 250,
    direction: "alternate",
    easing: "ease-in-out",
  },
  properties: ["height", "opacity", "scale"],
};

const PRIMARY_DRYING_PRESET_1 = "drying_preset_1";
const PRIMARY_DRYING_PRESET_2 = "drying_preset_2";
const PRIMARY_DRYING_PRESET_3 = "drying_preset_3";
const PRIMARY_DRYING_PRESET_4 = "drying_preset_4";
const PRIMARY_DRYING_STOP = "drying_stop";

const SECONDARY_PREFIX = "secondary_";

const SECONDARY_DRYING_PRESET_1 = SECONDARY_PREFIX + PRIMARY_DRYING_PRESET_1;
const SECONDARY_DRYING_PRESET_2 = SECONDARY_PREFIX + PRIMARY_DRYING_PRESET_2;
const SECONDARY_DRYING_PRESET_3 = SECONDARY_PREFIX + PRIMARY_DRYING_PRESET_3;
const SECONDARY_DRYING_PRESET_4 = SECONDARY_PREFIX + PRIMARY_DRYING_PRESET_4;
const SECONDARY_DRYING_STOP = SECONDARY_PREFIX + PRIMARY_DRYING_STOP;

@customElementIfUndef("anycubic-printercard-multicolorbox_modal_drying")
export class AnycubicPrintercardMulticolorboxModalDrying extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @state()
  private box_id: number = 0;

  @state()
  private _dryingPresetId1: string = PRIMARY_DRYING_PRESET_1;

  @state()
  private _dryingPresetId2: string = PRIMARY_DRYING_PRESET_2;

  @state()
  private _dryingPresetId3: string = PRIMARY_DRYING_PRESET_3;

  @state()
  private _dryingPresetId4: string = PRIMARY_DRYING_PRESET_4;

  @state()
  private _dryingStopId: string = PRIMARY_DRYING_STOP;

  @state()
  private _hasDryingPreset1: boolean = false;

  @state()
  private _hasDryingPreset2: boolean = false;

  @state()
  private _hasDryingPreset3: boolean = false;

  @state()
  private _hasDryingPreset4: boolean = false;

  @state()
  private _hasDryingStop: boolean = false;

  @state()
  private _dryingPresetTemp1: string = "";

  @state()
  private _dryingPresetDur1: string = "";

  @state()
  private _dryingPresetTemp2: string = "";

  @state()
  private _dryingPresetDur2: string = "";

  @state()
  private _dryingPresetTemp3: string = "";

  @state()
  private _dryingPresetDur3: string = "";

  @state()
  private _dryingPresetTemp4: string = "";

  @state()
  private _dryingPresetDur4: string = "";

  @state()
  private _isOpen: boolean = false;

  @state()
  private language: string;

  async firstUpdated(): void {
    this.addEventListener("click", (e) => {
      this._closeModal(e);
    });
  }

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("ac-mcbdry-modal", this._handleModalEvent);
  }

  public disconnectedCallback(): void {
    window.removeEventListener("ac-mcbdry-modal", this._handleModalEvent);
    super.disconnectedCallback();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
    }

    if (changedProperties.has("box_id")) {
      if (this.box_id === 1) {
        this._dryingPresetId1 = SECONDARY_DRYING_PRESET_1;
        this._dryingPresetId2 = SECONDARY_DRYING_PRESET_2;
        this._dryingPresetId3 = SECONDARY_DRYING_PRESET_3;
        this._dryingPresetId4 = SECONDARY_DRYING_PRESET_4;
        this._dryingStopId = SECONDARY_DRYING_STOP;
      } else {
        this._dryingPresetId1 = PRIMARY_DRYING_PRESET_1;
        this._dryingPresetId2 = PRIMARY_DRYING_PRESET_2;
        this._dryingPresetId3 = PRIMARY_DRYING_PRESET_3;
        this._dryingPresetId4 = PRIMARY_DRYING_PRESET_4;
        this._dryingStopId = PRIMARY_DRYING_STOP;
      }
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("selectedPrinterDevice")
    ) {
      const dryingPresetState1 = getPrinterDryingButtonStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._dryingPresetId1,
      );
      this._hasDryingPreset1 =
        isPrinterButtonStateAvailable(dryingPresetState1);
      this._dryingPresetTemp1 = dryingPresetState1.attributes.temperature;
      this._dryingPresetDur1 = dryingPresetState1.attributes.duration;
      const dryingPresetState2 = getPrinterDryingButtonStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._dryingPresetId2,
      );
      this._hasDryingPreset2 =
        isPrinterButtonStateAvailable(dryingPresetState2);
      this._dryingPresetTemp2 = dryingPresetState2.attributes.temperature;
      this._dryingPresetDur2 = dryingPresetState2.attributes.duration;
      const dryingPresetState3 = getPrinterDryingButtonStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._dryingPresetId3,
      );
      this._hasDryingPreset3 =
        isPrinterButtonStateAvailable(dryingPresetState3);
      this._dryingPresetTemp3 = dryingPresetState3.attributes.temperature;
      this._dryingPresetDur3 = dryingPresetState3.attributes.duration;
      const dryingPresetState4 = getPrinterDryingButtonStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._dryingPresetId4,
      );
      this._hasDryingPreset4 =
        isPrinterButtonStateAvailable(dryingPresetState4);
      this._dryingPresetTemp4 = dryingPresetState4.attributes.temperature;
      this._dryingPresetDur4 = dryingPresetState4.attributes.duration;
      const dryingStopState = getPrinterDryingButtonStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._dryingStopId,
      );
      this._hasDryingStop = isPrinterButtonStateAvailable(dryingStopState);
    }
  }

  protected update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);
    if (this._isOpen) {
      this.style.display = "block";
    } else {
      this.style.display = "none";
    }
  }

  render(): any {
    const stylesMain = {
      height: this.isHidden ? "1px" : "auto",
      opacity: this.isHidden ? 0.0 : 1.0,
      scale: this.isHidden ? 0.0 : 1.0,
    };

    return html`
      <div
        class="ac-modal-container"
        style=${styleMap(stylesMain)}
        ${animate({ ...animOptionsCard })}
      >
        <span
          class="ac-modal-close"
          @click="${(e): void => {
            this._closeModal(e);
          }}"
          >&times;</span
        >
        <div
          class="ac-modal-card"
          @click="${(e): void => {
            this._cardClick(e);
          }}"
        >
          ${this._renderCard()}
        </div>
      </div>
    `;
  }

  _renderCard(): any {
    return html`
      <div>
        <div class="ac-drying-header">
          ${localize("card.headings.drying_options", this.language)}
        </div>
        <div class="ac-drying-buttonscont">
          ${this._hasDryingPreset1
            ? html`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleDryingPreset1();
                    }}"
                  >
                    ${localize("card.buttons.preset", this.language)} 1<br />
                    ${this._dryingPresetDur1} Mins @
                    ${this._dryingPresetTemp1}°C
                  </ha-control-button>
                </div>
              `
            : nothing}
          ${this._hasDryingPreset2
            ? html`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleDryingPreset2();
                    }}"
                  >
                    ${localize("card.buttons.preset", this.language)} 2<br />
                    ${this._dryingPresetDur2} Mins @
                    ${this._dryingPresetTemp2}°C
                  </ha-control-button>
                </div>
              `
            : nothing}
          ${this._hasDryingPreset3
            ? html`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleDryingPreset3();
                    }}"
                  >
                    ${localize("card.buttons.preset", this.language)} 3<br />
                    ${this._dryingPresetDur3} Mins @
                    ${this._dryingPresetTemp3}°C
                  </ha-control-button>
                </div>
              `
            : nothing}
          ${this._hasDryingPreset4
            ? html`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleDryingPreset4();
                    }}"
                  >
                    ${localize("card.buttons.preset", this.language)} 4<br />
                    ${this._dryingPresetDur4} Mins @
                    ${this._dryingPresetTemp4}°C
                  </ha-control-button>
                </div>
              `
            : nothing}
          ${this._hasDryingStop
            ? html`
                <div class="ac-flex-break"></div>
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleDryingStop();
                    }}"
                  >
                    ${localize("card.buttons.stop_drying", this.language)}
                  </ha-control-button>
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _pressHassButton(suffix: string): void {
    if (this.printerEntityIdPart) {
      this.hass
        .callService("button", "press", {
          entity_id: getPrinterEntityId(
            this.printerEntityIdPart,
            "button",
            suffix,
          ),
        })
        .then()
        .catch((_e) => {
          // Show in error modal
        });
    }
  }

  private _handleDryingPreset1(): void {
    this._pressHassButton(this._dryingPresetId1);
    this._closeModal();
  }

  private _handleDryingPreset2(): void {
    this._pressHassButton(this._dryingPresetId2);
    this._closeModal();
  }

  private _handleDryingPreset3(): void {
    this._pressHassButton(this._dryingPresetId3);
    this._closeModal();
  }

  private _handleDryingPreset4(): void {
    this._pressHassButton(this._dryingPresetId4);
    this._closeModal();
  }

  private _handleDryingStop(): void {
    this._pressHassButton(this._dryingStopId);
    this._closeModal();
  }

  private _handleModalEvent = (e: Event): void => {
    e.stopPropagation();
    if (e.detail.modalOpen) {
      this._isOpen = true;
      this.box_id = Number(e.detail.box_id);
    }
  };

  private _closeModal(e?: Event | undefined): void {
    if (e) {
      e.stopPropagation();
    }
    this._isOpen = false;
    this.box_id = 0;
  }

  private _cardClick(e: Event): void {
    e.stopPropagation();
  }

  static get styles(): any {
    return css`
      ${commonModalStyle}

      .ac-drying-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      ha-control-button {
        min-width: 150px;
        font-size: 14px;
        min-height: 55px;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-flex-break {
        flex-basis: 100%;
        height: 0;
      }

      .ac-drying-buttonscont {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        align-items: center;
        justify-content: center;
      }

      .ac-drying-buttoncont {
        width: 50%;
        margin: 0;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
      }
    `;
  }
}
