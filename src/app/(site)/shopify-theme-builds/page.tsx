import { BuildPageView } from "@/components/build/BuildPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Design & Development | Hoahwa",
  description:
    "Boutique web design & development focusing on high-end aesthetics, cost-effective pricing, and top-tier browser compatibility.",
};

export default function BuildPage() {
  return <BuildPageView />;
}
