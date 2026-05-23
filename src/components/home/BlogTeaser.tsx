import Link from "next/link";
import { blogTeaser } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { fadeUp } from "@/lib/motion";

export function BlogTeaser() {
  return (
    <PageSection
      className="bg-[var(--wiro-romance)] pb-[241px] pt-[120px] text-[var(--wiro-cod-gray)]"
      data-node-id="1:1062"
    >
      <PageContainer>
        <Reveal variants={fadeUp}>
          <div className="mb-24">
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em] text-[var(--wiro-mauve)]">
              eCommerce
            </h2>
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em]">
              Insights
            </h2>
          </div>
        </Reveal>

        <ul className="border-t border-[var(--wiro-cod-gray)]">
          {blogTeaser.map((post) => (
            <li key={post.num} className="border-b border-[var(--wiro-cod-gray)]">
              <Link
                href="/insights"
                className="group flex gap-6 py-8 transition-opacity hover:opacity-80 md:gap-0"
              >
                <span className="w-full max-w-[180px] shrink-0 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                  {post.num}
                </span>
                <span className="text-h3 text-[var(--wiro-cod-gray)]/20 transition-colors group-hover:text-[var(--wiro-cod-gray)]/40">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageContainer>
    </PageSection>
  );
}
