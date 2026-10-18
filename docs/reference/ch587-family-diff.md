# CH587/CH586 家族差异表（CH587W/M/F/D、CH586W/M）

事实来源：**CH587DS1 V1.0 (2026-07-17)**，205 页；官方页面 <https://www.wch-ic.com/downloads/CH587DS1_PDF.html>，本次审计使用 WCH 中文文件服务 `https://file.wch.cn/download/file?id=581`（SHA-256 `efe7be40…`）。
手册覆盖：CH587W / CH587M / CH587F / CH587D / CH586W / CH586M。

## 0. 型号资源对照（p2）

| 型号 | 封装 | Flash/RAM | Timer | PWM | UART | SPI | I2C | QSPI | ARGB | USB PD/FS/HS | NFC | ADC | Touch | GPIO | LED | LCD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CH587W | QFN68X7 | 960+24+32K / 256K | 4 | 4+8 | 4 | 2 | 1 | 1 | 1 | 1/1/1 | √ | 22+1 | 22 | 58 | 1/2/4/8 | 32×4 |
| CH587M | QFN48 | 448+24+32K / 256K | 4 | 4+8 | 4 | 2 | 1 | 1 | 1 | -/1/1 | - | 16+1 | 16 | 40 | 1/2/4/8 | 28×4 |
| CH587F | QFN32 | 448+24+32K / 256K | 4 | 4+7 | 4 | 1 | 1 | - | 1 | -/1/1 | - | 9+1 | 9 | 24 | - | 14×4 |
| CH587D | QFN20 | 448+24+32K / 256K | 4 | 4+3 | 2 | 1 | 1 | - | 1 | -/1/1 | - | 5+1 | 5 | 12 | - | - |
| CH586W | QFN68X7 | 960+24+32K / 256K | 4 | 4+8 | 4 | 2 | 1 | 1 | 1 | -/1/- | √ | 22+1 | 22 | 58 | 1/2/4/8 | 32×4 |
| CH586M | QFN48 | 448+24+32K / 256K | 4 | 4+8 | 4 | 2 | 1 | 1 | 1 | -/1/- | - | 16+1 | 16 | 40 | 1/2/4/8 | 28×4 |

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| CH587W / CH586W | quad | 17/边 | 7×7mm / 0.35mm | 左下 |
| CH587M / CH586M | quad | 12/边 | 5×5mm / 0.35mm | 左下 |
| CH587F | quad | 8/边 | 4×4mm / 0.4mm | 左下 |
| CH587D | quad | 5/边 | 3×3mm / 0.4mm | 左下 |

## 2. 引脚提取与覆盖

- 1.2 表 1-1（CH587W/M/F/D 四列）与表 1-2（CH586W/M 两列）逐行提取，并合并跨页续行的复用文字。
- 覆盖校验：W 69（68+EP）、D 21（20+EP）、F 33（32+EP）、M 49（48+EP），脚号 1..N 无缺号、无重复。
- NC 脚按固定 `power` 脚建模，防止误分配；EP 统一为 `GND`。

## 3. 资源建模

- **UART0-3**：TXD/RXD 及各 MODEM 信号按复用名汇总为落脚点；映射组未细分成模式（CH572 的做法），资源 note 已注明。
- **SPI0/1**：主机/从机模式；SCK/MOSI/MISO/SCS 的默认/映射落脚点汇总；主机 SCS 可选。
- **I2C**：SCL/SDA 的 4 组映射落脚点汇总。
- **QSPI**：QSCK、QSCS（含 QSCSX）、QSIO0-3（含 QSIOX0-3）；QSIO1-3 为可选（单/双/四线模式）。
- **USB**：FS（UD±）、HS（U2D±）、PD（CC1/CC2，仅 CH587W）。
- **NFC**：NFCI/NFCM/NFC+/NFC-（CH587W、CH586W）。
- **ARGB**：一个信号，落脚点为 ARGB/ARGB_/ARGB_2/ARGB_3。
- **LED**：LEDC 必选 + LED0-7 可选（CH587W/M、CH586W/M）。
- **LCD**：COM0-3 必选 + SEG0-31 可选；映射为 COM0-3=PB4-7、SEG0-3=PB0-3、SEG4-7=PA0-3、SEG8-23=PB8-23、SEG24-26=PA7-9、SEG27=PA13、SEG28-31=PC14-17，按封装实际引脚过滤。
- **ADC/TouchKey**：按实际 A0-A21 复用名生成 AINn（TKn）；不假设连续编号（例如 CH587M 有 A20/A21）。
- **TMR0-3 / PWM4-11**：按复用名汇总落脚点；PWMX 同切位未细分。
- **配置**：debug（TCK/TIO）、rst（RST 脚）、xtal32k（X32KI/X32KO）；CH587D 无 RST/32K 引脚，仅保留 debug。

## 4. 审计裁定与挂账

1. **CH587F 的 ADC 数量**：型号表写 `9+1`，但 QFN32 的 1.2 表可见 A0-A5/A13/A21 共 **8 路**；数据按引脚表建 8 路，并在 README/meta 标注“型号表 9+1，待复核”。
2. **CH587F 的 LCD 段数**：型号表写 `14×4`，按 QFN32 实际引脚可映射 **13 个 SEG**（PB9 等未引出）；数据按 13 段建，待复核。
3. **CH587F 的复用名与型号表不一致**：引脚表保留 NFC+/NFC-/NFCM、LED、QSPI 等复用名，但型号表 NFC/LED/QSPI 为 `-`；资源已按型号表移除，引脚 alts 保留供查阅。
4. **映射组**：本阶段不把 UART/SPI/I2C 的映射后缀细分为模式（与 CH572 不同），避免在 68 脚上引入大量未验证组合；后续可按寄存器章节细化。
5. **CH586**：基于 CH587 去掉 USB HS/PD；CH586W 保留 NFC，CH586M 无 NFC；其余资源与同封装 CH587 一致。

## 5. 测试与锁定

`tests/engine.test.js` 的 M7 用例锁定：6 个型号的 validateChip、引脚总数、IO 数、UART/SPI/I2C/QSPI/USB/NFC/ARGB/LED/LCD/ADC/PWM 集合、CH587F 的 8 路 ADC/13 段 LCD、CH587D 仅 debug 配置、CH586 无 USB HS/PD。
