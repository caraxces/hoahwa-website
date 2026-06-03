import { cn } from "@/lib/cn";

type CookieIconProps = {
  className?: string;
  size?: number;
};

/** Small cookie glyph for the consent bar */
export function CookieIcon({ className, size = 20 }: CookieIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9.5" fill="var(--wiro-mauve)" fillOpacity="0.35" />
      <circle cx="12" cy="12" r="9.5" stroke="var(--wiro-mauve)" strokeWidth="1.25" />
      <circle cx="8.5" cy="9" r="1.1" fill="var(--wiro-cod-gray)" fillOpacity="0.55" />
      <circle cx="14" cy="8" r="0.9" fill="var(--wiro-cod-gray)" fillOpacity="0.45" />
      <circle cx="15.5" cy="13" r="1" fill="var(--wiro-cod-gray)" fillOpacity="0.5" />
      <circle cx="9" cy="14.5" r="0.85" fill="var(--wiro-cod-gray)" fillOpacity="0.4" />
      <circle cx="12.5" cy="11" r="0.75" fill="var(--wiro-cod-gray)" fillOpacity="0.35" />
      <path
        d="M12 3.5c2.2 0 4.2 1.1 5.4 2.9"
        stroke="var(--wiro-chenin)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
