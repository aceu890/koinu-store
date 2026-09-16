import { getProductPhotoMeta } from "@/lib/product-photos";
import type { PrintPlacement, PrintPosition, PrintSide, ProductKind } from "@/lib/types";

export type { PrintPlacement };

export type RectPct = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type GarmentMeasures = {
  size: string;
  widthCm: number;
  lengthCm: number;
  printWidthCm: number;
  printHeightCm: number;
};

export const SIZE_CHARTS: Record<ProductKind, GarmentMeasures[]> = {
  shirt: [
    { size: "S", widthCm: 46, lengthCm: 68, printWidthCm: 25, printHeightCm: 32 },
    { size: "M", widthCm: 51, lengthCm: 71, printWidthCm: 28, printHeightCm: 36 },
    { size: "L", widthCm: 56, lengthCm: 74, printWidthCm: 30, printHeightCm: 38 },
    { size: "XL", widthCm: 61, lengthCm: 77, printWidthCm: 32, printHeightCm: 40 },
    { size: "XXL", widthCm: 66, lengthCm: 80, printWidthCm: 34, printHeightCm: 42 },
  ],
  hoodie: [
    { size: "S", widthCm: 54, lengthCm: 68, printWidthCm: 26, printHeightCm: 30 },
    { size: "M", widthCm: 58, lengthCm: 71, printWidthCm: 28, printHeightCm: 32 },
    { size: "L", widthCm: 62, lengthCm: 74, printWidthCm: 30, printHeightCm: 34 },
    { size: "XL", widthCm: 66, lengthCm: 77, printWidthCm: 32, printHeightCm: 36 },
    { size: "XXL", widthCm: 70, lengthCm: 80, printWidthCm: 34, printHeightCm: 38 },
  ],
  mug: [
    { size: "Única", widthCm: 8.2, lengthCm: 9.5, printWidthCm: 21, printHeightCm: 9 },
  ],
  tote: [
    { size: "Única", widthCm: 38, lengthCm: 42, printWidthCm: 30, printHeightCm: 32 },
  ],
  cap: [
    { size: "Única", widthCm: 18, lengthCm: 12, printWidthCm: 10, printHeightCm: 6 },
  ],
  print3d: [
    { size: "Mini", widthCm: 6, lengthCm: 8, printWidthCm: 5, printHeightCm: 6 },
    { size: "Mediano", widthCm: 10, lengthCm: 14, printWidthCm: 8, printHeightCm: 10 },
    { size: "Grande", widthCm: 16, lengthCm: 22, printWidthCm: 12, printHeightCm: 16 },
  ],
};

export const PRINTABLE_AREA: Record<ProductKind, RectPct> = {
  shirt: { left: 4, top: 3, width: 92, height: 95 },
  hoodie: { left: 6, top: 4, width: 88, height: 94 },
  mug: { left: 38, top: 22, width: 50, height: 58 },
  tote: { left: 24, top: 38, width: 52, height: 54 },
  cap: { left: 30, top: 32, width: 40, height: 26 },
  print3d: { left: 36, top: 56, width: 28, height: 22 },
};

export const PRINTABLE_AREA_BACK: Partial<Record<ProductKind, RectPct>> = {
  shirt: { left: 4, top: 2, width: 92, height: 96 },
  hoodie: { left: 6, top: 4, width: 88, height: 94 },
};

export const PRINTABLE_AREA_LEFT: Partial<Record<ProductKind, RectPct>> = {
  shirt: { left: 10, top: 4, width: 80, height: 94 },
  hoodie: { left: 8, top: 4, width: 84, height: 94 },
};

export const PRINTABLE_AREA_RIGHT: Partial<Record<ProductKind, RectPct>> = {
  shirt: { left: 10, top: 4, width: 80, height: 94 },
  hoodie: { left: 8, top: 4, width: 84, height: 94 },
};

export function getPrintableArea(
  kind: ProductKind,
  view: PrintSide = "front",
): RectPct {
  if (view === "back") return PRINTABLE_AREA_BACK[kind] ?? PRINTABLE_AREA[kind];
  if (view === "left") return PRINTABLE_AREA_LEFT[kind] ?? PRINTABLE_AREA[kind];
  if (view === "right") return PRINTABLE_AREA_RIGHT[kind] ?? PRINTABLE_AREA[kind];
  return PRINTABLE_AREA[kind];
}

export const POSITION_PRESETS: Record<
  ProductKind,
  Partial<Record<PrintPosition, RectPct>>
> = {
  shirt: {
    chest: { left: 33, top: 31.5, width: 34, height: 20 },
    center: { left: 31, top: 36, width: 38, height: 42 },
    back: { left: 24, top: 26, width: 50, height: 52 },
  },
  hoodie: {
    chest: { left: 35, top: 24, width: 30, height: 18 },
    center: { left: 28, top: 22, width: 44, height: 40 },
    back: { left: 22, top: 28, width: 56, height: 50 },
  },
  mug: {
    center: { left: 42, top: 26, width: 38, height: 42 },
    wrap: { left: 38, top: 22, width: 50, height: 56 },
  },
  tote: {
    center: { left: 28, top: 42, width: 44, height: 40 },
  },
  cap: {
    center: { left: 34, top: 34, width: 32, height: 22 },
    chest: { left: 36, top: 36, width: 28, height: 18 },
  },
  print3d: {
    center: { left: 38, top: 58, width: 24, height: 18 },
  },
};

export function getGarmentMeasures(kind: ProductKind, size: string | null) {
  const chart = SIZE_CHARTS[kind];
  return chart.find((row) => row.size === size) ?? chart[0];
}

export function containerAspect(
  kind: ProductKind,
  view: PrintSide = "front",
) {
  const photo = getProductPhotoMeta(kind, view);
  if (photo) return photo.width / photo.height;
  return 7 / 8;
}

export function heightFromWidth(
  widthPct: number,
  imageAspect: number,
  stageAspect: number,
) {
  return (widthPct / imageAspect) * stageAspect;
}

export function widthFromHeight(
  heightPct: number,
  imageAspect: number,
  stageAspect: number,
) {
  return (heightPct * imageAspect) / stageAspect;
}

export function fitPlacement(
  imageAspect: number,
  area: RectPct,
  stageAspect: number,
): PrintPlacement {
  let width = area.width * 0.58;
  let height = heightFromWidth(width, imageAspect, stageAspect);

  if (height > area.height * 0.72) {
    height = area.height * 0.72;
    width = widthFromHeight(height, imageAspect, stageAspect);
  }

  return {
    x: area.left + (area.width - width) / 2,
    y: area.top + (area.height - height) / 2,
    width,
    height,
  };
}

export function clampPlacement(
  placement: PrintPlacement,
  area: RectPct,
  imageAspect: number,
  stageAspect: number,
): PrintPlacement {
  const minWidth = Math.min(8, area.width);
  let width = Math.min(Math.max(placement.width, minWidth), area.width);
  let height = heightFromWidth(width, imageAspect, stageAspect);

  if (height > area.height) {
    height = area.height;
    width = widthFromHeight(height, imageAspect, stageAspect);
  }

  const x = Math.min(
    Math.max(placement.x, area.left),
    area.left + area.width - width,
  );
  const y = Math.min(
    Math.max(placement.y, area.top),
    area.top + area.height - height,
  );

  return { x, y, width, height };
}

export function clampBox(placement: PrintPlacement, area: RectPct): PrintPlacement {
  const width = Math.min(Math.max(placement.width, 8), area.width);
  const height = Math.min(Math.max(placement.height, 5), area.height);
  const x = Math.min(
    Math.max(placement.x, area.left),
    area.left + area.width - width,
  );
  const y = Math.min(
    Math.max(placement.y, area.top),
    area.top + area.height - height,
  );
  return { x, y, width, height };
}

export function defaultTextPlacement(kind: ProductKind, view: PrintSide = "front"): PrintPlacement {
  const area = getPrintableArea(kind, view);
  return {
    x: area.left + area.width * 0.12,
    y: area.top + area.height * 0.36,
    width: area.width * 0.76,
    height: area.height * 0.16,
  };
}

export function placementToCm(
  placement: PrintPlacement,
  area: RectPct,
  measures: GarmentMeasures,
  kind?: ProductKind,
) {
  const refW = kind === "shirt" || kind === "hoodie" ? measures.widthCm : measures.printWidthCm;
  const refH = kind === "shirt" || kind === "hoodie" ? measures.lengthCm : measures.printHeightCm;
  const widthCm = (placement.width / area.width) * refW;
  const heightCm = (placement.height / area.height) * refH;
  return {
    widthCm: Math.round(widthCm * 10) / 10,
    heightCm: Math.round(heightCm * 10) / 10,
  };
}

export function printDpi(px: number, cm: number) {
  if (cm <= 0) return 0;
  return Math.round(px / (cm / 2.54));
}

export function formatCm(value: number) {
  return `${value.toFixed(1).replace(".", ",")} cm`;
}
