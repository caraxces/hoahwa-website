// HoaHwa Links / Tree QR front-end checks against the static export (out/), with the PHP API
// mocked through Playwright route interception. Run `npm run build` first.
// Gesture recordings require `npx playwright install ffmpeg`; set CHROME_PATH for other Chrome locations.
//   node scripts/test-tree.mjs            (serves out/ on 127.0.0.1:3015)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { checkTreeInputs } from './tree-input-checks.mjs';

const PORT = 3015, ROOT = path.resolve('out');
const BASE_URL = process.env.TREE_TEST_URL || `http://127.0.0.1:${PORT}`;
const ART = 'output/playwright/tree';
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x'); let file = path.join(ROOT, decodeURIComponent(url.pathname));
  try { const s = await stat(file); if (s.isDirectory()) file = path.join(file, 'index.html'); } catch { file = path.join(ROOT, '404.html'); res.statusCode = 404; }
  try { res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream'); res.end(await readFile(file)); } catch { res.statusCode = 404; res.end('not found'); }
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
await mkdir(ART, { recursive: true });

// In-memory stand-in for short-links.php with the same JSON contract.
const stages = [['seed', 'Seed', 0], ['sprout', 'Sprout', 5], ['sapling', 'Sapling', 25], ['young', 'Young tree', 100], ['mature', 'Mature tree', 500], ['ancient', 'Ancient tree', 2000]];
const stageFor = h => { let i = 0; stages.forEach((s, k) => { if (h >= s[2]) i = k; }); const n = stages[i + 1]; return { id: stages[i][0], label: stages[i][1], index: i, min: stages[i][2], next: n ? n[2] : null, nextLabel: n ? n[1] : null }; };
const links = new Map(); let seq = 0;
const record = (l, stats = false) => ({ code: l.code, shortUrl: `https://hoahwa.com/${l.code}`, targetHost: new URL(l.url).host, title: l.title || null, category: l.category, season: l.season, palette: l.palette, hits: l.hits, stage: stageFor(l.hits), createdAt: new Date().toISOString(), lastHitAt: null, ...(stats ? { daily: Array.from({ length: 14 }, (_, i) => ({ day: `2026-09-${String(i + 1).padStart(2, '0')}`, count: i === 13 ? l.hits : 0 })), referrers: l.hits ? [{ host: 'facebook.com', count: l.hits }] : [], devices: { mobile: Math.floor(l.hits / 2), desktop: l.hits - Math.floor(l.hits / 2), bot: 1 } } : {}) });
const seed = (code, url, category, hits, title) => links.set(code, { code, url, category, hits, title, season: 'spring', palette: 'gold' });
seed('brand1', 'https://vitabiotics.vn/', 'brand', 640, 'Vitabiotics Vietnam'); seed('shop22', 'https://tienziven.com/', 'shop', 12, 'Tienziven shop'); seed('music3', 'https://open.spotify.com/x', 'music', 0, null);
const api = async route => {
  const req = route.request(); const url = new URL(req.url()); const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204 });
  if (req.method() === 'POST') {
    const body = Object.fromEntries(new URLSearchParams(req.postData() || '')); if (!/^https?:\/\//.test(body.url || '')) return json({ ok: false, error: 'Enter a valid http(s) URL.' }, 400);
    if (body.alias === 'audits') return json({ ok: false, error: 'That word is reserved for a HoaHwa page.' }, 409);
    const code = body.alias || `c${String(++seq).padStart(5, 'x')}`; seed(code, body.url, body.category || 'general', 0, body.title || null); links.get(code).season = body.season; links.get(code).palette = body.palette;
    return json({ ok: true, ...record(links.get(code), true) }, 201);
  }
  if (url.searchParams.has('categories')) return json({ ok: true, categories: ['general', 'brand', 'shop', 'event', 'music', 'food', 'travel', 'education', 'creator', 'personal'].map(c => ({ category: c, links: [...links.values()].filter(l => l.category === c).length, hits: [...links.values()].filter(l => l.category === c).reduce((s, l) => s + l.hits, 0) })) });
  if (url.searchParams.has('market')) { const cat = url.searchParams.get('category'); const sort = url.searchParams.get('sort'); let list = [...links.values()].filter(l => !cat || l.category === cat); list = sort === 'new' ? list.reverse() : list.sort((a, b) => b.hits - a.hits); return json({ ok: true, trees: list.map(l => record(l)), category: cat || null, totals: { links: links.size, hits: [...links.values()].reduce((s, l) => s + l.hits, 0) } }); }
  const l = links.get(url.searchParams.get('code')); return l ? json({ ok: true, ...record(l, true) }) : json({ ok: false, error: 'Short link not found.' }, 404);
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }); page.setDefaultTimeout(30000);
page.setDefaultNavigationTimeout(90000); // Allow a cold Next.js development compile.
await page.addInitScript(() => localStorage.setItem('hoahwa-cookie-consent', JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), choices: { necessary: true, functional: false, analytics: false, marketing: false, doNotSell: false } })));
if (process.env.TREE_TEST_URL) await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const style = document.createElement('style'); style.textContent = 'nextjs-portal { display:none !important; }'; document.head.append(style); }));
await page.route('**/api/short-links.php**', api);
const checks = [], errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errors.push(m.text()); });
const verify = (ok, msg) => { assert.ok(ok, msg); checks.push(msg); console.log('✓ ' + msg); };
const decodeScreenshot = async (buffer) => {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
};
const waitScan = () => page.waitForSelector('[data-testid="grove-canvas"][data-scan-ready="true"]');
const waitTree = () => page.waitForSelector('[data-testid="grove-canvas"][data-phase="tree"]');
try {
  await page.goto(`${BASE_URL}/tree/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="plant-form"]'); await page.waitForSelector('canvas');
  verify(await page.locator('canvas').count() >= 1 && (await page.locator('[data-testid="market-link"]').textContent()).includes('Tree market'), 'The /tree page renders the WebGL grove, the plant form and a link to the market');
  await waitScan();
  verify(await decodeScreenshot(await page.screenshot()) === 'https://hoahwa.com', 'The initial state is a real QR, ready to hatch');
  await page.click('[data-testid="link-options"]');
  await page.fill('[data-testid="url-input"]', 'hoahwa.com/apps/bloombound'); await page.fill('[data-testid="title-input"]', 'BloomBound game'); await page.selectOption('[data-testid="category-select"]', 'creator'); await page.click('[data-testid="plant-button"]');
  await page.waitForSelector('[data-testid="short-url"]');
  const short = await page.locator('[data-testid="short-url"]').textContent();
  await page.waitForURL(url => url.searchParams.get('c') === short.split('/')[1]);
  await waitScan();
  const cellCount = await page.locator('[data-testid="grove-canvas"]').getAttribute('data-cells');
  await page.click('[data-testid="morph-toggle"]');
  await page.waitForFunction(() => { const d = document.querySelector('[data-testid="grove-canvas"]')?.dataset; return d?.phase === 'morphing' && Number(d.displaced) > 0; });
  await page.waitForFunction(() => { const p = Number(document.querySelector('[data-testid="grove-canvas"]')?.dataset.progress); return p > 0.4 && p < 0.8; });
  await page.screenshot({path:`${ART}/assembling.png`});
  await waitTree();
  verify(await page.locator('[data-testid="grove-canvas"]').getAttribute('data-cells') === cellCount && Number(await page.locator('[data-testid="grove-canvas"]').getAttribute('data-displaced')) > 100, 'The original QR cubes physically travel into the tree without changing their count');
  verify(/^hoahwa\.com\/c[0-9x]{5}$/.test(short) && new URL(page.url()).searchParams.get('c') === short.split('/')[1], `Planting returns a root-level link (${short}) and the URL carries ?c=<code>`);
  verify((await page.locator('[data-testid="link-stage"]').textContent()).includes('Seed') && (await page.locator('[data-testid="link-hits"]').textContent()) === '0' && (await page.getAttribute('.tree-app', 'data-stage')) === 'seed', 'A fresh link starts as a Seed with 0 clicks');
  // Clicks arrive: the poll picks them up and the tree grows.
  const code = short.split('/')[1]; links.get(code).hits = 130;
  await page.waitForFunction(() => document.querySelector('[data-testid="link-hits"]')?.textContent === '130', null, { timeout: 20000 });
  verify((await page.locator('[data-testid="link-stage"]').textContent()).includes('Young tree') && (await page.getAttribute('.tree-app', 'data-stage')) === 'young' && (await page.locator('[data-testid="link-stats"]').textContent()).includes('facebook.com'), 'After 130 clicks the panel shows Young tree, the 14-day bars and the referrer, and the grove re-grows');
  await page.screenshot({ path: `${ART}/tree-young.png` });
  await waitTree();
  const renders = await page.locator('[data-testid="grove-canvas"]').getAttribute('data-render-count');
  await page.waitForTimeout(450);
  verify(await page.locator('[data-testid="grove-canvas"]').getAttribute('data-render-count') === renders, 'The renderer stops when the tree is idle');
  verify(Number(await page.locator('[data-testid="grove-canvas"]').getAttribute('data-draw-calls')) <= 3, 'The scene stays within its three-draw-call budget');
  // Scan view flattens the meadow into a readable code.
  await page.click('[data-testid="scan-toggle"]'); await waitScan();
  verify(await page.locator('[data-testid="grove-canvas"]').getAttribute('data-displaced') === '0', 'Every cube returns exactly to its source QR cell');
  verify(await page.locator('[data-testid="scan-toggle"]').getAttribute('aria-pressed') === 'true', 'Folding flattens the meadow and offers the way back to the grove');
  await page.locator('[data-testid="grove-canvas"]').screenshot({ path: `${ART}/scan.png` });
  const decoded = await decodeScreenshot(await page.locator('[data-testid="grove-canvas"]').screenshot());
  verify(decoded === short.replace(/^/, 'https://'), `Rendered botanical QR decodes to ${decoded ?? 'nothing'}`);
  const expected = `https://${short}`;
  for (const season of ['Spring', 'Summer', 'Autumn']) {
    for (const palette of ['Gold', 'Lavender', 'Coral', 'Sky', 'Snow']) {
      await page.getByRole('button', { name: season, exact: true }).click();
      await page.getByRole('button', { name: palette, exact: true }).click();
      await page.waitForSelector(`[data-art-look="${season.toLowerCase()}:${palette.toLowerCase()}"]`);
      await page.waitForTimeout(180); await waitScan();
      const screenshot = await page.screenshot({ path: `${ART}/scan-${season.toLowerCase()}-${palette.toLowerCase()}.png` });
      verify(await decodeScreenshot(screenshot) === expected, `Full screen ${season}/${palette} QR decodes correctly, including UI overlays`);
    }
  }
  await page.getByRole('button', { name: 'Spring', exact: true }).click();
  await page.getByRole('button', { name: 'Gold', exact: true }).click();
  await page.waitForTimeout(200); await waitScan();
  const downloadEvent = page.waitForEvent('download');
  await page.click('[data-testid="qr-button"]');
  const download = await downloadEvent;
  const downloadPath = `${ART}/sakura-qr-download.png`;
  await download.saveAs(downloadPath);
  verify(await decodeScreenshot(await readFile(downloadPath)) === expected, 'Downloaded botanical PNG preserves the exact short link');
  for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 740 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport); await waitScan();
    await page.waitForTimeout(150);
    const screenshot = await page.screenshot({ path: `${ART}/scan-${viewport.width}.png` });
    verify(await decodeScreenshot(screenshot) === expected, `QR fits and decodes at ${viewport.width}×${viewport.height}`);
    await page.click('[data-testid="morph-toggle"]'); await waitTree();
    await page.screenshot({path:`${ART}/tree-${viewport.width}.png`});
    const stage = await page.locator('.tree-stage-frame').boundingBox(), toggle = await page.locator('[data-testid="morph-toggle"]').boundingBox();
    verify(stage.y + stage.height <= toggle.y + 1 && stage.width <= viewport.width, `The 3D tree has its own unobstructed stage at ${viewport.width}px`);
    await page.click('[data-testid="morph-toggle"]'); await waitScan();
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.click('[data-testid="scan-toggle"]'); await waitTree();
  const canvasBox = await page.locator('[data-testid="grove-canvas"]').boundingBox();
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
  await page.mouse.down(); await page.mouse.move(canvasBox.x + canvasBox.width / 2 + 200, canvasBox.y + canvasBox.height / 2, { steps: 8 }); await page.mouse.up();
  await page.mouse.wheel(0, -700);
  await page.click('[data-testid="scan-toggle"]'); await waitScan();
  verify(await decodeScreenshot(await page.screenshot()) === expected, 'Scanning resets framing and orientation after rotating and zooming the grove');
  await page.click('[data-testid="morph-toggle"]'); await page.waitForTimeout(350);
  await page.click('[data-testid="morph-toggle"]'); await waitScan();
  verify(await decodeScreenshot(await page.screenshot()) === expected, 'Reversing midway through assembly returns a scannable QR');
  await page.click('[data-testid="scan-toggle"]'); await waitTree();
  // Custom alias + reserved word.
  await page.fill('[data-testid="url-input"]', 'https://tarotto.io/'); await page.fill('[data-testid="alias-input"]', 'audits'); await page.click('[data-testid="plant-button"]'); await page.waitForSelector('[data-testid="plant-error"]');
  verify((await page.locator('[data-testid="plant-error"]').textContent()).includes('reserved'), 'A custom alias that matches a site page is refused');
  await page.fill('[data-testid="alias-input"]', 'tarot2026'); await page.click('[data-testid="plant-button"]'); await page.waitForFunction(() => document.querySelector('[data-testid="short-url"]')?.textContent === 'hoahwa.com/tarot2026');
  verify(true, 'A free custom alias becomes hoahwa.com/tarot2026');
  // Shared link by code.
  await page.goto(`${BASE_URL}/tree/?c=brand1`, { waitUntil: 'domcontentloaded' }); await waitScan(); await page.click('[data-testid="morph-toggle"]'); await waitTree(); await page.waitForSelector('[data-testid="link-stats"]');
  verify((await page.locator('[data-testid="link-hits"]').textContent()) === '640' && (await page.locator('[data-testid="link-stage"]').textContent()).includes('Mature') && (await page.locator('[data-testid="url-input"]').inputValue()) === 'https://hoahwa.com/brand1', 'Opening /tree/?c=brand1 loads that link: 640 clicks, Mature tree');
  // Market: one island, one tree per link.
  await page.screenshot({ path: `${ART}/grove-mature.png` });
  await page.goto(`${BASE_URL}/tree/market/`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-testid="forest-canvas"] canvas');
  await page.waitForFunction(() => document.querySelector('[data-testid="forest-canvas"]')?.dataset.trees === '5');
  verify((await page.locator('[data-testid="market-totals"]').textContent()).includes('5 trees'), 'The market grows all five links as one forest island with the totals in the header');
  verify((await page.locator('[data-testid="tree-info"]').textContent()).includes('Vitabiotics') && (await page.locator('[data-testid="tree-info"]').textContent()).includes('640'), 'The card opens on the most-clicked tree of the grove');
  const index = await page.locator('[data-testid="forest-index"] li').allTextContents();
  verify(index.length === 5 && index[0].includes('Mature tree'), 'A screen-reader list mirrors the grove for assistive tech and crawlers');
  await page.screenshot({ path: `${ART}/market.png` });
  await page.click('[data-testid="category-chips"] button:has-text("Shop")'); await page.waitForFunction(() => document.querySelector('[data-testid="forest-canvas"]')?.dataset.trees === '1');
  verify((await page.locator('[data-testid="tree-info"]').textContent()).includes('Tienziven'), 'Choosing a category replants the island with just that category');
  await page.click('[data-testid="category-chips"] button:has-text("Event")'); await page.waitForSelector('[data-testid="market-empty"]');
  verify(true, 'An empty category shows the plant-the-first-one message');
  await page.click('[data-testid="category-chips"] button:has-text("All")'); await page.waitForFunction(() => document.querySelector('[data-testid="forest-canvas"]')?.dataset.trees === '5');
  await page.locator('[data-testid="tree-info"] a').click(); await waitScan(); await page.click('[data-testid="morph-toggle"]'); await waitTree(); await page.waitForSelector('[data-testid="link-stats"]');
  verify(page.url().includes('/tree/?c=brand1'), 'Opening the focused tree from the grove loads its page');
  // QR remains available when a browser cannot create a WebGL context.
  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  fallback.setDefaultNavigationTimeout(90000);
  await fallback.route('**/api/short-links.php**', api);
  await fallback.addInitScript(() => {
    localStorage.setItem('hoahwa-cookie-consent', JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), choices: { necessary: true, functional: false, analytics: false, marketing: false, doNotSell: false } }));
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : getContext.call(this, type, ...args); };
  });
  await fallback.goto(`${BASE_URL}/tree/?c=brand1`, { waitUntil: 'domcontentloaded' });
  await fallback.waitForSelector('.tree-qr-fallback canvas');
  await fallback.waitForFunction(() => document.querySelector('.tree-qr-fallback canvas')?.width > 300);
  verify(await decodeScreenshot(await fallback.screenshot({ path: `${ART}/fallback-mobile.png` })) === 'https://hoahwa.com/brand1', 'The no-WebGL fallback preserves the botanical QR on mobile');
  await fallback.close();
  await checkTreeInputs(browser, BASE_URL, ART, verify, decodeScreenshot);
  verify(errors.length === 0, `No console or runtime errors (${errors.length} observed)`);
  console.log(`PASS: ${checks.length} Tree QR checks`);
} catch (e) { await page.screenshot({ path: `${ART}/failure.png` }).catch(() => {}); console.error(errors); throw e; } finally { await browser.close(); server.close(); }
