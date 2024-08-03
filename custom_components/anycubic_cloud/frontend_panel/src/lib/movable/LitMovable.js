import { LitElement, html } from "lit";

const pxVal = (v) =>
  isFinite(v) ? Number(v) : Number(v.replace(/[^0-9.\-]/g, ""));

const zeroIfNaN = (v) => {
  v = Number(v);
  if (isNaN(v) || [undefined, null].includes(v)) {
    v = 0;
  }
  return v;
};
class Coord {
  constructor(x, y) {
    this.x = zeroIfNaN(x);
    this.y = zeroIfNaN(y);
  }
  static fromPointerEvent(event) {
    const { pageX, pageY } = event;
    return new Coord(pageX, pageY);
  }
  static fromElementStyle(el) {
    const x = pxVal(el.style.left ?? 0);
    const y = pxVal(el.style.top ?? 0);

    return new Coord(x, y);
  }
  static fromObject({ x, y }) {
    return new Coord(x, y);
  }
  get top() {
    return this.y;
  }
  set top(v) {
    this.y = v;
  }
  get left() {
    return this.x;
  }
  set left(v) {
    this.x = v;
  }
}

const getClickOffset = (event) => {
  const coords = Coord.fromPointerEvent(event);
  const off = event.target.getBoundingClientRect();
  const x = coords.x - (off.left + document.body.scrollLeft);
  const y = coords.y - (off.top + document.body.scrollTop);
  return new Coord(x, y);
};
class MoveBounds {
  constructor(min = -Infinity, max = Infinity) {
    this.min = min;
    this.max = max;
    this.attr = "";
  }
  get constrained() {
    return this.min === this.max;
  }
  get unconstrained() {
    return this.min === -Infinity && this.max === Infinity;
  }
  static fromString(s = null, offset = 0) {
    if (!s) {
      return new MoveBounds();
    }
    if (s === "null") {
      return new MoveBounds(0, 0);
    }
    const [min, max] = s.split(",").map((n) => Number(n.trim()) + offset);
    const bounds = new MoveBounds(min, max);
    bounds.attr = s;
    return bounds;
  }
}

/**
 * @attr {number} posTop - Represents the offsetTop value (reflected). When set, will set the initial style.top value. Updates with move events
 * @attr {number} posLeft - Represents the offsetLeft value (reflected). When set, will set the initial style.top value. Updates with move events
 * @attr {string} targetSelector - A selector to select the element that will move. Defaults to the lit-movable (this) element, but useful when for example you want to allow a modal header to respond to pointer events but you want the entire modal to move.
 * @attr {string} boundsX - Set to boundsX="min,max" to restrict movement along the x axis
 * @attr {string} boundsY - Set to boundsY="min,max" to restrict movement along the y axis
 * @attr {string} vertical - Will constrain horizontal (x) movement completely and allow vertical (y) movement between the specified values
 * @attr {string} horizontal - Will constrain vertical (y) movement completely and allow horizontal (x) movement between the specified values
 * @attr {number} grid - Snaps movement to nearest grid position. Initial element position represents the 0,0 position. Movement snapped to the provided value increment
 * @attr {boolean} shiftBehavior - When enabled, holding the shift key will coerce movement to perpendicular coordinates only.
 * @attr {boolean} disabled - Disables movement behavior
 * @attr {boolean} eventsOnly - Only fires movement events, but will not move the element
 *
 * @slot - default/unnamed slot
 *
 * @prop {object} target - The target element that will move
 * @prop {object} bounds - Computed from the specified boundsX, boundsY attributes. Represents the runtime movement constraints if any
 *
 * @fires onmovestart - Initial state when user initiates a move operation (onpointerdown). Bind syntax: element.onmovestart=(state)=>console.log(state).
 * @fires onmove - Fires continuously after onpointerdown until document.onpointerup event. Bind syntax: element.onmove=(state)=>console.log(state).
 * @fires onmovestart - Final state when user completes a move operation (document.onpointerup). Bind syntax: element.onmoveend=(state)=>console.log(state).
 *
 * @event {CustomEvent} movestart - Initial state when user initiates a move operation (onpointerdown).  * Bind with element.addEventListener('movestart', ({detail}) => console.log({moveState:detail}))
 * @event {CustomEvent} move - Fires continuously after onpointerdown until document.onpointerup event. Bind with element.addEventListener('move', ({detail}) => console.log({moveState:detail}))
 * @event {CustomEvent} moveend - Final state when user completes a move operation (document.onpointerup). Bind with element.addEventListener('moveend', ({detail}) => console.log({moveState:detail}))
 *
 * @summary A Lit 3 wrapper web component that can enable robustly customizable element move operations and expose rich state data.
 *
 * @tag lit-movable
 */

export class LitMovable extends LitElement {
  _target;
  _targetSelector = null;
  _boundsX = new MoveBounds();
  _boundsY = new MoveBounds();
  isMoving = false;
  moveState = {};
  _vertical = null;
  _horizontal = null;
  _posTop = null;
  _posLeft = null;
  _grid = 1;
  pointerId;

  constructor() {
    super();
  }

  get vertical() {
    return this._vertical;
  }
  set vertical(v) {
    this.boundsY = v;
    this.boundsX = "null";
    this._vertical = v;
  }
  get horizontal() {
    return this._horizontal;
  }
  set horizontal(v) {
    this.boundsX = v;
    this.boundsY = "null";
    this._horizontal = v;
  }

  set posTop(v) {
    v = Number(v);
    this._posTop = v;
    if (this.target) {
      this.target.style.top = v + "px";
    }
  }
  get posTop() {
    return this._posTop;
  }

  set posLeft(v) {
    v = Number(v);
    this._posLeft = v;
    if (this.target) {
      this.target.style.left = v + "px";
    }
  }
  get posLeft() {
    return this._posLeft;
  }

  get grid() {
    return this._grid;
  }
  set grid(v) {
    if (v > 0 && v < Infinity) {
      this._grid = v;
    } else {
      this._grid = 1;
    }
  }
  get bounds() {
    return {
      left: this._boundsX,
      top: this._boundsY,
    };
  }

  set targetSelector(v) {
    this._targetSelector = v;
    this._retryTarget = document.querySelector(v) === null;
    this._target = document.querySelector(v);
  }
  get targetSelector() {
    return this._targetSelector;
  }

  get target() {
    return this._target ?? this;
  }

  set target(v) {
    this._target = v;
  }

  get boundsX() {
    return this._boundsX;
  }

  set boundsX(v) {
    this._boundsX = MoveBounds.fromString(
      v,
      pxVal(this.target?.style.left ?? 0),
    );
    this.bounds.left = this._boundsX;
  }

  get boundsY() {
    return this._boundsY;
  }

  set boundsY(v) {
    this._boundsY = MoveBounds.fromString(
      v,
      pxVal(this.target?.style.top ?? 0),
    );
    //let offsetTop =
    this.bounds.top = this._boundsY;
  }

  static properties = {
    //set the left/top position
    // defaults to  element.offsetTop /offsetLeft
    posLeft: { type: Number },
    posTop: { type: Number },

    // target element that moves - defaults to root element
    target: { type: Object, attribute: false, state: true },

    // selector that will set the target element that will move
    targetSelector: { type: String },

    // object (left:boundsX,top:boundsY)
    bounds: { type: Object, attribute: false, state: true },

    // Both x and y default to -Infinity,Infinity.
    // Set to boundsX="min,max" ([0,0] to restrict the axis)
    // these are attribute string setters meant for declarative
    // element attribute setting
    boundsX: { type: String },
    boundsY: { type: String },

    // vertical="min,max" - constrain movement to y axis within min and max numbers provided.
    // automatically disables horizontal movement
    vertical: { type: String },

    // horizontal="min,max" - constrain movement to x axis within min and max provided.
    // automatically disables vertical movement
    horizontal: { type: String },

    //defaults to 1. snap to grid size in pixels.
    grid: { type: Number },

    // set to true enables shift key to constrain movement to either
    // x or y axis (whichever is greater).
    // Setting any bounds option automatically disables shift key behavior.
    shiftBehavior: { type: Boolean },

    //disables moving
    disabled: { type: Boolean },

    // advanced mode: Does not move the element, but fires
    // events so you can pass to your own handler
    eventsOnly: { type: Boolean },
    listening: { type: Boolean },
    onmovestart: { type: Object },
    onmoveend: { type: Object },
    onmove: { type: Object },
  };

  firstUpdated(props) {
    if (this._retryTarget) {
      // element wasn't loaded
      this.target = document.querySelector(this.targetSelector);
    }
    const { bounds, target, posTop, posLeft } = this;

    const {
      offsetLeft,
      offsetTop,
      style: { left, top },
    } = this.target;
    target.classList.add("--movable-base");
    this.renderRoot.addEventListener("pointerdown", (e) => this.pointerdown(e));

    target.style.position = "absolute";
    target.style.cursor = "pointer";

    if (posLeft) {
      target.style.left = posLeft + "px";
    } else if (!left && offsetLeft) {
      target.style.left = offsetLeft + "px";
      if (bounds.left.constrained) {
        bounds.left.min = bounds.left.max = offsetLeft;
      }
    }
    if (posTop) {
      target.style.top = posTop + "px";
    } else if (!top && offsetTop) {
      target.style.top = offsetTop + "px";
      if (bounds.top.constrained) {
        bounds.top.min = bounds.top.max = offsetTop;
      }
    }
  }

  reposition(pos) {
    if (typeof pos === "object") {
      const { eventsOnly, target } = this;
      this.posTop = pos.top;
      this.posLeft = pos.left;
      if (target && !eventsOnly) {
        target.style.left = pos.left + "px";
        target.style.top = pos.top + "px";
      }
    } else {
      this.isMoving = pos;
    }
  }

  moveInit(event) {
    const moveState = this.moveState;
    const { target, bounds } = this;

    moveState.mouseCoord = Coord.fromPointerEvent(event);
    moveState.startCoord = Coord.fromElementStyle(target);
    moveState.moveDist = new Coord(0, 0);
    moveState.totalDist = new Coord(0, 0);
    moveState.clickOffset = getClickOffset(event);
    moveState.coords = Coord.fromObject(moveState.startCoord);
    moveState.maxX =
      isFinite(bounds.left.min) && isFinite(bounds.left.max)
        ? bounds.left.min + bounds.left.max
        : Infinity;
    moveState.maxY =
      isFinite(bounds.top.min) && isFinite(bounds.top.max)
        ? bounds.top.min + bounds.top.max
        : Infinity;
    this.isMoving = true;
    this.reposition(true);
    this.eventBroker("movestart", event);
  }
  eventBroker(name, event) {
    this.moveState.posTop = this.posTop;
    this.moveState.posLeft = this.posLeft;
    const customEvent = new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail: { ...event, ...this.moveState, element: this },
    });
    this.renderRoot.dispatchEvent(customEvent);
    const attrEvent = this[`on${name}`];
    if (attrEvent) {
      attrEvent({ ...event, ...this.moveState, me: this });
    }
  }
  unbind(event) {
    this.pointerId = null;
    document.body.removeEventListener("pointermove", (e) =>
      this.motionHandler(e),
    );
    this.moveEnd(event);
  }

  moveEnd(event) {
    if (this.isMoving) {
      //document.body.removeEventListener('pointerup', ()=>this.unbind);
      this.isMoving = this.moveState.isMoving = false;
      this.reposition(false);
      this.eventBroker("moveend", event);
    }
  }

  motionHandler(event) {
    //onpointermove
    event.stopPropagation();
    const newCoord = Coord.fromPointerEvent(event);
    const moveState = this.moveState;
    const { grid, bounds, shiftBehavior, boundsX, boundsY } = this;
    moveState.moveDist = Coord.fromObject({
      x: newCoord.x - moveState.mouseCoord.x,
      y: newCoord.y - moveState.mouseCoord.y,
    });
    moveState.mouseCoord = newCoord;

    moveState.totalDist = Coord.fromObject({
      x: moveState.totalDist.x + moveState.moveDist.x,
      y: moveState.totalDist.y + moveState.moveDist.y,
    });
    moveState.coords = Coord.fromObject({
      x:
        Math.round(moveState.totalDist.x / grid) * grid +
        moveState.startCoord.x,
      y:
        Math.round(moveState.totalDist.y / grid) * grid +
        moveState.startCoord.y,
    });

    if (
      shiftBehavior &&
      event.shiftKey &&
      boundsX.unconstrained &&
      boundsY.unconstrained
    ) {
      const { x, y } = moveState.totalDist;
      if (Math.abs(x) > Math.abs(y)) {
        moveState.coords.top = moveState.startCoord.y;
      } else {
        moveState.coords.left = moveState.startCoord.x;
      }
    } else {
      moveState.coords.y = Math.min(
        Math.max(bounds.top.min, moveState.coords.top),
        bounds.top.max,
      );
      moveState.coords.x = Math.min(
        Math.max(bounds.left.min, moveState.coords.left),
        bounds.left.max,
      );
    }
    if (isFinite(moveState.maxX)) {
      moveState.pctX =
        Math.max(bounds.left.min, moveState.coords.left) / moveState.maxX;
    }
    if (isFinite(moveState.maxY)) {
      moveState.pctY =
        Math.max(bounds.top.min, moveState.coords.top) / moveState.maxY;
    }
    this.reposition(moveState.coords);
    this.eventBroker("move", event);
  }
  pointerdown(event) {
    document.body.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
    if (event.pointerId !== undefined) {
      this.pointerId = event.pointerId;
    }

    if (!this.listening) {
      document.body.addEventListener(
        "pointerup",
        (event) => {
          if (this.isMoving) {
            this.unbind(event);
          }
        },
        false,
      );
      document.body.addEventListener(
        "pointermove",
        (event) => {
          if (
            this.pointerId !== undefined &&
            event.pointerId === this.pointerId
          ) {
            this.motionHandler(event);
          }
        },
        false,
      );
    }
    this.listening = true;
    this.moveInit(event);
  }

  render() {
    return html`<slot></slot>`;
  }
}

if (!window.customElements.get("lit-movable")) {
  window.customElements.define("lit-movable", LitMovable);
}
