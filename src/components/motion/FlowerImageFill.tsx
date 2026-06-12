import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";

type FlowerImageFillProps = Omit<ImageProps, "fill"> & {
  wrapperClassName?: string;
  overlayClassName?: string;
};

export function FlowerImageFill({
  wrapperClassName,
  overlayClassName,
  className,
  ...props
}: FlowerImageFillProps) {
  return (
    <div
      className={cn(
        "group-hover-flowers relative isolate overflow-visible",
        wrapperClassName,
      )}
    >
      <div className="absolute inset-0 z-[1]">
        <Image {...props} fill className={cn("object-cover", className)} />
      </div>
      <FlowersOverlay className={cn("!z-[60]", overlayClassName)} />
    </div>
  );
}

