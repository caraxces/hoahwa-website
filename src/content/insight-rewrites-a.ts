import type { InsightBlock } from "@/lib/insights-types";

export const insightRewritesA: Record<
  string,
  { title?: string; excerpt: string; body: InsightBlock[]; tags?: string[] }
> = {
  "why-slow-websites-hurt-engagement": {
    title: "Why Slow Websites Hurt Engagement Before They Hurt Sales",
    excerpt:
      "Slow pages erode scroll depth, session length, and return visits long before conversion drops. Here is how to spot the damage and fix it.",
    body: [
      {
        type: "paragraph",
        text: "Slow websites hurt engagement before they hurt sales. When pages lag, visitors scroll less, view fewer products, and come back less often — and those behavioural drops show up in your analytics weeks before conversion rate moves enough to alarm anyone. Google's Core Web Vitals define what counts as fast enough: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1, measured at the 75th percentile of real visits.",
      },
      { type: "heading", text: "Engagement fails before revenue does" },
      {
        type: "paragraph",
        text: "Conversion rate is a lagging indicator. It only counts the visitors who stayed long enough to buy, so it hides the ones who gave up during the first page load. The earlier signals — bounce rate on collection pages, scroll depth on the homepage, product pages viewed per session — deteriorate first. A store can look stable in Shopify Analytics while its mobile engagement is quietly collapsing under a heavy theme.",
      },
      {
        type: "paragraph",
        text: "There is also a compounding effect. Engaged visitors are the ones who join your email list, save products, and return directly instead of through another paid click. When speed suppresses engagement, you lose that owned-audience growth too, and acquisition costs creep up to fill the gap. The performance problem becomes a media budget problem.",
      },
      { type: "heading", text: "What “slow” actually means in 2026" },
      {
        type: "paragraph",
        text: "Speed is not one number. Google evaluates real-user experience through three Core Web Vitals, and each maps to a different kind of frustration. Passing them at the 75th percentile of page views — meaning three out of four real visits meet the bar — is the standard that matters, not a perfect Lighthouse score on your office MacBook.",
      },
      {
        type: "list",
        items: [
          "LCP (Largest Contentful Paint) at or below 2.5s: how long the main content — usually your hero image or product photo — takes to appear. Slow LCP reads as “this site is broken.”",
          "INP (Interaction to Next Paint) at or below 200ms: how quickly the page responds when someone taps a variant selector, opens the menu, or adds to cart. High INP reads as “this site ignores me.”",
          "CLS (Cumulative Layout Shift) at or below 0.1: how much the layout jumps as banners, fonts, and app widgets load. High CLS reads as “this site can't be trusted with my tap.”",
          "Field data beats lab data: a page that passes on Wi-Fi can still fail for real customers on mid-range Android phones over 4G.",
        ],
      },
      { type: "heading", text: "Where the damage shows up in your analytics" },
      {
        type: "paragraph",
        text: "You rarely need a performance tool to suspect a problem — your existing analytics usually show the shape of it. Segment by device first, because engagement gaps between desktop and mobile are almost always a speed story before they are a design story.",
      },
      {
        type: "list",
        items: [
          "Mobile bounce rate materially higher than desktop on the same templates",
          "Collection-to-product click-through falling while traffic stays flat",
          "Average session duration and pages per session declining month over month",
          "Scroll depth reports showing most mobile visitors never reach your second section",
          "Returning visitor share shrinking even as email and ad spend hold steady",
        ],
      },
      { type: "heading", text: "The usual causes on a Shopify store" },
      {
        type: "paragraph",
        text: "Shopify's infrastructure is fast; the layers merchants add on top are not. In the stores we audit, the same handful of culprits account for most of the delay.",
      },
      {
        type: "list",
        items: [
          "Theme bloat: multipurpose themes shipping code for dozens of features you never enabled",
          "App pile-up: every installed app can inject scripts and styles into every page, including the ones it never appears on",
          "Oversized media: hero videos and product images uploaded at print resolution and served to phones",
          "Unbounded third-party scripts: chat widgets, review platforms, and pixels loading before your own content",
          "Layout shift from late-loading elements: announcement bars, badges, and carousels that push content down after paint",
        ],
      },
      { type: "heading", text: "A 60-minute engagement-speed checklist" },
      {
        type: "paragraph",
        text: "You can get a reliable first read on the problem in about an hour, without touching code.",
      },
      {
        type: "list",
        items: [
          "Open PageSpeed Insights for your homepage, one collection page, and one product page — record mobile LCP, INP, and CLS separately",
          "Pull the same three URLs in GA4 or Shopify Analytics and note mobile vs desktop bounce and pages per session",
          "List every installed app and mark which templates each one actually needs to run on",
          "Check your five heaviest images: are they served at the size they display, in a modern format like WebP or AVIF?",
          "Load the homepage on a mid-range phone over mobile data and count the seconds until the hero is usable",
          "Note every element that moves after the page first paints — those are your CLS offenders",
          "Decide the one template and one metric you will fix first; speed work without a priority list stalls",
        ],
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Does site speed affect SEO as well as engagement? Yes — Core Web Vitals feed into Google's page experience signals, and slow pages also get crawled less efficiently. But the engagement damage arrives first and usually costs more than the ranking effect.",
      },
      {
        type: "paragraph",
        text: "Is a high Lighthouse score enough? No. Lighthouse is a lab test on one simulated device. Google's thresholds are based on field data from real visitors, so a store can score well in the lab and still fail the 75th-percentile bar on actual phones.",
      },
      {
        type: "paragraph",
        text: "How often should we re-measure? After every theme change, every new app install, and at least monthly otherwise. Performance regresses by accumulation — no single update looks dangerous, but six months of small additions will.",
      },
      {
        type: "paragraph",
        text: "If your numbers are already slipping, the fastest path is a structured audit that ties each slow template to the engagement metric it is suppressing, then fixes in priority order rather than rewriting the whole theme.",
      },
      {
        type: "cta",
        href: "/audits",
        label: "See how a Hoahwa performance audit works →",
        note: "Template-by-template Core Web Vitals, app and script inventory, and a fix list ordered by revenue impact.",
      },
    ],
  },
  "cross-browser-compatibility-page-speed": {
    title: "Cross-Browser Compatibility and Page Speed: A QA Guide",
    excerpt:
      "A Shopify theme that is fast in Chrome can still break in Safari or in-app browsers. A practical QA process for compatibility and speed together.",
    body: [
      {
        type: "paragraph",
        text: "Cross-browser compatibility and page speed are the same discipline viewed from two angles: your store has to render correctly and load quickly for the browsers your customers actually use, not the one your team develops in. For most Shopify brands that means Safari on iPhone first, Chrome on mid-range Android second, and in-app browsers from Instagram, TikTok, and email clients as a permanent third category. QA them together, in one pass, before every release.",
      },
      { type: "heading", text: "Why Chrome-on-a-MacBook proves almost nothing" },
      {
        type: "paragraph",
        text: "Development machines are unrepresentative by definition: fast CPUs, large screens, desktop-class memory, and a browser with the most forgiving engine. Safari uses WebKit, which handles lazy-loading, date inputs, video formats, and sticky positioning differently from Chromium. In-app browsers add their own constraints — reduced storage, modified caching, and viewport chrome that eats vertical space. A theme that feels instant in local development can stutter on a three-year-old Android phone and render a broken checkout button in an Instagram webview.",
      },
      {
        type: "paragraph",
        text: "Compatibility and performance also interact. A JavaScript-heavy section that Chrome executes in 80 milliseconds can block Safari's main thread for three times as long. An image format your pipeline emits may be universally supported today, but a video codec or CSS feature often is not. Testing only for correctness, or only for speed, misses the failures that live in the intersection.",
      },
      { type: "heading", text: "Build a testing matrix from your own traffic" },
      {
        type: "paragraph",
        text: "Do not copy a generic browser list — derive one from your analytics. Sort sessions by browser, OS, and device class, and take the combinations that cover roughly 95% of traffic. For a typical DTC brand that produces a short, stable matrix.",
      },
      {
        type: "list",
        items: [
          "Safari on a current iPhone and, if traffic justifies it, the previous iOS major version",
          "Chrome on a mid-range Android device — not a flagship — over throttled 4G",
          "Desktop Safari and desktop Chrome at laptop viewport widths",
          "At least one in-app browser: open your store from an Instagram or TikTok link and walk the full purchase path",
          "Your email client's rendering environment for any page a campaign links to directly",
        ],
      },
      {
        type: "paragraph",
        text: "Real devices beat emulators for anything involving touch, scroll physics, video playback, or payment wallets. Emulators are fine for layout checks; they are not fine for judging whether a page feels fast.",
      },
      { type: "heading", text: "Where Shopify themes usually break" },
      {
        type: "paragraph",
        text: "Across the stores we QA, the same categories of failure recur. They are rarely exotic — they are the everyday components nobody re-tested after an app update.",
      },
      {
        type: "list",
        items: [
          "Sticky headers and cart drawers that misbehave with dynamic viewport units on mobile Safari",
          "Variant pickers and swatches whose JavaScript blocks interaction on slower devices",
          "Autoplaying hero video that fails silently on iOS low-power mode or plays without sound constraints handled",
          "Payment wallets — Apple Pay, Google Pay — that render differently inside in-app browsers",
          "Fonts that flash unstyled text or shift layout because preloading behaves differently across engines",
          "Lazy-loaded images below the fold that never trigger in older WebKit versions",
        ],
      },
      { type: "heading", text: "A pre-release QA checklist" },
      {
        type: "paragraph",
        text: "Run this on every theme release, app install, or significant content change. It takes one focused afternoon, and it is cheaper than discovering a broken checkout from your ad spend.",
      },
      {
        type: "list",
        items: [
          "Walk the full purchase path — homepage, collection, product, cart, checkout — on every matrix entry, on real devices",
          "Measure LCP, INP, and CLS per template on mobile; compare against the 2.5s / 200ms / 0.1 thresholds at the 75th percentile",
          "Test with browser developer tools throttled to a mid-tier mobile CPU and 4G network",
          "Complete one real test order per browser, including a wallet payment and a discount code",
          "Open key pages from an in-app browser link and confirm analytics sessions still record correctly",
          "Screenshot key templates for visual regression so the next release has a baseline",
          "Record every failure with device, OS, browser version, and a screen recording — vague bug reports do not get fixed",
        ],
      },
      { type: "heading", text: "Fix at the architecture level, not with patches" },
      {
        type: "paragraph",
        text: "Recurring cross-browser failures are usually a symptom of how a theme is built: JavaScript doing work CSS could do, layout depending on measurements taken after load, or app scripts injected globally instead of scoped to the templates that need them. A theme built with progressive enhancement — semantic HTML first, styling second, JavaScript as an enhancement layer — degrades gracefully on the browsers you forgot to test. That is an argument for getting the theme architecture right once rather than paying for QA firefighting forever.",
      },
      {
        type: "paragraph",
        text: "Automation narrows the gap between releases. Lint rules and build-time checks catch unsupported syntax before it ships, and a small suite of scripted browser runs through the purchase path catches regressions the same day they are introduced. Automation does not replace the monthly real-device pass — it makes that pass faster by keeping the obvious failures out of it.",
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Which browsers should a Shopify store support? Whatever your analytics say your customers use — typically current and previous Safari, current Chrome, and the major in-app browsers. Supporting everything ever made is waste; ignoring the top of your own traffic report is negligence.",
      },
      {
        type: "paragraph",
        text: "Are browser-testing cloud services enough? They are useful for layout and functional checks across many versions, but they cannot tell you how a page feels on real hardware. Use them for breadth and physical devices for depth.",
      },
      {
        type: "paragraph",
        text: "How often should we re-test? Every release without exception, plus a scheduled monthly pass on the purchase path. Apps update themselves, browsers update monthly, and your theme changes more often than you think.",
      },
      {
        type: "paragraph",
        text: "If your theme fails this checklist repeatedly, the problem is structural, and the durable fix is a theme engineered for compatibility and performance from the start.",
      },
      {
        type: "cta",
        href: "/shopify-theme-builds",
        label: "How Hoahwa builds Shopify themes →",
        note: "Custom themes engineered for speed and cross-browser resilience, with QA built into the delivery process.",
      },
    ],
  },
  "direct-collaboration-agency-overhead": {
    title: "Cutting Agency Overhead Through Direct Collaboration",
    excerpt:
      "Account layers, handoffs, and reinterpretation slow eCommerce growth. Direct collaboration with senior builders keeps decisions close to the code.",
    body: [
      {
        type: "paragraph",
        text: "Agency overhead is the cost of every layer between your business decision and the code that ships it — account managers, project managers, strategy decks, and handoff documents that each reinterpret the request a little. Direct collaboration removes those layers: you work with the senior people who design and build your Shopify store, so feedback loops shrink from weeks to days and what you approved is what goes live. The result is not just speed; it is that the intent survives the process.",
      },
      { type: "heading", text: "Where the overhead actually hides" },
      {
        type: "paragraph",
        text: "Large agency structures exist to coordinate large teams, and coordination is legitimately expensive. The problem is that most eCommerce retainers do not need that scale. A landing page refresh passes through an account manager, a strategist, a designer, a developer, and a QA reviewer — five people, four handoffs, three meetings. Each handoff adds latency and loses context. By the time the work ships, the campaign window it was built for may have closed.",
      },
      {
        type: "paragraph",
        text: "The less visible cost is reinterpretation. Every relay in the chain translates your commercial goal into their own discipline's language, and something is lost each time. “Make the product page reassure first-time buyers” becomes a wireframe, becomes a design, becomes a build — and the reassurance you asked for has become a trust-badge row nobody remembers choosing. Direct collaboration removes the translation errors by removing the translators.",
      },
      { type: "heading", text: "What direct collaboration looks like in practice" },
      {
        type: "paragraph",
        text: "Direct does not mean unmanaged. It means the person you explain the problem to is the person who fixes it, and that person is senior enough to push back when your request conflicts with a better solution.",
      },
      {
        type: "list",
        items: [
          "One accountable team for theme architecture, CRO experiments, and delivery quality — no internal escalation maze",
          "You review work with the people who built it, in the same call, with the codebase open",
          "Technical trade-offs explained in business terms: cost, risk, and reversibility, not jargon",
          "Roadmaps ordered by expected impact, not by what fills a timesheet",
          "Decisions documented once, in the place the work lives, rather than re-minuted across three tools",
        ],
      },
      { type: "heading", text: "The economics: overhead is a recurring tax" },
      {
        type: "paragraph",
        text: "Agency overhead does not appear on an invoice as a line item, which is why it survives. It appears as slower iteration — which in eCommerce is a direct revenue cost. If a CRO hypothesis takes six weeks to test instead of two, you run a third as many experiments per quarter, and compounding gains from testing shrink accordingly. If a seasonal landing page misses its window, the spend behind it converts at the old page's rate.",
      },
      {
        type: "paragraph",
        text: "This is why the honest comparison between agency models is not hourly rates but cycle time: how long from a business idea to a measured result. A cheaper retainer with three handoffs often costs more per shipped improvement than a senior team you can reach directly.",
      },
      {
        type: "paragraph",
        text: "Communication cadence changes too. Layered agencies communicate in scheduled status meetings, which batch decisions into weekly slots. Direct teams work asynchronously by default — a question answered in the project thread the same afternoon, a screen recording instead of a slide deck — and reserve calls for decisions that genuinely need discussion. The time you save is not meeting time; it is the queue time between meetings.",
      },
      {
        type: "paragraph",
        text: "It is worth being fair about when overhead is justified. Programmes that genuinely span disciplines at once — a replatform alongside a rebrand alongside an ERP integration — need coordination, and paying for it is rational. The test is whether the coordination serves the work or the agency's internal structure. If the layers exist to keep the agency's bench utilised, that cost is being passed to you.",
      },
      { type: "heading", text: "How to tell if you are paying for layers" },
      {
        type: "list",
        items: [
          "You have never spoken to the person who writes your theme's code",
          "Small requests — a copy change, a new section — take more than a week to ship",
          "Meeting time with account staff exceeds meeting time with practitioners",
          "You receive reports about work more often than you review the work itself",
          "When something breaks, the first response is a ticket number, not a diagnosis",
        ],
      },
      {
        type: "paragraph",
        text: "Two or more of these is a strong signal that you are funding coordination rather than output.",
      },
      { type: "heading", text: "Switching without losing continuity" },
      {
        type: "paragraph",
        text: "Moving to a direct model does not require a dramatic break. A sensible transition starts with one contained scope — a performance audit, a landing page sprint, a quarter of CRO — so you can judge cycle time and communication quality on real work before committing a larger roadmap. Ask any prospective partner who, specifically, will touch your store, and make the answer part of the agreement.",
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Is direct collaboration only for small brands? No — it suits any brand whose work is iterative: landing pages, CRO, merchandising, performance. Very large programmes spanning replatforming, ERP integration, and multi-market launches may still justify a larger structure, but even then, day-to-day iteration benefits from a direct senior team.",
      },
      {
        type: "paragraph",
        text: "Doesn't a project manager protect my time? A good one can, on genuinely complex programmes. On iterative growth work, a PM layer mostly protects the agency's utilisation spreadsheet. A senior practitioner who owns the outcome manages their own queue and tells you the truth about timing.",
      },
      {
        type: "paragraph",
        text: "What happens if our one senior contact is unavailable? Ask how the partner handles it before signing. A well-run small team documents decisions in the codebase and the roadmap, so a second senior can pick up work without a two-week knowledge transfer.",
      },
      {
        type: "paragraph",
        text: "If your current setup feels like a relay race where the baton keeps getting dropped, it is worth comparing cycle times against a retainer built around direct access to senior builders.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "How Hoahwa growth retainers work →",
        note: "One senior team, direct access, roadmaps tied to measured outcomes — not billable hours.",
      },
    ],
  },
  "designing-for-web-awards-ui-patterns": {
    title: "Designing for Web Awards: UI Patterns That Still Convert",
    excerpt:
      "Award-worthy eCommerce design balances editorial craft with clarity. The UI patterns juries reward — and how to use them without hurting conversion.",
    body: [
      {
        type: "paragraph",
        text: "Designing for web awards means pursuing the same qualities that make eCommerce convert: intentional typography, disciplined spacing, confident photography, and motion that guides attention instead of stealing it. Juries at awards like Awwwards and the FWA reward sites that feel authored rather than assembled — and the patterns that earn that reaction, applied with restraint, also make Shopify stores easier to buy from. The mistake is treating award design and conversion design as opposites; done properly, they are the same brief.",
      },
      { type: "heading", text: "What juries actually reward" },
      {
        type: "paragraph",
        text: "Strip away the case-study films and award juries are evaluating a short list of fundamentals. Craft: consistent spacing systems, aligned grids, typography with a clear hierarchy and enough contrast to read on a phone. Intent: every element earning its place, nothing decorative for its own sake. Coherence: photography, motion, and copy that feel like one voice. Notice what is absent — nobody wins awards for animation density or for how many fonts they loaded.",
      },
      {
        type: "paragraph",
        text: "Those fundamentals are also what make a store feel trustworthy to a first-time visitor deciding whether to hand over card details. Visual discipline reads as operational competence. A shopper cannot inspect your warehouse, but they can inspect your product page, and they generalise from it.",
      },
      { type: "heading", text: "UI patterns that age well" },
      {
        type: "paragraph",
        text: "Trends rotate; these patterns keep showing up on winning commerce sites because they serve the user first.",
      },
      {
        type: "list",
        items: [
          "Editorial hero blocks: one strong image, one clear statement, one primary action — no carousel diluting all three",
          "A restrained type scale: two families at most, sizes that hold hierarchy at mobile widths",
          "Scroll-linked motion that reveals content as you reach it, rather than animating everything at once",
          "Photography treated as layout: images cropped to the grid, not dropped into generic rectangles",
          "Generous whitespace around price and add-to-cart, so the buying action is the visual anchor of the product page",
          "Micro-interactions on controls — hover, focus, added-to-cart confirmation — that make the interface feel responsive and alive",
        ],
      },
      { type: "heading", text: "Where award-chasing goes wrong on Shopify" },
      {
        type: "paragraph",
        text: "The failure mode is real, and it is worth naming: sites built to impress juries that are miserable to shop. Full-screen loaders before the homepage. Navigation hidden behind experimental gestures. Product imagery so art-directed that a shopper cannot see the fabric. Scroll-jacking that fights the user's own thumb. Each of these wins a point of novelty and loses points of findability, speed, and accessibility — and the customer pays the difference.",
      },
      {
        type: "paragraph",
        text: "There is also a performance floor. Core Web Vitals thresholds — LCP at or below 2.5 seconds, INP at or below 200 milliseconds, CLS at or below 0.1 — apply to beautiful sites exactly as to plain ones. Motion and media must be engineered to fit that budget: compressed assets, reserved layout space, and animation that never blocks interaction. A site that wins an award and fails its mobile customers has optimised for the wrong audience.",
      },
      { type: "heading", text: "Applying award-level craft to a converting store" },
      {
        type: "paragraph",
        text: "The synthesis is straightforward: put the craft where it supports the purchase, and keep the purchase path conventional. Shoppers bring strong expectations about where the cart lives, how variant selection works, and what checkout looks like. Originality belongs in brand expression — hero storytelling, editorial content, collection presentation — not in reinventing the add-to-cart button.",
      },
      {
        type: "paragraph",
        text: "On Shopify specifically, this balance is easier when the design system lives in the theme as tokens and sections rather than as one-off page treatments. Typography, spacing, and colour defined once and applied everywhere keep the craft consistent as the catalogue grows, and they keep motion and media budgets enforceable at the template level instead of page by page.",
      },
      {
        type: "paragraph",
        text: "Measure the synthesis, do not assume it. Run the redesigned templates against the previous ones on engagement and conversion before rolling them out sitewide, and include performance in the acceptance criteria alongside the visual ones. Craft that only survives until it meets real traffic was never finished.",
      },
      { type: "heading", text: "A design review checklist" },
      {
        type: "list",
        items: [
          "Can a first-time mobile visitor reach a product and buy it without learning anything new?",
          "Does every animation answer “what does this help the user notice?” — remove the ones with no answer",
          "Is the type hierarchy readable at 375px width without pinching or squinting?",
          "Do all interactive elements have visible focus and hover states?",
          "Does the page meet LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 on a mid-range phone, with the design fully loaded?",
          "Is photography art-directed to the grid, with alt text that carries the same information?",
          "Does the buying action remain the visual anchor on every product page, above the fold on mobile?",
        ],
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Can a conversion-focused Shopify store win design awards? Yes — juries increasingly reward commerce work that is both beautiful and effective, and the fundamentals overlap. What rarely wins is a generic theme with a coat of paint; custom design is a prerequisite.",
      },
      {
        type: "paragraph",
        text: "Will heavy motion hurt our SEO? Not directly — but the performance cost of badly engineered motion will. Core Web Vitals feed page experience signals, so motion that pushes LCP or CLS past the thresholds costs you twice: rankings and users.",
      },
      {
        type: "paragraph",
        text: "Should we redesign everything at once to reach this level? Usually no. The highest-leverage sequence is product page and homepage first, then collections and editorial templates, validating each stage against conversion and performance data before moving on.",
      },
      {
        type: "paragraph",
        text: "Getting this balance right is exactly what a custom theme is for: editorial craft in the brand layer, ruthless clarity in the purchase path, and a performance budget the design has to respect.",
      },
      {
        type: "cta",
        href: "/shopify-theme-builds",
        label: "See Hoahwa's approach to theme design →",
        note: "Custom Shopify themes where award-level craft and conversion discipline are the same brief.",
      },
    ],
  },
  "slow-shopify-stores-revenue": {
    title: "Why Slow Shopify Stores Hurt Revenue More Than You Think",
    excerpt:
      "A slow Shopify store taxes every stage of the funnel — and every paid click. Where the revenue leaks, what causes them, and the fix order that pays.",
    body: [
      {
        type: "paragraph",
        text: "A slow Shopify store hurts revenue at every stage of the funnel, not just at checkout: slow homepages cut exploration, sluggish collection filters drive bounces, heavy product pages delay add-to-cart, and overloaded checkout scripts raise abandonment. Shopify's platform itself is fast, so the slowness almost always comes from what has been added on top — theme bloat, app scripts, and unoptimised media. The compounding effect is the part most brands miss: every paid click you buy lands on the slow experience, so the performance problem is multiplied by your entire media budget.",
      },
      { type: "heading", text: "Speed is a multiplier on everything you buy" },
      {
        type: "paragraph",
        text: "Paid media amplifies whatever waits on the other side of the ad. When product listing pages and product pages load slowly, return on ad spend falls even if the creative is excellent, because the landing experience fails the click. Brands often respond by tweaking campaigns — new audiences, new creative, new bidding — when the constraint is the storefront. The media team gets blamed for a theme problem.",
      },
      {
        type: "paragraph",
        text: "Email and SMS traffic suffers the same way. These are your highest-intent visitors, the ones who already know the brand, and they are the most likely to be on a phone in a weak network. If the store is slow for them, you are taxing the traffic you own hardest.",
      },
      { type: "heading", text: "Revenue impact by funnel stage" },
      {
        type: "paragraph",
        text: "Different templates fail in different ways, which is why “the site feels slow” needs to be decomposed before it can be fixed. These are the failure modes we see most often, ordered by where the money leaks.",
      },
      {
        type: "list",
        items: [
          "Homepage: a late-painting hero (poor LCP) cuts scroll depth and collection click-through — visitors never reach your catalogue",
          "Collection pages: slow filters and pagination increase bounce precisely where buying intent is highest",
          "Product pages: heavy image galleries and review widgets delay add-to-cart on mobile and push content down as they load",
          "Cart and checkout: stacked app scripts inflate INP, so taps on quantity, discounts, and payment buttons feel ignored",
          "Sitewide: layout shift from announcement bars, popups, and badges erodes the trust that precedes any purchase",
        ],
      },
      { type: "heading", text: "The Shopify-specific causes" },
      {
        type: "paragraph",
        text: "Shopify's hosting, CDN, and checkout infrastructure are genuinely fast and largely outside your control. What merchants control — and where audits consistently find the delay — is the layer above it.",
      },
      {
        type: "list",
        items: [
          "Multipurpose themes carrying code for dozens of features the store never enabled",
          "Installed apps injecting scripts and stylesheets into every template, including ones they never appear on",
          "Hero videos and product images uploaded far beyond the resolution any device will display",
          "Marketing pixels, chat widgets, and popups loading before the store's own content",
          "Unscoped custom JavaScript from past agencies, layered on top of each other with no owner",
        ],
      },
      {
        type: "paragraph",
        text: "The pattern to notice is accumulation. No single app or script kills performance; six months of individually reasonable additions do. That is why performance work fails when it is treated as a one-off cleanup — it has to become a release discipline, with every new addition treated as spending from a budget.",
      },
      { type: "heading", text: "Fix in order of traffic, not in order of annoyance" },
      {
        type: "paragraph",
        text: "Measure Core Web Vitals per template — LCP at or below 2.5 seconds, INP at or below 200 milliseconds, CLS at or below 0.1, at the 75th percentile of real visits — and weight fixes by each template's share of revenue-generating sessions. For most stores that means the product page first, then the top collection, then the homepage. A beautiful lab score on a page nobody buys from is worth nothing.",
      },
      {
        type: "paragraph",
        text: "Set a regression rule before you start: any new app, script, or section must keep the template within its current vitals, or it does not ship. Without that rule, the store drifts back to slow within two quarters and the sprint has to be bought again. With it, performance becomes a property of how the store is run rather than a project that is periodically repeated.",
      },
      { type: "heading", text: "A revenue-first performance checklist" },
      {
        type: "list",
        items: [
          "Pull field data for homepage, top collection, and top product page; record mobile LCP, INP, CLS separately",
          "Rank templates by sessions multiplied by their role in the funnel; fix the worst-scoring, highest-traffic template first",
          "Inventory every installed app; remove or scope anything not earning its script weight",
          "Re-encode hero and product media to display-size, modern formats (WebP/AVIF) with explicit dimensions",
          "Defer every third-party script that is not required for first paint; audit pixels quarterly",
          "Reserve layout space for bars, badges, and embeds so nothing shifts after paint",
          "Re-measure after every theme or app change, and after Shopify's own seasonal updates",
        ],
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Is Shopify itself slow? No — Shopify's infrastructure is among the fastest in hosted commerce. Storefront slowness comes from the theme, apps, media, and scripts added on top, all of which are fixable without leaving the platform.",
      },
      {
        type: "paragraph",
        text: "Do we need a new theme to get fast? Sometimes, but not first. Many stores recover meaningful speed by removing apps, scoping scripts, and fixing media on the existing theme. A rebuild makes sense when the theme's architecture is the bottleneck or when you are changing it anyway.",
      },
      {
        type: "paragraph",
        text: "How quickly does revenue respond to speed fixes? Faster than most projects: you are removing friction from traffic you already have. Expect engagement metrics — bounce, scroll depth, pages per session — to move first, with conversion following as the improved sessions flow through the funnel.",
      },
      {
        type: "paragraph",
        text: "The reliable starting point is an audit that connects each slow template to the revenue stage it taxes, so the fix list is ordered by money rather than by what is easiest.",
      },
      {
        type: "cta",
        href: "/audits",
        label: "Get a Hoahwa performance audit →",
        note: "Template-level Core Web Vitals, app and script inventory, and a fix order ranked by revenue impact.",
      },
    ],
  },
  "revenue-losing-slow-store": {
    title: "How Much Revenue Is a Slow Shopify Store Costing You?",
    excerpt:
      "Turn “the site feels slow” into a number. A simple model using your own traffic, conversion rate, and AOV to size the cost of a slow store.",
    body: [
      {
        type: "paragraph",
        text: "You can estimate the revenue a slow store is costing you with data you already have: segment mobile and desktop sessions, compare their conversion rates, and size the gap against your average order value. If mobile converts materially worse than desktop on the same products and prices, performance is the first suspect, because speed is the most common systematic difference between the two experiences. The point of the model is not precision — it is turning a vague frustration into a business case with a payback period.",
      },
      { type: "heading", text: "Why a model beats a feeling" },
      {
        type: "paragraph",
        text: "“The site feels slow” does not survive a budget meeting. “Mobile is 68% of sessions and converts at half the desktop rate; closing a third of that gap is worth roughly £X a month” does. Performance work competes for budget with campaigns, hires, and apps, and it wins or loses on whether the return is legible. A simple, conservative model also protects you in the other direction: if the numbers say speed is not your constraint, you can stop suspecting it and look at merchandising or offer instead.",
      },
      { type: "heading", text: "The four numbers you need" },
      {
        type: "list",
        items: [
          "Sessions by device: the mobile/desktop split from GA4 or Shopify Analytics, over a recent 90-day window",
          "Conversion rate by device: same window, same source, segmented identically",
          "Average order value by device: mobile AOV often differs from desktop, so do not assume one number",
          "Core Web Vitals by template: mobile LCP, INP, and CLS from PageSpeed Insights or your RUM data, at the 75th percentile",
        ],
      },
      {
        type: "paragraph",
        text: "None of this requires new tooling. Everything except possibly field-level vitals is already in the analytics you have; the discipline is in segmenting it honestly.",
      },
      { type: "heading", text: "A simple model, run conservatively" },
      {
        type: "paragraph",
        text: "Start with the device gap. Take your desktop conversion rate as the reference experience — same catalogue, same prices, same brand — and compare it to mobile. The gap will never be zero: phones are used in more distracted contexts, and some categories genuinely skew desktop. So do not model closing the whole gap; model closing a modest fraction of it. If mobile converts at 1.2% and desktop at 2.4%, ask what a lift of 0.2 or 0.3 percentage points on mobile is worth: mobile sessions times the rate change times mobile AOV.",
      },
      {
        type: "paragraph",
        text: "Then stress-test the assumption that speed is the cause. Check that your mobile vitals actually fail the thresholds — LCP at or below 2.5 seconds, INP at or below 200 milliseconds, CLS at or below 0.1 at the 75th percentile. If mobile vitals pass everywhere and conversion still lags, your gap is UX, merchandising, or offer, and performance work is not the answer. The model is only honest if it can return that answer too.",
      },
      {
        type: "paragraph",
        text: "A purely illustrative example of the arithmetic: with 100,000 monthly mobile sessions, a 0.1-point conversion lift is 100 extra orders; at an £80 average order value that is £8,000 a month. Substitute your own three numbers and you have the monthly value of each tenth of a point — the unit in which remediation costs should be discussed.",
      },
      {
        type: "paragraph",
        text: "Finally, compare the estimated uplift against two costs: the cost of remediation, and the cost of doing nothing expressed as paid-media waste — the share of ad spend landing on slow templates that converts below its potential. For most stores buying meaningful traffic, even a conservative uplift estimate clears the cost of a focused performance sprint comfortably.",
      },
      { type: "heading", text: "Where the model goes wrong" },
      {
        type: "list",
        items: [
          "Using blended conversion rate: mixing mobile and desktop hides the entire signal",
          "Modelling closing the full device gap: some of it is context, not speed — stay conservative",
          "Ignoring template mix: a slow blog and a slow product page are not the same problem",
          "Counting engagement gains twice: pick one primary outcome (revenue) and treat the rest as leading indicators",
          "Forgetting seasonality: compare like-for-like windows, not peak season against quiet season",
        ],
      },
      { type: "heading", text: "From estimate to payback: a working checklist" },
      {
        type: "list",
        items: [
          "Export 90 days of sessions, conversion rate, and AOV segmented by device",
          "Compute the mobile/desktop conversion gap and the revenue value of a 0.1-point mobile lift",
          "Pull mobile field vitals for homepage, top collection, top product, and cart",
          "Identify which failing templates carry the most revenue-generating traffic",
          "Get a scoped cost for fixing those templates specifically — not a blanket “speed project”",
          "Set the pre-agreed measurement: which metric, which window, and what counts as confirmed",
          "Re-measure after the work and update the model with observed, not assumed, uplift",
        ],
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "How accurate can this estimate be? It is a sizing tool, not a forecast. Its job is to tell you whether the prize is worth a sprint, an audit, or nothing at all — and to give you a baseline so the post-work measurement is honest.",
      },
      {
        type: "paragraph",
        text: "What if our mobile and desktop conversion rates are similar? Then speed is probably not your binding constraint, and the model has done its job. Look next at offer, merchandising, and checkout friction — or at whether both rates are suppressed by something sitewide.",
      },
      {
        type: "paragraph",
        text: "Should we include desktop performance? Yes, but weight by traffic. Most DTC stores are majority-mobile, which is where the gap and the money usually are; a store with heavy desktop B2B traffic should weight accordingly.",
      },
      {
        type: "paragraph",
        text: "Once the model shows a prize worth chasing, the work is iterative: fix the top template, measure, reinvest. That is the natural shape of a growth retainer — performance and CRO run as a continuous loop against an agreed baseline.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "See how a Hoahwa growth retainer runs →",
        note: "Performance and CRO as a continuous, measured programme — with the baseline agreed before work starts.",
      },
    ],
  },
  "shopify-native-ab-testing": {
    title: "Shopify Native A/B Testing: What Changes for Your CRO Stack",
    excerpt:
      "Native A/B testing on Shopify removes the third-party script tax — but tooling was never the bottleneck. The discipline that makes tests pay.",
    body: [
      {
        type: "paragraph",
        text: "Shopify's native A/B testing changes the economics of experimentation: instead of paying a third-party tool to inject scripts that slow your store and distort the experience it is meant to measure, variants live in the theme itself. But the tool was never the reason most CRO programmes fail — process was. The stores that benefit from native testing are the ones that already run disciplined experiments: one hypothesis, one primary metric, held to significance before anyone acts on the result.",
      },
      { type: "heading", text: "What native testing actually fixes" },
      {
        type: "paragraph",
        text: "Third-party testing tools work by injecting JavaScript that rewrites the page after it loads. That architecture carries three costs. It slows the store, because every visitor downloads and executes the experimentation layer whether or not they are in a test. It flickers, because the original content can paint before the variant overwrites it. And it biases measurement, because the tool itself changes the performance of the pages being compared. Native testing moves the variant into the theme, which removes the injection layer and its costs.",
      },
      {
        type: "paragraph",
        text: "There is an organisational benefit too. When experiments are theme variants rather than an external overlay, they go through the same review and release process as everything else — which means they are documented, reversible, and visible to everyone who works on the store.",
      },
      { type: "heading", text: "What native tooling does not fix" },
      {
        type: "paragraph",
        text: "Easier testing raises the volume of experiments, and volume without discipline produces noise. The failure patterns are well known, and they do not care which tool you use.",
      },
      {
        type: "list",
        items: [
          "Testing without a hypothesis: changing things to see what happens produces results you cannot learn from",
          "Too many variables: changing the headline, image, and price at once tells you nothing about which mattered",
          "Peeking: checking results daily and stopping when one variant pulls ahead manufactures false winners",
          "Underpowered tests: calling a result on a few hundred sessions per variant measures randomness, not preference",
          "Orphaned winners: test variants that never get merged into the main theme, leaving a fragmented codebase",
        ],
      },
      { type: "heading", text: "Preparing your theme for clean variants" },
      {
        type: "paragraph",
        text: "Native testing rewards themes built as modular sections. If a product page is a set of well-scoped sections — gallery, buy box, social proof, cross-sell — a variant can swap or reorder sections cleanly, and the winner can be promoted by changing the template, not by unravelling injected code. If the page is a monolith of interdependent snippets, every test is surgery. This is one more reason theme architecture is a growth decision, not just an engineering taste.",
      },
      {
        type: "paragraph",
        text: "Analytics need the same preparation. Decide your event schema before the first test: how add-to-cart, checkout start, and purchase are tracked, and how the variant is recorded on each. An experiment you cannot attribute is a decoration.",
      },
      {
        type: "paragraph",
        text: "Use percentage rollouts as a safety valve rather than a discovery mechanism. Exposing a variant to a small share of traffic first is a sensible way to catch broken layouts or tracking gaps before full exposure — but it is not a shortcut to significance. The clock on your minimum sample size only starts counting once the test reaches its intended split, so treat the ramp-up as a technical check, not as early data.",
      },
      { type: "heading", text: "A testing-discipline checklist" },
      {
        type: "list",
        items: [
          "Write the hypothesis before building anything: “Changing X will improve Y because Z”",
          "Choose one primary metric per test and define what counts as a win before launch",
          "Change one meaningful variable per test; batch small cosmetic changes into a single variant if you must",
          "Estimate the traffic needed for a detectable effect and set the minimum run time — typically at least two full weekly cycles",
          "Do not check results mid-run; schedule the review date when the test launches",
          "Log control and variant in a changelog so anyone can reconstruct what ran, when, and why",
          "Merge winners into the main theme promptly and remove losing variants completely",
          "Review losers for insight: a clean loss rules something out, which is cheaper than wondering",
        ],
      },
      { type: "heading", text: "What to test first" },
      {
        type: "paragraph",
        text: "Start where traffic and uncertainty intersect. For most stores the highest-value early tests are product page buy-box layout and reassurance content, collection page default sorting and filter prominence, and homepage hero messaging for cold paid traffic. These are high-traffic templates where plausible variants differ enough to move behaviour. Resist the urge to test micro-copy on low-traffic pages — you will wait months for a result that could not matter anyway. Keep a shared backlog of candidate hypotheses, scored by expected impact and effort, so the next test is always ready when the current one concludes.",
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Do we still need a third-party testing tool? For most Shopify stores, no — native testing plus clean theme architecture covers the majority of experiments. External tools still make sense for edge cases like cross-domain funnels, but the default has flipped: justify the external tool, not the other way round.",
      },
      {
        type: "paragraph",
        text: "How long should a test run? Long enough to reach the sample size your effect estimate requires, and never less than two full weekly cycles so weekday and weekend behaviour are both represented. A test you cannot afford to run properly is a test you cannot afford to believe.",
      },
      {
        type: "paragraph",
        text: "How many tests can we run at once? One per template area, and avoid overlapping tests that could interact — two experiments touching the product page contaminate each other. Sequencing beats simultaneity for almost every store.",
      },
      {
        type: "paragraph",
        text: "Native tooling makes experimentation cheap; a retained CRO programme makes it cumulative — hypotheses built on previous results, merged cleanly, measured against an agreed baseline.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "CRO inside a Hoahwa growth retainer →",
        note: "Experiment roadmaps, clean variant architecture, and results merged into your theme — not left as overlays.",
      },
    ],
  },
  "what-is-shopify-partner": {
    title: "What Is a Shopify Partner? Benefits and How to Choose One",
    excerpt:
      "A Shopify Partner is a vetted professional in Shopify's ecosystem — from app developers to agencies. What the status means and how to choose the right one.",
    body: [
      {
        type: "paragraph",
        text: "A Shopify Partner is a member of Shopify's official partner programme — the ecosystem of agencies, developers, designers, and app builders who build, migrate, and grow stores on the platform. Membership gives partners tools to develop stores for clients and a track record inside Shopify's own directory, but the badge alone tells you little about fit: partners range from solo app developers to full-service agencies. Choosing the right one depends on what you actually need — a theme build, ongoing growth work, or both.",
      },
      { type: "heading", text: "What the partner programme is" },
      {
        type: "paragraph",
        text: "Shopify's partner programme is the platform's channel for professional services. Partners get development stores to build and test client work, access to partner support, revenue arrangements for referrals and apps, and a listing in Shopify's partner directory. Shopify also runs tiered recognition — you will see levels such as Select, Plus, Premier, and Platinum — based on the volume and quality of commerce the partner brings to the platform. Higher tiers indicate scale and a longer track record; they do not automatically indicate the right fit for a brand of your size.",
      },
      {
        type: "paragraph",
        text: "The important distinction is that partnership is an ecosystem credential, not a quality guarantee for your specific project. Shopify verifies participation and commercial track record; it does not verify that a partner's design taste matches your brand, that their code is fast, or that they will answer email after launch. That diligence is yours.",
      },
      { type: "heading", text: "The types of partner you will encounter" },
      {
        type: "list",
        items: [
          "Theme and store-build partners: design and build your storefront, from setup to fully custom themes",
          "App developers: build public or custom apps that extend what the platform does",
          "Migration specialists: move catalogues, customers, and order history from other platforms",
          "Growth and CRO partners: ongoing conversion, performance, and experimentation work after launch",
          "Full-service agencies: strategy, brand, build, and growth under one roof — with the overhead that implies",
        ],
      },
      {
        type: "paragraph",
        text: "Many partners span several categories, and the categories blur — a theme-build partner may offer retainers, and a growth partner may rebuild sections of your theme. What matters is not the label but who specifically does the work and what they are accountable for after go-live.",
      },
      { type: "heading", text: "What a good partner relationship buys you" },
      {
        type: "paragraph",
        text: "Beyond the obvious — someone else writes the Liquid — a good partner compresses your learning curve. They have watched hundreds of stores hit the same walls: app pile-ups, theme debt, botched migrations, checkout customisations that break on platform updates. That pattern recognition is most valuable before decisions harden: choosing a theme architecture that fits your catalogue size, deciding which features are worth apps versus code, and sequencing internationalisation before it becomes a migration.",
      },
      {
        type: "paragraph",
        text: "A partner also keeps pace with the platform for you. Shopify ships major updates twice a year through Editions, and the practical question is never “what is new” but “what should we switch on, and what will it break.” A partner who works in the ecosystem daily answers that from experience rather than from the announcement page.",
      },
      {
        type: "paragraph",
        text: "There is also a commercial accountability benefit. An established partner has a reputation inside the ecosystem to protect, which gives you leverage a transient freelancer cannot: a directory listing, a tier, and a body of public work that all suffer if your project is mishandled. That is not a guarantee, but it is a meaningful incentive aligned with yours.",
      },
      { type: "heading", text: "How to choose: questions that reveal fit" },
      {
        type: "paragraph",
        text: "Portfolio screenshots are the weakest evidence available — they show the launch day, not the year after. Better evidence comes from questions about process and ownership.",
      },
      {
        type: "list",
        items: [
          "Do you build custom themes or customise off-the-shelf ones — and which does my catalogue and roadmap justify?",
          "Who exactly will work on my store, and will I speak to them directly?",
          "What do you do about performance, and how will you prove it — ask for Core Web Vitals targets, not adjectives",
          "Who owns the codebase after launch, and how is it documented for an in-house team?",
          "What does the first 90 days after go-live look like — fixes, CRO, measurement?",
          "How do you handle platform updates and app changes that arrive between projects?",
          "Can I talk to a client whose store you have supported for more than a year?",
        ],
      },
      { type: "heading", text: "Red flags worth walking away from" },
      {
        type: "list",
        items: [
          "Proposals that quote pages and features but say nothing about performance budgets or measurement",
          "Account structures where you will never meet the people doing the work",
          "Dependency traps: custom code nobody else can maintain, hosted where you cannot reach it",
          "Retainers defined as hours rather than outcomes",
          "Portfolios made entirely of stores at a completely different scale or price point than yours",
        ],
      },
      { type: "heading", text: "FAQ" },
      {
        type: "paragraph",
        text: "Does a Shopify Partner cost more than a freelancer? Not necessarily per project — but the useful comparison is total cost of ownership. A cheaper build that loads slowly, breaks on updates, and cannot support CRO costs more over two years than a properly engineered one. Evaluate cycle time and durability, not the day rate.",
      },
      {
        type: "paragraph",
        text: "Do we need a partner if we have in-house developers? Often yes, at the edges: platform-specific architecture, migrations, checkout extensibility, and performance work are areas where ecosystem experience pays for itself even for strong internal teams. Many partners, including us, work alongside in-house teams rather than replacing them.",
      },
      {
        type: "paragraph",
        text: "What is the difference between a Shopify Partner and a Shopify Expert? They are largely the same ecosystem described at different times — Shopify has consolidated its professional programme under the Partner banner, with tier levels indicating scale and track record. Judge the tier as one signal among several, never as the decision.",
      },
      {
        type: "paragraph",
        text: "If you are evaluating partners for a build or a rebuild, the strongest evidence is a partner who will show you how they engineer, not just what they shipped.",
      },
      {
        type: "cta",
        href: "/shopify-theme-builds",
        label: "How Hoahwa builds Shopify themes →",
        note: "Custom themes with performance budgets, documented codebases, and a clean handover — judge us by the questions above.",
      },
    ],
  },
};
