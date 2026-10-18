# 芯片引脚规划器（Chip Pin Planner）

**中文** | [English](README.en.md)

[![CI](https://github.com/amadeus-1048596/chip-pin-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/amadeus-1048596/chip-pin-planner/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/amadeus-1048596/chip-pin-planner?display_name=tag)](https://github.com/amadeus-1048596/chip-pin-planner/releases)
[![在线版](https://img.shields.io/badge/online-demo-brightgreen)](https://amadeus-1048596.github.io/chip-pin-planner/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

画板前的“引脚沙盘”：在芯片封装图上点选引脚分配功能，冲突自动禁用/标红，导出引脚清单用于画原理图。
**不生成代码**，就是资源规划工具。

![界面总览](docs/images/overview.png)

**在线版**：<https://amadeus-1048596.github.io/chip-pin-planner/><br>
**下载离线版**：[Releases](https://github.com/amadeus-1048596/chip-pin-planner/releases)

## 目录

- [为什么做这个](#为什么做这个)
- [快速开始](#快速开始)
- [5 分钟上手](#5-分钟上手)
- [支持的芯片](#支持的芯片)
- [工程结构](#工程结构)
- [一起完善](#一起完善)
- [规则](#规则)
- [功能范围](#功能范围)
- [常见问题](#常见问题)
- [License](#license)

## 为什么做这个

画板前查引脚复用比较麻烦：复用表、映射位和模式限制分散在数据手册的不同章节。
这个工具把这些数据铺在封装图上，点引脚就能看到能做什么、和谁冲突。

目前内置 WCH **CH58x（16 颗）**、**CH59x（11 颗）** 与 **CH57x（13 颗）**，共 **40 颗**芯片；工具本身不绑定厂商，新增芯片 = 一个数据文件 + 清单一行。欢迎补充其他型号或直接提需求。

## 快速开始

- **在线用（30 秒）**：打开 <https://amadeus-1048596.github.io/chip-pin-planner/>，选芯片就能开始。
- **离线用**：到 [Releases](https://github.com/amadeus-1048596/chip-pin-planner/releases) 下载 `chip-pin-planner-vX.Y.zip`，解压后双击 `index.html`。无需联网、无需安装、无需本地服务器。
- **安装器**：下载 `chip-pin-planner-setup-vX.Y.exe`，per-user 安装（不需要管理员权限）。已安装的旧版双击产物目录里的 `update.bat` 即可升级。

支持 Chrome / Edge。

## 5 分钟上手

1. **选芯片**：顶栏下拉按厂商/系列分组，选择型号与封装（当前内置 WCH CH58x 16 颗、CH59x 11 颗、CH57x 13 颗，详见下表）。
2. **分配引脚**，两种方式任选：
   - 点封装图上的引脚 → 从菜单选功能。不可用项会置灰并说明原因。

     ![引脚菜单](docs/images/pin-menu.png)

   - 或点左侧资源目录里的外设（如 UART1）→ 一键分配；再点一次解除。
3. **看冲突**：被占用的脚自动置灰/标色；左侧资源前的色点表示可用性——🟢 绿 = 默认可落，🟡 黄 = 默认组被占（会自动改用映射组），🔴 红 = 无落脚点。
4. **可选信号与模式**：先分配资源，再在右栏“＋ 添加信号”添加 MODEM、片选等可选信号；带模式的外设（如 SPI0）可在右栏切换主机/从机、全双工/半双工。
5. **导出**：顶栏可导出 CSV / Markdown 引脚清单、工程 JSON（下次载入继续）、封装图 SVG。
6. **保存进度**：点“保存工程”下载 JSON；“载入工程”会自动切到对应芯片。

完整说明（映射组、可选信号、GPIO 命名、快捷键与排错）见 **[使用教程](docs/user-guide.md)**。

## 支持的芯片

| 系列 | 型号 | 封装 | IO | 说明 |
|---|---|---|---|---|
| CH58x | CH582M | QFN48 | 40 | 基线数据（CH583DS1 V1.9） |
| CH58x | CH582F | QFN28 | 20 | CH582M 的 QFN28 子集封装 |
| CH58x | CH583M | QFN48 | 40 | CH582M + SPI1 主机 |
| CH58x | CH584M | QFN48 | 40 | CH585M 简化版：无 USB HS/SPI1；保留 NFC/LED/LCD；RAM 96K（CH585DS1 V1.6） |
| CH58x | CH584X | QFN48 | 40 | 与 CH584M 同引脚/资源；存储配置不同（CH585DS1 V1.6） |
| CH58x | CH584F | QFN32 | 24 | 无 USB HS/SPI1/NFC/LED；保留 LCD；7 路 ADC（CH585DS1 V1.6） |
| CH58x | CH585M | QFN48 | 40 | NFC / LED 点阵 / 段式 LCD / USB HS / SPI1（CH585DS1 V1.6） |
| CH58x | CH585F | QFN32 | 24 | 无 NFC/LED，保留 LCD / USB HS；7 路 ADC（CH585DS1 V1.6） |
| CH58x | CH585C | QFN26C3 | 17 | 2 UART / 1 SPI / 5 PWM / USB FS+HS；无 I2C/NFC/LED/LCD（CH585DS1 V1.6） |
| CH58x | CH585D | QFN20 | 12 | 2 UART / 1 SPI / 3 PWM / USB FS+HS；无 I2C/NFC/LED/LCD（CH585DS1 V1.6） |
| CH59x | CH592X | QFN32 | 24 | 4 UART / 1 SPI / 1 I2C / 8 PWM / 12 ADC / 12 TouchKey / LCD 20×4 / USB 主机+设备（CH592DS1 V1.9） |
| CH59x | CH592F | QFN28 | 20 | 4 UART / 1 SPI / 1 I2C / 6 PWM / 8 ADC / 8 TouchKey / LCD 16×4 / USB（CH592DS1 V1.9） |
| CH59x | CH592A | QFN28 | 20 | 与 CH592F 同引脚/资源；最低电源电压 2.3V（CH592DS1 V1.9） |
| CH59x | CH592D | QFN20 | 12 | 2 UART / 1 SPI / 1 I2C / 3 PWM / 4 ADC / 4 TouchKey / LCD 8×4 / USB（CH592DS1 V1.9） |
| CH59x | CH591F | QFN28 | 20 | 2 UART / 1 SPI / 6 ADC / LCD 16×4 / USB 设备；无 I2C/TouchKey（CH592DS1 V1.9） |
| CH59x | CH591D | QFN20 | 12 | 2 UART / 1 SPI / 4 ADC / USB 设备；无 I2C/TouchKey/LCD（CH592DS1 V1.9） |
| CH59x | CH591R | TSSOP16 | 10 | 2 UART / 1 SPI / 4 ADC；无 USB/I2C/TouchKey/LCD（CH592DS1 V1.9） |
| CH59x | CH595X | QFN32 | 24 | 4 UART / 1 SPI / 1 I2C / 8 PWM / 14 ADC / 14 TouchKey / LCD 20×4 / USB 主机+设备（CH595DS1 V1.1） |
| CH59x | CH595F | QFN28 | 20 | 4 UART / 1 SPI / 1 I2C / 6 PWM / 10 ADC / 10 TouchKey / LCD 16×4 / USB（CH595DS1 V1.1） |
| CH59x | CH595D | QFN20 | 12 | 2 UART / 1 SPI / 1 I2C / 3 PWM / 6 ADC / 6 TouchKey / LCD 8×4 / USB（CH595DS1 V1.1） |
| CH59x | CH596D | QFN20 | 15 | 2 UART / 1 SPI / 1 I2C / 4 PWM / 8 ADC / 8 TouchKey；无 USB/LCD；单节 1.2V（CH596DS1 V1.1） |
| CH57x | CH573X | QFN32 | 22 | 4 UART / 1 SPI / 4 TMR / 8 PWM / 10 ADC / 10 TouchKey / USB 主机+设备（CH573DS1 V2.3） |
| CH57x | CH573F | QFN28 | 20 | 4 UART / 1 SPI / 4 TMR / 6 PWM / 8 ADC / 8 TouchKey / USB（CH573DS1 V2.3） |
| CH57x | CH573Q | LQFP32 | 22 | 192K Flash；4 UART / 1 SPI / 4 TMR / 8 PWM / 10 ADC / 10 TouchKey / USB（CH573DS1 V2.3） |
| CH57x | CH571F | QFN28 | 20 | 2 UART / 1 SPI / 4 TMR / 6 ADC / USB；无 PWM4-11/Touch/I2C/LCD（CH573DS1 V2.3） |
| CH57x | CH571D | QFN20 | 15 | 2 UART / 1 SPI / 3 TMR / 6 ADC / USB 设备；无 PWM4-11/Touch/DC-DC（CH573DS1 V2.3） |
| CH57x | CH571R | TSSOP16 | 10 | 2 UART / 1 SPI / 4 TMR / 4 ADC / USB 设备；无 PWM4-11/Touch/I2C/LCD（CH573DS1 V2.3） |
| CH57x | CH571K | ESSOP10 | 4 | 1 UART / 1 SPI / 4 ADC；无 Timer/PWM/USB/I2C/Touch/LCD（CH573DS1 V2.3） |
| CH57x | CH572D | QFN20 | 12 | UART / I2C / SPI / TMR / PWM1-5 / CMP / KeyScan / USB；2.4G+BLE（CH572DS1 V1.0） |
| CH57x | CH572Q | DFN10X3 | 5 | UART / I2C / TMR / PWM1-3 / CMP / KeyScan / USB；2.4G+BLE（CH572DS1 V1.0） |
| CH57x | CH572R | TSSOP16 | 10 | UART / I2C / SPI / TMR / PWM1-5 / CMP / KeyScan / USB；2.4G+BLE（CH572DS1 V1.0） |
| CH57x | CH570D | QFN20 | 12 | 同 CH572D；仅 2.4G（无 BLE）（CH572DS1 V1.0） |
| CH57x | CH570Q | DFN10X3 | 5 | UART / I2C / TMR / KeyScan / USB 设备；无 SPI/CMP/PWM1-5/BLE（CH572DS1 V1.0） |
| CH57x | CH570E | SOP8 | 3 | UART / I2C / TMR；无 SPI/CMP/USB/KeyScan/PWM/BLE（CH572DS1 V1.0） |
| CH58x | CH587W | QFN68X7 | 58 | 4 UART / 2 SPI / I2C / QSPI / USB PD+FS+HS / NFC / ARGB / LED / LCD 32×4 / 22 ADC / 22 Touch（CH587DS1 V1.0） |
| CH58x | CH587M | QFN48 | 40 | 4 UART / 2 SPI / I2C / QSPI / USB FS+HS / ARGB / LED / LCD 28×4 / 16 ADC（CH587DS1 V1.0） |
| CH58x | CH587F | QFN32 | 24 | 4 UART / 1 SPI / I2C / USB FS+HS / ARGB / LCD 13 段 / 8 ADC（型号表标 9+1/14×4，待复核）（CH587DS1 V1.0） |
| CH58x | CH587D | QFN20 | 12 | 2 UART / 1 SPI / I2C / USB FS+HS / ARGB / 5 ADC（CH587DS1 V1.0） |
| CH58x | CH586W | QFN68X7 | 58 | CH587W 去 USB HS/PD；NFC / QSPI / ARGB / LED / LCD 32×4 / 22 ADC（CH587DS1 V1.0） |
| CH58x | CH586M | QFN48 | 40 | CH587M 去 USB HS/PD/NFC；QSPI / ARGB / LED / LCD 28×4 / 16 ADC（CH587DS1 V1.0） |

![CH582F QFN28](docs/images/ch582f-qfn28.png)

列表里没有你用的芯片？当前内置 WCH CH58x / CH59x / CH57x，但数据格式不绑定厂商——欢迎按 [贡献指南](CONTRIBUTING.md) 加一颗，或直接提需求。通常就是“一个数据文件 + 清单一行”，不会写代码也完全可以提需求。

## 工程结构

```text
.
├── index.html                 # 入口；双击即用
├── js/
│   ├── engine/                # 芯片无关的纯逻辑（Node 可测）
│   │   ├── model.js           # schema 校验、chipId
│   │   ├── availability.js    # 冲突检测、候选、分配、状态
│   │   └── exporters.js       # CSV / Markdown / 工程 JSON
│   ├── render/                # 手写 SVG 封装图
│   │   ├── package-svg.js     # quad / dual / dual-split 封装渲染
│   │   └── interactions.js    # 缩放、平移
│   ├── app.js                 # UI 装配、状态、撤销
│   ├── loader.js              # manifest 动态加载与对账
│   └── util.js                # escapeHtml 等
├── chips/                     # 每文件一颗芯片
│   ├── manifest.js            # 清单（新增芯片必须加一行）
│   ├── wch-ch582m-qfn48.js    # CH582M 基线数据
│   ├── wch-ch582f-qfn28.js    # CH582F（QFN28 子集）
│   └── wch-ch583m-qfn48.js    # CH583M（+SPI1）
├── tests/                     # engine / fuzz / dist 三套测试
├── tools/                     # 发布组装、手册审计
├── installer/                 # Inno Setup 安装脚本
├── docs/
│   ├── user-guide.md          # 使用教程
│   ├── chip-data-schema.md    # 芯片数据 schema
│   ├── release.md             # 发布手册
│   ├── reference/             # 手册审计事实源与家族差异
│   └── superpowers/           # 设计史（spec / plan）
├── .github/workflows/         # ci.yml / release.yml
├── update.bat                 # 离线版一键更新
└── LICENSE
```

几个关键设计：

- **零依赖、无构建**：浏览器直接打开 `index.html`，不装包、不打包；
- **引擎与数据分离**：`js/engine/` 不认识任何具体芯片，芯片只是 `chips/` 下的数据文件；
- **file:// 优先**：浏览器侧禁用 ES modules，所有文件用 UMD-lite 尾巴，Node 测试可以直接 `require`；
- **数据即文档**：引脚、资源、约束都写在数据文件里，评审时逐脚对数据手册。

## 一起完善

欢迎各位朋友一起完善。最常见的两类贡献是**加芯片**和**修数据**——不需要你懂前端。

### 提一颗芯片（不会写代码也可以）

1. 打开 [芯片支持请求](https://github.com/amadeus-1048596/chip-pin-planner/issues/new/choose)，填型号、封装、公开数据手册链接，以及你关心的外设。
2. 我会先确认手册版本和数据可行性，在 Issue 里回复。
3. 如果你愿意动手：按 [CONTRIBUTING.md](CONTRIBUTING.md) 加一个数据文件 + `chips/manifest.js` 一行，跑测试后提 PR；没时间也没关系，我会排期加。
4. 评审时我会逐脚对数据手册，CI 必须全绿；合并后你的名字会写进 `meta.author` 和 Release notes。

### 提了之后，怎么一起维护？

- **谁加谁维护**：数据文件的 `meta.author` 是长期维护者标记。芯片行为、手册更新、封装差异，优先找该文件的作者。
- **只提需求也有署名**：合并时会在 commit / Release notes 里写 `requested by @你`；如果你帮忙在真实硬件上验证，也会一并致谢。
- **发现问题**：开 Issue（附手册页码/截图）；小修直接提 PR。
- **发版**：改动先合进 master，CI 跑 engine / fuzz / dist；攒一批芯片或功能后打 tag，`release.yml` 自动更新 Pages 和 Release，离线用户双击 `update.bat` 即可升级。
- **想长期一起维护？** 连续几个高质量 PR 后，我会邀请你成为 maintainer，给合并/发版权限。项目不大，门槛也不高。
- **署名**：默认用你的 GitHub 昵称；也可以在 PR 里指定想要的署名。

### 三种参与方式

| 方式 | 适合谁 | 怎么做 |
|---|---|---|
| 提需求 | 不写代码 / 暂时没时间 | 开 Issue，附手册链接和你关心的外设 |
| 加芯片 / 修数据 | 愿意对几页手册 | 一个数据文件 + manifest 一行，跑测试后提 PR |
| 改引擎 / UI | 熟悉 JS | 先写失败测试，再改实现；保持零依赖 |

## 规则

规则不多，主要是为了保证数据可信、发布稳定：

1. **数据以公开手册为准**，逐脚核对，不猜值；`meta.source` 必须写清手册型号、版本（有页码更好）。
2. **新芯片 = 一个数据文件 + `chips/manifest.js` 一行**。漏行不会报错，芯片会静默不显示。
3. **零依赖、无构建、`file://` 直开**；浏览器侧禁用 ES modules，统一使用 UMD-lite 尾巴。
4. **UI 文本中文**；进入 `innerHTML` 的字符串必须过 `escapeHtml`。
5. **先测试后实现**：PR 必须 CI 全绿；一颗芯片一个 PR，不夹带无关改动。
6. **同族多封装各建一个文件**，差异写进 `docs/reference/` 的家族差异文档。

## 功能范围

- **芯片数据**：当前内置 WCH CH58x / CH59x / CH57x 共 40 颗；数据格式与厂商无关，欢迎补充其他型号或提需求；
- **会话状态**：配置只存在当前会话内存里，刷新即清空——需要留存请用“保存工程”；
- **不包含**：不生成代码，也不做电气规则检查（ERC）或自动布线；
- **安装器**：未签名，Windows 可能弹 SmartScreen，选择“更多信息 → 仍要运行”即可。

## 常见问题

- **配置会保存吗？** 默认不保存：刷新即清空（各芯片的会话内状态互相独立）；需要留存请用“保存工程”导出 JSON。
- **为什么点引脚没反应？** 拖动超过 8px 会被判定为平移画布；请直接点击引脚焊盘。也可以从左侧资源目录分配。
- **怎么更新？** zip / 安装器用户双击 `update.bat`（比对在线 `version.json`），或重新下载 Release；在线版跟随最新 Release。
- **数据和我手上的手册不一致怎么办？** 开 Issue 并附页码/截图；以公开手册为准，确认后会更新数据并补测试。
- **能加自己的芯片吗？** 可以，见 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [数据 schema](docs/chip-data-schema.md)。

## 开发者

```bash
node tests/engine.test.js   # 引擎 + 芯片数据（247 条）
node tests/fuzz.js          # 随机操作 8000 次 + 不变量
node tests/dist.test.js     # 发布物 / zip / 安装器 / update.bat（需 Windows PowerShell）
```

发布流程见 [docs/release.md](docs/release.md)；设计史在 `docs/superpowers/`；给 AI 助手用的执行清单在 [AGENTS.md](AGENTS.md)。

## License

[MIT](LICENSE) © 2026 MeowG

Designed & maintained by **MeowG**.
