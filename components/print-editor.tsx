"use client";

import { useEffect, useRef, useState } from "react";
import { BringToFront, RotateCw, SendToBack, Trash2 } from "lucide-react";
import { ProductMock } from "@/components/product-mock";
import {
  getPrintableArea,
  clampBox,
  clampPlacement,
  formatCm,
  getGarmentMeasures,
  heightFromWidth,
  placementToCm,
  printDpi,
  widthFromHeight,
} from "@/lib/measurements";
import { isDarkHex } from "@/lib/color";
import {
  getPhotoAspect,
  getPreviewFrameAspect,
  getProductPhoto,
  getProductViews,
} from "@/lib/product-photos";
import type { PrintPlacement, PrintPosition, PrintSide, PrintStamp, ProductKind } from "@/lib/types";
import { TEXT_LAYER_ID } from "@/lib/types";
import { printFontStyle } from "@/lib/print-fonts";
import { sideLabel, sideTo } from "@/lib/format";
import { STICKER_DRAG_TYPE, getLibrarySticker, type LibrarySticker } from "@/lib/sticker-library";

type Handle = "move" | "nw" | "ne" | "sw" | "se" | "rotate";

function normalizeRotation(degrees: number) {
  return ((Math.round(degrees) % 360) + 360) % 360;
}

type PrintEditorProps = {
  kind: ProductKind;
  color: string;
  size: string | null;
  position: PrintPosition;
  view: PrintSide;
  onViewChange?: (view: PrintSide) => void;
  stamps: PrintStamp[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onStampPlacement: (id: string, placement: PrintPlacement) => void;
  onStampRotate?: (id: string, rotation: number) => void;
  onStampRemove?: (id: string) => void;
  onStampLayer?: (id: string, direction: "forward" | "backward") => void;
  text: string;
  textColor: string;
  textFont?: string;
  textPlacement?: PrintPlacement | null;
  textSides?: PrintSide[];
  onTextPlacement?: (placement: PrintPlacement) => void;
  onStickerDrop?: (sticker: LibrarySticker, point: { x: number; y: number }) => void;
  stageClassName?: string;
};

export function PrintEditor({
  kind,
  color,
  size,
  position,
  view,
  onViewChange,
  stamps,
  selectedId,
  onSelect,
  onStampPlacement,
  onStampRotate,
  onStampRemove,
  onStampLayer,
  text,
  textColor,
  textFont,
  textPlacement = null,
  textSides = [],
  onTextPlacement,
  onStickerDrop,
  stageClassName,
}: PrintEditorProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    handle: Handle;
    id: string;
    startX: number;
    startY: number;
    origin: PrintPlacement;
    aspect: number | null;
    originRotation: number;
    didDrag: boolean;
  } | null>(null);
  const [stageAspect, setStageAspect] = useState(1);
  const [dropActive, setDropActive] = useState(false);
  const area = getPrintableArea(kind, view);
  const measures = getGarmentMeasures(kind, size);
  const dark = isDarkHex(color);
  const views = getProductViews(kind);
  const canFlip = views.length > 1;
  const sideStamps = stamps.filter((stamp) => stamp.side === view);
  const textActive = selectedId === TEXT_LAYER_ID && Boolean(text.trim() && textPlacement);
  const selected = textActive ? null : sideStamps.find((stamp) => stamp.id === selectedId) ?? null;
  const imageAspect = selected ? selected.widthPx / selected.heightPx : 1;
  const printCm = selected
    ? placementToCm(selected.placement, area, measures, kind)
    : textActive && textPlacement
      ? placementToCm(textPlacement, area, measures, kind)
      : null;
  const dpi =
    selected && printCm ? printDpi(selected.widthPx, printCm.widthCm) : null;
  const garmentPhoto = getProductPhoto(kind, view);
  const frameAspect = getPreviewFrameAspect(kind);
  const photoAspect = getPhotoAspect(kind, view);
  const stageWidthPct = Math.min(100, (photoAspect / frameAspect) * 100);
  const stageStyle = {
    width: `${stageWidthPct}%`,
    aspectRatio: `${photoAspect}`,
  };
  const garmentMask = garmentPhoto
    ? {
        WebkitMaskImage: `url(${garmentPhoto})`,
        maskImage: `url(${garmentPhoto})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }
    : undefined;

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const update = () => {
      const box = node.getBoundingClientRect();
      if (box.height) setStageAspect(box.width / box.height);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [view]);

  function clientToPct(clientX: number, clientY: number) {
    const box = stageRef.current!.getBoundingClientRect();
    return {
      x: ((clientX - box.left) / box.width) * 100,
      y: ((clientY - box.top) / box.height) * 100,
    };
  }

  function isStickerDrag(event: React.DragEvent) {
    return Array.from(event.dataTransfer.types).some(
      (type) => type === STICKER_DRAG_TYPE || type === "text/plain",
    );
  }

  function parseDroppedSticker(event: React.DragEvent): LibrarySticker | null {
    const raw = event.dataTransfer.getData(STICKER_DRAG_TYPE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as LibrarySticker;
        if (parsed?.id && parsed.src) return parsed;
      } catch {
        return null;
      }
    }
    const id = event.dataTransfer.getData("text/plain");
    return id ? getLibrarySticker(id) : null;
  }

  function onStickerDragOver(event: React.DragEvent) {
    if (!onStickerDrop || !isStickerDrag(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDropActive(true);
  }

  function onStickerDragLeave(event: React.DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setDropActive(false);
  }

  function handleStickerDrop(event: React.DragEvent) {
    if (!onStickerDrop) return;
    event.preventDefault();
    setDropActive(false);
    const sticker = parseDroppedSticker(event);
    if (!sticker || !stageRef.current) return;
    onStickerDrop(sticker, clientToPct(event.clientX, event.clientY));
  }

  function commitPlacement(id: string, next: PrintPlacement) {
    if (id === TEXT_LAYER_ID) {
      onTextPlacement?.(next);
      return;
    }
    onStampPlacement(id, next);
  }

  function onLayerPointerDown(
    event: React.PointerEvent,
    handle: Handle,
    id: string,
    placement: PrintPlacement,
    aspect: number | null,
    originRotation = 0,
  ) {
    event.preventDefault();
    event.stopPropagation();
    onSelect(id);
    stageRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = {
      handle,
      id,
      startX: event.clientX,
      startY: event.clientY,
      origin: placement,
      aspect,
      originRotation,
      didDrag: false,
    };
  }

  function onPointerDown(
    event: React.PointerEvent,
    handle: Handle,
    stamp: PrintStamp,
  ) {
    onLayerPointerDown(
      event,
      handle,
      stamp.id,
      stamp.placement,
      stamp.widthPx / stamp.heightPx,
      stamp.rotation ?? 0,
    );
  }

  function onPointerMove(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !stageRef.current) return;

    const box = stageRef.current.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / box.width) * 100;
    const dy = ((event.clientY - drag.startY) / box.height) * 100;
    const origin = drag.origin;

    if (drag.handle === "rotate") {
      const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (dist < 8) return;
      drag.didDrag = true;
      const centerX = box.left + ((origin.x + origin.width / 2) / 100) * box.width;
      const centerY = box.top + ((origin.y + origin.height / 2) / 100) * box.height;
      const startAngle = Math.atan2(drag.startY - centerY, drag.startX - centerX);
      const nextAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      const degrees = drag.originRotation + ((nextAngle - startAngle) * 180) / Math.PI;
      onStampRotate?.(drag.id, normalizeRotation(degrees));
      return;
    }

    if (drag.handle === "move") {
      const moved = { ...origin, x: origin.x + dx, y: origin.y + dy };
      commitPlacement(
        drag.id,
        drag.aspect == null
          ? clampBox(moved, area)
          : clampPlacement(moved, area, drag.aspect, stageAspect),
      );
      return;
    }

    const pointer = clientToPct(event.clientX, event.clientY);
    const fixed = {
      se: { x: origin.x, y: origin.y },
      sw: { x: origin.x + origin.width, y: origin.y },
      ne: { x: origin.x, y: origin.y + origin.height },
      nw: { x: origin.x + origin.width, y: origin.y + origin.height },
    }[drag.handle];

    if (drag.aspect == null) {
      const width = Math.max(8, Math.abs(pointer.x - fixed.x));
      const height = Math.max(5, Math.abs(pointer.y - fixed.y));
      const x = pointer.x < fixed.x ? fixed.x - width : fixed.x;
      const y = pointer.y < fixed.y ? fixed.y - height : fixed.y;
      commitPlacement(drag.id, clampBox({ x, y, width, height }, area));
      return;
    }

    const aspect = drag.aspect;
    let width = Math.abs(pointer.x - fixed.x);
    let height = heightFromWidth(width, aspect, stageAspect);

    if (height < 6) {
      height = 6;
      width = widthFromHeight(height, aspect, stageAspect);
    }

    const x = pointer.x < fixed.x ? fixed.x - width : fixed.x;
    const y = pointer.y < fixed.y ? fixed.y - height : fixed.y;

    commitPlacement(
      drag.id,
      clampPlacement({ x, y, width, height }, area, aspect, stageAspect),
    );
  }

  function onPointerUp() {
    const drag = dragRef.current;
    if (drag?.handle === "rotate" && !drag.didDrag) {
      onStampRotate?.(drag.id, normalizeRotation(drag.originRotation + 15));
    }
    dragRef.current = null;
  }

  function deselect() {
    if (dragRef.current) return;
    onSelect(null);
  }

  const maxWidth = selected
    ? Math.min(area.width, widthFromHeight(area.height, imageAspect, stageAspect))
    : area.width;
  const scalePct = selected
    ? Math.round((selected.placement.width / maxWidth) * 100)
    : 50;

  return (
    <div>
      {canFlip && onViewChange ? (
        <div className={`mb-2 grid gap-1 sm:mb-3 sm:gap-2 ${views.length > 2 ? "grid-cols-4" : "grid-cols-2"}`}>
          {views.map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => onViewChange(side)}
              className={`grid h-9 min-w-0 place-items-center rounded-full px-1 text-[11px] font-semibold touch-manipulation sm:h-10 sm:px-2 sm:text-sm ${
                view === side ? "bg-on-panel text-panel" : "bg-white/10 text-on-panel/70"
              }`}
            >
              {side === "left" ? "Izq." : side === "right" ? "Der." : sideLabel(side)}
              {stamps.some((stamp) => stamp.side === side) || textSides.includes(side)
                ? " · ✓"
                : ""}
            </button>
          ))}
        </div>
      ) : null}
      <div
        className={`relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_28%,rgba(255,236,210,0.16),transparent_46%),linear-gradient(180deg,#3a322c_0%,#1c1815_58%,#12100e_100%)] select-none sm:rounded-[1.7rem] ${
          dropActive ? "ring-2 ring-magenta ring-offset-2 ring-offset-[#1c1815]" : ""
        }`}
        onPointerDown={deselect}
        onDragOver={onStickerDragOver}
        onDragEnter={onStickerDragOver}
        onDragLeave={onStickerDragLeave}
        onDrop={handleStickerDrop}
      >
        <div className="absolute inset-x-[12%] bottom-[6%] h-8 rounded-[100%] bg-black/45 blur-xl" />
        <div className="relative px-2 pb-4 pt-2 sm:px-3 sm:pb-5 sm:pt-2">
          <div
            className={`relative w-full ${stageClassName ?? ""}`}
            style={{ aspectRatio: `${frameAspect}` }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                ref={stageRef}
                className="relative"
                style={stageStyle}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
            <ProductMock
              kind={kind}
              color={color}
              position={position}
              view={view}
              hidePrint
              studio
              fill
            >
              <div
                className="pointer-events-none absolute inset-0 z-[5] [container-type:size]"
                style={garmentMask}
              >
                {sideStamps.map((stamp) => (
                  <div
                    key={stamp.id}
                    className="absolute"
                    style={{
                      left: `${stamp.placement.x}%`,
                      top: `${stamp.placement.y}%`,
                      width: `${stamp.placement.width}%`,
                      height: `${stamp.placement.height}%`,
                      transform: `rotate(${stamp.rotation ?? 0}deg)`,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stamp.artworkDataUrl}
                      alt=""
                      draggable={false}
                      className={`h-full w-full object-contain ${dark ? "mix-blend-soft-light" : "mix-blend-multiply"}`}
                    />
                  </div>
                ))}
                {text.trim() && textPlacement ? (
                  <div
                    className="absolute flex items-center justify-center [container-type:size]"
                    style={{
                      left: `${textPlacement.x}%`,
                      top: `${textPlacement.y}%`,
                      width: `${textPlacement.width}%`,
                      height: `${textPlacement.height}%`,
                    }}
                  >
                    <p
                      className="max-h-full max-w-full px-0.5 text-center leading-[0.95] break-words"
                      style={{
                        color: textColor,
                        fontSize: "72cqh",
                        ...printFontStyle(textFont),
                      }}
                    >
                      {text}
                    </p>
                  </div>
                ) : null}
              </div>

              {text.trim() && textPlacement ? (
                <div
                  className={`absolute z-[6] touch-none ${
                    textActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
                  }`}
                  style={{
                    left: `${textPlacement.x}%`,
                    top: `${textPlacement.y}%`,
                    width: `${textPlacement.width}%`,
                    height: `${textPlacement.height}%`,
                  }}
                  onPointerDown={(event) =>
                    onLayerPointerDown(event, "move", TEXT_LAYER_ID, textPlacement, null)
                  }
                >
                  {textActive ? (
                    <>
                      <span className="pointer-events-none absolute inset-0 rounded-sm border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
                      {(["nw", "ne", "sw", "se"] as const).map((handle) => (
                        <button
                          key={handle}
                          type="button"
                          aria-label="Cambiar tamaño del texto"
                          className={`absolute z-[7] h-5 w-5 rounded-sm border-2 border-white bg-magenta shadow sm:h-3.5 sm:w-3.5 ${
                            handle === "nw"
                              ? "-left-2 -top-2 cursor-nwse-resize sm:-left-1.5 sm:-top-1.5"
                              : handle === "ne"
                                ? "-right-2 -top-2 cursor-nesw-resize sm:-right-1.5 sm:-top-1.5"
                                : handle === "sw"
                                  ? "-left-2 -bottom-2 cursor-nesw-resize sm:-left-1.5 sm:-bottom-1.5"
                                  : "-right-2 -bottom-2 cursor-nwse-resize sm:-right-1.5 sm:-bottom-1.5"
                          }`}
                          onPointerDown={(event) =>
                            onLayerPointerDown(event, handle, TEXT_LAYER_ID, textPlacement, null)
                          }
                        />
                      ))}
                      {printCm ? (
                        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-panel/90 px-2 py-0.5 text-[10px] font-semibold text-on-panel">
                          {formatCm(printCm.widthCm)} × {formatCm(printCm.heightCm).replace(" cm", "")}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              ) : null}

              {sideStamps.map((stamp, index) => {
                const active = selected?.id === stamp.id;
                const rotation = stamp.rotation ?? 0;
                const canBackward = index > 0;
                const canForward = index < sideStamps.length - 1;
                return (
                  <div
                    key={stamp.id}
                    className={`absolute touch-none ${
                      active ? "z-[9] cursor-grab active:cursor-grabbing" : "z-[6] cursor-pointer"
                    }`}
                    style={{
                      left: `${stamp.placement.x}%`,
                      top: `${stamp.placement.y}%`,
                      width: `${stamp.placement.width}%`,
                      height: `${stamp.placement.height}%`,
                      transform: `rotate(${rotation}deg)`,
                    }}
                    onPointerDown={(event) => onPointerDown(event, "move", stamp)}
                  >
                    {active ? (
                      <>
                        <span className="pointer-events-none absolute inset-0 rounded-sm border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
                        {(["nw", "ne", "sw", "se"] as const).map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            aria-label="Cambiar tamaño"
                            className={`absolute z-[7] h-5 w-5 rounded-sm border-2 border-white bg-magenta shadow sm:h-3.5 sm:w-3.5 ${
                              handle === "nw"
                                ? "-left-2 -top-2 cursor-nwse-resize sm:-left-1.5 sm:-top-1.5"
                                : handle === "ne"
                                  ? "-right-2 -top-2 cursor-nesw-resize sm:-right-1.5 sm:-top-1.5"
                                  : handle === "sw"
                                    ? "-left-2 -bottom-2 cursor-nesw-resize sm:-left-1.5 sm:-bottom-1.5"
                                    : "-right-2 -bottom-2 cursor-nwse-resize sm:-right-1.5 sm:-bottom-1.5"
                            }`}
                            onPointerDown={(event) => onPointerDown(event, handle, stamp)}
                          />
                        ))}
                        <div
                          className="absolute left-1/2 top-0 z-[8] flex items-center gap-0.5 rounded-full bg-panel/95 p-0.5 shadow-lg"
                          style={{ transform: `translate(-50%, -50%) rotate(${-rotation}deg)` }}
                          onPointerDown={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            aria-label="Rotar"
                            className="grid h-8 w-8 place-items-center rounded-full text-on-panel hover:bg-white/10 sm:h-7 sm:w-7"
                            onPointerDown={(event) => onPointerDown(event, "rotate", stamp)}
                          >
                            <RotateCw className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Pasar atrás"
                            disabled={!canBackward}
                            className="grid h-8 w-8 place-items-center rounded-full text-on-panel hover:bg-white/10 disabled:opacity-30 sm:h-7 sm:w-7"
                            onPointerDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (canBackward) onStampLayer?.(stamp.id, "backward");
                            }}
                          >
                            <SendToBack className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Pasar adelante"
                            disabled={!canForward}
                            className="grid h-8 w-8 place-items-center rounded-full text-on-panel hover:bg-white/10 disabled:opacity-30 sm:h-7 sm:w-7"
                            onPointerDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              if (canForward) onStampLayer?.(stamp.id, "forward");
                            }}
                          >
                            <BringToFront className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            aria-label="Eliminar"
                            className="grid h-8 w-8 place-items-center rounded-full text-on-panel hover:bg-white/10 sm:h-7 sm:w-7"
                            onPointerDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              onStampRemove?.(stamp.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {printCm ? (
                          <span
                            className="pointer-events-none absolute left-1/2 top-full mt-1.5 whitespace-nowrap rounded-full bg-panel/90 px-2 py-0.5 text-[10px] font-semibold text-on-panel"
                            style={{ transform: `translateX(-50%) rotate(${-rotation}deg)` }}
                          >
                            {formatCm(printCm.widthCm)} × {formatCm(printCm.heightCm).replace(" cm", "")}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                );
              })}
            </ProductMock>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected ? (
        <label className="mt-3 block text-sm text-on-panel/80 sm:mt-4">
          <span className="flex justify-between text-[11px] uppercase tracking-wider text-on-panel/50 sm:text-xs">
            Tamaño de estampa
            <span>{scalePct}%</span>
          </span>
          <input
            type="range"
            min={20}
            max={100}
            value={scalePct}
            className="mt-2 w-full accent-magenta"
            onChange={(event) => {
              const nextWidth = (Number(event.target.value) / 100) * maxWidth;
              const nextHeight = heightFromWidth(nextWidth, imageAspect, stageAspect);
              const cx = selected.placement.x + selected.placement.width / 2;
              const cy = selected.placement.y + selected.placement.height / 2;
              onStampPlacement(
                selected.id,
                clampPlacement(
                  {
                    x: cx - nextWidth / 2,
                    y: cy - nextHeight / 2,
                    width: nextWidth,
                    height: nextHeight,
                  },
                  area,
                  imageAspect,
                  stageAspect,
                ),
              );
            }}
          />
        </label>
      ) : null}

      <dl className="mt-4 hidden grid-cols-2 items-stretch gap-2 text-sm sm:grid">
        <div className="flex h-full min-h-full flex-col rounded-2xl bg-white/10 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-on-panel/50">
            Prenda {measures.size !== "Única" ? `· talla ${measures.size}` : ""}
          </dt>
          <dd className="mt-1 font-semibold text-on-panel">
            {formatCm(measures.widthCm)} ancho
            <br />
            {formatCm(measures.lengthCm)} largo
          </dd>
        </div>
        <div className="flex h-full min-h-full flex-col rounded-2xl bg-white/10 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-on-panel/50">
            Estampa seleccionada
          </dt>
          <dd className="mt-1 font-semibold text-on-panel">
            {printCm ? (
              <>
                {formatCm(printCm.widthCm)} × {formatCm(printCm.heightCm).replace(" cm", "")}
              </>
            ) : sideStamps.length || (text.trim() && textPlacement) ? (
              "Toca la imagen o el texto para editarlos"
            ) : (
              `Sube una imagen en ${sideTo(view)}`
            )}
            {selected ? (
              <span className="mt-1 block text-[11px] font-normal text-on-panel/55">
                Archivo {selected.widthPx} × {selected.heightPx} px
                {dpi ? ` · ${dpi} dpi` : ""}
              </span>
            ) : textActive ? (
              <span className="mt-1 block text-[11px] font-normal text-on-panel/55">
                Texto · arrastra o estira las esquinas
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
      {dpi && dpi < 150 ? (
        <p className="mt-2 text-xs text-amber">
          La resolución queda baja para ese tamaño. Achica la estampa o sube un archivo más grande.
        </p>
      ) : null}
    </div>
  );
}
