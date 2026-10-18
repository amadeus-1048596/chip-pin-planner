/* CH587F (QFN32) 芯片数据。事实来源：CH587DS1 V1.0 (2026-07-17)，1.2 逐脚表与型号资源表；复用按信号落脚点汇总建模 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch587f-qfn32",
  "meta": {
    "source": "CH587DS1 V1.0 (2026-07-17)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "CH587F：QFN32，24 GPIO；USB FS/HS、ARGB、LCD 14×4"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH587F",
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
        "TMR1"
      ]
    },
    {
      "num": 2,
      "name": "VDCID",
      "type": "power",
      "alts": []
    },
    {
      "num": 3,
      "name": "VSW",
      "type": "power",
      "alts": []
    },
    {
      "num": 4,
      "name": "VDD33/VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 5,
      "name": "PA9",
      "type": "io",
      "alts": [
        "TMR0",
        "TXD1",
        "ARGB_2",
        "A13"
      ]
    },
    {
      "num": 6,
      "name": "PB8",
      "type": "io",
      "alts": [
        "A21",
        "NFCM"
      ]
    },
    {
      "num": 7,
      "name": "PB17",
      "type": "io",
      "alts": [
        "NFC+"
      ]
    },
    {
      "num": 8,
      "name": "PB16",
      "type": "io",
      "alts": [
        "NFC-"
      ]
    },
    {
      "num": 9,
      "name": "PB15",
      "type": "io",
      "alts": [
        "TCK",
        "MISO_",
        "DTR_"
      ]
    },
    {
      "num": 10,
      "name": "PB14",
      "type": "io",
      "alts": [
        "TIO",
        "MOSI_",
        "PWM10",
        "DSR_"
      ]
    },
    {
      "num": 11,
      "name": "PB13",
      "type": "io",
      "alts": [
        "U2D+",
        "SCK0_",
        "SCL",
        "TXD1_"
      ]
    },
    {
      "num": 12,
      "name": "PB12",
      "type": "io",
      "alts": [
        "U2D-",
        "SCS_",
        "SDA",
        "RXD1_"
      ]
    },
    {
      "num": 13,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_",
        "ENC2_2"
      ]
    },
    {
      "num": 14,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_",
        "ENC1_2"
      ]
    },
    {
      "num": 15,
      "name": "PB7",
      "type": "io",
      "alts": [
        "TXD0",
        "PWM9",
        "LEDC_"
      ]
    },
    {
      "num": 16,
      "name": "PB6",
      "type": "io",
      "alts": [
        "RTS",
        "PWM8",
        "ENC2_",
        "ADCS2"
      ]
    },
    {
      "num": 17,
      "name": "PB5",
      "type": "io",
      "alts": [
        "DTR",
        "ENC1_",
        "ADCS1"
      ]
    },
    {
      "num": 18,
      "name": "PB4",
      "type": "io",
      "alts": [
        "RXD0",
        "PWM7",
        "ARGB_",
        "ADCS0"
      ]
    },
    {
      "num": 19,
      "name": "PB23",
      "type": "io",
      "alts": [
        "TMR0_",
        "TXD2_1",
        "PWM11",
        "RST"
      ]
    },
    {
      "num": 20,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3",
        "RXD2_1",
        "ARGB_3"
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
        "RXD3",
        "LEDC",
        "A0"
      ]
    },
    {
      "num": 27,
      "name": "PA5",
      "type": "io",
      "alts": [
        "TXD3",
        "LED4",
        "A1"
      ]
    },
    {
      "num": 28,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "A5"
      ]
    },
    {
      "num": 29,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "A4"
      ]
    },
    {
      "num": 30,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "A3"
      ]
    },
    {
      "num": 31,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "A2"
      ]
    },
    {
      "num": 32,
      "name": "PA11",
      "type": "io",
      "alts": [
        "X32KO",
        "TMR2"
      ]
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
        "PB15",
        "PB14"
      ],
      "note": "TCK/TIO；与部分复用功能共用"
    },
    {
      "id": "rst",
      "label": "外部复位 RST",
      "default": false,
      "claims": [
        "PB23"
      ],
      "note": "RST 映射；启用会占用该脚"
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
      "id": "UART0",
      "category": "UART",
      "label": "UART0",
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
          ]
        },
        {
          "name": "DTR",
          "pins": [
            "PB15",
            "PB5"
          ]
        },
        {
          "name": "DSR",
          "pins": [
            "PB14"
          ]
        }
      ],
      "note": "映射组未细分；信号落脚点为手册复用名汇总",
      "optional": [
        "RTS",
        "DTR",
        "DSR"
      ]
    },
    {
      "id": "UART1",
      "category": "UART",
      "label": "UART1",
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
            "PB12"
          ]
        }
      ],
      "note": "映射组未细分；信号落脚点为手册复用名汇总"
    },
    {
      "id": "UART2",
      "category": "UART",
      "label": "UART2",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB23"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB22"
          ]
        }
      ],
      "note": "映射组未细分；信号落脚点为手册复用名汇总"
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
      ],
      "note": "映射组未细分；信号落脚点为手册复用名汇总"
    },
    {
      "id": "SPI0",
      "category": "SPI",
      "label": "SPI0",
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
          ]
        },
        {
          "id": "slave",
          "label": "从机模式",
          "signals": [
            "SCS",
            "SCK",
            "MOSI",
            "MISO"
          ]
        }
      ],
      "signals": [
        {
          "name": "SCK",
          "pins": [
            "PB13",
            "PA13"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PB14",
            "PA14"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PB15",
            "PA15"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PB12",
            "PA12"
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
            "PB13"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB12"
          ]
        }
      ],
      "note": "映射组未细分"
    },
    {
      "id": "USB_FS",
      "category": "USB",
      "label": "USB FS",
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
      "note": "全速 USB"
    },
    {
      "id": "USB_HS",
      "category": "USB",
      "label": "USB HS",
      "signals": [
        {
          "name": "D-",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PB13"
          ]
        }
      ],
      "note": "高速 USB"
    },
    {
      "id": "ARGB",
      "category": "ARGB",
      "label": "ARGB",
      "signals": [
        {
          "name": "ARGB",
          "pins": [
            "PA9",
            "PB4",
            "PB22"
          ]
        }
      ]
    },
    {
      "id": "LCD",
      "category": "LCD",
      "label": "段式 LCD",
      "optional": [
        "SEG8",
        "SEG10",
        "SEG11",
        "SEG12",
        "SEG13",
        "SEG14",
        "SEG15",
        "SEG16",
        "SEG17",
        "SEG22",
        "SEG23",
        "SEG26",
        "SEG27"
      ],
      "signals": [
        {
          "name": "COM0",
          "pins": [
            "PB4"
          ]
        },
        {
          "name": "COM1",
          "pins": [
            "PB5"
          ]
        },
        {
          "name": "COM2",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "COM3",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "SEG8",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "SEG10",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "SEG11",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "SEG12",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "SEG13",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "SEG14",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "SEG15",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "SEG16",
          "pins": [
            "PB16"
          ]
        },
        {
          "name": "SEG17",
          "pins": [
            "PB17"
          ]
        },
        {
          "name": "SEG22",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "SEG23",
          "pins": [
            "PB23"
          ]
        },
        {
          "name": "SEG26",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "SEG27",
          "pins": [
            "PA13"
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
          "label": "PWM 输出",
          "signals": [
            "TMR0/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入",
          "signals": [
            "TMR0/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数",
          "signals": [
            "TMR0/CNT"
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
          "name": "TMR0/PWM",
          "pins": [
            "PA9",
            "PB23"
          ]
        },
        {
          "name": "TMR0/CAP",
          "pins": [
            "PA9",
            "PB23"
          ]
        },
        {
          "name": "TMR0/CNT",
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
          "label": "PWM 输出",
          "signals": [
            "TMR1/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入",
          "signals": [
            "TMR1/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数",
          "signals": [
            "TMR1/CNT"
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
          "name": "TMR1/PWM",
          "pins": [
            "PA10",
            "PB10"
          ]
        },
        {
          "name": "TMR1/CAP",
          "pins": [
            "PA10",
            "PB10"
          ]
        },
        {
          "name": "TMR1/CNT",
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
          "label": "PWM 输出",
          "signals": [
            "TMR2/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入",
          "signals": [
            "TMR2/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数",
          "signals": [
            "TMR2/CNT"
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
          "name": "TMR2/PWM",
          "pins": [
            "PB11",
            "PA11"
          ]
        },
        {
          "name": "TMR2/CAP",
          "pins": [
            "PB11",
            "PA11"
          ]
        },
        {
          "name": "TMR2/CNT",
          "pins": [
            "PB11",
            "PA11"
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
          "label": "PWM 输出",
          "signals": [
            "TMR3/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入",
          "signals": [
            "TMR3/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数",
          "signals": [
            "TMR3/CNT"
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
          "name": "TMR3/PWM",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "TMR3/CAP",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "TMR3/CNT",
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
            "PA12"
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
            "PA13"
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
          ]
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
          ]
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
      "id": "AIN21",
      "category": "ADC",
      "label": "AIN21 (TK21)",
      "signals": [
        {
          "name": "AIN21",
          "pins": [
            "PB8"
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
