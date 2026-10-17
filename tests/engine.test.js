"use strict";
const assert = require("assert");

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); pass++; console.log("  PASS " + name); }
  catch (e) { fail++; console.error("  FAIL " + name + "\n       " + e.message); }
}

const Model = require("../js/engine/model.js");

// 测试用迷你芯片定义（后续任务也会用它）
const miniChip = {
  schemaVersion: 1,
  chip: { vendor: "TEST", name: "MINI", package: "QFN8" },
  package: { family: "quad", style: "no-lead", pinsPerSide: 2, pitch: 0.5, body: [2, 2],
             pin1: "topLeft", sequence: "ccw-down" },
  pins: [
    { num: 1, name: "PA0", type: "io", alts: [] },
    { num: 2, name: "PA1", type: "io", alts: [] },
    { num: 3, name: "PB0", type: "io", alts: [] },
    { num: 4, name: "PB1", type: "io", alts: [] },
    { num: 5, name: "PC0", type: "io", alts: [] },
    { num: 6, name: "PC1", type: "io", alts: [] },
    { num: 7, name: "PD0", type: "io", alts: [] },
    { num: 8, name: "PD1", type: "io", alts: [] },
    { num: "EP", name: "GND", type: "power", alts: [] }
  ],
  globalConfigs: [
    { id: "lock1", label: "锁定开关", default: true, claims: ["PA0"] }
  ],
  resources: [
    { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组" },
      signals: [
        { name: "SCK",  pins: ["PA1", "PB1"] },
        { name: "MOSI", pins: ["PC0", "PD0"] },
        { name: "MISO", pins: ["PC1", "PD1"] }
      ] },
    { id: "TMR1", category: "TIMER", label: "TMR1",
      signals: [ { name: "TMR1", pins: ["PB0", "PA1"] } ] },
    { id: "GPIO", category: "GPIO", label: "GPIO", perPin: true }
  ]
};

console.log("\n=== Task 1: model.js ===");
t("validateChip: 合法定义通过", () => {
  const r = Model.validateChip(miniChip);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
t("validateChip: 缺少 chip.name 报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  delete bad.chip.name;
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("chip.name")));
});
t("validateChip: 资源引用不存在的引脚时报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins[0] = "PX9";
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("PX9")));
});
t("validateChip: 有 groupSwitch 的资源信号必须是 2 个落脚点", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins = ["PA1"];
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("groupSwitch")));
});
t("validateChip: 重复引脚名报错", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.pins[1].name = "PA0";
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
});

const Avail = require("../js/engine/availability.js");

console.log("\n=== Task 2: availability 状态计算 ===");
t("defaultState: configs 取自 default 值", () => {
  const s = Avail.defaultState(miniChip);
  assert.strictEqual(s.configs.lock1, true);
  assert.deepStrictEqual(s.resources, {});
});
t("computePins: 开关锁定的脚 status=locked", () => {
  const s = Avail.defaultState(miniChip);
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA0").status, "locked");
  assert.strictEqual(pins.get("PA1").status, "free");
});
t("computePins: 电源/模拟脚 status=fixed", () => {
  const s = Avail.defaultState(miniChip);
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("GND").status, "fixed");
});
t("computePins: 资源分配后 status=assigned 且 owner 正确", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { resources: { SPI0: { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } } } });
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA1").status, "assigned");
  assert.strictEqual(pins.get("PA1").owners[0].id, "SPI0");
  assert.strictEqual(pins.get("PA1").owners[0].signal, "SCK");
});
t("computePins: 双占产生 conflict  且 countIO 正确", () => {
  let s = Avail.defaultState(miniChip);
  // 先关掉开关、分配 SPI0 到映射组，再把开关打开 → PB1/PD0/PD1 冲突？不，映射组是 PB1/PD0/PD1，开关锁 PA0
  s = Object.assign({}, s, { resources: { SPI0: { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } } } });
  s = Object.assign({}, s, { gpio: { PA1: "X" } });          // GPIO 与 SPI0.SCK 抢 PA1
  const pins = Avail.computePins(miniChip, s);
  assert.strictEqual(pins.get("PA1").status, "conflict");
  assert.strictEqual(pins.get("PA1").owners.length, 2);
  const c = Avail.countIO(miniChip, s);
  assert.strictEqual(c.total, 8);      // 8 个 io
  assert.strictEqual(c.conflict, 1);
  assert.strictEqual(c.locked, 1);     // PA0
});

console.log("\n=== Task 3: 候选 / 校验 / 变更 / 历史 ===");
t("candidatePins: 默认组只给默认落脚点", () => {
  const s = Avail.defaultState(miniChip);
  const c = Avail.candidatePins(miniChip, s, "SPI0");
  assert.deepStrictEqual(c.signals.SCK, ["PA1"]);
  assert.deepStrictEqual(c.signals.MOSI, ["PC0"]);
});
t("candidatePins: 映射组在目标脚被占时为空", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PB1: "X" } });      // PB1 = 映射组 SCK 脚
  const c = Avail.candidatePins(miniChip, s, "SPI0", true);
  assert.deepStrictEqual(c.signals.SCK, []);             // PB1 被占 → 无候选
  assert.deepStrictEqual(c.signals.MOSI, ["PD0"]);
});
t("canAssign: 目标被占 → 失败并给中文原因", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PA1: "X" } });
  const r = Avail.canAssign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("PA1"));
});
t("canAssign: 组与落脚点不匹配 → 失败", () => {
  const s = Avail.defaultState(miniChip);
  const r = Avail.canAssign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PB1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.ok, false);
});
t("assign → removeResource 往返", () => {
  let s = Avail.defaultState(miniChip);
  const r = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.error, undefined);
  assert.ok(r.state.resources.SPI0);
  const s2 = Avail.removeResource(r.state, "SPI0");
  assert.strictEqual(s2.resources.SPI0, undefined);
  assert.ok(s.resources.SPI0 === undefined);             // 原 state 未被修改（不可变）
});
t("assign 失败时返回原 state 与错误", () => {
  let s = Avail.defaultState(miniChip);
  s = Object.assign({}, s, { gpio: { PA1: "X" } });
  const r = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.state, s);
  assert.ok(r.error);
});
t("重复分配同一资源 = 重新分配（自身旧脚不算冲突）", () => {
  let s = Avail.defaultState(miniChip);
  s = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } }).state;
  const r = Avail.assign(miniChip, s, "SPI0", { group: true, pins: { SCK: "PB1", MOSI: "PD0", MISO: "PD1" } });
  assert.strictEqual(r.error, undefined);
  assert.strictEqual(r.state.resources.SPI0.group, true);
});
t("setConfig / setGpio：返回新对象且原 state 不变", () => {
  const s = Avail.defaultState(miniChip);
  const s2 = Avail.setConfig(s, "lock1", false);
  assert.strictEqual(s.configs.lock1, true);
  assert.strictEqual(s2.configs.lock1, false);
  const s3 = Avail.setGpio(s2, "PB0", "LED");
  assert.strictEqual(s3.gpio.PB0, "LED");
  const s4 = Avail.setGpio(s3, "PB0", "");
  assert.strictEqual(s4.gpio.PB0, undefined);
});
t("createHistory: undo 回退快照", () => {
  const h = Avail.createHistory(Avail.defaultState(miniChip));
  h.push(Avail.setConfig(h.current(), "lock1", false));
  assert.strictEqual(h.current().configs.lock1, false);
  assert.strictEqual(h.canUndo(), true);
  h.undo();
  assert.strictEqual(h.current().configs.lock1, true);
  assert.strictEqual(h.canUndo(), false);
});

const Exp = require("../js/engine/exporters.js");

console.log("\n=== Task 4: 导出器 ===");
function assignedState() {
  let s = Avail.defaultState(miniChip);
  s = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } }).state;
  s = Avail.setGpio(s, "PB0", "LED");
  return s;
}
t("toCSV: 含表头/已分配/GPIO/空闲行", () => {
  const csv = Exp.toCSV(miniChip, assignedState());
  const lines = csv.split("\n");
  assert.ok(lines[0].startsWith("脚号,引脚,分配功能"));
  assert.ok(csv.includes("PA1") && csv.includes("SPI0") && csv.includes("SCK"));
  assert.ok(csv.includes("LED"));
  assert.ok(csv.includes("空闲"));
});
t("toMarkdown: 是合法表格", () => {
  const md = Exp.toMarkdown(miniChip, assignedState());
  assert.ok(md.includes("| 脚号 | 引脚 |"));
  assert.ok(md.includes("| --- |"));
});
t("toProjectJSON → fromProjectJSON 往返一致", () => {
  const s = assignedState();
  const text = Exp.toProjectJSON(miniChip, s);
  const r = Exp.fromProjectJSON(miniChip, text);
  assert.strictEqual(r.error, undefined);
  assert.deepStrictEqual(r.state, s);
});
t("fromProjectJSON: 损坏 JSON 返回中文错误", () => {
  const r = Exp.fromProjectJSON(miniChip, "{oops");
  assert.ok(r.error && r.error.includes("JSON"));
});
t("fromProjectJSON: 异芯片工程被拒绝", () => {
  const text = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "OTHER",
                               configs: {}, resources: {}, gpio: {} });
  const r = Exp.fromProjectJSON(miniChip, text);
  assert.ok(r.error && r.error.includes("不匹配"));
});
t("冲突状态导出不崩溃且带警示", () => {
  let s = assignedState();
  s = Avail.setGpio(s, "PA1", "X");            // 与 SPI0.SCK 冲突
  const csv = Exp.toCSV(miniChip, s);
  assert.ok(csv.includes("冲突"));
});

const CHIP = require("../chips/wch-ch582m-qfn48.js");

console.log("\n=== Task 5: CH582M 数据 + 真实规则 ===");
t("数据通过 validateChip（含 groupSwitch 2 落脚点规则）", () => {
  const r = Model.validateChip(CHIP);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});
t("规则①：默认调试口锁 PB14/PB15；SPI0 映射组不可用", () => {
  const s = Avail.defaultState(CHIP);
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB14").status, "locked");
  const c = Avail.candidatePins(CHIP, s, "SPI0", true);
  assert.deepStrictEqual(c.signals.MOSI, []);            // PB14 被调试口锁
  assert.deepStrictEqual(c.signals.MISO, []);            // PB15
  assert.deepStrictEqual(c.signals.SCK, ["PB13"]);       // PB13 没被占
});
t("规则②：关调试口 → SPI0 可切 PB 组；重开后 2 处冲突", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  const r = Avail.assign(CHIP, s, "SPI0", { group: true, pins: { SCK: "PB13", MOSI: "PB14", MISO: "PB15" } });
  assert.strictEqual(r.error, undefined, r.error);
  s = Avail.setConfig(r.state, "debug", true);           // 再打开调试口 → 后发冲突
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB14").status, "conflict");
  assert.strictEqual(pins.get("PB15").status, "conflict");
  assert.strictEqual(pins.get("PB13").status, "assigned");
  const c = Avail.countIO(CHIP, s);
  assert.strictEqual(c.conflict, 2);
});
t("规则③：32K 晶振占 PA10 → TMR1 只剩 PB10；关掉后 PA10 可选", () => {
  let s = Avail.defaultState(CHIP);
  let c = Avail.candidatePins(CHIP, s, "TMR1");
  assert.deepStrictEqual(c.signals["TMR1/PWM1"], ["PB10"]);
  s = Avail.setConfig(s, "xtal32k", false);
  c = Avail.candidatePins(CHIP, s, "TMR1");
  assert.deepStrictEqual(c.signals["TMR1/PWM1"], ["PA10", "PB10"]);
});
t("规则④：启用 RST → PB23 被锁；PWM11 无候选、TMR0 只剩 PA9", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "rst", true);
  const pins = Avail.computePins(CHIP, s);
  assert.strictEqual(pins.get("PB23").status, "locked");
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM11").signals["PWM11"], []);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "TMR0").signals["TMR0/PWM0"], ["PA9"]);
});
t("规则⑤：UART1 占 PA9 后 PWM0/TMR0 不能再用 PA9", () => {
  let s = Avail.defaultState(CHIP);
  const r = Avail.assign(CHIP, s, "UART1", { group: false, pins: { TXD: "PA9", RXD: "PA8" } });
  assert.strictEqual(r.error, undefined);
  const c = Avail.candidatePins(CHIP, r.state, "TMR0");
  assert.deepStrictEqual(c.signals["TMR0/PWM0"], ["PB23"]);
});
t("规则⑥：PWM10 唯一落点 PB14——调试口开=不可选，关=可选", () => {
  let s = Avail.defaultState(CHIP);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM10").signals["PWM10"], []);
  s = Avail.setConfig(s, "debug", false);
  assert.deepStrictEqual(Avail.candidatePins(CHIP, s, "PWM10").signals["PWM10"], ["PB14"]);
});
t("导出：CSV 含关键信息且 CH582M 冲突态可导出", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  s = Avail.assign(CHIP, s, "SPI0", { group: true, pins: { SCK: "PB13", MOSI: "PB14", MISO: "PB15" } }).state;
  s = Avail.setConfig(s, "debug", true);
  const csv = Exp.toCSV(CHIP, s);
  assert.ok(csv.includes("⚠️冲突"));
  assert.ok(csv.includes("PB14"));
});

const Pkg = require("../js/render/package-svg.js");

console.log("\n=== Task 6: 封装几何 ===");
t("QFN48：48 脚 + EP，编号方向正确", () => {
  const L = Pkg.computePinLayout(CHIP.package);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 49);                       // 48 + EP
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[12].side, "left");
  assert.ok(byNum[1].y < byNum[12].y);                         // 1 在上、12 在下
  assert.strictEqual(byNum[13].side, "bottom");
  assert.strictEqual(byNum[24].side, "bottom");
  assert.ok(byNum[13].x < byNum[24].x);                        // 下边自左而右
  assert.strictEqual(byNum[25].side, "right");
  assert.ok(byNum[25].y > byNum[36].y);                        // 右边自下而上
  assert.strictEqual(byNum[37].side, "top");
  assert.ok(byNum[37].x > byNum[48].x);                        // 上边自右而左
  assert.strictEqual(byNum.EP.side, "center");
});
t("QFN48：横向引脚间距 = pitch", () => {
  const L = Pkg.computePinLayout(CHIP.package);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.ok(Math.abs((byNum[2].y - byNum[1].y) - 0.35) < 1e-9);
});
t("dual：SOP8 右列自下而上", () => {
  const pkg = { family: "dual", style: "gullwing", pinsPerSide: 4, pitch: 1.27, body: [4, 5] };
  const L = Pkg.computePinLayout(pkg);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 8);
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[5].side, "right");
  assert.ok(byNum[5].y > byNum[8].y);                          // 5 在下、8 在上
});
t("dual-split：SOT-23-5 = 3+2", () => {
  const pkg = { family: "dual-split", style: "gullwing", counts: [3, 2], pitch: 0.95, body: [3, 1.6] };
  const L = Pkg.computePinLayout(pkg);
  const byNum = {};
  L.pins.forEach(p => { byNum[p.num] = p; });
  assert.strictEqual(L.pins.length, 5);
  assert.strictEqual(byNum[1].side, "left");
  assert.strictEqual(byNum[4].side, "right");
  assert.ok(byNum[4].y > byNum[5].y);
});

console.log("\n=== 终审修复：结构残缺工程必须被拒 ===");
function projText(resources) {
  return JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI",
                          configs: {}, resources: resources, gpio: {} });
}
t("fromProjectJSON: resources[rid]=null 被拒绝", () => {
  const r = Exp.fromProjectJSON(miniChip, projText({ SPI0: null }));
  assert.ok(r.error, "应返回中文错误");
});
t("fromProjectJSON: 缺 pins 字段被拒绝", () => {
  const r = Exp.fromProjectJSON(miniChip, projText({ SPI0: { group: false } }));
  assert.ok(r.error, "应返回中文错误");
});
t("fromProjectJSON: pins=null 被拒绝", () => {
  const r = Exp.fromProjectJSON(miniChip, projText({ SPI0: { group: false, pins: null } }));
  assert.ok(r.error, "应返回中文错误");
});
t("fromProjectJSON: pins 值非字符串被拒绝", () => {
  const r = Exp.fromProjectJSON(miniChip, projText({ SPI0: { group: false, pins: { SCK: 123, MOSI: "PC0", MISO: "PC1" } } }));
  assert.ok(r.error, "应返回中文错误");
});
t("fromProjectJSON: configs 值非布尔被拒绝", () => {
  const text = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI",
                                configs: { lock1: "yes" }, resources: {}, gpio: {} });
  const r = Exp.fromProjectJSON(miniChip, text);
  assert.ok(r.error, "应返回中文错误");
});

console.log("\n=== 终审修复 I2：静默数据笔误必须报错 ===");
function badChip(mut) {
  const c = JSON.parse(JSON.stringify(miniChip));
  mut(c);
  return c;
}
t("validateChip: 重复引脚号 num 报错", () => {
  const r = Model.validateChip(badChip(c => { c.pins[1].num = 1; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("引脚号")));
});
t("validateChip: 引脚缺 num 报错", () => {
  const r = Model.validateChip(badChip(c => { delete c.pins[2].num; }));
  assert.strictEqual(r.ok, false);
});
t("validateChip: 数字引脚号必须完整覆盖 1..N", () => {
  const r = Model.validateChip(badChip(c => { c.pins.splice(1, 1); }));  // 删掉 num=2
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("覆盖") || e.includes("missing") || e.includes("缺")));
});
t("validateChip: 重复 resource id 报错", () => {
  const r = Model.validateChip(badChip(c => { c.resources.push(JSON.parse(JSON.stringify(c.resources[0]))); }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("重复资源")));
});
t("validateChip: 重复 globalConfig id 报错", () => {
  const r = Model.validateChip(badChip(c => { c.globalConfigs.push({ id: "lock1", label: "x", default: false, claims: [] }); }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("重复配置")));
});
t("validateChip: 资源内重复信号名报错", () => {
  const r = Model.validateChip(badChip(c => { c.resources[1].signals.push({ name: "TMR1", pins: ["PB1"] }); }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("重复信号")));
});
t("validateChip: 非法 package.family 报错", () => {
  const r = Model.validateChip(badChip(c => { c.package.family = "triangle"; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("family")));
});
t("validateChip: pitch/body 非正数报错", () => {
  const r = Model.validateChip(badChip(c => { c.package.pitch = 0; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("pitch")));
});

console.log("\n=== 终审修复 I2 补全（评审原文四项）+ M7 转义 ===");
t("validateChip: 信号落脚点落在固定脚报错", () => {
  const r = Model.validateChip(badChip(c => { c.resources[0].signals[0].pins[1] = "GND"; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("固定脚")));
});
t("validateChip: 全局开关 claims 落在固定脚报错", () => {
  const r = Model.validateChip(badChip(c => { c.globalConfigs[0].claims = ["GND"]; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("固定脚")));
});
t("validateChip: 非法 type 报错", () => {
  const r = Model.validateChip(badChip(c => { c.pins[0].type = "gpio2"; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("type")));
});
t("validateChip: 缺失 type 报错", () => {
  const r = Model.validateChip(badChip(c => { delete c.pins[0].type; }));
  assert.strictEqual(r.ok, false);
});
t("validateChip: 资源缺 label 报错", () => {
  const r = Model.validateChip(badChip(c => { delete c.resources[1].label; }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("label")));
});
t("validateChip: 同资源两信号共享落脚点报错", () => {
  const r = Model.validateChip(badChip(c => { c.resources[1].signals.push({ name: "TMR1B", pins: ["PB0"] }); }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("共享")));
});
t("toMarkdown: 别名含竖线被转义，表格不破坏", () => {
  let s = assignedState();
  s = Avail.setGpio(s, "PB0", "A|B");
  const md = Exp.toMarkdown(miniChip, s);
  assert.ok(md.includes("A\\|B"), "竖线应转义为 \\|");
});

console.log("\n=== 引脚下拉升级：pinOptions（引擎） ===");
t("pinOptions(miniChip, PA1)：含 SPI0·SCK 与 TMR1 且均可用", () => {
  const s = Avail.defaultState(miniChip);
  const opts = Avail.pinOptions(miniChip, s, "PA1");
  const spi = opts.find(o => o.rid === "SPI0" && o.signal === "SCK");
  const tmr = opts.find(o => o.rid === "TMR1");
  assert.ok(spi && spi.ok === true, JSON.stringify(spi));
  assert.ok(tmr && tmr.ok === true, JSON.stringify(tmr));
});
t("pinOptions(CH582M, PB13)：I2C·SCL 可用；SPI0 映射组被调试口挡且给原因", () => {
  const s = Avail.defaultState(CHIP);
  const opts = Avail.pinOptions(CHIP, s, "PB13");
  const i2c = opts.find(o => o.rid === "I2C");
  const spiAlt = opts.find(o => o.rid === "SPI0");
  assert.ok(i2c && i2c.ok === true, JSON.stringify(i2c));
  assert.ok(spiAlt && spiAlt.ok === false, JSON.stringify(spiAlt));
  assert.ok(spiAlt.reason.includes("MOSI"), spiAlt.reason);
  assert.strictEqual(spiAlt.group, true);
});
t("pinOptions(CH582M, PB13)：关调试口后 SPI0 映射组变为可用", () => {
  const s = Avail.setConfig(Avail.defaultState(CHIP), "debug", false);
  const spiAlt = Avail.pinOptions(CHIP, s, "PB13").find(o => o.rid === "SPI0");
  assert.ok(spiAlt && spiAlt.ok === true, JSON.stringify(spiAlt));
});
t("pinOptions(CH582M, PB14)：被调试口锁定 → 全部选项置灰且原因说明", () => {
  const s = Avail.defaultState(CHIP);
  const opts = Avail.pinOptions(CHIP, s, "PB14");
  assert.ok(opts.length > 0);
  assert.ok(opts.every(o => o.ok === false));
  assert.ok(opts.every(o => o.reason.includes("两线调试接口")));
});
t("pinOptions(CH582M, PA13)：SPI0 默认组可用", () => {
  const s = Avail.defaultState(CHIP);
  const spi = Avail.pinOptions(CHIP, s, "PA13").find(o => o.rid === "SPI0");
  assert.ok(spi && spi.ok === true && spi.group === false, JSON.stringify(spi));
});

console.log("\n=== 左栏一键分配：bestAssignment（含自动映射组回退） ===");
t("默认组可用 → 用默认组", () => {
  const s = Avail.defaultState(miniChip);
  const r = Avail.bestAssignment(miniChip, s, "SPI0");
  assert.strictEqual(r.group, false);
  assert.deepStrictEqual(r.pins, { SCK: "PA1", MOSI: "PC0", MISO: "PC1" });
});
t("默认组被占 + 映射组可用 → 自动映射组（miniChip）", () => {
  let s = Avail.defaultState(miniChip);
  s = Avail.setGpio(s, "PA1", "X");
  const r = Avail.bestAssignment(miniChip, s, "SPI0");
  assert.strictEqual(r.usedAlt, true, JSON.stringify(r));
  assert.deepStrictEqual(r.pins, { SCK: "PB1", MOSI: "PD0", MISO: "PD1" });
});
t("用户场景复现（CH582M）：关调试口 + PA13 设为 GPIO → SPI0 自动落映射组 PB13/14/15", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  s = Avail.setGpio(s, "PA13", "GPIO");
  const r = Avail.bestAssignment(CHIP, s, "SPI0");
  assert.strictEqual(r.usedAlt, true, JSON.stringify(r));
  assert.deepStrictEqual(r.pins, { SCK: "PB13", MOSI: "PB14", MISO: "PB15" });
});
t("两组都不能用 → 返回错误并含两组缺失信号（CH582M：调试口开 + PA13 被占）", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setGpio(s, "PA13", "GPIO");
  const r = Avail.bestAssignment(CHIP, s, "SPI0");
  assert.ok(r.error, JSON.stringify(r));
  assert.ok(r.error.group0.includes("SCK"), JSON.stringify(r.error));
  assert.ok(r.error.group1.includes("MOSI"), JSON.stringify(r.error));
});
t("非组切换资源全被占 → 单组错误（无 group1）", () => {
  let s = Avail.defaultState(miniChip);
  s = Avail.setGpio(s, "PB0", "X");
  s = Avail.setGpio(s, "PA1", "Y");
  const r = Avail.bestAssignment(miniChip, s, "TMR1");
  assert.ok(r.error && !r.error.group1, JSON.stringify(r));
  assert.deepStrictEqual(r.error.group0, ["TMR1"]);
});

console.log("\n=== SPI 模式层（v1.3） ===");
t("validateChip: modes 结构校验（重复 id / 未知信号 / 空 signals / 缺 label）", () => {
  const cases = [
    c => { c.resources[0].modes = [{ id: "a", label: "A", signals: ["SCK"] }, { id: "a", label: "B", signals: ["MOSI"] }]; },
    c => { c.resources[0].modes = [{ id: "a", label: "A", signals: ["NOPE"] }]; },
    c => { c.resources[0].modes = [{ id: "a", signals: ["SCK"] }]; }
  ];
  cases.forEach((mut, i) => {
    assert.strictEqual(Model.validateChip(badChip(mut)).ok, false, "case " + i);
  });
});
t("CH582M 数据：SPI0 含四模式（主机全/半 + 从机全/半）且整体校验通过", () => {
  const v = Model.validateChip(CHIP);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
  const spi = Avail.findResource(CHIP, "SPI0");
  assert.deepStrictEqual(spi.modes.map(m => m.id), ["full", "half", "slave-full", "slave-half"]);
});
t("candidatePins(半双工)：SCK/MISO 必选 + SCS 可选（v1.7 枚举含可选信号）", () => {
  const s = Avail.defaultState(CHIP);
  const c = Avail.candidatePins(CHIP, s, "SPI0", false, "half");
  assert.deepStrictEqual(Object.keys(c.signals).sort(), ["MISO", "SCK", "SCS"]);
  assert.deepStrictEqual(c.signals.SCK, ["PA13"]);
  assert.deepStrictEqual(c.signals.MISO, ["PA15"]);
});
t("★ assign(半双工, A组)：只占 SCK+MISO，MOSI 脚 PA14 保持空闲", () => {
  const s = Avail.defaultState(CHIP);
  const r = Avail.assign(CHIP, s, "SPI0", { group: false, mode: "half", pins: { SCK: "PA13", MISO: "PA15" } });
  assert.strictEqual(r.error, undefined, r.error);
  const pins = Avail.computePins(CHIP, r.state);
  assert.strictEqual(pins.get("PA13").status, "assigned");
  assert.strictEqual(pins.get("PA15").status, "assigned");
  assert.strictEqual(pins.get("PA14").status, "free");
  assert.strictEqual(Avail.countIO(CHIP, r.state).used, 2);
  // 腾出的 PA14 立即可作 GPIO
  const s2 = Avail.setGpio(r.state, "PA14", "LED");
  assert.strictEqual(Avail.computePins(CHIP, s2).get("PA14").status, "assigned");
});
t("canAssign(半双工)：带 MOSI 或缺少 MISO 均被拒", () => {
  const s = Avail.defaultState(CHIP);
  assert.strictEqual(Avail.canAssign(CHIP, s, "SPI0",
    { group: false, mode: "half", pins: { SCK: "PA13", MOSI: "PA14", MISO: "PA15" } }).ok, false);
  assert.strictEqual(Avail.canAssign(CHIP, s, "SPI0",
    { group: false, mode: "half", pins: { SCK: "PA13" } }).ok, false);
});
t("pinOptions：PA14(MOSI) 出现在全双工（主机/从机）；PA15(MISO) 出现在四种模式", () => {
  const s = Avail.defaultState(CHIP);
  const atMosi = Avail.pinOptions(CHIP, s, "PA14").filter(o => o.rid === "SPI0");
  const atMiso = Avail.pinOptions(CHIP, s, "PA15").filter(o => o.rid === "SPI0");
  assert.deepStrictEqual(atMosi.map(o => o.mode).sort(), ["full", "slave-full"]);
  assert.deepStrictEqual(atMiso.map(o => o.mode).sort(), ["full", "half", "slave-full", "slave-half"]);
});
t("bestAssignment(半双工) + PA13被占 + 调试口关 → 自动映射组 PB13+PB15", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  s = Avail.setGpio(s, "PA13", "G");
  const r = Avail.bestAssignment(CHIP, s, "SPI0", "half");
  assert.strictEqual(r.usedAlt, true, JSON.stringify(r));
  assert.strictEqual(r.mode, "half");
  assert.deepStrictEqual(r.pins, { SCK: "PB13", MISO: "PB15" });
});
t("非模式资源向后兼容：无 mode 的 choice 照常工作", () => {
  const s = Avail.defaultState(miniChip);
  const r = Avail.assign(miniChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0", MISO: "PC1" } });
  assert.strictEqual(r.error, undefined, r.error);
  assert.strictEqual(Avail.countIO(miniChip, r.state).used, 3);
});
t("fromProjectJSON：合法 mode 往返一致；非法 mode 被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 1, chip: "CH582M", configs: {},
    resources: { SPI0: { group: false, mode: "half", pins: { SCK: "PA13", MISO: "PA15" } } }, gpio: {} };
  const ok = Exp.fromProjectJSON(CHIP, JSON.stringify(proj));
  assert.strictEqual(ok.error, undefined, ok.error);
  assert.strictEqual(ok.state.resources.SPI0.mode, "half");
  proj.resources.SPI0.mode = "nope";
  assert.ok(Exp.fromProjectJSON(CHIP, JSON.stringify(proj)).error);
});

console.log("\n=== 全外设普查修复：PWMx 共享映射位（RB_PIN_PWMX） ===");
t("PWMx：PWM4 用映射组后，PWM5 同组 OK、换默认组被拒", () => {
  let s = Avail.defaultState(CHIP);
  const r1 = Avail.assign(CHIP, s, "PWM4", { group: true, pins: { "PWM4": "PA6" } });
  assert.strictEqual(r1.error, undefined, r1.error);
  const r2 = Avail.assign(CHIP, r1.state, "PWM5", { group: true, pins: { "PWM5": "PA7" } });
  assert.strictEqual(r2.error, undefined, r2.error);
  const r3 = Avail.assign(CHIP, r1.state, "PWM5", { group: false, pins: { "PWM5": "PA13" } });
  assert.ok(r3.error && r3.error.includes("映射"), r3.error);
});
t("PWMx：先默认组，另一通道映射组被拒", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM4", { group: false, pins: { "PWM4": "PA12" } }).state;
  const r = Avail.assign(CHIP, s, "PWM5", { group: true, pins: { "PWM5": "PA7" } });
  assert.ok(r.error, "应被拒");
});
t("PWMx：不共享位的 PWM6 不受影响", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM4", { group: true, pins: { "PWM4": "PA6" } }).state;
  const r = Avail.assign(CHIP, s, "PWM6", { group: false, pins: { "PWM6": "PB0" } });
  assert.strictEqual(r.error, undefined, r.error);
});
t("PWMx：bestAssignment 自动跟随已分配通道的映射位", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM4", { group: true, pins: { "PWM4": "PA6" } }).state;
  const r = Avail.bestAssignment(CHIP, s, "PWM5");
  assert.strictEqual(r.usedAlt, true, JSON.stringify(r));
  assert.deepStrictEqual(r.pins, { "PWM5": "PA7" });
});
t("PWMx：pinOptions 对冲突映射位的项置灰并注明原因", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM4", { group: true, pins: { "PWM4": "PA6" } }).state;
  const pwm5 = Avail.pinOptions(CHIP, s, "PA13").find(o => o.rid === "PWM5");
  assert.ok(pwm5 && pwm5.ok === false, JSON.stringify(pwm5));
  assert.ok(pwm5.reason.includes("映射"), pwm5.reason);
});
t("validateChip: groupKey 资源共享映射位时每信号须有 2 个落脚点", () => {
  const r = Model.validateChip(badChip(c => {
    c.resources[0].groupKey = "G";
    c.resources[0].signals[0].pins = ["PA1"];
  }));
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("groupKey") || e.includes("映射位")));
});

console.log("\n=== 计数器功能二级菜单 + 信号自定义命名 ===");
t("validateChip: modes 允许空 signals（不占引脚模式）；非数组仍报错", () => {
  const ok = Model.validateChip(badChip(c => { c.resources[1].modes = [{ id: "t", label: "定时", signals: [] }]; }));
  assert.strictEqual(ok.ok, true, JSON.stringify(ok.errors));
  const bad = Model.validateChip(badChip(c => { c.resources[1].modes = [{ id: "t", label: "定时", signals: "x" }]; }));
  assert.strictEqual(bad.ok, false);
});
t("validateChip: 跨模式共享落脚点允许；同模式内共享仍报错", () => {
  const ok = Model.validateChip(badChip(c => {
    c.resources[1].modes = [{ id: "a", label: "A", signals: ["TMR1"] }, { id: "b", label: "B", signals: ["TMR1B"] }];
    c.resources[1].signals.push({ name: "TMR1B", pins: ["PB0"] });
  }));
  assert.strictEqual(ok.ok, true, JSON.stringify(ok.errors));
  const bad = Model.validateChip(badChip(c => {
    c.resources[1].modes = [{ id: "a", label: "A", signals: ["TMR1", "TMR1B"] }];
    c.resources[1].signals.push({ name: "TMR1B", pins: ["PB0"] });
  }));
  assert.strictEqual(bad.ok, false);
});
t("CH582M：TMR0 含 pwm/cap/count/timer 四模式，PWM/CAP/CNT 共享 PA9 落脚点", () => {
  const v = Model.validateChip(CHIP);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
  const t0 = Avail.findResource(CHIP, "TMR0");
  assert.deepStrictEqual(t0.modes.map(m => m.id), ["pwm", "cap", "count", "timer"]);
  assert.deepStrictEqual(t0.signals.find(s => s.name === "TMR0/CAP0").pins, ["PA9", "PB23"]);
  assert.deepStrictEqual(t0.signals.find(s => s.name === "TMR0/CNT0").pins, ["PA9", "PB23"]);
});
t("TMR0 选 PWM 模式 → 占 PA9；选 timer 模式 → 零占用但资源登记在案", () => {
  let s = Avail.defaultState(CHIP);
  const r1 = Avail.assign(CHIP, s, "TMR0", { group: false, mode: "pwm", pins: { "TMR0/PWM0": "PA9" } });
  assert.strictEqual(r1.error, undefined, r1.error);
  assert.strictEqual(Avail.computePins(CHIP, r1.state).get("PA9").status, "assigned");
  s = Avail.removeResource(r1.state, "TMR0");
  const r2 = Avail.assign(CHIP, s, "TMR0", { group: false, mode: "timer", pins: {} });
  assert.strictEqual(r2.error, undefined, r2.error);
  assert.strictEqual(Avail.computePins(CHIP, r2.state).get("PA9").status, "free");
  assert.strictEqual(Avail.countIO(CHIP, r2.state).used, 0);
  assert.ok(r2.state.resources.TMR0, "资源仍应被登记");
});
t("TMR0 外部计数模式：占用 PA9（计数引脚是输入，不是 No Pin）", () => {
  const s = Avail.defaultState(CHIP);
  const r = Avail.assign(CHIP, s, "TMR0", { group: false, mode: "count", pins: { "TMR0/CNT0": "PA9" } });
  assert.strictEqual(r.error, undefined, r.error);
  assert.strictEqual(Avail.computePins(CHIP, r.state).get("PA9").status, "assigned");
});
t("bestAssignment(TMR0, 'timer') → 空 pins 成功", () => {
  const s = Avail.defaultState(CHIP);
  const r = Avail.bestAssignment(CHIP, s, "TMR0", "timer");
  assert.strictEqual(r.error, undefined, JSON.stringify(r));
  assert.deepStrictEqual(r.pins, {});
});
t("setSignalLabel：写入别名、随 owner 带出、原 state 不变", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM11", { group: false, pins: { "PWM11": "PB23" } }).state;
  const s2 = Avail.setSignalLabel(s, "PWM11", "PWM11", "motor_pwm11");
  assert.strictEqual(s.resources.PWM11.labels, undefined);
  assert.strictEqual(s2.resources.PWM11.labels["PWM11"], "motor_pwm11");
  const owner = Avail.computePins(CHIP, s2).get("PB23").owners[0];
  assert.strictEqual(owner.alias, "motor_pwm11");
});
t("别名进入 CSV 备注列 + 工程往返保留", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.assign(CHIP, s, "PWM11", { group: false, pins: { "PWM11": "PB23" } }).state;
  s = Avail.setSignalLabel(s, "PWM11", "PWM11", "motor_pwm11");
  const csv = Exp.toCSV(CHIP, s);
  assert.ok(csv.includes("motor_pwm11"), "CSV 应含别名");
  const round = Exp.fromProjectJSON(CHIP, Exp.toProjectJSON(CHIP, s));
  assert.strictEqual(round.error, undefined, round.error);
  assert.strictEqual(round.state.resources.PWM11.labels["PWM11"], "motor_pwm11");
});
t("fromProjectJSON：labels 结构非法被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 1, chip: "CH582M", configs: {},
    resources: { PWM11: { group: false, mode: null, pins: { "PWM11": "PB23" }, labels: { "NOPE": 1 } } }, gpio: {} };
  assert.ok(Exp.fromProjectJSON(CHIP, JSON.stringify(proj)).error);
});

console.log("\n=== v1.5-1: 版本闸门 / id / chipId ===");
t("ENGINE_SCHEMA_MAX 导出且为 2（v1.7 闸门升版）", () => {
  assert.strictEqual(Model.ENGINE_SCHEMA_MAX, 2);
});
t("validateChip: schemaVersion=99 被拒且提示更新工具", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.schemaVersion = 99;
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("更新版本的工具")), r.errors.join("; "));
});
t("validateChip: schemaVersion 0 / 非数字被拒", () => {
  const a = JSON.parse(JSON.stringify(miniChip)); a.schemaVersion = 0;
  const b = JSON.parse(JSON.stringify(miniChip)); b.schemaVersion = "1";
  assert.strictEqual(Model.validateChip(a).ok, false);
  assert.strictEqual(Model.validateChip(b).ok, false);
});
t("validateChip: id 若提供必须是非空字符串", () => {
  const a = JSON.parse(JSON.stringify(miniChip)); a.id = "";
  const b = JSON.parse(JSON.stringify(miniChip)); b.id = 7;
  assert.strictEqual(Model.validateChip(a).ok, false);
  assert.strictEqual(Model.validateChip(b).ok, false);
});
t("chipId: 显式 id 优先；缺省 = name+package 的 slug", () => {
  assert.strictEqual(Model.chipId(miniChip), "mini-qfn8");
  const withId = JSON.parse(JSON.stringify(miniChip)); withId.id = "my-chip";
  assert.strictEqual(Model.chipId(withId), "my-chip");
  assert.strictEqual(Model.chipId({ chip: { name: "CH582M", package: "QFN48" } }), "ch582m-qfn48");
});
t("duplicateIdIndex: 报出后出现的重复者", () => {
  const a = JSON.parse(JSON.stringify(miniChip));
  const b = JSON.parse(JSON.stringify(miniChip)); b.chip.name = "MINI2";
  const c = JSON.parse(JSON.stringify(miniChip));
  assert.deepStrictEqual(Model.duplicateIdIndex([a, b, c]),
    [{ index: 2, id: "mini-qfn8", firstIndex: 0 }]);
  assert.deepStrictEqual(Model.duplicateIdIndex([a, b]), []);
});
t("真实数据文件：id 显式声明为 ch582m-qfn48", () => {
  const CHIP = require("../chips/wch-ch582m-qfn48.js");
  assert.strictEqual(CHIP.id, "ch582m-qfn48");
  assert.strictEqual(Model.chipId(CHIP), "ch582m-qfn48");
});

console.log("\n=== v1.5-2: loader 对账归类 ===");
const Loader = require("../js/loader.js");
t("classify: 文件加载失败", () => {
  const r = Loader.classify("chips/x.js", { loadError: true });
  assert.strictEqual(r.reason, "文件加载失败");
  assert.strictEqual(r.def, undefined);
});
t("classify: 加载成功但未注册数据", () => {
  const r = Loader.classify("chips/x.js", { added: [] });
  assert.strictEqual(r.reason, "加载成功但未注册数据");
});
t("classify: 正常注册取最后一个 def，多余产出记录在 extra", () => {
  const r = Loader.classify("chips/x.js", { added: [{ id: "a" }, { id: "b" }] });
  assert.strictEqual(r.def.id, "b");
  assert.strictEqual(r.extra, 1);
});
t("buildChips: extra（一文件多定义）透传到芯片条目", () => {
  const chips = Loader.buildChips([{ file: "chips/x.js", def: miniChip, extra: 2 }], Model);
  assert.strictEqual(chips[0].ok, true);
  assert.strictEqual(chips[0].extra, 2);
});

console.log("\n=== v1.5-3: 工程文件带芯片标识 ===");
t("toProjectJSON: 含 chipId（缺省 slug）", () => {
  const s = Avail.defaultState(miniChip);
  const obj = JSON.parse(Exp.toProjectJSON(miniChip, s));
  assert.strictEqual(obj.chipId, "mini-qfn8");
});
t("readProjectChipId: 有 / 无（老文件） / 非法", () => {
  const withId = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI", chipId: "mini-qfn8" });
  const without = JSON.stringify({ app: "chip-pin-planner", schemaVersion: 1, chip: "MINI" });
  assert.strictEqual(Exp.readProjectChipId(withId).chipId, "mini-qfn8");
  assert.strictEqual(Exp.readProjectChipId(without).chipId, null);
  assert.ok(Exp.readProjectChipId(JSON.stringify({ app: "chip-pin-planner", chipId: 7 })).error);
  assert.ok(Exp.readProjectChipId("{oops").error);
});
t("老工程文件（无 chipId）仍可导入", () => {
  const s = Avail.defaultState(miniChip);
  const obj = JSON.parse(Exp.toProjectJSON(miniChip, s));
  delete obj.chipId;
  const r = Exp.fromProjectJSON(miniChip, JSON.stringify(obj));
  assert.strictEqual(r.error, undefined, r.error);
});

console.log("\n=== v1.5-4: 终审修复（置灰原因 / HTML 转义） ===");
t("classify: 注册表推入 undefined 视为未注册", () => {
  const r = Loader.classify("chips/x.js", { added: [undefined] });
  assert.strictEqual(r.reason, "加载成功但未注册数据");
});
t("buildChips: 高版本数据 → 提示更新工具", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.schemaVersion = 99;
  const chips = Loader.buildChips([{ file: "chips/future.js", def: bad }], Model);
  assert.strictEqual(chips[0].ok, false);
  assert.strictEqual(chips[0].reason, "需要更新版本的工具");
});
t("buildChips: 普通非法数据 → 数据校验失败", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  delete bad.chip.name;
  const chips = Loader.buildChips([{ file: "chips/bad.js", def: bad }], Model);
  assert.strictEqual(chips[0].reason, "数据校验失败");
});
t("buildChips: 无定义兜底原因；正常芯片带 chipId", () => {
  const chips = Loader.buildChips([
    { file: "chips/none.js" },
    { file: "chips/mini.js", def: miniChip }
  ], Model);
  assert.strictEqual(chips[0].reason, "加载成功但未注册数据");
  assert.strictEqual(chips[1].ok, true);
  assert.strictEqual(chips[1].chipId, "mini-qfn8");
});
t("buildChips: 重复 id 后到者置灰", () => {
  const a = JSON.parse(JSON.stringify(miniChip));
  const b = JSON.parse(JSON.stringify(miniChip));
  const chips = Loader.buildChips([
    { file: "chips/a.js", def: a },
    { file: "chips/b.js", def: b }
  ], Model);
  assert.strictEqual(chips[0].ok, true);
  assert.strictEqual(chips[1].ok, false);
  assert.strictEqual(chips[1].reason, "id 与 MINI 冲突");
});
console.log("\n=== M1: 芯片按 vendor/series 分组 ===");
t("groupChips：按 vendor · series 分组，保持清单顺序", () => {
  const chips = [
    { ok: true, def: { chip: { vendor: "WCH", series: "CH58x", name: "CH582M", package: "QFN48" } } },
    { ok: true, def: { chip: { vendor: "WCH", series: "CH59x", name: "CH592", package: "QFN32" } } },
    { ok: true, def: { chip: { vendor: "WCH", series: "CH58x", name: "CH583M", package: "QFN48" } } }
  ];
  const g = Loader.groupChips(chips);
  assert.strictEqual(g.length, 2);
  assert.strictEqual(g[0].label, "WCH · CH58x");
  assert.deepStrictEqual(g[0].items.map(x => x.index), [0, 2]);
  assert.strictEqual(g[1].label, "WCH · CH59x");
  assert.deepStrictEqual(g[1].items.map(x => x.index), [1]);
});
t("groupChips：缺 series 归入未分类", () => {
  const chips = [{ ok: true, def: { chip: { vendor: "WCH", name: "X", package: "QFN8" } } }];
  const g = Loader.groupChips(chips);
  assert.strictEqual(g[0].label, "WCH · 未分类");
});
t("validateChip：chip.series 若提供必须是非空字符串", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.chip.series = "  ";
  const r = Model.validateChip(bad);
  assert.ok(r.errors.some(e => e.includes("series")));
  const ok = JSON.parse(JSON.stringify(miniChip));
  ok.chip.series = "CH58x";
  assert.strictEqual(Model.validateChip(ok).ok, true);
});
t("escapeHtml: 五个字符实体化", () => {
  const Util = require("../js/util.js");
  assert.strictEqual(Util.escapeHtml('<a b="c">&\'x'), "&lt;a b=&quot;c&quot;&gt;&amp;&#39;x");
});

console.log("\n=== v1.6: 左栏可用性色块 availability.resourceStatus ===");

// 色块测试专用芯片：SPI0 映射组 / TMR0 三模式(含不占脚) / PWMX 共享映射位 / UART0 单落脚点 / 开关锁 PA1
const statusChip = (() => {
  const c = JSON.parse(JSON.stringify(miniChip));
  c.chip = { vendor: "TEST", name: "STATUS", package: "QFN8" };
  c.globalConfigs = [ { id: "lock1", label: "锁定开关", default: false, claims: ["PA1"] } ];
  c.resources = [
    { id: "SPI0", category: "SPI", label: "SPI0", groupSwitch: { label: "改用映射组" },
      signals: [ { name: "SCK", pins: ["PA1", "PB1"] },
                 { name: "MOSI", pins: ["PC0", "PD0"] } ] },
    { id: "TMR0", category: "TIMER", label: "TMR0",
      modes: [ { id: "pwm", label: "PWM 输出", signals: ["TMR0/PWM0"] },
               { id: "cap", label: "捕捉输入", signals: ["TMR0/CAP0"] },
               { id: "timer", label: "内部定时", signals: [] } ],
      signals: [ { name: "TMR0/PWM0", pins: ["PB0"] },
                 { name: "TMR0/CAP0", pins: ["PA0"] } ] },
    { id: "PWMX1", category: "PWM", label: "PWMX1", groupKey: "X",
      signals: [ { name: "PWMX1", pins: ["PC0", "PC1"] } ] },
    { id: "PWMX2", category: "PWM", label: "PWMX2", groupKey: "X",
      signals: [ { name: "PWMX2", pins: ["PD0", "PD1"] } ] },
    { id: "UART0", category: "UART", label: "UART0",
      signals: [ { name: "TX", pins: ["PB1"] }, { name: "RX", pins: ["PC1"] } ] }
  ];
  return c;
})();

t("bestAssignment：映射组兜底时带出默认组缺的信号（defaultMissing）", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PA1", "X");
  const b = Avail.bestAssignment(statusChip, s, "SPI0");
  assert.strictEqual(b.usedAlt, true, JSON.stringify(b));
  assert.deepStrictEqual(b.defaultMissing, ["SCK"]);
});

t("resourceStatus(SPI0)：默认组净落 → ok，原因含默认落脚点", () => {
  const s = Avail.defaultState(statusChip);
  const st = Avail.resourceStatus(statusChip, s, "SPI0");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
  assert.ok(st.reason.includes("PA1") && st.reason.includes("PC0"), st.reason);
});

t("resourceStatus(SPI0)：默认组被占自动走映射组 → warn，含缺的信号与映射落脚点", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PA1", "X");
  const st = Avail.resourceStatus(statusChip, s, "SPI0");
  assert.strictEqual(st.level, "warn", JSON.stringify(st));
  assert.ok(st.reason.includes("SCK"), st.reason);
  assert.ok(st.reason.includes("PB1"), st.reason);
});

t("resourceStatus(SPI0)：两组都不可用 → blocked", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PA1", "X");
  s = Avail.setGpio(s, "PB1", "X");
  const st = Avail.resourceStatus(statusChip, s, "SPI0");
  assert.strictEqual(st.level, "blocked", JSON.stringify(st));
  assert.ok(st.reason.includes("缺") && st.reason.includes("映射组"), st.reason);
});

t("resourceStatus(SPI0)：配置开关锁默认组脚 → warn（与占用同等待遇）", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setConfig(s, "lock1", true);
  const st = Avail.resourceStatus(statusChip, s, "SPI0");
  assert.strictEqual(st.level, "warn", JSON.stringify(st));
  assert.ok(st.reason.includes("PB1"), st.reason);
});

t("resourceStatus：已分配资源 → used", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.assign(statusChip, s, "SPI0", { group: false, pins: { SCK: "PA1", MOSI: "PC0" } }).state;
  const st = Avail.resourceStatus(statusChip, s, "SPI0");
  assert.strictEqual(st.level, "used", JSON.stringify(st));
});

t("resourceStatus(PWMX2)：跟随同 groupKey 已分配资源 → ok（协调不算告警）", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.assign(statusChip, s, "PWMX1", { group: false, pins: { "PWMX1": "PC1" } }).state;
  const st = Avail.resourceStatus(statusChip, s, "PWMX2");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
  assert.ok(st.reason.includes("PD1"), st.reason);
});

t("resourceStatus(TMR0)：PWM 被占但捕捉可落 → 汇总 ok 且原因带 PWM 明细", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PB0", "X");
  const st = Avail.resourceStatus(statusChip, s, "TMR0");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
  assert.ok(st.reason.includes("捕捉"), st.reason);
  assert.ok(st.reason.includes("PWM 输出") && st.reason.includes("TMR0/PWM0"), st.reason);
});

t("resourceStatus(TMR0)：全部占脚模式无落脚点 → blocked，并提示仍可作内部定时", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PB0", "X");
  s = Avail.setGpio(s, "PA0", "X");
  const st = Avail.resourceStatus(statusChip, s, "TMR0");
  assert.strictEqual(st.level, "blocked", JSON.stringify(st));
  assert.ok(st.reason.includes("内部定时"), st.reason);
});

t("resourceStatus(UART0)：无模式资源两脚被占 → blocked，不提映射组", () => {
  let s = Avail.defaultState(statusChip);
  s = Avail.setGpio(s, "PB1", "X");
  s = Avail.setGpio(s, "PC1", "X");
  const st = Avail.resourceStatus(statusChip, s, "UART0");
  assert.strictEqual(st.level, "blocked", JSON.stringify(st));
  assert.ok(st.reason.includes("TX") && st.reason.includes("RX"), st.reason);
  assert.ok(!st.reason.includes("映射组"), st.reason);
});

t("resourceStatus：全部模式都不占引脚 → ok（不占引脚）", () => {
  const c = JSON.parse(JSON.stringify(statusChip));
  c.resources.push({ id: "VTMR", category: "TIMER", label: "VTMR",
    signals: [], modes: [ { id: "t", label: "纯定时", signals: [] } ] });
  const st = Avail.resourceStatus(c, Avail.defaultState(c), "VTMR");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
  assert.ok(st.reason.includes("不占引脚"), st.reason);
});

t("真实数据：SPI0 — 关调试口 + PA13 被占 → warn（映射组 PB13 兜底）", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);
  s = Avail.setGpio(s, "PA13", "G");
  const st = Avail.resourceStatus(CHIP, s, "SPI0");
  assert.strictEqual(st.level, "warn", JSON.stringify(st));
  assert.ok(st.reason.includes("PB13") && st.reason.includes("SCK"), st.reason);
});

t("真实数据：SPI0 默认组被占 + 映射组被调试口挡 → blocked", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setGpio(s, "PA13", "G");
  const st = Avail.resourceStatus(CHIP, s, "SPI0");
  assert.strictEqual(st.level, "blocked", JSON.stringify(st));
  assert.ok(st.reason.includes("映射组"), st.reason);
});

console.log("\n=== v1.7-1: 可选信号核心 ===");

// 可选信号测试芯片（12 脚）：资源级 optional + 模式级 optional + 信号级共享映射位
const optChip = (() => {
  const c = JSON.parse(JSON.stringify(miniChip));
  c.chip = { vendor: "TEST", name: "OPT", package: "QFN12" };
  c.package.pinsPerSide = 3;
  c.package.body = [3, 3];
  c.pins = [
    { num: 1, name: "PA0", type: "io", alts: [] },
    { num: 2, name: "PA1", type: "io", alts: [] },
    { num: 3, name: "PA2", type: "io", alts: [] },
    { num: 4, name: "PB0", type: "io", alts: [] },
    { num: 5, name: "PB1", type: "io", alts: [] },
    { num: 6, name: "PB2", type: "io", alts: [] },
    { num: 7, name: "PC0", type: "io", alts: [] },
    { num: 8, name: "PC1", type: "io", alts: [] },
    { num: 9, name: "PC2", type: "io", alts: [] },
    { num: 10, name: "PD0", type: "io", alts: [] },
    { num: 11, name: "PD1", type: "io", alts: [] },
    { num: 12, name: "PD2", type: "io", alts: [] },
    { num: "EP", name: "GND", type: "power", alts: [] }
  ];
  c.globalConfigs = [];
  c.resources = [
    { id: "UART0", category: "UART", label: "UART0", groupSwitch: { label: "改用映射组" },
      optional: ["RTS", "DTR", "DSR"],
      signals: [
        { name: "TXD", pins: ["PA1", "PB1"] },
        { name: "RXD", pins: ["PC0", "PD0"] },
        { name: "RTS", pins: ["PA2"] },
        { name: "DTR", pins: ["PC1", "PD1"], groupKey: "UART0_MODEM" },
        { name: "DSR", pins: ["PB0", "PB2"], groupKey: "UART0_MODEM" }
      ] },
    { id: "SPI1x", category: "SPI", label: "SPI1x",
      modes: [
        { id: "m1", label: "模式1", signals: ["SCK", "TX", "CS"], optional: ["CS"] },
        { id: "m2", label: "模式2", signals: ["SCK", "CS"] }
      ],
      signals: [
        { name: "SCK", pins: ["PC2", "PD2"] },
        { name: "TX",  pins: ["PA0"] },
        { name: "CS",  pins: ["PC1", "PD1"] }
      ] },
    { id: "XMEM", category: "MEM", label: "XMEM",
      signals: [
        { name: "A", pins: ["PC1", "PD1"], groupKey: "XM" },
        { name: "B", pins: ["PB0", "PB2"], groupKey: "XM" }
      ] }
  ];
  return c;
})();

t("requiredSignals/optionalSignals：资源级 optional 拆分", () => {
  const res = Avail.findResource(optChip, "UART0");
  assert.deepStrictEqual(Avail.requiredSignals(res).map(s => s.name), ["TXD", "RXD"]);
  assert.deepStrictEqual(Avail.optionalSignals(res).map(s => s.name), ["RTS", "DTR", "DSR"]);
});

t("requiredSignals/optionalSignals：模式级 optional（未列的模式=全必选）", () => {
  const res = Avail.findResource(optChip, "SPI1x");
  assert.deepStrictEqual(Avail.requiredSignals(res, "m1").map(s => s.name).sort(), ["SCK", "TX"]);
  assert.deepStrictEqual(Avail.optionalSignals(res, "m1").map(s => s.name), ["CS"]);
  assert.deepStrictEqual(Avail.requiredSignals(res, "m2").map(s => s.name).sort(), ["CS", "SCK"]);
  assert.deepStrictEqual(Avail.optionalSignals(res, "m2"), []);
});

t("canAssign：必选缺一不可", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("RXD"), r.reason);
});

t("canAssign：可选子集合法（配了/没配都行）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).ok, true);
});

t("canAssign：可选信号落脚点非法仍被拒", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PB2" } });
  assert.strictEqual(r.ok, false);
});

t("canAssign：可选信号也不许双占", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");
  const r = Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } });
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("PA2"), r.reason);
});

t("candidatePins：groupSwitch 资源里的单落脚点可选信号不随组切换", () => {
  const s = Avail.defaultState(optChip);
  assert.deepStrictEqual(Avail.candidatePins(optChip, s, "UART0", false).signals.RTS, ["PA2"]);
  assert.deepStrictEqual(Avail.candidatePins(optChip, s, "UART0", true).signals.RTS, ["PA2"]);
});

t("canAssign：groupSwitch 下单脚可选信号任意组都允许", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: true, mode: null, pins: { TXD: "PB1", RXD: "PD0", RTS: "PA2" } }).ok, true);
});

console.log("\n=== v1.7-2: 信号级共享映射位（同侧） ===");

t("同侧约束：DTR 在映射侧后，DSR 默认侧被拒、映射侧通过", () => {
  const s = Avail.defaultState(optChip);
  // DTR 在映射侧 PD1（index 1）
  const base = { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } };
  const bad = Avail.canAssign(optChip, s, "UART0",
    Object.assign({}, base, { pins: Object.assign({}, base.pins, { DSR: "PB0" }) }));   // PB0=默认侧
  assert.strictEqual(bad.ok, false);
  assert.ok(bad.reason.includes("同侧") && bad.reason.includes("DTR"), bad.reason);
  const good = Avail.canAssign(optChip, s, "UART0",
    Object.assign({}, base, { pins: Object.assign({}, base.pins, { DSR: "PB2" }) }));   // PB2=映射侧
  assert.strictEqual(good.ok, true, JSON.stringify(good));
});

t("同侧约束方向对称：先 DSR 后 DTR 同样拦", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.canAssign(optChip, s, "UART0", { group: false, mode: null,
    pins: { TXD: "PA1", RXD: "PC0", DSR: "PB2", DTR: "PC1" } });   // DSR 映射侧 + DTR 默认侧
  assert.strictEqual(r.ok, false);
  assert.ok(r.reason.includes("同侧"), r.reason);
});

t("同侧约束：只配一个不受约束（两侧都行）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DSR: "PB0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DSR: "PB2" } }).ok, true);
});

t("同侧约束：两者同侧通过（默认/映射各一组）", () => {
  const s = Avail.defaultState(optChip);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PC1", DSR: "PB0" } }).ok, true);
  assert.strictEqual(Avail.canAssign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1", DSR: "PB2" } }).ok, true);
});

console.log("\n=== v1.7-3: setSignal / signalOptions ===");

t("setSignal：添加可选信号，保留既有分配", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "RTS", "PA2");
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.state.resources.UART0.pins, { TXD: "PA1", RXD: "PC0", RTS: "PA2" });
  assert.strictEqual(s.resources.UART0.pins.RTS, undefined, "原 state 不得被改");
});

t("setSignal：pin=null 移除单信号", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "RTS", null);
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.state.resources.UART0.pins, { TXD: "PA1", RXD: "PC0" });
});

t("setSignal：同侧冲突时透传原因（DTR 已配后加 DSR 反侧）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const r = Avail.setSignal(optChip, s, "UART0", "DSR", "PB0");
  assert.ok(r.error && r.error.includes("同侧"), r.error);
  const ok = Avail.setSignal(optChip, s, "UART0", "DSR", "PB2");
  assert.strictEqual(ok.error, undefined, ok.error);
});

t("setSignal：未分配资源报错", () => {
  const s = Avail.defaultState(optChip);
  assert.ok(Avail.setSignal(optChip, s, "UART0", "RTS", "PA2").error);
});

t("signalOptions：列出各落脚点可用性与原因", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const opts = Avail.signalOptions(optChip, s, "UART0", "DSR");
  assert.deepStrictEqual(opts.map(o => o.pin), ["PB0", "PB2"]);
  assert.strictEqual(opts[0].ok, false);              // 默认侧与 DTR 反侧
  assert.ok(opts[0].reason.includes("同侧"), opts[0].reason);
  assert.strictEqual(opts[1].ok, true);               // 映射侧可用
});

t("signalOptions：脚被占时置灰并说明", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  s = Avail.setGpio(s, "PB2", "X");
  const opts = Avail.signalOptions(optChip, s, "UART0", "DSR");
  assert.strictEqual(opts.find(o => o.pin === "PB2").ok, false);
  assert.ok(opts.find(o => o.pin === "PB2").reason.includes("占用"), JSON.stringify(opts));
});

console.log("\n=== v1.7-4: 既有路径适配 ===");

t("bestAssignment：可选信号脚被占不影响一键分配，且只返回必选", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");    // RTS 的脚被占
  s = Avail.setGpio(s, "PB0", "X");    // DSR 默认侧被占
  const b = Avail.bestAssignment(optChip, s, "UART0");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { TXD: "PA1", RXD: "PC0" });
});

t("bestAssignment：必选内部共享映射位（groupKey）同侧放置", () => {
  const s = Avail.defaultState(optChip);
  const b = Avail.bestAssignment(optChip, s, "XMEM");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { A: "PC1", B: "PB0" });   // 都默认侧
  let s2 = Avail.setGpio(s, "PC1", "X");
  const b2 = Avail.bestAssignment(optChip, s2, "XMEM");
  assert.strictEqual(b2.error, undefined, JSON.stringify(b2));
  assert.deepStrictEqual(b2.pins, { A: "PD1", B: "PB2" });  // 默认侧受阻 → 整对映射侧
});

t("resourceStatus：可选信号脚被占不影响色点判定", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PA2", "X");
  s = Avail.setGpio(s, "PB0", "X");
  const st = Avail.resourceStatus(optChip, s, "UART0");
  assert.strictEqual(st.level, "ok", JSON.stringify(st));
});

t("pinOptions：资源未分配时可选信号置灰并提示先分配", () => {
  const s = Avail.defaultState(optChip);
  const item = Avail.pinOptions(optChip, s, "PA2").find(o => o.rid === "UART0" && o.signal === "RTS");
  assert.ok(item, "应有 RTS 条目");
  assert.strictEqual(item.ok, false);
  assert.ok(item.reason.includes("先分配"), item.reason);
});

t("pinOptions：资源已分配后可选信号变为 add-signal 项", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } }).state;
  const item = Avail.pinOptions(optChip, s, "PA2").find(o => o.rid === "UART0" && o.signal === "RTS");
  assert.strictEqual(item.type, "add-signal");
  assert.strictEqual(item.ok, true, JSON.stringify(item));
});

t("pinOptions：add-signal 项也受同侧约束（DSR 默认侧被置灰并给原因）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0",
    { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", DTR: "PD1" } }).state;
  const item = Avail.pinOptions(optChip, s, "PB0").find(o => o.rid === "UART0" && o.signal === "DSR");
  assert.strictEqual(item.type, "add-signal");
  assert.strictEqual(item.ok, false);
  assert.ok(item.reason.includes("同侧"), item.reason);
});

console.log("\n=== v1.7-5: rebuildChoice ===");

t("rebuildChoice：切主组搬必选、MODEM 等自有映射位/单脚信号原位不动", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", RTS: "PA2", DTR: "PD1", DSR: "PB2" } }).state;
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { TXD: "PB1", RXD: "PD0", RTS: "PA2", DTR: "PD1", DSR: "PB2" });
});

t("rebuildChoice：换模式保留可加项、丢弃不在新模式的信号", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "SPI1x", { group: false, mode: "m1", pins: { SCK: "PC2", TX: "PA0", CS: "PC1" } }).state;
  const r = Avail.rebuildChoice(optChip, s, "SPI1x", { mode: "m2" });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { SCK: "PC2", CS: "PC1" });   // TX 不在 m2；CS 原位保留
});

t("rebuildChoice：可选信号保不住 → 整体报错、什么都不改", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  s = Avail.setGpio(s, "PA2", "X");     // RTS 的脚被占
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.ok(r.error && r.error.includes("RTS"), r.error);
  assert.strictEqual(r.choice, undefined);
});

t("rebuildChoice：pinOverride 指定新脚（配合组参数走引脚菜单路径）", () => {
  const s = Avail.defaultState(optChip);
  const r = Avail.rebuildChoice(optChip, s, "UART0",
    { group: true, pinOverride: { TXD: "PB1" } });
  assert.strictEqual(r.error, undefined, r.error);
  assert.deepStrictEqual(r.choice.pins, { TXD: "PB1", RXD: "PD0" });
});

t("rebuildChoice：必选在新侧无落脚点 → 报缺（沿用「缺 X」文案）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.setGpio(s, "PB1", "X");     // 映射侧 TXD 脚被占
  const r = Avail.rebuildChoice(optChip, s, "UART0", { group: true });
  assert.ok(r.error && r.error.includes("TXD"), r.error);
});

console.log("\n=== v1.7-6: validateChip 新规则 + 闸门 v2 ===");

t("validateChip(optChip) 通过（含单脚可选信号 + 信号 groupKey）", () => {
  const r = Model.validateChip(optChip);
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});

t("validateChip：optional 必须是对应信号清单的子集（资源级）", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[0].optional = ["NOPE"];
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("NOPE")), "应报未知可选信号");
  const bad2 = JSON.parse(JSON.stringify(optChip));
  bad2.resources[0].optional = "RTS";
  assert.strictEqual(Model.validateChip(bad2).ok, false);
});

t("validateChip：模式级 optional 必须是该模式信号集的子集", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[1].modes[1].optional = ["TX"];   // m2 的信号集是 [SCK, CS]，TX 不在
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("TX")), "应报未知可选信号");
});

t("validateChip：groupSwitch 的必选信号仍须恰好 2 个落脚点", () => {
  const bad = JSON.parse(JSON.stringify(miniChip));
  bad.resources[0].signals[0].pins = ["PA1"];    // SCK 是 miniChip SPI0 的必选信号
  assert.strictEqual(Model.validateChip(bad).ok, false);
});

t("validateChip：groupSwitch 的单脚可选信号放行", () => {
  const r = Model.validateChip(optChip);         // optChip UART0：groupSwitch + RTS 单脚可选
  assert.strictEqual(r.ok, true, JSON.stringify(r.errors));
});

t("validateChip：signal.groupKey 必须是非空字符串且该信号恰好 2 落脚点", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[0].signals[4].pins = ["PB0"];    // DSR 只剩 1 脚
  assert.ok(Model.validateChip(bad).errors.some(e => e.includes("groupKey")), "应报 groupKey");
  const bad2 = JSON.parse(JSON.stringify(optChip));
  bad2.resources[0].signals[4].groupKey = 7;
  assert.strictEqual(Model.validateChip(bad2).ok, false);
});

t("同侧冲突原因锚定已配置信号（新加信号反侧时提示指向旧信号与旧位置）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", DSR: "PB2" } }).state;   // DSR 已配在映射侧
  const r = Avail.setSignal(optChip, s, "UART0", "DTR", "PC1");   // 试图把 DTR 放到默认侧
  assert.ok(r.error, "应被拒");
  assert.ok(r.error.includes("DSR 当前在 PB2"), r.error);
});

t("闸门：ENGINE_SCHEMA_MAX=2，芯片数据 v2 放行、v3 报更新工具", () => {
  assert.strictEqual(Model.ENGINE_SCHEMA_MAX, 2);
  const v2 = JSON.parse(JSON.stringify(miniChip)); v2.schemaVersion = 2;
  assert.strictEqual(Model.validateChip(v2).ok, true);
  const v3 = JSON.parse(JSON.stringify(miniChip)); v3.schemaVersion = 3;
  const r = Model.validateChip(v3);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("更新版本的工具")));
});

console.log("\n=== v1.7-7: 工程文件 v2 ===");

t("toProjectJSON：写出 schemaVersion 2", () => {
  const obj = JSON.parse(Exp.toProjectJSON(optChip, Avail.defaultState(optChip)));
  assert.strictEqual(obj.schemaVersion, 2);
});

t("fromProjectJSON：v2 往返（含可选信号子集）一致", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", DTR: "PD1", DSR: "PB2" } }).state;
  const rt = Exp.fromProjectJSON(optChip, Exp.toProjectJSON(optChip, s));
  assert.strictEqual(rt.error, undefined, rt.error);
  assert.deepStrictEqual(rt.state.resources.UART0.pins, s.resources.UART0.pins);
});

t("fromProjectJSON：缺必选信号被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 2, chip: "OPT", configs: {},
    resources: { UART0: { group: false, mode: null, pins: { TXD: "PA1" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("RXD"), r.error);
});

t("fromProjectJSON：v1 老文件（无 optional 概念）照读", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 1, chip: "OPT", configs: {},
    resources: { UART0: { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.strictEqual(r.error, undefined, r.error);
});

t("fromProjectJSON：schemaVersion 3 被拒", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 3, chip: "OPT", configs: {}, resources: {}, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("版本"), r.error);
});

console.log("\n=== v1.7-8: CH582M v2 数据 ===");

t("数据 v2：validateChip 通过（schemaVersion=2）", () => {
  assert.strictEqual(CHIP.schemaVersion, 2);
  const v = Model.validateChip(CHIP);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("UART0：MODEM 六可选信号、引脚与信号级 groupKey 正确", () => {
  const u = Avail.findResource(CHIP, "UART0");
  assert.deepStrictEqual(u.optional, ["RTS", "CTS", "DTR", "DSR", "RI", "DCD"]);
  const sig = n => u.signals.find(s => s.name === n);
  assert.deepStrictEqual(sig("RTS").pins, ["PB6"]);
  assert.deepStrictEqual(sig("CTS").pins, ["PB0"]);
  assert.deepStrictEqual(sig("DTR").pins, ["PB5", "PB15"]);
  assert.deepStrictEqual(sig("DSR").pins, ["PB1", "PB14"]);
  assert.strictEqual(sig("DTR").groupKey, "UART0_MODEM");
  assert.strictEqual(sig("DSR").groupKey, "UART0_MODEM");
});

t("UART0：一键分配只占 PB7/PB4 两线（MODEM 全被占也不影响）", () => {
  let s = Avail.defaultState(CHIP);
  ["PB6", "PB0", "PB5", "PB1", "PB2", "PB3"].forEach(p => { s = Avail.setGpio(s, p, "X"); });
  const b = Avail.bestAssignment(CHIP, s, "UART0");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { TXD: "PB7", RXD: "PB4" });
});

t("UART0：先加 DTR@PB5，再加 DSR@PB14 被拒（同侧）、DSR@PB1 通过", () => {
  let s = Avail.defaultState(CHIP);
  s = Avail.setConfig(s, "debug", false);   // PB14/PB15 是调试口默认锁定脚，先释放
  s = Avail.assign(CHIP, s, "UART0", { group: false, mode: null, pins: { TXD: "PB7", RXD: "PB4" } }).state;
  s = Avail.setSignal(CHIP, s, "UART0", "DTR", "PB5").state;
  const bad = Avail.setSignal(CHIP, s, "UART0", "DSR", "PB14");
  assert.ok(bad.error && bad.error.includes("同侧"), bad.error);
  const ok = Avail.setSignal(CHIP, s, "UART0", "DSR", "PB1");
  assert.strictEqual(ok.error, undefined, ok.error);
});

t("SPI0：四模式与 SCS 数据正确", () => {
  const sp = Avail.findResource(CHIP, "SPI0");
  assert.deepStrictEqual(sp.modes.map(m => m.id), ["full", "half", "slave-full", "slave-half"]);
  assert.deepStrictEqual(sp.modes[0].optional, ["SCS"]);
  assert.deepStrictEqual(sp.modes[2].signals, ["SCS", "SCK", "MOSI", "MISO"]);
  assert.deepStrictEqual(sp.modes[3].signals, ["SCS", "SCK", "MISO"]);
  assert.deepStrictEqual(sp.signals.find(s => s.name === "SCS").pins, ["PA12", "PB12"]);
});

t("SPI0：从机全双工一键分配占四线（含 SCS）", () => {
  const s = Avail.defaultState(CHIP);
  const b = Avail.bestAssignment(CHIP, s, "SPI0", "slave-full");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(b.pins, { SCS: "PA12", SCK: "PA13", MOSI: "PA14", MISO: "PA15" });
});

t("SPI0：从机半双工占三线；主机模式 SCS 可后加", () => {
  let s = Avail.defaultState(CHIP);
  const b = Avail.bestAssignment(CHIP, s, "SPI0", "slave-half");
  assert.strictEqual(b.error, undefined, JSON.stringify(b));
  assert.deepStrictEqual(Object.keys(b.pins).sort(), ["MISO", "SCK", "SCS"]);
  s = Avail.assign(CHIP, s, "SPI0", { group: false, mode: "full",
    pins: { SCK: "PA13", MOSI: "PA14", MISO: "PA15" } }).state;
  const add = Avail.setSignal(CHIP, s, "SPI0", "SCS", "PA12");
  assert.strictEqual(add.error, undefined, add.error);
});

t("RF 开关：启用后 PB16-21 六脚全部锁定", () => {
  let s = Avail.defaultState(CHIP);
  const before = Avail.countIO(CHIP, s);
  s = Avail.setConfig(s, "rf_ant_sw", true);
  const pins = Avail.computePins(CHIP, s);
  ["PB16", "PB17", "PB18", "PB19", "PB20", "PB21"].forEach(p => {
    assert.strictEqual(pins.get(p).status, "locked", p + " 应被 RF 开关锁定");
  });
  assert.strictEqual(Avail.countIO(CHIP, s).locked, before.locked + 6);
});

console.log("\n=== v1.7-终审修复 ===");

t("assign：重分配保留既有 labels（仅限仍存在的信号）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: { TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  s = Avail.setSignalLabel(s, "UART0", "TXD", "TX_net");
  s = Avail.setSignalLabel(s, "UART0", "RTS", "rts_flow");
  const r1 = Avail.setSignal(optChip, s, "UART0", "DTR", "PC1");
  assert.strictEqual(r1.error, undefined, r1.error);
  assert.deepStrictEqual(r1.state.resources.UART0.labels, { TXD: "TX_net", RTS: "rts_flow" });
  const r2 = Avail.setSignal(optChip, r1.state, "UART0", "RTS", null);
  assert.deepStrictEqual(r2.state.resources.UART0.labels, { TXD: "TX_net" });
});

t("fromProjectJSON：拒绝同 groupKey 反侧工程", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 2, chip: "CH582M", configs: {},
    resources: { UART0: { group: false, mode: null, pins: {
      TXD: "PB7", RXD: "PB4", DTR: "PB15", DSR: "PB1" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(CHIP, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("同侧"), r.error);
});

t("fromProjectJSON：拒绝 group 与落脚点侧不一致的工程", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 2, chip: "CH582M", configs: {},
    resources: { SPI0: { group: false, mode: "full", pins: {
      SCK: "PB13", MOSI: "PA14", MISO: "PA15" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(CHIP, JSON.stringify(proj));
  assert.ok(r.error && r.error.includes("不一致"), r.error);
});

t("fromProjectJSON：modes 资源 mode=null 归一化为首个模式（右栏 ＋/× 不丢）", () => {
  const proj = { app: "chip-pin-planner", schemaVersion: 2, chip: "OPT", configs: {},
    resources: { SPI1x: { group: false, mode: null, pins: { SCK: "PC2", TX: "PA0" } } }, gpio: {} };
  const r = Exp.fromProjectJSON(optChip, JSON.stringify(proj));
  assert.strictEqual(r.error, undefined, r.error);
  assert.strictEqual(r.state.resources.SPI1x.mode, "m1");
});

t("validateChip：有 modes 的资源禁止资源级 optional（必须放模式级）", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[1].optional = ["SCK"];
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("模式级")), JSON.stringify(r.errors));
});

t("validateChip：groupSwitch 的可选信号只支持 1 或 2 个落脚点", () => {
  const bad = JSON.parse(JSON.stringify(optChip));
  bad.resources[0].signals[2].pins = ["PA2", "PA0", "PC2"];   // RTS 三脚
  const r = Model.validateChip(bad);
  assert.strictEqual(r.ok, false);
  assert.ok(r.errors.some(e => e.includes("落脚点")), JSON.stringify(r.errors));
});

t("setSignal：冲突态下移除可选信号被拒（既有严格语义，先解冲突）", () => {
  let s = Avail.defaultState(optChip);
  s = Avail.assign(optChip, s, "UART0", { group: false, mode: null, pins: {
    TXD: "PA1", RXD: "PC0", RTS: "PA2" } }).state;
  s = Avail.setGpio(s, "PA1", "X");   // 他方抢占 TXD 脚 → 冲突态
  const r = Avail.setSignal(optChip, s, "UART0", "RTS", null);
  assert.ok(r.error && r.error.includes("已被占用"), r.error);
});

console.log("\n=== v1.8-1: 工程路由 ===");

t("readProjectChipId：返回 package（有/无/非字符串）", () => {
  const withPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M", package: "QFN48" });
  assert.strictEqual(Exp.readProjectChipId(withPkg).package, "QFN48");
  const noPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M" });
  assert.strictEqual(Exp.readProjectChipId(noPkg).package, null);
  const badPkg = JSON.stringify({ app: "chip-pin-planner", chip: "CH582M", package: 7 });
  assert.strictEqual(Exp.readProjectChipId(badPkg).package, null);
});

t("resolveProjectTarget：chipId 命中 / 未命中带 miss 标记", () => {
  const chips = [
    { ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } },
    { ok: true, chipId: "ch582f-qfn28", def: { chip: { name: "CH582F", package: "QFN28" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipId: "ch582f-qfn28" }).index, 1);
  const miss = Exp.resolveProjectTarget(chips, { chipId: "nope" });
  assert.strictEqual(miss.index, null);
  assert.strictEqual(miss.miss, "chipId");
});

t("resolveProjectTarget：无 chipId 时名+封装精确命中；同名多封装仅名匹配带 note", () => {
  const chips = [
    { ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } },
    { ok: true, chipId: "ch582m-qfn32", def: { chip: { name: "CH582M", package: "QFN32" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH582M", package: "QFN32" }).index, 1);
  const byName = Exp.resolveProjectTarget(chips, { chipName: "CH582M", package: null });
  assert.strictEqual(byName.index, 0);
  assert.ok(byName.note && byName.note.includes("同名多封装"), byName.note);
});

t("resolveProjectTarget：无 chipId 无 chipName / 名字无命中 → index null", () => {
  const chips = [{ ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } }];
  assert.strictEqual(Exp.resolveProjectTarget(chips, {}).index, null);
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH999" }).index, null);
});

t("resolveProjectTarget：非 ok 芯片不参与匹配", () => {
  const chips = [
    { ok: false, chipId: "ch582m-qfn48", def: null },
    { ok: true, chipId: "ch582f-qfn28", def: { chip: { name: "CH582F", package: "QFN28" } } }
  ];
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipId: "ch582m-qfn48" }).miss, "chipId");
  assert.strictEqual(Exp.resolveProjectTarget(chips, { chipName: "CH582F" }).index, 1);
});

console.log("\n=== v1.8-2: CH583M 数据 ===");

const CHIP583 = require("../chips/wch-ch583m-qfn48.js");

t("CH583M：validateChip 通过，id/名/封装正确", () => {
  assert.strictEqual(CHIP583.schemaVersion, 2);
  assert.strictEqual(CHIP583.id, "ch583m-qfn48");
  assert.strictEqual(CHIP583.chip.name, "CH583M");
  const v = Model.validateChip(CHIP583);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("CH583M：SPI1 资源（三脚、主机模式、无重映射）", () => {
  const sp1 = Avail.findResource(CHIP583, "SPI1");
  assert.ok(sp1, "应有 SPI1");
  assert.strictEqual(sp1.groupSwitch, undefined);
  assert.strictEqual(sp1.modes, undefined);
  assert.deepStrictEqual(sp1.signals.map(s => s.name), ["SCK1", "MOSI1", "MISO1"]);
  assert.deepStrictEqual(sp1.signals[0].pins, ["PA0"]);
});

t("CH583M：SPI1 与 SPI0 可同时分配（互不冲突）", () => {
  let s = Avail.defaultState(CHIP583);
  const b0 = Avail.bestAssignment(CHIP583, s, "SPI0", "full");
  assert.strictEqual(b0.error, undefined, JSON.stringify(b0));
  s = Avail.assign(CHIP583, s, "SPI0", { group: b0.group, mode: b0.mode, pins: b0.pins }).state;
  const b1 = Avail.bestAssignment(CHIP583, s, "SPI1");
  assert.strictEqual(b1.error, undefined, JSON.stringify(b1));
  assert.deepStrictEqual(b1.pins, { SCK1: "PA0", MOSI1: "PA1", MISO1: "PA2" });
});

t("CH583M：与 CH582M 逐脚 alts 一致（除差异例外集）", () => {
  const EXC = new Set(["PA0", "PA1", "PA2"]);   // 审计确认的差异脚，若有新增在此追加
  CHIP583.pins.filter(p => p.type === "io" && !EXC.has(p.name)).forEach(p => {
    const m = CHIP.pins.find(x => x.name === p.name);
    assert.deepStrictEqual(p.alts, m.alts, p.name + " alts 应与 CH582M 相同");
  });
});

t("CH583M：差异脚 alts 明确（PA0/PA1/PA2 含 SPI1 信号，spec §6 逐一断言）", () => {
  const alts = n => CHIP583.pins.find(p => p.name === n).alts;
  assert.deepStrictEqual(alts("PA0"), ["SCK1", "AIN9"]);
  assert.deepStrictEqual(alts("PA1"), ["MOSI1", "AIN8"]);
  assert.deepStrictEqual(alts("PA2"), ["TMR3_", "MISO1", "AIN7"]);
});

console.log("\n=== v1.8-3: CH582F 数据 ===");

const CHIPF = require("../chips/wch-ch582f-qfn28.js");

t("CH582F：validateChip 通过；pins = 28 + EP；每边 7 脚", () => {
  assert.strictEqual(CHIPF.schemaVersion, 2);
  assert.strictEqual(CHIPF.package.pinsPerSide, 7);
  assert.strictEqual(CHIPF.pins.length, 29);   // 28 脚 + EP（以事实表为准）
  const v = Model.validateChip(CHIPF);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("CH582F：QFN28 未引出脚不得出现在任何资源/开关中（无死脚引用）", () => {
  const bad = ["PB0", "PB1", "PB2", "PB3", "PB5", "PB6", "PB8", "PB9",   // PB8 依 2026-10-15 审计更正补入（计划清单漏列）
               "PB16", "PB17", "PB18", "PB19", "PB20", "PB21",
               "PA0", "PA1", "PA2", "PA3", "PA6", "PA7"];
  const refs = [];
  (CHIPF.resources || []).forEach(r => {
    (r.signals || []).forEach(s => (s.pins || []).forEach(p => { if (bad.indexOf(p) >= 0) refs.push(r.id + "." + s.name + "=" + p); }));
  });
  (CHIPF.globalConfigs || []).forEach(c => (c.claims || []).forEach(p => { if (bad.indexOf(p) >= 0) refs.push(c.id + "=" + p); }));
  assert.deepStrictEqual(refs, [], "死脚引用: " + refs.join(", "));
});

t("CH582F：UART0 裁剪正确（MODEM 只剩 DTR/DSR，单脚化、无 groupKey）", () => {
  const u = Avail.findResource(CHIPF, "UART0");
  assert.deepStrictEqual(u.optional, ["DTR", "DSR"]);
  const sig = n => u.signals.find(s => s.name === n);
  assert.strictEqual(sig("RTS"), undefined);
  assert.deepStrictEqual(sig("DTR").pins, ["PB15"]);
  assert.strictEqual(sig("DTR").groupKey, undefined);
  assert.deepStrictEqual(sig("DSR").pins, ["PB14"]);
});

t("CH582F：I2C / UART3 映射组语义正确移除", () => {
  assert.strictEqual(Avail.findResource(CHIPF, "I2C").groupSwitch, undefined);
  assert.strictEqual(Avail.findResource(CHIPF, "UART3").groupSwitch, undefined);
});

console.log("\n=== v1.8-4 / M2: 芯片对账 ===");

t("清单：八颗芯片按 M→F→583M→584M→584X→584F→585M→585F 顺序全部可用、id 唯一", () => {
  const defs = [
    require("../chips/wch-ch582m-qfn48.js"),
    require("../chips/wch-ch582f-qfn28.js"),
    require("../chips/wch-ch583m-qfn48.js"),
    require("../chips/wch-ch584m-qfn48.js"),
    require("../chips/wch-ch584x-qfn48.js"),
    require("../chips/wch-ch584f-qfn32.js"),
    require("../chips/wch-ch585m-qfn48.js"),
    require("../chips/wch-ch585f-qfn32.js")
  ];
  const chips = Loader.buildChips(defs.map((d, i) => ({ file: "chips/x" + i + ".js", def: d })), Model);
  assert.deepStrictEqual(chips.map(c => c.ok), [true, true, true, true, true, true, true, true], JSON.stringify(chips.map(c => c.reason)));
  assert.deepStrictEqual(chips.map(c => c.chipId), ["ch582m-qfn48", "ch582f-qfn28", "ch583m-qfn48", "ch584m-qfn48", "ch584x-qfn48", "ch584f-qfn32", "ch585m-qfn48", "ch585f-qfn32"]);
  assert.deepStrictEqual(chips.map(c => c.def.chip.name), ["CH582M", "CH582F", "CH583M", "CH584M", "CH584X", "CH584F", "CH585M", "CH585F"]);
});

t("manifest：按 M→F→583M→584M→584X→584F→585M→585F 列出八份数据文件（顺序即下拉顺序），文件均存在", () => {
  const fs = require("fs");
  const src = fs.readFileSync(__dirname + "/../chips/manifest.js", "utf8");
  const m = src.match(/\[([^\]]*)\]/);
  assert.ok(m, "manifest 应有数组内容");
  const files = (m[1].match(/"([^"]+)"/g) || []).map(s => s.slice(1, -1));
  assert.deepStrictEqual(files, [
    "chips/wch-ch582m-qfn48.js",
    "chips/wch-ch582f-qfn28.js",
    "chips/wch-ch583m-qfn48.js",
    "chips/wch-ch584m-qfn48.js",
    "chips/wch-ch584x-qfn48.js",
    "chips/wch-ch584f-qfn32.js",
    "chips/wch-ch585m-qfn48.js",
    "chips/wch-ch585f-qfn32.js"
  ]);
  files.forEach(f => assert.ok(fs.existsSync(__dirname + "/../" + f), f + " 应存在"));
});

console.log("\n=== M2: CH585M QFN48 ===");
const CHIP585 = require("../chips/wch-ch585m-qfn48.js");

t("CH585M：validateChip 通过，id/名/封装/系列正确", () => {
  assert.strictEqual(CHIP585.schemaVersion, 2);
  assert.strictEqual(CHIP585.id, "ch585m-qfn48");
  assert.strictEqual(CHIP585.chip.name, "CH585M");
  assert.strictEqual(CHIP585.chip.series, "CH58x");
  assert.strictEqual(CHIP585.package.pinsPerSide, 12);
  const v = Model.validateChip(CHIP585);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
});

t("CH585M：49 脚（48+EP），NFC/SPI1/USB HS/LED/LCD 资源存在", () => {
  assert.strictEqual(CHIP585.pins.length, 49);
  const byName = {};
  CHIP585.pins.forEach(p => { byName[p.name] = p; });
  assert.ok(byName.PA2.alts.includes("RI"));
  assert.deepStrictEqual(byName.PB17.alts, ["NFC+"]);
  const ids = CHIP585.resources.map(r => r.id);
  ["SPI1", "USB_FS", "USB_HS", "NFC", "LED", "LCD"].forEach(id => assert.ok(ids.includes(id), id));
});

t("CH585M：NFC 可分配，默认状态无冲突", () => {
  const s = Avail.defaultState(CHIP585);
  assert.strictEqual(Avail.countIO(CHIP585, s).conflict, 0);
  const nfc = Avail.bestAssignment(CHIP585, s, "NFC");
  assert.strictEqual(nfc.error, undefined, JSON.stringify(nfc.error));
  assert.deepStrictEqual(nfc.pins, { NFCI: "PB9", NFCM: "PB8", "NFC+": "PB17", "NFC-": "PB16" });
});

t("CH585M 数据锁：QFN48 脚序与 CH582M 一致；alts 差异仅为 NFC/LED/SPI1/RI 迁移", () => {
  const EXC = {
    PA0: ["SCK1", "LED0", "AIN9"],
    PA1: ["MOSI1", "LED1", "AIN8"],
    PA2: ["MISO1", "TMR3_", "RI", "LED2", "AIN7"],
    PA3: ["LED3", "AIN6"],
    PA4: ["RXD3", "LEDC", "AIN0"],
    PA5: ["TXD3", "LED4", "AIN1"],
    PA6: ["RXD2", "PWM4_", "LED5", "AIN10"],
    PA7: ["TXD2", "PWM5_", "LED6", "AIN11"],
    PA8: ["RXD1", "LED7", "AIN12"],
    PB2: ["PWM8_"],
    PB8: ["NFCM"],
    PB9: ["NFCI"],
    PB16: ["NFC-"],
    PB17: ["NFC+"]
  };
  assert.strictEqual(CHIP585.pins.length, CHIP.pins.length);
  const byNum = {};
  CHIP.pins.forEach(p => { byNum[p.num] = p; });
  CHIP585.pins.forEach(p => {
    const base = byNum[p.num];
    assert.ok(base, "脚号 " + p.num + " 应存在于 CH582M");
    assert.strictEqual(p.name, base.name, "脚号 " + p.num);
    assert.deepStrictEqual(p.alts, EXC[p.name] || base.alts, p.name);
  });
  assert.deepStrictEqual(CHIP585.globalConfigs.map(c => c.id), ["debug", "rst", "xtal32k"]);
});

console.log("\n=== M2: CH585F QFN32 ===");
const CHIP585F = require("../chips/wch-ch585f-qfn32.js");

t("CH585F：validateChip 通过，32 脚 + EP，24 IO", () => {
  assert.strictEqual(CHIP585F.id, "ch585f-qfn32");
  assert.strictEqual(CHIP585F.chip.name, "CH585F");
  assert.strictEqual(CHIP585F.chip.series, "CH58x");
  assert.strictEqual(CHIP585F.package.pinsPerSide, 8);
  assert.strictEqual(CHIP585F.pins.length, 33);
  const v = Model.validateChip(CHIP585F);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
  const s = Avail.defaultState(CHIP585F);
  assert.strictEqual(Avail.countIO(CHIP585F, s).total, 24);
});

t("CH585F：无 SPI1/NFC/LED，保留 I2C/LCD/USB HS；7 路 ADC", () => {
  const ids = CHIP585F.resources.map(r => r.id);
  ["SPI1", "NFC", "LED"].forEach(id => assert.ok(!ids.includes(id), id));
  ["I2C", "LCD", "USB_HS"].forEach(id => assert.ok(ids.includes(id), id));
  const adc = CHIP585F.resources.filter(r => r.category === "ADC");
  assert.strictEqual(adc.length, 7);
  const pa9 = CHIP585F.pins.find(p => p.name === "PA9");
  assert.ok(/PB9/.test(pa9.note || ""), "PA9 应记录与 PB9 短接");
});

t("CH585F 数据锁：QFN32 未引出脚与 NFC/LED alts 已移除", () => {
  const names = new Set(CHIP585F.pins.map(p => p.name));
  ["PA0", "PA1", "PA2", "PA3", "PA6", "PA7", "PA8", "PB9", "PB0", "PB1", "PB2", "PB3", "PB18", "PB19", "PB20", "PB21"].forEach(n => {
    assert.ok(!names.has(n), n + " 不应在 QFN32");
  });
  const byName = {};
  CHIP585F.pins.forEach(p => { byName[p.name] = p; });
  assert.deepStrictEqual(byName.PB8.alts, []);
  assert.deepStrictEqual(byName.PB17.alts, []);
  assert.deepStrictEqual(byName.PB16.alts, []);
  assert.deepStrictEqual(byName.PA4.alts, ["RXD3", "AIN0"]);
  assert.deepStrictEqual(byName.PA5.alts, ["TXD3", "AIN1"]);
});

console.log("\n=== M2: CH584M / CH584X QFN48 ===");
const CHIP584M = require("../chips/wch-ch584m-qfn48.js");
const CHIP584X = require("../chips/wch-ch584x-qfn48.js");

t("CH584M/X：validateChip 通过，49 脚，40 IO，去 USB HS/SPI1，保留 NFC/LED/LCD", () => {
  for (const [d, name, id] of [[CHIP584M, "CH584M", "ch584m-qfn48"], [CHIP584X, "CH584X", "ch584x-qfn48"]]) {
    assert.strictEqual(d.id, id);
    assert.strictEqual(d.chip.name, name);
    assert.strictEqual(d.chip.series, "CH58x");
    assert.strictEqual(d.pins.length, 49);
    const v = Model.validateChip(d);
    assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
    const ids = d.resources.map(r => r.id);
    assert.ok(!ids.includes("SPI1"));
    assert.ok(!ids.includes("USB_HS"));
    ["NFC", "LED", "LCD", "USB_FS"].forEach(x => assert.ok(ids.includes(x), x));
    const byName = {};
    d.pins.forEach(p => { byName[p.name] = p; });
    assert.deepStrictEqual(byName.PA0.alts, ["LED0", "AIN9"]);
    assert.deepStrictEqual(byName.PB13.alts, ["SCK0_", "SCL", "TXD1_"]);
    assert.strictEqual(Avail.countIO(d, Avail.defaultState(d)).total, 40);
  }
});

console.log("\n=== M2: CH584F QFN32 ===");
const CHIP584F = require("../chips/wch-ch584f-qfn32.js");

t("CH584F：validateChip 通过，33 脚，24 IO，去 USB HS/SPI1/NFC/LED", () => {
  assert.strictEqual(CHIP584F.id, "ch584f-qfn32");
  assert.strictEqual(CHIP584F.chip.name, "CH584F");
  assert.strictEqual(CHIP584F.chip.series, "CH58x");
  assert.strictEqual(CHIP584F.package.pinsPerSide, 8);
  assert.strictEqual(CHIP584F.pins.length, 33);
  const v = Model.validateChip(CHIP584F);
  assert.strictEqual(v.ok, true, JSON.stringify(v.errors));
  const ids = CHIP584F.resources.map(r => r.id);
  ["SPI1", "USB_HS", "NFC", "LED"].forEach(x => assert.ok(!ids.includes(x), x));
  ["I2C", "LCD", "USB_FS"].forEach(x => assert.ok(ids.includes(x), x));
  assert.strictEqual(CHIP584F.resources.filter(r => r.category === "ADC").length, 7);
  assert.strictEqual(Avail.countIO(CHIP584F, Avail.defaultState(CHIP584F)).total, 24);
});

console.log("\n=== v1.8-5: 终审修复（I1/I2） ===");

t("resolveProjectTarget：package 不一致时不静默（路由带 note；终审 I1）", () => {
  const chips = [{ ok: true, chipId: "ch582m-qfn48", def: { chip: { name: "CH582M", package: "QFN48" } } }];
  const r = Exp.resolveProjectTarget(chips, { chipName: "CH582M", package: "QFN32" });
  assert.strictEqual(r.index, 0);
  assert.ok(r.note && r.note.includes("QFN32") && r.note.includes("QFN48"), "应提示封装不一致：" + r.note);
});

t("CH583M 数据锁：与 CH582M 的差异仅 {PA0/PA1/PA2 的 alts} + SPI1（终审 I2）", () => {
  const EXC = { PA0: ["SCK1", "AIN9"], PA1: ["MOSI1", "AIN8"], PA2: ["TMR3_", "MISO1", "AIN7"] };
  const expectPins = CHIP.pins.map(p => {
    if (!EXC[p.name]) return p;
    return { num: p.num, name: p.name, type: p.type, alts: EXC[p.name] };   // 39/40 的"为 CH583 专用"note 属应删
  });
  assert.deepStrictEqual(CHIP583.pins, expectPins);
  assert.deepStrictEqual(CHIP583.globalConfigs, CHIP.globalConfigs);
  assert.strictEqual(CHIP583.package.pinsPerSide, CHIP.package.pinsPerSide);
  const sp1 = CHIP583.resources.filter(r => r.id === "SPI1");
  assert.strictEqual(sp1.length, 1);
  assert.deepStrictEqual(CHIP583.resources.filter(r => r.id !== "SPI1"), CHIP.resources);
});

t("CH582F 数据锁：pins/resources/configs 由 CH582M + QFN28 事实表机械复算（终审 I2）", () => {
  const QFN28 = { PA11: 1, PA10: 2, VDCID: 3, VSW: 4, "VDD33/VIO33": 5, PA8: 6, PA9: 7, PB15: 8, PB14: 9,
                  PB13: 10, PB12: 11, PB11: 12, PB10: 13, PB7: 14, PB4: 15, PB23: 16, PB22: 17,
                  X32MO: 18, X32MI: 19, VINTA: 20, ANT: 21, VDCIA: 22, PA4: 23, PA5: 24, PA15: 25,
                  PA14: 26, PA13: 27, PA12: 28, GND: "EP" };
  const on = p => QFN28[p] !== undefined;
  const byNum = a => [...a].sort((x, y) => (x.num === "EP" ? 99 : x.num) - (y.num === "EP" ? 99 : y.num));
  // pins 复算
  const dPins = CHIP.pins.filter(p => on(p.name)).map(p => {
    const q = { num: QFN28[p.name], name: p.name, type: p.type, alts: p.alts };
    if (p.note) q.note = p.note;
    return q;
  });
  assert.deepStrictEqual(byNum(CHIPF.pins), byNum(dPins), "pins 应与事实表复算一致");
  // resources 复算（family-diff §2.3 规则；skeleton 不含 note 文本）
  function skeleton(r) {
    const q = { id: r.id, category: r.category, label: r.label, perPin: !!r.perPin,
                groupSwitch: !!r.groupSwitch, signals: (r.signals || []).map(s => {
                  const sig = { name: s.name, pins: s.pins };
                  if (s.groupKey) sig.groupKey = s.groupKey;
                  return sig;
                }) };
    if (r.optional) q.optional = r.optional;
    if (r.modes) q.modes = r.modes.map(m => {
      const mm = { id: m.id, signals: m.signals };
      if (m.optional) mm.optional = m.optional;
      return mm;
    });
    return q;
  }
  const dRes = [];
  CHIP.resources.forEach(r => {
    if (r.perPin) { dRes.push(r); return; }
    const sigs = (r.signals || []).map(s => {
      const q = { name: s.name, pins: (s.pins || []).filter(on) };
      if (s.groupKey) q.groupKey = s.groupKey;
      return q;
    }).filter(s => s.pins.length);
    if (!sigs.length) return;
    sigs.forEach(s => {
      if (!s.groupKey) return;
      const members = sigs.filter(x => x.groupKey === s.groupKey);
      if (members.some(m => m.pins.length !== 2)) delete s.groupKey;
    });
    const res = { id: r.id, category: r.category, label: r.label,
                  groupSwitch: !!r.groupSwitch, signals: sigs };
    if (res.groupSwitch) {
      const req = sigs.filter(s => ((r.optional || []).indexOf(s.name) < 0));
      if (req.some(s => s.pins.length !== 2)) res.groupSwitch = false;
    }
    if (r.optional) {
      const o = r.optional.filter(n => sigs.some(s => s.name === n));
      if (o.length) res.optional = o;
    }
    if (r.modes) res.modes = r.modes.map(m => {
      const mm = { id: m.id, signals: m.signals };
      if (m.optional) mm.optional = m.optional;
      return mm;
    });
    dRes.push(res);
  });
  assert.deepStrictEqual(CHIPF.resources.map(skeleton), dRes.map(skeleton), "resources 应与 §2.3 复算一致");
  // globalConfigs 复算
  const dCfg = CHIP.globalConfigs.map(c => ({ id: c.id, label: c.label, default: c.default,
                                              claims: c.claims.filter(on) })).filter(c => c.claims.length);
  assert.deepStrictEqual(CHIPF.globalConfigs.map(c => ({ id: c.id, label: c.label, default: c.default,
                                                         claims: c.claims })), dCfg);
  // 封装参数（审计值，含页码结论）
  assert.deepStrictEqual(CHIPF.package, { family: "quad", style: "no-lead", pinsPerSide: 7, pitch: 0.4,
                                          body: [4, 4], pin1: "topLeft", sequence: "ccw-down", thermalPad: "GND (EP)" });
});

console.log("\n" + pass + " passed, " + fail + " failed");
process.exit(fail ? 1 : 0);
