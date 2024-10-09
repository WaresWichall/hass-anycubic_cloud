import { LitElement, html, css, PropertyValues, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { animate } from "@lit-labs/motion";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { platform } from "../../../const";

import {
  getPrinterEntityId,
  getPrinterSensorStateObj,
  isFDMPrinter,
  speedModesFromStateObj,
} from "../../../helpers";

import {
  AnycubicPrintOptionConfirmationType,
  HomeAssistant,
  HassEntityInfos,
  HassDevice,
  SelectDropdownProps,
} from "../../../types";

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

@customElementIfUndef("anycubic-printercard-printsettings_modal")
export class AnycubicPrintercardPrintsettingsModal extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public language!: string;

  @property()
  public selectedPrinterDevice: HassDevice | undefined;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @state()
  private availableSpeedModes: SelectDropdownProps[] = [];

  @state()
  private isFDM: boolean = false;

  @state()
  private currentSpeedModeKey: number = 0;

  @state()
  private currentSpeedModeDescr: string | undefined = undefined;

  @state()
  private _userEditSpeedMode: boolean = false;

  @state()
  private currentFanSpeed: number = 0;

  @state()
  private _userEditFanSpeed: boolean = false;

  @state()
  private currentAuxFanSpeed: number = 0;

  @state()
  private _userEditAuxFanSpeed: boolean = false;

  @state()
  private currentBoxFanSpeed: number = 0;

  @state()
  private _userEditBoxFanSpeed: boolean = false;

  @state()
  private currentTargetTempNozzle: number = 0;

  @state()
  private minTargetTempNozzle: number = 0;

  @state()
  private maxTargetTempNozzle: number = 0;

  @state()
  private _userEditTargetTempNozzle: boolean = false;

  @state()
  private currentTargetTempHotbed: number = 0;

  @state()
  private minTargetTempHotbed: number = 0;

  @state()
  private maxTargetTempHotbed: number = 0;

  @state()
  private _userEditTargetTempHotbed: boolean = false;

  @state()
  private _confirmationType: AnycubicPrintOptionConfirmationType | undefined;

  @state()
  private _isOpen: boolean = false;

  @state()
  private _confirmMessage: string;

  @state()
  private _labelNozzleTemperature: string;

  @state()
  private _labelHotbedTemperature: string;

  @state()
  private _labelFanSpeed: string;

  @state()
  private _labelAuxFanSpeed: string;

  @state()
  private _labelBoxFanSpeed: string;

  @state()
  private _buttonYes: string;

  @state()
  private _buttonNo: string;

  @state()
  private _buttonPrintPause: string;

  @state()
  private _buttonPrintResume: string;

  @state()
  private _buttonPrintCancel: string;

  @state()
  private _buttonSaveSpeedMode: string;

  @state()
  private _buttonSaveTargetNozzle: string;

  @state()
  private _buttonSaveTargetHotbed: string;

  @state()
  private _buttonSaveFanSpeed: string;

  @state()
  private _buttonSaveAuxFanSpeed: string;

  @state()
  private _buttonSaveBoxFanSpeed: string;

  async firstUpdated(): void {
    this.addEventListener("ac-select-dropdown", this._handleDropdownEvent);
    this.addEventListener("click", (e) => {
      this._closeModal(e);
    });
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener(
      "ac-printset-modal",
      this._handleModalEvent,
    );
  }

  public disconnectedCallback(): void {
    this.parentElement?.removeEventListener(
      "ac-printset-modal",
      this._handleModalEvent,
    );
    super.disconnectedCallback();
  }

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("language")) {
      this._labelNozzleTemperature = localize(
        "card.print_settings.label_nozzle_temp",
        this.language,
      );
      this._labelHotbedTemperature = localize(
        "card.print_settings.label_hotbed_temp",
        this.language,
      );
      this._labelFanSpeed = localize(
        "card.print_settings.label_fan_speed",
        this.language,
      );
      this._labelAuxFanSpeed = localize(
        "card.print_settings.label_aux_fan_speed",
        this.language,
      );
      this._labelBoxFanSpeed = localize(
        "card.print_settings.label_box_fan_speed",
        this.language,
      );
      this._buttonYes = localize("common.actions.yes", this.language);
      this._buttonNo = localize("common.actions.no", this.language);
      this._buttonPrintPause = localize(
        "card.print_settings.print_pause",
        this.language,
      );
      this._buttonPrintResume = localize(
        "card.print_settings.print_resume",
        this.language,
      );
      this._buttonPrintCancel = localize(
        "card.print_settings.print_cancel",
        this.language,
      );
      this._buttonSaveSpeedMode = localize(
        "card.print_settings.save_speed_mode",
        this.language,
      );
      this._buttonSaveTargetNozzle = localize(
        "card.print_settings.save_target_nozzle",
        this.language,
      );
      this._buttonSaveTargetHotbed = localize(
        "card.print_settings.save_target_hotbed",
        this.language,
      );
      this._buttonSaveFanSpeed = localize(
        "card.print_settings.save_fan_speed",
        this.language,
      );
      this._buttonSaveAuxFanSpeed = localize(
        "card.print_settings.save_aux_fan_speed",
        this.language,
      );
      this._buttonSaveBoxFanSpeed = localize(
        "card.print_settings.save_box_fan_speed",
        this.language,
      );
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("printerEntities") ||
      changedProperties.has("printerEntityIdPart")
    ) {
      this.isFDM = isFDMPrinter(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
      );
      if (!this._userEditFanSpeed) {
        this.currentFanSpeed = getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "fan_speed",
          0,
        ).state;
      }
      if (!this._userEditTargetTempNozzle) {
        const currentTargetTempNozzleState = getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "target_nozzle_temperature",
          0,
          { limit_min: 0, limit_max: 0 },
        );
        this.currentTargetTempNozzle = currentTargetTempNozzleState.state;
        this.minTargetTempNozzle =
          currentTargetTempNozzleState.attributes.limit_min;
        this.maxTargetTempNozzle =
          currentTargetTempNozzleState.attributes.limit_max;
      }
      if (!this._userEditTargetTempHotbed) {
        const currentTargetTempHotbedState = getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "target_hotbed_temperature",
          0,
          { limit_min: 0, limit_max: 0 },
        );
        this.currentTargetTempHotbed = currentTargetTempHotbedState.state;
        this.minTargetTempHotbed =
          currentTargetTempHotbedState.attributes.limit_min;
        this.maxTargetTempHotbed =
          currentTargetTempHotbedState.attributes.limit_max;
      }

      if (!this._userEditSpeedMode) {
        const speedModeState = getPrinterSensorStateObj(
          this.hass,
          this.printerEntities,
          this.printerEntityIdPart,
          "job_speed_mode",
          "",
          { available_modes: [], job_speed_mode_code: -1 },
        );
        this.availableSpeedModes = speedModesFromStateObj(speedModeState);
        this.currentSpeedModeKey =
          speedModeState.attributes.print_speed_mode_code;
        this.currentSpeedModeDescr =
          this.currentSpeedModeKey >= 0 &&
          this.currentSpeedModeKey in this.availableSpeedModes
            ? this.availableSpeedModes[this.currentSpeedModeKey]
            : undefined;
      }
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
    return this._confirmationType
      ? this._renderConfirm()
      : this._renderSettings();
  }

  _renderConfirm(): any {
    return html`
      <div>
        <div class="ac-settings-header">Confirm Action</div>
        <div>
          <div class="ac-confirm-description">${this._confirmMessage}</div>
          <div class="ac-confirm-buttons">
            <ha-control-button
              @click="${(_e): void => {
                this._handleConfirmApprove();
              }}"
            >
              ${this._buttonYes}
            </ha-control-button>
            <ha-control-button
              @click="${(_e): void => {
                this._handleConfirmCancel();
              }}"
            >
              ${this._buttonNo}
            </ha-control-button>
          </div>
        </div>
      </div>
    `;
  }

  _renderSettings(): any {
    return html`
      <div>
        <div class="ac-settings-header">Print Settings</div>
        <div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${(_e): void => {
                this._setConfirmationMode(
                  AnycubicPrintOptionConfirmationType.PAUSE,
                );
              }}"
            >
              ${this._buttonPrintPause}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${(_e): void => {
                this._setConfirmationMode(
                  AnycubicPrintOptionConfirmationType.RESUME,
                );
              }}"
            >
              ${this._buttonPrintResume}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${(_e): void => {
                this._setConfirmationMode(
                  AnycubicPrintOptionConfirmationType.CANCEL,
                );
              }}"
            >
              ${this._buttonPrintCancel}
            </ha-control-button>
          </div>
          ${this.isFDM
            ? html`
                <div class="ac-settings-row">
                  <anycubic-ui-select-dropdown
                    .availableOptions=${this.availableSpeedModes}
                    .placeholder=${this.currentSpeedModeDescr}
                    .initialItem=${this.currentSpeedModeDescr}
                  ></anycubic-ui-select-dropdown>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveSpeedModeButton();
                    }}"
                  >
                    ${this._buttonSaveSpeedMode}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempNozzle}
                    .placeholder=${this.currentTargetTempNozzle}
                    .label=${this._labelNozzleTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempNozzle}
                    .max=${this.maxTargetTempNozzle}
                    @input=${this._handleTargetTempNozzleChange}
                    @keydown=${this._handleTargetTempNozzleKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveTargetTempNozzleButton();
                    }}"
                  >
                    ${this._buttonSaveTargetNozzle}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempHotbed}
                    .placeholder=${this.currentTargetTempHotbed}
                    .label=${this._labelHotbedTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempHotbed}
                    .max=${this.maxTargetTempHotbed}
                    @input=${this._handleTargetTempHotbedChange}
                    @keydown=${this._handleTargetTempHotbedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveTargetTempHotbedButton();
                    }}"
                  >
                    ${this._buttonSaveTargetHotbed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentFanSpeed}
                    .placeholder=${this.currentFanSpeed}
                    .label=${this._labelFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleFanSpeedChange}
                    @keydown=${this._handleFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveFanSpeedButton();
                    }}"
                  >
                    ${this._buttonSaveFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentAuxFanSpeed}
                    .placeholder=${this.currentAuxFanSpeed}
                    .label=${this._labelAuxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleAuxFanSpeedChange}
                    @keydown=${this._handleAuxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveAuxFanSpeedButton();
                    }}"
                  >
                    ${this._buttonSaveAuxFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentBoxFanSpeed}
                    .placeholder=${this.currentBoxFanSpeed}
                    .label=${this._labelBoxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleBoxFanSpeedChange}
                    @keydown=${this._handleBoxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${(_e): void => {
                      this._handleSaveBoxFanSpeedButton();
                    }}"
                  >
                    ${this._buttonSaveBoxFanSpeed}
                  </ha-control-button>
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _setConfirmationMode(confirmationType): void {
    this._confirmationType = confirmationType;
    this._confirmMessage = localize(
      "card.print_settings.confirm_message",
      this.language,
      "action",
      localize("common.actions." + this._confirmationType, this.language),
    );
  }

  private _pressHassButton(suffix: string): void {
    this.hass.callService("button", "press", {
      entity_id: getPrinterEntityId(this.printerEntityIdPart, "button", suffix),
    });
  }

  private _handleConfirmApprove(): void {
    switch (this._confirmationType) {
      case AnycubicPrintOptionConfirmationType.PAUSE:
        this._pressHassButton("pause_print");
        break;
      case AnycubicPrintOptionConfirmationType.RESUME:
        this._pressHassButton("resume_print");
        break;
      case AnycubicPrintOptionConfirmationType.CANCEL:
        this._pressHassButton("cancel_print");
        break;
      default:
        break;
    }
    this._confirmationType = undefined;
    this._closeModal();
  }

  private _handleConfirmCancel(): void {
    this._confirmationType = undefined;
  }

  private _handleFanSpeedChange(ev: Event): void {
    const newSpeed = (ev.currentTarget as any).value;
    this.currentFanSpeed = Number(newSpeed);
    this._userEditFanSpeed = true;
  }

  private _handleAuxFanSpeedChange(ev: Event): void {
    const newSpeed = (ev.currentTarget as any).value;
    this.currentAuxFanSpeed = Number(newSpeed);
    this._userEditAuxFanSpeed = true;
  }

  private _handleBoxFanSpeedChange(ev: Event): void {
    const newSpeed = (ev.currentTarget as any).value;
    this.currentBoxFanSpeed = Number(newSpeed);
    this._userEditBoxFanSpeed = true;
  }

  private _handleFanSpeedKeyDown(ev: Event): void {
    if (ev.code === "Enter") {
      ev.preventDefault();
      this._submitChangedFanSpeed();
    } else {
      this._userEditFanSpeed = true;
    }
  }

  private _handleAuxFanSpeedKeyDown(ev: Event): void {
    if (ev.code === "Enter") {
      ev.preventDefault();
      this._submitChangedAuxFanSpeed();
    } else {
      this._userEditAuxFanSpeed = true;
    }
  }

  private _handleBoxFanSpeedKeyDown(ev: Event): void {
    if (ev.code === "Enter") {
      ev.preventDefault();
      this._submitChangedBoxFanSpeed();
    } else {
      this._userEditBoxFanSpeed = true;
    }
  }

  private _handleTargetTempNozzleChange(ev: Event): void {
    const newTemp = (ev.currentTarget as any).value;
    this.currentTargetTempNozzle = Number(newTemp);
    this._userEditTargetTempNozzle = true;
  }

  private _handleTargetTempHotbedChange(ev: Event): void {
    const newTemp = (ev.currentTarget as any).value;
    this.currentTargetTempHotbed = Number(newTemp);
    this._userEditTargetTempHotbed = true;
  }

  private _handleTargetTempNozzleKeyDown(ev: Event): void {
    if (ev.code === "Enter") {
      ev.preventDefault();
      this._submitChangedTargetTempNozzle();
    } else {
      this._userEditTargetTempNozzle = true;
    }
  }

  private _handleTargetTempHotbedKeyDown(ev: Event): void {
    if (ev.code === "Enter") {
      ev.preventDefault();
      this._submitChangedTargetTempHotbed();
    } else {
      this._userEditTargetTempHotbed = true;
    }
  }

  private _handleModalEvent = (e: Event): void => {
    e.stopPropagation();
    if (e.detail.modalOpen) {
      this._isOpen = true;
      this._resetUserEdits();
    }
  };

  private _handleDropdownEvent = (e: Event): void => {
    e.stopPropagation();
    this._userEditSpeedMode = true;
    if (typeof e.detail.key !== "undefined") {
      this.currentSpeedModeKey = e.detail.key;
      this.currentSpeedModeDescr =
        this.currentSpeedModeKey >= 0 &&
        this.currentSpeedModeKey in this.availableSpeedModes
          ? this.availableSpeedModes[this.currentSpeedModeKey]
          : undefined;
    }
  };

  private _handleSaveFanSpeedButton(): void {
    this._submitChangedFanSpeed();
    this._resetUserEdits();
  }

  private _handleSaveAuxFanSpeedButton(): void {
    this._submitChangedAuxFanSpeed();
    this._resetUserEdits();
  }

  private _handleSaveBoxFanSpeedButton(): void {
    this._submitChangedBoxFanSpeed();
    this._resetUserEdits();
  }

  private _handleSaveSpeedModeButton(): void {
    this._submitChangedSpeedMode();
    this._resetUserEdits();
  }

  private _handleSaveTargetTempNozzleButton(): void {
    this._submitChangedTargetTempNozzle();
    this._resetUserEdits();
  }

  private _handleSaveTargetTempHotbedButton(): void {
    this._submitChangedTargetTempHotbed();
    this._resetUserEdits();
  }

  private _resetUserEdits(): void {
    this._userEditFanSpeed = false;
    this._userEditAuxFanSpeed = false;
    this._userEditBoxFanSpeed = false;
    this._userEditTargetTempNozzle = false;
    this._userEditTargetTempHotbed = false;
    this._userEditSpeedMode = false;
  }

  private _closeModal(e?: Event | undefined): void {
    if (e) {
      e.stopPropagation();
    }
    this._isOpen = false;
    this._resetUserEdits();
  }

  private _cardClick(e: Event): void {
    e.stopPropagation();
  }

  private _submitChangedSpeedMode(): void {
    if (this._userEditSpeedMode && this.selectedPrinterDevice) {
      const serv = "change_print_speed_mode";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        speed_mode: this.currentSpeedModeKey,
      });
      this._closeModal();
    }
  }

  private _submitChangedFanSpeed(): void {
    if (this._userEditFanSpeed && this.selectedPrinterDevice) {
      const serv = "change_print_fan_speed";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        speed: this.currentFanSpeed,
      });
      this._closeModal();
    }
  }

  private _submitChangedAuxFanSpeed(): void {
    if (this._userEditAuxFanSpeed && this.selectedPrinterDevice) {
      const serv = "change_print_aux_fan_speed";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        speed: this.currentAuxFanSpeed,
      });
      this._closeModal();
    }
  }

  private _submitChangedBoxFanSpeed(): void {
    if (this._userEditBoxFanSpeed && this.selectedPrinterDevice) {
      const serv = "change_print_box_fan_speed";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        speed: this.currentBoxFanSpeed,
      });
      this._closeModal();
    }
  }

  private _submitChangedTargetTempNozzle(): void {
    if (this._userEditTargetTempNozzle && this.selectedPrinterDevice) {
      const serv = "change_print_target_nozzle_temperature";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        temperature: this.currentTargetTempNozzle,
      });
      this._closeModal();
    }
  }

  private _submitChangedTargetTempHotbed(): void {
    if (this._userEditTargetTempHotbed && this.selectedPrinterDevice) {
      const serv = "change_print_target_hotbed_temperature";
      this.hass.callService(platform, serv, {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        temperature: this.currentTargetTempHotbed,
      });
      this._closeModal();
    }
  }

  static get styles(): any {
    return css`
      ${commonModalStyle}

      .ac-settings-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .ac-settings-row {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }

      .ac-disabled-feature {
        display: none;
      }

      ha-textfield {
        min-width: 150px;
        width: 100%;
      }

      ha-control-button {
        min-width: 150px;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-settings-buttonrow ha-control-button {
        min-width: 100%;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-confirm-description {
        font-size: 16px;
        text-align: center;
      }

      .ac-confirm-buttons {
        display: flex;
        justify-content: center;
      }

      .ac-confirm-buttons ha-control-button {
        margin: 20px 30px 0px 30px;
      }
    `;
  }
}
