import { figmaAssets } from "./figma-assets";
import type { ProjectCardData } from "@/components/figma/ProjectCard";

export const featuredCase: ProjectCardData = {
  slug: "watchhouse",
  title:
    "Hoahwa elevated WatchHouse with award-winning navigation, enhanced subscriptions, a personalised builder, and an improved quiz for coffee lovers.",
  image: figmaAssets.caseWatchHouse,
  brandLabel: "WatchHouse",
  tags: ["Shopify Plus", "CX Design", "CRO"],
};

export const caseStudyFilters = [
  "All",
  "Discovery",
  "Shopify Plus",
  "Integration",
  "Replatform",
  "Growth",
  "Audit",
  "CX Design",
  "Development",
  "eCommerce Strategy",
  "CRO",
] as const;

export const caseStudies: ProjectCardData[] = [
  {
    slug: "drip-moda",
    title:
      "Hoahwa rebuilt DripModa's Shopify architecture fixing bundle logic, removing technical debt, improving performance, and enabling scalable growth.",
    image: figmaAssets.caseKickGame,
    brandLabel: "DripModa",
    tags: ["Development", "Growth", "Shopify Plus"],
  },
  {
    slug: "dropdead",
    title:
      "Hoahwa rebuilt Dropdead's Shopify store with a clean design on a tight deadline, preserving the brand's bold, alternative identity.",
    image: figmaAssets.caseFrahm,
    brandLabel: "Dropdead",
    tags: ["CX Design", "Development"],
  },
  featuredCase,
  {
    slug: "kick-game",
    title:
      "Discover how Hoahwa rebuilt Kick Game's Shopify Plus experience with faster UX, modular design, smart navigation and CRO-driven features for scalable growth.",
    image: figmaAssets.caseKickGame,
    brandLabel: "Kick Game",
    tags: ["Shopify Plus", "CRO"],
  },
  {
    slug: "elevare",
    title:
      "Hoahwa transformed Elevare into a scalable, bilingual Shopify wellness marketplace for the Middle East, built for growth, subscriptions, and storytelling.",
    image: figmaAssets.caseElevare,
    brandLabel: "Elevare",
    tags: ["Replatform", "Growth"],
  },
  {
    slug: "components",
    title: "Strategic optimisations and a full redesign to drive sales and enhance user experience.",
    image: figmaAssets.caseComponents,
    tags: ["CX Design", "Development"],
  },
  {
    slug: "frahm",
    title: "Transforming Frahm's online store with strategic optimisations and a full redesign.",
    image: figmaAssets.caseFrahm,
    tags: ["CX Design", "CRO"],
  },
  {
    slug: "duke-dexter",
    title: "How Hoahwa boosted Duke + Dexter's eCommerce with design improvements and a loyalty program.",
    image: figmaAssets.caseDuke,
    tags: ["Growth", "CRO"],
  },
  {
    slug: "miss-me",
    title:
      "Hoahwa's Shopify 2.0 rebuild empowered Miss Me with a modern, high-performing site that enhances customer loyalty.",
    image: figmaAssets.caseMissMe,
    tags: ["Shopify Plus", "Development"],
  },
  {
    slug: "house-of-charcoal",
    title:
      "Learn how Hoahwa helped a new sustainable British charcoal brand establish its online presence on Shopify.",
    image: figmaAssets.caseHoc,
    tags: ["Discovery", "Build"],
  },
];
