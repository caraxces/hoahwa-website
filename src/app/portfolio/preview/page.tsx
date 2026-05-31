import { PortfolioPreviewClient } from "@/components/portfolio/PortfolioPreviewClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Preview | Hoahwa",
  description: "Live preview of a Hoahwa portfolio landing page.",
  robots: { index: false, follow: false },
};

export default function PortfolioPreviewPage() {
  return <PortfolioPreviewClient />;
}
