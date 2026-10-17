# 芯片引脚规划器（chip-pin-planner）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个零依赖纯静态网页工具：在 CH582M（QFN48）封装图上点选引脚分配功能，冲突自动禁用/标红，导出引脚清单（CSV/Markdown/工程 JSON/SVG）。

**Architecture:** 引擎（芯片无关，`js/engine/` 纯逻辑 + `js/render/` SVG 渲染）与数据（`chips/` 每芯片一份 .js 文件）分离。四类约束（引脚互斥/整组切换/全局开关/信号二选一）在引擎中归一化为"引脚占用计算"。浏览器用传统 `<script>` 按序加载 + UMD-lite 尾巴，使同一套文件可被 Node `require` 做单测。

**Tech Stack:** 原生 HTML/CSS/JS（无框架、无构建、无 npm 依赖），SVG 手写渲染，Node 内置 assert 做单测。

**Spec:** `docs/superpowers/specs/2026-10-06-chip-pin-planner-design.md`

## Global Constraints

- **零第三方依赖**：不 npm install、不引 CDN、不外链字体；只用浏览器原生能力。
- **file:// 双击即用**：禁用 ES modules 语法（`import/export`）、禁止 fetch 本地文件；一切加载走 `<script src>` 标签；引擎/数据文件统一 **UMD-lite 尾巴**。
- **全中文 UI 文案**，源码注释用中文；文件保存为 UTF-8（无 BOM）。
- 目标浏览器：Chrome/Edge（Windows 11）。
- 状态一律**不可变**：所有变更函数返回新 state；History 存快照支持 Ctrl+Z。
- 每任务结束跑 `node tests/engine.test.js`（须全过）并 commit 一次；提交信息用 `feat: ...` / `docs: ...`。
- 工作目录 = 仓库根 `D:\Code_Project\chip-pin-planner`。

## Review Focus

用 spec 对照后，最可能在真实使用中咬人的 5 类输入/条件（各自已排入对应任务的测试或手动清单）：

1. **芯片数据笔误**（引脚名拼错、组切换信号缺映射脚）→ `validateChip` 必须逐一报错；CH582M 数据本身必须通过校验（Task 1 测试 + Task 5 测试）。
2. **导入损坏/异芯片工程 JSON** → `fromProjectJSON` 返回中文错误、不抛异常（Task 4 测试）。
3. **后发冲突**（先分配后拨开关造成双占）→ `computePins` 标记 conflict 且计数正确（Task 5 用例；Task 10 横幅手动项）。
4. **封装标签溢出**（长引脚名、窄间距下文字重叠）→ Task 7 手动清单含"标签不重叠检查"项。
5. **冲突状态下的导出** → 清单仍可生成且带 `⚠️冲突` 标记（Task 4 测试；Task 11 手动项）。

---

### Task 1: 仓库骨架 + model.js（数据校验）+ 测试约定

**Files:**
- Create: `index.html`
- Create: `css/app.css`
- Create: `tests/engine.test.js`
- Create: `js/engine/model.js`

**Interfaces:**
- Consumes: 无
- Produces: `CPP.Model.validateChip(def) -> {ok:boolean, errors:string[]}`（浏览器挂 `window.CPP.Model`，Node 侧 `module.exports`）

- [ ] **Step 1: 写测试骨架与失败测试**

创建 `tests/engine.test.js`：

```js
"use strict";
const assert = require("assert");

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log("  PASS " + name); }
  catch (e) { fail++; console.error("  FAIL " + name + "\n       " + e.message); }
}

const Model = require("../js/engine/model.js");

// 测试用迷你芯片定义（后续任务也会用它）
const miniChip = {
  schemaVersion: 1,
  chip: { vendor: "TEST", name: "MINI", package: "QFN8" },
  package: { family: "quad", style: "no-lead", pinsPerSide: 2, pitch: 0.5, body: [2, 2],
             pin1: "topLeft", sequence: "ccw-down" },
  pins: [
    { num: 1, name: "PA0", type: "io", alts: [] },
    { num: 2, name: "PA1", type: "io", alts: [] },
    { num: 3, name: "PB0", type: "io", alts: [] },
    { num: 4, name: "PB1", type: "io", alts: [] },
    { num: 5, name: "PC0", type: "io", alts: [] },
    { num: 6, name: "PC1", type: "io", alts: [] },
    { num: 7, name: "PD0", type: "io", alts: [] },
    { num: 8, name: "PD1", type: "io", alts: [] },
    { num: "EP", name: "GND", type: "power", alts: [] }
  ],
  globalConfigs: [
    { id: "lock1", label: "锁定开关", default: true, claims: ["PA0"] }
  ],
  resources: [
    { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组" },
      signals: [
        { name: "SCK",  pins: ["PA1", "PB1"] },
        { name: "MOSI", pins: ["PC0", "PD0"] },
        { name: "MISO", pins: ["PC1", "PD1"] }
      ] },
    { id: "TMR1", category: "TIMER", label: "TMR1",
      signals: [ { name: "TMR1", pins: ["PB0", "PA1"] } ] },
    { id: "GPIO", category: "GPIO", perPin: true }
  ]
};

console.log("\n=== Task 1: model.js ===");
t("validateChip: 合法定义通过", () => {
  const r = Model.validateChip(miniChip);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
t("validateChip: 缺少 chip.name 报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  delete bad.chip.name;
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("chip.name")));
});
t("validateChip: 资源引用不存在的引脚时报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins[0] = "PX9";
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("PX9")));
});
t("validateChip: 有 groupSwitch 的资源信号必须是 2 个落脚点", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins = ["PA1"];
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("groupSwitch")));
});
t("validateChip: 重复引脚名报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.pins[1].name = "PA0";
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
});

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
```

- [ ] **Step 2: 运行测试确认失败**

Run: `node tests/engine.test.js`
Expected: 报 `Cannot find module '../js/engine/model.js'`（文件还不存在）

- [ ] **Step 3: 实现 model.js**

创建 `js/engine/model.js`：

```js
/* 芯片数据模型加载与校验（零依赖；浏览器挂 window.CPP.Model，Node 可直接 require） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Model = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function validateChip(def) {
    var errors = [];
    if (!def || typeof def !== "object") return { ok: false, errors: ["芯片定义不是对象"] };
    if (def.schemaVersion !== 1) errors.push("schemaVersion 必须为 1");
    if (!def.chip || !def.chip.name) errors.push("缺少 chip.name");
    if (!def.package || !def.package.family) errors.push("缺少 package.family");
    if (!Array.isArray(def.pins) || def.pins.length === 0) errors.push("缺少 pins");

    var names = {};
    (def.pins || []).forEach(function (p) {
      if (!p.name) errors.push("存在没有 name 的引脚");
      else if (names[p.name]) errors.push("重复引脚: " + p.name);
      else names[p.name] = true;
    });

    (def.globalConfigs || []).forEach(function (c) {
      if (!c.id) errors.push("globalConfigs 缺 id");
      (c.claims || []).forEach(function (pin) {
        if (!names[pin]) errors.push("globalConfigs[" + c.id + "] 引用了不存在的引脚 " + pin);
      });
    });

    (def.resources || []).forEach(function (r) {
      if (!r.id) errors.push("resource 缺少 id");
      (r.signals || []).forEach(function (s) {
        if (!Array.isArray(s.pins) || s.pins.length === 0) {
          errors.push(r.id + "." + s.name + " 缺少落脚点");
          return;
        }
        if (r.groupSwitch && s.pins.length !== 2) {
          errors.push(r.id + "." + s.name + "：有 groupSwitch 的资源，每个信号必须恰好 2 个落脚点（默认组/映射组）");
        }
        s.pins.forEach(function (pin) {
          if (!names[pin]) errors.push(r.id + "." + s.name + " 引用了不存在的引脚 " + pin);
        });
      });
    });

    return { ok: errors.length === 0, errors: errors };
  }

  return { validateChip: validateChip };
});
```

- [ ] **Step 4: 运行测试确认通过**

Run: `node tests/engine.test.js`
Expected: `5 passed, 0 failed`

- [ ] **Step 5: 创建 index.html 骨架与 css**

创建 `index.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>芯片引脚规划器</title>
<link rel="stylesheet" href="css/app.css">
</head>
<body>
  <header id="topbar">
    <span id="app-title">芯片引脚规划器</span>
    <span class="spacer"></span>
  </header>
  <main id="layout">
    <aside id="left-panel"></aside>
    <section id="chip-host"><p class="hint">（封装图将在此渲染）</p></section>
    <aside id="right-panel"></aside>
  </main>
  <footer id="statusbar"></footer>
  <div id="conflict-banner" hidden></div>
  <div id="log"></div>
  <script src="js/engine/model.js"></script>
</body>
</html>
```

创建 `css/app.css`：

```css
html, body { margin: 0; height: 100%; font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; font-size: 13px; color: #202124; }
body { display: flex; flex-direction: column; }
#topbar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-bottom: 1px solid #dadce0; }
#topbar .spacer { flex: 1; }
#layout { flex: 1; display: flex; min-height: 0; }
#left-panel, #right-panel { width: 240px; overflow-y: auto; padding: 8px; border-right: 1px solid #dadce0; }
#right-panel { border-right: none; border-left: 1px solid #dadce0; }
#chip-host { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #fafafa; }
#chip-host svg { width: 100%; height: 100%; }
#statusbar { padding: 6px 12px; border-top: 1px solid #dadce0; color: #5f6368; }
#conflict-banner { position: fixed; top: 44px; left: 50%; transform: translateX(-50%);
  background: #fce8e6; color: #c5221f; border: 1px solid #ea4335; border-radius: 6px; padding: 6px 14px; z-index: 20; }
#log { position: fixed; left: 8px; bottom: 40px; max-width: 480px; color: #5f6368; }
.hint { color: #9aa0a6; }
```

- [ ] **Step 6: 手动验证页面可打开**

在资源管理器里双击 `index.html`（或浏览器地址栏打开 `file:///D:/Code_Project/chip-pin-planner/index.html`）。
Expected: 顶部标题栏 + 左侧/右侧空面板 + 中间提示文字，无报错。

- [ ] **Step 7: Commit**

```bash
git add index.html css/app.css js/engine/model.js tests/engine.test.js
git commit -m "feat: repo skeleton + chip data model validation"
```

---

### Task 2: 可用性引擎（一）：claim 收集 / 引脚状态 / 计数

**Files:**
- Create: `js/engine/availability.js`
- Modify: `tests/engine.test.js`（在 exit 之前追加新测试段）
- Modify: `index.html`（加一行 script）

**Interfaces:**
- Consumes: 无（纯函数，不依赖 model.js）
- Produces: `CPP.Availability.defaultState(def) -> State`；`computePins(def, state) -> Map<pinName, {name,num,type,fixed,owners[],status}>`；`countIO(def, state) -> {total,used,locked,conflict,free}`；`findResource(def, id) -> res|null`
  - `State = { chip:string, configs:{[id]:bool}, resources:{[rid]:{group:bool,pins:{[sig]:pin}}}, gpio:{[pin]:alias} }`
  - `status ∈ "free"|"assigned"|"locked"|"conflict"|"fixed"`；`owner = {type:"config"|"resource"|"gpio", id, label, signal?, alias?}`

- [ ] **Step 1: 写失败测试**

在 `tests/engine.test.js` 的 `console.log("\n" + pass...` **之前**插入：

```js
const Avail = require("../js/engine/availability.js");

console.log("\n=== Task 2: availability 状态计算 ===");
t("defaultState: configs 取自 default 值", () => {
  const s = Avail.defaultState(miniChip);
  assert.strictEqual(s.configs.lock1, true);
  assert.deepStrictEqual(s.resources, {});
});
t("computePins: 开关锁定的脚 status=locked", () => {
  const s = Avail.defaultState(miniChip);
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA0").status, "locked");
  assert.strictEqual(pins.get("PA1").status, "free");
});
t("computePins: 电源/模拟脚 status=fixed", () => {
  const s = Avail.defaultState(miniChip);
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("GND").status, "fixed");
});
t("computePins: 资源分配后 status=assigned 且 owner 正确", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { resources: { SPI0: { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } } } });
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA1").status, "assigned");
  assert.strictEqual(pins.get("PA1").owners[0].id, "SPI0");
  assert.strictEqual(pins.get("PA1").owners[0].signal, "SCK");
});
t("computePins: 双占产生 conflict  且 countIO 正确", () => {
  let s = Avail.defaultState(miniChip);
  // 先关掉开关、分配 SPI0 到映射组，再把开关打开 → PB1/PD0/PD1 冲突？不，映射组是 PB1/PD0/PD1，开关锁 PA0
  s = Object.assign({}, s, { resources: { SPI0: { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } } } });
  s = Object.assign({}, s, { gpio: { PA1: "X" } });          // GPIO 与 SPI0.SCK 抢 PA1
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA1").status, "conflict");
  assert.strictEqual(pins.get("PA1").owners.length, 2);
  const c = Avail.countIO(miniChip, s);
  assert.strictEqual(c.total, 8);      // 8 个 io
  assert.strictEqual(c.conflict, 1);
  assert.strictEqual(c.locked, 1);     // PA0
});
```

- [ ] **Step 2: 运行确认失败**（模块不存在）

Run: `node tests/engine.test.js`

- [ ] **Step 3: 实现 availability.js（本任务部分）**

创建 `js/engine/availability.js`：

```js
/* 可用性引擎：claim 收集 / 引脚状态 / 可勾选性（纯函数，零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Availability = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function findResource(def, rid) {
    return (def.resources || []).find(function (r) { return r.id === rid; }) || null;
  }

  function defaultState(def) {
    var configs = {};
    (def.globalConfigs || []).forEach(function (c) { configs[c.id] = !!c.default; });
    return { chip: def.chip.name, configs: configs, resources: {}, gpio: {} };
  }

  function collectClaims(def, state) {
    var claims = [];
    (def.globalConfigs || []).forEach(function (c) {
      if (state.configs[c.id]) {
        (c.claims || []).forEach(function (pin) {
          claims.push({ pin: pin, owner: { type: "config", id: c.id, label: c.label } });
        });
      }
    });
    Object.keys(state.resources || {}).forEach(function (rid) {
      var res = findResource(def, rid);
      var asg = state.resources[rid];
      if (!res || !asg) return;
      Object.keys(asg.pins || {}).forEach(function (sig) {
        if (asg.pins[sig]) {
          claims.push({ pin: asg.pins[sig], owner: { type: "resource", id: rid, label: res.label, signal: sig } });
        }
      });
    });
    Object.keys(state.gpio || {}).forEach(function (pin) {
      claims.push({ pin: pin, owner: { type: "gpio", id: "GPIO", label: "GPIO", alias: state.gpio[pin] } });
    });
    return claims;
  }

  function computePins(def, state) {
    var map = new Map();
    (def.pins || []).forEach(function (p) {
      var fixed = p.type !== "io";
      map.set(p.name, { name: p.name, num: p.num, type: p.type, fixed: fixed,
                        owners: [], status: fixed ? "fixed" : "free" });
    });
    collectClaims(def, state).forEach(function (cl) {
      var entry = map.get(cl.pin);
      if (entry) entry.owners.push(cl.owner);
    });
    map.forEach(function (e) {
      if (e.fixed) return;
      if (e.owners.length === 0) e.status = "free";
      else if (e.owners.length === 1) e.status = (e.owners[0].type === "config") ? "locked" : "assigned";
      else e.status = "conflict";
    });
    return map;
  }

  function countIO(def, state) {
    var r = { total: 0, used: 0, locked: 0, conflict: 0, free: 0 };
    computePins(def, state).forEach(function (e) {
      if (e.fixed) return;
      r.total++;
      if (e.status === "assigned") r.used++;
      else if (e.status === "locked") r.locked++;
      else if (e.status === "conflict") r.conflict++;
      else r.free++;
    });
    return r;
  }

  return { defaultState: defaultState, collectClaims: collectClaims, computePins: computePins,
           countIO: countIO, findResource: findResource };
});
```

在 `index.html` 的 `model.js` 那行后追加：

```html
  <script src="js/engine/availability.js"></script>
```

- [ ] **Step 4: 运行确认全过**

Run: `node tests/engine.test.js`
Expected: `10 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/engine/availability.js tests/engine.test.js index.html
git commit -m "feat: pin state computation (claims, statuses, IO counters)"
```

---

### Task 3: 可用性引擎（二）：候选/校验/变更/历史

**Files:**
- Modify: `js/engine/availability.js`
- Modify: `tests/engine.test.js`

**Interfaces:**
- Consumes: Task 2 的 `collectClaims/findResource`
- Produces:
  - `candidatePins(def, state, rid [, groupOverride]) -> {group, signals:{[sig]:[pin...]}} | null`（排除本资源自身已占的脚；groupSwitch 资源按组筛 `pins[group?1:0]`）
  - `canAssign(def, state, rid, choice) -> {ok, reason?}`；`choice = {group?:bool, pins:{[sig]:pin}}`
  - `assign(def, state, rid, choice) -> {state, error?}`（失败返回原 state + 中文 error）
  - `removeResource(state, rid) -> State`；`setConfig(state, id, value) -> State`；`setGpio(state, pin, alias) -> State`（alias 空串=清除）
  - `createHistory(initial) -> {current(), push(s), undo(), canUndo()}`

- [ ] **Step 1: 写失败测试**（追加到 exit 之前）

```js
console.log("\n=== Task 3: 候选 / 校验 / 变更 / 历史 ===");
t("candidatePins: 默认组只给默认落脚点", () => {
  const s = Avail.defaultState(miniChip);
  const c = Avail.candidatePins(miniChip, s, "SPI0");
  assert.deepStrictEqual(c.signals.SCK, ["PA1"]);
  assert.deepStrictEqual(c.signals.MOSI, ["PC0"]);
});
t("candidatePins: 映射组在目标脚被占时为空", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PB1: "X" } });      // PB1 = 映射组 SCK 脚
  const c = Avail.candidatePins(miniChip, s, "SPI0", true);
  assert.deepStrictEqual(c.signals.SCK, []);             // PB1 被占 → 无候选
  assert.deepStrictEqual(c.signals.MOSI, ["PD0"]);
});
t("canAssign: 目标被占 → 失败并给中文原因", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PA1: "X" } });
  const r = Avail.canAssign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("PA1"));
});
t("canAssign: 组与落脚点不匹配 → 失败", () => {
  const s = Avail.defaultState(miniChip);
  const r = Avail.canAssign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PB1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.ok, false);
});
t("assign → removeResource 往返", () => {
  let s = Avail.defaultState(miniChip);
  const r = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.error, undefined);
  assert.ok(r.state.resources.SPI0);
  const s2 = Avail.removeResource(r.state, "SPI0");
  assert.strictEqual(s2.resources.SPI0, undefined);
  assert.ok(s.resources.SPI0 === undefined);             // 原 state 未被修改（不可变）
});
t("assign 失败时返回原 state 与错误", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PA1: "X" } });
  const r = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.state, s);
  assert.ok(r.error);
});
t("重复分配同一资源 = 重新分配（自身旧脚不算冲突）", () => {
  let s = Avail.defaultState(miniChip);
  s = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } }).state;
  const r = Avail.assign(miniChip, s, "SPI0", { group: true, pins: { SCK: "PB1", MOSI: "PD0", MISO: "PD1" } });
  assert.strictEqual(r.error, undefined);
  assert.strictEqual(r.state.resources.SPI0.group, true);
});
t("setConfig / setGpio：返回新对象且原 state 不变", () => {
  const s = Avail.defaultState(miniChip);
  const s2 = Avail.setConfig(s, "lock1", false);
  assert.strictEqual(s.configs.lock1, true);
  assert.strictEqual(s2.configs.lock1, false);
  const s3 = Avail.setGpio(s2, "PB0", "LED");
  assert.strictEqual(s3.gpio.PB0, "LED");
  const s4 = Avail.setGpio(s3, "PB0", "");
  assert.strictEqual(s4.gpio.PB0, undefined);
});
t("createHistory: undo 回退快照", () => {
  const h = Avail.createHistory(Avail.defaultState(miniChip));
  h.push(Avail.setConfig(h.current(), "lock1", false));
  assert.strictEqual(h.current().configs.lock1, false);
  assert.strictEqual(h.canUndo(), true);
  h.undo();
  assert.strictEqual(h.current().configs.lock1, true);
  assert.strictEqual(h.canUndo(), false);
});
```

- [ ] **Step 2: 运行确认失败** Run: `node tests/engine.test.js`（candidatePins 未定义）

- [ ] **Step 3: 实现（追加到 availability.js factory 内）**

在 `countIO` 之后、`return {` 之前加入：

```js
  // 资源各信号当前可用落脚点；groupOverride 用于预览"切到另一组"
  function candidatePins(def, state, rid, groupOverride) {
    var res = findResource(def, rid);
    if (!res) return null;
    var existing = state.resources[rid] || null;
    var group = (groupOverride !== undefined) ? !!groupOverride : (existing ? existing.group === true : false);
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      var selfClaim = existing && cl.owner.type === "resource" && cl.owner.id === rid;
      if (!selfClaim) busy[cl.pin] = true;
    });
    var out = { group: group, signals: {} };
    (res.signals || []).forEach(function (s) {
      var options = res.groupSwitch ? [s.pins[group ? 1 : 0]] : s.pins.slice();
      out.signals[s.name] = options.filter(function (pin) { return !busy[pin]; });
    });
    return out;
  }

  function canAssign(def, state, rid, choice) {
    var res = findResource(def, rid);
    if (!res) return { ok: false, reason: "未找到资源 " + rid };
    var group = choice.group === true;
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      var selfClaim = cl.owner.type === "resource" && cl.owner.id === rid;
      if (!selfClaim) busy[cl.pin] = true;
    });
    var seen = {};
    for (var i = 0; i < (res.signals || []).length; i++) {
      var s = res.signals[i];
      var pin = choice.pins ? choice.pins[s.name] : undefined;
      if (!pin) return { ok: false, reason: s.name + " 未选择落脚点" };
      var allowed = res.groupSwitch ? [s.pins[group ? 1 : 0]] : s.pins;
      if (allowed.indexOf(pin) < 0) return { ok: false, reason: s.name + " 不能落到 " + pin + "（该组不可用）" };
      if (busy[pin]) return { ok: false, reason: pin + " 已被占用" };
      if (seen[pin]) return { ok: false, reason: "资源内部信号重复占用 " + pin };
      seen[pin] = true;
    }
    return { ok: true };
  }

  function assign(def, state, rid, choice) {
    var chk = canAssign(def, state, rid, choice);
    if (!chk.ok) return { state: state, error: chk.reason };
    var nextResources = Object.assign({}, state.resources);
    nextResources[rid] = { group: !!choice.group, pins: Object.assign({}, choice.pins) };
    return { state: Object.assign({}, state, { resources: nextResources }) };
  }

  function removeResource(state, rid) {
    var nextResources = Object.assign({}, state.resources);
    delete nextResources[rid];
    return Object.assign({}, state, { resources: nextResources });
  }

  function setConfig(state, id, value) {
    var nextConfigs = Object.assign({}, state.configs);
    nextConfigs[id] = !!value;
    return Object.assign({}, state, { configs: nextConfigs });
  }

  function setGpio(state, pin, alias) {
    var nextGpio = Object.assign({}, state.gpio);
    if (alias) nextGpio[pin] = alias; else delete nextGpio[pin];
    return Object.assign({}, state, { gpio: nextGpio });
  }

  function createHistory(initial) {
    var stack = [initial];
    return {
      current: function () { return stack[stack.length - 1]; },
      push: function (s) { stack.push(s); },
      undo: function () { if (stack.length > 1) stack.pop(); return stack[stack.length - 1]; },
      canUndo: function () { return stack.length > 1; }
    };
  }
```

并把 return 改为：

```js
  return { defaultState: defaultState, collectClaims: collectClaims, computePins: computePins,
           countIO: countIO, findResource: findResource, candidatePins: candidatePins,
           canAssign: canAssign, assign: assign, removeResource: removeResource,
           setConfig: setConfig, setGpio: setGpio, createHistory: createHistory };
```

- [ ] **Step 4: 运行确认全过** Run: `node tests/engine.test.js` Expected: `19 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: candidates, assignment validation, mutators, undo history"
```

---

### Task 4: 导出器 exporters.js（CSV / Markdown / 工程 JSON）

**Files:**
- Create: `js/engine/exporters.js`
- Modify: `tests/engine.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `require("./availability.js")`（Node）/ `root.CPP.Availability`（浏览器）
- Produces: `CPP.Exporters.toCSV(def, state)`；`toMarkdown(def, state)`；`toProjectJSON(def, state)`；`fromProjectJSON(def, text) -> {state?, error?}`

- [ ] **Step 1: 写失败测试**（追加）

```js
const Exp = require("../js/engine/exporters.js");

console.log("\n=== Task 4: 导出器 ===");
function assignedState() {
  let s = Avail.defaultState(miniChip);
  s = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } }).state;
  s = Avail.setGpio(s, "PB0", "LED");
  return s;
}
t("toCSV: 含表头/已分配/GPIO/空闲行", () => {
  const csv = Exp.toCSV(miniChip, assignedState());
  const lines = csv.split("\n");
  assert.ok(lines[0].startsWith("脚号,引脚,分配功能"));
  assert.ok(csv.includes("PA1") && csv.includes("SPI0") && csv.includes("SCK"));
  assert.ok(csv.includes("LED"));
  assert.ok(csv.includes("空闲"));
});
t("toMarkdown: 是合法表格", () => {
  const md = Exp.toMarkdown(miniChip, assignedState());
  assert.ok(md.includes("| 脚号 | 引脚 |"));
  assert.ok(md.includes("| --- |"));
});
t("toProjectJSON → fromProjectJSON 往返一致", () => {
  const s = assignedState();
  const text = Exp.toProjectJSON(miniChip, s);
  const r = Exp.fromProjectJSON(miniChip, text);
  assert.strictEqual(r.error, undefined);
  assert.deepStrictEqual(r.state, s);
});
t("fromProjectJSON: 损坏 JSON 返回中文错误", () => {
  const r = Exp.fromProjectJSON(miniChip, "{oops");
  assert.ok(r.error && r.error.includes("JSON"));
});
t("fromProjectJSON: 异芯片工程被拒绝", () => {
  const text = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "OTHER",
                               configs: {}, resources: {}, gpio: {} });
  const r = Exp.fromProjectJSON(miniChip, text);
  assert.ok(r.error && r.error.includes("不匹配"));
});
t("冲突状态导出不崩溃且带警示", () => {
  let s = assignedState();
  s = Avail.setGpio(s, "PA1", "X");            // 与 SPI0.SCK 冲突
  const csv = Exp.toCSV(miniChip, s);
  assert.ok(csv.includes("冲突"));
});
```

- [ ] **Step 2: 运行确认失败**

- [ ] **Step 3: 实现 exporters.js**

```js
/* 导出器：CSV / Markdown / 工程 JSON（纯函数，依赖 availability.js） */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("./availability.js"));
  } else {
    root.CPP = root.CPP || {};
    root.CPP.Exporters = factory(root.CPP.Availability);
  }
})(typeof self !== "undefined" ? self : this, function (Avail) {
  "use strict";

  function ownerShort(o) {
    if (o.type === "gpio") return "GPIO";
    if (o.type === "resource") return o.label;
    return o.label;
  }
  function ownerSignal(o) {
    if (o.type === "resource") return o.signal || "";
    if (o.type === "gpio") return o.alias || "";
    return "系统";
  }
  function categoryOf(def, o) {
    if (o.type === "config") return "系统";
    if (o.type === "gpio") return "GPIO";
    var res = Avail.findResource(def, o.id);
    return res ? res.category : "";
  }
  function csvEscape(v) {
    v = String(v == null ? "" : v);
    return /[",\n]/.test(v) ? "\"" + v.replace(/"/g, "\"\"") + "\"" : v;
  }

  // 生成行数据（CSV 与 Markdown 共用）
  function buildRows(def, state) {
    var rows = [];
    var pins = Avail.computePins(def, state);
    (def.pins || []).forEach(function (p) {
      var e = pins.get(p.name);
      if (!e || e.fixed) return;
      var fn = "", sig = "", cat = "", notes = [];
      if (e.status === "assigned") {
        fn = ownerShort(e.owners[0]);
        sig = ownerSignal(e.owners[0]);
        cat = categoryOf(def, e.owners[0]);
        if (e.owners[0].alias) sig = e.owners[0].alias;
      } else if (e.status === "locked") {
        fn = "系统占用"; sig = e.owners[0].label; cat = "系统";
      } else if (e.status === "conflict") {
        fn = "⚠️冲突"; sig = e.owners.map(function (o) { return ownerShort(o) + "·" + ownerSignal(o); }).join(" + ");
        notes.push("存在资源冲突，需处理");
      } else {
        fn = "空闲";
      }
      if (p.note) notes.push(p.note);
      rows.push([p.num, p.name, fn, sig, notes.join("；"), cat]);
    });
    return rows;
  }

  function toCSV(def, state) {
    var out = [["脚号", "引脚", "分配功能", "信号", "别名/备注", "类别"].join(",")];
    buildRows(def, state).forEach(function (r) {
      out.push(r.map(csvEscape).join(","));
    });
    return out.join("\n");
  }

  function toMarkdown(def, state) {
    var out = ["| 脚号 | 引脚 | 分配功能 | 信号 | 别名/备注 | 类别 |", "| --- | --- | --- | --- | --- | --- |"];
    buildRows(def, state).forEach(function (r) {
      out.push("| " + r.map(function (v) { return String(v == null ? "" : v); }).join(" | ") + " |");
    });
    return out.join("\n");
  }

  function toProjectJSON(def, state) {
    return JSON.stringify({
      app: "chip-pin-planner", schemaVersion: 1,
      chip: def.chip.name, vendor: def.chip.vendor, package: def.chip.package,
      configs: state.configs, resources: state.resources, gpio: state.gpio
    }, null, 2);
  }

  function fromProjectJSON(def, text) {
    var obj;
    try { obj = JSON.parse(text); }
    catch (e) { return { error: "工程文件不是有效 JSON" }; }
    if (!obj || obj.app !== "chip-pin-planner") return { error: "不是本工具的工程文件" };
    if (obj.schemaVersion !== 1) return { error: "工程文件版本不兼容（需要 1）" };
    if (obj.chip !== def.chip.name) return { error: "工程属于 " + obj.chip + "，与当前芯片 " + def.chip.name + " 不匹配" };
    var badCfg = Object.keys(obj.configs || {}).filter(function (k) {
      return !(def.globalConfigs || []).some(function (c) { return c.id === k; });
    });
    if (badCfg.length) return { error: "工程包含未知配置项: " + badCfg.join(", ") };
    var pinNames = {};
    (def.pins || []).forEach(function (p) { pinNames[p.name] = true; });
    var badPin = null;
    Object.keys(obj.resources || {}).forEach(function (rid) {
      var res = Avail.findResource(def, rid);
      if (!res) { badPin = "未知资源 " + rid; return; }
      var pinsObj = (obj.resources[rid] || {}).pins || {};
      Object.keys(pinsObj).forEach(function (sig) {
        if (!(res.signals || []).some(function (s) { return s.name === sig; })) badPin = rid + " 未知信号 " + sig;
        if (!pinNames[pinsObj[sig]]) badPin = rid + " 引用未知引脚 " + pinsObj[sig];
      });
    });
    Object.keys(obj.gpio || {}).forEach(function (pin) {
      if (!pinNames[pin]) badPin = "GPIO 引用未知引脚 " + pin;
    });
    if (badPin) return { error: "工程数据无效：" + badPin };
    var state = {
      chip: def.chip.name,
      configs: Object.assign(Avail.defaultState(def).configs, obj.configs || {}),
      resources: obj.resources || {}, gpio: obj.gpio || {}
    };
    return { state: state };
  }

  return { toCSV: toCSV, toMarkdown: toMarkdown, toProjectJSON: toProjectJSON, fromProjectJSON: fromProjectJSON };
});
```

在 `index.html` 追加：`<script src="js/engine/exporters.js"></script>`（放在 availability 之后）

- [ ] **Step 4: 运行确认全过** Expected: `25 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/engine/exporters.js tests/engine.test.js index.html
git commit -m "feat: exporters (CSV/Markdown/project JSON) with round-trip"
```

---

### Task 5: CH582M 芯片数据文件（全量）+ 真实规则测试

**Files:**
- Create: `chips/registry.js`
- Create: `chips/wch-ch582m-qfn48.js`
- Modify: `tests/engine.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: 无（纯数据）；浏览器侧推入 `window.CHIP_REGISTRY`
- Produces: CH582M 完整定义（48+EP 脚、3 个 globalConfigs、22 个资源）

- [ ] **Step 1: 写 registry + 数据文件**

创建 `chips/registry.js`：

```js
/* 芯片注册表：所有芯片数据文件按 <script> 顺序推入即可 */
window.CHIP_REGISTRY = window.CHIP_REGISTRY || [];
```

创建 `chips/wch-ch582m-qfn48.js`（引脚 alts 仅供显示；约束事实全部来自 CH583DS1 V1.9，附录 A 已核对）：

```js
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
    schemaVersion: 1,
    meta: { source: "CH583DS1 V1.9 (2025-04-10)", author: "Xi.Wang33", date: "2026-10-06" },
    chip: { vendor: "WCH", name: "CH582M", package: "QFN48" },
    package: { family: "quad", style: "no-lead", pinsPerSide: 12, pitch: 0.35,
               body: [5, 5], pin1: "topLeft", sequence: "ccw-down", thermalPad: "GND (EP)" },
    pins: [
      { num: 1,  name: "VDCID", type: "power", alts: [] },
      { num: 2,  name: "VSW", type: "power", alts: [] },
      { num: 3,  name: "VDD33/VIO33", type: "power", alts: [] },
      { num: 4,  name: "PA7", type: "io", alts: ["TXD2", "PWM5_", "AIN11"] },
      { num: 5,  name: "PA8", type: "io", alts: ["RXD1", "AIN12"] },
      { num: 6,  name: "PA9", type: "io", alts: ["TMR0/PWM0/CAP0", "TXD1", "AIN13"] },
      { num: 7,  name: "PB9", type: "io", alts: [] },
      { num: 8,  name: "PB8", type: "io", alts: [] },
      { num: 9,  name: "PB17", type: "io", alts: [] },
      { num: 10, name: "PB16", type: "io", alts: [] },
      { num: 11, name: "PB15", type: "io", alts: ["TCK", "MISO_", "DTR_"], note: "支持5V(5VT)" },
      { num: 12, name: "PB14", type: "io", alts: ["TIO", "MOSI_", "PWM10", "DSR_"], note: "支持5V(5VT)" },
      { num: 13, name: "PB13", type: "io", alts: ["U2D+", "SCK0_", "SCL", "TXD1_"], note: "不支持5V" },
      { num: 14, name: "PB12", type: "io", alts: ["U2D-", "SCS_", "SDA", "RXD1_"], note: "不支持5V" },
      { num: 15, name: "PB11", type: "io", alts: ["UD+", "TMR2_"] },
      { num: 16, name: "PB10", type: "io", alts: ["UD-", "TMR1_"] },
      { num: 17, name: "PB7", type: "io", alts: ["TXD0", "PWM9"] },
      { num: 18, name: "PB6", type: "io", alts: ["RTS", "PWM8"] },
      { num: 19, name: "PB5", type: "io", alts: ["DTR"] },
      { num: 20, name: "PB4", type: "io", alts: ["RXD0", "PWM7"] },
      { num: 21, name: "PB3", type: "io", alts: ["DCD", "PWM9_"] },
      { num: 22, name: "PB2", type: "io", alts: ["RI", "PWM8_"] },
      { num: 23, name: "PB1", type: "io", alts: ["DSR", "PWM7_"] },
      { num: 24, name: "PB0", type: "io", alts: ["CTS", "PWM6"] },
      { num: 25, name: "PB23", type: "io", alts: ["RST#", "TMR0_", "TXD2_", "PWM11"] },
      { num: 26, name: "PB22", type: "io", alts: ["TMR3/PWM3/CAP3", "RXD2_"] },
      { num: 27, name: "PB21", type: "io", alts: ["SCL_", "TXD3_"] },
      { num: 28, name: "PB20", type: "io", alts: ["SDA_", "RXD3_"] },
      { num: 29, name: "PB19", type: "io", alts: [] },
      { num: 30, name: "PB18", type: "io", alts: [] },
      { num: 31, name: "X32MO", type: "osc", alts: [] },
      { num: 32, name: "X32MI", type: "osc", alts: [] },
      { num: 33, name: "VINTA", type: "power", alts: [] },
      { num: 34, name: "ANT", type: "rf", alts: [] },
      { num: 35, name: "VDCIA", type: "power", alts: [] },
      { num: 36, name: "PA4", type: "io", alts: ["RXD3", "AIN0"] },
      { num: 37, name: "PA5", type: "io", alts: ["TXD3", "AIN1"] },
      { num: 38, name: "PA6", type: "io", alts: ["RXD2", "PWM4_", "AIN10"] },
      { num: 39, name: "PA0", type: "io", alts: ["AIN9"], note: "SCK1 为 CH583 专用" },
      { num: 40, name: "PA1", type: "io", alts: ["AIN8"], note: "MOSI1 为 CH583 专用" },
      { num: 41, name: "PA2", type: "io", alts: ["TMR3_", "AIN7"] },
      { num: 42, name: "PA3", type: "io", alts: ["AIN6"] },
      { num: 43, name: "PA15", type: "io", alts: ["MISO", "RXD0_", "AIN5"] },
      { num: 44, name: "PA14", type: "io", alts: ["MOSI", "TXD0_", "AIN4"] },
      { num: 45, name: "PA13", type: "io", alts: ["SCK0", "PWM5", "AIN3"] },
      { num: 46, name: "PA12", type: "io", alts: ["SCS", "PWM4", "AIN2"] },
      { num: 47, name: "PA11", type: "io", alts: ["X32KO", "TMR2/PWM2/CAP2"] },
      { num: 48, name: "PA10", type: "io", alts: ["X32KI", "TMR1/PWM1/CAP1"] },
      { num: "EP", name: "GND", type: "power", alts: [] }
    ],
    globalConfigs: [
      { id: "debug", label: "两线调试接口", default: true, claims: ["PB14", "PB15"],
        note: "关闭后释放 PB14/PB15，但失去调试与两线下载（仍可 USB ISP）" },
      { id: "rst", label: "外部复位 RST", default: false, claims: ["PB23"] },
      { id: "xtal32k", label: "32.768kHz 晶振", default: true, claims: ["PA10", "PA11"] }
    ],
    resources: [
      { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组 (PB)" },
        signals: [
          { name: "SCK", pins: ["PA13", "PB13"] },
          { name: "MOSI", pins: ["PA14", "PB14"] },
          { name: "MISO", pins: ["PA15", "PB15"] }
        ] },
      { id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PB7", "PA14"] }, { name: "RXD", pins: ["PB4", "PA15"] } ] },
      { id: "UART1", category: "UART", label: "UART1", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PA9", "PB13"] }, { name: "RXD", pins: ["PA8", "PB12"] } ] },
      { id: "UART2", category: "UART", label: "UART2", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PA7", "PB23"] }, { name: "RXD", pins: ["PA6", "PB22"] } ] },
      { id: "UART3", category: "UART", label: "UART3", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PA5", "PB21"] }, { name: "RXD", pins: ["PA4", "PB20"] } ] },
      { id: "I2C", category: "I2C", label: "I2C", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "SCL", pins: ["PB13", "PB21"] }, { name: "SDA", pins: ["PB12", "PB20"] } ] },
      { id: "TMR0", category: "TIMER", label: "TMR0", signals: [ { name: "TMR0/PWM0/CAP0", pins: ["PA9", "PB23"] } ] },
      { id: "TMR1", category: "TIMER", label: "TMR1", signals: [ { name: "TMR1/PWM1/CAP1", pins: ["PA10", "PB10"] } ] },
      { id: "TMR2", category: "TIMER", label: "TMR2", signals: [ { name: "TMR2/PWM2/CAP2", pins: ["PA11", "PB11"] } ] },
      { id: "TMR3", category: "TIMER", label: "TMR3", signals: [ { name: "TMR3/PWM3/CAP3", pins: ["PB22", "PA2"] } ] },
      { id: "PWM4",  category: "PWM", label: "PWM4",  signals: [ { name: "PWM4",  pins: ["PA12", "PA6"] } ] },
      { id: "PWM5",  category: "PWM", label: "PWM5",  signals: [ { name: "PWM5",  pins: ["PA13", "PA7"] } ] },
      { id: "PWM6",  category: "PWM", label: "PWM6",  signals: [ { name: "PWM6",  pins: ["PB0"] } ] },
      { id: "PWM7",  category: "PWM", label: "PWM7",  signals: [ { name: "PWM7",  pins: ["PB4", "PB1"] } ] },
      { id: "PWM8",  category: "PWM", label: "PWM8",  signals: [ { name: "PWM8",  pins: ["PB6", "PB2"] } ] },
      { id: "PWM9",  category: "PWM", label: "PWM9",  signals: [ { name: "PWM9",  pins: ["PB7", "PB3"] } ] },
      { id: "PWM10", category: "PWM", label: "PWM10", signals: [ { name: "PWM10", pins: ["PB14"] } ] },
      { id: "PWM11", category: "PWM", label: "PWM11", signals: [ { name: "PWM11", pins: ["PB23"] } ] },
      { id: "AIN0",  category: "ADC", label: "AIN0 (TK0)",   signals: [ { name: "AIN0",  pins: ["PA4"] } ] },
      { id: "AIN1",  category: "ADC", label: "AIN1 (TK1)",   signals: [ { name: "AIN1",  pins: ["PA5"] } ] },
      { id: "AIN2",  category: "ADC", label: "AIN2 (TK2)",   signals: [ { name: "AIN2",  pins: ["PA12"] } ] },
      { id: "AIN3",  category: "ADC", label: "AIN3 (TK3)",   signals: [ { name: "AIN3",  pins: ["PA13"] } ] },
      { id: "AIN4",  category: "ADC", label: "AIN4 (TK4)",   signals: [ { name: "AIN4",  pins: ["PA14"] } ] },
      { id: "AIN5",  category: "ADC", label: "AIN5 (TK5)",   signals: [ { name: "AIN5",  pins: ["PA15"] } ] },
      { id: "AIN6",  category: "ADC", label: "AIN6 (TK6)",   signals: [ { name: "AIN6",  pins: ["PA3"] } ] },
      { id: "AIN7",  category: "ADC", label: "AIN7 (TK7)",   signals: [ { name: "AIN7",  pins: ["PA2"] } ] },
      { id: "AIN8",  category: "ADC", label: "AIN8 (TK8)",   signals: [ { name: "AIN8",  pins: ["PA1"] } ] },
      { id: "AIN9",  category: "ADC", label: "AIN9 (TK9)",   signals: [ { name: "AIN9",  pins: ["PA0"] } ] },
      { id: "AIN10", category: "ADC", label: "AIN10 (TK10)", signals: [ { name: "AIN10", pins: ["PA6"] } ] },
      { id: "AIN11", category: "ADC", label: "AIN11 (TK11)", signals: [ { name: "AIN11", pins: ["PA7"] } ] },
      { id: "AIN12", category: "ADC", label: "AIN12 (TK12)", signals: [ { name: "AIN12", pins: ["PA8"] } ] },
      { id: "AIN13", category: "ADC", label: "AIN13 (TK13)", signals: [ { name: "AIN13", pins: ["PA9"] } ] },
      { id: "USB1", category: "USB", label: "USB1",
        signals: [ { name: "D-", pins: ["PB10"] }, { name: "D+", pins: ["PB11"] } ] },
      { id: "USB2", category: "USB", label: "USB2",
        signals: [ { name: "D-", pins: ["PB12"] }, { name: "D+", pins: ["PB13"] } ] },
      { id: "GPIO", category: "GPIO", label: "GPIO", perPin: true }
    ]
  };
});
```

`index.html` 追加（在 app.js 之前的位置先加，app 未创建不影响）：

```html
  <script src="chips/registry.js"></script>
  <script src="chips/wch-ch582m-qfn48.js"></script>
```

- [ ] **Step 2: 写真实规则测试**（追加到 exit 之前；这些规则全部出自 spec §10）

```js
const CHIP = require("../chips/wch-ch582m-qfn48.js");

console.log("\n=== Task 5: CH582M 数据 + 真实规则 ===");
t("数据通过 validateChip（含 groupSwitch 2 落脚点规则）", () => {
  const r = Model.validateChip(CHIP);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
t("规则①：默认调试口锁 PB14/PB15；SPI0 映射组不可用", () => {
  const s = Avail.defaultState(CHIP);
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB14").status, "locked");
  const c = Avail.candidatePins(CHIP, s, "SPI0", true);
  assert.deepStrictEqual(c.signals.MOSI, []);            // PB14 被调试口锁
  assert.deepStrictEqual(c.signals.MISO, []);            // PB15
  assert.deepStrictEqual(c.signals.SCK, ["PB13"]);       // PB13 没被占
});
t("规则②：关调试口 → SPI0 可切 PB 组；重开后 2 处冲突", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  const r = Avail.assign(CHIP, s, "SPI0", { group: true, pins: { SCK: "PB13", MOSI: "PB14", MISO: "PB15" } });
  assert.strictEqual(r.error, undefined, r.error);
  s = Avail.setConfig(r.state, "debug", true);           // 再打开调试口 → 后发冲突
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB14").status, "conflict");
  assert.strictEqual(pins.get("PB15").status, "conflict");
  assert.strictEqual(pins.get("PB13").status, "assigned");
  const c = Avail.countIO(CHIP, s);
  assert.strictEqual(c.conflict, 2);
});
t("规则③：32K 晶振占 PA10 → TMR1 只剩 PB10；关掉后 PA10 可选", () => {
  let s = Avail.defaultState(CHIP);
  let c = Avail.candidatePins(CHIP, s, "TMR1");
  assert.deepStrictEqual(c.signals["TMR1/PWM1/CAP1"], ["PB10"]);
  s = Avail.setConfig(s, "xtal32k", false);
  c = Avail.candidatePins(CHIP, s, "TMR1");
  assert.deepStrictEqual(c.signals["TMR1/PWM1/CAP1"], ["PA10", "PB10"]);
});
t("规则④：启用 RST → PB23 被锁；PWM11 无候选、TMR0 只剩 PA9", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "rst", true);
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB23").status, "locked");
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM11").signals["PWM11"], []);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "TMR0").signals["TMR0/PWM0/CAP0"], ["PA9"]);
});
t("规则⑤：UART1 占 PA9 后 PWM0/TMR0 不能再用 PA9", () => {
  let s = Avail.defaultState(CHIP);
  const r = Avail.assign(CHIP, s, "UART1", { group: false, pins: { TXD: "PA9", RXD: "PA8" } });
  assert.strictEqual(r.error, undefined);
  const c = Avail.candidatePins(CHIP, r.state, "TMR0");
  assert.deepStrictEqual(c.signals["TMR0/PWM0/CAP0"], ["PB23"]);
});
t("规则⑥：PWM10 唯一落点 PB14——调试口开=不可选，关=可选", () => {
  let s = Avail.defaultState(CHIP);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM10").signals["PWM10"], []);
  s = Avail.setConfig(s, "debug", false);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM10").signals["PWM10"], ["PB14"]);
});
t("导出：CSV 含关键信息且 CH582M 冲突态可导出", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  s = Avail.assign(CHIP, s, "SPI0", { group: true, pins: { SCK: "PB13", MOSI: "PB14", MISO: "PB15" } }).state;
  s = Avail.setConfig(s, "debug", true);
  const csv = Exp.toCSV(CHIP, s);
  assert.ok(csv.includes("⚠️冲突"));
  assert.ok(csv.includes("PB14"));
});
```

- [ ] **Step 3: 运行确认全过** Expected: `33 passed, 0 failed`

- [ ] **Step 4: Commit**

```bash
git add chips/ tests/engine.test.js index.html
git commit -m "feat: CH582M chip data + real-rule test suite"
```

---

### Task 6: 封装几何计算 computePinLayout（可单测）

**Files:**
- Create: `js/render/package-svg.js`
- Modify: `tests/engine.test.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: 无
- Produces: `CPP.PackageSVG.computePinLayout(pkg) -> {body:{x,y,w,h}, pins:[{num,side,x,y,w,h}], viewBox:string}`
  - 坐标单位 mm；`x,y` = 引脚矩形**中心**；`side ∈ "left"|"bottom"|"right"|"top"|"center"`
  - 编号规则：`quad` 逆时针（左自上而下→下自左而右→右自下而上→上自右而左）；`dual` 两侧、右列自下而上；`dual-split` 左 n 右 m

- [ ] **Step 1: 写失败测试**（追加）

```js
const Pkg = require("../js/render/package-svg.js");

console.log("\n=== Task 6: 封装几何 ===");
t("QFN48：48 脚 + EP，编号方向正确", () => {
  const L = Pkg.computePinLayout(CHIP.package);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 49);                       // 48 + EP
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[12].side, "left");
  assert.ok(byNum[1].y < byNum[12].y);                         // 1 在上、12 在下
  assert.strictEqual(byNum[13].side, "bottom");
  assert.strictEqual(byNum[24].side, "bottom");
  assert.ok(byNum[13].x < byNum[24].x);                        // 下边自左而右
  assert.strictEqual(byNum[25].side, "right");
  assert.ok(byNum[25].y > byNum[36].y);                        // 右边自下而上
  assert.strictEqual(byNum[37].side, "top");
  assert.ok(byNum[37].x > byNum[48].x);                        // 上边自右而左
  assert.strictEqual(byNum.EP.side, "center");
});
t("QFN48：横向引脚间距 = pitch", () => {
  const L = Pkg.computePinLayout(CHIP.package);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.ok(Math.abs((byNum[2].y - byNum[1].y) - 0.35) < 1e-9);
});
t("dual：SOP8 右列自下而上", () => {
  const pkg = { family: "dual", style: "gullwing", pinsPerSide: 4, pitch: 1.27, body: [4, 5] };
  const L = Pkg.computePinLayout(pkg);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 8);
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[5].side, "right");
  assert.ok(byNum[5].y > byNum[8].y);                          // 5 在下、8 在上
});
t("dual-split：SOT-23-5 = 3+2", () => {
  const pkg = { family: "dual-split", style: "gullwing", counts: [3, 2], pitch: 0.95, body: [3, 1.6] };
  const L = Pkg.computePinLayout(pkg);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 5);
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[4].side, "right");
  assert.ok(byNum[4].y > byNum[5].y);
});
```

- [ ] **Step 2: 运行确认失败**

- [ ] **Step 3: 实现几何部分**

创建 `js/render/package-svg.js`：

```js
/* 封装渲染：几何计算 + SVG 生成（零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.PackageSVG = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 均布中心位置：count 个引脚沿长度 length 排列，返回各中心坐标（从 0 端起）
  function centers(count, length, pitch) {
    if (count <= 0) return [];
    var margin = (length - (count - 1) * pitch) / 2;
    var arr = [];
    for (var i = 0; i < count; i++) arr.push(margin + i * pitch);
    return arr;
  }

  function computePinLayout(pkg) {
    var W = pkg.body[0], L = pkg.body[1], pitch = pkg.pitch;
    var padOut = Math.max(pkg.leadLength || 0, Math.max(0.6, pitch * 1.4)); // 引脚矩形伸出/占位长
    var padAcross = Math.max(0.18, pitch * 0.5);                            // 引脚矩形宽
    var pins = [];

    function addLeft(nums) {
      var ys = centers(nums.length, L, pitch);
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "left", x: 0, y: ys[i], w: padOut, h: padAcross });
      });
    }
    function addRight(nums) {   // nums 按"自下而上"顺序传入
      var ys = centers(nums.length, L, pitch).reverse();   // reverse 后 index0 = 最下
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "right", x: W, y: ys[i], w: padOut, h: padAcross });
      });
    }
    function addTop(nums) {     // nums 按"自右而左"顺序传入
      var xs = centers(nums.length, W, pitch).reverse();   // index0 = 最右
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "top", x: xs[i], y: 0, w: padAcross, h: padOut });
      });
    }
    function addBottom(nums) {  // nums 按"自左而右"顺序传入
      var xs = centers(nums.length, W, pitch);
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "bottom", x: xs[i], y: L, w: padAcross, h: padOut });
      });
    }
    function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }

    if (pkg.family === "quad") {
      var n = pkg.pinsPerSide;
      addLeft(range(1, n));
      addBottom(range(n + 1, 2 * n));
      addRight(range(2 * n + 1, 3 * n));
      addTop(range(3 * n + 1, 4 * n));
    } else if (pkg.family === "dual") {
      var m = pkg.pinsPerSide;
      addLeft(range(1, m));
      addRight(range(m + 1, 2 * m));
    } else if (pkg.family === "dual-split") {
      var a = pkg.counts[0], b = pkg.counts[1];
      addLeft(range(1, a));
      addRight(range(a + 1, a + b));
    }

    if (pkg.thermalPad) {
      pins.push({ num: "EP", side: "center", x: W / 2, y: L / 2, w: W * 0.5, h: L * 0.5 });
    }

    var margin = padOut + 0.8;
    var viewBox = [-margin, -margin, W + 2 * margin, L + 2 * margin].join(" ");
    return { body: { x: 0, y: 0, w: W, h: L }, pins: pins, viewBox: viewBox, padOut: padOut };
  }

  return { computePinLayout: computePinLayout };
});
```

`index.html` 追加：`<script src="js/render/package-svg.js"></script>`

- [ ] **Step 4: 运行确认全过** Expected: `37 passed, 0 failed`

- [ ] **Step 5: Commit**

```bash
git add js/render/package-svg.js tests/engine.test.js index.html
git commit -m "feat: parametric package geometry (quad/dual/dual-split)"
```

---

### Task 7: SVG 渲染 renderPackage + 引脚状态样式

**Files:**
- Modify: `js/render/package-svg.js`
- Modify: `css/app.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: `computePinLayout`
- Produces: `CPP.PackageSVG.renderPackage(def) -> <svg>`；svg 内每个引脚为 `<g class="pin" data-pin="PA13" data-num="13">`（内含 `<rect class="pin-pad">`、`<text class="pin-name">`、`<text class="pin-num">`、`<title>`），本体为 `<rect class="pkg-body">`，EP 为 `<g class="pin" data-pin="GND" data-num="EP">`

- [ ] **Step 1: 实现 renderPackage**（追加到 package-svg.js，return 前）

```js
  var SVGNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function renderPackage(def) {
    var pkg = def.package;
    var layout = computePinLayout(pkg);
    var svg = el("svg", { viewBox: layout.viewBox, "data-chip": def.chip.name });
    var nameByNum = {};
    (def.pins || []).forEach(function (p) { nameByNum[p.num] = p.name; });

    svg.appendChild(el("rect", { class: "pkg-body", x: 0, y: 0, width: layout.body.w, height: layout.body.h, rx: 0.25 }));

    layout.pins.forEach(function (pin) {
      var g = el("g", { class: "pin", "data-num": pin.num });
      var name = nameByNum[pin.num] || String(pin.num);
      g.setAttribute("data-pin", name);
      g.appendChild(el("rect", { class: "pin-pad",
        x: pin.x - pin.w / 2, y: pin.y - pin.h / 2, width: pin.w, height: pin.h, rx: 0.06 }));
      var tName = el("text", { class: "pin-name" });
      var tNum = el("text", { class: "pin-num" });
      if (pin.side === "center") {
        tName.setAttribute("x", pin.x); tName.setAttribute("y", pin.y);
        tName.setAttribute("text-anchor", "middle");
        tName.textContent = pin.num + "";
      } else if (pin.side === "left") {
        tName.setAttribute("x", pin.x + pin.w / 2 + 0.25); tName.setAttribute("y", pin.y + 0.14);
        tNum.setAttribute("x", pin.x - pin.w / 2 - 0.15); tNum.setAttribute("y", pin.y + 0.14);
        tNum.setAttribute("text-anchor", "end");
        tName.textContent = name;
        tNum.textContent = pin.num;
      } else if (pin.side === "right") {
        tName.setAttribute("x", pin.x - pin.w / 2 - 0.25); tName.setAttribute("y", pin.y + 0.14);
        tName.setAttribute("text-anchor", "end");
        tNum.setAttribute("x", pin.x + pin.w / 2 + 0.15); tNum.setAttribute("y", pin.y + 0.14);
        tName.textContent = name;
        tNum.textContent = pin.num;
      } else if (pin.side === "bottom") {
        tName.setAttribute("x", pin.x); tName.setAttribute("y", pin.y - pin.h / 2 - 0.2);
        tName.setAttribute("text-anchor", "middle");
        tName.setAttribute("writing-mode", "vertical-rl");
        tNum.setAttribute("x", pin.x); tNum.setAttribute("y", pin.y + pin.h / 2 + 0.75);
        tNum.setAttribute("text-anchor", "middle");
        tName.textContent = name;
        tNum.textContent = pin.num;
      } else { /* top */
        tName.setAttribute("x", pin.x); tName.setAttribute("y", pin.y + pin.h / 2 + 0.85);
        tName.setAttribute("text-anchor", "middle");
        tName.setAttribute("writing-mode", "vertical-rl");
        tNum.setAttribute("x", pin.x); tNum.setAttribute("y", pin.y - pin.h / 2 - 0.15);
        tNum.setAttribute("text-anchor", "middle");
        tName.textContent = name;
        tNum.textContent = pin.num;
      }
      var title = document.createElementNS(SVGNS, "title");
      title.textContent = name;
      g.appendChild(tName); g.appendChild(tNum); g.appendChild(title);
      svg.appendChild(g);
    });

    var label = el("text", { class: "chip-label", x: pkg.body[0] / 2, y: pkg.body[1] / 2 - 0.15, "text-anchor": "middle" });
    label.textContent = def.chip.name + " " + def.chip.package;
    svg.appendChild(label);
    return svg;
  }
```
并把 return 改为：`return { computePinLayout: computePinLayout, renderPackage: renderPackage };`

- [ ] **Step 2: 追加样式**（css/app.css 末尾）

```css
/* ===== 封装图与引脚状态 ===== */
svg text { font-family: "Microsoft YaHei", system-ui, sans-serif; user-select: none; }
.pkg-body { fill: #f1f3f4; stroke: #80868b; stroke-width: 0.05; }
.chip-label { font-size: 0.42px; fill: #5f6368; font-weight: 600; }
.pin { cursor: pointer; }
.pin-pad { fill: #e8eaed; stroke: #9aa0a6; stroke-width: 0.04; }
.pin-name { font-size: 0.30px; fill: #202124; }
.pin-num { font-size: 0.26px; fill: #9aa0a6; }
.pin .pin-pad { transition: fill .12s; }
.pin:hover .pin-pad { stroke: #1a73e8; stroke-width: 0.08; }

.pin[data-status="free"] .pin-pad { fill: #e8eaed; }
.pin[data-status="locked"] .pin-pad { fill: #bdc1c6; stroke-dasharray: 0.1 0.08; }
.pin[data-status="fixed"] .pin-pad { fill: #3c4043; }
.pin[data-status="fixed"] { cursor: default; }
.pin[data-status="conflict"] .pin-pad { fill: #ea4335; }
.pin[data-status="assigned"] .pin-pad { fill: #9aa0a6; }
.pin[data-status="assigned"][data-cat="UART"]  .pin-pad { fill: #4285f4; }
.pin[data-status="assigned"][data-cat="SPI"]   .pin-pad { fill: #a142f4; }
.pin[data-status="assigned"][data-cat="I2C"]   .pin-pad { fill: #00acc1; }
.pin[data-status="assigned"][data-cat="PWM"]   .pin-pad { fill: #fa903e; }
.pin[data-status="assigned"][data-cat="ADC"]   .pin-pad { fill: #f9ab00; }
.pin[data-status="assigned"][data-cat="USB"]   .pin-pad { fill: #34a853; }
.pin[data-status="assigned"][data-cat="GPIO"]  .pin-pad { fill: #7cb342; }
.pin[data-status="assigned"][data-cat="TIMER"] .pin-pad { fill: #8d6e63; }
.pin[data-status="assigned"][data-cat="系统"]  .pin-pad { fill: #5f6368; }
```

- [ ] **Step 3: 手动验证渲染（临时探针）**

在 `index.html` 的 `</body>` 前临时加：

```html
  <script>
    // 临时验证：渲染 CH582M 空图
    var svg = window.CPP.PackageSVG.renderPackage(window.CHIP_REGISTRY[0]);
    document.getElementById("chip-host").innerHTML = "";
    document.getElementById("chip-host").appendChild(svg);
  </script>
```

双击打开 `index.html`，逐项检查：
- [ ] 正方形封装，四边各 12 个引脚，中央有 EP 方块
- [ ] 1 脚在左上角（编号 1），左侧自上而下 1→12、下边 13→24、右边 25→36（自下而上）、上边 37→48（自右而左）
- [ ] 每个引脚显示名称（内侧）与脚号（外侧小字），**标签无重叠**（Review Focus ④）
- [ ] 中央显示 "CH582M QFN48"
- [ ] 悬停任意引脚出现原生 tooltip

验证完删除这段临时脚本（由 Task 9 的 app.js 正式接管）。

- [ ] **Step 4: Commit**

```bash
git add js/render/package-svg.js css/app.css index.html
git commit -m "feat: SVG package renderer with pin state styling"
```

---

### Task 8: 缩放平移 interactions.js

**Files:**
- Create: `js/render/interactions.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: 无（操作传入的 `<svg>`）
- Produces: `CPP.Interactions.enablePanZoom(svg)`；拖动超过 3px 时在 svg 上设 `data-dragged="1"`（供点击处理器忽略拖拽后的误点击），下一次 pointerdown 时清除

- [ ] **Step 1: 实现**

```js
/* 缩放/平移（零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Interactions = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function enablePanZoom(svg) {
    var dragging = false, last = null, moved = 0;

    function readVB() {
      var a = (svg.getAttribute("viewBox") || "0 0 10 10").split(/\s+/).map(Number);
      return { x: a[0], y: a[1], w: a[2], h: a[3] };
    }
    function writeVB(vb) {
      svg.setAttribute("viewBox", [vb.x, vb.y, vb.w, vb.h].join(" "));
    }
    function toSvgPoint(e, vb) {
      var r = svg.getBoundingClientRect();
      return { x: vb.x + (e.clientX - r.left) / r.width * vb.w,
               y: vb.y + (e.clientY - r.top) / r.height * vb.h };
    }

    svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      var vb = readVB();
      var f = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      var p = toSvgPoint(e, vb);
      vb.x = p.x - (p.x - vb.x) * f;
      vb.y = p.y - (p.y - vb.y) * f;
      vb.w *= f; vb.h *= f;
      writeVB(vb);
    }, { passive: false });

    svg.addEventListener("pointerdown", function (e) {
      svg.removeAttribute("data-dragged");
      dragging = true; moved = 0;
      last = { x: e.clientX, y: e.clientY };
      svg.setPointerCapture(e.pointerId);
    });
    svg.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var vb = readVB();
      var k = vb.w / svg.clientWidth;
      var dx = (e.clientX - last.x) * k, dy = (e.clientY - last.y) * k;
      moved += Math.abs(e.clientX - last.x) + Math.abs(e.clientY - last.y);
      vb.x -= dx; vb.y -= dy;
      last = { x: e.clientX, y: e.clientY };
      if (moved > 3) svg.setAttribute("data-dragged", "1");
      writeVB(vb);
    });
    svg.addEventListener("pointerup", function () { dragging = false; });
  }

  return { enablePanZoom: enablePanZoom };
});
```

`index.html` 追加：`<script src="js/render/interactions.js"></script>`

- [ ] **Step 2: 手动验证**（沿用 Task 7 的临时探针脚本，在 append 后加一行 `window.CPP.Interactions.enablePanZoom(svg);`）

双击打开：
- [ ] 滚轮缩放以鼠标位置为中心，可放大看清引脚名
- [ ] 按住拖动可平移；拖完松手不会触发任何点击（`data-dragged` 生效留给 Task 9 联动）

- [ ] **Step 3: Commit**

```bash
git add js/render/interactions.js index.html
git commit -m "feat: pan & zoom for package view"
```

---

### Task 9: app.js 装配（一）：渲染、点脚分配、解除、撤销

**Files:**
- Create: `js/app.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: 全部引擎与渲染模块 + `window.CHIP_REGISTRY`
- Produces: 全局应用行为（无对外 API）；本任务实现：加载芯片→渲染→引脚状态上色→点引脚弹菜单→分配/解除/GPIO→撤销（Ctrl+Z）→消息日志 `#log`

- [ ] **Step 1: 实现 app.js**

```js
/* 应用装配：状态、渲染、交互（零依赖） */
(function () {
  "use strict";
  var CPP = window.CPP;
  var def = (window.CHIP_REGISTRY || [])[0];
  var v = CPP.Model.validateChip(def);
  if (!v.ok) {
    document.body.innerHTML = "<pre>芯片数据校验失败：\n" + v.errors.join("\n") + "</pre>";
    return;
  }

  var history = CPP.Availability.createHistory(CPP.Availability.defaultState(def));
  var svgEl = null;
  var menuEl = null;

  function state() { return history.current(); }
  function commit(s) { history.push(s); redraw(); }
  function log(msg) {
    var el = document.getElementById("log");
    if (el) el.textContent = msg;
  }

  // ---------- 渲染 ----------
  function redraw() {
    renderChip();
    renderLeftPanel();
    renderRightPanel();
    renderStatusBar();
  }

  function renderChip() {
    var host = document.getElementById("chip-host");
    if (!svgEl) {
      host.innerHTML = "";
      svgEl = CPP.PackageSVG.renderPackage(def);
      host.appendChild(svgEl);
      CPP.Interactions.enablePanZoom(svgEl);
      svgEl.addEventListener("click", onSvgClick);
    }
    var pins = CPP.Availability.computePins(def, state());
    svgEl.querySelectorAll("g.pin").forEach(function (g) {
      var name = g.getAttribute("data-pin");
      var e = pins.get(name);
      if (!e) return;
      g.setAttribute("data-status", e.status);
      var cat = "";
      if (e.status === "locked") cat = "系统";
      if (e.status === "assigned" || e.status === "conflict") cat = categoryOf(e.owners);
      g.setAttribute("data-cat", cat);
      var title = g.querySelector("title");
      if (title) title.textContent = tooltipText(name, e);
    });
  }

  function categoryOf(owners) {
    var o = owners.find(function (x) { return x.type !== "config"; }) || owners[0];
    if (o.type === "gpio") return "GPIO";
    if (o.type === "config") return "系统";
    var res = CPP.Availability.findResource(def, o.id);
    return res ? res.category : "";
  }
  function ownerDesc(o) {
    if (o.type === "gpio") return "GPIO" + (o.alias ? "(" + o.alias + ")" : "");
    if (o.type === "resource") return o.label + "·" + o.signal;
    return o.label;
  }
  function tooltipText(name, e) {
    var p = def.pins.find(function (x) { return x.name === name; });
    var lines = [p.num + ": " + p.name];
    if (p.alts && p.alts.length) lines.push("复用: " + p.alts.join(" / "));
    if (e.status === "free") lines.push("状态: 空闲");
    else if (e.status === "fixed") lines.push("状态: 电源/固定");
    else if (e.status === "locked") lines.push("状态: 被「" + e.owners[0].label + "」锁定");
    else if (e.status === "assigned") lines.push("状态: " + ownerDesc(e.owners[0]));
    else if (e.status === "conflict") lines.push("⚠️ 冲突: " + e.owners.map(ownerDesc).join(" + "));
    if (p.note) lines.push("注: " + p.note);
    return lines.join("\n");
  }

  // ---------- 引脚点击菜单 ----------
  function onSvgClick(ev) {
    if (svgEl.getAttribute("data-dragged") === "1") return;
    var g = ev.target.closest ? ev.target.closest("g.pin") : null;
    if (!g) return;
    openPinMenu(g.getAttribute("data-pin"), ev);
  }

  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  document.addEventListener("pointerdown", function (e) {
    if (menuEl && !menuEl.contains(e.target)) closeMenu();
  }, true);

  function openPinMenu(pinName, ev) {
    closeMenu();
    var items = buildPinMenuItems(pinName);
    var div = document.createElement("div");
    div.className = "pin-menu";
    items.forEach(function (it) {
      var el = document.createElement(it.action ? "button" : "div");
      el.className = "menu-item" + (it.action ? "" : " menu-info");
      el.textContent = it.label;
      if (it.disabled) { el.classList.add("disabled"); el.disabled = true; }
      if (it.action) el.addEventListener("click", function () { closeMenu(); it.action(); });
      div.appendChild(el);
    });
    document.body.appendChild(div);
    var x = Math.min(ev.clientX, window.innerWidth - 300);
    var y = Math.min(ev.clientY, window.innerHeight - div.offsetHeight - 20);
    div.style.left = x + "px"; div.style.top = y + "px";
    menuEl = div;
  }

  function buildPinMenuItems(pinName) {
    var out = [];
    var e = CPP.Availability.computePins(def, state()).get(pinName);
    if (!e || e.fixed) { out.push({ label: "电源/固定引脚，不可分配" }); return out; }

    if (e.status === "conflict") {
      out.push({ label: "⚠️ 冲突: " + e.owners.map(ownerDesc).join(" + ") });
      e.owners.forEach(function (o) {
        if (o.type === "resource") out.push({ label: "解除 " + o.label, action: function () {
          commit(CPP.Availability.removeResource(state(), o.id)); log("已解除 " + o.label);
        } });
        if (o.type === "config") out.push({ label: "关闭开关「" + o.label + "」", action: function () {
          commit(CPP.Availability.setConfig(state(), o.id, false)); log("已关闭「" + o.label + "」");
        } });
      });
      return out;
    }
    if (e.status === "locked") {
      out.push({ label: "被系统占用：「" + e.owners[0].label + "」" });
      out.push({ label: "（可在左侧关闭该开关释放）" });
      return out;
    }
    if (e.status === "assigned") {
      var o = e.owners[0];
      out.push({ label: "当前: " + ownerDesc(o) });
      if (o.type === "resource") out.push({ label: "解除分配", action: function () {
        commit(CPP.Availability.removeResource(state(), o.id));
        log("已解除 " + o.label + "（" + ownerDesc(o) + "）");
      } });
      if (o.type === "gpio") out.push({ label: "清除 GPIO 标签", action: function () {
        commit(CPP.Availability.setGpio(state(), pinName, "")); log("已清除 " + pinName);
      } });
      return out;
    }

    // 空闲脚：列出所有可落在它上面的资源信号
    (def.resources || []).forEach(function (res) {
      if (res.perPin) return;
      (res.signals || []).forEach(function (s) {
        var cand = CPP.Availability.candidatePins(def, state(), res.id);
        if (!cand || cand.signals[s.name].indexOf(pinName) < 0) return;
        out.push({ label: res.label + " · " + s.name, action: function () {
          assignResourceAtPin(res.id, s.name, pinName);
        } });
      });
    });
    out.push({ label: "设为 GPIO…", action: function () {
      var alias = window.prompt("给 " + pinName + " 起个别名（如 FLASH_CS）：", "");
      if (alias === null) return;
      commit(CPP.Availability.setGpio(state(), pinName, alias || "GPIO"));
      log(pinName + " → GPIO" + (alias ? "(" + alias + ")" : ""));
    } });
    return out;
  }

  function assignResourceAtPin(rid, sigName, pinName) {
    var res = CPP.Availability.findResource(def, rid);
    var cand = CPP.Availability.candidatePins(def, state(), rid);
    var choice = { group: cand.group, pins: {} };
    for (var i = 0; i < res.signals.length; i++) {
      var s = res.signals[i];
      if (s.name === sigName) { choice.pins[s.name] = pinName; continue; }
      var opt = cand.signals[s.name];
      if (!opt || opt.length === 0) { alert("无法分配 " + res.label + "：" + s.name + " 没有可用落脚点"); return; }
      choice.pins[s.name] = opt[0];
    }
    var r = CPP.Availability.assign(def, state(), rid, choice);
    if (r.error) { alert("分配失败：" + r.error); return; }
    commit(r.state);
    log("已分配 " + res.label + " → " + Object.keys(choice.pins).map(function (k) {
      return k + "=" + choice.pins[k];
    }).join(", "));
  }

  // ---------- 左右面板 / 状态栏（本任务先给最简版，Task 10 扩展） ----------
  function renderLeftPanel() { /* Task 10 实现 */ }
  function renderRightPanel() {
    var host = document.getElementById("right-panel");
    var pins = CPP.Availability.computePins(def, state());
    var rows = [];
    Object.keys(state().resources).forEach(function (rid) {
      var res = CPP.Availability.findResource(def, rid);
      var asg = state().resources[rid];
      rows.push(res.label + "：" + Object.keys(asg.pins).map(function (s) {
        return s + "=" + asg.pins[s];
      }).join(", "));
    });
    Object.keys(state().gpio).forEach(function (pin) {
      rows.push("GPIO：" + pin + " = " + state().gpio[pin]);
    });
    host.innerHTML = "<h3>已分配</h3>" + (rows.length ? rows.map(function (r) { return "<div class='row'>" + r + "</div>"; }).join("") : "<p class='hint'>（还没分配任何资源）</p>");
  }
  function renderStatusBar() {
    var c = CPP.Availability.countIO(def, state());
    document.getElementById("statusbar").textContent =
      "芯片: " + def.chip.name + " (" + def.chip.package + ")　已用 " + c.used + "　锁定 " + c.locked +
      "　冲突 " + c.conflict + "　剩余 " + c.free + " / 共 " + c.total + " IO";
  }

  // ---------- 撤销 ----------
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (history.canUndo()) { history.undo(); redraw(); log("已撤销"); }
    }
  });

  redraw();
  log("就绪：点击封装图上的引脚开始分配。");
})();
```

追加 CSS（app.css 末尾）：

```css
.pin-menu { position: fixed; z-index: 50; min-width: 200px; max-width: 290px; background: #fff;
  border: 1px solid #dadce0; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.18); padding: 4px; }
.menu-item { display: block; width: 100%; text-align: left; background: none; border: none;
  padding: 6px 10px; font-size: 13px; border-radius: 4px; cursor: pointer; color: #202124; }
.menu-item:hover { background: #e8f0fe; }
.menu-item.menu-info { color: #5f6368; cursor: default; }
.menu-item.menu-info:hover { background: none; }
#right-panel h3 { margin: 4px 0 8px; font-size: 13px; color: #5f6368; }
#right-panel .row { padding: 3px 0; border-bottom: 1px dashed #eee; }
```

- [ ] **Step 2: 更新 index.html**（删掉 Task 7 的临时探针脚本，加 app.js）

`</body>` 前最终为：

```html
  <script src="js/engine/model.js"></script>
  <script src="js/engine/availability.js"></script>
  <script src="js/engine/exporters.js"></script>
  <script src="js/render/package-svg.js"></script>
  <script src="js/render/interactions.js"></script>
  <script src="chips/registry.js"></script>
  <script src="chips/wch-ch582m-qfn48.js"></script>
  <script src="js/app.js"></script>
```

- [ ] **Step 3: 手动验证（核心流程）**

双击 `index.html`：
- [ ] 封装图出现，调试口 PB14/PB15 深灰+虚边（locked）、电源脚近黑
- [ ] 点 PB13 → 菜单出现 "SPI0·SCK" 等项；点它 → SPI0 三根线落 PB13/14/15？——**预期失败**：PB14/15 被调试口锁，app 应弹"无法分配 SPI0：MOSI 没有可用落脚点"
- [ ] 点 PB13 → "SPI0·SCK" 分配失败（同上）；改点 PA13 → SPI0 落到 PA13/14/15，三脚变紫色，右栏出现 "SPI0: SCK=PA13, MOSI=PA14, MISO=PA15"
- [ ] 点空闲脚 PB0 → "设为 GPIO…" → 输入 FLASH_CS → 引脚变灰绿；tooltip 显示 GPIO(FLASH_CS)
- [ ] 点 PA13 → "当前: SPI0·SCK" → "解除分配" → 三脚同时释放
- [ ] Ctrl+Z 依次回退刚才的操作
- [ ] 底部状态栏数字随操作实时变化

- [ ] **Step 4: Commit**

```bash
git add js/app.js css/app.css index.html
git commit -m "feat: app assembly - pin click assign/unassign/GPIO + undo"
```

---

### Task 10: app.js 装配（二）：左栏资源目录、全局开关、冲突横幅

**Files:**
- Modify: `js/app.js`
- Modify: `css/app.css`

**Interfaces:**
- Consumes: Task 9 的 `redraw/commit/state/log`
- Produces: 左栏（资源按类别分组 + 系统开关区）、右栏扩展（每条已分配资源带"解除"与"整组切换"按钮）、冲突横幅（`#conflict-banner` 显示 N 处冲突与快捷处理）

- [ ] **Step 1: 实现 renderLeftPanel**

替换 `renderLeftPanel` 桩为：

```js
  function renderLeftPanel() {
    var host = document.getElementById("left-panel");
    var html = "";
    // 系统开关
    html += "<h3>系统配置</h3>";
    (def.globalConfigs || []).forEach(function (c) {
      var on = state().configs[c.id];
      html += "<label class='cfg'><input type='checkbox' data-cfg='" + c.id + "'" + (on ? " checked" : "") + ">" +
              "<span" + (c.note ? " title='" + c.note + "'" : "") + ">" + c.label + "</span></label>";
    });
    // 资源按类别分组
    var groups = {};
    (def.resources || []).forEach(function (r) {
      if (r.perPin) return;
      (groups[r.category] = groups[r.category] || []).push(r);
    });
    Object.keys(groups).forEach(function (cat) {
      html += "<h3>" + cat + "</h3>";
      groups[cat].forEach(function (r) {
        var used = !!state().resources[r.id];
        html += "<div class='res" + (used ? " used" : "") + "' data-rid='" + r.id + "'>" + r.label + "</div>";
      });
    });
    host.innerHTML = html;

    host.querySelectorAll("input[data-cfg]").forEach(function (box) {
      box.addEventListener("change", function () {
        commit(CPP.Availability.setConfig(state(), box.getAttribute("data-cfg"), box.checked));
        log("「" + box.parentNode.textContent.trim() + "」已" + (box.checked ? "启用" : "关闭"));
      });
    });
    host.querySelectorAll(".res").forEach(function (el) {
      el.addEventListener("click", function () { onResourceClick(el.getAttribute("data-rid")); });
    });
  }

  function onResourceClick(rid) {
    var res = CPP.Availability.findResource(def, rid);
    if (state().resources[rid]) {
      commit(CPP.Availability.removeResource(state(), rid));
      log("已解除 " + res.label);
      return;
    }
    var cand = CPP.Availability.candidatePins(def, state(), rid);
    var missing = Object.keys(cand.signals).filter(function (s) { return cand.signals[s].length === 0; });
    if (missing.length) { alert(res.label + " 无法分配：" + missing.join("/") + " 没有可用落脚点"); return; }
    var choice = { group: cand.group, pins: {} };
    Object.keys(cand.signals).forEach(function (s) { choice.pins[s] = cand.signals[s][0]; });
    var r = CPP.Availability.assign(def, state(), rid, choice);
    if (r.error) { alert("分配失败：" + r.error); return; }
    commit(r.state);
    log("已分配 " + res.label + " → " + Object.keys(choice.pins).map(function (k) { return k + "=" + choice.pins[k]; }).join(", "));
  }
```

- [ ] **Step 2: 右栏扩展（资源行带按钮）+ 冲突横幅**

替换 `renderRightPanel` 为：

```js
  function renderRightPanel() {
    var host = document.getElementById("right-panel");
    var html = "<h3>已分配</h3>";
    var ids = Object.keys(state().resources);
    if (!ids.length && !Object.keys(state().gpio).length) html += "<p class='hint'>（还没分配任何资源）</p>";
    ids.forEach(function (rid) {
      var res = CPP.Availability.findResource(def, rid);
      var asg = state().resources[rid];
      html += "<div class='row'><b>" + res.label + "</b>：" +
        Object.keys(asg.pins).map(function (s) { return s + "=" + asg.pins[s]; }).join(", ");
      if (res.groupSwitch) {
        html += " <button class='mini' data-switch='" + rid + "'>" + (asg.group ? "换回默认组" : "改用映射组") + "</button>";
      }
      html += " <button class='mini' data-remove='" + rid + "'>解除</button></div>";
    });
    Object.keys(state().gpio).forEach(function (pin) {
      html += "<div class='row'>GPIO：" + pin + " = " + state().gpio[pin] +
              " <button class='mini' data-cleargpio='" + pin + "'>清除</button></div>";
    });
    host.innerHTML = html;

    host.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        var rid = b.getAttribute("data-remove");
        commit(CPP.Availability.removeResource(state(), rid));
        log("已解除 " + rid);
      });
    });
    host.querySelectorAll("[data-cleargpio]").forEach(function (b) {
      b.addEventListener("click", function () {
        commit(CPP.Availability.setGpio(state(), b.getAttribute("data-cleargpio"), ""));
      });
    });
    host.querySelectorAll("[data-switch]").forEach(function (b) {
      b.addEventListener("click", function () {
        var rid = b.getAttribute("data-switch");
        var res = CPP.Availability.findResource(def, rid);
        var asg = state().resources[rid];
        var cand = CPP.Availability.candidatePins(def, state(), rid, !asg.group);
        var missing = Object.keys(cand.signals).filter(function (s) { return cand.signals[s].length === 0; });
        if (missing.length) { alert("无法切换：" + missing.join("/") + " 在新组没有可用落脚点"); return; }
        var choice = { group: !asg.group, pins: {} };
        Object.keys(cand.signals).forEach(function (s) { choice.pins[s] = cand.signals[s][0]; });
        var r = CPP.Availability.assign(def, state(), rid, choice);
        if (r.error) { alert("切换失败：" + r.error); return; }
        commit(r.state);
        log(res.label + " 已切到" + (choice.group ? "映射组" : "默认组") + " → " +
            Object.keys(choice.pins).map(function (k) { return k + "=" + choice.pins[k]; }).join(", "));
      });
    });
  }

  function renderConflictBanner() {
    var c = CPP.Availability.countIO(def, state());
    var el = document.getElementById("conflict-banner");
    if (c.conflict > 0) {
      el.hidden = false;
      el.textContent = "⚠️ " + c.conflict + " 处冲突：点红色引脚处理（解除占用或关闭相关开关）";
    } else {
      el.hidden = true;
    }
  }
```

并在 `redraw()` 末尾加一行 `renderConflictBanner();`。

进 `redraw` 中调用 `renderConflictBanner()` 后，确保 `renderLeftPanel` 在每次 redraw 时重建（会重建 checkbox，注意 change 事件在重建后重新绑定——本实现已在上方重新绑定）。

追加 CSS：

```css
#left-panel h3 { margin: 10px 0 4px; font-size: 12px; color: #5f6368; }
.cfg { display: flex; gap: 6px; align-items: center; padding: 3px 0; }
.res { padding: 3px 6px; border-radius: 4px; cursor: pointer; }
.res:hover { background: #e8f0fe; }
.res.used { background: #e6f4ea; font-weight: 600; }
button.mini { font-size: 11px; margin-left: 6px; padding: 1px 6px; border: 1px solid #dadce0;
  border-radius: 4px; background: #fff; cursor: pointer; }
button.mini:hover { background: #f1f3f4; }
```

- [ ] **Step 3: 手动验证**

双击 `index.html`：
- [ ] 左栏出现「系统配置」（3 个开关）+ 按类别分组的资源列表
- [ ] 点左栏 "PWM10" → 弹窗提示无法分配（PB14 被调试口锁）；关掉"两线调试接口"开关 → 再点 PWM10 → 成功落到 PB14
- [ ] 重新打开"两线调试接口" → **顶部出现红色冲突横幅"⚠️ 1 处冲突"**，PB14 引脚变红
- [ ] 点红色 PB14 → 菜单给出"解除 PWM10 / 关闭开关「两线调试接口」"两个解决项
- [ ] 左栏点 "SPI0" → 落到 PA13/14/15；右栏 SPI0 行出现"改用映射组"按钮 → 点它 → 提示无法切换（PB14/15 被调试口占）
- [ ] 关调试口后再点"改用映射组" → 整组切到 PB13/14/15
- [ ] 状态栏与横幅数字实时正确

- [ ] **Step 4: Commit**

```bash
git add js/app.js css/app.css
git commit -m "feat: resource panel, global switches, conflict banner"
```

---

### Task 11: 导出 UI、工程导入、SVG 彩蛋、README、终验

**Files:**
- Modify: `js/app.js`
- Modify: `index.html`
- Create: `README.md`

**Interfaces:**
- Consumes: `CPP.Exporters`、现有 svg 元素
- Produces: 顶栏 5 个按钮的可用功能：导出 CSV / 导出 Markdown / 保存工程 / 载入工程 / 导出封装图(SVG)

- [ ] **Step 1: 实现导出/导入**

在 `app.js` 的 `redraw(); log(...)` 之前加入：

```js
  // ---------- 导出 / 导入 ----------
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function baseName() {
    return def.chip.name + "-" + def.chip.package;
  }
  document.getElementById("btn-export-csv").addEventListener("click", function () {
    download(baseName() + "-引脚清单.csv", "\ufeff" + CPP.Exporters.toCSV(def, state()), "text/csv;charset=utf-8");
    log("已导出 CSV 引脚清单");
  });
  document.getElementById("btn-export-md").addEventListener("click", function () {
    download(baseName() + "-引脚清单.md", CPP.Exporters.toMarkdown(def, state()));
    log("已导出 Markdown 引脚清单");
  });
  document.getElementById("btn-export-proj").addEventListener("click", function () {
    download(baseName() + "-工程.json", CPP.Exporters.toProjectJSON(def, state()), "application/json");
    log("已保存工程");
  });
  document.getElementById("btn-export-svg").addEventListener("click", function () {
    if (!svgEl) return;
    var clone = svgEl.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = Array.prototype.map.call(document.styleSheets, function (ss) {
      try { return Array.prototype.map.call(ss.cssRules, function (r) { return r.cssText; }).join("\n"); }
      catch (e) { return ""; }
    }).join("\n");
    clone.insertBefore(style, clone.firstChild);
    download(baseName() + "-封装图.svg", new XMLSerializer().serializeToString(clone), "image/svg+xml");
    log("已导出封装图 SVG（另存为或直接拖进浏览器/文档）");
  });
  document.getElementById("file-import").addEventListener("change", function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      var r = CPP.Exporters.fromProjectJSON(def, String(reader.result));
      if (r.error) { alert("载入失败：" + r.error); log("载入失败：" + r.error); return; }
      commit(r.state);
      log("已载入工程：" + f.name);
    };
    reader.readAsText(f);
    ev.target.value = "";
  });
```

- [ ] **Step 2: 顶栏按钮补全**（index.html 的 header 内加）

```html
    <button id="btn-export-csv">导出 CSV</button>
    <button id="btn-export-md">导出 Markdown</button>
    <button id="btn-export-proj">保存工程</button>
    <label class="btn">载入工程<input type="file" id="file-import" accept=".json" hidden></label>
    <button id="btn-export-svg">导出封装图</button>
```

追加 CSS：`#topbar button, #topbar .btn { padding: 4px 10px; border: 1px solid #dadce0; border-radius: 6px; background: #fff; cursor: pointer; }`

- [ ] **Step 3: 手动终验（对照 spec 全流程 + Review Focus）**

- [ ] **导出 CSV**：Excel 打开不乱码（BOM），列齐全；**在冲突状态下导出**（Review Focus ⑤）：先做出一处冲突再导出，确认"分配功能"列写着 `⚠️冲突`、备注列有说明
- [ ] **导出 Markdown**：贴进记事本/编辑器预览成表格
- [ ] **保存工程 → 刷新页面 → 载入工程**：状态完全还原（分布/开关/别名）
- [ ] **载入损坏文件**（把任意 txt 改后缀 .json 载入）：弹中文错误，不白屏
- [ ] **导出封装图 SVG**：文件可双击用浏览器打开、或拖进 Word/PPT 显示正常
- [ ] Review Focus ④：鼠标滚轮放大后逐边检查标签无重叠
- [ ] 状态栏、横幅、Ctrl+Z 全流程通畅

- [ ] **Step 4: 写 README.md**

```markdown
# 芯片引脚规划器（Chip Pin Planner）

画板前的"引脚沙盘"：在芯片封装图上点选引脚分配功能，冲突资源自动禁用/标红，导出引脚清单用于画原理图。
**不生成代码**，就是资源规划工具。

## 用法
双击 `index.html` 即可（Chrome/Edge，无需安装、无需联网）。
- 点封装图上的引脚 → 弹出可分配功能菜单（灰色项=有冲突/被锁，悬停有原因）
- 点左侧资源目录 → 一键分配到默认落脚点
- 左侧「系统配置」开关控制调试口 / RST / 32K 晶振等系统占用
- 顶栏导出：CSV / Markdown 引脚清单、工程 JSON、封装图 SVG
- Ctrl+Z 撤销

## 开发者
- 零依赖、无构建。引擎（`js/engine/`）是芯片无关纯逻辑；每颗芯片 = `chips/` 下一个数据文件。
- 单测：`node tests/engine.test.js`
- 设计文档：`docs/superpowers/specs/`；实施计划：`docs/superpowers/plans/`
- 新增芯片：照 `chips/wch-ch582m-qfn48.js` 抄一份，按手册填 pins / globalConfigs / resources 即可（schema 见设计文档第 5 节）。
```

- [ ] **Step 5: 全量回归 + Commit**

Run: `node tests/engine.test.js`  Expected: `37 passed, 0 failed`

```bash
git add js/app.js index.html css/app.css README.md
git commit -m "feat: export/import UI, SVG export, README; v1 complete"
```

---

## 计划自检（Self-Review）

- **Spec 覆盖**：数据模型→T1/T2/T3/T5；封装渲染→T6/T7；交互与冲突→T9/T10；导出与存取→T4/T11；目录结构→各任务路径与 spec §9 一致；测试方案→T1-T6 单测 + T7-T11 手动清单；里程碑 M1→T1-T2，M2→T5，M3→T9/T10，M4→T11。**无缺口。**
- **占位符扫描**：所有代码步骤均含完整代码；UI 任务的验证为标准人工清单（每步有可观察预期）。无 TBD/TODO。
- **类型一致性**：`candidatePins` 返回 `{group, signals}` 在 T3 定义、T5/T9/T10 使用一致；`status` 枚举在 T2/T7 一致；`choice={group,pins}` 在 T3/T5/T9/T10 一致。
- **Review Focus**：5 条均已挂入对应任务（见头部说明）。
