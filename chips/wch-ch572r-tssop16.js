/* CH572R (TSSOP16) 芯片数据。事实来源：CH572DS1 V1.0 (2025-01-21)，1.2 逐脚表与型号资源表 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch572r-tssop16",
  "meta": {
    "source": "CH572DS1 V1.0 (2025-01-21)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH572R：TSSOP16，10 GPIO；SPI/CMP/KeyScan/USB；2.4G/BLE"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH57x",
    "name": "CH572R",
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
      "name": "PA9",
      "type": "io",
      "alts": [
        "SDA",
        "TMR_3",
        "RXD_5",
        "CAP_IN1_3",
        "CAP_IN2_2"
      ]
    },
    {
      "num": 2,
      "name": "PA8",
      "type": "io",
      "alts": [
        "TXD_5",
        "SCL",
        "PWM5",
        "RST",
        "KEYSCAN2"
      ]
    },
    {
      "num": 3,
      "name": "PA0",
      "type": "io",
      "alts": [
        "UDM",
        "SWDIO",
        "TXD_3",
        "SCL_1",
        "RXD_2"
      ]
    },
    {
      "num": 4,
      "name": "PA1",
      "type": "io",
      "alts": [
        "UDP",
        "SWCLK",
        "TXD_2",
        "SDA_1",
        "RXD_3"
      ]
    },
    {
      "num": 5,
      "name": "VDD33",
      "type": "power",
      "alts": []
    },
    {
      "num": 6,
      "name": "PA5",
      "type": "io",
      "alts": [
        "SCL_3",
        "SCK"
      ]
    },
    {
      "num": 7,
      "name": "PA6",
      "type": "io",
      "alts": [
        "SDA_3",
        "MISO",
        "RXD_4"
      ]
    },
    {
      "num": 8,
      "name": "PA7",
      "type": "io",
      "alts": [
        "CMP_P1",
        "TXD_4",
        "MOSI",
        "PWM1",
        "TMR",
        "RST_",
        "CAP_IN1",
        "CAP_IN2_1"
      ]
    },
    {
      "num": 9,
      "name": "PA2",
      "type": "io",
      "alts": [
        "CMP_N",
        "TXD_1",
        "SDA_2",
        "PWM2",
        "TMR_1",
        "RXD",
        "SCS_",
        "KEYSCAN0",
        "CAP_IN1_1",
        "CAP_IN2"
      ]
    },
    {
      "num": 10,
      "name": "PA3",
      "type": "io",
      "alts": [
        "CMP_P0",
        "TXD",
        "SCL_2",
        "SCK_",
        "PWM3",
        "RXD_1",
        "KEYSCAN1"
      ]
    },
    {
      "num": 11,
      "name": "PA4",
      "type": "io",
      "alts": [
        "X25MO",
        "PWM4",
        "TMR_2",
        "SCS",
        "CAP_IN1_2",
        "CAP_IN2_3"
      ]
    },
    {
      "num": 12,
      "name": "XO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 13,
      "name": "XI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 14,
      "name": "NC1",
      "type": "power",
      "alts": [],
      "note": "NC 未连接"
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
      "id": "debug",
      "label": "两线调试接口",
      "default": false,
      "claims": [
        "PA0",
        "PA1"
      ],
      "note": "SWDIO/SWCLK；与 USB、部分 UART/I2C 映射共用"
    },
    {
      "id": "rst",
      "label": "外部复位 RST",
      "default": false,
      "claims": [
        "PA7"
      ],
      "note": "RST_ 映射在 PA7；PA8 也有 RST 映射，启用时二选一"
    }
  ],
  "resources": [
    {
      "id": "UART",
      "category": "UART",
      "label": "UART",
      "modes": [
        {
          "id": "default",
          "label": "默认组 (PA3/PA2)",
          "signals": [
            "TXD",
            "RXD"
          ]
        },
        {
          "id": "map1",
          "label": "映射组1 (PA2/PA3)",
          "signals": [
            "TXD_1",
            "RXD_1"
          ]
        },
        {
          "id": "map2",
          "label": "映射组2 (PA1/PA0)",
          "signals": [
            "TXD_2",
            "RXD_2"
          ]
        },
        {
          "id": "map3",
          "label": "映射组3 (PA0/PA1)",
          "signals": [
            "TXD_3",
            "RXD_3"
          ]
        },
        {
          "id": "map4",
          "label": "映射组4 (PA7/PA6)",
          "signals": [
            "TXD_4",
            "RXD_4"
          ]
        },
        {
          "id": "map5",
          "label": "映射组5 (PA8/PA9)",
          "signals": [
            "TXD_5",
            "RXD_5"
          ]
        }
      ],
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "TXD_1",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "RXD_1",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "TXD_2",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "RXD_2",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "TXD_3",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "RXD_3",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "TXD_4",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "RXD_4",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "TXD_5",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "RXD_5",
          "pins": [
            "PA9"
          ]
        }
      ]
    },
    {
      "id": "I2C",
      "category": "I2C",
      "label": "I2C",
      "modes": [
        {
          "id": "default",
          "label": "默认组 (PA8/PA9)",
          "signals": [
            "SCL",
            "SDA"
          ]
        },
        {
          "id": "map1",
          "label": "映射组1 (PA0/PA1)",
          "signals": [
            "SCL_1",
            "SDA_1"
          ]
        },
        {
          "id": "map2",
          "label": "映射组2 (PA3/PA2)",
          "signals": [
            "SCL_2",
            "SDA_2"
          ]
        },
        {
          "id": "map3",
          "label": "映射组3 (PA5/PA6)",
          "signals": [
            "SCL_3",
            "SDA_3"
          ]
        }
      ],
      "signals": [
        {
          "name": "SCL",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "SCL_1",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "SDA_1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "SCL_2",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "SDA_2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "SCL_3",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "SDA_3",
          "pins": [
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "SPI",
      "category": "SPI",
      "label": "SPI",
      "modes": [
        {
          "id": "master-default",
          "label": "主机·默认组",
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
          "id": "slave-default",
          "label": "从机·默认组",
          "signals": [
            "SCS",
            "SCK",
            "MOSI",
            "MISO"
          ]
        },
        {
          "id": "master-map",
          "label": "主机·映射组",
          "signals": [
            "SCK_",
            "MOSI",
            "MISO",
            "SCS_"
          ],
          "optional": [
            "SCS_"
          ]
        },
        {
          "id": "slave-map",
          "label": "从机·映射组",
          "signals": [
            "SCS_",
            "SCK_",
            "MOSI",
            "MISO"
          ]
        }
      ],
      "signals": [
        {
          "name": "SCK",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "SCK_",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "SCS_",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "TMR",
      "category": "TIMER",
      "label": "TMR",
      "modes": [
        {
          "id": "pwm",
          "label": "PWM 输出",
          "signals": [
            "TMR"
          ]
        },
        {
          "id": "cap1",
          "label": "捕捉输入1",
          "signals": [
            "CAP_IN1"
          ]
        },
        {
          "id": "cap2",
          "label": "捕捉输入2",
          "signals": [
            "CAP_IN2"
          ]
        },
        {
          "id": "count",
          "label": "外部计数",
          "signals": [
            "TMR"
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
          "name": "TMR",
          "pins": [
            "PA7",
            "PA2",
            "PA4",
            "PA9"
          ]
        },
        {
          "name": "CAP_IN1",
          "pins": [
            "PA7",
            "PA2",
            "PA4",
            "PA9"
          ]
        },
        {
          "name": "CAP_IN2",
          "pins": [
            "PA2",
            "PA7",
            "PA4",
            "PA9"
          ]
        }
      ]
    },
    {
      "id": "PWM1",
      "category": "PWM",
      "label": "PWM1",
      "signals": [
        {
          "name": "PWM1",
          "pins": [
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "PWM2",
      "category": "PWM",
      "label": "PWM2",
      "signals": [
        {
          "name": "PWM2",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "PWM3",
      "category": "PWM",
      "label": "PWM3",
      "signals": [
        {
          "name": "PWM3",
          "pins": [
            "PA3"
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
            "PA4"
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
            "PA8"
          ]
        }
      ]
    },
    {
      "id": "CMP",
      "category": "CMP",
      "label": "CMP",
      "modes": [
        {
          "id": "p0",
          "label": "正端 P0 (PA3)",
          "signals": [
            "CMP_P0",
            "CMP_N"
          ]
        },
        {
          "id": "p1",
          "label": "正端 P1 (PA7)",
          "signals": [
            "CMP_P1",
            "CMP_N"
          ]
        }
      ],
      "signals": [
        {
          "name": "CMP_P0",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "CMP_P1",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "CMP_N",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "KEYSCAN0",
      "category": "KEYSCAN",
      "label": "KEYSCAN0",
      "signals": [
        {
          "name": "KEYSCAN0",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "KEYSCAN1",
      "category": "KEYSCAN",
      "label": "KEYSCAN1",
      "signals": [
        {
          "name": "KEYSCAN1",
          "pins": [
            "PA3"
          ]
        }
      ]
    },
    {
      "id": "KEYSCAN2",
      "category": "KEYSCAN",
      "label": "KEYSCAN2",
      "signals": [
        {
          "name": "KEYSCAN2",
          "pins": [
            "PA8"
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
            "PA0"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PA1"
          ]
        }
      ],
      "note": "全速 USB 主机/设备（型号表）"
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
