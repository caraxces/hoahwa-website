import { LegalPageView } from "@/components/legal/LegalPageView";
import { privacyPolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Hoahwa collects, uses, and protects personal data — covering GDPR, CCPA/CPRA, and Vietnam's personal data protection rules.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPageView doc={privacyPolicy} />;
}
