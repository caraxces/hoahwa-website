import { figmaAssets } from "@/content/figma-assets";
import { cn } from "@/lib/cn";

type FlowerBorderMarqueeProps = {
  className?: string;
};

/** White floral strip — use absolute bottom on CTA image, or inline before footer. */
export function FlowerBorderMarquee({ className }: FlowerBorderMarqueeProps) {
  return (
    <div
      className={cn("pointer-events-none overflow-x-clip", className)}
      aria-hidden
      data-name="Decorative border"
    >
      <div className="flex h-52 items-end overflow-hidden md:h-64">
        <div className="animate-decor-marquee-wobble flex w-full items-end">
          <div className="flex w-max animate-decor-marquee items-end">
            {Array.from({ length: 6 }).map((_, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={figmaAssets.decorativeBorder}
                alt=""
                className="h-52 w-auto max-w-none shrink-0 object-bottom brightness-0 invert md:h-64"
                draggable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
