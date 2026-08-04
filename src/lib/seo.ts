import type { Metadata } from "next";
import { liveSocialProfiles } from "@/content/social";

/**
 * Central SEO configuration and helpers.
 *
 * The site is a fully static export (`output: "export"`), so every URL here is
 * resolved at build time. `SITE_URL` drives `metadataBase`, canonical tags,
 * Open Graph URLs, the sitemap, robots.txt, and all JSON-LD `@id`/`url` values.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoahwa.com"
).replace(/\/$/, "");

export const SITE_NAME = "Hoahwa";

export const SITE_TAGLINE = "High-End Web Design & Development";

export const SITE_DESCRIPTION =
  "Hoahwa is a boutique web design & development studio building high-performance Shopify storefronts—you work directly with the people who design and build it, on a fixed scope and a fixed price.";

/**
 * Real image used for JSON-LD `image`/`logo` fields (needs a stable, crawlable
 * URL). Social cards (og:image / twitter:image) are produced separately by the
 * build-time `opengraph-image.tsx` file convention.
 */
export const BRAND_LOGO = "/logo-hoahwa/hoahwa_logo_board-07.png";

/**
 * Organization `sameAs` URLs, derived from `content/social.ts` so the footer
 * links and the structured data can never drift apart.
 */
export const SOCIAL_PROFILES: string[] = liveSocialProfiles.map((p) => p.href);

/**
 * Join a path to the canonical site origin. Page paths receive a trailing
 * slash to match the project's `trailingSlash: true` config (so sitemap and
 * JSON-LD URLs agree with the canonical tags Next emits). File paths (anything
 * with an extension, e.g. .xml/.png) are left untouched. Spaces are encoded.
 */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  let normalized = path.startsWith("/") ? path : `/${path}`;
  const lastSegment = normalized.split("/").pop() ?? "";
  const isFile = lastSegment.includes(".");
  if (!isFile && !normalized.endsWith("/")) normalized = `${normalized}/`;
  return `${SITE_URL}${encodeURI(normalized)}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/audits". Defaults to home. */
  path?: string;
  /** "website" (default) for marketing pages, "article" for insights. */
  type?: "website" | "article";
  /** Article-only fields, used to enrich the Open Graph payload. */
  publishedTime?: string;
  tags?: string[];
  noindex?: boolean;
};

/**
 * Build a complete `Metadata` object for a page: title, description, canonical
 * URL, and Open Graph + Twitter cards. The root layout supplies `metadataBase`
 * and the title template; the og:image/twitter:image come from the build-time
 * `opengraph-image.tsx` convention, so they are intentionally omitted here.
 */
export function pageMetadata({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  tags,
  noindex,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(type === "article" && tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Parse the human-readable insight date ("Jun 2, 2026") into an ISO string.
 * Returns undefined for unparseable input so callers can omit the field.
 */
export function parseInsightDate(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/* -------------------------------------------------------------------------- */
/*  JSON-LD structured-data builders                                          */
/* -------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

/** Organization node — sitewide identity for Google + AI answer engines. */
export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(BRAND_LOGO),
    },
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
  };
}

/** WebSite node — enables the sitelinks search box eligibility + identity. */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

type ServiceInput = {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
};

/** Service node — one per service/offer page. */
export function serviceSchema({
  name,
  description,
  path,
  serviceType,
}: ServiceInput): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    ...(serviceType ? { serviceType } : {}),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
  };
}

type ArticleInput = {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  image?: string;
  tags?: string[];
};

/** Article node — one per insight post. */
export function articleSchema({
  title,
  description,
  path,
  datePublished,
  image = BRAND_LOGO,
  tags,
}: ArticleInput): Json {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: absoluteUrl(image),
    ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
    ...(tags?.length ? { keywords: tags.join(", ") } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** FAQPage node — built from a list of question/answer pairs. */
export function faqSchema(
  items: Array<{ question: string; answer: string }>,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** BreadcrumbList node — builds a trail from an ordered list of crumbs. */
export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
