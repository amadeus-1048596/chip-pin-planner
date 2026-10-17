# 发布手册

从 master 到 Pages / Release 的完整流程。CI 跑在 `windows-latest`；本地需要 Git、Node.js LTS、PowerShell 5.1+。

## 一次性仓库设置（每个仓库只做一次）

在 GitHub 仓库页面：

1. **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
2. **Settings → Environments → `github-pages` → Deployment branches and tags**
   添加规则：**Tag `v*`**（默认只允许默认分支，tag 发布会被拒绝）。

> 第 2 步是 tag 发布的关键。漏掉时会报：
> `Tag "vX.Y" is not allowed to deploy to github-pages due to environment protection rules.`
>
> 同一仓库只需设置一次；**迁移/重建仓库后要重新设置**。
> 也可以用 API：`POST /repos/{owner}/{repo}/environments/github-pages/deployment-branch-policies`，body `{"name":"v*","type":"tag"}`。

## 发布步骤

### 1. 本地全绿

```bash
node tests/engine.test.js   # 期望：200 passed, 0 failed
node tests/fuzz.js          # 期望：退出码 0
node tests/dist.test.js     # 期望：8 passed, 0 failed（需 Windows PowerShell）
```

### 2. 更新版本字符串

版本号由 **git tag** 驱动（`version.json`、zip、安装器都取自 tag），但页面就绪日志里有一个硬编码版本：

- `js/app.js`：`log("就绪（vX.Y）：可用芯片 …")` —— 改成新版本号。

其他位置不需要手改（README 徽章、`version.json`、安装器版本均为动态）。

### 3. 提交并推送

```bash
git add -A
git commit -m "发布 vX.Y：<一句话>"
git push origin master
```

等 **ci.yml** 绿（Actions 页面）。CI 未过不要打 tag。

### 4. 打 tag 触发发布

```bash
git tag vX.Y
git push origin vX.Y
```

`release.yml` 会自动：

1. `node tools/assemble-dist.js --version vX.Y` 组装站点，写 `version.json`；
2. `Compress-Archive` 打 zip（**根平铺**）；
3. 把 zip 与 `version.json` 复制到 `site/download/`；
4. `choco install innosetup` 并编译 `installer/chip-pin-planner.iss`；
5. `configure-pages` → `upload-pages-artifact` → `deploy-pages`；
6. 生成 release notes（上一个 tag 到当前 tag 的提交；没有历史 tag 时列全部）；
7. `gh release create` 上传 zip + setup.exe。

约 3–6 分钟。

### 5. 发布后冒烟

| 检查 | 期望 |
|---|---|
| 打开 Pages | 页面底部日志：`就绪（vX.Y）：可用芯片 3 颗。` |
| 切芯片 | CH582F 显示 QFN28（29 个引脚含 EP）；CH583M 左栏有 SPI1 |
| 真实点击 | 点一个引脚 → 菜单 → 分配成功 → 再点可解除 |
| Release | zip 与 `chip-pin-planner-setup-vX.Y.exe` 都在 |
| 下载 zip | 解压 → 双击 `index.html` 可离线使用；根目录平铺 |
| `update.bat` | 产物目录双击 → `[SKIP] 已是最新 vX.Y`（**必须在 Pages 部署后测**） |
| 安装器（可选） | per-user 安装、无管理员；无签名会有 SmartScreen 提示 |

## 故障排查

| 报错 / 现象 | 原因与处理 |
|---|---|
| `Tag "vX.Y" is not allowed to deploy to github-pages due to environment protection rules.` | 一次性设置第 2 步未做；给 `github-pages` 环境加 `tag v*` 规则后重跑 |
| `git : fatal: Not a valid object name HEAD^`（Release notes 步骤） | 旧版工作流在只有一条提交的新仓库会失败；当前版本已修复（无父提交时列全部提交） |
| Release notes 中文乱码 | PowerShell 5.1 用本地代码页解码 git 输出；当前工作流已显式设置 UTF-8 输出编码 |
| `ISCC.exe` 找不到 | 确认 choco 已安装 Inno 6，路径为 `${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe` |
| `Compress-Archive` 报路径/通配错误 | 确认在仓库根目录运行；zip 目标在 `dist/` |
| Deploy Pages 报 `Get Pages site failed` / Not Found | Pages Source 未设为 GitHub Actions |
| `gh release create` 403 | 检查 workflow `permissions`（`contents/pages/id-token: write`）与 `GH_TOKEN` |
| `update.bat` 报 `[ERR] 网络不通` | Pages 尚未部署或 `download/version.json` 不存在；先确认在线地址可访问 |
| 发布后页面版本没变 | Pages 部署有缓存；等 Actions 完成后强制刷新，或检查是否部署了最新 artifact |

## 回滚

- 刚发的 Release / tag 有问题：
  ```bash
  gh release delete vX.Y --yes        # 或网页删除 Release
  git push --delete origin vX.Y       # 删除远端 tag
  git tag -d vX.Y                     # 删除本地 tag
  ```
- 修复后重新打 tag。**已经有人下载过的 Release 不建议移动 tag**；更稳妥的是发 `vX.Y.1`。

## 相关文件

- `.github/workflows/ci.yml`：push/PR 跑三套测试；
- `.github/workflows/release.yml`：tag `v*` 触发发布；
- `tools/assemble-dist.js`：组装 `dist/site` 与 `version.json`；
- `installer/chip-pin-planner.iss`：Inno Setup 脚本；
- `update.bat`：比对 Pages 上的 `download/version.json` 并覆盖自身目录。
