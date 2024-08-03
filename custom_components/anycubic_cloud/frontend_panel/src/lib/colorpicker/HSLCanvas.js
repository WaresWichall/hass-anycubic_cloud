import { styleMap } from "lit/directives/style-map.js";
import { LitElement, html, css } from "lit";
import { Color } from "modern-color";
import { colorEvent } from "./lib.js";

export class HSLCanvas extends LitElement {
  static properties = {
    color: { type: Object },
    isHsl: { type: Boolean },
    size: { type: Number },
    debounceMode: { type: Boolean },
    ctx: { type: Object, state: true, attribute: false },
    hsw: { type: Object, state: true, attribute: false },
    circlePos: { type: Object, state: true, attribute: false },
  };
  static styles = css`
    :host .outer {
      position: absolute;
      top: 0;
      right: 0;
    }

    :host .outer canvas {
      height: inherit;
      width: inherit;
      cursor: pointer;
    }

    :host .circle {
      height: 12px;
      width: 12px;
      border: solid 2px #eee;
      border-radius: 50%;
      box-shadow:
        0 0 3px #000,
        inset 0 0 1px #fff;
      position: absolute;
      margin: -8px;
      mix-blend-mode: difference;
    }
  `;

  constructor() {
    super();
    this.isHsl = true;
    this.circlePos = { top: 0, left: 0, bounds: { x: "", y: "" } };
    this.size = 160;
  }

  setColor(c) {
    //this.color = c;
    colorEvent(this.renderRoot, c);
  }

  setCircleCss(x, y) {
    const left = `${x}`;
    const top = `${y}`;
    const bounds = { x: `0, ${this.size}`, y: `0,${this.size}` };
    //let bounds = {x: `${-x}, ${this.size-x}`,y:`${-y},${this.size-y}`}
    this.circlePos = { top, left, bounds };
  }

  pickCoord({ offsetX, offsetY }) {
    const x = offsetX;
    const y = offsetY;
    const { size, hsw, isHsl, color } = this;

    let w = (size - y) / size;
    w = Math.round(w * 100);
    const sat = Math.round((x / size) * 100);
    const hsx = { h: hsw.h, s: sat, [isHsl ? "l" : "v"]: w };

    const c = isHsl ? Color.fromHsl(hsx) : Color.fromHsv(hsx);
    this.setCircleCss(x, y);
    c.a = color.alpha;
    c.hsx = hsx;
    c.fromHSLCanvas = true;
    this.setColor(c);
  }

  debouncePaintDetail(hsx) {
    clearTimeout(this.bouncer);
    this.bouncer = setTimeout(() => this.paintHSL(hsx, true), 50);
    this.paintHSL(hsx, false);
  }

  // todo: test assumption that this perf lag (lit warning)
  //  is ok due to rendering canvas post update
  paintHSL(hsx, detail = null) {
    if (this.debounceMode && detail === null) {
      // enable rapid painting in lower res
      return this.debouncePaintDetail(hsx);
    }
    const { ctx, color, isHsl, size } = this;
    if (!ctx) {
      return;
    }
    //console.time('paint'+detail)

    const clr = color;
    hsx = (hsx ?? isHsl) ? clr.hsl : clr.hsv; // hue-sat-whatever
    hsx.w = isHsl ? hsx.l : hsx.v;
    const { h, s, w } = hsx;
    const hsw = (this.hsw = { h, s, w });
    const scale = size / 100;
    const fillHsl = (h, s, l) => `hsl(${h}, ${s}%, ${100 - l}%)`;
    const fillHsv = (h, s, v) => Color.fromHsv({ h, s, v: 100 - v }).hex;
    const fill = isHsl ? fillHsl : fillHsv;

    const incr = detail === false ? 4 : 1; //rapid painting during hue slider ops
    for (let s = 0; s < 100; s += incr) {
      for (let w = 0; w < 100; w += incr) {
        ctx.fillStyle = fill(h, s, w);
        ctx.fillRect(s, w, s + incr, w + incr);
      }
    }

    this.setCircleCss(hsw.s * scale, size - hsx.w * scale);
    //console.timeEnd('paint'+detail)
  }

  willUpdate(props) {
    if (props.has("color") || props.has("isHsl")) {
      if (this.color?.hsx) {
        if (this.color.fromHSLCanvas) {
          delete this.color.fromHSLCanvas; //avoid extra paint job
          return;
        }
        return this.paintHSL(this.color.hsx);
      }
      this.paintHSL();
    }
  }

  firstUpdated(props) {
    const canvas = this.renderRoot.querySelector("canvas");
    this.ctx = canvas.getContext("2d");
    this.paintHSL();
  }

  circleMove({ posTop: offsetY, posLeft: offsetX }) {
    this.pickCoord({ offsetX, offsetY });
  }

  render() {
    const hw = { height: this.size + "p", width: this.size + "px" };
    const { top, left, bounds } = this.circlePos;
    return html` <div
      class="outer"
      @click="${this.pickCoord}"
      style="${styleMap(hw)}"
    >
      <canvas height="100" width="100"></canvas>
      <lit-movable
        boundsX="${bounds.x}"
        boundsY="${bounds.y}"
        posTop="${top}"
        posLeft="${left}"
        .onmove="${(e) => this.circleMove(e)}"
      >
        <div class="circle"></div>
      </lit-movable>
    </div>`;
  }
}

if (!customElements.get("hsl-canvas")) {
  customElements.define("hsl-canvas", HSLCanvas);
}
