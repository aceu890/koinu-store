import { GarmentThumb } from "@/components/garment-thumb";
import type { Product } from "@/lib/types";

export function ProductVisual({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (product.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className={className ?? "h-full w-full object-cover"}
      />
    );
  }

  return (
    <GarmentThumb
      kind={product.kind}
      color={product.colors[0] ?? "#F7F4EF"}
      className={className}
    />
  );
}
