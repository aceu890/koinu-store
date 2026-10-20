"use client";

import { useEffect, useRef, useState } from "react";
import { GarmentThumb } from "@/components/garment-thumb";
import { nextPreviewDesign } from "@/lib/preview-designs";
import type { ProductKind } from "@/lib/types";

const WIDE_DELAYS = [2000, 4000, 6000];

export function BasePreview({
  kind,
  color,
  delayMs = 0,
}: {
  kind: ProductKind;
  color: string;
  delayMs?: number;
}) {
  const [designOn, setDesignOn] = useState(false);
  const [designSrc, setDesignSrc] = useState("");
  const designOnRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const wide = window.matchMedia("(min-width: 640px)");
    let timeout = 0;
    let step = 0;

    function nextDelay() {
      if (!wide.matches) return 2000;
      const delay = WIDE_DELAYS[step % WIDE_DELAYS.length];
      step += 1;
      return delay;
    }

    function tick() {
      if (!designOnRef.current) {
        setDesignSrc(nextPreviewDesign());
      }
      designOnRef.current = !designOnRef.current;
      setDesignOn(designOnRef.current);
      timeout = window.setTimeout(tick, nextDelay());
    }

    timeout = window.setTimeout(tick, delayMs + nextDelay());

    return () => window.clearTimeout(timeout);
  }, [delayMs]);

  return <GarmentThumb kind={kind} color={color} designSrc={designSrc} designOn={designOn} />;
}
