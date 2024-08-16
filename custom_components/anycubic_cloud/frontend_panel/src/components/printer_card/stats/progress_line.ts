import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

@customElementIfUndef("anycubic-printercard-progress-line")
export class AnycubicPrintercardProgressLine extends LitElement {
  @property({ type: String })
  public name: string;

  @property({ type: Number })
  public value: string;

  @property({ type: Number })
  public progress: number;

  render(): any {
    const progressStyle = {
      width: String(this.progress) + "%",
    };
    return html`
      <div class="ac-stat-line">
        <p class="ac-stat-heading">${this.name}</p>
        <div class="ac-stat-value">
          <div class="ac-progress-bar">
            <div class="ac-stat-text">${this.value}</div>
            <div
              class="ac-progress-line"
              style=${styleMap(progressStyle)}
            ></div>
          </div>
        </div>
      </div>
    `;
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-value {
        margin: 0;
        display: inline-block;
        max-width: calc(100% - 120px);
        width: 100%;
        position: relative;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: block;
        position: relative;
        top: 3px;
        left: 0px;
        z-index: 1;
        text-align: center;
      }

      .ac-stat-heading {
        margin: 0;
        font-size: 16px;
        display: block;
        font-weight: bold;
      }

      .ac-progress-bar {
        display: block;
        width: 100%;
        height: 30px;
        background-color: #8b8b8b6e;
        position: relative;
      }

      .ac-progress-line {
        position: absolute;
        top: 0px;
        left: 0px;
        display: block;
        height: 100%;
        background-color: #ee8f36e6;
        border-right: 2px solid #ffd151e6;
        box-shadow: 4px 0px 6px 0px rgb(255 245 126 / 25%);
      }
    `;
  }
}
