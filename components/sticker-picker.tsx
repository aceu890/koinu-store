"use client";

import { useRef, useState } from "react";
import { STICKER_PACKS, type LibrarySticker } from "@/lib/sticker-library";

export function StickerPicker({
  onPick,
  onDrag,
  onDropAt,
  disabled,
}: {
  onPick: (sticker: LibrarySticker) => void;
  onDrag?: (state: { sticker: LibrarySticker; x: number; y: number } | null) => void;
  onDropAt?: (sticker: LibrarySticker, x: number, y: number) => boolean;
  disabled?: boolean;
}) {
  const [packId, setPackId] = useState(STICKER_PACKS[0]?.id ?? "anime");
  const pack = STICKER_PACKS.find((item) => item.id === packId) ?? STICKER_PACKS[0];
  const dragRef = useRef<{
    sticker: LibrarySticker;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  if (!pack) return null;

  function endPointer(event: React.PointerEvent, sticker: LibrarySticker) {
    const drag = dragRef.current;
    dragRef.current = null;
    onDrag?.(null);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // already released
    }
    if (!drag) return;
    if (drag.moved) {
      onDropAt?.(sticker, event.clientX, event.clientY);
      return;
    }
    onPick(sticker);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {STICKER_PACKS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPackId(item.id)}
            className={`grid h-8 min-w-0 place-items-center rounded-full px-2 text-xs font-semibold touch-manipulation ${
              pack.id === item.id ? "bg-ink text-paper" : "bg-ink/5 text-ink/70"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-ink/45">
        Toca para agregar, o arrastra el sticker hasta la prenda.
      </p>
      <ul className="mt-2 grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto rounded-2xl border border-ink/10 bg-surface p-2 sm:max-h-72 sm:grid-cols-5">
        {pack.stickers.map((sticker) => (
          <li key={sticker.id}>
            <button
              type="button"
              disabled={disabled}
              onPointerDown={(event) => {
                if (disabled || event.button) return;
                dragRef.current = {
                  sticker,
                  startX: event.clientX,
                  startY: event.clientY,
                  moved: false,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const drag = dragRef.current;
                if (!drag || drag.sticker.id !== sticker.id) return;
                const dist = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
                if (!drag.moved && dist < 8) return;
                drag.moved = true;
                onDrag?.({ sticker, x: event.clientX, y: event.clientY });
              }}
              onPointerUp={(event) => endPointer(event, sticker)}
              onPointerCancel={(event) => endPointer(event, sticker)}
              className="flex aspect-square w-full cursor-grab items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-paper p-1 transition hover:border-magenta active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 touch-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sticker.thumb}
                alt={sticker.label}
                loading="lazy"
                draggable={false}
                className="pointer-events-none h-full w-full object-contain"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
