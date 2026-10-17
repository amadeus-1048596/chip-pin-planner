# CH58x 家族差异表（CH582M / CH582F / CH583M）

> 目的：三份芯片数据文件各自自包含（纯复制模式），本文件汇总"复制模板时改什么、为什么"与审计证据。
> 审计方法：双引擎交叉（pypdf 6.19.0 vs pdfplumber 0.11.10，2026-10-15 实测）+ 三处冗余互证（图1-1 引脚排列 / 1.2 逐脚引脚表 / 相关寄存器与章节描述）。
> 事实来源：`CH583DS1 V1.9 (2025-04-10)`（PDF 页码 = 正文页码）。

## 0. 总览（三芯片对照，2026-10-15）

| 芯片 | 数据文件 (`id`) | 封装 | IO 数 | 引脚条目 | 资源数 | 系统开关 | 关键差异 | 浏览器实测 |
|---|---|---|---|---|---|---|---|---|
| CH582M | `wch-ch582m-qfn48.js` (`ch582m-qfn48`) | QFN48 5×5/0.35 | 40 | 49 (48+EP) | 35 | 4 | 基线 | v1.6/v1.7 已验 |
| CH582F | `wch-ch582f-qfn28.js` (`ch582f-qfn28`) | QFN28 4×4/0.4 | 20 | 29 (28+EP) | 27 | 3 | QFN28 子集：20 IO 未引出、UART2/3+I2C 无映射组、UART0 MODEM 仅 DTR/DSR、无 PWM6/8、ADC 8 路、无 RF 天线开关（§2） | v1.8 实测（EV18-1/2） |
| CH583M | `wch-ch583m-qfn48.js` (`ch583m-qfn48`) | QFN48 5×5/0.35 | 40 | 49 (48+EP) | 36 | 4 | CH582M + SPI1 主机（SCK1/MOSI1/MISO1 → PA0/1/2，§1） | v1.8 实测（EV18-3） |

下拉顺序 = `chips/manifest.js` 顺序 = M → F → 583M。老工程路由（无 chipId 时按 chip 名+封装）v1.8 实测通过（EV18-4）。
审计页码索引：概述/差异声明 p1；图1-1 引脚排列 p3；逐脚引脚表 p4-7；SPI 章 §10.1.1 及寄存器表 p65；封装章 p111-112。

## 1. CH583M vs CH582M（QFN48，同封装同脚序）

### 1.1 逐脚 alts 差异（全表核对后，差异仅此三脚）

| 脚 (QFN48) | CH582M alts | CH583M alts | 证据 |
|---|---|---|---|
| PA0 (39) | `AIN9`（注：SCK1 为 CH583 专用） | `SCK1`, `AIN9` | 图1-1 p3；逐脚表 p6 行 39；§10.1.1 p65 |
| PA1 (40) | `AIN8`（注：MOSI1 为 CH583 专用） | `MOSI1`, `AIN8` | 图1-1 p3；逐脚表 p6 行 40；§10.1.1 p65 |
| PA2 (41) | `TMR3_`, `AIN7` | `TMR3_`, `MISO1`, `AIN7` | 图1-1 p3；逐脚表 p6 行 41；§10.1.1 p65 |

官方差异一句话（概述 p1 原文）："CH583相比CH582多了SPI1主机，支持最低1.75V电源电压。"
§10.1.1 p65 原文："CH583芯片提供2个SPI接口，CH582芯片仅提供了SPI0……SPI0支持主机模式（Master）和从机模式（Slave），SPI1只支持主机模式（Master）。"

### 1.2 SPI1 建模口径

- **三信号**：SCK1 / MOSI1 / MISO1，独立资源、无重映射组（逐脚表/图1-1 均为固定脚 PA0-2）。
- **无片选 SCS1**：双引擎对全文做 `SCS1` 扫描零命中；SPI1 寄存器表（表10-2 p65）仅 CTRL_MOD/CFG/INTER_EN/CLOCK_DIV/BUFFER，无片选相关寄存器；SPI1 仅主机模式但手册未给片选用脚 → 不建模 SCS1（若未来手册补充再更新）。
- 与 SPI0 并存不冲突：SPI0 全落在 PA12-15/PB12-15，SPI1 固定 PA0-2。

### 1.3 全表核对与"非差异"记录（防再生疑）

- 其余 40 个 IO 脚逐脚 alts 与 CH582M 数据一致（解析引脚表 alts 列 → 与数据文件比对，两引擎交叉；比对脚本产出 `pypdf` 48 行 / `pdfplumber` 45 行，逐行人工复核补齐差异）。
- 以下为提取器差异而非芯片差异，记录备查：① 手册表中 TMRx 一栏写裸名（如 `TMR0`），数据文件沿既有约定写作合并体 `TMR0/PWM0/CAP0`；② PB14/PB15 类型列含脚注 `5VT`，数据文件在 `note` 中记"支持5V(5VT)"；③ 逐脚表 X32MO 行类型列原文为 `I/A`（非 IO），数据文件 type=`osc`。
- 两引擎表现记录：pdfplumber 对 1.2 引脚表的行归属偶有错位（45/48 行）、pypdf 稳定（48/48）；**重要结论以三处互证为准**（本次三处一致）。

## 2. CH582F vs CH582M（QFN28 子集封装）

### 2.1 事实表（28 脚 + EP；QFN28 引脚号 = 1.2 引脚表中间列，图1-1 CH582F 分图双引擎独立抽取逐脚互证 100% 一致）

| QFN28 脚号 | 脚名 | 类型 | alts（与 CH582M 同名脚一致，注(4) p7："其它封装的引脚参考上述同名引脚的说明"） |
|---|---|---|---|
| 1 | PA11 | io | X32KO, TMR2/PWM2/CAP2 |
| 2 | PA10 | io | X32KI, TMR1/PWM1/CAP1 |
| 3 | VDCID | 电源 | - |
| 4 | VSW | 电源 | - |
| 5 | VDD33/VIO33 | 电源 | - |
| 6 | PA8 | io | RXD1, AIN12 |
| 7 | PA9 | io | TMR0/PWM0/CAP0, TXD1, AIN13 |
| 8 | PB15 | io | TCK, MISO_, DTR_（5VT） |
| 9 | PB14 | io | TIO, MOSI_, PWM10, DSR_（5VT） |
| 10 | PB13 | io | U2D+, SCK0_, SCL, TXD1_ |
| 11 | PB12 | io | U2D-, SCS_, SDA, RXD1_ |
| 12 | PB11 | io | UD+, TMR2_ |
| 13 | PB10 | io | UD-, TMR1_ |
| 14 | PB7 | io | TXD0, PWM9 |
| 15 | PB4 | io | RXD0, PWM7 |
| 16 | PB23 | io | RST#, TMR0_, TXD2_, PWM11 |
| 17 | PB22 | io | TMR3/PWM3/CAP3, RXD2_ |
| 18 | X32MO | osc | - |
| 19 | X32MI | osc | - |
| 20 | VINTA | 电源 | - |
| 21 | ANT | rf | - |
| 22 | VDCIA | 电源 | - |
| 23 | PA4 | io | RXD3, AIN0 |
| 24 | PA5 | io | TXD3, AIN1 |
| 25 | PA15 | io | MISO, RXD0_, AIN5 |
| 26 | PA14 | io | MOSI, TXD0_, AIN4 |
| 27 | PA13 | io | SCK0, PWM5, AIN3 |
| 28 | PA12 | io | SCS, PWM4, AIN2 |
| 0 (EP) | GND | 电源 | - |

**未引出（20 个 IO，1.2 表该行中间列标注"无 P"）**：PA0/PA1/PA2/PA3/PA6/PA7、PB0/PB1/PB2/PB3/PB5/PB6/**PB8**/PB9/PB16/PB17/PB18/PB19/PB20/PB21。
（2026-10-15 审计更正：**PB8 亦不在 QFN28 上**——1.2 表该行中间列为"无 P"、图1-1 CH582F 分图无 PB8、选型表 p2 "CH582F … 20 GPIO" 与"40−20=20"吻合。此前计划清单漏列 PB8，已按审计更正。）
**IO 计数互证**：QFN28 引出 20 个 IO（PA4/5/8/9/10/11/12/13/14/15 + PB4/7/10/11/12/13/14/15/22/23）= 选型表 p2 "CH582F：20 GPIO" ✓。

### 2.2 封装参数（来源：§21 封装章 p111）

| 芯片 | 封装 | 塑体尺寸 | 引脚节距 | 说明 |
|---|---|---|---|---|
| CH582F | QFN28 | **4×4mm** | **0.4mm**（15.7mil） | 方形无引线 28 脚（p112 QFN28_4X4 图） |
| （对照）CH582M/CH583M | QFN48 | 5×5mm | 0.35mm（13.8mil） | 方形无引线 48 脚 |

证据链：p1 概述"封装形式：QFN48_5X5、QFN28_4X4" + p111 第21章封装表 + p112 封装图标题。**无挂账项**。

### 2.3 CH582F 资源裁剪规则（应用于 CH582M 模板，validateChip 零报错为收口）

1. 落脚点与 QFN28 脚集求交：空 → 删信号；剩 1 → 单脚化。
2. groupSwitch：任一必选信号落脚点不再是 2 个 → 移除该字段（"改用映射组"语义在本封装不成立）。
3. groupKey（UART0 DTR/DSR、PWMX）：两信号（或成员）不再是 2 脚 → 移除。
4. 信号全删的资源删除；globalConfigs 的 claims 剔除未引出脚，claims 全空则删除该开关。

**裁剪结果**（与 CH582M 数据文件的全部差异）：
- **删除资源**：PWM6、PWM8（PB0/PB2/PB6 未引出）、AIN6～AIN11（PA3/PA2/PA1/PA0/PA6/PA7 未引出，ADC 余 8 路）。
- **删信号**：UART0 的 RTS/CTS/RI/DCD（PB6/PB0/PB2/PB3 未引出）；optional 变为 `["DTR","DSR"]`。
- **单脚化**：UART0 DTR `["PB15"]`、DSR `["PB14"]`（原 2 脚，PB5/PB1 未引出）；UART2 TXD `["PB23"]`、RXD `["PB22"]`（PA7/PA6 未引出）；UART3 TXD `["PA5"]`、RXD `["PA4"]`（PB21/PB20 未引出）；TMR3 三信号 `["PB22"]`（PA2 未引出）；PWM4 `["PA12"]`、PWM5 `["PA13"]`、PWM7 `["PB4"]`、PWM9 `["PB7"]`（PA6/PA7/PB1/PB3 未引出）。
- **去 groupSwitch**：UART2、UART3、I2C（各自必选信号在 QFN28 上只剩单脚）。UART0/UART1/SPI0 的 groupSwitch 保留（必选信号 PA/PB 两组落脚点均仍存在）。
- **去 groupKey**：UART0_MODEM（DTR/DSR）、PWMX（PWM4/5/7/9 各自只剩单脚，同切位已无意义）。
- **删除 globalConfigs**：`rf_ant_sw`（PB16-21 全部未引出）；debug（PB14/15）、rst（PB23）、xtal32k（PA10/PA11）保留。
- **保留不动**：SPI0（含映射组与 4 个模式）、UART1、TMR0/TMR1/TMR2、PWM10/PWM11、AIN0-5/AIN12/AIN13、USB1、USB2、GPIO。

## 3. CH585M vs CH582M（QFN48 同脚序）

来源：CH585DS1 V1.6 (2025-12-25)，1.1/1.2 逐脚表 + p1 资源表 + 封装章。

### 3.1 脚序

CH585M QFN48 的 1..48 脚名称与 CH582M **完全一致**（VDCID/VSW/VDD33… PA10），EP 同为 GND。这意味着可以直接以 CH582M 为基线做差异数据锁。

### 3.2 复用差异（逐脚表核对）

| 引脚 | CH582M alts | CH585M alts | 说明 |
|---|---|---|---|
| PA0 | AIN9 | **SCK1, LED0**, AIN9 | +SPI1 时钟、LED 数据 0 |
| PA1 | AIN8 | **MOSI1, LED1**, AIN8 | +SPI1 MOSI、LED1 |
| PA2 | TMR3_, AIN7 | **MISO1, TMR3_, RI, LED2**, AIN7 | +SPI1 MISO、UART0 RI 迁到 PA2、LED2 |
| PA3 | AIN6 | **LED3**, AIN6 | +LED3 |
| PA4 | RXD3, AIN0 | RXD3, **LEDC**, AIN0 | +LED 点阵时钟 |
| PA5 | TXD3, AIN1 | TXD3, **LED4**, AIN1 | +LED4 |
| PA6 | RXD2, PWM4_, AIN10 | RXD2, PWM4_, **LED5**, AIN10 | +LED5 |
| PA7 | TXD2, PWM5_, AIN11 | TXD2, PWM5_, **LED6**, AIN11 | +LED6 |
| PA8 | RXD1, AIN12 | RXD1, **LED7**, AIN12 | +LED7 |
| PB2 | RI, PWM8_ | PWM8_ | RI 迁到 PA2 |
| PB8 | — | **NFCM** | +NFC 模拟输入 |
| PB9 | — | **NFCI** | +NFC 模拟输入 |
| PB16 | — | **NFC-** | +NFC 天线 N |
| PB17 | — | **NFC+** | +NFC 天线 P |

其余引脚 alts 与 CH582M 相同；PB10/PB11 为 USB FS（UD±），PB12/PB13 为 USB HS（U2D±），与 CH582M 的 USB1/USB2 位置一致，仅资源标签区分。

### 3.3 资源与配置差异

- **新增资源**：SPI1（仅主机：PA0/PA1/PA2）、NFC（PB9/PB8/PB17/PB16）、LED 点阵屏（LEDC=PA4 必选，LED0-7 可选）、段式 LCD（COM0-3=PB4-PB7 必选，SEG0-27 可选）、USB HS（PB12/PB13，单列）。
- **UART0**：RI 由 PB2 改为 PA2（仅 CH585M 引出 PA2；QFN32/26/20 上无 PA2，RI 不可用）。
- **globalConfigs**：删除 `rf_ant_sw`（CH585 无 PB16-21 六脚 RF 开关）；保留 debug（PB14/PB15）、rst（PB23）、xtal32k（PA10/PA11）。
- **封装**：QFN48 5×5mm，pitch 0.35mm。

### 3.4 同族变体（后续任务）

| 型号 | 封装 | 关键裁剪（p1 资源表） |
|---|---|---|
| CH585F | QFN32 4×4/0.4 | 1 SPI、无 NFC、7+1 ADC、7 TouchKey、24 GPIO、LCD 14×4；PA9/PB9 内部短接（禁止同时输出） |
| CH585C | QFN26C3 3×3/0.4 | 2 UART、1 SPI、无 I2C、4+5 PWM、4+1 ADC、无 TouchKey、17 GPIO、USB FS+HS；PA9/PB9 内部短接 |
| CH585D | QFN20 3×3/0.4 | 2 UART、1 SPI、无 I2C、4+3 PWM、4+1 ADC、无 TouchKey、12 GPIO、USB FS+HS |
| CH584M/X | QFN48 5×5/0.35 | 无 USB HS/SPI1，RAM 96K；保留 NFC/LED/LCD、4 UART、1 SPI、1 I2C |
| CH584F | QFN32 4×4/0.4 | 无 USB HS/SPI1/NFC，7+1 ADC、7 TouchKey、24 GPIO、LCD 14×4 |

> 变体数据必须按各自封装引脚表逐脚裁剪，不能只按资源表删资源。

**已实现：CH585F（2026-10-17）**

- QFN32、24 IO；1 SPI（SPI0）、1 I2C、7 路 ADC（AIN0-5/AIN13）、7 路 PWM（PWM4/5/7/8/9/10/11）、USB FS+HS、LCD。
- 无 NFC/LED；LCD 保留 COM0-3 + 13 个可用 SEG（PB9 未引出；手册资源表标 14×4，按 QFN32 实际引出脚只能映射 13 个 SEG，**待复核**）。
- UART0 的 groupSwitch 保留，DTR/DSR 单脚化并移除 groupKey；UART1-3/I2C 移除 groupSwitch；PWMX 移除 groupKey。
- PA9 与 PB9 内部短接（PB9 未引出），已写入 PA9 的 pin note。

**已实现：CH584M / CH584X / CH584F（2026-10-17）**

- CH584M/X：QFN48、40 IO；在 CH585M 基础上去 USB HS/SPI1，保留 NFC/LED/LCD、USB FS、4 UART、1 I2C；引脚与 CH585M 同脚序。两者引脚/资源相同，仅存储配置不同。
- CH584F：QFN32、24 IO；在 CH585F 基础上去 USB HS/SPI1/NFC/LED，保留 LCD、I2C、USB FS、4 UART；7 路 ADC（AIN0-5/AIN13）。
- 三者均移除 U2D± 与 SCK1/MOSI1/MISO1 alts；CH584F 的 PA9 记录与 PB9 短接（PB9 未引出）。
