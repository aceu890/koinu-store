import type { PrintSide, ProductKind } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";

export type ProductPhoto = {
  src: string;
  width: number;
  height: number;
};

export const PRODUCT_PHOTOS: {
  [K in ProductKind]?: Partial<Record<PrintSide, ProductPhoto>>;
} = {
  shirt: {
    front: {
      src: "/producto-base/camisa_frontal.png",
      width: 512,
      height: 469,
    },
    back: {
      src: "/producto-base/camisa_espalda.png",
      width: 512,
      height: 463,
    },
    left: {
      src: "/producto-base/perfil_izquierdo.png",
      width: 512,
      height: 473,
    },
    right: {
      src: "/producto-base/perfil_derecho.png",
      width: 512,
      height: 467,
    },
  },
};

export function getProductPhotoMeta(
  kind: ProductKind,
  view: PrintSide,
): ProductPhoto | null {
  return PRODUCT_PHOTOS[kind]?.[view] ?? null;
}

export function getProductPhoto(kind: ProductKind, view: PrintSide) {
  return getProductPhotoMeta(kind, view)?.src ?? null;
}

export function getProductViews(kind: ProductKind): PrintSide[] {
  const photos = PRODUCT_PHOTOS[kind];
  if (photos) {
    const views = PRINT_SIDES.filter((side) => photos[side]);
    if (views.length) return views;
  }
  if (kind === "shirt" || kind === "hoodie") return ["front", "back"];
  return ["front"];
}

export function hasBackPhoto(kind: ProductKind) {
  return Boolean(PRODUCT_PHOTOS[kind]?.back);
}
