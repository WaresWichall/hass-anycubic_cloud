import { mdiRadiator } from "@mdi/js";
import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { localize } from "../../../../localize/localize";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { fireEvent } from "../../../fire_event";

import {
  getPrinterEntityId,
  getPrinterSensorStateObj,
  getPrinterSwitchStateObj,
} from "../../../helpers";
import {
  AnycubicSpoolInfo,
  HomeAssistant,
  HassEntity,
  HassEntityInfos,
} from "../../../types";

const SECONDARY_PREFIX = "secondary_";

const PRIMARY_ENTITY_ID_RUNOUT_REFILL = "ace_run_out_refill";
const SECONDARY_ENTITY_ID_RUNOUT_REFILL =
  SECONDARY_PREFIX + PRIMARY_ENTITY_ID_RUNOUT_REFILL;
const PRIMARY_ENTITY_ID_SPOOLS = "multi_color_box_spools";
const SECONDARY_ENTITY_ID_SPOOLS = SECONDARY_PREFIX + PRIMARY_ENTITY_ID_SPOOLS;

@customElementIfUndef("anycubic-printercard-multicolorbox_view")
export class AnycubicPrintercardMulticolorboxview extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @property()
  public box_id: number = 0;

  @state()
  private _runoutRefillId: string = PRIMARY_ENTITY_ID_RUNOUT_REFILL;

  @state()
  private _spoolsEntityId: string = PRIMARY_ENTITY_ID_SPOOLS;

  @state()
  private spoolList: AnycubicSpoolInfo[] = [];

  @state()
  private selectedIndex: number = -1;

  @state()
  private selectedMaterialType: string = "";

  @state()
  private selectedColor: number[] = [0, 0, 0];

  @state()
  private _runoutRefillState: HassEntity | undefined;

  @state()
  private language: string;

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("hass") && this.hass.language !== this.language) {
      this.language = this.hass.language;
    }

    if (changedProperties.has("box_id")) {
      if (this.box_id === 1) {
        this._runoutRefillId = SECONDARY_ENTITY_ID_RUNOUT_REFILL;
        this._spoolsEntityId = SECONDARY_ENTITY_ID_SPOOLS;
      } else {
        this._runoutRefillId = PRIMARY_ENTITY_ID_RUNOUT_REFILL;
        this._spoolsEntityId = PRIMARY_ENTITY_ID_SPOOLS;
      }
    }

    if (
      changedProperties.has("hass") ||
      changedProperties.has("printerEntities") ||
      changedProperties.has("printerEntityIdPart")
    ) {
      this.spoolList = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._spoolsEntityId,
        "not loaded",
        { spool_info: [] },
      ).attributes.spool_info;
      this._runoutRefillState = getPrinterSwitchStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        this._runoutRefillId,
      );
    }
  }

  render(): any {
    return html`
      <div class="ac-printercard-mcbview">
        <div class="ac-printercard-mcbmenu ac-printercard-menuleft">
          <div class="ac-switch" @click="${this._handleRunoutRefillChanged}">
            <div class="ac-switch-label">
              ${localize("card.buttons.runout_refill", this.language)}
            </div>
            <ha-entity-toggle
              .hass=${this.hass}
              .stateObj=${this._runoutRefillState}
            ></ha-entity-toggle>
          </div>
        </div>
        <div class="ac-printercard-spoolcont">${this._renderSpools()}</div>
        <div class="ac-printercard-mcbmenu ac-printercard-menuright">
          <ha-control-button
            @click="${(_e): void => {
              this._openDryingModal();
            }}"
          >
            <ha-svg-icon .path=${mdiRadiator}></ha-svg-icon>
            ${localize("card.buttons.dry", this.language)}
          </ha-control-button>
        </div>
      </div>
    `;
  }

  private _renderSpools(): HTMLElement {
    return map(this.spoolList, (spool, index) => {
      const ringStyle = {
        "background-color": spool.spool_loaded
          ? `rgb(${spool.color[0]}, ${spool.color[1]}, ${spool.color[2]})`
          : "#aaa",
      };
      return html`
        <div
          class="ac-spool-info"
          @click="${(_e): void => {
            this._editSpool(index, spool.material_type, spool.color);
          }}"
        >
          <div class="ac-spool-color-ring-cont">
            <div class="ac-spool-color-ring-inner" style=${styleMap(ringStyle)}>
              <div class="ac-spool-color-num">${index + 1}</div>
            </div>
          </div>
          <div class="ac-spool-material-type">
            ${spool.spool_loaded ? spool.material_type : "---"}
          </div>
        </div>
      `;
    });
  }

  private _openDryingModal(): void {
    fireEvent(this, "ac-mcbdry-modal", {
      modalOpen: true,
      box_id: this.box_id,
    });
  }

  private _handleRunoutRefillChanged = (_ev: Event): void => {
    // const refillActive = ev.target.checked;
    this.hass.callService("switch", "toggle", {
      entity_id: getPrinterEntityId(
        this.printerEntityIdPart,
        "switch",
        this._runoutRefillId,
      ),
    });
  };

  private _editSpool(index, material_type, color): void {
    fireEvent(this, "ac-mcb-modal", {
      modalOpen: true,
      box_id: this.box_id,
      spool_index: index,
      material_type: material_type,
      color: color,
    });
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbview {
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbmenu {
        height: 100%;
        position: relative;
        width: 10.42%;
      }

      .ac-printercard-spoolcont {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 62.5%;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
        cursor: pointer;
        width: 25%;
        padding: 5px;
      }

      .ac-spool-color-ring-cont {
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-spool-color-ring-cont:before {
        content: "";
        display: block;
        padding-top: 100%;
      }

      .ac-spool-color-ring-inner {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: #aaa;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-spool-color-num {
        font-weight: 900;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #eee;
        width: 46.5%;
        height: 46.5%;
        color: #222;
        text-align: center;
      }

      .ac-spool-color-num:before {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        padding-top: 2.5px;
      }

      .ac-spool-material-type {
        height: auto;
        text-align: center;
        font-weight: 900;
      }

      .ac-printercard-mcbmenu ha-control-button {
        font-size: 12px;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        min-width: 48px;
        min-height: 48px;
        width: 100%;
      }

      .ac-printercard-menuright ha-control-button {
        right: 0px;
      }

      .ac-printercard-mcbmenu .ac-switch-label {
        font-size: 12px;
      }

      .ac-printercard-mcbmenu .ac-switch {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        box-sizing: border-box;
        padding: 4px 4px;
        justify-content: center;
        background-color: #8686862e;
        border-radius: 8px;
      }

      .ac-printercard-mcbmenu .ac-switch:hover {
        background-color: #86868669;
      }
    `;
  }
}
