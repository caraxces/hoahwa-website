/**
 * Build public/og/<slug>.png (1200×630) for case studies and build log.
 * Same rendering approach as make-og-default.mjs (SVG + sharp composite).
 */
import { mkdirSync, readFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "public", "og");

const DEEP = "#5c3d1e";
const MID = "#8a6430";
const LIGHT = "#fff8ed";
const SITE_HOST = "hoahwa.com";
const BRAND = "HoaHwa";

/** @type {{ slug: string; title: string; description: string; hero?: string }[]} */
const PAGES = [
  {
    slug: "bloombound-3d-landing-page",
    title: "BloomBound — A 3D Landing Page You Can Play",
    description:
      "How we built a playable Three.js landing page for hoahwa.com: nine CC0 models across four instanced districts, a remeshed 22-bone Cyclops animated in code, a Vite game mounted inside a Next.js static export — and the 143 KB gzipped engine that costs.",
    hero: "/img/bloombound/launcher.webp",
  },
  {
    slug: "hoahwa-com",
    title: "Building hoahwa.com — Our First Case Study",
    description:
      "How we built our own site: static export on Next.js 16, a seven-dependency budget, and a 98.7% image-weight reduction — with every number measured from the production build.",
  },
  {
    slug: "ke-audio-story-studio",
    title: "Kể — An AI Story Studio That Runs On Your Own Machine",
    description:
      "How we built a local-first Vietnamese audio story studio: bring-your-own ChatGPT instead of an API bill, an originality gate that measures the script rather than trusting the AI, voice cloning that never leaves the laptop — and the Windows-only transcript bug that three of our tests were mocking out.",
  },
  {
    slug: "notch-agent-train",
    title: "Notch Agent Train: A macOS Notch App That Runs AI Coding Agents",
    description:
      "How we built our own macOS notch app: Claude splits the work and delegates slices to Codex, Cursor, Antigravity, Kimi, opencode or another Claude, with routing by task kind, git worktree isolation, review before merge and live progress in the notch. Updated 28 October 2026.",
  },
  {
    slug: "shopify-developer",
    title: "Shopify + Developer — Why You Need Both",
    description:
      "A practical explainer on what Shopify provides vs what custom development is responsible for—plus how we structure delivery and support after launch.",
  },
  {
    slug: "tarotto-programmatic-seo",
    title: "Tarotto — 900+ Pages of Programmatic SEO From a Standing Start",
    description:
      "How tarotto.io went from zero indexed pages to a 729-page editorial library plus interactive tools in a saturated niche: the content model, bilingual hreflang from day one, and why we report two measurement dates instead of a growth rate.",
  },
  {
    slug: "vietfolk-winter-2026",
    title: "Vietfolk ’26 — A Shopify Editions Page Rebuilt in Vietnamese",
    description:
      "How we rebuilt a Shopify Editions-style launch microsite as a Vietnamese technical demo: 12 WebGL scenes, 47 compressed 3D models, 6,352 words rewritten for implementers — and what the 8 MB page cost us.",
    hero: "/img/vietfolk/hero-vietfolk-fullwidth-desktop-v2.webp",
  },
  {
    slug: "build-log",
    title: "Build log",
    description:
      "A reverse-chronological feed of what Hoahwa ships each week across hoahwa.com, BloomBound, Kể, Tarotto, HoaHwa Links, and Notch Agent Train.",
  },
];

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapWords(text, maxCharsPerLine, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(" ").length > lines.join(" ").length) {
    const last = lines[maxLines - 1];
    if (last.length > 3) lines[maxLines - 1] = `${last.slice(0, Math.max(0, maxCharsPerLine - 1))}…`;
  }
  return lines;
}

function truncateLine(text, maxChars) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  return `${t.slice(0, maxChars - 1)}…`;
}

function buildBackgroundSvg() {
  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${DEEP}"/>
      <stop offset="100%" stop-color="${MID}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
</svg>`;
}

function buildTextLayerSvg({ title, kicker, textMaxWidth }) {
  // Hero cards leave ~480px of text column (x 80 → hero edge): keep lines short.
  const titleSize = textMaxWidth < 700 ? 46 : 58;
  const titleLines = wrapWords(title, textMaxWidth < 700 ? 19 : 38, textMaxWidth < 700 ? 5 : 4);
  const kickerMax = textMaxWidth < 700 ? 34 : 92;
  const kickerLine = truncateLine(kicker, kickerMax);

  const titleStartY = 200;
  const titleLineHeight = Math.round(titleSize * 1.12);
  const titleTsps = titleLines
    .map(
      (line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : titleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");
  const kickerY = titleStartY + titleLines.length * titleLineHeight + 36;

  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <text x="80" y="100" fill="${LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="28" letter-spacing="-0.02em">${escapeXml(SITE_HOST)}</text>
  <text x="80" y="148" fill="${LIGHT}" fill-opacity="0.75" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="600" letter-spacing="0.06em">${escapeXml(BRAND.toUpperCase())}</text>
  <text x="80" y="${titleStartY}" fill="${LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="700" letter-spacing="-0.03em">${titleTsps}</text>
  <text x="80" y="${kickerY}" fill="${LIGHT}" fill-opacity="0.88" font-family="Arial, Helvetica, sans-serif" font-size="26" letter-spacing="-0.01em">${escapeXml(kickerLine)}</text>
</svg>`;
}

function buildTextSvg(params) {
  const layer = buildTextLayerSvg(params);
  const inner = layer.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return buildBackgroundSvg().replace("</svg>", `${inner}</svg>`);
}

function buildHeroEdgeScrimSvg() {
  const width = 160;
  return `
<svg width="${width}" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${DEEP}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${DEEP}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="630" fill="url(#scrim)"/>
</svg>`;
}

const logoPath = join(root, "public", "logo-hoahwa", "hoahwa_logo_board-07.png");
const logo = readFileSync(logoPath);
const logoSized = await sharp(logo).resize(96, 96, { fit: "inside" }).png().toBuffer();

mkdirSync(outDir, { recursive: true });

const HERO_WIDTH = 520;
const HERO_LEFT = 1200 - HERO_WIDTH;

for (const page of PAGES) {
  const textMaxWidth = page.hero ? 620 : 1040;
  const textParams = {
    title: page.title,
    kicker: page.description,
    textMaxWidth,
  };

  const composites = [];
  let base;

  if (page.hero) {
    base = await sharp(Buffer.from(buildBackgroundSvg())).png().toBuffer();
    const heroPath = join(root, "public", page.hero.replace(/^\//, ""));
    const heroPanel = await sharp(heroPath)
      .resize(HERO_WIDTH, 630, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();
    composites.push({ input: heroPanel, left: HERO_LEFT, top: 0 });
    const edgeScrim = await sharp(Buffer.from(buildHeroEdgeScrimSvg())).png().toBuffer();
    composites.push({ input: edgeScrim, left: HERO_LEFT - 120, top: 0 });
    const textLayer = await sharp(Buffer.from(buildTextLayerSvg(textParams))).png().toBuffer();
    composites.push({ input: textLayer, left: 0, top: 0 });
  } else {
    base = await sharp(Buffer.from(buildTextSvg(textParams))).png().toBuffer();
  }

  // Bottom-right on text-only cards so long titles never run under it.
  composites.push({ input: logoSized, top: page.hero ? 40 : 462, left: page.hero ? 460 : 1024 });

  const outPath = join(outDir, `${page.slug}.png`);
  const pngOpts = page.hero
    ? { compressionLevel: 9, adaptiveFiltering: true }
    : { compressionLevel: 9, adaptiveFiltering: true, palette: true, quality: 80, effort: 10 };
  await sharp(base)
    .composite(composites)
    .png(pngOpts)
    .toFile(outPath);

  let size = readFileSync(outPath).length;
  if (size > 300 * 1024) {
    const tmpPath = `${outPath}.tmp.png`;
    await sharp(outPath)
      .png({ compressionLevel: 9, palette: true, quality: 72, effort: 10, colors: 180 })
      .toFile(tmpPath);
    renameSync(tmpPath, outPath);
    size = readFileSync(outPath).length;
  }
  console.log(`Wrote ${outPath} (${Math.round(size / 1024)} KB)`);
}
