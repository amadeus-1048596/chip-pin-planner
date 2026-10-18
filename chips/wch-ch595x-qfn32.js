/* CH595X (QFN32) 芯片数据。事实来源：CH595DS1 V1.1 (2026-03-13)，1.1/1.2 逐脚表与 p1 资源表；由 CH592X 同脚序基线派生 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch595x-qfn32",
  "meta": {
    "source": "CH595DS1 V1.1 (2026-03-13)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "AIN6 在 1.2 引脚表未列、ADC 章节/型号计数（14+1）支持；调试口为 SWDIO/SWCLK（PA12/PA13），与 SPI/PWM/LCD/ADC 共用"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH59x",
    "name": "CH595X",
    "package": "QFN32"
  },
  "package": {
    "family": "quad",
    "style": "no-lead",
    "pinsPerSide": 8,
    "pitch": 0.4,
    "body": [
      4,
      4
    ],
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "GND (EP)"
  },
  "pins": [
    {
      "num": 1,
      "name": "PA10",
      "type": "io",
      "alts": [
        "X32KI",
        "TMR1",
        "ENCCAP_IN1_",
        "AIN6"
      ],
      "note": "1.2 引脚表未列 AIN6；ADC 章节/型号计数支持，待复核"
    },
    {
      "num": 2,
      "name": "PB6",
      "type": "io",
      "alts": [
        "RTS",
        "PWM8",
        "AIN9"
      ]
    },
    {
      "num": 3,
      "name": "PB0",
      "type": "io",
      "alts": [
        "PWM6",
        "CTS",
        "AIN8"
      ]
    },
    {
      "num": 4,
      "name": "VDCID",
      "type": "power",
      "alts": []
    },
    {
      "num": 5,
      "name": "VSW",
      "type": "power",
      "alts": []
    },
    {
      "num": 6,
      "name": "VDD33/VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 7,
      "name": "PA6",
      "type": "io",
      "alts": [
        "PWM4_",
        "KEYSCAN[2]",
        "RXD2_",
        "RI",
        "AIN10"
      ]
    },
    {
      "num": 8,
      "name": "PA7",
      "type": "io",
      "alts": [
        "TXD2_",
        "PWM5_",
        "KEYSCAN[3]",
        "DCD",
        "AIN11"
      ]
    },
    {
      "num": 9,
      "name": "PA8",
      "type": "io",
      "alts": [
        "KEYSCAN[4]",
        "RXD1",
        "AIN12"
      ]
    },
    {
      "num": 10,
      "name": "PA9",
      "type": "io",
      "alts": [
        "TMR0/PWM0/CAP0",
        "TXD1",
        "AIN13"
      ]
    },
    {
      "num": 11,
      "name": "PB15",
      "type": "io",
      "alts": [
        "MISO_",
        "SCL",
        "DTR",
        "LED_CLK_"
      ],
      "note": "支持5V(5VT)"
    },
    {
      "num": 12,
      "name": "PB14",
      "type": "io",
      "alts": [
        "MOSI_",
        "SDA",
        "PWM10",
        "LED[0]_",
        "DSR"
      ],
      "note": "支持5V(5VT)"
    },
    {
      "num": 13,
      "name": "PB13",
      "type": "io",
      "alts": [
        "SCK_",
        "TXD1_",
        "LED[1]_",
        "DCD_"
      ],
      "note": "支持5V(5VT)"
    },
    {
      "num": 14,
      "name": "PB12",
      "type": "io",
      "alts": [
        "LED[2]_",
        "RXD1_",
        "SCS_",
        "RI_"
      ],
      "note": "支持5V(5VT)"
    },
    {
      "num": 15,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "LED[3]_",
        "ENCCAP_IN2",
        "TMR2_"
      ]
    },
    {
      "num": 16,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "ENCCAP_IN1",
        "TMR1_"
      ]
    },
    {
      "num": 17,
      "name": "PB7",
      "type": "io",
      "alts": [
        "TXD0",
        "PWM9"
      ]
    },
    {
      "num": 18,
      "name": "PB4",
      "type": "io",
      "alts": [
        "PWM7",
        "RXD0"
      ]
    },
    {
      "num": 19,
      "name": "PB23",
      "type": "io",
      "alts": [
        "RST#",
        "TMR0_",
        "TXD2",
        "PWM11"
      ]
    },
    {
      "num": 20,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3/PWM3/CAP3",
        "RXD2"
      ]
    },
    {
      "num": 21,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 22,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 23,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 24,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 25,
      "name": "VDCIA",
      "type": "power",
      "alts": []
    },
    {
      "num": 26,
      "name": "PA4",
      "type": "io",
      "alts": [
        "KEYSCAN[0]",
        "RXD3",
        "AIN0"
      ]
    },
    {
      "num": 27,
      "name": "PA5",
      "type": "io",
      "alts": [
        "TXD3",
        "KEYSCAN[1]",
        "AIN1"
      ]
    },
    {
      "num": 28,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "LED_CLK",
        "RXD0_",
        "AIN5"
      ]
    },
    {
      "num": 29,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "LED[0]",
        "AIN4"
      ]
    },
    {
      "num": 30,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK",
        "PWM5",
        "LED[1]",
        "SWCLK",
        "AIN3"
      ],
      "note": "调试口 SWDIO/SWCLK 共用"
    },
    {
      "num": 31,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SWDIO",
        "PWM4",
        "LED[2]",
        "SCS",
        "AIN2"
      ],
      "note": "调试口 SWDIO/SWCLK 共用"
    },
    {
      "num": 32,
      "name": "PA11",
      "type": "io",
      "alts": [
        "TMR2",
        "LED[3]",
        "ENCCAP_IN2_",
        "X32KO",
        "AIN7"
      ],
      "note": "与 32.768kHz 晶振共用；使用 AIN7 需关闭晶振"
    },
    {
      "num": "EP",
      "name": "GND",
      "type": "power",
      "alts": []
    }
  ],
  "globalConfigs": [
    {
      "id": "debug",
      "label": "两线调试接口",
      "default": true,
      "claims": [
        "PA12",
        "PA13"
      ],
      "note": "CH595 调试口为 SWDIO/SWCLK（PA12/PA13）；与 SPI0、PWM4/5、LCD SEG8/9、AIN2/3 共用，使用这些功能需关闭调试"
    },
    {
      "id": "rst",
      "label": "外部复位 RST",
      "default": false,
      "claims": [
        "PB23"
      ]
    },
    {
      "id": "xtal32k",
      "label": "32.768kHz 晶振",
      "default": true,
      "claims": [
        "PA10",
        "PA11"
      ]
    }
  ],
  "resources": [
    {
      "id": "SPI0",
      "category": "SPI",
      "label": "SPI0",
      "groupSwitch": {
        "label": "改用映射组 (PB)"
      },
      "modes": [
        {
          "id": "master",
          "label": "主机模式",
          "signals": [
            "SCK",
            "MOSI",
            "MISO",
            "SCS"
          ],
          "optional": [
            "SCS"
          ],
          "note": "主机片选 SCS 可选；MISO 为官方输入引脚"
        },
        {
          "id": "slave",
          "label": "从机模式",
          "signals": [
            "SCS",
            "SCK",
            "MOSI",
            "MISO"
          ],
          "note": "SCS 片选输入必选，低电平有效"
        }
      ],
      "signals": [
        {
          "name": "SCK",
          "pins": [
            "PA13",
            "PB13"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PA14",
            "PB14"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PA15",
            "PB15"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PA12",
            "PB12"
          ],
          "note": "从模式片选输入（低有效）；主模式片选输出（可选）"
        }
      ]
    },
    {
      "id": "UART0",
      "category": "UART",
      "label": "UART0",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "optional": [
        "RTS",
        "CTS",
        "DTR",
        "DSR",
        "RI",
        "DCD"
      ],
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB7",
            "PA14"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB4",
            "PA15"
          ]
        },
        {
          "name": "RTS",
          "pins": [
            "PB6"
          ],
          "note": "MODEM 输出（请求发送）"
        },
        {
          "name": "CTS",
          "pins": [
            "PB0"
          ],
          "note": "MODEM 输入（清除发送）"
        },
        {
          "name": "DTR",
          "pins": [
            "PB15"
          ],
          "note": "MODEM 输出（数据终端就绪）"
        },
        {
          "name": "DSR",
          "pins": [
            "PB14"
          ],
          "note": "MODEM 输入（数据装置就绪）"
        },
        {
          "name": "RI",
          "pins": [
            "PA6"
          ],
          "note": "MODEM 输入（振铃指示）"
        },
        {
          "name": "DCD",
          "pins": [
            "PB13",
            "PA7"
          ],
          "note": "MODEM 输入（载波检测）"
        }
      ]
    },
    {
      "id": "UART1",
      "category": "UART",
      "label": "UART1",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA9",
            "PB13"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA8",
            "PB12"
          ]
        }
      ]
    },
    {
      "id": "UART2",
      "category": "UART",
      "label": "UART2",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB23",
            "PA7"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB22",
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "UART3",
      "category": "UART",
      "label": "UART3",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA4"
          ]
        }
      ]
    },
    {
      "id": "I2C",
      "category": "I2C",
      "label": "I2C",
      "signals": [
        {
          "name": "SCL",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB14"
          ]
        }
      ]
    },
    {
      "id": "TMR0",
      "category": "TIMER",
      "label": "TMR0",
      "modes": [
        {
          "id": "pwm",
          "label": "PWM 输出(PWM0)",
          "signals": [
            "TMR0/PWM0"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP0)",
          "signals": [
            "TMR0/CAP0"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT0)",
          "signals": [
            "TMR0/CNT0"
          ]
        },
        {
          "id": "timer",
          "label": "内部定时中断（No Pin）",
          "signals": []
        }
      ],
      "signals": [
        {
          "name": "TMR0/PWM0",
          "pins": [
            "PA9",
            "PB23"
          ]
        },
        {
          "name": "TMR0/CAP0",
          "pins": [
            "PA9",
            "PB23"
          ]
        },
        {
          "name": "TMR0/CNT0",
          "pins": [
            "PA9",
            "PB23"
          ]
        }
      ]
    },
    {
      "id": "TMR1",
      "category": "TIMER",
      "label": "TMR1",
      "modes": [
        {
          "id": "pwm",
          "label": "PWM 输出(PWM1)",
          "signals": [
            "TMR1/PWM1"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP1)",
          "signals": [
            "TMR1/CAP1"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT1)",
          "signals": [
            "TMR1/CNT1"
          ]
        },
        {
          "id": "timer",
          "label": "内部定时中断（No Pin）",
          "signals": []
        }
      ],
      "signals": [
        {
          "name": "TMR1/PWM1",
          "pins": [
            "PA10",
            "PB10"
          ]
        },
        {
          "name": "TMR1/CAP1",
          "pins": [
            "PA10",
            "PB10"
          ]
        },
        {
          "name": "TMR1/CNT1",
          "pins": [
            "PA10",
            "PB10"
          ]
        }
      ]
    },
    {
      "id": "TMR2",
      "category": "TIMER",
      "label": "TMR2",
      "modes": [
        {
          "id": "pwm",
          "label": "PWM 输出(PWM2)",
          "signals": [
            "TMR2/PWM2"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP2)",
          "signals": [
            "TMR2/CAP2"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT2)",
          "signals": [
            "TMR2/CNT2"
          ]
        },
        {
          "id": "timer",
          "label": "内部定时中断（No Pin）",
          "signals": []
        }
      ],
      "signals": [
        {
          "name": "TMR2/PWM2",
          "pins": [
            "PA11",
            "PB11"
          ]
        },
        {
          "name": "TMR2/CAP2",
          "pins": [
            "PA11",
            "PB11"
          ]
        },
        {
          "name": "TMR2/CNT2",
          "pins": [
            "PA11",
            "PB11"
          ]
        }
      ]
    },
    {
      "id": "TMR3",
      "category": "TIMER",
      "label": "TMR3",
      "modes": [
        {
          "id": "pwm",
          "label": "PWM 输出(PWM3)",
          "signals": [
            "TMR3/PWM3"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP3)",
          "signals": [
            "TMR3/CAP3"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT3)",
          "signals": [
            "TMR3/CNT3"
          ]
        },
        {
          "id": "timer",
          "label": "内部定时中断（No Pin）",
          "signals": []
        }
      ],
      "signals": [
        {
          "name": "TMR3/PWM3",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "TMR3/CAP3",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "TMR3/CNT3",
          "pins": [
            "PB22"
          ]
        }
      ]
    },
    {
      "id": "PWM4",
      "category": "PWM",
      "label": "PWM4",
      "signals": [
        {
          "name": "PWM4",
          "pins": [
            "PA12",
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "PWM5",
      "category": "PWM",
      "label": "PWM5",
      "signals": [
        {
          "name": "PWM5",
          "pins": [
            "PA13",
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "PWM6",
      "category": "PWM",
      "label": "PWM6",
      "signals": [
        {
          "name": "PWM6",
          "pins": [
            "PB0"
          ]
        }
      ]
    },
    {
      "id": "PWM7",
      "category": "PWM",
      "label": "PWM7",
      "signals": [
        {
          "name": "PWM7",
          "pins": [
            "PB4"
          ]
        }
      ]
    },
    {
      "id": "PWM8",
      "category": "PWM",
      "label": "PWM8",
      "signals": [
        {
          "name": "PWM8",
          "pins": [
            "PB6"
          ]
        }
      ]
    },
    {
      "id": "PWM9",
      "category": "PWM",
      "label": "PWM9",
      "signals": [
        {
          "name": "PWM9",
          "pins": [
            "PB7"
          ]
        }
      ]
    },
    {
      "id": "PWM10",
      "category": "PWM",
      "label": "PWM10",
      "signals": [
        {
          "name": "PWM10",
          "pins": [
            "PB14"
          ]
        }
      ]
    },
    {
      "id": "PWM11",
      "category": "PWM",
      "label": "PWM11",
      "signals": [
        {
          "name": "PWM11",
          "pins": [
            "PB23"
          ]
        }
      ]
    },
    {
      "id": "AIN0",
      "category": "ADC",
      "label": "AIN0 (TK0)",
      "signals": [
        {
          "name": "AIN0",
          "pins": [
            "PA4"
          ]
        }
      ]
    },
    {
      "id": "AIN1",
      "category": "ADC",
      "label": "AIN1 (TK1)",
      "signals": [
        {
          "name": "AIN1",
          "pins": [
            "PA5"
          ]
        }
      ]
    },
    {
      "id": "AIN2",
      "category": "ADC",
      "label": "AIN2 (TK2)",
      "signals": [
        {
          "name": "AIN2",
          "pins": [
            "PA12"
          ],
          "note": "PA12 与 SWDIO/SWCLK 调试口共用；使用需关闭调试"
        }
      ]
    },
    {
      "id": "AIN3",
      "category": "ADC",
      "label": "AIN3 (TK3)",
      "signals": [
        {
          "name": "AIN3",
          "pins": [
            "PA13"
          ],
          "note": "PA13 与 SWDIO/SWCLK 调试口共用；使用需关闭调试"
        }
      ]
    },
    {
      "id": "AIN4",
      "category": "ADC",
      "label": "AIN4 (TK4)",
      "signals": [
        {
          "name": "AIN4",
          "pins": [
            "PA14"
          ]
        }
      ]
    },
    {
      "id": "AIN5",
      "category": "ADC",
      "label": "AIN5 (TK5)",
      "signals": [
        {
          "name": "AIN5",
          "pins": [
            "PA15"
          ]
        }
      ]
    },
    {
      "id": "AIN6",
      "category": "ADC",
      "label": "AIN6 (TK6)",
      "signals": [
        {
          "name": "AIN6",
          "pins": [
            "PA10"
          ],
          "note": "PA10 与 32.768kHz 晶振共用；使用需关闭晶振；引脚表未列，待复核"
        }
      ]
    },
    {
      "id": "AIN7",
      "category": "ADC",
      "label": "AIN7 (TK7)",
      "signals": [
        {
          "name": "AIN7",
          "pins": [
            "PA11"
          ],
          "note": "PA11 与 32.768kHz 晶振共用；使用需关闭晶振"
        }
      ]
    },
    {
      "id": "AIN8",
      "category": "ADC",
      "label": "AIN8 (TK8)",
      "signals": [
        {
          "name": "AIN8",
          "pins": [
            "PB0"
          ]
        }
      ]
    },
    {
      "id": "AIN9",
      "category": "ADC",
      "label": "AIN9 (TK9)",
      "signals": [
        {
          "name": "AIN9",
          "pins": [
            "PB6"
          ]
        }
      ]
    },
    {
      "id": "AIN10",
      "category": "ADC",
      "label": "AIN10 (TK10)",
      "signals": [
        {
          "name": "AIN10",
          "pins": [
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "AIN11",
      "category": "ADC",
      "label": "AIN11 (TK11)",
      "signals": [
        {
          "name": "AIN11",
          "pins": [
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "AIN12",
      "category": "ADC",
      "label": "AIN12 (TK12)",
      "signals": [
        {
          "name": "AIN12",
          "pins": [
            "PA8"
          ]
        }
      ]
    },
    {
      "id": "AIN13",
      "category": "ADC",
      "label": "AIN13 (TK13)",
      "signals": [
        {
          "name": "AIN13",
          "pins": [
            "PA9"
          ]
        }
      ]
    },
    {
      "id": "USB",
      "category": "USB",
      "label": "USB",
      "signals": [
        {
          "name": "D-",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PB11"
          ]
        }
      ],
      "note": "全速 USB 主机/设备"
    },
    {
      "id": "LCD",
      "category": "LCD",
      "label": "段式 LCD",
      "note": "SEG8/SEG9（PA13/PA12）与 SWDIO/SWCLK 调试口共用；SEG10/SEG11（PA11/PA10）与 32.768kHz 晶振共用；使用时需关闭对应配置",
      "optional": [
        "SEG0",
        "SEG1",
        "SEG2",
        "SEG3",
        "SEG4",
        "SEG5",
        "SEG6",
        "SEG7",
        "SEG8",
        "SEG9",
        "SEG10",
        "SEG11",
        "SEG12",
        "SEG13",
        "SEG14",
        "SEG15",
        "SEG16",
        "SEG17",
        "SEG18",
        "SEG19"
      ],
      "signals": [
        {
          "name": "COM0",
          "pins": [
            "PB12"
          ],
          "note": "LCD 公共端（必选）"
        },
        {
          "name": "COM1",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "COM2",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "COM3",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "SEG0",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "SEG1",
          "pins": [
            "PB4"
          ]
        },
        {
          "name": "SEG2",
          "pins": [
            "PB23"
          ]
        },
        {
          "name": "SEG3",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "SEG4",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "SEG5",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "SEG6",
          "pins": [
            "PA15"
          ]
        },
        {
          "name": "SEG7",
          "pins": [
            "PA14"
          ]
        },
        {
          "name": "SEG8",
          "pins": [
            "PA13"
          ]
        },
        {
          "name": "SEG9",
          "pins": [
            "PA12"
          ]
        },
        {
          "name": "SEG10",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "SEG11",
          "pins": [
            "PA10"
          ]
        },
        {
          "name": "SEG12",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "SEG13",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "SEG14",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "SEG15",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "SEG16",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "SEG17",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "SEG18",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "SEG19",
          "pins": [
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "GPIO",
      "category": "GPIO",
      "label": "GPIO",
      "perPin": true
    }
  ]
}; });
