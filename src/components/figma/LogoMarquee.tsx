"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

type Logo = { src: string; alt: string; width?: number; height?: number };

export function LogoMarquee({
  logos,
  className,
  fadeFrom = "black",
  testId,
}: {
  logos: Logo[];
  className?: string;
  fadeFrom?: "black" | "romance";
  testId?: string;
}) {
  const fade =
    fadeFrom === "romance"
      ? "from-[var(--wiro-romance)]"
      : "from-[var(--wiro-black)]";

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      data-testid={testId}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r to-transparent",
          fade,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l to-transparent",
          fade,
        )}
      />
      <div className="flex w-max animate-marquee-left items-center gap-[78px] py-4">
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="relative flex h-[110px] shrink-0 items-center justify-center"
            style={{ width: logo.width ?? 140 }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width ?? 105}
              height={logo.height ?? 80}
              className="h-auto max-h-[110px] w-auto object-contain"
              unoptimized={logo.src.startsWith("http")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
