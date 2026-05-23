import { cn } from "@/lib/cn";

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
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isLight ? "text-[var(--wiro-romance)]" : "text-[var(--wiro-cod-gray)]",
        className,
      )}
      aria-label="Shopify Premier Partner"
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center font-medium",
          size === "md" ? "size-10 text-[10px]" : "size-12 text-xs",
          isLight
            ? "bg-[var(--wiro-romance)] text-[var(--wiro-cod-gray)]"
            : "bg-[var(--wiro-cod-gray)] text-[var(--wiro-romance)]",
        )}
      >
        S
      </span>
      <div
        className={cn(
          "leading-tight tracking-wide",
          size === "md" ? "text-[10px]" : "text-xs",
        )}
      >
        <span className="block opacity-80">SHOPIFY</span>
        <span className="block font-medium">PREMIER</span>
        <span className="block font-medium">PARTNER</span>
      </div>
    </div>
  );
}
