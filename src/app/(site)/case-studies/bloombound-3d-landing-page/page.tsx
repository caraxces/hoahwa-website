import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudyBloombound } from "@/content/case-study-bloombound";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/bloombound-3d-landing-page";

const TITLE = "BloomBound — A 3D Landing Page You Can Play";
const DESCRIPTION =
  "How we built a playable Three.js landing page for hoahwa.com: nine CC0 models across four instanced districts, a remeshed 22-bone Cyclops animated in code, a Vite game mounted inside a Next.js static export — and the 143 KB gzipped engine that costs.";
const PUBLISHED = "2026-09-08T00:00:00.000Z";
const TAGS = ["WebGL", "Three.js", "3D", "Case study", "BloomBound"];
const HERO_IMAGE = "/img/bloombound/launcher.webp";

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: "/og/bloombound-3d-landing-page.png",
    type: "article",
    publishedTime: PUBLISHED,
    tags: TAGS,
  }),
};

export default function BloomboundCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "BloomBound", path: PATH },
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
      <CaseStudyLayout content={caseStudyBloombound} />
    </>
  );
}
