# 发布三件套 + 贡献指南 · 设计文档（子项目 #4）

- 日期：2026-10-16
- 版本：v1.9 计划（"结构优化"第四子项目，收官项）
- 状态：设计已定稿（2026-10-16 对话逐节通过），待实施计划
- 作者：MeowG（GitHub: amadeus-1048596）
- 前置：#1 多芯片 / #2 optional signals（v1.7）/ #3 多封装家族（v1.8，已验收 2026-10-16）

---

## 1. 背景与目标

v1.8 已验收，工具本体（三芯片、file:// 直开、零依赖）齐备。本轮把 v1.9 变成**可分发**形态，并解决用户 2026-10-16 新增的一类需求：**让别人也能加芯片**——包括"贡献者的 AI 照着文档就能干活"。

**范围（已定案沿革）**：三档位分期采纳（2026-10-07 定案）——现在 = HTML + 桌面快捷方式（已有）；**#4 = GitHub Pages 在线版 + zip 离线包 + 安装器（自解压，不做应用壳）+ update.bat（用户点名）**；打应用壳 exe 已否决。

**成功标准：**

1. 在线版 URL 点开即用（三芯片、永远最新），给外网/同事一键转发；
2. zip 解压双击 index.html 即用（离线/管控环境）；
3. 安装器：per-user 免管理员安装、开始菜单/桌面快捷方式、Windows 设置里可卸载；
4. update.bat 在任意已安装副本上双击 → 自动升到最新版（幂等）；
5. 贡献者（人或其 AI）仅凭 `CONTRIBUTING.md` / `AGENTS.md` / `docs/chip-data-schema.md` 就能独立完成"加一颗芯片"并按流程提 PR；
6. 发布全流程 tag 驱动、CI 完成；本机不装任何打包工具链。

## 2. 事实依据（2026-10-16 本机实测）

| 项 | 结论 | 证据 |
|---|---|---|
| 仓库现状 | 无 remote、无 LICENSE、无 .gitignore；master 本地 | `git remote -v` 空、`ls` 根目录 |
| 本机工具 | **无** Inno/NSIS/7z/gh CLI；**有** GitHub Desktop、choco、winget、Node v24.21.0、PowerShell、curl.exe（Win10+ 自带） | PATH 与安装目录实测 |
| 浏览器 | 有 Edge（Chromium 核）与 agent-browser 的 Chromium；**无 Firefox** | 实测 |
| 网络通道 | github.com 约 1/3 概率可通（重试必成）；api.github.com 限 60/时；raw.githubusercontent 全挂；github.io 未测 | 记忆 github-network-flaky + work-pc-web-access |
| 管控风险 | 本机对自制 exe 有拦截先例（亿格云/火绒）→ 安装器在本机是否可运行=实测项而非假设项 | 记忆 work-pc-endpoint-control |
| 既有约定 | 芯片数据 = `chips/*.js` 自注册 + `chips/manifest.js` 一行（漏行不报错的坑已在 README 注明） | v1.5 设计 + #3 交付 |

**现状缺口**（本轮补齐）：LICENSE、.gitignore、CI、打包/安装/更新脚本、贡献三文档、README 公共化。

## 3. 决策记录（2026-10-16 定案）

| # | 决策 | 结论 |
|---|------|------|
| D1 | 托管 | **GitHub public 仓库 `amadeus-1048596/chip-pin-planner`**；建仓/推送由用户经 GitHub Desktop 完成（唯一手工环节），其余全 CI |
| D2 | 发布架构 | **tag 驱动、全 CI**（windows runner）：`git push origin v1.9` 触发 release workflow；本机零打包工具链 |
| D3 | Pages 部署 | **Actions artifact 部署**（Settings→Pages→Source=GitHub Actions，用户设一次）：站点 payload + `download/{version.json, latest.zip}`；二进制不进 git。URL：`https://amadeus-1048596.github.io/chip-pin-planner/` |
| D4 | 安装器 | **Inno Setup**（CI 内 choco 安装）：per-user（`%LOCALAPPDATA%\Programs\chip-pin-planner`）、`PrivilegesRequired=lowest`、开始菜单+可选桌面快捷方式、标准卸载；**不捆绑运行时、不做应用壳**；无签名 → README 写明 SmartScreen"仍要运行" |
| D5 | update.bat | **Pages 单一通道**：下载 `download/version.json` 比对 → `download/latest.zip` 解压覆盖自身目录（`%~dp0`）；幂等；三种失败/状态文案（网络不通 / 已是最新 / 解压失败） |
| D6 | 三产物同 payload | 站点根文件 = `index.html` `css/` `js/` `chips/` `version.json`；zip/安装器另含 `update.bat` `README.md` `LICENSE`；`docs/` `tests/` `tools/` 仅仓内（在线版不带） |
| D7 | 贡献指南三件套 | `docs/chip-data-schema.md`（权威 schema 说明）+ `CONTRIBUTING.md`（人类流程）+ **`AGENTS.md`（根目录，贡献者的 AI 执行清单）**；另加 **`ci.yml`：PR 上跑单测+fuzz**（指南说"要跑测试"，CI 兜底执行） |
| D8 | 版本 | 本轮交付 = **v1.9**；应用内标记 v1.8→v1.9；tag `v1.9` = 发布点（v1.8 标签不动） |
| D9 | 冒烟范围 | Chromium（agent-browser）+ **Edge 真实双击 file://**；**Firefox 本机无 → 标"未实测"**，挂账靠外网反馈（诚实记录） |

## 4. 详细设计

### 4.1 仓库新增/修改文件

| 文件 | 类型 | 说明 |
|---|---|---|
| `.github/workflows/release.yml` | 新 | tag `v*` 触发：构建 zip、编译安装器、部署 Pages、建 Release |
| `.github/workflows/ci.yml` | 新 | PR/push 触发：`node tests/engine.test.js` + `node tests/fuzz.js` |
| `tools/assemble-dist.js` | 新 | 纯 Node：组装 staging 目录 + 写 `version.json`（本地/CI 同一脚本，可本地验证） |
| `installer/chip-pin-planner.iss` | 新 | Inno 脚本（AppId 固定 GUID、见 D4） |
| `update.bat` | 新 | 见 4.4；同时进 zip 与安装器 payload |
| `LICENSE` | 新 | MIT © 2026 amadeus-1048596 |
| `.gitignore` | 新 | `dist/`、`*.tmp`、`.superpowers/` 等 |
| `docs/chip-data-schema.md` | 新 | 见 4.6 |
| `CONTRIBUTING.md` / `AGENTS.md` | 新 | 见 4.6 |
| `README.md` | 改 | 顶部：在线版链接 + 下载（Releases）+ 贡献指引；保留开发者节 |
| `js/app.js` | 改 | 启动标记 v1.8→v1.9（一行） |

### 4.2 CI 流水线（release.yml，windows-latest）

1. checkout（tag 全历史）；从 tag 提取版本号 `v1.9`；
2. `node tools/assemble-dist.js --version v1.9 --out dist/` → staging = payload + `version.json`；
3. zip：pwsh `Compress-Archive` → `chip-pin-planner-v1.9.zip`（**文件在包根**）→ 同时拷为 `dist/download/latest.zip`；
4. Inno：`choco install innosetup -y` → `iscc installer/chip-pin-planner.iss /DVersion=1.9` → `chip-pin-planner-setup-v1.9.exe`；
5. Pages：`actions/upload-pages-artifact`（`dist/` = 站点 + `download/`）→ `actions/deploy-pages`；
6. Release：创建 tag 对应 Release，附 zip + setup.exe + changelog（自动列提交标题）。
7. 任一步失败 = 发布失败，无半成品（Release 最后一步创建）。

`version.json` 格式（`assemble-dist.js` 产出，站点根与 `download/` 各一份，内容相同）：

```json
{ "version": "v1.9", "zip": "latest.zip", "date": "2026-10-16" }
```

### 4.3 zip / 安装器结构约定

- zip 内**无顶层目录**，文件在根：`index.html` `css/` `js/` `chips/` `version.json` `update.bat` `README.md` `LICENSE`。
- 安装器安装同一集合到 `%LOCALAPPDATA%\Programs\chip-pin-planner\`。
- 快捷方式目标 = 安装目录 `index.html`（默认浏览器打开）。

### 4.4 update.bat 行为规格

```
1. curl.exe -sSL --max-time 60 "https://amadeus-1048596.github.io/chip-pin-planner/download/version.json" -o "%TEMP%\cpp-ver.json"
   失败 → 打印"网络不通（手动下载：https://github.com/amadeus-1048596/chip-pin-planner/releases）"，退出 1
2. 读本地 %~dp0version.json 的 version（缺失视为未知）与远端比对；相同 → "已是最新 <v>"，退出 0
3. curl.exe 下载 latest.zip → %TEMP%\cpp-latest.zip；Expand-Archive 到 %TEMP%\cpp-new\
   失败 → "解压失败，请手动下载"，退出 1
4. robocopy %TEMP%\cpp-new %~dp0 /E /NFL /NDL /NJH（新包内的新版 update.bat 会覆盖旧脚本，无碍）
5. 打印"已更新到 <新版本>；请重新打开/刷新 index.html"
```

- 编码/路径：全引号处理（支持中文与空格路径）；`chcp 65001` 置于头部防乱码。
- 幂等：重复双击 = 已是最新提示。

### 4.5 Inno 脚本要点（.iss）

- `AppId` 固定 GUID（一次性生成写死）；`AppName=芯片引脚规划器`；`AppVersion` 由 `/DVersion` 注入；
- `PrivilegesRequired=lowest`（免管理员）；`DefaultDirName={localappdata}\Programs\chip-pin-planner`；
- 开始菜单项必装、桌面快捷方式可选（默认勾选）；
- 无自定义安装逻辑、无注册表业务键；标准卸载器（`UninstallDisplayName`）；
- `.iss` 内文件清单 = 4.3 集合（相对路径，CI 里编译时工作目录 = staging）。

### 4.6 贡献文档大纲

**`docs/chip-data-schema.md`（权威 schema 说明）**：① 文件骨架（UMD-lite 尾巴、schemaVersion ≤ 引擎上限）；② 顶层字段表（id/meta/chip/package/pins/globalConfigs/resources）；③ pins 字段（num/name/type/alts/note，电源/晶振/RF 类型）；④ resources 全约束（signals.pins 落脚点、groupSwitch=2 脚语义、groupKey 同切、modes 与 optional 层级、perPin）；⑤ 校验与闸门（`validateChip` 零错为硬门；未知版本→"需要更新版本的工具"）；⑥ 最小完整示例（10 行级迷你芯片）。**维护约定**：文档为说明、`validateChip` 为硬门，两者冲突以验证器为准并修文档。

**`CONTRIBUTING.md`（人类）**：欢迎语 → 加芯片三步（抄 `chips/wch-ch582m-qfn48.js` → 按手册填 → `chips/manifest.js` 加一行【强调：漏行无报错】）→ 跑 `node tests/engine.test.js`（须全绿）→ 数据来源要求（手册型号+版本，写入 `meta.source`）→ 同族多封装走 `docs/reference/ch58x-family-diff.md` 机制 → PR 清单（描述芯片/封装/来源/测试结果）→ 行为准则一句话。

**`AGENTS.md`（贡献者的 AI）**：执行清单式——repo 地图；`docs/chip-data-schema.md` 指针；**硬规则**（零依赖无构建、file:// 下禁 ES modules、UI 文本中文、进 innerHTML 必须 escapeHtml、id slug 小写连字符）；**完成定义**=validateChip 零错 + 单测全绿 + manifest 已加 + README 步骤未破坏；常见坑（清单漏行静默、schemaVersion 超限被闸、双占冲突语义）；禁止事项（不得生成代码、不改引擎除非对应测试）。

## 5. 测试与验收

- **CI 自检**：release 全流程本身即集成测试；ci.yml 保证 PR 不退步。
- **本地可验证部分**：`node tools/assemble-dist.js` 本地跑出 staging + version.json（单测：产物清单断言，新增 1 条 Node 测试）。
- **冒烟（D9）**：发布后 —— ①agent-browser(Chromium) 打开 Pages URL 跑三芯片冒烟（下拉切换/CH582F 图/CH583M SPI1）；②zip 解压到本地，Edge 真实双击 file:// 打开；火狐未实测挂账。
- **用户验收清单**：
  1. 在线版链接（github.io）打开 → "就绪（v1.9）：可用芯片 3 颗"；
  2. zip 解压 → 双击 index.html 即用；
  3. 安装器：安装（非管理员）→ 快捷方式可开 → Windows 设置内卸载干净；
  4. update.bat：在旧版副本上双击 → 升到最新（幂等再双击提示已最新）。
- **前置门（实测项）**：安装器在本管控机运行一次——**被拦如实记录**（不影响外网用户可用性）。

## 6. 明确不做（留档）

应用壳 exe（已否决）；代码签名证书（成本，SmartScreen 提示以文档化解）；UI 内自动更新按钮；Gitee 镜像；英文 README（WCH 受众中文为主，需要再加）；chips 生成器/共享核心（复议触发器未到，见 #3 spec D1'-Trigger）。

## 7. 收尾

- 版本 **v1.9**；实现前回退点 = tag `v1.8`（已存在，无需再打）；收尾 tag `v1.9` = 发布点。
- 流程：本 spec 用户评审通过 → 实施计划（writing-plans）→ TDD 实施（CI/打包类任务以"本地可跑通的脚本 + 一次真实 tag 发布"验收）。
