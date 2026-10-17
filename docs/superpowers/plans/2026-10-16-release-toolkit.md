# 发布三件套 + 贡献指南 实施计划（v1.9 · 子项目 #4）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付可分发形态（Pages 在线版 + zip + Inno 安装器 + update.bat，全 CI）+ 贡献指南三件套（人 + AI 都能照着加芯片），版本 v1.9。

**Architecture:** tag 驱动全 CI（assemble-dist → zip → Inno(choco) → Pages artifact → Release）；本机零打包工具链；`update.bat` 走 Pages 单一通道（`download/version.json` + `latest.zip`）；contributor 文档三份（schema 权威说明 / CONTRIBUTING 人类流程 / AGENTS.md 给贡献者的 AI）+ PR CI 兜底。

**Tech Stack:** 零依赖原生 JS（Node 24 跑工具与测试）；Windows 批处理 + curl.exe + PowerShell 5.1（update.bat）；Inno Setup 6（仅 CI 安装）；GitHub Actions（windows-latest）。

**Spec:** `docs/superpowers/specs/2026-10-16-release-toolkit-design.md`

## Global Constraints

- 保持零依赖、无构建；本机不装任何打包工具链；发布全流程在 CI 完成。
- 仓库：`github.com/amadeus-1048596/chip-pin-planner`（public，MIT © 2026 amadeus-1048596）。
- 版本：本轮 = **v1.9**；应用内启动标记 `js/app.js` v1.8→v1.9；tag `v1.9` = 发布点（v1.8 标签不动）。
- payload 清单（D6）：站点根 = `index.html` `css/` `js/` `chips/` `version.json`；zip/安装器另含 `update.bat` `README.md` `LICENSE`；`docs/` `tests/` `tools/` **不进产物**。
- update.bat：单通道 Pages，基址 `https://amadeus-1048596.github.io/chip-pin-planner`（可被环境变量 `CPP_UPDATE_BASE` 覆盖供测试）；输出稳定 ASCII 标记 `[OK]/[SKIP]/[ERR]`；退出码 0/1；幂等。
- Inno：`PrivilegesRequired=lowest`、`DefaultDirName={localappdata}\Programs\chip-pin-planner`、不捆绑运行时、不做应用壳；`.iss` 存 **UTF-8 with BOM**。
- 测试命令：`node tests/engine.test.js`（现有 200 条必须保持全绿）、`node tests/fuzz.js`、**新增 `node tests/dist.test.js`**；全部在 Windows 上跑（powershell 5.1 兼容 cmdlet）。
- 全部 UI/文档文案中文；命令、标记 token 用 ASCII。

## Review Focus（最易咬人的五类 → 各自测试归属）

1. **中文/空格路径全链路**（update.bat 的 curl/findstr/Expand-Archive/robocopy 都要在 `含 空格与中文 的目录` 下工作）——Task 2 测试 1。
2. **断网/超时不得误判**（必须报"网络不通"且退出 1，不得当成"已是最新"）——Task 2 测试 3。
3. **zip 根平铺**（多一层顶层目录 = 解压出嵌套文件夹、双击体验崩）——Task 3 zip roundtrip 测试。
4. **幂等与自覆盖**（重复双击="已最新"；升级后旧 update.bat 被新包覆盖仍能再次工作）——Task 2 测试 2/4。
5. **两处 version.json 同源一致**（站点根与 download/ 必须同版本；CI 拼装顺序错了会出现线上"更新永远提示有新版本"）——Task 6 本地彩排断言。

---

### Task 1: 仓库基建（LICENSE / .gitignore / v1.9 标记）

**Files:**
- Create: `LICENSE`
- Create: `.gitignore`
- Modify: `js/app.js:65`

**Interfaces:**
- Produces: `LICENSE`（existence guaranteed for Task 3 payload）；`.gitignore` 规则 `dist/` `*.tmp` `.superpowers/`；`js/app.js` 标记字符串 `就绪（v1.9）`。

- [ ] **Step 1: 写 LICENSE（MIT 全文，版权行 `Copyright (c) 2026 amadeus-1048596`）**

```text
MIT License

Copyright (c) 2026 amadeus-1048596

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: 写 .gitignore**

```text
dist/
*.tmp
.superpowers/
```

- [ ] **Step 3: js/app.js 启动标记 v1.8→v1.9**

把 `log("就绪（v1.8）：可用芯片 "` 改为 `log("就绪（v1.9）：可用芯片 "`。

- [ ] **Step 4: 验证**

Run: `node --check js/app.js && node tests/engine.test.js 2>&1 | tail -1`
Expected: 语法 ok；`200 passed, 0 failed`。

- [ ] **Step 5: 提交**

```bash
git add LICENSE .gitignore js/app.js
git commit -m "chore: LICENSE (MIT) + .gitignore + v1.9 marker"
```

---

### Task 2: update.bat（Pages 单通道、幂等、中文路径安全）

**Files:**
- Create: `update.bat`
- Create: `tests/dist.test.js`（本任务建骨架 + update.bat 集成测试；Task 3/4 继续往里加）
- Test: `tests/dist.test.js`

**Interfaces:**
- Produces: `update.bat`（环境变量 `CPP_UPDATE_BASE` 覆盖基址；输出含 `[OK]`/`[SKIP]`/`[ERR]`；exit 0/1）；`tests/dist.test.js` 的异步测试骨架（`tests` 数组 + AsyncFunction 支持 + 末尾统一汇总）。
- 注意：**本地缺 `version.json` 时拒绝更新（`[ERR]` 退出 1）**——防在开发目录（D:\Code_Project\chip-pin-planner，无 version.json）里双击误覆盖源码；这是对 spec §4.4"缺失视为未知"的安全细化（裁定记入 ledger）。

- [ ] **Step 1: 写集成测试骨架 + update.bat 四场景（先全红）**

`tests/dist.test.js` 完整内容：

```js
"use strict";
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync, execFileSync, spawnSync, spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const Dist = require("../tools/assemble-dist.js");   // Task 3 提供；本步骤先建文件（见 Step 2 说明）
let pass = 0, fail = 0;
const tests = [];
function t(name, fn) { tests.push({ name: name, fn: fn }); }

function tmpdir(tag) { return fs.mkdtempSync(path.join(os.tmpdir(), "cpp-dist-" + tag + "-")); }
function hasPwsh() { return spawnSync("powershell", ["-NoProfile", "-Command", "exit 0"]).status === 0; }
function pwsh(cmd) { execFileSync("powershell", ["-NoProfile", "-Command", cmd], { stdio: ["ignore", "pipe", "pipe"] }); }
function buildFixtureZip(version, dir) {
  const site = Dist.assemble(version, path.join(dir, "fixture-" + version));
  fs.writeFileSync(path.join(site, "js", "_fixture_new.txt"), version + "\n");
  const zip = path.join(dir, "fixture-" + version + ".zip");
  pwsh("Compress-Archive -Path '" + site + "/*' -DestinationPath '" + zip + "' -Force");
  return zip;
}
function startFixtureServer(version, zipPath) {
  const meta = JSON.stringify({ version: version, zip: "latest.zip", date: "2026-01-01" });
  const code = 'const http=require("http"),fs=require("fs");' +
    'const zip=fs.readFileSync(process.argv[1]);' +
    'const srv=http.createServer((q,s)=>{' +
    'if(q.url==="/download/version.json"){s.setHeader("content-type","application/json");s.end(' + JSON.stringify(meta) + ');}' +
    'else if(q.url==="/download/latest.zip"){s.end(zip);}' +
    'else {s.statusCode=404;s.end();}});' +
    'srv.listen(0,"127.0.0.1",()=>console.log(srv.address().port));';
  const child = spawn(process.execPath, ["-e", code, zipPath], { stdio: ["ignore", "pipe", "inherit"] });
  return new Promise(function (resolve, reject) {
    child.stdout.once("data", function (d) { resolve({ port: parseInt(String(d).trim(), 10), child: child }); });
    child.once("exit", function () { reject(new Error("fixture server 提前退出")); });
  });
}
function runUpdateBat(installDir, base, logName) {
  // 用 cwd + 相对名调用：避开 "cmd /c \"含空格路径\"" 的引号剥离坑（目录名带空格/中文也安全）
  let status = 0;
  try {
    execSync("update.bat > " + logName + " 2>&1", { cwd: installDir,
      env: Object.assign({}, process.env, { CPP_UPDATE_BASE: base }), stdio: "ignore" });
  } catch (e) { status = e.status || 999; }
  const logFile = path.join(installDir, logName);
  const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, "latin1") : "";
  return { status: status, log: log };
}
function readVersion(dir) { return JSON.parse(fs.readFileSync(path.join(dir, "version.json"), "utf8")).version; }

console.log("\n=== dist: update.bat ===");

t("update.bat：中文/空格路径下从 v1.8 升到 v1.9（[OK]，文件真被覆盖）", async function () {
  if (!hasPwsh()) { console.log("       (skip: 无 powershell)"); return; }
  const dir = tmpdir("upd") + "/安装 目录 test";
  fs.mkdirSync(dir, { recursive: true });
  const oldSite = Dist.assemble("v1.8", path.join(dir, "old-src"));
  for (const f of fs.readdirSync(oldSite)) fs.cpSync(path.join(oldSite, f), path.join(dir, f), { recursive: true });
  const zip = buildFixtureZip("v1.9", dir);
  const fx = await startFixtureServer("v1.9", zip);
  try {
    const r = runUpdateBat(dir, "http://127.0.0.1:" + fx.port, "run1.log");
    assert.strictEqual(r.status, 0, "exit 应为 0；log=" + r.log);
    assert.ok(r.log.includes("[OK]"), "应含 [OK]；log=" + r.log);
    assert.strictEqual(readVersion(dir), "v1.9", "version.json 应已升到 v1.9");
    assert.ok(fs.existsSync(path.join(dir, "js", "_fixture_new.txt")), "新包文件应落盘");
    const r2 = runUpdateBat(dir, "http://127.0.0.1:" + fx.port, "run2.log");
    assert.strictEqual(r2.status, 0);
    assert.ok(r2.log.includes("[SKIP]"), "升级后再跑应 [SKIP]（update.bat 被新包自覆盖后仍工作）；log=" + r2.log);
  } finally { fx.child.kill(); }
});

t("update.bat：幂等——再跑一次 [SKIP] 且文件不动", async function () {
  if (!hasPwsh()) { console.log("       (skip: 无 powershell)"); return; }
  const dir = tmpdir("idem") + "/中文 目录";
  fs.mkdirSync(dir, { recursive: true });
  const site = Dist.assemble("v1.9", path.join(dir, "src"));
  for (const f of fs.readdirSync(site)) fs.cpSync(path.join(site, f), path.join(dir, f), { recursive: true });
  const zip = buildFixtureZip("v1.9", dir);
  const fx = await startFixtureServer("v1.9", zip);
  try {
    const r = runUpdateBat(dir, "http://127.0.0.1:" + fx.port, "run1.log");
    assert.strictEqual(r.status, 0);
    assert.ok(r.log.includes("[SKIP]"), "应含 [SKIP]；log=" + r.log);
  } finally { fx.child.kill(); }
});

t("update.bat：连不上网 → [ERR] 且 exit 1（不得误判为最新）", function () {
  const dir = tmpdir("neterr");
  const site = Dist.assemble("v1.9", path.join(dir, "src"));
  for (const f of fs.readdirSync(site)) fs.cpSync(path.join(site, f), path.join(dir, f), { recursive: true });
  const r = runUpdateBat(dir, "http://127.0.0.1:1", "run.log");
  assert.strictEqual(r.status, 1, "exit 应为 1；log=" + r.log);
  assert.ok(r.log.includes("[ERR]"), "应含 [ERR]；log=" + r.log);
  assert.strictEqual(readVersion(dir), "v1.9", "本地版本不得被动");
});

t("update.bat：开发目录防护——缺本地 version.json → [ERR] 拒绝更新", function () {
  const dir = tmpdir("guard");
  fs.copyFileSync(path.join(ROOT, "update.bat"), path.join(dir, "update.bat"));
  const r = runUpdateBat(dir, "http://127.0.0.1:1", "run.log");
  assert.strictEqual(r.status, 1);
  assert.ok(r.log.includes("[ERR]"), "log=" + r.log);
  assert.ok(!fs.existsSync(path.join(dir, "index.html")), "不得写入任何站点文件");
});

(async function () {
  for (const x of tests) {
    try { await x.fn(); pass++; console.log("  PASS " + x.name); }
    catch (e) { fail++; console.error("  FAIL " + x.name + "\n       " + (e && e.message)); }
  }
  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
```

同时先建 `tools/assemble-dist.js` **桩**（本步骤为了让测试文件可 require 并能构造夹具，桩即 Task 3 的完整实现——**直接按 Task 3 Step 2 的完整代码建文件**，即本任务与 Task 3 共用实现，不算越任务，接口一致）。

- [ ] **Step 2: 写 update.bat（完整文件如下；UTF-8 无 BOM 保存）**

```bat
@echo off
setlocal
chcp 65001 >nul
title 芯片引脚规划器 - 更新

rem 更新源（环境变量可覆盖，供测试/镜像）
if "%CPP_UPDATE_BASE%"=="" set "CPP_UPDATE_BASE=https://amadeus-1048596.github.io/chip-pin-planner"
set "VER_URL=%CPP_UPDATE_BASE%/download/version.json"
set "ZIP_URL=%CPP_UPDATE_BASE%/download/latest.zip"

rem 开发目录防护：没有 version.json 说明不是 zip/安装器 装的副本
if not exist "%~dp0version.json" (
  echo [ERR] 未找到 version.json，这不是通过 zip/安装器安装的目录，已退出。
  exit /b 1
)

set "TMPD=%TEMP%\cpp-update-%RANDOM%%RANDOM%"
mkdir "%TMPD%" 2>nul

echo 正在检查更新（%VER_URL%）...
curl.exe -sSL --max-time 60 -o "%TMPD%\version.json" "%VER_URL%"
if errorlevel 1 goto :neterr

rem 解析远端版本（用 PowerShell 正经解析 JSON，避开批处理引号转义雷区）
set "REMOTE="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw '%TMPD%\version.json' | ConvertFrom-Json).version"`) do set "REMOTE=%%a"
if not defined REMOTE goto :neterr

rem 解析本地版本
set "LOCAL="
for /f "usebackq delims=" %%a in (`powershell -NoProfile -Command "(Get-Content -Raw '%~dp0version.json' | ConvertFrom-Json).version"`) do set "LOCAL=%%a"

if /i "%REMOTE%"=="%LOCAL%" (
  echo [SKIP] 已是最新 %LOCAL%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 0
)

echo 发现新版本 %REMOTE%（当前 %LOCAL%），开始下载...
curl.exe -sSL --max-time 300 -o "%TMPD%\latest.zip" "%ZIP_URL%"
if errorlevel 1 goto :neterr

powershell -NoProfile -Command "Expand-Archive -LiteralPath '%TMPD%\latest.zip' -DestinationPath '%TMPD%\new' -Force"
if errorlevel 1 (
  echo [ERR] 解压失败，请手动下载：%CPP_UPDATE_BASE%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 1
)

robocopy "%TMPD%\new" "%~dp0." /E /NFL /NDL /NJH /NJS >nul
if errorlevel 8 (
  echo [ERR] 覆盖文件失败，请手动下载：%CPP_UPDATE_BASE%
  rmdir /s /q "%TMPD%" 2>nul
  exit /b 1
)

rmdir /s /q "%TMPD%" 2>nul
echo [OK] 已更新到 %REMOTE%；请重新打开或刷新 index.html
exit /b 0

:neterr
echo [ERR] 网络不通（手动下载：https://github.com/amadeus-1048596/chip-pin-planner/releases）
rmdir /s /q "%TMPD%" 2>nul
exit /b 1
```

- [ ] **Step 3: 跑测试确认全绿**

Run: `node tests/dist.test.js`
Expected: `4 passed, 0 failed`（若出现 powershell 缺失则 skip 两条为 PASS）。

- [ ] **Step 4: 提交**

```bash
git add update.bat tests/dist.test.js tools/assemble-dist.js
git commit -m "feat: update.bat (Pages one-channel updater, idempotent, CJK-path safe) + dist test harness + assemble-dist"
```

---

### Task 3: tools/assemble-dist.js（staging 组装 + version.json）

**Files:**
- Create: `tools/assemble-dist.js`（若 Task 2 已建则确认内容一致）
- Test: `tests/dist.test.js`（追加）

**Interfaces:**
- Produces: `assemble(version, outDir) -> sitePath`（`outDir/site/` = payload + `version.json`）；模块导出 `{ assemble, PAYLOAD }`，`PAYLOAD = ["index.html","css","js","chips","update.bat","README.md","LICENSE"]`；CLI `node tools/assemble-dist.js --version vX --out dist`。
- Consumes: Task 1 的 `LICENSE`、Task 2 的 `update.bat`（缺任一个则 `assemble` 抛"缺失 payload 文件"）。

- [ ] **Step 1: 追加测试（组装正确性 + zip 平铺 roundtrip）**

在 `tests/dist.test.js` 的 `=== dist: update.bat ===` 段之前**插入**：

```js
console.log("\n=== dist: assemble-dist ===");

t("assemble：产物在 site 根、清单精确、排除 tests/docs/tools、version.json 正确", function () {
  const out = tmpdir("asm");
  const site = Dist.assemble("v9.9-test", out);
  const names = fs.readdirSync(site).sort();
  assert.deepStrictEqual(names,
    ["LICENSE", "README.md", "chips", "css", "index.html", "js", "update.bat", "version.json"].sort());
  const vj = JSON.parse(fs.readFileSync(path.join(site, "version.json"), "utf8"));
  assert.strictEqual(vj.version, "v9.9-test");
  assert.strictEqual(vj.zip, "latest.zip");
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(vj.date), "date 应为 YYYY-MM-DD：" + vj.date);
  assert.ok(fs.existsSync(path.join(site, "chips", "manifest.js")), "chips 目录应含 manifest.js");
  assert.ok(!fs.existsSync(path.join(site, "docs")) && !fs.existsSync(path.join(site, "tests"))
            && !fs.existsSync(path.join(site, "tools")), "docs/tests/tools 不得进产物");
  fs.rmSync(out, { recursive: true, force: true });
});

t("zip：Compress-Archive 包根平铺、可解压、含 update.bat 与 version.json（与 CI 同命令）", function () {
  if (!hasPwsh()) { console.log("       (skip: 无 powershell)"); return; }
  const out = tmpdir("zip");
  const site = Dist.assemble("v9.9-zip", out);
  const zipPath = path.join(out, "out.zip");
  pwsh("Compress-Archive -Path '" + site + "/*' -DestinationPath '" + zipPath + "' -Force");
  const ex = path.join(out, "ex");
  pwsh("Expand-Archive -LiteralPath '" + zipPath + "' -DestinationPath '" + ex + "' -Force");
  assert.ok(fs.existsSync(path.join(ex, "index.html")), "zip 根应直接有 index.html（平铺，不得多一层目录）");
  assert.ok(fs.existsSync(path.join(ex, "update.bat")));
  assert.ok(fs.existsSync(path.join(ex, "chips", "manifest.js")));
  assert.strictEqual(JSON.parse(fs.readFileSync(path.join(ex, "version.json"), "utf8")).version, "v9.9-zip");
  fs.rmSync(out, { recursive: true, force: true });
});
```

- [ ] **Step 2: 实现 tools/assemble-dist.js（完整文件）**

```js
/* 组装发布 staging：把静态站点 payload 拷进 out/site 并写 version.json（CI 与本地同一脚本） */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PAYLOAD = ["index.html", "css", "js", "chips", "update.bat", "README.md", "LICENSE"];

function parseArgs(argv) {
  const out = { version: null, out: "dist" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--version") out.version = argv[++i];
    else if (argv[i] === "--out") out.out = argv[++i];
  }
  return out;
}

function copyEntry(src, dst) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dst, { recursive: true });
    for (const name of fs.readdirSync(src)) copyEntry(path.join(src, name), path.join(dst, name));
  } else {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
}

function assemble(version, outDir) {
  const site = path.join(outDir, "site");
  fs.rmSync(site, { recursive: true, force: true });
  fs.mkdirSync(site, { recursive: true });
  for (const rel of PAYLOAD) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) throw new Error("缺失 payload 文件：" + rel);
    copyEntry(src, path.join(site, rel));
  }
  const versionJson = { version: version, zip: "latest.zip", date: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(path.join(site, "version.json"), JSON.stringify(versionJson, null, 2) + "\n");
  return site;
}

if (require.main === module) {
  const a = parseArgs(process.argv.slice(2));
  if (!a.version) { console.error("用法：node tools/assemble-dist.js --version vX.Y [--out dist]"); process.exit(1); }
  const site = assemble(a.version, path.resolve(a.out));
  console.log("staging → " + site);
}

module.exports = { assemble: assemble, PAYLOAD: PAYLOAD };
```

- [ ] **Step 3: 跑测试**

Run: `node tests/dist.test.js`
Expected: `6 passed, 0 failed`。

- [ ] **Step 4: 提交**

```bash
git add tools/assemble-dist.js tests/dist.test.js
git commit -m "feat: assemble-dist staging builder (payload + version.json) + zip flat-root roundtrip test"
```

---

### Task 4: 安装器脚本 installer/chip-pin-planner.iss

**Files:**
- Create: `installer/chip-pin-planner.iss`（**UTF-8 with BOM**）
- Test: `tests/dist.test.js`（追加静态 sanity）

**Interfaces:**
- Produces: `.iss` 接受两个定义 `{#Version}`（如 `v1.9`）与 `{#Src}`（staging 目录，默认 `..\dist\site`）；产物 `chip-pin-planner-setup-vX.Y.exe` 落到 `..\dist`。CI 调用：`iscc /DVersion=v1.9 /DSrc=<abs>\dist\site installer\chip-pin-planner.iss`。

- [ ] **Step 1: 追加 sanity 测试（BOM + 关键指令）**

在 `=== dist: update.bat ===` 段前插入：

```js
console.log("\n=== dist: installer .iss ===");

t("iss：UTF-8 BOM + 免管理员 + per-user 目录 + 通配 payload + 固定 AppId", function () {
  const buf = fs.readFileSync(path.join(ROOT, "installer", "chip-pin-planner.iss"));
  assert.deepStrictEqual(Array.from(buf.slice(0, 3)), [0xEF, 0xBB, 0xBF], "须为 UTF-8 BOM（否则中文乱码）");
  const s = buf.toString("utf8");
  assert.ok(/PrivilegesRequired=lowest/.test(s), "免管理员");
  assert.ok(/DefaultDirName=\{localappdata\}\\Programs\\chip-pin-planner/.test(s), "per-user 安装目录");
  assert.ok(/Source: "\{#Src\}\\\*"/.test(s), "通配 payload");
  assert.ok(/recursesubdirs/.test(s));
  assert.ok(/AppId=\{\{[0-9A-Fa-f-]{36}\}\}/.test(s), "固定 AppId GUID");
  assert.ok(/AppVersion=\{#Version\}/.test(s), "版本注入");
  assert.ok(/OutputBaseFilename=chip-pin-planner-setup-\{#Version\}/.test(s));
});
```

- [ ] **Step 2: 写 .iss（完整文件；用 Write 后检查 BOM，Node 写会丢 BOM——用如下命令补 BOM：`node -e "const fs=require('fs');const p='installer/chip-pin-planner.iss';const b=fs.readFileSync(p);if(b[0]!==0xEF)fs.writeFileSync(p,Buffer.concat([Buffer.from([0xEF,0xBB,0xBF]),b]))"`）**

```iss
; 芯片引脚规划器 安装脚本（Inno Setup 6）。CI 编译：
;   iscc /DVersion=vX.Y /DSrc=<abs>\dist\site installer\chip-pin-planner.iss
; 说明：不捆绑运行时、不做应用壳，只安装静态文件夹 + 快捷方式 + 标准卸载。
#ifndef Src
  #define Src "..\dist\site"
#endif
#ifndef Version
  #define Version "0.0"
#endif

[Setup]
AppId={{8F2C1D74-9B3A-4E52-A6D0-5C7E91B2F4A8}
AppName=芯片引脚规划器
AppVersion={#Version}
AppPublisher=amadeus-1048596
DefaultDirName={localappdata}\Programs\chip-pin-planner
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=chip-pin-planner-setup-{#Version}
Compression=lzma2/max
UninstallDisplayName=芯片引脚规划器

[Files]
Source: "{#Src}\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; Flags: checkedonce

[Icons]
Name: "{autoprograms}\芯片引脚规划器"; Filename: "{app}\index.html"
Name: "{autodesktop}\芯片引脚规划器"; Filename: "{app}\index.html"; Tasks: desktopicon

[Run]
Filename: "{app}\index.html"; Description: "立即打开"; Flags: postinstall shellexec nowait
```

- [ ] **Step 3: 跑测试**

Run: `node tests/dist.test.js`
Expected: `7 passed, 0 failed`。

- [ ] **Step 4: 提交**

```bash
git add installer/chip-pin-planner.iss tests/dist.test.js
git commit -m "feat: Inno Setup script (per-user install, shortcuts, standard uninstall) + iss sanity test"
```

---

### Task 5: 贡献指南三件套 + README 公共化

**Files:**
- Create: `docs/chip-data-schema.md`
- Create: `CONTRIBUTING.md`
- Create: `AGENTS.md`
- Modify: `README.md`（顶部加"在线版 / 下载 / 加芯片"三块）

**Interfaces:**
- Produces: 三份文档 + README 新顶部；被 Task 6 的 CI 与 Task 7 的发布说明引用。

- [ ] **Step 1: 写 docs/chip-data-schema.md（完整内容）**

````markdown
# 芯片数据文件 schema 参考（chips/*.js）

> 权威说明文档；**硬门是引擎验证器 `Model.validateChip`（Node 可跑：见下）**。两者冲突以验证器为准，并回头修本文档。
> 校验命令：`node tests/engine.test.js`（全绿）或自查：`node -e "console.log(require('./js/engine/model.js').validateChip(require('./chips/你的文件.js')))"`

## 文件骨架（UMD-lite，照抄即可）

```js
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return { /* 下面各字段 */ };
});
```

## 顶层字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `schemaVersion` | number | 当前上限 **2**；超限会显示"需要更新版本的工具"；旧值 1 兼容 |
| `id` | string | 唯一 slug（小写连字符，如 `ch582m-qfn48` = 型号-封装）；重复会置灰报错 |
| `meta` | object | `{ source: "手册型号 版本 (日期)", author, date, note? }`；**source 必填且如实**（数据来源要求，PR 会查） |
| `chip` | object | `{ vendor, name, package }`（如 `{ vendor:"WCH", name:"CH582M", package:"QFN48" }`）；name+package 决定下拉显示与老工程路由 |
| `package` | object | 渲染参数：`{ family:"quad"\|"dual"\|"dual-split", style:"no-lead"\|..., pinsPerSide, pitch, body:[宽,长], pin1:"topLeft", sequence:"ccw-down", thermalPad? }` |
| `pins` | array | 每脚 `{ num, name, type, alts[], note? }`；num 唯一（EP 用 `"EP"`）；type = `io`\|`power`\|`osc`\|`rf` |
| `globalConfigs` | array | 系统开关 `{ id, label, default, claims:[引脚], note? }`（如调试口/RST/晶振） |
| `resources` | array | 外设资源，见下 |

## resources 字段与约束

| 字段 | 说明 |
|---|---|
| `id/label/category` | 唯一 id、显示名、分类（SPI/UART/I2C/TIMER/PWM/ADC/USB/GPIO…） |
| `signals` | `[{ name, pins:[落脚点...], note?, groupKey? }]`；pins 引用必须存在于 `pins` |
| `groupSwitch` | `{ label }`：该资源存在"映射组"整组切换；**其全部必选信号必须恰好 2 个落脚点**（首=默认组、次=映射组） |
| `groupKey` | 字符串：同 key 的信号必须**同侧**分配（硬件一位同切）；同 key 信号均须 2 落脚点 |
| `modes` | `[{ id, label, signals:[信号名...], optional?:[信号名], note? }]`：一个资源多种工作模式，各自声明所需信号子集 |
| `optional` | 资源级为 `[{可选信号名}]`（**有 modes 的资源必须把可选放模式级**）；可选信号支持 1 或 2 落脚点；不列出的信号=必选 |
| `perPin` | `true` = 逐脚资源（如 GPIO），无 signals |

**硬规律**：必选信号 `pins` 非空、落脚点引脚必须在 `pins` 表中、`groupSwitch` 与多落脚点可选信号互斥语义见上；一切以 `validateChip` 实测为准。

## 最小完整示例（10 行级）

```js
{ schemaVersion: 2, id: "mini-qfn8",
  meta: { source: "TEST 1.0", author: "you", date: "2026-01-01" },
  chip: { vendor: "TEST", name: "MINI", package: "QFN8" },
  package: { family: "quad", style: "no-lead", pinsPerSide: 2, pitch: 0.5, body: [2, 2], pin1: "topLeft", sequence: "ccw-down" },
  pins: [ { num: 1, name: "PA0", type: "io", alts: [] }, { num: "EP", name: "GND", type: "power", alts: [] } ],
  globalConfigs: [],
  resources: [ { id: "SPI0", category: "SPI", label: "SPI0",
    signals: [ { name: "SCK", pins: ["PA0"] } ] }, { id: "GPIO", category: "GPIO", label: "GPIO", perPin: true } ] }
```
````

- [ ] **Step 2: 写 CONTRIBUTING.md（完整内容）**

````markdown
# 贡献指南

欢迎加芯片 / 修数据 / 提改进！本项目（芯片引脚规划器）是零依赖纯静态网页，**加一颗芯片 = 一个文件 + 一行清单**。

## 加一颗芯片（三步）

1. **抄模板**：复制 `chips/wch-ch582m-qfn48.js` 为你自己的文件（命名 `厂商-型号-封装.js`，如 `chips/ti-cc2652-qfn48.js`），改头部注释与 `meta`（**`meta.source` 必须注明数据来源手册的型号与版本**）。
2. **填数据**：按 `docs/chip-data-schema.md` 填 `pins` / `globalConfigs` / `resources`。**数据必须来自公开数据手册，逐脚核对，不猜值**；不确定的参数（如封装尺寸）宁缺勿造。
3. **加清单**：在 `chips/manifest.js` 数组里加一行你的文件路径。⚠️ **漏加这一行，网页里不会出现你的芯片，且没有任何报错**。

## 自查（提交前必跑）

```bash
node tests/engine.test.js    # 必须全绿（含你的数据 validateChip 零错）
```

## 同族多封装

同一芯片的多个封装（如 QFN48/QFN28）**各建一个文件**（纯复制 + 差异表模式）；逐条差异记录到 `docs/reference/ch58x-family-diff.md` 风格的差异文档。

## PR 内容

- 说明：芯片型号 / 封装 / 数据来源（手册名+版本+页码更好）/ `node tests/engine.test.js` 结果；
- 一颗芯片一个 PR 最省事；只改数据不动引擎（改引擎请附用例）。

## 用 AI 来加？

把仓库甩给**你自己的 AI 助手**，让它读根目录的 [`AGENTS.md`](AGENTS.md)——里面是给 AI 的执行清单，照做即可。
````

- [ ] **Step 3: 写 AGENTS.md（完整内容）**

````markdown
# AGENTS.md —— 给贡献者的 AI 助手

你（AI 助手）正在帮助用户给 **芯片引脚规划器** 加一颗芯片或修正数据。照本清单执行。

## 仓库地图

- `chips/*.js` —— 芯片数据（每文件一颗芯片）；`chips/manifest.js` —— 清单（**新增文件必须在此加一行，否则网页静默不显示**）
- `js/engine/`（纯逻辑，Node 可测）· `js/render/`（SVG 渲染）· `js/app.js`（UI）
- `tests/engine.test.js`（单测）· `tests/fuzz.js`（模糊测试）· `docs/chip-data-schema.md`（schema 权威说明）

## 硬规则

1. 零依赖、无构建、`file://` 直开；**不得引入任何包**，浏览器侧禁 ES modules（用 UMD-lite 尾巴）。
2. 数据文件照抄 `chips/wch-ch582m-qfn48.js` 的骨架；字段语义见 `docs/chip-data-schema.md`。
3. 一切 UI 文本中文；进 `innerHTML` 的字符串必须过 `escapeHtml`（`js/util.js`）。
4. 数据以公开手册为准，逐脚填；不确定的值（如封装尺寸 pitch/body）宁缺勿造，并在 PR 里标注来源。
5. 不要改 `js/engine/`，除非任务要求且附对应用例。

## 完成定义（Definition of Done）

- [ ] `node tests/engine.test.js` 全绿（含新数据 `Model.validateChip` 零错）
- [ ] `chips/manifest.js` 已加一行
- [ ] `meta.source` 如实填写（手册型号+版本）
- [ ] 若为同族新封装：差异记录进 `docs/reference/` 的家族差异文档

## 常见坑

- 清单漏行 = 静默消失（没有报错），务必自查；
- `schemaVersion` 超引擎上限 → 芯片被置灰"需要更新版本的工具"；
- `groupSwitch` 资源的必选信号必须恰好 2 个落脚点；`groupKey` 同 key 信号须同侧；
- 引脚 `num` 必须唯一、`resources` 引用的引脚名必须存在于 `pins`。
````

- [ ] **Step 4: README 顶部加三块（放在第一个标题之后、用法列表之前）**

```markdown
> **在线版（永远最新）**：https://amadeus-1048596.github.io/chip-pin-planner/
> **下载**：[Releases](https://github.com/amadeus-1048596/chip-pin-planner/releases)（zip 解压双击 `index.html` 即用；或安装器 `setup.exe`，已装的旧版双击 `update.bat` 一键升级）
> **想加一颗芯片？** 看 [CONTRIBUTING.md](CONTRIBUTING.md)；用 AI 加的话把仓库和 [AGENTS.md](AGENTS.md) 丢给它。
```

- [ ] **Step 5: 验证 + 提交**

Run: `node tests/dist.test.js`
Expected: `7 passed, 0 failed`（README/文档变更不影响产物清单）。

```bash
git add docs/chip-data-schema.md CONTRIBUTING.md AGENTS.md README.md
git commit -m "docs: contributor guides (schema / CONTRIBUTING / AGENTS.md for contributors' AI) + public README header"
```

---

### Task 6: CI 两个 workflow + 本地发布彩排

**Files:**
- Create: `.github/workflows/release.yml`
- Create: `.github/workflows/ci.yml`
- Test: 本地彩排命令（不新增文件）

**Interfaces:**
- Consumes: Task 1-4 全部产物；`tools/assemble-dist.js`、`installer/chip-pin-planner.iss`。
- Produces: tag `v*` 推送即全自动发布；PR/push 跑三套 Node 测试。

- [ ] **Step 1: 写 .github/workflows/ci.yml（完整）**

```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: node tests/engine.test.js
      - run: node tests/fuzz.js
      - run: node tests/dist.test.js
```

- [ ] **Step 2: 写 .github/workflows/release.yml（完整）**

```yaml
name: release
on:
  push:
    tags: ["v*"]
permissions:
  contents: write
  pages: write
  id-token: write
jobs:
  release:
    runs-on: windows-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Assemble staging
        shell: powershell
        run: node tools/assemble-dist.js --version ${{ github.ref_name }} --out dist
      - name: Build zip (flat root)
        shell: powershell
        run: Compress-Archive -Path "dist/site/*" -DestinationPath "dist/chip-pin-planner-${{ github.ref_name }}.zip"
      - name: Stage download/ for Pages
        shell: powershell
        run: |
          New-Item -ItemType Directory -Force dist/site/download | Out-Null
          Copy-Item "dist/chip-pin-planner-${{ github.ref_name }}.zip" "dist/site/download/latest.zip"
          Copy-Item "dist/site/version.json" "dist/site/download/version.json"
      - name: Install Inno Setup
        shell: powershell
        run: choco install innosetup --no-progress -y
      - name: Compile installer
        shell: powershell
        run: |
          & "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe" /DVersion=${{ github.ref_name }} /DSrc=${{ github.workspace }}\dist\site installer\chip-pin-planner.iss
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/site
      - name: Deploy Pages
        id: deployment
        uses: actions/deploy-pages@v4
      - name: Release notes
        shell: powershell
        run: |
          $prev = git describe --tags --abbrev=0 "HEAD^" 2>$null
          if (-not $prev) { $prev = git rev-list --max-parents=0 HEAD }
          git log "$prev..HEAD" --pretty="- %s" | Out-File -Encoding utf8 notes.md
      - name: Create release
        shell: powershell
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh release create "${{ github.ref_name }}" "dist/chip-pin-planner-${{ github.ref_name }}.zip" "dist/chip-pin-planner-setup-${{ github.ref_name }}.exe" --title "${{ github.ref_name }}" --notes-file notes.md
```

- [ ] **Step 3: 本地发布彩排（逐条执行，读输出）**

```bash
cd /d/Code_Project/chip-pin-planner
rm -rf dist
node tools/assemble-dist.js --version v1.9-rc --out dist
powershell -NoProfile -Command "Compress-Archive -Path 'dist/site/*' -DestinationPath 'dist/chip-pin-planner-v1.9-rc.zip' -Force"
powershell -NoProfile -Command "New-Item -ItemType Directory -Force dist/site/download | Out-Null; Copy-Item 'dist/chip-pin-planner-v1.9-rc.zip' 'dist/site/download/latest.zip'; Copy-Item 'dist/site/version.json' 'dist/site/download/version.json'"
powershell -NoProfile -Command "Expand-Archive -LiteralPath 'dist/chip-pin-planner-v1.9-rc.zip' -DestinationPath 'dist/roundtrip' -Force"
node -e "const fs=require('fs');const a=JSON.parse(fs.readFileSync('dist/site/version.json','utf8')).version;const b=JSON.parse(fs.readFileSync('dist/site/download/version.json','utf8')).version;const c=JSON.parse(fs.readFileSync('dist/roundtrip/version.json','utf8')).version;console.log(a,b,c);if(!(a===b&&b===c&&a==='v1.9-rc'))process.exit(1);console.log('[REHEARSAL OK]')"
```

Expected: 最后一行 `v1.9-rc v1.9-rc v1.9-rc` + `[REHEARSAL OK]`（Review Focus #5：两处 version.json 同源 + zip 往返一致）。

- [ ] **Step 4: 全量回归 + 提交**

Run: `node tests/engine.test.js 2>&1 | tail -1 && node tests/fuzz.js >/dev/null 2>&1; echo fuzz=$? && node tests/dist.test.js 2>&1 | tail -1`
Expected: `200 passed, 0 failed`；`fuzz=0`；`7 passed, 0 failed`。

```bash
git add .github/workflows/ci.yml .github/workflows/release.yml
git commit -m "ci: PR tests + tag-driven release (zip, Inno installer, Pages deploy, GitHub Release)"
```

---

### Task 7: 首次发布 + 发布后冒烟（含用户动作门）

**Files:**
- 无代码改动；本任务 = 发布操作 + 验证记录（结果写回 ledger/记忆）。

**Interfaces:**
- Consumes: 全部前序产物 + 用户 GitHub 操作。

- [ ] **Step 1: 用户动作 A —— GitHub Desktop 建仓并推送**

请用户：GitHub Desktop → File → **Add existing repository**（选 `D:\Code_Project\chip-pin-planner`）→ 右上 **Publish repository** → 取消勾选 "Keep this code private" → Publish。
等待用户确认后，验证：`git remote -v` 应显示 origin；`git log origin/master -1` 可达（网络不稳则重试）。

- [ ] **Step 2: 用户动作 B —— 设置 Pages Source**

请用户：github.com 仓库页 → Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。
（此后 Pages 由 release.yml 自动部署。）

- [ ] **Step 3: 推 master + 推 tags，确认 ci.yml 跑绿**

```bash
git push origin master
git push origin --tags
```

（网络不稳重试；先推 master 后推 tags——v1.9 尚未打，此步先让 ci.yml 在 push 上跑一遍。）
验证：GitHub 仓库 Actions 页出现 ci workflow 且全绿（用户看或我用 api.github.com 查：`curl -s https://api.github.com/repos/amadeus-1048596/chip-pin-planner/actions/runs | head`）。

- [ ] **Step 4: 打 tag v1.9 并推送 → 触发 release.yml**

```bash
git tag v1.9
git push origin v1.9
```

观察 Actions 的 release workflow 至完成（约 3-6 分钟）；用 api.github.com 查 run 结论；确认：
- Release `v1.9` 存在且附 `chip-pin-planner-v1.9.zip` + `chip-pin-planner-setup-v1.9.exe`；
- Pages 部署成功。

- [ ] **Step 5: 发布后冒烟（Review Focus 之外的真机门）**

```bash
agent-browser --session cppv19 open "https://amadeus-1048596.github.io/chip-pin-planner/"
```

逐项：页面出现 + "就绪（v1.9）：可用芯片 3 颗"；切 CH582F 看 QFN28 图；切 CH583M 看 SPI1。截图存 `tmp\cpp-release-20261016\`。
再验新版 update.bat 的线上真 URL 路径：本地解压刚下载的 zip → 双击 `update.bat` → 应输出 `[SKIP] 已是最新`（等价手工命令：`cmd /c update.bat`）。
（用户验收项：Edge 里真实双击解压目录的 index.html 一眼。）

- [ ] **Step 6: 前置门 —— 安装器管控机实测（用户执行，如实记录）**

请用户下载 `chip-pin-planner-setup-v1.9.exe` 双击运行：成功（快捷方式可开）或被拦（记录拦截组件/文案）。
**无论结果如何都不算发布失败**——被拦则记入记忆（外部用户不受影响）。

- [ ] **Step 7: 收尾**

- 全量回归：`node tests/engine.test.js && node tests/dist.test.js && node tests/fuzz.js` 全绿；
- 若首发布后有任何修复（Release 资产/脚本 bug），修复后打 `v1.9.1` 重发（不移动既有 tag）；
- 更新 memory（发布结果、安装器实测结论、Pages 地址、update 机制）；
- 版本收官确认：`就绪（v1.9）` + tag v1.9 = 发布点。

---

## 执行备注

- 任务依赖：1 → 2 → 3 → 4 → 6 → 7；Task 5（文档）可在 4 之后任意时刻做，不阻塞 6。
- Task 2 与 Task 3 共用 `tools/assemble-dist.js`（Task 2 的测试夹具需要它）——Task 2 落地其完整实现，Task 3 只补测试与一致性确认。
- 本机无需安装任何打包工具；安装器只在 CI 编译，本机不验证 .iss 可编译性（靠 iss sanity 测试 + 首发布实测）。
- 网络：`git push` / api.github.com 不稳时按记忆 github-network-flaky 重试；不要静默跳过。
- 用户动作门（Task 7 Step 1/2/6）必须停下等用户，不代做（凭据与管控机操作均属用户）。
