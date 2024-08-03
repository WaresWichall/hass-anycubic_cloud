import { LitElement, html, css, unsafeCSS } from "lit";
import { Color } from "modern-color";
import { styleMap } from "lit/directives/style-map.js";
import { colorEvent, hueGradient } from "./lib.js";

export class HueBar extends LitElement {
  static properties = {
    hue: { type: Number },
    color: { type: Object },
    gradient: { type: String, attribute: false },
    sliderStyle: { type: String, attribute: false },
    sliderBounds: { type: Object },
    width: { type: Number, attribute: false },
  };
  static styles = css`
    :host > div {
      display: block;
      width: ${unsafeCSS(this.width)}px;
      height: 15px;
      cursor: pointer;
      position: relative;
    }

    :host .slider {
      position: absolute;
      top: -1px;
      height: 17px;
      width: 8px;
      margin-left: -4px;
      box-shadow:
        0 0 3px #111,
        inset 0 0 2px white;
    }
  `;

  constructor() {
    super();
    this.gradient = {
      backgroundImage: `linear-gradient(90deg, ${hueGradient(24)})`,
    };
    this.width = 400;
    this.sliderStyle = { display: "none" };
  }

  firstUpdated() {
    const me = this.renderRoot.querySelector("lit-movable");
    me.onmovestart = () => {
      colorEvent(this.renderRoot, { sliding: true }, "sliding-hue");
    };
    me.onmoveend = () => {
      colorEvent(this.renderRoot, { sliding: false }, "sliding-hue");
    };
    me.onmove = ({ posLeft }) => this.selectHue({ offsetX: posLeft });
    this.sliderStyle = this.sliderCss(this.hue);
  }

  get sliderBounds() {
    const r = this.width / 360;
    const posLeft = Number(this.hue) * r;
    const min = 0 - posLeft;
    const max = this.width - posLeft;
    return { min, max, posLeft };
  }
  get sliderCss() {
    return (h) => {
      if (this.color.hsx) {
        h = this.color.hsx.h;
      }
      if (h === undefined) {
        h = this.color.hsl.h;
      }
      const color = Color.parse({ h, s: 100, l: 50 });

      return { backgroundColor: color.css };
    };
  }

  willUpdate(props) {
    const h = props.get("hue");
    if (h && isFinite(this.hue)) {
      if (this.color?.hsx) {
        return; // console.log({hueBarIgnored: this.color.hsx});
      }
      const hue = this.hue;
      this.sliderStyle = this.sliderCss(hue);
    }
  }

  selectHue(e) {
    const r = 360 / this.width;
    const l = e.offsetX;
    const h = Math.max(0, Math.min(359, Math.round(l * r)));
    const target = this.renderRoot.querySelector("a");
    const event = new CustomEvent("hue-update", {
      bubbles: true,
      composed: true,
      detail: { h },
    });

    target.dispatchEvent(event);
    this.sliderStyle = this.sliderCss(h);
  }

  render() {
    return html` <div
      style=${styleMap(this.gradient)}
      class="bar"
      @click="${this.selectHue}"
    >
      <lit-movable
        horizontal="${this.sliderBounds.min}, ${this.sliderBounds.max}"
        posLeft="${this.sliderBounds.posLeft}"
      >
        <a class="slider" style=${styleMap(this.sliderCss(this.h))}></a>
      </lit-movable>
    </div>`;
  }
}

if (!customElements.get("hue-bar")) {
  customElements.define("hue-bar", HueBar);
}
