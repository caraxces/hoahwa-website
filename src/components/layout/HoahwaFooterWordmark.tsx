import { cn } from "@/lib/cn";

type HoahwaFooterWordmarkProps = {
  className?: string;
};

/** Full-height footer marquee wordmark — vector, transparent, tight crop */
export function HoahwaFooterWordmark({ className }: HoahwaFooterWordmarkProps) {
  return (
    <svg
      viewBox="0 0 900 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hoahwa"
      preserveAspectRatio="xMinYMid meet"
      className={cn("h-full w-auto shrink-0 text-[var(--wiro-cod-gray)]", className)}
    >
      <text
        x="0"
        y="242"
        fill="currentColor"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="252"
        fontWeight="700"
        letterSpacing="-18"
      >
        HOAHWA
      </text>
    </svg>
  );
}
