/* CH587D (QFN20) 芯片数据。事实来源：CH587DS1 V1.0 (2026-07-17)，1.2 逐脚表与型号资源表；复用按信号落脚点汇总建模 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch587d-qfn20",
  "meta": {
    "source": "CH587DS1 V1.0 (2026-07-17)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "CH587D：QFN20，12 GPIO；USB FS/HS、ARGB；无 NFC/LED/LCD"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH587D",
    "package": "QFN20"
  },
  "package": {
    "family": "quad",
    "style": "no-lead",
    "pinsPerSide": 5,
    "pitch": 0.4,
    "body": [
      3,
      3
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
      "num": 5,
      "name": "PB15",
      "type": "io",
      "alts": [
        "TCK",
        "MISO_",
        "DTR_"
      ]
    },
    {
      "num": 6,
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
      "num": 7,
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
      "num": 8,
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
      "num": 9,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_",
        "ENC2_2"
      ]
    },
    {
      "num": 10,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_",
        "ENC1_2"
      ]
    },
    {
      "num": 11,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3",
        "RXD2_1",
        "ARGB_3"
      ]
    },
    {
      "num": 12,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 13,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 14,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 15,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 16,
      "name": "VDCIA",
      "type": "power",
      "alts": []
    },
    {
      "num": 17,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "A5"
      ]
    },
    {
      "num": 18,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "A4"
      ]
    },
    {
      "num": 19,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "A3"
      ]
    },
    {
      "num": 20,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "A2"
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
            "PA14"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA15"
          ]
        },
        {
          "name": "DTR",
          "pins": [
            "PB15"
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
            "PB22"
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
            "PA9"
          ]
        },
        {
          "name": "TMR0/CAP",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "TMR0/CNT",
          "pins": [
            "PA9"
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
            "PB10"
          ]
        },
        {
          "name": "TMR1/CAP",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "TMR1/CNT",
          "pins": [
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
            "PB11"
          ]
        },
        {
          "name": "TMR2/CAP",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "TMR2/CNT",
          "pins": [
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
      "id": "GPIO",
      "category": "GPIO",
      "label": "GPIO",
      "perPin": true
    }
  ]
}; });
