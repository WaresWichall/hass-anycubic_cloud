// noinspection ES6UnusedImports

import { css, html, LitElement } from "lit";
import { Color, namedColors } from "modern-color";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
// todo: understand why eslint thinks these are unused - they are dependencies
import { HueBar } from "./HueBar.js";
import { ColorInputChannel } from "./ColorInputChannel.js";
import { HSLCanvas } from "./HSLCanvas.js";
import {
  focusedFormControl,
  formControl,
  root,
  transparentChex,
} from "./css.js";
import { colorEvent, copy } from "./lib.js";
import { LitMovable } from "../movable/LitMovable";

//todo: light/dark mode + get decorators working without typescript
export class ColorPicker extends LitElement {
  static properties = {
    color: { type: Object, state: true, attribute: false },
    hex: { type: String, state: true, attribute: false },
    value: { type: String },
    isHsl: { type: Boolean, state: true, attribute: false },
    copied: { type: String },
    debounceMode: { type: Boolean },
    buttonDisabled: { attribute: "button-disabled", type: Boolean },
  };

  static styles = root;

  _color;

  constructor() {
    super();
    this._color = Color.parse(namedColors.slateblue);
    this.isHsl = true;
    this.buttonDisabled = false;
  }

  firstUpdated(props) {
    this.debounceMode = false;
    if (props.has("value")) {
      this.color = Color.parse(this.value);
    }
  }

  get color() {
    return this._color;
  }

  set color(c) {
    c = c.hsx ? c : c.rgba ? Color.parse(...c.rgba) : Color.parse(c);
    if (c) {
      this.hex = c.hex;
      this._color = c;

      colorEvent(this.renderRoot, c, "colorchanged");
    }
  }

  updateColor({ detail: { color } }) {
    this.color = color;
  }

  setColor(e) {
    const cs = this.renderRoot.querySelector("input#hex").value;
    const c = Color.parse(cs);

    if (c) {
      this.color = c;
    } else {
      console.log(`ignored unparsable input: ${cs}`);
    }
  }

  setHue({ detail: { h } }) {
    let { s, l, a } = this.color.hsl;
    if (a === 1) {
      a = undefined;
    }
    this.color = { h, s, l, a };
  }

  setHsl(hsl) {
    this.isHsl = hsl;
  }

  okColor() {
    colorEvent(this.renderRoot, this.color, "colorpicked");
  }

  showCopyDialog() {
    this.copied = null;
    this.dlg = this.dlg ?? this.renderRoot.querySelector("dialog");
    if (this.dlg.open) {
      this.dlg.classList.remove("open");
      return this.dlg.close();
    }

    this.dlg.show();
    this.dlg.classList.add("open");
  }

  clipboard(f) {
    const s = this.color.toString(f);
    window.navigator.clipboard.writeText(s).then(() => {
      this.hideCopyDialog(s);
    });
  }

  hideCopyDialog(copyText) {
    if (copyText) {
      this.copied = copyText;
      setTimeout(() => this.dlg.classList.remove("open"), 400);
      setTimeout(() => this.hideCopyDialog(), 1200);
      return;
    }
    this.dlg.classList.remove("open");
    this.dlg.close();
    this.copied = null;
  }
  setSliding({ detail }) {
    this.debounceMode = detail.sliding;
  }
  render() {
    const hslChannels = this.isHsl ? ["h", "s", "l"] : ["h", "s", "v"];
    const hsvClass = { button: true, active: !this.isHsl, l: true };
    const hslClass = { button: true, active: this.isHsl, r: true };
    const swatchBg = { backgroundColor: this.color };
    const hideCopied = this.copied
      ? { textAlign: "center", display: "block" }
      : { display: "none" };
    const debounceMode = this.debounceMode;
    return html` <div class="outer">
      <hue-bar
        @sliding-hue="${this.setSliding}"
        hue="${this.color.hsx ? this.color.hsx.h : this.color.hsl.h}"
        @hue-update="${this.setHue}"
        .color="${this.color}"
      ></hue-bar>
      <div class="d-flex">
        <div class="col w-30">
          ${["r", "g", "b", "a"].map(
            (c) => html`
              <color-input-channel
                group="rgb"
                channel="${c}"
                isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `,
          )}
          <div class="hex">
            <dialog @blur="${() => this.hideCopyDialog()}" tabindex="0">
              <sub class="copied" style="${styleMap(hideCopied)}"
                >copied <em>${this.copied}</em></sub
              >
              ${this.copied
                ? html``
                : html`
                    <a
                      class="copy-item"
                      @click=${(e) => this.clipboard("hex", e)}
                      id="copyHex"
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.hex}"
                      />
                      <button
                        title="Copy HEX String"
                        class="button"
                        tabindex="0"
                      >
                        ${copy}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      @click=${(e) => this.clipboard("css", e)}
                      id="copyRgb"
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.css}"
                      />
                      <button
                        title="Copy RGB String"
                        class="button"
                        tabindex="0"
                      >
                        ${copy}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      id="copyHsl"
                      @click=${(e) =>
                        this.clipboard(
                          this.color.alpha < 1 ? "hsla" : "hsl",
                          e,
                        )}
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.toString(
                          this.color.alpha < 1 ? "hsla" : "hsl",
                        )}"
                      />
                      <button
                        title="Copy HSL String"
                        class="button"
                        tabindex="0"
                      >
                        ${copy}
                      </button>
                    </a>
                  `}
            </dialog>
            <label for="hex">#</label>
            <input
              aria-label="Hexadecimal value (editable - accepts any valid color string)"
              @input="${this.setColor}"
              class="form-control"
              id="hex"
              placeholder="Set color"
              value="${this.hex}"
            /><a
              title="Show copy to clipboard menu"
              @click="${this.showCopyDialog}"
              class="button copy"
            >
              ${copy}
              <span>&#11205;</span>
            </a>
          </div>
        </div>
        <div class="col w-30">
          ${hslChannels.map(
            (c) => html`
              <color-input-channel
                group="hsl"
                channel="${c}"
                .isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `,
          )}
          <div class="hsl-mode">
            <a
              title="Use hue / saturation / value (brightness) mode"
              class="${classMap(hsvClass)}"
              @click="${() => this.setHsl(false)}"
              >HSV</a
            ><a
              title="Use hue / saturation / luminosity mode"
              class="${classMap(hslClass)}"
              @click="${() => this.setHsl(true)}"
              >HSL</a
            >
          </div>
        </div>
        <div class="w-40">
          <hsl-canvas
            .debounceMode="${debounceMode}"
            size="${160}"
            .isHsl="${this.isHsl}"
            .color="${this.color}"
            @color-update="${this.updateColor}"
          ></hsl-canvas>
          <div class="ok">
            <a
              class="button"
              .disabled=${this.buttonDisabled}
              @click="${this.okColor}"
              >OK
              <span class="swatch">
                <span style="${styleMap(swatchBg)}"></span>
                <span class="checky"></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
  }
}

if (!window.customElements.get("color-picker")) {
  window.customElements.define("color-picker", ColorPicker);
}
