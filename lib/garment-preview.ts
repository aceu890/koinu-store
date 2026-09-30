import { isDarkHex } from "@/lib/color";
import { compressImageSrc, loadHtmlImage } from "@/lib/image-client";
import { getPrintFont } from "@/lib/print-fonts";
import { getProductPhotoMeta } from "@/lib/product-photos";
import type { PrintPlacement, PrintSide, PrintStamp, ProductKind } from "@/lib/types";

function objectContain(
  boxW: number,
  boxH: number,
  imageW: number,
  imageH: number,
) {
  const boxAspect = boxW / boxH;
  const imageAspect = imageW / imageH;
  if (imageAspect > boxAspect) {
    const height = boxW / imageAspect;
    return { width: boxW, height, x: 0, y: (boxH - height) / 2 };
  }
  const width = boxH * imageAspect;
  return { width, height: boxH, x: (boxW - width) / 2, y: 0 };
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let current = words[0];
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (ctx.measureText(next).width <= maxWidth) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);
  return lines;
}

function drawTextInBox(
  ctx: CanvasRenderingContext2D,
  text: string,
  box: PrintPlacement,
  canvasW: number,
  canvasH: number,
  color: string,
  fontKey?: string,
) {
  const font = getPrintFont(fontKey);
  const x = (box.x / 100) * canvasW;
  const y = (box.y / 100) * canvasH;
  const w = (box.width / 100) * canvasW;
  const h = (box.height / 100) * canvasH;
  let size = Math.max(12, h * 0.72);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${font.weight} ${size}px sans-serif`;
  let lines = wrapText(ctx, text, w * 0.94);
  while (size > 12 && (lines.length * size * 0.95 > h || lines.some((line) => ctx.measureText(line).width > w))) {
    size -= 2;
    ctx.font = `${font.weight} ${size}px sans-serif`;
    lines = wrapText(ctx, text, w * 0.94);
  }
  const startY = y + h / 2 - ((lines.length - 1) * size * 0.95) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, x + w / 2, startY + index * size * 0.95, w);
  });
}

export async function captureGarmentPreview(options: {
  kind: ProductKind;
  color: string;
  view: PrintSide;
  stamps: PrintStamp[];
  text: string;
  textColor: string;
  textFont?: string;
  textPlacement?: PrintPlacement | null;
}) {
  const meta = getProductPhotoMeta(options.kind, options.view);
  if (!meta) return null;

  const photo = await loadHtmlImage(meta.src);
  const maxEdge = 720;
  const scale = Math.min(1, maxEdge / Math.max(photo.naturalWidth, photo.naturalHeight));
  const width = Math.max(1, Math.round(photo.naturalWidth * scale));
  const height = Math.max(1, Math.round(photo.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#1c1815";
  ctx.fillRect(0, 0, width, height);

  const garment = document.createElement("canvas");
  garment.width = width;
  garment.height = height;
  const gtx = garment.getContext("2d");
  if (!gtx) return null;

  gtx.fillStyle = options.color;
  gtx.fillRect(0, 0, width, height);
  gtx.globalCompositeOperation = "destination-in";
  gtx.drawImage(photo, 0, 0, width, height);
  gtx.globalCompositeOperation = "multiply";
  gtx.drawImage(photo, 0, 0, width, height);
  gtx.globalCompositeOperation = "source-over";

  const dark = isDarkHex(options.color);
  const sideStamps = options.stamps.filter((stamp) => stamp.side === options.view);
  for (const stamp of sideStamps) {
    try {
      const art = await loadHtmlImage(stamp.artworkDataUrl);
      const boxW = (stamp.placement.width / 100) * width;
      const boxH = (stamp.placement.height / 100) * height;
      const boxX = (stamp.placement.x / 100) * width;
      const boxY = (stamp.placement.y / 100) * height;
      const fitted = objectContain(boxW, boxH, art.naturalWidth, art.naturalHeight);
      gtx.save();
      gtx.translate(boxX + boxW / 2, boxY + boxH / 2);
      gtx.rotate(((stamp.rotation ?? 0) * Math.PI) / 180);
      gtx.globalCompositeOperation = dark ? "soft-light" : "multiply";
      gtx.drawImage(art, fitted.x - boxW / 2, fitted.y - boxH / 2, fitted.width, fitted.height);
      gtx.restore();
    } catch {
      // skip a stamp that fails to load
    }
  }

  if (options.text.trim() && options.textPlacement) {
    gtx.globalCompositeOperation = "source-over";
    drawTextInBox(
      gtx,
      options.text.trim(),
      options.textPlacement,
      width,
      height,
      options.textColor,
      options.textFont,
    );
  }

  gtx.globalCompositeOperation = "destination-in";
  gtx.drawImage(photo, 0, 0, width, height);
  ctx.drawImage(garment, 0, 0);

  const raw = canvas.toDataURL("image/jpeg", 0.84);
  const compressed = await compressImageSrc(raw, 720, 0.82);
  return compressed.url;
}

export async function captureDesignPreviews(options: {
  kind: ProductKind;
  color: string;
  sides: PrintSide[];
  stamps: PrintStamp[];
  text: string;
  textColor: string;
  textFont?: string;
  textPlacements?: Partial<Record<PrintSide, PrintPlacement>>;
}) {
  const previewBySide: Partial<Record<PrintSide, string>> = {};
  for (const view of options.sides) {
    const url = await captureGarmentPreview({
      kind: options.kind,
      color: options.color,
      view,
      stamps: options.stamps,
      text: options.text,
      textColor: options.textColor,
      textFont: options.textFont,
      textPlacement: options.textPlacements?.[view] ?? null,
    });
    if (url) previewBySide[view] = url;
  }
  return previewBySide;
}
