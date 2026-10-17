/* CH592X (QFN32) 芯片数据。约束事实来源：CH592DS1 V1.9 (2025-12-24)，1.1/1.2 逐脚表、型号资源表与各外设章节已核对 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
    schemaVersion: 2,
    id: "ch592x-qfn32",
    meta: { source: "CH592DS1 V1.9 (2025-12-24)", author: "MeowG", date: "2026-10-17",
            note: "AIN1 在 1.2 引脚表未列、ADC 章节支持；PWMX 同切位未明确，暂不建模；UART1 RXD 仅 PA8" },
    chip: { vendor: "WCH", series: "CH59x", name: "CH592X", package: "QFN32" },
    package: { family: "quad", style: "no-lead", pinsPerSide: 8, pitch: 0.4,
               body: [4, 4], pin1: "bottomLeft", sequence: "ccw-up", thermalPad: "GND (EP)" },
    pins: [
      { num: 1,  name: "PA10", type: "io", alts: ["X32KI", "TMR1/PWM1/CAP1"] },
      { num: 2,  name: "PB6", type: "io", alts: ["RTS", "PWM8", "AIN9"] },
      { num: 3,  name: "PB0", type: "io", alts: ["PWM6", "CTS", "AIN8"] },
      { num: 4,  name: "VDCID", type: "power", alts: [] },
      { num: 5,  name: "VSW", type: "power", alts: [] },
      { num: 6,  name: "VDD33/VIO33", type: "power", alts: [] },
      { num: 7,  name: "PA6", type: "io", alts: ["PWM4_", "RXD2_", "RI", "AIN10"] },
      { num: 8,  name: "PA7", type: "io", alts: ["TXD2_", "PWM5_", "DCD", "AIN11"] },
      { num: 9,  name: "PA8", type: "io", alts: ["RXD1", "AIN12"] },
      { num: 10, name: "PA9", type: "io", alts: ["TMR0/PWM0/CAP0", "TXD1", "AIN13"] },
      { num: 11, name: "PB15", type: "io", alts: ["TCK", "MISO_", "SCL", "DTR"], note: "支持5V(5VT)；两线调试接口占用" },
      { num: 12, name: "PB14", type: "io", alts: ["TIO", "MOSI_", "SDA", "PWM10", "DSR"], note: "支持5V(5VT)；两线调试接口占用" },
      { num: 13, name: "PB13", type: "io", alts: ["SCK0_", "TXD1_", "DCD_"], note: "支持5V(5VT)" },
      { num: 14, name: "PB12", type: "io", alts: ["SCS_", "RXD1_"], note: "支持5V(5VT)；RXD1_ 在 1.2 表未列，按 UART1 映射组/同族 CH585 推定，待复核" },
      { num: 15, name: "PB11", type: "io", alts: ["UD+", "TMR2_"] },
      { num: 16, name: "PB10", type: "io", alts: ["UD-", "TMR1_"] },
      { num: 17, name: "PB7", type: "io", alts: ["TXD0", "PWM9"] },
      { num: 18, name: "PB4", type: "io", alts: ["RXD0", "PWM7"] },
      { num: 19, name: "PB23", type: "io", alts: ["RST#", "TMR0_", "TXD2", "PWM11"] },
      { num: 20, name: "PB22", type: "io", alts: ["TMR3/PWM3/CAP3", "RXD2"] },
      { num: 21, name: "X32MO", type: "osc", alts: [] },
      { num: 22, name: "X32MI", type: "osc", alts: [] },
      { num: 23, name: "VINTA", type: "power", alts: [] },
      { num: 24, name: "ANT", type: "rf", alts: [] },
      { num: 25, name: "VDCIA", type: "power", alts: [] },
      { num: 26, name: "PA4", type: "io", alts: ["RXD3", "AIN0"] },
      { num: 27, name: "PA5", type: "io", alts: ["TXD3", "AIN1"], note: "1.2 引脚表未列 AIN1；ADC 章节支持 AIN1，待复核" },
      { num: 28, name: "PA15", type: "io", alts: ["MISO", "RXD0_", "AIN5"] },
      { num: 29, name: "PA14", type: "io", alts: ["MOSI", "TXD0_", "AIN4"] },
      { num: 30, name: "PA13", type: "io", alts: ["SCK0", "PWM5", "AIN3"] },
      { num: 31, name: "PA12", type: "io", alts: ["SCS", "PWM4", "AIN2"] },
      { num: 32, name: "PA11", type: "io", alts: ["X32KO", "TMR2/PWM2/CAP2"] },
      { num: "EP", name: "GND", type: "power", alts: [] }
    ],
    globalConfigs: [
      { id: "debug", label: "两线调试接口", default: true, claims: ["PB14", "PB15"],
        note: "关闭后释放 PB14/PB15，但失去调试与两线下载（仍可 USB ISP）" },
      { id: "rst", label: "外部复位 RST", default: false, claims: ["PB23"] },
      { id: "xtal32k", label: "32.768kHz 晶振", default: true, claims: ["PA10", "PA11"] }
    ],
    resources: [
      { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组 (PB)" },
        modes: [
          { id: "master", label: "主机模式", signals: ["SCK", "MOSI", "MISO", "SCS"], optional: ["SCS"],
            note: "主机片选 SCS 可选；MISO 为官方输入引脚" },
          { id: "slave", label: "从机模式", signals: ["SCS", "SCK", "MOSI", "MISO"],
            note: "SCS 片选输入必选，低电平有效" }
        ],
        signals: [
          { name: "SCK", pins: ["PA13", "PB13"] },
          { name: "MOSI", pins: ["PA14", "PB14"] },
          { name: "MISO", pins: ["PA15", "PB15"] },
          { name: "SCS", pins: ["PA12", "PB12"],
            note: "从模式片选输入（低有效）；主模式片选输出（可选）" }
        ] },
      { id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
        optional: ["RTS", "CTS", "DTR", "DSR", "RI", "DCD"],
        signals: [
          { name: "TXD", pins: ["PB7", "PA14"] },
          { name: "RXD", pins: ["PB4", "PA15"] },
          { name: "RTS", pins: ["PB6"],  note: "MODEM 输出（请求发送）" },
          { name: "CTS", pins: ["PB0"],  note: "MODEM 输入（清除发送）" },
          { name: "DTR", pins: ["PB15"], note: "MODEM 输出（数据终端就绪）" },
          { name: "DSR", pins: ["PB14"], note: "MODEM 输入（数据装置就绪）" },
          { name: "RI",  pins: ["PA6"],  note: "MODEM 输入（振铃指示）" },
          { name: "DCD", pins: ["PB13", "PA7"], note: "MODEM 输入（载波检测）" }
        ] },
      { id: "UART1", category: "UART", label: "UART1", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PA9", "PB13"] },
                   { name: "RXD", pins: ["PA8", "PB12"], note: "PB12 的 RXD1_ 在 1.2 表未列，按映射组/同族 CH585 推定，待复核" } ] },
      { id: "UART2", category: "UART", label: "UART2", groupSwitch: { label: "改用映射组" },
        signals: [ { name: "TXD", pins: ["PB23", "PA7"] }, { name: "RXD", pins: ["PB22", "PA6"] } ] },
      { id: "UART3", category: "UART", label: "UART3",
        signals: [ { name: "TXD", pins: ["PA5"] }, { name: "RXD", pins: ["PA4"] } ] },
      { id: "I2C", category: "I2C", label: "I2C",
        signals: [ { name: "SCL", pins: ["PB15"], note: "PB15 与两线调试口共用；使用 I2C 需关闭调试接口" },
                   { name: "SDA", pins: ["PB14"], note: "PB14 与两线调试口共用；使用 I2C 需关闭调试接口" } ] },
      { id: "TMR0", category: "TIMER", label: "TMR0",
        modes: [
          { id: "pwm", label: "PWM 输出(PWM0)", signals: ["TMR0/PWM0"] },
          { id: "cap", label: "捕捉输入(CAP0)", signals: ["TMR0/CAP0"] },
          { id: "count", label: "外部计数(CNT0)", signals: ["TMR0/CNT0"] },
          { id: "timer", label: "内部定时中断（No Pin）", signals: [] }
        ],
        signals: [
          { name: "TMR0/PWM0", pins: ["PA9", "PB23"] },
          { name: "TMR0/CAP0", pins: ["PA9", "PB23"] },
          { name: "TMR0/CNT0", pins: ["PA9", "PB23"] }
        ] },
      { id: "TMR1", category: "TIMER", label: "TMR1",
        modes: [
          { id: "pwm", label: "PWM 输出(PWM1)", signals: ["TMR1/PWM1"] },
          { id: "cap", label: "捕捉输入(CAP1)", signals: ["TMR1/CAP1"] },
          { id: "count", label: "外部计数(CNT1)", signals: ["TMR1/CNT1"] },
          { id: "timer", label: "内部定时中断（No Pin）", signals: [] }
        ],
        signals: [
          { name: "TMR1/PWM1", pins: ["PA10", "PB10"] },
          { name: "TMR1/CAP1", pins: ["PA10", "PB10"] },
          { name: "TMR1/CNT1", pins: ["PA10", "PB10"] }
        ] },
      { id: "TMR2", category: "TIMER", label: "TMR2",
        modes: [
          { id: "pwm", label: "PWM 输出(PWM2)", signals: ["TMR2/PWM2"] },
          { id: "cap", label: "捕捉输入(CAP2)", signals: ["TMR2/CAP2"] },
          { id: "count", label: "外部计数(CNT2)", signals: ["TMR2/CNT2"] },
          { id: "timer", label: "内部定时中断（No Pin）", signals: [] }
        ],
        signals: [
          { name: "TMR2/PWM2", pins: ["PA11", "PB11"] },
          { name: "TMR2/CAP2", pins: ["PA11", "PB11"] },
          { name: "TMR2/CNT2", pins: ["PA11", "PB11"] }
        ] },
      { id: "TMR3", category: "TIMER", label: "TMR3",
        modes: [
          { id: "pwm", label: "PWM 输出(PWM3)", signals: ["TMR3/PWM3"] },
          { id: "cap", label: "捕捉输入(CAP3)", signals: ["TMR3/CAP3"] },
          { id: "count", label: "外部计数(CNT3)", signals: ["TMR3/CNT3"] },
          { id: "timer", label: "内部定时中断（No Pin）", signals: [] }
        ],
        signals: [
          { name: "TMR3/PWM3", pins: ["PB22"] },
          { name: "TMR3/CAP3", pins: ["PB22"] },
          { name: "TMR3/CNT3", pins: ["PB22"] }
        ] },
      { id: "PWM4",  category: "PWM", label: "PWM4",  signals: [ { name: "PWM4",  pins: ["PA12", "PA6"] } ] },
      { id: "PWM5",  category: "PWM", label: "PWM5",  signals: [ { name: "PWM5",  pins: ["PA13", "PA7"] } ] },
      { id: "PWM6",  category: "PWM", label: "PWM6",  signals: [ { name: "PWM6",  pins: ["PB0"] } ] },
      { id: "PWM7",  category: "PWM", label: "PWM7",  signals: [ { name: "PWM7",  pins: ["PB4"] } ] },
      { id: "PWM8",  category: "PWM", label: "PWM8",  signals: [ { name: "PWM8",  pins: ["PB6"] } ] },
      { id: "PWM9",  category: "PWM", label: "PWM9",  signals: [ { name: "PWM9",  pins: ["PB7"] } ] },
      { id: "PWM10", category: "PWM", label: "PWM10", signals: [ { name: "PWM10", pins: ["PB14"], note: "PB14 与两线调试口共用；使用 PWM10 需关闭调试接口" } ] },
      { id: "PWM11", category: "PWM", label: "PWM11", signals: [ { name: "PWM11", pins: ["PB23"] } ] },
      { id: "AIN0",  category: "ADC", label: "AIN0 (TK0)",   signals: [ { name: "AIN0",  pins: ["PA4"] } ] },
      { id: "AIN1",  category: "ADC", label: "AIN1 (TK1)",   signals: [ { name: "AIN1",  pins: ["PA5"], note: "引脚表未列，ADC 章节支持；待复核" } ] },
      { id: "AIN2",  category: "ADC", label: "AIN2 (TK2)",   signals: [ { name: "AIN2",  pins: ["PA12"] } ] },
      { id: "AIN3",  category: "ADC", label: "AIN3 (TK3)",   signals: [ { name: "AIN3",  pins: ["PA13"] } ] },
      { id: "AIN4",  category: "ADC", label: "AIN4 (TK4)",   signals: [ { name: "AIN4",  pins: ["PA14"] } ] },
      { id: "AIN5",  category: "ADC", label: "AIN5 (TK5)",   signals: [ { name: "AIN5",  pins: ["PA15"] } ] },
      { id: "AIN8",  category: "ADC", label: "AIN8 (TK8)",   signals: [ { name: "AIN8",  pins: ["PB0"] } ] },
      { id: "AIN9",  category: "ADC", label: "AIN9 (TK9)",   signals: [ { name: "AIN9",  pins: ["PB6"] } ] },
      { id: "AIN10", category: "ADC", label: "AIN10 (TK10)", signals: [ { name: "AIN10", pins: ["PA6"] } ] },
      { id: "AIN11", category: "ADC", label: "AIN11 (TK11)", signals: [ { name: "AIN11", pins: ["PA7"] } ] },
      { id: "AIN12", category: "ADC", label: "AIN12 (TK12)", signals: [ { name: "AIN12", pins: ["PA8"] } ] },
      { id: "AIN13", category: "ADC", label: "AIN13 (TK13)", signals: [ { name: "AIN13", pins: ["PA9"] } ] },
      { id: "USB", category: "USB", label: "USB",
        signals: [ { name: "D-", pins: ["PB10"] }, { name: "D+", pins: ["PB11"] } ],
        note: "全速 USB 主机/设备" },
      { id: "LCD", category: "LCD", label: "段式 LCD",
        note: "COM2/COM3（PB14/PB15）与两线调试口共用；使用 LCD 需关闭调试接口",
        optional: ["SEG0", "SEG1", "SEG2", "SEG3", "SEG4", "SEG5", "SEG6", "SEG7", "SEG8", "SEG9",
                   "SEG10", "SEG11", "SEG12", "SEG13", "SEG14", "SEG15", "SEG16", "SEG17", "SEG18", "SEG19"],
        signals: [
          { name: "COM0", pins: ["PB12"], note: "LCD 公共端（必选）" },
          { name: "COM1", pins: ["PB13"] }, { name: "COM2", pins: ["PB14"] }, { name: "COM3", pins: ["PB15"] },
          { name: "SEG0", pins: ["PB7"] }, { name: "SEG1", pins: ["PB4"] },
          { name: "SEG2", pins: ["PB23"] }, { name: "SEG3", pins: ["PB22"] },
          { name: "SEG4", pins: ["PA4"] }, { name: "SEG5", pins: ["PA5"] },
          { name: "SEG6", pins: ["PA15"] }, { name: "SEG7", pins: ["PA14"] },
          { name: "SEG8", pins: ["PA13"] }, { name: "SEG9", pins: ["PA12"] },
          { name: "SEG10", pins: ["PA11"] }, { name: "SEG11", pins: ["PA10"] },
          { name: "SEG12", pins: ["PA8"] }, { name: "SEG13", pins: ["PA9"] },
          { name: "SEG14", pins: ["PB11"] }, { name: "SEG15", pins: ["PB10"] },
          { name: "SEG16", pins: ["PB6"] }, { name: "SEG17", pins: ["PB0"] },
          { name: "SEG18", pins: ["PA6"] }, { name: "SEG19", pins: ["PA7"] }
        ] },
      { id: "GPIO", category: "GPIO", label: "GPIO", perPin: true }
    ]
  };
});
