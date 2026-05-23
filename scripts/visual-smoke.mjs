#!/usr/bin/env node
/**
 * control-ui visual smoke — screenshots for MVP routes
 * Usage: node scripts/visual-smoke.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://127.0.0.1:3010";
const OUT = "/tmp";
const routes = ["/", "/audits", "/contact"];
const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

async function shot(page, route, viewport) {
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
  const file = path.join(OUT, `hoahwa-wiro-${slug}-${viewport.name}.png`);
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  if (route === "/") {
    const toggle = page.getByTestId("menu-toggle");
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.getByTestId("mega-menu").waitFor({ state: "visible" });
      await page.screenshot({
        path: path.join(OUT, `hoahwa-wiro-mega-menu-${viewport.name}.png`),
        fullPage: true,
      });
      const audit = page.getByTestId("mega-panel-audit");
      if (await audit.isVisible()) {
        await audit.click();
        await page.getByTestId("mega-menu-back").waitFor({ state: "visible" });
        await page.screenshot({
          path: path.join(OUT, `hoahwa-wiro-mega-audit-${viewport.name}.png`),
          fullPage: true,
        });
      }
      await page.getByRole("button", { name: "Close" }).click();
    }
  }
  await page.screenshot({ path: file, fullPage: true });
  console.log("wrote", file);
  return file;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const files = [];
  for (const viewport of viewports) {
    const page = await browser.newPage();
    for (const route of routes) {
      files.push(await shot(page, route, viewport));
    }
    await page.close();
  }
  await browser.close();
  console.log(JSON.stringify({ ok: true, files }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
