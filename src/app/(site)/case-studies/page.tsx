import { CaseStudiesPageView } from "@/components/case-studies/CaseStudiesPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies";

export const metadata = pageMetadata({
  title: "Shopify Case Studies",
  description:
    "The goals Hoahwa is pursuing — high-performance Shopify builds, SEO, CRO, and design-led growth. Case studies published as we go.",
  path: PATH,
});

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: PATH },
        ])}
      />
      <CaseStudiesPageView />
    </>
  );
}
