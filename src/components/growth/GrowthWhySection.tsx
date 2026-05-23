import Link from "next/link";
import { growthWhy } from "@/content/growth";
import { figmaAssets } from "@/content/figma-assets";
import { LogoMarquee } from "@/components/figma/LogoMarquee";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";

const clientLogos = [
  { src: figmaAssets.awardUkEcom, alt: "piglet in bed", width: 128 },
  { src: figmaAssets.awardEuropean, alt: "WatchHouse", width: 200 },
  { src: figmaAssets.awardUkEcom, alt: "Sisters and Seekers", width: 170 },
  { src: figmaAssets.awardEuropean, alt: "Brother and Kin", width: 170 },
  { src: figmaAssets.awardUkEcom, alt: "Kick Game", width: 160 },
];

export function GrowthWhySection() {
  return (
    <PageSection className="bg-[var(--wiro-romance)] pb-[121px] pt-20 text-[var(--wiro-cod-gray)]">
      <PageContainer>
        <div className="flex flex-col gap-20 lg:flex-row lg:justify-between">
          <p className="shrink-0 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
            {growthWhy.label}
          </p>
          <div className="max-w-[867px] flex-1">
            <h2 className="text-h3">{growthWhy.headline}</h2>
            <div className="mt-8 flex flex-col gap-6 text-base leading-6 tracking-[-0.03em]">
              {growthWhy.body.map((p) => (
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
          testId="growth-client-logos"
        />

        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-[640px] flex-1">
            <h3 className="text-[length:var(--wiro-h3)] leading-[var(--wiro-h3)] tracking-[-0.06em]">
              {growthWhy.partners.title}
            </h3>
            <p className="mt-6 text-base leading-6 tracking-[-0.03em]">
              {growthWhy.partners.body}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 lg:max-w-[520px]">
            {growthWhy.stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-[length:72px] leading-none tracking-[-0.08em] text-[var(--wiro-mauve)]">
                  {stat.value}
                </p>
                <p className="mt-2 text-base tracking-[-0.03em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 max-w-[867px]">
          <h3 className="text-[length:var(--wiro-h3)] leading-[var(--wiro-h3)] tracking-[-0.06em]">
            {growthWhy.cro.title}
          </h3>
          <p className="mt-6 text-base leading-6 tracking-[-0.03em]">
            {growthWhy.cro.body}
          </p>
        </div>
      </PageContainer>
    </PageSection>
  );
}
