# 贡献指南

欢迎加芯片、修数据、提改进！本项目是零依赖纯静态网页：**加一颗芯片 = 一个数据文件 + 清单里一行**。

## 准备

- Node.js LTS（只用于跑测试；工具本身运行不需要 Node）；
- 浏览器（Chrome / Edge）用来人工验收；
- 一份**公开的数据手册**。数据必须逐脚核对，**不猜值**。

## 加一颗芯片（完整教程）

### 1. 复制模板

复制 `chips/wch-ch582m-qfn48.js` 为你的文件，命名 `厂商-型号-封装.js`（小写，如 `chips/ti-cc2652-qfn48.js`）。
每个数据文件带 UMD-lite 尾巴（Node 可 `require`、浏览器自动注册），照抄即可，不要改成 ES module。

### 2. 填顶层字段

```js
{
  schemaVersion: 2,
  id: "ti-cc2652-qfn48",                    // 唯一；型号-封装
  meta: { source: "TI CC2652 datasheet SWRS... Rev.X (2024-01)", author: "you", date: "2026-01-01" },
  chip: { vendor: "TI", name: "CC2652", package: "QFN48" },
  package: { family: "quad", style: "no-lead", pinsPerSide: 12, pitch: 0.4,
             body: [5, 5], pin1: "topLeft", sequence: "ccw-down" },
  pins: [ /* 每一脚 */ ],
  globalConfigs: [ /* 调试口/复位/晶振等系统开关 */ ],
  resources: [ /* 外设与信号 */ ]
}
```

- `meta.source` **必填且如实**（手册型号 + 版本 + 日期），PR 会查；
- `package` 的尺寸/pitch/脚数必须来自手册封装章节；不确定就留空并说明，不要造数；
- `chip.name + package` 决定下拉显示，也用于旧工程文件路由。

### 3. 填 `pins`

每脚形如 `{ num: 1, name: "PA0", type: "io", alts: ["UART0_TX"], note: "..." }`：

- `num` 必须唯一；**数字脚号必须完整覆盖 `1..pinsPerSide×4`**，缺号会被验证器拒绝；散热焊盘用 `"EP"`；
- `type` 只能是 `io` / `power` / `osc` / `rf`；
- `alts` 是手册上的复用功能名（给人看，引擎用 `resources` 建模）。

### 4. 填 `resources`

| 字段 | 规则 |
|---|---|
| `id/label/category` | `id` 唯一；`category` 决定左栏分组与引脚颜色（SPI/UART/I2C/PWM/ADC/USB/GPIO…） |
| `signals` | `[{ name, pins: [落脚点...] }]`；引用的脚必须在 `pins` 里 |
| `groupSwitch` | 整组映射位切换；**全部必选信号必须恰好 2 个落脚点**（默认组 / 映射组）；可选信号 1 或 2 个 |
| `groupKey` | 共用同一映射位的信号（如 UART0 的 DTR/DSR）；同 key 信号必须**恰好 2 落脚点**且同侧 |
| `modes` | 多工作模式：`[{ id, label, signals: [...], optional?: [...], note? }]` |
| `optional` | 可选信号名数组；**有 `modes` 时必须放模式级** |
| `perPin` | `true` = 逐脚资源（GPIO），无 `signals` |

必选信号必须有落脚点；同一个物理引脚不要被多个互斥资源同时声明为可落——冲突检测会如实报告，但数据应表达硬件真相。

### 5. 加清单（最容易漏）

在 `chips/manifest.js` 数组里加一行：

```js
window.CHIP_MANIFEST = [
  "chips/wch-ch582m-qfn48.js",
  "chips/your-chip.js"          // ← 新增
];
```

⚠️ `file://` 下无法扫描目录，**漏加这一行网页不会显示你的芯片，且没有任何报错**。

### 6. 验证

```bash
# 单文件 schema 校验（ok:true 且 errors 为空）
node -e "const M=require('./js/engine/model.js');const r=M.validateChip(require('./chips/your-chip.js'));console.log(r);process.exit(r.ok?0:1)"

# 全量回归 + 模糊测试（发布门）
node tests/engine.test.js
node tests/fuzz.js
```

再用浏览器打开 `index.html`，确认：下拉里出现你的芯片、封装图脚号连续、左右栏资源可分配、无 console 报错。

### 7. 同族多封装

同一芯片的不同封装（如 QFN48 / QFN28）**各建一个文件**，用“复制 + 差异表”维护；把逐条差异记录到 `docs/reference/` 下的家族差异文档（参考 `ch58x-family-diff.md`）。

## 修数据

- 先找到手册原文（页码/表号），再改；
- 改动要在 PR 里说明依据；如果结论与原实现冲突，以手册为准并写清楚裁定；
- 改完跑 `node tests/engine.test.js`；数据锁定测试若因此变红，说明改动影响面较大，需同步更新测试与文档。

## 改引擎

- 引擎是芯片无关纯逻辑（`js/engine/`）。**先写失败测试，再改实现**；
- 新行为必须有对应用例；不要为了单颗芯片在引擎里写特例；
- 保持零依赖、浏览器侧不用 ES modules。

## PR 清单

- [ ] 芯片型号 / 封装 / 数据来源（手册名 + 版本 + 页码更好）
- [ ] `chips/manifest.js` 已加行
- [ ] `node tests/engine.test.js` 全绿（含 `validateChip` 零错）
- [ ] `node tests/fuzz.js` 通过
- [ ] 浏览器里实际切换/分配过一次
- [ ] 同族封装：差异文档已更新

一颗芯片一个 PR 最省事；只改数据不动引擎。

## 常见坑

| 现象 | 原因 |
|---|---|
| 网页里没有新芯片，也没报错 | `chips/manifest.js` 漏行 |
| `validateChip` 报“数字引脚号未完整覆盖” | `pins` 缺号，或 `pinsPerSide×4` 算错 |
| 芯片显示“需要更新版本的工具” | `schemaVersion` 超过引擎上限（当前 2） |
| `groupSwitch` 报“必选信号必须恰好 2 个落脚点” | 必选信号只写了一个组，或写了 3 个 |
| 可选信号报错 | 有 `modes` 的资源把可选放到了资源级；应放模式级 |
| 分配后出现意外冲突 | 数据把同一脚声明给了互斥资源，或漏了 `groupSwitch`/`groupKey` |

## 用 AI 加芯片？

把仓库和根目录的 [AGENTS.md](AGENTS.md) 一起丢给 AI 助手——那是给 AI 的执行清单。字段细节以 [docs/chip-data-schema.md](docs/chip-data-schema.md) 为准。
