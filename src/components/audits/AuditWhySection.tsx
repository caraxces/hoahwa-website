import Image from "next/image";
import Link from "next/link";
import { auditWhy } from "@/content/audits";
import { figmaAssets } from "@/content/figma-assets";
import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { Reveal } from "@/components/motion/Reveal";
import { FlowersOverlay } from "@/components/motion/FlowersOverlay";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { fadeUp } from "@/lib/motion";

const clientLogos = [
  { src: figmaAssets.awardUkEcom, alt: "piglet in bed", width: 128 },
  { src: figmaAssets.awardEuropean, alt: "WatchHouse", width: 200 },
  { src: figmaAssets.awardUkEcom, alt: "Sisters and Seekers", width: 170 },
  { src: figmaAssets.awardEuropean, alt: "Brother and Kin", width: 170 },
  { src: figmaAssets.awardUkEcom, alt: "Kick Game", width: 160 },
];

export function AuditWhySection() {
  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-[121px] pt-20 text-[var(--wiro-cod-gray)]"
      data-node-id="3:5280"
    >
      <PageContainer>
        <div className="flex flex-col gap-20 lg:flex-row lg:justify-between">
          <p className="shrink-0 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
            {auditWhy.label}
          </p>
          <div className="max-w-[867px] flex-1">
            <h2 className="text-h3">
              {auditWhy.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="mt-8 flex flex-col gap-6 text-base leading-6 tracking-[-0.03em]">
              {auditWhy.body.map((p) => (
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
          testId="audit-client-logos"
        />

        <div className="flex flex-col gap-12 lg:flex-row lg:items-end">
          <div className="max-w-[640px] flex-1">
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.08em]">
              <span className="block">{auditWhy.insightsHeadline[0]}</span>
              <span className="block text-[var(--wiro-mauve)]">
                {auditWhy.insightsHeadline[1]}
              </span>
            </h2>
            <p className="mt-9 max-w-[519px] text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
              {auditWhy.insightsBody}
            </p>
          </div>
          <Reveal variants={fadeUp} className="w-full lg:w-[640px] lg:shrink-0">
            <div className="group-hover-flowers relative aspect-[640/690] w-full overflow-visible">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <Image
                  src={figmaAssets.auditInsightsScreenshot}
                  alt="CRO audit insights example"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
              <FlowersOverlay className="!text-[22px]" />
            </div>
          </Reveal>
        </div>
      </PageContainer>
    </PageSection>
  );
}
