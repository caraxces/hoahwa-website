import { CaseStudiesPageView } from "@/components/case-studies/CaseStudiesPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Hoahwa",
  description: "Shopify Plus case studies from Hoahwa—builds, migrations, CRO and growth.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesPageView />;
}
