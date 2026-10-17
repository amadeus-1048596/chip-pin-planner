#!/usr/bin/env python -X utf8
"""芯片数据 × 手册 PDF 交叉核验工具（供未来新芯片数据审计用）

用法:
  python tools/pdf-crosscheck.py --ds <手册PDF> --chip chips/<数据文件.js>

原理:
  压平 PDF 全文 → 按 "PXn：通用双向数字I/0引脚。" 切块 → 提取每脚 "TOKEN：" 复用功能集合
  → 用 node 载入数据文件的 pins[].alts → 集合求差。

注意（2026-10-07 实测教训）:
  单引擎不可信赖 —— pdfplumber 会吞掉 "1：…映射到" 这类短语段、pypdf 会把上标"注3"并入 token。
  重要结论务必再用第二引擎或文档内部冗余（逐脚引脚表 / 表7-7 重映射表 / 寄存器位描述）互证。
"""
import argparse
import json
import re
import subprocess
import sys

try:
    from pypdf import PdfReader
except ImportError:
    sys.exit("需要 pypdf：pip install pypdf")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ds", required=True, help="芯片手册 PDF 路径")
    ap.add_argument("--chip", required=True, help="chips/*.js 数据文件路径")
    ap.add_argument("--whitelist", default="", help="允许只在手册出现的 token，逗号分隔（如 CH583 专属功能）")
    args = ap.parse_args()

    reader = PdfReader(args.ds)
    full = "".join((p.extract_text() or "") + "\n" for p in reader.pages)
    squash = re.sub(r"\s+", "", full)

    blocks = list(re.finditer(r"P[AB]\d+：通用双向数字I/0引脚。", squash))
    names, dups = {}, []
    for i, m in enumerate(blocks):
        nm = re.match(r"(P[AB]\d+)：", m.group(0)).group(1)
        end = blocks[i + 1].start() if i + 1 < len(blocks) else m.start() + 1200
        toks = set(re.findall(r"([A-Za-z0-9_#+\-]+)：", squash[m.end():end]))
        if nm in names:
            dups.append((i, nm, toks))
        else:
            names[nm] = toks

    out = subprocess.run(
        ["node", "-e",
         "const d=require(process.argv[1]);const o={};"
         "d.pins.filter(p=>p.type==='io').forEach(p=>o[p.name]=p.alts);"
         "process.stdout.write(JSON.stringify(o))",
         args.chip],
        capture_output=True, text=True)
    if out.returncode != 0:
        sys.exit("node 读取数据文件失败：" + out.stderr[:200])
    data = json.loads(out.stdout)

    white = {x.strip() for x in args.whitelist.split(",") if x.strip()}
    diff = 0
    for nm in sorted(names.keys(), key=lambda x: (x[:2], int(x[2:]))):
        dset = {x.split("/")[0] for x in data.get(nm, [])}
        only_pdf = names[nm] - dset - white
        only_data = dset - names[nm]
        if only_pdf or only_data:
            diff += 1
            print(f"[{nm}] 手册独有:{sorted(only_pdf)}  数据独有:{sorted(only_data)}")
    print(f"—— 比对 {len(names)} 个引脚，差异 {diff}")
    for i, nm, toks in dups:
        print(f"重复描述块 #{i}（原文标注 {nm}，疑似手册笔误）tokens={sorted(toks)} —— 请与相邻引脚的数据人工核对")


if __name__ == "__main__":
    main()
