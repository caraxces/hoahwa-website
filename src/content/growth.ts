import type { ServicePlan } from "@/content/service";

export const growthHero = {
  headline: ["eCommerce", "Growth"],
  aboutLabel: "About us",
  aboutBody:
    "eCommerce is constantly evolving—your strategy should be too. Our Growth Retainers provide the flexibility, expertise and momentum your brand requires to scale, optimise and stay ahead of the competition.",
};

export const growthPlans: ServicePlan[] = [
  {
    id: "audit-roadmap",
    title: "Audit + Roadmap",
    subtitle: "Long-term Alignment & Pipeline",
    features: [
      "Workshops",
      "CX, CRO + Technical Audits",
      "Roadmap",
      "Loom Video Walkthrough",
    ],
    variant: "light",
    ctaVariant: "dark",
    showCta: true,
  },
  {
    id: "growth-retainer",
    title: "Growth Retainer",
    subtitle: "Long-term Success, Aligned to Growth Objectives",
    features: [
      "Heuristical Evaluation",
      "Audiences (User) Personas",
      "Competitor Analysis",
      "User Journey Feedback",
      "40+ High-impact Growth Suggestions",
    ],
    variant: "dark",
    ctaVariant: "mauve",
    showCta: true,
  },
  {
    id: "cro-retainer",
    title: "CRO Retainer",
    subtitle: "Purely A/B Testing + CRO",
    features: [
      "Hypothesis-led experiment backlog",
      "A/B testing programme",
      "Conversion reporting tied to revenue",
      "Continuous UX refinement",
      "Performance optimisation",
    ],
    variant: "dark",
    ctaVariant: "mauve",
    showCta: true,
  },
];

export const growthWhy = {
  label: "Why choose us?",
  headline:
    "Direct client collaboration and competitive, cost-efficient execution.",
  body: [
    "We are a young and dynamic boutique unit. By eliminating administrative bloat and collaborating directly with you as dedicated individual experts, we guarantee a high level of responsibility, responsiveness, and premium results.",
    "Our primary objective is to win prestigious web design and development awards at the world's leading design organisations, offering superb visual aesthetics paired with industry-leading technical compatibility.",
  ],
  partners: {
    title: "A roadmap built for your store, not a template",
    body: "We don't believe in a one-size-fits-all approach. After conducting in-depth CX and technical audits, we develop a tailored roadmap based on your business goals, customer insights, and eCommerce landscape. From there, we create a backlog of high-impact tasks, ensuring each retainer hour is spent delivering measurable growth.",
  },
  /** How a retainer is structured. Deliberately process facts, not client counts. */
  stats: [
    { value: "2wk", label: "Sprint cycle" },
    { value: "48h", label: "Response time on requests" },
    { value: "100%", label: "Hours reported, itemised" },
  ],
  cro: {
    title: "Measurable results with CRO",
    body: "When it comes to conversion rate optimisation (CRO), guesswork doesn't cut it. Every change on your store should be backed by data, ensuring measurable impact on revenue, conversion rates, and user experience. Our Agile CRO Retainers are designed for brands that want to scale confidently—using continuous A/B testing to refine, optimise, and maximise performance.",
  },
};

export const growthFaqs = [
  {
    id: "deliverables",
    question: "What deliverables are included?",
    answer:
      "Deliverables vary by retainer type but typically include prioritised roadmaps, experiment backlogs, design concepts, development sprints, and reporting tied to conversion and revenue goals.",
  },
  {
    id: "timeline",
    question: "How long does the process take?",
    answer:
      "Retainers run month-to-month with sprint planning cycles. Most clients see meaningful momentum within the first 4–8 weeks after onboarding and roadmap sign-off.",
  },
  {
    id: "after-audits",
    question: "What happens once the audits finish?",
    answer:
      "Audit findings feed directly into your growth or CRO retainer backlog. We prioritise initiatives by effort and impact so your team ships high-ROI work first.",
  },
  {
    id: "audit-fee",
    question: "Why do you charge for audits?",
    answer:
      "Audits are a dedicated discovery phase, not a free sales exercise. The fee covers deep analysis and a roadmap you can act on—not generic advice.",
  },
  {
    id: "growth-retainers",
    question: "How do growth retainers work?",
    answer:
      "We ship iterative UX, CRO, and development improvements each sprint against agreed goals, with itemised hour reporting and monthly planning.",
  },
  {
    id: "cro-retainers",
    question: "How do CRO retainers work?",
    answer:
      "We run a hypothesis-led A/B testing programme with continuous analysis of heatmaps, analytics, and experiment results to compound conversion gains.",
  },
  {
    id: "cro-vs-growth",
    question: "CRO vs growth retainers",
    answer:
      "CRO retainers focus on experimentation and conversion metrics. Growth retainers are broader—strategy, UX, CRO, and development combined for sustained eCommerce growth.",
  },
];

export const growthContact = {
  title: ["Let's Talk", "Hoahwa"] as const,
  services: [
    "Audits / Discovery",
    "CRO Retainer",
    "Growth Retainer",
    "Shopify Build",
    "eCommerce Strategy",
  ],
};
