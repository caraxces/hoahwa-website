import Link from "next/link";
import type { RelatedLink } from "@/content/related";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { fadeUp, staggerContainer } from "@/lib/motion";

type RelatedReadingProps = {
  links: readonly RelatedLink[];
  heading?: string;
};

/**
 * Presentational "Keep reading" block: a heading plus one bordered row per
 * hand-picked link, styled after the related-insights list. Renders nothing
 * when no links are supplied.
 */
export function RelatedReading({
  links,
  heading = "Keep reading",
}: RelatedReadingProps) {
  if (links.length === 0) return null;

  return (
    <RevealGroup variants={staggerContainer(0.08, 0)}>
      <Reveal variants={fadeUp}>
        <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
          {heading}
          <span className="text-[var(--wiro-mauve)]">.</span>
        </h2>
      </Reveal>
      <ul className="mt-8 border-t border-[var(--wiro-cod-gray)]/20">
        {links.map((link) => (
          <Reveal key={link.href} variants={fadeUp}>
            <li className="border-b border-[var(--wiro-cod-gray)]/20">
              <Link
                href={link.href}
                className="group flex min-h-[44px] flex-col justify-center gap-2 py-6 transition-opacity hover:opacity-80 md:flex-row md:items-baseline md:gap-8"
              >
                <span className="shrink-0 text-sm font-medium tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70 md:w-36">
                  {link.kicker}
                </span>
                <span className="text-h3 text-[var(--wiro-cod-gray)]/45 transition-colors group-hover:text-[var(--wiro-cod-gray)]/75">
                  {link.title}
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </RevealGroup>
  );
}
