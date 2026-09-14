"use client";

import { Mascot } from "@/components/mascot";

export const INSTAGRAM_URL = "https://www.instagram.com/koinustore_dtf/";
export const INSTAGRAM_HANDLE = "koinustore_dtf";

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

export function InstagramStrip() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-16">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden w-[4.5rem] rounded-2xl bg-panel p-1.5 sm:block sm:w-24 sm:rounded-3xl sm:p-2">
            <Mascot name="follow" alt="" size={160} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">
              Instagram
            </p>
            <h2 className="font-display text-xl font-bold sm:text-3xl">
              Lo que sale del taller
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink/60">@{INSTAGRAM_HANDLE}</p>
          </div>
        </div>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-paper hover:bg-magenta sm:px-5"
        >
          <InstagramGlyph className="h-4 w-4" />
          Seguir
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-panel sm:rounded-[2rem]">
        <iframe
          src={`${INSTAGRAM_URL}embed/`}
          title={`Instagram @${INSTAGRAM_HANDLE}`}
          loading="lazy"
          className="h-[26rem] w-full sm:h-[34rem] lg:h-[40rem]"
        />
      </div>
      <p className="mt-3 text-center text-sm text-ink/50">
        Fotos en vivo desde{" "}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-magenta"
        >
          @{INSTAGRAM_HANDLE}
        </a>
      </p>
    </section>
  );
}
