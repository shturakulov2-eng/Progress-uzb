"""Rebuild marketer portrait without white fringe for dark mode."""

from pathlib import Path

from PIL import Image, ImageFilter

src_photo = Path(r"d:\This PC\Рабочий стол\Progress uzb\Photoes\Shahzod aka main.png")
out_path = Path(r"d:\This PC\Рабочий стол\Progress uzb\public\marketer\portrait.png")
preview_path = Path(r"d:\This PC\Рабочий стол\Progress uzb\public\marketer\_preview-dark.jpg")

im = Image.open(src_photo).convert("RGBA")
w, h = im.size
px = im.load()

# Solid mask from alpha
mask = Image.new("L", (w, h), 0)
mp = mask.load()
for y in range(h):
    for x in range(w):
        mp[x, y] = 255 if px[x, y][3] > 128 else 0

# Bite a thin rim that often carries pale matte colors
eroded = mask
for _ in range(2):
    eroded = eroded.filter(ImageFilter.MinFilter(3))

feathered = eroded.filter(ImageFilter.GaussianBlur(0.8))
fp = feathered.load()
ep = eroded.load()

out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
op = out.load()

for y in range(h):
    for x in range(w):
        na = fp[x, y]
        if na == 0:
            # Critical: keep transparent RGB black so scaled edges don't pick white
            op[x, y] = (0, 0, 0, 0)
            continue

        r, g, b, _a = px[x, y]

        # On soft rim, pull color from nearby solid interior (prefer darker)
        if na < 250 or ep[x, y] == 0:
            best = None
            best_lum = 999
            for rad in (2, 4, 7):
                for dy in range(-rad, rad + 1):
                    yy = y + dy
                    if yy < 0 or yy >= h:
                        continue
                    for dx in range(-rad, rad + 1):
                        xx = x + dx
                        if xx < 0 or xx >= w:
                            continue
                        if ep[xx, yy] != 255:
                            continue
                        ir, ig, ib, _ = px[xx, yy]
                        lum = (ir + ig + ib) / 3
                        if lum < best_lum:
                            best_lum = lum
                            best = (ir, ig, ib)
                if best is not None and best_lum < 100:
                    break
            if best is not None:
                r, g, b = best

        # Kill residual pale fringe
        if (r + g + b) / 3 > 170 and na < 255:
            r, g, b = int(r * 0.25), int(g * 0.25), int(b * 0.25)

        op[x, y] = (r, g, b, na)

out.save(out_path, optimize=True)
print("saved", out_path, out.size)

bg = Image.new("RGBA", out.size, (11, 18, 32, 255))
preview = Image.alpha_composite(bg, out).convert("RGB")
preview.save(preview_path, quality=92)

# Stats
px2 = out.load()
white_transparent = 0
bright_edge = 0
for y in range(0, h, 2):
    for x in range(0, w, 2):
        r, g, b, a = px2[x, y]
        if a == 0 and (r + g + b) > 30:
            white_transparent += 1
        if 30 < a < 240 and (r + g + b) / 3 > 160:
            bright_edge += 1
print("non-black transparent samples", white_transparent)
print("bright soft-edge samples", bright_edge)
print("preview ok")
