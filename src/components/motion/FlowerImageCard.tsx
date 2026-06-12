import Image from "next/image";
import { cn } from "@/lib/cn";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";

type FlowerImageCardProps = {
  src: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** sm = inline hero headline (300×88); lg = growth pitch column */
  size?: "sm" | "lg";
  /** Pull image over adjacent headline text */
  overlapText?: boolean;
};

export function FlowerImageCard({
  src,
  alt = "",
  sizes,
  priority,
  className,
  size = "sm",
  overlapText = false,
}: FlowerImageCardProps) {
  const isSm = size === "sm";

  return (
    <div
      className={cn(
        "group-hover-flowers flower-image-card relative shrink-0",
        isSm ? "flower-image-card--sm h-[88px] w-[300px]" : "flower-image-card--lg w-full",
        overlapText && "flower-image-card--overlap z-30",
        className,
      )}
    >
      <div
        className={cn(
          "relative isolate h-full w-full",
          !isSm && "aspect-[660/699] lg:h-[699px]",
        )}
      >
        <div className="flower-image-card__media relative z-[1] h-full w-full overflow-hidden rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/15">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes ?? (isSm ? "300px" : "(max-width: 1024px) 100vw, 660px")}
            priority={priority}
          />
        </div>
        <FlowersOverlay className="!z-[60]" />
      </div>
    </div>
  );
}
