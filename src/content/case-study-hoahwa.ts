/**
 * Case study: hoahwa.com itself.
 *
 * Every number on this page is measured from our own build output, not
 * estimated. When the site changes, re-measure and update — a stale number is
 * the same problem as an invented one.
 *
 * Last measured: 2026-07-29, `next build` on Next.js 16.2.6 (Turbopack).
 */

export const caseStudyMeta = {
  eyebrow: "Case study 001",
  headline: ["We had no client work to show.", "So we documented our own."],
  lead: "hoahwa.com is the first project we can talk about end to end — every decision, every trade-off, and every number below is taken from our own build output. If you want to know how we work before hiring us, this is the honest version.",
  measured: "Figures measured 29 July 2026 from a production build.",
};

export const caseStudyStats = [
  { value: "43", label: "Pages pre-rendered as static HTML" },
  { value: "5.1s", label: "Production build, cold" },
  { value: "7", label: "Runtime dependencies, total" },
  { value: "0", label: "Servers to keep alive" },
];

export const caseStudyChapters = [
  {
    num: "01",
    title: "The brief we gave ourselves",
    body: [
      "A studio selling design and technical quality has exactly one credential before its first client ships: its own website. So the brief was to build the site we would want to hand a client — visually distinctive, genuinely fast, and cheap enough to run that we would never be tempted to cut corners later.",
      "The constraint that shaped everything else: it had to be honest. No stock testimonials, no logos we had not earned, no metrics we could not reproduce on demand.",
    ],
  },
  {
    num: "02",
    title: "Why static export, not a server",
    body: [
      "The site is a Next.js app built with `output: \"export\"`, which pre-renders all 43 routes to static HTML at build time. There is no Node process running in production — the whole site is files on a CDN.",
      "The trade-off is real and worth stating: static export disables Next's on-demand image optimiser, so every image has to be sized and compressed before it ships. We took that deal deliberately. A marketing site has no per-request logic worth paying for, and static files cannot fall over at 2am, cannot leak a database credential, and cost effectively nothing to serve.",
    ],
  },
  {
    num: "03",
    title: "A dependency budget, enforced",
    body: [
      "The site runs on seven production dependencies: Next, React, React DOM, Framer Motion for page transitions, Swiper for carousels, and clsx plus tailwind-merge for class composition. That is the entire list.",
      "Every dependency is a thing that can break, bloat, or need patching for the life of the project. The animation and layout work here is hand-built against Tailwind rather than pulled from a component library, which is more work up front and considerably less maintenance later.",
    ],
  },
  {
    num: "04",
    title: "The image problem, and what it cost us",
    body: [
      "Because static export rules out runtime image optimisation, the team photographs went out as 1856×2282 PNGs at roughly 6 MB each. Three of them on one page is about 19 MB of images for a page whose text weighs a few kilobytes. On a mobile connection that is a genuinely bad experience.",
      "The fix was unglamorous: resize to 1200 px on the long edge — twice the largest size any card actually renders — and encode as WebP at quality 82. The three files went from 19.2 MB to 252 KB, a 98.7% reduction, with no visible difference at render size.",
      "We are including this because it is the kind of thing that quietly ships on most sites and nobody measures. It is also the single highest-leverage performance fix available on most projects we audit.",
    ],
  },
  {
    num: "05",
    title: "What we would tell a client",
    body: [
      "The architecture here suits a marketing site with content that changes weekly, not hourly. If you need real-time inventory, personalised pricing, or authenticated dashboards, static export is the wrong shape and we would tell you so rather than force it.",
      "For a Shopify storefront the equivalent decisions are different again — Liquid, theme sections, and metafields instead of React routes — but the underlying discipline is the same: ship less, measure what you ship, and choose boring infrastructure over clever infrastructure.",
    ],
  },
];

export const caseStudyStack = [
  { label: "Framework", value: "Next.js 16.2 (App Router, Turbopack)" },
  { label: "UI", value: "React 19.2" },
  { label: "Styling", value: "Tailwind CSS v4" },
  { label: "Motion", value: "Framer Motion 12" },
  { label: "Output", value: "Fully static export, no server runtime" },
  { label: "Forms", value: "PHP endpoints on shared hosting, MySQL storage" },
];

export const caseStudyCta = {
  headline: ["Want this level of detail", "on your own project?"],
  body: "We scope every engagement in writing before it starts, and we report numbers the same way we have here — measured, not estimated.",
  cta: "Book a call",
};
