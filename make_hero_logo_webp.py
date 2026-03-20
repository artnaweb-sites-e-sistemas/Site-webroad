"""
Gera LOGOV3.1-transparent.webp: remove fundo escuro + recorta letterbox
para a animação ficar orgânica na hero (sem “caixa” preta no pixel).
"""
from __future__ import annotations

from PIL import Image, ImageChops, ImageSequence

SRC = "Cópia de LOGOV3.1.gif"
DST = "LOGOV3.1-transparent.webp"
TARGET_WIDTH = 880
# Fundo: tudo abaixo de LOW some; entre LOW–HIGH fade (borda suave)
LOW, HIGH = 8, 58
# Remove só resíduo bem escuro (evita comer o brilho azul do logo)
DEFRINGE_MAX = 44
# Só considera “conteúdo” acima deste brilho para calcular o crop
CROP_LUM = 38


def key_dark_to_transparent(frame: Image.Image) -> Image.Image:
    rgba = frame.convert("RGBA")
    r, g, b, a = rgba.split()
    lum = ImageChops.lighter(ImageChops.lighter(r, g), b)
    span = max(HIGH - LOW, 1)
    fade_mask = lum.point(
        lambda x: 0
        if x <= LOW
        else 255
        if x >= HIGH
        else int(((x - LOW) / span) * 255)
    )
    new_a = ImageChops.multiply(a, fade_mask)
    # Segundo corte: elimina resíduo escuro semi-opaco nas bordas
    kill_dark = lum.point(lambda x: 0 if x < DEFRINGE_MAX else 255)
    new_a = ImageChops.multiply(new_a, kill_dark)
    rgba.putalpha(new_a)
    return rgba


def content_bbox(im: Image.Image) -> tuple[int, int, int, int] | None:
    r, g, b = im.split()
    lum = ImageChops.lighter(ImageChops.lighter(r, g), b)
    mask = lum.point(lambda x: 255 if x > CROP_LUM else 0)
    return mask.getbbox()


def main() -> None:
    src = Image.open(SRC)
    raw_frames: list[Image.Image] = []
    for fr in ImageSequence.Iterator(src):
        raw_frames.append(fr.convert("RGB"))

    union: tuple[int, int, int, int] | None = None
    for fr in raw_frames:
        bb = content_bbox(fr)
        if bb is None:
            continue
        if union is None:
            union = bb
        else:
            union = (
                min(union[0], bb[0]),
                min(union[1], bb[1]),
                max(union[2], bb[2]),
                max(union[3], bb[3]),
            )

    if union is None:
        union = (0, 0, raw_frames[0].width, raw_frames[0].height)

    pad = max(int((union[2] - union[0]) * 0.02), 8)
    x0 = max(union[0] - pad, 0)
    y0 = max(union[1] - pad, 0)
    x1 = min(union[2] + pad, raw_frames[0].width)
    y1 = min(union[3] + pad, raw_frames[0].height)
    crop_box = (x0, y0, x1, y1)

    durations: list[int] = []
    out_frames: list[Image.Image] = []
    default_dur = src.info.get("duration", 40)

    for i, fr in enumerate(ImageSequence.Iterator(src)):
        cropped = fr.crop(crop_box)
        processed = key_dark_to_transparent(cropped)
        if processed.width > TARGET_WIDTH:
            nh = int(processed.height * (TARGET_WIDTH / processed.width))
            processed = processed.resize((TARGET_WIDTH, nh), Image.Resampling.LANCZOS)
        out_frames.append(processed)
        durations.append(fr.info.get("duration", default_dur))

    out_frames[0].save(
        DST,
        save_all=True,
        append_images=out_frames[1:],
        duration=durations,
        loop=src.info.get("loop", 0),
        lossless=False,
        quality=92,
        method=4,
    )
    print(f"OK: {DST} — {len(out_frames)} frames, crop {crop_box}")


if __name__ == "__main__":
    main()
