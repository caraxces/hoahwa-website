#!/usr/bin/env node
/**
 * Keypoint burst smoke — scrolls through the About frame sequence and asserts
 * every keypoint bubble sits fully inside the viewport, above the sticky frame.
 * Usage: serve the static export first (npx serve out -l 3010), then:
 *        node scripts/keypoint-burst-smoke.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:3010";
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
let failures = 0;

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  page.on("pageerror", (e) => {
    failures += 1;
    console.log(`[${vp.name}] PAGE ERROR:`, e.message);
  });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const track = page.locator('[data-testid="hero-frame-sequence"]');
  await track.waitFor({ state: "attached" });
  const trackTop = await track.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  const trackH = await track.evaluate((el) => el.getBoundingClientRect().height);

  let sawBurst = false;
  let bubbleSamples = 0;
  let clippedBubbles = 0;
  let zIndexOk = null;

  for (let step = 0; step <= 10; step += 1) {
    const y = Math.round(trackTop - 100 + (trackH + 600) * (step / 10));
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(900);

    const burst = page.locator('[data-testid="keypoint-burst"]');
    if ((await burst.count()) === 0) continue;
    sawBurst = true;

    if (zIndexOk === null) {
      zIndexOk = await page.evaluate(() => {
        const overlay = document.querySelector('[data-testid="keypoint-burst"]');
        const sticky = document.querySelector("[data-frame-sticky]");
        if (!overlay || !sticky) return null;
        return (
          parseInt(getComputedStyle(overlay).zIndex, 10) >
          parseInt(getComputedStyle(sticky).zIndex, 10)
        );
      });
    }

    const result = await page.evaluate(() => {
      const overlay = document.querySelector('[data-testid="keypoint-burst"]');
      if (!overlay) return { total: 0, clipped: 0 };
      let total = 0;
      let clipped = 0;
      for (const p of overlay.querySelectorAll("p")) {
        const r = p.getBoundingClientRect();
        if (r.width === 0) continue;
        const op = parseFloat(getComputedStyle(p).opacity);
        if (op < 0.5) continue; // mid burst-out, overflow is intentional
        total += 1;
        if (r.left < -2 || r.top < -2 || r.right > window.innerWidth + 2 || r.bottom > window.innerHeight + 2) {
          clipped += 1;
          console.log(
            `clipped bubble: ${JSON.stringify({ l: Math.round(r.left), t: Math.round(r.top), rgt: Math.round(r.right), b: Math.round(r.bottom) })} viewport ${window.innerWidth}x${window.innerHeight} :: ${p.textContent}`,
          );
        }
      }
      return { total, clipped };
    });
    bubbleSamples += result.total;
    clippedBubbles += result.clipped;
  }

  console.log(
    `[${vp.name}] burst rendered: ${sawBurst}, bubbles sampled: ${bubbleSamples}, outside viewport: ${clippedBubbles}, overlay above sticky frame: ${zIndexOk}`,
  );
  if (!sawBurst || clippedBubbles > 0 || zIndexOk !== true) failures += 1;

  await page.screenshot({ path: `/tmp/keypoint-burst-${vp.name}.png` });
  await page.close();
}

await browser.close();
console.log(failures === 0 ? "PASS" : `FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
