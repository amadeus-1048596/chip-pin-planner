/* CH587W (QFN68X7) 芯片数据。事实来源：CH587DS1 V1.0 (2026-07-17)，1.2 逐脚表与型号资源表；复用按信号落脚点汇总建模 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch587w-qfn68x7",
  "meta": {
    "source": "CH587DS1 V1.0 (2026-07-17)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "CH587W：QFN68X7，58 GPIO；USB PD/FS/HS、NFC、QSPI、ARGB、LED、LCD 32×4"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH587W",
    "package": "QFN68X7"
  },
  "package": {
    "family": "quad",
    "style": "no-lead",
    "pinsPerSide": 17,
    "pitch": 0.35,
    "body": [
      7,
      7
    ],
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "GND (EP)"
  },
  "pins": [
    {
      "num": 1,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "A2"
      ]
    },
    {
      "num": 2,
      "name": "PA11",
      "type": "io",
      "alts": [
        "X32KO",
        "TMR2"
      ]
    },
    {
      "num": 3,
      "name": "PA10",
      "type": "io",
      "alts": [
        "X32KI",
        "TMR1"
      ]
    },
    {
      "num": 4,
      "name": "PC5",
      "type": "io",
      "alts": [
        "TMR3_3",
        "RTC",
        "ENC2"
      ]
    },
    {
      "num": 5,
      "name": "VBAT",
      "type": "power",
      "alts": []
    },
    {
      "num": 6,
      "name": "VDCID",
      "type": "power",
      "alts": []
    },
    {
      "num": 7,
      "name": "VSW",
      "type": "power",
      "alts": []
    },
    {
      "num": 8,
      "name": "VDD33/VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 9,
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
      "num": 10,
      "name": "PA8",
      "type": "io",
      "alts": [
        "RXD1",
        "LED7",
        "A12"
      ]
    },
    {
      "num": 11,
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
      "num": 12,
      "name": "PC6",
      "type": "io",
      "alts": [
        "ENC1",
        "A19"
      ]
    },
    {
      "num": 13,
      "name": "PB9",
      "type": "io",
      "alts": [
        "A20",
        "NFCI"
      ]
    },
    {
      "num": 14,
      "name": "PB8",
      "type": "io",
      "alts": [
        "A21",
        "NFCM"
      ]
    },
    {
      "num": 15,
      "name": "PB17",
      "type": "io",
      "alts": [
        "NFC+"
      ]
    },
    {
      "num": 16,
      "name": "PB16",
      "type": "io",
      "alts": [
        "NFC-"
      ]
    },
    {
      "num": 17,
      "name": "PB15",
      "type": "io",
      "alts": [
        "TCK",
        "MISO_",
        "DTR_"
      ]
    },
    {
      "num": 18,
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
      "num": 19,
      "name": "PC7",
      "type": "io",
      "alts": [
        "CC1",
        "RXD2_3"
      ]
    },
    {
      "num": 20,
      "name": "PC8",
      "type": "io",
      "alts": [
        "CC2",
        "TXD2_3"
      ]
    },
    {
      "num": 21,
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
      "num": 22,
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
      "num": 23,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_",
        "ENC2_2"
      ]
    },
    {
      "num": 24,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_",
        "ENC1_2"
      ]
    },
    {
      "num": 25,
      "name": "PC9",
      "type": "io",
      "alts": []
    },
    {
      "num": 26,
      "name": "PC10",
      "type": "io",
      "alts": [
        "LED0_",
        "ADCS0_"
      ]
    },
    {
      "num": 27,
      "name": "PB7",
      "type": "io",
      "alts": [
        "TXD0",
        "PWM9",
        "LEDC_"
      ]
    },
    {
      "num": 28,
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
      "num": 29,
      "name": "PB5",
      "type": "io",
      "alts": [
        "DTR",
        "ENC1_",
        "ADCS1"
      ]
    },
    {
      "num": 30,
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
      "num": 31,
      "name": "PB3",
      "type": "io",
      "alts": [
        "DCD",
        "PWM9_"
      ]
    },
    {
      "num": 32,
      "name": "PC11",
      "type": "io",
      "alts": [
        "PWM10_",
        "LED1_",
        "ADCS1_"
      ]
    },
    {
      "num": 33,
      "name": "PC12",
      "type": "io",
      "alts": [
        "LED2_",
        "ADCS2_"
      ]
    },
    {
      "num": 34,
      "name": "VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 35,
      "name": "PB2",
      "type": "io",
      "alts": [
        "QSCSX",
        "PWM8_",
        "RI_"
      ]
    },
    {
      "num": 36,
      "name": "PB1",
      "type": "io",
      "alts": [
        "QSIOX1",
        "PWM7_",
        "DSR"
      ]
    },
    {
      "num": 37,
      "name": "PB0",
      "type": "io",
      "alts": [
        "QSIOX0",
        "PWM6",
        "CTS"
      ]
    },
    {
      "num": 38,
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
      "num": 39,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3",
        "RXD2_1",
        "ARGB_3"
      ]
    },
    {
      "num": 40,
      "name": "PB21",
      "type": "io",
      "alts": [
        "QSIOX2",
        "SCL_1",
        "TXD3_"
      ]
    },
    {
      "num": 41,
      "name": "PB20",
      "type": "io",
      "alts": [
        "QSIOX3",
        "SDA_1",
        "RXD3_"
      ]
    },
    {
      "num": 42,
      "name": "PB19",
      "type": "io",
      "alts": [
        "QSCK",
        "SCK1_"
      ]
    },
    {
      "num": 43,
      "name": "PB18",
      "type": "io",
      "alts": [
        "QSCS",
        "SCS1_"
      ]
    },
    {
      "num": 44,
      "name": "PC13",
      "type": "io",
      "alts": [
        "PWM11_",
        "LED3_"
      ]
    },
    {
      "num": 45,
      "name": "PC14",
      "type": "io",
      "alts": [
        "QSIO0",
        "MOSI1_",
        "PWM6_",
        "LED4_"
      ]
    },
    {
      "num": 46,
      "name": "PC15",
      "type": "io",
      "alts": [
        "QSIO1",
        "MISO1_",
        "TMR3_2",
        "LED5_"
      ]
    },
    {
      "num": 47,
      "name": "PC16",
      "type": "io",
      "alts": [
        "QSIO2",
        "SCL_3",
        "LED6_"
      ]
    },
    {
      "num": 48,
      "name": "PC17",
      "type": "io",
      "alts": [
        "QSIO3",
        "SDA_3",
        "LED7_"
      ]
    },
    {
      "num": 49,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 50,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 51,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 52,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 53,
      "name": "VDCIA",
      "type": "power",
      "alts": []
    },
    {
      "num": 54,
      "name": "PC0",
      "type": "io",
      "alts": [
        "ARGB",
        "A14"
      ]
    },
    {
      "num": 55,
      "name": "PC1",
      "type": "io",
      "alts": [
        "ENC1_3",
        "SCL_2",
        "A15"
      ]
    },
    {
      "num": 56,
      "name": "PC2",
      "type": "io",
      "alts": [
        "ENC2_3",
        "SDA_2",
        "A16"
      ]
    },
    {
      "num": 57,
      "name": "PA4",
      "type": "io",
      "alts": [
        "RXD3",
        "LEDC",
        "A0"
      ]
    },
    {
      "num": 58,
      "name": "PA5",
      "type": "io",
      "alts": [
        "TXD3",
        "LED4",
        "A1"
      ]
    },
    {
      "num": 59,
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
      "num": 60,
      "name": "PA0",
      "type": "io",
      "alts": [
        "SCK1",
        "LED0",
        "A9"
      ]
    },
    {
      "num": 61,
      "name": "PA1",
      "type": "io",
      "alts": [
        "MOSI1",
        "LED1",
        "A8"
      ]
    },
    {
      "num": 62,
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
      "num": 63,
      "name": "PA3",
      "type": "io",
      "alts": [
        "LED3",
        "SCS1",
        "A6"
      ]
    },
    {
      "num": 64,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "A5"
      ]
    },
    {
      "num": 65,
      "name": "PC3",
      "type": "io",
      "alts": [
        "TXD2_2",
        "A17"
      ]
    },
    {
      "num": 66,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "A4"
      ]
    },
    {
      "num": 67,
      "name": "PC4",
      "type": "io",
      "alts": [
        "RXD2_2",
        "A18"
      ]
    },
    {
      "num": 68,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "A3"
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
            "PC8",
            "PB23",
            "PC3"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PC7",
            "PB22",
            "PA6",
            "PC4"
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
            "PA12",
            "PB12"
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
            "PC14",
            "PA1"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PC15",
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
            "PB21",
            "PC16",
            "PC1"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB12",
            "PB20",
            "PC17",
            "PC2"
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
            "PB0",
            "PC14"
          ]
        },
        {
          "name": "QSIO1",
          "pins": [
            "PB1",
            "PC15"
          ]
        },
        {
          "name": "QSIO2",
          "pins": [
            "PB21",
            "PC16"
          ]
        },
        {
          "name": "QSIO3",
          "pins": [
            "PB20",
            "PC17"
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
      "id": "USB_PD",
      "category": "USB",
      "label": "USB PD",
      "signals": [
        {
          "name": "D-",
          "pins": [
            "PC8"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PC7"
          ]
        }
      ],
      "note": "USB Type-C PD（CC1/CC2）"
    },
    {
      "id": "NFC",
      "category": "NFC",
      "label": "NFC",
      "signals": [
        {
          "name": "NFCI",
          "pins": [
            "PB9"
          ]
        },
        {
          "name": "NFCM",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "NFC+",
          "pins": [
            "PB17"
          ]
        },
        {
          "name": "NFC-",
          "pins": [
            "PB16"
          ]
        }
      ]
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
            "PB22",
            "PC0"
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
            "PC10",
            "PA0"
          ]
        },
        {
          "name": "LED1",
          "pins": [
            "PC11",
            "PA1"
          ]
        },
        {
          "name": "LED2",
          "pins": [
            "PC12",
            "PA2"
          ]
        },
        {
          "name": "LED3",
          "pins": [
            "PC13",
            "PA3"
          ]
        },
        {
          "name": "LED4",
          "pins": [
            "PC14",
            "PA5"
          ]
        },
        {
          "name": "LED5",
          "pins": [
            "PC15",
            "PA6"
          ]
        },
        {
          "name": "LED6",
          "pins": [
            "PA7",
            "PC16"
          ]
        },
        {
          "name": "LED7",
          "pins": [
            "PA8",
            "PC17"
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
        "SEG27",
        "SEG28",
        "SEG29",
        "SEG30",
        "SEG31"
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
        },
        {
          "name": "SEG28",
          "pins": [
            "PC14"
          ]
        },
        {
          "name": "SEG29",
          "pins": [
            "PC15"
          ]
        },
        {
          "name": "SEG30",
          "pins": [
            "PC16"
          ]
        },
        {
          "name": "SEG31",
          "pins": [
            "PC17"
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
            "PA11",
            "PB11"
          ]
        },
        {
          "name": "TMR2/CAP",
          "pins": [
            "PA11",
            "PB11"
          ]
        },
        {
          "name": "TMR2/CNT",
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
            "PB0",
            "PC14"
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
            "PB14",
            "PC11"
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
            "PB23",
            "PC13"
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
      "id": "AIN14",
      "category": "ADC",
      "label": "AIN14 (TK14)",
      "signals": [
        {
          "name": "AIN14",
          "pins": [
            "PC0"
          ]
        }
      ]
    },
    {
      "id": "AIN15",
      "category": "ADC",
      "label": "AIN15 (TK15)",
      "signals": [
        {
          "name": "AIN15",
          "pins": [
            "PC1"
          ]
        }
      ]
    },
    {
      "id": "AIN16",
      "category": "ADC",
      "label": "AIN16 (TK16)",
      "signals": [
        {
          "name": "AIN16",
          "pins": [
            "PC2"
          ]
        }
      ]
    },
    {
      "id": "AIN17",
      "category": "ADC",
      "label": "AIN17 (TK17)",
      "signals": [
        {
          "name": "AIN17",
          "pins": [
            "PC3"
          ]
        }
      ]
    },
    {
      "id": "AIN18",
      "category": "ADC",
      "label": "AIN18 (TK18)",
      "signals": [
        {
          "name": "AIN18",
          "pins": [
            "PC4"
          ]
        }
      ]
    },
    {
      "id": "AIN19",
      "category": "ADC",
      "label": "AIN19 (TK19)",
      "signals": [
        {
          "name": "AIN19",
          "pins": [
            "PC6"
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
