import { html, LitElement } from "lit";
import { Color } from "modern-color";
import { hueGradient } from "./lib.js";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";
import { inputChannelRules } from "./css.js";
import { colorEvent } from "./lib.js";

const labelDictionary = {
  r: "R (red) channel",
  g: "G (green) channel",
  b: "B (blue) channel",
  h: "H (hue) channel",
  s: "S (saturation) channel",
  v: "V (value / brightness) channel",
  l: "L (luminosity) channel",
  a: "A (alpha / opacity) channel",
};

export class ColorInputChannel extends LitElement {
  static properties = {
    group: { type: String },
    channel: { type: String },
    color: { type: Object },
    isHsl: { type: Boolean },
    c: { type: Object, state: true, attribute: false },
    previewGradient: { type: Object, state: true, attribute: false },
    active: { type: Boolean, state: true, attribute: false },
    max: { type: Number, state: true, attribute: false },
    v: { type: Number, state: true, attribute: false },
  };

  static styles = inputChannelRules;

  clickPreview(e) {
    const w = 128;
    const x = Math.max(0, Math.min(e.offsetX, w));
    let v = Math.round((x / 128) * this.max);
    if (this.channel === "a") {
      v = Number((x / 127).toFixed(2));
    }
    this.valueChange(null, v);
    this.setActive(false);
  }

  valueChange = (e, val = null) => {
    val = val ?? Number(this.renderRoot.querySelector("input").value);
    if (this.channel === "a") {
      val /= 100;
    }
    this.c[this.channel] = val;
    const c = Color.parse(this.c);
    if (this.group !== "rgb") {
      c.hsx = this.c;
    }
    this.c =
      this.group === "rgb"
        ? this.color.rgbObj
        : this.isHsl
          ? this.color.hsl
          : this.color.hsv;
    colorEvent(this.renderRoot, c);
  };

  setActive(active) {
    this.active = active;
    if (active) {
      this.renderRoot.querySelector("input").select();
    }
  }

  constructor() {
    super();
  }

  setPreviewGradient() {
    let c;
    if (this.group === "rgb") {
      c = this.color.rgbObj;
    } else {
      if (this.color.hsx) {
        c = this.color.hsx;
      } else {
        c = this.isHsl ? this.color.hsl : this.color.hsv;
      }
    }
    this.c = c;
    const g = this.group;
    const ch = this.channel;
    const isAlpha = ch === "a";
    this.v = c[ch];
    if (isAlpha) {
      this.v *= 100;
    }
    let max = 255;
    let minC, maxC;
    if (g !== "rgb" || ch === "a") {
      if (ch === "h") {
        max = this.max = 359;
        this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${hueGradient(24, c)})`,
          "--pct": `${100 * (c.h / max)}%`,
        };
        return;
      } else if (isAlpha) {
        max = 1;
      } else {
        max = 100;
      }
    }
    this.max = max;
    minC = { ...c };
    maxC = minC;
    minC[this.channel] = 0;
    minC = Color.parse(minC);
    maxC[this.channel] = max;
    maxC = Color.parse(maxC);
    if (this.channel === "l") {
      const midC = { ...c };
      midC.l = 50;
      this.previewGradient = {
        "--preview": `linear-gradient(90deg, ${minC.hex}, ${Color.parse(midC).hex}, ${maxC.hex})`,
        "--pct": `${100 * (c[this.channel] / max)}%`,
      };
    } else {
      this.previewGradient = {
        "--preview": `linear-gradient(90deg, ${isAlpha ? minC.css : minC.hex}, ${isAlpha ? maxC.css : maxC.hex})`,
        "--pct": `${100 * (c[this.channel] / max)}%`,
      };
    }
  }

  willUpdate(props) {
    this.setPreviewGradient();
  }

  render() {
    const chex =
      this.channel === "a"
        ? html`<div class="transparent-checks"></div>`
        : null;
    const max = this.channel === "a" ? 100 : this.max;
    return html` <div class="${classMap({ active: this.active })}">
      <label for="channel_${this.ch}">${this.channel.toUpperCase()}</label>
      <input
        id="channel_${this.ch}"
        aria-label="${labelDictionary[this.channel]}"
        class="form-control"
        .value="${Math.round(this.v)}"
        type="number"
        min="0"
        max="${max}"
        @input="${this.valueChange}"
        @focus="${() => this.setActive(true)}"
        @blur="${() => this.setActive(false)}"
      />
      <div
        class="preview-bar"
        style="${styleMap(this.previewGradient)}"
        @mousedown="${this.clickPreview}"
      >
        <div class="pct"></div>
        ${chex}
      </div>
    </div>`;
  }
}

if (!customElements.get("color-input-channel")) {
  customElements.define("color-input-channel", ColorInputChannel);
}
