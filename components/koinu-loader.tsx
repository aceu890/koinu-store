import { BrandLogo } from "@/components/brand-logo";

type KoinuLoaderProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
  page?: boolean;
  overlay?: boolean;
};

const LOGO = {
  sm: 28,
  md: 48,
  lg: 64,
} as const;

export function KoinuLoader({
  label = "Cargando…",
  size = "md",
  page,
  overlay,
}: KoinuLoaderProps) {
  const logo = LOGO[size];
  const ring = size === "sm" ? "h-11 w-11" : size === "lg" ? "h-24 w-24" : "h-[4.5rem] w-[4.5rem]";

  const mark = (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div className={`relative grid place-items-center ${ring}`}>
        <span className="koinu-loader-ring absolute inset-0 rounded-full" />
        <span className="koinu-loader-ring-inner absolute inset-[7px] rounded-full" />
        <span className="relative grid h-[62%] w-[62%] place-items-center overflow-hidden rounded-full bg-surface shadow-[0_6px_18px_rgba(22,18,15,0.08)]">
          <BrandLogo size={logo} />
        </span>
      </div>
      {label ? (
        <p className="font-display text-sm font-semibold tracking-wide text-ink/55">{label}</p>
      ) : null}
    </div>
  );

  if (overlay) {
    return (
      <div className="koinu-overlay fixed inset-0 z-[70] grid place-items-center bg-paper/72 px-6 backdrop-blur-[6px]">
        {mark}
      </div>
    );
  }

  if (page) {
    return <div className="grid min-h-[55vh] place-items-center px-6 py-16">{mark}</div>;
  }

  return mark;
}
