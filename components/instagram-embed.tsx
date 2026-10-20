import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";

export function InstagramEmbed() {
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
