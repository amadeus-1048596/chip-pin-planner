/* 通用工具（UMD-lite：浏览器挂 window.CPP.Util，Node 侧 module.exports） */
(function (root, factory) {
  var api = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.CPP = root.CPP || {}; root.CPP.Util = api; }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // HTML 转义（渲染层防注入：工程 JSON 里的自由文本别名等进 innerHTML 前必须过一遍）
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  return { escapeHtml: escapeHtml };
});
