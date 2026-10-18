# CH57x 家族差异表（CH573X / CH573F / CH573Q / CH571F / CH571D / CH571R / CH571K）

事实来源：**CH573DS1 V2.3 (2023-12-26)**，97 页；官方页面 <https://www.wch-ic.com/downloads/CH573DS1_PDF.html>，本次审计使用 WCH 中文文件服务 `https://file.wch.cn/download/file?id=325`（SHA-256 `9747c52e…`）。
手册覆盖：CH573X / CH573F / CH573Q / CH571F / CH571D / CH571R / CH571K。**7 个型号现已全部加入**。

## 0. 型号资源对照（p2）

| 型号 | 封装 | Flash | RAM | Timer | Capture | PWM | UART | ADC | TouchKey | USB | GPIO |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CH573X | QFN32 | 448+24+32K | 16+2K | 4 | 4 | 4+8 | 4 | 10+1 | 10 | 主机+设备 | 22 |
| CH573F | QFN28 | 448+24+32K | 16+2K | 4 | 4 | 4+6 | 4 | 8+1 | 8 | 主机+设备 | 20 |
| CH573Q | LQFP32 | 192+24+32K | 16+2K | 4 | 4 | 4+8 | 4 | 10+1 | 10 | 主机+设备 | 22 |
| CH571F | QFN28 | 448+24+32K | 16+2K | 4 | 4 | 4+0 | 2 | 6+1 | - | 设备 | 20 |
| CH571D | QFN20 | 448+24+32K | 16+2K | 3 | 3 | 3+0 | 2 | 6+1 | - | 设备 | 15 |
| CH571R | TSSOP16 | 448+24+32K | 16+2K | 4 | 4 | 4+0 | 2 | 4+1 | - | 设备 | 10 |
| CH571K | ESSOP10 | 448+24+32K | 16+2K | 0 | 0 | 0 | 1 | 4+1 | - | - | 4 |

> 产品页最早只列 CH573F / CH571F / CH571R / CH571K；CH573X、CH573Q、CH571D 为手册内型号，现已按同一数据格式补齐。

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| CH573X | quad | 8/边 | 4×4mm / 0.4mm | 左下（QFN32 图 1-1；脚号 1–8 在底边） |
| CH573F / CH571F | quad | 7/边 | 4×4mm / 0.4mm | 左下（图 1-1 + QFN28 脚序互证） |
| CH573Q | quad | 8/边 | 7×7mm / 0.8mm | 左上（LQFP32 图 1-1；脚号 1–8 在左边） |
| CH571D | quad | 5/边 | 3×3mm / 0.4mm | 左下（QFN20 图 1-1；脚号 1–5 在底边） |
| CH571R | dual | 8/边 | 4.4×5.0mm / 0.65mm | 左上 |
| CH571K | dual | 5/边 | 3.9×4.9mm / 1.0mm | 左上；EP 可选但强烈建议连接 |

## 2. 逐脚差异（1.2 表 + 图 1-1）

### CH573F / CH571F（QFN28）

1 PA11, 2 PA10, 3 VDCID, 4 VSW, 5 VDD33, 6 PA8, 7 PA9, 8 PB15, 9 PB14, 10 PB13, 11 PB12, 12 PB11, 13 PB10, 14 PB7, 15 PB4, 16 PB23, 17 PB22, 18 X32MO, 19 X32MI, 20 VINTA, 21 ANT, 22 VDCIA, 23 PA4, 24 PA5, 25 PA15, 26 PA14, 27 PA13, 28 PA12, EP。

- CH573F：UART0-3、SPI0、TMR0-3、PWM4/5/7/9/10/11（6 路）、AIN0-5/AIN12/AIN13（8 路，TouchKey 8）、USB、GPIO。
- CH571F：UART0/1、SPI0、TMR0-3、**无 PWM4-11**、AIN0-5（6 路，无 TouchKey）、USB 设备、GPIO。
- 两者均无 I2C/LCD；调试口 PB14/PB15（TCK/TIO）；RST=PB23；32K 晶振 PA10/PA11。

### CH573X（QFN32）

1 PA10, 2 PB6, 3 PB0, 4 VDCID, 5 VSW, 6 VDD33, 7 VIO33, 8 VIN5, 9 PA8, 10 PA9, 11 PB15, 12 PB14, 13 PB13, 14 PB12, 15 PB11, 16 PB10, 17 PB7, 18 PB4, 19 PB23, 20 PB22, 21 X32MO, 22 X32MI, 23 VINTA, 24 ANT, 25 VDCIA, 26 PA4, 27 PA5, 28 PA15, 29 PA14, 30 PA13, 31 PA12, 32 PA11, EP。

- 相对 CH573F 增加 PB0/PB6 与独立 VDD33/VIO33/VIN5；PB0 带 PWM6/CTS/AIN8，PB6 带 PWM8/RTS/AIN9。
- 因此 PWM 为 8 路（PWM4-11），ADC/TouchKey 为 10 路（AIN0-5、AIN8、AIN9、AIN12、AIN13）。
- UART0 增加可选 RTS(PB6)/CTS(PB0)；其余资源与 CH573F 相同；无 I2C/LCD。
- 最低电源电压 1.7V（手册型号表），其余型号 2.3V。

### CH573Q（LQFP32）

1 PA10, 2 PB6, 3 PB0, 4 VDCID/VDCIA, 5 VSW, 6 GND, 7 VIO33/VDD33, 8 VIN5, 9 PA8, 10 PA9, 11 PB15, 12 PB14, 13 PB13, 14 PB12, 15 PB11, 16 PB10, 17 PB7, 18 PB4, 19 PB23, 20 PB22, 21 X32MO, 22 X32MI, 23 VINTA, 24 ANT, 25 GND, 26 PA4, 27 PA5, 28 PA15, 29 PA14, 30 PA13, 31 PA12, 32 PA11。

- 与 CH573X 同脚号、同外设，Flash 为 **192K**；无 EP。
- LQFP32 将 VDCID/VDCIA 合并到 pin 4、VIO33/VDD33 合并到 pin 7，并有两个 GND（pin 6 / pin 25）。
- 数据中第二个 GND 命名为 `GND_2`：schema 要求引脚名唯一，两个脚在手册中同名。

### CH571D（QFN20）

1 PA12, 2 PA11, 3 PA10, 4 VIO33/VDD33, 5 PA8, 6 PA9, 7 PB11, 8 PB10, 9 PB7, 10 PB4, 11 PB23, 12 X32MO, 13 X32MI, 14 VINTA, 15 ANT, 16 PA4, 17 PA5, 18 PA15, 19 PA14, 20 PA13, EP。

- 15 IO；3 个定时器（TMR0-2，**无 TMR3**）；2 UART；SPI0；AIN0-5；USB 设备。
- **无 PWM4-11、TouchKey、DC-DC、I2C/LCD**；因此没有 VDCID/VSW，也没有 PB12-PB15 调试口。
- SPI0 与 UART1 只有默认组（PB13/PB14/PB15/PB12 未引出），数据中不建 `groupSwitch`。
- 全局配置仅 `rst`（PB23）与 `xtal32k`（PA10/PA11）。

### CH571R（TSSOP16）

1 PA15, 2 PA14, 3 PA13, 4 PA12, 5 VIO33/VDD33, 6 PA8, 7 PA9, 8 PB11, 9 ANT, 10 GND, 11 VINTA, 12 X32MI, 13 X32MO, 14 PB22, 15 PB23, 16 PB10。

- UART0（PA14/PA15）、UART1（PA9/PA8）、SPI0（PA13/PA14/PA15/PA12）、TMR0-3、AIN2-5（4 路）、USB 设备（PB10/PB11）、GPIO。
- 无 PWM4-11 / I2C / TouchKey / LCD；无调试口与 32K 晶振引脚；仅 RST（PB23）配置。

### CH571K（ESSOP10）

1 PA12, 2 VDD33, 3 GND, 4 X32MI, 5 X32MO, 6 ANT, 7 VINTA, 8 PA15, 9 PA14, 10 PA13, EP（GND）。

- UART0（PA14/PA15）、SPI0（PA13/PA14/PA15/PA12）、AIN2-5（4 路）、GPIO。
- 无 Timer/PWM/USB/I2C/TouchKey/LCD；无外部调试/复位/32K 引脚。

## 3. 审计裁定与挂账

1. **QFN32/QFN28 脚序**：1.2 表同时给出 QFN32 与 QFN28 两列，逐行脚号可直接对齐；QFN32 pin 1 在左下，由图 1-1 与脚号 1–8 在底边互证。
2. **CH573Q 电源合并**：LQFP32 的 pin 4 为 VDCID/VDCIA、pin 7 为 VIO33/VDD33、pin 6/25 为 GND；数据按手册合并建模。第二个 GND 命名为 `GND_2` 仅为满足“引脚名唯一”，不改变电气含义。
3. **CH571D 资源裁剪**：型号表为 Timer 3 / Capture 3 / PWM 3+0 / UART 2 / ADC 6+1 / USB 设备 / DC-DC ×；引脚表也确认没有 VDCID/VSW、PB12-PB15、TMR3。数据据此裁剪，不复制 CH571F 的多余资源。
4. **CH571D 映射组**：QFN20 未引出 PB13/PB14/PB15/PB12，SPI0 只剩 PA 组，UART1 只剩 PA9/PA8；因此这两个资源不建 `groupSwitch`，避免引用不存在的落脚点。
5. **CH571R 的 PA9**：视觉初读把 pin 7 读成 PB9；1.2 表中该脚为 PA9/TMR0/TXD1，已按 PA9 建模。pin 5 为 VIO33/VDD33 合并电源。
6. **CH571R/K 的 ADC**：CH571F 为 6 路（AIN0-5）；CH571R/K 为 4 路（AIN2-5）。CH571R/K 的 PA8/PA9 虽保留 UART1 功能，但 ADC 不支持 AIN12/13，数据中未建。
7. **CH571K 的 EP/body**：手册注 0# 为底板，对 CH571K 为可选但强烈建议连接；已建 `thermalPad`。body 长度按标准 SOP-10 取 4.9mm，**待封装图复核**。
8. **旧注解修正**：CH573F/CH571F 原先把 PB12 的 RXD1_、PA5 的 AIN1 标为“1.2 表未列、待复核”；本次逐行核对确认两处都在 1.2 表中，已去掉过时注解。CH571F 的 USB 注解按型号表改为“全速 USB 设备”（USB 主机 ×，设备 √）。

## 4. 测试与锁定

`tests/engine.test.js` 的 M5 用例锁定：

- CH573F / CH571F / CH571R / CH571K 的 validateChip、引脚数、IO 数、UART/SPI/TMR/PWM/ADC/USB 集合、CH571 的 TouchKey 标签移除、CH571R 的 TSSOP16 双列、CH571K 的 EP/无 Timer/PWM/USB；
- CH573X / CH573Q 的 QFN32/LQFP32 封装参数、22 IO、10 ADC、8 PWM、4 UART、PB0/PB6/VIN5、LQFP32 无 EP 与合并电源脚；
- CH571D 的 QFN20 封装参数、15 IO、3 TMR、2 UART、6 ADC、无 PWM/TMR3/调试口/VDCID/VSW。
