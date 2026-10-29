#!/usr/bin/env node
/**
 * Post-deploy verification against the live site.
 *
 * Checks that every route resolves, that the assets each page references
 * actually exist, and that none of the previously fabricated client names or
 * claims have come back. Exits non-zero on any failure so it can gate a deploy.
 *
 *   npm run verify:live               # against https://hoahwa.com
 *   node scripts/verify-live.mjs http://localhost:3000
 */

const BASE = (process.argv[2] ?? "https://hoahwa.com").replace(/\/$/, "");

const ROUTES = [
  "/", "/about/", "/book/", "/contact/", "/process/", "/video-editor/",
  "/audits/", "/growth-retainers/", "/shopify-theme-builds/",
  "/ai-search-optimization/", "/case-studies/", "/case-studies/hoahwa-com/",
  "/case-studies/shopify-developer/", "/case-studies/vietfolk-winter-2026/", "/insights/", "/privacy/", "/terms/",
  "/cookie-policy/", "/editions/winter2026/", "/apps/bloombound/",
  "/case-studies/ke-audio-story-studio/", "/apps/ke/", "/tree/", "/tree/market/",
];

/**
 * Downloadable installers. They are the point of /apps/ke/, so a 404 or a
 * wrong content type there is a silent failure the route check cannot see.
 * Checked with HEAD so the run does not pull 600 MB.
 */
const DOWNLOADS = [
  { path: "/apps/ke/downloads/Ke-Setup-0.2.2-win-x64.exe", minBytes: 250_000_000 },
  { path: "/apps/ke/downloads/Ke-0.2.2-arm64.dmg", minBytes: 300_000_000 },
];

const ENDPOINTS = ["/api/contact.php", "/api/newsletter.php", "/api/booking.php", "/api/short-links.php"];

/** Text that must never appear again — borrowed clients and invented metrics. */
const FORBIDDEN =
  /WatchHouse|Sisters and Seekers|Duke \+ Dexter|Kick Game|Secret Linen|Brother and Kin|Seymour-Williams|Joe Lack|Jack Turner|Jack Stevens|Sam Sandiford|Geoff Bull|2,600% ROI|Want bE your|piglet in bed|500\+\s*<|Dropdead|Miss Me|House of Charcoal|DripModa/;

let failures = 0;
const fail = (m) => { failures++; console.log(`  FAIL  ${m}`); };
const pass = (m) => console.log(`  pass  ${m}`);

async function status(url, method = "GET") {
  try {
    const res = await fetch(url, { method, redirect: "manual" });
    return res.status;
  } catch {
    return 0;
  }
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) out.push(await fn(items[i++]));
    }),
  );
  return out;
}

console.log(`\nVerifying ${BASE}\n`);

console.log("[routes]");
const pages = new Map();
for (const route of ROUTES) {
  const url = `${BASE}${route}`;
  const res = await fetch(url).catch(() => null);
  if (!res || !res.ok) {
    fail(`${route} → ${res ? res.status : "network error"}`);
    continue;
  }
  const html = await res.text();
  pages.set(route, html);
  pass(`${route} → 200 (${(html.length / 1024).toFixed(0)} KB)`);
}

console.log("\n[installers]");
for (const dl of DOWNLOADS) {
  const res = await fetch(`${BASE}${dl.path}`, { method: "HEAD" }).catch(() => null);
  if (!res || !res.ok) {
    fail(`${dl.path} → ${res ? res.status : "network error"}`);
    continue;
  }
  const len = Number(res.headers.get("content-length") ?? 0);
  const type = res.headers.get("content-type") ?? "";
  const disp = res.headers.get("content-disposition") ?? "";
  if (len < dl.minBytes) fail(`${dl.path} is ${len} bytes, expected at least ${dl.minBytes}`);
  else if (/text\/(html|plain)/.test(type)) fail(`${dl.path} served as ${type} — browsers will not download it`);
  else pass(`${dl.path} → 200, ${(len / 1048576).toFixed(0)} MB, ${type}${disp ? `, ${disp}` : ""}`);
}

console.log("\n[fabricated content]");
for (const [route, html] of pages) {
  const hit = html.match(FORBIDDEN);
  if (hit) fail(`${route} contains "${hit[0]}"`);
}
if (failures === 0) pass("no fabricated client names or metrics on any page");

console.log("\n[dead links]");
for (const [route, html] of pages) {
  const dead = (html.match(/href="#"/g) ?? []).length;
  // /p/ and /portfolio/ are robots-disallowed product demos, not marketing pages.
  if (dead > 0) fail(`${route} has ${dead} href="#"`);
}
if (![...pages].some(([, h]) => /href="#"/.test(h))) pass('no href="#" on any route');

console.log("\n[referenced assets exist]");
const assets = new Set();
for (const html of pages.values()) {
  for (const m of html.matchAll(/(?:src|href)="(\/[^":?;]+\.(?:png|jpg|jpeg|webp|svg|css|js|mp4|webm|woff2?|ico))"/g)) {
    assets.add(m[1]);
  }
}
const assetResults = await mapLimit([...assets], 12, async (a) => {
  const s = await status(`${BASE}${a}`);
  return [a, s];
});
const badAssets = assetResults.filter(([, s]) => s !== 200);
if (badAssets.length === 0) {
  pass(`all ${assets.size} referenced assets return 200`);
} else {
  for (const [a, s] of badAssets.slice(0, 15)) fail(`asset ${s}: ${a}`);
  if (badAssets.length > 15) fail(`…and ${badAssets.length - 15} more broken assets`);
}

console.log("\n[api endpoints]");
for (const ep of ENDPOINTS) {
  const s = await status(`${BASE}${ep}`, "OPTIONS");
  // 204 = configured and reachable. 503 = reachable but config.php missing.
  if (s === 204) pass(`${ep} → 204 (reachable)`);
  else if (s === 503) fail(`${ep} → 503 (config.php missing on server)`);
  else fail(`${ep} → ${s}`);
}

console.log("\n[hoahwa links]");
{
  // An unknown short code must reach api/go.php through the root-level rewrite (branded 404), /r/ legacy path too.
  for (const p of ["/zz9nope", "/r/zz9nope"]) {
    const res = await fetch(`${BASE}${p}`, { redirect: "manual" }).catch(() => null);
    const body = res ? await res.text() : "";
    if (res?.status === 404 && /HoaHwa Links/.test(body)) pass(`${p} → 404 from the short-link redirector`);
    else fail(`${p} → ${res?.status ?? "no response"} (expected the redirector's 404 page)`);
  }
  const market = await fetch(`${BASE}/api/short-links.php?market=1&limit=1`).then((r) => r.json()).catch(() => null);
  if (market?.ok && Array.isArray(market.trees)) pass(`short-links market API answers (${market.totals?.links ?? "?"} links)`);
  else fail("short-links market API did not answer with ok:true");
}

console.log("\n[credential exposure]");
for (const p of ["/api/config.php", "/api/config.example.php"]) {
  const res = await fetch(`${BASE}${p}`).catch(() => null);
  const body = res ? await res.text() : "";
  if (/db_pass|<\?php/.test(body)) fail(`${p} leaks PHP source`);
  else pass(`${p} does not leak source (${body.length} bytes)`);
}

console.log(
  failures === 0
    ? "\n=== LIVE VERIFICATION PASSED ===\n"
    : `\n=== ${failures} FAILURE(S) ===\n`,
);
process.exit(failures === 0 ? 0 : 1);
