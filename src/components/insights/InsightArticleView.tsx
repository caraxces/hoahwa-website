import Link from "next/link";
import type { InsightPostRecord } from "@/lib/insights-types";
import type { InsightPostListItem } from "@/lib/insights-db";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

type InsightArticleViewProps = {
  post: InsightPostRecord;
  related: InsightPostListItem[];
};

export function InsightArticleView({ post, related }: InsightArticleViewProps) {
  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-32 pt-[120px] text-[var(--wiro-cod-gray)]"
    >
      <PageContainer>
        <Reveal variants={fadeUp}>
          <Link
            href="/insights"
            className="text-sm tracking-[-0.03em] text-[var(--wiro-mauve)] transition-opacity hover:opacity-70"
          >
            ← All insights
          </Link>
        </Reveal>

        <RevealGroup
          variants={staggerContainer(0.08, 0.04)}
          className="mt-10 max-w-[900px]"
        >
          <Reveal variants={fadeUp}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <time
                dateTime={post.date}
                className="text-sm tracking-[-0.03em] text-[var(--wiro-mauve)]"
              >
                {post.date}
              </time>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs tracking-[-0.02em] text-[var(--wiro-cod-gray)]/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal clip variants={clipUp} className="mt-6">
            <h1 className="text-h1">{post.title}</h1>
          </Reveal>

          <Reveal variants={fadeUp} className="mt-8">
            <p className="text-[length:40px] leading-[44px] tracking-[-0.04em] text-[var(--wiro-cod-gray)]/85">
              {post.excerpt}
            </p>
          </Reveal>
        </RevealGroup>

        <article className="prose-insight mt-16 max-w-[720px]">
          {post.body.map((block, index) => {
            if (block.type === "heading") {
              return (
                <Reveal key={`${block.type}-${index}`} variants={fadeUp}>
                  <h2 className="mt-12 text-[length:var(--wiro-h4)] tracking-[-0.04em] first:mt-0">
                    {block.text}
                  </h2>
                </Reveal>
              );
            }

            if (block.type === "list") {
              return (
                <Reveal key={`${block.type}-${index}`} variants={fadeUp}>
                  <ul className="mt-6 space-y-3 border-l border-[var(--wiro-cod-gray)]/15 pl-6">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              );
            }

            return (
              <Reveal key={`${block.type}-${index}`} variants={fadeUp}>
                <p className="mt-6 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
                  {block.text}
                </p>
              </Reveal>
            );
          })}
        </article>

        {related.length > 0 ? (
          <div className="mt-24 border-t border-[var(--wiro-cod-gray)] pt-12">
            <h2 className="text-[length:var(--wiro-h4)] tracking-[-0.04em] text-[var(--wiro-mauve)]">
              Related insights
            </h2>
            <ul className="mt-8">
              {related.map((item) => (
                <li
                  key={item.slug}
                  className="border-b border-[var(--wiro-cod-gray)]/20"
                >
                  <Link
                    href={`/insights/${item.slug}`}
                    className="group flex flex-col gap-2 py-6 transition-opacity hover:opacity-80 md:flex-row md:items-baseline md:gap-8"
                  >
                    <span className="shrink-0 text-sm tracking-[-0.03em] text-[var(--wiro-mauve)] md:w-36">
                      {item.date}
                    </span>
                    <span className="text-h3 text-[var(--wiro-cod-gray)]/25 transition-colors group-hover:text-[var(--wiro-cod-gray)]/50">
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Reveal variants={fadeUp} className="mt-16">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] underline decoration-[var(--wiro-mauve)] underline-offset-4 transition-opacity hover:opacity-70"
          >
            Discuss this with our team
          </Link>
        </Reveal>
      </PageContainer>
    </PageSection>
  );
}
