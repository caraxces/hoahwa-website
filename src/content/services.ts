export type ServicePage = {
  slug: string;
  title: string;
  subtitle: string;
  steps: { title: string; description: string }[];
  whyTitle: string;
  whyPoints: string[];
  faqs: { question: string; answer: string }[];
  anchors: { id: string; label: string }[];
};

export const auditPage: ServicePage = {
  slug: "audits",
  title: "Audit",
  subtitle:
    "Reduce risk and uncover opportunity with CRO, CX and Technical audits tailored to your Shopify store.",
  anchors: [
    { id: "cro-audits", label: "CRO Audits" },
    { id: "cx-audits", label: "CX Audits" },
    { id: "technical-audits", label: "Technical Audits" },
  ],
  steps: [
    {
      title: "CRO Audit",
      description:
        "Data-led analysis of conversion funnels, merchandising, and checkout friction with prioritised quick wins.",
    },
    {
      title: "CX Design Audit",
      description:
        "Heuristic and journey-based review of navigation, PDP, and mobile experience against best practice.",
    },
    {
      title: "Technical Audit",
      description:
        "Performance, theme architecture, app stack, and technical debt assessment with a remediation roadmap.",
    },
  ],
  whyTitle: "Why choose Hoahwa",
  whyPoints: [
    "Young, dynamic agency focused on design aesthetics",
    "Direct expert-to-expert collaboration with high responsibility",
    "High cost-efficiency and flexible solutions",
  ],
  faqs: [
    {
      question: "How long does an audit take?",
      answer: "Typically 2–4 weeks depending on store complexity and scope.",
    },
    {
      question: "Do you implement findings?",
      answer: "Yes—we can move from audit into growth retainers or project builds.",
    },
  ],
};

export const buildPage: ServicePage = {
  slug: "shopify-theme-builds",
  title: "Build",
  subtitle:
    "Discovery, migration, and Shopify theme development for brands ready to scale on Shopify Plus.",
  anchors: [
    { id: "migration", label: "Migration & Replatforming" },
    { id: "theme-development", label: "Theme Development" },
    { id: "shopify-plus", label: "Shopify Plus" },
  ],
  steps: [
    {
      title: "Discovery",
      description:
        "Scope workshops, technical discovery, and collaborative roadmap aligned to business goals.",
    },
    {
      title: "Migrate",
      description:
        "Customer, order, and product migration with QA and launch planning for minimal downtime.",
    },
    {
      title: "Build",
      description:
        "Shopify 2.0 theme development with modular sections, CMS flexibility, and performance baked in.",
    },
  ],
  whyTitle: "Why choose Hoahwa",
  whyPoints: [
    "Aesthetics geared towards winning prestigious global awards",
    "Top-tier technical compatibility and responsive performance",
    "Highly cost-effective builds without administrative overhead",
  ],
  faqs: [
    {
      question: "Which platforms do you migrate from?",
      answer: "Magento, Salesforce Commerce Cloud, WooCommerce, and custom stacks.",
    },
    {
      question: "Can you work to a fixed deadline?",
      answer: "Yes—we regularly deliver BFCM and campaign-critical launches on time.",
    },
  ],
};

export const growthPage: ServicePage = {
  slug: "growth-retainers",
  title: "Growth",
  subtitle:
    "Ongoing CRO, strategy, and development retainers to compound growth month over month.",
  anchors: [
    { id: "cro-ab-testing", label: "CRO + A/B Testing" },
    { id: "ecommerce-strategy", label: "eCommerce Strategy" },
    { id: "user-testing", label: "User Testing" },
    { id: "cx-design", label: "CX Design" },
    { id: "development-retainer", label: "Development Retainer" },
    { id: "growth-retainers", label: "Growth Retainers" },
  ],
  steps: [
    {
      title: "Audit + Roadmap",
      description:
        "Establish baseline metrics and a prioritised experiment and initiative backlog.",
    },
    {
      title: "Growth Retainer",
      description:
        "Dedicated squad for CRO, UX, and dev shipping iterative improvements every sprint.",
    },
    {
      title: "CRO Retainer",
      description:
        "Hypothesis-led A/B testing programme with reporting tied to revenue and conversion.",
    },
  ],
  whyTitle: "Why choose Hoahwa",
  whyPoints: [
    "Agile and dynamic boutique team focused on client results",
    "Direct communication with dedicated builders",
    "Uncompromising commitment to top technical standards",
  ],
  faqs: [
    {
      question: "What does a retainer include?",
      answer: "Agreed hours across CRO, design, and development with monthly planning.",
    },
    {
      question: "Can we start with a project?",
      answer: "Many clients begin with an audit or build before moving to retainer.",
    },
  ],
};
