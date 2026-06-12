"use client";

import { TeamMemberCard } from "@/components/shared/TeamMemberCard";
import { teamMembers, teamSection } from "@/content/team";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function TeamSection() {
  return (
    <PageSection className="relative overflow-x-clip bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.08, 0.05)}>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              <span className="block">{teamSection.headline[0]}</span>
              <span className="block text-[var(--wiro-mauve)]">
                {teamSection.headline[1]}
              </span>
            </h2>
          </Reveal>
          <Reveal variants={fadeUp} className="mt-6 max-w-[640px]">
            <p className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
              {teamSection.lead}
            </p>
          </Reveal>
        </RevealGroup>

        <div className="relative z-10 mt-16 grid gap-16 md:grid-cols-2 md:gap-x-10 md:gap-y-20">
          {teamMembers.map((member, i) => (
            <TeamMemberCard key={member.name} member={member} delay={i * 0.06} />
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
