#!/usr/bin/env node
/**
 * Export all site images into one zip for designer retouching.
 *   node scripts/export-images-for-designer.mjs
 * Output: hoahwa-images-for-designer.zip
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "hoahwa-images-export");
const ZIP_PATH = path.join(ROOT, "hoahwa-images-for-designer.zip");

/** @type {Record<string, string>} */
const FIGMA_REMOTE = {
  "case-watchhouse": "https://www.figma.com/api/mcp/asset/31b5b8f8-b857-441c-904c-77e7862c718e",
  "case-kick-game": "https://www.figma.com/api/mcp/asset/6afe90e1-78c3-4cbc-9083-ff20c227f6e8",
  "case-elevare": "https://www.figma.com/api/mcp/asset/0ec45719-d134-4ac2-bac5-776913f79d8b",
  "case-components": "https://www.figma.com/api/mcp/asset/db46ae84-3896-46b8-bd24-ffc6fc5a48c7",
  "case-frahm": "https://www.figma.com/api/mcp/asset/2b696322-8673-4e86-af29-04f4da4f7344",
  "case-duke-dexter": "https://www.figma.com/api/mcp/asset/94ae7325-07b7-4d53-bad4-ade5d71b5764",
  "case-miss-me": "https://www.figma.com/api/mcp/asset/96f5eb35-dd53-4471-838b-69dcbfe789d0",
  "case-house-of-charcoal": "https://www.figma.com/api/mcp/asset/fbfb1882-cdd0-457a-a20b-a3643889823a",
};

const LOCAL_USAGE = {
  "growth-pitch.jpg": "Hero, audits, growth pages (main pitch photo)",
  "hero-video-1.jpg": "Hero video poster",
  "hero-growth.webp": "Hero growth variant",
  "award-uk-ecom.png": "Award badge + logo marquee (reused for client logos)",
  "award-european.png": "Award badge + logo marquee",
  "testimonial-sneaker.jpg": "Testimonials section",
  "cta-pool.jpg": "Newsletter / CTA background",
  "audit-insights-screenshot.png": "Audits page screenshot",
  "build-hero.jpg": "Shopify builds hero",
  "build-process.jpg": "Build process block",
  "build-migration.jpg": "Migration block",
  "footer-hoahwa-logo.svg": "Footer wordmark (vector)",
  "footer-hoahwa-logo.png": "Footer wordmark (raster)",
  "footer-wiro-logo.png": "Footer partner logo",
  "decorative-border.svg": "Decorative border marquee (vector)",
};

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|avif|ico)$/i;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyLocalImages() {
  const localDir = path.join(OUT_DIR, "01-local-figma");
  ensureDir(localDir);
  const figmaDir = path.join(ROOT, "public", "figma");
  const copied = [];

  if (fs.existsSync(figmaDir)) {
    for (const name of fs.readdirSync(figmaDir)) {
      if (!IMAGE_EXT.test(name)) continue;
      fs.copyFileSync(path.join(figmaDir, name), path.join(localDir, name));
      copied.push(name);
    }
  }

  const favicon = path.join(ROOT, "src", "app", "favicon.ico");
  if (fs.existsSync(favicon)) {
    fs.copyFileSync(favicon, path.join(localDir, "favicon.ico"));
    copied.push("favicon.ico");
  }

  return copied;
}

async function downloadRemote() {
  const remoteDir = path.join(OUT_DIR, "02-case-studies-figma-remote");
  ensureDir(remoteDir);
  const results = [];

  for (const [name, url] of Object.entries(FIGMA_REMOTE)) {
    const dest = path.join(remoteDir, `${name}.jpg`);
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "";
      let ext = ".jpg";
      if (ct.includes("png")) ext = ".png";
      else if (ct.includes("webp")) ext = ".webp";
      else if (ct.includes("svg")) ext = ".svg";
      const finalPath = path.join(remoteDir, `${name}${ext}`);
      fs.writeFileSync(finalPath, buf);
      results.push({ name, file: path.basename(finalPath), ok: true });
    } catch (e) {
      results.push({ name, ok: false, error: String(e.message || e) });
    }
  }
  return results;
}

function writeManifest(localFiles, remoteResults) {
  const lines = [
    "# Hoahwa website — images for retouch",
    "",
    `Exported: ${new Date().toISOString()}`,
    "",
    "## 01-local-figma/",
    "High-res assets stored in the repo. Replace files here, then send back with same filenames.",
    "",
    "| File | Used on |",
    "|------|---------|",
  ];

  for (const f of localFiles.sort()) {
    const usage = LOCAL_USAGE[f] || "See src/content/figma-assets.ts";
    lines.push(`| ${f} | ${usage} |`);
  }

  lines.push("", "## 02-case-studies-figma-remote/", "Case study card images (from Figma).", "", "| File | Case study |", "|------|------------|");

  for (const r of remoteResults) {
    if (r.ok) {
      lines.push(`| ${r.file} | ${r.name.replace(/-/g, " ")} |`);
    } else {
      lines.push(`| ${r.name} | FAILED DOWNLOAD: ${r.error} |`);
    }
  }

  lines.push(
    "",
    "## Notes",
    "- SVG logos/borders: retouch raster exports if needed, or edit vectors directly.",
    "- award-*.png are placeholder client logos in marquee — replace with real brand marks if available.",
    "- After retouch, return files with **same filenames** to `public/figma/`.",
  );

  fs.writeFileSync(path.join(OUT_DIR, "README-for-designer.md"), lines.join("\n"));
}

async function main() {
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
  ensureDir(OUT_DIR);

  console.log("→ Copying local images from public/figma…");
  const localFiles = copyLocalImages();
  console.log(`   ${localFiles.length} files`);

  console.log("→ Downloading Figma case study images…");
  const remoteResults = await downloadRemote();
  const ok = remoteResults.filter((r) => r.ok).length;
  console.log(`   ${ok}/${remoteResults.length} downloaded`);

  writeManifest(localFiles, remoteResults);

  console.log("→ Creating zip…");
  if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);
  execSync(`cd "${OUT_DIR}" && zip -r -q "${ZIP_PATH}" .`, { shell: true });

  const sizeMb = (fs.statSync(ZIP_PATH).size / 1024 / 1024).toFixed(1);
  console.log(`\nDone: ${ZIP_PATH} (${sizeMb} MB)`);
  console.log(`Folder: ${OUT_DIR}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
