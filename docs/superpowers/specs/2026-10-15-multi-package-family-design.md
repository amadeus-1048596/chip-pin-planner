# 多封装家族（CH582F QFN28 + CH583M QFN48）· 设计文档（子项目 #3）

- 日期：2026-10-15
- 版本：v1.8 计划（"结构优化"第三子项目）
- 状态：设计已定稿（2026-10-15 对话逐节通过），待实施计划
- 作者：MeowG
- 前置：#1 多芯片（2026-10-07，D1 决策来源）；#2 optional signals（v1.7，schema v2 现行）

---

## 1. 背景与目标

"结构优化"拆分第 3 项 + 用户点名需求（2026-10-07）：**同一芯片家族多封装都要支持**（如 CH582M=QFN48、CH582F=QFN28），"市面上常见封装都做成图（先覆盖常用、发现问题再更新）"。

本轮范围（已定案）：**CH582F（QFN28）+ CH583M（QFN48）**——两者与现有 CH582M 同属 CH583DS1 一本手册，一次审计出两个文件；CH583M 与 CH582M 同封装同脚序，正好实测"同族多文件"的维护模式与下拉体验。

**成功标准：**

1. 顶栏下拉出现三颗芯片（CH582M/CH582F/CH583M），各自状态隔离、刷新即清（沿用 #1 机制）；
2. QFN28 引脚图正确渲染（quad 家族参数化，零渲染代码）；
3. 资源按手册逐脚裁剪正确（CH582F 的 28 脚子集；CH583M 增加 SPI1 等）；
4. 引擎零改动——第二次实测"加芯片 = 文件 + 清单一行"的分发承诺；
5. 老 CH582M 工程（无 chipId）在异芯片激活态下导入，能按"chip 名 + 封装"自动路由回正确芯片；
6. 单测 + fuzz 全绿；家族差异表随交付。

## 2. 事实依据（2026-10-15 已核实）

| 项 | 结论 | 证据 |
|----|------|------|
| 渲染器 | quad 家族参数化（pinsPerSide/pitch/body 驱动），QFN28（7/边）天然支持 | `js/render/package-svg.js`（`computePinLayout` 全参数化） |
| 引擎 | 芯片无关；loader/buildChips/闸门均为多文件设计 | v1.5 架构 + 现测 |
| 参考数据缺口 | `docs/reference/ch582-pin-table.txt` 仅覆盖 QFN48 的引脚表 | 文件表头（PAGE-3-TABLE 结构，48 脚） |
| CH583M 增量 | 与 CH582M **同 QFN48 脚序**，手册图1-1 带 CH583M 专有标注：**+SPI1（PA0/SCK1、PA1/MOSI1、PA2/MISO1）** | CH583DS1 图1-1 提取件（`tmp\cpp-opt2-20261010\scan_out.txt`） |
| CH582F 子集 | QFN28；**逐脚引脚表中间一列即 QFN28 引脚号**（"无 P"=QFN28 未引出，如 PB0-PB3/PB5/PB6/PB9/PB16-21/PA0-PA3/PA6/PA7 均不在 28 脚上）——裁剪按此列初筛、图1-1 二十八脚排列表复核 | `docs/reference/ch582-pin-table.txt`（2026-10-15 实测确认列义） |
| D1 原文（#1 决策） | "一份文件 = 一个具体封装型号……接受少量重复；家族共享机制等真痛了再加（YAGNI）" | `2026-10-07-multi-chip-data-distribution-design.md` §2 |

## 3. 决策记录（已定案）

| # | 决策 | 结论 | 要点 |
|---|------|------|------|
| D1' | 家族维护模式 | **纯复制 + 家族差异表**（延续 D1） | 三文件各自自包含；新增 `docs/reference/ch58x-family-diff.md`（封装参数对照 + 逐芯片差异 + 审计记录）；各文件 `meta.note` 摘要一句。社区"抄模板"流程零变化。 |
| D1'-Trigger | 共享核心复议触发器 | **写死：出现第 4 个同族文件，或同族共性修正发生 2 次 → 评估共享核心/生成器** | 触发时另立子项目 |
| D2 | 老工程路由 | 无 chipId 时按 **chip 名 + 封装** 匹配（次选仅名），命中即自动切换 + 日志说明；无命中维持现状报错 | 修 v1.5 遗留③；逻辑抽纯函数（Node 可测） |
| D3 | SPI1 建模 | CH583M 的 SPI1 为**独立资源**（SPI 分类，三脚 PA0/PA1/PA2，无重映射） | 与 SPI0 分离；CH582x 两文件不含它 |
| D4 | BGA/custom 逃生舱 | **不做**（CH58x 无 BGA；常见封装类型已由 quad/dual/dual-split 覆盖） | 留档触发条件：未来引入 BGA 芯片时另立 |
| D5 | 其他系列 | CH584/585/592 等**不做**（需另找手册，留待需求出现） | — |

## 4. 数据产物与审计规范

新增文件（均 schemaVersion 2，UMD-lite 自注册，照 `wch-ch582m-qfn48.js` 模板）：

- `chips/wch-ch582f-qfn28.js`（id `ch582f-qfn28`）
- `chips/wch-ch583m-qfn48.js`（id `ch583m-qfn48`）
- `chips/manifest.js` 追加两行（顺序即下拉顺序：M → F → 583M）
- `docs/reference/ch58x-family-diff.md`（新）

**审计方法（沿用既有方法论）**：双引擎（pypdf vs pdfplumber）抽取 + 三处冗余互证（图1-1 引脚排列 / 逐脚引脚表 / 表7-7 与寄存器位描述）；重要结论逐条记录进 family-diff.md。每脚字段：`num/name/type/alts/note`（照现有格式）。

**CH582F（QFN28）审计项**：
1. 28 脚全量引出（哪些 PA/PB 保留、哪些 NC/电源脚）；
2. 各脚 alts（以手册逐脚表为准）；
3. 资源裁剪：按 28 脚实际可落性裁剪资源集（哪些外设保留、哪些信号删/减落脚点）；
4. 封装参数：body/pitch/pin1 方向——**来源优先级：手册封装尺寸章 → WCH 官方封装图（注明来源）**；若两处都缺，条目挂账并明确告知用户（不猜值）。

**CH583M（QFN48）审计项**：
1. 逐脚与 CH582M 比对 alts（已知 +SCK1/MOSI1/MISO1，其余以逐脚表全量比对）；
2. 资源差异：SPI1 新增（D3）；其余保留/修正按手册；
3. 封装参数同 CH582M（同 QFN48 尺寸），meta 标注。

## 5. 代码改动（仅一处小修）

- **`js/engine/exporters.js`**：
  - `readProjectChipId` 返回值追加 `package`（字符串或 null，含类型校验）；
  - 新增纯函数 **`resolveProjectTarget(chips, meta)` → `{ index: number|null, note?: string }`**：
    1. `meta.chipId` 有 → 在 `chips` 中按 chipId 精确匹配（仅 ok 项）→ 命中返回；未命中返回 `{ index: null, miss: "chipId" }`（调用方沿用现报错文案"缺少芯片数据：…"）；
    2. 无 chipId 且 `meta.chipName`：`meta.package` 非空时先 **名+封装** 匹配（`def.chip.package === meta.package`）→ 唯一/首个命中；`meta.package` 为空或名+封装未命中 → **仅名** 匹配 → 首个命中 + `note`（如"存在同名多封装，已按首个匹配"；仅名匹配多个候选时才加 note）；
    3. 其余 → `{ index: null }`（调用方维持现状：对当前芯片校验并报错）。
- **`js/app.js`**：载入工程 handler 的路由段改调 `resolveProjectTarget`；命中且非当前芯片 → `activateChip(index, true)` + 日志（含 note）。其余流程（先校验后切换）保持 v1.5-minor 的既有顺序。
- **引擎其余部分、渲染器、schema、数据格式：零改动**（第二次实测分发承诺）。

## 6. 测试计划

- **Node（tests/engine.test.js 新增段）**：
  - `readProjectChipId` 返回 package（有/无/非字符串三态）；
  - `resolveProjectTarget`：chipId 命中；chipId 未命中（miss 标记）；名+封装命中；同名多封装（构造两 chip 同名不同 package）→ 精确命中 + 仅名场景带 note；无 chipId 无 chipName → index null；
  - CH582F：validateChip 通过；脚数/IO 数正确；关键资源裁剪抽查（按审计结论定 2-3 条）；代表性脚 alts 抽查；
  - CH583M：validateChip 通过；SPI1 资源（三脚、无重映射、可分配）；与 CH582M 同脚位一致性抽查——取审计结论中 2 个差异脚位（已知含 PA0/PA1/PA2 的 SCK1/MOSI1/MISO1）逐一断言；
  - loader：三文件 buildChips 全 ok、id 唯一。
- **fuzz**：主体仍 CH582M（不变）；不新增。
- **浏览器（真实点击）**：下拉三项可切换 + QFN28 渲染截图；CH583M 左栏可见 SPI1 且可分配；激活 CH582F 时导入老 CH582M 无 chipId 工程 → 自动切回 CH582M + 日志说明。
- 审计件（family-diff.md）随数据一并提交。

## 7. 明确不做（留档）

见 §3 D4/D5；另：本轮不为 CH582F 单独找数据手册之外的臆测值——凡手册缺失的参数（尤指封装尺寸），挂账告知，不猜。

## 8. 收尾

- 版本 **v1.8**；实现前打回退点（现 HEAD）；验收清单：下拉三芯片 / QFN28 图正确 / CH583M 含 SPI1 / 老工程按名路由 / 单测+fuzz 全绿。
- 流程：本 spec 用户评审通过 → 实施计划（writing-plans）→ TDD 实施。
