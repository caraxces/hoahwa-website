import { CookieCategoryTables } from "@/components/legal/CookieCategoryTables";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { cookiePolicy } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description:
    "Every cookie category Hoahwa uses, what's in it, how long it lasts, and how to change your consent at any time.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageView doc={cookiePolicy}>
      <CookieCategoryTables />
    </LegalPageView>
  );
}
