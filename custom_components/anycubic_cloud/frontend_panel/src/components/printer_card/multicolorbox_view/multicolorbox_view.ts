import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { fireEvent } from "../../../fire_event";

import { getPrinterSensorStateObj } from "../../../helpers";
import {
  AnycubicSpoolInfo,
  HomeAssistant,
  HassEntityInfos,
} from "../../../types";

@customElementIfUndef("anycubic-printercard-multicolorbox_view")
export class AnycubicPrintercardMulticolorboxview extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @state()
  private spoolList: AnycubicSpoolInfo[] = [];

  @state()
  private selectedIndex: number = -1;

  @state()
  private selectedMaterialType: string = "";

  @state()
  private selectedColor: number[] = [0, 0, 0];

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("hass") ||
      changedProperties.has("printerEntities") ||
      changedProperties.has("printerEntityIdPart")
    ) {
      this.spoolList = getPrinterSensorStateObj(
        this.hass,
        this.printerEntities,
        this.printerEntityIdPart,
        "multi_color_box_spools",
        "not loaded",
        { spool_info: [] },
      ).attributes.spool_info;
    }
  }

  render(): any {
    return html`
      <div class="ac-printercard-mcbview">
        <div class="ac-printercard-mcbmenu"></div>
        <div class="ac-printercard-spoolcont">${this._renderSpools()}</div>
        <div class="ac-printercard-mcbmenu"></div>
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
          <div class="ac-spool-color-ring" style=${styleMap(ringStyle)}>
            <div class="ac-spool-color-num">${index + 1}</div>
          </div>
          <div class="ac-spool-material-type">
            ${spool.spool_loaded ? spool.material_type : "---"}
          </div>
        </div>
      `;
    });
  }

  private _editSpool(index, material_type, color): void {
    fireEvent(this, "ac-mcb-modal", {
      modalOpen: true,
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
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-printercard-mcbmenu {
        height: 100%;
        min-width: 10px;
      }

      .ac-printercard-spoolcont {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
        cursor: pointer;
      }

      .ac-spool-color-ring {
        background-color: #aaa;
        height: 65px;
        width: 65px;
        border-radius: 50%;
        margin: 5px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-spool-color-num {
        font-weight: 900;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #eee;
        width: 30px;
        height: 30px;
        line-height: 30px;
        color: #222;
        text-align: center;
      }

      .ac-spool-material-type {
        height: auto;
        text-align: center;
        font-weight: 900;
      }
    `;
  }
}
