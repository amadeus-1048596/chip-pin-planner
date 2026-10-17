# 可选信号（optional signals）与 MODEM / SPI 从机 / RF 开关 · 设计文档（子项目 #2）

- 日期：2026-10-10
- 版本：v1.7 计划（"结构优化"第二子项目）
- 状态：设计已定稿（2026-10-10 对话逐节通过），待实施计划
- 作者：MeowG
- 前置：v1 设计文档（2026-10-06）；#1 多芯片（2026-10-07，本文沿用其版本闸门机制）
- 原则：**工具 = 覆盖全部资源的规划沙盘**——完整性对齐手册能力面，不以"个人是否使用"取舍（用户定位，2026-10-10）

---

## 1. 背景与目标

全外设普查（`docs/ch582m-peripheral-audit-20261007.md`）评估项 1/2/3：

1. **UART0 MODEM 六信号**：各自可选，现有"整资源全信号"分配模型表达不了；
2. **SPI0 从机模式**：SCS 必选、SCK 转输入，工具未建模；
3. **RF 天线开关**：PB16~PB21，手册不述细节（需外部资料）。

**目标**：引入通用的"信号级可选"模型（未来任何芯片的任意子集信号复用同一机制），并让上述三项资源在工具内完整、可规划。

**成功标准**：

- UART0 = TXD/RXD 必选 + 六个 MODEM 信号**任意子集**（各自占脚、可单加单删、冲突照常）；
- SPI0 四种模式（主机全/半、从机全/半）；主机模式可加 SCS 输出（可选）；
- RF 开关可开可关，启用即占 PB16~PB21；
- 旧工程（schema v1）照常导入；**旧工具遇到新文件得到明确的版本提示，而非静默错误**；
- 引擎保持芯片无关；零依赖、`file://` 可用不变。

## 2. 事实依据（2026-10-10 核查）

来源：`CH583DS1 V1.9`（本机 Downloads/CH583DS1.PDF，第 7/9/10/19 章）+ 仓库 `docs/reference/ch582-pin-table.txt` + WCH 官方论坛 + docs.rs。

| 项 | 结论（手册原文/来源） |
|----|----------------------|
| MODEM 引脚 | RTS=PB6、CTS=PB0、DTR=PB5、DSR=PB1、RI=PB2、DCD=PB3（逐脚表）；表7-2：RTS、DTR=MODEM 信号输出（推挽输出），CTS、DSR、RI、DCD=MODEM 信号输入（上拉输入推荐） |
| DSR/DTR 重映射 | RB_PIN_MODEM（R16_PIN_ALTERNATE 位12）："**1：DSR_/DTR_映射到PB[14]/PB[15]；0：DSR/DTR映射到PB[1]/PB[5]**"——一位同切两根，且**独立于 UART0 主映射位** |
| 各信号可选性 | RTS/DTR 有独立引脚输出使能位（IER 位5/4），CTS/DSR/RI/DCD 为输入按接线选用——六个信号均可各自取舍 |
| SCS | 逐脚表：PA12=SCS（"SCS：SPI0从机模式下的片选输入，低电平有效"）、PB12=SCS_；表7-7 与逐脚表一致 |
| 表7-3 | SCS：**主模式片选输出→推挽输出（可换用其它引脚）**；从模式片选输入→上拉输入（推荐）。全/半双工从机在表中均有行 |
| SPI 章节 | "SPI0 支持主机模式（Master）和从机模式（Slave）"（CH582 仅 SPI0） |
| RF 开关 | 位15 RB_RF_ANT_SW_EN："**1：开关控制输出到PB[16]～PB[21]；0：禁止输出**"；第19章明确"RF 寄存器手册不详细介绍，以子程序库提供应用支持"；[WCH 论坛 thread-148095](https://www.wch.cn/bbs/thread-148095-1.html)：输出**六根**引脚、用途 **AoA/AoD 多天线切换**、芯片当前不支持 AoA、**官方建议保持 0**；[docs.rs ch58x crate](https://docs.rs/ch58x/0.1.4/ch58x/ch58x/sys/pin_alternate/type.RF_ANT_SW_EN_W.html) 字段定义交叉佐证 |

## 3. Schema 变更（芯片数据）

### 3.1 `optional: [信号名…]`

- **放置规则与 `signals` 完全相同**：无模式资源 → 资源级；有模式资源 → 模式级。语义 = 列出的信号可不配、可后补、可单删。
- **有 modes 的资源不得使用资源级 `optional`**（validateChip 拒绝）——可选性必须与信号清单同处，避免"写了却被静默忽略"（终审 Important#3）。
- 校验（validateChip）：须为数组、元素为字符串、且是对应 signals 清单的**子集**。

### 3.2 `signal.groupKey`（信号级共享映射位）

- 与资源级 `groupKey` 同义（共享同一重映射位 ⇒ 必须同侧），作用域为信号。
- 校验：同 key 各信号的 `pins` 长度一致且 ≥2（本用例为 2）。
- 注意：信号 groupKey **不参与**资源的 groupSwitch；DSR/DTR 的侧独立于 UART0 主映射位（TXD/RXD 换不换组都不影响它们）。

### 3.3 UART0（具体变更）

```jsonc
{ id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
  optional: ["RTS", "CTS", "DTR", "DSR", "RI", "DCD"],
  signals: [
    { name: "TXD", pins: ["PB7", "PA14"] },                       // 既有
    { name: "RXD", pins: ["PB4", "PA15"] },                       // 既有
    { name: "RTS", pins: ["PB6"], note: "MODEM 输出（请求发送）；表7-2：推挽输出" },
    { name: "CTS", pins: ["PB0"], note: "MODEM 输入（清除发送）" },
    { name: "DTR", pins: ["PB5", "PB15"], groupKey: "UART0_MODEM", note: "MODEM 输出；RB_PIN_MODEM 位与 DSR 同切" },
    { name: "DSR", pins: ["PB1", "PB14"], groupKey: "UART0_MODEM", note: "MODEM 输入；RB_PIN_MODEM 位与 DTR 同切" },
    { name: "RI",  pins: ["PB2"], note: "MODEM 输入（振铃指示）" },
    { name: "DCD", pins: ["PB3"], note: "MODEM 输入（载波检测）" }
  ] }
```

### 3.4 SPI0（具体变更）

- 新增信号：`{ name: "SCS", pins: ["PA12", "PB12"], note: "从模式片选输入（低有效）；主模式片选输出（可选，可换用其它引脚）" }`。
- 模式扩至 4 个，**现有 id `full`/`half` 保持不变**（旧工程兼容），标签补"主机"：

| id | label | signals（完整活跃集） | optional（集内可选项） |
|----|-------|---------|----------|
| full | 主机·全双工3线 | SCK, MOSI, MISO, SCS | `["SCS"]` |
| half | 主机·半双工2线 | SCK, MISO, SCS | `["SCS"]` |
| slave-full | 从机·全双工4线 | SCS, SCK, MOSI, MISO | —（SCS 必选） |
| slave-half | 从机·半双工3线 | SCS, SCK, MISO | — |

（注：`signals` 必列全量活跃信号——含可选项；`optional` 只能是 `signals` 的子集，见 §3.1。）

### 3.5 RF 开关（globalConfigs 新增）

```jsonc
{ id: "rf_ant_sw", label: "RF 天线开关（PB16-21）", default: false,
  claims: ["PB16", "PB17", "PB18", "PB19", "PB20", "PB21"],
  note: "RB_RF_ANT_SW_EN：启用后开关控制输出到 PB16~PB21（六根）；用途为 AoA/AoD 多天线切换，WCH 官方当前建议保持关闭（芯片暂不支持 AoA）" }
```

### 3.6 版本号

- 芯片数据 `schemaVersion` → **2**；`ENGINE_SCHEMA_MAX` → **2**（闸门沿用 #1 机制："≤上限"放行）。
- 工程文件：**写 2、读 1|2**。

## 4. 引擎变更（js/engine/availability.js）

| 函数 | 变更 |
|------|------|
| `requiredSignals` / `optionalSignals`（新） | `activeSignals` 按资源级/模式级 `optional` 拆分 |
| `canAssign` | 必选必须配齐；可选配了的须合法（集合内、脚合法、不双占）；**新校验**：同 `signal.groupKey` 的已配信号须同侧（原因文案指出对方当前侧） |
| `assign` | 不变（pins 按信号存储，天然支持子集） |
| `setSignal(state, rid, sigName, pin\|null)`（新） | 单信号增/删，复用 canAssign 校验 |
| `signalOptions(def, state, rid, sigName)`（新） | 该信号各落脚点的可用性+原因（供"＋信号"菜单）；含同侧约束原因 |
| `bestAssignment` | **只配必选**（missing 只统计必选）——可选从不阻塞一键分配 |
| `candidatePins` | 语义不变（全信号预览） |
| `pinOptions` | 可选信号两种态：资源未分配 → 置灰"需先分配 X"；已分配未加 → "X · SIG（可选信号）"可点（action=setSignal） |
| `resourceStatus` | 色点**仅按必选判定**（MODEM 脚被占不影响 UART0 绿/黄/红） |
| `validateChip` | 新增 §3.1/§3.2 两条校验 |
| exporters | CSV/MD/工程 JSON 随 pins 自然支持子集；`fromProjectJSON` 校验"必选须齐、可选须在集合内"＋**资源内部一致性**（同 groupKey 同侧；主组信号落脚点侧与 `group` 字段一致）；导入时 modes 资源 `mode=null` 归一化为首个模式；`toProjectJSON` 写 v2、读入接受 v1\|v2 |

## 5. UI 变更（js/app.js + css）

- **左栏**：不变（色点口径见 §4）。
- **右栏已分配行**：新增 **"＋ 添加信号"** 按钮（存在可选项时显示）→ 平铺菜单列出"信号 → 脚"全部选项（≤8 项；不可用置灰+原因）；已加的可选信号行内可见、可改名（既有 alias 机制）、可 **× 移除**。
- **引脚菜单**：见 §4 `pinOptions` 两种态。
- **模式菜单**：SPI0 变 4 项（从机模式缺 SCS 时给出"默认组缺 SCS"类原因）。
- 新 UI 文本一律走 `escapeHtml`/`textContent`（沿既有 XSS 防护做法）；启动日志 → "就绪（v1.7）"。

## 6. 兼容与版本策略

| 文件 | 新工具 v1.7 | 旧工具 v1.6 |
|------|-------------|-------------|
| 芯片数据 v1 | ✓（闸门 ≤2 放行） | ✓ |
| 芯片数据 **v2** | ✓ | ✗ → "需要更新版本的工具"（明确） |
| 工程 v1 | ✓ 照读 | ✓ |
| 工程 **v2** | ✓ | ✗ → 版本不兼容（明确） |

理由：若芯片数据不升版，旧工具会把 MODEM 信号当必选（**静默错误**）；明确拒绝优于静默错。

## 7. 测试计划

- **单测**（`tests/engine.test.js` 新段，约 20 条）：optional 校验 / 子集 canAssign 全分支 / 同侧约束（DSR 先/后配、反侧拒绝、删后再配）/ `setSignal` 增删往返 / bestAssignment 只配必选 / `signalOptions` / `pinOptions` 两态 / resourceStatus 不受可选影响 / SPI 四模式（4 线、3 线、SCS 必选缺脚）/ RF claims 六脚 / 工程 v1 读、v2 写读往返 / 芯片闸门 v2。
- **fuzz**：操作集新增"随机加/移可选信号"；不变量新增：子集合法（已配 ⊆ 该模式信号集、必选恒齐）、同 groupKey 信号同侧、导出往返一致。既有不变量全部保留。
- **浏览器真实鼠标**：UART0 加/删 MODEM（含同侧拒绝提示）；SPI 从机四线分配；主机加 SCS 输出；RF 开关打开 → 六脚被占 + 与其他资源形成冲突横幅；v1 老工程导入；旧工具视角由版本闸门覆盖（人工抽查一次）。

## 8. 评估过但不建模（留档）

| 项 | 结论 |
|----|------|
| UART0 半双工收发（RB_MCR_HALF）/ DTR 复用为 RS485 切换（RB_MCR_TNOW） | 占脚不变，不入模型（数据 note 可提及） |
| RF 开关的输出模式/时序细节 | 手册第19章明确不述；按"启用占六脚"保守建模，不模拟模式 |
| SPI1 | CH582 无此模块（CH583 才有），不进本数据文件 |
| PB16-19 的 alts | 实施时以 `ch582-pin-table.txt` 复核；手册无标注则留空 |

## 9. 收尾

- 版本：**v1.7**；实现前打回退点（现 HEAD `3e6ce76`）。
- 流程：本 spec 用户评审通过 → 实施计划（writing-plans）→ TDD 实施 + 真实鼠标验证。
