import Image from "next/image";

type BrandLogoProps = {
  className?: string;
  size?: number;
  priority?: boolean;
};

export function BrandLogo({ className, size = 88, priority }: BrandLogoProps) {
  return (
    <Image
      src="/logo.gif"
      alt="Koinu Store"
      width={size}
      height={size}
      unoptimized
      priority={priority}
      className={`h-full w-full object-contain ${className ?? ""}`}
    />
  );
}
