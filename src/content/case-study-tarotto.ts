/**
 * Case study 004: Tarotto.
 *
 * A programmatic content site in the tarot / astrology niche, built on our own
 * Next.js stack. Two separate measurement dates, kept separate on purpose:
 *
 *   - Structure figures (910 sitemap URLs and the section breakdown) were read
 *     from https://tarotto.io/sitemap.xml on 2026-09-08, the same day this file
 *     was written. Re-read the sitemap to refresh them.
 *   - Traffic and indexing figures (248 active users, 4.05K indexed, ~8.1K
 *     crawled) are a May 2026 Google Analytics / Search Console snapshot and
 *     are labelled as such in the copy. They are NOT current, and the two sets
 *     are not comparable — do not compute a trend between them.
 */

import type { CaseStudyContent } from "@/components/case-studies/CaseStudyLayout";

export const caseStudyTarotto: CaseStudyContent = {
  meta: {
    eyebrow: "Case study 004",
    headline: ["Nine hundred pages", "from a standing start."],
    lead: "Tarotto is a content site in the tarot and astrology niche, built on the same Next.js stack as this one. It went from zero indexed pages in April 2026 to a library of several hundred editorial pages plus a set of interactive tools, in a category where almost everything ranking is either thin affiliate copy or a paywall. It is the clearest thing we own for one specific question: what does publishing at volume actually take.",
    measured: "Structure read from tarotto.io/sitemap.xml on 8 September 2026. Traffic and indexing figures are a labelled May 2026 snapshot and are not current.",
  },
  stats: [
    { value: "910", label: "URLs in the sitemap, read 8 Sep 2026" },
    { value: "729", label: "Editorial pages under one section" },
    { value: "2", label: "Languages, with hreflang alternates" },
    { value: "Apr 2026", label: "Indexing began from zero" },
  ],
  chapters: [
    {
      num: "01",
      title: "Why this niche is a good test",
      body: [
        "Tarot and astrology is one of the most saturated content categories on the web, and one of the worst served. Search results are dominated by pages that answer the query in the title and then pad for eight hundred words, or that gate the answer behind an email form. The queries themselves are enormously varied and long-tailed — every card, every pairing, every sign, every combination of the two.",
        "That makes it a genuinely useful place to test a publishing system rather than a publishing habit. If the architecture works, you can cover a long tail no individual writer could reach by hand. If it does not, you produce several hundred pages of near-duplicate text and Google ignores all of them. Both outcomes are informative, and the second one is the common one.",
      ],
    },
    {
      num: "02",
      title: "What is actually on the site",
      body: [
        "The sitemap listed 910 URLs when we read it on 8 September 2026. 729 of those sit under a single section, /spiritual-meaning — the editorial library, and the bulk of the site. The rest splits into 87 pages under /tarot, 26 under /sbti for the personality tests, and 17 under /horoscope, one per sign.",
        "The distinction that matters is between the pages and the tools. /tarot/yes-no, /tarot/daily, /tarot/love, /tarot/career and the past-present-future spread are interactive: the visitor does something and gets a result. The 729 editorial pages are what makes those tools findable, and they are written as real answers to real questions — \"Mercury Retrograde: What Actually Happens\", \"Zodiac Sign Dates: Why They Shifted\", \"How to Ask Tarot a Good Question\". That last one is a page about asking better questions, which is not a keyword anybody targets.",
        "The site ships in English and Vietnamese, with hreflang alternates declaring en-GB, vi-VN and x-default. Bilingual from the sitemap up, rather than a translation layer bolted on later.",
      ],
    },
    {
      num: "03",
      title: "The measurements, and why there are two dates",
      body: [
        "The structural numbers above were read from the live sitemap on 8 September 2026, so they are current as of writing.",
        "The traffic numbers are not. The most recent figures we hold are a May 2026 snapshot: 248 active users over the prior 30 days, up 359% on the period before; 1.2K events, up 70%; and Search Console reporting 4.05K pages indexed against roughly 8.1K crawled, having started from zero in April 2026.",
        "Those two sets are not comparable and we are not going to pretend otherwise. A sitemap counts canonical URLs a site chooses to declare; Search Console counts everything it crawled, which on this site includes thirty paginated listing URLs and whatever query-string variants it found. A four-month-old traffic snapshot next to a same-day structural count is two facts, not a trend. Anyone quoting a growth rate off that pairing is inventing one.",
      ],
    },
    {
      num: "04",
      title: "What this transfers to commerce",
      body: [
        "The mechanism behind a 729-page editorial section is the same one behind a collection tree that actually ranks: one template, a clean content model, and enough genuinely distinct substance per page to deserve the URL. Merchants ask for this constantly, usually phrased as \"can we have a page for every category and city\". The honest answer is yes, and it works exactly as well as the substance you can put on each one.",
        "The parts that carried over directly are the boring ones. Declaring canonical URLs in a sitemap and letting Search Console disagree with you. Shipping hreflang from the start, because retrofitting a second language into a URL structure that assumed one is a migration. Publishing enough of a section that the internal linking has something to do.",
        "Two things we would do differently. The URL casing is inconsistent — /tarot/pastPresentFuture sits among otherwise kebab-cased paths, which is the kind of thing that is free to fix on day one and a redirect map by month six. And a four-month gap between traffic measurements is too long for a site publishing at this rate; the numbers should be captured on a schedule, not when someone asks for a case study.",
      ],
    },
  ],
  stack: [
    { label: "Format", value: "Programmatic editorial pages plus interactive tools" },
    { label: "Structure", value: "910 sitemap URLs — 729 editorial, 87 tarot, 26 SBTI, 17 horoscope" },
    { label: "Internationalisation", value: "English and Vietnamese, hreflang en-GB / vi-VN / x-default" },
    { label: "Crawl control", value: "Everything allowed except /api/, sitemap declared in robots.txt" },
    { label: "Indexing", value: "From zero in April 2026; 4.05K indexed of ~8.1K crawled as of May 2026" },
    { label: "Audience", value: "248 active users and 1.2K events in the 30 days to May 2026" },
  ],
  demo: {
    href: "https://tarotto.io",
    label: "Visit tarotto.io",
    note: "Live, and not our client — we own it. The tools are free and need no account, which is the point of it as a demonstration.",
  },
  cta: {
    headline: ["Want a content system", "that earns its URLs?"],
    body: "We build programmatic sections the same way we report on them — one template, a real content model, and a measurement schedule agreed before the first page ships.",
    cta: "Book a call",
  },
};
