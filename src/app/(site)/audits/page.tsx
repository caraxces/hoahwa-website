import { AuditsPageView } from "@/components/audits/AuditsPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CX, CRO + Tech Audits | Hoahwa",
  description:
    "Data-driven CX, CRO and Technical audits for Shopify brands—actionable insights, prioritised roadmaps, and expert delivery.",
};

export default function AuditsPage() {
  return <AuditsPageView />;
}
