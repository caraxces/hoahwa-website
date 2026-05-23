import Image from "next/image";
import Link from "next/link";
import { poolCta } from "@/content/home";
import { figmaAssets } from "@/content/figma-assets";
import { Reveal } from "@/components/motion/Reveal";
import { fadeUp } from "@/lib/motion";

export function NewsletterCta() {
  return (
    <section
      className="relative flex min-h-[min(1024px,100svh)] flex-col justify-end px-[var(--wiro-page-pad)] pb-[121px] pt-[min(704px,65svh)]"
      data-node-id="1:1100"
    >
      <Image
        src={figmaAssets.ctaPool}
        alt=""
        fill
        className="object-cover object-top"
        sizes="100vw"
        priority={false}
      />
      <div className="relative z-10 mx-auto w-full max-w-[var(--wiro-container)] px-[var(--wiro-gutter)]">
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
    </section>
  );
}
