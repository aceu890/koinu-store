import { ProductMock } from "@/components/product-mock";
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
        className={className ?? "h-full w-full object-cover"}
      />
    );
  }

  return (
    <ProductMock kind={product.kind} color={product.colors[0]} design={product.design} />
  );
}
