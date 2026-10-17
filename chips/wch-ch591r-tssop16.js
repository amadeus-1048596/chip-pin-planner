/* CH591R (TSSOP16) 芯片数据。事实来源：CH592DS1 V1.9 (2025-12-24)，1.1/1.2 逐脚表与 p1 资源表 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch591r-tssop16",
  "meta": {
    "source": "CH592DS1 V1.9 (2025-12-24)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH591R：TSSOP16，无 USB/LCD/I2C/TouchKey；ADC 4+1"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH59x",
    "name": "CH591R",
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
        "PWM5",
        "AIN3"
      ]
    },
    {
      "num": 4,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "AIN2"
      ]
    },
    {
      "num": 5,
      "name": "VDD33/VIO33",
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
        "TMR0/PWM0/CAP0",
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
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_"
      ]
    },
    {
      "num": 10,
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
      "num": 11,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3/PWM3/CAP3",
        "RXD2"
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
      "name": "GND",
      "type": "power",
      "alts": []
    },
    {
      "num": 16,
      "name": "ANT",
      "type": "rf",
      "alts": []
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
          ],
          "note": "从模式片选输入（低有效）；主模式片选输出（可选）"
        }
      ]
    },
    {
      "id": "UART0",
      "category": "UART",
      "label": "UART0",
      "optional": [],
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
          ],
          "note": "PB12 的 RXD1_ 在 1.2 表未列，按映射组/同族 CH585 推定，待复核"
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
        }
      ],
      "signals": [
        {
          "name": "TMR1/PWM1",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "TMR1/CAP1",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "TMR1/CNT1",
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
        }
      ],
      "signals": [
        {
          "name": "TMR2/PWM2",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "TMR2/CAP2",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "TMR2/CNT2",
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
      "id": "GPIO",
      "category": "GPIO",
      "label": "GPIO",
      "perPin": true
    }
  ]
};
});
