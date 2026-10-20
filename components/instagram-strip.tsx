import { SocialIcons } from "@/components/social-icons";
import { InstagramEmbed } from "@/components/instagram-embed";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";

export function InstagramStrip() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-12 sm:px-6 sm:pb-16">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-xs">Redes</p>
          <h2 className="font-display text-xl font-bold sm:text-3xl">Lo que sale del taller</h2>
          <p className="mt-0.5 truncate text-sm text-ink/60">@{INSTAGRAM_HANDLE}</p>
        </div>
        <SocialIcons />
      </div>

      <InstagramEmbed />
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
