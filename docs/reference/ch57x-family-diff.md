# CH57x 家族差异表（CH573F / CH571F / CH571R / CH571K）

事实来源：**CH573DS1 V2.3 (2023-12-26)**，97 页；官方页面 <https://www.wch-ic.com/downloads/CH573DS1_PDF.html>，本次审计使用 WCH 中文文件服务 `https://file.wch.cn/download/file?id=325`（SHA-256 `9747c52e…`）。
手册覆盖：CH573X / CH573F / CH573Q / CH571F / CH571D / CH571R / CH571K。

## 0. 型号资源对照（p2）

| 型号 | 封装 | Flash | RAM | Timer | Capture | PWM | UART | ADC | TouchKey | USB | GPIO |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CH573X | QFN32 | 448+24+32K | 16+2K | 4 | 4 | 4+8 | 4 | 10+1 | 10 | 主机+设备 | 22 |
| CH573F | QFN28 | 448+24+32K | 16+2K | 4 | 4 | 4+6 | 4 | 8+1 | 8 | 主机+设备 | 20 |
| CH573Q | LQFP32 | 192+24+32K | 16+2K | 4 | 4 | 4+8 | 4 | 10+1 | 10 | 主机+设备 | 22 |
| CH571F | QFN28 | 448+24+32K | 16+2K | 4 | 4 | 4+0 | 2 | 6+1 | - | √ | 20 |
| CH571D | QFN20 | 448+24+32K | 16+2K | 3 | 3 | 3+0 | 2 | 6+1 | - | √ | 15 |
| CH571R | TSSOP16 | 448+24+32K | 16+2K | 4 | 4 | 4+0 | 2 | 4+1 | - | 设备 | 10 |
| CH571K | ESSOP10 | 448+24+32K | 16+2K | 0 | 0 | 0 | 1 | 4+1 | - | - | 4 |

> 本阶段按官方产品页范围加入 **CH573F / CH571F / CH571R / CH571K** 四个数据文件。CH573X（QFN32）、CH573Q（LQFP32）、CH571D（QFN20）在手册中也有定义，但不在当前产品页清单内，留作后续可选扩展。

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| CH573F / CH571F | quad | 7/边 | 4×4mm / 0.4mm | 左下（图1-1 + QFN28 脚序互证） |
| CH571R | dual | 8/边 | 4.4×5.0mm / 0.65mm | 左上 |
| CH571K | dual | 5/边 | 3.9×4.9mm / 1.0mm | 左上；EP 可选但强烈建议连接 |

## 2. 逐脚差异（1.2 表 + 图1-1）

### CH573F / CH571F（QFN28）

1 PA11, 2 PA10, 3 VDCID, 4 VSW, 5 VDD33, 6 PA8, 7 PA9, 8 PB15, 9 PB14, 10 PB13, 11 PB12, 12 PB11, 13 PB10, 14 PB7, 15 PB4, 16 PB23, 17 PB22, 18 X32MO, 19 X32MI, 20 VINTA, 21 ANT, 22 VDCIA, 23 PA4, 24 PA5, 25 PA15, 26 PA14, 27 PA13, 28 PA12, EP。

- CH573F：UART0-3、SPI0、TMR0-3、PWM4/5/7/9/10/11（6 路）、AIN0-5/AIN12/AIN13（8 路，TouchKey 8）、USB、GPIO。
- CH571F：UART0/1、SPI0、TMR0-3、**无 PWM4-11**、AIN0-5（6 路，无 TouchKey）、USB、GPIO。
- 两者均无 I2C/LCD；调试口 PB14/PB15（TCK/TIO）；RST=PB23；32K 晶振 PA10/PA11。

### CH571R（TSSOP16）

1 PA15, 2 PA14, 3 PA13, 4 PA12, 5 VIO33/VDD33, 6 PA8, 7 PA9, 8 PB11, 9 ANT, 10 GND, 11 VINTA, 12 X32MI, 13 X32MO, 14 PB22, 15 PB23, 16 PB10。

- UART0（PA14/PA15）、UART1（PA9/PA8）、SPI0（PA13/PA14/PA15/PA12）、TMR0-3、AIN2-5（4 路）、USB 设备（PB10/PB11）、GPIO。
- 无 PWM4-11 / I2C / TouchKey / LCD；无调试口与 32K 晶振引脚；仅 RST（PB23）配置。

### CH571K（ESSOP10）

1 PA12, 2 VDD33, 3 GND, 4 X32MI, 5 X32MO, 6 ANT, 7 VINTA, 8 PA15, 9 PA14, 10 PA13, EP（GND）。

- UART0（PA14/PA15）、SPI0（PA13/PA14/PA15/PA12）、AIN2-5（4 路）、GPIO。
- 无 Timer/PWM/USB/I2C/TouchKey/LCD；无外部调试/复位/32K 引脚。

## 3. 审计裁定与挂账

1. **QFN28 脚序**：1.2 表明确给出 QFN32/QFN28 两列；QFN28 列同时用于 CH573F 与 CH571F。pin 1 左下由图1-1 与同脚序 CH592F 互证。
2. **CH571R 的 PA9**：视觉初读把 pin 7 读成 PB9；1.2 表中该脚为 PA9/TMR0/TXD1，已按 PA9 建模。pin 5 为 VIO33/VDD33 合并电源。
3. **CH571R/K 的 ADC**：CH571F 为 6 路（AIN0-5）；CH571R/K 为 4 路（AIN2-5）。CH571R/K 的 PA8/PA9 虽保留 UART1 功能，但 ADC 不支持 AIN12/13，数据中未建。
4. **CH571K 的 EP**：手册注 0# 为底板，对 CH571K 为可选但强烈建议连接；已建 `thermalPad`。
5. **CH571K body 长度**：封装表给出 3.9mm 宽、1.0mm pitch；长度按标准 SOP-10 取 4.9mm，**待封装图复核**。
6. **未加入的型号**：CH573X/QFN32、CH573Q/LQFP32、CH571D/QFN20 在手册中有定义，但不在当前产品页清单；后续可按需补。

## 4. 测试与锁定

`tests/engine.test.js` 的 M5 用例锁定：CH573F/CH571F/CH571R/CH571K 的 validateChip、引脚数、IO 数、UART/SPI/TMR/PWM/ADC/USB 集合、CH571 的 TouchKey 标签移除、CH571R 的 TSSOP16 双列、CH571K 的 EP/无 Timer/PWM/USB。
