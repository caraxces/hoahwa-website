"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ServiceFaq } from "@/content/service";
import { AccordionPlusIcon } from "@/components/shared/AccordionPlusIcon";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { cn } from "@/lib/cn";

import { HoahwaContactForm } from "@/components/shared/HoahwaContactForm";

type ServiceFaqContactProps = {
  faqs: ServiceFaq[];
  contactTitle: readonly [string, string];
  contactServices: string[];
  nodeId?: string;
};

export function ServiceFaqContact({
  faqs,
  contactTitle,
  contactServices,
  nodeId,
}: ServiceFaqContactProps) {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? "");

  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-20 text-[var(--wiro-romance)]"
      data-node-id={nodeId}
    >
      <PageContainer>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,308px)_minmax(0,1fr)] lg:gap-12">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em] text-[var(--wiro-romance)]">
              FAQ
            </h2>
            <h2 className="text-[length:var(--wiro-h2)] leading-[var(--wiro-h2)] tracking-[-0.04em] text-[var(--wiro-mauve)]">
              Questions
            </h2>
          </div>

          <div className="border-t border-[var(--wiro-romance)]">
            {faqs.map((item) => {
              const open = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-[var(--wiro-romance)]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-8 py-10 pl-5 pr-10 text-left"
                    onClick={() => setOpenId(open ? "" : item.id)}
                    aria-expanded={open}
                  >
                    <AccordionPlusIcon className="text-[var(--wiro-romance)]" />
                    <span className="text-[length:40px] leading-[44px] tracking-[-0.04em]">
                      {item.question}
                    </span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[692px] pb-8 pl-[60px] pr-10 text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          id="contact"
          className="mt-32 flex scroll-mt-28 flex-col gap-16 lg:flex-row lg:justify-between"
        >
          <div className="max-w-[720px] shrink-0">
            <h2 className="text-h1">
              <span className="block text-[var(--wiro-romance)]">{contactTitle[0]}</span>
              <span className="block text-[var(--wiro-mauve)]">
                <Image
                  src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
                  alt="Hoahwa"
                  width={480}
                  height={120}
                  className="block h-[1em] w-auto max-w-full"
                />
              </span>
            </h2>
          </div>
          <div className="w-full max-w-[532px]">
            <HoahwaContactForm services={contactServices} />
            <p className="mt-6 text-sm text-[var(--wiro-romance)]/50">
              Prefer email?{" "}
              <Link href="/contact" className="underline hover:text-[var(--wiro-mauve)]">
                Visit our contact page
              </Link>
            </p>
          </div>
        </div>
      </PageContainer>
    </PageSection>
  );
}
