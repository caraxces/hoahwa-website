import type { ReactNode } from "react";
import Image from "next/image";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/motion";

type ExpertBlockProps = {
  headline: string | string[];
  accentLineIndex?: number;
  body: string;
  imageSrc: string;
  imageAlt: string;
  imageFirst?: boolean;
  children?: ReactNode;
};

export function ExpertBlock({
  headline,
  accentLineIndex,
  body,
  imageSrc,
  imageAlt,
  imageFirst = false,
  children,
}: ExpertBlockProps) {
  const headlineLines = Array.isArray(headline) ? headline : [headline];

  const textBlock = (
    <div className="flex flex-1 flex-col justify-end lg:max-w-[640px]">
      <h2 className="text-[length:72px] leading-[72px] tracking-[-0.08em] text-[var(--wiro-cod-gray)]">
        {headlineLines.map((line, i) => (
          <span
            key={line}
            className={
              accentLineIndex === i
                ? "block text-[var(--wiro-mauve)]"
                : "block"
            }
          >
            {line}
          </span>
        ))}
      </h2>
      <p className="mt-9 max-w-[519px] text-[length:20px] leading-7 tracking-[-0.03em] text-[var(--wiro-cod-gray)]">
        {body}
      </p>
      {children}
    </div>
  );

  const imageBlock = (
    <Reveal variants={fadeUp} className="w-full lg:w-[640px] lg:shrink-0">
      <div className="group-hover-flowers relative aspect-[640/668] w-full overflow-visible">
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
        </div>
        <FlowersOverlay className="!text-[22px]" />
      </div>
    </Reveal>
  );

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:gap-4">
      {imageFirst ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}
