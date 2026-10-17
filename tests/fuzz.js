/* 引擎模糊测试：随机操作序列 + 不变量断言（一次性工具，不入库） */
"use strict";
const R = __dirname + "/../";
const Avail = require(R + "js/engine/availability.js");
const Exp = require(R + "js/engine/exporters.js");
const def = require(R + "chips/wch-ch582m-qfn48.js");

let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }

const rids = def.resources.filter(r => !r.perPin).map(r => r.id);
// 含可选信号的资源（fuzz op7 定向取样用，避免 1/8000 的覆盖虚设——终审 Important#4）
const optRids = rids.filter(r => {
  const rr = Avail.findResource(def, r);
  return (rr.optional && rr.optional.length) ||
         (rr.modes || []).some(m => m.optional && m.optional.length);
});
const ioPins = def.pins.filter(p => p.type === "io").map(p => p.name);
const cfgIds = def.globalConfigs.map(c => c.id);

let state = Avail.defaultState(def);

function invariants(tag) {
  // a) 结构性：分配的信号/引脚必须在数据里合法
  Object.keys(state.resources).forEach(rid => {
    const res = Avail.findResource(def, rid);
    if (!res) throw new Error(tag + " 未知资源 " + rid);
    const asg = state.resources[rid];
    Object.keys(asg.pins || {}).forEach(sig => {
      const sd = (res.signals || []).find(s => s.name === sig);
      if (!sd) throw new Error(tag + " 非法信号 " + rid + "." + sig);
      if (sd.pins.indexOf(asg.pins[sig]) < 0) throw new Error(tag + " 非法落脚点 " + rid + "." + sig + "=" + asg.pins[sig]);
    });
  });
  // b) countIO 守恒
  const c = Avail.countIO(def, state);
  if (c.used + c.locked + c.conflict + c.free !== c.total) throw new Error(tag + " countIO 不守恒");
  if (c.total !== 40) throw new Error(tag + " IO 总数异常 " + c.total);
  // c) claims 引脚都存在
  Avail.collectClaims(def, state).forEach(cl => {
    if (!def.pins.some(p => p.name === cl.pin)) throw new Error(tag + " claim 引用了未知引脚 " + cl.pin);
  });
  // d) groupKey 同键资源必须同侧
  const byKey = {};
  Object.keys(state.resources).forEach(rid => {
    const r = Avail.findResource(def, rid);
    if (r && r.groupKey) (byKey[r.groupKey] = byKey[r.groupKey] || []).push(rid);
  });
  Object.keys(byKey).forEach(k => {
    const sides = new Set(byKey[k].map(rid => Avail.assignedSide(def, state, rid)));
    if (sides.size > 1) throw new Error(tag + " groupKey " + k + " 侧不一致: " + JSON.stringify(byKey[k]));
  });
  // e) 同引脚不得被两个资源同时占用（除非形成 conflict，conflict 必须恰好是 owner>=2）
  const ownerCnt = {};
  Avail.collectClaims(def, state).forEach(cl => { ownerCnt[cl.pin] = (ownerCnt[cl.pin] || 0) + 1; });
  const pins = Avail.computePins(def, state);
  Object.keys(ownerCnt).forEach(pin => {
    const st = pins.get(pin);
    if (!st) throw new Error(tag + " 缺失引脚 " + pin);
    if (ownerCnt[pin] > 1 && st.status !== "conflict") throw new Error(tag + " 双占未标冲突 " + pin);
    if (ownerCnt[pin] === 1 && st.status === "conflict") throw new Error(tag + " 误报冲突 " + pin);
  });
  // f) 导出/往返不抛错且一致
  Exp.toCSV(def, state); Exp.toMarkdown(def, state);
  const rt = Exp.fromProjectJSON(def, Exp.toProjectJSON(def, state));
  if (rt.error) throw new Error(tag + " 导出往返失败: " + rt.error);
  if (JSON.stringify(rt.state) !== JSON.stringify(state)) throw new Error(tag + " 导出往返不一致");
  // h) 可选信号子集合法：必选恒齐、已配 ⊆ 活跃信号、同 groupKey 同侧
  Object.keys(state.resources).forEach(rid => {
    const res = Avail.findResource(def, rid);
    const asg = state.resources[rid];
    const midArg = asg.mode == null ? undefined : asg.mode;
    Avail.requiredSignals(res, midArg).forEach(s => {
      if (!(s.name in (asg.pins || {}))) throw new Error(tag + " 必选信号缺失 " + rid + "." + s.name);
    });
    const act = Avail.activeSignals(res, midArg).map(s => s.name);
    Object.keys(asg.pins || {}).forEach(sn => {
      if (act.indexOf(sn) < 0) throw new Error(tag + " 非活跃信号 " + rid + "." + sn);
    });
    const sides = {};
    (res.signals || []).forEach(s => {
      if (!s.groupKey || !(s.name in (asg.pins || {}))) return;
      const side = s.pins.indexOf(asg.pins[s.name]) === 1 ? 1 : 0;
      if (sides[s.groupKey] !== undefined && sides[s.groupKey] !== side) {
        throw new Error(tag + " 信号映射位不同侧 " + rid + "." + s.name);
      }
      sides[s.groupKey] = side;
    });
  });
}

// g) 色块一致性：level 必须兑现——红 ⇒ 所有占脚模式真无解；绿/黄 ⇒ 真有一条可落路径
function statusOne(rid) {
  const st = Avail.resourceStatus(def, state, rid);
  if (["ok", "warn", "blocked", "used"].indexOf(st.level) < 0) throw new Error("色块 level 非法: " + st.level);
  if (state.resources[rid]) {
    if (st.level !== "used") throw new Error("已分配资源色块不是 used: " + rid);
    return;
  }
  const res = Avail.findResource(def, rid);
  const modes = (res.modes && res.modes.length) ? res.modes.map(m => m.id) : [null];
  const pinModes = modes.filter(m => Avail.activeSignals(res, m).length > 0);
  if (pinModes.length === 0) return;
  const results = pinModes.map(m => Avail.bestAssignment(def, state, rid, m === null ? undefined : m));
  const anyOk = results.some(b => !b.error);
  if (st.level === "blocked" && anyOk) throw new Error("色块误标红 " + rid + "：" + st.reason);
  if ((st.level === "ok" || st.level === "warn") && !anyOk) throw new Error("色块误标可用 " + rid + "：" + st.reason);
}

const N = 8000;
let assigned = 0, removed = 0, cng = 0, gpio = 0, rejected = 0, modeSwitch = 0, osig = 0, osigRej = 0;
for (let i = 0; i < N; i++) {
  const op = Math.floor(rnd() * 8);
  if (op <= 1) { // bestAssignment 分配
    const rid = pick(rids);
    const res = Avail.findResource(def, rid);
    const modes = (res.modes && res.modes.length) ? res.modes.map(m => m.id) : [undefined];
    const best = Avail.bestAssignment(def, state, rid, pick(modes));
    if (!best.error) {
      const r = Avail.assign(def, state, rid, { group: best.group, mode: best.mode, pins: best.pins });
      if (r.error) throw new Error("op" + i + " 自身 best 被拒: " + r.error);
      state = r.state; assigned++;
    } else rejected++;
  } else if (op === 2) {
    state = Avail.removeResource(state, pick(rids)); removed++;
  } else if (op === 3) {
    state = Avail.setConfig(state, pick(cfgIds), rnd() < 0.5); cng++;
  } else if (op === 4) {
    state = Avail.setGpio(state, pick(ioPins), rnd() < 0.5 ? "NET" + Math.floor(rnd() * 99) : ""); gpio++;
  } else if (op === 5) { // 随机（常非法）分配尝试
    const rid = pick(rids); const res = Avail.findResource(def, rid);
    const modes = (res.modes && res.modes.length) ? res.modes.map(m => m.id) : [null];
    const mode = pick(modes); const group = rnd() < 0.5;
    const cand = Avail.candidatePins(def, state, rid, res.groupSwitch ? group : undefined, mode === null ? undefined : mode);
    if (!cand) continue;
    const pins = {}; let okTry = true;
    Object.keys(cand.signals).forEach(s => {
      const opts = cand.signals[s];
      if (opts.length === 0) { okTry = false; return; }
      pins[s] = pick(opts);
    });
    if (okTry) {
      const r = Avail.assign(def, state, rid, { group: group, mode: mode, pins: pins });
      if (!r.error) state = r.state;
    }
  } else if (op === 6) { // 模式切换（模拟右栏下拉）
    const rid = pick(rids); const res = Avail.findResource(def, rid); const asg = state.resources[rid];
    if (res && asg && res.modes && res.modes.length) {
      const newMode = pick(res.modes.map(m => m.id));
      const cand = Avail.candidatePins(def, state, rid, res.groupSwitch ? (asg.group === true) : undefined, newMode);
      let ok = true; const pins = {};
      Object.keys(cand.signals).forEach(s => {
        if (cand.signals[s].length === 0) ok = false;
        else pins[s] = cand.signals[s][0];
      });
      if (ok) {
        const r = Avail.assign(def, state, rid, { group: asg.group === true, mode: newMode, pins: pins });
        if (!r.error) { state = r.state; modeSwitch++; }
      }
    }
  } else { // setSignal：随机加/移可选信号（定向取样；目标未分配则先分配以保证覆盖——终审 Important#4）
    const rid = (optRids.length && rnd() < 0.7) ? pick(optRids) : pick(rids);
    const res = Avail.findResource(def, rid);
    const isHolder = res && ((res.optional && res.optional.length) ||
      (res.modes || []).some(m => m.optional && m.optional.length));
    if (isHolder && !state.resources[rid]) {
      const b = Avail.bestAssignment(def, state, rid);
      if (!b.error) { state = Avail.assign(def, state, rid, { group: b.group, mode: b.mode, pins: b.pins }).state; assigned++; }
    }
    const asg = state.resources[rid];
    if (res && asg) {
      const optSigs = Avail.optionalSignals(res, asg.mode == null ? undefined : asg.mode);
      if (optSigs.length) {
        const sg = pick(optSigs);
        const already = Object.prototype.hasOwnProperty.call(asg.pins || {}, sg.name);
        if (already || rnd() < 0.5) {
          const r = Avail.setSignal(def, state, rid, sg.name, null);
          // 冲突态下整资源重验证被拒属既有严格语义（先解冲突），计数容忍；添加路径的拒绝才是矛盾
          if (r.error) { osigRej++; }
          else { state = r.state; osig++; }
        } else {
          const opts = Avail.signalOptions(def, state, rid, sg.name).filter(o => o.ok);
          if (opts.length) {
            const r = Avail.setSignal(def, state, rid, sg.name, pick(opts).pin);
            if (r.error) throw new Error("op" + i + " 添加可选信号被拒: " + r.error);
            state = r.state; osig++;
          }
        }
      }
    }
  }
  invariants("op" + i);
  statusOne(pick(rids));
  statusOne(pick(rids));
  if (i % 100 === 99) rids.forEach(statusOne);
}
if (osig < 20) throw new Error("fuzz setSignal 覆盖不足：" + osig + "（应 ≥20，见终审 Important#4）");
rids.forEach(statusOne);
console.log("随机操作 " + N + " 次全部通过不变量 ✅  (分配" + assigned + " 移除" + removed + " 开关" + cng +
            " GPIO" + gpio + " 模式切换" + modeSwitch + " 拒绝" + rejected + " 信号增删" + osig + "（冲突拒绝" + osigRej + "）) + 色块一致性 ✅");

// 撤销往返：50 次操作全撤回应回到初始
let h = Avail.createHistory(Avail.defaultState(def));
let cur = h.current();
for (let i = 0; i < 50; i++) {
  const rid = pick(rids);
  const best = Avail.bestAssignment(def, cur, rid);
  if (!best.error) { cur = Avail.assign(def, cur, rid, { group: best.group, mode: best.mode, pins: best.pins }).state; }
  else { cur = Avail.setConfig(cur, pick(cfgIds), rnd() < 0.5); }
  h.push(cur);
}
for (let i = 0; i < 50; i++) h.undo();
if (JSON.stringify(h.current()) !== JSON.stringify(Avail.defaultState(def))) throw new Error("撤销未回到初始");
console.log("撤销 50 连击回初始 ✅");

// 深拷贝隔离：任何变更函数不得污染原 state
let s0 = Avail.defaultState(def);
const s0copy = JSON.stringify(s0);
Avail.assign(def, s0, "SPI0", { group: true, mode: "half", pins: { SCK: "PB13", MISO: "PB15" } });
Avail.setConfig(s0, "debug", false);
Avail.setGpio(s0, "PA0", "X");
Avail.setSignalLabel(s0, "SPI0", "SCK", "A");
if (JSON.stringify(s0) !== s0copy) throw new Error("状态变更污染了原对象！");
console.log("不可变性 ✅");
