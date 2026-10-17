/* 封装渲染：几何计算 + SVG 生成（零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.PackageSVG = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // 均布中心位置：count 个引脚沿长度 length 排列，返回各中心坐标（从 0 端起）
  function centers(count, length, pitch) {
    if (count <= 0) return [];
    var margin = (length - (count - 1) * pitch) / 2;
    var arr = [];
    for (var i = 0; i < count; i++) arr.push(margin + i * pitch);
    return arr;
  }

  function computePinLayout(pkg) {
    var W = pkg.body[0], L = pkg.body[1], pitch = pkg.pitch;
    var padOut = Math.max(pkg.leadLength || 0, Math.max(0.6, pitch * 1.4)); // 引脚矩形伸出/占位长
    var padAcross = Math.max(0.18, pitch * 0.5);                            // 引脚矩形宽
    var pins = [];

    function addLeft(nums) {
      var ys = centers(nums.length, L, pitch);
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "left", x: 0, y: ys[i], w: padOut, h: padAcross });
      });
    }
    function addRight(nums) {   // nums 按"自下而上"顺序传入
      var ys = centers(nums.length, L, pitch).reverse();   // reverse 后 index0 = 最下
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "right", x: W, y: ys[i], w: padOut, h: padAcross });
      });
    }
    function addTop(nums) {     // nums 按"自右而左"顺序传入
      var xs = centers(nums.length, W, pitch).reverse();   // index0 = 最右
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "top", x: xs[i], y: 0, w: padAcross, h: padOut });
      });
    }
    function addBottom(nums) {  // nums 按"自左而右"顺序传入
      var xs = centers(nums.length, W, pitch);
      nums.forEach(function (num, i) {
        pins.push({ num: num, side: "bottom", x: xs[i], y: L, w: padAcross, h: padOut });
      });
    }
    function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }

    if (pkg.family === "quad") {
      var n = pkg.pinsPerSide;
      if (pkg.pin1 === "bottomLeft") {
        addBottom(range(1, n));
        addRight(range(n + 1, 2 * n));
        addTop(range(2 * n + 1, 3 * n));
        addLeft(range(3 * n + 1, 4 * n));
      } else {
        addLeft(range(1, n));
        addBottom(range(n + 1, 2 * n));
        addRight(range(2 * n + 1, 3 * n));
        addTop(range(3 * n + 1, 4 * n));
      }
    } else if (pkg.family === "quad-split") {
      var a = pkg.counts[0], b = pkg.counts[1], c = pkg.counts[2], d = pkg.counts[3];
      if (pkg.pin1 === "bottomLeft") {
        addBottom(range(1, b));
        addRight(range(b + 1, b + c));
        addTop(range(b + c + 1, b + c + d));
        addLeft(range(b + c + d + 1, a + b + c + d));
      } else {
        addLeft(range(1, a));
        addBottom(range(a + 1, a + b));
        addRight(range(a + b + 1, a + b + c));
        addTop(range(a + b + c + 1, a + b + c + d));
      }
    } else if (pkg.family === "dual") {
      var m = pkg.pinsPerSide;
      addLeft(range(1, m));
      addRight(range(m + 1, 2 * m));
    } else if (pkg.family === "dual-split") {
      var a2 = pkg.counts[0], b2 = pkg.counts[1];
      addLeft(range(1, a2));
      addRight(range(a2 + 1, a2 + b2));
    }

    if (pkg.thermalPad) {
      pins.push({ num: "EP", side: "center", x: W / 2, y: L / 2, w: W * 0.5, h: L * 0.5 });
    }

    var margin = padOut + 1.1;
    var viewBox = [-margin, -margin, W + 2 * margin, L + 2 * margin].join(" ");
    return { body: { x: 0, y: 0, w: W, h: L }, pins: pins, viewBox: viewBox, padOut: padOut };
  }

  var SVGNS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function renderPackage(def) {
    var pkg = def.package;
    var layout = computePinLayout(pkg);
    var svg = el("svg", { viewBox: layout.viewBox, "data-chip": def.chip.name });
    var nameByNum = {};
    (def.pins || []).forEach(function (p) { nameByNum[p.num] = p.name; });

    svg.appendChild(el("rect", { class: "pkg-body", x: 0, y: 0, width: layout.body.w, height: layout.body.h, rx: 0.25 }));
    var dotY = (def.package.pin1 === "bottomLeft") ? layout.body.h - 0.38 : 0.38;
    svg.appendChild(el("circle", { class: "pin1-dot", cx: 0.38, cy: dotY, r: 0.14 }));
    // EP 底垫必须先画（否则会盖住引脚文字）；交互由后面 pins 循环里的中心 g 负责
    var centerPin = layout.pins.find(function (p) { return p.side === "center"; });
    if (centerPin) {
      svg.appendChild(el("rect", { class: "pin-pad ep-pad",
        x: centerPin.x - centerPin.w / 2, y: centerPin.y - centerPin.h / 2,
        width: centerPin.w, height: centerPin.h, rx: 0.1 }));
    }

    layout.pins.forEach(function (pin) {
      var g = el("g", { class: "pin", "data-num": pin.num });
      var name = nameByNum[pin.num] || String(pin.num);
      g.setAttribute("data-pin", name);
      if (pin.side !== "center") {
        g.appendChild(el("rect", { class: "pin-pad",
          x: pin.x - pin.w / 2, y: pin.y - pin.h / 2, width: pin.w, height: pin.h, rx: 0.06 }));
      }
      var tName = el("text", { class: "pin-name" });
      var tNum = el("text", { class: "pin-num" });
      var FONT_NAME = 0.26, EST_W = 0.62;   // 估算字宽系数（用于 textLength 压缩）
      function fitWidth(text, max) {
        if (text.length * FONT_NAME * EST_W > max) {
          tName.setAttribute("textLength", max);
          tName.setAttribute("lengthAdjust", "spacingAndGlyphs");
        }
      }
      if (pin.side === "center") {
        // 中央 EP 不写字，标签另行绘制
      } else if (pin.side === "left") {
        tName.setAttribute("x", pin.x + pin.w / 2 + 0.12); tName.setAttribute("y", pin.y + 0.09);
        tNum.setAttribute("x", pin.x - pin.w / 2 - 0.12); tNum.setAttribute("y", pin.y + 0.09);
        tNum.setAttribute("text-anchor", "end");
        tName.textContent = name; tNum.textContent = pin.num;
        fitWidth(name, 1.9);
      } else if (pin.side === "right") {
        tName.setAttribute("x", pin.x - pin.w / 2 - 0.12); tName.setAttribute("y", pin.y + 0.09);
        tName.setAttribute("text-anchor", "end");
        tNum.setAttribute("x", pin.x + pin.w / 2 + 0.12); tNum.setAttribute("y", pin.y + 0.09);
        tName.textContent = name; tNum.textContent = pin.num;
        fitWidth(name, 1.9);
      } else if (pin.side === "bottom") {
        // 上下边名字放封装体外侧、旋转 -90°：与左右名字彻底隔离
        tNum.setAttribute("x", pin.x); tNum.setAttribute("y", pin.y + 0.55);
        tNum.setAttribute("text-anchor", "middle");
        var byy = pin.y + 0.72;
        tName.setAttribute("x", pin.x + 0.13); tName.setAttribute("y", byy);
        tName.setAttribute("transform", "rotate(-90 " + (pin.x + 0.13) + " " + byy + ")");
        tName.setAttribute("text-anchor", "end");
        tName.textContent = name; tNum.textContent = pin.num;
        fitWidth(name, 0.9);
      } else { /* top */
        tNum.setAttribute("x", pin.x); tNum.setAttribute("y", pin.y - 0.55);
        tNum.setAttribute("text-anchor", "middle");
        var tyy = pin.y - 0.85;
        tName.setAttribute("x", pin.x + 0.13); tName.setAttribute("y", tyy);
        tName.setAttribute("transform", "rotate(-90 " + (pin.x + 0.13) + " " + tyy + ")");
        tName.textContent = name; tNum.textContent = pin.num;
        fitWidth(name, 0.9);
      }
      var title = document.createElementNS(SVGNS, "title");
      title.textContent = name;
      g.appendChild(tName); g.appendChild(tNum); g.appendChild(title);
      svg.appendChild(g);
    });

    var label = el("text", { class: "chip-label", x: pkg.body[0] / 2, y: pkg.body[1] / 2 - 0.26, "text-anchor": "middle" });
    label.textContent = def.chip.name;
    svg.appendChild(label);
    var label2 = el("text", { class: "chip-label", x: pkg.body[0] / 2, y: pkg.body[1] / 2 + 0.20, "text-anchor": "middle" });
    label2.textContent = def.chip.package;
    svg.appendChild(label2);
    var epNote = el("text", { class: "ep-note", x: pkg.body[0] / 2, y: pkg.body[1] / 2 + 0.58, "text-anchor": "middle" });
    epNote.textContent = "EP: GND";
    svg.appendChild(epNote);
    return svg;
  }

  return { computePinLayout: computePinLayout, renderPackage: renderPackage };
});
