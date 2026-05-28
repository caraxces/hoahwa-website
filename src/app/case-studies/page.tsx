import { CaseStudiesPageView } from "@/components/case-studies/CaseStudiesPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Hoahwa",
  description: "Web design and development case studies from Hoahwa showcasing premium design aesthetics.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageView />;
}
