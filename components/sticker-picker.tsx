"use client";

import { useState } from "react";
import { STICKER_DRAG_TYPE, STICKER_PACKS, type LibrarySticker } from "@/lib/sticker-library";

export function StickerPicker({
  onPick,
  disabled,
}: {
  onPick: (sticker: LibrarySticker) => void;
  disabled?: boolean;
}) {
  const [packId, setPackId] = useState(STICKER_PACKS[0]?.id ?? "anime");
  const pack = STICKER_PACKS.find((item) => item.id === packId) ?? STICKER_PACKS[0];

  if (!pack) return null;

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
      <p className="mt-1.5 text-[11px] text-ink/45">Toca para agregar o arrastra a la vista previa.</p>
      <ul className="mt-2 grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto rounded-2xl border border-ink/10 bg-surface p-2 sm:max-h-72 sm:grid-cols-5">
        {pack.stickers.map((sticker) => (
          <li key={sticker.id}>
            <button
              type="button"
              disabled={disabled}
              draggable={!disabled}
              onClick={() => onPick(sticker)}
              onDragStart={(event) => {
                event.dataTransfer.setData(STICKER_DRAG_TYPE, JSON.stringify(sticker));
                event.dataTransfer.setData("text/plain", sticker.id);
                event.dataTransfer.effectAllowed = "copy";
              }}
              className="flex aspect-square w-full cursor-grab items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-paper p-1 transition hover:border-magenta active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
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
