# CH572/CH570 家族差异表（CH572D/Q/R、CH570D/Q/E）

事实来源：**CH572DS1 V1.0 (2025-01-21)**，123 页；官方页面 <https://www.wch-ic.com/downloads/CH572DS1_PDF.html>，本次审计使用 WCH 中文文件服务 `https://file.wch.cn/download/file?id=518`（SHA-256 `246a3a25…`）。
手册覆盖：CH572D / CH572Q / CH572R / CH570D / CH570Q / CH570E。

## 0. 型号资源对照（p2）

| 型号 | 封装 | Flash/RAM | Timer | Capture | PWM | UART | SPI | I2C | CMP | KeyScan | USB | 2.4G | BLE | GPIO |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CH572D | QFN20 | 240+8K / 12K | 1 | 1+2 | 1+5 | 1 | 1 | 1 | 1 | 20 | 主机+设备 | √ | √ | 12 |
| CH572Q | DFN10X3 | 240+8K / 12K | 1 | 1+2 | 1+3 | 1 | - | 1 | 1 | 5 | 主机+设备 | √ | √ | 5 |
| CH572R | TSSOP16 | 240+8K / 12K | 1 | 1+2 | 1+5 | 1 | 1 | 1 | 1 | 9 | 主机+设备 | √ | √ | 10 |
| CH570D | QFN20 | 240+8K / 12K | 1 | 1+2 | 1+5 | 1 | 1 | 1 | 1 | 20 | 主机+设备 | √ | - | 12 |
| CH570Q | DFN10X3 | 240+8K / 12K | 1 | 1+2 | 1 | 1 | - | 1 | - | 5 | 设备 | √ | - | 5 |
| CH570E | SOP8 | 240+8K / 12K | 1 | - | 1 | 1 | - | 1 | - | - | - | - | - | 3 |

> `PWM 1+5` = 定时器 PWM + PWM1-5；`PWM 1` = 仅定时器 PWM。CH570 无 BLE，仅 2.4G。

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| CH572D / CH570D | quad | 5/边 | 3×3mm / 0.4mm | 左下（QFN20） |
| CH572Q / CH570Q | dual | 5/边 | 3×3mm / 0.5mm | 左上（DFN10X3，带 EP） |
| CH572R | dual | 8/边 | 4.4×5.0mm / 0.65mm | 左上（TSSOP16，无 EP） |
| CH570E | dual | 4/边 | 3.9×5.0mm / 1.27mm | 左上（SOP8，无 EP） |

## 2. 逐脚映射（1.2 表）

### QFN20（CH572D / CH570D）

1 PA3, 2 XO, 3 XI, 4 NC1, 5 ANT, 6 VDD33, 7 VIO33, 8 V5, 9 PA9, 10 PA8, 11 PA0, 12 PA1, 13 PA4, 14 PA5, 15 PA6, 16 PA7, 17 PA10, 18 PA11, 19 NC2, 20 PA2, EP GND。
（pin 4/19 为 NC；NC 以 `power` 固定脚建模，防止误分配。）

### DFN10X3（CH572Q / CH570Q）

1 VDD33, 2 V5, 3 PA0, 4 PA1, 5 PA7, 6 PA2, 7 PA3, 8 XO, 9 XI, 10 ANT, EP GND。

### TSSOP16（CH572R）

1 PA9, 2 PA8, 3 PA0, 4 PA1, 5 VDD33, 6 PA5, 7 PA6, 8 PA7, 9 PA2, 10 PA3, 11 PA4, 12 XO, 13 XI, 14 NC, 15 GND, 16 ANT。

### SOP8（CH570E）

1 VDD33, 2 PA0, 3 PA1, 4 PA7, 5 XO, 6 XI, 7 GND, 8 ANT。

## 3. 复用成组建模（重要）

CH572/CH570 的 UART/I2C 用后缀表示映射组，本数据按“同后缀配对”建模为模式（每模式两个信号、各一脚）：

- **UART（8 组）**：默认 PA3/PA2；map1 PA2/PA3；map2 PA1/PA0；map3 PA0/PA1；map4 PA7/PA6；map5 PA8/PA9；map6 PA11/PA10；map7 PA10/PA11。
- **I2C（4 组）**：默认 PA8/PA9；map1 PA0/PA1；map2 PA3/PA2；map3 PA5/PA6。
- **SPI（2 组）**：默认 SCK=PA5、MOSI=PA7、MISO=PA6、SCS=PA4；映射组 SCK_=PA3、MOSI/MISO 不变、SCS_=PA2；每组含主机/从机模式，主机 SCS 可选。
- **TMR**：PWM/捕捉/外部计数各模式，信号落脚点为 PA7/PA2/PA4/PA9 的映射变体；内部定时模式不占脚。
- **CMP**：P0=PA3 或 P1=PA7，负端 N=PA2；两种模式。
- **KeyScan**：显式建模有独立复用名的 KEYSCAN0-4（PA2/PA3/PA8/PA10/PA11）；型号表的 20/9/5 路包含矩阵扫描通道，未在引脚复用表中单列，**不强行展开**。
- **USB**：UDM=PA0、UDP=PA1；CH570Q 仅设备，CH570E 无 USB。
- 无 ADC/LCD；XO/XI 为 32MHz HSE 固定脚；ANT 为射频固定脚。

## 4. 变体裁剪

- **CH572Q**：仅 PA0/PA1/PA2/PA3/PA7 可用；去掉 SPI；PWM1-3；CMP、KeyScan0-1、USB 保留。
- **CH572R**：TSSOP16；保留 SPI/CMP/PWM1-5/KeyScan0-2/USB；无 EP，pin15 GND。
- **CH570D**：脚序与 CH572D 完全一致；无 BLE（数据无 BLE 资源，电气上仅 2.4G）。
- **CH570Q**：去掉 SPI/CMP/PWM1-5；保留 UART/I2C/TMR/KeyScan0-1/USB 设备。
- **CH570E**：SOP8；仅 UART/I2C/TMR；UART 保留 map2/map3（PA1/PA0 与 PA0/PA1），I2C 保留 map1（PA0/PA1）；无 SPI/CMP/KeyScan/USB/PWM1-5。

## 5. 审计裁定与挂账

1. **UART/I2C 配对**：按引脚复用后缀（TXD_n/RXD_n、SCL_n/SDA_n）配对建模；手册对应章节未逐组列表，建议后续用寄存器/时序章节复核。
2. **KeyScan 数量**：型号表 20/9/5 路，但 1.2 表只有 KEYSCAN0-4 五个具名落脚点；其余按矩阵扫描处理，未展开。
3. **调试口**：SWDIO=PA0、SWCLK=PA1；与 USB、UART map2/map3、I2C map1 共用。数据中 `debug` 默认关闭，避免默认锁死 USB。
4. **RST**：RST_ 在 PA7，PA8 也有 RST 映射；`rst` 配置按 PA7 建模并注明二选一。
5. **NC 脚**：QFN20 的 4/19、TSSOP16 的 14 为 NC，按固定 `power` 脚建模，防止误分配。
6. **CH570E**：SOP8 仅 3 GPIO；手册型号表 PWM 列为 1（TMR PWM），因此未建 PWM1-5。

## 6. 测试与锁定

`tests/engine.test.js` 的 M6 用例锁定：6 个型号的 validateChip、引脚总数、IO 数、UART/I2C/SPI 模式数、PWM/CMP/KeyScan/USB 集合、TSSOP/SOP 无 EP、DFN/QFN 的 EP、CH570E 仅 UART/I2C/TMR。
