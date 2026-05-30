export type PursuitGoal = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

export const pursuitSection = {
  eyebrow: "What we're pursuing",
  headline: ["Goals we're", "building toward"] as const,
  lead: "We're focused on measurable outcomes — case studies will follow as we publish each engagement.",
};

export const pursuitFilters = [
  "All",
  "Shopify",
  "CRO",
  "SEO",
  "Design",
  "Development",
  "Growth",
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
    slug: "case-studies",
    title: "Published case studies",
    description:
      "Documenting real outcomes — starting with our Shopify developer explainer; more client stories coming soon.",
    tags: ["Development", "Shopify"],
  },
];
