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
  const a = t => new o("string" == typeof t ? t : t + "", void 0, r),
    l = (t, ...e) => {
      const i = 1 === t.length ? t[0] : e.reduce((e, i, s) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + t[s + 1], t[0]);
      return new o(i, t, r);
    },
    c = s ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const i of t.cssRules) e += i.cssText;
      return a(e);
    })(t) : t
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    {
      is: d,
      defineProperty: h,
      getOwnPropertyDescriptor: u,
      getOwnPropertyNames: p,
      getOwnPropertySymbols: m,
      getPrototypeOf: f
    } = Object,
    g = globalThis,
    y = g.trustedTypes,
    v = y ? y.emptyScript : "",
    b = g.reactiveElementPolyfillSupport,
    _ = (t, e) => t,
    x = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? v : null;
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
    w = (t, e) => !d(t, e),
    $ = {
      attribute: !0,
      type: String,
      converter: x,
      reflect: !1,
      hasChanged: w
    };
  Symbol.metadata ??= Symbol("metadata"), g.litPropertyMetadata ??= new WeakMap();
  class k extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = $) {
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
      } = u(this.prototype, t) ?? {
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
      return this.elementProperties.get(t) ?? $;
    }
    static _$Ei() {
      if (this.hasOwnProperty(_("elementProperties"))) return;
      const t = f(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(_("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
        const t = this.properties,
          e = [...p(t), ...m(t)];
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
        for (const t of i) e.unshift(c(t));
      } else void 0 !== t && e.push(c(t));
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
        const r = (void 0 !== i.converter?.toAttribute ? i.converter : x).toAttribute(e, i.type);
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
          } : void 0 !== t.converter?.fromAttribute ? t.converter : x;
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
  k.elementStyles = [], k.shadowRootOptions = {
    mode: "open"
  }, k[_("elementProperties")] = new Map(), k[_("finalized")] = new Map(), b?.({
    ReactiveElement: k
  }), (g.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const S = globalThis,
    A = S.trustedTypes,
    C = A ? A.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    E = "$lit$",
    M = `lit$${Math.random().toFixed(9).slice(2)}$`,
    D = "?" + M,
    O = `<${D}>`,
    P = document,
    F = () => P.createComment(""),
    Y = t => null === t || "object" != typeof t && "function" != typeof t,
    T = Array.isArray,
    I = t => T(t) || "function" == typeof t?.[Symbol.iterator],
    N = "[ \t\n\f\r]",
    H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    U = /-->/g,
    L = />/g,
    R = RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    j = /'/g,
    z = /"/g,
    B = /^(?:script|style|textarea|title)$/i,
    V = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    W = Symbol.for("lit-noChange"),
    G = Symbol.for("lit-nothing"),
    q = new WeakMap(),
    Z = P.createTreeWalker(P, 129);
  function X(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== C ? C.createHTML(e) : e;
  }
  const K = (t, e) => {
    const i = t.length - 1,
      s = [];
    let r,
      n = 2 === e ? "<svg>" : "",
      o = H;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        l,
        c = -1,
        d = 0;
      for (; d < i.length && (o.lastIndex = d, l = o.exec(i), null !== l);) d = o.lastIndex, o === H ? "!--" === l[1] ? o = U : void 0 !== l[1] ? o = L : void 0 !== l[2] ? (B.test(l[2]) && (r = RegExp("</" + l[2], "g")), o = R) : void 0 !== l[3] && (o = R) : o === R ? ">" === l[0] ? (o = r ?? H, c = -1) : void 0 === l[1] ? c = -2 : (c = o.lastIndex - l[2].length, a = l[1], o = void 0 === l[3] ? R : '"' === l[3] ? z : j) : o === z || o === j ? o = R : o === U || o === L ? o = H : (o = R, r = void 0);
      const h = o === R && t[e + 1].startsWith("/>") ? " " : "";
      n += o === H ? i + O : c >= 0 ? (s.push(a), i.slice(0, c) + E + i.slice(c) + M + h) : i + M + (-2 === c ? e : h);
    }
    return [X(t, n + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), s];
  };
  class J {
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
        [l, c] = K(t, e);
      if (this.el = J.createElement(l, i), Z.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (s = Z.nextNode()) && a.length < o;) {
        if (1 === s.nodeType) {
          if (s.hasAttributes()) for (const t of s.getAttributeNames()) if (t.endsWith(E)) {
            const e = c[n++],
              i = s.getAttribute(t).split(M),
              o = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: r,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? st : "?" === o[1] ? rt : "@" === o[1] ? nt : it
            }), s.removeAttribute(t);
          } else t.startsWith(M) && (a.push({
            type: 6,
            index: r
          }), s.removeAttribute(t));
          if (B.test(s.tagName)) {
            const t = s.textContent.split(M),
              e = t.length - 1;
            if (e > 0) {
              s.textContent = A ? A.emptyScript : "";
              for (let i = 0; i < e; i++) s.append(t[i], F()), Z.nextNode(), a.push({
                type: 2,
                index: ++r
              });
              s.append(t[e], F());
            }
          }
        } else if (8 === s.nodeType) if (s.data === D) a.push({
          type: 2,
          index: r
        });else {
          let t = -1;
          for (; -1 !== (t = s.data.indexOf(M, t + 1));) a.push({
            type: 7,
            index: r
          }), t += M.length - 1;
        }
        r++;
      }
    }
    static createElement(t, e) {
      const i = P.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function Q(t, e, i = t, s) {
    if (e === W) return e;
    let r = void 0 !== s ? i._$Co?.[s] : i._$Cl;
    const n = Y(e) ? void 0 : e._$litDirective$;
    return r?.constructor !== n && (r?._$AO?.(!1), void 0 === n ? r = void 0 : (r = new n(t), r._$AT(t, i, s)), void 0 !== s ? (i._$Co ??= [])[s] = r : i._$Cl = r), void 0 !== r && (e = Q(t, r._$AS(t, e.values), r, s)), e;
  }
  class tt {
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
        s = (t?.creationScope ?? P).importNode(e, !0);
      Z.currentNode = s;
      let r = Z.nextNode(),
        n = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (n === a.index) {
          let e;
          2 === a.type ? e = new et(r, r.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(r, a.name, a.strings, this, t) : 6 === a.type && (e = new ot(r, this, t)), this._$AV.push(e), a = i[++o];
        }
        n !== a?.index && (r = Z.nextNode(), n++);
      }
      return Z.currentNode = P, s;
    }
    p(t) {
      let e = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
    }
  }
  class et {
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
      t = Q(this, t, e), Y(t) ? t === G || null == t || "" === t ? (this._$AH !== G && this._$AR(), this._$AH = G) : t !== this._$AH && t !== W && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : I(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== G && Y(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        s = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = J.createElement(X(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === s) this._$AH.p(e);else {
        const t = new tt(s, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = q.get(t.strings);
      return void 0 === e && q.set(t.strings, e = new J(t)), e;
    }
    k(t) {
      T(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        s = 0;
      for (const r of t) s === e.length ? e.push(i = new et(this.S(F()), this.S(F()), this, this.options)) : i = e[s], i._$AI(r), s++;
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
  class it {
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
      if (void 0 === r) t = Q(this, t, e, 0), n = !Y(t) || t !== this._$AH && t !== W, n && (this._$AH = t);else {
        const s = t;
        let o, a;
        for (t = r[0], o = 0; o < r.length - 1; o++) a = Q(this, s[i + o], e, o), a === W && (a = this._$AH[o]), n ||= !Y(a) || a !== this._$AH[o], a === G ? t = G : t !== G && (t += (a ?? "") + r[o + 1]), this._$AH[o] = a;
      }
      n && !s && this.j(t);
    }
    j(t) {
      t === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class st extends it {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === G ? void 0 : t;
    }
  }
  class rt extends it {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== G);
    }
  }
  class nt extends it {
    constructor(t, e, i, s, r) {
      super(t, e, i, s, r), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = Q(this, t, e, 0) ?? G) === W) return;
      const i = this._$AH,
        s = t === G && i !== G || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        r = t !== G && (i === G || s);
      s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class ot {
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
  const at = {
      P: E,
      A: M,
      C: D,
      M: 1,
      L: K,
      R: tt,
      D: I,
      V: Q,
      I: et,
      H: it,
      N: rt,
      U: nt,
      B: st,
      F: ot
    },
    lt = S.litHtmlPolyfillSupport;
  lt?.(J, et), (S.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class ct extends k {
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
          s._$litPart$ = r = new et(e.insertBefore(F(), t), t, void 0, i ?? {});
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
      return W;
    }
  }
  ct._$litElement$ = !0, ct.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: ct
  });
  const dt = globalThis.litElementPolyfillSupport;
  dt?.({
    LitElement: ct
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
    ut = {
      attribute: !0,
      type: String,
      converter: x,
      reflect: !1,
      hasChanged: w
    },
    pt = (t = ut, e, i) => {
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
  function mt(t) {
    return (e, i) => "object" == typeof i ? pt(t, e, i) : ((t, e, i) => {
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
    return mt({
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
  const gt = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && "object" != typeof e && Object.defineProperty(t, e, i), i)
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
        return gt(i, s, {
          get() {
            let i = t.call(this);
            return void 0 === i && (i = n(this), (null !== i || this.hasUpdated) && e.call(this, i)), i;
          }
        });
      }
      return gt(i, s, {
        get() {
          return n(this);
        }
      });
    };
  }
  "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
  function vt(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  function bt(t) {
    throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var _t,
    xt = {
      exports: {}
    };
  (_t = xt).exports = function () {
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
    function l(t) {
      return void 0 === t;
    }
    function c(t) {
      return "number" == typeof t || "[object Number]" === Object.prototype.toString.call(t);
    }
    function d(t) {
      return t instanceof Date || "[object Date]" === Object.prototype.toString.call(t);
    }
    function h(t, e) {
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
      return qi(t, e, i, s, !0).utc();
    }
    function m() {
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
    function f(t) {
      return null == t._pf && (t._pf = m()), t._pf;
    }
    function g(t) {
      var i = null,
        s = !1,
        r = t._d && !isNaN(t._d.getTime());
      return r && (i = f(t), s = e.call(i.parsedDateParts, function (t) {
        return null != t;
      }), r = i.overflow < 0 && !i.empty && !i.invalidEra && !i.invalidMonth && !i.invalidWeekday && !i.weekdayMismatch && !i.nullInput && !i.invalidFormat && !i.userInvalidated && (!i.meridiem || i.meridiem && s), t._strict && (r = r && 0 === i.charsLeftOver && 0 === i.unusedTokens.length && void 0 === i.bigHour)), null != Object.isFrozen && Object.isFrozen(t) ? r : (t._isValid = r, t._isValid);
    }
    function y(t) {
      var e = p(NaN);
      return null != t ? u(f(e), t) : f(e).userInvalidated = !0, e;
    }
    e = Array.prototype.some ? Array.prototype.some : function (t) {
      var e,
        i = Object(this),
        s = i.length >>> 0;
      for (e = 0; e < s; e++) if (e in i && t.call(this, i[e], e, i)) return !0;
      return !1;
    };
    var v = i.momentProperties = [],
      b = !1;
    function _(t, e) {
      var i,
        s,
        r,
        n = v.length;
      if (l(e._isAMomentObject) || (t._isAMomentObject = e._isAMomentObject), l(e._i) || (t._i = e._i), l(e._f) || (t._f = e._f), l(e._l) || (t._l = e._l), l(e._strict) || (t._strict = e._strict), l(e._tzm) || (t._tzm = e._tzm), l(e._isUTC) || (t._isUTC = e._isUTC), l(e._offset) || (t._offset = e._offset), l(e._pf) || (t._pf = f(e)), l(e._locale) || (t._locale = e._locale), n > 0) for (i = 0; i < n; i++) l(r = e[s = v[i]]) || (t[s] = r);
      return t;
    }
    function x(t) {
      _(this, t), this._d = new Date(null != t._d ? t._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === b && (b = !0, i.updateOffset(this), b = !1);
    }
    function w(t) {
      return t instanceof x || null != t && null != t._isAMomentObject;
    }
    function $(t) {
      !1 === i.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t);
    }
    function k(t, e) {
      var s = !0;
      return u(function () {
        if (null != i.deprecationHandler && i.deprecationHandler(null, t), s) {
          var r,
            n,
            a,
            l = [],
            c = arguments.length;
          for (n = 0; n < c; n++) {
            if (r = "", "object" == typeof arguments[n]) {
              for (a in r += "\n[" + n + "] ", arguments[0]) o(arguments[0], a) && (r += a + ": " + arguments[0][a] + ", ");
              r = r.slice(0, -2);
            } else r = arguments[n];
            l.push(r);
          }
          $(t + "\nArguments: " + Array.prototype.slice.call(l).join("") + "\n" + new Error().stack), s = !1;
        }
        return e.apply(this, arguments);
      }, e);
    }
    var S,
      A = {};
    function C(t, e) {
      null != i.deprecationHandler && i.deprecationHandler(t, e), A[t] || ($(e), A[t] = !0);
    }
    function E(t) {
      return "undefined" != typeof Function && t instanceof Function || "[object Function]" === Object.prototype.toString.call(t);
    }
    function M(t) {
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
    function O(t) {
      null != t && this.set(t);
    }
    i.suppressDeprecationWarnings = !1, i.deprecationHandler = null, S = Object.keys ? Object.keys : function (t) {
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
    function F(t, e, i) {
      var s = this._calendar[t] || this._calendar.sameElse;
      return E(s) ? s.call(e, i) : s;
    }
    function Y(t, e, i) {
      var s = "" + Math.abs(t),
        r = e - s.length;
      return (t >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, r)).toString().substr(1) + s;
    }
    var T = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      I = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      N = {},
      H = {};
    function U(t, e, i, s) {
      var r = s;
      "string" == typeof s && (r = function () {
        return this[s]();
      }), t && (H[t] = r), e && (H[e[0]] = function () {
        return Y(r.apply(this, arguments), e[1], e[2]);
      }), i && (H[i] = function () {
        return this.localeData().ordinal(r.apply(this, arguments), t);
      });
    }
    function L(t) {
      return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
    }
    function R(t) {
      var e,
        i,
        s = t.match(T);
      for (e = 0, i = s.length; e < i; e++) H[s[e]] ? s[e] = H[s[e]] : s[e] = L(s[e]);
      return function (e) {
        var r,
          n = "";
        for (r = 0; r < i; r++) n += E(s[r]) ? s[r].call(e, t) : s[r];
        return n;
      };
    }
    function j(t, e) {
      return t.isValid() ? (e = z(e, t.localeData()), N[e] = N[e] || R(e), N[e](t)) : t.localeData().invalidDate();
    }
    function z(t, e) {
      var i = 5;
      function s(t) {
        return e.longDateFormat(t) || t;
      }
      for (I.lastIndex = 0; i >= 0 && I.test(t);) t = t.replace(I, s), I.lastIndex = 0, i -= 1;
      return t;
    }
    var B = {
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
      return e || !i ? e : (this._longDateFormat[t] = i.match(T).map(function (t) {
        return "MMMM" === t || "MM" === t || "DD" === t || "dddd" === t ? t.slice(1) : t;
      }).join(""), this._longDateFormat[t]);
    }
    var W = "Invalid date";
    function G() {
      return this._invalidDate;
    }
    var q = "%d",
      Z = /\d{1,2}/;
    function X(t) {
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
    function J(t, e, i, s) {
      var r = this._relativeTime[i];
      return E(r) ? r(t, e, i, s) : r.replace(/%d/i, t);
    }
    function Q(t, e) {
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
      lt = /\d{3}/,
      ct = /\d{4}/,
      dt = /[+-]?\d{6}/,
      ht = /\d\d?/,
      ut = /\d\d\d\d?/,
      pt = /\d\d\d\d\d\d?/,
      mt = /\d{1,3}/,
      ft = /\d{1,4}/,
      gt = /[+-]?\d{1,6}/,
      yt = /\d+/,
      vt = /[+-]?\d+/,
      xt = /Z|[+-]\d\d:?\d\d/gi,
      wt = /Z|[+-]\d\d(?::?\d\d)?/gi,
      $t = /[+-]?\d+(\.\d{1,3})?/,
      kt = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      St = /^[1-9]\d?/,
      At = /^([1-9]\d|\d)/;
    function Ct(t, e, i) {
      nt[t] = E(e) ? e : function (t, s) {
        return t && i ? i : e;
      };
    }
    function Et(t, e) {
      return o(nt, t) ? nt[t](e._strict, e._locale) : new RegExp(Mt(t));
    }
    function Mt(t) {
      return Dt(t.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (t, e, i, s, r) {
        return e || i || s || r;
      }));
    }
    function Dt(t) {
      return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function Ot(t) {
      return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
    }
    function Pt(t) {
      var e = +t,
        i = 0;
      return 0 !== e && isFinite(e) && (i = Ot(e)), i;
    }
    nt = {};
    var Ft = {};
    function Yt(t, e) {
      var i,
        s,
        r = e;
      for ("string" == typeof t && (t = [t]), c(e) && (r = function (t, i) {
        i[e] = Pt(t);
      }), s = t.length, i = 0; i < s; i++) Ft[t[i]] = r;
    }
    function Tt(t, e) {
      Yt(t, function (t, i, s, r) {
        s._w = s._w || {}, e(t, s._w, s, r);
      });
    }
    function It(t, e, i) {
      null != e && o(Ft, t) && Ft[t](e, i._a, i, t);
    }
    function Nt(t) {
      return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
    }
    var Ht = 0,
      Ut = 1,
      Lt = 2,
      Rt = 3,
      jt = 4,
      zt = 5,
      Bt = 6,
      Vt = 7,
      Wt = 8;
    function Gt(t) {
      return Nt(t) ? 366 : 365;
    }
    U("Y", 0, 0, function () {
      var t = this.year();
      return t <= 9999 ? Y(t, 4) : "+" + t;
    }), U(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    }), U(0, ["YYYY", 4], 0, "year"), U(0, ["YYYYY", 5], 0, "year"), U(0, ["YYYYYY", 6, !0], 0, "year"), Ct("Y", vt), Ct("YY", ht, at), Ct("YYYY", ft, ct), Ct("YYYYY", gt, dt), Ct("YYYYYY", gt, dt), Yt(["YYYYY", "YYYYYY"], Ht), Yt("YYYY", function (t, e) {
      e[Ht] = 2 === t.length ? i.parseTwoDigitYear(t) : Pt(t);
    }), Yt("YY", function (t, e) {
      e[Ht] = i.parseTwoDigitYear(t);
    }), Yt("Y", function (t, e) {
      e[Ht] = parseInt(t, 10);
    }), i.parseTwoDigitYear = function (t) {
      return Pt(t) + (Pt(t) > 68 ? 1900 : 2e3);
    };
    var qt,
      Zt = Kt("FullYear", !0);
    function Xt() {
      return Nt(this.year());
    }
    function Kt(t, e) {
      return function (s) {
        return null != s ? (Qt(this, t, s), i.updateOffset(this, e), this) : Jt(this, t);
      };
    }
    function Jt(t, e) {
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
    function Qt(t, e, i) {
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
        n = i, o = t.month(), a = 29 !== (a = t.date()) || 1 !== o || Nt(n) ? a : 28, r ? s.setUTCFullYear(n, o, a) : s.setFullYear(n, o, a);
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
      return t += (e - i) / 12, 1 === i ? Nt(t) ? 29 : 28 : 31 - i % 7 % 2;
    }
    qt = Array.prototype.indexOf ? Array.prototype.indexOf : function (t) {
      var e;
      for (e = 0; e < this.length; ++e) if (this[e] === t) return e;
      return -1;
    }, U("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    }), U("MMM", 0, 0, function (t) {
      return this.localeData().monthsShort(this, t);
    }), U("MMMM", 0, 0, function (t) {
      return this.localeData().months(this, t);
    }), Ct("M", ht, St), Ct("MM", ht, at), Ct("MMM", function (t, e) {
      return e.monthsShortRegex(t);
    }), Ct("MMMM", function (t, e) {
      return e.monthsRegex(t);
    }), Yt(["M", "MM"], function (t, e) {
      e[Ut] = Pt(t) - 1;
    }), Yt(["MMM", "MMMM"], function (t, e, i, s) {
      var r = i._locale.monthsParse(t, s, i._strict);
      null != r ? e[Ut] = r : f(i).invalidMonth = t;
    });
    var re = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
      ne = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      oe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      ae = kt,
      le = kt;
    function ce(t, e) {
      return t ? r(this._months) ? this._months[t.month()] : this._months[(this._months.isFormat || oe).test(e) ? "format" : "standalone"][t.month()] : r(this._months) ? this._months : this._months.standalone;
    }
    function de(t, e) {
      return t ? r(this._monthsShort) ? this._monthsShort[t.month()] : this._monthsShort[oe.test(e) ? "format" : "standalone"][t.month()] : r(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }
    function he(t, e, i) {
      var s,
        r,
        n,
        o = t.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], s = 0; s < 12; ++s) n = p([2e3, s]), this._shortMonthsParse[s] = this.monthsShort(n, "").toLocaleLowerCase(), this._longMonthsParse[s] = this.months(n, "").toLocaleLowerCase();
      return i ? "MMM" === e ? -1 !== (r = qt.call(this._shortMonthsParse, o)) ? r : null : -1 !== (r = qt.call(this._longMonthsParse, o)) ? r : null : "MMM" === e ? -1 !== (r = qt.call(this._shortMonthsParse, o)) || -1 !== (r = qt.call(this._longMonthsParse, o)) ? r : null : -1 !== (r = qt.call(this._longMonthsParse, o)) || -1 !== (r = qt.call(this._shortMonthsParse, o)) ? r : null;
    }
    function ue(t, e, i) {
      var s, r, n;
      if (this._monthsParseExact) return he.call(this, t, e, i);
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
    function me(t) {
      return null != t ? (pe(this, t), i.updateOffset(this, !0), this) : Jt(this, "Month");
    }
    function fe() {
      return se(this.year(), this.month());
    }
    function ge(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || ve.call(this), t ? this._monthsShortStrictRegex : this._monthsShortRegex) : (o(this, "_monthsShortRegex") || (this._monthsShortRegex = ae), this._monthsShortStrictRegex && t ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }
    function ye(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || ve.call(this), t ? this._monthsStrictRegex : this._monthsRegex) : (o(this, "_monthsRegex") || (this._monthsRegex = le), this._monthsStrictRegex && t ? this._monthsStrictRegex : this._monthsRegex);
    }
    function ve() {
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
    function be(t, e, i, s, r, n, o) {
      var a;
      return t < 100 && t >= 0 ? (a = new Date(t + 400, e, i, s, r, n, o), isFinite(a.getFullYear()) && a.setFullYear(t)) : a = new Date(t, e, i, s, r, n, o), a;
    }
    function _e(t) {
      var e, i;
      return t < 100 && t >= 0 ? ((i = Array.prototype.slice.call(arguments))[0] = t + 400, e = new Date(Date.UTC.apply(null, i)), isFinite(e.getUTCFullYear()) && e.setUTCFullYear(t)) : e = new Date(Date.UTC.apply(null, arguments)), e;
    }
    function xe(t, e, i) {
      var s = 7 + e - i;
      return -(7 + _e(t, 0, s).getUTCDay() - e) % 7 + s - 1;
    }
    function we(t, e, i, s, r) {
      var n,
        o,
        a = 1 + 7 * (e - 1) + (7 + i - s) % 7 + xe(t, s, r);
      return a <= 0 ? o = Gt(n = t - 1) + a : a > Gt(t) ? (n = t + 1, o = a - Gt(t)) : (n = t, o = a), {
        year: n,
        dayOfYear: o
      };
    }
    function $e(t, e, i) {
      var s,
        r,
        n = xe(t.year(), e, i),
        o = Math.floor((t.dayOfYear() - n - 1) / 7) + 1;
      return o < 1 ? s = o + ke(r = t.year() - 1, e, i) : o > ke(t.year(), e, i) ? (s = o - ke(t.year(), e, i), r = t.year() + 1) : (r = t.year(), s = o), {
        week: s,
        year: r
      };
    }
    function ke(t, e, i) {
      var s = xe(t, e, i),
        r = xe(t + 1, e, i);
      return (Gt(t) - s + r) / 7;
    }
    function Se(t) {
      return $e(t, this._week.dow, this._week.doy).week;
    }
    U("w", ["ww", 2], "wo", "week"), U("W", ["WW", 2], "Wo", "isoWeek"), Ct("w", ht, St), Ct("ww", ht, at), Ct("W", ht, St), Ct("WW", ht, at), Tt(["w", "ww", "W", "WW"], function (t, e, i, s) {
      e[s.substr(0, 1)] = Pt(t);
    });
    var Ae = {
      dow: 0,
      doy: 6
    };
    function Ce() {
      return this._week.dow;
    }
    function Ee() {
      return this._week.doy;
    }
    function Me(t) {
      var e = this.localeData().week(this);
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function De(t) {
      var e = $e(this, 1, 4).week;
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function Oe(t, e) {
      return "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = e.weekdaysParse(t)) ? t : null : parseInt(t, 10);
    }
    function Pe(t, e) {
      return "string" == typeof t ? e.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t;
    }
    function Fe(t, e) {
      return t.slice(e, 7).concat(t.slice(0, e));
    }
    U("d", 0, "do", "day"), U("dd", 0, 0, function (t) {
      return this.localeData().weekdaysMin(this, t);
    }), U("ddd", 0, 0, function (t) {
      return this.localeData().weekdaysShort(this, t);
    }), U("dddd", 0, 0, function (t) {
      return this.localeData().weekdays(this, t);
    }), U("e", 0, 0, "weekday"), U("E", 0, 0, "isoWeekday"), Ct("d", ht), Ct("e", ht), Ct("E", ht), Ct("dd", function (t, e) {
      return e.weekdaysMinRegex(t);
    }), Ct("ddd", function (t, e) {
      return e.weekdaysShortRegex(t);
    }), Ct("dddd", function (t, e) {
      return e.weekdaysRegex(t);
    }), Tt(["dd", "ddd", "dddd"], function (t, e, i, s) {
      var r = i._locale.weekdaysParse(t, s, i._strict);
      null != r ? e.d = r : f(i).invalidWeekday = t;
    }), Tt(["d", "e", "E"], function (t, e, i, s) {
      e[s] = Pt(t);
    });
    var Ye = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      Te = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      Ie = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      Ne = kt,
      He = kt,
      Ue = kt;
    function Le(t, e) {
      var i = r(this._weekdays) ? this._weekdays : this._weekdays[t && !0 !== t && this._weekdays.isFormat.test(e) ? "format" : "standalone"];
      return !0 === t ? Fe(i, this._week.dow) : t ? i[t.day()] : i;
    }
    function Re(t) {
      return !0 === t ? Fe(this._weekdaysShort, this._week.dow) : t ? this._weekdaysShort[t.day()] : this._weekdaysShort;
    }
    function je(t) {
      return !0 === t ? Fe(this._weekdaysMin, this._week.dow) : t ? this._weekdaysMin[t.day()] : this._weekdaysMin;
    }
    function ze(t, e, i) {
      var s,
        r,
        n,
        o = t.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], s = 0; s < 7; ++s) n = p([2e3, 1]).day(s), this._minWeekdaysParse[s] = this.weekdaysMin(n, "").toLocaleLowerCase(), this._shortWeekdaysParse[s] = this.weekdaysShort(n, "").toLocaleLowerCase(), this._weekdaysParse[s] = this.weekdays(n, "").toLocaleLowerCase();
      return i ? "dddd" === e ? -1 !== (r = qt.call(this._weekdaysParse, o)) ? r : null : "ddd" === e ? -1 !== (r = qt.call(this._shortWeekdaysParse, o)) ? r : null : -1 !== (r = qt.call(this._minWeekdaysParse, o)) ? r : null : "dddd" === e ? -1 !== (r = qt.call(this._weekdaysParse, o)) || -1 !== (r = qt.call(this._shortWeekdaysParse, o)) || -1 !== (r = qt.call(this._minWeekdaysParse, o)) ? r : null : "ddd" === e ? -1 !== (r = qt.call(this._shortWeekdaysParse, o)) || -1 !== (r = qt.call(this._weekdaysParse, o)) || -1 !== (r = qt.call(this._minWeekdaysParse, o)) ? r : null : -1 !== (r = qt.call(this._minWeekdaysParse, o)) || -1 !== (r = qt.call(this._weekdaysParse, o)) || -1 !== (r = qt.call(this._shortWeekdaysParse, o)) ? r : null;
    }
    function Be(t, e, i) {
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
      var e = Jt(this, "Day");
      return null != t ? (t = Oe(t, this.localeData()), this.add(t - e, "d")) : e;
    }
    function We(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == t ? e : this.add(t - e, "d");
    }
    function Ge(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        var e = Pe(t, this.localeData());
        return this.day(this.day() % 7 ? e : e - 7);
      }
      return this.day() || 7;
    }
    function qe(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysStrictRegex : this._weekdaysRegex) : (o(this, "_weekdaysRegex") || (this._weekdaysRegex = Ne), this._weekdaysStrictRegex && t ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }
    function Ze(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (o(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = He), this._weekdaysShortStrictRegex && t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }
    function Xe(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || Ke.call(this), t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (o(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Ue), this._weekdaysMinStrictRegex && t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
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
        l = [],
        c = [];
      for (e = 0; e < 7; e++) i = p([2e3, 1]).day(e), s = Dt(this.weekdaysMin(i, "")), r = Dt(this.weekdaysShort(i, "")), n = Dt(this.weekdays(i, "")), o.push(s), a.push(r), l.push(n), c.push(s), c.push(r), c.push(n);
      o.sort(t), a.sort(t), l.sort(t), c.sort(t), this._weekdaysRegex = new RegExp("^(" + c.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + o.join("|") + ")", "i");
    }
    function Je() {
      return this.hours() % 12 || 12;
    }
    function Qe() {
      return this.hours() || 24;
    }
    function ti(t, e) {
      U(t, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), e);
      });
    }
    function ei(t, e) {
      return e._meridiemParse;
    }
    function ii(t) {
      return "p" === (t + "").toLowerCase().charAt(0);
    }
    U("H", ["HH", 2], 0, "hour"), U("h", ["hh", 2], 0, Je), U("k", ["kk", 2], 0, Qe), U("hmm", 0, 0, function () {
      return "" + Je.apply(this) + Y(this.minutes(), 2);
    }), U("hmmss", 0, 0, function () {
      return "" + Je.apply(this) + Y(this.minutes(), 2) + Y(this.seconds(), 2);
    }), U("Hmm", 0, 0, function () {
      return "" + this.hours() + Y(this.minutes(), 2);
    }), U("Hmmss", 0, 0, function () {
      return "" + this.hours() + Y(this.minutes(), 2) + Y(this.seconds(), 2);
    }), ti("a", !0), ti("A", !1), Ct("a", ei), Ct("A", ei), Ct("H", ht, At), Ct("h", ht, St), Ct("k", ht, St), Ct("HH", ht, at), Ct("hh", ht, at), Ct("kk", ht, at), Ct("hmm", ut), Ct("hmmss", pt), Ct("Hmm", ut), Ct("Hmmss", pt), Yt(["H", "HH"], Rt), Yt(["k", "kk"], function (t, e, i) {
      var s = Pt(t);
      e[Rt] = 24 === s ? 0 : s;
    }), Yt(["a", "A"], function (t, e, i) {
      i._isPm = i._locale.isPM(t), i._meridiem = t;
    }), Yt(["h", "hh"], function (t, e, i) {
      e[Rt] = Pt(t), f(i).bigHour = !0;
    }), Yt("hmm", function (t, e, i) {
      var s = t.length - 2;
      e[Rt] = Pt(t.substr(0, s)), e[jt] = Pt(t.substr(s)), f(i).bigHour = !0;
    }), Yt("hmmss", function (t, e, i) {
      var s = t.length - 4,
        r = t.length - 2;
      e[Rt] = Pt(t.substr(0, s)), e[jt] = Pt(t.substr(s, 2)), e[zt] = Pt(t.substr(r)), f(i).bigHour = !0;
    }), Yt("Hmm", function (t, e, i) {
      var s = t.length - 2;
      e[Rt] = Pt(t.substr(0, s)), e[jt] = Pt(t.substr(s));
    }), Yt("Hmmss", function (t, e, i) {
      var s = t.length - 4,
        r = t.length - 2;
      e[Rt] = Pt(t.substr(0, s)), e[jt] = Pt(t.substr(s, 2)), e[zt] = Pt(t.substr(r));
    });
    var si = /[ap]\.?m?\.?/i,
      ri = Kt("Hours", !0);
    function ni(t, e, i) {
      return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
    }
    var oi,
      ai = {
        calendar: P,
        longDateFormat: B,
        invalidDate: W,
        ordinal: q,
        dayOfMonthOrdinalParse: Z,
        relativeTime: K,
        months: re,
        monthsShort: ne,
        week: Ae,
        weekdays: Ye,
        weekdaysMin: Ie,
        weekdaysShort: Te,
        meridiemParse: si
      },
      li = {},
      ci = {};
    function di(t, e) {
      var i,
        s = Math.min(t.length, e.length);
      for (i = 0; i < s; i += 1) if (t[i] !== e[i]) return i;
      return s;
    }
    function hi(t) {
      return t ? t.toLowerCase().replace("_", "-") : t;
    }
    function ui(t) {
      for (var e, i, s, r, n = 0; n < t.length;) {
        for (e = (r = hi(t[n]).split("-")).length, i = (i = hi(t[n + 1])) ? i.split("-") : null; e > 0;) {
          if (s = mi(r.slice(0, e).join("-"))) return s;
          if (i && i.length >= e && di(r, i) >= e - 1) break;
          e--;
        }
        n++;
      }
      return oi;
    }
    function pi(t) {
      return !(!t || !t.match("^[^/\\\\]*$"));
    }
    function mi(t) {
      var e = null;
      if (void 0 === li[t] && _t && _t.exports && pi(t)) try {
        e = oi._abbr, bt("./locale/" + t), fi(e);
      } catch (e) {
        li[t] = null;
      }
      return li[t];
    }
    function fi(t, e) {
      var i;
      return t && ((i = l(e) ? vi(t) : gi(t, e)) ? oi = i : "undefined" != typeof console && console.warn && console.warn("Locale " + t + " not found. Did you forget to load it?")), oi._abbr;
    }
    function gi(t, e) {
      if (null !== e) {
        var i,
          s = ai;
        if (e.abbr = t, null != li[t]) C("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), s = li[t]._config;else if (null != e.parentLocale) if (null != li[e.parentLocale]) s = li[e.parentLocale]._config;else {
          if (null == (i = mi(e.parentLocale))) return ci[e.parentLocale] || (ci[e.parentLocale] = []), ci[e.parentLocale].push({
            name: t,
            config: e
          }), null;
          s = i._config;
        }
        return li[t] = new O(D(s, e)), ci[t] && ci[t].forEach(function (t) {
          gi(t.name, t.config);
        }), fi(t), li[t];
      }
      return delete li[t], null;
    }
    function yi(t, e) {
      if (null != e) {
        var i,
          s,
          r = ai;
        null != li[t] && null != li[t].parentLocale ? li[t].set(D(li[t]._config, e)) : (null != (s = mi(t)) && (r = s._config), e = D(r, e), null == s && (e.abbr = t), (i = new O(e)).parentLocale = li[t], li[t] = i), fi(t);
      } else null != li[t] && (null != li[t].parentLocale ? (li[t] = li[t].parentLocale, t === fi() && fi(t)) : null != li[t] && delete li[t]);
      return li[t];
    }
    function vi(t) {
      var e;
      if (t && t._locale && t._locale._abbr && (t = t._locale._abbr), !t) return oi;
      if (!r(t)) {
        if (e = mi(t)) return e;
        t = [t];
      }
      return ui(t);
    }
    function bi() {
      return S(li);
    }
    function _i(t) {
      var e,
        i = t._a;
      return i && -2 === f(t).overflow && (e = i[Ut] < 0 || i[Ut] > 11 ? Ut : i[Lt] < 1 || i[Lt] > se(i[Ht], i[Ut]) ? Lt : i[Rt] < 0 || i[Rt] > 24 || 24 === i[Rt] && (0 !== i[jt] || 0 !== i[zt] || 0 !== i[Bt]) ? Rt : i[jt] < 0 || i[jt] > 59 ? jt : i[zt] < 0 || i[zt] > 59 ? zt : i[Bt] < 0 || i[Bt] > 999 ? Bt : -1, f(t)._overflowDayOfYear && (e < Ht || e > Lt) && (e = Lt), f(t)._overflowWeeks && -1 === e && (e = Vt), f(t)._overflowWeekday && -1 === e && (e = Wt), f(t).overflow = e), t;
    }
    var xi = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      wi = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      $i = /Z|[+-]\d\d(?::?\d\d)?/,
      ki = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/], ["YYYYMM", /\d{6}/, !1], ["YYYY", /\d{4}/, !1]],
      Si = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
      Ai = /^\/?Date\((-?\d+)/i,
      Ci = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
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
    function Mi(t) {
      var e,
        i,
        s,
        r,
        n,
        o,
        a = t._i,
        l = xi.exec(a) || wi.exec(a),
        c = ki.length,
        d = Si.length;
      if (l) {
        for (f(t).iso = !0, e = 0, i = c; e < i; e++) if (ki[e][1].exec(l[1])) {
          r = ki[e][0], s = !1 !== ki[e][2];
          break;
        }
        if (null == r) return void (t._isValid = !1);
        if (l[3]) {
          for (e = 0, i = d; e < i; e++) if (Si[e][1].exec(l[3])) {
            n = (l[2] || " ") + Si[e][0];
            break;
          }
          if (null == n) return void (t._isValid = !1);
        }
        if (!s && null != n) return void (t._isValid = !1);
        if (l[4]) {
          if (!$i.exec(l[4])) return void (t._isValid = !1);
          o = "Z";
        }
        t._f = r + (n || "") + (o || ""), Ri(t);
      } else t._isValid = !1;
    }
    function Di(t, e, i, s, r, n) {
      var o = [Oi(t), ne.indexOf(e), parseInt(i, 10), parseInt(s, 10), parseInt(r, 10)];
      return n && o.push(parseInt(n, 10)), o;
    }
    function Oi(t) {
      var e = parseInt(t, 10);
      return e <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
    }
    function Pi(t) {
      return t.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function Fi(t, e, i) {
      return !t || Te.indexOf(t) === new Date(e[0], e[1], e[2]).getDay() || (f(i).weekdayMismatch = !0, i._isValid = !1, !1);
    }
    function Yi(t, e, i) {
      if (t) return Ei[t];
      if (e) return 0;
      var s = parseInt(i, 10),
        r = s % 100;
      return (s - r) / 100 * 60 + r;
    }
    function Ti(t) {
      var e,
        i = Ci.exec(Pi(t._i));
      if (i) {
        if (e = Di(i[4], i[3], i[2], i[5], i[6], i[7]), !Fi(i[1], e, t)) return;
        t._a = e, t._tzm = Yi(i[8], i[9], i[10]), t._d = _e.apply(null, t._a), t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), f(t).rfc2822 = !0;
      } else t._isValid = !1;
    }
    function Ii(t) {
      var e = Ai.exec(t._i);
      null === e ? (Mi(t), !1 === t._isValid && (delete t._isValid, Ti(t), !1 === t._isValid && (delete t._isValid, t._strict ? t._isValid = !1 : i.createFromInputFallback(t)))) : t._d = new Date(+e[1]);
    }
    function Ni(t, e, i) {
      return null != t ? t : null != e ? e : i;
    }
    function Hi(t) {
      var e = new Date(i.now());
      return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()];
    }
    function Ui(t) {
      var e,
        i,
        s,
        r,
        n,
        o = [];
      if (!t._d) {
        for (s = Hi(t), t._w && null == t._a[Lt] && null == t._a[Ut] && Li(t), null != t._dayOfYear && (n = Ni(t._a[Ht], s[Ht]), (t._dayOfYear > Gt(n) || 0 === t._dayOfYear) && (f(t)._overflowDayOfYear = !0), i = _e(n, 0, t._dayOfYear), t._a[Ut] = i.getUTCMonth(), t._a[Lt] = i.getUTCDate()), e = 0; e < 3 && null == t._a[e]; ++e) t._a[e] = o[e] = s[e];
        for (; e < 7; e++) t._a[e] = o[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
        24 === t._a[Rt] && 0 === t._a[jt] && 0 === t._a[zt] && 0 === t._a[Bt] && (t._nextDay = !0, t._a[Rt] = 0), t._d = (t._useUTC ? _e : be).apply(null, o), r = t._useUTC ? t._d.getUTCDay() : t._d.getDay(), null != t._tzm && t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), t._nextDay && (t._a[Rt] = 24), t._w && void 0 !== t._w.d && t._w.d !== r && (f(t).weekdayMismatch = !0);
      }
    }
    function Li(t) {
      var e, i, s, r, n, o, a, l, c;
      null != (e = t._w).GG || null != e.W || null != e.E ? (n = 1, o = 4, i = Ni(e.GG, t._a[Ht], $e(Zi(), 1, 4).year), s = Ni(e.W, 1), ((r = Ni(e.E, 1)) < 1 || r > 7) && (l = !0)) : (n = t._locale._week.dow, o = t._locale._week.doy, c = $e(Zi(), n, o), i = Ni(e.gg, t._a[Ht], c.year), s = Ni(e.w, c.week), null != e.d ? ((r = e.d) < 0 || r > 6) && (l = !0) : null != e.e ? (r = e.e + n, (e.e < 0 || e.e > 6) && (l = !0)) : r = n), s < 1 || s > ke(i, n, o) ? f(t)._overflowWeeks = !0 : null != l ? f(t)._overflowWeekday = !0 : (a = we(i, s, r, n, o), t._a[Ht] = a.year, t._dayOfYear = a.dayOfYear);
    }
    function Ri(t) {
      if (t._f !== i.ISO_8601) {
        if (t._f !== i.RFC_2822) {
          t._a = [], f(t).empty = !0;
          var e,
            s,
            r,
            n,
            o,
            a,
            l,
            c = "" + t._i,
            d = c.length,
            h = 0;
          for (l = (r = z(t._f, t._locale).match(T) || []).length, e = 0; e < l; e++) n = r[e], (s = (c.match(Et(n, t)) || [])[0]) && ((o = c.substr(0, c.indexOf(s))).length > 0 && f(t).unusedInput.push(o), c = c.slice(c.indexOf(s) + s.length), h += s.length), H[n] ? (s ? f(t).empty = !1 : f(t).unusedTokens.push(n), It(n, s, t)) : t._strict && !s && f(t).unusedTokens.push(n);
          f(t).charsLeftOver = d - h, c.length > 0 && f(t).unusedInput.push(c), t._a[Rt] <= 12 && !0 === f(t).bigHour && t._a[Rt] > 0 && (f(t).bigHour = void 0), f(t).parsedDateParts = t._a.slice(0), f(t).meridiem = t._meridiem, t._a[Rt] = ji(t._locale, t._a[Rt], t._meridiem), null !== (a = f(t).era) && (t._a[Ht] = t._locale.erasConvertYear(a, t._a[Ht])), Ui(t), _i(t);
        } else Ti(t);
      } else Mi(t);
    }
    function ji(t, e, i) {
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
        l = t._f.length;
      if (0 === l) return f(t).invalidFormat = !0, void (t._d = new Date(NaN));
      for (r = 0; r < l; r++) n = 0, o = !1, e = _({}, t), null != t._useUTC && (e._useUTC = t._useUTC), e._f = t._f[r], Ri(e), g(e) && (o = !0), n += f(e).charsLeftOver, n += 10 * f(e).unusedTokens.length, f(e).score = n, a ? n < s && (s = n, i = e) : (null == s || n < s || o) && (s = n, i = e, o && (a = !0));
      u(t, i || e);
    }
    function Bi(t) {
      if (!t._d) {
        var e = it(t._i),
          i = void 0 === e.day ? e.date : e.day;
        t._a = h([e.year, e.month, i, e.hour, e.minute, e.second, e.millisecond], function (t) {
          return t && parseInt(t, 10);
        }), Ui(t);
      }
    }
    function Vi(t) {
      var e = new x(_i(Wi(t)));
      return e._nextDay && (e.add(1, "d"), e._nextDay = void 0), e;
    }
    function Wi(t) {
      var e = t._i,
        i = t._f;
      return t._locale = t._locale || vi(t._l), null === e || void 0 === i && "" === e ? y({
        nullInput: !0
      }) : ("string" == typeof e && (t._i = e = t._locale.preparse(e)), w(e) ? new x(_i(e)) : (d(e) ? t._d = e : r(i) ? zi(t) : i ? Ri(t) : Gi(t), g(t) || (t._d = null), t));
    }
    function Gi(t) {
      var e = t._i;
      l(e) ? t._d = new Date(i.now()) : d(e) ? t._d = new Date(e.valueOf()) : "string" == typeof e ? Ii(t) : r(e) ? (t._a = h(e.slice(0), function (t) {
        return parseInt(t, 10);
      }), Ui(t)) : n(e) ? Bi(t) : c(e) ? t._d = new Date(e) : i.createFromInputFallback(t);
    }
    function qi(t, e, i, s, o) {
      var l = {};
      return !0 !== e && !1 !== e || (s = e, e = void 0), !0 !== i && !1 !== i || (s = i, i = void 0), (n(t) && a(t) || r(t) && 0 === t.length) && (t = void 0), l._isAMomentObject = !0, l._useUTC = l._isUTC = o, l._l = i, l._i = t, l._f = e, l._strict = s, Vi(l);
    }
    function Zi(t, e, i, s) {
      return qi(t, e, i, s, !1);
    }
    i.createFromInputFallback = k("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (t) {
      t._d = new Date(t._i + (t._useUTC ? " UTC" : ""));
    }), i.ISO_8601 = function () {}, i.RFC_2822 = function () {};
    var Xi = k("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Zi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t < this ? this : t : y();
      }),
      Ki = k("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Zi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t > this ? this : t : y();
      });
    function Ji(t, e) {
      var i, s;
      if (1 === e.length && r(e[0]) && (e = e[0]), !e.length) return Zi();
      for (i = e[0], s = 1; s < e.length; ++s) e[s].isValid() && !e[s][t](i) || (i = e[s]);
      return i;
    }
    function Qi() {
      return Ji("isBefore", [].slice.call(arguments, 0));
    }
    function ts() {
      return Ji("isAfter", [].slice.call(arguments, 0));
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
      for (e in t) if (o(t, e) && (-1 === qt.call(is, e) || null != t[e] && isNaN(t[e]))) return !1;
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
        l = e.minute || 0,
        c = e.second || 0,
        d = e.millisecond || 0;
      this._isValid = ss(e), this._milliseconds = +d + 1e3 * c + 6e4 * l + 1e3 * a * 60 * 60, this._days = +o + 7 * n, this._months = +r + 3 * s + 12 * i, this._data = {}, this._locale = vi(), this._bubble();
    }
    function as(t) {
      return t instanceof os;
    }
    function ls(t) {
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
    function ds(t, e) {
      U(t, 0, 0, function () {
        var t = this.utcOffset(),
          i = "+";
        return t < 0 && (t = -t, i = "-"), i + Y(~~(t / 60), 2) + e + Y(~~t % 60, 2);
      });
    }
    ds("Z", ":"), ds("ZZ", ""), Ct("Z", wt), Ct("ZZ", wt), Yt(["Z", "ZZ"], function (t, e, i) {
      i._useUTC = !0, i._tzm = us(wt, t);
    });
    var hs = /([\+\-]|\d\d)/gi;
    function us(t, e) {
      var i,
        s,
        r = (e || "").match(t);
      return null === r ? null : 0 === (s = 60 * (i = ((r[r.length - 1] || []) + "").match(hs) || ["-", 0, 0])[1] + Pt(i[2])) ? 0 : "+" === i[0] ? s : -s;
    }
    function ps(t, e) {
      var s, r;
      return e._isUTC ? (s = e.clone(), r = (w(t) || d(t) ? t.valueOf() : Zi(t).valueOf()) - s.valueOf(), s._d.setTime(s._d.valueOf() + r), i.updateOffset(s, !1), s) : Zi(t).local();
    }
    function ms(t) {
      return -Math.round(t._d.getTimezoneOffset());
    }
    function fs(t, e, s) {
      var r,
        n = this._offset || 0;
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        if ("string" == typeof t) {
          if (null === (t = us(wt, t))) return this;
        } else Math.abs(t) < 16 && !s && (t *= 60);
        return !this._isUTC && e && (r = ms(this)), this._offset = t, this._isUTC = !0, null != r && this.add(r, "m"), n !== t && (!e || this._changeInProgress ? Fs(this, Es(t - n, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, i.updateOffset(this, !0), this._changeInProgress = null)), this;
      }
      return this._isUTC ? n : ms(this);
    }
    function gs(t, e) {
      return null != t ? ("string" != typeof t && (t = -t), this.utcOffset(t, e), this) : -this.utcOffset();
    }
    function ys(t) {
      return this.utcOffset(0, t);
    }
    function vs(t) {
      return this._isUTC && (this.utcOffset(0, t), this._isUTC = !1, t && this.subtract(ms(this), "m")), this;
    }
    function bs() {
      if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
        var t = us(xt, this._i);
        null != t ? this.utcOffset(t) : this.utcOffset(0, !0);
      }
      return this;
    }
    function _s(t) {
      return !!this.isValid() && (t = t ? Zi(t).utcOffset() : 0, (this.utcOffset() - t) % 60 == 0);
    }
    function xs() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function ws() {
      if (!l(this._isDSTShifted)) return this._isDSTShifted;
      var t,
        e = {};
      return _(e, this), (e = Wi(e))._a ? (t = e._isUTC ? p(e._a) : Zi(e._a), this._isDSTShifted = this.isValid() && cs(e._a, t.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
    }
    function $s() {
      return !!this.isValid() && !this._isUTC;
    }
    function ks() {
      return !!this.isValid() && this._isUTC;
    }
    function Ss() {
      return !!this.isValid() && this._isUTC && 0 === this._offset;
    }
    i.updateOffset = function () {};
    var As = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
      Cs = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
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
        h: Pt(a[Rt]) * i,
        m: Pt(a[jt]) * i,
        s: Pt(a[zt]) * i,
        ms: Pt(ls(1e3 * a[Bt])) * i
      }) : (a = Cs.exec(t)) ? (i = "-" === a[1] ? -1 : 1, n = {
        y: Ms(a[2], i),
        M: Ms(a[3], i),
        w: Ms(a[4], i),
        d: Ms(a[5], i),
        h: Ms(a[6], i),
        m: Ms(a[7], i),
        s: Ms(a[8], i)
      }) : null == n ? n = {} : "object" == typeof n && ("from" in n || "to" in n) && (r = Os(Zi(n.from), Zi(n.to)), (n = {}).ms = r.milliseconds, n.M = r.months), s = new os(n), as(t) && o(t, "_locale") && (s._locale = t._locale), as(t) && o(t, "_isValid") && (s._isValid = t._isValid), s;
    }
    function Ms(t, e) {
      var i = t && parseFloat(t.replace(",", "."));
      return (isNaN(i) ? 0 : i) * e;
    }
    function Ds(t, e) {
      var i = {};
      return i.months = e.month() - t.month() + 12 * (e.year() - t.year()), t.clone().add(i.months, "M").isAfter(e) && --i.months, i.milliseconds = +e - +t.clone().add(i.months, "M"), i;
    }
    function Os(t, e) {
      var i;
      return t.isValid() && e.isValid() ? (e = ps(e, t), t.isBefore(e) ? i = Ds(t, e) : ((i = Ds(e, t)).milliseconds = -i.milliseconds, i.months = -i.months), i) : {
        milliseconds: 0,
        months: 0
      };
    }
    function Ps(t, e) {
      return function (i, s) {
        var r;
        return null === s || isNaN(+s) || (C(e, "moment()." + e + "(period, number) is deprecated. Please use moment()." + e + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), r = i, i = s, s = r), Fs(this, Es(i, s), t), this;
      };
    }
    function Fs(t, e, s, r) {
      var n = e._milliseconds,
        o = ls(e._days),
        a = ls(e._months);
      t.isValid() && (r = r ?? !0, a && pe(t, Jt(t, "Month") + a * s), o && Qt(t, "Date", Jt(t, "Date") + o * s), n && t._d.setTime(t._d.valueOf() + n * s), r && i.updateOffset(t, o || a));
    }
    Es.fn = os.prototype, Es.invalid = ns;
    var Ys = Ps(1, "add"),
      Ts = Ps(-1, "subtract");
    function Is(t) {
      return "string" == typeof t || t instanceof String;
    }
    function Ns(t) {
      return w(t) || d(t) || Is(t) || c(t) || Us(t) || Hs(t) || null == t;
    }
    function Hs(t) {
      var e,
        i,
        s = n(t) && !a(t),
        r = !1,
        l = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"],
        c = l.length;
      for (e = 0; e < c; e += 1) i = l[e], r = r || o(t, i);
      return s && r;
    }
    function Us(t) {
      var e = r(t),
        i = !1;
      return e && (i = 0 === t.filter(function (e) {
        return !c(e) && Is(t);
      }).length), e && i;
    }
    function Ls(t) {
      var e,
        i,
        s = n(t) && !a(t),
        r = !1,
        l = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"];
      for (e = 0; e < l.length; e += 1) i = l[e], r = r || o(t, i);
      return s && r;
    }
    function Rs(t, e) {
      var i = t.diff(e, "days", !0);
      return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
    }
    function js(t, e) {
      1 === arguments.length && (arguments[0] ? Ns(arguments[0]) ? (t = arguments[0], e = void 0) : Ls(arguments[0]) && (e = arguments[0], t = void 0) : (t = void 0, e = void 0));
      var s = t || Zi(),
        r = ps(s, this).startOf("day"),
        n = i.calendarFormat(this, r) || "sameElse",
        o = e && (E(e[n]) ? e[n].call(this, s) : e[n]);
      return this.format(o || this.localeData().calendar(n, this, Zi(s)));
    }
    function zs() {
      return new x(this);
    }
    function Bs(t, e) {
      var i = w(t) ? t : Zi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(e).valueOf());
    }
    function Vs(t, e) {
      var i = w(t) ? t : Zi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(e).valueOf() < i.valueOf());
    }
    function Ws(t, e, i, s) {
      var r = w(t) ? t : Zi(t),
        n = w(e) ? e : Zi(e);
      return !!(this.isValid() && r.isValid() && n.isValid()) && ("(" === (s = s || "()")[0] ? this.isAfter(r, i) : !this.isBefore(r, i)) && (")" === s[1] ? this.isBefore(n, i) : !this.isAfter(n, i));
    }
    function Gs(t, e) {
      var i,
        s = w(t) ? t : Zi(t);
      return !(!this.isValid() || !s.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() === s.valueOf() : (i = s.valueOf(), this.clone().startOf(e).valueOf() <= i && i <= this.clone().endOf(e).valueOf()));
    }
    function qs(t, e) {
      return this.isSame(t, e) || this.isAfter(t, e);
    }
    function Zs(t, e) {
      return this.isSame(t, e) || this.isBefore(t, e);
    }
    function Xs(t, e, i) {
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
      return i ? n : Ot(n);
    }
    function Ks(t, e) {
      if (t.date() < e.date()) return -Ks(e, t);
      var i = 12 * (e.year() - t.year()) + (e.month() - t.month()),
        s = t.clone().add(i, "months");
      return -(i + (e - s < 0 ? (e - s) / (s - t.clone().add(i - 1, "months")) : (e - s) / (t.clone().add(i + 1, "months") - s))) || 0;
    }
    function Js() {
      return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function Qs(t) {
      if (!this.isValid()) return null;
      var e = !0 !== t,
        i = e ? this.clone().utc() : this;
      return i.year() < 0 || i.year() > 9999 ? j(i, e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : E(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", j(i, "Z")) : j(i, e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
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
      var e = j(this, t);
      return this.localeData().postformat(e);
    }
    function ir(t, e) {
      return this.isValid() && (w(t) && t.isValid() || Zi(t).isValid()) ? Es({
        to: this,
        from: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function sr(t) {
      return this.from(Zi(), t);
    }
    function rr(t, e) {
      return this.isValid() && (w(t) && t.isValid() || Zi(t).isValid()) ? Es({
        from: this,
        to: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function nr(t) {
      return this.to(Zi(), t);
    }
    function or(t) {
      var e;
      return void 0 === t ? this._locale._abbr : (null != (e = vi(t)) && (this._locale = e), this);
    }
    i.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", i.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var ar = k("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (t) {
      return void 0 === t ? this.localeData() : this.locale(t);
    });
    function lr() {
      return this._locale;
    }
    var cr = 1e3,
      dr = 60 * cr,
      hr = 60 * dr,
      ur = 3506328 * hr;
    function pr(t, e) {
      return (t % e + e) % e;
    }
    function mr(t, e, i) {
      return t < 100 && t >= 0 ? new Date(t + 400, e, i) - ur : new Date(t, e, i).valueOf();
    }
    function fr(t, e, i) {
      return t < 100 && t >= 0 ? Date.UTC(t + 400, e, i) - ur : Date.UTC(t, e, i);
    }
    function gr(t) {
      var e, s;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (s = this._isUTC ? fr : mr, t) {
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
          e = this._d.valueOf(), e -= pr(e + (this._isUTC ? 0 : this.utcOffset() * dr), hr);
          break;
        case "minute":
          e = this._d.valueOf(), e -= pr(e, dr);
          break;
        case "second":
          e = this._d.valueOf(), e -= pr(e, cr);
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function yr(t) {
      var e, s;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (s = this._isUTC ? fr : mr, t) {
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
          e = this._d.valueOf(), e += hr - pr(e + (this._isUTC ? 0 : this.utcOffset() * dr), hr) - 1;
          break;
        case "minute":
          e = this._d.valueOf(), e += dr - pr(e, dr) - 1;
          break;
        case "second":
          e = this._d.valueOf(), e += cr - pr(e, cr) - 1;
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function vr() {
      return this._d.valueOf() - 6e4 * (this._offset || 0);
    }
    function br() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function _r() {
      return new Date(this.valueOf());
    }
    function xr() {
      var t = this;
      return [t.year(), t.month(), t.date(), t.hour(), t.minute(), t.second(), t.millisecond()];
    }
    function wr() {
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
    function $r() {
      return this.isValid() ? this.toISOString() : null;
    }
    function kr() {
      return g(this);
    }
    function Sr() {
      return u({}, f(this));
    }
    function Ar() {
      return f(this).overflow;
    }
    function Cr() {
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
        o = this._eras || vi("en")._eras;
      for (s = 0, r = o.length; s < r; ++s) switch ("string" == typeof o[s].since && (n = i(o[s].since).startOf("day"), o[s].since = n.valueOf()), typeof o[s].until) {
        case "undefined":
          o[s].until = 1 / 0;
          break;
        case "string":
          n = i(o[s].until).startOf("day").valueOf(), o[s].until = n.valueOf();
      }
      return o;
    }
    function Mr(t, e, i) {
      var s,
        r,
        n,
        o,
        a,
        l = this.eras();
      for (t = t.toUpperCase(), s = 0, r = l.length; s < r; ++s) if (n = l[s].name.toUpperCase(), o = l[s].abbr.toUpperCase(), a = l[s].narrow.toUpperCase(), i) switch (e) {
        case "N":
        case "NN":
        case "NNN":
          if (o === t) return l[s];
          break;
        case "NNNN":
          if (n === t) return l[s];
          break;
        case "NNNNN":
          if (a === t) return l[s];
      } else if ([n, o, a].indexOf(t) >= 0) return l[s];
    }
    function Dr(t, e) {
      var s = t.since <= t.until ? 1 : -1;
      return void 0 === e ? i(t.since).year() : i(t.since).year() + (e - t.offset) * s;
    }
    function Or() {
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
    function Fr() {
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
    function Yr() {
      var t,
        e,
        s,
        r,
        n = this.localeData().eras();
      for (t = 0, e = n.length; t < e; ++t) if (s = n[t].since <= n[t].until ? 1 : -1, r = this.clone().startOf("day").valueOf(), n[t].since <= r && r <= n[t].until || n[t].until <= r && r <= n[t].since) return (this.year() - i(n[t].since).year()) * s + n[t].offset;
      return this.year();
    }
    function Tr(t) {
      return o(this, "_erasNameRegex") || jr.call(this), t ? this._erasNameRegex : this._erasRegex;
    }
    function Ir(t) {
      return o(this, "_erasAbbrRegex") || jr.call(this), t ? this._erasAbbrRegex : this._erasRegex;
    }
    function Nr(t) {
      return o(this, "_erasNarrowRegex") || jr.call(this), t ? this._erasNarrowRegex : this._erasRegex;
    }
    function Hr(t, e) {
      return e.erasAbbrRegex(t);
    }
    function Ur(t, e) {
      return e.erasNameRegex(t);
    }
    function Lr(t, e) {
      return e.erasNarrowRegex(t);
    }
    function Rr(t, e) {
      return e._eraYearOrdinalRegex || yt;
    }
    function jr() {
      var t,
        e,
        i,
        s,
        r,
        n = [],
        o = [],
        a = [],
        l = [],
        c = this.eras();
      for (t = 0, e = c.length; t < e; ++t) i = Dt(c[t].name), s = Dt(c[t].abbr), r = Dt(c[t].narrow), o.push(i), n.push(s), a.push(r), l.push(i), l.push(s), l.push(r);
      this._erasRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + n.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + a.join("|") + ")", "i");
    }
    function zr(t, e) {
      U(0, [t, t.length], 0, e);
    }
    function Br(t) {
      return Xr.call(this, t, this.week(), this.weekday() + this.localeData()._week.dow, this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function Vr(t) {
      return Xr.call(this, t, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function Wr() {
      return ke(this.year(), 1, 4);
    }
    function Gr() {
      return ke(this.isoWeekYear(), 1, 4);
    }
    function qr() {
      var t = this.localeData()._week;
      return ke(this.year(), t.dow, t.doy);
    }
    function Zr() {
      var t = this.localeData()._week;
      return ke(this.weekYear(), t.dow, t.doy);
    }
    function Xr(t, e, i, s, r) {
      var n;
      return null == t ? $e(this, s, r).year : (e > (n = ke(t, s, r)) && (e = n), Kr.call(this, t, e, i, s, r));
    }
    function Kr(t, e, i, s, r) {
      var n = we(t, e, i, s, r),
        o = _e(n.year, 0, n.dayOfYear);
      return this.year(o.getUTCFullYear()), this.month(o.getUTCMonth()), this.date(o.getUTCDate()), this;
    }
    function Jr(t) {
      return null == t ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (t - 1) + this.month() % 3);
    }
    U("N", 0, 0, "eraAbbr"), U("NN", 0, 0, "eraAbbr"), U("NNN", 0, 0, "eraAbbr"), U("NNNN", 0, 0, "eraName"), U("NNNNN", 0, 0, "eraNarrow"), U("y", ["y", 1], "yo", "eraYear"), U("y", ["yy", 2], 0, "eraYear"), U("y", ["yyy", 3], 0, "eraYear"), U("y", ["yyyy", 4], 0, "eraYear"), Ct("N", Hr), Ct("NN", Hr), Ct("NNN", Hr), Ct("NNNN", Ur), Ct("NNNNN", Lr), Yt(["N", "NN", "NNN", "NNNN", "NNNNN"], function (t, e, i, s) {
      var r = i._locale.erasParse(t, s, i._strict);
      r ? f(i).era = r : f(i).invalidEra = t;
    }), Ct("y", yt), Ct("yy", yt), Ct("yyy", yt), Ct("yyyy", yt), Ct("yo", Rr), Yt(["y", "yy", "yyy", "yyyy"], Ht), Yt(["yo"], function (t, e, i, s) {
      var r;
      i._locale._eraYearOrdinalRegex && (r = t.match(i._locale._eraYearOrdinalRegex)), i._locale.eraYearOrdinalParse ? e[Ht] = i._locale.eraYearOrdinalParse(t, r) : e[Ht] = parseInt(t, 10);
    }), U(0, ["gg", 2], 0, function () {
      return this.weekYear() % 100;
    }), U(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    }), zr("gggg", "weekYear"), zr("ggggg", "weekYear"), zr("GGGG", "isoWeekYear"), zr("GGGGG", "isoWeekYear"), Ct("G", vt), Ct("g", vt), Ct("GG", ht, at), Ct("gg", ht, at), Ct("GGGG", ft, ct), Ct("gggg", ft, ct), Ct("GGGGG", gt, dt), Ct("ggggg", gt, dt), Tt(["gggg", "ggggg", "GGGG", "GGGGG"], function (t, e, i, s) {
      e[s.substr(0, 2)] = Pt(t);
    }), Tt(["gg", "GG"], function (t, e, s, r) {
      e[r] = i.parseTwoDigitYear(t);
    }), U("Q", 0, "Qo", "quarter"), Ct("Q", ot), Yt("Q", function (t, e) {
      e[Ut] = 3 * (Pt(t) - 1);
    }), U("D", ["DD", 2], "Do", "date"), Ct("D", ht, St), Ct("DD", ht, at), Ct("Do", function (t, e) {
      return t ? e._dayOfMonthOrdinalParse || e._ordinalParse : e._dayOfMonthOrdinalParseLenient;
    }), Yt(["D", "DD"], Lt), Yt("Do", function (t, e) {
      e[Lt] = Pt(t.match(ht)[0]);
    });
    var Qr = Kt("Date", !0);
    function tn(t) {
      var e = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
      return null == t ? e : this.add(t - e, "d");
    }
    U("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), Ct("DDD", mt), Ct("DDDD", lt), Yt(["DDD", "DDDD"], function (t, e, i) {
      i._dayOfYear = Pt(t);
    }), U("m", ["mm", 2], 0, "minute"), Ct("m", ht, At), Ct("mm", ht, at), Yt(["m", "mm"], jt);
    var en = Kt("Minutes", !1);
    U("s", ["ss", 2], 0, "second"), Ct("s", ht, At), Ct("ss", ht, at), Yt(["s", "ss"], zt);
    var sn,
      rn,
      nn = Kt("Seconds", !1);
    for (U("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    }), U(0, ["SS", 2], 0, function () {
      return ~~(this.millisecond() / 10);
    }), U(0, ["SSS", 3], 0, "millisecond"), U(0, ["SSSS", 4], 0, function () {
      return 10 * this.millisecond();
    }), U(0, ["SSSSS", 5], 0, function () {
      return 100 * this.millisecond();
    }), U(0, ["SSSSSS", 6], 0, function () {
      return 1e3 * this.millisecond();
    }), U(0, ["SSSSSSS", 7], 0, function () {
      return 1e4 * this.millisecond();
    }), U(0, ["SSSSSSSS", 8], 0, function () {
      return 1e5 * this.millisecond();
    }), U(0, ["SSSSSSSSS", 9], 0, function () {
      return 1e6 * this.millisecond();
    }), Ct("S", mt, ot), Ct("SS", mt, at), Ct("SSS", mt, lt), sn = "SSSS"; sn.length <= 9; sn += "S") Ct(sn, yt);
    function on(t, e) {
      e[Bt] = Pt(1e3 * ("0." + t));
    }
    for (sn = "S"; sn.length <= 9; sn += "S") Yt(sn, on);
    function an() {
      return this._isUTC ? "UTC" : "";
    }
    function ln() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    rn = Kt("Milliseconds", !1), U("z", 0, 0, "zoneAbbr"), U("zz", 0, 0, "zoneName");
    var cn = x.prototype;
    function dn(t) {
      return Zi(1e3 * t);
    }
    function hn() {
      return Zi.apply(null, arguments).parseZone();
    }
    function un(t) {
      return t;
    }
    cn.add = Ys, cn.calendar = js, cn.clone = zs, cn.diff = Xs, cn.endOf = yr, cn.format = er, cn.from = ir, cn.fromNow = sr, cn.to = rr, cn.toNow = nr, cn.get = te, cn.invalidAt = Ar, cn.isAfter = Bs, cn.isBefore = Vs, cn.isBetween = Ws, cn.isSame = Gs, cn.isSameOrAfter = qs, cn.isSameOrBefore = Zs, cn.isValid = kr, cn.lang = ar, cn.locale = or, cn.localeData = lr, cn.max = Ki, cn.min = Xi, cn.parsingFlags = Sr, cn.set = ee, cn.startOf = gr, cn.subtract = Ts, cn.toArray = xr, cn.toObject = wr, cn.toDate = _r, cn.toISOString = Qs, cn.inspect = tr, "undefined" != typeof Symbol && null != Symbol.for && (cn[Symbol.for("nodejs.util.inspect.custom")] = function () {
      return "Moment<" + this.format() + ">";
    }), cn.toJSON = $r, cn.toString = Js, cn.unix = br, cn.valueOf = vr, cn.creationData = Cr, cn.eraName = Or, cn.eraNarrow = Pr, cn.eraAbbr = Fr, cn.eraYear = Yr, cn.year = Zt, cn.isLeapYear = Xt, cn.weekYear = Br, cn.isoWeekYear = Vr, cn.quarter = cn.quarters = Jr, cn.month = me, cn.daysInMonth = fe, cn.week = cn.weeks = Me, cn.isoWeek = cn.isoWeeks = De, cn.weeksInYear = qr, cn.weeksInWeekYear = Zr, cn.isoWeeksInYear = Wr, cn.isoWeeksInISOWeekYear = Gr, cn.date = Qr, cn.day = cn.days = Ve, cn.weekday = We, cn.isoWeekday = Ge, cn.dayOfYear = tn, cn.hour = cn.hours = ri, cn.minute = cn.minutes = en, cn.second = cn.seconds = nn, cn.millisecond = cn.milliseconds = rn, cn.utcOffset = fs, cn.utc = ys, cn.local = vs, cn.parseZone = bs, cn.hasAlignedHourOffset = _s, cn.isDST = xs, cn.isLocal = $s, cn.isUtcOffset = ks, cn.isUtc = Ss, cn.isUTC = Ss, cn.zoneAbbr = an, cn.zoneName = ln, cn.dates = k("dates accessor is deprecated. Use date instead.", Qr), cn.months = k("months accessor is deprecated. Use month instead", me), cn.years = k("years accessor is deprecated. Use year instead", Zt), cn.zone = k("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", gs), cn.isDSTShifted = k("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", ws);
    var pn = O.prototype;
    function mn(t, e, i, s) {
      var r = vi(),
        n = p().set(s, e);
      return r[i](n, t);
    }
    function fn(t, e, i) {
      if (c(t) && (e = t, t = void 0), t = t || "", null != e) return mn(t, e, i, "month");
      var s,
        r = [];
      for (s = 0; s < 12; s++) r[s] = mn(t, s, i, "month");
      return r;
    }
    function gn(t, e, i, s) {
      "boolean" == typeof t ? (c(e) && (i = e, e = void 0), e = e || "") : (i = e = t, t = !1, c(e) && (i = e, e = void 0), e = e || "");
      var r,
        n = vi(),
        o = t ? n._week.dow : 0,
        a = [];
      if (null != i) return mn(e, (i + o) % 7, s, "day");
      for (r = 0; r < 7; r++) a[r] = mn(e, (r + o) % 7, s, "day");
      return a;
    }
    function yn(t, e) {
      return fn(t, e, "months");
    }
    function vn(t, e) {
      return fn(t, e, "monthsShort");
    }
    function bn(t, e, i) {
      return gn(t, e, i, "weekdays");
    }
    function _n(t, e, i) {
      return gn(t, e, i, "weekdaysShort");
    }
    function xn(t, e, i) {
      return gn(t, e, i, "weekdaysMin");
    }
    pn.calendar = F, pn.longDateFormat = V, pn.invalidDate = G, pn.ordinal = X, pn.preparse = un, pn.postformat = un, pn.relativeTime = J, pn.pastFuture = Q, pn.set = M, pn.eras = Er, pn.erasParse = Mr, pn.erasConvertYear = Dr, pn.erasAbbrRegex = Ir, pn.erasNameRegex = Tr, pn.erasNarrowRegex = Nr, pn.months = ce, pn.monthsShort = de, pn.monthsParse = ue, pn.monthsRegex = ye, pn.monthsShortRegex = ge, pn.week = Se, pn.firstDayOfYear = Ee, pn.firstDayOfWeek = Ce, pn.weekdays = Le, pn.weekdaysMin = je, pn.weekdaysShort = Re, pn.weekdaysParse = Be, pn.weekdaysRegex = qe, pn.weekdaysShortRegex = Ze, pn.weekdaysMinRegex = Xe, pn.isPM = ii, pn.meridiem = ni, fi("en", {
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
    }), i.lang = k("moment.lang is deprecated. Use moment.locale instead.", fi), i.langData = k("moment.langData is deprecated. Use moment.localeData instead.", vi);
    var wn = Math.abs;
    function $n() {
      var t = this._data;
      return this._milliseconds = wn(this._milliseconds), this._days = wn(this._days), this._months = wn(this._months), t.milliseconds = wn(t.milliseconds), t.seconds = wn(t.seconds), t.minutes = wn(t.minutes), t.hours = wn(t.hours), t.months = wn(t.months), t.years = wn(t.years), this;
    }
    function kn(t, e, i, s) {
      var r = Es(e, i);
      return t._milliseconds += s * r._milliseconds, t._days += s * r._days, t._months += s * r._months, t._bubble();
    }
    function Sn(t, e) {
      return kn(this, t, e, 1);
    }
    function An(t, e) {
      return kn(this, t, e, -1);
    }
    function Cn(t) {
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
        l = this._data;
      return n >= 0 && o >= 0 && a >= 0 || n <= 0 && o <= 0 && a <= 0 || (n += 864e5 * Cn(Dn(a) + o), o = 0, a = 0), l.milliseconds = n % 1e3, t = Ot(n / 1e3), l.seconds = t % 60, e = Ot(t / 60), l.minutes = e % 60, i = Ot(e / 60), l.hours = i % 24, o += Ot(i / 24), a += r = Ot(Mn(o)), o -= Cn(Dn(r)), s = Ot(a / 12), a %= 12, l.days = o, l.months = a, l.years = s, this;
    }
    function Mn(t) {
      return 4800 * t / 146097;
    }
    function Dn(t) {
      return 146097 * t / 4800;
    }
    function On(t) {
      if (!this.isValid()) return NaN;
      var e,
        i,
        s = this._milliseconds;
      if ("month" === (t = et(t)) || "quarter" === t || "year" === t) switch (e = this._days + s / 864e5, i = this._months + Mn(e), t) {
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
    var Fn = Pn("ms"),
      Yn = Pn("s"),
      Tn = Pn("m"),
      In = Pn("h"),
      Nn = Pn("d"),
      Hn = Pn("w"),
      Un = Pn("M"),
      Ln = Pn("Q"),
      Rn = Pn("y"),
      jn = Fn;
    function zn() {
      return Es(this);
    }
    function Bn(t) {
      return t = et(t), this.isValid() ? this[t + "s"]() : NaN;
    }
    function Vn(t) {
      return function () {
        return this.isValid() ? this._data[t] : NaN;
      };
    }
    var Wn = Vn("milliseconds"),
      Gn = Vn("seconds"),
      qn = Vn("minutes"),
      Zn = Vn("hours"),
      Xn = Vn("days"),
      Kn = Vn("months"),
      Jn = Vn("years");
    function Qn() {
      return Ot(this.days() / 7);
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
        l = to(r.as("d")),
        c = to(r.as("M")),
        d = to(r.as("w")),
        h = to(r.as("y")),
        u = n <= i.ss && ["s", n] || n < i.s && ["ss", n] || o <= 1 && ["m"] || o < i.m && ["mm", o] || a <= 1 && ["h"] || a < i.h && ["hh", a] || l <= 1 && ["d"] || l < i.d && ["dd", l];
      return null != i.w && (u = u || d <= 1 && ["w"] || d < i.w && ["ww", d]), (u = u || c <= 1 && ["M"] || c < i.M && ["MM", c] || h <= 1 && ["y"] || ["yy", h])[2] = e, u[3] = +t > 0, u[4] = s, io.apply(null, u);
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
    function lo(t) {
      return (t > 0) - (t < 0) || +t;
    }
    function co() {
      if (!this.isValid()) return this.localeData().invalidDate();
      var t,
        e,
        i,
        s,
        r,
        n,
        o,
        a,
        l = ao(this._milliseconds) / 1e3,
        c = ao(this._days),
        d = ao(this._months),
        h = this.asSeconds();
      return h ? (t = Ot(l / 60), e = Ot(t / 60), l %= 60, t %= 60, i = Ot(d / 12), d %= 12, s = l ? l.toFixed(3).replace(/\.?0+$/, "") : "", r = h < 0 ? "-" : "", n = lo(this._months) !== lo(h) ? "-" : "", o = lo(this._days) !== lo(h) ? "-" : "", a = lo(this._milliseconds) !== lo(h) ? "-" : "", r + "P" + (i ? n + i + "Y" : "") + (d ? n + d + "M" : "") + (c ? o + c + "D" : "") + (e || t || l ? "T" : "") + (e ? a + e + "H" : "") + (t ? a + t + "M" : "") + (l ? a + s + "S" : "")) : "P0D";
    }
    var ho = os.prototype;
    return ho.isValid = rs, ho.abs = $n, ho.add = Sn, ho.subtract = An, ho.as = On, ho.asMilliseconds = Fn, ho.asSeconds = Yn, ho.asMinutes = Tn, ho.asHours = In, ho.asDays = Nn, ho.asWeeks = Hn, ho.asMonths = Un, ho.asQuarters = Ln, ho.asYears = Rn, ho.valueOf = jn, ho._bubble = En, ho.clone = zn, ho.get = Bn, ho.milliseconds = Wn, ho.seconds = Gn, ho.minutes = qn, ho.hours = Zn, ho.days = Xn, ho.weeks = Qn, ho.months = Kn, ho.years = Jn, ho.humanize = oo, ho.toISOString = co, ho.toString = co, ho.toJSON = co, ho.locale = or, ho.localeData = lr, ho.toIsoString = k("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", co), ho.lang = ar, U("X", 0, 0, "unix"), U("x", 0, 0, "valueOf"), Ct("x", vt), Ct("X", $t), Yt("X", function (t, e, i) {
      i._d = new Date(1e3 * parseFloat(t));
    }), Yt("x", function (t, e, i) {
      i._d = new Date(Pt(t));
    }),
    //! moment.js
    i.version = "2.30.1", s(Zi), i.fn = cn, i.min = Qi, i.max = ts, i.now = es, i.utc = p, i.unix = dn, i.months = yn, i.isDate = d, i.locale = fi, i.invalid = y, i.duration = Es, i.isMoment = w, i.weekdays = bn, i.parseZone = hn, i.localeData = vi, i.isDuration = as, i.monthsShort = vn, i.weekdaysMin = xn, i.defineLocale = gi, i.updateLocale = yi, i.locales = bi, i.weekdaysShort = _n, i.normalizeUnits = et, i.relativeTimeRounding = ro, i.relativeTimeThreshold = no, i.calendarFormat = Rs, i.prototype = cn, i.HTML5_FMT = {
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
  var wt = vt(xt.exports);
  const $t = (t, e, i, s) => {
    s = s || {}, i = i ?? {};
    const r = new Event(e, {
      bubbles: void 0 === s.bubbles || s.bubbles,
      cancelable: Boolean(s.cancelable),
      composed: void 0 === s.composed || s.composed
    });
    return r.detail = i, t.dispatchEvent(r), r;
  };
  var kt, St, At;
  !function (t) {
    t.ETA = "ETA", t.Elapsed = "Elapsed", t.Remaining = "Remaining";
  }(kt || (kt = {})), function (t) {
    t.F = "F", t.C = "C";
  }(St || (St = {})), function (t) {
    t.Status = "Status", t.HotendCurrent = "Hotend", t.BedCurrent = "Bed", t.HotendTarget = "T Hotend", t.BedTarget = "T Bed", t.PrinterOnline = "Online", t.Availability = "Availability", t.ProjectName = "Project", t.CurrentLayer = "Layer", t.DryingStatus = "Dry Status", t.DryingTime = "Dry Time";
  }(At || (At = {}));
  const Ct = Object.assign(Object.assign({}, kt), At);
  var Et;
  !function (t) {
    t.PLA = "PLA", t.PETG = "PETG", t.ABS = "ABS", t.PACF = "PACF", t.PC = "PC", t.ASA = "ASA", t.HIPS = "HIPS", t.PA = "PA", t.PLA_SE = "PLA_SE";
  }(Et || (Et = {}));
  const Mt = ["width", "height", "left", "top"];
  function Dt(t, e) {
    Object.keys(e).forEach(t => {
      Mt.includes(t) && !isNaN(e[t]) && (e[t] = e[t].toString() + "px");
    }), t && Object.assign(t.style, e);
  }
  function Ot(t) {
    return t.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  }
  function Pt(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function Ft(t, e, i, s) {
    const r = function (t, e) {
      const i = Pt(t, e);
      return i ? String(i.state) : "";
    }(t, e);
    return "on" === r ? i : s;
  }
  function Yt(t) {
    const e = {};
    for (const i in t.devices) {
      const s = t.devices[i];
      "Anycubic" === s.manufacturer && (e[s.id] = s);
    }
    return e;
  }
  function Tt(t, e, i, s) {
    for (const r in t) {
      const n = t[r],
        o = r.split("."),
        a = o[0],
        l = o[1].split(e)[1];
      if (a === i && l === s) return n;
    }
  }
  function It(t, e, i, s, r = "unavailable", n = {}) {
    return Pt(t, Tt(e, i, "sensor", s)) || {
      state: r,
      attributes: n
    };
  }
  function Nt(t, e, i, s, r, n) {
    const o = Tt(e, i, "binary_sensor", s);
    return o ? Ft(t, o, r, n) : void 0;
  }
  function Ht(t) {
    return ["printing", "preheating"].includes(t);
  }
  const Ut = (t, e) => e ? wt.duration(t, "seconds").humanize() : (() => {
    const e = wt.duration(t, "seconds"),
      i = e.days(),
      s = e.hours(),
      r = e.minutes(),
      n = e.seconds();
    return `${i > 0 ? `${i}d` : ""}${s > 0 ? ` ${s}h` : ""}${r > 0 ? ` ${r}m` : ""}${n > 0 ? ` ${n}s` : ""}`;
  })();
  const Lt = {
      [St.C]: {
        [St.C]: t => t,
        [St.F]: t => 9 * t / 5 + 32
      },
      [St.F]: {
        [St.C]: t => 5 * (t - 32) / 9,
        [St.F]: t => t
      }
    },
    Rt = (t, e, i = !1) => {
      const s = parseFloat(t.state),
        r = (t => {
          var e;
          switch (null === (e = t.attributes) || void 0 === e ? void 0 : e.unit_of_measurement) {
            case "°C":
            default:
              return St.C;
            case "°F":
              return St.F;
          }
        })(t),
        n = (o = s, l = e || r, Lt[a = r] && Lt[a][l] ? Lt[a][l](o) : -1);
      var o, a, l;
      return `${i ? Math.round(n) : n.toFixed(2)}°${e || r}`;
    };
  function jt() {
    return [Ct.Status, Ct.ETA, Ct.Elapsed, Ct.HotendCurrent, Ct.BedCurrent, Ct.Remaining, Ct.HotendTarget, Ct.BedTarget];
  }
  function zt(t, e) {
    return void 0 === t ? e : t;
  }
  var Bt = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Vt = 1,
    Wt = 2,
    Gt = t => (...e) => ({
      _$litDirective$: t,
      values: e
    });
  class qt {
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
  const Zt = Gt(class extends qt {
      constructor(t) {
        if (super(t), t.type !== Vt || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
        return W;
      }
    }),
    Xt = "important",
    Kt = " !" + Xt,
    Jt = Gt(class extends qt {
      constructor(t) {
        if (super(t), t.type !== Vt || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
            const e = "string" == typeof s && s.endsWith(Kt);
            t.includes("-") || e ? i.setProperty(t, e ? s.slice(0, -11) : s, e ? Xt : "") : i[t] = s;
          }
        }
        return W;
      }
    }),
    {
      I: Qt
    } = at,
    te = () => document.createComment(""),
    ee = (t, e, i) => {
      const s = t._$AA.parentNode,
        r = void 0 === e ? t._$AB : e._$AA;
      if (void 0 === i) {
        const e = s.insertBefore(te(), r),
          n = s.insertBefore(te(), r);
        i = new Qt(e, n, t, t.options);
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
    ie = (t, e, i = t) => (t._$AI(e, i), t),
    se = {},
    re = t => {
      t._$AP?.(!1, !0);
      let e = t._$AA;
      const i = t._$AB.nextSibling;
      for (; e !== i;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    },
    ne = (t, e) => {
      const i = t._$AN;
      if (void 0 === i) return !1;
      for (const t of i) t._$AO?.(e, !1), ne(t, e);
      return !0;
    },
    oe = t => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        i = e._$AN, i.delete(t), t = e;
      } while (0 === i?.size);
    },
    ae = t => {
      for (let e; e = t._$AM; t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();else if (i.has(t)) break;
        i.add(t), de(e);
      }
    };
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function le(t) {
    void 0 !== this._$AN ? (oe(this), this._$AM = t, ae(this)) : this._$AM = t;
  }
  function ce(t, e = !1, i = 0) {
    const s = this._$AH,
      r = this._$AN;
    if (void 0 !== r && 0 !== r.size) if (e) {
      if (Array.isArray(s)) for (let t = i; t < s.length; t++) ne(s[t], !1), oe(s[t]);else null != s && (ne(s, !1), oe(s));
    } else ne(this, t);
  }
  const de = t => {
    t.type == Wt && (t._$AP ??= ce, t._$AQ ??= le);
  };
  class he extends qt {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(t, e, i) {
      super._$AT(t, e, i), ae(this), this.isConnected = t._$AU;
    }
    _$AO(t, e = !0) {
      t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (ne(this, t), oe(this));
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
  const ue = new WeakMap();
  let pe = 0;
  const me = new Map(),
    fe = new WeakSet(),
    ge = () => new Promise(t => requestAnimationFrame(t)),
    ye = (t, e) => {
      const i = t - e;
      return 0 === i ? void 0 : i;
    },
    ve = (t, e) => {
      const i = t / e;
      return 1 === i ? void 0 : i;
    },
    be = {
      left: (t, e) => {
        const i = ye(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateX(${i}px)`
        };
      },
      top: (t, e) => {
        const i = ye(t, e);
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
        const s = ve(t, e);
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
        const s = ve(t, e);
        return {
          value: s,
          overrideFrom: i,
          transform: null == s || isNaN(s) ? void 0 : `scaleY(${s})`
        };
      }
    },
    _e = {
      duration: 333,
      easing: "ease-in-out"
    },
    xe = ["left", "top", "width", "height", "opacity", "color", "background"],
    we = new WeakMap();
  const $e = Gt(class extends he {
      constructor(t) {
        if (super(t), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, t.type === Wt) throw Error("The `animate` directive must be used in attribute position.");
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
        return ue.get(this.u);
      }
      isDisabled() {
        return this.options.disabled || this.getController()?.disabled;
      }
      update(t, [e]) {
        const i = void 0 === this.u;
        return i && (this.u = t.options?.host, this.u.addController(this), this.u.updateComplete.then(t => this.t = !0), this.element = t.element, we.set(this.element, this)), this.optionsOrCallback = e, (i || "function" != typeof e) && this.p(e), this.render(e);
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
        }), t.properties ??= xe, this.options = t;
      }
      m() {
        const t = {},
          e = this.element.getBoundingClientRect(),
          i = getComputedStyle(this.element);
        return this.options.properties.forEach(s => {
          const r = e[s] ?? (be[s] ? void 0 : i[s]),
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
        this.prepare(), await ge;
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
          const i = me.get(this.options.inId);
          if (i) {
            me.delete(this.options.inId);
            const {
              from: r,
              to: n
            } = this.N(i, s, e);
            t = this.calculateKeyframes(r, n), t = this.options.in ? [{
              ...this.options.in[0],
              ...t[0]
            }, ...this.options.in.slice(1), t[1]] : t, pe++, t.forEach(t => t.zIndex = pe);
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
        if (void 0 !== this.options.id && me.set(this.options.id, this.A), void 0 === this.options.out) return;
        if (this.prepare(), await ge(), this.i?.isConnected) {
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
          const i = we.get(e);
          i && !i.isDisabled() && i && t.push(i);
        }
        return t;
      }
      get isHostRendered() {
        const t = fe.has(this.u);
        return t || this.u.updateComplete.then(() => {
          fe.add(this.u);
        }), t;
      }
      j(t, e = this.O()) {
        const i = {
          ..._e
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
            l = e[i];
          if (i in be) {
            const t = be[i];
            if (void 0 === a || void 0 === l) continue;
            const e = t(a, l);
            void 0 !== e.transform && (o[i] = e.value, n = !0, s.transform = `${s.transform ?? ""} ${e.transform}`, void 0 !== e.overrideFrom && Object.assign(s, e.overrideFrom));
          } else a !== l && void 0 !== a && void 0 !== l && (n = !0, s[i] = a, r[i] = l);
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
    ke = t => e => "function" == typeof e ? ((t, e) => (window.customElements.get(t) || window.customElements.define(t, e), e))(t, e) : ((t, e) => {
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
  let Se = class extends ct {
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
      return V`
      <div
        class="ac-printercard-cameraview"
        style=${Jt(t)}
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
      return V` <div
      class="ac-camera-wrapper"
      style=${Jt(t)}
    ></div>`;
    }
    _handleToggleClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return l`
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
  function* Ae(t, e) {
    if (void 0 !== t) {
      let i = 0;
      for (const s of t) yield e(s, i++);
    }
  }
  e([mt()], Se.prototype, "showVideo", void 0), e([mt()], Se.prototype, "toggleVideo", void 0), e([mt()], Se.prototype, "cameraEntity", void 0), e([ft()], Se.prototype, "camImgString", void 0), Se = e([ke("anycubic-printercard-camera_view")], Se);
  let Ce = class extends ct {
    constructor() {
      super(...arguments), this.spoolList = [], this.selectedIndex = -1, this.selectedMaterialType = "", this.selectedColor = [0, 0, 0];
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) && (this.spoolList = It(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "not loaded", {
        spool_info: []
      }).attributes.spool_info);
    }
    render() {
      return V`
      <div class="ac-printercard-mcbview">${this._renderSpools()}</div>
    `;
    }
    _renderSpools() {
      return Ae(this.spoolList, (t, e) => {
        const i = {
          "background-color": t.spool_loaded ? `rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})` : "#aaa"
        };
        return V`
        <div
          class="ac-spool-info"
          @click="${i => {
          this._editSpool(e, t.material_type, t.color);
        }}"
        >
          <div class="ac-spool-color-ring" style=${Jt(i)}>
            <div class="ac-spool-color-num">${e + 1}</div>
          </div>
          <div class="ac-spool-material-type">
            ${t.spool_loaded ? t.material_type : "---"}
          </div>
        </div>
      `;
      });
    }
    _editSpool(t, e, i) {
      $t(this, "ac-mcb-modal", {
        modalOpen: !0,
        spool_index: t,
        material_type: e,
        color: i
      });
    }
    static get styles() {
      return l`
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
        cursor: pointer;
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
  e([mt()], Ce.prototype, "hass", void 0), e([mt()], Ce.prototype, "printerEntities", void 0), e([mt()], Ce.prototype, "printerEntityIdPart", void 0), e([ft()], Ce.prototype, "spoolList", void 0), e([ft()], Ce.prototype, "selectedIndex", void 0), e([ft()], Ce.prototype, "selectedMaterialType", void 0), e([ft()], Ce.prototype, "selectedColor", void 0), Ce = e([ke("anycubic-printercard-multicolorbox_view")], Ce);
  class Ee {
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
  const Me = {
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
  class De {
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
  const Oe = {
      keyframeOptions: {
        duration: 2e3,
        direction: "alternate"
      },
      properties: ["left"]
    },
    Pe = {
      keyframeOptions: {
        duration: 100
      },
      properties: ["top"]
    };
  let Fe = class extends ct {
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
      super.connectedCallback(), this.resizeObserver = new De(this, {
        callback: this._onResizeEvent
      });
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("scaleFactor") && this._onResizeEvent(), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        this._progressNum = It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", 0).state / 100;
        const t = It(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state.toLowerCase();
        this._isPrinting = Ht(t);
      }
    }
    update(t) {
      if (super.update(t), (t.has("dimensions") || t.has("animKeyframeGantry") || t.has("hass")) && this.dimensions) {
        const e = -1 * this._progressNum * this.dimensions.BuildArea.height;
        Dt(this._elAcAPr_xaxis, Object.assign(Object.assign({}, this.dimensions.XAxis), {
          top: this.dimensions.XAxis.top + e
        })), Dt(this._elAcAPr_gantry, Object.assign(Object.assign({}, this.dimensions.Gantry), {
          left: 0 !== this.animKeyframeGantry ? this.dimensions.Gantry.left + this.dimensions.BuildPlate.width : this.dimensions.Gantry.left,
          top: this.dimensions.Gantry.top + e
        })), Dt(this._elAcAPr_animprint, {
          height: 100 * this._progressNum + "%"
        }), t.has("dimensions") && this.dimensions && (Dt(this._elAcAPr_scalable, Object.assign({}, this.dimensions.Scalable)), Dt(this._elAcAPr_frame, Object.assign({}, this.dimensions.Frame)), Dt(this._elAcAPr_hole, Object.assign({}, this.dimensions.Hole)), Dt(this._elAcAPr_buildarea, Object.assign({}, this.dimensions.BuildArea)), Dt(this._elAcAPr_buildplate, Object.assign({}, this.dimensions.BuildPlate)), Dt(this._elAcAPr_nozzle, Object.assign({}, this.dimensions.Nozzle)));
      }
    }
    render() {
      return V`
      <div class="ac-printercard-animatedprinter">
        ${this.dimensions ? V` <div class="ac-apr-scalable">
              <div class="ac-apr-frame">
                <div class="ac-apr-hole"></div>
              </div>
              <div class="ac-apr-buildarea">
                <div class="ac-apr-animprint"></div>
              </div>
              <div class="ac-apr-buildplate"></div>
              <div
                class="ac-apr-xaxis"
                ${$e(Object.assign({}, Pe))}
              ></div>
              <div
                class="ac-apr-gantry"
                ${$e(Object.assign({}, Pe))}
                ${this.dimensions && this._isPrinting ? $e(Object.assign(Object.assign({}, Oe), {
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
        const s = new Ee(e.height / (t.top.height + t.bottom.height + t.left.height) * i),
          r = s.val(t.top.width),
          n = s.val(t.top.height + t.bottom.height + t.left.height),
          o = s.val(t.top.width - (t.left.width + t.right.width)),
          a = s.val(t.left.height),
          l = s.val(t.left.width),
          c = s.val(t.top.height),
          d = s.val(t.top.height - t.buildplate.verticalOffset) + a,
          h = d + s.val((t.xAxis.extruder.height - t.xAxis.height) / 2 - (t.xAxis.extruder.height + 12)),
          u = s.val(t.buildplate.maxWidth),
          p = s.val(t.buildplate.maxHeight),
          m = s.val(t.left.width + (s.og(o) - t.buildplate.maxWidth) / 2),
          f = d - s.val(t.buildplate.maxHeight),
          g = u,
          y = m,
          v = d,
          b = s.val(t.xAxis.width),
          _ = s.val(t.xAxis.height),
          x = s.val(t.xAxis.offsetLeft),
          w = b,
          $ = _,
          k = s.val(t.xAxis.extruder.width),
          S = s.val(t.xAxis.extruder.height),
          A = y - k / 2,
          C = A + u,
          E = s.val(12),
          M = s.val(12),
          D = v - S - M;
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
            left: l,
            top: c
          },
          BuildArea: {
            width: u,
            height: p,
            left: m,
            top: f
          },
          BuildPlate: {
            width: g,
            left: y,
            top: v
          },
          XAxis: {
            width: b,
            height: _,
            left: x,
            top: D + .7 * S - _ / 2
          },
          Track: {
            width: w,
            height: $
          },
          Basis: {
            Y: d,
            X: h
          },
          Gantry: {
            width: k,
            height: S,
            left: A,
            top: D
          },
          Nozzle: {
            width: E,
            height: M,
            left: (k - E) / 2,
            top: S
          },
          GantryMaxLeft: C
        };
      }(this.printerConfig, {
        width: t,
        height: e
      }, this.scaleFactor || 1);
    }
    _moveGantry() {
      this.animKeyframeGantry = Number(!this.animKeyframeGantry);
    }
    static get styles() {
      return l`
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
  e([yt(".ac-printercard-animatedprinter")], Fe.prototype, "_rootElement", void 0), e([yt(".ac-apr-scalable")], Fe.prototype, "_elAcAPr_scalable", void 0), e([yt(".ac-apr-frame")], Fe.prototype, "_elAcAPr_frame", void 0), e([yt(".ac-apr-hole")], Fe.prototype, "_elAcAPr_hole", void 0), e([yt(".ac-apr-buildarea")], Fe.prototype, "_elAcAPr_buildarea", void 0), e([yt(".ac-apr-animprint")], Fe.prototype, "_elAcAPr_animprint", void 0), e([yt(".ac-apr-buildplate")], Fe.prototype, "_elAcAPr_buildplate", void 0), e([yt(".ac-apr-xaxis")], Fe.prototype, "_elAcAPr_xaxis", void 0), e([yt(".ac-apr-gantry")], Fe.prototype, "_elAcAPr_gantry", void 0), e([yt(".ac-apr-nozzle")], Fe.prototype, "_elAcAPr_nozzle", void 0), e([mt()], Fe.prototype, "hass", void 0), e([mt()], Fe.prototype, "scaleFactor", void 0), e([mt()], Fe.prototype, "printerConfig", void 0), e([mt()], Fe.prototype, "printerEntities", void 0), e([mt()], Fe.prototype, "printerEntityIdPart", void 0), e([ft()], Fe.prototype, "dimensions", void 0), e([ft()], Fe.prototype, "resizeObserver", void 0), e([ft()], Fe.prototype, "_progressNum", void 0), e([ft({
    type: Number
  })], Fe.prototype, "animKeyframeGantry", void 0), e([ft({
    type: Boolean
  })], Fe.prototype, "_isPrinting", void 0), Fe = e([ke("anycubic-printercard-animated_printer")], Fe);
  let Ye = class extends ct {
    render() {
      return V`
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
          .printerConfig=${Me}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
    }
    _viewClick() {
      this.toggleVideo && this.toggleVideo();
    }
    static get styles() {
      return l`
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
  e([mt()], Ye.prototype, "hass", void 0), e([mt({
    type: Function
  })], Ye.prototype, "toggleVideo", void 0), e([mt()], Ye.prototype, "printerEntities", void 0), e([mt()], Ye.prototype, "printerEntityIdPart", void 0), e([mt()], Ye.prototype, "scaleFactor", void 0), Ye = e([ke("anycubic-printercard-printer_view")], Ye);
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Te = (t, e, i) => {
      const s = new Map();
      for (let r = e; r <= i; r++) s.set(t[r], r);
      return s;
    },
    Ie = Gt(class extends qt {
      constructor(t) {
        if (super(t), t.type !== Wt) throw Error("repeat() can only be used in text expressions");
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
          l = [];
        let c,
          d,
          h = 0,
          u = r.length - 1,
          p = 0,
          m = n.length - 1;
        for (; h <= u && p <= m;) if (null === r[h]) h++;else if (null === r[u]) u--;else if (a[h] === o[p]) l[p] = ie(r[h], n[p]), h++, p++;else if (a[u] === o[m]) l[m] = ie(r[u], n[m]), u--, m--;else if (a[h] === o[m]) l[m] = ie(r[h], n[m]), ee(t, l[m + 1], r[h]), h++, m--;else if (a[u] === o[p]) l[p] = ie(r[u], n[p]), ee(t, r[h], r[u]), u--, p++;else if (void 0 === c && (c = Te(o, p, m), d = Te(a, h, u)), c.has(a[h])) {
          if (c.has(a[u])) {
            const e = d.get(o[p]),
              i = void 0 !== e ? r[e] : null;
            if (null === i) {
              const e = ee(t, r[h]);
              ie(e, n[p]), l[p] = e;
            } else l[p] = ie(i, n[p]), ee(t, r[h], i), r[e] = null;
            p++;
          } else re(r[u]), u--;
        } else re(r[h]), h++;
        for (; p <= m;) {
          const e = ee(t, l[m + 1]);
          ie(e, n[p]), l[p++] = e;
        }
        for (; h <= u;) {
          const t = r[h++];
          null !== t && re(t);
        }
        return this.ut = o, ((t, e = se) => {
          t._$AH = e;
        })(t, l), W;
      }
    });
  let Ne = class extends ct {
    render() {
      const t = {
        width: String(this.progress) + "%"
      };
      return V`
      <div class="ac-stat-line">
        <p class="ac-stat-heading">${this.name}</p>
        <div class="ac-stat-value">
          <div class="ac-progress-bar">
            <div class="ac-stat-text">${this.value}</div>
            <div
              class="ac-progress-line"
              style=${Jt(t)}
            ></div>
          </div>
        </div>
      </div>
    `;
    }
    static get styles() {
      return l`
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
        max-width: 100px;
        width: 100px;
        position: relative;
      }

      .ac-stat-text {
        margin: 0;
        font-size: 16px;
        display: block;
        max-width: 100px;
        overflow: scroll;
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
  e([mt({
    type: String
  })], Ne.prototype, "name", void 0), e([mt({
    type: Number
  })], Ne.prototype, "value", void 0), e([mt({
    type: Number
  })], Ne.prototype, "progress", void 0), Ne = e([ke("anycubic-printercard-progress-line")], Ne);
  let He = class extends ct {
    render() {
      return V`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}</p>
      </div>
    `;
    }
    static get styles() {
      return l`
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
        max-width: 100px;
        overflow: scroll;
      }

      .ac-stat-heading {
        font-weight: bold;
        max-width: unset;
        overflow: unset;
      }
    `;
    }
  };
  e([mt({
    type: String
  })], He.prototype, "name", void 0), e([mt({
    type: String
  })], He.prototype, "value", void 0), He = e([ke("anycubic-printercard-stat-line")], He);
  let Ue = class extends ct {
    render() {
      return V`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${Rt(this.temperatureEntity, this.temperatureUnit, this.round)}
    ></anycubic-printercard-stat-line>`;
    }
    static get styles() {
      return l`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  e([mt({
    type: String
  })], Ue.prototype, "name", void 0), e([mt()], Ue.prototype, "temperatureEntity", void 0), e([mt({
    type: Boolean
  })], Ue.prototype, "round", void 0), e([mt({
    type: String
  })], Ue.prototype, "temperatureUnit", void 0), Ue = e([ke("anycubic-printercard-stat-temperature")], Ue);
  let Le = class extends ct {
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
      return V`<anycubic-printercard-stat-line
      .name=${this.timeType}
      .value=${((t, e, i = !1, s = !1) => {
        switch (e) {
          case kt.Remaining:
            return Ut(t, i);
          case kt.ETA:
            return wt().add(t, "seconds").format(s ? "HH:mm" : "h:mm a");
          case kt.Elapsed:
            return Ut(t, i);
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
      return l`
      :host {
        box-sizing: border-box;
        width: 100%;
      }
    `;
    }
  };
  e([mt()], Le.prototype, "timeEntity", void 0), e([mt()], Le.prototype, "timeType", void 0), e([mt({
    type: Number
  })], Le.prototype, "direction", void 0), e([mt({
    type: Boolean
  })], Le.prototype, "round", void 0), e([mt({
    type: Boolean
  })], Le.prototype, "use_24hr", void 0), e([mt({
    type: Boolean
  })], Le.prototype, "isSeconds", void 0), e([ft({
    type: Number
  })], Le.prototype, "currentTime", void 0), e([ft({
    type: Number
  })], Le.prototype, "lastIntervalId", void 0), Le = e([ke("anycubic-printercard-stat-time")], Le);
  let Re = class extends ct {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = St.C, this.progressPercent = 0;
    }
    render() {
      return V`
      <div class="ac-stats-box ac-stats-section">
        ${this.showPercent ? V`
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
      return Ie(this.monitoredStats, t => t, (t, e) => {
        switch (t) {
          case Ct.Status:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${Ot(It(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state)}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.ETA:
            return V`
              <anycubic-printercard-stat-time
                .timeEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ct.Elapsed:
            return V`
              <anycubic-printercard-stat-time
                .timeEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_elapsed")}
                .timeType=${t}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ct.Remaining:
            return V`
              <anycubic-printercard-stat-time
                .timeEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Ct.BedCurrent:
            return V`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ct.HotendCurrent:
            return V`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ct.BedTarget:
            return V`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ct.HotendTarget:
            return V`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Ct.PrinterOnline:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${Nt(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_online", "Online", "Offline")}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.Availability:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${Ot(It(this.hass, this.printerEntities, this.printerEntityIdPart, "current_status").state)}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.ProjectName:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${function (t) {
              const e = t.indexOf("-0."),
                i = e > 0 ? [t.slice(0, e), t.slice(e + 1)] : [t],
                s = i[0].match(/.{1,10}/g).join("\n");
              return i.length > 1 ? s + "-" + i.slice(1) : s;
            }(It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_name").state)}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.CurrentLayer:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${It(this.hass, this.printerEntities, this.printerEntityIdPart, "current_layer").state}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.DryingStatus:
            return V`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${Nt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_active", "Drying", "Not Drying")}
              ></anycubic-printercard-stat-line>
            `;
          case Ct.DryingTime:
            {
              const e = Number(It(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_total_duration", 0).state),
                i = Number(It(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_remaining_time", 0).state);
              return V`
              <anycubic-printercard-progress-line
                .name=${t}
                .value=${`${i} Mins`}
                .progress=${e > 0 ? i / e * 100 : 0}
              ></anycubic-printercard-progress-line>
            `;
            }
          default:
            return V`
              <anycubic-printercard-stat-line
                .name=${"Unknown"}
                .value=${"<unknown>"}
              ></anycubic-printercard-stat-line>
            `;
        }
      });
    }
    static get styles() {
      return l`
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
  e([mt()], Re.prototype, "hass", void 0), e([mt()], Re.prototype, "monitoredStats", void 0), e([mt({
    type: Boolean
  })], Re.prototype, "showPercent", void 0), e([mt({
    type: Boolean
  })], Re.prototype, "round", void 0), e([mt({
    type: Boolean
  })], Re.prototype, "use_24hr", void 0), e([mt({
    type: String
  })], Re.prototype, "temperatureUnit", void 0), e([mt()], Re.prototype, "printerEntities", void 0), e([mt()], Re.prototype, "printerEntityIdPart", void 0), e([mt()], Re.prototype, "progressPercent", void 0), Re = e([ke("anycubic-printercard-stats-component")], Re);
  const je = t => Ve(255, Math.round(Number(t))),
    ze = t => je(255 * t),
    Be = t => Ve(1, t / 255),
    Ve = (t, e) => Math.max(0, Math.min(t, e)),
    We = t => void 0 === t ? 1 : ("string" == typeof t && t.indexOf("%") > 0 && (t = Number(t.split("%")[0]) / 100), t = Number(Number(t).toFixed(3)), isNaN(t) ? 1 : Ve(1, t)),
    Ge = {
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
  class qe {
    constructor(t, e, i, s) {
      return qe.isBaseConstructor(t) ? (this.r = je(t.r), this.g = je(t.g), this.b = je(t.b), void 0 !== t.a && (this.a = We(t.a)), this) : qe.parse(t, e, i, s);
    }
    static parse(t, e, i, s) {
      if (qe.isBaseConstructor(t)) return new qe(t);
      if (void 0 !== e && void 0 !== i) {
        let r = je(t);
        return e = je(e), i = je(i), void 0 !== s && (s = We(s)), new qe({
          r,
          g: e,
          b: i,
          a: s
        });
      }
      if (Array.isArray(t)) return qe.fromArray(t);
      if ("string" == typeof t) {
        let i;
        if (void 0 !== e && Number(e) <= 1 && Number(e) >= 0 && (i = Number(e)), t.startsWith("#")) return qe.fromHex(t, i);
        if (Ge[t.toLowerCase()]) return qe.fromNamed(t, i);
        if (t.startsWith("rgb")) return qe.fromRgbString(t);
        if ("transparent" === t) {
          let t, e, i, s;
          return t = e = i = s = 0, new qe({
            r: t,
            g: e,
            b: i,
            a: s
          });
        }
        return null;
      }
      if ("object" == typeof t) {
        if (void 0 !== t.a && (this.a = We(t.a)), void 0 !== t.h) {
          let e = {};
          if (void 0 !== t.v) e = qe.fromHsv(t);else {
            if (void 0 === t.l) return qe.fromArray([0, 0, 0]);
            e = qe.fromHsl(t);
          }
          return e.a = void 0 !== t.a ? We(t.a) : void 0, new qe(e);
        }
        return void 0 !== t.c ? qe.fromCMYK(t) : this;
      }
      return qe.fromArray([0, 0, 0]);
    }
    static isBaseConstructor(t) {
      return "object" == typeof t && void 0 !== t.r && void 0 !== t.g && void 0 !== t.b;
    }
    static fromNamed(t, e) {
      return qe.fromHex(Ge[t.toLowerCase()], e);
    }
    static fromArray(t) {
      t = t.filter(t => "" !== t && isFinite(t));
      const e = {
        r: je(t[0]),
        g: je(t[1]),
        b: je(t[2])
      };
      return void 0 !== t[3] && (e.a = We(t[3])), new qe(e);
    }
    static fromHex(t, e) {
      3 !== (t = t.replace("#", "")).length && 4 !== t.length || (t = t.split("").map(t => t + t).join(""));
      let i = t.match(/[A-Za-z0-9]{2}/g).map(t => parseInt(t, 16));
      return 4 === i.length ? i[3] /= 255 : void 0 !== e && (i[3] = e), qe.fromArray(i);
    }
    static fromRgbString(t) {
      if (t.includes(",")) return qe.fromArray(t.split("(")[1].split(")")[0].split(","));
      const e = t.replace("/", " ").split("(")[1].replace(")", "").split(" ").filter(t => "" !== t && isFinite(Number(t)));
      return qe.fromArray(e);
    }
    static fromHsv({
      h: t,
      s: e,
      v: i
    }) {
      e /= 100, i /= 100;
      const s = Math.floor(t / 60 % 6),
        r = t / 60 - s,
        n = i * (1 - e),
        o = i * (1 - r * e),
        a = i * (1 - (1 - r) * e),
        l = [[i, a, n], [o, i, n], [n, i, a], [n, o, i], [a, n, i], [i, n, o]][s].map(t => Math.round(256 * t));
      return new qe({
        r: je(l[0]),
        g: je(l[1]),
        b: je(l[2])
      });
    }
    static fromHsl({
      h: t,
      s: e,
      l: i
    }) {
      e /= 100, i /= 100;
      const s = (1 - Math.abs(2 * i - 1)) * e,
        r = s * (1 - Math.abs(t / 60 % 2 - 1)),
        n = i - s / 2;
      let o = 0,
        a = 0,
        l = 0;
      return 0 <= t && t < 60 ? (o = s, a = r, l = 0) : 60 <= t && t < 120 ? (o = r, a = s, l = 0) : 120 <= t && t < 180 ? (o = 0, a = s, l = r) : 180 <= t && t < 240 ? (o = 0, a = r, l = s) : 240 <= t && t < 300 ? (o = r, a = 0, l = s) : 300 <= t && t < 360 && (o = s, a = 0, l = r), new qe({
        r: ze(n + o),
        g: ze(n + a),
        b: ze(n + l)
      });
    }
    static fromCMYK({
      c: t,
      m: e,
      y: i,
      k: s,
      a: r
    }) {
      const n = t => ze(1 - Math.min(1, t / 100 * (1 - s) + s));
      return new qe({
        r: n(t),
        b: n(e),
        g: n(i),
        a: r
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
      return t[3] = ze(t[3]), `#${t.map(t => t.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
    }
    get hsv() {
      const t = Be(this.r),
        e = Be(this.g),
        i = Be(this.b),
        s = Math.min(t, e, i),
        r = Math.max(t, e, i);
      let n;
      const o = r,
        a = r - s;
      n = 0 === a ? 0 : r === t ? (e - i) / a * 60 % 360 : r === e ? (i - t) / a * 60 + 120 : r === i ? (t - e) / a * 60 + 240 : 0, n < 0 && (n += 360);
      const l = 0 === r ? 0 : 1 - s / r;
      return {
        h: Math.round(n),
        s: Math.round(100 * l),
        v: Math.round(100 * o),
        a: this.alpha
      };
    }
    get hsl() {
      const t = Be(this.r),
        e = Be(this.g),
        i = Be(this.b),
        s = Math.max(t, e, i),
        r = Math.min(t, e, i);
      let n, o;
      const a = (s + r) / 2;
      if (s === r) n = o = 0;else {
        const l = s - r;
        switch (o = a > .5 ? l / (2 - s - r) : l / (s + r), s) {
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
      let t, e, i, s;
      const r = parseFloat(this.r) / 255,
        n = parseFloat(this.g) / 255,
        o = parseFloat(this.b) / 255;
      return s = 1 - Math.max(r, n, o), 1 === s ? t = e = i = 0 : (t = (1 - r - s) / (1 - s), e = (1 - n - s) / (1 - s), i = (1 - o - s) / (1 - s)), t = Math.round(100 * t), e = Math.round(100 * e), i = Math.round(100 * i), s = Math.round(100 * s), this.alpha ? {
        c: t,
        m: e,
        y: i,
        k: s,
        a: this.alpha
      } : {
        c: t,
        m: e,
        y: i,
        k: s
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
      i[3] = ze(i[3]);
      const s = new qe(t).rgba;
      s[3] = ze(s[3]), e = We(e);
      const r = i.map((t, i) => {
        const r = s[i],
          n = r < t,
          o = n ? t - r : r - t,
          a = Math.round(o * e);
        return n ? t - a : a + t;
      });
      return r[3] = Be(r[3]), qe.fromArray(r);
    }
    adjustSatLum(t, e, i) {
      const s = this.hsl;
      let r = s[t],
        n = (i ? r : 100 - r) * e;
      return s[t] = Ve(100, i ? r - n : r + n), s.a = this.a, new qe(s);
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
      return e.h = Math.round(e.h + t) % 360, e.a = this.a, new qe(e);
    }
    fadeIn(t, e) {
      let i = this.alpha;
      const {
        r: s,
        g: r,
        b: n
      } = this;
      let o = (1 - i) * t;
      return i = e ? i - o : i + o, qe({
        r: s,
        g: r,
        b: n,
        a: i
      });
    }
    fadeOut(t) {
      return this.fadeIn(t, !0);
    }
    negate() {
      let t = this.rgb.map(t => 255 - t);
      return void 0 !== this.a && t.push(this.alpha), qe.fromArray(t);
    }
  }
  const Ze = (t, e, i = "color-update") => {
      const s = i.includes("color") ? {
          color: e
        } : e,
        r = new CustomEvent(i, {
          bubbles: !0,
          composed: !0,
          detail: s
        });
      t.dispatchEvent(r);
    },
    Xe = (t = 3, e) => {
      let i = 0,
        s = 100,
        r = 50,
        n = null,
        o = !1;
      e && (s = e.s, e.hasOwnProperty("v") ? (n = e.v, r = null, o = !0) : r = e.l);
      const a = [];
      let l, c;
      const d = (t, e) => `${t.css} ${(100 * e).toFixed(1)}%`;
      for (; i < 360;) l = qe.parse(o ? {
        h: i,
        s,
        v: n
      } : {
        h: i,
        s,
        l: r
      }), c = i / 360, a.push(d(l, c)), i += t;
      return i = 359, l = qe.parse(o ? {
        h: i,
        s,
        v: n
      } : {
        h: i,
        s,
        l: r
      }), c = 1, a.push(d(l, c)), a.join(", ");
    },
    Ke = V`<svg
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
  class Je extends ct {
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
    static styles = l`
    :host > div {
      display: block;
      width: ${a(this.width)}px;
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
        backgroundImage: `linear-gradient(90deg, ${Xe(24)})`
      }, this.width = 400, this.sliderStyle = {
        display: "none"
      };
    }
    firstUpdated() {
      const t = this.renderRoot.querySelector("lit-movable");
      t.onmovestart = () => {
        Ze(this.renderRoot, {
          sliding: !0
        }, "sliding-hue");
      }, t.onmoveend = () => {
        Ze(this.renderRoot, {
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
          backgroundColor: qe.parse({
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
        s = Math.max(0, Math.min(359, Math.round(i * e))),
        r = this.renderRoot.querySelector("a"),
        n = new CustomEvent("hue-update", {
          bubbles: !0,
          composed: !0,
          detail: {
            h: s
          }
        });
      r.dispatchEvent(n), this.sliderStyle = this.sliderCss(s);
    }
    render() {
      return V` <div
      style=${Jt(this.gradient)}
      class="bar"
      @click="${this.selectHue}"
    >
      <lit-movable
        horizontal="${this.sliderBounds.min}, ${this.sliderBounds.max}"
        posLeft="${this.sliderBounds.posLeft}"
      >
        <a class="slider" style=${Jt(this.sliderCss(this.h))}></a>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hue-bar") || customElements.define("hue-bar", Je);
  const Qe = l`
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
    ti = l`
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
    ei = l`
  color: var(--input-active-color);
  background-color: var(--input-active-bg);
  border-color: var(--input-active-border-color);
  outline: 0;
  box-shadow: var(--input-active-box-shadow);
`,
    ii = l`
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
    ${ti}
  }
  :host .form-control:focus {
    ${ei}
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
    ${Qe}
    z-index: 0;
  }
`,
    si = l`
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
    ${ti}
  }

  :host .form-control:focus {
    ${ei}
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
    ${Qe}
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  :host div.active .transparent-checks {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
`,
    ri = {
      r: "R (red) channel",
      g: "G (green) channel",
      b: "B (blue) channel",
      h: "H (hue) channel",
      s: "S (saturation) channel",
      v: "V (value / brightness) channel",
      l: "L (luminosity) channel",
      a: "A (alpha / opacity) channel"
    };
  class ni extends ct {
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
    static styles = si;
    clickPreview(t) {
      const e = Math.max(0, Math.min(t.offsetX, 128));
      let i = Math.round(e / 128 * this.max);
      "a" === this.channel && (i = Number((e / 127).toFixed(2))), this.valueChange(null, i), this.setActive(!1);
    }
    valueChange = (t, e = null) => {
      e = e ?? Number(this.renderRoot.querySelector("input").value), "a" === this.channel && (e /= 100), this.c[this.channel] = e;
      const i = qe.parse(this.c);
      "rgb" !== this.group && (i.hsx = this.c), this.c = "rgb" === this.group ? this.color.rgbObj : this.isHsl ? this.color.hsl : this.color.hsv, Ze(this.renderRoot, i);
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
        s = "a" === i;
      this.v = t[i], s && (this.v *= 100);
      let r,
        n,
        o = 255;
      if ("rgb" !== e || "a" === i) {
        if ("h" === i) return o = this.max = 359, void (this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${Xe(24, t)})`,
          "--pct": t.h / o * 100 + "%"
        });
        o = s ? 1 : 100;
      }
      if (this.max = o, r = {
        ...t
      }, n = r, r[this.channel] = 0, r = qe.parse(r), n[this.channel] = o, n = qe.parse(n), "l" === this.channel) {
        const e = {
          ...t
        };
        e.l = 50, this.previewGradient = {
          "--preview": `linear-gradient(90deg, ${r.hex}, ${qe.parse(e).hex}, ${n.hex})`,
          "--pct": t[this.channel] / o * 100 + "%"
        };
      } else this.previewGradient = {
        "--preview": `linear-gradient(90deg, ${s ? r.css : r.hex}, ${s ? n.css : n.hex})`,
        "--pct": t[this.channel] / o * 100 + "%"
      };
    }
    willUpdate(t) {
      this.setPreviewGradient();
    }
    render() {
      const t = "a" === this.channel ? V`<div class="transparent-checks"></div>` : null,
        e = "a" === this.channel ? 100 : this.max;
      return V` <div class="${Zt({
        active: this.active
      })}">
      <label for="channel_${this.ch}">${this.channel.toUpperCase()}</label>
      <input
        id="channel_${this.ch}"
        aria-label="${ri[this.channel]}"
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
        style="${Jt(this.previewGradient)}"
        @mousedown="${this.clickPreview}"
      >
        <div class="pct"></div>
        ${t}
      </div>
    </div>`;
    }
  }
  customElements.get("color-input-channel") || customElements.define("color-input-channel", ni);
  class oi extends ct {
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
    static styles = l`
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
      Ze(this.renderRoot, t);
    }
    setCircleCss(t, e) {
      const i = `${t}`,
        s = `${e}`,
        r = {
          x: `0, ${this.size}`,
          y: `0,${this.size}`
        };
      this.circlePos = {
        top: s,
        left: i,
        bounds: r
      };
    }
    pickCoord({
      offsetX: t,
      offsetY: e
    }) {
      const i = t,
        s = e,
        {
          size: r,
          hsw: n,
          isHsl: o,
          color: a
        } = this;
      let l = (r - s) / r;
      l = Math.round(100 * l);
      const c = Math.round(i / r * 100),
        d = {
          h: n.h,
          s: c,
          [o ? "l" : "v"]: l
        },
        h = o ? qe.fromHsl(d) : qe.fromHsv(d);
      this.setCircleCss(i, s), h.a = a.alpha, h.hsx = d, h.fromHSLCanvas = !0, this.setColor(h);
    }
    debouncePaintDetail(t) {
      clearTimeout(this.bouncer), this.bouncer = setTimeout(() => this.paintHSL(t, !0), 50), this.paintHSL(t, !1);
    }
    paintHSL(t, e = null) {
      if (this.debounceMode && null === e) return this.debouncePaintDetail(t);
      const {
        ctx: i,
        color: s,
        isHsl: r,
        size: n
      } = this;
      if (!i) return;
      const o = s;
      (t = t ?? r ? o.hsl : o.hsv).w = r ? t.l : t.v;
      const {
          h: a,
          s: l,
          w: c
        } = t,
        d = this.hsw = {
          h: a,
          s: l,
          w: c
        },
        h = n / 100,
        u = r ? (t, e, i) => `hsl(${t}, ${e}%, ${100 - i}%)` : (t, e, i) => qe.fromHsv({
          h: t,
          s: e,
          v: 100 - i
        }).hex,
        p = !1 === e ? 4 : 1;
      for (let t = 0; t < 100; t += p) for (let e = 0; e < 100; e += p) i.fillStyle = u(a, t, e), i.fillRect(t, e, t + p, e + p);
      this.setCircleCss(d.s * h, n - t.w * h);
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
          bounds: s
        } = this.circlePos;
      return V` <div
      class="outer"
      @click="${this.pickCoord}"
      style="${Jt(t)}"
    >
      <canvas height="100" width="100"></canvas>
      <lit-movable
        boundsX="${s.x}"
        boundsY="${s.y}"
        posTop="${e}"
        posLeft="${i}"
        .onmove="${t => this.circleMove(t)}"
      >
        <div class="circle"></div>
      </lit-movable>
    </div>`;
    }
  }
  customElements.get("hsl-canvas") || customElements.define("hsl-canvas", oi);
  const ai = t => isFinite(t) ? Number(t) : Number(t.replace(/[^0-9.\-]/g, "")),
    li = t => (t = Number(t), (isNaN(t) || [void 0, null].includes(t)) && (t = 0), t);
  class ci {
    constructor(t, e) {
      this.x = li(t), this.y = li(e);
    }
    static fromPointerEvent(t) {
      const {
        pageX: e,
        pageY: i
      } = t;
      return new ci(e, i);
    }
    static fromElementStyle(t) {
      const e = ai(t.style.left ?? 0),
        i = ai(t.style.top ?? 0);
      return new ci(e, i);
    }
    static fromObject({
      x: t,
      y: e
    }) {
      return new ci(t, e);
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
  class di {
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
      if (!t) return new di();
      if ("null" === t) return new di(0, 0);
      const [i, s] = t.split(",").map(t => Number(t.trim()) + e),
        r = new di(i, s);
      return r.attr = t, r;
    }
  }
  class hi extends ct {
    _target;
    _targetSelector = null;
    _boundsX = new di();
    _boundsY = new di();
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
      this._boundsX = di.fromString(t, ai(this.target?.style.left ?? 0)), this.bounds.left = this._boundsX;
    }
    get boundsY() {
      return this._boundsY;
    }
    set boundsY(t) {
      this._boundsY = di.fromString(t, ai(this.target?.style.top ?? 0)), this.bounds.top = this._boundsY;
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
          posTop: s,
          posLeft: r
        } = this,
        {
          offsetLeft: n,
          offsetTop: o,
          style: {
            left: a,
            top: l
          }
        } = this.target;
      i.classList.add("--movable-base"), this.renderRoot.addEventListener("pointerdown", t => this.pointerdown(t)), i.style.position = "absolute", i.style.cursor = "pointer", r ? i.style.left = r + "px" : !a && n && (i.style.left = n + "px", e.left.constrained && (e.left.min = e.left.max = n)), s ? i.style.top = s + "px" : !l && o && (i.style.top = o + "px", e.top.constrained && (e.top.min = e.top.max = o));
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
          bounds: s
        } = this;
      e.mouseCoord = ci.fromPointerEvent(t), e.startCoord = ci.fromElementStyle(i), e.moveDist = new ci(0, 0), e.totalDist = new ci(0, 0), e.clickOffset = (t => {
        const e = ci.fromPointerEvent(t),
          i = t.target.getBoundingClientRect(),
          s = e.x - (i.left + document.body.scrollLeft),
          r = e.y - (i.top + document.body.scrollTop);
        return new ci(s, r);
      })(t), e.coords = ci.fromObject(e.startCoord), e.maxX = isFinite(s.left.min) && isFinite(s.left.max) ? s.left.min + s.left.max : 1 / 0, e.maxY = isFinite(s.top.min) && isFinite(s.top.max) ? s.top.min + s.top.max : 1 / 0, this.isMoving = !0, this.reposition(!0), this.eventBroker("movestart", t);
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
      const s = this[`on${t}`];
      s && s({
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
      const e = ci.fromPointerEvent(t),
        i = this.moveState,
        {
          grid: s,
          bounds: r,
          shiftBehavior: n,
          boundsX: o,
          boundsY: a
        } = this;
      if (i.moveDist = ci.fromObject({
        x: e.x - i.mouseCoord.x,
        y: e.y - i.mouseCoord.y
      }), i.mouseCoord = e, i.totalDist = ci.fromObject({
        x: i.totalDist.x + i.moveDist.x,
        y: i.totalDist.y + i.moveDist.y
      }), i.coords = ci.fromObject({
        x: Math.round(i.totalDist.x / s) * s + i.startCoord.x,
        y: Math.round(i.totalDist.y / s) * s + i.startCoord.y
      }), n && t.shiftKey && o.unconstrained && a.unconstrained) {
        const {
          x: t,
          y: e
        } = i.totalDist;
        Math.abs(t) > Math.abs(e) ? i.coords.top = i.startCoord.y : i.coords.left = i.startCoord.x;
      } else i.coords.y = Math.min(Math.max(r.top.min, i.coords.top), r.top.max), i.coords.x = Math.min(Math.max(r.left.min, i.coords.left), r.left.max);
      isFinite(i.maxX) && (i.pctX = Math.max(r.left.min, i.coords.left) / i.maxX), isFinite(i.maxY) && (i.pctY = Math.max(r.top.min, i.coords.top) / i.maxY), this.reposition(i.coords), this.eventBroker("move", t);
    }
    pointerdown(t) {
      document.body.setPointerCapture(t.pointerId), t.preventDefault(), t.stopPropagation(), void 0 !== t.pointerId && (this.pointerId = t.pointerId), this.listening || (document.body.addEventListener("pointerup", t => {
        this.isMoving && this.unbind(t);
      }, !1), document.body.addEventListener("pointermove", t => {
        void 0 !== this.pointerId && t.pointerId === this.pointerId && this.motionHandler(t);
      }, !1)), this.listening = !0, this.moveInit(t);
    }
    render() {
      return V`<slot></slot>`;
    }
  }
  window.customElements.get("lit-movable") || window.customElements.define("lit-movable", hi);
  class ui extends ct {
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
    static styles = ii;
    _color;
    constructor() {
      super(), this._color = qe.parse(Ge.slateblue), this.isHsl = !0;
    }
    firstUpdated(t) {
      this.debounceMode = !1, t.has("value") && (this.color = qe.parse(this.value));
    }
    get color() {
      return this._color;
    }
    set color(t) {
      (t = t.hsx ? t : t.rgba ? qe.parse(...t.rgba) : qe.parse(t)) && (this.hex = t.hex, this._color = t, Ze(this.renderRoot, t, "colorchanged"));
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
        i = qe.parse(e);
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
        a: s
      } = this.color.hsl;
      1 === s && (s = void 0), this.color = {
        h: t,
        s: e,
        l: i,
        a: s
      };
    }
    setHsl(t) {
      this.isHsl = t;
    }
    okColor() {
      Ze(this.renderRoot, this.color, "colorpicked");
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
        s = {
          backgroundColor: this.color
        },
        r = this.copied ? {
          textAlign: "center",
          display: "block"
        } : {
          display: "none"
        },
        n = this.debounceMode;
      return V` <div class="outer">
      <hue-bar
        @sliding-hue="${this.setSliding}"
        hue="${this.color.hsx ? this.color.hsx.h : this.color.hsl.h}"
        @hue-update="${this.setHue}"
        .color="${this.color}"
      ></hue-bar>
      <div class="d-flex">
        <div class="col w-30">
          ${["r", "g", "b", "a"].map(t => V`
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
              <sub class="copied" style="${Jt(r)}"
                >copied <em>${this.copied}</em></sub
              >
              ${this.copied ? V`` : V`
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
                        ${Ke}
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
                        ${Ke}
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
                        ${Ke}
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
              ${Ke}
              <span>&#11205;</span>
            </a>
          </div>
        </div>
        <div class="col w-30">
          ${t.map(t => V`
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
              class="${Zt(e)}"
              @click="${() => this.setHsl(!1)}"
              >HSV</a
            ><a
              title="Use hue / saturation / luminosity mode"
              class="${Zt(i)}"
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
                <span style="${Jt(s)}"></span>
                <span class="checky"></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>`;
    }
  }
  window.customElements.get("color-picker") || window.customElements.define("color-picker", ui);
  const pi = ["light"],
    mi = ["switch"],
    fi = ["camera"];
  let gi = class extends ct {
    constructor() {
      super(...arguments), this._isActive = !1;
    }
    render() {
      const t = {
        filter: this._isActive ? "brightness(80%)" : "brightness(100%)"
      };
      return V`
      <button
        class="ac-ui-seld-select"
        style=${Jt(t)}
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
      return l`
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
  e([mt()], gi.prototype, "item", void 0), e([ft()], gi.prototype, "_isActive", void 0), gi = e([ke("anycubic-ui-select-dropdown-item")], gi);
  let yi = class extends ct {
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
      return this.availableOptions ? V`
          <button
            class="ac-ui-select-button"
            style=${Jt(t)}
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
            <ha-svg-icon .path=${Bt}></ha-svg-icon>
          </button>
          <div class="ac-ui-select-options" style=${Jt(e)}>
            ${this._renderOptions()}
          </div>
        ` : G;
    }
    _renderOptions() {
      return Ae(Object.keys(this.availableOptions), (t, e) => V`
        <anycubic-ui-select-dropdown-item
          .item=${t}
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
      this._selectedItem = t, $t(this, "ac-select-dropdown", {
        key: t,
        value: this.availableOptions[t]
      }), this._hidden = !0;
    }
    static get styles() {
      return l`
      :host {
        box-sizing: border-box;
        width: 100%;
        position: relative;
        background: var(
          --ha-card-background,
          var(--card-background-color, white)
        );
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
  e([mt()], yi.prototype, "availableOptions", void 0), e([mt()], yi.prototype, "placeholder", void 0), e([mt()], yi.prototype, "initialItem", void 0), e([ft()], yi.prototype, "_selectedItem", void 0), e([ft()], yi.prototype, "_active", void 0), e([ft()], yi.prototype, "_hidden", void 0), yi = e([ke("anycubic-ui-select-dropdown")], yi);
  const vi = {
    keyframeOptions: {
      duration: 250,
      direction: "alternate",
      easing: "ease-in-out"
    },
    properties: ["height", "opacity", "scale"]
  };
  let bi = class extends ct {
    constructor() {
      super(...arguments), this.spoolList = [], this.spool_index = -1, this._isOpen = !1;
    }
    async firstUpdated() {
      window.addEventListener("ac-mcb-modal", t => {
        this._handleModalEvent(t);
      }), window.addEventListener("ac-select-dropdown", t => {
        this._handleDropdownEvent(t);
      }), window.addEventListener("colorchanged", t => {
        this._handleColourEvent(t);
      }), window.addEventListener("colorpicked", t => {
        this._handleColourPickEvent(t);
      }), this.addEventListener("click", t => {
        this._closeModal(t);
      });
    }
    willUpdate(t) {
      super.willUpdate(t);
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
      return V`
      <div
        class="ac-modal-container"
        style=${Jt(t)}
        ${$e(Object.assign({}, vi))}
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
          ${this.color ? this._renderCard() : G}
        </div>
      </div>
    `;
    }
    _renderCard() {
      return this.spool_index >= 0 ? V`
          <div>
            <div class="ac-slot-title">
              Editing Slot: ${this.spool_index + 1}
            </div>
            <div>
              <div>
                <p class="ac-modal-label">Select Material:</p>
                <anycubic-ui-select-dropdown
                  .availableOptions=${Et}
                  .placeholder=${Et.PLA}
                  .initialItem=${this.material_type}
                ></anycubic-ui-select-dropdown>
              </div>
              ${this._renderPresets()}
              <div>
                <p class="ac-modal-label">Manually select colour:</p>
                <color-picker .value="${this.color}"></color-picker>
              </div>
            </div>
            <div class="ac-save-settings">
              <ha-control-button
                @click="${t => {
        this._handleSaveButton();
      }}"
              >
                Save
              </ha-control-button>
            </div>
          </div>
        ` : G;
    }
    _renderPresets() {
      return V`
      <div>
        <p class="ac-modal-label">Choose Preset Colour:</p>
        <div class="ac-mcb-presets">
          ${this.slotColors ? Ae(this.slotColors, (t, e) => V`
                  <div
                    class="ac-mcb-preset-color"
                    style=${Jt({
        "background-color": t
      })}
                    @click="${e => {
        this._colourPresetChange(t);
      }}"
                  >
                    &nbsp;
                  </div>
                `) : G}
        </div>
      </div>
    `;
    }
    _colourPresetChange(t) {
      this.color = t, this._elColorPicker && (this._elColorPicker.color = this.color);
    }
    _handleModalEvent(t) {
      t.stopPropagation(), t.detail.modalOpen && (this._isOpen = !0, this.spool_index = Number(t.detail.spool_index), this.material_type = t.detail.material_type ? Et[t.detail.material_type.toUpperCase()] : void 0, this.color = t.detail.color);
    }
    _handleDropdownEvent(t) {
      t.stopPropagation(), t.detail.value && (this.material_type = Et[t.detail.value]);
    }
    _handleColourEvent(t) {
      t.stopPropagation(), t.detail.color && (this.color = t.detail.color.rgb);
    }
    _handleColourPickEvent(t) {
      this._handleColourEvent(t), this._submitSlotChanges();
    }
    _handleSaveButton() {
      this._submitSlotChanges();
    }
    _submitSlotChanges() {
      if (this.selectedPrinterDevice && this.material_type && this.spool_index >= 0 && this.color && this.color.length >= 3) {
        const t = `multi_color_box_set_slot_${this.material_type.toLowerCase()}`;
        this.hass.callService("anycubic_cloud", t, {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id,
          slot_number: this.spool_index + 1,
          slot_color_red: this.color[0],
          slot_color_green: this.color[1],
          slot_color_blue: this.color[2]
        }), this._closeModal();
      }
    }
    _closeModal(t) {
      t && t.stopPropagation(), this._isOpen = !1, this.spool_index = -1, this.material_type = void 0, this.color = void 0;
    }
    _cardClick(t) {
      t.stopPropagation();
    }
    static get styles() {
      return l`
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
        padding: 20px;
        width: 80%;
        min-height: 150px;
        max-width: 500px;
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

      .ac-slot-title {
        font-size: 24px;
        text-align: center;
        font-weight: 600;
      }

      .ac-modal-label {
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
  e([yt("color-picker")], bi.prototype, "_elColorPicker", void 0), e([mt()], bi.prototype, "hass", void 0), e([mt()], bi.prototype, "selectedPrinterDevice", void 0), e([mt()], bi.prototype, "slotColors", void 0), e([ft()], bi.prototype, "spoolList", void 0), e([ft()], bi.prototype, "spool_index", void 0), e([ft()], bi.prototype, "material_type", void 0), e([ft()], bi.prototype, "color", void 0), e([ft()], bi.prototype, "_isOpen", void 0), bi = e([ke("anycubic-printercard-multicolorbox_modal")], bi);
  const _i = {
      keyframeOptions: {
        duration: 250,
        direction: "normal",
        easing: "ease-in-out"
      },
      properties: ["height", "opacity", "scale"]
    },
    xi = jt();
  let wi = class extends ct {
    constructor() {
      super(...arguments), this.monitoredStats = xi, this.round = !0, this.temperatureUnit = St.C, this._showVideo = !1, this.cameraEntityState = void 0, this.isHidden = !1, this.hiddenOverride = !1, this.hasColorbox = !1, this.lightIsOn = !1, this.statusColor = "#ffc107", this.progressPercent = 0;
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("monitoredStats") && (this.monitoredStats = zt(this.monitoredStats, xi)), t.has("selectedPrinterID") && (this.printerEntities = function (t, e) {
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
        this.progressPercent = this._percentComplete(), this.hasColorbox = "active" === It(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "inactive").state, this.cameraEntityId && (this.cameraEntityState = Pt(this.hass, {
          entity_id: this.cameraEntityId
        })), this.lightIsOn = Ft(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
        const t = It(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state", "unknown").state.toLowerCase();
        this.isHidden = !Ht(t) && !this.hiddenOverride, this.statusColor = function (t) {
          return Ht(t) ? "#4caf50" : "unknown" === t ? "#f44336" : "operational" === t || "finished" === t ? "#00bcd4" : "#ffc107";
        }(t), this.lightIsOn = Ft(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
      }
    }
    render() {
      const t = {
        "ac-hidden": !0 !== this._showVideo
      };
      return V`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this._renderHeader()} ${this._renderPrinterContainer()}
        </div>
        <anycubic-printercard-camera_view
          class="${Zt(t)}"
          .showVideo=${this._showVideo}
          .toggleVideo=${() => this._toggleVideo()}
          .cameraEntity=${this.cameraEntityState}
        ></anycubic-printercard-camera_view>
        <anycubic-printercard-multicolorbox_modal
          .hass=${this.hass}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .slotColors=${this.slotColors}
        ></anycubic-printercard-multicolorbox_modal>
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
      return V`
      <div class="ac-printer-card-header ${Zt(e)}">
        ${this.powerEntityId ? V`
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
            style=${Jt(i)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${null === (t = this.selectedPrinterDevice) || void 0 === t ? void 0 : t.name}
          </p>
        </button>
        ${this.lightEntityId ? V`
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
      return V`
      <div
        class="ac-printer-card-infocontainer ${Zt(t)}"
        style=${Jt(e)}
        ${$e(Object.assign({}, _i))}
      >
        <div
          class="ac-printer-card-info-animcontainer ${Zt(t)}"
        >
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .scaleFactor=${this.scaleFactor}
            .toggleVideo=${() => this._toggleVideo()}
          ></anycubic-printercard-printer_view>
          ${this.vertical ? V`<p class="ac-printer-card-info-vertprog">
                ${this.round ? Math.round(this.progressPercent) : this.progressPercent}%
              </p>` : null}
        </div>
        <div
          class="ac-printer-card-info-statscontainer ${Zt(t)}"
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
      return this.hasColorbox ? V`
          <div
            class="ac-printer-card-infocontainer ${Zt(t)}"
            style=${Jt(e)}
            ${$e(Object.assign({}, _i))}
          >
            <div class="ac-printer-card-mcbsection ${Zt(t)}">
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
      return It(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", -1).state;
    }
    static get styles() {
      return l`
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
        max-height: 270px;
      }

      .ac-printer-card-info-animcontainer.ac-card-vertical {
        width: 100%;
        height: auto;
        padding-left: 64px;
        padding-right: 64px;
        max-height: unset;
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
  e([mt()], wi.prototype, "hass", void 0), e([mt()], wi.prototype, "monitoredStats", void 0), e([mt()], wi.prototype, "selectedPrinterID", void 0), e([mt()], wi.prototype, "selectedPrinterDevice", void 0), e([mt({
    type: Boolean
  })], wi.prototype, "round", void 0), e([mt({
    type: Boolean
  })], wi.prototype, "use_24hr", void 0), e([mt({
    type: String
  })], wi.prototype, "temperatureUnit", void 0), e([mt({
    type: String
  })], wi.prototype, "lightEntityId", void 0), e([mt({
    type: String
  })], wi.prototype, "powerEntityId", void 0), e([mt({
    type: String
  })], wi.prototype, "cameraEntityId", void 0), e([mt({
    type: Boolean
  })], wi.prototype, "vertical", void 0), e([mt()], wi.prototype, "scaleFactor", void 0), e([mt()], wi.prototype, "slotColors", void 0), e([ft()], wi.prototype, "_showVideo", void 0), e([ft()], wi.prototype, "cameraEntityState", void 0), e([ft({
    type: Boolean
  })], wi.prototype, "isHidden", void 0), e([ft({
    type: Boolean
  })], wi.prototype, "hiddenOverride", void 0), e([ft({
    type: Boolean
  })], wi.prototype, "hasColorbox", void 0), e([ft({
    type: Boolean
  })], wi.prototype, "lightIsOn", void 0), e([ft({
    type: String
  })], wi.prototype, "statusColor", void 0), e([ft()], wi.prototype, "printerEntities", void 0), e([ft()], wi.prototype, "printerEntityIdPart", void 0), e([ft()], wi.prototype, "progressPercent", void 0), wi = e([ke("anycubic-printercard-card")], wi);
  let $i = class extends ct {
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
      return V`
      <button
        class="ac-ui-msr-select"
        @click="${t => {
        this.toggle(this.item);
      }}"
      >
        ${this._isActive ? V`<ha-svg-icon .path=${"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}></ha-svg-icon>` : G}
      </button>
      <p class="ac-ui-msr-itemtext ${Zt(t)}">
        ${this.item}
      </p>
      <div>
        <button
          class="ac-ui-msr-position"
          @click="${t => {
        this.reorder(this.item, 1);
      }}"
        >
          <ha-svg-icon .path=${Bt}></ha-svg-icon>
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
      return l`
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
  e([mt()], $i.prototype, "item", void 0), e([mt()], $i.prototype, "selectedItems", void 0), e([mt()], $i.prototype, "unusedItems", void 0), e([mt()], $i.prototype, "reorder", void 0), e([mt()], $i.prototype, "toggle", void 0), e([ft()], $i.prototype, "_isActive", void 0), $i = e([ke("anycubic-ui-multi-select-reorder-item")], $i);
  let ki = class extends ct {
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
      return this._allOptions ? V`
          <div style=${Jt(t)}>
            ${Ae(this._allOptions, (t, e) => V`
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
      return l`
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
  e([mt()], ki.prototype, "availableOptions", void 0), e([mt()], ki.prototype, "initialItems", void 0), e([mt()], ki.prototype, "onChange", void 0), e([ft()], ki.prototype, "_allOptions", void 0), e([ft()], ki.prototype, "_selectedItems", void 0), e([ft()], ki.prototype, "_unusedItems", void 0), ki = e([ke("anycubic-ui-multi-select-reorder")], ki);
  let Si = class extends ct {
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
          case "scaleFactor":
            return "Scale Factor";
          case "slotColors":
            return "Slot Colour Presets";
        }
      };
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("printers") && (this.formSchema = this._computeSchema());
    }
    render() {
      return V`
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
            .availableOptions=${Ct}
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
      $t(this, "config-changed", {
        config: t
      });
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
              value: St.C,
              label: `°${St.C}`
            }, {
              value: St.F,
              label: `°${St.F}`
            }],
            mode: "list",
            multiple: !1
          }
        }
      }, {
        name: "lightEntityId",
        selector: {
          entity: {
            domain: pi
          }
        }
      }, {
        name: "powerEntityId",
        selector: {
          entity: {
            domain: mi
          }
        }
      }, {
        name: "cameraEntityId",
        selector: {
          entity: {
            domain: fi
          }
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
        name: "slotColors",
        description: "Slot Colour Presets",
        selector: {
          text: {
            multiple: !0
          }
        }
      }] : [];
    }
    static get styles() {
      return l`
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
  e([mt()], Si.prototype, "hass", void 0), e([mt()], Si.prototype, "cardConfig", void 0), e([mt()], Si.prototype, "printers", void 0), e([ft()], Si.prototype, "selectedPrinterDevice", void 0), e([ft()], Si.prototype, "formSchema", void 0), Si = e([ht("anycubic-printercard-configure")], Si);
  const Ai = {
    vertical: !1,
    round: !1,
    use_24hr: !0,
    temperatureUnit: St.C,
    monitoredStats: jt(),
    scaleFactor: 1,
    slotColors: []
  };
  t.AnycubicPrintercardEditor = class extends ct {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Yt(this.hass);
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("config") && (this.config.vertical = zt(this.config.vertical, Ai.vertical), this.config.round = zt(this.config.round, Ai.round), this.config.use_24hr = zt(this.config.use_24hr, Ai.use_24hr), this.config.temperatureUnit = zt(this.config.temperatureUnit, Ai.temperatureUnit), this.config.monitoredStats = zt(this.config.monitoredStats, Ai.monitoredStats), this.config.slotColors = zt(this.config.slotColors, Ai.slotColors));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return V`
      <anycubic-printercard-configure
        .hass=${this.hass}
        .printers=${this.printers}
        .cardConfig=${this.config}
      ></anycubic-printercard-configure>
    `;
    }
  }, e([mt()], t.AnycubicPrintercardEditor.prototype, "hass", void 0), e([mt()], t.AnycubicPrintercardEditor.prototype, "config", void 0), e([ft()], t.AnycubicPrintercardEditor.prototype, "printers", void 0), t.AnycubicPrintercardEditor = e([ht("anycubic-card-editor")], t.AnycubicPrintercardEditor), t.AnycubicCard = class extends ct {
    constructor() {
      super(...arguments), this.config = {};
    }
    async firstUpdated() {
      this.printers = await Yt(this.hass), this.requestUpdate();
    }
    willUpdate(t) {
      var e, i;
      super.willUpdate(t), (t.has("config") || t.has("printers")) && (this.vertical = zt(this.config.vertical, Ai.vertical), this.round = zt(this.config.round, Ai.round), this.use_24hr = zt(this.config.use_24hr, Ai.use_24hr), this.temperatureUnit = zt(this.config.temperatureUnit, Ai.temperatureUnit), this.lightEntityId = this.config.lightEntityId, this.powerEntityId = this.config.powerEntityId, this.cameraEntityId = this.config.cameraEntityId, this.scaleFactor = this.config.scaleFactor, this.slotColors = this.config.slotColors, this.monitoredStats = this.config.monitoredStats, this.config.printer_id && this.printers && (this.selectedPrinterID = this.config.printer_id, this.selectedPrinterDevice = (e = this.printers, i = this.config.printer_id, e && i ? e[i] : void 0)));
    }
    setConfig(t) {
      this.config = t;
    }
    render() {
      return V`
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
  }, e([mt()], t.AnycubicCard.prototype, "hass", void 0), e([mt()], t.AnycubicCard.prototype, "config", void 0), e([ft()], t.AnycubicCard.prototype, "printers", void 0), e([ft()], t.AnycubicCard.prototype, "selectedPrinterID", void 0), e([ft()], t.AnycubicCard.prototype, "selectedPrinterDevice", void 0), e([ft({
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
  })], t.AnycubicCard.prototype, "cameraEntityId", void 0), e([ft({
    type: Number
  })], t.AnycubicCard.prototype, "scaleFactor", void 0), e([ft()], t.AnycubicCard.prototype, "slotColors", void 0), e([ft()], t.AnycubicCard.prototype, "monitoredStats", void 0), t.AnycubicCard = e([ht("anycubic-card")], t.AnycubicCard), window.customCards = window.customCards || [], window.customCards.push({
    type: "anycubic-card",
    name: "Anycubic Card",
    preview: !0,
    description: "Anycubic Cloud Integration Card"
  }), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
