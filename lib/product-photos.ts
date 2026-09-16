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
  hoodie: {
    front: {
      src: "/producto-base/poleron-frente.png",
      width: 356,
      height: 422,
    },
    back: {
      src: "/producto-base/poleron-espalda.png",
      width: 346,
      height: 407,
    },
    left: {
      src: "/producto-base/poleron-perfil-izquierdo.png",
      width: 208,
      height: 375,
    },
    right: {
      src: "/producto-base/poleron-perfil-derecho.png",
      width: 206,
      height: 387,
    },
  },
  mug: {
    front: {
      src: "/producto-base/taza.png",
      width: 500,
      height: 500,
    },
  },
  tote: {
    front: {
      src: "/producto-base/bolsa.png",
      width: 570,
      height: 570,
    },
  },
  cap: {
    front: {
      src: "/producto-base/gorra.png",
      width: 1200,
      height: 1200,
    },
  },
  print3d: {
    front: {
      src: "/producto-base/3d.png",
      width: 900,
      height: 900,
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

export function getPhotoAspect(kind: ProductKind, view: PrintSide) {
  const photo = getProductPhotoMeta(kind, view);
  return photo ? photo.width / photo.height : 7 / 8;
}

export function getPreviewFrameAspect(kind: ProductKind) {
  const photos = PRODUCT_PHOTOS[kind];
  if (!photos) return 7 / 8;
  const aspects = PRINT_SIDES.map((side) => photos[side])
    .filter((photo): photo is ProductPhoto => Boolean(photo))
    .map((photo) => photo.width / photo.height);
  if (!aspects.length) return 7 / 8;
  return Math.max(...aspects);
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
