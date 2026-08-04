import Link from "next/link";
import { videoTeaser } from "@/content/home";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Pointer to the /video-editor page. Sits between the cod-gray services
 * accordion and the light "where we are" section, so it takes the darkest
 * surface to make that step read as intentional.
 */
export function VideoTeaser() {
  return (
    <PageSection className="bg-[var(--wiro-black)] py-[100px] text-[var(--wiro-romance)]">
      <PageContainer>
        {/* items-center, not items-end — end-aligning left a void beside the copy */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-16">
          <RevealGroup variants={staggerContainer(0.1, 0)}>
            <Reveal variants={fadeUp}>
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                {videoTeaser.eyebrow}
              </p>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h2 className="mt-5 text-[length:var(--wiro-h2)] leading-[1.06] tracking-[-0.04em] max-md:text-[length:var(--wiro-h3)]">
                {videoTeaser.headline[0]}
              </h2>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h2 className="text-[length:var(--wiro-h2)] leading-[1.06] tracking-[-0.04em] max-md:text-[length:var(--wiro-h3)] text-[var(--wiro-mauve)]">
                {videoTeaser.headline[1]}
              </h2>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-8 max-w-[560px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                {videoTeaser.lead}
              </p>
            </Reveal>
            <Reveal variants={fadeUp}>
              <Link
                href={videoTeaser.href}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--wiro-romance)]/30 px-5 py-2.5 text-base tracking-[-0.03em] transition-colors hover:bg-[var(--wiro-romance)] hover:text-[var(--wiro-cod-gray)]"
              >
                {videoTeaser.linkLabel}
                <span aria-hidden>↗</span>
              </Link>
            </Reveal>
          </RevealGroup>

          {/* preview row — mirrors the 9:16 reels on /video-editor */}
          <Reveal variants={fadeUp}>
            <ul className="grid grid-cols-3 gap-3">
              {videoTeaser.slots.map((slot) => (
                <li
                  key={slot}
                  className="relative grid aspect-[9/16] place-items-end overflow-hidden rounded-lg border border-[var(--wiro-romance)]/15 bg-[var(--wiro-cod-gray)]"
                >
                  <span className="w-full p-3 text-xs tracking-[-0.02em] text-[var(--wiro-romance)]/60">
                    {slot}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </PageContainer>
    </PageSection>
  );
}
