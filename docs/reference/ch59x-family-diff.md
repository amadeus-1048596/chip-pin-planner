# CH59x 家族差异表（CH592X/F/A/D、CH591F/D/R、CH595X/F/D、CH596D）

事实来源：**CH592DS1 V1.9 (2025-12-24)**，1.1 引脚排列、1.2 逐脚表、p1 型号资源表、第 9/10/12/13/15/16/17 章。
官方页面：<https://www.wch-ic.com/downloads/CH592DS1.PDF.html>；本次审计使用 OpenWCH 官方仓库镜像 `openwch/ch592/Datasheet/CH592DS1_zh.PDF`（SHA-256 `348e243d…`）。

## 0. 型号资源对照（p1）

| 型号 | 封装 | Flash | RAM | UART | SPI | I2C | PWM | ADC | TouchKey | USB | GPIO | LCD |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CH592X | QFN32 | 448+24+32K | 24+2K | 4 | 1 | √ | 4+8 | 12+1 | 12 | 主机+设备 | 24 | 20×4 |
| CH592F | QFN28 | 448+24+32K | 24+2K | 4 | 1 | √ | 4+6 | 8+1 | 8 | 主机+设备 | 20 | 16×4 |
| CH592A | QFN28 | 448+24+32K | 24+2K | 4 | 1 | √ | 4+6 | 8+1 | 8 | 主机+设备 | 20 | 16×4（2.3V） |
| CH592D | QFN20 | 448+24+32K | 24+2K | 2 | 1 | √ | 2+3 | 4+1 | 4 | 主机+设备 | 12 | 8×4 |
| CH591F | QFN28 | 192+24+32K | 24+2K | 2 | 1 | - | 4+6 | 6+1 | - | 设备 | 20 | 16×4 |
| CH591D | QFN20 | 192+24+32K | 24+2K | 2 | 1 | - | 3+4 | 4+1 | - | 设备 | 12 | - |
| CH591R | TSSOP16 | 192+24+32K | 24+2K | 2 | 1 | - | 4+3 | 4+1 | - | - | 10 | - |

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| CH592X | quad | 8/边 | 4×4mm / 0.4mm | 左下（逆时针） |
| CH592F/A | quad | 7/边 | 4×4mm / 0.4mm | 左下 |
| CH592D | quad | 5/边 | 3×3mm / 0.4mm | 左下 |
| CH591F | quad | 7/边 | 4×4mm / 0.4mm | 左下 |
| CH591D | quad | 5/边 | 3×3mm / 0.4mm | 左下 |
| CH591R | dual | 8/边 | 4.4×5.0mm / 0.65mm | 左上（标准双列） |

QFN 的 pin 1 左下由 1.1 各分图核对（图中 EP 标 0，pin 1 紧邻其右侧）。CH591R 无 EP，pin 15 为独立 GND。

## 2. 逐脚差异（1.2 表）

- **CH592X**：QFN32 满配；PA7/PB6/PB0/PA6 仅在 X 上引出（UART2 映射、PWM6/8/9、AIN8-11 等）。
- **CH592F/A**：去掉 PA7/PB6/PB0/PA6；ADC 余 AIN0-5/AIN12-13（8 路）；LCD 余 SEG0-15（16 段）。
- **CH592D**：保留 PB15-PB10（含 PB12-15），去掉 PB23/PB22、PA8/PA9、PA4/PA5、PA7/PB6/PB0/PA6；ADC 余 AIN2-5（4 路）；LCD 余 SEG6-11 + SEG14-15（8 段）；TMR0 的 PA9/PB23 均未引出。
- **CH591F**：与 CH592F/A 同脚序；无 I2C（PB15/PB14 的 SCL/SDA 不使用）、无 TouchKey；ADC 仅 AIN0-5（6 路）；USB 仅设备。
- **CH591D**：与 CH592D 同封装但脚序不同——无 PB12-15/PB23/PB22，改为 PA8/PA9/PB7/PB4；无 I2C/TouchKey/LCD；USB 仅设备。
- **CH591R**：TSSOP16；PA15-PA12、PA8/PA9、PB11/PB10、PB23/PB22、X32MO/X32MI/VINTA/ANT/GND/VDD33；无 USB/LCD/I2C/TouchKey；无 DC-DC 引脚。

## 3. 审计裁定与挂账（重要）

1. **AIN1（PA5）**：1.2 引脚表 PA5 的复用列只写 TXD3，未列 AIN1；但第 15 章 ADC 明确支持 AIN0～AIN5，且 PA5 是唯一合理的 AIN1 落脚点。数据中保留 **AIN1 = PA5**，并在 pin/resource note 标注“待复核”。
2. **PB12 的 RXD1_**：1.2 表 PB12 只写 SCS_，未列 RXD1_；但 CH592 有 4 组 UART、PB13 保留 TXD1_，且同族 CH585 的 UART1 映射组为 PA9/PB13 + PA8/PB12。数据中把 PB12 计入 UART1 RXD 映射组，并标注“按映射组/同族推定，待复核”。该裁定解决了 CH592D（无 PA8/PA9）第二组 UART 的落脚问题。
3. **CH592D 的定时器**：型号表只写 2 组定时器，未写编号。按 QFN20 实际引出脚，TMR0（PA9/PB23）无落脚点；数据取 **TMR1/TMR2**（PA10/PB10、PA11/PB11），与 2 组计数一致。
4. **PWMX 同切位**：本手册引脚表未像 CH583DS1 那样明确 PWM4/5/7/8/9 的共用映射位；数据暂不设置 `groupKey: "PWMX"`，避免猜测。若后续在寄存器章节确认，再补。
5. **调试口冲突**：CH592 的 I2C（PB15/PB14）、PWM10（PB14）、LCD COM2/COM3（PB14/PB15）与默认开启的两线调试口冲突；资源 note 已写明“需关闭调试接口”。
6. **LCD 段映射**（1.3 表）：COM0-3=PB12-15；SEG0-1=PB7/PB4；SEG2-3=PB23/PB22；SEG4-5=PA4/PA5；SEG6-11=PA15-PA10；SEG12-13=PA8/PA9；SEG14-15=PB11/PB10；SEG16-17=PB6/PB0；SEG18-19=PA6/PA7。各封装按实际引出脚过滤。
7. **CH591R**：无 EP，pin 15 独立 GND；无 VDCID/VSW/VDCIA；封装为 `dual` 8/边，`pin1: "topLeft"`。

## 4. 测试与锁定

`tests/engine.test.js` 的 M3 用例锁定：各型号 validateChip、引脚总数、IO 数、UART/SPI/I2C/TMR/PWM/ADC/LCD/USB 资源集合、CH591 的 TouchKey 标签移除、CH591R 无 EP/热焊盘、CH592X pin1 左下。

## 5. CH595 家族（CH595X / CH595F / CH595D）

事实来源：**CH595DS1 V1.1 (2026-03-13)**，186 页；与 CH596 是两本独立手册。文件 SHA-256 `b774b264…`。

- **脚序与 CH592X/F/D 完全一致**（QFN32/28/20，pin1 左下），可直接按封装裁剪。
- 差异：
  - Flash 240K（CH592 为 448K）；ADC 外部通道 **14 / 10 / 6**（CH592 为 12 / 8 / 4）；TouchKey **14 / 10 / 6**。
  - 调试口在 **PA12/PA13（SWDIO/SWCLK）**，不是 CH592 的 PB14/PB15；与 SPI0、PWM4/5、LCD SEG8/9、AIN2/3 共用，使用需关闭调试。
  - 引脚复用增加 KEYSCAN[0-4]、LED/LED_CLK、ENCCAP 等；已写入 alts，供人工查看。
  - **AIN6 = PA10**：1.2 引脚表 PA10 未列 AIN6，但型号表 14+1/10+1/6+1 与 QFN20 可用 AIN 计数均要求这一路；已按 PA10 保留并标注待复核。
  - CH595D 的 2 组定时器按可用脚取 **TMR1/TMR2**（TMR0 的 PA9/PB23 未引出）；UART0/1；LCD 8 段。
- 数据文件：`wch-ch595x-qfn32.js`、`wch-ch595f-qfn28.js`、`wch-ch595d-qfn20.js`。

## 6. CH596 家族（CH596D）

事实来源：**CH596DS1 V1.1 (2026-03-13)**，151 页；单节 1.2V BLE MCU。文件 SHA-256 `c3989fa7…`。

- QFN20，**15 GPIO**；电源为 **VDD15/VIO15**（无 VDCID/VSW/VDCIA）；无 USB、无 LCD；无独立复位脚（PB23 未引出）。
- 资源：2 UART、1 SPI、1 I2C、3 定时器（TMR0-2）、4 路 PWM4-11（PWM4/5/8/10）、8 路 ADC/TouchKey（AIN2/3/4/5/6/9/12/13）、BLE。
- 调试口 **PA12/PA13（SWDIO/SWCLK）**；32.768kHz 晶振在 PA10/PA11；均与 SPI/PWM/ADC 有共用，数据已加 note。
- **审计裁定**：
  - CH596 的 PA11 复用列不含 AIN7，型号表也是 8 路 ADC；因此 **不建 AIN7**（与 CH595 不同）。
  - PB6 同时提供 AIN9/PWM8/UART0_RTS；从 CH595F 裁剪时这三项会被丢掉，已在 CH596D 中显式补回。
  - 无 USB/LCD 资源；`rst` 配置因 PB23 未引出而移除。
- 数据文件：`wch-ch596d-qfn20.js`。
