"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Trash2, Upload } from "lucide-react";
import { ProductMock } from "@/components/product-mock";
import { PrintEditor } from "@/components/print-editor";
import { CUSTOMIZABLE_BASES } from "@/lib/catalog";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, kindLabel, sideLabel, sideTo } from "@/lib/format";
import {
  POSITION_PRESETS,
  SIZE_CHARTS,
  clampPlacement,
  containerAspect,
  fitPlacement,
  formatCm,
  getGarmentMeasures,
  getPrintableArea,
  placementToCm,
} from "@/lib/measurements";
import type { PrintPlacement, PrintPosition, PrintSide, PrintStamp, ProductKind } from "@/lib/types";
import { PRINT_SIDES } from "@/lib/types";
import { getProductViews } from "@/lib/product-photos";

const STEPS = ["Producto", "Color y talle", "Diseño", "Listo"] as const;

const POSITIONS: { value: PrintPosition; label: string; kinds: ProductKind[] }[] = [
  { value: "chest", label: "Pecho", kinds: ["shirt", "hoodie"] },
  { value: "center", label: "Centro", kinds: ["shirt", "hoodie", "tote", "cap", "mug", "print3d"] },
  { value: "back", label: "Espalda", kinds: ["shirt", "hoodie"] },
  { value: "wrap", label: "Envolvente", kinds: ["mug"] },
];

export function CustomizeWizard() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<ProductKind>("shirt");
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>("M");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#16120F");
  const [position, setPosition] = useState<PrintPosition>("center");
  const [view, setView] = useState<PrintSide>("front");
  const [stamps, setStamps] = useState<PrintStamp[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  const base = useMemo(
    () => CUSTOMIZABLE_BASES.find((item) => item.slug === kind)!,
    [kind],
  );
  const color = base.colors[colorIndex] ?? base.colors[0];
  const availablePositions = POSITIONS.filter((item) => item.kinds.includes(kind));
  const measures = getGarmentMeasures(kind, size);
  const selected = stamps.find((stamp) => stamp.id === selectedId) ?? null;
  const sideStamps = stamps.filter((stamp) => stamp.side === view);
  const productViews = getProductViews(kind);
  const sideCounts = Object.fromEntries(
    PRINT_SIDES.map((side) => [side, stamps.filter((stamp) => stamp.side === side).length]),
  ) as Record<PrintSide, number>;
  const printCm = selected
    ? placementToCm(
        selected.placement,
        getPrintableArea(kind, selected.side),
        measures,
        kind,
      )
    : null;

  function makePlacement(
    aspect: number,
    nextKind: ProductKind,
    nextView: PrintSide,
    nextPosition: PrintPosition,
    index: number,
  ): PrintPlacement {
    const preset =
      nextView === "back"
        ? POSITION_PRESETS[nextKind]?.back ?? getPrintableArea(nextKind, "back")
        : nextView === "left" || nextView === "right"
          ? getPrintableArea(nextKind, nextView)
          : (POSITION_PRESETS[nextKind]?.[nextPosition] ?? getPrintableArea(nextKind, "front"));
    const fitted = fitPlacement(aspect, preset, containerAspect(nextKind, nextView));
    return clampPlacement(
      {
        ...fitted,
        x: fitted.x + index * 4,
        y: fitted.y + index * 4,
      },
      getPrintableArea(nextKind, nextView),
      aspect,
      containerAspect(nextKind, nextView),
    );
  }

  function pickKind(next: ProductKind) {
    const nextBase = CUSTOMIZABLE_BASES.find((item) => item.slug === next)!;
    setKind(next);
    setColorIndex(0);
    setSize(nextBase.sizes[0] ?? null);
    const nextPosition =
      POSITIONS.find((item) => item.kinds.includes(next))?.value ?? "center";
    setPosition(nextPosition);
    setView("front");
    setStamps([]);
    setSelectedId(null);
    setStep(1);
  }

  function selectView(nextView: PrintSide) {
    setView(nextView);
    if (nextView === "back") {
      setPosition("back");
    } else if (position === "back") {
      setPosition("center");
    }
    const first = stamps.find((stamp) => stamp.side === nextView);
    setSelectedId(first?.id ?? null);
  }

  function selectPosition(next: PrintPosition) {
    if (next === "back") {
      selectView("back");
      return;
    }
    setView("front");
    setPosition(next);
    const target =
      selected?.side === "front"
        ? selected
        : stamps.find((stamp) => stamp.side === "front");
    if (!target) return;
    const aspect = target.widthPx / target.heightPx;
    updateStampPlacement(target.id, makePlacement(aspect, kind, "front", next, 0));
  }

  function readImage(file: File) {
    return new Promise<{
      url: string;
      width: number;
      height: number;
    } | null>((resolve) => {
      if (file.size > 8 * 1024 * 1024) {
        setError("Cada imagen debe pesar menos de 8 MB.");
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const url = typeof reader.result === "string" ? reader.result : null;
        if (!url) {
          resolve(null);
          return;
        }
        const image = new Image();
        image.onload = () =>
          resolve({
            url,
            width: image.naturalWidth,
            height: image.naturalHeight,
          });
        image.onerror = () => resolve(null);
        image.src = url;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(fileList: FileList | File[] | null) {
    if (!fileList?.length) return;
    const targetView = view;
    const targetKind = kind;
    const targetPosition = position;
    const files = Array.from(fileList).slice(0, 6);
    const loaded = (await Promise.all(files.map(readImage))).filter(
      (item): item is { url: string; width: number; height: number } => Boolean(item),
    );
    if (!loaded.length) return;

    const onSide = stamps.filter((stamp) => stamp.side === targetView).length;
    if (onSide >= 6) {
      setError("Máximo 6 imágenes por cara.");
      return;
    }
    const room = 6 - onSide;
    const added = loaded.slice(0, room).map((image, index) => ({
      id: crypto.randomUUID(),
      side: targetView,
      artworkDataUrl: image.url,
      widthPx: image.width,
      heightPx: image.height,
      placement: makePlacement(
        image.width / image.height,
        targetKind,
        targetView,
        targetPosition,
        onSide + index,
      ),
    }));
    setStamps((current) => {
      const liveCount = current.filter((stamp) => stamp.side === targetView).length;
      if (liveCount >= 6) return current;
      return [...current, ...added];
    });
    const last = added.at(-1);
    if (last) setSelectedId(last.id);
    setError("");
  }

  function removeStamp(id: string) {
    setStamps((current) => {
      const next = current.filter((stamp) => stamp.id !== id);
      if (selectedId === id) {
        const sameSide = next.find((stamp) => stamp.side === view);
        setSelectedId(sameSide?.id ?? next[0]?.id ?? null);
      }
      return next;
    });
  }

  function clearSide() {
    setStamps((current) => {
      const next = current.filter((stamp) => stamp.side !== view);
      const sameSideGone = selected?.side === view;
      if (sameSideGone) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  function updateStampPlacement(id: string, placement: PrintPlacement) {
    setStamps((current) =>
      current.map((stamp) => (stamp.id === id ? { ...stamp, placement } : stamp)),
    );
  }

  function nextStep() {
    if (step === 2 && !text.trim() && !stamps.length) {
      setError("Subí un diseño o escribí un texto para estampar.");
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }

  function addToCart() {
    if (!text.trim() && !stamps.length) {
      setError("Subí un diseño o escribí un texto para estampar.");
      setStep(2);
      return;
    }

    const first = selected ?? stamps[0];
    const printSides = PRINT_SIDES.filter((side) =>
      stamps.some((stamp) => stamp.side === side),
    );

    addItem({
      kind: "custom",
      name: `${base.name} personalizada`,
      unitPrice: base.basePrice,
      quantity: qty,
      productKind: kind,
      color: color.hex,
      colorName: color.name,
      size,
      custom: {
        kind,
        color: color.hex,
        colorName: color.name,
        size,
        text: text.trim(),
        textColor,
        position: view === "back" ? "back" : position,
        artworkDataUrl: first?.artworkDataUrl ?? null,
        placement: first?.placement,
        placementFront: stamps.find((stamp) => stamp.side === "front")?.placement,
        placementBack: stamps.find((stamp) => stamp.side === "back")?.placement,
        placementLeft: stamps.find((stamp) => stamp.side === "left")?.placement,
        placementRight: stamps.find((stamp) => stamp.side === "right")?.placement,
        printSides,
        stamps,
        artworkWidthPx: first?.widthPx,
        artworkHeightPx: first?.heightPx,
        printWidthCm: printCm?.widthCm,
        printHeightCm: printCm?.heightCm,
      },
    });
    router.push("/carrito");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-ink/10 bg-surface/70 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-2">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`flex-1 rounded-full px-2 py-2 text-[11px] font-semibold uppercase tracking-wider ${
                index === step
                  ? "bg-ink text-paper"
                  : index < step
                    ? "bg-magenta/15 text-magenta"
                    : "bg-ink/5 text-ink/40"
              }`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 ? (
          <div>
            <h2 className="font-display text-2xl font-bold">¿Qué querés personalizar?</h2>
            <p className="mt-1 text-sm text-ink/60">Elegí la base. Después sumamos color, talle y diseño.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CUSTOMIZABLE_BASES.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => pickKind(item.slug)}
                  className={`flex gap-3 rounded-2xl border p-3 text-left transition hover:border-magenta ${
                    kind === item.slug ? "border-magenta bg-magenta/5" : "border-ink/10"
                  }`}
                >
                  <div className="h-20 w-16 shrink-0">
                    <ProductMock kind={item.slug} color={item.colors[0].hex} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold">{item.name}</p>
                    <p className="mt-1 text-sm text-ink/60">{item.description}</p>
                    <p className="mt-2 text-sm font-semibold">desde {formatPrice(item.basePrice)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="font-display text-2xl font-bold">Color y talle</h2>
            <p className="mt-1 text-sm text-ink/60">{base.name} · {formatPrice(base.basePrice)}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {base.colors.map((item, index) => (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() => setColorIndex(index)}
                  className={`h-9 w-9 rounded-full border-2 ${
                    colorIndex === index ? "border-ink scale-110" : "border-white"
                  }`}
                  style={{ background: item.hex }}
                  aria-label={item.name}
                />
              ))}
            </div>
            <p className="mt-2 text-sm">{color.name}</p>
            {base.sizes.length ? (
              <>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">Talle</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {base.sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`min-w-12 rounded-full border px-3 py-2 text-sm font-semibold ${
                        size === item ? "border-ink bg-ink text-paper" : "border-ink/15"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-ink/5 text-[11px] uppercase tracking-wider text-ink/50">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Talle</th>
                        <th className="px-3 py-2 font-semibold">Ancho</th>
                        <th className="px-3 py-2 font-semibold">Largo</th>
                        <th className="px-3 py-2 font-semibold">Estampa máx.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHARTS[kind].map((row) => (
                        <tr
                          key={row.size}
                          className={row.size === measures.size ? "bg-magenta/10 font-semibold" : ""}
                        >
                          <td className="px-3 py-2">{row.size}</td>
                          <td className="px-3 py-2">{formatCm(row.widthCm)}</td>
                          <td className="px-3 py-2">{formatCm(row.lengthCm)}</td>
                          <td className="px-3 py-2">
                            {formatCm(row.printWidthCm)} × {formatCm(row.printHeightCm).replace(" cm", "")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-ink/50">
                  Ancho y largo de la prenda tendida. El área de estampa es el máximo recomendado al frente.
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm text-ink/60">Este producto no lleva talle.</p>
            )}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="font-display text-2xl font-bold">Tu diseño</h2>
            <p className="mt-1 text-sm text-ink/60">
              {productViews.length > 2
                ? "Frente, espalda y perfiles usan fotos distintas. Podés sumar varias imágenes en cada cara y moverlas por separado."
                : "Frente y espalda usan fotos distintas. Podés sumar varias imágenes en cada cara y moverlas por separado."}
            </p>
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-ink/25 bg-paper/60 px-4 py-8 text-center hover:border-magenta">
              <Upload className="h-6 w-6 text-magenta" />
              <span className="mt-2 text-sm font-semibold">
                Agregar imagen a {sideTo(view)}
              </span>
              <span className="mt-1 text-xs text-ink/50">PNG, JPG o WEBP · varias a la vez · máx. 8 MB c/u</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                className="hidden"
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>

            {sideStamps.length ? (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50">
                    {sideLabel(view)} · {sideStamps.length}{" "}
                    {sideStamps.length === 1 ? "imagen" : "imágenes"}
                  </p>
                  <button
                    type="button"
                    className="text-xs text-magenta underline"
                    onClick={clearSide}
                  >
                    Quitar todas de esta cara
                  </button>
                </div>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sideStamps.map((stamp, index) => (
                    <li key={stamp.id} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedId(stamp.id)}
                        className={`block h-16 w-16 overflow-hidden rounded-xl border-2 ${
                          selectedId === stamp.id ? "border-ink" : "border-ink/10"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={stamp.artworkDataUrl}
                          alt={`Imagen ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <button
                        type="button"
                        aria-label="Quitar imagen"
                        onClick={() => removeStamp(stamp.id)}
                        className="absolute -right-1 -top-1 rounded-full bg-ink p-1 text-paper"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-ink/50">
              Texto para estampar
            </label>
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={48}
              placeholder="Ej: Feliz cumple, Vale"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 outline-none ring-magenta/30 focus:ring"
            />
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm">Color del texto</label>
              <input
                type="color"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                className="h-9 w-12 cursor-pointer rounded border border-ink/10"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">
              Cara a estampar
            </p>
            {productViews.length > 1 ? (
              <div
                className={`mt-2 grid gap-2 ${productViews.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}
              >
                {productViews.map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => selectView(side)}
                    className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                      view === side ? "border-ink bg-ink text-paper" : "border-ink/15"
                    }`}
                  >
                    {sideLabel(side)}
                    {stamps.some((stamp) => stamp.side === side) ? " · ✓" : ""}
                  </button>
                ))}
              </div>
            ) : null}

            {view === "front" && (kind === "shirt" || kind === "hoodie") ? (
              <>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">
                  Atajo en el frente
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availablePositions
                    .filter((item) => item.value !== "back")
                    .map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => selectPosition(item.value)}
                        className={`rounded-full border px-3 py-2 text-sm ${
                          position === item.value ? "border-ink bg-ink text-paper" : "border-ink/15"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                </div>
              </>
            ) : null}

            <p className="mt-2 text-xs text-ink/50">
              {view === "front"
                ? "Arrastrá cada imagen y usá las esquinas para el tamaño. Después pasá a otra cara para estamparla."
                : `Estás viendo ${sideTo(view)}. Las fotos de las otras caras no se copian: subí las de esta cara.`}
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="font-display text-2xl font-bold">Revisá y agregá al carrito</h2>
            <ul className="mt-4 space-y-1 text-sm text-ink/80">
              <li>{kindLabel(kind)} · {color.name}{size ? ` · talle ${size}` : ""}</li>
              <li>
                Prenda: {formatCm(measures.widthCm)} ancho × {formatCm(measures.lengthCm).replace(" cm", "")} largo
              </li>
              <li>
                {productViews.map((side, index) => (
                  <span key={side}>
                    {index ? " · " : ""}
                    {sideLabel(side)}:{" "}
                    {sideCounts[side]
                      ? `${sideCounts[side]} ${sideCounts[side] === 1 ? "imagen" : "imágenes"}`
                      : "sin estampa"}
                  </span>
                ))}
              </li>
              <li>
                {printCm && selected
                  ? `Seleccionada (${sideLabel(selected.side).toLowerCase()}): ${formatCm(printCm.widthCm)} × ${formatCm(printCm.heightCm).replace(" cm", "")}`
                  : availablePositions.find((item) => item.value === position)?.label}
              </li>
              {selected ? (
                <li>
                  Archivo: {selected.widthPx} × {selected.heightPx} px
                </li>
              ) : null}
              <li>
                {text.trim()
                  ? `Texto: “${text.trim()}”`
                  : stamps.length
                    ? "Sin texto extra"
                    : "Sin imagen"}
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-sm">Cantidad</span>
              <input
                type="number"
                min={1}
                max={20}
                value={qty}
                onChange={(event) => setQty(Number(event.target.value) || 1)}
                className="w-20 rounded-xl border border-ink/10 px-3 py-2"
              />
            </div>
            <p className="mt-4 font-display text-3xl font-bold">
              {formatPrice(base.basePrice * qty)}
            </p>
            <button
              type="button"
              onClick={addToCart}
              className="btn-personaliza mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 font-display text-lg font-bold text-white hover:bg-magenta-dark"
            >
              <Sparkles className="h-5 w-5" />
              Agregar al carrito
            </button>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-magenta-dark">{error}</p> : null}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-4 py-2 text-sm disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-[2rem] bg-[linear-gradient(180deg,#1a1410,#2a211c)] p-5 text-on-panel lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-[0.25em] text-amber">Vista previa</p>
        <h3 className="mt-1 font-display text-2xl font-bold">{base.name} a tu medida</h3>
        <p className="mt-1 text-sm text-amber">
          {kind === "shirt" || kind === "hoodie"
            ? `Área imprimible: toda la prenda · ${formatCm(measures.widthCm)} × ${formatCm(measures.lengthCm).replace(" cm", "")}`
            : `Área imprimible ${formatCm(measures.printWidthCm)} × ${formatCm(measures.printHeightCm).replace(" cm", "")}`}
        </p>
        <div className="mt-4">
          <PrintEditor
            kind={kind}
            color={color.hex}
            size={size}
            position={position}
            view={view}
            onViewChange={selectView}
            stamps={stamps}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onStampPlacement={updateStampPlacement}
            text={text}
            textColor={textColor}
          />
        </div>
        <p className="mt-4 text-center text-sm text-on-panel/60">
          Arrastrá cada imagen y estirá las esquinas.{" "}
          {productViews.length > 2
            ? "Frente, espalda y perfiles son fotos distintas."
            : "Frente y espalda son fotos distintas."}
        </p>
      </div>
    </div>
  );
}
