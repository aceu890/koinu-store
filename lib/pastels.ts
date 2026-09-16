import type { CSSProperties } from "react";

export const PASTELS = [
  "#A7D8F0",
  "#C8B6E8",
  "#F3BFD3",
  "#9DDED5",
  "#B8E0C2",
  "#F7E6A6",
  "#F5C4A3",
  "#B5B9E8",
  "#F3B5A4",
  "#D8C2E8",
] as const;

export function pastelFill(index: number): CSSProperties {
  return { backgroundColor: PASTELS[index % PASTELS.length] };
}

export function pastelBackdrop(index: number): CSSProperties {
  const from = PASTELS[index % PASTELS.length];
  const to = PASTELS[(index + 1) % PASTELS.length];
  return {
    backgroundImage: [
      "radial-gradient(ellipse at 22% 12%, rgba(255,255,255,0.78), transparent 46%)",
      "radial-gradient(ellipse at 88% 92%, rgba(255,255,255,0.28), transparent 42%)",
      `linear-gradient(165deg, ${from} 0%, #fff6ee 48%, ${to} 100%)`,
    ].join(", "),
  };
}
