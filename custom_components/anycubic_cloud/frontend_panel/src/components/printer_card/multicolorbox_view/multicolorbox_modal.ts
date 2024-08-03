import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { animate } from "@lit-labs/motion";

import "../../../lib/colorpicker/ColorPicker.js";

import { platform } from "../../../const";
import { customElementIfUndef } from "../../../internal/register-custom-element";

import {
  AnycubicMaterialType,
  AnycubicSpoolInfo,
  HomeAssistant,
  HassDevice,
} from "../../../types";

import "../../ui/select-dropdown.ts";

const animOptionsCard = {
  keyframeOptions: {
    duration: 250,
    direction: "alternate",
    easing: "ease-in-out",
  },
  properties: ["height", "opacity", "scale"],
};

@customElementIfUndef("anycubic-printercard-multicolorbox_modal")
export class AnycubicPrintercardMulticolorboxModal extends LitElement {
  @query("color-picker")
  private _elColorPicker;

  @property()
  public hass!: HomeAssistant;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @property()
  public slotColors?: string[];

  @state()
  private spoolList: AnycubicSpoolInfo[] = [];

  @state()
  private spool_index: number = -1;

  @state()
  private material_type: AnycubicMaterialType | undefined;

  @state()
  private color: number[] | undefined;

  // @state()
  // private modalOpen: boolean = false;

  @state()
  private _isOpen: boolean = false;

  async firstUpdated(): void {
    window.addEventListener("ac-mcb-modal", (e) => {
      this._handleModalEvent(e);
    });
    window.addEventListener("ac-select-dropdown", (e) => {
      this._handleDropdownEvent(e);
    });
    window.addEventListener("colorchanged", (e) => {
      this._handleColourEvent(e);
    });
    window.addEventListener("colorpicked", (e) => {
      this._handleColourPickEvent(e);
    });
    this.addEventListener("click", (e) => {
      this._closeModal(e);
    });
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
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
          ${this.color ? this._renderCard() : nothing}
        </div>
      </div>
    `;
  }

  _renderCard(): any {
    return this.spool_index >= 0
      ? html`
          <div>
            <div class="ac-slot-title">
              Editing Slot: ${this.spool_index + 1}
            </div>
            <div>
              <div>
                <p class="ac-modal-label">Select Material:</p>
                <anycubic-ui-select-dropdown
                  .availableOptions=${AnycubicMaterialType}
                  .placeholder=${AnycubicMaterialType.PLA}
                  .initialItem=${this.material_type}
                ></anycubic-ui-select-dropdown>
              </div>
              ${this._renderPresets()}
              <div>
                <p class="ac-modal-label">Manually select colour:</p>
                <color-picker .value="${this.color}"></color-picker>
              </div>
            </div>
            <div class="ac-save-settings">
              <ha-control-button
                @click="${(_e): void => {
                  this._handleSaveButton();
                }}"
              >
                Save
              </ha-control-button>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderPresets(): HTMLElement {
    return html`
      <div>
        <p class="ac-modal-label">Choose Preset Colour:</p>
        <div class="ac-mcb-presets">
          ${this.slotColors
            ? map(this.slotColors, (preset, _index) => {
                const presetStyle = {
                  "background-color": preset,
                };
                return html`
                  <div
                    class="ac-mcb-preset-color"
                    style=${styleMap(presetStyle)}
                    @click="${(_e): void => {
                      this._colourPresetChange(preset);
                    }}"
                  >
                    &nbsp;
                  </div>
                `;
              })
            : nothing}
        </div>
      </div>
    `;
  }

  private _colourPresetChange(newPreset: string): void {
    this.color = newPreset;
    if (this._elColorPicker) {
      this._elColorPicker.color = this.color;
    }
  }

  private _handleModalEvent(e: Event): void {
    e.stopPropagation();
    if (e.detail.modalOpen) {
      this._isOpen = true;
      this.spool_index = Number(e.detail.spool_index);
      this.material_type = e.detail.material_type
        ? AnycubicMaterialType[e.detail.material_type.toUpperCase()]
        : undefined;
      this.color = e.detail.color;
    }
  }

  private _handleDropdownEvent(e: Event): void {
    e.stopPropagation();
    if (e.detail.value) {
      this.material_type = AnycubicMaterialType[e.detail.value];
    }
  }

  private _handleColourEvent(e: Event): void {
    e.stopPropagation();
    if (e.detail.color) {
      this.color = e.detail.color.rgb;
    }
  }

  private _handleColourPickEvent(e: Event): void {
    this._handleColourEvent(e);
    this._submitSlotChanges();
  }

  private _handleSaveButton(): void {
    this._submitSlotChanges();
  }

  private _submitSlotChanges(): void {
    if (
      this.selectedPrinterDevice &&
      this.material_type &&
      this.spool_index >= 0 &&
      this.color &&
      this.color.length >= 3
    ) {
      const serv = `multi_color_box_set_slot_${this.material_type.toLowerCase()}`;
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        slot_number: this.spool_index + 1,
        slot_color_red: this.color[0],
        slot_color_green: this.color[1],
        slot_color_blue: this.color[2],
      });
      this._closeModal();
    }
  }

  private _closeModal(e?: Event | undefined): void {
    if (e) {
      e.stopPropagation();
    }
    this._isOpen = false;
    this.spool_index = -1;
    this.material_type = undefined;
    this.color = undefined;
  }

  private _cardClick(e: Event): void {
    e.stopPropagation();
  }

  static get styles(): any {
    return css`
      :host {
        display: none;
        position: fixed;
        z-index: 10;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(3px);
      }

      .ac-modal-container {
        border-radius: 16px;
        background-color: var(--primary-background-color);
        margin: auto;
        padding: 20px;
        width: 80%;
        min-height: 150px;
        max-width: 500px;
        margin-top: 50px;
        box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.3);
      }

      .ac-modal-card {
        padding: 20px;
      }
      .ac-modal-close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
      }

      .ac-modal-close:hover,
      .ac-modal-close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }

      .ac-slot-title {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      .ac-modal-label {
      }

      .ac-mcb-presets {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      }

      .ac-mcb-preset-color {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        margin: 20px 10px;
      }

      ha-control-button {
        min-width: 150px;
        margin: 30px auto 0px;
      }

      color-picker {
        --font-fam: var(--token-font-family-primary);
        --bg-color: var(--ha-card-background);
        --label-color: var(--secondary-text-color);
        --form-border-color: var(--ha-card-background);
        --input-active-border-color: var(--primary-color);
        --input-bg: var(--primary-background-color);
        --input-active-bg: var(--ha-card-background);
        --input-color: var(--secondary-text-color);
        --input-active-color: var(--primary-text-color);
        --input-active-box-shadow: 0 2px 5px #ccc;
        --button-active-bg: var(--state-active-color);
        --button-active-color: var(--token-color-icon-primary);
        --outer-box-shadow: 0 4px 12px #111;
      }
    `;
  }
}
