"use client";

import { useMemo, useState } from "react";
import { caseStudies, caseStudyFilters } from "@/content/case-studies";
import { ProjectCard } from "@/components/figma/ProjectCard";
import { FilterBar } from "@/components/shared/FilterBar";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function CaseStudiesPageView() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return caseStudies;
    return caseStudies.filter((c) => c.tags.includes(activeFilter));
  }, [activeFilter]);

  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-32 pt-[120px] text-[var(--wiro-romance)]"
    >
      <PageContainer>
        <RevealGroup variants={staggerContainer(0.1, 0)} className="mb-16">
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1">Some of our</h1>
          </Reveal>
          <Reveal clip variants={clipUp}>
            <h1 className="text-h1 text-[var(--wiro-mauve)]">finest work</h1>
          </Reveal>
        </RevealGroup>

        <FilterBar
          filters={caseStudyFilters}
          active={activeFilter}
          onChange={setActiveFilter}
          variant="on-dark"
          className="mb-16"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((project, i) => (
            <Reveal key={project.slug} variants={fadeUp} delay={i * 0.04}>
              <ProjectCard
                project={project}
                href={`/case-studies#${project.slug}`}
                className="h-[min(640px,70vw)] w-full"
              />
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </PageSection>
  );
}
