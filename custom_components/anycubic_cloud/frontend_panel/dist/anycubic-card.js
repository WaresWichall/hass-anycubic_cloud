!function (t) {
  var e = function (t, i) {
    return e = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
    }, e(t, i);
  };
  function i(t, i) {
    if ("function" != typeof i && null !== i) throw new TypeError("Class extends value " + String(i) + " is not a constructor or null");
    function r() {
      this.constructor = t;
    }
    e(t, i), t.prototype = null === i ? Object.create(i) : (r.prototype = i.prototype, new r());
  }
  var r = function () {
    return r = Object.assign || function (t) {
      for (var e, i = 1, r = arguments.length; i < r; i++) for (var s in e = arguments[i]) Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
      return t;
    }, r.apply(this, arguments);
  };
  function s(t, e, i, r) {
    var s,
      n = arguments.length,
      o = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, i, r);else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (o = (n < 3 ? s(o) : n > 3 ? s(e, i, o) : s(e, i)) || o);
    return n > 3 && o && Object.defineProperty(e, i, o), o;
  }
  function n(t, e, i) {
    if (i || 2 === arguments.length) for (var r, s = 0, n = e.length; s < n; s++) !r && s in e || (r || (r = Array.prototype.slice.call(e, 0, s)), r[s] = e[s]);
    return t.concat(r || Array.prototype.slice.call(e));
  }
  "function" == typeof SuppressedError && SuppressedError;
  /**
       * @license
       * Copyright 2019 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const o = globalThis,
    a = o.ShadowRoot && (void 0 === o.ShadyCSS || o.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    l = Symbol(),
    h = new WeakMap();
  class c {
    constructor(t, e, i) {
      if (this._$cssResult$ = !0, i !== l) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t, this.t = e;
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (a && void 0 === t) {
        const i = void 0 !== e && 1 === e.length;
        i && (t = h.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && h.set(e, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const d = t => new c("string" == typeof t ? t : t + "", void 0, l),
    u = (t, ...e) => {
      const i = 1 === t.length ? t[0] : e.reduce((e, i, r) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + t[r + 1], t[0]);
      return new c(i, t, l);
    },
    p = a ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const i of t.cssRules) e += i.cssText;
      return d(e);
    })(t) : t
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    {
      is: g,
      defineProperty: m,
      getOwnPropertyDescriptor: f,
      getOwnPropertyNames: y,
      getOwnPropertySymbols: _,
      getPrototypeOf: b
    } = Object,
    v = globalThis,
    w = v.trustedTypes,
    x = w ? w.emptyScript : "",
    S = v.reactiveElementPolyfillSupport,
    E = (t, e) => t,
    $ = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? x : null;
            break;
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t);
        }
        return t;
      },
      fromAttribute(t, e) {
        let i = t;
        switch (e) {
          case Boolean:
            i = null !== t;
            break;
          case Number:
            i = null === t ? null : Number(t);
            break;
          case Object:
          case Array:
            try {
              i = JSON.parse(t);
            } catch (t) {
              i = null;
            }
        }
        return i;
      }
    },
    C = (t, e) => !g(t, e),
    A = {
      attribute: !0,
      type: String,
      converter: $,
      reflect: !1,
      hasChanged: C
    };
  Symbol.metadata ??= Symbol("metadata"), v.litPropertyMetadata ??= new WeakMap();
  class T extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = A) {
      if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
        const i = Symbol(),
          r = this.getPropertyDescriptor(t, i, e);
        void 0 !== r && m(this.prototype, t, r);
      }
    }
    static getPropertyDescriptor(t, e, i) {
      const {
        get: r,
        set: s
      } = f(this.prototype, t) ?? {
        get() {
          return this[e];
        },
        set(t) {
          this[e] = t;
        }
      };
      return {
        get() {
          return r?.call(this);
        },
        set(e) {
          const n = r?.call(this);
          s.call(this, e), this.requestUpdate(t, n, i);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? A;
    }
    static _$Ei() {
      if (this.hasOwnProperty(E("elementProperties"))) return;
      const t = b(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(E("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
        const t = this.properties,
          e = [...y(t), ..._(t)];
        for (const i of e) this.createProperty(i, t[i]);
      }
      const t = this[Symbol.metadata];
      if (null !== t) {
        const e = litPropertyMetadata.get(t);
        if (void 0 !== e) for (const [t, i] of e) this.elementProperties.set(t, i);
      }
      this._$Eh = new Map();
      for (const [t, e] of this.elementProperties) {
        const i = this._$Eu(t, e);
        void 0 !== i && this._$Eh.set(i, t);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(t) {
      const e = [];
      if (Array.isArray(t)) {
        const i = new Set(t.flat(1 / 0).reverse());
        for (const t of i) e.unshift(p(t));
      } else void 0 !== t && e.push(p(t));
      return e;
    }
    static _$Eu(t, e) {
      const i = e.attribute;
      return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(t => this.enableUpdating = t), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(t => t(this));
    }
    addController(t) {
      (this._$EO ??= new Set()).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
      this._$EO?.delete(t);
    }
    _$E_() {
      const t = new Map(),
        e = this.constructor.elementProperties;
      for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
      t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
      const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return ((t, e) => {
        if (a) t.adoptedStyleSheets = e.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const i of e) {
          const e = document.createElement("style"),
            r = o.litNonce;
          void 0 !== r && e.setAttribute("nonce", r), e.textContent = i.cssText, t.appendChild(e);
        }
      })(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(t => t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      this._$EO?.forEach(t => t.hostDisconnected?.());
    }
    attributeChangedCallback(t, e, i) {
      this._$AK(t, i);
    }
    _$EC(t, e) {
      const i = this.constructor.elementProperties.get(t),
        r = this.constructor._$Eu(t, i);
      if (void 0 !== r && !0 === i.reflect) {
        const s = (void 0 !== i.converter?.toAttribute ? i.converter : $).toAttribute(e, i.type);
        this._$Em = t, null == s ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
      }
    }
    _$AK(t, e) {
      const i = this.constructor,
        r = i._$Eh.get(t);
      if (void 0 !== r && this._$Em !== r) {
        const t = i.getPropertyOptions(r),
          s = "function" == typeof t.converter ? {
            fromAttribute: t.converter
          } : void 0 !== t.converter?.fromAttribute ? t.converter : $;
        this._$Em = r, this[r] = s.fromAttribute(e, t.type), this._$Em = null;
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? C)(this[t], e)) return;
        this.P(t, e, i);
      }
      !1 === this.isUpdatePending && (this._$ES = this._$ET());
    }
    P(t, e, i) {
      this._$AL.has(t) || this._$AL.set(t, e), !0 === i.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t);
    }
    async _$ET() {
      this.isUpdatePending = !0;
      try {
        await this._$ES;
      } catch (t) {
        Promise.reject(t);
      }
      const t = this.scheduleUpdate();
      return null != t && (await t), !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t, e] of this._$Ep) this[t] = e;
          this._$Ep = void 0;
        }
        const t = this.constructor.elementProperties;
        if (t.size > 0) for (const [e, i] of t) !0 !== i.wrapped || this._$AL.has(e) || void 0 === this[e] || this.P(e, this[e], i);
      }
      let t = !1;
      const e = this._$AL;
      try {
        t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach(t => t.hostUpdate?.()), this.update(e)) : this._$EU();
      } catch (e) {
        throw t = !1, this._$EU(), e;
      }
      t && this._$AE(e);
    }
    willUpdate(t) {}
    _$AE(t) {
      this._$EO?.forEach(t => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    shouldUpdate(t) {
      return !0;
    }
    update(t) {
      this._$Ej &&= this._$Ej.forEach(t => this._$EC(t, this[t])), this._$EU();
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  T.elementStyles = [], T.shadowRootOptions = {
    mode: "open"
  }, T[E("elementProperties")] = new Map(), T[E("finalized")] = new Map(), S?.({
    ReactiveElement: T
  }), (v.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const P = globalThis,
    k = P.trustedTypes,
    M = k ? k.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    D = "$lit$",
    H = `lit$${Math.random().toFixed(9).slice(2)}$`,
    O = "?" + H,
    I = `<${O}>`,
    F = document,
    B = () => F.createComment(""),
    N = t => null === t || "object" != typeof t && "function" != typeof t,
    L = Array.isArray,
    U = t => L(t) || "function" == typeof t?.[Symbol.iterator],
    R = "[ \t\n\f\r]",
    Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    z = /-->/g,
    j = />/g,
    G = RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    V = /'/g,
    W = /"/g,
    Z = /^(?:script|style|textarea|title)$/i,
    X = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    K = Symbol.for("lit-noChange"),
    q = Symbol.for("lit-nothing"),
    J = new WeakMap(),
    Q = F.createTreeWalker(F, 129);
  function tt(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== M ? M.createHTML(e) : e;
  }
  const et = (t, e) => {
    const i = t.length - 1,
      r = [];
    let s,
      n = 2 === e ? "<svg>" : "",
      o = Y;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        l,
        h = -1,
        c = 0;
      for (; c < i.length && (o.lastIndex = c, l = o.exec(i), null !== l);) c = o.lastIndex, o === Y ? "!--" === l[1] ? o = z : void 0 !== l[1] ? o = j : void 0 !== l[2] ? (Z.test(l[2]) && (s = RegExp("</" + l[2], "g")), o = G) : void 0 !== l[3] && (o = G) : o === G ? ">" === l[0] ? (o = s ?? Y, h = -1) : void 0 === l[1] ? h = -2 : (h = o.lastIndex - l[2].length, a = l[1], o = void 0 === l[3] ? G : '"' === l[3] ? W : V) : o === W || o === V ? o = G : o === z || o === j ? o = Y : (o = G, s = void 0);
      const d = o === G && t[e + 1].startsWith("/>") ? " " : "";
      n += o === Y ? i + I : h >= 0 ? (r.push(a), i.slice(0, h) + D + i.slice(h) + H + d) : i + H + (-2 === h ? e : d);
    }
    return [tt(t, n + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), r];
  };
  class it {
    constructor({
      strings: t,
      _$litType$: e
    }, i) {
      let r;
      this.parts = [];
      let s = 0,
        n = 0;
      const o = t.length - 1,
        a = this.parts,
        [l, h] = et(t, e);
      if (this.el = it.createElement(l, i), Q.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (r = Q.nextNode()) && a.length < o;) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(D)) {
            const e = h[n++],
              i = r.getAttribute(t).split(H),
              o = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: s,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? at : "?" === o[1] ? lt : "@" === o[1] ? ht : ot
            }), r.removeAttribute(t);
          } else t.startsWith(H) && (a.push({
            type: 6,
            index: s
          }), r.removeAttribute(t));
          if (Z.test(r.tagName)) {
            const t = r.textContent.split(H),
              e = t.length - 1;
            if (e > 0) {
              r.textContent = k ? k.emptyScript : "";
              for (let i = 0; i < e; i++) r.append(t[i], B()), Q.nextNode(), a.push({
                type: 2,
                index: ++s
              });
              r.append(t[e], B());
            }
          }
        } else if (8 === r.nodeType) if (r.data === O) a.push({
          type: 2,
          index: s
        });else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(H, t + 1));) a.push({
            type: 7,
            index: s
          }), t += H.length - 1;
        }
        s++;
      }
    }
    static createElement(t, e) {
      const i = F.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function rt(t, e, i = t, r) {
    if (e === K) return e;
    let s = void 0 !== r ? i._$Co?.[r] : i._$Cl;
    const n = N(e) ? void 0 : e._$litDirective$;
    return s?.constructor !== n && (s?._$AO?.(!1), void 0 === n ? s = void 0 : (s = new n(t), s._$AT(t, i, r)), void 0 !== r ? (i._$Co ??= [])[r] = s : i._$Cl = s), void 0 !== s && (e = rt(t, s._$AS(t, e.values), s, r)), e;
  }
  class st {
    constructor(t, e) {
      this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t) {
      const {
          el: {
            content: e
          },
          parts: i
        } = this._$AD,
        r = (t?.creationScope ?? F).importNode(e, !0);
      Q.currentNode = r;
      let s = Q.nextNode(),
        n = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (n === a.index) {
          let e;
          2 === a.type ? e = new nt(s, s.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(s, a.name, a.strings, this, t) : 6 === a.type && (e = new ct(s, this, t)), this._$AV.push(e), a = i[++o];
        }
        n !== a?.index && (s = Q.nextNode(), n++);
      }
      return Q.currentNode = F, r;
    }
    p(t) {
      let e = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
    }
  }
  class nt {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, i, r) {
      this.type = 2, this._$AH = q, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
    }
    get parentNode() {
      let t = this._$AA.parentNode;
      const e = this._$AM;
      return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t, e = this) {
      t = rt(this, t, e), N(t) ? t === q || null == t || "" === t ? (this._$AH !== q && this._$AR(), this._$AH = q) : t !== this._$AH && t !== K && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : U(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== q && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(F.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        r = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = it.createElement(tt(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === r) this._$AH.p(e);else {
        const t = new st(r, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = J.get(t.strings);
      return void 0 === e && J.set(t.strings, e = new it(t)), e;
    }
    k(t) {
      L(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        r = 0;
      for (const s of t) r === e.length ? e.push(i = new nt(this.S(B()), this.S(B()), this, this.options)) : i = e[r], i._$AI(s), r++;
      r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t && t !== this._$AB;) {
        const e = t.nextSibling;
        t.remove(), t = e;
      }
    }
    setConnected(t) {
      void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
    }
  }
  class ot {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, i, r, s) {
      this.type = 1, this._$AH = q, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = s, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = q;
    }
    _$AI(t, e = this, i, r) {
      const s = this.strings;
      let n = !1;
      if (void 0 === s) t = rt(this, t, e, 0), n = !N(t) || t !== this._$AH && t !== K, n && (this._$AH = t);else {
        const r = t;
        let o, a;
        for (t = s[0], o = 0; o < s.length - 1; o++) a = rt(this, r[i + o], e, o), a === K && (a = this._$AH[o]), n ||= !N(a) || a !== this._$AH[o], a === q ? t = q : t !== q && (t += (a ?? "") + s[o + 1]), this._$AH[o] = a;
      }
      n && !r && this.j(t);
    }
    j(t) {
      t === q ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class at extends ot {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === q ? void 0 : t;
    }
  }
  class lt extends ot {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== q);
    }
  }
  class ht extends ot {
    constructor(t, e, i, r, s) {
      super(t, e, i, r, s), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = rt(this, t, e, 0) ?? q) === K) return;
      const i = this._$AH,
        r = t === q && i !== q || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        s = t !== q && (i === q || r);
      r && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class ct {
    constructor(t, e, i) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      rt(this, t);
    }
  }
  const dt = {
      P: D,
      A: H,
      C: O,
      M: 1,
      L: et,
      R: st,
      D: U,
      V: rt,
      I: nt,
      H: ot,
      N: lt,
      U: ht,
      B: at,
      F: ct
    },
    ut = P.litHtmlPolyfillSupport;
  ut?.(it, nt), (P.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class pt extends T {
    constructor() {
      super(...arguments), this.renderOptions = {
        host: this
      }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t.firstChild, t;
    }
    update(t) {
      const e = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ((t, e, i) => {
        const r = i?.renderBefore ?? e;
        let s = r._$litPart$;
        if (void 0 === s) {
          const t = i?.renderBefore ?? null;
          r._$litPart$ = s = new nt(e.insertBefore(B(), t), t, void 0, i ?? {});
        }
        return s._$AI(t), s;
      })(e, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
      return K;
    }
  }
  pt._$litElement$ = !0, pt.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: pt
  });
  const gt = globalThis.litElementPolyfillSupport;
  gt?.({
    LitElement: pt
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const mt = t => (e, i) => {
      void 0 !== i ? i.addInitializer(() => {
        customElements.define(t, e);
      }) : customElements.define(t, e);
    }
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    ft = {
      attribute: !0,
      type: String,
      converter: $,
      reflect: !1,
      hasChanged: C
    },
    yt = (t = ft, e, i) => {
      const {
        kind: r,
        metadata: s
      } = i;
      let n = globalThis.litPropertyMetadata.get(s);
      if (void 0 === n && globalThis.litPropertyMetadata.set(s, n = new Map()), n.set(i.name, t), "accessor" === r) {
        const {
          name: r
        } = i;
        return {
          set(i) {
            const s = e.get.call(this);
            e.set.call(this, i), this.requestUpdate(r, s, t);
          },
          init(e) {
            return void 0 !== e && this.P(r, void 0, t), e;
          }
        };
      }
      if ("setter" === r) {
        const {
          name: r
        } = i;
        return function (i) {
          const s = this[r];
          e.call(this, i), this.requestUpdate(r, s, t);
        };
      }
      throw Error("Unsupported decorator location: " + r);
    };
  function _t(t) {
    return (e, i) => "object" == typeof i ? yt(t, e, i) : ((t, e, i) => {
      const r = e.hasOwnProperty(i);
      return e.constructor.createProperty(i, r ? {
        ...t,
        wrapped: !0
      } : t), r ? Object.getOwnPropertyDescriptor(e, i) : void 0;
    })(t, e, i);
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function bt(t) {
    return _t({
      ...t,
      state: !0,
      attribute: !1
    });
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const vt = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && "object" != typeof e && Object.defineProperty(t, e, i), i)
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */;
  function wt(t, e) {
    return (i, r, s) => {
      const n = e => e.renderRoot?.querySelector(t) ?? null;
      if (e) {
        const {
          get: t,
          set: e
        } = "object" == typeof r ? i : s ?? (() => {
          const t = Symbol();
          return {
            get() {
              return this[t];
            },
            set(e) {
              this[t] = e;
            }
          };
        })();
        return vt(i, r, {
          get() {
            let i = t.call(this);
            return void 0 === i && (i = n(this), (null !== i || this.hasUpdated) && e.call(this, i)), i;
          }
        });
      }
      return vt(i, r, {
        get() {
          return n(this);
        }
      });
    };
  }
  "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
  function xt(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  function St(t) {
    throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var Et,
    $t = {
      exports: {}
    };
  (Et = $t).exports = function () {
    var t, e;
    function i() {
      return t.apply(null, arguments);
    }
    function r(e) {
      t = e;
    }
    function s(t) {
      return t instanceof Array || "[object Array]" === Object.prototype.toString.call(t);
    }
    function n(t) {
      return null != t && "[object Object]" === Object.prototype.toString.call(t);
    }
    function o(t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }
    function a(t) {
      if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(t).length;
      var e;
      for (e in t) if (o(t, e)) return !1;
      return !0;
    }
    function l(t) {
      return void 0 === t;
    }
    function h(t) {
      return "number" == typeof t || "[object Number]" === Object.prototype.toString.call(t);
    }
    function c(t) {
      return t instanceof Date || "[object Date]" === Object.prototype.toString.call(t);
    }
    function d(t, e) {
      var i,
        r = [],
        s = t.length;
      for (i = 0; i < s; ++i) r.push(e(t[i], i));
      return r;
    }
    function u(t, e) {
      for (var i in e) o(e, i) && (t[i] = e[i]);
      return o(e, "toString") && (t.toString = e.toString), o(e, "valueOf") && (t.valueOf = e.valueOf), t;
    }
    function p(t, e, i, r) {
      return Zi(t, e, i, r, !0).utc();
    }
    function g() {
      return {
        empty: !1,
        unusedTokens: [],
        unusedInput: [],
        overflow: -2,
        charsLeftOver: 0,
        nullInput: !1,
        invalidEra: null,
        invalidMonth: null,
        invalidFormat: !1,
        userInvalidated: !1,
        iso: !1,
        parsedDateParts: [],
        era: null,
        meridiem: null,
        rfc2822: !1,
        weekdayMismatch: !1
      };
    }
    function m(t) {
      return null == t._pf && (t._pf = g()), t._pf;
    }
    function f(t) {
      var i = null,
        r = !1,
        s = t._d && !isNaN(t._d.getTime());
      return s && (i = m(t), r = e.call(i.parsedDateParts, function (t) {
        return null != t;
      }), s = i.overflow < 0 && !i.empty && !i.invalidEra && !i.invalidMonth && !i.invalidWeekday && !i.weekdayMismatch && !i.nullInput && !i.invalidFormat && !i.userInvalidated && (!i.meridiem || i.meridiem && r), t._strict && (s = s && 0 === i.charsLeftOver && 0 === i.unusedTokens.length && void 0 === i.bigHour)), null != Object.isFrozen && Object.isFrozen(t) ? s : (t._isValid = s, t._isValid);
    }
    function y(t) {
      var e = p(NaN);
      return null != t ? u(m(e), t) : m(e).userInvalidated = !0, e;
    }
    e = Array.prototype.some ? Array.prototype.some : function (t) {
      var e,
        i = Object(this),
        r = i.length >>> 0;
      for (e = 0; e < r; e++) if (e in i && t.call(this, i[e], e, i)) return !0;
      return !1;
    };
    var _ = i.momentProperties = [],
      b = !1;
    function v(t, e) {
      var i,
        r,
        s,
        n = _.length;
      if (l(e._isAMomentObject) || (t._isAMomentObject = e._isAMomentObject), l(e._i) || (t._i = e._i), l(e._f) || (t._f = e._f), l(e._l) || (t._l = e._l), l(e._strict) || (t._strict = e._strict), l(e._tzm) || (t._tzm = e._tzm), l(e._isUTC) || (t._isUTC = e._isUTC), l(e._offset) || (t._offset = e._offset), l(e._pf) || (t._pf = m(e)), l(e._locale) || (t._locale = e._locale), n > 0) for (i = 0; i < n; i++) l(s = e[r = _[i]]) || (t[r] = s);
      return t;
    }
    function w(t) {
      v(this, t), this._d = new Date(null != t._d ? t._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === b && (b = !0, i.updateOffset(this), b = !1);
    }
    function x(t) {
      return t instanceof w || null != t && null != t._isAMomentObject;
    }
    function S(t) {
      !1 === i.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t);
    }
    function E(t, e) {
      var r = !0;
      return u(function () {
        if (null != i.deprecationHandler && i.deprecationHandler(null, t), r) {
          var s,
            n,
            a,
            l = [],
            h = arguments.length;
          for (n = 0; n < h; n++) {
            if (s = "", "object" == typeof arguments[n]) {
              for (a in s += "\n[" + n + "] ", arguments[0]) o(arguments[0], a) && (s += a + ": " + arguments[0][a] + ", ");
              s = s.slice(0, -2);
            } else s = arguments[n];
            l.push(s);
          }
          S(t + "\nArguments: " + Array.prototype.slice.call(l).join("") + "\n" + new Error().stack), r = !1;
        }
        return e.apply(this, arguments);
      }, e);
    }
    var $,
      C = {};
    function A(t, e) {
      null != i.deprecationHandler && i.deprecationHandler(t, e), C[t] || (S(e), C[t] = !0);
    }
    function T(t) {
      return "undefined" != typeof Function && t instanceof Function || "[object Function]" === Object.prototype.toString.call(t);
    }
    function P(t) {
      var e, i;
      for (i in t) o(t, i) && (T(e = t[i]) ? this[i] = e : this["_" + i] = e);
      this._config = t, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function k(t, e) {
      var i,
        r = u({}, t);
      for (i in e) o(e, i) && (n(t[i]) && n(e[i]) ? (r[i] = {}, u(r[i], t[i]), u(r[i], e[i])) : null != e[i] ? r[i] = e[i] : delete r[i]);
      for (i in t) o(t, i) && !o(e, i) && n(t[i]) && (r[i] = u({}, r[i]));
      return r;
    }
    function M(t) {
      null != t && this.set(t);
    }
    i.suppressDeprecationWarnings = !1, i.deprecationHandler = null, $ = Object.keys ? Object.keys : function (t) {
      var e,
        i = [];
      for (e in t) o(t, e) && i.push(e);
      return i;
    };
    var D = {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    };
    function H(t, e, i) {
      var r = this._calendar[t] || this._calendar.sameElse;
      return T(r) ? r.call(e, i) : r;
    }
    function O(t, e, i) {
      var r = "" + Math.abs(t),
        s = e - r.length;
      return (t >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, s)).toString().substr(1) + r;
    }
    var I = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      F = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      B = {},
      N = {};
    function L(t, e, i, r) {
      var s = r;
      "string" == typeof r && (s = function () {
        return this[r]();
      }), t && (N[t] = s), e && (N[e[0]] = function () {
        return O(s.apply(this, arguments), e[1], e[2]);
      }), i && (N[i] = function () {
        return this.localeData().ordinal(s.apply(this, arguments), t);
      });
    }
    function U(t) {
      return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
    }
    function R(t) {
      var e,
        i,
        r = t.match(I);
      for (e = 0, i = r.length; e < i; e++) N[r[e]] ? r[e] = N[r[e]] : r[e] = U(r[e]);
      return function (e) {
        var s,
          n = "";
        for (s = 0; s < i; s++) n += T(r[s]) ? r[s].call(e, t) : r[s];
        return n;
      };
    }
    function Y(t, e) {
      return t.isValid() ? (e = z(e, t.localeData()), B[e] = B[e] || R(e), B[e](t)) : t.localeData().invalidDate();
    }
    function z(t, e) {
      var i = 5;
      function r(t) {
        return e.longDateFormat(t) || t;
      }
      for (F.lastIndex = 0; i >= 0 && F.test(t);) t = t.replace(F, r), F.lastIndex = 0, i -= 1;
      return t;
    }
    var j = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function G(t) {
      var e = this._longDateFormat[t],
        i = this._longDateFormat[t.toUpperCase()];
      return e || !i ? e : (this._longDateFormat[t] = i.match(I).map(function (t) {
        return "MMMM" === t || "MM" === t || "DD" === t || "dddd" === t ? t.slice(1) : t;
      }).join(""), this._longDateFormat[t]);
    }
    var V = "Invalid date";
    function W() {
      return this._invalidDate;
    }
    var Z = "%d",
      X = /\d{1,2}/;
    function K(t) {
      return this._ordinal.replace("%d", t);
    }
    var q = {
      future: "in %s",
      past: "%s ago",
      s: "a few seconds",
      ss: "%d seconds",
      m: "a minute",
      mm: "%d minutes",
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      w: "a week",
      ww: "%d weeks",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years"
    };
    function J(t, e, i, r) {
      var s = this._relativeTime[i];
      return T(s) ? s(t, e, i, r) : s.replace(/%d/i, t);
    }
    function Q(t, e) {
      var i = this._relativeTime[t > 0 ? "future" : "past"];
      return T(i) ? i(e) : i.replace(/%s/i, e);
    }
    var tt = {
      D: "date",
      dates: "date",
      date: "date",
      d: "day",
      days: "day",
      day: "day",
      e: "weekday",
      weekdays: "weekday",
      weekday: "weekday",
      E: "isoWeekday",
      isoweekdays: "isoWeekday",
      isoweekday: "isoWeekday",
      DDD: "dayOfYear",
      dayofyears: "dayOfYear",
      dayofyear: "dayOfYear",
      h: "hour",
      hours: "hour",
      hour: "hour",
      ms: "millisecond",
      milliseconds: "millisecond",
      millisecond: "millisecond",
      m: "minute",
      minutes: "minute",
      minute: "minute",
      M: "month",
      months: "month",
      month: "month",
      Q: "quarter",
      quarters: "quarter",
      quarter: "quarter",
      s: "second",
      seconds: "second",
      second: "second",
      gg: "weekYear",
      weekyears: "weekYear",
      weekyear: "weekYear",
      GG: "isoWeekYear",
      isoweekyears: "isoWeekYear",
      isoweekyear: "isoWeekYear",
      w: "week",
      weeks: "week",
      week: "week",
      W: "isoWeek",
      isoweeks: "isoWeek",
      isoweek: "isoWeek",
      y: "year",
      years: "year",
      year: "year"
    };
    function et(t) {
      return "string" == typeof t ? tt[t] || tt[t.toLowerCase()] : void 0;
    }
    function it(t) {
      var e,
        i,
        r = {};
      for (i in t) o(t, i) && (e = et(i)) && (r[e] = t[i]);
      return r;
    }
    var rt = {
      date: 9,
      day: 11,
      weekday: 11,
      isoWeekday: 11,
      dayOfYear: 4,
      hour: 13,
      millisecond: 16,
      minute: 14,
      month: 8,
      quarter: 7,
      second: 15,
      weekYear: 1,
      isoWeekYear: 1,
      week: 5,
      isoWeek: 5,
      year: 1
    };
    function st(t) {
      var e,
        i = [];
      for (e in t) o(t, e) && i.push({
        unit: e,
        priority: rt[e]
      });
      return i.sort(function (t, e) {
        return t.priority - e.priority;
      }), i;
    }
    var nt,
      ot = /\d/,
      at = /\d\d/,
      lt = /\d{3}/,
      ht = /\d{4}/,
      ct = /[+-]?\d{6}/,
      dt = /\d\d?/,
      ut = /\d\d\d\d?/,
      pt = /\d\d\d\d\d\d?/,
      gt = /\d{1,3}/,
      mt = /\d{1,4}/,
      ft = /[+-]?\d{1,6}/,
      yt = /\d+/,
      _t = /[+-]?\d+/,
      bt = /Z|[+-]\d\d:?\d\d/gi,
      vt = /Z|[+-]\d\d(?::?\d\d)?/gi,
      wt = /[+-]?\d+(\.\d{1,3})?/,
      xt = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      $t = /^[1-9]\d?/,
      Ct = /^([1-9]\d|\d)/;
    function At(t, e, i) {
      nt[t] = T(e) ? e : function (t, r) {
        return t && i ? i : e;
      };
    }
    function Tt(t, e) {
      return o(nt, t) ? nt[t](e._strict, e._locale) : new RegExp(Pt(t));
    }
    function Pt(t) {
      return kt(t.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (t, e, i, r, s) {
        return e || i || r || s;
      }));
    }
    function kt(t) {
      return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function Mt(t) {
      return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
    }
    function Dt(t) {
      var e = +t,
        i = 0;
      return 0 !== e && isFinite(e) && (i = Mt(e)), i;
    }
    nt = {};
    var Ht = {};
    function Ot(t, e) {
      var i,
        r,
        s = e;
      for ("string" == typeof t && (t = [t]), h(e) && (s = function (t, i) {
        i[e] = Dt(t);
      }), r = t.length, i = 0; i < r; i++) Ht[t[i]] = s;
    }
    function It(t, e) {
      Ot(t, function (t, i, r, s) {
        r._w = r._w || {}, e(t, r._w, r, s);
      });
    }
    function Ft(t, e, i) {
      null != e && o(Ht, t) && Ht[t](e, i._a, i, t);
    }
    function Bt(t) {
      return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
    }
    var Nt = 0,
      Lt = 1,
      Ut = 2,
      Rt = 3,
      Yt = 4,
      zt = 5,
      jt = 6,
      Gt = 7,
      Vt = 8;
    function Wt(t) {
      return Bt(t) ? 366 : 365;
    }
    L("Y", 0, 0, function () {
      var t = this.year();
      return t <= 9999 ? O(t, 4) : "+" + t;
    }), L(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    }), L(0, ["YYYY", 4], 0, "year"), L(0, ["YYYYY", 5], 0, "year"), L(0, ["YYYYYY", 6, !0], 0, "year"), At("Y", _t), At("YY", dt, at), At("YYYY", mt, ht), At("YYYYY", ft, ct), At("YYYYYY", ft, ct), Ot(["YYYYY", "YYYYYY"], Nt), Ot("YYYY", function (t, e) {
      e[Nt] = 2 === t.length ? i.parseTwoDigitYear(t) : Dt(t);
    }), Ot("YY", function (t, e) {
      e[Nt] = i.parseTwoDigitYear(t);
    }), Ot("Y", function (t, e) {
      e[Nt] = parseInt(t, 10);
    }), i.parseTwoDigitYear = function (t) {
      return Dt(t) + (Dt(t) > 68 ? 1900 : 2e3);
    };
    var Zt,
      Xt = qt("FullYear", !0);
    function Kt() {
      return Bt(this.year());
    }
    function qt(t, e) {
      return function (r) {
        return null != r ? (Qt(this, t, r), i.updateOffset(this, e), this) : Jt(this, t);
      };
    }
    function Jt(t, e) {
      if (!t.isValid()) return NaN;
      var i = t._d,
        r = t._isUTC;
      switch (e) {
        case "Milliseconds":
          return r ? i.getUTCMilliseconds() : i.getMilliseconds();
        case "Seconds":
          return r ? i.getUTCSeconds() : i.getSeconds();
        case "Minutes":
          return r ? i.getUTCMinutes() : i.getMinutes();
        case "Hours":
          return r ? i.getUTCHours() : i.getHours();
        case "Date":
          return r ? i.getUTCDate() : i.getDate();
        case "Day":
          return r ? i.getUTCDay() : i.getDay();
        case "Month":
          return r ? i.getUTCMonth() : i.getMonth();
        case "FullYear":
          return r ? i.getUTCFullYear() : i.getFullYear();
        default:
          return NaN;
      }
    }
    function Qt(t, e, i) {
      var r, s, n, o, a;
      if (t.isValid() && !isNaN(i)) {
        switch (r = t._d, s = t._isUTC, e) {
          case "Milliseconds":
            return void (s ? r.setUTCMilliseconds(i) : r.setMilliseconds(i));
          case "Seconds":
            return void (s ? r.setUTCSeconds(i) : r.setSeconds(i));
          case "Minutes":
            return void (s ? r.setUTCMinutes(i) : r.setMinutes(i));
          case "Hours":
            return void (s ? r.setUTCHours(i) : r.setHours(i));
          case "Date":
            return void (s ? r.setUTCDate(i) : r.setDate(i));
          case "FullYear":
            break;
          default:
            return;
        }
        n = i, o = t.month(), a = 29 !== (a = t.date()) || 1 !== o || Bt(n) ? a : 28, s ? r.setUTCFullYear(n, o, a) : r.setFullYear(n, o, a);
      }
    }
    function te(t) {
      return T(this[t = et(t)]) ? this[t]() : this;
    }
    function ee(t, e) {
      if ("object" == typeof t) {
        var i,
          r = st(t = it(t)),
          s = r.length;
        for (i = 0; i < s; i++) this[r[i].unit](t[r[i].unit]);
      } else if (T(this[t = et(t)])) return this[t](e);
      return this;
    }
    function ie(t, e) {
      return (t % e + e) % e;
    }
    function re(t, e) {
      if (isNaN(t) || isNaN(e)) return NaN;
      var i = ie(e, 12);
      return t += (e - i) / 12, 1 === i ? Bt(t) ? 29 : 28 : 31 - i % 7 % 2;
    }
    Zt = Array.prototype.indexOf ? Array.prototype.indexOf : function (t) {
      var e;
      for (e = 0; e < this.length; ++e) if (this[e] === t) return e;
      return -1;
    }, L("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    }), L("MMM", 0, 0, function (t) {
      return this.localeData().monthsShort(this, t);
    }), L("MMMM", 0, 0, function (t) {
      return this.localeData().months(this, t);
    }), At("M", dt, $t), At("MM", dt, at), At("MMM", function (t, e) {
      return e.monthsShortRegex(t);
    }), At("MMMM", function (t, e) {
      return e.monthsRegex(t);
    }), Ot(["M", "MM"], function (t, e) {
      e[Lt] = Dt(t) - 1;
    }), Ot(["MMM", "MMMM"], function (t, e, i, r) {
      var s = i._locale.monthsParse(t, r, i._strict);
      null != s ? e[Lt] = s : m(i).invalidMonth = t;
    });
    var se = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
      ne = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      oe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      ae = xt,
      le = xt;
    function he(t, e) {
      return t ? s(this._months) ? this._months[t.month()] : this._months[(this._months.isFormat || oe).test(e) ? "format" : "standalone"][t.month()] : s(this._months) ? this._months : this._months.standalone;
    }
    function ce(t, e) {
      return t ? s(this._monthsShort) ? this._monthsShort[t.month()] : this._monthsShort[oe.test(e) ? "format" : "standalone"][t.month()] : s(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }
    function de(t, e, i) {
      var r,
        s,
        n,
        o = t.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], r = 0; r < 12; ++r) n = p([2e3, r]), this._shortMonthsParse[r] = this.monthsShort(n, "").toLocaleLowerCase(), this._longMonthsParse[r] = this.months(n, "").toLocaleLowerCase();
      return i ? "MMM" === e ? -1 !== (s = Zt.call(this._shortMonthsParse, o)) ? s : null : -1 !== (s = Zt.call(this._longMonthsParse, o)) ? s : null : "MMM" === e ? -1 !== (s = Zt.call(this._shortMonthsParse, o)) || -1 !== (s = Zt.call(this._longMonthsParse, o)) ? s : null : -1 !== (s = Zt.call(this._longMonthsParse, o)) || -1 !== (s = Zt.call(this._shortMonthsParse, o)) ? s : null;
    }
    function ue(t, e, i) {
      var r, s, n;
      if (this._monthsParseExact) return de.call(this, t, e, i);
      for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), r = 0; r < 12; r++) {
        if (s = p([2e3, r]), i && !this._longMonthsParse[r] && (this._longMonthsParse[r] = new RegExp("^" + this.months(s, "").replace(".", "") + "$", "i"), this._shortMonthsParse[r] = new RegExp("^" + this.monthsShort(s, "").replace(".", "") + "$", "i")), i || this._monthsParse[r] || (n = "^" + this.months(s, "") + "|^" + this.monthsShort(s, ""), this._monthsParse[r] = new RegExp(n.replace(".", ""), "i")), i && "MMMM" === e && this._longMonthsParse[r].test(t)) return r;
        if (i && "MMM" === e && this._shortMonthsParse[r].test(t)) return r;
        if (!i && this._monthsParse[r].test(t)) return r;
      }
    }
    function pe(t, e) {
      if (!t.isValid()) return t;
      if ("string" == typeof e) if (/^\d+$/.test(e)) e = Dt(e);else if (!h(e = t.localeData().monthsParse(e))) return t;
      var i = e,
        r = t.date();
      return r = r < 29 ? r : Math.min(r, re(t.year(), i)), t._isUTC ? t._d.setUTCMonth(i, r) : t._d.setMonth(i, r), t;
    }
    function ge(t) {
      return null != t ? (pe(this, t), i.updateOffset(this, !0), this) : Jt(this, "Month");
    }
    function me() {
      return re(this.year(), this.month());
    }
    function fe(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsShortStrictRegex : this._monthsShortRegex) : (o(this, "_monthsShortRegex") || (this._monthsShortRegex = ae), this._monthsShortStrictRegex && t ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }
    function ye(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsStrictRegex : this._monthsRegex) : (o(this, "_monthsRegex") || (this._monthsRegex = le), this._monthsStrictRegex && t ? this._monthsStrictRegex : this._monthsRegex);
    }
    function _e() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        r,
        s,
        n = [],
        o = [],
        a = [];
      for (e = 0; e < 12; e++) i = p([2e3, e]), r = kt(this.monthsShort(i, "")), s = kt(this.months(i, "")), n.push(r), o.push(s), a.push(s), a.push(r);
      n.sort(t), o.sort(t), a.sort(t), this._monthsRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }
    function be(t, e, i, r, s, n, o) {
      var a;
      return t < 100 && t >= 0 ? (a = new Date(t + 400, e, i, r, s, n, o), isFinite(a.getFullYear()) && a.setFullYear(t)) : a = new Date(t, e, i, r, s, n, o), a;
    }
    function ve(t) {
      var e, i;
      return t < 100 && t >= 0 ? ((i = Array.prototype.slice.call(arguments))[0] = t + 400, e = new Date(Date.UTC.apply(null, i)), isFinite(e.getUTCFullYear()) && e.setUTCFullYear(t)) : e = new Date(Date.UTC.apply(null, arguments)), e;
    }
    function we(t, e, i) {
      var r = 7 + e - i;
      return -(7 + ve(t, 0, r).getUTCDay() - e) % 7 + r - 1;
    }
    function xe(t, e, i, r, s) {
      var n,
        o,
        a = 1 + 7 * (e - 1) + (7 + i - r) % 7 + we(t, r, s);
      return a <= 0 ? o = Wt(n = t - 1) + a : a > Wt(t) ? (n = t + 1, o = a - Wt(t)) : (n = t, o = a), {
        year: n,
        dayOfYear: o
      };
    }
    function Se(t, e, i) {
      var r,
        s,
        n = we(t.year(), e, i),
        o = Math.floor((t.dayOfYear() - n - 1) / 7) + 1;
      return o < 1 ? r = o + Ee(s = t.year() - 1, e, i) : o > Ee(t.year(), e, i) ? (r = o - Ee(t.year(), e, i), s = t.year() + 1) : (s = t.year(), r = o), {
        week: r,
        year: s
      };
    }
    function Ee(t, e, i) {
      var r = we(t, e, i),
        s = we(t + 1, e, i);
      return (Wt(t) - r + s) / 7;
    }
    function $e(t) {
      return Se(t, this._week.dow, this._week.doy).week;
    }
    L("w", ["ww", 2], "wo", "week"), L("W", ["WW", 2], "Wo", "isoWeek"), At("w", dt, $t), At("ww", dt, at), At("W", dt, $t), At("WW", dt, at), It(["w", "ww", "W", "WW"], function (t, e, i, r) {
      e[r.substr(0, 1)] = Dt(t);
    });
    var Ce = {
      dow: 0,
      doy: 6
    };
    function Ae() {
      return this._week.dow;
    }
    function Te() {
      return this._week.doy;
    }
    function Pe(t) {
      var e = this.localeData().week(this);
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function ke(t) {
      var e = Se(this, 1, 4).week;
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function Me(t, e) {
      return "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = e.weekdaysParse(t)) ? t : null : parseInt(t, 10);
    }
    function De(t, e) {
      return "string" == typeof t ? e.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t;
    }
    function He(t, e) {
      return t.slice(e, 7).concat(t.slice(0, e));
    }
    L("d", 0, "do", "day"), L("dd", 0, 0, function (t) {
      return this.localeData().weekdaysMin(this, t);
    }), L("ddd", 0, 0, function (t) {
      return this.localeData().weekdaysShort(this, t);
    }), L("dddd", 0, 0, function (t) {
      return this.localeData().weekdays(this, t);
    }), L("e", 0, 0, "weekday"), L("E", 0, 0, "isoWeekday"), At("d", dt), At("e", dt), At("E", dt), At("dd", function (t, e) {
      return e.weekdaysMinRegex(t);
    }), At("ddd", function (t, e) {
      return e.weekdaysShortRegex(t);
    }), At("dddd", function (t, e) {
      return e.weekdaysRegex(t);
    }), It(["dd", "ddd", "dddd"], function (t, e, i, r) {
      var s = i._locale.weekdaysParse(t, r, i._strict);
      null != s ? e.d = s : m(i).invalidWeekday = t;
    }), It(["d", "e", "E"], function (t, e, i, r) {
      e[r] = Dt(t);
    });
    var Oe = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      Ie = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      Fe = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      Be = xt,
      Ne = xt,
      Le = xt;
    function Ue(t, e) {
      var i = s(this._weekdays) ? this._weekdays : this._weekdays[t && !0 !== t && this._weekdays.isFormat.test(e) ? "format" : "standalone"];
      return !0 === t ? He(i, this._week.dow) : t ? i[t.day()] : i;
    }
    function Re(t) {
      return !0 === t ? He(this._weekdaysShort, this._week.dow) : t ? this._weekdaysShort[t.day()] : this._weekdaysShort;
    }
    function Ye(t) {
      return !0 === t ? He(this._weekdaysMin, this._week.dow) : t ? this._weekdaysMin[t.day()] : this._weekdaysMin;
    }
    function ze(t, e, i) {
      var r,
        s,
        n,
        o = t.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], r = 0; r < 7; ++r) n = p([2e3, 1]).day(r), this._minWeekdaysParse[r] = this.weekdaysMin(n, "").toLocaleLowerCase(), this._shortWeekdaysParse[r] = this.weekdaysShort(n, "").toLocaleLowerCase(), this._weekdaysParse[r] = this.weekdays(n, "").toLocaleLowerCase();
      return i ? "dddd" === e ? -1 !== (s = Zt.call(this._weekdaysParse, o)) ? s : null : "ddd" === e ? -1 !== (s = Zt.call(this._shortWeekdaysParse, o)) ? s : null : -1 !== (s = Zt.call(this._minWeekdaysParse, o)) ? s : null : "dddd" === e ? -1 !== (s = Zt.call(this._weekdaysParse, o)) || -1 !== (s = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (s = Zt.call(this._minWeekdaysParse, o)) ? s : null : "ddd" === e ? -1 !== (s = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (s = Zt.call(this._weekdaysParse, o)) || -1 !== (s = Zt.call(this._minWeekdaysParse, o)) ? s : null : -1 !== (s = Zt.call(this._minWeekdaysParse, o)) || -1 !== (s = Zt.call(this._weekdaysParse, o)) || -1 !== (s = Zt.call(this._shortWeekdaysParse, o)) ? s : null;
    }
    function je(t, e, i) {
      var r, s, n;
      if (this._weekdaysParseExact) return ze.call(this, t, e, i);
      for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), r = 0; r < 7; r++) {
        if (s = p([2e3, 1]).day(r), i && !this._fullWeekdaysParse[r] && (this._fullWeekdaysParse[r] = new RegExp("^" + this.weekdays(s, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[r] = new RegExp("^" + this.weekdaysShort(s, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[r] = new RegExp("^" + this.weekdaysMin(s, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[r] || (n = "^" + this.weekdays(s, "") + "|^" + this.weekdaysShort(s, "") + "|^" + this.weekdaysMin(s, ""), this._weekdaysParse[r] = new RegExp(n.replace(".", ""), "i")), i && "dddd" === e && this._fullWeekdaysParse[r].test(t)) return r;
        if (i && "ddd" === e && this._shortWeekdaysParse[r].test(t)) return r;
        if (i && "dd" === e && this._minWeekdaysParse[r].test(t)) return r;
        if (!i && this._weekdaysParse[r].test(t)) return r;
      }
    }
    function Ge(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = Jt(this, "Day");
      return null != t ? (t = Me(t, this.localeData()), this.add(t - e, "d")) : e;
    }
    function Ve(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == t ? e : this.add(t - e, "d");
    }
    function We(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        var e = De(t, this.localeData());
        return this.day(this.day() % 7 ? e : e - 7);
      }
      return this.day() || 7;
    }
    function Ze(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysStrictRegex : this._weekdaysRegex) : (o(this, "_weekdaysRegex") || (this._weekdaysRegex = Be), this._weekdaysStrictRegex && t ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }
    function Xe(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (o(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Ne), this._weekdaysShortStrictRegex && t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }
    function Ke(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (o(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Le), this._weekdaysMinStrictRegex && t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
    }
    function qe() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        r,
        s,
        n,
        o = [],
        a = [],
        l = [],
        h = [];
      for (e = 0; e < 7; e++) i = p([2e3, 1]).day(e), r = kt(this.weekdaysMin(i, "")), s = kt(this.weekdaysShort(i, "")), n = kt(this.weekdays(i, "")), o.push(r), a.push(s), l.push(n), h.push(r), h.push(s), h.push(n);
      o.sort(t), a.sort(t), l.sort(t), h.sort(t), this._weekdaysRegex = new RegExp("^(" + h.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + o.join("|") + ")", "i");
    }
    function Je() {
      return this.hours() % 12 || 12;
    }
    function Qe() {
      return this.hours() || 24;
    }
    function ti(t, e) {
      L(t, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), e);
      });
    }
    function ei(t, e) {
      return e._meridiemParse;
    }
    function ii(t) {
      return "p" === (t + "").toLowerCase().charAt(0);
    }
    L("H", ["HH", 2], 0, "hour"), L("h", ["hh", 2], 0, Je), L("k", ["kk", 2], 0, Qe), L("hmm", 0, 0, function () {
      return "" + Je.apply(this) + O(this.minutes(), 2);
    }), L("hmmss", 0, 0, function () {
      return "" + Je.apply(this) + O(this.minutes(), 2) + O(this.seconds(), 2);
    }), L("Hmm", 0, 0, function () {
      return "" + this.hours() + O(this.minutes(), 2);
    }), L("Hmmss", 0, 0, function () {
      return "" + this.hours() + O(this.minutes(), 2) + O(this.seconds(), 2);
    }), ti("a", !0), ti("A", !1), At("a", ei), At("A", ei), At("H", dt, Ct), At("h", dt, $t), At("k", dt, $t), At("HH", dt, at), At("hh", dt, at), At("kk", dt, at), At("hmm", ut), At("hmmss", pt), At("Hmm", ut), At("Hmmss", pt), Ot(["H", "HH"], Rt), Ot(["k", "kk"], function (t, e, i) {
      var r = Dt(t);
      e[Rt] = 24 === r ? 0 : r;
    }), Ot(["a", "A"], function (t, e, i) {
      i._isPm = i._locale.isPM(t), i._meridiem = t;
    }), Ot(["h", "hh"], function (t, e, i) {
      e[Rt] = Dt(t), m(i).bigHour = !0;
    }), Ot("hmm", function (t, e, i) {
      var r = t.length - 2;
      e[Rt] = Dt(t.substr(0, r)), e[Yt] = Dt(t.substr(r)), m(i).bigHour = !0;
    }), Ot("hmmss", function (t, e, i) {
      var r = t.length - 4,
        s = t.length - 2;
      e[Rt] = Dt(t.substr(0, r)), e[Yt] = Dt(t.substr(r, 2)), e[zt] = Dt(t.substr(s)), m(i).bigHour = !0;
    }), Ot("Hmm", function (t, e, i) {
      var r = t.length - 2;
      e[Rt] = Dt(t.substr(0, r)), e[Yt] = Dt(t.substr(r));
    }), Ot("Hmmss", function (t, e, i) {
      var r = t.length - 4,
        s = t.length - 2;
      e[Rt] = Dt(t.substr(0, r)), e[Yt] = Dt(t.substr(r, 2)), e[zt] = Dt(t.substr(s));
    });
    var ri = /[ap]\.?m?\.?/i,
      si = qt("Hours", !0);
    function ni(t, e, i) {
      return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
    }
    var oi,
      ai = {
        calendar: D,
        longDateFormat: j,
        invalidDate: V,
        ordinal: Z,
        dayOfMonthOrdinalParse: X,
        relativeTime: q,
        months: se,
        monthsShort: ne,
        week: Ce,
        weekdays: Oe,
        weekdaysMin: Fe,
        weekdaysShort: Ie,
        meridiemParse: ri
      },
      li = {},
      hi = {};
    function ci(t, e) {
      var i,
        r = Math.min(t.length, e.length);
      for (i = 0; i < r; i += 1) if (t[i] !== e[i]) return i;
      return r;
    }
    function di(t) {
      return t ? t.toLowerCase().replace("_", "-") : t;
    }
    function ui(t) {
      for (var e, i, r, s, n = 0; n < t.length;) {
        for (e = (s = di(t[n]).split("-")).length, i = (i = di(t[n + 1])) ? i.split("-") : null; e > 0;) {
          if (r = gi(s.slice(0, e).join("-"))) return r;
          if (i && i.length >= e && ci(s, i) >= e - 1) break;
          e--;
        }
        n++;
      }
      return oi;
    }
    function pi(t) {
      return !(!t || !t.match("^[^/\\\\]*$"));
    }
    function gi(t) {
      var e = null;
      if (void 0 === li[t] && Et && Et.exports && pi(t)) try {
        e = oi._abbr, St("./locale/" + t), mi(e);
      } catch (e) {
        li[t] = null;
      }
      return li[t];
    }
    function mi(t, e) {
      var i;
      return t && ((i = l(e) ? _i(t) : fi(t, e)) ? oi = i : "undefined" != typeof console && console.warn && console.warn("Locale " + t + " not found. Did you forget to load it?")), oi._abbr;
    }
    function fi(t, e) {
      if (null !== e) {
        var i,
          r = ai;
        if (e.abbr = t, null != li[t]) A("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), r = li[t]._config;else if (null != e.parentLocale) if (null != li[e.parentLocale]) r = li[e.parentLocale]._config;else {
          if (null == (i = gi(e.parentLocale))) return hi[e.parentLocale] || (hi[e.parentLocale] = []), hi[e.parentLocale].push({
            name: t,
            config: e
          }), null;
          r = i._config;
        }
        return li[t] = new M(k(r, e)), hi[t] && hi[t].forEach(function (t) {
          fi(t.name, t.config);
        }), mi(t), li[t];
      }
      return delete li[t], null;
    }
    function yi(t, e) {
      if (null != e) {
        var i,
          r,
          s = ai;
        null != li[t] && null != li[t].parentLocale ? li[t].set(k(li[t]._config, e)) : (null != (r = gi(t)) && (s = r._config), e = k(s, e), null == r && (e.abbr = t), (i = new M(e)).parentLocale = li[t], li[t] = i), mi(t);
      } else null != li[t] && (null != li[t].parentLocale ? (li[t] = li[t].parentLocale, t === mi() && mi(t)) : null != li[t] && delete li[t]);
      return li[t];
    }
    function _i(t) {
      var e;
      if (t && t._locale && t._locale._abbr && (t = t._locale._abbr), !t) return oi;
      if (!s(t)) {
        if (e = gi(t)) return e;
        t = [t];
      }
      return ui(t);
    }
    function bi() {
      return $(li);
    }
    function vi(t) {
      var e,
        i = t._a;
      return i && -2 === m(t).overflow && (e = i[Lt] < 0 || i[Lt] > 11 ? Lt : i[Ut] < 1 || i[Ut] > re(i[Nt], i[Lt]) ? Ut : i[Rt] < 0 || i[Rt] > 24 || 24 === i[Rt] && (0 !== i[Yt] || 0 !== i[zt] || 0 !== i[jt]) ? Rt : i[Yt] < 0 || i[Yt] > 59 ? Yt : i[zt] < 0 || i[zt] > 59 ? zt : i[jt] < 0 || i[jt] > 999 ? jt : -1, m(t)._overflowDayOfYear && (e < Nt || e > Ut) && (e = Ut), m(t)._overflowWeeks && -1 === e && (e = Gt), m(t)._overflowWeekday && -1 === e && (e = Vt), m(t).overflow = e), t;
    }
    var wi = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      xi = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      Si = /Z|[+-]\d\d(?::?\d\d)?/,
      Ei = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/], ["YYYYMM", /\d{6}/, !1], ["YYYY", /\d{4}/, !1]],
      $i = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
      Ci = /^\/?Date\((-?\d+)/i,
      Ai = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
      Ti = {
        UT: 0,
        GMT: 0,
        EDT: -240,
        EST: -300,
        CDT: -300,
        CST: -360,
        MDT: -360,
        MST: -420,
        PDT: -420,
        PST: -480
      };
    function Pi(t) {
      var e,
        i,
        r,
        s,
        n,
        o,
        a = t._i,
        l = wi.exec(a) || xi.exec(a),
        h = Ei.length,
        c = $i.length;
      if (l) {
        for (m(t).iso = !0, e = 0, i = h; e < i; e++) if (Ei[e][1].exec(l[1])) {
          s = Ei[e][0], r = !1 !== Ei[e][2];
          break;
        }
        if (null == s) return void (t._isValid = !1);
        if (l[3]) {
          for (e = 0, i = c; e < i; e++) if ($i[e][1].exec(l[3])) {
            n = (l[2] || " ") + $i[e][0];
            break;
          }
          if (null == n) return void (t._isValid = !1);
        }
        if (!r && null != n) return void (t._isValid = !1);
        if (l[4]) {
          if (!Si.exec(l[4])) return void (t._isValid = !1);
          o = "Z";
        }
        t._f = s + (n || "") + (o || ""), Ri(t);
      } else t._isValid = !1;
    }
    function ki(t, e, i, r, s, n) {
      var o = [Mi(t), ne.indexOf(e), parseInt(i, 10), parseInt(r, 10), parseInt(s, 10)];
      return n && o.push(parseInt(n, 10)), o;
    }
    function Mi(t) {
      var e = parseInt(t, 10);
      return e <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
    }
    function Di(t) {
      return t.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function Hi(t, e, i) {
      return !t || Ie.indexOf(t) === new Date(e[0], e[1], e[2]).getDay() || (m(i).weekdayMismatch = !0, i._isValid = !1, !1);
    }
    function Oi(t, e, i) {
      if (t) return Ti[t];
      if (e) return 0;
      var r = parseInt(i, 10),
        s = r % 100;
      return (r - s) / 100 * 60 + s;
    }
    function Ii(t) {
      var e,
        i = Ai.exec(Di(t._i));
      if (i) {
        if (e = ki(i[4], i[3], i[2], i[5], i[6], i[7]), !Hi(i[1], e, t)) return;
        t._a = e, t._tzm = Oi(i[8], i[9], i[10]), t._d = ve.apply(null, t._a), t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), m(t).rfc2822 = !0;
      } else t._isValid = !1;
    }
    function Fi(t) {
      var e = Ci.exec(t._i);
      null === e ? (Pi(t), !1 === t._isValid && (delete t._isValid, Ii(t), !1 === t._isValid && (delete t._isValid, t._strict ? t._isValid = !1 : i.createFromInputFallback(t)))) : t._d = new Date(+e[1]);
    }
    function Bi(t, e, i) {
      return null != t ? t : null != e ? e : i;
    }
    function Ni(t) {
      var e = new Date(i.now());
      return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()];
    }
    function Li(t) {
      var e,
        i,
        r,
        s,
        n,
        o = [];
      if (!t._d) {
        for (r = Ni(t), t._w && null == t._a[Ut] && null == t._a[Lt] && Ui(t), null != t._dayOfYear && (n = Bi(t._a[Nt], r[Nt]), (t._dayOfYear > Wt(n) || 0 === t._dayOfYear) && (m(t)._overflowDayOfYear = !0), i = ve(n, 0, t._dayOfYear), t._a[Lt] = i.getUTCMonth(), t._a[Ut] = i.getUTCDate()), e = 0; e < 3 && null == t._a[e]; ++e) t._a[e] = o[e] = r[e];
        for (; e < 7; e++) t._a[e] = o[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
        24 === t._a[Rt] && 0 === t._a[Yt] && 0 === t._a[zt] && 0 === t._a[jt] && (t._nextDay = !0, t._a[Rt] = 0), t._d = (t._useUTC ? ve : be).apply(null, o), s = t._useUTC ? t._d.getUTCDay() : t._d.getDay(), null != t._tzm && t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), t._nextDay && (t._a[Rt] = 24), t._w && void 0 !== t._w.d && t._w.d !== s && (m(t).weekdayMismatch = !0);
      }
    }
    function Ui(t) {
      var e, i, r, s, n, o, a, l, h;
      null != (e = t._w).GG || null != e.W || null != e.E ? (n = 1, o = 4, i = Bi(e.GG, t._a[Nt], Se(Xi(), 1, 4).year), r = Bi(e.W, 1), ((s = Bi(e.E, 1)) < 1 || s > 7) && (l = !0)) : (n = t._locale._week.dow, o = t._locale._week.doy, h = Se(Xi(), n, o), i = Bi(e.gg, t._a[Nt], h.year), r = Bi(e.w, h.week), null != e.d ? ((s = e.d) < 0 || s > 6) && (l = !0) : null != e.e ? (s = e.e + n, (e.e < 0 || e.e > 6) && (l = !0)) : s = n), r < 1 || r > Ee(i, n, o) ? m(t)._overflowWeeks = !0 : null != l ? m(t)._overflowWeekday = !0 : (a = xe(i, r, s, n, o), t._a[Nt] = a.year, t._dayOfYear = a.dayOfYear);
    }
    function Ri(t) {
      if (t._f !== i.ISO_8601) {
        if (t._f !== i.RFC_2822) {
          t._a = [], m(t).empty = !0;
          var e,
            r,
            s,
            n,
            o,
            a,
            l,
            h = "" + t._i,
            c = h.length,
            d = 0;
          for (l = (s = z(t._f, t._locale).match(I) || []).length, e = 0; e < l; e++) n = s[e], (r = (h.match(Tt(n, t)) || [])[0]) && ((o = h.substr(0, h.indexOf(r))).length > 0 && m(t).unusedInput.push(o), h = h.slice(h.indexOf(r) + r.length), d += r.length), N[n] ? (r ? m(t).empty = !1 : m(t).unusedTokens.push(n), Ft(n, r, t)) : t._strict && !r && m(t).unusedTokens.push(n);
          m(t).charsLeftOver = c - d, h.length > 0 && m(t).unusedInput.push(h), t._a[Rt] <= 12 && !0 === m(t).bigHour && t._a[Rt] > 0 && (m(t).bigHour = void 0), m(t).parsedDateParts = t._a.slice(0), m(t).meridiem = t._meridiem, t._a[Rt] = Yi(t._locale, t._a[Rt], t._meridiem), null !== (a = m(t).era) && (t._a[Nt] = t._locale.erasConvertYear(a, t._a[Nt])), Li(t), vi(t);
        } else Ii(t);
      } else Pi(t);
    }
    function Yi(t, e, i) {
      var r;
      return null == i ? e : null != t.meridiemHour ? t.meridiemHour(e, i) : null != t.isPM ? ((r = t.isPM(i)) && e < 12 && (e += 12), r || 12 !== e || (e = 0), e) : e;
    }
    function zi(t) {
      var e,
        i,
        r,
        s,
        n,
        o,
        a = !1,
        l = t._f.length;
      if (0 === l) return m(t).invalidFormat = !0, void (t._d = new Date(NaN));
      for (s = 0; s < l; s++) n = 0, o = !1, e = v({}, t), null != t._useUTC && (e._useUTC = t._useUTC), e._f = t._f[s], Ri(e), f(e) && (o = !0), n += m(e).charsLeftOver, n += 10 * m(e).unusedTokens.length, m(e).score = n, a ? n < r && (r = n, i = e) : (null == r || n < r || o) && (r = n, i = e, o && (a = !0));
      u(t, i || e);
    }
    function ji(t) {
      if (!t._d) {
        var e = it(t._i),
          i = void 0 === e.day ? e.date : e.day;
        t._a = d([e.year, e.month, i, e.hour, e.minute, e.second, e.millisecond], function (t) {
          return t && parseInt(t, 10);
        }), Li(t);
      }
    }
    function Gi(t) {
      var e = new w(vi(Vi(t)));
      return e._nextDay && (e.add(1, "d"), e._nextDay = void 0), e;
    }
    function Vi(t) {
      var e = t._i,
        i = t._f;
      return t._locale = t._locale || _i(t._l), null === e || void 0 === i && "" === e ? y({
        nullInput: !0
      }) : ("string" == typeof e && (t._i = e = t._locale.preparse(e)), x(e) ? new w(vi(e)) : (c(e) ? t._d = e : s(i) ? zi(t) : i ? Ri(t) : Wi(t), f(t) || (t._d = null), t));
    }
    function Wi(t) {
      var e = t._i;
      l(e) ? t._d = new Date(i.now()) : c(e) ? t._d = new Date(e.valueOf()) : "string" == typeof e ? Fi(t) : s(e) ? (t._a = d(e.slice(0), function (t) {
        return parseInt(t, 10);
      }), Li(t)) : n(e) ? ji(t) : h(e) ? t._d = new Date(e) : i.createFromInputFallback(t);
    }
    function Zi(t, e, i, r, o) {
      var l = {};
      return !0 !== e && !1 !== e || (r = e, e = void 0), !0 !== i && !1 !== i || (r = i, i = void 0), (n(t) && a(t) || s(t) && 0 === t.length) && (t = void 0), l._isAMomentObject = !0, l._useUTC = l._isUTC = o, l._l = i, l._i = t, l._f = e, l._strict = r, Gi(l);
    }
    function Xi(t, e, i, r) {
      return Zi(t, e, i, r, !1);
    }
    i.createFromInputFallback = E("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (t) {
      t._d = new Date(t._i + (t._useUTC ? " UTC" : ""));
    }), i.ISO_8601 = function () {}, i.RFC_2822 = function () {};
    var Ki = E("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Xi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t < this ? this : t : y();
      }),
      qi = E("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Xi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t > this ? this : t : y();
      });
    function Ji(t, e) {
      var i, r;
      if (1 === e.length && s(e[0]) && (e = e[0]), !e.length) return Xi();
      for (i = e[0], r = 1; r < e.length; ++r) e[r].isValid() && !e[r][t](i) || (i = e[r]);
      return i;
    }
    function Qi() {
      return Ji("isBefore", [].slice.call(arguments, 0));
    }
    function tr() {
      return Ji("isAfter", [].slice.call(arguments, 0));
    }
    var er = function () {
        return Date.now ? Date.now() : +new Date();
      },
      ir = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];
    function rr(t) {
      var e,
        i,
        r = !1,
        s = ir.length;
      for (e in t) if (o(t, e) && (-1 === Zt.call(ir, e) || null != t[e] && isNaN(t[e]))) return !1;
      for (i = 0; i < s; ++i) if (t[ir[i]]) {
        if (r) return !1;
        parseFloat(t[ir[i]]) !== Dt(t[ir[i]]) && (r = !0);
      }
      return !0;
    }
    function sr() {
      return this._isValid;
    }
    function nr() {
      return Tr(NaN);
    }
    function or(t) {
      var e = it(t),
        i = e.year || 0,
        r = e.quarter || 0,
        s = e.month || 0,
        n = e.week || e.isoWeek || 0,
        o = e.day || 0,
        a = e.hour || 0,
        l = e.minute || 0,
        h = e.second || 0,
        c = e.millisecond || 0;
      this._isValid = rr(e), this._milliseconds = +c + 1e3 * h + 6e4 * l + 1e3 * a * 60 * 60, this._days = +o + 7 * n, this._months = +s + 3 * r + 12 * i, this._data = {}, this._locale = _i(), this._bubble();
    }
    function ar(t) {
      return t instanceof or;
    }
    function lr(t) {
      return t < 0 ? -1 * Math.round(-1 * t) : Math.round(t);
    }
    function hr(t, e, i) {
      var r,
        s = Math.min(t.length, e.length),
        n = Math.abs(t.length - e.length),
        o = 0;
      for (r = 0; r < s; r++) (i && t[r] !== e[r] || !i && Dt(t[r]) !== Dt(e[r])) && o++;
      return o + n;
    }
    function cr(t, e) {
      L(t, 0, 0, function () {
        var t = this.utcOffset(),
          i = "+";
        return t < 0 && (t = -t, i = "-"), i + O(~~(t / 60), 2) + e + O(~~t % 60, 2);
      });
    }
    cr("Z", ":"), cr("ZZ", ""), At("Z", vt), At("ZZ", vt), Ot(["Z", "ZZ"], function (t, e, i) {
      i._useUTC = !0, i._tzm = ur(vt, t);
    });
    var dr = /([\+\-]|\d\d)/gi;
    function ur(t, e) {
      var i,
        r,
        s = (e || "").match(t);
      return null === s ? null : 0 === (r = 60 * (i = ((s[s.length - 1] || []) + "").match(dr) || ["-", 0, 0])[1] + Dt(i[2])) ? 0 : "+" === i[0] ? r : -r;
    }
    function pr(t, e) {
      var r, s;
      return e._isUTC ? (r = e.clone(), s = (x(t) || c(t) ? t.valueOf() : Xi(t).valueOf()) - r.valueOf(), r._d.setTime(r._d.valueOf() + s), i.updateOffset(r, !1), r) : Xi(t).local();
    }
    function gr(t) {
      return -Math.round(t._d.getTimezoneOffset());
    }
    function mr(t, e, r) {
      var s,
        n = this._offset || 0;
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        if ("string" == typeof t) {
          if (null === (t = ur(vt, t))) return this;
        } else Math.abs(t) < 16 && !r && (t *= 60);
        return !this._isUTC && e && (s = gr(this)), this._offset = t, this._isUTC = !0, null != s && this.add(s, "m"), n !== t && (!e || this._changeInProgress ? Hr(this, Tr(t - n, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, i.updateOffset(this, !0), this._changeInProgress = null)), this;
      }
      return this._isUTC ? n : gr(this);
    }
    function fr(t, e) {
      return null != t ? ("string" != typeof t && (t = -t), this.utcOffset(t, e), this) : -this.utcOffset();
    }
    function yr(t) {
      return this.utcOffset(0, t);
    }
    function _r(t) {
      return this._isUTC && (this.utcOffset(0, t), this._isUTC = !1, t && this.subtract(gr(this), "m")), this;
    }
    function br() {
      if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
        var t = ur(bt, this._i);
        null != t ? this.utcOffset(t) : this.utcOffset(0, !0);
      }
      return this;
    }
    function vr(t) {
      return !!this.isValid() && (t = t ? Xi(t).utcOffset() : 0, (this.utcOffset() - t) % 60 == 0);
    }
    function wr() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function xr() {
      if (!l(this._isDSTShifted)) return this._isDSTShifted;
      var t,
        e = {};
      return v(e, this), (e = Vi(e))._a ? (t = e._isUTC ? p(e._a) : Xi(e._a), this._isDSTShifted = this.isValid() && hr(e._a, t.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
    }
    function Sr() {
      return !!this.isValid() && !this._isUTC;
    }
    function Er() {
      return !!this.isValid() && this._isUTC;
    }
    function $r() {
      return !!this.isValid() && this._isUTC && 0 === this._offset;
    }
    i.updateOffset = function () {};
    var Cr = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
      Ar = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function Tr(t, e) {
      var i,
        r,
        s,
        n = t,
        a = null;
      return ar(t) ? n = {
        ms: t._milliseconds,
        d: t._days,
        M: t._months
      } : h(t) || !isNaN(+t) ? (n = {}, e ? n[e] = +t : n.milliseconds = +t) : (a = Cr.exec(t)) ? (i = "-" === a[1] ? -1 : 1, n = {
        y: 0,
        d: Dt(a[Ut]) * i,
        h: Dt(a[Rt]) * i,
        m: Dt(a[Yt]) * i,
        s: Dt(a[zt]) * i,
        ms: Dt(lr(1e3 * a[jt])) * i
      }) : (a = Ar.exec(t)) ? (i = "-" === a[1] ? -1 : 1, n = {
        y: Pr(a[2], i),
        M: Pr(a[3], i),
        w: Pr(a[4], i),
        d: Pr(a[5], i),
        h: Pr(a[6], i),
        m: Pr(a[7], i),
        s: Pr(a[8], i)
      }) : null == n ? n = {} : "object" == typeof n && ("from" in n || "to" in n) && (s = Mr(Xi(n.from), Xi(n.to)), (n = {}).ms = s.milliseconds, n.M = s.months), r = new or(n), ar(t) && o(t, "_locale") && (r._locale = t._locale), ar(t) && o(t, "_isValid") && (r._isValid = t._isValid), r;
    }
    function Pr(t, e) {
      var i = t && parseFloat(t.replace(",", "."));
      return (isNaN(i) ? 0 : i) * e;
    }
    function kr(t, e) {
      var i = {};
      return i.months = e.month() - t.month() + 12 * (e.year() - t.year()), t.clone().add(i.months, "M").isAfter(e) && --i.months, i.milliseconds = +e - +t.clone().add(i.months, "M"), i;
    }
    function Mr(t, e) {
      var i;
      return t.isValid() && e.isValid() ? (e = pr(e, t), t.isBefore(e) ? i = kr(t, e) : ((i = kr(e, t)).milliseconds = -i.milliseconds, i.months = -i.months), i) : {
        milliseconds: 0,
        months: 0
      };
    }
    function Dr(t, e) {
      return function (i, r) {
        var s;
        return null === r || isNaN(+r) || (A(e, "moment()." + e + "(period, number) is deprecated. Please use moment()." + e + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), s = i, i = r, r = s), Hr(this, Tr(i, r), t), this;
      };
    }
    function Hr(t, e, r, s) {
      var n = e._milliseconds,
        o = lr(e._days),
        a = lr(e._months);
      t.isValid() && (s = s ?? !0, a && pe(t, Jt(t, "Month") + a * r), o && Qt(t, "Date", Jt(t, "Date") + o * r), n && t._d.setTime(t._d.valueOf() + n * r), s && i.updateOffset(t, o || a));
    }
    Tr.fn = or.prototype, Tr.invalid = nr;
    var Or = Dr(1, "add"),
      Ir = Dr(-1, "subtract");
    function Fr(t) {
      return "string" == typeof t || t instanceof String;
    }
    function Br(t) {
      return x(t) || c(t) || Fr(t) || h(t) || Lr(t) || Nr(t) || null == t;
    }
    function Nr(t) {
      var e,
        i,
        r = n(t) && !a(t),
        s = !1,
        l = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"],
        h = l.length;
      for (e = 0; e < h; e += 1) i = l[e], s = s || o(t, i);
      return r && s;
    }
    function Lr(t) {
      var e = s(t),
        i = !1;
      return e && (i = 0 === t.filter(function (e) {
        return !h(e) && Fr(t);
      }).length), e && i;
    }
    function Ur(t) {
      var e,
        i,
        r = n(t) && !a(t),
        s = !1,
        l = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"];
      for (e = 0; e < l.length; e += 1) i = l[e], s = s || o(t, i);
      return r && s;
    }
    function Rr(t, e) {
      var i = t.diff(e, "days", !0);
      return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
    }
    function Yr(t, e) {
      1 === arguments.length && (arguments[0] ? Br(arguments[0]) ? (t = arguments[0], e = void 0) : Ur(arguments[0]) && (e = arguments[0], t = void 0) : (t = void 0, e = void 0));
      var r = t || Xi(),
        s = pr(r, this).startOf("day"),
        n = i.calendarFormat(this, s) || "sameElse",
        o = e && (T(e[n]) ? e[n].call(this, r) : e[n]);
      return this.format(o || this.localeData().calendar(n, this, Xi(r)));
    }
    function zr() {
      return new w(this);
    }
    function jr(t, e) {
      var i = x(t) ? t : Xi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(e).valueOf());
    }
    function Gr(t, e) {
      var i = x(t) ? t : Xi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(e).valueOf() < i.valueOf());
    }
    function Vr(t, e, i, r) {
      var s = x(t) ? t : Xi(t),
        n = x(e) ? e : Xi(e);
      return !!(this.isValid() && s.isValid() && n.isValid()) && ("(" === (r = r || "()")[0] ? this.isAfter(s, i) : !this.isBefore(s, i)) && (")" === r[1] ? this.isBefore(n, i) : !this.isAfter(n, i));
    }
    function Wr(t, e) {
      var i,
        r = x(t) ? t : Xi(t);
      return !(!this.isValid() || !r.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() === r.valueOf() : (i = r.valueOf(), this.clone().startOf(e).valueOf() <= i && i <= this.clone().endOf(e).valueOf()));
    }
    function Zr(t, e) {
      return this.isSame(t, e) || this.isAfter(t, e);
    }
    function Xr(t, e) {
      return this.isSame(t, e) || this.isBefore(t, e);
    }
    function Kr(t, e, i) {
      var r, s, n;
      if (!this.isValid()) return NaN;
      if (!(r = pr(t, this)).isValid()) return NaN;
      switch (s = 6e4 * (r.utcOffset() - this.utcOffset()), e = et(e)) {
        case "year":
          n = qr(this, r) / 12;
          break;
        case "month":
          n = qr(this, r);
          break;
        case "quarter":
          n = qr(this, r) / 3;
          break;
        case "second":
          n = (this - r) / 1e3;
          break;
        case "minute":
          n = (this - r) / 6e4;
          break;
        case "hour":
          n = (this - r) / 36e5;
          break;
        case "day":
          n = (this - r - s) / 864e5;
          break;
        case "week":
          n = (this - r - s) / 6048e5;
          break;
        default:
          n = this - r;
      }
      return i ? n : Mt(n);
    }
    function qr(t, e) {
      if (t.date() < e.date()) return -qr(e, t);
      var i = 12 * (e.year() - t.year()) + (e.month() - t.month()),
        r = t.clone().add(i, "months");
      return -(i + (e - r < 0 ? (e - r) / (r - t.clone().add(i - 1, "months")) : (e - r) / (t.clone().add(i + 1, "months") - r))) || 0;
    }
    function Jr() {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function Qr(t) {
      if (!this.isValid()) return null;
      var e = !0 !== t,
        i = e ? this.clone().utc() : this;
      return i.year() < 0 || i.year() > 9999 ? Y(i, e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : T(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", Y(i, "Z")) : Y(i, e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function ts() {
      if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
      var t,
        e,
        i,
        r,
        s = "moment",
        n = "";
      return this.isLocal() || (s = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", n = "Z"), t = "[" + s + '("]', e = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = "-MM-DD[T]HH:mm:ss.SSS", r = n + '[")]', this.format(t + e + i + r);
    }
    function es(t) {
      t || (t = this.isUtc() ? i.defaultFormatUtc : i.defaultFormat);
      var e = Y(this, t);
      return this.localeData().postformat(e);
    }
    function is(t, e) {
      return this.isValid() && (x(t) && t.isValid() || Xi(t).isValid()) ? Tr({
        to: this,
        from: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function rs(t) {
      return this.from(Xi(), t);
    }
    function ss(t, e) {
      return this.isValid() && (x(t) && t.isValid() || Xi(t).isValid()) ? Tr({
        from: this,
        to: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function ns(t) {
      return this.to(Xi(), t);
    }
    function os(t) {
      var e;
      return void 0 === t ? this._locale._abbr : (null != (e = _i(t)) && (this._locale = e), this);
    }
    i.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", i.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var as = E("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (t) {
      return void 0 === t ? this.localeData() : this.locale(t);
    });
    function ls() {
      return this._locale;
    }
    var hs = 1e3,
      cs = 60 * hs,
      ds = 60 * cs,
      us = 3506328 * ds;
    function ps(t, e) {
      return (t % e + e) % e;
    }
    function gs(t, e, i) {
      return t < 100 && t >= 0 ? new Date(t + 400, e, i) - us : new Date(t, e, i).valueOf();
    }
    function ms(t, e, i) {
      return t < 100 && t >= 0 ? Date.UTC(t + 400, e, i) - us : Date.UTC(t, e, i);
    }
    function fs(t) {
      var e, r;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (r = this._isUTC ? ms : gs, t) {
        case "year":
          e = r(this.year(), 0, 1);
          break;
        case "quarter":
          e = r(this.year(), this.month() - this.month() % 3, 1);
          break;
        case "month":
          e = r(this.year(), this.month(), 1);
          break;
        case "week":
          e = r(this.year(), this.month(), this.date() - this.weekday());
          break;
        case "isoWeek":
          e = r(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
          break;
        case "day":
        case "date":
          e = r(this.year(), this.month(), this.date());
          break;
        case "hour":
          e = this._d.valueOf(), e -= ps(e + (this._isUTC ? 0 : this.utcOffset() * cs), ds);
          break;
        case "minute":
          e = this._d.valueOf(), e -= ps(e, cs);
          break;
        case "second":
          e = this._d.valueOf(), e -= ps(e, hs);
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function ys(t) {
      var e, r;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (r = this._isUTC ? ms : gs, t) {
        case "year":
          e = r(this.year() + 1, 0, 1) - 1;
          break;
        case "quarter":
          e = r(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
          break;
        case "month":
          e = r(this.year(), this.month() + 1, 1) - 1;
          break;
        case "week":
          e = r(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
          break;
        case "isoWeek":
          e = r(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
          break;
        case "day":
        case "date":
          e = r(this.year(), this.month(), this.date() + 1) - 1;
          break;
        case "hour":
          e = this._d.valueOf(), e += ds - ps(e + (this._isUTC ? 0 : this.utcOffset() * cs), ds) - 1;
          break;
        case "minute":
          e = this._d.valueOf(), e += cs - ps(e, cs) - 1;
          break;
        case "second":
          e = this._d.valueOf(), e += hs - ps(e, hs) - 1;
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function _s() {
      return this._d.valueOf() - 6e4 * (this._offset || 0);
    }
    function bs() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function vs() {
      return new Date(this.valueOf());
    }
    function ws() {
      var t = this;
      return [t.year(), t.month(), t.date(), t.hour(), t.minute(), t.second(), t.millisecond()];
    }
    function xs() {
      var t = this;
      return {
        years: t.year(),
        months: t.month(),
        date: t.date(),
        hours: t.hours(),
        minutes: t.minutes(),
        seconds: t.seconds(),
        milliseconds: t.milliseconds()
      };
    }
    function Ss() {
      return this.isValid() ? this.toISOString() : null;
    }
    function Es() {
      return f(this);
    }
    function $s() {
      return u({}, m(this));
    }
    function Cs() {
      return m(this).overflow;
    }
    function As() {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
      };
    }
    function Ts(t, e) {
      var r,
        s,
        n,
        o = this._eras || _i("en")._eras;
      for (r = 0, s = o.length; r < s; ++r) switch ("string" == typeof o[r].since && (n = i(o[r].since).startOf("day"), o[r].since = n.valueOf()), typeof o[r].until) {
        case "undefined":
          o[r].until = 1 / 0;
          break;
        case "string":
          n = i(o[r].until).startOf("day").valueOf(), o[r].until = n.valueOf();
      }
      return o;
    }
    function Ps(t, e, i) {
      var r,
        s,
        n,
        o,
        a,
        l = this.eras();
      for (t = t.toUpperCase(), r = 0, s = l.length; r < s; ++r) if (n = l[r].name.toUpperCase(), o = l[r].abbr.toUpperCase(), a = l[r].narrow.toUpperCase(), i) switch (e) {
        case "N":
        case "NN":
        case "NNN":
          if (o === t) return l[r];
          break;
        case "NNNN":
          if (n === t) return l[r];
          break;
        case "NNNNN":
          if (a === t) return l[r];
      } else if ([n, o, a].indexOf(t) >= 0) return l[r];
    }
    function ks(t, e) {
      var r = t.since <= t.until ? 1 : -1;
      return void 0 === e ? i(t.since).year() : i(t.since).year() + (e - t.offset) * r;
    }
    function Ms() {
      var t,
        e,
        i,
        r = this.localeData().eras();
      for (t = 0, e = r.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), r[t].since <= i && i <= r[t].until) return r[t].name;
        if (r[t].until <= i && i <= r[t].since) return r[t].name;
      }
      return "";
    }
    function Ds() {
      var t,
        e,
        i,
        r = this.localeData().eras();
      for (t = 0, e = r.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), r[t].since <= i && i <= r[t].until) return r[t].narrow;
        if (r[t].until <= i && i <= r[t].since) return r[t].narrow;
      }
      return "";
    }
    function Hs() {
      var t,
        e,
        i,
        r = this.localeData().eras();
      for (t = 0, e = r.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), r[t].since <= i && i <= r[t].until) return r[t].abbr;
        if (r[t].until <= i && i <= r[t].since) return r[t].abbr;
      }
      return "";
    }
    function Os() {
      var t,
        e,
        r,
        s,
        n = this.localeData().eras();
      for (t = 0, e = n.length; t < e; ++t) if (r = n[t].since <= n[t].until ? 1 : -1, s = this.clone().startOf("day").valueOf(), n[t].since <= s && s <= n[t].until || n[t].until <= s && s <= n[t].since) return (this.year() - i(n[t].since).year()) * r + n[t].offset;
      return this.year();
    }
    function Is(t) {
      return o(this, "_erasNameRegex") || Ys.call(this), t ? this._erasNameRegex : this._erasRegex;
    }
    function Fs(t) {
      return o(this, "_erasAbbrRegex") || Ys.call(this), t ? this._erasAbbrRegex : this._erasRegex;
    }
    function Bs(t) {
      return o(this, "_erasNarrowRegex") || Ys.call(this), t ? this._erasNarrowRegex : this._erasRegex;
    }
    function Ns(t, e) {
      return e.erasAbbrRegex(t);
    }
    function Ls(t, e) {
      return e.erasNameRegex(t);
    }
    function Us(t, e) {
      return e.erasNarrowRegex(t);
    }
    function Rs(t, e) {
      return e._eraYearOrdinalRegex || yt;
    }
    function Ys() {
      var t,
        e,
        i,
        r,
        s,
        n = [],
        o = [],
        a = [],
        l = [],
        h = this.eras();
      for (t = 0, e = h.length; t < e; ++t) i = kt(h[t].name), r = kt(h[t].abbr), s = kt(h[t].narrow), o.push(i), n.push(r), a.push(s), l.push(i), l.push(r), l.push(s);
      this._erasRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + n.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + a.join("|") + ")", "i");
    }
    function zs(t, e) {
      L(0, [t, t.length], 0, e);
    }
    function js(t) {
      return Ks.call(this, t, this.week(), this.weekday() + this.localeData()._week.dow, this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function Gs(t) {
      return Ks.call(this, t, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function Vs() {
      return Ee(this.year(), 1, 4);
    }
    function Ws() {
      return Ee(this.isoWeekYear(), 1, 4);
    }
    function Zs() {
      var t = this.localeData()._week;
      return Ee(this.year(), t.dow, t.doy);
    }
    function Xs() {
      var t = this.localeData()._week;
      return Ee(this.weekYear(), t.dow, t.doy);
    }
    function Ks(t, e, i, r, s) {
      var n;
      return null == t ? Se(this, r, s).year : (e > (n = Ee(t, r, s)) && (e = n), qs.call(this, t, e, i, r, s));
    }
    function qs(t, e, i, r, s) {
      var n = xe(t, e, i, r, s),
        o = ve(n.year, 0, n.dayOfYear);
      return this.year(o.getUTCFullYear()), this.month(o.getUTCMonth()), this.date(o.getUTCDate()), this;
    }
    function Js(t) {
      return null == t ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (t - 1) + this.month() % 3);
    }
    L("N", 0, 0, "eraAbbr"), L("NN", 0, 0, "eraAbbr"), L("NNN", 0, 0, "eraAbbr"), L("NNNN", 0, 0, "eraName"), L("NNNNN", 0, 0, "eraNarrow"), L("y", ["y", 1], "yo", "eraYear"), L("y", ["yy", 2], 0, "eraYear"), L("y", ["yyy", 3], 0, "eraYear"), L("y", ["yyyy", 4], 0, "eraYear"), At("N", Ns), At("NN", Ns), At("NNN", Ns), At("NNNN", Ls), At("NNNNN", Us), Ot(["N", "NN", "NNN", "NNNN", "NNNNN"], function (t, e, i, r) {
      var s = i._locale.erasParse(t, r, i._strict);
      s ? m(i).era = s : m(i).invalidEra = t;
    }), At("y", yt), At("yy", yt), At("yyy", yt), At("yyyy", yt), At("yo", Rs), Ot(["y", "yy", "yyy", "yyyy"], Nt), Ot(["yo"], function (t, e, i, r) {
      var s;
      i._locale._eraYearOrdinalRegex && (s = t.match(i._locale._eraYearOrdinalRegex)), i._locale.eraYearOrdinalParse ? e[Nt] = i._locale.eraYearOrdinalParse(t, s) : e[Nt] = parseInt(t, 10);
    }), L(0, ["gg", 2], 0, function () {
      return this.weekYear() % 100;
    }), L(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    }), zs("gggg", "weekYear"), zs("ggggg", "weekYear"), zs("GGGG", "isoWeekYear"), zs("GGGGG", "isoWeekYear"), At("G", _t), At("g", _t), At("GG", dt, at), At("gg", dt, at), At("GGGG", mt, ht), At("gggg", mt, ht), At("GGGGG", ft, ct), At("ggggg", ft, ct), It(["gggg", "ggggg", "GGGG", "GGGGG"], function (t, e, i, r) {
      e[r.substr(0, 2)] = Dt(t);
    }), It(["gg", "GG"], function (t, e, r, s) {
      e[s] = i.parseTwoDigitYear(t);
    }), L("Q", 0, "Qo", "quarter"), At("Q", ot), Ot("Q", function (t, e) {
      e[Lt] = 3 * (Dt(t) - 1);
    }), L("D", ["DD", 2], "Do", "date"), At("D", dt, $t), At("DD", dt, at), At("Do", function (t, e) {
      return t ? e._dayOfMonthOrdinalParse || e._ordinalParse : e._dayOfMonthOrdinalParseLenient;
    }), Ot(["D", "DD"], Ut), Ot("Do", function (t, e) {
      e[Ut] = Dt(t.match(dt)[0]);
    });
    var Qs = qt("Date", !0);
    function tn(t) {
      var e = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
      return null == t ? e : this.add(t - e, "d");
    }
    L("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), At("DDD", gt), At("DDDD", lt), Ot(["DDD", "DDDD"], function (t, e, i) {
      i._dayOfYear = Dt(t);
    }), L("m", ["mm", 2], 0, "minute"), At("m", dt, Ct), At("mm", dt, at), Ot(["m", "mm"], Yt);
    var en = qt("Minutes", !1);
    L("s", ["ss", 2], 0, "second"), At("s", dt, Ct), At("ss", dt, at), Ot(["s", "ss"], zt);
    var rn,
      sn,
      nn = qt("Seconds", !1);
    for (L("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    }), L(0, ["SS", 2], 0, function () {
      return ~~(this.millisecond() / 10);
    }), L(0, ["SSS", 3], 0, "millisecond"), L(0, ["SSSS", 4], 0, function () {
      return 10 * this.millisecond();
    }), L(0, ["SSSSS", 5], 0, function () {
      return 100 * this.millisecond();
    }), L(0, ["SSSSSS", 6], 0, function () {
      return 1e3 * this.millisecond();
    }), L(0, ["SSSSSSS", 7], 0, function () {
      return 1e4 * this.millisecond();
    }), L(0, ["SSSSSSSS", 8], 0, function () {
      return 1e5 * this.millisecond();
    }), L(0, ["SSSSSSSSS", 9], 0, function () {
      return 1e6 * this.millisecond();
    }), At("S", gt, ot), At("SS", gt, at), At("SSS", gt, lt), rn = "SSSS"; rn.length <= 9; rn += "S") At(rn, yt);
    function on(t, e) {
      e[jt] = Dt(1e3 * ("0." + t));
    }
    for (rn = "S"; rn.length <= 9; rn += "S") Ot(rn, on);
    function an() {
      return this._isUTC ? "UTC" : "";
    }
    function ln() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    sn = qt("Milliseconds", !1), L("z", 0, 0, "zoneAbbr"), L("zz", 0, 0, "zoneName");
    var hn = w.prototype;
    function cn(t) {
      return Xi(1e3 * t);
    }
    function dn() {
      return Xi.apply(null, arguments).parseZone();
    }
    function un(t) {
      return t;
    }
    hn.add = Or, hn.calendar = Yr, hn.clone = zr, hn.diff = Kr, hn.endOf = ys, hn.format = es, hn.from = is, hn.fromNow = rs, hn.to = ss, hn.toNow = ns, hn.get = te, hn.invalidAt = Cs, hn.isAfter = jr, hn.isBefore = Gr, hn.isBetween = Vr, hn.isSame = Wr, hn.isSameOrAfter = Zr, hn.isSameOrBefore = Xr, hn.isValid = Es, hn.lang = as, hn.locale = os, hn.localeData = ls, hn.max = qi, hn.min = Ki, hn.parsingFlags = $s, hn.set = ee, hn.startOf = fs, hn.subtract = Ir, hn.toArray = ws, hn.toObject = xs, hn.toDate = vs, hn.toISOString = Qr, hn.inspect = ts, "undefined" != typeof Symbol && null != Symbol.for && (hn[Symbol.for("nodejs.util.inspect.custom")] = function () {
      return "Moment<" + this.format() + ">";
    }), hn.toJSON = Ss, hn.toString = Jr, hn.unix = bs, hn.valueOf = _s, hn.creationData = As, hn.eraName = Ms, hn.eraNarrow = Ds, hn.eraAbbr = Hs, hn.eraYear = Os, hn.year = Xt, hn.isLeapYear = Kt, hn.weekYear = js, hn.isoWeekYear = Gs, hn.quarter = hn.quarters = Js, hn.month = ge, hn.daysInMonth = me, hn.week = hn.weeks = Pe, hn.isoWeek = hn.isoWeeks = ke, hn.weeksInYear = Zs, hn.weeksInWeekYear = Xs, hn.isoWeeksInYear = Vs, hn.isoWeeksInISOWeekYear = Ws, hn.date = Qs, hn.day = hn.days = Ge, hn.weekday = Ve, hn.isoWeekday = We, hn.dayOfYear = tn, hn.hour = hn.hours = si, hn.minute = hn.minutes = en, hn.second = hn.seconds = nn, hn.millisecond = hn.milliseconds = sn, hn.utcOffset = mr, hn.utc = yr, hn.local = _r, hn.parseZone = br, hn.hasAlignedHourOffset = vr, hn.isDST = wr, hn.isLocal = Sr, hn.isUtcOffset = Er, hn.isUtc = $r, hn.isUTC = $r, hn.zoneAbbr = an, hn.zoneName = ln, hn.dates = E("dates accessor is deprecated. Use date instead.", Qs), hn.months = E("months accessor is deprecated. Use month instead", ge), hn.years = E("years accessor is deprecated. Use year instead", Xt), hn.zone = E("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", fr), hn.isDSTShifted = E("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", xr);
    var pn = M.prototype;
    function gn(t, e, i, r) {
      var s = _i(),
        n = p().set(r, e);
      return s[i](n, t);
    }
    function mn(t, e, i) {
      if (h(t) && (e = t, t = void 0), t = t || "", null != e) return gn(t, e, i, "month");
      var r,
        s = [];
      for (r = 0; r < 12; r++) s[r] = gn(t, r, i, "month");
      return s;
    }
    function fn(t, e, i, r) {
      "boolean" == typeof t ? (h(e) && (i = e, e = void 0), e = e || "") : (i = e = t, t = !1, h(e) && (i = e, e = void 0), e = e || "");
      var s,
        n = _i(),
        o = t ? n._week.dow : 0,
        a = [];
      if (null != i) return gn(e, (i + o) % 7, r, "day");
      for (s = 0; s < 7; s++) a[s] = gn(e, (s + o) % 7, r, "day");
      return a;
    }
    function yn(t, e) {
      return mn(t, e, "months");
    }
    function _n(t, e) {
      return mn(t, e, "monthsShort");
    }
    function bn(t, e, i) {
      return fn(t, e, i, "weekdays");
    }
    function vn(t, e, i) {
      return fn(t, e, i, "weekdaysShort");
    }
    function wn(t, e, i) {
      return fn(t, e, i, "weekdaysMin");
    }
    pn.calendar = H, pn.longDateFormat = G, pn.invalidDate = W, pn.ordinal = K, pn.preparse = un, pn.postformat = un, pn.relativeTime = J, pn.pastFuture = Q, pn.set = P, pn.eras = Ts, pn.erasParse = Ps, pn.erasConvertYear = ks, pn.erasAbbrRegex = Fs, pn.erasNameRegex = Is, pn.erasNarrowRegex = Bs, pn.months = he, pn.monthsShort = ce, pn.monthsParse = ue, pn.monthsRegex = ye, pn.monthsShortRegex = fe, pn.week = $e, pn.firstDayOfYear = Te, pn.firstDayOfWeek = Ae, pn.weekdays = Ue, pn.weekdaysMin = Ye, pn.weekdaysShort = Re, pn.weekdaysParse = je, pn.weekdaysRegex = Ze, pn.weekdaysShortRegex = Xe, pn.weekdaysMinRegex = Ke, pn.isPM = ii, pn.meridiem = ni, mi("en", {
      eras: [{
        since: "0001-01-01",
        until: 1 / 0,
        offset: 1,
        name: "Anno Domini",
        narrow: "AD",
        abbr: "AD"
      }, {
        since: "0000-12-31",
        until: -1 / 0,
        offset: 1,
        name: "Before Christ",
        narrow: "BC",
        abbr: "BC"
      }],
      dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
      ordinal: function (t) {
        var e = t % 10;
        return t + (1 === Dt(t % 100 / 10) ? "th" : 1 === e ? "st" : 2 === e ? "nd" : 3 === e ? "rd" : "th");
      }
    }), i.lang = E("moment.lang is deprecated. Use moment.locale instead.", mi), i.langData = E("moment.langData is deprecated. Use moment.localeData instead.", _i);
    var xn = Math.abs;
    function Sn() {
      var t = this._data;
      return this._milliseconds = xn(this._milliseconds), this._days = xn(this._days), this._months = xn(this._months), t.milliseconds = xn(t.milliseconds), t.seconds = xn(t.seconds), t.minutes = xn(t.minutes), t.hours = xn(t.hours), t.months = xn(t.months), t.years = xn(t.years), this;
    }
    function En(t, e, i, r) {
      var s = Tr(e, i);
      return t._milliseconds += r * s._milliseconds, t._days += r * s._days, t._months += r * s._months, t._bubble();
    }
    function $n(t, e) {
      return En(this, t, e, 1);
    }
    function Cn(t, e) {
      return En(this, t, e, -1);
    }
    function An(t) {
      return t < 0 ? Math.floor(t) : Math.ceil(t);
    }
    function Tn() {
      var t,
        e,
        i,
        r,
        s,
        n = this._milliseconds,
        o = this._days,
        a = this._months,
        l = this._data;
      return n >= 0 && o >= 0 && a >= 0 || n <= 0 && o <= 0 && a <= 0 || (n += 864e5 * An(kn(a) + o), o = 0, a = 0), l.milliseconds = n % 1e3, t = Mt(n / 1e3), l.seconds = t % 60, e = Mt(t / 60), l.minutes = e % 60, i = Mt(e / 60), l.hours = i % 24, o += Mt(i / 24), a += s = Mt(Pn(o)), o -= An(kn(s)), r = Mt(a / 12), a %= 12, l.days = o, l.months = a, l.years = r, this;
    }
    function Pn(t) {
      return 4800 * t / 146097;
    }
    function kn(t) {
      return 146097 * t / 4800;
    }
    function Mn(t) {
      if (!this.isValid()) return NaN;
      var e,
        i,
        r = this._milliseconds;
      if ("month" === (t = et(t)) || "quarter" === t || "year" === t) switch (e = this._days + r / 864e5, i = this._months + Pn(e), t) {
        case "month":
          return i;
        case "quarter":
          return i / 3;
        case "year":
          return i / 12;
      } else switch (e = this._days + Math.round(kn(this._months)), t) {
        case "week":
          return e / 7 + r / 6048e5;
        case "day":
          return e + r / 864e5;
        case "hour":
          return 24 * e + r / 36e5;
        case "minute":
          return 1440 * e + r / 6e4;
        case "second":
          return 86400 * e + r / 1e3;
        case "millisecond":
          return Math.floor(864e5 * e) + r;
        default:
          throw new Error("Unknown unit " + t);
      }
    }
    function Dn(t) {
      return function () {
        return this.as(t);
      };
    }
    var Hn = Dn("ms"),
      On = Dn("s"),
      In = Dn("m"),
      Fn = Dn("h"),
      Bn = Dn("d"),
      Nn = Dn("w"),
      Ln = Dn("M"),
      Un = Dn("Q"),
      Rn = Dn("y"),
      Yn = Hn;
    function zn() {
      return Tr(this);
    }
    function jn(t) {
      return t = et(t), this.isValid() ? this[t + "s"]() : NaN;
    }
    function Gn(t) {
      return function () {
        return this.isValid() ? this._data[t] : NaN;
      };
    }
    var Vn = Gn("milliseconds"),
      Wn = Gn("seconds"),
      Zn = Gn("minutes"),
      Xn = Gn("hours"),
      Kn = Gn("days"),
      qn = Gn("months"),
      Jn = Gn("years");
    function Qn() {
      return Mt(this.days() / 7);
    }
    var to = Math.round,
      eo = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
      };
    function io(t, e, i, r, s) {
      return s.relativeTime(e || 1, !!i, t, r);
    }
    function ro(t, e, i, r) {
      var s = Tr(t).abs(),
        n = to(s.as("s")),
        o = to(s.as("m")),
        a = to(s.as("h")),
        l = to(s.as("d")),
        h = to(s.as("M")),
        c = to(s.as("w")),
        d = to(s.as("y")),
        u = n <= i.ss && ["s", n] || n < i.s && ["ss", n] || o <= 1 && ["m"] || o < i.m && ["mm", o] || a <= 1 && ["h"] || a < i.h && ["hh", a] || l <= 1 && ["d"] || l < i.d && ["dd", l];
      return null != i.w && (u = u || c <= 1 && ["w"] || c < i.w && ["ww", c]), (u = u || h <= 1 && ["M"] || h < i.M && ["MM", h] || d <= 1 && ["y"] || ["yy", d])[2] = e, u[3] = +t > 0, u[4] = r, io.apply(null, u);
    }
    function so(t) {
      return void 0 === t ? to : "function" == typeof t && (to = t, !0);
    }
    function no(t, e) {
      return void 0 !== eo[t] && (void 0 === e ? eo[t] : (eo[t] = e, "s" === t && (eo.ss = e - 1), !0));
    }
    function oo(t, e) {
      if (!this.isValid()) return this.localeData().invalidDate();
      var i,
        r,
        s = !1,
        n = eo;
      return "object" == typeof t && (e = t, t = !1), "boolean" == typeof t && (s = t), "object" == typeof e && (n = Object.assign({}, eo, e), null != e.s && null == e.ss && (n.ss = e.s - 1)), r = ro(this, !s, n, i = this.localeData()), s && (r = i.pastFuture(+this, r)), i.postformat(r);
    }
    var ao = Math.abs;
    function lo(t) {
      return (t > 0) - (t < 0) || +t;
    }
    function ho() {
      if (!this.isValid()) return this.localeData().invalidDate();
      var t,
        e,
        i,
        r,
        s,
        n,
        o,
        a,
        l = ao(this._milliseconds) / 1e3,
        h = ao(this._days),
        c = ao(this._months),
        d = this.asSeconds();
      return d ? (t = Mt(l / 60), e = Mt(t / 60), l %= 60, t %= 60, i = Mt(c / 12), c %= 12, r = l ? l.toFixed(3).replace(/\.?0+$/, "") : "", s = d < 0 ? "-" : "", n = lo(this._months) !== lo(d) ? "-" : "", o = lo(this._days) !== lo(d) ? "-" : "", a = lo(this._milliseconds) !== lo(d) ? "-" : "", s + "P" + (i ? n + i + "Y" : "") + (c ? n + c + "M" : "") + (h ? o + h + "D" : "") + (e || t || l ? "T" : "") + (e ? a + e + "H" : "") + (t ? a + t + "M" : "") + (l ? a + r + "S" : "")) : "P0D";
    }
    var co = or.prototype;
    return co.isValid = sr, co.abs = Sn, co.add = $n, co.subtract = Cn, co.as = Mn, co.asMilliseconds = Hn, co.asSeconds = On, co.asMinutes = In, co.asHours = Fn, co.asDays = Bn, co.asWeeks = Nn, co.asMonths = Ln, co.asQuarters = Un, co.asYears = Rn, co.valueOf = Yn, co._bubble = Tn, co.clone = zn, co.get = jn, co.milliseconds = Vn, co.seconds = Wn, co.minutes = Zn, co.hours = Xn, co.days = Kn, co.weeks = Qn, co.months = qn, co.years = Jn, co.humanize = oo, co.toISOString = ho, co.toString = ho, co.toJSON = ho, co.locale = os, co.localeData = ls, co.toIsoString = E("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", ho), co.lang = as, L("X", 0, 0, "unix"), L("x", 0, 0, "valueOf"), At("x", _t), At("X", wt), Ot("X", function (t, e, i) {
      i._d = new Date(1e3 * parseFloat(t));
    }), Ot("x", function (t, e, i) {
      i._d = new Date(Dt(t));
    }),
    //! moment.js
    i.version = "2.30.1", r(Xi), i.fn = hn, i.min = Qi, i.max = tr, i.now = er, i.utc = p, i.unix = cn, i.months = yn, i.isDate = c, i.locale = mi, i.invalid = y, i.duration = Tr, i.isMoment = x, i.weekdays = bn, i.parseZone = dn, i.localeData = _i, i.isDuration = ar, i.monthsShort = _n, i.weekdaysMin = wn, i.defineLocale = fi, i.updateLocale = yi, i.locales = bi, i.weekdaysShort = vn, i.normalizeUnits = et, i.relativeTimeRounding = so, i.relativeTimeThreshold = no, i.calendarFormat = Rr, i.prototype = hn, i.HTML5_FMT = {
      DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
      DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
      DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
      DATE: "YYYY-MM-DD",
      TIME: "HH:mm",
      TIME_SECONDS: "HH:mm:ss",
      TIME_MS: "HH:mm:ss.SSS",
      WEEK: "GGGG-[W]WW",
      MONTH: "YYYY-MM"
    }, i;
  }();
  var Ct = xt($t.exports);
  const At = (t, e, i, r) => {
    r = r || {}, i = i ?? {};
    const s = new Event(e, {
      bubbles: void 0 === r.bubbles || r.bubbles,
      cancelable: Boolean(r.cancelable),
      composed: void 0 === r.composed || r.composed
    });
    return s.detail = i, t.dispatchEvent(s), s;
  };
  var Tt, Pt, kt, Mt, Dt, Ht;
  !function (t) {
    t.ETA = "ETA", t.Elapsed = "Elapsed", t.Remaining = "Remaining";
  }(Tt || (Tt = {})), function (t) {
    t.F = "F", t.C = "C";
  }(Pt || (Pt = {})), function (t) {
    t.Status = "Status", t.PrinterOnline = "Online", t.Availability = "Availability", t.ProjectName = "Project", t.CurrentLayer = "Layer";
  }(kt || (kt = {})), function (t) {
    t.HotendCurrent = "Hotend", t.BedCurrent = "Bed", t.HotendTarget = "T Hotend", t.BedTarget = "T Bed", t.DryingStatus = "Dry Status", t.DryingTime = "Dry Time", t.SpeedMode = "Speed Mode", t.FanSpeed = "Fan Speed";
  }(Mt || (Mt = {})), function (t) {
    t.DryingStatus = "Dry Status", t.DryingTime = "Dry Time";
  }(Dt || (Dt = {})), function (t) {
    t.OnTime = "On Time", t.OffTime = "Off Time", t.BottomTime = "Bottom Time", t.ModelHeight = "Model Height", t.BottomLayers = "Bottom Layers", t.ZUpHeight = "Z Up Height", t.ZUpSpeed = "Z Up Speed", t.ZDownSpeed = "Z Down Speed";
  }(Ht || (Ht = {}));
  const Ot = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, Tt), kt), Mt), Dt), Ht);
  var It, Ft;
  !function (t) {
    t.PLA = "PLA", t.PETG = "PETG", t.ABS = "ABS", t.PACF = "PACF", t.PC = "PC", t.ASA = "ASA", t.HIPS = "HIPS", t.PA = "PA", t.PLA_SE = "PLA_SE";
  }(It || (It = {})), function (t) {
    t.PAUSE = "pause", t.RESUME = "resume", t.CANCEL = "cancel";
  }(Ft || (Ft = {}));
  const Bt = ["width", "height", "left", "top"];
  function Nt(t, e) {
    Object.keys(e).forEach(t => {
      Bt.includes(t) && !isNaN(e[t]) && (e[t] = e[t].toString() + "px");
    }), t && Object.assign(t.style, e);
  }
  function Lt(t) {
    return t.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  }
  function Ut(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function Rt(t, e, i, r) {
    const s = function (t, e) {
      const i = Ut(t, e);
      return i ? String(i.state) : "";
    }(t, e);
    return "on" === s ? i : r;
  }
  function Yt(t) {
    const e = {};
    for (const i in t.devices) {
      const r = t.devices[i];
      "Anycubic" === r.manufacturer && (e[r.id] = r);
    }
    return e;
  }
  function zt(t, e) {
    const i = {};
    for (const r in t.entities) {
      const s = t.entities[r];
      s.device_id === e && (i[s.entity_id] = s);
    }
    return i;
  }
  function jt(t, e, i) {
    return e + "." + t + i;
  }
  function Gt(t, e, i, r) {
    for (const s in t) {
      const n = t[s],
        o = s.split("."),
        a = o[0],
        l = o[1].split(e)[1];
      if (a === i && l === r) return n;
    }
  }
  function Vt(t) {
    for (const e in t) {
      const t = e.split("."),
        i = t[0],
        r = t[1];
      if ("binary_sensor" === i && r.endsWith("printer_online")) return r.split("printer_online")[0];
    }
  }
  function Wt(t, e, i, r) {
    return function (t, e, i, r, s = "unavailable", n = {}) {
      return Ut(t, Gt(e, i, "button", r)) || {
        state: s,
        attributes: n
      };
    }(t, e, i, r, "unavailable", {
      duration: 0,
      temperature: 0
    });
  }
  function Zt(t) {
    return !["unavailable"].includes(t.state);
  }
  function Xt(t, e, i, r) {
    const s = Ut(t, Gt(e, i, "image", r));
    return s ? (n = s, `${window.location.origin}/api/image_proxy/${n.entity_id}?token=${n.attributes.access_token}`) : void 0;
    var n;
  }
  function Kt(t, e, i, r, s = "unavailable", n = {}) {
    return Ut(t, Gt(e, i, "sensor", r)) || {
      state: s,
      attributes: n
    };
  }
  function qt(t, e, i, r, s, n) {
    const o = Gt(e, i, "binary_sensor", r);
    return o ? Rt(t, o, s, n) : void 0;
  }
  function Jt(t) {
    return ["printing", "preheating", "paused", "downloading", "checking"].includes(t);
  }
  const Qt = (t, e) => e ? Ct.duration(t, "seconds").humanize() : (() => {
    const e = Ct.duration(t, "seconds"),
      i = e.days(),
      r = e.hours(),
      s = e.minutes(),
      n = e.seconds();
    return `${i > 0 ? `${i}d` : ""}${r > 0 ? ` ${r}h` : ""}${s > 0 ? ` ${s}m` : ""}${n > 0 ? ` ${n}s` : "0s"}`;
  })();
  const te = {
      [Pt.C]: {
        [Pt.C]: t => t,
        [Pt.F]: t => 9 * t / 5 + 32
      },
      [Pt.F]: {
        [Pt.C]: t => 5 * (t - 32) / 9,
        [Pt.F]: t => t
      }
    },
    ee = (t, e, i = !1) => {
      const r = parseFloat(t.state),
        s = (t => {
          var e;
          switch (null === (e = t.attributes) || void 0 === e ? void 0 : e.unit_of_measurement) {
            case "°C":
            default:
              return Pt.C;
            case "°F":
              return Pt.F;
          }
        })(t),
        n = (o = r, l = e || s, te[a = s] && te[a][l] ? te[a][l](o) : -1);
      var o, a, l;
      return `${i ? Math.round(n) : n.toFixed(2)}°${e || s}`;
    };
  function ie() {
    return [Ot.Status, Ot.ETA, Ot.Elapsed, Ot.Remaining];
  }
  function re() {
    return {
      vertical: !1,
      round: !1,
      use_24hr: !0,
      temperatureUnit: Pt.C,
      monitoredStats: ie(),
      scaleFactor: 1,
      slotColors: [],
      showSettingsButton: !1,
      alwaysShow: !1
    };
  }
  function se(t, e) {
    return void 0 === t ? e : t;
  }
  function ne(t) {
    return t.attributes.available_modes.reduce((t, e) => Object.assign(Object.assign({}, t), {
      [e.mode]: e.description
    }), {});
  }
  var oe = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const ae = 1,
    le = 2,
    he = t => (...e) => ({
      _$litDirective$: t,
      values: e
    });
  class ce {
    constructor(t) {}
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t, e, i) {
      this._$Ct = t, this._$AM = e, this._$Ci = i;
    }
    _$AS(t, e) {
      return this.update(t, e);
    }
    update(t, e) {
      return this.render(...e);
    }
  }
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const de = he(class extends ce {
      constructor(t) {
        if (super(t), t.type !== ae || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
      }
      render(t) {
        return " " + Object.keys(t).filter(e => t[e]).join(" ") + " ";
      }
      update(t, [e]) {
        if (void 0 === this.st) {
          this.st = new Set(), void 0 !== t.strings && (this.nt = new Set(t.strings.join(" ").split(/\s/).filter(t => "" !== t)));
          for (const t in e) e[t] && !this.nt?.has(t) && this.st.add(t);
          return this.render(e);
        }
        const i = t.element.classList;
        for (const t of this.st) t in e || (i.remove(t), this.st.delete(t));
        for (const t in e) {
          const r = !!e[t];
          r === this.st.has(t) || this.nt?.has(t) || (r ? (i.add(t), this.st.add(t)) : (i.remove(t), this.st.delete(t)));
        }
        return K;
      }
    }),
    ue = "important",
    pe = " !" + ue,
    ge = he(class extends ce {
      constructor(t) {
        if (super(t), t.type !== ae || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
      }
      render(t) {
        return Object.keys(t).reduce((e, i) => {
          const r = t[i];
          return null == r ? e : e + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
        }, "");
      }
      update(t, [e]) {
        const {
          style: i
        } = t.element;
        if (void 0 === this.ft) return this.ft = new Set(Object.keys(e)), this.render(e);
        for (const t of this.ft) null == e[t] && (this.ft.delete(t), t.includes("-") ? i.removeProperty(t) : i[t] = null);
        for (const t in e) {
          const r = e[t];
          if (null != r) {
            this.ft.add(t);
            const e = "string" == typeof r && r.endsWith(pe);
            t.includes("-") || e ? i.setProperty(t, e ? r.slice(0, -11) : r, e ? ue : "") : i[t] = r;
          }
        }
        return K;
      }
    }),
    {
      I: me
    } = dt,
    fe = () => document.createComment(""),
    ye = (t, e, i) => {
      const r = t._$AA.parentNode,
        s = void 0 === e ? t._$AB : e._$AA;
      if (void 0 === i) {
        const e = r.insertBefore(fe(), s),
          n = r.insertBefore(fe(), s);
        i = new me(e, n, t, t.options);
      } else {
        const e = i._$AB.nextSibling,
          n = i._$AM,
          o = n !== t;
        if (o) {
          let e;
          i._$AQ?.(t), i._$AM = t, void 0 !== i._$AP && (e = t._$AU) !== n._$AU && i._$AP(e);
        }
        if (e !== s || o) {
          let t = i._$AA;
          for (; t !== e;) {
            const e = t.nextSibling;
            r.insertBefore(t, s), t = e;
          }
        }
      }
      return i;
    },
    _e = (t, e, i = t) => (t._$AI(e, i), t),
    be = {},
    ve = t => {
      t._$AP?.(!1, !0);
      let e = t._$AA;
      const i = t._$AB.nextSibling;
      for (; e !== i;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    },
    we = (t, e) => {
      const i = t._$AN;
      if (void 0 === i) return !1;
      for (const t of i) t._$AO?.(e, !1), we(t, e);
      return !0;
    },
    xe = t => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        i = e._$AN, i.delete(t), t = e;
      } while (0 === i?.size);
    },
    Se = t => {
      for (let e; e = t._$AM; t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();else if (i.has(t)) break;
        i.add(t), Ce(e);
      }
    };
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function Ee(t) {
    void 0 !== this._$AN ? (xe(this), this._$AM = t, Se(this)) : this._$AM = t;
  }
  function $e(t, e = !1, i = 0) {
    const r = this._$AH,
      s = this._$AN;
    if (void 0 !== s && 0 !== s.size) if (e) {
      if (Array.isArray(r)) for (let t = i; t < r.length; t++) we(r[t], !1), xe(r[t]);else null != r && (we(r, !1), xe(r));
    } else we(this, t);
  }
  const Ce = t => {
    t.type == le && (t._$AP ??= $e, t._$AQ ??= Ee);
  };
  class Ae extends ce {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(t, e, i) {
      super._$AT(t, e, i), Se(this), this.isConnected = t._$AU;
    }
    _$AO(t, e = !0) {
      t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (we(this, t), xe(this));
    }
    setValue(t) {
      if ((t => void 0 === t.strings)(this._$Ct)) this._$Ct._$AI(t, this);else {
        const e = [...this._$Ct._$AH];
        e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
      }
    }
    disconnected() {}
    reconnected() {}
  }
  const Te = new WeakMap();
  let Pe = 0;
  const ke = new Map(),
    Me = new WeakSet(),
    De = () => new Promise(t => requestAnimationFrame(t)),
    He = (t, e) => {
      const i = t - e;
      return 0 === i ? void 0 : i;
    },
    Oe = (t, e) => {
      const i = t / e;
      return 1 === i ? void 0 : i;
    },
    Ie = {
      left: (t, e) => {
        const i = He(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateX(${i}px)`
        };
      },
      top: (t, e) => {
        const i = He(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateY(${i}px)`
        };
      },
      width: (t, e) => {
        let i;
        0 === e && (e = 1, i = {
          width: "1px"
        });
        const r = Oe(t, e);
        return {
          value: r,
          overrideFrom: i,
          transform: null == r || isNaN(r) ? void 0 : `scaleX(${r})`
        };
      },
      height: (t, e) => {
        let i;
        0 === e && (e = 1, i = {
          height: "1px"
        });
        const r = Oe(t, e);
        return {
          value: r,
          overrideFrom: i,
          transform: null == r || isNaN(r) ? void 0 : `scaleY(${r})`
        };
      }
    },
    Fe = {
      duration: 333,
      easing: "ease-in-out"
    },
    Be = ["left", "top", "width", "height", "opacity", "color", "background"],
    Ne = new WeakMap();
  const Le = he(class extends Ae {
    constructor(t) {
      if (super(t), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, t.type === le) throw Error("The `animate` directive must be used in attribute position.");
      this.createFinished();
    }
    createFinished() {
      this.resolveFinished?.(), this.finished = new Promise(t => {
        this.l = t;
      });
    }
    async resolveFinished() {
      this.l?.(), this.l = void 0;
    }
    render(t) {
      return q;
    }
    getController() {
      return Te.get(this.u);
    }
    isDisabled() {
      return this.options.disabled || this.getController()?.disabled;
    }
    update(t, [e]) {
      const i = void 0 === this.u;
      return i && (this.u = t.options?.host, this.u.addController(this), this.u.updateComplete.then(t => this.t = !0), this.element = t.element, Ne.set(this.element, this)), this.optionsOrCallback = e, (i || "function" != typeof e) && this.p(e), this.render(e);
    }
    p(t) {
      t = t ?? {};
      const e = this.getController();
      void 0 !== e && ((t = {
        ...e.defaultOptions,
        ...t
      }).keyframeOptions = {
        ...e.defaultOptions.keyframeOptions,
        ...t.keyframeOptions
      }), t.properties ??= Be, this.options = t;
    }
    m() {
      const t = {},
        e = this.element.getBoundingClientRect(),
        i = getComputedStyle(this.element);
      return this.options.properties.forEach(r => {
        const s = e[r] ?? (Ie[r] ? void 0 : i[r]),
          n = Number(s);
        t[r] = isNaN(n) ? s + "" : n;
      }), t;
    }
    v() {
      let t,
        e = !0;
      return this.options.guard && (t = this.options.guard(), e = ((t, e) => {
        if (Array.isArray(t)) {
          if (Array.isArray(e) && e.length === t.length && t.every((t, i) => t === e[i])) return !1;
        } else if (e === t) return !1;
        return !0;
      })(t, this._)), this.h = this.t && !this.isDisabled() && !this.isAnimating() && e && this.element.isConnected, this.h && (this._ = Array.isArray(t) ? Array.from(t) : t), this.h;
    }
    hostUpdate() {
      "function" == typeof this.optionsOrCallback && this.p(this.optionsOrCallback()), this.v() && (this.A = this.m(), this.i = this.i ?? this.element.parentNode, this.o = this.element.nextSibling);
    }
    async hostUpdated() {
      if (!this.h || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered) return;
      let t;
      this.prepare(), await De;
      const e = this.O(),
        i = this.j(this.options.keyframeOptions, e),
        r = this.m();
      if (void 0 !== this.A) {
        const {
          from: i,
          to: s
        } = this.N(this.A, r, e);
        this.log("measured", [this.A, r, i, s]), t = this.calculateKeyframes(i, s);
      } else {
        const i = ke.get(this.options.inId);
        if (i) {
          ke.delete(this.options.inId);
          const {
            from: s,
            to: n
          } = this.N(i, r, e);
          t = this.calculateKeyframes(s, n), t = this.options.in ? [{
            ...this.options.in[0],
            ...t[0]
          }, ...this.options.in.slice(1), t[1]] : t, Pe++, t.forEach(t => t.zIndex = Pe);
        } else this.options.in && (t = [...this.options.in, {}]);
      }
      this.animate(t, i);
    }
    resetStyles() {
      void 0 !== this.P && (this.element.setAttribute("style", this.P ?? ""), this.P = void 0);
    }
    commitStyles() {
      this.P = this.element.getAttribute("style"), this.webAnimation?.commitStyles(), this.webAnimation?.cancel();
    }
    reconnected() {}
    async disconnected() {
      if (!this.h) return;
      if (void 0 !== this.options.id && ke.set(this.options.id, this.A), void 0 === this.options.out) return;
      if (this.prepare(), await De(), this.i?.isConnected) {
        const t = this.o && this.o.parentNode === this.i ? this.o : null;
        if (this.i.insertBefore(this.element, t), this.options.stabilizeOut) {
          const t = this.m();
          this.log("stabilizing out");
          const e = this.A.left - t.left,
            i = this.A.top - t.top;
          !("static" === getComputedStyle(this.element).position) || 0 === e && 0 === i || (this.element.style.position = "relative"), 0 !== e && (this.element.style.left = e + "px"), 0 !== i && (this.element.style.top = i + "px");
        }
      }
      const t = this.j(this.options.keyframeOptions);
      await this.animate(this.options.out, t), this.element.remove();
    }
    prepare() {
      this.createFinished();
    }
    start() {
      this.options.onStart?.(this);
    }
    didFinish(t) {
      t && this.options.onComplete?.(this), this.A = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
    }
    O() {
      const t = [];
      for (let e = this.element.parentNode; e; e = e?.parentNode) {
        const i = Ne.get(e);
        i && !i.isDisabled() && i && t.push(i);
      }
      return t;
    }
    get isHostRendered() {
      const t = Me.has(this.u);
      return t || this.u.updateComplete.then(() => {
        Me.add(this.u);
      }), t;
    }
    j(t, e = this.O()) {
      const i = {
        ...Fe
      };
      return e.forEach(t => Object.assign(i, t.options.keyframeOptions)), Object.assign(i, t), i;
    }
    N(t, e, i) {
      t = {
        ...t
      }, e = {
        ...e
      };
      const r = i.map(t => t.animatingProperties).filter(t => void 0 !== t);
      let s = 1,
        n = 1;
      return r.length > 0 && (r.forEach(t => {
        t.width && (s /= t.width), t.height && (n /= t.height);
      }), void 0 !== t.left && void 0 !== e.left && (t.left = s * t.left, e.left = s * e.left), void 0 !== t.top && void 0 !== e.top && (t.top = n * t.top, e.top = n * e.top)), {
        from: t,
        to: e
      };
    }
    calculateKeyframes(t, e, i = !1) {
      const r = {},
        s = {};
      let n = !1;
      const o = {};
      for (const i in e) {
        const a = t[i],
          l = e[i];
        if (i in Ie) {
          const t = Ie[i];
          if (void 0 === a || void 0 === l) continue;
          const e = t(a, l);
          void 0 !== e.transform && (o[i] = e.value, n = !0, r.transform = `${r.transform ?? ""} ${e.transform}`, void 0 !== e.overrideFrom && Object.assign(r, e.overrideFrom));
        } else a !== l && void 0 !== a && void 0 !== l && (n = !0, r[i] = a, s[i] = l);
      }
      return r.transformOrigin = s.transformOrigin = i ? "center center" : "top left", this.animatingProperties = o, n ? [r, s] : void 0;
    }
    async animate(t, e = this.options.keyframeOptions) {
      this.start(), this.frames = t;
      let i = !1;
      if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t = this.options.onFrames(this), this.log("modified frames", t)), void 0 !== t)) {
        this.log("animate", [t, e]), i = !0, this.webAnimation = this.element.animate(t, e);
        const r = this.getController();
        r?.add(this);
        try {
          await this.webAnimation.finished;
        } catch (t) {}
        r?.remove(this);
      }
      return this.didFinish(i), i;
    }
    isAnimating() {
      return "running" === this.webAnimation?.playState || this.webAnimation?.pending;
    }
    log(t, e) {
      this.shouldLog && !this.isDisabled() && console.log(t, this.options.id, e);
    }
  });
  var Ue,
    Re,
    Ye,
    ze = "Anycubic Cloud",
    je = {
      actions: {
        cancel: "Cancel",
        pause: "Pause",
        print: "Print",
        resume: "Resume",
        yes: "Yes",
        no: "No",
        save: "Save"
      }
    },
    Ge = {
      buttons: {
        print_settings: "Print Settings",
        dry: "Dry",
        runout_refill: "Refill"
      },
      configure: {
        tabs: {
          main: "Main",
          stats: "Stats",
          colours: "ACE Colour Presets"
        },
        labels: {
          printer_id: "Select Printer",
          vertical: "Vertical Layout?",
          round: "Round Stats?",
          use_24hr: "Use 24hr Time?",
          show_settings_button: "Always show print settings button?",
          always_show: "Always show card?",
          temperature_unit: "Temperature Unit",
          light_entity_id: "Light Entity",
          power_entity_id: "Power Entity",
          camera_entity_id: "Camera Entity",
          scale_factor: "Scale Factor",
          slot_colors: "Slot Colour Presets"
        }
      },
      print_settings: {
        confirm_message: "Are you sure you want to {action} the print?",
        label_nozzle_temp: "Nozzle Temperature",
        label_hotbed_temp: "Hotbed Temperature",
        label_fan_speed: "Fan Speed",
        label_aux_fan_speed: "AUX Fan Speed",
        label_box_fan_speed: "Box Fan Speed",
        print_pause: "Pause Print",
        print_resume: "Resume Print",
        print_cancel: "Cancel Print",
        save_speed_mode: "Save Speed Mode",
        save_target_nozzle: "Save Target Nozzle",
        save_target_hotbed: "Save Target Hotbed",
        save_fan_speed: "Save Fan Speed",
        save_aux_fan_speed: "Save AUX Fan Speed",
        save_box_fan_speed: "Save Box Fan Speed"
      },
      drying_settings: {
        heading: "Drying Options",
        button_preset: "Preset",
        button_stop_drying: "Stop Drying",
        button_minutes: "Mins"
      },
      spool_settings: {
        heading: "Editing Slot",
        label_select_material: "Select Material",
        label_select_colour: "Manually select colour"
      },
      monitored_stats: {
        ETA: "ETA",
        Elapsed: "Elapsed",
        Remaining: "Remaining",
        Status: "Status",
        Online: "Online",
        Availability: "Availability",
        Project: "Project",
        Layer: "Layer",
        Hotend: "Hotend",
        Bed: "Bed",
        "T Hotend": "T Hotend",
        "T Bed": "T Bed",
        "Dry Status": "Dry Status",
        "Dry Time": "Dry Time",
        "Speed Mode": "Speed Mode",
        "Fan Speed": "Fan Speed",
        "On Time": "On Time",
        "Off Time": "Off Time",
        "Bottom Time": "Bottom Time",
        "Model Height": "Model Height",
        "Bottom Layers": "Bottom Layers",
        "Z Up Height": "Z Up Height",
        "Z Up Speed": "Z Up Speed",
        "Z Down Speed": "Z Down Speed"
      }
    },
    Ve = {
      initial: {
        printer_select: "Select a printer."
      },
      main: {
        title: "Main",
        cards: {
          main: {
            description: "General information about the printer.",
            fields: {
              printer_name: "Name",
              printer_id: "ID",
              printer_mac: "MAC",
              printer_model: "Model",
              printer_fw_version: "FW Version",
              printer_fw_update_available: "FW Status",
              printer_online: "Online",
              printer_available: "Available",
              curr_nozzle_temp: "Current Nozzle Temperature",
              curr_hotbed_temp: "Current Hotbed Temperature",
              target_nozzle_temp: "Target Nozzle Temperature",
              target_hotbed_temp: "Target Hotbed Temperature",
              job_state: "Job State",
              job_progress: "Job Progress",
              ace_fw_version: "ACE FW Version",
              ace_fw_update_available: "ACE FW Status",
              drying_active: "ACE Drying Status",
              drying_progress: "ACE Drying Progress"
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
        cards: {}
      },
      print_no_cloud_save: {
        title: "Print (No Cloud Save)",
        cards: {}
      },
      debug: {
        title: "Debug",
        cards: {}
      }
    },
    We = {
      title: ze,
      common: je,
      card: Ge,
      panels: Ve
    },
    Ze = Object.freeze({
      __proto__: null,
      title: ze,
      common: je,
      card: Ge,
      panels: Ve,
      default: We
    });
  function Xe(t) {
    return t.type === Re.literal;
  }
  function Ke(t) {
    return t.type === Re.argument;
  }
  function qe(t) {
    return t.type === Re.number;
  }
  function Je(t) {
    return t.type === Re.date;
  }
  function Qe(t) {
    return t.type === Re.time;
  }
  function ti(t) {
    return t.type === Re.select;
  }
  function ei(t) {
    return t.type === Re.plural;
  }
  function ii(t) {
    return t.type === Re.pound;
  }
  function ri(t) {
    return t.type === Re.tag;
  }
  function si(t) {
    return !(!t || "object" != typeof t || t.type !== Ye.number);
  }
  function ni(t) {
    return !(!t || "object" != typeof t || t.type !== Ye.dateTime);
  }
  !function (t) {
    t[t.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", t[t.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", t[t.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", t[t.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", t[t.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", t[t.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", t[t.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", t[t.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", t[t.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", t[t.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", t[t.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", t[t.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", t[t.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", t[t.INVALID_TAG = 23] = "INVALID_TAG", t[t.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", t[t.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", t[t.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
  }(Ue || (Ue = {})), function (t) {
    t[t.literal = 0] = "literal", t[t.argument = 1] = "argument", t[t.number = 2] = "number", t[t.date = 3] = "date", t[t.time = 4] = "time", t[t.select = 5] = "select", t[t.plural = 6] = "plural", t[t.pound = 7] = "pound", t[t.tag = 8] = "tag";
  }(Re || (Re = {})), function (t) {
    t[t.number = 0] = "number", t[t.dateTime = 1] = "dateTime";
  }(Ye || (Ye = {}));
  var oi = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    ai = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function li(t) {
    var e = {};
    return t.replace(ai, function (t) {
      var i = t.length;
      switch (t[0]) {
        case "G":
          e.era = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "y":
          e.year = 2 === i ? "2-digit" : "numeric";
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
          e.month = ["numeric", "2-digit", "short", "long", "narrow"][i - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          e.day = ["numeric", "2-digit"][i - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");
        case "E":
          e.weekday = 4 === i ? "long" : 5 === i ? "narrow" : "short";
          break;
        case "e":
          if (i < 4) throw new RangeError("`e..eee` (weekday) patterns are not supported");
          e.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "c":
          if (i < 4) throw new RangeError("`c..ccc` (weekday) patterns are not supported");
          e.weekday = ["short", "long", "narrow", "short"][i - 4];
          break;
        case "a":
          e.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");
        case "h":
          e.hourCycle = "h12", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "H":
          e.hourCycle = "h23", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "K":
          e.hourCycle = "h11", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "k":
          e.hourCycle = "h24", e.hour = ["numeric", "2-digit"][i - 1];
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");
        case "m":
          e.minute = ["numeric", "2-digit"][i - 1];
          break;
        case "s":
          e.second = ["numeric", "2-digit"][i - 1];
          break;
        case "S":
        case "A":
          throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");
        case "z":
          e.timeZoneName = i < 4 ? "short" : "long";
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
    }), e;
  }
  var hi = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
  var ci = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    di = /^(@+)?(\+|#+)?[rs]?$/g,
    ui = /(\*)(0+)|(#+)(0+)|(0+)/g,
    pi = /^(0+)$/;
  function gi(t) {
    var e = {};
    return "r" === t[t.length - 1] ? e.roundingPriority = "morePrecision" : "s" === t[t.length - 1] && (e.roundingPriority = "lessPrecision"), t.replace(di, function (t, i, r) {
      return "string" != typeof r ? (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length) : "+" === r ? e.minimumSignificantDigits = i.length : "#" === i[0] ? e.maximumSignificantDigits = i.length : (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length + ("string" == typeof r ? r.length : 0)), "";
    }), e;
  }
  function mi(t) {
    switch (t) {
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
  function fi(t) {
    var e;
    if ("E" === t[0] && "E" === t[1] ? (e = {
      notation: "engineering"
    }, t = t.slice(2)) : "E" === t[0] && (e = {
      notation: "scientific"
    }, t = t.slice(1)), e) {
      var i = t.slice(0, 2);
      if ("+!" === i ? (e.signDisplay = "always", t = t.slice(2)) : "+?" === i && (e.signDisplay = "exceptZero", t = t.slice(2)), !pi.test(t)) throw new Error("Malformed concise eng/scientific notation");
      e.minimumIntegerDigits = t.length;
    }
    return e;
  }
  function yi(t) {
    var e = mi(t);
    return e || {};
  }
  function _i(t) {
    for (var e = {}, i = 0, s = t; i < s.length; i++) {
      var n = s[i];
      switch (n.stem) {
        case "percent":
        case "%":
          e.style = "percent";
          continue;
        case "%x100":
          e.style = "percent", e.scale = 100;
          continue;
        case "currency":
          e.style = "currency", e.currency = n.options[0];
          continue;
        case "group-off":
        case ",_":
          e.useGrouping = !1;
          continue;
        case "precision-integer":
        case ".":
          e.maximumFractionDigits = 0;
          continue;
        case "measure-unit":
        case "unit":
          e.style = "unit", e.unit = n.options[0].replace(/^(.*?)-/, "");
          continue;
        case "compact-short":
        case "K":
          e.notation = "compact", e.compactDisplay = "short";
          continue;
        case "compact-long":
        case "KK":
          e.notation = "compact", e.compactDisplay = "long";
          continue;
        case "scientific":
          e = r(r(r({}, e), {
            notation: "scientific"
          }), n.options.reduce(function (t, e) {
            return r(r({}, t), yi(e));
          }, {}));
          continue;
        case "engineering":
          e = r(r(r({}, e), {
            notation: "engineering"
          }), n.options.reduce(function (t, e) {
            return r(r({}, t), yi(e));
          }, {}));
          continue;
        case "notation-simple":
          e.notation = "standard";
          continue;
        case "unit-width-narrow":
          e.currencyDisplay = "narrowSymbol", e.unitDisplay = "narrow";
          continue;
        case "unit-width-short":
          e.currencyDisplay = "code", e.unitDisplay = "short";
          continue;
        case "unit-width-full-name":
          e.currencyDisplay = "name", e.unitDisplay = "long";
          continue;
        case "unit-width-iso-code":
          e.currencyDisplay = "symbol";
          continue;
        case "scale":
          e.scale = parseFloat(n.options[0]);
          continue;
        case "rounding-mode-floor":
          e.roundingMode = "floor";
          continue;
        case "rounding-mode-ceiling":
          e.roundingMode = "ceil";
          continue;
        case "rounding-mode-down":
          e.roundingMode = "trunc";
          continue;
        case "rounding-mode-up":
          e.roundingMode = "expand";
          continue;
        case "rounding-mode-half-even":
          e.roundingMode = "halfEven";
          continue;
        case "rounding-mode-half-down":
          e.roundingMode = "halfTrunc";
          continue;
        case "rounding-mode-half-up":
          e.roundingMode = "halfExpand";
          continue;
        case "integer-width":
          if (n.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
          n.options[0].replace(ui, function (t, i, r, s, n, o) {
            if (i) e.minimumIntegerDigits = r.length;else {
              if (s && n) throw new Error("We currently do not support maximum integer digits");
              if (o) throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (pi.test(n.stem)) e.minimumIntegerDigits = n.stem.length;else if (ci.test(n.stem)) {
        if (n.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
        n.stem.replace(ci, function (t, i, r, s, n, o) {
          return "*" === r ? e.minimumFractionDigits = i.length : s && "#" === s[0] ? e.maximumFractionDigits = s.length : n && o ? (e.minimumFractionDigits = n.length, e.maximumFractionDigits = n.length + o.length) : (e.minimumFractionDigits = i.length, e.maximumFractionDigits = i.length), "";
        });
        var o = n.options[0];
        "w" === o ? e = r(r({}, e), {
          trailingZeroDisplay: "stripIfInteger"
        }) : o && (e = r(r({}, e), gi(o)));
      } else if (di.test(n.stem)) e = r(r({}, e), gi(n.stem));else {
        var a = mi(n.stem);
        a && (e = r(r({}, e), a));
        var l = fi(n.stem);
        l && (e = r(r({}, e), l));
      }
    }
    return e;
  }
  var bi,
    vi = {
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
  function wi(t) {
    var e = t.hourCycle;
    if (void 0 === e && t.hourCycles && t.hourCycles.length && (e = t.hourCycles[0]), e) switch (e) {
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
      r = t.language;
    return "root" !== r && (i = t.maximize().region), (vi[i || ""] || vi[r || ""] || vi["".concat(r, "-001")] || vi["001"])[0];
  }
  var xi = new RegExp("^".concat(oi.source, "*")),
    Si = new RegExp("".concat(oi.source, "*$"));
  function Ei(t, e) {
    return {
      start: t,
      end: e
    };
  }
  var $i = !!String.prototype.startsWith && "_a".startsWith("a", 1),
    Ci = !!String.fromCodePoint,
    Ai = !!Object.fromEntries,
    Ti = !!String.prototype.codePointAt,
    Pi = !!String.prototype.trimStart,
    ki = !!String.prototype.trimEnd,
    Mi = !!Number.isSafeInteger ? Number.isSafeInteger : function (t) {
      return "number" == typeof t && isFinite(t) && Math.floor(t) === t && Math.abs(t) <= 9007199254740991;
    },
    Di = !0;
  try {
    Di = "a" === (null === (bi = Ui("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) || void 0 === bi ? void 0 : bi[0]);
  } catch (j) {
    Di = !1;
  }
  var Hi,
    Oi = $i ? function (t, e, i) {
      return t.startsWith(e, i);
    } : function (t, e, i) {
      return t.slice(i, i + e.length) === e;
    },
    Ii = Ci ? String.fromCodePoint : function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      for (var i, r = "", s = t.length, n = 0; s > n;) {
        if ((i = t[n++]) > 1114111) throw RangeError(i + " is not a valid code point");
        r += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(55296 + ((i -= 65536) >> 10), i % 1024 + 56320);
      }
      return r;
    },
    Fi = Ai ? Object.fromEntries : function (t) {
      for (var e = {}, i = 0, r = t; i < r.length; i++) {
        var s = r[i],
          n = s[0],
          o = s[1];
        e[n] = o;
      }
      return e;
    },
    Bi = Ti ? function (t, e) {
      return t.codePointAt(e);
    } : function (t, e) {
      var i = t.length;
      if (!(e < 0 || e >= i)) {
        var r,
          s = t.charCodeAt(e);
        return s < 55296 || s > 56319 || e + 1 === i || (r = t.charCodeAt(e + 1)) < 56320 || r > 57343 ? s : r - 56320 + (s - 55296 << 10) + 65536;
      }
    },
    Ni = Pi ? function (t) {
      return t.trimStart();
    } : function (t) {
      return t.replace(xi, "");
    },
    Li = ki ? function (t) {
      return t.trimEnd();
    } : function (t) {
      return t.replace(Si, "");
    };
  function Ui(t, e) {
    return new RegExp(t, e);
  }
  if (Di) {
    var Ri = Ui("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    Hi = function (t, e) {
      var i;
      return Ri.lastIndex = e, null !== (i = Ri.exec(t)[1]) && void 0 !== i ? i : "";
    };
  } else Hi = function (t, e) {
    for (var i = [];;) {
      var r = Bi(t, e);
      if (void 0 === r || Gi(r) || Vi(r)) break;
      i.push(r), e += r >= 65536 ? 2 : 1;
    }
    return Ii.apply(void 0, i);
  };
  var Yi = function () {
    function t(t, e) {
      void 0 === e && (e = {}), this.message = t, this.position = {
        offset: 0,
        line: 1,
        column: 1
      }, this.ignoreTag = !!e.ignoreTag, this.locale = e.locale, this.requiresOtherClause = !!e.requiresOtherClause, this.shouldParseSkeletons = !!e.shouldParseSkeletons;
    }
    return t.prototype.parse = function () {
      if (0 !== this.offset()) throw Error("parser can only be used once");
      return this.parseMessage(0, "", !1);
    }, t.prototype.parseMessage = function (t, e, i) {
      for (var r = []; !this.isEOF();) {
        var s = this.char();
        if (123 === s) {
          if ((n = this.parseArgument(t, i)).err) return n;
          r.push(n.val);
        } else {
          if (125 === s && t > 0) break;
          if (35 !== s || "plural" !== e && "selectordinal" !== e) {
            if (60 === s && !this.ignoreTag && 47 === this.peek()) {
              if (i) break;
              return this.error(Ue.UNMATCHED_CLOSING_TAG, Ei(this.clonePosition(), this.clonePosition()));
            }
            if (60 === s && !this.ignoreTag && zi(this.peek() || 0)) {
              if ((n = this.parseTag(t, e)).err) return n;
              r.push(n.val);
            } else {
              var n;
              if ((n = this.parseLiteral(t, e)).err) return n;
              r.push(n.val);
            }
          } else {
            var o = this.clonePosition();
            this.bump(), r.push({
              type: Re.pound,
              location: Ei(o, this.clonePosition())
            });
          }
        }
      }
      return {
        val: r,
        err: null
      };
    }, t.prototype.parseTag = function (t, e) {
      var i = this.clonePosition();
      this.bump();
      var r = this.parseTagName();
      if (this.bumpSpace(), this.bumpIf("/>")) return {
        val: {
          type: Re.literal,
          value: "<".concat(r, "/>"),
          location: Ei(i, this.clonePosition())
        },
        err: null
      };
      if (this.bumpIf(">")) {
        var s = this.parseMessage(t + 1, e, !0);
        if (s.err) return s;
        var n = s.val,
          o = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !zi(this.char())) return this.error(Ue.INVALID_TAG, Ei(o, this.clonePosition()));
          var a = this.clonePosition();
          return r !== this.parseTagName() ? this.error(Ue.UNMATCHED_CLOSING_TAG, Ei(a, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: Re.tag,
              value: r,
              children: n,
              location: Ei(i, this.clonePosition())
            },
            err: null
          } : this.error(Ue.INVALID_TAG, Ei(o, this.clonePosition())));
        }
        return this.error(Ue.UNCLOSED_TAG, Ei(i, this.clonePosition()));
      }
      return this.error(Ue.INVALID_TAG, Ei(i, this.clonePosition()));
    }, t.prototype.parseTagName = function () {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && ji(this.char());) this.bump();
      return this.message.slice(t, this.offset());
    }, t.prototype.parseLiteral = function (t, e) {
      for (var i = this.clonePosition(), r = "";;) {
        var s = this.tryParseQuote(e);
        if (s) r += s;else {
          var n = this.tryParseUnquoted(t, e);
          if (n) r += n;else {
            var o = this.tryParseLeftAngleBracket();
            if (!o) break;
            r += o;
          }
        }
      }
      var a = Ei(i, this.clonePosition());
      return {
        val: {
          type: Re.literal,
          value: r,
          location: a
        },
        err: null
      };
    }, t.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() || 60 !== this.char() || !this.ignoreTag && (zi(t = this.peek() || 0) || 47 === t) ? null : (this.bump(), "<");
      var t;
    }, t.prototype.tryParseQuote = function (t) {
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
          if ("plural" === t || "selectordinal" === t) break;
          return null;
        default:
          return null;
      }
      this.bump();
      var e = [this.char()];
      for (this.bump(); !this.isEOF();) {
        var i = this.char();
        if (39 === i) {
          if (39 !== this.peek()) {
            this.bump();
            break;
          }
          e.push(39), this.bump();
        } else e.push(i);
        this.bump();
      }
      return Ii.apply(void 0, e);
    }, t.prototype.tryParseUnquoted = function (t, e) {
      if (this.isEOF()) return null;
      var i = this.char();
      return 60 === i || 123 === i || 35 === i && ("plural" === e || "selectordinal" === e) || 125 === i && t > 0 ? null : (this.bump(), Ii(i));
    }, t.prototype.parseArgument = function (t, e) {
      var i = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(Ue.EXPECT_ARGUMENT_CLOSING_BRACE, Ei(i, this.clonePosition()));
      if (125 === this.char()) return this.bump(), this.error(Ue.EMPTY_ARGUMENT, Ei(i, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r) return this.error(Ue.MALFORMED_ARGUMENT, Ei(i, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF()) return this.error(Ue.EXPECT_ARGUMENT_CLOSING_BRACE, Ei(i, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: Re.argument,
              value: r,
              location: Ei(i, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(Ue.EXPECT_ARGUMENT_CLOSING_BRACE, Ei(i, this.clonePosition())) : this.parseArgumentOptions(t, e, r, i);
        default:
          return this.error(Ue.MALFORMED_ARGUMENT, Ei(i, this.clonePosition()));
      }
    }, t.prototype.parseIdentifierIfPossible = function () {
      var t = this.clonePosition(),
        e = this.offset(),
        i = Hi(this.message, e),
        r = e + i.length;
      return this.bumpTo(r), {
        value: i,
        location: Ei(t, this.clonePosition())
      };
    }, t.prototype.parseArgumentOptions = function (t, e, i, s) {
      var n,
        o = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        l = this.clonePosition();
      switch (a) {
        case "":
          return this.error(Ue.EXPECT_ARGUMENT_TYPE, Ei(o, l));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var h = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var c = this.clonePosition();
            if ((_ = this.parseSimpleArgStyleIfPossible()).err) return _;
            if (0 === (g = Li(_.val)).length) return this.error(Ue.EXPECT_ARGUMENT_STYLE, Ei(this.clonePosition(), this.clonePosition()));
            h = {
              style: g,
              styleLocation: Ei(c, this.clonePosition())
            };
          }
          if ((b = this.tryParseArgumentClose(s)).err) return b;
          var d = Ei(s, this.clonePosition());
          if (h && Oi(null == h ? void 0 : h.style, "::", 0)) {
            var u = Ni(h.style.slice(2));
            if ("number" === a) return (_ = this.parseNumberSkeletonFromString(u, h.styleLocation)).err ? _ : {
              val: {
                type: Re.number,
                value: i,
                location: d,
                style: _.val
              },
              err: null
            };
            if (0 === u.length) return this.error(Ue.EXPECT_DATE_TIME_SKELETON, d);
            var p = u;
            this.locale && (p = function (t, e) {
              for (var i = "", r = 0; r < t.length; r++) {
                var s = t.charAt(r);
                if ("j" === s) {
                  for (var n = 0; r + 1 < t.length && t.charAt(r + 1) === s;) n++, r++;
                  var o = 1 + (1 & n),
                    a = n < 2 ? 1 : 3 + (n >> 1),
                    l = wi(e);
                  for ("H" != l && "k" != l || (a = 0); a-- > 0;) i += "a";
                  for (; o-- > 0;) i = l + i;
                } else i += "J" === s ? "H" : s;
              }
              return i;
            }(u, this.locale));
            var g = {
              type: Ye.dateTime,
              pattern: p,
              location: h.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? li(p) : {}
            };
            return {
              val: {
                type: "date" === a ? Re.date : Re.time,
                value: i,
                location: d,
                style: g
              },
              err: null
            };
          }
          return {
            val: {
              type: "number" === a ? Re.number : "date" === a ? Re.date : Re.time,
              value: i,
              location: d,
              style: null !== (n = null == h ? void 0 : h.style) && void 0 !== n ? n : null
            },
            err: null
          };
        case "plural":
        case "selectordinal":
        case "select":
          var m = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(",")) return this.error(Ue.EXPECT_SELECT_ARGUMENT_OPTIONS, Ei(m, r({}, m)));
          this.bumpSpace();
          var f = this.parseIdentifierIfPossible(),
            y = 0;
          if ("select" !== a && "offset" === f.value) {
            if (!this.bumpIf(":")) return this.error(Ue.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, Ei(this.clonePosition(), this.clonePosition()));
            var _;
            if (this.bumpSpace(), (_ = this.tryParseDecimalInteger(Ue.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, Ue.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err) return _;
            this.bumpSpace(), f = this.parseIdentifierIfPossible(), y = _.val;
          }
          var b,
            v = this.tryParsePluralOrSelectOptions(t, a, e, f);
          if (v.err) return v;
          if ((b = this.tryParseArgumentClose(s)).err) return b;
          var w = Ei(s, this.clonePosition());
          return "select" === a ? {
            val: {
              type: Re.select,
              value: i,
              options: Fi(v.val),
              location: w
            },
            err: null
          } : {
            val: {
              type: Re.plural,
              value: i,
              options: Fi(v.val),
              offset: y,
              pluralType: "plural" === a ? "cardinal" : "ordinal",
              location: w
            },
            err: null
          };
        default:
          return this.error(Ue.INVALID_ARGUMENT_TYPE, Ei(o, l));
      }
    }, t.prototype.tryParseArgumentClose = function (t) {
      return this.isEOF() || 125 !== this.char() ? this.error(Ue.EXPECT_ARGUMENT_CLOSING_BRACE, Ei(t, this.clonePosition())) : (this.bump(), {
        val: !0,
        err: null
      });
    }, t.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var t = 0, e = this.clonePosition(); !this.isEOF();) {
        switch (this.char()) {
          case 39:
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'")) return this.error(Ue.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, Ei(i, this.clonePosition()));
            this.bump();
            break;
          case 123:
            t += 1, this.bump();
            break;
          case 125:
            if (!(t > 0)) return {
              val: this.message.slice(e.offset, this.offset()),
              err: null
            };
            t -= 1;
            break;
          default:
            this.bump();
        }
      }
      return {
        val: this.message.slice(e.offset, this.offset()),
        err: null
      };
    }, t.prototype.parseNumberSkeletonFromString = function (t, e) {
      var i = [];
      try {
        i = function (t) {
          if (0 === t.length) throw new Error("Number skeleton cannot be empty");
          for (var e = t.split(hi).filter(function (t) {
              return t.length > 0;
            }), i = [], r = 0, s = e; r < s.length; r++) {
            var n = s[r].split("/");
            if (0 === n.length) throw new Error("Invalid number skeleton");
            for (var o = n[0], a = n.slice(1), l = 0, h = a; l < h.length; l++) if (0 === h[l].length) throw new Error("Invalid number skeleton");
            i.push({
              stem: o,
              options: a
            });
          }
          return i;
        }(t);
      } catch (t) {
        return this.error(Ue.INVALID_NUMBER_SKELETON, e);
      }
      return {
        val: {
          type: Ye.number,
          tokens: i,
          location: e,
          parsedOptions: this.shouldParseSkeletons ? _i(i) : {}
        },
        err: null
      };
    }, t.prototype.tryParsePluralOrSelectOptions = function (t, e, i, r) {
      for (var s, n = !1, o = [], a = new Set(), l = r.value, h = r.location;;) {
        if (0 === l.length) {
          var c = this.clonePosition();
          if ("select" === e || !this.bumpIf("=")) break;
          var d = this.tryParseDecimalInteger(Ue.EXPECT_PLURAL_ARGUMENT_SELECTOR, Ue.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (d.err) return d;
          h = Ei(c, this.clonePosition()), l = this.message.slice(c.offset, this.offset());
        }
        if (a.has(l)) return this.error("select" === e ? Ue.DUPLICATE_SELECT_ARGUMENT_SELECTOR : Ue.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, h);
        "other" === l && (n = !0), this.bumpSpace();
        var u = this.clonePosition();
        if (!this.bumpIf("{")) return this.error("select" === e ? Ue.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : Ue.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, Ei(this.clonePosition(), this.clonePosition()));
        var p = this.parseMessage(t + 1, e, i);
        if (p.err) return p;
        var g = this.tryParseArgumentClose(u);
        if (g.err) return g;
        o.push([l, {
          value: p.val,
          location: Ei(u, this.clonePosition())
        }]), a.add(l), this.bumpSpace(), l = (s = this.parseIdentifierIfPossible()).value, h = s.location;
      }
      return 0 === o.length ? this.error("select" === e ? Ue.EXPECT_SELECT_ARGUMENT_SELECTOR : Ue.EXPECT_PLURAL_ARGUMENT_SELECTOR, Ei(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !n ? this.error(Ue.MISSING_OTHER_CLAUSE, Ei(this.clonePosition(), this.clonePosition())) : {
        val: o,
        err: null
      };
    }, t.prototype.tryParseDecimalInteger = function (t, e) {
      var i = 1,
        r = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (i = -1);
      for (var s = !1, n = 0; !this.isEOF();) {
        var o = this.char();
        if (!(o >= 48 && o <= 57)) break;
        s = !0, n = 10 * n + (o - 48), this.bump();
      }
      var a = Ei(r, this.clonePosition());
      return s ? Mi(n *= i) ? {
        val: n,
        err: null
      } : this.error(e, a) : this.error(t, a);
    }, t.prototype.offset = function () {
      return this.position.offset;
    }, t.prototype.isEOF = function () {
      return this.offset() === this.message.length;
    }, t.prototype.clonePosition = function () {
      return {
        offset: this.position.offset,
        line: this.position.line,
        column: this.position.column
      };
    }, t.prototype.char = function () {
      var t = this.position.offset;
      if (t >= this.message.length) throw Error("out of bound");
      var e = Bi(this.message, t);
      if (void 0 === e) throw Error("Offset ".concat(t, " is at invalid UTF-16 code unit boundary"));
      return e;
    }, t.prototype.error = function (t, e) {
      return {
        val: null,
        err: {
          kind: t,
          message: this.message,
          location: e
        }
      };
    }, t.prototype.bump = function () {
      if (!this.isEOF()) {
        var t = this.char();
        10 === t ? (this.position.line += 1, this.position.column = 1, this.position.offset += 1) : (this.position.column += 1, this.position.offset += t < 65536 ? 1 : 2);
      }
    }, t.prototype.bumpIf = function (t) {
      if (Oi(this.message, t, this.offset())) {
        for (var e = 0; e < t.length; e++) this.bump();
        return !0;
      }
      return !1;
    }, t.prototype.bumpUntil = function (t) {
      var e = this.offset(),
        i = this.message.indexOf(t, e);
      return i >= 0 ? (this.bumpTo(i), !0) : (this.bumpTo(this.message.length), !1);
    }, t.prototype.bumpTo = function (t) {
      if (this.offset() > t) throw Error("targetOffset ".concat(t, " must be greater than or equal to the current offset ").concat(this.offset()));
      for (t = Math.min(t, this.message.length);;) {
        var e = this.offset();
        if (e === t) break;
        if (e > t) throw Error("targetOffset ".concat(t, " is at invalid UTF-16 code unit boundary"));
        if (this.bump(), this.isEOF()) break;
      }
    }, t.prototype.bumpSpace = function () {
      for (; !this.isEOF() && Gi(this.char());) this.bump();
    }, t.prototype.peek = function () {
      if (this.isEOF()) return null;
      var t = this.char(),
        e = this.offset(),
        i = this.message.charCodeAt(e + (t >= 65536 ? 2 : 1));
      return null != i ? i : null;
    }, t;
  }();
  function zi(t) {
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  function ji(t) {
    return 45 === t || 46 === t || t >= 48 && t <= 57 || 95 === t || t >= 97 && t <= 122 || t >= 65 && t <= 90 || 183 == t || t >= 192 && t <= 214 || t >= 216 && t <= 246 || t >= 248 && t <= 893 || t >= 895 && t <= 8191 || t >= 8204 && t <= 8205 || t >= 8255 && t <= 8256 || t >= 8304 && t <= 8591 || t >= 11264 && t <= 12271 || t >= 12289 && t <= 55295 || t >= 63744 && t <= 64975 || t >= 65008 && t <= 65533 || t >= 65536 && t <= 983039;
  }
  function Gi(t) {
    return t >= 9 && t <= 13 || 32 === t || 133 === t || t >= 8206 && t <= 8207 || 8232 === t || 8233 === t;
  }
  function Vi(t) {
    return t >= 33 && t <= 35 || 36 === t || t >= 37 && t <= 39 || 40 === t || 41 === t || 42 === t || 43 === t || 44 === t || 45 === t || t >= 46 && t <= 47 || t >= 58 && t <= 59 || t >= 60 && t <= 62 || t >= 63 && t <= 64 || 91 === t || 92 === t || 93 === t || 94 === t || 96 === t || 123 === t || 124 === t || 125 === t || 126 === t || 161 === t || t >= 162 && t <= 165 || 166 === t || 167 === t || 169 === t || 171 === t || 172 === t || 174 === t || 176 === t || 177 === t || 182 === t || 187 === t || 191 === t || 215 === t || 247 === t || t >= 8208 && t <= 8213 || t >= 8214 && t <= 8215 || 8216 === t || 8217 === t || 8218 === t || t >= 8219 && t <= 8220 || 8221 === t || 8222 === t || 8223 === t || t >= 8224 && t <= 8231 || t >= 8240 && t <= 8248 || 8249 === t || 8250 === t || t >= 8251 && t <= 8254 || t >= 8257 && t <= 8259 || 8260 === t || 8261 === t || 8262 === t || t >= 8263 && t <= 8273 || 8274 === t || 8275 === t || t >= 8277 && t <= 8286 || t >= 8592 && t <= 8596 || t >= 8597 && t <= 8601 || t >= 8602 && t <= 8603 || t >= 8604 && t <= 8607 || 8608 === t || t >= 8609 && t <= 8610 || 8611 === t || t >= 8612 && t <= 8613 || 8614 === t || t >= 8615 && t <= 8621 || 8622 === t || t >= 8623 && t <= 8653 || t >= 8654 && t <= 8655 || t >= 8656 && t <= 8657 || 8658 === t || 8659 === t || 8660 === t || t >= 8661 && t <= 8691 || t >= 8692 && t <= 8959 || t >= 8960 && t <= 8967 || 8968 === t || 8969 === t || 8970 === t || 8971 === t || t >= 8972 && t <= 8991 || t >= 8992 && t <= 8993 || t >= 8994 && t <= 9e3 || 9001 === t || 9002 === t || t >= 9003 && t <= 9083 || 9084 === t || t >= 9085 && t <= 9114 || t >= 9115 && t <= 9139 || t >= 9140 && t <= 9179 || t >= 9180 && t <= 9185 || t >= 9186 && t <= 9254 || t >= 9255 && t <= 9279 || t >= 9280 && t <= 9290 || t >= 9291 && t <= 9311 || t >= 9472 && t <= 9654 || 9655 === t || t >= 9656 && t <= 9664 || 9665 === t || t >= 9666 && t <= 9719 || t >= 9720 && t <= 9727 || t >= 9728 && t <= 9838 || 9839 === t || t >= 9840 && t <= 10087 || 10088 === t || 10089 === t || 10090 === t || 10091 === t || 10092 === t || 10093 === t || 10094 === t || 10095 === t || 10096 === t || 10097 === t || 10098 === t || 10099 === t || 10100 === t || 10101 === t || t >= 10132 && t <= 10175 || t >= 10176 && t <= 10180 || 10181 === t || 10182 === t || t >= 10183 && t <= 10213 || 10214 === t || 10215 === t || 10216 === t || 10217 === t || 10218 === t || 10219 === t || 10220 === t || 10221 === t || 10222 === t || 10223 === t || t >= 10224 && t <= 10239 || t >= 10240 && t <= 10495 || t >= 10496 && t <= 10626 || 10627 === t || 10628 === t || 10629 === t || 10630 === t || 10631 === t || 10632 === t || 10633 === t || 10634 === t || 10635 === t || 10636 === t || 10637 === t || 10638 === t || 10639 === t || 10640 === t || 10641 === t || 10642 === t || 10643 === t || 10644 === t || 10645 === t || 10646 === t || 10647 === t || 10648 === t || t >= 10649 && t <= 10711 || 10712 === t || 10713 === t || 10714 === t || 10715 === t || t >= 10716 && t <= 10747 || 10748 === t || 10749 === t || t >= 10750 && t <= 11007 || t >= 11008 && t <= 11055 || t >= 11056 && t <= 11076 || t >= 11077 && t <= 11078 || t >= 11079 && t <= 11084 || t >= 11085 && t <= 11123 || t >= 11124 && t <= 11125 || t >= 11126 && t <= 11157 || 11158 === t || t >= 11159 && t <= 11263 || t >= 11776 && t <= 11777 || 11778 === t || 11779 === t || 11780 === t || 11781 === t || t >= 11782 && t <= 11784 || 11785 === t || 11786 === t || 11787 === t || 11788 === t || 11789 === t || t >= 11790 && t <= 11798 || 11799 === t || t >= 11800 && t <= 11801 || 11802 === t || 11803 === t || 11804 === t || 11805 === t || t >= 11806 && t <= 11807 || 11808 === t || 11809 === t || 11810 === t || 11811 === t || 11812 === t || 11813 === t || 11814 === t || 11815 === t || 11816 === t || 11817 === t || t >= 11818 && t <= 11822 || 11823 === t || t >= 11824 && t <= 11833 || t >= 11834 && t <= 11835 || t >= 11836 && t <= 11839 || 11840 === t || 11841 === t || 11842 === t || t >= 11843 && t <= 11855 || t >= 11856 && t <= 11857 || 11858 === t || t >= 11859 && t <= 11903 || t >= 12289 && t <= 12291 || 12296 === t || 12297 === t || 12298 === t || 12299 === t || 12300 === t || 12301 === t || 12302 === t || 12303 === t || 12304 === t || 12305 === t || t >= 12306 && t <= 12307 || 12308 === t || 12309 === t || 12310 === t || 12311 === t || 12312 === t || 12313 === t || 12314 === t || 12315 === t || 12316 === t || 12317 === t || t >= 12318 && t <= 12319 || 12320 === t || 12336 === t || 64830 === t || 64831 === t || t >= 65093 && t <= 65094;
  }
  function Wi(t) {
    t.forEach(function (t) {
      if (delete t.location, ti(t) || ei(t)) for (var e in t.options) delete t.options[e].location, Wi(t.options[e].value);else qe(t) && si(t.style) || (Je(t) || Qe(t)) && ni(t.style) ? delete t.style.location : ri(t) && Wi(t.children);
    });
  }
  function Zi(t, e) {
    void 0 === e && (e = {}), e = r({
      shouldParseSkeletons: !0,
      requiresOtherClause: !0
    }, e);
    var i = new Yi(t, e).parse();
    if (i.err) {
      var s = SyntaxError(Ue[i.err.kind]);
      throw s.location = i.err.location, s.originalMessage = i.err.message, s;
    }
    return (null == e ? void 0 : e.captureLocation) || Wi(i.val), i.val;
  }
  function Xi(t, e) {
    var i = e && e.cache ? e.cache : rr,
      r = e && e.serializer ? e.serializer : tr;
    return (e && e.strategy ? e.strategy : Qi)(t, {
      cache: i,
      serializer: r
    });
  }
  function Ki(t, e, i, r) {
    var s,
      n = null == (s = r) || "number" == typeof s || "boolean" == typeof s ? r : i(r),
      o = e.get(n);
    return void 0 === o && (o = t.call(this, r), e.set(n, o)), o;
  }
  function qi(t, e, i) {
    var r = Array.prototype.slice.call(arguments, 3),
      s = i(r),
      n = e.get(s);
    return void 0 === n && (n = t.apply(this, r), e.set(s, n)), n;
  }
  function Ji(t, e, i, r, s) {
    return i.bind(e, t, r, s);
  }
  function Qi(t, e) {
    return Ji(t, this, 1 === t.length ? Ki : qi, e.cache.create(), e.serializer);
  }
  var tr = function () {
    return JSON.stringify(arguments);
  };
  function er() {
    this.cache = Object.create(null);
  }
  er.prototype.get = function (t) {
    return this.cache[t];
  }, er.prototype.set = function (t, e) {
    this.cache[t] = e;
  };
  var ir,
    rr = {
      create: function () {
        return new er();
      }
    },
    sr = {
      variadic: function (t, e) {
        return Ji(t, this, qi, e.cache.create(), e.serializer);
      },
      monadic: function (t, e) {
        return Ji(t, this, Ki, e.cache.create(), e.serializer);
      }
    };
  !function (t) {
    t.MISSING_VALUE = "MISSING_VALUE", t.INVALID_VALUE = "INVALID_VALUE", t.MISSING_INTL_API = "MISSING_INTL_API";
  }(ir || (ir = {}));
  var nr,
    or = function (t) {
      function e(e, i, r) {
        var s = t.call(this, e) || this;
        return s.code = i, s.originalMessage = r, s;
      }
      return i(e, t), e.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }, e;
    }(Error),
    ar = function (t) {
      function e(e, i, r, s) {
        return t.call(this, 'Invalid values for "'.concat(e, '": "').concat(i, '". Options are "').concat(Object.keys(r).join('", "'), '"'), ir.INVALID_VALUE, s) || this;
      }
      return i(e, t), e;
    }(or),
    lr = function (t) {
      function e(e, i, r) {
        return t.call(this, 'Value for "'.concat(e, '" must be of type ').concat(i), ir.INVALID_VALUE, r) || this;
      }
      return i(e, t), e;
    }(or),
    hr = function (t) {
      function e(e, i) {
        return t.call(this, 'The intl string context variable "'.concat(e, '" was not provided to the string "').concat(i, '"'), ir.MISSING_VALUE, i) || this;
      }
      return i(e, t), e;
    }(or);
  function cr(t) {
    return "function" == typeof t;
  }
  function dr(t, e, i, r, s, n, o) {
    if (1 === t.length && Xe(t[0])) return [{
      type: nr.literal,
      value: t[0].value
    }];
    for (var a = [], l = 0, h = t; l < h.length; l++) {
      var c = h[l];
      if (Xe(c)) a.push({
        type: nr.literal,
        value: c.value
      });else if (ii(c)) "number" == typeof n && a.push({
        type: nr.literal,
        value: i.getNumberFormat(e).format(n)
      });else {
        var d = c.value;
        if (!s || !(d in s)) throw new hr(d, o);
        var u = s[d];
        if (Ke(c)) u && "string" != typeof u && "number" != typeof u || (u = "string" == typeof u || "number" == typeof u ? String(u) : ""), a.push({
          type: "string" == typeof u ? nr.literal : nr.object,
          value: u
        });else if (Je(c)) {
          var p = "string" == typeof c.style ? r.date[c.style] : ni(c.style) ? c.style.parsedOptions : void 0;
          a.push({
            type: nr.literal,
            value: i.getDateTimeFormat(e, p).format(u)
          });
        } else if (Qe(c)) {
          p = "string" == typeof c.style ? r.time[c.style] : ni(c.style) ? c.style.parsedOptions : r.time.medium;
          a.push({
            type: nr.literal,
            value: i.getDateTimeFormat(e, p).format(u)
          });
        } else if (qe(c)) {
          (p = "string" == typeof c.style ? r.number[c.style] : si(c.style) ? c.style.parsedOptions : void 0) && p.scale && (u *= p.scale || 1), a.push({
            type: nr.literal,
            value: i.getNumberFormat(e, p).format(u)
          });
        } else {
          if (ri(c)) {
            var g = c.children,
              m = c.value,
              f = s[m];
            if (!cr(f)) throw new lr(m, "function", o);
            var y = f(dr(g, e, i, r, s, n).map(function (t) {
              return t.value;
            }));
            Array.isArray(y) || (y = [y]), a.push.apply(a, y.map(function (t) {
              return {
                type: "string" == typeof t ? nr.literal : nr.object,
                value: t
              };
            }));
          }
          if (ti(c)) {
            if (!(_ = c.options[u] || c.options.other)) throw new ar(c.value, u, Object.keys(c.options), o);
            a.push.apply(a, dr(_.value, e, i, r, s));
          } else if (ei(c)) {
            var _;
            if (!(_ = c.options["=".concat(u)])) {
              if (!Intl.PluralRules) throw new or('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ir.MISSING_INTL_API, o);
              var b = i.getPluralRules(e, {
                type: c.pluralType
              }).select(u - (c.offset || 0));
              _ = c.options[b] || c.options.other;
            }
            if (!_) throw new ar(c.value, u, Object.keys(c.options), o);
            a.push.apply(a, dr(_.value, e, i, r, s, u - (c.offset || 0)));
          } else ;
        }
      }
    }
    return function (t) {
      return t.length < 2 ? t : t.reduce(function (t, e) {
        var i = t[t.length - 1];
        return i && i.type === nr.literal && e.type === nr.literal ? i.value += e.value : t.push(e), t;
      }, []);
    }(a);
  }
  function ur(t, e) {
    return e ? Object.keys(t).reduce(function (i, s) {
      var n, o;
      return i[s] = (n = t[s], (o = e[s]) ? r(r(r({}, n || {}), o || {}), Object.keys(n).reduce(function (t, e) {
        return t[e] = r(r({}, n[e]), o[e] || {}), t;
      }, {})) : n), i;
    }, r({}, t)) : t;
  }
  function pr(t) {
    return {
      create: function () {
        return {
          get: function (e) {
            return t[e];
          },
          set: function (e, i) {
            t[e] = i;
          }
        };
      }
    };
  }
  !function (t) {
    t[t.literal = 0] = "literal", t[t.object = 1] = "object";
  }(nr || (nr = {}));
  var gr = function () {
      function t(e, i, s, o) {
        var a,
          l = this;
        if (void 0 === i && (i = t.defaultLocale), this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }, this.format = function (t) {
          var e = l.formatToParts(t);
          if (1 === e.length) return e[0].value;
          var i = e.reduce(function (t, e) {
            return t.length && e.type === nr.literal && "string" == typeof t[t.length - 1] ? t[t.length - 1] += e.value : t.push(e.value), t;
          }, []);
          return i.length <= 1 ? i[0] || "" : i;
        }, this.formatToParts = function (t) {
          return dr(l.ast, l.locales, l.formatters, l.formats, t, void 0, l.message);
        }, this.resolvedOptions = function () {
          var t;
          return {
            locale: (null === (t = l.resolvedLocale) || void 0 === t ? void 0 : t.toString()) || Intl.NumberFormat.supportedLocalesOf(l.locales)[0]
          };
        }, this.getAst = function () {
          return l.ast;
        }, this.locales = i, this.resolvedLocale = t.resolveLocale(i), "string" == typeof e) {
          if (this.message = e, !t.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
          var h = o || {};
          h.formatters;
          var c = function (t, e) {
            var i = {};
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (i[r] = t[r]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
              var s = 0;
              for (r = Object.getOwnPropertySymbols(t); s < r.length; s++) e.indexOf(r[s]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[s]) && (i[r[s]] = t[r[s]]);
            }
            return i;
          }(h, ["formatters"]);
          this.ast = t.__parse(e, r(r({}, c), {
            locale: this.resolvedLocale
          }));
        } else this.ast = e;
        if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
        this.formats = ur(t.formats, s), this.formatters = o && o.formatters || (void 0 === (a = this.formatterCache) && (a = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }), {
          getNumberFormat: Xi(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.NumberFormat).bind.apply(t, n([void 0], e, !1)))();
          }, {
            cache: pr(a.number),
            strategy: sr.variadic
          }),
          getDateTimeFormat: Xi(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.DateTimeFormat).bind.apply(t, n([void 0], e, !1)))();
          }, {
            cache: pr(a.dateTime),
            strategy: sr.variadic
          }),
          getPluralRules: Xi(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.PluralRules).bind.apply(t, n([void 0], e, !1)))();
          }, {
            cache: pr(a.pluralRules),
            strategy: sr.variadic
          })
        });
      }
      return Object.defineProperty(t, "defaultLocale", {
        get: function () {
          return t.memoizedDefaultLocale || (t.memoizedDefaultLocale = new Intl.NumberFormat().resolvedOptions().locale), t.memoizedDefaultLocale;
        },
        enumerable: !1,
        configurable: !0
      }), t.memoizedDefaultLocale = null, t.resolveLocale = function (t) {
        if (void 0 !== Intl.Locale) {
          var e = Intl.NumberFormat.supportedLocalesOf(t);
          return e.length > 0 ? new Intl.Locale(e[0]) : new Intl.Locale("string" == typeof t ? t : t[0]);
        }
      }, t.__parse = Zi, t.formats = {
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
      }, t;
    }(),
    mr = gr,
    fr = {
      en: Ze
    };
  function yr(t, e, ...i) {
    const r = e.replace(/['"]+/g, "");
    var s;
    try {
      s = t.split(".").reduce((t, e) => t[e], fr[r]);
    } catch (e) {
      s = t.split(".").reduce((t, e) => t[e], fr.en);
    }
    if (void 0 === s && (s = t.split(".").reduce((t, e) => t[e], fr.en)), !i.length) return s;
    const n = {};
    for (let t = 0; t < i.length; t += 2) {
      let e = i[t];
      e = e.replace(/^{([^}]+)?}$/, "$1"), n[e] = i[t + 1];
    }
    try {
      return new mr(s, e).format(n);
    } catch (t) {
      return "Translation " + t;
    }
  }
  const _r = t => e => "function" == typeof e ? ((t, e) => (window.customElements.get(t) || window.customElements.define(t, e), e))(t, e) : ((t, e) => {
    const {
      kind: i,
      elements: r
    } = e;
    return {
      kind: i,
      elements: r,
      finisher(e) {
        window.customElements.get(t) || window.customElements.define(t, e);
      }
    };
  })(t, e);
  let br = class extends pt {
    constructor() {
      super(...arguments), this.camImgString = "none";
    }
    willUpdate(t) {
      var e;
      super.willUpdate(t), (t.has("showVideo") || t.has("cameraEntity")) && (this.camImgString = this.showVideo && this.cameraEntity ? `url('${(e = this.cameraEntity, `${window.location.origin}/api/camera_proxy_stream/${e.entity_id}?token=${e.attributes.access_token}`)}')` : "none");
    }
    render() {
      const t = {
        display: this.showVideo ? "block" : "none"
      };
      return X`
      <div
        class="ac-printercard-cameraview"
        style=${ge(t)}
        @click="${t => {
        this._handleToggleClick();
      }}"
      >
        ${this.showVideo ? this._renderInner() : q}
      </div>
    `;
    }
    _renderInner() {
      const t = {
        "background-image": this.camImgString
      };
      return X` <div
      class="ac-camera-wrapper"
      style=${ge(t)}
    ></div>`;
    }
    _handleToggleClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return u`
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
  };
  /**
       * @license
       * Copyright 2021 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function* vr(t, e) {
    if (void 0 !== t) {
      let i = 0;
      for (const r of t) yield e(r, i++);
    }
  }
  s([_t()], br.prototype, "showVideo", void 0), s([_t()], br.prototype, "toggleVideo", void 0), s([_t()], br.prototype, "cameraEntity", void 0), s([bt()], br.prototype, "camImgString", void 0), br = s([_r("anycubic-printercard-camera_view")], br);
  const wr = "secondary_",
    xr = "ace_run_out_refill",
    Sr = wr + xr,
    Er = "ace_spools",
    $r = wr + Er;
  let Cr = class extends pt {
    constructor() {
      super(...arguments), this.box_id = 0, this._runoutRefillId = xr, this._spoolsEntityId = Er, this.spoolList = [], this.selectedIndex = -1, this.selectedMaterialType = "", this.selectedColor = [0, 0, 0], this._handleRunoutRefillChanged = t => {
        this.hass.callService("switch", "toggle", {
          entity_id: jt(this.printerEntityIdPart, "switch", this._runoutRefillId)
        });
      };
    }
    willUpdate(t) {
      var e, i, r, s;
      super.willUpdate(t), t.has("language") && (this._buttonRefill = yr("card.buttons.runout_refill", this.language), this._buttonDry = yr("card.buttons.dry", this.language)), t.has("box_id") && (1 === this.box_id ? (this._runoutRefillId = Sr, this._spoolsEntityId = $r) : (this._runoutRefillId = xr, this._spoolsEntityId = Er)), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) && (this.spoolList = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, this._spoolsEntityId, "not loaded", {
        spool_info: []
      }).attributes.spool_info, this._runoutRefillState = (e = this.hass, i = this.printerEntities, r = this.printerEntityIdPart, s = this._runoutRefillId, Ut(e, Gt(i, r, "switch", s))));
    }
    render() {
      return X`
      <div class="ac-printercard-mcbview">
        <div class="ac-printercard-mcbmenu ac-printercard-menuleft">
          <div class="ac-switch" @click="${this._handleRunoutRefillChanged}">
            <div class="ac-switch-label">${this._buttonRefill}</div>
            <ha-entity-toggle
              .hass=${this.hass}
              .stateObj=${this._runoutRefillState}
            ></ha-entity-toggle>
          </div>
        </div>
        <div class="ac-printercard-spoolcont">${this._renderSpools()}</div>
        <div class="ac-printercard-mcbmenu ac-printercard-menuright">
          <ha-control-button
            @click="${t => {
        this._openDryingModal();
      }}"
          >
            <ha-svg-icon .path=${"M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z"}></ha-svg-icon>
            ${this._buttonDry}
          </ha-control-button>
        </div>
      </div>
    `;
    }
    _renderSpools() {
      return vr(this.spoolList, (t, e) => {
        const i = {
          "background-color": t.spool_loaded ? `rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})` : "#aaa"
        };
        return X`
        <div
          class="ac-spool-info"
          @click="${i => {
          this._editSpool(e, t.material_type, t.color);
        }}"
        >
          <div class="ac-spool-color-ring-cont">
            <div class="ac-spool-color-ring-inner" style=${ge(i)}>
              <div class="ac-spool-color-num">${e + 1}</div>
            </div>
          </div>
          <div class="ac-spool-material-type">
            ${t.spool_loaded ? t.material_type : "---"}
          </div>
        </div>
      `;
      });
    }
    _openDryingModal() {
      At(this, "ac-mcbdry-modal", {
        modalOpen: !0,
        box_id: this.box_id
      });
    }
    _editSpool(t, e, i) {
      At(this, "ac-mcb-modal", {
        modalOpen: !0,
        box_id: this.box_id,
        spool_index: t,
        material_type: e,
        color: i
      });
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbview {
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbmenu {
        height: 100%;
        position: relative;
        width: 10.42%;
      }

      .ac-printercard-spoolcont {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 62.5%;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
        cursor: pointer;
        width: 25%;
        padding: 5px;
      }

      .ac-spool-color-ring-cont {
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-spool-color-ring-cont:before {
        content: "";
        display: block;
        padding-top: 100%;
      }

      .ac-spool-color-ring-inner {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: #aaa;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-spool-color-num {
        font-weight: 900;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #eee;
        width: 46.5%;
        height: 46.5%;
        color: #222;
        text-align: center;
      }

      .ac-spool-color-num:before {
        content: "";
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        padding-top: 2.5px;
      }

      .ac-spool-material-type {
        height: auto;
        text-align: center;
        font-weight: 900;
      }

      .ac-printercard-mcbmenu ha-control-button {
        font-size: 12px;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        min-width: 48px;
        min-height: 48px;
        width: 100%;
      }

      .ac-printercard-menuright ha-control-button {
        right: 0px;
      }

      .ac-printercard-mcbmenu .ac-switch-label {
        font-size: 12px;
      }

      .ac-printercard-mcbmenu .ac-switch {
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        margin: 0px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        box-sizing: border-box;
        padding: 4px 4px;
        justify-content: center;
        background-color: #8686862e;
        border-radius: 8px;
      }

      .ac-printercard-mcbmenu .ac-switch:hover {
        background-color: #86868669;
      }
    `;
    }
  };
  s([_t()], Cr.prototype, "hass", void 0), s([_t()], Cr.prototype, "language", void 0), s([_t()], Cr.prototype, "printerEntities", void 0), s([_t()], Cr.prototype, "printerEntityIdPart", void 0), s([_t()], Cr.prototype, "box_id", void 0), s([bt()], Cr.prototype, "_runoutRefillId", void 0), s([bt()], Cr.prototype, "_spoolsEntityId", void 0), s([bt()], Cr.prototype, "spoolList", void 0), s([bt()], Cr.prototype, "selectedIndex", void 0), s([bt()], Cr.prototype, "selectedMaterialType", void 0), s([bt()], Cr.prototype, "selectedColor", void 0), s([bt()], Cr.prototype, "_runoutRefillState", void 0), s([bt()], Cr.prototype, "_buttonRefill", void 0), s([bt()], Cr.prototype, "_buttonDry", void 0), Cr = s([_r("anycubic-printercard-multicolorbox_view")], Cr);
  class Ar {
    constructor(t) {
      this.scale_factor = t;
    }
    val(t) {
      return this.scale_factor * t;
    }
    og(t) {
      return t / this.scale_factor;
    }
    scaleFactor() {
      return this.scale_factor;
    }
  }
  const Tr = {
    top: {
      width: 340,
      height: 20
    },
    bottom: {
      width: 340,
      height: 52.3
    },
    left: {
      width: 30,
      height: 400
    },
    right: {
      width: 30,
      height: 380
    },
    buildplate: {
      maxWidth: 250,
      maxHeight: 260,
      verticalOffset: 55
    },
    xAxis: {
      stepper: !0,
      width: 400,
      offsetLeft: -30,
      height: 30,
      extruder: {
        width: 60,
        height: 100
      }
    }
  };
  class Pr {
    constructor(t, {
      target: e,
      config: i,
      callback: r,
      skipInitial: s
    }) {
      this.t = new Set(), this.o = !1, this.i = !1, this.h = t, null !== e && this.t.add(e ?? t), this.l = i, this.o = s ?? this.o, this.callback = r, window.ResizeObserver ? (this.u = new ResizeObserver(t => {
        this.handleChanges(t), this.h.requestUpdate();
      }), t.addController(this)) : console.warn("ResizeController error: browser does not support ResizeObserver.");
    }
    handleChanges(t) {
      this.value = this.callback?.(t, this.u);
    }
    hostConnected() {
      for (const t of this.t) this.observe(t);
    }
    hostDisconnected() {
      this.disconnect();
    }
    async hostUpdated() {
      !this.o && this.i && this.handleChanges([]), this.i = !1;
    }
    observe(t) {
      this.t.add(t), this.u.observe(t, this.l), this.i = !0, this.h.requestUpdate();
    }
    unobserve(t) {
      this.t.delete(t), this.u.unobserve(t);
    }
    disconnect() {
      this.u.disconnect();
    }
  }
  const kr = {
      keyframeOptions: {
        duration: 2e3,
        direction: "alternate",
        composite: "add"
      },
      properties: ["left"]
    },
    Mr = {
      keyframeOptions: {
        duration: 100,
        composite: "add"
      },
      properties: ["top"]
    };
  let Dr = class extends pt {
    constructor() {
      super(...arguments), this._progressNum = 0, this.animKeyframeGantry = 0, this._isPrinting = !1, this._gantryAnimOptions = () => Object.assign(Object.assign({}, kr), {
        onComplete: this._moveGantry,
        disabled: !(this.dimensions && this._isPrinting)
      }), this._onResizeEvent = () => {
        if (this._rootElement) {
          const t = this._rootElement.clientHeight,
            e = this._rootElement.clientWidth;
          this._setDimensions(e, t);
        }
      }, this._moveGantry = () => {
        this.animKeyframeGantry = this._isPrinting ? Number(!this.animKeyframeGantry) : 0;
      };
    }
    connectedCallback() {
      super.connectedCallback(), this.resizeObserver = new Pr(this, {
        callback: this._onResizeEvent
      }), this.dimensions && this._isPrinting && this._moveGantry();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("scaleFactor") && this._onResizeEvent(), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        const t = Xt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_preview");
        this.imagePreviewUrl !== t && (this.imagePreviewUrl = t, this.imagePreviewBgUrl = this.imagePreviewUrl ? `url('${t}')` : void 0), this._progressNum = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_progress", 0).state / 100;
        const e = Jt(Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state").state.toLowerCase());
        this.dimensions && !this._isPrinting && e && this._moveGantry(), this._isPrinting = e;
      }
    }
    update(t) {
      if (super.update(t), (t.has("dimensions") || t.has("animKeyframeGantry") || t.has("hass")) && this.dimensions) {
        const e = -1 * this._progressNum * this.dimensions.BuildArea.height;
        Nt(this._elAcAPr_xaxis, Object.assign(Object.assign({}, this.dimensions.XAxis), {
          top: this.dimensions.XAxis.top + e
        })), Nt(this._elAcAPr_gantry, Object.assign(Object.assign({}, this.dimensions.Gantry), {
          left: 0 !== this.animKeyframeGantry ? this.dimensions.Gantry.left + this.dimensions.BuildPlate.width : this.dimensions.Gantry.left,
          top: this.dimensions.Gantry.top + e
        })), Nt(this._elAcAPr_animprint, {
          height: 100 * this._progressNum + "%"
        }), t.has("dimensions") && this.dimensions && (Nt(this._elAcAPr_scalable, Object.assign({}, this.dimensions.Scalable)), Nt(this._elAcAPr_frame, Object.assign({}, this.dimensions.Frame)), Nt(this._elAcAPr_hole, Object.assign({}, this.dimensions.Hole)), Nt(this._elAcAPr_buildarea, Object.assign({}, this.dimensions.BuildArea)), Nt(this._elAcAPr_buildplate, Object.assign({}, this.dimensions.BuildPlate)), Nt(this._elAcAPr_nozzle, Object.assign({}, this.dimensions.Nozzle)));
      }
    }
    render() {
      const t = {
        "background-image": this.imagePreviewBgUrl
      };
      return X`
      <div class="ac-printercard-animatedprinter">
        ${this.dimensions ? X` <div class="ac-apr-scalable">
              <div class="ac-apr-frame">
                <div class="ac-apr-hole"></div>
              </div>
              <div class="ac-apr-buildarea">
                <div class="ac-apr-animprint">
                  ${this.imagePreviewBgUrl ? X`
                        <div
                          class="ac-apr-imgprev"
                          style=${ge(t)}
                        ></div>
                      ` : q}
                </div>
              </div>
              <div class="ac-apr-buildplate"></div>
              <div
                class="ac-apr-xaxis"
                ${Le(Object.assign({}, Mr))}
              ></div>
              <div
                class="ac-apr-gantry"
                ${Le(Object.assign({}, Mr))}
                ${Le(this._gantryAnimOptions)}
              >
                <div class="ac-apr-nozzle"></div>
              </div>
            </div>` : q}
      </div>
    `;
    }
    _setDimensions(t, e) {
      this.dimensions = function (t, e, i) {
        const r = e.height / (t.top.height + t.bottom.height + t.left.height),
          s = e.width / (t.top.width + t.left.width + t.right.width),
          n = new Ar(Math.min(r, s) * i),
          o = n.val(t.top.width),
          a = n.val(t.top.height + t.bottom.height + t.left.height),
          l = n.val(t.top.width - (t.left.width + t.right.width)),
          h = n.val(t.left.height),
          c = n.val(t.left.width),
          d = n.val(t.top.height),
          u = n.val(t.top.height - t.buildplate.verticalOffset) + h,
          p = u + n.val((t.xAxis.extruder.height - t.xAxis.height) / 2 - (t.xAxis.extruder.height + 12)),
          g = n.val(t.buildplate.maxWidth),
          m = n.val(t.buildplate.maxHeight),
          f = n.val(t.left.width + (n.og(l) - t.buildplate.maxWidth) / 2),
          y = u - n.val(t.buildplate.maxHeight),
          _ = g,
          b = f,
          v = u,
          w = n.val(t.xAxis.width),
          x = n.val(t.xAxis.height),
          S = n.val(t.xAxis.offsetLeft),
          E = w,
          $ = x,
          C = n.val(t.xAxis.extruder.width),
          A = n.val(t.xAxis.extruder.height),
          T = b - C / 2,
          P = T + g,
          k = n.val(12),
          M = n.val(12),
          D = v - A - M;
        return {
          Scalable: {
            width: o,
            height: a
          },
          Frame: {
            width: o,
            height: a
          },
          Hole: {
            width: l,
            height: h,
            left: c,
            top: d
          },
          BuildArea: {
            width: g,
            height: m,
            left: f,
            top: y
          },
          BuildPlate: {
            width: _,
            left: b,
            top: v
          },
          XAxis: {
            width: w,
            height: x,
            left: S,
            top: D + .7 * A - x / 2
          },
          Track: {
            width: E,
            height: $
          },
          Basis: {
            Y: u,
            X: p
          },
          Gantry: {
            width: C,
            height: A,
            left: T,
            top: D
          },
          Nozzle: {
            width: k,
            height: M,
            left: (C - k) / 2,
            top: A
          },
          GantryMaxLeft: P
        };
      }(this.printerConfig, {
        width: t,
        height: e
      }, this.scaleFactor || 1);
    }
    static get styles() {
      return u`
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      .ac-printercard-animatedprinter {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-apr-scalable {
        position: relative;
      }

      .ac-apr-frame {
        top: 0px;
        left: 0px;
        border-radius: 8px;
        background-color: #bbbbbb;
        position: absolute;
      }

      .ac-apr-hole {
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        border-radius: 8px;
      }

      .ac-apr-buildarea {
        background-color: rgba(0, 0, 0, 0.075);
        box-sizing: border-box;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        border-radius: 8px;
        overflow: hidden;
      }

      .ac-apr-buildplate {
        box-sizing: border-box;
        border-radius: 8px;
        position: absolute;
        background-color: #333333;
        height: 8px;
      }

      .ac-apr-xaxis {
        position: absolute;
        border-radius: 8px;
        background-color: #aaaaaa;
      }

      .ac-apr-animprint {
        background-color: var(--primary-text-color);
        width: 100%;
      }

      .ac-apr-imgprev {
        height: 100%;
        width: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: 100%;
      }

      .ac-apr-gantry {
        background-color: #333333;
        border-radius: 4px;
        box-sizing: border-box;
        position: absolute;
      }

      .ac-apr-nozzle {
        background-color: #aaaaaa;
        position: absolute;
        width: 12px;
        height: 12px;
        clip-path: polygon(100% 0, 100% 50%, 50% 75%, 0 50%, 0 0);
      }
    `;
    }
  };
  s([wt(".ac-printercard-animatedprinter")], Dr.prototype, "_rootElement", void 0), s([wt(".ac-apr-scalable")], Dr.prototype, "_elAcAPr_scalable", void 0), s([wt(".ac-apr-frame")], Dr.prototype, "_elAcAPr_frame", void 0), s([wt(".ac-apr-hole")], Dr.prototype, "_elAcAPr_hole", void 0), s([wt(".ac-apr-buildarea")], Dr.prototype, "_elAcAPr_buildarea", void 0), s([wt(".ac-apr-animprint")], Dr.prototype, "_elAcAPr_animprint", void 0), s([wt(".ac-apr-buildplate")], Dr.prototype, "_elAcAPr_buildplate", void 0), s([wt(".ac-apr-xaxis")], Dr.prototype, "_elAcAPr_xaxis", void 0), s([wt(".ac-apr-gantry")], Dr.prototype, "_elAcAPr_gantry", void 0), s([wt(".ac-apr-nozzle")], Dr.prototype, "_elAcAPr_nozzle", void 0), s([_t()], Dr.prototype, "hass", void 0), s([_t()], Dr.prototype, "scaleFactor", void 0), s([_t()], Dr.prototype, "printerConfig", void 0), s([_t()], Dr.prototype, "printerEntities", void 0), s([_t()], Dr.prototype, "printerEntityIdPart", void 0), s([bt()], Dr.prototype, "dimensions", void 0), s([bt()], Dr.prototype, "resizeObserver", void 0), s([bt()], Dr.prototype, "_progressNum", void 0), s([bt({
    type: Number
  })], Dr.prototype, "animKeyframeGantry", void 0), s([bt({
    type: Boolean
  })], Dr.prototype, "_isPrinting", void 0), s([bt()], Dr.prototype, "imagePreviewUrl", void 0), s([bt()], Dr.prototype, "imagePreviewBgUrl", void 0), Dr = s([_r("anycubic-printercard-animated_printer")], Dr);
  let Hr = class extends pt {
    render() {
      return X`
      <div
        class="ac-printercard-printerview"
        @click="${t => {
        this._viewClick();
      }}"
      >
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .scaleFactor=${this.scaleFactor}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${Tr}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
    }
    _viewClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-printerview {
        height: 100%;
        box-sizing: border-box;
      }
    `;
    }
  };
  s([_t()], Hr.prototype, "hass", void 0), s([_t({
    type: Function
  })], Hr.prototype, "toggleVideo", void 0), s([_t()], Hr.prototype, "printerEntities", void 0), s([_t()], Hr.prototype, "printerEntityIdPart", void 0), s([_t()], Hr.prototype, "scaleFactor", void 0), Hr = s([_r("anycubic-printercard-printer_view")], Hr);
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Or = (t, e, i) => {
      const r = new Map();
      for (let s = e; s <= i; s++) r.set(t[s], s);
      return r;
    },
    Ir = he(class extends ce {
      constructor(t) {
        if (super(t), t.type !== le) throw Error("repeat() can only be used in text expressions");
      }
      dt(t, e, i) {
        let r;
        void 0 === i ? i = e : void 0 !== e && (r = e);
        const s = [],
          n = [];
        let o = 0;
        for (const e of t) s[o] = r ? r(e, o) : o, n[o] = i(e, o), o++;
        return {
          values: n,
          keys: s
        };
      }
      render(t, e, i) {
        return this.dt(t, e, i).values;
      }
      update(t, [e, i, r]) {
        const s = (t => t._$AH)(t),
          {
            values: n,
            keys: o
          } = this.dt(e, i, r);
        if (!Array.isArray(s)) return this.ut = o, n;
        const a = this.ut ??= [],
          l = [];
        let h,
          c,
          d = 0,
          u = s.length - 1,
          p = 0,
          g = n.length - 1;
        for (; d <= u && p <= g;) if (null === s[d]) d++;else if (null === s[u]) u--;else if (a[d] === o[p]) l[p] = _e(s[d], n[p]), d++, p++;else if (a[u] === o[g]) l[g] = _e(s[u], n[g]), u--, g--;else if (a[d] === o[g]) l[g] = _e(s[d], n[g]), ye(t, l[g + 1], s[d]), d++, g--;else if (a[u] === o[p]) l[p] = _e(s[u], n[p]), ye(t, s[d], s[u]), u--, p++;else if (void 0 === h && (h = Or(o, p, g), c = Or(a, d, u)), h.has(a[d])) {
          if (h.has(a[u])) {
            const e = c.get(o[p]),
              i = void 0 !== e ? s[e] : null;
            if (null === i) {
              const e = ye(t, s[d]);
              _e(e, n[p]), l[p] = e;
            } else l[p] = _e(i, n[p]), ye(t, s[d], i), s[e] = null;
            p++;
          } else ve(s[u]), u--;
        } else ve(s[d]), d++;
        for (; p <= g;) {
          const e = ye(t, l[g + 1]);
          _e(e, n[p]), l[p++] = e;
        }
        for (; d <= u;) {
          const t = s[d++];
          null !== t && ve(t);
        }
        return this.ut = o, ((t, e = be) => {
          t._$AH = e;
        })(t, l), K;
      }
    });
  let Fr = class extends pt {
    render() {
      const t = {
        width: String(this.progress) + "%"
      };
      return X`
      <div class="ac-stat-line">
        <p class="ac-stat-heading">${this.name}</p>
        <div class="ac-stat-value">
          <div class="ac-progress-bar">
            <div class="ac-stat-text">${this.value}</div>
            <div
              class="ac-progress-line"
              style=${ge(t)}
            ></div>
          </div>
        </div>
      </div>
    `;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-value {
        margin: 0;
        display: inline-block;
        max-width: calc(100% - 120px);
        width: 100%;
        position: relative;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: block;
        position: relative;
        top: 3px;
        left: 0px;
        z-index: 1;
        text-align: center;
      }

      .ac-stat-heading {
        margin: 0;
        font-size: 16px;
        display: block;
        font-weight: bold;
      }

      .ac-progress-bar {
        display: block;
        width: 100%;
        height: 30px;
        background-color: #8b8b8b6e;
        position: relative;
      }

      .ac-progress-line {
        position: absolute;
        top: 0px;
        left: 0px;
        display: block;
        height: 100%;
        background-color: #ee8f36e6;
        border-right: 2px solid #ffd151e6;
        box-shadow: 4px 0px 6px 0px rgb(255 245 126 / 25%);
      }
    `;
    }
  };
  s([_t({
    type: String
  })], Fr.prototype, "name", void 0), s([_t({
    type: Number
  })], Fr.prototype, "value", void 0), s([_t({
    type: Number
  })], Fr.prototype, "progress", void 0), Fr = s([_r("anycubic-printercard-progress-line")], Fr);
  let Br = class extends pt {
    constructor() {
      super(...arguments), this.unit = "";
    }
    render() {
      return X`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}${this.unit}</p>
      </div>
    `;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stat-line {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 2px 0;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: inline-block;
        max-width: calc(100% - 120px);
        text-align: right;
        word-wrap: break-word;
      }

      .ac-stat-heading {
        font-weight: bold;
        max-width: unset;
        overflow: unset;
      }
    `;
    }
  };
  s([_t({
    type: String
  })], Br.prototype, "name", void 0), s([_t({
    type: String
  })], Br.prototype, "value", void 0), s([_t({
    type: String
  })], Br.prototype, "unit", void 0), Br = s([_r("anycubic-printercard-stat-line")], Br);
  let Nr = class extends pt {
    render() {
      return X`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${ee(this.temperatureEntity, this.temperatureUnit, this.round)}
    ></anycubic-printercard-stat-line>`;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  s([_t({
    type: String
  })], Nr.prototype, "name", void 0), s([_t()], Nr.prototype, "temperatureEntity", void 0), s([_t({
    type: Boolean
  })], Nr.prototype, "round", void 0), s([_t({
    type: String
  })], Nr.prototype, "temperatureUnit", void 0), Nr = s([_r("anycubic-printercard-stat-temperature")], Nr);
  let Lr = class extends pt {
    constructor() {
      super(...arguments), this.currentTime = 0, this.lastIntervalId = -1;
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("timeEntity") && (-1 !== this.lastIntervalId && clearInterval(this.lastIntervalId), this.currentTime = function (t, e = !1) {
        let i;
        if (t.state) {
          if (t.state.includes(", ")) {
            const [e, r] = t.state.split(", "),
              [s, n, o] = r.split(":");
            i = 60 * +e.match(/\d+/)[0] * 60 * 24 + 60 * +s * 60 + 60 * +n + +o;
          } else if (t.state.includes(":")) {
            const [e, r, s] = t.state.split(":");
            i = 60 * +e * 60 + 60 * +r + +s;
          } else i = e ? +t.state : 60 * +t.state;
        } else i = 0;
        return i;
      }(this.timeEntity), this.lastIntervalId = setInterval(() => this._incTime(), 1e3));
    }
    disconnectedCallback() {
      super.disconnectedCallback(), clearInterval(this.lastIntervalId);
    }
    render() {
      return X`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${((t, e, i = !1, r = !1) => {
        switch (e) {
          case Tt.Remaining:
            return Qt(t, i);
          case Tt.ETA:
            return Ct().add(t, "seconds").format(r ? "HH:mm" : "h:mm a");
          case Tt.Elapsed:
            return Qt(t, i);
          default:
            return "<unknown>";
        }
      })(this.currentTime, this.timeType, this.round, this.use_24hr)}
    ></anycubic-printercard-stat-line>`;
    }
    _incTime() {
      this.currentTime = parseInt(this.currentTime) + parseInt(this.direction);
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  s([_t()], Lr.prototype, "timeEntity", void 0), s([_t()], Lr.prototype, "timeType", void 0), s([_t({
    type: String
  })], Lr.prototype, "name", void 0), s([_t({
    type: Number
  })], Lr.prototype, "direction", void 0), s([_t({
    type: Boolean
  })], Lr.prototype, "round", void 0), s([_t({
    type: Boolean
  })], Lr.prototype, "use_24hr", void 0), s([_t({
    type: Boolean
  })], Lr.prototype, "isSeconds", void 0), s([bt({
    type: Number
  })], Lr.prototype, "currentTime", void 0), s([bt({
    type: Number
  })], Lr.prototype, "lastIntervalId", void 0), Lr = s([_r("anycubic-printercard-stat-time")], Lr);
  let Ur = class extends pt {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = Pt.C, this.progressPercent = 0, this._valDryProgress = 0;
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        this._entETA = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_remaining"), this._entElapsed = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_elapsed"), this._entRemaining = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_time_remaining"), this._entBedCurrent = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature"), this._entHotendCurrent = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature"), this._entBedTarget = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature"), this._entHotendTarget = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature"), this._valStatus = Lt(Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state").state), this._valOnline = qt(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_online", "Online", "Offline"), this._valAvailability = Lt(Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "current_status").state), this._valJobName = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_name").state, this._valCurrentLayer = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_current_layer").state;
        const t = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_speed_mode", "", {
            available_modes: [],
            print_speed_mode_code: -1
          }),
          e = ne(t),
          i = t.attributes.print_speed_mode_code;
        this._valSpeedMode = i >= 0 && i in e ? e[i] : "Unknown", this._valFanSpeed = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "fan_speed", 0).state, this._valDryStatus = qt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_active", "Drying", "Not Drying");
        const r = Number(Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_total_duration", 0).state),
          s = Number(Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_remaining_time", 0).state);
        this._valDryRemain = isNaN(s) ? "" : `${s} Mins`, this._valDryProgress = !isNaN(r) && r > 0 ? s / r * 100 : 0, this._valOnTime = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_on_time", 0).state, this._valOffTime = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_off_time", 0).state, this._valBottomTime = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_bottom_time", 0).state, this._valModelHeight = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_model_height", 0).state, this._valBottomLayers = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_bottom_layers", 0).state, this._valZUpHeight = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_up_height", 0).state, this._valZUpSpeed = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_up_speed", 0).state, this._valZDownSpeed = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_z_down_speed", 0).state;
      }
      (t.has("language") || t.has("monitoredStats")) && (this._statTranslations = this.monitoredStats.reduce((t, e) => (t[e] = yr(`card.monitored_stats.${e}`, this.language), t), {}));
    }
    render() {
      return X`
      <div class="ac-stats-box ac-stats-section">
        ${this.showPercent ? X`
              <div class="ac-stats-box ac-stats-part-percent">
                <p class="ac-stats-part-percent-text">
                  ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
                </p>
              </div>
            ` : null}
        <div class="ac-stats-box ac-stats-section">${this._renderStats()}</div>
      </div>
    `;
    }
    _renderStats() {
      return Ir(this.monitoredStats, t => t, (t, e) => {
        switch (t) {
          case Ot.Status:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valStatus}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ETA:
            return X`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entETA}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ot.Elapsed:
            return X`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entElapsed}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ot.Remaining:
            return X`
              <anycubic-printercard-stat-time
                .timeEntity=${this._entRemaining}
                .timeType=${t}
                .name=${this._statTranslations[t]}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ot.BedCurrent:
            return X`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entBedCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ot.HotendCurrent:
            return X`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entHotendCurrent}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ot.BedTarget:
            return X`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entBedTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ot.HotendTarget:
            return X`
              <anycubic-printercard-stat-temperature
                .name=${this._statTranslations[t]}
                .temperatureEntity=${this._entHotendTarget}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ot.PrinterOnline:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOnline}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.Availability:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valAvailability}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ProjectName:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valJobName}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.CurrentLayer:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valCurrentLayer}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.SpeedMode:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valSpeedMode}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.FanSpeed:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valFanSpeed}
                .unit=${"%"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.DryingStatus:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valDryStatus}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.DryingTime:
            return X`
              <anycubic-printercard-progress-line
                .name=${this._statTranslations[t]}
                .value=${this._valDryRemain}
                .progress=${this._valDryProgress}
              ></anycubic-printercard-progress-line>
            `;
          case Ot.OnTime:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOnTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.OffTime:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valOffTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.BottomTime:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valBottomTime}
                .unit=${"s"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ModelHeight:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valModelHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.BottomLayers:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valBottomLayers}
                .unit=${"layers"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ZUpHeight:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZUpHeight}
                .unit=${"mm"}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ZUpSpeed:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZUpSpeed}
              ></anycubic-printercard-stat-line>
            `;
          case Ot.ZDownSpeed:
            return X`
              <anycubic-printercard-stat-line
                .name=${this._statTranslations[t]}
                .value=${this._valZDownSpeed}
              ></anycubic-printercard-stat-line>
            `;
          default:
            return X`
              <anycubic-printercard-stat-line
                .name=${"Unknown"}
                .value=${"<unknown>"}
              ></anycubic-printercard-stat-line>
            `;
        }
      });
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stats-box {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }

      .ac-stats-section {
        flex-direction: column;
        justify-content: center;
      }

      .ac-stats-part-percent {
        justify-content: center;
        margin-bottom: 20px;
      }
      .ac-stats-part-percent-text {
        margin: 0px;
        font-size: 42px;
        font-weight: bold;
        height: 44px;
        line-height: 44px;
      }
    `;
    }
  };
  s([_t()], Ur.prototype, "hass", void 0), s([_t()], Ur.prototype, "language", void 0), s([_t()], Ur.prototype, "monitoredStats", void 0), s([_t({
    type: Boolean
  })], Ur.prototype, "showPercent", void 0), s([_t({
    type: Boolean
  })], Ur.prototype, "round", void 0), s([_t({
    type: Boolean
  })], Ur.prototype, "use_24hr", void 0), s([_t({
    type: String
  })], Ur.prototype, "temperatureUnit", void 0), s([_t()], Ur.prototype, "printerEntities", void 0), s([_t()], Ur.prototype, "printerEntityIdPart", void 0), s([_t()], Ur.prototype, "progressPercent", void 0), s([bt()], Ur.prototype, "_statTranslations", void 0), s([bt()], Ur.prototype, "_entETA", void 0), s([bt()], Ur.prototype, "_entElapsed", void 0), s([bt()], Ur.prototype, "_entRemaining", void 0), s([bt()], Ur.prototype, "_entBedCurrent", void 0), s([bt()], Ur.prototype, "_entHotendCurrent", void 0), s([bt()], Ur.prototype, "_entBedTarget", void 0), s([bt()], Ur.prototype, "_entHotendTarget", void 0), s([bt()], Ur.prototype, "_valStatus", void 0), s([bt()], Ur.prototype, "_valOnline", void 0), s([bt()], Ur.prototype, "_valAvailability", void 0), s([bt()], Ur.prototype, "_valJobName", void 0), s([bt()], Ur.prototype, "_valCurrentLayer", void 0), s([bt()], Ur.prototype, "_valSpeedMode", void 0), s([bt()], Ur.prototype, "_valFanSpeed", void 0), s([bt()], Ur.prototype, "_valDryStatus", void 0), s([bt()], Ur.prototype, "_valDryRemain", void 0), s([bt()], Ur.prototype, "_valDryProgress", void 0), s([bt()], Ur.prototype, "_valOnTime", void 0), s([bt()], Ur.prototype, "_valOffTime", void 0), s([bt()], Ur.prototype, "_valBottomTime", void 0), s([bt()], Ur.prototype, "_valModelHeight", void 0), s([bt()], Ur.prototype, "_valBottomLayers", void 0), s([bt()], Ur.prototype, "_valZUpHeight", void 0), s([bt()], Ur.prototype, "_valZUpSpeed", void 0), s([bt()], Ur.prototype, "_valZDownSpeed", void 0), Ur = s([_r("anycubic-printercard-stats-component")], Ur);
  const Rr = u`
  :host {
    display: none;
    position: fixed;
    z-index: 10;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(3px);
  }

  .ac-modal-container {
    border-radius: 16px;
    background-color: var(--primary-background-color);
    margin: auto;
    padding: 50px;
    width: 80%;
    min-height: 150px;
    max-width: 600px;
    margin-top: 50px;
    box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.3);
  }

  .ac-modal-card {
    padding: 20px;
  }
  .ac-modal-close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .ac-modal-close:hover,
  .ac-modal-close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }

  .ac-modal-label {
  }

  @media (max-width: 599px) {
    .ac-modal-container {
      width: 95%;
      padding: 6px;
    }
  }
`;
  let Yr = class extends pt {
    constructor() {
      super(...arguments), this._isActive = !1;
    }
    render() {
      const t = {
        filter: this._isActive ? "brightness(80%)" : "brightness(100%)"
      };
      return X`
      <button
        class="ac-ui-seld-select"
        style=${ge(t)}
        @mouseenter="${t => {
        this._setActive();
      }}"
        @mousedown="${t => {
        this._setActive();
      }}"
        @mouseup="${t => {
        this._setInactive();
      }}"
        @mouseleave="${t => {
        this._setInactive();
      }}"
      >
        ${this.item}
      </button>
    `;
    }
    _setActive() {
      this._isActive = !0;
    }
    _setInactive() {
      this._isActive = !1;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-ui-seld-select {
        width: 100%;
        border: none;
        outline: none;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        text-align: left;
        cursor: pointer;
        color: var(--primary-text-color);
      }
    `;
    }
  };
  s([_t()], Yr.prototype, "item", void 0), s([bt()], Yr.prototype, "_isActive", void 0), Yr = s([_r("anycubic-ui-select-dropdown-item")], Yr);
  let zr = class extends pt {
    constructor() {
      super(...arguments), this._active = !1, this._hidden = !1;
    }
    async firstUpdated() {
      this._selectedItem = this.initialItem, this._hidden = !0, this._active = !1, this.requestUpdate();
    }
    render() {
      const t = {
          backgroundColor: this._active ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)"
        },
        e = {
          opacity: this._hidden ? 0 : 1,
          transform: this._hidden ? "scaleY(0.0)" : "scaleY(1.0)"
        };
      return this.availableOptions ? X`
          <button
            class="ac-ui-select-button"
            style=${ge(t)}
            @click="${t => {
        this._showOptions();
      }}"
            @mouseenter="${t => {
        this._setActive();
      }}"
            @mouseleave="${t => {
        this._setInactive();
      }}"
          >
            ${this._selectedItem ? this._selectedItem : this.placeholder}
            <ha-svg-icon .path=${oe}></ha-svg-icon>
          </button>
          <div class="ac-ui-select-options" style=${ge(e)}>
            ${this._renderOptions()}
          </div>
        ` : q;
    }
    _renderOptions() {
      return vr(Object.keys(this.availableOptions), (t, e) => X`
        <anycubic-ui-select-dropdown-item
          .item=${this.availableOptions[t]}
          @click="${e => {
        this._selectItem(t);
      }}"
        ></anycubic-ui-select-dropdown-item>
      `);
    }
    _showOptions() {
      this._hidden = !1;
    }
    _hideOptions() {
      this._hidden = !0;
    }
    _setActive() {
      this._active = !0;
    }
    _setInactive() {
      this._active = !1;
    }
    _selectItem(t) {
      this._selectedItem = this.availableOptions[t], At(this, "ac-select-dropdown", {
        key: t,
        value: this.availableOptions[t]
      }), this._hidden = !0;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        border-radius: 8px;
      }

      .ac-ui-select-button {
        width: 100%;
        border: none;
        outline: none;
        padding: 0 16px;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        line-height: 48px;
        border-radius: 8px;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: rgba(0, 0, 0, 0.05);
        align-items: center;
        color: var(--primary-text-color);
      }

      .ac-ui-select-options {
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        box-shadow:
          0px 10px 20px rgba(0, 0, 0, 0.19),
          0px 6px 6px rgba(0, 0, 0, 0.23);
        z-index: 11;
        opacity: 0;
        transform: scaleY(0);
        transform-origin: top center;
      }
    `;
    }
  };
  s([_t()], zr.prototype, "availableOptions", void 0), s([_t()], zr.prototype, "placeholder", void 0), s([_t()], zr.prototype, "initialItem", void 0), s([bt()], zr.prototype, "_selectedItem", void 0), s([bt()], zr.prototype, "_active", void 0), s([bt()], zr.prototype, "_hidden", void 0), zr = s([_r("anycubic-ui-select-dropdown")], zr);
  const jr = {
      keyframeOptions: {
        duration: 250,
        direction: "alternate",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    Gr = "drying_preset_1",
    Vr = "drying_preset_2",
    Wr = "drying_preset_3",
    Zr = "drying_preset_4",
    Xr = "drying_stop",
    Kr = "secondary_",
    qr = Kr + Gr,
    Jr = Kr + Vr,
    Qr = Kr + Wr,
    ts = Kr + Zr,
    es = Kr + Xr;
  let is = class extends pt {
    constructor() {
      super(...arguments), this.box_id = 0, this._dryingPresetId1 = Gr, this._dryingPresetId2 = Vr, this._dryingPresetId3 = Wr, this._dryingPresetId4 = Zr, this._dryingStopId = Xr, this._hasDryingPreset1 = !1, this._hasDryingPreset2 = !1, this._hasDryingPreset3 = !1, this._hasDryingPreset4 = !1, this._hasDryingStop = !1, this._dryingPresetTemp1 = "", this._dryingPresetDur1 = "", this._dryingPresetTemp2 = "", this._dryingPresetDur2 = "", this._dryingPresetTemp3 = "", this._dryingPresetDur3 = "", this._dryingPresetTemp4 = "", this._dryingPresetDur4 = "", this._isOpen = !1, this._handleModalEvent = t => {
        t.stopPropagation(), t.detail.modalOpen && (this._isOpen = !0, this.box_id = Number(t.detail.box_id));
      };
    }
    async firstUpdated() {
      this.addEventListener("click", t => {
        this._closeModal(t);
      });
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-mcbdry-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-mcbdry-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._heading = yr("card.drying_settings.heading", this.language), this._buttonTextPreset = yr("card.drying_settings.button_preset", this.language), this._buttonTextMinutes = yr("card.drying_settings.button_minutes", this.language), this._buttonStopDrying = yr("card.drying_settings.button_stop_drying", this.language)), t.has("box_id") && (1 === this.box_id ? (this._dryingPresetId1 = qr, this._dryingPresetId2 = Jr, this._dryingPresetId3 = Qr, this._dryingPresetId4 = ts, this._dryingStopId = es) : (this._dryingPresetId1 = Gr, this._dryingPresetId2 = Vr, this._dryingPresetId3 = Wr, this._dryingPresetId4 = Zr, this._dryingStopId = Xr)), t.has("hass") || t.has("selectedPrinterDevice")) {
        const t = Wt(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId1);
        this._hasDryingPreset1 = Zt(t), this._dryingPresetTemp1 = t.attributes.temperature, this._dryingPresetDur1 = t.attributes.duration;
        const e = Wt(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId2);
        this._hasDryingPreset2 = Zt(e), this._dryingPresetTemp2 = e.attributes.temperature, this._dryingPresetDur2 = e.attributes.duration;
        const i = Wt(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId3);
        this._hasDryingPreset3 = Zt(i), this._dryingPresetTemp3 = i.attributes.temperature, this._dryingPresetDur3 = i.attributes.duration;
        const r = Wt(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingPresetId4);
        this._hasDryingPreset4 = Zt(r), this._dryingPresetTemp4 = r.attributes.temperature, this._dryingPresetDur4 = r.attributes.duration;
        const s = Wt(this.hass, this.printerEntities, this.printerEntityIdPart, this._dryingStopId);
        this._hasDryingStop = Zt(s);
      }
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      const t = {
        height: this.isHidden ? "1px" : "auto",
        opacity: this.isHidden ? 0 : 1,
        scale: this.isHidden ? 0 : 1
      };
      return X`
      <div
        class="ac-modal-container"
        style=${ge(t)}
        ${Le(Object.assign({}, jr))}
      >
        <span
          class="ac-modal-close"
          @click="${t => {
        this._closeModal(t);
      }}"
          >&times;</span
        >
        <div
          class="ac-modal-card"
          @click="${t => {
        this._cardClick(t);
      }}"
        >
          ${this._renderCard()}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return X`
      <div>
        <div class="ac-drying-header">${this._heading}</div>
        <div class="ac-drying-buttonscont">
          ${this._hasDryingPreset1 ? X`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${t => {
        this._handleDryingPreset1();
      }}"
                  >
                    ${this._buttonTextPreset} 1<br />
                    ${this._dryingPresetDur1} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp1}°C
                  </ha-control-button>
                </div>
              ` : q}
          ${this._hasDryingPreset2 ? X`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${t => {
        this._handleDryingPreset2();
      }}"
                  >
                    ${this._buttonTextPreset} 2<br />
                    ${this._dryingPresetDur2} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp2}°C
                  </ha-control-button>
                </div>
              ` : q}
          ${this._hasDryingPreset3 ? X`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${t => {
        this._handleDryingPreset3();
      }}"
                  >
                    ${this._buttonTextPreset} 3<br />
                    ${this._dryingPresetDur3} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp3}°C
                  </ha-control-button>
                </div>
              ` : q}
          ${this._hasDryingPreset4 ? X`
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${t => {
        this._handleDryingPreset4();
      }}"
                  >
                    ${this._buttonTextPreset} 4<br />
                    ${this._dryingPresetDur4} ${this._buttonTextMinutes} @
                    ${this._dryingPresetTemp4}°C
                  </ha-control-button>
                </div>
              ` : q}
          ${this._hasDryingStop ? X`
                <div class="ac-flex-break"></div>
                <div class="ac-drying-buttoncont">
                  <ha-control-button
                    @click="${t => {
        this._handleDryingStop();
      }}"
                  >
                    ${this._buttonStopDrying}
                  </ha-control-button>
                </div>
              ` : q}
        </div>
      </div>
    `;
    }
    _pressHassButton(t) {
      this.printerEntityIdPart && this.hass.callService("button", "press", {
        entity_id: jt(this.printerEntityIdPart, "button", t)
      }).then().catch(t => {});
    }
    _handleDryingPreset1() {
      this._pressHassButton(this._dryingPresetId1), this._closeModal();
    }
    _handleDryingPreset2() {
      this._pressHassButton(this._dryingPresetId2), this._closeModal();
    }
    _handleDryingPreset3() {
      this._pressHassButton(this._dryingPresetId3), this._closeModal();
    }
    _handleDryingPreset4() {
      this._pressHassButton(this._dryingPresetId4), this._closeModal();
    }
    _handleDryingStop() {
      this._pressHassButton(this._dryingStopId), this._closeModal();
    }
    _closeModal(t) {
      t && t.stopPropagation(), this._isOpen = !1, this.box_id = 0;
    }
    _cardClick(t) {
      t.stopPropagation();
    }
    static get styles() {
      return u`
      ${Rr}

      .ac-drying-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      ha-control-button {
        min-width: 150px;
        font-size: 14px;
        min-height: 55px;
        width: 100%;
        box-sizing: border-box;
      }

      .ac-flex-break {
        flex-basis: 100%;
        height: 0;
      }

      .ac-drying-buttonscont {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
        align-items: center;
        justify-content: center;
      }

      .ac-drying-buttoncont {
        width: 50%;
        margin: 0;
        position: relative;
        box-sizing: border-box;
        padding: 10px;
      }
    `;
    }
  };
  s([_t()], is.prototype, "hass", void 0), s([_t()], is.prototype, "language", void 0), s([_t()], is.prototype, "selectedPrinterDevice", void 0), s([_t()], is.prototype, "printerEntities", void 0), s([_t()], is.prototype, "printerEntityIdPart", void 0), s([bt()], is.prototype, "box_id", void 0), s([bt()], is.prototype, "_dryingPresetId1", void 0), s([bt()], is.prototype, "_dryingPresetId2", void 0), s([bt()], is.prototype, "_dryingPresetId3", void 0), s([bt()], is.prototype, "_dryingPresetId4", void 0), s([bt()], is.prototype, "_dryingStopId", void 0), s([bt()], is.prototype, "_hasDryingPreset1", void 0), s([bt()], is.prototype, "_hasDryingPreset2", void 0), s([bt()], is.prototype, "_hasDryingPreset3", void 0), s([bt()], is.prototype, "_hasDryingPreset4", void 0), s([bt()], is.prototype, "_hasDryingStop", void 0), s([bt()], is.prototype, "_dryingPresetTemp1", void 0), s([bt()], is.prototype, "_dryingPresetDur1", void 0), s([bt()], is.prototype, "_dryingPresetTemp2", void 0), s([bt()], is.prototype, "_dryingPresetDur2", void 0), s([bt()], is.prototype, "_dryingPresetTemp3", void 0), s([bt()], is.prototype, "_dryingPresetDur3", void 0), s([bt()], is.prototype, "_dryingPresetTemp4", void 0), s([bt()], is.prototype, "_dryingPresetDur4", void 0), s([bt()], is.prototype, "_isOpen", void 0), s([bt()], is.prototype, "_heading", void 0), s([bt()], is.prototype, "_buttonTextPreset", void 0), s([bt()], is.prototype, "_buttonTextMinutes", void 0), s([bt()], is.prototype, "_buttonStopDrying", void 0), is = s([_r("anycubic-printercard-multicolorbox_modal_drying")], is);
  const rs = t => os(255, Math.round(Number(t))),
    ss = t => rs(255 * t),
    ns = t => os(1, t / 255),
    os = (t, e) => Math.max(0, Math.min(t, e)),
    as = t => void 0 === t ? 1 : ("string" == typeof t && t.indexOf("%") > 0 && (t = Number(t.split("%")[0]) / 100), t = Number(Number(t).toFixed(3)), isNaN(t) ? 1 : os(1, t)),
    ls = {
      aliceblue: "#F0F8FF",
      antiquewhite: "#FAEBD7",
      aqua: "#00FFFF",
      aquamarine: "#7FFFD4",
      azure: "#F0FFFF",
      beige: "#F5F5DC",
      bisque: "#FFE4C4",
      black: "#000000",
      blanchedalmond: "#FFEBCD",
      blue: "#0000FF",
      blueviolet: "#8A2BE2",
      brown: "#A52A2A",
      burlywood: "#DEB887",
      cadetblue: "#5F9EA0",
      chartreuse: "#7FFF00",
      chocolate: "#D2691E",
      coral: "#FF7F50",
      cornflowerblue: "#6495ED",
      cornsilk: "#FFF8DC",
      crimson: "#DC143C",
      cyan: "#00FFFF",
      darkblue: "#00008B",
      darkcyan: "#008B8B",
      darkgoldenrod: "#B8860B",
      darkgray: "#A9A9A9",
      darkgrey: "#A9A9A9",
      darkgreen: "#006400",
      darkkhaki: "#BDB76B",
      darkmagenta: "#8B008B",
      darkolivegreen: "#556B2F",
      darkorange: "#FF8C00",
      darkorchid: "#9932CC",
      darkred: "#8B0000",
      darksalmon: "#E9967A",
      darkseagreen: "#8FBC8F",
      darkslateblue: "#483D8B",
      darkslategray: "#2F4F4F",
      darkslategrey: "#2F4F4F",
      darkturquoise: "#00CED1",
      darkviolet: "#9400D3",
      deeppink: "#FF1493",
      deepskyblue: "#00BFFF",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1E90FF",
      firebrick: "#B22222",
      floralwhite: "#FFFAF0",
      forestgreen: "#228B22",
      fuchsia: "#FF00FF",
      gainsboro: "#DCDCDC",
      ghostwhite: "#F8F8FF",
      gold: "#FFD700",
      goldenrod: "#DAA520",
      gray: "#808080",
      grey: "#808080",
      green: "#008000",
      greenyellow: "#ADFF2F",
      honeydew: "#F0FFF0",
      hotpink: "#FF69B4",
      indianred: "#CD5C5C",
      indigo: "#4B0082",
      ivory: "#FFFFF0",
      khaki: "#F0E68C",
      lavender: "#E6E6FA",
      lavenderblush: "#FFF0F5",
      lawngreen: "#7CFC00",
      lemonchiffon: "#FFFACD",
      lightblue: "#ADD8E6",
      lightcoral: "#F08080",
      lightcyan: "#E0FFFF",
      lightgoldenrodyellow: "#FAFAD2",
      lightgray: "#D3D3D3",
      lightgrey: "#D3D3D3",
      lightgreen: "#90EE90",
      lightpink: "#FFB6C1",
      lightsalmon: "#FFA07A",
      lightseagreen: "#20B2AA",
      lightskyblue: "#87CEFA",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#B0C4DE",
      lightyellow: "#FFFFE0",
      lime: "#00FF00",
      limegreen: "#32CD32",
      linen: "#FAF0E6",
      magenta: "#FF00FF",
      maroon: "#800000",
      mediumaquamarine: "#66CDAA",
      mediumblue: "#0000CD",
      mediumorchid: "#BA55D3",
      mediumpurple: "#9370DB",
      mediumseagreen: "#3CB371",
      mediumslateblue: "#7B68EE",
      mediumspringgreen: "#00FA9A",
      mediumturquoise: "#48D1CC",
      mediumvioletred: "#C71585",
      midnightblue: "#191970",
      mintcream: "#F5FFFA",
      mistyrose: "#FFE4E1",
      moccasin: "#FFE4B5",
      navajowhite: "#FFDEAD",
      navy: "#000080",
      oldlace: "#FDF5E6",
      olive: "#808000",
      olivedrab: "#6B8E23",
      orange: "#FFA500",
      orangered: "#FF4500",
      orchid: "#DA70D6",
      palegoldenrod: "#EEE8AA",
      palegreen: "#98FB98",
      paleturquoise: "#AFEEEE",
      palevioletred: "#DB7093",
      papayawhip: "#FFEFD5",
      peachpuff: "#FFDAB9",
      peru: "#CD853F",
      pink: "#FFC0CB",
      plum: "#DDA0DD",
      powderblue: "#B0E0E6",
      purple: "#800080",
      rebeccapurple: "#663399",
      red: "#FF0000",
      rosybrown: "#BC8F8F",
      royalblue: "#4169E1",
      saddlebrown: "#8B4513",
      salmon: "#FA8072",
      sandybrown: "#F4A460",
      seagreen: "#2E8B57",
      seashell: "#FFF5EE",
      sienna: "#A0522D",
      silver: "#C0C0C0",
      skyblue: "#87CEEB",
      slateblue: "#6A5ACD",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#FFFAFA",
      springgreen: "#00FF7F",
      steelblue: "#4682B4",
      tan: "#D2B48C",
      teal: "#008080",
      thistle: "#D8BFD8",
      tomato: "#FF6347",
      turquoise: "#40E0D0",
      violet: "#EE82EE",
      wheat: "#F5DEB3",
      white: "#FFFFFF",
      whitesmoke: "#F5F5F5",
      yellow: "#FFFF00",
      yellowgreen: "#9ACD32"
    };
  class hs {
    constructor(t, e, i, r) {
      return hs.isBaseConstructor(t) ? (this.r = rs(t.r), this.g = rs(t.g), this.b = rs(t.b), void 0 !== t.a && (this.a = as(t.a)), this) : hs.parse(t, e, i, r);
    }
    static parse(t, e, i, r) {
      if (hs.isBaseConstructor(t)) return new hs(t);
      if (void 0 !== e && void 0 !== i) {
        let s = rs(t);
        return e = rs(e), i = rs(i), void 0 !== r && (r = as(r)), new hs({
          r: s,
          g: e,
          b: i,
          a: r
        });
      }
      if (Array.isArray(t)) return hs.fromArray(t);
      if ("string" == typeof t) {
        let i;
        if (void 0 !== e && Number(e) <= 1 && Number(e) >= 0 && (i = Number(e)), t.startsWith("#")) return hs.fromHex(t, i);
        if (ls[t.toLowerCase()]) return hs.fromNamed(t, i);
        if (t.startsWith("rgb")) return hs.fromRgbString(t);
        if ("transparent" === t) {
          let t, e, i, r;
          return t = e = i = r = 0, new hs({
            r: t,
            g: e,
            b: i,
            a: r
          });
        }
        return null;
      }
      if ("object" == typeof t) {
        if (void 0 !== t.a && (this.a = as(t.a)), void 0 !== t.h) {
          let e = {};
          if (void 0 !== t.v) e = hs.fromHsv(t);else {
            if (void 0 === t.l) return hs.fromArray([0, 0, 0]);
            e = hs.fromHsl(t);
          }
          return e.a = void 0 !== t.a ? as(t.a) : void 0, new hs(e);
        }
        return void 0 !== t.c ? hs.fromCMYK(t) : this;
      }
      return hs.fromArray([0, 0, 0]);
    }
    static isBaseConstructor(t) {
      return "object" == typeof t && void 0 !== t.r && void 0 !== t.g && void 0 !== t.b;
    }
    static fromNamed(t, e) {
      return hs.fromHex(ls[t.toLowerCase()], e);
    }
    static fromArray(t) {
      t = t.filter(t => "" !== t && isFinite(t));
      const e = {
        r: rs(t[0]),
        g: rs(t[1]),
        b: rs(t[2])
      };
      return void 0 !== t[3] && (e.a = as(t[3])), new hs(e);
    }
    static fromHex(t, e) {
      3 !== (t = t.replace("#", "")).length && 4 !== t.length || (t = t.split("").map(t => t + t).join(""));
      let i = t.match(/[A-Za-z0-9]{2}/g).map(t => parseInt(t, 16));
      return 4 === i.length ? i[3] /= 255 : void 0 !== e && (i[3] = e), hs.fromArray(i);
    }
    static fromRgbString(t) {
      if (t.includes(",")) return hs.fromArray(t.split("(")[1].split(")")[0].split(","));
      const e = t.replace("/", " ").split("(")[1].replace(")", "").split(" ").filter(t => "" !== t && isFinite(Number(t)));
      return hs.fromArray(e);
    }
    static fromHsv({
      h: t,
      s: e,
      v: i
    }) {
      e /= 100, i /= 100;
      const r = Math.floor(t / 60 % 6),
        s = t / 60 - r,
        n = i * (1 - e),
        o = i * (1 - s * e),
        a = i * (1 - (1 - s) * e),
        l = [[i, a, n], [o, i, n], [n, i, a], [n, o, i], [a, n, i], [i, n, o]][r].map(t => Math.round(256 * t));
      return new hs({
        r: rs(l[0]),
        g: rs(l[1]),
        b: rs(l[2])
      });
    }
    static fromHsl({
      h: t,
      s: e,
      l: i
    }) {
      e /= 100, i /= 100;
      const r = (1 - Math.abs(2 * i - 1)) * e,
        s = r * (1 - Math.abs(t / 60 % 2 - 1)),
        n = i - r / 2;
      let o = 0,
        a = 0,
        l = 0;
      return 0 <= t && t < 60 ? (o = r, a = s, l = 0) : 60 <= t && t < 120 ? (o = s, a = r, l = 0) : 120 <= t && t < 180 ? (o = 0, a = r, l = s) : 180 <= t && t < 240 ? (o = 0, a = s, l = r) : 240 <= t && t < 300 ? (o = s, a = 0, l = r) : 300 <= t && t < 360 && (o = r, a = 0, l = s), new hs({
        r: ss(n + o),
        g: ss(n + a),
        b: ss(n + l)
      });
    }
    static fromCMYK({
      c: t,
      m: e,
      y: i,
      k: r,
      a: s
    }) {
      const n = t => ss(1 - Math.min(1, t / 100 * (1 - r) + r));
      return new hs({
        r: n(t),
        b: n(e),
        g: n(i),
        a: s
      });
    }
    get alpha() {
      return void 0 === this.a ? 1 : this.a;
    }
    get rgb() {
      return [this.r, this.g, this.b];
    }
    get rgba() {
      return [this.r, this.g, this.b, this.alpha];
    }
    get rgbObj() {
      let {
        r: t,
        g: e,
        b: i
      } = this;
      return {
        r: t,
        g: e,
        b: i,
        a: this.alpha
      };
    }
    get css() {
      return this.rgbString;
    }
    get rgbString() {
      return void 0 === this.a ? `rgb(${this.rgb.join(",")})` : `rgba(${this.rgba.join(",")})`;
    }
    get rgbaString() {
      return `rgba(${this.rgba.join(",")})`;
    }
    get hex() {
      return `#${this.rgb.map(t => t.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    }
    get hexa() {
      return this.rgbaHex;
    }
    get rgbaHex() {
      let t = this.rgba;
      return t[3] = ss(t[3]), `#${t.map(t => t.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    }
    get hsv() {
      const t = ns(this.r),
        e = ns(this.g),
        i = ns(this.b),
        r = Math.min(t, e, i),
        s = Math.max(t, e, i);
      let n;
      const o = s,
        a = s - r;
      n = 0 === a ? 0 : s === t ? (e - i) / a * 60 % 360 : s === e ? (i - t) / a * 60 + 120 : s === i ? (t - e) / a * 60 + 240 : 0, n < 0 && (n += 360);
      const l = 0 === s ? 0 : 1 - r / s;
      return {
        h: Math.round(n),
        s: Math.round(100 * l),
        v: Math.round(100 * o),
        a: this.alpha
      };
    }
    get hsl() {
      const t = ns(this.r),
        e = ns(this.g),
        i = ns(this.b),
        r = Math.max(t, e, i),
        s = Math.min(t, e, i);
      let n, o;
      const a = (r + s) / 2;
      if (r === s) n = o = 0;else {
        const l = r - s;
        switch (o = a > .5 ? l / (2 - r - s) : l / (r + s), r) {
          case t:
            n = (e - i) / l + (e < i ? 6 : 0);
            break;
          case e:
            n = (i - t) / l + 2;
            break;
          case i:
            n = (t - e) / l + 4;
        }
        n /= 6;
      }
      return {
        h: Math.round(360 * n),
        s: Math.round(100 * o),
        l: Math.round(100 * a),
        a: this.alpha
      };
    }
    get cmyk() {
      let t, e, i, r;
      const s = parseFloat(this.r) / 255,
        n = parseFloat(this.g) / 255,
        o = parseFloat(this.b) / 255;
      return r = 1 - Math.max(s, n, o), 1 === r ? t = e = i = 0 : (t = (1 - s - r) / (1 - r), e = (1 - n - r) / (1 - r), i = (1 - o - r) / (1 - r)), t = Math.round(100 * t), e = Math.round(100 * e), i = Math.round(100 * i), r = Math.round(100 * r), this.alpha ? {
        c: t,
        m: e,
        y: i,
        k: r,
        a: this.alpha
      } : {
        c: t,
        m: e,
        y: i,
        k: r
      };
    }
    get hslString() {
      const t = this.hsl;
      return `hsl(${t.h}, ${t.s}%, ${t.l}%)`;
    }
    get hslaString() {
      const t = this.hsl;
      return `hsla(${t.h}, ${t.s}%, ${t.l}%, ${t.a})`;
    }
    get cmykString() {
      const t = this.cmyk;
      return `cmyk(${t.c}%, ${t.m}%, ${t.y}%, ${t.k}%)`;
    }
    get cmykaString() {
      const t = this.cmyk;
      return `cmyka(${t.c}%, ${t.m}%, ${t.y}%, ${t.k}%, ${t.a})`;
    }
    toString(t = "rgb") {
      let e;
      switch (t) {
        case "rgb":
        default:
          e = this.rgbString;
          break;
        case "hex":
          e = this.hex;
          break;
        case "rgbaHex":
          e = this.hexa;
          break;
        case "hsl":
          e = this.hslString;
          break;
        case "hsla":
          e = this.hslaString;
          break;
        case "cmyk":
          e = this.cmykString;
          break;
        case "cmyka":
          e = this.cmykaString;
      }
      return e;
    }
    mix(t, e = .5) {
      const i = this.rgba;
      i[3] = ss(i[3]);
      const r = new hs(t).rgba;
      r[3] = ss(r[3]), e = as(e);
      const s = i.map((t, i) => {
        const s = r[i],
          n = s < t,
          o = n ? t - s : s - t,
          a = Math.round(o * e);
        return n ? t - a : a + t;
      });
      return s[3] = ns(s[3]), hs.fromArray(s);
    }
    adjustSatLum(t, e, i) {
      const r = this.hsl;
      let s = r[t],
        n = (i ? s : 100 - s) * e;
      return r[t] = os(100, i ? s - n : s + n), r.a = this.a, new hs(r);
    }
    lighten(t, e = !1) {
      return this.adjustSatLum("l", t, e);
    }
    darken(t) {
      return this.lighten(t, !0);
    }
    saturate(t, e = !1) {
      return this.adjustSatLum("s", t, e);
    }
    desaturate(t) {
      return this.saturate(t, !0);
    }
    grayscale() {
      return this.desaturate(1);
    }
    rotate(t) {
      return this.hue(t);
    }
    hue(t) {
      const e = this.hsl;
      return e.h = Math.round(e.h + t) % 360, e.a = this.a, new hs(e);
    }
    fadeIn(t, e) {
      let i = this.alpha;
      const {
        r,
        g: s,
        b: n
      } = this;
      let o = (1 - i) * t;
      return i = e ? i - o : i + o, hs({
        r,
        g: s,
        b: n,
        a: i
      });
    }
    fadeOut(t) {
      return this.fadeIn(t, !0);
    }
    negate() {
      let t = this.rgb.map(t => 255 - t);
      return void 0 !== this.a && t.push(this.alpha), hs.fromArray(t);
    }
  }
  const cs = (t, e, i = "color-update") => {
      const r = i.includes("color") ? {
          color: e
        } : e,
        s = new CustomEvent(i, {
          bubbles: !0,
          composed: !0,
          detail: r
        });
      t.dispatchEvent(s);
    },
    ds = (t = 3, e) => {
      let i = 0,
        r = 100,
        s = 50,
        n = null,
        o = !1;
      e && (r = e.s, e.hasOwnProperty("v") ? (n = e.v, s = null, o = !0) : s = e.l);
      const a = [];
      let l, h;
      const c = (t, e) => `${t.css} ${(100 * e).toFixed(1)}%`;
      for (; i < 360;) l = hs.parse(o ? {
        h: i,
        s: r,
        v: n
      } : {
        h: i,
        s: r,
        l: s
      }), h = i / 360, a.push(c(l, h)), i += t;
      return i = 359, l = hs.parse(o ? {
        h: i,
        s: r,
        v: n
      } : {
        h: i,
        s: r,
        l: s
      }), h = 1, a.push(c(l, h)), a.join(", ");
    },
    us = X`<svg
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
  class ps extends pt {
    static properties = {
      hue: {
        type: Number
      },
      color: {
        type: Object
      },
      gradient: {
        type: String,
        attribute: !1
      },
      sliderStyle: {
        type: String,
        attribute: !1
      },
      sliderBounds: {
        type: Object
      },
      width: {
        type: Number,
        attribute: !1
      }
    };
    static styles = u`
    :host > div {
      display: block;
      width: ${d(this.width)}px;
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
      super(), this.gradient = {
        backgroundImage: `linear-gradient(90deg, ${ds(24)})`
      }, this.width = 400, this.sliderStyle = {
        display: "none"
      };
    }
    firstUpdated() {
      const t = this.renderRoot.querySelector("lit-movable");
      t.onmovestart = () => {
        cs(this.renderRoot, {
          sliding: !0
        }, "sliding-hue");
      }, t.onmoveend = () => {
        cs(this.renderRoot, {
          sliding: !1
        }, "sliding-hue");
      }, t.onmove = ({
        posLeft: t
      }) => this.selectHue({
        offsetX: t
      }), this.sliderStyle = this.sliderCss(this.hue);
    }
    get sliderBounds() {
      const t = this.width / 360,
        e = Number(this.hue) * t;
      return {
        min: 0 - e,
        max: this.width - e,
        posLeft: e
      };
    }
    get sliderCss() {
      return t => {
        this.color.hsx && (t = this.color.hsx.h), void 0 === t && (t = this.color.hsl.h);
        return {
          backgroundColor: hs.parse({
            h: t,
            s: 100,
            l: 50
          }).css
        };
      };
    }
    willUpdate(t) {
      if (t.get("hue") && isFinite(this.hue)) {
        if (this.color?.hsx) return;
        const t = this.hue;
        this.sliderStyle = this.sliderCss(t);
      }
    }
    selectHue(t) {
      const e = 360 / this.width,
        i = t.offsetX,
        r = Math.max(0, Math.min(359, Math.round(i * e))),
        s = this.renderRoot.querySelector("a"),
        n = new CustomEvent("hue-update", {
          bubbles: !0,
          composed: !0,
          detail: {
            h: r
          }
        });
      s.dispatchEvent(n), this.sliderStyle = this.sliderCss(r);
    }
    render() {
      return X` <div
      style=${ge(this.gradient)}
      class="bar"
      @click="${this.selectHue}"
    >
      <lit-movable
        horizontal="${this.sliderBounds.min}, ${this.sliderBounds.max}"
        posLeft="${this.sliderBounds.posLeft}"
      >
        <a class="slider" style=${ge(this.sliderCss(this.h))}></a>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hue-bar") || customElements.define("hue-bar", ps);
  const gs = u`
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: -1;
  background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.125) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.125) 0,
      rgba(0, 0, 0, 0.125) 0
    ),
    linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.125) 25%,
      transparent 0,
      transparent 75%,
      rgba(0, 0, 0, 0.125) 0,
      rgba(0, 0, 0, 0.125) 0
    ),
    #fff;
  background-repeat: repeat, repeat;
  background-position:
    0 0,
    6px 6px;
  background-size:
    12px 12px,
    12px 12px;
`,
    ms = u`
  display: inline-block;
  width: 69px;
  padding: 0.325rem 0.5rem;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  color: var(--input-color);
  appearance: none;
  background-color: var(--input-bg);
  background-clip: padding-box;
  border: 1px solid var(--form-border-color);
  border-radius: 3px;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
`,
    fs = u`
  color: var(--input-active-color);
  background-color: var(--input-active-bg);
  border-color: var(--input-active-border-color);
  outline: 0;
  box-shadow: var(--input-active-box-shadow);
`,
    ys = u`
  :host {
    --font-fam: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
      "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --bg-color: rgb(30 41 59);
    --label-color: #ccc;
    --form-border-color: #495057;
    --input-active-border-color: #86b7fe;
    --input-bg: #020617;
    --input-active-bg: #4682b4;
    --input-color: #ccc;
    --input-active-color: #333;
    --input-active-box-shadow: 0 2px 5px #ccc;
    --button-active-bg: #0c5b9d;
    --button-active-color: white;
    --outer-box-shadow: 0 4px 12px #111;
  }
  :host > .outer {
    position: relative;
    background-color: var(--bg-color);
    height: 250px;
    width: 400px;
    display: block;
    padding: 10px;
    margin: 10px;
    box-shadow: var(--outer-box-shadow);
  }
  .d-flex {
    display: flex;
    width: 100%;
    margin-top: 15px;
  }
  .w-30 {
    width: 30%;
  }
  .w-40 {
    width: 40%;
    position: relative;
    height: 210px;
  }
  :host .form-control {
    ${ms}
  }
  :host .form-control:focus {
    ${fs}
  }
  :host label {
    width: 12px;
    display: inline-block;
    color: var(--label-color);
    font-family: var(--font-fam);
  }
  :host .hsl-mode {
    padding-left: 16px;
    margin-top: 18px;
  }
  :host .button {
    padding: 0.325rem 0.5rem;
    background-color: var(--input-bg);
    border: 1px solid var(--form-border-color);
    font-family: var(--font-fam);
    color: var(--input-color);
    cursor: pointer;
    font-size: 0.9rem;
  }
  :host div.hex {
    margin-top: 27px;
    white-space: nowrap;
    position: relative;
  }
  :host dialog {
    opacity: 0;
    width: 177px;
    position: absolute;
    bottom: 30px;
    left: 0px;
    z-index: 3;
    border: 1px solid transparent;
    outline: transparent;
    box-shadow: var(--outer-box-shadow);
    background-color: var(--input-bg);
    transition: opacity 0.3s;
  }
  :host dialog.open {
    opacity: 1;
  }
  :host dialog * {
    color: var(--input-color);
  }
  :host dialog a.copy-item {
    margin-bottom: 5px;
    white-space: nowrap;
    display: block;
    width: 180px;
    cursor: pointer;
  }
  :host dialog input.form-control {
    font-size: 12px;
    display: inline-block;
    vertical-align: middle;
    width: 132px;
    padding-bottom: 2px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    pointer-events: none;
  }
  :host dialog button.button {
    display: inline-block;
    vertical-align: middle;
    margin-left: -5px;
    font-size: 12px;
    height: 27px;
    width: 27px;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    background-color: transparent;
  }
  :host dialog a.copy-item:hover .button,
  :host dialog a.copy-item:hover input.form-control,
  :host dialog a.copy-item:hover path {
    color: var(--button-active-color);
    background-color: var(--button-active-bg);
    fill: var(--button-active-color);
    cursor: pointer;
  }
  :host dialog .button svg {
    height: 15px;
    width: 15px;
    margin-left: -3px;
  }
  :host div.hex input {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    vertical-align: middle;
    display: inline-block;
  }
  :host .button.copy {
    padding: 8px 6px 5px 5px;
    position: relative;
    position: relative;
    border-left: 0;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    height: 34px;
    display: inline-block;
    box-sizing: border-box;
    overflow: hidden;
    vertical-align: middle;
  }
  :host .button.copy svg {
    height: 16px;
    width: 15px;
    margin-right: -2px;
  }
  :host .button.copy span {
    font-size: 10px;
    position: relative;
    top: -3px;
  }
  :host a.button.l {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  :host a.button.r {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-left: none;
  }
  :host a.button.active {
    color: #eee;
    background-color: var(--button-active-bg);
    cursor: default;
  }
  :host .ok {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  :host .ok a {
    border-radius: 3px;
    padding: 6px 12px;
  }
  :host .swatch {
    height: 14px;
    width: 14px;
    display: inline-block;
    position: relative;
    top: 2px;
    margin-left: 3px;
  }
  :host .swatch span {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  :host .swatch span.checky {
    ${gs}
    z-index: 0;
  }
`,
    _s = u`
  :host > div {
    margin-bottom: 8px;
    display: block;
    position: relative;
  }

  :host label {
    width: 12px;
    display: inline-block;
    color: var(--label-color);
    font-family: var(--font-fam);
  }

  :host .form-control {
    ${ms}
  }

  :host .form-control:focus {
    ${fs}
  }

  :host .preview-bar {
    height: 4px;
    width: 85.5px;
    position: absolute;
    bottom: 0px;
    right: 17.5px;
    --pct: 0;
    pointer-events: none;
    z-index: 2;
  }

  :host .preview-bar:after {
    position: absolute;
    content: "";
    background-image: var(--preview);
    background-color: transparent;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    box-shadow: inset 0 -1px 1px var(--form-border-color);
    height: 100%;
    width: 100%;
  }

  :host > div.active .preview-bar {
    width: 128px;
    bottom: -23px;
    right: -9px;
    height: 10px;
    border: 8px solid var(--input-bg);
    box-shadow: var(--input-active-box-shadow);
    pointer-events: all;
    z-index: 2;
    cursor: pointer;
  }
  :host > div.active .preview-bar:after {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  :host .preview-bar .pct {
    bottom: -3px;
    margin-top: -0.75px;
    position: absolute;
    width: 3px;
    height: 11px;
    background: 0 0;
    left: var(--pct);
    display: inline-block;
    z-index: 3;
    pointer-events: none;
  }

  :host .preview-bar .pct:before {
    content: "";
    height: 7px;
    width: 5px;
    position: absolute;
    left: -2.5px;
    top: 2.5px;
    background-color: #fff;
    clip-path: polygon(50% 0, 100% 100%, 0 100%);
  }
  :host .active .preview-bar .pct:before {
    width: 7px;
    height: 11px;
    left: -3.5px;
    top: -1px;
  }
  :host .transparent-checks {
    ${gs}
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  :host div.active .transparent-checks {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`,
    bs = {
      r: "R (red) channel",
      g: "G (green) channel",
      b: "B (blue) channel",
      h: "H (hue) channel",
      s: "S (saturation) channel",
      v: "V (value / brightness) channel",
      l: "L (luminosity) channel",
      a: "A (alpha / opacity) channel"
    };
  class vs extends pt {
    static properties = {
      group: {
        type: String
      },
      channel: {
        type: String
      },
      color: {
        type: Object
      },
      isHsl: {
        type: Boolean
      },
      c: {
        type: Object,
        state: !0,
        attribute: !1
      },
      previewGradient: {
        type: Object,
        state: !0,
        attribute: !1
      },
      active: {
        type: Boolean,
        state: !0,
        attribute: !1
      },
      max: {
        type: Number,
        state: !0,
        attribute: !1
      },
      v: {
        type: Number,
        state: !0,
        attribute: !1
      }
    };
    static styles = _s;
    clickPreview(t) {
      const e = Math.max(0, Math.min(t.offsetX, 128));
      let i = Math.round(e / 128 * this.max);
      "a" === this.channel && (i = Number((e / 127).toFixed(2))), this.valueChange(null, i), this.setActive(!1);
    }
    valueChange = (t, e = null) => {
      e = e ?? Number(this.renderRoot.querySelector("input").value), "a" === this.channel && (e /= 100), this.c[this.channel] = e;
      const i = hs.parse(this.c);
      "rgb" !== this.group && (i.hsx = this.c), this.c = "rgb" === this.group ? this.color.rgbObj : this.isHsl ? this.color.hsl : this.color.hsv, cs(this.renderRoot, i);
    };
    setActive(t) {
      this.active = t, t && this.renderRoot.querySelector("input").select();
    }
    constructor() {
      super();
    }
    setPreviewGradient() {
      let t;
      t = "rgb" === this.group ? this.color.rgbObj : this.color.hsx ? this.color.hsx : this.isHsl ? this.color.hsl : this.color.hsv, this.c = t;
      const e = this.group,
        i = this.channel,
        r = "a" === i;
      this.v = t[i], r && (this.v *= 100);
      let s,
        n,
        o = 255;
      if ("rgb" !== e || "a" === i) {
        if ("h" === i) return o = this.max = 359, void (this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${ds(24, t)})`,
          "--pct": t.h / o * 100 + "%"
        });
        o = r ? 1 : 100;
      }
      if (this.max = o, s = {
        ...t
      }, n = s, s[this.channel] = 0, s = hs.parse(s), n[this.channel] = o, n = hs.parse(n), "l" === this.channel) {
        const e = {
          ...t
        };
        e.l = 50, this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${s.hex}, ${hs.parse(e).hex}, ${n.hex})`,
          "--pct": t[this.channel] / o * 100 + "%"
        };
      } else this.previewGradient = {
        "--preview": `linear-gradient(90deg, ${r ? s.css : s.hex}, ${r ? n.css : n.hex})`,
        "--pct": t[this.channel] / o * 100 + "%"
      };
    }
    willUpdate(t) {
      this.setPreviewGradient();
    }
    render() {
      const t = "a" === this.channel ? X`<div class="transparent-checks"></div>` : null,
        e = "a" === this.channel ? 100 : this.max;
      return X` <div class="${de({
        active: this.active
      })}">
      <label for="channel_${this.ch}">${this.channel.toUpperCase()}</label>
      <input
        id="channel_${this.ch}"
        aria-label="${bs[this.channel]}"
        class="form-control"
        .value="${Math.round(this.v)}"
        type="number"
        min="0"
        max="${e}"
        @input="${this.valueChange}"
        @focus="${() => this.setActive(!0)}"
        @blur="${() => this.setActive(!1)}"
      />
      <div
        class="preview-bar"
        style="${ge(this.previewGradient)}"
        @mousedown="${this.clickPreview}"
      >
        <div class="pct"></div>
        ${t}
      </div>
    </div>`;
    }
  }
  customElements.get("color-input-channel") || customElements.define("color-input-channel", vs);
  class ws extends pt {
    static properties = {
      color: {
        type: Object
      },
      isHsl: {
        type: Boolean
      },
      size: {
        type: Number
      },
      debounceMode: {
        type: Boolean
      },
      ctx: {
        type: Object,
        state: !0,
        attribute: !1
      },
      hsw: {
        type: Object,
        state: !0,
        attribute: !1
      },
      circlePos: {
        type: Object,
        state: !0,
        attribute: !1
      }
    };
    static styles = u`
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
      super(), this.isHsl = !0, this.circlePos = {
        top: 0,
        left: 0,
        bounds: {
          x: "",
          y: ""
        }
      }, this.size = 160;
    }
    setColor(t) {
      cs(this.renderRoot, t);
    }
    setCircleCss(t, e) {
      const i = `${t}`,
        r = `${e}`,
        s = {
          x: `0, ${this.size}`,
          y: `0,${this.size}`
        };
      this.circlePos = {
        top: r,
        left: i,
        bounds: s
      };
    }
    pickCoord({
      offsetX: t,
      offsetY: e
    }) {
      const i = t,
        r = e,
        {
          size: s,
          hsw: n,
          isHsl: o,
          color: a
        } = this;
      let l = (s - r) / s;
      l = Math.round(100 * l);
      const h = Math.round(i / s * 100),
        c = {
          h: n.h,
          s: h,
          [o ? "l" : "v"]: l
        },
        d = o ? hs.fromHsl(c) : hs.fromHsv(c);
      this.setCircleCss(i, r), d.a = a.alpha, d.hsx = c, d.fromHSLCanvas = !0, this.setColor(d);
    }
    debouncePaintDetail(t) {
      clearTimeout(this.bouncer), this.bouncer = setTimeout(() => this.paintHSL(t, !0), 50), this.paintHSL(t, !1);
    }
    paintHSL(t, e = null) {
      if (this.debounceMode && null === e) return this.debouncePaintDetail(t);
      const {
        ctx: i,
        color: r,
        isHsl: s,
        size: n
      } = this;
      if (!i) return;
      const o = r;
      (t = t ?? s ? o.hsl : o.hsv).w = s ? t.l : t.v;
      const {
          h: a,
          s: l,
          w: h
        } = t,
        c = this.hsw = {
          h: a,
          s: l,
          w: h
        },
        d = n / 100,
        u = s ? (t, e, i) => `hsl(${t}, ${e}%, ${100 - i}%)` : (t, e, i) => hs.fromHsv({
          h: t,
          s: e,
          v: 100 - i
        }).hex,
        p = !1 === e ? 4 : 1;
      for (let t = 0; t < 100; t += p) for (let e = 0; e < 100; e += p) i.fillStyle = u(a, t, e), i.fillRect(t, e, t + p, e + p);
      this.setCircleCss(c.s * d, n - t.w * d);
    }
    willUpdate(t) {
      if (t.has("color") || t.has("isHsl")) {
        if (this.color?.hsx) return this.color.fromHSLCanvas ? void delete this.color.fromHSLCanvas : this.paintHSL(this.color.hsx);
        this.paintHSL();
      }
    }
    firstUpdated(t) {
      const e = this.renderRoot.querySelector("canvas");
      this.ctx = e.getContext("2d"), this.paintHSL();
    }
    circleMove({
      posTop: t,
      posLeft: e
    }) {
      this.pickCoord({
        offsetX: e,
        offsetY: t
      });
    }
    render() {
      const t = {
          height: this.size + "p",
          width: this.size + "px"
        },
        {
          top: e,
          left: i,
          bounds: r
        } = this.circlePos;
      return X` <div
      class="outer"
      @click="${this.pickCoord}"
      style="${ge(t)}"
    >
      <canvas height="100" width="100"></canvas>
      <lit-movable
        boundsX="${r.x}"
        boundsY="${r.y}"
        posTop="${e}"
        posLeft="${i}"
        .onmove="${t => this.circleMove(t)}"
      >
        <div class="circle"></div>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hsl-canvas") || customElements.define("hsl-canvas", ws);
  const xs = t => isFinite(t) ? Number(t) : Number(t.replace(/[^0-9.\-]/g, "")),
    Ss = t => (t = Number(t), (isNaN(t) || [void 0, null].includes(t)) && (t = 0), t);
  class Es {
    constructor(t, e) {
      this.x = Ss(t), this.y = Ss(e);
    }
    static fromPointerEvent(t) {
      const {
        pageX: e,
        pageY: i
      } = t;
      return new Es(e, i);
    }
    static fromElementStyle(t) {
      const e = xs(t.style.left ?? 0),
        i = xs(t.style.top ?? 0);
      return new Es(e, i);
    }
    static fromObject({
      x: t,
      y: e
    }) {
      return new Es(t, e);
    }
    get top() {
      return this.y;
    }
    set top(t) {
      this.y = t;
    }
    get left() {
      return this.x;
    }
    set left(t) {
      this.x = t;
    }
  }
  class $s {
    constructor(t = -1 / 0, e = 1 / 0) {
      this.min = t, this.max = e, this.attr = "";
    }
    get constrained() {
      return this.min === this.max;
    }
    get unconstrained() {
      return this.min === -1 / 0 && this.max === 1 / 0;
    }
    static fromString(t = null, e = 0) {
      if (!t) return new $s();
      if ("null" === t) return new $s(0, 0);
      const [i, r] = t.split(",").map(t => Number(t.trim()) + e),
        s = new $s(i, r);
      return s.attr = t, s;
    }
  }
  class Cs extends pt {
    _target;
    _targetSelector = null;
    _boundsX = new $s();
    _boundsY = new $s();
    isMoving = !1;
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
    set vertical(t) {
      this.boundsY = t, this.boundsX = "null", this._vertical = t;
    }
    get horizontal() {
      return this._horizontal;
    }
    set horizontal(t) {
      this.boundsX = t, this.boundsY = "null", this._horizontal = t;
    }
    set posTop(t) {
      t = Number(t), this._posTop = t, this.target && (this.target.style.top = t + "px");
    }
    get posTop() {
      return this._posTop;
    }
    set posLeft(t) {
      t = Number(t), this._posLeft = t, this.target && (this.target.style.left = t + "px");
    }
    get posLeft() {
      return this._posLeft;
    }
    get grid() {
      return this._grid;
    }
    set grid(t) {
      this._grid = t > 0 && t < 1 / 0 ? t : 1;
    }
    get bounds() {
      return {
        left: this._boundsX,
        top: this._boundsY
      };
    }
    set targetSelector(t) {
      this._targetSelector = t, this._retryTarget = null === document.querySelector(t), this._target = document.querySelector(t);
    }
    get targetSelector() {
      return this._targetSelector;
    }
    get target() {
      return this._target ?? this;
    }
    set target(t) {
      this._target = t;
    }
    get boundsX() {
      return this._boundsX;
    }
    set boundsX(t) {
      this._boundsX = $s.fromString(t, xs(this.target?.style.left ?? 0)), this.bounds.left = this._boundsX;
    }
    get boundsY() {
      return this._boundsY;
    }
    set boundsY(t) {
      this._boundsY = $s.fromString(t, xs(this.target?.style.top ?? 0)), this.bounds.top = this._boundsY;
    }
    static properties = {
      posLeft: {
        type: Number
      },
      posTop: {
        type: Number
      },
      target: {
        type: Object,
        attribute: !1,
        state: !0
      },
      targetSelector: {
        type: String
      },
      bounds: {
        type: Object,
        attribute: !1,
        state: !0
      },
      boundsX: {
        type: String
      },
      boundsY: {
        type: String
      },
      vertical: {
        type: String
      },
      horizontal: {
        type: String
      },
      grid: {
        type: Number
      },
      shiftBehavior: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      },
      eventsOnly: {
        type: Boolean
      },
      listening: {
        type: Boolean
      },
      onmovestart: {
        type: Object
      },
      onmoveend: {
        type: Object
      },
      onmove: {
        type: Object
      }
    };
    firstUpdated(t) {
      this._retryTarget && (this.target = document.querySelector(this.targetSelector));
      const {
          bounds: e,
          target: i,
          posTop: r,
          posLeft: s
        } = this,
        {
          offsetLeft: n,
          offsetTop: o,
          style: {
            left: a,
            top: l
          }
        } = this.target;
      i.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", t => this.pointerdown(t)), i.style.position = "absolute", i.style.cursor = "pointer", s ? i.style.left = s + "px" : !a && n && (i.style.left = n + "px", e.left.constrained && (e.left.min = e.left.max = n)), r ? i.style.top = r + "px" : !l && o && (i.style.top = o + "px", e.top.constrained && (e.top.min = e.top.max = o));
    }
    reposition(t) {
      if ("object" == typeof t) {
        const {
          eventsOnly: e,
          target: i
        } = this;
        this.posTop = t.top, this.posLeft = t.left, i && !e && (i.style.left = t.left + "px", i.style.top = t.top + "px");
      } else this.isMoving = t;
    }
    moveInit(t) {
      const e = this.moveState,
        {
          target: i,
          bounds: r
        } = this;
      e.mouseCoord = Es.fromPointerEvent(t), e.startCoord = Es.fromElementStyle(i), e.moveDist = new Es(0, 0), e.totalDist = new Es(0, 0), e.clickOffset = (t => {
        const e = Es.fromPointerEvent(t),
          i = t.target.getBoundingClientRect(),
          r = e.x - (i.left + document.body.scrollLeft),
          s = e.y - (i.top + document.body.scrollTop);
        return new Es(r, s);
      })(t), e.coords = Es.fromObject(e.startCoord), e.maxX = isFinite(r.left.min) && isFinite(r.left.max) ? r.left.min + r.left.max : 1 / 0, e.maxY = isFinite(r.top.min) && isFinite(r.top.max) ? r.top.min + r.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
    }
    eventBroker(t, e) {
      this.moveState.posTop = this.posTop, this.moveState.posLeft = this.posLeft;
      const i = new CustomEvent(t, {
        bubbles: !0,
        composed: !0,
        detail: {
          ...e,
          ...this.moveState,
          element: this
        }
      });
      this.renderRoot.dispatchEvent(i);
      const r = this[`on${t}`];
      r && r({
        ...e,
        ...this.moveState,
        me: this
      });
    }
    unbind(t) {
      this.pointerId = null, document.body.removeEventListener("pointermove", t => this.motionHandler(t)), this.moveEnd(t);
    }
    moveEnd(t) {
      this.isMoving && (this.isMoving = this.moveState.isMoving = !1, this.reposition(!1), this.eventBroker("moveend", t));
    }
    motionHandler(t) {
      t.stopPropagation();
      const e = Es.fromPointerEvent(t),
        i = this.moveState,
        {
          grid: r,
          bounds: s,
          shiftBehavior: n,
          boundsX: o,
          boundsY: a
        } = this;
      if (i.moveDist = Es.fromObject({
        x: e.x - i.mouseCoord.x,
        y: e.y - i.mouseCoord.y
      }), i.mouseCoord = e, i.totalDist = Es.fromObject({
        x: i.totalDist.x + i.moveDist.x,
        y: i.totalDist.y + i.moveDist.y
      }), i.coords = Es.fromObject({
        x: Math.round(i.totalDist.x / r) * r + i.startCoord.x,
        y: Math.round(i.totalDist.y / r) * r + i.startCoord.y
      }), n && t.shiftKey && o.unconstrained && a.unconstrained) {
        const {
          x: t,
          y: e
        } = i.totalDist;
        Math.abs(t) > Math.abs(e) ? i.coords.top = i.startCoord.y : i.coords.left = i.startCoord.x;
      } else i.coords.y = Math.min(Math.max(s.top.min, i.coords.top), s.top.max), i.coords.x = Math.min(Math.max(s.left.min, i.coords.left), s.left.max);
      isFinite(i.maxX) && (i.pctX = Math.max(s.left.min, i.coords.left) / i.maxX), isFinite(i.maxY) && (i.pctY = Math.max(s.top.min, i.coords.top) / i.maxY), this.reposition(i.coords), this.eventBroker("move", t);
    }
    pointerdown(t) {
      document.body.setPointerCapture(t.pointerId), t.preventDefault(), t.stopPropagation(), void 0 !== t.pointerId && (this.pointerId = t.pointerId), this.listening || (document.body.addEventListener("pointerup", t => {
        this.isMoving && this.unbind(t);
      }, !1), document.body.addEventListener("pointermove", t => {
        void 0 !== this.pointerId && t.pointerId === this.pointerId && this.motionHandler(t);
      }, !1)), this.listening = !0, this.moveInit(t);
    }
    render() {
      return X`<slot></slot>`;
    }
  }
  window.customElements.get("lit-movable") || window.customElements.define("lit-movable", Cs);
  class As extends pt {
    static properties = {
      color: {
        type: Object,
        state: !0,
        attribute: !1
      },
      hex: {
        type: String,
        state: !0,
        attribute: !1
      },
      value: {
        type: String
      },
      isHsl: {
        type: Boolean,
        state: !0,
        attribute: !1
      },
      copied: {
        type: String
      },
      debounceMode: {
        type: Boolean
      }
    };
    static styles = ys;
    _color;
    constructor() {
      super(), this._color = hs.parse(ls.slateblue), this.isHsl = !0;
    }
    firstUpdated(t) {
      this.debounceMode = !1, t.has("value") && (this.color = hs.parse(this.value));
    }
    get color() {
      return this._color;
    }
    set color(t) {
      (t = t.hsx ? t : t.rgba ? hs.parse(...t.rgba) : hs.parse(t)) && (this.hex = t.hex, this._color = t, cs(this.renderRoot, t, "colorchanged"));
    }
    updateColor({
      detail: {
        color: t
      }
    }) {
      this.color = t;
    }
    setColor(t) {
      const e = this.renderRoot.querySelector("input#hex").value,
        i = hs.parse(e);
      i ? this.color = i : console.log(`ignored unparsable input: ${e}`);
    }
    setHue({
      detail: {
        h: t
      }
    }) {
      let {
        s: e,
        l: i,
        a: r
      } = this.color.hsl;
      1 === r && (r = void 0), this.color = {
        h: t,
        s: e,
        l: i,
        a: r
      };
    }
    setHsl(t) {
      this.isHsl = t;
    }
    okColor() {
      cs(this.renderRoot, this.color, "colorpicked");
    }
    showCopyDialog() {
      if (this.copied = null, this.dlg = this.dlg ?? this.renderRoot.querySelector("dialog"), this.dlg.open) return this.dlg.classList.remove("open"), this.dlg.close();
      this.dlg.show(), this.dlg.classList.add("open");
    }
    clipboard(t) {
      const e = this.color.toString(t);
      window.navigator.clipboard.writeText(e).then(() => {
        this.hideCopyDialog(e);
      });
    }
    hideCopyDialog(t) {
      if (t) return this.copied = t, setTimeout(() => this.dlg.classList.remove("open"), 400), void setTimeout(() => this.hideCopyDialog(), 1200);
      this.dlg.classList.remove("open"), this.dlg.close(), this.copied = null;
    }
    setSliding({
      detail: t
    }) {
      this.debounceMode = t.sliding;
    }
    render() {
      const t = this.isHsl ? ["h", "s", "l"] : ["h", "s", "v"],
        e = {
          button: !0,
          active: !this.isHsl,
          l: !0
        },
        i = {
          button: !0,
          active: this.isHsl,
          r: !0
        },
        r = {
          backgroundColor: this.color
        },
        s = this.copied ? {
          textAlign: "center",
          display: "block"
        } : {
          display: "none"
        },
        n = this.debounceMode;
      return X` <div class="outer">
      <hue-bar
        @sliding-hue="${this.setSliding}"
        hue="${this.color.hsx ? this.color.hsx.h : this.color.hsl.h}"
        @hue-update="${this.setHue}"
        .color="${this.color}"
      ></hue-bar>
      <div class="d-flex">
        <div class="col w-30">
          ${["r", "g", "b", "a"].map(t => X`
              <color-input-channel
                group="rgb"
                channel="${t}"
                isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `)}
          <div class="hex">
            <dialog @blur="${() => this.hideCopyDialog()}" tabindex="0">
              <sub class="copied" style="${ge(s)}"
                >copied <em>${this.copied}</em></sub
              >
              ${this.copied ? X`` : X`
                    <a
                      class="copy-item"
                      @click=${t => this.clipboard("hex", t)}
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
                        ${us}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      @click=${t => this.clipboard("css", t)}
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
                        ${us}
                      </button>
                    </a>
                    <a
                      class="copy-item"
                      id="copyHsl"
                      @click=${t => this.clipboard(this.color.alpha < 1 ? "hsla" : "hsl", t)}
                    >
                      <input
                        class="form-control"
                        disabled="disabled"
                        value="${this.color.toString(this.color.alpha < 1 ? "hsla" : "hsl")}"
                      />
                      <button
                        title="Copy HSL String"
                        class="button"
                        tabindex="0"
                      >
                        ${us}
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
              ${us}
              <span>&#11205;</span>
            </a>
          </div>
        </div>
        <div class="col w-30">
          ${t.map(t => X`
              <color-input-channel
                group="hsl"
                channel="${t}"
                .isHsl="${this.isHsl}"
                .color="${this.color}"
                @color-update="${this.updateColor}"
              />
            `)}
          <div class="hsl-mode">
            <a
              title="Use hue / saturation / value (brightness) mode"
              class="${de(e)}"
              @click="${() => this.setHsl(!1)}"
              >HSV</a
            ><a
              title="Use hue / saturation / luminosity mode"
              class="${de(i)}"
              @click="${() => this.setHsl(!0)}"
              >HSL</a
            >
          </div>
        </div>
        <div class="w-40">
          <hsl-canvas
            .debounceMode="${n}"
            size="${160}"
            .isHsl="${this.isHsl}"
            .color="${this.color}"
            @color-update="${this.updateColor}"
          ></hsl-canvas>
          <div class="ok">
            <a class="button" @click="${this.okColor}"
              >OK
              <span class="swatch">
                <span style="${ge(r)}"></span>
                <span class="checky"></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
    }
  }
  window.customElements.get("color-picker") || window.customElements.define("color-picker", As);
  const Ts = "anycubic_cloud",
    Ps = ["light"],
    ks = ["switch"],
    Ms = ["camera"],
    Ds = {
      keyframeOptions: {
        duration: 250,
        direction: "alternate",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    };
  let Hs = class extends pt {
    constructor() {
      super(...arguments), this.box_id = 0, this.spoolList = [], this.spool_index = -1, this._isOpen = !1, this._handleModalEvent = t => {
        t.stopPropagation(), t.detail.modalOpen && (this._isOpen = !0, this.box_id = Number(t.detail.box_id), this.spool_index = Number(t.detail.spool_index), this.material_type = t.detail.material_type ? It[t.detail.material_type.toUpperCase()] : void 0, this.color = t.detail.color);
      }, this._handleDropdownEvent = t => {
        t.stopPropagation(), t.detail.value && (this.material_type = It[t.detail.value]);
      }, this._handleColourEvent = t => {
        t.stopPropagation(), t.detail.color && (this.color = t.detail.color.rgb);
      }, this._handleColourPickEvent = t => {
        this._handleColourEvent(t), this._submitSlotChanges();
      };
    }
    async firstUpdated() {
      this.addEventListener("click", t => {
        this._closeModal(t);
      }), this.addEventListener("ac-select-dropdown", this._handleDropdownEvent), this.addEventListener("colorchanged", this._handleColourEvent), this.addEventListener("colorpicked", this._handleColourPickEvent);
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-mcb-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-mcb-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("language") && (this._heading = yr("card.spool_settings.heading", this.language), this._labelSelectMaterial = yr("card.spool_settings.label_select_material", this.language), this._labelSelectColour = yr("card.spool_settings.label_select_colour", this.language), this._buttonSave = yr("common.actions.save", this.language));
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      const t = {
        height: this.isHidden ? "1px" : "auto",
        opacity: this.isHidden ? 0 : 1,
        scale: this.isHidden ? 0 : 1
      };
      return X`
      <div
        class="ac-modal-container"
        style=${ge(t)}
        ${Le(Object.assign({}, Ds))}
      >
        <span
          class="ac-modal-close"
          @click="${t => {
        this._closeModal(t);
      }}"
          >&times;</span
        >
        <div
          class="ac-modal-card"
          @click="${t => {
        this._cardClick(t);
      }}"
        >
          ${this.color ? this._renderCard() : q}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return this.spool_index >= 0 ? X`
          <div>
            <div class="ac-slot-title">
              ${this._heading}: ${this.spool_index + 1}
            </div>
            <div>
              <div>
                <p class="ac-modal-label">${this._labelSelectMaterial}:</p>
                <anycubic-ui-select-dropdown
                  .availableOptions=${It}
                  .placeholder=${It.PLA}
                  .initialItem=${this.material_type}
                ></anycubic-ui-select-dropdown>
              </div>
              ${this._renderPresets()}
              <div>
                <p class="ac-modal-label">${this._labelSelectColour}:</p>
                <color-picker .value="${this.color}"></color-picker>
              </div>
            </div>
            <div class="ac-save-settings">
              <ha-control-button
                @click="${t => {
        this._handleSaveButton();
      }}"
              >
                ${this._buttonSave}
              </ha-control-button>
            </div>
          </div>
        ` : q;
    }
    _renderPresets() {
      return X`
      <div>
        <p class="ac-modal-label">Choose Preset Colour:</p>
        <div class="ac-mcb-presets">
          ${this.slotColors ? vr(this.slotColors, (t, e) => X`
                  <div
                    class="ac-mcb-preset-color"
                    style=${ge({
        "background-color": t
      })}
                    @click="${e => {
        this._colourPresetChange(t);
      }}"
                  >
                    &nbsp;
                  </div>
                `) : q}
        </div>
      </div>
    `;
    }
    _colourPresetChange(t) {
      this.color = t, this._elColorPicker && (this._elColorPicker.color = this.color);
    }
    _handleSaveButton() {
      this._submitSlotChanges();
    }
    _submitSlotChanges() {
      if (this.selectedPrinterDevice && this.material_type && this.spool_index >= 0 && this.color && this.color.length >= 3) {
        const t = `multi_color_box_set_slot_${this.material_type.toLowerCase()}`;
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          box_id: this.box_id,
          slot_number: this.spool_index + 1,
          slot_color_red: this.color[0],
          slot_color_green: this.color[1],
          slot_color_blue: this.color[2]
        }), this._closeModal();
      }
    }
    _closeModal(t) {
      t && t.stopPropagation(), this._isOpen = !1, this.spool_index = -1, this.material_type = void 0, this.color = void 0, this.box_id = 0;
    }
    _cardClick(t) {
      t.stopPropagation();
    }
    static get styles() {
      return u`
      ${Rr}

      .ac-slot-title {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      .ac-mcb-presets {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
      }

      .ac-mcb-preset-color {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        margin: 20px 10px;
      }

      ha-control-button {
        min-width: 150px;
        margin: 30px auto 0px;
        font-size: 14px;
      }

      color-picker {
        --font-fam: var(--token-font-family-primary);
        --bg-color: var(--ha-card-background);
        --label-color: var(--secondary-text-color);
        --form-border-color: var(--ha-card-background);
        --input-active-border-color: var(--primary-color);
        --input-bg: var(--primary-background-color);
        --input-active-bg: var(--ha-card-background);
        --input-color: var(--secondary-text-color);
        --input-active-color: var(--primary-text-color);
        --input-active-box-shadow: 0 2px 5px #ccc;
        --button-active-bg: var(--state-active-color);
        --button-active-color: var(--token-color-icon-primary);
        --outer-box-shadow: 0 4px 12px #111;
      }
    `;
    }
  };
  s([wt("color-picker")], Hs.prototype, "_elColorPicker", void 0), s([_t()], Hs.prototype, "hass", void 0), s([_t()], Hs.prototype, "language", void 0), s([_t()], Hs.prototype, "selectedPrinterDevice", void 0), s([_t()], Hs.prototype, "slotColors", void 0), s([bt()], Hs.prototype, "box_id", void 0), s([bt()], Hs.prototype, "spoolList", void 0), s([bt()], Hs.prototype, "spool_index", void 0), s([bt()], Hs.prototype, "material_type", void 0), s([bt()], Hs.prototype, "color", void 0), s([bt()], Hs.prototype, "_isOpen", void 0), s([bt()], Hs.prototype, "_heading", void 0), s([bt()], Hs.prototype, "_labelSelectMaterial", void 0), s([bt()], Hs.prototype, "_labelSelectColour", void 0), s([bt()], Hs.prototype, "_buttonSave", void 0), Hs = s([_r("anycubic-printercard-multicolorbox_modal_spool")], Hs);
  const Os = {
    keyframeOptions: {
      duration: 250,
      direction: "alternate",
      easing: "ease-in-out"
    },
    properties: ["height", "opacity", "scale"]
  };
  let Is = class extends pt {
    constructor() {
      super(...arguments), this.availableSpeedModes = [], this.isFDM = !1, this.currentSpeedModeKey = 0, this.currentSpeedModeDescr = void 0, this._userEditSpeedMode = !1, this.currentFanSpeed = 0, this._userEditFanSpeed = !1, this.currentAuxFanSpeed = 0, this._userEditAuxFanSpeed = !1, this.currentBoxFanSpeed = 0, this._userEditBoxFanSpeed = !1, this.currentTargetTempNozzle = 0, this.minTargetTempNozzle = 0, this.maxTargetTempNozzle = 0, this._userEditTargetTempNozzle = !1, this.currentTargetTempHotbed = 0, this.minTargetTempHotbed = 0, this.maxTargetTempHotbed = 0, this._userEditTargetTempHotbed = !1, this._isOpen = !1, this._handleModalEvent = t => {
        t.stopPropagation(), t.detail.modalOpen && (this._isOpen = !0, this._resetUserEdits());
      }, this._handleDropdownEvent = t => {
        t.stopPropagation(), this._userEditSpeedMode = !0, void 0 !== t.detail.key && (this.currentSpeedModeKey = t.detail.key, this.currentSpeedModeDescr = this.currentSpeedModeKey >= 0 && this.currentSpeedModeKey in this.availableSpeedModes ? this.availableSpeedModes[this.currentSpeedModeKey] : void 0);
      };
    }
    async firstUpdated() {
      this.addEventListener("ac-select-dropdown", this._handleDropdownEvent), this.addEventListener("click", t => {
        this._closeModal(t);
      });
    }
    connectedCallback() {
      var t;
      super.connectedCallback(), null === (t = this.parentElement) || void 0 === t || t.addEventListener("ac-printset-modal", this._handleModalEvent);
    }
    disconnectedCallback() {
      var t;
      null === (t = this.parentElement) || void 0 === t || t.removeEventListener("ac-printset-modal", this._handleModalEvent), super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._labelNozzleTemperature = yr("card.print_settings.label_nozzle_temp", this.language), this._labelHotbedTemperature = yr("card.print_settings.label_hotbed_temp", this.language), this._labelFanSpeed = yr("card.print_settings.label_fan_speed", this.language), this._labelAuxFanSpeed = yr("card.print_settings.label_aux_fan_speed", this.language), this._labelBoxFanSpeed = yr("card.print_settings.label_box_fan_speed", this.language), this._buttonYes = yr("common.actions.yes", this.language), this._buttonNo = yr("common.actions.no", this.language), this._buttonPrintPause = yr("card.print_settings.print_pause", this.language), this._buttonPrintResume = yr("card.print_settings.print_resume", this.language), this._buttonPrintCancel = yr("card.print_settings.print_cancel", this.language), this._buttonSaveSpeedMode = yr("card.print_settings.save_speed_mode", this.language), this._buttonSaveTargetNozzle = yr("card.print_settings.save_target_nozzle", this.language), this._buttonSaveTargetHotbed = yr("card.print_settings.save_target_hotbed", this.language), this._buttonSaveFanSpeed = yr("card.print_settings.save_fan_speed", this.language), this._buttonSaveAuxFanSpeed = yr("card.print_settings.save_aux_fan_speed", this.language), this._buttonSaveBoxFanSpeed = yr("card.print_settings.save_box_fan_speed", this.language)), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        if (this.isFDM = (e = this.hass, i = this.printerEntities, r = this.printerEntityIdPart, "Filament" === Kt(e, i, r, "current_status").attributes.material_type), this._userEditFanSpeed || (this.currentFanSpeed = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "fan_speed", 0).state), !this._userEditTargetTempNozzle) {
          const t = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature", 0, {
            limit_min: 0,
            limit_max: 0
          });
          this.currentTargetTempNozzle = t.state, this.minTargetTempNozzle = t.attributes.limit_min, this.maxTargetTempNozzle = t.attributes.limit_max;
        }
        if (!this._userEditTargetTempHotbed) {
          const t = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature", 0, {
            limit_min: 0,
            limit_max: 0
          });
          this.currentTargetTempHotbed = t.state, this.minTargetTempHotbed = t.attributes.limit_min, this.maxTargetTempHotbed = t.attributes.limit_max;
        }
        if (!this._userEditSpeedMode) {
          const t = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_speed_mode", "", {
            available_modes: [],
            job_speed_mode_code: -1
          });
          this.availableSpeedModes = ne(t), this.currentSpeedModeKey = t.attributes.print_speed_mode_code, this.currentSpeedModeDescr = this.currentSpeedModeKey >= 0 && this.currentSpeedModeKey in this.availableSpeedModes ? this.availableSpeedModes[this.currentSpeedModeKey] : void 0;
        }
      }
      var e, i, r;
    }
    update(t) {
      super.update(t), this._isOpen ? this.style.display = "block" : this.style.display = "none";
    }
    render() {
      const t = {
        height: this.isHidden ? "1px" : "auto",
        opacity: this.isHidden ? 0 : 1,
        scale: this.isHidden ? 0 : 1
      };
      return X`
      <div
        class="ac-modal-container"
        style=${ge(t)}
        ${Le(Object.assign({}, Os))}
      >
        <span
          class="ac-modal-close"
          @click="${t => {
        this._closeModal(t);
      }}"
          >&times;</span
        >
        <div
          class="ac-modal-card"
          @click="${t => {
        this._cardClick(t);
      }}"
        >
          ${this._renderCard()}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return this._confirmationType ? this._renderConfirm() : this._renderSettings();
    }
    _renderConfirm() {
      return X`
      <div>
        <div class="ac-settings-header">Confirm Action</div>
        <div>
          <div class="ac-confirm-description">${this._confirmMessage}</div>
          <div class="ac-confirm-buttons">
            <ha-control-button
              @click="${t => {
        this._handleConfirmApprove();
      }}"
            >
              ${this._buttonYes}
            </ha-control-button>
            <ha-control-button
              @click="${t => {
        this._handleConfirmCancel();
      }}"
            >
              ${this._buttonNo}
            </ha-control-button>
          </div>
        </div>
      </div>
    `;
    }
    _renderSettings() {
      return X`
      <div>
        <div class="ac-settings-header">Print Settings</div>
        <div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${t => {
        this._setConfirmationMode(Ft.PAUSE);
      }}"
            >
              ${this._buttonPrintPause}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${t => {
        this._setConfirmationMode(Ft.RESUME);
      }}"
            >
              ${this._buttonPrintResume}
            </ha-control-button>
          </div>
          <div class="ac-settings-row ac-settings-buttonrow">
            <ha-control-button
              @click="${t => {
        this._setConfirmationMode(Ft.CANCEL);
      }}"
            >
              ${this._buttonPrintCancel}
            </ha-control-button>
          </div>
          ${this.isFDM ? X`
                <div class="ac-settings-row">
                  <anycubic-ui-select-dropdown
                    .availableOptions=${this.availableSpeedModes}
                    .placeholder=${this.currentSpeedModeDescr}
                    .initialItem=${this.currentSpeedModeDescr}
                  ></anycubic-ui-select-dropdown>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveSpeedModeButton();
      }}"
                  >
                    ${this._buttonSaveSpeedMode}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempNozzle}
                    .placeholder=${this.currentTargetTempNozzle}
                    .label=${this._labelNozzleTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempNozzle}
                    .max=${this.maxTargetTempNozzle}
                    @input=${this._handleTargetTempNozzleChange}
                    @keydown=${this._handleTargetTempNozzleKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveTargetTempNozzleButton();
      }}"
                  >
                    ${this._buttonSaveTargetNozzle}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentTargetTempHotbed}
                    .placeholder=${this.currentTargetTempHotbed}
                    .label=${this._labelHotbedTemperature}
                    .type=${"number"}
                    .min=${this.minTargetTempHotbed}
                    .max=${this.maxTargetTempHotbed}
                    @input=${this._handleTargetTempHotbedChange}
                    @keydown=${this._handleTargetTempHotbedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveTargetTempHotbedButton();
      }}"
                  >
                    ${this._buttonSaveTargetHotbed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row">
                  <ha-textfield
                    .value=${this.currentFanSpeed}
                    .placeholder=${this.currentFanSpeed}
                    .label=${this._labelFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleFanSpeedChange}
                    @keydown=${this._handleFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveFanSpeedButton();
      }}"
                  >
                    ${this._buttonSaveFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentAuxFanSpeed}
                    .placeholder=${this.currentAuxFanSpeed}
                    .label=${this._labelAuxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleAuxFanSpeedChange}
                    @keydown=${this._handleAuxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveAuxFanSpeedButton();
      }}"
                  >
                    ${this._buttonSaveAuxFanSpeed}
                  </ha-control-button>
                </div>
                <div class="ac-settings-row ac-disabled-feature">
                  <ha-textfield
                    .value=${this.currentBoxFanSpeed}
                    .placeholder=${this.currentBoxFanSpeed}
                    .label=${this._labelBoxFanSpeed}
                    .type=${"number"}
                    .min=${0}
                    .max=${100}
                    @input=${this._handleBoxFanSpeedChange}
                    @keydown=${this._handleBoxFanSpeedKeyDown}
                  ></ha-textfield>
                  <ha-control-button
                    @click="${t => {
        this._handleSaveBoxFanSpeedButton();
      }}"
                  >
                    ${this._buttonSaveBoxFanSpeed}
                  </ha-control-button>
                </div>
              ` : q}
        </div>
      </div>
    `;
    }
    _setConfirmationMode(t) {
      this._confirmationType = t, this._confirmMessage = yr("card.print_settings.confirm_message", this.language, "action", yr("common.actions." + this._confirmationType, this.language));
    }
    _pressHassButton(t) {
      this.hass.callService("button", "press", {
        entity_id: jt(this.printerEntityIdPart, "button", t)
      });
    }
    _handleConfirmApprove() {
      switch (this._confirmationType) {
        case Ft.PAUSE:
          this._pressHassButton("pause_print");
          break;
        case Ft.RESUME:
          this._pressHassButton("resume_print");
          break;
        case Ft.CANCEL:
          this._pressHassButton("cancel_print");
      }
      this._confirmationType = void 0, this._closeModal();
    }
    _handleConfirmCancel() {
      this._confirmationType = void 0;
    }
    _handleFanSpeedChange(t) {
      const e = t.currentTarget.value;
      this.currentFanSpeed = Number(e), this._userEditFanSpeed = !0;
    }
    _handleAuxFanSpeedChange(t) {
      const e = t.currentTarget.value;
      this.currentAuxFanSpeed = Number(e), this._userEditAuxFanSpeed = !0;
    }
    _handleBoxFanSpeedChange(t) {
      const e = t.currentTarget.value;
      this.currentBoxFanSpeed = Number(e), this._userEditBoxFanSpeed = !0;
    }
    _handleFanSpeedKeyDown(t) {
      "Enter" === t.code ? (t.preventDefault(), this._submitChangedFanSpeed()) : this._userEditFanSpeed = !0;
    }
    _handleAuxFanSpeedKeyDown(t) {
      "Enter" === t.code ? (t.preventDefault(), this._submitChangedAuxFanSpeed()) : this._userEditAuxFanSpeed = !0;
    }
    _handleBoxFanSpeedKeyDown(t) {
      "Enter" === t.code ? (t.preventDefault(), this._submitChangedBoxFanSpeed()) : this._userEditBoxFanSpeed = !0;
    }
    _handleTargetTempNozzleChange(t) {
      const e = t.currentTarget.value;
      this.currentTargetTempNozzle = Number(e), this._userEditTargetTempNozzle = !0;
    }
    _handleTargetTempHotbedChange(t) {
      const e = t.currentTarget.value;
      this.currentTargetTempHotbed = Number(e), this._userEditTargetTempHotbed = !0;
    }
    _handleTargetTempNozzleKeyDown(t) {
      "Enter" === t.code ? (t.preventDefault(), this._submitChangedTargetTempNozzle()) : this._userEditTargetTempNozzle = !0;
    }
    _handleTargetTempHotbedKeyDown(t) {
      "Enter" === t.code ? (t.preventDefault(), this._submitChangedTargetTempHotbed()) : this._userEditTargetTempHotbed = !0;
    }
    _handleSaveFanSpeedButton() {
      this._submitChangedFanSpeed(), this._resetUserEdits();
    }
    _handleSaveAuxFanSpeedButton() {
      this._submitChangedAuxFanSpeed(), this._resetUserEdits();
    }
    _handleSaveBoxFanSpeedButton() {
      this._submitChangedBoxFanSpeed(), this._resetUserEdits();
    }
    _handleSaveSpeedModeButton() {
      this._submitChangedSpeedMode(), this._resetUserEdits();
    }
    _handleSaveTargetTempNozzleButton() {
      this._submitChangedTargetTempNozzle(), this._resetUserEdits();
    }
    _handleSaveTargetTempHotbedButton() {
      this._submitChangedTargetTempHotbed(), this._resetUserEdits();
    }
    _resetUserEdits() {
      this._userEditFanSpeed = !1, this._userEditAuxFanSpeed = !1, this._userEditBoxFanSpeed = !1, this._userEditTargetTempNozzle = !1, this._userEditTargetTempHotbed = !1, this._userEditSpeedMode = !1;
    }
    _closeModal(t) {
      t && t.stopPropagation(), this._isOpen = !1, this._resetUserEdits();
    }
    _cardClick(t) {
      t.stopPropagation();
    }
    _submitChangedSpeedMode() {
      if (this._userEditSpeedMode && this.selectedPrinterDevice) {
        const t = "change_print_speed_mode";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed_mode: this.currentSpeedModeKey
        }), this._closeModal();
      }
    }
    _submitChangedFanSpeed() {
      if (this._userEditFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_fan_speed";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentFanSpeed
        }), this._closeModal();
      }
    }
    _submitChangedAuxFanSpeed() {
      if (this._userEditAuxFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_aux_fan_speed";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentAuxFanSpeed
        }), this._closeModal();
      }
    }
    _submitChangedBoxFanSpeed() {
      if (this._userEditBoxFanSpeed && this.selectedPrinterDevice) {
        const t = "change_print_box_fan_speed";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          speed: this.currentBoxFanSpeed
        }), this._closeModal();
      }
    }
    _submitChangedTargetTempNozzle() {
      if (this._userEditTargetTempNozzle && this.selectedPrinterDevice) {
        const t = "change_print_target_nozzle_temperature";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          temperature: this.currentTargetTempNozzle
        }), this._closeModal();
      }
    }
    _submitChangedTargetTempHotbed() {
      if (this._userEditTargetTempHotbed && this.selectedPrinterDevice) {
        const t = "change_print_target_hotbed_temperature";
        this.hass.callService(Ts, t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          temperature: this.currentTargetTempHotbed
        }), this._closeModal();
      }
    }
    static get styles() {
      return u`
      ${Rr}

      .ac-settings-header {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .ac-settings-row {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
      }

      .ac-disabled-feature {
        display: none;
      }

      ha-textfield {
        min-width: 150px;
        width: 100%;
      }

      ha-control-button {
        min-width: 150px;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-settings-buttonrow ha-control-button {
        min-width: 100%;
        margin: 8px 0px 0px 8px;
        font-size: 14px;
      }

      .ac-confirm-description {
        font-size: 16px;
        text-align: center;
      }

      .ac-confirm-buttons {
        display: flex;
        justify-content: center;
      }

      .ac-confirm-buttons ha-control-button {
        margin: 20px 30px 0px 30px;
      }
    `;
    }
  };
  s([_t()], Is.prototype, "hass", void 0), s([_t()], Is.prototype, "language", void 0), s([_t()], Is.prototype, "selectedPrinterDevice", void 0), s([_t()], Is.prototype, "printerEntities", void 0), s([_t()], Is.prototype, "printerEntityIdPart", void 0), s([bt()], Is.prototype, "availableSpeedModes", void 0), s([bt()], Is.prototype, "isFDM", void 0), s([bt()], Is.prototype, "currentSpeedModeKey", void 0), s([bt()], Is.prototype, "currentSpeedModeDescr", void 0), s([bt()], Is.prototype, "_userEditSpeedMode", void 0), s([bt()], Is.prototype, "currentFanSpeed", void 0), s([bt()], Is.prototype, "_userEditFanSpeed", void 0), s([bt()], Is.prototype, "currentAuxFanSpeed", void 0), s([bt()], Is.prototype, "_userEditAuxFanSpeed", void 0), s([bt()], Is.prototype, "currentBoxFanSpeed", void 0), s([bt()], Is.prototype, "_userEditBoxFanSpeed", void 0), s([bt()], Is.prototype, "currentTargetTempNozzle", void 0), s([bt()], Is.prototype, "minTargetTempNozzle", void 0), s([bt()], Is.prototype, "maxTargetTempNozzle", void 0), s([bt()], Is.prototype, "_userEditTargetTempNozzle", void 0), s([bt()], Is.prototype, "currentTargetTempHotbed", void 0), s([bt()], Is.prototype, "minTargetTempHotbed", void 0), s([bt()], Is.prototype, "maxTargetTempHotbed", void 0), s([bt()], Is.prototype, "_userEditTargetTempHotbed", void 0), s([bt()], Is.prototype, "_confirmationType", void 0), s([bt()], Is.prototype, "_isOpen", void 0), s([bt()], Is.prototype, "_confirmMessage", void 0), s([bt()], Is.prototype, "_labelNozzleTemperature", void 0), s([bt()], Is.prototype, "_labelHotbedTemperature", void 0), s([bt()], Is.prototype, "_labelFanSpeed", void 0), s([bt()], Is.prototype, "_labelAuxFanSpeed", void 0), s([bt()], Is.prototype, "_labelBoxFanSpeed", void 0), s([bt()], Is.prototype, "_buttonYes", void 0), s([bt()], Is.prototype, "_buttonNo", void 0), s([bt()], Is.prototype, "_buttonPrintPause", void 0), s([bt()], Is.prototype, "_buttonPrintResume", void 0), s([bt()], Is.prototype, "_buttonPrintCancel", void 0), s([bt()], Is.prototype, "_buttonSaveSpeedMode", void 0), s([bt()], Is.prototype, "_buttonSaveTargetNozzle", void 0), s([bt()], Is.prototype, "_buttonSaveTargetHotbed", void 0), s([bt()], Is.prototype, "_buttonSaveFanSpeed", void 0), s([bt()], Is.prototype, "_buttonSaveAuxFanSpeed", void 0), s([bt()], Is.prototype, "_buttonSaveBoxFanSpeed", void 0), Is = s([_r("anycubic-printercard-printsettings_modal")], Is);
  const Fs = {
      keyframeOptions: {
        duration: 250,
        direction: "normal",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    Bs = ie();
  let Ns = class extends pt {
    constructor() {
      super(...arguments), this.monitoredStats = Bs, this.round = !0, this.temperatureUnit = Pt.C, this._showVideo = !1, this.cameraEntityState = void 0, this.isHidden = !1, this.isPrinting = !1, this.hiddenOverride = !1, this.hasColorbox = !1, this.hasSecondaryColorbox = !1, this.lightIsOn = !1, this.statusColor = "#ffc107", this.progressPercent = 0;
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("language") && (this._buttonPrintSettings = yr("card.buttons.print_settings", this.language)), t.has("monitoredStats") && (this.monitoredStats = se(this.monitoredStats, Bs)), t.has("selectedPrinterID") && (this.printerEntities = zt(this.hass, this.selectedPrinterID), this.printerEntityIdPart = Vt(this.printerEntities)), t.has("hass") || t.has("alwaysShow") || t.has("hiddenOverride") || t.has("selectedPrinterID")) {
        this.progressPercent = this._percentComplete(), this.hasColorbox = "active" === Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_spools", "inactive").state, this.hasSecondaryColorbox = "active" === Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "secondary_multi_color_box_spools", "inactive").state, this.cameraEntityId && (this.cameraEntityState = Ut(this.hass, {
          entity_id: this.cameraEntityId
        })), this.lightIsOn = Rt(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
        const t = Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_state", "unknown").state.toLowerCase();
        this.isPrinting = Jt(t), this.isHidden = !this.alwaysShow && !this.hiddenOverride && !this.isPrinting, this.statusColor = function (t) {
          return "preheating" === t ? "#ffc107" : Jt(t) ? "#4caf50" : "unknown" === t ? "#f44336" : "operational" === t || "finished" === t ? "#00bcd4" : "#f44336";
        }(t), this.lightIsOn = Rt(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
      }
    }
    render() {
      const t = {
        "ac-hidden": !0 !== this._showVideo
      };
      return X`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        <anycubic-printercard-camera_view
          class="${de(t)}"
          .showVideo=${this._showVideo}
          .toggleVideo=${() => this._toggleVideo()}
          .cameraEntity=${this.cameraEntityState}
        ></anycubic-printercard-camera_view>
        <anycubic-printercard-multicolorbox_modal_spool
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .slotColors=${this.slotColors}
        ></anycubic-printercard-multicolorbox_modal_spool>
        <anycubic-printercard-printsettings_modal
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-printsettings_modal>
        <anycubic-printercard-multicolorbox_modal_drying
          .hass=${this.hass}
          .language=${this.language}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
        ></anycubic-printercard-multicolorbox_modal_drying>
      </div>
    `;
    }
    _renderHeader() {
      var t;
      const e = {
          "ac-h-justifycenter": !this.powerEntityId || !this.lightEntityId
        },
        i = {
          "background-color": this.statusColor
        };
      return X`
      <div class="ac-printer-card-header ${de(e)}">
        ${this.powerEntityId ? X`
              <button
                class="ac-printer-card-button-small"
                @click="${t => {
        this._togglePowerEntity();
      }}"
              >
                <ha-svg-icon .path=${"M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"}></ha-svg-icon>
              </button>
            ` : q}

        <button
          class="ac-printer-card-button-name"
          @click="${t => {
        this._toggleHiddenOveride();
      }}"
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${ge(i)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${null === (t = this.selectedPrinterDevice) || void 0 === t ? void 0 : t.name}
          </p>
        </button>
        ${this.lightEntityId ? X`
              <button
                class="ac-printer-card-button-small"
                @click="${t => {
        this._toggleLightEntity();
      }}"
              >
                <ha-svg-icon
                  .path=${this.lightIsOn ? "M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z" : "M12,2C9.76,2 7.78,3.05 6.5,4.68L16.31,14.5C17.94,13.21 19,11.24 19,9A7,7 0 0,0 12,2M3.28,4L2,5.27L5.04,8.3C5,8.53 5,8.76 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H14.73L18.73,22L20,20.72L3.28,4M9,20V21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9Z"}
                ></ha-svg-icon>
              </button>
            ` : q}
      </div>
    `;
    }
    _renderPrinterContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        },
        i = {
          width: this.vertical ? "100%" : this.scaleFactor ? 50 * this.scaleFactor + "%" : "50%"
        },
        r = {
          width: this.vertical ? "100%" : this.scaleFactor ? 50 / this.scaleFactor + "%" : "50%"
        };
      return X`
      <div
        class="ac-printer-card-infocontainer ${de(t)}"
        style=${ge(e)}
        ${Le(Object.assign({}, Fs))}
      >
        <div
          class="ac-printer-card-info-animcontainer ${de(t)}"
          style=${ge(i)}
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .scaleFactor=${this.scaleFactor}
            .toggleVideo=${() => this._toggleVideo()}
          ></anycubic-printercard-printer_view>
          ${this.vertical ? X`<p class="ac-printer-card-info-vertprog">
                ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
              </p>` : q}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${de(t)}"
          style=${ge(r)}
        >
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .language=${this.language}
            .monitoredStats=${this.monitoredStats}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .progressPercent=${this.progressPercent}
            .showPercent=${!this.vertical}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this._renderPrintSettingsContainer()}
      ${this._renderMultiColorBoxContainer()}
      ${this._renderSecondaryMultiColorBoxContainer()}
    `;
    }
    _toggleVideo() {
      this._showVideo = !(!this.cameraEntityState || this._showVideo);
    }
    _renderPrintSettingsContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.showSettingsButton || this.isPrinting ? X`
          <div
            class="ac-printer-card-infocontainer ${de(t)}"
            style=${ge(e)}
            ${Le(Object.assign({}, Fs))}
          >
            <div
              class="ac-printer-card-settingssection ${de(t)}"
            >
              <button
                class="ac-printer-card-button-settings"
                @click="${t => {
        this._openPrintSettingsModal();
      }}"
              >
                <ha-svg-icon .path=${"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"}></ha-svg-icon>
                ${this._buttonPrintSettings}
              </button>
            </div>
          </div>
        ` : q;
    }
    _renderMultiColorBoxContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.hasColorbox ? X`
          <div
            class="ac-printer-card-infocontainer ${de(t)}"
            style=${ge(e)}
            ${Le(Object.assign({}, Fs))}
          >
            <div class="ac-printer-card-mcbsection ${de(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${0}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : q;
    }
    _renderSecondaryMultiColorBoxContainer() {
      const t = {
          "ac-card-vertical": !!this.vertical
        },
        e = {
          height: this.isHidden ? "1px" : "auto",
          opacity: this.isHidden ? 0 : 1,
          scale: this.isHidden ? 0 : 1
        };
      return this.hasSecondaryColorbox ? X`
          <div
            class="ac-printer-card-infocontainer ${de(t)}"
            style=${ge(e)}
            ${Le(Object.assign({}, Fs))}
          >
            <div class="ac-printer-card-mcbsection ${de(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .language=${this.language}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
                .box_id=${1}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : q;
    }
    _openPrintSettingsModal() {
      At(this._printerCardContainer, "ac-printset-modal", {
        modalOpen: !0
      });
    }
    _toggleLightEntity() {
      this.lightEntityId && this.hass.callService("homeassistant", "toggle", {
        entity_id: this.lightEntityId
      });
    }
    _togglePowerEntity() {
      this.powerEntityId && this.hass.callService("homeassistant", "toggle", {
        entity_id: this.powerEntityId
      });
    }
    _toggleHiddenOveride() {
      this.hiddenOverride = !this.hiddenOverride;
    }
    _percentComplete() {
      return Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "job_progress", -1).state;
    }
    static get styles() {
      return u`
      :host {
        display: block;
      }

      .ac-printer-card {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: stretch;
        box-sizing: border-box;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        margin: 0px;
        box-shadow: var(
          --ha-card-box-shadow,
          0px 2px 1px -1px rgba(0, 0, 0, 0.2),
          0px 1px 1px 0px rgba(0, 0, 0, 0.14),
          0px 1px 3px 0px rgba(0, 0, 0, 0.12)
        );
      }

      .ac-printer-card-mainview {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printer-card-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
      }

      .ac-h-justifycenter {
        justify-content: center;
      }

      .ac-printer-card-button-small {
        border: none;
        outline: none;
        background-color: transparent;
        width: 32px;
        height: 32px;
        font-size: 22px;
        line-height: 22px;
        box-sizing: border-box;
        padding: 0px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings {
        border: none;
        border-radius: 6px;
        outline: none;
        background-color: transparent;
        font-size: 18px;
        box-sizing: border-box;
        padding: 4px 12px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
        color: var(--primary-text-color);
      }

      .ac-printer-card-button-settings:hover {
        background-color: #7f7f7f36;
      }

      .ac-printer-card-button-settings:active {
        background-color: #7f7f7f5e;
      }

      .ac-printer-card-button-name {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border: none;
        outline: none;
        background-color: transparent;
        padding: 24px;
      }
      .ac-printer-card-header-status-dot {
        margin: 0px 10px;
        height: 10px;
        width: 10px;
        border-radius: 5px;
        box-sizing: border-box;
      }

      .ac-printer-card-header-status-text {
        font-weight: bold;
        font-size: 22px;
        margin: 0px;
        color: var(--primary-text-color);
      }

      .ac-printer-card-infocontainer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-printer-card-infocontainer.ac-card-vertical {
        flex-direction: column;
      }

      .ac-printer-card-info-animcontainer {
        box-sizing: border-box;
        padding: 0px 8px 32px 8px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
      }

      anycubic-printercard-printer_view {
        width: 100%;
        flex-grow: 1;
      }

      .ac-printer-card-info-vertprog {
        width: 50%;
        font-size: 36px;
        text-align: center;
        font-weight: bold;
      }

      anycubic-printercard-printer_view.ac-card-vertical {
        width: auto;
      }

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 8px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-info-statscontainer.ac-card-vertical {
        padding-left: 32px;
        padding-right: 32px;
        width: 100%;
        height: auto;
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 6px;
        width: 100%;
        height: 100%;
      }

      .ac-printer-card-mcbsection.ac-card-vertical {
        height: auto;
      }

      .ac-hidden {
        display: none;
      }
    `;
    }
  };
  s([wt(".ac-printer-card")], Ns.prototype, "_printerCardContainer", void 0), s([_t()], Ns.prototype, "hass", void 0), s([_t()], Ns.prototype, "language", void 0), s([_t()], Ns.prototype, "monitoredStats", void 0), s([_t()], Ns.prototype, "selectedPrinterID", void 0), s([_t()], Ns.prototype, "selectedPrinterDevice", void 0), s([_t({
    type: Boolean
  })], Ns.prototype, "round", void 0), s([_t({
    type: Boolean
  })], Ns.prototype, "use_24hr", void 0), s([_t({
    type: Boolean
  })], Ns.prototype, "showSettingsButton", void 0), s([_t({
    type: Boolean
  })], Ns.prototype, "alwaysShow", void 0), s([_t({
    type: String
  })], Ns.prototype, "temperatureUnit", void 0), s([_t({
    type: String
  })], Ns.prototype, "lightEntityId", void 0), s([_t({
    type: String
  })], Ns.prototype, "powerEntityId", void 0), s([_t({
    type: String
  })], Ns.prototype, "cameraEntityId", void 0), s([_t({
    type: Boolean
  })], Ns.prototype, "vertical", void 0), s([_t()], Ns.prototype, "scaleFactor", void 0), s([_t()], Ns.prototype, "slotColors", void 0), s([bt()], Ns.prototype, "_showVideo", void 0), s([bt()], Ns.prototype, "cameraEntityState", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "isHidden", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "isPrinting", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "hiddenOverride", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "hasColorbox", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "hasSecondaryColorbox", void 0), s([bt({
    type: Boolean
  })], Ns.prototype, "lightIsOn", void 0), s([bt({
    type: String
  })], Ns.prototype, "statusColor", void 0), s([bt()], Ns.prototype, "printerEntities", void 0), s([bt()], Ns.prototype, "printerEntityIdPart", void 0), s([bt()], Ns.prototype, "progressPercent", void 0), s([bt()], Ns.prototype, "_buttonPrintSettings", void 0), Ns = s([_r("anycubic-printercard-card")], Ns);
  let Ls = class extends pt {
    willUpdate(t) {
      super.willUpdate(t), (t.has("selectedItems") || t.has("item")) && (this._isActive = this.selectedItems.includes(this.item));
    }
    update(t) {
      super.update(t), (t.has("_isActive") || t.has("selectedItems") || t.has("unusedItems") || t.has("item")) && (this.style.top = String(this._isActive ? 56 * this.selectedItems.indexOf(this.item) : 56 * (this.selectedItems.length + this.unusedItems.indexOf(this.item))) + "px");
    }
    render() {
      const t = {
        "ac-ui-deselected": !this._isActive
      };
      return X`
      <button
        class="ac-ui-msr-select"
        @click="${t => {
        this.toggle(this.item);
      }}"
      >
        ${this._isActive ? X`<ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>` : q}
      </button>
      <p class="ac-ui-msr-itemtext ${de(t)}">
        ${this.item}
      </p>
      <div>
        <button
          class="ac-ui-msr-position"
          @click="${t => {
        this.reorder(this.item, 1);
      }}"
        >
          <ha-svg-icon .path=${oe}></ha-svg-icon>
        </button>
        <button
          class="ac-ui-msr-position"
          @click="${t => {
        this.reorder(this.item, -1);
      }}"
        >
          <ha-svg-icon .path=${"M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"}></ha-svg-icon>
        </button>
      </div>
    `;
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .ac-ui-msr-itemtext {
        flex-grow: 1;
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
      }

      .ac-ui-msr-select {
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background-color: rgba(0, 0, 0, 0.1);
        outline: none;
        border: none;
        margin-right: 16px;
        padding: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .ac-ui-msr-position {
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        background-color: transparent;
        outline: none;
        border: none;
        margin-left: 16px;
        color: var(--primary-text-color);
        cursor: pointer;
      }
    `;
    }
  };
  s([_t()], Ls.prototype, "item", void 0), s([_t()], Ls.prototype, "selectedItems", void 0), s([_t()], Ls.prototype, "unusedItems", void 0), s([_t()], Ls.prototype, "reorder", void 0), s([_t()], Ls.prototype, "toggle", void 0), s([bt()], Ls.prototype, "_isActive", void 0), Ls = s([_r("anycubic-ui-multi-select-reorder-item")], Ls);
  let Us = class extends pt {
    async firstUpdated() {
      this._allOptions = Object.values(this.availableOptions), this._selectedItems = [...this.initialItems].filter(t => this._allOptions.includes(t)), this._unusedItems = this._allOptions.filter(t => !this.initialItems.includes(t)), this.requestUpdate();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("_selectedItems") && this.onChange(this._selectedItems);
    }
    render() {
      const t = {
        height: this._allOptions ? String(56 * this._allOptions.length) + "px" : "0px"
      };
      return this._allOptions ? X`
          <div style=${ge(t)}>
            ${vr(this._allOptions, (t, e) => X`
                <anycubic-ui-multi-select-reorder-item
                  .item=${t}
                  .selectedItems=${this._selectedItems}
                  .unusedItems=${this._unusedItems}
                  .reorder=${(t, e) => this._reorder(t, e)}
                  .toggle=${t => this._toggle(t)}
                ></anycubic-ui-multi-select-reorder-item>
              `)}
          </div>
        ` : q;
    }
    _reorder(t, e) {
      const i = this._selectedItems.indexOf(t),
        r = i + e;
      if (r < 0 || r > this._selectedItems.length - 1) return;
      const s = this._selectedItems.slice(0),
        n = s[r];
      s[r] = t, s[i] = n, this._selectedItems = s;
    }
    _toggle(t) {
      if (this._selectedItems.includes(t)) {
        const e = this._selectedItems.indexOf(t);
        this._selectedItems = [...this._selectedItems.slice(0, e), ...this._selectedItems.slice(e + 1)], this._unusedItems = [t, ...this._unusedItems];
      } else {
        const e = this._unusedItems.indexOf(t);
        this._unusedItems = [...this._unusedItems.slice(0, e), ...this._unusedItems.slice(e + 1)], this._selectedItems = [...this._selectedItems, t];
      }
    }
    static get styles() {
      return u`
      :host {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
      }
    `;
    }
  };
  s([_t()], Us.prototype, "availableOptions", void 0), s([_t()], Us.prototype, "initialItems", void 0), s([_t()], Us.prototype, "onChange", void 0), s([bt()], Us.prototype, "_allOptions", void 0), s([bt()], Us.prototype, "_selectedItems", void 0), s([bt()], Us.prototype, "_unusedItems", void 0), Us = s([_r("anycubic-ui-multi-select-reorder")], Us);
  const Rs = re();
  let Ys = class extends pt {
    constructor() {
      super(...arguments), this.configPage = "main", this.availableStats = [], this.formSchemaMain = [], this.formSchemaColours = [], this.hasColorbox = !1, this.isLCD = !1, this._handlePageSelected = t => {
        const e = t.detail.item.getAttribute("page-name");
        e !== this.configPage && (this.configPage = e);
      }, this._computeLabel = t => {
        switch (t.name) {
          case "printer_id":
          default:
            return this._labelPrinter_id;
          case "vertical":
            return this._labelVertical;
          case "round":
            return this._labelRound;
          case "use_24hr":
            return this._labelUse_24hr;
          case "showSettingsButton":
            return this._labelShowSettingsButton;
          case "alwaysShow":
            return this._labelAlwaysShow;
          case "temperatureUnit":
            return this._labelTemperatureUnit;
          case "lightEntityId":
            return this._labelLightEntityId;
          case "powerEntityId":
            return this._labelPowerEntityId;
          case "cameraEntityId":
            return this._labelCameraEntityId;
          case "scaleFactor":
            return this._labelScaleFactor;
          case "slotColors":
            return this._labelSlotColors;
        }
      };
    }
    willUpdate(t) {
      var e, i, r;
      super.willUpdate(t), t.has("language") && (this._tabMain = yr("card.configure.tabs.main", this.language), this._tabStats = yr("card.configure.tabs.stats", this.language), this._tabColours = yr("card.configure.tabs.colours", this.language), this._labelPrinter_id = yr("card.configure.labels.printer_id", this.language), this._labelVertical = yr("card.configure.labels.vertical", this.language), this._labelRound = yr("card.configure.labels.round", this.language), this._labelUse_24hr = yr("card.configure.labels.use_24hr", this.language), this._labelShowSettingsButton = yr("card.configure.labels.show_settings_button", this.language), this._labelAlwaysShow = yr("card.configure.labels.always_show", this.language), this._labelTemperatureUnit = yr("card.configure.labels.temperature_unit", this.language), this._labelLightEntityId = yr("card.configure.labels.light_entity_id", this.language), this._labelPowerEntityId = yr("card.configure.labels.power_entity_id", this.language), this._labelCameraEntityId = yr("card.configure.labels.camera_entity_id", this.language), this._labelScaleFactor = yr("card.configure.labels.scale_factor", this.language), this._labelSlotColors = yr("card.configure.labels.slot_colors", this.language)), (t.has("hass") || t.has("cardConfig")) && (this.printerEntities = zt(this.hass, this.cardConfig.printer_id), this.printerEntityIdPart = Vt(this.printerEntities), this.isLCD = (e = this.hass, i = this.printerEntities, r = this.printerEntityIdPart, "Resin" === Kt(e, i, r, "current_status").attributes.material_type), this.hasColorbox = "active" === Kt(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_spools", "inactive").state, this.availableStats = Object.assign(Object.assign({}, kt), Tt), this.isLCD ? this.availableStats = Object.assign(Object.assign({}, this.availableStats), Ht) : this.availableStats = Object.assign(Object.assign({}, this.availableStats), Mt), this.hasColorbox && (this.availableStats = Object.assign(Object.assign({}, this.availableStats), Dt))), (t.has("printers") || t.has("language")) && (this.formSchemaMain = this._computeSchemaMain(), this.formSchemaColours = this._computeSchemaColours());
    }
    render() {
      return X`
      <div class="ac-printer-card-configure-cont">
        ${this._renderMenu()} ${this._renderConfMain()}
        ${this._renderConfColours()} ${this._renderConfStats()}
      </div>
    `;
    }
    _renderConfMain() {
      return "main" === this.configPage ? X`
          <div class="ac-printer-card-configure-conf">
            <ha-form
              .hass=${this.hass}
              .data=${this.cardConfig}
              .schema=${this.formSchemaMain}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._formValueChanged}
            ></ha-form>
          </div>
        ` : q;
    }
    _renderConfStats() {
      return "stats" === this.configPage ? X`
          <div class="ac-printer-card-configure-conf">
            <p class="ac-cconf-label">Choose Monitored Stats</p>
            <anycubic-ui-multi-select-reorder
              .availableOptions=${this.availableStats}
              .initialItems=${this.cardConfig.monitoredStats}
              .onChange=${t => this._selectedStatsChanged(t)}
            ></anycubic-ui-multi-select-reorder>
          </div>
        ` : q;
    }
    _renderConfColours() {
      return "colours" === this.configPage ? X`
          <div class="ac-printer-card-configure-conf">
            <ha-form
              .hass=${this.hass}
              .data=${this.cardConfig}
              .schema=${this.formSchemaColours}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._formValueChanged}
            ></ha-form>
          </div>
        ` : q;
    }
    _renderMenu() {
      return X`
      <div class="header">
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${this.configPage}
          @iron-activate=${this._handlePageSelected}
        >
          <paper-tab page-name="main">${this._tabMain}</paper-tab>
          <paper-tab page-name="stats">${this._tabStats}</paper-tab>
          ${this.hasColorbox ? X`<paper-tab page-name="colours">
                ${this._tabColours}
              </paper-tab>` : q}
        </ha-tabs>
      </div>
    `;
    }
    _selectedStatsChanged(t) {
      this.cardConfig.monitoredStats = t, this._configChanged(this.cardConfig);
    }
    _configChanged(t) {
      const e = Object.keys(t).filter(e => t[e] !== Rs[e]).reduce((e, i) => (e[i] = t[i], e), {});
      At(this, "config-changed", {
        config: e
      });
    }
    _formValueChanged(t) {
      this.cardConfig = t.detail.value, this._configChanged(this.cardConfig);
    }
    _computeSchemaMain() {
      if (!this.printers) return [];
      return [{
        name: "printer_id",
        selector: {
          select: {
            options: Object.keys(this.printers).map((t, e) => ({
              value: t,
              label: this.printers[t].name
            })),
            mode: "dropdown",
            multiple: !1
          }
        }
      }, {
        name: "vertical",
        selector: {
          boolean: {}
        }
      }, {
        name: "round",
        selector: {
          boolean: {}
        }
      }, {
        name: "use_24hr",
        selector: {
          boolean: {}
        }
      }, {
        name: "temperatureUnit",
        selector: {
          select: {
            options: [{
              value: Pt.C,
              label: `°${Pt.C}`
            }, {
              value: Pt.F,
              label: `°${Pt.F}`
            }],
            mode: "list",
            multiple: !1
          }
        }
      }, {
        name: "alwaysShow",
        selector: {
          boolean: {}
        }
      }, {
        name: "showSettingsButton",
        selector: {
          boolean: {}
        }
      }, {
        name: "scaleFactor",
        selector: {
          select: {
            options: [{
              value: 1,
              label: "1"
            }, {
              value: .75,
              label: "0.75"
            }, {
              value: .5,
              label: "0.5"
            }],
            mode: "list",
            multiple: !1
          }
        }
      }, {
        name: "lightEntityId",
        selector: {
          entity: {
            domain: Ps
          }
        }
      }, {
        name: "powerEntityId",
        selector: {
          entity: {
            domain: ks
          }
        }
      }, {
        name: "cameraEntityId",
        selector: {
          entity: {
            domain: Ms
          }
        }
      }];
    }
    _computeSchemaColours() {
      return this.printers ? [{
        name: "slotColors",
        description: this._labelSlotColors,
        selector: {
          text: {
            multiple: !0
          }
        }
      }] : [];
    }
    static get styles() {
      return u`
      :host {
        display: block;
      }

      .header {
        color: var(--primary-text-color);
      }

      ha-tabs {
        margin-left: max(env(safe-area-inset-left), 24px);
        margin-right: max(env(safe-area-inset-right), 24px);
        --paper-tabs-selection-bar-color: var(--primary-color);
        text-transform: uppercase;
      }

      .ac-printer-card-configure-conf {
        margin-top: 10px;
      }

      .ac-cconf-label {
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 14px;
      }
    `;
    }
  };
  s([_t()], Ys.prototype, "hass", void 0), s([_t()], Ys.prototype, "language", void 0), s([_t()], Ys.prototype, "cardConfig", void 0), s([_t()], Ys.prototype, "printers", void 0), s([bt()], Ys.prototype, "configPage", void 0), s([bt()], Ys.prototype, "availableStats", void 0), s([bt()], Ys.prototype, "formSchemaMain", void 0), s([bt()], Ys.prototype, "formSchemaColours", void 0), s([bt()], Ys.prototype, "printerEntities", void 0), s([bt()], Ys.prototype, "printerEntityIdPart", void 0), s([bt({
    type: Boolean
  })], Ys.prototype, "hasColorbox", void 0), s([bt({
    type: Boolean
  })], Ys.prototype, "isLCD", void 0), s([bt()], Ys.prototype, "_tabMain", void 0), s([bt()], Ys.prototype, "_tabStats", void 0), s([bt()], Ys.prototype, "_tabColours", void 0), s([bt()], Ys.prototype, "_labelPrinter_id", void 0), s([bt()], Ys.prototype, "_labelVertical", void 0), s([bt()], Ys.prototype, "_labelRound", void 0), s([bt()], Ys.prototype, "_labelUse_24hr", void 0), s([bt()], Ys.prototype, "_labelShowSettingsButton", void 0), s([bt()], Ys.prototype, "_labelAlwaysShow", void 0), s([bt()], Ys.prototype, "_labelTemperatureUnit", void 0), s([bt()], Ys.prototype, "_labelLightEntityId", void 0), s([bt()], Ys.prototype, "_labelPowerEntityId", void 0), s([bt()], Ys.prototype, "_labelCameraEntityId", void 0), s([bt()], Ys.prototype, "_labelScaleFactor", void 0), s([bt()], Ys.prototype, "_labelSlotColors", void 0), Ys = s([mt("anycubic-printercard-configure")], Ys), window.console.info("%c ANYCUBIC-CARD %c v0.2.0 ", "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");
  const zs = re();
  t.AnycubicPrintercardEditor = class extends pt {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Yt(this.hass);
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("hass") && this.hass.language !== this.language && (this.language = this.hass.language), t.has("config") && (this.config.vertical = se(this.config.vertical, zs.vertical), this.config.round = se(this.config.round, zs.round), this.config.use_24hr = se(this.config.use_24hr, zs.use_24hr), this.config.alwaysShow = se(this.config.alwaysShow, zs.alwaysShow), this.config.showSettingsButton = se(this.config.showSettingsButton, zs.showSettingsButton), this.config.temperatureUnit = se(this.config.temperatureUnit, zs.temperatureUnit), this.config.monitoredStats = se(this.config.monitoredStats, zs.monitoredStats), this.config.slotColors = se(this.config.slotColors, zs.slotColors), this.config.scaleFactor = se(this.config.scaleFactor, zs.scaleFactor));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return X`
      <anycubic-printercard-configure
        .hass=${this.hass}
        .language=${this.language}
        .printers=${this.printers}
        .cardConfig=${this.config}
      ></anycubic-printercard-configure>
    `;
    }
  }, s([_t()], t.AnycubicPrintercardEditor.prototype, "hass", void 0), s([_t()], t.AnycubicPrintercardEditor.prototype, "config", void 0), s([bt()], t.AnycubicPrintercardEditor.prototype, "printers", void 0), s([bt()], t.AnycubicPrintercardEditor.prototype, "language", void 0), t.AnycubicPrintercardEditor = s([mt("anycubic-card-editor")], t.AnycubicPrintercardEditor), t.AnycubicCard = class extends pt {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Yt(this.hass), this.requestUpdate();
    }
    willUpdate(t) {
      var e, i;
      super.willUpdate(t), t.has("hass") && this.hass.language !== this.language && (this.language = this.hass.language), (t.has("config") || t.has("printers")) && (this.vertical = se(this.config.vertical, zs.vertical), this.round = se(this.config.round, zs.round), this.use_24hr = se(this.config.use_24hr, zs.use_24hr), this.alwaysShow = se(this.config.alwaysShow, zs.alwaysShow), this.showSettingsButton = se(this.config.showSettingsButton, zs.showSettingsButton), this.temperatureUnit = se(this.config.temperatureUnit, zs.temperatureUnit), this.lightEntityId = this.config.lightEntityId, this.powerEntityId = this.config.powerEntityId, this.cameraEntityId = this.config.cameraEntityId, this.scaleFactor = this.config.scaleFactor, this.slotColors = this.config.slotColors, this.monitoredStats = this.config.monitoredStats, this.config.printer_id && this.printers && (this.selectedPrinterID = this.config.printer_id, this.selectedPrinterDevice = (e = this.printers, i = this.config.printer_id, e && i ? e[i] : void 0)));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return X`
      <anycubic-printercard-card
        .hass=${this.hass}
        .language=${this.language}
        .monitoredStats=${this.config.monitoredStats}
        .selectedPrinterID=${this.selectedPrinterID}
        .selectedPrinterDevice=${this.selectedPrinterDevice}
        .vertical=${this.vertical}
        .round=${this.round}
        .use_24hr=${this.use_24hr}
        .showSettingsButton=${this.showSettingsButton}
        .alwaysShow=${this.alwaysShow}
        .temperatureUnit=${this.temperatureUnit}
        .lightEntityId=${this.lightEntityId}
        .powerEntityId=${this.powerEntityId}
        .cameraEntityId=${this.cameraEntityId}
        .scaleFactor=${this.scaleFactor}
        .slotColors=${this.slotColors}
      ></anycubic-printercard-card>
    `;
    }
    getCardSize() {
      return 2;
    }
    static getConfigElement() {
      return document.createElement("anycubic-card-editor");
    }
    static getStubConfig(t, e, i) {
      return {
        printer_id: Object.keys(Yt(t))[0]
      };
    }
  }, s([_t()], t.AnycubicCard.prototype, "hass", void 0), s([_t()], t.AnycubicCard.prototype, "config", void 0), s([bt()], t.AnycubicCard.prototype, "printers", void 0), s([bt()], t.AnycubicCard.prototype, "language", void 0), s([bt()], t.AnycubicCard.prototype, "selectedPrinterID", void 0), s([bt()], t.AnycubicCard.prototype, "selectedPrinterDevice", void 0), s([bt({
    type: Boolean
  })], t.AnycubicCard.prototype, "vertical", void 0), s([bt({
    type: Boolean
  })], t.AnycubicCard.prototype, "round", void 0), s([bt({
    type: Boolean
  })], t.AnycubicCard.prototype, "use_24hr", void 0), s([bt({
    type: Boolean
  })], t.AnycubicCard.prototype, "showSettingsButton", void 0), s([bt({
    type: Boolean
  })], t.AnycubicCard.prototype, "alwaysShow", void 0), s([bt({
    type: String
  })], t.AnycubicCard.prototype, "temperatureUnit", void 0), s([bt({
    type: String
  })], t.AnycubicCard.prototype, "lightEntityId", void 0), s([bt({
    type: String
  })], t.AnycubicCard.prototype, "powerEntityId", void 0), s([bt({
    type: String
  })], t.AnycubicCard.prototype, "cameraEntityId", void 0), s([bt({
    type: Number
  })], t.AnycubicCard.prototype, "scaleFactor", void 0), s([bt()], t.AnycubicCard.prototype, "slotColors", void 0), s([bt()], t.AnycubicCard.prototype, "monitoredStats", void 0), t.AnycubicCard = s([mt("anycubic-card")], t.AnycubicCard), window.customCards = window.customCards || [], window.customCards.push({
    type: "anycubic-card",
    name: "Anycubic Card",
    preview: !0,
    description: "Anycubic Cloud Integration Card"
  }), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
