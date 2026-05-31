import type { PortfolioPageConfig } from "./schema";

const asset = (path: string) => `/portfolio-demo/assets/${path}`;

/** Personal portfolio showcase — Hoahwa brand, no third-party product names. */
export const hoahwaPortfolioDemo: PortfolioPageConfig = {
  slug: "demo",
  meta: {
    title: "Hoahwa — Developer & Digital Studio",
    description:
      "Personal portfolio by Hoahwa. Web design, Shopify development, CRO, and growth for eCommerce brands.",
  },
  theme: { accent: "#c8f542" },
  sections: {
    header: {
      enabled: true,
      brandPrimary: "Hoahwa",
      brandAccent: "",
      navLinks: [
        { label: "Work", href: "#features", sectionId: "features" },
        { label: "Process", href: "#how-it-works", sectionId: "howItWorks" },
        { label: "Stack", href: "#infra", sectionId: "infra" },
        { label: "Tools", href: "#integrations", sectionId: "integrations" },
        { label: "Contact", href: "#cta", sectionId: "cta" },
      ],
      ctaLabel: "Let's talk",
      statusText: "Available for projects",
      statusSubtext: " · Ho Chi Minh City",
    },
    hero: {
      enabled: true,
      videoUrl: asset("videos/bg-hero.mp4"),
      badge: "Developer · Founder · Hoahwa studio",
      headline: ["Build digital", "experiences that ", "convert."],
      rotatingWords: ["design", "develop", "ship", "grow", "scale"],
      body: "I design and build high-performance Shopify stores, landing pages, and growth systems — from audit to launch. Direct collaboration, clean handoff, measurable outcomes.",
      codeFileName: "stack.ts",
      codeLines: [
        { type: "add", text: 'const focus = ["Shopify", "Next.js", "CRO", "SEO"]' },
        { type: "add", text: 'const studio = "Hoahwa"' },
        { type: "comment", text: "// Your portfolio, your story — powered by Hoahwa." },
      ],
      primaryCta: { label: "View my work", href: "#features" },
      secondaryCta: { label: "How I work →", href: "#how-it-works" },
      stats: [
        { value: "5+", label: "Years building" },
        { value: "100%", label: "Direct collaboration" },
        { value: "Shopify", label: "Plus & theme builds" },
        { value: "CRO", label: "Audit to launch" },
      ],
    },
    features: {
      enabled: true,
      eyebrow: "Selected work",
      title: "What I",
      titleMuted: "deliver.",
      lead: "End-to-end digital work for brands that care about aesthetics, speed, and conversion.",
      items: [
        {
          number: "01",
          tag: "Shopify",
          title: "Theme & store builds",
          body: "Custom Shopify themes, replatforming, and performance-focused storefronts built to scale.",
          statValue: "Plus",
          statLabel: "Shopify expertise",
        },
        {
          number: "02",
          tag: "Design",
          title: "UI & brand systems",
          body: "Landing pages, design systems, and asset libraries that stay on-brand from wireframe to ship.",
          statValue: "UI",
          statLabel: "Design-led delivery",
        },
        {
          number: "03",
          tag: "Growth",
          title: "CRO & SEO retainers",
          body: "Audits, experiment backlogs, and search visibility — prioritised by impact, not vanity metrics.",
          statValue: "ROI",
          statLabel: "Growth focus",
        },
        {
          number: "04",
          tag: "Process",
          title: "Audit to go-live",
          body: "Structured discovery, wireframes, phased delivery — so you always know what ships and when.",
          statValue: "5",
          statLabel: "Phase workflow",
        },
      ],
    },
    howItWorks: {
      enabled: true,
      eyebrow: "Process",
      titleLines: ["Discover.", "Design.", "Ship."],
      imageUrl: asset("images/tree.png"),
      steps: [
        {
          number: "01",
          title: "Discover",
          subtitle: "audit & direction",
          body: "Research, competitor review, and wireframes to align structure and reduce risk before build.",
        },
        {
          number: "02",
          title: "Design",
          subtitle: "UI & assets",
          body: "Visual direction, component libraries, and content slots — all media via your CDN or Drive links.",
        },
        {
          number: "03",
          title: "Ship",
          subtitle: "build & optimise",
          body: "Development, QA, launch, and optional growth retainer — with clear handoff documentation.",
        },
      ],
    },
    infra: {
      enabled: true,
      eyebrow: "Stack & tools",
      title: "Built with",
      titleMuted: "modern tools.",
      lead: "A practical stack for fast sites, clean code, and maintainable delivery.",
      imageUrl: asset("images/world.png"),
      mainStat: {
        value: "Next",
        unit: ".js",
        label: "Static export, React components, and performance-first architecture.",
      },
      sideStats: [
        { value: "Shopify", label: "Theme & Plus" },
        { value: "PHP", label: "Forms & API" },
      ],
      regions: [
        { name: "Frontend", nodes: "React · Tailwind", active: true },
        { name: "Commerce", nodes: "Shopify · Liquid" },
        { name: "Hosting", nodes: "Hostinger · CDN" },
        { name: "Data", nodes: "MySQL · JSON" },
      ],
    },
    stats: {
      enabled: true,
      liveLabel: "Studio",
      title: "Focus",
      titleMuted: "areas.",
      graphImageUrl: asset("images/real-time-graph.png"),
      blocks: [
        {
          label: "Landing pages built",
          sublabel: "portfolio & campaign",
          value: "50",
          suffix: "+",
        },
        {
          label: "Client satisfaction",
          sublabel: "direct collaboration",
          value: "100",
          suffix: "%",
        },
        {
          label: "Response time",
          sublabel: "typical reply",
          value: "24",
          prefix: "<",
          suffix: "h",
        },
      ],
      tags: ["Shopify", "Next.js", "CRO", "SEO", "Figma", "TypeScript", "MySQL"],
    },
    integrations: {
      enabled: true,
      eyebrow: "Platforms",
      title: "Works with",
      titleMuted: "your stack.",
      lead: "Integrations and platforms I use daily for design, build, and growth delivery.",
      bannerImageUrl: asset("images/connection.png"),
      items: [
        { name: "Shopify", tag: "Commerce", logoUrl: asset("logos/shopify.svg") },
        { name: "Figma", tag: "Design", logoUrl: asset("logos/figma.svg") },
        { name: "Next.js", tag: "Frontend", logoUrl: asset("logos/nextdotjs.svg") },
        { name: "Hostinger", tag: "Hosting", logoUrl: asset("logos/hostinger.svg") },
        { name: "Google Drive", tag: "Assets", logoUrl: asset("logos/googledrive.svg") },
        { name: "Hotjar", tag: "CRO", logoUrl: asset("logos/hotjar.svg") },
        { name: "GA4", tag: "Analytics", logoUrl: asset("logos/googleanalytics.svg") },
        { name: "Your CDN", tag: "Media", logoUrl: asset("logos/cloudflare.svg") },
      ],
    },
    testimonials: {
      enabled: true,
      eyebrow: "Kind words",
      title: "Trusted by",
      titleMuted: " collaborators.",
      sideStat: { value: "100", label: "Direct communication" },
      companies: ["eCommerce", "Agencies", "Founders", "Shopify brands"],
      items: [
        {
          quote:
            "Hoahwa delivered a clean Shopify build on a tight timeline. Communication was direct and the design quality was top-tier.",
          name: "Client A.",
          role: "Brand founder",
          avatar: "C",
        },
        {
          quote:
            "The audit-to-launch process made everything predictable. We knew exactly what was shipping each phase.",
          name: "Client B.",
          role: "eCommerce lead",
          avatar: "B",
        },
        {
          quote:
            "Landing page portfolio tool is exactly what we needed — fast setup, our media links, no vendor lock-in on assets.",
          name: "Client C.",
          role: "Creative director",
          avatar: "D",
        },
      ],
    },
    pricing: {
      enabled: false,
      eyebrow: "Pricing",
      title: "Packages",
      titleMuted: "on request.",
      lead: "",
      bundleTabLabel: "Projects",
      paygTabLabel: "Retainer",
      rulesTitle: "",
      rules: [],
      bundlePlans: [],
      paygPlans: [],
      contactTitle: "",
      contactLead: "",
      contactLinks: [],
    },
    cta: {
      enabled: true,
      title: "Ready to\nstart a project?",
      body: "Get in touch for audits, Shopify builds, or a personal landing page on your own domain via Hostinger.",
      primaryCta: "Contact Hoahwa",
      secondaryCta: "View process",
      footnote: "Based in Ho Chi Minh City · Working with clients globally",
      imageUrl: asset("images/bridge.png"),
    },
    footer: {
      enabled: true,
      brandPrimary: "Hoahwa",
      brandAccent: "",
      description:
        "Developer-led studio for Shopify, landing pages, and growth. Build your portfolio page with Hoahwa — keep your media on your CDN.",
      socialLinks: [
        { label: "Website", href: "https://hoahwa.com/" },
        { label: "Contact", href: "https://hoahwa.com/contact/" },
      ],
      linkGroups: [
        {
          title: "Studio",
          links: [
            { label: "Process", href: "https://hoahwa.com/process/" },
            { label: "Audits", href: "https://hoahwa.com/audits/" },
            { label: "Contact", href: "https://hoahwa.com/contact/" },
          ],
        },
        {
          title: "Portfolio",
          links: [
            { label: "Create yours", href: "/portfolio/builder/" },
            { label: "Demo page", href: "/p/demo/" },
          ],
        },
      ],
      copyright: "© 2026 Hoahwa. Personal portfolio demo.",
      statusText: "Powered by Hoahwa",
      bannerImageUrl: asset("images/footer-bg.png"),
    },
  },
};
