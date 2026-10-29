import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudyVietfolk } from "@/content/case-study-vietfolk";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/vietfolk-winter-2026";

const TITLE = "Vietfolk ’26 — A Shopify Editions Page Rebuilt in Vietnamese";
const DESCRIPTION =
  "How we rebuilt a Shopify Editions-style launch microsite as a Vietnamese technical demo: 12 WebGL scenes, 47 compressed 3D models, 6,352 words rewritten for implementers — and what the 8 MB page cost us.";
const PUBLISHED = "2026-09-05T00:00:00.000Z";
const TAGS = ["Shopify", "WebGL", "Vietnamese", "Case study", "Vietfolk ’26"];
const HERO_IMAGE = "/img/vietfolk/hero-vietfolk-fullwidth-desktop-v2.webp";

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: "/og/vietfolk-winter-2026.png",
    type: "article",
    publishedTime: PUBLISHED,
    tags: TAGS,
  }),
};

export default function VietfolkCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Vietfolk ’26", path: PATH },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: PUBLISHED,
          image: HERO_IMAGE,
          tags: TAGS,
        })}
      />
      <CaseStudyLayout content={caseStudyVietfolk} />
    </>
  );
}
