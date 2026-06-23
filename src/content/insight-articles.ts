import type { InsightBlock, InsightsDatabase } from "@/lib/insights-types";

function body(
  excerpt: string,
  sections: Array<{
    heading?: string;
    paragraphs?: string[];
    list?: string[];
  }>,
): { excerpt: string; body: InsightBlock[] } {
  const blocks: InsightBlock[] = [];
  for (const section of sections) {
    if (section.heading) {
      blocks.push({ type: "heading", text: section.heading });
    }
    for (const text of section.paragraphs ?? []) {
      blocks.push({ type: "paragraph", text });
    }
    if (section.list?.length) {
      blocks.push({ type: "list", items: section.list });
    }
  }
  return { excerpt, body: blocks };
}

const articles: InsightsDatabase["posts"] = [
  {
    slug: "why-slow-websites-hurt-engagement",
    title: "Why Slow Websites Hurt User Engagement More Than You Realise",
    date: "Jun 2, 2026",
    tags: ["eCommerce", "Growth"],
    ...body(
      "Speed is not a technical nice-to-have — it is the first impression your storefront makes. When pages lag, shoppers do not complain; they simply leave.",
      [
        {
          paragraphs: [
            "Every hundred milliseconds of delay erodes trust. On Shopify, that delay often comes from bloated themes, unoptimised images, third-party scripts, and sections that were never built for your actual catalogue size.",
          ],
        },
        {
          heading: "Engagement drops before conversion does",
          paragraphs: [
            "Analytics typically show session depth and scroll rate falling well before checkout abandonment spikes. Users who wait on a hero image or a sluggish collection filter rarely reach product detail pages with intent intact.",
            "Brands that treat performance as a post-launch task pay twice: once in lost revenue, and again when retrofitting a theme that was never engineered for speed.",
          ],
        },
        {
          heading: "What to fix first",
          list: [
            "Audit LCP on homepage, collection, and PDP templates",
            "Defer non-critical apps and marketing pixels",
            "Serve responsive images with correct dimensions",
            "Reduce layout shift from late-loading carousels and badges",
          ],
        },
      ],
    ),
  },
  {
    slug: "cross-browser-compatibility-page-speed",
    title:
      "How to Achieve Flawless Cross-Browser Compatibility and Fast Page Speed",
    date: "Jun 1, 2026",
    tags: ["Tech Integration", "eCommerce"],
    ...body(
      "A fast site in Chrome on a MacBook is not a fast site for everyone. Cross-browser QA and performance tuning belong in the same sprint.",
      [
        {
          paragraphs: [
            "Safari, mobile Chrome, and in-app browsers each handle fonts, video, and lazy-loading differently. Issues that never appear in local dev often surface on real devices — especially on mid-range Android hardware.",
          ],
        },
        {
          heading: "Build for the slowest reasonable device",
          paragraphs: [
            "We benchmark on throttled 4G and low-end mobile profiles before sign-off. Custom Liquid sections should avoid layout thrashing, excessive DOM depth, and JavaScript that blocks paint.",
          ],
        },
        {
          heading: "Compatibility checklist",
          list: [
            "Test checkout and account flows in Safari iOS",
            "Validate sticky headers and modals with dynamic viewport units",
            "Confirm payment wallets render in embedded browsers",
            "Run automated visual regression on key templates",
          ],
        },
      ],
    ),
  },
  {
    slug: "direct-collaboration-agency-overhead",
    title: "The Power of Direct Collaboration: Cutting the Agency Overhead",
    date: "May 30, 2026",
    tags: ["Growth", "eCommerce"],
    ...body(
      "Layered agency models add handoffs, reinterpretation, and delay. Direct collaboration with senior builders keeps decisions close to the codebase.",
      [
        {
          paragraphs: [
            "When strategy, design, and development sit behind multiple account layers, small UX improvements wait weeks for alignment. Direct access to the people shipping code shortens feedback loops and preserves intent.",
          ],
        },
        {
          heading: "Fewer layers, clearer ownership",
          paragraphs: [
            "Hoahwa works as an embedded growth and build partner: one team accountable for theme architecture, CRO experiments, and delivery quality. You speak to the people editing Liquid, not a relay chain.",
          ],
          list: [
            "Faster iteration on landing pages and campaigns",
            "Technical decisions explained in business terms",
            "Roadmaps tied to measurable outcomes, not billable hours",
          ],
        },
      ],
    ),
  },
  {
    slug: "designing-for-web-awards-ui-patterns",
    title:
      "Designing for Web Awards: Aesthetic Best Practices and Modern UI Patterns",
    date: "May 28, 2026",
    tags: ["eCommerce", "Growth"],
    ...body(
      "Award-worthy commerce sites balance editorial craft with ruthless clarity. Motion and typography should guide — never decorate for its own sake.",
      [
        {
          paragraphs: [
            "Judges and users alike reward sites that feel intentional: consistent spacing systems, confident typography, and photography treated as part of the layout — not dropped into a generic grid.",
          ],
        },
        {
          heading: "Patterns that age well",
          list: [
            "Editorial hero blocks with clear primary actions",
            "Restrained motion tied to scroll or interaction",
            "High-contrast type scales that work on mobile",
            "Product storytelling that does not sacrifice findability",
          ],
        },
        {
          paragraphs: [
            "The best award contenders still convert. We design for both panels — brand teams and performance dashboards — so beauty and revenue move together.",
          ],
        },
      ],
    ),
  },
  {
    slug: "slow-shopify-stores-revenue",
    title: "Why Slow Shopify Stores Hurt Revenue More Than Most Brands Realise",
    date: "May 21, 2026",
    tags: ["eCommerce", "Growth"],
    ...body(
      "Shopify makes launch easy; it does not automatically make your storefront fast. Slow experiences tax every paid click you buy.",
      [
        {
          paragraphs: [
            "Paid media amplifies whatever experience waits on the other side of the ad. When PLPs and PDPs load slowly, ROAS drops even if creative performs — because the landing experience fails the click.",
          ],
        },
        {
          heading: "Revenue impact by funnel stage",
          list: [
            "Homepage LCP delays reduce exploration depth",
            "Slow filters increase bounce on collection pages",
            "Heavy PDP galleries delay add-to-cart on mobile",
            "Checkout scripts inflate INP and abandon rates",
          ],
        },
        {
          paragraphs: [
            "Treat speed as a growth lever. Instrument Core Web Vitals by template, prioritise fixes by traffic share, and retest after every major theme or app change.",
          ],
        },
      ],
    ),
  },
  {
    slug: "revenue-losing-slow-store",
    title: "How Much Revenue Are You Losing to a Slow Shopify Store?",
    date: "May 18, 2026",
    tags: ["Growth", "Shopify"],
    ...body(
      "Quantifying speed loss turns a vague frustration into a business case. Start with traffic, conversion rate, and AOV — then model conservative uplift.",
      [
        {
          paragraphs: [
            "A store doing £500k monthly with a 2.1% conversion rate loses meaningful revenue if mobile conversion trails desktop by a point. Even a 0.1% absolute lift pays for a focused performance sprint.",
          ],
        },
        {
          heading: "A simple model",
          list: [
            "Segment mobile vs desktop sessions and CVR",
            "Identify templates with worst LCP and highest exit rate",
            "Estimate uplift from industry benchmarks (conservative)",
            "Compare against cost of remediation vs paid media waste",
          ],
        },
      ],
    ),
  },
  {
    slug: "shopify-native-ab-testing",
    title:
      "Shopify's Native A/B Testing Changes Everything (And Why Most CRO Setups Are Now Outdated)",
    date: "May 14, 2026",
    tags: ["A/B Testing", "CRO", "Shopify"],
    ...body(
      "Native rollouts reduce dependency on third-party experimentation stacks — but only if your theme is structured to support clean variants.",
      [
        {
          paragraphs: [
            "Many brands paid for external tools that inject scripts and skew performance. Shopify's native approach keeps experiments closer to the theme — provided sections are modular and analytics are wired correctly.",
          ],
        },
        {
          heading: "What still matters",
          list: [
            "Hypothesis documentation and success metrics",
            "Clean section architecture for variant swaps",
            "Statistical rigour — not peeking at early winners",
            "Post-test implementation without fragmenting the codebase",
          ],
        },
      ],
    ),
  },
  {
    slug: "what-is-shopify-partner",
    title:
      "What Is a Shopify Partner? Benefits, Services & How to Choose the Right One",
    date: "May 13, 2026",
    tags: ["Shopify"],
    ...body(
      "Shopify Partners range from app developers to full-service agencies. The right partner depends on whether you need a theme, a growth programme, or both.",
      [
        {
          paragraphs: [
            "Partners earn credentials through delivered work, not logos alone. Evaluate portfolios for brands at your scale, ask who will own the codebase after launch, and clarify how retainers map to outcomes.",
          ],
        },
        {
          heading: "Questions to ask",
          list: [
            "Do you build custom themes or customise off-the-shelf?",
            "Who maintains performance and CRO after go-live?",
            "How do you handle integrations and ERP sync?",
            "What does support look like in the first 90 days?",
          ],
        },
      ],
    ),
  },
  {
    slug: "ecommerce-funnel-breakdown",
    title: "Where You're Losing 70% of Customers: The eCommerce Funnel Breakdown",
    date: "May 11, 2026",
    tags: ["eCommerce", "CRO", "Growth"],
    ...body(
      "Most drop-off is normal — but the shape of your funnel reveals fixable leaks. Map sessions to PDP, cart, checkout, and purchase with template-level detail.",
      [
        {
          paragraphs: [
            "A steep cliff between collection and PDP often signals findability or relevance issues. Cart-to-checkout loss may be shipping surprise, account friction, or payment method gaps.",
          ],
        },
        {
          heading: "Prioritise by volume",
          list: [
            "Fix the step with the highest absolute drop first",
            "Pair quantitative funnels with session recordings",
            "Run focused tests rather than redesigning everything",
          ],
        },
      ],
    ),
  },
  {
    slug: "conversion-leaks-2026",
    title:
      "Where eCommerce Stores Lose Revenue in 2026: A Data-Backed Breakdown of Conversion Leaks",
    date: "Apr 30, 2026",
    tags: ["CRO", "eCommerce"],
    ...body(
      "2026 leaks look familiar — mobile friction, slow filters, weak PDP storytelling — but attribution is harder. First-party data and server-side tagging are table stakes.",
      [
        {
          paragraphs: [
            "Brands that cannot connect ad spend to on-site behaviour guess at fixes. Clean event schemas in GA4 and Shopify analytics make CRO programmes auditable.",
          ],
        },
        {
          heading: "Common leaks we see",
          list: [
            "Variant selectors that fail on mobile",
            "Upsell apps that block main CTA",
            "International shipping UX that hides totals",
            "Loyalty widgets that shift layout on load",
          ],
        },
      ],
    ),
  },
  {
    slug: "users-leave-after-3-seconds",
    title:
      "53% of Users Leave After 3 Seconds: What Happens Between 1–3 Seconds?",
    date: "Apr 23, 2026",
    tags: ["eCommerce", "Growth"],
    ...body(
      "The first three seconds are dominated by perceived speed: hero paint, font flash, and whether the page feels stable.",
      [
        {
          paragraphs: [
            "Users judge credibility from visual completeness. A blank hero followed by a popping header reads as broken — even if Lighthouse scores look acceptable.",
          ],
        },
        {
          heading: "Optimise perception",
          list: [
            "Preload critical hero assets",
            "Reserve space for dynamic badges and promos",
            "Avoid full-screen loaders on returning visitors",
            "Ship skeleton states that match final layout",
          ],
        },
      ],
    ),
  },
  {
    slug: "payment-compliance-scale",
    title: "Why Payment Compliance Matters More as Shopify Brands Scale",
    date: "Apr 16, 2026",
    tags: ["Shopify"],
    ...body(
      "Scaling into new markets introduces PCI scope, local payment methods, and fraud rules that touch checkout customisations.",
      [
        {
          paragraphs: [
            "Custom checkout scripts and third-party fields can complicate compliance. Document every checkout extension and keep payment flows aligned with Shopify's supported surfaces.",
          ],
        },
        {
          heading: "Scale checklist",
          list: [
            "Review Shopify Payments availability per region",
            "Localise tax and duty messaging before launch",
            "Audit apps with checkout UI extensions",
            "Monitor chargeback rates when entering new channels",
          ],
        },
      ],
    ),
  },
  {
    slug: "no-premade-themes",
    title:
      "Why Hoahwa Doesn't Build on Pre-Made Shopify Themes And Why Serious Brands Shouldn't Either",
    date: "Apr 13, 2026",
    tags: ["Tech Integration", "Growth", "Shopify"],
    ...body(
      "Pre-made themes trade speed-to-launch for long-term rigidity. Serious brands outgrow generic section libraries and app-dependent layouts.",
      [
        {
          paragraphs: [
            "Off-the-shelf themes bundle opinions — about navigation, merchandising, and performance — that rarely match your catalogue, content model, or growth roadmap.",
          ],
        },
        {
          heading: "Custom build advantages",
          list: [
            "Metafields and sections designed for your products",
            "Lean JavaScript tuned to your analytics stack",
            "No unused features slowing every page",
            "Cleaner handover for in-house teams",
          ],
        },
      ],
    ),
  },
  {
    slug: "core-web-vitals-2026",
    title: "Core Web Vitals for Shopify: What Google Actually Penalises in 2026",
    date: "Apr 6, 2026",
    tags: ["Tech Integration", "Growth", "Shopify"],
    ...body(
      "LCP, INP, and CLS remain the public metrics — but field data at the 75th percentile is what counts for experience, not lab scores alone.",
      [
        {
          paragraphs: [
            "Shopify themes fail INP when cart drawers, sliders, and search overlays compete for the main thread. CLS often traces to app banners and cookie bars injected without reserved space.",
          ],
        },
        {
          heading: "Field-first approach",
          list: [
            "Monitor CrUX or RUM by template and device",
            "Fix regressions within the same release cycle",
            "Treat third-party scripts as performance budget items",
          ],
        },
      ],
    ),
  },
  {
    slug: "shopify-plus-growth-strategy",
    title: "Shopify Plus Growth Strategy for DTC Brands (2026 Guide)",
    date: "Mar 31, 2026",
    tags: ["Growth", "Shopify"],
    ...body(
      "Plus unlocks checkout extensibility, B2B, and higher API limits — but growth still comes from merchandising, retention, and landing page velocity.",
      [
        {
          paragraphs: [
            "Brands on Plus win when they ship campaigns faster than competitors: new collections, collaborations, and localized storefronts without re-architecting each time.",
          ],
        },
        {
          heading: "2026 priorities",
          list: [
            "Segmented landing pages per acquisition channel",
            "Lifecycle flows tied to on-site behaviour",
            "International expansion with local payment trust",
            "Retainer capacity for continuous CRO",
          ],
        },
      ],
    ),
  },
  {
    slug: "shopify-rollouts-ab-testing",
    title:
      "Shopify Rollouts: Native A/B Testing Is Here - But Most Brands Still Won't Use It Properly",
    date: "Mar 25, 2026",
    tags: ["A/B Testing", "Shopify", "Growth"],
    ...body(
      "Rollouts lower the barrier to experimentation — discipline determines whether tests produce learning or noise.",
      [
        {
          paragraphs: [
            "Teams often run overlapping tests, change too many variables, or stop winners before significance. Native tooling does not replace a CRO process.",
          ],
        },
        {
          heading: "Use rollouts well",
          list: [
            "One primary metric per test",
            "Document control and variant in theme changelog",
            "Bake winners into the main theme promptly",
            "Review losing variants for qualitative insight",
          ],
        },
      ],
    ),
  },
  {
    slug: "what-is-aeo-answer-engine-optimization",
    title:
      "What Is Answer Engine Optimization (AEO)? A 2026 Guide for Shopify Brands",
    date: "Jun 20, 2026",
    tags: ["AEO", "AI Search", "Shopify"],
    ...body(
      "Shoppers increasingly ask ChatGPT, Perplexity, and Google's AI Overviews what to buy—and the answer rarely includes ten blue links. Answer Engine Optimization is how your brand becomes the answer instead of a footnote.",
      [
        {
          paragraphs: [
            "Answer Engine Optimization (AEO) is the practice of structuring your store and content so AI answer engines can understand, trust, and cite it. Where classic SEO competes for a ranking position, AEO competes to be quoted inside a single generated response—often the only result a shopper ever sees.",
          ],
        },
        {
          heading: "Why it matters now",
          paragraphs: [
            "AI Overviews compress a search results page into one answer, and paid click-through on those queries has fallen sharply. At the same time, traffic that arrives from AI assistants tends to convert better, because the shopper already received a recommendation they trust. Being absent from that answer is the new page-two.",
          ],
        },
        {
          heading: "What AEO actually requires",
          list: [
            "Structured data: Product, FAQ, Article, and Organization schema",
            "Answer-first content that states the conclusion before the detail",
            "Clear entity signals so engines know who your brand is",
            "Crawler and agent access (robots, llms.txt, fast rendering)",
            "Clean, machine-readable product and policy data",
          ],
        },
        {
          heading: "Where to start",
          paragraphs: [
            "Begin with an AI visibility audit: test a fixed set of buying-intent prompts across the major engines and see whether your brand appears at all. The gaps that audit surfaces—missing schema, thin entity data, slow rendering—become your roadmap.",
          ],
        },
      ],
    ),
  },
  {
    slug: "agentic-commerce-ai-shopping-agents",
    title: "Agentic Commerce: How AI Shopping Agents Will Buy From Your Store",
    date: "Jun 16, 2026",
    tags: ["Agentic Commerce", "AI Search", "eCommerce"],
    ...body(
      "The next shift after AI search is AI purchasing: assistants that read your catalogue, confirm stock, and complete checkout on a shopper's behalf. The brands structuring their data today are the ones agents will transact with first.",
      [
        {
          paragraphs: [
            "Agentic commerce describes a flow where an AI assistant doesn't just recommend a product—it buys it. The agent queries a catalogue, checks price and availability in real time, applies the right options, and pushes a purchase through via APIs, with the shopper approving rather than clicking through your funnel.",
          ],
        },
        {
          heading: "What agents need from your store",
          list: [
            "Structured, real-time product, price, and inventory data",
            "Machine-readable offers, shipping, returns, and policy information",
            "Stable APIs and an architecture an agent can transact against",
            "Trustworthy entity and review signals to be chosen at all",
          ],
        },
        {
          heading: "It rewards the same fundamentals as AEO",
          paragraphs: [
            "Agentic readiness is not a separate project from Answer Engine Optimization—it is the same discipline taken one step further. Clean schema, accurate catalogue data, and fast, open access are what let an engine cite you and what let an agent buy from you.",
          ],
        },
        {
          heading: "How to prepare without over-investing",
          paragraphs: [
            "You do not need to rebuild your store for agents that are still emerging. You do need your product, pricing, and policy data to be accurate and structured now, so that when agentic checkout reaches your category, you are already eligible rather than scrambling to catch up.",
          ],
        },
      ],
    ),
  },
  {
    slug: "geo-vs-seo-getting-cited-by-ai",
    title: "GEO vs SEO: How to Get Cited by ChatGPT and Google AI Overviews",
    date: "Jun 10, 2026",
    tags: ["AEO", "AI Search", "Growth"],
    ...body(
      "SEO and GEO are not the same job. One earns you a ranking; the other earns you a citation inside an AI-generated answer. Here is how they differ and what to prioritise when both matter.",
      [
        {
          paragraphs: [
            "Generative Engine Optimization (GEO) optimises for being referenced by generative engines—ChatGPT, Perplexity, Gemini, and Google AI Overviews. SEO optimises for ranking in a list of links. They overlap on fundamentals like quality content and fast pages, but they diverge sharply on what wins.",
          ],
        },
        {
          heading: "Where they differ",
          list: [
            "SEO targets keyword rankings; GEO targets being quoted in an answer",
            "SEO rewards links and authority; GEO rewards clarity and structure",
            "SEO success is a position; GEO success is a citation and share-of-voice",
            "GEO leans far more on structured data and clean entity signals",
          ],
        },
        {
          heading: "What earns citations",
          paragraphs: [
            "Generative engines favour content that answers the question directly, is well structured, and comes from a brand they can identify as a credible entity. Answer-first formatting, comprehensive FAQ coverage, and consistent brand information across the web all increase the odds you are the source an engine pulls from.",
          ],
        },
        {
          heading: "Run them together, measure differently",
          paragraphs: [
            "Keep doing SEO—rankings still drive meaningful traffic. But measure GEO on its own terms: track a fixed prompt set across engines, watch whether your brand is cited, and monitor share-of-voice against competitors. What gets you ranked and what gets you quoted are related, but they are not identical.",
          ],
        },
      ],
    ),
  },
];

export const insightsDatabase: InsightsDatabase = {
  version: 1,
  posts: articles,
};
