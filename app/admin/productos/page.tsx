import Link from "next/link";
import { listStoreProducts } from "@/lib/admin-data";
import { formatPrice, kindLabel } from "@/lib/format";
import { ProductVisual } from "@/components/product-visual";

export default async function AdminProductsPage() {
  const products = await listStoreProducts({ includeHidden: true });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Catálogo</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-white"
        >
          Subir producto
        </Link>
      </div>

      {!products.length ? (
        <p className="mt-8 text-sm text-ink/55">Todavía no hay productos.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/productos/${product.id}`}
                className="block overflow-hidden rounded-3xl border border-ink/10 bg-surface hover:border-magenta"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-mock p-4">
                  {product.imageUrl ? (
                    <ProductVisual product={product} className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-[70%]">
                      <ProductVisual product={product} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-wider text-ink/40">
                    {kindLabel(product.kind)} · {product.category}
                  </p>
                  <h2 className="mt-1 font-display font-bold">{product.name}</h2>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="font-semibold">{formatPrice(product.price)}</span>
                    <span className={product.inStock === false ? "text-ink/40" : "text-teal"}>
                      {product.inStock === false ? "Oculto" : "Visible"}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
