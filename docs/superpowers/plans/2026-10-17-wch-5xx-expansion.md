# WCH RISC-V 蓝牙无线系列（5xx）补全 · 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 WCH“RISC-V 蓝牙无线系列”中尚未覆盖的 CH57x / CH58x / CH59x 型号按家族逐步加入 `chips/`，同时建立按厂商/系列分类的 UI 与数据约定。

**Architecture:** 保持现有“数据驱动 + 芯片无关引擎”的结构：每个型号×封装一个数据文件；同族笔记本覆盖多个型号时，以最大封装为基线、其余封装按手册事实表机械裁剪，并用数据锁测试固定差异。分类只新增 `chip.series` 元数据与下拉分组，不改变 chipId / 工程文件路由。

**Tech Stack:** 零依赖静态网页、UMD-lite、Node.js LTS 测试、手写 SVG 封装渲染、GitHub Actions（windows-latest）。

**状态：** 待评审（2026-10-17）；评审通过前不写实现代码。

---

## 0. 当前基线

- 已发布 v1.9；tag `v1.9` → `d5cf055`，master 文档提交 `0325f7d` 之后继续演进。
- 已覆盖：CH582M QFN48、CH582F QFN28、CH583M QFN48。
- 测试基线：`node tests/engine.test.js` 200 passed / 0 failed；`node tests/fuzz.js` 退出码 0；`node tests/dist.test.js` 8 passed / 0 failed。
- 数据规则见 `docs/chip-data-schema.md` 与 `AGENTS.md`；发布流程见 `docs/release.md`。

**开始前：**

- [ ] 在 master 上打一个回退点：`git tag pre-wch-5xx && git push origin pre-wch-5xx`
- [ ] 确认 `git status` 干净、三套测试全绿。

---

## 1. 官方型号清单（2026-10-17 抓取）

来源：<https://www.wch.cn/products/productsCenter/mcuInterface?categoryId=74>（RISC-V 蓝牙无线系列，18 个型号条目）。

| 系列 | 型号 | 封装 | 当前状态 |
|---|---|---|---|
| CH58x | CH582 | QFN48 / QFN28 | ✅ 已覆盖（CH582M / CH582F） |
| CH58x | CH583 | QFN48 | ✅ 已覆盖（CH583M） |
| CH58x | CH584 | QFN48T / QFN32 | 待加 |
| CH58x | CH585 | QFN48 / QFN32 / QFN26C3 / QFN20 | 待加 |
| CH58x | CH586 | QFN68X7 / QFN48 | 待加（手册待确认） |
| CH58x | CH587 | QFN68X7 / QFN48 / QFN32 / QFN20 | 待加（手册待确认） |
| CH59x | CH591 | QFN28 / QFN20 / TSSOP16 | 待加 |
| CH59x | CH592 | QFN32 / QFN28 / QFN20 | 待加 |
| CH59x | CH595 | QFN32 / QFN28 / QFN20 | 待加 |
| CH59x | CH596 | QFN20 | 待加（可能独立手册） |
| CH57x | CH571 | QFN28 / TSSOP16 / ESSOP10 | 待加 |
| CH57x | CH573 | QFN28 | 待加 |
| CH57x | CH570 | QFN20 / DFN10X3 / SOP8 | 待加 |
| CH57x | CH572 | QFN20 / DFN10X3 / TSSOP16 | 待加 |
| CH32V | CH32V208 | QFN28 / QFN48 / LQFP64M / QFN68 | 暂缓（另属 CH32V 系列） |

**手册确认状态：**

| 家族 | 手册 | 覆盖 | 状态 |
|---|---|---|---|
| CH582/CH583 | CH583DS1 | CH582/CH583 | ✅ 已在用 |
| CH584/CH585 | CH585DS1 | CH585/CH584 | ✅ 公开可下载 |
| CH591/CH592 | CH592DS1 | CH591/CH592 | ✅ 公开可下载 |
| CH595/CH596 | CH595DS1 + 可能的 CH596DS1 | CH595X/F/D；CH596D | ⚠️ 需确认是否合本 |
| CH571/CH573 | CH573DS1 | CH573/CH571 | ✅ 公开可下载 |
| CH570/CH572 | CH572DS1 | CH570/CH572 | ⚠️ 需确认 CH570 是否合本 |
| CH586/CH587 | 待定位 | CH586/CH587 | ⚠️ 官网下载入口待确认 |
| CH32V208 | 待定位 | CH32V208 | 暂缓 |

> 每本手册在 `meta.source` 中记录“型号 + 版本 + 日期”；执行时以 WCH 官网最新版本为准。

---

## 2. 分类设计（先做，后续所有芯片受益）

### 2.1 数据字段

- 在 `chip` 对象中新增可选字段 `series`：
  ```js
  chip: { vendor: "WCH", series: "CH58x", name: "CH585", package: "QFN48" }
  ```
- `series` 只用于展示与分组，不参与 `chipId` / 工程文件路由；缺省按 `"未分类"` 处理。
- 现有三颗芯片补 `series: "CH58x"`。
- 未来厂商使用 `vendor` + `series` 两级分类，例如 `WCH · CH59x`、`TI · CC26xx`。

### 2.2 UI 分组

- 顶栏芯片下拉改为 `<optgroup>`，标签为 `<vendor> · <series>`；
- 组顺序 = 该系列在 `chips/manifest.js` 中首次出现的顺序；
- 组内顺序 = manifest 顺序；
- 无效芯片仍以禁用项显示，归入 `其他 · 未分类`。

### 2.3 目录结构

- 本阶段保持 `chips/` 扁平文件 + `厂商-型号-封装.js` 命名；
- 出现第二个厂商时再做 `chips/<vendor>/` 目录迁移（单独提交，避免与本计划混在一起）。

---

## 3. 封装支持

当前渲染器支持 `quad` / `dual` / `dual-split`。本计划涉及的封装：

| 封装 | family | 备注 |
|---|---|---|
| QFN48 / QFN32 / QFN20 / QFN28 / QFN68X7 / LQFP64M | `quad` | 引脚数为 4 的倍数 |
| TSSOP16 / SOP8 / DFN10X3 / ESSOP10 | `dual` 或 `dual-split` | 两侧等数或不等数，按手册确认 |
| QFN26C3 | **待定** | 26 脚不是 4 的倍数；若为 7/6/7/6 则需 `quad-split` |
| QFN48T | `quad` | `T` 的含义按手册确认（厚度/散热焊盘等） |

**新增 `quad-split`（条件任务）：** 四边数量可不同，`counts: [左, 下, 右, 上]`；只有 CH585DS1 封装章确认 QFN26C3 需要时才实施。

---

## 4. 总体排期

| 里程碑 | 内容 | 交付物 | 发版 |
|---|---|---|---|
| M0 | 基线标签 + 本计划评审 | tag `pre-wch-5xx` | — |
| M1 | 分类基础设施 + `quad-split`（条件） | `series` 字段、分组下拉、测试、文档 | — |
| M2 | CH584/CH585 试点 | 6 个数据文件 + 家族差异文档 + 数据锁测试 | v1.10 |
| M3 | CH591/CH592 | 6 个数据文件 + CH59x 差异文档 | v1.11 |
| M4 | CH595/CH596 | 4 个数据文件（手册确认后） | v1.12 |
| M5 | CH571/CH573 | 4 个数据文件 + CH57x 差异文档 | v1.13 |
| M6 | CH570/CH572 | 6 个数据文件 | v1.14 |
| M7 | CH586/CH587（手册确认后） | 6 个数据文件 | v1.15 |
| M8 | 可选：CH32V208 | 4 个数据文件 | 单独系列 |
| M9 | 文档/README/系列图更新 | 支持芯片表、截图 | 随最近版本 |

每个里程碑独立可回退；任一里程碑失败，不影响已发布版本。

---

## 5. Task 0：基线标签与评审

**Files:** 无代码改动。

- [ ] 确认 master 干净、三套测试全绿。
- [ ] `git tag pre-wch-5xx && git push origin pre-wch-5xx`。
- [ ] 用户评审本计划；确认 M2 试点家族与是否包含 QFN26C3。
- [ ] 评审通过后，再开始 Task 1。

---

## 6. Task 1：`series` 分类基础设施

**Files:**
- Modify: `js/engine/model.js`（校验 `chip.series`）
- Modify: `js/loader.js`（新增 `groupChips`）
- Modify: `js/app.js`（`updateChipSelect` 使用 `optgroup`）
- Modify: `chips/wch-ch582m-qfn48.js` / `wch-ch582f-qfn28.js` / `wch-ch583m-qfn48.js`（加 `series: "CH58x"`）
- Modify: `tests/engine.test.js`（新增分组/校验用例）
- Modify: `docs/chip-data-schema.md`、`README.md`、`CONTRIBUTING.md`、`AGENTS.md`

- [ ] **Step 1: 写失败测试（Loader 分组）**

在 `tests/engine.test.js` 的 Loader 测试区加入：

```js
t("groupChips：按 vendor · series 分组，保持清单顺序", () => {
  const chips = [
    { ok: true, def: { chip: { vendor: "WCH", series: "CH58x", name: "CH582M", package: "QFN48" } } },
    { ok: true, def: { chip: { vendor: "WCH", series: "CH59x", name: "CH592", package: "QFN32" } } },
    { ok: true, def: { chip: { vendor: "WCH", series: "CH58x", name: "CH583M", package: "QFN48" } } }
  ];
  const g = Loader.groupChips(chips);
  assert.strictEqual(g.length, 2);
  assert.strictEqual(g[0].label, "WCH · CH58x");
  assert.deepStrictEqual(g[0].items.map(x => x.index), [0, 2]);
  assert.strictEqual(g[1].label, "WCH · CH59x");
  assert.deepStrictEqual(g[1].items.map(x => x.index), [1]);
});

t("groupChips：缺 series 归入未分类", () => {
  const chips = [{ ok: true, def: { chip: { vendor: "WCH", name: "X", package: "QFN8" } } }];
  const g = Loader.groupChips(chips);
  assert.strictEqual(g[0].label, "WCH · 未分类");
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js`
Expected: FAIL（`Loader.groupChips is not a function`）。

- [ ] **Step 3: 实现 `groupChips`**

在 `js/loader.js` 中加入并导出：

```js
function groupChips(chips) {
  var groups = [], byKey = {};
  (chips || []).forEach(function (c, i) {
    var chip = (c && c.def && c.def.chip) || {};
    var vendor = chip.vendor || "其他";
    var series = chip.series || "未分类";
    var key = vendor + " · " + series;
    if (!byKey[key]) { byKey[key] = { key: key, label: key, items: [] }; groups.push(byKey[key]); }
    byKey[key].items.push({ chip: c, index: i });
  });
  return groups;
}
```

返回对象改为 `{ classify, loadAll, buildChips, groupChips }`。

- [ ] **Step 4: 跑测试确认通过**

Run: `node tests/engine.test.js`
Expected: 新增用例 PASS。

- [ ] **Step 5: 写失败测试（model 校验）**

```js
t("validateChip：chip.series 若提供必须是非空字符串", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.chip.series = "  ";
  const r = Model.validateChip(bad);
  assert.ok(r.errors.some(e => e.includes("series")));
  const ok = JSON.parse(JSON.stringify(miniChip));
  ok.chip.series = "CH58x";
  assert.strictEqual(Model.validateChip(ok).ok, true);
});
```

- [ ] **Step 6: 跑测试确认失败，然后实现校验**

在 `js/engine/model.js` 的 `chip` 校验附近加入：

```js
if (def.chip && def.chip.series !== undefined &&
    (typeof def.chip.series !== "string" || !def.chip.series.trim())) {
  errors.push("chip.series 若提供必须是非空字符串");
}
```

- [ ] **Step 7: 接入 UI 分组**

把 `js/app.js` 的 `updateChipSelect` 改为遍历 `CPP.Loader.groupChips(chips)`：

```js
function updateChipSelect() {
  var sel = document.getElementById("chip-select");
  if (!sel) return;
  sel.innerHTML = "";
  CPP.Loader.groupChips(chips).forEach(function (g) {
    var og = document.createElement("optgroup");
    og.label = g.label;
    g.items.forEach(function (it) {
      var c = it.chip, i = it.index;
      var opt = document.createElement("option");
      opt.value = String(i);
      if (c.ok) {
        opt.textContent = chipLabel(c);
        if (i === activeIdx) opt.selected = true;
      } else {
        opt.textContent = "⚠ " + c.file.split("/").pop() + " —— " + c.reason;
        opt.disabled = true;
      }
      og.appendChild(opt);
    });
    sel.appendChild(og);
  });
}
```

- [ ] **Step 8: 给现有三颗芯片加 `series`**

```js
chip: { vendor: "WCH", series: "CH58x", name: "CH582M", package: "QFN48" }
chip: { vendor: "WCH", series: "CH58x", name: "CH582F", package: "QFN28" }
chip: { vendor: "WCH", series: "CH58x", name: "CH583M", package: "QFN48" }
```

- [ ] **Step 9: 浏览器验收**

打开 `index.html`，确认下拉出现 `WCH · CH58x` 分组、三颗芯片可选、切换正常、无 console 报错。

- [ ] **Step 10: 更新文档并提交**

在 `docs/chip-data-schema.md` 的 `chip` 字段表加入 `series`；README 支持芯片表加“系列”列；CONTRIBUTING/AGENTS 注明新芯片填 `series`。

```bash
node tests/engine.test.js && node tests/fuzz.js && node tests/dist.test.js
git add js/engine/model.js js/loader.js js/app.js chips/*.js tests/engine.test.js docs/chip-data-schema.md README.md CONTRIBUTING.md AGENTS.md
git commit -m "feat: 芯片按 vendor/series 分组（series 字段 + 下拉 optgroup）"
```

---

## 7. Task 2：`quad-split` 封装族（条件任务）

**触发条件：** CH585DS1 封装章确认 QFN26C3 的四边引脚数不相等（例如 7/6/7/6）。若实际为等边或其他排列，先记录事实再决定是否需要此任务。

**Files:**
- Modify: `js/engine/model.js`（family 白名单 + counts 校验）
- Modify: `js/render/package-svg.js`（`computePinLayout` 分支）
- Modify: `tests/engine.test.js`（布局 + 校验用例）
- Modify: `docs/chip-data-schema.md`

- [ ] **Step 1: 写失败测试（26 脚 7/6/7/6）**

```js
t("quad-split：26 脚 7/6/7/6 的边与方向正确", () => {
  const pkg = { family: "quad-split", counts: [7, 6, 7, 6], pitch: 0.4, body: [3, 3] };
  const L = Pkg.computePinLayout(pkg);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 26);
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[8].side, "bottom");
  assert.strictEqual(byNum[13].side, "bottom");
  assert.strictEqual(byNum[14].side, "right");
  assert.strictEqual(byNum[20].side, "right");
  assert.ok(byNum[14].y > byNum[20].y);   // 右侧自下而上
  assert.strictEqual(byNum[21].side, "top");
  assert.strictEqual(byNum[26].side, "top");
  assert.ok(byNum[21].x > byNum[26].x);   // 上边自右而左
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node tests/engine.test.js`
Expected: FAIL（26 个引脚未生成 / family 未识别）。

- [ ] **Step 3: 实现布局分支**

在 `js/render/package-svg.js` 的 `computePinLayout` 中，`dual-split` 分支后加入：

```js
} else if (pkg.family === "quad-split") {
  var a = pkg.counts[0], b = pkg.counts[1], c = pkg.counts[2], d = pkg.counts[3];
  addLeft(range(1, a));
  addBottom(range(a + 1, a + b));
  addRight(range(a + b + 1, a + b + c));
  addTop(range(a + b + c + 1, a + b + c + d));
}
```

- [ ] **Step 4: 实现校验**

`js/engine/model.js`：

```js
var FAMILIES = ["quad", "dual", "dual-split", "quad-split"];
...
else if (pkg.family === "quad-split" && Array.isArray(pkg.counts)) {
  expectedPins = pkg.counts.reduce(function (s, v) { return s + v; }, 0);
}
...
if (pkg.family === "quad-split" &&
    (!Array.isArray(pkg.counts) || pkg.counts.length !== 4 ||
     !pkg.counts.every(function (v) { return Number.isInteger(v) && v > 0; }))) {
  errors.push("package.counts 必须是 4 个正整数（左/下/右/上）");
}
```

- [ ] **Step 5: 跑测试确认通过**

Run: `node tests/engine.test.js`
Expected: PASS。

- [ ] **Step 6: 文档 + 提交**

更新 `docs/chip-data-schema.md` 的封装表；提交：

```bash
git add js/engine/model.js js/render/package-svg.js tests/engine.test.js docs/chip-data-schema.md
git commit -m "feat: 支持四边不等数的 quad-split 封装族"
```

---

## 8. Task 3（M2）：CH584 / CH585 试点

**Datasheet:** CH585DS1（执行时从 WCH 官网下载并记录版本/日期；公开页面：<https://www.wch-ic.com/downloads/CH585DS1.PDF.html?type=en>）。

**Packages:** CH585 QFN48 / QFN32 / QFN26C3 / QFN20；CH584 QFN48T / QFN32。

**Files:**
- Create: `chips/wch-ch585-qfn48.js`（基线）
- Create: `chips/wch-ch585-qfn32.js`
- Create: `chips/wch-ch585-qfn26c3.js`
- Create: `chips/wch-ch585-qfn20.js`
- Create: `chips/wch-ch584-qfn48t.js`
- Create: `chips/wch-ch584-qfn32.js`
- Modify: `chips/manifest.js`（6 行，按 CH585→CH584 顺序）
- Create/Modify: `docs/reference/ch58x-family-diff.md`（新增 CH584/585 差异节）
- Modify: `tests/engine.test.js`（CH584/585 数据锁 + 包变体复算）
- Modify: `README.md`、`docs/user-guide.md`（支持芯片表/说明）

**审计步骤（每步都要留证据）：**

- [ ] **Step 1: 锁定事实源**

把 PDF 存到本地临时目录，记录：文件名、版本、日期、SHA-256；写入每个文件的 `meta.source`，例如 `"CH585DS1 V1.6 (2025-12-25)"`（以实际下载版本为准）。

- [ ] **Step 2: 双引擎提取引脚表**

用 `tools/pdf-crosscheck.py` + pypdf/pdfplumber 提取：
- 1.2 逐脚引脚表（脚号、名称、类型、复用功能）；
- 图 1-1 封装引脚排列；
- 封装章（QFN48/QFN32/QFN26C3/QFN20、QFN48T 的 body/pitch/EP）。

重要结论三处互证；手册自身笔误记录到差异文档。

- [ ] **Step 3: 建 CH585 QFN48 基线**

按 `docs/chip-data-schema.md` 填写：
- `pins`：1..48 + EP，`type` 白名单，`alts` 按手册；
- `globalConfigs`：调试口、RST、32K 晶振、RF 开关等；
- `resources`：UART/SPI/I2C/PWM/ADC/USB FS/USB HS/NFC/LCD/LEDC/TouchKey/BLE/2.4G 等，按手册建模；
- `perPin` GPIO。

Run: `node -e "const M=require('./js/engine/model.js');console.log(M.validateChip(require('./chips/wch-ch585-qfn48.js')))"`
Expected: `{ ok: true, errors: [] }`。

- [ ] **Step 4: 基线浏览器验收**

打开 `index.html`，切到 CH585 QFN48：49 个 `g.pin`（48+EP）、无 console 报错、随机分配 2 个资源成功。

- [ ] **Step 5: 派生 QFN32 / QFN26C3 / QFN20**

按封装事实表裁剪/重排，写入差异文档：
- 哪些 IO 未引出；
- 哪些资源因落脚点不足被删除或单脚化；
- `groupSwitch` / `groupKey` 是否仍成立；
- 封装参数（body/pitch/EP；QFN26C3 若 26 脚需 `quad-split`）。

- [ ] **Step 6: 建 CH584 QFN48T / QFN32**

以 CH585 为基线，按 CH585DS1 中 CH584 的差异（USB HS/NFC/LCD/Flash/SRAM/封装等）裁剪；每个差异写入差异文档。

- [ ] **Step 7: 加数据锁测试**

在 `tests/engine.test.js` 加入：
- CH584 与 CH585 的差异仅限差异文档列出的集合；
- CH585 各封装变体由基线 + 事实表机械复算一致；
- `validateChip` 对 6 个文件零错、引脚号覆盖完整。

- [ ] **Step 8: manifest + 全套测试**

```bash
node tests/engine.test.js
node tests/fuzz.js
node tests/dist.test.js
```

- [ ] **Step 9: 提交**

```bash
git add chips/wch-ch585-*.js chips/wch-ch584-*.js chips/manifest.js tests/engine.test.js docs/reference/ch58x-family-diff.md README.md docs/user-guide.md
git commit -m "feat(chips): 加入 CH585/CH584 家族（QFN48/32/26C3/20、QFN48T）"
```

---

## 9. Task 4（M3）：CH591 / CH592

**Datasheet:** CH592DS1（公开页面：<https://www.wch-ic.com/downloads/CH592DS1.PDF.html?type=en>）。

**Packages:** CH592 QFN32/QFN28/QFN20；CH591 QFN28/QFN20/TSSOP16。

**Files:**
- Create: `chips/wch-ch592-qfn32.js`（基线）
- Create: `chips/wch-ch592-qfn28.js`
- Create: `chips/wch-ch592-qfn20.js`
- Create: `chips/wch-ch591-qfn28.js`
- Create: `chips/wch-ch591-qfn20.js`
- Create: `chips/wch-ch591-tssop16.js`
- Modify: `chips/manifest.js`
- Create: `docs/reference/ch59x-family-diff.md`
- Modify: `tests/engine.test.js`（CH59x 数据锁）
- Modify: `README.md`

**执行步骤：** 与 Task 3 相同，额外注意：

- [ ] TSSOP16 用 `dual`（8/边）还是 `dual-split`，按手册引脚排列确认；
- [ ] CH591/CH592 的 USB FS、LCD、TouchKey、ADC/PWM 建模；
- [ ] `series: "CH59x"`；
- [ ] 6 个文件的 `meta.source` 一致（同一本手册）；
- [ ] 数据锁：CH591 与 CH592 的差异集合固定。

---

## 10. Task 5（M4）：CH595 / CH596

**Datasheets:** CH595DS1（公开页面：<https://www.wch-ic.com/downloads/CH595DS1_PDF.html>）；CH596 是否独立手册需先确认。

**Packages:** CH595 QFN32/QFN28/QFN20；CH596 QFN20。

**Files:**
- Create: `chips/wch-ch595-qfn32.js`（基线）
- Create: `chips/wch-ch595-qfn28.js`
- Create: `chips/wch-ch595-qfn20.js`
- Create: `chips/wch-ch596-qfn20.js`
- Modify: `chips/manifest.js`
- Modify: `docs/reference/ch59x-family-diff.md`
- Modify: `tests/engine.test.js`

**执行步骤：**

- [ ] Step 1: 先在 WCH 下载中心确认 CH595DS1 是否覆盖 CH596D；若不覆盖，定位 CH596DS1，分别记录事实源。
- [ ] Step 2-7: 同 Task 3 的审计、基线、变体、数据锁、测试、提交。
- [ ] 若 CH595/CH596 的 data 无法共用基线，按两个独立家族处理，不要强行合并。

---

## 11. Task 6（M5）：CH571 / CH573

**Datasheet:** CH573DS1（公开页面：<https://www.wch-ic.com/downloads/CH573DS1_PDF.html>；V1.12, 2022-06-29，执行时确认最新版）。

**Packages:** CH573 QFN28；CH571 QFN28/TSSOP16/ESSOP10。

**Files:**
- Create: `chips/wch-ch573-qfn28.js`（基线）
- Create: `chips/wch-ch571-qfn28.js`
- Create: `chips/wch-ch571-tssop16.js`
- Create: `chips/wch-ch571-essop10.js`
- Modify: `chips/manifest.js`
- Create: `docs/reference/ch57x-family-diff.md`
- Modify: `tests/engine.test.js`

**执行步骤：** 同 Task 3；`series: "CH57x"`；ESSOP10 的 family 按手册确认（预计 `dual` 5/边或 `dual-split`）。

---

## 12. Task 7（M6）：CH570 / CH572

**Datasheet:** CH572DS1（公开页面：<https://www.wch-ic.com/downloads/CH572DS1_PDF.html>；执行时确认是否覆盖 CH570，必要时另找 CH570DS1）。

**Packages:** CH570 QFN20/DFN10X3/SOP8；CH572 QFN20/DFN10X3/TSSOP16。

**Files:**
- Create: `chips/wch-ch572-qfn20.js`（基线）
- Create: `chips/wch-ch572-dfn10x3.js`
- Create: `chips/wch-ch572-tssop16.js`
- Create: `chips/wch-ch570-qfn20.js`
- Create: `chips/wch-ch570-dfn10x3.js`
- Create: `chips/wch-ch570-sop8.js`
- Modify: `chips/manifest.js`
- Modify: `docs/reference/ch57x-family-diff.md`
- Modify: `tests/engine.test.js`

**注意：**

- [ ] CH570 无 BLE 协议栈（仅 2.4G 无线）；数据中必须如实体现“无 BLE”，不能照抄 CH572；
- [ ] SOP8 / DFN10X3 按 `dual` / `dual-split` 确认；
- [ ] `series: "CH57x"`。

---

## 13. Task 8（M7）：CH586 / CH587

**Datasheet:** 待定位（CH587DS1 未在公开搜索中直接命中；先查 WCH 下载中心/产品页，再动数据）。

**Packages:** CH586 QFN68X7/QFN48；CH587 QFN68X7/QFN48/QFN32/QFN20。

**前置条件：**

- [ ] 找到官方 CH586/CH587 数据手册并记录版本/日期；
- [ ] 确认 QFN68X7 的 body/pitch/EP 和 68 脚排列（17/边）；
- [ ] 确认 CH587 的 ARGB/LEDC 等新外设建模方式。

**Files:** 6 个数据文件 + manifest + `docs/reference/ch58x-family-diff.md` + 测试。

---

## 14. Task 9（M8，可选）：CH32V208

- 另属 CH32V 系列，不阻塞 5xx；
- 4 个封装：QFN28/QFN48/LQFP64M/QFN68；
- 建议在 5xx 全部完成后单独立项，`series: "CH32V"`。

---

## 15. Task 10（M9）：发布与文档收口

- [ ] 更新 `README.md` / `README.en.md` 的支持芯片表（按系列分组）；
- [ ] 更新 `docs/user-guide.md` 的芯片切换说明；
- [ ] 更新 `docs/chip-data-schema.md` 的系列/封装约定；
- [ ] 更新 `docs/release.md` 若新增发布注意事项；
- [ ] 每个里程碑按 `docs/release.md` 发版；发版前改 `js/app.js` 版本号；
- [ ] 发布后冒烟：Pages 就绪文案、切芯片、分配/解除、zip/file://、`update.bat [SKIP]`。

---

## 16. 每族数据审计 Checklist（复制到每个 Task）

- [ ] 手册版本/日期/来源记录到 `meta.source`；
- [ ] 1.2 逐脚表 + 图 1-1 + 寄存器/章节三处互证；
- [ ] 引脚号完整覆盖 1..N（EP 用 `"EP"`）；
- [ ] `type` 仅为 `io/power/osc/rf`；
- [ ] `resources` 引用的引脚都存在；
- [ ] `groupSwitch` 必选信号恰好 2 落脚点；
- [ ] `groupKey` 同 key 信号恰好 2 落脚点且同侧；
- [ ] 有 `modes` 的资源把 `optional` 放在模式级；
- [ ] 封装参数来自手册封装章，不猜 body/pitch；
- [ ] 同族变体由基线 + 事实表机械复算，并加数据锁测试；
- [ ] `validateChip` 零错；
- [ ] 浏览器真实切换 + 分配一次，无 console 报错；
- [ ] `tests/engine.test.js`、`tests/fuzz.js`、`tests/dist.test.js` 全绿；
- [ ] 文档/差异表已更新；
- [ ] 一个家族一个提交，不夹带无关改动。

---

## 17. 风险与待确认

1. **CH586/CH587 手册**：公开搜索未直接命中，需在 WCH 下载中心确认；确认前不排数据。
2. **CH595/CH596 是否合本**：CH595DS1 覆盖 CH595X/F/D；CH596D 可能是独立手册，执行时先确认。
3. **CH570 是否合本**：CH572DS1 是否覆盖 CH570 需确认。
4. **QFN26C3 排列**：26 脚不是 4 的倍数；若四边不等，必须新增 `quad-split`，不能硬塞进 `quad`。
5. **新外设建模**：USB HS、NFC、LCD、LEDC、TouchKey、ARGB 等需要逐一手册确认模式/占用语义；引擎通用，但数据必须准确。
6. **封装视觉差异**：`style` 目前不参与绘制；QFN 与 LQFP 视觉相同不影响规划，若需要视觉区分可另立小任务。
7. **数据量**：剩余 5xx 约 32 个数据文件；必须按家族分批，不允许批量猜值。

---

## 18. 评审重点（请用户确认）

- [ ] M2 先做 CH584/CH585，还是改 CH591/CH592 优先？
- [ ] 是否接受“每族一个 minor 版本”的发版节奏？
- [ ] CH32V208 是否纳入本项目，还是单独系列/单独仓库？
- [ ] 是否先只做各家族的常用封装（如 QFN48/QFN32/QFN28），小封装后续按需求补？
- [ ] 是否同意 M1 先做 `series` 分类、保持 `chips/` 扁平目录？
