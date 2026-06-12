import Image from "next/image";
import { cn } from "@/lib/cn";

const HOAHWA_PARTNER_LOGO = "/LOGO HOAHWA/hoahwa_logo_board-07.png";

export function ShopifyPremierBadge({
  className,
  size = "md",
  variant = "dark",
}: {
  className?: string;
  size?: "md" | "lg";
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";
  const iconSize = size === "md" ? 40 : 48;

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isLight ? "text-[var(--wiro-romance)]" : "text-[var(--wiro-cod-gray)]",
        className,
      )}
      aria-label="Want to be your partner"
    >
      <Image
        src={HOAHWA_PARTNER_LOGO}
        alt=""
        width={iconSize}
        height={iconSize}
        className={cn(
          "shrink-0 rounded-md object-cover shadow-sm",
          size === "md" ? "size-10" : "size-12",
          isLight && "ring-1 ring-white/15",
        )}
      />
      <div
        className={cn(
          "leading-tight tracking-wide",
          size === "md" ? "text-[10px]" : "text-xs",
        )}
      >
        <span className="block font-medium">Want bE your</span>
        <span className="block font-medium">PARTNER !</span>
      </div>
    </div>
  );
}
