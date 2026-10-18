/* CH32V208CBU6 (QFN48) 芯片数据。事实来源：CH32V208DS0 V2.7 (WCH 2026-05-21)，表 3-1 引脚定义、表 2-1 型号资源表 */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "ch32v208cbu6-qfn48",
  "meta": {
    "source": "CH32V208DS0 V2.7 (WCH 2026-05-21)",
    "author": "MeowG",
    "date": "2026-10-18",
    "note": "QFN48；35 IO；10 路 ADC/TKey；4 UART；2 SPI/I2C；USBD+USBFS；无 ETH"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH32V",
    "name": "CH32V208CBU6",
    "package": "QFN48"
  },
  "package": {
    "style": "no-lead",
    "pin1": "bottomLeft",
    "sequence": "ccw-up",
    "thermalPad": "VSS (EP)",
    "family": "quad",
    "pinsPerSide": 12,
    "pitch": 0.35,
    "body": [
      5,
      5
    ]
  },
  "pins": [
    {
      "num": 1,
      "name": "PC13",
      "type": "io",
      "alts": [
        "TAMPER-RTC"
      ]
    },
    {
      "num": 2,
      "name": "PC14",
      "type": "io",
      "alts": [
        "OSC32_IN"
      ],
      "note": "可作 GPIO 或 OSC32 晶振脚"
    },
    {
      "num": 3,
      "name": "PC15",
      "type": "io",
      "alts": [
        "OSC32_OUT"
      ],
      "note": "可作 GPIO 或 OSC32 晶振脚"
    },
    {
      "num": 4,
      "name": "VSSA",
      "type": "power",
      "alts": []
    },
    {
      "num": 5,
      "name": "OSC_IN",
      "type": "osc",
      "alts": []
    },
    {
      "num": 6,
      "name": "OSC_OUT",
      "type": "osc",
      "alts": []
    },
    {
      "num": 7,
      "name": "NRST",
      "type": "power",
      "alts": [],
      "note": "专用复位输入（非 GPIO）"
    },
    {
      "num": 8,
      "name": "VDDA",
      "type": "power",
      "alts": []
    },
    {
      "num": 9,
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
      "num": 10,
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
      "num": 11,
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
      "num": 12,
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
      "num": 13,
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
      "num": 14,
      "name": "PA5",
      "type": "io",
      "alts": [
        "SPI1_SCK",
        "ADC_IN5",
        "OPA2_CH1N"
      ]
    },
    {
      "num": 15,
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
      "num": 16,
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
      "num": 17,
      "name": "PB0",
      "type": "io",
      "alts": [
        "ADC_IN8",
        "TIM3_CH3",
        "OPA1_CH1P",
        "TIM1_CH2N",
        "UART4_TX"
      ]
    },
    {
      "num": 18,
      "name": "PB1",
      "type": "io",
      "alts": [
        "ADC_IN9",
        "TIM3_CH4",
        "OPA1_OUT1",
        "TIM1_CH3N",
        "UART4_RX"
      ]
    },
    {
      "num": 19,
      "name": "PB2",
      "type": "io",
      "alts": [
        "BOOT1"
      ],
      "note": "BOOT1 启动配置"
    },
    {
      "num": 20,
      "name": "PB10",
      "type": "io",
      "alts": [
        "I2C2_SCL",
        "USART3_TX",
        "OPA2_CH0N",
        "TIM2_CH3"
      ]
    },
    {
      "num": 21,
      "name": "PB11",
      "type": "io",
      "alts": [
        "I2C2_SDA",
        "USART3_RX",
        "OPA1_CH0N",
        "TIM2_CH4"
      ]
    },
    {
      "num": 22,
      "name": "VDD_IO_1",
      "type": "power",
      "alts": []
    },
    {
      "num": 23,
      "name": "PB12",
      "type": "io",
      "alts": [
        "SPI2_NSS",
        "I2C2_SMBA",
        "USART3_CK",
        "TIM1_BKIN"
      ]
    },
    {
      "num": 24,
      "name": "PB13",
      "type": "io",
      "alts": [
        "SPI2_SCK",
        "TIM1_CH1N",
        "USART3_CTS"
      ]
    },
    {
      "num": 25,
      "name": "PB14",
      "type": "io",
      "alts": [
        "SPI2_MISO",
        "TIM1_CH2N",
        "USART3_RTS",
        "OPA2_CH0P"
      ]
    },
    {
      "num": 26,
      "name": "PB15",
      "type": "io",
      "alts": [
        "SPI2_MOSI",
        "TIM1_CH3N",
        "OPA1_CH0P"
      ]
    },
    {
      "num": 27,
      "name": "PA8",
      "type": "io",
      "alts": [
        "USART1_CK",
        "TIM1_CH1",
        "MCO"
      ]
    },
    {
      "num": 28,
      "name": "PA9",
      "type": "io",
      "alts": [
        "USART1_TX",
        "TIM1_CH2"
      ]
    },
    {
      "num": 29,
      "name": "PA10",
      "type": "io",
      "alts": [
        "USART1_RX",
        "TIM1_CH3"
      ]
    },
    {
      "num": 30,
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
      "num": 31,
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
      "num": 32,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SWDIO"
      ],
      "note": "SDI 两线调试接口；上电默认开启"
    },
    {
      "num": 33,
      "name": "VINTA",
      "type": "power",
      "alts": []
    },
    {
      "num": 34,
      "name": "ANT",
      "type": "rf",
      "alts": []
    },
    {
      "num": 35,
      "name": "VSS_2",
      "type": "power",
      "alts": []
    },
    {
      "num": 36,
      "name": "PA14",
      "type": "io",
      "alts": [
        "SWCLK"
      ],
      "note": "SDI 两线调试接口；上电默认开启"
    },
    {
      "num": 37,
      "name": "PA15",
      "type": "io",
      "alts": [
        "TIM2_CH1",
        "TIM2_ETR",
        "SPI1_NSS"
      ]
    },
    {
      "num": 38,
      "name": "PB3",
      "type": "io",
      "alts": [
        "TIM2_CH2",
        "SPI1_SCK"
      ]
    },
    {
      "num": 39,
      "name": "PB4",
      "type": "io",
      "alts": [
        "TIM3_CH1",
        "SPI1_MISO"
      ]
    },
    {
      "num": 40,
      "name": "PB5",
      "type": "io",
      "alts": [
        "I2C1_SMBA",
        "TIM3_CH2",
        "SPI1_MOSI"
      ]
    },
    {
      "num": 41,
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
      "num": 42,
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
      "num": 43,
      "name": "BOOT0",
      "type": "power",
      "alts": [],
      "note": "启动配置输入（非 GPIO）"
    },
    {
      "num": 44,
      "name": "PB8",
      "type": "io",
      "alts": [
        "TIM4_CH3",
        "I2C1_SCL",
        "CAN1_RX"
      ]
    },
    {
      "num": 45,
      "name": "PB9",
      "type": "io",
      "alts": [
        "TIM4_CH4",
        "I2C1_SDA",
        "CAN1_TX"
      ]
    },
    {
      "num": 46,
      "name": "VSS_3",
      "type": "power",
      "alts": []
    },
    {
      "num": 47,
      "name": "VDD_IO_3",
      "type": "power",
      "alts": []
    },
    {
      "num": 48,
      "name": "VBAT",
      "type": "power",
      "alts": []
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
            "PA9",
            "PB6"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA10",
            "PB7"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PA8"
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
        "CK",
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
      "id": "USART3",
      "category": "UART",
      "label": "USART3",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "CTS",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "RTS",
          "pins": [
            "PB14"
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
      "id": "UART4",
      "category": "UART",
      "label": "UART4",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB1"
          ]
        }
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
            "PA5",
            "PB3"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PA7",
            "PB5"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PA6",
            "PB4"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PA4",
            "PA15"
          ]
        }
      ]
    },
    {
      "id": "SPI2",
      "category": "SPI",
      "label": "SPI2",
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
            "PB13"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "SCS",
          "pins": [
            "PB12"
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
            "PB6",
            "PB8"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB7",
            "PB9"
          ]
        },
        {
          "name": "SMBA",
          "pins": [
            "PB5"
          ],
          "note": "SMBus 报警（可选）"
        }
      ],
      "optional": [
        "SMBA"
      ]
    },
    {
      "id": "I2C2",
      "category": "I2C",
      "label": "I2C2",
      "signals": [
        {
          "name": "SCL",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "SMBA",
          "pins": [
            "PB12"
          ],
          "note": "SMBus 报警（可选）"
        }
      ],
      "optional": [
        "SMBA"
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
            "PA11",
            "PB8"
          ]
        },
        {
          "name": "TX",
          "pins": [
            "PA12",
            "PB9"
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
      "id": "TIM1",
      "category": "TIMER",
      "label": "TIM1",
      "optional": [
        "CH1",
        "CH2",
        "CH3",
        "CH4",
        "CH1N",
        "CH2N",
        "CH3N",
        "BKIN"
      ],
      "signals": [
        {
          "name": "CH1",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA10"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "CH1N",
          "pins": [
            "PB13",
            "PA7"
          ]
        },
        {
          "name": "CH2N",
          "pins": [
            "PB14",
            "PB0"
          ]
        },
        {
          "name": "CH3N",
          "pins": [
            "PB15",
            "PB1"
          ]
        },
        {
          "name": "BKIN",
          "pins": [
            "PB12",
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
            "PA0",
            "PA15"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA1",
            "PB3"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA2",
            "PB10"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PA3",
            "PB11"
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
            "PB4"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA7",
            "PB5"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PB1"
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
        "CH2",
        "CH3",
        "CH4"
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
        },
        {
          "name": "CH3",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "CH4",
          "pins": [
            "PB9"
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
            "PA0",
            "PA15"
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
      "id": "AIN8",
      "category": "ADC",
      "label": "AIN8 (TKey8)",
      "signals": [
        {
          "name": "AIN8",
          "pins": [
            "PB0"
          ]
        }
      ]
    },
    {
      "id": "AIN9",
      "category": "ADC",
      "label": "AIN9 (TKey9)",
      "signals": [
        {
          "name": "AIN9",
          "pins": [
            "PB1"
          ]
        }
      ]
    },
    {
      "id": "OPA1",
      "category": "OPA",
      "label": "OPA1",
      "optional": [
        "CH0P",
        "CH0N",
        "CH1P",
        "CH1N",
        "OUT0",
        "OUT1"
      ],
      "signals": [
        {
          "name": "CH0P",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "CH0N",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "CH1P",
          "pins": [
            "PB0"
          ]
        },
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
        },
        {
          "name": "OUT1",
          "pins": [
            "PB1"
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
        "CH0P",
        "CH0N",
        "CH1P",
        "CH1N",
        "OUT0",
        "OUT1"
      ],
      "signals": [
        {
          "name": "CH0P",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "CH0N",
          "pins": [
            "PB10"
          ]
        },
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
