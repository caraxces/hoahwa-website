export type PursuitGoal = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const pursuitSection = {
  eyebrow: "What we're pursuing",
  headline: ["Goals we're", "building toward"] as const,
  lead: "We're focused on measurable outcomes. Six in-house case studies are published with every figure measured; client stories follow as each engagement ships.",
};

export const pursuitFilters = [
  "All",
  "Shopify",
  "CRO",
  "SEO",
  "Design",
  "Development",
  "Growth",
  "3D",
  "AI",
  "Desktop",
] as const;

export const pursuitGoals: PursuitGoal[] = [
  {
    slug: "shopify-performance",
    title: "High-performance Shopify builds",
    description:
      "Fast, conversion-ready stores with clean architecture — engineered for scale, not technical debt.",
    tags: ["Shopify", "Development", "CRO"],
  },
  {
    slug: "seo-cro-growth",
    title: "SEO, CRO & ongoing growth",
    description:
      "Search visibility, experiment-led optimisation, and retainer work that compounds revenue over time.",
    tags: ["SEO", "CRO", "Growth"],
  },
  {
    slug: "design-systems",
    title: "Award-caliber design & assets",
    description:
      "Pristine aesthetics, cohesive asset libraries, and UI systems that elevate brand perception on every page.",
    tags: ["Design", "Development"],
  },
  {
    slug: "audit-to-launch",
    title: "Audit-to-launch clarity",
    description:
      "Structured discovery, wireframes, and phased delivery — so clients know exactly what ships and when.",
    tags: ["Shopify", "Development", "Growth"],
  },
  {
    slug: "bloombound-3d-landing-page",
    title: "Interactive 3D on the web",
    description:
      "BloomBound — a playable Three.js landing page: four instanced districts, a remeshed 22-bone enemy animated in code, 96 automated browser checks.",
    tags: ["3D", "Development", "Design"],
  },
  {
    slug: "tarotto-programmatic-seo",
    title: "Programmatic content at volume",
    description:
      "Tarotto \u2014 910 sitemap URLs from zero indexing in April 2026: one template, a real content model, and bilingual hreflang from day one.",
    tags: ["SEO", "Development", "Growth"],
  },
  {
    slug: "ke-audio-story-studio",
    title: "Local-first AI software",
    description:
      "K\u1ec3 \u2014 a Vietnamese audio story studio that runs entirely on the user's laptop: bring-your-own ChatGPT, an originality gate that measures the script, voice cloning with no upload.",
    tags: ["Desktop", "AI", "Development"],
  },
  {
    slug: "notch-agent-train",
    title: "AI-orchestrated engineering",
    description:
      "Notch Agent Train — a macOS notch app where Claude splits work and delegates slices to Codex, Cursor, Antigravity, Kimi and opencode, each in its own git worktree, reviewed before merge.",
    tags: ["Desktop", "AI", "Development"],
  },
  {
    slug: "case-studies",
    title: "Published case studies",
    description:
      "Documenting real outcomes — this site, the Vietfolk ’26 Editions rebuild, BloomBound, Tarotto, Kể and Notch Agent Train, plus a weekly build log; client stories as we publish each engagement.",
    tags: ["Development", "Shopify"],
  },
];
