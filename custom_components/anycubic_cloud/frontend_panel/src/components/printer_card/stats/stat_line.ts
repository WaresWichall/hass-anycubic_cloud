import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("anycubic-printercard-stat-line")
export class AnycubicPrintercardStatLine extends LitElement {
  @property({ type: String })
  public name: string;

  @property({ type: String })
  public value: string;

  render() {
    return html`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}</p>
      </div>
    `;
  }

  static get styles() {
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

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: inline-block;
      }

      .ac-stat-heading {
        font-weight: bold;
      }
    `;
  }
}
