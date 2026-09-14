window.__moyaclawCollect = {
  version: "1",
  ready: true,
  runTask: function (type, condition, skipNavigate, path) {
    return dr.getState().runTask(type, condition, skipNavigate, path);
  },
  getTaskSnapshot: function () {
    var t = dr.getState().task;
    if (!t) return null;
    var total = 0,
      completed = 0,
      dataLength = 0;
    try {
      total = t.getTotal();
    } catch (e) {}
    try {
      completed = t.getCompleted();
    } catch (e) {}
    try {
      dataLength = t.getData(true).length;
    } catch (e) {}
    return {
      type: t.type,
      name: t.name,
      status: t.status,
      path: t.path,
      total: total,
      completed: completed,
      dataLength: dataLength,
    };
  },
  getUser: function () {
    try {
      var u = ea.getState().user;
      if (!u) return { loggedIn: false };
      return {
        loggedIn: true,
        id: u.id,
        name: u.name,
        isVip: !!u.isVip,
      };
    } catch (e) {
      return { loggedIn: false, error: String((e && e.message) || e) };
    }
  },
  getPlatformAccount: function () {
    try {
      var s = xo.getState();
      return { status: s.status, account: s.account || null };
    } catch (e) {
      return {
        status: "unknown",
        account: null,
        error: String((e && e.message) || e),
      };
    }
  },
  getPlatform: function () {
    return window.platform
      ? {
          code: window.platform.code,
          name: window.platform.name,
          origin: window.platform.origin,
        }
      : null;
  },
  navigate: function (to, opts) {
    window.__qeNavTo = to;
    return window.router.navigate(to, opts || {});
  },
  refreshAuth: function () {
    var userRefresh =
      ea.getState().refresh && ea.getState().refresh();
    var platformRefresh =
      xo.getState().refresh && xo.getState().refresh();
    return Promise.allSettled([
      Promise.resolve(userRefresh),
      Promise.resolve(platformRefresh),
    ]);
  },
};
