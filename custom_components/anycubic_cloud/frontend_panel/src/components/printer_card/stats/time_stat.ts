import { LitElement, html, css, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { calculateTimeStat, getEntityTotalSeconds } from "../../../helpers";
import { CalculatedTimeType, HassEntity } from "../../../types";

import "./stat_line.ts";

@customElementIfUndef("anycubic-printercard-stat-time")
export class AnycubicPrintercardStatTime extends LitElement {
  @property()
  public timeEntity: HassEntity;

  @property()
  public timeType: CalculatedTimeType;

  @property({ type: Number })
  public direction: number;

  @property({ type: Boolean })
  public round?: boolean;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ type: Boolean })
  public isSeconds?: boolean;

  @state({ type: Number })
  private currentTime: number = 0;

  @state({ type: Number })
  private lastIntervalId: number = -1;

  protected override willUpdate(changedProperties: PropertyValues): void {
    super.willUpdate(changedProperties);

    if (!changedProperties.has("timeEntity")) {
      return;
    }

    if (this.lastIntervalId !== -1) {
      clearInterval(this.lastIntervalId);
    }

    this.currentTime = getEntityTotalSeconds(this.timeEntity);

    this.lastIntervalId = setInterval(() => this._incTime(), 1000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.lastIntervalId);
  }

  render(): any {
    return html`<anycubic-printercard-stat-line
      .name=${this.timeType}
      .value=${calculateTimeStat(
        this.currentTime,
        this.timeType,
        this.round,
        this.use_24hr,
      )}
    ></anycubic-printercard-stat-line>`;
  }

  private _incTime(): void {
    this.currentTime = parseInt(this.currentTime) + parseInt(this.direction);
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
  }
}
