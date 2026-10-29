/**
 * Hand-picked "Keep reading" links for case studies and insight articles.
 * Keys are route paths without a trailing slash; every href points to a route
 * that exists in src/app (trailing slash matches the site-wide internal-link
 * style). A page never lists itself.
 */

export type RelatedLink = {
  href: string;
  title: string;
  kicker: "Case study" | "Insight" | "Service";
};

function caseStudy(slug: string, title: string): RelatedLink {
  return { href: `/case-studies/${slug}/`, title, kicker: "Case study" };
}

function insight(slug: string, title: string): RelatedLink {
  return { href: `/insights/${slug}/`, title, kicker: "Insight" };
}

function service(path: string, title: string): RelatedLink {
  return { href: `${path}/`, title, kicker: "Service" };
}

const CS = {
  notchAgentTrain: caseStudy(
    "notch-agent-train",
    "Notch Agent Train: A macOS Notch App That Runs AI Coding Agents",
  ),
  tarotto: caseStudy(
    "tarotto-programmatic-seo",
    "Tarotto — 900+ Pages of Programmatic SEO From a Standing Start",
  ),
  ke: caseStudy(
    "ke-audio-story-studio",
    "Kể — An AI Story Studio That Runs On Your Own Machine",
  ),
  vietfolk: caseStudy(
    "vietfolk-winter-2026",
    "Vietfolk ’26 — A Shopify Editions Page Rebuilt in Vietnamese",
  ),
  bloombound: caseStudy(
    "bloombound-3d-landing-page",
    "BloomBound — A 3D Landing Page You Can Play",
  ),
  hoahwaCom: caseStudy("hoahwa-com", "Building hoahwa.com — Our First Case Study"),
  shopifyDeveloper: caseStudy(
    "shopify-developer",
    "Shopify + Developer — Why You Need Both",
  ),
} as const;

const IN = {
  slowWebsites: insight(
    "why-slow-websites-hurt-engagement",
    "Why Slow Websites Hurt User Engagement More Than You Realise",
  ),
  crossBrowser: insight(
    "cross-browser-compatibility-page-speed",
    "How to Achieve Flawless Cross-Browser Compatibility and Fast Page Speed",
  ),
  directCollaboration: insight(
    "direct-collaboration-agency-overhead",
    "The Power of Direct Collaboration: Cutting the Agency Overhead",
  ),
  webAwards: insight(
    "designing-for-web-awards-ui-patterns",
    "Designing for Web Awards: Aesthetic Best Practices and Modern UI Patterns",
  ),
  slowShopify: insight(
    "slow-shopify-stores-revenue",
    "Why Slow Shopify Stores Hurt Revenue More Than Most Brands Realise",
  ),
  revenueLosing: insight(
    "revenue-losing-slow-store",
    "How Much Revenue Are You Losing to a Slow Shopify Store?",
  ),
  nativeAbTesting: insight(
    "shopify-native-ab-testing",
    "Shopify's Native A/B Testing Changes Everything (And Why Most CRO Setups Are Now Outdated)",
  ),
  shopifyPartner: insight(
    "what-is-shopify-partner",
    "What Is a Shopify Partner? Benefits, Services & How to Choose the Right One",
  ),
  funnelBreakdown: insight(
    "ecommerce-funnel-breakdown",
    "Where You're Losing 70% of Customers: The eCommerce Funnel Breakdown",
  ),
  conversionLeaks: insight(
    "conversion-leaks-2026",
    "Where eCommerce Stores Lose Revenue in 2026: A Data-Backed Breakdown of Conversion Leaks",
  ),
  threeSeconds: insight(
    "users-leave-after-3-seconds",
    "53% of Users Leave After 3 Seconds: What Happens Between 1–3 Seconds?",
  ),
  paymentCompliance: insight(
    "payment-compliance-scale",
    "Why Payment Compliance Matters More as Shopify Brands Scale",
  ),
  noPremadeThemes: insight(
    "no-premade-themes",
    "Why Hoahwa Doesn't Build on Pre-Made Shopify Themes And Why Serious Brands Shouldn't Either",
  ),
  coreWebVitals: insight(
    "core-web-vitals-2026",
    "Core Web Vitals for Shopify: What Google Actually Penalises in 2026",
  ),
  plusGrowth: insight(
    "shopify-plus-growth-strategy",
    "Shopify Plus Growth Strategy for DTC Brands (2026 Guide)",
  ),
  rolloutsAbTesting: insight(
    "shopify-rollouts-ab-testing",
    "Shopify Rollouts: Native A/B Testing Is Here - But Most Brands Still Won't Use It Properly",
  ),
  aeo: insight(
    "what-is-aeo-answer-engine-optimization",
    "What Is Answer Engine Optimization (AEO)? A 2026 Guide for Shopify Brands",
  ),
  agenticCommerce: insight(
    "agentic-commerce-ai-shopping-agents",
    "Agentic Commerce: How AI Shopping Agents Will Buy From Your Store",
  ),
  geoVsSeo: insight(
    "geo-vs-seo-getting-cited-by-ai",
    "GEO vs SEO: How to Get Cited by ChatGPT and Google AI Overviews",
  ),
  winter2026: insight(
    "shopify-winter-2026-setup-priorities",
    "Shopify Winter ’26: tính năng nào đáng setup trước?",
  ),
  threeProjects: insight(
    "three-projects-we-built-for-ourselves",
    "Three things we built for ourselves, and what each one cost",
  ),
} as const;

const SV = {
  audits: service("/audits", "CX, CRO + Technical Audits for Shopify"),
  themeBuilds: service(
    "/shopify-theme-builds",
    "Shopify Theme Development & Web Builds",
  ),
  growthRetainers: service(
    "/growth-retainers",
    "Shopify Growth Retainers (CRO + Dev)",
  ),
  aiSearch: service(
    "/ai-search-optimization",
    "AEO & GEO — AI Search Optimization for Shopify",
  ),
  process: service("/process", "Our Delivery Process"),
} as const;

export const relatedByPath: Record<
  string,
  readonly [RelatedLink, RelatedLink, RelatedLink]
> = {
  "/case-studies/notch-agent-train": [IN.threeProjects, CS.ke, CS.bloombound],
  "/case-studies/tarotto-programmatic-seo": [IN.geoVsSeo, SV.aiSearch, IN.aeo],
  "/case-studies/ke-audio-story-studio": [
    IN.threeProjects,
    CS.bloombound,
    CS.notchAgentTrain,
  ],
  "/case-studies/vietfolk-winter-2026": [
    SV.themeBuilds,
    IN.winter2026,
    IN.noPremadeThemes,
  ],
  "/case-studies/bloombound-3d-landing-page": [
    IN.threeProjects,
    CS.ke,
    CS.notchAgentTrain,
  ],

  "/insights/why-slow-websites-hurt-engagement": [
    IN.slowShopify,
    IN.coreWebVitals,
    SV.audits,
  ],
  "/insights/cross-browser-compatibility-page-speed": [
    IN.coreWebVitals,
    IN.threeSeconds,
    SV.themeBuilds,
  ],
  "/insights/direct-collaboration-agency-overhead": [
    SV.growthRetainers,
    IN.shopifyPartner,
    SV.process,
  ],
  "/insights/designing-for-web-awards-ui-patterns": [
    IN.noPremadeThemes,
    CS.bloombound,
    CS.hoahwaCom,
  ],
  "/insights/slow-shopify-stores-revenue": [
    IN.revenueLosing,
    IN.slowWebsites,
    SV.audits,
  ],
  "/insights/revenue-losing-slow-store": [
    IN.slowShopify,
    IN.coreWebVitals,
    SV.audits,
  ],
  "/insights/shopify-native-ab-testing": [
    IN.rolloutsAbTesting,
    IN.funnelBreakdown,
    SV.growthRetainers,
  ],
  "/insights/what-is-shopify-partner": [
    IN.plusGrowth,
    IN.directCollaboration,
    SV.themeBuilds,
  ],
  "/insights/ecommerce-funnel-breakdown": [
    IN.conversionLeaks,
    IN.nativeAbTesting,
    SV.growthRetainers,
  ],
  "/insights/conversion-leaks-2026": [
    IN.funnelBreakdown,
    IN.revenueLosing,
    SV.audits,
  ],
  "/insights/users-leave-after-3-seconds": [
    IN.slowWebsites,
    IN.coreWebVitals,
    SV.audits,
  ],
  "/insights/payment-compliance-scale": [
    IN.plusGrowth,
    IN.shopifyPartner,
    SV.growthRetainers,
  ],
  "/insights/no-premade-themes": [IN.webAwards, CS.vietfolk, SV.themeBuilds],
  "/insights/core-web-vitals-2026": [
    IN.threeSeconds,
    IN.crossBrowser,
    SV.audits,
  ],
  "/insights/shopify-plus-growth-strategy": [
    IN.paymentCompliance,
    IN.winter2026,
    SV.growthRetainers,
  ],
  "/insights/shopify-rollouts-ab-testing": [
    IN.nativeAbTesting,
    IN.conversionLeaks,
    SV.growthRetainers,
  ],
  "/insights/what-is-aeo-answer-engine-optimization": [
    IN.geoVsSeo,
    IN.agenticCommerce,
    SV.aiSearch,
  ],
  "/insights/agentic-commerce-ai-shopping-agents": [
    IN.aeo,
    IN.geoVsSeo,
    SV.aiSearch,
  ],
  "/insights/geo-vs-seo-getting-cited-by-ai": [CS.tarotto, IN.aeo, SV.aiSearch],
  "/insights/shopify-winter-2026-setup-priorities": [
    CS.vietfolk,
    IN.plusGrowth,
    SV.themeBuilds,
  ],
  "/insights/three-projects-we-built-for-ourselves": [
    CS.bloombound,
    CS.ke,
    CS.notchAgentTrain,
  ],
};

/** Look up the hand-picked links for a route path, tolerating a trailing slash. */
export function getRelatedLinks(path: string): readonly RelatedLink[] {
  const normalized =
    path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  return relatedByPath[normalized] ?? [];
}
