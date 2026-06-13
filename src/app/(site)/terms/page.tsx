import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { termsOfService } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use | Hoahwa",
  description:
    "The terms that govern use of the Hoahwa website, intellectual property, and liability.",
};

export default function TermsPage() {
  return <LegalPageView doc={termsOfService} />;
}
