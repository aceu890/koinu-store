import { unstable_cache } from "next/cache";
import { getStoreProduct, listStoreProducts } from "@/lib/admin-data";
import type { Product } from "@/lib/types";

function hasProductPhoto(product: Product) {
  return Boolean(product.imageUrl?.trim());
}

export async function getProducts(): Promise<Product[]> {
  const products = await listStoreProducts();
  return products
    .filter(hasProductPhoto)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name, "es"));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getStoreProduct(slug)) ?? undefined;
}

export const getFeaturedProducts = unstable_cache(
  async () => {
    const products = (await listStoreProducts()).filter(hasProductPhoto);
    const featured = products.filter((product) => product.featured);
    return (featured.length ? featured : products).slice(0, 9);
  },
  ["featured-products-v1"],
  { revalidate: 60, tags: ["store-products"] },
);
