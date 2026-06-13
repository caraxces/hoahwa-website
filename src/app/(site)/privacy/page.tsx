import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { privacyPolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Hoahwa",
  description:
    "How Hoahwa collects, uses, and protects personal data — covering GDPR, CCPA/CPRA, and Vietnam's personal data protection rules.",
};

export default function PrivacyPage() {
  return <LegalPageView doc={privacyPolicy} />;
}
