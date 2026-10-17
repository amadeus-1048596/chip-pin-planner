/* CH592D (QFN20) 芯片数据。事实来源：CH592DS1 V1.9 (2025-12-24)，1.1/1.2 逐脚表与 p1 资源表 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch592d-qfn20",
  "meta": {
    "source": "CH592DS1 V1.9 (2025-12-24)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH592D：QFN20 裁剪（4 路 ADC/TouchKey，LCD 8×4，2 UART；2 组定时器按可用引脚为 TMR1/TMR2）"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH59x",
    "name": "CH592D",
    "package": "QFN20"
  },
  "package": {
    "style": "no-lead",
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "GND (EP)",
    "family": "quad",
    "pinsPerSide": 5,
    "pitch": 0.4,
    "body": [
      3,
      3
    ]
  },
  "pins": [
    {
      "num": 1,
      "name": "PA11",
      "type": "io",
      "alts": [
        "X32KO",
        "TMR2/PWM2/CAP2"
      ]
    },
    {
      "num": 2,
      "name": "PA10",
      "type": "io",
      "alts": [
        "X32KI",
        "TMR1/PWM1/CAP1"
      ]
    },
    {
      "num": 3,
      "name": "VDCID",
      "type": "power",
      "alts": []
    },
    {
      "num": 4,
      "name": "VSW",
      "type": "power",
      "alts": []
    },
    {
      "num": 5,
      "name": "VDD33/VIO33",
      "type": "power",
      "alts": []
    },
    {
      "num": 6,
      "name": "PB15",
      "type": "io",
      "alts": [
        "TCK",
        "MISO_",
        "SCL",
        "DTR"
      ],
      "note": "支持5V(5VT)；两线调试接口占用"
    },
    {
      "num": 7,
      "name": "PB14",
      "type": "io",
      "alts": [
        "TIO",
        "MOSI_",
        "SDA",
        "PWM10",
        "DSR"
      ],
      "note": "支持5V(5VT)；两线调试接口占用"
    },
    {
      "num": 8,
      "name": "PB13",
      "type": "io",
      "alts": [
        "SCK0_",
        "TXD1_",
        "DCD_"
      ],
      "note": "支持5V(5VT)"
    },
    {
      "num": 9,
      "name": "PB12",
      "type": "io",
      "alts": [
        "SCS_",
        "RXD1_"
      ],
      "note": "支持5V(5VT)；RXD1_ 在 1.2 表未列，按 UART1 映射组/同族 CH585 推定，待复核"
    },
    {
      "num": 10,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_"
      ]
    },
    {
      "num": 11,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_"
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
        "AIN5"
      ]
    },
    {
      "num": 18,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "AIN4"
      ]
    },
    {
      "num": 19,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "AIN3"
      ]
    },
    {
      "num": 20,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "AIN2"
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
        "PB14",
        "PB15"
      ],
      "note": "关闭后释放 PB14/PB15，但失去调试与两线下载（仍可 USB ISP）"
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
      "optional": [
        "DTR",
        "DSR",
        "DCD"
      ],
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
          "name": "DCD",
          "pins": [
            "PB13"
          ],
          "note": "MODEM 输入（载波检测）"
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
            "PB13"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB12"
          ],
          "note": "PB12 的 RXD1_ 在 1.2 表未列，按映射组/同族 CH585 推定，待复核"
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
          ],
          "note": "PB15 与两线调试口共用；使用 I2C 需关闭调试接口"
        },
        {
          "name": "SDA",
          "pins": [
            "PB14"
          ],
          "note": "PB14 与两线调试口共用；使用 I2C 需关闭调试接口"
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
          ],
          "note": "PB14 与两线调试口共用；使用 PWM10 需关闭调试接口"
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
      "note": "COM2/COM3（PB14/PB15）与两线调试口共用；使用 LCD 需关闭调试接口",
      "optional": [
        "SEG6",
        "SEG7",
        "SEG8",
        "SEG9",
        "SEG10",
        "SEG11",
        "SEG14",
        "SEG15"
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
