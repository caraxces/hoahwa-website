import type { ServiceFaq, ServicePlan } from "@/content/service";

export const aeoHero = {
  headline: ["AI Search", "Optimization"],
  aboutLabel: "AEO / GEO",
  aboutLead:
    "Search is moving inside AI. ChatGPT, Perplexity, and Google AI Overviews now answer shoppers directly—and only cite the brands they trust. We make sure that brand is yours.",
  aboutStat:
    "Brands cited in an AI answer earn up to +35% more organic clicks. We engineer your store, content, and data to be the answer.",
};

export const aeoPlans: ServicePlan[] = [
  {
    id: "aeo-foundations",
    step: "STEP 1",
    title: "AI Visibility Audit",
    subtitle: "Where you stand in AI search today",
    features: [
      "Prompt-set testing across ChatGPT, Perplexity & Gemini",
      "Share-of-voice vs. competitors in AI answers",
      "Structured-data & crawlability gap analysis",
      "Entity & brand-knowledge mapping",
      "Prioritised citation-gap report",
    ],
    variant: "light",
    ctaVariant: "dark",
  },
  {
    id: "aeo-build",
    step: "STEP 2",
    title: "Answer Engine Build",
    subtitle: "Make your store machine-readable & quotable",
    features: [
      "Product, FAQ, Article & Organization schema",
      "Answer-first content & FAQ architecture",
      "llms.txt + crawler access for AI agents",
      "Merchant feed & catalogue structuring",
      "Core Web Vitals so bots render you fast",
    ],
    variant: "dark",
    ctaVariant: "mauve",
  },
  {
    id: "aeo-agentic",
    step: "STEP 3",
    title: "Agentic Commerce Ready",
    subtitle: "Prepare for AI agents that buy for shoppers",
    features: [
      "Agentic checkout & API-readiness review",
      "Real-time stock & price exposure for agents",
      "Structured offers, returns & policy data",
      "Ongoing citation monitoring & reporting",
      "Monthly content + schema iteration",
    ],
    variant: "dark",
    ctaVariant: "mauve",
  },
];

export const aeoWhy = {
  label: "Why AEO / GEO now?",
  headline: [
    "Traditional SEO gets you ranked.",
    "Answer Engine Optimization gets you quoted.",
  ],
  body: [
    "AI Overviews and chat assistants compress ten blue links into a single answer. Paid click-through on AI-Overview queries has dropped sharply, while traffic that arrives from AI tools converts at a notably higher rate—because the shopper already trusts the recommendation.",
    "AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) are how brands stay discoverable in that world: structured data, answer-first content, clean entity signals, and a storefront fast and open enough for AI crawlers and shopping agents to read.",
  ],
  pointsHeadline: ["Built for the", "answer layer"],
  pointsBody:
    "We combine our Shopify engineering, performance, and content discipline into one outcome: when an AI answers a buying question in your category, your brand, products, and policies are the source it cites.",
};

export const aeoFaqs: ServiceFaq[] = [
  {
    id: "what-is-aeo",
    question: "What is AEO and how is it different from SEO?",
    answer:
      "SEO optimises for ranking in a list of links. AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) optimise to be cited inside AI-generated answers—ChatGPT, Perplexity, Gemini, and Google AI Overviews. It relies more heavily on structured data, entity clarity, and answer-first content than on classic keyword ranking alone.",
  },
  {
    id: "measure",
    question: "How do you measure results?",
    answer:
      "We test a fixed set of buying-intent prompts across the major AI engines on a recurring schedule and track whether—and how—your brand is cited, alongside share-of-voice versus competitors, AI-referred sessions, and assisted conversions.",
  },
  {
    id: "timeline",
    question: "How long until we see AI citations?",
    answer:
      "Schema and crawlability fixes are picked up within weeks. Building durable citation share across engines is a compounding effort, typically meaningful over 2–3 months as content and entity signals mature.",
  },
  {
    id: "agentic",
    question: "What is agentic commerce and do we need it yet?",
    answer:
      "Agentic commerce is when an AI assistant completes a purchase on the shopper's behalf—reading your catalogue, confirming stock, and checking out via APIs. It is early, but the brands structuring their data now are the ones agents will be able to transact with first.",
  },
];

export const aeoContactServices = [
  "AEO / GEO (AI Search)",
  "AI Visibility Audit",
  "Agentic Commerce Readiness",
  "Shopify Build",
  "Growth Retainer",
];
