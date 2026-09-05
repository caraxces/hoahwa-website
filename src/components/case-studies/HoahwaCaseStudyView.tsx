"use client";

import {
  caseStudyChapters,
  caseStudyCta,
  caseStudyMeta,
  caseStudyStack,
  caseStudyStats,
} from "@/content/case-study-hoahwa";
import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";

export function HoahwaCaseStudyView() {
  return (
    <CaseStudyLayout
      content={{
        meta: {
          ...caseStudyMeta,
          headline: [caseStudyMeta.headline[0], caseStudyMeta.headline[1]],
        },
        stats: caseStudyStats,
        chapters: caseStudyChapters,
        stack: caseStudyStack,
        cta: {
          ...caseStudyCta,
          headline: [caseStudyCta.headline[0], caseStudyCta.headline[1]],
        },
      }}
    />
  );
}
