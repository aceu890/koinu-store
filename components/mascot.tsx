import Image from "next/image";

const STICKERS_REV = "20260908c";

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
      src={`/mascota/stickers/${file}.png?v=${STICKERS_REV}`}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      unoptimized
      className={`h-auto w-full object-contain ${className ?? ""}`}
    />
  );
}
