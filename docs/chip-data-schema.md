# 芯片数据文件 schema 参考（chips/*.js）

> 权威说明文档；**硬门是引擎验证器 `Model.validateChip`（Node 可跑：见下）**。两者冲突以验证器为准，并回头修本文档。
> 校验命令：`node tests/engine.test.js`（全绿）或自查：`node -e "console.log(require('./js/engine/model.js').validateChip(require('./chips/你的文件.js')))"`

## 文件骨架（UMD-lite，照抄即可）

```js
(function (root, factory) {
  var def = factory();
  if (typeof module !== "undefined" && module.exports) { module.exports = def; }
  else { root.CHIP_REGISTRY = root.CHIP_REGISTRY || []; root.CHIP_REGISTRY.push(def); }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  return { /* 下面各字段 */ };
});
```

## 顶层字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `schemaVersion` | number | 当前上限 **2**；超限会显示"需要更新版本的工具"；旧值 1 兼容 |
| `id` | string | 唯一 slug（小写连字符，如 `ch582m-qfn48` = 型号-封装）；重复会置灰报错 |
| `meta` | object | `{ source: "手册型号 版本 (日期)", author, date, note? }`；**source 必填且如实**（数据来源要求，PR 会查） |
| `chip` | object | `{ vendor, name, package }`（如 `{ vendor:"WCH", name:"CH582M", package:"QFN48" }`）；name+package 决定下拉显示与老工程路由 |
| `package` | object | 渲染参数：`{ family:"quad"\|"dual"\|"dual-split", style:"no-lead"\|..., pinsPerSide, pitch, body:[宽,长], pin1:"topLeft", sequence:"ccw-down", thermalPad? }` |
| `pins` | array | 每脚 `{ num, name, type, alts[], note? }`；num 唯一（EP 用 `"EP"`）；type = `io`\|`power`\|`osc`\|`rf` |
| `globalConfigs` | array | 系统开关 `{ id, label, default, claims:[引脚], note? }`（如调试口/RST/晶振） |
| `resources` | array | 外设资源，见下 |

## resources 字段与约束

| 字段 | 说明 |
|---|---|
| `id/label/category` | 唯一 id、显示名、分类（SPI/UART/I2C/TIMER/PWM/ADC/USB/GPIO…） |
| `signals` | `[{ name, pins:[落脚点...], note?, groupKey? }]`；pins 引用必须存在于 `pins` |
| `groupSwitch` | `{ label }`：该资源存在"映射组"整组切换；**其全部必选信号必须恰好 2 个落脚点**（首=默认组、次=映射组） |
| `groupKey` | 字符串：同 key 的信号必须**同侧**分配（硬件一位同切）；同 key 信号均须 2 落脚点 |
| `modes` | `[{ id, label, signals:[信号名...], optional?:[信号名], note? }]`：一个资源多种工作模式，各自声明所需信号子集 |
| `optional` | 资源级为 `[{可选信号名}]`（**有 modes 的资源必须把可选放模式级**）；可选信号支持 1 或 2 落脚点；不列出的信号=必选 |
| `perPin` | `true` = 逐脚资源（如 GPIO），无 signals |

**硬规律**：必选信号 `pins` 非空、落脚点引脚必须在 `pins` 表中、`groupSwitch` 与多落脚点可选信号互斥语义见上；一切以 `validateChip` 实测为准。

## 最小完整示例（可直接过 validateChip）

```js
{ schemaVersion: 2, id: "mini-qfn8",
  meta: { source: "TEST 1.0", author: "you", date: "2026-01-01" },
  chip: { vendor: "TEST", name: "MINI", package: "QFN8" },
  package: { family: "quad", style: "no-lead", pinsPerSide: 2, pitch: 0.5, body: [2, 2], pin1: "topLeft", sequence: "ccw-down" },
  pins: [ { num: 1, name: "PA0", type: "io", alts: [] }, { num: 2, name: "PA1", type: "io", alts: [] },
          { num: 3, name: "PA2", type: "io", alts: [] }, { num: 4, name: "PA3", type: "io", alts: [] },
          { num: 5, name: "VDD33", type: "power", alts: [] }, { num: 6, name: "VIO33", type: "power", alts: [] },
          { num: 7, name: "X32MO", type: "osc", alts: [] }, { num: 8, name: "X32MI", type: "osc", alts: [] },
          { num: "EP", name: "GND", type: "power", alts: [] } ],
  globalConfigs: [],
  resources: [ { id: "SPI0", category: "SPI", label: "SPI0",
    signals: [ { name: "SCK", pins: ["PA0"] } ] }, { id: "GPIO", category: "GPIO", label: "GPIO", perPin: true } ] }
```

注意：`pins` 必须**完整覆盖 1..`pinsPerSide×4`**（上面 7 脚+EP 对应 2/边 的 QFN8），缺号会被 validateChip 拒绝——这是最常见的新手坑之一。
