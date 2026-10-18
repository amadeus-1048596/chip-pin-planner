/* CH571K (ESSOP10) 芯片数据。事实来源：CH573DS1 V2.3 (2023-12-26)，图1-1 与 1.2 引脚说明 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch571k-essop10",
  "meta": {
    "source": "CH573DS1 V2.3 (2023-12-26)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "ESSOP10；4 GPIO；1 UART；4 ADC；无 Timer/PWM/USB/I2C/Touch/LCD；EP 可选但建议连接；body 长度按标准 SOP-10 取 4.9mm，待复核"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH57x",
    "name": "CH571K",
    "package": "ESSOP10"
  },
  "package": {
    "family": "dual",
    "style": "gullwing",
    "pinsPerSide": 5,
    "pitch": 1,
    "body": [
      3.9,
      4.9
    ],
    "pin1": "topLeft",
    "sequence": "ccw-down",
    "thermalPad": "GND (EP)"
  },
  "pins": [
    {
      "num": 1,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "AIN2"
      ]
    },
    {
      "num": 2,
      "name": "VDD33",
      "type": "power",
      "alts": []
    },
    {
      "num": 3,
      "name": "GND",
      "type": "power",
      "alts": []
    },
    {
      "num": 4,
      "name": "X32MI",
      "type": "osc",
      "alts": []
    },
    {
      "num": 5,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 6,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 7,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 8,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "AIN5"
      ]
    },
    {
      "num": 9,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "AIN4"
      ]
    },
    {
      "num": 10,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "AIN3"
      ]
    },
    {
      "num": "EP",
      "name": "GND (EP)",
      "type": "power",
      "alts": []
    }
  ],
  "globalConfigs": [],
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
}; });
