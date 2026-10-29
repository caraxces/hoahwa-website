# hoahwa.com — November 2026 growth roadmap (internal)

> Drafted 2026-10-28 by the agent train (Kimi K3 research), edited by Claude. Internal planning doc — not deployed.
>
> **Corrections applied after drafting (read these first):**
> 1. Public name is **Notch Agent Train**, never "AgentPet": an unrelated open-source project (github.com/ntd4996/agentpet) already owns that name. Show HN / Product Hunt / Reddit titles must use "Notch Agent Train".
> 2. The case study (`/case-studies/notch-agent-train/`) and `/build-log` were built on 2026-10-28, so W1 "ship" items for them are done; W1 is deploy + request indexing.
> 3. All 16 thin insight posts were rewritten in one pass on 2026-10-28 (not 4 per week). The W2–W4 "rewrite" slots become: monitor which rewrites get indexed, and patch titles/intros using GSC query data.
> 4. A Show HN / Product Hunt launch needs something people can install. The notch app currently lives on one Mac with no public repo. Deciding whether to open-source it (and under what license) is the owner's call and the main dependency of the referral plan.
> 5. Weekly numbers come from `npm run report:weekly` once the Google Cloud service account exists (`docs/analytics-api-setup.md`).


## 0. Verified starting state

Checked against the repo (`src/content/insight-articles.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/cookie/ConsentScripts.tsx`) and the live `https://hoahwa.com/sitemap.xml`:

- **45 indexable URLs** in the live sitemap: 25 static routes + 20 insight posts.
- **20 insight posts; 16 are thin stubs** (rewrite already in progress). Existing coverage clusters on Shopify speed/CRO (Apr–May 2026) and AEO/GEO/agentic commerce (Jun 2026), plus one Vietnamese-language Vietfolk post.
- **6 case studies** live, including `tarotto-programmatic-seo`, which already documents a verifiable GA4/GSC snapshot (May 2026: 248 users/30d, +359% period-over-period, 4.05K indexed pages) — this is the precedent for honest-numbers case studies.
- **Notch Agent Train does not exist anywhere in the repo** — no case study, no `/build-log` route, no content. Both are net-new pages to be built (the roadmap assumes they ship in W1; building them is a separate brief).
- **GA4 `G-XW4CF8R5QJ` loads only after cookie-consent opt-in** (`ConsentScripts.tsx` — default denied). GA4 will undercount sessions; the consent opt-in rate is itself a number to record in W0.
- **GSC is a URL-prefix property** for `https://hoahwa.com/` — it will not see `www.` or `http://` variants. Fine for reporting, but it means "all Google traffic" = "apex-domain Google traffic" in every report.
- `/editions/winter2026/` stays noindex and out of the sitemap by decision; exclude it from all KPIs.

## 1. Feasibility note: what +60%/week actually means

1.6⁴ ≈ **6.55× in 4 weeks**. Be honest about the arithmetic:

- **Organic search cannot deliver this in November.** New and rewritten content on a low-authority domain takes 2–8 weeks to earn meaningful impressions. Realistic organic trajectory for the month: +10–25% week-over-week on GSC clicks *if* the 16 rewrites ship and get indexed promptly. SEO work in November is the December/January payoff, not the November number.
- **Referral can deliver the 6.5× — from a small base, via launch spikes.** The Notch Agent Train build-in-public launch (Show HN, Product Hunt, r/macapps, r/ClaudeAI, X/LinkedIn, dev.to, GitHub) produces step-changes: a front-page Show HN or a top-5 PH day each individually move hundreds-to-thousands of sessions in 48h. If W0 baseline is tens of sessions/week, 6.5× is attainable. If the baseline is already hundreds/week from organic alone, it is not.
- **The honest framing for the KPI:** hit +60% WoW on *organic + referral sessions combined* by engineering 2–3 launch events, accept that the curve will be spiky (launch weeks up 3–10×, non-launch weeks flat), and report organic (GSC clicks) separately so a successful November doesn't mask a flat organic line — and vice versa.
- **Single biggest dependency:** Notch Agent Train must be real, downloadable/useable, and interesting to developers by W2. Every channel listed spikes for the *product*, not for an agency blog. No product = no spike = no 6.5×.

## 2. W0 — Baseline week (now → Nov 1)

Before any content ships, record:

| Metric | Source | Exactly what to record |
|---|---|---|
| GSC clicks + impressions, last 28 days and last 7 days | GSC Search Analytics API, `searchanalytics.query`, dimensions `date`, filter none | Totals + top 10 queries + top 10 pages by clicks |
| GA4 sessions by `sessionDefaultChannelGroup`, last 28d | GA4 Data API `runReport` | Organic Search, Referral, Direct, Social split — with the caveat "consent-gated, undercounts" |
| GA4 consent opt-in rate | Cookie-consent acceptance events | Needed to contextualise every future GA4 number |
| Indexed pages | GSC Pages report | Expect ~45; note exclusions |
| Branded vs non-branded clicks | GSC query filter `hoahwa` regex | The non-branded baseline is the real organic KPI |
| Referral sources, last 90d | GA4 `sessionSource` | So November spikes are attributable |

Store this as a dated snapshot (spreadsheet or a markdown file outside the deploy path). Every weekly target below is expressed as a multiple of the W0 weekly average `B` (organic+referral sessions/week).

## 3. Week-by-week plan

### W1 — Nov 2–8: Ship the public project surface

**Ship**
- `/build-log` page + entry #1: *"Why we're building Notch Agent Train in public (and what it costs us)"* — states the rules: real numbers, weekly entries, no invented metrics. Add the route to `sitemap.ts` `staticRoutes` (priority 0.7, weekly) so it's crawlable from day one.
- Case study page: `/case-studies/notch-agent-train/` — v1 is a "build in progress" study: problem, stack, current status, link to the repo/demo. Honest framing matches the existing `buildingNow` homepage block ("no borrowed logos").
- **Insight rewrites (4 of 16):** `core-web-vitals-2026`, `slow-shopify-stores-revenue`, `shopify-plus-growth-strategy`, `what-is-aeo-answer-engine-optimization` — these four have the best existing impressions potential; refresh dates, expand stubs to full articles, add internal links to `/ai-search-optimization` and `/growth-retainers`.

**Distribution**
- X/LinkedIn build-in-public thread #1 announcing Notch Agent Train + the build log (link to `/build-log`, not the homepage).
- Cross-post the W1 build-log entry to dev.to with `canonical_url` pointing at hoahwa.com.

**Technical SEO**
- Request indexing (GSC URL Inspection) for `/build-log`, the Notch Agent Train case study, and the 4 rewrites — the sitemap alone is slow on a low-crawl-budget site.
- Verify OG images render for the two new pages (site already has the `opengraph-image.tsx` pattern).

**KPI target:** 1.6×B organic+referral sessions; ≥30 of 45 pages indexed; 4 rewrites live. Measure: GA4 channel report vs W0; GSC 7-day clicks.

### W2 — Nov 9–15: Launch spike #1 (HN + Product Hunt)

**Ship**
- 1 new insight post: *"We let an AI agent run our Shopify audit for a week — here's the log"* (bridges the Notch Agent Train story into the Shopify/AEO service pages; internal links to `/audits`).
- **Rewrites (4):** `agentic-commerce-ai-shopping-agents`, `geo-vs-seo-getting-cited-by-ai`, `shopify-native-ab-testing`, `users-leave-after-3-seconds`.
- Build-log entry #2 (Fri Nov 13): launch-week numbers — HN/PH referral sessions, upvotes, what broke. Real numbers only.

**Distribution**
- **Tue Nov 10:** Show HN for Notch Agent Train, posted ~8–9am ET. Title format: "Show HN: Notch Agent Train – …" (product-first, no agency pitch).
- **Wed Nov 11:** Product Hunt launch, 00:01 PT. Assets ready Mon: gallery, first comment, maker answers. Link the PH page to the case study, not the homepage.
- UTM-tag every link (`utm_source=hackernews|producthunt`, `utm_medium=referral`, `utm_campaign=agentpet-launch`) so GA4 referral attribution survives.

**Technical SEO**
- Add `Article` JSON-LD check on the new post; confirm canonical tags on dev.to cross-posts resolve to hoahwa.com.
- Monitor GSC crawl stats for the spike (HN/PH traffic usually triggers recrawl).

**KPI target:** 2.5–4×B (this is the spike week; do not average it away — report the daily curve). GSC impressions flat-to-slightly-up is *expected and fine*.

### W3 — Nov 16–22: Launch spike #2 (Reddit + GitHub) and compounding content

**Ship**
- 1 new insight post: *"Shopify Winter '26 features worth building on before BFCM"* — English, merchant-intent counterpart to the Vietnamese Vietfolk post, aimed at the Black Friday (Nov 27) search window.
- **Rewrites (4):** `ecommerce-funnel-breakdown`, `conversion-leaks-2026`, `revenue-losing-slow-store`, `cross-browser-compatibility-page-speed`.
- Build-log entry #3 (Fri Nov 20): post-launch retention — week-2 users, feedback themes, roadmap changes.
- Case study update: add the launch numbers section to the Notch Agent Train case study (same honest-numbers style as the Tarotto study).

**Distribution**
- r/macapps and r/ClaudeAI posts — value-first writeups (what was built, what was learned), each tailored to sub rules; not cross-posted spam.
- GitHub README for the Notch Agent Train repo with a contextual backlink to the case study; pin the repo.
- dev.to cross-post of build-log #2 with canonical.

**Technical SEO**
- First keyword-level GSC review of the 8 rewrites shipped so far: which gained impressions, which queries appeared; patch titles/intros where intent mismatch shows.
- Internal-link pass: every rewritten post links to exactly one service page + the build log.

**KPI target:** 1.6× W2 sessions (cumulative ~4–6×B), 12 of 16 rewrites live, first non-branded impressions on new content visible in GSC.

### W4 — Nov 23–29: BFCM relevance + month-close report

**Ship**
- 1 new insight post: *"What we learned launching an AI tool in public: the November numbers"* — the full data post (GSC/GA4 screenshots, referral breakdown). This post is the credibility asset that outlives the spikes.
- **Rewrites (final 4):** `no-premade-themes`, `payment-compliance-scale`, `direct-collaboration-agency-overhead`, `designing-for-web-awards-ui-patterns`.
- Build-log entry #4 (Fri Nov 27): month close — total sessions, what worked, December plan.

**Distribution**
- Reshare the numbers post on X/LinkedIn; dev.to + Medium cross-post with canonical.
- Reply-period engagement on HN/PH/Reddit threads from W2–W3 (drives late referral tail).

**Technical SEO**
- Full GSC Pages re-audit: all 20 insight posts + new pages indexed; fix any "Crawled – currently not indexed" on the rewrites (internal links, content depth).
- BFCM check: confirm the Winter '26 post is indexed and ranking for its head term before Nov 27.

**KPI target:** sustain ≥4×B weekly (post-spike floor is the real result); 16/16 rewrites live; GSC non-branded clicks +25–50% vs W0 (the honest organic outcome); month-end report published.

## 4. Weekly keyword targets (Shopify/eCommerce + AI agent tooling)

| Week | Target keyword cluster | Intent | Vehicle |
|---|---|---|---|
| W1 | "core web vitals Shopify 2026", "Shopify INP fix" | Merchant/dev troubleshooting (informational → audit lead) | Rewrite: `core-web-vitals-2026` |
| W1 | "what is AEO / answer engine optimization" | Early-funnel education → `/ai-search-optimization` | Rewrite: `what-is-aeo-…` |
| W2 | "AI agent ecommerce audit", "AI agent Shopify store" | Tool-curious operators (transactional-adjacent) | New post: AI-agent audit log |
| W2 | "agentic commerce", "AI shopping agents" | Trend/investor + merchant curiosity | Rewrite: `agentic-commerce-…` |
| W3 | "Shopify Winter 2026 Editions features", "Shopify BFCM setup checklist" | Merchant, seasonal, high November volume | New post: Winter '26 build list |
| W3 | "GEO vs SEO", "get cited by ChatGPT / AI Overviews" | Agency/service-intent | Rewrite: `geo-vs-seo-…` |
| W4 | "build in public AI app results", "Product Hunt launch numbers" | Founder/dev audience; earns backlinks | New post: November numbers |
| W4 | "Shopify conversion funnel drop-off" | CRO-intent → growth retainers | Rewrite: `ecommerce-funnel-breakdown` |

## 5. Reporting cadence

**Every Monday (Nov 9, 16, 23, 30), one page, four pulls:**

1. **GSC Search Analytics API** (`searchanalytics.query`): 7-day clicks + impressions vs prior 7 days, dimensions `date`; then dimension `page` filtered to `/insights/` and `/build-log`; then dimension `query` with a brand-regex split (`hoahwa` vs non-brand).
2. **GA4 Data API** (`runReport`): `sessions` by `sessionDefaultChannelGroup` (Organic Search, Referral, Direct, Social), 7-day vs prior; `sessions` by `sessionSource` for the referral tail (news.ycombinator.com, producthunt.com, reddit, dev.to, github.com); consent opt-in rate for context.
3. **GSC Pages/indexing**: indexed count, new exclusions since last week.
4. **Content ledger**: rewrites shipped X/16, build-log entries shipped, distribution actions completed.

Report format: three lines of headline numbers, a daily-sessions sparkline (to show spikes honestly), one paragraph of interpretation, one decision for next week. Build-log entry and weekly report are the same underlying numbers — the report is internal, the build log is the public version.

## 6. Risks

- **Organic can't carry the number.** If leadership reads "6.5×" as organic growth, November will look like failure even if referral hits target. Mitigate by reporting the channels separately from week one.
- **Launch dependency on Notch Agent Train being genuinely good.** HN and r/ClaudeAI punish thin launches; a weak product damages the credibility the whole plan is built to create.
- **Post-spike cliff.** W3–W4 without a second spike can halve sessions WoW and break the +60% streak arithmetically even in a great month. Pre-agree that the streak is judged on the 4-week multiple and the post-spike floor, not four consecutive greens.
- **GA4 consent gating understates referral spikes** (HN/PH/Reddit audiences decline cookies at high rates). Spikes will look smaller in GA4 than reality; corroborate with server logs (Hostinger access logs) or PH/HN's own referrer counts before concluding a launch underperformed.
- **GSC URL-prefix blind spot:** any `www.` traffic is invisible. Verify the apex redirects are tight in W1.
- **Rewrite quality risk:** 4 substantive rewrites/week alongside launches is the heaviest workload in the plan; shipping 16 shallow rewrites re-creates the thin-content problem the rewrites exist to fix. If forced to choose, protect W2 launch quality and let W4 rewrites slip into December.
- **Reddit/community backlash** if posts read as agency self-promotion. Every community post must be about Notch Agent Train, written as a maker, with hoahwa.com as the byline — not the subject.

