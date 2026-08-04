import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";

type FlowerInlineImageProps = ImageProps & {
  wrapperClassName?: string;
  overlayClassName?: string;
};

export function FlowerInlineImage({
  wrapperClassName,
  overlayClassName,
  className,
  alt,
  ...props
}: FlowerInlineImageProps) {
  return (
    <span className={cn("group-hover-flowers relative inline-block overflow-visible", wrapperClassName)}>
      <Image {...props} alt={alt} className={cn(props.fill ? "object-cover" : "", className)} />
      <FlowersOverlay className={cn("!text-[10px]", overlayClassName)} />
    </span>
  );
}

