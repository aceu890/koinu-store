import Image from "next/image";

const ALIASES: Record<string, string> = {
  thanks: "thank-you",
  vamos: "vamos-mascot",
  "keep-shopping": "keep-shopping-alt",
};

type MascotProps = {
  name: string;
  alt: string;
  className?: string;
  priority?: boolean;
  size?: number;
};

export function Mascot({ name, alt, className, priority, size = 320 }: MascotProps) {
  const file = ALIASES[name] ?? name;

  return (
    <Image
      src={`/mascota/stickers/${file}.webp`}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      sizes={priority ? "320px" : "(max-width: 640px) 80px, 160px"}
      className={`h-auto w-full object-contain ${className ?? ""}`}
    />
  );
}
