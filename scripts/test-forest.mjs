import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import sharp from 'sharp';
import jsQR from 'jsqr';

const ART = 'output/playwright/forest', MODEL = path.resolve(ART, 'model');
await mkdir(MODEL, { recursive: true });
for (const name of ['qr-tree', 'qr-tree-morph', 'qr-forest']) {
  let code = ts.transpileModule(await readFile('src/lib/' + name + '.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  for (const dependency of ['qr-tree', 'qr-tree-morph']) code = code.replaceAll('"./' + dependency + '"', '"./' + dependency + '.mjs"');
  await writeFile(path.join(MODEL, name + '.mjs'), code);
}
const { forestHeight, forestPlots, forestTreeModel } = await import(pathToFileURL(path.join(MODEL, 'qr-forest.mjs')));
const levels = [0, 5, 25, 100, 500, 2000, 20000, 2000000];
levels.slice(1).forEach((hits, i) => assert.ok(forestHeight(hits) > forestHeight(levels[i])));
assert.equal(forestHeight(-1), forestHeight(0));
assert.equal(forestHeight(NaN), forestHeight(0));
assert.notDeepEqual(forestTreeModel('https://hoahwa.com/tree01').cells, forestTreeModel('https://hoahwa.com/tree02').cells);
console.log('PASS: QR-derived unique models and continuous growth beyond 2,000 visits');
const stage = hits => ({ id: hits >= 2000 ? 'ancient' : hits >= 500 ? 'mature' : hits >= 100 ? 'young' : hits >= 25 ? 'sapling' : hits >= 5 ? 'sprout' : 'seed', label: hits >= 2000 ? 'Ancient tree' : hits >= 500 ? 'Mature tree' : hits >= 100 ? 'Young tree' : hits >= 25 ? 'Sapling' : hits >= 5 ? 'Sprout' : 'Seed', index: 0, min: 0, next: null, nextLabel: null });
const fixture = i => {
  const hits = levels[i % 7], code = 'tree' + String(i).padStart(2, '0');
  return { code, shortUrl: 'https://hoahwa.com/' + code, targetHost: 'example.com', title: ['Sakura notes', 'Forest sounds', 'Little bookshop', 'Spring studio', 'Weekend garden', 'Quiet travels'][i % 6] + ' ' + (i + 1), category: ['brand', 'shop', 'music'][i % 3], season: ['spring', 'summer', 'autumn'][i % 3], palette: ['gold', 'lavender', 'coral', 'sky', 'snow'][i % 5], hits, stage: stage(hits), createdAt: '2026-09-01T00:00:00Z', lastHitAt: null };
};
let records = Array.from({ length: 18 }, (_, i) => fixture(i)), fail = false;
assert.deepEqual(forestPlots(records), forestPlots([...records].reverse()));
let server;
const URL = process.env.TREE_TEST_URL || 'http://127.0.0.1:3020';
if (!process.env.TREE_TEST_URL) {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
  server = http.createServer(async (req, res) => {
    let file = path.join(path.resolve('out'), decodeURIComponent(new globalThis.URL(req.url, URL).pathname));
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(await readFile(file)); }
    catch { res.statusCode = 404; res.end('not found'); }
  });
  await new Promise(resolve => server.listen(3020, '127.0.0.1', resolve));
}
const routeApi = async route => {
  const params = new globalThis.URL(route.request().url()).searchParams;
  const totals = { links: records.length, hits: records.reduce((s, r) => s + r.hits, 0) };
  if (params.has('categories')) return route.fulfill({ json: { ok: true, categories: ['brand', 'shop', 'music'].map(category => ({ category, links: records.filter(r => r.category === category).length, hits: 0 })) } });
  if (fail) return route.fulfill({ status: 503, json: { ok: false, error: 'Temporary outage' } });
  let trees = records.filter(r => !params.get('category') || r.category === params.get('category'));
  trees = params.get('sort') === 'new' ? [...trees].reverse() : [...trees].sort((a, b) => b.hits - a.hits);
  return route.fulfill({ json: { ok: true, trees, totals, category: params.get('category') } });
};
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--use-angle=metal'] });
const errors = [];
const prepare = async page => {
  page.setDefaultTimeout(30000); page.setDefaultNavigationTimeout(90000);
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/api/short-links.php**', routeApi);
  await page.addInitScript(() => localStorage.setItem('hoahwa-cookie-consent', JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), choices: { necessary: true, functional: false, analytics: false, marketing: false, doNotSell: false } })));
  if (process.env.TREE_TEST_URL) await page.addInitScript(() => document.addEventListener('DOMContentLoaded', () => { const style = document.createElement('style'); style.textContent = 'nextjs-portal{display:none!important}'; document.head.append(style); }));
  await page.goto(URL + '/tree/market/', { waitUntil: 'domcontentloaded' });
};
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const ready = p => p.waitForSelector('[data-testid="forest-canvas"][data-ready="true"]');
const models = () => page.getByTestId('forest-canvas').evaluate(el => JSON.parse(el.dataset.models));
const decode = async p => {
  await p.locator('[data-testid="market-qr"] canvas').waitFor();
  const { data, info } = await sharp(await p.getByTestId('market-qr').screenshot()).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
};
let checks = 0;
const verify = (value, message) => { assert.ok(value, message); console.log('PASS: ' + message); checks++; };
try {
  await prepare(page); await ready(page);
  const initial = await models();
  verify(initial.length === 18 && initial.every(m => m.payload === 'https://hoahwa.com/' + m.code && m.cells > 1000), 'Every visible tree uses its own real QR model');
  await page.getByTestId('forest-choose').selectOption('tree00');
  verify(await decode(page) === 'https://hoahwa.com/tree00', 'The selected tree has a readable QR for its exact short link');
  await page.getByTestId('forest-canvas').evaluate(el => { window.__forestCanvas = el.querySelector('canvas'); });
  const before = initial.find(m => m.code === 'tree00');
  records[0] = { ...records[0], hits: 5000, stage: stage(5000) };
  await page.waitForFunction(() => document.querySelector('[data-testid="forest-visits"]')?.textContent === '5,000');
  await page.waitForSelector('[data-testid="forest-canvas"][data-growing="false"]');
  const after = (await models()).find(m => m.code === 'tree00');
  verify(after.height > before.height * 2 && after.width > before.width * 2, 'Live visits make the existing tree taller and its canopy wider');
  verify(before.x === after.x && before.z === after.z && await page.getByTestId('forest-canvas').evaluate(el => el.querySelector('canvas') === window.__forestCanvas), 'Growth preserves the plot, selection and WebGL renderer');
  const renderCount = await page.getByTestId('forest-canvas').getAttribute('data-render-count');
  await page.waitForTimeout(450);
  verify(await page.getByTestId('forest-canvas').getAttribute('data-render-count') === renderCount, 'The forest stops rendering when idle');
  verify(Number(await page.getByTestId('forest-canvas').getAttribute('data-draw-calls')) <= 8, 'The forest fits its eight-draw-call budget');
  await page.screenshot({ path: ART + '/forest-18-desktop.png' });
  fail = true;
  await page.getByRole('status').filter({ hasText: 'Reconnecting' }).waitFor();
  verify((await models()).length === 18 && await page.getByTestId('forest-choose').inputValue() === 'tree00', 'A temporary API error preserves the forest and selected tree');
  fail = false;
  await page.getByTestId('category-chips').getByRole('button', { name: /^Shop/ }).click(); await ready(page);
  verify((await models()).length === 6, 'Category filtering shows only that category’s trees');
  await page.getByTestId('category-chips').getByRole('button', { name: /^Event/ }).click(); await page.getByTestId('market-empty').waitFor();
  verify(await page.getByTestId('tree-info').count() === 0, 'An empty category does not keep a stale tree card');
  await page.getByTestId('category-chips').getByRole('button', { name: /^All/ }).click(); await ready(page);
  records = Array.from({ length: 60 }, (_, i) => fixture(i));
  await page.waitForFunction(() => document.querySelector('[data-testid="forest-canvas"]')?.dataset.trees === '60'); await ready(page);
  verify((await models()).length === 60 && Number(await page.getByTestId('forest-canvas').getAttribute('data-draw-calls')) <= 8, 'A full 60-tree forest uses the same rendering budget');
  await page.screenshot({ path: ART + '/forest-60-desktop.png' });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await prepare(mobile); await ready(mobile);
  verify(Number(await mobile.getByTestId('forest-canvas').getAttribute('data-pixel-ratio')) <= 1.5, 'A 60-tree touch forest respects the mobile DPR cap');
  const stageBox = await mobile.locator('.forest-view').boundingBox(), panelBox = await mobile.locator('.forest-panel').boundingBox();
  verify(stageBox.y + stageBox.height <= panelBox.y && await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile places the QR card below an unobstructed forest without horizontal overflow');
  await mobile.screenshot({ path: ART + '/forest-mobile.png', fullPage: true });
  verify(await decode(mobile) === await mobile.getByTestId('market-qr').getAttribute('data-payload'), 'The selected QR remains scannable on mobile');
  await mobile.close();
  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return type.startsWith('webgl') ? null : original.call(this, type, ...args); }; });
  await prepare(fallback); await fallback.getByTestId('forest-fallback').waitFor();
  verify(await fallback.locator('[data-testid="forest-fallback"] li').count() === 60 && Boolean(await decode(fallback)), 'The no-WebGL forest keeps all real trees and a working QR');
  await fallback.close();
  verify(errors.length === 0, 'No runtime errors across the forest, growth, filtering, mobile and fallback');
  console.log('PASS: ' + checks + ' forest browser checks');
} catch (error) { await page.screenshot({ path: ART + '/failure.png', fullPage: true }).catch(() => {}); console.error(errors); throw error; }
finally { await browser.close(); server?.close(); }
