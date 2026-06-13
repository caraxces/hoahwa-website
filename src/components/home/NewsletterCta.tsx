import Image from "next/image";
import Link from "next/link";
import { poolCta } from "@/content/home";
import { figmaAssets } from "@/content/figma-assets";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";
import { FlowerBorderMarquee } from "@/components/layout/FlowerBorderMarquee";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/cn";

const CTA_HERO_W = 1123;
const CTA_HERO_H = 1401;

export function NewsletterCta() {
  return (
    <section
      className="relative z-50 bg-[var(--wiro-romance)]"
      data-node-id="1:1100"
    >
      <div className="group-hover-flowers relative isolate w-full overflow-visible">
        <Image
          src={figmaAssets.insightsHero}
          alt=""
          width={CTA_HERO_W}
          height={CTA_HERO_H}
          className="block h-auto w-full"
          sizes="100vw"
          priority={false}
        />
        <FlowersOverlay className="!z-[60] !text-[22px]" />

        {/* Floral seam: bottom of hero image → top of footer */}
        <FlowerBorderMarquee className="absolute inset-x-0 bottom-0 z-[25] translate-y-[38%] md:translate-y-[42%]" />

        {/* Soft soil haze — flowers root into a blurred patch of footer "earth" */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 z-[26] h-24 translate-y-full md:h-28",
            "bg-gradient-to-t from-[var(--hoahwa-accent)] via-[var(--hoahwa-accent)]/55 to-transparent",
            "backdrop-blur-[2.5px] [mask-image:linear-gradient(to_top,black_35%,transparent)]",
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-30",
            "px-[var(--wiro-page-pad)] pb-[121px] pt-24",
            "bg-gradient-to-t from-[var(--wiro-black)]/55 via-[var(--wiro-black)]/20 to-transparent",
          )}
        >
          <div className="mx-auto w-full max-w-[var(--wiro-container)] px-[var(--wiro-gutter)]">
            <Reveal variants={fadeUp}>
              <div className="max-w-[976px]">
                <h3 className="mb-8 text-h3 text-[var(--wiro-romance)]">
                  {poolCta.headline.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--wiro-romance)] px-4 py-2.5 text-base tracking-[-0.02em] text-[var(--wiro-romance)] transition-colors hover:bg-[var(--wiro-romance)] hover:text-[var(--wiro-cod-gray)]"
                >
                  {poolCta.cta}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
