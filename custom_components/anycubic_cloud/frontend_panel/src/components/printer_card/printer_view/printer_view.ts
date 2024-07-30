import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

import { HassEntityInfos, HomeAssistant } from "../../../types";

import { printerConfigAnycubic } from "./utils";

import "./animated_printer.ts";

@customElement("anycubic-printercard-printer_view")
export class AnycubicPrintercardPrinterview extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Function })
  public toggleVideo?: void | undefined;

  @property({ type: Boolean })
  public hasCamera: boolean = false;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  public connectedCallback() {
    super.connectedCallback();
    if (this.hasCamera && this.toggleVideo)
      window.addEventListener("click", this.toggleVideo);
  }
  public disconnectedCallback() {
    if (this.hasCamera && this.toggleVideo)
      window.removeEventListener("click", this.toggleVideo);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="ac-printercard-printerview">
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${printerConfigAnycubic}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-printerview {
        height: 100%;
        box-sizing: border-box;
      }
    `;
  }
}
