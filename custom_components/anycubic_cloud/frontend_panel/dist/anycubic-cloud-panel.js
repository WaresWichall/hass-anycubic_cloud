!function (e) {
  var t = function (e, i) {
    return t = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (e, t) {
      e.__proto__ = t;
    } || function (e, t) {
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }, t(e, i);
  };
  function i(e, i) {
    if ("function" != typeof i && null !== i) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    function r() {
      this.constructor = e;
    }
    t(e, i), e.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r());
  }
  var r = function () {
    return r = Object.assign || function (e) {
      for (var t, i = 1, r = arguments.length; i < r; i++) for (var n in t = arguments[i]) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      return e;
    }, r.apply(this, arguments);
  };
  function n(e, t, i, r) {
    var n,
      s = arguments.length,
      o = s < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, i) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, i, r);else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (o = (s < 3 ? n(o) : s > 3 ? n(t, i, o) : n(t, i)) || o);
    return s > 3 && o && Object.defineProperty(t, i, o), o;
  }
  function s(e, t, i) {
    if (i || 2 === arguments.length) for (var r, n = 0, s = t.length; n < s; n++) !r && n in t || (r || (r = Array.prototype.slice.call(t, 0, n)), r[n] = t[n]);
    return e.concat(r || Array.prototype.slice.call(t));
  }
  "function" == typeof SuppressedError && SuppressedError;
  /**
       * @license
       * Copyright 2019 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const o = globalThis,
    a = o.ShadowRoot && (void 0 === o.ShadyCSS || o.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    h = Symbol(),
    l = new WeakMap();
  class c {
    constructor(e, t, i) {
      if (this._$cssResult$ = !0, i !== h) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = e, this.t = t;
    }
    get styleSheet() {
      let e = this.o;
      const t = this.t;
      if (a && void 0 === e) {
        const i = void 0 !== t && 1 === t.length;
        i && (e = l.get(t)), void 0 === e && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && l.set(t, e));
      }
      return e;
    }
    toString() {
      return this.cssText;
    }
  }
  const u = (e, ...t) => {
      const i = 1 === e.length ? e[0] : t.reduce((t, i, r) => t + (e => {
        if (!0 === e._$cssResult$) return e.cssText;
        if ("number" == typeof e) return e;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + e[r + 1], e[0]);
      return new c(i, e, h);
    },
    p = a ? e => e : e => e instanceof CSSStyleSheet ? (e => {
      let t = "";
      for (const i of e.cssRules) t += i.cssText;
      return (e => new c("string" == typeof e ? e : e + "", void 0, h))(t);
    })(e) : e
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    {
      is: d,
      defineProperty: f,
      getOwnPropertyDescriptor: _,
      getOwnPropertyNames: g,
      getOwnPropertySymbols: v,
      getPrototypeOf: m
    } = Object,
    b = globalThis,
    y = b.trustedTypes,
    E = y ? y.emptyScript : "",
    A = b.reactiveElementPolyfillSupport,
    P = (e, t) => e,
    w = {
      toAttribute(e, t) {
        switch (t) {
          case Boolean:
            e = e ? E : null;
            break;
          case Object:
          case Array:
            e = null == e ? e : JSON.stringify(e);
        }
        return e;
      },
      fromAttribute(e, t) {
        let i = e;
        switch (t) {
          case Boolean:
            i = null !== e;
            break;
          case Number:
            i = null === e ? null : Number(e);
            break;
          case Object:
          case Array:
            try {
              i = JSON.parse(e);
            } catch (e) {
              i = null;
            }
        }
        return i;
      }
    },
    H = (e, t) => !d(e, t),
    T = {
      attribute: !0,
      type: String,
      converter: w,
      reflect: !1,
      hasChanged: H
    };
  Symbol.metadata ??= Symbol("metadata"), b.litPropertyMetadata ??= new WeakMap();
  class $ extends HTMLElement {
    static addInitializer(e) {
      this._$Ei(), (this.l ??= []).push(e);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(e, t = T) {
      if (t.state && (t.attribute = !1), this._$Ei(), this.elementProperties.set(e, t), !t.noAccessor) {
        const i = Symbol(),
          r = this.getPropertyDescriptor(e, i, t);
        void 0 !== r && f(this.prototype, e, r);
      }
    }
    static getPropertyDescriptor(e, t, i) {
      const {
        get: r,
        set: n
      } = _(this.prototype, e) ?? {
        get() {
          return this[t];
        },
        set(e) {
          this[t] = e;
        }
      };
      return {
        get() {
          return r?.call(this);
        },
        set(t) {
          const s = r?.call(this);
          n.call(this, t), this.requestUpdate(e, s, i);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(e) {
      return this.elementProperties.get(e) ?? T;
    }
    static _$Ei() {
      if (this.hasOwnProperty(P("elementProperties"))) return;
      const e = m(this);
      e.finalize(), void 0 !== e.l && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(P("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
        const e = this.properties,
          t = [...g(e), ...v(e)];
        for (const i of t) this.createProperty(i, e[i]);
      }
      const e = this[Symbol.metadata];
      if (null !== e) {
        const t = litPropertyMetadata.get(e);
        if (void 0 !== t) for (const [e, i] of t) this.elementProperties.set(e, i);
      }
      this._$Eh = new Map();
      for (const [e, t] of this.elementProperties) {
        const i = this._$Eu(e, t);
        void 0 !== i && this._$Eh.set(i, e);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(e) {
      const t = [];
      if (Array.isArray(e)) {
        const i = new Set(e.flat(1 / 0).reverse());
        for (const e of i) t.unshift(p(e));
      } else void 0 !== e && t.push(p(e));
      return t;
    }
    static _$Eu(e, t) {
      const i = t.attribute;
      return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof e ? e.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(e => this.enableUpdating = e), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(e => e(this));
    }
    addController(e) {
      (this._$EO ??= new Set()).add(e), void 0 !== this.renderRoot && this.isConnected && e.hostConnected?.();
    }
    removeController(e) {
      this._$EO?.delete(e);
    }
    _$E_() {
      const e = new Map(),
        t = this.constructor.elementProperties;
      for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
      e.size > 0 && (this._$Ep = e);
    }
    createRenderRoot() {
      const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return ((e, t) => {
        if (a) e.adoptedStyleSheets = t.map(e => e instanceof CSSStyleSheet ? e : e.styleSheet);else for (const i of t) {
          const t = document.createElement("style"),
            r = o.litNonce;
          void 0 !== r && t.setAttribute("nonce", r), t.textContent = i.cssText, e.appendChild(t);
        }
      })(e, this.constructor.elementStyles), e;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(e => e.hostConnected?.());
    }
    enableUpdating(e) {}
    disconnectedCallback() {
      this._$EO?.forEach(e => e.hostDisconnected?.());
    }
    attributeChangedCallback(e, t, i) {
      this._$AK(e, i);
    }
    _$EC(e, t) {
      const i = this.constructor.elementProperties.get(e),
        r = this.constructor._$Eu(e, i);
      if (void 0 !== r && !0 === i.reflect) {
        const n = (void 0 !== i.converter?.toAttribute ? i.converter : w).toAttribute(t, i.type);
        this._$Em = e, null == n ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
      }
    }
    _$AK(e, t) {
      const i = this.constructor,
        r = i._$Eh.get(e);
      if (void 0 !== r && this._$Em !== r) {
        const e = i.getPropertyOptions(r),
          n = "function" == typeof e.converter ? {
            fromAttribute: e.converter
          } : void 0 !== e.converter?.fromAttribute ? e.converter : w;
        this._$Em = r, this[r] = n.fromAttribute(t, e.type), this._$Em = null;
      }
    }
    requestUpdate(e, t, i) {
      if (void 0 !== e) {
        if (i ??= this.constructor.getPropertyOptions(e), !(i.hasChanged ?? H)(this[e], t)) return;
        this.P(e, t, i);
      }
      !1 === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(e, t, i) {
      this._$AL.has(e) || this._$AL.set(e, t), !0 === i.reflect && this._$Em !== e && (this._$Ej ??= new Set()).add(e);
    }
    async _$ET() {
      this.isUpdatePending = !0;
      try {
        await this._$ES;
      } catch (e) {
        Promise.reject(e);
      }
      const e = this.scheduleUpdate();
      return null != e && (await e), !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [e, t] of this._$Ep) this[e] = t;
          this._$Ep = void 0;
        }
        const e = this.constructor.elementProperties;
        if (e.size > 0) for (const [t, i] of e) !0 !== i.wrapped || this._$AL.has(t) || void 0 === this[t] || this.P(t, this[t], i);
      }
      let e = !1;
      const t = this._$AL;
      try {
        e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach(e => e.hostUpdate?.()), this.update(t)) : this._$EU();
      } catch (t) {
        throw e = !1, this._$EU(), t;
      }
      e && this._$AE(t);
    }
    willUpdate(e) {}
    _$AE(e) {
      this._$EO?.forEach(e => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
    }
    _$EU() {
      this._$AL = new Map(), this.isUpdatePending = !1;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(e) {
      return !0;
    }
    update(e) {
      this._$Ej &&= this._$Ej.forEach(e => this._$EC(e, this[e])), this._$EU();
    }
    updated(e) {}
    firstUpdated(e) {}
  }
  $.elementStyles = [], $.shadowRootOptions = {
    mode: "open"
  }, $[P("elementProperties")] = new Map(), $[P("finalized")] = new Map(), A?.({
    ReactiveElement: $
  }), (b.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const S = globalThis,
    B = S.trustedTypes,
    I = B ? B.createPolicy("lit-html", {
      createHTML: e => e
    }) : void 0,
    C = "$lit$",
    D = `lit$${Math.random().toFixed(9).slice(2)}$`,
    N = "?" + D,
    L = `<${N}>`,
    O = document,
    R = () => O.createComment(""),
    U = e => null === e || "object" != typeof e && "function" != typeof e,
    M = Array.isArray,
    x = "[ \t\n\f\r]",
    k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    G = /-->/g,
    F = />/g,
    j = RegExp(`>|${x}(?:([^\\s"'>=/]+)(${x}*=${x}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    V = /'/g,
    z = /"/g,
    X = /^(?:script|style|textarea|title)$/i,
    K = (e => (t, ...i) => ({
      _$litType$: e,
      strings: t,
      values: i
    }))(1),
    W = Symbol.for("lit-noChange"),
    Y = Symbol.for("lit-nothing"),
    Z = new WeakMap(),
    q = O.createTreeWalker(O, 129);
  function J(e, t) {
    if (!Array.isArray(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== I ? I.createHTML(t) : t;
  }
  const Q = (e, t) => {
    const i = e.length - 1,
      r = [];
    let n,
      s = 2 === t ? "<svg>" : "",
      o = k;
    for (let t = 0; t < i; t++) {
      const i = e[t];
      let a,
        h,
        l = -1,
        c = 0;
      for (; c < i.length && (o.lastIndex = c, h = o.exec(i), null !== h);) c = o.lastIndex, o === k ? "!--" === h[1] ? o = G : void 0 !== h[1] ? o = F : void 0 !== h[2] ? (X.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = j) : void 0 !== h[3] && (o = j) : o === j ? ">" === h[0] ? (o = n ?? k, l = -1) : void 0 === h[1] ? l = -2 : (l = o.lastIndex - h[2].length, a = h[1], o = void 0 === h[3] ? j : '"' === h[3] ? z : V) : o === z || o === V ? o = j : o === G || o === F ? o = k : (o = j, n = void 0);
      const u = o === j && e[t + 1].startsWith("/>") ? " " : "";
      s += o === k ? i + L : l >= 0 ? (r.push(a), i.slice(0, l) + C + i.slice(l) + D + u) : i + D + (-2 === l ? t : u);
    }
    return [J(e, s + (e[i] || "<?>") + (2 === t ? "</svg>" : "")), r];
  };
  class ee {
    constructor({
      strings: e,
      _$litType$: t
    }, i) {
      let r;
      this.parts = [];
      let n = 0,
        s = 0;
      const o = e.length - 1,
        a = this.parts,
        [h, l] = Q(e, t);
      if (this.el = ee.createElement(h, i), q.currentNode = this.el.content, 2 === t) {
        const e = this.el.content.firstChild;
        e.replaceWith(...e.childNodes);
      }
      for (; null !== (r = q.nextNode()) && a.length < o;) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) for (const e of r.getAttributeNames()) if (e.endsWith(C)) {
            const t = l[s++],
              i = r.getAttribute(e).split(D),
              o = /([.?@])?(.*)/.exec(t);
            a.push({
              type: 1,
              index: n,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? se : "?" === o[1] ? oe : "@" === o[1] ? ae : ne
            }), r.removeAttribute(e);
          } else e.startsWith(D) && (a.push({
            type: 6,
            index: n
          }), r.removeAttribute(e));
          if (X.test(r.tagName)) {
            const e = r.textContent.split(D),
              t = e.length - 1;
            if (t > 0) {
              r.textContent = B ? B.emptyScript : "";
              for (let i = 0; i < t; i++) r.append(e[i], R()), q.nextNode(), a.push({
                type: 2,
                index: ++n
              });
              r.append(e[t], R());
            }
          }
        } else if (8 === r.nodeType) if (r.data === N) a.push({
          type: 2,
          index: n
        });else {
          let e = -1;
          for (; -1 !== (e = r.data.indexOf(D, e + 1));) a.push({
            type: 7,
            index: n
          }), e += D.length - 1;
        }
        n++;
      }
    }
    static createElement(e, t) {
      const i = O.createElement("template");
      return i.innerHTML = e, i;
    }
  }
  function te(e, t, i = e, r) {
    if (t === W) return t;
    let n = void 0 !== r ? i._$Co?.[r] : i._$Cl;
    const s = U(t) ? void 0 : t._$litDirective$;
    return n?.constructor !== s && (n?._$AO?.(!1), void 0 === s ? n = void 0 : (n = new s(e), n._$AT(e, i, r)), void 0 !== r ? (i._$Co ??= [])[r] = n : i._$Cl = n), void 0 !== n && (t = te(e, n._$AS(e, t.values), n, r)), t;
  }
  class ie {
    constructor(e, t) {
      this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(e) {
      const {
          el: {
            content: t
          },
          parts: i
        } = this._$AD,
        r = (e?.creationScope ?? O).importNode(t, !0);
      q.currentNode = r;
      let n = q.nextNode(),
        s = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (s === a.index) {
          let t;
          2 === a.type ? t = new re(n, n.nextSibling, this, e) : 1 === a.type ? t = new a.ctor(n, a.name, a.strings, this, e) : 6 === a.type && (t = new he(n, this, e)), this._$AV.push(t), a = i[++o];
        }
        s !== a?.index && (n = q.nextNode(), s++);
      }
      return q.currentNode = O, r;
    }
    p(e) {
      let t = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
    }
  }
  class re {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(e, t, i, r) {
      this.type = 2, this._$AH = Y, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
    }
    get parentNode() {
      let e = this._$AA.parentNode;
      const t = this._$AM;
      return void 0 !== t && 11 === e?.nodeType && (e = t.parentNode), e;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(e, t = this) {
      e = te(this, e, t), U(e) ? e === Y || null == e || "" === e ? (this._$AH !== Y && this._$AR(), this._$AH = Y) : e !== this._$AH && e !== W && this._(e) : void 0 !== e._$litType$ ? this.$(e) : void 0 !== e.nodeType ? this.T(e) : (e => M(e) || "function" == typeof e?.[Symbol.iterator])(e) ? this.k(e) : this._(e);
    }
    S(e) {
      return this._$AA.parentNode.insertBefore(e, this._$AB);
    }
    T(e) {
      this._$AH !== e && (this._$AR(), this._$AH = this.S(e));
    }
    _(e) {
      this._$AH !== Y && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
    }
    $(e) {
      const {
          values: t,
          _$litType$: i
        } = e,
        r = "number" == typeof i ? this._$AC(e) : (void 0 === i.el && (i.el = ee.createElement(J(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === r) this._$AH.p(t);else {
        const e = new ie(r, this),
          i = e.u(this.options);
        e.p(t), this.T(i), this._$AH = e;
      }
    }
    _$AC(e) {
      let t = Z.get(e.strings);
      return void 0 === t && Z.set(e.strings, t = new ee(e)), t;
    }
    k(e) {
      M(this._$AH) || (this._$AH = [], this._$AR());
      const t = this._$AH;
      let i,
        r = 0;
      for (const n of e) r === t.length ? t.push(i = new re(this.S(R()), this.S(R()), this, this.options)) : i = t[r], i._$AI(n), r++;
      r < t.length && (this._$AR(i && i._$AB.nextSibling, r), t.length = r);
    }
    _$AR(e = this._$AA.nextSibling, t) {
      for (this._$AP?.(!1, !0, t); e && e !== this._$AB;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    }
    setConnected(e) {
      void 0 === this._$AM && (this._$Cv = e, this._$AP?.(e));
    }
  }
  class ne {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(e, t, i, r, n) {
      this.type = 1, this._$AH = Y, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = n, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = Y;
    }
    _$AI(e, t = this, i, r) {
      const n = this.strings;
      let s = !1;
      if (void 0 === n) e = te(this, e, t, 0), s = !U(e) || e !== this._$AH && e !== W, s && (this._$AH = e);else {
        const r = e;
        let o, a;
        for (e = n[0], o = 0; o < n.length - 1; o++) a = te(this, r[i + o], t, o), a === W && (a = this._$AH[o]), s ||= !U(a) || a !== this._$AH[o], a === Y ? e = Y : e !== Y && (e += (a ?? "") + n[o + 1]), this._$AH[o] = a;
      }
      s && !r && this.j(e);
    }
    j(e) {
      e === Y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
    }
  }
  class se extends ne {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(e) {
      this.element[this.name] = e === Y ? void 0 : e;
    }
  }
  class oe extends ne {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(e) {
      this.element.toggleAttribute(this.name, !!e && e !== Y);
    }
  }
  class ae extends ne {
    constructor(e, t, i, r, n) {
      super(e, t, i, r, n), this.type = 5;
    }
    _$AI(e, t = this) {
      if ((e = te(this, e, t, 0) ?? Y) === W) return;
      const i = this._$AH,
        r = e === Y && i !== Y || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive,
        n = e !== Y && (i === Y || r);
      r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
    }
    handleEvent(e) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
    }
  }
  class he {
    constructor(e, t, i) {
      this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e) {
      te(this, e);
    }
  }
  const le = S.litHtmlPolyfillSupport;
  le?.(ee, re), (S.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class ce extends $ {
    constructor() {
      super(...arguments), this.renderOptions = {
        host: this
      }, this._$Do = void 0;
    }
    createRenderRoot() {
      const e = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= e.firstChild, e;
    }
    update(e) {
      const t = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ((e, t, i) => {
        const r = i?.renderBefore ?? t;
        let n = r._$litPart$;
        if (void 0 === n) {
          const e = i?.renderBefore ?? null;
          r._$litPart$ = n = new re(t.insertBefore(R(), e), e, void 0, i ?? {});
        }
        return n._$AI(e), n;
      })(t, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
      return W;
    }
  }
  ce._$litElement$ = !0, ce.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: ce
  });
  const ue = globalThis.litElementPolyfillSupport;
  ue?.({
    LitElement: ce
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const pe = e => (t, i) => {
      void 0 !== i ? i.addInitializer(() => {
        customElements.define(e, t);
      }) : customElements.define(e, t);
    }
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    de = {
      attribute: !0,
      type: String,
      converter: w,
      reflect: !1,
      hasChanged: H
    },
    fe = (e = de, t, i) => {
      const {
        kind: r,
        metadata: n
      } = i;
      let s = globalThis.litPropertyMetadata.get(n);
      if (void 0 === s && globalThis.litPropertyMetadata.set(n, s = new Map()), s.set(i.name, e), "accessor" === r) {
        const {
          name: r
        } = i;
        return {
          set(i) {
            const n = t.get.call(this);
            t.set.call(this, i), this.requestUpdate(r, n, e);
          },
          init(t) {
            return void 0 !== t && this.P(r, void 0, e), t;
          }
        };
      }
      if ("setter" === r) {
        const {
          name: r
        } = i;
        return function (i) {
          const n = this[r];
          t.call(this, i), this.requestUpdate(r, n, e);
        };
      }
      throw Error("Unsupported decorator location: " + r);
    };
  function _e(e) {
    return (t, i) => "object" == typeof i ? fe(e, t, i) : ((e, t, i) => {
      const r = t.hasOwnProperty(i);
      return t.constructor.createProperty(i, r ? {
        ...e,
        wrapped: !0
      } : e), r ? Object.getOwnPropertyDescriptor(t, i) : void 0;
    })(e, t, i);
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function ge(e) {
    return _e({
      ...e,
      state: !0,
      attribute: !1
    });
  }
  const ve = (e, t, i, r) => {
    r = r || {}, i = i ?? {};
    const n = new Event(t, {
      bubbles: void 0 === r.bubbles || r.bubbles,
      cancelable: Boolean(r.cancelable),
      composed: void 0 === r.composed || r.composed
    });
    return n.detail = i, e.dispatchEvent(n), n;
  };
  function me(e, t) {
    return t ? e.states[t.entity_id] : void 0;
  }
  function be(e, t) {
    const i = me(e, t),
      r = i ? parseFloat(i.state) : 0;
    return isNaN(r) ? 0 : r;
  }
  function ye(e, t) {
    const i = me(e, t);
    return i ? String(i.state) : "";
  }
  function Ee(e, t, i, r) {
    return "on" == ye(e, t) ? i : r;
  }
  function Ae(e, t) {
    const i = {};
    for (const r in e.entities) {
      const n = e.entities[r];
      n.device_id === t && (i[n.entity_id] = n);
    }
    return i;
  }
  function Pe(e, t, i) {
    for (const r in e) {
      const n = e[r],
        s = r.split("."),
        o = s[0],
        a = s[1];
      if (o === t && a.endsWith(i)) return n;
    }
  }
  function we(e, t, i, r) {
    for (const n in e) {
      const s = e[n],
        o = n.split("."),
        a = o[0],
        h = o[1].split(t)[1];
      if (a === i && h === r) return s;
    }
  }
  function He(e) {
    const t = e.path.split("/");
    return t.length > 1 ? t[1] : void 0;
  }
  function Te(e) {
    const t = e.path.split("/");
    return t.length > 2 ? t[2] : "main";
  }
  let $e = class extends ce {
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterID") && (this.printerEntities = Ae(this.hass, this.selectedPrinterID));
    }
    render() {
      return K`
      <debug-data elevation="2">
        <p>There are ${Object.keys(this.hass.states).length} entities.</p>
        <p>The screen is${this.narrow ? "" : " not"} narrow.</p>
        Configured panel config
        <pre>${JSON.stringify(this.panel, void 0, 2)}</pre>
        Current route
        <pre>${JSON.stringify(this.route, void 0, 2)}</pre>
        Printers
        <pre>${JSON.stringify(this.printers, void 0, 2)}</pre>
        Printer Entities
        <pre>${JSON.stringify(this.printerEntities, void 0, 2)}</pre>
        Selected Printer
        <pre>${JSON.stringify(this.selectedPrinterDevice, void 0, 2)}</pre>
      </debug-data>
    `;
    }
    static get styles() {
      return u`
      :host {
        padding: 16px;
        display: block;
      }
      debug-data {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }
    `;
    }
  };
  n([_e()], $e.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], $e.prototype, "narrow", void 0), n([_e()], $e.prototype, "route", void 0), n([_e()], $e.prototype, "panel", void 0), n([_e()], $e.prototype, "printers", void 0), n([_e()], $e.prototype, "selectedPrinterID", void 0), n([_e()], $e.prototype, "selectedPrinterDevice", void 0), n([ge()], $e.prototype, "printerEntities", void 0), $e = n([pe("anycubic-view-debug")], $e);
  var Se,
    Be,
    Ie,
    Ce = "Anycubic Cloud",
    De = {
      initial: {
        fields: {
          printer_select: {
            heading: "Select a printer."
          }
        }
      },
      main: {
        title: "Main",
        cards: {
          main: {
            description: "General information about the printer.",
            fields: {
              printer_name: {
                heading: "Name"
              },
              printer_id: {
                heading: "ID"
              },
              printer_mac: {
                heading: "MAC"
              },
              printer_model: {
                heading: "Model"
              },
              printer_fw_version: {
                heading: "FW Version"
              },
              printer_fw_update_available: {
                heading: "FW Status"
              },
              printer_online: {
                heading: "Online"
              },
              printer_available: {
                heading: "Available"
              },
              curr_nozzle_temp: {
                heading: "Current Nozzle Temperature"
              },
              curr_hotbed_temp: {
                heading: "Current Hotbed Temperature"
              },
              target_nozzle_temp: {
                heading: "Target Nozzle Temperature"
              },
              target_hotbed_temp: {
                heading: "Target Hotbed Temperature"
              },
              print_state: {
                heading: "Project State"
              },
              project_progress: {
                heading: "Project Progress"
              },
              ace_fw_version: {
                heading: "ACE FW Version"
              },
              ace_fw_update_available: {
                heading: "ACE FW Status"
              },
              drying_active: {
                heading: "ACE Drying Status"
              },
              drying_progress: {
                heading: "ACE Drying Progress"
              }
            }
          }
        }
      },
      files_cloud: {
        title: "Cloud Files",
        cards: {}
      },
      files_local: {
        title: "Local Files",
        cards: {}
      },
      files_udisk: {
        title: "USB Files",
        cards: {}
      },
      print_save_in_cloud: {
        title: "Print (Save in user cloud)",
        cards: {},
        actions: {
          print: "Print"
        }
      },
      print_no_cloud_save: {
        title: "Print (No Cloud Save)",
        cards: {},
        actions: {
          print: "Print"
        }
      },
      debug: {
        title: "Debug",
        cards: {}
      }
    },
    Ne = {
      title: Ce,
      panels: De
    },
    Le = Object.freeze({
      __proto__: null,
      title: Ce,
      panels: De,
      default: Ne
    });
  function Oe(e) {
    return e.type === Be.literal;
  }
  function Re(e) {
    return e.type === Be.argument;
  }
  function Ue(e) {
    return e.type === Be.number;
  }
  function Me(e) {
    return e.type === Be.date;
  }
  function xe(e) {
    return e.type === Be.time;
  }
  function ke(e) {
    return e.type === Be.select;
  }
  function Ge(e) {
    return e.type === Be.plural;
  }
  function Fe(e) {
    return e.type === Be.pound;
  }
  function je(e) {
    return e.type === Be.tag;
  }
  function Ve(e) {
    return !(!e || "object" != typeof e || e.type !== Ie.number);
  }
  function ze(e) {
    return !(!e || "object" != typeof e || e.type !== Ie.dateTime);
  }
  !function (e) {
    e[e.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", e[e.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", e[e.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", e[e.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", e[e.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", e[e.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", e[e.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", e[e.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", e[e.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", e[e.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", e[e.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", e[e.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", e[e.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", e[e.INVALID_TAG = 23] = "INVALID_TAG", e[e.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", e[e.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", e[e.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
  }(Se || (Se = {})), function (e) {
    e[e.literal = 0] = "literal", e[e.argument = 1] = "argument", e[e.number = 2] = "number", e[e.date = 3] = "date", e[e.time = 4] = "time", e[e.select = 5] = "select", e[e.plural = 6] = "plural", e[e.pound = 7] = "pound", e[e.tag = 8] = "tag";
  }(Be || (Be = {})), function (e) {
    e[e.number = 0] = "number", e[e.dateTime = 1] = "dateTime";
  }(Ie || (Ie = {}));
  var Xe = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    Ke = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function We(e) {
    var t = {};
    return e.replace(Ke, function (e) {
      var i = e.length;
      switch (e[0]) {
        case "G":
          t.era = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "y":
          t.year = 2 === i ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          t.month = ["numeric", "2-digit", "short", "long", "narrow"][i - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          t.day = ["numeric", "2-digit"][i - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
        case "E":
          t.weekday = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "e":
          if (i < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
          t.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "c":
          if (i < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
          t.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "a":
          t.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
        case "h":
          t.hourCycle = "h12", t.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "H":
          t.hourCycle = "h23", t.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "K":
          t.hourCycle = "h11", t.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "k":
          t.hourCycle = "h24", t.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
        case "m":
          t.minute = ["numeric", "2-digit"][i - 1];
          break;
        case "s":
          t.second = ["numeric", "2-digit"][i - 1];
          break;
        case "S":
        case "A":
          throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
        case "z":
          t.timeZoneName = i < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead");
      }
      return "";
    }), t;
  }
  var Ye = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
  var Ze = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    qe = /^(@+)?(\+|#+)?[rs]?$/g,
    Je = /(\*)(0+)|(#+)(0+)|(0+)/g,
    Qe = /^(0+)$/;
  function et(e) {
    var t = {};
    return "r" === e[e.length - 1] ? t.roundingPriority = "morePrecision" : "s" === e[e.length - 1] && (t.roundingPriority = "lessPrecision"), e.replace(qe, function (e, i, r) {
      return "string" != typeof r ? (t.minimumSignificantDigits = i.length, t.maximumSignificantDigits = i.length) : "+" === r ? t.minimumSignificantDigits = i.length : "#" === i[0] ? t.maximumSignificantDigits = i.length : (t.minimumSignificantDigits = i.length, t.maximumSignificantDigits = i.length + ("string" == typeof r ? r.length : 0)), "";
    }), t;
  }
  function tt(e) {
    switch (e) {
      case "sign-auto":
        return {
          signDisplay: "auto"
        };
      case "sign-accounting":
      case "()":
        return {
          currencySign: "accounting"
        };
      case "sign-always":
      case "+!":
        return {
          signDisplay: "always"
        };
      case "sign-accounting-always":
      case "()!":
        return {
          signDisplay: "always",
          currencySign: "accounting"
        };
      case "sign-except-zero":
      case "+?":
        return {
          signDisplay: "exceptZero"
        };
      case "sign-accounting-except-zero":
      case "()?":
        return {
          signDisplay: "exceptZero",
          currencySign: "accounting"
        };
      case "sign-never":
      case "+_":
        return {
          signDisplay: "never"
        };
    }
  }
  function it(e) {
    var t;
    if ("E" === e[0] && "E" === e[1] ? (t = {
      notation: "engineering"
    }, e = e.slice(2)) : "E" === e[0] && (t = {
      notation: "scientific"
    }, e = e.slice(1)), t) {
      var i = e.slice(0, 2);
      if ("+!" === i ? (t.signDisplay = "always", e = e.slice(2)) : "+?" === i && (t.signDisplay = "exceptZero", e = e.slice(2)), !Qe.test(e)) throw new Error("Malformed concise eng/scientific notation");
      t.minimumIntegerDigits = e.length;
    }
    return t;
  }
  function rt(e) {
    var t = tt(e);
    return t || {};
  }
  function nt(e) {
    for (var t = {}, i = 0, n = e; i < n.length; i++) {
      var s = n[i];
      switch (s.stem) {
        case "percent":
        case "%":
          t.style = "percent";
          continue;
        case "%x100":
          t.style = "percent", t.scale = 100;
          continue;
        case "currency":
          t.style = "currency", t.currency = s.options[0];
          continue;
        case "group-off":
        case ",_":
          t.useGrouping = !1;
          continue;
        case "precision-integer":
        case ".":
          t.maximumFractionDigits = 0;
          continue;
        case "measure-unit":
        case "unit":
          t.style = "unit", t.unit = s.options[0].replace(/^(.*?)-/, "");
          continue;
        case "compact-short":
        case "K":
          t.notation = "compact", t.compactDisplay = "short";
          continue;
        case "compact-long":
        case "KK":
          t.notation = "compact", t.compactDisplay = "long";
          continue;
        case "scientific":
          t = r(r(r({}, t), {
            notation: "scientific"
          }), s.options.reduce(function (e, t) {
            return r(r({}, e), rt(t));
          }, {}));
          continue;
        case "engineering":
          t = r(r(r({}, t), {
            notation: "engineering"
          }), s.options.reduce(function (e, t) {
            return r(r({}, e), rt(t));
          }, {}));
          continue;
        case "notation-simple":
          t.notation = "standard";
          continue;
        case "unit-width-narrow":
          t.currencyDisplay = "narrowSymbol", t.unitDisplay = "narrow";
          continue;
        case "unit-width-short":
          t.currencyDisplay = "code", t.unitDisplay = "short";
          continue;
        case "unit-width-full-name":
          t.currencyDisplay = "name", t.unitDisplay = "long";
          continue;
        case "unit-width-iso-code":
          t.currencyDisplay = "symbol";
          continue;
        case "scale":
          t.scale = parseFloat(s.options[0]);
          continue;
        case "rounding-mode-floor":
          t.roundingMode = "floor";
          continue;
        case "rounding-mode-ceiling":
          t.roundingMode = "ceil";
          continue;
        case "rounding-mode-down":
          t.roundingMode = "trunc";
          continue;
        case "rounding-mode-up":
          t.roundingMode = "expand";
          continue;
        case "rounding-mode-half-even":
          t.roundingMode = "halfEven";
          continue;
        case "rounding-mode-half-down":
          t.roundingMode = "halfTrunc";
          continue;
        case "rounding-mode-half-up":
          t.roundingMode = "halfExpand";
          continue;
        case "integer-width":
          if (s.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
          s.options[0].replace(Je, function (e, i, r, n, s, o) {
            if (i) t.minimumIntegerDigits = r.length;else {
              if (n && s) throw new Error("We currently do not support maximum integer digits");
              if (o) throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (Qe.test(s.stem)) t.minimumIntegerDigits = s.stem.length;else if (Ze.test(s.stem)) {
        if (s.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
        s.stem.replace(Ze, function (e, i, r, n, s, o) {
          return "*" === r ? t.minimumFractionDigits = i.length : n && "#" === n[0] ? t.maximumFractionDigits = n.length : s && o ? (t.minimumFractionDigits = s.length, t.maximumFractionDigits = s.length + o.length) : (t.minimumFractionDigits = i.length, t.maximumFractionDigits = i.length), "";
        });
        var o = s.options[0];
        "w" === o ? t = r(r({}, t), {
          trailingZeroDisplay: "stripIfInteger"
        }) : o && (t = r(r({}, t), et(o)));
      } else if (qe.test(s.stem)) t = r(r({}, t), et(s.stem));else {
        var a = tt(s.stem);
        a && (t = r(r({}, t), a));
        var h = it(s.stem);
        h && (t = r(r({}, t), h));
      }
    }
    return t;
  }
  var st,
    ot = {
      "001": ["H", "h"],
      AC: ["H", "h", "hb", "hB"],
      AD: ["H", "hB"],
      AE: ["h", "hB", "hb", "H"],
      AF: ["H", "hb", "hB", "h"],
      AG: ["h", "hb", "H", "hB"],
      AI: ["H", "h", "hb", "hB"],
      AL: ["h", "H", "hB"],
      AM: ["H", "hB"],
      AO: ["H", "hB"],
      AR: ["H", "h", "hB", "hb"],
      AS: ["h", "H"],
      AT: ["H", "hB"],
      AU: ["h", "hb", "H", "hB"],
      AW: ["H", "hB"],
      AX: ["H"],
      AZ: ["H", "hB", "h"],
      BA: ["H", "hB", "h"],
      BB: ["h", "hb", "H", "hB"],
      BD: ["h", "hB", "H"],
      BE: ["H", "hB"],
      BF: ["H", "hB"],
      BG: ["H", "hB", "h"],
      BH: ["h", "hB", "hb", "H"],
      BI: ["H", "h"],
      BJ: ["H", "hB"],
      BL: ["H", "hB"],
      BM: ["h", "hb", "H", "hB"],
      BN: ["hb", "hB", "h", "H"],
      BO: ["H", "hB", "h", "hb"],
      BQ: ["H"],
      BR: ["H", "hB"],
      BS: ["h", "hb", "H", "hB"],
      BT: ["h", "H"],
      BW: ["H", "h", "hb", "hB"],
      BY: ["H", "h"],
      BZ: ["H", "h", "hb", "hB"],
      CA: ["h", "hb", "H", "hB"],
      CC: ["H", "h", "hb", "hB"],
      CD: ["hB", "H"],
      CF: ["H", "h", "hB"],
      CG: ["H", "hB"],
      CH: ["H", "hB", "h"],
      CI: ["H", "hB"],
      CK: ["H", "h", "hb", "hB"],
      CL: ["H", "h", "hB", "hb"],
      CM: ["H", "h", "hB"],
      CN: ["H", "hB", "hb", "h"],
      CO: ["h", "H", "hB", "hb"],
      CP: ["H"],
      CR: ["H", "h", "hB", "hb"],
      CU: ["H", "h", "hB", "hb"],
      CV: ["H", "hB"],
      CW: ["H", "hB"],
      CX: ["H", "h", "hb", "hB"],
      CY: ["h", "H", "hb", "hB"],
      CZ: ["H"],
      DE: ["H", "hB"],
      DG: ["H", "h", "hb", "hB"],
      DJ: ["h", "H"],
      DK: ["H"],
      DM: ["h", "hb", "H", "hB"],
      DO: ["h", "H", "hB", "hb"],
      DZ: ["h", "hB", "hb", "H"],
      EA: ["H", "h", "hB", "hb"],
      EC: ["H", "hB", "h", "hb"],
      EE: ["H", "hB"],
      EG: ["h", "hB", "hb", "H"],
      EH: ["h", "hB", "hb", "H"],
      ER: ["h", "H"],
      ES: ["H", "hB", "h", "hb"],
      ET: ["hB", "hb", "h", "H"],
      FI: ["H"],
      FJ: ["h", "hb", "H", "hB"],
      FK: ["H", "h", "hb", "hB"],
      FM: ["h", "hb", "H", "hB"],
      FO: ["H", "h"],
      FR: ["H", "hB"],
      GA: ["H", "hB"],
      GB: ["H", "h", "hb", "hB"],
      GD: ["h", "hb", "H", "hB"],
      GE: ["H", "hB", "h"],
      GF: ["H", "hB"],
      GG: ["H", "h", "hb", "hB"],
      GH: ["h", "H"],
      GI: ["H", "h", "hb", "hB"],
      GL: ["H", "h"],
      GM: ["h", "hb", "H", "hB"],
      GN: ["H", "hB"],
      GP: ["H", "hB"],
      GQ: ["H", "hB", "h", "hb"],
      GR: ["h", "H", "hb", "hB"],
      GT: ["H", "h", "hB", "hb"],
      GU: ["h", "hb", "H", "hB"],
      GW: ["H", "hB"],
      GY: ["h", "hb", "H", "hB"],
      HK: ["h", "hB", "hb", "H"],
      HN: ["H", "h", "hB", "hb"],
      HR: ["H", "hB"],
      HU: ["H", "h"],
      IC: ["H", "h", "hB", "hb"],
      ID: ["H"],
      IE: ["H", "h", "hb", "hB"],
      IL: ["H", "hB"],
      IM: ["H", "h", "hb", "hB"],
      IN: ["h", "H"],
      IO: ["H", "h", "hb", "hB"],
      IQ: ["h", "hB", "hb", "H"],
      IR: ["hB", "H"],
      IS: ["H"],
      IT: ["H", "hB"],
      JE: ["H", "h", "hb", "hB"],
      JM: ["h", "hb", "H", "hB"],
      JO: ["h", "hB", "hb", "H"],
      JP: ["H", "K", "h"],
      KE: ["hB", "hb", "H", "h"],
      KG: ["H", "h", "hB", "hb"],
      KH: ["hB", "h", "H", "hb"],
      KI: ["h", "hb", "H", "hB"],
      KM: ["H", "h", "hB", "hb"],
      KN: ["h", "hb", "H", "hB"],
      KP: ["h", "H", "hB", "hb"],
      KR: ["h", "H", "hB", "hb"],
      KW: ["h", "hB", "hb", "H"],
      KY: ["h", "hb", "H", "hB"],
      KZ: ["H", "hB"],
      LA: ["H", "hb", "hB", "h"],
      LB: ["h", "hB", "hb", "H"],
      LC: ["h", "hb", "H", "hB"],
      LI: ["H", "hB", "h"],
      LK: ["H", "h", "hB", "hb"],
      LR: ["h", "hb", "H", "hB"],
      LS: ["h", "H"],
      LT: ["H", "h", "hb", "hB"],
      LU: ["H", "h", "hB"],
      LV: ["H", "hB", "hb", "h"],
      LY: ["h", "hB", "hb", "H"],
      MA: ["H", "h", "hB", "hb"],
      MC: ["H", "hB"],
      MD: ["H", "hB"],
      ME: ["H", "hB", "h"],
      MF: ["H", "hB"],
      MG: ["H", "h"],
      MH: ["h", "hb", "H", "hB"],
      MK: ["H", "h", "hb", "hB"],
      ML: ["H"],
      MM: ["hB", "hb", "H", "h"],
      MN: ["H", "h", "hb", "hB"],
      MO: ["h", "hB", "hb", "H"],
      MP: ["h", "hb", "H", "hB"],
      MQ: ["H", "hB"],
      MR: ["h", "hB", "hb", "H"],
      MS: ["H", "h", "hb", "hB"],
      MT: ["H", "h"],
      MU: ["H", "h"],
      MV: ["H", "h"],
      MW: ["h", "hb", "H", "hB"],
      MX: ["H", "h", "hB", "hb"],
      MY: ["hb", "hB", "h", "H"],
      MZ: ["H", "hB"],
      NA: ["h", "H", "hB", "hb"],
      NC: ["H", "hB"],
      NE: ["H"],
      NF: ["H", "h", "hb", "hB"],
      NG: ["H", "h", "hb", "hB"],
      NI: ["H", "h", "hB", "hb"],
      NL: ["H", "hB"],
      NO: ["H", "h"],
      NP: ["H", "h", "hB"],
      NR: ["H", "h", "hb", "hB"],
      NU: ["H", "h", "hb", "hB"],
      NZ: ["h", "hb", "H", "hB"],
      OM: ["h", "hB", "hb", "H"],
      PA: ["h", "H", "hB", "hb"],
      PE: ["H", "hB", "h", "hb"],
      PF: ["H", "h", "hB"],
      PG: ["h", "H"],
      PH: ["h", "hB", "hb", "H"],
      PK: ["h", "hB", "H"],
      PL: ["H", "h"],
      PM: ["H", "hB"],
      PN: ["H", "h", "hb", "hB"],
      PR: ["h", "H", "hB", "hb"],
      PS: ["h", "hB", "hb", "H"],
      PT: ["H", "hB"],
      PW: ["h", "H"],
      PY: ["H", "h", "hB", "hb"],
      QA: ["h", "hB", "hb", "H"],
      RE: ["H", "hB"],
      RO: ["H", "hB"],
      RS: ["H", "hB", "h"],
      RU: ["H"],
      RW: ["H", "h"],
      SA: ["h", "hB", "hb", "H"],
      SB: ["h", "hb", "H", "hB"],
      SC: ["H", "h", "hB"],
      SD: ["h", "hB", "hb", "H"],
      SE: ["H"],
      SG: ["h", "hb", "H", "hB"],
      SH: ["H", "h", "hb", "hB"],
      SI: ["H", "hB"],
      SJ: ["H"],
      SK: ["H"],
      SL: ["h", "hb", "H", "hB"],
      SM: ["H", "h", "hB"],
      SN: ["H", "h", "hB"],
      SO: ["h", "H"],
      SR: ["H", "hB"],
      SS: ["h", "hb", "H", "hB"],
      ST: ["H", "hB"],
      SV: ["H", "h", "hB", "hb"],
      SX: ["H", "h", "hb", "hB"],
      SY: ["h", "hB", "hb", "H"],
      SZ: ["h", "hb", "H", "hB"],
      TA: ["H", "h", "hb", "hB"],
      TC: ["h", "hb", "H", "hB"],
      TD: ["h", "H", "hB"],
      TF: ["H", "h", "hB"],
      TG: ["H", "hB"],
      TH: ["H", "h"],
      TJ: ["H", "h"],
      TL: ["H", "hB", "hb", "h"],
      TM: ["H", "h"],
      TN: ["h", "hB", "hb", "H"],
      TO: ["h", "H"],
      TR: ["H", "hB"],
      TT: ["h", "hb", "H", "hB"],
      TW: ["hB", "hb", "h", "H"],
      TZ: ["hB", "hb", "H", "h"],
      UA: ["H", "hB", "h"],
      UG: ["hB", "hb", "H", "h"],
      UM: ["h", "hb", "H", "hB"],
      US: ["h", "hb", "H", "hB"],
      UY: ["H", "h", "hB", "hb"],
      UZ: ["H", "hB", "h"],
      VA: ["H", "h", "hB"],
      VC: ["h", "hb", "H", "hB"],
      VE: ["h", "H", "hB", "hb"],
      VG: ["h", "hb", "H", "hB"],
      VI: ["h", "hb", "H", "hB"],
      VN: ["H", "h"],
      VU: ["h", "H"],
      WF: ["H", "hB"],
      WS: ["h", "H"],
      XK: ["H", "hB", "h"],
      YE: ["h", "hB", "hb", "H"],
      YT: ["H", "hB"],
      ZA: ["H", "h", "hb", "hB"],
      ZM: ["h", "hb", "H", "hB"],
      ZW: ["H", "h"],
      "af-ZA": ["H", "h", "hB", "hb"],
      "ar-001": ["h", "hB", "hb", "H"],
      "ca-ES": ["H", "h", "hB"],
      "en-001": ["h", "hb", "H", "hB"],
      "es-BO": ["H", "h", "hB", "hb"],
      "es-BR": ["H", "h", "hB", "hb"],
      "es-EC": ["H", "h", "hB", "hb"],
      "es-ES": ["H", "h", "hB", "hb"],
      "es-GQ": ["H", "h", "hB", "hb"],
      "es-PE": ["H", "h", "hB", "hb"],
      "fr-CA": ["H", "h", "hB"],
      "gl-ES": ["H", "h", "hB"],
      "gu-IN": ["hB", "hb", "h", "H"],
      "hi-IN": ["hB", "h", "H"],
      "it-CH": ["H", "h", "hB"],
      "it-IT": ["H", "h", "hB"],
      "kn-IN": ["hB", "h", "H"],
      "ml-IN": ["hB", "h", "H"],
      "mr-IN": ["hB", "hb", "h", "H"],
      "pa-IN": ["hB", "hb", "h", "H"],
      "ta-IN": ["hB", "h", "hb", "H"],
      "te-IN": ["hB", "h", "H"],
      "zu-ZA": ["H", "hB", "hb", "h"]
    };
  function at(e) {
    var t = e.hourCycle;
    if (void 0 === t && e.hourCycles && e.hourCycles.length && (t = e.hourCycles[0]), t) switch (t) {
      case "h24":
        return "k";
      case "h23":
        return "H";
      case "h12":
        return "h";
      case "h11":
        return "K";
      default:
        throw new Error("Invalid hourCycle");
    }
    var i,
      r = e.language;
    return "root" !== r && (i = e.maximize().region), (ot[i || ""] || ot[r || ""] || ot["".concat(r, "-001")] || ot["001"])[0];
  }
  var ht = new RegExp("^".concat(Xe.source, "*")),
    lt = new RegExp("".concat(Xe.source, "*$"));
  function ct(e, t) {
    return {
      start: e,
      end: t
    };
  }
  var ut = !!String.prototype.startsWith && "_a".startsWith("a", 1),
    pt = !!String.fromCodePoint,
    dt = !!Object.fromEntries,
    ft = !!String.prototype.codePointAt,
    _t = !!String.prototype.trimStart,
    gt = !!String.prototype.trimEnd,
    vt = !!Number.isSafeInteger ? Number.isSafeInteger : function (e) {
      return "number" == typeof e && isFinite(e) && Math.floor(e) === e && Math.abs(e) <= 9007199254740991;
    },
    mt = !0;
  try {
    mt = "a" === (null === (st = Tt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) || void 0 === st ? void 0 : st[0]);
  } catch (F) {
    mt = !1;
  }
  var bt,
    yt = ut ? function (e, t, i) {
      return e.startsWith(t, i);
    } : function (e, t, i) {
      return e.slice(i, i + t.length) === t;
    },
    Et = pt ? String.fromCodePoint : function () {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      for (var i, r = "", n = e.length, s = 0; n > s;) {
        if ((i = e[s++]) > 1114111) throw RangeError(i + " is not a valid code point");
        r += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(55296 + ((i -= 65536) >> 10), i % 1024 + 56320);
      }
      return r;
    },
    At = dt ? Object.fromEntries : function (e) {
      for (var t = {}, i = 0, r = e; i < r.length; i++) {
        var n = r[i],
          s = n[0],
          o = n[1];
        t[s] = o;
      }
      return t;
    },
    Pt = ft ? function (e, t) {
      return e.codePointAt(t);
    } : function (e, t) {
      var i = e.length;
      if (!(t < 0 || t >= i)) {
        var r,
          n = e.charCodeAt(t);
        return n < 55296 || n > 56319 || t + 1 === i || (r = e.charCodeAt(t + 1)) < 56320 || r > 57343 ? n : r - 56320 + (n - 55296 << 10) + 65536;
      }
    },
    wt = _t ? function (e) {
      return e.trimStart();
    } : function (e) {
      return e.replace(ht, "");
    },
    Ht = gt ? function (e) {
      return e.trimEnd();
    } : function (e) {
      return e.replace(lt, "");
    };
  function Tt(e, t) {
    return new RegExp(e, t);
  }
  if (mt) {
    var $t = Tt("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    bt = function (e, t) {
      var i;
      return $t.lastIndex = t, null !== (i = $t.exec(e)[1]) && void 0 !== i ? i : "";
    };
  } else bt = function (e, t) {
    for (var i = [];;) {
      var r = Pt(e, t);
      if (void 0 === r || Ct(r) || Dt(r)) break;
      i.push(r), t += r >= 65536 ? 2 : 1;
    }
    return Et.apply(void 0, i);
  };
  var St = function () {
    function e(e, t) {
      void 0 === t && (t = {}), this.message = e, this.position = {
        offset: 0,
        line: 1,
        column: 1
      }, this.ignoreTag = !!t.ignoreTag, this.locale = t.locale, this.requiresOtherClause = !!t.requiresOtherClause, this.shouldParseSkeletons = !!t.shouldParseSkeletons;
    }
    return e.prototype.parse = function () {
      if (0 !== this.offset()) throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }, e.prototype.parseMessage = function (e, t, i) {
      for (var r = []; !this.isEOF();) {
        var n = this.char();
        if (123 === n) {
          if ((s = this.parseArgument(e, i)).err) return s;
          r.push(s.val);
        } else {
          if (125 === n && e > 0) break;
          if (35 !== n || "plural" !== t && "selectordinal" !== t) {
            if (60 === n && !this.ignoreTag && 47 === this.peek()) {
              if (i) break;
              return this.error(Se.UNMATCHED_CLOSING_TAG, ct(this.clonePosition(), this.clonePosition()));
            }
            if (60 === n && !this.ignoreTag && Bt(this.peek() || 0)) {
              if ((s = this.parseTag(e, t)).err) return s;
              r.push(s.val);
            } else {
              var s;
              if ((s = this.parseLiteral(e, t)).err) return s;
              r.push(s.val);
            }
          } else {
            var o = this.clonePosition();
            this.bump(), r.push({
              type: Be.pound,
              location: ct(o, this.clonePosition())
            });
          }
        }
      }
      return {
        val: r,
        err: null
      };
    }, e.prototype.parseTag = function (e, t) {
      var i = this.clonePosition();
      this.bump();
      var r = this.parseTagName();
      if (this.bumpSpace(), this.bumpIf("/>")) return {
        val: {
          type: Be.literal,
          value: "<".concat(r, "/>"),
          location: ct(i, this.clonePosition())
        },
        err: null
      };
      if (this.bumpIf(">")) {
        var n = this.parseMessage(e + 1, t, !0);
        if (n.err) return n;
        var s = n.val,
          o = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Bt(this.char())) return this.error(Se.INVALID_TAG, ct(o, this.clonePosition()));
          var a = this.clonePosition();
          return r !== this.parseTagName() ? this.error(Se.UNMATCHED_CLOSING_TAG, ct(a, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: Be.tag,
              value: r,
              children: s,
              location: ct(i, this.clonePosition())
            },
            err: null
          } : this.error(Se.INVALID_TAG, ct(o, this.clonePosition())));
        }
        return this.error(Se.UNCLOSED_TAG, ct(i, this.clonePosition()));
      }
      return this.error(Se.INVALID_TAG, ct(i, this.clonePosition()));
    }, e.prototype.parseTagName = function () {
      var e = this.offset();
      for (this.bump(); !this.isEOF() && It(this.char());) this.bump();
      return this.message.slice(e, this.offset());
    }, e.prototype.parseLiteral = function (e, t) {
      for (var i = this.clonePosition(), r = "";;) {
        var n = this.tryParseQuote(t);
        if (n) r += n;else {
          var s = this.tryParseUnquoted(e, t);
          if (s) r += s;else {
            var o = this.tryParseLeftAngleBracket();
            if (!o) break;
            r += o;
          }
        }
      }
      var a = ct(i, this.clonePosition());
      return {
        val: {
          type: Be.literal,
          value: r,
          location: a
        },
        err: null
      };
    }, e.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() || 60 !== this.char() || !this.ignoreTag && (Bt(e = this.peek() || 0) || 47 === e) ? null : (this.bump(), "<");
      var e;
    }, e.prototype.tryParseQuote = function (e) {
      if (this.isEOF() || 39 !== this.char()) return null;
      switch (this.peek()) {
        case 39:
          return this.bump(), this.bump(), "'";
        case 123:
        case 60:
        case 62:
        case 125:
          break;
        case 35:
          if ("plural" === e || "selectordinal" === e) break;
          return null;
        default:
          return null;
      }
      this.bump();
      var t = [this.char()];
      for (this.bump(); !this.isEOF();) {
        var i = this.char();
        if (39 === i) {
          if (39 !== this.peek()) {
            this.bump();
            break;
          }
          t.push(39), this.bump();
        } else t.push(i);
        this.bump();
      }
      return Et.apply(void 0, t);
    }, e.prototype.tryParseUnquoted = function (e, t) {
      if (this.isEOF()) return null;
      var i = this.char();
      return 60 === i || 123 === i || 35 === i && ("plural" === t || "selectordinal" === t) || 125 === i && e > 0 ? null : (this.bump(), Et(i));
    }, e.prototype.parseArgument = function (e, t) {
      var i = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(Se.EXPECT_ARGUMENT_CLOSING_BRACE, ct(i, this.clonePosition()));
      if (125 === this.char()) return this.bump(), this.error(Se.EMPTY_ARGUMENT, ct(i, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r) return this.error(Se.MALFORMED_ARGUMENT, ct(i, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF()) return this.error(Se.EXPECT_ARGUMENT_CLOSING_BRACE, ct(i, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: Be.argument,
              value: r,
              location: ct(i, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(Se.EXPECT_ARGUMENT_CLOSING_BRACE, ct(i, this.clonePosition())) : this.parseArgumentOptions(e, t, r, i);
        default:
          return this.error(Se.MALFORMED_ARGUMENT, ct(i, this.clonePosition()));
      }
    }, e.prototype.parseIdentifierIfPossible = function () {
      var e = this.clonePosition(),
        t = this.offset(),
        i = bt(this.message, t),
        r = t + i.length;
      return this.bumpTo(r), {
        value: i,
        location: ct(e, this.clonePosition())
      };
    }, e.prototype.parseArgumentOptions = function (e, t, i, n) {
      var s,
        o = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        h = this.clonePosition();
      switch (a) {
        case "":
          return this.error(Se.EXPECT_ARGUMENT_TYPE, ct(o, h));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var l = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var c = this.clonePosition();
            if ((m = this.parseSimpleArgStyleIfPossible()).err) return m;
            if (0 === (f = Ht(m.val)).length) return this.error(Se.EXPECT_ARGUMENT_STYLE, ct(this.clonePosition(), this.clonePosition()));
            l = {
              style: f,
              styleLocation: ct(c, this.clonePosition())
            };
          }
          if ((b = this.tryParseArgumentClose(n)).err) return b;
          var u = ct(n, this.clonePosition());
          if (l && yt(null == l ? void 0 : l.style, "::", 0)) {
            var p = wt(l.style.slice(2));
            if ("number" === a) return (m = this.parseNumberSkeletonFromString(p, l.styleLocation)).err ? m : {
              val: {
                type: Be.number,
                value: i,
                location: u,
                style: m.val
              },
              err: null
            };
            if (0 === p.length) return this.error(Se.EXPECT_DATE_TIME_SKELETON, u);
            var d = p;
            this.locale && (d = function (e, t) {
              for (var i = "", r = 0; r < e.length; r++) {
                var n = e.charAt(r);
                if ("j" === n) {
                  for (var s = 0; r + 1 < e.length && e.charAt(r + 1) === n;) s++, r++;
                  var o = 1 + (1 & s),
                    a = s < 2 ? 1 : 3 + (s >> 1),
                    h = at(t);
                  for ("H" != h && "k" != h || (a = 0); a-- > 0;) i += "a";
                  for (; o-- > 0;) i = h + i;
                } else i += "J" === n ? "H" : n;
              }
              return i;
            }(p, this.locale));
            var f = {
              type: Ie.dateTime,
              pattern: d,
              location: l.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? We(d) : {}
            };
            return {
              val: {
                type: "date" === a ? Be.date : Be.time,
                value: i,
                location: u,
                style: f
              },
              err: null
            };
          }
          return {
            val: {
              type: "number" === a ? Be.number : "date" === a ? Be.date : Be.time,
              value: i,
              location: u,
              style: null !== (s = null == l ? void 0 : l.style) && void 0 !== s ? s : null
            },
            err: null
          };
        case "plural":
        case "selectordinal":
        case "select":
          var _ = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(",")) return this.error(Se.EXPECT_SELECT_ARGUMENT_OPTIONS, ct(_, r({}, _)));
          this.bumpSpace();
          var g = this.parseIdentifierIfPossible(),
            v = 0;
          if ("select" !== a && "offset" === g.value) {
            if (!this.bumpIf(":")) return this.error(Se.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ct(this.clonePosition(), this.clonePosition()));
            var m;
            if (this.bumpSpace(), (m = this.tryParseDecimalInteger(Se.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, Se.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err) return m;
            this.bumpSpace(), g = this.parseIdentifierIfPossible(), v = m.val;
          }
          var b,
            y = this.tryParsePluralOrSelectOptions(e, a, t, g);
          if (y.err) return y;
          if ((b = this.tryParseArgumentClose(n)).err) return b;
          var E = ct(n, this.clonePosition());
          return "select" === a ? {
            val: {
              type: Be.select,
              value: i,
              options: At(y.val),
              location: E
            },
            err: null
          } : {
            val: {
              type: Be.plural,
              value: i,
              options: At(y.val),
              offset: v,
              pluralType: "plural" === a ? "cardinal" : "ordinal",
              location: E
            },
            err: null
          };
        default:
          return this.error(Se.INVALID_ARGUMENT_TYPE, ct(o, h));
      }
    }, e.prototype.tryParseArgumentClose = function (e) {
      return this.isEOF() || 125 !== this.char() ? this.error(Se.EXPECT_ARGUMENT_CLOSING_BRACE, ct(e, this.clonePosition())) : (this.bump(), {
        val: !0,
        err: null
      });
    }, e.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var e = 0, t = this.clonePosition(); !this.isEOF();) {
        switch (this.char()) {
          case 39:
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'")) return this.error(Se.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, ct(i, this.clonePosition()));
            this.bump();
            break;
          case 123:
            e += 1, this.bump();
            break;
          case 125:
            if (!(e > 0)) return {
              val: this.message.slice(t.offset, this.offset()),
              err: null
            };
            e -= 1;
            break;
          default:
            this.bump();
        }
      }
      return {
        val: this.message.slice(t.offset, this.offset()),
        err: null
      };
    }, e.prototype.parseNumberSkeletonFromString = function (e, t) {
      var i = [];
      try {
        i = function (e) {
          if (0 === e.length) throw new Error("Number skeleton cannot be empty");
          for (var t = e.split(Ye).filter(function (e) {
              return e.length > 0;
            }), i = [], r = 0, n = t; r < n.length; r++) {
            var s = n[r].split("/");
            if (0 === s.length) throw new Error("Invalid number skeleton");
            for (var o = s[0], a = s.slice(1), h = 0, l = a; h < l.length; h++) if (0 === l[h].length) throw new Error("Invalid number skeleton");
            i.push({
              stem: o,
              options: a
            });
          }
          return i;
        }(e);
      } catch (e) {
        return this.error(Se.INVALID_NUMBER_SKELETON, t);
      }
      return {
        val: {
          type: Ie.number,
          tokens: i,
          location: t,
          parsedOptions: this.shouldParseSkeletons ? nt(i) : {}
        },
        err: null
      };
    }, e.prototype.tryParsePluralOrSelectOptions = function (e, t, i, r) {
      for (var n, s = !1, o = [], a = new Set(), h = r.value, l = r.location;;) {
        if (0 === h.length) {
          var c = this.clonePosition();
          if ("select" === t || !this.bumpIf("=")) break;
          var u = this.tryParseDecimalInteger(Se.EXPECT_PLURAL_ARGUMENT_SELECTOR, Se.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (u.err) return u;
          l = ct(c, this.clonePosition()), h = this.message.slice(c.offset, this.offset());
        }
        if (a.has(h)) return this.error("select" === t ? Se.DUPLICATE_SELECT_ARGUMENT_SELECTOR : Se.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
        "other" === h && (s = !0), this.bumpSpace();
        var p = this.clonePosition();
        if (!this.bumpIf("{")) return this.error("select" === t ? Se.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : Se.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, ct(this.clonePosition(), this.clonePosition()));
        var d = this.parseMessage(e + 1, t, i);
        if (d.err) return d;
        var f = this.tryParseArgumentClose(p);
        if (f.err) return f;
        o.push([h, {
          value: d.val,
          location: ct(p, this.clonePosition())
        }]), a.add(h), this.bumpSpace(), h = (n = this.parseIdentifierIfPossible()).value, l = n.location;
      }
      return 0 === o.length ? this.error("select" === t ? Se.EXPECT_SELECT_ARGUMENT_SELECTOR : Se.EXPECT_PLURAL_ARGUMENT_SELECTOR, ct(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !s ? this.error(Se.MISSING_OTHER_CLAUSE, ct(this.clonePosition(), this.clonePosition())) : {
        val: o,
        err: null
      };
    }, e.prototype.tryParseDecimalInteger = function (e, t) {
      var i = 1,
        r = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (i = -1);
      for (var n = !1, s = 0; !this.isEOF();) {
        var o = this.char();
        if (!(o >= 48 && o <= 57)) break;
        n = !0, s = 10 * s + (o - 48), this.bump();
      }
      var a = ct(r, this.clonePosition());
      return n ? vt(s *= i) ? {
        val: s,
        err: null
      } : this.error(t, a) : this.error(e, a);
    }, e.prototype.offset = function () {
      return this.position.offset;
    }, e.prototype.isEOF = function () {
      return this.offset() === this.message.length;
    }, e.prototype.clonePosition = function () {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }, e.prototype.char = function () {
      var e = this.position.offset;
      if (e >= this.message.length) throw Error("out of bound");
      var t = Pt(this.message, e);
      if (void 0 === t) throw Error("Offset ".concat(e, " is at invalid UTF-16 code unit boundary"));
      return t;
    }, e.prototype.error = function (e, t) {
      return {
        val: null,
        err: {
          kind: e,
          message: this.message,
          location: t
        }
      };
    }, e.prototype.bump = function () {
      if (!this.isEOF()) {
        var e = this.char();
        10 === e ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += e < 65536 ? 1 : 2);
      }
    }, e.prototype.bumpIf = function (e) {
      if (yt(this.message, e, this.offset())) {
        for (var t = 0; t < e.length; t++) this.bump();
        return !0;
      }
      return !1;
    }, e.prototype.bumpUntil = function (e) {
      var t = this.offset(),
        i = this.message.indexOf(e, t);
      return i >= 0 ? (this.bumpTo(i), !0) : (this.bumpTo(this.message.length), !1);
    }, e.prototype.bumpTo = function (e) {
      if (this.offset() > e) throw Error("targetOffset ".concat(e, " must be greater than or equal to the current offset ").concat(this.offset()));
      for (e = Math.min(e, this.message.length);;) {
        var t = this.offset();
        if (t === e) break;
        if (t > e) throw Error("targetOffset ".concat(e, " is at invalid UTF-16 code unit boundary"));
        if (this.bump(), this.isEOF()) break;
      }
    }, e.prototype.bumpSpace = function () {
      for (; !this.isEOF() && Ct(this.char());) this.bump();
    }, e.prototype.peek = function () {
      if (this.isEOF()) return null;
      var e = this.char(),
        t = this.offset(),
        i = this.message.charCodeAt(t + (e >= 65536 ? 2 : 1));
      return null != i ? i : null;
    }, e;
  }();
  function Bt(e) {
    return e >= 97 && e <= 122 || e >= 65 && e <= 90;
  }
  function It(e) {
    return 45 === e || 46 === e || e >= 48 && e <= 57 || 95 === e || e >= 97 && e <= 122 || e >= 65 && e <= 90 || 183 == e || e >= 192 && e <= 214 || e >= 216 && e <= 246 || e >= 248 && e <= 893 || e >= 895 && e <= 8191 || e >= 8204 && e <= 8205 || e >= 8255 && e <= 8256 || e >= 8304 && e <= 8591 || e >= 11264 && e <= 12271 || e >= 12289 && e <= 55295 || e >= 63744 && e <= 64975 || e >= 65008 && e <= 65533 || e >= 65536 && e <= 983039;
  }
  function Ct(e) {
    return e >= 9 && e <= 13 || 32 === e || 133 === e || e >= 8206 && e <= 8207 || 8232 === e || 8233 === e;
  }
  function Dt(e) {
    return e >= 33 && e <= 35 || 36 === e || e >= 37 && e <= 39 || 40 === e || 41 === e || 42 === e || 43 === e || 44 === e || 45 === e || e >= 46 && e <= 47 || e >= 58 && e <= 59 || e >= 60 && e <= 62 || e >= 63 && e <= 64 || 91 === e || 92 === e || 93 === e || 94 === e || 96 === e || 123 === e || 124 === e || 125 === e || 126 === e || 161 === e || e >= 162 && e <= 165 || 166 === e || 167 === e || 169 === e || 171 === e || 172 === e || 174 === e || 176 === e || 177 === e || 182 === e || 187 === e || 191 === e || 215 === e || 247 === e || e >= 8208 && e <= 8213 || e >= 8214 && e <= 8215 || 8216 === e || 8217 === e || 8218 === e || e >= 8219 && e <= 8220 || 8221 === e || 8222 === e || 8223 === e || e >= 8224 && e <= 8231 || e >= 8240 && e <= 8248 || 8249 === e || 8250 === e || e >= 8251 && e <= 8254 || e >= 8257 && e <= 8259 || 8260 === e || 8261 === e || 8262 === e || e >= 8263 && e <= 8273 || 8274 === e || 8275 === e || e >= 8277 && e <= 8286 || e >= 8592 && e <= 8596 || e >= 8597 && e <= 8601 || e >= 8602 && e <= 8603 || e >= 8604 && e <= 8607 || 8608 === e || e >= 8609 && e <= 8610 || 8611 === e || e >= 8612 && e <= 8613 || 8614 === e || e >= 8615 && e <= 8621 || 8622 === e || e >= 8623 && e <= 8653 || e >= 8654 && e <= 8655 || e >= 8656 && e <= 8657 || 8658 === e || 8659 === e || 8660 === e || e >= 8661 && e <= 8691 || e >= 8692 && e <= 8959 || e >= 8960 && e <= 8967 || 8968 === e || 8969 === e || 8970 === e || 8971 === e || e >= 8972 && e <= 8991 || e >= 8992 && e <= 8993 || e >= 8994 && e <= 9e3 || 9001 === e || 9002 === e || e >= 9003 && e <= 9083 || 9084 === e || e >= 9085 && e <= 9114 || e >= 9115 && e <= 9139 || e >= 9140 && e <= 9179 || e >= 9180 && e <= 9185 || e >= 9186 && e <= 9254 || e >= 9255 && e <= 9279 || e >= 9280 && e <= 9290 || e >= 9291 && e <= 9311 || e >= 9472 && e <= 9654 || 9655 === e || e >= 9656 && e <= 9664 || 9665 === e || e >= 9666 && e <= 9719 || e >= 9720 && e <= 9727 || e >= 9728 && e <= 9838 || 9839 === e || e >= 9840 && e <= 10087 || 10088 === e || 10089 === e || 10090 === e || 10091 === e || 10092 === e || 10093 === e || 10094 === e || 10095 === e || 10096 === e || 10097 === e || 10098 === e || 10099 === e || 10100 === e || 10101 === e || e >= 10132 && e <= 10175 || e >= 10176 && e <= 10180 || 10181 === e || 10182 === e || e >= 10183 && e <= 10213 || 10214 === e || 10215 === e || 10216 === e || 10217 === e || 10218 === e || 10219 === e || 10220 === e || 10221 === e || 10222 === e || 10223 === e || e >= 10224 && e <= 10239 || e >= 10240 && e <= 10495 || e >= 10496 && e <= 10626 || 10627 === e || 10628 === e || 10629 === e || 10630 === e || 10631 === e || 10632 === e || 10633 === e || 10634 === e || 10635 === e || 10636 === e || 10637 === e || 10638 === e || 10639 === e || 10640 === e || 10641 === e || 10642 === e || 10643 === e || 10644 === e || 10645 === e || 10646 === e || 10647 === e || 10648 === e || e >= 10649 && e <= 10711 || 10712 === e || 10713 === e || 10714 === e || 10715 === e || e >= 10716 && e <= 10747 || 10748 === e || 10749 === e || e >= 10750 && e <= 11007 || e >= 11008 && e <= 11055 || e >= 11056 && e <= 11076 || e >= 11077 && e <= 11078 || e >= 11079 && e <= 11084 || e >= 11085 && e <= 11123 || e >= 11124 && e <= 11125 || e >= 11126 && e <= 11157 || 11158 === e || e >= 11159 && e <= 11263 || e >= 11776 && e <= 11777 || 11778 === e || 11779 === e || 11780 === e || 11781 === e || e >= 11782 && e <= 11784 || 11785 === e || 11786 === e || 11787 === e || 11788 === e || 11789 === e || e >= 11790 && e <= 11798 || 11799 === e || e >= 11800 && e <= 11801 || 11802 === e || 11803 === e || 11804 === e || 11805 === e || e >= 11806 && e <= 11807 || 11808 === e || 11809 === e || 11810 === e || 11811 === e || 11812 === e || 11813 === e || 11814 === e || 11815 === e || 11816 === e || 11817 === e || e >= 11818 && e <= 11822 || 11823 === e || e >= 11824 && e <= 11833 || e >= 11834 && e <= 11835 || e >= 11836 && e <= 11839 || 11840 === e || 11841 === e || 11842 === e || e >= 11843 && e <= 11855 || e >= 11856 && e <= 11857 || 11858 === e || e >= 11859 && e <= 11903 || e >= 12289 && e <= 12291 || 12296 === e || 12297 === e || 12298 === e || 12299 === e || 12300 === e || 12301 === e || 12302 === e || 12303 === e || 12304 === e || 12305 === e || e >= 12306 && e <= 12307 || 12308 === e || 12309 === e || 12310 === e || 12311 === e || 12312 === e || 12313 === e || 12314 === e || 12315 === e || 12316 === e || 12317 === e || e >= 12318 && e <= 12319 || 12320 === e || 12336 === e || 64830 === e || 64831 === e || e >= 65093 && e <= 65094;
  }
  function Nt(e) {
    e.forEach(function (e) {
      if (delete e.location, ke(e) || Ge(e)) for (var t in e.options) delete e.options[t].location, Nt(e.options[t].value);else Ue(e) && Ve(e.style) || (Me(e) || xe(e)) && ze(e.style) ? delete e.style.location : je(e) && Nt(e.children);
    });
  }
  function Lt(e, t) {
    void 0 === t && (t = {}), t = r({
      shouldParseSkeletons: !0,
      requiresOtherClause: !0
    }, t);
    var i = new St(e, t).parse();
    if (i.err) {
      var n = SyntaxError(Se[i.err.kind]);
      throw n.location = i.err.location, n.originalMessage = i.err.message, n;
    }
    return (null == t ? void 0 : t.captureLocation) || Nt(i.val), i.val;
  }
  function Ot(e, t) {
    var i = t && t.cache ? t.cache : jt,
      r = t && t.serializer ? t.serializer : kt;
    return (t && t.strategy ? t.strategy : xt)(e, {
      cache: i,
      serializer: r
    });
  }
  function Rt(e, t, i, r) {
    var n,
      s = null == (n = r) || "number" == typeof n || "boolean" == typeof n ? r : i(r),
      o = t.get(s);
    return void 0 === o && (o = e.call(this, r), t.set(s, o)), o;
  }
  function Ut(e, t, i) {
    var r = Array.prototype.slice.call(arguments, 3),
      n = i(r),
      s = t.get(n);
    return void 0 === s && (s = e.apply(this, r), t.set(n, s)), s;
  }
  function Mt(e, t, i, r, n) {
    return i.bind(t, e, r, n);
  }
  function xt(e, t) {
    return Mt(e, this, 1 === e.length ? Rt : Ut, t.cache.create(), t.serializer);
  }
  var kt = function () {
    return JSON.stringify(arguments);
  };
  function Gt() {
    this.cache = Object.create(null);
  }
  Gt.prototype.get = function (e) {
    return this.cache[e];
  }, Gt.prototype.set = function (e, t) {
    this.cache[e] = t;
  };
  var Ft,
    jt = {
      create: function () {
        return new Gt();
      }
    },
    Vt = {
      variadic: function (e, t) {
        return Mt(e, this, Ut, t.cache.create(), t.serializer);
      },
      monadic: function (e, t) {
        return Mt(e, this, Rt, t.cache.create(), t.serializer);
      }
    };
  !function (e) {
    e.MISSING_VALUE = "MISSING_VALUE", e.INVALID_VALUE = "INVALID_VALUE", e.MISSING_INTL_API = "MISSING_INTL_API";
  }(Ft || (Ft = {}));
  var zt,
    Xt = function (e) {
      function t(t, i, r) {
        var n = e.call(this, t) || this;
        return n.code = i, n.originalMessage = r, n;
      }
      return i(t, e), t.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }, t;
    }(Error),
    Kt = function (e) {
      function t(t, i, r, n) {
        return e.call(this, 'Invalid values for "'.concat(t, '": "').concat(i, '". Options are "').concat(Object.keys(r).join('", "'), '"'), Ft.INVALID_VALUE, n) || this;
      }
      return i(t, e), t;
    }(Xt),
    Wt = function (e) {
      function t(t, i, r) {
        return e.call(this, 'Value for "'.concat(t, '" must be of type ').concat(i), Ft.INVALID_VALUE, r) || this;
      }
      return i(t, e), t;
    }(Xt),
    Yt = function (e) {
      function t(t, i) {
        return e.call(this, 'The intl string context variable "'.concat(t, '" was not provided to the string "').concat(i, '"'), Ft.MISSING_VALUE, i) || this;
      }
      return i(t, e), t;
    }(Xt);
  function Zt(e) {
    return "function" == typeof e;
  }
  function qt(e, t, i, r, n, s, o) {
    if (1 === e.length && Oe(e[0])) return [{
      type: zt.literal,
      value: e[0].value
    }];
    for (var a = [], h = 0, l = e; h < l.length; h++) {
      var c = l[h];
      if (Oe(c)) a.push({
        type: zt.literal,
        value: c.value
      });else if (Fe(c)) "number" == typeof s && a.push({
        type: zt.literal,
        value: i.getNumberFormat(t).format(s)
      });else {
        var u = c.value;
        if (!n || !(u in n)) throw new Yt(u, o);
        var p = n[u];
        if (Re(c)) p && "string" != typeof p && "number" != typeof p || (p = "string" == typeof p || "number" == typeof p ? String(p) : ""), a.push({
          type: "string" == typeof p ? zt.literal : zt.object,
          value: p
        });else if (Me(c)) {
          var d = "string" == typeof c.style ? r.date[c.style] : ze(c.style) ? c.style.parsedOptions : void 0;
          a.push({
            type: zt.literal,
            value: i.getDateTimeFormat(t, d).format(p)
          });
        } else if (xe(c)) {
          d = "string" == typeof c.style ? r.time[c.style] : ze(c.style) ? c.style.parsedOptions : r.time.medium;
          a.push({
            type: zt.literal,
            value: i.getDateTimeFormat(t, d).format(p)
          });
        } else if (Ue(c)) {
          (d = "string" == typeof c.style ? r.number[c.style] : Ve(c.style) ? c.style.parsedOptions : void 0) && d.scale && (p *= d.scale || 1), a.push({
            type: zt.literal,
            value: i.getNumberFormat(t, d).format(p)
          });
        } else {
          if (je(c)) {
            var f = c.children,
              _ = c.value,
              g = n[_];
            if (!Zt(g)) throw new Wt(_, "function", o);
            var v = g(qt(f, t, i, r, n, s).map(function (e) {
              return e.value;
            }));
            Array.isArray(v) || (v = [v]), a.push.apply(a, v.map(function (e) {
              return {
                type: "string" == typeof e ? zt.literal : zt.object,
                value: e
              };
            }));
          }
          if (ke(c)) {
            if (!(m = c.options[p] || c.options.other)) throw new Kt(c.value, p, Object.keys(c.options), o);
            a.push.apply(a, qt(m.value, t, i, r, n));
          } else if (Ge(c)) {
            var m;
            if (!(m = c.options["=".concat(p)])) {
              if (!Intl.PluralRules) throw new Xt('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', Ft.MISSING_INTL_API, o);
              var b = i.getPluralRules(t, {
                type: c.pluralType
              }).select(p - (c.offset || 0));
              m = c.options[b] || c.options.other;
            }
            if (!m) throw new Kt(c.value, p, Object.keys(c.options), o);
            a.push.apply(a, qt(m.value, t, i, r, n, p - (c.offset || 0)));
          } else ;
        }
      }
    }
    return function (e) {
      return e.length < 2 ? e : e.reduce(function (e, t) {
        var i = e[e.length - 1];
        return i && i.type === zt.literal && t.type === zt.literal ? i.value += t.value : e.push(t), e;
      }, []);
    }(a);
  }
  function Jt(e, t) {
    return t ? Object.keys(e).reduce(function (i, n) {
      var s, o;
      return i[n] = (s = e[n], (o = t[n]) ? r(r(r({}, s || {}), o || {}), Object.keys(s).reduce(function (e, t) {
        return e[t] = r(r({}, s[t]), o[t] || {}), e;
      }, {})) : s), i;
    }, r({}, e)) : e;
  }
  function Qt(e) {
    return {
      create: function () {
        return {
          get: function (t) {
            return e[t];
          },
          set: function (t, i) {
            e[t] = i;
          }
        };
      }
    };
  }
  !function (e) {
    e[e.literal = 0] = "literal", e[e.object = 1] = "object";
  }(zt || (zt = {}));
  var ei = function () {
      function e(t, i, n, o) {
        var a,
          h = this;
        if (void 0 === i && (i = e.defaultLocale), this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }, this.format = function (e) {
          var t = h.formatToParts(e);
          if (1 === t.length) return t[0].value;
          var i = t.reduce(function (e, t) {
            return e.length && t.type === zt.literal && "string" == typeof e[e.length - 1] ? e[e.length - 1] += t.value : e.push(t.value), e;
          }, []);
          return i.length <= 1 ? i[0] || "" : i;
        }, this.formatToParts = function (e) {
          return qt(h.ast, h.locales, h.formatters, h.formats, e, void 0, h.message);
        }, this.resolvedOptions = function () {
          var e;
          return {
            locale: (null === (e = h.resolvedLocale) || void 0 === e ? void 0 : e.toString()) || Intl.NumberFormat.supportedLocalesOf(h.locales)[0]
          };
        }, this.getAst = function () {
          return h.ast;
        }, this.locales = i, this.resolvedLocale = e.resolveLocale(i), "string" == typeof t) {
          if (this.message = t, !e.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
          var l = o || {};
          l.formatters;
          var c = function (e, t) {
            var i = {};
            for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (i[r] = e[r]);
            if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
              var n = 0;
              for (r = Object.getOwnPropertySymbols(e); n < r.length; n++) t.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[n]) && (i[r[n]] = e[r[n]]);
            }
            return i;
          }(l, ["formatters"]);
          this.ast = e.__parse(t, r(r({}, c), {
            locale: this.resolvedLocale
          }));
        } else this.ast = t;
        if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
        this.formats = Jt(e.formats, n), this.formatters = o && o.formatters || (void 0 === (a = this.formatterCache) && (a = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }), {
          getNumberFormat: Ot(function () {
            for (var e, t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
            return new ((e = Intl.NumberFormat).bind.apply(e, s([void 0], t, !1)))();
          }, {
            cache: Qt(a.number),
            strategy: Vt.variadic
          }),
          getDateTimeFormat: Ot(function () {
            for (var e, t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
            return new ((e = Intl.DateTimeFormat).bind.apply(e, s([void 0], t, !1)))();
          }, {
            cache: Qt(a.dateTime),
            strategy: Vt.variadic
          }),
          getPluralRules: Ot(function () {
            for (var e, t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
            return new ((e = Intl.PluralRules).bind.apply(e, s([void 0], t, !1)))();
          }, {
            cache: Qt(a.pluralRules),
            strategy: Vt.variadic
          })
        });
      }
      return Object.defineProperty(e, "defaultLocale", {
        get: function () {
          return e.memoizedDefaultLocale || (e.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale), e.memoizedDefaultLocale;
        },
        enumerable: !1,
        configurable: !0
      }), e.memoizedDefaultLocale = null, e.resolveLocale = function (e) {
        if (void 0 !== Intl.Locale) {
          var t = Intl.NumberFormat.supportedLocalesOf(e);
          return t.length > 0 ? new Intl.Locale(t[0]) : new Intl.Locale("string" == typeof e ? e : e[0]);
        }
      }, e.__parse = Lt, e.formats = {
        number: {
          integer: {
            maximumFractionDigits: 0
          },
          currency: {
            style: "currency"
          },
          percent: {
            style: "percent"
          }
        },
        date: {
          short: {
            month: "numeric",
            day: "numeric",
            year: "2-digit"
          },
          medium: {
            month: "short",
            day: "numeric",
            year: "numeric"
          },
          long: {
            month: "long",
            day: "numeric",
            year: "numeric"
          },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
          }
        },
        time: {
          short: {
            hour: "numeric",
            minute: "numeric"
          },
          medium: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short"
          }
        }
      }, e;
    }(),
    ti = ei,
    ii = {
      en: Le
    };
  function ri(e, t, ...i) {
    const r = t.replace(/['"]+/g, "");
    var n;
    try {
      n = e.split(".").reduce((e, t) => e[t], ii[r]);
    } catch (t) {
      n = e.split(".").reduce((e, t) => e[t], ii.en);
    }
    if (void 0 === n && (n = e.split(".").reduce((e, t) => e[t], ii.en)), !i.length) return n;
    const s = {};
    for (let e = 0; e < i.length; e += 2) {
      let t = i[e];
      t = t.replace(/^{([^}]+)?}$/, "$1"), s[t] = i[e + 1];
    }
    try {
      return new ti(n, t).format(s);
    } catch (e) {
      return "Translation " + e;
    }
  }
  let ni = class extends ce {
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterID") && (this.printerEntities = Ae(this.hass, this.selectedPrinterID));
    }
    _renderInfoRow(e, t) {
      return K`
      <div class="info-row">
        <span class="info-heading">
          ${ri(`panels.main.cards.main.fields.${e}.heading`, this.hass.language)}:</span
        >
        <span class="info-detail">${t}</span>
      </div>
    `;
    }
    _renderOptionalInfoRow(e, t, i) {
      return e ? this._renderInfoRow(t, i) : null;
    }
    render() {
      const e = (t = this.selectedPrinterDevice) ? t.hw_version.split("Printer ID: ")[1] : void 0;
      var t;
      const i = function (e) {
          return e && e.connections.length > 0 && e.connections[0].length > 1 ? e.connections[0][1] : null;
        }(this.selectedPrinterDevice),
        r = function (e) {
          for (const t in e) {
            const e = t.split("."),
              i = e[0],
              r = e[1];
            if ("binary_sensor" === i && r.endsWith("printer_online")) return r.split("printer_online")[0];
          }
        }(this.printerEntities),
        n = we(this.printerEntities, r, "sensor", "ace_fw_version"),
        s = we(this.printerEntities, r, "binary_sensor", "drying_active"),
        o = we(this.printerEntities, r, "sensor", "drying_remaining_time"),
        a = we(this.printerEntities, r, "sensor", "drying_total_duration"),
        h = we(this.printerEntities, r, "binary_sensor", "ace_firmware_update_available"),
        l = we(this.printerEntities, r, "binary_sensor", "firmware_update_available"),
        c = we(this.printerEntities, r, "binary_sensor", "is_available"),
        u = we(this.printerEntities, r, "binary_sensor", "printer_online"),
        p = we(this.printerEntities, r, "sensor", "nozzle_temperature"),
        d = we(this.printerEntities, r, "sensor", "hotbed_temperature"),
        f = we(this.printerEntities, r, "sensor", "target_nozzle_temperature"),
        _ = we(this.printerEntities, r, "sensor", "target_hotbed_temperature"),
        g = we(this.printerEntities, r, "sensor", "project_progress"),
        v = we(this.printerEntities, r, "sensor", "print_state"),
        m = Ee(this.hass, l, "Update Available", "Up To Date"),
        b = Ee(this.hass, c, "Available", "Busy"),
        y = Ee(this.hass, u, "Online", "Offline"),
        E = be(this.hass, p),
        A = be(this.hass, d),
        P = be(this.hass, f),
        w = be(this.hass, _),
        H = be(this.hass, g),
        T = ye(this.hass, v),
        $ = Ee(this.hass, h, "Update Available", "Up To Date"),
        S = Ee(this.hass, s, "Drying", "Not Drying"),
        B = ye(this.hass, n),
        I = be(this.hass, o),
        C = be(this.hass, a),
        D = (C > 0 ? Math.round(1e4 * (1 - I / C)) / 100 : 0).toFixed(2);
      return K`
      <printer-card elevation="2">
        ${this._renderInfoRow("printer_name", this.selectedPrinterDevice ? this.selectedPrinterDevice.name : null)}
        ${this._renderInfoRow("printer_id", e)}
        ${this._renderInfoRow("printer_mac", i)}
        ${this._renderInfoRow("printer_model", this.selectedPrinterDevice ? this.selectedPrinterDevice.model : null)}
        ${this._renderInfoRow("printer_fw_version", this.selectedPrinterDevice ? this.selectedPrinterDevice.sw_version : null)}
        ${this._renderInfoRow("printer_fw_update_available", m)}
        ${this._renderInfoRow("printer_online", y)}
        ${this._renderInfoRow("printer_available", b)}
        ${this._renderInfoRow("curr_nozzle_temp", E)}
        ${this._renderInfoRow("curr_hotbed_temp", A)}
        ${this._renderInfoRow("target_nozzle_temp", P)}
        ${this._renderInfoRow("target_hotbed_temp", w)}
        ${this._renderInfoRow("print_state", (N = T, N.toLowerCase().split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")))}
        ${this._renderInfoRow("project_progress", `${H}%`)}
        ${this._renderOptionalInfoRow(n, "ace_fw_version", B)}
        ${this._renderOptionalInfoRow(h, "ace_fw_update_available", $)}
        ${this._renderOptionalInfoRow(s, "drying_active", S)}
        ${this._renderOptionalInfoRow(o, "drying_progress", `${D}%`)}
      </printer-card>
    `;
      var N;
    }
    static get styles() {
      return u`
      :host {
        padding: 16px;
        display: block;
      }
      printer-card {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 600px;
        margin: 0 auto;
      }

      .info-row {
        margin-bottom: 6px;
      }

      .info-heading {
        margin-right: 10px;
        font-size: 0.85em;
      }

      .info-detail {
        font-weight: 700;
      }
    `;
    }
  };
  n([_e()], ni.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], ni.prototype, "narrow", void 0), n([_e()], ni.prototype, "route", void 0), n([_e()], ni.prototype, "panel", void 0), n([_e()], ni.prototype, "selectedPrinterID", void 0), n([_e()], ni.prototype, "selectedPrinterDevice", void 0), n([ge()], ni.prototype, "printerEntities", void 0), ni = n([pe("anycubic-view-main")], ni);
  const si = "anycubic_cloud",
    oi = u`
  .files-card {
    padding: 16px;
    display: block;
    font-size: 18px;
    margin: 0 auto;
    text-align: center;
  }

  .files-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
  }

  .file-info {
    display: flex;
    min-height: 20px;
    min-width: 250px;
    border: 2px solid #ccc3;
    border-radius: 16px;
    padding: 16px;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
    width: 100%;
    justify-content: space-around;
  }

  .file-name {
    display: block;
    line-height: 20px;
    text-align: center;
    font-weight: 900;
    margin: 6px;
  }

  .file-info:hover {
    background-color: #ccc3;
    border-color: #ccc9;
  }

  .file-refresh-button {
    padding: 10px;
    margin-bottom: 20px;
  }

  .file-refresh-icon {
    --mdc-icon-size: 50px;
  }

  .file-delete-button {
    padding: 4px;
    margin-left: 10px;
  }

  .file-delete-icon {
  }
`;
  let ai = class extends ce {
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterID") && (this.printerEntities = Ae(this.hass, this.selectedPrinterID));
    }
    render() {
      var e;
      const t = Pe(this.printerEntities, "sensor", "file_list_cloud");
      const i = function (e) {
          return Pe(e, "button", "request_file_list_cloud");
        }(this.printerEntities),
        r = t ? this.hass.states[t.entity_id] : void 0,
        n = r ? null === (e = r.attributes) || void 0 === e ? void 0 : e.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${e => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(e => K`
                  <li class="file-info">
                    <div class="file-name">${e.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${t => {
        this.deleteFile(e.id);
      }}"
                    >
                      <ha-icon
                        class="file-delete-icon"
                        icon="mdi:delete"
                      ></ha-icon>
                    </button>
                  </li>
                `) : null}
      </div>
    `;
    }
    refreshList(e) {
      e && this.hass.callService("button", "press", {
        entity_id: e.entity_id
      });
    }
    deleteFile(e) {
      this.selectedPrinterDevice && e && this.hass.callService(si, "delete_file_cloud", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        file_id: e
      });
    }
    static get styles() {
      return u`
      ${oi} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_e()], ai.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], ai.prototype, "narrow", void 0), n([_e()], ai.prototype, "route", void 0), n([_e()], ai.prototype, "panel", void 0), n([_e()], ai.prototype, "selectedPrinterID", void 0), n([_e()], ai.prototype, "selectedPrinterDevice", void 0), n([ge()], ai.prototype, "printerEntities", void 0), ai = n([pe("anycubic-view-files_cloud")], ai);
  let hi = class extends ce {
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterID") && (this.printerEntities = Ae(this.hass, this.selectedPrinterID));
    }
    render() {
      var e;
      const t = Pe(this.printerEntities, "sensor", "file_list_local");
      const i = function (e) {
          return Pe(e, "button", "request_file_list_local");
        }(this.printerEntities),
        r = t ? this.hass.states[t.entity_id] : void 0,
        n = r ? null === (e = r.attributes) || void 0 === e ? void 0 : e.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${e => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(e => K`
                  <li class="file-info">
                    <div class="file-name">${e.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${t => {
        this.deleteFile(e.name);
      }}"
                    >
                      <ha-icon
                        class="file-delete-icon"
                        icon="mdi:delete"
                      ></ha-icon>
                    </button>
                  </li>
                `) : null}
      </div>
    `;
    }
    refreshList(e) {
      e && this.hass.callService("button", "press", {
        entity_id: e.entity_id
      });
    }
    deleteFile(e) {
      this.selectedPrinterDevice && e && this.hass.callService(si, "delete_file_local", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: e
      });
    }
    static get styles() {
      return u`
      ${oi} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_e()], hi.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], hi.prototype, "narrow", void 0), n([_e()], hi.prototype, "route", void 0), n([_e()], hi.prototype, "panel", void 0), n([_e()], hi.prototype, "selectedPrinterID", void 0), n([_e()], hi.prototype, "selectedPrinterDevice", void 0), n([ge()], hi.prototype, "printerEntities", void 0), hi = n([pe("anycubic-view-files_local")], hi);
  let li = class extends ce {
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterID") && (this.printerEntities = Ae(this.hass, this.selectedPrinterID));
    }
    render() {
      var e;
      const t = Pe(this.printerEntities, "sensor", "file_list_udisk");
      const i = function (e) {
          return Pe(e, "button", "request_file_list_udisk");
        }(this.printerEntities),
        r = t ? this.hass.states[t.entity_id] : void 0,
        n = r ? null === (e = r.attributes) || void 0 === e ? void 0 : e.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${e => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(e => K`
                  <li class="file-info">
                    <div class="file-name">${e.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${t => {
        this.deleteFile(e.name);
      }}"
                    >
                      <ha-icon
                        class="file-delete-icon"
                        icon="mdi:delete"
                      ></ha-icon>
                    </button>
                  </li>
                `) : null}
      </div>
    `;
    }
    refreshList(e) {
      e && this.hass.callService("button", "press", {
        entity_id: e.entity_id
      });
    }
    deleteFile(e) {
      this.selectedPrinterDevice && e && this.hass.callService(si, "delete_file_udisk", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: e
      });
    }
    static get styles() {
      return u`
      ${oi} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_e()], li.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], li.prototype, "narrow", void 0), n([_e()], li.prototype, "route", void 0), n([_e()], li.prototype, "panel", void 0), n([_e()], li.prototype, "selectedPrinterID", void 0), n([_e()], li.prototype, "selectedPrinterDevice", void 0), n([ge()], li.prototype, "printerEntities", void 0), li = n([pe("anycubic-view-files_udisk")], li);
  var ci = "M8,5.14V19.14L19,12.14L8,5.14Z";
  const ui = async () => {
    var e, t, i, r, n, s, o;
    if (customElements.get("ha-service-control")) return;
    const a = document.createElement("partial-panel-resolver").getRoutes([{
      component_name: "developer-tools",
      url_path: "a"
    }]);
    await (null === (i = null === (t = null === (e = null == a ? void 0 : a.routes) || void 0 === e ? void 0 : e.a) || void 0 === t ? void 0 : t.load) || void 0 === i ? void 0 : i.call(t));
    const h = document.createElement("developer-tools-router");
    await (null === (o = null === (s = null === (n = null === (r = null == h ? void 0 : h.routerOptions) || void 0 === r ? void 0 : r.routes) || void 0 === n ? void 0 : n.service) || void 0 === s ? void 0 : s.load) || void 0 === o ? void 0 : o.call(s));
  };
  let pi = class extends ce {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_no_cloud_save",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await ui();
    }
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterDevice") && this.selectedPrinterDevice && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id
        })
      }));
    }
    render() {
      return K`
      <ac-print-view elevation="2">
        <ha-service-control
          hidePicker
          .hass=${this.hass}
          .value=${this._scriptData}
          .showAdvanced=${!0}
          .narrow=${this.narrow}
          @value-changed=${this._scriptDataChanged}
        ></ha-service-control>
        <ha-control-button
          class="print-button"
          @click=${this._runScript}
          .disabled=${!1}
        >
          <ha-svg-icon .path=${ci}></ha-svg-icon>
          ${ri("panels.print_no_cloud_save.actions.print", this.hass.language)}
        </ha-control-button>
      </ac-print-view>
    `;
    }
    static get styles() {
      return u`
      :host {
        padding: 16px;
        display: block;
      }
      ac-print-view {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .print-button {
        margin: auto;
        width: 200px;
        height: 60px;
      }
    `;
    }
    _scriptDataChanged(e) {
      this._scriptData = Object.assign(Object.assign({}, this._scriptData), e.detail.value);
    }
    async _runScript(e) {
      e.stopPropagation(), this.hass.callService("anycubic_cloud", "print_and_upload_no_cloud_save", this._scriptData.data);
    }
  };
  n([_e({
    attribute: !1
  })], pi.prototype, "hass", void 0), n([_e()], pi.prototype, "route", void 0), n([_e()], pi.prototype, "panel", void 0), n([_e()], pi.prototype, "selectedPrinterID", void 0), n([_e()], pi.prototype, "selectedPrinterDevice", void 0), n([ge()], pi.prototype, "_scriptData", void 0), n([ge()], pi.prototype, "narrow", void 0), pi = n([pe("anycubic-view-print-no_cloud_save")], pi);
  let di = class extends ce {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_save_in_cloud",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await ui();
    }
    willUpdate(e) {
      super.willUpdate(e), e.has("selectedPrinterDevice") && this.selectedPrinterDevice && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id
        })
      }));
    }
    render() {
      return K`
      <ac-print-view elevation="2">
        <ha-service-control
          hidePicker
          .hass=${this.hass}
          .value=${this._scriptData}
          .showAdvanced=${!0}
          .narrow=${this.narrow}
          @value-changed=${this._scriptDataChanged}
        ></ha-service-control>
        <ha-control-button
          class="print-button"
          @click=${this._runScript}
          .disabled=${!1}
        >
          <ha-svg-icon .path=${ci}></ha-svg-icon>
          ${ri("panels.print_save_in_cloud.actions.print", this.hass.language)}
        </ha-control-button>
      </ac-print-view>
    `;
    }
    static get styles() {
      return u`
      :host {
        padding: 16px;
        display: block;
      }
      ac-print-view {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .print-button {
        margin: auto;
        width: 200px;
        height: 60px;
      }
    `;
    }
    _scriptDataChanged(e) {
      this._scriptData = Object.assign(Object.assign({}, this._scriptData), e.detail.value);
    }
    async _runScript(e) {
      e.stopPropagation(), this.hass.callService("anycubic_cloud", "print_and_upload_save_in_cloud", this._scriptData.data);
    }
  };
  n([_e({
    attribute: !1
  })], di.prototype, "hass", void 0), n([_e()], di.prototype, "route", void 0), n([_e()], di.prototype, "panel", void 0), n([_e()], di.prototype, "selectedPrinterID", void 0), n([_e()], di.prototype, "selectedPrinterDevice", void 0), n([ge()], di.prototype, "_scriptData", void 0), n([ge()], di.prototype, "narrow", void 0), di = n([pe("anycubic-view-print-save_in_cloud")], di), e.AnycubicCloudPanel = class extends ce {
    constructor() {
      super(...arguments), this.selectedPage = "main";
    }
    async firstUpdated() {
      window.addEventListener("location-changed", () => {
        window.location.pathname.includes("anycubic-cloud") && this.requestUpdate();
      }), this.printers = await function (e) {
        const t = {};
        for (const i in e.devices) {
          const r = e.devices[i];
          "Anycubic" === r.manufacturer && (t[r.id] = r);
        }
        return t;
      }(this.hass), this.requestUpdate();
    }
    willUpdate(e) {
      var t, i;
      (super.willUpdate(e), e.has("route") || e.has("printers")) && (this.selectedPage = Te(this.route), this.selectedPrinterID = He(this.route), this.selectedPrinterDevice = (t = this.printers, i = this.selectedPrinterID, t && i ? t[i] : void 0));
    }
    render() {
      return this.getInitialView();
    }
    renderPrinterPage() {
      return K`
      <div class="header">
        ${this.renderToolbar()}
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${this.selectedPage}
          @iron-activate=${this.handlePageSelected}
        >
          <paper-tab page-name="main">
            ${ri("panels.main.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="local-files">
            ${ri("panels.files_local.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="udisk-files">
            ${ri("panels.files_udisk.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="cloud-files">
            ${ri("panels.files_cloud.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-no_cloud_save">
            ${ri("panels.print_no_cloud_save.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-save_in_cloud">
            ${ri("panels.print_save_in_cloud.title", this.hass.language)}
          </paper-tab>
          ${null}
        </ha-tabs>
      </div>
      <div class="view">${this.getView(this.route)}</div>
    `;
    }
    renderToolbar() {
      return K`
      <div class="toolbar">
        <ha-menu-button
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div class="main-title">${ri("title", this.hass.language)}</div>
        <div class="version">v${"0.0.3"}</div>
      </div>
    `;
    }
    getInitialView() {
      return this.selectedPrinterID ? this.renderPrinterPage() : K`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>
            ${ri("panels.initial.fields.printer_select.heading", this.hass.language)}
          </p>
          <ul class="printers-container">
            ${this.printers ? Object.keys(this.printers).map(e => K`<li
                      class="printer-select-box"
                      @click="${t => {
        this._handlePrinterClick(e);
      }}"
                    >
                      ${this.printers[e].name}
                    </li>`) : null}
          </ul>
        </printer-select>
      `;
    }
    getView(e) {
      switch (this.selectedPage) {
        case "local-files":
          return K`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_local>
        `;
        case "udisk-files":
          return K`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_udisk>
        `;
        case "cloud-files":
          return K`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_cloud>
        `;
        case "print-no_cloud_save":
          return K`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-no_cloud_save>
        `;
        case "print-save_in_cloud":
          return K`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-save_in_cloud>
        `;
        case "main":
          return K`
          <anycubic-view-main
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${e}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-main>
        `;
        case "debug":
          return K`
          <anycubic-view-debug
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${e}
            .panel=${this.panel}
            .printers=${this.printers}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-debug>
        `;
        default:
          return K`
          <ha-card header="Page not found">
            <div class="card-content">
              The page you are trying to reach cannot be found. Please select a
              page from the menu above to continue.
            </div>
          </ha-card>
        `;
      }
    }
    _handlePrinterClick(e) {
      ((e, t, i = !1) => {
        const r = t ? `${t}/main` : "",
          n = `${e.route.prefix}/${r}`;
        i ? history.replaceState(null, "", n) : history.pushState(null, "", n), ve(window, "location-changed", {
          replace: i
        });
      })(this, e), this.requestUpdate();
    }
    handlePageSelected(e) {
      const t = e.detail.item.getAttribute("page-name");
      t !== Te(this.route) ? (((e, t, i = !1) => {
        const r = He(e.route),
          n = r ? `${r}/${t}` : "",
          s = `${e.route.prefix}/${n}`;
        i ? history.replaceState(null, "", s) : history.pushState(null, "", s), ve(window, "location-changed", {
          replace: i
        });
      })(this, t), this.requestUpdate()) : scrollTo(0, 0);
    }
    static get styles() {
      return u`
      :host {
        padding: 16px;
        display: block;
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
      }
      .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
      }
      .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
      }
      ha-tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --paper-tabs-selection-bar-color: var(
          --app-header-selection-bar-color,
          var(--app-header-text-color, #fff)
        );
        text-transform: uppercase;
      }

      .version {
        font-size: 14px;
        font-weight: 500;
        color: rgba(var(--rgb-text-primary-color), 0.9);
      }

      printer-select {
        padding: 16px;
        display: block;
        font-size: 18px;
        max-width: 1024px;
        margin: 0 auto;
      }

      .view {
        height: calc(100vh - 112px);
        display: flex;
        justify-content: center;
      }

      .view > * {
        min-width: 600px;
        max-width: 1024px;
      }

      .view > *:last-child {
        margin-bottom: 20px;
      }

      .ac_wide_view {
        width: 100%;
      }

      .printers-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      .printer-select-box {
        cursor: pointer;
        display: block;
        min-height: 60px;
        min-width: 250px;
        border: 2px solid #ccc3;
        border-radius: 16px;
        padding: 16px;
        line-height: 60px;
        text-align: center;
        font-weight: 900;
      }

      .printer-select-box:hover {
        background-color: #ccc3;
        border-color: #ccc9;
      }
    `;
    }
  }, n([_e()], e.AnycubicCloudPanel.prototype, "hass", void 0), n([_e({
    type: Boolean,
    reflect: !0
  })], e.AnycubicCloudPanel.prototype, "narrow", void 0), n([_e()], e.AnycubicCloudPanel.prototype, "route", void 0), n([_e()], e.AnycubicCloudPanel.prototype, "panel", void 0), n([ge()], e.AnycubicCloudPanel.prototype, "printers", void 0), n([ge()], e.AnycubicCloudPanel.prototype, "selectedPage", void 0), n([ge()], e.AnycubicCloudPanel.prototype, "selectedPrinterID", void 0), n([ge()], e.AnycubicCloudPanel.prototype, "selectedPrinterDevice", void 0), e.AnycubicCloudPanel = n([pe("anycubic-cloud-panel")], e.AnycubicCloudPanel), Object.defineProperty(e, "__esModule", {
    value: !0
  });
}({});
