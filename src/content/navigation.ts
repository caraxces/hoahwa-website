export type NavChild = {
  label: string;
  href: string;
};

export type NavPillar = {
  id: "audit" | "build" | "growth";
  label: string;
  href: string;
  children: NavChild[];
};

export const pillars: NavPillar[] = [
  {
    id: "audit",
    label: "Audit",
    href: "/audits",
    children: [
      { label: "CRO Audits", href: "/audits#cro-audits" },
      { label: "CX Audits", href: "/audits#cx-audits" },
      { label: "Technical Audits", href: "/audits#technical-audits" },
    ],
  },
  {
    id: "build",
    label: "Build",
    href: "/shopify-theme-builds",
    children: [
      {
        label: "Migration & Replatforming",
        href: "/shopify-theme-builds#migration",
      },
      {
        label: "Shopify Theme Development",
        href: "/shopify-theme-builds#theme-development",
      },
      { label: "Shopify Plus", href: "/shopify-theme-builds#shopify-plus" },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    href: "/growth-retainers",
    children: [
      {
        label: "CRO + A/B Testing",
        href: "/growth-retainers#cro-ab-testing",
      },
      {
        label: "eCommerce Strategy",
        href: "/growth-retainers#ecommerce-strategy",
      },
      {
        label: "User Testing & Research",
        href: "/growth-retainers#user-testing",
      },
      { label: "CX Design", href: "/growth-retainers#cx-design" },
      {
        label: "Development Retainer",
        href: "/growth-retainers#development-retainer",
      },
      {
        label: "Growth Retainers",
        href: "/growth-retainers#growth-retainers",
      },
    ],
  },
];

export type NavAppMenu = {
  id: "app";
  label: string;
  href: string;
  children: NavChild[];
};

/** Hoahwa apps — shown under header "App" dropdown and mobile menu. */
export const appMenu: NavAppMenu = {
  id: "app",
  label: "App",
  href: "/portfolio/builder",
  children: [
    { label: "Create your Portfolio", href: "/portfolio/builder" },
  ],
};

export const secondaryLinks = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "eCommerce Insights", href: "/insights" },
  { label: "Process", href: "/process" },
  { label: "Awards", href: "#" },
  { label: "About", href: "#" },
];

export const headerLinks = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "Insights", href: "/insights" },
  { label: "Process", href: "/process" },
];

export const footerCompany = [
  { label: "About", href: "#" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Blog", href: "/insights" },
  { label: "Awards", href: "#" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/contact" },
];

export const footerServices = [
  { label: "CRO", href: "/growth-retainers" },
  { label: "Audits", href: "/audits" },
  { label: "Growth Retainers", href: "/growth-retainers" },
  { label: "Shopify Builds", href: "/shopify-theme-builds" },
  { label: "Discovery", href: "/shopify-theme-builds" },
  { label: "Shopify Plus", href: "/shopify-theme-builds#shopify-plus" },
];
