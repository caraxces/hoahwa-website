export const processHero = {
  eyebrow: "Process",
  headline: ["A clear roadmap", "from audit to go‑live"] as const,
  lead:
    "A fast, structured workflow designed to reduce risk, align early, and ship confidently—without surprises.",
};

export type ProcessPhase = {
  number: string;
  title: string;
  subtitle: string;
  timeframe: string;
  deliverables: Array<{ label: string; value: string }>;
  tags: string[];
};

// Derived from `shopify-pharmacy-proposal.html` (pricing removed).
export const processPhases: ProcessPhase[] = [
  {
    number: "01",
    title: "Audit & Wireframe",
    subtitle: "Research, direction, and layout approval",
    timeframe: "Week 1",
    deliverables: [
      {
        label: "Reference audit",
        value:
          "Review competitors and best-in-class patterns to define UX direction and reduce risk.",
      },
      {
        label: "Theme direction",
        value:
          "Propose 1–2 visual/UX directions (typography, layout, hierarchy) aligned to brand and category.",
      },
      {
        label: "Wireframes",
        value:
          "Lo‑fi wireframes for key page types to align structure before development.",
      },
      {
        label: "Approval loop",
        value:
          "One structured revision round after feedback; then lock scope and move forward.",
      },
    ],
    tags: ["Wireframe", "UX Audit", "Competitor Analysis", "Direction"],
  },
  {
    number: "02",
    title: "Theme Development",
    subtitle: "Build the storefront with custom sections",
    timeframe: "Weeks 2–4",
    deliverables: [
      {
        label: "Homepage",
        value:
          "Hero, category blocks, best sellers, promo banners, trust cues, and a conversion‑ready layout.",
      },
      {
        label: "Collection",
        value:
          "Filtering, sorting, pagination, and responsive product grid aligned to catalog needs.",
      },
      {
        label: "Product detail",
        value:
          "Gallery, rich product data (metafields), tabs/sections, and cross‑sell patterns.",
      },
      {
        label: "Cart",
        value:
          "Quantity edits, discounts, order summary, and a clear path to checkout.",
      },
      {
        label: "Responsive",
        value: "Desktop / tablet / mobile QA to keep UX consistent across devices.",
      },
    ],
    tags: ["Shopify Liquid", "Custom Theme", "Sections", "Responsive"],
  },
  {
    number: "03",
    title: "Catalog Setup & Import",
    subtitle: "Structure products so content scales",
    timeframe: "Weeks 4–5 (overlaps with Phase 2)",
    deliverables: [
      {
        label: "Catalog structure",
        value:
          "Collections, product types, tags, and metafields schema for consistent data.",
      },
      {
        label: "Import template",
        value:
          "CSV / sheet template for internal team entry with clear required fields.",
      },
      {
        label: "Import + QA",
        value:
          "Batch import and validate rendering in the theme for initial SKUs.",
      },
    ],
    tags: ["Metafields", "Templates", "QA"],
  },
  {
    number: "04",
    title: "Go‑live Setup",
    subtitle: "Tracking, QA, and launch readiness",
    timeframe: "Weeks 5–6",
    deliverables: [
      { label: "Domain & SSL", value: "DNS, HTTPS, redirects, and device checks." },
      {
        label: "Analytics",
        value:
          "GA4 setup and key eCommerce events (view_item, add_to_cart, purchase).",
      },
      {
        label: "Ads",
        value: "Conversion tracking and integrations aligned to launch needs.",
      },
      {
        label: "Final QA",
        value:
          "End‑to‑end flow test: browse → cart → checkout → confirmation + cross‑browser checks.",
      },
    ],
    tags: ["Launch", "GA4", "Tracking", "QA"],
  },
  {
    number: "05",
    title: "Base SEO & Performance",
    subtitle: "Technical foundations (not ongoing SEO strategy)",
    timeframe: "Week 6",
    deliverables: [
      {
        label: "On‑page structure",
        value: "Title/meta templates and heading hierarchy across page types.",
      },
      {
        label: "Structured data",
        value: "Schema markup for products and site structure where relevant.",
      },
      { label: "Sitemaps + robots", value: "Clean indexing and crawl hygiene." },
      {
        label: "Core Web Vitals",
        value: "LCP/CLS/INP fundamentals with sane media loading defaults.",
      },
      {
        label: "Images",
        value:
          "Responsive delivery + compression guidance (format and sizing) for speed on mobile.",
      },
    ],
    tags: ["SEO", "Performance", "Core Web Vitals"],
  },
];

export const processAfterLaunch = {
  eyebrow: "After launch",
  headline: ["Ongoing support", "that scales with you"] as const,
  items: [
    {
      title: "Updates & new features",
      body:
        "New landing pages, bundles, subscriptions, loyalty, and app integrations—built consistently on top of the existing theme.",
    },
    {
      title: "Campaign execution",
      body:
        "Fast build cycles for seasonal promos, launches, and conversion experiments.",
    },
    {
      title: "Analytics-driven improvements",
      body:
        "Review GA4 + storefront data, identify drop-off points, and ship targeted UX fixes.",
    },
    {
      title: "Team enablement",
      body:
        "Guidance for Shopify admin workflows and structured content entry so internal ops move faster.",
    },
  ],
};

