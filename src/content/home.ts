export const growthPitch = {
  headline: ["Exquisite design", "meets top-tier", "compatibility"],
  body: [
    "We are a young, dynamic boutique agency focused on crafting high-end websites that stand out. By working directly with individual clients, we bring exceptional dedication and high personal accountability.",
    "Cost efficiency is always our key strength. Our ultimate ambition is to win prestigious awards at leading global design organisations, combining pristine aesthetics with flawless technical compatibility.",
    "Ready to build something extraordinary?",
  ],
  cta: "Contact",
};

export const servicesAccordion = [
  {
    id: "design",
    title: "Aesthetic Web Design",
    body: "Crafting visually striking, award-worthy web interfaces that showcase your brand's unique character. We prioritise pristine aesthetics, modern typography, and immersive interactions.",
  },
  {
    id: "build",
    title: "Top-Tier Web Development",
    body: "Building fast, clean, and responsive websites with cutting-edge technical compatibility. Every line of code is optimised for seamless performance on all browser environments.",
  },
  {
    id: "collaboration",
    title: "Direct Collaboration",
    body: "No administrative layers, account managers, or bureaucratic bloat. You collaborate directly with the creators, ensuring high personal responsibility, rapid execution, and maximum cost efficiency.",
  },
  {
    id: "optimization",
    title: "Performance Optimisation",
    body: "Ensuring your website is fully optimised for speed, search engines, and modern compatibility standards, keeping maintenance simple and cost-effective.",
  },
];

/**
 * Replaces the previous testimonials carousel. We are a new studio and have not
 * published client references yet — this section states what we are building and
 * how we work instead of borrowing credibility we have not earned.
 */
export const buildingNow = {
  eyebrow: "Where we are",
  headline: ["We're a new studio.", "Here's the honest version."] as const,
  lead: "No borrowed logos, no invented quotes. This is what we've built, how we work, and what you can verify yourself today.",
  items: [
    {
      num: "01",
      title: "This site is our first case study",
      body: "hoahwa.com is designed, built, and shipped in-house on Next.js — every design decision, performance budget, and Lighthouse score documented and open to inspection.",
      href: "/case-studies/hoahwa-com",
      linkLabel: "Read the build breakdown",
    },
    {
      num: "02",
      title: "You work with the people who build it",
      body: "No account managers, no handoffs. You talk directly to the developer and designer doing the work — which is why we can move fast and quote lower than a traditional agency.",
      href: "/about",
      linkLabel: "Meet the team",
    },
    {
      num: "03",
      title: "Fixed scope, fixed price, before we start",
      body: "Every engagement begins with a written scope and a flat quote. You approve it before a line of code is written, and we hold the price if our estimate was wrong.",
      href: "/process",
      linkLabel: "See how we work",
    },
    {
      num: "04",
      title: "Client work is under way — stories to follow",
      body: "We publish a case study only once a project has shipped and the client has approved the write-up. When there's a result worth showing, it will appear here with their name on it.",
      href: "/book",
      linkLabel: "Book an intro call",
    },
  ],
};

export const blogTeaser = [
  {
    num: "01",
    title: "Why Slow Websites Hurt User Engagement More Than You Realise",
  },
  {
    num: "02",
    title: "How to Achieve Flawless Cross-Browser Compatibility and Fast Page Speed",
  },
  {
    num: "03",
    title: "The Power of Direct Collaboration: Cutting the Agency Overhead",
  },
  {
    num: "04",
    title: "Designing for Web Awards: Aesthetic Best Practices and Modern UI Patterns",
  },
];

export const poolCta = {
  headline: [
    "Ready to work directly with",
    "the people who build it?",
  ],
  cta: "Contact",
};

/**
 * Homepage pointer to the /video-editor service page. The three slots mirror
 * the 9:16 reel row on that page so the teaser previews what it links to —
 * swap them for real thumbnails once the Remotion output exists.
 */
export const videoTeaser = {
  eyebrow: "New",
  headline: ["Motion, built in code.", "Not dragged on a timeline."] as const,
  lead:
    "Placeholder — 1–2 câu giới thiệu dịch vụ video. Thay bằng copy thật; " +
    "giữ độ dài tương đương để hàng preview không đổi tỉ lệ.",
  slots: ["Short-form", "Motion", "Launch"] as const,
  href: "/video-editor",
  linkLabel: "See the work",
};
