"use client";

import { usePathname } from "next/navigation";
import { FlowerBorderMarquee } from "@/components/layout/FlowerBorderMarquee";

/** Site-wide floral divider before footer — homepage uses CTA-embedded strip instead. */
export function DecorativeBorderMarquee() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <div data-node-id="24:1243">
      <FlowerBorderMarquee className="relative z-[25] w-full" />
    </div>
  );
}
