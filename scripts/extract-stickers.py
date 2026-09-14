"""Crop sticker sheets on an even grid and punch outer black to alpha."""

from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(r"C:\Users\elder\Desktop\koinu-store-ecommerce\public\mascota")
OUT = ROOT / "stickers"
OUT.mkdir(exist_ok=True)


def bright_mask(arr, thr=40):
    rgb = arr[:, :, :3].astype(np.int16)
    return rgb.max(axis=2) > thr


def trim(arr, pad=10, thr=40):
    mask = bright_mask(arr, thr)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return arr
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0 = max(0, y0 - pad)
    x0 = max(0, x0 - pad)
    y1 = min(arr.shape[0], y1 + pad)
    x1 = min(arr.shape[1], x1 + pad)
    return arr[y0:y1, x0:x1]


def punch_outer_black(arr, thr=28):
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3]
    bg = np.zeros((h, w), dtype=bool)
    stack = []

    def is_bg(y, x):
        p = rgb[y, x]
        return int(p[0]) <= thr and int(p[1]) <= thr and int(p[2]) <= thr

    def push(y, x):
        if 0 <= y < h and 0 <= x < w and not bg[y, x] and is_bg(y, x):
            bg[y, x] = True
            stack.append((y, x))

    for x in range(w):
        push(0, x)
        push(h - 1, x)
    for y in range(h):
        push(y, 0)
        push(y, w - 1)
    while stack:
        y, x = stack.pop()
        if y:
            push(y - 1, x)
        if y + 1 < h:
            push(y + 1, x)
        if x:
            push(y, x - 1)
        if x + 1 < w:
            push(y, x + 1)

    out = arr.copy()
    if out.shape[2] == 3:
        alpha = np.full((h, w, 1), 255, dtype=np.uint8)
        out = np.concatenate([out, alpha], axis=2)
    out[bg, 3] = 0
    return out


def extract(name, cols, rows, labels, inset=(8, 12, 8, 40)):
    im = Image.open(ROOT / name).convert("RGBA")
    arr = np.array(im)
    left, top, right, bottom = inset
    x0, y0 = left, top
    x1, y1 = arr.shape[1] - right, arr.shape[0] - bottom
    cw = (x1 - x0) / cols
    rh = (y1 - y0) / rows
    print(f"\n{name} {cols}x{rows} cell={cw:.1f}x{rh:.1f}")
    idx = 0
    for r in range(rows):
        for c in range(cols):
            if idx >= len(labels):
                return
            cx0 = int(x0 + c * cw)
            cy0 = int(y0 + r * rh)
            cx1 = int(x0 + (c + 1) * cw)
            cy1 = int(y0 + (r + 1) * rh)
            cell = arr[cy0:cy1, cx0:cx1]
            cropped = trim(cell)
            if cropped.shape[0] < 36 or cropped.shape[1] < 36:
                idx += 1
                continue
            punched = punch_outer_black(cropped)
            dest = OUT / f"{labels[idx]}.png"
            Image.fromarray(punched, "RGBA").save(dest, optimize=True)
            print(f"  {dest.name:24} {punched.shape[1]}x{punched.shape[0]}")
            idx += 1


# Wipe previous generated stickers except we recreate all
for old in OUT.glob("*.png"):
    old.unlink()

extract(
    "mascota.png",
    5,
    3,
    [
        "logo",
        "welcome",
        "keep-shopping",
        "vamos",
        "help",
        "shipping",
        "thanks",
        "cool",
        "sending",
        "sleep",
        "new-products",
        "here",
        "waiting",
        "secure",
        "back-top",
    ],
    inset=(4, 4, 4, 90),
)

extract(
    "mascota2.png",
    7,
    4,
    [
        "logo-alt",
        "welcome-alt",
        "keep-shopping-alt",
        "continue",
        "help-alt",
        "shop-online",
        "new-products-alt",
        "order-placed",
        "order-shipping",
        "all-ready",
        "featured",
        "no-products",
        "thank-you",
        "where-is-order",
        "payment",
        "secure-alt",
        "free-shipping",
        "gifts",
        "follow",
        "questions",
        "search",
        "no-results",
        "error",
        "loading",
        "support",
        "done",
        "goodbye",
        "back-top-alt",
    ],
    inset=(6, 18, 6, 48),
)
