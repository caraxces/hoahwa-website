import { InsightsPageView } from "@/components/insights/InsightsPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "eCommerce Insights | Hoahwa",
  description: "Latest eCommerce, Shopify, and CRO insights from Hoahwa.",
};

export default function InsightsPage() {
  return <InsightsPageView />;
}
