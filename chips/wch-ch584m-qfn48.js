/* CH584M (QFN48) 芯片数据。约束事实来源：CH585DS1 V1.6 (2025-12-25)，1.1/1.2 逐脚表与 p1 资源表；由 CH585M 基线裁剪（去 USB HS/SPI1） */
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return {
  "schemaVersion": 2,
  "id": "ch584m-qfn48",
  "meta": {
    "source": "CH585DS1 V1.6 (2025-12-25)",
    "author": "MeowG",
    "date": "2026-10-17",
    "note": "CH584M：CH585M 的简化版（去 USB HS/SPI1，RAM 96K）"
  },
  "chip": {
    "vendor": "WCH",
    "series": "CH58x",
    "name": "CH584M",
    "package": "QFN48"
  },
  "package": {
    "family": "quad",
    "style": "no-lead",
    "pinsPerSide": 12,
    "pitch": 0.35,
    "body": [
      5,
      5
    ],
    "pin1": "topLeft",
    "sequence": "ccw-down",
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
      "name": "PA7",
      "type": "io",
      "alts": [
        "TXD2",
        "PWM5_",
        "LED6",
        "AIN11"
      ]
    },
    {
      "num": 5,
      "name": "PA8",
      "type": "io",
      "alts": [
        "RXD1",
        "LED7",
        "AIN12"
      ]
    },
    {
      "num": 6,
      "name": "PA9",
      "type": "io",
      "alts": [
        "TMR0/PWM0/CAP0",
        "TXD1",
        "AIN13"
      ]
    },
    {
      "num": 7,
      "name": "PB9",
      "type": "io",
      "alts": [
        "NFCI"
      ]
    },
    {
      "num": 8,
      "name": "PB8",
      "type": "io",
      "alts": [
        "NFCM"
      ]
    },
    {
      "num": 9,
      "name": "PB17",
      "type": "io",
      "alts": [
        "NFC+"
      ]
    },
    {
      "num": 10,
      "name": "PB16",
      "type": "io",
      "alts": [
        "NFC-"
      ]
    },
    {
      "num": 11,
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
      "num": 12,
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
      "num": 13,
      "name": "PB13",
      "type": "io",
      "alts": [
        "SCK0_",
        "SCL",
        "TXD1_"
      ],
      "note": "USB HS D+"
    },
    {
      "num": 14,
      "name": "PB12",
      "type": "io",
      "alts": [
        "SCS_",
        "SDA",
        "RXD1_"
      ],
      "note": "USB HS D-"
    },
    {
      "num": 15,
      "name": "PB11",
      "type": "io",
      "alts": [
        "UD+",
        "TMR2_"
      ],
      "note": "USB FS D+"
    },
    {
      "num": 16,
      "name": "PB10",
      "type": "io",
      "alts": [
        "UD-",
        "TMR1_"
      ],
      "note": "USB FS D-"
    },
    {
      "num": 17,
      "name": "PB7",
      "type": "io",
      "alts": [
        "TXD0",
        "PWM9"
      ]
    },
    {
      "num": 18,
      "name": "PB6",
      "type": "io",
      "alts": [
        "RTS",
        "PWM8"
      ]
    },
    {
      "num": 19,
      "name": "PB5",
      "type": "io",
      "alts": [
        "DTR"
      ]
    },
    {
      "num": 20,
      "name": "PB4",
      "type": "io",
      "alts": [
        "RXD0",
        "PWM7"
      ]
    },
    {
      "num": 21,
      "name": "PB3",
      "type": "io",
      "alts": [
        "DCD",
        "PWM9_"
      ]
    },
    {
      "num": 22,
      "name": "PB2",
      "type": "io",
      "alts": [
        "PWM8_"
      ]
    },
    {
      "num": 23,
      "name": "PB1",
      "type": "io",
      "alts": [
        "DSR",
        "PWM7_"
      ]
    },
    {
      "num": 24,
      "name": "PB0",
      "type": "io",
      "alts": [
        "CTS",
        "PWM6"
      ]
    },
    {
      "num": 25,
      "name": "PB23",
      "type": "io",
      "alts": [
        "RST#",
        "TMR0_",
        "TXD2_",
        "PWM11"
      ]
    },
    {
      "num": 26,
      "name": "PB22",
      "type": "io",
      "alts": [
        "TMR3/PWM3/CAP3",
        "RXD2_"
      ]
    },
    {
      "num": 27,
      "name": "PB21",
      "type": "io",
      "alts": [
        "SCL_",
        "TXD3_"
      ]
    },
    {
      "num": 28,
      "name": "PB20",
      "type": "io",
      "alts": [
        "SDA_",
        "RXD3_"
      ]
    },
    {
      "num": 29,
      "name": "PB19",
      "type": "io",
      "alts": []
    },
    {
      "num": 30,
      "name": "PB18",
      "type": "io",
      "alts": []
    },
    {
      "num": 31,
      "name": "X32MO",
      "type": "osc",
      "alts": []
    },
    {
      "num": 32,
      "name": "X32MI",
      "type": "osc",
      "alts": []
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
      "name": "VDCIA",
      "type": "power",
      "alts": []
    },
    {
      "num": 36,
      "name": "PA4",
      "type": "io",
      "alts": [
        "RXD3",
        "LEDC",
        "AIN0"
      ]
    },
    {
      "num": 37,
      "name": "PA5",
      "type": "io",
      "alts": [
        "TXD3",
        "LED4",
        "AIN1"
      ]
    },
    {
      "num": 38,
      "name": "PA6",
      "type": "io",
      "alts": [
        "RXD2",
        "PWM4_",
        "LED5",
        "AIN10"
      ]
    },
    {
      "num": 39,
      "name": "PA0",
      "type": "io",
      "alts": [
        "LED0",
        "AIN9"
      ]
    },
    {
      "num": 40,
      "name": "PA1",
      "type": "io",
      "alts": [
        "LED1",
        "AIN8"
      ]
    },
    {
      "num": 41,
      "name": "PA2",
      "type": "io",
      "alts": [
        "TMR3_",
        "RI",
        "LED2",
        "AIN7"
      ]
    },
    {
      "num": 42,
      "name": "PA3",
      "type": "io",
      "alts": [
        "LED3",
        "AIN6"
      ]
    },
    {
      "num": 43,
      "name": "PA15",
      "type": "io",
      "alts": [
        "MISO",
        "RXD0_",
        "AIN5"
      ]
    },
    {
      "num": 44,
      "name": "PA14",
      "type": "io",
      "alts": [
        "MOSI",
        "TXD0_",
        "AIN4"
      ]
    },
    {
      "num": 45,
      "name": "PA13",
      "type": "io",
      "alts": [
        "SCK0",
        "PWM5",
        "AIN3"
      ]
    },
    {
      "num": 46,
      "name": "PA12",
      "type": "io",
      "alts": [
        "SCS",
        "PWM4",
        "AIN2"
      ]
    },
    {
      "num": 47,
      "name": "PA11",
      "type": "io",
      "alts": [
        "X32KO",
        "TMR2/PWM2/CAP2"
      ]
    },
    {
      "num": 48,
      "name": "PA10",
      "type": "io",
      "alts": [
        "X32KI",
        "TMR1/PWM1/CAP1"
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
      "id": "rst",
      "label": "外部复位 RST",
      "default": false,
      "claims": [
        "PB23"
      ]
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
      "groupSwitch": {
        "label": "改用映射组"
      },
      "optional": [
        "RTS",
        "CTS",
        "DTR",
        "DSR",
        "RI",
        "DCD"
      ],
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PB7",
            "PA14"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PB4",
            "PA15"
          ]
        },
        {
          "name": "RTS",
          "pins": [
            "PB6"
          ],
          "note": "MODEM 输出（请求发送）；表7-2：推挽输出"
        },
        {
          "name": "CTS",
          "pins": [
            "PB0"
          ],
          "note": "MODEM 输入（清除发送）"
        },
        {
          "name": "DTR",
          "pins": [
            "PB5",
            "PB15"
          ],
          "groupKey": "UART0_MODEM",
          "note": "MODEM 输出（数据终端就绪）；RB_PIN_MODEM 位与 DSR 同切（PB1/PB5 ↔ PB14/PB15）"
        },
        {
          "name": "DSR",
          "pins": [
            "PB1",
            "PB14"
          ],
          "groupKey": "UART0_MODEM",
          "note": "MODEM 输入（数据装置就绪）；RB_PIN_MODEM 位与 DTR 同切"
        },
        {
          "name": "RI",
          "pins": [
            "PA2"
          ],
          "note": "MODEM 输入（振铃指示）；CH585M 上为 PA2"
        },
        {
          "name": "DCD",
          "pins": [
            "PB3"
          ],
          "note": "MODEM 输入（载波检测）"
        }
      ]
    },
    {
      "id": "UART1",
      "category": "UART",
      "label": "UART1",
      "groupSwitch": {
        "label": "改用映射组"
      },
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
            "PA8",
            "PB12"
          ]
        }
      ]
    },
    {
      "id": "UART2",
      "category": "UART",
      "label": "UART2",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA7",
            "PB23"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA6",
            "PB22"
          ]
        }
      ]
    },
    {
      "id": "UART3",
      "category": "UART",
      "label": "UART3",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "signals": [
        {
          "name": "TXD",
          "pins": [
            "PA5",
            "PB21"
          ]
        },
        {
          "name": "RXD",
          "pins": [
            "PA4",
            "PB20"
          ]
        }
      ]
    },
    {
      "id": "I2C",
      "category": "I2C",
      "label": "I2C",
      "groupSwitch": {
        "label": "改用映射组"
      },
      "signals": [
        {
          "name": "SCL",
          "pins": [
            "PB13",
            "PB21"
          ]
        },
        {
          "name": "SDA",
          "pins": [
            "PB12",
            "PB20"
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
            "PB22",
            "PA2"
          ]
        },
        {
          "name": "TMR3/CAP3",
          "pins": [
            "PB22",
            "PA2"
          ]
        },
        {
          "name": "TMR3/CNT3",
          "pins": [
            "PB22",
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "PWM4",
      "category": "PWM",
      "label": "PWM4",
      "groupKey": "PWMX",
      "signals": [
        {
          "name": "PWM4",
          "pins": [
            "PA12",
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "PWM5",
      "category": "PWM",
      "label": "PWM5",
      "groupKey": "PWMX",
      "signals": [
        {
          "name": "PWM5",
          "pins": [
            "PA13",
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "PWM6",
      "category": "PWM",
      "label": "PWM6",
      "signals": [
        {
          "name": "PWM6",
          "pins": [
            "PB0"
          ]
        }
      ]
    },
    {
      "id": "PWM7",
      "category": "PWM",
      "label": "PWM7",
      "groupKey": "PWMX",
      "signals": [
        {
          "name": "PWM7",
          "pins": [
            "PB4",
            "PB1"
          ]
        }
      ]
    },
    {
      "id": "PWM8",
      "category": "PWM",
      "label": "PWM8",
      "groupKey": "PWMX",
      "signals": [
        {
          "name": "PWM8",
          "pins": [
            "PB6",
            "PB2"
          ]
        }
      ]
    },
    {
      "id": "PWM9",
      "category": "PWM",
      "label": "PWM9",
      "groupKey": "PWMX",
      "signals": [
        {
          "name": "PWM9",
          "pins": [
            "PB7",
            "PB3"
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
      "id": "AIN0",
      "category": "ADC",
      "label": "AIN0 (TK0)",
      "signals": [
        {
          "name": "AIN0",
          "pins": [
            "PA4"
          ]
        }
      ]
    },
    {
      "id": "AIN1",
      "category": "ADC",
      "label": "AIN1 (TK1)",
      "signals": [
        {
          "name": "AIN1",
          "pins": [
            "PA5"
          ]
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
      "id": "AIN6",
      "category": "ADC",
      "label": "AIN6 (TK6)",
      "signals": [
        {
          "name": "AIN6",
          "pins": [
            "PA3"
          ]
        }
      ]
    },
    {
      "id": "AIN7",
      "category": "ADC",
      "label": "AIN7 (TK7)",
      "signals": [
        {
          "name": "AIN7",
          "pins": [
            "PA2"
          ]
        }
      ]
    },
    {
      "id": "AIN8",
      "category": "ADC",
      "label": "AIN8 (TK8)",
      "signals": [
        {
          "name": "AIN8",
          "pins": [
            "PA1"
          ]
        }
      ]
    },
    {
      "id": "AIN9",
      "category": "ADC",
      "label": "AIN9 (TK9)",
      "signals": [
        {
          "name": "AIN9",
          "pins": [
            "PA0"
          ]
        }
      ]
    },
    {
      "id": "AIN10",
      "category": "ADC",
      "label": "AIN10 (TK10)",
      "signals": [
        {
          "name": "AIN10",
          "pins": [
            "PA6"
          ]
        }
      ]
    },
    {
      "id": "AIN11",
      "category": "ADC",
      "label": "AIN11 (TK11)",
      "signals": [
        {
          "name": "AIN11",
          "pins": [
            "PA7"
          ]
        }
      ]
    },
    {
      "id": "AIN12",
      "category": "ADC",
      "label": "AIN12 (TK12)",
      "signals": [
        {
          "name": "AIN12",
          "pins": [
            "PA8"
          ]
        }
      ]
    },
    {
      "id": "AIN13",
      "category": "ADC",
      "label": "AIN13 (TK13)",
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
      "id": "NFC",
      "category": "NFC",
      "label": "NFC",
      "signals": [
        {
          "name": "NFCI",
          "pins": [
            "PB9"
          ],
          "note": "NFC 模拟输入"
        },
        {
          "name": "NFCM",
          "pins": [
            "PB8"
          ],
          "note": "NFC 模拟输入"
        },
        {
          "name": "NFC+",
          "pins": [
            "PB17"
          ],
          "note": "NFC 天线 P 端"
        },
        {
          "name": "NFC-",
          "pins": [
            "PB16"
          ],
          "note": "NFC 天线 N 端"
        }
      ]
    },
    {
      "id": "LED",
      "category": "LED",
      "label": "LED 点阵屏",
      "optional": [
        "LED0",
        "LED1",
        "LED2",
        "LED3",
        "LED4",
        "LED5",
        "LED6",
        "LED7"
      ],
      "signals": [
        {
          "name": "LEDC",
          "pins": [
            "PA4"
          ],
          "note": "LED 点阵屏时钟输出（必选）"
        },
        {
          "name": "LED0",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "LED1",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "LED2",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "LED3",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "LED4",
          "pins": [
            "PA5"
          ]
        },
        {
          "name": "LED5",
          "pins": [
            "PA6"
          ]
        },
        {
          "name": "LED6",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "LED7",
          "pins": [
            "PA8"
          ]
        }
      ]
    },
    {
      "id": "LCD",
      "category": "LCD",
      "label": "段式 LCD",
      "optional": [
        "SEG0",
        "SEG1",
        "SEG2",
        "SEG3",
        "SEG4",
        "SEG5",
        "SEG6",
        "SEG7",
        "SEG8",
        "SEG9",
        "SEG10",
        "SEG11",
        "SEG12",
        "SEG13",
        "SEG14",
        "SEG15",
        "SEG16",
        "SEG17",
        "SEG18",
        "SEG19",
        "SEG20",
        "SEG21",
        "SEG22",
        "SEG23",
        "SEG24",
        "SEG25",
        "SEG26",
        "SEG27"
      ],
      "signals": [
        {
          "name": "COM0",
          "pins": [
            "PB4"
          ],
          "note": "LCD 公共端（必选）"
        },
        {
          "name": "COM1",
          "pins": [
            "PB5"
          ]
        },
        {
          "name": "COM2",
          "pins": [
            "PB6"
          ]
        },
        {
          "name": "COM3",
          "pins": [
            "PB7"
          ]
        },
        {
          "name": "SEG0",
          "pins": [
            "PB0"
          ]
        },
        {
          "name": "SEG1",
          "pins": [
            "PB1"
          ]
        },
        {
          "name": "SEG2",
          "pins": [
            "PB2"
          ]
        },
        {
          "name": "SEG3",
          "pins": [
            "PB3"
          ]
        },
        {
          "name": "SEG4",
          "pins": [
            "PA0"
          ]
        },
        {
          "name": "SEG5",
          "pins": [
            "PA1"
          ]
        },
        {
          "name": "SEG6",
          "pins": [
            "PA2"
          ]
        },
        {
          "name": "SEG7",
          "pins": [
            "PA3"
          ]
        },
        {
          "name": "SEG8",
          "pins": [
            "PB8"
          ]
        },
        {
          "name": "SEG9",
          "pins": [
            "PB9"
          ]
        },
        {
          "name": "SEG10",
          "pins": [
            "PB10"
          ]
        },
        {
          "name": "SEG11",
          "pins": [
            "PB11"
          ]
        },
        {
          "name": "SEG12",
          "pins": [
            "PB12"
          ]
        },
        {
          "name": "SEG13",
          "pins": [
            "PB13"
          ]
        },
        {
          "name": "SEG14",
          "pins": [
            "PB14"
          ]
        },
        {
          "name": "SEG15",
          "pins": [
            "PB15"
          ]
        },
        {
          "name": "SEG16",
          "pins": [
            "PB16"
          ]
        },
        {
          "name": "SEG17",
          "pins": [
            "PB17"
          ]
        },
        {
          "name": "SEG18",
          "pins": [
            "PB18"
          ]
        },
        {
          "name": "SEG19",
          "pins": [
            "PB19"
          ]
        },
        {
          "name": "SEG20",
          "pins": [
            "PB20"
          ]
        },
        {
          "name": "SEG21",
          "pins": [
            "PB21"
          ]
        },
        {
          "name": "SEG22",
          "pins": [
            "PB22"
          ]
        },
        {
          "name": "SEG23",
          "pins": [
            "PB23"
          ]
        },
        {
          "name": "SEG24",
          "pins": [
            "PA7"
          ]
        },
        {
          "name": "SEG25",
          "pins": [
            "PA8"
          ]
        },
        {
          "name": "SEG26",
          "pins": [
            "PA9"
          ]
        },
        {
          "name": "SEG27",
          "pins": [
            "PA13"
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
