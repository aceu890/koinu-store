import { SOCIALS, type SocialNetwork } from "@/lib/social";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.15" cy="6.85" r="1.05" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.5 7.12A6.3 6.3 0 0 1 14.7 2h-3.2v13.4a2.55 2.55 0 1 1-2.55-2.55c.2 0 .4.02.58.06V9.5a6.05 6.05 0 0 0-.58-.03 5.95 5.95 0 1 0 5.95 5.95V8.55A9.4 9.4 0 0 0 19.5 10.2V7.12Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.2 20v-6.4h2.15l.32-2.5H14.2V9.5c0-.72.2-1.22 1.24-1.22h1.32V6.05c-.23-.03-1.01-.1-1.93-.1-1.91 0-3.22 1.17-3.22 3.31v1.84H9.4v2.5h2.21V20h2.59Z" />
    </svg>
  );
}

const ICONS = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
} as const;

const BUTTON: Record<SocialNetwork["id"], string> = {
  instagram:
    "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fd5949_45%,#d6249f_60%,#285AEB_90%)] text-white",
  tiktok: "bg-ink text-paper",
  facebook: "bg-[#1877F2] text-white",
};

export function SocialIcons({
  size = "md",
}: {
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11 sm:h-12 sm:w-12";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px] sm:h-5 sm:w-5";

  return (
    <nav aria-label="Redes sociales" className="flex items-center gap-2 sm:gap-2.5">
      {SOCIALS.map((social) => {
        const Icon = ICONS[social.id];
        return (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={`grid ${box} place-items-center rounded-full shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${BUTTON[social.id]}`}
          >
            <Icon className={icon} />
          </a>
        );
      })}
    </nav>
  );
}
