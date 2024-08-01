!function (t) {
  function e(t, e, i, s) {
    var r,
      n = arguments.length,
      o = n < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, i) : s;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, i, s);else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (o = (n < 3 ? r(o) : n > 3 ? r(e, i, o) : r(e, i)) || o);
    return n > 3 && o && Object.defineProperty(e, i, o), o;
  }
  "function" == typeof SuppressedError && SuppressedError;
  /**
       * @license
       * Copyright 2019 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const i = globalThis,
    s = i.ShadowRoot && (void 0 === i.ShadyCSS || i.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype,
    r = Symbol(),
    n = new WeakMap();
  class o {
    constructor(t, e, i) {
      if (this._$cssResult$ = !0, i !== r) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t, this.t = e;
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (s && void 0 === t) {
        const i = void 0 !== e && 1 === e.length;
        i && (t = n.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && n.set(e, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const a = (t, ...e) => {
      const i = 1 === t.length ? t[0] : e.reduce((e, i, s) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + t[s + 1], t[0]);
      return new o(i, t, r);
    },
    d = s ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const i of t.cssRules) e += i.cssText;
      return (t => new o("string" == typeof t ? t : t + "", void 0, r))(e);
    })(t) : t
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    {
      is: c,
      defineProperty: h,
      getOwnPropertyDescriptor: l,
      getOwnPropertyNames: u,
      getOwnPropertySymbols: p,
      getPrototypeOf: f
    } = Object,
    m = globalThis,
    y = m.trustedTypes,
    g = y ? y.emptyScript : "",
    _ = m.reactiveElementPolyfillSupport,
    v = (t, e) => t,
    b = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? g : null;
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
    w = (t, e) => !c(t, e),
    x = {
      attribute: !0,
      type: String,
      converter: b,
      reflect: !1,
      hasChanged: w
    };
  Symbol.metadata ??= Symbol("metadata"), m.litPropertyMetadata ??= new WeakMap();
  class S extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = x) {
      if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
        const i = Symbol(),
          s = this.getPropertyDescriptor(t, i, e);
        void 0 !== s && h(this.prototype, t, s);
      }
    }
    static getPropertyDescriptor(t, e, i) {
      const {
        get: s,
        set: r
      } = l(this.prototype, t) ?? {
        get() {
          return this[e];
        },
        set(t) {
          this[e] = t;
        }
      };
      return {
        get() {
          return s?.call(this);
        },
        set(e) {
          const n = s?.call(this);
          r.call(this, e), this.requestUpdate(t, n, i);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? x;
    }
    static _$Ei() {
      if (this.hasOwnProperty(v("elementProperties"))) return;
      const t = f(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(v("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(v("properties"))) {
        const t = this.properties,
          e = [...u(t), ...p(t)];
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
        for (const t of i) e.unshift(d(t));
      } else void 0 !== t && e.push(d(t));
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
        if (s) t.adoptedStyleSheets = e.map(t => t instanceof CSSStyleSheet ? t : t.styleSheet);else for (const s of e) {
          const e = document.createElement("style"),
            r = i.litNonce;
          void 0 !== r && e.setAttribute("nonce", r), e.textContent = s.cssText, t.appendChild(e);
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
        s = this.constructor._$Eu(t, i);
      if (void 0 !== s && !0 === i.reflect) {
        const r = (void 0 !== i.converter?.toAttribute ? i.converter : b).toAttribute(e, i.type);
        this._$Em = t, null == r ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
      }
    }
    _$AK(t, e) {
      const i = this.constructor,
        s = i._$Eh.get(t);
      if (void 0 !== s && this._$Em !== s) {
        const t = i.getPropertyOptions(s),
          r = "function" == typeof t.converter ? {
            fromAttribute: t.converter
          } : void 0 !== t.converter?.fromAttribute ? t.converter : b;
        this._$Em = s, this[s] = r.fromAttribute(e, t.type), this._$Em = null;
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? w)(this[t], e)) return;
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
  S.elementStyles = [], S.shadowRootOptions = {
    mode: "open"
  }, S[v("elementProperties")] = new Map(), S[v("finalized")] = new Map(), _?.({
    ReactiveElement: S
  }), (m.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const $ = globalThis,
    k = $.trustedTypes,
    A = k ? k.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    M = "$lit$",
    E = `lit$${Math.random().toFixed(9).slice(2)}$`,
    O = "?" + E,
    D = `<${O}>`,
    C = document,
    P = () => C.createComment(""),
    Y = t => null === t || "object" != typeof t && "function" != typeof t,
    T = Array.isArray,
    I = t => T(t) || "function" == typeof t?.[Symbol.iterator],
    N = "[ \t\n\f\r]",
    U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    H = /-->/g,
    R = />/g,
    L = RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    j = /'/g,
    W = /"/g,
    z = /^(?:script|style|textarea|title)$/i,
    F = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    V = Symbol.for("lit-noChange"),
    G = Symbol.for("lit-nothing"),
    B = new WeakMap(),
    Z = C.createTreeWalker(C, 129);
  function q(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== A ? A.createHTML(e) : e;
  }
  const J = (t, e) => {
    const i = t.length - 1,
      s = [];
    let r,
      n = 2 === e ? "<svg>" : "",
      o = U;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        d,
        c = -1,
        h = 0;
      for (; h < i.length && (o.lastIndex = h, d = o.exec(i), null !== d);) h = o.lastIndex, o === U ? "!--" === d[1] ? o = H : void 0 !== d[1] ? o = R : void 0 !== d[2] ? (z.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = L) : void 0 !== d[3] && (o = L) : o === L ? ">" === d[0] ? (o = r ?? U, c = -1) : void 0 === d[1] ? c = -2 : (c = o.lastIndex - d[2].length, a = d[1], o = void 0 === d[3] ? L : '"' === d[3] ? W : j) : o === W || o === j ? o = L : o === H || o === R ? o = U : (o = L, r = void 0);
      const l = o === L && t[e + 1].startsWith("/>") ? " " : "";
      n += o === U ? i + D : c >= 0 ? (s.push(a), i.slice(0, c) + M + i.slice(c) + E + l) : i + E + (-2 === c ? e : l);
    }
    return [q(t, n + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), s];
  };
  class K {
    constructor({
      strings: t,
      _$litType$: e
    }, i) {
      let s;
      this.parts = [];
      let r = 0,
        n = 0;
      const o = t.length - 1,
        a = this.parts,
        [d, c] = J(t, e);
      if (this.el = K.createElement(d, i), Z.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (s = Z.nextNode()) && a.length < o;) {
        if (1 === s.nodeType) {
          if (s.hasAttributes()) for (const t of s.getAttributeNames()) if (t.endsWith(M)) {
            const e = c[n++],
              i = s.getAttribute(t).split(E),
              o = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: r,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? it : "?" === o[1] ? st : "@" === o[1] ? rt : et
            }), s.removeAttribute(t);
          } else t.startsWith(E) && (a.push({
            type: 6,
            index: r
          }), s.removeAttribute(t));
          if (z.test(s.tagName)) {
            const t = s.textContent.split(E),
              e = t.length - 1;
            if (e > 0) {
              s.textContent = k ? k.emptyScript : "";
              for (let i = 0; i < e; i++) s.append(t[i], P()), Z.nextNode(), a.push({
                type: 2,
                index: ++r
              });
              s.append(t[e], P());
            }
          }
        } else if (8 === s.nodeType) if (s.data === O) a.push({
          type: 2,
          index: r
        });else {
          let t = -1;
          for (; -1 !== (t = s.data.indexOf(E, t + 1));) a.push({
            type: 7,
            index: r
          }), t += E.length - 1;
        }
        r++;
      }
    }
    static createElement(t, e) {
      const i = C.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function Q(t, e, i = t, s) {
    if (e === V) return e;
    let r = void 0 !== s ? i._$Co?.[s] : i._$Cl;
    const n = Y(e) ? void 0 : e._$litDirective$;
    return r?.constructor !== n && (r?._$AO?.(!1), void 0 === n ? r = void 0 : (r = new n(t), r._$AT(t, i, s)), void 0 !== s ? (i._$Co ??= [])[s] = r : i._$Cl = r), void 0 !== r && (e = Q(t, r._$AS(t, e.values), r, s)), e;
  }
  class X {
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
        s = (t?.creationScope ?? C).importNode(e, !0);
      Z.currentNode = s;
      let r = Z.nextNode(),
        n = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (n === a.index) {
          let e;
          2 === a.type ? e = new tt(r, r.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(r, a.name, a.strings, this, t) : 6 === a.type && (e = new nt(r, this, t)), this._$AV.push(e), a = i[++o];
        }
        n !== a?.index && (r = Z.nextNode(), n++);
      }
      return Z.currentNode = C, s;
    }
    p(t) {
      let e = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
    }
  }
  class tt {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, i, s) {
      this.type = 2, this._$AH = G, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
      t = Q(this, t, e), Y(t) ? t === G || null == t || "" === t ? (this._$AH !== G && this._$AR(), this._$AH = G) : t !== this._$AH && t !== V && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : I(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== G && Y(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        s = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = K.createElement(q(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === s) this._$AH.p(e);else {
        const t = new X(s, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = B.get(t.strings);
      return void 0 === e && B.set(t.strings, e = new K(t)), e;
    }
    k(t) {
      T(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        s = 0;
      for (const r of t) s === e.length ? e.push(i = new tt(this.S(P()), this.S(P()), this, this.options)) : i = e[s], i._$AI(r), s++;
      s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
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
  class et {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, i, s, r) {
      this.type = 1, this._$AH = G, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = G;
    }
    _$AI(t, e = this, i, s) {
      const r = this.strings;
      let n = !1;
      if (void 0 === r) t = Q(this, t, e, 0), n = !Y(t) || t !== this._$AH && t !== V, n && (this._$AH = t);else {
        const s = t;
        let o, a;
        for (t = r[0], o = 0; o < r.length - 1; o++) a = Q(this, s[i + o], e, o), a === V && (a = this._$AH[o]), n ||= !Y(a) || a !== this._$AH[o], a === G ? t = G : t !== G && (t += (a ?? "") + r[o + 1]), this._$AH[o] = a;
      }
      n && !s && this.j(t);
    }
    j(t) {
      t === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class it extends et {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === G ? void 0 : t;
    }
  }
  class st extends et {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== G);
    }
  }
  class rt extends et {
    constructor(t, e, i, s, r) {
      super(t, e, i, s, r), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = Q(this, t, e, 0) ?? G) === V) return;
      const i = this._$AH,
        s = t === G && i !== G || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        r = t !== G && (i === G || s);
      s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class nt {
    constructor(t, e, i) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      Q(this, t);
    }
  }
  const ot = {
      P: M,
      A: E,
      C: O,
      M: 1,
      L: J,
      R: X,
      D: I,
      V: Q,
      I: tt,
      H: et,
      N: st,
      U: rt,
      B: it,
      F: nt
    },
    at = $.litHtmlPolyfillSupport;
  at?.(K, tt), ($.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class dt extends S {
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
        const s = i?.renderBefore ?? e;
        let r = s._$litPart$;
        if (void 0 === r) {
          const t = i?.renderBefore ?? null;
          s._$litPart$ = r = new tt(e.insertBefore(P(), t), t, void 0, i ?? {});
        }
        return r._$AI(t), r;
      })(e, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
      return V;
    }
  }
  dt._$litElement$ = !0, dt.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: dt
  });
  const ct = globalThis.litElementPolyfillSupport;
  ct?.({
    LitElement: dt
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const ht = t => (e, i) => {
      void 0 !== i ? i.addInitializer(() => {
        customElements.define(t, e);
      }) : customElements.define(t, e);
    }
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    lt = {
      attribute: !0,
      type: String,
      converter: b,
      reflect: !1,
      hasChanged: w
    },
    ut = (t = lt, e, i) => {
      const {
        kind: s,
        metadata: r
      } = i;
      let n = globalThis.litPropertyMetadata.get(r);
      if (void 0 === n && globalThis.litPropertyMetadata.set(r, n = new Map()), n.set(i.name, t), "accessor" === s) {
        const {
          name: s
        } = i;
        return {
          set(i) {
            const r = e.get.call(this);
            e.set.call(this, i), this.requestUpdate(s, r, t);
          },
          init(e) {
            return void 0 !== e && this.P(s, void 0, t), e;
          }
        };
      }
      if ("setter" === s) {
        const {
          name: s
        } = i;
        return function (i) {
          const r = this[s];
          e.call(this, i), this.requestUpdate(s, r, t);
        };
      }
      throw Error("Unsupported decorator location: " + s);
    };
  function pt(t) {
    return (e, i) => "object" == typeof i ? ut(t, e, i) : ((t, e, i) => {
      const s = e.hasOwnProperty(i);
      return e.constructor.createProperty(i, s ? {
        ...t,
        wrapped: !0
      } : t), s ? Object.getOwnPropertyDescriptor(e, i) : void 0;
    })(t, e, i);
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function ft(t) {
    return pt({
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
  const mt = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && "object" != typeof e && Object.defineProperty(t, e, i), i)
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */;
  function yt(t, e) {
    return (i, s, r) => {
      const n = e => e.renderRoot?.querySelector(t) ?? null;
      if (e) {
        const {
          get: t,
          set: e
        } = "object" == typeof s ? i : r ?? (() => {
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
        return mt(i, s, {
          get() {
            let i = t.call(this);
            return void 0 === i && (i = n(this), (null !== i || this.hasUpdated) && e.call(this, i)), i;
          }
        });
      }
      return mt(i, s, {
        get() {
          return n(this);
        }
      });
    };
  }
  "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
  function gt(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  function _t(t) {
    throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var vt,
    bt = {
      exports: {}
    };
  (vt = bt).exports = function () {
    var t, e;
    function i() {
      return t.apply(null, arguments);
    }
    function s(e) {
      t = e;
    }
    function r(t) {
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
    function d(t) {
      return void 0 === t;
    }
    function c(t) {
      return "number" == typeof t || "[object Number]" === Object.prototype.toString.call(t);
    }
    function h(t) {
      return t instanceof Date || "[object Date]" === Object.prototype.toString.call(t);
    }
    function l(t, e) {
      var i,
        s = [],
        r = t.length;
      for (i = 0; i < r; ++i) s.push(e(t[i], i));
      return s;
    }
    function u(t, e) {
      for (var i in e) o(e, i) && (t[i] = e[i]);
      return o(e, "toString") && (t.toString = e.toString), o(e, "valueOf") && (t.valueOf = e.valueOf), t;
    }
    function p(t, e, i, s) {
      return Zi(t, e, i, s, !0).utc();
    }
    function f() {
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
      return null == t._pf && (t._pf = f()), t._pf;
    }
    function y(t) {
      var i = null,
        s = !1,
        r = t._d && !isNaN(t._d.getTime());
      return r && (i = m(t), s = e.call(i.parsedDateParts, function (t) {
        return null != t;
      }), r = i.overflow < 0 && !i.empty && !i.invalidEra && !i.invalidMonth && !i.invalidWeekday && !i.weekdayMismatch && !i.nullInput && !i.invalidFormat && !i.userInvalidated && (!i.meridiem || i.meridiem && s), t._strict && (r = r && 0 === i.charsLeftOver && 0 === i.unusedTokens.length && void 0 === i.bigHour)), null != Object.isFrozen && Object.isFrozen(t) ? r : (t._isValid = r, t._isValid);
    }
    function g(t) {
      var e = p(NaN);
      return null != t ? u(m(e), t) : m(e).userInvalidated = !0, e;
    }
    e = Array.prototype.some ? Array.prototype.some : function (t) {
      var e,
        i = Object(this),
        s = i.length >>> 0;
      for (e = 0; e < s; e++) if (e in i && t.call(this, i[e], e, i)) return !0;
      return !1;
    };
    var _ = i.momentProperties = [],
      v = !1;
    function b(t, e) {
      var i,
        s,
        r,
        n = _.length;
      if (d(e._isAMomentObject) || (t._isAMomentObject = e._isAMomentObject), d(e._i) || (t._i = e._i), d(e._f) || (t._f = e._f), d(e._l) || (t._l = e._l), d(e._strict) || (t._strict = e._strict), d(e._tzm) || (t._tzm = e._tzm), d(e._isUTC) || (t._isUTC = e._isUTC), d(e._offset) || (t._offset = e._offset), d(e._pf) || (t._pf = m(e)), d(e._locale) || (t._locale = e._locale), n > 0) for (i = 0; i < n; i++) d(r = e[s = _[i]]) || (t[s] = r);
      return t;
    }
    function w(t) {
      b(this, t), this._d = new Date(null != t._d ? t._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === v && (v = !0, i.updateOffset(this), v = !1);
    }
    function x(t) {
      return t instanceof w || null != t && null != t._isAMomentObject;
    }
    function S(t) {
      !1 === i.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t);
    }
    function $(t, e) {
      var s = !0;
      return u(function () {
        if (null != i.deprecationHandler && i.deprecationHandler(null, t), s) {
          var r,
            n,
            a,
            d = [],
            c = arguments.length;
          for (n = 0; n < c; n++) {
            if (r = "", "object" == typeof arguments[n]) {
              for (a in r += "\n[" + n + "] ", arguments[0]) o(arguments[0], a) && (r += a + ": " + arguments[0][a] + ", ");
              r = r.slice(0, -2);
            } else r = arguments[n];
            d.push(r);
          }
          S(t + "\nArguments: " + Array.prototype.slice.call(d).join("") + "\n" + new Error().stack), s = !1;
        }
        return e.apply(this, arguments);
      }, e);
    }
    var k,
      A = {};
    function M(t, e) {
      null != i.deprecationHandler && i.deprecationHandler(t, e), A[t] || (S(e), A[t] = !0);
    }
    function E(t) {
      return "undefined" != typeof Function && t instanceof Function || "[object Function]" === Object.prototype.toString.call(t);
    }
    function O(t) {
      var e, i;
      for (i in t) o(t, i) && (E(e = t[i]) ? this[i] = e : this["_" + i] = e);
      this._config = t, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function D(t, e) {
      var i,
        s = u({}, t);
      for (i in e) o(e, i) && (n(t[i]) && n(e[i]) ? (s[i] = {}, u(s[i], t[i]), u(s[i], e[i])) : null != e[i] ? s[i] = e[i] : delete s[i]);
      for (i in t) o(t, i) && !o(e, i) && n(t[i]) && (s[i] = u({}, s[i]));
      return s;
    }
    function C(t) {
      null != t && this.set(t);
    }
    i.suppressDeprecationWarnings = !1, i.deprecationHandler = null, k = Object.keys ? Object.keys : function (t) {
      var e,
        i = [];
      for (e in t) o(t, e) && i.push(e);
      return i;
    };
    var P = {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    };
    function Y(t, e, i) {
      var s = this._calendar[t] || this._calendar.sameElse;
      return E(s) ? s.call(e, i) : s;
    }
    function T(t, e, i) {
      var s = "" + Math.abs(t),
        r = e - s.length;
      return (t >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + s;
    }
    var I = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      N = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      U = {},
      H = {};
    function R(t, e, i, s) {
      var r = s;
      "string" == typeof s && (r = function () {
        return this[s]();
      }), t && (H[t] = r), e && (H[e[0]] = function () {
        return T(r.apply(this, arguments), e[1], e[2]);
      }), i && (H[i] = function () {
        return this.localeData().ordinal(r.apply(this, arguments), t);
      });
    }
    function L(t) {
      return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
    }
    function j(t) {
      var e,
        i,
        s = t.match(I);
      for (e = 0, i = s.length; e < i; e++) H[s[e]] ? s[e] = H[s[e]] : s[e] = L(s[e]);
      return function (e) {
        var r,
          n = "";
        for (r = 0; r < i; r++) n += E(s[r]) ? s[r].call(e, t) : s[r];
        return n;
      };
    }
    function W(t, e) {
      return t.isValid() ? (e = z(e, t.localeData()), U[e] = U[e] || j(e), U[e](t)) : t.localeData().invalidDate();
    }
    function z(t, e) {
      var i = 5;
      function s(t) {
        return e.longDateFormat(t) || t;
      }
      for (N.lastIndex = 0; i >= 0 && N.test(t);) t = t.replace(N, s), N.lastIndex = 0, i -= 1;
      return t;
    }
    var F = {
      LTS: "h:mm:ss A",
      LT: "h:mm A",
      L: "MM/DD/YYYY",
      LL: "MMMM D, YYYY",
      LLL: "MMMM D, YYYY h:mm A",
      LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    function V(t) {
      var e = this._longDateFormat[t],
        i = this._longDateFormat[t.toUpperCase()];
      return e || !i ? e : (this._longDateFormat[t] = i.match(I).map(function (t) {
        return "MMMM" === t || "MM" === t || "DD" === t || "dddd" === t ? t.slice(1) : t;
      }).join(""), this._longDateFormat[t]);
    }
    var G = "Invalid date";
    function B() {
      return this._invalidDate;
    }
    var Z = "%d",
      q = /\d{1,2}/;
    function J(t) {
      return this._ordinal.replace("%d", t);
    }
    var K = {
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
    function Q(t, e, i, s) {
      var r = this._relativeTime[i];
      return E(r) ? r(t, e, i, s) : r.replace(/%d/i, t);
    }
    function X(t, e) {
      var i = this._relativeTime[t > 0 ? "future" : "past"];
      return E(i) ? i(e) : i.replace(/%s/i, e);
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
        s = {};
      for (i in t) o(t, i) && (e = et(i)) && (s[e] = t[i]);
      return s;
    }
    var st = {
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
    function rt(t) {
      var e,
        i = [];
      for (e in t) o(t, e) && i.push({
        unit: e,
        priority: st[e]
      });
      return i.sort(function (t, e) {
        return t.priority - e.priority;
      }), i;
    }
    var nt,
      ot = /\d/,
      at = /\d\d/,
      dt = /\d{3}/,
      ct = /\d{4}/,
      ht = /[+-]?\d{6}/,
      lt = /\d\d?/,
      ut = /\d\d\d\d?/,
      pt = /\d\d\d\d\d\d?/,
      ft = /\d{1,3}/,
      mt = /\d{1,4}/,
      yt = /[+-]?\d{1,6}/,
      gt = /\d+/,
      bt = /[+-]?\d+/,
      wt = /Z|[+-]\d\d:?\d\d/gi,
      xt = /Z|[+-]\d\d(?::?\d\d)?/gi,
      St = /[+-]?\d+(\.\d{1,3})?/,
      $t = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      kt = /^[1-9]\d?/,
      At = /^([1-9]\d|\d)/;
    function Mt(t, e, i) {
      nt[t] = E(e) ? e : function (t, s) {
        return t && i ? i : e;
      };
    }
    function Et(t, e) {
      return o(nt, t) ? nt[t](e._strict, e._locale) : new RegExp(Ot(t));
    }
    function Ot(t) {
      return Dt(t.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (t, e, i, s, r) {
        return e || i || s || r;
      }));
    }
    function Dt(t) {
      return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function Ct(t) {
      return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
    }
    function Pt(t) {
      var e = +t,
        i = 0;
      return 0 !== e && isFinite(e) && (i = Ct(e)), i;
    }
    nt = {};
    var Yt = {};
    function Tt(t, e) {
      var i,
        s,
        r = e;
      for ("string" == typeof t && (t = [t]), c(e) && (r = function (t, i) {
        i[e] = Pt(t);
      }), s = t.length, i = 0; i < s; i++) Yt[t[i]] = r;
    }
    function It(t, e) {
      Tt(t, function (t, i, s, r) {
        s._w = s._w || {}, e(t, s._w, s, r);
      });
    }
    function Nt(t, e, i) {
      null != e && o(Yt, t) && Yt[t](e, i._a, i, t);
    }
    function Ut(t) {
      return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
    }
    var Ht = 0,
      Rt = 1,
      Lt = 2,
      jt = 3,
      Wt = 4,
      zt = 5,
      Ft = 6,
      Vt = 7,
      Gt = 8;
    function Bt(t) {
      return Ut(t) ? 366 : 365;
    }
    R("Y", 0, 0, function () {
      var t = this.year();
      return t <= 9999 ? T(t, 4) : "+" + t;
    }), R(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    }), R(0, ["YYYY", 4], 0, "year"), R(0, ["YYYYY", 5], 0, "year"), R(0, ["YYYYYY", 6, !0], 0, "year"), Mt("Y", bt), Mt("YY", lt, at), Mt("YYYY", mt, ct), Mt("YYYYY", yt, ht), Mt("YYYYYY", yt, ht), Tt(["YYYYY", "YYYYYY"], Ht), Tt("YYYY", function (t, e) {
      e[Ht] = 2 === t.length ? i.parseTwoDigitYear(t) : Pt(t);
    }), Tt("YY", function (t, e) {
      e[Ht] = i.parseTwoDigitYear(t);
    }), Tt("Y", function (t, e) {
      e[Ht] = parseInt(t, 10);
    }), i.parseTwoDigitYear = function (t) {
      return Pt(t) + (Pt(t) > 68 ? 1900 : 2e3);
    };
    var Zt,
      qt = Kt("FullYear", !0);
    function Jt() {
      return Ut(this.year());
    }
    function Kt(t, e) {
      return function (s) {
        return null != s ? (Xt(this, t, s), i.updateOffset(this, e), this) : Qt(this, t);
      };
    }
    function Qt(t, e) {
      if (!t.isValid()) return NaN;
      var i = t._d,
        s = t._isUTC;
      switch (e) {
        case "Milliseconds":
          return s ? i.getUTCMilliseconds() : i.getMilliseconds();
        case "Seconds":
          return s ? i.getUTCSeconds() : i.getSeconds();
        case "Minutes":
          return s ? i.getUTCMinutes() : i.getMinutes();
        case "Hours":
          return s ? i.getUTCHours() : i.getHours();
        case "Date":
          return s ? i.getUTCDate() : i.getDate();
        case "Day":
          return s ? i.getUTCDay() : i.getDay();
        case "Month":
          return s ? i.getUTCMonth() : i.getMonth();
        case "FullYear":
          return s ? i.getUTCFullYear() : i.getFullYear();
        default:
          return NaN;
      }
    }
    function Xt(t, e, i) {
      var s, r, n, o, a;
      if (t.isValid() && !isNaN(i)) {
        switch (s = t._d, r = t._isUTC, e) {
          case "Milliseconds":
            return void (r ? s.setUTCMilliseconds(i) : s.setMilliseconds(i));
          case "Seconds":
            return void (r ? s.setUTCSeconds(i) : s.setSeconds(i));
          case "Minutes":
            return void (r ? s.setUTCMinutes(i) : s.setMinutes(i));
          case "Hours":
            return void (r ? s.setUTCHours(i) : s.setHours(i));
          case "Date":
            return void (r ? s.setUTCDate(i) : s.setDate(i));
          case "FullYear":
            break;
          default:
            return;
        }
        n = i, o = t.month(), a = 29 !== (a = t.date()) || 1 !== o || Ut(n) ? a : 28, r ? s.setUTCFullYear(n, o, a) : s.setFullYear(n, o, a);
      }
    }
    function te(t) {
      return E(this[t = et(t)]) ? this[t]() : this;
    }
    function ee(t, e) {
      if ("object" == typeof t) {
        var i,
          s = rt(t = it(t)),
          r = s.length;
        for (i = 0; i < r; i++) this[s[i].unit](t[s[i].unit]);
      } else if (E(this[t = et(t)])) return this[t](e);
      return this;
    }
    function ie(t, e) {
      return (t % e + e) % e;
    }
    function se(t, e) {
      if (isNaN(t) || isNaN(e)) return NaN;
      var i = ie(e, 12);
      return t += (e - i) / 12, 1 === i ? Ut(t) ? 29 : 28 : 31 - i % 7 % 2;
    }
    Zt = Array.prototype.indexOf ? Array.prototype.indexOf : function (t) {
      var e;
      for (e = 0; e < this.length; ++e) if (this[e] === t) return e;
      return -1;
    }, R("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    }), R("MMM", 0, 0, function (t) {
      return this.localeData().monthsShort(this, t);
    }), R("MMMM", 0, 0, function (t) {
      return this.localeData().months(this, t);
    }), Mt("M", lt, kt), Mt("MM", lt, at), Mt("MMM", function (t, e) {
      return e.monthsShortRegex(t);
    }), Mt("MMMM", function (t, e) {
      return e.monthsRegex(t);
    }), Tt(["M", "MM"], function (t, e) {
      e[Rt] = Pt(t) - 1;
    }), Tt(["MMM", "MMMM"], function (t, e, i, s) {
      var r = i._locale.monthsParse(t, s, i._strict);
      null != r ? e[Rt] = r : m(i).invalidMonth = t;
    });
    var re = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
      ne = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      oe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      ae = $t,
      de = $t;
    function ce(t, e) {
      return t ? r(this._months) ? this._months[t.month()] : this._months[(this._months.isFormat || oe).test(e) ? "format" : "standalone"][t.month()] : r(this._months) ? this._months : this._months.standalone;
    }
    function he(t, e) {
      return t ? r(this._monthsShort) ? this._monthsShort[t.month()] : this._monthsShort[oe.test(e) ? "format" : "standalone"][t.month()] : r(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }
    function le(t, e, i) {
      var s,
        r,
        n,
        o = t.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s) n = p([2e3, s]), this._shortMonthsParse[s] = this.monthsShort(n, "").toLocaleLowerCase(), this._longMonthsParse[s] = this.months(n, "").toLocaleLowerCase();
      return i ? "MMM" === e ? -1 !== (r = Zt.call(this._shortMonthsParse, o)) ? r : null : -1 !== (r = Zt.call(this._longMonthsParse, o)) ? r : null : "MMM" === e ? -1 !== (r = Zt.call(this._shortMonthsParse, o)) || -1 !== (r = Zt.call(this._longMonthsParse, o)) ? r : null : -1 !== (r = Zt.call(this._longMonthsParse, o)) || -1 !== (r = Zt.call(this._shortMonthsParse, o)) ? r : null;
    }
    function ue(t, e, i) {
      var s, r, n;
      if (this._monthsParseExact) return le.call(this, t, e, i);
      for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), s = 0; s < 12; s++) {
        if (r = p([2e3, s]), i && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(r, "").replace(".", "") + "$", "i"), this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(r, "").replace(".", "") + "$", "i")), i || this._monthsParse[s] || (n = "^" + this.months(r, "") + "|^" + this.monthsShort(r, ""), this._monthsParse[s] = new RegExp(n.replace(".", ""), "i")), i && "MMMM" === e && this._longMonthsParse[s].test(t)) return s;
        if (i && "MMM" === e && this._shortMonthsParse[s].test(t)) return s;
        if (!i && this._monthsParse[s].test(t)) return s;
      }
    }
    function pe(t, e) {
      if (!t.isValid()) return t;
      if ("string" == typeof e) if (/^\d+$/.test(e)) e = Pt(e);else if (!c(e = t.localeData().monthsParse(e))) return t;
      var i = e,
        s = t.date();
      return s = s < 29 ? s : Math.min(s, se(t.year(), i)), t._isUTC ? t._d.setUTCMonth(i, s) : t._d.setMonth(i, s), t;
    }
    function fe(t) {
      return null != t ? (pe(this, t), i.updateOffset(this, !0), this) : Qt(this, "Month");
    }
    function me() {
      return se(this.year(), this.month());
    }
    function ye(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsShortStrictRegex : this._monthsShortRegex) : (o(this, "_monthsShortRegex") || (this._monthsShortRegex = ae), this._monthsShortStrictRegex && t ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }
    function ge(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsStrictRegex : this._monthsRegex) : (o(this, "_monthsRegex") || (this._monthsRegex = de), this._monthsStrictRegex && t ? this._monthsStrictRegex : this._monthsRegex);
    }
    function _e() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        s,
        r,
        n = [],
        o = [],
        a = [];
      for (e = 0; e < 12; e++) i = p([2e3, e]), s = Dt(this.monthsShort(i, "")), r = Dt(this.months(i, "")), n.push(s), o.push(r), a.push(r), a.push(s);
      n.sort(t), o.sort(t), a.sort(t), this._monthsRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + n.join("|") + ")", "i");
    }
    function ve(t, e, i, s, r, n, o) {
      var a;
      return t < 100 && t >= 0 ? (a = new Date(t + 400, e, i, s, r, n, o), isFinite(a.getFullYear()) && a.setFullYear(t)) : a = new Date(t, e, i, s, r, n, o), a;
    }
    function be(t) {
      var e, i;
      return t < 100 && t >= 0 ? ((i = Array.prototype.slice.call(arguments))[0] = t + 400, e = new Date(Date.UTC.apply(null, i)), isFinite(e.getUTCFullYear()) && e.setUTCFullYear(t)) : e = new Date(Date.UTC.apply(null, arguments)), e;
    }
    function we(t, e, i) {
      var s = 7 + e - i;
      return -(7 + be(t, 0, s).getUTCDay() - e) % 7 + s - 1;
    }
    function xe(t, e, i, s, r) {
      var n,
        o,
        a = 1 + 7 * (e - 1) + (7 + i - s) % 7 + we(t, s, r);
      return a <= 0 ? o = Bt(n = t - 1) + a : a > Bt(t) ? (n = t + 1, o = a - Bt(t)) : (n = t, o = a), {
        year: n,
        dayOfYear: o
      };
    }
    function Se(t, e, i) {
      var s,
        r,
        n = we(t.year(), e, i),
        o = Math.floor((t.dayOfYear() - n - 1) / 7) + 1;
      return o < 1 ? s = o + $e(r = t.year() - 1, e, i) : o > $e(t.year(), e, i) ? (s = o - $e(t.year(), e, i), r = t.year() + 1) : (r = t.year(), s = o), {
        week: s,
        year: r
      };
    }
    function $e(t, e, i) {
      var s = we(t, e, i),
        r = we(t + 1, e, i);
      return (Bt(t) - s + r) / 7;
    }
    function ke(t) {
      return Se(t, this._week.dow, this._week.doy).week;
    }
    R("w", ["ww", 2], "wo", "week"), R("W", ["WW", 2], "Wo", "isoWeek"), Mt("w", lt, kt), Mt("ww", lt, at), Mt("W", lt, kt), Mt("WW", lt, at), It(["w", "ww", "W", "WW"], function (t, e, i, s) {
      e[s.substr(0, 1)] = Pt(t);
    });
    var Ae = {
      dow: 0,
      doy: 6
    };
    function Me() {
      return this._week.dow;
    }
    function Ee() {
      return this._week.doy;
    }
    function Oe(t) {
      var e = this.localeData().week(this);
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function De(t) {
      var e = Se(this, 1, 4).week;
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function Ce(t, e) {
      return "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = e.weekdaysParse(t)) ? t : null : parseInt(t, 10);
    }
    function Pe(t, e) {
      return "string" == typeof t ? e.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t;
    }
    function Ye(t, e) {
      return t.slice(e, 7).concat(t.slice(0, e));
    }
    R("d", 0, "do", "day"), R("dd", 0, 0, function (t) {
      return this.localeData().weekdaysMin(this, t);
    }), R("ddd", 0, 0, function (t) {
      return this.localeData().weekdaysShort(this, t);
    }), R("dddd", 0, 0, function (t) {
      return this.localeData().weekdays(this, t);
    }), R("e", 0, 0, "weekday"), R("E", 0, 0, "isoWeekday"), Mt("d", lt), Mt("e", lt), Mt("E", lt), Mt("dd", function (t, e) {
      return e.weekdaysMinRegex(t);
    }), Mt("ddd", function (t, e) {
      return e.weekdaysShortRegex(t);
    }), Mt("dddd", function (t, e) {
      return e.weekdaysRegex(t);
    }), It(["dd", "ddd", "dddd"], function (t, e, i, s) {
      var r = i._locale.weekdaysParse(t, s, i._strict);
      null != r ? e.d = r : m(i).invalidWeekday = t;
    }), It(["d", "e", "E"], function (t, e, i, s) {
      e[s] = Pt(t);
    });
    var Te = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      Ie = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      Ne = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      Ue = $t,
      He = $t,
      Re = $t;
    function Le(t, e) {
      var i = r(this._weekdays) ? this._weekdays : this._weekdays[t && !0 !== t && this._weekdays.isFormat.test(e) ? "format" : "standalone"];
      return !0 === t ? Ye(i, this._week.dow) : t ? i[t.day()] : i;
    }
    function je(t) {
      return !0 === t ? Ye(this._weekdaysShort, this._week.dow) : t ? this._weekdaysShort[t.day()] : this._weekdaysShort;
    }
    function We(t) {
      return !0 === t ? Ye(this._weekdaysMin, this._week.dow) : t ? this._weekdaysMin[t.day()] : this._weekdaysMin;
    }
    function ze(t, e, i) {
      var s,
        r,
        n,
        o = t.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s) n = p([2e3, 1]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(n, "").toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(n, "").toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(n, "").toLocaleLowerCase();
      return i ? "dddd" === e ? -1 !== (r = Zt.call(this._weekdaysParse, o)) ? r : null : "ddd" === e ? -1 !== (r = Zt.call(this._shortWeekdaysParse, o)) ? r : null : -1 !== (r = Zt.call(this._minWeekdaysParse, o)) ? r : null : "dddd" === e ? -1 !== (r = Zt.call(this._weekdaysParse, o)) || -1 !== (r = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (r = Zt.call(this._minWeekdaysParse, o)) ? r : null : "ddd" === e ? -1 !== (r = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (r = Zt.call(this._weekdaysParse, o)) || -1 !== (r = Zt.call(this._minWeekdaysParse, o)) ? r : null : -1 !== (r = Zt.call(this._minWeekdaysParse, o)) || -1 !== (r = Zt.call(this._weekdaysParse, o)) || -1 !== (r = Zt.call(this._shortWeekdaysParse, o)) ? r : null;
    }
    function Fe(t, e, i) {
      var s, r, n;
      if (this._weekdaysParseExact) return ze.call(this, t, e, i);
      for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), s = 0; s < 7; s++) {
        if (r = p([2e3, 1]).day(s), i && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(r, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(r, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(r, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[s] || (n = "^" + this.weekdays(r, "") + "|^" + this.weekdaysShort(r, "") + "|^" + this.weekdaysMin(r, ""), this._weekdaysParse[s] = new RegExp(n.replace(".", ""), "i")), i && "dddd" === e && this._fullWeekdaysParse[s].test(t)) return s;
        if (i && "ddd" === e && this._shortWeekdaysParse[s].test(t)) return s;
        if (i && "dd" === e && this._minWeekdaysParse[s].test(t)) return s;
        if (!i && this._weekdaysParse[s].test(t)) return s;
      }
    }
    function Ve(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = Qt(this, "Day");
      return null != t ? (t = Ce(t, this.localeData()), this.add(t - e, "d")) : e;
    }
    function Ge(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == t ? e : this.add(t - e, "d");
    }
    function Be(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        var e = Pe(t, this.localeData());
        return this.day(this.day() % 7 ? e : e - 7);
      }
      return this.day() || 7;
    }
    function Ze(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysStrictRegex : this._weekdaysRegex) : (o(this, "_weekdaysRegex") || (this._weekdaysRegex = Ue), this._weekdaysStrictRegex && t ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }
    function qe(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (o(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = He), this._weekdaysShortStrictRegex && t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }
    function Je(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (o(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Re), this._weekdaysMinStrictRegex && t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
    }
    function Ke() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        s,
        r,
        n,
        o = [],
        a = [],
        d = [],
        c = [];
      for (e = 0; e < 7; e++) i = p([2e3, 1]).day(e), s = Dt(this.weekdaysMin(i, "")), r = Dt(this.weekdaysShort(i, "")), n = Dt(this.weekdays(i, "")), o.push(s), a.push(r), d.push(n), c.push(s), c.push(r), c.push(n);
      o.sort(t), a.sort(t), d.sort(t), c.sort(t), this._weekdaysRegex = new RegExp("^(" + c.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + d.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + o.join("|") + ")", "i");
    }
    function Qe() {
      return this.hours() % 12 || 12;
    }
    function Xe() {
      return this.hours() || 24;
    }
    function ti(t, e) {
      R(t, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), e);
      });
    }
    function ei(t, e) {
      return e._meridiemParse;
    }
    function ii(t) {
      return "p" === (t + "").toLowerCase().charAt(0);
    }
    R("H", ["HH", 2], 0, "hour"), R("h", ["hh", 2], 0, Qe), R("k", ["kk", 2], 0, Xe), R("hmm", 0, 0, function () {
      return "" + Qe.apply(this) + T(this.minutes(), 2);
    }), R("hmmss", 0, 0, function () {
      return "" + Qe.apply(this) + T(this.minutes(), 2) + T(this.seconds(), 2);
    }), R("Hmm", 0, 0, function () {
      return "" + this.hours() + T(this.minutes(), 2);
    }), R("Hmmss", 0, 0, function () {
      return "" + this.hours() + T(this.minutes(), 2) + T(this.seconds(), 2);
    }), ti("a", !0), ti("A", !1), Mt("a", ei), Mt("A", ei), Mt("H", lt, At), Mt("h", lt, kt), Mt("k", lt, kt), Mt("HH", lt, at), Mt("hh", lt, at), Mt("kk", lt, at), Mt("hmm", ut), Mt("hmmss", pt), Mt("Hmm", ut), Mt("Hmmss", pt), Tt(["H", "HH"], jt), Tt(["k", "kk"], function (t, e, i) {
      var s = Pt(t);
      e[jt] = 24 === s ? 0 : s;
    }), Tt(["a", "A"], function (t, e, i) {
      i._isPm = i._locale.isPM(t), i._meridiem = t;
    }), Tt(["h", "hh"], function (t, e, i) {
      e[jt] = Pt(t), m(i).bigHour = !0;
    }), Tt("hmm", function (t, e, i) {
      var s = t.length - 2;
      e[jt] = Pt(t.substr(0, s)), e[Wt] = Pt(t.substr(s)), m(i).bigHour = !0;
    }), Tt("hmmss", function (t, e, i) {
      var s = t.length - 4,
        r = t.length - 2;
      e[jt] = Pt(t.substr(0, s)), e[Wt] = Pt(t.substr(s, 2)), e[zt] = Pt(t.substr(r)), m(i).bigHour = !0;
    }), Tt("Hmm", function (t, e, i) {
      var s = t.length - 2;
      e[jt] = Pt(t.substr(0, s)), e[Wt] = Pt(t.substr(s));
    }), Tt("Hmmss", function (t, e, i) {
      var s = t.length - 4,
        r = t.length - 2;
      e[jt] = Pt(t.substr(0, s)), e[Wt] = Pt(t.substr(s, 2)), e[zt] = Pt(t.substr(r));
    });
    var si = /[ap]\.?m?\.?/i,
      ri = Kt("Hours", !0);
    function ni(t, e, i) {
      return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
    }
    var oi,
      ai = {
        calendar: P,
        longDateFormat: F,
        invalidDate: G,
        ordinal: Z,
        dayOfMonthOrdinalParse: q,
        relativeTime: K,
        months: re,
        monthsShort: ne,
        week: Ae,
        weekdays: Te,
        weekdaysMin: Ne,
        weekdaysShort: Ie,
        meridiemParse: si
      },
      di = {},
      ci = {};
    function hi(t, e) {
      var i,
        s = Math.min(t.length, e.length);
      for (i = 0; i < s; i += 1) if (t[i] !== e[i]) return i;
      return s;
    }
    function li(t) {
      return t ? t.toLowerCase().replace("_", "-") : t;
    }
    function ui(t) {
      for (var e, i, s, r, n = 0; n < t.length;) {
        for (e = (r = li(t[n]).split("-")).length, i = (i = li(t[n + 1])) ? i.split("-") : null; e > 0;) {
          if (s = fi(r.slice(0, e).join("-"))) return s;
          if (i && i.length >= e && hi(r, i) >= e - 1) break;
          e--;
        }
        n++;
      }
      return oi;
    }
    function pi(t) {
      return !(!t || !t.match("^[^/\\\\]*$"));
    }
    function fi(t) {
      var e = null;
      if (void 0 === di[t] && vt && vt.exports && pi(t)) try {
        e = oi._abbr, _t("./locale/" + t), mi(e);
      } catch (e) {
        di[t] = null;
      }
      return di[t];
    }
    function mi(t, e) {
      var i;
      return t && ((i = d(e) ? _i(t) : yi(t, e)) ? oi = i : "undefined" != typeof console && console.warn && console.warn("Locale " + t + " not found. Did you forget to load it?")), oi._abbr;
    }
    function yi(t, e) {
      if (null !== e) {
        var i,
          s = ai;
        if (e.abbr = t, null != di[t]) M("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), s = di[t]._config;else if (null != e.parentLocale) if (null != di[e.parentLocale]) s = di[e.parentLocale]._config;else {
          if (null == (i = fi(e.parentLocale))) return ci[e.parentLocale] || (ci[e.parentLocale] = []), ci[e.parentLocale].push({
            name: t,
            config: e
          }), null;
          s = i._config;
        }
        return di[t] = new C(D(s, e)), ci[t] && ci[t].forEach(function (t) {
          yi(t.name, t.config);
        }), mi(t), di[t];
      }
      return delete di[t], null;
    }
    function gi(t, e) {
      if (null != e) {
        var i,
          s,
          r = ai;
        null != di[t] && null != di[t].parentLocale ? di[t].set(D(di[t]._config, e)) : (null != (s = fi(t)) && (r = s._config), e = D(r, e), null == s && (e.abbr = t), (i = new C(e)).parentLocale = di[t], di[t] = i), mi(t);
      } else null != di[t] && (null != di[t].parentLocale ? (di[t] = di[t].parentLocale, t === mi() && mi(t)) : null != di[t] && delete di[t]);
      return di[t];
    }
    function _i(t) {
      var e;
      if (t && t._locale && t._locale._abbr && (t = t._locale._abbr), !t) return oi;
      if (!r(t)) {
        if (e = fi(t)) return e;
        t = [t];
      }
      return ui(t);
    }
    function vi() {
      return k(di);
    }
    function bi(t) {
      var e,
        i = t._a;
      return i && -2 === m(t).overflow && (e = i[Rt] < 0 || i[Rt] > 11 ? Rt : i[Lt] < 1 || i[Lt] > se(i[Ht], i[Rt]) ? Lt : i[jt] < 0 || i[jt] > 24 || 24 === i[jt] && (0 !== i[Wt] || 0 !== i[zt] || 0 !== i[Ft]) ? jt : i[Wt] < 0 || i[Wt] > 59 ? Wt : i[zt] < 0 || i[zt] > 59 ? zt : i[Ft] < 0 || i[Ft] > 999 ? Ft : -1, m(t)._overflowDayOfYear && (e < Ht || e > Lt) && (e = Lt), m(t)._overflowWeeks && -1 === e && (e = Vt), m(t)._overflowWeekday && -1 === e && (e = Gt), m(t).overflow = e), t;
    }
    var wi = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      xi = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      Si = /Z|[+-]\d\d(?::?\d\d)?/,
      $i = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/], ["YYYYMM", /\d{6}/, !1], ["YYYY", /\d{4}/, !1]],
      ki = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
      Ai = /^\/?Date\((-?\d+)/i,
      Mi = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
      Ei = {
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
    function Oi(t) {
      var e,
        i,
        s,
        r,
        n,
        o,
        a = t._i,
        d = wi.exec(a) || xi.exec(a),
        c = $i.length,
        h = ki.length;
      if (d) {
        for (m(t).iso = !0, e = 0, i = c; e < i; e++) if ($i[e][1].exec(d[1])) {
          r = $i[e][0], s = !1 !== $i[e][2];
          break;
        }
        if (null == r) return void (t._isValid = !1);
        if (d[3]) {
          for (e = 0, i = h; e < i; e++) if (ki[e][1].exec(d[3])) {
            n = (d[2] || " ") + ki[e][0];
            break;
          }
          if (null == n) return void (t._isValid = !1);
        }
        if (!s && null != n) return void (t._isValid = !1);
        if (d[4]) {
          if (!Si.exec(d[4])) return void (t._isValid = !1);
          o = "Z";
        }
        t._f = r + (n || "") + (o || ""), ji(t);
      } else t._isValid = !1;
    }
    function Di(t, e, i, s, r, n) {
      var o = [Ci(t), ne.indexOf(e), parseInt(i, 10), parseInt(s, 10), parseInt(r, 10)];
      return n && o.push(parseInt(n, 10)), o;
    }
    function Ci(t) {
      var e = parseInt(t, 10);
      return e <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
    }
    function Pi(t) {
      return t.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function Yi(t, e, i) {
      return !t || Ie.indexOf(t) === new Date(e[0], e[1], e[2]).getDay() || (m(i).weekdayMismatch = !0, i._isValid = !1, !1);
    }
    function Ti(t, e, i) {
      if (t) return Ei[t];
      if (e) return 0;
      var s = parseInt(i, 10),
        r = s % 100;
      return (s - r) / 100 * 60 + r;
    }
    function Ii(t) {
      var e,
        i = Mi.exec(Pi(t._i));
      if (i) {
        if (e = Di(i[4], i[3], i[2], i[5], i[6], i[7]), !Yi(i[1], e, t)) return;
        t._a = e, t._tzm = Ti(i[8], i[9], i[10]), t._d = be.apply(null, t._a), t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), m(t).rfc2822 = !0;
      } else t._isValid = !1;
    }
    function Ni(t) {
      var e = Ai.exec(t._i);
      null === e ? (Oi(t), !1 === t._isValid && (delete t._isValid, Ii(t), !1 === t._isValid && (delete t._isValid, t._strict ? t._isValid = !1 : i.createFromInputFallback(t)))) : t._d = new Date(+e[1]);
    }
    function Ui(t, e, i) {
      return null != t ? t : null != e ? e : i;
    }
    function Hi(t) {
      var e = new Date(i.now());
      return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()];
    }
    function Ri(t) {
      var e,
        i,
        s,
        r,
        n,
        o = [];
      if (!t._d) {
        for (s = Hi(t), t._w && null == t._a[Lt] && null == t._a[Rt] && Li(t), null != t._dayOfYear && (n = Ui(t._a[Ht], s[Ht]), (t._dayOfYear > Bt(n) || 0 === t._dayOfYear) && (m(t)._overflowDayOfYear = !0), i = be(n, 0, t._dayOfYear), t._a[Rt] = i.getUTCMonth(), t._a[Lt] = i.getUTCDate()), e = 0; e < 3 && null == t._a[e]; ++e) t._a[e] = o[e] = s[e];
        for (; e < 7; e++) t._a[e] = o[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
        24 === t._a[jt] && 0 === t._a[Wt] && 0 === t._a[zt] && 0 === t._a[Ft] && (t._nextDay = !0, t._a[jt] = 0), t._d = (t._useUTC ? be : ve).apply(null, o), r = t._useUTC ? t._d.getUTCDay() : t._d.getDay(), null != t._tzm && t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), t._nextDay && (t._a[jt] = 24), t._w && void 0 !== t._w.d && t._w.d !== r && (m(t).weekdayMismatch = !0);
      }
    }
    function Li(t) {
      var e, i, s, r, n, o, a, d, c;
      null != (e = t._w).GG || null != e.W || null != e.E ? (n = 1, o = 4, i = Ui(e.GG, t._a[Ht], Se(qi(), 1, 4).year), s = Ui(e.W, 1), ((r = Ui(e.E, 1)) < 1 || r > 7) && (d = !0)) : (n = t._locale._week.dow, o = t._locale._week.doy, c = Se(qi(), n, o), i = Ui(e.gg, t._a[Ht], c.year), s = Ui(e.w, c.week), null != e.d ? ((r = e.d) < 0 || r > 6) && (d = !0) : null != e.e ? (r = e.e + n, (e.e < 0 || e.e > 6) && (d = !0)) : r = n), s < 1 || s > $e(i, n, o) ? m(t)._overflowWeeks = !0 : null != d ? m(t)._overflowWeekday = !0 : (a = xe(i, s, r, n, o), t._a[Ht] = a.year, t._dayOfYear = a.dayOfYear);
    }
    function ji(t) {
      if (t._f !== i.ISO_8601) {
        if (t._f !== i.RFC_2822) {
          t._a = [], m(t).empty = !0;
          var e,
            s,
            r,
            n,
            o,
            a,
            d,
            c = "" + t._i,
            h = c.length,
            l = 0;
          for (d = (r = z(t._f, t._locale).match(I) || []).length, e = 0; e < d; e++) n = r[e], (s = (c.match(Et(n, t)) || [])[0]) && ((o = c.substr(0, c.indexOf(s))).length > 0 && m(t).unusedInput.push(o), c = c.slice(c.indexOf(s) + s.length), l += s.length), H[n] ? (s ? m(t).empty = !1 : m(t).unusedTokens.push(n), Nt(n, s, t)) : t._strict && !s && m(t).unusedTokens.push(n);
          m(t).charsLeftOver = h - l, c.length > 0 && m(t).unusedInput.push(c), t._a[jt] <= 12 && !0 === m(t).bigHour && t._a[jt] > 0 && (m(t).bigHour = void 0), m(t).parsedDateParts = t._a.slice(0), m(t).meridiem = t._meridiem, t._a[jt] = Wi(t._locale, t._a[jt], t._meridiem), null !== (a = m(t).era) && (t._a[Ht] = t._locale.erasConvertYear(a, t._a[Ht])), Ri(t), bi(t);
        } else Ii(t);
      } else Oi(t);
    }
    function Wi(t, e, i) {
      var s;
      return null == i ? e : null != t.meridiemHour ? t.meridiemHour(e, i) : null != t.isPM ? ((s = t.isPM(i)) && e < 12 && (e += 12), s || 12 !== e || (e = 0), e) : e;
    }
    function zi(t) {
      var e,
        i,
        s,
        r,
        n,
        o,
        a = !1,
        d = t._f.length;
      if (0 === d) return m(t).invalidFormat = !0, void (t._d = new Date(NaN));
      for (r = 0; r < d; r++) n = 0, o = !1, e = b({}, t), null != t._useUTC && (e._useUTC = t._useUTC), e._f = t._f[r], ji(e), y(e) && (o = !0), n += m(e).charsLeftOver, n += 10 * m(e).unusedTokens.length, m(e).score = n, a ? n < s && (s = n, i = e) : (null == s || n < s || o) && (s = n, i = e, o && (a = !0));
      u(t, i || e);
    }
    function Fi(t) {
      if (!t._d) {
        var e = it(t._i),
          i = void 0 === e.day ? e.date : e.day;
        t._a = l([e.year, e.month, i, e.hour, e.minute, e.second, e.millisecond], function (t) {
          return t && parseInt(t, 10);
        }), Ri(t);
      }
    }
    function Vi(t) {
      var e = new w(bi(Gi(t)));
      return e._nextDay && (e.add(1, "d"), e._nextDay = void 0), e;
    }
    function Gi(t) {
      var e = t._i,
        i = t._f;
      return t._locale = t._locale || _i(t._l), null === e || void 0 === i && "" === e ? g({
        nullInput: !0
      }) : ("string" == typeof e && (t._i = e = t._locale.preparse(e)), x(e) ? new w(bi(e)) : (h(e) ? t._d = e : r(i) ? zi(t) : i ? ji(t) : Bi(t), y(t) || (t._d = null), t));
    }
    function Bi(t) {
      var e = t._i;
      d(e) ? t._d = new Date(i.now()) : h(e) ? t._d = new Date(e.valueOf()) : "string" == typeof e ? Ni(t) : r(e) ? (t._a = l(e.slice(0), function (t) {
        return parseInt(t, 10);
      }), Ri(t)) : n(e) ? Fi(t) : c(e) ? t._d = new Date(e) : i.createFromInputFallback(t);
    }
    function Zi(t, e, i, s, o) {
      var d = {};
      return !0 !== e && !1 !== e || (s = e, e = void 0), !0 !== i && !1 !== i || (s = i, i = void 0), (n(t) && a(t) || r(t) && 0 === t.length) && (t = void 0), d._isAMomentObject = !0, d._useUTC = d._isUTC = o, d._l = i, d._i = t, d._f = e, d._strict = s, Vi(d);
    }
    function qi(t, e, i, s) {
      return Zi(t, e, i, s, !1);
    }
    i.createFromInputFallback = $("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (t) {
      t._d = new Date(t._i + (t._useUTC ? " UTC" : ""));
    }), i.ISO_8601 = function () {}, i.RFC_2822 = function () {};
    var Ji = $("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = qi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t < this ? this : t : g();
      }),
      Ki = $("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = qi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t > this ? this : t : g();
      });
    function Qi(t, e) {
      var i, s;
      if (1 === e.length && r(e[0]) && (e = e[0]), !e.length) return qi();
      for (i = e[0], s = 1; s < e.length; ++s) e[s].isValid() && !e[s][t](i) || (i = e[s]);
      return i;
    }
    function Xi() {
      return Qi("isBefore", [].slice.call(arguments, 0));
    }
    function ts() {
      return Qi("isAfter", [].slice.call(arguments, 0));
    }
    var es = function () {
        return Date.now ? Date.now() : +new Date();
      },
      is = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];
    function ss(t) {
      var e,
        i,
        s = !1,
        r = is.length;
      for (e in t) if (o(t, e) && (-1 === Zt.call(is, e) || null != t[e] && isNaN(t[e]))) return !1;
      for (i = 0; i < r; ++i) if (t[is[i]]) {
        if (s) return !1;
        parseFloat(t[is[i]]) !== Pt(t[is[i]]) && (s = !0);
      }
      return !0;
    }
    function rs() {
      return this._isValid;
    }
    function ns() {
      return Es(NaN);
    }
    function os(t) {
      var e = it(t),
        i = e.year || 0,
        s = e.quarter || 0,
        r = e.month || 0,
        n = e.week || e.isoWeek || 0,
        o = e.day || 0,
        a = e.hour || 0,
        d = e.minute || 0,
        c = e.second || 0,
        h = e.millisecond || 0;
      this._isValid = ss(e), this._milliseconds = +h + 1e3 * c + 6e4 * d + 1e3 * a * 60 * 60, this._days = +o + 7 * n, this._months = +r + 3 * s + 12 * i, this._data = {}, this._locale = _i(), this._bubble();
    }
    function as(t) {
      return t instanceof os;
    }
    function ds(t) {
      return t < 0 ? -1 * Math.round(-1 * t) : Math.round(t);
    }
    function cs(t, e, i) {
      var s,
        r = Math.min(t.length, e.length),
        n = Math.abs(t.length - e.length),
        o = 0;
      for (s = 0; s < r; s++) (i && t[s] !== e[s] || !i && Pt(t[s]) !== Pt(e[s])) && o++;
      return o + n;
    }
    function hs(t, e) {
      R(t, 0, 0, function () {
        var t = this.utcOffset(),
          i = "+";
        return t < 0 && (t = -t, i = "-"), i + T(~~(t / 60), 2) + e + T(~~t % 60, 2);
      });
    }
    hs("Z", ":"), hs("ZZ", ""), Mt("Z", xt), Mt("ZZ", xt), Tt(["Z", "ZZ"], function (t, e, i) {
      i._useUTC = !0, i._tzm = us(xt, t);
    });
    var ls = /([\+\-]|\d\d)/gi;
    function us(t, e) {
      var i,
        s,
        r = (e || "").match(t);
      return null === r ? null : 0 === (s = 60 * (i = ((r[r.length - 1] || []) + "").match(ls) || ["-", 0, 0])[1] + Pt(i[2])) ? 0 : "+" === i[0] ? s : -s;
    }
    function ps(t, e) {
      var s, r;
      return e._isUTC ? (s = e.clone(), r = (x(t) || h(t) ? t.valueOf() : qi(t).valueOf()) - s.valueOf(), s._d.setTime(s._d.valueOf() + r), i.updateOffset(s, !1), s) : qi(t).local();
    }
    function fs(t) {
      return -Math.round(t._d.getTimezoneOffset());
    }
    function ms(t, e, s) {
      var r,
        n = this._offset || 0;
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        if ("string" == typeof t) {
          if (null === (t = us(xt, t))) return this;
        } else Math.abs(t) < 16 && !s && (t *= 60);
        return !this._isUTC && e && (r = fs(this)), this._offset = t, this._isUTC = !0, null != r && this.add(r, "m"), n !== t && (!e || this._changeInProgress ? Ys(this, Es(t - n, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, i.updateOffset(this, !0), this._changeInProgress = null)), this;
      }
      return this._isUTC ? n : fs(this);
    }
    function ys(t, e) {
      return null != t ? ("string" != typeof t && (t = -t), this.utcOffset(t, e), this) : -this.utcOffset();
    }
    function gs(t) {
      return this.utcOffset(0, t);
    }
    function _s(t) {
      return this._isUTC && (this.utcOffset(0, t), this._isUTC = !1, t && this.subtract(fs(this), "m")), this;
    }
    function vs() {
      if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
        var t = us(wt, this._i);
        null != t ? this.utcOffset(t) : this.utcOffset(0, !0);
      }
      return this;
    }
    function bs(t) {
      return !!this.isValid() && (t = t ? qi(t).utcOffset() : 0, (this.utcOffset() - t) % 60 == 0);
    }
    function ws() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function xs() {
      if (!d(this._isDSTShifted)) return this._isDSTShifted;
      var t,
        e = {};
      return b(e, this), (e = Gi(e))._a ? (t = e._isUTC ? p(e._a) : qi(e._a), this._isDSTShifted = this.isValid() && cs(e._a, t.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
    }
    function Ss() {
      return !!this.isValid() && !this._isUTC;
    }
    function $s() {
      return !!this.isValid() && this._isUTC;
    }
    function ks() {
      return !!this.isValid() && this._isUTC && 0 === this._offset;
    }
    i.updateOffset = function () {};
    var As = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
      Ms = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function Es(t, e) {
      var i,
        s,
        r,
        n = t,
        a = null;
      return as(t) ? n = {
        ms: t._milliseconds,
        d: t._days,
        M: t._months
      } : c(t) || !isNaN(+t) ? (n = {}, e ? n[e] = +t : n.milliseconds = +t) : (a = As.exec(t)) ? (i = "-" === a[1] ? -1 : 1, n = {
        y: 0,
        d: Pt(a[Lt]) * i,
        h: Pt(a[jt]) * i,
        m: Pt(a[Wt]) * i,
        s: Pt(a[zt]) * i,
        ms: Pt(ds(1e3 * a[Ft])) * i
      }) : (a = Ms.exec(t)) ? (i = "-" === a[1] ? -1 : 1, n = {
        y: Os(a[2], i),
        M: Os(a[3], i),
        w: Os(a[4], i),
        d: Os(a[5], i),
        h: Os(a[6], i),
        m: Os(a[7], i),
        s: Os(a[8], i)
      }) : null == n ? n = {} : "object" == typeof n && ("from" in n || "to" in n) && (r = Cs(qi(n.from), qi(n.to)), (n = {}).ms = r.milliseconds, n.M = r.months), s = new os(n), as(t) && o(t, "_locale") && (s._locale = t._locale), as(t) && o(t, "_isValid") && (s._isValid = t._isValid), s;
    }
    function Os(t, e) {
      var i = t && parseFloat(t.replace(",", "."));
      return (isNaN(i) ? 0 : i) * e;
    }
    function Ds(t, e) {
      var i = {};
      return i.months = e.month() - t.month() + 12 * (e.year() - t.year()), t.clone().add(i.months, "M").isAfter(e) && --i.months, i.milliseconds = +e - +t.clone().add(i.months, "M"), i;
    }
    function Cs(t, e) {
      var i;
      return t.isValid() && e.isValid() ? (e = ps(e, t), t.isBefore(e) ? i = Ds(t, e) : ((i = Ds(e, t)).milliseconds = -i.milliseconds, i.months = -i.months), i) : {
        milliseconds: 0,
        months: 0
      };
    }
    function Ps(t, e) {
      return function (i, s) {
        var r;
        return null === s || isNaN(+s) || (M(e, "moment()." + e + "(period, number) is deprecated. Please use moment()." + e + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), r = i, i = s, s = r), Ys(this, Es(i, s), t), this;
      };
    }
    function Ys(t, e, s, r) {
      var n = e._milliseconds,
        o = ds(e._days),
        a = ds(e._months);
      t.isValid() && (r = r ?? !0, a && pe(t, Qt(t, "Month") + a * s), o && Xt(t, "Date", Qt(t, "Date") + o * s), n && t._d.setTime(t._d.valueOf() + n * s), r && i.updateOffset(t, o || a));
    }
    Es.fn = os.prototype, Es.invalid = ns;
    var Ts = Ps(1, "add"),
      Is = Ps(-1, "subtract");
    function Ns(t) {
      return "string" == typeof t || t instanceof String;
    }
    function Us(t) {
      return x(t) || h(t) || Ns(t) || c(t) || Rs(t) || Hs(t) || null == t;
    }
    function Hs(t) {
      var e,
        i,
        s = n(t) && !a(t),
        r = !1,
        d = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"],
        c = d.length;
      for (e = 0; e < c; e += 1) i = d[e], r = r || o(t, i);
      return s && r;
    }
    function Rs(t) {
      var e = r(t),
        i = !1;
      return e && (i = 0 === t.filter(function (e) {
        return !c(e) && Ns(t);
      }).length), e && i;
    }
    function Ls(t) {
      var e,
        i,
        s = n(t) && !a(t),
        r = !1,
        d = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"];
      for (e = 0; e < d.length; e += 1) i = d[e], r = r || o(t, i);
      return s && r;
    }
    function js(t, e) {
      var i = t.diff(e, "days", !0);
      return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
    }
    function Ws(t, e) {
      1 === arguments.length && (arguments[0] ? Us(arguments[0]) ? (t = arguments[0], e = void 0) : Ls(arguments[0]) && (e = arguments[0], t = void 0) : (t = void 0, e = void 0));
      var s = t || qi(),
        r = ps(s, this).startOf("day"),
        n = i.calendarFormat(this, r) || "sameElse",
        o = e && (E(e[n]) ? e[n].call(this, s) : e[n]);
      return this.format(o || this.localeData().calendar(n, this, qi(s)));
    }
    function zs() {
      return new w(this);
    }
    function Fs(t, e) {
      var i = x(t) ? t : qi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(e).valueOf());
    }
    function Vs(t, e) {
      var i = x(t) ? t : qi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(e).valueOf() < i.valueOf());
    }
    function Gs(t, e, i, s) {
      var r = x(t) ? t : qi(t),
        n = x(e) ? e : qi(e);
      return !!(this.isValid() && r.isValid() && n.isValid()) && ("(" === (s = s || "()")[0] ? this.isAfter(r, i) : !this.isBefore(r, i)) && (")" === s[1] ? this.isBefore(n, i) : !this.isAfter(n, i));
    }
    function Bs(t, e) {
      var i,
        s = x(t) ? t : qi(t);
      return !(!this.isValid() || !s.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() === s.valueOf() : (i = s.valueOf(), this.clone().startOf(e).valueOf() <= i && i <= this.clone().endOf(e).valueOf()));
    }
    function Zs(t, e) {
      return this.isSame(t, e) || this.isAfter(t, e);
    }
    function qs(t, e) {
      return this.isSame(t, e) || this.isBefore(t, e);
    }
    function Js(t, e, i) {
      var s, r, n;
      if (!this.isValid()) return NaN;
      if (!(s = ps(t, this)).isValid()) return NaN;
      switch (r = 6e4 * (s.utcOffset() - this.utcOffset()), e = et(e)) {
        case "year":
          n = Ks(this, s) / 12;
          break;
        case "month":
          n = Ks(this, s);
          break;
        case "quarter":
          n = Ks(this, s) / 3;
          break;
        case "second":
          n = (this - s) / 1e3;
          break;
        case "minute":
          n = (this - s) / 6e4;
          break;
        case "hour":
          n = (this - s) / 36e5;
          break;
        case "day":
          n = (this - s - r) / 864e5;
          break;
        case "week":
          n = (this - s - r) / 6048e5;
          break;
        default:
          n = this - s;
      }
      return i ? n : Ct(n);
    }
    function Ks(t, e) {
      if (t.date() < e.date()) return -Ks(e, t);
      var i = 12 * (e.year() - t.year()) + (e.month() - t.month()),
        s = t.clone().add(i, "months");
      return -(i + (e - s < 0 ? (e - s) / (s - t.clone().add(i - 1, "months")) : (e - s) / (t.clone().add(i + 1, "months") - s))) || 0;
    }
    function Qs() {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function Xs(t) {
      if (!this.isValid()) return null;
      var e = !0 !== t,
        i = e ? this.clone().utc() : this;
      return i.year() < 0 || i.year() > 9999 ? W(i, e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : E(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", W(i, "Z")) : W(i, e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function tr() {
      if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
      var t,
        e,
        i,
        s,
        r = "moment",
        n = "";
      return this.isLocal() || (r = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", n = "Z"), t = "[" + r + '("]', e = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = "-MM-DD[T]HH:mm:ss.SSS", s = n + '[")]', this.format(t + e + i + s);
    }
    function er(t) {
      t || (t = this.isUtc() ? i.defaultFormatUtc : i.defaultFormat);
      var e = W(this, t);
      return this.localeData().postformat(e);
    }
    function ir(t, e) {
      return this.isValid() && (x(t) && t.isValid() || qi(t).isValid()) ? Es({
        to: this,
        from: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function sr(t) {
      return this.from(qi(), t);
    }
    function rr(t, e) {
      return this.isValid() && (x(t) && t.isValid() || qi(t).isValid()) ? Es({
        from: this,
        to: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function nr(t) {
      return this.to(qi(), t);
    }
    function or(t) {
      var e;
      return void 0 === t ? this._locale._abbr : (null != (e = _i(t)) && (this._locale = e), this);
    }
    i.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", i.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var ar = $("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (t) {
      return void 0 === t ? this.localeData() : this.locale(t);
    });
    function dr() {
      return this._locale;
    }
    var cr = 1e3,
      hr = 60 * cr,
      lr = 60 * hr,
      ur = 3506328 * lr;
    function pr(t, e) {
      return (t % e + e) % e;
    }
    function fr(t, e, i) {
      return t < 100 && t >= 0 ? new Date(t + 400, e, i) - ur : new Date(t, e, i).valueOf();
    }
    function mr(t, e, i) {
      return t < 100 && t >= 0 ? Date.UTC(t + 400, e, i) - ur : Date.UTC(t, e, i);
    }
    function yr(t) {
      var e, s;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (s = this._isUTC ? mr : fr, t) {
        case "year":
          e = s(this.year(), 0, 1);
          break;
        case "quarter":
          e = s(this.year(), this.month() - this.month() % 3, 1);
          break;
        case "month":
          e = s(this.year(), this.month(), 1);
          break;
        case "week":
          e = s(this.year(), this.month(), this.date() - this.weekday());
          break;
        case "isoWeek":
          e = s(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
          break;
        case "day":
        case "date":
          e = s(this.year(), this.month(), this.date());
          break;
        case "hour":
          e = this._d.valueOf(), e -= pr(e + (this._isUTC ? 0 : this.utcOffset() * hr), lr);
          break;
        case "minute":
          e = this._d.valueOf(), e -= pr(e, hr);
          break;
        case "second":
          e = this._d.valueOf(), e -= pr(e, cr);
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function gr(t) {
      var e, s;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (s = this._isUTC ? mr : fr, t) {
        case "year":
          e = s(this.year() + 1, 0, 1) - 1;
          break;
        case "quarter":
          e = s(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
          break;
        case "month":
          e = s(this.year(), this.month() + 1, 1) - 1;
          break;
        case "week":
          e = s(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
          break;
        case "isoWeek":
          e = s(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
          break;
        case "day":
        case "date":
          e = s(this.year(), this.month(), this.date() + 1) - 1;
          break;
        case "hour":
          e = this._d.valueOf(), e += lr - pr(e + (this._isUTC ? 0 : this.utcOffset() * hr), lr) - 1;
          break;
        case "minute":
          e = this._d.valueOf(), e += hr - pr(e, hr) - 1;
          break;
        case "second":
          e = this._d.valueOf(), e += cr - pr(e, cr) - 1;
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function _r() {
      return this._d.valueOf() - 6e4 * (this._offset || 0);
    }
    function vr() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function br() {
      return new Date(this.valueOf());
    }
    function wr() {
      var t = this;
      return [t.year(), t.month(), t.date(), t.hour(), t.minute(), t.second(), t.millisecond()];
    }
    function xr() {
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
    function Sr() {
      return this.isValid() ? this.toISOString() : null;
    }
    function $r() {
      return y(this);
    }
    function kr() {
      return u({}, m(this));
    }
    function Ar() {
      return m(this).overflow;
    }
    function Mr() {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
      };
    }
    function Er(t, e) {
      var s,
        r,
        n,
        o = this._eras || _i("en")._eras;
      for (s = 0, r = o.length; s < r; ++s) switch ("string" == typeof o[s].since && (n = i(o[s].since).startOf("day"), o[s].since = n.valueOf()), typeof o[s].until) {
        case "undefined":
          o[s].until = 1 / 0;
          break;
        case "string":
          n = i(o[s].until).startOf("day").valueOf(), o[s].until = n.valueOf();
      }
      return o;
    }
    function Or(t, e, i) {
      var s,
        r,
        n,
        o,
        a,
        d = this.eras();
      for (t = t.toUpperCase(), s = 0, r = d.length; s < r; ++s) if (n = d[s].name.toUpperCase(), o = d[s].abbr.toUpperCase(), a = d[s].narrow.toUpperCase(), i) switch (e) {
        case "N":
        case "NN":
        case "NNN":
          if (o === t) return d[s];
          break;
        case "NNNN":
          if (n === t) return d[s];
          break;
        case "NNNNN":
          if (a === t) return d[s];
      } else if ([n, o, a].indexOf(t) >= 0) return d[s];
    }
    function Dr(t, e) {
      var s = t.since <= t.until ? 1 : -1;
      return void 0 === e ? i(t.since).year() : i(t.since).year() + (e - t.offset) * s;
    }
    function Cr() {
      var t,
        e,
        i,
        s = this.localeData().eras();
      for (t = 0, e = s.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), s[t].since <= i && i <= s[t].until) return s[t].name;
        if (s[t].until <= i && i <= s[t].since) return s[t].name;
      }
      return "";
    }
    function Pr() {
      var t,
        e,
        i,
        s = this.localeData().eras();
      for (t = 0, e = s.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), s[t].since <= i && i <= s[t].until) return s[t].narrow;
        if (s[t].until <= i && i <= s[t].since) return s[t].narrow;
      }
      return "";
    }
    function Yr() {
      var t,
        e,
        i,
        s = this.localeData().eras();
      for (t = 0, e = s.length; t < e; ++t) {
        if (i = this.clone().startOf("day").valueOf(), s[t].since <= i && i <= s[t].until) return s[t].abbr;
        if (s[t].until <= i && i <= s[t].since) return s[t].abbr;
      }
      return "";
    }
    function Tr() {
      var t,
        e,
        s,
        r,
        n = this.localeData().eras();
      for (t = 0, e = n.length; t < e; ++t) if (s = n[t].since <= n[t].until ? 1 : -1, r = this.clone().startOf("day").valueOf(), n[t].since <= r && r <= n[t].until || n[t].until <= r && r <= n[t].since) return (this.year() - i(n[t].since).year()) * s + n[t].offset;
      return this.year();
    }
    function Ir(t) {
      return o(this, "_erasNameRegex") || Wr.call(this), t ? this._erasNameRegex : this._erasRegex;
    }
    function Nr(t) {
      return o(this, "_erasAbbrRegex") || Wr.call(this), t ? this._erasAbbrRegex : this._erasRegex;
    }
    function Ur(t) {
      return o(this, "_erasNarrowRegex") || Wr.call(this), t ? this._erasNarrowRegex : this._erasRegex;
    }
    function Hr(t, e) {
      return e.erasAbbrRegex(t);
    }
    function Rr(t, e) {
      return e.erasNameRegex(t);
    }
    function Lr(t, e) {
      return e.erasNarrowRegex(t);
    }
    function jr(t, e) {
      return e._eraYearOrdinalRegex || gt;
    }
    function Wr() {
      var t,
        e,
        i,
        s,
        r,
        n = [],
        o = [],
        a = [],
        d = [],
        c = this.eras();
      for (t = 0, e = c.length; t < e; ++t) i = Dt(c[t].name), s = Dt(c[t].abbr), r = Dt(c[t].narrow), o.push(i), n.push(s), a.push(r), d.push(i), d.push(s), d.push(r);
      this._erasRegex = new RegExp("^(" + d.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + n.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + a.join("|") + ")", "i");
    }
    function zr(t, e) {
      R(0, [t, t.length], 0, e);
    }
    function Fr(t) {
      return Jr.call(this, t, this.week(), this.weekday() + this.localeData()._week.dow, this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function Vr(t) {
      return Jr.call(this, t, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function Gr() {
      return $e(this.year(), 1, 4);
    }
    function Br() {
      return $e(this.isoWeekYear(), 1, 4);
    }
    function Zr() {
      var t = this.localeData()._week;
      return $e(this.year(), t.dow, t.doy);
    }
    function qr() {
      var t = this.localeData()._week;
      return $e(this.weekYear(), t.dow, t.doy);
    }
    function Jr(t, e, i, s, r) {
      var n;
      return null == t ? Se(this, s, r).year : (e > (n = $e(t, s, r)) && (e = n), Kr.call(this, t, e, i, s, r));
    }
    function Kr(t, e, i, s, r) {
      var n = xe(t, e, i, s, r),
        o = be(n.year, 0, n.dayOfYear);
      return this.year(o.getUTCFullYear()), this.month(o.getUTCMonth()), this.date(o.getUTCDate()), this;
    }
    function Qr(t) {
      return null == t ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (t - 1) + this.month() % 3);
    }
    R("N", 0, 0, "eraAbbr"), R("NN", 0, 0, "eraAbbr"), R("NNN", 0, 0, "eraAbbr"), R("NNNN", 0, 0, "eraName"), R("NNNNN", 0, 0, "eraNarrow"), R("y", ["y", 1], "yo", "eraYear"), R("y", ["yy", 2], 0, "eraYear"), R("y", ["yyy", 3], 0, "eraYear"), R("y", ["yyyy", 4], 0, "eraYear"), Mt("N", Hr), Mt("NN", Hr), Mt("NNN", Hr), Mt("NNNN", Rr), Mt("NNNNN", Lr), Tt(["N", "NN", "NNN", "NNNN", "NNNNN"], function (t, e, i, s) {
      var r = i._locale.erasParse(t, s, i._strict);
      r ? m(i).era = r : m(i).invalidEra = t;
    }), Mt("y", gt), Mt("yy", gt), Mt("yyy", gt), Mt("yyyy", gt), Mt("yo", jr), Tt(["y", "yy", "yyy", "yyyy"], Ht), Tt(["yo"], function (t, e, i, s) {
      var r;
      i._locale._eraYearOrdinalRegex && (r = t.match(i._locale._eraYearOrdinalRegex)), i._locale.eraYearOrdinalParse ? e[Ht] = i._locale.eraYearOrdinalParse(t, r) : e[Ht] = parseInt(t, 10);
    }), R(0, ["gg", 2], 0, function () {
      return this.weekYear() % 100;
    }), R(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    }), zr("gggg", "weekYear"), zr("ggggg", "weekYear"), zr("GGGG", "isoWeekYear"), zr("GGGGG", "isoWeekYear"), Mt("G", bt), Mt("g", bt), Mt("GG", lt, at), Mt("gg", lt, at), Mt("GGGG", mt, ct), Mt("gggg", mt, ct), Mt("GGGGG", yt, ht), Mt("ggggg", yt, ht), It(["gggg", "ggggg", "GGGG", "GGGGG"], function (t, e, i, s) {
      e[s.substr(0, 2)] = Pt(t);
    }), It(["gg", "GG"], function (t, e, s, r) {
      e[r] = i.parseTwoDigitYear(t);
    }), R("Q", 0, "Qo", "quarter"), Mt("Q", ot), Tt("Q", function (t, e) {
      e[Rt] = 3 * (Pt(t) - 1);
    }), R("D", ["DD", 2], "Do", "date"), Mt("D", lt, kt), Mt("DD", lt, at), Mt("Do", function (t, e) {
      return t ? e._dayOfMonthOrdinalParse || e._ordinalParse : e._dayOfMonthOrdinalParseLenient;
    }), Tt(["D", "DD"], Lt), Tt("Do", function (t, e) {
      e[Lt] = Pt(t.match(lt)[0]);
    });
    var Xr = Kt("Date", !0);
    function tn(t) {
      var e = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
      return null == t ? e : this.add(t - e, "d");
    }
    R("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), Mt("DDD", ft), Mt("DDDD", dt), Tt(["DDD", "DDDD"], function (t, e, i) {
      i._dayOfYear = Pt(t);
    }), R("m", ["mm", 2], 0, "minute"), Mt("m", lt, At), Mt("mm", lt, at), Tt(["m", "mm"], Wt);
    var en = Kt("Minutes", !1);
    R("s", ["ss", 2], 0, "second"), Mt("s", lt, At), Mt("ss", lt, at), Tt(["s", "ss"], zt);
    var sn,
      rn,
      nn = Kt("Seconds", !1);
    for (R("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    }), R(0, ["SS", 2], 0, function () {
      return ~~(this.millisecond() / 10);
    }), R(0, ["SSS", 3], 0, "millisecond"), R(0, ["SSSS", 4], 0, function () {
      return 10 * this.millisecond();
    }), R(0, ["SSSSS", 5], 0, function () {
      return 100 * this.millisecond();
    }), R(0, ["SSSSSS", 6], 0, function () {
      return 1e3 * this.millisecond();
    }), R(0, ["SSSSSSS", 7], 0, function () {
      return 1e4 * this.millisecond();
    }), R(0, ["SSSSSSSS", 8], 0, function () {
      return 1e5 * this.millisecond();
    }), R(0, ["SSSSSSSSS", 9], 0, function () {
      return 1e6 * this.millisecond();
    }), Mt("S", ft, ot), Mt("SS", ft, at), Mt("SSS", ft, dt), sn = "SSSS"; sn.length <= 9; sn += "S") Mt(sn, gt);
    function on(t, e) {
      e[Ft] = Pt(1e3 * ("0." + t));
    }
    for (sn = "S"; sn.length <= 9; sn += "S") Tt(sn, on);
    function an() {
      return this._isUTC ? "UTC" : "";
    }
    function dn() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    rn = Kt("Milliseconds", !1), R("z", 0, 0, "zoneAbbr"), R("zz", 0, 0, "zoneName");
    var cn = w.prototype;
    function hn(t) {
      return qi(1e3 * t);
    }
    function ln() {
      return qi.apply(null, arguments).parseZone();
    }
    function un(t) {
      return t;
    }
    cn.add = Ts, cn.calendar = Ws, cn.clone = zs, cn.diff = Js, cn.endOf = gr, cn.format = er, cn.from = ir, cn.fromNow = sr, cn.to = rr, cn.toNow = nr, cn.get = te, cn.invalidAt = Ar, cn.isAfter = Fs, cn.isBefore = Vs, cn.isBetween = Gs, cn.isSame = Bs, cn.isSameOrAfter = Zs, cn.isSameOrBefore = qs, cn.isValid = $r, cn.lang = ar, cn.locale = or, cn.localeData = dr, cn.max = Ki, cn.min = Ji, cn.parsingFlags = kr, cn.set = ee, cn.startOf = yr, cn.subtract = Is, cn.toArray = wr, cn.toObject = xr, cn.toDate = br, cn.toISOString = Xs, cn.inspect = tr, "undefined" != typeof Symbol && null != Symbol.for && (cn[Symbol.for("nodejs.util.inspect.custom")] = function () {
      return "Moment<" + this.format() + ">";
    }), cn.toJSON = Sr, cn.toString = Qs, cn.unix = vr, cn.valueOf = _r, cn.creationData = Mr, cn.eraName = Cr, cn.eraNarrow = Pr, cn.eraAbbr = Yr, cn.eraYear = Tr, cn.year = qt, cn.isLeapYear = Jt, cn.weekYear = Fr, cn.isoWeekYear = Vr, cn.quarter = cn.quarters = Qr, cn.month = fe, cn.daysInMonth = me, cn.week = cn.weeks = Oe, cn.isoWeek = cn.isoWeeks = De, cn.weeksInYear = Zr, cn.weeksInWeekYear = qr, cn.isoWeeksInYear = Gr, cn.isoWeeksInISOWeekYear = Br, cn.date = Xr, cn.day = cn.days = Ve, cn.weekday = Ge, cn.isoWeekday = Be, cn.dayOfYear = tn, cn.hour = cn.hours = ri, cn.minute = cn.minutes = en, cn.second = cn.seconds = nn, cn.millisecond = cn.milliseconds = rn, cn.utcOffset = ms, cn.utc = gs, cn.local = _s, cn.parseZone = vs, cn.hasAlignedHourOffset = bs, cn.isDST = ws, cn.isLocal = Ss, cn.isUtcOffset = $s, cn.isUtc = ks, cn.isUTC = ks, cn.zoneAbbr = an, cn.zoneName = dn, cn.dates = $("dates accessor is deprecated. Use date instead.", Xr), cn.months = $("months accessor is deprecated. Use month instead", fe), cn.years = $("years accessor is deprecated. Use year instead", qt), cn.zone = $("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", ys), cn.isDSTShifted = $("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", xs);
    var pn = C.prototype;
    function fn(t, e, i, s) {
      var r = _i(),
        n = p().set(s, e);
      return r[i](n, t);
    }
    function mn(t, e, i) {
      if (c(t) && (e = t, t = void 0), t = t || "", null != e) return fn(t, e, i, "month");
      var s,
        r = [];
      for (s = 0; s < 12; s++) r[s] = fn(t, s, i, "month");
      return r;
    }
    function yn(t, e, i, s) {
      "boolean" == typeof t ? (c(e) && (i = e, e = void 0), e = e || "") : (i = e = t, t = !1, c(e) && (i = e, e = void 0), e = e || "");
      var r,
        n = _i(),
        o = t ? n._week.dow : 0,
        a = [];
      if (null != i) return fn(e, (i + o) % 7, s, "day");
      for (r = 0; r < 7; r++) a[r] = fn(e, (r + o) % 7, s, "day");
      return a;
    }
    function gn(t, e) {
      return mn(t, e, "months");
    }
    function _n(t, e) {
      return mn(t, e, "monthsShort");
    }
    function vn(t, e, i) {
      return yn(t, e, i, "weekdays");
    }
    function bn(t, e, i) {
      return yn(t, e, i, "weekdaysShort");
    }
    function wn(t, e, i) {
      return yn(t, e, i, "weekdaysMin");
    }
    pn.calendar = Y, pn.longDateFormat = V, pn.invalidDate = B, pn.ordinal = J, pn.preparse = un, pn.postformat = un, pn.relativeTime = Q, pn.pastFuture = X, pn.set = O, pn.eras = Er, pn.erasParse = Or, pn.erasConvertYear = Dr, pn.erasAbbrRegex = Nr, pn.erasNameRegex = Ir, pn.erasNarrowRegex = Ur, pn.months = ce, pn.monthsShort = he, pn.monthsParse = ue, pn.monthsRegex = ge, pn.monthsShortRegex = ye, pn.week = ke, pn.firstDayOfYear = Ee, pn.firstDayOfWeek = Me, pn.weekdays = Le, pn.weekdaysMin = We, pn.weekdaysShort = je, pn.weekdaysParse = Fe, pn.weekdaysRegex = Ze, pn.weekdaysShortRegex = qe, pn.weekdaysMinRegex = Je, pn.isPM = ii, pn.meridiem = ni, mi("en", {
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
        return t + (1 === Pt(t % 100 / 10) ? "th" : 1 === e ? "st" : 2 === e ? "nd" : 3 === e ? "rd" : "th");
      }
    }), i.lang = $("moment.lang is deprecated. Use moment.locale instead.", mi), i.langData = $("moment.langData is deprecated. Use moment.localeData instead.", _i);
    var xn = Math.abs;
    function Sn() {
      var t = this._data;
      return this._milliseconds = xn(this._milliseconds), this._days = xn(this._days), this._months = xn(this._months), t.milliseconds = xn(t.milliseconds), t.seconds = xn(t.seconds), t.minutes = xn(t.minutes), t.hours = xn(t.hours), t.months = xn(t.months), t.years = xn(t.years), this;
    }
    function $n(t, e, i, s) {
      var r = Es(e, i);
      return t._milliseconds += s * r._milliseconds, t._days += s * r._days, t._months += s * r._months, t._bubble();
    }
    function kn(t, e) {
      return $n(this, t, e, 1);
    }
    function An(t, e) {
      return $n(this, t, e, -1);
    }
    function Mn(t) {
      return t < 0 ? Math.floor(t) : Math.ceil(t);
    }
    function En() {
      var t,
        e,
        i,
        s,
        r,
        n = this._milliseconds,
        o = this._days,
        a = this._months,
        d = this._data;
      return n >= 0 && o >= 0 && a >= 0 || n <= 0 && o <= 0 && a <= 0 || (n += 864e5 * Mn(Dn(a) + o), o = 0, a = 0), d.milliseconds = n % 1e3, t = Ct(n / 1e3), d.seconds = t % 60, e = Ct(t / 60), d.minutes = e % 60, i = Ct(e / 60), d.hours = i % 24, o += Ct(i / 24), a += r = Ct(On(o)), o -= Mn(Dn(r)), s = Ct(a / 12), a %= 12, d.days = o, d.months = a, d.years = s, this;
    }
    function On(t) {
      return 4800 * t / 146097;
    }
    function Dn(t) {
      return 146097 * t / 4800;
    }
    function Cn(t) {
      if (!this.isValid()) return NaN;
      var e,
        i,
        s = this._milliseconds;
      if ("month" === (t = et(t)) || "quarter" === t || "year" === t) switch (e = this._days + s / 864e5, i = this._months + On(e), t) {
        case "month":
          return i;
        case "quarter":
          return i / 3;
        case "year":
          return i / 12;
      } else switch (e = this._days + Math.round(Dn(this._months)), t) {
        case "week":
          return e / 7 + s / 6048e5;
        case "day":
          return e + s / 864e5;
        case "hour":
          return 24 * e + s / 36e5;
        case "minute":
          return 1440 * e + s / 6e4;
        case "second":
          return 86400 * e + s / 1e3;
        case "millisecond":
          return Math.floor(864e5 * e) + s;
        default:
          throw new Error("Unknown unit " + t);
      }
    }
    function Pn(t) {
      return function () {
        return this.as(t);
      };
    }
    var Yn = Pn("ms"),
      Tn = Pn("s"),
      In = Pn("m"),
      Nn = Pn("h"),
      Un = Pn("d"),
      Hn = Pn("w"),
      Rn = Pn("M"),
      Ln = Pn("Q"),
      jn = Pn("y"),
      Wn = Yn;
    function zn() {
      return Es(this);
    }
    function Fn(t) {
      return t = et(t), this.isValid() ? this[t + "s"]() : NaN;
    }
    function Vn(t) {
      return function () {
        return this.isValid() ? this._data[t] : NaN;
      };
    }
    var Gn = Vn("milliseconds"),
      Bn = Vn("seconds"),
      Zn = Vn("minutes"),
      qn = Vn("hours"),
      Jn = Vn("days"),
      Kn = Vn("months"),
      Qn = Vn("years");
    function Xn() {
      return Ct(this.days() / 7);
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
    function io(t, e, i, s, r) {
      return r.relativeTime(e || 1, !!i, t, s);
    }
    function so(t, e, i, s) {
      var r = Es(t).abs(),
        n = to(r.as("s")),
        o = to(r.as("m")),
        a = to(r.as("h")),
        d = to(r.as("d")),
        c = to(r.as("M")),
        h = to(r.as("w")),
        l = to(r.as("y")),
        u = n <= i.ss && ["s", n] || n < i.s && ["ss", n] || o <= 1 && ["m"] || o < i.m && ["mm", o] || a <= 1 && ["h"] || a < i.h && ["hh", a] || d <= 1 && ["d"] || d < i.d && ["dd", d];
      return null != i.w && (u = u || h <= 1 && ["w"] || h < i.w && ["ww", h]), (u = u || c <= 1 && ["M"] || c < i.M && ["MM", c] || l <= 1 && ["y"] || ["yy", l])[2] = e, u[3] = +t > 0, u[4] = s, io.apply(null, u);
    }
    function ro(t) {
      return void 0 === t ? to : "function" == typeof t && (to = t, !0);
    }
    function no(t, e) {
      return void 0 !== eo[t] && (void 0 === e ? eo[t] : (eo[t] = e, "s" === t && (eo.ss = e - 1), !0));
    }
    function oo(t, e) {
      if (!this.isValid()) return this.localeData().invalidDate();
      var i,
        s,
        r = !1,
        n = eo;
      return "object" == typeof t && (e = t, t = !1), "boolean" == typeof t && (r = t), "object" == typeof e && (n = Object.assign({}, eo, e), null != e.s && null == e.ss && (n.ss = e.s - 1)), s = so(this, !r, n, i = this.localeData()), r && (s = i.pastFuture(+this, s)), i.postformat(s);
    }
    var ao = Math.abs;
    function co(t) {
      return (t > 0) - (t < 0) || +t;
    }
    function ho() {
      if (!this.isValid()) return this.localeData().invalidDate();
      var t,
        e,
        i,
        s,
        r,
        n,
        o,
        a,
        d = ao(this._milliseconds) / 1e3,
        c = ao(this._days),
        h = ao(this._months),
        l = this.asSeconds();
      return l ? (t = Ct(d / 60), e = Ct(t / 60), d %= 60, t %= 60, i = Ct(h / 12), h %= 12, s = d ? d.toFixed(3).replace(/\.?0+$/, "") : "", r = l < 0 ? "-" : "", n = co(this._months) !== co(l) ? "-" : "", o = co(this._days) !== co(l) ? "-" : "", a = co(this._milliseconds) !== co(l) ? "-" : "", r + "P" + (i ? n + i + "Y" : "") + (h ? n + h + "M" : "") + (c ? o + c + "D" : "") + (e || t || d ? "T" : "") + (e ? a + e + "H" : "") + (t ? a + t + "M" : "") + (d ? a + s + "S" : "")) : "P0D";
    }
    var lo = os.prototype;
    return lo.isValid = rs, lo.abs = Sn, lo.add = kn, lo.subtract = An, lo.as = Cn, lo.asMilliseconds = Yn, lo.asSeconds = Tn, lo.asMinutes = In, lo.asHours = Nn, lo.asDays = Un, lo.asWeeks = Hn, lo.asMonths = Rn, lo.asQuarters = Ln, lo.asYears = jn, lo.valueOf = Wn, lo._bubble = En, lo.clone = zn, lo.get = Fn, lo.milliseconds = Gn, lo.seconds = Bn, lo.minutes = Zn, lo.hours = qn, lo.days = Jn, lo.weeks = Xn, lo.months = Kn, lo.years = Qn, lo.humanize = oo, lo.toISOString = ho, lo.toString = ho, lo.toJSON = ho, lo.locale = or, lo.localeData = dr, lo.toIsoString = $("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", ho), lo.lang = ar, R("X", 0, 0, "unix"), R("x", 0, 0, "valueOf"), Mt("x", bt), Mt("X", St), Tt("X", function (t, e, i) {
      i._d = new Date(1e3 * parseFloat(t));
    }), Tt("x", function (t, e, i) {
      i._d = new Date(Pt(t));
    }),
    //! moment.js
    i.version = "2.30.1", s(qi), i.fn = cn, i.min = Xi, i.max = ts, i.now = es, i.utc = p, i.unix = hn, i.months = gn, i.isDate = h, i.locale = mi, i.invalid = g, i.duration = Es, i.isMoment = x, i.weekdays = vn, i.parseZone = ln, i.localeData = _i, i.isDuration = as, i.monthsShort = _n, i.weekdaysMin = wn, i.defineLocale = yi, i.updateLocale = gi, i.locales = vi, i.weekdaysShort = bn, i.normalizeUnits = et, i.relativeTimeRounding = ro, i.relativeTimeThreshold = no, i.calendarFormat = js, i.prototype = cn, i.HTML5_FMT = {
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
  var wt,
    xt,
    St,
    $t = gt(bt.exports);
  !function (t) {
    t.ETA = "ETA", t.Elapsed = "Elapsed", t.Remaining = "Remaining";
  }(wt || (wt = {})), function (t) {
    t.F = "F", t.C = "C";
  }(xt || (xt = {})), function (t) {
    t.Status = "Status", t.HotendCurrent = "Hotend", t.BedCurrent = "Bed", t.HotendTarget = "Target Hotend", t.BedTarget = "Target Bed";
  }(St || (St = {}));
  const kt = Object.assign(Object.assign({}, wt), St),
    At = ["width", "height", "left", "top"];
  function Mt(t, e) {
    Object.keys(e).forEach(t => {
      At.includes(t) && !isNaN(e[t]) && (e[t] = e[t].toString() + "px");
    }), t && Object.assign(t.style, e);
  }
  function Et(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function Ot(t, e, i, s) {
    const r = function (t, e) {
      const i = Et(t, e);
      return i ? String(i.state) : "";
    }(t, e);
    return "on" === r ? i : s;
  }
  function Dt(t) {
    const e = {};
    for (const i in t.devices) {
      const s = t.devices[i];
      "Anycubic" === s.manufacturer && (e[s.id] = s);
    }
    return e;
  }
  function Ct(t, e, i, s, r = "unavailable", n = {}) {
    const o = function (t, e, i, s) {
      for (const r in t) {
        const n = t[r],
          o = r.split("."),
          a = o[0],
          d = o[1].split(e)[1];
        if (a === i && d === s) return n;
      }
    }(e, i, "sensor", s);
    return Et(t, o) || {
      state: r,
      attributes: n
    };
  }
  const Pt = (t, e) => e ? $t.duration(t, "seconds").humanize() : (() => {
    const e = $t.duration(t, "seconds"),
      i = e.days(),
      s = e.hours(),
      r = e.minutes(),
      n = e.seconds();
    return `${i > 0 ? `${i}d` : ""}${s > 0 ? ` ${s}h` : ""}${r > 0 ? ` ${r}m` : ""}${n > 0 ? ` ${n}s` : ""}`;
  })();
  const Yt = {
      [xt.C]: {
        [xt.C]: t => t,
        [xt.F]: t => 9 * t / 5 + 32
      },
      [xt.F]: {
        [xt.C]: t => 5 * (t - 32) / 9,
        [xt.F]: t => t
      }
    },
    Tt = (t, e, i = !1) => {
      const s = parseFloat(t.state),
        r = (t => {
          var e;
          switch (null === (e = t.attributes) || void 0 === e ? void 0 : e.unit_of_measurement) {
            case "°C":
            default:
              return xt.C;
            case "°F":
              return xt.F;
          }
        })(t),
        n = (o = s, d = e || r, Yt[a = r] && Yt[a][d] ? Yt[a][d](o) : -1);
      var o, a, d;
      return `${i ? Math.round(n) : n.toFixed(2)}°${e || r}`;
    };
  function It() {
    return [kt.Status, kt.ETA, kt.Elapsed, kt.HotendCurrent, kt.BedCurrent, kt.Remaining, kt.HotendTarget, kt.BedTarget];
  }
  function Nt(t, e) {
    return void 0 === t ? e : t;
  }
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Ut = 1,
    Ht = 2,
    Rt = t => (...e) => ({
      _$litDirective$: t,
      values: e
    });
  class Lt {
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
  const jt = Rt(class extends Lt {
      constructor(t) {
        if (super(t), t.type !== Ut || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
          const s = !!e[t];
          s === this.st.has(t) || this.nt?.has(t) || (s ? (i.add(t), this.st.add(t)) : (i.remove(t), this.st.delete(t)));
        }
        return V;
      }
    }),
    Wt = "important",
    zt = " !" + Wt,
    Ft = Rt(class extends Lt {
      constructor(t) {
        if (super(t), t.type !== Ut || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
      }
      render(t) {
        return Object.keys(t).reduce((e, i) => {
          const s = t[i];
          return null == s ? e : e + `${i = i.includes("-") ? i : i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s};`;
        }, "");
      }
      update(t, [e]) {
        const {
          style: i
        } = t.element;
        if (void 0 === this.ft) return this.ft = new Set(Object.keys(e)), this.render(e);
        for (const t of this.ft) null == e[t] && (this.ft.delete(t), t.includes("-") ? i.removeProperty(t) : i[t] = null);
        for (const t in e) {
          const s = e[t];
          if (null != s) {
            this.ft.add(t);
            const e = "string" == typeof s && s.endsWith(zt);
            t.includes("-") || e ? i.setProperty(t, e ? s.slice(0, -11) : s, e ? Wt : "") : i[t] = s;
          }
        }
        return V;
      }
    }),
    {
      I: Vt
    } = ot,
    Gt = () => document.createComment(""),
    Bt = (t, e, i) => {
      const s = t._$AA.parentNode,
        r = void 0 === e ? t._$AB : e._$AA;
      if (void 0 === i) {
        const e = s.insertBefore(Gt(), r),
          n = s.insertBefore(Gt(), r);
        i = new Vt(e, n, t, t.options);
      } else {
        const e = i._$AB.nextSibling,
          n = i._$AM,
          o = n !== t;
        if (o) {
          let e;
          i._$AQ?.(t), i._$AM = t, void 0 !== i._$AP && (e = t._$AU) !== n._$AU && i._$AP(e);
        }
        if (e !== r || o) {
          let t = i._$AA;
          for (; t !== e;) {
            const e = t.nextSibling;
            s.insertBefore(t, r), t = e;
          }
        }
      }
      return i;
    },
    Zt = (t, e, i = t) => (t._$AI(e, i), t),
    qt = {},
    Jt = t => {
      t._$AP?.(!1, !0);
      let e = t._$AA;
      const i = t._$AB.nextSibling;
      for (; e !== i;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    },
    Kt = (t, e) => {
      const i = t._$AN;
      if (void 0 === i) return !1;
      for (const t of i) t._$AO?.(e, !1), Kt(t, e);
      return !0;
    },
    Qt = t => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        i = e._$AN, i.delete(t), t = e;
      } while (0 === i?.size);
    },
    Xt = t => {
      for (let e; e = t._$AM; t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();else if (i.has(t)) break;
        i.add(t), ie(e);
      }
    };
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function te(t) {
    void 0 !== this._$AN ? (Qt(this), this._$AM = t, Xt(this)) : this._$AM = t;
  }
  function ee(t, e = !1, i = 0) {
    const s = this._$AH,
      r = this._$AN;
    if (void 0 !== r && 0 !== r.size) if (e) {
      if (Array.isArray(s)) for (let t = i; t < s.length; t++) Kt(s[t], !1), Qt(s[t]);else null != s && (Kt(s, !1), Qt(s));
    } else Kt(this, t);
  }
  const ie = t => {
    t.type == Ht && (t._$AP ??= ee, t._$AQ ??= te);
  };
  class se extends Lt {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(t, e, i) {
      super._$AT(t, e, i), Xt(this), this.isConnected = t._$AU;
    }
    _$AO(t, e = !0) {
      t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (Kt(this, t), Qt(this));
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
  const re = new WeakMap();
  let ne = 0;
  const oe = new Map(),
    ae = new WeakSet(),
    de = () => new Promise(t => requestAnimationFrame(t)),
    ce = (t, e) => {
      const i = t - e;
      return 0 === i ? void 0 : i;
    },
    he = (t, e) => {
      const i = t / e;
      return 1 === i ? void 0 : i;
    },
    le = {
      left: (t, e) => {
        const i = ce(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateX(${i}px)`
        };
      },
      top: (t, e) => {
        const i = ce(t, e);
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
        const s = he(t, e);
        return {
          value: s,
          overrideFrom: i,
          transform: null == s || isNaN(s) ? void 0 : `scaleX(${s})`
        };
      },
      height: (t, e) => {
        let i;
        0 === e && (e = 1, i = {
          height: "1px"
        });
        const s = he(t, e);
        return {
          value: s,
          overrideFrom: i,
          transform: null == s || isNaN(s) ? void 0 : `scaleY(${s})`
        };
      }
    },
    ue = {
      duration: 333,
      easing: "ease-in-out"
    },
    pe = ["left", "top", "width", "height", "opacity", "color", "background"],
    fe = new WeakMap();
  const me = Rt(class extends se {
      constructor(t) {
        if (super(t), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, t.type === Ht) throw Error("The `animate` directive must be used in attribute position.");
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
        return G;
      }
      getController() {
        return re.get(this.u);
      }
      isDisabled() {
        return this.options.disabled || this.getController()?.disabled;
      }
      update(t, [e]) {
        const i = void 0 === this.u;
        return i && (this.u = t.options?.host, this.u.addController(this), this.u.updateComplete.then(t => this.t = !0), this.element = t.element, fe.set(this.element, this)), this.optionsOrCallback = e, (i || "function" != typeof e) && this.p(e), this.render(e);
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
        }), t.properties ??= pe, this.options = t;
      }
      m() {
        const t = {},
          e = this.element.getBoundingClientRect(),
          i = getComputedStyle(this.element);
        return this.options.properties.forEach(s => {
          const r = e[s] ?? (le[s] ? void 0 : i[s]),
            n = Number(r);
          t[s] = isNaN(n) ? r + "" : n;
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
        this.prepare(), await de;
        const e = this.O(),
          i = this.j(this.options.keyframeOptions, e),
          s = this.m();
        if (void 0 !== this.A) {
          const {
            from: i,
            to: r
          } = this.N(this.A, s, e);
          this.log("measured", [this.A, s, i, r]), t = this.calculateKeyframes(i, r);
        } else {
          const i = oe.get(this.options.inId);
          if (i) {
            oe.delete(this.options.inId);
            const {
              from: r,
              to: n
            } = this.N(i, s, e);
            t = this.calculateKeyframes(r, n), t = this.options.in ? [{
              ...this.options.in[0],
              ...t[0]
            }, ...this.options.in.slice(1), t[1]] : t, ne++, t.forEach(t => t.zIndex = ne);
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
        if (void 0 !== this.options.id && oe.set(this.options.id, this.A), void 0 === this.options.out) return;
        if (this.prepare(), await de(), this.i?.isConnected) {
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
          const i = fe.get(e);
          i && !i.isDisabled() && i && t.push(i);
        }
        return t;
      }
      get isHostRendered() {
        const t = ae.has(this.u);
        return t || this.u.updateComplete.then(() => {
          ae.add(this.u);
        }), t;
      }
      j(t, e = this.O()) {
        const i = {
          ...ue
        };
        return e.forEach(t => Object.assign(i, t.options.keyframeOptions)), Object.assign(i, t), i;
      }
      N(t, e, i) {
        t = {
          ...t
        }, e = {
          ...e
        };
        const s = i.map(t => t.animatingProperties).filter(t => void 0 !== t);
        let r = 1,
          n = 1;
        return s.length > 0 && (s.forEach(t => {
          t.width && (r /= t.width), t.height && (n /= t.height);
        }), void 0 !== t.left && void 0 !== e.left && (t.left = r * t.left, e.left = r * e.left), void 0 !== t.top && void 0 !== e.top && (t.top = n * t.top, e.top = n * e.top)), {
          from: t,
          to: e
        };
      }
      calculateKeyframes(t, e, i = !1) {
        const s = {},
          r = {};
        let n = !1;
        const o = {};
        for (const i in e) {
          const a = t[i],
            d = e[i];
          if (i in le) {
            const t = le[i];
            if (void 0 === a || void 0 === d) continue;
            const e = t(a, d);
            void 0 !== e.transform && (o[i] = e.value, n = !0, s.transform = `${s.transform ?? ""} ${e.transform}`, void 0 !== e.overrideFrom && Object.assign(s, e.overrideFrom));
          } else a !== d && void 0 !== a && void 0 !== d && (n = !0, s[i] = a, r[i] = d);
        }
        return s.transformOrigin = r.transformOrigin = i ? "center center" : "top left", this.animatingProperties = o, n ? [s, r] : void 0;
      }
      async animate(t, e = this.options.keyframeOptions) {
        this.start(), this.frames = t;
        let i = !1;
        if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t = this.options.onFrames(this), this.log("modified frames", t)), void 0 !== t)) {
          this.log("animate", [t, e]), i = !0, this.webAnimation = this.element.animate(t, e);
          const s = this.getController();
          s?.add(this);
          try {
            await this.webAnimation.finished;
          } catch (t) {}
          s?.remove(this);
        }
        return this.didFinish(i), i;
      }
      isAnimating() {
        return "running" === this.webAnimation?.playState || this.webAnimation?.pending;
      }
      log(t, e) {
        this.shouldLog && !this.isDisabled() && console.log(t, this.options.id, e);
      }
    }),
    ye = t => e => "function" == typeof e ? ((t, e) => (window.customElements.get(t) || window.customElements.define(t, e), e))(t, e) : ((t, e) => {
      const {
        kind: i,
        elements: s
      } = e;
      return {
        kind: i,
        elements: s,
        finisher(e) {
          window.customElements.get(t) || window.customElements.define(t, e);
        }
      };
    })(t, e);
  let ge = class extends dt {
    constructor() {
      super(...arguments), this.camImgString = "none";
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("showVideo") || t.has("cameraEntity")) && (this.camImgString = this.showVideo && this.cameraEntity ? `url('${window.location.origin}/api/camera_proxy_stream/${this.cameraEntity.entity_id}?token=${this.cameraEntity.attributes.access_token}')` : "none");
    }
    render() {
      const t = {
        display: this.showVideo ? "block" : "none"
      };
      return F`
      <div
        class="ac-printercard-cameraview"
        style=${Ft(t)}
        @click="${t => {
        this._handleToggleClick();
      }}"
      >
        ${this.showVideo ? this._renderInner() : G}
      </div>
    `;
    }
    _renderInner() {
      const t = {
        "background-image": this.camImgString
      };
      return F` <div
      class="ac-camera-wrapper"
      style=${Ft(t)}
    ></div>`;
    }
    _handleToggleClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return a`
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
  function* _e(t, e) {
    if (void 0 !== t) {
      let i = 0;
      for (const s of t) yield e(s, i++);
    }
  }
  e([pt()], ge.prototype, "showVideo", void 0), e([pt()], ge.prototype, "toggleVideo", void 0), e([pt()], ge.prototype, "cameraEntity", void 0), e([ft()], ge.prototype, "camImgString", void 0), ge = e([ye("anycubic-printercard-camera_view")], ge);
  let ve = class extends dt {
    constructor() {
      super(...arguments), this.spoolList = [];
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) && (this.spoolList = Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "not loaded", {
        spool_info: []
      }).attributes.spool_info);
    }
    render() {
      return F`
      <div class="ac-printercard-mcbview">${this._renderSpools()}</div>
    `;
    }
    _renderSpools() {
      return _e(this.spoolList, (t, e) => {
        const i = {
          "background-color": t.spool_loaded ? `rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})` : "#aaa"
        };
        return F`
        <div class="ac-spool-info">
          <div class="ac-spool-color-ring" style=${Ft(i)}>
            <div class="ac-spool-color-num">${e + 1}</div>
          </div>
          <div class="ac-spool-material-type">
            ${t.spool_loaded ? t.material_type : "---"}
          </div>
        </div>
      `;
      });
    }
    static get styles() {
      return a`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-printercard-mcbview {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .ac-spool-info {
        box-sizing: border-box;
        height: auto;
      }

      .ac-spool-color-ring {
        background-color: #aaa;
        height: 65px;
        width: 65px;
        border-radius: 50%;
        margin: 5px 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .ac-spool-color-num {
        font-weight: 900;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: #eee;
        width: 30px;
        height: 30px;
        line-height: 30px;
        color: #222;
        text-align: center;
      }

      .ac-spool-material-type {
        height: auto;
        text-align: center;
        font-weight: 900;
      }
    `;
    }
  };
  e([pt()], ve.prototype, "hass", void 0), e([pt()], ve.prototype, "printerEntities", void 0), e([pt()], ve.prototype, "printerEntityIdPart", void 0), e([ft()], ve.prototype, "spoolList", void 0), ve = e([ye("anycubic-printercard-multicolorbox_view")], ve);
  class be {
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
  const we = {
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
      height: 380
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
  class xe {
    constructor(t, {
      target: e,
      config: i,
      callback: s,
      skipInitial: r
    }) {
      this.t = new Set(), this.o = !1, this.i = !1, this.h = t, null !== e && this.t.add(e ?? t), this.l = i, this.o = r ?? this.o, this.callback = s, window.ResizeObserver ? (this.u = new ResizeObserver(t => {
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
  const Se = {
      keyframeOptions: {
        duration: 2e3,
        direction: "alternate"
      },
      properties: ["left"]
    },
    $e = {
      keyframeOptions: {
        duration: 100
      },
      properties: ["top"]
    };
  let ke = class extends dt {
    constructor() {
      super(...arguments), this._progressNum = 0, this.animKeyframeGantry = 0, this._isPrinting = !1, this._onResizeEvent = () => {
        if (this._rootElement) {
          const t = this._rootElement.clientHeight,
            e = this._rootElement.clientWidth;
          this._setDimensions(e, t);
        }
      };
    }
    connectedCallback() {
      super.connectedCallback(), this.resizeObserver = new xe(this, {
        callback: this._onResizeEvent
      });
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        this._progressNum = Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", 0).state / 100;
        const t = Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state.toLowerCase();
        this._isPrinting = ["printing", "preheating"].includes(t);
      }
    }
    update(t) {
      if (super.update(t), (t.has("dimensions") || t.has("animKeyframeGantry") || t.has("hass")) && this.dimensions) {
        const e = -1 * this._progressNum * this.dimensions.BuildArea.height;
        Mt(this._elAcAPr_xaxis, Object.assign(Object.assign({}, this.dimensions.XAxis), {
          top: this.dimensions.XAxis.top + e
        })), Mt(this._elAcAPr_gantry, Object.assign(Object.assign({}, this.dimensions.Gantry), {
          left: 0 !== this.animKeyframeGantry ? this.dimensions.Gantry.left + this.dimensions.BuildPlate.width : this.dimensions.Gantry.left,
          top: this.dimensions.Gantry.top + e
        })), Mt(this._elAcAPr_animprint, {
          height: 100 * this._progressNum + "%"
        }), t.has("dimensions") && this.dimensions && (Mt(this._elAcAPr_scalable, Object.assign({}, this.dimensions.Scalable)), Mt(this._elAcAPr_frame, Object.assign({}, this.dimensions.Frame)), Mt(this._elAcAPr_hole, Object.assign({}, this.dimensions.Hole)), Mt(this._elAcAPr_buildarea, Object.assign({}, this.dimensions.BuildArea)), Mt(this._elAcAPr_buildplate, Object.assign({}, this.dimensions.BuildPlate)), Mt(this._elAcAPr_nozzle, Object.assign({}, this.dimensions.Nozzle)));
      }
    }
    render() {
      return F`
      <div class="ac-printercard-animatedprinter">
        ${this.dimensions ? F` <div class="ac-apr-scalable">
              <div class="ac-apr-frame">
                <div class="ac-apr-hole"></div>
              </div>
              <div class="ac-apr-buildarea">
                <div class="ac-apr-animprint"></div>
              </div>
              <div class="ac-apr-buildplate"></div>
              <div
                class="ac-apr-xaxis"
                ${me(Object.assign({}, $e))}
              ></div>
              <div
                class="ac-apr-gantry"
                ${me(Object.assign({}, $e))}
                ${this.dimensions && this._isPrinting ? me(Object.assign(Object.assign({}, Se), {
        onComplete: () => this._moveGantry()
      })) : null}
              >
                <div class="ac-apr-nozzle"></div>
              </div>
            </div>` : null}
      </div>
    `;
    }
    _setDimensions(t, e) {
      this.dimensions = function (t, e, i) {
        const s = new be(e.height / (t.top.height + t.bottom.height + t.left.height) * i),
          r = s.val(t.top.width),
          n = s.val(t.top.height + t.bottom.height + t.left.height),
          o = s.val(t.top.width - (t.left.width + t.right.width)),
          a = s.val(t.left.height),
          d = s.val(t.left.width),
          c = s.val(t.top.height),
          h = s.val(t.top.height - t.buildplate.verticalOffset) + a,
          l = h + s.val((t.xAxis.extruder.height - t.xAxis.height) / 2 - (t.xAxis.extruder.height + 12)),
          u = s.val(t.buildplate.maxWidth),
          p = s.val(t.buildplate.maxHeight),
          f = s.val(t.left.width + (s.og(o) - t.buildplate.maxWidth) / 2),
          m = h - s.val(t.buildplate.maxHeight),
          y = u,
          g = f,
          _ = h,
          v = s.val(t.xAxis.width),
          b = s.val(t.xAxis.height),
          w = s.val(t.xAxis.offsetLeft),
          x = v,
          S = b,
          $ = s.val(t.xAxis.extruder.width),
          k = s.val(t.xAxis.extruder.height),
          A = g - $ / 2,
          M = A + u,
          E = s.val(12),
          O = s.val(12),
          D = _ - k - O;
        return {
          Scalable: {
            width: r,
            height: n
          },
          Frame: {
            width: r,
            height: n
          },
          Hole: {
            width: o,
            height: a,
            left: d,
            top: c
          },
          BuildArea: {
            width: u,
            height: p,
            left: f,
            top: m
          },
          BuildPlate: {
            width: y,
            left: g,
            top: _
          },
          XAxis: {
            width: v,
            height: b,
            left: w,
            top: D + .7 * k - b / 2
          },
          Track: {
            width: x,
            height: S
          },
          Basis: {
            Y: h,
            X: l
          },
          Gantry: {
            width: $,
            height: k,
            left: A,
            top: D
          },
          Nozzle: {
            width: E,
            height: O,
            left: ($ - E) / 2,
            top: k
          },
          GantryMaxLeft: M
        };
      }(this.printerConfig, {
        width: t,
        height: e
      }, this.scaleFactor || 1);
    }
    _moveGantry() {
      this.animKeyframeGantry = !this.animKeyframeGantry;
    }
    static get styles() {
      return a`
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
  e([yt(".ac-printercard-animatedprinter")], ke.prototype, "_rootElement", void 0), e([yt(".ac-apr-scalable")], ke.prototype, "_elAcAPr_scalable", void 0), e([yt(".ac-apr-frame")], ke.prototype, "_elAcAPr_frame", void 0), e([yt(".ac-apr-hole")], ke.prototype, "_elAcAPr_hole", void 0), e([yt(".ac-apr-buildarea")], ke.prototype, "_elAcAPr_buildarea", void 0), e([yt(".ac-apr-animprint")], ke.prototype, "_elAcAPr_animprint", void 0), e([yt(".ac-apr-buildplate")], ke.prototype, "_elAcAPr_buildplate", void 0), e([yt(".ac-apr-xaxis")], ke.prototype, "_elAcAPr_xaxis", void 0), e([yt(".ac-apr-gantry")], ke.prototype, "_elAcAPr_gantry", void 0), e([yt(".ac-apr-nozzle")], ke.prototype, "_elAcAPr_nozzle", void 0), e([pt()], ke.prototype, "hass", void 0), e([pt()], ke.prototype, "scaleFactor", void 0), e([pt()], ke.prototype, "printerConfig", void 0), e([pt()], ke.prototype, "printerEntities", void 0), e([pt()], ke.prototype, "printerEntityIdPart", void 0), e([ft()], ke.prototype, "dimensions", void 0), e([ft()], ke.prototype, "resizeObserver", void 0), e([ft()], ke.prototype, "_progressNum", void 0), e([ft({
    type: Number
  })], ke.prototype, "animKeyframeGantry", void 0), e([ft({
    type: Boolean
  })], ke.prototype, "_isPrinting", void 0), ke = e([ye("anycubic-printercard-animated_printer")], ke);
  let Ae = class extends dt {
    render() {
      return F`
      <div
        class="ac-printercard-printerview"
        @click="${t => {
        this._viewClick();
      }}"
      >
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${we}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
    }
    _viewClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return a`
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
  e([pt()], Ae.prototype, "hass", void 0), e([pt({
    type: Function
  })], Ae.prototype, "toggleVideo", void 0), e([pt()], Ae.prototype, "printerEntities", void 0), e([pt()], Ae.prototype, "printerEntityIdPart", void 0), Ae = e([ye("anycubic-printercard-printer_view")], Ae);
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Me = (t, e, i) => {
      const s = new Map();
      for (let r = e; r <= i; r++) s.set(t[r], r);
      return s;
    },
    Ee = Rt(class extends Lt {
      constructor(t) {
        if (super(t), t.type !== Ht) throw Error("repeat() can only be used in text expressions");
      }
      dt(t, e, i) {
        let s;
        void 0 === i ? i = e : void 0 !== e && (s = e);
        const r = [],
          n = [];
        let o = 0;
        for (const e of t) r[o] = s ? s(e, o) : o, n[o] = i(e, o), o++;
        return {
          values: n,
          keys: r
        };
      }
      render(t, e, i) {
        return this.dt(t, e, i).values;
      }
      update(t, [e, i, s]) {
        const r = (t => t._$AH)(t),
          {
            values: n,
            keys: o
          } = this.dt(e, i, s);
        if (!Array.isArray(r)) return this.ut = o, n;
        const a = this.ut ??= [],
          d = [];
        let c,
          h,
          l = 0,
          u = r.length - 1,
          p = 0,
          f = n.length - 1;
        for (; l <= u && p <= f;) if (null === r[l]) l++;else if (null === r[u]) u--;else if (a[l] === o[p]) d[p] = Zt(r[l], n[p]), l++, p++;else if (a[u] === o[f]) d[f] = Zt(r[u], n[f]), u--, f--;else if (a[l] === o[f]) d[f] = Zt(r[l], n[f]), Bt(t, d[f + 1], r[l]), l++, f--;else if (a[u] === o[p]) d[p] = Zt(r[u], n[p]), Bt(t, r[l], r[u]), u--, p++;else if (void 0 === c && (c = Me(o, p, f), h = Me(a, l, u)), c.has(a[l])) {
          if (c.has(a[u])) {
            const e = h.get(o[p]),
              i = void 0 !== e ? r[e] : null;
            if (null === i) {
              const e = Bt(t, r[l]);
              Zt(e, n[p]), d[p] = e;
            } else d[p] = Zt(i, n[p]), Bt(t, r[l], i), r[e] = null;
            p++;
          } else Jt(r[u]), u--;
        } else Jt(r[l]), l++;
        for (; p <= f;) {
          const e = Bt(t, d[f + 1]);
          Zt(e, n[p]), d[p++] = e;
        }
        for (; l <= u;) {
          const t = r[l++];
          null !== t && Jt(t);
        }
        return this.ut = o, ((t, e = qt) => {
          t._$AH = e;
        })(t, d), V;
      }
    });
  let Oe = class extends dt {
    render() {
      return F`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}</p>
      </div>
    `;
    }
    static get styles() {
      return a`
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
      }

      .ac-stat-heading {
        font-weight: bold;
      }
    `;
    }
  };
  e([pt({
    type: String
  })], Oe.prototype, "name", void 0), e([pt({
    type: String
  })], Oe.prototype, "value", void 0), Oe = e([ye("anycubic-printercard-stat-line")], Oe);
  let De = class extends dt {
    render() {
      return F`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${Tt(this.temperatureEntity, this.temperatureUnit, this.round)}
    ></anycubic-printercard-stat-line>`;
    }
    static get styles() {
      return a`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  e([pt({
    type: String
  })], De.prototype, "name", void 0), e([pt()], De.prototype, "temperatureEntity", void 0), e([pt({
    type: Boolean
  })], De.prototype, "round", void 0), e([pt({
    type: String
  })], De.prototype, "temperatureUnit", void 0), De = e([ye("anycubic-printercard-stat-temperature")], De);
  let Ce = class extends dt {
    constructor() {
      super(...arguments), this.currentTime = 0, this.lastIntervalId = -1;
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("timeEntity") && (-1 !== this.lastIntervalId && clearInterval(this.lastIntervalId), this.currentTime = function (t, e = !1) {
        let i;
        if (t.state) {
          if (t.state.includes(", ")) {
            const [e, s] = t.state.split(", "),
              [r, n, o] = s.split(":");
            i = 60 * +e.match(/\d+/)[0] * 60 * 24 + 60 * +r * 60 + 60 * +n + +o;
          } else if (t.state.includes(":")) {
            const [e, s, r] = t.state.split(":");
            i = 60 * +e * 60 + 60 * +s + +r;
          } else i = e ? +t.state : 60 * +t.state;
        } else i = 0;
        return i;
      }(this.timeEntity), this.lastIntervalId = setInterval(() => this._incTime(), 1e3));
    }
    disconnectedCallback() {
      super.disconnectedCallback(), clearInterval(this.lastIntervalId);
    }
    render() {
      return F`<anycubic-printercard-stat-line
      .name=${this.timeType}
      .value=${((t, e, i = !1, s = !1) => {
        switch (e) {
          case wt.Remaining:
            return Pt(t, i);
          case wt.ETA:
            return $t().add(t, "seconds").format(s ? "HH:mm" : "h:mm a");
          case wt.Elapsed:
            return Pt(t, i);
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
      return a`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  e([pt()], Ce.prototype, "timeEntity", void 0), e([pt()], Ce.prototype, "timeType", void 0), e([pt({
    type: Number
  })], Ce.prototype, "direction", void 0), e([pt({
    type: Boolean
  })], Ce.prototype, "round", void 0), e([pt({
    type: Boolean
  })], Ce.prototype, "use_24hr", void 0), e([pt({
    type: Boolean
  })], Ce.prototype, "isSeconds", void 0), e([ft({
    type: Number
  })], Ce.prototype, "currentTime", void 0), e([ft({
    type: Number
  })], Ce.prototype, "lastIntervalId", void 0), Ce = e([ye("anycubic-printercard-stat-time")], Ce);
  let Pe = class extends dt {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = xt.C, this.progressPercent = 0;
    }
    render() {
      return F`
      <div class="ac-stats-component">
        ${this.showPercent ? F`
              <div class="ac-stats-part-percent">
                <p class="ac-stats-part-percent-text">
                  ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
                </p>
              </div>
            ` : null}
        <div class="ac-stats-part-monitored">${this._renderStats()}</div>
      </div>
    `;
    }
    _renderStats() {
      return Ee(this.monitoredStats, t => t, (t, e) => {
        switch (t) {
          case kt.Status:
            return F`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${(i = Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state, i.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" "))}
              ></anycubic-printercard-stat-line>
            `;
          case kt.ETA:
            return F`
              <anycubic-printercard-stat-time
                .timeEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case kt.Elapsed:
            return F`
              <anycubic-printercard-stat-time
                .timeEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_elapsed")}
                .timeType=${t}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case kt.Remaining:
            return F`
              <anycubic-printercard-stat-time
                .timeEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case kt.BedCurrent:
            return F`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case kt.HotendCurrent:
            return F`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case kt.BedTarget:
            return F`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case kt.HotendTarget:
            return F`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          default:
            return F`
              <anycubic-printercard-stat-line
                .name=${"Unknown"}
                .value=${"<unknown>"}
              ></anycubic-printercard-stat-line>
            `;
        }
        var i;
      });
    }
    static get styles() {
      return a`
      :host {
        box-sizing: border-box;
        width: 100%;
      }

      .ac-stats-component {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .ac-stats-part-percent {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
      }
      .ac-stats-part-percent-text {
        margin: 0px;
        font-size: 42px;
        font-weight: bold;
        height: 44px;
        line-height: 44px;
      }

      .ac-stats-part-monitored {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `;
    }
  };
  e([pt()], Pe.prototype, "hass", void 0), e([pt()], Pe.prototype, "monitoredStats", void 0), e([pt({
    type: Boolean
  })], Pe.prototype, "showPercent", void 0), e([pt({
    type: Boolean
  })], Pe.prototype, "round", void 0), e([pt({
    type: Boolean
  })], Pe.prototype, "use_24hr", void 0), e([pt({
    type: String
  })], Pe.prototype, "temperatureUnit", void 0), e([pt()], Pe.prototype, "printerEntities", void 0), e([pt()], Pe.prototype, "printerEntityIdPart", void 0), e([pt()], Pe.prototype, "progressPercent", void 0), Pe = e([ye("anycubic-printercard-stats-component")], Pe);
  const Ye = {
      keyframeOptions: {
        duration: 250,
        direction: "normal",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    Te = It();
  let Ie = class extends dt {
    constructor() {
      super(...arguments), this.monitoredStats = Te, this.round = !0, this.temperatureUnit = xt.C, this._showVideo = !1, this.cameraEntityState = void 0, this.isHidden = !1, this.hiddenOverride = !1, this.hasColorbox = !1, this.lightIsOn = !1, this.statusColor = "#ffc107", this.progressPercent = 0;
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("monitoredStats") && (this.monitoredStats = Nt(this.monitoredStats, Te)), t.has("selectedPrinterID") && (this.printerEntities = function (t, e) {
        const i = {};
        for (const s in t.entities) {
          const r = t.entities[s];
          r.device_id === e && (i[r.entity_id] = r);
        }
        return i;
      }(this.hass, this.selectedPrinterID), this.printerEntityIdPart = function (t) {
        for (const e in t) {
          const t = e.split("."),
            i = t[0],
            s = t[1];
          if ("binary_sensor" === i && s.endsWith("printer_online")) return s.split("printer_online")[0];
        }
      }(this.printerEntities)), t.has("hass") || t.has("selectedPrinterID")) {
        this.progressPercent = this._percentComplete(), this.hasColorbox = "active" === Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "inactive").state, this.cameraEntityId && (this.cameraEntityState = Et(this.hass, {
          entity_id: this.cameraEntityId
        })), this.lightIsOn = Ot(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
        const t = Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state", "unknown").state.toLowerCase();
        this.isHidden = !["printing", "preheating"].includes(t) && !this.hiddenOverride, this.statusColor = ["printing", "preheating"].includes(t) ? "#4caf50" : "unknown" === t ? "#f44336" : "operational" === t || "finished" === t ? "#00bcd4" : "#ffc107", this.lightIsOn = Ot(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
      }
    }
    render() {
      const t = {
        "ac-hidden": !0 !== this._showVideo
      };
      return F`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        <anycubic-printercard-camera_view
          class="${jt(t)}"
          .showVideo=${this._showVideo}
          .toggleVideo=${() => this._toggleVideo()}
          .cameraEntity=${this.cameraEntityState}
        ></anycubic-printercard-camera_view>
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
      return F`
      <div class="ac-printer-card-header ${jt(e)}">
        ${this.powerEntityId ? F`
              <button
                class="ac-printer-card-button-small"
                @click="${t => {
        this._togglePowerEntity();
      }}"
              >
                <ha-svg-icon .path=${"M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"}></ha-svg-icon>
              </button>
            ` : null}

        <button
          class="ac-printer-card-button-name"
          @click="${t => {
        this._toggleHiddenOveride();
      }}"
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${Ft(i)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${null === (t = this.selectedPrinterDevice) || void 0 === t ? void 0 : t.name}
          </p>
        </button>
        ${this.lightEntityId ? F`
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
            ` : null}
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
        };
      return F`
      <div
        class="ac-printer-card-infocontainer ${jt(t)}"
        style=${Ft(e)}
        ${me(Object.assign({}, Ye))}
      >
        <div
          class="ac-printer-card-info-animcontainer ${jt(t)}"
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .toggleVideo=${() => this._toggleVideo()}
          ></anycubic-printercard-printer_view>
          ${this.vertical ? F`<p class="ac-printer-card-info-vertprog">
                ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
              </p>` : null}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${jt(t)}"
        >
          <anycubic-printercard-stats-component
            .hass=${this.hass}
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
      ${this._renderMultiColorBoxContainer()}
    `;
    }
    _toggleVideo() {
      this._showVideo = !(!this.cameraEntityState || this._showVideo);
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
      return this.hasColorbox ? F`
          <div
            class="ac-printer-card-infocontainer ${jt(t)}"
            style=${Ft(e)}
            ${me(Object.assign({}, Ye))}
          >
            <div class="ac-printer-card-mcbsection ${jt(t)}">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : null;
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
      return Ct(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", -1).state;
    }
    static get styles() {
      return a`
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
        padding: 0px 16px 32px 16px;
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-left: 16px;
        padding-right: 16px;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
      }

      anycubic-printercard-printer_view {
        width: 100%;
        flex-glow: 1;
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
        padding: 0px 16px 32px 16px;
        padding-left: 16px;
        padding-right: 32px;
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
        padding: 5px 32px 5px 32px;
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
  e([pt()], Ie.prototype, "hass", void 0), e([pt()], Ie.prototype, "monitoredStats", void 0), e([pt()], Ie.prototype, "selectedPrinterID", void 0), e([pt()], Ie.prototype, "selectedPrinterDevice", void 0), e([pt({
    type: Boolean
  })], Ie.prototype, "round", void 0), e([pt({
    type: Boolean
  })], Ie.prototype, "use_24hr", void 0), e([pt({
    type: String
  })], Ie.prototype, "temperatureUnit", void 0), e([pt({
    type: String
  })], Ie.prototype, "lightEntityId", void 0), e([pt({
    type: String
  })], Ie.prototype, "powerEntityId", void 0), e([pt({
    type: String
  })], Ie.prototype, "cameraEntityId", void 0), e([pt({
    type: Boolean
  })], Ie.prototype, "vertical", void 0), e([ft()], Ie.prototype, "_showVideo", void 0), e([ft()], Ie.prototype, "cameraEntityState", void 0), e([ft({
    type: Boolean
  })], Ie.prototype, "isHidden", void 0), e([ft({
    type: Boolean
  })], Ie.prototype, "hiddenOverride", void 0), e([ft({
    type: Boolean
  })], Ie.prototype, "hasColorbox", void 0), e([ft({
    type: Boolean
  })], Ie.prototype, "lightIsOn", void 0), e([ft({
    type: String
  })], Ie.prototype, "statusColor", void 0), e([ft()], Ie.prototype, "printerEntities", void 0), e([ft()], Ie.prototype, "printerEntityIdPart", void 0), e([ft()], Ie.prototype, "progressPercent", void 0), Ie = e([ye("anycubic-printercard-card")], Ie);
  const Ne = ["light"],
    Ue = ["switch"],
    He = ["camera"];
  let Re = class extends dt {
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
      return F`
      <button
        class="ac-ui-msr-select"
        @click="${t => {
        this.toggle(this.item);
      }}"
      >
        ${this._isActive ? F`<ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>` : G}
      </button>
      <p class="ac-ui-msr-itemtext ${jt(t)}">
        ${this.item}
      </p>
      <div>
        <button
          class="ac-ui-msr-position"
          @click="${t => {
        this.reorder(this.item, 1);
      }}"
        >
          <ha-svg-icon .path=${"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}></ha-svg-icon>
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
      return a`
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
  e([pt()], Re.prototype, "item", void 0), e([pt()], Re.prototype, "selectedItems", void 0), e([pt()], Re.prototype, "unusedItems", void 0), e([pt()], Re.prototype, "reorder", void 0), e([pt()], Re.prototype, "toggle", void 0), e([ft()], Re.prototype, "_isActive", void 0), Re = e([ye("anycubic-ui-multi-select-reorder-item")], Re);
  let Le = class extends dt {
    async firstUpdated() {
      this._allOptions = Object.values(this.availableOptions), this._selectedItems = [...this.initialItems], this._unusedItems = this._allOptions.filter(t => !this.initialItems.includes(t)), this.requestUpdate();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("_selectedItems") && this.onChange(this._selectedItems);
    }
    render() {
      const t = {
        height: this._allOptions ? String(56 * this._allOptions.length) + "px" : "0px"
      };
      return this._allOptions ? F`
          <div style=${Ft(t)}>
            ${_e(this._allOptions, (t, e) => F`
                <anycubic-ui-multi-select-reorder-item
                  .item=${t}
                  .selectedItems=${this._selectedItems}
                  .unusedItems=${this._unusedItems}
                  .reorder=${(t, e) => this._reorder(t, e)}
                  .toggle=${t => this._toggle(t)}
                ></anycubic-ui-multi-select-reorder-item>
              `)}
          </div>
        ` : G;
    }
    _reorder(t, e) {
      const i = this._selectedItems.indexOf(t),
        s = i + e;
      if (s < 0 || s > this._selectedItems.length - 1) return;
      const r = this._selectedItems.slice(0),
        n = r[s];
      r[s] = t, r[i] = n, this._selectedItems = r;
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
      return a`
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
  e([pt()], Le.prototype, "availableOptions", void 0), e([pt()], Le.prototype, "initialItems", void 0), e([pt()], Le.prototype, "onChange", void 0), e([ft()], Le.prototype, "_allOptions", void 0), e([ft()], Le.prototype, "_selectedItems", void 0), e([ft()], Le.prototype, "_unusedItems", void 0), Le = e([ye("anycubic-ui-multi-select-reorder")], Le);
  let je = class extends dt {
    constructor() {
      super(...arguments), this.formSchema = [], this._computeLabel = t => {
        switch (t.name) {
          case "printer_id":
          default:
            return "Select Printer";
          case "vertical":
            return "Vertical Layout?";
          case "round":
            return "Round Stats?";
          case "use_24hr":
            return "Use 24hr Time?";
          case "temperatureUnit":
            return "Temperature Unit";
          case "lightEntityId":
            return "Light Entity";
          case "powerEntityId":
            return "Power Entity";
          case "cameraEntityId":
            return "Camera Entity";
        }
      };
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("printers") && (this.formSchema = this._computeSchema());
    }
    render() {
      return F`
      <div class="ac-printer-card-configure-cont">
        <div class="ac-printer-card-configure-conf">
          <ha-form
            .hass=${this.hass}
            .data=${this.cardConfig}
            .schema=${this.formSchema}
            .computeLabel=${this._computeLabel}
            @value-changed=${this._formValueChanged}
          ></ha-form>
        </div>
        <div class="ac-printer-card-configure-advanced">
          <p class="ac-cconf-label">Choose Monitored Stats</p>
          <anycubic-ui-multi-select-reorder
            .availableOptions=${kt}
            .initialItems=${this.cardConfig.monitoredStats}
            .onChange=${t => this._selectedStatsChanged(t)}
          ></anycubic-ui-multi-select-reorder>
        </div>
      </div>
    `;
    }
    _selectedStatsChanged(t) {
      this.cardConfig.monitoredStats = t, this._configChanged(this.cardConfig);
    }
    _configChanged(t) {
      const e = new Event("config-changed", {
        bubbles: !0,
        composed: !0
      });
      e.detail = {
        config: t
      }, this.dispatchEvent(e);
    }
    _formValueChanged(t) {
      this.cardConfig = t.detail.value, this._configChanged(this.cardConfig);
    }
    _computeSchema() {
      const t = Object.keys(this.printers).map((t, e) => ({
        value: t,
        label: this.printers[t].name
      }));
      return this.printers ? [{
        name: "printer_id",
        selector: {
          select: {
            options: t,
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
              value: xt.C,
              label: `°${xt.C}`
            }, {
              value: xt.F,
              label: `°${xt.F}`
            }],
            mode: "list",
            multiple: !1
          }
        }
      }, {
        name: "lightEntityId",
        selector: {
          entity: {
            domain: Ne
          }
        }
      }, {
        name: "powerEntityId",
        selector: {
          entity: {
            domain: Ue
          }
        }
      }, {
        name: "cameraEntityId",
        selector: {
          entity: {
            domain: He
          }
        }
      }] : [];
    }
    static get styles() {
      return a`
      :host {
        display: block;
      }

      .ac-printer-card-configure-advanced {
        margin-top: 30px;
      }

      .ac-cconf-label {
        margin-bottom: 4px;
        font-weight: bold;
        font-size: 14px;
      }
    `;
    }
  };
  e([pt()], je.prototype, "hass", void 0), e([pt()], je.prototype, "cardConfig", void 0), e([pt()], je.prototype, "printers", void 0), e([ft()], je.prototype, "selectedPrinterDevice", void 0), e([ft()], je.prototype, "formSchema", void 0), je = e([ht("anycubic-printercard-configure")], je);
  const We = {
    vertical: !1,
    round: !1,
    use_24hr: !0,
    temperatureUnit: xt.C,
    monitoredStats: It()
  };
  t.AnycubicPrintercardEditor = class extends dt {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Dt(this.hass);
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("config") && (this.config.vertical = Nt(this.config.vertical, We.vertical), this.config.round = Nt(this.config.round, We.round), this.config.use_24hr = Nt(this.config.use_24hr, We.use_24hr), this.config.temperatureUnit = Nt(this.config.temperatureUnit, We.temperatureUnit), this.config.monitoredStats = Nt(this.config.monitoredStats, We.monitoredStats));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return F`
      <anycubic-printercard-configure
        .hass=${this.hass}
        .printers=${this.printers}
        .cardConfig=${this.config}
      ></anycubic-printercard-configure>
    `;
    }
  }, e([pt()], t.AnycubicPrintercardEditor.prototype, "hass", void 0), e([pt()], t.AnycubicPrintercardEditor.prototype, "config", void 0), e([ft()], t.AnycubicPrintercardEditor.prototype, "printers", void 0), t.AnycubicPrintercardEditor = e([ht("anycubic-card-editor")], t.AnycubicPrintercardEditor), t.AnycubicCard = class extends dt {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Dt(this.hass), this.requestUpdate();
    }
    willUpdate(t) {
      var e, i;
      super.willUpdate(t), (t.has("config") || t.has("printers")) && (this.vertical = Nt(this.config.vertical, We.vertical), this.round = Nt(this.config.round, We.round), this.use_24hr = Nt(this.config.use_24hr, We.use_24hr), this.temperatureUnit = Nt(this.config.temperatureUnit, We.temperatureUnit), this.lightEntityId = this.config.lightEntityId, this.powerEntityId = this.config.powerEntityId, this.cameraEntityId = this.config.cameraEntityId, this.monitoredStats = this.config.monitoredStats, this.config.printer_id && this.printers && (this.selectedPrinterID = this.config.printer_id, this.selectedPrinterDevice = (e = this.printers, i = this.config.printer_id, e && i ? e[i] : void 0)));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return F`
      <anycubic-printercard-card
        .hass=${this.hass}
        .monitoredStats=${this.config.monitoredStats}
        .selectedPrinterID=${this.selectedPrinterID}
        .selectedPrinterDevice=${this.selectedPrinterDevice}
        .vertical=${this.vertical}
        .round=${this.round}
        .use_24hr=${this.use_24hr}
        .temperatureUnit=${this.temperatureUnit}
        .lightEntityId=${this.lightEntityId}
        .powerEntityId=${this.powerEntityId}
        .cameraEntityId=${this.cameraEntityId}
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
        printer_id: Object.keys(Dt(t))[0]
      };
    }
  }, e([pt()], t.AnycubicCard.prototype, "hass", void 0), e([pt()], t.AnycubicCard.prototype, "config", void 0), e([ft()], t.AnycubicCard.prototype, "printers", void 0), e([ft()], t.AnycubicCard.prototype, "selectedPrinterID", void 0), e([ft()], t.AnycubicCard.prototype, "selectedPrinterDevice", void 0), e([ft({
    type: Boolean
  })], t.AnycubicCard.prototype, "vertical", void 0), e([ft({
    type: Boolean
  })], t.AnycubicCard.prototype, "round", void 0), e([ft({
    type: Boolean
  })], t.AnycubicCard.prototype, "use_24hr", void 0), e([ft({
    type: String
  })], t.AnycubicCard.prototype, "temperatureUnit", void 0), e([ft({
    type: String
  })], t.AnycubicCard.prototype, "lightEntityId", void 0), e([ft({
    type: String
  })], t.AnycubicCard.prototype, "powerEntityId", void 0), e([ft({
    type: String
  })], t.AnycubicCard.prototype, "cameraEntityId", void 0), e([ft()], t.AnycubicCard.prototype, "monitoredStats", void 0), t.AnycubicCard = e([ht("anycubic-card")], t.AnycubicCard), window.customCards = window.customCards || [], window.customCards.push({
    type: "anycubic-card",
    name: "Anycubic Card",
    preview: !0,
    description: "Anycubic Cloud Integration Card"
  }), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
