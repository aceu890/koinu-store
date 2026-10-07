"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Sparkles, Trash2, Type, Upload } from "lucide-react";
import { ProductMock } from "@/components/product-mock";
import { PrintEditor } from "@/components/print-editor";
import { StickerPicker } from "@/components/sticker-picker";
import { CUSTOMIZABLE_BASES } from "@/lib/catalog";
import { captureDesignPreviews } from "@/lib/garment-preview";
import { compressImageSrc, loadHtmlImage } from "@/lib/image-client";
import type { LibrarySticker } from "@/lib/sticker-library";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice, kindLabel, sideLabel, sideTo } from "@/lib/format";
import { PRINT_FONT_GROUPS, PRINT_FONTS, printFontLabel, printFontStyle } from "@/lib/print-fonts";
import {
  POSITION_PRESETS,
  SIZE_CHARTS,
  clampPlacement,
  containerAspect,
  defaultTextPlacement,
  fitPlacement,
  formatCm,
  getGarmentMeasures,
  getPrintableArea,
  heightFromWidth,
  placementToCm,
  widthFromHeight,
} from "@/lib/measurements";
import type { PrintPlacement, PrintPosition, PrintSide, PrintStamp, ProductKind } from "@/lib/types";
import { PRINT_SIDES, TEXT_LAYER_ID } from "@/lib/types";
import { getProductViews } from "@/lib/product-photos";

const STEPS = ["Producto", "Color y talla", "Diseño", "Listo"] as const;

const POSITIONS: { value: PrintPosition; label: string; kinds: ProductKind[] }[] = [
  { value: "chest", label: "Pecho", kinds: ["shirt", "hoodie"] },
  { value: "center", label: "Centro", kinds: ["shirt", "hoodie", "tote", "cap", "mug", "print3d"] },
  { value: "back", label: "Espalda", kinds: ["shirt", "hoodie"] },
  { value: "wrap", label: "Envolvente", kinds: ["mug"] },
];

export function CustomizeWizard() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [stickerGhost, setStickerGhost] = useState<{
    sticker: LibrarySticker;
    x: number;
    y: number;
  } | null>(null);
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<ProductKind>("shirt");
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>("M");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#16120F");
  const [textFont, setTextFont] = useState("syne");
  const [textPlacements, setTextPlacements] = useState<Partial<Record<PrintSide, PrintPlacement>>>({});
  const [position, setPosition] = useState<PrintPosition>("center");
  const [view, setView] = useState<PrintSide>("front");
  const [stamps, setStamps] = useState<PrintStamp[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const base = useMemo(
    () => CUSTOMIZABLE_BASES.find((item) => item.slug === kind)!,
    [kind],
  );
  const color = base.colors[colorIndex] ?? base.colors[0];
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
    if (next === kind) return;
    const nextBase = CUSTOMIZABLE_BASES.find((item) => item.slug === next)!;
    setKind(next);
    setColorIndex(0);
    setSize(nextBase.sizes[0] ?? null);
    const nextPosition =
      POSITIONS.find((item) => item.kinds.includes(next))?.value ?? "center";
    setPosition(nextPosition);
    setView("front");
    setStamps([]);
    setTextPlacements({});
    setSelectedId(null);
  }

  function selectView(nextView: PrintSide) {
    setView(nextView);
    if (nextView === "back") {
      setPosition("back");
    } else if (position === "back") {
      setPosition("center");
    }
    const first = stamps.find((stamp) => stamp.side === nextView);
    setSelectedId(
      first?.id ?? (text.trim() && textPlacements[nextView] ? TEXT_LAYER_ID : null),
    );
  }

  async function readImage(file: File) {
    if (file.size > 8 * 1024 * 1024) {
      setError("Cada imagen debe pesar menos de 8 MB.");
      return null;
    }
    const originalUrl = await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
    if (!originalUrl) return null;
    try {
      const image = await loadHtmlImage(originalUrl);
      const preview = await compressImageSrc(originalUrl);
      let printFileUrl = originalUrl;
      try {
        const form = new FormData();
        form.append("print", file, file.name);
        const response = await fetch("/api/orders/media", { method: "POST", body: form });
        const data = (await response.json()) as { urls?: Record<string, string> };
        if (response.ok && data.urls?.print) printFileUrl = data.urls.print;
      } catch {
        // se guarda el original al confirmar el pedido
      }
      return {
        url: preview.url,
        width: image.naturalWidth,
        height: image.naturalHeight,
        printFileUrl,
        printFileName: file.name,
      };
    } catch {
      return null;
    }
  }

  async function addFiles(fileList: FileList | File[] | null) {
    if (!fileList?.length) return;
    const targetView = view;
    const targetKind = kind;
    const targetPosition = position;
    const files = Array.from(fileList).slice(0, 6);
    const loaded = (await Promise.all(files.map(readImage))).filter(
      (item): item is NonNullable<typeof item> => item !== null,
    );
    if (!loaded.length) return;

    addArtwork(loaded, targetView, targetKind, targetPosition);
  }

  function addLibrarySticker(
    sticker: LibrarySticker,
    _dropPct?: { x: number; y: number },
  ) {
    const aspect = sticker.width / sticker.height;
    const area = getPrintableArea(kind, view);
    const stage = containerAspect(kind, view);
    let width = area.width * 0.5;
    let height = heightFromWidth(width, aspect, stage);
    if (height > area.height * 0.5) {
      height = area.height * 0.5;
      width = widthFromHeight(height, aspect, stage);
    }
    const placement = clampPlacement(
      {
        x: area.left + (area.width - width) / 2,
        y: area.top + (area.height - height) / 2,
        width,
        height,
      },
      area,
      aspect,
      stage,
    );
    addArtwork(
      [
        {
          url: sticker.src,
          width: sticker.width,
          height: sticker.height,
          printFileUrl: sticker.printSrc,
          printFileName: sticker.printFileName,
        },
      ],
      view,
      kind,
      position,
      placement,
    );
  }

  function dropStickerOnPreview(sticker: LibrarySticker, clientX: number, clientY: number) {
    const stage = document.getElementById("koinu-print-stage");
    if (!stage) return false;
    const box = stage.getBoundingClientRect();
    if (
      clientX < box.left ||
      clientX > box.right ||
      clientY < box.top ||
      clientY > box.bottom ||
      !box.width ||
      !box.height
    ) {
      return false;
    }
    addLibrarySticker(sticker, {
      x: ((clientX - box.left) / box.width) * 100,
      y: ((clientY - box.top) / box.height) * 100,
    });
    return true;
  }

  function addArtwork(
    loaded: {
      url: string;
      width: number;
      height: number;
      printFileUrl?: string;
      printFileName?: string;
    }[],
    targetView: PrintSide,
    targetKind: ProductKind,
    targetPosition: PrintPosition,
    placementOverride?: PrintPlacement,
  ) {
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
      printFileUrl: image.printFileUrl ?? image.url,
      printFileName: image.printFileName,
      widthPx: image.width,
      heightPx: image.height,
      placement:
        index === 0 && placementOverride
          ? placementOverride
          : makePlacement(
              image.width / image.height,
              targetKind,
              targetView,
              targetPosition,
              onSide + index,
            ),
      rotation: 0,
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

  function updateStampRotation(id: string, rotation: number) {
    setStamps((current) =>
      current.map((stamp) => (stamp.id === id ? { ...stamp, rotation } : stamp)),
    );
  }

  function moveStampLayer(id: string, direction: "forward" | "backward") {
    setStamps((current) => {
      const stamp = current.find((item) => item.id === id);
      if (!stamp) return current;
      const sideIndexes = current
        .map((item, index) => (item.side === stamp.side ? index : -1))
        .filter((index) => index >= 0);
      const position = sideIndexes.findIndex((index) => current[index].id === id);
      const nextPosition = position + (direction === "forward" ? 1 : -1);
      if (nextPosition < 0 || nextPosition >= sideIndexes.length) return current;
      const from = sideIndexes[position];
      const to = sideIndexes[nextPosition];
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  function ensureTextPlacement(side: PrintSide = view) {
    setTextPlacements((current) => {
      if (current[side]) return current;
      return { ...current, [side]: defaultTextPlacement(kind, side) };
    });
    setSelectedId(TEXT_LAYER_ID);
  }

  function updateText(value: string) {
    setText(value);
    if (!value.trim()) {
      setTextPlacements({});
      setSelectedId((current) => (current === TEXT_LAYER_ID ? null : current));
      return;
    }
    ensureTextPlacement(view);
  }

  function updateTextPlacement(placement: PrintPlacement) {
    setTextPlacements((current) => ({ ...current, [view]: placement }));
  }

  function nextStep() {
    if (step === 2 && !text.trim() && !stamps.length) {
      setError("Elige un diseño listo, sube una imagen o escribe un texto.");
      return;
    }
    setError("");
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }

  async function addToCart() {
    if (!text.trim() && !stamps.length) {
      setError("Elige un diseño listo, sube una imagen o escribe un texto.");
      setStep(2);
      return;
    }

    const first = selectedId === TEXT_LAYER_ID ? stamps[0] : selected ?? stamps[0];
    const printSides = PRINT_SIDES.filter(
      (side) =>
        stamps.some((stamp) => stamp.side === side) || Boolean(text.trim() && textPlacements[side]),
    );
    const sides = printSides.length ? printSides : (["front"] as PrintSide[]);

    setSaving(true);
    setError("");
    try {
      const previewBySide = await captureDesignPreviews({
        kind,
        color: color.hex,
        sides,
        stamps,
        text: text.trim(),
        textColor,
        textFont,
        textPlacements: text.trim() ? textPlacements : undefined,
      });

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
          textFont,
          textPlacements: text.trim() ? textPlacements : undefined,
          position: view === "back" ? "back" : position,
          artworkDataUrl: first?.printFileUrl ?? first?.artworkDataUrl ?? null,
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
          previewBySide,
        },
      });
      router.push("/carrito");
    } catch {
      setError("No se pudo guardar la foto del diseño. Inténtalo de nuevo.");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-3 lg:hidden">
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold touch-manipulation ${
                index === step
                  ? "bg-ink text-paper"
                  : index < step
                    ? "bg-magenta/15 text-magenta"
                    : "bg-ink/5 text-ink/40"
              }`}
              aria-label={label}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-center text-sm font-semibold">{STEPS[step]}</p>
      </div>
      <div
        className={`grid gap-4 pb-28 sm:gap-8 lg:pb-0 ${
          step === 0 ? "" : "lg:grid-cols-2"
        }`}
      >
      <div className="rounded-2xl border border-ink/10 bg-surface/70 p-4 shadow-sm sm:rounded-[2rem] sm:p-6">
        <div className="mb-6 hidden grid-cols-4 gap-2 lg:grid">
          {STEPS.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setStep(index)}
              className={`flex h-14 w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl px-1 text-center ${
                index === step
                  ? "bg-ink text-paper"
                  : index < step
                    ? "bg-magenta/15 text-magenta"
                    : "bg-ink/5 text-ink/40"
              }`}
            >
              <span className="text-[11px] font-bold tabular-nums leading-none">
                {index + 1}
              </span>
              <span className="mt-1 max-w-full px-0.5 text-[10px] font-semibold uppercase leading-tight tracking-wide">
                {label}
              </span>
            </button>
          ))}
        </div>

        {step === 0 ? (
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">¿Qué quieres personalizar?</h2>
            <p className="mt-1 text-sm text-ink/60">
              Elige la base para continuar. Después sumamos color, talla y diseño.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:grid-cols-3 sm:gap-3">
              {CUSTOMIZABLE_BASES.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => {
                    pickKind(item.slug);
                    setStep(1);
                  }}
                  className={`flex h-full flex-col gap-2 rounded-xl border p-2.5 text-left transition hover:border-magenta sm:rounded-2xl sm:p-3 ${
                    kind === item.slug ? "border-magenta bg-magenta/5" : "border-ink/10"
                  }`}
                >
                  <div className="mx-auto h-20 w-16">
                    <ProductMock kind={item.slug} color={item.colors[0].hex} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold sm:text-base">{item.name}</p>
                    <p className="mt-1 truncate text-xs font-semibold sm:text-sm">
                      desde {formatPrice(item.basePrice)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h2 className="font-display text-xl font-bold sm:text-2xl">Color y talla</h2>
            <p className="mt-1 text-sm text-ink/60">{base.name} · {formatPrice(base.basePrice)}</p>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {base.colors.map((item, index) => (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() => setColorIndex(index)}
                  className={`h-10 w-10 rounded-full border-2 touch-manipulation ${
                    colorIndex === index ? "border-ink" : "border-white"
                  }`}
                  style={{ background: item.hex }}
                  aria-label={item.name}
                />
              ))}
            </div>
            <p className="mt-2 text-sm">{color.name}</p>
            {base.sizes.length ? (
              <>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink/50">Talla</p>
                <div className="mt-2 flex gap-2">
                  {base.sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSize(item)}
                      className={`grid h-10 min-w-0 flex-1 place-items-center rounded-full border text-sm font-semibold touch-manipulation ${
                        size === item ? "border-ink bg-ink text-paper" : "border-ink/15"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="mt-5 hidden overflow-hidden rounded-2xl border border-ink/10 sm:block">
                  <table className="w-full table-fixed text-left text-sm">
                    <thead className="bg-ink/5 text-[11px] uppercase tracking-wider text-ink/50">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Talla</th>
                        <th className="px-3 py-2 font-semibold">Ancho</th>
                        <th className="px-3 py-2 font-semibold">Largo</th>
                        <th className="px-3 py-2 font-semibold">Estampa máx.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_CHARTS[kind].map((row) => {
                        const selected = row.size === size;
                        return (
                          <tr
                            key={row.size}
                            role="button"
                            tabIndex={0}
                            aria-pressed={selected}
                            aria-label={`Elegir talla ${row.size}`}
                            onClick={() => setSize(row.size)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSize(row.size);
                              }
                            }}
                            className={`cursor-pointer touch-manipulation outline-none transition-colors focus-visible:bg-magenta/15 ${
                              selected
                                ? "bg-magenta/10 font-semibold"
                                : "hover:bg-ink/5"
                            }`}
                          >
                            <td className="px-3 py-2">{row.size}</td>
                            <td className="px-3 py-2">{formatCm(row.widthCm)}</td>
                            <td className="px-3 py-2">{formatCm(row.lengthCm)}</td>
                            <td className="px-3 py-2">
                              {formatCm(row.printWidthCm)} × {formatCm(row.printHeightCm).replace(" cm", "")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 hidden text-xs text-ink/50 sm:block">
                  Ancho y largo de la prenda tendida. El área de estampa es el máximo recomendado al frente. Toca una fila para elegir la talla.
                </p>
              </>
            ) : (
              <p className="mt-5 text-sm text-ink/60">Este producto no lleva talla.</p>
            )}
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/25 bg-paper/60 px-4 py-4 text-center hover:border-magenta">
              <Upload className="h-5 w-5 text-magenta" />
              <span>
                <span className="block text-sm font-semibold">Agregar imagen a {sideTo(view)}</span>
                <span className="text-xs text-ink/50">PNG, JPG o WEBP · máx. 8 MB</span>
              </span>
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
            <div className="mt-4">
              <StickerPicker
                onPick={addLibrarySticker}
                onDrag={setStickerGhost}
                onDropAt={dropStickerOnPreview}
                disabled={sideStamps.length >= 6}
              />
            </div>

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
              onChange={(event) => updateText(event.target.value)}
              onFocus={() => {
                if (text.trim()) ensureTextPlacement(view);
              }}
              maxLength={48}
              placeholder="Ej: Feliz cumple, Vale"
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-surface px-4 py-3 outline-none ring-magenta/30 focus:ring"
            />

            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-surface px-3">
                <span className="text-xs text-ink/50">Color</span>
                <input
                  type="color"
                  value={textColor}
                  onChange={(event) => setTextColor(event.target.value)}
                  className="h-8 w-8 cursor-pointer rounded border border-ink/10"
                />
              </label>
              <label className="block h-12">
                <span className="sr-only">Tipo de letra</span>
                <select
                  value={textFont}
                  onChange={(event) => {
                    setTextFont(event.target.value);
                    if (text.trim()) ensureTextPlacement(view);
                  }}
                  className="h-12 w-full rounded-2xl border border-ink/10 bg-surface px-3 text-sm outline-none ring-magenta/30 focus:ring"
                  style={printFontStyle(textFont)}
                >
                  {PRINT_FONT_GROUPS.map((group) => (
                    <optgroup key={group} label={group}>
                      {PRINT_FONTS.filter((font) => font.group === group).map((font) => (
                        <option key={font.key} value={font.key} style={printFontStyle(font.key)}>
                          {font.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
            </div>

            <div className="hidden lg:block">
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
                      className={`grid h-10 min-w-0 place-items-center rounded-full border px-2 text-sm font-semibold ${
                        view === side ? "border-ink bg-ink text-paper" : "border-ink/15"
                      }`}
                    >
                      {sideLabel(side)}
                      {stamps.some((stamp) => stamp.side === side) ||
                      Boolean(text.trim() && textPlacements[side])
                        ? " · ✓"
                        : ""}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <p className="mt-2 hidden text-xs text-ink/50 sm:block">
              {view === "front"
                ? "Arrastra en la vista previa. Cambia de cara para estampar otro lado."
                : `Estás en ${sideTo(view)}. Las otras caras no se copian.`}
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-magenta sm:text-xs">
              Listo para el taller
            </p>
            <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl">Revisa tu pieza</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">
              Confirmá color, caras y cantidad. El diseño queda guardado en el pedido.
            </p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_1px_2px_rgba(22,18,15,0.06)] sm:rounded-3xl">
              <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <div className="grid h-20 w-16 shrink-0 place-items-center rounded-2xl bg-ink/4 sm:h-24 sm:w-20">
                  <div className="h-18 w-14 sm:h-22 sm:w-16">
                    <ProductMock kind={kind} color={color.hex} hidePrint />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold leading-tight sm:text-xl">{base.name}</p>
                  <p className="mt-0.5 hidden text-xs text-ink/50 sm:block">
                    {formatCm(measures.widthCm)} ancho × {formatCm(measures.lengthCm).replace(" cm", "")} largo
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-2.5 py-1 text-xs font-semibold">
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-ink/15"
                        style={{ background: color.hex }}
                      />
                      {color.name}
                    </span>
                    {size ? (
                      <span className="rounded-full border border-ink/10 bg-surface px-2.5 py-1 text-xs font-semibold">
                        Talla {size}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-magenta/10 px-2.5 py-1 text-xs font-bold text-magenta">
                      {kindLabel(kind)}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`grid border-t border-ink/8 ${
                  productViews.length > 2 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"
                }`}
              >
                {productViews.map((side) => {
                  const count = sideCounts[side];
                  const hasText = Boolean(textPlacements[side]);
                  const ready = count > 0 || hasText;
                  return (
                    <div
                      key={side}
                      className="border-r border-b border-ink/8 px-3 py-2.5 sm:px-4 sm:py-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/40">
                        {sideLabel(side)}
                      </p>
                      <p
                        className={`mt-0.5 inline-flex items-center gap-1 text-xs font-bold sm:text-sm ${
                          ready ? "text-ink" : "text-ink/35"
                        }`}
                      >
                        {ready ? <Check className="h-3.5 w-3.5 text-magenta" /> : null}
                        {count
                          ? `${count} ${count === 1 ? "estampa" : "estampas"}`
                          : hasText
                            ? "Texto"
                            : "Sin arte"}
                      </p>
                    </div>
                  );
                })}
              </div>

              {text.trim() ? (
                <div className="flex items-start gap-2.5 border-t border-ink/8 bg-magenta/4 px-3 py-3 sm:px-4">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-magenta/15 text-magenta">
                    <Type className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/40">
                      Texto · {printFontLabel(textFont)}
                      {Object.keys(textPlacements).length
                        ? ` · ${Object.keys(textPlacements).map((side) => sideLabel(side)).join(", ")}`
                        : ""}
                    </p>
                    <p
                      className="mt-0.5 truncate text-sm font-semibold text-ink"
                      style={printFontStyle(textFont)}
                    >
                      “{text.trim()}”
                    </p>
                  </div>
                </div>
              ) : stamps.length ? (
                <p className="border-t border-ink/8 px-3 py-2.5 text-xs text-ink/45 sm:px-4">
                  Sin texto extra · las estampas van en las caras marcadas.
                </p>
              ) : (
                <p className="border-t border-ink/8 px-3 py-2.5 text-xs text-magenta-dark sm:px-4">
                  Todavía no hay diseño. Volvé a Diseño para subir una imagen o un sticker.
                </p>
              )}

              {printCm && selected ? (
                <p className="hidden border-t border-ink/8 px-4 py-2 text-xs text-ink/45 sm:block">
                  Estampa activa ({sideLabel(selected.side).toLowerCase()}): {formatCm(printCm.widthCm)} ×{" "}
                  {formatCm(printCm.heightCm).replace(" cm", "")}
                  {selected.widthPx ? ` · ${selected.widthPx} × ${selected.heightPx} px` : ""}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[linear-gradient(135deg,#1a1410,#2a211c)] px-4 py-3.5 text-on-panel sm:rounded-3xl sm:px-5 sm:py-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber">Cantidad</p>
                <div className="mt-1.5 inline-flex items-center rounded-full bg-white/10">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-on-panel/80 transition hover:bg-white/10"
                    aria-label="Quitar una"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-7 text-center font-display text-lg font-bold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(20, value + 1))}
                    className="grid h-9 w-9 place-items-center rounded-full text-on-panel/80 transition hover:bg-white/10"
                    aria-label="Agregar una"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber">Total</p>
                <p className="mt-0.5 font-display text-2xl font-bold leading-none sm:text-3xl">
                  {formatPrice(base.basePrice * qty)}
                </p>
                {qty > 1 ? (
                  <p className="mt-1 text-[11px] text-on-panel/50">
                    {formatPrice(base.basePrice)} c/u
                  </p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={saving}
              className="btn-personaliza mt-5 hidden w-full items-center justify-center gap-2 rounded-full bg-magenta px-6 py-4 font-display text-lg font-bold text-white shadow-[0_10px_24px_rgba(255,61,127,0.28)] hover:bg-magenta-dark disabled:opacity-60 lg:inline-flex"
            >
              <Sparkles className="h-5 w-5" />
              {saving ? "Guardando diseño…" : "Agregar al carrito"}
            </button>
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm text-magenta-dark">{error}</p> : null}

        <div className="mt-8 hidden grid-cols-2 gap-2 lg:grid">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="inline-flex h-11 items-center justify-center gap-1 rounded-full border border-ink/15 px-4 text-sm disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex h-11 items-center justify-center gap-1 rounded-full bg-ink px-4 text-sm font-semibold text-paper"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <span className="h-11" aria-hidden />
          )}
        </div>
      </div>

      {step > 0 ? (
        <div className="order-first rounded-2xl bg-[linear-gradient(180deg,#1a1410,#2a211c)] p-3 text-on-panel shadow-lg sm:p-5 lg:order-none lg:rounded-[2rem] lg:p-5 lg:shadow-none">
          <p className="hidden text-xs uppercase tracking-[0.25em] text-amber sm:block">Vista previa</p>
          <h3 className="hidden font-display text-2xl font-bold sm:mt-1 sm:block">{base.name} a tu medida</h3>
          <p className="mt-1 hidden text-sm text-amber sm:block">
            {kind === "shirt" || kind === "hoodie"
              ? `Área imprimible: toda la prenda · ${formatCm(measures.widthCm)} × ${formatCm(measures.lengthCm).replace(" cm", "")}`
              : `Área imprimible ${formatCm(measures.printWidthCm)} × ${formatCm(measures.printHeightCm).replace(" cm", "")}`}
          </p>
          <div className="lg:mt-4">
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
              onStampRotate={updateStampRotation}
              onStampRemove={removeStamp}
              onStampLayer={moveStampLayer}
              text={text}
              textColor={textColor}
              textFont={textFont}
              textPlacement={textPlacements[view] ?? null}
              textSides={PRINT_SIDES.filter((side) => Boolean(textPlacements[side]))}
              onTextPlacement={updateTextPlacement}
              onStickerDrop={addLibrarySticker}
              highlightDrop={Boolean(stickerGhost)}
              stageClassName="mx-auto max-w-[18rem] sm:max-w-[22rem] lg:max-w-none"
            />
          </div>
          <p className="mt-4 hidden text-center text-sm text-on-panel/60 lg:block">
            Arrastra stickers o imágenes, rota o elimina cada una.{" "}
            {productViews.length > 2
              ? "Frente, espalda y perfiles son fotos distintas."
              : "Frente y espalda son fotos distintas."}
          </p>
        </div>
      ) : null}
      </div>

      {stickerGhost ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={stickerGhost.sticker.thumb}
          alt=""
          className="pointer-events-none fixed z-[80] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/70 bg-paper object-contain p-1 shadow-xl"
          style={{ left: stickerGhost.x, top: stickerGhost.y }}
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper px-3 py-3 shadow-[0_-8px_24px_rgba(22,18,15,0.08)] lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-6xl gap-2">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="inline-flex h-12 flex-1 items-center justify-center gap-1 rounded-full border border-ink/15 px-4 text-sm font-semibold touch-manipulation disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Atrás
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex h-12 flex-1 items-center justify-center gap-1 rounded-full bg-ink px-4 text-sm font-semibold text-paper touch-manipulation"
            >
              Siguiente <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={saving}
              className="btn-personaliza inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-magenta px-4 text-sm font-bold text-white touch-manipulation disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {saving ? "Guardando…" : "Agregar al carrito"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
