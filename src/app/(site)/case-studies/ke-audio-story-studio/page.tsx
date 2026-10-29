import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudyKe } from "@/content/case-study-ke";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/ke-audio-story-studio";

const TITLE = "Kể — An AI Story Studio That Runs On Your Own Machine";
const DESCRIPTION =
  "How we built a local-first Vietnamese audio story studio: bring-your-own ChatGPT instead of an API bill, an originality gate that measures the script rather than trusting the AI, voice cloning that never leaves the laptop — and the Windows-only transcript bug that three of our tests were mocking out.";
const PUBLISHED = "2026-09-10T00:00:00.000Z";
const TAGS = ["Desktop", "Electron", "AI", "Local-first", "Case study", "Kể"];

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: "/og/ke-audio-story-studio.png",
    type: "article",
    publishedTime: PUBLISHED,
    tags: TAGS,
  }),
};

export default function KeCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Kể", path: PATH },
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
      <CaseStudyLayout content={caseStudyKe} />
    </>
  );
}
