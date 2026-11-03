/* GD32F503RET6 (LQFP64) 芯片数据。事实来源：GD32F503xx Datasheet Rev0.9RC6 (GigaDevice 2026-03) 表 2-5/2-11~2-15 + GD32F50x User Manual Rev1.4 (GigaDevice 2026-05) */
(function (root, factory) { var def = factory(); if (typeof module !== "undefined" && module.exports) { module.exports = def; } else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); } })(typeof self !== "undefined" ? self : this, function () { "use strict"; return {
  "schemaVersion": 2,
  "id": "gd32f503ret6-lqfp64",
  "meta": {
    "source": "GD32F503xx Datasheet Rev0.9RC6 (GigaDevice 2026-03) + GD32F50x User Manual Rev1.4 (GigaDevice 2026-05)",
    "author": "MeowG",
    "date": "2026-11-03",
    "note": "LQFP64；工业级 -40~+85°C；51 GPIO（29 个 5V 容忍）；512KB Flash / 64KB SRAM；18 路 ADC；2×CAN-FD；USBFS。数据手册 Rev0.9RC6 为预发布版本；引脚定义表 2-5 与复用表 2-11~2-15 已逐脚交叉核对，PD0/PD1 的 CAN0/EXMC 复用仅见复用表，表 2-5 未列。"
  },
  "chip": {
    "vendor": "GigaDevice",
    "series": "GD32F5xx",
    "name": "GD32F503RET6",
    "package": "LQFP64"
  },
  "package": {
    "style": "gullwing",
    "pin1": "topLeft",
    "sequence": "ccw-down",
    "family": "quad",
    "pinsPerSide": 16,
    "pitch": 0.5,
    "body": [
      10,
      10
    ]
  },
  "pins": [
    {
      "num": 1,
      "name": "VBAT",
      "type": "power",
      "alts": []
    },
    {
      "num": 2,
      "name": "PC13",
      "type": "io",
      "alts": [
        "EVENTOUT",
        "TAMPER-RTC"
      ],
      "note": "TAMPER-RTC 复用；VBAT 供电域"
    },
    {
      "num": 3,
      "name": "PC14",
      "type": "io",
      "alts": [
        "OSC32IN",
        "EVENTOUT"
      ],
      "note": "LXTAL 输入 OSC32IN；关闭 LXTAL 后可作 PC14；VBAT 供电域"
    },
    {
      "num": 4,
      "name": "PC15",
      "type": "io",
      "alts": [
        "OSC32OUT",
        "EVENTOUT"
      ],
      "note": "LXTAL 输出 OSC32OUT；关闭 LXTAL 后可作 PC15；VBAT 供电域"
    },
    {
      "num": 5,
      "name": "PD0",
      "type": "io",
      "alts": [
        "OSCIN",
        "CAN0_RX",
        "EXMC_D2",
        "EVENTOUT"
      ],
      "note": "HXTAL 输入 OSCIN；关闭 HXTAL 后可作 PD0（CAN0_RX/EXMC_D2）"
    },
    {
      "num": 6,
      "name": "PD1",
      "type": "io",
      "alts": [
        "OSCOUT",
        "CAN0_TX",
        "EXMC_D3",
        "EVENTOUT"
      ],
      "note": "HXTAL 输出 OSCOUT；关闭 HXTAL 后可作 PD1（CAN0_TX/EXMC_D3）"
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
      "name": "PC0",
      "type": "io",
      "alts": [
        "TIMER7_CH0_ON",
        "EXMC_NL",
        "EXMC_NADV",
        "EVENTOUT",
        "ADC012_IN10"
      ]
    },
    {
      "num": 9,
      "name": "PC1",
      "type": "io",
      "alts": [
        "TIMER7_CH1_ON",
        "EVENTOUT",
        "ADC012_IN11"
      ]
    },
    {
      "num": 10,
      "name": "PC2",
      "type": "io",
      "alts": [
        "TIMER7_CH2_ON",
        "EXMC_NWE",
        "EVENTOUT",
        "ADC012_IN12"
      ]
    },
    {
      "num": 11,
      "name": "PC3",
      "type": "io",
      "alts": [
        "TIMER7_CH3_ON",
        "EVENTOUT",
        "ADC012_IN13"
      ]
    },
    {
      "num": 12,
      "name": "VSSA/VREFN",
      "type": "power",
      "alts": [],
      "note": "VREFN 与 VSSA 共用引脚"
    },
    {
      "num": 13,
      "name": "VDDA/VREFP",
      "type": "power",
      "alts": [],
      "note": "VREFP 与 VDDA 共用引脚"
    },
    {
      "num": 14,
      "name": "PA0",
      "type": "io",
      "alts": [
        "USART1_CTS",
        "TIMER1_CH0",
        "TIMER1_ETI",
        "TIMER16_BRKIN",
        "TIMER4_CH0",
        "TIMER7_ETI",
        "CMP0_OUT",
        "TRGSEL_IN5",
        "EVENTOUT",
        "ADC012_IN0",
        "WKUP"
      ],
      "note": "WKUP 唤醒输入"
    },
    {
      "num": 15,
      "name": "PA1",
      "type": "io",
      "alts": [
        "USART1_RTS",
        "TIMER1_CH1",
        "TIMER16_MCH0",
        "TIMER4_CH1",
        "CMP0_OUT",
        "TRGSEL_IN6",
        "EVENTOUT",
        "ADC012_IN1"
      ]
    },
    {
      "num": 16,
      "name": "PA2",
      "type": "io",
      "alts": [
        "USART1_TX",
        "TIMER1_CH2",
        "TIMER16_CH0",
        "TIMER4_CH2",
        "SPI0_IO2",
        "TRGSEL_OUT0",
        "EXMC_D4",
        "EVENTOUT",
        "ADC012_IN2",
        "CMP0_IM2"
      ]
    },
    {
      "num": 17,
      "name": "PA3",
      "type": "io",
      "alts": [
        "USART1_RX",
        "TIMER1_CH3",
        "TIMER16_CH1",
        "TIMER4_CH3",
        "TIMER0_CH3_ON",
        "SPI0_IO3",
        "TRGSEL_OUT1",
        "EXMC_D5",
        "EVENTOUT",
        "ADC012_IN3"
      ]
    },
    {
      "num": 18,
      "name": "VSS_1",
      "type": "power",
      "alts": []
    },
    {
      "num": 19,
      "name": "VDD_1",
      "type": "power",
      "alts": []
    },
    {
      "num": 20,
      "name": "PA4",
      "type": "io",
      "alts": [
        "SPI0_NSS",
        "USART1_CK",
        "SPI2_NSS",
        "I2S2_WS",
        "TIMER15_BRKIN",
        "TIMER7_CH1BRKIN",
        "EXMC_D6",
        "EVENTOUT",
        "ADC01_IN4",
        "DAC0_OUT0",
        "CMP0_IM0"
      ]
    },
    {
      "num": 21,
      "name": "PA5",
      "type": "io",
      "alts": [
        "SPI0_SCK",
        "TIMER4_ETI",
        "TIMER15_MCH0",
        "TIMER7_CH0BRKIN",
        "EXMC_D7",
        "EVENTOUT",
        "ADC01_IN5",
        "DAC0_OUT0",
        "CMP0_IM1"
      ]
    },
    {
      "num": 22,
      "name": "PA6",
      "type": "io",
      "alts": [
        "SPI0_MISO",
        "TIMER2_CH0",
        "TIMER0_BRKIN",
        "TIMER15_CH0",
        "TIMER7_BRKIN",
        "CMP0_OUT",
        "TRGSEL_OUT2",
        "EVENTOUT",
        "ADC01_IN6"
      ]
    },
    {
      "num": 23,
      "name": "PA7",
      "type": "io",
      "alts": [
        "SPI0_MOSI",
        "TIMER2_CH1",
        "TIMER0_CH0_ON",
        "TIMER15_CH1",
        "TIMER7_CH0_ON",
        "TRGSEL_OUT3",
        "EVENTOUT",
        "ADC01_IN7",
        "CMP0_IP"
      ]
    },
    {
      "num": 24,
      "name": "PC4",
      "type": "io",
      "alts": [
        "TIMER7_CH3",
        "EXMC_NE0",
        "EVENTOUT",
        "ADC01_IN14"
      ]
    },
    {
      "num": 25,
      "name": "PC5",
      "type": "io",
      "alts": [
        "EXMC_NOE",
        "EVENTOUT",
        "ADC01_IN15"
      ]
    },
    {
      "num": 26,
      "name": "PB0",
      "type": "io",
      "alts": [
        "TIMER0_CH1_ON",
        "TIMER2_CH2",
        "TIMER7_CH1_ON",
        "CMP0_OUT",
        "EVENTOUT",
        "ADC01_IN8"
      ]
    },
    {
      "num": 27,
      "name": "PB1",
      "type": "io",
      "alts": [
        "TIMER0_CH2_ON",
        "TIMER2_CH3",
        "TIMER7_CH2_ON",
        "CMP0_OUT",
        "EVENTOUT",
        "ADC01_IN9"
      ]
    },
    {
      "num": 28,
      "name": "PB2",
      "type": "io",
      "alts": [
        "BOOT1",
        "EVENTOUT"
      ],
      "note": "BOOT1 启动配置；复位采样后可作 GPIO"
    },
    {
      "num": 29,
      "name": "PB10",
      "type": "io",
      "alts": [
        "TIMER1_CH2",
        "USART2_TX",
        "I2C1_SCL",
        "TIMER0_CH0BRKIN",
        "EVENTOUT",
        "ADC2_IN15",
        "ADC1_IN16"
      ]
    },
    {
      "num": 30,
      "name": "PB11",
      "type": "io",
      "alts": [
        "TIMER1_CH3",
        "USART2_RX",
        "I2C1_SDA",
        "TIMER0_CH1BRKIN",
        "TRGSEL_IN1",
        "EVENTOUT",
        "ADC2_IN16",
        "ADC1_IN17"
      ]
    },
    {
      "num": 31,
      "name": "VSS_2",
      "type": "power",
      "alts": []
    },
    {
      "num": 32,
      "name": "VDD_2",
      "type": "power",
      "alts": []
    },
    {
      "num": 33,
      "name": "PB12",
      "type": "io",
      "alts": [
        "USART2_CK",
        "SPI1_NSS",
        "I2S1_WS",
        "I2C1_SMBA",
        "CAN1_RX",
        "TIMER0_BRKIN",
        "TIMER16_CH0",
        "EXMC_D13",
        "EVENTOUT"
      ]
    },
    {
      "num": 34,
      "name": "PB13",
      "type": "io",
      "alts": [
        "USART2_CTS",
        "SPI1_SCK",
        "I2S1_CK",
        "TIMER0_CH0_ON",
        "CAN1_TX",
        "TIMER16_CH1",
        "EVENTOUT"
      ]
    },
    {
      "num": 35,
      "name": "PB14",
      "type": "io",
      "alts": [
        "USART2_RTS",
        "SPI1_MISO",
        "TIMER0_CH1_ON",
        "TIMER15_CH0",
        "EXMC_D0",
        "EVENTOUT"
      ]
    },
    {
      "num": 36,
      "name": "PB15",
      "type": "io",
      "alts": [
        "SPI1_MOSI",
        "I2S1_SD",
        "TIMER0_CH2_ON",
        "TIMER15_CH1",
        "EVENTOUT"
      ]
    },
    {
      "num": 37,
      "name": "PC6",
      "type": "io",
      "alts": [
        "TIMER2_CH0",
        "I2S1_MCK",
        "TIMER7_CH0",
        "EXMC_D1",
        "EVENTOUT"
      ]
    },
    {
      "num": 38,
      "name": "PC7",
      "type": "io",
      "alts": [
        "TIMER2_CH1",
        "I2S2_MCK",
        "TIMER7_CH3_ON",
        "TIMER7_CH1",
        "EVENTOUT"
      ]
    },
    {
      "num": 39,
      "name": "PC8",
      "type": "io",
      "alts": [
        "TIMER2_CH2",
        "TIMER7_CH2",
        "EVENTOUT"
      ]
    },
    {
      "num": 40,
      "name": "PC9",
      "type": "io",
      "alts": [
        "TIMER2_CH3",
        "TIMER7_CH3",
        "EXMC_NL",
        "EXMC_NADV",
        "EVENTOUT"
      ]
    },
    {
      "num": 41,
      "name": "PA8",
      "type": "io",
      "alts": [
        "USART0_CK",
        "TIMER0_CH0",
        "USBFS_SOF",
        "CK_OUT",
        "TIMER7_CH0BRKIN",
        "CTC_SYNC",
        "TRGSEL_OUT4",
        "EVENTOUT"
      ]
    },
    {
      "num": 42,
      "name": "PA9",
      "type": "io",
      "alts": [
        "USART0_TX",
        "TIMER0_CH1",
        "TIMER7_CH1BRKIN",
        "TRGSEL_OUT5",
        "EVENTOUT"
      ]
    },
    {
      "num": 43,
      "name": "PA10",
      "type": "io",
      "alts": [
        "USART0_RX",
        "TIMER0_CH2",
        "TIMER0_CH3_ON",
        "TIMER15_BRKIN",
        "TIMER15_CH1",
        "TIMER7_CH2BRKIN",
        "EVENTOUT"
      ]
    },
    {
      "num": 44,
      "name": "PA11",
      "type": "io",
      "alts": [
        "USART0_CTS",
        "CAN0_RX",
        "TIMER0_CH3",
        "TIMER7_CH0",
        "TIMER15_CH0",
        "TRGSEL_IN0",
        "EVENTOUT",
        "USBFS_DM"
      ]
    },
    {
      "num": 45,
      "name": "PA12",
      "type": "io",
      "alts": [
        "USART0_RTS",
        "CAN0_TX",
        "TIMER0_ETI",
        "TIMER7_CH1",
        "TIMER15_MCH0",
        "EVENTOUT",
        "USBFS_DP"
      ]
    },
    {
      "num": 46,
      "name": "PA13",
      "type": "io",
      "alts": [
        "JTMS",
        "SWDIO",
        "EVENTOUT"
      ],
      "note": "SWDIO/JTMS；复位后默认调试口"
    },
    {
      "num": 47,
      "name": "VSS_3",
      "type": "power",
      "alts": []
    },
    {
      "num": 48,
      "name": "VDD_3",
      "type": "power",
      "alts": []
    },
    {
      "num": 49,
      "name": "PA14",
      "type": "io",
      "alts": [
        "JTCK",
        "SWCLK",
        "EVENTOUT"
      ],
      "note": "SWCLK/JTCK；复位后默认调试口"
    },
    {
      "num": 50,
      "name": "PA15",
      "type": "io",
      "alts": [
        "JTDI",
        "TIMER1_CH0",
        "TIMER1_ETI",
        "SPI0_NSS",
        "SPI2_NSS",
        "I2S2_WS",
        "TIMER15_BRKIN",
        "TIMER16_BRKIN",
        "EVENTOUT"
      ],
      "note": "JTDI；复位后默认调试口，关闭 JTAG 后可作 GPIO"
    },
    {
      "num": 51,
      "name": "PC10",
      "type": "io",
      "alts": [
        "USART2_TX",
        "UART3_TX",
        "SPI2_SCK",
        "I2S2_CK",
        "TIMER7_CH0BRKIN",
        "TIMER0_CH0BRKIN",
        "EVENTOUT"
      ]
    },
    {
      "num": 52,
      "name": "PC11",
      "type": "io",
      "alts": [
        "USART2_RX",
        "UART3_RX",
        "SPI2_MISO",
        "TIMER7_CH2BRKIN",
        "TIMER16_CH1",
        "TRGSEL_IN2",
        "EXMC_D2",
        "EVENTOUT"
      ]
    },
    {
      "num": 53,
      "name": "PC12",
      "type": "io",
      "alts": [
        "USART2_CK",
        "UART4_TX",
        "SPI2_MOSI",
        "I2S2_SD",
        "TIMER16_CH0",
        "EXMC_D3",
        "EVENTOUT"
      ]
    },
    {
      "num": 54,
      "name": "PD2",
      "type": "io",
      "alts": [
        "TIMER2_ETI",
        "UART4_RX",
        "TIMER16_MCH0",
        "EXMC_NWE",
        "EVENTOUT"
      ]
    },
    {
      "num": 55,
      "name": "PB3",
      "type": "io",
      "alts": [
        "JTDO",
        "TRACESWO",
        "TIMER1_CH1",
        "SPI0_SCK",
        "SPI2_SCK",
        "I2S2_CK",
        "CK_OUT",
        "EVENTOUT"
      ],
      "note": "JTDO/TRACESWO；复位后默认调试口，关闭 JTAG 后可作 GPIO"
    },
    {
      "num": 56,
      "name": "PB4",
      "type": "io",
      "alts": [
        "NJTRST",
        "TIMER2_CH0",
        "SPI0_MISO",
        "SPI2_MISO",
        "TIMER7_CH2",
        "TRGSEL_OUT6",
        "EVENTOUT"
      ],
      "note": "NJTRST；复位后默认调试口，关闭 JTAG 后可作 GPIO"
    },
    {
      "num": 57,
      "name": "PB5",
      "type": "io",
      "alts": [
        "TIMER2_CH1",
        "SPI0_MOSI",
        "I2C0_SMBA",
        "CAN1_RX",
        "TIMER7_CH0BRKIN",
        "SPI2_MOSI",
        "I2S2_SD",
        "TIMER0_CH0BRKIN",
        "EVENTOUT"
      ]
    },
    {
      "num": 58,
      "name": "PB6",
      "type": "io",
      "alts": [
        "USART0_TX",
        "I2C0_SCL",
        "TIMER3_CH0",
        "CAN1_TX",
        "TIMER7_CH1BRKIN",
        "SPI0_IO2",
        "TIMER0_CH1BRKIN",
        "EVENTOUT"
      ]
    },
    {
      "num": 59,
      "name": "PB7",
      "type": "io",
      "alts": [
        "USART0_RX",
        "I2C0_SDA",
        "TIMER3_CH1",
        "EXMC_NL",
        "EXMC_NADV",
        "TIMER7_CH2BRKIN",
        "SPI0_IO3",
        "TRGSEL_OUT7",
        "TIMER0_CH2BRKIN",
        "EVENTOUT"
      ]
    },
    {
      "num": 60,
      "name": "BOOT0",
      "type": "power",
      "alts": [],
      "note": "启动配置输入；与 BOOT1 共同决定启动源，复位后采样"
    },
    {
      "num": 61,
      "name": "PB8",
      "type": "io",
      "alts": [
        "I2C0_SCL",
        "CAN0_RX",
        "TIMER3_CH2",
        "TIMER15_CH0",
        "EVENTOUT"
      ]
    },
    {
      "num": 62,
      "name": "PB9",
      "type": "io",
      "alts": [
        "I2C0_SDA",
        "CAN0_TX",
        "TIMER3_CH3",
        "TIMER16_CH0",
        "EVENTOUT"
      ]
    },
    {
      "num": 63,
      "name": "VSS_4",
      "type": "power",
      "alts": []
    },
    {
      "num": 64,
      "name": "VDD_4",
      "type": "power",
      "alts": []
    }
  ],
  "globalConfigs": [
    {
      "id": "debug_common",
      "label": "调试公共脚 PA13/PA14（SWD/JTAG）",
      "default": true,
      "claims": [
        "PA13",
        "PA14"
      ],
      "note": "SWDIO=PA13，SWCLK=PA14；SWD 两线和 JTAG 都使用这两根。复位后默认是 5 线 JTAG，实际使用 SWD 需切换调试模式"
    },
    {
      "id": "jtag_data",
      "label": "JTAG 数据脚 PA15/PB3（4 线 JTAG）",
      "default": false,
      "claims": [
        "PA15",
        "PB3"
      ],
      "note": "4 线 JTAG = 公共脚 PA13/PA14 + PA15/PB3；仅用 SWD 时不勾选，PA15/PB3 可作 GPIO"
    },
    {
      "id": "jtag_njtrst",
      "label": "JTAG 复位脚 PB4（5 线 JTAG 可选）",
      "default": false,
      "claims": [
        "PB4"
      ],
      "note": "5 线 JTAG 增加 NJTRST=PB4；NJTRST 可由硬件拉高以省掉 PB4（4 线 JTAG）；不勾选时 PB4 可作 GPIO"
    },
    {
      "id": "hxtal",
      "label": "外部高速晶振 HXTAL (3-25MHz)",
      "default": false,
      "claims": [
        "PD0",
        "PD1"
      ],
      "note": "启用后 PD0/PD1 作为 OSCIN/OSCOUT"
    },
    {
      "id": "lxtal",
      "label": "外部低速晶振 LXTAL (32.768kHz)",
      "default": false,
      "claims": [
        "PC14",
        "PC15"
      ],
      "note": "启用后 PC14/PC15 作为 OSC32IN/OSC32OUT"
    }
  ],
  "resources": [
    {
      "id": "USART0",
      "category": "UART",
      "label": "USART0",
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
      "id": "USART1",
      "category": "UART",
      "label": "USART1",
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
      "id": "USART2",
      "category": "UART",
      "label": "USART2",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB10",
            "PC10"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB11",
            "PC11"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PB12",
            "PC12"
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
      "id": "UART3",
      "category": "UART",
      "label": "UART3",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PC10"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PC11"
          ]
        }
      ],
      "note": "仅异步收发"
    },
    {
      "id": "UART4",
      "category": "UART",
      "label": "UART4",
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PC12"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PD2"
          ]
        }
      ],
      "note": "仅异步收发"
    },
    {
      "id": "SPI0",
      "category": "SPI",
      "label": "SPI0",
      "signals": [
        {
          "name": "NSS",
          "pins": [
            "PA4",
            "PA15"
          ]
        },
        {
          "name": "SCK",
          "pins": [
            "PA5",
            "PB3"
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
          "name": "MOSI",
          "pins": [
            "PA7",
            "PB5"
          ]
        },
        {
          "name": "IO2",
          "pins": [
            "PA2",
            "PB6"
          ]
        },
        {
          "name": "IO3",
          "pins": [
            "PA3",
            "PB7"
          ]
        }
      ],
      "modes": [
        {
          "id": "master",
          "label": "主机模式",
          "signals": [
            "SCK",
            "MOSI",
            "MISO",
            "NSS",
            "IO2",
            "IO3"
          ],
          "optional": [
            "NSS",
            "IO2",
            "IO3"
          ],
          "note": "主机片选 NSS 可选"
        },
        {
          "id": "slave",
          "label": "从机模式",
          "signals": [
            "NSS",
            "SCK",
            "MOSI",
            "MISO",
            "IO2",
            "IO3"
          ],
          "optional": [
            "IO2",
            "IO3"
          ],
          "note": "NSS 片选输入必选，低电平有效"
        }
      ],
      "note": "四线 SPI：IO2/IO3 可选"
    },
    {
      "id": "SPI1",
      "category": "SPI",
      "label": "SPI1",
      "signals": [
        {
          "name": "NSS",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "SCK",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PB15"
          ]
        }
      ],
      "modes": [
        {
          "id": "master",
          "label": "主机模式",
          "signals": [
            "SCK",
            "MOSI",
            "MISO",
            "NSS"
          ],
          "optional": [
            "NSS"
          ],
          "note": "主机片选 NSS 可选"
        },
        {
          "id": "slave",
          "label": "从机模式",
          "signals": [
            "NSS",
            "SCK",
            "MOSI",
            "MISO"
          ],
          "optional": [],
          "note": "NSS 片选输入必选，低电平有效"
        }
      ],
      "note": "与 I2S1 共用引脚"
    },
    {
      "id": "SPI2",
      "category": "SPI",
      "label": "SPI2",
      "signals": [
        {
          "name": "NSS",
          "pins": [
            "PA4",
            "PA15"
          ]
        },
        {
          "name": "SCK",
          "pins": [
            "PB3",
            "PC10"
          ]
        },
        {
          "name": "MISO",
          "pins": [
            "PB4",
            "PC11"
          ]
        },
        {
          "name": "MOSI",
          "pins": [
            "PB5",
            "PC12"
          ]
        }
      ],
      "modes": [
        {
          "id": "master",
          "label": "主机模式",
          "signals": [
            "SCK",
            "MOSI",
            "MISO",
            "NSS"
          ],
          "optional": [
            "NSS"
          ],
          "note": "主机片选 NSS 可选"
        },
        {
          "id": "slave",
          "label": "从机模式",
          "signals": [
            "NSS",
            "SCK",
            "MOSI",
            "MISO"
          ],
          "optional": [],
          "note": "NSS 片选输入必选，低电平有效"
        }
      ],
      "note": "与 I2S2 共用引脚"
    },
    {
      "id": "I2S1",
      "category": "I2S",
      "label": "I2S1",
      "signals": [
        {
          "name": "WS",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "SD",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "MCK",
          "pins": [
            "PC6"
          ]
        }
      ],
      "optional": [
        "MCK"
      ],
      "note": "与 SPI1 共用引脚；MCK 可选"
    },
    {
      "id": "I2S2",
      "category": "I2S",
      "label": "I2S2",
      "signals": [
        {
          "name": "WS",
          "pins": [
            "PA4",
            "PA15"
          ]
        },
        {
          "name": "CK",
          "pins": [
            "PB3",
            "PC10"
          ]
        },
        {
          "name": "SD",
          "pins": [
            "PB5",
            "PC12"
          ]
        },
        {
          "name": "MCK",
          "pins": [
            "PC7"
          ]
        }
      ],
      "optional": [
        "MCK"
      ],
      "note": "与 SPI2 共用引脚；MCK 可选"
    },
    {
      "id": "I2C0",
      "category": "I2C",
      "label": "I2C0",
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
          ]
        }
      ],
      "optional": [
        "SMBA"
      ],
      "note": "SMBA 为 SMBus 报警（可选）"
    },
    {
      "id": "I2C1",
      "category": "I2C",
      "label": "I2C1",
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
          ]
        }
      ],
      "optional": [
        "SMBA"
      ],
      "note": "SMBA 为 SMBus 报警（可选）"
    },
    {
      "id": "CAN0",
      "category": "CAN",
      "label": "CAN0",
      "signals": [
        {
          "name": "RX",
          "pins": [
            "PA11",
            "PB8",
            "PD0"
          ]
        },
        {
          "name": "TX",
          "pins": [
            "PA12",
            "PB9",
            "PD1"
          ]
        }
      ],
      "note": "CAN-FD"
    },
    {
      "id": "CAN1",
      "category": "CAN",
      "label": "CAN1",
      "signals": [
        {
          "name": "RX",
          "pins": [
            "PB5",
            "PB12"
          ]
        },
        {
          "name": "TX",
          "pins": [
            "PB6",
            "PB13"
          ]
        }
      ],
      "note": "CAN-FD"
    },
    {
      "id": "USBFS",
      "category": "USB",
      "label": "USBFS",
      "signals": [
        {
          "name": "DM",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "DP",
          "pins": [
            "PA12"
          ]
        },
        {
          "name": "SOF",
          "pins": [
            "PA8"
          ]
        }
      ],
      "optional": [
        "SOF"
      ],
      "note": "全速 USB；DM/DP 为模拟复用脚，SOF 可选"
    },
    {
      "id": "TIMER0",
      "category": "TIMER",
      "label": "TIMER0",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA10"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "CH0_ON",
          "pins": [
            "PA7",
            "PB13"
          ]
        },
        {
          "name": "CH1_ON",
          "pins": [
            "PB0",
            "PB14"
          ]
        },
        {
          "name": "CH2_ON",
          "pins": [
            "PB1",
            "PB15"
          ]
        },
        {
          "name": "CH3_ON",
          "pins": [
            "PA3"
          ],
          "note": "PA10 与 TIMER0_CH2 共用；本工具将 PA10 归入 CH2"
        },
        {
          "name": "BRKIN",
          "pins": [
            "PA6",
            "PB12"
          ]
        },
        {
          "name": "CH0BRKIN",
          "pins": [
            "PB5",
            "PB10",
            "PC10"
          ]
        },
        {
          "name": "CH1BRKIN",
          "pins": [
            "PB6",
            "PB11"
          ]
        },
        {
          "name": "CH2BRKIN",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "ETI",
          "pins": [
            "PA12"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3",
        "CH0_ON",
        "CH1_ON",
        "CH2_ON",
        "CH3_ON",
        "BRKIN",
        "CH0BRKIN",
        "CH1BRKIN",
        "CH2BRKIN",
        "ETI"
      ],
      "note": "高级定时器；CHx_ON 为互补输出，BRKIN/CHxBRKIN 为刹车输入"
    },
    {
      "id": "TIMER7",
      "category": "TIMER",
      "label": "TIMER7",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA11",
            "PC6"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA12",
            "PC7"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PB4",
            "PC8"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PC4",
            "PC9"
          ]
        },
        {
          "name": "CH0_ON",
          "pins": [
            "PA7",
            "PC0"
          ]
        },
        {
          "name": "CH1_ON",
          "pins": [
            "PB0",
            "PC1"
          ]
        },
        {
          "name": "CH2_ON",
          "pins": [
            "PB1",
            "PC2"
          ]
        },
        {
          "name": "CH3_ON",
          "pins": [
            "PC3"
          ],
          "note": "PC7 与 TIMER7_CH1 共用；本工具将 PC7 归入 CH1"
        },
        {
          "name": "BRKIN",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "CH0BRKIN",
          "pins": [
            "PA5",
            "PA8",
            "PB5",
            "PC10"
          ]
        },
        {
          "name": "CH1BRKIN",
          "pins": [
            "PA4",
            "PA9",
            "PB6"
          ]
        },
        {
          "name": "CH2BRKIN",
          "pins": [
            "PA10",
            "PB7",
            "PC11"
          ]
        },
        {
          "name": "ETI",
          "pins": [
            "PA0"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3",
        "CH0_ON",
        "CH1_ON",
        "CH2_ON",
        "CH3_ON",
        "BRKIN",
        "CH0BRKIN",
        "CH1BRKIN",
        "CH2BRKIN",
        "ETI"
      ],
      "note": "高级定时器；CHx_ON 为互补输出，BRKIN/CHxBRKIN 为刹车输入"
    },
    {
      "id": "TIMER1",
      "category": "TIMER",
      "label": "TIMER1",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA0",
            "PA15"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA1",
            "PB3"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA2",
            "PB10"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA3",
            "PB11"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3"
      ],
      "note": "32 位通用定时器；外部触发输入见 TIMER1_ETI"
    },
    {
      "id": "TIMER1_ETI",
      "category": "TIMER",
      "label": "TIMER1 ETI",
      "signals": [
        {
          "name": "ETI",
          "pins": [
            "PA0",
            "PA15"
          ]
        }
      ],
      "note": "外部触发输入；与 TIMER1_CH0 共用 PA0/PA15，二者择一"
    },
    {
      "id": "TIMER2",
      "category": "TIMER",
      "label": "TIMER2",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA6",
            "PB4",
            "PC6"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA7",
            "PB5",
            "PC7"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PB0",
            "PC8"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PB1",
            "PC9"
          ]
        },
        {
          "name": "ETI",
          "pins": [
            "PD2"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3",
        "ETI"
      ],
      "note": "16 位通用定时器"
    },
    {
      "id": "TIMER3",
      "category": "TIMER",
      "label": "TIMER3",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PB9"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3"
      ],
      "note": "16 位通用定时器；ETI 引脚在 LQFP64 上未引出"
    },
    {
      "id": "TIMER4",
      "category": "TIMER",
      "label": "TIMER4",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "CH2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "CH3",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "ETI",
          "pins": [
            "PA5"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "CH2",
        "CH3",
        "ETI"
      ],
      "note": "16 位通用定时器"
    },
    {
      "id": "TIMER15",
      "category": "TIMER",
      "label": "TIMER15",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA6",
            "PA11",
            "PB8",
            "PB14"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA7",
            "PA10",
            "PB15"
          ]
        },
        {
          "name": "MCH0",
          "pins": [
            "PA5",
            "PA12"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "MCH0"
      ],
      "note": "16 位通用定时器；MCH0 为多模式附加通道；刹车输入见 TIMER15_BRKIN"
    },
    {
      "id": "TIMER15_BRKIN",
      "category": "TIMER",
      "label": "TIMER15 BRKIN",
      "signals": [
        {
          "name": "BRKIN",
          "pins": [
            "PA4",
            "PA10",
            "PA15"
          ],
          "note": "PA10 与 TIMER15_CH1 共用；二者择一"
        }
      ],
      "note": "刹车输入"
    },
    {
      "id": "TIMER16",
      "category": "TIMER",
      "label": "TIMER16",
      "signals": [
        {
          "name": "CH0",
          "pins": [
            "PA2",
            "PB9",
            "PB12",
            "PC12"
          ]
        },
        {
          "name": "CH1",
          "pins": [
            "PA3",
            "PB13",
            "PC11"
          ]
        },
        {
          "name": "MCH0",
          "pins": [
            "PA1",
            "PD2"
          ]
        },
        {
          "name": "BRKIN",
          "pins": [
            "PA0",
            "PA15"
          ]
        }
      ],
      "optional": [
        "CH0",
        "CH1",
        "MCH0",
        "BRKIN"
      ],
      "note": "16 位通用定时器；MCH0 为多模式附加通道"
    },
    {
      "id": "ADC0",
      "category": "ADC",
      "label": "ADC0",
      "signals": [
        {
          "name": "IN0",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "IN1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "IN2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "IN3",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "IN4",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "IN5",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "IN6",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "IN7",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "IN8",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "IN9",
          "pins": [
            "PB1"
          ]
        },
        {
          "name": "IN10",
          "pins": [
            "PC0"
          ]
        },
        {
          "name": "IN11",
          "pins": [
            "PC1"
          ]
        },
        {
          "name": "IN12",
          "pins": [
            "PC2"
          ]
        },
        {
          "name": "IN13",
          "pins": [
            "PC3"
          ]
        },
        {
          "name": "IN14",
          "pins": [
            "PC4"
          ]
        },
        {
          "name": "IN15",
          "pins": [
            "PC5"
          ]
        }
      ],
      "optional": [
        "IN0",
        "IN1",
        "IN2",
        "IN3",
        "IN4",
        "IN5",
        "IN6",
        "IN7",
        "IN8",
        "IN9",
        "IN10",
        "IN11",
        "IN12",
        "IN13",
        "IN14",
        "IN15"
      ],
      "note": "12 位 ADC；IN0-IN15"
    },
    {
      "id": "ADC1",
      "category": "ADC",
      "label": "ADC1",
      "signals": [
        {
          "name": "IN0",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "IN1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "IN2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "IN3",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "IN4",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "IN5",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "IN6",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "IN7",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "IN8",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "IN9",
          "pins": [
            "PB1"
          ]
        },
        {
          "name": "IN10",
          "pins": [
            "PC0"
          ]
        },
        {
          "name": "IN11",
          "pins": [
            "PC1"
          ]
        },
        {
          "name": "IN12",
          "pins": [
            "PC2"
          ]
        },
        {
          "name": "IN13",
          "pins": [
            "PC3"
          ]
        },
        {
          "name": "IN14",
          "pins": [
            "PC4"
          ]
        },
        {
          "name": "IN15",
          "pins": [
            "PC5"
          ]
        },
        {
          "name": "IN16",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "IN17",
          "pins": [
            "PB11"
          ]
        }
      ],
      "optional": [
        "IN0",
        "IN1",
        "IN2",
        "IN3",
        "IN4",
        "IN5",
        "IN6",
        "IN7",
        "IN8",
        "IN9",
        "IN10",
        "IN11",
        "IN12",
        "IN13",
        "IN14",
        "IN15",
        "IN16",
        "IN17"
      ],
      "note": "12 位 ADC；IN0-IN17"
    },
    {
      "id": "ADC2",
      "category": "ADC",
      "label": "ADC2",
      "signals": [
        {
          "name": "IN15",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "IN16",
          "pins": [
            "PB11"
          ]
        }
      ],
      "optional": [
        "IN15",
        "IN16"
      ],
      "note": "12 位 ADC；IN15-IN16"
    },
    {
      "id": "DAC0",
      "category": "DAC",
      "label": "DAC0",
      "signals": [
        {
          "name": "OUT0",
          "pins": [
            "PA4",
            "PA5"
          ]
        }
      ],
      "note": "DAC0_OUT0 可路由到 PA4 或 PA5（二选一）"
    },
    {
      "id": "CMP0",
      "category": "CMP",
      "label": "CMP0",
      "signals": [
        {
          "name": "IP",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "IM0",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "IM1",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "IM2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "OUT",
          "pins": [
            "PA0",
            "PA1",
            "PA6",
            "PB0",
            "PB1"
          ]
        }
      ],
      "optional": [
        "IP",
        "IM0",
        "IM1",
        "IM2",
        "OUT"
      ],
      "note": "比较器输入/输出可独立选用"
    },
    {
      "id": "EXMC",
      "category": "EXMC",
      "label": "EXMC",
      "signals": [
        {
          "name": "D0",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "D1",
          "pins": [
            "PC6"
          ]
        },
        {
          "name": "D2",
          "pins": [
            "PC11",
            "PD0"
          ]
        },
        {
          "name": "D3",
          "pins": [
            "PC12",
            "PD1"
          ]
        },
        {
          "name": "D4",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "D5",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "D6",
          "pins": [
            "PA4"
          ]
        },
        {
          "name": "D7",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "D13",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "NL/NADV",
          "pins": [
            "PB7",
            "PC0",
            "PC9"
          ],
          "note": "同一引脚的 NL/NADV 复用功能，合并为一个信号"
        },
        {
          "name": "NWE",
          "pins": [
            "PC2",
            "PD2"
          ]
        },
        {
          "name": "NE0",
          "pins": [
            "PC4"
          ]
        },
        {
          "name": "NOE",
          "pins": [
            "PC5"
          ]
        }
      ],
      "optional": [
        "D0",
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D13",
        "NL/NADV",
        "NWE",
        "NE0",
        "NOE"
      ],
      "note": "LQFP64 仅引出以下 EXMC 信号；地址线和高位数据线未引出"
    },
    {
      "id": "TRIGSEL",
      "category": "TRIGSEL",
      "label": "TRIGSEL",
      "signals": [
        {
          "name": "IN0",
          "pins": [
            "PA11"
          ]
        },
        {
          "name": "IN1",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "IN2",
          "pins": [
            "PC11"
          ]
        },
        {
          "name": "IN5",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "IN6",
          "pins": [
            "PA1"
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
            "PA3"
          ]
        },
        {
          "name": "OUT2",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "OUT3",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "OUT4",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "OUT5",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "OUT6",
          "pins": [
            "PB4"
          ]
        },
        {
          "name": "OUT7",
          "pins": [
            "PB7"
          ]
        }
      ],
      "optional": [
        "IN0",
        "IN1",
        "IN2",
        "IN5",
        "IN6",
        "OUT0",
        "OUT1",
        "OUT2",
        "OUT3",
        "OUT4",
        "OUT5",
        "OUT6",
        "OUT7"
      ],
      "note": "LQFP64 仅引出 IN0/1/2/5/6 与全部 OUT0-OUT7"
    },
    {
      "id": "CTC",
      "category": "SYSTEM",
      "label": "CTC",
      "signals": [
        {
          "name": "SYNC",
          "pins": [
            "PA8"
          ]
        }
      ],
      "note": "时钟校准同步信号"
    },
    {
      "id": "CK_OUT",
      "category": "SYSTEM",
      "label": "CK_OUT",
      "signals": [
        {
          "name": "CK_OUT",
          "pins": [
            "PA8",
            "PB3"
          ]
        }
      ],
      "note": "系统时钟输出"
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
