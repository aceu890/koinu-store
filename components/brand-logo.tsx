import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandLogo({ className, size = 88, priority }: BrandLogoProps) {
  return (
    <Image
      src="/mascota/stickers/logo.webp"
      alt="Koinu Store"
      width={size}
      height={size}
      priority={priority}
      sizes="48px"
      className={`h-full w-full object-contain ${className ?? ""}`}
    />
  );
}
