import { HoahwaCaseStudyView } from "@/components/case-studies/HoahwaCaseStudyView";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/hoahwa-com";

const TITLE = "Building hoahwa.com — Our First Case Study";
const DESCRIPTION =
  "How we built our own site: static export on Next.js 16, a seven-dependency budget, and a 98.7% image-weight reduction — with every number measured from the production build.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: "article",
  publishedTime: "2026-07-29T00:00:00.000Z",
  tags: ["Next.js", "Performance", "Static export", "Case study"],
});

export default function HoahwaCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Building hoahwa.com", path: PATH },
        ])}
      />
      <JsonLd
        data={articleSchema({
          title: TITLE,
          description: DESCRIPTION,
          path: PATH,
          datePublished: "2026-07-29T00:00:00.000Z",
          tags: ["Next.js", "Performance", "Static export", "Case study"],
        })}
      />
      <HoahwaCaseStudyView />
    </>
  );
}
