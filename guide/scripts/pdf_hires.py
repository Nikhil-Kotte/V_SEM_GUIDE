"""Render PDF figures at high resolution for scripts/extract-diagrams.mjs.

For every manifest entry that comes from a PDF, find the figure's box on the page
(by matching the embedded image's pixel size, or from the manifest's 150-dpi crop)
and render that region of the page at ZOOM x. Rendering the page composites soft
masks and colours properly, so text inside figures comes out crisp.

    python scripts/pdf_hires.py            # writes scripts/.hires/<id>.png
"""
import json
import pathlib
import sys

import pymupdf

ZOOM = 4  # 72 dpi * 4 = 288 dpi
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
OUT = HERE / ".hires"
OUT.mkdir(exist_ok=True)

manifest = json.loads((HERE / "diagrams.manifest.json").read_text(encoding="utf8"))
only = set(sys.argv[1:])
docs = {}

for d in manifest:
    if "page" not in d or (only and d["id"] not in only and d["subject"] not in only):
        continue
    doc = docs.setdefault(d["src"], pymupdf.open(ROOT / d["src"]))
    page = doc[d["page"] - 1]
    rect = None
    if isinstance(d.get("pdfimage"), str):
        w, h = map(int, d["pdfimage"].split("x"))
        for img in page.get_images(full=True):
            if img[2] == w and img[3] == h:
                rects = page.get_image_rects(img[0])
                if rects:
                    rect = max(rects, key=lambda r: r.width * r.height)
                    break
    elif d.get("crop"):
        c, s = d["crop"], 72 / d.get("dpi", 150)
        rect = pymupdf.Rect(c["x"] * s, c["y"] * s, (c["x"] + c["w"]) * s, (c["y"] + c["h"]) * s)
    if rect is None:
        print("skip (no box)", d["id"])
        continue
    rect = (rect + (-3, -3, 3, 3)) & page.rect  # small margin, stay on the page
    pix = page.get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), clip=rect, alpha=False)
    pix.save(OUT / f"{d['id']}.png")
    print("ok", d["id"], pix.width, "x", pix.height)
