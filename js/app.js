/* 应用装配：状态、渲染、交互（零依赖） */
(function () {
  "use strict";
  var CPP = window.CPP;
  var def = null;       // 当前芯片定义（切换时重赋，闭包内函数动态读取）
  var history = null;   // 当前芯片的撤销历史（切换时重赋）
  var histories = {};   // chipId -> 该芯片的会话内状态（状态隔离：互不干扰、刷新即清）
  var chips = [];       // 加载结果 [{file, def, ok, reason, errors, chipId}]
  var activeIdx = -1;
  var svgEl = null;
  var menuEl = null;

  // ---------- 多芯片：加载结果 / 下拉选择器 / 切换 ----------
  function chipLabel(c) { return c.def.chip.name + " · " + c.def.chip.package; }
  function updateChipSelect() {
    var sel = document.getElementById("chip-select");
    if (!sel) return;
    sel.innerHTML = "";
    CPP.Loader.groupChips(chips).forEach(function (g) {
      var og = document.createElement("optgroup");
      og.label = g.label;
      g.items.forEach(function (it) {
        var c = it.chip, i = it.index;
        var opt = document.createElement("option");
        opt.value = String(i);
        if (c.ok) {
          opt.textContent = chipLabel(c);
          if (i === activeIdx) opt.selected = true;
        } else {
          opt.textContent = "⚠ " + c.file.split("/").pop() + " —— " + c.reason;
          opt.disabled = true;
        }
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });
  }
  function activateChip(idx, silent) {
    activeIdx = idx;
    def = chips[idx].def;
    if (!histories[chips[idx].chipId]) {
      histories[chips[idx].chipId] = CPP.Availability.createHistory(CPP.Availability.defaultState(def));
    }
    history = histories[chips[idx].chipId];
    svgEl = null;  // 触发封装图按新芯片重建
    closeMenu();
    updateChipSelect();
    redraw();
    if (!silent) log("已切换到 " + chipLabel(chips[idx]) + "；本会话里该芯片的配置已保留（刷新即清空）");
  }
  function boot(results) {
    chips = CPP.Loader.buildChips(results, CPP.Model);
    var bad = chips.filter(function (c) { return !c.ok; });
    bad.forEach(function (c) { console.warn("[chips] " + c.file + " 不可用：" + c.reason, c.errors); });
    chips.forEach(function (c) {
      if (c.ok && c.extra) console.warn("[chips] " + c.file + " 注册了 " + (c.extra + 1) + " 个定义，只取最后一个；请检查文件内容");
    });
    var sel = document.getElementById("chip-select");
    if (sel) sel.addEventListener("change", function () { activateChip(Number(sel.value)); });
    var firstOk = null;
    for (var i = 0; i < chips.length; i++) { if (chips[i].ok) { firstOk = i; break; } }
    if (firstOk === null) {
      document.body.innerHTML = "<pre>没有可用的芯片数据：\n" + chips.map(function (c) {
        return c.file + " — " + c.reason + (c.errors.length ? "\n  " + c.errors.join("\n  ") : "");
      }).join("\n") + "\n\n提示：请检查 chips/manifest.js 清单是否登记了数据文件、路径是否正确。</pre>";
      return;
    }
    activateChip(firstOk, true);
    var badDetail = bad.slice(0, 3).map(function (c) { return c.file.split("/").pop() + "：" + c.reason; }).join("；") +
                    (bad.length > 3 ? " 等" : "");
    log("就绪（v1.10）：可用芯片 " + (chips.length - bad.length) + " 颗" +
        (bad.length ? "，不可用 " + bad.length + " 颗（" + badDetail + "）" : "") + "。");
  }

  function state() { return history.current(); }
  function commit(s) { history.push(s); redraw(); }
  function log(msg) {
    var el = document.getElementById("log");
    if (el) el.textContent = msg;
  }
  // 启动完成前的守卫：def 未就绪时导出/导入等操作给提示而不是 TypeError
  function ready() {
    if (!def) { log("芯片数据还在加载，请稍候再试"); return false; }
    return true;
  }

  // ---------- 渲染 ----------
  function redraw() {
    renderChip();
    renderLeftPanel();
    renderRightPanel();
    renderStatusBar();
    renderConflictBanner();
  }

  function renderChip() {
    var host = document.getElementById("chip-host");
    if (!svgEl) {
      host.innerHTML = "";
      svgEl = CPP.PackageSVG.renderPackage(def);
      host.appendChild(svgEl);
      CPP.Interactions.enablePanZoom(svgEl);
      svgEl.addEventListener("click", onSvgClick);
    }
    var pins = CPP.Availability.computePins(def, state());
    svgEl.querySelectorAll("g.pin").forEach(function (g) {
      var name = g.getAttribute("data-pin");
      var e = pins.get(name);
      if (!e) return;
      g.setAttribute("data-status", e.status);
      var cat = "";
      if (e.status === "locked") cat = "系统";
      if (e.status === "assigned" || e.status === "conflict") cat = categoryOf(e.owners);
      g.setAttribute("data-cat", cat);
      var title = g.querySelector("title");
      if (title) title.textContent = tooltipText(name, e);
    });
  }

  function categoryOf(owners) {
    var o = owners.find(function (x) { return x.type !== "config"; }) || owners[0];
    if (o.type === "gpio") return "GPIO";
    if (o.type === "config") return "系统";
    var res = CPP.Availability.findResource(def, o.id);
    return res ? res.category : "";
  }
  function ownerDesc(o) {
    if (o.type === "gpio") return "GPIO" + (o.alias ? "(" + o.alias + ")" : "");
    if (o.type === "resource") return o.label + "·" + o.signal + (o.alias ? "「" + o.alias + "」" : "");
    return o.label;
  }
  function tooltipText(name, e) {
    var p = def.pins.find(function (x) { return x.name === name; });
    var lines = [p.num + ": " + p.name];
    if (p.alts && p.alts.length) lines.push("复用: " + p.alts.join(" / "));
    if (e.status === "free") lines.push("状态: 空闲");
    else if (e.status === "fixed") lines.push("状态: 电源/固定");
    else if (e.status === "locked") lines.push("状态: 被「" + e.owners[0].label + "」锁定");
    else if (e.status === "assigned") lines.push("状态: " + ownerDesc(e.owners[0]));
    else if (e.status === "conflict") lines.push("⚠️ 冲突: " + e.owners.map(ownerDesc).join(" + "));
    if (p.note) lines.push("注: " + p.note);
    return lines.join("\n");
  }

  // ---------- 通用菜单 ----------
  function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; } }
  document.addEventListener("pointerdown", function (e) {
    if (menuEl && !menuEl.contains(e.target)) closeMenu();
  }, true);

  function showMenu(items, x0, y0) {
    closeMenu();
    var div = document.createElement("div");
    div.className = "pin-menu";
    items.forEach(function (it) {
      var el = document.createElement(it.action ? "button" : "div");
      el.className = "menu-item" + (it.action ? "" : " menu-info");
      el.textContent = it.label;
      if (it.disabled) { el.classList.add("disabled"); el.disabled = true; }
      if (it.title) el.title = it.title;
      if (it.action) el.addEventListener("click", function () { closeMenu(); it.action(); });
      div.appendChild(el);
    });
    document.body.appendChild(div);
    var x = Math.min(x0, window.innerWidth - 320);
    var y = Math.min(y0, window.innerHeight - div.offsetHeight - 20);
    div.style.left = Math.max(8, x) + "px";
    div.style.top = Math.max(8, y) + "px";
    menuEl = div;
  }

  // ---------- 引脚点击 ----------
  function onSvgClick(ev) {
    if (svgEl.getAttribute("data-dragged") === "1") return;
    var g = ev.target.closest ? ev.target.closest("g.pin") : null;
    if (!g) return;
    showMenu(buildPinMenuItems(g.getAttribute("data-pin")), ev.clientX, ev.clientY);
  }

  function buildPinMenuItems(pinName) {
    var out = [];
    var e = CPP.Availability.computePins(def, state()).get(pinName);
    if (!e || e.fixed) { out.push({ label: "电源/固定引脚，不可分配" }); return out; }

    if (e.status === "conflict") {
      out.push({ label: "⚠️ 冲突: " + e.owners.map(ownerDesc).join(" + ") });
      e.owners.forEach(function (o) {
        if (o.type === "resource") out.push({ label: "解除 " + o.label, action: function () {
          commit(CPP.Availability.removeResource(state(), o.id)); log("已解除 " + o.label);
        } });
        if (o.type === "config") out.push({ label: "关闭开关「" + o.label + "」", action: function () {
          commit(CPP.Availability.setConfig(state(), o.id, false)); log("已关闭「" + o.label + "」");
        } });
      });
      return out;
    }
    if (e.status === "locked") {
      out.push({ label: "被系统占用：「" + e.owners[0].label + "」（可关闭左侧对应开关释放）" });
      // 继续往下：列出全部候选（置灰）供查看
    }
    if (e.status === "assigned") {
      var o = e.owners[0];
      out.push({ label: "当前: " + ownerDesc(o) });
      if (o.type === "resource") out.push({ label: "解除分配", action: function () {
        commit(CPP.Availability.removeResource(state(), o.id));
        log("已解除 " + o.label + "（" + ownerDesc(o) + "）");
      } });
      if (o.type === "gpio") out.push({ label: "清除 GPIO 标签", action: function () {
        commit(CPP.Availability.setGpio(state(), pinName, "")); log("已清除 " + pinName);
      } });
      return out;
    }

    // 空闲/锁定脚：列出全部潜在选项（含模式与映射组变体，不可用项置灰并注明原因）
    CPP.Availability.pinOptions(def, state(), pinName).forEach(function (o) {
      out.push({
        label: o.ok ? o.label : (o.label + "（" + o.reason + "）"),
        disabled: !o.ok,
        title: o.reason || "",
        action: o.ok ? function () {
          if (o.type === "add-signal") addOptionalSignal(o.rid, o.signal, pinName);
          else assignResourceAtPin(o.rid, o.signal, pinName, o.group, o.mode);
        } : null
      });
    });
    out.push({ label: "设为 GPIO…", action: function () {
      var alias = window.prompt("给 " + pinName + " 起个别名（如 FLASH_CS）：", "");
      if (alias === null) return;
      commit(CPP.Availability.setGpio(state(), pinName, alias || "GPIO"));
      log(pinName + " → GPIO" + (alias ? "(" + alias + ")" : ""));
    } });
    return out;
  }

  function assignResourceAtPin(rid, sigName, pinName, group, mode) {
    var res = CPP.Availability.findResource(def, rid);
    var rebuild = CPP.Availability.rebuildChoice(def, state(), rid, {
      group: group === true,
      mode: (mode === undefined) ? null : mode,
      pinOverride: (function () { var o = {}; o[sigName] = pinName; return o; })()
    });
    if (rebuild.error) { alert("无法分配 " + res.label + "：" + rebuild.error); return; }
    var prev = state().resources[rid];
    var r = CPP.Availability.assign(def, state(), rid, rebuild.choice);
    if (r.error) { alert("分配失败：" + r.error); return; }
    commit(r.state);
    log("已分配 " + res.label + " → " + Object.keys(rebuild.choice.pins).map(function (k) {
      return k + "=" + rebuild.choice.pins[k];
    }).join(", ") + (prev ? "（替换原有分配）" : ""));
  }

  function addOptionalSignal(rid, sig, pin) {
    var r = CPP.Availability.setSignal(def, state(), rid, sig, pin);
    if (r.error) { alert("添加失败：" + r.error); return; }
    commit(r.state);
    log("已添加 " + rid + " · " + sig + " → " + pin);
  }

  // ---------- 左栏 ----------
  var resFilter = "";          // 过滤框内容（跨重绘保留）
  var collapsedCats = {};      // 分类折叠状态

  function renderLeftPanel() {
    var host = document.getElementById("left-panel");
    var html = "";
    html += "<input id='res-filter' placeholder='过滤资源（如 PWM / UART）…' value='" +
            resFilter.replace(/&/g, "&amp;").replace(/'/g, "&#39;").replace(/</g, "&lt;") + "'>";
    html += "<h3>系统配置</h3>";
    (def.globalConfigs || []).forEach(function (c) {
      var on = state().configs[c.id];
      html += "<label class='cfg'><input type='checkbox' data-cfg='" + c.id + "'" + (on ? " checked" : "") + ">" +
              "<span" + (c.note ? " title='" + c.note + "'" : "") + ">" + c.label + "</span></label>";
    });
    var groups = {};
    (def.resources || []).forEach(function (r) {
      if (r.perPin) return;
      (groups[r.category] = groups[r.category] || []).push(r);
    });
    Object.keys(groups).forEach(function (cat) {
      var opened = !collapsedCats[cat];
      html += "<h3 class='cat-head' data-cat='" + cat + "'>" + (opened ? "▾" : "▸") + " " + cat +
              " <span class='cnt'>(" + groups[cat].length + ")</span></h3>";
      html += "<div class='cat-body' data-cat='" + cat + "'" + (opened ? "" : " hidden") + ">";
      groups[cat].forEach(function (r) {
        var used = !!state().resources[r.id];
        var dot = "", titleAttr = "";
        if (!used) {
          var st = CPP.Availability.resourceStatus(def, state(), r.id);
          dot = "<span class='dot " + st.level + "' aria-hidden='true'></span>";
          titleAttr = " title='" + CPP.Util.escapeHtml(st.reason) + "'";
        }
        html += "<div class='res" + (used ? " used" : "") + "' data-rid='" + r.id + "'" + titleAttr + ">" + dot + r.label + "</div>";
      });
      html += "</div>";
    });
    host.innerHTML = html;

    var fin = host.querySelector("#res-filter");
    fin.addEventListener("input", function () { resFilter = fin.value.trim(); applyResFilter(); });
    host.querySelectorAll(".cat-head").forEach(function (h) {
      h.addEventListener("click", function () {
        var c = h.getAttribute("data-cat");
        collapsedCats[c] = !collapsedCats[c];
        renderLeftPanel();
      });
    });
    host.querySelectorAll("input[data-cfg]").forEach(function (box) {
      box.addEventListener("change", function () {
        commit(CPP.Availability.setConfig(state(), box.getAttribute("data-cfg"), box.checked));
        log("「" + box.parentNode.textContent.trim() + "」已" + (box.checked ? "启用" : "关闭"));
      });
    });
    host.querySelectorAll(".res").forEach(function (el) {
      el.addEventListener("click", function (ev) { onResourceClick(el.getAttribute("data-rid"), ev); });
    });
    applyResFilter();
  }

  // 过滤：命中即临时展开；清空后恢复折叠状态
  function applyResFilter() {
    var host = document.getElementById("left-panel");
    var q = resFilter.toLowerCase();
    host.querySelectorAll(".cat-body").forEach(function (body) {
      var head = body.previousElementSibling;
      var cat = head.getAttribute("data-cat");
      if (!q) {
        head.style.display = "";
        body.hidden = !!collapsedCats[cat];
        body.querySelectorAll(".res").forEach(function (el) { el.style.display = ""; });
        return;
      }
      var any = false;
      body.querySelectorAll(".res").forEach(function (el) {
        var hit = el.textContent.toLowerCase().indexOf(q) >= 0;
        el.style.display = hit ? "" : "none";
        if (hit) any = true;
      });
      head.style.display = any ? "" : "none";
      body.hidden = !any;
    });
  }

  function onResourceClick(rid, ev) {
    var res = CPP.Availability.findResource(def, rid);
    if (state().resources[rid]) {
      commit(CPP.Availability.removeResource(state(), rid));
      log("已解除 " + res.label);
      return;
    }
    if (res.modes && res.modes.length) {
      // 有模式的资源：先选模式（每项带可用性/原因），选定后自动挑组分配
      var items = res.modes.map(function (m) {
        var best = CPP.Availability.bestAssignment(def, state(), rid, m.id);
        var ok = !best.error;
        var why = "";
        if (!ok) {
          why = best.error.group1
            ? "默认组缺 " + best.error.group0.join("/") + "；映射组缺 " + best.error.group1.join("/")
            : best.error.group0.join("/") + " 无落脚点";
        }
        return {
          label: m.label + (ok ? "" : "（" + why + "）"),
          disabled: !ok,
          title: m.note || "",
          action: ok ? function () { doBestAssign(rid, best); } : null
        };
      });
      showMenu(items, ev.clientX, ev.clientY);
      return;
    }
    var best = CPP.Availability.bestAssignment(def, state(), rid);
    if (best.error) { alertResourceFail(res, best); return; }
    doBestAssign(rid, best);
  }

  function doBestAssign(rid, best) {
    var res = CPP.Availability.findResource(def, rid);
    var prev = state().resources[rid];
    var r = CPP.Availability.assign(def, state(), rid, { group: best.group, mode: best.mode, pins: best.pins });
    if (r.error) { alert("分配失败：" + r.error); return; }
    commit(r.state);
    log("已分配 " + res.label + " → " + Object.keys(best.pins).map(function (k) { return k + "=" + best.pins[k]; }).join(", ") +
        (best.usedAlt ? (best.altReason === "peer" ? "（跟随同组已分配资源的映射位）" : "（默认组被占，已自动改用映射组）") : "") +
        (prev ? "（替换原有分配）" : ""));
  }

  function alertResourceFail(res, best) {
    var msg = res.label + " 无法分配：";
    if (best.error.group1) {
      msg += "默认组缺 " + best.error.group0.join("/") + " 的落脚点；映射组缺 " + best.error.group1.join("/") + " 的落脚点";
    } else {
      msg += best.error.group0.join("/") + " 没有可用落脚点";
    }
    alert(msg);
  }

  // ---------- 右栏 ----------
  function renderRightPanel() {
    var host = document.getElementById("right-panel");
    var html = "<h3>已分配</h3>";
    var ids = Object.keys(state().resources);
    if (!ids.length && !Object.keys(state().gpio).length) html += "<p class='hint'>（还没分配任何资源）</p>";
    ids.forEach(function (rid) {
      var res = CPP.Availability.findResource(def, rid);
      if (!res) return;
      var asg = state().resources[rid];
      var asgPins = (asg && asg.pins) || {};
      var asgLabels = (asg && asg.labels) || {};
      var pinKeys = Object.keys(asgPins);
      var optNameList = (res.modes && res.modes.length)
        ? (((res.modes.find(function (m) { return m.id === asg.mode; }) || {}).optional) || [])
        : (res.optional || []);
      var pinHtml;
      if (pinKeys.length) {
        pinHtml = pinKeys.map(function (s) {
          return "<span class='sig-name' data-name=\"" + rid + "|" + s + "\" title='点击命名/重命名'>" +
                 s + "=" + asgPins[s] + (asgLabels[s] ? "「" + CPP.Util.escapeHtml(asgLabels[s]) + "」" : "") + "</span>" +
                 (optNameList.indexOf(s) >= 0
                   ? " <button class='mini' data-delsig=\"" + rid + "|" + s + "\" title='移除该可选信号'>×</button>"
                   : "");
        }).join(", ");
      } else {
        pinHtml = "<i>（不占引脚）</i>";
      }
      html += "<div class='row'><b>" + res.label + "</b>：" + pinHtml;
      var notAdded = optNameList.filter(function (n) { return !(n in asgPins); });
      if (notAdded.length) {
        html += " <button class='mini' data-addsig='" + rid + "'>＋ 添加信号</button>";
      }
      if (res.modes && res.modes.length) {
        html += " <select class='mini' data-mode='" + rid + "'>" +
          res.modes.map(function (m) {
            return "<option value='" + m.id + "'" + (asg.mode === m.id ? " selected" : "") +
                   (m.note ? " title='" + m.note + "'" : "") + ">" + m.label + "</option>";
          }).join("") + "</select>";
      }
      if (res.groupSwitch) {
        html += " <button class='mini' data-switch='" + rid + "'>" + (asg.group ? "换回默认组" : "改用映射组") + "</button>";
      }
      html += " <button class='mini' data-remove='" + rid + "'>解除</button></div>";
    });
    Object.keys(state().gpio).forEach(function (pin) {
      html += "<div class='row'>GPIO：" + pin + " = " + CPP.Util.escapeHtml(state().gpio[pin]) +
              " <button class='mini' data-cleargpio='" + pin + "'>清除</button></div>";
    });
    host.innerHTML = html;

    host.querySelectorAll("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        var rid = b.getAttribute("data-remove");
        commit(CPP.Availability.removeResource(state(), rid));
        log("已解除 " + rid);
      });
    });
    host.querySelectorAll("[data-cleargpio]").forEach(function (b) {
      b.addEventListener("click", function () {
        commit(CPP.Availability.setGpio(state(), b.getAttribute("data-cleargpio"), ""));
      });
    });
    host.querySelectorAll(".sig-name").forEach(function (sp) {
      sp.addEventListener("click", function () {
        var parts = sp.getAttribute("data-name").split("|");
        var rid2 = parts[0], sig = parts[1];
        var cur = ((state().resources[rid2] || {}).labels || {})[sig] || "";
        var v = window.prompt("为 " + sig + " 命名（留空清除）：", cur);
        if (v === null) return;
        commit(CPP.Availability.setSignalLabel(state(), rid2, sig, v.trim()));
        log(rid2 + " " + sig + (v.trim() ? " → 「" + v.trim() + "」" : " 已清除命名"));
      });
    });
    host.querySelectorAll("[data-switch]").forEach(function (b) {
      b.addEventListener("click", function () {
        var rid = b.getAttribute("data-switch");
        var res = CPP.Availability.findResource(def, rid);
        var asg = state().resources[rid];
        var rb = CPP.Availability.rebuildChoice(def, state(), rid, { group: !asg.group });
        if (rb.error) { alert("无法切换：" + rb.error); return; }
        var r = CPP.Availability.assign(def, state(), rid, rb.choice);
        if (r.error) { alert("切换失败：" + r.error); return; }
        commit(r.state);
        log(res.label + " 已切到" + (rb.choice.group ? "映射组" : "默认组") + " → " +
            Object.keys(rb.choice.pins).map(function (k) { return k + "=" + rb.choice.pins[k]; }).join(", "));
      });
    });
    host.querySelectorAll("[data-delsig]").forEach(function (b) {
      b.addEventListener("click", function () {
        var parts = b.getAttribute("data-delsig").split("|");
        var r = CPP.Availability.setSignal(def, state(), parts[0], parts[1], null);
        if (r.error) { alert("移除失败：" + r.error); return; }
        commit(r.state);
        log("已移除 " + parts[0] + " 的 " + parts[1]);
      });
    });
    host.querySelectorAll("[data-addsig]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        var rid2 = b.getAttribute("data-addsig");
        var res2 = CPP.Availability.findResource(def, rid2);
        var asg2 = state().resources[rid2];
        var mid2 = (res2.modes && res2.modes.length) ? asg2.mode : undefined;
        var items = [];
        CPP.Availability.optionalSignals(res2, mid2).forEach(function (sg) {
          if (sg.name in (asg2.pins || {})) return;
          CPP.Availability.signalOptions(def, state(), rid2, sg.name).forEach(function (o) {
            items.push({
              label: sg.name + " → " + o.pin + (o.ok ? "" : "（" + o.reason + "）"),
              disabled: !o.ok,
              title: sg.note || "",
              action: o.ok ? function () { addOptionalSignal(rid2, sg.name, o.pin); } : null
            });
          });
        });
        if (!items.length) { log("没有可添加的信号"); return; }
        showMenu(items, ev.clientX, ev.clientY);
      });
    });
    host.querySelectorAll("[data-mode]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        var rid = sel.getAttribute("data-mode");
        var res = CPP.Availability.findResource(def, rid);
        var asg = state().resources[rid];
        var newMode = sel.value;
        var rb = CPP.Availability.rebuildChoice(def, state(), rid, { mode: newMode });
        if (rb.error) {
          alert("无法切换到该模式：" + rb.error);
          redraw();
          return;
        }
        var r = CPP.Availability.assign(def, state(), rid, rb.choice);
        if (r.error) { alert("切换失败：" + r.error); redraw(); return; }
        commit(r.state);
        var label = (res.modes.find(function (m) { return m.id === newMode; }) || {}).label || newMode;
        log(res.label + " 已切换为「" + label + "」 → " +
            Object.keys(rb.choice.pins).map(function (k) { return k + "=" + rb.choice.pins[k]; }).join(", "));
      });
    });
  }

  function renderConflictBanner() {
    var c = CPP.Availability.countIO(def, state());
    var el = document.getElementById("conflict-banner");
    if (c.conflict > 0) {
      el.hidden = false;
      el.textContent = "⚠️ " + c.conflict + " 处冲突：点红色引脚处理（解除占用或关闭相关开关）";
    } else {
      el.hidden = true;
    }
  }
  function renderStatusBar() {
    var c = CPP.Availability.countIO(def, state());
    document.getElementById("statusbar").textContent =
      "芯片: " + def.chip.name + " (" + def.chip.package + ")　已用 " + c.used + "　锁定 " + c.locked +
      "　冲突 " + c.conflict + "　剩余 " + c.free + " / 共 " + c.total + " IO";
  }

  // ---------- 撤销 ----------
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      if (history.canUndo()) { history.undo(); redraw(); log("已撤销"); }
    }
  });

  // ---------- 导出 / 导入 ----------
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function baseName() {
    return def.chip.name + "-" + def.chip.package;
  }
  document.getElementById("btn-export-csv").addEventListener("click", function () {
    if (!ready()) return;
    download(baseName() + "-引脚清单.csv", "﻿" + CPP.Exporters.toCSV(def, state()), "text/csv;charset=utf-8");
    log("已导出 CSV 引脚清单");
  });
  document.getElementById("btn-export-md").addEventListener("click", function () {
    if (!ready()) return;
    download(baseName() + "-引脚清单.md", CPP.Exporters.toMarkdown(def, state()));
    log("已导出 Markdown 引脚清单");
  });
  document.getElementById("btn-export-proj").addEventListener("click", function () {
    if (!ready()) return;
    download(baseName() + "-工程.json", CPP.Exporters.toProjectJSON(def, state()), "application/json");
    log("已保存工程");
  });
  document.getElementById("btn-export-svg").addEventListener("click", function () {
    if (!ready() || !svgEl) return;
    var clone = svgEl.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    // file:// 下 document.styleSheets 的 cssRules 会因跨源被拒（SecurityError），
    // 样式必须取同文档 <style id="svg-style"> 的 textContent，导出文件才带样式。
    var svgStyleEl = document.getElementById("svg-style");
    if (svgStyleEl) {
      style.textContent = svgStyleEl.textContent;
    } else {
      style.textContent = Array.prototype.map.call(document.styleSheets, function (ss) {
        try { return Array.prototype.map.call(ss.cssRules, function (r) { return r.cssText; }).join("\n"); }
        catch (e) { return ""; }
      }).join("\n");
    }
    clone.insertBefore(style, clone.firstChild);
    download(baseName() + "-封装图.svg", new XMLSerializer().serializeToString(clone), "image/svg+xml");
    log("已导出封装图 SVG（另存为或直接拖进浏览器/文档）");
  });
  document.getElementById("file-import").addEventListener("change", function (ev) {
    var f = ev.target.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () {
      if (!ready()) return;
      var text = String(reader.result);
      var meta = CPP.Exporters.readProjectChipId(text);
      if (meta.error) { log("载入失败：" + meta.error); alert("载入失败：" + meta.error); return; }
      // 目标芯片解析：chipId 精确路由；无 chipId 时按 chip 名+封装（次选仅名）路由（v1.8）
      var route = CPP.Exporters.resolveProjectTarget(chips, meta);
      if (route.miss === "chipId") {
        var msg = "缺少芯片数据：" + (meta.chipName || "") + "（" + meta.chipId + "）——需要在 chips/ 里补上这颗芯片";
        log("载入失败：" + msg); alert("载入失败：" + msg);
        return;
      }
      var targetIdx = (route.index !== null) ? route.index : activeIdx;
      var autoSwitched = targetIdx !== activeIdx;   // 须在 activateChip 之前捕获
      var r = CPP.Exporters.fromProjectJSON(chips[targetIdx].def, text);
      if (r.error) { log("载入失败：" + r.error); alert("载入失败：" + r.error); return; }
      if (targetIdx !== activeIdx) activateChip(targetIdx, true);
      commit(r.state);
      log("已载入工程：" + f.name + "（" + chipLabel(chips[activeIdx]) + "）" +
          (route.note ? "。" + route.note : "") +
          (autoSwitched ? "（已按工程信息自动切换芯片）" : ""));
    };
    reader.readAsText(f);
    ev.target.value = "";
  });

  // ---------- 启动：等芯片清单全部加载完成（js/loader.js 产出 CHIP_LOAD_PROMISE） ----------
  if (window.CHIP_LOAD_PROMISE) {
    window.CHIP_LOAD_PROMISE.then(boot);
  } else {
    // 兜底：无清单时按注册表顺序直接启动（兼容旧单芯片路径）
    boot((window.CHIP_REGISTRY || []).map(function (d, i) {
      return { file: "registry[" + i + "]", def: d };
    }));
  }
})();
