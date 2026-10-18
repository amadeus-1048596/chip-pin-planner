/* CH570Q (DFN10X3) 芯片数据。事实来源：CH572DS1 V1.0 (2025-01-21)，1.2 逐脚表与型号资源表 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch570q-dfn10x3",
  "meta": {
    "source": "CH572DS1 V1.0 (2025-01-21)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH570Q：DFN10X3，5 GPIO；无 SPI/CMP/USB Host/BLE；USB 设备；仅 TMR PWM"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH57x",
    "name": "CH570Q",
    "package": "DFN10X3"
  },
  "package": {
    "family": "dual",
    "style": "gullwing",
    "pinsPerSide": 5,
    "pitch": 0.5,
    "body": [
      3,
      3
    ],
    "pin1": "topLeft",
    "sequence": "ccw-down",
    "thermalPad": "GND (EP)"
  },
  "pins": [
    {
      "num": 1,
      "name": "VDD33",
      "type": "power",
      "alts": []
    },
    {
      "num": 2,
      "name": "V5",
      "type": "power",
      "alts": []
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
      "num": 6,
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
      "num": 7,
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
      "num": 8,
      "name": "XO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 9,
      "name": "XI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 10,
      "name": "ANT",
      "type": "rf",
      "alts": []
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
        }
      ]
    },
    {
      "id": "I2C",
      "category": "I2C",
      "label": "I2C",
      "modes": [
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
        }
      ],
      "signals": [
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
            "PA2"
          ]
        },
        {
          "name": "CAP_IN1",
          "pins": [
            "PA7",
            "PA2"
          ]
        },
        {
          "name": "CAP_IN2",
          "pins": [
            "PA2",
            "PA7"
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
      "note": "USB 设备（型号表）"
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
