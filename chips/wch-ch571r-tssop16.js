/* CH571R (TSSOP16) 芯片数据。事实来源：CH573DS1 V2.3 (2023-12-26)，图1-1 与 1.2 引脚说明 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch571r-tssop16",
  "meta": {
    "source": "CH573DS1 V2.3 (2023-12-26)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "TSSOP16；10 GPIO；2 UART；4 ADC；USB 设备；无 PWM4-11/I2C/Touch/LCD；无调试/32K 引脚"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH57x",
    "name": "CH571R",
    "package": "TSSOP16"
  },
  "package": {
    "family": "dual",
    "style": "gullwing",
    "pinsPerSide": 8,
    "pitch": 0.65,
    "body": [
      4.4,
      5
    ],
    "pin1": "topLeft",
    "sequence": "ccw-down"
  },
  "pins": [
    {
      "num": 1,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "AIN5"
      ]
    },
    {
      "num": 2,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "AIN4"
      ]
    },
    {
      "num": 3,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "AIN3"
      ]
    },
    {
      "num": 4,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "AIN2"
      ]
    },
    {
      "num": 5,
      "name": "VIO33/VDD33",
      "type": "power",
      "alts": []
    },
    {
      "num": 6,
      "name": "PA8",
      "type": "io",
      "alts": [
        "RXD1"
      ]
    },
    {
      "num": 7,
      "name": "PA9",
      "type": "io",
      "alts": [
        "TMR0",
        "TXD1"
      ]
    },
    {
      "num": 8,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_"
      ]
    },
    {
      "num": 9,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 10,
      "name": "GND",
      "type": "power",
      "alts": []
    },
    {
      "num": 11,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 12,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 13,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 14,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3"
      ]
    },
    {
      "num": 15,
      "name": "PB23",
      "type": "io",
      "alts": [
        "RST#",
        "TMR0_"
      ]
    },
    {
      "num": 16,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_"
      ]
    }
  ],
  "globalConfigs": [
    {
      "id": "rst",
      "label": "外部复位 RST",
      "default": false,
      "claims": [
        "PB23"
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
            "PA14"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA15"
          ]
        }
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
            "PA9"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA8"
          ]
        }
      ]
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
            "PA13"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PA14"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PA15"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PA12"
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
            "TMR0/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP)",
          "signals": [
            "TMR0/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT)",
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
          "label": "PWM 输出(PWM1)",
          "signals": [
            "TMR1/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP)",
          "signals": [
            "TMR1/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT)",
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
          "label": "PWM 输出(PWM2)",
          "signals": [
            "TMR2/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP)",
          "signals": [
            "TMR2/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT)",
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
          "label": "PWM 输出(PWM3)",
          "signals": [
            "TMR3/PWM"
          ]
        },
        {
          "id": "cap",
          "label": "捕捉输入(CAP)",
          "signals": [
            "TMR3/CAP"
          ]
        },
        {
          "id": "count",
          "label": "外部计数(CNT)",
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
      "id": "AIN2",
      "category": "ADC",
      "label": "AIN2",
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
      "label": "AIN3",
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
      "label": "AIN4",
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
      "label": "AIN5",
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
      "note": "USB 设备（UD+/UD-）；主机能力以型号表为准"
    },
    {
      "id": "GPIO",
      "category": "GPIO",
      "label": "GPIO",
      "perPin": true
    }
  ]
}; });
