/* CH585D (QFN20) 芯片数据。约束事实来源：CH585DS1 V1.6 (2025-12-25)，1.1/1.2 逐脚表与 p1 资源表；QFN20 5/边，pin1 左下 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch585d-qfn20",
  "meta": {
    "source": "CH585DS1 V1.6 (2025-12-25)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH585D：选型表 ADC 4+1；QFN20 引脚表可见 A2-A5/A13 共 5 路外部通道，按引脚表保留，待复核"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH585D",
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
        "TMR0/PWM0/CAP0",
        "TXD1",
        "AIN13"
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
      ],
      "note": "支持5V(5VT)；两线调试接口占用"
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
      ],
      "note": "支持5V(5VT)；两线调试接口占用"
    },
    {
      "num": 7,
      "name": "PB13",
      "type": "io",
      "alts": [
        "U2D+",
        "SCK0_",
        "TXD1_"
      ],
      "note": "USB HS D+"
    },
    {
      "num": 8,
      "name": "PB12",
      "type": "io",
      "alts": [
        "U2D-",
        "SCS_",
        "RXD1_"
      ],
      "note": "USB HS D-"
    },
    {
      "num": 9,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_"
      ],
      "note": "USB FS D+"
    },
    {
      "num": 10,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_"
      ],
      "note": "USB FS D-"
    },
    {
      "num": 11,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3/PWM3/CAP3"
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
          "id": "full",
          "label": "主机·全双工3线",
          "signals": [
            "SCK",
            "MOSI",
            "MISO",
            "SCS"
          ],
          "optional": [
            "SCS"
          ],
          "note": "MISO 为官方定义的输入引脚（浮空/上拉/下拉），不可复用为其他功能；主机片选 SCS 可选（可换用其它引脚）"
        },
        {
          "id": "half",
          "label": "主机·半双工2线",
          "signals": [
            "SCK",
            "MISO",
            "SCS"
          ],
          "optional": [
            "SCS"
          ],
          "note": "手册表7-3：MOSI 未用到，可做通用 I/O；MISO 单线双向（手工切方向）"
        },
        {
          "id": "slave-full",
          "label": "从机·全双工4线",
          "signals": [
            "SCS",
            "SCK",
            "MOSI",
            "MISO"
          ],
          "note": "SPI0 从机模式（SCS 片选输入必选，低电平有效；SCK 转输入；MISO 片选后自动切推挽）"
        },
        {
          "id": "slave-half",
          "label": "从机·半双工3线",
          "signals": [
            "SCS",
            "SCK",
            "MISO"
          ],
          "note": "表7-3：从机半双工，MOSI 未用到，可做通用 I/O"
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
          "note": "从模式片选输入（低有效）；主模式片选输出（可选，可换用其它引脚）"
        }
      ]
    },
    {
      "id": "UART0",
      "category": "UART",
      "label": "UART0",
      "optional": [
        "DTR",
        "DSR"
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
          "note": "MODEM 输出（数据终端就绪）；RB_PIN_MODEM 位与 DSR 同切（PB1/PB5 ↔ PB14/PB15）"
        },
        {
          "name": "DSR",
          "pins": [
            "PB14"
          ],
          "note": "MODEM 输入（数据装置就绪）；RB_PIN_MODEM 位与 DTR 同切"
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
          ],
          "note": "输出期间计数器照常运行，周期中断可直接使用"
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
          ],
          "note": "外部脉冲从该引脚输入（占用该脚，手册计数模式步骤(1)）"
        }
      ],
      "signals": [
        {
          "name": "TMR0/PWM0",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "TMR0/CAP0",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "TMR0/CNT0",
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
          "label": "PWM 输出(PWM1)",
          "signals": [
            "TMR1/PWM1"
          ],
          "note": "输出期间计数器照常运行，周期中断可直接使用"
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
          ],
          "note": "外部脉冲从该引脚输入（占用该脚）"
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
          ],
          "note": "输出期间计数器照常运行，周期中断可直接使用"
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
          ],
          "note": "外部脉冲从该引脚输入（占用该脚）"
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
          ],
          "note": "输出期间计数器照常运行，周期中断可直接使用"
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
          ],
          "note": "外部脉冲从该引脚输入（占用该脚）"
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
      "id": "AIN13",
      "category": "ADC",
      "label": "AIN13",
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
      ]
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
