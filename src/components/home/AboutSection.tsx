"use client";

import { AboutIntro } from "@/components/home/AboutIntro";
import { AboutScrollFrame } from "@/components/home/AboutScrollFrame";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";

export function AboutSection() {
  return (
    <PageSection className="bg-[var(--wiro-romance)] py-20" data-node-id="1:528">
      <PageContainer>
        <div className="relative z-20 mb-10" data-about-intro>
          <AboutIntro />
        </div>

        <AboutScrollFrame />

        <div id="frame-sequence-end" className="mt-[113px] h-px w-full" aria-hidden />
      </PageContainer>
    </PageSection>
  );
}
