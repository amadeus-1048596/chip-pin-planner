# 芯片引脚规划器（Chip Pin Planner）

画板前的"引脚沙盘"：在芯片封装图上点选引脚分配功能，冲突资源自动禁用/标红，导出引脚清单用于画原理图。
**不生成代码**，就是资源规划工具。

> **在线版（永远最新）**：https://amadeus-1048596.github.io/chip-pin-planner/
> **下载**：[Releases](https://github.com/amadeus-1048596/chip-pin-planner/releases)（zip 解压双击 `index.html` 即用；或安装器 `setup.exe`，已装的旧版双击 `update.bat` 一键升级）
> **想加一颗芯片？** 看 [CONTRIBUTING.md](CONTRIBUTING.md)；用 AI 加的话把仓库和 [AGENTS.md](AGENTS.md) 丢给它。

## 用法

双击 `index.html` 即可（Chrome/Edge，无需安装、无需联网）。

- 点封装图上的引脚 → 弹出完整功能列表（CubeMX 式）：不可用项置灰并注明原因（悬停可看），含「映射组」选项可直接点选（自动整组切换）
- 点左侧资源目录 → 一键分配（默认组被占时自动改用映射组，底部日志会说明）；再点一次解除
- 左侧资源带**可用性色点**：绿 = 默认组可落；黄 = 默认组被占（将自动走映射组）；红 = 无落脚点（悬停看缺脚明细；已分配的资源显示绿底、不带点）
- 可选信号：先分配资源，再在右栏「＋ 添加信号」按需添加（如 UART0 的 MODEM 六信号 RTS/CTS/DTR/DSR/RI/DCD）；已加的信号可点 × 单独移除；不可用时菜单置灰并说明原因（如"须与 DTR 同侧"）
- SPI0 四种模式：主机·全双工3线 / 主机·半双工2线 / 从机·全双工4线 / 从机·半双工3线（从机片选 SCS 必选；主机模式 SCS 可作为可选信号添加）
- 左侧「系统配置」新增 RF 天线开关（PB16-21）——启用会占用全部六脚（用途为 AoA/AoD 多天线切换，官方当前建议保持关闭）
- 带**模式**的外设（如 SPI0）：左栏点击后先选模式再分配；右栏已分配行可随时用下拉切换模式——切换会保留已加的可选信号，保不住则整体中止并说明（冲突会被拦截）
- 左侧「系统配置」开关控制调试口 / RST / 32K 晶振等系统占用
- 右侧「已分配」面板：整组切换映射、解除、清除 GPIO
- 顶栏导出：CSV / Markdown 引脚清单、工程 JSON、封装图 SVG（彩蛋）
- 顶栏芯片下拉：多颗芯片一键切换（各芯片配置在会话内互不影响，刷新即清空；载入工程会自动切到文件所属芯片——无芯片标识的老工程按工程内的芯片名+封装匹配）
- Ctrl+Z 撤销

## 开发者

- 零依赖、无构建。引擎（`js/engine/`）是芯片无关纯逻辑；每颗芯片 = `chips/` 下一个数据文件。
- 单测：`node tests/engine.test.js`
- 设计文档：`docs/superpowers/specs/`；实施计划：`docs/superpowers/plans/`
- 新增芯片（**两步缺一不可**）：① 照 `chips/wch-ch582m-qfn48.js` 抄一份（改 `id` 与 `chip` 字段），按手册填 `pins` / `globalConfigs` / `resources`（schema 见设计文档 §5）；② 在 `chips/manifest.js` 清单里加一行——file:// 下无法扫描目录，**漏加这一行该芯片不会出现且没有任何报错**。
- 浏览器加载用传统 `<script>`（file:// 下 ES modules 被 CORS 挡）；引擎/数据文件统一带 UMD-lite 尾巴，Node 侧可直接 require 做测试。
