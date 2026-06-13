import type { Metadata } from "next";
import { CookieCategoryTables } from "@/components/legal/CookieCategoryTables";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { cookiePolicy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookie Policy | Hoahwa",
  description:
    "Every cookie category Hoahwa uses, what's in it, how long it lasts, and how to change your consent at any time.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPageView doc={cookiePolicy}>
      <CookieCategoryTables />
    </LegalPageView>
  );
}
