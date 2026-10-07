import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-ink/50 hover:text-ink">
        ← Productos
      </Link>
      <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Subir producto</h1>
      <p className="mt-2 text-sm text-ink/60">
        Modo básico: foto, nombre, precio y tipo. Si hace falta más, pasá a Avanzado.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
