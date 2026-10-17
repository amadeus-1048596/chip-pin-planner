# 可选信号（optional signals）+ MODEM / SPI 从机 / RF 开关 · 实施计划（v1.7 · 子项目 #2）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 给引脚规划器引入"信号级可选"通用模型，并完整落地 UART0 MODEM 六信号、SPI0 从机四模式 + 主机可选 SCS、RF 天线开关（PB16-21）。

**Architecture:** 引擎（`js/engine/`，纯函数）承载全部新语义（可选信号拆分、信号级共享映射位、切组/换模时保留可选信号的重建函数、版本闸门 v2），UI 只做渲染与菜单路由；芯片数据按 spec §3 增量扩展。分配存储结构不变（`pins` 本就是按信号存），旧工程照读。

**Tech Stack:** 零依赖原生 JS（UMD-lite），Node 跑单测/fuzz，agent-browser 做真实鼠标验证。无构建、`file://` 可用。

**Spec:** `docs/superpowers/specs/2026-10-10-optional-signals-design.md`

## Global Constraints

- 零依赖、无构建；`file://` 直开（禁 ES modules、禁 fetch）。
- 引擎全纯函数、Node 可测；UI 文本中文；任何进 `innerHTML` 的用户/数据文本必须过 `escapeHtml` 或 `textContent`。
- 芯片事实以 `CH583DS1 V1.9` + `docs/reference/ch582-pin-table.txt` 为准（冲突时逐脚表 + 表7-7 互证）。
- schema：芯片数据 **v2**（引擎上限 2，接受 1）；工程文件**写 2、读 1|2**。
- 既有 124 条单测与 fuzz 不变量必须保持绿；**唯一允许的既有测试改动**是 Task 8 列明的两处（SPI0 模式枚举行为升级）。
- 每个 Task 收尾必须 commit；测试命令一律 `node tests/engine.test.js` / `node tests/fuzz.js`（在 `D:\Code_Project\chip-pin-planner` 下）。
- 实现前先打回退点（Task 1 Step 0）；浏览器验证一律走真实输入路径（agent-browser click，不许 dispatchEvent）。

## Review Focus（最容易被忽略、可能咬人的五类情况 → 各自测试归属）

1. **主组切换不搬动 MODEM**——DSR/DTR 的侧由 RB_PIN_MODEM 独立控制，UART0 换组时它们必须原地不动（Task 5 测试）。
2. **可选信号脚被占 ≠ 资源不可用**——一键分配/色点/引脚菜单三处的可用性口径都只算必选（Task 4 测试组）。
3. **切组/换模式时可选信号保不住**——必须整体中止并说明原因，状态零变化，不留半套分配（Task 5 测试）。
4. **旧工程照读**——无 mode 字段、无 optional 的 v1 文件导入不回归；缺必选信号的新文件被明确拒绝（Task 7 测试）。
5. **同侧约束方向对称**——先配 DTR 后配 DSR 与先配 DSR 后配 DTR 都要拦（Task 2 测试）。

---

### Task 1: 引擎 — 可选信号核心（required/optional 拆分 + canAssign 子集语义）

**Files:**
- Modify: `js/engine/availability.js`（canAssign、candidatePins、新增辅助函数与导出）
- Test: `tests/engine.test.js`（新增 v1.7-1 段落，含 `optChip` 夹具）

**Interfaces:**
- Produces: `requiredSignals(res, modeId)`、`optionalSignals(res, modeId)`（返回信号定义数组）；`canAssign` 新语义：必选必须齐、可选任意子集、非法子集照拒。
- 内部辅助：`allowedPinsFor(res, sigDef, group)`（groupSwitch 主信号随组、`groupKey` 信号与单脚信号不随组）。

- [ ] **Step 0: 打回退点**

```bash
cd /d/Code_Project/chip-pin-planner
git tag v1.6.1
git tag
```
Expected: 看到 v1.3 / v1.5 / v1.6 / v1.6.1。

- [ ] **Step 1: 写失败测试**

在 `tests/engine.test.js` 的最终 `console.log("\n" + pass + ...)` 之前插入：

```js
console.log("\n=== v1.7-1: 可选信号核心 ===");

// 可选信号测试芯片（12 脚）：资源级 optional + 模式级 optional + 信号级共享映射位
const optChip = (() => {
  const c = JSON.parse(JSON.stringify(miniChip));
  c.chip = { vendor: "TEST", name: "OPT", package: "QFN12" };
  c.package.pinsPerSide = 3;
  c.package.body = [3, 3];
  c.pins = [
    { num: 1, name: "PA0", type: "io", alts: [] },
    { num: 2, name: "PA1", type: "io", alts: [] },
    { num: 3, name: "PA2", type: "io", alts: [] },
    { num: 4, name: "PB0", type: "io", alts: [] },
    { num: 5, name: "PB1", type: "io", alts: [] },
    { num: 6, name: "PB2", type: "io", alts: [] },
    { num: 7, name: "PC0", type: "io", alts: [] },
    { num: 8, name: "PC1", type: "io", alts: [] },
    { num: 9, name: "PC2", type: "io", alts: [] },
    { num: 10, name: "PD0", type: "io", alts: [] },
    { num: 11, name: "PD1", type: "io", alts: [] },
    { num: 12, name: "PD2", type: "io", alts: [] },
    { num: "EP", name: "GND", type: "power", alts: [] }
  ];
  c.globalConfigs = [];
  c.resources = [
    { id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
      optional: ["RTS", "DTR", "DSR"],
      signals: [
        { name: "TXD", pins: ["PA1", "PB1"] },
        { name: "RXD", pins: ["PC0", "PD0"] },
        { name: "RTS", pins: ["PA2"] },
        { name: "DTR", pins: ["PC1", "PD1"], groupKey: "UART0_MODEM" },
        { name: "DSR", pins: ["PB0", "PB2"], groupKey: "UART0_MODEM" }
      ] },
    { id: "SPI1x", category: "SPI", label: "SPI1x",
      modes: [
        { id: "m1", label: "模式1", signals: ["SCK", "TX", "CS"], optional: ["CS"] },
        { id: "m2", label: "模式2", signals: ["SCK", "CS"] }
      ],
      signals: [
        { name: "SCK", pins: ["PC2", "PD2"] },
        { name: "TX",  pins: ["PA0"] },
        { name: "CS",  pins: ["PC1", "PD1"] }
      ] },
    { id: "XMEM", category: "MEM", label: "XMEM",
      signals: [
        { name: "A", pins: ["PC1", "PD1"], groupKey: "XM" },
        { name: "B", pins: ["PB0", "PB2"], groupKey: "XM" }
      ] }
  ];
  return c;
})();

t("requiredSignals/optionalSignals：资源级 optional 拆分", () => {
  const res = Avail.findResource(optChip, "UART0");
  assert.deepStrictEqual(Avail.requiredSignals(res).map(s => s.name), ["TXD", "RXD"]);
  assert.deepStrictEqual(Avail.optionalSignals(res).map(s => s.name), ["RTS", "DTR", "DSR"]);
});

t("requiredSignals/optionalSignals：模式级 optional（未列的模式=全必选）", () => {
  const res = Avail.findResource(optChip, "SPI1x");
  assert.deepStrictEqual(Avail.requiredSignals(res, "m1").map(s => s.name).sort(), ["SCK", "TX"]);
  assert.deepStrictEqual(Avail.optionalSignals(res, "m1").map(s => s.name), ["CS"]);
  assert.deepStrictEqual(Avail.requiredSignals(res, "m2").map(s => s.name).sort(), ["CS", "SCK"]);
  assert.deepStrictEqual(Avail.optionalSignals(res, "m2"), []);
});

t("canAssign：必选缺一不可", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("RXD"), r.reason);
});

t("canAssign：可选子集合法（配了/没配都行）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).ok, true);
});

t("canAssign：可选信号落脚点非法仍被拒", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PB2" } });
  assert.strictEqual(r.ok, false);
});

t("canAssign：可选信号也不许双占", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");
  const r = Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("PA2"), r.reason);
});

t("candidatePins：groupSwitch 资源里的单落脚点可选信号不随组切换", () => {
  const s = Avail.defaultState(optChip);
  assert.deepStrictEqual(Avail.candidatePins(optChip, s, "UART0", false).signals.RTS, ["PA2"]);
  assert.deepStrictEqual(Avail.candidatePins(optChip, s, "UART0", true).signals.RTS, ["PA2"]);
});

t("canAssign：groupSwitch 下单脚可选信号任意组都允许", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: true, mode: null, pins: { TXD: "PB1", RXD: "PD0", RTS: "PA2" } }).ok, true);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | tail -3`
Expected: FAIL（`Avail.requiredSignals is not a function` 等），既有 124 条仍 PASS。

- [ ] **Step 3: 实现**

`js/engine/availability.js`，在 `activeSignals` 函数之后新增：

```js
  // 可选信号：放在 signals 清单的同级（无模式资源→资源级；有模式资源→模式级）
  function optionalNamesOf(res, modeId) {
    var modes = modeListOf(res);
    if (!modes) return res.optional || [];
    var mode = modes.find(function (m) { return m.id === resolveModeId(res, modeId); });
    return (mode && mode.optional) || [];
  }
  function requiredSignals(res, modeId) {
    var opt = optionalNamesOf(res, modeId);
    return activeSignals(res, modeId).filter(function (s) { return opt.indexOf(s.name) < 0; });
  }
  function optionalSignals(res, modeId) {
    var opt = optionalNamesOf(res, modeId);
    return activeSignals(res, modeId).filter(function (s) { return opt.indexOf(s.name) >= 0; });
  }
  // 某信号在当前组下的合法落脚点：自有映射位(groupKey)/单脚信号不随主组，只有 groupSwitch 主信号随组
  function allowedPinsFor(res, sigDef, group) {
    if (sigDef.groupKey) return sigDef.pins.slice();
    if (res.groupSwitch && sigDef.pins.length === 2) return [sigDef.pins[group ? 1 : 0]];
    return sigDef.pins.slice();
  }
```

`candidatePins` 里把选项枚举一行替换：

```js
  // 旧：
  // activeSignals(res, mode).forEach(function (s) {
  //   var options = res.groupSwitch ? [s.pins[group ? 1 : 0]] : s.pins.slice();
  //   out.signals[s.name] = options.filter(function (pin) { return !busy[pin]; });
  // });
  activeSignals(res, mode).forEach(function (s) {
    out.signals[s.name] = allowedPinsFor(res, s, group).filter(function (pin) { return !busy[pin]; });
  });
```

`canAssign` 的信号校验段落替换（`var sigs = activeSignals(res, choice.mode);` 到 `return { ok: true };` 之间）：

```js
  var sigs = activeSignals(res, choice.mode);
  var reqNames = requiredSignals(res, choice.mode).map(function (s) { return s.name; });
  var extra = Object.keys(choice.pins || {}).filter(function (k) {
    return !sigs.some(function (s) { return s.name === k; });
  });
  if (extra.length) return { ok: false, reason: "choice 含不属于该模式的信号: " + extra.join(",") };
  var seen = {};
  for (var i = 0; i < sigs.length; i++) {
    var s = sigs[i];
    var pin = choice.pins ? choice.pins[s.name] : undefined;
    if (!pin) {
      if (reqNames.indexOf(s.name) >= 0) return { ok: false, reason: s.name + " 未选择落脚点" };
      continue;   // 可选信号允许不配
    }
    var allowed = allowedPinsFor(res, s, group);
    if (allowed.indexOf(pin) < 0) return { ok: false, reason: s.name + " 不能落到 " + pin + "（该组不可用）" };
    if (busy[pin]) return { ok: false, reason: pin + " 已被占用" };
    if (seen[pin]) return { ok: false, reason: "资源内部信号重复占用 " + pin };
    seen[pin] = true;
  }
  return { ok: true };
```

删除 `resourceStatus` 前遗留的未使用变量：`var LEVEL_SEV = { ok: 0, warn: 1, blocked: 2 };`（整行删除）。

导出行补两个函数：

```js
           pinOptions: pinOptions, bestAssignment: bestAssignment, resourceStatus: resourceStatus,
           requiredSignals: requiredSignals, optionalSignals: optionalSignals,
```

- [ ] **Step 4: 跑测试确认通过 + 全量回归**

Run: `node tests/engine.test.js 2>&1 | tail -2`
Expected: `132 passed, 0 failed`（124 + 8 条新测试）。

- [ ] **Step 5: 提交**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: optional-signal model core - required/optional split + subset canAssign + per-signal allowed pins"
```

---

### Task 2: 引擎 — 信号级共享映射位（signal.groupKey 同侧约束）

**Files:**
- Modify: `js/engine/availability.js`（canAssign 尾部追加同侧检查）
- Test: `tests/engine.test.js`

**Interfaces:**
- Consumes: Task 1 的 `canAssign` 结构。
- Produces: canAssign 新增拒绝分支——同 `signal.groupKey` 的已配信号必须同侧，reason 含对方名字与当前位置。

- [ ] **Step 1: 写失败测试**（接在 v1.7-1 段落后）

```js
console.log("\n=== v1.7-2: 信号级共享映射位（同侧） ===");

t("同侧约束：DTR 在映射侧后，DSR 默认侧被拒、映射侧通过", () => {
  const s = Avail.defaultState(optChip);
  // DTR 在映射侧 PD1（index 1）
  const base = { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } };
  const bad = Avail.canAssign(optChip, s, "UART0",
    Object.assign({}, base, { pins: Object.assign({}, base.pins, { DSR: "PB0" }) }));   // PB0=默认侧
  assert.strictEqual(bad.ok, false);
  assert.ok(bad.reason.includes("同侧") && bad.reason.includes("DTR"), bad.reason);
  const good = Avail.canAssign(optChip, s, "UART0",
    Object.assign({}, base, { pins: Object.assign({}, base.pins, { DSR: "PB2" }) }));   // PB2=映射侧
  assert.strictEqual(good.ok, true, JSON.stringify(good));
});

t("同侧约束方向对称：先 DSR 后 DTR 同样拦", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0", { group: false, mode: null,
    pins: { TXD: "PA1", RXD: "PC0", DSR: "PB2", DTR: "PC1" } });   // DSR 映射侧 + DTR 默认侧
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("同侧"), r.reason);
});

t("同侧约束：只配一个不受约束（两侧都行）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DSR: "PB0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DSR: "PB2" } }).ok, true);
});

t("同侧约束：两者同侧通过（默认/映射各一组）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PC1", DSR: "PB0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1", DSR: "PB2" } }).ok, true);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 前两条 FAIL（反侧用例此刻会被放行），其余 PASS。

- [ ] **Step 3: 实现**

`canAssign` 的 `return { ok: true };` 之前插入：

```js
  // 信号级共享映射位（如 UART0 DSR/DTR 共用 RB_PIN_MODEM）：已配的必须同侧
  var byKey = {};
  for (var j = 0; j < sigs.length; j++) {
    var s2 = sigs[j];
    if (!s2.groupKey || !choice.pins || !(s2.name in choice.pins)) continue;
    var side2 = s2.pins.indexOf(choice.pins[s2.name]) === 1 ? 1 : 0;
    if (byKey[s2.groupKey] && byKey[s2.groupKey].side !== side2) {
      return { ok: false, reason: s2.name + " 与 " + byKey[s2.groupKey].name +
               " 共享同一映射位，必须同侧（" + byKey[s2.groupKey].name +
               " 当前在 " + byKey[s2.groupKey].pin + "）" };
    }
    byKey[s2.groupKey] = { side: side2, name: s2.name, pin: choice.pins[s2.name] };
  }
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node tests/engine.test.js 2>&1 | tail -2`
Expected: `136 passed, 0 failed`。

- [ ] **Step 5: 提交**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: signal-level groupKey - same-side constraint for signals sharing one remap bit"
```

---

### Task 3: 引擎 — setSignal / signalOptions（单信号增删）

**Files:**
- Modify: `js/engine/availability.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `setSignal(def, state, rid, sigName, pin|null)` → `{state, error?}`（pin=null 移除）；`signalOptions(def, state, rid, sigName)` → `[{pin, ok, reason}]`；内部 `mergedChoice(asg, sigName, pin)`。

- [ ] **Step 1: 写失败测试**（接在 v1.7-2 段落后）

```js
console.log("\n=== v1.7-3: setSignal / signalOptions ===");

t("setSignal：添加可选信号，保留既有分配", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "RTS", "PA2");
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.state.resources.UART0.pins, { TXD: "PA1", RXD: "PC0", RTS: "PA2" });
  assert.strictEqual(s.resources.UART0.pins.RTS, undefined, "原 state 不得被改");
});

t("setSignal：pin=null 移除单信号", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "RTS", null);
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.state.resources.UART0.pins, { TXD: "PA1", RXD: "PC0" });
});

t("setSignal：同侧冲突时透传原因（DTR 已配后加 DSR 反侧）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "DSR", "PB0");
  assert.ok(r.error && r.error.includes("同侧"), r.error);
  const ok = Avail.setSignal(optChip, s, "UART0", "DSR", "PB2");
  assert.strictEqual(ok.error, undefined, ok.error);
});

t("setSignal：未分配资源报错", () => {
  const s = Avail.defaultState(optChip);
  assert.ok(Avail.setSignal(optChip, s, "UART0", "RTS", "PA2").error);
});

t("signalOptions：列出各落脚点可用性与原因", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const opts = Avail.signalOptions(optChip, s, "UART0", "DSR");
  assert.deepStrictEqual(opts.map(o => o.pin), ["PB0", "PB2"]);
  assert.strictEqual(opts[0].ok, false);              // 默认侧与 DTR 反侧
  assert.ok(opts[0].reason.includes("同侧"), opts[0].reason);
  assert.strictEqual(opts[1].ok, true);               // 映射侧可用
});

t("signalOptions：脚被占时置灰并说明", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  s = Avail.setGpio(s, "PB2", "X");
  const opts = Avail.signalOptions(optChip, s, "UART0", "DSR");
  assert.strictEqual(opts.find(o => o.pin === "PB2").ok, false);
  assert.ok(opts.find(o => o.pin === "PB2").reason.includes("占用"), JSON.stringify(opts));
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 6 条新测试 FAIL（`setSignal is not a function`）。

- [ ] **Step 3: 实现**

在 `assign` 函数之后插入：

```js
  // 单信号增/删（pin 传 null = 移除）；构造"现有分配 ± 该信号"的完整 choice，走 assign 同一套校验
  function mergedChoice(asg, sigName, pin) {
    var pins = Object.assign({}, asg.pins);
    if (pin === null) delete pins[sigName]; else pins[sigName] = pin;
    return { group: asg.group, mode: asg.mode, pins: pins };
  }
  function setSignal(def, state, rid, sigName, pin) {
    var asg = state.resources[rid];
    if (!asg) return { state: state, error: "资源未分配：" + rid };
    return assign(def, state, rid, mergedChoice(asg, sigName, pin));
  }
  // 某可选信号各落脚点的可用性 + 原因（供"＋ 添加信号"菜单）
  function signalOptions(def, state, rid, sigName) {
    var res = findResource(def, rid);
    var asg = state.resources[rid];
    if (!res || !asg) return [];
    var sig = (res.signals || []).find(function (s) { return s.name === sigName; });
    if (!sig) return [];
    var isActive = activeSignals(res, asg.mode).some(function (s) { return s.name === sigName; });
    if (!isActive) return [];
    return sig.pins.map(function (pin) {
      var chk = canAssign(def, state, rid, mergedChoice(asg, sigName, pin));
      return { pin: pin, ok: chk.ok, reason: chk.reason || "" };
    });
  }
```

导出行追加 `setSignal: setSignal, signalOptions: signalOptions,`（加在 `requiredSignals` 同一行即可）。

- [ ] **Step 4: 跑测试确认通过**

Run: `node tests/engine.test.js 2>&1 | tail -2`
Expected: `142 passed, 0 failed`。

- [ ] **Step 5: 提交**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: setSignal/signalOptions - per-signal add/remove with full validation"
```

---

### Task 4: 引擎 — 既有路径适配（bestAssignment 只配必选 / pinOptions 两态 / 色点回归）

**Files:**
- Modify: `js/engine/availability.js`（bestAssignment 的 trySide；pinOptions 整函数替换）
- Test: `tests/engine.test.js`

**Interfaces:**
- Consumes: Task 1 的 `requiredSignals`/`allowedPinsFor`；Task 3 的 `mergedChoice`/`canAssign`。
- Produces: `bestAssignment` 结果只含必选信号；`pinOptions` 新增 `type:"add-signal"` 项（可选信号已分配时），未分配时给 `ok:false` + "需先分配"提示；`resourceStatus` 行为不变（仅按必选）。

- [ ] **Step 1: 写失败测试**（接在 v1.7-3 段落后）

```js
console.log("\n=== v1.7-4: 既有路径适配 ===");

t("bestAssignment：可选信号脚被占不影响一键分配，且只返回必选", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");    // RTS 的脚被占
  s = Avail.setGpio(s, "PB0", "X");    // DSR 默认侧被占
  const b = Avail.bestAssignment(optChip, s, "UART0");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { TXD: "PA1", RXD: "PC0" });
});

t("bestAssignment：必选内部共享映射位（groupKey）同侧放置", () => {
  const s = Avail.defaultState(optChip);
  const b = Avail.bestAssignment(optChip, s, "XMEM");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { A: "PC1", B: "PB0" });   // 都默认侧
  let s2 = Avail.setGpio(s, "PC1", "X");
  const b2 = Avail.bestAssignment(optChip, s2, "XMEM");
  assert.strictEqual(b2.error, undefined, JSON.stringify(b2));
  assert.deepStrictEqual(b2.pins, { A: "PD1", B: "PB2" });  // 默认侧受阻 → 整对映射侧
});

t("resourceStatus：可选信号脚被占不影响色点判定", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");
  s = Avail.setGpio(s, "PB0", "X");
  const st = Avail.resourceStatus(optChip, s, "UART0");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
});

t("pinOptions：资源未分配时可选信号置灰并提示先分配", () => {
  const s = Avail.defaultState(optChip);
  const item = Avail.pinOptions(optChip, s, "PA2").find(o => o.rid === "UART0" && o.signal === "RTS");
  assert.ok(item, "应有 RTS 条目");
  assert.strictEqual(item.ok, false);
  assert.ok(item.reason.includes("先分配"), item.reason);
});

t("pinOptions：资源已分配后可选信号变为 add-signal 项", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  const item = Avail.pinOptions(optChip, s, "PA2").find(o => o.rid === "UART0" && o.signal === "RTS");
  assert.strictEqual(item.type, "add-signal");
  assert.strictEqual(item.ok, true, JSON.stringify(item));
});

t("pinOptions：add-signal 项也受同侧约束（DSR 默认侧被置灰并给原因）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const item = Avail.pinOptions(optChip, s, "PB0").find(o => o.rid === "UART0" && o.signal === "DSR");
  assert.strictEqual(item.type, "add-signal");
  assert.strictEqual(item.ok, false);
  assert.ok(item.reason.includes("同侧"), item.reason);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 4 条以上 FAIL（bestAssignment 返回含可选/无 add-signal 类型等）。

- [ ] **Step 3: 实现**

`bestAssignment` 的 `trySide` 内部循环替换：

```js
  function trySide(side) {
    var cand = candidatePins(def, state, rid, res.groupSwitch ? (side === 1) : undefined,
                             mid === null ? undefined : mid);
    var missing = [], pins = {};
    requiredSignals(res, mid === null ? undefined : mid).forEach(function (sigDef) {
      var sname = sigDef.name;
      var opts = (cand && cand.signals[sname]) || [];
      if (opts.length === 0) { missing.push(sname); return; }
      if (sigDef.groupKey || (!res.groupSwitch && sigDef.pins.length > 1)) {
        var want = sigDef.pins[side === 1 ? 1 : 0];
        if (opts.indexOf(want) < 0) { missing.push(sname); return; }
        pins[sname] = want;
      } else {
        pins[sname] = opts[0];
      }
    });
    return { missing: missing, pins: pins };
  }
```

`pinOptions` 整函数替换（含新增 `mergedChoice` 复用；保留原有限制脚/锁定脚逻辑）：

```js
  // 枚举某引脚上的全部可分配选项（含模式与映射组变体），并给每项可用性与原因
  function pinOptions(def, state, pinName) {
    var out = [];
    var entry = computePins(def, state).get(pinName);
    if (!entry) return out;
    var lockedBy = (entry.status === "locked") ? entry.owners[0] : null;
    (def.resources || []).forEach(function (res) {
      if (res.perPin) return;
      var resAsg = state.resources[res.id] || null;
      var modes = modeListOf(res) || [null];
      modes.forEach(function (mode) {
        var mid = mode ? mode.id : null;
        var sigs = activeSignals(res, mid);
        var reqNames = requiredSignals(res, mid).map(function (s) { return s.name; });
        sigs.forEach(function (s) {
          s.pins.forEach(function (pin, idx) {
            if (pin !== pinName) return;
            var group = idx === 1;
            // 可选信号：未分配→提示先分配；已分配→以 setSignal 预演给可用性
            if (reqNames.indexOf(s.name) < 0) {
              if (!resAsg) {
                out.push({ type: "add-signal", rid: res.id, signal: s.name, group: group, mode: mid,
                           ok: false, reason: "可选信号：需先分配 " + res.label + " 再添加",
                           label: pinLabel(res, mid, s.name, group) + "（可选信号）" });
                return;
              }
              var chk = canAssign(def, state, res.id, mergedChoice(resAsg, s.name, pin));
              out.push({ type: "add-signal", rid: res.id, signal: s.name, group: group, mode: mid,
                         ok: chk.ok, reason: chk.reason || "",
                         label: pinLabel(res, mid, s.name, group) + "（可选信号）" });
              return;
            }
            // 必选信号：沿用原逻辑，但"其它信号无落脚点"只统计必选
            var ok = true, reason = "";
            if (entry.fixed) {
              ok = false; reason = "固定脚（" + entry.type + "）不可分配";
            } else if (lockedBy) {
              ok = false; reason = "被「" + lockedBy.label + "」锁定（可在左侧关闭该开关）";
            } else {
              var cand = candidatePins(def, state, res.id, res.groupSwitch ? group : undefined,
                                       mid === null ? undefined : mid);
              for (var i = 0; i < reqNames.length; i++) {
                var list = cand ? (cand.signals[reqNames[i]] || []) : [];
                if (list.length === 0) {
                  ok = false;
                  reason = (res.groupSwitch ? "映射组其它脚被占：" : "同资源其它信号无落脚点：") + reqNames[i];
                  break;
                }
              }
              if (ok) {
                var selfList = cand.signals[s.name] || [];
                if (selfList.indexOf(pinName) < 0) { ok = false; reason = pinName + " 当前不可用"; }
              }
              if (ok) {
                var peerRid = groupKeyPeer(def, state, res.id);
                if (peerRid && assignedSide(def, state, peerRid) !== (group ? 1 : 0)) {
                  ok = false;
                  var pr = findResource(def, peerRid);
                  reason = "共享映射位与已分配的 " + (pr ? pr.label : peerRid) + " 不一致（须同组；可先解除它再切换）";
                }
              }
            }
            out.push({ type: "assign", rid: res.id, signal: s.name, group: group, mode: mid,
                       ok: ok, reason: reason, label: pinLabel(res, mid, s.name, group) });
          });
        });
      });
    });
    return out;
  }
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node tests/engine.test.js 2>&1 | tail -2 && node tests/fuzz.js 2>&1 | tail -3`
Expected: `148 passed, 0 failed`；fuzz 全绿（此时真实芯片还没有可选信号，fuzz 行为不变）。

- [ ] **Step 5: 提交**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: required-only bestAssignment + pinOptions add-signal states + dot status unaffected by optional"
```

---

### Task 5: 引擎 — rebuildChoice（切组/换模/改配时保留可选信号）

**Files:**
- Modify: `js/engine/availability.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `rebuildChoice(def, state, rid, opts)` → `{choice, error?}`；opts = `{group?, mode?, pinOverride?}`。规则：主组信号随组/随模式重构；自有映射位与单脚信号**原位保留**；override 优先；任一信号放不下 → 整体报错（调用方不得提交）。
- Consumes: Task 1-4 全部。

- [ ] **Step 1: 写失败测试**（接在 v1.7-4 段落后）

```js
console.log("\n=== v1.7-5: rebuildChoice ===");

t("rebuildChoice：切主组搬必选、MODEM 等自有映射位/单脚信号原位不动", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", RTS: "PA2", DTR: "PD1", DSR: "PB2" } }).state;
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { TXD: "PB1", RXD: "PD0", RTS: "PA2", DTR: "PD1", DSR: "PB2" });
});

t("rebuildChoice：换模式保留可加项、丢弃不在新模式的信号", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "SPI1x", { group: false, mode: "m1", pins: { SCK: "PC2", TX: "PA0", CS: "PC1" } }).state;
  const r = Avail.rebuildChoice(optChip, s, "SPI1x", { mode: "m2" });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { SCK: "PC2", CS: "PC1" });   // TX 不在 m2；CS 原位保留
});

t("rebuildChoice：可选信号保不住 → 整体报错、什么都不改", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  s = Avail.setGpio(s, "PA2", "X");     // RTS 的脚被占
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.ok(r.error && r.error.includes("RTS"), r.error);
  assert.strictEqual(r.choice, undefined);
});

t("rebuildChoice：pinOverride 指定新脚（配合组参数走引脚菜单路径）", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.rebuildChoice(optChip, s, "UART0",
    { group: true, pinOverride: { TXD: "PB1" } });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { TXD: "PB1", RXD: "PD0" });
});

t("rebuildChoice：必选在新侧无落脚点 → 报缺（沿用「缺 X」文案）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PB1", "X");     // 映射侧 TXD 脚被占
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.ok(r.error && r.error.includes("TXD"), r.error);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 5 条 FAIL（`rebuildChoice is not a function`）。

- [ ] **Step 3: 实现**

在 `bestAssignment` 之后插入：

```js
  // 重构分配（切组/换模/引脚改配）：必选按新侧放置；已配信号（含可选）尽量原位保留；
  // 自有映射位(groupKey)与单脚信号不随主组；任一信号放不下 → 整体报错（调用方不得提交半套）
  function rebuildChoice(def, state, rid, opts) {
    var res = findResource(def, rid);
    if (!res) return { error: "未知资源 " + rid };
    opts = opts || {};
    var asg = state.resources[rid] || null;
    var groupIn = (opts.group !== undefined) ? !!opts.group : (asg ? asg.group === true : false);
    var modeIn = (opts.mode !== undefined) ? opts.mode : (asg ? asg.mode : null);
    var modes = modeListOf(res);
    var mid = modes ? resolveModeId(res, modeIn) : null;
    var choice = { group: res.groupSwitch ? groupIn : false, mode: mid, pins: {} };
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      if (asg && cl.owner.type === "resource" && cl.owner.id === rid) return;
      busy[cl.pin] = true;
    });
    var over = opts.pinOverride || {};
    var reqNames = requiredSignals(res, mid === null ? undefined : mid).map(function (s) { return s.name; });
    var keySide = {};   // signal.groupKey -> 已放置的侧
    var problem = null;
    activeSignals(res, mid).forEach(function (s) {
      var isReq = reqNames.indexOf(s.name) >= 0;
      var wasAssigned = !!(asg && asg.pins && (s.name in asg.pins));
      // 可选信号只在"已加过"或"被 override 指定"时参与重构；新鲜分配只配必选
      if (!isReq && !wasAssigned && over[s.name] === undefined) return;
      var followsMain = res.groupSwitch && !s.groupKey && s.pins.length === 2;
      var allowed = allowedPinsFor(res, s, choice.group);
      var pref;
      if (over[s.name] !== undefined) {
        pref = [over[s.name]];
      } else if (!followsMain && asg && asg.pins && s.pins.indexOf(asg.pins[s.name]) >= 0) {
        pref = [asg.pins[s.name]];                                    // 原位保留
      } else if (s.groupKey && keySide[s.groupKey] !== undefined) {
        pref = [s.pins[keySide[s.groupKey]]];                         // 跟随同 key 已放侧
      } else if (s.pins.length === 2) {
        pref = followsMain ? [s.pins[choice.group ? 1 : 0]] : [s.pins[0], s.pins[1]];
      } else {
        pref = [s.pins[0]];
      }
      var placed = null;
      for (var i = 0; i < pref.length; i++) {
        var pin = pref[i];
        if (allowed.indexOf(pin) >= 0 && !busy[pin]) { placed = pin; break; }
      }
      if (!placed) { if (!problem) problem = s.name; return; }
      choice.pins[s.name] = placed;
      busy[placed] = true;
      if (s.groupKey) keySide[s.groupKey] = s.pins.indexOf(placed) === 1 ? 1 : 0;
    });
    if (problem) return { error: problem + " 没有可用落脚点（可先处理占用或移除该信号）" };
    return { choice: choice };
  }
```

导出行追加 `rebuildChoice: rebuildChoice,`。

- [ ] **Step 4: 跑测试确认通过 + fuzz**

Run: `node tests/engine.test.js 2>&1 | tail -2 && node tests/fuzz.js 2>&1 | tail -1`
Expected: `153 passed, 0 failed`；fuzz 全绿。

- [ ] **Step 5: 提交**

```bash
git add js/engine/availability.js tests/engine.test.js
git commit -m "feat: rebuildChoice - keep optional signals in place across group/mode switches, all-or-nothing"
```

---

### Task 6: 校验 — validateChip 新规则 + 版本闸门 v2

**Files:**
- Modify: `js/engine/model.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `ENGINE_SCHEMA_MAX = 2`；validateChip 新规则：`optional` 必须是对应 signals 清单的子集（资源级/模式级）；`signal.groupKey` 为非空字符串且该信号恰好 2 落脚点；groupSwitch 的 2 脚规则放宽为"**仅必选信号**必须恰好 2 脚"（可选可 1 脚）。

- [ ] **Step 1: 写失败测试**（接在 v1.7-5 段落后）

```js
console.log("\n=== v1.7-6: validateChip 新规则 + 闸门 v2 ===");

t("validateChip(optChip) 通过（含单脚可选信号 + 信号 groupKey）", () => {
  const r = Model.validateChip(optChip);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});

t("validateChip：optional 必须是对应信号清单的子集（资源级）", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[0].optional = ["NOPE"];
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("NOPE")), "应报未知可选信号");
  const bad2 = JSON.parse(JSON.stringify(optChip));
  bad2.resources[0].optional = "RTS";
  assert.strictEqual(Model.validateChip(bad2).ok, false);
});

t("validateChip：模式级 optional 必须是该模式信号集的子集", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[1].modes[1].optional = ["TX"];   // m2 的信号集是 [SCK, CS]，TX 不在
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("TX")), "应报未知可选信号");
});

t("validateChip：groupSwitch 的必选信号仍须恰好 2 个落脚点", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins = ["PA1"];    // SCK 是 miniChip SPI0 的必选信号
  assert.strictEqual(Model.validateChip(bad).ok, false);
});

t("validateChip：groupSwitch 的单脚可选信号放行", () => {
  const r = Model.validateChip(optChip);         // optChip UART0：groupSwitch + RTS 单脚可选
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});

t("validateChip：signal.groupKey 必须是非空字符串且该信号恰好 2 落脚点", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[0].signals[4].pins = ["PB0"];    // DSR 只剩 1 脚
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("groupKey")), "应报 groupKey");
  const bad2 = JSON.parse(JSON.stringify(optChip));
  bad2.resources[0].signals[4].groupKey = 7;
  assert.strictEqual(Model.validateChip(bad2).ok, false);
});

t("闸门：ENGINE_SCHEMA_MAX=2，芯片数据 v2 放行、v3 报更新工具", () => {
  assert.strictEqual(Model.ENGINE_SCHEMA_MAX, 2);
  const v2 = JSON.parse(JSON.stringify(miniChip)); v2.schemaVersion = 2;
  assert.strictEqual(Model.validateChip(v2).ok, true);
  const v3 = JSON.parse(JSON.stringify(miniChip)); v3.schemaVersion = 3;
  const r = Model.validateChip(v3);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("更新版本的工具")));
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 5 条以上 FAIL（ENGINE_SCHEMA_MAX=1、optional 未校验、单脚可选被拒等）。
另需适配 1 条既有测试：`ENGINE_SCHEMA_MAX 导出且为 1` → 改为 2（闸门升版，属行为升级）。

- [ ] **Step 3: 实现**

`js/engine/model.js`：

1) `var ENGINE_SCHEMA_MAX = 1;` → `var ENGINE_SCHEMA_MAX = 2;  // v2：optional 信号 / 信号级 groupKey（v1.7）`

2) groupSwitch 的 2 脚检查（`if (r.groupSwitch && s.pins.length !== 2) {...}`）替换为：

```js
        var isOptSig = (r.optional || []).indexOf(s.name) >= 0 ||
          (r.modes || []).some(function (m) { return (m.optional || []).indexOf(s.name) >= 0; });
        if (r.groupSwitch && !isOptSig && s.pins.length !== 2) {
          errors.push(r.id + "." + s.name + "：groupSwitch 资源的必选信号必须恰好 2 个落脚点（可选信号可 1 个）");
        }
```

3) 在 `s.pins.forEach(function (pin) {...})` 之后（resources 循环里的 signals 遍历内）追加：

```js
        if (s.groupKey !== undefined) {
          if (typeof s.groupKey !== "string" || !s.groupKey) {
            errors.push(r.id + "." + s.name + " 的 groupKey 必须是非空字符串");
          } else if (!Array.isArray(s.pins) || s.pins.length !== 2) {
            errors.push(r.id + "." + s.name + "：共享映射位(groupKey)的信号必须恰好 2 个落脚点（默认/映射）");
          }
        }
```

4) 在资源循环中（`if (r.groupKey !== undefined ...)` 检查附近）追加 optional 子集校验：

```js
      function checkOptionalNames(list, where, sigPool) {
        if (list === undefined) return;
        if (!Array.isArray(list)) { errors.push(where + " optional 必须是数组"); return; }
        list.forEach(function (sn) {
          if (typeof sn !== "string" || sigPool.indexOf(sn) < 0) {
            errors.push(where + " optional 引用未知信号: " + sn);
          }
        });
      }
      checkOptionalNames(r.optional, r.id, (r.signals || []).map(function (s) { return s.name; }));
```

并在 modes 校验循环内（`m.signals.forEach(...)` 之后）追加：

```js
            checkOptionalNames(m.optional, r.id + " 的模式 " + (m.id || "?"), m.signals);
```

（注意：`checkOptionalNames` 的定义与资源级调用必须放在**最后一个** resources 循环（含 groupKey/modes 检查的那个）的开头——模式级调用在同一 forEach 回调内才能引用到；放第一个循环会因作用域隔离报 `checkOptionalNames is not defined`。）

- [ ] **Step 4: 跑测试确认通过 + 全量**

Run: `node tests/engine.test.js 2>&1 | tail -2`
Expected: `160 passed, 0 failed`。

- [ ] **Step 5: 提交**

```bash
git add js/engine/model.js tests/engine.test.js
git commit -m "feat: chip schema v2 - optional subset + signal groupKey validation, gate max 2"
```

---

### Task 7: 导出器 — 工程文件 v2（写 2 读 1|2 + 必选完整性）

**Files:**
- Modify: `js/engine/exporters.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `toProjectJSON` 写 `schemaVersion: 2`；`fromProjectJSON` 接受 1|2、拒绝其它；每个资源校验"必选信号齐 + 已配信号在集合内"；老文件（无 mode/无 optional）不受影响。

- [ ] **Step 1: 写失败测试**（接在 v1.7-6 段落后）

```js
console.log("\n=== v1.7-7: 工程文件 v2 ===");

t("toProjectJSON：写出 schemaVersion 2", () => {
  const obj = JSON.parse(Exp.toProjectJSON(optChip, Avail.defaultState(optChip)));
  assert.strictEqual(obj.schemaVersion, 2);
});

t("fromProjectJSON：v2 往返（含可选信号子集）一致", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", DTR: "PD1", DSR: "PB2" } }).state;
  const rt = Exp.fromProjectJSON(optChip, Exp.toProjectJSON(optChip, s));
  assert.strictEqual(rt.error, undefined, rt.error);
  assert.deepStrictEqual(rt.state.resources.UART0.pins, s.resources.UART0.pins);
});

t("fromProjectJSON：缺必选信号被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 2, chip: "OPT", configs: {},
    resources: { UART0: { group: false, mode: null, pins: { TXD: "PA1" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("RXD"), r.error);
});

t("fromProjectJSON：v1 老文件（无 optional 概念）照读", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 1, chip: "OPT", configs: {},
    resources: { UART0: { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.strictEqual(r.error, undefined, r.error);
});

t("fromProjectJSON：schemaVersion 3 被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 3, chip: "OPT", configs: {}, resources: {}, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("版本"), r.error);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js 2>&1 | grep -E "FAIL|passed"`
Expected: 3 条 FAIL（写 1 而非 2；缺必选未被拒；v3 未拒）。

- [ ] **Step 3: 实现**

`toProjectJSON` 中 `schemaVersion: 1` → `schemaVersion: 2`。

`fromProjectJSON` 中版本检查：

```js
    if (obj.schemaVersion !== 1 && obj.schemaVersion !== 2) {
      return { error: "工程文件版本不兼容（本工具支持 1、2）" };
    }
```

在资源校验循环内、`if (entry.labels != null) {...}` 之前追加必选完整性检查：

```js
      var reqNames = Avail.requiredSignals(res, entry.mode == null ? undefined : entry.mode)
        .map(function (s) { return s.name; });
      reqNames.forEach(function (sn) {
        if (!(sn in entry.pins)) badPin = rid + " 缺少必选信号 " + sn;
      });
```

- [ ] **Step 4: 跑测试确认通过 + 全量**

Run: `node tests/engine.test.js 2>&1 | tail -2 && node tests/fuzz.js 2>&1 | tail -1`
Expected: `165 passed, 0 failed`；fuzz 全绿（往返不变量的 JSON 严格相等含 schemaVersion 变化须一致——两处都走 toProjectJSON，自洽）。

- [ ] **Step 5: 提交**

```bash
git add js/engine/exporters.js tests/engine.test.js
git commit -m "feat: project file v2 - write 2 / read 1|2, required-signal completeness check"
```

---

### Task 8: 数据 — CH582M v2（UART0 MODEM / SPI0 从机+SCS / RF 开关）+ 既有测试适配 + fuzz 扩展

**Files:**
- Modify: `chips/wch-ch582m-qfn48.js`
- Modify: `tests/engine.test.js`（真实数据新测试 + 2 处既有断言适配）
- Modify: `tests/fuzz.js`（新操作 + 新不变量）
- 核对：`docs/reference/ch582-pin-table.txt`（PB16-19 alts）

**Interfaces:**
- Consumes: Task 1-7 全部引擎能力。
- Produces: 数据文件 schemaVersion 2；UART0 `optional` 六信号（DSR/DTR 带 `groupKey:"UART0_MODEM"`）；SPI0 四模式 + SCS；`rf_ant_sw` 全局开关。

- [ ] **Step 1: 数据文件修改**

`chips/wch-ch582m-qfn48.js` 四处：

1) `schemaVersion: 1,` → `schemaVersion: 2,`

2) globalConfigs 数组末尾（xtal32k 之后）追加：

```js
      { id: "rf_ant_sw", label: "RF 天线开关（PB16-21）", default: false,
        claims: ["PB16", "PB17", "PB18", "PB19", "PB20", "PB21"],
        note: "手册位 RB_RF_ANT_SW_EN：启用后开关控制输出到 PB16~PB21（六根）；用途为 AoA/AoD 多天线切换，WCH 官方当前建议保持关闭（芯片暂不支持 AoA）" }
```

3) UART0 资源整块替换：

```js
      { id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
        optional: ["RTS", "CTS", "DTR", "DSR", "RI", "DCD"],
        signals: [
          { name: "TXD", pins: ["PB7", "PA14"] },
          { name: "RXD", pins: ["PB4", "PA15"] },
          { name: "RTS", pins: ["PB6"],  note: "MODEM 输出（请求发送）；表7-2：推挽输出" },
          { name: "CTS", pins: ["PB0"],  note: "MODEM 输入（清除发送）" },
          { name: "DTR", pins: ["PB5", "PB15"], groupKey: "UART0_MODEM",
            note: "MODEM 输出（数据终端就绪）；RB_PIN_MODEM 位与 DSR 同切（PB1/PB5 ↔ PB14/PB15）" },
          { name: "DSR", pins: ["PB1", "PB14"], groupKey: "UART0_MODEM",
            note: "MODEM 输入（数据装置就绪）；RB_PIN_MODEM 位与 DTR 同切" },
          { name: "RI",  pins: ["PB2"],  note: "MODEM 输入（振铃指示）" },
          { name: "DCD", pins: ["PB3"],  note: "MODEM 输入（载波检测）" }
        ] },
```

4) SPI0 资源整块替换：

```js
      { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组 (PB)" },
        modes: [
          { id: "full", label: "主机·全双工3线", signals: ["SCK", "MOSI", "MISO", "SCS"], optional: ["SCS"],
            note: "MISO 为官方定义的输入引脚（浮空/上拉/下拉），不可复用为其他功能；主机片选 SCS 可选（可换用其它引脚）" },
          { id: "half", label: "主机·半双工2线", signals: ["SCK", "MISO", "SCS"], optional: ["SCS"],
            note: "手册表7-3：MOSI 未用到，可做通用 I/O；MISO 单线双向（手工切方向）" },
          { id: "slave-full", label: "从机·全双工4线", signals: ["SCS", "SCK", "MOSI", "MISO"],
            note: "SPI0 从机模式（SCS 片选输入必选，低电平有效；SCK 转输入；MISO 片选后自动切推挽）" },
          { id: "slave-half", label: "从机·半双工3线", signals: ["SCS", "SCK", "MISO"],
            note: "表7-3：从机半双工，MOSI 未用到，可做通用 I/O" }
        ],
        signals: [
          { name: "SCK", pins: ["PA13", "PB13"] },
          { name: "MOSI", pins: ["PA14", "PB14"] },
          { name: "MISO", pins: ["PA15", "PB15"] },
          { name: "SCS", pins: ["PA12", "PB12"],
            note: "从模式片选输入（低有效）；主模式片选输出（可选，可换用其它引脚）" }
        ] },
```

5) **PB16-19 alts 核对（必做）**：`grep -E "PB1[6-9]" docs/reference/ch582-pin-table.txt`——手册无复用功能标注则维持 `alts: []` 并在 commit message 记一句"PB16-19 手册无 alts，维持空"。

- [ ] **Step 2: 新测试 + 既有断言适配**

新测试（接在 v1.7-7 段落后）：

```js
console.log("\n=== v1.7-8: CH582M v2 数据 ===");

t("数据 v2：validateChip 通过（schemaVersion=2）", () => {
  assert.strictEqual(CHIP.schemaVersion, 2);
  const v = Model.validateChip(CHIP);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("UART0：MODEM 六可选信号、引脚与信号级 groupKey 正确", () => {
  const u = Avail.findResource(CHIP, "UART0");
  assert.deepStrictEqual(u.optional, ["RTS", "CTS", "DTR", "DSR", "RI", "DCD"]);
  const sig = n => u.signals.find(s => s.name === n);
  assert.deepStrictEqual(sig("RTS").pins, ["PB6"]);
  assert.deepStrictEqual(sig("CTS").pins, ["PB0"]);
  assert.deepStrictEqual(sig("DTR").pins, ["PB5", "PB15"]);
  assert.deepStrictEqual(sig("DSR").pins, ["PB1", "PB14"]);
  assert.strictEqual(sig("DTR").groupKey, "UART0_MODEM");
  assert.strictEqual(sig("DSR").groupKey, "UART0_MODEM");
});

t("UART0：一键分配只占 PB7/PB4 两线（MODEM 全被占也不影响）", () => {
  let s = Avail.defaultState(CHIP);
  ["PB6", "PB0", "PB5", "PB1", "PB2", "PB3"].forEach(p => { s = Avail.setGpio(s, p, "X"); });
  const b = Avail.bestAssignment(CHIP, s, "UART0");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { TXD: "PB7", RXD: "PB4" });
});

t("UART0：先加 DTR@PB5，再加 DSR@PB14 被拒（同侧）、DSR@PB1 通过", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "UART0", { group: false, mode: null, pins: { TXD: "PB7", RXD: "PB4" } }).state;
  s = Avail.setSignal(CHIP, s, "UART0", "DTR", "PB5").state;
  const bad = Avail.setSignal(CHIP, s, "UART0", "DSR", "PB14");
  assert.ok(bad.error && bad.error.includes("同侧"), bad.error);
  const ok = Avail.setSignal(CHIP, s, "UART0", "DSR", "PB1");
  assert.strictEqual(ok.error, undefined, ok.error);
});

t("SPI0：四模式与 SCS 数据正确", () => {
  const sp = Avail.findResource(CHIP, "SPI0");
  assert.deepStrictEqual(sp.modes.map(m => m.id), ["full", "half", "slave-full", "slave-half"]);
  assert.deepStrictEqual(sp.modes[0].optional, ["SCS"]);
  assert.deepStrictEqual(sp.modes[2].signals, ["SCS", "SCK", "MOSI", "MISO"]);
  assert.deepStrictEqual(sp.modes[3].signals, ["SCS", "SCK", "MISO"]);
  assert.deepStrictEqual(sp.signals.find(s => s.name === "SCS").pins, ["PA12", "PB12"]);
});

t("SPI0：从机全双工一键分配占四线（含 SCS）", () => {
  const s = Avail.defaultState(CHIP);
  const b = Avail.bestAssignment(CHIP, s, "SPI0", "slave-full");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { SCS: "PA12", SCK: "PA13", MOSI: "PA14", MISO: "PA15" });
});

t("SPI0：从机半双工占三线；主机模式 SCS 可后加", () => {
  let s = Avail.defaultState(CHIP);
  const b = Avail.bestAssignment(CHIP, s, "SPI0", "slave-half");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(Object.keys(b.pins).sort(), ["MISO", "SCK", "SCS"]);
  s = Avail.assign(CHIP, s, "SPI0", { group: false, mode: "full",
    pins: { SCK: "PA13", MOSI: "PA14", MISO: "PA15" } }).state;
  const add = Avail.setSignal(CHIP, s, "SPI0", "SCS", "PA12");
  assert.strictEqual(add.error, undefined, add.error);
});

t("RF 开关：启用后 PB16-21 六脚全部锁定", () => {
  let s = Avail.defaultState(CHIP);
  const before = Avail.countIO(CHIP, s);
  s = Avail.setConfig(s, "rf_ant_sw", true);
  const pins = Avail.computePins(CHIP, s);
  ["PB16", "PB17", "PB18", "PB19", "PB20", "PB21"].forEach(p => {
    assert.strictEqual(pins.get(p).status, "locked", p + " 应被 RF 开关锁定");
  });
  assert.strictEqual(Avail.countIO(CHIP, s).locked, before.locked + 6);
});
```

**既有断言适配（仅这两处，行为升级所致）**：

- `candidatePins(半双工)：只含 SCK/MISO 两信号` → 该测试现为：
  ```js
  const c = Avail.candidatePins(CHIP, s, "SPI0", false, "half");
  assert.deepStrictEqual(Object.keys(c.signals).sort(), ["MISO", "SCK"]);
  ```
  断言行改为三键（SCS 作为可选信号出现在候选枚举中）：
  ```js
  assert.deepStrictEqual(Object.keys(c.signals).sort(), ["MISO", "SCK", "SCS"]);
  ```
- `pinOptions：PA14(MOSI) 只在 全双工 出现；PA15(MISO) 出现在 全双工/半双工` → 期望值加入从机模式：
  ```js
  assert.deepStrictEqual(atMosi.map(o => o.mode).sort(), ["full", "slave-full"]);
  assert.deepStrictEqual(atMiso.map(o => o.mode).sort(), ["full", "half", "slave-full", "slave-half"]);
  ```
- 跑全量后若有其它连锁失败：逐一分析——凡属"新模式带来的枚举扩张"按上述口径适配；凡属疑似真 bug，停下来按 systematic-debugging 处理，不得顺手放宽断言。

- [ ] **Step 3: fuzz 扩展**

`tests/fuzz.js`：

1) 操作分配：`const op = Math.floor(rnd() * 7);` → `Math.floor(rnd() * 8);`，并把最后 `} else { // 模式切换` 改为 `} else if (op === 6) { // 模式切换`，末尾新增：

```js
  } else { // setSignal：随机加/移可选信号
    const rid = pick(rids);
    const res = Avail.findResource(def, rid);
    const asg = state.resources[rid];
    if (res && asg) {
      const optSigs = Avail.optionalSignals(res, asg.mode == null ? undefined : asg.mode);
      if (optSigs.length) {
        const sg = pick(optSigs);
        const already = Object.prototype.hasOwnProperty.call(asg.pins || {}, sg.name);
        if (already || rnd() < 0.5) {
          const r = Avail.setSignal(def, state, rid, sg.name, null);
          if (r.error) throw new Error("op" + i + " 移除可选信号被拒: " + r.error);
          state = r.state; osig++;
        } else {
          const opts = Avail.signalOptions(def, state, rid, sg.name).filter(o => o.ok);
          if (opts.length) {
            const r = Avail.setSignal(def, state, rid, sg.name, pick(opts).pin);
            if (r.error) throw new Error("op" + i + " 添加可选信号被拒: " + r.error);
            state = r.state; osig++;
          }
        }
      }
    }
  }
```

2) 计数器：`let assigned = 0, ...` 行追加 `osig = 0`，汇总行加 `" 信号增删" + osig`。

3) `invariants()` 内追加（g 段之后）：

```js
  // h) 可选信号子集合法：必选恒齐、已配 ⊆ 活跃信号、同 groupKey 同侧
  Object.keys(state.resources).forEach(rid => {
    const res = Avail.findResource(def, rid);
    const asg = state.resources[rid];
    const midArg = asg.mode == null ? undefined : asg.mode;
    Avail.requiredSignals(res, midArg).forEach(s => {
      if (!(s.name in (asg.pins || {}))) throw new Error(tag + " 必选信号缺失 " + rid + "." + s.name);
    });
    const act = Avail.activeSignals(res, midArg).map(s => s.name);
    Object.keys(asg.pins || {}).forEach(sn => {
      if (act.indexOf(sn) < 0) throw new Error(tag + " 非活跃信号 " + rid + "." + sn);
    });
    const sides = {};
    (res.signals || []).forEach(s => {
      if (!s.groupKey || !(s.name in (asg.pins || {}))) return;
      const side = s.pins.indexOf(asg.pins[s.name]) === 1 ? 1 : 0;
      if (sides[s.groupKey] !== undefined && sides[s.groupKey] !== side) {
        throw new Error(tag + " 信号映射位不同侧 " + rid + "." + s.name);
      }
      sides[s.groupKey] = side;
    });
  });
```

- [ ] **Step 4: 跑全量**

Run: `node tests/engine.test.js 2>&1 | tail -2 && node tests/fuzz.js 2>&1 | tail -3`
Expected: 单测全绿（约 173 条）；fuzz 全绿含新不变量与新操作统计。

- [ ] **Step 5: 提交**

```bash
git add chips/wch-ch582m-qfn48.js tests/engine.test.js tests/fuzz.js
git commit -m "feat: CH582M data v2 - UART0 MODEM six optional signals, SPI0 slave modes + SCS, RF antenna switch; fuzz ops+invariants"
```

---

### Task 9: UI — 右栏「＋ 添加信号 / × 移除」+ 引脚菜单 add-signal 项

**Files:**
- Modify: `js/app.js`（renderRightPanel、buildPinMenuItems、新增 addOptionalSignal）
- Test: 浏览器真实路径门（无 DOM 单测，项目既定模式）

**Interfaces:**
- Consumes: `Avail.optionalSignals` / `Avail.signalOptions` / `Avail.setSignal` / `pinOptions` 的 `type:"add-signal"`。
- Produces: `addOptionalSignal(rid, sig, pin)`（右栏与引脚菜单共用）。

- [ ] **Step 1: 实现（三处改动）**

1) `renderRightPanel` 的资源行拼接处（`html += "<div class='row'><b>" + res.label + "</b>：" + pinHtml;` 之前），把 `pinHtml` 的映射改为可选信号带 × 按钮；行尾追加"＋ 添加信号"按钮。替换 `pinHtml` 构造与行拼接为：

```js
      var optNameList = (res.modes && res.modes.length)
        ? (((res.modes.find(function (m) { return m.id === asg.mode; }) || {}).optional) || [])
        : (res.optional || []);
      var pinHtml;
      if (pinKeys.length) {
        pinHtml = pinKeys.map(function (s) {
          return "<span class='sig-name' data-name=\"" + rid + "|" + s + "\" title='点击命名/重命名'>" +
                 s + "=" + asgPins[s] + (asgLabels[s] ? "「" + CPP.Util.escapeHtml(asgLabels[s]) + "」" : "") + "</span>" +
                 (optNameList.indexOf(s) >= 0
                   ? " <button class='mini' data-delsig=\"" + rid + "|" + s + "\" title='移除该可选信号'>×</button>"
                   : "");
        }).join(", ");
      } else {
        pinHtml = "<i>（不占引脚）</i>";
      }
      html += "<div class='row'><b>" + res.label + "</b>：" + pinHtml;
      var notAdded = optNameList.filter(function (n) { return !(n in asgPins); });
      if (notAdded.length) {
        html += " <button class='mini' data-addsig='" + rid + "'>＋ 添加信号</button>";
      }
```

2) 事件绑定区（`host.querySelectorAll("[data-switch]")` 附近）追加：

```js
    host.querySelectorAll("[data-delsig]").forEach(function (b) {
      b.addEventListener("click", function () {
        var parts = b.getAttribute("data-delsig").split("|");
        var r = CPP.Availability.setSignal(def, state(), parts[0], parts[1], null);
        if (r.error) { alert("移除失败：" + r.error); return; }
        commit(r.state);
        log("已移除 " + parts[0] + " 的 " + parts[1]);
      });
    });
    host.querySelectorAll("[data-addsig]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        var rid2 = b.getAttribute("data-addsig");
        var res2 = CPP.Availability.findResource(def, rid2);
        var asg2 = state().resources[rid2];
        var mid2 = (res2.modes && res2.modes.length) ? asg2.mode : undefined;
        var items = [];
        CPP.Availability.optionalSignals(res2, mid2).forEach(function (sg) {
          if (sg.name in (asg2.pins || {})) return;
          CPP.Availability.signalOptions(def, state(), rid2, sg.name).forEach(function (o) {
            items.push({
              label: sg.name + " → " + o.pin + (o.ok ? "" : "（" + o.reason + "）"),
              disabled: !o.ok,
              title: sg.note || "",
              action: o.ok ? function () { addOptionalSignal(rid2, sg.name, o.pin); } : null
            });
          });
        });
        if (!items.length) { log("没有可添加的信号"); return; }
        showMenu(items, ev.clientX, ev.clientY);
      });
    });
```

3) 新增共用函数（放在 `assignResourceAtPin` 之后）+ 引脚菜单路由。`buildPinMenuItems` 里 pinOptions 的 action 分支改为：

```js
        action: o.ok ? function () {
          if (o.type === "add-signal") addOptionalSignal(o.rid, o.signal, pinName);
          else assignResourceAtPin(o.rid, o.signal, pinName, o.group, o.mode);
        } : null
```

并在 `assignResourceAtPin` 后新增：

```js
  function addOptionalSignal(rid, sig, pin) {
    var r = CPP.Availability.setSignal(def, state(), rid, sig, pin);
    if (r.error) { alert("添加失败：" + r.error); return; }
    commit(r.state);
    log("已添加 " + rid + " · " + sig + " → " + pin);
  }
```

- [ ] **Step 2: 浏览器真实路径验证（READ FIRST: 使用 agent-browser）**

启动会话并逐项实测（每步用 snapshot/get attr 确认后再继续；截图存 `.claude\tmp\cpp-opt2-20261010\`）：

```bash
export AGENT_BROWSER_SESSION=cppv17
agent-browser --session cppv17 open "file:///D:/Code_Project/chip-pin-planner/index.html"
agent-browser --session cppv17 click "[data-rid='UART0']"
```
Expected（逐项核对）：
1. 右栏 UART0 行出现「＋ 添加信号」；左栏 UART0 绿底已用、SVG 上 PB7/PB4 着色；
2. 点「＋ 添加信号」→ 菜单列 6 个信号 → 脚（RTS → PB6、CTS → PB0、DTR → PB5/PB15、DSR → PB1/PB14、RI → PB2、DCD → PB3），每项带 note 悬停 `title`；
3. 点 `RTS → PB6` → 右栏该行出现 `RTS=PB6` 与 × 按钮，SVG PB6 着色；
4. 再点「＋」→ 点 `DSR → PB14` → 成功；此时点「＋」→ `DTR → PB5` 项应为**置灰**且原因含"同侧"，`DTR → PB15` 可点并成功（复现"先 DSR 后 DTR"方向）；
5. 点 RTS 旁的 × → 右栏消失、PB6 释放；
6. 在 SVG 上点 **PB5** → 菜单出现 `UART0 · DTR（可选信号）（…同侧…）` 且**置灰**（DSR 在 PB14=映射侧，PB5 是默认侧）；点 **PB2** → `UART0 · RI（可选信号）` 可点（单脚、无同侧问题）；
7. Ctrl+Z 逐步撤销上述操作回到初始。

- [ ] **Step 3: 提交**

```bash
git add js/app.js
git commit -m "feat(ui): right-panel add/remove optional signals + pin-menu add-signal entries"
```

---

### Task 10: UI — 切换路径接入 rebuildChoice + 版本号 v1.7

**Files:**
- Modify: `js/app.js`（assignResourceAtPin、data-switch、data-mode、启动日志）
- Test: 浏览器真实路径门

**Interfaces:**
- Consumes: `Avail.rebuildChoice`。
- Produces: 切组/换模式/引脚改配三条路径统一走 rebuildChoice；"就绪（v1.7）"。

- [ ] **Step 1: 实现（四处改动）**

1) `assignResourceAtPin` 整函数替换：

```js
  function assignResourceAtPin(rid, sigName, pinName, group, mode) {
    var res = CPP.Availability.findResource(def, rid);
    var rebuild = CPP.Availability.rebuildChoice(def, state(), rid, {
      group: group === true,
      mode: (mode === undefined) ? null : mode,
      pinOverride: (function () { var o = {}; o[sigName] = pinName; return o; })()
    });
    if (rebuild.error) { alert("无法分配 " + res.label + "：" + rebuild.error); return; }
    var prev = state().resources[rid];
    var r = CPP.Availability.assign(def, state(), rid, rebuild.choice);
    if (r.error) { alert("分配失败：" + r.error); return; }
    commit(r.state);
    log("已分配 " + res.label + " → " + Object.keys(rebuild.choice.pins).map(function (k) {
      return k + "=" + rebuild.choice.pins[k];
    }).join(", ") + (prev ? "（替换原有分配）" : ""));
  }
```

（说明：rebuildChoice 会保留该资源已加的可选信号与原位落脚点，这一行为是本次升级的意图。）

2) `data-switch`（改用映射组）handler 中从 `var cand = ...` 到 `commit(r.state);` 替换：

```js
        var rb = CPP.Availability.rebuildChoice(def, state(), rid, { group: !asg.group });
        if (rb.error) { alert("无法切换：" + rb.error); return; }
        var r = CPP.Availability.assign(def, state(), rid, rb.choice);
        if (r.error) { alert("切换失败：" + r.error); return; }
        commit(r.state);
        log(res.label + " 已切到" + (rb.choice.group ? "映射组" : "默认组") + " → " +
            Object.keys(rb.choice.pins).map(function (k) { return k + "=" + rb.choice.pins[k]; }).join(", "));
```

3) `data-mode`（模式下拉）handler 中从 `var cand = ...` 到 `commit(r.state);` 替换：

```js
        var rb = CPP.Availability.rebuildChoice(def, state(), rid, { mode: newMode });
        if (rb.error) {
          alert("无法切换到该模式：" + rb.error);
          redraw();
          return;
        }
        var r = CPP.Availability.assign(def, state(), rid, rb.choice);
        if (r.error) { alert("切换失败：" + r.error); redraw(); return; }
        commit(r.state);
        var label = (res.modes.find(function (m) { return m.id === newMode; }) || {}).label || newMode;
        log(res.label + " 已切换为「" + label + "」 → " +
            Object.keys(rb.choice.pins).map(function (k) { return k + "=" + rb.choice.pins[k]; }).join(", "));
```

4) 启动日志：`log("就绪（v1.6）：` → `log("就绪（v1.7）：`。

- [ ] **Step 2: 浏览器真实路径验证**

```bash
agent-browser --session cppv17 open "file:///D:/Code_Project/chip-pin-planner/index.html"
agent-browser --session cppv17 wait --text "就绪（v1.7）"
```
逐项实测：
1. 左栏点 UART0 → 右栏「＋」加 `DSR → PB14`；点「改用映射组」→ TXD/RXD 应换到 **PA14/PA15**，而 **DSR 仍在 PB14**（主组不搬 MODEM），日志含 4 项落脚点；
2. SPI0：左栏点 → 模式菜单选「主机·全双工3线」→ 占 PA13/PA14/PA15；「＋」加 `SCS → PA12`；右栏模式下拉切「从机·半双工3线」→ 应保留 SCS/SCK/MISO（原脚），MOSI 释放，日志正确；
3. 回归：点 SPI0 引脚（如 PA13）→ 菜单仍能整体改配且保留已加 SCS；「换回默认组」按钮路径同；
4. 4a：左栏点 UART0 分配后，「＋」加 `DSR → PB1`（默认侧），点「改用映射组」→ 切换应成功且 **DSR 留在 PB1**（主组不搬 MODEM）；
   4b：刷新页面回到初始 → 左栏点 UART0（占 PB7/PB4）→ 在 SVG 上点 PA14 → 菜单「设为 GPIO…」设为 GPIO → 点「改用映射组」→ 应弹"无法切换：TXD 没有可用落脚点…"且**界面零变化**（改配前状态原样，Ctrl+Z 无操作可撤）；
5. 截图留证 3-4 张到 `.claude\tmp\cpp-opt2-20261010\`。

- [ ] **Step 3: 提交**

```bash
git add js/app.js
git commit -m "feat(ui): group/mode/pin paths rebuilt via rebuildChoice (keep optional signals) + v1.7 marker"
```

---

### Task 11: README + 终验 + tag

**Files:**
- Modify: `README.md`
- Test: 全量回归 + 浏览器冒烟

- [ ] **Step 1: README 补三条**（"用法"列表内、可用性色点条目之后）

```markdown
- 可选信号：先分配资源，再在右栏「＋ 添加信号」按需添加（如 UART0 的 MODEM 六信号 RTS/CTS/DTR/DSR/RI/DCD）；已加的信号可点 × 单独移除；不可用时菜单置灰并说明原因（如"须与 DTR 同侧"）
- SPI0 四种模式：主机·全双工3线 / 主机·半双工2线 / 从机·全双工4线 / 从机·半双工3线（从机片选 SCS 必选；主机模式 SCS 可作为可选信号添加）
- 左侧「系统配置」新增 RF 天线开关（PB16-21）——启用会占用全部六脚（用途为 AoA/AoD 多天线切换，官方当前建议保持关闭）
```

- [ ] **Step 2: 全量回归**

```bash
node tests/engine.test.js 2>&1 | tail -2
node tests/fuzz.js 2>&1 | tail -3
```
Expected: 单测全绿（约 173 条）；fuzz 全绿。然后浏览器冒烟：开页面 → 就绪（v1.7）→ 任选一个含 MODEM 的流程跑一遍 + 导出 CSV/工程 JSON 各一次确认无异常。

- [ ] **Step 3: 收尾提交 + tag**

```bash
git add README.md
git commit -m "docs: README - optional signals / SPI slave modes / RF antenna switch"
git tag v1.7
git log --oneline -12
```

- [ ] **Step 4: 交付确认（交用户）**

请用户双击 `index.html` 验收：UART0 加 MODEM、SPI 从机模式、RF 开关三项各点一遍；用旧工程文件（v1 导出的 .json）试一次载入。通过后本子项目收档；若发现问题，`git revert` 对应提交或回退 tag `v1.6.1`。

---

## 执行备注

- 任务顺序有依赖：1→2→3→4→5（引擎）→ 6→7（校验/导出）→ 8（数据）→ 9→10（UI）→ 11（收尾），不得跳序。
- Task 8 是唯一改动真实数据文件的任务；它的 Step 2 列明的两处既有断言适配是行为升级所致，其余任何既有失败都必须当作真 bug 处理。
- 浏览器验证会话名统一 `cppv17`，收尾记得 `agent-browser --session cppv17 close`。
