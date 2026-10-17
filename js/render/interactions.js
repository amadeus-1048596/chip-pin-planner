/* 缩放/平移（零依赖） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Interactions = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  function enablePanZoom(svg) {
    var dragging = false, last = null, moved = 0;

    function readVB() {
      var a = (svg.getAttribute("viewBox") || "0 0 10 10").split(/\s+/).map(Number);
      return { x: a[0], y: a[1], w: a[2], h: a[3] };
    }
    function writeVB(vb) {
      svg.setAttribute("viewBox", [vb.x, vb.y, vb.w, vb.h].join(" "));
    }
    function toSvgPoint(e, vb) {
      var r = svg.getBoundingClientRect();
      return { x: vb.x + (e.clientX - r.left) / r.width * vb.w,
               y: vb.y + (e.clientY - r.top) / r.height * vb.h };
    }

    svg.addEventListener("wheel", function (e) {
      e.preventDefault();
      var vb = readVB();
      var f = e.deltaY > 0 ? 1.15 : 1 / 1.15;
      var p = toSvgPoint(e, vb);
      vb.x = p.x - (p.x - vb.x) * f;
      vb.y = p.y - (p.y - vb.y) * f;
      vb.w *= f; vb.h *= f;
      writeVB(vb);
    }, { passive: false });

    function onMove(e) {
      if (!dragging) return;
      moved += Math.abs(e.clientX - last.x) + Math.abs(e.clientY - last.y);
      if (svg.getAttribute("data-dragged") !== "1") {
        // 未超过 8px 阈值不进入拖拽：避免手抖吞掉点击、轻微平移画面
        if (moved <= 8) { last = { x: e.clientX, y: e.clientY }; return; }
        svg.setAttribute("data-dragged", "1");   // 越过阈值：本帧即开始平移
      }
      var vb = readVB();
      var k = Math.min(vb.w / svg.clientWidth, vb.h / svg.clientHeight);
      vb.x -= (e.clientX - last.x) * k;
      vb.y -= (e.clientY - last.y) * k;
      last = { x: e.clientX, y: e.clientY };
      writeVB(vb);
    }
    function onUp() {
      dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    }
    svg.addEventListener("pointerdown", function (e) {
      svg.removeAttribute("data-dragged");
      dragging = true; moved = 0;
      last = { x: e.clientX, y: e.clientY };
      // 不用 setPointerCapture：真实指针下它会把 click 目标重定向到 <svg> 本身，
      // 导致 closest("g.pin") 找不到引脚、菜单打不开（合成事件测不出来）。
      // 改挂 window 级监听：拖出画布也能继续平移，且不干扰点击命中。
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });
  }

  return { enablePanZoom: enablePanZoom };
});
