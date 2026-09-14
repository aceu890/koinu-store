import { useId, type CSSProperties, type ReactNode } from "react";
import { isDarkHex, mixHex } from "@/lib/color";
import { getProductPhoto, getProductPhotoMeta } from "@/lib/product-photos";
import type { DesignKey, PrintPlacement, PrintPosition, PrintSide, PrintStamp, ProductKind } from "@/lib/types";

export type ProductMockProps = {
  kind: ProductKind;
  color: string;
  design?: DesignKey;
  text?: string;
  textColor?: string;
  position?: PrintPosition;
  artworkUrl?: string | null;
  className?: string;
  studio?: boolean;
  hidePrint?: boolean;
  placement?: PrintPlacement | null;
  stamps?: PrintStamp[];
  view?: PrintSide;
  children?: ReactNode;
};

type Shade = {
  base: string;
  dark: string;
  mid: string;
  light: string;
  deep: string;
};

type LayerProps = {
  shade: Shade;
  uid: string;
  view: PrintSide;
};

function shades(color: string): Shade {
  return {
    base: color,
    dark: mixHex(color, "#0c0908", 0.34),
    mid: mixHex(color, "#1a1410", 0.18),
    light: mixHex(color, "#ffffff", 0.24),
    deep: mixHex(color, "#050403", 0.48),
  };
}

function PrintSurface({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-[1] flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

function DesignArt({
  design = "blank",
  text,
  textColor = "#111111",
  artworkUrl,
  compact,
}: {
  design?: DesignKey;
  text?: string;
  textColor?: string;
  artworkUrl?: string | null;
  compact?: boolean;
}) {
  if (artworkUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={artworkUrl}
        alt="Diseño"
        className="max-h-full max-w-full object-contain"
      />
    );
  }

  if (text) {
    return (
      <p
        className={`max-w-full px-1 text-center font-display font-extrabold leading-[0.95] break-words ${compact ? "text-[9px]" : "text-[13px] sm:text-base"}`}
        style={{ color: textColor }}
      >
        {text}
      </p>
    );
  }

  const common = compact ? "h-11 w-11" : "h-[4.5rem] w-[4.5rem]";

  switch (design) {
    case "sakura":
      return (
        <svg viewBox="0 0 80 80" className={common}>
          <circle cx="40" cy="40" r="8" fill="#F9A8D4" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="40"
              cy="22"
              rx="8"
              ry="14"
              fill="#FB7185"
              transform={`rotate(${deg} 40 40)`}
            />
          ))}
          <circle cx="40" cy="40" r="4" fill="#FDE68A" />
        </svg>
      );
    case "koinu":
      return (
        <div className="flex flex-col items-center gap-0.5">
          <span className={compact ? "text-lg" : "text-3xl"}>🐾</span>
          <span
            className={`font-display font-black tracking-tight text-white drop-shadow ${compact ? "text-[8px]" : "text-xs"}`}
          >
            KOINU
          </span>
        </div>
      );
    case "buenos-dias":
      return (
        <p
          className={`text-center font-display font-black leading-tight text-ink ${compact ? "text-[9px]" : "text-sm"}`}
        >
          buenos días,
          <br />
          jefe
        </p>
      );
    case "mercado":
      return (
        <div className="text-center">
          <p className={`font-display font-black ${compact ? "text-[10px]" : "text-sm"}`}>
            MERCADO
          </p>
          <p className={`uppercase tracking-[0.3em] ${compact ? "text-[6px]" : "text-[9px]"}`}>
            vintage
          </p>
        </div>
      );
    case "studio":
      return (
        <p className={`font-display font-black text-white drop-shadow ${compact ? "text-[9px]" : "text-xs"}`}>
          STUDIO
        </p>
      );
    case "pixel":
      return (
        <svg viewBox="0 0 32 32" className={compact ? "h-10 w-10" : "h-16 w-16"}>
          <rect x="10" y="6" width="12" height="10" fill="#1A1410" />
          <rect x="8" y="8" width="4" height="4" fill="#1A1410" />
          <rect x="20" y="8" width="4" height="4" fill="#1A1410" />
          <rect x="12" y="10" width="3" height="3" fill="#FDE68A" />
          <rect x="18" y="10" width="3" height="3" fill="#FDE68A" />
          <rect x="14" y="16" width="4" height="3" fill="#FB7185" />
          <rect x="6" y="18" width="20" height="8" fill="#FF3D7F" />
        </svg>
      );
    case "cafe":
      return (
        <p className={`text-center font-display font-black leading-none ${compact ? "text-[8px]" : "text-xs"}`}>
          CAFÉ
          <br />
          & PLOTTER
        </p>
      );
    case "overprint":
      return (
        <p className={`rotate-[-8deg] font-display font-black uppercase leading-none text-amber-100 ${compact ? "text-[10px]" : "text-lg"}`}>
          OVER
          <br />
          PRINT
        </p>
      );
    case "ruta":
      return (
        <svg viewBox="0 0 80 40" className={compact ? "h-8 w-16" : "h-12 w-24"}>
          <path d="M0 28 L80 28" stroke="#22D3EE" strokeWidth="2" />
          <path d="M10 28 L24 10 L40 28" fill="none" stroke="#FF3D7F" strokeWidth="3" />
          <circle cx="62" cy="12" r="6" fill="#FDE68A" />
        </svg>
      );
    case "flash":
      return (
        <svg viewBox="0 0 24 24" className={compact ? "h-8 w-8" : "h-12 w-12"}>
          <path d="M13 2 L4 14 h7 l-2 8 11-14 h-7 z" fill="#FDE68A" />
        </svg>
      );
    case "team":
      return (
        <p className={`font-display font-black ${compact ? "text-[9px]" : "text-sm"}`}>
          TEAM KOINU
        </p>
      );
    default:
      return null;
  }
}

function FabricPattern({ uid, dark }: { uid: string; dark: boolean }) {
  return (
    <pattern id={`${uid}-fabric`} width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill={dark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)"} />
      <path d="M0 3h6" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="0.6" />
      <path d="M3 0v6" stroke={dark ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"} strokeWidth="0.6" />
    </pattern>
  );
}

const shirtBody =
  "M84 64 C94 32 186 32 196 64 L252 90 C266 110 254 136 232 138 L206 122 L211 286 C207 304 73 304 69 286 L74 122 L48 138 C26 136 14 110 28 90 Z";

function ShirtBody({ shade, uid, view }: LayerProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-shirt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shade.light} />
          <stop offset="38%" stopColor={shade.base} />
          <stop offset="100%" stopColor={shade.dark} />
        </linearGradient>
        <radialGradient id={`${uid}-shirt-chest`} cx="46%" cy="38%" r="42%">
          <stop offset="0%" stopColor={shade.light} stopOpacity="0.55" />
          <stop offset="100%" stopColor={shade.base} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="300" rx="78" ry="10" fill="rgba(0,0,0,0.22)" />
      <path d={shirtBody} fill={`url(#${uid}-shirt)`} />
      <path d={shirtBody} fill={`url(#${uid}-shirt-chest)`} />
      <path d={shirtBody} fill={`url(#${uid}-fabric)`} />
      <path
        d="M74 122 L69 286 C73 302 207 302 211 286 L206 122"
        fill={shade.mid}
        opacity="0.28"
        style={{ mixBlendMode: "multiply" }}
      />
      <path d="M48 118 L74 122 L78 168 L52 148 Z" fill={shade.dark} opacity="0.25" />
      <path d="M232 118 L206 122 L202 168 L228 148 Z" fill={shade.light} opacity="0.18" />
      {view === "front" ? (
        <path d="M140 92 L140 278" stroke={shade.deep} strokeWidth="1.2" opacity="0.12" />
      ) : (
        <path d="M140 78 L140 278" stroke={shade.deep} strokeWidth="1" opacity="0.1" />
      )}
    </g>
  );
}

function ShirtFinish({ shade, view }: LayerProps) {
  return (
    <g>
      {view === "front" ? (
        <>
          <path
            d="M112 52 C122 86 158 86 168 52 C160 48 148 46 140 46 C132 46 120 48 112 52 Z"
            fill={shade.mid}
          />
          <path
            d="M120 58 C128 78 152 78 160 58 Q140 70 120 58 Z"
            fill={shade.deep}
            opacity="0.55"
          />
          <path
            d="M118 56 C128 76 152 76 162 56"
            fill="none"
            stroke={shade.light}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      ) : (
        <path
          d="M108 54 C120 42 160 42 172 54 C164 78 116 78 108 54 Z"
          fill={shade.mid}
          stroke={shade.dark}
          strokeWidth="1"
        />
      )}
      <path d="M70 278 C100 292 180 292 210 278" fill="none" stroke={shade.deep} strokeWidth="2" opacity="0.2" />
      <path
        d="M40 108 C70 40 210 36 240 108"
        fill="none"
        stroke={shade.light}
        strokeWidth="10"
        opacity="0.12"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

const hoodieBody =
  "M90 70 C92 28 188 28 190 70 L248 92 C262 112 252 138 230 140 L208 124 L214 292 C208 310 72 310 66 292 L72 124 L50 140 C28 138 16 112 32 92 Z";

function HoodieBody({ shade, uid, view }: LayerProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-hood`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={shade.light} />
          <stop offset="50%" stopColor={shade.base} />
          <stop offset="100%" stopColor={shade.dark} />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="304" rx="82" ry="10" fill="rgba(0,0,0,0.25)" />
      {view === "front" ? (
        <path
          d="M92 78 C92 28 188 28 188 78 C176 58 104 58 92 78 Z"
          fill={shade.dark}
        />
      ) : (
        <path d="M86 70 C96 18 184 18 194 70 C180 96 100 96 86 70 Z" fill={shade.dark} />
      )}
      <path d={hoodieBody} fill={`url(#${uid}-hood)`} />
      <path d={hoodieBody} fill={`url(#${uid}-fabric)`} />
      <path
        d="M72 168 L68 292 C74 308 206 308 212 292 L208 168"
        fill={shade.deep}
        opacity="0.16"
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
}

function HoodieFinish({ shade, view }: LayerProps) {
  if (view === "back") {
    return (
      <g>
        <path d="M100 78 C110 108 170 108 180 78" fill="none" stroke={shade.mid} strokeWidth="3" />
        <path
          d="M50 100 C90 40 190 40 230 100"
          fill="none"
          stroke={shade.light}
          strokeWidth="8"
          opacity="0.14"
          style={{ mixBlendMode: "screen" }}
        />
      </g>
    );
  }

  return (
    <g>
      <path
        d="M118 86 C126 118 154 118 162 86 C152 102 128 102 118 86 Z"
        fill={shade.deep}
        opacity="0.45"
      />
      <path d="M124 112 L118 168" stroke={mixHex(shade.base, "#d4c4a8", 0.4)} strokeWidth="2.2" />
      <path d="M156 112 L162 168" stroke={mixHex(shade.base, "#d4c4a8", 0.4)} strokeWidth="2.2" />
      <path
        d="M92 188 C100 176 180 176 188 188 L184 248 C176 262 104 262 96 248 Z"
        fill={shade.mid}
        stroke={shade.dark}
        strokeWidth="1.2"
        opacity="0.95"
      />
      <path d="M140 188 L140 250" stroke={shade.dark} strokeWidth="1.2" opacity="0.35" />
      <path d="M66 286 C100 302 180 302 214 286" fill="none" stroke={shade.deep} strokeWidth="7" opacity="0.25" />
      <path
        d="M48 108 C88 42 196 42 232 108"
        fill="none"
        stroke={shade.light}
        strokeWidth="10"
        opacity="0.12"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

function MugBody({ shade, uid }: LayerProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-ceramic`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shade.dark} />
          <stop offset="18%" stopColor={shade.light} />
          <stop offset="42%" stopColor={shade.base} />
          <stop offset="78%" stopColor={shade.mid} />
          <stop offset="100%" stopColor={shade.deep} />
        </linearGradient>
      </defs>
      <ellipse cx="132" cy="292" rx="70" ry="11" fill="rgba(0,0,0,0.28)" />
      <path
        d="M210 118 C248 122 256 168 248 196 C240 224 210 226 200 214"
        fill="none"
        stroke={shade.dark}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M210 118 C248 122 256 168 248 196 C240 224 210 226 200 214"
        fill="none"
        stroke={shade.light}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M68 86 L68 230 C68 262 196 262 196 230 L196 86 Z" fill={`url(#${uid}-ceramic)`} />
      <path d="M68 86 L68 230 C68 262 196 262 196 230 L196 86 Z" fill={`url(#${uid}-fabric)`} opacity="0.5" />
      <ellipse cx="132" cy="230" rx="64" ry="18" fill={shade.dark} opacity="0.35" />
    </g>
  );
}

function MugFinish({ shade }: LayerProps) {
  return (
    <g>
      <ellipse cx="132" cy="86" rx="64" ry="20" fill={shade.light} />
      <ellipse cx="132" cy="86" rx="64" ry="20" fill="none" stroke={shade.mid} strokeWidth="3" />
      <ellipse cx="132" cy="88" rx="46" ry="13" fill="#2a1f18" />
      <ellipse cx="132" cy="90" rx="40" ry="10" fill="#4a331f" opacity="0.65" />
      <path
        d="M78 100 C90 140 90 190 80 220"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        opacity="0.22"
        style={{ mixBlendMode: "screen" }}
      />
      <path
        d="M186 108 C178 150 178 200 188 226"
        fill="none"
        stroke="#000000"
        strokeWidth="10"
        opacity="0.12"
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
}

function ToteBody({ shade, uid }: LayerProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-canvas`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade.light} />
          <stop offset="55%" stopColor={shade.base} />
          <stop offset="100%" stopColor={shade.dark} />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="300" rx="80" ry="10" fill="rgba(0,0,0,0.2)" />
      <path
        d="M92 78 C92 42 118 28 140 28 C162 28 188 42 188 78"
        fill="none"
        stroke={shade.dark}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M92 78 C92 42 118 28 140 28 C162 28 188 42 188 78"
        fill="none"
        stroke={shade.light}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path d="M52 86 L228 86 L214 292 L66 292 Z" fill={`url(#${uid}-canvas)`} />
      <path d="M52 86 L228 86 L214 292 L66 292 Z" fill={`url(#${uid}-fabric)`} />
      <path d="M140 86 L140 292" stroke={shade.deep} strokeWidth="1.4" opacity="0.12" />
      <path d="M66 250 L214 250 L214 292 L66 292 Z" fill={shade.dark} opacity="0.12" />
    </g>
  );
}

function ToteFinish({ shade }: LayerProps) {
  return (
    <g>
      <path d="M52 86 L228 86" stroke={shade.mid} strokeWidth="6" />
      <path
        d="M70 100 C110 70 170 70 210 100"
        fill="none"
        stroke={shade.light}
        strokeWidth="12"
        opacity="0.12"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

function CapBody({ shade, uid }: LayerProps) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-cap`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={shade.light} />
          <stop offset="55%" stopColor={shade.base} />
          <stop offset="100%" stopColor={shade.dark} />
        </linearGradient>
      </defs>
      <ellipse cx="140" cy="292" rx="74" ry="10" fill="rgba(0,0,0,0.22)" />
      <path d="M48 168 C52 92 228 92 232 168" fill={`url(#${uid}-cap)`} />
      <path d="M48 168 C52 92 228 92 232 168" fill={`url(#${uid}-fabric)`} />
      <path d="M140 96 L140 168" stroke={shade.deep} strokeWidth="1.4" opacity="0.2" />
      <path d="M88 118 L96 168" stroke={shade.deep} strokeWidth="1" opacity="0.16" />
      <path d="M192 118 L184 168" stroke={shade.deep} strokeWidth="1" opacity="0.16" />
      <ellipse cx="140" cy="168" rx="92" ry="22" fill={shade.mid} />
    </g>
  );
}

function CapFinish({ shade }: LayerProps) {
  return (
    <g>
      <path
        d="M42 168 C86 196 196 200 248 158 L236 176 C190 214 84 210 52 182 Z"
        fill={mixHex(shade.base, "#d6d3d1", 0.35)}
      />
      <path
        d="M42 168 C86 196 196 200 248 158 L236 176 C190 214 84 210 52 182 Z"
        fill="none"
        stroke={shade.dark}
        strokeWidth="2"
      />
      <path d="M58 176 C110 204 200 200 230 166" fill="none" stroke={shade.deep} strokeWidth="3" opacity="0.25" />
      <circle cx="140" cy="104" r="7" fill={shade.light} stroke={shade.dark} strokeWidth="1" />
      <path
        d="M70 120 C110 88 176 86 214 122"
        fill="none"
        stroke={shade.light}
        strokeWidth="8"
        opacity="0.16"
        style={{ mixBlendMode: "screen" }}
      />
    </g>
  );
}

function Print3dBody({ shade }: LayerProps) {
  return (
    <g>
      <ellipse cx="140" cy="304" rx="72" ry="8" fill="rgba(0,0,0,0.22)" />
      <rect x="54" y="42" width="172" height="14" rx="3" fill="#2c2622" />
      <rect x="56" y="42" width="12" height="198" rx="2" fill="#3a332e" />
      <rect x="212" y="42" width="12" height="198" rx="2" fill="#3a332e" />
      <rect x="50" y="232" width="180" height="14" rx="3" fill="#1a1613" />
      <path d="M74 222 L206 222 L194 244 L86 244 Z" fill="#4a433c" />
      <path d="M86 244 L194 244 L188 252 L92 252 Z" fill="#2a2420" />
      <rect x="126" y="56" width="28" height="40" rx="3" fill="#2c2622" />
      <path d="M130 96 L166 96 L148 118 Z" fill="#ff3d7f" />
      <ellipse cx="148" cy="216" rx="26" ry="7" fill={shade.dark} opacity="0.55" />
      <path
        d="M128 214 C128 176 168 176 168 214 L160 214 C160 188 136 188 136 214 Z"
        fill={shade.base}
      />
      <circle cx="148" cy="158" r="20" fill={shade.base} />
      <path d="M134 146 L132 128 L142 140 Z" fill={shade.mid} />
      <path d="M162 146 L164 128 L154 140 Z" fill={shade.mid} />
      <circle cx="141" cy="156" r="3.2" fill="#16120f" />
      <circle cx="155" cy="156" r="3.2" fill="#16120f" />
    </g>
  );
}

function Print3dFinish({ shade }: LayerProps) {
  return (
    <g>
      <path
        d="M138 148 C146 136 162 138 164 150"
        fill="none"
        stroke={shade.light}
        strokeWidth="5"
        opacity="0.28"
        style={{ mixBlendMode: "screen" }}
      />
      <rect x="126" y="56" width="28" height="6" rx="1" fill="#5a524c" />
    </g>
  );
}

function PhotoGarment({ src, color }: { src: string; color: string }) {
  const mask: CSSProperties = {
    backgroundColor: color,
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={mask} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
      />
    </div>
  );
}

const printBox: Record<ProductKind, Record<string, string>> = {
  shirt: {
    chest: "top-[32%] left-[34%] h-[16%] w-[32%]",
    center: "top-[34%] left-[31%] h-[38%] w-[38%]",
    back: "top-[34%] left-[31%] h-[38%] w-[38%]",
    wrap: "top-[34%] left-[31%] h-[38%] w-[38%]",
  },
  hoodie: {
    chest: "top-[34%] left-[38%] h-[16%] w-[24%]",
    center: "top-[36%] left-[33%] h-[24%] w-[34%]",
    back: "top-[36%] left-[33%] h-[30%] w-[34%]",
    wrap: "top-[36%] left-[33%] h-[24%] w-[34%]",
  },
  mug: {
    chest: "top-[38%] left-[32%] h-[26%] w-[26%]",
    center: "top-[38%] left-[31%] h-[28%] w-[28%]",
    back: "top-[38%] left-[31%] h-[28%] w-[28%]",
    wrap: "top-[36%] left-[28%] h-[32%] w-[34%]",
  },
  tote: {
    chest: "top-[40%] left-[32%] h-[22%] w-[36%]",
    center: "top-[42%] left-[30%] h-[34%] w-[40%]",
    back: "top-[42%] left-[30%] h-[34%] w-[40%]",
    wrap: "top-[42%] left-[30%] h-[34%] w-[40%]",
  },
  cap: {
    chest: "top-[28%] left-[38%] h-[16%] w-[24%]",
    center: "top-[26%] left-[37%] h-[18%] w-[26%]",
    back: "top-[26%] left-[37%] h-[18%] w-[26%]",
    wrap: "top-[26%] left-[37%] h-[18%] w-[26%]",
  },
  print3d: {
    chest: "top-[44%] left-[34%] h-[32%] w-[32%]",
    center: "top-[44%] left-[34%] h-[32%] w-[32%]",
    back: "top-[44%] left-[34%] h-[32%] w-[32%]",
    wrap: "top-[44%] left-[34%] h-[32%] w-[32%]",
  },
};

export function ProductMock({
  kind,
  color,
  design = "blank",
  text,
  textColor,
  position = "center",
  artworkUrl,
  className,
  studio,
  hidePrint,
  placement,
  stamps,
  view: viewProp,
  children,
}: ProductMockProps) {
  const uid = useId().replace(/:/g, "");
  const shade = shades(color);
  const dark = isDarkHex(color);
  const view: PrintSide =
    viewProp ?? (position === "back" ? "back" : "front");
  const layer = { shade, uid, view };
  const photo = getProductPhoto(kind, view);
  const photoMeta = getProductPhotoMeta(kind, view);
  const sideStamps = (stamps ?? []).filter((stamp) => stamp.side === view);
  const usingStamps = Array.isArray(stamps);
  const hasPrint =
    !hidePrint &&
    Boolean(
      sideStamps.length ||
        (!usingStamps && (artworkUrl || text || (design && design !== "blank"))) ||
        (usingStamps && text && !sideStamps.length),
    );
  const printStyle: CSSProperties | undefined = placement
    ? {
        left: `${placement.x}%`,
        top: `${placement.y}%`,
        width: `${placement.width}%`,
        height: `${placement.height}%`,
      }
    : undefined;

  return (
    <div
      className={`relative isolate w-full ${photo ? "mock-photo" : "aspect-[7/8]"} ${className ?? ""}`}
      style={
        photoMeta
          ? { aspectRatio: `${photoMeta.width} / ${photoMeta.height}` }
          : undefined
      }
    >
      {photo ? (
        <PhotoGarment src={photo} color={color} />
      ) : (
        <svg viewBox="0 0 280 320" className="h-full w-full overflow-visible">
          <defs>
            <FabricPattern uid={uid} dark={dark} />
          </defs>
          {kind === "shirt" ? <ShirtBody {...layer} /> : null}
          {kind === "hoodie" ? <HoodieBody {...layer} /> : null}
          {kind === "mug" ? <MugBody {...layer} /> : null}
          {kind === "tote" ? <ToteBody {...layer} /> : null}
          {kind === "cap" ? <CapBody {...layer} /> : null}
          {kind === "print3d" ? <Print3dBody {...layer} /> : null}
        </svg>
      )}

      {hasPrint && sideStamps.length ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={
            photo
              ? {
                  WebkitMaskImage: `url(${photo})`,
                  maskImage: `url(${photo})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }
              : undefined
          }
        >
          {sideStamps.map((stamp) => (
            <div
              key={stamp.id}
              className="absolute"
              style={{
                left: `${stamp.placement.x}%`,
                top: `${stamp.placement.y}%`,
                width: `${stamp.placement.width}%`,
                height: `${stamp.placement.height}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stamp.artworkDataUrl}
                alt=""
                className={`h-full w-full object-contain ${dark ? "mix-blend-soft-light" : "mix-blend-multiply"}`}
              />
            </div>
          ))}
        </div>
      ) : hasPrint ? (
        <PrintSurface
          className={placement ? undefined : printBox[kind][position]}
          style={printStyle}
        >
          <div
            className={`print-art print-${kind} ${position === "wrap" ? "print-wrap" : ""} ${dark ? "print-dark" : "print-light"}`}
          >
            <DesignArt
              design={usingStamps ? "blank" : design}
              text={text}
              textColor={textColor}
              artworkUrl={usingStamps ? null : artworkUrl}
              compact={kind === "cap"}
            />
          </div>
        </PrintSurface>
      ) : null}

      {children}

      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          className="pointer-events-none absolute inset-0 z-[2] h-full w-full object-contain mix-blend-multiply opacity-40"
        />
      ) : (
        <svg viewBox="0 0 280 320" className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-visible">
          {kind === "shirt" ? <ShirtFinish {...layer} /> : null}
          {kind === "hoodie" ? <HoodieFinish {...layer} /> : null}
          {kind === "mug" ? <MugFinish {...layer} /> : null}
          {kind === "tote" ? <ToteFinish {...layer} /> : null}
          {kind === "cap" ? <CapFinish {...layer} /> : null}
          {kind === "print3d" ? <Print3dFinish {...layer} /> : null}
        </svg>
      )}

      {studio ? (
        <div className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.14),transparent_36%)]" />
      ) : null}
    </div>
  );
}
