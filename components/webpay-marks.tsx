type WebpayLogoProps = {
  onDark?: boolean;
  className?: string;
};

export function WebpayLogo({ onDark = false, className }: WebpayLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={onDark ? "/checkout/webpay-on-dark.png" : "/checkout/webpay.png"}
      alt="Webpay"
      className={className ?? "h-8 w-auto"}
    />
  );
}

export function WebpayTrustBlock({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center" : "flex items-center py-1"}>
      <WebpayLogo onDark={onDark} className={compact ? "h-7 w-auto" : "h-10 w-auto"} />
    </div>
  );
}
