"use client";

import { Mascot } from "@/components/mascot";
import { SocialIcons } from "@/components/social-icons";

export const INSTAGRAM_URL = "https://www.instagram.com/koinustore_dtf/";
export const INSTAGRAM_HANDLE = "koinustore_dtf";

export function InstagramStrip() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-16">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden w-[4.5rem] rounded-2xl bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] p-1.5 sm:block sm:w-24 sm:rounded-3xl sm:p-2">
            <Mascot name="follow" alt="" size={160} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">
              Redes
            </p>
            <h2 className="font-display text-xl font-bold sm:text-3xl">
              Lo que sale del taller
            </h2>
            <p className="mt-0.5 truncate text-sm text-ink/60">@{INSTAGRAM_HANDLE}</p>
          </div>
        </div>
        <SocialIcons />
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
