import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { readFileSync } from "fs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const library = readFileSync(path.join(root, "lib", "sticker-library.ts"), "utf8");

const packs = [];
const packRe = /id:\s*"([^"]+)",\s*name:\s*"[^"]+",\s*stickers:\s*stickers\("([^"]+)",/g;
let packMatch;
while ((packMatch = packRe.exec(library))) {
  packs.push({ id: packMatch[1], folder: packMatch[2], index: packMatch.index });
}

function slicePack(start, end) {
  const chunk = library.slice(start, end);
  const items = [];
  const itemRe = /id: "([^"]+)",\s+file: "([^"]+)"/g;
  let itemMatch;
  while ((itemMatch = itemRe.exec(chunk))) {
    items.push({ id: itemMatch[1], file: itemMatch[2] });
  }
  return items;
}

const jobs = packs.flatMap((pack, index) => {
  const end = packs[index + 1]?.index ?? library.length;
  return slicePack(pack.index, end).map((item) => ({
    pack: pack.folder,
    id: item.id,
    file: item.file,
  }));
});

const destRoot = path.join(root, "public", "Stickers");
let saved = 0;
let bytesIn = 0;
let bytesOut = 0;

for (const job of jobs) {
  const input = path.join(destRoot, job.pack, job.file);
  const outDir = path.join(destRoot, job.pack, "print");
  const output = path.join(outDir, `${job.id}.webp`);
  await mkdir(outDir, { recursive: true });
  const image = sharp(input, { failOn: "none" });
  const meta = await image.metadata();
  bytesIn += meta.size ?? 0;
  const result = await image
    .rotate()
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 70, alphaQuality: 70, effort: 6 })
    .toFile(output);
  bytesOut += result.size;
  saved += 1;
  console.log(`${job.pack}/${job.id} ${(result.size / 1024).toFixed(0)} KB`);
}

console.log(
  `listo ${saved} stickers · ${(bytesIn / 1024 / 1024).toFixed(1)} MB → ${(bytesOut / 1024 / 1024).toFixed(1)} MB`,
);
