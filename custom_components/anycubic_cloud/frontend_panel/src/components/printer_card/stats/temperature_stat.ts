import { CSSResult, LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { getEntityTemperature } from "../../../helpers";
import { HassEntity, LitTemplateResult, TemperatureUnit } from "../../../types";

import "./stat_line.ts";

@customElementIfUndef("anycubic-printercard-stat-temperature")
export class AnycubicPrintercardStatTemperature extends LitElement {
  @property({ type: String })
  public name: string;

  @property({ attribute: "temperature-entity" })
  public temperatureEntity: HassEntity;

  @property({ type: Boolean })
  public round?: boolean;

  @property({ attribute: "temperature-unit", type: String })
  public temperatureUnit: TemperatureUnit;

  render(): LitTemplateResult {
    return html`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${getEntityTemperature(
        this.temperatureEntity,
        this.temperatureUnit,
        this.round,
      )}
    ></anycubic-printercard-stat-line>`;
  }

  static get styles(): CSSResult {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
  }
}
