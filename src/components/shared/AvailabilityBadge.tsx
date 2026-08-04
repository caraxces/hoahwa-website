import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const HOAHWA_MARK = "/logo-hoahwa/hoahwa_logo_board-07.png";

/**
 * Studio availability lockup shown beside the wordmark in heroes and the footer.
 * Replaces the previous "Want bE your PARTNER !" badge, which read as a typo and
 * carried a partner-tier claim we do not hold.
 */
export function AvailabilityBadge({
  className,
  size = "md",
  variant = "dark",
  href = "/book",
}: {
  className?: string;
  size?: "md" | "lg";
  variant?: "dark" | "light";
  /** Set to null to render as a static badge instead of a link. */
  href?: string | null;
}) {
  const isLight = variant === "light";
  const iconSize = size === "md" ? 40 : 48;

  const content = (
    <>
      <Image
        src={HOAHWA_MARK}
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
        <span className="block font-medium uppercase opacity-60">Open for</span>
        <span className="block font-medium uppercase">new projects</span>
      </div>
    </>
  );

  const classes = cn(
    "flex items-center gap-3",
    isLight ? "text-[var(--wiro-romance)]" : "text-[var(--wiro-cod-gray)]",
    href && "transition-opacity hover:opacity-70",
    className,
  );

  if (!href) {
    return (
      <div className={classes} aria-label="Open for new projects">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
