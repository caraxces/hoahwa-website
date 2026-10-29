import { createPrivateKey, sign } from 'node:crypto';
import { readFile, mkdir, writeFile, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DOC = 'docs/analytics-api-setup.md';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'https://www.googleapis.com/auth/analytics.readonly',
];
const GA_METRICS = ['sessions', 'totalUsers', 'engagedSessions'];
const GSC_METRICS = ['clicks', 'impressions', 'ctr', 'position'];
const TARGET = 60;

class ReportError extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
  }
}

function setup(message, step) {
  return new ReportError(`${message} See [setup guide](${DOC}) (step ${step}).`, 2);
}

export function periodsFor(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (name) => parts.find((item) => item.type === name).value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  const shift = (days) => new Date(Date.parse(`${today}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
  return {
    reportDate: today,
    current: { startDate: shift(-7), endDate: shift(-1) },
    previous: { startDate: shift(-14), endDate: shift(-8) },
  };
}

export function wow(current, previous) {
  if (current === null || previous === null) return null;
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function targetProgress(current, previous) {
  const change = wow(current, previous);
  return {
    targetWowPercent: TARGET,
    wowPercent: change,
    growthTargetProgressPercent: change === null ? null : change / TARGET * 100,
    gapPercentagePoints: change === null ? null : TARGET - change,
    targetValue: previous > 0 ? previous * 1.6 : null,
    reached: previous > 0 ? current >= previous * 1.6 : null,
  };
}

export function compareRows(current, previous, metrics) {
  const currentMap = new Map(current.map((row) => [row.key, row]));
  const previousMap = new Map(previous.map((row) => [row.key, row]));
  return [...new Set([...currentMap.keys(), ...previousMap.keys()])].map((key) => {
    const values = Object.fromEntries(metrics.map((metric) => {
      const currentValue = currentMap.get(key)?.[metric] ?? null;
      const previousValue = previousMap.get(key)?.[metric] ?? null;
      return [metric, { current: currentValue, previous: previousValue, wowPercent: wow(currentValue, previousValue) }];
    }));
    return { key, ...values };
  });
}

function normalizeGsc(response, dimension) {
  return (response.rows ?? []).map((row) => ({
    key: dimension ? row.keys[0] : 'Total',
    ...Object.fromEntries(GSC_METRICS.map((metric) => [metric, Number(row[metric] ?? 0)])),
  }));
}

function normalizeGa(response, dimension) {
  return (response.rows ?? []).map((row) => ({
    key: dimension ? row.dimensionValues[0].value : 'Total',
    ...Object.fromEntries(GA_METRICS.map((metric, index) => [metric, Number(row.metricValues[index].value)])),
  }));
}

async function request(url, body, label, token) {
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: token ? JSON.stringify(body) : body.toString(),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new ReportError(`${label}: network request failed or timed out. Check connectivity and retry. See ${DOC} (step 7).`);
  }
  // Never echo remote response bodies, request payloads, keys, or tokens.
  if (!response.ok) {
    const status = response.status;
    if (label === 'OAuth') throw setup(`OAuth failed (HTTP ${status}). Check the service-account JSON key and system clock.`, 3);
    if (status === 401) throw setup(`${label}: authentication rejected (HTTP 401). Check the service-account key.`, 3);
    if (status === 403 || status === 404) {
      throw setup(`${label}: HTTP ${status}. Enable the API (step 2), verify the property identifier (step 6), and grant the service account property access.`, label === 'GSC' ? 4 : 5);
    }
    throw new ReportError(`${label}: HTTP ${status}. Retry later for quota/server errors; otherwise verify API setup in ${DOC} (steps 2–6).`);
  }
  try { return await response.json(); } catch {
    throw new ReportError(`${label}: invalid JSON response. Retry later.`);
  }
}

async function authenticate() {
  const missing = [];
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) missing.push(`Missing GOOGLE_APPLICATION_CREDENTIALS: create a JSON key (step 3) and export its path (step 6).`);
  if (!process.env.GA4_PROPERTY_ID?.trim()) missing.push(`Missing GA4_PROPERTY_ID: find the numeric GA4 property ID (step 5) and export it (step 6).`);
  if (missing.length) throw setup(missing.join('\n'), 6);
  const propertyId = process.env.GA4_PROPERTY_ID.trim();
  if (!/^\d+$/.test(propertyId)) throw setup('GA4_PROPERTY_ID must be the numeric property ID, not a G- measurement ID.', 5);
  const siteUrl = process.env.GSC_SITE_URL?.trim() || 'https://hoahwa.com/';
  if (!/^(https?:\/\/\S+|sc-domain:\S+)$/.test(siteUrl)) throw setup('GSC_SITE_URL must exactly match a Search Console URL-prefix or domain property.', 4);
  let credentials;
  try { credentials = JSON.parse(await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')); } catch {
    throw setup('GOOGLE_APPLICATION_CREDENTIALS does not point to a readable, valid JSON key. Store the key outside this repository and export its path.', 3);
  }
  if (credentials?.type !== 'service_account' || typeof credentials.client_email !== 'string' || typeof credentials.private_key !== 'string') {
    throw setup('The JSON key must be a service-account key with client_email and private_key.', 3);
  }
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: credentials.client_email, scope: SCOPES.join(' '), aud: TOKEN_URL, iat: now, exp: now + 3600,
  })}`;
  let signature;
  try {
    const key = createPrivateKey(credentials.private_key);
    if (key.asymmetricKeyType !== 'rsa') throw new Error('RSA required');
    signature = sign('RSA-SHA256', Buffer.from(unsigned), key).toString('base64url');
  } catch { throw setup('The service-account private key is invalid or is not an RSA key. Download a new JSON key.', 3); }
  const result = await request(TOKEN_URL, new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}`,
  }), 'OAuth');
  if (typeof result.access_token !== 'string' || !result.access_token) throw setup('OAuth did not return an access token. Check the service-account key.', 3);
  return { token: result.access_token, propertyId, siteUrl };
}

async function fetchPeriod(period, auth) {
  const gscUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(auth.siteUrl)}/searchAnalytics/query`;
  const gaUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${auth.propertyId}:runReport`;
  const gsc = async (dimension) => {
    const response = await request(gscUrl, {
      ...period, type: 'web', dataState: 'all', aggregationType: 'auto',
      dimensions: dimension ? [dimension] : [], rowLimit: dimension ? 20 : 1,
    }, 'GSC', auth.token);
    return { rows: normalizeGsc(response, dimension), metadata: response.metadata ?? null };
  };
  const ga = async (dimension, allRows = false) => {
    const rows = [];
    const metadata = [];
    let offset = 0;
    let rowCount;
    do {
      const response = await request(gaUrl, {
        dateRanges: [period], dimensions: dimension ? [{ name: dimension }] : [],
        metrics: GA_METRICS.map((name) => ({ name })),
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: allRows ? 10000 : dimension ? 20 : 1, offset,
      }, 'GA4', auth.token);
      const batch = normalizeGa(response, dimension);
      rows.push(...batch);
      metadata.push(response.metadata ?? null);
      rowCount = response.rowCount ?? rows.length;
      offset += batch.length;
      if (allRows && offset < rowCount && batch.length === 0) throw new ReportError('GA4 returned an incomplete channel page. Retry later.');
    } while (allRows && offset < rowCount);
    return { rows, rowCount, metadata };
  };
  const [totals, pages, queries, gaTotals, channels, landingPages] = await Promise.all([
    gsc(), gsc('page'), gsc('query'), ga(), ga('sessionDefaultChannelGroup', true), ga('landingPagePlusQueryString'),
  ]);
  const empty = (metrics) => ({ key: 'Total', ...Object.fromEntries(metrics.map((metric) => [metric, 0])) });
  return {
    gsc: { totals: totals.rows[0] ?? empty(GSC_METRICS), pages: pages.rows, queries: queries.rows,
      metadata: { totals: totals.metadata, pages: pages.metadata, queries: queries.metadata } },
    ga4: { totals: gaTotals.rows[0] ?? empty(GA_METRICS), channels: channels.rows, landingPages: landingPages.rows,
      metadata: { totals: gaTotals.metadata, channels: channels.metadata, landingPages: landingPages.metadata },
      landingPageRowCount: landingPages.rowCount },
  };
}

export function fixtureData() {
  const make = (clicks, impressions, sessions, users, engaged, organic, direct, position) => ({
    gsc: {
      totals: { key: 'Total', clicks, impressions, ctr: clicks / impressions, position },
      pages: [{ key: 'https://example.invalid/fixture', clicks, impressions, ctr: clicks / impressions, position }],
      queries: [{ key: 'synthetic fixture query', clicks, impressions, ctr: clicks / impressions, position }],
      metadata: null,
    },
    ga4: {
      totals: { key: 'Total', sessions, totalUsers: users, engagedSessions: engaged },
      channels: [
        { key: 'Organic Search', sessions: organic, totalUsers: Math.round(organic * 0.8), engagedSessions: organic / 2 },
        { key: 'Direct', sessions: direct, totalUsers: Math.round(direct * 0.8), engagedSessions: direct / 2 },
      ],
      landingPages: [{ key: '/synthetic-fixture', sessions, totalUsers: users, engagedSessions: engaged }],
      metadata: null,
    },
  });
  return {
    current: make(160, 1300, 240, 180, 120, 200, 40, 8),
    previous: make(100, 1000, 200, 150, 100, 100, 100, 10),
  };
}

export function buildReport(periods, data, dryRun, properties) {
  const comparisons = {};
  for (const source of ['gsc', 'ga4']) {
    const metrics = source === 'gsc' ? GSC_METRICS : GA_METRICS;
    const groups = source === 'gsc' ? ['pages', 'queries'] : ['channels', 'landingPages'];
    comparisons[source] = { totals: compareRows([data.current[source].totals], [data.previous[source].totals], metrics)[0] };
    for (const group of groups) comparisons[source][group] = compareRows(data.current[source][group], data.previous[source][group], metrics);
  }
  return {
    schemaVersion: 1, mode: dryRun ? 'synthetic-fixture' : 'live', generatedAt: new Date().toISOString(),
    periods, properties, data, comparisons,
    targets: {
      gscClicks: targetProgress(data.current.gsc.totals.clicks, data.previous.gsc.totals.clicks),
      ga4Sessions: targetProgress(data.current.ga4.totals.sessions, data.previous.ga4.totals.sessions),
    },
  };
}

function cell(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/[\r\n]/g, ' '); }
function number(value) { return value === null ? 'N/A' : Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 }); }
function percent(value) { return value === null ? 'N/A' : `${value >= 0 ? '+' : ''}${number(value)}%`; }
function metricValue(metric, value) { return value === null ? 'N/A' : metric === 'ctr' ? `${number(value * 100)}%` : number(value); }
function table(rows, metrics) {
  const headers = ['Item', ...metrics.flatMap((metric) => [`${metric} prev`, `${metric} current`, `${metric} WoW`])];
  return [
    `| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${[cell(row.key), ...metrics.flatMap((metric) => [
      metricValue(metric, row[metric].previous), metricValue(metric, row[metric].current), percent(row[metric].wowPercent),
    ])].join(' | ')} |`),
    ...(rows.length ? [] : [`| No rows returned | ${metrics.flatMap(() => ['—', '—', '—']).join(' | ')} |`]),
  ].join('\n');
}

export function markdown(report) {
  const { periods, comparisons, targets } = report;
  const lines = [
    `# Weekly SEO / traffic report — ${periods.reportDate}`,
    report.mode === 'synthetic-fixture' ? '**DRY RUN: synthetic built-in fixture data; not site statistics.**' : '**Live API data**',
    `Current: ${periods.current.startDate}–${periods.current.endDate}; previous: ${periods.previous.startDate}–${periods.previous.endDate} (inclusive).`,
    'Dates use the last seven completed calendar dates in America/Los_Angeles. GSC uses Pacific time; GA4 interprets these same dates in its property timezone.',
    'Recent GSC data (dataState=all) and GA4 data may be incomplete or revised. GSC top lists omit anonymized queries and are not exhaustive; totals are queried independently. GA4 users are queried independently and must not be summed across channels.',
    'WoW = (current − previous) / previous × 100. N/A means a zero baseline with nonzero current, or a row absent from one returned list (not assumed zero). Zero → zero is 0%. Lower average position is better; CTR WoW is relative change.',
    '## +60% WoW growth target',
    [
      '| Metric | WoW | Growth target progress | Gap to +60% (percentage points) | Target value | Status |',
      '| --- | --- | --- | --- | --- | --- |',
      ...Object.entries(targets).map(([name, target]) => `| ${name === 'gscClicks' ? 'GSC clicks' : 'GA4 sessions'} | ${percent(target.wowPercent)} | ${target.growthTargetProgressPercent === null ? 'N/A' : `${number(target.growthTargetProgressPercent)}%`} | ${number(target.gapPercentagePoints)} | ${number(target.targetValue)} | ${target.reached === null ? 'No baseline' : target.reached ? 'Reached' : 'Below target'} |`),
    ].join('\n'),
    'Growth target progress = WoW growth / 60% × 100, uncapped; negative means decline. A negative gap means the target was exceeded. Targets apply to clicks and sessions only.',
    '## GSC totals', table([comparisons.gsc.totals], GSC_METRICS),
    '## GSC top pages — top 20 per period, ranked by clicks', table(comparisons.gsc.pages, GSC_METRICS),
    '## GSC top queries — top 20 per period, ranked by clicks', table(comparisons.gsc.queries, GSC_METRICS),
    'The page/query tables show the union of each period’s top 20, so each may contain up to 40 rows.',
    '## GA4 totals', table([comparisons.ga4.totals], GA_METRICS),
    '## GA4 by sessionDefaultChannelGroup', table(comparisons.ga4.channels, GA_METRICS),
    '## GA4 top landing pages — top 20 per period, ranked by sessions', table(comparisons.ga4.landingPages, GA_METRICS),
    'Landing pages use landingPagePlusQueryString; the table is the union of both top-20 lists. API metadata (including thresholding/sampling information when supplied) is preserved in the JSON.',
  ];
  return `${lines.join('\n\n')}\n`;
}

export async function main(args = process.argv.slice(2)) {
  if (args.some((arg) => arg !== '--dry-run')) throw new ReportError('Usage: node scripts/weekly-report.mjs [--dry-run]', 2);
  const dryRun = args.includes('--dry-run');
  const periods = periodsFor();
  let data;
  let properties;
  if (dryRun) {
    data = fixtureData();
    properties = { gscSiteUrl: 'synthetic fixture', ga4PropertyId: 'synthetic fixture' };
  } else {
    const auth = await authenticate();
    const [current, previous] = await Promise.all([fetchPeriod(periods.current, auth), fetchPeriod(periods.previous, auth)]);
    data = { current, previous };
    properties = { gscSiteUrl: auth.siteUrl, ga4PropertyId: auth.propertyId };
  }
  const report = buildReport(periods, data, dryRun, properties);
  // Keep synthetic runs separate so they cannot overwrite the same day's real report.
  const relative = join('reports', 'weekly', ...(dryRun ? ['dry-run'] : []), `${periods.reportDate}.json`);
  const output = join(ROOT, relative);
  const temporary = `${output}.${process.pid}.tmp`;
  try {
    await mkdir(dirname(output), { recursive: true, mode: 0o700 });
    await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
    await rename(temporary, output);
  } catch { throw new ReportError('Could not write the weekly JSON report. Check write access to reports/weekly/.'); }
  process.stdout.write(markdown(report));
  process.stdout.write(`\nJSON written to ${relative}\n`);
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof ReportError ? error.message : `Weekly report failed. Check API configuration and retry; see ${DOC}.`);
    process.exitCode = error instanceof ReportError ? error.exitCode : 1;
  });
}
