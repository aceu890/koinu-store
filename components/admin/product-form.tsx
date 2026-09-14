"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import { slugify } from "@/lib/format";
import { kindLabel } from "@/lib/format";
import type { DesignKey, Product, ProductKind } from "@/lib/types";

const KINDS: ProductKind[] = ["shirt", "hoodie", "mug", "tote", "cap", "print3d"];
const DESIGNS: DesignKey[] = [
  "blank",
  "sakura",
  "koinu",
  "buenos-dias",
  "mercado",
  "studio",
  "pixel",
  "cafe",
  "overprint",
  "ruta",
  "flash",
  "team",
];

type Props = {
  product?: Product;
};

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? "camisetas");
  const [kind, setKind] = useState<ProductKind>(product?.kind ?? "shirt");
  const [design, setDesign] = useState<DesignKey>(product?.design ?? "blank");
  const [colors, setColors] = useState((product?.colors ?? ["#F7F4EF"]).join(", "));
  const [sizes, setSizes] = useState((product?.sizes ?? ["S", "M", "L", "XL"]).join(", "));
  const [featured, setFeatured] = useState(Boolean(product?.featured));
  const [inStock, setInStock] = useState(product?.inStock !== false);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function onName(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: form });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "No se pudo subir");
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      category,
      kind,
      design,
      colors,
      sizes,
      featured,
      inStock,
      imageUrl: imageUrl || null,
    };
    try {
      const response = await fetch(
        product ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; slug?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo guardar");
      router.push("/admin/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4 rounded-3xl border border-ink/10 bg-surface p-6">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Nombre</span>
          <input
            value={name}
            onChange={(event) => onName(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Slug</span>
          <input
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
            required
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Descripción</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
            Precio (ARS)
          </span>
          <input
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Categoría</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3"
            >
              {CATEGORIES.filter((item) => item.slug !== "todos").map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Tipo</span>
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value as ProductKind)}
              className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3"
            >
              {KINDS.map((item) => (
                <option key={item} value={item}>
                  {kindLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
            Mock de diseño (si no hay foto)
          </span>
          <select
            value={design}
            onChange={(event) => setDesign(event.target.value as DesignKey)}
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3"
          >
            {DESIGNS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
            Colores (hex, separados por coma)
          </span>
          <input
            value={colors}
            onChange={(event) => setColors(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
            Talles (separados por coma)
          </span>
          <input
            value={sizes}
            onChange={(event) => setSizes(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-ink/10 bg-surface p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Foto del producto</p>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink/20 px-4 py-8 text-center hover:border-magenta">
            <span className="text-sm font-semibold">
              {uploading ? "Subiendo…" : "Subir imagen"}
            </span>
            <span className="mt-1 text-xs text-ink/45">JPG, PNG o WEBP · máx. 4 MB</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
                event.target.value = "";
              }}
            />
          </label>
          {imageUrl ? (
            <div className="mt-4 overflow-hidden rounded-2xl bg-mock">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="mx-auto max-h-56 object-contain" />
              <button
                type="button"
                className="mt-2 text-xs text-magenta underline"
                onClick={() => setImageUrl("")}
              >
                Quitar foto
              </button>
            </div>
          ) : null}
          <label className="mt-4 block">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/50">
              O URL de imagen
            </span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-ink/10 px-4 py-3 outline-none ring-magenta/30 focus:ring"
            />
          </label>
        </div>

        <div className="rounded-3xl border border-ink/10 bg-surface p-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
            />
            Destacado en inicio
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
            />
            Visible en la tienda
          </label>
        </div>

        {error ? <p className="text-sm text-magenta-dark">{error}</p> : null}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full rounded-full bg-magenta py-3 font-display font-bold text-white disabled:opacity-60"
        >
          {loading ? "Guardando…" : product ? "Guardar cambios" : "Publicar producto"}
        </button>
      </div>
    </form>
  );
}
