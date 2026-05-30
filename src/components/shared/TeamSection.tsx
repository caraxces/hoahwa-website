import Image from "next/image";
import { teamMembers, teamSection } from "@/content/team";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function TeamSection() {
  return (
    <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.08, 0.05)}>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              <span className="block">{teamSection.headline[0]}</span>
              <span className="block text-[var(--wiro-mauve)]">{teamSection.headline[1]}</span>
            </h2>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-6 max-w-[640px]">
            <p className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
              {teamSection.lead}
            </p>
          </Reveal>
        </RevealGroup>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {teamMembers.map((member, i) => (
            <Reveal key={member.name} variants={fadeUp} delay={i * 0.06}>
              <article className="overflow-hidden rounded-lg bg-[var(--wiro-spring-wood)]">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                      {member.name}
                    </h3>
                    {member.badge ? (
                      <span className="text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]">
                        {member.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-medium tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60">
                    {member.role}
                  </p>
                  <p className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
                    {member.bio}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
