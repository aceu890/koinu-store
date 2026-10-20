"use client";

import { useState } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";

export function InstagramEmbed() {
  const [show, setShow] = useState(false);

  if (!show) {
    return (
      <button
        type="button"
        onClick={() => setShow(true)}
        className="grid h-48 w-full place-items-center rounded-2xl border border-ink/10 bg-panel text-sm font-semibold text-on-panel sm:h-64 sm:rounded-[2rem]"
      >
        Ver feed de @{INSTAGRAM_HANDLE}
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-panel sm:rounded-[2rem]">
      <iframe
        src={`${INSTAGRAM_URL}embed/`}
        title={`Instagram @${INSTAGRAM_HANDLE}`}
        loading="lazy"
        className="h-[26rem] w-full sm:h-[34rem] lg:h-[40rem]"
      />
    </div>
  );
}
