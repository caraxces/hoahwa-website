/**
 * Case study 002: Vietfolk ’26.
 *
 * A self-initiated technical demo — a Shopify Editions-style launch microsite
 * rebuilt in Vietnamese from the implementer's point of view. It has no client,
 * so every figure here is measured from the files in `public/assets/
 * vietfolk-winter2026` and from the live page, not estimated.
 *
 * Last measured: 2026-09-05 (asset inventory + Playwright run on mobile
 * emulation, unthrottled connection). Re-measure when the demo changes.
 */

import type { CaseStudyContent } from "@/components/case-studies/CaseStudyLayout";

export const caseStudyVietfolk: CaseStudyContent = {
  meta: {
    eyebrow: "Case study 002",
    headline: ["A Shopify launch page,", "rebuilt as a Vietnamese stage."],
    lead: "Every Shopify Editions release ships as a long, motion-heavy microsite written for merchants in general. Vietfolk ’26 is our version of that page: the same scroll-driven format, rewritten in Vietnamese from the point of view of the people who actually have to set the features up — with the effort, the risk and the sequencing spelled out for each one.",
    measured: "Figures measured 5 September 2026 from the asset inventory and a mobile-emulation run of the live demo.",
  },
  stats: [
    { value: "12", label: "Scroll-driven scenes, one per feature family" },
    { value: "47", label: "Compressed 3D models (.glb), 30 KTX2 GPU textures" },
    { value: "6,352", label: "Words of Vietnamese copy, rewritten for implementers" },
    { value: "0", label: "Client logos borrowed, metrics invented" },
  ],
  chapters: [
    {
      num: "01",
      title: "Why build a page nobody asked for",
      body: [
        "A Shopify studio in Vietnam has a credibility problem that is not about skill: there is very little public, technically demanding Shopify work in Vietnamese to point at. Editions pages are the most ambitious thing Shopify itself publishes each season — WebGL scenes, 3D product renders, Rive animation, hundreds of feature cards — so rebuilding one is a direct way to show we can handle that tier of front-end work.",
        "The second reason is the one we actually care about. Shopify writes Editions from the vendor's side: here is what you now have. Merchants need the other half: which of these can be switched on in an afternoon, which ones change the money flow and need before/after numbers, and which ones are a real project with tests and a rollback plan. Vietfolk ’26 is that other half.",
      ],
    },
    {
      num: "02",
      title: "The rewrite, not the translation",
      body: [
        "Every one of the 187 feature entries was rewritten rather than translated. Where Shopify says \"Sidekick can build custom apps for your business\", our version says what we would build first — a replenishment app, a team task board, a B2B CSV importer — how long the setup takes, and what we would need from the merchant to do it.",
        "The result reads as a services page disguised as a launch page, which is the point. Each section ends with the same two facts: what we can set up, and roughly how long it takes. Those are the two questions we get asked in every discovery call.",
      ],
    },
    {
      num: "03",
      title: "The technical build",
      body: [
        "The page is twelve scroll-driven scenes. The 3D work ships as 47 compressed glTF binaries with 30 KTX2 GPU-compressed textures, so the browser decodes textures on the graphics card instead of the main thread. Twenty-seven Rive files handle the vector animation, and 99 short video clips cover the product demos that would be too expensive to render live.",
        "Scene timing is driven by a Theatre.js project state rather than hand-written scroll math, which is what made it possible to iterate on twelve scenes without breaking the ones already finished.",
        "On a mobile emulation with an unthrottled connection the live demo renders its largest element in 1.2 s with zero layout shift. That number is honest but flattering — see the next chapter.",
      ],
    },
    {
      num: "04",
      title: "What it cost, and what we would not do again",
      body: [
        "The page transfers 8.1 MB on first load, and the HTML document alone is 1.36 MB. That is acceptable for a deliberate showcase; it would be indefensible on a storefront. The asset directory is 486 files and 208 MB on disk, and the mirror script that assembled it also saved every Shopify CDN variant — the same image under a dozen query-string filenames — which pushed the raw export past 800 MB before we deduplicated it with a rewrite rule.",
        "That weight broke our deployment. Hostinger's upload API wipes the site directory and then rejects large archives, so a page this size cannot be deployed atomically through it. We moved the whole site to an rsync merge over SSH, which transfers only what changed and resumes after a dropped connection. A demo page changed how the production site ships — that is the kind of consequence a client should hear about before the work starts, not after.",
      ],
    },
    {
      num: "05",
      title: "Why the demo is no longer in Google's index",
      body: [
        "Vietfolk ’26 was originally published as an indexable page with a sitemap priority just below our service pages. That was a mistake we caught in our own SEO audit: the page follows Shopify's Editions structure closely enough that a search engine would reasonably file it as derivative, and an 8 MB page is a poor first impression for a visitor arriving from search.",
        "So this case study is now the indexable face of the work, and the demo itself carries a noindex tag and is linked from here. Same pattern we recommend to clients with heavy interactive pieces: let a fast, well-structured page rank, and let the showpiece be one click behind it.",
      ],
    },
  ],
  stack: [
    { label: "Format", value: "Twelve scroll-driven scenes, Vietnamese copy" },
    { label: "3D", value: "47 glTF binaries, 30 KTX2 GPU-compressed textures" },
    { label: "Animation", value: "27 Rive files; Theatre.js project state for scene timing" },
    { label: "Video", value: "99 short clips, muted and lazy" },
    { label: "Weight", value: "8.1 MB first load, 1.36 MB HTML, 208 MB of assets on disk" },
    { label: "Hosting", value: "Static files on LiteSpeed, deployed by rsync merge over SSH" },
  ],
  gallery: [
    {
      src: "/img/vietfolk/hero-vietfolk-fullwidth-desktop-v2.webp",
      alt: "Vietfolk ’26 hero — The Renaissance Edition, a Shopify developer stage in Vietnamese",
      width: 1920,
      height: 820,
      caption: "Opening scene. The headline reads \"We're engineers, not devs\" — a Shopify developer stage in Vietnamese.",
    },
    {
      src: "/img/vietfolk/sidekick-replenishment-v1.webp",
      alt: "Sidekick prompt: build an app that suggests which products to reorder",
      width: 1200,
      height: 900,
      caption: "Sidekick chapter — the first custom app we would build: a replenishment suggester.",
    },
    {
      src: "/img/vietfolk/sidekick-b2b-import-v1.webp",
      alt: "Sidekick prompt: bulk-import B2B companies from a CSV file",
      width: 1200,
      height: 900,
      caption: "B2B chapter — bulk company import from CSV, the unglamorous step every B2B rollout starts with.",
    },
    {
      src: "/img/vietfolk/sidekick-team-tasks-v1.webp",
      alt: "Sidekick prompt: create a task board for the whole team",
      width: 1200,
      height: 900,
      caption: "Operations chapter — a shared task board, generated from a one-line prompt.",
    },
  ],
  demo: {
    href: "/editions/winter2026/",
    label: "Open the live demo",
    note: "8 MB, WebGL, best on desktop. Marked noindex on purpose — this page is the one meant to be found.",
  },
  cta: {
    headline: ["Want a launch page", "that explains as well as it moves?"],
    body: "We scope every engagement in writing before it starts, and we report the weight and the trade-offs the same way we have here — measured, not estimated.",
    cta: "Book a call",
  },
};
