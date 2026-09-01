"""Remove edge-connected dark background from portrait PNG."""

from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "marketer" / "portrait-source.png"
OUT = ROOT / "public" / "marketer" / "portrait.png"


def is_background(r: int, g: int, b: int, a: int, threshold: int) -> bool:
    if a < 8:
        return True
    return max(r, g, b) <= threshold


def flood_transparent(
    pixels,
    width: int,
    height: int,
    threshold: int,
) -> None:
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def index(x: int, y: int) -> int:
        return y * width + x

    def push_if_bg(x: int, y: int) -> None:
        idx = index(x, y)
        if visited[idx]:
            return
        r, g, b, a = pixels[x, y]
        if is_background(r, g, b, a, threshold):
            visited[idx] = 1
            queue.append((x, y))

    for x in range(width):
        push_if_bg(x, 0)
        push_if_bg(x, height - 1)
    for y in range(height):
        push_if_bg(0, y)
        push_if_bg(width - 1, y)

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                push_if_bg(nx, ny)


def erode_dark_halo(pixels, width: int, height: int, threshold: int, passes: int) -> None:
    for _ in range(passes):
        to_clear: list[tuple[int, int]] = []
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a == 0 or max(r, g, b) > threshold:
                    continue
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if pixels[nx, ny][3] == 0:
                        to_clear.append((x, y))
                        break
        for x, y in to_clear:
            pixels[x, y] = (0, 0, 0, 0)


def remove_background(input_path: Path, output_path: Path) -> None:
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    flood_transparent(pixels, width, height, threshold=42)
    erode_dark_halo(pixels, width, height, threshold=52, passes=4)

    img.save(output_path, optimize=True)
    print(f"Saved transparent portrait to {output_path}")


if __name__ == "__main__":
    remove_background(SRC, OUT)
