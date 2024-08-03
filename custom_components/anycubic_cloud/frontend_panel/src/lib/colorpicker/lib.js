import { Color } from "modern-color";
import { html } from "lit";

export const colorEvent = (target, color, name = "color-update") => {
  const detail = name.includes("color") ? { color } : color;
  const event = new CustomEvent(name, {
    bubbles: true,
    composed: true,
    detail,
  });
  target.dispatchEvent(event);
};
export const hueGradient = (gran = 3, hsx) => {
  //todo: update to take optional hsx(v/l) vals and compose
  let h = 0;
  let s = 100;
  let l = 50;
  let v = null;
  let isHsv = false;
  if (hsx) {
    s = hsx.s;
    if (hsx.hasOwnProperty("v")) {
      v = hsx.v;
      l = null;
      isHsv = true;
    } else {
      l = hsx.l;
    }
  }
  const stops = [];
  let color, pos;
  const cs = (color, pos) => `${color.css} ${(pos * 100).toFixed(1)}%`;
  while (h < 360) {
    color = Color.parse(isHsv ? { h, s, v } : { h, s, l });
    pos = h / 360;
    stops.push(cs(color, pos));
    h += gran;
  }
  h = 359;
  color = Color.parse(isHsv ? { h, s, v } : { h, s, l });
  pos = 1;
  stops.push(cs(color, pos));
  return stops.join(", ");
};

export const copy = html`<svg
  stroke="currentColor"
  fill="none"
  stroke-width="0"
  viewBox="0 0 24 24"
>
  <path d="M13 7H7V5H13V7Z" fill="currentColor"></path>
  <path d="M13 11H7V9H13V11Z" fill="currentColor"></path>
  <path d="M7 15H13V13H7V15Z" fill="currentColor"></path>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M3 19V1H17V5H21V23H7V19H3ZM15 17V3H5V17H15ZM17 7V19H9V21H19V7H17Z"
    fill="currentColor"
  ></path>
</svg>`;
