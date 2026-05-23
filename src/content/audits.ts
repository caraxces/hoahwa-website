import type { ServicePlan } from "@/content/service";

export type AuditPlan = ServicePlan & { step: string; ctaVariant: "dark" | "mauve" };

export const auditHero = {
  headline: ["CX, CRO + Tech", "Audits"],
  aboutLabel: "About us",
  aboutLead: [
    "Hoahwa are a multi-award-winning eCommerce Growth Agency specialising in Shopify Plus for ambitious home and lifestyle brands.",
  ],
  aboutRoi:
    "We have a track record for delivering over +2,600% ROI with our proven 3 step process.",
};

export const auditPlans: AuditPlan[] = [
  {
    id: "cro",
    step: "STEP 1",
    title: "CRO Audit",
    subtitle: "Actionable Insights from Heatmaps & Analytics",
    features: [
      "Heatmap Analysis (Heatmap / Hotjar)",
      "Data Analysis",
      "3x UI Concepts (Before vs. After)",
      "Loom Video Walkthrough",
      "Community Access",
    ],
    variant: "light",
    ctaVariant: "dark",
  },
  {
    id: "cx",
    step: "STEP 2",
    title: "CX Audit",
    subtitle: "Data-driven Insights, Prioritise Growth",
    features: [
      "Heuristical Evaluation",
      "Audiences (User) Personas",
      "Competitor Analysis",
      "User Journey Feedback",
      "40+ High-impact Growth Suggestions",
    ],
    variant: "dark",
    ctaVariant: "mauve",
  },
  {
    id: "technical",
    step: "STEP 3",
    title: "Technical Audit",
    subtitle: "Solid, Scalable & Future-proofed Tech Foundation",
    features: [
      "Uncover Technical Debt",
      "Understand Technical Foundation + Stack",
      "Analyse Apps",
      "Performance + Optimisation Report",
      "Theme: Template + Section Analysis",
    ],
    variant: "dark",
    ctaVariant: "mauve",
  },
];

export const auditWhy = {
  label: "Why choose us?",
  headline: [
    "Our data-driven audits deliver clear,",
    "actionable insights to fuel your growth.",
  ],
  body: [
    "With a proven track record of increasing conversions, enhancing customer experiences and optimising technical performance, Hoahwa is the trusted name, in the eCom game!",
    "Success depends on seamless customer experiences, high-conversion and robust technology. Our CX, CRO and Technical Audit identify gaps and opportunities to optimise performance, and drive greater revenue through data-led strategic recommendations.",
  ],
  insightsHeadline: ["Insights that", "pack a punch"],
  insightsBody:
    "Get over 40+ insights mapped to your goals, product launch calendars, marketing campaigns and any other eCommerce plans. The result, an action-packed roadmap with industry-leading best practices, tactics and eCommerce strategies to drive conversion and revenue.",
};

export const auditFaqs = [
  {
    id: "deliverables",
    question: "What deliverables are included?",
    answer:
      "Deliverables include an eCommerce Landscape Workshop (1-2 hour session), a 40+ page CX Audit accompanied by a data-rich Technical Audit, concluded with a presented Growth Roadmap (Recommendations based on Effort & Impact).",
  },
  {
    id: "timeline",
    question: "How long does the process take?",
    answer:
      "Typically 2–4 weeks depending on store complexity, stakeholder availability, and audit scope across CX, CRO, and technical workstreams.",
  },
  {
    id: "charge",
    question: "Why do you charge for audits?",
    answer:
      "Audits are a dedicated discovery phase led by senior strategists, designers, and developers. The fee covers deep analysis, prioritised recommendations, and a roadmap you can act on—rather than generic advice.",
  },
  {
    id: "after",
    question: "What happens once the audits finish?",
    answer:
      "Most clients move into growth retainers or project builds. We can implement findings in-house or hand over a clear roadmap for your team to execute.",
  },
];

export const auditContactServices = [
  "Audits / Discovery",
  "CRO Retainer",
  "Growth Retainer",
  "Shopify Build",
  "eCommerce Strategy",
];
