import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { HassEntityInfos, HomeAssistant } from "../../../types";

import { printerConfigAnycubic } from "./utils";

import "./animated_printer.ts";

@customElementIfUndef("anycubic-printercard-printer_view")
export class AnycubicPrintercardPrinterview extends LitElement {
  @property()
  public hass!: HomeAssistant;

  @property({ type: Function })
  public toggleVideo?: () => void;

  @property()
  public printerEntities: HassEntityInfos;

  @property()
  public printerEntityIdPart: string | undefined;

  render(): any {
    return html`
      <div
        class="ac-printercard-printerview"
        @click="${(_e): void => {
          this._viewClick();
        }}"
      >
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${printerConfigAnycubic}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
  }

  private _viewClick(): void {
    if (this.toggleVideo) {
      this.toggleVideo();
    }
  }

  static get styles(): any {
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
