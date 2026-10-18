/* CH586M (QFN48) 芯片数据。事实来源：CH587DS1 V1.0 (2026-07-17)，1.2 逐脚表与型号资源表；复用按信号落脚点汇总建模 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch586m-qfn48",
  "meta": {
    "source": "CH587DS1 V1.0 (2026-07-17)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "CH586M：CH587M 去 USB HS/PD；40 GPIO；QSPI、ARGB、LED、LCD 28×4"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH586M",
    "package": "QFN48"
  },
  "package": {
    "family": "quad",
    "style": "no-lead",
    "pinsPerSide": 12,
    "pitch": 0.35,
    "body": [
      5,
      5
    ],
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "GND (EP)"
  },
  "pins": [
    {
      "num": 1,
      "name": "VDCID",
      "type": "power",
      "alts": []
    },
    {
      "num": 2,
      "name": "VSW",
      "type": "power",
      "alts": []
    },
    {
      "num": 3,
      "name": "VDD33/VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 4,
      "name": "PA7",
      "type": "io",
      "alts": [
        "TXD2",
        "PWM5_",
        "LED6",
        "A11"
      ]
    },
    {
      "num": 5,
      "name": "PA8",
      "type": "io",
      "alts": [
        "RXD1",
        "LED7",
        "A12"
      ]
    },
    {
      "num": 6,
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
      "num": 7,
      "name": "PB9",
      "type": "io",
      "alts": [
        "A20",
        "NFCI"
      ]
    },
    {
      "num": 8,
      "name": "PB8",
      "type": "io",
      "alts": [
        "A21",
        "NFCM"
      ]
    },
    {
      "num": 9,
      "name": "PB17",
      "type": "io",
      "alts": [
        "NFC+"
      ]
    },
    {
      "num": 10,
      "name": "PB16",
      "type": "io",
      "alts": [
        "NFC-"
      ]
    },
    {
      "num": 11,
      "name": "PB15",
      "type": "io",
      "alts": [
        "TCK",
        "MISO_",
        "DTR_"
      ]
    },
    {
      "num": 12,
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
      "num": 13,
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
      "num": 14,
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
      "num": 15,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_",
        "ENC2_2"
      ]
    },
    {
      "num": 16,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_",
        "ENC1_2"
      ]
    },
    {
      "num": 17,
      "name": "PB7",
      "type": "io",
      "alts": [
        "TXD0",
        "PWM9",
        "LEDC_"
      ]
    },
    {
      "num": 18,
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
      "num": 19,
      "name": "PB5",
      "type": "io",
      "alts": [
        "DTR",
        "ENC1_",
        "ADCS1"
      ]
    },
    {
      "num": 20,
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
      "num": 21,
      "name": "PB3",
      "type": "io",
      "alts": [
        "DCD",
        "PWM9_"
      ]
    },
    {
      "num": 22,
      "name": "PB2",
      "type": "io",
      "alts": [
        "QSCSX",
        "PWM8_",
        "RI_"
      ]
    },
    {
      "num": 23,
      "name": "PB1",
      "type": "io",
      "alts": [
        "QSIOX1",
        "PWM7_",
        "DSR"
      ]
    },
    {
      "num": 24,
      "name": "PB0",
      "type": "io",
      "alts": [
        "QSIOX0",
        "PWM6",
        "CTS"
      ]
    },
    {
      "num": 25,
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
      "num": 26,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3",
        "RXD2_1",
        "ARGB_3"
      ]
    },
    {
      "num": 27,
      "name": "PB21",
      "type": "io",
      "alts": [
        "QSIOX2",
        "SCL_1",
        "TXD3_"
      ]
    },
    {
      "num": 28,
      "name": "PB20",
      "type": "io",
      "alts": [
        "QSIOX3",
        "SDA_1",
        "RXD3_"
      ]
    },
    {
      "num": 29,
      "name": "PB19",
      "type": "io",
      "alts": [
        "QSCK",
        "SCK1_"
      ]
    },
    {
      "num": 30,
      "name": "PB18",
      "type": "io",
      "alts": [
        "QSCS",
        "SCS1_"
      ]
    },
    {
      "num": 31,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 32,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 33,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 34,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 35,
      "name": "VDCIA",
      "type": "power",
      "alts": []
    },
    {
      "num": 36,
      "name": "PA4",
      "type": "io",
      "alts": [
        "RXD3",
        "LEDC",
        "A0"
      ]
    },
    {
      "num": 37,
      "name": "PA5",
      "type": "io",
      "alts": [
        "TXD3",
        "LED4",
        "A1"
      ]
    },
    {
      "num": 38,
      "name": "PA6",
      "type": "io",
      "alts": [
        "RXD2",
        "PWM4_",
        "LED5",
        "A10"
      ]
    },
    {
      "num": 39,
      "name": "PA0",
      "type": "io",
      "alts": [
        "SCK1",
        "LED0",
        "A9"
      ]
    },
    {
      "num": 40,
      "name": "PA1",
      "type": "io",
      "alts": [
        "MOSI1",
        "LED1",
        "A8"
      ]
    },
    {
      "num": 41,
      "name": "PA2",
      "type": "io",
      "alts": [
        "TMR3_1",
        "MISO1",
        "RI",
        "LED2",
        "A7"
      ]
    },
    {
      "num": 42,
      "name": "PA3",
      "type": "io",
      "alts": [
        "LED3",
        "SCS1",
        "A6"
      ]
    },
    {
      "num": 43,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "A5"
      ]
    },
    {
      "num": 44,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "A4"
      ]
    },
    {
      "num": 45,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "A3"
      ]
    },
    {
      "num": 46,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "A2"
      ]
    },
    {
      "num": 47,
      "name": "PA11",
      "type": "io",
      "alts": [
        "X32KO",
        "TMR2"
      ]
    },
    {
      "num": 48,
      "name": "PA10",
      "type": "io",
      "alts": [
        "X32KI",
        "TMR1"
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
          "name": "CTS",
          "pins": [
            "PB0"
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
            "PB14",
            "PB1"
          ]
        },
        {
          "name": "RI",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "DCD",
          "pins": [
            "PB3"
          ]
        }
      ],
      "note": "映射组未细分；信号落脚点为手册复用名汇总",
      "optional": [
        "RTS",
        "CTS",
        "DTR",
        "DSR",
        "RI",
        "DCD"
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
            "PA8",
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
            "PA7",
            "PB23"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB22",
            "PA6"
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
            "PB21",
            "PA5"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB20",
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
      "id": "SPI1",
      "category": "SPI",
      "label": "SPI1",
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
            "PB19",
            "PA0"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PB18",
            "PA3"
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
            "PB13",
            "PB21"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB12",
            "PB20"
          ]
        }
      ],
      "note": "映射组未细分"
    },
    {
      "id": "QSPI",
      "category": "QSPI",
      "label": "QSPI",
      "signals": [
        {
          "name": "QSCK",
          "pins": [
            "PB19"
          ]
        },
        {
          "name": "QSCS",
          "pins": [
            "PB2",
            "PB18"
          ]
        },
        {
          "name": "QSIO0",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "QSIO1",
          "pins": [
            "PB1"
          ]
        },
        {
          "name": "QSIO2",
          "pins": [
            "PB21"
          ]
        },
        {
          "name": "QSIO3",
          "pins": [
            "PB20"
          ]
        }
      ],
      "optional": [
        "QSIO1",
        "QSIO2",
        "QSIO3"
      ]
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
      "id": "LED",
      "category": "LED",
      "label": "LED 点阵屏",
      "optional": [
        "LED0",
        "LED1",
        "LED2",
        "LED3",
        "LED4",
        "LED5",
        "LED6",
        "LED7"
      ],
      "signals": [
        {
          "name": "LEDC",
          "pins": [
            "PB7",
            "PA4"
          ]
        },
        {
          "name": "LED0",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "LED1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "LED2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "LED3",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "LED4",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "LED5",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "LED6",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "LED7",
          "pins": [
            "PA8"
          ]
        }
      ]
    },
    {
      "id": "LCD",
      "category": "LCD",
      "label": "段式 LCD",
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
        "SEG19",
        "SEG20",
        "SEG21",
        "SEG22",
        "SEG23",
        "SEG24",
        "SEG25",
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
          "name": "SEG0",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "SEG1",
          "pins": [
            "PB1"
          ]
        },
        {
          "name": "SEG2",
          "pins": [
            "PB2"
          ]
        },
        {
          "name": "SEG3",
          "pins": [
            "PB3"
          ]
        },
        {
          "name": "SEG4",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "SEG5",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "SEG6",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "SEG7",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "SEG8",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "SEG9",
          "pins": [
            "PB9"
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
          "name": "SEG18",
          "pins": [
            "PB18"
          ]
        },
        {
          "name": "SEG19",
          "pins": [
            "PB19"
          ]
        },
        {
          "name": "SEG20",
          "pins": [
            "PB20"
          ]
        },
        {
          "name": "SEG21",
          "pins": [
            "PB21"
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
          "name": "SEG24",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "SEG25",
          "pins": [
            "PA8"
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
            "PB10",
            "PA10"
          ]
        },
        {
          "name": "TMR1/CAP",
          "pins": [
            "PB10",
            "PA10"
          ]
        },
        {
          "name": "TMR1/CNT",
          "pins": [
            "PB10",
            "PA10"
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
            "PA6",
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
            "PA7",
            "PA13"
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
            "PB4",
            "PB1"
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
            "PB6",
            "PB2"
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
            "PB7",
            "PB3"
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
      "id": "AIN6",
      "category": "ADC",
      "label": "AIN6 (TK6)",
      "signals": [
        {
          "name": "AIN6",
          "pins": [
            "PA3"
          ]
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
            "PA2"
          ]
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
            "PA1"
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
            "PA0"
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
      "id": "AIN20",
      "category": "ADC",
      "label": "AIN20 (TK20)",
      "signals": [
        {
          "name": "AIN20",
          "pins": [
            "PB9"
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
