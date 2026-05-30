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
    <div className={cn("group-hover-flowers relative overflow-visible", wrapperClassName)}>
      <Image {...props} fill className={cn("object-cover", className)} />
      <FlowersOverlay className={overlayClassName} />
    </div>
  );
}

