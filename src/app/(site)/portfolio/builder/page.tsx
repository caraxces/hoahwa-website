import { PortfolioBuilderView } from "@/components/portfolio/builder/PortfolioBuilderView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Builder | Hoahwa",
  description:
    "Create your personal landing page with Hoahwa. Sign in, customize sections, and publish for 100 days.",
  // /portfolio/ is disallowed in robots.ts; say the same thing in the page.
  robots: { index: false, follow: true },
};

export default function PortfolioBuilderPage() {
  return <PortfolioBuilderView />;
}
