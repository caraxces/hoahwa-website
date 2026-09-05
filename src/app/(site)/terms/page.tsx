import { LegalPageView } from "@/components/legal/LegalPageView";
import { termsOfService } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that govern use of the Hoahwa website, intellectual property, and liability.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPageView doc={termsOfService} />;
}
