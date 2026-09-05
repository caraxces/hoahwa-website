"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  bookingFaqs,
  bookingFormCopy,
  bookingHero,
  bookingWhatToExpect,
  GOOGLE_APPOINTMENT_URL,
} from "@/content/booking";
import { BookingRequestForm } from "@/components/booking/BookingRequestForm";
import { GoogleAppointmentEmbed } from "@/components/booking/GoogleAppointmentEmbed";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function BookingPageView() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasCalendar = Boolean(GOOGLE_APPOINTMENT_URL);

  return (
    <>
      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-20 pt-[120px] text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <RevealGroup variants={staggerContainer(0.08, 0.05)}>
            <Reveal variants={fadeUp}>
              <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                {bookingHero.eyebrow}
              </p>
            </Reveal>
            <h1 className="mt-4 text-h1">
              <Reveal as="span" clip variants={clipUp} className="block">
                {bookingHero.headline[0]}
              </Reveal>
              <Reveal
                as="span"
                clip
                variants={clipUp}
                className="block text-[var(--wiro-mauve)]"
              >
                {bookingHero.headline[1]}
              </Reveal>
            </h1>
            <Reveal variants={fadeUp} className="mt-10 max-w-[760px]">
              <p className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/80">
                {bookingHero.lead}
              </p>
            </Reveal>
          </RevealGroup>

          {hasCalendar ? (
            <Reveal variants={fadeUp} className="mt-16">
              <GoogleAppointmentEmbed
                url={GOOGLE_APPOINTMENT_URL!}
                onUseFormInstead={scrollToForm}
              />
            </Reveal>
          ) : null}
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-spring-wood)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              What to expect
              <span className="text-[var(--wiro-mauve)]">.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {bookingWhatToExpect.map((item, i) => (
              <Reveal key={item.num} variants={fadeUp} delay={i * 0.06}>
                <article className="h-full rounded-lg bg-[var(--wiro-romance)] p-8 md:p-10">
                  <span className="text-base tracking-[-0.03em] text-[var(--wiro-mauve)]">
                    {item.num}
                  </span>
                  <h3 className="mt-5 text-[length:var(--wiro-h4)] tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-6 tracking-[-0.03em] opacity-75">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </PageContainer>
      </PageSection>

      <PageSection
        padX={false}
        className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-24 text-[var(--wiro-romance)]"
      >
        <PageContainer>
          <div ref={formRef} className="scroll-mt-28">
            <RevealGroup variants={staggerContainer(0.08, 0)}>
              <Reveal variants={fadeUp}>
                <p className="text-[length:var(--wiro-body)] tracking-[-0.03em] text-[var(--wiro-mauve)]">
                  {hasCalendar ? bookingFormCopy.eyebrow : "Request a time"}
                </p>
              </Reveal>
              <Reveal clip variants={clipUp}>
                <h2 className="mt-4 text-h3">{bookingFormCopy.title}</h2>
              </Reveal>
              <Reveal variants={fadeUp} className="mt-6 max-w-[620px]">
                <p className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]/75">
                  {bookingFormCopy.body}
                </p>
              </Reveal>
            </RevealGroup>

            <Reveal variants={fadeUp}>
              <BookingRequestForm className="mt-12 max-w-[720px]" />
            </Reveal>
          </div>
        </PageContainer>
      </PageSection>

      <PageSection className="bg-[var(--wiro-romance)] py-24 text-[var(--wiro-cod-gray)]">
        <PageContainer>
          <Reveal clip variants={clipUp}>
            <h2 className="text-h3">
              Questions<span className="text-[var(--wiro-mauve)]">.</span>
            </h2>
          </Reveal>
          <div className="mt-12 max-w-[820px] divide-y divide-[var(--wiro-cod-gray)]/15 border-y border-[var(--wiro-cod-gray)]/15">
            {bookingFaqs.map((faq) => (
              <details key={faq.question} className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[length:var(--wiro-h6)] tracking-[-0.03em] marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden
                    className="shrink-0 text-[var(--wiro-mauve)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[680px] text-base leading-6 tracking-[-0.03em] opacity-75">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <Reveal variants={fadeUp}>
            <p className="mt-12 text-base tracking-[-0.03em]">
              Rather write it all down first?{" "}
              <Link href="/contact" className="underline hover:opacity-70">
                Use the full contact form
              </Link>
              .
            </p>
          </Reveal>
        </PageContainer>
      </PageSection>
    </>
  );
}
