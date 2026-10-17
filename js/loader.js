/* 芯片加载器：按清单顺序动态注入数据文件 <script>，并逐文件对账注册结果
   （零依赖；动态注入不是 fetch，file:// 下不受 CORS 限制）
   浏览器：加载本文件即启动，产出 window.CHIP_LOAD_PROMISE
   Node：可直接 require，用于测试纯逻辑 classify */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.CPP = root.CPP || {};
    root.CPP.Loader = api;
    if (root.document && root.CHIP_MANIFEST) {
      root.CHIP_LOAD_PROMISE = api.loadAll(root.CHIP_MANIFEST, root.CHIP_REGISTRY || []);
    }
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 纯函数：把一个文件的注入结果归类（Node 可测）
  // outcome = { loadError: true }，或 { added: [def, ...] }（added = 注入前后注册表长度差）
  function classify(file, outcome) {
    if (outcome && outcome.loadError) return { file: file, reason: "文件加载失败" };
    var added = ((outcome && outcome.added) || []).filter(Boolean);
    if (!added.length) return { file: file, reason: "加载成功但未注册数据" };
    return { file: file, def: added[added.length - 1], extra: Math.max(0, added.length - 1) };
  }

  // 浏览器：顺序注入（保证"注册顺序 = 清单顺序"，且每个文件的产出可精确归属）
  function loadAll(manifest, registry) {
    function injectOne(file) {
      return new Promise(function (resolve) {
        var n0 = registry.length;
        var s = document.createElement("script");
        s.src = file;
        s.onload = function () { resolve(classify(file, { added: registry.slice(n0) })); };
        s.onerror = function () { resolve(classify(file, { loadError: true })); };
        document.head.appendChild(s);
      });
    }
    return manifest.reduce(function (p, file) {
      return p.then(function (acc) {
        return injectOne(file).then(function (r) { acc.push(r); return acc; });
      });
    }, Promise.resolve([]));
  }

  // 纯函数：把加载结果整理成芯片条目（Node 可测；校验、置灰原因、id 唯一性都在这里）
  function buildChips(results, Model) {
    var chips = (results || []).map(function (r) {
      var c = { file: r.file, def: r.def || null, ok: false, reason: r.reason || "", errors: [], chipId: "",
                extra: r.extra || 0 };
      if (!c.def) {
        if (!c.reason) c.reason = "加载成功但未注册数据";
        return c;
      }
      var v = Model.validateChip(c.def);
      if (!v.ok) {
        c.errors = v.errors;
        c.def = null;
        c.reason = v.errors.some(function (e) { return e.indexOf("schemaVersion") >= 0; })
          ? "需要更新版本的工具" : "数据校验失败";
        return c;
      }
      c.ok = true;
      c.chipId = Model.chipId(c.def);
      return c;
    });
    // id 唯一性：后出现的冲突者置灰（不静默覆盖）
    var okDefs = [], okIdx = [];
    chips.forEach(function (c, i) { if (c.ok) { okDefs.push(c.def); okIdx.push(i); } });
    Model.duplicateIdIndex(okDefs).forEach(function (d) {
      var i = okIdx[d.index];
      chips[i].ok = false;
      chips[i].reason = "id 与 " + chips[okIdx[d.firstIndex]].def.chip.name + " 冲突";
    });
    return chips;
  }

  return { classify: classify, loadAll: loadAll, buildChips: buildChips };
});
