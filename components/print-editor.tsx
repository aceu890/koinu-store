"use client";

import { useEffect, useRef, useState } from "react";
import { ProductMock } from "@/components/product-mock";
import {
  getPrintableArea,
  clampPlacement,
  formatCm,
  getGarmentMeasures,
  heightFromWidth,
  placementToCm,
  printDpi,
  widthFromHeight,
} from "@/lib/measurements";
import { isDarkHex } from "@/lib/color";
import { getProductPhoto } from "@/lib/product-photos";
import type { PrintPlacement, PrintPosition, PrintStamp, ProductKind } from "@/lib/types";

type Handle = "move" | "nw" | "ne" | "sw" | "se";

type PrintEditorProps = {
  kind: ProductKind;
  color: string;
  size: string | null;
  position: PrintPosition;
  view: "front" | "back";
  onViewChange?: (view: "front" | "back") => void;
  stamps: PrintStamp[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStampPlacement: (id: string, placement: PrintPlacement) => void;
  text: string;
  textColor: string;
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
  text,
  textColor,
}: PrintEditorProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    handle: Handle;
    stampId: string;
    startX: number;
    startY: number;
    origin: PrintPlacement;
    aspect: number;
  } | null>(null);
  const [stageAspect, setStageAspect] = useState(1);
  const area = getPrintableArea(kind, view);
  const measures = getGarmentMeasures(kind, size);
  const dark = isDarkHex(color);
  const canFlip = kind === "shirt" || kind === "hoodie";
  const sideStamps = stamps.filter((stamp) => stamp.side === view);
  const selected = sideStamps.find((stamp) => stamp.id === selectedId) ?? sideStamps[0] ?? null;
  const imageAspect = selected ? selected.widthPx / selected.heightPx : 1;
  const printCm = selected
    ? placementToCm(selected.placement, area, measures, kind)
    : null;
  const dpi =
    selected && printCm ? printDpi(selected.widthPx, printCm.widthCm) : null;
  const garmentPhoto = getProductPhoto(kind, view);
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

  function onPointerDown(
    event: React.PointerEvent,
    handle: Handle,
    stamp: PrintStamp,
  ) {
    event.preventDefault();
    event.stopPropagation();
    onSelect(stamp.id);
    stageRef.current?.setPointerCapture(event.pointerId);
    dragRef.current = {
      handle,
      stampId: stamp.id,
      startX: event.clientX,
      startY: event.clientY,
      origin: stamp.placement,
      aspect: stamp.widthPx / stamp.heightPx,
    };
  }

  function onPointerMove(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag || !stageRef.current) return;

    const box = stageRef.current.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / box.width) * 100;
    const dy = ((event.clientY - drag.startY) / box.height) * 100;
    const origin = drag.origin;
    const aspect = drag.aspect;

    if (drag.handle === "move") {
      onStampPlacement(
        drag.stampId,
        clampPlacement(
          { ...origin, x: origin.x + dx, y: origin.y + dy },
          area,
          aspect,
          stageAspect,
        ),
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

    let width = Math.abs(pointer.x - fixed.x);
    let height = heightFromWidth(width, aspect, stageAspect);

    if (height < 6) {
      height = 6;
      width = widthFromHeight(height, aspect, stageAspect);
    }

    const x = pointer.x < fixed.x ? fixed.x - width : fixed.x;
    const y = pointer.y < fixed.y ? fixed.y - height : fixed.y;

    onStampPlacement(
      drag.stampId,
      clampPlacement({ x, y, width, height }, area, aspect, stageAspect),
    );
  }

  function onPointerUp() {
    dragRef.current = null;
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
        <div className="mb-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewChange("front")}
            className={`rounded-full px-3 py-2 text-sm font-semibold ${
              view === "front" ? "bg-on-panel text-panel" : "bg-white/10 text-on-panel/70"
            }`}
          >
            Frente
            {stamps.some((stamp) => stamp.side === "front") ? " · ✓" : ""}
          </button>
          <button
            type="button"
            onClick={() => onViewChange("back")}
            className={`rounded-full px-3 py-2 text-sm font-semibold ${
              view === "back" ? "bg-on-panel text-panel" : "bg-white/10 text-on-panel/70"
            }`}
          >
            Espalda
            {stamps.some((stamp) => stamp.side === "back") ? " · ✓" : ""}
          </button>
        </div>
      ) : null}
      <div className="relative overflow-hidden rounded-[1.7rem] bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.14),transparent_40%),linear-gradient(180deg,#3a322c,#14110f)] select-none">
        <div className="absolute inset-x-[12%] bottom-[6%] h-8 rounded-[100%] bg-black/45 blur-xl" />
        <div className="relative px-3 pb-5 pt-2">
          <div
            ref={stageRef}
            className="relative"
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
            >
              <div
                className="pointer-events-none absolute inset-0 z-[5]"
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
                {text && !sideStamps.length ? (
                  <p
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-display text-sm font-extrabold"
                    style={{ color: textColor }}
                  >
                    {text}
                  </p>
                ) : null}
              </div>

              {sideStamps.map((stamp) => {
                const active = selected?.id === stamp.id;
                return (
                  <div
                    key={stamp.id}
                    className={`absolute z-[6] touch-none ${active ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"}`}
                    style={{
                      left: `${stamp.placement.x}%`,
                      top: `${stamp.placement.y}%`,
                      width: `${stamp.placement.width}%`,
                      height: `${stamp.placement.height}%`,
                    }}
                    onPointerDown={(event) => onPointerDown(event, "move", stamp)}
                  >
                    {active ? (
                      <>
                        {(["nw", "ne", "sw", "se"] as const).map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            aria-label="Cambiar tamaño"
                            className={`absolute z-[7] h-3.5 w-3.5 rounded-sm border-2 border-white bg-magenta shadow ${
                              handle === "nw"
                                ? "-left-1.5 -top-1.5 cursor-nwse-resize"
                                : handle === "ne"
                                  ? "-right-1.5 -top-1.5 cursor-nesw-resize"
                                  : handle === "sw"
                                    ? "-left-1.5 -bottom-1.5 cursor-nesw-resize"
                                    : "-right-1.5 -bottom-1.5 cursor-nwse-resize"
                            }`}
                            onPointerDown={(event) => onPointerDown(event, handle, stamp)}
                          />
                        ))}
                        {printCm ? (
                          <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-panel/90 px-2 py-0.5 text-[10px] font-semibold text-on-panel">
                            {formatCm(printCm.widthCm)} × {formatCm(printCm.heightCm).replace(" cm", "")}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span className="absolute inset-0 rounded-sm border border-white/30" />
                    )}
                  </div>
                );
              })}
            </ProductMock>
          </div>
        </div>
      </div>

      {selected ? (
        <label className="mt-4 block text-sm text-on-panel/80">
          <span className="flex justify-between text-xs uppercase tracking-wider text-on-panel/50">
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

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-2xl bg-white/10 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-on-panel/50">
            Prenda {measures.size !== "Única" ? `· talle ${measures.size}` : ""}
          </dt>
          <dd className="mt-1 font-semibold text-on-panel">
            {formatCm(measures.widthCm)} ancho
            <br />
            {formatCm(measures.lengthCm)} largo
          </dd>
        </div>
        <div className="rounded-2xl bg-white/10 px-3 py-2">
          <dt className="text-[10px] uppercase tracking-wider text-on-panel/50">
            Estampa seleccionada
          </dt>
          <dd className="mt-1 font-semibold text-on-panel">
            {printCm ? (
              <>
                {formatCm(printCm.widthCm)} × {formatCm(printCm.heightCm).replace(" cm", "")}
              </>
            ) : (
              `Subí una imagen al ${view === "back" ? "espalda" : "frente"}`
            )}
            {selected ? (
              <span className="mt-1 block text-[11px] font-normal text-on-panel/55">
                Archivo {selected.widthPx} × {selected.heightPx} px
                {dpi ? ` · ${dpi} dpi` : ""}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
      {dpi && dpi < 150 ? (
        <p className="mt-2 text-xs text-amber">
          La resolución queda baja para ese tamaño. Achicá la estampa o subí un archivo más grande.
        </p>
      ) : null}
    </div>
  );
}
