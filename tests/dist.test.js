"use strict";
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execSync, execFileSync, spawnSync, spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const Dist = require("../tools/assemble-dist.js");
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
  // 绝对带引号路径调用：本环境设有 NoDefaultCurrentDirectoryInExePath=1，cmd 不搜当前目录，
  // 相对名会报"不是内部或外部命令"；绝对路径含路径分隔符、cmd 直接解析，空格/中文目录也安全。
  const bat = path.join(installDir, "update.bat");
  let status = 0;
  try {
    execSync('"' + bat + '" > "' + logName + '" 2>&1', { cwd: installDir,
      env: Object.assign({}, process.env, { CPP_UPDATE_BASE: base }), stdio: "ignore" });
  } catch (e) { status = e.status || 999; }
  const logFile = path.join(installDir, logName);
  const log = fs.existsSync(logFile) ? fs.readFileSync(logFile, "latin1") : "";
  return { status: status, log: log };
}
function readVersion(dir) { return JSON.parse(fs.readFileSync(path.join(dir, "version.json"), "utf8")).version; }

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

console.log("\n=== dist: installer .iss ===");

t("iss：UTF-8 BOM + 免管理员 + per-user 目录 + 通配 payload + 固定 AppId", function () {
  const buf = fs.readFileSync(path.join(ROOT, "installer", "chip-pin-planner.iss"));
  assert.deepStrictEqual(Array.from(buf.slice(0, 3)), [0xEF, 0xBB, 0xBF], "须为 UTF-8 BOM（否则中文乱码）");
  const s = buf.toString("utf8");
  assert.ok(/PrivilegesRequired=lowest/.test(s), "免管理员");
  assert.ok(/DefaultDirName=\{localappdata\}\\Programs\\chip-pin-planner/.test(s), "per-user 安装目录");
  assert.ok(/Source: "\{#Src\}\\\*"/.test(s), "通配 payload");
  assert.ok(/recursesubdirs/.test(s));
  assert.ok(/AppId=\{\{[0-9A-Fa-f-]{36}\}/.test(s), "固定 AppId GUID（Inno 转义：{{GUID} 单右括号）");
  assert.ok(/AppVersion=\{#[Vv]ersion\}/.test(s), "版本注入");
  assert.ok(/OutputBaseFilename=chip-pin-planner-setup-\{#Version\}/.test(s));
});

console.log("\n=== dist: update.bat ===");

t("update.bat：CRLF 行尾 + 无 BOM（cmd 的硬要求；LF 批处理会被逐段当命令执行）", function () {
  const b = fs.readFileSync(path.join(ROOT, "update.bat"));
  assert.ok(!(b[0] === 0xEF && b[1] === 0xBB), "不得带 UTF-8 BOM");
  const s = b.toString("utf8");
  assert.ok(!/[^\r]\n/.test(s) && !/\n$/.test(s.replace(/\r\n$/, "")), "不得有裸 LF（须全 CRLF）");
  assert.ok(s.includes("\r\n"), "应含 CRLF");
});

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
  } finally { fx.child.kill(); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }
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
  } finally { fx.child.kill(); try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {} }
});

t("update.bat：连不上网 → [ERR] 且 exit 1（不得误判为最新）", function () {
  const dir = tmpdir("neterr");
  const site = Dist.assemble("v1.9", path.join(dir, "src"));
  for (const f of fs.readdirSync(site)) fs.cpSync(path.join(site, f), path.join(dir, f), { recursive: true });
  const r = runUpdateBat(dir, "http://127.0.0.1:1", "run.log");
  assert.strictEqual(r.status, 1, "exit 应为 1；log=" + r.log);
  assert.ok(r.log.includes("[ERR]"), "应含 [ERR]；log=" + r.log);
  assert.strictEqual(readVersion(dir), "v1.9", "本地版本不得被动");
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
});

t("update.bat：开发目录防护——缺本地 version.json → [ERR] 拒绝更新", function () {
  const dir = tmpdir("guard");
  fs.copyFileSync(path.join(ROOT, "update.bat"), path.join(dir, "update.bat"));
  const r = runUpdateBat(dir, "http://127.0.0.1:1", "run.log");
  assert.strictEqual(r.status, 1);
  assert.ok(r.log.includes("[ERR]"), "log=" + r.log);
  assert.ok(!fs.existsSync(path.join(dir, "index.html")), "不得写入任何站点文件");
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
});

(async function () {
  for (const x of tests) {
    try { await x.fn(); pass++; console.log("  PASS " + x.name); }
    catch (e) { fail++; console.error("  FAIL " + x.name + "\n       " + (e && e.message)); }
  }
  console.log("\n" + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
