# 多封装家族（CH582F + CH583M）实施计划（v1.8 · 子项目 #3）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付 CH582F（QFN28）与 CH583M（QFN48）两份芯片数据 + 老工程按"chip 名+封装"路由，实测"加芯片=文件+清单一行"的零引擎改动承诺。

**Architecture:** 三份数据文件各自自包含（D1' 纯复制）；家族差异进 `docs/reference/ch58x-family-diff.md`；唯一代码改动 = `exporters.js` 加纯函数 `resolveProjectTarget` + `app.js` 载入路由段接入；引擎/渲染/schema 零改动。

**Tech Stack:** 零依赖原生 JS（UMD-lite）；PDF 审计用 C:\Python314 + pypdf/pdfplumber（双引擎交叉）；Node 跑单测，agent-browser 做真实点击验证。

**Spec:** `docs/superpowers/specs/2026-10-15-multi-package-family-design.md`

## Global Constraints

- 零依赖、无构建；`file://` 直开；引擎全纯函数、Node 可测；UI 文本中文、进 innerHTML 走 escapeHtml。
- 芯片事实以 `CH583DS1 V1.9`（`C:\Users\Xi.Wang33\Downloads\CH583DS1.PDF`）+ `docs/reference/ch582-pin-table.txt` 为准；**双引擎交叉，重要结论三处互证**（图1-1 引脚排列 / 逐脚引脚表 / 表7-7 与寄存器位）；手册缺参数 → 挂账告知，**不猜值**。
- **逐脚引脚表中间列 = QFN28 引脚号**（"无 P" = QFN28 未引出；2026-10-15 已实测确认）。已知不在 QFN28 的 IO：PB0/PB1/PB2/PB3/PB5/PB6/PB9/PB16/PB17/PB18/PB19/PB20/PB21、PA0/PA1/PA2/PA3/PA6/PA7。
- 新数据文件 schemaVersion 2；id 规则照既有 slug；每文件头部注明 `meta.source = "CH583DS1 V1.9 (2025-04-10)"`。
- 既有 181 单测 + fuzz 必须保持绿；回退点：Task 1 Step 0 打 tag `v1.7.1`。
- 测试命令：`node tests/engine.test.js` / `node tests/fuzz.js`（`D:\Code_Project\chip-pin-planner` 下）；浏览器会话名 `cppv18`。
- 每个 Task 收尾 commit；数据文件以 `validateChip` 零报错为收口（规则 + 验证器双保险）。

## Review Focus（最易咬人的五类 → 各自测试归属）

1. **同名多封装/缺 package 的路由歧义**——"CH582M" 命中多个文件时不得静默取错（Task 1：精确优先、仅名候选>1 带 note）。
2. **裁剪后的数据不得留"死脚引用"**——QFN28 上不存在的脚绝不能出现在任何 pins/claims 里（Task 3：validateChip 零错 + 已删信号断言）。
3. **无 chipId 且名字无匹配时不静默**——维持明确报错（Task 1 单测 + Task 5 浏览器门）。
4. **CH583M 的 SPI1 与 SPI0 并存不冲突**（PA0-2 与 PA13-15 互不干扰、SPI1 无 modes/无 groupSwitch）（Task 2 测试）。
5. **三芯片共存的下拉顺序与状态隔离**（切换互不串扰）（Task 6 浏览器门）。

---

### Task 1: 引擎 — resolveProjectTarget 纯函数 + readProjectChipId 返 package

**Files:**
- Modify: `js/engine/exporters.js`
- Test: `tests/engine.test.js`

**Interfaces:**
- Produces: `readProjectChipId(text)` → `{ chipId, chipName, package }`（package 非字符串时回落 null）；`resolveProjectTarget(chips, meta)` → `{ index: number|null, note?: string, miss?: "chipId" }`（chips = loader.buildChips 产物数组）。

- [ ] **Step 0: 打回退点**

```bash
cd /d/Code_Project/chip-pin-planner
git tag v1.7.1
git tag
```
Expected: 出现 v1.3 / v1.5 / v1.6 / v1.6.1 / v1.7 / v1.7.1。

- [ ] **Step 1: 写失败测试**（插在最终 summary 行之前）

```js
console.log("\n=== v1.8-1: 工程路由 ===");

t("readProjectChipId：返回 package（有/无/非字符串）", () => {
  const withPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M", package: "QFN48" });
  assert.strictEqual(Exp.readProjectChipId(withPkg).package, "QFN48");
  const noPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M" });
  assert.strictEqual(Exp.readProjectChipId(noPkg).package, null);
  const badPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M", package: 7 });
  assert.strictEqual(Exp.readProjectChipId(badPkg).package, null);
});

t("resolveProjectTarget：chipId 命中 / 未命中带 miss 标记", () => {
  const chips = [
    { ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } },
    { ok: true, chipId: "ch582f-qfn28", def: { chip: { name: "CH582F", package: "QFN28" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipId: "ch582f-qfn28" }).index, 1);
  const miss = Exp.resolveProjectTarget(chips, { chipId: "nope" });
  assert.strictEqual(miss.index, null);
  assert.strictEqual(miss.miss, "chipId");
});

t("resolveProjectTarget：无 chipId 时名+封装精确命中；同名多封装仅名匹配带 note", () => {
  const chips = [
    { ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } },
    { ok: true, chipId: "ch582m-qfn32", def: { chip: { name: "CH582M", package: "QFN32" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH582M", package: "QFN32" }).index, 1);
  const byName = Exp.resolveProjectTarget(chips, { chipName: "CH582M", package: null });
  assert.strictEqual(byName.index, 0);
  assert.ok(byName.note && byName.note.includes("同名多封装"), byName.note);
});

t("resolveProjectTarget：无 chipId 无 chipName / 名字无命中 → index null", () => {
  const chips = [{ ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } }];
  assert.strictEqual(Exp.resolveProjectTarget(chips, {}).index, null);
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH999" }).index, null);
});

t("resolveProjectTarget：非 ok 芯片不参与匹配", () => {
  const chips = [
    { ok: false, chipId: "ch582m-qfn48", def: null },
    { ok: true, chipId: "ch582f-qfn28", def: { chip: { name: "CH582F", package: "QFN28" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipId: "ch582m-qfn48" }).miss, "chipId");
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH582F" }).index, 1);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js > /tmp/t18.log 2>&1; echo "exit=$?"; tail -1 /tmp/t18.log`
Expected: exit=1，5 条新测试 FAIL（`resolveProjectTarget is not a function` / package 为 undefined）。

- [ ] **Step 3: 实现**

`js/engine/exporters.js`。`readProjectChipId` 的返回行替换为：

```js
    return { chipId: obj.chipId || null, chipName: obj.chip || null,
             package: (typeof obj.package === "string" && obj.package) ? obj.package : null };
```

在 `readProjectChipId` 之后新增：

```js
  // 载入工程时的目标芯片解析：chipId 精确匹配；无 chipId 时按 chip 名+封装（次选仅名）路由
  // 返回 { index } 命中（同名多候选仅名匹配时带 note）；{ index:null, miss:"chipId" } 有 chipId 但缺数据；
  // { index:null } 无从路由（调用方维持现状：对当前芯片校验并报错）
  function resolveProjectTarget(chips, meta) {
    function okAt(i) { return chips[i] && chips[i].ok && chips[i].def; }
    if (meta.chipId) {
      for (var i = 0; i < chips.length; i++) {
        if (okAt(i) && chips[i].chipId === meta.chipId) return { index: i };
      }
      return { index: null, miss: "chipId" };
    }
    if (!meta.chipName) return { index: null };
    var byName = [];
    for (var j = 0; j < chips.length; j++) {
      if (okAt(j) && chips[j].def.chip.name === meta.chipName) byName.push(j);
    }
    if (!byName.length) return { index: null };
    if (meta.package) {
      for (var k = 0; k < byName.length; k++) {
        if (chips[byName[k]].def.chip.package === meta.package) return { index: byName[k] };
      }
    }
    if (byName.length > 1) {
      return { index: byName[0],
               note: "存在同名多封装，已按首个匹配（" + chips[byName[0]].def.chip.package + "）" };
    }
    return { index: byName[0] };
  }
```

导出对象追加 `resolveProjectTarget: resolveProjectTarget,`。

- [ ] **Step 4: 跑测试确认通过 + 全量**

Run: `node tests/engine.test.js > /tmp/t18b.log 2>&1; echo "exit=$?"; tail -1 /tmp/t18b.log; node tests/fuzz.js > /tmp/t18f.log 2>&1; echo "fuzz=$?"`
Expected: exit=0，`186 passed, 0 failed`；fuzz=0。

- [ ] **Step 5: 提交**

```bash
git add js/engine/exporters.js tests/engine.test.js
git commit -m "feat: resolveProjectTarget (name+package routing for chipId-less projects) + readProjectChipId returns package"
```

---

### Task 2: 数据 — CH583M QFN48（审计 + 文件 + 差异文档首段）

**Files:**
- Create: `chips/wch-ch583m-qfn48.js`
- Modify: `docs/reference/ch58x-family-diff.md`（新建）
- Test: `tests/engine.test.js`

**Interfaces:**
- Consumes: `chips/wch-ch582m-qfn48.js`（模板与基线）；Task 8-v1.7 的 schema v2 规则。
- Produces: CH583M 数据（含 SPI1 独立资源）供 Task 4 清单与测试。

- [ ] **Step 1: 审计（双引擎交叉）**

用既有扫描脚本模式（参考 `.claude\tmp\cpp-opt2-20261010\scan_pb16.py`）对 `C:\Users\Xi.Wang33\Downloads\CH583DS1.PDF` 做两遍：

- pypdf 与 pdfplumber 各抽一遍**全部 40 个 IO 引脚的复用功能描述块**，产出"CH582M vs CH583M"的逐脚 alts 差异两版清单；
- 差异合并去重后与**图1-1 的 CH583M 标注**互证（已知锚点：PA0/SCK1、PA1/MOSI1、PA2/MISO1）；
- 差异结论固化进 `docs/reference/ch58x-family-diff.md` 第一节（表格：脚 | CH582M alts | CH583M alts | 证据页）。

预期结果（供核对，以审计为准）：除 PA0/PA1/PA2 外无差异（若有额外差异，逐条记入文档并纳入下面的"差异例外集"）。
SPI1 说明：手册第 10 章"SPI1 只支持主机模式"；逐脚表 PA0-2 未列 SCS1、表7-7 仅 SPI0 → **SPI1 = 三信号（SCK1/MOSI1/MISO1），无片选信号**。若双引擎抽查发现 SCS1 痕迹，停下按 systematic-debugging 核证后再定。

- [ ] **Step 2: 建数据文件**

复制 `chips/wch-ch582m-qfn48.js` → `chips/wch-ch583m-qfn48.js`，做且仅做以下改动：

1) 头部与元数据：

```js
    schemaVersion: 2,
    id: "ch583m-qfn48",
    meta: { source: "CH583DS1 V1.9 (2025-04-10)", author: "Xi.Wang33", date: "2026-10-15",
            note: "与 CH582M 差异见 docs/reference/ch58x-family-diff.md：+SPI1（PA0-2）" },
    chip: { vendor: "WCH", name: "CH583M", package: "QFN48" },
```

2) PA0/PA1/PA2 的 alts（照手册逐脚表，双引擎核对后）：

```js
      { num: 39, name: "PA0", type: "io", alts: ["SCK1", "AIN9"] },
      { num: 40, name: "PA1", type: "io", alts: ["MOSI1", "AIN8"] },
      { num: 41, name: "PA2", type: "io", alts: ["TMR3_", "MISO1", "AIN7"] },
```

（若 Step 1 审计发现额外差异脚，按审计结论同步修改，并把该脚加入测试的"差异例外集"。）

3) resources 里 SPI0 资源之后追加（无 modes、无 groupSwitch、无 optional）：

```js
      { id: "SPI1", category: "SPI", label: "SPI1",
        signals: [ { name: "SCK1",  pins: ["PA0"] },
                   { name: "MOSI1", pins: ["PA1"] },
                   { name: "MISO1", pins: ["PA2"] } ] },
```

- [ ] **Step 3: 写测试**（插在 v1.8-1 段之后）

```js
console.log("\n=== v1.8-2: CH583M 数据 ===");

const CHIP583 = require("../chips/wch-ch583m-qfn48.js");

t("CH583M：validateChip 通过，id/名/封装正确", () => {
  assert.strictEqual(CHIP583.schemaVersion, 2);
  assert.strictEqual(CHIP583.id, "ch583m-qfn48");
  assert.strictEqual(CHIP583.chip.name, "CH583M");
  const v = Model.validateChip(CHIP583);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("CH583M：SPI1 资源（三脚、主机模式、无重映射）", () => {
  const sp1 = Avail.findResource(CHIP583, "SPI1");
  assert.ok(sp1, "应有 SPI1");
  assert.strictEqual(sp1.groupSwitch, undefined);
  assert.strictEqual(sp1.modes, undefined);
  assert.deepStrictEqual(sp1.signals.map(s => s.name), ["SCK1", "MOSI1", "MISO1"]);
  assert.deepStrictEqual(sp1.signals[0].pins, ["PA0"]);
});

t("CH583M：SPI1 与 SPI0 可同时分配（互不冲突）", () => {
  let s = Avail.defaultState(CHIP583);
  const b0 = Avail.bestAssignment(CHIP583, s, "SPI0", "full");
  assert.strictEqual(b0.error, undefined, JSON.stringify(b0));
  s = Avail.assign(CHIP583, s, "SPI0", { group: b0.group, mode: b0.mode, pins: b0.pins }).state;
  const b1 = Avail.bestAssignment(CHIP583, s, "SPI1");
  assert.strictEqual(b1.error, undefined, JSON.stringify(b1));
  assert.deepStrictEqual(b1.pins, { SCK1: "PA0", MOSI1: "PA1", MISO1: "PA2" });
});

t("CH583M：与 CH582M 逐脚 alts 一致（除差异例外集）", () => {
  const EXC = new Set(["PA0", "PA1", "PA2"]);   // 审计确认的差异脚，若有新增在此追加
  CHIP583.pins.filter(p => p.type === "io" && !EXC.has(p.name)).forEach(p => {
    const m = CHIP.pins.find(x => x.name === p.name);
    assert.deepStrictEqual(p.alts, m.alts, p.name + " alts 应与 CH582M 相同");
  });
});
```

- [ ] **Step 4: 跑测试**

Run: `node tests/engine.test.js > /tmp/t18c.log 2>&1; echo "exit=$?"; tail -1 /tmp/t18c.log`
Expected: exit=0，全绿（`190 passed` 左右）。

- [ ] **Step 5: 提交**

```bash
git add chips/wch-ch583m-qfn48.js docs/reference/ch58x-family-diff.md tests/engine.test.js
git commit -m "feat: CH583M QFN48 data (+SPI1 host-only on PA0-2), family diff doc part 1"
```

---

### Task 3: 数据 — CH582F QFN28（审计 + 裁剪规则 + 文件）

**Files:**
- Create: `chips/wch-ch582f-qfn28.js`
- Modify: `docs/reference/ch58x-family-diff.md`（追加第二节）
- Test: `tests/engine.test.js`

**Interfaces:**
- Consumes: 模板/基线同 Task 2；QFN28 列义（Global Constraints）。
- Produces: CH582F 数据供 Task 4/6。

- [ ] **Step 1: 审计（产出 28 行事实表）**

1) 从 `docs/reference/ch582-pin-table.txt` 抽出**中间列带 QFN28 引脚号的全部行** → 事实表 `QFN28引脚号 → 脚名 → 类型 → alts`；期望恰好 **28 行（含 EP/GND 记为 0）**。
2) 双引擎对 `CH583DS1.PDF` 图1-1 的 28 脚排列表做一轮独立抽取，与事实表**逐脚核对**（脚名与引脚号一一对应；不一致处停下核证）。
3) 事实表 + 审计结论写入 `ch58x-family-diff.md` 第二节（含封装参数行：body/pitch——**先查手册封装尺寸章；查到即用并注页码；查不到则挂账写明"待补"，不得猜值**，随后在 Step 4 汇报给用户）。

- [ ] **Step 2: 裁剪规则（对 CH582F 文件逐条应用；以 validateChip 零报错为收口）**

1) `pins` = 事实表 28 行 + EP GND（`num` 用 **QFN28 引脚号**；`type/alts/note` 照手册）。
2) 每个资源的信号落脚点 ∩ QFN28 脚集：**空 → 删除该信号**；**剩 1 个 → 单脚化**（数组变单元素）。
3) `groupSwitch` 资源：若其**任一必选信号的落脚点不再是 2 个** → **移除该资源的 `groupSwitch` 字段**（映射组语义在本封装不成立；引擎对无 groupSwitch 资源自动隐藏"改用映射组"）。
4) `signal.groupKey`（UART0 的 DSR/DTR）：若两信号都不再是 2 脚 → **两信号均移除 `groupKey`**；若仅部分剩 2 脚 → 保留 `groupKey` 但校验要求二者均为 2 脚（不满足则移除）。
5) `optional` 列表与实际保留的可选信号同步（删掉的信号从列表去掉）。
6) `globalConfigs[*].claims`：剔除 QFN28 不存在的脚（debug PB14/PB15、rst PB23、xtal PA10/PA11 预计全在，以核对为准）；claims 全空则删除该开关。
7) 信号全删的资源 → 删除该资源；部分裁剪 → `meta.note` 记一句（与 family-diff.md 一致）。
8) 已知先行结论（**初筛，审计复核后为准**）：UART0 → RTS/CTS/RI/DCD 删、DTR `["PB15"]`、DSR `["PB14"]`、optional 变 `["DTR","DSR"]`、`UART0_MODEM` groupKey 移除；I2C → 去 groupSwitch、SCL `["PB13"]`、SDA `["PB12"]`；UART2 → TXD `["PB23"]`、RXD `["PB22"]`；UART3 → 去 groupSwitch、TXD `["PA5"]`、RXD `["PA4"]`；PWM4/5/7/9 → 单脚化、PWM8 需核（PB6+PB2 均不在 → 预计删）、`PWMX` groupKey 预计移除；其余资源（SPI0/UART1/TMRx/USB/ADC 等）逐脚核。

- [ ] **Step 3: 建数据文件**

复制 `chips/wch-ch582m-qfn48.js` → `chips/wch-ch582f-qfn28.js`，改：`id: "ch582f-qfn28"`、`chip: { vendor: "WCH", name: "CH582F", package: "QFN28" }`、`meta.note`（差异一句 + 来源）、`package: { family: "quad", style: "no-lead", pinsPerSide: 7, pitch: <审计值>, body: [<宽>, <长>], pin1: "topLeft", sequence: "ccw-down", thermalPad: "GND (EP)" }`、`pins`/`resources` 按 Step 2 规则重排。

- [ ] **Step 4: 写测试**（插在 v1.8-2 段之后）

```js
console.log("\n=== v1.8-3: CH582F 数据 ===");

const CHIPF = require("../chips/wch-ch582f-qfn28.js");

t("CH582F：validateChip 通过；pins = 28 + EP；每边 7 脚", () => {
  assert.strictEqual(CHIPF.schemaVersion, 2);
  assert.strictEqual(CHIPF.package.pinsPerSide, 7);
  assert.strictEqual(CHIPF.pins.length, 29);   // 28 脚 + EP（以事实表为准）
  const v = Model.validateChip(CHIPF);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("CH582F：QFN28 未引出脚不得出现在任何资源/开关中（无死脚引用）", () => {
  const bad = ["PB0", "PB1", "PB2", "PB3", "PB5", "PB6", "PB9",
               "PB16", "PB17", "PB18", "PB19", "PB20", "PB21",
               "PA0", "PA1", "PA2", "PA3", "PA6", "PA7"];
  const refs = [];
  (CHIPF.resources || []).forEach(r => {
    (r.signals || []).forEach(s => (s.pins || []).forEach(p => { if (bad.indexOf(p) >= 0) refs.push(r.id + "." + s.name + "=" + p); }));
  });
  (CHIPF.globalConfigs || []).forEach(c => (c.claims || []).forEach(p => { if (bad.indexOf(p) >= 0) refs.push(c.id + "=" + p); }));
  assert.deepStrictEqual(refs, [], "死脚引用: " + refs.join(", "));
});

t("CH582F：UART0 裁剪正确（MODEM 只剩 DTR/DSR，单脚化、无 groupKey）", () => {
  const u = Avail.findResource(CHIPF, "UART0");
  assert.deepStrictEqual(u.optional, ["DTR", "DSR"]);
  const sig = n => u.signals.find(s => s.name === n);
  assert.strictEqual(sig("RTS"), undefined);
  assert.deepStrictEqual(sig("DTR").pins, ["PB15"]);
  assert.strictEqual(sig("DTR").groupKey, undefined);
  assert.deepStrictEqual(sig("DSR").pins, ["PB14"]);
});

t("CH582F：I2C / UART3 映射组语义正确移除", () => {
  assert.strictEqual(Avail.findResource(CHIPF, "I2C").groupSwitch, undefined);
  assert.strictEqual(Avail.findResource(CHIPF, "UART3").groupSwitch, undefined);
});
```

（若审计结论与上述示例断言不符——例如某脚实际在 QFN28 上——**以审计事实为准修改断言**，并在 commit message 记一句。）

- [ ] **Step 5: 跑测试 + 提交**

Run: `node tests/engine.test.js > /tmp/t18d.log 2>&1; echo "exit=$?"; tail -1 /tmp/t18d.log`
Expected: exit=0 全绿。

```bash
git add chips/wch-ch582f-qfn28.js docs/reference/ch58x-family-diff.md tests/engine.test.js
git commit -m "feat: CH582F QFN28 data (trimmed resources per package pinout), family diff doc part 2"
```

---

### Task 4: 清单接入 + 三芯片对账

**Files:**
- Modify: `chips/manifest.js`
- Test: `tests/engine.test.js`

- [ ] **Step 1: 写失败测试**（插在 v1.8-3 段之后）

```js
console.log("\n=== v1.8-4: 三芯片对账 ===");

t("清单：三颗芯片按 M→F→583M 顺序全部可用、id 唯一", () => {
  const defs = [
    require("../chips/wch-ch582m-qfn48.js"),
    require("../chips/wch-ch582f-qfn28.js"),
    require("../chips/wch-ch583m-qfn48.js")
  ];
  const chips = Loader.buildChips(defs.map((d, i) => ({ file: "chips/x" + i + ".js", def: d })), Model);
  assert.deepStrictEqual(chips.map(c => c.ok), [true, true, true], JSON.stringify(chips.map(c => c.reason)));
  assert.deepStrictEqual(chips.map(c => c.chipId), ["ch582m-qfn48", "ch582f-qfn28", "ch583m-qfn48"]);
  assert.deepStrictEqual(chips.map(c => c.def.chip.name), ["CH582M", "CH582F", "CH583M"]);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js > /tmp/t18e.log 2>&1; echo "exit=$?"`
Expected: exit=1（`Cannot find module '../chips/wch-ch582f-qfn28.js'` 之类——若前两任务已建文件则应直接过；不过则检查文件名/路径）。

- [ ] **Step 3: 清单加两行**

`chips/manifest.js`：

```js
window.CHIP_MANIFEST = [
  "chips/wch-ch582m-qfn48.js",
  "chips/wch-ch582f-qfn28.js",
  "chips/wch-ch583m-qfn48.js"
];
```

- [ ] **Step 4: 跑测试（Node 层全量）**

Run: `node tests/engine.test.js > /tmp/t18f.log 2>&1; echo "exit=$?"; tail -1 /tmp/t18f.log; node tests/fuzz.js > /tmp/t18g.log 2>&1; echo "fuzz=$?"`
Expected: 全绿；fuzz=0。

- [ ] **Step 5: 提交**

```bash
git add chips/manifest.js tests/engine.test.js
git commit -m "feat: manifest carries all three packages (M/F/583M), loader reconciliation test"
```

---

### Task 5: app.js 路由接入 + README

**Files:**
- Modify: `js/app.js`（载入工程 handler 路由段）
- Modify: `README.md`

**Interfaces:**
- Consumes: `CPP.Exporters.resolveProjectTarget`（Task 1）。

- [ ] **Step 1: 替换载入工程 handler 的路由段**

`js/app.js` 中找到（v1.5-minor 版本）：

```js
      // 先按目标芯片校验工程内容，全部通过才切换芯片（失败不留半途切换）
      var targetIdx = activeIdx;
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
        targetIdx = target;
      }
```

替换为：

```js
      // 目标芯片解析：chipId 精确路由；无 chipId 时按 chip 名+封装（次选仅名）路由（v1.8）
      var route = CPP.Exporters.resolveProjectTarget(chips, meta);
      if (route.miss === "chipId") {
        var msg = "缺少芯片数据：" + (meta.chipName || "") + "（" + meta.chipId + "）——需要在 chips/ 里补上这颗芯片";
        log("载入失败：" + msg); alert("载入失败：" + msg);
        return;
      }
      var targetIdx = (route.index !== null) ? route.index : activeIdx;
      var autoSwitched = targetIdx !== activeIdx;   // 须在 activateChip 之前捕获
```

并把成功路径的收尾日志行：

```js
      log("已载入工程：" + f.name + "（" + chipLabel(chips[activeIdx]) + "）");
```

替换为：

```js
      log("已载入工程：" + f.name + "（" + chipLabel(chips[activeIdx]) + "）" +
          (route.note ? "。" + route.note : "") +
          (autoSwitched ? "（已按工程信息自动切换芯片）" : ""));
```

（`activateChip(targetIdx, true)` 调用与其余顺序不动——仍为先校验后切换。）

- [ ] **Step 2: README 更新**

"用法"列表内"顶栏芯片下拉"条目（现文案"载入工程会自动切到文件所属芯片"）改为：

```markdown
- 顶栏芯片下拉：多颗芯片一键切换（各芯片配置在会话内互不影响，刷新即清空；载入工程会自动切到文件所属芯片——无芯片标识的老工程按工程内的芯片名+封装匹配）
```

- [ ] **Step 3: 语法自检 + 提交**

```bash
node --check js/app.js && echo ok
git add js/app.js README.md
git commit -m "feat(ui): project import routes by chip name+package when chipId absent + README"
```

---

### Task 6: 浏览器验证 + 家族差异表收编 + tag v1.8

**Files:**
- Modify: `docs/reference/ch58x-family-diff.md`（收编：封装参数对照总表 + 三芯片差异总览）
- Test: 浏览器真实路径门

- [ ] **Step 1: 浏览器验证（agent-browser，会话 `cppv18`；截图存 `.claude\tmp\cpp-mpkg-20261015\`）**

```bash
agent-browser --session cppv18 open "file:///D:/Code_Project/chip-pin-planner/index.html"
```
逐项核对：
1. 顶栏下拉三项：`CH582M · QFN48 / CH582F · QFN28 / CH583M · QFN48`；逐一切换，SVG 重绘且日志正确；
2. **CH582F**：QFN28 渲染正确（每边 7 脚、引脚编号 1-28 与事实表一致）→ 截图 EV18-1；左侧 UART0 的「＋」菜单只剩 `DTR → PB15` / `DSR → PB14` 两项 → 截图 EV18-2；
3. **CH583M**：左栏 SPI 分类下有 SPI1；点 SPI1 → 占 PA0/PA1/PA2；与 SPI0 同时分配不冲突 → 截图 EV18-3；
4. **老工程路由**：切到 CH582F → 用 v1 样式的 CH582M 工程文件（现造：在 CH582M 上配几项后"保存工程"，再手删 `chipId` 字段存为新文件）载入 → 应自动切回 CH582M 并日志出现"已按工程信息自动切换芯片" → 截图 EV18-4；
5. 收尾 `agent-browser --session cppv18 close`。

- [ ] **Step 2: family-diff.md 收编**

补一节"总览"：三芯片对照表（chip/封装/IO 数/资源数/关键差异）+ 封装参数（body/pitch 来源标注；若 QFN28 尺寸挂账则在此标红"待补"）+ 审计方法备注（双引擎、日期、页码）。

- [ ] **Step 3: 全量回归 + tag**

```bash
node tests/engine.test.js > /tmp/z18.log 2>&1; echo "unit=$?"; tail -1 /tmp/z18.log
node tests/fuzz.js > /tmp/z18f.log 2>&1; echo "fuzz=$?"
git add docs/reference/ch58x-family-diff.md && git commit -m "docs: family diff overview (3 packages) + package params" --quiet
git tag v1.8
git log --oneline -12
```

- [ ] **Step 4: 交付确认（交用户）**

请用户双击 `index.html` 验收：下拉三芯片切换、CH582F 的 QFN28 图与裁剪后的资源、CH583M 的 SPI1、老工程自动路由。通过后本子项目收档；若缺 QFN28 封装尺寸（挂账项），汇报并等候补来源。

---

## 执行备注

- 任务依赖：1（引擎）→ 2/3（数据，可先后并行无关）→ 4（清单）→ 5（UI）→ 6（收尾）。
- Task 2/3 的审计是本计划的"研究型步骤"：结论以双引擎+三处互证为准；**审计结论与计划预期不符时以审计为准**，同步修改测试断言并在 commit message 记录。
- 浏览器验证会话名 `cppv18`；收尾关闭。
- QFN28 封装尺寸若手册确实没有：**不猜**，挂账并在 Task 6 汇报用户（可能来源：WCH 官网 CH582F 封装图，需联网核对）。
