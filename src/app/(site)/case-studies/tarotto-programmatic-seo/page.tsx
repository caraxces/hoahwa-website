import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudyTarotto } from "@/content/case-study-tarotto";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/tarotto-programmatic-seo";

const TITLE = "Tarotto — 900+ Pages of Programmatic SEO From a Standing Start";
const DESCRIPTION =
  "How tarotto.io went from zero indexed pages to a 729-page editorial library plus interactive tools in a saturated niche: the content model, bilingual hreflang from day one, and why we report two measurement dates instead of a growth rate.";
const PUBLISHED = "2026-09-08T00:00:00.000Z";
const TAGS = ["SEO", "Programmatic SEO", "Content", "Case study", "Tarotto"];

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: "/og/tarotto-programmatic-seo.png",
    type: "article",
    publishedTime: PUBLISHED,
    tags: TAGS,
  }),
};

export default function TarottoCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Tarotto", path: PATH },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: PUBLISHED,
          tags: TAGS,
        })}
      />
      <CaseStudyLayout content={caseStudyTarotto} />
    </>
  );
}
