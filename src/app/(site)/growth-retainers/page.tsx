import { GrowthPageView } from "@/components/growth/GrowthPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Growth Retainers | Hoahwa",
  description:
    "Ongoing CRO, strategy, and development retainers to compound eCommerce growth month over month.",
};

export default function GrowthPage() {
  return <GrowthPageView />;
}
