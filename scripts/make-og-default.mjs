/**
 * Build public/og-default.png (1200×630) for static export social previews.
 * Matches src/app/opengraph-image.tsx copy and sunny vibe tokens from
 * src/styles/figma-tokens.css.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public", "og-default.png");

const DEEP = "#5c3d1e";
const MID = "#8a6430";
const LIGHT = "#fff8ed";

const SITE_NAME = "Hoahwa";
const SITE_TAGLINE = "High-End Web Design & Development";
const SITE_HOST = "hoahwa.com";
const FOOTER =
  "High-performance Shopify storefronts · CRO · Design-led growth";

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${DEEP}"/>
      <stop offset="100%" stop-color="${MID}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="80" y="120" fill="${LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="32" letter-spacing="-0.02em">${escapeXml(SITE_HOST)}</text>
  <text x="80" y="380" fill="${LIGHT}" font-family="Arial, Helvetica, sans-serif" font-size="120" font-weight="700" letter-spacing="-0.04em">${escapeXml(SITE_NAME)}</text>
  <text x="80" y="460" fill="${LIGHT}" fill-opacity="0.9" font-family="Arial, Helvetica, sans-serif" font-size="44" letter-spacing="-0.02em">${escapeXml(SITE_TAGLINE)}</text>
  <text x="80" y="560" fill="${LIGHT}" fill-opacity="0.8" font-family="Arial, Helvetica, sans-serif" font-size="28">${escapeXml(FOOTER)}</text>
</svg>`;

const logoPath = join(root, "public", "logo-hoahwa", "hoahwa_logo_board-07.png");
const logo = readFileSync(logoPath);
const logoSized = await sharp(logo).resize(120, 120, { fit: "inside" }).png().toBuffer();

const base = await sharp(Buffer.from(svg)).png().toBuffer();

await sharp(base)
  .composite([{ input: logoSized, top: 80, left: 980 }])
  .png()
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
