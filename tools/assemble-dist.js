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
