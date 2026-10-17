/* 芯片数据模型加载与校验（零依赖；浏览器挂 window.CPP.Model，Node 可直接 require） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Model = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var ENGINE_SCHEMA_MAX = 2;   // v2：optional 信号 / 信号级 groupKey（v1.7）；更高版本的数据需要更新版本的工具

  function validateChip(def) {
    var errors = [];
    if (!def || typeof def !== "object") return { ok: false, errors: ["芯片定义不是对象"] };
    if (typeof def.schemaVersion !== "number" || def.schemaVersion < 1 || def.schemaVersion > ENGINE_SCHEMA_MAX) {
      errors.push("schemaVersion " + def.schemaVersion + " 不被支持（引擎支持上限 " + ENGINE_SCHEMA_MAX +
                  "；更高版本的数据需要更新版本的工具）");
    }
    if (def.id !== undefined && (typeof def.id !== "string" || !def.id)) {
      errors.push("id 若提供必须是非空字符串");
    }
    if (!def.chip || !def.chip.name) errors.push("缺少 chip.name");
    if (def.chip && def.chip.series !== undefined &&
        (typeof def.chip.series !== "string" || !def.chip.series.trim())) {
      errors.push("chip.series 若提供必须是非空字符串");
    }
    if (!def.package || !def.package.family) errors.push("缺少 package.family");
    if (!Array.isArray(def.pins) || def.pins.length === 0) errors.push("缺少 pins");

    var names = {};
    (def.pins || []).forEach(function (p) {
      if (!p.name) errors.push("存在没有 name 的引脚");
      else if (names[p.name]) errors.push("重复引脚: " + p.name);
      else names[p.name] = true;
    });

    (def.globalConfigs || []).forEach(function (c) {
      if (!c.id) errors.push("globalConfigs 缺 id");
      (c.claims || []).forEach(function (pin) {
        if (!names[pin]) errors.push("globalConfigs[" + c.id + "] 引用了不存在的引脚 " + pin);
      });
    });

    (def.resources || []).forEach(function (r) {
      if (!r.id) errors.push("resource 缺少 id");
      (r.signals || []).forEach(function (s) {
        if (!Array.isArray(s.pins) || s.pins.length === 0) {
          errors.push(r.id + "." + s.name + " 缺少落脚点");
          return;
        }
        var isOptSig = (r.optional || []).indexOf(s.name) >= 0 ||
          (r.modes || []).some(function (m) { return (m.optional || []).indexOf(s.name) >= 0; });
        if (r.groupSwitch && isOptSig && Array.isArray(s.pins) && s.pins.length > 2) {
          errors.push(r.id + "." + s.name + "：groupSwitch 的可选信号只支持 1 或 2 个落脚点");
        }
        if (r.groupSwitch && !isOptSig && s.pins.length !== 2) {
          errors.push(r.id + "." + s.name + "：groupSwitch 资源的必选信号必须恰好 2 个落脚点（可选信号可 1 个）");
        }
        s.pins.forEach(function (pin) {
          if (!names[pin]) errors.push(r.id + "." + s.name + " 引用了不存在的引脚 " + pin);
        });
        if (s.groupKey !== undefined) {
          if (typeof s.groupKey !== "string" || !s.groupKey) {
            errors.push(r.id + "." + s.name + " 的 groupKey 必须是非空字符串");
          } else if (!Array.isArray(s.pins) || s.pins.length !== 2) {
            errors.push(r.id + "." + s.name + "：共享映射位(groupKey)的信号必须恰好 2 个落脚点（默认/映射）");
          }
        }
      });
    });

    // 重复 resource id / 资源内重复信号名
    var resIds = {};
    (def.resources || []).forEach(function (r) {
      if (!r || !r.id) return;
      if (resIds[r.id]) errors.push("重复资源 id: " + r.id);
      resIds[r.id] = true;
      var sigNames = {};
      (r.signals || []).forEach(function (s) {
        if (!s || !s.name) return;
        if (sigNames[s.name]) errors.push(r.id + " 重复信号: " + s.name);
        sigNames[s.name] = true;
      });
    });
    // 重复 globalConfig id
    var cfgIds = {};
    (def.globalConfigs || []).forEach(function (c) {
      if (!c || !c.id) return;
      if (cfgIds[c.id]) errors.push("重复配置 id: " + c.id);
      cfgIds[c.id] = true;
    });
    // 引脚号：唯一 + 数字号完整覆盖 1..N（防止静默错位）
    var nums = {};
    (def.pins || []).forEach(function (p) {
      if (p.num === undefined || p.num === null) {
        errors.push("引脚 " + p.name + " 缺少 num");
        return;
      }
      if (nums[p.num]) errors.push("重复引脚号: " + p.num);
      nums[p.num] = true;
    });
    var pkg = def.package || {};
    var FAMILIES = ["quad", "dual", "dual-split", "quad-split"];
    if (FAMILIES.indexOf(pkg.family) < 0) errors.push("package.family 非法: " + pkg.family);
    if (typeof pkg.pitch !== "number" || !(pkg.pitch > 0)) errors.push("package.pitch 必须是正数");
    if (!Array.isArray(pkg.body) || pkg.body.length !== 2 ||
        !pkg.body.every(function (v) { return typeof v === "number" && v > 0; })) {
      errors.push("package.body 必须是两个正数");
    }
    var expectedPins = 0;
    if (pkg.family === "quad" && typeof pkg.pinsPerSide === "number") expectedPins = 4 * pkg.pinsPerSide;
    else if (pkg.family === "dual" && typeof pkg.pinsPerSide === "number") expectedPins = 2 * pkg.pinsPerSide;
    else if (pkg.family === "dual-split" && Array.isArray(pkg.counts)) expectedPins = pkg.counts[0] + pkg.counts[1];
    else if (pkg.family === "quad-split" && Array.isArray(pkg.counts)) {
      expectedPins = pkg.counts.reduce(function (s, v) { return s + v; }, 0);
    }
    if (pkg.family === "quad-split" &&
        (!Array.isArray(pkg.counts) || pkg.counts.length !== 4 ||
         !pkg.counts.every(function (v) { return Number.isInteger(v) && v > 0; }))) {
      errors.push("package.counts 必须是 4 个正整数（左/下/右/上）");
    }
    if (pkg.pin1 !== undefined && ["topLeft", "bottomLeft"].indexOf(pkg.pin1) < 0) {
      errors.push("package.pin1 仅支持 topLeft / bottomLeft");
    }
    if (pkg.sequence !== undefined && ["ccw-down", "ccw-up"].indexOf(pkg.sequence) < 0) {
      errors.push("package.sequence 仅支持 ccw-down / ccw-up");
    }
    if (expectedPins > 0) {
      var missingNums = [];
      for (var n = 1; n <= expectedPins; n++) { if (!nums[n]) missingNums.push(n); }
      if (missingNums.length) {
        errors.push("数字引脚号未完整覆盖 1.." + expectedPins + "，缺: " + missingNums.join(","));
      }
    }

    // 引脚 type 白名单（缺 type 会被 availability 静默判成 fixed）
    var PIN_TYPES = ["io", "power", "osc", "rf"];
    var typeByName = {};
    (def.pins || []).forEach(function (p) {
      if (PIN_TYPES.indexOf(p.type) < 0) errors.push("引脚 " + p.name + " 的 type 非法或缺失: " + p.type);
      if (p.name) typeByName[p.name] = p.type;
    });
    // 信号落脚点 / 开关 claims 只能指向 io 脚；同资源内信号不得共享落脚点
    function checkIoPins(pinsArr, where) {
      (pinsArr || []).forEach(function (pin) {
        if (typeByName[pin] !== undefined && typeByName[pin] !== "io") {
          errors.push(where + " 落在固定脚（" + typeByName[pin] + "）: " + pin);
        }
      });
    }
    (def.globalConfigs || []).forEach(function (c) {
      checkIoPins(c.claims, "globalConfigs[" + c.id + "]");
    });
    (def.resources || []).forEach(function (r) {
      if (!r.label) errors.push("资源 " + (r.id || "?") + " 缺少 label");
      function checkOptionalNames(list, where, sigPool) {
        if (list === undefined) return;
        if (!Array.isArray(list)) { errors.push(where + " optional 必须是数组"); return; }
        list.forEach(function (sn) {
          if (typeof sn !== "string" || sigPool.indexOf(sn) < 0) {
            errors.push(where + " optional 引用未知信号: " + sn);
          }
        });
      }
      checkOptionalNames(r.optional, r.id, (r.signals || []).map(function (s) { return s.name; }));
      if (r.optional !== undefined && r.modes && r.modes.length) {
        errors.push(r.id + " 有 modes，optional 必须写在模式级（资源级会被忽略）");
      }
      (r.signals || []).forEach(function (s) {
        checkIoPins(s.pins, r.id + "." + s.name);
      });
      // 共享落脚点检查：无 modes 时全信号互斥；有 modes 时逐模式检查（跨模式可共享，如 PWM/CAP 同一根脚）
      if (r.modes && r.modes.length) {
        r.modes.forEach(function (m) {
          if (!Array.isArray(m.signals)) return;
          var usedInMode = {};
          m.signals.forEach(function (sn) {
            var sigDef = (r.signals || []).find(function (s) { return s.name === sn; });
            if (!sigDef) return;
            (sigDef.pins || []).forEach(function (pin) {
              if (usedInMode[pin]) errors.push(r.id + " 的模式 " + (m.id || "?") + " 内信号共享落脚点: " + pin);
              usedInMode[pin] = true;
            });
          });
        });
      } else {
        var usedPins = {};
        (r.signals || []).forEach(function (s) {
          (s.pins || []).forEach(function (pin) {
            if (usedPins[pin]) errors.push(r.id + " 内信号共享落脚点: " + pin);
            usedPins[pin] = true;
          });
        });
      }
      if (r.groupKey !== undefined && typeof r.groupKey !== "string") {
        errors.push(r.id + " 的 groupKey 必须是字符串");
      }
      if (r.groupKey) {
        (r.signals || []).forEach(function (s) {
          if (!Array.isArray(s.pins) || s.pins.length !== 2) {
            errors.push(r.id + " 共享映射位(groupKey)的资源每个信号必须有 2 个落脚点（默认/映射）");
          }
        });
      }
      if (r.modes) {
        if (!Array.isArray(r.modes) || r.modes.length === 0) {
          errors.push(r.id + " 的 modes 必须是非空数组");
        } else {
          var mIds = {};
          r.modes.forEach(function (m) {
            if (!m.id) errors.push(r.id + " 的 modes 项缺 id");
            else if (mIds[m.id]) errors.push(r.id + " 重复模式 id: " + m.id);
            else mIds[m.id] = true;
            if (!m.label) errors.push(r.id + " 的模式 " + (m.id || "?") + " 缺 label");
            if (!Array.isArray(m.signals)) {
              errors.push(r.id + " 的模式 " + (m.id || "?") + " signals 必须是数组（空数组=该模式不占引脚）");
            } else {
              m.signals.forEach(function (sn) {
                if (!(r.signals || []).some(function (s) { return s.name === sn; })) {
                  errors.push(r.id + " 的模式 " + (m.id || "?") + " 引用未知信号: " + sn);
                }
              });
              checkOptionalNames(m.optional, r.id + " 的模式 " + (m.id || "?"), m.signals);
            }
          });
        }
      }
    });

    return { ok: errors.length === 0, errors: errors };
  }

  // 芯片唯一标识：显式 id 优先；缺省回落 name+package 的 slug（兼容未升级的老数据文件）
  function chipId(def) {
    if (def && typeof def.id === "string" && def.id) return def.id;
    var name = (def && def.chip && def.chip.name) || "";
    var pkg = (def && def.chip && def.chip.package) || "";
    var slug = (name + "-" + pkg).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || "chip";
  }
  // 返回"后出现的重复 id"列表（[] = 无冲突）；供加载端把冲突者置灰
  function duplicateIdIndex(defs) {
    var seen = {}, out = [];
    (defs || []).forEach(function (d, i) {
      if (!d) return;
      var id = chipId(d);
      if (Object.prototype.hasOwnProperty.call(seen, id)) out.push({ index: i, id: id, firstIndex: seen[id] });
      else seen[id] = i;
    });
    return out;
  }

  return { validateChip: validateChip, chipId: chipId, duplicateIdIndex: duplicateIdIndex,
           ENGINE_SCHEMA_MAX: ENGINE_SCHEMA_MAX };
});
