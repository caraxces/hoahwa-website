export type InsightPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

export const insightFilters = [
  "All",
  "A/B Testing",
  "CRO",
  "Shopify",
  "Growth",
  "eCommerce",
  "Tech Integration",
] as const;

export const insightPosts: InsightPost[] = [
  {
    slug: "slow-shopify-stores-revenue",
    title: "Why Slow Shopify Stores Hurt Revenue More Than Most Brands Realise",
    date: "May 21, 2026",
    tags: ["eCommerce", "Growth"],
  },
  {
    slug: "revenue-losing-slow-store",
    title: "How Much Revenue Are You Losing to a Slow Shopify Store?",
    date: "May 18, 2026",
    tags: ["Growth", "Shopify"],
  },
  {
    slug: "shopify-native-ab-testing",
    title:
      "Shopify's Native A/B Testing Changes Everything (And Why Most CRO Setups Are Now Outdated)",
    date: "May 14, 2026",
    tags: ["A/B Testing", "CRO", "Shopify"],
  },
  {
    slug: "what-is-shopify-partner",
    title:
      "What Is a Shopify Partner? Benefits, Services & How to Choose the Right One",
    date: "May 13, 2026",
    tags: ["Shopify"],
  },
  {
    slug: "ecommerce-funnel-breakdown",
    title: "Where You're Losing 70% of Customers: The eCommerce Funnel Breakdown",
    date: "May 11, 2026",
    tags: ["eCommerce", "CRO", "Growth"],
  },
  {
    slug: "conversion-leaks-2026",
    title:
      "Where eCommerce Stores Lose Revenue in 2026: A Data-Backed Breakdown of Conversion Leaks",
    date: "Apr 30, 2026",
    tags: ["CRO", "eCommerce"],
  },
  {
    slug: "users-leave-after-3-seconds",
    title: "53% of Users Leave After 3 Seconds: What Happens Between 1–3 Seconds?",
    date: "Apr 23, 2026",
    tags: ["eCommerce", "Growth"],
  },
  {
    slug: "payment-compliance-scale",
    title: "Why Payment Compliance Matters More as Shopify Brands Scale",
    date: "Apr 16, 2026",
    tags: ["Shopify"],
  },
  {
    slug: "no-premade-themes",
    title:
      "Why Hoahwa Doesn't Build on Pre-Made Shopify Themes And Why Serious Brands Shouldn't Either",
    date: "Apr 13, 2026",
    tags: ["Tech Integration", "Growth", "Shopify"],
  },
  {
    slug: "core-web-vitals-2026",
    title: "Core Web Vitals for Shopify: What Google Actually Penalises in 2026",
    date: "Apr 6, 2026",
    tags: ["Tech Integration", "Growth", "Shopify"],
  },
  {
    slug: "shopify-plus-growth-strategy",
    title: "Shopify Plus Growth Strategy for DTC Brands (2026 Guide)",
    date: "Mar 31, 2026",
    tags: ["Growth", "Shopify"],
  },
  {
    slug: "shopify-rollouts-ab-testing",
    title:
      "Shopify Rollouts: Native A/B Testing Is Here - But Most Brands Still Won't Use It Properly",
    date: "Mar 25, 2026",
    tags: ["A/B Testing", "Shopify", "Growth"],
  },
];
