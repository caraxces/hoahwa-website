import { cn } from "@/lib/cn";

type HoahwaFooterWordmarkProps = {
  className?: string;
};

/** Full-height footer marquee wordmark — uses official brand image (board-09) */
export function HoahwaFooterWordmark({ className }: HoahwaFooterWordmarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/LOGO HOAHWA/hoahwa_logo_board-09.png"
      alt="HOAHWA"
      draggable={false}
      className={cn("h-full w-auto shrink-0 object-contain", className)}
    />
  );
}
