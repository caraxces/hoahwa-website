import { chromium } from "playwright";
const BASE = "http://127.0.0.1:8977";
const browser = await chromium.launch();
let fails = 0;
const log = (ok, msg) => { if (!ok) fails++; console.log(`  ${ok ? "PASS" : "FAIL"}  ${msg}`); };

async function newPage() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  return { ctx, page, errors };
}

// ---------- 1. Every marketing route loads with zero console/page errors ----------
console.log("\n[1] Routes load without JS errors");
for (const r of ["/", "/book/", "/about/", "/contact/", "/case-studies/hoahwa-com/", "/careers/", "/audits/", "/process/"]) {
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + r, { waitUntil: "networkidle" });
  const real = errors.filter(e => !/favicon|404|net::ERR_/i.test(e));
  log(real.length === 0, `${r} — ${real.length ? real[0].slice(0,110) : "clean"}`);
  await ctx.close();
}

// ---------- 2. Cookie banner (refactored to useSyncExternalStore) ----------
console.log("\n[2] Cookie consent banner");
{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const banner = page.locator('[role="dialog"][aria-labelledby="cookie-consent-title"]');
  await banner.waitFor({ state: "visible", timeout: 5000 }).catch(()=>{});
  log(await banner.isVisible(), "banner appears for a fresh visitor");

  // Accept all -> should dismiss and persist
  await page.getByRole("button", { name: /accept all/i }).first().click();
  await page.waitForTimeout(700);
  log(!(await banner.isVisible()), "banner dismisses after Accept all");
  const stored = await page.evaluate(() => localStorage.getItem("hoahwa-cookie-consent"));
  log(!!stored && JSON.parse(stored).choices.analytics === true, "choice persisted to localStorage");

  // Reload -> must stay dismissed (this is what the refactor had to preserve)
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  log(!(await banner.isVisible()), "stays dismissed after reload");
  log(errors.filter(e=>!/favicon|404/i.test(e)).length === 0, "no errors during consent flow");
  await ctx.close();
}

// ---------- 3. Vibe provider (refactored to useSyncExternalStore) ----------
console.log("\n[3] Vibe toggle");
{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-vibe"));
  log(!!before, `data-vibe present on load (${before})`);

  const toggle = page.locator('button[aria-label^="Switch to"]').first();
  if (await toggle.count() > 0 && await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(500);
    const after = await page.evaluate(() => document.documentElement.getAttribute("data-vibe"));
    log(after !== before, `toggle changes vibe (${before} -> ${after})`);
    const ls = await page.evaluate(() => localStorage.getItem("hoahwa-vibe"));
    log(ls === after, "vibe persisted to localStorage");
    await page.reload({ waitUntil: "networkidle" });
    const afterReload = await page.evaluate(() => document.documentElement.getAttribute("data-vibe"));
    log(afterReload === after, "vibe survives reload");
  } else {
    console.log("  SKIP  vibe toggle not visible on this viewport");
  }
  log(errors.filter(e=>!/favicon|404/i.test(e)).length === 0, "no errors during vibe flow");
  await ctx.close();
}

// ---------- 4. Booking page: consent gate + request form ----------
console.log("\n[4] Booking page");
{
  const { ctx, page, errors } = await newPage();
  await page.goto(BASE + "/book/", { waitUntil: "networkidle" });
  log(await page.getByRole("heading", { level: 1 }).first().isVisible(), "h1 renders");
  log(await page.locator('input[type="date"]').isVisible(), "date picker renders");
  log(await page.getByRole("button", { name: /send request/i }).isVisible(), "submit button renders");

  // Client-side validation should block an empty submit without hitting network
  await page.getByRole("button", { name: /send request/i }).click();
  await page.waitForTimeout(400);
  const msg = await page.locator('form:has(input[type="date"]) [role="status"]').first().innerText().catch(()=> "");
  log(/name|email|date/i.test(msg), `empty submit shows validation ("${msg.trim().slice(0,60)}")`);

  // Honeypot must exist and be off-screen
  const hp = page.locator('input#\\:\\:r0\\:\\:-website, input[id$="-website"]').first();
  log(await hp.count() > 0, "honeypot field present in DOM");

  // Date input min must be today or later (no past bookings)
  const min = await page.locator('input[type="date"]').getAttribute("min");
  log(!!min && min >= new Date().toISOString().slice(0,10), `date min guards the past (${min})`);
  log(errors.filter(e=>!/favicon|404/i.test(e)).length === 0, "no errors on booking page");
  await ctx.close();
}

// ---------- 5. Booking form actually POSTs to the endpoint ----------
console.log("\n[5] Booking form submits to /api/booking.php");
{
  const { ctx, page } = await newPage();
  let posted = null;
  await page.route("**/api/booking.php", async route => {
    posted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, id: 42 }) });
  });
  await page.goto(BASE + "/book/", { waitUntil: "networkidle" });
  await page.locator('input[id$="-name"]').first().fill("Ada Lovelace");
  await page.locator('input[type="email"]').first().fill("ada@example.com");
  await page.getByRole("button", { name: /send request/i }).click();
  await page.waitForTimeout(900);
  log(posted !== null, "POST fired");
  if (posted) {
    log(posted.name === "Ada Lovelace" && posted.email === "ada@example.com", "name + email in payload");
    log(!!posted.preferred_date && !!posted.preferred_window && !!posted.topic, "date/window/topic in payload");
    log(!!posted.timezone && posted.timezone !== "unknown", `timezone captured (${posted.timezone})`);
    log(posted.website === "", "honeypot sent empty");
  }
  log(await page.getByText(/request received/i).first().isVisible(), "success state shown");
  await ctx.close();
}

// ---------- 6. Newsletter form posts too ----------
console.log("\n[6] Footer newsletter posts to /api/newsletter.php");
{
  const { ctx, page } = await newPage();
  let posted = null;
  await page.route("**/api/newsletter.php", async route => {
    posted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator("#footer-email").fill("sub@example.com");
  await page.locator('button[aria-label="Subscribe"]').click();
  await page.waitForTimeout(900);
  log(posted !== null && posted.email === "sub@example.com", "newsletter POST with email");
  log(posted?.source === "footer", "source tagged 'footer'");
  await ctx.close();
}

// ---------- 7. No fake client names / dead social links ----------
console.log("\n[7] Credibility regressions");
{
  const { ctx, page } = await newPage();
  const fake = /WatchHouse|Kick Game|Duke \+ Dexter|Seymour-Williams|2,600% ROI|Want bE your|500\+/;
  for (const r of ["/", "/audits/", "/growth-retainers/", "/shopify-theme-builds/", "/careers/"]) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
    const body = await page.locator("body").innerText();
    log(!fake.test(body), `${r} free of fabricated claims`);
  }
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const deadFooter = await page.locator('footer a[href="#"]').count();
  log(deadFooter === 0, "no dead links in footer");
  await ctx.close();
}

console.log(fails === 0 ? "\n=== ALL RUNTIME CHECKS PASS ===\n" : `\n=== ${fails} FAILURE(S) ===\n`);
await browser.close();
process.exit(fails === 0 ? 0 : 1);
