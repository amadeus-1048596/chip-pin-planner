/* 导出器：CSV / Markdown / 工程 JSON（纯函数，依赖 availability.js） */
(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory(require("./availability.js"), require("./model.js"));
  } else {
    root.CPP = root.CPP || {};
    root.CPP.Exporters = factory(root.CPP.Availability, root.CPP.Model);
  }
})(typeof self !== "undefined" ? self : this, function (Avail, Model) {
  "use strict";

  function ownerShort(o) {
    if (o.type === "gpio") return "GPIO";
    if (o.type === "resource") return o.label;
    return o.label;
  }
  function ownerSignal(o) {
    if (o.type === "resource") return o.signal || "";
    if (o.type === "gpio") return o.alias || "";
    return "系统";
  }
  function categoryOf(def, o) {
    if (o.type === "config") return "系统";
    if (o.type === "gpio") return "GPIO";
    var res = Avail.findResource(def, o.id);
    return res ? res.category : "";
  }
  function csvEscape(v) {
    v = String(v == null ? "" : v);
    return /[",\n]/.test(v) ? "\"" + v.replace(/"/g, "\"\"") + "\"" : v;
  }

  // 生成行数据（CSV 与 Markdown 共用）
  function buildRows(def, state) {
    var rows = [];
    var pins = Avail.computePins(def, state);
    (def.pins || []).forEach(function (p) {
      var e = pins.get(p.name);
      if (!e || e.fixed) return;
      var fn = "", sig = "", cat = "", notes = [];
      if (e.status === "assigned") {
        fn = ownerShort(e.owners[0]);
        sig = ownerSignal(e.owners[0]);
        cat = categoryOf(def, e.owners[0]);
        if (e.owners[0].type === "gpio" && e.owners[0].alias) {
          sig = e.owners[0].alias;
        } else if (e.owners[0].alias) {
          notes.push("别名: " + e.owners[0].alias);
        }
      } else if (e.status === "locked") {
        fn = "系统占用"; sig = e.owners[0].label; cat = "系统";
      } else if (e.status === "conflict") {
        fn = "⚠️冲突"; sig = e.owners.map(function (o) { return ownerShort(o) + "·" + ownerSignal(o); }).join(" + ");
        notes.push("存在资源冲突，需处理");
      } else {
        fn = "空闲";
      }
      if (p.note) notes.push(p.note);
      rows.push([p.num, p.name, fn, sig, notes.join("；"), cat]);
    });
    return rows;
  }

  function toCSV(def, state) {
    var out = [["脚号", "引脚", "分配功能", "信号", "别名/备注", "类别"].join(",")];
    buildRows(def, state).forEach(function (r) {
      out.push(r.map(csvEscape).join(","));
    });
    return out.join("\n");
  }

  function toMarkdown(def, state) {
    var out = ["| 脚号 | 引脚 | 分配功能 | 信号 | 别名/备注 | 类别 |", "| --- | --- | --- | --- | --- | --- |"];
    buildRows(def, state).forEach(function (r) {
      out.push("| " + r.map(function (v) { return String(v == null ? "" : v).replace(/\|/g, "\\|"); }).join(" | ") + " |");
    });
    return out.join("\n");
  }

  function toProjectJSON(def, state) {
    return JSON.stringify({
      app: "chip-pin-planner", schemaVersion: 2,
      chipId: Model.chipId(def),
      chip: def.chip.name, vendor: def.chip.vendor, package: def.chip.package,
      configs: state.configs, resources: state.resources, gpio: state.gpio
    }, null, 2);
  }

  // 解析工程文件外壳（JSON + 应用标识）；schemaVersion 检查留给 fromProjectJSON（读 chipId 不要求版本）
  function parseProject(text) {
    var obj;
    try { obj = JSON.parse(text); }
    catch (e) { return { error: "工程文件不是有效 JSON" }; }
    if (!obj || obj.app !== "chip-pin-planner") return { error: "不是本工具的工程文件" };
    return { obj: obj };
  }

  function fromProjectJSON(def, text) {
    var p = parseProject(text);
    if (p.error) return p;
    var obj = p.obj;
    if (obj.schemaVersion !== 1 && obj.schemaVersion !== 2) {
      return { error: "工程文件版本不兼容（本工具支持 1、2）" };
    }
    if (obj.chip !== def.chip.name) return { error: "工程属于 " + obj.chip + "，与当前芯片 " + def.chip.name + " 不匹配" };
    var badCfg = Object.keys(obj.configs || {}).filter(function (k) {
      return !(def.globalConfigs || []).some(function (c) { return c.id === k; });
    });
    if (badCfg.length) return { error: "工程包含未知配置项: " + badCfg.join(", ") };
    var badBool = Object.keys(obj.configs || {}).filter(function (k) {
      return typeof obj.configs[k] !== "boolean";
    });
    if (badBool.length) return { error: "工程配置项取值无效: " + badBool.join(", ") };
    var pinNames = {};
    (def.pins || []).forEach(function (p) { pinNames[p.name] = true; });
    var badPin = null;
    Object.keys(obj.resources || {}).forEach(function (rid) {
      var res = Avail.findResource(def, rid);
      if (!res) { badPin = "未知资源 " + rid; return; }
      var entry = obj.resources[rid];
      if (!entry || typeof entry !== "object" || !entry.pins || typeof entry.pins !== "object") {
        badPin = rid + " 结构无效（缺少 pins）";
        return;
      }
      var modeDef = null;
      if (entry.mode == null && res.modes && res.modes.length) {
        entry.mode = res.modes[0].id;   // 归一化：与引擎 resolveModeId(null) 一致（终审 Minor#6）
      }
      if (entry.mode != null) {
        var modesDef = res.modes || null;
        modeDef = modesDef ? modesDef.find(function (m) { return m.id === entry.mode; }) : null;
        if (!modeDef) {
          badPin = rid + " 的模式无效: " + entry.mode;
          return;
        }
      }
      Object.keys(entry.pins).forEach(function (sig) {
        var sigDef = (res.signals || []).find(function (s) { return s.name === sig; });
        if (!sigDef) { badPin = rid + " 未知信号 " + sig; return; }
        if (modeDef && modeDef.signals.indexOf(sig) < 0) {
          badPin = rid + "." + sig + " 不属于模式 " + entry.mode;
          return;
        }
        var v = entry.pins[sig];
        if (typeof v !== "string" || sigDef.pins.indexOf(v) < 0) {
          badPin = rid + "." + sig + " 落脚点无效: " + v;
        }
      });
      var reqNames = Avail.requiredSignals(res, entry.mode == null ? undefined : entry.mode)
        .map(function (s) { return s.name; });
      reqNames.forEach(function (sn) {
        if (!(sn in entry.pins)) badPin = rid + " 缺少必选信号 " + sn;
      });
      // 资源内部一致性（终审 Important#2）：同 groupKey 同侧；主组信号侧与 group 字段一致
      var keySides = {};
      (res.signals || []).forEach(function (s) {
        if (!(s.name in entry.pins)) return;
        var idx = s.pins.indexOf(entry.pins[s.name]);
        var side = idx === 1 ? 1 : 0;
        if (s.groupKey) {
          if (keySides[s.groupKey] !== undefined && keySides[s.groupKey] !== side) {
            badPin = rid + " 的 " + s.name + " 与共享映射位信号必须同侧（当前 " + entry.pins[s.name] + "）";
          }
          keySides[s.groupKey] = side;
        } else if (res.groupSwitch && s.pins.length === 2 && side !== (entry.group === true ? 1 : 0)) {
          badPin = rid + "." + s.name + " 落脚点侧与 group 字段不一致: " + entry.pins[s.name];
        }
      });
      if (entry.labels != null) {
        if (typeof entry.labels !== "object") { badPin = rid + " 的 labels 必须是对象"; return; }
        Object.keys(entry.labels).forEach(function (sn) {
          if (!(res.signals || []).some(function (s) { return s.name === sn; })) {
            badPin = rid + " labels 引用未知信号 " + sn;
          } else if (typeof entry.labels[sn] !== "string") {
            badPin = rid + " labels 别名必须是字符串 " + sn;
          }
        });
      }
    });
    Object.keys(obj.gpio || {}).forEach(function (pin) {
      if (!pinNames[pin]) badPin = "GPIO 引用未知引脚 " + pin;
      else if (typeof obj.gpio[pin] !== "string") badPin = "GPIO 别名无效 " + pin;
    });
    if (badPin) return { error: "工程数据无效：" + badPin };
    var state = {
      chip: def.chip.name,
      configs: Object.assign(Avail.defaultState(def).configs, obj.configs || {}),
      resources: obj.resources || {}, gpio: obj.gpio || {}
    };
    return { state: state };
  }

  // 读取工程文件的芯片标识（导入路由用；v1 老文件没有 chipId 返回 null）
  function readProjectChipId(text) {
    var p = parseProject(text);
    if (p.error) return p;
    var obj = p.obj;
    if (obj.chipId != null && (typeof obj.chipId !== "string" || !obj.chipId)) {
      return { error: "工程文件 chipId 无效" };
    }
    return { chipId: obj.chipId || null, chipName: obj.chip || null,
             package: (typeof obj.package === "string" && obj.package) ? obj.package : null };
  }

  // 载入工程时的目标芯片解析：chipId 精确匹配；无 chipId 时按 chip 名+封装（次选仅名）路由
  // 返回 { index } 命中（同名多候选仅名匹配时带 note）；{ index:null, miss:"chipId" } 有 chipId 但缺数据；
  // { index:null } 无从路由（调用方维持现状：对当前芯片校验并报错）
  function resolveProjectTarget(chips, meta) {
    function okAt(i) { return chips[i] && chips[i].ok && chips[i].def; }
    if (meta.chipId) {
      for (var i = 0; i < chips.length; i++) {
        if (okAt(i) && chips[i].chipId === meta.chipId) return { index: i };
      }
      return { index: null, miss: "chipId" };
    }
    if (!meta.chipName) return { index: null };
    var byName = [];
    for (var j = 0; j < chips.length; j++) {
      if (okAt(j) && chips[j].def.chip.name === meta.chipName) byName.push(j);
    }
    if (!byName.length) return { index: null };
    if (meta.package) {
      for (var k = 0; k < byName.length; k++) {
        if (chips[byName[k]].def.chip.package === meta.package) return { index: byName[k] };
      }
    }
    if (byName.length > 1) {
      return { index: byName[0],
               note: "存在同名多封装，已按首个匹配（" + chips[byName[0]].def.chip.package + "）" };
    }
    if (meta.package && chips[byName[0]].def.chip.package !== meta.package) {
      return { index: byName[0],
               note: "工程封装 " + meta.package + " 与 " + chips[byName[0]].def.chip.package + " 不一致，已按芯片名路由" };
    }
    return { index: byName[0] };
  }

  return { toCSV: toCSV, toMarkdown: toMarkdown, toProjectJSON: toProjectJSON,
           fromProjectJSON: fromProjectJSON, readProjectChipId: readProjectChipId,
           resolveProjectTarget: resolveProjectTarget };
});
