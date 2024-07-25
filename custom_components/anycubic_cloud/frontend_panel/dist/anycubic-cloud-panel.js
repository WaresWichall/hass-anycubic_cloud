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
      for (var e, i = 1, r = arguments.length; i < r; i++) for (var n in e = arguments[i]) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      return t;
    }, r.apply(this, arguments);
  };
  function n(t, e, i, r) {
    var n,
      s = arguments.length,
      o = s < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, i, r);else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (o = (s < 3 ? n(o) : s > 3 ? n(e, i, o) : n(e, i)) || o);
    return s > 3 && o && Object.defineProperty(e, i, o), o;
  }
  function s(t, e, i) {
    if (i || 2 === arguments.length) for (var r, n = 0, s = e.length; n < s; n++) !r && n in e || (r || (r = Array.prototype.slice.call(e, 0, n)), r[n] = e[n]);
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
    h = Symbol(),
    l = new WeakMap();
  class c {
    constructor(t, e, i) {
      if (this._$cssResult$ = !0, i !== h) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t, this.t = e;
    }
    get styleSheet() {
      let t = this.o;
      const e = this.t;
      if (a && void 0 === t) {
        const i = void 0 !== e && 1 === e.length;
        i && (t = l.get(e)), void 0 === t && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && l.set(e, t));
      }
      return t;
    }
    toString() {
      return this.cssText;
    }
  }
  const u = (t, ...e) => {
      const i = 1 === t.length ? t[0] : e.reduce((e, i, r) => e + (t => {
        if (!0 === t._$cssResult$) return t.cssText;
        if ("number" == typeof t) return t;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(i) + t[r + 1], t[0]);
      return new c(i, t, h);
    },
    p = a ? t => t : t => t instanceof CSSStyleSheet ? (t => {
      let e = "";
      for (const i of t.cssRules) e += i.cssText;
      return (t => new c("string" == typeof t ? t : t + "", void 0, h))(e);
    })(t) : t
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
      getOwnPropertySymbols: m,
      getPrototypeOf: v
    } = Object,
    b = globalThis,
    y = b.trustedTypes,
    E = y ? y.emptyScript : "",
    A = b.reactiveElementPolyfillSupport,
    w = (t, e) => t,
    H = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? E : null;
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
    T = (t, e) => !d(t, e),
    $ = {
      attribute: !0,
      type: String,
      converter: H,
      reflect: !1,
      hasChanged: T
    };
  Symbol.metadata ??= Symbol("metadata"), b.litPropertyMetadata ??= new WeakMap();
  class S extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = $) {
      if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
        const i = Symbol(),
          r = this.getPropertyDescriptor(t, i, e);
        void 0 !== r && f(this.prototype, t, r);
      }
    }
    static getPropertyDescriptor(t, e, i) {
      const {
        get: r,
        set: n
      } = _(this.prototype, t) ?? {
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
          const s = r?.call(this);
          n.call(this, e), this.requestUpdate(t, s, i);
        },
        configurable: !0,
        enumerable: !0
      };
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? $;
    }
    static _$Ei() {
      if (this.hasOwnProperty(w("elementProperties"))) return;
      const t = v(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(w("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) {
        const t = this.properties,
          e = [...g(t), ...m(t)];
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
        const n = (void 0 !== i.converter?.toAttribute ? i.converter : H).toAttribute(e, i.type);
        this._$Em = t, null == n ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
      }
    }
    _$AK(t, e) {
      const i = this.constructor,
        r = i._$Eh.get(t);
      if (void 0 !== r && this._$Em !== r) {
        const t = i.getPropertyOptions(r),
          n = "function" == typeof t.converter ? {
            fromAttribute: t.converter
          } : void 0 !== t.converter?.fromAttribute ? t.converter : H;
        this._$Em = r, this[r] = n.fromAttribute(e, t.type), this._$Em = null;
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? T)(this[t], e)) return;
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
  }, S[w("elementProperties")] = new Map(), S[w("finalized")] = new Map(), A?.({
    ReactiveElement: S
  }), (b.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const P = globalThis,
    B = P.trustedTypes,
    C = B ? B.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    N = "$lit$",
    L = `lit$${Math.random().toFixed(9).slice(2)}$`,
    O = "?" + L,
    I = `<${O}>`,
    R = document,
    U = () => R.createComment(""),
    M = t => null === t || "object" != typeof t && "function" != typeof t,
    x = Array.isArray,
    D = "[ \t\n\f\r]",
    k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    G = /-->/g,
    F = />/g,
    j = RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    V = /'/g,
    z = /"/g,
    X = /^(?:script|style|textarea|title)$/i,
    K = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    W = Symbol.for("lit-noChange"),
    Y = Symbol.for("lit-nothing"),
    Z = new WeakMap(),
    q = R.createTreeWalker(R, 129);
  function J(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== C ? C.createHTML(e) : e;
  }
  const Q = (t, e) => {
    const i = t.length - 1,
      r = [];
    let n,
      s = 2 === e ? "<svg>" : "",
      o = k;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        h,
        l = -1,
        c = 0;
      for (; c < i.length && (o.lastIndex = c, h = o.exec(i), null !== h);) c = o.lastIndex, o === k ? "!--" === h[1] ? o = G : void 0 !== h[1] ? o = F : void 0 !== h[2] ? (X.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = j) : void 0 !== h[3] && (o = j) : o === j ? ">" === h[0] ? (o = n ?? k, l = -1) : void 0 === h[1] ? l = -2 : (l = o.lastIndex - h[2].length, a = h[1], o = void 0 === h[3] ? j : '"' === h[3] ? z : V) : o === z || o === V ? o = j : o === G || o === F ? o = k : (o = j, n = void 0);
      const u = o === j && t[e + 1].startsWith("/>") ? " " : "";
      s += o === k ? i + I : l >= 0 ? (r.push(a), i.slice(0, l) + N + i.slice(l) + L + u) : i + L + (-2 === l ? e : u);
    }
    return [J(t, s + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), r];
  };
  class tt {
    constructor({
      strings: t,
      _$litType$: e
    }, i) {
      let r;
      this.parts = [];
      let n = 0,
        s = 0;
      const o = t.length - 1,
        a = this.parts,
        [h, l] = Q(t, e);
      if (this.el = tt.createElement(h, i), q.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (r = q.nextNode()) && a.length < o;) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(N)) {
            const e = l[s++],
              i = r.getAttribute(t).split(L),
              o = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: n,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? st : "?" === o[1] ? ot : "@" === o[1] ? at : nt
            }), r.removeAttribute(t);
          } else t.startsWith(L) && (a.push({
            type: 6,
            index: n
          }), r.removeAttribute(t));
          if (X.test(r.tagName)) {
            const t = r.textContent.split(L),
              e = t.length - 1;
            if (e > 0) {
              r.textContent = B ? B.emptyScript : "";
              for (let i = 0; i < e; i++) r.append(t[i], U()), q.nextNode(), a.push({
                type: 2,
                index: ++n
              });
              r.append(t[e], U());
            }
          }
        } else if (8 === r.nodeType) if (r.data === O) a.push({
          type: 2,
          index: n
        });else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(L, t + 1));) a.push({
            type: 7,
            index: n
          }), t += L.length - 1;
        }
        n++;
      }
    }
    static createElement(t, e) {
      const i = R.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function et(t, e, i = t, r) {
    if (e === W) return e;
    let n = void 0 !== r ? i._$Co?.[r] : i._$Cl;
    const s = M(e) ? void 0 : e._$litDirective$;
    return n?.constructor !== s && (n?._$AO?.(!1), void 0 === s ? n = void 0 : (n = new s(t), n._$AT(t, i, r)), void 0 !== r ? (i._$Co ??= [])[r] = n : i._$Cl = n), void 0 !== n && (e = et(t, n._$AS(t, e.values), n, r)), e;
  }
  class it {
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
        r = (t?.creationScope ?? R).importNode(e, !0);
      q.currentNode = r;
      let n = q.nextNode(),
        s = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (s === a.index) {
          let e;
          2 === a.type ? e = new rt(n, n.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(n, a.name, a.strings, this, t) : 6 === a.type && (e = new ht(n, this, t)), this._$AV.push(e), a = i[++o];
        }
        s !== a?.index && (n = q.nextNode(), s++);
      }
      return q.currentNode = R, r;
    }
    p(t) {
      let e = 0;
      for (const i of this._$AV) void 0 !== i && (void 0 !== i.strings ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
    }
  }
  class rt {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, e, i, r) {
      this.type = 2, this._$AH = Y, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
      t = et(this, t, e), M(t) ? t === Y || null == t || "" === t ? (this._$AH !== Y && this._$AR(), this._$AH = Y) : t !== this._$AH && t !== W && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : (t => x(t) || "function" == typeof t?.[Symbol.iterator])(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== Y && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(R.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        r = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = tt.createElement(J(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === r) this._$AH.p(e);else {
        const t = new it(r, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = Z.get(t.strings);
      return void 0 === e && Z.set(t.strings, e = new tt(t)), e;
    }
    k(t) {
      x(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        r = 0;
      for (const n of t) r === e.length ? e.push(i = new rt(this.S(U()), this.S(U()), this, this.options)) : i = e[r], i._$AI(n), r++;
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
  class nt {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, i, r, n) {
      this.type = 1, this._$AH = Y, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = Y;
    }
    _$AI(t, e = this, i, r) {
      const n = this.strings;
      let s = !1;
      if (void 0 === n) t = et(this, t, e, 0), s = !M(t) || t !== this._$AH && t !== W, s && (this._$AH = t);else {
        const r = t;
        let o, a;
        for (t = n[0], o = 0; o < n.length - 1; o++) a = et(this, r[i + o], e, o), a === W && (a = this._$AH[o]), s ||= !M(a) || a !== this._$AH[o], a === Y ? t = Y : t !== Y && (t += (a ?? "") + n[o + 1]), this._$AH[o] = a;
      }
      s && !r && this.j(t);
    }
    j(t) {
      t === Y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class st extends nt {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === Y ? void 0 : t;
    }
  }
  class ot extends nt {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== Y);
    }
  }
  class at extends nt {
    constructor(t, e, i, r, n) {
      super(t, e, i, r, n), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = et(this, t, e, 0) ?? Y) === W) return;
      const i = this._$AH,
        r = t === Y && i !== Y || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        n = t !== Y && (i === Y || r);
      r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class ht {
    constructor(t, e, i) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      et(this, t);
    }
  }
  const lt = P.litHtmlPolyfillSupport;
  lt?.(tt, rt), (P.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class ct extends S {
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
        let n = r._$litPart$;
        if (void 0 === n) {
          const t = i?.renderBefore ?? null;
          r._$litPart$ = n = new rt(e.insertBefore(U(), t), t, void 0, i ?? {});
        }
        return n._$AI(t), n;
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
  const ut = globalThis.litElementPolyfillSupport;
  ut?.({
    LitElement: ct
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const pt = t => (e, i) => {
      void 0 !== i ? i.addInitializer(() => {
        customElements.define(t, e);
      }) : customElements.define(t, e);
    }
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    dt = {
      attribute: !0,
      type: String,
      converter: H,
      reflect: !1,
      hasChanged: T
    },
    ft = (t = dt, e, i) => {
      const {
        kind: r,
        metadata: n
      } = i;
      let s = globalThis.litPropertyMetadata.get(n);
      if (void 0 === s && globalThis.litPropertyMetadata.set(n, s = new Map()), s.set(i.name, t), "accessor" === r) {
        const {
          name: r
        } = i;
        return {
          set(i) {
            const n = e.get.call(this);
            e.set.call(this, i), this.requestUpdate(r, n, t);
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
          const n = this[r];
          e.call(this, i), this.requestUpdate(r, n, t);
        };
      }
      throw Error("Unsupported decorator location: " + r);
    };
  function _t(t) {
    return (e, i) => "object" == typeof i ? ft(t, e, i) : ((t, e, i) => {
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
  function gt(t) {
    return _t({
      ...t,
      state: !0,
      attribute: !1
    });
  }
  const mt = (t, e, i, r) => {
    r = r || {}, i = i ?? {};
    const n = new Event(e, {
      bubbles: void 0 === r.bubbles || r.bubbles,
      cancelable: Boolean(r.cancelable),
      composed: void 0 === r.composed || r.composed
    });
    return n.detail = i, t.dispatchEvent(n), n;
  };
  function vt(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function bt(t, e) {
    const i = vt(t, e),
      r = i ? parseFloat(i.state) : 0;
    return isNaN(r) ? 0 : r;
  }
  function yt(t, e) {
    const i = vt(t, e);
    return i ? String(i.state) : "";
  }
  function Et(t, e, i, r) {
    return "on" == yt(t, e) ? i : r;
  }
  function At(t, e) {
    const i = {};
    for (const r in t.entities) {
      const n = t.entities[r];
      n.device_id === e && (i[n.entity_id] = n);
    }
    return i;
  }
  function wt(t, e, i) {
    for (const r in t) {
      const n = t[r],
        s = r.split("."),
        o = s[0],
        a = s[1];
      if (o === e && a.endsWith(i)) return n;
    }
  }
  function Ht(t, e, i, r) {
    for (const n in t) {
      const s = t[n],
        o = n.split("."),
        a = o[0],
        h = o[1].split(e)[1];
      if (a === i && h === r) return s;
    }
  }
  function Tt(t) {
    const e = t.path.split("/");
    return e.length > 1 ? e[1] : void 0;
  }
  function $t(t, e) {
    return t && e ? t[e] : void 0;
  }
  function St(t) {
    const e = t.path.split("/");
    return e.length > 2 ? e[2] : "main";
  }
  let Pt = class extends ct {
    render() {
      const t = Tt(this.route),
        e = $t(this.printers, t),
        i = At(this.hass, t);
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
        <pre>${JSON.stringify(i, void 0, 2)}</pre>
        Selected Printer
        <pre>${JSON.stringify(e, void 0, 2)}</pre>
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
  n([_t()], Pt.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], Pt.prototype, "narrow", void 0), n([_t()], Pt.prototype, "route", void 0), n([_t()], Pt.prototype, "panel", void 0), n([_t()], Pt.prototype, "printers", void 0), Pt = n([pt("anycubic-view-debug")], Pt);
  var Bt,
    Ct,
    Nt,
    Lt = "Anycubic Cloud",
    Ot = {
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
    It = {
      title: Lt,
      panels: Ot
    },
    Rt = Object.freeze({
      __proto__: null,
      title: Lt,
      panels: Ot,
      default: It
    });
  function Ut(t) {
    return t.type === Ct.literal;
  }
  function Mt(t) {
    return t.type === Ct.argument;
  }
  function xt(t) {
    return t.type === Ct.number;
  }
  function Dt(t) {
    return t.type === Ct.date;
  }
  function kt(t) {
    return t.type === Ct.time;
  }
  function Gt(t) {
    return t.type === Ct.select;
  }
  function Ft(t) {
    return t.type === Ct.plural;
  }
  function jt(t) {
    return t.type === Ct.pound;
  }
  function Vt(t) {
    return t.type === Ct.tag;
  }
  function zt(t) {
    return !(!t || "object" != typeof t || t.type !== Nt.number);
  }
  function Xt(t) {
    return !(!t || "object" != typeof t || t.type !== Nt.dateTime);
  }
  !function (t) {
    t[t.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", t[t.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", t[t.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", t[t.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", t[t.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", t[t.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", t[t.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", t[t.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", t[t.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", t[t.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", t[t.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", t[t.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", t[t.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", t[t.INVALID_TAG = 23] = "INVALID_TAG", t[t.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", t[t.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", t[t.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
  }(Bt || (Bt = {})), function (t) {
    t[t.literal = 0] = "literal", t[t.argument = 1] = "argument", t[t.number = 2] = "number", t[t.date = 3] = "date", t[t.time = 4] = "time", t[t.select = 5] = "select", t[t.plural = 6] = "plural", t[t.pound = 7] = "pound", t[t.tag = 8] = "tag";
  }(Ct || (Ct = {})), function (t) {
    t[t.number = 0] = "number", t[t.dateTime = 1] = "dateTime";
  }(Nt || (Nt = {}));
  var Kt = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    Wt = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function Yt(t) {
    var e = {};
    return t.replace(Wt, function (t) {
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
  var Zt = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
  var qt = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    Jt = /^(@+)?(\+|#+)?[rs]?$/g,
    Qt = /(\*)(0+)|(#+)(0+)|(0+)/g,
    te = /^(0+)$/;
  function ee(t) {
    var e = {};
    return "r" === t[t.length - 1] ? e.roundingPriority = "morePrecision" : "s" === t[t.length - 1] && (e.roundingPriority = "lessPrecision"), t.replace(Jt, function (t, i, r) {
      return "string" != typeof r ? (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length) : "+" === r ? e.minimumSignificantDigits = i.length : "#" === i[0] ? e.maximumSignificantDigits = i.length : (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length + ("string" == typeof r ? r.length : 0)), "";
    }), e;
  }
  function ie(t) {
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
  function re(t) {
    var e;
    if ("E" === t[0] && "E" === t[1] ? (e = {
      notation: "engineering"
    }, t = t.slice(2)) : "E" === t[0] && (e = {
      notation: "scientific"
    }, t = t.slice(1)), e) {
      var i = t.slice(0, 2);
      if ("+!" === i ? (e.signDisplay = "always", t = t.slice(2)) : "+?" === i && (e.signDisplay = "exceptZero", t = t.slice(2)), !te.test(t)) throw new Error("Malformed concise eng/scientific notation");
      e.minimumIntegerDigits = t.length;
    }
    return e;
  }
  function ne(t) {
    var e = ie(t);
    return e || {};
  }
  function se(t) {
    for (var e = {}, i = 0, n = t; i < n.length; i++) {
      var s = n[i];
      switch (s.stem) {
        case "percent":
        case "%":
          e.style = "percent";
          continue;
        case "%x100":
          e.style = "percent", e.scale = 100;
          continue;
        case "currency":
          e.style = "currency", e.currency = s.options[0];
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
          e.style = "unit", e.unit = s.options[0].replace(/^(.*?)-/, "");
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
          }), s.options.reduce(function (t, e) {
            return r(r({}, t), ne(e));
          }, {}));
          continue;
        case "engineering":
          e = r(r(r({}, e), {
            notation: "engineering"
          }), s.options.reduce(function (t, e) {
            return r(r({}, t), ne(e));
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
          e.scale = parseFloat(s.options[0]);
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
          if (s.options.length > 1) throw new RangeError("integer-width stems only accept a single optional option");
          s.options[0].replace(Qt, function (t, i, r, n, s, o) {
            if (i) e.minimumIntegerDigits = r.length;else {
              if (n && s) throw new Error("We currently do not support maximum integer digits");
              if (o) throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (te.test(s.stem)) e.minimumIntegerDigits = s.stem.length;else if (qt.test(s.stem)) {
        if (s.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
        s.stem.replace(qt, function (t, i, r, n, s, o) {
          return "*" === r ? e.minimumFractionDigits = i.length : n && "#" === n[0] ? e.maximumFractionDigits = n.length : s && o ? (e.minimumFractionDigits = s.length, e.maximumFractionDigits = s.length + o.length) : (e.minimumFractionDigits = i.length, e.maximumFractionDigits = i.length), "";
        });
        var o = s.options[0];
        "w" === o ? e = r(r({}, e), {
          trailingZeroDisplay: "stripIfInteger"
        }) : o && (e = r(r({}, e), ee(o)));
      } else if (Jt.test(s.stem)) e = r(r({}, e), ee(s.stem));else {
        var a = ie(s.stem);
        a && (e = r(r({}, e), a));
        var h = re(s.stem);
        h && (e = r(r({}, e), h));
      }
    }
    return e;
  }
  var oe,
    ae = {
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
  function he(t) {
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
    return "root" !== r && (i = t.maximize().region), (ae[i || ""] || ae[r || ""] || ae["".concat(r, "-001")] || ae["001"])[0];
  }
  var le = new RegExp("^".concat(Kt.source, "*")),
    ce = new RegExp("".concat(Kt.source, "*$"));
  function ue(t, e) {
    return {
      start: t,
      end: e
    };
  }
  var pe = !!String.prototype.startsWith && "_a".startsWith("a", 1),
    de = !!String.fromCodePoint,
    fe = !!Object.fromEntries,
    _e = !!String.prototype.codePointAt,
    ge = !!String.prototype.trimStart,
    me = !!String.prototype.trimEnd,
    ve = !!Number.isSafeInteger ? Number.isSafeInteger : function (t) {
      return "number" == typeof t && isFinite(t) && Math.floor(t) === t && Math.abs(t) <= 9007199254740991;
    },
    be = !0;
  try {
    be = "a" === (null === (oe = Se("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) || void 0 === oe ? void 0 : oe[0]);
  } catch (F) {
    be = !1;
  }
  var ye,
    Ee = pe ? function (t, e, i) {
      return t.startsWith(e, i);
    } : function (t, e, i) {
      return t.slice(i, i + e.length) === e;
    },
    Ae = de ? String.fromCodePoint : function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      for (var i, r = "", n = t.length, s = 0; n > s;) {
        if ((i = t[s++]) > 1114111) throw RangeError(i + " is not a valid code point");
        r += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(55296 + ((i -= 65536) >> 10), i % 1024 + 56320);
      }
      return r;
    },
    we = fe ? Object.fromEntries : function (t) {
      for (var e = {}, i = 0, r = t; i < r.length; i++) {
        var n = r[i],
          s = n[0],
          o = n[1];
        e[s] = o;
      }
      return e;
    },
    He = _e ? function (t, e) {
      return t.codePointAt(e);
    } : function (t, e) {
      var i = t.length;
      if (!(e < 0 || e >= i)) {
        var r,
          n = t.charCodeAt(e);
        return n < 55296 || n > 56319 || e + 1 === i || (r = t.charCodeAt(e + 1)) < 56320 || r > 57343 ? n : r - 56320 + (n - 55296 << 10) + 65536;
      }
    },
    Te = ge ? function (t) {
      return t.trimStart();
    } : function (t) {
      return t.replace(le, "");
    },
    $e = me ? function (t) {
      return t.trimEnd();
    } : function (t) {
      return t.replace(ce, "");
    };
  function Se(t, e) {
    return new RegExp(t, e);
  }
  if (be) {
    var Pe = Se("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    ye = function (t, e) {
      var i;
      return Pe.lastIndex = e, null !== (i = Pe.exec(t)[1]) && void 0 !== i ? i : "";
    };
  } else ye = function (t, e) {
    for (var i = [];;) {
      var r = He(t, e);
      if (void 0 === r || Le(r) || Oe(r)) break;
      i.push(r), e += r >= 65536 ? 2 : 1;
    }
    return Ae.apply(void 0, i);
  };
  var Be = function () {
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
        var n = this.char();
        if (123 === n) {
          if ((s = this.parseArgument(t, i)).err) return s;
          r.push(s.val);
        } else {
          if (125 === n && t > 0) break;
          if (35 !== n || "plural" !== e && "selectordinal" !== e) {
            if (60 === n && !this.ignoreTag && 47 === this.peek()) {
              if (i) break;
              return this.error(Bt.UNMATCHED_CLOSING_TAG, ue(this.clonePosition(), this.clonePosition()));
            }
            if (60 === n && !this.ignoreTag && Ce(this.peek() || 0)) {
              if ((s = this.parseTag(t, e)).err) return s;
              r.push(s.val);
            } else {
              var s;
              if ((s = this.parseLiteral(t, e)).err) return s;
              r.push(s.val);
            }
          } else {
            var o = this.clonePosition();
            this.bump(), r.push({
              type: Ct.pound,
              location: ue(o, this.clonePosition())
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
          type: Ct.literal,
          value: "<".concat(r, "/>"),
          location: ue(i, this.clonePosition())
        },
        err: null
      };
      if (this.bumpIf(">")) {
        var n = this.parseMessage(t + 1, e, !0);
        if (n.err) return n;
        var s = n.val,
          o = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Ce(this.char())) return this.error(Bt.INVALID_TAG, ue(o, this.clonePosition()));
          var a = this.clonePosition();
          return r !== this.parseTagName() ? this.error(Bt.UNMATCHED_CLOSING_TAG, ue(a, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: Ct.tag,
              value: r,
              children: s,
              location: ue(i, this.clonePosition())
            },
            err: null
          } : this.error(Bt.INVALID_TAG, ue(o, this.clonePosition())));
        }
        return this.error(Bt.UNCLOSED_TAG, ue(i, this.clonePosition()));
      }
      return this.error(Bt.INVALID_TAG, ue(i, this.clonePosition()));
    }, t.prototype.parseTagName = function () {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && Ne(this.char());) this.bump();
      return this.message.slice(t, this.offset());
    }, t.prototype.parseLiteral = function (t, e) {
      for (var i = this.clonePosition(), r = "";;) {
        var n = this.tryParseQuote(e);
        if (n) r += n;else {
          var s = this.tryParseUnquoted(t, e);
          if (s) r += s;else {
            var o = this.tryParseLeftAngleBracket();
            if (!o) break;
            r += o;
          }
        }
      }
      var a = ue(i, this.clonePosition());
      return {
        val: {
          type: Ct.literal,
          value: r,
          location: a
        },
        err: null
      };
    }, t.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() || 60 !== this.char() || !this.ignoreTag && (Ce(t = this.peek() || 0) || 47 === t) ? null : (this.bump(), "<");
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
      return Ae.apply(void 0, e);
    }, t.prototype.tryParseUnquoted = function (t, e) {
      if (this.isEOF()) return null;
      var i = this.char();
      return 60 === i || 123 === i || 35 === i && ("plural" === e || "selectordinal" === e) || 125 === i && t > 0 ? null : (this.bump(), Ae(i));
    }, t.prototype.parseArgument = function (t, e) {
      var i = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(Bt.EXPECT_ARGUMENT_CLOSING_BRACE, ue(i, this.clonePosition()));
      if (125 === this.char()) return this.bump(), this.error(Bt.EMPTY_ARGUMENT, ue(i, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r) return this.error(Bt.MALFORMED_ARGUMENT, ue(i, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF()) return this.error(Bt.EXPECT_ARGUMENT_CLOSING_BRACE, ue(i, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: Ct.argument,
              value: r,
              location: ue(i, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(Bt.EXPECT_ARGUMENT_CLOSING_BRACE, ue(i, this.clonePosition())) : this.parseArgumentOptions(t, e, r, i);
        default:
          return this.error(Bt.MALFORMED_ARGUMENT, ue(i, this.clonePosition()));
      }
    }, t.prototype.parseIdentifierIfPossible = function () {
      var t = this.clonePosition(),
        e = this.offset(),
        i = ye(this.message, e),
        r = e + i.length;
      return this.bumpTo(r), {
        value: i,
        location: ue(t, this.clonePosition())
      };
    }, t.prototype.parseArgumentOptions = function (t, e, i, n) {
      var s,
        o = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        h = this.clonePosition();
      switch (a) {
        case "":
          return this.error(Bt.EXPECT_ARGUMENT_TYPE, ue(o, h));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var l = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var c = this.clonePosition();
            if ((v = this.parseSimpleArgStyleIfPossible()).err) return v;
            if (0 === (f = $e(v.val)).length) return this.error(Bt.EXPECT_ARGUMENT_STYLE, ue(this.clonePosition(), this.clonePosition()));
            l = {
              style: f,
              styleLocation: ue(c, this.clonePosition())
            };
          }
          if ((b = this.tryParseArgumentClose(n)).err) return b;
          var u = ue(n, this.clonePosition());
          if (l && Ee(null == l ? void 0 : l.style, "::", 0)) {
            var p = Te(l.style.slice(2));
            if ("number" === a) return (v = this.parseNumberSkeletonFromString(p, l.styleLocation)).err ? v : {
              val: {
                type: Ct.number,
                value: i,
                location: u,
                style: v.val
              },
              err: null
            };
            if (0 === p.length) return this.error(Bt.EXPECT_DATE_TIME_SKELETON, u);
            var d = p;
            this.locale && (d = function (t, e) {
              for (var i = "", r = 0; r < t.length; r++) {
                var n = t.charAt(r);
                if ("j" === n) {
                  for (var s = 0; r + 1 < t.length && t.charAt(r + 1) === n;) s++, r++;
                  var o = 1 + (1 & s),
                    a = s < 2 ? 1 : 3 + (s >> 1),
                    h = he(e);
                  for ("H" != h && "k" != h || (a = 0); a-- > 0;) i += "a";
                  for (; o-- > 0;) i = h + i;
                } else i += "J" === n ? "H" : n;
              }
              return i;
            }(p, this.locale));
            var f = {
              type: Nt.dateTime,
              pattern: d,
              location: l.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? Yt(d) : {}
            };
            return {
              val: {
                type: "date" === a ? Ct.date : Ct.time,
                value: i,
                location: u,
                style: f
              },
              err: null
            };
          }
          return {
            val: {
              type: "number" === a ? Ct.number : "date" === a ? Ct.date : Ct.time,
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
          if (this.bumpSpace(), !this.bumpIf(",")) return this.error(Bt.EXPECT_SELECT_ARGUMENT_OPTIONS, ue(_, r({}, _)));
          this.bumpSpace();
          var g = this.parseIdentifierIfPossible(),
            m = 0;
          if ("select" !== a && "offset" === g.value) {
            if (!this.bumpIf(":")) return this.error(Bt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, ue(this.clonePosition(), this.clonePosition()));
            var v;
            if (this.bumpSpace(), (v = this.tryParseDecimalInteger(Bt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, Bt.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err) return v;
            this.bumpSpace(), g = this.parseIdentifierIfPossible(), m = v.val;
          }
          var b,
            y = this.tryParsePluralOrSelectOptions(t, a, e, g);
          if (y.err) return y;
          if ((b = this.tryParseArgumentClose(n)).err) return b;
          var E = ue(n, this.clonePosition());
          return "select" === a ? {
            val: {
              type: Ct.select,
              value: i,
              options: we(y.val),
              location: E
            },
            err: null
          } : {
            val: {
              type: Ct.plural,
              value: i,
              options: we(y.val),
              offset: m,
              pluralType: "plural" === a ? "cardinal" : "ordinal",
              location: E
            },
            err: null
          };
        default:
          return this.error(Bt.INVALID_ARGUMENT_TYPE, ue(o, h));
      }
    }, t.prototype.tryParseArgumentClose = function (t) {
      return this.isEOF() || 125 !== this.char() ? this.error(Bt.EXPECT_ARGUMENT_CLOSING_BRACE, ue(t, this.clonePosition())) : (this.bump(), {
        val: !0,
        err: null
      });
    }, t.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var t = 0, e = this.clonePosition(); !this.isEOF();) {
        switch (this.char()) {
          case 39:
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'")) return this.error(Bt.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, ue(i, this.clonePosition()));
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
          for (var e = t.split(Zt).filter(function (t) {
              return t.length > 0;
            }), i = [], r = 0, n = e; r < n.length; r++) {
            var s = n[r].split("/");
            if (0 === s.length) throw new Error("Invalid number skeleton");
            for (var o = s[0], a = s.slice(1), h = 0, l = a; h < l.length; h++) if (0 === l[h].length) throw new Error("Invalid number skeleton");
            i.push({
              stem: o,
              options: a
            });
          }
          return i;
        }(t);
      } catch (t) {
        return this.error(Bt.INVALID_NUMBER_SKELETON, e);
      }
      return {
        val: {
          type: Nt.number,
          tokens: i,
          location: e,
          parsedOptions: this.shouldParseSkeletons ? se(i) : {}
        },
        err: null
      };
    }, t.prototype.tryParsePluralOrSelectOptions = function (t, e, i, r) {
      for (var n, s = !1, o = [], a = new Set(), h = r.value, l = r.location;;) {
        if (0 === h.length) {
          var c = this.clonePosition();
          if ("select" === e || !this.bumpIf("=")) break;
          var u = this.tryParseDecimalInteger(Bt.EXPECT_PLURAL_ARGUMENT_SELECTOR, Bt.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (u.err) return u;
          l = ue(c, this.clonePosition()), h = this.message.slice(c.offset, this.offset());
        }
        if (a.has(h)) return this.error("select" === e ? Bt.DUPLICATE_SELECT_ARGUMENT_SELECTOR : Bt.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
        "other" === h && (s = !0), this.bumpSpace();
        var p = this.clonePosition();
        if (!this.bumpIf("{")) return this.error("select" === e ? Bt.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : Bt.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, ue(this.clonePosition(), this.clonePosition()));
        var d = this.parseMessage(t + 1, e, i);
        if (d.err) return d;
        var f = this.tryParseArgumentClose(p);
        if (f.err) return f;
        o.push([h, {
          value: d.val,
          location: ue(p, this.clonePosition())
        }]), a.add(h), this.bumpSpace(), h = (n = this.parseIdentifierIfPossible()).value, l = n.location;
      }
      return 0 === o.length ? this.error("select" === e ? Bt.EXPECT_SELECT_ARGUMENT_SELECTOR : Bt.EXPECT_PLURAL_ARGUMENT_SELECTOR, ue(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !s ? this.error(Bt.MISSING_OTHER_CLAUSE, ue(this.clonePosition(), this.clonePosition())) : {
        val: o,
        err: null
      };
    }, t.prototype.tryParseDecimalInteger = function (t, e) {
      var i = 1,
        r = this.clonePosition();
      this.bumpIf("+") || this.bumpIf("-") && (i = -1);
      for (var n = !1, s = 0; !this.isEOF();) {
        var o = this.char();
        if (!(o >= 48 && o <= 57)) break;
        n = !0, s = 10 * s + (o - 48), this.bump();
      }
      var a = ue(r, this.clonePosition());
      return n ? ve(s *= i) ? {
        val: s,
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
      var e = He(this.message, t);
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
      if (Ee(this.message, t, this.offset())) {
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
      for (; !this.isEOF() && Le(this.char());) this.bump();
    }, t.prototype.peek = function () {
      if (this.isEOF()) return null;
      var t = this.char(),
        e = this.offset(),
        i = this.message.charCodeAt(e + (t >= 65536 ? 2 : 1));
      return null != i ? i : null;
    }, t;
  }();
  function Ce(t) {
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  function Ne(t) {
    return 45 === t || 46 === t || t >= 48 && t <= 57 || 95 === t || t >= 97 && t <= 122 || t >= 65 && t <= 90 || 183 == t || t >= 192 && t <= 214 || t >= 216 && t <= 246 || t >= 248 && t <= 893 || t >= 895 && t <= 8191 || t >= 8204 && t <= 8205 || t >= 8255 && t <= 8256 || t >= 8304 && t <= 8591 || t >= 11264 && t <= 12271 || t >= 12289 && t <= 55295 || t >= 63744 && t <= 64975 || t >= 65008 && t <= 65533 || t >= 65536 && t <= 983039;
  }
  function Le(t) {
    return t >= 9 && t <= 13 || 32 === t || 133 === t || t >= 8206 && t <= 8207 || 8232 === t || 8233 === t;
  }
  function Oe(t) {
    return t >= 33 && t <= 35 || 36 === t || t >= 37 && t <= 39 || 40 === t || 41 === t || 42 === t || 43 === t || 44 === t || 45 === t || t >= 46 && t <= 47 || t >= 58 && t <= 59 || t >= 60 && t <= 62 || t >= 63 && t <= 64 || 91 === t || 92 === t || 93 === t || 94 === t || 96 === t || 123 === t || 124 === t || 125 === t || 126 === t || 161 === t || t >= 162 && t <= 165 || 166 === t || 167 === t || 169 === t || 171 === t || 172 === t || 174 === t || 176 === t || 177 === t || 182 === t || 187 === t || 191 === t || 215 === t || 247 === t || t >= 8208 && t <= 8213 || t >= 8214 && t <= 8215 || 8216 === t || 8217 === t || 8218 === t || t >= 8219 && t <= 8220 || 8221 === t || 8222 === t || 8223 === t || t >= 8224 && t <= 8231 || t >= 8240 && t <= 8248 || 8249 === t || 8250 === t || t >= 8251 && t <= 8254 || t >= 8257 && t <= 8259 || 8260 === t || 8261 === t || 8262 === t || t >= 8263 && t <= 8273 || 8274 === t || 8275 === t || t >= 8277 && t <= 8286 || t >= 8592 && t <= 8596 || t >= 8597 && t <= 8601 || t >= 8602 && t <= 8603 || t >= 8604 && t <= 8607 || 8608 === t || t >= 8609 && t <= 8610 || 8611 === t || t >= 8612 && t <= 8613 || 8614 === t || t >= 8615 && t <= 8621 || 8622 === t || t >= 8623 && t <= 8653 || t >= 8654 && t <= 8655 || t >= 8656 && t <= 8657 || 8658 === t || 8659 === t || 8660 === t || t >= 8661 && t <= 8691 || t >= 8692 && t <= 8959 || t >= 8960 && t <= 8967 || 8968 === t || 8969 === t || 8970 === t || 8971 === t || t >= 8972 && t <= 8991 || t >= 8992 && t <= 8993 || t >= 8994 && t <= 9e3 || 9001 === t || 9002 === t || t >= 9003 && t <= 9083 || 9084 === t || t >= 9085 && t <= 9114 || t >= 9115 && t <= 9139 || t >= 9140 && t <= 9179 || t >= 9180 && t <= 9185 || t >= 9186 && t <= 9254 || t >= 9255 && t <= 9279 || t >= 9280 && t <= 9290 || t >= 9291 && t <= 9311 || t >= 9472 && t <= 9654 || 9655 === t || t >= 9656 && t <= 9664 || 9665 === t || t >= 9666 && t <= 9719 || t >= 9720 && t <= 9727 || t >= 9728 && t <= 9838 || 9839 === t || t >= 9840 && t <= 10087 || 10088 === t || 10089 === t || 10090 === t || 10091 === t || 10092 === t || 10093 === t || 10094 === t || 10095 === t || 10096 === t || 10097 === t || 10098 === t || 10099 === t || 10100 === t || 10101 === t || t >= 10132 && t <= 10175 || t >= 10176 && t <= 10180 || 10181 === t || 10182 === t || t >= 10183 && t <= 10213 || 10214 === t || 10215 === t || 10216 === t || 10217 === t || 10218 === t || 10219 === t || 10220 === t || 10221 === t || 10222 === t || 10223 === t || t >= 10224 && t <= 10239 || t >= 10240 && t <= 10495 || t >= 10496 && t <= 10626 || 10627 === t || 10628 === t || 10629 === t || 10630 === t || 10631 === t || 10632 === t || 10633 === t || 10634 === t || 10635 === t || 10636 === t || 10637 === t || 10638 === t || 10639 === t || 10640 === t || 10641 === t || 10642 === t || 10643 === t || 10644 === t || 10645 === t || 10646 === t || 10647 === t || 10648 === t || t >= 10649 && t <= 10711 || 10712 === t || 10713 === t || 10714 === t || 10715 === t || t >= 10716 && t <= 10747 || 10748 === t || 10749 === t || t >= 10750 && t <= 11007 || t >= 11008 && t <= 11055 || t >= 11056 && t <= 11076 || t >= 11077 && t <= 11078 || t >= 11079 && t <= 11084 || t >= 11085 && t <= 11123 || t >= 11124 && t <= 11125 || t >= 11126 && t <= 11157 || 11158 === t || t >= 11159 && t <= 11263 || t >= 11776 && t <= 11777 || 11778 === t || 11779 === t || 11780 === t || 11781 === t || t >= 11782 && t <= 11784 || 11785 === t || 11786 === t || 11787 === t || 11788 === t || 11789 === t || t >= 11790 && t <= 11798 || 11799 === t || t >= 11800 && t <= 11801 || 11802 === t || 11803 === t || 11804 === t || 11805 === t || t >= 11806 && t <= 11807 || 11808 === t || 11809 === t || 11810 === t || 11811 === t || 11812 === t || 11813 === t || 11814 === t || 11815 === t || 11816 === t || 11817 === t || t >= 11818 && t <= 11822 || 11823 === t || t >= 11824 && t <= 11833 || t >= 11834 && t <= 11835 || t >= 11836 && t <= 11839 || 11840 === t || 11841 === t || 11842 === t || t >= 11843 && t <= 11855 || t >= 11856 && t <= 11857 || 11858 === t || t >= 11859 && t <= 11903 || t >= 12289 && t <= 12291 || 12296 === t || 12297 === t || 12298 === t || 12299 === t || 12300 === t || 12301 === t || 12302 === t || 12303 === t || 12304 === t || 12305 === t || t >= 12306 && t <= 12307 || 12308 === t || 12309 === t || 12310 === t || 12311 === t || 12312 === t || 12313 === t || 12314 === t || 12315 === t || 12316 === t || 12317 === t || t >= 12318 && t <= 12319 || 12320 === t || 12336 === t || 64830 === t || 64831 === t || t >= 65093 && t <= 65094;
  }
  function Ie(t) {
    t.forEach(function (t) {
      if (delete t.location, Gt(t) || Ft(t)) for (var e in t.options) delete t.options[e].location, Ie(t.options[e].value);else xt(t) && zt(t.style) || (Dt(t) || kt(t)) && Xt(t.style) ? delete t.style.location : Vt(t) && Ie(t.children);
    });
  }
  function Re(t, e) {
    void 0 === e && (e = {}), e = r({
      shouldParseSkeletons: !0,
      requiresOtherClause: !0
    }, e);
    var i = new Be(t, e).parse();
    if (i.err) {
      var n = SyntaxError(Bt[i.err.kind]);
      throw n.location = i.err.location, n.originalMessage = i.err.message, n;
    }
    return (null == e ? void 0 : e.captureLocation) || Ie(i.val), i.val;
  }
  function Ue(t, e) {
    var i = e && e.cache ? e.cache : Ve,
      r = e && e.serializer ? e.serializer : Ge;
    return (e && e.strategy ? e.strategy : ke)(t, {
      cache: i,
      serializer: r
    });
  }
  function Me(t, e, i, r) {
    var n,
      s = null == (n = r) || "number" == typeof n || "boolean" == typeof n ? r : i(r),
      o = e.get(s);
    return void 0 === o && (o = t.call(this, r), e.set(s, o)), o;
  }
  function xe(t, e, i) {
    var r = Array.prototype.slice.call(arguments, 3),
      n = i(r),
      s = e.get(n);
    return void 0 === s && (s = t.apply(this, r), e.set(n, s)), s;
  }
  function De(t, e, i, r, n) {
    return i.bind(e, t, r, n);
  }
  function ke(t, e) {
    return De(t, this, 1 === t.length ? Me : xe, e.cache.create(), e.serializer);
  }
  var Ge = function () {
    return JSON.stringify(arguments);
  };
  function Fe() {
    this.cache = Object.create(null);
  }
  Fe.prototype.get = function (t) {
    return this.cache[t];
  }, Fe.prototype.set = function (t, e) {
    this.cache[t] = e;
  };
  var je,
    Ve = {
      create: function () {
        return new Fe();
      }
    },
    ze = {
      variadic: function (t, e) {
        return De(t, this, xe, e.cache.create(), e.serializer);
      },
      monadic: function (t, e) {
        return De(t, this, Me, e.cache.create(), e.serializer);
      }
    };
  !function (t) {
    t.MISSING_VALUE = "MISSING_VALUE", t.INVALID_VALUE = "INVALID_VALUE", t.MISSING_INTL_API = "MISSING_INTL_API";
  }(je || (je = {}));
  var Xe,
    Ke = function (t) {
      function e(e, i, r) {
        var n = t.call(this, e) || this;
        return n.code = i, n.originalMessage = r, n;
      }
      return i(e, t), e.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }, e;
    }(Error),
    We = function (t) {
      function e(e, i, r, n) {
        return t.call(this, 'Invalid values for "'.concat(e, '": "').concat(i, '". Options are "').concat(Object.keys(r).join('", "'), '"'), je.INVALID_VALUE, n) || this;
      }
      return i(e, t), e;
    }(Ke),
    Ye = function (t) {
      function e(e, i, r) {
        return t.call(this, 'Value for "'.concat(e, '" must be of type ').concat(i), je.INVALID_VALUE, r) || this;
      }
      return i(e, t), e;
    }(Ke),
    Ze = function (t) {
      function e(e, i) {
        return t.call(this, 'The intl string context variable "'.concat(e, '" was not provided to the string "').concat(i, '"'), je.MISSING_VALUE, i) || this;
      }
      return i(e, t), e;
    }(Ke);
  function qe(t) {
    return "function" == typeof t;
  }
  function Je(t, e, i, r, n, s, o) {
    if (1 === t.length && Ut(t[0])) return [{
      type: Xe.literal,
      value: t[0].value
    }];
    for (var a = [], h = 0, l = t; h < l.length; h++) {
      var c = l[h];
      if (Ut(c)) a.push({
        type: Xe.literal,
        value: c.value
      });else if (jt(c)) "number" == typeof s && a.push({
        type: Xe.literal,
        value: i.getNumberFormat(e).format(s)
      });else {
        var u = c.value;
        if (!n || !(u in n)) throw new Ze(u, o);
        var p = n[u];
        if (Mt(c)) p && "string" != typeof p && "number" != typeof p || (p = "string" == typeof p || "number" == typeof p ? String(p) : ""), a.push({
          type: "string" == typeof p ? Xe.literal : Xe.object,
          value: p
        });else if (Dt(c)) {
          var d = "string" == typeof c.style ? r.date[c.style] : Xt(c.style) ? c.style.parsedOptions : void 0;
          a.push({
            type: Xe.literal,
            value: i.getDateTimeFormat(e, d).format(p)
          });
        } else if (kt(c)) {
          d = "string" == typeof c.style ? r.time[c.style] : Xt(c.style) ? c.style.parsedOptions : r.time.medium;
          a.push({
            type: Xe.literal,
            value: i.getDateTimeFormat(e, d).format(p)
          });
        } else if (xt(c)) {
          (d = "string" == typeof c.style ? r.number[c.style] : zt(c.style) ? c.style.parsedOptions : void 0) && d.scale && (p *= d.scale || 1), a.push({
            type: Xe.literal,
            value: i.getNumberFormat(e, d).format(p)
          });
        } else {
          if (Vt(c)) {
            var f = c.children,
              _ = c.value,
              g = n[_];
            if (!qe(g)) throw new Ye(_, "function", o);
            var m = g(Je(f, e, i, r, n, s).map(function (t) {
              return t.value;
            }));
            Array.isArray(m) || (m = [m]), a.push.apply(a, m.map(function (t) {
              return {
                type: "string" == typeof t ? Xe.literal : Xe.object,
                value: t
              };
            }));
          }
          if (Gt(c)) {
            if (!(v = c.options[p] || c.options.other)) throw new We(c.value, p, Object.keys(c.options), o);
            a.push.apply(a, Je(v.value, e, i, r, n));
          } else if (Ft(c)) {
            var v;
            if (!(v = c.options["=".concat(p)])) {
              if (!Intl.PluralRules) throw new Ke('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', je.MISSING_INTL_API, o);
              var b = i.getPluralRules(e, {
                type: c.pluralType
              }).select(p - (c.offset || 0));
              v = c.options[b] || c.options.other;
            }
            if (!v) throw new We(c.value, p, Object.keys(c.options), o);
            a.push.apply(a, Je(v.value, e, i, r, n, p - (c.offset || 0)));
          } else ;
        }
      }
    }
    return function (t) {
      return t.length < 2 ? t : t.reduce(function (t, e) {
        var i = t[t.length - 1];
        return i && i.type === Xe.literal && e.type === Xe.literal ? i.value += e.value : t.push(e), t;
      }, []);
    }(a);
  }
  function Qe(t, e) {
    return e ? Object.keys(t).reduce(function (i, n) {
      var s, o;
      return i[n] = (s = t[n], (o = e[n]) ? r(r(r({}, s || {}), o || {}), Object.keys(s).reduce(function (t, e) {
        return t[e] = r(r({}, s[e]), o[e] || {}), t;
      }, {})) : s), i;
    }, r({}, t)) : t;
  }
  function ti(t) {
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
  }(Xe || (Xe = {}));
  var ei = function () {
      function t(e, i, n, o) {
        var a,
          h = this;
        if (void 0 === i && (i = t.defaultLocale), this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }, this.format = function (t) {
          var e = h.formatToParts(t);
          if (1 === e.length) return e[0].value;
          var i = e.reduce(function (t, e) {
            return t.length && e.type === Xe.literal && "string" == typeof t[t.length - 1] ? t[t.length - 1] += e.value : t.push(e.value), t;
          }, []);
          return i.length <= 1 ? i[0] || "" : i;
        }, this.formatToParts = function (t) {
          return Je(h.ast, h.locales, h.formatters, h.formats, t, void 0, h.message);
        }, this.resolvedOptions = function () {
          var t;
          return {
            locale: (null === (t = h.resolvedLocale) || void 0 === t ? void 0 : t.toString()) || Intl.NumberFormat.supportedLocalesOf(h.locales)[0]
          };
        }, this.getAst = function () {
          return h.ast;
        }, this.locales = i, this.resolvedLocale = t.resolveLocale(i), "string" == typeof e) {
          if (this.message = e, !t.__parse) throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");
          var l = o || {};
          l.formatters;
          var c = function (t, e) {
            var i = {};
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (i[r] = t[r]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
              var n = 0;
              for (r = Object.getOwnPropertySymbols(t); n < r.length; n++) e.indexOf(r[n]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[n]) && (i[r[n]] = t[r[n]]);
            }
            return i;
          }(l, ["formatters"]);
          this.ast = t.__parse(e, r(r({}, c), {
            locale: this.resolvedLocale
          }));
        } else this.ast = e;
        if (!Array.isArray(this.ast)) throw new TypeError("A message must be provided as a String or AST.");
        this.formats = Qe(t.formats, n), this.formatters = o && o.formatters || (void 0 === (a = this.formatterCache) && (a = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }), {
          getNumberFormat: Ue(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.NumberFormat).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: ti(a.number),
            strategy: ze.variadic
          }),
          getDateTimeFormat: Ue(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.DateTimeFormat).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: ti(a.dateTime),
            strategy: ze.variadic
          }),
          getPluralRules: Ue(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.PluralRules).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: ti(a.pluralRules),
            strategy: ze.variadic
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
      }, t.__parse = Re, t.formats = {
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
    ii = ei,
    ri = {
      en: Rt
    };
  function ni(t, e, ...i) {
    const r = e.replace(/['"]+/g, "");
    var n;
    try {
      n = t.split(".").reduce((t, e) => t[e], ri[r]);
    } catch (e) {
      n = t.split(".").reduce((t, e) => t[e], ri.en);
    }
    if (void 0 === n && (n = t.split(".").reduce((t, e) => t[e], ri.en)), !i.length) return n;
    const s = {};
    for (let t = 0; t < i.length; t += 2) {
      let e = i[t];
      e = e.replace(/^{([^}]+)?}$/, "$1"), s[e] = i[t + 1];
    }
    try {
      return new ii(n, e).format(s);
    } catch (t) {
      return "Translation " + t;
    }
  }
  let si = class extends ct {
    _renderInfoRow(t, e) {
      return K`
      <div class="info-row">
        <span class="info-heading">
          ${ni(`panels.main.cards.main.fields.${t}.heading`, this.hass.language)}:</span
        >
        <span class="info-detail">${e}</span>
      </div>
    `;
    }
    _renderOptionalInfoRow(t, e, i) {
      return t ? this._renderInfoRow(e, i) : null;
    }
    render() {
      const t = Tt(this.route),
        e = $t(this.printers, t),
        i = (r = e) ? r.hw_version.split("Printer ID: ")[1] : void 0;
      var r;
      const n = function (t) {
          return t && t.connections.length > 0 && t.connections[0].length > 1 ? t.connections[0][1] : null;
        }(e),
        s = At(this.hass, t),
        o = function (t) {
          for (const e in t) {
            const t = e.split("."),
              i = t[0],
              r = t[1];
            if ("binary_sensor" === i && r.endsWith("printer_online")) return r.split("printer_online")[0];
          }
        }(s),
        a = Ht(s, o, "sensor", "ace_fw_version"),
        h = Ht(s, o, "binary_sensor", "drying_active"),
        l = Ht(s, o, "sensor", "drying_remaining_time"),
        c = Ht(s, o, "sensor", "drying_total_duration"),
        u = Ht(s, o, "binary_sensor", "ace_firmware_update_available"),
        p = Ht(s, o, "binary_sensor", "firmware_update_available"),
        d = Ht(s, o, "binary_sensor", "is_available"),
        f = Ht(s, o, "binary_sensor", "printer_online"),
        _ = Ht(s, o, "sensor", "nozzle_temperature"),
        g = Ht(s, o, "sensor", "hotbed_temperature"),
        m = Ht(s, o, "sensor", "target_nozzle_temperature"),
        v = Ht(s, o, "sensor", "target_hotbed_temperature"),
        b = Ht(s, o, "sensor", "project_progress"),
        y = Ht(s, o, "sensor", "print_state"),
        E = Et(this.hass, p, "Update Available", "Up To Date"),
        A = Et(this.hass, d, "Available", "Busy"),
        w = Et(this.hass, f, "Online", "Offline"),
        H = bt(this.hass, _),
        T = bt(this.hass, g),
        $ = bt(this.hass, m),
        S = bt(this.hass, v),
        P = bt(this.hass, b),
        B = yt(this.hass, y),
        C = Et(this.hass, u, "Update Available", "Up To Date"),
        N = Et(this.hass, h, "Drying", "Not Drying"),
        L = yt(this.hass, a),
        O = bt(this.hass, l),
        I = bt(this.hass, c),
        R = (I > 0 ? Math.round(1e4 * (1 - O / I)) / 100 : 0).toFixed(2);
      return K`
      <printer-card elevation="2">
        ${this._renderInfoRow("printer_name", e ? e.name : null)}
        ${this._renderInfoRow("printer_id", i)}
        ${this._renderInfoRow("printer_mac", n)}
        ${this._renderInfoRow("printer_model", e ? e.model : null)}
        ${this._renderInfoRow("printer_fw_version", e ? e.sw_version : null)}
        ${this._renderInfoRow("printer_fw_update_available", E)}
        ${this._renderInfoRow("printer_online", w)}
        ${this._renderInfoRow("printer_available", A)}
        ${this._renderInfoRow("curr_nozzle_temp", H)}
        ${this._renderInfoRow("curr_hotbed_temp", T)}
        ${this._renderInfoRow("target_nozzle_temp", $)}
        ${this._renderInfoRow("target_hotbed_temp", S)}
        ${this._renderInfoRow("print_state", (U = B, U.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ")))}
        ${this._renderInfoRow("project_progress", `${P}%`)}
        ${this._renderOptionalInfoRow(a, "ace_fw_version", L)}
        ${this._renderOptionalInfoRow(u, "ace_fw_update_available", C)}
        ${this._renderOptionalInfoRow(h, "drying_active", N)}
        ${this._renderOptionalInfoRow(l, "drying_progress", `${R}%`)}
      </printer-card>
    `;
      var U;
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
  n([_t()], si.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], si.prototype, "narrow", void 0), n([_t()], si.prototype, "route", void 0), n([_t()], si.prototype, "panel", void 0), n([_t()], si.prototype, "printers", void 0), si = n([pt("anycubic-view-main")], si);
  const oi = "anycubic_cloud",
    ai = u`
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
  let hi = class extends ct {
    render() {
      var t;
      const e = Tt(this.route),
        i = At(this.hass, e),
        r = wt(i, "sensor", "file_list_cloud");
      const n = function (t) {
          return wt(t, "button", "request_file_list_cloud");
        }(i),
        s = r ? this.hass.states[r.entity_id] : void 0,
        o = s ? null === (t = s.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(n);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${o ? o.map(t => K`
                  <li class="file-info">
                    <div class="file-name">${t.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${e => {
        this.deleteFile(t.id);
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
    refreshList(t) {
      t && this.hass.callService("button", "press", {
        entity_id: t.entity_id
      });
    }
    deleteFile(t) {
      const e = Tt(this.route),
        i = $t(this.printers, e);
      i && t && this.hass.callService(oi, "delete_file_cloud", {
        config_entry: i.primary_config_entry,
        device_id: i.id,
        file_id: t
      });
    }
    static get styles() {
      return u`
      ${ai} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_t()], hi.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], hi.prototype, "narrow", void 0), n([_t()], hi.prototype, "route", void 0), n([_t()], hi.prototype, "panel", void 0), n([_t()], hi.prototype, "printers", void 0), hi = n([pt("anycubic-view-files_cloud")], hi);
  let li = class extends ct {
    render() {
      var t;
      const e = Tt(this.route),
        i = At(this.hass, e),
        r = wt(i, "sensor", "file_list_local");
      const n = function (t) {
          return wt(t, "button", "request_file_list_local");
        }(i),
        s = r ? this.hass.states[r.entity_id] : void 0,
        o = s ? null === (t = s.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(n);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${o ? o.map(t => K`
                  <li class="file-info">
                    <div class="file-name">${t.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${e => {
        this.deleteFile(t.name);
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
    refreshList(t) {
      t && this.hass.callService("button", "press", {
        entity_id: t.entity_id
      });
    }
    deleteFile(t) {
      const e = Tt(this.route),
        i = $t(this.printers, e);
      i && t && this.hass.callService(oi, "delete_file_local", {
        config_entry: i.primary_config_entry,
        device_id: i.id,
        filename: t
      });
    }
    static get styles() {
      return u`
      ${ai} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_t()], li.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], li.prototype, "narrow", void 0), n([_t()], li.prototype, "route", void 0), n([_t()], li.prototype, "panel", void 0), n([_t()], li.prototype, "printers", void 0), li = n([pt("anycubic-view-files_local")], li);
  let ci = class extends ct {
    render() {
      var t;
      const e = Tt(this.route),
        i = At(this.hass, e),
        r = wt(i, "sensor", "file_list_udisk");
      const n = function (t) {
          return wt(t, "button", "request_file_list_udisk");
        }(i),
        s = r ? this.hass.states[r.entity_id] : void 0,
        o = s ? null === (t = s.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return K`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(n);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${o ? o.map(t => K`
                  <li class="file-info">
                    <div class="file-name">${t.name}</div>
                    <button
                      class="file-delete-button"
                      @click="${e => {
        this.deleteFile(t.name);
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
    refreshList(t) {
      t && this.hass.callService("button", "press", {
        entity_id: t.entity_id
      });
    }
    deleteFile(t) {
      const e = Tt(this.route),
        i = $t(this.printers, e);
      i && t && this.hass.callService(oi, "delete_file_udisk", {
        config_entry: i.primary_config_entry,
        device_id: i.id,
        filename: t
      });
    }
    static get styles() {
      return u`
      ${ai} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([_t()], ci.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], ci.prototype, "narrow", void 0), n([_t()], ci.prototype, "route", void 0), n([_t()], ci.prototype, "panel", void 0), n([_t()], ci.prototype, "printers", void 0), ci = n([pt("anycubic-view-files_udisk")], ci);
  var ui = "M8,5.14V19.14L19,12.14L8,5.14Z";
  const pi = async () => {
    var t, e, i, r, n, s, o;
    if (customElements.get("ha-service-control")) return;
    const a = document.createElement("partial-panel-resolver").getRoutes([{
      component_name: "developer-tools",
      url_path: "a"
    }]);
    await (null === (i = null === (e = null === (t = null == a ? void 0 : a.routes) || void 0 === t ? void 0 : t.a) || void 0 === e ? void 0 : e.load) || void 0 === i ? void 0 : i.call(e));
    const h = document.createElement("developer-tools-router");
    await (null === (o = null === (s = null === (n = null === (r = null == h ? void 0 : h.routerOptions) || void 0 === r ? void 0 : r.routes) || void 0 === n ? void 0 : n.service) || void 0 === s ? void 0 : s.load) || void 0 === o ? void 0 : o.call(s));
  };
  let di = class extends ct {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_no_cloud_save",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await pi();
    }
    willUpdate(t) {
      super.willUpdate(t);
      const e = Tt(this.route),
        i = $t(this.printers, e);
      i && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: i.primary_config_entry,
          device_id: i.id
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
          <ha-svg-icon .path=${ui}></ha-svg-icon>
          ${ni("panels.print_no_cloud_save.actions.print", this.hass.language)}
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
    _scriptDataChanged(t) {
      this._scriptData = Object.assign(Object.assign({}, this._scriptData), t.detail.value);
    }
    async _runScript(t) {
      t.stopPropagation(), this.hass.callService("anycubic_cloud", "print_and_upload_no_cloud_save", this._scriptData.data);
    }
  };
  n([_t({
    attribute: !1
  })], di.prototype, "hass", void 0), n([_t()], di.prototype, "route", void 0), n([_t()], di.prototype, "panel", void 0), n([_t()], di.prototype, "printers", void 0), n([gt()], di.prototype, "_scriptData", void 0), n([gt()], di.prototype, "narrow", void 0), di = n([pt("anycubic-view-print-no_cloud_save")], di);
  let fi = class extends ct {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_save_in_cloud",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await pi();
    }
    willUpdate(t) {
      super.willUpdate(t);
      const e = Tt(this.route),
        i = $t(this.printers, e);
      i && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: i.primary_config_entry,
          device_id: i.id
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
          <ha-svg-icon .path=${ui}></ha-svg-icon>
          ${ni("panels.print_save_in_cloud.actions.print", this.hass.language)}
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
    _scriptDataChanged(t) {
      this._scriptData = Object.assign(Object.assign({}, this._scriptData), t.detail.value);
    }
    async _runScript(t) {
      t.stopPropagation(), this.hass.callService("anycubic_cloud", "print_and_upload_save_in_cloud", this._scriptData.data);
    }
  };
  n([_t({
    attribute: !1
  })], fi.prototype, "hass", void 0), n([_t()], fi.prototype, "route", void 0), n([_t()], fi.prototype, "panel", void 0), n([_t()], fi.prototype, "printers", void 0), n([gt()], fi.prototype, "_scriptData", void 0), n([gt()], fi.prototype, "narrow", void 0), fi = n([pt("anycubic-view-print-save_in_cloud")], fi), t.AnycubicCloudPanel = class extends ct {
    async firstUpdated() {
      window.addEventListener("location-changed", () => {
        window.location.pathname.includes("anycubic-cloud") && this.requestUpdate();
      }), this.printers = await function (t) {
        const e = {};
        for (const i in t.devices) {
          const r = t.devices[i];
          "Anycubic" === r.manufacturer && (e[r.id] = r);
        }
        return e;
      }(this.hass), this.requestUpdate();
    }
    render() {
      return this.getInitialView();
    }
    renderPrinterPage() {
      const t = St(this.route);
      return K`
      <div class="header">
        ${this.renderToolbar()}
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${t}
          @iron-activate=${this.handlePageSelected}
        >
          <paper-tab page-name="main">
            ${ni("panels.main.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="local-files">
            ${ni("panels.files_local.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="udisk-files">
            ${ni("panels.files_udisk.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="cloud-files">
            ${ni("panels.files_cloud.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-no_cloud_save">
            ${ni("panels.print_no_cloud_save.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-save_in_cloud">
            ${ni("panels.print_save_in_cloud.title", this.hass.language)}
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
        <div class="main-title">${ni("title", this.hass.language)}</div>
        <div class="version">v${"0.0.3"}</div>
      </div>
    `;
    }
    getInitialView() {
      return Tt(this.route) ? this.renderPrinterPage() : K`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>
            ${ni("panels.initial.fields.printer_select.heading", this.hass.language)}
          </p>
          <ul class="printers-container">
            ${this.printers ? Object.keys(this.printers).map(t => K`<li
                      class="printer-select-box"
                      @click="${e => {
        this._handlePrinterClick(t);
      }}"
                    >
                      ${this.printers[t].name}
                    </li>`) : null}
          </ul>
        </printer-select>
      `;
    }
    getView(t) {
      switch (St(t)) {
        case "local-files":
          return K`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-files_local>
        `;
        case "udisk-files":
          return K`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-files_udisk>
        `;
        case "cloud-files":
          return K`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-files_cloud>
        `;
        case "print-no_cloud_save":
          return K`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-print-no_cloud_save>
        `;
        case "print-save_in_cloud":
          return K`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-print-save_in_cloud>
        `;
        case "main":
          return K`
          <anycubic-view-main
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
          ></anycubic-view-main>
        `;
        case "debug":
          return K`
          <anycubic-view-debug
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
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
    _handlePrinterClick(t) {
      ((t, e, i = !1) => {
        const r = e ? `${e}/main` : "",
          n = `${t.route.prefix}/${r}`;
        i ? history.replaceState(null, "", n) : history.pushState(null, "", n), mt(window, "location-changed", {
          replace: i
        });
      })(this, t), this.requestUpdate();
    }
    handlePageSelected(t) {
      const e = t.detail.item.getAttribute("page-name");
      e !== St(this.route) ? (((t, e, i = !1) => {
        const r = Tt(t.route),
          n = r ? `${r}/${e}` : "",
          s = `${t.route.prefix}/${n}`;
        i ? history.replaceState(null, "", s) : history.pushState(null, "", s), mt(window, "location-changed", {
          replace: i
        });
      })(this, e), this.requestUpdate()) : scrollTo(0, 0);
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
  }, n([_t()], t.AnycubicCloudPanel.prototype, "hass", void 0), n([_t({
    type: Boolean,
    reflect: !0
  })], t.AnycubicCloudPanel.prototype, "narrow", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "route", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "panel", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "printers", void 0), t.AnycubicCloudPanel = n([pt("anycubic-cloud-panel")], t.AnycubicCloudPanel), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
