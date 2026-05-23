import Image from "next/image";
import Link from "next/link";
import type { ServicePage } from "@/content/services";
import { caseStudies } from "@/content/case-studies";
import { ContactForm } from "@/components/shared/ContactForm";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/shared/Button";

export function ServicePageTemplate({ page }: { page: ServicePage }) {
  const miniCases = caseStudies.slice(0, 4);

  return (
    <>
      <section className="border-b border-[var(--hoahwa-border)] py-16 md:py-24">
        <Container>
          <p className="mb-4 text-sm uppercase tracking-widest text-[var(--hoahwa-accent)]">
            {page.title}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {page.subtitle}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            {page.anchors.map((a) => (
              <Link
                key={a.id}
                href={`#${a.id}`}
                className="rounded-full border border-[var(--hoahwa-border)] px-4 py-2 text-sm hover:border-[var(--hoahwa-accent)]"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--hoahwa-border)] py-16 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {page.steps.map((step, i) => (
              <article
                key={step.title}
                id={page.anchors[i]?.id}
                className="scroll-mt-28 rounded-xl border border-[var(--hoahwa-border)] bg-[var(--hoahwa-surface)] p-6"
              >
                <span className="text-sm text-[var(--hoahwa-accent)]">
                  0{i + 1}
                </span>
                <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
                <p className="mt-3 text-[var(--hoahwa-muted)]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--hoahwa-border)] py-16 md:py-20">
        <Container>
          <SectionHeading title={page.whyTitle} />
          <ul className="grid gap-4 md:grid-cols-3">
            {page.whyPoints.map((point) => (
              <li
                key={point}
                className="rounded-xl border border-[var(--hoahwa-border)] p-6 text-[var(--hoahwa-muted)]"
              >
                {point}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-[var(--hoahwa-border)] py-16 md:py-20">
        <Container>
          <SectionHeading eyebrow="Our finest" title="Case Studies" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {miniCases.map((c) => (
              <Link
                key={c.slug}
                href="#"
                className="group overflow-hidden rounded-xl border border-[var(--hoahwa-border)]"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="300px"
                  />
                </div>
                <p className="p-4 text-sm font-medium leading-snug">{c.title}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-[var(--hoahwa-border)] py-16 md:py-20">
        <Container>
          <SectionHeading title="Questions" />
          <div className="mx-auto max-w-3xl divide-y divide-[var(--hoahwa-border)]">
            {page.faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none text-lg font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex justify-between gap-4">
                    {faq.question}
                    <span className="text-[var(--hoahwa-accent)] group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-[var(--hoahwa-muted)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold">Lets Talk Growth</h2>
              <p className="mt-4 text-[var(--hoahwa-muted)]">
                Tell us about your brand and goals—we&apos;ll be in touch shortly.
              </p>
              <Button href="/contact" className="mt-6" variant="outline">
                Full contact page
              </Button>
            </div>
            <ContactForm compact />
          </div>
        </Container>
      </section>
    </>
  );
}
