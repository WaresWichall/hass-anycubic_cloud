import { LitElement, html, css, PropertyValues } from "lit";
import { property, customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { getPrinterSensorStateObj } from "../../../helpers";
import {
  AnycubicSpoolInfo,
  HomeAssistant,
  HassEntityInfos,
} from "../../../types";

@customElement("anycubic-printercard-multicolorbox_view")
export class AnycubicPrintercardMulticolorboxview extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  @state()
  private spoolList: AnycubicSpoolInfo[] = [];

  protected willUpdate(changedProperties: PropertyValues<this>) {
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

  render() {
    return html`
      <div class="ac-printercard-mcbview">${this.renderSpools()}</div>
    `;
  }

  renderSpools(): HTMLElement {
    return map(this.spoolList, (spool, index) => {
      const ringStyle = {
        "background-color": spool.spool_loaded
          ? `rgb(${spool.color[0]}, ${spool.color[1]}, ${spool.color[2]})`
          : "#aaa",
      };
      return html`
        <div class="ac-spool-info">
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

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbview {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
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
