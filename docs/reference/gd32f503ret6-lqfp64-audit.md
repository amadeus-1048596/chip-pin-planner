# GD32F503RET6 (LQFP64) 数据审计

## 事实来源

- **GD32F503xx Datasheet Rev0.9RC6**（GigaDevice，2026-03）
  - 表 2-1 型号资源列表（RET6 列）
  - 表 2-5 LQFP64 引脚定义（第 34-38 页）
  - 表 2-11~2-15 端口复用矩阵（第 60-62 页）
  - 第 5.2 节 LQFP64 封装尺寸
  - <https://download.gigadevice.com/Datasheet/GD32F503xx_Datasheet_Rev0.9RC6.pdf>
- **GD32F50x User Manual Rev1.4**（GigaDevice，2026-05）
  - 启动配置、时钟、ADC/DAC/CMP、TIMER、SPI/I2S、EXMC 章节
  - <https://download.gigadevice.com/User_Manual/GD32F50x%20User%20Manual_Rev1.4.pdf>

> Rev0.9RC6 仍是预发布版本（Revision history 显示 0.9RC1-0.9RC6）。Rev1.0 发布后应重新核对引脚与复用表。

## 提取与核对方法

- 用 pdfplumber 逐页提取表 2-5（含跨页续表）和表 2-11~2-15，再按“引脚定义表 ∪ 复用矩阵”求并集。
- 复用矩阵覆盖全系列；数据只保留 LQFP64 已引出引脚：PA0-PA15、PB0-PB15、PC0-PC15、PD0-PD2。PD3-PD15、PE0-PE15 未引出，不进入资源。
- ADC/DAC/CMP/USBFS_DM/DP/WKUP/TAMPER 等模拟或附加功能来自表 2-5 的 `Additional:` 行。
- 封装参数取第 5.2 节：16 脚/边、pitch 0.5 mm、body 10×10 mm。

## 核对结果

- 64 脚、51 GPIO，与表 2-1 的 RET6 列一致；29 个 5V 容忍 GPIO。
- 51 个 GPIO 均带 `EVENTOUT`（复用矩阵 AF8）。
- 手册内部不一致及处理：
  1. 表 2-5 的 PB4 行只列 `Default: NJTRST, PB4`，其余复用功能在下一页续表和表 2-12 中；数据已合并。
  2. 表 2-5 的 PD0/PD1 未列 `CAN0_RX/TX`、`EXMC_D2/D3`，但表 2-14 明确列出；数据按复用矩阵补入。
  3. PA1、PA8 的引脚行跨页，续行已合并。
  4. `TIMER0_CH3_ON` 与 `TIMER0_CH2` 共用 PA10，`TIMER7_CH3_ON` 与 `TIMER7_CH1` 共用 PC7；本工具一个信号只保留一个落脚点，冲突落脚点归主通道，并在信号 `note` 说明。`TIMER15_BRKIN` 与 `TIMER15_CH1` 共用 PA10，因此刹车输入单独建 `TIMER15_BRKIN` 资源。
  5. 数据手册正文称 “two 12-bit DAC”，但表 2-5 和 UM 表 22-2 只有 `DAC0_OUT0`（PA4/PA5）；数据按实际建 `DAC0`。
- 未建模（无外部引脚或 LQFP64 未引出）：TIMER3_ETI（PE0）、TIMER5/6 基本定时器、RTC/WDG/CRC/TRNG/HAU/CAU、ADC 内部通道（VSENSE/VREFINT）、EXMC 地址线与高位数据线。

## 多落脚点核对（全部外设）

按表 2-11~2-15 对 35 个资源、177 个信号逐项比对：除 `TIMER0_CH3_ON`/PA10、`TIMER7_CH3_ON`/PC7 两处冲突替代脚外，0 差异。GD32F503 的复用由 `GPIOx_AFSEL` 逐脚选择 AF0-AF8（UM §11.3.3），没有 CH58x 那种整组 remap，因此数据不使用 `groupSwitch`，而是每个信号列出全部可选脚。

有多落脚点的资源：

- USART0：TXD=PA9/PB6，RXD=PA10/PB7
- USART2：TXD=PB10/PC10，RXD=PB11/PC11，CK=PB12/PC12
- SPI0：NSS=PA4/PA15，SCK=PA5/PB3，MISO=PA6/PB4，MOSI=PA7/PB5，IO2=PA2/PB6，IO3=PA3/PB7
- SPI2：NSS=PA4/PA15，SCK=PB3/PC10，MISO=PB4/PC11，MOSI=PB5/PC12
- I2S2：WS=PA4/PA15，CK=PB3/PC10，SD=PB5/PC12
- I2C0：SCL=PB6/PB8，SDA=PB7/PB9
- CAN0：RX=PA11/PB8/PD0，TX=PA12/PB9/PD1
- CAN1：RX=PB5/PB12，TX=PB6/PB13
- TIMER0/1/2/3/4/7/15/16：通道、互补输出、刹车输入有多个落脚点（详见数据文件）
- DAC0 OUT0=PA4/PA5；CMP0 OUT=PA0/PA1/PA6/PB0/PB1；EXMC 部分数据/控制脚；CK_OUT=PA8/PB3
- 仅一组（LQFP64 未引出其它脚）：USART1（PD5/PD6 未引出）、SPI1、I2C1、UART3、UART4

## 调试接口核对（2026-11-03 修订）

UM §16.2.2 明确：

- 复位后默认是 **5 线 JTAG**：PA13（JTMS/SWDIO）、PA14（JTCK/SWCLK）、PA15（JTDI）、PB3（JTDO）、PB4（NJTRST）。
- 切换到 **SWD 两线**后，PA15/PB4/PB3 释放为 GPIO，SWD 只用 PA13/PA14。
- 仅用 JTAG 且 NJTRST 由硬件拉高时，PB4 可释放（4 线 JTAG）。
- 完全不用调试接口时，5 根全部释放。

因此 `globalConfigs` 拆为三项：

| id | 引脚 | 默认 | 说明 |
|---|---|---|---|
| `debug_common` | PA13/PA14 | 开 | SWD 与 JTAG 的公共脚（SWDIO/JTMS、SWCLK/JTCK） |
| `jtag_data` | PA15/PB3 | 关 | JTAG 数据脚；JTAG 5 线时与公共脚一起勾选 |
| `jtag_njtrst` | PB4 | 关 | JTAG 复位；NJTRST 可硬件拉高，不勾选时 PB4 可作 GPIO |

工具默认只锁 2 根（按 SWD 规划）；硬件复位默认是 5 线 JTAG，如需按复位状态核对请把三项都勾上。PA15/PB3 不能脱离 PA13/PA14 单独作为 JTAG；PB4 可以单独释放（4 线 JTAG）。

## USART/UART 落脚点核对

LQFP64 封装（PD3-PD15、PE0-PE15 未引出）：

- USART0：TXD=PA9/PB6，RXD=PA10/PB7，CK=PA8，CTS=PA11，RTS=PA12。
- USART1：TXD=PA2，RXD=PA3，CK=PA4，CTS=PA0，RTS=PA1（PD5/PD6/PD7/PD3/PD4 未引出）。
- USART2：TXD=PB10/PC10，RXD=PB11/PC11，CK=PB12/PC12，CTS=PB13，RTS=PB14。
- UART3：TXD=PC10，RXD=PC11。
- UART4：TXD=PC12，RXD=PD2。

工具中更换落脚点的方法：点目标引脚 → 选同一资源/信号。TXD 和 RXD 分别换，工具不会自动整组迁移。
