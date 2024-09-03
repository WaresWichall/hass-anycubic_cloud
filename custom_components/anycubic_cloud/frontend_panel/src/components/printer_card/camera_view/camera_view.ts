import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit-html/directives/style-map.js";

import { customElementIfUndef } from "../../../internal/register-custom-element";
import { buildCameraUrlFromEntity } from "../../../helpers";
import { HassEntity } from "../../../types";

@customElementIfUndef("anycubic-printercard-camera_view")
export class AnycubicPrintercardCameraview extends LitElement {
  @property()
  public showVideo?: boolean | undefined;

  @property()
  public toggleVideo?: () => void;

  @property()
  public cameraEntity: HassEntity | undefined;

  @state()
  private camImgString: string = "none";

  protected willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has("showVideo") ||
      changedProperties.has("cameraEntity")
    ) {
      this.camImgString =
        this.showVideo && !!this.cameraEntity
          ? `url('${buildCameraUrlFromEntity(this.cameraEntity)}')`
          : "none";
    }
  }

  render(): any {
    const stylesView = {
      display: this.showVideo ? "block" : "none",
    };
    return html`
      <div
        class="ac-printercard-cameraview"
        style=${styleMap(stylesView)}
        @click="${(_e): void => {
          this._handleToggleClick();
        }}"
      >
        ${this.showVideo ? this._renderInner() : nothing}
      </div>
    `;
  }

  private _renderInner(): any {
    const stylesCamera = {
      "background-image": this.camImgString,
    };

    return html` <div
      class="ac-camera-wrapper"
      style=${styleMap(stylesCamera)}
    ></div>`;
  }

  private _handleToggleClick(): void {
    if (this.toggleVideo) {
      this.toggleVideo();
    }
  }

  static get styles(): any {
    return css`
      :host {
        box-sizing: border-box;
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
      }

      .ac-printercard-cameraview {
        background-color: black;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }

      .ac-camera-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        background-size: cover;
        background-position: center;
      }
    `;
  }
}
