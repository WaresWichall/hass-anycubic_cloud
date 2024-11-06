import { CSSResult, LitElement, PropertyValues, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { query } from "lit/decorators/query.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit/directives/style-map.js";
import { animate, Options as motionOptions } from "@lit-labs/motion";

import { localize } from "../../../../localize/localize";

import "../../../lib/colorpicker/ColorPicker.js";

import { platform } from "../../../const";
import { HASSDomEvent } from "../../../fire_event";
import { customElementIfUndef } from "../../../internal/register-custom-element";

import { materialTypeFromString } from "../../../helpers";
import {
  AnycubicMaterialType,
  AnycubicSpoolInfo,
  ColorPicker,
  ColourPickEvent,
  DomClickEvent,
  DropdownEvent,
  EvtTargColourPreset,
  HassDevice,
  HomeAssistant,
  LitTemplateResult,
  ModalEventSpool,
} from "../../../types";

import { commonModalStyle } from "../../ui/modal-styles";

import "../../ui/select-dropdown.ts";

const animOptionsCard: motionOptions = {
  keyframeOptions: {
    duration: 250,
    direction: "alternate",
    easing: "ease-in-out",
  },
  properties: ["height", "opacity", "scale"],
};

@customElementIfUndef("anycubic-printercard-multicolorbox_modal_spool")
export class AnycubicPrintercardMulticolorboxModalSpool extends LitElement {
  @query("color-picker")
  private _elColorPicker: ColorPicker | undefined;

  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

  @property({ attribute: "selected-printer-device" })
  public selectedPrinterDevice: HassDevice | undefined;

  @property({ attribute: "slot-colors" })
  public slotColors?: string[];

  @state()
  private box_id: number = 0;

  @state()
  private spoolList: AnycubicSpoolInfo[] = [];

  @state()
  private spool_index: number = -1;

  @state()
  private material_type: AnycubicMaterialType | undefined;

  @state()
  private color: number[] | string | undefined;

  @state()
  private _isOpen: boolean = false;

  @state()
  private _heading: string;

  @state()
  private _labelSelectMaterial: string;

  @state()
  private _labelSelectColour: string;

  @state()
  private _buttonSave: string;

  @state()
  private _changingSlot: boolean = false;

  // eslint-disable-next-line @typescript-eslint/require-await
  async firstUpdated(): Promise<void> {
    this.addEventListener("click", (e) => {
      this._closeModal(e);
    });
    this.addEventListener("ac-select-dropdown", this._handleDropdownEvent);
    this.addEventListener("colorchanged", this._handleColourEvent);
    this.addEventListener("colorpicked", this._handleColourPickEvent);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener(
      "ac-mcb-modal",
      this._handleModalEvent,
    );
  }

  public disconnectedCallback(): void {
    this.parentElement?.removeEventListener(
      "ac-mcb-modal",
      this._handleModalEvent,
    );
    super.disconnectedCallback();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);
    if (changedProperties.has("language")) {
      this._heading = localize("card.spool_settings.heading", this.language);
      this._labelSelectMaterial = localize(
        "card.spool_settings.label_select_material",
        this.language,
      );
      this._labelSelectColour = localize(
        "card.spool_settings.label_select_colour",
        this.language,
      );
      this._buttonSave = localize("common.actions.save", this.language);
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

  render(): LitTemplateResult {
    const stylesMain = {
      height: "auto",
      opacity: 1.0,
      scale: 1.0,
    };

    return html`
      <div
        class="ac-modal-container"
        style=${styleMap(stylesMain)}
        ${animate({ ...animOptionsCard })}
      >
        <span class="ac-modal-close" @click=${this._closeModal}>&times;</span>
        <div class="ac-modal-card" @click=${this._cardClick}>
          ${this.color ? this._renderCard() : nothing}
        </div>
      </div>
    `;
  }

  _renderCard(): LitTemplateResult {
    return this.spool_index >= 0
      ? html`
          <div>
            <div class="ac-slot-title">
              ${this._heading}: ${this.spool_index + 1}
            </div>
            <div>
              <div>
                <p class="ac-modal-label">${this._labelSelectMaterial}:</p>
                <anycubic-ui-select-dropdown
                  .availableOptions=${AnycubicMaterialType}
                  .placeholder=${AnycubicMaterialType.PLA}
                  .initialItem=${this.material_type}
                ></anycubic-ui-select-dropdown>
              </div>
              ${this._renderPresets()}
              <div>
                <p class="ac-modal-label">${this._labelSelectColour}:</p>
                <color-picker .value=${this.color}></color-picker>
              </div>
            </div>
            <div class="ac-save-settings">
              <ha-control-button
                .disabled=${this._changingSlot}
                @click=${this._handleSaveButton}
              >
                ${this._buttonSave}
              </ha-control-button>
            </div>
          </div>
        `
      : nothing;
  }

  private _renderPresets(): LitTemplateResult {
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
                    .preset=${preset}
                    @click=${this._colourPresetChange}
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

  private _colourPresetChange = (
    ev: DomClickEvent<EvtTargColourPreset>,
  ): void => {
    this.color = ev.currentTarget.preset;
    if (this._elColorPicker) {
      this._elColorPicker.color = this.color;
    }
  };

  private _handleModalEvent = (evt: Event): void => {
    const e = evt as HASSDomEvent<ModalEventSpool>;
    e.stopPropagation();
    if (e.detail.modalOpen) {
      this._isOpen = true;
      this.box_id = Number(e.detail.box_id);
      this.spool_index = Number(e.detail.spool_index);
      this.material_type = materialTypeFromString(e.detail.material_type);
      this.color = e.detail.color;
    }
  };

  private _handleDropdownEvent = (evt: Event): void => {
    const e = evt as HASSDomEvent<DropdownEvent<string, string>>;
    e.stopPropagation();
    if (e.detail.value) {
      this.material_type = materialTypeFromString(e.detail.value);
    }
  };

  private _handleColourEvent = (evt: Event): void => {
    const e = evt as HASSDomEvent<ColourPickEvent>;
    e.stopPropagation();
    if (e.detail.color) {
      this.color = e.detail.color.rgb;
    }
  };

  private _handleColourPickEvent = (e: Event): void => {
    this._handleColourEvent(e);
    if (!this._changingSlot) {
      this._submitSlotChanges();
    }
  };

  private _handleSaveButton = (): void => {
    this._submitSlotChanges();
  };

  private _submitSlotChanges(): void {
    if (
      this.selectedPrinterDevice &&
      this.material_type &&
      this.spool_index >= 0 &&
      this.color &&
      this.color.length >= 3
    ) {
      const serv = `multi_color_box_set_slot_${this.material_type.toLowerCase()}`;
      this._changingSlot = true;
      this.hass
        .callService(platform, serv, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          box_id: this.box_id,
          slot_number: this.spool_index + 1,
          slot_color_red: this.color[0],
          slot_color_green: this.color[1],
          slot_color_blue: this.color[2],
        })
        .then(() => {
          this._changingSlot = false;
        })
        .catch((_e: unknown) => {
          this._changingSlot = false;
        });
      this._closeModal();
    }
  }

  private _closeModal = (e?: Event | undefined): void => {
    if (e) {
      e.stopPropagation();
    }
    this._isOpen = false;
    this.spool_index = -1;
    this.material_type = undefined;
    this.color = undefined;
    this.box_id = 0;
  };

  private _cardClick = (e: Event): void => {
    e.stopPropagation();
  };

  static get styles(): CSSResult {
    return css`
      ${commonModalStyle}

      .ac-slot-title {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
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
        font-size: 14px;
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
