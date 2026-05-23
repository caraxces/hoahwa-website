import type { ServicePlan } from "@/content/service";

export const buildHero = {
  headline: ["Shopify Builds", "+ Migrations"],
  aboutLabel: "About us",
  aboutBody:
    "Hoahwa are a multi-award-winning eCommerce Growth Agency specialising in Shopify Plus for ambitious home and lifestyle brands. With a over decade of experience and a track record of empowering 500+ DTC brands, we know what it takes to drive growth and scale.",
};

export const buildPlans: ServicePlan[] = [
  {
    id: "discovery",
    title: "Discovery",
    subtitle: "Deep-dive Planning, for the Flawless Project",
    features: [
      "Workshops & Sessions",
      "CX Audit + Project Plan",
      "Technical Audit + Project Plan",
      "Clearly defined Scope of Work",
    ],
    variant: "light",
    ctaVariant: "dark",
    showCta: true,
  },
  {
    id: "migrate",
    title: "Migrate to Shopify",
    subtitle: "Seamless Data Migration, Maximum Growth",
    features: [
      "Replatform to Shopify",
      "Migrate legacy customer history",
      "Migrate products",
      "Solid Technical Foundation to build on",
      "Best converting checkout in the market",
    ],
    variant: "dark",
    showCta: false,
  },
  {
    id: "build",
    title: "Build on Shopify",
    subtitle: "Built for Scale & Growth",
    features: [
      "Solid Technical Foundation",
      "Designed with best practices",
      "Design decisions fuelled by data",
      "Built with conversion in mind",
      "Performance optimised",
    ],
    variant: "dark",
    showCta: false,
  },
];

export const buildWhy = {
  label: "Why choose us?",
  headline: "Our custom Shopify builds, are precision engineered for your brands growth.",
  body: [
    "With a proven track record of increasing conversions, enhancing customer experiences and optimising technical performance, Hoahwa is the trusted name, in the eCom game!",
    "Success depends on seamless customer experiences, high-conversion and robust technology. Our CX, CRO and Technical Audit identify gaps and opportunities to optimise performance, and drive greater revenue through data-led strategic recommendations.",
  ],
};

export const buildProcess = {
  headline: ["Our 7 Step", "Build Process"],
  body: "By diving deep into your business with our 7 step process, we create a storefront that not only looks exceptional but delivers seamless functionality and clean, high-performing code—because your brand and customers deserve the best.",
};

export const buildMigration = {
  headline: ["Handle your", "migration with", "ease"],
  body: "Migrating and replatforming a store from one platform to another can be daunting. We make the transition seamless for you, with our expert technical team supporting you every step of the way. Every function and redirect is planned out and tackled in our robust scoping process.",
  platforms: ["WooCommerce", "Magento", "Salesforce"],
};

export const buildFaqs = [
  {
    id: "deliverables",
    question: "What deliverables are included?",
    answer:
      "Deliverables include an eCommerce Landscape Workshop (1-2 hour session), a CX Audit (40+ page Figma file), a Technical Audit (5-6 detailed Google Sheets of data), a Scope of Work (Including a line itemised design and build spec) and finally a Build Plan (detailing a step-by-step on how we will build your site) with timelines and costs assigned to it.",
  },
  {
    id: "timeline",
    question: "How long does it take to build?",
    answer:
      "Timelines depend on scope, integrations, and migration complexity. A typical Shopify Plus build runs 12–20 weeks from discovery through launch, with phased milestones agreed in your Build Plan.",
  },
  {
    id: "discovery-fee",
    question: "Why do you charge for Discovery?",
    answer:
      "Discovery is a dedicated phase led by senior strategists and developers. The fee covers workshops, audits, a line-itemised scope, and a build plan with timelines and costs—so you can proceed with clarity and confidence.",
  },
];

export const buildContact = {
  title: ["Lets Talk", "Hoahwa"] as const,
  services: [
    "Audits / Discovery",
    "CRO Retainer",
    "Growth Retainer",
    "Shopify Build",
    "eCommerce Strategy",
  ],
};
