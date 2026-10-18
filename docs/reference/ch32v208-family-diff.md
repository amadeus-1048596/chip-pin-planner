# CH32V208 家族差异表（GB / CB / RB / WB）

事实来源：**CH32V208DS0 V2.7**，42 页；WCH 官方下载页 <https://www.wch-ic.com/downloads/CH32V20x_30xDS0_PDF.html>，本次审计使用 WCH 文件服务 `https://file.wch.cn/download/file?id=415`（WCH 页面标注上传日期 2026-05-21，文件大小 845KB）。

四个型号共用同一份引脚定义表（表 3-1，QFN28 / QFN48 / LQFP64M / QFN68 四列脚号并排），资源差异以表 2-1 为准。

## 0. 型号资源对照（表 2-1）

| 型号 | 封装 | 引脚数 | GPIO | ADC/TKey | USART/UART | SPI | I2C | CAN | USB(FS) | ETH 10M |
|---|---|---|---|---|---|---|---|---|---|---|
| CH32V208GBU6 | QFN28 | 28 | 21（手册） | 8 | 2 | 1 | 1 | 1 | USBD + USBFS | 10M |
| CH32V208CBU6 | QFN48 | 48 | 35 | 10 | 4 | 2 | 2 | 1 | USBD + USBFS | - |
| CH32V208RBT6 | LQFP64M | 64 | 49 | 16 | 4 | 2 | 2 | 1 | USBD + USBFS | 10M |
| CH32V208WBU6 | QFN68 | 68 | 53 | 16 | 4 | 2 | 2 | 1 | USBD + USBFS | 10M |

定时器四型号一致：TIM1（高级 16 位）×1、TIM2/3/4（通用 16 位）×3、TIM5（通用 32 位）×1、看门狗 ×2、RTC、SysTick；运放/比较器 OPA1/OPA2 ×2。

## 1. 封装与 pin 1

| 型号 | family | 边数 | body / pitch | pin 1 |
|---|---|---|---|---|
| GBU6 | quad | 7/边 | 4×4mm / 0.4mm | 左下；EP=0（VSS） |
| CBU6 | quad | 12/边 | 5×5mm / 0.35mm | 左下；EP=0（VSS） |
| RBT6 | quad | 16/边 | 10×10mm / 0.5mm | 左上；无 EP |
| WBU6 | quad | 17/边 | 8×8mm / 0.4mm | 左下；EP=0（VSS） |

QFN 脚号 1 从底边左端开始逆时针；LQFP64M 脚号 1 从左边上端开始逆时针。图 3-1 与表 3-1 的脚号可逐脚互证（例如 WBU6：pin 46 PA11、pin 47 PA12、pin 48 SWDIO、pin 49 VSS_2、pin 50 VINTA、pin 51 ANT、pin 52 SWCLK）。

## 2. 引脚建模约定

1. **SWDIO/SWCLK**：表 3-1 的“引脚名称”列写 SWDIO/SWCLK，“重映射功能”列写 PA13/PA14。数据按 PA13/PA14 命名，`alts` 保留 SWDIO/SWCLK；`globalConfigs.debug` 默认开启并占用这两个脚，关闭后可作 GPIO。
2. **NRST / BOOT0**：专用输入，不是 GPIO。schema 只有 `io/power/osc/rf` 四类，数据将其标为 `power` 以固定脚位，并加注“专用/启动配置输入（非 GPIO）”。BOOT0 不计入 GPIO 数。
3. **PC13**：主功能 PC13，`alts` 保留 TAMPER-RTC；**PB2** 保留 BOOT1；**PC14/PC15** 保留 OSC32_IN/OSC32_OUT，并受 `globalConfigs.lse` 控制（默认关闭）。
4. **OSC_IN/OSC_OUT** 为 `osc`，**ANT** 为 `rf`，其余电源/地按手册原名（VSS_1..4、VDD_IO_1..4、VIO_1/3/4、VDD_1/3、VBAT、VDDA、VSSA、VINTA）建为 `power`。
5. **QFN28 的 GPIO 计数**：手册表 2-1 写 21，但按表 3-1 可复用 IO 为 20（18 个 GPIO + PA13/PA14 调试脚）；差异来自 BOOT0 是否计入。数据按引脚实际功能建模，`meta.note` 标注“20 可复用 IO（手册标 21）”。

## 3. 外设与落脚点

- **USART1**：TX PA9 / PB6（重映射），RX PA10 / PB7；CK PA8；CTS PA11；RTS PA12。QFN28 无 PA8/9/10，实际只剩 PB6/PB7 组，CK 不存在。
- **USART2**：TX PA2、RX PA3、CK PA4、CTS PA0、RTS PA1。
- **USART3**：TX PB10 / PC10，RX PB11 / PC11，CK PB12 / PC12，CTS PB13，RTS PB14。QFN28 无此组。
- **UART4**：TX PC10 / PB0，RX PC11 / PB1。QFN48 只有 PB0/PB1 重映射组；QFN28 无此资源。
- **SPI1**：NSS PA4 / PA15，SCK PA5 / PB3，MISO PA6 / PB4，MOSI PA7 / PB5；主机模式片选可选，从机模式必选。
- **SPI2**：NSS PB12、SCK PB13、MISO PB14、MOSI PB15（仅 CB/RB/WB）。
- **I2C1**：SCL PB6 / PB8，SDA PB7 / PB9，SMBA PB5；**I2C2**：SCL PB10、SDA PB11、SMBA PB12（仅 CB/RB/WB）。
- **CAN1**：RX PA11 / PB8，TX PA12 / PB9。
- **USB1 = USBD**：PA11/PA12，全速设备；**USB2 = USBFS**：PB6/PB7，全速主机/设备（手册 2.5.19/2.5.20）。
- **ETH 10M**：PC6/PC7/PC8/PC9 = RXP/RXN/TXP/TXN。按表 2-1，GB/RB/WB 有 10M，**CB 没有**（虽然 QFN48 引出了 PC6-PC9）。
- **ADC/TKey**：ADC_INx 与 TKey x 复用同一外部通道；GB 8 路（0-7）、CB 10 路（0-9）、RB/WB 16 路（0-15）。数据按通道拆成独立资源，标签 `AINx (TKeyx)`。
- **OPA1/OPA2**：输入 CH0P/CH0N/CH1P/CH1N 与输出 OUT0/OUT1 均按可选信号建模；只保留该封装实际存在的脚。
- **TIM1-5**：每个定时器一个资源，CH1-CH4、CH1N-CH3N、BKIN 均按可选信号建模；TIM1/2/3 的 ETR 单独成资源。原因是 TIM2_CH1 与 TIM2_ETR 共用 PA0/PA15，`validateChip` 不允许同一资源内两个信号共享落脚点。

## 4. 审计裁定与挂账

1. **映射组未细分**：USART/SPI/I2C/CAN/TIM 的重映射后缀（_1/_2/_3）已归并到同一信号的多个落脚点，但资源本身没有按映射位分组。用户同时选择多个信号时需自行核对是否属于同一重映射组合；这与 CH587 系列的处理一致。
2. **CB 无 ETH**：表 2-1 的 Ethernet 行按列读取为 GB=10M、CB=-、RB=10M、WB=10M（WB 与 RB 合并单元格）。QFN48 的 PC6-PC9 仍存在，只是数据不建 ETH 资源。
3. **USB 控制器命名**：手册表 2-1 的 `USBD`/`USBHD` 与正文 2.5.19/2.5.20 的 `USBD`/`USBFS` 对应；数据按正文命名为 USB1（USBD，设备）与 USB2（USBFS，主机/设备）。
4. **QFN28 无 NRST/PC13**：表 3-1 中 GB 列这两脚为“-”，数据不建；QFN28 的 pin 26 为 BOOT0。
5. **CH32V208RBT6 无 EP**：LQFP64M 不建 `thermalPad`，引脚 1..64 完整覆盖。
6. **待复核**：表 2-1 的 Ethernet 合并单元格按“WB 与 RB 相同”解读；若后续手册更新明确 WB 不同，再调整。

## 5. 测试与锁定

`tests/engine.test.js` 的 M8 用例锁定：

- 四个封装的 validateChip、引脚数（29/49/64/69）、GPIO 数（20/35/49/53）、封装参数与 pin 1；
- ADC 数（8/10/16/16）、UART 数（2/4/4/4）、SPI/I2C 数、ETH 有无；
- USART1 在 QFN28 上的 PB6/PB7 重映射组、UART4 在 QFN48 上的 PB0 重映射；
- USB1/USB2 注解、globalConfigs（debug/lse）、BOOT0 固定脚；
- 关键分配冒烟：USART1 映射组、ETH、TIM2 重映射、OPA1 可选信号。
