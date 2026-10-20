import { STICKER_PACKS } from "@/lib/sticker-library";

const DESIGNS = STICKER_PACKS.flatMap((pack) => pack.stickers.map((sticker) => sticker.thumb));

let bag: string[] = [];
let last = "";

function shuffle(list: string[]) {
  const next = [...list];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [next[index], next[swap]] = [next[swap], next[index]];
  }
  return next;
}

export function nextPreviewDesign() {
  if (!DESIGNS.length) return "";
  if (!bag.length) {
    const pool = DESIGNS.length > 1 ? DESIGNS.filter((src) => src !== last) : DESIGNS;
    bag = shuffle(pool);
  }
  last = bag.pop() ?? DESIGNS[0];
  return last;
}
