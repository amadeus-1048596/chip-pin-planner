/* CH32V208GBU6 (QFN28) 芯片数据。事实来源：CH32V208DS0 V2.7 (WCH 2026-05-21)，表 3-1 引脚定义、表 2-1 型号资源表 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch32v208gbu6-qfn28",
  "meta": {
    "source": "CH32V208DS0 V2.7 (WCH 2026-05-21)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "QFN28；20 可复用 IO（手册标 21）；8 路 ADC/TKey；2 UART；1 SPI/I2C/CAN；USBD+USBFS；10M ETH"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH32V",
    "name": "CH32V208GBU6",
    "package": "QFN28"
  },
  "package": {
    "style": "no-lead",
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "VSS (EP)",
    "family": "quad",
    "pinsPerSide": 7,
    "pitch": 0.4,
    "body": [
      4,
      4
    ]
  },
  "pins": [
    {
      "num": 1,
      "name": "PC15",
      "type": "io",
      "alts": [
        "OSC32_OUT"
      ],
      "note": "可作 GPIO 或 OSC32 晶振脚"
    },
    {
      "num": 2,
      "name": "OSC_IN",
      "type": "osc",
      "alts": []
    },
    {
      "num": 3,
      "name": "OSC_OUT",
      "type": "osc",
      "alts": []
    },
    {
      "num": 4,
      "name": "VDDA",
      "type": "power",
      "alts": []
    },
    {
      "num": 5,
      "name": "PA0",
      "type": "io",
      "alts": [
        "WKUP",
        "USART2_CTS",
        "ADC_IN0",
        "TIM2_CH1",
        "TIM2_ETR",
        "TIM5_CH1"
      ]
    },
    {
      "num": 6,
      "name": "PA1",
      "type": "io",
      "alts": [
        "USART2_RTS",
        "ADC_IN1",
        "TIM5_CH2",
        "TIM2_CH2"
      ]
    },
    {
      "num": 7,
      "name": "PA2",
      "type": "io",
      "alts": [
        "USART2_TX",
        "TIM5_CH3",
        "ADC_IN2",
        "TIM2_CH3",
        "OPA2_OUT0"
      ]
    },
    {
      "num": 8,
      "name": "PA3",
      "type": "io",
      "alts": [
        "USART2_RX",
        "TIM5_CH4",
        "ADC_IN3",
        "TIM2_CH4",
        "OPA1_OUT0"
      ]
    },
    {
      "num": 9,
      "name": "PA4",
      "type": "io",
      "alts": [
        "SPI1_NSS",
        "USART2_CK",
        "ADC_IN4",
        "OPA2_OUT1"
      ]
    },
    {
      "num": 10,
      "name": "PA5",
      "type": "io",
      "alts": [
        "SPI1_SCK",
        "ADC_IN5",
        "OPA2_CH1N"
      ]
    },
    {
      "num": 11,
      "name": "PA6",
      "type": "io",
      "alts": [
        "SPI1_MISO",
        "ADC_IN6",
        "TIM3_CH1",
        "OPA1_CH1N",
        "TIM1_BKIN"
      ]
    },
    {
      "num": 12,
      "name": "PA7",
      "type": "io",
      "alts": [
        "SPI1_MOSI",
        "ADC_IN7",
        "TIM3_CH2",
        "OPA2_CH1P",
        "TIM1_CH1N"
      ]
    },
    {
      "num": 13,
      "name": "VDD_IO_1",
      "type": "power",
      "alts": []
    },
    {
      "num": 14,
      "name": "PC6",
      "type": "io",
      "alts": [
        "ETH_RXP",
        "TIM3_CH1"
      ]
    },
    {
      "num": 15,
      "name": "PC7",
      "type": "io",
      "alts": [
        "ETH_RXN",
        "TIM3_CH2"
      ]
    },
    {
      "num": 16,
      "name": "PC8",
      "type": "io",
      "alts": [
        "ETH_TXP",
        "TIM3_CH3"
      ]
    },
    {
      "num": 17,
      "name": "PC9",
      "type": "io",
      "alts": [
        "ETH_TXN",
        "TIM3_CH4"
      ]
    },
    {
      "num": 18,
      "name": "PA11",
      "type": "io",
      "alts": [
        "USART1_CTS",
        "USB1_DM",
        "CAN1_RX",
        "TIM1_CH4"
      ]
    },
    {
      "num": 19,
      "name": "PA12",
      "type": "io",
      "alts": [
        "USART1_RTS",
        "USB1_DP",
        "CAN1_TX",
        "TIM1_ETR"
      ]
    },
    {
      "num": 20,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SWDIO"
      ],
      "note": "SDI 两线调试接口；上电默认开启"
    },
    {
      "num": 21,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 22,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 23,
      "name": "PA14",
      "type": "io",
      "alts": [
        "SWCLK"
      ],
      "note": "SDI 两线调试接口；上电默认开启"
    },
    {
      "num": 24,
      "name": "PB6",
      "type": "io",
      "alts": [
        "I2C1_SCL",
        "TIM4_CH1",
        "USB2_DM",
        "USART1_TX"
      ]
    },
    {
      "num": 25,
      "name": "PB7",
      "type": "io",
      "alts": [
        "I2C1_SDA",
        "TIM4_CH2",
        "USB2_DP",
        "USART1_RX"
      ]
    },
    {
      "num": 26,
      "name": "BOOT0",
      "type": "power",
      "alts": [],
      "note": "启动配置输入（非 GPIO）"
    },
    {
      "num": 27,
      "name": "VDD_IO_3",
      "type": "power",
      "alts": []
    },
    {
      "num": 28,
      "name": "PC14",
      "type": "io",
      "alts": [
        "OSC32_IN"
      ],
      "note": "可作 GPIO 或 OSC32 晶振脚"
    },
    {
      "num": "EP",
      "name": "VSS",
      "type": "power",
      "alts": []
    }
  ],
  "globalConfigs": [
    {
      "id": "debug",
      "label": "SDI 两线调试接口",
      "default": true,
      "claims": [
        "PA13",
        "PA14"
      ],
      "note": "上电默认开启；关闭后 PA13/PA14 可作 GPIO"
    },
    {
      "id": "lse",
      "label": "32.768kHz 晶振 (LSE)",
      "default": false,
      "claims": [
        "PC14",
        "PC15"
      ],
      "note": "启用后 PC14/PC15 仅作 OSC32_IN/OSC32_OUT"
    }
  ],
  "resources": [
    {
      "id": "USART1",
      "category": "UART",
      "label": "USART1",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "CTS",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "RTS",
          "pins": [
            "PA12"
          ]
        }
      ],
      "optional": [
        "CTS",
        "RTS"
      ]
    },
    {
      "id": "USART2",
      "category": "UART",
      "label": "USART2",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "CTS",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "RTS",
          "pins": [
            "PA1"
          ]
        }
      ],
      "optional": [
        "CK",
        "CTS",
        "RTS"
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
          ],
          "note": "主机片选 SCS 可选"
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
            "PA5"
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
        }
      ]
    },
    {
      "id": "I2C1",
      "category": "I2C",
      "label": "I2C1",
      "signals": [
        {
          "name": "SCL",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB7"
          ]
        }
      ]
    },
    {
      "id": "CAN1",
      "category": "CAN",
      "label": "CAN1",
      "signals": [
        {
          "name": "RX",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "TX",
          "pins": [
            "PA12"
          ]
        }
      ]
    },
    {
      "id": "USB1",
      "category": "USB",
      "label": "USB1",
      "signals": [
        {
          "name": "D-",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PA12"
          ]
        }
      ],
      "note": "全速 USB 设备（USBD）"
    },
    {
      "id": "USB2",
      "category": "USB",
      "label": "USB2",
      "signals": [
        {
          "name": "D-",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "D+",
          "pins": [
            "PB7"
          ]
        }
      ],
      "note": "全速 USB 主机/设备（USBFS）"
    },
    {
      "id": "ETH",
      "category": "ETH",
      "label": "10M Ethernet",
      "signals": [
        {
          "name": "RXP",
          "pins": [
            "PC6"
          ]
        },
        {
          "name": "RXN",
          "pins": [
            "PC7"
          ]
        },
        {
          "name": "TXP",
          "pins": [
            "PC8"
          ]
        },
        {
          "name": "TXN",
          "pins": [
            "PC9"
          ]
        }
      ]
    },
    {
      "id": "TIM1",
      "category": "TIMER",
      "label": "TIM1",
      "optional": [
        "CH4",
        "CH1N",
        "BKIN"
      ],
      "signals": [
        {
          "name": "CH4",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "CH1N",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "BKIN",
          "pins": [
            "PA6"
          ]
        }
      ],
      "note": "通道/互补/刹车/外部时钟均可独立选用；重映射组合未细分"
    },
    {
      "id": "TIM2",
      "category": "TIMER",
      "label": "TIM2",
      "optional": [
        "CH1",
        "CH2",
        "CH3",
        "CH4"
      ],
      "signals": [
        {
          "name": "CH1",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PA3"
          ]
        }
      ],
      "note": "通道/互补/刹车/外部时钟均可独立选用；重映射组合未细分"
    },
    {
      "id": "TIM3",
      "category": "TIMER",
      "label": "TIM3",
      "optional": [
        "CH1",
        "CH2",
        "CH3",
        "CH4"
      ],
      "signals": [
        {
          "name": "CH1",
          "pins": [
            "PA6",
            "PC6"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA7",
            "PC7"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PC8"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PC9"
          ]
        }
      ],
      "note": "通道/互补/刹车/外部时钟均可独立选用；重映射组合未细分"
    },
    {
      "id": "TIM4",
      "category": "TIMER",
      "label": "TIM4",
      "optional": [
        "CH1",
        "CH2"
      ],
      "signals": [
        {
          "name": "CH1",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PB7"
          ]
        }
      ],
      "note": "通道/互补/刹车/外部时钟均可独立选用；重映射组合未细分"
    },
    {
      "id": "TIM5",
      "category": "TIMER",
      "label": "TIM5",
      "optional": [
        "CH1",
        "CH2",
        "CH3",
        "CH4"
      ],
      "signals": [
        {
          "name": "CH1",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PA3"
          ]
        }
      ],
      "note": "通道/互补/刹车/外部时钟均可独立选用；重映射组合未细分"
    },
    {
      "id": "TIM1_ETR",
      "category": "TIMER",
      "label": "TIM1 ETR",
      "signals": [
        {
          "name": "ETR",
          "pins": [
            "PA12"
          ]
        }
      ],
      "note": "外部时钟输入"
    },
    {
      "id": "TIM2_ETR",
      "category": "TIMER",
      "label": "TIM2 ETR",
      "signals": [
        {
          "name": "ETR",
          "pins": [
            "PA0"
          ]
        }
      ],
      "note": "外部时钟输入"
    },
    {
      "id": "AIN0",
      "category": "ADC",
      "label": "AIN0 (TKey0)",
      "signals": [
        {
          "name": "AIN0",
          "pins": [
            "PA0"
          ]
        }
      ]
    },
    {
      "id": "AIN1",
      "category": "ADC",
      "label": "AIN1 (TKey1)",
      "signals": [
        {
          "name": "AIN1",
          "pins": [
            "PA1"
          ]
        }
      ]
    },
    {
      "id": "AIN2",
      "category": "ADC",
      "label": "AIN2 (TKey2)",
      "signals": [
        {
          "name": "AIN2",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "AIN3",
      "category": "ADC",
      "label": "AIN3 (TKey3)",
      "signals": [
        {
          "name": "AIN3",
          "pins": [
            "PA3"
          ]
        }
      ]
    },
    {
      "id": "AIN4",
      "category": "ADC",
      "label": "AIN4 (TKey4)",
      "signals": [
        {
          "name": "AIN4",
          "pins": [
            "PA4"
          ]
        }
      ]
    },
    {
      "id": "AIN5",
      "category": "ADC",
      "label": "AIN5 (TKey5)",
      "signals": [
        {
          "name": "AIN5",
          "pins": [
            "PA5"
          ]
        }
      ]
    },
    {
      "id": "AIN6",
      "category": "ADC",
      "label": "AIN6 (TKey6)",
      "signals": [
        {
          "name": "AIN6",
          "pins": [
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "AIN7",
      "category": "ADC",
      "label": "AIN7 (TKey7)",
      "signals": [
        {
          "name": "AIN7",
          "pins": [
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "OPA1",
      "category": "OPA",
      "label": "OPA1",
      "optional": [
        "CH1N",
        "OUT0"
      ],
      "signals": [
        {
          "name": "CH1N",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "OUT0",
          "pins": [
            "PA3"
          ]
        }
      ],
      "note": "运放/比较器；输入输出可独立选用"
    },
    {
      "id": "OPA2",
      "category": "OPA",
      "label": "OPA2",
      "optional": [
        "CH1P",
        "CH1N",
        "OUT0",
        "OUT1"
      ],
      "signals": [
        {
          "name": "CH1P",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "CH1N",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "OUT0",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "OUT1",
          "pins": [
            "PA4"
          ]
        }
      ],
      "note": "运放/比较器；输入输出可独立选用"
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
