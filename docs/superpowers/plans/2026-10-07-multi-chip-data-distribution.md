# 多芯片支持与数据分发 实施计划（子项目 #1）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 规划器从"单芯片专用"变为"一个包带 N 颗芯片"：清单驱动加载、顶栏下拉切换、每芯片状态会话内互不干扰、工程文件记录芯片；`index.html` 从此不再因新增芯片而改动。

**Architecture:** 沿用已 spike 验证的机制（原文在 `tmp\chip-pin-planner-spike-20261007\`，验收后删除）：`chips/manifest.js` 清单 → `js/loader.js` 顺序注入 `<script>` 并逐文件对账 → 数据文件 UMD 自注册 `CHIP_REGISTRY` → `js/app.js` 异步引导、按 `chipId` 分桶状态、下拉切换。引擎侧新增版本闸门（≤ 上限）与 `chipId / duplicateIdIndex` 纯函数；导出器新增 `readProjectChipId` 供导入路由。

**Tech Stack:** 原生 JS（ES5 风格，UMD-lite）；Node 断言式单测（`tests/engine.test.js`，追加式为三个新小节）；agent-browser 真实浏览器验收（`file://`）。

**Spec:** `docs/superpowers/specs/2026-10-07-multi-chip-data-distribution-design.md`

## Global Constraints（每个任务都隐含适用）

- **file:// 双击即用**：禁 fetch 本地文件、禁 ES modules；所有浏览器侧改动必须在 `file://` 下工作。
- **零依赖零构建**；js/ 文件保持 UMD-lite（浏览器挂 `window.CPP.*`；数据文件 push `CHIP_REGISTRY`；Node 侧 `module.exports` 供 require）。
- **回归零容忍**：`node tests/engine.test.js`（现有 91 项，逐步增至 104）与 `node tests/fuzz.js` 必须保持全绿。
- 展示名 = `name · package`（中间是空格·空格）；置灰项文案 = `⚠ 文件名 —— 原因`。
- 状态语义：会话内各芯片隔离、刷新即清空、不弹确认、不做持久化。
- 本次之后，**新增芯片不得再改 `index.html`**。
- 启动日志改为 `就绪（v1.5）：…`；界面文案中文。
- 提交风格沿用仓库历史：`feat:/fix:/test:/docs:` 前缀 + 英文短描述。
- 按仓库惯例**直接在 master 上提交**（不建分支/worktree）。

## Review Focus（五类易漏边界——spec 隐含、必须被测试钉死）

1. 清单指向不存在/语法坏的文件 → 只置灰该项、原因可读、其他芯片照常（Task 2 单测 + Task 5 浏览器矩阵）。
2. 两颗芯片 `chipId` 相同 → 后出现者置灰"id 与 X 冲突"，不静默覆盖（Task 1 单测 + Task 5 浏览器矩阵）。
3. `schemaVersion` 高于引擎上限 → 置灰"需要更新版本的工具"；≤ 上限正常（Task 1 单测 + Task 5 浏览器矩阵）。
4. 旧工程文件（无 `chipId`）→ 仍可导入（Task 4 单测 + Task 4 浏览器步骤）。
5. 工程引用的芯片不在包内 → 明确报错（log 可读），当前状态不被改动（Task 4 代码分支 + Task 4 浏览器步骤）。

### 文件结构

| 操作 | 路径 | 职责 |
|---|---|---|
| Create | `chips/manifest.js` | 芯片清单（顺序 = 下拉序） |
| Create | `js/loader.js` | 顺序注入 + 逐文件对账（含 Node 可测纯函数 `classify`） |
| Modify | `js/engine/model.js` | 版本闸门 ≤ 上限；`chipId` / `duplicateIdIndex` / `ENGINE_SCHEMA_MAX` |
| Modify | `js/engine/exporters.js` | 工程 JSON 带 `chipId`；新增 `readProjectChipId` |
| Modify | `js/app.js` | 多芯片引导 / 下拉 / 切换 / 状态分桶 / 导入路由 |
| Modify | `index.html` | 加 `<select id="chip-select">`；数据 script 标签换成 manifest+loader |
| Modify | `chips/wch-ch582m-qfn48.js` | 显式 `id: "ch582m-qfn48"` |
| Modify | `tests/engine.test.js` | 追加三个测试小节（均插在文末汇总行之前） |

---

## Task 1: 引擎 —— 版本闸门 + chipId 助手

**Files:**
- Modify: `js/engine/model.js`
- Modify: `chips/wch-ch582m-qfn48.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `Model.ENGINE_SCHEMA_MAX`（number，当前 = 1）、`Model.chipId(def) → string`、`Model.duplicateIdIndex(defs) → [{ index, id, firstIndex }]`；校验错误文案含 `需要更新版本的工具`。
- 约束：`chipId` 的输出即"状态桶键"与"工程文件 chipId"，后续任务直接消费。

- [ ] **Step 1: 写失败测试**

在 `tests/engine.test.js` 末尾汇总行 `console.log("\n" + pass + ...` **之前**插入：

```js
console.log("\n=== v1.5-1: 版本闸门 / id / chipId ===");
t("ENGINE_SCHEMA_MAX 导出且为 1", () => {
  assert.strictEqual(Model.ENGINE_SCHEMA_MAX, 1);
});
t("validateChip: schemaVersion=99 被拒且提示更新工具", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.schemaVersion = 99;
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("更新版本的工具")), r.errors.join("; "));
});
t("validateChip: schemaVersion 0 / 非数字被拒", () => {
  const a = JSON.parse(JSON.stringify(miniChip)); a.schemaVersion = 0;
  const b = JSON.parse(JSON.stringify(miniChip)); b.schemaVersion = "1";
  assert.strictEqual(Model.validateChip(a).ok, false);
  assert.strictEqual(Model.validateChip(b).ok, false);
});
t("validateChip: id 若提供必须是非空字符串", () => {
  const a = JSON.parse(JSON.stringify(miniChip)); a.id = "";
  const b = JSON.parse(JSON.stringify(miniChip)); b.id = 7;
  assert.strictEqual(Model.validateChip(a).ok, false);
  assert.strictEqual(Model.validateChip(b).ok, false);
});
t("chipId: 显式 id 优先；缺省 = name+package 的 slug", () => {
  assert.strictEqual(Model.chipId(miniChip), "mini-qfn8");
  const withId = JSON.parse(JSON.stringify(miniChip)); withId.id = "my-chip";
  assert.strictEqual(Model.chipId(withId), "my-chip");
  assert.strictEqual(Model.chipId({ chip: { name: "CH582M", package: "QFN48" } }), "ch582m-qfn48");
});
t("duplicateIdIndex: 报出后出现的重复者", () => {
  const a = JSON.parse(JSON.stringify(miniChip));
  const b = JSON.parse(JSON.stringify(miniChip)); b.chip.name = "MINI2";
  const c = JSON.parse(JSON.stringify(miniChip));
  assert.deepStrictEqual(Model.duplicateIdIndex([a, b, c]),
    [{ index: 2, id: "mini-qfn8", firstIndex: 0 }]);
  assert.deepStrictEqual(Model.duplicateIdIndex([a, b]), []);
});
t("真实数据文件：id 显式声明为 ch582m-qfn48", () => {
  const CHIP = require("../chips/wch-ch582m-qfn48.js");
  assert.strictEqual(CHIP.id, "ch582m-qfn48");
  assert.strictEqual(Model.chipId(CHIP), "ch582m-qfn48");
});
```

- [ ] **Step 2: 运行确认按预期失败**

Run: `node tests/engine.test.js 2>&1 | tail -10`
Expected: 新小节出现多条 FAIL（`Model.ENGINE_SCHEMA_MAX` undefined、`Model.chipId` 不是函数等）。

- [ ] **Step 3: 实现 model.js（三处修改）**

3a. 在 `"use strict";`（第 7 行）之后插入常量：

```js
  var ENGINE_SCHEMA_MAX = 1;   // 引擎支持的数据 schema 上限（更高版本的数据需要更新版本的工具）
```

3b. 把第 12 行 `if (def.schemaVersion !== 1) errors.push("schemaVersion 必须为 1");` 替换为：

```js
    if (typeof def.schemaVersion !== "number" || def.schemaVersion < 1 || def.schemaVersion > ENGINE_SCHEMA_MAX) {
      errors.push("schemaVersion " + def.schemaVersion + " 不被支持（引擎支持上限 " + ENGINE_SCHEMA_MAX +
                  "；更高版本的数据需要更新版本的工具）");
    }
    if (def.id !== undefined && (typeof def.id !== "string" || !def.id)) {
      errors.push("id 若提供必须是非空字符串");
    }
```

3c. 在 `return { validateChip: validateChip };` 之前插入两个函数，并把该行替换为新的 return：

```js
  // 芯片唯一标识：显式 id 优先；缺省回落 name+package 的 slug（兼容未升级的老数据文件）
  function chipId(def) {
    if (def && typeof def.id === "string" && def.id) return def.id;
    var name = (def && def.chip && def.chip.name) || "";
    var pkg = (def && def.chip && def.chip.package) || "";
    var slug = (name + "-" + pkg).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || "chip";
  }
  // 返回"后出现的重复 id"列表（[] = 无冲突）；供加载端把冲突者置灰
  function duplicateIdIndex(defs) {
    var seen = {}, out = [];
    (defs || []).forEach(function (d, i) {
      if (!d) return;
      var id = chipId(d);
      if (Object.prototype.hasOwnProperty.call(seen, id)) out.push({ index: i, id: id, firstIndex: seen[id] });
      else seen[id] = i;
    });
    return out;
  }

  return { validateChip: validateChip, chipId: chipId, duplicateIdIndex: duplicateIdIndex,
           ENGINE_SCHEMA_MAX: ENGINE_SCHEMA_MAX };
```

- [ ] **Step 4: 数据文件加显式 id**

`chips/wch-ch582m-qfn48.js` 中：

```
  return {
    schemaVersion: 1,
```
改为
```
  return {
    schemaVersion: 1,
    id: "ch582m-qfn48",
```

- [ ] **Step 5: 运行确认全绿**

Run: `node tests/engine.test.js 2>&1 | tail -1`
Expected: `98 passed, 0 failed`

- [ ] **Step 6: Commit**

```bash
git add js/engine/model.js chips/wch-ch582m-qfn48.js tests/engine.test.js
git commit -m "feat: engine schema gate <= max + chipId helpers + explicit chip id"
```

---

## Task 2: 加载器 js/loader.js

**Files:**
- Create: `js/loader.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `Loader.classify(file, outcome) → { file, def?, reason?, extra? }`（`outcome = { loadError: true } | { added: [def,...] }`）；`Loader.loadAll(manifest, registry) → Promise<entry[]>`。
- 浏览器副作用：脚本被 `<script>` 加载时即自启动，产出 `window.CHIP_LOAD_PROMISE = loadAll(CHIP_MANIFEST, CHIP_REGISTRY)`；Node require 无副作用。

- [ ] **Step 1: 写失败测试**

在 `tests/engine.test.js` 汇总行之前插入：

```js
console.log("\n=== v1.5-2: loader 对账归类 ===");
const Loader = require("../js/loader.js");
t("classify: 文件加载失败", () => {
  const r = Loader.classify("chips/x.js", { loadError: true });
  assert.strictEqual(r.reason, "文件加载失败");
  assert.strictEqual(r.def, undefined);
});
t("classify: 加载成功但未注册数据", () => {
  const r = Loader.classify("chips/x.js", { added: [] });
  assert.strictEqual(r.reason, "加载成功但未注册数据");
});
t("classify: 正常注册取最后一个 def，多余产出记录在 extra", () => {
  const r = Loader.classify("chips/x.js", { added: [{ id: "a" }, { id: "b" }] });
  assert.strictEqual(r.def.id, "b");
  assert.strictEqual(r.extra, 1);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `node tests/engine.test.js 2>&1 | tail -8`
Expected: `Cannot find module '../js/loader.js'`（进程在该 require 处抛错退出）。

- [ ] **Step 3: 实现 js/loader.js（全文）**

```js
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
    var added = (outcome && outcome.added) || [];
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

  return { classify: classify, loadAll: loadAll };
});
```

- [ ] **Step 4: 运行确认全绿**

Run: `node tests/engine.test.js 2>&1 | tail -1`
Expected: `101 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/loader.js tests/engine.test.js
git commit -m "feat: chip loader (manifest + ordered script injection + per-file reconcile)"
```

---

## Task 3: 多芯片 UI —— manifest + index.html + app.js

**Files:**
- Create: `chips/manifest.js`
- Modify: `index.html`
- Modify: `js/app.js`
- 验证用临时文件（步骤内创建、结束前删除，**不入库**）：`chips/_tmp-demo.js`、manifest 临时行

**Interfaces:**
- Consumes: `window.CHIP_LOAD_PROMISE`（Task 2）、`Model.chipId` / `Model.duplicateIdIndex` / `Model.validateChip`（Task 1）、`Availability.createHistory` / `Availability.defaultState`（既有）。
- Produces: 应用内 `chips` 数组（元素 `{ file, def, ok, reason, errors, chipId }`）；`activateChip(idx, silent)`；`histories[chipId]` 状态桶；页面下拉 `#chip-select`。Task 4 的导入路由消费 `chips` / `activateChip` / `histories`。

- [ ] **Step 1: 记录"失败态"（当前没有选择器）**

Run:
```bash
agent-browser --session cpp open "file:///D:/Code_Project/chip-pin-planner/index.html"
agent-browser --session cpp get count "#chip-select"
```
Expected: `0`。（首次 open 可能冷启动较慢；超时就把同一条命令再跑一次。）

- [ ] **Step 2: 创建 chips/manifest.js**

```js
/* 芯片清单：新增一颗芯片 = 放入数据文件 + 本清单加一行（顺序即下拉框顺序） */
window.CHIP_MANIFEST = [
  "chips/wch-ch582m-qfn48.js"
];
```

- [ ] **Step 3: 修改 index.html（两处）**

3a. 顶栏标题后插入下拉（`<span id="app-title">` 那行下方）：

```html
    <select id="chip-select" title="切换芯片（会话内各芯片配置互相独立；刷新即清空）" style="margin-left:10px"></select>
```

3b. 把 `<script src="chips/wch-ch582m-qfn48.js"></script>` 一行替换为：

```html
  <script src="chips/manifest.js"></script>
  <script src="js/loader.js"></script>
```

- [ ] **Step 4: 修改 js/app.js（两处）**

4a. 文件头部（原第 4-14 行，从 `var CPP = window.CPP;` 到 `var menuEl = null;`）整体替换为：

```js
  var CPP = window.CPP;
  var def = null;       // 当前芯片定义（切换时重赋，闭包内函数动态读取）
  var history = null;   // 当前芯片的撤销历史（切换时重赋）
  var histories = {};   // chipId -> 该芯片的会话内状态（状态隔离：互不干扰、刷新即清）
  var chips = [];       // 加载结果 [{file, def, ok, reason, errors, chipId}]
  var activeIdx = -1;
  var svgEl = null;
  var menuEl = null;

  // ---------- 多芯片：加载结果 / 下拉选择器 / 切换 ----------
  function chipLabel(c) { return c.def.chip.name + " · " + c.def.chip.package; }
  function updateChipSelect() {
    var sel = document.getElementById("chip-select");
    if (!sel) return;
    sel.innerHTML = "";
    chips.forEach(function (c, i) {
      var opt = document.createElement("option");
      opt.value = String(i);
      if (c.ok) {
        opt.textContent = chipLabel(c);
        if (i === activeIdx) opt.selected = true;
      } else {
        opt.textContent = "⚠ " + c.file.split("/").pop() + " —— " + c.reason;
        opt.disabled = true;
      }
      sel.appendChild(opt);
    });
  }
  function activateChip(idx, silent) {
    activeIdx = idx;
    def = chips[idx].def;
    if (!histories[chips[idx].chipId]) {
      histories[chips[idx].chipId] = CPP.Availability.createHistory(CPP.Availability.defaultState(def));
    }
    history = histories[chips[idx].chipId];
    svgEl = null;  // 触发封装图按新芯片重建
    closeMenu();
    updateChipSelect();
    redraw();
    if (!silent) log("已切换到 " + chipLabel(chips[idx]) + "；本会话里该芯片的配置已保留（刷新即清空）");
  }
  function boot(results) {
    chips = results.map(function (r) {
      var c = { file: r.file, def: r.def || null, ok: false, reason: r.reason || "", errors: [], chipId: "" };
      if (c.def) {
        var v = CPP.Model.validateChip(c.def);
        if (!v.ok) { c.reason = "数据校验失败"; c.errors = v.errors; c.def = null; }
        else { c.ok = true; c.chipId = CPP.Model.chipId(c.def); }
      }
      return c;
    });
    // id 唯一性：后出现的冲突者置灰（不静默覆盖）
    var okDefs = [], okIdx = [];
    chips.forEach(function (c, i) { if (c.ok) { okDefs.push(c.def); okIdx.push(i); } });
    CPP.Model.duplicateIdIndex(okDefs).forEach(function (d) {
      var i = okIdx[d.index];
      chips[i].ok = false;
      chips[i].reason = "id 与 " + chips[okIdx[d.firstIndex]].def.chip.name + " 冲突";
    });
    var bad = chips.filter(function (c) { return !c.ok; });
    bad.forEach(function (c) { console.warn("[chips] " + c.file + " 不可用：" + c.reason, c.errors); });
    var sel = document.getElementById("chip-select");
    if (sel) sel.addEventListener("change", function () { activateChip(Number(sel.value)); });
    var firstOk = null;
    for (var i = 0; i < chips.length; i++) { if (chips[i].ok) { firstOk = i; break; } }
    if (firstOk === null) {
      document.body.innerHTML = "<pre>没有可用的芯片数据：\n" + chips.map(function (c) {
        return c.file + " — " + c.reason + (c.errors.length ? "\n  " + c.errors.join("\n  ") : "");
      }).join("\n") + "</pre>";
      return;
    }
    activateChip(firstOk, true);
    log("就绪（v1.5）：可用芯片 " + (chips.length - bad.length) + " 颗" +
        (bad.length ? "，不可用 " + bad.length + " 颗（下拉框中已标灰）" : "") + "。");
  }
```

4b. 文件尾部（`redraw(); log("就绪（v1.4）…");` 两行）替换为：

```js
  // ---------- 启动：等芯片清单全部加载完成（js/loader.js 产出 CHIP_LOAD_PROMISE） ----------
  if (window.CHIP_LOAD_PROMISE) {
    window.CHIP_LOAD_PROMISE.then(boot);
  } else {
    // 兜底：无清单时按注册表顺序直接启动（兼容旧单芯片路径）
    boot((window.CHIP_REGISTRY || []).map(function (d, i) {
      return { file: "registry[" + i + "]", def: d };
    }));
  }
```

- [ ] **Step 5: 浏览器验证（单芯片基线 + 真实点击）**

Run:
```bash
agent-browser --session cpp open "file:///D:/Code_Project/chip-pin-planner/index.html"
agent-browser --session cpp wait --text "就绪（v1.5）"
agent-browser --session cpp get text "#statusbar"
agent-browser --session cpp get count "#chip-select option"
agent-browser --session cpp click "#left-panel div.res[data-rid='UART0']"
agent-browser --session cpp get text "#statusbar"
```
Expected: statusbar 首查 `芯片: CH582M (QFN48)　已用 0　锁定 4　冲突 0　剩余 36 / 共 40 IO`；选项数 `1`；点击后 `已用 2`。

- [ ] **Step 6: 浏览器验证（双芯片切换 + 状态隔离）**

创建临时第二颗芯片：

```bash
cp chips/wch-ch582m-qfn48.js chips/_tmp-demo.js
```
在 `chips/_tmp-demo.js` 里把 `id: "ch582m-qfn48",` 改为 `id: "tmp-demo",`、把 `name: "CH582M",` 改为 `name: "临时演示B",`；在 `chips/manifest.js` 数组里加一行 `"chips/_tmp-demo.js",`。然后：

```bash
agent-browser --session cpp reload
agent-browser --session cpp wait --text "就绪（v1.5）"
agent-browser --session cpp get count "#chip-select option"
agent-browser --session cpp select "#chip-select" "1"
agent-browser --session cpp get text "#statusbar"
agent-browser --session cpp select "#chip-select" "0"
agent-browser --session cpp get text "#statusbar"
```
Expected: 选项数 `2`；切到 1 后 `芯片: 临时演示B (QFN48)　已用 0`；切回 0 后 `已用 2` 且仍在（**状态隔离成立**）。

清理临时件并复核：

```bash
rm chips/_tmp-demo.js
```
manifest 删掉那行 → `agent-browser --session cpp reload` → 选项数回到 `1`。

- [ ] **Step 7: Commit**

```bash
git add chips/manifest.js index.html js/app.js
git commit -m "feat: multi-chip UI - manifest wiring, chip selector, per-chip session state (v1.5)"
```

---

## Task 4: 工程 JSON 带芯片 + 导入自动路由

**Files:**
- Modify: `js/engine/exporters.js`
- Modify: `js/app.js`（导入处理器一段）
- Modify: `tests/engine.test.js`

**Interfaces:**
- Consumes: `Model.chipId`（Task 1）、`chips` / `activateChip` / `chipLabel`（Task 3）。
- Produces: `Exporters.readProjectChipId(text) → { chipId: string|null, chipName: string|null } | { error }`；`toProjectJSON` 输出新增 `chipId` 字段。

- [ ] **Step 1: 写失败测试**

在 `tests/engine.test.js` 汇总行之前插入：

```js
console.log("\n=== v1.5-3: 工程文件带芯片标识 ===");
t("toProjectJSON: 含 chipId（缺省 slug）", () => {
  const s = Avail.defaultState(miniChip);
  const obj = JSON.parse(Exp.toProjectJSON(miniChip, s));
  assert.strictEqual(obj.chipId, "mini-qfn8");
});
t("readProjectChipId: 有 / 无（老文件） / 非法", () => {
  const withId = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI", chipId: "mini-qfn8" });
  const without = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI" });
  assert.strictEqual(Exp.readProjectChipId(withId).chipId, "mini-qfn8");
  assert.strictEqual(Exp.readProjectChipId(without).chipId, null);
  assert.ok(Exp.readProjectChipId(JSON.stringify({ app: "chip-pin-planner", chipId: 7 })).error);
  assert.ok(Exp.readProjectChipId("{oops").error);
});
t("老工程文件（无 chipId）仍可导入", () => {
  const s = Avail.defaultState(miniChip);
  const obj = JSON.parse(Exp.toProjectJSON(miniChip, s));
  delete obj.chipId;
  const r = Exp.fromProjectJSON(miniChip, JSON.stringify(obj));
  assert.strictEqual(r.error, undefined, r.error);
});
```

- [ ] **Step 2: 运行确认失败**

Run: `node tests/engine.test.js 2>&1 | tail -8`
Expected: `Exp.readProjectChipId is not a function` 与 chipId 断言 FAIL。

- [ ] **Step 3: 实现 exporters.js（三处修改）**

3a. UMD 头部：引入 model.js 依赖。第 3-9 行改为：

```js
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("./availability.js"), require("./model.js"));
  } else {
    root.CPP = root.CPP || {};
    root.CPP.Exporters = factory(root.CPP.Availability, root.CPP.Model);
  }
})(typeof self !== "undefined" ? self : this, function (Avail, Model) {
```
（index.html 中 model.js 先于 exporters.js 加载，浏览器侧依赖顺序安全。）

3b. `toProjectJSON` 的对象字面量里，`app: "chip-pin-planner", schemaVersion: 1,` 之后插入一行：

```js
      chipId: Model.chipId(def),
```

3c. 在 `return` 之前新增函数，并扩展 return：

```js
  // 读取工程文件的芯片标识（导入路由用；v1 老文件没有 chipId 返回 null）
  function readProjectChipId(text) {
    var obj;
    try { obj = JSON.parse(text); }
    catch (e) { return { error: "工程文件不是有效 JSON" }; }
    if (!obj || obj.app !== "chip-pin-planner") return { error: "不是本工具的工程文件" };
    if (obj.chipId != null && (typeof obj.chipId !== "string" || !obj.chipId)) {
      return { error: "工程文件 chipId 无效" };
    }
    return { chipId: obj.chipId || null, chipName: obj.chip || null };
  }

  return { toCSV: toCSV, toMarkdown: toMarkdown, toProjectJSON: toProjectJSON,
           fromProjectJSON: fromProjectJSON, readProjectChipId: readProjectChipId };
```

- [ ] **Step 4: 修改 app.js 导入处理器**

把文件尾部 `document.getElementById("file-import").addEventListener("change", ...)` 整段替换为：

```js
  document.getElementById("file-import").addEventListener("change", function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var text = String(reader.result);
      var meta = CPP.Exporters.readProjectChipId(text);
      if (meta.error) { log("载入失败：" + meta.error); alert("载入失败：" + meta.error); return; }
      if (meta.chipId) {
        var target = null;
        for (var i = 0; i < chips.length; i++) {
          if (chips[i].ok && chips[i].chipId === meta.chipId) { target = i; break; }
        }
        if (target === null) {
          var msg = "缺少芯片数据：" + (meta.chipName || "") + "（" + meta.chipId + "）——需要在 chips/ 里补上这颗芯片";
          log("载入失败：" + msg); alert("载入失败：" + msg);
          return;
        }
        if (target !== activeIdx) activateChip(target, true);
      }
      var r = CPP.Exporters.fromProjectJSON(chips[activeIdx].def, text);
      if (r.error) { log("载入失败：" + r.error); alert("载入失败：" + r.error); return; }
      commit(r.state);
      log("已载入工程：" + f.name + "（" + chipLabel(chips[activeIdx]) + "）");
    };
    reader.readAsText(f);
    ev.target.value = "";
  });
```

- [ ] **Step 5: 运行确认全绿**

Run: `node tests/engine.test.js 2>&1 | tail -1`
Expected: `104 passed, 0 failed`

- [ ] **Step 6: 浏览器验证（跨芯片导入路由）**

先造一个第二芯片与一个工程文件：

```bash
cp chips/wch-ch582m-qfn48.js chips/_tmp-demo.js
```
同 Task 3 Step 6 改 `id: "tmp-demo"` / `name: "临时演示B"`，manifest 加行。然后：

```bash
agent-browser --session cpp reload
agent-browser --session cpp wait --text "就绪（v1.5）"
agent-browser --session cpp click "#left-panel div.res[data-rid='UART0']"
agent-browser --session cpp download "#btn-export-proj" "C:/Users/MeowG/tmp/cpp-verify/proj.json"
agent-browser --session cpp select "#chip-select" "1"
agent-browser --session cpp upload "#file-import" "C:/Users/MeowG/tmp/cpp-verify/proj.json"
agent-browser --session cpp get text "#log"
agent-browser --session cpp get text "#statusbar"
```
（先 `mkdir -p "C:/Users/MeowG/tmp/cpp-verify"`。）

Expected: 在"临时演示B"上导入后——`#log` 形如 `已载入工程：proj.json（CH582M · QFN48）`；statusbar 回到 `芯片: CH582M (QFN48)　已用 2`（**自动切到文件所属芯片**）。

再验证两条兼容路径：

```bash
node -e "const fs=require('fs');const p='C:/Users/MeowG/tmp/cpp-verify/proj.json';const o=JSON.parse(fs.readFileSync(p,'utf8'));delete o.chipId;fs.writeFileSync('C:/Users/MeowG/tmp/cpp-verify/proj-noid.json',JSON.stringify(o))"
node -e "const fs=require('fs');const p='C:/Users/MeowG/tmp/cpp-verify/proj.json';const o=JSON.parse(fs.readFileSync(p,'utf8'));o.chipId='ghost-chip';fs.writeFileSync('C:/Users/MeowG/tmp/cpp-verify/proj-ghost.json',JSON.stringify(o))"
agent-browser --session cpp upload "#file-import" "C:/Users/MeowG/tmp/cpp-verify/proj-noid.json"
agent-browser --session cpp get text "#log"
agent-browser --session cpp upload "#file-import" "C:/Users/MeowG/tmp/cpp-verify/proj-ghost.json"
agent-browser --session cpp get text "#log"
agent-browser --session cpp get text "#statusbar"
```
Expected: 无 chipId 文件 → `已载入工程：proj-noid.json（CH582M · QFN48）`；ghost 文件 → `#log` 含 `缺少芯片数据`，statusbar 保持 `已用 2` 不变（**状态未被改动**；若出现 alert 弹窗，agent-browser 通常自动关闭，若无则补一条 `agent-browser --session cpp press Enter`）。

- [ ] **Step 7: 清理临时件 + Commit**

```bash
rm chips/_tmp-demo.js
```
manifest 删掉临时行，然后：

```bash
git add js/engine/exporters.js js/app.js tests/engine.test.js
git commit -m "feat: project JSON carries chipId; import auto-switches to the file's chip"
```

---

## Task 5: 验收 —— 故障矩阵 + 回归 + 清理

**Files:**
- 仅测试动作与清理；临时件用完即删（**不入库**）。

- [ ] **Step 1: Node 全量**

```bash
node tests/engine.test.js 2>&1 | tail -1     # 预期 104 passed, 0 failed
node tests/fuzz.js 2>&1 | tail -3            # 预期无 FAIL 字样（8000 次随机操作全过）
```

- [ ] **Step 2: 浏览器故障矩阵**

临时文件准备：`cp chips/wch-ch582m-qfn48.js chips/_tmp-demo.js`（改 `id: "tmp-demo"` / `name: "临时演示B"`），manifest 加两行：

```js
  "chips/_tmp-demo.js",
  "chips/_missing-demo.js"
```

```bash
agent-browser --session cpp reload
agent-browser --session cpp wait --text "就绪（v1.5）"
agent-browser --session cpp eval "Array.from(document.querySelectorAll('#chip-select option')).map(function(o){return (o.disabled?'[灰]':'[活]')+o.textContent}).join(' ｜ ')"
```
Expected: 4 项——`[活]CH582M · QFN48`、`[活]临时演示B · QFN48`、`[灰]⚠ _missing-demo.js —— 文件加载失败`。

schemaVersion 闸门：把 `_tmp-demo.js` 的 `schemaVersion: 1,` 改为 `schemaVersion: 99,` → reload → eval 同上。
Expected: `[灰]⚠ _tmp-demo.js —— 数据校验失败`。

id 冲突：把 `_tmp-demo.js` 的 `schemaVersion` 改回 `1`、`id: "tmp-demo",` 改为 `id: "ch582m-qfn48",` → reload → eval 同上。
Expected: `[灰]⚠ _tmp-demo.js —— id 与 CH582M 冲突`。

- [ ] **Step 3: 刷新清空 + 旧功能冒烟**

```bash
agent-browser --session cpp click "#left-panel div.res[data-rid='UART0']"
agent-browser --session cpp reload
agent-browser --session cpp wait --text "就绪（v1.5）"
agent-browser --session cpp get text "#statusbar"          # 预期 已用 0（刷新即清空）
agent-browser --session cpp click "#chip-host g.pin[data-pin='PA6']"
agent-browser --session cpp get count ".pin-menu"          # 预期 1（引脚菜单仍可用，真实点击路径）
agent-browser --session cpp click "#statusbar"             # 关闭菜单
agent-browser --session cpp download "#btn-export-csv" "C:/Users/MeowG/tmp/cpp-verify/csv.csv"
ls -la "C:/Users/MeowG/tmp/cpp-verify/csv.csv" # 预期文件存在
```

- [ ] **Step 4: 清理临时件与原型目录**

```bash
rm chips/_tmp-demo.js
```
manifest 删掉两行临时行 → reload 复核只剩 1 项、`就绪（v1.5）：可用芯片 1 颗。`。然后清原型（含用户模拟测试时的 `我的测试文件.js`，属临时目录，spec 附录已留档）：

```bash
rm -rf "C:/Users/MeowG/tmp/chip-pin-planner-spike-20261007"
agent-browser --session cpp close
cd /d/Code_Project/chip-pin-planner && git status --short   # 预期干净
```

- [ ] **Step 5: 收尾提交（如有遗漏文件）**

```bash
git add -A
git commit -m "chore: v1.5 acceptance - regression + failure matrix green" || echo "无改动，跳过"
```

（会话收尾的记忆更新由主会话执行，执行者无需处理。）

---

## 自审记录（Self-Review）

- **Spec 覆盖**：§4 数据规范 → Task 1（id/闸门）；§5 清单与加载器 → Task 2/3；§6 应用层 → Task 3；§7 工程 JSON → Task 4；§8 版本机制 → Task 1；§9 贡献流程文档属 #4；§10 测试计划 → Task 1/2/4 单测 + Task 3/4/5 浏览器；§11/§12 非目标与风险未引入新工作。
- **占位符扫描**：无 TBD/TODO；全部代码块为可执行内容。
- **类型一致性**：`chipId`（函数名与状态桶键）、`duplicateIdIndex` 返回 `{index,id,firstIndex}`、`classify` 返回 `{file,def?,reason?,extra?}`、`readProjectChipId` 返回 `{chipId,chipName}|{error}`、`chips[]` 元素字段 `{file,def,ok,reason,errors,chipId}` —— 跨任务用法逐一核对一致。
- **Review Focus**：五条均已配测试（见上文括号标注）。
