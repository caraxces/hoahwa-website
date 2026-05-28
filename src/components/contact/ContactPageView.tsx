import Link from "next/link";
import Image from "next/image";
import { contactPage } from "@/content/contact";
import { HoahwaContactForm } from "@/components/shared/HoahwaContactForm";
import { Reveal, RevealGroup } from "@/components/motion/Reveal";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { clipUp, fadeUp, staggerContainer } from "@/lib/motion";

export function ContactPageView() {
  return (
    <PageSection
      padX={false}
      className="min-h-[calc(100vh-88px)] bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] py-[120px] text-[var(--wiro-romance)]"
    >
      <PageContainer>
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <RevealGroup
            variants={staggerContainer(0.08, 0)}
            className="max-w-[520px] shrink-0"
          >
            <Reveal clip variants={clipUp}>
              <h1 className="text-h1">{contactPage.title[0]}</h1>
            </Reveal>
            <Reveal clip variants={clipUp}>
              <h1 className="text-h1 text-[var(--wiro-mauve)]">
                <Image
                  src="/LOGO HOAHWA/hoahwa_logo_board-08.png"
                  alt="Hoahwa"
                  width={480}
                  height={120}
                  className="block h-[1em] w-auto max-w-full"
                />
              </h1>
            </Reveal>
            <Reveal variants={fadeUp} className="mt-12 space-y-6">
              <p>
                <Link
                  href={contactPage.phoneHref}
                  className="text-[length:40px] leading-[44px] tracking-[-0.04em] hover:text-[var(--wiro-mauve)]"
                >
                  {contactPage.phone}
                </Link>
              </p>
              <p>
                <Link
                  href={contactPage.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[length:var(--wiro-body)] leading-[var(--wiro-body-lh)] tracking-[-0.03em] text-[var(--wiro-romance)]/80 hover:text-[var(--wiro-mauve)]"
                >
                  {contactPage.address}
                </Link>
              </p>
              <p>
                <Link
                  href={contactPage.emailHref}
                  className="text-[length:var(--wiro-body)] tracking-[-0.03em] hover:text-[var(--wiro-mauve)]"
                >
                  {contactPage.email}
                </Link>
              </p>
            </Reveal>
          </RevealGroup>

          <Reveal variants={fadeUp} className="w-full max-w-[532px]">
            <HoahwaContactForm
              services={contactPage.services}
              budgets={contactPage.budgets}
              showBudget
            />
          </Reveal>
        </div>
      </PageContainer>
    </PageSection>
  );
}
