import type { InsightBlock } from "@/lib/insights-types";

export const insightRewritesB: Record<
  string,
  { title?: string; excerpt: string; body: InsightBlock[]; tags?: string[] }
> = {
  "ecommerce-funnel-breakdown": {
    title: "eCommerce Funnel Breakdown: Find Where Buyers Drop Off",
    excerpt:
      "Map your Shopify funnel stage by stage, find the step leaking the most revenue, and fix it with focused tests instead of redesigning everything.",
    tags: ["eCommerce", "CRO", "Growth"],
    body: [
      {
        type: "paragraph",
        text: "An eCommerce funnel breakdown shows you exactly which step — homepage to collection, collection to product page, product page to cart, cart to checkout, checkout to purchase — is losing you the most buyers. You find it by measuring the conversion rate between each pair of steps in GA4 and Shopify analytics, comparing those rates to your own history, and fixing the step with the largest absolute drop-off first. The biggest mistake brands make is treating the funnel as one number: a single sitewide conversion rate hides the fact that one broken step is dragging down three healthy ones.",
      },
      {
        type: "heading",
        text: "What a Shopify funnel actually looks like",
      },
      {
        type: "paragraph",
        text: "Most Shopify stores have six measurable stages: landing (where a session starts, usually a homepage, collection, or ad landing page), collection browsing, product detail page (PDP) view, add to cart, checkout initiation, and purchase. Each transition between them is a micro-conversion with its own conversion rate, and each rate answers a different question. Landing-to-collection tells you about navigation and merchandising. Collection-to-PDP tells you whether your product tiles earn the click. PDP-to-cart tells you whether the page sells. Cart-to-checkout tells you about surprise costs and friction. Checkout-to-purchase tells you about payment trust and delivery promises.",
      },
      {
        type: "paragraph",
        text: "Some drop-off at every step is normal — a funnel is a filter, not a pipeline, and most visitors were never going to buy today. What you are hunting for is a step that performs noticeably worse than it should for your traffic mix. A steep cliff between collection and PDP usually signals findability or relevance problems: filters that do not work on mobile, sort orders that bury bestsellers, or tiles without prices and review counts. A healthy PDP that nobody reaches is not a PDP problem.",
      },
      {
        type: "heading",
        text: "How to measure each stage without guessing",
      },
      {
        type: "paragraph",
        text: "Set up a funnel exploration in GA4 with the five steps above, segmented by device and by landing page type. Shopify's own analytics show sessions that reached checkout and sessions that converted, which is enough to sanity-check the last two stages. The detail that matters most is template-level: do not ask \u201cdo product pages convert,\u201d ask \u201cdoes the PDP template for apparel convert as well as the one for accessories.\u201d Different templates have different content, different apps, and often different bugs.",
      },
      {
        type: "list",
        items: [
          "View item: sessions that loaded any PDP, by template and device",
          "Add to cart: PDP sessions that added, split by variant behaviour",
          "Begin checkout: carts that reached checkout, split by cart value",
          "Purchase: checkouts that completed, split by payment method",
          "Session recordings on the weakest step, twenty at minimum, before proposing fixes",
        ],
      },
      {
        type: "paragraph",
        text: "Quantitative funnels tell you where; session recordings and support tickets tell you why. Pair them. A number that says \u201c30% of mobile carts never reach checkout\u201d becomes actionable the moment you watch twenty recordings and see the same sticky upsell banner covering the checkout button on thirteen of them.",
      },
      {
        type: "heading",
        text: "Diagnosing the four most common leaks",
      },
      {
        type: "paragraph",
        text: "Collection-to-PDP leaks are usually merchandising. Shoppers scan tiles for image, price, and social proof; if any of the three is missing or inconsistent, clicks collapse. Fix the tile before you touch the page it links to. PDP-to-cart leaks are usually information gaps: sizing, delivery dates, returns, or what is actually in the box. These are content fixes, not redesigns.",
      },
      {
        type: "paragraph",
        text: "Cart-to-checkout leaks are usually surprise. Shipping costs revealed late, forced account creation, or a discount code field that sends bargain hunters off to Google and back to a competitor. Checkout-to-purchase leaks on Shopify are rare — the checkout is hardened — but when they appear, look at payment method coverage for your markets and at express wallets being hidden below the fold.",
      },
      {
        type: "heading",
        text: "Prioritise by volume, not by drama",
      },
      {
        type: "paragraph",
        text: "The temptation is to fix the most embarrassing problem first — the ugly page, the slow hero video. Prioritise by absolute lost revenue instead: sessions at a step multiplied by the gap between your step rate and a realistic target, multiplied by average order value. A two-point improvement at a high-volume step almost always beats a ten-point improvement at a low-volume one. Then fix with focused, single-variable tests rather than a redesign that changes twelve things and teaches you nothing.",
      },
      {
        type: "heading",
        text: "Funnel audit checklist",
      },
      {
        type: "list",
        items: [
          "Confirm every funnel step fires a clean GA4 event on desktop and mobile",
          "Segment each step by device, landing page type, and new vs returning",
          "Identify the step with the largest absolute drop in the last 90 days",
          "Watch at least twenty session recordings at that step before writing hypotheses",
          "Check whether the leak is template-specific or sitewide",
          "Write one hypothesis per fix and instrument it before shipping",
          "Re-measure the same cohort window after each change",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "What is a good conversion rate for each funnel step? There is no universal benchmark, because rates depend on traffic source, price point, and category. Your own historical rates, by device and template, are the only benchmark worth optimising against.",
      },
      {
        type: "paragraph",
        text: "Should I fix the funnel or buy more traffic? Fix the funnel first. Every leak you close makes all future traffic cheaper, and paid traffic into a leaking funnel is the most expensive way to learn that.",
      },
      {
        type: "paragraph",
        text: "How often should I review the funnel? Monthly at minimum, and after every theme or app change. Funnel steps regress silently — an app update can move a checkout button and nobody notices until the monthly review.",
      },
      {
        type: "paragraph",
        text: "If you want a second set of eyes on your funnel, a structured audit maps every step, finds the leak with the highest revenue impact, and hands you a prioritised fix list.",
      },
      {
        type: "cta",
        href: "/audits",
        label: "See how a Hoahwa audit works",
        note: "Template-level funnel analysis, session recording review, and a prioritised fix list for your Shopify store.",
      },
    ],
  },

  "conversion-leaks-2026": {
    title: "Conversion Leaks in 2026: How to Find Lost Revenue",
    excerpt:
      "The conversion leaks hurting Shopify stores in 2026 are mostly invisible: broken variants, blocked CTAs, hidden costs. Here is how to find and fix them.",
    tags: ["CRO", "eCommerce"],
    body: [
      {
        type: "paragraph",
        text: "A conversion leak is any defect — technical, content, or UX — that stops a shopper who intended to buy from completing the purchase. In 2026 the biggest leaks on Shopify stores are not slow pages or ugly design; they are invisible ones: variant selectors that fail on mobile, upsell apps that cover the checkout button, and international shoppers who cannot see a landed total. You find leaks by auditing the purchase path on real devices with real data, not by looking at the homepage.",
      },
      {
        type: "heading",
        text: "Why attribution got harder and leaks got quieter",
      },
      {
        type: "paragraph",
        text: "Two shifts define 2026. First, browser privacy changes and consent requirements mean a slice of your traffic never appears in client-side analytics at all, so leaks that hit privacy-conscious buyers are systematically underreported. Second, the average Shopify store now runs a stack of apps that inject UI — reviews, upsells, loyalty, chat, cookie banners — and each injection is a new place where a layout can shift, a button can be covered, or a script can block the main thread.",
      },
      {
        type: "paragraph",
        text: "Brands that cannot connect ad spend to on-site behaviour guess at fixes. Clean event schemas in GA4, Shopify's server-side data, and disciplined app hygiene make a CRO programme auditable. Without that foundation, every \u201cconversion rate is down\u201d conversation turns into opinion-versus-opinion.",
      },
      {
        type: "heading",
        text: "The leaks we find most often on Shopify stores",
      },
      {
        type: "list",
        items: [
          "Variant selectors that fail silently on mobile — the shopper taps a size, nothing happens, and they leave assuming it is out of stock",
          "Upsell or cross-sell apps that render over the main add-to-cart or checkout CTA on smaller viewports",
          "International shipping UX that hides duties and totals until checkout, so overseas carts die at the first real price",
          "Loyalty and review widgets that load late and shift the layout exactly when the shopper reaches for the buy button",
          "Discount code fields at checkout that trigger coupon hunting — the shopper leaves to find a code and never comes back",
          "Collection filters that reload the whole page, lose scroll position, and make browsing a large catalogue feel broken",
        ],
      },
      {
        type: "paragraph",
        text: "Notice what these have in common: none of them appear in a Lighthouse report, and most never appear in support tickets, because shoppers do not complain — they leave. That is why leak-hunting is an evidence exercise, not a feedback exercise.",
      },
      {
        type: "heading",
        text: "A repeatable leak-hunting process",
      },
      {
        type: "paragraph",
        text: "Start with the money path, not the homepage. Walk the exact sequence a paid visitor follows — ad landing page, collection, PDP, cart, checkout — on a mid-range Android phone over cellular, then on an iPhone in Safari, then on desktop. Do it as a shopper, not a developer: do not clear cache, do not use your fast office connection, and actually try to buy.",
      },
      {
        type: "paragraph",
        text: "Then confirm with data. For every defect you felt, check whether the funnel numbers support it: does the PDP-to-cart rate on mobile Safari actually lag Chrome? Does checkout completion differ by country? A felt problem with no data behind it goes on the low-priority list; a data problem you could not feel goes straight to session recordings to find out why.",
      },
      {
        type: "heading",
        text: "The app audit nobody does",
      },
      {
        type: "paragraph",
        text: "Every app that injects storefront UI should pass three tests: it loads without shifting layout, it never covers a purchase CTA at any viewport width, and removing it does not measurably reduce conversion. Most stores have at least one app failing all three. The fix is often not removal but configuration — rendering an upsell below the CTA instead of as an overlay, or deferring a widget until after the page is interactive.",
      },
      {
        type: "paragraph",
        text: "Run the audit with a spreadsheet, not from memory: one row per app, columns for what it injects, which templates it touches, what it costs per month, and when it was last reviewed. The review date column is the one that matters — apps are updated constantly, and an app that was harmless at install can become a leak after an update changes where or when it renders.",
      },
      {
        type: "heading",
        text: "Leak-fixing checklist",
      },
      {
        type: "list",
        items: [
          "Walk the full purchase path on real mid-range mobile hardware, not a simulator",
          "Check every injected widget for layout shift and CTA overlap at 360px, 390px, and 768px widths",
          "Show duties, taxes, and shipping estimates before checkout for international shoppers",
          "Test every variant and option combination on mobile — tap through them all",
          "Segment funnel metrics by browser and device weekly to catch regressions",
          "Re-test after every app install, app update, or theme change",
          "Log every leak found, the fix shipped, and the before/after metric",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "How do I know if my store has conversion leaks? If your mobile conversion rate is less than half your desktop rate, or if any funnel step has fallen over the last 90 days without a traffic change, you have leaks worth hunting.",
      },
      {
        type: "paragraph",
        text: "Are conversion leaks the same as slow page speed? Not exactly. Speed is one cause of leaks, but most of the leaks above are functional or UX defects on fast pages. A store can score well in Lighthouse and still leak revenue through a broken variant picker.",
      },
      {
        type: "paragraph",
        text: "Should I fix leaks myself or hire help? The diagnosis needs device testing, analytics access, and session recordings — any competent in-house marketer can start. The fixes often touch Liquid templates and app configuration, which is where a Shopify specialist pays for itself.",
      },
      {
        type: "paragraph",
        text: "If fixing leaks turns into a recurring workload — as it should, because stores change constantly — an ongoing growth retainer keeps someone accountable for finding and closing them every month.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "How a Hoahwa growth retainer works",
        note: "Continuous CRO, device QA, and app hygiene for Shopify stores that cannot afford silent leaks.",
      },
    ],
  },

  "users-leave-after-3-seconds": {
    title: "Why Users Leave After 3 Seconds: Perceived Speed Fixes",
    excerpt:
      "Shoppers judge your store in three seconds. Perceived speed — instant paint, stable layout, no flashes — matters as much as raw load time.",
    tags: ["eCommerce", "Growth"],
    body: [
      {
        type: "paragraph",
        text: "Shoppers abandon stores in the first three seconds mostly because of perceived speed — whether the page paints something meaningful immediately, whether the layout stays still while it loads, and whether it feels stable and trustworthy — not because of raw load time alone. A store that renders its hero and product information instantly but finishes loading scripts for five more seconds keeps visitors; a store that shows a blank white page for two seconds loses them even if the total load is faster. Fix the first impression, and the bounce problem largely fixes itself.",
      },
      {
        type: "heading",
        text: "What actually happens between one and three seconds",
      },
      {
        type: "paragraph",
        text: "The first three seconds of a page load are a sequence of judgments, not a single wait. At roughly one second the shopper decides whether the site is alive — is anything on screen? Between one and two seconds they decide whether it is credible — does the hero, headline, and price look finished, or is the page visibly assembling itself? Between two and three seconds they decide whether to commit attention — is the layout stable enough to start reading, or are elements still jumping?",
      },
      {
        type: "paragraph",
        text: "Each judgment is about perception, which is why lab scores mislead. A Lighthouse run measures when events fire; a shopper measures whether the page looks done. A blank hero followed by a header that pops in late reads as broken, even when the underlying metrics are acceptable. Font flash — text rendering in a fallback font then snapping to the brand font — reads as cheap. A cookie banner or app badge that shoves the buy button downward at the two-second mark reads as unstable. None of these are captured by \u201cthe page loaded in 2.4 seconds.\u201d",
      },
      {
        type: "heading",
        text: "The difference between fast and feels-fast",
      },
      {
        type: "paragraph",
        text: "Real speed and perceived speed are related but different budgets. Real speed is bytes, requests, and main-thread time. Perceived speed is what the shopper sees while those bytes arrive. You can spend your entire performance budget improving metrics the shopper never notices — trimming 200ms off a script that runs after paint — while the first screen still looks broken for a second and a half.",
      },
      {
        type: "list",
        items: [
          "Meaningful first paint: the hero image or product media appears first, not the footer or a carousel three screens down",
          "Stable skeleton: the layout's final shape is reserved immediately, so nothing moves as content arrives",
          "No font flash: brand fonts are preloaded or configured to swap invisibly",
          "No late surprises: banners, badges, and app UI render in reserved space instead of shoving content around",
          "Responsive first interaction: the first tap or scroll the shopper attempts actually works",
        ],
      },
      {
        type: "heading",
        text: "Perceived-speed fixes that work on Shopify",
      },
      {
        type: "paragraph",
        text: "Preload the critical hero asset. On most Shopify PDPs and homepages, one image dominates the first screen. Marking it as a preload with the correct responsive sizes tells the browser to fetch it before anything else, which directly moves the moment the page feels alive. Serving that image at the actual rendered dimensions — not a 2400px original scaled down by CSS — removes both weight and decode time.",
      },
      {
        type: "paragraph",
        text: "Reserve space for everything dynamic. Promotion badges, review stars, sticky headers, and announcement bars should occupy their final dimensions from the first frame, using aspect-ratio boxes and min-heights, so late-loading content fills a gap instead of creating one. Kill full-screen loaders for returning visitors; a loader that appears on every session trains repeat customers — your most valuable segment — to expect a wait. And ship skeleton states that match the final layout: a grey box the same shape as the product card feels like progress, while a spinner in a vacuum feels like failure.",
      },
      {
        type: "paragraph",
        text: "Finally, protect the first interaction. The first thing a shopper on a PDP tries to do is usually tap a variant, a thumbnail, or the add-to-cart button. If long JavaScript tasks from apps and analytics are occupying the main thread at that moment, the tap queues and the page feels dead. Deferring everything non-essential until after the page is interactive is as much a perceived-speed fix as any image optimisation.",
      },
      {
        type: "heading",
        text: "Three-second audit checklist",
      },
      {
        type: "list",
        items: [
          "Film the first three seconds of your PDP and homepage on throttled 4G, frame by frame",
          "Note the exact moment the hero or product media becomes visible",
          "Check for layout movement in the first three seconds and identify what caused it",
          "Confirm brand fonts load without a visible fallback snap",
          "Verify the first tap a shopper is likely to make responds immediately",
          "Remove or defer any loader, splash, or intro animation on the purchase path",
          "Re-test on a real mid-range phone, not only in devtools throttling",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "Is three seconds really a hard cutoff? No — abandonment rises continuously as load time grows; three seconds is a useful rule of thumb, not a cliff. The practical takeaway is that the first moments carry the most judgment, so they deserve the most engineering.",
      },
      {
        type: "paragraph",
        text: "Does perceived speed replace Core Web Vitals work? No — they complement each other. Perceived speed fixes usually improve LCP and CLS as a side effect, because preloading the hero and reserving layout space are exactly what those metrics reward.",
      },
      {
        type: "paragraph",
        text: "What is the cheapest high-impact fix? Preloading the hero image and reserving space for dynamic elements. Both are small template changes on Shopify, both ship in a day, and both attack the exact window where shoppers decide to stay or leave.",
      },
      {
        type: "paragraph",
        text: "If your theme was assembled from apps and sections over the years, these fixes often fight the theme's architecture. That is the point where a purpose-built theme stops being a luxury.",
      },
      {
        type: "cta",
        href: "/shopify-theme-builds",
        label: "See how Hoahwa builds Shopify themes",
        note: "Custom themes engineered for perceived speed: preloaded heroes, reserved layout, zero surprise shifts.",
      },
    ],
  },

  "payment-compliance-scale": {
    title: "Shopify Payment Compliance as Your Brand Scales",
    excerpt:
      "Scaling a Shopify brand changes your payment compliance surface: PCI scope, local payment methods, fraud rules, and checkout extensions all get stricter.",
    tags: ["Shopify"],
    body: [
      {
        type: "paragraph",
        text: "Payment compliance matters more as a Shopify brand scales because growth expands every part of your compliance surface at once: new markets bring local payment methods and tax rules, higher volume brings stricter fraud and chargeback scrutiny, and more checkout customisation brings more PCI and platform-policy scope to manage. Shopify handles card data security at the core, but everything you add around that core — checkout extensions, scripts, apps, and regional configurations — is your responsibility to keep documented, supported, and legal in every market you sell into.",
      },
      {
        type: "heading",
        text: "What Shopify covers and what remains yours",
      },
      {
        type: "paragraph",
        text: "Shopify is certified PCI DSS Level 1 compliant, which means card data entered into Shopify's checkout is handled within Shopify's certified environment. That is a genuine and large relief: you are not storing, processing, or transmitting raw card numbers. But PCI scope is not zero. Anything that touches the checkout experience — a custom script, an app that injects fields, an analytics tag on the checkout pages, a custom payment integration — can pull pieces of the flow back into your scope or, worse, violate the platform's checkout rules.",
      },
      {
        type: "paragraph",
        text: "The practical rule: keep payment flows on Shopify's supported surfaces. Checkout UI extensions and Shopify Functions are the sanctioned customisation layer; they run in Shopify's controlled environment and survive platform updates. Legacy checkout.liquid customisations and script hacks do not — and a payment flow that breaks after a platform update, or that silently stops collecting required consent, is a compliance incident, not just a bug.",
      },
      {
        type: "heading",
        text: "How scaling changes the compliance surface",
      },
      {
        type: "paragraph",
        text: "New markets. Every country you add brings its own payment expectations — iDEAL in the Netherlands, Blik in Poland, cash-on-delivery segments in parts of Asia — and its own rules about tax display, invoicing, and consumer rights. A store that shows a compliant price to a US shopper can be non-compliant to a German one if duties and VAT handling are ambiguous. Local payment methods are not just conversion features; in many markets they are the difference between a trusted checkout and an abandoned one.",
      },
      {
        type: "paragraph",
        text: "Higher volume. Card networks and payment providers monitor chargeback ratios, and the thresholds that are invisible at low volume become account-threatening at scale. A fraud pattern that costs you a few orders a month at launch can trigger reserves, higher fees, or processing restrictions once you are doing real volume. Fraud rules, 3-D Secure configuration, and clear billing descriptors stop being optional hygiene and become operational requirements.",
      },
      {
        type: "paragraph",
        text: "More customisation. Every checkout extension, upsell, and script you add is another component that must be reviewed when rules change, another data flow to document, and another thing that can break silently. Scale means the number of these grows — which is exactly why the next section exists.",
      },
      {
        type: "heading",
        text: "Subscriptions, wallets, and B2B each add their own rules",
      },
      {
        type: "paragraph",
        text: "Growth also tends to add payment models beyond one-off card charges, and each carries distinct obligations. Subscriptions require clear consent, renewal disclosure, and easy cancellation — requirements enforced by consumer-protection rules in many markets, and by card-network policies everywhere. Express wallets such as Shop Pay, Apple Pay, and PayPal improve conversion but must be tested per market and per device, because availability and behaviour differ. B2B on Shopify Plus adds net payment terms and invoicing, which moves part of your risk from chargebacks to credit: overdue invoices are a finance problem, not a fraud one, and they need their own approval and limits process.",
      },
      {
        type: "paragraph",
        text: "The pattern across all of these is the same: the feature is easy to switch on, and the obligation arrives quietly behind it. Treat every new payment method or model as a small compliance project — a configuration review, a test purchase in each market, and a line in the register — rather than a toggle.",
      },
      {
        type: "heading",
        text: "A compliance habit, not a compliance project",
      },
      {
        type: "list",
        items: [
          "Maintain a register of every checkout extension, payment app, and script: what it does, who owns it, when it was last reviewed",
          "Review Shopify Payments availability and local method coverage before entering any new market",
          "Localise tax, duty, and returns messaging before launch, not after the first complaint",
          "Test the full payment flow — including wallets like Apple Pay and Shop Pay — in every market you actively sell to",
          "Monitor chargeback rates monthly and investigate any step-change before your processor does",
          "Re-review all checkout customisations after every Shopify platform update",
          "Document consent and data flows on checkout pages for the privacy regimes you operate under",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "Do I need to do anything for PCI compliance on Shopify? Shopify's certified environment covers card data in the standard checkout, so for most stores the obligation is to keep customisations on supported surfaces and avoid anything that touches raw card data. Your acquirer will still ask you to attest annually, which is far simpler when your customisations are documented.",
      },
      {
        type: "paragraph",
        text: "When do local payment methods become worth adding? Add them when a market represents meaningful order volume or when abandonment data shows local shoppers leaving at payment selection. Check Shopify Payments' supported methods per country first — many are a configuration toggle, not an integration.",
      },
      {
        type: "paragraph",
        text: "What is the biggest compliance mistake scaling brands make? Treating checkout customisation as a free-for-all. Undocumented scripts and apps accumulate until nobody knows what touches the payment flow, and a platform update or a market expansion turns that unknown into an incident.",
      },
      {
        type: "paragraph",
        text: "If your checkout has accumulated years of extensions and nobody can say what half of them do, that inventory is the first thing a proper store audit produces.",
      },
      {
        type: "cta",
        href: "/audits",
        label: "Get a checkout and app audit",
        note: "We inventory every checkout extension and app, flag compliance and platform-policy risk, and prioritise the clean-up.",
      },
    ],
  },

  "no-premade-themes": {
    title: "Custom vs Pre-Made Shopify Themes: When to Build Custom",
    excerpt:
      "Pre-made Shopify themes trade speed-to-launch for long-term rigidity. Here is the honest case for custom themes — and when a pre-made one is actually fine.",
    tags: ["Tech Integration", "Growth", "Shopify"],
    body: [
      {
        type: "paragraph",
        text: "A custom Shopify theme beats a pre-made theme for established brands because pre-made themes bundle hundreds of opinions — about navigation, merchandising, performance, and which apps you need — that were designed for an average store, not for your catalogue, your content model, or your growth roadmap. You pay for the mismatch in conversion friction, in performance weight from features you never use, and eventually in a rebuild. Pre-made themes are the right choice for validating a new store; they are the wrong choice for scaling one.",
      },
      {
        type: "heading",
        text: "What a pre-made theme actually is",
      },
      {
        type: "paragraph",
        text: "A pre-made theme is a product built to sell to as many stores as possible. That commercial goal shapes everything about it. It ships with dozens of sections and features because feature lists sell themes — mega menus, lookbooks, countdown timers, popups, tabs, badges — and most stores use a fraction of them. But the fraction you do not use still ships to the browser: the CSS, the JavaScript, the section schemas, and the template weight are there whether or not you enabled the feature.",
      },
      {
        type: "paragraph",
        text: "It also encodes an opinion about what a store looks like. Navigation assumes a certain catalogue shape. Product pages assume a certain content model. When your catalogue does not match — you sell configurable bundles, or your products need comparison tables, or your merchandising is editorial rather than grid-based — you have two options: force your content into the theme's shape, or bolt on apps to patch the gaps. Both roads end at the same place: a store that works around its theme instead of being served by it.",
      },
      {
        type: "heading",
        text: "The hidden costs of app-patching a theme",
      },
      {
        type: "paragraph",
        text: "Every gap between a pre-made theme and your needs gets filled by an app, and every app is a recurring cost in three currencies. Money: monthly fees that quietly add up. Performance: injected scripts and layout shifts on every page. Fragility: each app is a dependency that can break, conflict, or be abandoned, and your checkout path inherits all of that risk. A store five years into app-patching often cannot answer a simple question — what happens to the product page if this app disappears? — which means it no longer fully owns its own storefront.",
      },
      {
        type: "list",
        items: [
          "Unused features still ship weight to every visitor on every page",
          "App patches stack into fragility nobody can fully map",
          "Theme updates arrive on the vendor's schedule, not yours, and can break your customisations",
          "Conversion decisions were made for an average store, not your customers",
          "Performance ceilings: you can optimise a heavy theme, but you cannot make it lean",
        ],
      },
      {
        type: "heading",
        text: "What a custom build actually buys you",
      },
      {
        type: "paragraph",
        text: "A custom theme inverts the relationship: instead of adapting your business to the theme, the theme is built around your business. Metafields and sections are designed for your actual products, so merchandisers publish without workarounds. JavaScript is written for your actual features, so nothing ships that you do not use — which is why custom themes are consistently faster: leanness is an architecture, not an optimisation pass. And the codebase is documented and handed over cleanly, so your in-house team or any future partner can work on it without reverse-engineering a vendor's framework.",
      },
      {
        type: "paragraph",
        text: "The deeper benefit is that conversion work becomes possible. On a pre-made theme, a CRO hypothesis like \u201cwhat if the size selector showed availability inline\u201d hits the wall of \u201cthe theme does not support that.\u201d On a custom theme, the answer is a template change. Over a year of experimentation, that difference compounds into a meaningful revenue gap.",
      },
      {
        type: "heading",
        text: "When a pre-made theme is the right call",
      },
      {
        type: "paragraph",
        text: "Honesty requires the other side. If you are launching a new store, testing a product line, or operating below the revenue where a build pays for itself, a good pre-made theme with disciplined app hygiene is the correct choice. The mistake is not using a pre-made theme; it is staying on one long after the mismatch costs exceed the build cost, or app-patching it into a fragile mess instead of making the clean break.",
      },
      {
        type: "heading",
        text: "Build-vs-buy checklist",
      },
      {
        type: "list",
        items: [
          "List the apps that exist only to patch theme gaps and total their monthly cost",
          "Measure your theme's shipped JavaScript and CSS against the features you actually use",
          "Count the merchandising workarounds your team performs weekly",
          "List the CRO tests you shelved because the theme could not support them",
          "Estimate annual cost of the status quo: app fees plus lost conversion plus developer time spent fighting the theme",
          "If that number approaches build cost, commission a custom theme; if not, tighten app hygiene and revisit in a year",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "Are all pre-made themes bad? No — the best of them are well-engineered, and for early-stage stores they are the fastest route to a professional storefront. The argument is about fit at scale, not quality in the abstract.",
      },
      {
        type: "paragraph",
        text: "Can we just heavily customise a pre-made theme instead? Heavy customisation of a pre-made theme is usually the worst of both worlds: you pay build-like costs on top of an architecture designed for someone else, and you inherit the weight and update fragility anyway.",
      },
      {
        type: "paragraph",
        text: "How long does a custom theme take? A properly scoped build — design, Liquid development, QA across devices, and migration — is measured in weeks, not months, when the content model is decided up front. The scoping conversation is where most of the value is created.",
      },
      {
        type: "paragraph",
        text: "If you are weighing this decision, the fastest way to a real answer is a scoping conversation with the people who would actually build it.",
      },
      {
        type: "cta",
        href: "/shopify-theme-builds",
        label: "See Hoahwa's custom theme builds",
        note: "Lean, documented Shopify themes built around your catalogue and content model — no unused features, no app crutches.",
      },
    ],
  },

  "core-web-vitals-2026": {
    title: "Core Web Vitals for Shopify in 2026: LCP, INP, CLS Explained",
    excerpt:
      "Core Web Vitals in 2026: LCP \u22642.5s, INP \u2264200ms, CLS \u22640.1 at the 75th percentile of real users. What fails on Shopify stores and how to fix it.",
    tags: ["Tech Integration", "Growth", "Shopify"],
    body: [
      {
        type: "paragraph",
        text: "Core Web Vitals are Google's three user-experience metrics — Largest Contentful Paint (LCP, good is 2.5 seconds or less), Interaction to Next Paint (INP, good is 200 milliseconds or less), and Cumulative Layout Shift (CLS, good is 0.1 or less) — measured at the 75th percentile of your real users. In 2026, what matters is field data from actual visitors, not lab scores: a Shopify store passes or fails based on how it performs for real shoppers on real phones, and the most common failures come from theme JavaScript, late-injected apps, and unreserved layout space.",
      },
      {
        type: "heading",
        text: "The three metrics, in plain terms",
      },
      {
        type: "paragraph",
        text: "LCP measures loading: when the largest element on screen — on Shopify, almost always the hero image or product photo — finishes painting. INP measures responsiveness: how long the page takes to visually respond after a tap, click, or keypress, considering the worst interactions of the visit. CLS measures stability: how much the layout unexpectedly moves while the page loads and the shopper uses it.",
      },
      {
        type: "paragraph",
        text: "Two details matter more than the definitions. First, thresholds are judged at the 75th percentile, which means your store must be good for most visitors, not just for the developer's fibre connection. Second, Google evaluates the metrics from the Chrome User Experience Report or your own real-user monitoring — field data. A Lighthouse score of 95 on your laptop tells you almost nothing about whether your store passes, and Search Console's Core Web Vitals report is the source of truth for what Google sees.",
      },
      {
        type: "heading",
        text: "How Shopify stores actually fail",
      },
      {
        type: "paragraph",
        text: "LCP failures are usually unoptimised hero and product images: originals uploaded at print resolution, no responsive sizing, and no preload hint, so the browser discovers the most important image last. Occasionally the culprit is render-blocking third-party scripts delaying all paint.",
      },
      {
        type: "paragraph",
        text: "INP failures are usually JavaScript contention. Cart drawers, predictive search, sliders, and app widgets all competing for the main thread means the shopper's tap waits in a queue. The classic symptom: tapping a variant or the cart icon on a phone produces a visible pause before anything happens. Theme code is often innocent here — the queue is usually built by accumulated app scripts.",
      },
      {
        type: "paragraph",
        text: "CLS failures are usually injected UI without reserved space. Cookie banners, announcement bars, review stars, loyalty widgets, and app badges that render a beat after the content they sit near. Each one is small; the shopper experiences the page as a thing that will not sit still.",
      },
      {
        type: "heading",
        text: "A field-first measurement approach",
      },
      {
        type: "list",
        items: [
          "Read Search Console's Core Web Vitals report by page group — homepage, collection, PDP — not as one sitewide number",
          "Monitor CrUX data or your own RUM by template and device, since mobile PDPs usually fail first",
          "Reproduce failures in lab tools (Lighthouse, WebPageTest) only to diagnose, never to declare victory",
          "Treat every third-party script as a performance budget line item with an owner",
          "Fix regressions within the release cycle that caused them, before they reach the 28-day field window",
        ],
      },
      {
        type: "heading",
        text: "Fixes in order of leverage",
      },
      {
        type: "paragraph",
        text: "For LCP: serve responsive images at rendered dimensions, preload the hero or main product image, and strip render-blocking scripts from the head. For INP: audit app scripts and remove or defer anything not needed on the purchase path, and break up long theme JavaScript tasks so taps get answered. For CLS: reserve space for everything that loads late — aspect-ratio boxes on images, min-heights on banners and badge containers — so late content fills gaps instead of pushing things.",
      },
      {
        type: "paragraph",
        text: "None of these are exotic. What makes them hard on Shopify is that the responsibility is split between theme code you control and app code you mostly do not — which is why the app audit is inseparable from vitals work.",
      },
      {
        type: "heading",
        text: "Core Web Vitals checklist",
      },
      {
        type: "list",
        items: [
          "Confirm your store's status in Search Console's Core Web Vitals report, mobile and desktop separately",
          "Identify the worst template group and pull its field data for the last 28 days",
          "Preload the LCP element on homepage, collection, and PDP templates",
          "Inventory app scripts and remove or defer everything off the purchase path",
          "Reserve layout space for all injected banners, badges, and widgets",
          "Set up real-user monitoring so regressions surface in days, not after ranking damage",
          "Re-check field data 28 days after each fix — that is how long the judgment window takes to move",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "Do Core Web Vitals directly affect rankings? Yes, as one signal among many, and mostly as a tiebreaker between otherwise comparable pages. The larger effect is indirect: the same failures that hurt vitals hurt conversion, so fixing them pays twice.",
      },
      {
        type: "paragraph",
        text: "Why did my Lighthouse score improve but Search Console still says I fail? Lighthouse is a lab test on one simulated device; Search Console reports field data from your real visitors at the 75th percentile over 28 days. Improve the real experience, then wait for the field window to catch up.",
      },
      {
        type: "paragraph",
        text: "Can a Shopify store actually pass on mobile? Yes — stores with lean themes, disciplined app stacks, and properly sized images pass routinely. The stores that fail are usually running heavy themes plus a dozen injected scripts, which is an architecture problem with a known fix.",
      },
      {
        type: "paragraph",
        text: "If your vitals failures trace back to theme weight and app sprawl, the fix is structural, and it starts with a clear picture of what your storefront actually ships.",
      },
      {
        type: "cta",
        href: "/audits",
        label: "Get a performance audit",
        note: "Field-data vitals analysis by template, an app script inventory, and a fix list ordered by leverage.",
      },
    ],
  },

  "shopify-plus-growth-strategy": {
    title: "Shopify Plus Growth Strategy for DTC Brands (2026)",
    excerpt:
      "Shopify Plus unlocks checkout extensibility, B2B, and scale — but growth comes from merchandising speed, retention, and CRO. The 2026 playbook.",
    tags: ["Growth", "Shopify"],
    body: [
      {
        type: "paragraph",
        text: "A Shopify Plus growth strategy uses the platform's Plus-specific capabilities — checkout extensibility, B2B tooling, higher API limits, and expansion stores — to ship merchandising, retention, and localisation faster than competitors, not to collect features. The brands that win on Plus in 2026 treat the licence as velocity infrastructure: segmented landing pages per channel in days, lifecycle flows tied to on-site behaviour, and local storefronts launched without re-architecting. The brands that waste it bought a faster engine and never left the driveway.",
      },
      {
        type: "heading",
        text: "What Plus actually changes",
      },
      {
        type: "paragraph",
        text: "Strip away the sales material and Plus changes four things that matter for growth. Checkout extensibility lets you customise the highest-intent page of your store — upsells, trust messaging, delivery options — on supported, upgrade-safe surfaces. B2B tooling lets you run wholesale from the same admin as retail, with company-specific catalogues and payment terms. Higher API and automation capacity (including Shopify Flow) removes the operational ceiling that punishes standard-plan stores at volume. And expansion stores plus market tooling make multi-region selling an administrative task instead of a platform migration.",
      },
      {
        type: "paragraph",
        text: "None of these grow revenue by existing. Each one removes a specific bottleneck, and the strategy is to know which bottleneck is yours before you use the feature. Checkout customisation matters when checkout completion is your leak. B2B matters when wholesale enquiries are arriving anyway. Expansion stores matter when international demand is proven and the cost is localisation, not demand generation.",
      },
      {
        type: "heading",
        text: "The four growth levers that pay on Plus",
      },
      {
        type: "list",
        items: [
          "Merchandising velocity: segmented landing pages per acquisition channel, built from reusable sections, live in days rather than weeks",
          "Retention economics: lifecycle flows tied to real on-site behaviour — what was viewed, added, and abandoned — instead of batch-and-blast",
          "Localisation: local payment methods, duties shown up front, and regional storefronts that make international shoppers feel domestic",
          "Continuous CRO: a standing experiment pipeline on PDP and checkout templates, because Plus's checkout extensibility finally makes checkout testable",
        ],
      },
      {
        type: "paragraph",
        text: "Notice that three of the four are speed disciplines, not platform features. The platform's job is to not slow you down; the growth job is shipping campaigns, learning from them, and compounding. This is why the highest-leverage Plus investment is often not another feature but delivery capacity — a team that can turn an idea into a measured page inside a week.",
      },
      {
        type: "heading",
        text: "A 2026 operating cadence",
      },
      {
        type: "paragraph",
        text: "Weekly: ship one merchandising or landing page change and review funnel metrics by device and template. Monthly: run at least one structured experiment with a single primary metric, review retention cohorts, and audit the app stack for drift. Quarterly: evaluate one structural bet — a new market, a B2B programme, a checkout extension build — with real numbers from the previous quarter, not enthusiasm.",
      },
      {
        type: "paragraph",
        text: "The cadence matters more than any individual initiative. Plus brands that grow consistently are rarely doing anything exotic; they are doing ordinary CRO and merchandising at a cadence their competitors cannot match, on infrastructure that does not fight them. If the weekly rhythm is unsustainable with your current team, that delivery gap is what to close first.",
      },
      {
        type: "heading",
        text: "Common ways Plus budgets get wasted",
      },
      {
        type: "paragraph",
        text: "Buying Plus before the bottleneck justifies it — the licence is overhead until checkout, B2B, or expansion is your actual constraint. Customising checkout without measuring, which turns the most dangerous page of your store into an uninstrumented experiment. And staffing the platform with generalists: Plus features reward specialists who know which surfaces are supported and which hacks will break at the next platform update.",
      },
      {
        type: "paragraph",
        text: "A quieter waste is feature-collecting without adoption: launching B2B without training the sales team on it, enabling markets without localising the content, or building checkout extensions that merchandising never learns to update. Every Plus capability needs an internal owner and a place in the weekly cadence, or it becomes shelfware with a licence fee attached. When you evaluate a feature, ask who will run it every week — if the answer is nobody, the honest decision is not yet.",
      },
      {
        type: "heading",
        text: "Plus growth checklist",
      },
      {
        type: "list",
        items: [
          "Identify your current bottleneck — checkout, retention, international, or B2B — before touching any Plus feature",
          "Stand up segmented landing pages for your top two acquisition channels",
          "Connect on-site behaviour events to your lifecycle email and SMS flows",
          "Audit checkout completion and test one checkout extension against control",
          "If selling internationally, confirm local payment methods and up-front duties per market",
          "Set a weekly ship-and-measure cadence and protect it",
          "Review Plus ROI quarterly against the bottleneck you bought it to remove",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "When is upgrading to Plus worth it? When at least one Plus capability addresses a measured bottleneck — checkout customisation for a checkout leak, B2B tooling for real wholesale demand, or expansion stores for proven international volume. Upgrading for status or \u201cfuture-proofing\u201d rarely pays.",
      },
      {
        type: "paragraph",
        text: "Is Plus necessary for international selling? No — standard plans sell internationally via Markets. Plus adds expansion stores and finer control, which matter when you need genuinely separate regional storefronts, not before.",
      },
      {
        type: "paragraph",
        text: "What is the first thing to do after upgrading? Instrument everything. Plus makes more of your store customisable, which makes more of your store breakable and testable. Clean analytics on checkout and funnel steps is the foundation every other Plus play stands on.",
      },
      {
        type: "paragraph",
        text: "If the strategy is clear but the delivery capacity is not — pages that wait weeks, tests that never ship — that gap is exactly what a growth retainer exists to close.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "See Hoahwa's growth retainers",
        note: "Weekly shipping cadence, CRO experiments, and Plus-specific engineering for DTC brands that measure.",
      },
    ],
  },

  "shopify-rollouts-ab-testing": {
    title: "Shopify Rollouts: Native A/B Testing Done Right",
    excerpt:
      "Shopify Rollouts brings native A/B testing to themes. Most brands will still misuse it. The process that turns native testing into learning, not noise.",
    tags: ["A/B Testing", "Shopify", "Growth"],
    body: [
      {
        type: "paragraph",
        text: "Shopify Rollouts brings native A/B testing into the platform, letting you publish theme variants to a share of traffic without third-party testing tools — but the tool was never the bottleneck. Most brands will still misuse it by running overlapping tests, changing too many variables at once, and calling winners before the data supports it. Native testing removes the integration cost of experimentation; it does not replace the discipline — one hypothesis, one primary metric, adequate sample, documented decision — that makes an experiment produce learning instead of noise.",
      },
      {
        type: "heading",
        text: "What Rollouts changes and what it does not",
      },
      {
        type: "paragraph",
        text: "Before native rollouts, A/B testing on Shopify meant third-party scripts that flickered, app-based content swapping, or server-side hacks — each with real costs in performance and accuracy. A testing script that delays paint to decide which variant to show corrupts the very metric you are testing. Rollouts moves the split into the platform: the variant ships as a theme state, the traffic split happens natively, and the flicker problem largely disappears.",
      },
      {
        type: "paragraph",
        text: "What it does not change is statistics, design, or interpretation. A bad hypothesis tested natively is still a bad test. A test stopped after three days because the variant \u201clooks like it is winning\u201d is still noise, regardless of how cleanly the variants were served. The tooling got easier; the thinking did not.",
      },
      {
        type: "heading",
        text: "The four failure modes of casual testing",
      },
      {
        type: "list",
        items: [
          "Too many variables: the variant changes the hero, the CTA, and the layout, so a win teaches you nothing about what worked",
          "Overlapping tests: two experiments on the same page contaminate each other's data and both become unreadable",
          "Early stopping: calling a winner at the first green day guarantees that luck, not signal, decides your roadmap",
          "No decision record: the test ends, nobody writes down what was decided or why, and the same question gets tested again next quarter",
        ],
      },
      {
        type: "paragraph",
        text: "Each failure mode has the same root: treating the test as the work instead of the decision as the work. The test is cheap — that is what Rollouts gives you. The hypothesis, the measurement plan, and the decision discipline are where the value lives.",
      },
      {
        type: "heading",
        text: "A testing process that fits inside Shopify",
      },
      {
        type: "paragraph",
        text: "Every test starts with a written hypothesis in the form \u201cchanging X will improve metric Y for segment Z, because reason.\u201d The reason matters: it is what converts a lost test into learning. One primary metric is declared before launch — add-to-cart rate, checkout completion, revenue per session — and secondary metrics are watched for harm, not cherry-picked for victory. Sample size and duration are set before launch too: enough traffic for the effect you are hoping to detect, and at least one full weekly cycle so weekday and weekend behaviour are both represented.",
      },
      {
        type: "paragraph",
        text: "Control and variant are documented in the theme changelog as you would document any release, because that is what they are. When the test concludes, the decision is one of three: ship the winner into the main theme promptly, keep the control and record the null result, or rerun with a sharper hypothesis. All three are outcomes; the only failure is a test that ends with no decision written down.",
      },
      {
        type: "heading",
        text: "What to test first",
      },
      {
        type: "paragraph",
        text: "Start where traffic and intent are highest and the theme makes testing easy: PDP templates. Variant selector design, delivery and returns messaging placement, and media order are all single-variable changes with clear metrics. Collection pages come next — sort order, filter prominence, tile information density. Resist testing the homepage hero first; it is the most visible page and usually the least consequential, because most buying journeys do not start there.",
      },
      {
        type: "paragraph",
        text: "Bake winners into the main theme promptly. A variant that wins and then runs for three more months as a rollout is not a victory lap; it is unclaimed revenue on the control share and uncollected simplicity in your theme. And review losing variants qualitatively before discarding them — a session recording of shoppers ignoring your clever new layout is often more instructive than the win that preceded it.",
      },
      {
        type: "heading",
        text: "Testing discipline checklist",
      },
      {
        type: "list",
        items: [
          "Write the hypothesis, primary metric, and sample plan before creating the rollout",
          "Change one variable per test; if you want to test three ideas, run three tests",
          "Never run overlapping tests on the same template",
          "Commit to the full planned duration; no peeking-and-stopping",
          "Document control and variant in the theme changelog",
          "Ship winners into the main theme within one release cycle",
          "Record every decision — win, loss, or null — in a testing log the whole team can read",
        ],
      },
      {
        type: "heading",
        text: "FAQ",
      },
      {
        type: "paragraph",
        text: "Does native A/B testing replace third-party testing tools? For theme-variant testing, largely yes — it removes the flicker and integration cost that made third-party client-side tools unreliable. Complex personalisation or server-side experiments may still need dedicated tooling.",
      },
      {
        type: "paragraph",
        text: "How long should a test run? Long enough to reach your planned sample size and cover at least one full weekly cycle. On most Shopify stores that means two to four weeks; high-traffic stores can be faster, but duration set by data volume, not impatience, is the rule.",
      },
      {
        type: "paragraph",
        text: "How many tests should we run at once? One per template or funnel step. The limit is rarely tooling; it is the team's capacity to design well and decide honestly. One clean test a month beats four noisy ones.",
      },
      {
        type: "paragraph",
        text: "If you want experimentation to be a system rather than an occasional event — hypotheses from real funnel data, tests shipped weekly, decisions logged — that operating rhythm is what a growth retainer provides.",
      },
      {
        type: "cta",
        href: "/growth-retainers",
        label: "Run experiments with a Hoahwa retainer",
        note: "A standing CRO pipeline for your Shopify store: hypotheses, native rollouts, and decisions that stick.",
      },
    ],
  },
};
