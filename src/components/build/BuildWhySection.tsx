import Link from "next/link";
import {
  buildMigration,
  buildProcess,
  buildWhy,
} from "@/content/build";
import { figmaAssets } from "@/content/figma-assets";
import { ExpertBlock } from "@/components/service/ExpertBlock";
import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";

const clientLogos = [
  { src: figmaAssets.awardUkEcom, alt: "piglet in bed", width: 128 },
  { src: figmaAssets.awardEuropean, alt: "WatchHouse", width: 200 },
  { src: figmaAssets.awardUkEcom, alt: "Sisters and Seekers", width: 170 },
  { src: figmaAssets.awardEuropean, alt: "Brother and Kin", width: 170 },
  { src: figmaAssets.awardUkEcom, alt: "Kick Game", width: 160 },
];

export function BuildWhySection() {
  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-[121px] pt-20 text-[var(--wiro-cod-gray)]"
      data-node-id="3:10641"
    >
      <PageContainer>
        <div className="flex flex-col gap-20 lg:flex-row lg:justify-between">
          <p className="shrink-0 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
            {buildWhy.label}
          </p>
          <div className="max-w-[867px] flex-1">
            <h2 className="text-h3">{buildWhy.headline}</h2>
            <div className="mt-8 flex flex-col gap-6 text-base leading-6 tracking-[-0.03em]">
              {buildWhy.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>

        <LogoMarquee
          logos={clientLogos}
          fadeFrom="romance"
          className="my-20 h-[139px]"
          testId="build-client-logos"
        />

        <div className="flex flex-col gap-24">
          <ExpertBlock
            headline={buildProcess.headline}
            accentLineIndex={1}
            body={buildProcess.body}
            imageSrc={figmaAssets.buildProcessImage}
            imageAlt="Shopify build process showcase"
          />

          <ExpertBlock
            headline={buildMigration.headline}
            body={buildMigration.body}
            imageSrc={figmaAssets.buildMigrationImage}
            imageAlt="Shopify migration case study"
            imageFirst
          >
            <div className="mt-10 flex flex-wrap items-center gap-8 opacity-70">
              {buildMigration.platforms.map((platform) => (
                <span
                  key={platform}
                  className="text-sm font-medium uppercase tracking-widest text-[var(--wiro-cod-gray)]"
                >
                  {platform}
                </span>
              ))}
            </div>
          </ExpertBlock>
        </div>
      </PageContainer>
    </PageSection>
  );
}
