import { CaseStudiesPageView } from "@/components/case-studies/CaseStudiesPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Hoahwa",
  description:
    "The goals Hoahwa is pursuing — high-performance Shopify builds, SEO, CRO, and design-led growth. Case studies published as we go.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageView />;
}
