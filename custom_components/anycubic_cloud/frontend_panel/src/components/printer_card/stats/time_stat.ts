import { CSSResult, LitElement, PropertyValues, css, html } from "lit";
import { property, state } from "lit/decorators.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";

import { calculateTimeStat, getEntityTotalSeconds } from "../../../helpers";
import {
  CalculatedTimeType,
  HassEntity,
  LitTemplateResult,
} from "../../../types";

import "./stat_line.ts";

@customElementIfUndef("anycubic-printercard-stat-time")
export class AnycubicPrintercardStatTime extends LitElement {
  @property({ attribute: "time-entity" })
  public timeEntity: HassEntity;

  @property({ attribute: "time-type" })
  public timeType: CalculatedTimeType;

  @property({ type: String })
  public name: string;

  @property({ type: Number })
  public direction: number;

  @property({ type: Boolean })
  public round?: boolean;

  @property({ type: Boolean })
  public use_24hr?: boolean;

  @property({ attribute: "is-seconds", type: Boolean })
  public isSeconds?: boolean;

  @state()
  private currentTime: number | string | undefined = 0;

  @state()
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

    this.lastIntervalId = setInterval(() => {
      this._incTime();
    }, 1000);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this.lastIntervalId === -1) {
      this.lastIntervalId = setInterval(() => {
        this._incTime();
      }, 1000);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.lastIntervalId !== -1) {
      clearInterval(this.lastIntervalId);
      this.lastIntervalId = -1;
    }
  }

  render(): LitTemplateResult {
    return html`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${calculateTimeStat(
        this.currentTime,
        this.timeType,
        this.round,
        this.use_24hr,
      )}
    ></anycubic-printercard-stat-line>`;
  }

  private _incTime(): void {
    if (
      this.currentTime === 0 ||
      (this.currentTime && !isNaN(this.currentTime as number))
    ) {
      this.currentTime = Number(this.currentTime) + this.direction;
    }
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
