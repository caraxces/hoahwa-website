import { CareersPageView } from "@/components/careers/CareersPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Hoahwa",
  description: "Join Hoahwa—a remote Shopify Plus growth agency.",
};

export default function CareersPage() {
  return <CareersPageView />;
}
