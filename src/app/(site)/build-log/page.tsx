import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import {
  buildLogEntries,
  formatBuildLogDisplayDate,
  getBuildLogLastUpdatedIso,
  getBuildLogLastUpdatedLabel,
} from "@/content/build-log";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME } from "@/lib/seo";

const PATH = "/build-log";

const TITLE = "Build log";
const DESCRIPTION =
  "A reverse-chronological feed of what Hoahwa ships each week across hoahwa.com, BloomBound, Kể, Tarotto, HoaHwa Links, and Notch Agent Train.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: "/og/build-log.png",
});

function buildLogStructuredData() {
  const pageUrl = absoluteUrl(PATH);
  const lastUpdated = getBuildLogLastUpdatedIso();

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    name: TITLE,
    description: DESCRIPTION,
    url: pageUrl,
    dateModified: lastUpdated,
    isPartOf: { "@id": absoluteUrl("/") },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    mainEntity: {
      "@type": "Blog",
      "@id": `${pageUrl}#blog`,
      name: `${SITE_NAME} build log`,
      description: DESCRIPTION,
      blogPost: buildLogEntries.map((entry) => ({
        "@type": "BlogPosting",
        "@id": `${pageUrl}#${entry.id}`,
        headline: entry.title,
        description: entry.summary,
        datePublished: entry.date,
        dateModified: entry.date,
        ...(entry.href ? { url: absoluteUrl(entry.href) } : {}),
        author: { "@id": `${absoluteUrl("/")}#organization` },
      })),
    },
    hasPart: {
      "@type": "ItemList",
      "@id": `${pageUrl}#itemlist`,
      numberOfItems: buildLogEntries.length,
      itemListElement: buildLogEntries.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "BlogPosting",
          headline: entry.title,
          description: entry.summary,
          datePublished: entry.date,
          ...(entry.href ? { url: absoluteUrl(entry.href) } : {}),
        },
      })),
    },
  };
}

export default function BuildLogPage() {
  const updatedLabel = getBuildLogLastUpdatedLabel();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Build log", path: PATH },
        ])}
      />
      <JsonLd data={buildLogStructuredData()} />
      <PageSection className="bg-[var(--wiro-romance)] pb-32 pt-[120px] text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <header className="mb-16">
            <h1 className="text-h1">
              <span className="block">What we</span>
              <span className="block">
                shipped<span className="text-[var(--wiro-mauve)]">.</span>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
              {DESCRIPTION}
            </p>
            <p className="mt-4 text-sm tracking-[-0.03em] text-[var(--wiro-cod-gray)]/65">
              Updated {updatedLabel}
            </p>
          </header>

          <ul className="border-t border-[var(--wiro-cod-gray)]">
            {buildLogEntries.map((entry) => {
              const rowContent = (
                <>
                  <div className="flex shrink-0 flex-col gap-2 md:w-48">
                    <span className="text-sm font-medium tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
                      {formatBuildLogDisplayDate(entry.date)}
                    </span>
                    <span className="text-xs tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60">
                      {entry.project}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs tracking-[-0.02em] text-[var(--wiro-cod-gray)]/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-h3 text-[var(--wiro-cod-gray)]/45 transition-colors group-hover:text-[var(--wiro-cod-gray)]/75">
                      {entry.title}
                    </span>
                    <p className="max-w-3xl text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)]/70">
                      {entry.summary}
                    </p>
                  </div>
                </>
              );

              const className =
                "group flex min-h-[44px] flex-col gap-4 border-b border-[var(--wiro-cod-gray)] py-10 transition-opacity hover:opacity-80 md:flex-row md:items-start md:gap-12";

              return (
                <li key={entry.id}>
                  {entry.href ? (
                    <Link href={entry.href} className={className}>
                      {rowContent}
                    </Link>
                  ) : (
                    <div className={className}>{rowContent}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </PageContainer>
      </PageSection>
    </>
  );
}
