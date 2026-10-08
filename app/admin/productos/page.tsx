import Link from "next/link";
import { listStoreProducts } from "@/lib/admin-data";
import { formatPrice, kindLabel } from "@/lib/format";
import { ProductVisual } from "@/components/product-visual";

export default async function AdminProductsPage() {
  const products = await listStoreProducts({ includeHidden: true });

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink/45">Catálogo</p>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="grid h-11 w-full place-items-center rounded-full bg-magenta px-5 text-sm font-semibold text-white sm:h-auto sm:w-auto sm:py-2.5"
        >
          Subir producto
        </Link>
      </div>

      {!products.length ? (
        <p className="mt-8 text-sm text-ink/55">Todavía no hay productos.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/admin/productos/${product.id}`}
                className="block overflow-hidden rounded-xl border border-ink/10 bg-surface transition hover:border-magenta sm:rounded-2xl"
              >
                <div className="flex aspect-square items-center justify-center bg-mock p-2 sm:p-3">
                  {product.imageUrl ? (
                    <ProductVisual product={product} className="h-full w-full object-cover" />
                  ) : (
                    <div className="w-[72%]">
                      <ProductVisual product={product} />
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3">
                  <p className="truncate text-[9px] uppercase tracking-wider text-ink/40 sm:text-[10px]">
                    {kindLabel(product.kind)}
                  </p>
                  <h2 className="mt-0.5 truncate font-display text-xs font-bold leading-tight sm:text-sm">
                    {product.name}
                  </h2>
                  <div className="mt-1.5 flex items-center justify-between gap-1 text-[11px] sm:text-sm">
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
