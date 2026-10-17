# 芯片引脚规划器（Chip Pin Planner）

[![CI](https://github.com/amadeus-1048596/chip-pin-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/amadeus-1048596/chip-pin-planner/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/amadeus-1048596/chip-pin-planner?display_name=tag)](https://github.com/amadeus-1048596/chip-pin-planner/releases)
[![在线版](https://img.shields.io/badge/online-demo-brightgreen)](https://amadeus-1048596.github.io/chip-pin-planner/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

画板前的“引脚沙盘”：在芯片封装图上点选外设引脚，实时看到占用、冲突与可选方案，最后导出引脚清单去画原理图。
**不生成代码**，就是资源规划工具。零依赖、纯静态，双击 `index.html` 即用。

![界面总览](docs/images/overview.png)

## 快速开始

- **在线版（推荐，永远最新）**：<https://amadeus-1048596.github.io/chip-pin-planner/>
- **离线 zip**：到 [Releases](https://github.com/amadeus-1048596/chip-pin-planner/releases) 下载 `chip-pin-planner-vX.Y.zip`，解压后双击 `index.html`（无需联网、无需安装）
- **安装器**：下载 `chip-pin-planner-setup-vX.Y.exe`，per-user 安装（无需管理员）；已安装的旧版双击产物目录里的 `update.bat` 一键升级

支持 Chrome / Edge。`file://` 直接打开即可，不需要本地服务器。

## 5 分钟上手

1. **选芯片**：顶栏下拉选择型号与封装（当前支持 CH582M / CH582F / CH583M）。
2. **分配引脚**，两种方式任选：
   - 点封装图上的引脚 → 从菜单选功能。不可用项会置灰并说明原因。

     ![引脚菜单](docs/images/pin-menu.png)

   - 或点左侧资源目录里的外设（如 UART1）→ 一键分配；再点一次解除。
3. **看冲突**：被占用的脚自动置灰/标色；左侧资源前的色点表示可用性——🟢 绿 = 默认可落，🟡 黄 = 默认组被占（会自动改用映射组），🔴 红 = 无落脚点。
4. **可选信号与模式**：先分配资源，再在右栏“＋ 添加信号”添加 MODEM、片选等可选信号；带模式的外设（如 SPI0）可在右栏切换主机/从机、全双工/半双工。
5. **导出**：顶栏可导出 CSV / Markdown 引脚清单、工程 JSON（下次载入继续）、封装图 SVG。
6. **保存进度**：点“保存工程”下载 JSON；“载入工程”会自动切到对应芯片。

完整说明（映射组、可选信号、GPIO 命名、快捷键与常见问题）见 **[使用教程](docs/user-guide.md)**。

## 支持的芯片

| 型号 | 封装 | IO | 说明 |
|---|---|---|---|
| CH582M | QFN48 | 40 | 基线数据（CH583DS1 V1.9） |
| CH582F | QFN28 | 20 | CH582M 的 QFN28 子集封装 |
| CH583M | QFN48 | 40 | CH582M + SPI1 主机 |

缺你用的芯片？芯片数据是纯文本，欢迎按 [贡献指南](CONTRIBUTING.md) 加一颗——通常就是“一个数据文件 + 清单一行”。

## 常见问题

- **配置会保存吗？** 刷新即清空（各芯片的会话内状态互相独立）。需要留存请用“保存工程”导出 JSON。
- **为什么点引脚没反应？** 拖动超过 8px 会被判定为平移画布；请直接点击引脚焊盘。也可以从左侧资源目录分配。
- **为什么不生成代码？** 工具只负责“哪些脚用来做什么”的规划与冲突校验；代码生成不在范围内。
- **怎么更新？** zip/安装器用户双击 `update.bat`（比对在线 `version.json`），或重新下载 Release；在线版永远最新。
- **能加自己的芯片吗？** 可以，见 [CONTRIBUTING.md](CONTRIBUTING.md) 与 [数据 schema](docs/chip-data-schema.md)。

## 开发者

零依赖、无构建；浏览器侧使用传统 `<script>`（`file://` 下 ES modules 会被 CORS 挡）。

```bash
node tests/engine.test.js   # 引擎 + 芯片数据（200 条）
node tests/fuzz.js          # 随机操作 8000 次 + 不变量
node tests/dist.test.js     # 发布物 / zip / 安装器 / update.bat（需 Windows PowerShell）
```

- `js/engine/` 芯片无关纯逻辑；`js/render/` SVG 渲染；`js/app.js` UI
- `chips/*.js` 每文件一颗芯片；`chips/manifest.js` 清单（⚠️ 漏行会静默不显示）
- 发布流程（tag → CI → Pages/Release）见 [docs/release.md](docs/release.md)
- 设计史在 `docs/superpowers/`；数据 schema 见 [docs/chip-data-schema.md](docs/chip-data-schema.md)

## 贡献

欢迎加芯片、修数据、提改进。请先读 [CONTRIBUTING.md](CONTRIBUTING.md)；用 AI 加芯片可以让它读 [AGENTS.md](AGENTS.md)。

## License

[MIT](LICENSE) © 2026 amadeus-1048596
