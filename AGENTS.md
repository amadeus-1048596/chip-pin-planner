# AGENTS.md —— 给贡献者的 AI 助手

你（AI 助手）正在帮助用户给 **芯片引脚规划器** 加一颗芯片或修正数据。照本清单执行。

## 仓库地图

- `chips/*.js` —— 芯片数据（每文件一颗芯片）；`chips/manifest.js` —— 清单（**新增文件必须在此加一行，否则网页静默不显示**）
- `js/engine/`（纯逻辑，Node 可测）· `js/render/`（SVG 渲染）· `js/app.js`（UI）
- `tests/engine.test.js`（单测）· `tests/fuzz.js`（模糊测试）· `docs/chip-data-schema.md`（schema 权威说明）

## 硬规则

1. 零依赖、无构建、`file://` 直开；**不得引入任何包**，浏览器侧禁 ES modules（用 UMD-lite 尾巴）。
2. 数据文件照抄 `chips/wch-ch582m-qfn48.js` 的骨架；字段语义见 `docs/chip-data-schema.md`。
3. 一切 UI 文本中文；进 `innerHTML` 的字符串必须过 `escapeHtml`（`js/util.js`）。
4. 数据以公开手册为准，逐脚填；不确定的值（如封装尺寸 pitch/body）宁缺勿造，并在 PR 里标注来源。
5. 不要改 `js/engine/`，除非任务要求且附对应用例。

## 完成定义（Definition of Done）

- [ ] `node tests/engine.test.js` 全绿（含新数据 `Model.validateChip` 零错）
- [ ] `chips/manifest.js` 已加一行
- [ ] `meta.source` 如实填写（手册型号+版本）
- [ ] 若为同族新封装：差异记录进 `docs/reference/` 的家族差异文档

## 常见坑

- 清单漏行 = 静默消失（没有报错），务必自查；
- `schemaVersion` 超引擎上限 → 芯片被置灰"需要更新版本的工具"；
- `groupSwitch` 资源的必选信号必须恰好 2 个落脚点；`groupKey` 同 key 信号须同侧；
- 引脚 `num` 必须唯一、`resources` 引用的引脚名必须存在于 `pins`。
