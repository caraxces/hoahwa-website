import { CaseStudyLayout } from "@/components/case-studies/CaseStudyLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { caseStudyAgentpet } from "@/content/case-study-agentpet";
import { articleSchema, breadcrumbSchema, pageMetadata } from "@/lib/seo";

const PATH = "/case-studies/notch-agent-train";

const TITLE = "Notch Agent Train: A macOS Notch App That Runs AI Coding Agents";
const DESCRIPTION =
  "How we built our own macOS notch app: Claude splits the work and delegates slices to Codex, Cursor, Antigravity, Kimi, opencode or another Claude, with routing by task kind, git worktree isolation, review before merge and live progress in the notch. Updated 28 October 2026.";
const PUBLISHED = "2026-10-28T00:00:00.000Z";
const TAGS = ["macOS", "Swift", "AI agents", "Developer tooling", "Case study", "Multi-agent workflow"];

export const metadata = {
  ...pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    image: "/og/notch-agent-train.png",
    type: "article",
    publishedTime: PUBLISHED,
    tags: TAGS,
  }),
};

export default function NotchAgentTrainCaseStudyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: "Notch Agent Train", path: PATH },
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
      <CaseStudyLayout content={caseStudyAgentpet} />
    </>
  );
}
