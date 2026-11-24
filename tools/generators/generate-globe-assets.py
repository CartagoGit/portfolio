#!/usr/bin/env python3
"""Generate original, seamless equirectangular globe textures.

Uses only NumPy and Pillow. Existing observed maps are never overwritten; all
original or derived output is stored with a truthful `-4k` name.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
GLOBE = ROOT / "public" / "images" / "globe"
CHUNK = 96


def sphere_rows(y: int, height: int, width: int) -> np.ndarray:
    v = np.arange(y, min(y + CHUNK, height), dtype=np.float32) + 0.5
    latitude = (0.5 - v[:, None] / height) * math.pi
    longitude = (np.arange(width, dtype=np.float32)[None, :] + 0.5) / width * math.tau - math.pi
    x = np.cos(latitude) * np.cos(longitude)
    yy = np.sin(latitude)
    z = np.cos(latitude) * -np.sin(longitude)
    return np.stack((x, np.broadcast_to(yy, x.shape), z), axis=-1)


def each_row(width: int, height: int, pixel_fn):
    output = np.empty((height, width, 3), dtype=np.uint8)
    for y in range(0, height, CHUNK):
        sphere = sphere_rows(y, height, width)
        output[y : y + sphere.shape[0]] = pixel_fn(sphere, y, width, height)
    return output


def icosa_vertices() -> np.ndarray:
    phi = (1 + math.sqrt(5)) / 2
    values = []
    for a in (-1, 1):
        for b in (-phi, phi):
            values.append((0, a, b))
            values.append((a, b, 0))
            values.append((b, 0, a))
    result = np.asarray(values, dtype=np.float32)
    return result / np.linalg.norm(result, axis=1)[:, None]


def football(width: int, height: int) -> np.ndarray:
    vertices = icosa_vertices()
    tangent = []
    orientations = []
    for center in vertices:
        up = np.array([0, 1, 0], dtype=np.float32)
        if abs(float(np.dot(center, up))) > 0.9:
            up = np.array([1, 0, 0], dtype=np.float32)
        e1 = np.cross(up, center)
        e1 /= np.linalg.norm(e1)
        e2 = np.cross(center, e1)
        tangent.append((e1, e2))
        dots = vertices @ center
        neighbor = vertices[int(np.argsort(dots)[-2])]
        orientations.append(math.atan2(float(neighbor @ e2), float(neighbor @ e1)))

    def pixels(sphere, _y, _w, _h):
        flat = sphere.reshape(-1, 3)
        dots = flat @ vertices.T
        nearest = np.argmax(dots, axis=1)
        ordered = np.partition(dots, -2, axis=1)
        seam = np.abs(ordered[:, -1] - ordered[:, -2])
        best = dots[np.arange(flat.shape[0]), nearest]
        angle = np.arccos(np.clip(best, -1.0, 1.0))
        black = np.zeros(flat.shape[0], dtype=bool)
        pentagon_edge = np.zeros(flat.shape[0], dtype=bool)
        for index, (e1, e2) in enumerate(tangent):
            mask = nearest == index
            if not mask.any():
                continue
            local = flat[mask]
            direction = np.arctan2(local @ e2, local @ e1) - orientations[index]
            sector = (direction + math.pi / 5) % (math.tau / 5) - math.pi / 5
            boundary = 0.255 / np.cos(sector)
            local_angle = angle[mask]
            black[mask] = local_angle <= boundary
            pentagon_edge[mask] = np.abs(local_angle - boundary) < 0.012
        leather = 0.92 + 0.035 * np.sin(flat[:, 0] * 1900 + flat[:, 1] * 1130 + flat[:, 2] * 760)
        rgb = np.empty((flat.shape[0], 3), dtype=np.float32)
        rgb[:] = (np.clip(leather, 0.82, 0.99) * 245)[:, None]
        rgb[black] = (11, 15, 20)
        edge = pentagon_edge | ((seam < 0.018) & (best > 0.18))
        rgb[edge] = (62, 68, 74)
        return np.clip(rgb, 0, 255).reshape(sphere.shape[0], sphere.shape[1], 3).astype(np.uint8)

    return each_row(width, height, pixels)


def basketball(width: int, height: int) -> np.ndarray:
    normals = np.asarray(
        [[1, 0, 0], [0, 0, 1], [0.68, 0.72, 0.12], [-0.72, 0.68, 0.16]],
        dtype=np.float32,
    )
    normals /= np.linalg.norm(normals, axis=1)[:, None]

    def pixels(sphere, _y, _w, _h):
        flat = sphere.reshape(-1, 3)
        distances = np.abs(flat @ normals.T)
        line = np.min(distances, axis=1) < 0.016
        grain = 0.5 + 0.5 * np.sin(flat[:, 0] * 510 + np.sin(flat[:, 1] * 390) * 2.5)
        grain = np.clip(grain, 0, 1)
        color = np.stack((205 + grain * 42, 78 + grain * 30, 18 + grain * 14), axis=1)
        color[line] = (25, 17, 14)
        return np.clip(color, 0, 255).reshape(sphere.shape[0], sphere.shape[1], 3).astype(np.uint8)

    return each_row(width, height, pixels)


def curved_seam_ball(width: int, height: int, base: tuple[int, int, int], seams: tuple[int, int, int], tennis: bool) -> np.ndarray:
    def pixels(sphere, _y, _w, _h):
        h, w, _ = sphere.shape
        longitude = np.arctan2(-sphere[:, :, 2], sphere[:, :, 0])
        y = sphere[:, :, 1]
        wave = 0.48 * np.sin(longitude * 1.5 + (0.35 if tennis else 0))
        wave2 = 0.48 * np.sin(longitude * 1.5 + math.pi + (0.35 if tennis else 0))
        seam = (np.abs(y - wave) < 0.018) | (np.abs(y - wave2) < 0.018)
        noise = np.sin(sphere[:, :, 0] * 420) * np.sin(sphere[:, :, 1] * 380) * np.sin(sphere[:, :, 2] * 450)
        rgb = np.empty((h, w, 3), dtype=np.float32)
        rgb[:] = base
        rgb += noise[:, :, None] * (10 if tennis else 5)
        rgb[seam] = seams
        return np.clip(rgb, 0, 255).astype(np.uint8)

    return each_row(width, height, pixels)


def golf(width: int, height: int) -> np.ndarray:
    image = Image.new("RGB", (width, height), (226, 232, 234))
    draw = ImageDraw.Draw(image)
    rows, columns = 34, 68
    radius = max(7, width // 360)
    for row in range(rows + 1):
        y = round((row + 0.5) * height / rows)
        offset = (row % 2) * width / (columns * 2)
        for column in range(-1, columns + 1):
            x = round(column * width / columns + offset)
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(175, 186, 191), outline=(244, 248, 249), width=2)
            draw.arc((x - radius + 2, y - radius + 2, x + radius - 2, y + radius - 2), 190, 345, fill=(126, 140, 149), width=2)
    return np.asarray(image.filter(ImageFilter.GaussianBlur(0.35)))


def volleyball(width: int, height: int) -> np.ndarray:
    def pixels(sphere, _y, _w, _h):
        longitude = (np.arctan2(-sphere[:, :, 2], sphere[:, :, 0]) + math.pi) / math.tau
        latitude = np.arcsin(np.clip(sphere[:, :, 1], -1, 1)) / math.pi + 0.5
        curved = (longitude * 6 + 0.16 * np.sin(latitude * math.tau * 2)) % 6
        panel = np.floor(curved).astype(np.int16)
        colors = np.array([[242, 244, 241], [19, 89, 159], [242, 244, 241], [232, 174, 43], [242, 244, 241], [37, 53, 78]], dtype=np.float32)
        rgb = colors[panel].copy()
        seam = np.minimum(curved % 1.0, 1 - (curved % 1.0)) < 0.018
        cap = np.abs(latitude - 0.5) > 0.475
        rgb[seam | cap] = (244, 246, 243)
        return rgb.astype(np.uint8)

    return each_row(width, height, pixels)


def beach_ball(width: int, height: int) -> np.ndarray:
    def pixels(sphere, _y, _w, _h):
        longitude = (np.arctan2(-sphere[:, :, 2], sphere[:, :, 0]) + math.pi) / math.tau
        latitude = np.abs(np.arcsin(np.clip(sphere[:, :, 1], -1, 1)) / (math.pi / 2))
        curved = (longitude * 6 + 0.055 * np.sin(latitude * math.pi)) % 6
        panel = np.floor(curved).astype(np.int16)
        colors = np.array([[244, 245, 239], [237, 67, 71], [45, 135, 232], [246, 196, 45], [54, 183, 98], [242, 245, 238]], dtype=np.float32)
        rgb = colors[panel].copy()
        seam = np.minimum(curved % 1.0, 1 - (curved % 1.0)) < 0.014
        rgb[seam] = (250, 250, 246)
        rgb[latitude > 0.985] = (248, 249, 246)
        return rgb.astype(np.uint8)

    return each_row(width, height, pixels)


def exoplanet(width: int, height: int, palette: str) -> np.ndarray:
    rng = np.random.default_rng({"kepler": 186, "proxima": 199, "trappist": 701}[palette])
    waves = [
        (rng.normal(size=3).astype(np.float32), float(freq), float(rng.random() * math.tau), float(amp))
        for freq, amp in [(2.2, 0.48), (4.7, 0.24), (9.5, 0.14), (18.0, 0.08), (37.0, 0.04), (73.0, 0.02)]
    ]
    for item in waves:
        item[0][:] = item[0] / np.linalg.norm(item[0])  # type: ignore[index]

    def pixels(sphere, _y, _w, _h):
        noise = np.zeros(sphere.shape[:2], dtype=np.float32)
        for direction, frequency, phase, amplitude in waves:
            noise += np.sin((sphere @ direction) * frequency + phase) * amplitude
        latitude = np.abs(sphere[:, :, 1])
        clouds = np.clip((noise + 0.14 * np.sin(sphere[:, :, 0] * 43 + sphere[:, :, 2] * 29) - 0.08) * 2.4, 0, 1)
        t = np.clip(noise * 1.15 + 0.48, 0, 1)
        if palette == "kepler":
            deep = np.array([8, 72, 110], dtype=np.float32)
            land = np.array([82, 127, 72], dtype=np.float32)
            peak = np.array([214, 189, 133], dtype=np.float32)
            rgb = deep + (land - deep)[None, None, :] * np.clip((t - 0.26) * 2.0, 0, 1)[:, :, None]
            rgb = rgb * 0.7 + peak * np.clip((t - 0.62) * 2.4, 0, 1)[:, :, None] * 0.3
            rgb += np.clip(clouds, 0, 1)[:, :, None] * np.array([155, 166, 164])
        elif palette == "proxima":
            dark = np.array([57, 26, 27], dtype=np.float32)
            warm = np.array([177, 82, 42], dtype=np.float32)
            light = np.array([232, 166, 104], dtype=np.float32)
            rgb = dark + (warm - dark) * t[:, :, None]
            rgb += (light - rgb) * np.clip((t - 0.68) * 2.8, 0, 1)[:, :, None]
            rgb += clouds[:, :, None] * np.array([55, 38, 32])
        else:
            ocean = np.array([13, 76, 91], dtype=np.float32)
            ice = np.array([116, 207, 197], dtype=np.float32)
            snow = np.array([224, 245, 239], dtype=np.float32)
            rgb = ocean + (ice - ocean) * t[:, :, None]
            rgb += (snow - rgb) * np.clip((latitude - 0.62) * 2.8 + clouds * 0.32, 0, 1)[:, :, None]
        return np.clip(rgb, 0, 255).astype(np.uint8)

    return each_row(width, height, pixels)


def earth_variants(width: int, height: int) -> dict[str, np.ndarray]:
    source = Image.open(ROOT / "public" / "images" / "globe" / "earth-blue-marble-4k.webp").convert("RGB")
    if source.size != (width, height):
        source = source.resize((width, height), Image.Resampling.LANCZOS)
    rgb = np.asarray(source, dtype=np.float32) / 255
    blue = rgb[:, :, 2] > (rgb[:, :, 0] * 1.12)
    blue &= rgb[:, :, 2] > (rgb[:, :, 1] * 0.92)
    luminance = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)

    land = np.clip((luminance - 0.12) / 0.72, 0, 1)
    topo = np.empty_like(rgb)
    topo[:, :, 0] = np.where(blue, 0.015, np.clip(0.15 + land * 0.68, 0, 1))
    topo[:, :, 1] = np.where(blue, 0.12 + land * 0.12, np.clip(0.26 + land * 0.52, 0, 1))
    topo[:, :, 2] = np.where(blue, 0.35 + land * 0.2, np.clip(0.15 + land * 0.62, 0, 1))

    ocean_image = Image.fromarray((blue.astype(np.uint8) * 255), "L")
    coast = np.asarray(ocean_image.filter(ImageFilter.GaussianBlur(36)), dtype=np.float32) / 255
    depth = np.clip(coast * 0.78 + blue.astype(np.float32) * 0.22, 0, 1)
    bathy = np.empty_like(rgb)
    bathy[:, :, 0] = np.where(blue, 0.01 + depth * 0.05, 0.72 + land * 0.18)
    bathy[:, :, 1] = np.where(blue, 0.13 + depth * 0.26, 0.70 + land * 0.2)
    bathy[:, :, 2] = np.where(blue, 0.38 + depth * 0.34, 0.62 + land * 0.12)

    heat = np.clip(luminance * 1.25 + (rgb[:, :, 0] - rgb[:, :, 2]) * 0.32, 0, 1)
    thermal = np.empty_like(rgb)
    thermal[:, :, 0] = np.clip(heat * 1.7, 0, 1)
    thermal[:, :, 1] = np.clip(1 - abs(heat - 0.5) * 2.0, 0, 1)
    thermal[:, :, 2] = np.clip((0.5 - heat) * 2.0, 0, 1)
    return {
        "earth-topography-4k.webp": topo,
        "earth-bathymetry-4k.webp": bathy,
        "earth-thermal-4k.webp": thermal,
    }


def cartago_marks(width: int, height: int) -> dict[str, np.ndarray]:
    base = Image.new("RGB", (width, height), (6, 22, 42))
    draw = ImageDraw.Draw(base)
    for x in range(0, width, 96):
        draw.line((x, 0, x - 640, height), fill=(13, 47, 77), width=1)
    cx, cy = width // 2, height // 2
    radius = min(height // 4, width // 7)
    draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(8, 29, 54), outline=(50, 205, 245), width=max(8, width // 500))
    draw.arc((cx - radius * 0.72, cy - radius * 0.72, cx + radius * 0.72, cy + radius * 0.72), 52, 308, fill=(235, 248, 252), width=max(14, width // 260))
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(28, height // 22))
    draw.text((cx, cy + radius + height // 18), "CARTAGO", fill=(230, 247, 252), font=font, anchor="mm")

    banner = Image.new("RGB", (width, height), (8, 19, 35))
    bdraw = ImageDraw.Draw(banner)
    for row in range(height):
        ratio = row / max(1, height - 1)
        color = (int(5 + ratio * 8), int(23 + ratio * 36), int(43 + ratio * 55))
        bdraw.line((0, row, width, row), fill=color)
    bx1, by1, bx2, by2 = width * 0.18, height * 0.34, width * 0.82, height * 0.66
    bdraw.rounded_rectangle((bx1, by1, bx2, by2), radius=height // 20, fill=(7, 31, 55), outline=(50, 205, 245), width=max(8, width // 600))
    banner_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(30, height // 13))
    sub_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(18, height // 32))
    bdraw.text((width // 2, height * 0.46), "CARTAGO", fill=(235, 249, 255), font=banner_font, anchor="mm")
    bdraw.text((width // 2, height * 0.56), "FRONTEND · PRODUCT · TOOLS", fill=(73, 215, 249), font=sub_font, anchor="mm")
    return {"cartago-mark-v2.webp": np.asarray(base), "cartago-banner-v2.webp": np.asarray(banner)}


def save(output: np.ndarray | Image.Image, name: str, quality: int = 92) -> None:
    image = output if isinstance(output, Image.Image) else Image.fromarray(output)
    path = GLOBE / name
    image.save(path, "WEBP", quality=quality, method=6)
    print(f"wrote {path.relative_to(ROOT)} ({image.width}x{image.height})")


def generate(selected: set[str]) -> None:
    GLOBE.mkdir(parents=True, exist_ok=True)
    width, height = 4096, 2048
    tasks = {
        "soccer": lambda: football(width, height),
        "basketball": lambda: basketball(width, height),
        "tennis": lambda: curved_seam_ball(width, height, (181, 225, 64), (247, 249, 238), True),
        "golf": lambda: golf(width, height),
        "beach-ball": lambda: beach_ball(width, height),
        "volleyball": lambda: volleyball(width, height),
        "rugby": lambda: curved_seam_ball(width, height, (115, 29, 34), (244, 231, 202), False),
        "kepler": lambda: exoplanet(width, height, "kepler"),
        "proxima": lambda: exoplanet(width, height, "proxima"),
        "trappist": lambda: exoplanet(width, height, "trappist"),
    }
    names = {
        "soccer": "soccer-canonical-4k.webp",
        "basketball": "basketball-canonical-4k.webp",
        "tennis": "tennis-canonical-4k.webp",
        "golf": "golf-canonical-4k.webp",
        "beach-ball": "beach-ball-canonical-4k.webp",
        "volleyball": "volleyball-canonical-4k.webp",
        "rugby": "rugby-canonical-4k.webp",
        "kepler": "kepler-186f-artist-4k.webp",
        "proxima": "proxima-b-artist-4k.webp",
        "trappist": "trappist-1e-artist-4k.webp",
    }
    for key, task in tasks.items():
        if selected and key not in selected:
            continue
        save(task(), names[key])

    if not selected or "earth" in selected:
        for name, pixels in earth_variants(width, height).items():
            save(np.clip(pixels * 255, 0, 255).astype(np.uint8), name)
    if not selected or "brand" in selected:
        for name, pixels in cartago_marks(width, height).items():
            save(pixels, name)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("assets", nargs="*", default=[])
    args = parser.parse_args()
    generate(set(args.assets))


if __name__ == "__main__":
    main()


def rugby(width: int, height: int) -> np.ndarray:
    def pixels(sphere, _y, _w, _h):
        longitude = (np.arctan2(-sphere[:, :, 2], sphere[:, :, 0]) + math.pi) / math.tau
        latitude = np.arcsin(np.clip(sphere[:, :, 1], -1.0, 1.0))
        grain = np.sin(sphere[:, :, 0] * 360) * np.sin(sphere[:, :, 1] * 410) * np.sin(sphere[:, :, 2] * 330)
        rgb = np.empty((*sphere.shape[:2], 3), dtype=np.float32)
        rgb[:] = (126, 27, 38)
        rgb += grain[:, :, None] * np.array([8, 3, 4])

        seam_wave = 0.38 * np.sin((longitude * math.tau) - 0.35)
        seam = np.abs(sphere[:, :, 1] - seam_wave) < 0.018
        secondary = np.abs(sphere[:, :, 1] + seam_wave) < 0.012
        rgb[seam | secondary] = (232, 216, 180)

        center_distance = np.abs(longitude - 0.5)
        spine = center_distance < 0.008
        lace_rows = np.zeros_like(spine)
        for offset in (-0.13, -0.086, -0.043, 0.0, 0.043, 0.086, 0.13):
            lace_rows |= (np.abs(latitude - offset) < 0.006) & (center_distance < 0.034)
        rgb[spine & (np.abs(latitude) < 0.16)] = (245, 232, 204)
        rgb[lace_rows] = (248, 237, 216)
        return np.clip(rgb, 0, 255).astype(np.uint8)

    return each_row(width, height, pixels)
