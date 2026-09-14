(function () {
  "use strict";
  var tr, co;
  function po(e) {
    return e == null || typeof e == "function" ? { main: e } : e;
  }
  const wo = [
    {
      code: "douyin",
      name: "\u6296\u97F3",
      origin: "https://www.douyin.com",
      icon: "/assets/douyin.svg",
      hostnames: ["www.douyin.com", "v.douyin.com", "www.iesdouyin.com"],
    },
    {
      code: "xiaohongshu",
      name: "\u5C0F\u7EA2\u4E66",
      origin: "https://www.xiaohongshu.com",
      icon: "/assets/xiaohongshu.svg",
      hostnames: [
        "www.xiaohongshu.com",
        "www.rednote.com",
        "xhslink.com",
        "xhslink.cn",
      ],
    },
    {
      code: "kuaishou",
      name: "\u5FEB\u624B",
      origin: "https://www.kuaishou.com",
      icon: "/assets/kuaishou.svg",
      hostnames: ["www.kuaishou.com", "live.kuaishou.com", "v.kuaishou.com"],
    },
    {
      code: "xingtu",
      name: "\u5DE8\u91CF\u661F\u56FE",
      parentCode: "douyin",
      origin: "https://www.xingtu.cn",
      icon: "/assets/xingtu.svg",
      hostnames: ["www.xingtu.cn"],
    },
    {
      code: "pgy.xiaohongshu",
      name: "\u5C0F\u7EA2\u4E66\u84B2\u516C\u82F1",
      parentCode: "xiaohongshu",
      origin: "https://pgy.xiaohongshu.com",
      icon: "/assets/pgy.xiaohongshu.svg",
      hostnames: ["pgy.xiaohongshu.com"],
    },
    {
      code: "bilibili",
      name: "\u54D4\u54E9\u54D4\u54E9",
      origin: "https://www.bilibili.com",
      icon: "/assets/bilibili.svg",
      hostnames: [
        "www.bilibili.com",
        "space.bilibili.com",
        "search.bilibili.com",
        "b23.tv",
      ],
    },
    {
      code: "tiktok",
      name: "TikTok",
      origin: "https://www.tiktok.com",
      icon: "/assets/tiktok.svg",
      hostnames: ["www.tiktok.com", "vt.tiktok.com"],
    },
  ];
  function go(e) {
    if (!e) return;
    const t = new URL(e);
    for (const r of wo)
      if (r.origin === t.origin || (r.hostnames || []).includes(t.hostname))
        return r;
  }
  function Qe(e) {
    try {
      return JSON.parse(e);
    } catch {}
  }
  var ln =
      typeof global == "object" && global && global.Object === Object && global,
    mo = typeof self == "object" && self && self.Object === Object && self,
    xe = ln || mo || Function("return this")(),
    At = xe.Symbol,
    fn = Object.prototype,
    bo = fn.hasOwnProperty,
    yo = fn.toString,
    et = At ? At.toStringTag : void 0;
  function vo(e) {
    var t = bo.call(e, et),
      r = e[et];
    try {
      e[et] = void 0;
      var n = !0;
    } catch {}
    var i = yo.call(e);
    return (n && (t ? (e[et] = r) : delete e[et]), i);
  }
  var Eo = Object.prototype,
    xo = Eo.toString;
  function _o(e) {
    return xo.call(e);
  }
  var Ao = "[object Null]",
    So = "[object Undefined]",
    dn = At ? At.toStringTag : void 0;
  function tt(e) {
    return e == null
      ? e === void 0
        ? So
        : Ao
      : dn && dn in Object(e)
        ? vo(e)
        : _o(e);
  }
  function nr(e) {
    return e != null && typeof e == "object";
  }
  var Oo = Array.isArray;
  function hn(e) {
    var t = typeof e;
    return e != null && (t == "object" || t == "function");
  }
  var Ro = "[object AsyncFunction]",
    Fo = "[object Function]",
    Co = "[object GeneratorFunction]",
    To = "[object Proxy]";
  function pn(e) {
    if (!hn(e)) return !1;
    var t = tt(e);
    return t == Fo || t == Co || t == Ro || t == To;
  }
  var ir = xe["__core-js_shared__"],
    wn = (function () {
      var e = /[^.]+$/.exec((ir && ir.keys && ir.keys.IE_PROTO) || "");
      return e ? "Symbol(src)_1." + e : "";
    })();
  function ko(e) {
    return !!wn && wn in e;
  }
  var Bo = Function.prototype,
    Po = Bo.toString;
  function Re(e) {
    if (e != null) {
      try {
        return Po.call(e);
      } catch {}
      try {
        return e + "";
      } catch {}
    }
    return "";
  }
  var No = /[\\^$.*+?()[\]{}|]/g,
    Do = /^\[object .+?Constructor\]$/,
    Lo = Function.prototype,
    Uo = Object.prototype,
    Io = Lo.toString,
    jo = Uo.hasOwnProperty,
    Mo = RegExp(
      "^" +
        Io.call(jo)
          .replace(No, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?",
          ) +
        "$",
    );
  function qo(e) {
    if (!hn(e) || ko(e)) return !1;
    var t = pn(e) ? Mo : Do;
    return t.test(Re(e));
  }
  function Vo(e, t) {
    return e == null ? void 0 : e[t];
  }
  function rt(e, t) {
    var r = Vo(e, t);
    return qo(r) ? r : void 0;
  }
  var or = rt(xe, "WeakMap"),
    Ho = 9007199254740991;
  function gn(e) {
    return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Ho;
  }
  function $o(e) {
    return e != null && gn(e.length) && !pn(e);
  }
  var Wo = Object.prototype;
  function mn(e) {
    var t = e && e.constructor,
      r = (typeof t == "function" && t.prototype) || Wo;
    return e === r;
  }
  var zo = "[object Arguments]";
  function bn(e) {
    return nr(e) && tt(e) == zo;
  }
  var yn = Object.prototype,
    Go = yn.hasOwnProperty,
    Jo = yn.propertyIsEnumerable,
    Xo = bn(
      (function () {
        return arguments;
      })(),
    )
      ? bn
      : function (e) {
          return nr(e) && Go.call(e, "callee") && !Jo.call(e, "callee");
        };
  function Ko() {
    return !1;
  }
  var vn =
      typeof exports == "object" && exports && !exports.nodeType && exports,
    En =
      vn && typeof module == "object" && module && !module.nodeType && module,
    Zo = En && En.exports === vn,
    xn = Zo ? xe.Buffer : void 0,
    Yo = xn ? xn.isBuffer : void 0,
    Qo = Yo || Ko,
    es = "[object Arguments]",
    ts = "[object Array]",
    rs = "[object Boolean]",
    ns = "[object Date]",
    is = "[object Error]",
    os = "[object Function]",
    ss = "[object Map]",
    as = "[object Number]",
    us = "[object Object]",
    cs = "[object RegExp]",
    ls = "[object Set]",
    fs = "[object String]",
    ds = "[object WeakMap]",
    hs = "[object ArrayBuffer]",
    ps = "[object DataView]",
    ws = "[object Float32Array]",
    gs = "[object Float64Array]",
    ms = "[object Int8Array]",
    bs = "[object Int16Array]",
    ys = "[object Int32Array]",
    vs = "[object Uint8Array]",
    Es = "[object Uint8ClampedArray]",
    xs = "[object Uint16Array]",
    _s = "[object Uint32Array]",
    W = {};
  ((W[ws] = W[gs] = W[ms] = W[bs] = W[ys] = W[vs] = W[Es] = W[xs] = W[_s] = !0),
    (W[es] =
      W[ts] =
      W[hs] =
      W[rs] =
      W[ps] =
      W[ns] =
      W[is] =
      W[os] =
      W[ss] =
      W[as] =
      W[us] =
      W[cs] =
      W[ls] =
      W[fs] =
      W[ds] =
        !1));
  function As(e) {
    return nr(e) && gn(e.length) && !!W[tt(e)];
  }
  function Ss(e) {
    return function (t) {
      return e(t);
    };
  }
  var _n =
      typeof exports == "object" && exports && !exports.nodeType && exports,
    nt =
      _n && typeof module == "object" && module && !module.nodeType && module,
    Os = nt && nt.exports === _n,
    sr = Os && ln.process,
    An = (function () {
      try {
        var e = nt && nt.require && nt.require("util").types;
        return e || (sr && sr.binding && sr.binding("util"));
      } catch {}
    })(),
    Sn = An && An.isTypedArray,
    Rs = Sn ? Ss(Sn) : As;
  function Fs(e, t) {
    return function (r) {
      return e(t(r));
    };
  }
  var Cs = Fs(Object.keys, Object),
    Ts = Object.prototype,
    ks = Ts.hasOwnProperty;
  function Bs(e) {
    if (!mn(e)) return Cs(e);
    var t = [];
    for (var r in Object(e)) ks.call(e, r) && r != "constructor" && t.push(r);
    return t;
  }
  var ar = rt(xe, "Map"),
    ur = rt(xe, "DataView"),
    cr = rt(xe, "Promise"),
    lr = rt(xe, "Set"),
    On = "[object Map]",
    Ps = "[object Object]",
    Rn = "[object Promise]",
    Fn = "[object Set]",
    Cn = "[object WeakMap]",
    Tn = "[object DataView]",
    Ns = Re(ur),
    Ds = Re(ar),
    Ls = Re(cr),
    Us = Re(lr),
    Is = Re(or),
    Fe = tt;
  ((ur && Fe(new ur(new ArrayBuffer(1))) != Tn) ||
    (ar && Fe(new ar()) != On) ||
    (cr && Fe(cr.resolve()) != Rn) ||
    (lr && Fe(new lr()) != Fn) ||
    (or && Fe(new or()) != Cn)) &&
    (Fe = function (e) {
      var t = tt(e),
        r = t == Ps ? e.constructor : void 0,
        n = r ? Re(r) : "";
      if (n)
        switch (n) {
          case Ns:
            return Tn;
          case Ds:
            return On;
          case Ls:
            return Rn;
          case Us:
            return Fn;
          case Is:
            return Cn;
        }
      return t;
    });
  var js = "[object Map]",
    Ms = "[object Set]",
    qs = Object.prototype,
    Vs = qs.hasOwnProperty;
  function fr(e) {
    if (e == null) return !0;
    if (
      $o(e) &&
      (Oo(e) ||
        typeof e == "string" ||
        typeof e.splice == "function" ||
        Qo(e) ||
        Rs(e) ||
        Xo(e))
    )
      return !e.length;
    var t = Fe(e);
    if (t == js || t == Ms) return !e.size;
    if (mn(e)) return !Bs(e).length;
    for (var r in e) if (Vs.call(e, r)) return !1;
    return !0;
  }
  const kn = [
    "code",
    "status",
    "statusCode",
    "type",
    "errno",
    "syscall",
    "path",
  ];
  function dr(e) {
    if (e instanceof Error) {
      const t = e,
        r = {
          name: e.name || "Error",
          message: e.message || "",
          stack: e.stack,
        };
      e.cause && (r.cause = dr(e.cause));
      for (const n of kn) {
        const i = t[n];
        i !== void 0 && $s(r, n, i);
      }
      return r;
    }
    return { name: "Error", message: Pn(e) };
  }
  function Bn(e) {
    if (e instanceof Error) return e;
    if (!Hs(e)) return new Error(Pn(e));
    const t = new Error(e.message, { cause: e.cause ? Bn(e.cause) : void 0 });
    ((t.name = e.name || "Error"), e.stack && (t.stack = e.stack));
    const r = t;
    for (const n of kn) {
      const i = e[n];
      i !== void 0 && (r[n] = i);
    }
    return t;
  }
  function Hs(e) {
    return (
      typeof e == "object" &&
      e !== null &&
      typeof e.name == "string" &&
      typeof e.message == "string"
    );
  }
  function $s(e, t, r) {
    if (r != null)
      switch (t) {
        case "status":
        case "statusCode": {
          const n = Number(r);
          Number.isFinite(n) && (e[t] = n);
          break;
        }
        case "code":
        case "errno": {
          typeof r == "string" || typeof r == "number"
            ? (e[t] = r)
            : (e[t] = String(r));
          break;
        }
        case "type":
        case "syscall":
        case "path": {
          e[t] = String(r);
          break;
        }
      }
  }
  function Pn(e) {
    return e == null
      ? String(e)
      : typeof e == "string"
        ? e
        : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint"
          ? String(e)
          : "";
  }
  const Ws = "socialext:event",
    zs = 3e4,
    Gs = 1831565813,
    je = "com.socialext";
  function St(e) {
    return `${Ws}:${e}`;
  }
  function hr(e) {
    return `${St(e)}:response`;
  }
  const Ce = window;
  function Ot(e, t) {
    return Ce.dispatchEvent(
      new CustomEvent(e, {
        detail: t,
        bubbles: !1,
        cancelable: !1,
        composed: !1,
      }),
    );
  }
  function Rt(e, t) {
    let r = e;
    for (let n = 0; n < t.length; n++)
      ((r ^= t.charCodeAt(n)), (r = Math.imul(r, 16777619)));
    return r >>> 0;
  }
  function Nn(e, t, r) {
    let n = Rt(Gs, je);
    return ((n = Rt(n, e)), (n = Rt(n, t)), Rt(n, r));
  }
  function Js(e, t, r, n) {
    const i = Nn(e, t, r);
    return (n + i).toString(36);
  }
  function Xs(e, t, r, n) {
    if (!/^[0-9a-z]+$/.test(n)) return;
    const i = Nn(e, t, r),
      o = Number.parseInt(n, 36) - i;
    if (Number.isSafeInteger(o)) return o;
  }
  function Ft(e, t, r) {
    const n = Date.now();
    return { timestamp: n, token: Js(e, t, r, n) };
  }
  function Dn(e) {
    if (typeof e != "object" || e === null) return !1;
    const t = e;
    return (
      t.namespace === je &&
      typeof t.phase == "string" &&
      typeof t.requestId == "string" &&
      typeof t.token == "string" &&
      Number.isSafeInteger(t.timestamp)
    );
  }
  function Ln(e, t) {
    const r = t.phase,
      n = Xs(e, r, t.requestId, t.token);
    return n && n === t.timestamp;
  }
  function pr(e, ...[t]) {
    const r = crypto.randomUUID(),
      n = "notification",
      i = Ft(e, n, r),
      o = { phase: n, namespace: je, requestId: r, ...i, data: t };
    return Ot(St(e), o);
  }
  function Te(e, ...[t, r]) {
    const n = crypto.randomUUID(),
      i = hr(e),
      o = (r == null ? void 0 : r.timeout) ?? zs;
    return new Promise((s, u) => {
      let h;
      const c = () => {
          (Ce.removeEventListener(i, p),
            h !== void 0 && (Ce.clearTimeout(h), (h = void 0)));
        },
        p = (m) => {
          const O = m.detail;
          Dn(O) &&
            O.phase === "response" &&
            O.requestId === n &&
            Ln(e, O) &&
            (c(), O.error ? u(Bn(O.error)) : s(O.result));
        };
      (Ce.addEventListener(i, p),
        (h = Ce.setTimeout(() => {
          h !== void 0 && (c(), u(new Error("event response timeout.")));
        }, o)));
      const w = "request",
        A = Ft(e, w, n),
        y = { phase: w, namespace: je, requestId: n, ...A, data: t };
      try {
        Ot(St(e), y);
      } catch (m) {
        (c(), u(m));
      }
    });
  }
  function ne(e, t) {
    const r = St(e),
      n = (i) => {
        const o = i.detail;
        if (!Dn(o) || !Ln(e, o)) return;
        if (o.phase === "notification") return void t(o.data);
        if (o.phase !== "request") return;
        const s = "response";
        Promise.resolve(t(o.data))
          .then((u) => {
            const h = Ft(e, s, o.requestId),
              c = {
                phase: s,
                requestId: o.requestId,
                ...h,
                result: u,
                namespace: je,
              };
            Ot(hr(e), c);
          })
          .catch((u) => {
            const h = Ft(e, s, o.requestId),
              c = {
                phase: s,
                namespace: je,
                requestId: o.requestId,
                ...h,
                error: dr(u),
              };
            Ot(hr(e), c);
          });
      };
    return (Ce.addEventListener(r, n), () => Ce.removeEventListener(r, n));
  }
  function Ct(e, t = 0) {
    let r = t;
    for (let n = 0; n < e.length; n++)
      ((r = (r << 5) - r + e.charCodeAt(n)), (r |= 0));
    return r >>> 0;
  }
  function Ks(e) {
    const t = Ct(e, 2166136261),
      r = Ct(e, 2654435769),
      n = Ct(e, 2246822507),
      i = Ct(e, 3266489909);
    return [t, r, n, i].map((o) => o.toString(16).padStart(8, "0")).join("");
  }
  const Zs = "com.socialext";
  function Ys(e = "GET", t = "", r) {
    const n = e.toUpperCase(),
      i = r.toString(),
      o = [n, t, i, Zs].join("|");
    return Ks(o);
  }
  const Qs = 1800 * 1e3;
  function ea(e = "GET", t = "", r, n) {
    return Ys(e, t, r) === n && Date.now() - r <= Qs;
  }
  function ke(e) {
    Un[jn] = async (t, r, n, i) => {
      var o;
      try {
        if (i) {
          const u = await ta(t, r, n, i);
          if (u) return { result: u };
        }
        if (!ea(t.method, t.url, n, r))
          throw new Error(
            "\u7B7E\u540D\u9A8C\u8BC1\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\uFF01",
          );
        return { result: (await e(t)).data };
      } catch (s) {
        console.warn(s);
        const u = (o = s.response) == null ? void 0 : o.data;
        return { error: dr(s), result: u };
      }
    };
  }
  const Un = window,
    ta = (function () {
      let e = null,
        t = !1,
        r = null;
      const n = async () => {
        const i = await Te("advanced", null, { timeout: 1e4 }).catch(() => "");
        if (!i.startsWith("blob:")) return;
        const o = await import(i)
          .then((s) => s.default)
          .catch((s) => console.error(s))
          .finally(() => URL.revokeObjectURL(i));
        if (typeof o == "function") return ((e = o), e);
      };
      return async (...i) => {
        if (e) return e(...i);
        if (t && !r) return;
        const s = await (r ??
          (r = n().finally(() => {
            ((t = !0), (r = null));
          })));
        return s == null ? void 0 : s(...i);
      };
    })(),
    Be = () => Un[jn],
    In = () => {
      const e = window.location.hostname;
      if (!e) return;
      const t = e.split(":")[0];
      if (t === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(t)) return;
      const r = t.split(".");
      return r.length >= 2 ? "." + r.slice(-2).join(".") : t;
    },
    jn = "__SOCIALEXT__REQUEST__";
  async function ra(e, t) {
    var u;
    if (!e || !e.ok) return;
    const r = e.headers.get("content-type");
    if (
      !(
        (u = r == null ? void 0 : r.includes) != null &&
        u.call(r, "application/json")
      )
    )
      return;
    let n;
    try {
      const c = e.clone().body.getReader(),
        p = new TextDecoder("utf-8");
      let w = "";
      for (;;) {
        const { value: A, done: y } = await c.read();
        if (y) break;
        w += p.decode(A, { stream: !0 });
      }
      ((w += p.decode()), (n = Qe(w)));
    } catch (h) {
      console.warn(h);
      return;
    }
    if (fr(n)) return;
    let i;
    const o = t[1];
    o != null &&
      o.body &&
      typeof o.body == "string" &&
      (i = Qe(o == null ? void 0 : o.body));
    const s = {
      url: e.url,
      method: (o == null ? void 0 : o.method) || "GET",
      body: i,
      result: n,
    };
    pr("onHttpResponse", s);
  }
  function na(e, t) {
    if (!t || !e) return !1;
    try {
      if (typeof e == "string") {
        if (e.startsWith("/") || e.startsWith(location.origin)) return !0;
        if (!e.startsWith("https://")) return !1;
        if (e.includes(t)) return !0;
      }
      return e instanceof URL
        ? e.hostname.endsWith(t)
        : e instanceof Request
          ? e.url.includes(t)
          : !1;
    } catch {
      return !1;
    }
  }
  function Tt() {
    const e = In();
    if (!e) return;
    const t = window.fetch;
    window.fetch = async function (...r) {
      if (na(r[0], e)) {
        const n = await t.apply(this, arguments);
        try {
          ra(n, r);
        } catch (i) {
          console.warn(i);
        }
        return n;
      }
      return t.apply(this, arguments);
    };
  }
  function Mn(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  const { toString: ia } = Object.prototype,
    { getPrototypeOf: wr } = Object,
    { iterator: kt, toStringTag: qn } = Symbol,
    Bt = ((e) => (t) => {
      const r = ia.call(t);
      return e[r] || (e[r] = r.slice(8, -1).toLowerCase());
    })(Object.create(null)),
    ce = (e) => ((e = e.toLowerCase()), (t) => Bt(t) === e),
    Pt = (e) => (t) => typeof t === e,
    { isArray: Me } = Array,
    it = Pt("undefined");
  function ot(e) {
    return (
      e !== null &&
      !it(e) &&
      e.constructor !== null &&
      !it(e.constructor) &&
      X(e.constructor.isBuffer) &&
      e.constructor.isBuffer(e)
    );
  }
  const Vn = ce("ArrayBuffer");
  function oa(e) {
    let t;
    return (
      typeof ArrayBuffer < "u" && ArrayBuffer.isView
        ? (t = ArrayBuffer.isView(e))
        : (t = e && e.buffer && Vn(e.buffer)),
      t
    );
  }
  const sa = Pt("string"),
    X = Pt("function"),
    Hn = Pt("number"),
    st = (e) => e !== null && typeof e == "object",
    aa = (e) => e === !0 || e === !1,
    Nt = (e) => {
      if (Bt(e) !== "object") return !1;
      const t = wr(e);
      return (
        (t === null ||
          t === Object.prototype ||
          Object.getPrototypeOf(t) === null) &&
        !(qn in e) &&
        !(kt in e)
      );
    },
    ua = (e) => {
      if (!st(e) || ot(e)) return !1;
      try {
        return (
          Object.keys(e).length === 0 &&
          Object.getPrototypeOf(e) === Object.prototype
        );
      } catch {
        return !1;
      }
    },
    ca = ce("Date"),
    la = ce("File"),
    fa = ce("Blob"),
    da = ce("FileList"),
    ha = (e) => st(e) && X(e.pipe),
    pa = (e) => {
      let t;
      return (
        e &&
        ((typeof FormData == "function" && e instanceof FormData) ||
          (X(e.append) &&
            ((t = Bt(e)) === "formdata" ||
              (t === "object" &&
                X(e.toString) &&
                e.toString() === "[object FormData]"))))
      );
    },
    wa = ce("URLSearchParams"),
    [ga, ma, ba, ya] = ["ReadableStream", "Request", "Response", "Headers"].map(
      ce,
    ),
    va = (e) =>
      e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  function at(e, t, { allOwnKeys: r = !1 } = {}) {
    if (e === null || typeof e > "u") return;
    let n, i;
    if ((typeof e != "object" && (e = [e]), Me(e)))
      for (n = 0, i = e.length; n < i; n++) t.call(null, e[n], n, e);
    else {
      if (ot(e)) return;
      const o = r ? Object.getOwnPropertyNames(e) : Object.keys(e),
        s = o.length;
      let u;
      for (n = 0; n < s; n++) ((u = o[n]), t.call(null, e[u], u, e));
    }
  }
  function $n(e, t) {
    if (ot(e)) return null;
    t = t.toLowerCase();
    const r = Object.keys(e);
    let n = r.length,
      i;
    for (; n-- > 0; ) if (((i = r[n]), t === i.toLowerCase())) return i;
    return null;
  }
  const Pe =
      typeof globalThis < "u"
        ? globalThis
        : typeof self < "u"
          ? self
          : typeof window < "u"
            ? window
            : global,
    Wn = (e) => !it(e) && e !== Pe;
  function gr() {
    const { caseless: e } = (Wn(this) && this) || {},
      t = {},
      r = (n, i) => {
        const o = (e && $n(t, i)) || i;
        Nt(t[o]) && Nt(n)
          ? (t[o] = gr(t[o], n))
          : Nt(n)
            ? (t[o] = gr({}, n))
            : Me(n)
              ? (t[o] = n.slice())
              : (t[o] = n);
      };
    for (let n = 0, i = arguments.length; n < i; n++)
      arguments[n] && at(arguments[n], r);
    return t;
  }
  const Ea = (e, t, r, { allOwnKeys: n } = {}) => (
      at(
        t,
        (i, o) => {
          r && X(i) ? (e[o] = Mn(i, r)) : (e[o] = i);
        },
        { allOwnKeys: n },
      ),
      e
    ),
    xa = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
    _a = (e, t, r, n) => {
      ((e.prototype = Object.create(t.prototype, n)),
        (e.prototype.constructor = e),
        Object.defineProperty(e, "super", { value: t.prototype }),
        r && Object.assign(e.prototype, r));
    },
    Aa = (e, t, r, n) => {
      let i, o, s;
      const u = {};
      if (((t = t || {}), e == null)) return t;
      do {
        for (i = Object.getOwnPropertyNames(e), o = i.length; o-- > 0; )
          ((s = i[o]),
            (!n || n(s, e, t)) && !u[s] && ((t[s] = e[s]), (u[s] = !0)));
        e = r !== !1 && wr(e);
      } while (e && (!r || r(e, t)) && e !== Object.prototype);
      return t;
    },
    Sa = (e, t, r) => {
      ((e = String(e)),
        (r === void 0 || r > e.length) && (r = e.length),
        (r -= t.length));
      const n = e.indexOf(t, r);
      return n !== -1 && n === r;
    },
    Oa = (e) => {
      if (!e) return null;
      if (Me(e)) return e;
      let t = e.length;
      if (!Hn(t)) return null;
      const r = new Array(t);
      for (; t-- > 0; ) r[t] = e[t];
      return r;
    },
    Ra = (
      (e) => (t) =>
        e && t instanceof e
    )(typeof Uint8Array < "u" && wr(Uint8Array)),
    Fa = (e, t) => {
      const n = (e && e[kt]).call(e);
      let i;
      for (; (i = n.next()) && !i.done; ) {
        const o = i.value;
        t.call(e, o[0], o[1]);
      }
    },
    Ca = (e, t) => {
      let r;
      const n = [];
      for (; (r = e.exec(t)) !== null; ) n.push(r);
      return n;
    },
    Ta = ce("HTMLFormElement"),
    ka = (e) =>
      e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (r, n, i) {
        return n.toUpperCase() + i;
      }),
    zn = (
      ({ hasOwnProperty: e }) =>
      (t, r) =>
        e.call(t, r)
    )(Object.prototype),
    Ba = ce("RegExp"),
    Gn = (e, t) => {
      const r = Object.getOwnPropertyDescriptors(e),
        n = {};
      (at(r, (i, o) => {
        let s;
        (s = t(i, o, e)) !== !1 && (n[o] = s || i);
      }),
        Object.defineProperties(e, n));
    },
    Pa = (e) => {
      Gn(e, (t, r) => {
        if (X(e) && ["arguments", "caller", "callee"].indexOf(r) !== -1)
          return !1;
        const n = e[r];
        if (X(n)) {
          if (((t.enumerable = !1), "writable" in t)) {
            t.writable = !1;
            return;
          }
          t.set ||
            (t.set = () => {
              throw Error("Can not rewrite read-only method '" + r + "'");
            });
        }
      });
    },
    Na = (e, t) => {
      const r = {},
        n = (i) => {
          i.forEach((o) => {
            r[o] = !0;
          });
        };
      return (Me(e) ? n(e) : n(String(e).split(t)), r);
    },
    Da = () => {},
    La = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
  function Ua(e) {
    return !!(e && X(e.append) && e[qn] === "FormData" && e[kt]);
  }
  const Ia = (e) => {
      const t = new Array(10),
        r = (n, i) => {
          if (st(n)) {
            if (t.indexOf(n) >= 0) return;
            if (ot(n)) return n;
            if (!("toJSON" in n)) {
              t[i] = n;
              const o = Me(n) ? [] : {};
              return (
                at(n, (s, u) => {
                  const h = r(s, i + 1);
                  !it(h) && (o[u] = h);
                }),
                (t[i] = void 0),
                o
              );
            }
          }
          return n;
        };
      return r(e, 0);
    },
    ja = ce("AsyncFunction"),
    Ma = (e) => e && (st(e) || X(e)) && X(e.then) && X(e.catch),
    Jn = ((e, t) =>
      e
        ? setImmediate
        : t
          ? ((r, n) => (
              Pe.addEventListener(
                "message",
                ({ source: i, data: o }) => {
                  i === Pe && o === r && n.length && n.shift()();
                },
                !1,
              ),
              (i) => {
                (n.push(i), Pe.postMessage(r, "*"));
              }
            ))(`axios@${Math.random()}`, [])
          : (r) => setTimeout(r))(
      typeof setImmediate == "function",
      X(Pe.postMessage),
    ),
    qa =
      typeof queueMicrotask < "u"
        ? queueMicrotask.bind(Pe)
        : (typeof process < "u" && process.nextTick) || Jn,
    g = {
      isArray: Me,
      isArrayBuffer: Vn,
      isBuffer: ot,
      isFormData: pa,
      isArrayBufferView: oa,
      isString: sa,
      isNumber: Hn,
      isBoolean: aa,
      isObject: st,
      isPlainObject: Nt,
      isEmptyObject: ua,
      isReadableStream: ga,
      isRequest: ma,
      isResponse: ba,
      isHeaders: ya,
      isUndefined: it,
      isDate: ca,
      isFile: la,
      isBlob: fa,
      isRegExp: Ba,
      isFunction: X,
      isStream: ha,
      isURLSearchParams: wa,
      isTypedArray: Ra,
      isFileList: da,
      forEach: at,
      merge: gr,
      extend: Ea,
      trim: va,
      stripBOM: xa,
      inherits: _a,
      toFlatObject: Aa,
      kindOf: Bt,
      kindOfTest: ce,
      endsWith: Sa,
      toArray: Oa,
      forEachEntry: Fa,
      matchAll: Ca,
      isHTMLForm: Ta,
      hasOwnProperty: zn,
      hasOwnProp: zn,
      reduceDescriptors: Gn,
      freezeMethods: Pa,
      toObjectSet: Na,
      toCamelCase: ka,
      noop: Da,
      toFiniteNumber: La,
      findKey: $n,
      global: Pe,
      isContextDefined: Wn,
      isSpecCompliantForm: Ua,
      toJSONObject: Ia,
      isAsyncFn: ja,
      isThenable: Ma,
      setImmediate: Jn,
      asap: qa,
      isIterable: (e) => e != null && X(e[kt]),
    };
  function D(e, t, r, n, i) {
    (Error.call(this),
      Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : (this.stack = new Error().stack),
      (this.message = e),
      (this.name = "AxiosError"),
      t && (this.code = t),
      r && (this.config = r),
      n && (this.request = n),
      i && ((this.response = i), (this.status = i.status ? i.status : null)));
  }
  g.inherits(D, Error, {
    toJSON: function () {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: g.toJSONObject(this.config),
        code: this.code,
        status: this.status,
      };
    },
  });
  const Xn = D.prototype,
    Kn = {};
  ([
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL",
  ].forEach((e) => {
    Kn[e] = { value: e };
  }),
    Object.defineProperties(D, Kn),
    Object.defineProperty(Xn, "isAxiosError", { value: !0 }),
    (D.from = (e, t, r, n, i, o) => {
      const s = Object.create(Xn);
      return (
        g.toFlatObject(
          e,
          s,
          function (h) {
            return h !== Error.prototype;
          },
          (u) => u !== "isAxiosError",
        ),
        D.call(s, e.message, t, r, n, i),
        (s.cause = e),
        (s.name = e.name),
        o && Object.assign(s, o),
        s
      );
    }));
  const Va = null;
  function mr(e) {
    return g.isPlainObject(e) || g.isArray(e);
  }
  function Zn(e) {
    return g.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function Yn(e, t, r) {
    return e
      ? e
          .concat(t)
          .map(function (i, o) {
            return ((i = Zn(i)), !r && o ? "[" + i + "]" : i);
          })
          .join(r ? "." : "")
      : t;
  }
  function Ha(e) {
    return g.isArray(e) && !e.some(mr);
  }
  const $a = g.toFlatObject(g, {}, null, function (t) {
    return /^is[A-Z]/.test(t);
  });
  function Dt(e, t, r) {
    if (!g.isObject(e)) throw new TypeError("target must be an object");
    ((t = t || new FormData()),
      (r = g.toFlatObject(
        r,
        { metaTokens: !0, dots: !1, indexes: !1 },
        !1,
        function (O, R) {
          return !g.isUndefined(R[O]);
        },
      )));
    const n = r.metaTokens,
      i = r.visitor || p,
      o = r.dots,
      s = r.indexes,
      h = (r.Blob || (typeof Blob < "u" && Blob)) && g.isSpecCompliantForm(t);
    if (!g.isFunction(i)) throw new TypeError("visitor must be a function");
    function c(m) {
      if (m === null) return "";
      if (g.isDate(m)) return m.toISOString();
      if (g.isBoolean(m)) return m.toString();
      if (!h && g.isBlob(m))
        throw new D("Blob is not supported. Use a Buffer instead.");
      return g.isArrayBuffer(m) || g.isTypedArray(m)
        ? h && typeof Blob == "function"
          ? new Blob([m])
          : Buffer.from(m)
        : m;
    }
    function p(m, O, R) {
      let T = m;
      if (m && !R && typeof m == "object") {
        if (g.endsWith(O, "{}"))
          ((O = n ? O : O.slice(0, -2)), (m = JSON.stringify(m)));
        else if (
          (g.isArray(m) && Ha(m)) ||
          ((g.isFileList(m) || g.endsWith(O, "[]")) && (T = g.toArray(m)))
        )
          return (
            (O = Zn(O)),
            T.forEach(function (L, M) {
              !(g.isUndefined(L) || L === null) &&
                t.append(
                  s === !0 ? Yn([O], M, o) : s === null ? O : O + "[]",
                  c(L),
                );
            }),
            !1
          );
      }
      return mr(m) ? !0 : (t.append(Yn(R, O, o), c(m)), !1);
    }
    const w = [],
      A = Object.assign($a, {
        defaultVisitor: p,
        convertValue: c,
        isVisitable: mr,
      });
    function y(m, O) {
      if (!g.isUndefined(m)) {
        if (w.indexOf(m) !== -1)
          throw Error("Circular reference detected in " + O.join("."));
        (w.push(m),
          g.forEach(m, function (T, k) {
            (!(g.isUndefined(T) || T === null) &&
              i.call(t, T, g.isString(k) ? k.trim() : k, O, A)) === !0 &&
              y(T, O ? O.concat(k) : [k]);
          }),
          w.pop());
      }
    }
    if (!g.isObject(e)) throw new TypeError("data must be an object");
    return (y(e), t);
  }
  function Qn(e) {
    const t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0",
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (n) {
      return t[n];
    });
  }
  function br(e, t) {
    ((this._pairs = []), e && Dt(e, this, t));
  }
  const ei = br.prototype;
  ((ei.append = function (t, r) {
    this._pairs.push([t, r]);
  }),
    (ei.toString = function (t) {
      const r = t
        ? function (n) {
            return t.call(this, n, Qn);
          }
        : Qn;
      return this._pairs
        .map(function (i) {
          return r(i[0]) + "=" + r(i[1]);
        }, "")
        .join("&");
    }));
  function Wa(e) {
    return encodeURIComponent(e)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  }
  function ti(e, t, r) {
    if (!t) return e;
    const n = (r && r.encode) || Wa;
    g.isFunction(r) && (r = { serialize: r });
    const i = r && r.serialize;
    let o;
    if (
      (i
        ? (o = i(t, r))
        : (o = g.isURLSearchParams(t)
            ? t.toString()
            : new br(t, r).toString(n)),
      o)
    ) {
      const s = e.indexOf("#");
      (s !== -1 && (e = e.slice(0, s)),
        (e += (e.indexOf("?") === -1 ? "?" : "&") + o));
    }
    return e;
  }
  class ri {
    constructor() {
      this.handlers = [];
    }
    use(t, r, n) {
      return (
        this.handlers.push({
          fulfilled: t,
          rejected: r,
          synchronous: n ? n.synchronous : !1,
          runWhen: n ? n.runWhen : null,
        }),
        this.handlers.length - 1
      );
    }
    eject(t) {
      this.handlers[t] && (this.handlers[t] = null);
    }
    clear() {
      this.handlers && (this.handlers = []);
    }
    forEach(t) {
      g.forEach(this.handlers, function (n) {
        n !== null && t(n);
      });
    }
  }
  const ni = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1,
    },
    za = {
      isBrowser: !0,
      classes: {
        URLSearchParams: typeof URLSearchParams < "u" ? URLSearchParams : br,
        FormData: typeof FormData < "u" ? FormData : null,
        Blob: typeof Blob < "u" ? Blob : null,
      },
      protocols: ["http", "https", "file", "blob", "url", "data"],
    },
    yr = typeof window < "u" && typeof document < "u",
    vr = (typeof navigator == "object" && navigator) || void 0,
    Ga =
      yr &&
      (!vr || ["ReactNative", "NativeScript", "NS"].indexOf(vr.product) < 0),
    Ja =
      typeof WorkerGlobalScope < "u" &&
      self instanceof WorkerGlobalScope &&
      typeof self.importScripts == "function",
    Xa = (yr && window.location.href) || "http://localhost",
    G = {
      ...Object.freeze(
        Object.defineProperty(
          {
            __proto__: null,
            hasBrowserEnv: yr,
            hasStandardBrowserEnv: Ga,
            hasStandardBrowserWebWorkerEnv: Ja,
            navigator: vr,
            origin: Xa,
          },
          Symbol.toStringTag,
          { value: "Module" },
        ),
      ),
      ...za,
    };
  function Ka(e, t) {
    return Dt(e, new G.classes.URLSearchParams(), {
      visitor: function (r, n, i, o) {
        return G.isNode && g.isBuffer(r)
          ? (this.append(n, r.toString("base64")), !1)
          : o.defaultVisitor.apply(this, arguments);
      },
      ...t,
    });
  }
  function Za(e) {
    return g
      .matchAll(/\w+|\[(\w*)]/g, e)
      .map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
  }
  function Ya(e) {
    const t = {},
      r = Object.keys(e);
    let n;
    const i = r.length;
    let o;
    for (n = 0; n < i; n++) ((o = r[n]), (t[o] = e[o]));
    return t;
  }
  function ii(e) {
    function t(r, n, i, o) {
      let s = r[o++];
      if (s === "__proto__") return !0;
      const u = Number.isFinite(+s),
        h = o >= r.length;
      return (
        (s = !s && g.isArray(i) ? i.length : s),
        h
          ? (g.hasOwnProp(i, s) ? (i[s] = [i[s], n]) : (i[s] = n), !u)
          : ((!i[s] || !g.isObject(i[s])) && (i[s] = []),
            t(r, n, i[s], o) && g.isArray(i[s]) && (i[s] = Ya(i[s])),
            !u)
      );
    }
    if (g.isFormData(e) && g.isFunction(e.entries)) {
      const r = {};
      return (
        g.forEachEntry(e, (n, i) => {
          t(Za(n), i, r, 0);
        }),
        r
      );
    }
    return null;
  }
  function Qa(e, t, r) {
    if (g.isString(e))
      try {
        return ((t || JSON.parse)(e), g.trim(e));
      } catch (n) {
        if (n.name !== "SyntaxError") throw n;
      }
    return (r || JSON.stringify)(e);
  }
  const ut = {
    transitional: ni,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function (t, r) {
        const n = r.getContentType() || "",
          i = n.indexOf("application/json") > -1,
          o = g.isObject(t);
        if ((o && g.isHTMLForm(t) && (t = new FormData(t)), g.isFormData(t)))
          return i ? JSON.stringify(ii(t)) : t;
        if (
          g.isArrayBuffer(t) ||
          g.isBuffer(t) ||
          g.isStream(t) ||
          g.isFile(t) ||
          g.isBlob(t) ||
          g.isReadableStream(t)
        )
          return t;
        if (g.isArrayBufferView(t)) return t.buffer;
        if (g.isURLSearchParams(t))
          return (
            r.setContentType(
              "application/x-www-form-urlencoded;charset=utf-8",
              !1,
            ),
            t.toString()
          );
        let u;
        if (o) {
          if (n.indexOf("application/x-www-form-urlencoded") > -1)
            return Ka(t, this.formSerializer).toString();
          if ((u = g.isFileList(t)) || n.indexOf("multipart/form-data") > -1) {
            const h = this.env && this.env.FormData;
            return Dt(
              u ? { "files[]": t } : t,
              h && new h(),
              this.formSerializer,
            );
          }
        }
        return o || i ? (r.setContentType("application/json", !1), Qa(t)) : t;
      },
    ],
    transformResponse: [
      function (t) {
        const r = this.transitional || ut.transitional,
          n = r && r.forcedJSONParsing,
          i = this.responseType === "json";
        if (g.isResponse(t) || g.isReadableStream(t)) return t;
        if (t && g.isString(t) && ((n && !this.responseType) || i)) {
          const s = !(r && r.silentJSONParsing) && i;
          try {
            return JSON.parse(t);
          } catch (u) {
            if (s)
              throw u.name === "SyntaxError"
                ? D.from(u, D.ERR_BAD_RESPONSE, this, null, this.response)
                : u;
          }
        }
        return t;
      },
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: G.classes.FormData, Blob: G.classes.Blob },
    validateStatus: function (t) {
      return t >= 200 && t < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0,
      },
    },
  };
  g.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
    ut.headers[e] = {};
  });
  const eu = g.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent",
    ]),
    tu = (e) => {
      const t = {};
      let r, n, i;
      return (
        e &&
          e
            .split(
              `
`,
            )
            .forEach(function (s) {
              ((i = s.indexOf(":")),
                (r = s.substring(0, i).trim().toLowerCase()),
                (n = s.substring(i + 1).trim()),
                !(!r || (t[r] && eu[r])) &&
                  (r === "set-cookie"
                    ? t[r]
                      ? t[r].push(n)
                      : (t[r] = [n])
                    : (t[r] = t[r] ? t[r] + ", " + n : n)));
            }),
        t
      );
    },
    oi = Symbol("internals");
  function ct(e) {
    return e && String(e).trim().toLowerCase();
  }
  function Lt(e) {
    return e === !1 || e == null ? e : g.isArray(e) ? e.map(Lt) : String(e);
  }
  function ru(e) {
    const t = Object.create(null),
      r = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let n;
    for (; (n = r.exec(e)); ) t[n[1]] = n[2];
    return t;
  }
  const nu = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
  function Er(e, t, r, n, i) {
    if (g.isFunction(n)) return n.call(this, t, r);
    if ((i && (t = r), !!g.isString(t))) {
      if (g.isString(n)) return t.indexOf(n) !== -1;
      if (g.isRegExp(n)) return n.test(t);
    }
  }
  function iu(e) {
    return e
      .trim()
      .toLowerCase()
      .replace(/([a-z\d])(\w*)/g, (t, r, n) => r.toUpperCase() + n);
  }
  function ou(e, t) {
    const r = g.toCamelCase(" " + t);
    ["get", "set", "has"].forEach((n) => {
      Object.defineProperty(e, n + r, {
        value: function (i, o, s) {
          return this[n].call(this, t, i, o, s);
        },
        configurable: !0,
      });
    });
  }
  let K = class {
    constructor(t) {
      t && this.set(t);
    }
    set(t, r, n) {
      const i = this;
      function o(u, h, c) {
        const p = ct(h);
        if (!p) throw new Error("header name must be a non-empty string");
        const w = g.findKey(i, p);
        (!w || i[w] === void 0 || c === !0 || (c === void 0 && i[w] !== !1)) &&
          (i[w || h] = Lt(u));
      }
      const s = (u, h) => g.forEach(u, (c, p) => o(c, p, h));
      if (g.isPlainObject(t) || t instanceof this.constructor) s(t, r);
      else if (g.isString(t) && (t = t.trim()) && !nu(t)) s(tu(t), r);
      else if (g.isObject(t) && g.isIterable(t)) {
        let u = {},
          h,
          c;
        for (const p of t) {
          if (!g.isArray(p))
            throw TypeError("Object iterator must return a key-value pair");
          u[(c = p[0])] = (h = u[c])
            ? g.isArray(h)
              ? [...h, p[1]]
              : [h, p[1]]
            : p[1];
        }
        s(u, r);
      } else t != null && o(r, t, n);
      return this;
    }
    get(t, r) {
      if (((t = ct(t)), t)) {
        const n = g.findKey(this, t);
        if (n) {
          const i = this[n];
          if (!r) return i;
          if (r === !0) return ru(i);
          if (g.isFunction(r)) return r.call(this, i, n);
          if (g.isRegExp(r)) return r.exec(i);
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(t, r) {
      if (((t = ct(t)), t)) {
        const n = g.findKey(this, t);
        return !!(n && this[n] !== void 0 && (!r || Er(this, this[n], n, r)));
      }
      return !1;
    }
    delete(t, r) {
      const n = this;
      let i = !1;
      function o(s) {
        if (((s = ct(s)), s)) {
          const u = g.findKey(n, s);
          u && (!r || Er(n, n[u], u, r)) && (delete n[u], (i = !0));
        }
      }
      return (g.isArray(t) ? t.forEach(o) : o(t), i);
    }
    clear(t) {
      const r = Object.keys(this);
      let n = r.length,
        i = !1;
      for (; n--; ) {
        const o = r[n];
        (!t || Er(this, this[o], o, t, !0)) && (delete this[o], (i = !0));
      }
      return i;
    }
    normalize(t) {
      const r = this,
        n = {};
      return (
        g.forEach(this, (i, o) => {
          const s = g.findKey(n, o);
          if (s) {
            ((r[s] = Lt(i)), delete r[o]);
            return;
          }
          const u = t ? iu(o) : String(o).trim();
          (u !== o && delete r[o], (r[u] = Lt(i)), (n[u] = !0));
        }),
        this
      );
    }
    concat(...t) {
      return this.constructor.concat(this, ...t);
    }
    toJSON(t) {
      const r = Object.create(null);
      return (
        g.forEach(this, (n, i) => {
          n != null &&
            n !== !1 &&
            (r[i] = t && g.isArray(n) ? n.join(", ") : n);
        }),
        r
      );
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([t, r]) => t + ": " + r).join(`
`);
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(t) {
      return t instanceof this ? t : new this(t);
    }
    static concat(t, ...r) {
      const n = new this(t);
      return (r.forEach((i) => n.set(i)), n);
    }
    static accessor(t) {
      const n = (this[oi] = this[oi] = { accessors: {} }).accessors,
        i = this.prototype;
      function o(s) {
        const u = ct(s);
        n[u] || (ou(i, s), (n[u] = !0));
      }
      return (g.isArray(t) ? t.forEach(o) : o(t), this);
    }
  };
  (K.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization",
  ]),
    g.reduceDescriptors(K.prototype, ({ value: e }, t) => {
      let r = t[0].toUpperCase() + t.slice(1);
      return {
        get: () => e,
        set(n) {
          this[r] = n;
        },
      };
    }),
    g.freezeMethods(K));
  function xr(e, t) {
    const r = this || ut,
      n = t || r,
      i = K.from(n.headers);
    let o = n.data;
    return (
      g.forEach(e, function (u) {
        o = u.call(r, o, i.normalize(), t ? t.status : void 0);
      }),
      i.normalize(),
      o
    );
  }
  function si(e) {
    return !!(e && e.__CANCEL__);
  }
  function qe(e, t, r) {
    (D.call(this, e ?? "canceled", D.ERR_CANCELED, t, r),
      (this.name = "CanceledError"));
  }
  g.inherits(qe, D, { __CANCEL__: !0 });
  function ai(e, t, r) {
    const n = r.config.validateStatus;
    !r.status || !n || n(r.status)
      ? e(r)
      : t(
          new D(
            "Request failed with status code " + r.status,
            [D.ERR_BAD_REQUEST, D.ERR_BAD_RESPONSE][
              Math.floor(r.status / 100) - 4
            ],
            r.config,
            r.request,
            r,
          ),
        );
  }
  function su(e) {
    const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return (t && t[1]) || "";
  }
  function au(e, t) {
    e = e || 10;
    const r = new Array(e),
      n = new Array(e);
    let i = 0,
      o = 0,
      s;
    return (
      (t = t !== void 0 ? t : 1e3),
      function (h) {
        const c = Date.now(),
          p = n[o];
        (s || (s = c), (r[i] = h), (n[i] = c));
        let w = o,
          A = 0;
        for (; w !== i; ) ((A += r[w++]), (w = w % e));
        if (((i = (i + 1) % e), i === o && (o = (o + 1) % e), c - s < t))
          return;
        const y = p && c - p;
        return y ? Math.round((A * 1e3) / y) : void 0;
      }
    );
  }
  function uu(e, t) {
    let r = 0,
      n = 1e3 / t,
      i,
      o;
    const s = (c, p = Date.now()) => {
      ((r = p), (i = null), o && (clearTimeout(o), (o = null)), e(...c));
    };
    return [
      (...c) => {
        const p = Date.now(),
          w = p - r;
        w >= n
          ? s(c, p)
          : ((i = c),
            o ||
              (o = setTimeout(() => {
                ((o = null), s(i));
              }, n - w)));
      },
      () => i && s(i),
    ];
  }
  const Ut = (e, t, r = 3) => {
      let n = 0;
      const i = au(50, 250);
      return uu((o) => {
        const s = o.loaded,
          u = o.lengthComputable ? o.total : void 0,
          h = s - n,
          c = i(h),
          p = s <= u;
        n = s;
        const w = {
          loaded: s,
          total: u,
          progress: u ? s / u : void 0,
          bytes: h,
          rate: c || void 0,
          estimated: c && u && p ? (u - s) / c : void 0,
          event: o,
          lengthComputable: u != null,
          [t ? "download" : "upload"]: !0,
        };
        e(w);
      }, r);
    },
    ui = (e, t) => {
      const r = e != null;
      return [(n) => t[0]({ lengthComputable: r, total: e, loaded: n }), t[1]];
    },
    ci =
      (e) =>
      (...t) =>
        g.asap(() => e(...t)),
    cu = G.hasStandardBrowserEnv
      ? ((e, t) => (r) => (
          (r = new URL(r, G.origin)),
          e.protocol === r.protocol &&
            e.host === r.host &&
            (t || e.port === r.port)
        ))(
          new URL(G.origin),
          G.navigator && /(msie|trident)/i.test(G.navigator.userAgent),
        )
      : () => !0,
    lu = G.hasStandardBrowserEnv
      ? {
          write(e, t, r, n, i, o) {
            const s = [e + "=" + encodeURIComponent(t)];
            (g.isNumber(r) && s.push("expires=" + new Date(r).toGMTString()),
              g.isString(n) && s.push("path=" + n),
              g.isString(i) && s.push("domain=" + i),
              o === !0 && s.push("secure"),
              (document.cookie = s.join("; ")));
          },
          read(e) {
            const t = document.cookie.match(
              new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"),
            );
            return t ? decodeURIComponent(t[3]) : null;
          },
          remove(e) {
            this.write(e, "", Date.now() - 864e5);
          },
        }
      : {
          write() {},
          read() {
            return null;
          },
          remove() {},
        };
  function fu(e) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
  }
  function du(e, t) {
    return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
  }
  function li(e, t, r) {
    let n = !fu(t);
    return e && (n || r == !1) ? du(e, t) : t;
  }
  const fi = (e) => (e instanceof K ? { ...e } : e);
  function Ne(e, t) {
    t = t || {};
    const r = {};
    function n(c, p, w, A) {
      return g.isPlainObject(c) && g.isPlainObject(p)
        ? g.merge.call({ caseless: A }, c, p)
        : g.isPlainObject(p)
          ? g.merge({}, p)
          : g.isArray(p)
            ? p.slice()
            : p;
    }
    function i(c, p, w, A) {
      if (g.isUndefined(p)) {
        if (!g.isUndefined(c)) return n(void 0, c, w, A);
      } else return n(c, p, w, A);
    }
    function o(c, p) {
      if (!g.isUndefined(p)) return n(void 0, p);
    }
    function s(c, p) {
      if (g.isUndefined(p)) {
        if (!g.isUndefined(c)) return n(void 0, c);
      } else return n(void 0, p);
    }
    function u(c, p, w) {
      if (w in t) return n(c, p);
      if (w in e) return n(void 0, c);
    }
    const h = {
      url: o,
      method: o,
      data: o,
      baseURL: s,
      transformRequest: s,
      transformResponse: s,
      paramsSerializer: s,
      timeout: s,
      timeoutMessage: s,
      withCredentials: s,
      withXSRFToken: s,
      adapter: s,
      responseType: s,
      xsrfCookieName: s,
      xsrfHeaderName: s,
      onUploadProgress: s,
      onDownloadProgress: s,
      decompress: s,
      maxContentLength: s,
      maxBodyLength: s,
      beforeRedirect: s,
      transport: s,
      httpAgent: s,
      httpsAgent: s,
      cancelToken: s,
      socketPath: s,
      responseEncoding: s,
      validateStatus: u,
      headers: (c, p, w) => i(fi(c), fi(p), w, !0),
    };
    return (
      g.forEach(Object.keys({ ...e, ...t }), function (p) {
        const w = h[p] || i,
          A = w(e[p], t[p], p);
        (g.isUndefined(A) && w !== u) || (r[p] = A);
      }),
      r
    );
  }
  const di = (e) => {
      const t = Ne({}, e);
      let {
        data: r,
        withXSRFToken: n,
        xsrfHeaderName: i,
        xsrfCookieName: o,
        headers: s,
        auth: u,
      } = t;
      ((t.headers = s = K.from(s)),
        (t.url = ti(
          li(t.baseURL, t.url, t.allowAbsoluteUrls),
          e.params,
          e.paramsSerializer,
        )),
        u &&
          s.set(
            "Authorization",
            "Basic " +
              btoa(
                (u.username || "") +
                  ":" +
                  (u.password ? unescape(encodeURIComponent(u.password)) : ""),
              ),
          ));
      let h;
      if (g.isFormData(r)) {
        if (G.hasStandardBrowserEnv || G.hasStandardBrowserWebWorkerEnv)
          s.setContentType(void 0);
        else if ((h = s.getContentType()) !== !1) {
          const [c, ...p] = h
            ? h
                .split(";")
                .map((w) => w.trim())
                .filter(Boolean)
            : [];
          s.setContentType([c || "multipart/form-data", ...p].join("; "));
        }
      }
      if (
        G.hasStandardBrowserEnv &&
        (n && g.isFunction(n) && (n = n(t)), n || (n !== !1 && cu(t.url)))
      ) {
        const c = i && o && lu.read(o);
        c && s.set(i, c);
      }
      return t;
    },
    hu =
      typeof XMLHttpRequest < "u" &&
      function (e) {
        return new Promise(function (r, n) {
          const i = di(e);
          let o = i.data;
          const s = K.from(i.headers).normalize();
          let {
              responseType: u,
              onUploadProgress: h,
              onDownloadProgress: c,
            } = i,
            p,
            w,
            A,
            y,
            m;
          function O() {
            (y && y(),
              m && m(),
              i.cancelToken && i.cancelToken.unsubscribe(p),
              i.signal && i.signal.removeEventListener("abort", p));
          }
          let R = new XMLHttpRequest();
          (R.open(i.method.toUpperCase(), i.url, !0), (R.timeout = i.timeout));
          function T() {
            if (!R) return;
            const L = K.from(
                "getAllResponseHeaders" in R && R.getAllResponseHeaders(),
              ),
              j = {
                data:
                  !u || u === "text" || u === "json"
                    ? R.responseText
                    : R.response,
                status: R.status,
                statusText: R.statusText,
                headers: L,
                config: e,
                request: R,
              };
            (ai(
              function (ue) {
                (r(ue), O());
              },
              function (ue) {
                (n(ue), O());
              },
              j,
            ),
              (R = null));
          }
          ("onloadend" in R
            ? (R.onloadend = T)
            : (R.onreadystatechange = function () {
                !R ||
                  R.readyState !== 4 ||
                  (R.status === 0 &&
                    !(R.responseURL && R.responseURL.indexOf("file:") === 0)) ||
                  setTimeout(T);
              }),
            (R.onabort = function () {
              R &&
                (n(new D("Request aborted", D.ECONNABORTED, e, R)), (R = null));
            }),
            (R.onerror = function () {
              (n(new D("Network Error", D.ERR_NETWORK, e, R)), (R = null));
            }),
            (R.ontimeout = function () {
              let M = i.timeout
                ? "timeout of " + i.timeout + "ms exceeded"
                : "timeout exceeded";
              const j = i.transitional || ni;
              (i.timeoutErrorMessage && (M = i.timeoutErrorMessage),
                n(
                  new D(
                    M,
                    j.clarifyTimeoutError ? D.ETIMEDOUT : D.ECONNABORTED,
                    e,
                    R,
                  ),
                ),
                (R = null));
            }),
            o === void 0 && s.setContentType(null),
            "setRequestHeader" in R &&
              g.forEach(s.toJSON(), function (M, j) {
                R.setRequestHeader(j, M);
              }),
            g.isUndefined(i.withCredentials) ||
              (R.withCredentials = !!i.withCredentials),
            u && u !== "json" && (R.responseType = i.responseType),
            c && (([A, m] = Ut(c, !0)), R.addEventListener("progress", A)),
            h &&
              R.upload &&
              (([w, y] = Ut(h)),
              R.upload.addEventListener("progress", w),
              R.upload.addEventListener("loadend", y)),
            (i.cancelToken || i.signal) &&
              ((p = (L) => {
                R &&
                  (n(!L || L.type ? new qe(null, e, R) : L),
                  R.abort(),
                  (R = null));
              }),
              i.cancelToken && i.cancelToken.subscribe(p),
              i.signal &&
                (i.signal.aborted
                  ? p()
                  : i.signal.addEventListener("abort", p))));
          const k = su(i.url);
          if (k && G.protocols.indexOf(k) === -1) {
            n(new D("Unsupported protocol " + k + ":", D.ERR_BAD_REQUEST, e));
            return;
          }
          R.send(o || null);
        });
      },
    pu = (e, t) => {
      const { length: r } = (e = e ? e.filter(Boolean) : []);
      if (t || r) {
        let n = new AbortController(),
          i;
        const o = function (c) {
          if (!i) {
            ((i = !0), u());
            const p = c instanceof Error ? c : this.reason;
            n.abort(
              p instanceof D ? p : new qe(p instanceof Error ? p.message : p),
            );
          }
        };
        let s =
          t &&
          setTimeout(() => {
            ((s = null), o(new D(`timeout ${t} of ms exceeded`, D.ETIMEDOUT)));
          }, t);
        const u = () => {
          e &&
            (s && clearTimeout(s),
            (s = null),
            e.forEach((c) => {
              c.unsubscribe
                ? c.unsubscribe(o)
                : c.removeEventListener("abort", o);
            }),
            (e = null));
        };
        e.forEach((c) => c.addEventListener("abort", o));
        const { signal: h } = n;
        return ((h.unsubscribe = () => g.asap(u)), h);
      }
    },
    wu = function* (e, t) {
      let r = e.byteLength;
      if (r < t) {
        yield e;
        return;
      }
      let n = 0,
        i;
      for (; n < r; ) ((i = n + t), yield e.slice(n, i), (n = i));
    },
    gu = async function* (e, t) {
      for await (const r of mu(e)) yield* wu(r, t);
    },
    mu = async function* (e) {
      if (e[Symbol.asyncIterator]) {
        yield* e;
        return;
      }
      const t = e.getReader();
      try {
        for (;;) {
          const { done: r, value: n } = await t.read();
          if (r) break;
          yield n;
        }
      } finally {
        await t.cancel();
      }
    },
    hi = (e, t, r, n) => {
      const i = gu(e, t);
      let o = 0,
        s,
        u = (h) => {
          s || ((s = !0), n && n(h));
        };
      return new ReadableStream(
        {
          async pull(h) {
            try {
              const { done: c, value: p } = await i.next();
              if (c) {
                (u(), h.close());
                return;
              }
              let w = p.byteLength;
              if (r) {
                let A = (o += w);
                r(A);
              }
              h.enqueue(new Uint8Array(p));
            } catch (c) {
              throw (u(c), c);
            }
          },
          cancel(h) {
            return (u(h), i.return());
          },
        },
        { highWaterMark: 2 },
      );
    },
    It =
      typeof fetch == "function" &&
      typeof Request == "function" &&
      typeof Response == "function",
    pi = It && typeof ReadableStream == "function",
    bu =
      It &&
      (typeof TextEncoder == "function"
        ? (
            (e) => (t) =>
              e.encode(t)
          )(new TextEncoder())
        : async (e) => new Uint8Array(await new Response(e).arrayBuffer())),
    wi = (e, ...t) => {
      try {
        return !!e(...t);
      } catch {
        return !1;
      }
    },
    yu =
      pi &&
      wi(() => {
        let e = !1;
        const t = new Request(G.origin, {
          body: new ReadableStream(),
          method: "POST",
          get duplex() {
            return ((e = !0), "half");
          },
        }).headers.has("Content-Type");
        return e && !t;
      }),
    gi = 64 * 1024,
    _r = pi && wi(() => g.isReadableStream(new Response("").body)),
    jt = { stream: _r && ((e) => e.body) };
  It &&
    ((e) => {
      ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
        !jt[t] &&
          (jt[t] = g.isFunction(e[t])
            ? (r) => r[t]()
            : (r, n) => {
                throw new D(
                  `Response type '${t}' is not supported`,
                  D.ERR_NOT_SUPPORT,
                  n,
                );
              });
      });
    })(new Response());
  const vu = async (e) => {
      if (e == null) return 0;
      if (g.isBlob(e)) return e.size;
      if (g.isSpecCompliantForm(e))
        return (
          await new Request(G.origin, { method: "POST", body: e }).arrayBuffer()
        ).byteLength;
      if (g.isArrayBufferView(e) || g.isArrayBuffer(e)) return e.byteLength;
      if ((g.isURLSearchParams(e) && (e = e + ""), g.isString(e)))
        return (await bu(e)).byteLength;
    },
    Eu = async (e, t) => {
      const r = g.toFiniteNumber(e.getContentLength());
      return r ?? vu(t);
    },
    Ar = {
      http: Va,
      xhr: hu,
      fetch:
        It &&
        (async (e) => {
          let {
            url: t,
            method: r,
            data: n,
            signal: i,
            cancelToken: o,
            timeout: s,
            onDownloadProgress: u,
            onUploadProgress: h,
            responseType: c,
            headers: p,
            withCredentials: w = "same-origin",
            fetchOptions: A,
          } = di(e);
          c = c ? (c + "").toLowerCase() : "text";
          let y = pu([i, o && o.toAbortSignal()], s),
            m;
          const O =
            y &&
            y.unsubscribe &&
            (() => {
              y.unsubscribe();
            });
          let R;
          try {
            if (
              h &&
              yu &&
              r !== "get" &&
              r !== "head" &&
              (R = await Eu(p, n)) !== 0
            ) {
              let j = new Request(t, {
                  method: "POST",
                  body: n,
                  duplex: "half",
                }),
                te;
              if (
                (g.isFormData(n) &&
                  (te = j.headers.get("content-type")) &&
                  p.setContentType(te),
                j.body)
              ) {
                const [ue, ge] = ui(R, Ut(ci(h)));
                n = hi(j.body, gi, ue, ge);
              }
            }
            g.isString(w) || (w = w ? "include" : "omit");
            const T = "credentials" in Request.prototype;
            m = new Request(t, {
              ...A,
              signal: y,
              method: r.toUpperCase(),
              headers: p.normalize().toJSON(),
              body: n,
              duplex: "half",
              credentials: T ? w : void 0,
            });
            let k = await fetch(m, A);
            const L = _r && (c === "stream" || c === "response");
            if (_r && (u || (L && O))) {
              const j = {};
              ["status", "statusText", "headers"].forEach((H) => {
                j[H] = k[H];
              });
              const te = g.toFiniteNumber(k.headers.get("content-length")),
                [ue, ge] = (u && ui(te, Ut(ci(u), !0))) || [];
              k = new Response(
                hi(k.body, gi, ue, () => {
                  (ge && ge(), O && O());
                }),
                j,
              );
            }
            c = c || "text";
            let M = await jt[g.findKey(jt, c) || "text"](k, e);
            return (
              !L && O && O(),
              await new Promise((j, te) => {
                ai(j, te, {
                  data: M,
                  headers: K.from(k.headers),
                  status: k.status,
                  statusText: k.statusText,
                  config: e,
                  request: m,
                });
              })
            );
          } catch (T) {
            throw (
              O && O(),
              T &&
              T.name === "TypeError" &&
              /Load failed|fetch/i.test(T.message)
                ? Object.assign(new D("Network Error", D.ERR_NETWORK, e, m), {
                    cause: T.cause || T,
                  })
                : D.from(T, T && T.code, e, m)
            );
          }
        }),
    };
  g.forEach(Ar, (e, t) => {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch {}
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  const mi = (e) => `- ${e}`,
    xu = (e) => g.isFunction(e) || e === null || e === !1,
    bi = {
      getAdapter: (e) => {
        e = g.isArray(e) ? e : [e];
        const { length: t } = e;
        let r, n;
        const i = {};
        for (let o = 0; o < t; o++) {
          r = e[o];
          let s;
          if (
            ((n = r),
            !xu(r) && ((n = Ar[(s = String(r)).toLowerCase()]), n === void 0))
          )
            throw new D(`Unknown adapter '${s}'`);
          if (n) break;
          i[s || "#" + o] = n;
        }
        if (!n) {
          const o = Object.entries(i).map(
            ([u, h]) =>
              `adapter ${u} ` +
              (h === !1
                ? "is not supported by the environment"
                : "is not available in the build"),
          );
          let s = t
            ? o.length > 1
              ? `since :
` +
                o.map(mi).join(`
`)
              : " " + mi(o[0])
            : "as no adapter specified";
          throw new D(
            "There is no suitable adapter to dispatch the request " + s,
            "ERR_NOT_SUPPORT",
          );
        }
        return n;
      },
      adapters: Ar,
    };
  function Sr(e) {
    if (
      (e.cancelToken && e.cancelToken.throwIfRequested(),
      e.signal && e.signal.aborted)
    )
      throw new qe(null, e);
  }
  function yi(e) {
    return (
      Sr(e),
      (e.headers = K.from(e.headers)),
      (e.data = xr.call(e, e.transformRequest)),
      ["post", "put", "patch"].indexOf(e.method) !== -1 &&
        e.headers.setContentType("application/x-www-form-urlencoded", !1),
      bi
        .getAdapter(e.adapter || ut.adapter)(e)
        .then(
          function (n) {
            return (
              Sr(e),
              (n.data = xr.call(e, e.transformResponse, n)),
              (n.headers = K.from(n.headers)),
              n
            );
          },
          function (n) {
            return (
              si(n) ||
                (Sr(e),
                n &&
                  n.response &&
                  ((n.response.data = xr.call(
                    e,
                    e.transformResponse,
                    n.response,
                  )),
                  (n.response.headers = K.from(n.response.headers)))),
              Promise.reject(n)
            );
          },
        )
    );
  }
  const vi = "1.11.0",
    Mt = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(
    (e, t) => {
      Mt[e] = function (n) {
        return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
      };
    },
  );
  const Ei = {};
  ((Mt.transitional = function (t, r, n) {
    function i(o, s) {
      return (
        "[Axios v" +
        vi +
        "] Transitional option '" +
        o +
        "'" +
        s +
        (n ? ". " + n : "")
      );
    }
    return (o, s, u) => {
      if (t === !1)
        throw new D(
          i(s, " has been removed" + (r ? " in " + r : "")),
          D.ERR_DEPRECATED,
        );
      return (
        r &&
          !Ei[s] &&
          ((Ei[s] = !0),
          console.warn(
            i(
              s,
              " has been deprecated since v" +
                r +
                " and will be removed in the near future",
            ),
          )),
        t ? t(o, s, u) : !0
      );
    };
  }),
    (Mt.spelling = function (t) {
      return (r, n) => (
        console.warn(`${n} is likely a misspelling of ${t}`),
        !0
      );
    }));
  function _u(e, t, r) {
    if (typeof e != "object")
      throw new D("options must be an object", D.ERR_BAD_OPTION_VALUE);
    const n = Object.keys(e);
    let i = n.length;
    for (; i-- > 0; ) {
      const o = n[i],
        s = t[o];
      if (s) {
        const u = e[o],
          h = u === void 0 || s(u, o, e);
        if (h !== !0)
          throw new D("option " + o + " must be " + h, D.ERR_BAD_OPTION_VALUE);
        continue;
      }
      if (r !== !0) throw new D("Unknown option " + o, D.ERR_BAD_OPTION);
    }
  }
  const qt = { assertOptions: _u, validators: Mt },
    de = qt.validators;
  let De = class {
    constructor(t) {
      ((this.defaults = t || {}),
        (this.interceptors = { request: new ri(), response: new ri() }));
    }
    async request(t, r) {
      try {
        return await this._request(t, r);
      } catch (n) {
        if (n instanceof Error) {
          let i = {};
          Error.captureStackTrace
            ? Error.captureStackTrace(i)
            : (i = new Error());
          const o = i.stack ? i.stack.replace(/^.+\n/, "") : "";
          try {
            n.stack
              ? o &&
                !String(n.stack).endsWith(o.replace(/^.+\n.+\n/, "")) &&
                (n.stack +=
                  `
` + o)
              : (n.stack = o);
          } catch {}
        }
        throw n;
      }
    }
    _request(t, r) {
      (typeof t == "string" ? ((r = r || {}), (r.url = t)) : (r = t || {}),
        (r = Ne(this.defaults, r)));
      const { transitional: n, paramsSerializer: i, headers: o } = r;
      (n !== void 0 &&
        qt.assertOptions(
          n,
          {
            silentJSONParsing: de.transitional(de.boolean),
            forcedJSONParsing: de.transitional(de.boolean),
            clarifyTimeoutError: de.transitional(de.boolean),
          },
          !1,
        ),
        i != null &&
          (g.isFunction(i)
            ? (r.paramsSerializer = { serialize: i })
            : qt.assertOptions(
                i,
                { encode: de.function, serialize: de.function },
                !0,
              )),
        r.allowAbsoluteUrls !== void 0 ||
          (this.defaults.allowAbsoluteUrls !== void 0
            ? (r.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
            : (r.allowAbsoluteUrls = !0)),
        qt.assertOptions(
          r,
          {
            baseUrl: de.spelling("baseURL"),
            withXsrfToken: de.spelling("withXSRFToken"),
          },
          !0,
        ),
        (r.method = (r.method || this.defaults.method || "get").toLowerCase()));
      let s = o && g.merge(o.common, o[r.method]);
      (o &&
        g.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (m) => {
            delete o[m];
          },
        ),
        (r.headers = K.concat(s, o)));
      const u = [];
      let h = !0;
      this.interceptors.request.forEach(function (O) {
        (typeof O.runWhen == "function" && O.runWhen(r) === !1) ||
          ((h = h && O.synchronous), u.unshift(O.fulfilled, O.rejected));
      });
      const c = [];
      this.interceptors.response.forEach(function (O) {
        c.push(O.fulfilled, O.rejected);
      });
      let p,
        w = 0,
        A;
      if (!h) {
        const m = [yi.bind(this), void 0];
        for (
          m.unshift(...u), m.push(...c), A = m.length, p = Promise.resolve(r);
          w < A;

        )
          p = p.then(m[w++], m[w++]);
        return p;
      }
      A = u.length;
      let y = r;
      for (w = 0; w < A; ) {
        const m = u[w++],
          O = u[w++];
        try {
          y = m(y);
        } catch (R) {
          O.call(this, R);
          break;
        }
      }
      try {
        p = yi.call(this, y);
      } catch (m) {
        return Promise.reject(m);
      }
      for (w = 0, A = c.length; w < A; ) p = p.then(c[w++], c[w++]);
      return p;
    }
    getUri(t) {
      t = Ne(this.defaults, t);
      const r = li(t.baseURL, t.url, t.allowAbsoluteUrls);
      return ti(r, t.params, t.paramsSerializer);
    }
  };
  (g.forEach(["delete", "get", "head", "options"], function (t) {
    De.prototype[t] = function (r, n) {
      return this.request(
        Ne(n || {}, { method: t, url: r, data: (n || {}).data }),
      );
    };
  }),
    g.forEach(["post", "put", "patch"], function (t) {
      function r(n) {
        return function (o, s, u) {
          return this.request(
            Ne(u || {}, {
              method: t,
              headers: n ? { "Content-Type": "multipart/form-data" } : {},
              url: o,
              data: s,
            }),
          );
        };
      }
      ((De.prototype[t] = r()), (De.prototype[t + "Form"] = r(!0)));
    }));
  let Au = class ho {
    constructor(t) {
      if (typeof t != "function")
        throw new TypeError("executor must be a function.");
      let r;
      this.promise = new Promise(function (o) {
        r = o;
      });
      const n = this;
      (this.promise.then((i) => {
        if (!n._listeners) return;
        let o = n._listeners.length;
        for (; o-- > 0; ) n._listeners[o](i);
        n._listeners = null;
      }),
        (this.promise.then = (i) => {
          let o;
          const s = new Promise((u) => {
            (n.subscribe(u), (o = u));
          }).then(i);
          return (
            (s.cancel = function () {
              n.unsubscribe(o);
            }),
            s
          );
        }),
        t(function (o, s, u) {
          n.reason || ((n.reason = new qe(o, s, u)), r(n.reason));
        }));
    }
    throwIfRequested() {
      if (this.reason) throw this.reason;
    }
    subscribe(t) {
      if (this.reason) {
        t(this.reason);
        return;
      }
      this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
    }
    unsubscribe(t) {
      if (!this._listeners) return;
      const r = this._listeners.indexOf(t);
      r !== -1 && this._listeners.splice(r, 1);
    }
    toAbortSignal() {
      const t = new AbortController(),
        r = (n) => {
          t.abort(n);
        };
      return (
        this.subscribe(r),
        (t.signal.unsubscribe = () => this.unsubscribe(r)),
        t.signal
      );
    }
    static source() {
      let t;
      return {
        token: new ho(function (i) {
          t = i;
        }),
        cancel: t,
      };
    }
  };
  function Su(e) {
    return function (r) {
      return e.apply(null, r);
    };
  }
  function Ou(e) {
    return g.isObject(e) && e.isAxiosError === !0;
  }
  const Or = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
  };
  Object.entries(Or).forEach(([e, t]) => {
    Or[t] = e;
  });
  function xi(e) {
    const t = new De(e),
      r = Mn(De.prototype.request, t);
    return (
      g.extend(r, De.prototype, t, { allOwnKeys: !0 }),
      g.extend(r, t, null, { allOwnKeys: !0 }),
      (r.create = function (i) {
        return xi(Ne(e, i));
      }),
      r
    );
  }
  const q = xi(ut);
  ((q.Axios = De),
    (q.CanceledError = qe),
    (q.CancelToken = Au),
    (q.isCancel = si),
    (q.VERSION = vi),
    (q.toFormData = Dt),
    (q.AxiosError = D),
    (q.Cancel = q.CanceledError),
    (q.all = function (t) {
      return Promise.all(t);
    }),
    (q.spread = Su),
    (q.isAxiosError = Ou),
    (q.mergeConfig = Ne),
    (q.AxiosHeaders = K),
    (q.formToJSON = (e) => ii(g.isHTMLForm(e) ? new FormData(e) : e)),
    (q.getAdapter = bi.getAdapter),
    (q.HttpStatusCode = Or),
    (q.default = q));
  const {
    Axios: Gc,
    AxiosError: U,
    CanceledError: Jc,
    isCancel: Xc,
    CancelToken: Kc,
    VERSION: Zc,
    all: Yc,
    Cancel: Qc,
    isAxiosError: el,
    spread: tl,
    toFormData: rl,
    AxiosHeaders: nl,
    HttpStatusCode: il,
    formToJSON: ol,
    getAdapter: sl,
    mergeConfig: al,
  } = q;
  var Ru =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {};
  function Fu(e) {
    if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
    var t = e.default;
    if (typeof t == "function") {
      var r = function n() {
        return this instanceof n
          ? Reflect.construct(t, arguments, this.constructor)
          : t.apply(this, arguments);
      };
      r.prototype = t.prototype;
    } else r = {};
    return (
      Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.keys(e).forEach(function (n) {
        var i = Object.getOwnPropertyDescriptor(e, n);
        Object.defineProperty(
          r,
          n,
          i.get
            ? i
            : {
                enumerable: !0,
                get: function () {
                  return e[n];
                },
              },
        );
      }),
      r
    );
  }
  var Rr = { exports: {} };
  const _i = Fu(
    Object.freeze(
      Object.defineProperty(
        { __proto__: null, default: {} },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
  );
  var Ai;
  function Cu() {
    return (
      Ai ||
        ((Ai = 1),
        (function (e) {
          (function () {
            var t = "input is invalid type",
              r = "finalize already called",
              n = typeof window == "object",
              i = n ? window : {};
            i.JS_MD5_NO_WINDOW && (n = !1);
            var o = !n && typeof self == "object",
              s =
                !i.JS_MD5_NO_NODE_JS &&
                typeof process == "object" &&
                process.versions &&
                process.versions.node;
            s ? (i = Ru) : o && (i = self);
            var u = !i.JS_MD5_NO_COMMON_JS && !0 && e.exports,
              h = !i.JS_MD5_NO_ARRAY_BUFFER && typeof ArrayBuffer < "u",
              c = "0123456789abcdef".split(""),
              p = [128, 32768, 8388608, -2147483648],
              w = [0, 8, 16, 24],
              A = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"],
              y =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
                  "",
                ),
              m = [],
              O;
            if (h) {
              var R = new ArrayBuffer(68);
              ((O = new Uint8Array(R)), (m = new Uint32Array(R)));
            }
            var T = Array.isArray;
            (i.JS_MD5_NO_NODE_JS || !T) &&
              (T = function (a) {
                return Object.prototype.toString.call(a) === "[object Array]";
              });
            var k = ArrayBuffer.isView;
            h &&
              (i.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW || !k) &&
              (k = function (a) {
                return (
                  typeof a == "object" &&
                  a.buffer &&
                  a.buffer.constructor === ArrayBuffer
                );
              });
            var L = function (a) {
                var f = typeof a;
                if (f === "string") return [a, !0];
                if (f !== "object" || a === null) throw new Error(t);
                if (h && a.constructor === ArrayBuffer)
                  return [new Uint8Array(a), !1];
                if (!T(a) && !k(a)) throw new Error(t);
                return [a, !1];
              },
              M = function (a) {
                return function (f) {
                  return new H(!0).update(f)[a]();
                };
              },
              j = function () {
                var a = M("hex");
                (s && (a = te(a)),
                  (a.create = function () {
                    return new H();
                  }),
                  (a.update = function (l) {
                    return a.create().update(l);
                  }));
                for (var f = 0; f < A.length; ++f) {
                  var d = A[f];
                  a[d] = M(d);
                }
                return a;
              },
              te = function (a) {
                var f = _i,
                  d = _i.Buffer,
                  l;
                d.from && !i.JS_MD5_NO_BUFFER_FROM
                  ? (l = d.from)
                  : (l = function (C) {
                      return new d(C);
                    });
                var B = function (C) {
                  if (typeof C == "string")
                    return f.createHash("md5").update(C, "utf8").digest("hex");
                  if (C == null) throw new Error(t);
                  return (
                    C.constructor === ArrayBuffer && (C = new Uint8Array(C)),
                    T(C) || k(C) || C.constructor === d
                      ? f.createHash("md5").update(l(C)).digest("hex")
                      : a(C)
                  );
                };
                return B;
              },
              ue = function (a) {
                return function (f, d) {
                  return new rr(f, !0).update(d)[a]();
                };
              },
              ge = function () {
                var a = ue("hex");
                ((a.create = function (l) {
                  return new rr(l);
                }),
                  (a.update = function (l, B) {
                    return a.create(l).update(B);
                  }));
                for (var f = 0; f < A.length; ++f) {
                  var d = A[f];
                  a[d] = ue(d);
                }
                return a;
              };
            function H(a) {
              if (a)
                ((m[0] =
                  m[16] =
                  m[1] =
                  m[2] =
                  m[3] =
                  m[4] =
                  m[5] =
                  m[6] =
                  m[7] =
                  m[8] =
                  m[9] =
                  m[10] =
                  m[11] =
                  m[12] =
                  m[13] =
                  m[14] =
                  m[15] =
                    0),
                  (this.blocks = m),
                  (this.buffer8 = O));
              else if (h) {
                var f = new ArrayBuffer(68);
                ((this.buffer8 = new Uint8Array(f)),
                  (this.blocks = new Uint32Array(f)));
              } else
                this.blocks = [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ];
              ((this.h0 =
                this.h1 =
                this.h2 =
                this.h3 =
                this.start =
                this.bytes =
                this.hBytes =
                  0),
                (this.finalized = this.hashed = !1),
                (this.first = !0));
            }
            ((H.prototype.update = function (a) {
              if (this.finalized) throw new Error(r);
              var f = L(a);
              a = f[0];
              for (
                var d = f[1],
                  l,
                  B = 0,
                  C,
                  F = a.length,
                  P = this.blocks,
                  re = this.buffer8;
                B < F;

              ) {
                if (
                  (this.hashed &&
                    ((this.hashed = !1),
                    (P[0] = P[16]),
                    (P[16] =
                      P[1] =
                      P[2] =
                      P[3] =
                      P[4] =
                      P[5] =
                      P[6] =
                      P[7] =
                      P[8] =
                      P[9] =
                      P[10] =
                      P[11] =
                      P[12] =
                      P[13] =
                      P[14] =
                      P[15] =
                        0)),
                  d)
                )
                  if (h)
                    for (C = this.start; B < F && C < 64; ++B)
                      ((l = a.charCodeAt(B)),
                        l < 128
                          ? (re[C++] = l)
                          : l < 2048
                            ? ((re[C++] = 192 | (l >>> 6)),
                              (re[C++] = 128 | (l & 63)))
                            : l < 55296 || l >= 57344
                              ? ((re[C++] = 224 | (l >>> 12)),
                                (re[C++] = 128 | ((l >>> 6) & 63)),
                                (re[C++] = 128 | (l & 63)))
                              : ((l =
                                  65536 +
                                  (((l & 1023) << 10) |
                                    (a.charCodeAt(++B) & 1023))),
                                (re[C++] = 240 | (l >>> 18)),
                                (re[C++] = 128 | ((l >>> 12) & 63)),
                                (re[C++] = 128 | ((l >>> 6) & 63)),
                                (re[C++] = 128 | (l & 63))));
                  else
                    for (C = this.start; B < F && C < 64; ++B)
                      ((l = a.charCodeAt(B)),
                        l < 128
                          ? (P[C >>> 2] |= l << w[C++ & 3])
                          : l < 2048
                            ? ((P[C >>> 2] |= (192 | (l >>> 6)) << w[C++ & 3]),
                              (P[C >>> 2] |= (128 | (l & 63)) << w[C++ & 3]))
                            : l < 55296 || l >= 57344
                              ? ((P[C >>> 2] |=
                                  (224 | (l >>> 12)) << w[C++ & 3]),
                                (P[C >>> 2] |=
                                  (128 | ((l >>> 6) & 63)) << w[C++ & 3]),
                                (P[C >>> 2] |= (128 | (l & 63)) << w[C++ & 3]))
                              : ((l =
                                  65536 +
                                  (((l & 1023) << 10) |
                                    (a.charCodeAt(++B) & 1023))),
                                (P[C >>> 2] |=
                                  (240 | (l >>> 18)) << w[C++ & 3]),
                                (P[C >>> 2] |=
                                  (128 | ((l >>> 12) & 63)) << w[C++ & 3]),
                                (P[C >>> 2] |=
                                  (128 | ((l >>> 6) & 63)) << w[C++ & 3]),
                                (P[C >>> 2] |=
                                  (128 | (l & 63)) << w[C++ & 3])));
                else if (h)
                  for (C = this.start; B < F && C < 64; ++B) re[C++] = a[B];
                else
                  for (C = this.start; B < F && C < 64; ++B)
                    P[C >>> 2] |= a[B] << w[C++ & 3];
                ((this.lastByteIndex = C),
                  (this.bytes += C - this.start),
                  C >= 64
                    ? ((this.start = C - 64), this.hash(), (this.hashed = !0))
                    : (this.start = C));
              }
              return (
                this.bytes > 4294967295 &&
                  ((this.hBytes += (this.bytes / 4294967296) << 0),
                  (this.bytes = this.bytes % 4294967296)),
                this
              );
            }),
              (H.prototype.finalize = function () {
                if (!this.finalized) {
                  this.finalized = !0;
                  var a = this.blocks,
                    f = this.lastByteIndex;
                  ((a[f >>> 2] |= p[f & 3]),
                    f >= 56 &&
                      (this.hashed || this.hash(),
                      (a[0] = a[16]),
                      (a[16] =
                        a[1] =
                        a[2] =
                        a[3] =
                        a[4] =
                        a[5] =
                        a[6] =
                        a[7] =
                        a[8] =
                        a[9] =
                        a[10] =
                        a[11] =
                        a[12] =
                        a[13] =
                        a[14] =
                        a[15] =
                          0)),
                    (a[14] = this.bytes << 3),
                    (a[15] = (this.hBytes << 3) | (this.bytes >>> 29)),
                    this.hash());
                }
              }),
              (H.prototype.hash = function () {
                var a,
                  f,
                  d,
                  l,
                  B,
                  C,
                  F = this.blocks;
                (this.first
                  ? ((a = F[0] - 680876937),
                    (a = (((a << 7) | (a >>> 25)) - 271733879) << 0),
                    (l = (-1732584194 ^ (a & 2004318071)) + F[1] - 117830708),
                    (l = (((l << 12) | (l >>> 20)) + a) << 0),
                    (d =
                      (-271733879 ^ (l & (a ^ -271733879))) +
                      F[2] -
                      1126478375),
                    (d = (((d << 17) | (d >>> 15)) + l) << 0),
                    (f = (a ^ (d & (l ^ a))) + F[3] - 1316259209),
                    (f = (((f << 22) | (f >>> 10)) + d) << 0))
                  : ((a = this.h0),
                    (f = this.h1),
                    (d = this.h2),
                    (l = this.h3),
                    (a += (l ^ (f & (d ^ l))) + F[0] - 680876936),
                    (a = (((a << 7) | (a >>> 25)) + f) << 0),
                    (l += (d ^ (a & (f ^ d))) + F[1] - 389564586),
                    (l = (((l << 12) | (l >>> 20)) + a) << 0),
                    (d += (f ^ (l & (a ^ f))) + F[2] + 606105819),
                    (d = (((d << 17) | (d >>> 15)) + l) << 0),
                    (f += (a ^ (d & (l ^ a))) + F[3] - 1044525330),
                    (f = (((f << 22) | (f >>> 10)) + d) << 0)),
                  (a += (l ^ (f & (d ^ l))) + F[4] - 176418897),
                  (a = (((a << 7) | (a >>> 25)) + f) << 0),
                  (l += (d ^ (a & (f ^ d))) + F[5] + 1200080426),
                  (l = (((l << 12) | (l >>> 20)) + a) << 0),
                  (d += (f ^ (l & (a ^ f))) + F[6] - 1473231341),
                  (d = (((d << 17) | (d >>> 15)) + l) << 0),
                  (f += (a ^ (d & (l ^ a))) + F[7] - 45705983),
                  (f = (((f << 22) | (f >>> 10)) + d) << 0),
                  (a += (l ^ (f & (d ^ l))) + F[8] + 1770035416),
                  (a = (((a << 7) | (a >>> 25)) + f) << 0),
                  (l += (d ^ (a & (f ^ d))) + F[9] - 1958414417),
                  (l = (((l << 12) | (l >>> 20)) + a) << 0),
                  (d += (f ^ (l & (a ^ f))) + F[10] - 42063),
                  (d = (((d << 17) | (d >>> 15)) + l) << 0),
                  (f += (a ^ (d & (l ^ a))) + F[11] - 1990404162),
                  (f = (((f << 22) | (f >>> 10)) + d) << 0),
                  (a += (l ^ (f & (d ^ l))) + F[12] + 1804603682),
                  (a = (((a << 7) | (a >>> 25)) + f) << 0),
                  (l += (d ^ (a & (f ^ d))) + F[13] - 40341101),
                  (l = (((l << 12) | (l >>> 20)) + a) << 0),
                  (d += (f ^ (l & (a ^ f))) + F[14] - 1502002290),
                  (d = (((d << 17) | (d >>> 15)) + l) << 0),
                  (f += (a ^ (d & (l ^ a))) + F[15] + 1236535329),
                  (f = (((f << 22) | (f >>> 10)) + d) << 0),
                  (a += (d ^ (l & (f ^ d))) + F[1] - 165796510),
                  (a = (((a << 5) | (a >>> 27)) + f) << 0),
                  (l += (f ^ (d & (a ^ f))) + F[6] - 1069501632),
                  (l = (((l << 9) | (l >>> 23)) + a) << 0),
                  (d += (a ^ (f & (l ^ a))) + F[11] + 643717713),
                  (d = (((d << 14) | (d >>> 18)) + l) << 0),
                  (f += (l ^ (a & (d ^ l))) + F[0] - 373897302),
                  (f = (((f << 20) | (f >>> 12)) + d) << 0),
                  (a += (d ^ (l & (f ^ d))) + F[5] - 701558691),
                  (a = (((a << 5) | (a >>> 27)) + f) << 0),
                  (l += (f ^ (d & (a ^ f))) + F[10] + 38016083),
                  (l = (((l << 9) | (l >>> 23)) + a) << 0),
                  (d += (a ^ (f & (l ^ a))) + F[15] - 660478335),
                  (d = (((d << 14) | (d >>> 18)) + l) << 0),
                  (f += (l ^ (a & (d ^ l))) + F[4] - 405537848),
                  (f = (((f << 20) | (f >>> 12)) + d) << 0),
                  (a += (d ^ (l & (f ^ d))) + F[9] + 568446438),
                  (a = (((a << 5) | (a >>> 27)) + f) << 0),
                  (l += (f ^ (d & (a ^ f))) + F[14] - 1019803690),
                  (l = (((l << 9) | (l >>> 23)) + a) << 0),
                  (d += (a ^ (f & (l ^ a))) + F[3] - 187363961),
                  (d = (((d << 14) | (d >>> 18)) + l) << 0),
                  (f += (l ^ (a & (d ^ l))) + F[8] + 1163531501),
                  (f = (((f << 20) | (f >>> 12)) + d) << 0),
                  (a += (d ^ (l & (f ^ d))) + F[13] - 1444681467),
                  (a = (((a << 5) | (a >>> 27)) + f) << 0),
                  (l += (f ^ (d & (a ^ f))) + F[2] - 51403784),
                  (l = (((l << 9) | (l >>> 23)) + a) << 0),
                  (d += (a ^ (f & (l ^ a))) + F[7] + 1735328473),
                  (d = (((d << 14) | (d >>> 18)) + l) << 0),
                  (f += (l ^ (a & (d ^ l))) + F[12] - 1926607734),
                  (f = (((f << 20) | (f >>> 12)) + d) << 0),
                  (B = f ^ d),
                  (a += (B ^ l) + F[5] - 378558),
                  (a = (((a << 4) | (a >>> 28)) + f) << 0),
                  (l += (B ^ a) + F[8] - 2022574463),
                  (l = (((l << 11) | (l >>> 21)) + a) << 0),
                  (C = l ^ a),
                  (d += (C ^ f) + F[11] + 1839030562),
                  (d = (((d << 16) | (d >>> 16)) + l) << 0),
                  (f += (C ^ d) + F[14] - 35309556),
                  (f = (((f << 23) | (f >>> 9)) + d) << 0),
                  (B = f ^ d),
                  (a += (B ^ l) + F[1] - 1530992060),
                  (a = (((a << 4) | (a >>> 28)) + f) << 0),
                  (l += (B ^ a) + F[4] + 1272893353),
                  (l = (((l << 11) | (l >>> 21)) + a) << 0),
                  (C = l ^ a),
                  (d += (C ^ f) + F[7] - 155497632),
                  (d = (((d << 16) | (d >>> 16)) + l) << 0),
                  (f += (C ^ d) + F[10] - 1094730640),
                  (f = (((f << 23) | (f >>> 9)) + d) << 0),
                  (B = f ^ d),
                  (a += (B ^ l) + F[13] + 681279174),
                  (a = (((a << 4) | (a >>> 28)) + f) << 0),
                  (l += (B ^ a) + F[0] - 358537222),
                  (l = (((l << 11) | (l >>> 21)) + a) << 0),
                  (C = l ^ a),
                  (d += (C ^ f) + F[3] - 722521979),
                  (d = (((d << 16) | (d >>> 16)) + l) << 0),
                  (f += (C ^ d) + F[6] + 76029189),
                  (f = (((f << 23) | (f >>> 9)) + d) << 0),
                  (B = f ^ d),
                  (a += (B ^ l) + F[9] - 640364487),
                  (a = (((a << 4) | (a >>> 28)) + f) << 0),
                  (l += (B ^ a) + F[12] - 421815835),
                  (l = (((l << 11) | (l >>> 21)) + a) << 0),
                  (C = l ^ a),
                  (d += (C ^ f) + F[15] + 530742520),
                  (d = (((d << 16) | (d >>> 16)) + l) << 0),
                  (f += (C ^ d) + F[2] - 995338651),
                  (f = (((f << 23) | (f >>> 9)) + d) << 0),
                  (a += (d ^ (f | ~l)) + F[0] - 198630844),
                  (a = (((a << 6) | (a >>> 26)) + f) << 0),
                  (l += (f ^ (a | ~d)) + F[7] + 1126891415),
                  (l = (((l << 10) | (l >>> 22)) + a) << 0),
                  (d += (a ^ (l | ~f)) + F[14] - 1416354905),
                  (d = (((d << 15) | (d >>> 17)) + l) << 0),
                  (f += (l ^ (d | ~a)) + F[5] - 57434055),
                  (f = (((f << 21) | (f >>> 11)) + d) << 0),
                  (a += (d ^ (f | ~l)) + F[12] + 1700485571),
                  (a = (((a << 6) | (a >>> 26)) + f) << 0),
                  (l += (f ^ (a | ~d)) + F[3] - 1894986606),
                  (l = (((l << 10) | (l >>> 22)) + a) << 0),
                  (d += (a ^ (l | ~f)) + F[10] - 1051523),
                  (d = (((d << 15) | (d >>> 17)) + l) << 0),
                  (f += (l ^ (d | ~a)) + F[1] - 2054922799),
                  (f = (((f << 21) | (f >>> 11)) + d) << 0),
                  (a += (d ^ (f | ~l)) + F[8] + 1873313359),
                  (a = (((a << 6) | (a >>> 26)) + f) << 0),
                  (l += (f ^ (a | ~d)) + F[15] - 30611744),
                  (l = (((l << 10) | (l >>> 22)) + a) << 0),
                  (d += (a ^ (l | ~f)) + F[6] - 1560198380),
                  (d = (((d << 15) | (d >>> 17)) + l) << 0),
                  (f += (l ^ (d | ~a)) + F[13] + 1309151649),
                  (f = (((f << 21) | (f >>> 11)) + d) << 0),
                  (a += (d ^ (f | ~l)) + F[4] - 145523070),
                  (a = (((a << 6) | (a >>> 26)) + f) << 0),
                  (l += (f ^ (a | ~d)) + F[11] - 1120210379),
                  (l = (((l << 10) | (l >>> 22)) + a) << 0),
                  (d += (a ^ (l | ~f)) + F[2] + 718787259),
                  (d = (((d << 15) | (d >>> 17)) + l) << 0),
                  (f += (l ^ (d | ~a)) + F[9] - 343485551),
                  (f = (((f << 21) | (f >>> 11)) + d) << 0),
                  this.first
                    ? ((this.h0 = (a + 1732584193) << 0),
                      (this.h1 = (f - 271733879) << 0),
                      (this.h2 = (d - 1732584194) << 0),
                      (this.h3 = (l + 271733878) << 0),
                      (this.first = !1))
                    : ((this.h0 = (this.h0 + a) << 0),
                      (this.h1 = (this.h1 + f) << 0),
                      (this.h2 = (this.h2 + d) << 0),
                      (this.h3 = (this.h3 + l) << 0)));
              }),
              (H.prototype.hex = function () {
                this.finalize();
                var a = this.h0,
                  f = this.h1,
                  d = this.h2,
                  l = this.h3;
                return (
                  c[(a >>> 4) & 15] +
                  c[a & 15] +
                  c[(a >>> 12) & 15] +
                  c[(a >>> 8) & 15] +
                  c[(a >>> 20) & 15] +
                  c[(a >>> 16) & 15] +
                  c[(a >>> 28) & 15] +
                  c[(a >>> 24) & 15] +
                  c[(f >>> 4) & 15] +
                  c[f & 15] +
                  c[(f >>> 12) & 15] +
                  c[(f >>> 8) & 15] +
                  c[(f >>> 20) & 15] +
                  c[(f >>> 16) & 15] +
                  c[(f >>> 28) & 15] +
                  c[(f >>> 24) & 15] +
                  c[(d >>> 4) & 15] +
                  c[d & 15] +
                  c[(d >>> 12) & 15] +
                  c[(d >>> 8) & 15] +
                  c[(d >>> 20) & 15] +
                  c[(d >>> 16) & 15] +
                  c[(d >>> 28) & 15] +
                  c[(d >>> 24) & 15] +
                  c[(l >>> 4) & 15] +
                  c[l & 15] +
                  c[(l >>> 12) & 15] +
                  c[(l >>> 8) & 15] +
                  c[(l >>> 20) & 15] +
                  c[(l >>> 16) & 15] +
                  c[(l >>> 28) & 15] +
                  c[(l >>> 24) & 15]
                );
              }),
              (H.prototype.toString = H.prototype.hex),
              (H.prototype.digest = function () {
                this.finalize();
                var a = this.h0,
                  f = this.h1,
                  d = this.h2,
                  l = this.h3;
                return [
                  a & 255,
                  (a >>> 8) & 255,
                  (a >>> 16) & 255,
                  (a >>> 24) & 255,
                  f & 255,
                  (f >>> 8) & 255,
                  (f >>> 16) & 255,
                  (f >>> 24) & 255,
                  d & 255,
                  (d >>> 8) & 255,
                  (d >>> 16) & 255,
                  (d >>> 24) & 255,
                  l & 255,
                  (l >>> 8) & 255,
                  (l >>> 16) & 255,
                  (l >>> 24) & 255,
                ];
              }),
              (H.prototype.array = H.prototype.digest),
              (H.prototype.arrayBuffer = function () {
                this.finalize();
                var a = new ArrayBuffer(16),
                  f = new Uint32Array(a);
                return (
                  (f[0] = this.h0),
                  (f[1] = this.h1),
                  (f[2] = this.h2),
                  (f[3] = this.h3),
                  a
                );
              }),
              (H.prototype.buffer = H.prototype.arrayBuffer),
              (H.prototype.base64 = function () {
                for (var a, f, d, l = "", B = this.array(), C = 0; C < 15; )
                  ((a = B[C++]),
                    (f = B[C++]),
                    (d = B[C++]),
                    (l +=
                      y[a >>> 2] +
                      y[((a << 4) | (f >>> 4)) & 63] +
                      y[((f << 2) | (d >>> 6)) & 63] +
                      y[d & 63]));
                return (
                  (a = B[C]),
                  (l += y[a >>> 2] + y[(a << 4) & 63] + "=="),
                  l
                );
              }));
            function rr(a, f) {
              var d,
                l = L(a);
              if (((a = l[0]), l[1])) {
                var B = [],
                  C = a.length,
                  F = 0,
                  P;
                for (d = 0; d < C; ++d)
                  ((P = a.charCodeAt(d)),
                    P < 128
                      ? (B[F++] = P)
                      : P < 2048
                        ? ((B[F++] = 192 | (P >>> 6)),
                          (B[F++] = 128 | (P & 63)))
                        : P < 55296 || P >= 57344
                          ? ((B[F++] = 224 | (P >>> 12)),
                            (B[F++] = 128 | ((P >>> 6) & 63)),
                            (B[F++] = 128 | (P & 63)))
                          : ((P =
                              65536 +
                              (((P & 1023) << 10) |
                                (a.charCodeAt(++d) & 1023))),
                            (B[F++] = 240 | (P >>> 18)),
                            (B[F++] = 128 | ((P >>> 12) & 63)),
                            (B[F++] = 128 | ((P >>> 6) & 63)),
                            (B[F++] = 128 | (P & 63))));
                a = B;
              }
              a.length > 64 && (a = new H(!0).update(a).array());
              var re = [],
                lo = [];
              for (d = 0; d < 64; ++d) {
                var fo = a[d] || 0;
                ((re[d] = 92 ^ fo), (lo[d] = 54 ^ fo));
              }
              (H.call(this, f),
                this.update(lo),
                (this.oKeyPad = re),
                (this.inner = !0),
                (this.sharedMemory = f));
            }
            ((rr.prototype = new H()),
              (rr.prototype.finalize = function () {
                if ((H.prototype.finalize.call(this), this.inner)) {
                  this.inner = !1;
                  var a = this.array();
                  (H.call(this, this.sharedMemory),
                    this.update(this.oKeyPad),
                    this.update(a),
                    H.prototype.finalize.call(this));
                }
              }));
            var _t = j();
            ((_t.md5 = _t),
              (_t.md5.hmac = ge()),
              u ? (e.exports = _t) : (i.md5 = _t));
          })();
        })(Rr)),
      Rr.exports
    );
  }
  var Vt = Cu();
  const Tu = [
      46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5,
      49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55,
      40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57,
      62, 11, 36, 20, 34, 44, 52,
    ],
    ku = (e) =>
      Tu.map((t) => e[t])
        .join("")
        .slice(0, 32);
  function Bu(e, t, r) {
    const n = ku(t + r),
      i = Math.round(Date.now() / 1e3),
      o = /[!'()*]/g;
    Object.assign(e, { wts: i });
    const s = Object.keys(e)
        .sort()
        .map((h) => {
          const c = e[h].toString().replace(o, "");
          return `${encodeURIComponent(h)}=${encodeURIComponent(c)}`;
        })
        .join("&"),
      u = Vt.md5(s + n);
    return s + "&w_rid=" + u;
  }
  async function Pu() {
    var n, i;
    const e = await q({
        url: "https://api.bilibili.com/x/web-interface/nav",
        method: "GET",
        withCredentials: !0,
      }),
      { img_url: t, sub_url: r } =
        ((i = (n = e.data) == null ? void 0 : n.data) == null
          ? void 0
          : i.wbi_img) || {};
    if (!t || !r)
      throw new Error("\u83B7\u53D6Bilibili\u5BC6\u94A5\u5931\u8D25");
    return {
      img_key: t.slice(t.lastIndexOf("/") + 1, t.lastIndexOf(".")),
      sub_key: r.slice(r.lastIndexOf("/") + 1, r.lastIndexOf(".")),
    };
  }
  const Fr = q.create({
    baseURL: "https://api.bilibili.com",
    timeout: 3e4,
    withCredentials: !0,
  });
  let lt = {};
  (Fr.interceptors.request.use(async (e) => {
    (!lt.img_key || !lt.sub_key) && (lt = await Pu());
    const t = Bu(e.params || {}, lt.img_key || "", lt.sub_key || ""),
      r = e.url || "";
    return (
      (e.url = r + (r.includes("?") ? "&" : "?") + t),
      (e.params = void 0),
      e
    );
  }),
    Fr.interceptors.response.use((e) => {
      const { message: t, code: r } = e.data;
      if (r)
        throw new U(
          t || "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      return e;
    }));
  const Nu = () => {
    (Tt(),
      ke(Fr),
      ne("httpRequest", async (e) => Be()(...e)),
      Promise.resolve().then(() => Uc));
  };
  function Du(e, t) {
    try {
      return !t || typeof e != "string" || !e
        ? !1
        : e.startsWith("/") || e.startsWith(location.origin)
          ? !0
          : e.startsWith("https://")
            ? !!e.includes(t)
            : !1;
    } catch {
      return !1;
    }
  }
  function Lu(e) {
    var o;
    if (!e) return;
    const t = e.getResponseHeader("content-type");
    if (
      !(
        (o = t == null ? void 0 : t.includes) != null &&
        o.call(t, "application/json")
      ) ||
      !["", "text"].includes(e.responseType) ||
      !Cr(e.responseText)
    )
      return;
    const r = Si(e.responseText);
    if (fr(r)) return;
    let n;
    e._smzs_data && (n = Si(e._smzs_data));
    const i = {
      url: e.responseURL,
      method: e._smzs_method || "GET",
      body: n,
      result: r,
    };
    pr("onHttpResponse", i);
  }
  function Si(e) {
    if (Cr(e))
      try {
        return JSON.parse(e);
      } catch {}
  }
  function Cr(e) {
    if (!e) return !1;
    const t = e.trim();
    return t
      ? !!(
          (t.startsWith("{") && t.endsWith("}")) ||
          (t.startsWith("[") && t.endsWith("]"))
        )
      : !1;
  }
  function ft() {
    const e = In();
    if (!e) return;
    const t = XMLHttpRequest.prototype.send,
      r = XMLHttpRequest.prototype.open;
    ((XMLHttpRequest.prototype.open = function () {
      ((arguments == null ? void 0 : arguments.length) > 1 &&
        Du(arguments[1], e) &&
        (this._smzs_method = arguments[0]),
        r.apply(this, arguments));
    }),
      (XMLHttpRequest.prototype.send = function () {
        if (!this._smzs_method) return t.apply(this, arguments);
        const n = this.onload;
        return (
          (this.onload = function () {
            var i;
            try {
              Lu(this);
            } catch (o) {
              console.warn(o);
            }
            return (i = n == null ? void 0 : n.apply) == null
              ? void 0
              : i.call(n, this, arguments);
          }),
          (arguments == null ? void 0 : arguments.length) > 0 &&
            typeof arguments[0] == "string" &&
            Cr(arguments[0]) &&
            (this._smzs_data = arguments[0]),
          t.apply(this, arguments)
        );
      }));
  }
  async function Uu(e, t) {
    var u;
    if (!e || !e.ok) return;
    const r = e.headers.get("content-type");
    if (
      !(
        (u = r == null ? void 0 : r.includes) != null &&
        u.call(r, "application/json")
      )
    )
      return;
    let n;
    try {
      const h = e.clone();
      if (
        typeof t[0] == "string" &&
        t[0].includes("/aweme/v1/web/general/search/stream/")
      ) {
        const p = (await h.text())
            .split(
              `
`,
            )
            .filter((A, y) => (y + 1) % 2 === 0),
          w = [];
        for (const A of p) {
          const y = Qe(A);
          y &&
            (w.length > 0 && y.ack == -1
              ? w.pop()
              : "status_code" in y && w.push(y));
        }
        if (w.length >= 1) {
          const A = w.flatMap((y) => (Array.isArray(y.data) ? y.data : []));
          ((n = w.pop()), (n.data = A));
        }
      } else {
        const c = h.body.getReader(),
          p = new TextDecoder("utf-8");
        let w = "";
        for (;;) {
          const { value: A, done: y } = await c.read();
          if (y) break;
          w += p.decode(A, { stream: !0 });
        }
        ((w += p.decode()), (n = Qe(w)));
      }
    } catch (h) {
      console.warn(h);
      return;
    }
    if (fr(n)) return;
    let i;
    const o = t[1];
    o != null &&
      o.body &&
      typeof o.body == "string" &&
      (i = Qe(o == null ? void 0 : o.body));
    const s = {
      url: e.url,
      method: (o == null ? void 0 : o.method) || "GET",
      body: i,
      result: n,
    };
    pr("onHttpResponse", s);
  }
  function Iu(e, t) {
    if (!e) return !1;
    try {
      if (typeof e == "string") {
        if (e.startsWith("/") || e.startsWith(location.origin)) return !0;
        if (!e.startsWith("https://")) return !1;
        if (e.includes(t)) return !0;
      }
      return e instanceof URL
        ? e.hostname.endsWith(t)
        : e instanceof Request
          ? e.url.includes(t)
          : !1;
    } catch {
      return !1;
    }
  }
  function ju() {
    const e = window.fetch,
      t = "douyin.com";
    window.fetch = async function (...r) {
      if (Iu(r[0], t)) {
        const n = await e.apply(this, arguments);
        try {
          Uu(n, r);
        } catch (i) {
          console.warn(i);
        }
        return n;
      }
      return e.apply(this, arguments);
    };
  }
  var Mu = "2.0.4",
    Tr = 500,
    Oi = "user-agent",
    Ve = "",
    Ri = "?",
    Ht = "function",
    _e = "undefined",
    He = "object",
    kr = "string",
    Z = "browser",
    me = "cpu",
    he = "device",
    le = "engine",
    ie = "os",
    $e = "result",
    x = "name",
    b = "type",
    E = "vendor",
    _ = "version",
    Y = "architecture",
    dt = "major",
    v = "model",
    ht = "console",
    N = "mobile",
    $ = "tablet",
    z = "smarttv",
    pe = "wearable",
    $t = "xr",
    pt = "embedded",
    wt = "inapp",
    Br = "brands",
    Le = "formFactors",
    Pr = "fullVersionList",
    We = "platform",
    Nr = "platformVersion",
    Wt = "bitness",
    Ae = "sec-ch-ua",
    qu = Ae + "-full-version-list",
    Vu = Ae + "-arch",
    Hu = Ae + "-" + Wt,
    $u = Ae + "-form-factors",
    Wu = Ae + "-" + N,
    zu = Ae + "-" + v,
    Fi = Ae + "-" + We,
    Gu = Fi + "-version",
    Ci = [Br, Pr, N, v, We, Nr, Y, Le, Wt],
    zt = "Amazon",
    ze = "Apple",
    Ti = "ASUS",
    ki = "BlackBerry",
    Ue = "Google",
    Bi = "Huawei",
    Dr = "Lenovo",
    Pi = "Honor",
    Gt = "LG",
    Lr = "Microsoft",
    Ur = "Motorola",
    Ir = "Nvidia",
    Ni = "OnePlus",
    jr = "OPPO",
    gt = "Samsung",
    Di = "Sharp",
    mt = "Sony",
    Mr = "Xiaomi",
    qr = "Zebra",
    Li = "Chrome",
    Ui = "Chromium",
    Se = "Chromecast",
    Jt = "Edge",
    bt = "Firefox",
    yt = "Opera",
    Vr = "Facebook",
    Ii = "Sogou",
    Ge = "Mobile ",
    vt = " Browser",
    Hr = "Windows",
    Ju = typeof window !== _e,
    Q = Ju && window.navigator ? window.navigator : void 0,
    Oe = Q && Q.userAgentData ? Q.userAgentData : void 0,
    Xu = function (e, t) {
      var r = {},
        n = t;
      if (!Kt(t)) {
        n = {};
        for (var i in t)
          for (var o in t[i]) n[o] = t[i][o].concat(n[o] ? n[o] : []);
      }
      for (var s in e)
        r[s] = n[s] && n[s].length % 2 === 0 ? n[s].concat(e[s]) : e[s];
      return r;
    },
    Xt = function (e) {
      for (var t = {}, r = 0; r < e.length; r++) t[e[r].toUpperCase()] = e[r];
      return t;
    },
    $r = function (e, t) {
      if (typeof e === He && e.length > 0) {
        for (var r in e) if (be(t) == be(e[r])) return !0;
        return !1;
      }
      return Je(e) ? be(t) == be(e) : !1;
    },
    Kt = function (e, t) {
      for (var r in e)
        return (
          /^(browser|cpu|device|engine|os)$/.test(r) || (t ? Kt(e[r]) : !1)
        );
    },
    Je = function (e) {
      return typeof e === kr;
    },
    Wr = function (e) {
      if (e) {
        for (
          var t = [], r = Xe(/\\?\"/g, e).split(","), n = 0;
          n < r.length;
          n++
        )
          if (r[n].indexOf(";") > -1) {
            var i = Zt(r[n]).split(";v=");
            t[n] = { brand: i[0], version: i[1] };
          } else t[n] = Zt(r[n]);
        return t;
      }
    },
    be = function (e) {
      return Je(e) ? e.toLowerCase() : e;
    },
    zr = function (e) {
      return Je(e) ? Xe(/[^\d\.]/g, e).split(".")[0] : void 0;
    },
    ye = function (e) {
      for (var t in e) {
        var r = e[t];
        typeof r == He && r.length == 2
          ? (this[r[0]] = r[1])
          : (this[r] = void 0);
      }
      return this;
    },
    Xe = function (e, t) {
      return Je(t) ? t.replace(e, Ve) : t;
    },
    Et = function (e) {
      return Xe(/\\?\"/g, e);
    },
    Zt = function (e, t) {
      if (Je(e))
        return (
          (e = Xe(/^\s\s*/, e)),
          typeof t === _e ? e : e.substring(0, Tr)
        );
    },
    Gr = function (e, t) {
      if (!(!e || !t))
        for (var r = 0, n, i, o, s, u, h; r < t.length && !u; ) {
          var c = t[r],
            p = t[r + 1];
          for (n = i = 0; n < c.length && !u && c[n]; )
            if (((u = c[n++].exec(e)), u))
              for (o = 0; o < p.length; o++)
                ((h = u[++i]),
                  (s = p[o]),
                  typeof s === He && s.length > 0
                    ? s.length === 2
                      ? typeof s[1] == Ht
                        ? (this[s[0]] = s[1].call(this, h))
                        : (this[s[0]] = s[1])
                      : s.length >= 3 &&
                        (typeof s[1] === Ht && !(s[1].exec && s[1].test)
                          ? s.length > 3
                            ? (this[s[0]] = h
                                ? s[1].apply(this, s.slice(2))
                                : void 0)
                            : (this[s[0]] = h
                                ? s[1].call(this, h, s[2])
                                : void 0)
                          : s.length == 3
                            ? (this[s[0]] = h ? h.replace(s[1], s[2]) : void 0)
                            : s.length == 4
                              ? (this[s[0]] = h
                                  ? s[3].call(this, h.replace(s[1], s[2]))
                                  : void 0)
                              : s.length > 4 &&
                                (this[s[0]] = h
                                  ? s[3].apply(
                                      this,
                                      [h.replace(s[1], s[2])].concat(
                                        s.slice(4),
                                      ),
                                    )
                                  : void 0))
                    : (this[s] = h || void 0));
          r += 2;
        }
    },
    we = function (e, t) {
      for (var r in t)
        if (typeof t[r] === He && t[r].length > 0) {
          for (var n = 0; n < t[r].length; n++)
            if ($r(t[r][n], e)) return r === Ri ? void 0 : r;
        } else if ($r(t[r], e)) return r === Ri ? void 0 : r;
      return t.hasOwnProperty("*") ? t["*"] : e;
    },
    ji = {
      ME: "4.90",
      "NT 3.51": "3.51",
      "NT 4.0": "4.0",
      2e3: ["5.0", "5.01"],
      XP: ["5.1", "5.2"],
      Vista: "6.0",
      7: "6.1",
      8: "6.2",
      8.1: "6.3",
      10: ["6.4", "10.0"],
      NT: "",
    },
    Mi = {
      embedded: "Automotive",
      mobile: "Mobile",
      tablet: ["Tablet", "EInk"],
      smarttv: "TV",
      wearable: "Watch",
      xr: ["VR", "XR"],
      "?": ["Desktop", "Unknown"],
      "*": void 0,
    },
    Ku = {
      Chrome: "Google Chrome",
      Edge: "Microsoft Edge",
      "Edge WebView2": "Microsoft Edge WebView2",
      "Chrome WebView": "Android WebView",
      "Chrome Headless": "HeadlessChrome",
      "Huawei Browser": "HuaweiBrowser",
      "MIUI Browser": "Miui Browser",
      "Opera Mobi": "OperaMobile",
      Yandex: "YaBrowser",
    },
    qi = {
      browser: [
        [/\b(?:crmo|crios)\/([\w\.]+)/i],
        [_, [x, Ge + "Chrome"]],
        [/webview.+edge\/([\w\.]+)/i],
        [_, [x, Jt + " WebView"]],
        [/edg(?:e|ios|a)?\/([\w\.]+)/i],
        [_, [x, "Edge"]],
        [
          /(opera mini)\/([-\w\.]+)/i,
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
        ],
        [x, _],
        [/opios[\/ ]+([\w\.]+)/i],
        [_, [x, yt + " Mini"]],
        [/\bop(?:rg)?x\/([\w\.]+)/i],
        [_, [x, yt + " GX"]],
        [/\bopr\/([\w\.]+)/i],
        [_, [x, yt]],
        [/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
        [_, [x, "Baidu"]],
        [/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i],
        [_, [x, "Maxthon"]],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
          /(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
          /(?:ms|\()(ie) ([\w\.]+)/i,
          /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:lg |qute)browser)\/([-\w\.]+)/i,
          /(heytap|ovi|115|surf)browser\/([\d\.]+)/i,
          /(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i,
        ],
        [x, _],
        [/quark(?:pc)?\/([-\w\.]+)/i],
        [_, [x, "Quark"]],
        [/\bddg\/([\w\.]+)/i],
        [_, [x, "DuckDuckGo"]],
        [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
        [_, [x, "UCBrowser"]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          /\bqbcore\/([\w\.]+).+microm/i,
          /micromessenger\/([\w\.]+)/i,
        ],
        [_, [x, "WeChat"]],
        [/konqueror\/([\w\.]+)/i],
        [_, [x, "Konqueror"]],
        [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
        [_, [x, "IE"]],
        [/ya(?:search)?browser\/([\w\.]+)/i],
        [_, [x, "Yandex"]],
        [/slbrowser\/([\w\.]+)/i],
        [_, [x, "Smart " + Dr + vt]],
        [/(avast|avg)\/([\w\.]+)/i],
        [[x, /(.+)/, "$1 Secure" + vt], _],
        [/\bfocus\/([\w\.]+)/i],
        [_, [x, bt + " Focus"]],
        [/\bopt\/([\w\.]+)/i],
        [_, [x, yt + " Touch"]],
        [/coc_coc\w+\/([\w\.]+)/i],
        [_, [x, "Coc Coc"]],
        [/dolfin\/([\w\.]+)/i],
        [_, [x, "Dolphin"]],
        [/coast\/([\w\.]+)/i],
        [_, [x, yt + " Coast"]],
        [/miuibrowser\/([\w\.]+)/i],
        [_, [x, "MIUI" + vt]],
        [/fxios\/([\w\.-]+)/i],
        [_, [x, Ge + bt]],
        [/\bqihoobrowser\/?([\w\.]*)/i],
        [_, [x, "360"]],
        [/\b(qq)\/([\w\.]+)/i],
        [[x, /(.+)/, "$1Browser"], _],
        [/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],
        [[x, /(.+)/, "$1" + vt], _],
        [/samsungbrowser\/([\w\.]+)/i],
        [_, [x, gt + " Internet"]],
        [/metasr[\/ ]?([\d\.]+)/i],
        [_, [x, Ii + " Explorer"]],
        [/(sogou)mo\w+\/([\d\.]+)/i],
        [[x, Ii + " Mobile"], _],
        [
          /(electron)\/([\w\.]+) safari/i,
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          /m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i,
        ],
        [x, _],
        [/(lbbrowser|rekonq)/i],
        [x],
        [/ome\/([\w\.]+) \w* ?(iron) saf/i, /ome\/([\w\.]+).+qihu (360)[es]e/i],
        [_, x],
        [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
        [[x, Vr], _, [b, wt]],
        [
          /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
          /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
          /(daum)apps[\/ ]([\w\.]+)/i,
          /safari (line)\/([\w\.]+)/i,
          /\b(line)\/([\w\.]+)\/iab/i,
          /(alipay)client\/([\w\.]+)/i,
          /(twitter)(?:and| f.+e\/([\w\.]+))/i,
          /(instagram|snapchat|klarna)[\/ ]([-\w\.]+)/i,
        ],
        [x, _, [b, wt]],
        [/\bgsa\/([\w\.]+) .*safari\//i],
        [_, [x, "GSA"], [b, wt]],
        [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],
        [_, [x, "TikTok"], [b, wt]],
        [/\[(linkedin)app\]/i],
        [x, [b, wt]],
        [/(chromium)[\/ ]([-\w\.]+)/i],
        [x, _],
        [/headlesschrome(?:\/([\w\.]+)| )/i],
        [_, [x, Li + " Headless"]],
        [/wv\).+chrome\/([\w\.]+).+edgw\//i],
        [_, [x, Jt + " WebView2"]],
        [/ wv\).+(chrome)\/([\w\.]+)/i],
        [[x, Li + " WebView"], _],
        [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
        [_, [x, "Android" + vt]],
        [/chrome\/([\w\.]+) mobile/i],
        [_, [x, Ge + "Chrome"]],
        [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
        [x, _],
        [/version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i],
        [_, [x, Ge + "Safari"]],
        [/iphone .*mobile(?:\/\w+ | ?)safari/i],
        [[x, Ge + "Safari"]],
        [/version\/([\w\.\,]+) .*(safari)/i],
        [_, x],
        [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
        [x, [_, "1"]],
        [/(webkit|khtml)\/([\w\.]+)/i],
        [x, _],
        [/(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i],
        [[x, Ge + bt], _],
        [/(navigator|netscape\d?)\/([-\w\.]+)/i],
        [[x, "Netscape"], _],
        [/(wolvic|librewolf)\/([\w\.]+)/i],
        [x, _],
        [/mobile vr; rv:([\w\.]+)\).+firefox/i],
        [_, [x, bt + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          /(swiftfox)/i,
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          /(firefox)\/([\w\.]+)/i,
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          /(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          /\b(links) \(([\w\.]+)/i,
        ],
        [x, [_, /_/g, "."]],
        [/(cobalt)\/([\w\.]+)/i],
        [x, [_, /[^\d\.]+./, Ve]],
      ],
      cpu: [
        [/\b((amd|x|x86[-_]?|wow|win)64)\b/i],
        [[Y, "amd64"]],
        [/(ia32(?=;))/i, /\b((i[346]|x)86)(pc)?\b/i],
        [[Y, "ia32"]],
        [/\b(aarch64|arm(v?[89]e?l?|_?64))\b/i],
        [[Y, "arm64"]],
        [/\b(arm(v[67])?ht?n?[fl]p?)\b/i],
        [[Y, "armhf"]],
        [/( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i],
        [[Y, "arm"]],
        [/((ppc|powerpc)(64)?)( mac|;|\))/i],
        [[Y, /ower/, Ve, be]],
        [/ sun4\w[;\)]/i],
        [[Y, "sparc"]],
        [
          /\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i,
        ],
        [[Y, be]],
      ],
      device: [
        [
          /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
        ],
        [v, [E, gt], [b, $]],
        [
          /\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
          /samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
          /sec-(sgh\w+)/i,
        ],
        [v, [E, gt], [b, N]],
        [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],
        [v, [E, ze], [b, N]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
        ],
        [v, [E, ze], [b, $]],
        [/(macintosh);/i],
        [v, [E, ze]],
        [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
        [v, [E, Di], [b, N]],
        [
          /\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i,
        ],
        [v, [E, Pi], [b, $]],
        [/honor([-\w ]+)[;\)]/i],
        [v, [E, Pi], [b, N]],
        [
          /\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i,
        ],
        [v, [E, Bi], [b, $]],
        [
          /(?:huawei)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
        ],
        [v, [E, Bi], [b, N]],
        [
          /oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i,
          /\b((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i,
        ],
        [
          [v, /_/g, " "],
          [E, Mr],
          [b, $],
        ],
        [
          /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
          /\b; (\w+) build\/hm\1/i,
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          /oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite|pro)?)(?: bui|\))/i,
          / ([\w ]+) miui\/v?\d/i,
        ],
        [
          [v, /_/g, " "],
          [E, Mr],
          [b, N],
        ],
        [
          /droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-k]\w[1m]10)\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
        ],
        [v, [E, Ni], [b, N]],
        [
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
        ],
        [v, [E, jr], [b, N]],
        [/\b(opd2(\d{3}a?))(?: bui|\))/i],
        [
          v,
          [
            E,
            we,
            { OnePlus: ["203", "304", "403", "404", "413", "415"], "*": jr },
          ],
          [b, $],
        ],
        [/(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i],
        [v, [E, "BLU"], [b, N]],
        [/; vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
        [v, [E, "Vivo"], [b, N]],
        [/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
        [v, [E, "Realme"], [b, N]],
        [
          /(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i,
          /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i,
        ],
        [v, [E, Dr], [b, $]],
        [/lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i],
        [v, [E, Dr], [b, N]],
        [
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
          /((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i,
        ],
        [v, [E, Ur], [b, N]],
        [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
        [v, [E, Ur], [b, $]],
        [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
        [v, [E, Gt], [b, $]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
          /\blg-?([\d\w]+) bui/i,
        ],
        [v, [E, Gt], [b, N]],
        [/(nokia) (t[12][01])/i],
        [E, v, [b, $]],
        [
          /(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i,
          /nokia[-_ ]?(([-\w\. ]*))/i,
        ],
        [
          [v, /_/g, " "],
          [b, N],
          [E, "Nokia"],
        ],
        [/(pixel (c|tablet))\b/i],
        [v, [E, Ue], [b, $]],
        [
          /droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i,
        ],
        [v, [E, Ue], [b, N]],
        [/(google) (pixelbook( go)?)/i],
        [E, v],
        [
          /droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
        ],
        [v, [E, mt], [b, N]],
        [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
        [
          [v, "Xperia Tablet"],
          [E, mt],
          [b, $],
        ],
        [
          /(alexa)webm/i,
          /(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
          /(kf[a-z]+)( bui|\)).+silk\//i,
        ],
        [v, [E, zt], [b, $]],
        [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
        [
          [v, /(.+)/g, "Fire Phone $1"],
          [E, zt],
          [b, N],
        ],
        [/(playbook);[-\w\),; ]+(rim)/i],
        [v, E, [b, $]],
        [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
        [v, [E, ki], [b, N]],
        [
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
        ],
        [v, [E, Ti], [b, $]],
        [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
        [v, [E, Ti], [b, N]],
        [/(nexus 9)/i],
        [v, [E, "HTC"], [b, $]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i,
        ],
        [E, [v, /_/g, " "], [b, N]],
        [
          /tcl (xess p17aa)/i,
          /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i,
        ],
        [v, [E, "TCL"], [b, $]],
        [
          /droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i,
        ],
        [v, [E, "TCL"], [b, N]],
        [/(itel) ((\w+))/i],
        [[E, be], v, [b, we, { tablet: ["p10001l", "w7001"], "*": "mobile" }]],
        [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
        [v, [E, "Acer"], [b, $]],
        [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
        [v, [E, "Meizu"], [b, N]],
        [/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
        [v, [E, "Ulefone"], [b, N]],
        [/; (energy ?\w+)(?: bui|\))/i, /; energizer ([\w ]+)(?: bui|\))/i],
        [v, [E, "Energizer"], [b, N]],
        [/; cat (b35);/i, /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i],
        [v, [E, "Cat"], [b, N]],
        [/((?:new )?andromax[\w- ]+)(?: bui|\))/i],
        [v, [E, "Smartfren"], [b, N]],
        [/droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i],
        [v, [E, "Nothing"], [b, N]],
        [
          /; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i,
          /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i,
        ],
        [v, [E, "Archos"], [b, $]],
        [/archos ([\w ]+)( b|\))/i, /; (ac[3-6]\d\w{2,8})( b|\))/i],
        [v, [E, "Archos"], [b, N]],
        [/; (n159v)/i],
        [v, [E, "HMD"], [b, N]],
        [
          /(imo) (tab \w+)/i,
          /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i,
        ],
        [E, v, [b, $]],
        [
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
          /; (blu|hmd|imo|infinix|lava|oneplus|tcl)[_ ]([\w\+ ]+?)(?: bui|\)|; r)/i,
          /(hp) ([\w ]+\w)/i,
          /(microsoft); (lumia[\w ]+)/i,
          /(oppo) ?([\w ]+) bui/i,
        ],
        [E, v, [b, N]],
        [
          /(kobo)\s(ereader|touch)/i,
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          /(kindle)\/([\w\.]+)/i,
        ],
        [E, v, [b, $]],
        [/(surface duo)/i],
        [v, [E, Lr], [b, $]],
        [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
        [v, [E, "Fairphone"], [b, N]],
        [/((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i],
        [v, [E, Ir], [b, $]],
        [/(sprint) (\w+)/i],
        [E, v, [b, N]],
        [/(kin\.[onetw]{3})/i],
        [
          [v, /\./g, " "],
          [E, Lr],
          [b, N],
        ],
        [/droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
        [v, [E, qr], [b, $]],
        [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
        [v, [E, qr], [b, N]],
        [/smart-tv.+(samsung)/i],
        [E, [b, z]],
        [/hbbtv.+maple;(\d+)/i],
        [
          [v, /^/, "SmartTV"],
          [E, gt],
          [b, z],
        ],
        [/(vizio)(?: |.+model\/)(\w+-\w+)/i, /tcast.+(lg)e?. ([-\w]+)/i],
        [E, v, [b, z]],
        [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
        [
          [E, Gt],
          [b, z],
        ],
        [/(apple) ?tv/i],
        [E, [v, ze + " TV"], [b, z]],
        [/crkey.*devicetype\/chromecast/i],
        [
          [v, Se + " Third Generation"],
          [E, Ue],
          [b, z],
        ],
        [/crkey.*devicetype\/([^/]*)/i],
        [
          [v, /^/, "Chromecast "],
          [E, Ue],
          [b, z],
        ],
        [/fuchsia.*crkey/i],
        [
          [v, Se + " Nest Hub"],
          [E, Ue],
          [b, z],
        ],
        [/crkey/i],
        [
          [v, Se],
          [E, Ue],
          [b, z],
        ],
        [/(portaltv)/i],
        [v, [E, Vr], [b, z]],
        [/droid.+aft(\w+)( bui|\))/i],
        [v, [E, zt], [b, z]],
        [/(shield \w+ tv)/i],
        [v, [E, Ir], [b, z]],
        [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
        [v, [E, Di], [b, z]],
        [/(bravia[\w ]+)( bui|\))/i],
        [v, [E, mt], [b, z]],
        [/(mi(tv|box)-?\w+) bui/i],
        [v, [E, Mr], [b, z]],
        [/Hbbtv.*(technisat) (.*);/i],
        [E, v, [b, z]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i,
        ],
        [
          [E, /.+\/(\w+)/, "$1", we, { LG: "lge" }],
          [v, Zt],
          [b, z],
        ],
        [/droid.+; ([\w- ]+) (?:android tv|smart[- ]?tv)/i],
        [v, [b, z]],
        [
          /\b(android tv|smart[- ]?tv|opera tv|tv; rv:|large screen[\w ]+safari)\b/i,
        ],
        [[b, z]],
        [/(playstation \w+)/i],
        [v, [E, mt], [b, ht]],
        [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
        [v, [E, Lr], [b, ht]],
        [/(ouya)/i, /(nintendo) (\w+)/i, /(retroid) (pocket ([^\)]+))/i],
        [E, v, [b, ht]],
        [/droid.+; (shield)( bui|\))/i],
        [v, [E, Ir], [b, ht]],
        [/\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i],
        [v, [E, gt], [b, pe]],
        [
          /((pebble))app/i,
          /(asus|google|lg|oppo) ((pixel |zen)?watch[\w ]*)( bui|\))/i,
        ],
        [E, v, [b, pe]],
        [/(ow(?:19|20)?we?[1-3]{1,3})/i],
        [v, [E, jr], [b, pe]],
        [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
        [v, [E, ze], [b, pe]],
        [/(opwwe\d{3})/i],
        [v, [E, Ni], [b, pe]],
        [/(moto 360)/i],
        [v, [E, Ur], [b, pe]],
        [/(smartwatch 3)/i],
        [v, [E, mt], [b, pe]],
        [/(g watch r)/i],
        [v, [E, Gt], [b, pe]],
        [/droid.+; (wt63?0{2,3})\)/i],
        [v, [E, qr], [b, pe]],
        [/droid.+; (glass) \d/i],
        [v, [E, Ue], [b, $t]],
        [/(pico) (4|neo3(?: link|pro)?)/i],
        [E, v, [b, $t]],
        [/(quest( \d| pro)?s?).+vr/i],
        [v, [E, Vr], [b, $t]],
        [/mobile vr; rv.+firefox/i],
        [[b, $t]],
        [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
        [E, [b, pt]],
        [/(aeobc)\b/i],
        [v, [E, zt], [b, pt]],
        [/(homepod).+mac os/i],
        [v, [E, ze], [b, pt]],
        [/windows iot/i],
        [[b, pt]],
        [
          /droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+?(mobile|vr|\d) safari/i,
        ],
        [v, [b, we, { mobile: "Mobile", xr: "VR", "*": $ }]],
        [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
        [[b, $]],
        [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],
        [[b, N]],
        [/droid .+?; ([\w\. -]+)( bui|\))/i],
        [v, [E, "Generic"]],
      ],
      engine: [
        [/windows.+ edge\/([\w\.]+)/i],
        [_, [x, Jt + "HTML"]],
        [/(arkweb)\/([\w\.]+)/i],
        [x, _],
        [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
        [_, [x, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
          /ekioh(flow)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          /(icab)[\/ ]([23]\.[\d\.]+)/i,
          /\b(libweb)/i,
        ],
        [x, _],
        [/ladybird\//i],
        [[x, "LibWeb"]],
        [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
        [_, x],
      ],
      os: [
        [/(windows nt) (6\.[23]); arm/i],
        [
          [x, /N/, "R"],
          [_, we, ji],
        ],
        [
          /(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i,
          /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i,
        ],
        [x, _],
        [
          /windows nt ?([\d\.\)]*)(?!.+xbox)/i,
          /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i,
        ],
        [
          [_, /(;|\))/g, "", we, ji],
          [x, Hr],
        ],
        [/(windows ce)\/?([\d\.]*)/i],
        [x, _],
        [
          /[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
          /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
          /cfnetwork\/.+darwin/i,
        ],
        [
          [_, /_/g, "."],
          [x, "iOS"],
        ],
        [
          /(mac os x) ?([\w\. ]*)/i,
          /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i,
        ],
        [
          [x, "macOS"],
          [_, /_/g, "."],
        ],
        [/android ([\d\.]+).*crkey/i],
        [_, [x, Se + " Android"]],
        [/fuchsia.*crkey\/([\d\.]+)/i],
        [_, [x, Se + " Fuchsia"]],
        [/crkey\/([\d\.]+).*devicetype\/smartspeaker/i],
        [_, [x, Se + " SmartSpeaker"]],
        [/linux.*crkey\/([\d\.]+)/i],
        [_, [x, Se + " Linux"]],
        [/crkey\/([\d\.]+)/i],
        [_, [x, Se]],
        [/droid ([\w\.]+)\b.+(android[- ]x86)/i],
        [_, x],
        [/(ubuntu) ([\w\.]+) like android/i],
        [[x, /(.+)/, "$1 Touch"], _],
        [
          /(harmonyos)[\/ ]?([\d\.]*)/i,
          /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i,
        ],
        [x, _],
        [/\(bb(10);/i],
        [_, [x, ki]],
        [/(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i],
        [_, [x, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
        ],
        [_, [x, bt + " OS"]],
        [
          /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i,
          /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i,
        ],
        [_, [x, "webOS"]],
        [/web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i],
        [
          [
            _,
            we,
            {
              25: "120",
              24: "108",
              23: "94",
              22: "87",
              6: "79",
              5: "68",
              4: "53",
              3: "38",
              2: "538",
              1: "537",
              "*": "TV",
            },
          ],
          [x, "webOS"],
        ],
        [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],
        [_, [x, "watchOS"]],
        [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],
        [[x, "Chrome OS"], _],
        [
          /panasonic;(viera)/i,
          /(netrange)mmh/i,
          /(nettv)\/(\d+\.[\w\.]+)/i,
          /(nintendo|playstation) (\w+)/i,
          /(xbox); +xbox ([^\);]+)/i,
          /(pico) .+os([\w\.]+)/i,
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          /linux.+(mint)[\/\(\) ]?([\w\.]*)/i,
          /(mageia|vectorlinux|fuchsia|arcaos|arch(?= ?linux))[;l ]([\d\.]*)/i,
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire|knoppix)(?: gnu[\/ ]linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          /\b(aix)[; ]([1-9\.]{0,4})/i,
          /(hurd|linux|morphos)(?: (?:arm|x86|ppc)\w*| ?)([\w\.]*)/i,
          /(gnu) ?([\w\.]*)/i,
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          /(haiku) ?(r\d)?/i,
        ],
        [x, _],
        [/(sunos) ?([\d\.]*)/i],
        [[x, "Solaris"], _],
        [
          /\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i,
          /(unix) ?([\w\.]*)/i,
        ],
        [x, _],
      ],
    },
    Yt = (function () {
      var e = { init: {}, isIgnore: {}, isIgnoreRgx: {}, toString: {} };
      return (
        ye.call(e.init, [
          [Z, [x, _, dt, b]],
          [me, [Y]],
          [he, [b, v, E]],
          [le, [x, _]],
          [ie, [x, _]],
        ]),
        ye.call(e.isIgnore, [
          [Z, [_, dt]],
          [le, [_]],
          [ie, [_]],
        ]),
        ye.call(e.isIgnoreRgx, [
          [Z, / ?browser$/i],
          [ie, / ?os$/i],
        ]),
        ye.call(e.toString, [
          [Z, [x, _]],
          [me, [Y]],
          [he, [E, v]],
          [le, [x, _]],
          [ie, [x, _]],
        ]),
        e
      );
    })(),
    Zu = function (e, t) {
      var r = Yt.init[t],
        n = Yt.isIgnore[t] || 0,
        i = Yt.isIgnoreRgx[t] || 0,
        o = Yt.toString[t] || 0;
      function s() {
        ye.call(this, r);
      }
      return (
        (s.prototype.getItem = function () {
          return e;
        }),
        (s.prototype.withClientHints = function () {
          return Oe
            ? Oe.getHighEntropyValues(Ci).then(function (u) {
                return e.setCH(new Vi(u, !1)).parseCH().get();
              })
            : e.parseCH().get();
        }),
        (s.prototype.withFeatureCheck = function () {
          return e.detectFeature().get();
        }),
        t != $e &&
          ((s.prototype.is = function (u) {
            var h = !1;
            for (var c in this)
              if (
                this.hasOwnProperty(c) &&
                !$r(n, c) &&
                be(i ? Xe(i, this[c]) : this[c]) == be(i ? Xe(i, u) : u)
              ) {
                if (((h = !0), u != _e)) break;
              } else if (u == _e && h) {
                h = !h;
                break;
              }
            return h;
          }),
          (s.prototype.toString = function () {
            var u = Ve;
            for (var h in o)
              typeof this[o[h]] !== _e && (u += (u ? " " : Ve) + this[o[h]]);
            return u || _e;
          })),
        Oe ||
          (s.prototype.then = function (u) {
            var h = this,
              c = function () {
                for (var w in h) h.hasOwnProperty(w) && (this[w] = h[w]);
              };
            c.prototype = {
              is: s.prototype.is,
              toString: s.prototype.toString,
            };
            var p = new c();
            return (u(p), p);
          }),
        new s()
      );
    };
  function Vi(e, t) {
    if (((e = e || {}), ye.call(this, Ci), t))
      ye.call(this, [
        [Br, Wr(e[Ae])],
        [Pr, Wr(e[qu])],
        [N, /\?1/.test(e[Wu])],
        [v, Et(e[zu])],
        [We, Et(e[Fi])],
        [Nr, Et(e[Gu])],
        [Y, Et(e[Vu])],
        [Le, Wr(e[$u])],
        [Wt, Et(e[Hu])],
      ]);
    else
      for (var r in e)
        this.hasOwnProperty(r) && typeof e[r] !== _e && (this[r] = e[r]);
  }
  function Hi(e, t, r, n) {
    return (
      (this.get = function (i) {
        return i
          ? this.data.hasOwnProperty(i)
            ? this.data[i]
            : void 0
          : this.data;
      }),
      (this.set = function (i, o) {
        return ((this.data[i] = o), this);
      }),
      (this.setCH = function (i) {
        return ((this.uaCH = i), this);
      }),
      (this.detectFeature = function () {
        if (Q && Q.userAgent == this.ua)
          switch (this.itemType) {
            case Z:
              Q.brave && typeof Q.brave.isBrave == Ht && this.set(x, "Brave");
              break;
            case he:
              (!this.get(b) && Oe && Oe[N] && this.set(b, N),
                this.get(v) == "Macintosh" &&
                  Q &&
                  typeof Q.standalone !== _e &&
                  Q.maxTouchPoints &&
                  Q.maxTouchPoints > 2 &&
                  this.set(v, "iPad").set(b, $));
              break;
            case ie:
              !this.get(x) && Oe && Oe[We] && this.set(x, Oe[We]);
              break;
            case $e:
              var i = this.data,
                o = function (s) {
                  return i[s].getItem().detectFeature().get();
                };
              this.set(Z, o(Z))
                .set(me, o(me))
                .set(he, o(he))
                .set(le, o(le))
                .set(ie, o(ie));
          }
        return this;
      }),
      (this.parseUA = function () {
        return (
          this.itemType != $e && Gr.call(this.data, this.ua, this.rgxMap),
          this.itemType == Z && this.set(dt, zr(this.get(_))),
          this
        );
      }),
      (this.parseCH = function () {
        var i = this.uaCH,
          o = this.rgxMap;
        switch (this.itemType) {
          case Z:
          case le:
            var s = i[Pr] || i[Br],
              u;
            if (s)
              for (var h in s) {
                var c = s[h].brand || s[h],
                  p = s[h].version;
                (this.itemType == Z &&
                  !/not.a.brand/i.test(c) &&
                  (!u ||
                    (/Chrom/.test(u) && c != Ui) ||
                    (u == Jt && /WebView2/.test(c))) &&
                  ((c = we(c, Ku)),
                  (u = this.get(x)),
                  (u && !/Chrom/.test(u) && /Chrom/.test(c)) ||
                    this.set(x, c).set(_, p).set(dt, zr(p)),
                  (u = c)),
                  this.itemType == le && c == Ui && this.set(_, p));
              }
            break;
          case me:
            var w = i[Y];
            w &&
              (w && i[Wt] == "64" && (w += "64"),
              Gr.call(this.data, w + ";", o));
            break;
          case he:
            if (
              (i[N] && this.set(b, N),
              i[v] && (this.set(v, i[v]), !this.get(b) || !this.get(E)))
            ) {
              var A = {};
              (Gr.call(A, "droid 9; " + i[v] + ")", o),
                !this.get(b) && A.type && this.set(b, A.type),
                !this.get(E) && A.vendor && this.set(E, A.vendor));
            }
            if (i[Le]) {
              var y;
              if (typeof i[Le] != "string")
                for (var m = 0; !y && m < i[Le].length; )
                  y = we(i[Le][m++], Mi);
              else y = we(i[Le], Mi);
              this.set(b, y);
            }
            break;
          case ie:
            var O = i[We];
            if (O) {
              var R = i[Nr];
              (O == Hr && (R = parseInt(zr(R), 10) >= 13 ? "11" : "10"),
                this.set(x, O).set(_, R));
            }
            this.get(x) == Hr &&
              i[v] == "Xbox" &&
              this.set(x, "Xbox").set(_, void 0);
            break;
          case $e:
            var T = this.data,
              k = function (L) {
                return T[L].getItem().setCH(i).parseCH().get();
              };
            this.set(Z, k(Z))
              .set(me, k(me))
              .set(he, k(he))
              .set(le, k(le))
              .set(ie, k(ie));
        }
        return this;
      }),
      ye.call(this, [
        ["itemType", e],
        ["ua", t],
        ["uaCH", n],
        ["rgxMap", r],
        ["data", Zu(this, e)],
      ]),
      this
    );
  }
  function ve(e, t, r) {
    if (
      (typeof e === He
        ? (Kt(e, !0)
            ? (typeof t === He && (r = t), (t = e))
            : ((r = e), (t = void 0)),
          (e = void 0))
        : typeof e === kr && !Kt(t, !0) && ((r = t), (t = void 0)),
      r && typeof r.append === Ht)
    ) {
      var n = {};
      (r.forEach(function (h, c) {
        n[c] = h;
      }),
        (r = n));
    }
    if (!(this instanceof ve)) return new ve(e, t, r).getResult();
    var i =
        typeof e === kr
          ? e
          : r && r[Oi]
            ? r[Oi]
            : Q && Q.userAgent
              ? Q.userAgent
              : Ve,
      o = new Vi(r, !0),
      s = t ? Xu(qi, t) : qi,
      u = function (h) {
        return h == $e
          ? function () {
              return new Hi(h, i, s, o)
                .set("ua", i)
                .set(Z, this.getBrowser())
                .set(me, this.getCPU())
                .set(he, this.getDevice())
                .set(le, this.getEngine())
                .set(ie, this.getOS())
                .get();
            }
          : function () {
              return new Hi(h, i, s[h], o).parseUA().get();
            };
      };
    return (
      ye
        .call(this, [
          ["getBrowser", u(Z)],
          ["getCPU", u(me)],
          ["getDevice", u(he)],
          ["getEngine", u(le)],
          ["getOS", u(ie)],
          ["getResult", u($e)],
          [
            "getUA",
            function () {
              return i;
            },
          ],
          [
            "setUA",
            function (h) {
              return (Je(h) && (i = h.length > Tr ? Zt(h, Tr) : h), this);
            },
          ],
        ])
        .setUA(i),
      this
    );
  }
  ((ve.VERSION = Mu),
    (ve.BROWSER = Xt([x, _, dt, b])),
    (ve.CPU = Xt([Y])),
    (ve.DEVICE = Xt([v, E, b, ht, N, z, $, pe, pt])),
    (ve.ENGINE = ve.OS = Xt([x, _])));
  function Yu() {
    var r, n, i;
    const e = {};
    ((e.aid = 6383),
      (e.channel = "channel_pc_web"),
      (e.device_platform = "webapp"),
      (e.pc_client_type = 1),
      (e.pc_libra_divert =
        ((n = (r = navigator.platform) == null ? void 0 : r.indexOf) == null
          ? void 0
          : n.call(r, "Mac")) > -1
          ? "Mac"
          : ((i = navigator.platform) == null ? void 0 : i.indexOf("Linux")) >
              -1
            ? "Unix"
            : "Windows"),
      (e.update_version_code = "170400"),
      (e.version_code = "170400"),
      (e.version_name = "17.4.0"),
      (e.support_dash = 1),
      (e.support_h265 = 1));
    const t = Qu();
    return Object.assign(e, t, ec());
  }
  function Qu() {
    const e = {};
    return (
      document.cookie &&
        document.cookie.split("; ").forEach((t) => {
          const [r, n] = t.split("=");
          e[r] = n;
        }),
      { uifid: e.UIFID || e.UIFID_TEMP }
    );
  }
  let Jr;
  function ec() {
    var e, t, r, n, i, o, s, u, h, c, p, w, A, y, m, O, R, T, k, L;
    if (Jr) return Jr;
    const M = ve(),
      j = {
        cookie_enabled:
          (e = navigator) === null || e === void 0 ? void 0 : e.cookieEnabled,
        screen_width: (t = screen) === null || t === void 0 ? void 0 : t.width,
        screen_height:
          (r = screen) === null || r === void 0 ? void 0 : r.height,
        browser_language:
          (n = navigator) === null || n === void 0 ? void 0 : n.language,
        browser_platform:
          (i = navigator) === null || i === void 0 ? void 0 : i.platform,
        browser_name:
          M == null || (o = M.browser) === null || o === void 0
            ? void 0
            : o.name,
        browser_version:
          M == null || (s = M.browser) === null || s === void 0
            ? void 0
            : s.version,
        browser_online:
          (u = navigator) === null || u === void 0 ? void 0 : u.onLine,
        engine_name:
          M == null || (h = M.engine) === null || h === void 0
            ? void 0
            : h.name,
        engine_version:
          M == null || (c = M.engine) === null || c === void 0
            ? void 0
            : c.version,
        os_name:
          M == null || (p = M.os) === null || p === void 0 ? void 0 : p.name,
        os_version:
          (M == null || (w = M.os) === null || w === void 0
            ? void 0
            : w.version) || "",
        cpu_core_num:
          ((A = navigator) === null || A === void 0
            ? void 0
            : A.hardwareConcurrency) || "",
        device_memory:
          ((y = navigator) === null || y === void 0
            ? void 0
            : y.deviceMemory) || "",
        platform: (function () {
          var te;
          let ue =
              ((te = navigator) === null || te === void 0
                ? void 0
                : te.userAgent) || "",
            ge = [
              "Android",
              "iPhone",
              "SymbianOS",
              "Windows Phone",
              "iPad",
              "iPod",
            ];
          for (let H = 0; H < ge.length; H++)
            if (ue.indexOf(ge[H]) !== -1) return ge[H];
          return "PC";
        })(),
        downlink:
          (O = navigator) === null ||
          O === void 0 ||
          (m = O.connection) === null ||
          m === void 0
            ? void 0
            : m.downlink,
        effective_type:
          (T = navigator) === null ||
          T === void 0 ||
          (R = T.connection) === null ||
          R === void 0
            ? void 0
            : R.effectiveType,
        round_trip_time:
          (L = navigator) === null ||
          L === void 0 ||
          (k = L.connection) === null ||
          k === void 0
            ? void 0
            : k.rtt,
      };
    return ((Jr = j), j);
  }
  const Xr = q.create({
    baseURL: "https://www.douyin.com",
    timeout: 3e4,
    withCredentials: !0,
  });
  (Xr.interceptors.request.use((e) => {
    const t = Yu(),
      r = tc.find((n) => n.reqPath === e.url);
    return (
      r && ((t.version_code = r.versionCode), (t.version_name = r.versionName)),
      t != null && t.uifid && (e.headers.uifid = t.uifid),
      (e.params = Object.assign({}, t, e.params)),
      e
    );
  }),
    Xr.interceptors.response.use((e) => {
      var i;
      const t = e.headers["x-vc-bdturing-parameters"];
      if (t) {
        const o = window.atob(t);
        throw (
          window.autoRender &&
            Te("isVipUser", void 0).then((s) => {
              var u;
              s &&
                ((u = window.autoRender) == null ||
                  u.call(window, {
                    commonOptions: void 0,
                    verify_data: o,
                    captchaOptions: {
                      ele: !1,
                      feedbackEle: !1,
                      host: "//verify.zijieapi.com/",
                      closeCb: (h) => {
                        console.log("closeCb", h);
                      },
                      errorCb: (h) => {
                        console.log("errorCb", h);
                      },
                    },
                    secondVerifyWebOptions: {
                      scene: "4",
                      useSmsMode: 6,
                      ele: !1,
                      callBack: (h) => {
                        console.log("callBack", h);
                      },
                      closeCallBack: (h) => {
                        console.log("closeCallBack", h);
                      },
                    },
                  }));
            }),
          new U(
            "\u5DF2\u89E6\u53D1\u6296\u97F3\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
            U.ERR_BAD_RESPONSE,
            e.config,
            e.request,
            e,
          )
        );
      }
      if (!e.data)
        throw new U(
          "\u6296\u97F3API\u8FD4\u56DE\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u53EF\u80FD\u5DF2\u88AB\u5E73\u53F0\u9650\u5236\uFF0C\u53EF\u5C1D\u8BD5\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      const { status_code: r, status_msg: n } = e.data;
      if (r) {
        const o =
          n ||
          ((i = e.data) == null ? void 0 : i.message) ||
          "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01";
        throw new U(o, U.ERR_BAD_RESPONSE, e.config, e.request, e);
      }
      return e;
    }));
  const tc = [
      {
        reqPath: "/live/promotions/page/",
        versionCode: "210800",
        versionName: "21.8.0",
      },
      {
        reqPath: "/live/promotions/page/top/",
        versionCode: "210800",
        versionName: "21.8.0",
      },
      {
        reqPath: "/live/promotions/pop/v3/",
        versionCode: "230300",
        versionName: "23.3.0",
      },
      {
        reqPath: "/aweme/v1/web/aweme/detail/",
        versionCode: "190500",
        versionName: "19.5.0",
      },
      {
        reqPath: "/aweme/v1/web/general/search/single/",
        versionCode: "190600",
        versionName: "19.6.0",
      },
      {
        reqPath: "/aweme/v1/web/general/search/stream/",
        versionCode: "190600",
        versionName: "19.6.0",
      },
      {
        reqPath: "/ecom/product/detail/saas/pc/",
        versionCode: "",
        versionName: "",
      },
      {
        reqPath: "/aweme/v2/shop/promotion/pack/detail/",
        versionCode: "",
        versionName: "",
      },
      {
        reqPath: "/aweme/v1/web/collects/maintain/",
        versionCode: "230000",
        versionName: "23.0.0",
      },
      {
        reqPath: "/aweme/v1/web/aweme/post/",
        versionCode: "290100",
        versionName: "29.1.0",
      },
      {
        reqPath: "/aweme/v1/web/im/resource/sticker/collect",
        versionCode: "290100",
        versionName: "29.1.0",
      },
    ],
    rc = () => {
      (ju(),
        ft(),
        ke(Xr),
        ne("httpRequest", async (e) => Be()(...e)),
        Promise.resolve().then(() => Ic));
    },
    $i = "encrypter",
    Wi = "encoder",
    nc = 1e4,
    ic = 6e4;
  let Ke;
  function oc() {
    if (Ke && typeof (Ke == null ? void 0 : Ke.call) == "function") return;
    const e = Object.getOwnPropertyDescriptor(Object.prototype, $i),
      t = Object.getOwnPropertyDescriptor(Object.prototype, Wi);
    if (e && t) {
      console.warn(
        "[kuaishou] Signer capture skipped because Object.prototype.encrypter and encoder already exists.",
      );
      return;
    }
    const r = e ? Wi : $i;
    let n = !0,
      i = () => {};
    const o = function (u) {
      (Object.defineProperty(this, r, {
        configurable: !0,
        enumerable: !0,
        value: u,
        writable: !0,
      }),
        !(!n || !sc(this)) && ((n = !1), (Ke = this), i()));
    };
    let s;
    i = () => {
      s !== void 0 && (window.clearTimeout(s), (s = void 0));
      const u = Object.getOwnPropertyDescriptor(Object.prototype, r);
      (u == null ? void 0 : u.set) === o && delete Object.prototype[r];
    };
    try {
      (Object.defineProperty(Object.prototype, r, {
        configurable: !0,
        enumerable: !1,
        set: o,
      }),
        (s = window.setTimeout(i, ic)));
    } catch (u) {
      console.warn("[kuaishou] Failed to install signer capture.", u);
    }
  }
  function sc(e) {
    if (!e || typeof e != "object" || e === window) return !1;
    const t = e;
    return (
      typeof t.$encode == "function" &&
      typeof t.$getCatVersion == "function" &&
      typeof t.call == "function"
    );
  }
  async function ac(e) {
    const t = Ke;
    if (typeof (t == null ? void 0 : t.call) != "function")
      throw new Error(
        "\u5FEB\u624B\u7B7E\u540D\u73AF\u5883\u5C1A\u672A\u521D\u59CB\u5316\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5",
      );
    const r = String(t.call("$getCatVersion") || "");
    if (!r)
      throw new Error(
        "\u5FEB\u624B\u7B7E\u540D\u7248\u672C\u83B7\u53D6\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5",
      );
    const n = uc(e, r),
      i = await fc(
        new Promise((o, s) => {
          try {
            t.call("$encode", [
              n,
              {
                suc: (u) => o(String(u)),
                err: (u) =>
                  s(Kr(u, "\u5FEB\u624B\u7B7E\u540D\u751F\u6210\u5931\u8D25")),
              },
            ]);
          } catch (u) {
            s(Kr(u, "\u5FEB\u624B\u7B7E\u540D\u751F\u6210\u5931\u8D25"));
          }
        }),
        nc,
        "\u5FEB\u624B\u7B7E\u540D\u751F\u6210\u8D85\u65F6\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5",
      );
    if (!i)
      throw new Error(
        "\u5FEB\u624B\u7B7E\u540D\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5",
      );
    return { caver: r, signature: i };
  }
  function uc(e, t) {
    const r = new URL(e.url || "", e.baseURL || location.origin),
      n = { ...e.params };
    (r.searchParams.forEach((s, u) => {
      n[u] = s;
    }),
      delete n.__NS_hxfalcon,
      delete n.caver);
    const i = cc(e),
      o = e.data;
    return {
      url: r.pathname,
      query: { caver: t, ...n },
      form: i === "application/x-www-form-urlencoded" && o ? o : {},
      requestBody: i === "application/json" && o ? lc(o) : {},
    };
  }
  function cc(e) {
    const t = e.headers,
      r =
        typeof (t == null ? void 0 : t.getContentType) == "function"
          ? t.getContentType()
          : t == null
            ? void 0
            : t["Content-Type"];
    return !r && typeof e.data == "object"
      ? "application/json"
      : typeof r == "string"
        ? r
        : "";
  }
  function lc(e) {
    if (typeof e != "string") return e;
    try {
      return JSON.parse(e);
    } catch (t) {
      throw Kr(
        t,
        "\u5FEB\u624B\u7B7E\u540D\u8BF7\u6C42\u4F53\u4E0D\u662F\u6709\u6548\u7684 JSON",
      );
    }
  }
  function fc(e, t, r) {
    return new Promise((n, i) => {
      const o = window.setTimeout(() => i(new Error(r)), t);
      e.then(
        (s) => {
          (window.clearTimeout(o), n(s));
        },
        (s) => {
          (window.clearTimeout(o), i(s));
        },
      );
    });
  }
  function Kr(e, t) {
    if (e instanceof Error) return e;
    const r = String(e || "").trim();
    return new Error(r || t);
  }
  const Zr = q.create({
    baseURL: "https://www.kuaishou.com",
    timeout: 3e4,
    withCredentials: !0,
  });
  let Yr, Qr;
  (Zr.interceptors.request.use(async (e) => {
    if (
      (Yr && (e.headers["identity-verification-type"] = Yr),
      Qr && (e.headers["identity-verification-token"] = Qr),
      !e.url || !e.url.includes("/rest/v/"))
    )
      return e;
    const t = await ac(e).catch((r) => {
      console.error("[kuaishou] signature create failed.", r);
    });
    return (
      t &&
        (e.params = Object.assign(e.params || {}, {
          __NS_hxfalcon: t.signature,
          caver: t.caver,
        })),
      e
    );
  }),
    Zr.interceptors.response.use((e) => {
      var u, h, c, p;
      let {
        data: t,
        errors: r,
        loginUrl: n,
        result: i,
        error_msg: o,
        error_url: s,
      } = e.data || {};
      if (
        ((u = e.config.url) != null &&
          u.includes("/live_api/") &&
          t.data &&
          ((t = t.data),
          (i = t.result),
          o || (o = (t == null ? void 0 : t.error_msg) || ""),
          s || (s = (t == null ? void 0 : t.error_url) || "")),
        !i &&
          typeof (t == null ? void 0 : t.result) == "number" &&
          (i = t.result),
        i && i !== 1)
      ) {
        const w = s || (t == null ? void 0 : t.url) || "";
        let A = o;
        throw i === 400002 && w.startsWith("https://captcha.zt.kuaishou.com")
          ? (Te("isVipUser", void 0).then((y) => {
              y && zi(w);
            }),
            new U(
              "\u5DF2\u89E6\u53D1\u5FEB\u624B\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
              U.ERR_BAD_RESPONSE,
              e.config,
              e.request,
              e,
            ))
          : (i === 2056 || n
              ? (window.dispatchEvent(
                  new CustomEvent("force-login", {
                    detail: { source: "FORCE_LOGIN_2056" },
                  }),
                ),
                A ||
                  (A =
                    "\u8BF7\u767B\u5F55\u5FEB\u624B\u8D26\u53F7\u540E\u518D\u8BD5"))
              : i === 7935 &&
                (window.dispatchEvent(new CustomEvent("global-protect-popup")),
                A ||
                  (A =
                    "\u5DF2\u89E6\u53D1\u5E73\u53F0\u7CFB\u7EDF\u4FDD\u62A4")),
            new U(
              A || "\u5FEB\u624B\u670D\u52A1\u5668\u51FA\u9519\u4E86",
              U.ERR_BAD_RESPONSE,
              e.config,
              e.request,
              e,
            ));
      }
      if (r != null && r.length) {
        const w =
          ((h = r.map((A) => (A == null ? void 0 : A.message))) == null
            ? void 0
            : h.join(`
`)) || "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01";
        throw w.includes("Need captcha")
          ? ((c = t.captcha) != null &&
              c.url &&
              Te("isVipUser", void 0).then((A) => {
                var y;
                A && zi((y = t.captcha) == null ? void 0 : y.url);
              }),
            new U(
              "\u5DF2\u89E6\u53D1\u5FEB\u624B\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
              U.ERR_BAD_RESPONSE,
              e.config,
              e.request,
              e,
            ))
          : new Error(w);
      }
      if (!e.data || ((p = e.headers) != null && p["intercept-result"]))
        throw new U(
          "\u8BF7\u6C42\u5DF2\u88AB\u5E73\u53F0\u62E6\u622A\uFF0C\u8BF7\u5237\u65B0\u91CD\u8BD5\uFF01",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      return e;
    }));
  function zi(e) {
    const t = document.createElement("div");
    t.style =
      "position: fixed; inset: 0px; z-index: 99999; display: flex; align-items: center; justify-content: center;";
    const r = document.createElement("div");
    ((r.style =
      "position: absolute; inset: 0px; background: rgba(0, 0, 0, 0.6);"),
      t.appendChild(r));
    const n = document.createElement("iframe");
    ((n.src = e + "&displayType=popup"),
      (n.style =
        "position: relative; display: block; border: none; width: 360px; height: 360px;"),
      n.setAttribute("scrolling", "no"),
      n.setAttribute("marginheight", "0"),
      n.setAttribute("marginwidth", "0"),
      n.setAttribute("border", "0"),
      n.setAttribute("frameboarder", "0"),
      t.appendChild(n),
      document.body.appendChild(t));
    const i = (o) => {
      var u;
      if (!o.data) return;
      const s = JSON.parse(o.data);
      s.msgType === "RESULT" &&
        (t.remove(),
        window.removeEventListener("message", i),
        ((u = s.msg) == null ? void 0 : u.result) == 1 &&
          ((Qr = s.msg.token), (Yr = s.msg.type || s.msg.unifiedType)));
    };
    window.addEventListener("message", i);
  }
  const dc = () => {
    (Tt(),
      ft(),
      ke(Zr),
      ne("httpRequest", async (e) => Be()(...e)),
      Promise.resolve().then(() => jc),
      oc());
  };
  var xt = {},
    Gi;
  function hc() {
    if (Gi) return xt;
    ((Gi = 1),
      (xt.byteLength = u),
      (xt.toByteArray = c),
      (xt.fromByteArray = A));
    for (
      var e = [],
        t = [],
        r = typeof Uint8Array < "u" ? Uint8Array : Array,
        n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        i = 0,
        o = n.length;
      i < o;
      ++i
    )
      ((e[i] = n[i]), (t[n.charCodeAt(i)] = i));
    ((t[45] = 62), (t[95] = 63));
    function s(y) {
      var m = y.length;
      if (m % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var O = y.indexOf("=");
      O === -1 && (O = m);
      var R = O === m ? 0 : 4 - (O % 4);
      return [O, R];
    }
    function u(y) {
      var m = s(y),
        O = m[0],
        R = m[1];
      return ((O + R) * 3) / 4 - R;
    }
    function h(y, m, O) {
      return ((m + O) * 3) / 4 - O;
    }
    function c(y) {
      var m,
        O = s(y),
        R = O[0],
        T = O[1],
        k = new r(h(y, R, T)),
        L = 0,
        M = T > 0 ? R - 4 : R,
        j;
      for (j = 0; j < M; j += 4)
        ((m =
          (t[y.charCodeAt(j)] << 18) |
          (t[y.charCodeAt(j + 1)] << 12) |
          (t[y.charCodeAt(j + 2)] << 6) |
          t[y.charCodeAt(j + 3)]),
          (k[L++] = (m >> 16) & 255),
          (k[L++] = (m >> 8) & 255),
          (k[L++] = m & 255));
      return (
        T === 2 &&
          ((m = (t[y.charCodeAt(j)] << 2) | (t[y.charCodeAt(j + 1)] >> 4)),
          (k[L++] = m & 255)),
        T === 1 &&
          ((m =
            (t[y.charCodeAt(j)] << 10) |
            (t[y.charCodeAt(j + 1)] << 4) |
            (t[y.charCodeAt(j + 2)] >> 2)),
          (k[L++] = (m >> 8) & 255),
          (k[L++] = m & 255)),
        k
      );
    }
    function p(y) {
      return (
        e[(y >> 18) & 63] + e[(y >> 12) & 63] + e[(y >> 6) & 63] + e[y & 63]
      );
    }
    function w(y, m, O) {
      for (var R, T = [], k = m; k < O; k += 3)
        ((R =
          ((y[k] << 16) & 16711680) +
          ((y[k + 1] << 8) & 65280) +
          (y[k + 2] & 255)),
          T.push(p(R)));
      return T.join("");
    }
    function A(y) {
      for (
        var m, O = y.length, R = O % 3, T = [], k = 16383, L = 0, M = O - R;
        L < M;
        L += k
      )
        T.push(w(y, L, L + k > M ? M : L + k));
      return (
        R === 1
          ? ((m = y[O - 1]), T.push(e[m >> 2] + e[(m << 4) & 63] + "=="))
          : R === 2 &&
            ((m = (y[O - 2] << 8) + y[O - 1]),
            T.push(e[m >> 10] + e[(m >> 4) & 63] + e[(m << 2) & 63] + "=")),
        T.join("")
      );
    }
    return xt;
  }
  var pc = hc();
  const Ji = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function Xi(e, t, r = "=") {
    if (t.length !== Ji.length)
      throw new Error(
        "The custom Base64 alphabet must contain exactly 64 characters.",
      );
    const n = pc.fromByteArray(e);
    let i = "";
    for (const o of n) {
      if (o === "=") {
        i += r;
        continue;
      }
      const s = Ji.indexOf(o);
      if (s === -1) throw new Error(`Unexpected Base64 character: ${o}`);
      i += t[s];
    }
    return i;
  }
  function en(e) {
    const t = encodeURIComponent(e),
      r = [];
    for (let n = 0; n < t.length; n++)
      t[n] === "%"
        ? (r.push(Number.parseInt(t.slice(n + 1, n + 3), 16)), (n += 2))
        : r.push(t.charCodeAt(n));
    return Uint8Array.from(r);
  }
  const Ki = "https://pgy.xiaohongshu.com",
    tn = q.create({ baseURL: Ki, timeout: 3e4, withCredentials: !0 });
  (tn.interceptors.request.use(async (e) => {
    const t = q.getUri(e).replace(Ki, ""),
      r = mc(t, e.data);
    return (
      (e.headers["x-s"] = r["X-s"]),
      (e.headers["x-t"] = r["X-t"]),
      (e.headers["x-b3-traceid"] = bc()),
      e
    );
  }),
    tn.interceptors.response.use(
      (e) => {
        const { msg: t, code: r } = e.data;
        if (r && r !== 1e3)
          throw new U(
            t || "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01",
            U.ERR_BAD_RESPONSE,
            e.config,
            e.request,
            e,
          );
        return e;
      },
      (e) => {
        const { data: t } = e.response ?? {};
        return (
          t != null && t.msg && (e.message = t == null ? void 0 : t.msg),
          Promise.reject(e)
        );
      },
    ));
  const wc = "A4NjFqYu5wPHsO0XTdDgMa2r1ZQocVte9UJBvk6/7=yRnhISGKblCWi+LpfE8xzm",
    gc = "3";
  function mc(e, t) {
    const r = Date.now(),
      n = "test",
      i = Object.prototype.toString.call(t),
      o =
        i === "[object Object]" || i === "[object Array]"
          ? JSON.stringify(t)
          : "",
      s = Vt.md5([r, n, e, o].join(""));
    return { "X-s": Xi(en(s), wc, gc), "X-t": r };
  }
  function bc() {
    const e = "abcdef0123456789";
    return Array.from(
      { length: 16 },
      () => e[Math.floor(Math.random() * e.length)],
    ).join("");
  }
  const yc = () => {
    (ft(), ke(tn), ne("httpRequest", async (e) => Be()(...e)));
  };
  function vc() {
    const e = xc();
    return _c(Object.assign(e, { isMobile: !1, os: Ec() }), !1, !1);
  }
  function Ec(e = navigator.userAgent) {
    const t = /\(i[^;]+;( U;)? CPU.+Mac OS X/,
      r = /Android|android|Adr/,
      n = /X11/,
      i = /\(Macintosh; Intel /,
      o = /Win\d{2}|Windows/;
    return e.length > 1e3
      ? "unknown"
      : r.test(e)
        ? "android"
        : n.test(e)
          ? "linux"
          : t.test(e)
            ? "ios"
            : i.test(e)
              ? "mac"
              : o.test(e)
                ? "windows"
                : "unknown";
  }
  function xc() {
    var t, r;
    const e =
      (r =
        (t = window.__$UNIVERSAL_DATA$__) == null
          ? void 0
          : t.__DEFAULT_SCOPE__) == null
        ? void 0
        : r["webapp.app-context"];
    return (
      e || {
        language: "zh-Hans",
        region: "SG",
        appId: 1180,
        appType: "t",
        clusterRegion: "ALL_SG",
        userAgent: navigator.userAgent,
        host: "www.tiktok.com",
      }
    );
  }
  const _c = (e, t, r) => {
      const n = (c, p) => {
        try {
          return sessionStorage.getItem(c) || p;
        } catch {
          return (console.warn("sessionStorage get failed"), p);
        }
      };
      function i(c, p = "") {
        var w;
        try {
          return (w = localStorage.getItem(c)) !== null && w !== void 0 ? w : p;
        } catch {
          return p;
        }
      }
      var o, s, u;
      const h = document.cookie.match(/s_v_web_id=(\w+)/);
      try {
        const c =
            ((u =
              (s =
                (o = e.abTestVersion) === null || o === void 0
                  ? void 0
                  : o.parameters) === null || s === void 0
                ? void 0
                : s.webapp_odin_id_fe_reverse) === null || u === void 0
              ? void 0
              : u.vid) === "v1",
          p = !!(e || {}).user,
          w = Object.assign(
            Object.assign(
              {
                aid: "1988",
                app_name: "tiktok_web",
                channel: "tiktok_web",
                device_platform: (e || {}).isMobile ? "web_mobile" : "web_pc",
                device_id: (e || {}).wid,
                region: (e || {}).region,
                priority_region: ((e || {}).user || {}).region || "",
                os: (e || {}).os,
                referer: document.referrer,
                root_referer: n("webapp-session-referer"),
                cookie_enabled: navigator.cookieEnabled,
                screen_width: screen.width,
                screen_height: screen.height,
                browser_language: navigator.language,
                browser_platform: navigator.platform,
                browser_name: navigator.appCodeName,
                browser_version: navigator.appVersion,
                browser_online: navigator.onLine,
                verifyFp: (h || "")[1],
                app_language: (e || {}).language,
                webcast_language: (e || {}).language,
                tz_name: Intl.DateTimeFormat().resolvedOptions().timeZone,
                is_page_visible: t,
                focus_state: r,
                is_fullscreen: window.matchMedia("(display-mode: fullscreen)")
                  .matches,
                history_len: window.history.length,
              },
              c ? {} : { user_is_login: p },
            ),
            { data_collection_enabled: p || i("guest-mode-flag", "0") === "1" },
          );
        return (
          n("enter_method") === "ageVerify" &&
            (w.security_verification_aid = "1459"),
          w
        );
      } catch {}
      return {};
    },
    rn = q.create({
      baseURL: "https://www.tiktok.com",
      timeout: 3e4,
      withCredentials: !0,
    });
  (rn.interceptors.request.use(async (e) => {
    const t = vc();
    return ((e.params = Object.assign({}, t, e.params)), e);
  }),
    rn.interceptors.response.use((e) => {
      const t = e.headers["bdturing-verify"];
      if (t) {
        try {
          const r = JSON.parse(t);
          window.renderCaptcha &&
            Te("isVipUser", void 0).then((n) => {
              var i;
              if (n)
                return (i = window.renderCaptcha) == null
                  ? void 0
                  : i.call(window, {
                      userMode: 516,
                      verify_data: r,
                      captchaOptions: {
                        ele: "tiktok-verify-ele",
                        lang: "en",
                        showMode: "mask",
                        fpCookieOption: {
                          domain: ".tiktok.com",
                          sameSite: "None",
                          secure: !0,
                        },
                        closeCb: (o) => {
                          console.log("closeCb", o);
                        },
                        errorCb: (o) => {
                          console.log("errorCb", o);
                        },
                        successCb: (o) => {
                          console.log("successCb", o);
                        },
                      },
                    });
            });
        } catch (r) {
          console.warn(r);
        }
        throw new U(
          "\u5DF2\u89E6\u53D1TikTok\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      }
      if (!e.data)
        throw new U(
          "TikTok API\u8FD4\u56DE\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u53EF\u80FD\u5DF2\u88AB\u5E73\u53F0\u9650\u5236\uFF0C\u53EF\u5C1D\u8BD5\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      return (Sc(e.data), e);
    }));
  const Ac = (function (e) {
    return (
      (e[(e.NIL = -255)] = "NIL"),
      (e[(e.UnknownError = -1)] = "UnknownError"),
      (e[(e.Ok = 0)] = "Ok"),
      (e[(e.ReportLiveFailed = 90002)] = "ReportLiveFailed"),
      (e[(e.VerifyCode = 1e4)] = "VerifyCode"),
      (e[(e.VideoLikeFreq = 2150)] = "VideoLikeFreq"),
      (e[(e.VideoLikeFreq2 = 2210)] = "VideoLikeFreq2"),
      (e[(e.VideoUnavailableDeleted = 2054)] = "VideoUnavailableDeleted"),
      (e[(e.AdVideoUnavailableChange = 2752)] = "AdVideoUnavailableChange"),
      (e[(e.CommentBanCode = 22)] = "CommentBanCode"),
      (e[(e.CommentLikePermissionDisable = 3002043)] =
        "CommentLikePermissionDisable"),
      (e[(e.SearchSensitiveCode = 403)] = "SearchSensitiveCode"),
      (e[(e.SearchYoungCode = 203)] = "SearchYoungCode"),
      (e[(e.SmsInvalidNumber = -1)] = "SmsInvalidNumber"),
      (e[(e.SmsSlideVerify = -4)] = "SmsSlideVerify"),
      (e[(e.FypVideoListLimit = 10404)] = "FypVideoListLimit"),
      (e[(e.ClientPageError = 450)] = "ClientPageError"),
      (e[(e.LiveNeedLogin = 10119)] = "LiveNeedLogin"),
      (e[(e.SharkBlock = 10114)] = "SharkBlock"),
      (e[(e.SharkSlide = 10113)] = "SharkSlide"),
      (e[(e.NetError = 10111)] = "NetError"),
      (e[(e.ServerErrorNot500 = 10101)] = "ServerErrorNot500"),
      (e[(e.VideoRisk = 10228)] = "VideoRisk"),
      (e[(e.VideoRMask = 10229)] = "VideoRMask"),
      (e[(e.VideoRiskMask = 10230)] = "VideoRiskMask"),
      (e[(e.VideoNeedRecheck = 10227)] = "VideoNeedRecheck"),
      (e[(e.VideoUnshelveByMusic = 10220)] = "VideoUnshelveByMusic"),
      (e[(e.VideoNotExist = 10204)] = "VideoNotExist"),
      (e[(e.VideoAbnormal = 10215)] = "VideoAbnormal"),
      (e[(e.VideoLowAgeM = 10213)] = "VideoLowAgeM"),
      (e[(e.VideoLowAgeT = 10214)] = "VideoLowAgeT"),
      (e[(e.VideoFirstReviewUnshelve = 10217)] = "VideoFirstReviewUnshelve"),
      (e[(e.VideoPrivateByUser = 10216)] = "VideoPrivateByUser"),
      (e[(e.VideoGeofenceBlock = 10231)] = "VideoGeofenceBlock"),
      (e[(e.VideoPhoto = 10239)] = "VideoPhoto"),
      (e[(e.VideoFriendsOnly = 10240)] = "VideoFriendsOnly"),
      (e[(e.VideoDeleted = 10241)] = "VideoDeleted"),
      (e[(e.VideoUserBlockedByAuthor = 10242)] = "VideoUserBlockedByAuthor"),
      (e[(e.VideoSubscribersOnly = 203005)] = "VideoSubscribersOnly"),
      (e[(e.StoryUnavailable = 10246)] = "StoryUnavailable"),
      (e[(e.HashtagNotExist = 10205)] = "HashtagNotExist"),
      (e[(e.HashtagUnshelve = 10212)] = "HashtagUnshelve"),
      (e[(e.HashtagSensitivityWord = 10211)] = "HashtagSensitivityWord"),
      (e[(e.HashtagBlackList = 10209)] = "HashtagBlackList"),
      (e[(e.UserInboxFollowBan = 24)] = "UserInboxFollowBan"),
      (e[(e.UserNotExist = 10202)] = "UserNotExist"),
      (e[(e.UserBan = 10221)] = "UserBan"),
      (e[(e.UserPrivate = 10222)] = "UserPrivate"),
      (e[(e.UserNotLogin = 10102)] = "UserNotLogin"),
      (e[(e.UserFtc = 10223)] = "UserFtc"),
      (e[(e.UserUniqueSensitivity = 10225)] = "UserUniqueSensitivity"),
      (e[(e.QuestionNotAvailable = 10236)] = "QuestionNotAvailable"),
      (e[(e.MusicNotExist = 10203)] = "MusicNotExist"),
      (e[(e.MusicUnshelve = 10218)] = "MusicUnshelve"),
      (e[(e.MusicNoCopyright = 10219)] = "MusicNoCopyright"),
      (e[(e.MusicUnavailable = 202001)] = "MusicUnavailable"),
      (e[(e.PlaceNotExist = 205001)] = "PlaceNotExist"),
      (e[(e.PlaceOffline = 205002)] = "PlaceOffline"),
      (e[(e.PlaceUnavailableInRegion = 205003)] = "PlaceUnavailableInRegion"),
      (e[(e.GameNotExist = 10224)] = "GameNotExist"),
      (e[(e.LiveNotExist = 10210)] = "LiveNotExist"),
      (e[(e.GoLiveRoomBaned = 10018)] = "GoLiveRoomBaned"),
      (e[(e.GoLiveBaned = 4003035)] = "GoLiveBaned"),
      (e[(e.LiveRoomPrepare = 30019)] = "LiveRoomPrepare"),
      (e[(e.LiveRoomEnd = 30003)] = "LiveRoomEnd"),
      (e[(e.LiveRoomBan = 30012)] = "LiveRoomBan"),
      (e[(e.LiveNoGatedAuth = 4003043)] = "LiveNoGatedAuth"),
      (e[(e.LiveNoAgeGatedAuth = 4003110)] = "LiveNoAgeGatedAuth"),
      (e[(e.LivePaidEvent = 4003072)] = "LivePaidEvent"),
      (e[(e.LiveSubscriberOnly = 4003135)] = "LiveSubscriberOnly"),
      (e[(e.LiveSuicideCase = 2403)] = "LiveSuicideCase"),
      (e[(e.LiveSensitiveTitle = 50004)] = "LiveSensitiveTitle"),
      (e[(e.LiveRoomBaned = 10018)] = "LiveRoomBaned"),
      (e[(e.LiveEnterRoomNeedLogin = 20003)] = "LiveEnterRoomNeedLogin"),
      (e[(e.LiveAccountUnderRiskControl = 20063)] =
        "LiveAccountUnderRiskControl"),
      (e[(e.LiveHitBanStrategy = 30009)] = "LiveHitBanStrategy"),
      (e[(e.LiveOBSAccessRecalled = 4003105)] = "LiveOBSAccessRecalled"),
      (e[(e.LiveUserNotFound = 19881007)] = "LiveUserNotFound"),
      (e[(e.CollectionUnavailable = 204003)] = "CollectionUnavailable"),
      (e[(e.EffectNotExist = 10208)] = "EffectNotExist"),
      (e[(e.PlaylistNotExist = 10233)] = "PlaylistNotExist"),
      (e[(e.PlaylistInTrill = 10234)] = "PlaylistInTrill"),
      (e[(e.VideoPlaylistUnavailable = 10243)] = "VideoPlaylistUnavailable"),
      (e[(e.VideoPlaylistIsEmpty = 10244)] = "VideoPlaylistIsEmpty"),
      (e[(e.PrivateAccountLimitByBC = 3026002)] = "PrivateAccountLimitByBC"),
      (e[(e.PnsPnsPrivateAccountLimitByLiveOn = 3026006)] =
        "PnsPnsPrivateAccountLimitByLiveOn"),
      (e[(e.BlockedAndLogout = 56009)] = "BlockedAndLogout"),
      (e[(e.CreatePlaylistWithRiskError = 206001)] =
        "CreatePlaylistWithRiskError"),
      (e[(e.VideoPlaylistVisibleToCreator = 206002)] =
        "VideoPlaylistVisibleToCreator"),
      (e[(e.AddPlaylistVideoWithRiskError = 206003)] =
        "AddPlaylistVideoWithRiskError"),
      (e[(e.VideoPlaylistUnavailableToVisitor = 206004)] =
        "VideoPlaylistUnavailableToVisitor"),
      (e[(e.VideoPlaylistDeleted = 206005)] = "VideoPlaylistDeleted"),
      (e[(e.CodeUserGeoBlocked = 209001)] = "CodeUserGeoBlocked"),
      (e[(e.CodeUserAudienceControlLogout = 209002)] =
        "CodeUserAudienceControlLogout"),
      (e[(e.CodeUserNoAgeInterval = 209003)] = "CodeUserNoAgeInterval"),
      (e[(e.CodeUserU18 = 209004)] = "CodeUserU18"),
      (e[(e.CodeUserRestrictedFamilyParingOff = 209005)] =
        "CodeUserRestrictedFamilyParingOff"),
      (e[(e.CodeUserRestrictedFamilyParingOn = 209006)] =
        "CodeUserRestrictedFamilyParingOn"),
      e
    );
  })({});
  function Sc(e) {
    if (!e)
      throw new Error(
        '"TikTok API\u8FD4\u56DE\u5185\u5BB9\u4E3A\u7A7A\uFF0C\u53EF\u80FD\u5DF2\u88AB\u5E73\u53F0\u9650\u5236\uFF0C\u53EF\u5C1D\u8BD5\u5237\u65B0\u9875\u9762\u91CD\u8BD5\u3002"',
      );
    const {
        status_code: t,
        statusCode: r,
        status_msg: n,
        statusMsg: i,
        has_more: o,
        message: s,
      } = e,
      u = t || r;
    if (u && !o) {
      const h =
        n ||
        i ||
        Ac[u] ||
        s ||
        `\u6570\u636E\u83B7\u53D6\u5931\u8D25\uFF0C\u72B6\u6001\u7801:${u}`;
      throw new Error(h);
    } else if (n) throw new Error(n);
    return e;
  }
  const Oc = () => {
    (Tt(), ke(rn), ne("httpRequest", async (e) => Be()(...e)));
  };
  var oe = null;
  try {
    oe = new WebAssembly.Instance(
      new WebAssembly.Module(
        new Uint8Array([
          0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127,
          127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0,
          11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2,
          5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5,
          114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103,
          104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173,
          32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134,
          132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1,
          126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173,
          66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11,
          36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173,
          32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32,
          4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132,
          32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135,
          167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66,
          32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4,
          66, 32, 135, 167, 36, 0, 32, 4, 167, 11,
        ]),
      ),
      {},
    ).exports;
  } catch {}
  function V(e, t, r) {
    ((this.low = e | 0), (this.high = t | 0), (this.unsigned = !!r));
  }
  (V.prototype.__isLong__,
    Object.defineProperty(V.prototype, "__isLong__", { value: !0 }));
  function J(e) {
    return (e && e.__isLong__) === !0;
  }
  function Zi(e) {
    var t = Math.clz32(e & -e);
    return e ? 31 - t : t;
  }
  V.isLong = J;
  var Yi = {},
    Qi = {};
  function Ie(e, t) {
    var r, n, i;
    return t
      ? ((e >>>= 0),
        (i = 0 <= e && e < 256) && ((n = Qi[e]), n)
          ? n
          : ((r = I(e, 0, !0)), i && (Qi[e] = r), r))
      : ((e |= 0),
        (i = -128 <= e && e < 128) && ((n = Yi[e]), n)
          ? n
          : ((r = I(e, e < 0 ? -1 : 0, !1)), i && (Yi[e] = r), r));
  }
  V.fromInt = Ie;
  function se(e, t) {
    if (isNaN(e)) return t ? Ee : fe;
    if (t) {
      if (e < 0) return Ee;
      if (e >= to) return so;
    } else {
      if (e <= -ro) return ee;
      if (e + 1 >= ro) return oo;
    }
    return e < 0 ? se(-e, t).neg() : I(e % Ze | 0, (e / Ze) | 0, t);
  }
  V.fromNumber = se;
  function I(e, t, r) {
    return new V(e, t, r);
  }
  V.fromBits = I;
  var Qt = Math.pow;
  function nn(e, t, r) {
    if (e.length === 0) throw Error("empty string");
    if (
      (typeof t == "number" ? ((r = t), (t = !1)) : (t = !!t),
      e === "NaN" || e === "Infinity" || e === "+Infinity" || e === "-Infinity")
    )
      return t ? Ee : fe;
    if (((r = r || 10), r < 2 || 36 < r)) throw RangeError("radix");
    var n;
    if ((n = e.indexOf("-")) > 0) throw Error("interior hyphen");
    if (n === 0) return nn(e.substring(1), t, r).neg();
    for (var i = se(Qt(r, 8)), o = fe, s = 0; s < e.length; s += 8) {
      var u = Math.min(8, e.length - s),
        h = parseInt(e.substring(s, s + u), r);
      if (u < 8) {
        var c = se(Qt(r, u));
        o = o.mul(c).add(se(h));
      } else ((o = o.mul(i)), (o = o.add(se(h))));
    }
    return ((o.unsigned = t), o);
  }
  V.fromString = nn;
  function ae(e, t) {
    return typeof e == "number"
      ? se(e, t)
      : typeof e == "string"
        ? nn(e, t)
        : I(e.low, e.high, typeof t == "boolean" ? t : e.unsigned);
  }
  V.fromValue = ae;
  var eo = 65536,
    Rc = 1 << 24,
    Ze = eo * eo,
    to = Ze * Ze,
    ro = to / 2,
    no = Ie(Rc),
    fe = Ie(0);
  V.ZERO = fe;
  var Ee = Ie(0, !0);
  V.UZERO = Ee;
  var Ye = Ie(1);
  V.ONE = Ye;
  var io = Ie(1, !0);
  V.UONE = io;
  var on = Ie(-1);
  V.NEG_ONE = on;
  var oo = I(-1, 2147483647, !1);
  V.MAX_VALUE = oo;
  var so = I(-1, -1, !0);
  V.MAX_UNSIGNED_VALUE = so;
  var ee = I(0, -2147483648, !1);
  V.MIN_VALUE = ee;
  var S = V.prototype;
  ((S.toInt = function () {
    return this.unsigned ? this.low >>> 0 : this.low;
  }),
    (S.toNumber = function () {
      return this.unsigned
        ? (this.high >>> 0) * Ze + (this.low >>> 0)
        : this.high * Ze + (this.low >>> 0);
    }),
    (S.toString = function (t) {
      if (((t = t || 10), t < 2 || 36 < t)) throw RangeError("radix");
      if (this.isZero()) return "0";
      if (this.isNegative())
        if (this.eq(ee)) {
          var r = se(t),
            n = this.div(r),
            i = n.mul(r).sub(this);
          return n.toString(t) + i.toInt().toString(t);
        } else return "-" + this.neg().toString(t);
      for (var o = se(Qt(t, 6), this.unsigned), s = this, u = ""; ; ) {
        var h = s.div(o),
          c = s.sub(h.mul(o)).toInt() >>> 0,
          p = c.toString(t);
        if (((s = h), s.isZero())) return p + u;
        for (; p.length < 6; ) p = "0" + p;
        u = "" + p + u;
      }
    }),
    (S.getHighBits = function () {
      return this.high;
    }),
    (S.getHighBitsUnsigned = function () {
      return this.high >>> 0;
    }),
    (S.getLowBits = function () {
      return this.low;
    }),
    (S.getLowBitsUnsigned = function () {
      return this.low >>> 0;
    }),
    (S.getNumBitsAbs = function () {
      if (this.isNegative())
        return this.eq(ee) ? 64 : this.neg().getNumBitsAbs();
      for (
        var t = this.high != 0 ? this.high : this.low, r = 31;
        r > 0 && (t & (1 << r)) == 0;
        r--
      );
      return this.high != 0 ? r + 33 : r + 1;
    }),
    (S.isSafeInteger = function () {
      var t = this.high >> 21;
      return t
        ? this.unsigned
          ? !1
          : t === -1 && !(this.low === 0 && this.high === -2097152)
        : !0;
    }),
    (S.isZero = function () {
      return this.high === 0 && this.low === 0;
    }),
    (S.eqz = S.isZero),
    (S.isNegative = function () {
      return !this.unsigned && this.high < 0;
    }),
    (S.isPositive = function () {
      return this.unsigned || this.high >= 0;
    }),
    (S.isOdd = function () {
      return (this.low & 1) === 1;
    }),
    (S.isEven = function () {
      return (this.low & 1) === 0;
    }),
    (S.equals = function (t) {
      return (
        J(t) || (t = ae(t)),
        this.unsigned !== t.unsigned &&
        this.high >>> 31 === 1 &&
        t.high >>> 31 === 1
          ? !1
          : this.high === t.high && this.low === t.low
      );
    }),
    (S.eq = S.equals),
    (S.notEquals = function (t) {
      return !this.eq(t);
    }),
    (S.neq = S.notEquals),
    (S.ne = S.notEquals),
    (S.lessThan = function (t) {
      return this.comp(t) < 0;
    }),
    (S.lt = S.lessThan),
    (S.lessThanOrEqual = function (t) {
      return this.comp(t) <= 0;
    }),
    (S.lte = S.lessThanOrEqual),
    (S.le = S.lessThanOrEqual),
    (S.greaterThan = function (t) {
      return this.comp(t) > 0;
    }),
    (S.gt = S.greaterThan),
    (S.greaterThanOrEqual = function (t) {
      return this.comp(t) >= 0;
    }),
    (S.gte = S.greaterThanOrEqual),
    (S.ge = S.greaterThanOrEqual),
    (S.compare = function (t) {
      if ((J(t) || (t = ae(t)), this.eq(t))) return 0;
      var r = this.isNegative(),
        n = t.isNegative();
      return r && !n
        ? -1
        : !r && n
          ? 1
          : this.unsigned
            ? t.high >>> 0 > this.high >>> 0 ||
              (t.high === this.high && t.low >>> 0 > this.low >>> 0)
              ? -1
              : 1
            : this.sub(t).isNegative()
              ? -1
              : 1;
    }),
    (S.comp = S.compare),
    (S.negate = function () {
      return !this.unsigned && this.eq(ee) ? ee : this.not().add(Ye);
    }),
    (S.neg = S.negate),
    (S.add = function (t) {
      J(t) || (t = ae(t));
      var r = this.high >>> 16,
        n = this.high & 65535,
        i = this.low >>> 16,
        o = this.low & 65535,
        s = t.high >>> 16,
        u = t.high & 65535,
        h = t.low >>> 16,
        c = t.low & 65535,
        p = 0,
        w = 0,
        A = 0,
        y = 0;
      return (
        (y += o + c),
        (A += y >>> 16),
        (y &= 65535),
        (A += i + h),
        (w += A >>> 16),
        (A &= 65535),
        (w += n + u),
        (p += w >>> 16),
        (w &= 65535),
        (p += r + s),
        (p &= 65535),
        I((A << 16) | y, (p << 16) | w, this.unsigned)
      );
    }),
    (S.subtract = function (t) {
      return (J(t) || (t = ae(t)), this.add(t.neg()));
    }),
    (S.sub = S.subtract),
    (S.multiply = function (t) {
      if (this.isZero()) return this;
      if ((J(t) || (t = ae(t)), oe)) {
        var r = oe.mul(this.low, this.high, t.low, t.high);
        return I(r, oe.get_high(), this.unsigned);
      }
      if (t.isZero()) return this.unsigned ? Ee : fe;
      if (this.eq(ee)) return t.isOdd() ? ee : fe;
      if (t.eq(ee)) return this.isOdd() ? ee : fe;
      if (this.isNegative())
        return t.isNegative()
          ? this.neg().mul(t.neg())
          : this.neg().mul(t).neg();
      if (t.isNegative()) return this.mul(t.neg()).neg();
      if (this.lt(no) && t.lt(no))
        return se(this.toNumber() * t.toNumber(), this.unsigned);
      var n = this.high >>> 16,
        i = this.high & 65535,
        o = this.low >>> 16,
        s = this.low & 65535,
        u = t.high >>> 16,
        h = t.high & 65535,
        c = t.low >>> 16,
        p = t.low & 65535,
        w = 0,
        A = 0,
        y = 0,
        m = 0;
      return (
        (m += s * p),
        (y += m >>> 16),
        (m &= 65535),
        (y += o * p),
        (A += y >>> 16),
        (y &= 65535),
        (y += s * c),
        (A += y >>> 16),
        (y &= 65535),
        (A += i * p),
        (w += A >>> 16),
        (A &= 65535),
        (A += o * c),
        (w += A >>> 16),
        (A &= 65535),
        (A += s * h),
        (w += A >>> 16),
        (A &= 65535),
        (w += n * p + i * c + o * h + s * u),
        (w &= 65535),
        I((y << 16) | m, (w << 16) | A, this.unsigned)
      );
    }),
    (S.mul = S.multiply),
    (S.divide = function (t) {
      if ((J(t) || (t = ae(t)), t.isZero())) throw Error("division by zero");
      if (oe) {
        if (
          !this.unsigned &&
          this.high === -2147483648 &&
          t.low === -1 &&
          t.high === -1
        )
          return this;
        var r = (this.unsigned ? oe.div_u : oe.div_s)(
          this.low,
          this.high,
          t.low,
          t.high,
        );
        return I(r, oe.get_high(), this.unsigned);
      }
      if (this.isZero()) return this.unsigned ? Ee : fe;
      var n, i, o;
      if (this.unsigned) {
        if ((t.unsigned || (t = t.toUnsigned()), t.gt(this))) return Ee;
        if (t.gt(this.shru(1))) return io;
        o = Ee;
      } else {
        if (this.eq(ee)) {
          if (t.eq(Ye) || t.eq(on)) return ee;
          if (t.eq(ee)) return Ye;
          var s = this.shr(1);
          return (
            (n = s.div(t).shl(1)),
            n.eq(fe)
              ? t.isNegative()
                ? Ye
                : on
              : ((i = this.sub(t.mul(n))), (o = n.add(i.div(t))), o)
          );
        } else if (t.eq(ee)) return this.unsigned ? Ee : fe;
        if (this.isNegative())
          return t.isNegative()
            ? this.neg().div(t.neg())
            : this.neg().div(t).neg();
        if (t.isNegative()) return this.div(t.neg()).neg();
        o = fe;
      }
      for (i = this; i.gte(t); ) {
        n = Math.max(1, Math.floor(i.toNumber() / t.toNumber()));
        for (
          var u = Math.ceil(Math.log(n) / Math.LN2),
            h = u <= 48 ? 1 : Qt(2, u - 48),
            c = se(n),
            p = c.mul(t);
          p.isNegative() || p.gt(i);

        )
          ((n -= h), (c = se(n, this.unsigned)), (p = c.mul(t)));
        (c.isZero() && (c = Ye), (o = o.add(c)), (i = i.sub(p)));
      }
      return o;
    }),
    (S.div = S.divide),
    (S.modulo = function (t) {
      if ((J(t) || (t = ae(t)), oe)) {
        var r = (this.unsigned ? oe.rem_u : oe.rem_s)(
          this.low,
          this.high,
          t.low,
          t.high,
        );
        return I(r, oe.get_high(), this.unsigned);
      }
      return this.sub(this.div(t).mul(t));
    }),
    (S.mod = S.modulo),
    (S.rem = S.modulo),
    (S.not = function () {
      return I(~this.low, ~this.high, this.unsigned);
    }),
    (S.countLeadingZeros = function () {
      return this.high ? Math.clz32(this.high) : Math.clz32(this.low) + 32;
    }),
    (S.clz = S.countLeadingZeros),
    (S.countTrailingZeros = function () {
      return this.low ? Zi(this.low) : Zi(this.high) + 32;
    }),
    (S.ctz = S.countTrailingZeros),
    (S.and = function (t) {
      return (
        J(t) || (t = ae(t)),
        I(this.low & t.low, this.high & t.high, this.unsigned)
      );
    }),
    (S.or = function (t) {
      return (
        J(t) || (t = ae(t)),
        I(this.low | t.low, this.high | t.high, this.unsigned)
      );
    }),
    (S.xor = function (t) {
      return (
        J(t) || (t = ae(t)),
        I(this.low ^ t.low, this.high ^ t.high, this.unsigned)
      );
    }),
    (S.shiftLeft = function (t) {
      return (
        J(t) && (t = t.toInt()),
        (t &= 63) === 0
          ? this
          : t < 32
            ? I(
                this.low << t,
                (this.high << t) | (this.low >>> (32 - t)),
                this.unsigned,
              )
            : I(0, this.low << (t - 32), this.unsigned)
      );
    }),
    (S.shl = S.shiftLeft),
    (S.shiftRight = function (t) {
      return (
        J(t) && (t = t.toInt()),
        (t &= 63) === 0
          ? this
          : t < 32
            ? I(
                (this.low >>> t) | (this.high << (32 - t)),
                this.high >> t,
                this.unsigned,
              )
            : I(this.high >> (t - 32), this.high >= 0 ? 0 : -1, this.unsigned)
      );
    }),
    (S.shr = S.shiftRight),
    (S.shiftRightUnsigned = function (t) {
      return (
        J(t) && (t = t.toInt()),
        (t &= 63) === 0
          ? this
          : t < 32
            ? I(
                (this.low >>> t) | (this.high << (32 - t)),
                this.high >>> t,
                this.unsigned,
              )
            : t === 32
              ? I(this.high, 0, this.unsigned)
              : I(this.high >>> (t - 32), 0, this.unsigned)
      );
    }),
    (S.shru = S.shiftRightUnsigned),
    (S.shr_u = S.shiftRightUnsigned),
    (S.rotateLeft = function (t) {
      var r;
      return (
        J(t) && (t = t.toInt()),
        (t &= 63) === 0
          ? this
          : t === 32
            ? I(this.high, this.low, this.unsigned)
            : t < 32
              ? ((r = 32 - t),
                I(
                  (this.low << t) | (this.high >>> r),
                  (this.high << t) | (this.low >>> r),
                  this.unsigned,
                ))
              : ((t -= 32),
                (r = 32 - t),
                I(
                  (this.high << t) | (this.low >>> r),
                  (this.low << t) | (this.high >>> r),
                  this.unsigned,
                ))
      );
    }),
    (S.rotl = S.rotateLeft),
    (S.rotateRight = function (t) {
      var r;
      return (
        J(t) && (t = t.toInt()),
        (t &= 63) === 0
          ? this
          : t === 32
            ? I(this.high, this.low, this.unsigned)
            : t < 32
              ? ((r = 32 - t),
                I(
                  (this.high << r) | (this.low >>> t),
                  (this.low << r) | (this.high >>> t),
                  this.unsigned,
                ))
              : ((t -= 32),
                (r = 32 - t),
                I(
                  (this.low << r) | (this.high >>> t),
                  (this.high << r) | (this.low >>> t),
                  this.unsigned,
                ))
      );
    }),
    (S.rotr = S.rotateRight),
    (S.toSigned = function () {
      return this.unsigned ? I(this.low, this.high, !1) : this;
    }),
    (S.toUnsigned = function () {
      return this.unsigned ? this : I(this.low, this.high, !0);
    }),
    (S.toBytes = function (t) {
      return t ? this.toBytesLE() : this.toBytesBE();
    }),
    (S.toBytesLE = function () {
      var t = this.high,
        r = this.low;
      return [
        r & 255,
        (r >>> 8) & 255,
        (r >>> 16) & 255,
        r >>> 24,
        t & 255,
        (t >>> 8) & 255,
        (t >>> 16) & 255,
        t >>> 24,
      ];
    }),
    (S.toBytesBE = function () {
      var t = this.high,
        r = this.low;
      return [
        t >>> 24,
        (t >>> 16) & 255,
        (t >>> 8) & 255,
        t & 255,
        r >>> 24,
        (r >>> 16) & 255,
        (r >>> 8) & 255,
        r & 255,
      ];
    }),
    (V.fromBytes = function (t, r, n) {
      return n ? V.fromBytesLE(t, r) : V.fromBytesBE(t, r);
    }),
    (V.fromBytesLE = function (t, r) {
      return new V(
        t[0] | (t[1] << 8) | (t[2] << 16) | (t[3] << 24),
        t[4] | (t[5] << 8) | (t[6] << 16) | (t[7] << 24),
        r,
      );
    }),
    (V.fromBytesBE = function (t, r) {
      return new V(
        (t[4] << 24) | (t[5] << 16) | (t[6] << 8) | t[7],
        (t[0] << 24) | (t[1] << 16) | (t[2] << 8) | t[3],
        r,
      );
    }),
    typeof BigInt == "function" &&
      ((V.fromBigInt = function (t, r) {
        var n = Number(BigInt.asIntN(32, t)),
          i = Number(BigInt.asIntN(32, t >> BigInt(32)));
        return I(n, i, r);
      }),
      (V.fromValue = function (t, r) {
        return typeof t == "bigint" ? V.fromBigInt(t, r) : ae(t, r);
      }),
      (S.toBigInt = function () {
        var t = BigInt(this.low >>> 0),
          r = BigInt(this.unsigned ? this.high >>> 0 : this.high);
        return (r << BigInt(32)) | t;
      })));
  const ao =
      (co =
        (tr = location == null ? void 0 : location.hostname) == null
          ? void 0
          : tr.includes) != null && co.call(tr, "rednote.com")
        ? "https://webapi.rednote.com"
        : "https://edith.xiaohongshu.com",
    sn = q.create({ baseURL: ao, timeout: 3e4, withCredentials: !0 });
  (sn.interceptors.request.use(async (e) => {
    const t = q.getUri(e).replace(ao, ""),
      r = Fc(t, e.data);
    return (
      (e.headers["x-s"] = r["X-s"]),
      (e.headers["x-t"] = r["X-t"]),
      (e.headers["x-b3-traceid"] = kc()),
      (e.headers["x-xray-traceid"] = Bc()),
      (e.headers["x-s-common"] = Tc()),
      e
    );
  }),
    sn.interceptors.response.use(
      (e) => {
        const { msg: t, code: r } = e.data;
        if (r && r !== 1e3)
          throw new U(
            t || "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01",
            U.ERR_BAD_RESPONSE,
            e.config,
            e.request,
            e,
          );
        return e;
      },
      (e) => {
        var o, s, u, h;
        const { data: t, status: r, headers: n } = e.response ?? {},
          i =
            t != null &&
            t.msg &&
            (t == null ? void 0 : t.msg) !== "\u6210\u529F"
              ? t.msg
              : e == null
                ? void 0
                : e.message;
        if (r === 406) {
          if (
            (h =
              (u =
                (s =
                  (o = window.__INITIAL_STATE__) == null ? void 0 : o.user) ==
                null
                  ? void 0
                  : s.userInfo) == null
                ? void 0
                : u._rawValue) != null &&
            h.guest
          )
            throw new U(
              "\u8BF7\u767B\u5F55\u5C0F\u7EA2\u4E66\u8D26\u53F7\u540E\u518D\u8BD5\uFF01",
              e.code,
              e.config,
              e.request,
              e.response,
            );
        } else if (r === 461 && n != null && n.verifytype)
          throw (
            Te("isVipUser", void 0).then((c) => {
              if (!c) return;
              const p = n == null ? void 0 : n.verifytype,
                w = n == null ? void 0 : n.verifyuuid,
                A = encodeURIComponent(
                  location.href.includes("-login")
                    ? location.origin
                    : location.href,
                );
              location.href = `${location.origin}/website-login/captcha?redirectPath=${A}&verifyUuid=${w}&verifyType=${p}&verifyBiz=${r}`;
            }),
            new U(
              "\u5DF2\u89E6\u53D1\u5C0F\u7EA2\u4E66\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
              e.code,
              e.config,
              e.request,
              e.response,
            )
          );
        return Promise.reject(
          new U(i, e.code, e.config, e.request, e.response),
        );
      },
    ));
  function Fc(e, t) {
    const r = function (c) {
      return c && typeof Symbol < "u" && c.constructor === Symbol
        ? "symbol"
        : typeof c;
    };
    if (!window.mnsv2) return window._webmsxyw(e, t);
    var n = window.toString,
      i = e;
    n.call(t) === "[object Object]" ||
    n.call(t) === "[object Array]" ||
    ((t === void 0 ? "undefined" : r(t)) === "object" && t !== null)
      ? (i += JSON.stringify(t))
      : typeof t == "string" && (i += t);
    var o = Vt.md5([i].join("")),
      s = Vt.md5(e),
      u = window.mnsv2(i, o, s),
      h = {
        x0: "4.3.3",
        x1: "xhs-pc-web",
        x2: window.xsecplatform || "PC",
        x3: u,
        x4: t ? (t === void 0 ? "undefined" : r(t)) : "",
      };
    return { "X-t": Date.now(), "X-s": "XYS_" + uo(en(JSON.stringify(h))) };
  }
  const Cc = "ZmserbBoHQtNP+wOcza/LpngG8yJq42KWYj0DSfdikx3VT16IlUAFM97hECvuRX5";
  function uo(e) {
    return Xi(e, Cc);
  }
  function Tc() {
    function e() {
      var p, w;
      const c =
        ((w = (p = window.navigator) == null ? void 0 : p.userAgent) == null
          ? void 0
          : w.toLowerCase()) || "";
      return c.indexOf("android") >= 0
        ? "Android"
        : c.indexOf("iphone") >= 0 ||
            c.indexOf("ipad") >= 0 ||
            c.indexOf("ipod") >= 0
          ? "iOS"
          : c.indexOf("macintosh") >= 0
            ? "Mac OS"
            : c.indexOf("windows") >= 0
              ? "Windows"
              : c.indexOf("linux") >= 0
                ? "Linux"
                : "PC";
    }
    function t(c) {
      const p = document.cookie.split(";");
      for (let w = 0; w < p.length; w++) {
        const A = p[w].trim();
        if (A.startsWith(`${c}=`)) return A.substring(c.length + 1);
      }
      return null;
    }
    function r(c) {
      switch (c) {
        case "Windows":
          return 0;
        case "Android":
          return 2;
        case "iOS":
          return 1;
        case "Mac OS":
          return 3;
        case "Linux":
          return 4;
        default:
          return 5;
      }
    }
    var n = (function (c) {
      for (var p = 3988292384, w, A, y = 256, m = []; y--; m[y] = w >>> 0)
        for (A = 8, w = y; A--; ) w = 1 & w ? (w >>> 1) ^ p : w >>> 1;
      return function (O) {
        if (typeof O == "string") {
          for (var R = 0, T = -1; R < O.length; ++R)
            T = m[(255 & T) ^ O.charCodeAt(R)] ^ (T >>> 8);
          return -1 ^ T ^ p;
        }
        for (var R = 0, T = -1; R < O.length; ++R)
          T = m[(255 & T) ^ O[R]] ^ (T >>> 8);
        return -1 ^ T ^ p;
      };
    })();
    const i = localStorage.b1,
      o = n("".concat("").concat("").concat(i)),
      s = localStorage.b1b1 || "1",
      u = e(),
      h = {
        s0: r(u),
        s1: "",
        x0: s,
        x1: "4.2.6",
        x2: u,
        x3: "xhs-pc-web",
        x4: "4.83.1",
        x5: t("a1"),
        x6: "",
        x7: "",
        x8: i,
        x9: o,
        x10: 0,
        x11: "normal",
      };
    return uo(en(JSON.stringify(h)));
  }
  function kc() {
    const e = "abcdef0123456789";
    return Array.from(
      { length: 16 },
      () => e[Math.floor(Math.random() * e.length)],
    ).join("");
  }
  function Bc() {
    const e = V;
    var t =
      arguments.length > 0 && arguments[0] !== void 0
        ? arguments[0]
        : Date.now();
    return ""
      .concat(
        e
          .fromNumber(t, !0)
          .shiftLeft(23)
          .or(an.seq())
          .toString(16)
          .padStart(16, "0"),
      )
      .concat(
        new e(an.random(32), an.random(32), !0).toString(16).padStart(16, "0"),
      );
  }
  const an = {
      MAX_SEQ: 8388607,
      SEQ: Math.floor(Math.random() * Math.pow(2, 23)),
      seq() {
        return (this.SEQ > this.MAX_SEQ && (this.SEQ = 0), this.SEQ++);
      },
      random(e) {
        return Math.floor(Math.random() * Math.pow(2, e));
      },
    },
    Pc = () => {
      (Tt(), ft(), ke(sn), ne("httpRequest", async (e) => Be()(...e)));
    },
    un = q.create({
      baseURL: "https://www.xingtu.cn",
      timeout: 3e4,
      withCredentials: !0,
    });
  (un.interceptors.request.use((e) => ((e.headers["agw-js-conv"] = "str"), e)),
    un.interceptors.response.use((e) => {
      var n;
      const t = e.headers["x-vc-bdturing-parameters"];
      if (t) {
        const i = window.atob(t);
        throw (
          window.autoRender &&
            Te("isVipUser", void 0).then((o) => {
              var s;
              o &&
                ((s = window.autoRender) == null ||
                  s.call(window, {
                    commonOptions: void 0,
                    verify_data: i,
                    captchaOptions: {
                      ele: !1,
                      feedbackEle: !1,
                      host: "//verify.zijieapi.com/",
                      closeCb: (u) => {
                        console.log("closeCb", u);
                      },
                      errorCb: (u) => {
                        console.log("errorCb", u);
                      },
                    },
                    secondVerifyWebOptions: {
                      scene: "4",
                      useSmsMode: 6,
                      ele: !1,
                      callBack: (u) => {
                        console.log("callBack", u);
                      },
                      closeCallBack: (u) => {
                        console.log("closeCallBack", u);
                      },
                    },
                  }));
            }),
          new U(
            "\u5DF2\u89E6\u53D1\u661F\u56FE\u5E73\u53F0\u9A8C\u8BC1\uFF0C\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u5904\u7406\u9A8C\u8BC1\u7801\u540E\u518D\u7EE7\u7EED\uFF01",
            U.ERR_BAD_RESPONSE,
            e.config,
            e.request,
            e,
          )
        );
      }
      if (!e.data)
        throw new U(
          "\u661F\u56FEAPI\u8FD4\u56DE\u5185\u5BB9\u4E3A\u7A7A\u3002",
          U.ERR_BAD_RESPONSE,
          e.config,
          e.request,
          e,
        );
      const r = (n = e.data) == null ? void 0 : n.base_resp;
      if (r != null && r.status_code) {
        const i =
          (r == null ? void 0 : r.status_message) ||
          "\u63A5\u53E3\u8BF7\u6C42\u5931\u8D25\uFF01";
        throw new U(i, U.ERR_BAD_RESPONSE, e.config, e.request, e);
      }
      return e;
    }));
  const Nc = {
      bilibili: Nu,
      douyin: rc,
      kuaishou: dc,
      "pgy.xiaohongshu": yc,
      tiktok: Oc,
      xiaohongshu: Pc,
      xingtu: () => {
        (ft(), ke(un), ne("httpRequest", async (e) => Be()(...e)));
      },
    },
    Dc = po({
      globalName: !1,
      main: () => {
        const e = go(location.href);
        if (e) return Nc[e.code]();
      },
    });
  function fl() {}
  function er(e, ...t) {}
  const cn = {
      debug: (...e) => er(console.debug, ...e),
      log: (...e) => er(console.log, ...e),
      warn: (...e) => er(console.warn, ...e),
      error: (...e) => er(console.error, ...e),
    },
    Lc = (() => {
      try {
      } catch (t) {
        throw (cn.error('Failed to initialize plugins for "main"', t), t);
      }
      let e;
      try {
        ((e = Dc.main()),
          e instanceof Promise &&
            (e = e.catch((t) => {
              throw (
                cn.error('The unlisted script "main" crashed on startup!', t),
                t
              );
            })));
      } catch (t) {
        throw (
          cn.error('The unlisted script "main" crashed on startup!', t),
          t
        );
      }
      return e;
    })();
  (ne("biliHtmlDataToApiData", () => {
    var t, r, n, i;
    const e = window.__INITIAL_STATE__;
    return e
      ? {
          View: e.videoData,
          Card: {
            card: e.upData,
            archive_count: (t = e.upData) == null ? void 0 : t.archiveCount,
            follower: (r = e.upData) == null ? void 0 : r.fans,
            following: !1,
            article_count: (n = e.upData) == null ? void 0 : n.articleCount,
            like_num: (i = e.upData) == null ? void 0 : i.likeNum,
          },
          Tags: e.tags,
        }
      : null;
  }),
    ne("biliSearchPageVideos", () => {
      var r, n, i, o, s;
      let e =
        (r = window == null ? void 0 : window.__pinia) == null
          ? void 0
          : r.searchTypeResponse;
      e != null &&
        e.searchTypeResponse &&
        (e = e == null ? void 0 : e.searchTypeResponse);
      const t = Array.isArray(e == null ? void 0 : e.result)
        ? e == null
          ? void 0
          : e.result
        : [];
      if (location.pathname.startsWith("/all")) {
        const u =
          (o =
            (i =
              (n = window == null ? void 0 : window.__pinia) == null
                ? void 0
                : n.searchResponse) == null
              ? void 0
              : i.searchAllResponse) == null
            ? void 0
            : o.result;
        if (!Array.isArray(u)) return t;
        const h = document.evaluate(
          "//button[text()='\u4E0A\u4E00\u9875']",
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue;
        if (!(h != null && h.disabled)) return t;
        const c =
          (s = u.find((y) => y.result_type == "video")) == null
            ? void 0
            : s.data;
        Array.isArray(c) && t.push(...c);
        const p = document.querySelectorAll(
            'div.video-list a[href*="/video/BV"]',
          ),
          w = [],
          A = new Set();
        for (const y of p) {
          const m = y == null ? void 0 : y.getAttribute("href");
          if (!m) continue;
          const O = m
            .split("/")
            .filter((T) => T)
            .reverse()[0];
          if (!O) continue;
          const R = t.find((T) => T.bvid == O);
          R && (A.has(O) || (A.add(O), w.push(R)));
        }
        return w;
      }
      return t;
    }));
  const Uc = Object.freeze(
    Object.defineProperty({ __proto__: null }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
  ne("dyFindAwemeInfo", (e) => {
    var s, u;
    const t = location.pathname.match(/^\/(video|note)\/(\d+)$/);
    let r;
    if (
      (t
        ? (r =
            (s = document.querySelector(`[data-e2e="${t[1]}-detail"]`)) == null
              ? void 0
              : s.parentElement)
        : (r = document.querySelector(`div[data-e2e-vid="${e}"]`)),
      !r)
    )
      return;
    const i = Object.keys(r).find((h) => h.startsWith("__reactProps$"));
    if (!i) return;
    const o = (u = r[i]) == null ? void 0 : u.children;
    if (Array.isArray(o)) {
      for (const h of o)
        if (h && h.props && h.props.awemeInfo) return h.props.awemeInfo;
    }
  });
  const Ic = Object.freeze(
    Object.defineProperty({ __proto__: null }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
  (ne("ksPagePhotoInfo", () => {
    var r, n, i, o, s;
    const e =
      (r = Object.entries(window.__APOLLO_STATE__.defaultClient).find(
        ([u]) =>
          u.startsWith("$ROOT_QUERY.visionVideoDetail({") && u.endsWith("})"),
      )) == null
        ? void 0
        : r[1];
    if (!e) return;
    const t = { ...e };
    return (
      (n = e == null ? void 0 : e.author) != null &&
        n.id &&
        (t.author =
          window.__APOLLO_STATE__.defaultClient[
            (i = e == null ? void 0 : e.author) == null ? void 0 : i.id
          ]),
      (o = e == null ? void 0 : e.photo) != null &&
        o.id &&
        (t.photo =
          window.__APOLLO_STATE__.defaultClient[
            (s = e == null ? void 0 : e.photo) == null ? void 0 : s.id
          ]),
      t
    );
  }),
    ne("ksPagetUserProfile", () => {
      var r, n;
      const e = Object.values(
        (window == null ? void 0 : window.INIT_STATE) || {},
      );
      if (!e || e.length === 0) return;
      const t = location.pathname.split("/").reverse()[0];
      for (const i of e) {
        if (!i.result) continue;
        const o =
          (n = (r = i.userProfile) == null ? void 0 : r.profile) == null
            ? void 0
            : n.user_id;
        if (o && o === t) return i.userProfile;
      }
    }));
  const jc = Object.freeze(
    Object.defineProperty({ __proto__: null }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
  return Lc;
})();
