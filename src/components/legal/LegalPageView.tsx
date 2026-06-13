import type { ReactNode } from "react";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import type { LegalDoc } from "@/content/legal";

export function LegalPageView({
  doc,
  children,
}: {
  doc: LegalDoc;
  /** Extra content rendered after the sections (e.g. cookie tables). */
  children?: ReactNode;
}) {
  return (
    <PageSection className="bg-[var(--wiro-romance)] pb-32 pt-40 text-[var(--wiro-cod-gray)]">
      <PageContainer className="max-w-[820px]">
        <p className="text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]">
          {doc.eyebrow}
        </p>
        <h1 className="mt-3 text-h3">{doc.title}</h1>
        <p className="mt-3 text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/50">
          Last updated: {doc.updatedAt}
        </p>
        <p className="mt-8 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75">
          {doc.intro}
        </p>

        <div className="mt-14 flex flex-col gap-12">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[length:var(--wiro-h6)] leading-7 tracking-[-0.03em]">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mt-4 text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75"
                >
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
                  {section.bullets.map((b) => (
                    <li
                      key={b.slice(0, 40)}
                      className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {children}
      </PageContainer>
    </PageSection>
  );
}
