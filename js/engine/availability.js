/* 可用性引擎：claim 收集 / 引脚状态 / 可勾选性（纯函数，零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Availability = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function findResource(def, rid) {
    return (def.resources || []).find(function (r) { return r.id === rid; }) || null;
  }

  // ---- 模式层：带 modes 的资源，同一时刻只启用其中一个模式的信号子集 ----
  function modeListOf(res) {
    return (res && res.modes && res.modes.length) ? res.modes : null;
  }
  function resolveModeId(res, modeId) {
    var modes = modeListOf(res);
    if (!modes) return null;
    if (modeId && modes.some(function (m) { return m.id === modeId; })) return modeId;
    return modes[0].id;
  }
  function activeSignals(res, modeId) {
    var modes = modeListOf(res);
    if (!modes) return res.signals || [];
    var mode = modes.find(function (m) { return m.id === resolveModeId(res, modeId); });
    return (res.signals || []).filter(function (s) {
      return mode.signals.indexOf(s.name) >= 0;
    });
  }
  // 可选信号：放在 signals 清单的同级（无模式资源→资源级；有模式资源→模式级）
  function optionalNamesOf(res, modeId) {
    var modes = modeListOf(res);
    if (!modes) return res.optional || [];
    var mode = modes.find(function (m) { return m.id === resolveModeId(res, modeId); });
    return (mode && mode.optional) || [];
  }
  function requiredSignals(res, modeId) {
    var opt = optionalNamesOf(res, modeId);
    return activeSignals(res, modeId).filter(function (s) { return opt.indexOf(s.name) < 0; });
  }
  function optionalSignals(res, modeId) {
    var opt = optionalNamesOf(res, modeId);
    return activeSignals(res, modeId).filter(function (s) { return opt.indexOf(s.name) >= 0; });
  }
  // 某信号在当前组下的合法落脚点：自有映射位(groupKey)/单脚信号不随主组，只有 groupSwitch 主信号随组
  function allowedPinsFor(res, sigDef, group) {
    if (sigDef.groupKey) return sigDef.pins.slice();
    if (res.groupSwitch && sigDef.pins.length === 2) return [sigDef.pins[group ? 1 : 0]];
    return sigDef.pins.slice();
  }
  function pinLabel(res, modeId, sigName, group) {
    var parts = [];
    var modes = modeListOf(res);
    if (modes) {
      var mode = modes.find(function (m) { return m.id === resolveModeId(res, modeId); });
      if (mode) parts.push(mode.label);
    }
    if (group) parts.push("映射组");
    return res.label + " · " + sigName + (parts.length ? "（" + parts.join("，") + "）" : "");
  }

  // ---- 共享映射位（如 RB_PIN_PWMX 一位切 PWM4/5/7/8/9）：同 groupKey 的资源必须同侧 ----
  function groupKeyPeer(def, state, rid) {
    var res = findResource(def, rid);
    if (!res || !res.groupKey) return null;
    var found = null;
    Object.keys(state.resources || {}).forEach(function (other) {
      if (found || other === rid) return;
      var ores = findResource(def, other);
      if (ores && ores.groupKey === res.groupKey) found = other;
    });
    return found;   // 返回同组已分配资源的 rid
  }
  function sideOfPins(res, mode, pinsObj) {
    var sigs = activeSignals(res, mode);
    for (var i = 0; i < sigs.length; i++) {
      var pin = (pinsObj || {})[sigs[i].name];
      var idx = sigs[i].pins.indexOf(pin);
      if (idx >= 0) return idx === 1 ? 1 : 0;
    }
    return 0;
  }
  function assignedSide(def, state, rid) {
    var res = findResource(def, rid);
    var asg = state.resources[rid];
    if (!res || !asg) return null;
    if (res.groupSwitch) return asg.group === true ? 1 : 0;
    return sideOfPins(res, asg.mode, asg.pins);
  }
  function choiceSide(res, choice) {
    if (res.groupSwitch) return choice.group === true ? 1 : 0;
    return sideOfPins(res, choice.mode, choice.pins);
  }

  function defaultState(def) {
    var configs = {};
    (def.globalConfigs || []).forEach(function (c) { configs[c.id] = !!c.default; });
    return { chip: def.chip.name, configs: configs, resources: {}, gpio: {} };
  }

  function collectClaims(def, state) {
    var claims = [];
    (def.globalConfigs || []).forEach(function (c) {
      if (state.configs[c.id]) {
        (c.claims || []).forEach(function (pin) {
          claims.push({ pin: pin, owner: { type: "config", id: c.id, label: c.label } });
        });
      }
    });
    Object.keys(state.resources || {}).forEach(function (rid) {
      var res = findResource(def, rid);
      var asg = state.resources[rid];
      if (!res || !asg) return;
      Object.keys(asg.pins || {}).forEach(function (sig) {
        if (asg.pins[sig]) {
          claims.push({ pin: asg.pins[sig], owner: { type: "resource", id: rid, label: res.label, signal: sig,
                                                     alias: (asg.labels || {})[sig] } });
        }
      });
    });
    Object.keys(state.gpio || {}).forEach(function (pin) {
      claims.push({ pin: pin, owner: { type: "gpio", id: "GPIO", label: "GPIO", alias: state.gpio[pin] } });
    });
    return claims;
  }

  function computePins(def, state) {
    var map = new Map();
    (def.pins || []).forEach(function (p) {
      var fixed = p.type !== "io";
      map.set(p.name, { name: p.name, num: p.num, type: p.type, fixed: fixed,
                        owners: [], status: fixed ? "fixed" : "free" });
    });
    collectClaims(def, state).forEach(function (cl) {
      var entry = map.get(cl.pin);
      if (entry) entry.owners.push(cl.owner);
    });
    map.forEach(function (e) {
      if (e.fixed) return;
      if (e.owners.length === 0) e.status = "free";
      else if (e.owners.length === 1) e.status = (e.owners[0].type === "config") ? "locked" : "assigned";
      else e.status = "conflict";
    });
    return map;
  }

  function countIO(def, state) {
    var r = { total: 0, used: 0, locked: 0, conflict: 0, free: 0 };
    computePins(def, state).forEach(function (e) {
      if (e.fixed) return;
      r.total++;
      if (e.status === "assigned") r.used++;
      else if (e.status === "locked") r.locked++;
      else if (e.status === "conflict") r.conflict++;
      else r.free++;
    });
    return r;
  }

  // 资源各信号当前可用落脚点；groupOverride 预览另一组；modeOverride 预览另一模式
  function candidatePins(def, state, rid, groupOverride, modeOverride) {
    var res = findResource(def, rid);
    if (!res) return null;
    var existing = state.resources[rid] || null;
    var group = (groupOverride !== undefined) ? !!groupOverride : (existing ? existing.group === true : false);
    var modeIn = (modeOverride !== undefined) ? modeOverride : (existing ? existing.mode : undefined);
    var mode = resolveModeId(res, modeIn);
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      var selfClaim = existing && cl.owner.type === "resource" && cl.owner.id === rid;
      if (!selfClaim) busy[cl.pin] = true;
    });
    var out = { group: group, mode: mode, signals: {} };
    activeSignals(res, mode).forEach(function (s) {
      out.signals[s.name] = allowedPinsFor(res, s, group).filter(function (pin) { return !busy[pin]; });
    });
    return out;
  }

  function canAssign(def, state, rid, choice) {
    var res = findResource(def, rid);
    if (!res) return { ok: false, reason: "未找到资源 " + rid };
    var modes = modeListOf(res);
    if (modes && choice.mode && !modes.some(function (m) { return m.id === choice.mode; })) {
      return { ok: false, reason: "未知模式 " + choice.mode };
    }
    var group = choice.group === true;
    var peer = groupKeyPeer(def, state, rid);
    if (peer && assignedSide(def, state, peer) !== choiceSide(res, choice)) {
      var peerRes = findResource(def, peer);
      return { ok: false, reason: res.label + " 与 " + (peerRes ? peerRes.label : peer) +
               " 共享同一个映射位，必须同组（都默认组或都映射组）；可先解除 " +
               (peerRes ? peerRes.label : peer) + " 再切换" };
    }
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      var selfClaim = cl.owner.type === "resource" && cl.owner.id === rid;
      if (!selfClaim) busy[cl.pin] = true;
    });
    var sigs = activeSignals(res, choice.mode);
    var reqNames = requiredSignals(res, choice.mode).map(function (s) { return s.name; });
    var extra = Object.keys(choice.pins || {}).filter(function (k) {
      return !sigs.some(function (s) { return s.name === k; });
    });
    if (extra.length) return { ok: false, reason: "choice 含不属于该模式的信号: " + extra.join(",") };
    var seen = {};
    for (var i = 0; i < sigs.length; i++) {
      var s = sigs[i];
      var pin = choice.pins ? choice.pins[s.name] : undefined;
      if (!pin) {
        if (reqNames.indexOf(s.name) >= 0) return { ok: false, reason: s.name + " 未选择落脚点" };
        continue;   // 可选信号允许不配
      }
      var allowed = allowedPinsFor(res, s, group);
      if (allowed.indexOf(pin) < 0) return { ok: false, reason: s.name + " 不能落到 " + pin + "（该组不可用）" };
      if (busy[pin]) return { ok: false, reason: pin + " 已被占用" };
      if (seen[pin]) return { ok: false, reason: "资源内部信号重复占用 " + pin };
      seen[pin] = true;
    }
    // 信号级共享映射位（如 UART0 DSR/DTR 共用 RB_PIN_MODEM）：已配的必须同侧
    // 冲突原因优先锚定"未变动的已配信号"——提示指向用户没改的那个信号的现位置
    var byKey = {};
    var prevPins = (state.resources[rid] || {}).pins || {};
    for (var j0 = 0; j0 < sigs.length; j0++) {
      var s0 = sigs[j0];
      if (!s0.groupKey || !choice.pins || !(s0.name in choice.pins)) continue;
      if (choice.pins[s0.name] === prevPins[s0.name]) {
        byKey[s0.groupKey] = { side: s0.pins.indexOf(choice.pins[s0.name]) === 1 ? 1 : 0,
                               name: s0.name, pin: choice.pins[s0.name] };
      }
    }
    for (var j = 0; j < sigs.length; j++) {
      var s2 = sigs[j];
      if (!s2.groupKey || !choice.pins || !(s2.name in choice.pins)) continue;
      var side2 = s2.pins.indexOf(choice.pins[s2.name]) === 1 ? 1 : 0;
      if (byKey[s2.groupKey] && byKey[s2.groupKey].name === s2.name) continue;
      if (byKey[s2.groupKey] && byKey[s2.groupKey].side !== side2) {
        return { ok: false, reason: s2.name + " 与 " + byKey[s2.groupKey].name +
                 " 共享同一映射位，必须同侧（" + byKey[s2.groupKey].name +
                 " 当前在 " + byKey[s2.groupKey].pin + "）" };
      }
      byKey[s2.groupKey] = { side: side2, name: s2.name, pin: choice.pins[s2.name] };
    }
    return { ok: true };
  }

  function assign(def, state, rid, choice) {
    var chk = canAssign(def, state, rid, choice);
    if (!chk.ok) return { state: state, error: chk.reason };
    var res = findResource(def, rid);
    var modes = modeListOf(res);
    var prev = state.resources[rid] || null;
    var nextResources = Object.assign({}, state.resources);
    var rec = {
      group: !!choice.group,
      mode: modes ? resolveModeId(res, choice.mode) : null,
      pins: Object.assign({}, choice.pins)
    };
    if (prev && prev.labels) {
      // 保留仍存在信号的别名（终审 Important#1：重分配不得静默丢名字）
      var kept = {};
      Object.keys(prev.labels).forEach(function (sn) {
        if (Object.prototype.hasOwnProperty.call(choice.pins, sn)) kept[sn] = prev.labels[sn];
      });
      if (Object.keys(kept).length) rec.labels = kept;
    }
    nextResources[rid] = rec;
    return { state: Object.assign({}, state, { resources: nextResources }) };
  }

  // 单信号增/删（pin 传 null = 移除）；构造"现有分配 ± 该信号"的完整 choice，走 assign 同一套校验
  function mergedChoice(asg, sigName, pin) {
    var pins = Object.assign({}, asg.pins);
    if (pin === null) delete pins[sigName]; else pins[sigName] = pin;
    return { group: asg.group, mode: asg.mode, pins: pins };
  }
  function setSignal(def, state, rid, sigName, pin) {
    var asg = state.resources[rid];
    if (!asg) return { state: state, error: "资源未分配：" + rid };
    return assign(def, state, rid, mergedChoice(asg, sigName, pin));
  }
  // 某可选信号各落脚点的可用性 + 原因（供"＋ 添加信号"菜单）
  function signalOptions(def, state, rid, sigName) {
    var res = findResource(def, rid);
    var asg = state.resources[rid];
    if (!res || !asg) return [];
    var sig = (res.signals || []).find(function (s) { return s.name === sigName; });
    if (!sig) return [];
    var isActive = activeSignals(res, asg.mode).some(function (s) { return s.name === sigName; });
    if (!isActive) return [];
    return sig.pins.map(function (pin) {
      var chk = canAssign(def, state, rid, mergedChoice(asg, sigName, pin));
      return { pin: pin, ok: chk.ok, reason: chk.reason || "" };
    });
  }

  function removeResource(state, rid) {
    var nextResources = Object.assign({}, state.resources);
    delete nextResources[rid];
    return Object.assign({}, state, { resources: nextResources });
  }

  function setConfig(state, id, value) {
    var nextConfigs = Object.assign({}, state.configs);
    nextConfigs[id] = !!value;
    return Object.assign({}, state, { configs: nextConfigs });
  }

  function setGpio(state, pin, alias) {
    var nextGpio = Object.assign({}, state.gpio);
    if (alias) nextGpio[pin] = alias; else delete nextGpio[pin];
    return Object.assign({}, state, { gpio: nextGpio });
  }

  // 给已分配资源的某个信号设置自定义名（如 PWM11 → motor_pwm11），供清单/图注区分用途
  function setSignalLabel(state, rid, signal, label) {
    var asg = state.resources[rid];
    if (!asg) return state;
    var nextLabels = Object.assign({}, asg.labels || {});
    if (label) nextLabels[signal] = label; else delete nextLabels[signal];
    var nextResources = Object.assign({}, state.resources);
    nextResources[rid] = Object.assign({}, asg, { labels: nextLabels });
    return Object.assign({}, state, { resources: nextResources });
  }

  function createHistory(initial) {
    var stack = [initial];
    return {
      current: function () { return stack[stack.length - 1]; },
      push: function (s) { stack.push(s); },
      undo: function () { if (stack.length > 1) stack.pop(); return stack[stack.length - 1]; },
      canUndo: function () { return stack.length > 1; }
    };
  }

  // 枚举某引脚上的全部可分配选项（含模式与映射组变体），并给每项可用性与原因
  function pinOptions(def, state, pinName) {
    var out = [];
    var entry = computePins(def, state).get(pinName);
    if (!entry) return out;
    var lockedBy = (entry.status === "locked") ? entry.owners[0] : null;
    (def.resources || []).forEach(function (res) {
      if (res.perPin) return;
      var resAsg = state.resources[res.id] || null;
      var modes = modeListOf(res) || [null];
      modes.forEach(function (mode) {
        var mid = mode ? mode.id : null;
        var sigs = activeSignals(res, mid);
        var reqNames = requiredSignals(res, mid).map(function (s) { return s.name; });
        sigs.forEach(function (s) {
          s.pins.forEach(function (pin, idx) {
            if (pin !== pinName) return;
            var group = idx === 1;   // 映射侧标记（groupSwitch 资源即“映射组”；双落点单信号资源同理）
            // 可选信号：未分配→提示先分配；已分配→以 setSignal 预演给可用性
            if (reqNames.indexOf(s.name) < 0) {
              if (entry.fixed || lockedBy) {
                out.push({ type: "add-signal", rid: res.id, signal: s.name, group: group, mode: mid,
                           ok: false,
                           reason: entry.fixed ? ("固定脚（" + entry.type + "）不可分配")
                                               : ("被「" + lockedBy.label + "」锁定（可在左侧关闭该开关）"),
                           label: pinLabel(res, mid, s.name, group) + "（可选信号）" });
                return;
              }
              if (!resAsg) {
                out.push({ type: "add-signal", rid: res.id, signal: s.name, group: group, mode: mid,
                           ok: false, reason: "可选信号：需先分配 " + res.label + " 再添加",
                           label: pinLabel(res, mid, s.name, group) + "（可选信号）" });
                return;
              }
              var chk = canAssign(def, state, res.id, mergedChoice(resAsg, s.name, pin));
              out.push({ type: "add-signal", rid: res.id, signal: s.name, group: group, mode: mid,
                         ok: chk.ok, reason: chk.reason || "",
                         label: pinLabel(res, mid, s.name, group) + "（可选信号）" });
              return;
            }
            // 必选信号：沿用原逻辑，但"其它信号无落脚点"只统计必选
            var ok = true, reason = "";
            if (entry.fixed) {
              ok = false;
              reason = "固定脚（" + entry.type + "）不可分配";
            } else if (lockedBy) {
              ok = false;
              reason = "被「" + lockedBy.label + "」锁定（可在左侧关闭该开关）";
            } else {
              var cand = candidatePins(def, state, res.id, res.groupSwitch ? group : undefined,
                                       mid === null ? undefined : mid);
              for (var i = 0; i < reqNames.length; i++) {
                var list = cand ? (cand.signals[reqNames[i]] || []) : [];
                if (list.length === 0) {
                  ok = false;
                  reason = (res.groupSwitch ? "映射组其它脚被占：" : "同资源其它信号无落脚点：") + reqNames[i];
                  break;
                }
              }
              if (ok) {
                var selfList = cand.signals[s.name] || [];
                if (selfList.indexOf(pinName) < 0) { ok = false; reason = pinName + " 当前不可用"; }
              }
              if (ok) {
                var peerRid = groupKeyPeer(def, state, res.id);
                if (peerRid && assignedSide(def, state, peerRid) !== (group ? 1 : 0)) {
                  ok = false;
                  var pr = findResource(def, peerRid);
                  reason = "共享映射位与已分配的 " + (pr ? pr.label : peerRid) + " 不一致（须同组；可先解除它再切换）";
                }
              }
            }
            out.push({
              type: "assign", rid: res.id, signal: s.name, group: group, mode: mid,
              ok: ok, reason: reason,
              label: pinLabel(res, mid, s.name, group)
            });
          });
        });
      });
    });
    return out;
  }

  // 一键分配：优先默认侧，被占时自动尝试映射侧；有共享映射位的资源跟随同组已分配者
  function bestAssignment(def, state, rid, modeId) {
    var res = findResource(def, rid);
    if (!res) return { error: { group0: ["未知资源 " + rid] } };
    var modes = modeListOf(res);
    if (modes && modeId && !modes.some(function (m) { return m.id === modeId; })) {
      return { error: { group0: ["未知模式 " + modeId] } };
    }
    var mid = modes ? resolveModeId(res, modeId) : null;
    function trySide(side) {
      var cand = candidatePins(def, state, rid, res.groupSwitch ? (side === 1) : undefined,
                               mid === null ? undefined : mid);
      var missing = [], pins = {};
      requiredSignals(res, mid === null ? undefined : mid).forEach(function (sigDef) {
        var sname = sigDef.name;
        var opts = (cand && cand.signals[sname]) || [];
        if (opts.length === 0) { missing.push(sname); return; }
        if (sigDef.groupKey || (!res.groupSwitch && sigDef.pins.length > 1)) {
          var want = sigDef.pins[side === 1 ? 1 : 0];
          if (opts.indexOf(want) < 0) { missing.push(sname); return; }
          pins[sname] = want;
        } else {
          pins[sname] = opts[0];
        }
      });
      return { missing: missing, pins: pins };
    }
    var peer = groupKeyPeer(def, state, rid);
    if (peer) {
      var ps = assignedSide(def, state, peer);
      var gp = trySide(ps);
      if (gp.missing.length === 0) {
        return { group: res.groupSwitch ? ps === 1 : false, pins: gp.pins, usedAlt: ps === 1, altReason: "peer", mode: mid };
      }
      return { error: { group0: gp.missing } };
    }
    var g0 = trySide(0);
    if (g0.missing.length === 0) return { group: false, pins: g0.pins, usedAlt: false, mode: mid };
    if (res.groupSwitch) {
      var g1 = trySide(1);
      if (g1.missing.length === 0) return { group: true, pins: g1.pins, usedAlt: true, altReason: "blocked",
                                            defaultMissing: g0.missing, mode: mid };
      return { error: { group0: g0.missing, group1: g1.missing } };
    }
    var g1b = trySide(1);
    var hasAlt = (res.signals || []).some(function (s) { return s.pins.length > 1; });
    if (hasAlt && g1b.missing.length === 0) {
      return { group: false, pins: g1b.pins, usedAlt: true, altReason: "blocked",
               defaultMissing: g0.missing, mode: mid };
    }
    return { error: { group0: g0.missing } };
  }

  // 重构分配（切组/换模/引脚改配）：必选按新侧放置；已配信号（含可选）尽量原位保留；
  // 自有映射位(groupKey)与单脚信号不随主组；任一信号放不下 → 整体报错（调用方不得提交半套）
  function rebuildChoice(def, state, rid, opts) {
    var res = findResource(def, rid);
    if (!res) return { error: "未知资源 " + rid };
    opts = opts || {};
    var asg = state.resources[rid] || null;
    var groupIn = (opts.group !== undefined) ? !!opts.group : (asg ? asg.group === true : false);
    var modeIn = (opts.mode !== undefined) ? opts.mode : (asg ? asg.mode : null);
    var modes = modeListOf(res);
    var mid = modes ? resolveModeId(res, modeIn) : null;
    var choice = { group: res.groupSwitch ? groupIn : false, mode: mid, pins: {} };
    var busy = {};
    collectClaims(def, state).forEach(function (cl) {
      if (asg && cl.owner.type === "resource" && cl.owner.id === rid) return;
      busy[cl.pin] = true;
    });
    var over = opts.pinOverride || {};
    var reqNames = requiredSignals(res, mid === null ? undefined : mid).map(function (s) { return s.name; });
    var keySide = {};   // signal.groupKey -> 已放置的侧
    var problem = null;
    activeSignals(res, mid).forEach(function (s) {
      var isReq = reqNames.indexOf(s.name) >= 0;
      var wasAssigned = !!(asg && asg.pins && (s.name in asg.pins));
      // 可选信号只在"已加过"或"被 override 指定"时参与重构；新鲜分配只配必选
      if (!isReq && !wasAssigned && over[s.name] === undefined) return;
      var followsMain = res.groupSwitch && !s.groupKey && s.pins.length === 2;
      var allowed = allowedPinsFor(res, s, choice.group);
      var pref;
      if (over[s.name] !== undefined) {
        pref = [over[s.name]];
      } else if (!followsMain && asg && asg.pins && s.pins.indexOf(asg.pins[s.name]) >= 0) {
        pref = [asg.pins[s.name]];                                    // 原位保留
      } else if (s.groupKey && keySide[s.groupKey] !== undefined) {
        pref = [s.pins[keySide[s.groupKey]]];                         // 跟随同 key 已放侧
      } else if (s.pins.length === 2) {
        pref = followsMain ? [s.pins[choice.group ? 1 : 0]] : [s.pins[0], s.pins[1]];
      } else {
        pref = [s.pins[0]];
      }
      var placed = null;
      for (var i = 0; i < pref.length; i++) {
        var pin = pref[i];
        if (allowed.indexOf(pin) >= 0 && !busy[pin]) { placed = pin; break; }
      }
      if (!placed) { if (!problem) problem = s.name; return; }
      choice.pins[s.name] = placed;
      busy[placed] = true;
      if (s.groupKey) keySide[s.groupKey] = s.pins.indexOf(placed) === 1 ? 1 : 0;
    });
    if (problem) return { error: problem + " 没有可用落脚点（可先处理占用或移除该信号）" };
    return { choice: choice };
  }

  // 左栏可用性色块：汇总资源当前可分配性
  // 占脚口径——只统计占引脚的模式（不占脚模式如内部定时不判色）；
  // 跟随同 groupKey 已分配资源属于正常协调，算 ok 不算告警。
  function resourceStatus(def, state, rid) {
    var res = findResource(def, rid);
    if (!res) return { level: "blocked", reason: "未知资源 " + rid };
    if (state.resources[rid]) return { level: "used", reason: "已分配（点击解除）" };
    var modes = modeListOf(res) || [null];
    var entries = modes.map(function (mode) {
      var mid = mode ? mode.id : null;
      var label = mode ? mode.label : "";
      var prefix = label ? label + "：" : "";
      if (activeSignals(res, mid).length === 0) {
        return { label: label, level: "nopin", reason: prefix + "不占引脚" };
      }
      var b = bestAssignment(def, state, rid, mid === null ? undefined : mid);
      if (!b.error) {
        var pins = Object.keys(b.pins).map(function (k) { return b.pins[k]; }).join("/");
        if (b.usedAlt && b.altReason === "blocked") {
          return { label: label, level: "warn",
            reason: prefix + "默认组被占（缺 " + (b.defaultMissing || []).join("/") + "）；将自动改用映射组：" + pins };
        }
        if (b.usedAlt && b.altReason === "peer") {
          return { label: label, level: "ok", reason: prefix + "跟随同组已分配资源：" + pins };
        }
        return { label: label, level: "ok", reason: prefix + "可分配：" + pins };
      }
      var e = b.error;
      return { label: label, level: "blocked",
        reason: prefix + (e.group1
          ? "默认组缺 " + e.group0.join("/") + "；映射组缺 " + e.group1.join("/")
          : "缺 " + e.group0.join("/")) };
    });
    var pinEntries = entries.filter(function (en) { return en.level !== "nopin"; });
    if (pinEntries.length === 0) return { level: "ok", reason: "不占引脚" };
    var sum = "ok";
    if (pinEntries.every(function (en) { return en.level === "blocked"; })) sum = "blocked";
    else if (!pinEntries.some(function (en) { return en.level === "ok"; })) sum = "warn";
    var base = pinEntries.find(function (en) { return en.level === sum; });
    var reason = base.reason;
    pinEntries.forEach(function (en) {
      if (en !== base && en.level !== "ok") reason += "\n· " + en.reason;
    });
    if (sum === "blocked") {
      var nopins = entries.filter(function (en) { return en.level === "nopin"; });
      if (nopins.length) {
        reason += "\n（仍可选用：" + nopins.map(function (en) { return en.label; }).join("/") + "，不占引脚）";
      }
    }
    return { level: sum, reason: reason };
  }

  return { defaultState: defaultState, collectClaims: collectClaims, computePins: computePins,
           countIO: countIO, findResource: findResource, candidatePins: candidatePins,
           canAssign: canAssign, assign: assign, removeResource: removeResource,
           setConfig: setConfig, setGpio: setGpio, createHistory: createHistory,
           setSignalLabel: setSignalLabel,
           pinOptions: pinOptions, bestAssignment: bestAssignment, resourceStatus: resourceStatus,
           requiredSignals: requiredSignals, optionalSignals: optionalSignals,
           setSignal: setSignal, signalOptions: signalOptions,
           rebuildChoice: rebuildChoice,
           activeSignals: activeSignals, modeListOf: modeListOf, pinLabel: pinLabel,
           assignedSide: assignedSide };
});
