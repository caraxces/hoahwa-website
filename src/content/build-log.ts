export type BuildLogProject =
  | "Hoahwa.com"
  | "BloomBound"
  | "Kể"
  | "Tarotto"
  | "HoaHwa Links"
  | "Notch Agent Train";

export type BuildLogEntry = {
  id: string;
  /** ISO 8601 date (UTC midnight for display consistency). */
  date: string;
  title: string;
  project: BuildLogProject;
  summary: string;
  tags: string[];
  /** Optional link to a case study, app route, or insight. */
  href?: string;
};

/** Newest first — keep in sync when adding weekly entries. */
export const buildLogEntries: BuildLogEntry[] = [
  {
    id: "2026-10-29-bloombound-blossom-crown-realm",
    date: "2026-10-29T00:00:00.000Z",
    title: "Blossom Crown: a fourth BloomBound realm",
    project: "BloomBound",
    summary:
      "Built and tested a fourth BloomBound realm — a painterly dark-fantasy throne hall art-directed from three concept paintings, with 25 procedurally planned roads (151 ms, down from ~15 s), 26 vehicles and instanced scenery at ~256k triangles. Now rolling out.",
    tags: ["3D", "BloomBound", "Web"],
    href: "/case-studies/bloombound-3d-landing-page",
  },
  {
    id: "2026-10-29-bloombound-escort-painterly-renderer",
    date: "2026-10-29T00:00:00.000Z",
    title: "Escort mission and painterly renderer",
    project: "BloomBound",
    summary:
      "Blossom Crown adds an escort mission — guard a carriage to the castle while giants smash traffic underfoot — under a new painterly post-processing pass of toon ramps, outlines and bloom.",
    tags: ["3D", "BloomBound", "Gameplay"],
    href: "/apps/bloombound",
  },
  {
    id: "2026-10-28-notch-agent-train-case-study",
    date: "2026-10-28T00:00:00.000Z",
    title: "Notch Agent Train case study published",
    project: "Notch Agent Train",
    summary:
      "Published the case study of our in-house macOS notch app: Claude splits engineering work into slices and delegates them to Codex, Cursor, Antigravity, Kimi and opencode, each in its own git worktree, with review before merge.",
    tags: ["Case study", "macOS", "AI agents"],
    href: "/case-studies/notch-agent-train",
  },
  {
    id: "2026-10-27-notch-agent-train-built",
    date: "2026-10-27T00:00:00.000Z",
    title: "Notch Agent Train: 63 commits in two days",
    project: "Notch Agent Train",
    summary:
      "Built the delegate pool (routing by task kind, per-model cooldowns, one job per directory) and the notch UI with pets per agent, music, calendar and system gauges.",
    tags: ["macOS", "Swift", "AI agents"],
  },
  {
    id: "2026-09-10-bloombound-assets",
    date: "2026-09-10T00:00:00.000Z",
    title: "BloomBound app features and asset pass",
    project: "BloomBound",
    summary:
      "Shipped new BloomBound app features and supporting assets alongside the playable Three.js landing work.",
    tags: ["3D", "BloomBound", "Web"],
    href: "/case-studies/bloombound-3d-landing-page",
  },
  {
    id: "2026-09-08-self-owned-recap",
    date: "2026-09-08T00:00:00.000Z",
    title: "Insights recap across self-owned projects",
    project: "Hoahwa.com",
    summary:
      "Published an insights recap tying together Hoahwa’s self-owned products and released the Tarotto programmatic SEO case study.",
    tags: ["Insights", "SEO", "Tarotto"],
    href: "/case-studies/tarotto-programmatic-seo",
  },
  {
    id: "2026-09-08-bloombound-sub-app",
    date: "2026-09-08T00:00:00.000Z",
    title: "BloomBound playable 3D sub-app and case study",
    project: "BloomBound",
    summary:
      "Shipped BloomBound as a playable Three.js sub-app on hoahwa.com with its matching case study page.",
    tags: ["3D", "Case study", "BloomBound"],
    href: "/case-studies/bloombound-3d-landing-page",
  },
  {
    id: "2026-09-05-seo-vietfolk",
    date: "2026-09-05T00:00:00.000Z",
    title: "SEO indexing fixes and Vietfolk case study",
    project: "Hoahwa.com",
    summary:
      "Repaired indexing signals, reduced homepage image weight, and published the Vietfolk winter 2026 case study.",
    tags: ["SEO", "Performance", "Case study"],
    href: "/case-studies/vietfolk-winter-2026",
  },
  {
    id: "2026-07-11-vietfolk-microsite",
    date: "2026-07-11T00:00:00.000Z",
    title: "Vietfolk editions microsite under News",
    project: "Hoahwa.com",
    summary:
      "Added the Vietfolk editions microsite and wired it into the site News navigation.",
    tags: ["Microsite", "Content"],
  },
  {
    id: "2026-06-23-technical-seo-foundation",
    date: "2026-06-23T00:00:00.000Z",
    title: "Technical SEO foundation and AI-search insights",
    project: "Hoahwa.com",
    summary:
      "Laid technical SEO groundwork, added AEO/GEO service positioning, and expanded AI-search insights content.",
    tags: ["SEO", "Insights", "AEO"],
    href: "/insights",
  },
];

export function formatBuildLogDisplayDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function getBuildLogLastUpdatedIso(): string {
  return buildLogEntries[0]?.date ?? new Date().toISOString();
}

export function getBuildLogLastUpdatedLabel(): string {
  return formatBuildLogDisplayDate(getBuildLogLastUpdatedIso());
}
