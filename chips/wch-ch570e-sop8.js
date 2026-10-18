/* CH570E (SOP8) 芯片数据。事实来源：CH572DS1 V1.0 (2025-01-21)，1.2 逐脚表与型号资源表 */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch570e-sop8",
  "meta": {
    "source": "CH572DS1 V1.0 (2025-01-21)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH570E：SOP8，3 GPIO；UART/I2C/TMR；无 SPI/CMP/KeyScan/USB/PWM1-5/BLE"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH57x",
    "name": "CH570E",
    "package": "SOP8"
  },
  "package": {
    "family": "dual",
    "style": "gullwing",
    "pinsPerSide": 4,
    "pitch": 1.27,
    "body": [
      3.9,
      5
    ],
    "pin1": "topLeft",
    "sequence": "ccw-down"
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
      "num": 3,
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
      "num": 4,
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
      "num": 5,
      "name": "XO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 6,
      "name": "XI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 7,
      "name": "GND",
      "type": "power",
      "alts": []
    },
    {
      "num": 8,
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
            "PA7"
          ]
        },
        {
          "name": "CAP_IN1",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "CAP_IN2",
          "pins": [
            "PA7"
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
