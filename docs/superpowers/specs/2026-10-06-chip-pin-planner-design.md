# 芯片引脚规划器（Chip Pin Planner）设计文档

- 日期：2026-10-06
- 版本：v1.0（V1 范围：CH582M 专用数据 + 通用引擎）
- 状态：待评审
- 作者：MeowG

---

## 1. 背景与目标

画板子之前需要先定引脚：哪个外设用哪些脚、哪些脚留作 GPIO、有没有冲突。目前要么人肉对着手册翻（CH582M 这类国产芯片连厂商工具都没有），要么用 CubeMX ——但它锁死 ST 芯片且强绑代码生成。

**本工具的目标**：做一个**数据驱动的通用"引脚沙盘"**——

1. 在芯片封装图上**直接点引脚**分配功能（CubeMX 右侧芯片视图的交互）；
2. 分配时**冲突资源自动置灰不可选**，后发冲突标红提示；
3. 配置完**导出引脚清单**（CSV/Markdown），画板子时照着定义；
4. **不生成任何初始化代码**（这不是代码生成器）。

**通用性定位**：引擎完全芯片无关；每颗芯片 = 一个数据文件。V1 只带 CH582M（WCH CH58x 系列无任何官方引脚工具，是真实空白）；后续芯片数据可挂 GitHub 供社区贡献。

## 2. 用户与场景

- **主用户**：作者本人（硬件工程师，Windows 工作机，有终端管控、GitHub 直连不稳）。
- **使用场景**：选型确定后、画原理图前，做引脚分配方案；导出清单给画板环节。
- **发布路线**：自用 → 完善后开源到 GitHub（工具 + `chips/` 数据目录，别人提 PR 加芯片）。

## 3. 非目标（V1 明确不做）

- ❌ 代码生成（初始化代码/时钟树/devicetree）
- ❌ EDA 工具双向同步（嘉立创 EDA、Altium 等）
- ❌ 云端工程/账号体系
- ❌ 多芯片切换 UI（数据机制保留，UI 只加载单一芯片；等第二颗芯片出现时再加）
- ❌ BGA 封装渲染（schema 留位）

## 4. 总体架构

**引擎（芯片无关） + 数据文件（每芯片一份）**。

- 技术形态：**纯静态网页应用，零依赖零构建**。双击 `index.html` 即可全功能使用（`file://` 协议）。
- 芯片数据用 **`chips/*.js`**（`CHIP_REGISTRY.push({...})` 挂全局变量）而非 `.json` —— 绕开 `file://` 下 fetch 本地文件的 CORS 限制。引擎同时保留 `fetch(json)` 加载路径，供未来在线版使用。
- 渲染：**手写 SVG**（无图形库）。导出用 Blob 下载，载入工程用 `<input type=file>` —— 均在 `file://` 下可用。
- **加载方式约束**：浏览器用传统 `<script>` 标签按序加载（`file://` 下 ES modules 会被 CORS 挡死）；引擎/数据文件统一带 **UMD-lite 尾巴**（浏览器挂 `window.CPP.*` / `CHIP_REGISTRY`，Node 侧 `module.exports`），使 `node tests/engine.test.js` 可直接 require 引擎与数据做单测。
- 未来在线版：整个仓库挂 GitHub Pages，自动加载同域 `chips/`；社区协作 = 加一个数据文件 + PR。

## 5. 数据模型（核心）

### 5.1 芯片定义文件结构

```jsonc
{
  "schemaVersion": 1,
  "meta": { "source": "CH583DS1 V1.9 (2025-04-10)", "author": "MeowG", "date": "2026-10-06" },
  "chip":   { "vendor": "WCH", "name": "CH582M", "package": "QFN48" },
  "package": { "...见第 6 节..." },

  "pins": [
    { "num": 11, "name": "PB15", "type": "io", "alts": ["TCK","MISO_","DTR_"], "note": "5V 容忍" },
    { "num": 13, "name": "PB13", "type": "io", "alts": ["U2D+","SCK0_","SCL","TXD1_"], "note": "不支持 5V" },
    { "num": 34, "name": "ANT", "type": "rf", "alts": [] }
    // ...全部 48 脚
  ],

  "globalConfigs": [
    { "id": "debug",   "label": "两线调试接口", "default": true,
      "claims": ["PB14","PB15"], "note": "关闭后释放 PB14/PB15，但失去调试与两线下载（仍可 USB ISP）" },
    { "id": "rst",     "label": "外部复位 RST", "default": false, "claims": ["PB23"] },
    { "id": "xtal32k", "label": "32.768kHz 晶振", "default": true, "claims": ["PA10","PA11"] }
  ],

  "resources": [
    { "id": "SPI0", "category": "SPI", "label": "SPI0",
      "signals": [
        { "name": "SCK",  "pins": ["PA13", "PB13"] },
        { "name": "MOSI", "pins": ["PA14", "PB14"] },
        { "name": "MISO", "pins": ["PA15", "PB15"] }
      ],
      "groupSwitch": { "label": "改用映射组 (PB)", "default": false }
    },
    { "id": "TMR1", "category": "TIMER",
      "signals": [ { "name": "TMR1", "pins": ["PA10", "PB10"] } ] },
    { "id": "GPIO", "category": "GPIO", "perPin": true }
  ]
}
```

### 5.2 四类约束（引擎全部支持）

| 类型 | 含义 | CH582M 例子 |
|---|---|---|
| ① 引脚互斥 | 每脚同时只能有一个 claim（引擎自动计算，无需数据描述） | 任意两资源抢同一脚 |
| ② 整组切换 | 一个资源的多个信号在两组脚位间**整组**切换 | SPI0：PA13/14/15 ↔ PB13/14/15（`RB_PIN_SPI0`） |
| ③ 全局开关 | 系统级配置占用/释放引脚，实时重算 | 调试口→PB14/15；RST→PB23；32K 晶振→PA10/11 |
| ④ 信号级二选一 | 单个信号两个落点任选其一 | TMR1=PA10 或 PB10；PWM7=PB4 或 PB1 |

**冲突检测 = 把 ②③④ 翻译成 ① 后的自然结果**：某候选选项可勾选 ⇔ 其所需全部引脚在当前状态（分配 + 全局开关）下无冲突。数据作者只需把手册的复用关系抄进 JSON。

## 6. 封装渲染（参数化引擎）

三族几何 + 参数驱动：

| 族 | 覆盖 | 关键参数 |
|---|---|---|
| `quad` 四边 | QFN/DFN（`no-lead`）、LQFP/TQFP（`gullwing`） | 每边脚数、pitch、本体尺寸、1 脚角位、EP 有无 |
| `dual` 两边 | SOP/SOIC/TSSOP/SSOP/DIP | 每边脚数、pitch、本体宽、引脚伸出长 |
| `dual-split` 不对称两边 | SOT-23-3/5/6 | 两侧脚数 |
| （预留） | BGA | v2 |

```jsonc
"package": { "family": "quad", "style": "no-lead", "pinsPerSide": 12,
             "pitch": 0.35, "body": [5,5], "pin1": "topLeft",
             "sequence": "ccw-down", "thermalPad": "EP" }
```

内置行业惯例：**1 脚从左上角起、逆时针编号**（QFN/LQFP/DIP 标准）；QFN 圆点标识 + LQFP/DIP 缺角标识；中央热焊盘标 `EP/GND` 固定占用；引脚标签**内名外号**（内侧引脚名、外侧灰色脚号）；悬停 tooltip 显示全复用功能。支持滚轮缩放 + 拖拽平移（SVG viewBox）。极个别非标封装留 `"custom": [{pin, side, index}]` 逃生舱（v1 只留字段）。

## 7. 交互与冲突表现

**双向操作**：点引脚 → 弹可分配菜单（不可项置灰含原因）；点左栏资源 → 候选脚高亮、多信号一键连带分配、多组脚位选组；点已分配脚 → 解除分配。

**引脚状态与配色**：

| 状态 | 表现 |
|---|---|
| 空闲 | 浅灰 |
| 候选 | 描边闪烁 |
| 已分配 | 按类别上色（UART蓝/SPI紫/I2C青/PWM橙/ADC黄/USB绿/GPIO灰绿） |
| 全局开关锁定 | 深灰+🔒，tooltip 注明受哪个开关控制 |
| 电源/固定 | 近黑不可点 |
| 冲突 | 红色 |

**冲突策略**：默认**硬阻止**（冲突选项禁止勾选）。"先合法后冲突"场景（如分配后拨动全局开关导致）→ 冲突脚变红 + 顶部横幅"⚠️ N 处冲突" + 右栏冲突明细（三选一解决：保留谁/关哪个开关）。带冲突也可导出，但清单带警示。

**右栏**：已分配清单（按资源分组）+ 冲突区置顶 + 未分配资源折叠列表。**底部状态栏**：实时"已用 N 脚 / 剩余 M 脚"计数 + 冲突计数。**Ctrl+Z 撤销**（状态快照栈）。

## 8. 导出与存取

**导出**：
1. **CSV**（主导出，列：脚号/引脚/分配功能/信号/别名备注/类别/注意事项）；
2. **Markdown 表格**（贴文档）；
3. **工程 JSON**（完整状态：芯片 ID + 数据版本 + 分配 + 全局开关 + 别名，可重新导入）；
4. **封装图 SVG 导出**（渲染即 SVG，≈零成本）。

**未来 GitHub 结构**：仓库 = 工具本体 + `chips/` 数据目录；每芯片文件带 `schemaVersion` + `meta`（来源手册版本/整理人/日期）；引擎启动校验 schema 版本。注意：在线拉取仅面向普通网络用户，作者工作机使用本地文件版。

## 9. 目录结构

```
chip-pin-planner/
├─ index.html                    # 应用入口（双击即用）
├─ css/app.css
├─ js/
│  ├─ engine/                    # 芯片无关内核（纯逻辑，Node 可测）
│  │  ├─ model.js                # 数据模型加载与 schema 校验
│  │  ├─ availability.js         # 四类约束 → 可勾选性计算
│  │  └─ exporters.js            # CSV/MD/工程 JSON/SVG 生成
│  ├─ render/
│  │  ├─ package-svg.js          # 参数化封装渲染
│  │  └─ interactions.js         # 点击/悬停/缩放平移
│  └─ app.js                     # 状态管理、事件装配、重绘
├─ chips/
│  ├─ registry.js                # 芯片注册表
│  └─ wch-ch582m-qfn48.js        # 第一份芯片数据
├─ tests/
│  └─ engine.test.js             # node tests/engine.test.js（CommonJS require + UMD-lite）
├─ docs/
│  ├─ superpowers/specs/2026-10-06-chip-pin-planner-design.md
│  └─ reference/ch582-pin-table.txt   # 手册提取的引脚全表（数据转录来源）
└─ README.md
```

## 10. 测试方案

- **引擎单测（Node，核心）**：`availability.js`/`model.js` 为纯函数，用 `node tests/engine.test.mjs` 直跑（无框架，断言脚本）。测试用例直接取自 CH582M 手册已核实的真实规则：
  1. 默认状态：调试口锁定 PB14/PB15，SPI0 映射组不可拨（PB14/15 冲突）；
  2. 关调试口 → SPI0 可切 PB 组；重新打开调试口 → 产生 2 处冲突且被正确标红；
  3. 勾 32K 晶振后 TMR1 的 PA10 落点不可选（PB10 仍可选）；
  4. 启用 RST → PB23 不可用（PWM11/TMR0_/TXD2_ 连带不可选）；
  5. 引脚互斥：UART1 用 PA9 后，PWM0 在 PA9 不可选（PB23 落点受 RST 开关约束）；
  6. PWM10 唯一落点 PB14：调试口开启时不可选；
  7. 导出函数：给定状态生成正确 CSV/MD/JSON。
- **UI 手动清单**：双击打开、点选流程、tooltip、缩放平移、导入导出往返（export→import 状态一致）、冲突横幅。
- 回归方式：每次改动后跑 node 测试 + 手动清单。

## 11. 里程碑（供实施计划参考）

- **M1** 骨架：index.html + 引擎 model/availability + QFN 渲染器（静态画出 CH582M 空图）
- **M2** 数据：CH582M 全量数据文件（48 脚 + 全部资源约束）+ 引擎单测通过
- **M3** 交互：双向点选、冲突置灰/标红、全局开关、右栏、状态栏、Ctrl+Z
- **M4** 导出闭环：CSV/MD/工程 JSON/SVG + 导入往返 + 打磨 & README

## 12. 风险与对策

| 风险 | 对策 |
|---|---|
| `file://` 下个别浏览器行为差异 | 以 Chrome/Edge 为准测试；预留 `python -m http.server` 一行说明 |
| CH582M 数据录入错漏 | 数据文件附 meta 来源；用第 10 节测试用例覆盖关键规则；后续可写半自动提取脚本（pdfplumber 已验证可行） |
| 特殊封装画不出来 | `custom` 逃生舱字段预留 |
| 未来 schema 演进 | `schemaVersion` 校验 + 迁移说明 |

---

## 附录 A：CH582M 资源速查（数据文件转录依据，均出自 CH583DS1 V1.9）

- **封装**：QFN48 5×5mm，0.35mm pitch，4×12 脚，EP 接地；40 GPIO（PA0-15, PB0-23）+ 8 个非 IO 脚（VDCID/VSW/VDD33+VIO33/VINTA/VDCIA/ANT/X32MI/X32MO）。
- **固定/系统**：调试口 = PB15(TCK)/PB14(TIO)（默认启用，锁定）；RST = PB23（默认禁用）；32M 晶振 = X32MI/MO（固定脚）；32.768K 晶振 = PA10(X32KI)/PA11(X32KO)（可选）；ANT = pin34。
- **SPI0**（仅一组；CH583 才有 SPI1）：SCK=PA13、MOSI=PA14、MISO=PA15、SCS(从机)=PA12；映射组 = PB13/PB14/PB15/PB12（`RB_PIN_SPI0` 整组切换）。
- **UART0**：TXD0=PB7 / RXD0=PB4（映射 PA14/PA15）；**UART1**：PA9/PA8 ↔ PB13/PB12；**UART2**：PA7/PA6 ↔ PB23/PB22；**UART3**：PA5/PA4 ↔ PB21/PB20（双套脚位）。
- **I2C**：SCL/SDA = PB13/PB12 ↔ PB21/PB20。
- **TMR/PWM/CAP**：TMR0=PA9↔PB23；TMR1=PA10↔PB10；TMR2=PA11↔PB11；TMR3=PB22↔PA2。PWM4=PA12↔PA6；PWM5=PA13↔PA7；PWM6=PB0；PWM7=PB4↔PB1；PWM8=PB6↔PB2；PWM9=PB7↔PB3；**PWM10=PB14（唯一落点）**；PWM11=PB23（唯一落点）。
- **ADC**：AIN0-13 = PA4, PA5, PA12, PA13, PA14, PA15, PA3, PA2, PA1, PA0, PA6, PA7, PA8, PA9。
- **TouchKey**：14 通道，与 ADC 同脚（TK n = AIN n）。
- **USB**：USB1 = PB10(UD-)/PB11(UD+)；USB2 = PB12(U2D-)/PB13(U2D+)。
- **裸 GPIO（无复用功能）**：PB16, PB17, PB18, PB19, PB8, PB9。
- **电气注意**：PB12/PB13 不支持 5V；PB14/PB15 支持 5V（5VT）。
- **引脚全表**（脚号↔名称↔复用）提取自手册的原始记录见 `docs/reference/ch582-pin-table.txt`。
