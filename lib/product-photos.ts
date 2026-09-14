import type { ProductKind } from "@/lib/types";

export type ProductPhoto = {
  src: string;
  width: number;
  height: number;
};

export const PRODUCT_PHOTOS: {
  [K in ProductKind]?: { front?: ProductPhoto; back?: ProductPhoto };
} = {
  shirt: {
    front: {
      src: "/producto-base/camiseta-frontal.png",
      width: 1000,
      height: 1000,
    },
    back: {
      src: "/producto-base/camiseta-espalda.png",
      width: 1246,
      height: 1591,
    },
  },
};

export function getProductPhotoMeta(
  kind: ProductKind,
  view: "front" | "back",
): ProductPhoto | null {
  return PRODUCT_PHOTOS[kind]?.[view] ?? null;
}

export function getProductPhoto(kind: ProductKind, view: "front" | "back") {
  return getProductPhotoMeta(kind, view)?.src ?? null;
}

export function hasBackPhoto(kind: ProductKind) {
  return Boolean(PRODUCT_PHOTOS[kind]?.back);
}
