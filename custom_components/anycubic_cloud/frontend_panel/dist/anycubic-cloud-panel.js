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
    d = a ? t => t : t => t instanceof CSSStyleSheet ? (t => {
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
      is: p,
      defineProperty: f,
      getOwnPropertyDescriptor: m,
      getOwnPropertyNames: y,
      getOwnPropertySymbols: g,
      getPrototypeOf: _
    } = Object,
    v = globalThis,
    b = v.trustedTypes,
    w = b ? b.emptyScript : "",
    E = v.reactiveElementPolyfillSupport,
    S = (t, e) => t,
    P = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? w : null;
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
    A = (t, e) => !p(t, e),
    x = {
      attribute: !0,
      type: String,
      converter: P,
      reflect: !1,
      hasChanged: A
    };
  Symbol.metadata ??= Symbol("metadata"), v.litPropertyMetadata ??= new WeakMap();
  class T extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t, e = x) {
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
      } = m(this.prototype, t) ?? {
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
      return this.elementProperties.get(t) ?? x;
    }
    static _$Ei() {
      if (this.hasOwnProperty(S("elementProperties"))) return;
      const t = _(this);
      t.finalize(), void 0 !== t.l && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(S("finalized"))) return;
      if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(S("properties"))) {
        const t = this.properties,
          e = [...y(t), ...g(t)];
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
        const n = (void 0 !== i.converter?.toAttribute ? i.converter : P).toAttribute(e, i.type);
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
          } : void 0 !== t.converter?.fromAttribute ? t.converter : P;
        this._$Em = r, this[r] = n.fromAttribute(e, t.type), this._$Em = null;
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (i ??= this.constructor.getPropertyOptions(t), !(i.hasChanged ?? A)(this[t], e)) return;
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
  }, T[S("elementProperties")] = new Map(), T[S("finalized")] = new Map(), E?.({
    ReactiveElement: T
  }), (v.reactiveElementVersions ??= []).push("2.0.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const D = globalThis,
    $ = D.trustedTypes,
    M = $ ? $.createPolicy("lit-html", {
      createHTML: t => t
    }) : void 0,
    k = "$lit$",
    O = `lit$${Math.random().toFixed(9).slice(2)}$`,
    H = "?" + O,
    C = `<${H}>`,
    N = document,
    I = () => N.createComment(""),
    U = t => null === t || "object" != typeof t && "function" != typeof t,
    R = Array.isArray,
    B = t => R(t) || "function" == typeof t?.[Symbol.iterator],
    L = "[ \t\n\f\r]",
    Y = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    F = /-->/g,
    G = />/g,
    j = RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
    z = /'/g,
    V = /"/g,
    W = /^(?:script|style|textarea|title)$/i,
    Z = (t => (e, ...i) => ({
      _$litType$: t,
      strings: e,
      values: i
    }))(1),
    X = Symbol.for("lit-noChange"),
    K = Symbol.for("lit-nothing"),
    q = new WeakMap(),
    J = N.createTreeWalker(N, 129);
  function Q(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== M ? M.createHTML(e) : e;
  }
  const tt = (t, e) => {
    const i = t.length - 1,
      r = [];
    let n,
      s = 2 === e ? "<svg>" : "",
      o = Y;
    for (let e = 0; e < i; e++) {
      const i = t[e];
      let a,
        h,
        l = -1,
        c = 0;
      for (; c < i.length && (o.lastIndex = c, h = o.exec(i), null !== h);) c = o.lastIndex, o === Y ? "!--" === h[1] ? o = F : void 0 !== h[1] ? o = G : void 0 !== h[2] ? (W.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = j) : void 0 !== h[3] && (o = j) : o === j ? ">" === h[0] ? (o = n ?? Y, l = -1) : void 0 === h[1] ? l = -2 : (l = o.lastIndex - h[2].length, a = h[1], o = void 0 === h[3] ? j : '"' === h[3] ? V : z) : o === V || o === z ? o = j : o === F || o === G ? o = Y : (o = j, n = void 0);
      const u = o === j && t[e + 1].startsWith("/>") ? " " : "";
      s += o === Y ? i + C : l >= 0 ? (r.push(a), i.slice(0, l) + k + i.slice(l) + O + u) : i + O + (-2 === l ? e : u);
    }
    return [Q(t, s + (t[i] || "<?>") + (2 === e ? "</svg>" : "")), r];
  };
  class et {
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
        [h, l] = tt(t, e);
      if (this.el = et.createElement(h, i), J.currentNode = this.el.content, 2 === e) {
        const t = this.el.content.firstChild;
        t.replaceWith(...t.childNodes);
      }
      for (; null !== (r = J.nextNode()) && a.length < o;) {
        if (1 === r.nodeType) {
          if (r.hasAttributes()) for (const t of r.getAttributeNames()) if (t.endsWith(k)) {
            const e = l[s++],
              i = r.getAttribute(t).split(O),
              o = /([.?@])?(.*)/.exec(e);
            a.push({
              type: 1,
              index: n,
              name: o[2],
              strings: i,
              ctor: "." === o[1] ? ot : "?" === o[1] ? at : "@" === o[1] ? ht : st
            }), r.removeAttribute(t);
          } else t.startsWith(O) && (a.push({
            type: 6,
            index: n
          }), r.removeAttribute(t));
          if (W.test(r.tagName)) {
            const t = r.textContent.split(O),
              e = t.length - 1;
            if (e > 0) {
              r.textContent = $ ? $.emptyScript : "";
              for (let i = 0; i < e; i++) r.append(t[i], I()), J.nextNode(), a.push({
                type: 2,
                index: ++n
              });
              r.append(t[e], I());
            }
          }
        } else if (8 === r.nodeType) if (r.data === H) a.push({
          type: 2,
          index: n
        });else {
          let t = -1;
          for (; -1 !== (t = r.data.indexOf(O, t + 1));) a.push({
            type: 7,
            index: n
          }), t += O.length - 1;
        }
        n++;
      }
    }
    static createElement(t, e) {
      const i = N.createElement("template");
      return i.innerHTML = t, i;
    }
  }
  function it(t, e, i = t, r) {
    if (e === X) return e;
    let n = void 0 !== r ? i._$Co?.[r] : i._$Cl;
    const s = U(e) ? void 0 : e._$litDirective$;
    return n?.constructor !== s && (n?._$AO?.(!1), void 0 === s ? n = void 0 : (n = new s(t), n._$AT(t, i, r)), void 0 !== r ? (i._$Co ??= [])[r] = n : i._$Cl = n), void 0 !== n && (e = it(t, n._$AS(t, e.values), n, r)), e;
  }
  class rt {
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
        r = (t?.creationScope ?? N).importNode(e, !0);
      J.currentNode = r;
      let n = J.nextNode(),
        s = 0,
        o = 0,
        a = i[0];
      for (; void 0 !== a;) {
        if (s === a.index) {
          let e;
          2 === a.type ? e = new nt(n, n.nextSibling, this, t) : 1 === a.type ? e = new a.ctor(n, a.name, a.strings, this, t) : 6 === a.type && (e = new lt(n, this, t)), this._$AV.push(e), a = i[++o];
        }
        s !== a?.index && (n = J.nextNode(), s++);
      }
      return J.currentNode = N, r;
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
      this.type = 2, this._$AH = K, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
      t = it(this, t, e), U(t) ? t === K || null == t || "" === t ? (this._$AH !== K && this._$AR(), this._$AH = K) : t !== this._$AH && t !== X && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : B(t) ? this.k(t) : this._(t);
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
      this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
    }
    _(t) {
      this._$AH !== K && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(N.createTextNode(t)), this._$AH = t;
    }
    $(t) {
      const {
          values: e,
          _$litType$: i
        } = t,
        r = "number" == typeof i ? this._$AC(t) : (void 0 === i.el && (i.el = et.createElement(Q(i.h, i.h[0]), this.options)), i);
      if (this._$AH?._$AD === r) this._$AH.p(e);else {
        const t = new rt(r, this),
          i = t.u(this.options);
        t.p(e), this.T(i), this._$AH = t;
      }
    }
    _$AC(t) {
      let e = q.get(t.strings);
      return void 0 === e && q.set(t.strings, e = new et(t)), e;
    }
    k(t) {
      R(this._$AH) || (this._$AH = [], this._$AR());
      const e = this._$AH;
      let i,
        r = 0;
      for (const n of t) r === e.length ? e.push(i = new nt(this.S(I()), this.S(I()), this, this.options)) : i = e[r], i._$AI(n), r++;
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
  class st {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t, e, i, r, n) {
      this.type = 1, this._$AH = K, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || "" !== i[0] || "" !== i[1] ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = K;
    }
    _$AI(t, e = this, i, r) {
      const n = this.strings;
      let s = !1;
      if (void 0 === n) t = it(this, t, e, 0), s = !U(t) || t !== this._$AH && t !== X, s && (this._$AH = t);else {
        const r = t;
        let o, a;
        for (t = n[0], o = 0; o < n.length - 1; o++) a = it(this, r[i + o], e, o), a === X && (a = this._$AH[o]), s ||= !U(a) || a !== this._$AH[o], a === K ? t = K : t !== K && (t += (a ?? "") + n[o + 1]), this._$AH[o] = a;
      }
      s && !r && this.j(t);
    }
    j(t) {
      t === K ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
  }
  class ot extends st {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t) {
      this.element[this.name] = t === K ? void 0 : t;
    }
  }
  class at extends st {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== K);
    }
  }
  class ht extends st {
    constructor(t, e, i, r, n) {
      super(t, e, i, r, n), this.type = 5;
    }
    _$AI(t, e = this) {
      if ((t = it(this, t, e, 0) ?? K) === X) return;
      const i = this._$AH,
        r = t === K && i !== K || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive,
        n = t !== K && (i === K || r);
      r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
  }
  class lt {
    constructor(t, e, i) {
      this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t) {
      it(this, t);
    }
  }
  const ct = {
      P: k,
      A: O,
      C: H,
      M: 1,
      L: tt,
      R: rt,
      D: B,
      V: it,
      I: nt,
      H: st,
      N: at,
      U: ht,
      B: ot,
      F: lt
    },
    ut = D.litHtmlPolyfillSupport;
  ut?.(et, nt), (D.litHtmlVersions ??= []).push("3.1.4");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  class dt extends T {
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
          r._$litPart$ = n = new nt(e.insertBefore(I(), t), t, void 0, i ?? {});
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
      return X;
    }
  }
  dt._$litElement$ = !0, dt.finalized = !0, globalThis.litElementHydrateSupport?.({
    LitElement: dt
  });
  const pt = globalThis.litElementPolyfillSupport;
  pt?.({
    LitElement: dt
  }), (globalThis.litElementVersions ??= []).push("4.0.6");
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const ft = t => (e, i) => {
      void 0 !== i ? i.addInitializer(() => {
        customElements.define(t, e);
      }) : customElements.define(t, e);
    }
    /**
         * @license
         * Copyright 2017 Google LLC
         * SPDX-License-Identifier: BSD-3-Clause
         */,
    mt = {
      attribute: !0,
      type: String,
      converter: P,
      reflect: !1,
      hasChanged: A
    },
    yt = (t = mt, e, i) => {
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
  function gt(t) {
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
  function _t(t) {
    return gt({
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
  function bt(t, e) {
    return (i, r, n) => {
      const s = e => e.renderRoot?.querySelector(t) ?? null;
      if (e) {
        const {
          get: t,
          set: e
        } = "object" == typeof r ? i : n ?? (() => {
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
            return void 0 === i && (i = s(this), (null !== i || this.hasUpdated) && e.call(this, i)), i;
          }
        });
      }
      return vt(i, r, {
        get() {
          return s(this);
        }
      });
    };
  }
  "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self && self;
  function wt(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  function Et(t) {
    throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var St,
    Pt = {
      exports: {}
    };
  (St = Pt).exports = function () {
    var t, e;
    function i() {
      return t.apply(null, arguments);
    }
    function r(e) {
      t = e;
    }
    function n(t) {
      return t instanceof Array || "[object Array]" === Object.prototype.toString.call(t);
    }
    function s(t) {
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
    function h(t) {
      return void 0 === t;
    }
    function l(t) {
      return "number" == typeof t || "[object Number]" === Object.prototype.toString.call(t);
    }
    function c(t) {
      return t instanceof Date || "[object Date]" === Object.prototype.toString.call(t);
    }
    function u(t, e) {
      var i,
        r = [],
        n = t.length;
      for (i = 0; i < n; ++i) r.push(e(t[i], i));
      return r;
    }
    function d(t, e) {
      for (var i in e) o(e, i) && (t[i] = e[i]);
      return o(e, "toString") && (t.toString = e.toString), o(e, "valueOf") && (t.valueOf = e.valueOf), t;
    }
    function p(t, e, i, r) {
      return Zi(t, e, i, r, !0).utc();
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
        r = !1,
        n = t._d && !isNaN(t._d.getTime());
      return n && (i = m(t), r = e.call(i.parsedDateParts, function (t) {
        return null != t;
      }), n = i.overflow < 0 && !i.empty && !i.invalidEra && !i.invalidMonth && !i.invalidWeekday && !i.weekdayMismatch && !i.nullInput && !i.invalidFormat && !i.userInvalidated && (!i.meridiem || i.meridiem && r), t._strict && (n = n && 0 === i.charsLeftOver && 0 === i.unusedTokens.length && void 0 === i.bigHour)), null != Object.isFrozen && Object.isFrozen(t) ? n : (t._isValid = n, t._isValid);
    }
    function g(t) {
      var e = p(NaN);
      return null != t ? d(m(e), t) : m(e).userInvalidated = !0, e;
    }
    e = Array.prototype.some ? Array.prototype.some : function (t) {
      var e,
        i = Object(this),
        r = i.length >>> 0;
      for (e = 0; e < r; e++) if (e in i && t.call(this, i[e], e, i)) return !0;
      return !1;
    };
    var _ = i.momentProperties = [],
      v = !1;
    function b(t, e) {
      var i,
        r,
        n,
        s = _.length;
      if (h(e._isAMomentObject) || (t._isAMomentObject = e._isAMomentObject), h(e._i) || (t._i = e._i), h(e._f) || (t._f = e._f), h(e._l) || (t._l = e._l), h(e._strict) || (t._strict = e._strict), h(e._tzm) || (t._tzm = e._tzm), h(e._isUTC) || (t._isUTC = e._isUTC), h(e._offset) || (t._offset = e._offset), h(e._pf) || (t._pf = m(e)), h(e._locale) || (t._locale = e._locale), s > 0) for (i = 0; i < s; i++) h(n = e[r = _[i]]) || (t[r] = n);
      return t;
    }
    function w(t) {
      b(this, t), this._d = new Date(null != t._d ? t._d.getTime() : NaN), this.isValid() || (this._d = new Date(NaN)), !1 === v && (v = !0, i.updateOffset(this), v = !1);
    }
    function E(t) {
      return t instanceof w || null != t && null != t._isAMomentObject;
    }
    function S(t) {
      !1 === i.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t);
    }
    function P(t, e) {
      var r = !0;
      return d(function () {
        if (null != i.deprecationHandler && i.deprecationHandler(null, t), r) {
          var n,
            s,
            a,
            h = [],
            l = arguments.length;
          for (s = 0; s < l; s++) {
            if (n = "", "object" == typeof arguments[s]) {
              for (a in n += "\n[" + s + "] ", arguments[0]) o(arguments[0], a) && (n += a + ": " + arguments[0][a] + ", ");
              n = n.slice(0, -2);
            } else n = arguments[s];
            h.push(n);
          }
          S(t + "\nArguments: " + Array.prototype.slice.call(h).join("") + "\n" + new Error().stack), r = !1;
        }
        return e.apply(this, arguments);
      }, e);
    }
    var A,
      x = {};
    function T(t, e) {
      null != i.deprecationHandler && i.deprecationHandler(t, e), x[t] || (S(e), x[t] = !0);
    }
    function D(t) {
      return "undefined" != typeof Function && t instanceof Function || "[object Function]" === Object.prototype.toString.call(t);
    }
    function $(t) {
      var e, i;
      for (i in t) o(t, i) && (D(e = t[i]) ? this[i] = e : this["_" + i] = e);
      this._config = t, this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
    }
    function M(t, e) {
      var i,
        r = d({}, t);
      for (i in e) o(e, i) && (s(t[i]) && s(e[i]) ? (r[i] = {}, d(r[i], t[i]), d(r[i], e[i])) : null != e[i] ? r[i] = e[i] : delete r[i]);
      for (i in t) o(t, i) && !o(e, i) && s(t[i]) && (r[i] = d({}, r[i]));
      return r;
    }
    function k(t) {
      null != t && this.set(t);
    }
    i.suppressDeprecationWarnings = !1, i.deprecationHandler = null, A = Object.keys ? Object.keys : function (t) {
      var e,
        i = [];
      for (e in t) o(t, e) && i.push(e);
      return i;
    };
    var O = {
      sameDay: "[Today at] LT",
      nextDay: "[Tomorrow at] LT",
      nextWeek: "dddd [at] LT",
      lastDay: "[Yesterday at] LT",
      lastWeek: "[Last] dddd [at] LT",
      sameElse: "L"
    };
    function H(t, e, i) {
      var r = this._calendar[t] || this._calendar.sameElse;
      return D(r) ? r.call(e, i) : r;
    }
    function C(t, e, i) {
      var r = "" + Math.abs(t),
        n = e - r.length;
      return (t >= 0 ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, n)).toString().substr(1) + r;
    }
    var N = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
      I = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
      U = {},
      R = {};
    function B(t, e, i, r) {
      var n = r;
      "string" == typeof r && (n = function () {
        return this[r]();
      }), t && (R[t] = n), e && (R[e[0]] = function () {
        return C(n.apply(this, arguments), e[1], e[2]);
      }), i && (R[i] = function () {
        return this.localeData().ordinal(n.apply(this, arguments), t);
      });
    }
    function L(t) {
      return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "");
    }
    function Y(t) {
      var e,
        i,
        r = t.match(N);
      for (e = 0, i = r.length; e < i; e++) R[r[e]] ? r[e] = R[r[e]] : r[e] = L(r[e]);
      return function (e) {
        var n,
          s = "";
        for (n = 0; n < i; n++) s += D(r[n]) ? r[n].call(e, t) : r[n];
        return s;
      };
    }
    function F(t, e) {
      return t.isValid() ? (e = G(e, t.localeData()), U[e] = U[e] || Y(e), U[e](t)) : t.localeData().invalidDate();
    }
    function G(t, e) {
      var i = 5;
      function r(t) {
        return e.longDateFormat(t) || t;
      }
      for (I.lastIndex = 0; i >= 0 && I.test(t);) t = t.replace(I, r), I.lastIndex = 0, i -= 1;
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
    function z(t) {
      var e = this._longDateFormat[t],
        i = this._longDateFormat[t.toUpperCase()];
      return e || !i ? e : (this._longDateFormat[t] = i.match(N).map(function (t) {
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
      var n = this._relativeTime[i];
      return D(n) ? n(t, e, i, r) : n.replace(/%d/i, t);
    }
    function Q(t, e) {
      var i = this._relativeTime[t > 0 ? "future" : "past"];
      return D(i) ? i(e) : i.replace(/%s/i, e);
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
    function nt(t) {
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
    var st,
      ot = /\d/,
      at = /\d\d/,
      ht = /\d{3}/,
      lt = /\d{4}/,
      ct = /[+-]?\d{6}/,
      ut = /\d\d?/,
      dt = /\d\d\d\d?/,
      pt = /\d\d\d\d\d\d?/,
      ft = /\d{1,3}/,
      mt = /\d{1,4}/,
      yt = /[+-]?\d{1,6}/,
      gt = /\d+/,
      _t = /[+-]?\d+/,
      vt = /Z|[+-]\d\d:?\d\d/gi,
      bt = /Z|[+-]\d\d(?::?\d\d)?/gi,
      wt = /[+-]?\d+(\.\d{1,3})?/,
      Pt = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
      At = /^[1-9]\d?/,
      xt = /^([1-9]\d|\d)/;
    function Tt(t, e, i) {
      st[t] = D(e) ? e : function (t, r) {
        return t && i ? i : e;
      };
    }
    function Dt(t, e) {
      return o(st, t) ? st[t](e._strict, e._locale) : new RegExp($t(t));
    }
    function $t(t) {
      return Mt(t.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (t, e, i, r, n) {
        return e || i || r || n;
      }));
    }
    function Mt(t) {
      return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function kt(t) {
      return t < 0 ? Math.ceil(t) || 0 : Math.floor(t);
    }
    function Ot(t) {
      var e = +t,
        i = 0;
      return 0 !== e && isFinite(e) && (i = kt(e)), i;
    }
    st = {};
    var Ht = {};
    function Ct(t, e) {
      var i,
        r,
        n = e;
      for ("string" == typeof t && (t = [t]), l(e) && (n = function (t, i) {
        i[e] = Ot(t);
      }), r = t.length, i = 0; i < r; i++) Ht[t[i]] = n;
    }
    function Nt(t, e) {
      Ct(t, function (t, i, r, n) {
        r._w = r._w || {}, e(t, r._w, r, n);
      });
    }
    function It(t, e, i) {
      null != e && o(Ht, t) && Ht[t](e, i._a, i, t);
    }
    function Ut(t) {
      return t % 4 == 0 && t % 100 != 0 || t % 400 == 0;
    }
    var Rt = 0,
      Bt = 1,
      Lt = 2,
      Yt = 3,
      Ft = 4,
      Gt = 5,
      jt = 6,
      zt = 7,
      Vt = 8;
    function Wt(t) {
      return Ut(t) ? 366 : 365;
    }
    B("Y", 0, 0, function () {
      var t = this.year();
      return t <= 9999 ? C(t, 4) : "+" + t;
    }), B(0, ["YY", 2], 0, function () {
      return this.year() % 100;
    }), B(0, ["YYYY", 4], 0, "year"), B(0, ["YYYYY", 5], 0, "year"), B(0, ["YYYYYY", 6, !0], 0, "year"), Tt("Y", _t), Tt("YY", ut, at), Tt("YYYY", mt, lt), Tt("YYYYY", yt, ct), Tt("YYYYYY", yt, ct), Ct(["YYYYY", "YYYYYY"], Rt), Ct("YYYY", function (t, e) {
      e[Rt] = 2 === t.length ? i.parseTwoDigitYear(t) : Ot(t);
    }), Ct("YY", function (t, e) {
      e[Rt] = i.parseTwoDigitYear(t);
    }), Ct("Y", function (t, e) {
      e[Rt] = parseInt(t, 10);
    }), i.parseTwoDigitYear = function (t) {
      return Ot(t) + (Ot(t) > 68 ? 1900 : 2e3);
    };
    var Zt,
      Xt = qt("FullYear", !0);
    function Kt() {
      return Ut(this.year());
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
      var r, n, s, o, a;
      if (t.isValid() && !isNaN(i)) {
        switch (r = t._d, n = t._isUTC, e) {
          case "Milliseconds":
            return void (n ? r.setUTCMilliseconds(i) : r.setMilliseconds(i));
          case "Seconds":
            return void (n ? r.setUTCSeconds(i) : r.setSeconds(i));
          case "Minutes":
            return void (n ? r.setUTCMinutes(i) : r.setMinutes(i));
          case "Hours":
            return void (n ? r.setUTCHours(i) : r.setHours(i));
          case "Date":
            return void (n ? r.setUTCDate(i) : r.setDate(i));
          case "FullYear":
            break;
          default:
            return;
        }
        s = i, o = t.month(), a = 29 !== (a = t.date()) || 1 !== o || Ut(s) ? a : 28, n ? r.setUTCFullYear(s, o, a) : r.setFullYear(s, o, a);
      }
    }
    function te(t) {
      return D(this[t = et(t)]) ? this[t]() : this;
    }
    function ee(t, e) {
      if ("object" == typeof t) {
        var i,
          r = nt(t = it(t)),
          n = r.length;
        for (i = 0; i < n; i++) this[r[i].unit](t[r[i].unit]);
      } else if (D(this[t = et(t)])) return this[t](e);
      return this;
    }
    function ie(t, e) {
      return (t % e + e) % e;
    }
    function re(t, e) {
      if (isNaN(t) || isNaN(e)) return NaN;
      var i = ie(e, 12);
      return t += (e - i) / 12, 1 === i ? Ut(t) ? 29 : 28 : 31 - i % 7 % 2;
    }
    Zt = Array.prototype.indexOf ? Array.prototype.indexOf : function (t) {
      var e;
      for (e = 0; e < this.length; ++e) if (this[e] === t) return e;
      return -1;
    }, B("M", ["MM", 2], "Mo", function () {
      return this.month() + 1;
    }), B("MMM", 0, 0, function (t) {
      return this.localeData().monthsShort(this, t);
    }), B("MMMM", 0, 0, function (t) {
      return this.localeData().months(this, t);
    }), Tt("M", ut, At), Tt("MM", ut, at), Tt("MMM", function (t, e) {
      return e.monthsShortRegex(t);
    }), Tt("MMMM", function (t, e) {
      return e.monthsRegex(t);
    }), Ct(["M", "MM"], function (t, e) {
      e[Bt] = Ot(t) - 1;
    }), Ct(["MMM", "MMMM"], function (t, e, i, r) {
      var n = i._locale.monthsParse(t, r, i._strict);
      null != n ? e[Bt] = n : m(i).invalidMonth = t;
    });
    var ne = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
      se = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
      oe = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
      ae = Pt,
      he = Pt;
    function le(t, e) {
      return t ? n(this._months) ? this._months[t.month()] : this._months[(this._months.isFormat || oe).test(e) ? "format" : "standalone"][t.month()] : n(this._months) ? this._months : this._months.standalone;
    }
    function ce(t, e) {
      return t ? n(this._monthsShort) ? this._monthsShort[t.month()] : this._monthsShort[oe.test(e) ? "format" : "standalone"][t.month()] : n(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
    }
    function ue(t, e, i) {
      var r,
        n,
        s,
        o = t.toLocaleLowerCase();
      if (!this._monthsParse) for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], r = 0; r < 12; ++r) s = p([2e3, r]), this._shortMonthsParse[r] = this.monthsShort(s, "").toLocaleLowerCase(), this._longMonthsParse[r] = this.months(s, "").toLocaleLowerCase();
      return i ? "MMM" === e ? -1 !== (n = Zt.call(this._shortMonthsParse, o)) ? n : null : -1 !== (n = Zt.call(this._longMonthsParse, o)) ? n : null : "MMM" === e ? -1 !== (n = Zt.call(this._shortMonthsParse, o)) || -1 !== (n = Zt.call(this._longMonthsParse, o)) ? n : null : -1 !== (n = Zt.call(this._longMonthsParse, o)) || -1 !== (n = Zt.call(this._shortMonthsParse, o)) ? n : null;
    }
    function de(t, e, i) {
      var r, n, s;
      if (this._monthsParseExact) return ue.call(this, t, e, i);
      for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), r = 0; r < 12; r++) {
        if (n = p([2e3, r]), i && !this._longMonthsParse[r] && (this._longMonthsParse[r] = new RegExp("^" + this.months(n, "").replace(".", "") + "$", "i"), this._shortMonthsParse[r] = new RegExp("^" + this.monthsShort(n, "").replace(".", "") + "$", "i")), i || this._monthsParse[r] || (s = "^" + this.months(n, "") + "|^" + this.monthsShort(n, ""), this._monthsParse[r] = new RegExp(s.replace(".", ""), "i")), i && "MMMM" === e && this._longMonthsParse[r].test(t)) return r;
        if (i && "MMM" === e && this._shortMonthsParse[r].test(t)) return r;
        if (!i && this._monthsParse[r].test(t)) return r;
      }
    }
    function pe(t, e) {
      if (!t.isValid()) return t;
      if ("string" == typeof e) if (/^\d+$/.test(e)) e = Ot(e);else if (!l(e = t.localeData().monthsParse(e))) return t;
      var i = e,
        r = t.date();
      return r = r < 29 ? r : Math.min(r, re(t.year(), i)), t._isUTC ? t._d.setUTCMonth(i, r) : t._d.setMonth(i, r), t;
    }
    function fe(t) {
      return null != t ? (pe(this, t), i.updateOffset(this, !0), this) : Jt(this, "Month");
    }
    function me() {
      return re(this.year(), this.month());
    }
    function ye(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsShortStrictRegex : this._monthsShortRegex) : (o(this, "_monthsShortRegex") || (this._monthsShortRegex = ae), this._monthsShortStrictRegex && t ? this._monthsShortStrictRegex : this._monthsShortRegex);
    }
    function ge(t) {
      return this._monthsParseExact ? (o(this, "_monthsRegex") || _e.call(this), t ? this._monthsStrictRegex : this._monthsRegex) : (o(this, "_monthsRegex") || (this._monthsRegex = he), this._monthsStrictRegex && t ? this._monthsStrictRegex : this._monthsRegex);
    }
    function _e() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        r,
        n,
        s = [],
        o = [],
        a = [];
      for (e = 0; e < 12; e++) i = p([2e3, e]), r = Mt(this.monthsShort(i, "")), n = Mt(this.months(i, "")), s.push(r), o.push(n), a.push(n), a.push(r);
      s.sort(t), o.sort(t), a.sort(t), this._monthsRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._monthsShortStrictRegex = new RegExp("^(" + s.join("|") + ")", "i");
    }
    function ve(t, e, i, r, n, s, o) {
      var a;
      return t < 100 && t >= 0 ? (a = new Date(t + 400, e, i, r, n, s, o), isFinite(a.getFullYear()) && a.setFullYear(t)) : a = new Date(t, e, i, r, n, s, o), a;
    }
    function be(t) {
      var e, i;
      return t < 100 && t >= 0 ? ((i = Array.prototype.slice.call(arguments))[0] = t + 400, e = new Date(Date.UTC.apply(null, i)), isFinite(e.getUTCFullYear()) && e.setUTCFullYear(t)) : e = new Date(Date.UTC.apply(null, arguments)), e;
    }
    function we(t, e, i) {
      var r = 7 + e - i;
      return -(7 + be(t, 0, r).getUTCDay() - e) % 7 + r - 1;
    }
    function Ee(t, e, i, r, n) {
      var s,
        o,
        a = 1 + 7 * (e - 1) + (7 + i - r) % 7 + we(t, r, n);
      return a <= 0 ? o = Wt(s = t - 1) + a : a > Wt(t) ? (s = t + 1, o = a - Wt(t)) : (s = t, o = a), {
        year: s,
        dayOfYear: o
      };
    }
    function Se(t, e, i) {
      var r,
        n,
        s = we(t.year(), e, i),
        o = Math.floor((t.dayOfYear() - s - 1) / 7) + 1;
      return o < 1 ? r = o + Pe(n = t.year() - 1, e, i) : o > Pe(t.year(), e, i) ? (r = o - Pe(t.year(), e, i), n = t.year() + 1) : (n = t.year(), r = o), {
        week: r,
        year: n
      };
    }
    function Pe(t, e, i) {
      var r = we(t, e, i),
        n = we(t + 1, e, i);
      return (Wt(t) - r + n) / 7;
    }
    function Ae(t) {
      return Se(t, this._week.dow, this._week.doy).week;
    }
    B("w", ["ww", 2], "wo", "week"), B("W", ["WW", 2], "Wo", "isoWeek"), Tt("w", ut, At), Tt("ww", ut, at), Tt("W", ut, At), Tt("WW", ut, at), Nt(["w", "ww", "W", "WW"], function (t, e, i, r) {
      e[r.substr(0, 1)] = Ot(t);
    });
    var xe = {
      dow: 0,
      doy: 6
    };
    function Te() {
      return this._week.dow;
    }
    function De() {
      return this._week.doy;
    }
    function $e(t) {
      var e = this.localeData().week(this);
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function Me(t) {
      var e = Se(this, 1, 4).week;
      return null == t ? e : this.add(7 * (t - e), "d");
    }
    function ke(t, e) {
      return "string" != typeof t ? t : isNaN(t) ? "number" == typeof (t = e.weekdaysParse(t)) ? t : null : parseInt(t, 10);
    }
    function Oe(t, e) {
      return "string" == typeof t ? e.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t;
    }
    function He(t, e) {
      return t.slice(e, 7).concat(t.slice(0, e));
    }
    B("d", 0, "do", "day"), B("dd", 0, 0, function (t) {
      return this.localeData().weekdaysMin(this, t);
    }), B("ddd", 0, 0, function (t) {
      return this.localeData().weekdaysShort(this, t);
    }), B("dddd", 0, 0, function (t) {
      return this.localeData().weekdays(this, t);
    }), B("e", 0, 0, "weekday"), B("E", 0, 0, "isoWeekday"), Tt("d", ut), Tt("e", ut), Tt("E", ut), Tt("dd", function (t, e) {
      return e.weekdaysMinRegex(t);
    }), Tt("ddd", function (t, e) {
      return e.weekdaysShortRegex(t);
    }), Tt("dddd", function (t, e) {
      return e.weekdaysRegex(t);
    }), Nt(["dd", "ddd", "dddd"], function (t, e, i, r) {
      var n = i._locale.weekdaysParse(t, r, i._strict);
      null != n ? e.d = n : m(i).invalidWeekday = t;
    }), Nt(["d", "e", "E"], function (t, e, i, r) {
      e[r] = Ot(t);
    });
    var Ce = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
      Ne = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
      Ie = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
      Ue = Pt,
      Re = Pt,
      Be = Pt;
    function Le(t, e) {
      var i = n(this._weekdays) ? this._weekdays : this._weekdays[t && !0 !== t && this._weekdays.isFormat.test(e) ? "format" : "standalone"];
      return !0 === t ? He(i, this._week.dow) : t ? i[t.day()] : i;
    }
    function Ye(t) {
      return !0 === t ? He(this._weekdaysShort, this._week.dow) : t ? this._weekdaysShort[t.day()] : this._weekdaysShort;
    }
    function Fe(t) {
      return !0 === t ? He(this._weekdaysMin, this._week.dow) : t ? this._weekdaysMin[t.day()] : this._weekdaysMin;
    }
    function Ge(t, e, i) {
      var r,
        n,
        s,
        o = t.toLocaleLowerCase();
      if (!this._weekdaysParse) for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], r = 0; r < 7; ++r) s = p([2e3, 1]).day(r), this._minWeekdaysParse[r] = this.weekdaysMin(s, "").toLocaleLowerCase(), this._shortWeekdaysParse[r] = this.weekdaysShort(s, "").toLocaleLowerCase(), this._weekdaysParse[r] = this.weekdays(s, "").toLocaleLowerCase();
      return i ? "dddd" === e ? -1 !== (n = Zt.call(this._weekdaysParse, o)) ? n : null : "ddd" === e ? -1 !== (n = Zt.call(this._shortWeekdaysParse, o)) ? n : null : -1 !== (n = Zt.call(this._minWeekdaysParse, o)) ? n : null : "dddd" === e ? -1 !== (n = Zt.call(this._weekdaysParse, o)) || -1 !== (n = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (n = Zt.call(this._minWeekdaysParse, o)) ? n : null : "ddd" === e ? -1 !== (n = Zt.call(this._shortWeekdaysParse, o)) || -1 !== (n = Zt.call(this._weekdaysParse, o)) || -1 !== (n = Zt.call(this._minWeekdaysParse, o)) ? n : null : -1 !== (n = Zt.call(this._minWeekdaysParse, o)) || -1 !== (n = Zt.call(this._weekdaysParse, o)) || -1 !== (n = Zt.call(this._shortWeekdaysParse, o)) ? n : null;
    }
    function je(t, e, i) {
      var r, n, s;
      if (this._weekdaysParseExact) return Ge.call(this, t, e, i);
      for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), r = 0; r < 7; r++) {
        if (n = p([2e3, 1]).day(r), i && !this._fullWeekdaysParse[r] && (this._fullWeekdaysParse[r] = new RegExp("^" + this.weekdays(n, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[r] = new RegExp("^" + this.weekdaysShort(n, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[r] = new RegExp("^" + this.weekdaysMin(n, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[r] || (s = "^" + this.weekdays(n, "") + "|^" + this.weekdaysShort(n, "") + "|^" + this.weekdaysMin(n, ""), this._weekdaysParse[r] = new RegExp(s.replace(".", ""), "i")), i && "dddd" === e && this._fullWeekdaysParse[r].test(t)) return r;
        if (i && "ddd" === e && this._shortWeekdaysParse[r].test(t)) return r;
        if (i && "dd" === e && this._minWeekdaysParse[r].test(t)) return r;
        if (!i && this._weekdaysParse[r].test(t)) return r;
      }
    }
    function ze(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = Jt(this, "Day");
      return null != t ? (t = ke(t, this.localeData()), this.add(t - e, "d")) : e;
    }
    function Ve(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      var e = (this.day() + 7 - this.localeData()._week.dow) % 7;
      return null == t ? e : this.add(t - e, "d");
    }
    function We(t) {
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        var e = Oe(t, this.localeData());
        return this.day(this.day() % 7 ? e : e - 7);
      }
      return this.day() || 7;
    }
    function Ze(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysStrictRegex : this._weekdaysRegex) : (o(this, "_weekdaysRegex") || (this._weekdaysRegex = Ue), this._weekdaysStrictRegex && t ? this._weekdaysStrictRegex : this._weekdaysRegex);
    }
    function Xe(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (o(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = Re), this._weekdaysShortStrictRegex && t ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
    }
    function Ke(t) {
      return this._weekdaysParseExact ? (o(this, "_weekdaysRegex") || qe.call(this), t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (o(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Be), this._weekdaysMinStrictRegex && t ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
    }
    function qe() {
      function t(t, e) {
        return e.length - t.length;
      }
      var e,
        i,
        r,
        n,
        s,
        o = [],
        a = [],
        h = [],
        l = [];
      for (e = 0; e < 7; e++) i = p([2e3, 1]).day(e), r = Mt(this.weekdaysMin(i, "")), n = Mt(this.weekdaysShort(i, "")), s = Mt(this.weekdays(i, "")), o.push(r), a.push(n), h.push(s), l.push(r), l.push(n), l.push(s);
      o.sort(t), a.sort(t), h.sort(t), l.sort(t), this._weekdaysRegex = new RegExp("^(" + l.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp("^(" + h.join("|") + ")", "i"), this._weekdaysShortStrictRegex = new RegExp("^(" + a.join("|") + ")", "i"), this._weekdaysMinStrictRegex = new RegExp("^(" + o.join("|") + ")", "i");
    }
    function Je() {
      return this.hours() % 12 || 12;
    }
    function Qe() {
      return this.hours() || 24;
    }
    function ti(t, e) {
      B(t, 0, 0, function () {
        return this.localeData().meridiem(this.hours(), this.minutes(), e);
      });
    }
    function ei(t, e) {
      return e._meridiemParse;
    }
    function ii(t) {
      return "p" === (t + "").toLowerCase().charAt(0);
    }
    B("H", ["HH", 2], 0, "hour"), B("h", ["hh", 2], 0, Je), B("k", ["kk", 2], 0, Qe), B("hmm", 0, 0, function () {
      return "" + Je.apply(this) + C(this.minutes(), 2);
    }), B("hmmss", 0, 0, function () {
      return "" + Je.apply(this) + C(this.minutes(), 2) + C(this.seconds(), 2);
    }), B("Hmm", 0, 0, function () {
      return "" + this.hours() + C(this.minutes(), 2);
    }), B("Hmmss", 0, 0, function () {
      return "" + this.hours() + C(this.minutes(), 2) + C(this.seconds(), 2);
    }), ti("a", !0), ti("A", !1), Tt("a", ei), Tt("A", ei), Tt("H", ut, xt), Tt("h", ut, At), Tt("k", ut, At), Tt("HH", ut, at), Tt("hh", ut, at), Tt("kk", ut, at), Tt("hmm", dt), Tt("hmmss", pt), Tt("Hmm", dt), Tt("Hmmss", pt), Ct(["H", "HH"], Yt), Ct(["k", "kk"], function (t, e, i) {
      var r = Ot(t);
      e[Yt] = 24 === r ? 0 : r;
    }), Ct(["a", "A"], function (t, e, i) {
      i._isPm = i._locale.isPM(t), i._meridiem = t;
    }), Ct(["h", "hh"], function (t, e, i) {
      e[Yt] = Ot(t), m(i).bigHour = !0;
    }), Ct("hmm", function (t, e, i) {
      var r = t.length - 2;
      e[Yt] = Ot(t.substr(0, r)), e[Ft] = Ot(t.substr(r)), m(i).bigHour = !0;
    }), Ct("hmmss", function (t, e, i) {
      var r = t.length - 4,
        n = t.length - 2;
      e[Yt] = Ot(t.substr(0, r)), e[Ft] = Ot(t.substr(r, 2)), e[Gt] = Ot(t.substr(n)), m(i).bigHour = !0;
    }), Ct("Hmm", function (t, e, i) {
      var r = t.length - 2;
      e[Yt] = Ot(t.substr(0, r)), e[Ft] = Ot(t.substr(r));
    }), Ct("Hmmss", function (t, e, i) {
      var r = t.length - 4,
        n = t.length - 2;
      e[Yt] = Ot(t.substr(0, r)), e[Ft] = Ot(t.substr(r, 2)), e[Gt] = Ot(t.substr(n));
    });
    var ri = /[ap]\.?m?\.?/i,
      ni = qt("Hours", !0);
    function si(t, e, i) {
      return t > 11 ? i ? "pm" : "PM" : i ? "am" : "AM";
    }
    var oi,
      ai = {
        calendar: O,
        longDateFormat: j,
        invalidDate: V,
        ordinal: Z,
        dayOfMonthOrdinalParse: X,
        relativeTime: q,
        months: ne,
        monthsShort: se,
        week: xe,
        weekdays: Ce,
        weekdaysMin: Ie,
        weekdaysShort: Ne,
        meridiemParse: ri
      },
      hi = {},
      li = {};
    function ci(t, e) {
      var i,
        r = Math.min(t.length, e.length);
      for (i = 0; i < r; i += 1) if (t[i] !== e[i]) return i;
      return r;
    }
    function ui(t) {
      return t ? t.toLowerCase().replace("_", "-") : t;
    }
    function di(t) {
      for (var e, i, r, n, s = 0; s < t.length;) {
        for (e = (n = ui(t[s]).split("-")).length, i = (i = ui(t[s + 1])) ? i.split("-") : null; e > 0;) {
          if (r = fi(n.slice(0, e).join("-"))) return r;
          if (i && i.length >= e && ci(n, i) >= e - 1) break;
          e--;
        }
        s++;
      }
      return oi;
    }
    function pi(t) {
      return !(!t || !t.match("^[^/\\\\]*$"));
    }
    function fi(t) {
      var e = null;
      if (void 0 === hi[t] && St && St.exports && pi(t)) try {
        e = oi._abbr, Et("./locale/" + t), mi(e);
      } catch (e) {
        hi[t] = null;
      }
      return hi[t];
    }
    function mi(t, e) {
      var i;
      return t && ((i = h(e) ? _i(t) : yi(t, e)) ? oi = i : "undefined" != typeof console && console.warn && console.warn("Locale " + t + " not found. Did you forget to load it?")), oi._abbr;
    }
    function yi(t, e) {
      if (null !== e) {
        var i,
          r = ai;
        if (e.abbr = t, null != hi[t]) T("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), r = hi[t]._config;else if (null != e.parentLocale) if (null != hi[e.parentLocale]) r = hi[e.parentLocale]._config;else {
          if (null == (i = fi(e.parentLocale))) return li[e.parentLocale] || (li[e.parentLocale] = []), li[e.parentLocale].push({
            name: t,
            config: e
          }), null;
          r = i._config;
        }
        return hi[t] = new k(M(r, e)), li[t] && li[t].forEach(function (t) {
          yi(t.name, t.config);
        }), mi(t), hi[t];
      }
      return delete hi[t], null;
    }
    function gi(t, e) {
      if (null != e) {
        var i,
          r,
          n = ai;
        null != hi[t] && null != hi[t].parentLocale ? hi[t].set(M(hi[t]._config, e)) : (null != (r = fi(t)) && (n = r._config), e = M(n, e), null == r && (e.abbr = t), (i = new k(e)).parentLocale = hi[t], hi[t] = i), mi(t);
      } else null != hi[t] && (null != hi[t].parentLocale ? (hi[t] = hi[t].parentLocale, t === mi() && mi(t)) : null != hi[t] && delete hi[t]);
      return hi[t];
    }
    function _i(t) {
      var e;
      if (t && t._locale && t._locale._abbr && (t = t._locale._abbr), !t) return oi;
      if (!n(t)) {
        if (e = fi(t)) return e;
        t = [t];
      }
      return di(t);
    }
    function vi() {
      return A(hi);
    }
    function bi(t) {
      var e,
        i = t._a;
      return i && -2 === m(t).overflow && (e = i[Bt] < 0 || i[Bt] > 11 ? Bt : i[Lt] < 1 || i[Lt] > re(i[Rt], i[Bt]) ? Lt : i[Yt] < 0 || i[Yt] > 24 || 24 === i[Yt] && (0 !== i[Ft] || 0 !== i[Gt] || 0 !== i[jt]) ? Yt : i[Ft] < 0 || i[Ft] > 59 ? Ft : i[Gt] < 0 || i[Gt] > 59 ? Gt : i[jt] < 0 || i[jt] > 999 ? jt : -1, m(t)._overflowDayOfYear && (e < Rt || e > Lt) && (e = Lt), m(t)._overflowWeeks && -1 === e && (e = zt), m(t)._overflowWeekday && -1 === e && (e = Vt), m(t).overflow = e), t;
    }
    var wi = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      Ei = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
      Si = /Z|[+-]\d\d(?::?\d\d)?/,
      Pi = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/], ["YYYYMM", /\d{6}/, !1], ["YYYY", /\d{4}/, !1]],
      Ai = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]],
      xi = /^\/?Date\((-?\d+)/i,
      Ti = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
      Di = {
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
    function $i(t) {
      var e,
        i,
        r,
        n,
        s,
        o,
        a = t._i,
        h = wi.exec(a) || Ei.exec(a),
        l = Pi.length,
        c = Ai.length;
      if (h) {
        for (m(t).iso = !0, e = 0, i = l; e < i; e++) if (Pi[e][1].exec(h[1])) {
          n = Pi[e][0], r = !1 !== Pi[e][2];
          break;
        }
        if (null == n) return void (t._isValid = !1);
        if (h[3]) {
          for (e = 0, i = c; e < i; e++) if (Ai[e][1].exec(h[3])) {
            s = (h[2] || " ") + Ai[e][0];
            break;
          }
          if (null == s) return void (t._isValid = !1);
        }
        if (!r && null != s) return void (t._isValid = !1);
        if (h[4]) {
          if (!Si.exec(h[4])) return void (t._isValid = !1);
          o = "Z";
        }
        t._f = n + (s || "") + (o || ""), Yi(t);
      } else t._isValid = !1;
    }
    function Mi(t, e, i, r, n, s) {
      var o = [ki(t), se.indexOf(e), parseInt(i, 10), parseInt(r, 10), parseInt(n, 10)];
      return s && o.push(parseInt(s, 10)), o;
    }
    function ki(t) {
      var e = parseInt(t, 10);
      return e <= 49 ? 2e3 + e : e <= 999 ? 1900 + e : e;
    }
    function Oi(t) {
      return t.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
    }
    function Hi(t, e, i) {
      return !t || Ne.indexOf(t) === new Date(e[0], e[1], e[2]).getDay() || (m(i).weekdayMismatch = !0, i._isValid = !1, !1);
    }
    function Ci(t, e, i) {
      if (t) return Di[t];
      if (e) return 0;
      var r = parseInt(i, 10),
        n = r % 100;
      return (r - n) / 100 * 60 + n;
    }
    function Ni(t) {
      var e,
        i = Ti.exec(Oi(t._i));
      if (i) {
        if (e = Mi(i[4], i[3], i[2], i[5], i[6], i[7]), !Hi(i[1], e, t)) return;
        t._a = e, t._tzm = Ci(i[8], i[9], i[10]), t._d = be.apply(null, t._a), t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), m(t).rfc2822 = !0;
      } else t._isValid = !1;
    }
    function Ii(t) {
      var e = xi.exec(t._i);
      null === e ? ($i(t), !1 === t._isValid && (delete t._isValid, Ni(t), !1 === t._isValid && (delete t._isValid, t._strict ? t._isValid = !1 : i.createFromInputFallback(t)))) : t._d = new Date(+e[1]);
    }
    function Ui(t, e, i) {
      return null != t ? t : null != e ? e : i;
    }
    function Ri(t) {
      var e = new Date(i.now());
      return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()];
    }
    function Bi(t) {
      var e,
        i,
        r,
        n,
        s,
        o = [];
      if (!t._d) {
        for (r = Ri(t), t._w && null == t._a[Lt] && null == t._a[Bt] && Li(t), null != t._dayOfYear && (s = Ui(t._a[Rt], r[Rt]), (t._dayOfYear > Wt(s) || 0 === t._dayOfYear) && (m(t)._overflowDayOfYear = !0), i = be(s, 0, t._dayOfYear), t._a[Bt] = i.getUTCMonth(), t._a[Lt] = i.getUTCDate()), e = 0; e < 3 && null == t._a[e]; ++e) t._a[e] = o[e] = r[e];
        for (; e < 7; e++) t._a[e] = o[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
        24 === t._a[Yt] && 0 === t._a[Ft] && 0 === t._a[Gt] && 0 === t._a[jt] && (t._nextDay = !0, t._a[Yt] = 0), t._d = (t._useUTC ? be : ve).apply(null, o), n = t._useUTC ? t._d.getUTCDay() : t._d.getDay(), null != t._tzm && t._d.setUTCMinutes(t._d.getUTCMinutes() - t._tzm), t._nextDay && (t._a[Yt] = 24), t._w && void 0 !== t._w.d && t._w.d !== n && (m(t).weekdayMismatch = !0);
      }
    }
    function Li(t) {
      var e, i, r, n, s, o, a, h, l;
      null != (e = t._w).GG || null != e.W || null != e.E ? (s = 1, o = 4, i = Ui(e.GG, t._a[Rt], Se(Xi(), 1, 4).year), r = Ui(e.W, 1), ((n = Ui(e.E, 1)) < 1 || n > 7) && (h = !0)) : (s = t._locale._week.dow, o = t._locale._week.doy, l = Se(Xi(), s, o), i = Ui(e.gg, t._a[Rt], l.year), r = Ui(e.w, l.week), null != e.d ? ((n = e.d) < 0 || n > 6) && (h = !0) : null != e.e ? (n = e.e + s, (e.e < 0 || e.e > 6) && (h = !0)) : n = s), r < 1 || r > Pe(i, s, o) ? m(t)._overflowWeeks = !0 : null != h ? m(t)._overflowWeekday = !0 : (a = Ee(i, r, n, s, o), t._a[Rt] = a.year, t._dayOfYear = a.dayOfYear);
    }
    function Yi(t) {
      if (t._f !== i.ISO_8601) {
        if (t._f !== i.RFC_2822) {
          t._a = [], m(t).empty = !0;
          var e,
            r,
            n,
            s,
            o,
            a,
            h,
            l = "" + t._i,
            c = l.length,
            u = 0;
          for (h = (n = G(t._f, t._locale).match(N) || []).length, e = 0; e < h; e++) s = n[e], (r = (l.match(Dt(s, t)) || [])[0]) && ((o = l.substr(0, l.indexOf(r))).length > 0 && m(t).unusedInput.push(o), l = l.slice(l.indexOf(r) + r.length), u += r.length), R[s] ? (r ? m(t).empty = !1 : m(t).unusedTokens.push(s), It(s, r, t)) : t._strict && !r && m(t).unusedTokens.push(s);
          m(t).charsLeftOver = c - u, l.length > 0 && m(t).unusedInput.push(l), t._a[Yt] <= 12 && !0 === m(t).bigHour && t._a[Yt] > 0 && (m(t).bigHour = void 0), m(t).parsedDateParts = t._a.slice(0), m(t).meridiem = t._meridiem, t._a[Yt] = Fi(t._locale, t._a[Yt], t._meridiem), null !== (a = m(t).era) && (t._a[Rt] = t._locale.erasConvertYear(a, t._a[Rt])), Bi(t), bi(t);
        } else Ni(t);
      } else $i(t);
    }
    function Fi(t, e, i) {
      var r;
      return null == i ? e : null != t.meridiemHour ? t.meridiemHour(e, i) : null != t.isPM ? ((r = t.isPM(i)) && e < 12 && (e += 12), r || 12 !== e || (e = 0), e) : e;
    }
    function Gi(t) {
      var e,
        i,
        r,
        n,
        s,
        o,
        a = !1,
        h = t._f.length;
      if (0 === h) return m(t).invalidFormat = !0, void (t._d = new Date(NaN));
      for (n = 0; n < h; n++) s = 0, o = !1, e = b({}, t), null != t._useUTC && (e._useUTC = t._useUTC), e._f = t._f[n], Yi(e), y(e) && (o = !0), s += m(e).charsLeftOver, s += 10 * m(e).unusedTokens.length, m(e).score = s, a ? s < r && (r = s, i = e) : (null == r || s < r || o) && (r = s, i = e, o && (a = !0));
      d(t, i || e);
    }
    function ji(t) {
      if (!t._d) {
        var e = it(t._i),
          i = void 0 === e.day ? e.date : e.day;
        t._a = u([e.year, e.month, i, e.hour, e.minute, e.second, e.millisecond], function (t) {
          return t && parseInt(t, 10);
        }), Bi(t);
      }
    }
    function zi(t) {
      var e = new w(bi(Vi(t)));
      return e._nextDay && (e.add(1, "d"), e._nextDay = void 0), e;
    }
    function Vi(t) {
      var e = t._i,
        i = t._f;
      return t._locale = t._locale || _i(t._l), null === e || void 0 === i && "" === e ? g({
        nullInput: !0
      }) : ("string" == typeof e && (t._i = e = t._locale.preparse(e)), E(e) ? new w(bi(e)) : (c(e) ? t._d = e : n(i) ? Gi(t) : i ? Yi(t) : Wi(t), y(t) || (t._d = null), t));
    }
    function Wi(t) {
      var e = t._i;
      h(e) ? t._d = new Date(i.now()) : c(e) ? t._d = new Date(e.valueOf()) : "string" == typeof e ? Ii(t) : n(e) ? (t._a = u(e.slice(0), function (t) {
        return parseInt(t, 10);
      }), Bi(t)) : s(e) ? ji(t) : l(e) ? t._d = new Date(e) : i.createFromInputFallback(t);
    }
    function Zi(t, e, i, r, o) {
      var h = {};
      return !0 !== e && !1 !== e || (r = e, e = void 0), !0 !== i && !1 !== i || (r = i, i = void 0), (s(t) && a(t) || n(t) && 0 === t.length) && (t = void 0), h._isAMomentObject = !0, h._useUTC = h._isUTC = o, h._l = i, h._i = t, h._f = e, h._strict = r, zi(h);
    }
    function Xi(t, e, i, r) {
      return Zi(t, e, i, r, !1);
    }
    i.createFromInputFallback = P("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function (t) {
      t._d = new Date(t._i + (t._useUTC ? " UTC" : ""));
    }), i.ISO_8601 = function () {}, i.RFC_2822 = function () {};
    var Ki = P("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Xi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t < this ? this : t : g();
      }),
      qi = P("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function () {
        var t = Xi.apply(null, arguments);
        return this.isValid() && t.isValid() ? t > this ? this : t : g();
      });
    function Ji(t, e) {
      var i, r;
      if (1 === e.length && n(e[0]) && (e = e[0]), !e.length) return Xi();
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
        n = ir.length;
      for (e in t) if (o(t, e) && (-1 === Zt.call(ir, e) || null != t[e] && isNaN(t[e]))) return !1;
      for (i = 0; i < n; ++i) if (t[ir[i]]) {
        if (r) return !1;
        parseFloat(t[ir[i]]) !== Ot(t[ir[i]]) && (r = !0);
      }
      return !0;
    }
    function nr() {
      return this._isValid;
    }
    function sr() {
      return Dr(NaN);
    }
    function or(t) {
      var e = it(t),
        i = e.year || 0,
        r = e.quarter || 0,
        n = e.month || 0,
        s = e.week || e.isoWeek || 0,
        o = e.day || 0,
        a = e.hour || 0,
        h = e.minute || 0,
        l = e.second || 0,
        c = e.millisecond || 0;
      this._isValid = rr(e), this._milliseconds = +c + 1e3 * l + 6e4 * h + 1e3 * a * 60 * 60, this._days = +o + 7 * s, this._months = +n + 3 * r + 12 * i, this._data = {}, this._locale = _i(), this._bubble();
    }
    function ar(t) {
      return t instanceof or;
    }
    function hr(t) {
      return t < 0 ? -1 * Math.round(-1 * t) : Math.round(t);
    }
    function lr(t, e, i) {
      var r,
        n = Math.min(t.length, e.length),
        s = Math.abs(t.length - e.length),
        o = 0;
      for (r = 0; r < n; r++) (i && t[r] !== e[r] || !i && Ot(t[r]) !== Ot(e[r])) && o++;
      return o + s;
    }
    function cr(t, e) {
      B(t, 0, 0, function () {
        var t = this.utcOffset(),
          i = "+";
        return t < 0 && (t = -t, i = "-"), i + C(~~(t / 60), 2) + e + C(~~t % 60, 2);
      });
    }
    cr("Z", ":"), cr("ZZ", ""), Tt("Z", bt), Tt("ZZ", bt), Ct(["Z", "ZZ"], function (t, e, i) {
      i._useUTC = !0, i._tzm = dr(bt, t);
    });
    var ur = /([\+\-]|\d\d)/gi;
    function dr(t, e) {
      var i,
        r,
        n = (e || "").match(t);
      return null === n ? null : 0 === (r = 60 * (i = ((n[n.length - 1] || []) + "").match(ur) || ["-", 0, 0])[1] + Ot(i[2])) ? 0 : "+" === i[0] ? r : -r;
    }
    function pr(t, e) {
      var r, n;
      return e._isUTC ? (r = e.clone(), n = (E(t) || c(t) ? t.valueOf() : Xi(t).valueOf()) - r.valueOf(), r._d.setTime(r._d.valueOf() + n), i.updateOffset(r, !1), r) : Xi(t).local();
    }
    function fr(t) {
      return -Math.round(t._d.getTimezoneOffset());
    }
    function mr(t, e, r) {
      var n,
        s = this._offset || 0;
      if (!this.isValid()) return null != t ? this : NaN;
      if (null != t) {
        if ("string" == typeof t) {
          if (null === (t = dr(bt, t))) return this;
        } else Math.abs(t) < 16 && !r && (t *= 60);
        return !this._isUTC && e && (n = fr(this)), this._offset = t, this._isUTC = !0, null != n && this.add(n, "m"), s !== t && (!e || this._changeInProgress ? Hr(this, Dr(t - s, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, i.updateOffset(this, !0), this._changeInProgress = null)), this;
      }
      return this._isUTC ? s : fr(this);
    }
    function yr(t, e) {
      return null != t ? ("string" != typeof t && (t = -t), this.utcOffset(t, e), this) : -this.utcOffset();
    }
    function gr(t) {
      return this.utcOffset(0, t);
    }
    function _r(t) {
      return this._isUTC && (this.utcOffset(0, t), this._isUTC = !1, t && this.subtract(fr(this), "m")), this;
    }
    function vr() {
      if (null != this._tzm) this.utcOffset(this._tzm, !1, !0);else if ("string" == typeof this._i) {
        var t = dr(vt, this._i);
        null != t ? this.utcOffset(t) : this.utcOffset(0, !0);
      }
      return this;
    }
    function br(t) {
      return !!this.isValid() && (t = t ? Xi(t).utcOffset() : 0, (this.utcOffset() - t) % 60 == 0);
    }
    function wr() {
      return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function Er() {
      if (!h(this._isDSTShifted)) return this._isDSTShifted;
      var t,
        e = {};
      return b(e, this), (e = Vi(e))._a ? (t = e._isUTC ? p(e._a) : Xi(e._a), this._isDSTShifted = this.isValid() && lr(e._a, t.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
    }
    function Sr() {
      return !!this.isValid() && !this._isUTC;
    }
    function Pr() {
      return !!this.isValid() && this._isUTC;
    }
    function Ar() {
      return !!this.isValid() && this._isUTC && 0 === this._offset;
    }
    i.updateOffset = function () {};
    var xr = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
      Tr = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
    function Dr(t, e) {
      var i,
        r,
        n,
        s = t,
        a = null;
      return ar(t) ? s = {
        ms: t._milliseconds,
        d: t._days,
        M: t._months
      } : l(t) || !isNaN(+t) ? (s = {}, e ? s[e] = +t : s.milliseconds = +t) : (a = xr.exec(t)) ? (i = "-" === a[1] ? -1 : 1, s = {
        y: 0,
        d: Ot(a[Lt]) * i,
        h: Ot(a[Yt]) * i,
        m: Ot(a[Ft]) * i,
        s: Ot(a[Gt]) * i,
        ms: Ot(hr(1e3 * a[jt])) * i
      }) : (a = Tr.exec(t)) ? (i = "-" === a[1] ? -1 : 1, s = {
        y: $r(a[2], i),
        M: $r(a[3], i),
        w: $r(a[4], i),
        d: $r(a[5], i),
        h: $r(a[6], i),
        m: $r(a[7], i),
        s: $r(a[8], i)
      }) : null == s ? s = {} : "object" == typeof s && ("from" in s || "to" in s) && (n = kr(Xi(s.from), Xi(s.to)), (s = {}).ms = n.milliseconds, s.M = n.months), r = new or(s), ar(t) && o(t, "_locale") && (r._locale = t._locale), ar(t) && o(t, "_isValid") && (r._isValid = t._isValid), r;
    }
    function $r(t, e) {
      var i = t && parseFloat(t.replace(",", "."));
      return (isNaN(i) ? 0 : i) * e;
    }
    function Mr(t, e) {
      var i = {};
      return i.months = e.month() - t.month() + 12 * (e.year() - t.year()), t.clone().add(i.months, "M").isAfter(e) && --i.months, i.milliseconds = +e - +t.clone().add(i.months, "M"), i;
    }
    function kr(t, e) {
      var i;
      return t.isValid() && e.isValid() ? (e = pr(e, t), t.isBefore(e) ? i = Mr(t, e) : ((i = Mr(e, t)).milliseconds = -i.milliseconds, i.months = -i.months), i) : {
        milliseconds: 0,
        months: 0
      };
    }
    function Or(t, e) {
      return function (i, r) {
        var n;
        return null === r || isNaN(+r) || (T(e, "moment()." + e + "(period, number) is deprecated. Please use moment()." + e + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), n = i, i = r, r = n), Hr(this, Dr(i, r), t), this;
      };
    }
    function Hr(t, e, r, n) {
      var s = e._milliseconds,
        o = hr(e._days),
        a = hr(e._months);
      t.isValid() && (n = n ?? !0, a && pe(t, Jt(t, "Month") + a * r), o && Qt(t, "Date", Jt(t, "Date") + o * r), s && t._d.setTime(t._d.valueOf() + s * r), n && i.updateOffset(t, o || a));
    }
    Dr.fn = or.prototype, Dr.invalid = sr;
    var Cr = Or(1, "add"),
      Nr = Or(-1, "subtract");
    function Ir(t) {
      return "string" == typeof t || t instanceof String;
    }
    function Ur(t) {
      return E(t) || c(t) || Ir(t) || l(t) || Br(t) || Rr(t) || null == t;
    }
    function Rr(t) {
      var e,
        i,
        r = s(t) && !a(t),
        n = !1,
        h = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"],
        l = h.length;
      for (e = 0; e < l; e += 1) i = h[e], n = n || o(t, i);
      return r && n;
    }
    function Br(t) {
      var e = n(t),
        i = !1;
      return e && (i = 0 === t.filter(function (e) {
        return !l(e) && Ir(t);
      }).length), e && i;
    }
    function Lr(t) {
      var e,
        i,
        r = s(t) && !a(t),
        n = !1,
        h = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"];
      for (e = 0; e < h.length; e += 1) i = h[e], n = n || o(t, i);
      return r && n;
    }
    function Yr(t, e) {
      var i = t.diff(e, "days", !0);
      return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
    }
    function Fr(t, e) {
      1 === arguments.length && (arguments[0] ? Ur(arguments[0]) ? (t = arguments[0], e = void 0) : Lr(arguments[0]) && (e = arguments[0], t = void 0) : (t = void 0, e = void 0));
      var r = t || Xi(),
        n = pr(r, this).startOf("day"),
        s = i.calendarFormat(this, n) || "sameElse",
        o = e && (D(e[s]) ? e[s].call(this, r) : e[s]);
      return this.format(o || this.localeData().calendar(s, this, Xi(r)));
    }
    function Gr() {
      return new w(this);
    }
    function jr(t, e) {
      var i = E(t) ? t : Xi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(e).valueOf());
    }
    function zr(t, e) {
      var i = E(t) ? t : Xi(t);
      return !(!this.isValid() || !i.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(e).valueOf() < i.valueOf());
    }
    function Vr(t, e, i, r) {
      var n = E(t) ? t : Xi(t),
        s = E(e) ? e : Xi(e);
      return !!(this.isValid() && n.isValid() && s.isValid()) && ("(" === (r = r || "()")[0] ? this.isAfter(n, i) : !this.isBefore(n, i)) && (")" === r[1] ? this.isBefore(s, i) : !this.isAfter(s, i));
    }
    function Wr(t, e) {
      var i,
        r = E(t) ? t : Xi(t);
      return !(!this.isValid() || !r.isValid()) && ("millisecond" === (e = et(e) || "millisecond") ? this.valueOf() === r.valueOf() : (i = r.valueOf(), this.clone().startOf(e).valueOf() <= i && i <= this.clone().endOf(e).valueOf()));
    }
    function Zr(t, e) {
      return this.isSame(t, e) || this.isAfter(t, e);
    }
    function Xr(t, e) {
      return this.isSame(t, e) || this.isBefore(t, e);
    }
    function Kr(t, e, i) {
      var r, n, s;
      if (!this.isValid()) return NaN;
      if (!(r = pr(t, this)).isValid()) return NaN;
      switch (n = 6e4 * (r.utcOffset() - this.utcOffset()), e = et(e)) {
        case "year":
          s = qr(this, r) / 12;
          break;
        case "month":
          s = qr(this, r);
          break;
        case "quarter":
          s = qr(this, r) / 3;
          break;
        case "second":
          s = (this - r) / 1e3;
          break;
        case "minute":
          s = (this - r) / 6e4;
          break;
        case "hour":
          s = (this - r) / 36e5;
          break;
        case "day":
          s = (this - r - n) / 864e5;
          break;
        case "week":
          s = (this - r - n) / 6048e5;
          break;
        default:
          s = this - r;
      }
      return i ? s : kt(s);
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
      return i.year() < 0 || i.year() > 9999 ? F(i, e ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : D(Date.prototype.toISOString) ? e ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", F(i, "Z")) : F(i, e ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
    }
    function tn() {
      if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
      var t,
        e,
        i,
        r,
        n = "moment",
        s = "";
      return this.isLocal() || (n = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", s = "Z"), t = "[" + n + '("]', e = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = "-MM-DD[T]HH:mm:ss.SSS", r = s + '[")]', this.format(t + e + i + r);
    }
    function en(t) {
      t || (t = this.isUtc() ? i.defaultFormatUtc : i.defaultFormat);
      var e = F(this, t);
      return this.localeData().postformat(e);
    }
    function rn(t, e) {
      return this.isValid() && (E(t) && t.isValid() || Xi(t).isValid()) ? Dr({
        to: this,
        from: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function nn(t) {
      return this.from(Xi(), t);
    }
    function sn(t, e) {
      return this.isValid() && (E(t) && t.isValid() || Xi(t).isValid()) ? Dr({
        from: this,
        to: t
      }).locale(this.locale()).humanize(!e) : this.localeData().invalidDate();
    }
    function on(t) {
      return this.to(Xi(), t);
    }
    function an(t) {
      var e;
      return void 0 === t ? this._locale._abbr : (null != (e = _i(t)) && (this._locale = e), this);
    }
    i.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", i.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var hn = P("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (t) {
      return void 0 === t ? this.localeData() : this.locale(t);
    });
    function ln() {
      return this._locale;
    }
    var cn = 1e3,
      un = 60 * cn,
      dn = 60 * un,
      pn = 3506328 * dn;
    function fn(t, e) {
      return (t % e + e) % e;
    }
    function mn(t, e, i) {
      return t < 100 && t >= 0 ? new Date(t + 400, e, i) - pn : new Date(t, e, i).valueOf();
    }
    function yn(t, e, i) {
      return t < 100 && t >= 0 ? Date.UTC(t + 400, e, i) - pn : Date.UTC(t, e, i);
    }
    function gn(t) {
      var e, r;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (r = this._isUTC ? yn : mn, t) {
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
          e = this._d.valueOf(), e -= fn(e + (this._isUTC ? 0 : this.utcOffset() * un), dn);
          break;
        case "minute":
          e = this._d.valueOf(), e -= fn(e, un);
          break;
        case "second":
          e = this._d.valueOf(), e -= fn(e, cn);
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function _n(t) {
      var e, r;
      if (void 0 === (t = et(t)) || "millisecond" === t || !this.isValid()) return this;
      switch (r = this._isUTC ? yn : mn, t) {
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
          e = this._d.valueOf(), e += dn - fn(e + (this._isUTC ? 0 : this.utcOffset() * un), dn) - 1;
          break;
        case "minute":
          e = this._d.valueOf(), e += un - fn(e, un) - 1;
          break;
        case "second":
          e = this._d.valueOf(), e += cn - fn(e, cn) - 1;
      }
      return this._d.setTime(e), i.updateOffset(this, !0), this;
    }
    function vn() {
      return this._d.valueOf() - 6e4 * (this._offset || 0);
    }
    function bn() {
      return Math.floor(this.valueOf() / 1e3);
    }
    function wn() {
      return new Date(this.valueOf());
    }
    function En() {
      var t = this;
      return [t.year(), t.month(), t.date(), t.hour(), t.minute(), t.second(), t.millisecond()];
    }
    function Sn() {
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
    function Pn() {
      return this.isValid() ? this.toISOString() : null;
    }
    function An() {
      return y(this);
    }
    function xn() {
      return d({}, m(this));
    }
    function Tn() {
      return m(this).overflow;
    }
    function Dn() {
      return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
      };
    }
    function $n(t, e) {
      var r,
        n,
        s,
        o = this._eras || _i("en")._eras;
      for (r = 0, n = o.length; r < n; ++r) switch ("string" == typeof o[r].since && (s = i(o[r].since).startOf("day"), o[r].since = s.valueOf()), typeof o[r].until) {
        case "undefined":
          o[r].until = 1 / 0;
          break;
        case "string":
          s = i(o[r].until).startOf("day").valueOf(), o[r].until = s.valueOf();
      }
      return o;
    }
    function Mn(t, e, i) {
      var r,
        n,
        s,
        o,
        a,
        h = this.eras();
      for (t = t.toUpperCase(), r = 0, n = h.length; r < n; ++r) if (s = h[r].name.toUpperCase(), o = h[r].abbr.toUpperCase(), a = h[r].narrow.toUpperCase(), i) switch (e) {
        case "N":
        case "NN":
        case "NNN":
          if (o === t) return h[r];
          break;
        case "NNNN":
          if (s === t) return h[r];
          break;
        case "NNNNN":
          if (a === t) return h[r];
      } else if ([s, o, a].indexOf(t) >= 0) return h[r];
    }
    function kn(t, e) {
      var r = t.since <= t.until ? 1 : -1;
      return void 0 === e ? i(t.since).year() : i(t.since).year() + (e - t.offset) * r;
    }
    function On() {
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
    function Hn() {
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
    function Cn() {
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
    function Nn() {
      var t,
        e,
        r,
        n,
        s = this.localeData().eras();
      for (t = 0, e = s.length; t < e; ++t) if (r = s[t].since <= s[t].until ? 1 : -1, n = this.clone().startOf("day").valueOf(), s[t].since <= n && n <= s[t].until || s[t].until <= n && n <= s[t].since) return (this.year() - i(s[t].since).year()) * r + s[t].offset;
      return this.year();
    }
    function In(t) {
      return o(this, "_erasNameRegex") || Gn.call(this), t ? this._erasNameRegex : this._erasRegex;
    }
    function Un(t) {
      return o(this, "_erasAbbrRegex") || Gn.call(this), t ? this._erasAbbrRegex : this._erasRegex;
    }
    function Rn(t) {
      return o(this, "_erasNarrowRegex") || Gn.call(this), t ? this._erasNarrowRegex : this._erasRegex;
    }
    function Bn(t, e) {
      return e.erasAbbrRegex(t);
    }
    function Ln(t, e) {
      return e.erasNameRegex(t);
    }
    function Yn(t, e) {
      return e.erasNarrowRegex(t);
    }
    function Fn(t, e) {
      return e._eraYearOrdinalRegex || gt;
    }
    function Gn() {
      var t,
        e,
        i,
        r,
        n,
        s = [],
        o = [],
        a = [],
        h = [],
        l = this.eras();
      for (t = 0, e = l.length; t < e; ++t) i = Mt(l[t].name), r = Mt(l[t].abbr), n = Mt(l[t].narrow), o.push(i), s.push(r), a.push(n), h.push(i), h.push(r), h.push(n);
      this._erasRegex = new RegExp("^(" + h.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + o.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + s.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp("^(" + a.join("|") + ")", "i");
    }
    function jn(t, e) {
      B(0, [t, t.length], 0, e);
    }
    function zn(t) {
      return qn.call(this, t, this.week(), this.weekday() + this.localeData()._week.dow, this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function Vn(t) {
      return qn.call(this, t, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function Wn() {
      return Pe(this.year(), 1, 4);
    }
    function Zn() {
      return Pe(this.isoWeekYear(), 1, 4);
    }
    function Xn() {
      var t = this.localeData()._week;
      return Pe(this.year(), t.dow, t.doy);
    }
    function Kn() {
      var t = this.localeData()._week;
      return Pe(this.weekYear(), t.dow, t.doy);
    }
    function qn(t, e, i, r, n) {
      var s;
      return null == t ? Se(this, r, n).year : (e > (s = Pe(t, r, n)) && (e = s), Jn.call(this, t, e, i, r, n));
    }
    function Jn(t, e, i, r, n) {
      var s = Ee(t, e, i, r, n),
        o = be(s.year, 0, s.dayOfYear);
      return this.year(o.getUTCFullYear()), this.month(o.getUTCMonth()), this.date(o.getUTCDate()), this;
    }
    function Qn(t) {
      return null == t ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (t - 1) + this.month() % 3);
    }
    B("N", 0, 0, "eraAbbr"), B("NN", 0, 0, "eraAbbr"), B("NNN", 0, 0, "eraAbbr"), B("NNNN", 0, 0, "eraName"), B("NNNNN", 0, 0, "eraNarrow"), B("y", ["y", 1], "yo", "eraYear"), B("y", ["yy", 2], 0, "eraYear"), B("y", ["yyy", 3], 0, "eraYear"), B("y", ["yyyy", 4], 0, "eraYear"), Tt("N", Bn), Tt("NN", Bn), Tt("NNN", Bn), Tt("NNNN", Ln), Tt("NNNNN", Yn), Ct(["N", "NN", "NNN", "NNNN", "NNNNN"], function (t, e, i, r) {
      var n = i._locale.erasParse(t, r, i._strict);
      n ? m(i).era = n : m(i).invalidEra = t;
    }), Tt("y", gt), Tt("yy", gt), Tt("yyy", gt), Tt("yyyy", gt), Tt("yo", Fn), Ct(["y", "yy", "yyy", "yyyy"], Rt), Ct(["yo"], function (t, e, i, r) {
      var n;
      i._locale._eraYearOrdinalRegex && (n = t.match(i._locale._eraYearOrdinalRegex)), i._locale.eraYearOrdinalParse ? e[Rt] = i._locale.eraYearOrdinalParse(t, n) : e[Rt] = parseInt(t, 10);
    }), B(0, ["gg", 2], 0, function () {
      return this.weekYear() % 100;
    }), B(0, ["GG", 2], 0, function () {
      return this.isoWeekYear() % 100;
    }), jn("gggg", "weekYear"), jn("ggggg", "weekYear"), jn("GGGG", "isoWeekYear"), jn("GGGGG", "isoWeekYear"), Tt("G", _t), Tt("g", _t), Tt("GG", ut, at), Tt("gg", ut, at), Tt("GGGG", mt, lt), Tt("gggg", mt, lt), Tt("GGGGG", yt, ct), Tt("ggggg", yt, ct), Nt(["gggg", "ggggg", "GGGG", "GGGGG"], function (t, e, i, r) {
      e[r.substr(0, 2)] = Ot(t);
    }), Nt(["gg", "GG"], function (t, e, r, n) {
      e[n] = i.parseTwoDigitYear(t);
    }), B("Q", 0, "Qo", "quarter"), Tt("Q", ot), Ct("Q", function (t, e) {
      e[Bt] = 3 * (Ot(t) - 1);
    }), B("D", ["DD", 2], "Do", "date"), Tt("D", ut, At), Tt("DD", ut, at), Tt("Do", function (t, e) {
      return t ? e._dayOfMonthOrdinalParse || e._ordinalParse : e._dayOfMonthOrdinalParseLenient;
    }), Ct(["D", "DD"], Lt), Ct("Do", function (t, e) {
      e[Lt] = Ot(t.match(ut)[0]);
    });
    var ts = qt("Date", !0);
    function es(t) {
      var e = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
      return null == t ? e : this.add(t - e, "d");
    }
    B("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), Tt("DDD", ft), Tt("DDDD", ht), Ct(["DDD", "DDDD"], function (t, e, i) {
      i._dayOfYear = Ot(t);
    }), B("m", ["mm", 2], 0, "minute"), Tt("m", ut, xt), Tt("mm", ut, at), Ct(["m", "mm"], Ft);
    var is = qt("Minutes", !1);
    B("s", ["ss", 2], 0, "second"), Tt("s", ut, xt), Tt("ss", ut, at), Ct(["s", "ss"], Gt);
    var rs,
      ns,
      ss = qt("Seconds", !1);
    for (B("S", 0, 0, function () {
      return ~~(this.millisecond() / 100);
    }), B(0, ["SS", 2], 0, function () {
      return ~~(this.millisecond() / 10);
    }), B(0, ["SSS", 3], 0, "millisecond"), B(0, ["SSSS", 4], 0, function () {
      return 10 * this.millisecond();
    }), B(0, ["SSSSS", 5], 0, function () {
      return 100 * this.millisecond();
    }), B(0, ["SSSSSS", 6], 0, function () {
      return 1e3 * this.millisecond();
    }), B(0, ["SSSSSSS", 7], 0, function () {
      return 1e4 * this.millisecond();
    }), B(0, ["SSSSSSSS", 8], 0, function () {
      return 1e5 * this.millisecond();
    }), B(0, ["SSSSSSSSS", 9], 0, function () {
      return 1e6 * this.millisecond();
    }), Tt("S", ft, ot), Tt("SS", ft, at), Tt("SSS", ft, ht), rs = "SSSS"; rs.length <= 9; rs += "S") Tt(rs, gt);
    function os(t, e) {
      e[jt] = Ot(1e3 * ("0." + t));
    }
    for (rs = "S"; rs.length <= 9; rs += "S") Ct(rs, os);
    function as() {
      return this._isUTC ? "UTC" : "";
    }
    function hs() {
      return this._isUTC ? "Coordinated Universal Time" : "";
    }
    ns = qt("Milliseconds", !1), B("z", 0, 0, "zoneAbbr"), B("zz", 0, 0, "zoneName");
    var ls = w.prototype;
    function cs(t) {
      return Xi(1e3 * t);
    }
    function us() {
      return Xi.apply(null, arguments).parseZone();
    }
    function ds(t) {
      return t;
    }
    ls.add = Cr, ls.calendar = Fr, ls.clone = Gr, ls.diff = Kr, ls.endOf = _n, ls.format = en, ls.from = rn, ls.fromNow = nn, ls.to = sn, ls.toNow = on, ls.get = te, ls.invalidAt = Tn, ls.isAfter = jr, ls.isBefore = zr, ls.isBetween = Vr, ls.isSame = Wr, ls.isSameOrAfter = Zr, ls.isSameOrBefore = Xr, ls.isValid = An, ls.lang = hn, ls.locale = an, ls.localeData = ln, ls.max = qi, ls.min = Ki, ls.parsingFlags = xn, ls.set = ee, ls.startOf = gn, ls.subtract = Nr, ls.toArray = En, ls.toObject = Sn, ls.toDate = wn, ls.toISOString = Qr, ls.inspect = tn, "undefined" != typeof Symbol && null != Symbol.for && (ls[Symbol.for("nodejs.util.inspect.custom")] = function () {
      return "Moment<" + this.format() + ">";
    }), ls.toJSON = Pn, ls.toString = Jr, ls.unix = bn, ls.valueOf = vn, ls.creationData = Dn, ls.eraName = On, ls.eraNarrow = Hn, ls.eraAbbr = Cn, ls.eraYear = Nn, ls.year = Xt, ls.isLeapYear = Kt, ls.weekYear = zn, ls.isoWeekYear = Vn, ls.quarter = ls.quarters = Qn, ls.month = fe, ls.daysInMonth = me, ls.week = ls.weeks = $e, ls.isoWeek = ls.isoWeeks = Me, ls.weeksInYear = Xn, ls.weeksInWeekYear = Kn, ls.isoWeeksInYear = Wn, ls.isoWeeksInISOWeekYear = Zn, ls.date = ts, ls.day = ls.days = ze, ls.weekday = Ve, ls.isoWeekday = We, ls.dayOfYear = es, ls.hour = ls.hours = ni, ls.minute = ls.minutes = is, ls.second = ls.seconds = ss, ls.millisecond = ls.milliseconds = ns, ls.utcOffset = mr, ls.utc = gr, ls.local = _r, ls.parseZone = vr, ls.hasAlignedHourOffset = br, ls.isDST = wr, ls.isLocal = Sr, ls.isUtcOffset = Pr, ls.isUtc = Ar, ls.isUTC = Ar, ls.zoneAbbr = as, ls.zoneName = hs, ls.dates = P("dates accessor is deprecated. Use date instead.", ts), ls.months = P("months accessor is deprecated. Use month instead", fe), ls.years = P("years accessor is deprecated. Use year instead", Xt), ls.zone = P("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", yr), ls.isDSTShifted = P("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", Er);
    var ps = k.prototype;
    function fs(t, e, i, r) {
      var n = _i(),
        s = p().set(r, e);
      return n[i](s, t);
    }
    function ms(t, e, i) {
      if (l(t) && (e = t, t = void 0), t = t || "", null != e) return fs(t, e, i, "month");
      var r,
        n = [];
      for (r = 0; r < 12; r++) n[r] = fs(t, r, i, "month");
      return n;
    }
    function ys(t, e, i, r) {
      "boolean" == typeof t ? (l(e) && (i = e, e = void 0), e = e || "") : (i = e = t, t = !1, l(e) && (i = e, e = void 0), e = e || "");
      var n,
        s = _i(),
        o = t ? s._week.dow : 0,
        a = [];
      if (null != i) return fs(e, (i + o) % 7, r, "day");
      for (n = 0; n < 7; n++) a[n] = fs(e, (n + o) % 7, r, "day");
      return a;
    }
    function gs(t, e) {
      return ms(t, e, "months");
    }
    function _s(t, e) {
      return ms(t, e, "monthsShort");
    }
    function vs(t, e, i) {
      return ys(t, e, i, "weekdays");
    }
    function bs(t, e, i) {
      return ys(t, e, i, "weekdaysShort");
    }
    function ws(t, e, i) {
      return ys(t, e, i, "weekdaysMin");
    }
    ps.calendar = H, ps.longDateFormat = z, ps.invalidDate = W, ps.ordinal = K, ps.preparse = ds, ps.postformat = ds, ps.relativeTime = J, ps.pastFuture = Q, ps.set = $, ps.eras = $n, ps.erasParse = Mn, ps.erasConvertYear = kn, ps.erasAbbrRegex = Un, ps.erasNameRegex = In, ps.erasNarrowRegex = Rn, ps.months = le, ps.monthsShort = ce, ps.monthsParse = de, ps.monthsRegex = ge, ps.monthsShortRegex = ye, ps.week = Ae, ps.firstDayOfYear = De, ps.firstDayOfWeek = Te, ps.weekdays = Le, ps.weekdaysMin = Fe, ps.weekdaysShort = Ye, ps.weekdaysParse = je, ps.weekdaysRegex = Ze, ps.weekdaysShortRegex = Xe, ps.weekdaysMinRegex = Ke, ps.isPM = ii, ps.meridiem = si, mi("en", {
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
        return t + (1 === Ot(t % 100 / 10) ? "th" : 1 === e ? "st" : 2 === e ? "nd" : 3 === e ? "rd" : "th");
      }
    }), i.lang = P("moment.lang is deprecated. Use moment.locale instead.", mi), i.langData = P("moment.langData is deprecated. Use moment.localeData instead.", _i);
    var Es = Math.abs;
    function Ss() {
      var t = this._data;
      return this._milliseconds = Es(this._milliseconds), this._days = Es(this._days), this._months = Es(this._months), t.milliseconds = Es(t.milliseconds), t.seconds = Es(t.seconds), t.minutes = Es(t.minutes), t.hours = Es(t.hours), t.months = Es(t.months), t.years = Es(t.years), this;
    }
    function Ps(t, e, i, r) {
      var n = Dr(e, i);
      return t._milliseconds += r * n._milliseconds, t._days += r * n._days, t._months += r * n._months, t._bubble();
    }
    function As(t, e) {
      return Ps(this, t, e, 1);
    }
    function xs(t, e) {
      return Ps(this, t, e, -1);
    }
    function Ts(t) {
      return t < 0 ? Math.floor(t) : Math.ceil(t);
    }
    function Ds() {
      var t,
        e,
        i,
        r,
        n,
        s = this._milliseconds,
        o = this._days,
        a = this._months,
        h = this._data;
      return s >= 0 && o >= 0 && a >= 0 || s <= 0 && o <= 0 && a <= 0 || (s += 864e5 * Ts(Ms(a) + o), o = 0, a = 0), h.milliseconds = s % 1e3, t = kt(s / 1e3), h.seconds = t % 60, e = kt(t / 60), h.minutes = e % 60, i = kt(e / 60), h.hours = i % 24, o += kt(i / 24), a += n = kt($s(o)), o -= Ts(Ms(n)), r = kt(a / 12), a %= 12, h.days = o, h.months = a, h.years = r, this;
    }
    function $s(t) {
      return 4800 * t / 146097;
    }
    function Ms(t) {
      return 146097 * t / 4800;
    }
    function ks(t) {
      if (!this.isValid()) return NaN;
      var e,
        i,
        r = this._milliseconds;
      if ("month" === (t = et(t)) || "quarter" === t || "year" === t) switch (e = this._days + r / 864e5, i = this._months + $s(e), t) {
        case "month":
          return i;
        case "quarter":
          return i / 3;
        case "year":
          return i / 12;
      } else switch (e = this._days + Math.round(Ms(this._months)), t) {
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
    function Os(t) {
      return function () {
        return this.as(t);
      };
    }
    var Hs = Os("ms"),
      Cs = Os("s"),
      Ns = Os("m"),
      Is = Os("h"),
      Us = Os("d"),
      Rs = Os("w"),
      Bs = Os("M"),
      Ls = Os("Q"),
      Ys = Os("y"),
      Fs = Hs;
    function Gs() {
      return Dr(this);
    }
    function js(t) {
      return t = et(t), this.isValid() ? this[t + "s"]() : NaN;
    }
    function zs(t) {
      return function () {
        return this.isValid() ? this._data[t] : NaN;
      };
    }
    var Vs = zs("milliseconds"),
      Ws = zs("seconds"),
      Zs = zs("minutes"),
      Xs = zs("hours"),
      Ks = zs("days"),
      qs = zs("months"),
      Js = zs("years");
    function Qs() {
      return kt(this.days() / 7);
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
    function io(t, e, i, r, n) {
      return n.relativeTime(e || 1, !!i, t, r);
    }
    function ro(t, e, i, r) {
      var n = Dr(t).abs(),
        s = to(n.as("s")),
        o = to(n.as("m")),
        a = to(n.as("h")),
        h = to(n.as("d")),
        l = to(n.as("M")),
        c = to(n.as("w")),
        u = to(n.as("y")),
        d = s <= i.ss && ["s", s] || s < i.s && ["ss", s] || o <= 1 && ["m"] || o < i.m && ["mm", o] || a <= 1 && ["h"] || a < i.h && ["hh", a] || h <= 1 && ["d"] || h < i.d && ["dd", h];
      return null != i.w && (d = d || c <= 1 && ["w"] || c < i.w && ["ww", c]), (d = d || l <= 1 && ["M"] || l < i.M && ["MM", l] || u <= 1 && ["y"] || ["yy", u])[2] = e, d[3] = +t > 0, d[4] = r, io.apply(null, d);
    }
    function no(t) {
      return void 0 === t ? to : "function" == typeof t && (to = t, !0);
    }
    function so(t, e) {
      return void 0 !== eo[t] && (void 0 === e ? eo[t] : (eo[t] = e, "s" === t && (eo.ss = e - 1), !0));
    }
    function oo(t, e) {
      if (!this.isValid()) return this.localeData().invalidDate();
      var i,
        r,
        n = !1,
        s = eo;
      return "object" == typeof t && (e = t, t = !1), "boolean" == typeof t && (n = t), "object" == typeof e && (s = Object.assign({}, eo, e), null != e.s && null == e.ss && (s.ss = e.s - 1)), r = ro(this, !n, s, i = this.localeData()), n && (r = i.pastFuture(+this, r)), i.postformat(r);
    }
    var ao = Math.abs;
    function ho(t) {
      return (t > 0) - (t < 0) || +t;
    }
    function lo() {
      if (!this.isValid()) return this.localeData().invalidDate();
      var t,
        e,
        i,
        r,
        n,
        s,
        o,
        a,
        h = ao(this._milliseconds) / 1e3,
        l = ao(this._days),
        c = ao(this._months),
        u = this.asSeconds();
      return u ? (t = kt(h / 60), e = kt(t / 60), h %= 60, t %= 60, i = kt(c / 12), c %= 12, r = h ? h.toFixed(3).replace(/\.?0+$/, "") : "", n = u < 0 ? "-" : "", s = ho(this._months) !== ho(u) ? "-" : "", o = ho(this._days) !== ho(u) ? "-" : "", a = ho(this._milliseconds) !== ho(u) ? "-" : "", n + "P" + (i ? s + i + "Y" : "") + (c ? s + c + "M" : "") + (l ? o + l + "D" : "") + (e || t || h ? "T" : "") + (e ? a + e + "H" : "") + (t ? a + t + "M" : "") + (h ? a + r + "S" : "")) : "P0D";
    }
    var co = or.prototype;
    return co.isValid = nr, co.abs = Ss, co.add = As, co.subtract = xs, co.as = ks, co.asMilliseconds = Hs, co.asSeconds = Cs, co.asMinutes = Ns, co.asHours = Is, co.asDays = Us, co.asWeeks = Rs, co.asMonths = Bs, co.asQuarters = Ls, co.asYears = Ys, co.valueOf = Fs, co._bubble = Ds, co.clone = Gs, co.get = js, co.milliseconds = Vs, co.seconds = Ws, co.minutes = Zs, co.hours = Xs, co.days = Ks, co.weeks = Qs, co.months = qs, co.years = Js, co.humanize = oo, co.toISOString = lo, co.toString = lo, co.toJSON = lo, co.locale = an, co.localeData = ln, co.toIsoString = P("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", lo), co.lang = hn, B("X", 0, 0, "unix"), B("x", 0, 0, "valueOf"), Tt("x", _t), Tt("X", wt), Ct("X", function (t, e, i) {
      i._d = new Date(1e3 * parseFloat(t));
    }), Ct("x", function (t, e, i) {
      i._d = new Date(Ot(t));
    }),
    //! moment.js
    i.version = "2.30.1", r(Xi), i.fn = ls, i.min = Qi, i.max = tr, i.now = er, i.utc = p, i.unix = cs, i.months = gs, i.isDate = c, i.locale = mi, i.invalid = g, i.duration = Dr, i.isMoment = E, i.weekdays = vs, i.parseZone = us, i.localeData = _i, i.isDuration = ar, i.monthsShort = _s, i.weekdaysMin = ws, i.defineLocale = yi, i.updateLocale = gi, i.locales = vi, i.weekdaysShort = bs, i.normalizeUnits = et, i.relativeTimeRounding = no, i.relativeTimeThreshold = so, i.calendarFormat = Yr, i.prototype = ls, i.HTML5_FMT = {
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
  var At = wt(Pt.exports);
  const xt = (t, e, i, r) => {
    r = r || {}, i = i ?? {};
    const n = new Event(e, {
      bubbles: void 0 === r.bubbles || r.bubbles,
      cancelable: Boolean(r.cancelable),
      composed: void 0 === r.composed || r.composed
    });
    return n.detail = i, t.dispatchEvent(n), n;
  };
  var Tt, Dt, $t;
  !function (t) {
    t.ETA = "ETA", t.Elapsed = "Elapsed", t.Remaining = "Remaining";
  }(Tt || (Tt = {})), function (t) {
    t.F = "F", t.C = "C";
  }(Dt || (Dt = {})), function (t) {
    t.Status = "Status", t.HotendCurrent = "Hotend", t.BedCurrent = "Bed", t.HotendTarget = "Target Hotend", t.BedTarget = "Target Bed";
  }($t || ($t = {}));
  const Mt = Object.assign(Object.assign({}, Tt), $t),
    kt = ["width", "height", "left", "top"];
  function Ot(t, e) {
    Object.keys(e).forEach(t => {
      kt.includes(t) && !isNaN(e[t]) && (e[t] = e[t].toString() + "px");
    }), t && Object.assign(t.style, e);
  }
  function Ht(t) {
    return t.toLowerCase().split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ");
  }
  function Ct(t, e) {
    return e ? t.states[e.entity_id] : void 0;
  }
  function Nt(t, e) {
    const i = Ct(t, e);
    return i ? String(i.state) : "";
  }
  function It(t, e, i, r) {
    return "on" == Nt(t, e) ? i : r;
  }
  function Ut(t, e) {
    const i = {};
    for (const r in t.entities) {
      const n = t.entities[r];
      n.device_id === e && (i[n.entity_id] = n);
    }
    return i;
  }
  function Rt(t, e, i) {
    for (const r in t) {
      const n = t[r],
        s = r.split("."),
        o = s[0],
        a = s[1];
      if (o === e && a.endsWith(i)) return n;
    }
  }
  function Bt(t, e, i, r) {
    for (const n in t) {
      const s = t[n],
        o = n.split("."),
        a = o[0],
        h = o[1].split(e)[1];
      if (a === i && h === r) return s;
    }
  }
  function Lt(t) {
    for (const e in t) {
      const t = e.split("."),
        i = t[0],
        r = t[1];
      if ("binary_sensor" === i && r.endsWith("printer_online")) return r.split("printer_online")[0];
    }
  }
  function Yt(t, e, i, r, n = "unavailable", s = {}) {
    return Ct(t, Bt(e, i, "sensor", r)) || {
      state: n,
      attributes: s
    };
  }
  function Ft(t, e, i, r, n = !1) {
    const s = Bt(e, i, "sensor", r);
    if (s) {
      const e = Nt(t, s);
      return n ? Ht(e) : e;
    }
  }
  function Gt(t, e, i, r) {
    const n = Bt(e, i, "sensor", r);
    return n ? function (t, e) {
      const i = Ct(t, e),
        r = i ? parseFloat(i.state) : 0;
      return isNaN(r) ? 0 : r;
    }(t, n) : void 0;
  }
  function jt(t, e, i, r, n, s) {
    const o = Bt(e, i, "binary_sensor", r);
    return o ? It(t, o, n, s) : void 0;
  }
  function zt(t) {
    const e = t.path.split("/");
    return e.length > 1 ? e[1] : void 0;
  }
  function Vt(t) {
    const e = t.path.split("/");
    return e.length > 2 ? e[2] : "main";
  }
  const Wt = (t, e) => e ? At.duration(t, "seconds").humanize() : (() => {
    const e = At.duration(t, "seconds"),
      i = e.days(),
      r = e.hours(),
      n = e.minutes(),
      s = e.seconds();
    return `${i > 0 ? `${i}d` : ""}${r > 0 ? ` ${r}h` : ""}${n > 0 ? ` ${n}m` : ""}${s > 0 ? ` ${s}s` : ""}`;
  })();
  const Zt = {
      [Dt.C]: {
        [Dt.C]: t => t,
        [Dt.F]: t => 9 * t / 5 + 32
      },
      [Dt.F]: {
        [Dt.C]: t => 5 * (t - 32) / 9,
        [Dt.F]: t => t
      }
    },
    Xt = (t, e, i = !1) => {
      const r = parseFloat(t.state),
        n = (t => {
          var e;
          switch (null === (e = t.attributes) || void 0 === e ? void 0 : e.unit_of_measurement) {
            case "°C":
            default:
              return Dt.C;
            case "°F":
              return Dt.F;
          }
        })(t),
        s = (o = r, h = e || n, Zt[a = n] && Zt[a][h] ? Zt[a][h](o) : -1);
      var o, a, h;
      return `${i ? Math.round(s) : s.toFixed(2)}°${e || n}`;
    };
  let Kt = class extends dt {
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID));
    }
    render() {
      return Z`
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
  n([gt()], Kt.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], Kt.prototype, "narrow", void 0), n([gt()], Kt.prototype, "route", void 0), n([gt()], Kt.prototype, "panel", void 0), n([gt()], Kt.prototype, "printers", void 0), n([gt()], Kt.prototype, "selectedPrinterID", void 0), n([gt()], Kt.prototype, "selectedPrinterDevice", void 0), n([_t()], Kt.prototype, "printerEntities", void 0), Kt = n([ft("anycubic-view-debug")], Kt);
  var qt,
    Jt,
    Qt,
    te = "Anycubic Cloud",
    ee = {
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
    ie = {
      title: te,
      panels: ee
    },
    re = Object.freeze({
      __proto__: null,
      title: te,
      panels: ee,
      default: ie
    });
  function ne(t) {
    return t.type === Jt.literal;
  }
  function se(t) {
    return t.type === Jt.argument;
  }
  function oe(t) {
    return t.type === Jt.number;
  }
  function ae(t) {
    return t.type === Jt.date;
  }
  function he(t) {
    return t.type === Jt.time;
  }
  function le(t) {
    return t.type === Jt.select;
  }
  function ce(t) {
    return t.type === Jt.plural;
  }
  function ue(t) {
    return t.type === Jt.pound;
  }
  function de(t) {
    return t.type === Jt.tag;
  }
  function pe(t) {
    return !(!t || "object" != typeof t || t.type !== Qt.number);
  }
  function fe(t) {
    return !(!t || "object" != typeof t || t.type !== Qt.dateTime);
  }
  !function (t) {
    t[t.EXPECT_ARGUMENT_CLOSING_BRACE = 1] = "EXPECT_ARGUMENT_CLOSING_BRACE", t[t.EMPTY_ARGUMENT = 2] = "EMPTY_ARGUMENT", t[t.MALFORMED_ARGUMENT = 3] = "MALFORMED_ARGUMENT", t[t.EXPECT_ARGUMENT_TYPE = 4] = "EXPECT_ARGUMENT_TYPE", t[t.INVALID_ARGUMENT_TYPE = 5] = "INVALID_ARGUMENT_TYPE", t[t.EXPECT_ARGUMENT_STYLE = 6] = "EXPECT_ARGUMENT_STYLE", t[t.INVALID_NUMBER_SKELETON = 7] = "INVALID_NUMBER_SKELETON", t[t.INVALID_DATE_TIME_SKELETON = 8] = "INVALID_DATE_TIME_SKELETON", t[t.EXPECT_NUMBER_SKELETON = 9] = "EXPECT_NUMBER_SKELETON", t[t.EXPECT_DATE_TIME_SKELETON = 10] = "EXPECT_DATE_TIME_SKELETON", t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE = 11] = "UNCLOSED_QUOTE_IN_ARGUMENT_STYLE", t[t.EXPECT_SELECT_ARGUMENT_OPTIONS = 12] = "EXPECT_SELECT_ARGUMENT_OPTIONS", t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE = 13] = "EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE = 14] = "INVALID_PLURAL_ARGUMENT_OFFSET_VALUE", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR = 15] = "EXPECT_SELECT_ARGUMENT_SELECTOR", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR = 16] = "EXPECT_PLURAL_ARGUMENT_SELECTOR", t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT = 17] = "EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT", t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT = 18] = "EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT", t[t.INVALID_PLURAL_ARGUMENT_SELECTOR = 19] = "INVALID_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR = 20] = "DUPLICATE_PLURAL_ARGUMENT_SELECTOR", t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR = 21] = "DUPLICATE_SELECT_ARGUMENT_SELECTOR", t[t.MISSING_OTHER_CLAUSE = 22] = "MISSING_OTHER_CLAUSE", t[t.INVALID_TAG = 23] = "INVALID_TAG", t[t.INVALID_TAG_NAME = 25] = "INVALID_TAG_NAME", t[t.UNMATCHED_CLOSING_TAG = 26] = "UNMATCHED_CLOSING_TAG", t[t.UNCLOSED_TAG = 27] = "UNCLOSED_TAG";
  }(qt || (qt = {})), function (t) {
    t[t.literal = 0] = "literal", t[t.argument = 1] = "argument", t[t.number = 2] = "number", t[t.date = 3] = "date", t[t.time = 4] = "time", t[t.select = 5] = "select", t[t.plural = 6] = "plural", t[t.pound = 7] = "pound", t[t.tag = 8] = "tag";
  }(Jt || (Jt = {})), function (t) {
    t[t.number = 0] = "number", t[t.dateTime = 1] = "dateTime";
  }(Qt || (Qt = {}));
  var me = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
    ye = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
  function ge(t) {
    var e = {};
    return t.replace(ye, function (t) {
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
  var _e = /[\t-\r \x85\u200E\u200F\u2028\u2029]/i;
  var ve = /^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,
    be = /^(@+)?(\+|#+)?[rs]?$/g,
    we = /(\*)(0+)|(#+)(0+)|(0+)/g,
    Ee = /^(0+)$/;
  function Se(t) {
    var e = {};
    return "r" === t[t.length - 1] ? e.roundingPriority = "morePrecision" : "s" === t[t.length - 1] && (e.roundingPriority = "lessPrecision"), t.replace(be, function (t, i, r) {
      return "string" != typeof r ? (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length) : "+" === r ? e.minimumSignificantDigits = i.length : "#" === i[0] ? e.maximumSignificantDigits = i.length : (e.minimumSignificantDigits = i.length, e.maximumSignificantDigits = i.length + ("string" == typeof r ? r.length : 0)), "";
    }), e;
  }
  function Pe(t) {
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
  function Ae(t) {
    var e;
    if ("E" === t[0] && "E" === t[1] ? (e = {
      notation: "engineering"
    }, t = t.slice(2)) : "E" === t[0] && (e = {
      notation: "scientific"
    }, t = t.slice(1)), e) {
      var i = t.slice(0, 2);
      if ("+!" === i ? (e.signDisplay = "always", t = t.slice(2)) : "+?" === i && (e.signDisplay = "exceptZero", t = t.slice(2)), !Ee.test(t)) throw new Error("Malformed concise eng/scientific notation");
      e.minimumIntegerDigits = t.length;
    }
    return e;
  }
  function xe(t) {
    var e = Pe(t);
    return e || {};
  }
  function Te(t) {
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
            return r(r({}, t), xe(e));
          }, {}));
          continue;
        case "engineering":
          e = r(r(r({}, e), {
            notation: "engineering"
          }), s.options.reduce(function (t, e) {
            return r(r({}, t), xe(e));
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
          s.options[0].replace(we, function (t, i, r, n, s, o) {
            if (i) e.minimumIntegerDigits = r.length;else {
              if (n && s) throw new Error("We currently do not support maximum integer digits");
              if (o) throw new Error("We currently do not support exact integer digits");
            }
            return "";
          });
          continue;
      }
      if (Ee.test(s.stem)) e.minimumIntegerDigits = s.stem.length;else if (ve.test(s.stem)) {
        if (s.options.length > 1) throw new RangeError("Fraction-precision stems only accept a single optional option");
        s.stem.replace(ve, function (t, i, r, n, s, o) {
          return "*" === r ? e.minimumFractionDigits = i.length : n && "#" === n[0] ? e.maximumFractionDigits = n.length : s && o ? (e.minimumFractionDigits = s.length, e.maximumFractionDigits = s.length + o.length) : (e.minimumFractionDigits = i.length, e.maximumFractionDigits = i.length), "";
        });
        var o = s.options[0];
        "w" === o ? e = r(r({}, e), {
          trailingZeroDisplay: "stripIfInteger"
        }) : o && (e = r(r({}, e), Se(o)));
      } else if (be.test(s.stem)) e = r(r({}, e), Se(s.stem));else {
        var a = Pe(s.stem);
        a && (e = r(r({}, e), a));
        var h = Ae(s.stem);
        h && (e = r(r({}, e), h));
      }
    }
    return e;
  }
  var De,
    $e = {
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
  function Me(t) {
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
    return "root" !== r && (i = t.maximize().region), ($e[i || ""] || $e[r || ""] || $e["".concat(r, "-001")] || $e["001"])[0];
  }
  var ke = new RegExp("^".concat(me.source, "*")),
    Oe = new RegExp("".concat(me.source, "*$"));
  function He(t, e) {
    return {
      start: t,
      end: e
    };
  }
  var Ce = !!String.prototype.startsWith && "_a".startsWith("a", 1),
    Ne = !!String.fromCodePoint,
    Ie = !!Object.fromEntries,
    Ue = !!String.prototype.codePointAt,
    Re = !!String.prototype.trimStart,
    Be = !!String.prototype.trimEnd,
    Le = !!Number.isSafeInteger ? Number.isSafeInteger : function (t) {
      return "number" == typeof t && isFinite(t) && Math.floor(t) === t && Math.abs(t) <= 9007199254740991;
    },
    Ye = !0;
  try {
    Ye = "a" === (null === (De = Xe("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu").exec("a")) || void 0 === De ? void 0 : De[0]);
  } catch (G) {
    Ye = !1;
  }
  var Fe,
    Ge = Ce ? function (t, e, i) {
      return t.startsWith(e, i);
    } : function (t, e, i) {
      return t.slice(i, i + e.length) === e;
    },
    je = Ne ? String.fromCodePoint : function () {
      for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
      for (var i, r = "", n = t.length, s = 0; n > s;) {
        if ((i = t[s++]) > 1114111) throw RangeError(i + " is not a valid code point");
        r += i < 65536 ? String.fromCharCode(i) : String.fromCharCode(55296 + ((i -= 65536) >> 10), i % 1024 + 56320);
      }
      return r;
    },
    ze = Ie ? Object.fromEntries : function (t) {
      for (var e = {}, i = 0, r = t; i < r.length; i++) {
        var n = r[i],
          s = n[0],
          o = n[1];
        e[s] = o;
      }
      return e;
    },
    Ve = Ue ? function (t, e) {
      return t.codePointAt(e);
    } : function (t, e) {
      var i = t.length;
      if (!(e < 0 || e >= i)) {
        var r,
          n = t.charCodeAt(e);
        return n < 55296 || n > 56319 || e + 1 === i || (r = t.charCodeAt(e + 1)) < 56320 || r > 57343 ? n : r - 56320 + (n - 55296 << 10) + 65536;
      }
    },
    We = Re ? function (t) {
      return t.trimStart();
    } : function (t) {
      return t.replace(ke, "");
    },
    Ze = Be ? function (t) {
      return t.trimEnd();
    } : function (t) {
      return t.replace(Oe, "");
    };
  function Xe(t, e) {
    return new RegExp(t, e);
  }
  if (Ye) {
    var Ke = Xe("([^\\p{White_Space}\\p{Pattern_Syntax}]*)", "yu");
    Fe = function (t, e) {
      var i;
      return Ke.lastIndex = e, null !== (i = Ke.exec(t)[1]) && void 0 !== i ? i : "";
    };
  } else Fe = function (t, e) {
    for (var i = [];;) {
      var r = Ve(t, e);
      if (void 0 === r || ti(r) || ei(r)) break;
      i.push(r), e += r >= 65536 ? 2 : 1;
    }
    return je.apply(void 0, i);
  };
  var qe = function () {
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
              return this.error(qt.UNMATCHED_CLOSING_TAG, He(this.clonePosition(), this.clonePosition()));
            }
            if (60 === n && !this.ignoreTag && Je(this.peek() || 0)) {
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
              type: Jt.pound,
              location: He(o, this.clonePosition())
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
          type: Jt.literal,
          value: "<".concat(r, "/>"),
          location: He(i, this.clonePosition())
        },
        err: null
      };
      if (this.bumpIf(">")) {
        var n = this.parseMessage(t + 1, e, !0);
        if (n.err) return n;
        var s = n.val,
          o = this.clonePosition();
        if (this.bumpIf("</")) {
          if (this.isEOF() || !Je(this.char())) return this.error(qt.INVALID_TAG, He(o, this.clonePosition()));
          var a = this.clonePosition();
          return r !== this.parseTagName() ? this.error(qt.UNMATCHED_CLOSING_TAG, He(a, this.clonePosition())) : (this.bumpSpace(), this.bumpIf(">") ? {
            val: {
              type: Jt.tag,
              value: r,
              children: s,
              location: He(i, this.clonePosition())
            },
            err: null
          } : this.error(qt.INVALID_TAG, He(o, this.clonePosition())));
        }
        return this.error(qt.UNCLOSED_TAG, He(i, this.clonePosition()));
      }
      return this.error(qt.INVALID_TAG, He(i, this.clonePosition()));
    }, t.prototype.parseTagName = function () {
      var t = this.offset();
      for (this.bump(); !this.isEOF() && Qe(this.char());) this.bump();
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
      var a = He(i, this.clonePosition());
      return {
        val: {
          type: Jt.literal,
          value: r,
          location: a
        },
        err: null
      };
    }, t.prototype.tryParseLeftAngleBracket = function () {
      return this.isEOF() || 60 !== this.char() || !this.ignoreTag && (Je(t = this.peek() || 0) || 47 === t) ? null : (this.bump(), "<");
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
      return je.apply(void 0, e);
    }, t.prototype.tryParseUnquoted = function (t, e) {
      if (this.isEOF()) return null;
      var i = this.char();
      return 60 === i || 123 === i || 35 === i && ("plural" === e || "selectordinal" === e) || 125 === i && t > 0 ? null : (this.bump(), je(i));
    }, t.prototype.parseArgument = function (t, e) {
      var i = this.clonePosition();
      if (this.bump(), this.bumpSpace(), this.isEOF()) return this.error(qt.EXPECT_ARGUMENT_CLOSING_BRACE, He(i, this.clonePosition()));
      if (125 === this.char()) return this.bump(), this.error(qt.EMPTY_ARGUMENT, He(i, this.clonePosition()));
      var r = this.parseIdentifierIfPossible().value;
      if (!r) return this.error(qt.MALFORMED_ARGUMENT, He(i, this.clonePosition()));
      if (this.bumpSpace(), this.isEOF()) return this.error(qt.EXPECT_ARGUMENT_CLOSING_BRACE, He(i, this.clonePosition()));
      switch (this.char()) {
        case 125:
          return this.bump(), {
            val: {
              type: Jt.argument,
              value: r,
              location: He(i, this.clonePosition())
            },
            err: null
          };
        case 44:
          return this.bump(), this.bumpSpace(), this.isEOF() ? this.error(qt.EXPECT_ARGUMENT_CLOSING_BRACE, He(i, this.clonePosition())) : this.parseArgumentOptions(t, e, r, i);
        default:
          return this.error(qt.MALFORMED_ARGUMENT, He(i, this.clonePosition()));
      }
    }, t.prototype.parseIdentifierIfPossible = function () {
      var t = this.clonePosition(),
        e = this.offset(),
        i = Fe(this.message, e),
        r = e + i.length;
      return this.bumpTo(r), {
        value: i,
        location: He(t, this.clonePosition())
      };
    }, t.prototype.parseArgumentOptions = function (t, e, i, n) {
      var s,
        o = this.clonePosition(),
        a = this.parseIdentifierIfPossible().value,
        h = this.clonePosition();
      switch (a) {
        case "":
          return this.error(qt.EXPECT_ARGUMENT_TYPE, He(o, h));
        case "number":
        case "date":
        case "time":
          this.bumpSpace();
          var l = null;
          if (this.bumpIf(",")) {
            this.bumpSpace();
            var c = this.clonePosition();
            if ((_ = this.parseSimpleArgStyleIfPossible()).err) return _;
            if (0 === (f = Ze(_.val)).length) return this.error(qt.EXPECT_ARGUMENT_STYLE, He(this.clonePosition(), this.clonePosition()));
            l = {
              style: f,
              styleLocation: He(c, this.clonePosition())
            };
          }
          if ((v = this.tryParseArgumentClose(n)).err) return v;
          var u = He(n, this.clonePosition());
          if (l && Ge(null == l ? void 0 : l.style, "::", 0)) {
            var d = We(l.style.slice(2));
            if ("number" === a) return (_ = this.parseNumberSkeletonFromString(d, l.styleLocation)).err ? _ : {
              val: {
                type: Jt.number,
                value: i,
                location: u,
                style: _.val
              },
              err: null
            };
            if (0 === d.length) return this.error(qt.EXPECT_DATE_TIME_SKELETON, u);
            var p = d;
            this.locale && (p = function (t, e) {
              for (var i = "", r = 0; r < t.length; r++) {
                var n = t.charAt(r);
                if ("j" === n) {
                  for (var s = 0; r + 1 < t.length && t.charAt(r + 1) === n;) s++, r++;
                  var o = 1 + (1 & s),
                    a = s < 2 ? 1 : 3 + (s >> 1),
                    h = Me(e);
                  for ("H" != h && "k" != h || (a = 0); a-- > 0;) i += "a";
                  for (; o-- > 0;) i = h + i;
                } else i += "J" === n ? "H" : n;
              }
              return i;
            }(d, this.locale));
            var f = {
              type: Qt.dateTime,
              pattern: p,
              location: l.styleLocation,
              parsedOptions: this.shouldParseSkeletons ? ge(p) : {}
            };
            return {
              val: {
                type: "date" === a ? Jt.date : Jt.time,
                value: i,
                location: u,
                style: f
              },
              err: null
            };
          }
          return {
            val: {
              type: "number" === a ? Jt.number : "date" === a ? Jt.date : Jt.time,
              value: i,
              location: u,
              style: null !== (s = null == l ? void 0 : l.style) && void 0 !== s ? s : null
            },
            err: null
          };
        case "plural":
        case "selectordinal":
        case "select":
          var m = this.clonePosition();
          if (this.bumpSpace(), !this.bumpIf(",")) return this.error(qt.EXPECT_SELECT_ARGUMENT_OPTIONS, He(m, r({}, m)));
          this.bumpSpace();
          var y = this.parseIdentifierIfPossible(),
            g = 0;
          if ("select" !== a && "offset" === y.value) {
            if (!this.bumpIf(":")) return this.error(qt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, He(this.clonePosition(), this.clonePosition()));
            var _;
            if (this.bumpSpace(), (_ = this.tryParseDecimalInteger(qt.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE, qt.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE)).err) return _;
            this.bumpSpace(), y = this.parseIdentifierIfPossible(), g = _.val;
          }
          var v,
            b = this.tryParsePluralOrSelectOptions(t, a, e, y);
          if (b.err) return b;
          if ((v = this.tryParseArgumentClose(n)).err) return v;
          var w = He(n, this.clonePosition());
          return "select" === a ? {
            val: {
              type: Jt.select,
              value: i,
              options: ze(b.val),
              location: w
            },
            err: null
          } : {
            val: {
              type: Jt.plural,
              value: i,
              options: ze(b.val),
              offset: g,
              pluralType: "plural" === a ? "cardinal" : "ordinal",
              location: w
            },
            err: null
          };
        default:
          return this.error(qt.INVALID_ARGUMENT_TYPE, He(o, h));
      }
    }, t.prototype.tryParseArgumentClose = function (t) {
      return this.isEOF() || 125 !== this.char() ? this.error(qt.EXPECT_ARGUMENT_CLOSING_BRACE, He(t, this.clonePosition())) : (this.bump(), {
        val: !0,
        err: null
      });
    }, t.prototype.parseSimpleArgStyleIfPossible = function () {
      for (var t = 0, e = this.clonePosition(); !this.isEOF();) {
        switch (this.char()) {
          case 39:
            this.bump();
            var i = this.clonePosition();
            if (!this.bumpUntil("'")) return this.error(qt.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE, He(i, this.clonePosition()));
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
          for (var e = t.split(_e).filter(function (t) {
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
        return this.error(qt.INVALID_NUMBER_SKELETON, e);
      }
      return {
        val: {
          type: Qt.number,
          tokens: i,
          location: e,
          parsedOptions: this.shouldParseSkeletons ? Te(i) : {}
        },
        err: null
      };
    }, t.prototype.tryParsePluralOrSelectOptions = function (t, e, i, r) {
      for (var n, s = !1, o = [], a = new Set(), h = r.value, l = r.location;;) {
        if (0 === h.length) {
          var c = this.clonePosition();
          if ("select" === e || !this.bumpIf("=")) break;
          var u = this.tryParseDecimalInteger(qt.EXPECT_PLURAL_ARGUMENT_SELECTOR, qt.INVALID_PLURAL_ARGUMENT_SELECTOR);
          if (u.err) return u;
          l = He(c, this.clonePosition()), h = this.message.slice(c.offset, this.offset());
        }
        if (a.has(h)) return this.error("select" === e ? qt.DUPLICATE_SELECT_ARGUMENT_SELECTOR : qt.DUPLICATE_PLURAL_ARGUMENT_SELECTOR, l);
        "other" === h && (s = !0), this.bumpSpace();
        var d = this.clonePosition();
        if (!this.bumpIf("{")) return this.error("select" === e ? qt.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT : qt.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT, He(this.clonePosition(), this.clonePosition()));
        var p = this.parseMessage(t + 1, e, i);
        if (p.err) return p;
        var f = this.tryParseArgumentClose(d);
        if (f.err) return f;
        o.push([h, {
          value: p.val,
          location: He(d, this.clonePosition())
        }]), a.add(h), this.bumpSpace(), h = (n = this.parseIdentifierIfPossible()).value, l = n.location;
      }
      return 0 === o.length ? this.error("select" === e ? qt.EXPECT_SELECT_ARGUMENT_SELECTOR : qt.EXPECT_PLURAL_ARGUMENT_SELECTOR, He(this.clonePosition(), this.clonePosition())) : this.requiresOtherClause && !s ? this.error(qt.MISSING_OTHER_CLAUSE, He(this.clonePosition(), this.clonePosition())) : {
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
      var a = He(r, this.clonePosition());
      return n ? Le(s *= i) ? {
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
      var e = Ve(this.message, t);
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
      if (Ge(this.message, t, this.offset())) {
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
      for (; !this.isEOF() && ti(this.char());) this.bump();
    }, t.prototype.peek = function () {
      if (this.isEOF()) return null;
      var t = this.char(),
        e = this.offset(),
        i = this.message.charCodeAt(e + (t >= 65536 ? 2 : 1));
      return null != i ? i : null;
    }, t;
  }();
  function Je(t) {
    return t >= 97 && t <= 122 || t >= 65 && t <= 90;
  }
  function Qe(t) {
    return 45 === t || 46 === t || t >= 48 && t <= 57 || 95 === t || t >= 97 && t <= 122 || t >= 65 && t <= 90 || 183 == t || t >= 192 && t <= 214 || t >= 216 && t <= 246 || t >= 248 && t <= 893 || t >= 895 && t <= 8191 || t >= 8204 && t <= 8205 || t >= 8255 && t <= 8256 || t >= 8304 && t <= 8591 || t >= 11264 && t <= 12271 || t >= 12289 && t <= 55295 || t >= 63744 && t <= 64975 || t >= 65008 && t <= 65533 || t >= 65536 && t <= 983039;
  }
  function ti(t) {
    return t >= 9 && t <= 13 || 32 === t || 133 === t || t >= 8206 && t <= 8207 || 8232 === t || 8233 === t;
  }
  function ei(t) {
    return t >= 33 && t <= 35 || 36 === t || t >= 37 && t <= 39 || 40 === t || 41 === t || 42 === t || 43 === t || 44 === t || 45 === t || t >= 46 && t <= 47 || t >= 58 && t <= 59 || t >= 60 && t <= 62 || t >= 63 && t <= 64 || 91 === t || 92 === t || 93 === t || 94 === t || 96 === t || 123 === t || 124 === t || 125 === t || 126 === t || 161 === t || t >= 162 && t <= 165 || 166 === t || 167 === t || 169 === t || 171 === t || 172 === t || 174 === t || 176 === t || 177 === t || 182 === t || 187 === t || 191 === t || 215 === t || 247 === t || t >= 8208 && t <= 8213 || t >= 8214 && t <= 8215 || 8216 === t || 8217 === t || 8218 === t || t >= 8219 && t <= 8220 || 8221 === t || 8222 === t || 8223 === t || t >= 8224 && t <= 8231 || t >= 8240 && t <= 8248 || 8249 === t || 8250 === t || t >= 8251 && t <= 8254 || t >= 8257 && t <= 8259 || 8260 === t || 8261 === t || 8262 === t || t >= 8263 && t <= 8273 || 8274 === t || 8275 === t || t >= 8277 && t <= 8286 || t >= 8592 && t <= 8596 || t >= 8597 && t <= 8601 || t >= 8602 && t <= 8603 || t >= 8604 && t <= 8607 || 8608 === t || t >= 8609 && t <= 8610 || 8611 === t || t >= 8612 && t <= 8613 || 8614 === t || t >= 8615 && t <= 8621 || 8622 === t || t >= 8623 && t <= 8653 || t >= 8654 && t <= 8655 || t >= 8656 && t <= 8657 || 8658 === t || 8659 === t || 8660 === t || t >= 8661 && t <= 8691 || t >= 8692 && t <= 8959 || t >= 8960 && t <= 8967 || 8968 === t || 8969 === t || 8970 === t || 8971 === t || t >= 8972 && t <= 8991 || t >= 8992 && t <= 8993 || t >= 8994 && t <= 9e3 || 9001 === t || 9002 === t || t >= 9003 && t <= 9083 || 9084 === t || t >= 9085 && t <= 9114 || t >= 9115 && t <= 9139 || t >= 9140 && t <= 9179 || t >= 9180 && t <= 9185 || t >= 9186 && t <= 9254 || t >= 9255 && t <= 9279 || t >= 9280 && t <= 9290 || t >= 9291 && t <= 9311 || t >= 9472 && t <= 9654 || 9655 === t || t >= 9656 && t <= 9664 || 9665 === t || t >= 9666 && t <= 9719 || t >= 9720 && t <= 9727 || t >= 9728 && t <= 9838 || 9839 === t || t >= 9840 && t <= 10087 || 10088 === t || 10089 === t || 10090 === t || 10091 === t || 10092 === t || 10093 === t || 10094 === t || 10095 === t || 10096 === t || 10097 === t || 10098 === t || 10099 === t || 10100 === t || 10101 === t || t >= 10132 && t <= 10175 || t >= 10176 && t <= 10180 || 10181 === t || 10182 === t || t >= 10183 && t <= 10213 || 10214 === t || 10215 === t || 10216 === t || 10217 === t || 10218 === t || 10219 === t || 10220 === t || 10221 === t || 10222 === t || 10223 === t || t >= 10224 && t <= 10239 || t >= 10240 && t <= 10495 || t >= 10496 && t <= 10626 || 10627 === t || 10628 === t || 10629 === t || 10630 === t || 10631 === t || 10632 === t || 10633 === t || 10634 === t || 10635 === t || 10636 === t || 10637 === t || 10638 === t || 10639 === t || 10640 === t || 10641 === t || 10642 === t || 10643 === t || 10644 === t || 10645 === t || 10646 === t || 10647 === t || 10648 === t || t >= 10649 && t <= 10711 || 10712 === t || 10713 === t || 10714 === t || 10715 === t || t >= 10716 && t <= 10747 || 10748 === t || 10749 === t || t >= 10750 && t <= 11007 || t >= 11008 && t <= 11055 || t >= 11056 && t <= 11076 || t >= 11077 && t <= 11078 || t >= 11079 && t <= 11084 || t >= 11085 && t <= 11123 || t >= 11124 && t <= 11125 || t >= 11126 && t <= 11157 || 11158 === t || t >= 11159 && t <= 11263 || t >= 11776 && t <= 11777 || 11778 === t || 11779 === t || 11780 === t || 11781 === t || t >= 11782 && t <= 11784 || 11785 === t || 11786 === t || 11787 === t || 11788 === t || 11789 === t || t >= 11790 && t <= 11798 || 11799 === t || t >= 11800 && t <= 11801 || 11802 === t || 11803 === t || 11804 === t || 11805 === t || t >= 11806 && t <= 11807 || 11808 === t || 11809 === t || 11810 === t || 11811 === t || 11812 === t || 11813 === t || 11814 === t || 11815 === t || 11816 === t || 11817 === t || t >= 11818 && t <= 11822 || 11823 === t || t >= 11824 && t <= 11833 || t >= 11834 && t <= 11835 || t >= 11836 && t <= 11839 || 11840 === t || 11841 === t || 11842 === t || t >= 11843 && t <= 11855 || t >= 11856 && t <= 11857 || 11858 === t || t >= 11859 && t <= 11903 || t >= 12289 && t <= 12291 || 12296 === t || 12297 === t || 12298 === t || 12299 === t || 12300 === t || 12301 === t || 12302 === t || 12303 === t || 12304 === t || 12305 === t || t >= 12306 && t <= 12307 || 12308 === t || 12309 === t || 12310 === t || 12311 === t || 12312 === t || 12313 === t || 12314 === t || 12315 === t || 12316 === t || 12317 === t || t >= 12318 && t <= 12319 || 12320 === t || 12336 === t || 64830 === t || 64831 === t || t >= 65093 && t <= 65094;
  }
  function ii(t) {
    t.forEach(function (t) {
      if (delete t.location, le(t) || ce(t)) for (var e in t.options) delete t.options[e].location, ii(t.options[e].value);else oe(t) && pe(t.style) || (ae(t) || he(t)) && fe(t.style) ? delete t.style.location : de(t) && ii(t.children);
    });
  }
  function ri(t, e) {
    void 0 === e && (e = {}), e = r({
      shouldParseSkeletons: !0,
      requiresOtherClause: !0
    }, e);
    var i = new qe(t, e).parse();
    if (i.err) {
      var n = SyntaxError(qt[i.err.kind]);
      throw n.location = i.err.location, n.originalMessage = i.err.message, n;
    }
    return (null == e ? void 0 : e.captureLocation) || ii(i.val), i.val;
  }
  function ni(t, e) {
    var i = e && e.cache ? e.cache : di,
      r = e && e.serializer ? e.serializer : li;
    return (e && e.strategy ? e.strategy : hi)(t, {
      cache: i,
      serializer: r
    });
  }
  function si(t, e, i, r) {
    var n,
      s = null == (n = r) || "number" == typeof n || "boolean" == typeof n ? r : i(r),
      o = e.get(s);
    return void 0 === o && (o = t.call(this, r), e.set(s, o)), o;
  }
  function oi(t, e, i) {
    var r = Array.prototype.slice.call(arguments, 3),
      n = i(r),
      s = e.get(n);
    return void 0 === s && (s = t.apply(this, r), e.set(n, s)), s;
  }
  function ai(t, e, i, r, n) {
    return i.bind(e, t, r, n);
  }
  function hi(t, e) {
    return ai(t, this, 1 === t.length ? si : oi, e.cache.create(), e.serializer);
  }
  var li = function () {
    return JSON.stringify(arguments);
  };
  function ci() {
    this.cache = Object.create(null);
  }
  ci.prototype.get = function (t) {
    return this.cache[t];
  }, ci.prototype.set = function (t, e) {
    this.cache[t] = e;
  };
  var ui,
    di = {
      create: function () {
        return new ci();
      }
    },
    pi = {
      variadic: function (t, e) {
        return ai(t, this, oi, e.cache.create(), e.serializer);
      },
      monadic: function (t, e) {
        return ai(t, this, si, e.cache.create(), e.serializer);
      }
    };
  !function (t) {
    t.MISSING_VALUE = "MISSING_VALUE", t.INVALID_VALUE = "INVALID_VALUE", t.MISSING_INTL_API = "MISSING_INTL_API";
  }(ui || (ui = {}));
  var fi,
    mi = function (t) {
      function e(e, i, r) {
        var n = t.call(this, e) || this;
        return n.code = i, n.originalMessage = r, n;
      }
      return i(e, t), e.prototype.toString = function () {
        return "[formatjs Error: ".concat(this.code, "] ").concat(this.message);
      }, e;
    }(Error),
    yi = function (t) {
      function e(e, i, r, n) {
        return t.call(this, 'Invalid values for "'.concat(e, '": "').concat(i, '". Options are "').concat(Object.keys(r).join('", "'), '"'), ui.INVALID_VALUE, n) || this;
      }
      return i(e, t), e;
    }(mi),
    gi = function (t) {
      function e(e, i, r) {
        return t.call(this, 'Value for "'.concat(e, '" must be of type ').concat(i), ui.INVALID_VALUE, r) || this;
      }
      return i(e, t), e;
    }(mi),
    _i = function (t) {
      function e(e, i) {
        return t.call(this, 'The intl string context variable "'.concat(e, '" was not provided to the string "').concat(i, '"'), ui.MISSING_VALUE, i) || this;
      }
      return i(e, t), e;
    }(mi);
  function vi(t) {
    return "function" == typeof t;
  }
  function bi(t, e, i, r, n, s, o) {
    if (1 === t.length && ne(t[0])) return [{
      type: fi.literal,
      value: t[0].value
    }];
    for (var a = [], h = 0, l = t; h < l.length; h++) {
      var c = l[h];
      if (ne(c)) a.push({
        type: fi.literal,
        value: c.value
      });else if (ue(c)) "number" == typeof s && a.push({
        type: fi.literal,
        value: i.getNumberFormat(e).format(s)
      });else {
        var u = c.value;
        if (!n || !(u in n)) throw new _i(u, o);
        var d = n[u];
        if (se(c)) d && "string" != typeof d && "number" != typeof d || (d = "string" == typeof d || "number" == typeof d ? String(d) : ""), a.push({
          type: "string" == typeof d ? fi.literal : fi.object,
          value: d
        });else if (ae(c)) {
          var p = "string" == typeof c.style ? r.date[c.style] : fe(c.style) ? c.style.parsedOptions : void 0;
          a.push({
            type: fi.literal,
            value: i.getDateTimeFormat(e, p).format(d)
          });
        } else if (he(c)) {
          p = "string" == typeof c.style ? r.time[c.style] : fe(c.style) ? c.style.parsedOptions : r.time.medium;
          a.push({
            type: fi.literal,
            value: i.getDateTimeFormat(e, p).format(d)
          });
        } else if (oe(c)) {
          (p = "string" == typeof c.style ? r.number[c.style] : pe(c.style) ? c.style.parsedOptions : void 0) && p.scale && (d *= p.scale || 1), a.push({
            type: fi.literal,
            value: i.getNumberFormat(e, p).format(d)
          });
        } else {
          if (de(c)) {
            var f = c.children,
              m = c.value,
              y = n[m];
            if (!vi(y)) throw new gi(m, "function", o);
            var g = y(bi(f, e, i, r, n, s).map(function (t) {
              return t.value;
            }));
            Array.isArray(g) || (g = [g]), a.push.apply(a, g.map(function (t) {
              return {
                type: "string" == typeof t ? fi.literal : fi.object,
                value: t
              };
            }));
          }
          if (le(c)) {
            if (!(_ = c.options[d] || c.options.other)) throw new yi(c.value, d, Object.keys(c.options), o);
            a.push.apply(a, bi(_.value, e, i, r, n));
          } else if (ce(c)) {
            var _;
            if (!(_ = c.options["=".concat(d)])) {
              if (!Intl.PluralRules) throw new mi('Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n', ui.MISSING_INTL_API, o);
              var v = i.getPluralRules(e, {
                type: c.pluralType
              }).select(d - (c.offset || 0));
              _ = c.options[v] || c.options.other;
            }
            if (!_) throw new yi(c.value, d, Object.keys(c.options), o);
            a.push.apply(a, bi(_.value, e, i, r, n, d - (c.offset || 0)));
          } else ;
        }
      }
    }
    return function (t) {
      return t.length < 2 ? t : t.reduce(function (t, e) {
        var i = t[t.length - 1];
        return i && i.type === fi.literal && e.type === fi.literal ? i.value += e.value : t.push(e), t;
      }, []);
    }(a);
  }
  function wi(t, e) {
    return e ? Object.keys(t).reduce(function (i, n) {
      var s, o;
      return i[n] = (s = t[n], (o = e[n]) ? r(r(r({}, s || {}), o || {}), Object.keys(s).reduce(function (t, e) {
        return t[e] = r(r({}, s[e]), o[e] || {}), t;
      }, {})) : s), i;
    }, r({}, t)) : t;
  }
  function Ei(t) {
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
  }(fi || (fi = {}));
  var Si = function () {
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
            return t.length && e.type === fi.literal && "string" == typeof t[t.length - 1] ? t[t.length - 1] += e.value : t.push(e.value), t;
          }, []);
          return i.length <= 1 ? i[0] || "" : i;
        }, this.formatToParts = function (t) {
          return bi(h.ast, h.locales, h.formatters, h.formats, t, void 0, h.message);
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
        this.formats = wi(t.formats, n), this.formatters = o && o.formatters || (void 0 === (a = this.formatterCache) && (a = {
          number: {},
          dateTime: {},
          pluralRules: {}
        }), {
          getNumberFormat: ni(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.NumberFormat).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: Ei(a.number),
            strategy: pi.variadic
          }),
          getDateTimeFormat: ni(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.DateTimeFormat).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: Ei(a.dateTime),
            strategy: pi.variadic
          }),
          getPluralRules: ni(function () {
            for (var t, e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
            return new ((t = Intl.PluralRules).bind.apply(t, s([void 0], e, !1)))();
          }, {
            cache: Ei(a.pluralRules),
            strategy: pi.variadic
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
      }, t.__parse = ri, t.formats = {
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
    Pi = Si,
    Ai = {
      en: re
    };
  function xi(t, e, ...i) {
    const r = e.replace(/['"]+/g, "");
    var n;
    try {
      n = t.split(".").reduce((t, e) => t[e], Ai[r]);
    } catch (e) {
      n = t.split(".").reduce((t, e) => t[e], Ai.en);
    }
    if (void 0 === n && (n = t.split(".").reduce((t, e) => t[e], Ai.en)), !i.length) return n;
    const s = {};
    for (let t = 0; t < i.length; t += 2) {
      let e = i[t];
      e = e.replace(/^{([^}]+)?}$/, "$1"), s[e] = i[t + 1];
    }
    try {
      return new Pi(n, e).format(s);
    } catch (t) {
      return "Translation " + t;
    }
  }
  var Ti = "M8,5.14V19.14L19,12.14L8,5.14Z";
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const Di = 1,
    $i = 2,
    Mi = t => (...e) => ({
      _$litDirective$: t,
      values: e
    });
  class ki {
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
  const Oi = Mi(class extends ki {
      constructor(t) {
        if (super(t), t.type !== Di || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
        return X;
      }
    }),
    Hi = "important",
    Ci = " !" + Hi,
    Ni = Mi(class extends ki {
      constructor(t) {
        if (super(t), t.type !== Di || "style" !== t.name || t.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
            const e = "string" == typeof r && r.endsWith(Ci);
            t.includes("-") || e ? i.setProperty(t, e ? r.slice(0, -11) : r, e ? Hi : "") : i[t] = r;
          }
        }
        return X;
      }
    });
  /**
       * @license
       * Copyright 2018 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  let Ii = class extends dt {
    constructor() {
      super(...arguments), this.spoolList = [];
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) && (this.spoolList = Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "not loaded", {
        spool_info: []
      }).attributes.spool_info);
    }
    render() {
      return Z`
      <div class="ac-printercard-mcbview">${this.renderSpools()}</div>
    `;
    }
    renderSpools() {
      /**
           * @license
           * Copyright 2021 Google LLC
           * SPDX-License-Identifier: BSD-3-Clause
           */
      return function* (t, e) {
        if (void 0 !== t) {
          let i = 0;
          for (const r of t) yield e(r, i++);
        }
      }(this.spoolList, (t, e) => {
        const i = {
          "background-color": t.spool_loaded ? `rgb(${t.color[0]}, ${t.color[1]}, ${t.color[2]})` : "#aaa"
        };
        return Z`
        <div class="ac-spool-info">
          <div class="ac-spool-color-ring" style=${Ni(i)}>
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
      return u`
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
  n([gt()], Ii.prototype, "hass", void 0), n([gt()], Ii.prototype, "printerEntities", void 0), n([gt()], Ii.prototype, "printerEntityIdPart", void 0), n([_t()], Ii.prototype, "spoolList", void 0), Ii = n([ft("anycubic-printercard-multicolorbox_view")], Ii);
  class Ui {
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
  const Ri = {
    top: {
      width: 350,
      height: 20
    },
    bottom: {
      width: 350,
      height: 52.3
    },
    left: {
      width: 40,
      height: 380
    },
    right: {
      width: 40,
      height: 380
    },
    buildplate: {
      maxWidth: 250,
      maxHeight: 260,
      verticalOffset: 55
    },
    xAxis: {
      stepper: !0,
      width: 420,
      offsetLeft: -40,
      height: 30,
      extruder: {
        width: 60,
        height: 100
      }
    }
  };
  class Bi {
    constructor(t, {
      target: e,
      config: i,
      callback: r,
      skipInitial: n
    }) {
      this.t = new Set(), this.o = !1, this.i = !1, this.h = t, null !== e && this.t.add(e ?? t), this.l = i, this.o = n ?? this.o, this.callback = r, window.ResizeObserver ? (this.u = new ResizeObserver(t => {
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
  /**
       * @license
       * Copyright 2020 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const {
      I: Li
    } = ct,
    Yi = () => document.createComment(""),
    Fi = (t, e, i) => {
      const r = t._$AA.parentNode,
        n = void 0 === e ? t._$AB : e._$AA;
      if (void 0 === i) {
        const e = r.insertBefore(Yi(), n),
          s = r.insertBefore(Yi(), n);
        i = new Li(e, s, t, t.options);
      } else {
        const e = i._$AB.nextSibling,
          s = i._$AM,
          o = s !== t;
        if (o) {
          let e;
          i._$AQ?.(t), i._$AM = t, void 0 !== i._$AP && (e = t._$AU) !== s._$AU && i._$AP(e);
        }
        if (e !== n || o) {
          let t = i._$AA;
          for (; t !== e;) {
            const e = t.nextSibling;
            r.insertBefore(t, n), t = e;
          }
        }
      }
      return i;
    },
    Gi = (t, e, i = t) => (t._$AI(e, i), t),
    ji = {},
    zi = t => {
      t._$AP?.(!1, !0);
      let e = t._$AA;
      const i = t._$AB.nextSibling;
      for (; e !== i;) {
        const t = e.nextSibling;
        e.remove(), e = t;
      }
    },
    Vi = (t, e) => {
      const i = t._$AN;
      if (void 0 === i) return !1;
      for (const t of i) t._$AO?.(e, !1), Vi(t, e);
      return !0;
    },
    Wi = t => {
      let e, i;
      do {
        if (void 0 === (e = t._$AM)) break;
        i = e._$AN, i.delete(t), t = e;
      } while (0 === i?.size);
    },
    Zi = t => {
      for (let e; e = t._$AM; t = e) {
        let i = e._$AN;
        if (void 0 === i) e._$AN = i = new Set();else if (i.has(t)) break;
        i.add(t), qi(e);
      }
    };
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  function Xi(t) {
    void 0 !== this._$AN ? (Wi(this), this._$AM = t, Zi(this)) : this._$AM = t;
  }
  function Ki(t, e = !1, i = 0) {
    const r = this._$AH,
      n = this._$AN;
    if (void 0 !== n && 0 !== n.size) if (e) {
      if (Array.isArray(r)) for (let t = i; t < r.length; t++) Vi(r[t], !1), Wi(r[t]);else null != r && (Vi(r, !1), Wi(r));
    } else Vi(this, t);
  }
  const qi = t => {
    t.type == $i && (t._$AP ??= Ki, t._$AQ ??= Xi);
  };
  class Ji extends ki {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(t, e, i) {
      super._$AT(t, e, i), Zi(this), this.isConnected = t._$AU;
    }
    _$AO(t, e = !0) {
      t !== this.isConnected && (this.isConnected = t, t ? this.reconnected?.() : this.disconnected?.()), e && (Vi(this, t), Wi(this));
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
  const Qi = new WeakMap();
  let tr = 0;
  const er = new Map(),
    ir = new WeakSet(),
    rr = () => new Promise(t => requestAnimationFrame(t)),
    nr = (t, e) => {
      const i = t - e;
      return 0 === i ? void 0 : i;
    },
    sr = (t, e) => {
      const i = t / e;
      return 1 === i ? void 0 : i;
    },
    or = {
      left: (t, e) => {
        const i = nr(t, e);
        return {
          value: i,
          transform: null == i || isNaN(i) ? void 0 : `translateX(${i}px)`
        };
      },
      top: (t, e) => {
        const i = nr(t, e);
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
        const r = sr(t, e);
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
        const r = sr(t, e);
        return {
          value: r,
          overrideFrom: i,
          transform: null == r || isNaN(r) ? void 0 : `scaleY(${r})`
        };
      }
    },
    ar = {
      duration: 333,
      easing: "ease-in-out"
    },
    hr = ["left", "top", "width", "height", "opacity", "color", "background"],
    lr = new WeakMap();
  const cr = Mi(class extends Ji {
      constructor(t) {
        if (super(t), this.t = !1, this.i = null, this.o = null, this.h = !0, this.shouldLog = !1, t.type === $i) throw Error("The `animate` directive must be used in attribute position.");
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
        return K;
      }
      getController() {
        return Qi.get(this.u);
      }
      isDisabled() {
        return this.options.disabled || this.getController()?.disabled;
      }
      update(t, [e]) {
        const i = void 0 === this.u;
        return i && (this.u = t.options?.host, this.u.addController(this), this.u.updateComplete.then(t => this.t = !0), this.element = t.element, lr.set(this.element, this)), this.optionsOrCallback = e, (i || "function" != typeof e) && this.p(e), this.render(e);
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
        }), t.properties ??= hr, this.options = t;
      }
      m() {
        const t = {},
          e = this.element.getBoundingClientRect(),
          i = getComputedStyle(this.element);
        return this.options.properties.forEach(r => {
          const n = e[r] ?? (or[r] ? void 0 : i[r]),
            s = Number(n);
          t[r] = isNaN(s) ? n + "" : s;
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
        this.prepare(), await rr;
        const e = this.O(),
          i = this.j(this.options.keyframeOptions, e),
          r = this.m();
        if (void 0 !== this.A) {
          const {
            from: i,
            to: n
          } = this.N(this.A, r, e);
          this.log("measured", [this.A, r, i, n]), t = this.calculateKeyframes(i, n);
        } else {
          const i = er.get(this.options.inId);
          if (i) {
            er.delete(this.options.inId);
            const {
              from: n,
              to: s
            } = this.N(i, r, e);
            t = this.calculateKeyframes(n, s), t = this.options.in ? [{
              ...this.options.in[0],
              ...t[0]
            }, ...this.options.in.slice(1), t[1]] : t, tr++, t.forEach(t => t.zIndex = tr);
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
        if (void 0 !== this.options.id && er.set(this.options.id, this.A), void 0 === this.options.out) return;
        if (this.prepare(), await rr(), this.i?.isConnected) {
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
          const i = lr.get(e);
          i && !i.isDisabled() && i && t.push(i);
        }
        return t;
      }
      get isHostRendered() {
        const t = ir.has(this.u);
        return t || this.u.updateComplete.then(() => {
          ir.add(this.u);
        }), t;
      }
      j(t, e = this.O()) {
        const i = {
          ...ar
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
        let n = 1,
          s = 1;
        return r.length > 0 && (r.forEach(t => {
          t.width && (n /= t.width), t.height && (s /= t.height);
        }), void 0 !== t.left && void 0 !== e.left && (t.left = n * t.left, e.left = n * e.left), void 0 !== t.top && void 0 !== e.top && (t.top = s * t.top, e.top = s * e.top)), {
          from: t,
          to: e
        };
      }
      calculateKeyframes(t, e, i = !1) {
        const r = {},
          n = {};
        let s = !1;
        const o = {};
        for (const i in e) {
          const a = t[i],
            h = e[i];
          if (i in or) {
            const t = or[i];
            if (void 0 === a || void 0 === h) continue;
            const e = t(a, h);
            void 0 !== e.transform && (o[i] = e.value, s = !0, r.transform = `${r.transform ?? ""} ${e.transform}`, void 0 !== e.overrideFrom && Object.assign(r, e.overrideFrom));
          } else a !== h && void 0 !== a && void 0 !== h && (s = !0, r[i] = a, n[i] = h);
        }
        return r.transformOrigin = n.transformOrigin = i ? "center center" : "top left", this.animatingProperties = o, s ? [r, n] : void 0;
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
    }),
    ur = {
      keyframeOptions: {
        duration: 2e3,
        direction: "alternate"
      },
      properties: ["left"]
    },
    dr = {
      keyframeOptions: {
        duration: 100
      },
      properties: ["top"]
    };
  let pr = class extends dt {
    constructor() {
      super(...arguments), this._progressNum = 0, this.animKeyframeGantry = 0, this._isPrinting = !1, this._onResizeEvent = () => {
        if (this._rootElement) {
          const t = this._rootElement.clientHeight,
            e = this._rootElement.clientWidth;
          this.setDimensions(e, t);
        }
      };
    }
    connectedCallback() {
      super.connectedCallback(), this._observer = new Bi(this, {
        callback: this._onResizeEvent
      });
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) {
        this._progressNum = Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", 0).state / 100;
        const t = Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state.toLowerCase();
        this._isPrinting = ["printing", "preheating"].includes(t);
      }
    }
    update(t) {
      if (super.update(t), (t.has("dimensions") || t.has("animKeyframeGantry") || t.has("hass")) && this.dimensions) {
        const e = -1 * this._progressNum * this.dimensions.BuildArea.height;
        Ot(this._elAcAPr_xaxis, Object.assign(Object.assign({}, this.dimensions.XAxis), {
          top: this.dimensions.XAxis.top + e
        })), Ot(this._elAcAPr_gantry, Object.assign(Object.assign({}, this.dimensions.Gantry), {
          left: 0 != this.animKeyframeGantry ? this.dimensions.Gantry.left + this.dimensions.BuildPlate.width : this.dimensions.Gantry.left,
          top: this.dimensions.Gantry.top + e
        })), Ot(this._elAcAPr_animprint, {
          height: 100 * this._progressNum + "%"
        }), t.has("dimensions") && this.dimensions && (Ot(this._elAcAPr_scalable, Object.assign({}, this.dimensions.Scalable)), Ot(this._elAcAPr_frame, Object.assign({}, this.dimensions.Frame)), Ot(this._elAcAPr_hole, Object.assign({}, this.dimensions.Hole)), Ot(this._elAcAPr_buildarea, Object.assign({}, this.dimensions.BuildArea)), Ot(this._elAcAPr_buildplate, Object.assign({}, this.dimensions.BuildPlate)), Ot(this._elAcAPr_nozzle, Object.assign({}, this.dimensions.Nozzle)));
      }
    }
    render() {
      return Z`
      <div class="ac-printercard-animatedprinter">
        ${this.dimensions ? Z` <div class="ac-apr-scalable">
              <div class="ac-apr-frame">
                <div class="ac-apr-hole"></div>
              </div>
              <div class="ac-apr-buildarea">
                <div class="ac-apr-animprint"></div>
              </div>
              <div class="ac-apr-buildplate"></div>
              <div
                class="ac-apr-xaxis"
                ${cr(Object.assign({}, dr))}
              ></div>
              <div
                class="ac-apr-gantry"
                ${cr(Object.assign({}, dr))}
                ${this.dimensions && this._isPrinting ? cr(Object.assign(Object.assign({}, ur), {
        onComplete: () => this.moveGantry()
      })) : null}
              >
                <div class="ac-apr-nozzle"></div>
              </div>
            </div>` : null}
      </div>
    `;
    }
    setDimensions(t, e) {
      this.dimensions = function (t, e, i) {
        const r = new Ui(e.height / (t.top.height + t.bottom.height + t.left.height) * i),
          n = r.val(t.top.width),
          s = r.val(t.top.height + t.bottom.height + t.left.height),
          o = r.val(t.top.width - (t.left.width + t.right.width)),
          a = r.val(t.left.height),
          h = r.val(t.left.width),
          l = r.val(t.top.height),
          c = r.val(t.top.height - t.buildplate.verticalOffset) + a,
          u = c + r.val((t.xAxis.extruder.height - t.xAxis.height) / 2 - (t.xAxis.extruder.height + 12)),
          d = r.val(t.buildplate.maxWidth),
          p = r.val(t.buildplate.maxHeight),
          f = r.val(t.left.width + (r.og(o) - t.buildplate.maxWidth) / 2),
          m = c - r.val(t.buildplate.maxHeight),
          y = d,
          g = f,
          _ = c,
          v = r.val(t.xAxis.width),
          b = r.val(t.xAxis.height),
          w = r.val(t.xAxis.offsetLeft),
          E = v,
          S = b,
          P = r.val(t.xAxis.extruder.width),
          A = r.val(t.xAxis.extruder.height),
          x = g - P / 2,
          T = x + d,
          D = r.val(12),
          $ = r.val(12),
          M = _ - A - $;
        return {
          Scalable: {
            width: n,
            height: s
          },
          Frame: {
            width: n,
            height: s
          },
          Hole: {
            width: o,
            height: a,
            left: h,
            top: l
          },
          BuildArea: {
            width: d,
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
            top: M + .7 * A - b / 2
          },
          Track: {
            width: E,
            height: S
          },
          Basis: {
            Y: c,
            X: u
          },
          Gantry: {
            width: P,
            height: A,
            left: x,
            top: M
          },
          Nozzle: {
            width: D,
            height: $,
            left: (P - D) / 2,
            top: A
          },
          GantryMaxLeft: T
        };
      }(this.printerConfig, {
        width: t,
        height: e
      }, this.scaleFactor || 1);
    }
    moveGantry() {
      this.animKeyframeGantry = !this.animKeyframeGantry;
    }
    static get styles() {
      return u`
      :host {
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
  n([bt(".ac-printercard-animatedprinter")], pr.prototype, "_rootElement", void 0), n([bt(".ac-apr-scalable")], pr.prototype, "_elAcAPr_scalable", void 0), n([bt(".ac-apr-frame")], pr.prototype, "_elAcAPr_frame", void 0), n([bt(".ac-apr-hole")], pr.prototype, "_elAcAPr_hole", void 0), n([bt(".ac-apr-buildarea")], pr.prototype, "_elAcAPr_buildarea", void 0), n([bt(".ac-apr-animprint")], pr.prototype, "_elAcAPr_animprint", void 0), n([bt(".ac-apr-buildplate")], pr.prototype, "_elAcAPr_buildplate", void 0), n([bt(".ac-apr-xaxis")], pr.prototype, "_elAcAPr_xaxis", void 0), n([bt(".ac-apr-gantry")], pr.prototype, "_elAcAPr_gantry", void 0), n([bt(".ac-apr-nozzle")], pr.prototype, "_elAcAPr_nozzle", void 0), n([gt()], pr.prototype, "hass", void 0), n([gt()], pr.prototype, "scaleFactor", void 0), n([gt()], pr.prototype, "printerConfig", void 0), n([gt()], pr.prototype, "printerEntities", void 0), n([gt()], pr.prototype, "printerEntityIdPart", void 0), n([_t()], pr.prototype, "dimensions", void 0), n([_t()], pr.prototype, "resizeObserver", void 0), n([_t()], pr.prototype, "_progressNum", void 0), n([_t({
    type: Number
  })], pr.prototype, "animKeyframeGantry", void 0), n([_t({
    type: Boolean
  })], pr.prototype, "_isPrinting", void 0), pr = n([ft("anycubic-printercard-animated_printer")], pr);
  let fr = class extends dt {
    constructor() {
      super(...arguments), this.hasCamera = !1;
    }
    connectedCallback() {
      super.connectedCallback(), this.hasCamera && this.toggleVideo && window.addEventListener("click", this.toggleVideo);
    }
    disconnectedCallback() {
      this.hasCamera && this.toggleVideo && window.removeEventListener("click", this.toggleVideo), super.disconnectedCallback();
    }
    render() {
      return Z`
      <div class="ac-printercard-printerview">
        <anycubic-printercard-animated_printer
          .hass=${this.hass}
          .printerEntities=${this.printerEntities}
          .printerEntityIdPart=${this.printerEntityIdPart}
          .printerConfig=${Ri}
        ></anycubic-printercard-animated_printer>
      </div>
    `;
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
  n([gt()], fr.prototype, "hass", void 0), n([gt({
    type: Function
  })], fr.prototype, "toggleVideo", void 0), n([gt({
    type: Boolean
  })], fr.prototype, "hasCamera", void 0), n([gt()], fr.prototype, "printerEntities", void 0), n([gt()], fr.prototype, "printerEntityIdPart", void 0), fr = n([ft("anycubic-printercard-printer_view")], fr);
  /**
       * @license
       * Copyright 2017 Google LLC
       * SPDX-License-Identifier: BSD-3-Clause
       */
  const mr = (t, e, i) => {
      const r = new Map();
      for (let n = e; n <= i; n++) r.set(t[n], n);
      return r;
    },
    yr = Mi(class extends ki {
      constructor(t) {
        if (super(t), t.type !== $i) throw Error("repeat() can only be used in text expressions");
      }
      dt(t, e, i) {
        let r;
        void 0 === i ? i = e : void 0 !== e && (r = e);
        const n = [],
          s = [];
        let o = 0;
        for (const e of t) n[o] = r ? r(e, o) : o, s[o] = i(e, o), o++;
        return {
          values: s,
          keys: n
        };
      }
      render(t, e, i) {
        return this.dt(t, e, i).values;
      }
      update(t, [e, i, r]) {
        const n = (t => t._$AH)(t),
          {
            values: s,
            keys: o
          } = this.dt(e, i, r);
        if (!Array.isArray(n)) return this.ut = o, s;
        const a = this.ut ??= [],
          h = [];
        let l,
          c,
          u = 0,
          d = n.length - 1,
          p = 0,
          f = s.length - 1;
        for (; u <= d && p <= f;) if (null === n[u]) u++;else if (null === n[d]) d--;else if (a[u] === o[p]) h[p] = Gi(n[u], s[p]), u++, p++;else if (a[d] === o[f]) h[f] = Gi(n[d], s[f]), d--, f--;else if (a[u] === o[f]) h[f] = Gi(n[u], s[f]), Fi(t, h[f + 1], n[u]), u++, f--;else if (a[d] === o[p]) h[p] = Gi(n[d], s[p]), Fi(t, n[u], n[d]), d--, p++;else if (void 0 === l && (l = mr(o, p, f), c = mr(a, u, d)), l.has(a[u])) {
          if (l.has(a[d])) {
            const e = c.get(o[p]),
              i = void 0 !== e ? n[e] : null;
            if (null === i) {
              const e = Fi(t, n[u]);
              Gi(e, s[p]), h[p] = e;
            } else h[p] = Gi(i, s[p]), Fi(t, n[u], i), n[e] = null;
            p++;
          } else zi(n[d]), d--;
        } else zi(n[u]), u++;
        for (; p <= f;) {
          const e = Fi(t, h[f + 1]);
          Gi(e, s[p]), h[p++] = e;
        }
        for (; u <= d;) {
          const t = n[u++];
          null !== t && zi(t);
        }
        return this.ut = o, ((t, e = ji) => {
          t._$AH = e;
        })(t, h), X;
      }
    });
  let gr = class extends dt {
    render() {
      return Z`
      <div class="ac-stat-line">
        <p class="ac-stat-text ac-stat-heading">${this.name}</p>
        <p class="ac-stat-text">${this.value}</p>
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
      }

      .ac-stat-heading {
        font-weight: bold;
      }
    `;
    }
  };
  n([gt({
    type: String
  })], gr.prototype, "name", void 0), n([gt({
    type: String
  })], gr.prototype, "value", void 0), gr = n([ft("anycubic-printercard-stat-line")], gr);
  let _r = class extends dt {
    render() {
      return Z`<anycubic-printercard-stat-line
      .name=${this.name}
      .value=${Xt(this.temperatureEntity, this.temperatureUnit, this.round)}
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
  n([gt({
    type: String
  })], _r.prototype, "name", void 0), n([gt()], _r.prototype, "temperatureEntity", void 0), n([gt({
    type: Boolean
  })], _r.prototype, "round", void 0), n([gt({
    type: String
  })], _r.prototype, "temperatureUnit", void 0), _r = n([ft("anycubic-printercard-stat-temperature")], _r);
  let vr = class extends dt {
    constructor() {
      super(...arguments), this.currentTime = 0, this.lastIntervalId = -1;
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("timeEntity") && (-1 !== this.lastIntervalId && clearInterval(this.lastIntervalId), this.currentTime = function (t, e = !1) {
        let i;
        if (t.state) {
          if (t.state.includes(", ")) {
            const [e, r] = t.state.split(", "),
              [n, s, o] = r.split(":");
            i = 60 * +e.match(/\d+/)[0] * 60 * 24 + 60 * +n * 60 + 60 * +s + +o;
          } else if (t.state.includes(":")) {
            const [e, r, n] = t.state.split(":");
            i = 60 * +e * 60 + 60 * +r + +n;
          } else i = e ? +t.state : 60 * +t.state;
        } else i = 0;
        return i;
      }(this.timeEntity), this.lastIntervalId = setInterval(() => this.incTime(), 1e3));
    }
    disconnectedCallback() {
      super.disconnectedCallback(), clearInterval(this.lastIntervalId);
    }
    render() {
      return Z`<anycubic-printercard-stat-line
      .name=${this.timeType}
      .value=${((t, e, i = !1, r = !1) => {
        switch (e) {
          case Tt.Remaining:
            return Wt(t, i);
          case Tt.ETA:
            return At().add(t, "seconds").format(r ? "HH:mm" : "h:mm a");
          case Tt.Elapsed:
            return Wt(t, i);
          default:
            return "<unknown>";
        }
      })(this.currentTime, this.timeType, this.round, this.use_24hr)}
    ></anycubic-printercard-stat-line>`;
    }
    incTime() {
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
  n([gt()], vr.prototype, "timeEntity", void 0), n([gt()], vr.prototype, "timeType", void 0), n([gt({
    type: Number
  })], vr.prototype, "direction", void 0), n([gt({
    type: Boolean
  })], vr.prototype, "round", void 0), n([gt({
    type: Boolean
  })], vr.prototype, "use_24hr", void 0), n([gt({
    type: Boolean
  })], vr.prototype, "isSeconds", void 0), n([_t({
    type: Number
  })], vr.prototype, "currentTime", void 0), n([_t({
    type: Number
  })], vr.prototype, "lastIntervalId", void 0), vr = n([ft("anycubic-printercard-stat-time")], vr);
  let br = class extends dt {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = Dt.C, this._progressPercent = 0;
    }
    willUpdate(t) {
      super.willUpdate(t), (t.has("hass") || t.has("printerEntities") || t.has("printerEntityIdPart")) && (this._progressPercent = this.percentComplete());
    }
    render() {
      return Z`
      <div class="ac-stats-component">
        ${this.showPercent ? Z`
              <div class="ac-stats-part-percent">
                <p class="ac-stats-part-percent-text">
                  ${this.round ? Math.round(this._progressPercent) : this._progressPercent}%
                </p>
              </div>
            ` : null}
        <div class="ac-stats-part-monitored">${this.renderStats()}</div>
      </div>
    `;
    }
    percentComplete() {
      return Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress", -1).state;
    }
    renderStats() {
      return yr(this.monitoredStats, t => t, (t, e) => {
        switch (t) {
          case Mt.Status:
            return Z`
              <anycubic-printercard-stat-line
                .name=${t}
                .value=${Ht(Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state").state)}
              ></anycubic-printercard-stat-line>
            `;
          case Mt.ETA:
            return Z`
              <anycubic-printercard-stat-time
                .timeEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${0}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Mt.Elapsed:
            return Z`
              <anycubic-printercard-stat-time
                .timeEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_elapsed")}
                .timeType=${t}
                .direction=${1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Mt.Remaining:
            return Z`
              <anycubic-printercard-stat-time
                .timeEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_time_remaining")}
                .timeType=${t}
                .direction=${-1}
                .round=${this.round}
                .use_24hr=${this.use_24hr}
              ></anycubic-printercard-stat-time>
            `;
          case Mt.BedCurrent:
            return Z`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Mt.HotendCurrent:
            return Z`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Mt.BedTarget:
            return Z`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          case Mt.HotendTarget:
            return Z`
              <anycubic-printercard-stat-temperature
                .name=${t}
                .temperatureEntity=${Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature")}
                .round=${this.round}
                .temperatureUnit=${this.temperatureUnit}
              ></anycubic-printercard-stat-temperature>
            `;
          default:
            return Z`
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
  n([gt()], br.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], br.prototype, "narrow", void 0), n([gt()], br.prototype, "route", void 0), n([gt()], br.prototype, "panel", void 0), n([gt()], br.prototype, "monitoredStats", void 0), n([gt({
    type: Boolean
  })], br.prototype, "showPercent", void 0), n([gt({
    type: Boolean
  })], br.prototype, "round", void 0), n([gt({
    type: Boolean
  })], br.prototype, "use_24hr", void 0), n([gt({
    type: String
  })], br.prototype, "temperatureUnit", void 0), n([gt()], br.prototype, "printerEntities", void 0), n([gt()], br.prototype, "printerEntityIdPart", void 0), n([_t()], br.prototype, "_progressPercent", void 0), br = n([ft("anycubic-printercard-stats-component")], br);
  const wr = [Mt.Status, Mt.ETA, Mt.Elapsed, Mt.HotendCurrent, Mt.BedCurrent, Mt.Remaining, Mt.HotendTarget, Mt.BedTarget];
  let Er = class extends dt {
    constructor() {
      super(...arguments), this.round = !0, this.temperatureUnit = Dt.C, this.hiddenOverride = !1, this.hasColorbox = !1, this.lightIsOn = !1, this.statusColor = "#ffc107";
    }
    willUpdate(t) {
      if (super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID), this.printerEntityIdPart = Lt(this.printerEntities)), t.has("hass") || t.has("selectedPrinterID")) {
        this.hasColorbox = "active" === Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "multi_color_box_spools", "inactive").state, this.lightIsOn = It(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
        const t = Yt(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state", "unknown").state.toLowerCase();
        this.statusColor = ["printing", "preheating"].includes(t) ? "#4caf50" : "unknown" === t ? "#f44336" : "operational" === t || "finished" === t ? "#00bcd4" : "#ffc107", this.lightIsOn = It(this.hass, {
          entity_id: this.lightEntityId
        }, !0, !1);
      }
    }
    render() {
      return Z`
      <div class="ac-printer-card">
        <div class="ac-printer-card-mainview">
          ${this.renderHeader()} ${this.renderPrinterContainer()}
        </div>
      </div>
    `;
    }
    renderHeader() {
      var t;
      const e = {
          "ac-h-justifycenter": !this.powerEntityId || !this.lightEntityId
        },
        i = {
          "background-color": this.statusColor
        };
      return Z`
      <div class="ac-printer-card-header ${Oi(e)}">
        ${this.powerEntityId ? Z`
              <button
                class="ac-printer-card-button-small"
                @click="${t => {
        this.togglePowerEntity();
      }}"
              >
                <ha-svg-icon .path=${"M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"}></ha-svg-icon>
              </button>
            ` : null}

        <button
          class="ac-printer-card-button-name"
          @click="${t => {
        this.toggleHiddenOveride();
      }}"
        >
          <div
            class="ac-printer-card-header-status-dot"
            style=${Ni(i)}
          ></div>
          <p class="ac-printer-card-header-status-text">
            ${null === (t = this.selectedPrinterDevice) || void 0 === t ? void 0 : t.name}
          </p>
        </button>
        ${this.lightEntityId ? Z`
              <button
                class="ac-printer-card-button-small"
                @click="${t => {
        this.toggleLightEntity();
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
    renderPrinterContainer() {
      return Z`
      <div class="ac-printer-card-infocontainer">
        <div class="ac-printer-card-info-animcontainer">
          <anycubic-printercard-printer_view
            .hass=${this.hass}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
          ></anycubic-printercard-printer_view>
        </div>
        <div class="ac-printer-card-info-statscontainer">
          <anycubic-printercard-stats-component
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${this.route}
            .panel=${this.panel}
            .monitoredStats=${wr}
            .printerEntities=${this.printerEntities}
            .printerEntityIdPart=${this.printerEntityIdPart}
            .showPercent=${this.showPercent}
            .round=${this.round}
            .use_24hr=${this.use_24hr}
            .temperatureUnit=${this.temperatureUnit}
          ></anycubic-printercard-stats-component>
        </div>
      </div>
      ${this.renderMultiColorBoxContainer()}
    `;
    }
    renderMultiColorBoxContainer() {
      return this.hasColorbox ? Z`
          <div class="ac-printer-card-infocontainer">
            <div class="ac-printer-card-mcbsection">
              <anycubic-printercard-multicolorbox_view
                .hass=${this.hass}
                .printerEntities=${this.printerEntities}
                .printerEntityIdPart=${this.printerEntityIdPart}
              ></anycubic-printercard-multicolorbox_view>
            </div>
          </div>
        ` : null;
    }
    toggleLightEntity() {
      this.lightEntityId && this.hass.callService("homeassistant", "toggle", {
        entity_id: this.lightEntityId
      });
    }
    togglePowerEntity() {
      this.powerEntityId && this.hass.callService("homeassistant", "toggle", {
        entity_id: this.powerEntityId
      });
    }
    toggleHiddenOveride() {
      this.hiddenOverride = !this.hiddenOverride;
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
        margin: 24px;
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

      .ac-printer-card-info-statscontainer {
        box-sizing: border-box;
        padding: 0px 16px 32px 16px;
        padding-left: 16px;
        padding-right: 32px;
        width: 50%;
        height: 100%;
      }

      .ac-printer-card-mcbsection {
        box-sizing: border-box;
        padding: 5px 32px 5px 32px;
        width: 100%;
        height: 100%;
      }
    `;
    }
  };
  n([gt()], Er.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], Er.prototype, "narrow", void 0), n([gt()], Er.prototype, "route", void 0), n([gt()], Er.prototype, "panel", void 0), n([gt()], Er.prototype, "selectedPrinterID", void 0), n([gt()], Er.prototype, "selectedPrinterDevice", void 0), n([gt({
    type: Boolean
  })], Er.prototype, "showPercent", void 0), n([gt({
    type: Boolean
  })], Er.prototype, "round", void 0), n([gt({
    type: Boolean
  })], Er.prototype, "use_24hr", void 0), n([gt({
    type: String
  })], Er.prototype, "temperatureUnit", void 0), n([gt({
    type: String
  })], Er.prototype, "lightEntityId", void 0), n([gt({
    type: String
  })], Er.prototype, "powerEntityId", void 0), n([_t({
    type: Boolean
  })], Er.prototype, "hiddenOverride", void 0), n([_t({
    type: Boolean
  })], Er.prototype, "hasColorbox", void 0), n([_t({
    type: Boolean
  })], Er.prototype, "lightIsOn", void 0), n([_t({
    type: String
  })], Er.prototype, "statusColor", void 0), n([_t()], Er.prototype, "printerEntities", void 0), n([_t()], Er.prototype, "printerEntityIdPart", void 0), Er = n([ft("anycubic-printercard-card")], Er);
  let Sr = class extends dt {
    willUpdate(t) {
      var e;
      if (super.willUpdate(t), t.has("selectedPrinterDevice") && (this.printerID = (e = this.selectedPrinterDevice) ? e.hw_version.split("Printer ID: ")[1] : void 0, this.printerMAC = function (t) {
        return t && t.connections.length > 0 && t.connections[0].length > 1 ? t.connections[0][1] : null;
      }(this.selectedPrinterDevice)), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID), this.printerEntityIdPart = Lt(this.printerEntities)), t.has("hass") || t.has("selectedPrinterID")) {
        this.printerStateFwUpdateAvailable = jt(this.hass, this.printerEntities, this.printerEntityIdPart, "firmware_update_available", "Update Available", "Up To Date"), this.printerStateAvailable = jt(this.hass, this.printerEntities, this.printerEntityIdPart, "is_available", "Available", "Busy"), this.printerStateOnline = jt(this.hass, this.printerEntities, this.printerEntityIdPart, "printer_online", "Online", "Offline"), this.printerStateCurrNozzleTemp = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "nozzle_temperature"), this.printerStateCurrHotbedTemp = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "hotbed_temperature"), this.printerStateTargetNozzleTemp = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_nozzle_temperature"), this.printerStateTargetHotbedTemp = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "target_hotbed_temperature");
        const t = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "project_progress");
        this.projectStateProgress = void 0 !== t ? `${t}%` : "0%", this.projectStatePrintState = Ft(this.hass, this.printerEntities, this.printerEntityIdPart, "print_state", !0), this.aceStateFwUpdateAvailable = jt(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_firmware_update_available", "Update Available", "Up To Date"), this.aceStateDryingActive = jt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_active", "Drying", "Not Drying"), this.aceStateFwVersion = Ft(this.hass, this.printerEntities, this.printerEntityIdPart, "ace_fw_version"), this.aceStateDryingRemaining = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_remaining_time"), this.aceStateDryingTotal = Gt(this.hass, this.printerEntities, this.printerEntityIdPart, "drying_total_duration"), this.aceDryingProgress = void 0 !== this.aceStateDryingRemaining && void 0 !== this.aceStateDryingTotal ? String((this.aceStateDryingTotal > 0 ? Math.round(1e4 * (1 - this.aceStateDryingRemaining / this.aceStateDryingTotal)) / 100 : 0).toFixed(2)) + "%" : void 0;
      }
    }
    _renderInfoRow(t, e) {
      return Z`
      <div class="info-row">
        <span class="info-heading">
          ${xi(`panels.main.cards.main.fields.${t}.heading`, this.hass.language)}:</span
        >
        <span class="info-detail">${e}</span>
      </div>
    `;
    }
    _renderOptionalInfoRow(t, e) {
      return void 0 !== e ? this._renderInfoRow(t, e) : null;
    }
    render() {
      return Z`
      <printer-card elevation="2">
        <anycubic-printercard-card
          .hass=${this.hass}
          .narrow=${this.narrow}
          .route=${this.route}
          .panel=${this.panel}
          .selectedPrinterID=${this.selectedPrinterID}
          .selectedPrinterDevice=${this.selectedPrinterDevice}
          .showPercent=${!0}
          .round=${!1}
          .use_24hr=${!0}
        ></anycubic-printercard-card>
        <div class="ac-extra-printer-info">
          ${this._renderInfoRow("printer_name", this.selectedPrinterDevice ? this.selectedPrinterDevice.name : null)}
          ${this._renderInfoRow("printer_id", this.printerID)}
          ${this._renderInfoRow("printer_mac", this.printerMAC)}
          ${this._renderInfoRow("printer_model", this.selectedPrinterDevice ? this.selectedPrinterDevice.model : null)}
          ${this._renderInfoRow("printer_fw_version", this.selectedPrinterDevice ? this.selectedPrinterDevice.sw_version : null)}
          ${this._renderInfoRow("printer_fw_update_available", this.printerStateFwUpdateAvailable)}
          ${this._renderInfoRow("printer_online", this.printerStateOnline)}
          ${this._renderInfoRow("printer_available", this.printerStateAvailable)}
          ${this._renderInfoRow("curr_nozzle_temp", this.printerStateCurrNozzleTemp)}
          ${this._renderInfoRow("curr_hotbed_temp", this.printerStateCurrHotbedTemp)}
          ${this._renderInfoRow("target_nozzle_temp", this.printerStateTargetNozzleTemp)}
          ${this._renderInfoRow("target_hotbed_temp", this.printerStateTargetHotbedTemp)}
          ${this._renderInfoRow("print_state", this.projectStatePrintState)}
          ${this._renderInfoRow("project_progress", this.projectStateProgress)}
          ${this._renderOptionalInfoRow("ace_fw_version", this.aceStateFwVersion)}
          ${this._renderOptionalInfoRow("ace_fw_update_available", this.aceStateFwUpdateAvailable)}
          ${this._renderOptionalInfoRow("drying_active", this.aceStateDryingActive)}
          ${this._renderOptionalInfoRow("drying_progress", this.aceDryingProgress)}
        </div>
      </printer-card>
    `;
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

      .ac-extra-printer-info {
        padding: 20px 40px;
      }

      .info-row {
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        box-sizing: border-box;
        width: 100%;
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
  n([gt()], Sr.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], Sr.prototype, "narrow", void 0), n([gt()], Sr.prototype, "route", void 0), n([gt()], Sr.prototype, "panel", void 0), n([gt()], Sr.prototype, "selectedPrinterID", void 0), n([gt()], Sr.prototype, "selectedPrinterDevice", void 0), n([_t()], Sr.prototype, "printerEntities", void 0), n([_t()], Sr.prototype, "printerEntityIdPart", void 0), n([_t()], Sr.prototype, "printerID", void 0), n([_t()], Sr.prototype, "printerMAC", void 0), n([_t()], Sr.prototype, "printerStateFwUpdateAvailable", void 0), n([_t()], Sr.prototype, "printerStateAvailable", void 0), n([_t()], Sr.prototype, "printerStateOnline", void 0), n([_t()], Sr.prototype, "printerStateCurrNozzleTemp", void 0), n([_t()], Sr.prototype, "printerStateCurrHotbedTemp", void 0), n([_t()], Sr.prototype, "printerStateTargetNozzleTemp", void 0), n([_t()], Sr.prototype, "printerStateTargetHotbedTemp", void 0), n([_t()], Sr.prototype, "projectStateProgress", void 0), n([_t()], Sr.prototype, "projectStatePrintState", void 0), n([_t()], Sr.prototype, "aceStateFwUpdateAvailable", void 0), n([_t()], Sr.prototype, "aceStateDryingActive", void 0), n([_t()], Sr.prototype, "aceStateFwVersion", void 0), n([_t()], Sr.prototype, "aceStateDryingRemaining", void 0), n([_t()], Sr.prototype, "aceStateDryingTotal", void 0), n([_t()], Sr.prototype, "aceDryingProgress", void 0), Sr = n([ft("anycubic-view-main")], Sr);
  const Pr = "anycubic_cloud",
    Ar = u`
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
  let xr = class extends dt {
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID));
    }
    render() {
      var t;
      const e = Rt(this.printerEntities, "sensor", "file_list_cloud");
      const i = function (t) {
          return Rt(t, "button", "request_file_list_cloud");
        }(this.printerEntities),
        r = e ? this.hass.states[e.entity_id] : void 0,
        n = r ? null === (t = r.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return Z`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(t => Z`
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
      this.selectedPrinterDevice && t && this.hass.callService(Pr, "delete_file_cloud", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        file_id: t
      });
    }
    static get styles() {
      return u`
      ${Ar} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([gt()], xr.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], xr.prototype, "narrow", void 0), n([gt()], xr.prototype, "route", void 0), n([gt()], xr.prototype, "panel", void 0), n([gt()], xr.prototype, "selectedPrinterID", void 0), n([gt()], xr.prototype, "selectedPrinterDevice", void 0), n([_t()], xr.prototype, "printerEntities", void 0), xr = n([ft("anycubic-view-files_cloud")], xr);
  let Tr = class extends dt {
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID));
    }
    render() {
      var t;
      const e = Rt(this.printerEntities, "sensor", "file_list_local");
      const i = function (t) {
          return Rt(t, "button", "request_file_list_local");
        }(this.printerEntities),
        r = e ? this.hass.states[e.entity_id] : void 0,
        n = r ? null === (t = r.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return Z`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(t => Z`
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
      this.selectedPrinterDevice && t && this.hass.callService(Pr, "delete_file_local", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: t
      });
    }
    static get styles() {
      return u`
      ${Ar} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([gt()], Tr.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], Tr.prototype, "narrow", void 0), n([gt()], Tr.prototype, "route", void 0), n([gt()], Tr.prototype, "panel", void 0), n([gt()], Tr.prototype, "selectedPrinterID", void 0), n([gt()], Tr.prototype, "selectedPrinterDevice", void 0), n([_t()], Tr.prototype, "printerEntities", void 0), Tr = n([ft("anycubic-view-files_local")], Tr);
  let Dr = class extends dt {
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterID") && (this.printerEntities = Ut(this.hass, this.selectedPrinterID));
    }
    render() {
      var t;
      const e = Rt(this.printerEntities, "sensor", "file_list_udisk");
      const i = function (t) {
          return Rt(t, "button", "request_file_list_udisk");
        }(this.printerEntities),
        r = e ? this.hass.states[e.entity_id] : void 0,
        n = r ? null === (t = r.attributes) || void 0 === t ? void 0 : t.file_info : void 0;
      return Z`
      <div class="files-card" elevation="2">
        <button class="file-refresh-button" @click="${t => {
        this.refreshList(i);
      }}"><ha-icon class="file-refresh-icon" icon="mdi:refresh"></ha-icon></button>
        <ul class="files-container">
        ${n ? n.map(t => Z`
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
      this.selectedPrinterDevice && t && this.hass.callService(Pr, "delete_file_udisk", {
        config_entry: this.selectedPrinterDevice.primary_config_entry,
        device_id: this.selectedPrinterDevice.id,
        filename: t
      });
    }
    static get styles() {
      return u`
      ${Ar} :host {
        padding: 16px;
        display: block;
      }
    `;
    }
  };
  n([gt()], Dr.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], Dr.prototype, "narrow", void 0), n([gt()], Dr.prototype, "route", void 0), n([gt()], Dr.prototype, "panel", void 0), n([gt()], Dr.prototype, "selectedPrinterID", void 0), n([gt()], Dr.prototype, "selectedPrinterDevice", void 0), n([_t()], Dr.prototype, "printerEntities", void 0), Dr = n([ft("anycubic-view-files_udisk")], Dr);
  const $r = async () => {
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
  let Mr = class extends dt {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_no_cloud_save",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await $r();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterDevice") && this.selectedPrinterDevice && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id
        })
      }));
    }
    render() {
      return Z`
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
          <ha-svg-icon .path=${Ti}></ha-svg-icon>
          ${xi("panels.print_no_cloud_save.actions.print", this.hass.language)}
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
  n([gt({
    attribute: !1
  })], Mr.prototype, "hass", void 0), n([gt()], Mr.prototype, "route", void 0), n([gt()], Mr.prototype, "panel", void 0), n([gt()], Mr.prototype, "selectedPrinterID", void 0), n([gt()], Mr.prototype, "selectedPrinterDevice", void 0), n([_t()], Mr.prototype, "_scriptData", void 0), n([_t()], Mr.prototype, "narrow", void 0), Mr = n([ft("anycubic-view-print-no_cloud_save")], Mr);
  let kr = class extends dt {
    constructor() {
      super(...arguments), this._scriptData = {
        service: "anycubic_cloud.print_and_upload_save_in_cloud",
        data: {}
      }, this.narrow = !1;
    }
    async firstUpdated() {
      await $r();
    }
    willUpdate(t) {
      super.willUpdate(t), t.has("selectedPrinterDevice") && this.selectedPrinterDevice && (this._scriptData = Object.assign(Object.assign({}, this._scriptData), {
        data: Object.assign(Object.assign({}, this._scriptData.data || {}), {
          config_entry: this.selectedPrinterDevice.primary_config_entry,
          device_id: this.selectedPrinterDevice.id
        })
      }));
    }
    render() {
      return Z`
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
          <ha-svg-icon .path=${Ti}></ha-svg-icon>
          ${xi("panels.print_save_in_cloud.actions.print", this.hass.language)}
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
  n([gt({
    attribute: !1
  })], kr.prototype, "hass", void 0), n([gt()], kr.prototype, "route", void 0), n([gt()], kr.prototype, "panel", void 0), n([gt()], kr.prototype, "selectedPrinterID", void 0), n([gt()], kr.prototype, "selectedPrinterDevice", void 0), n([_t()], kr.prototype, "_scriptData", void 0), n([_t()], kr.prototype, "narrow", void 0), kr = n([ft("anycubic-view-print-save_in_cloud")], kr), t.AnycubicCloudPanel = class extends dt {
    constructor() {
      super(...arguments), this.selectedPage = "main";
    }
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
    willUpdate(t) {
      var e, i;
      (super.willUpdate(t), t.has("route") || t.has("printers")) && (this.selectedPage = Vt(this.route), this.selectedPrinterID = zt(this.route), this.selectedPrinterDevice = (e = this.printers, i = this.selectedPrinterID, e && i ? e[i] : void 0));
    }
    render() {
      return this.getInitialView();
    }
    renderPrinterPage() {
      return Z`
      <div class="header">
        ${this.renderToolbar()}
        <ha-tabs
          scrollable
          attr-for-selected="page-name"
          .selected=${this.selectedPage}
          @iron-activate=${this.handlePageSelected}
        >
          <paper-tab page-name="main">
            ${xi("panels.main.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="local-files">
            ${xi("panels.files_local.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="udisk-files">
            ${xi("panels.files_udisk.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="cloud-files">
            ${xi("panels.files_cloud.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-no_cloud_save">
            ${xi("panels.print_no_cloud_save.title", this.hass.language)}
          </paper-tab>
          <paper-tab page-name="print-save_in_cloud">
            ${xi("panels.print_save_in_cloud.title", this.hass.language)}
          </paper-tab>
          ${null}
        </ha-tabs>
      </div>
      <div class="view">${this.getView(this.route)}</div>
    `;
    }
    renderToolbar() {
      return Z`
      <div class="toolbar">
        <ha-menu-button
          .hass=${this.hass}
          .narrow=${this.narrow}
        ></ha-menu-button>
        <div class="main-title">${xi("title", this.hass.language)}</div>
        <div class="version">v${"0.0.4"}</div>
      </div>
    `;
    }
    getInitialView() {
      return this.selectedPrinterID ? this.renderPrinterPage() : Z`
        <div class="header">${this.renderToolbar()}</div>
        <printer-select elevation="2">
          <p>
            ${xi("panels.initial.fields.printer_select.heading", this.hass.language)}
          </p>
          <ul class="printers-container">
            ${this.printers ? Object.keys(this.printers).map(t => Z`<li
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
      switch (this.selectedPage) {
        case "local-files":
          return Z`
          <anycubic-view-files_local
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_local>
        `;
        case "udisk-files":
          return Z`
          <anycubic-view-files_udisk
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_udisk>
        `;
        case "cloud-files":
          return Z`
          <anycubic-view-files_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-files_cloud>
        `;
        case "print-no_cloud_save":
          return Z`
          <anycubic-view-print-no_cloud_save
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-no_cloud_save>
        `;
        case "print-save_in_cloud":
          return Z`
          <anycubic-view-print-save_in_cloud
            class="ac_wide_view"
            .hass=${this.hass}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-print-save_in_cloud>
        `;
        case "main":
          return Z`
          <anycubic-view-main
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-main>
        `;
        case "debug":
          return Z`
          <anycubic-view-debug
            .hass=${this.hass}
            .narrow=${this.narrow}
            .route=${t}
            .panel=${this.panel}
            .printers=${this.printers}
            .selectedPrinterID=${this.selectedPrinterID}
            .selectedPrinterDevice=${this.selectedPrinterDevice}
          ></anycubic-view-debug>
        `;
        default:
          return Z`
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
        i ? history.replaceState(null, "", n) : history.pushState(null, "", n), xt(window, "location-changed", {
          replace: i
        });
      })(this, t), this.requestUpdate();
    }
    handlePageSelected(t) {
      const e = t.detail.item.getAttribute("page-name");
      e !== Vt(this.route) ? (((t, e, i = !1) => {
        const r = zt(t.route),
          n = r ? `${r}/${e}` : "",
          s = `${t.route.prefix}/${n}`;
        i ? history.replaceState(null, "", s) : history.pushState(null, "", s), xt(window, "location-changed", {
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
  }, n([gt()], t.AnycubicCloudPanel.prototype, "hass", void 0), n([gt({
    type: Boolean,
    reflect: !0
  })], t.AnycubicCloudPanel.prototype, "narrow", void 0), n([gt()], t.AnycubicCloudPanel.prototype, "route", void 0), n([gt()], t.AnycubicCloudPanel.prototype, "panel", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "printers", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "selectedPage", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "selectedPrinterID", void 0), n([_t()], t.AnycubicCloudPanel.prototype, "selectedPrinterDevice", void 0), t.AnycubicCloudPanel = n([ft("anycubic-cloud-panel")], t.AnycubicCloudPanel), Object.defineProperty(t, "__esModule", {
    value: !0
  });
}({});
