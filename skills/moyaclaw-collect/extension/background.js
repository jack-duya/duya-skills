var En = Object.defineProperty;
var _n = (ye, R, me) =>
  R in ye
    ? En(ye, R, { enumerable: !0, configurable: !0, writable: !0, value: me })
    : (ye[R] = me);
var ct = (ye, R, me) => _n(ye, typeof R != "symbol" ? R + "" : R, me);
var background = (function () {
  "use strict";
  var _t, It, kt, vt;
  const R =
    (It = (_t = globalThis.browser) == null ? void 0 : _t.runtime) != null &&
    It.id
      ? globalThis.browser
      : globalThis.chrome;
  function me(s) {
    return s == null || typeof s == "function" ? { main: s } : s;
  }
  var lt = Object.prototype.hasOwnProperty;
  function He(s, a) {
    var i, u;
    if (s === a) return !0;
    if (s && a && (i = s.constructor) === a.constructor) {
      if (i === Date) return s.getTime() === a.getTime();
      if (i === RegExp) return s.toString() === a.toString();
      if (i === Array) {
        if ((u = s.length) === a.length) for (; u-- && He(s[u], a[u]); );
        return u === -1;
      }
      if (!i || typeof s == "object") {
        u = 0;
        for (i in s)
          if (
            (lt.call(s, i) && ++u && !lt.call(a, i)) ||
            !(i in a) ||
            !He(s[i], a[i])
          )
            return !1;
        return Object.keys(a).length === u;
      }
    }
    return s !== s && a !== a;
  }
  const tr = new Error("request for lock canceled");
  var rr = function (s, a, i, u) {
    function o(g) {
      return g instanceof i
        ? g
        : new i(function (r) {
            r(g);
          });
    }
    return new (i || (i = Promise))(function (g, r) {
      function y(B) {
        try {
          P(u.next(B));
        } catch (L) {
          r(L);
        }
      }
      function v(B) {
        try {
          P(u.throw(B));
        } catch (L) {
          r(L);
        }
      }
      function P(B) {
        B.done ? g(B.value) : o(B.value).then(y, v);
      }
      P((u = u.apply(s, a || [])).next());
    });
  };
  class nr {
    constructor(a, i = tr) {
      ((this._value = a),
        (this._cancelError = i),
        (this._queue = []),
        (this._weightedWaiters = []));
    }
    acquire(a = 1, i = 0) {
      if (a <= 0) throw new Error(`invalid weight ${a}: must be positive`);
      return new Promise((u, o) => {
        const g = { resolve: u, reject: o, weight: a, priority: i },
          r = ut(this._queue, (y) => i <= y.priority);
        r === -1 && a <= this._value
          ? this._dispatchItem(g)
          : this._queue.splice(r + 1, 0, g);
      });
    }
    runExclusive(a) {
      return rr(this, arguments, void 0, function* (i, u = 1, o = 0) {
        const [g, r] = yield this.acquire(u, o);
        try {
          return yield i(g);
        } finally {
          r();
        }
      });
    }
    waitForUnlock(a = 1, i = 0) {
      if (a <= 0) throw new Error(`invalid weight ${a}: must be positive`);
      return this._couldLockImmediately(a, i)
        ? Promise.resolve()
        : new Promise((u) => {
            (this._weightedWaiters[a - 1] ||
              (this._weightedWaiters[a - 1] = []),
              ir(this._weightedWaiters[a - 1], { resolve: u, priority: i }));
          });
    }
    isLocked() {
      return this._value <= 0;
    }
    getValue() {
      return this._value;
    }
    setValue(a) {
      ((this._value = a), this._dispatchQueue());
    }
    release(a = 1) {
      if (a <= 0) throw new Error(`invalid weight ${a}: must be positive`);
      ((this._value += a), this._dispatchQueue());
    }
    cancel() {
      (this._queue.forEach((a) => a.reject(this._cancelError)),
        (this._queue = []));
    }
    _dispatchQueue() {
      for (
        this._drainUnlockWaiters();
        this._queue.length > 0 && this._queue[0].weight <= this._value;

      )
        (this._dispatchItem(this._queue.shift()), this._drainUnlockWaiters());
    }
    _dispatchItem(a) {
      const i = this._value;
      ((this._value -= a.weight), a.resolve([i, this._newReleaser(a.weight)]));
    }
    _newReleaser(a) {
      let i = !1;
      return () => {
        i || ((i = !0), this.release(a));
      };
    }
    _drainUnlockWaiters() {
      if (this._queue.length === 0)
        for (let a = this._value; a > 0; a--) {
          const i = this._weightedWaiters[a - 1];
          i &&
            (i.forEach((u) => u.resolve()),
            (this._weightedWaiters[a - 1] = []));
        }
      else {
        const a = this._queue[0].priority;
        for (let i = this._value; i > 0; i--) {
          const u = this._weightedWaiters[i - 1];
          if (!u) continue;
          const o = u.findIndex((g) => g.priority <= a);
          (o === -1 ? u : u.splice(0, o)).forEach((g) => g.resolve());
        }
      }
    }
    _couldLockImmediately(a, i) {
      return (
        (this._queue.length === 0 || this._queue[0].priority < i) &&
        a <= this._value
      );
    }
  }
  function ir(s, a) {
    const i = ut(s, (u) => a.priority <= u.priority);
    s.splice(i + 1, 0, a);
  }
  function ut(s, a) {
    for (let i = s.length - 1; i >= 0; i--) if (a(s[i])) return i;
    return -1;
  }
  var sr = function (s, a, i, u) {
    function o(g) {
      return g instanceof i
        ? g
        : new i(function (r) {
            r(g);
          });
    }
    return new (i || (i = Promise))(function (g, r) {
      function y(B) {
        try {
          P(u.next(B));
        } catch (L) {
          r(L);
        }
      }
      function v(B) {
        try {
          P(u.throw(B));
        } catch (L) {
          r(L);
        }
      }
      function P(B) {
        B.done ? g(B.value) : o(B.value).then(y, v);
      }
      P((u = u.apply(s, a || [])).next());
    });
  };
  class ar {
    constructor(a) {
      this._semaphore = new nr(1, a);
    }
    acquire() {
      return sr(this, arguments, void 0, function* (a = 0) {
        const [, i] = yield this._semaphore.acquire(1, a);
        return i;
      });
    }
    runExclusive(a, i = 0) {
      return this._semaphore.runExclusive(() => a(), 1, i);
    }
    isLocked() {
      return this._semaphore.isLocked();
    }
    waitForUnlock(a = 0) {
      return this._semaphore.waitForUnlock(1, a);
    }
    release() {
      this._semaphore.isLocked() && this._semaphore.release();
    }
    cancel() {
      return this._semaphore.cancel();
    }
  }
  const Ue =
      ((vt = (kt = globalThis.browser) == null ? void 0 : kt.runtime) == null
        ? void 0
        : vt.id) == null
        ? globalThis.chrome
        : globalThis.browser,
    Ze = or();
  function or() {
    const s = {
        local: Me("local"),
        session: Me("session"),
        sync: Me("sync"),
        managed: Me("managed"),
      },
      a = (x) => {
        const m = s[x];
        if (m == null) {
          const p = Object.keys(s).join(", ");
          throw Error(`Invalid area "${x}". Options: ${p}`);
        }
        return m;
      },
      i = (x) => {
        const m = x.indexOf(":"),
          p = x.substring(0, m),
          _ = x.substring(m + 1);
        if (_ == null)
          throw Error(
            `Storage key should be in the form of "area:key", but received "${x}"`,
          );
        return { driverArea: p, driverKey: _, driver: a(p) };
      },
      u = (x) => x + "$",
      o = (x, m) => {
        const p = { ...x };
        return (
          Object.entries(m).forEach(([_, A]) => {
            A == null ? delete p[_] : (p[_] = A);
          }),
          p
        );
      },
      g = (x, m) => x ?? m ?? null,
      r = (x) => (typeof x == "object" && !Array.isArray(x) ? x : {}),
      y = async (x, m, p) => {
        const _ = await x.getItem(m);
        return g(
          _,
          (p == null ? void 0 : p.fallback) ??
            (p == null ? void 0 : p.defaultValue),
        );
      },
      v = async (x, m) => {
        const p = u(m),
          _ = await x.getItem(p);
        return r(_);
      },
      P = async (x, m, p) => {
        await x.setItem(m, p ?? null);
      },
      B = async (x, m, p) => {
        const _ = u(m),
          A = r(await x.getItem(_));
        await x.setItem(_, o(A, p));
      },
      L = async (x, m, p) => {
        if ((await x.removeItem(m), p != null && p.removeMeta)) {
          const _ = u(m);
          await x.removeItem(_);
        }
      },
      $ = async (x, m, p) => {
        const _ = u(m);
        if (p == null) await x.removeItem(_);
        else {
          const A = r(await x.getItem(_));
          ([p].flat().forEach((U) => delete A[U]), await x.setItem(_, A));
        }
      },
      ee = (x, m, p) => x.watch(m, p);
    return {
      getItem: async (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        return await y(p, _, m);
      },
      getItems: async (x) => {
        const m = new Map(),
          p = new Map(),
          _ = [];
        x.forEach((U) => {
          let z, C;
          (typeof U == "string"
            ? (z = U)
            : "getValue" in U
              ? ((z = U.key), (C = { fallback: U.fallback }))
              : ((z = U.key), (C = U.options)),
            _.push(z));
          const { driverArea: ne, driverKey: G } = i(z),
            F = m.get(ne) ?? [];
          (m.set(ne, F.concat(G)), p.set(z, C));
        });
        const A = new Map();
        return (
          await Promise.all(
            Array.from(m.entries()).map(async ([U, z]) => {
              (await s[U].getItems(z)).forEach((ne) => {
                const G = `${U}:${ne.key}`,
                  F = p.get(G),
                  K = g(
                    ne.value,
                    (F == null ? void 0 : F.fallback) ??
                      (F == null ? void 0 : F.defaultValue),
                  );
                A.set(G, K);
              });
            }),
          ),
          _.map((U) => ({ key: U, value: A.get(U) }))
        );
      },
      getMeta: async (x) => {
        const { driver: m, driverKey: p } = i(x);
        return await v(m, p);
      },
      getMetas: async (x) => {
        const m = x.map((A) => {
            const U = typeof A == "string" ? A : A.key,
              { driverArea: z, driverKey: C } = i(U);
            return { key: U, driverArea: z, driverKey: C, driverMetaKey: u(C) };
          }),
          p = m.reduce((A, U) => {
            var z;
            return (
              A[(z = U.driverArea)] ?? (A[z] = []),
              A[U.driverArea].push(U),
              A
            );
          }, {}),
          _ = {};
        return (
          await Promise.all(
            Object.entries(p).map(async ([A, U]) => {
              const z = await Ue.storage[A].get(U.map((C) => C.driverMetaKey));
              U.forEach((C) => {
                _[C.key] = z[C.driverMetaKey] ?? {};
              });
            }),
          ),
          m.map((A) => ({ key: A.key, meta: _[A.key] }))
        );
      },
      setItem: async (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        await P(p, _, m);
      },
      setItems: async (x) => {
        const m = {};
        (x.forEach((p) => {
          const { driverArea: _, driverKey: A } = i(
            "key" in p ? p.key : p.item.key,
          );
          (m[_] ?? (m[_] = []), m[_].push({ key: A, value: p.value }));
        }),
          await Promise.all(
            Object.entries(m).map(async ([p, _]) => {
              await a(p).setItems(_);
            }),
          ));
      },
      setMeta: async (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        await B(p, _, m);
      },
      setMetas: async (x) => {
        const m = {};
        (x.forEach((p) => {
          const { driverArea: _, driverKey: A } = i(
            "key" in p ? p.key : p.item.key,
          );
          (m[_] ?? (m[_] = []), m[_].push({ key: A, properties: p.meta }));
        }),
          await Promise.all(
            Object.entries(m).map(async ([p, _]) => {
              const A = a(p),
                U = _.map(({ key: G }) => u(G));
              console.log(p, U);
              const z = await A.getItems(U),
                C = Object.fromEntries(
                  z.map(({ key: G, value: F }) => [G, r(F)]),
                ),
                ne = _.map(({ key: G, properties: F }) => {
                  const K = u(G);
                  return { key: K, value: o(C[K] ?? {}, F) };
                });
              await A.setItems(ne);
            }),
          ));
      },
      removeItem: async (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        await L(p, _, m);
      },
      removeItems: async (x) => {
        const m = {};
        (x.forEach((p) => {
          let _, A;
          typeof p == "string"
            ? (_ = p)
            : "getValue" in p
              ? (_ = p.key)
              : "item" in p
                ? ((_ = p.item.key), (A = p.options))
                : ((_ = p.key), (A = p.options));
          const { driverArea: U, driverKey: z } = i(_);
          (m[U] ?? (m[U] = []),
            m[U].push(z),
            A != null && A.removeMeta && m[U].push(u(z)));
        }),
          await Promise.all(
            Object.entries(m).map(async ([p, _]) => {
              await a(p).removeItems(_);
            }),
          ));
      },
      clear: async (x) => {
        await a(x).clear();
      },
      removeMeta: async (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        await $(p, _, m);
      },
      snapshot: async (x, m) => {
        var A;
        const _ = await a(x).snapshot();
        return (
          (A = m == null ? void 0 : m.excludeKeys) == null ||
            A.forEach((U) => {
              (delete _[U], delete _[u(U)]);
            }),
          _
        );
      },
      restoreSnapshot: async (x, m) => {
        await a(x).restoreSnapshot(m);
      },
      watch: (x, m) => {
        const { driver: p, driverKey: _ } = i(x);
        return ee(p, _, m);
      },
      unwatch() {
        Object.values(s).forEach((x) => {
          x.unwatch();
        });
      },
      defineItem: (x, m) => {
        const { driver: p, driverKey: _ } = i(x),
          { version: A = 1, migrations: U = {} } = m ?? {};
        if (A < 1)
          throw Error(
            "Storage item version cannot be less than 1. Initial versions should be set to 1, not 0.",
          );
        const z = async () => {
            var Ne;
            const K = u(_),
              [{ value: oe }, { value: ue }] = await p.getItems([_, K]);
            if (oe == null) return;
            const fe = (ue == null ? void 0 : ue.v) ?? 1;
            if (fe > A)
              throw Error(
                `Version downgrade detected (v${fe} -> v${A}) for "${x}"`,
              );
            if (fe === A) return;
            console.debug(
              `[@wxt-dev/storage] Running storage migration for ${x}: v${fe} -> v${A}`,
            );
            const ke = Array.from({ length: A - fe }, (ve, Ae) => fe + Ae + 1);
            let we = oe;
            for (const ve of ke)
              try {
                we =
                  (await ((Ne = U == null ? void 0 : U[ve]) == null
                    ? void 0
                    : Ne.call(U, we))) ?? we;
              } catch (Ae) {
                throw new cr(x, ve, { cause: Ae });
              }
            (await p.setItems([
              { key: _, value: we },
              { key: K, value: { ...ue, v: A } },
            ]),
              console.debug(
                `[@wxt-dev/storage] Storage migration completed for ${x} v${A}`,
                { migratedValue: we },
              ));
          },
          C =
            (m == null ? void 0 : m.migrations) == null
              ? Promise.resolve()
              : z().catch((K) => {
                  console.error(
                    `[@wxt-dev/storage] Migration failed for ${x}`,
                    K,
                  );
                }),
          ne = new ar(),
          G = () =>
            (m == null ? void 0 : m.fallback) ??
            (m == null ? void 0 : m.defaultValue) ??
            null,
          F = () =>
            ne.runExclusive(async () => {
              const K = await p.getItem(_);
              if (K != null || (m == null ? void 0 : m.init) == null) return K;
              const oe = await m.init();
              return (await p.setItem(_, oe), oe);
            });
        return (
          C.then(F),
          {
            key: x,
            get defaultValue() {
              return G();
            },
            get fallback() {
              return G();
            },
            getValue: async () => (
              await C,
              m != null && m.init ? await F() : await y(p, _, m)
            ),
            getMeta: async () => (await C, await v(p, _)),
            setValue: async (K) => (await C, await P(p, _, K)),
            setMeta: async (K) => (await C, await B(p, _, K)),
            removeValue: async (K) => (await C, await L(p, _, K)),
            removeMeta: async (K) => (await C, await $(p, _, K)),
            watch: (K) => ee(p, _, (oe, ue) => K(oe ?? G(), ue ?? G())),
            migrate: z,
          }
        );
      },
    };
  }
  function Me(s) {
    const a = () => {
        if (Ue.runtime == null)
          throw Error(
            [
              "'wxt/storage' must be loaded in a web extension environment",
              `
 - If thrown during a build, see https://github.com/wxt-dev/wxt/issues/371`,
              ` - If thrown during tests, mock 'wxt/browser' correctly. See https://wxt.dev/guide/go-further/testing.html
`,
            ].join(`
`),
          );
        if (Ue.storage == null)
          throw Error(
            "You must add the 'storage' permission to your manifest to use 'wxt/storage'",
          );
        const u = Ue.storage[s];
        if (u == null) throw Error(`"browser.storage.${s}" is undefined`);
        return u;
      },
      i = new Set();
    return {
      getItem: async (u) => (await a().get(u))[u],
      getItems: async (u) => {
        const o = await a().get(u);
        return u.map((g) => ({ key: g, value: o[g] ?? null }));
      },
      setItem: async (u, o) => {
        o == null ? await a().remove(u) : await a().set({ [u]: o });
      },
      setItems: async (u) => {
        const o = u.reduce((g, { key: r, value: y }) => ((g[r] = y), g), {});
        await a().set(o);
      },
      removeItem: async (u) => {
        await a().remove(u);
      },
      removeItems: async (u) => {
        await a().remove(u);
      },
      clear: async () => {
        await a().clear();
      },
      snapshot: async () => await a().get(),
      restoreSnapshot: async (u) => {
        await a().set(u);
      },
      watch(u, o) {
        const g = (r) => {
          const y = r[u];
          y != null &&
            (He(y.newValue, y.oldValue) ||
              o(y.newValue ?? null, y.oldValue ?? null));
        };
        return (
          a().onChanged.addListener(g),
          i.add(g),
          () => {
            (a().onChanged.removeListener(g), i.delete(g));
          }
        );
      },
      unwatch() {
        (i.forEach((u) => {
          a().onChanged.removeListener(u);
        }),
          i.clear());
      },
    };
  }
  class cr extends Error {
    constructor(a, i, u) {
      (super(`v${i} migration failed for "${a}"`, u),
        (this.key = a),
        (this.version = i));
    }
  }
  const Qe = Ze.defineItem("local:deviceId", { fallback: "" });
  async function lr() {}
  const ft = () => {
    const s = new URL("https://socialext.com").hostname;
    if (!s) return "https://socialext.com";
    const a = s.split(":")[0];
    if (a === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(a)) return;
    const i = a.split(".");
    return i.length >= 2 ? "." + i.slice(-2).join(".") : a;
  };
  function ur(s) {
    return `session:taskOperation:${s}`;
  }
  async function fr(s) {
    return Ze.removeItem(ur(s));
  }
  const dr = [
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
    ],
    dt = ["code", "status", "statusCode", "type", "errno", "syscall", "path"];
  function Ge(s) {
    if (s instanceof Error) {
      const a = s,
        i = {
          name: s.name || "Error",
          message: s.message || "",
          stack: s.stack,
        };
      s.cause && (i.cause = Ge(s.cause));
      for (const u of dt) {
        const o = a[u];
        o !== void 0 && wr(i, u, o);
      }
      return i;
    }
    return { name: "Error", message: wt(s) };
  }
  function ht(s) {
    if (s instanceof Error) return s;
    if (!hr(s)) return new Error(wt(s));
    const a = new Error(s.message, { cause: s.cause ? ht(s.cause) : void 0 });
    ((a.name = s.name || "Error"), s.stack && (a.stack = s.stack));
    const i = a;
    for (const u of dt) {
      const o = s[u];
      o !== void 0 && (i[u] = o);
    }
    return a;
  }
  function hr(s) {
    return (
      typeof s == "object" &&
      s !== null &&
      typeof s.name == "string" &&
      typeof s.message == "string"
    );
  }
  function wr(s, a, i) {
    if (i != null)
      switch (a) {
        case "status":
        case "statusCode": {
          const u = Number(i);
          Number.isFinite(u) && (s[a] = u);
          break;
        }
        case "code":
        case "errno": {
          typeof i == "string" || typeof i == "number"
            ? (s[a] = i)
            : (s[a] = String(i));
          break;
        }
        case "type":
        case "syscall":
        case "path": {
          s[a] = String(i);
          break;
        }
      }
  }
  function wt(s) {
    return s == null
      ? String(s)
      : typeof s == "string"
        ? s
        : typeof s == "number" || typeof s == "boolean" || typeof s == "bigint"
          ? String(s)
          : "";
  }
  const _e = {};
  let pe;
  function gt(s, a) {
    return { type: s, data: a, timestamp: Date.now() };
  }
  function xt(s) {
    if (!s) return s;
    const { result: a, error: i } = s;
    if (i) throw ht(i);
    return a;
  }
  function gr() {
    Object.keys(_e).length > 0 || (pe == null || pe(), (pe = void 0));
  }
  function yt(s, a, i) {
    if (!s || typeof s != "object" || typeof s.type != "string") return;
    const u = _e[s.type];
    if (u)
      try {
        s.sender = a;
        const o = u(s);
        return o === void 0
          ? void 0
          : (Promise.resolve(o)
              .then((g) => {
                i({ result: g });
              })
              .catch((g) => {
                i({ error: Ge(g) });
              }),
            !0);
      } catch (o) {
        i({ error: Ge(o) });
      }
  }
  function xr(s) {
    pe ||
      (chrome.runtime.onMessage.addListener(yt),
      (pe = () => chrome.runtime.onMessage.removeListener(yt)));
  }
  async function mt(s, ...[a]) {
    const i = gt(s, a),
      u = await chrome.runtime.sendMessage(i);
    return xt(u);
  }
  async function yr(s, ...[a, i]) {
    const u = gt(s, a),
      o = await chrome.tabs.sendMessage(i, u).catch((g) => {
        console.error(g);
        const r = g instanceof Error ? g.message : String(g);
        throw r.includes("message channel closed") ||
          r.includes("Could not establish connection")
          ? new Error(
              "\u9875\u9762\u72B6\u6001\u5F02\u5E38\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5\u3002",
            )
          : g;
      });
    return xt(o);
  }
  function ie(s, a) {
    if (_e[s] != null)
      throw new Error(
        `[messaging] In this JS context, only one listener can be setup for ${String(s)}`,
      );
    return (
      xr(),
      (_e[s] = a),
      () => {
        (delete _e[s], gr());
      }
    );
  }
  async function mr(s, a) {
    let i = await R.downloads.download(s);
    if (!a) return i;
    const u = (o) =>
      new Promise((g) =>
        setTimeout(async () => {
          const [r] = await chrome.downloads
            .search({ id: o })
            .catch(
              (P) => (
                console.error("\u83B7\u53D6\u4E0B\u8F7D\u9879\u5931\u8D25", P),
                []
              ),
            );
          if ((r == null ? void 0 : r.state) !== R.downloads.State.INTERRUPTED)
            return g(!1);
          const y = r.error,
            v =
              y === R.downloads.InterruptReason.SERVER_FORBIDDEN ||
              y === R.downloads.InterruptReason.SERVER_UNAUTHORIZED ||
              y === R.downloads.InterruptReason.SERVER_UNREACHABLE ||
              y === R.downloads.InterruptReason.SERVER_FAILED ||
              y === R.downloads.InterruptReason.SERVER_CERT_PROBLEM ||
              y === R.downloads.InterruptReason.SERVER_BAD_CONTENT ||
              y === R.downloads.InterruptReason.SERVER_CROSS_ORIGIN_REDIRECT ||
              y === R.downloads.InterruptReason.SERVER_NO_RANGE ||
              y === R.downloads.InterruptReason.NETWORK_INVALID_REQUEST ||
              y === R.downloads.InterruptReason.NETWORK_SERVER_DOWN;
          return g(v);
        }, 1e3),
      );
    for (const o of a) {
      if (!(await u(i))) return i;
      const g = await R.downloads.download({ ...s, url: o });
      (await R.downloads.erase({ id: i }), (i = g));
    }
    return i;
  }
  var De = ((s) => (
      (s.None = "none"),
      (s.Reminder = "reminder"),
      (s.Auto = "auto"),
      s
    ))(De || {}),
    le = ((s) => (
      (s.AutoStarted = "auto_started"),
      (s.ReminderShown = "reminder_shown"),
      (s.SkippedSidepanelClosed = "skipped_sidepanel_closed"),
      (s.SkippedTaskBusy = "skipped_task_busy"),
      (s.PlatformPrepareFailed = "platform_prepare_failed"),
      (s.DispatchFailed = "dispatch_failed"),
      s
    ))(le || {});
  const Be = Ze.defineItem("local:taskAlarms", { fallback: [] });
  async function pr(s, a) {
    let i = a.when;
    if (!i || String(i).length !== 13) return;
    if (!a.periodInMinutes || a.periodInMinutes <= 0) {
      await R.alarms.create(s, { when: i });
      return;
    }
    const u = a.periodInMinutes * 60 * 1e3,
      o = Date.now();
    for (; i < o; ) i += u;
    await R.alarms.create(s, { periodInMinutes: a.periodInMinutes, when: i });
  }
  async function br() {
    const s = await Be.getValue();
    if (!(s != null && s.length)) return;
    const a = await chrome.alarms.getAll().catch((i) => (console.error(i), []));
    for (const i of a) {
      const u = s.find((o) => o.id === i.name);
      (!u ||
        !u.enabled ||
        u.scheduleMode === "none" ||
        !u.when ||
        (u.completedAt && !u.periodInMinutes)) &&
        (await R.alarms.clear(i.name).catch((o) => {
          console.error(o);
        }));
    }
    for (const i of s)
      !i.enabled ||
        i.scheduleMode === "none" ||
        !i.when ||
        (i.completedAt && !i.periodInMinutes) ||
        a.find((o) => i.id === o.name) ||
        (await pr(i.id, {
          when: i.when,
          periodInMinutes: i.periodInMinutes,
        }).catch((o) => {
          console.error(o);
        }));
  }
  const Sr = async (s, a, i) => {
    const u = await Be.getValue(),
      o = u.find((r) => r.id === s);
    if (
      !o ||
      (i &&
        (o.when !== i.when ||
          o.periodInMinutes !== i.periodInMinutes ||
          o.scheduleMode !== i.scheduleMode))
    )
      return;
    const g = o.scheduleMode !== "none" && !o.periodInMinutes;
    (await Be.setValue(
      u.map((r) =>
        r.id === s
          ? {
              ...r,
              enabled: g ? !1 : r.enabled,
              completedAt: g ? a.triggeredAt : void 0,
              lastTrigger: a,
            }
          : r,
      ),
    ),
      g && (await R.alarms.clear(s).catch((r) => console.error(r))));
  };
  function Er(s, a = 1e3, i = 5e3) {
    return new Promise((u, o) => {
      const g = setTimeout(() => {
          (clearInterval(r), o(new Error("\u7B49\u5F85\u8D85\u65F6.")));
        }, i),
        r = setInterval(async () => {
          const y = await s();
          y && (clearTimeout(g), clearInterval(r), u(y));
        }, a);
    });
  }
  function _r(s) {
    try {
      return JSON.parse(s);
    } catch {}
  }
  async function Pe(s, a) {
    const i = a == null ? void 0 : a.maxRetries,
      u = a == null ? void 0 : a.baseDelay,
      o = a == null ? void 0 : a.maxDelay,
      g = (a == null ? void 0 : a.shouldRetry) ?? (() => !0);
    for (let r = 0; r <= i; r++)
      try {
        return await s();
      } catch (y) {
        if (r >= i || !g(y, r)) throw y;
        const v = Math.min(o, u * Math.pow(2, r)),
          P = Math.random() * v * 0.2,
          B = Math.min(o, v + P);
        await new Promise((L) => setTimeout(L, B));
      }
    throw new Error(
      "\u91CD\u8BD5\u6B21\u6570\u8D85\u8FC7\u6700\u5927\u91CD\u8BD5\u6B21\u6570",
    );
  }
  async function Ir(s, a) {
    let i;
    const u = await R.tabs.query({ url: `${a}/*` }).catch(() => []);
    if (u.length > 0) {
      const r = u.find((y) => y.active);
      r != null && r.id
        ? (i = r)
        : ((i = u[0]),
          await R.tabs.update(i.id, { active: !0 }).catch(() => {}));
    } else i = await R.tabs.create({ url: a }).catch(() => {});
    if (!(i != null && i.id)) return le.PlatformPrepareFailed;
    const o = i.id;
    return (
      await Er(
        async () => (
          (i = await R.tabs.get(o)),
          (i == null ? void 0 : i.status) === "complete"
        ),
        2e3,
        3e4,
      ).catch(() => {}),
      (await yr("taskAlarm", s, i.id).catch(() => !1))
        ? le.ReminderShown
        : le.DispatchFailed
    );
  }
  async function kr(s) {
    if (
      (
        await R.runtime
          .getContexts({ contextTypes: [R.runtime.ContextType.SIDE_PANEL] })
          .catch(() => [])
      ).length === 0
    )
      return le.SkippedSidepanelClosed;
    const i = await R.windows
      .getAll({ windowTypes: [R.windows.WindowType.NORMAL] })
      .then((y) => y.map((v) => v.id).filter((v) => v && v > 0))
      .catch(() => []);
    if (i.length === 0) return le.SkippedSidepanelClosed;
    const o = await (
      await Promise.allSettled(
        i.map(async (y) => mt("preCheckTaskAlarm", { ...s, windowId: y })),
      )
    )
      .filter((y) => y.status === "fulfilled")
      .map((y) => y.value);
    if (o.length === 0) return le.DispatchFailed;
    const g = o.filter((y) => (y == null ? void 0 : y.idle) === !0);
    if (g.length === 0) return le.SkippedTaskBusy;
    const r = g.find((y) => y.hasPlatformTab) || g[0];
    return mt("runTaskAlarm", { ...s, windowId: r.windowId }).catch(
      () => le.DispatchFailed,
    );
  }
  async function vr(s) {
    const i = (await Be.getValue()).find((v) => v.id === s.name),
      u = (i == null ? void 0 : i.scheduleMode) ?? De.Reminder;
    if (!i || u === De.None || !i.enabled) {
      await R.alarms.clear(s.name);
      return;
    }
    const o = dr.find((v) => v.code === i.platform);
    if (!o) {
      await R.alarms.clear(s.name);
      return;
    }
    const g = s.scheduledTime ?? Date.now(),
      r = Date.now(),
      y = await (u === De.Auto ? kr(i) : Ir(i, o.origin));
    y && (await Sr(i.id, { scheduledAt: g, triggeredAt: r, result: y }, i));
  }
  const Ar = async () => {
    const s = new Set();
    let a = Promise.resolve();
    (R.alarms.onAlarm.addListener((i) => {
      s.has(i.name) ||
        (s.add(i.name),
        (a = a
          .then(() => vr(i))
          .catch((u) =>
            console.error(
              `\u5904\u7406\u91C7\u96C6\u8BA1\u5212\u5931\u8D25\uFF1A${i.name}`,
              u,
            ),
          )
          .finally(() => s.delete(i.name))));
    }),
      br().catch((i) =>
        console.error(
          "\u6062\u590D\u91C7\u96C6\u8BA1\u5212\u72B6\u6001\u5931\u8D25",
          i,
        ),
      ));
  };
  var Ie = { exports: {} },
    Tr = Ie.exports,
    pt;
  function Or() {
    return (
      pt ||
        ((pt = 1),
        (function (s, a) {
          (function (i, u) {
            u(a);
          })(Tr, function (i) {
            var u;
            try {
              u = new TextDecoder();
            } catch {}
            var o,
              g,
              r = 0,
              y = {},
              v,
              P,
              B = 0,
              L = 0,
              $,
              ee,
              H = [],
              x,
              m = { useRecords: !1, mapsAsObjects: !0 };
            class p {}
            const _ = new p();
            _.name = "MessagePack 0xC1";
            var A = !1,
              U = 2,
              z;
            class C {
              constructor(e) {
                (e &&
                  (e.useRecords === !1 &&
                    e.mapsAsObjects === void 0 &&
                    (e.mapsAsObjects = !0),
                  e.sequential &&
                    e.trusted !== !1 &&
                    ((e.trusted = !0),
                    !e.structures &&
                      e.useRecords != !1 &&
                      ((e.structures = []),
                      e.maxSharedStructures || (e.maxSharedStructures = 0))),
                  e.structures
                    ? (e.structures.sharedLength = e.structures.length)
                    : e.getStructures &&
                      (((e.structures = []).uninitialized = !0),
                      (e.structures.sharedLength = 0)),
                  e.int64AsNumber && (e.int64AsType = "number")),
                  Object.assign(this, e));
              }
              unpack(e, n) {
                if (o)
                  return Ct(
                    () => (
                      Ve(),
                      this
                        ? this.unpack(e, n)
                        : C.prototype.unpack.call(m, e, n)
                    ),
                  );
                (!e.buffer &&
                  e.constructor === ArrayBuffer &&
                  (e =
                    typeof Buffer < "u" ? Buffer.from(e) : new Uint8Array(e)),
                  typeof n == "object"
                    ? ((g = n.end || e.length), (r = n.start || 0))
                    : ((r = 0), (g = n > -1 ? n : e.length)),
                  (L = 0),
                  (P = null),
                  ($ = null),
                  (o = e));
                try {
                  x =
                    e.dataView ||
                    (e.dataView = new DataView(
                      e.buffer,
                      e.byteOffset,
                      e.byteLength,
                    ));
                } catch (c) {
                  throw (
                    (o = null),
                    e instanceof Uint8Array
                      ? c
                      : new Error(
                          "Source must be a Uint8Array or Buffer but was a " +
                            (e && typeof e == "object"
                              ? e.constructor.name
                              : typeof e),
                        )
                  );
                }
                if (this instanceof C) {
                  if (((y = this), this.structures))
                    return ((v = this.structures), ne(n));
                  (!v || v.length > 0) && (v = []);
                } else ((y = m), (!v || v.length > 0) && (v = []));
                return ne(n);
              }
              unpackMultiple(e, n) {
                let c,
                  l = 0;
                try {
                  A = !0;
                  let w = e.length,
                    b = this ? this.unpack(e, w) : $e.unpack(e, w);
                  if (n) {
                    if (n(b, l, r) === !1) return;
                    for (; r < w; ) if (((l = r), n(ne(), l, r) === !1)) return;
                  } else {
                    for (c = [b]; r < w; ) ((l = r), c.push(ne()));
                    return c;
                  }
                } catch (w) {
                  throw ((w.lastPosition = l), (w.values = c), w);
                } finally {
                  ((A = !1), Ve());
                }
              }
              _mergeStructures(e, n) {
                (this._onLoadedStructures && (e = this._onLoadedStructures(e)),
                  (e = e || []),
                  Object.isFrozen(e) && (e = e.map((c) => c.slice(0))));
                for (let c = 0, l = e.length; c < l; c++) {
                  let w = e[c];
                  w &&
                    ((w.isShared = !0),
                    c >= 32 && (w.highByte = (c - 32) >> 5));
                }
                e.sharedLength = e.length;
                for (let c in n || [])
                  if (c >= 0) {
                    let l = e[c],
                      w = n[c];
                    w &&
                      (l &&
                        ((e.restoreStructures || (e.restoreStructures = []))[
                          c
                        ] = l),
                      (e[c] = w));
                  }
                return (this.structures = e);
              }
              decode(e, n) {
                return this.unpack(e, n);
              }
            }
            function ne(t) {
              try {
                if (!y.trusted && !A) {
                  let n = v.sharedLength || 0;
                  n < v.length && (v.length = n);
                }
                let e;
                if (
                  (y._readStruct && o[r] < 64 && o[r] >= 32
                    ? ((e = y._readStruct(o, r, g)),
                      (o = null),
                      !(t && t.lazy) && e && (e = e.toJSON()),
                      (r = g))
                    : (e = F()),
                  $ && ((r = $.postBundlePosition), ($ = null)),
                  A && (v.restoreStructures = null),
                  r == g)
                )
                  (v && v.restoreStructures && G(),
                    (v = null),
                    (o = null),
                    ee && (ee = null));
                else {
                  if (r > g)
                    throw new Error("Unexpected end of MessagePack data");
                  if (!A) {
                    let n;
                    try {
                      n = JSON.stringify(e, (c, l) =>
                        typeof l == "bigint" ? `${l}n` : l,
                      ).slice(0, 100);
                    } catch (c) {
                      n = "(JSON view not available " + c + ")";
                    }
                    throw new Error(
                      "Data read, but end of buffer not reached " + n,
                    );
                  }
                }
                return e;
              } catch (e) {
                throw (
                  v && v.restoreStructures && G(),
                  Ve(),
                  (e instanceof RangeError ||
                    e.message.startsWith("Unexpected end of buffer") ||
                    r > g) &&
                    (e.incomplete = !0),
                  e
                );
              }
            }
            function G() {
              for (let t in v.restoreStructures) v[t] = v.restoreStructures[t];
              v.restoreStructures = null;
            }
            function F() {
              let t = o[r++];
              if (t < 160)
                if (t < 128) {
                  if (t < 64) return t;
                  {
                    let e = v[t & 63] || (y.getStructures && fe()[t & 63]);
                    return e
                      ? (e.read || (e.read = oe(e, t & 63)), e.read())
                      : t;
                  }
                } else if (t < 144)
                  if (((t -= 128), y.mapsAsObjects)) {
                    let e = {};
                    for (let n = 0; n < t; n++) {
                      let c = Mt();
                      (c === "__proto__" && (c = "__proto_"), (e[c] = F()));
                    }
                    return e;
                  } else {
                    let e = new Map();
                    for (let n = 0; n < t; n++) e.set(F(), F());
                    return e;
                  }
                else {
                  t -= 144;
                  let e = new Array(t);
                  for (let n = 0; n < t; n++) e[n] = F();
                  return y.freezeData ? Object.freeze(e) : e;
                }
              else if (t < 192) {
                let e = t - 160;
                if (L >= r) return P.slice(r - B, (r += e) - B);
                if (L == 0 && g < 140) {
                  let n = e < 16 ? tt(e) : Ot(e);
                  if (n != null) return n;
                }
                return ke(e);
              } else {
                let e;
                switch (t) {
                  case 192:
                    return null;
                  case 193:
                    return $
                      ? ((e = F()),
                        e > 0
                          ? $[1].slice($.position1, ($.position1 += e))
                          : $[0].slice($.position0, ($.position0 -= e)))
                      : _;
                  case 194:
                    return !1;
                  case 195:
                    return !0;
                  case 196:
                    if (((e = o[r++]), e === void 0))
                      throw new Error("Unexpected end of buffer");
                    return rt(e);
                  case 197:
                    return ((e = x.getUint16(r)), (r += 2), rt(e));
                  case 198:
                    return ((e = x.getUint32(r)), (r += 4), rt(e));
                  case 199:
                    return ge(o[r++]);
                  case 200:
                    return ((e = x.getUint16(r)), (r += 2), ge(e));
                  case 201:
                    return ((e = x.getUint32(r)), (r += 4), ge(e));
                  case 202:
                    if (((e = x.getFloat32(r)), y.useFloat32 > 2)) {
                      let n = je[((o[r] & 127) << 1) | (o[r + 1] >> 7)];
                      return (
                        (r += 4),
                        ((n * e + (e > 0 ? 0.5 : -0.5)) >> 0) / n
                      );
                    }
                    return ((r += 4), e);
                  case 203:
                    return ((e = x.getFloat64(r)), (r += 8), e);
                  case 204:
                    return o[r++];
                  case 205:
                    return ((e = x.getUint16(r)), (r += 2), e);
                  case 206:
                    return ((e = x.getUint32(r)), (r += 4), e);
                  case 207:
                    return (
                      y.int64AsType === "number"
                        ? ((e = x.getUint32(r) * 4294967296),
                          (e += x.getUint32(r + 4)))
                        : y.int64AsType === "string"
                          ? (e = x.getBigUint64(r).toString())
                          : y.int64AsType === "auto"
                            ? ((e = x.getBigUint64(r)),
                              e <= BigInt(2) << BigInt(52) && (e = Number(e)))
                            : (e = x.getBigUint64(r)),
                      (r += 8),
                      e
                    );
                  case 208:
                    return x.getInt8(r++);
                  case 209:
                    return ((e = x.getInt16(r)), (r += 2), e);
                  case 210:
                    return ((e = x.getInt32(r)), (r += 4), e);
                  case 211:
                    return (
                      y.int64AsType === "number"
                        ? ((e = x.getInt32(r) * 4294967296),
                          (e += x.getUint32(r + 4)))
                        : y.int64AsType === "string"
                          ? (e = x.getBigInt64(r).toString())
                          : y.int64AsType === "auto"
                            ? ((e = x.getBigInt64(r)),
                              e >= BigInt(-2) << BigInt(52) &&
                                e <= BigInt(2) << BigInt(52) &&
                                (e = Number(e)))
                            : (e = x.getBigInt64(r)),
                      (r += 8),
                      e
                    );
                  case 212:
                    if (((e = o[r++]), e == 114)) return Bt(o[r++] & 63);
                    {
                      let n = H[e];
                      if (n)
                        return n.read
                          ? (r++, n.read(F()))
                          : n.noBuffer
                            ? (r++, n())
                            : n(o.subarray(r, ++r));
                      throw new Error("Unknown extension " + e);
                    }
                  case 213:
                    return (
                      (e = o[r]),
                      e == 114 ? (r++, Bt(o[r++] & 63, o[r++])) : ge(2)
                    );
                  case 214:
                    return ge(4);
                  case 215:
                    return ge(8);
                  case 216:
                    return ge(16);
                  case 217:
                    return (
                      (e = o[r++]),
                      L >= r ? P.slice(r - B, (r += e) - B) : we(e)
                    );
                  case 218:
                    return (
                      (e = x.getUint16(r)),
                      (r += 2),
                      L >= r ? P.slice(r - B, (r += e) - B) : Ne(e)
                    );
                  case 219:
                    return (
                      (e = x.getUint32(r)),
                      (r += 4),
                      L >= r ? P.slice(r - B, (r += e) - B) : ve(e)
                    );
                  case 220:
                    return ((e = x.getUint16(r)), (r += 2), At(e));
                  case 221:
                    return ((e = x.getUint32(r)), (r += 4), At(e));
                  case 222:
                    return ((e = x.getUint16(r)), (r += 2), Tt(e));
                  case 223:
                    return ((e = x.getUint32(r)), (r += 4), Tt(e));
                  default:
                    if (t >= 224) return t - 256;
                    if (t === void 0) {
                      let n = new Error("Unexpected end of MessagePack data");
                      throw ((n.incomplete = !0), n);
                    }
                    throw new Error("Unknown MessagePack token " + t);
                }
              }
            }
            const K = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
            function oe(t, e) {
              function n() {
                if (n.count++ > U) {
                  let l;
                  try {
                    l = t.read = new z(
                      "r",
                      "return function(){return " +
                        (y.freezeData ? "Object.freeze" : "") +
                        "({" +
                        t
                          .map((w) =>
                            w === "__proto__"
                              ? "__proto_:r()"
                              : K.test(w)
                                ? w + ":r()"
                                : "[" + JSON.stringify(w) + "]:r()",
                          )
                          .join(",") +
                        "})}",
                    )(F);
                  } catch {
                    return ((U = 1 / 0), n());
                  }
                  return (
                    (t.read0 = l),
                    t.highByte === 0 && (t.read = ue(e, t.read)),
                    l()
                  );
                }
                let c = {};
                for (let l = 0, w = t.length; l < w; l++) {
                  let b = t[l];
                  (b === "__proto__" && (b = "__proto_"), (c[b] = F()));
                }
                return y.freezeData ? Object.freeze(c) : c;
              }
              return (
                (n.count = 0),
                (t.read0 = n),
                t.highByte === 0 ? ue(e, n) : n
              );
            }
            const ue = (t, e) =>
              function () {
                let n = o[r++];
                if (n === 0) return e();
                let c = t < 32 ? -(t + (n << 5)) : t + (n << 5),
                  l = v[c] || fe()[c];
                if (!l) throw new Error("Record id is not defined for " + c);
                return (l.read || (l.read = oe(l, t)), l.read());
              };
            function fe() {
              let t = Ct(() => ((o = null), y.getStructures()));
              return (v = y._mergeStructures(t, v));
            }
            var ke = Te,
              we = Te,
              Ne = Te,
              ve = Te;
            let Ae = !1;
            function Te(t) {
              let e;
              if (t < 16 && (e = tt(t))) return e;
              if (t > 64 && u) return u.decode(o.subarray(r, (r += t)));
              const n = r + t,
                c = [];
              for (e = ""; r < n; ) {
                const l = o[r++];
                if ((l & 128) === 0) c.push(l);
                else if ((l & 224) === 192)
                  if (l < 194 || r >= n || (o[r] & 192) !== 128) c.push(65533);
                  else {
                    const w = o[r++] & 63;
                    c.push(((l & 31) << 6) | w);
                  }
                else if ((l & 240) === 224) {
                  const w = r < n ? o[r] : 0;
                  if (
                    r >= n ||
                    (w & 192) !== 128 ||
                    (l === 224 && w < 160) ||
                    (l === 237 && w >= 160)
                  )
                    c.push(65533);
                  else if ((r++, r >= n || (o[r] & 192) !== 128)) c.push(65533);
                  else {
                    const b = o[r++] & 63;
                    c.push(((l & 31) << 12) | ((w & 63) << 6) | b);
                  }
                } else if ((l & 248) === 240) {
                  const w = r < n ? o[r] : 0;
                  if (
                    l > 244 ||
                    r >= n ||
                    (w & 192) !== 128 ||
                    (l === 240 && w < 144) ||
                    (l === 244 && w >= 144)
                  )
                    c.push(65533);
                  else if ((r++, r >= n || (o[r] & 192) !== 128)) c.push(65533);
                  else {
                    const b = o[r++] & 63;
                    if (r >= n || (o[r] & 192) !== 128) c.push(65533);
                    else {
                      const T = o[r++] & 63;
                      let J = ((l & 7) << 18) | ((w & 63) << 12) | (b << 6) | T;
                      ((J -= 65536),
                        c.push(((J >>> 10) & 1023) | 55296),
                        c.push(56320 | (J & 1023)));
                    }
                  }
                } else c.push(65533);
                c.length >= 4096 && ((e += X.apply(String, c)), (c.length = 0));
              }
              return (c.length > 0 && (e += X.apply(String, c)), e);
            }
            function At(t) {
              let e = new Array(t);
              for (let n = 0; n < t; n++) e[n] = F();
              return y.freezeData ? Object.freeze(e) : e;
            }
            function Tt(t) {
              if (y.mapsAsObjects) {
                let e = {};
                for (let n = 0; n < t; n++) {
                  let c = Mt();
                  (c === "__proto__" && (c = "__proto_"), (e[c] = F()));
                }
                return e;
              } else {
                let e = new Map();
                for (let n = 0; n < t; n++) e.set(F(), F());
                return e;
              }
            }
            var X = String.fromCharCode;
            function Ot(t) {
              let e = r,
                n = new Array(t);
              for (let c = 0; c < t; c++) {
                const l = o[r++];
                if ((l & 128) > 0) {
                  r = e;
                  return;
                }
                n[c] = l;
              }
              return X.apply(String, n);
            }
            function tt(t) {
              if (t < 4)
                if (t < 2) {
                  if (t === 0) return "";
                  {
                    let e = o[r++];
                    if ((e & 128) > 1) {
                      r -= 1;
                      return;
                    }
                    return X(e);
                  }
                } else {
                  let e = o[r++],
                    n = o[r++];
                  if ((e & 128) > 0 || (n & 128) > 0) {
                    r -= 2;
                    return;
                  }
                  if (t < 3) return X(e, n);
                  let c = o[r++];
                  if ((c & 128) > 0) {
                    r -= 3;
                    return;
                  }
                  return X(e, n, c);
                }
              else {
                let e = o[r++],
                  n = o[r++],
                  c = o[r++],
                  l = o[r++];
                if (
                  (e & 128) > 0 ||
                  (n & 128) > 0 ||
                  (c & 128) > 0 ||
                  (l & 128) > 0
                ) {
                  r -= 4;
                  return;
                }
                if (t < 6) {
                  if (t === 4) return X(e, n, c, l);
                  {
                    let w = o[r++];
                    if ((w & 128) > 0) {
                      r -= 5;
                      return;
                    }
                    return X(e, n, c, l, w);
                  }
                } else if (t < 8) {
                  let w = o[r++],
                    b = o[r++];
                  if ((w & 128) > 0 || (b & 128) > 0) {
                    r -= 6;
                    return;
                  }
                  if (t < 7) return X(e, n, c, l, w, b);
                  let T = o[r++];
                  if ((T & 128) > 0) {
                    r -= 7;
                    return;
                  }
                  return X(e, n, c, l, w, b, T);
                } else {
                  let w = o[r++],
                    b = o[r++],
                    T = o[r++],
                    J = o[r++];
                  if (
                    (w & 128) > 0 ||
                    (b & 128) > 0 ||
                    (T & 128) > 0 ||
                    (J & 128) > 0
                  ) {
                    r -= 8;
                    return;
                  }
                  if (t < 10) {
                    if (t === 8) return X(e, n, c, l, w, b, T, J);
                    {
                      let Q = o[r++];
                      if ((Q & 128) > 0) {
                        r -= 9;
                        return;
                      }
                      return X(e, n, c, l, w, b, T, J, Q);
                    }
                  } else if (t < 12) {
                    let Q = o[r++],
                      Y = o[r++];
                    if ((Q & 128) > 0 || (Y & 128) > 0) {
                      r -= 10;
                      return;
                    }
                    if (t < 11) return X(e, n, c, l, w, b, T, J, Q, Y);
                    let Z = o[r++];
                    if ((Z & 128) > 0) {
                      r -= 11;
                      return;
                    }
                    return X(e, n, c, l, w, b, T, J, Q, Y, Z);
                  } else {
                    let Q = o[r++],
                      Y = o[r++],
                      Z = o[r++],
                      re = o[r++];
                    if (
                      (Q & 128) > 0 ||
                      (Y & 128) > 0 ||
                      (Z & 128) > 0 ||
                      (re & 128) > 0
                    ) {
                      r -= 12;
                      return;
                    }
                    if (t < 14) {
                      if (t === 12)
                        return X(e, n, c, l, w, b, T, J, Q, Y, Z, re);
                      {
                        let se = o[r++];
                        if ((se & 128) > 0) {
                          r -= 13;
                          return;
                        }
                        return X(e, n, c, l, w, b, T, J, Q, Y, Z, re, se);
                      }
                    } else {
                      let se = o[r++],
                        xe = o[r++];
                      if ((se & 128) > 0 || (xe & 128) > 0) {
                        r -= 14;
                        return;
                      }
                      if (t < 15)
                        return X(e, n, c, l, w, b, T, J, Q, Y, Z, re, se, xe);
                      let ae = o[r++];
                      if ((ae & 128) > 0) {
                        r -= 15;
                        return;
                      }
                      return X(e, n, c, l, w, b, T, J, Q, Y, Z, re, se, xe, ae);
                    }
                  }
                }
              }
            }
            function Rt() {
              let t = o[r++],
                e;
              if (t < 192) e = t - 160;
              else
                switch (t) {
                  case 217:
                    e = o[r++];
                    break;
                  case 218:
                    ((e = x.getUint16(r)), (r += 2));
                    break;
                  case 219:
                    ((e = x.getUint32(r)), (r += 4));
                    break;
                  default:
                    throw new Error("Expected string");
                }
              return Te(e);
            }
            function rt(t) {
              return y.copyBuffers
                ? Uint8Array.prototype.slice.call(o, r, (r += t))
                : o.subarray(r, (r += t));
            }
            function ge(t) {
              let e = o[r++];
              if (H[e]) {
                let n;
                return H[e](o.subarray(r, (n = r += t)), (c) => {
                  r = c;
                  try {
                    return F();
                  } finally {
                    r = n;
                  }
                });
              } else throw new Error("Unknown extension type " + e);
            }
            var Ut = new Array(4096);
            function Mt() {
              let t = o[r++];
              if (t >= 160 && t < 192) {
                if (((t = t - 160), L >= r))
                  return P.slice(r - B, (r += t) - B);
                if (!(L == 0 && g < 180)) return ke(t);
              } else return (r--, Dt(F()));
              let e =
                  ((t << 5) ^ (t > 1 ? x.getUint16(r) : t > 0 ? o[r] : 0)) &
                  4095,
                n = Ut[e],
                c = r,
                l = r + t - 3,
                w,
                b = 0;
              if (n && n.bytes == t) {
                for (; c < l; ) {
                  if (((w = x.getUint32(c)), w != n[b++])) {
                    c = 1879048192;
                    break;
                  }
                  c += 4;
                }
                for (l += 3; c < l; )
                  if (((w = o[c++]), w != n[b++])) {
                    c = 1879048192;
                    break;
                  }
                if (c === l) return ((r = c), n.string);
                ((l -= 3), (c = r));
              }
              for (n = [], Ut[e] = n, n.bytes = t; c < l; )
                ((w = x.getUint32(c)), n.push(w), (c += 4));
              for (l += 3; c < l; ) ((w = o[c++]), n.push(w));
              let T = t < 16 ? tt(t) : Ot(t);
              return T != null ? (n.string = T) : (n.string = ke(t));
            }
            function Dt(t) {
              if (typeof t == "string") return t;
              if (
                typeof t == "number" ||
                typeof t == "boolean" ||
                typeof t == "bigint"
              )
                return t.toString();
              if (t == null) return t + "";
              if (
                y.allowArraysInMapKeys &&
                Array.isArray(t) &&
                t
                  .flat()
                  .every((e) =>
                    ["string", "number", "boolean", "bigint"].includes(
                      typeof e,
                    ),
                  )
              )
                return t.flat().toString();
              throw new Error(`Invalid property type for record: ${typeof t}`);
            }
            const Bt = (t, e) => {
              let n = F().map(Dt),
                c = t;
              e !== void 0 &&
                ((t = t < 32 ? -((e << 5) + t) : (e << 5) + t),
                (n.highByte = e));
              let l = v[t];
              return (
                l &&
                  (l.isShared || A) &&
                  ((v.restoreStructures || (v.restoreStructures = []))[t] = l),
                (v[t] = n),
                (n.read = oe(n, c)),
                (n.read0 || n.read)()
              );
            };
            ((H[0] = () => {}),
              (H[0].noBuffer = !0),
              (H[66] = (t) => {
                let e = t.byteLength % 8 || 8,
                  n = BigInt(t[0] & 128 ? t[0] - 256 : t[0]);
                for (let c = 1; c < e; c++)
                  ((n <<= BigInt(8)), (n += BigInt(t[c])));
                if (t.byteLength !== e) {
                  let c = new DataView(t.buffer, t.byteOffset, t.byteLength),
                    l = (w, b) => {
                      let T = b - w;
                      if (T <= 40) {
                        let Z = c.getBigUint64(w);
                        for (let re = w + 8; re < b; re += 8)
                          ((Z <<= BigInt(64)), (Z |= c.getBigUint64(re)));
                        return Z;
                      }
                      let J = w + ((T >> 4) << 3),
                        Q = l(w, J),
                        Y = l(J, b);
                      return (Q << BigInt((b - J) * 8)) | Y;
                    };
                  n =
                    (n << BigInt((c.byteLength - e) * 8)) | l(e, c.byteLength);
                }
                return n;
              }));
            let Pt = {
              Error,
              EvalError,
              RangeError,
              ReferenceError,
              SyntaxError,
              TypeError,
              URIError,
              AggregateError:
                typeof AggregateError == "function" ? AggregateError : null,
            };
            ((H[101] = () => {
              let t = F();
              if (!Pt[t[0]]) {
                let e = Error(t[1], { cause: t[2] });
                return ((e.name = t[0]), e);
              }
              return Pt[t[0]](t[1], { cause: t[2] });
            }),
              (H[105] = (t) => {
                if (y.structuredClone === !1)
                  throw new Error("Structured clone extension is disabled");
                let e = x.getUint32(r - 4);
                ee || (ee = new Map());
                let n = o[r],
                  c;
                (n >= 144 && n < 160) || n == 220 || n == 221
                  ? (c = [])
                  : (n >= 128 && n < 144) || n == 222 || n == 223
                    ? (c = new Map())
                    : ((n >= 199 && n <= 201) || (n >= 212 && n <= 216)) &&
                        o[r + 1] === 115
                      ? (c = new Set())
                      : (c = {});
                let l = { target: c };
                ee.set(e, l);
                let w = F();
                if (l.used) Object.assign(c, w);
                else return (l.target = w);
                if (c instanceof Map)
                  for (let [b, T] of w.entries()) c.set(b, T);
                if (c instanceof Set) for (let b of Array.from(w)) c.add(b);
                return c;
              }),
              (H[112] = (t) => {
                if (y.structuredClone === !1)
                  throw new Error("Structured clone extension is disabled");
                let e = x.getUint32(r - 4),
                  n = ee.get(e);
                return ((n.used = !0), n.target);
              }),
              (H[115] = () => new Set(F())));
            const Ft = [
              "Int8",
              "Uint8",
              "Uint8Clamped",
              "Int16",
              "Uint16",
              "Int32",
              "Uint32",
              "Float32",
              "Float64",
              "BigInt64",
              "BigUint64",
            ].map((t) => t + "Array");
            let Wr = typeof globalThis == "object" ? globalThis : window;
            ((H[116] = (t) => {
              let e = t[0],
                n = Uint8Array.prototype.slice.call(t, 1).buffer,
                c = Ft[e];
              if (!c) {
                if (e === 16) return n;
                if (e === 17) return new DataView(n);
                throw new Error("Could not find typed array for code " + e);
              }
              return new Wr[c](n);
            }),
              (H[120] = () => {
                let t = F();
                return new RegExp(t[0], t[1]);
              }));
            const Yr = [];
            ((H[98] = (t) => {
              let e = (t[0] << 24) + (t[1] << 16) + (t[2] << 8) + t[3],
                n = r;
              return (
                (r += e - t.length),
                ($ = Yr),
                ($ = [Rt(), Rt()]),
                ($.position0 = 0),
                ($.position1 = 0),
                ($.postBundlePosition = r),
                (r = n),
                F()
              );
            }),
              (H[255] = (t) =>
                t.length == 4
                  ? new Date(
                      (t[0] * 16777216 + (t[1] << 16) + (t[2] << 8) + t[3]) *
                        1e3,
                    )
                  : t.length == 8
                    ? new Date(
                        ((t[0] << 22) +
                          (t[1] << 14) +
                          (t[2] << 6) +
                          (t[3] >> 2)) /
                          1e6 +
                          ((t[3] & 3) * 4294967296 +
                            t[4] * 16777216 +
                            (t[5] << 16) +
                            (t[6] << 8) +
                            t[7]) *
                            1e3,
                      )
                    : t.length == 12
                      ? new Date(
                          ((t[0] << 24) + (t[1] << 16) + (t[2] << 8) + t[3]) /
                            1e6 +
                            ((t[4] & 128 ? -281474976710656 : 0) +
                              t[6] * 1099511627776 +
                              t[7] * 4294967296 +
                              t[8] * 16777216 +
                              (t[9] << 16) +
                              (t[10] << 8) +
                              t[11]) *
                              1e3,
                        )
                      : new Date("invalid")));
            function Ct(t) {
              y && y._onSaveState && y._onSaveState();
              let e = g,
                n = r,
                c = B,
                l = L,
                w = P,
                b = ee,
                T = $,
                J = new Uint8Array(o.slice(0, g)),
                Q = v,
                Y = v.slice(0, v.length),
                Z = y,
                re = A,
                se = t();
              return (
                (g = e),
                (r = n),
                (B = c),
                (L = l),
                (P = w),
                (ee = b),
                ($ = T),
                (o = J),
                (A = re),
                (v = Q),
                v.splice(0, v.length, ...Y),
                (y = Z),
                (x = new DataView(o.buffer, o.byteOffset, o.byteLength)),
                se
              );
            }
            function Ve() {
              ((o = null), (ee = null), (v = null));
            }
            function Hr(t) {
              t.unpack ? (H[t.type] = t.unpack) : (H[t.type] = t);
            }
            const je = new Array(147);
            for (let t = 0; t < 256; t++)
              je[t] = +("1e" + Math.floor(45.15 - t * 0.30103));
            const Zr = C;
            var $e = new C({ useRecords: !1 });
            const Qr = $e.unpack,
              Gr = $e.unpackMultiple,
              Xr = $e.unpack,
              Lt = { NEVER: 0, ALWAYS: 1, DECIMAL_ROUND: 3, DECIMAL_FIT: 4 };
            let Nt = new Float32Array(1),
              Vt = new Uint8Array(Nt.buffer, 0, 4);
            function en(t) {
              Nt[0] = t;
              let e = je[((Vt[3] & 127) << 1) | (Vt[2] >> 7)];
              return ((e * t + (t > 0 ? 0.5 : -0.5)) >> 0) / e;
            }
            C.SUPPORTS_STRUCT_HOOKS = !0;
            let ze;
            try {
              ze = new TextEncoder();
            } catch {}
            let Ke, qe;
            const be = typeof Buffer < "u",
              Je = be
                ? function (t) {
                    return Buffer.allocUnsafeSlow(t);
                  }
                : Uint8Array,
              jt = be ? Buffer : Uint8Array,
              $t = be ? 4294967296 : 2144337920;
            let d,
              Oe,
              j,
              f = 0,
              te,
              q = null;
            const tn = 21760,
              rn = /[\u0080-\uFFFF]/,
              Se = Symbol("record-id");
            class Ee extends C {
              constructor(e) {
                (super(e), (this.offset = 0));
                let n,
                  c,
                  l,
                  w,
                  b = jt.prototype.utf8Write
                    ? function (h, k) {
                        return d.utf8Write(h, k, d.byteLength - k);
                      }
                    : ze && ze.encodeInto
                      ? function (h, k) {
                          return ze.encodeInto(h, d.subarray(k)).written;
                        }
                      : !1,
                  T = this;
                e || (e = {});
                let J = e && e.sequential,
                  Q = e.structures || e.saveStructures,
                  Y = e.maxSharedStructures;
                if ((Y == null && (Y = Q ? 32 : 0), Y > 8160))
                  throw new Error("Maximum maxSharedStructure is 8160");
                e.structuredClone &&
                  e.moreTypes == null &&
                  (this.moreTypes = !0);
                let Z = e.maxOwnStructures;
                (Z == null && (Z = Q ? 32 : 64),
                  !this.structures &&
                    e.useRecords != !1 &&
                    (this.structures = []));
                let re = Y > 32 || Z + Y > 64,
                  se = Y + 64,
                  xe = Y + Z + 64;
                if (xe > 8256)
                  throw new Error(
                    "Maximum maxSharedStructure + maxOwnStructure is 8192",
                  );
                let ae = [],
                  st = 0,
                  We = 0;
                this.pack = this.encode = function (h, k) {
                  if (
                    (d ||
                      ((d = new Je(8192)),
                      (j =
                        d.dataView ||
                        (d.dataView = new DataView(d.buffer, 0, 8192))),
                      (f = 0)),
                    (te = d.length - 10),
                    te - f < 2048
                      ? ((d = new Je(d.length)),
                        (j =
                          d.dataView ||
                          (d.dataView = new DataView(d.buffer, 0, d.length))),
                        (te = d.length - 10),
                        (f = 0))
                      : (f = (f + 7) & 2147483640),
                    (n = f),
                    k & Yt && (f += k & 255),
                    (w = T.structuredClone ? new Map() : null),
                    T.bundleStrings && typeof h != "string"
                      ? ((q = []), (q.size = 1 / 0))
                      : (q = null),
                    (l = T.structures),
                    l)
                  ) {
                    l.uninitialized &&
                      (l = T._mergeStructures(T.getStructures()));
                    let S = l.sharedLength || 0;
                    if (S > Y)
                      throw new Error(
                        "Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " +
                          l.sharedLength,
                      );
                    if (!l.transitions) {
                      l.transitions = Object.create(null);
                      for (let E = 0; E < S; E++) {
                        let M = l[E];
                        if (!M) continue;
                        let D,
                          O = l.transitions;
                        for (let N = 0, V = M.length; N < V; N++) {
                          let ce = M[N];
                          ((D = O[ce]),
                            D || (D = O[ce] = Object.create(null)),
                            (O = D));
                        }
                        O[Se] = E + 64;
                      }
                      this.lastNamedStructuresLength = S;
                    }
                    J || (l.nextId = S + 64);
                  }
                  c && (c = !1);
                  let I;
                  try {
                    T._writeStruct && h && typeof h == "object"
                      ? h.constructor === Object
                        ? Xt(h)
                        : h.constructor !== Map &&
                            !Array.isArray(h) &&
                            !qe.some((E) => h instanceof E)
                          ? Xt(h.toJSON ? h.toJSON() : h)
                          : W(h)
                      : W(h);
                    let S = q;
                    if ((q && Kt(n, W, 0), w && w.idsToInsert)) {
                      let E = w.idsToInsert.sort((N, V) =>
                          N.offset > V.offset ? 1 : -1,
                        ),
                        M = E.length,
                        D = -1;
                      for (; S && M > 0; ) {
                        let N = E[--M].offset + n;
                        (N < S.stringsPosition + n && D === -1 && (D = 0),
                          N > S.position + n
                            ? D >= 0 && (D += 6)
                            : (D >= 0 &&
                                (j.setUint32(
                                  S.position + n,
                                  j.getUint32(S.position + n) + D,
                                ),
                                (D = -1)),
                              (S = S.previous),
                              M++));
                      }
                      (D >= 0 &&
                        S &&
                        j.setUint32(
                          S.position + n,
                          j.getUint32(S.position + n) + D,
                        ),
                        (f += E.length * 6),
                        f > te && de(f),
                        (T.offset = f));
                      let O = nn(d.subarray(n, f), E);
                      return ((w = null), O);
                    }
                    return (
                      (T.offset = f),
                      k & Jt
                        ? ((d.start = n), (d.end = f), d)
                        : d.subarray(n, f)
                    );
                  } catch (S) {
                    throw ((I = S), S);
                  } finally {
                    if (l && (Ht(), c && T.saveStructures)) {
                      let S = l.sharedLength || 0,
                        E = d.subarray(n, f),
                        M = (T._prepareStructures || an)(l, T);
                      if (!I)
                        return T.saveStructures(M, M.isCompatible) === !1
                          ? ((l.uninitialized = !0), T.pack(h, k))
                          : ((T.lastNamedStructuresLength = S),
                            d.length > 1073741824 && (d = null),
                            E);
                    }
                    (d.length > 1073741824 && (d = null), k & Wt && (f = n));
                  }
                };
                const Ht = () => {
                    We < 10 && We++;
                    let h = l.sharedLength || 0;
                    if ((l.length > h && !J && (l.length = h), st > 1e4))
                      ((l.transitions = null),
                        (We = 0),
                        (st = 0),
                        ae.length > 0 && (ae = []));
                    else if (ae.length > 0 && !J) {
                      for (let k = 0, I = ae.length; k < I; k++) ae[k][Se] = 0;
                      ae = [];
                    }
                  },
                  at = (h) => {
                    var k = h.length;
                    k < 16
                      ? (d[f++] = 144 | k)
                      : k < 65536
                        ? ((d[f++] = 220),
                          (d[f++] = k >> 8),
                          (d[f++] = k & 255))
                        : ((d[f++] = 221), j.setUint32(f, k), (f += 4));
                    for (let I = 0; I < k; I++) W(h[I]);
                  },
                  W = (h) => {
                    f > te && (d = de(f));
                    var k = typeof h,
                      I;
                    if (k === "string") {
                      let S = h.length;
                      if (q && S >= 4 && S < 4096) {
                        if ((q.size += S) > tn) {
                          let O,
                            N = (q[0] ? q[0].length * 3 + q[1].length : 0) + 10;
                          f + N > te && (d = de(f + N));
                          let V;
                          (q.position
                            ? ((V = q),
                              (d[f] = 200),
                              (f += 3),
                              (d[f++] = 98),
                              (O = f - n),
                              (f += 4),
                              Kt(n, W, 0),
                              j.setUint16(O + n - 3, f - n - O))
                            : ((d[f++] = 214),
                              (d[f++] = 98),
                              (O = f - n),
                              (f += 4)),
                            (q = ["", ""]),
                            (q.previous = V),
                            (q.size = 0),
                            (q.position = O));
                        }
                        let D = rn.test(h);
                        ((q[D ? 0 : 1] += h), (d[f++] = 193), W(D ? -S : S));
                        return;
                      }
                      let E;
                      S < 32
                        ? (E = 1)
                        : S < 256
                          ? (E = 2)
                          : S < 65536
                            ? (E = 3)
                            : (E = 5);
                      let M = S * 3;
                      if ((f + M > te && (d = de(f + M)), S < 64 || !b)) {
                        let D,
                          O,
                          N,
                          V = f + E;
                        for (D = 0; D < S; D++)
                          ((O = h.charCodeAt(D)),
                            O < 128
                              ? (d[V++] = O)
                              : O < 2048
                                ? ((d[V++] = (O >> 6) | 192),
                                  (d[V++] = (O & 63) | 128))
                                : (O & 64512) === 55296 &&
                                    ((N = h.charCodeAt(D + 1)) & 64512) ===
                                      56320
                                  ? ((O =
                                      65536 + ((O & 1023) << 10) + (N & 1023)),
                                    D++,
                                    (d[V++] = (O >> 18) | 240),
                                    (d[V++] = ((O >> 12) & 63) | 128),
                                    (d[V++] = ((O >> 6) & 63) | 128),
                                    (d[V++] = (O & 63) | 128))
                                  : ((d[V++] = (O >> 12) | 224),
                                    (d[V++] = ((O >> 6) & 63) | 128),
                                    (d[V++] = (O & 63) | 128)));
                        I = V - f - E;
                      } else I = b(h, f + E);
                      (I < 32
                        ? (d[f++] = 160 | I)
                        : I < 256
                          ? (E < 2 && d.copyWithin(f + 2, f + 1, f + 1 + I),
                            (d[f++] = 217),
                            (d[f++] = I))
                          : I < 65536
                            ? (E < 3 && d.copyWithin(f + 3, f + 2, f + 2 + I),
                              (d[f++] = 218),
                              (d[f++] = I >> 8),
                              (d[f++] = I & 255))
                            : (E < 5 && d.copyWithin(f + 5, f + 3, f + 3 + I),
                              (d[f++] = 219),
                              j.setUint32(f, I),
                              (f += 4)),
                        (f += I));
                    } else if (k === "number")
                      if (h >>> 0 === h)
                        h < 32 ||
                        (h < 128 && this.useRecords === !1) ||
                        (h < 64 && !this._writeStruct)
                          ? (d[f++] = h)
                          : h < 256
                            ? ((d[f++] = 204), (d[f++] = h))
                            : h < 65536
                              ? ((d[f++] = 205),
                                (d[f++] = h >> 8),
                                (d[f++] = h & 255))
                              : ((d[f++] = 206), j.setUint32(f, h), (f += 4));
                      else if (h >> 0 === h)
                        h >= -32
                          ? (d[f++] = 256 + h)
                          : h >= -128
                            ? ((d[f++] = 208), (d[f++] = h + 256))
                            : h >= -32768
                              ? ((d[f++] = 209), j.setInt16(f, h), (f += 2))
                              : ((d[f++] = 210), j.setInt32(f, h), (f += 4));
                      else {
                        let S;
                        if (
                          (S = this.useFloat32) > 0 &&
                          h < 4294967296 &&
                          h >= -2147483648
                        ) {
                          ((d[f++] = 202), j.setFloat32(f, h));
                          let E;
                          if (
                            S < 4 ||
                            (E =
                              h * je[((d[f] & 127) << 1) | (d[f + 1] >> 7)]) >>
                              0 ===
                              E
                          ) {
                            f += 4;
                            return;
                          } else f--;
                        }
                        ((d[f++] = 203), j.setFloat64(f, h), (f += 8));
                      }
                    else if (k === "object" || k === "function")
                      if (!h) d[f++] = 192;
                      else {
                        if (w) {
                          let E = w.get(h);
                          if (E) {
                            if (!E.id) {
                              let M = w.idsToInsert || (w.idsToInsert = []);
                              E.id = M.push(E);
                            }
                            ((d[f++] = 214),
                              (d[f++] = 112),
                              j.setUint32(f, E.id),
                              (f += 4));
                            return;
                          } else w.set(h, { offset: f - n });
                        }
                        let S = h.constructor;
                        if (S === Object) Ye(h);
                        else if (S === Array) at(h);
                        else if (S === Map)
                          if (this.mapAsEmptyObject) d[f++] = 128;
                          else {
                            ((I = h.size),
                              I < 16
                                ? (d[f++] = 128 | I)
                                : I < 65536
                                  ? ((d[f++] = 222),
                                    (d[f++] = I >> 8),
                                    (d[f++] = I & 255))
                                  : ((d[f++] = 223),
                                    j.setUint32(f, I),
                                    (f += 4)));
                            for (let [E, M] of h) (W(E), W(M));
                          }
                        else {
                          for (let E = 0, M = Ke.length; E < M; E++) {
                            let D = qe[E];
                            if (h instanceof D) {
                              let O = Ke[E];
                              if (O.write) {
                                O.type &&
                                  ((d[f++] = 212),
                                  (d[f++] = O.type),
                                  (d[f++] = 0));
                                let Re = O.write.call(this, h);
                                Re === h
                                  ? Array.isArray(h)
                                    ? at(h)
                                    : Ye(h)
                                  : W(Re);
                                return;
                              }
                              let N = d,
                                V = j,
                                ce = f;
                              d = null;
                              let he;
                              try {
                                he = O.pack.call(
                                  this,
                                  h,
                                  (Re) => (
                                    (d = N),
                                    (N = null),
                                    (f += Re),
                                    f > te && de(f),
                                    {
                                      target: d,
                                      targetView: j,
                                      position: f - Re,
                                    }
                                  ),
                                  W,
                                );
                              } finally {
                                N &&
                                  ((d = N),
                                  (j = V),
                                  (f = ce),
                                  (te = d.length - 10));
                              }
                              he &&
                                (he.length + f > te && de(he.length + f),
                                (f = zt(he, d, f, O.type)));
                              return;
                            }
                          }
                          if (Array.isArray(h)) at(h);
                          else {
                            if (h.toJSON) {
                              const E = h.toJSON();
                              if (E !== h) return W(E);
                            }
                            if (k === "function")
                              return W(
                                this.writeFunction && this.writeFunction(h),
                              );
                            Ye(h);
                          }
                        }
                      }
                    else if (k === "boolean") d[f++] = h ? 195 : 194;
                    else if (k === "bigint") {
                      if (h < 9223372036854776e3 && h >= -9223372036854776e3)
                        ((d[f++] = 211), j.setBigInt64(f, h));
                      else if (h < 18446744073709552e3 && h > 0)
                        ((d[f++] = 207), j.setBigUint64(f, h));
                      else if (this.largeBigIntToFloat)
                        ((d[f++] = 203), j.setFloat64(f, Number(h)));
                      else {
                        if (this.largeBigIntToString) return W(h.toString());
                        if (this.useBigIntExtension || this.moreTypes) {
                          let S = h < 0 ? BigInt(-1) : BigInt(0),
                            E;
                          if (h >> BigInt(65536) === S) {
                            let M = BigInt(18446744073709552e3) - BigInt(1),
                              D = [];
                            for (; D.push(h & M), h >> BigInt(63) !== S; )
                              h >>= BigInt(64);
                            ((E = new Uint8Array(new BigUint64Array(D).buffer)),
                              E.reverse());
                          } else {
                            let M = h < 0,
                              D = (M ? ~h : h).toString(16);
                            if (
                              (D.length % 2
                                ? (D = "0" + D)
                                : parseInt(D.charAt(0), 16) >= 8 &&
                                  (D = "00" + D),
                              be)
                            )
                              E = Buffer.from(D, "hex");
                            else {
                              E = new Uint8Array(D.length / 2);
                              for (let O = 0; O < E.length; O++)
                                E[O] = parseInt(D.slice(O * 2, O * 2 + 2), 16);
                            }
                            if (M)
                              for (let O = 0; O < E.length; O++) E[O] = ~E[O];
                          }
                          (E.length + f > te && de(E.length + f),
                            (f = zt(E, d, f, 66)));
                          return;
                        } else
                          throw new RangeError(
                            h +
                              " was too large to fit in MessagePack 64-bit integer format, use useBigIntExtension, or set largeBigIntToFloat to convert to float-64, or set largeBigIntToString to convert to string",
                          );
                      }
                      f += 8;
                    } else if (k === "undefined")
                      this.encodeUndefinedAsNil
                        ? (d[f++] = 192)
                        : ((d[f++] = 212), (d[f++] = 0), (d[f++] = 0));
                    else throw new Error("Unknown type: " + k);
                  },
                  Zt =
                    this.variableMapSize ||
                    this.coercibleKeyAsNumber ||
                    this.skipValues
                      ? (h) => {
                          let k;
                          if (this.skipValues) {
                            k = [];
                            for (let E in h)
                              (typeof h.hasOwnProperty != "function" ||
                                h.hasOwnProperty(E)) &&
                                !this.skipValues.includes(h[E]) &&
                                k.push(E);
                          } else k = Object.keys(h);
                          let I = k.length;
                          I < 16
                            ? (d[f++] = 128 | I)
                            : I < 65536
                              ? ((d[f++] = 222),
                                (d[f++] = I >> 8),
                                (d[f++] = I & 255))
                              : ((d[f++] = 223), j.setUint32(f, I), (f += 4));
                          let S;
                          if (this.coercibleKeyAsNumber)
                            for (let E = 0; E < I; E++) {
                              S = k[E];
                              let M = Number(S);
                              (W(isNaN(M) ? S : M), W(h[S]));
                            }
                          else
                            for (let E = 0; E < I; E++)
                              (W((S = k[E])), W(h[S]));
                        }
                      : (h) => {
                          d[f++] = 222;
                          let k = f - n;
                          f += 2;
                          let I = 0;
                          for (let S in h)
                            (typeof h.hasOwnProperty != "function" ||
                              h.hasOwnProperty(S)) &&
                              (W(S), W(h[S]), I++);
                          if (I > 65535)
                            throw new Error(
                              'Object is too large to serialize with fast 16-bit map size, use the "variableMapSize" option to serialize this object',
                            );
                          ((d[k++ + n] = I >> 8), (d[k + n] = I & 255));
                        },
                  Qt =
                    this.useRecords === !1
                      ? Zt
                      : e.progressiveRecords && !re
                        ? (h) => {
                            let k,
                              I =
                                l.transitions ||
                                (l.transitions = Object.create(null)),
                              S = f++ - n,
                              E;
                            for (let M in h)
                              if (
                                typeof h.hasOwnProperty != "function" ||
                                h.hasOwnProperty(M)
                              ) {
                                if (((k = I[M]), k)) I = k;
                                else {
                                  let D = Object.keys(h),
                                    O = I;
                                  I = l.transitions;
                                  let N = 0;
                                  for (let V = 0, ce = D.length; V < ce; V++) {
                                    let he = D[V];
                                    ((k = I[he]),
                                      k ||
                                        ((k = I[he] = Object.create(null)),
                                        N++),
                                      (I = k));
                                  }
                                  (S + n + 1 == f
                                    ? (f--, ot(I, D, N))
                                    : er(I, D, S, N),
                                    (E = !0),
                                    (I = O[M]));
                                }
                                W(h[M]);
                              }
                            if (!E) {
                              let M = I[Se];
                              M ? (d[S + n] = M) : er(I, Object.keys(h), S, 0);
                            }
                          }
                        : (h) => {
                            let k,
                              I =
                                l.transitions ||
                                (l.transitions = Object.create(null)),
                              S = 0;
                            for (let M in h)
                              (typeof h.hasOwnProperty != "function" ||
                                h.hasOwnProperty(M)) &&
                                ((k = I[M]),
                                k || ((k = I[M] = Object.create(null)), S++),
                                (I = k));
                            let E = I[Se];
                            E
                              ? E >= 96 && re
                                ? ((d[f++] = ((E -= 96) & 31) + 96),
                                  (d[f++] = E >> 5))
                                : (d[f++] = E)
                              : ot(I, I.__keys__ || Object.keys(h), S);
                            for (let M in h)
                              (typeof h.hasOwnProperty != "function" ||
                                h.hasOwnProperty(M)) &&
                                W(h[M]);
                          },
                  Gt = typeof this.useRecords == "function" && this.useRecords,
                  Ye = Gt
                    ? (h) => {
                        Gt(h) ? Qt(h) : Zt(h);
                      }
                    : Qt,
                  Xt = (h) => {
                    let k = T._writeStruct(h, d, n, f, l, de, (I, S, E) => {
                      if (E) return (c = !0);
                      f = S;
                      let M = d;
                      return (
                        W(I),
                        Ht(),
                        M !== d ? { position: f, targetView: j, target: d } : f
                      );
                    });
                    if (k === 0) return Ye(h);
                    f = k;
                  },
                  de = (h) => {
                    let k;
                    if (h > 16777216) {
                      if (h - n > $t)
                        throw new Error(
                          "Packed buffer would be larger than maximum buffer size",
                        );
                      k = Math.min(
                        $t,
                        Math.round(
                          Math.max(
                            (h - n) * (h > 67108864 ? 1.25 : 2),
                            4194304,
                          ) / 4096,
                        ) * 4096,
                      );
                    } else
                      k =
                        ((Math.max((h - n) << 2, d.length - 1) >> 12) + 1) <<
                        12;
                    let I = new Je(k);
                    return (
                      (j =
                        I.dataView ||
                        (I.dataView = new DataView(I.buffer, 0, k))),
                      (h = Math.min(h, d.length)),
                      d.copy ? d.copy(I, 0, n, h) : I.set(d.slice(n, h)),
                      (f -= n),
                      (n = 0),
                      (te = I.length - 10),
                      (d = I)
                    );
                  },
                  ot = (h, k, I) => {
                    let S = l.nextId;
                    (S || (S = 64),
                      S < se &&
                      this.shouldShareStructure &&
                      !this.shouldShareStructure(k)
                        ? ((S = l.nextOwnId),
                          S < xe || (S = se),
                          (l.nextOwnId = S + 1))
                        : (S >= xe && (S = se), (l.nextId = S + 1)));
                    let E = (k.highByte = S >= 96 && re ? (S - 96) >> 5 : -1);
                    ((h[Se] = S),
                      (h.__keys__ = k),
                      (l[S - 64] = k),
                      S < se
                        ? ((k.isShared = !0),
                          (l.sharedLength = S - 63),
                          (c = !0),
                          E >= 0
                            ? ((d[f++] = (S & 31) + 96), (d[f++] = E))
                            : (d[f++] = S))
                        : (E >= 0
                            ? ((d[f++] = 213),
                              (d[f++] = 114),
                              (d[f++] = (S & 31) + 96),
                              (d[f++] = E))
                            : ((d[f++] = 212), (d[f++] = 114), (d[f++] = S)),
                          I && (st += We * I),
                          ae.length >= Z && (ae.shift()[Se] = 0),
                          ae.push(h),
                          W(k)));
                  },
                  er = (h, k, I, S) => {
                    let E = d,
                      M = f,
                      D = te,
                      O = n;
                    ((d = Oe),
                      (f = 0),
                      (n = 0),
                      d || (Oe = d = new Je(8192)),
                      (te = d.length - 10),
                      ot(h, k, S),
                      (Oe = d));
                    let N = f;
                    if (((d = E), (f = M), (te = D), (n = O), N > 1)) {
                      let V = f + N - 1;
                      V > te && de(V);
                      let ce = I + n;
                      (d.copyWithin(ce + N, ce + 1, f),
                        d.set(Oe.slice(0, N), ce),
                        (f = V));
                    } else d[I + n] = Oe[0];
                  };
              }
              useBuffer(e) {
                ((d = e),
                  d.dataView ||
                    (d.dataView = new DataView(
                      d.buffer,
                      d.byteOffset,
                      d.byteLength,
                    )),
                  (j = d.dataView),
                  (f = 0));
              }
              set position(e) {
                f = e;
              }
              get position() {
                return f;
              }
              clearSharedData() {
                (this.structures && (this.structures = []),
                  this.typedStructs && (this.typedStructs = []));
              }
            }
            ((qe = [
              Date,
              Set,
              Error,
              RegExp,
              ArrayBuffer,
              Object.getPrototypeOf(Uint8Array.prototype).constructor,
              DataView,
              p,
            ]),
              (Ke = [
                {
                  pack(t, e, n) {
                    let c = t.getTime() / 1e3;
                    if (
                      (this.useTimestamp32 || t.getMilliseconds() === 0) &&
                      c >= 0 &&
                      c < 4294967296
                    ) {
                      let { target: l, targetView: w, position: b } = e(6);
                      ((l[b++] = 214), (l[b++] = 255), w.setUint32(b, c));
                    } else if (c > 0 && c < 4294967296) {
                      let { target: l, targetView: w, position: b } = e(10);
                      ((l[b++] = 215),
                        (l[b++] = 255),
                        w.setUint32(
                          b,
                          t.getMilliseconds() * 4e6 +
                            ((c / 1e3 / 4294967296) >> 0),
                        ),
                        w.setUint32(b + 4, c));
                    } else if (isNaN(c)) {
                      if (this.onInvalidDate)
                        return (e(0), n(this.onInvalidDate()));
                      let { target: l, targetView: w, position: b } = e(3);
                      ((l[b++] = 212), (l[b++] = 255), (l[b++] = 255));
                    } else {
                      let { target: l, targetView: w, position: b } = e(15);
                      ((l[b++] = 199),
                        (l[b++] = 12),
                        (l[b++] = 255),
                        w.setUint32(b, t.getMilliseconds() * 1e6),
                        w.setBigInt64(b + 4, BigInt(Math.floor(c))));
                    }
                  },
                },
                {
                  pack(t, e, n) {
                    if (this.setAsEmptyObject) return (e(0), n({}));
                    let c = Array.from(t),
                      { target: l, position: w } = e(this.moreTypes ? 3 : 0);
                    (this.moreTypes &&
                      ((l[w++] = 212), (l[w++] = 115), (l[w++] = 0)),
                      n(c));
                  },
                },
                {
                  pack(t, e, n) {
                    let { target: c, position: l } = e(this.moreTypes ? 3 : 0);
                    (this.moreTypes &&
                      ((c[l++] = 212), (c[l++] = 101), (c[l++] = 0)),
                      n([t.name, t.message, t.cause]));
                  },
                },
                {
                  pack(t, e, n) {
                    let { target: c, position: l } = e(this.moreTypes ? 3 : 0);
                    (this.moreTypes &&
                      ((c[l++] = 212), (c[l++] = 120), (c[l++] = 0)),
                      n([t.source, t.flags]));
                  },
                },
                {
                  pack(t, e) {
                    this.moreTypes
                      ? nt(t, 16, e)
                      : it(be ? Buffer.from(t) : new Uint8Array(t), e);
                  },
                },
                {
                  pack(t, e) {
                    let n = t.constructor;
                    n !== jt && this.moreTypes
                      ? nt(t, Ft.indexOf(n.name), e)
                      : it(t, e);
                  },
                },
                {
                  pack(t, e) {
                    this.moreTypes
                      ? nt(t, 17, e)
                      : it(be ? Buffer.from(t) : new Uint8Array(t), e);
                  },
                },
                {
                  pack(t, e) {
                    let { target: n, position: c } = e(1);
                    n[c] = 193;
                  },
                },
              ]));
            function nt(t, e, n, c) {
              let l = t.byteLength;
              if (l + 1 < 256) {
                var { target: w, position: b } = n(4 + l);
                ((w[b++] = 199), (w[b++] = l + 1));
              } else if (l + 1 < 65536) {
                var { target: w, position: b } = n(5 + l);
                ((w[b++] = 200),
                  (w[b++] = (l + 1) >> 8),
                  (w[b++] = (l + 1) & 255));
              } else {
                var { target: w, position: b, targetView: T } = n(7 + l);
                ((w[b++] = 201), T.setUint32(b, l + 1), (b += 4));
              }
              ((w[b++] = 116),
                (w[b++] = e),
                t.buffer || (t = new Uint8Array(t)),
                w.set(new Uint8Array(t.buffer, t.byteOffset, t.byteLength), b));
            }
            function it(t, e) {
              let n = t.byteLength;
              var c, l;
              if (n < 256) {
                var { target: c, position: l } = e(n + 2);
                ((c[l++] = 196), (c[l++] = n));
              } else if (n < 65536) {
                var { target: c, position: l } = e(n + 3);
                ((c[l++] = 197), (c[l++] = n >> 8), (c[l++] = n & 255));
              } else {
                var { target: c, position: l, targetView: w } = e(n + 5);
                ((c[l++] = 198), w.setUint32(l, n), (l += 4));
              }
              c.set(t, l);
            }
            function zt(t, e, n, c) {
              let l = t.length;
              switch (l) {
                case 1:
                  e[n++] = 212;
                  break;
                case 2:
                  e[n++] = 213;
                  break;
                case 4:
                  e[n++] = 214;
                  break;
                case 8:
                  e[n++] = 215;
                  break;
                case 16:
                  e[n++] = 216;
                  break;
                default:
                  l < 256
                    ? ((e[n++] = 199), (e[n++] = l))
                    : l < 65536
                      ? ((e[n++] = 200), (e[n++] = l >> 8), (e[n++] = l & 255))
                      : ((e[n++] = 201),
                        (e[n++] = l >> 24),
                        (e[n++] = (l >> 16) & 255),
                        (e[n++] = (l >> 8) & 255),
                        (e[n++] = l & 255));
              }
              return ((e[n++] = c), e.set(t, n), (n += l), n);
            }
            function nn(t, e) {
              let n,
                c = e.length * 6,
                l = t.length - c;
              for (; (n = e.pop()); ) {
                let w = n.offset,
                  b = n.id;
                (t.copyWithin(w + c, w, l), (c -= 6));
                let T = w + c;
                ((t[T++] = 214),
                  (t[T++] = 105),
                  (t[T++] = b >> 24),
                  (t[T++] = (b >> 16) & 255),
                  (t[T++] = (b >> 8) & 255),
                  (t[T++] = b & 255),
                  (l = w));
              }
              return t;
            }
            function Kt(t, e, n) {
              if (q.length > 0) {
                (j.setUint32(q.position + t, f + n - q.position - t),
                  (q.stringsPosition = f - t));
                let c = q;
                ((q = null), e(c[0]), e(c[1]));
              }
            }
            function sn(t) {
              if (t.Class) {
                if (!t.pack && !t.write)
                  throw new Error("Extension has no pack or write function");
                if (t.pack && !t.type)
                  throw new Error(
                    "Extension has no type (numeric code to identify the extension)",
                  );
                (qe.unshift(t.Class), Ke.unshift(t));
              }
              Hr(t);
            }
            function an(t, e) {
              return (
                (t.isCompatible = (n) => {
                  let c = !n || (e.lastNamedStructuresLength || 0) === n.length;
                  return (c || e._mergeStructures(n), c);
                }),
                t
              );
            }
            Ee.SUPPORTS_STRUCT_HOOKS = !0;
            let qt = new Ee({ useRecords: !1 });
            const on = qt.pack,
              cn = qt.pack,
              ln = Ee,
              {
                NEVER: un,
                ALWAYS: fn,
                DECIMAL_ROUND: dn,
                DECIMAL_FIT: hn,
              } = Lt,
              Jt = 512,
              Wt = 1024,
              Yt = 2048;
            function wn(t, e = {}) {
              if (!t || typeof t != "object")
                throw new Error(
                  "first argument must be an Iterable, Async Iterable, or a Promise for an Async Iterable",
                );
              if (typeof t[Symbol.iterator] == "function") return gn(t, e);
              if (
                typeof t.then == "function" ||
                typeof t[Symbol.asyncIterator] == "function"
              )
                return xn(t, e);
              throw new Error(
                "first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a Promise",
              );
            }
            function* gn(t, e) {
              const n = new Ee(e);
              for (const c of t) yield n.pack(c);
            }
            async function* xn(t, e) {
              const n = new Ee(e);
              for await (const c of t) yield n.pack(c);
            }
            function yn(t, e = {}) {
              if (!t || typeof t != "object")
                throw new Error(
                  "first argument must be an Iterable, Async Iterable, Iterator, Async Iterator, or a promise",
                );
              const n = new C(e);
              let c;
              const l = (w) => {
                let b;
                c && ((w = Buffer.concat([c, w])), (c = void 0));
                try {
                  b = n.unpackMultiple(w);
                } catch (T) {
                  if (T.incomplete)
                    ((c = w.slice(T.lastPosition)), (b = T.values));
                  else throw T;
                }
                return b;
              };
              if (typeof t[Symbol.iterator] == "function")
                return (function* () {
                  for (const b of t) yield* l(b);
                })();
              if (typeof t[Symbol.asyncIterator] == "function")
                return (async function* () {
                  for await (const b of t) yield* l(b);
                })();
            }
            const mn = yn,
              pn = wn,
              bn = !1,
              Sn = !0;
            ((i.ALWAYS = fn),
              (i.C1 = _),
              (i.DECIMAL_FIT = hn),
              (i.DECIMAL_ROUND = dn),
              (i.Decoder = Zr),
              (i.Encoder = ln),
              (i.FLOAT32_OPTIONS = Lt),
              (i.NEVER = un),
              (i.Packr = Ee),
              (i.RESERVE_START_SPACE = Yt),
              (i.RESET_BUFFER_MODE = Wt),
              (i.REUSE_BUFFER_MODE = Jt),
              (i.Unpackr = C),
              (i.addExtension = sn),
              (i.clearSource = Ve),
              (i.decode = Xr),
              (i.decodeIter = mn),
              (i.encode = cn),
              (i.encodeIter = pn),
              (i.isNativeAccelerationEnabled = Ae),
              (i.mapsAsObjects = Sn),
              (i.pack = on),
              (i.roundFloat32 = en),
              (i.unpack = Qr),
              (i.unpackMultiple = Gr),
              (i.useRecords = bn));
          });
        })(Ie, Ie.exports)),
      Ie.exports
    );
  }
  var bt = Or();
  const Rr = "application/json",
    St = "application/vnd.msgpack",
    Et = { useRecords: !0, bundleStrings: !0 },
    Ur = new bt.Packr(Et),
    Mr = new bt.Unpackr(Et);
  function Dr(s) {
    return Ur.pack(s);
  }
  function Br(s) {
    const a =
      s instanceof ArrayBuffer
        ? new Uint8Array(s)
        : new Uint8Array(s.buffer, s.byteOffset, s.byteLength);
    return Mr.unpack(a);
  }
  const Fe = { maxRetries: 5, baseDelay: 500, maxDelay: 1e4, shouldRetry: Vr };
  async function Pr({ url: s, edition: a, ...i }) {
    const u =
        a === "lark" ? "https://open.larksuite.com" : "https://open.feishu.cn",
      o = await fetch(s).then((L) => L.blob());
    if (o.size < 20971520)
      return await Pe(() => Fr({ ...i, baseUrl: u, file: o }), Fe);
    const {
      upload_id: g,
      block_size: r,
      block_num: y,
    } = await Pe(() => Cr({ ...i, baseUrl: u, size: o.size }), Fe);
    let v = 0,
      P = 0;
    for (; v < o.size; ) {
      const L = v + r,
        $ = o.slice(v, L),
        ee = P++;
      (await Pe(
        () =>
          Lr({
            upload_id: g,
            baseUrl: u,
            file_name: i.file_name,
            seq: ee,
            file: $,
            token: i.token,
          }),
        Fe,
      ),
        (v = L));
    }
    return await Pe(
      () => Nr({ upload_id: g, baseUrl: u, block_num: y, token: i.token }),
      Fe,
    );
  }
  async function Fr(s) {
    const a = `${s.baseUrl}/open-apis/drive/v1/medias/upload_all`,
      i = new AbortController(),
      u = new FormData();
    (u.append("file_name", s.file_name),
      u.append("parent_type", s.parent_type),
      u.append("parent_node", s.parent_node),
      u.append("size", s.file.size.toString()),
      u.append("file", s.file, s.file_name));
    const o = setTimeout(() => i.abort(), 12e4),
      g = await fetch(a, {
        method: "POST",
        signal: i.signal,
        body: u,
        headers: { Authorization: `Bearer ${s.token}` },
      }).finally(() => clearTimeout(o));
    return Ce(g);
  }
  async function Cr({ token: s, baseUrl: a, ...i }) {
    const u = `${a}/open-apis/drive/v1/medias/upload_prepare`,
      o = new AbortController(),
      g = setTimeout(() => o.abort(), 6e4),
      r = await fetch(u, {
        method: "POST",
        signal: o.signal,
        body: JSON.stringify(i),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${s}`,
        },
      }).finally(() => clearTimeout(g));
    return Ce(r);
  }
  async function Lr(s) {
    const a = `${s.baseUrl}/open-apis/drive/v1/medias/upload_part`,
      i = new AbortController(),
      u = new FormData();
    (u.append("upload_id", s.upload_id),
      u.append("seq", s.seq.toString()),
      u.append("size", s.file.size.toString()),
      u.append("file", s.file, s.file_name));
    const o = setTimeout(() => i.abort(), 6e4),
      g = await fetch(a, {
        method: "POST",
        signal: i.signal,
        body: u,
        headers: { Authorization: `Bearer ${s.token}` },
      }).finally(() => clearTimeout(o));
    return Ce(g);
  }
  async function Nr({ token: s, baseUrl: a, ...i }) {
    const u = `${a}/open-apis/drive/v1/medias/upload_finish`,
      o = new AbortController(),
      g = setTimeout(() => o.abort(), 6e4),
      r = await fetch(u, {
        method: "POST",
        signal: o.signal,
        body: JSON.stringify(i),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `Bearer ${s}`,
        },
      }).finally(() => clearTimeout(g));
    return Ce(r);
  }
  class Xe extends Error {
    constructor(i, u) {
      super(i);
      ct(this, "code");
      ct(this, "httpStatus");
      ((this.name = "FeishuUploadError"),
        (this.code = u == null ? void 0 : u.code),
        (this.httpStatus = u == null ? void 0 : u.httpStatus));
    }
  }
  function Vr(s) {
    return (s instanceof DOMException && s.name === "AbortError") ||
      s instanceof TypeError
      ? !0
      : !(
          !(s instanceof Xe) ||
          (s.code &&
            [99991663, 1061002, 1061003, 1061101, 1061073].includes(s.code))
        );
  }
  async function Ce(s) {
    let a;
    try {
      a = await s.json();
    } catch {
      throw new Xe(
        s.statusText ||
          "\u98DE\u4E66\u7D20\u6750\u4E0A\u4F20\u63A5\u53E3\u54CD\u5E94\u683C\u5F0F\u5F02\u5E38",
        { httpStatus: s.status },
      );
    }
    const { code: i, msg: u, error: o, data: g } = a;
    if (!s.ok || i !== 0) {
      let r = "\u6587\u4EF6\u9884\u4E0A\u4F20\u5931\u8D25";
      throw (
        typeof o == "string"
          ? (r = o)
          : typeof (o == null ? void 0 : o.message) == "string"
            ? (r = o.message)
            : typeof u == "string" && (r = u),
        new Xe(r, { code: i, httpStatus: s.status })
      );
    }
    return g;
  }
  function jr() {
    (ie("openSidepanel", ({ sender: s }) => {
      var a, i, u, o;
      return !((a = s == null ? void 0 : s.tab) != null && a.windowId) ||
        !((i = R.sidePanel) != null && i.open)
        ? !1
        : R.sidePanel
            .open({
              tabId: (u = s.tab) == null ? void 0 : u.id,
              windowId: (o = s.tab) == null ? void 0 : o.windowId,
            })
            .then(() => !0);
    }),
      ie("apiRequest", async ({ data: s }) => {
        if (!s || !s.url) throw new Error("url is required");
        return { data: {}, status: 200, statusText: "OK" };
      }),
      ie("feishuRequest", () =>
        Promise.reject(new Error("已移除飞书同步")),
      ),
      ie("feishuUpload", () =>
        Promise.reject(new Error("已移除飞书同步")),
      ),
      ie("downloadFile", async ({ data: s }) => {
        const { backupUrls: a, ...i } = s;
        return mr(i, a);
      }),
      ie("getAuthToken", () => Promise.resolve("")),
      ie("cleanTaskAlarm", ({ data: s }) => R.alarms.clear(s)),
      ie("createTab", ({ data: s }) => R.tabs.create(s)),
      ie("uninstallSelf", () =>
        R.management.uninstallSelf({ showConfirmDialog: !0 }),
      ),
      ie("fetch", async ({ data: s }) => {
        var P, B;
        const { url: a, responseType: i, rejectOnHttpError: u = !1, ...o } = s;
        if (!a) return;
        const g = await fetch(a, o);
        if (u && !g.ok)
          throw new Error(`Request failed with status code ${g.status}`);
        if (i === "url") return g.url;
        if (i === "json") return g.json();
        if (i === "text") return g.text();
        if (g.status === 204) return null;
        const r =
            ((B = (P = g.headers) == null ? void 0 : P.get) == null
              ? void 0
              : B.call(P, "content-type")) || "",
          y = await g.arrayBuffer(),
          v = new TextDecoder("utf-8").decode(y);
        return /[/+]json\b/i.test(r) ? JSON.parse(v) : v;
      }),
      ie("getWindowValue", async ({ data: s, sender: a }) => {
        var u, o;
        if (!((u = a == null ? void 0 : a.tab) != null && u.id)) return;
        const i = await chrome.scripting.executeScript({
          target: { tabId: a.tab.id },
          world: "MAIN",
          func: (g) => {
            let r = {};
            e: for (let [y, v] of Object.entries(g)) {
              let P = window;
              for (let B of v) {
                if (P == null || P == null) {
                  r[y] = void 0;
                  continue e;
                }
                P = P[B];
              }
              r[y] = P;
            }
            return r;
          },
          args: [s],
        });
        return (o = i == null ? void 0 : i[0]) == null ? void 0 : o.result;
      }),
      Promise.resolve().then(() => qr),
      Promise.resolve().then(() => Jr));
  }
  const $r = me({
    main: () => {
      var s, a, i, u, o, g, r;
      ((s = R.sidePanel) != null && s.setPanelBehavior
        ? R.sidePanel
            .setPanelBehavior({ openPanelOnActionClick: !0 })
            .catch((y) => console.error(y))
        : R.action.onClicked.addListener(async (y) => {
            R.sidePanel
              .open({ tabId: y.id, windowId: y.windowId })
              .catch((v) => console.error(v));
          }),
        R.sidePanel.onClosed &&
          ((a = R.sidePanel.onClosed) == null ||
            a.addListener(({ windowId: y }) => fr(y))),
        (r =
          (u =
            (i = chrome == null ? void 0 : chrome.storage) == null
              ? void 0
              : i.session) == null
            ? void 0
            : u.setAccessLevel) == null ||
          r.call(u, {
            accessLevel:
              (g =
                (o = chrome == null ? void 0 : chrome.storage) == null
                  ? void 0
                  : o.AccessLevel) == null
                ? void 0
                : g.TRUSTED_AND_UNTRUSTED_CONTEXTS,
          }),
        R.runtime.onInstalled.addListener(() =>
          lr().catch((y) => {
            console.error(y);
          }),
        ),
        jr(),
        Ar());
    },
  });
  function In() {}
  function Le(s, ...a) {}
  const zr = {
    debug: (...s) => Le(console.debug, ...s),
    log: (...s) => Le(console.log, ...s),
    warn: (...s) => Le(console.warn, ...s),
    error: (...s) => Le(console.error, ...s),
  };
  let et;
  try {
    ((et = $r.main()),
      et instanceof Promise &&
        console.warn(
          "The background's main() function return a promise, but it must be synchronous",
        ));
  } catch (s) {
    throw (zr.error("The background crashed on startup!"), s);
  }
  var Kr = et;
  ie("xtEntranceAuthorInfo", async ({ data: s }) => {
    var o, g;
    if (!s || typeof s != "string") throw new Error("core_user_id is required");
    const a = `https://www.xingtu.cn/gw/api/author/entrance/author/info?core_user_id=${s}`,
      u = await (await fetch(a)).json();
    if (((o = u.base_resp) == null ? void 0 : o.status_code) !== 0)
      throw new Error(
        ((g = u.base_resp) == null ? void 0 : g.status_message) ||
          "unknown error",
      );
    return u;
  });
  const qr = Object.freeze(
    Object.defineProperty({ __proto__: null }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
  ie("ksFetchProfileUser", ({ data: s }) =>
    fetch("https://www.kuaishou.com/rest/v/profile/user", {
      method: "POST",
      body: JSON.stringify({ user_id: s.userId }),
      headers: { "Content-Type": "application/json" },
    }).then((a) => a.json()),
  );
  const Jr = Object.freeze(
    Object.defineProperty({ __proto__: null }, Symbol.toStringTag, {
      value: "Module",
    }),
  );
  return Kr;
})();
