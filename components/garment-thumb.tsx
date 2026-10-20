import { isDarkHex } from "@/lib/color";
import { getProductPhoto, getProductPhotoMeta } from "@/lib/product-photos";
import type { ProductKind } from "@/lib/types";

const MASK = {
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

const DESIGN_SLOT: Record<ProductKind, { left: string; top: string; width: string; height: string }> = {
  shirt: { left: "31%", top: "30%", width: "38%", height: "38%" },
  hoodie: { left: "30%", top: "26%", width: "40%", height: "36%" },
  mug: { left: "42%", top: "26%", width: "38%", height: "42%" },
  tote: { left: "28%", top: "38%", width: "44%", height: "40%" },
  cap: { left: "22%", top: "22%", width: "56%", height: "42%" },
  print3d: { left: "38%", top: "50%", width: "24%", height: "22%" },
};

export function GarmentThumb({
  kind,
  color,
  eager,
  className,
  designSrc,
}: {
  kind: ProductKind;
  color: string;
  eager?: boolean;
  className?: string;
  designSrc?: string;
}) {
  const photo = getProductPhoto(kind, "front");
  const meta = getProductPhotoMeta(kind, "front");
  if (!photo || !meta) return null;

  const mask = {
    ...MASK,
    WebkitMaskImage: `url(${photo})`,
    maskImage: `url(${photo})`,
  };

  return (
    <div
      className={`relative w-full ${className ?? ""}`}
      style={{ aspectRatio: `${meta.width} / ${meta.height}` }}
    >
      <div className="absolute inset-0" style={{ ...mask, backgroundColor: color }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt=""
        width={meta.width}
        height={meta.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : "low"}
        className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
      />
      {designSrc ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={mask}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={designSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className={`absolute object-contain ${isDarkHex(color) ? "mix-blend-soft-light" : "mix-blend-multiply"}`}
            style={DESIGN_SLOT[kind]}
          />
        </div>
      ) : null}
    </div>
  );
}
