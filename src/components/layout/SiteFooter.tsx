"use client";

import Link from "next/link";
import { footerCompany, footerServices } from "@/content/navigation";
import { HoahwaFooterWordmark } from "@/components/layout/HoahwaFooterWordmark";
import { ShopifyPremierBadge } from "@/components/shared/ShopifyPremierBadge";
import { PageContainer } from "@/components/shared/PageContainer";

const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Privacy", href: "#" },
];

export function SiteFooter() {
  return (
    <footer
      className="bg-[var(--hoahwa-accent)] pb-[66px] pt-[120px] text-[var(--wiro-cod-gray)]"
      data-node-id="1:1108"
    >
      {/* Main footer content — respects page padding */}
      <div className="px-[var(--wiro-page-pad)]">
        <PageContainer>
          <div className="grid gap-16 lg:grid-cols-[1fr_312px] lg:gap-10">
            <div className="flex flex-col gap-16 sm:flex-row sm:gap-20">
              <ul className="flex flex-col gap-0">
                {footerCompany.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-1.5 text-base leading-6 tracking-[-0.03em] hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-col gap-0">
                {footerServices.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-1.5 text-base leading-6 tracking-[-0.03em] hover:opacity-70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-10">
              <div>
                <p className="mb-6 max-w-[264px] text-[length:var(--wiro-h6)] leading-7 tracking-[-0.03em]">
                  Join our newsletter for the latest eCom insights
                </p>
                <form
                  className="relative border-b border-[var(--wiro-cod-gray)] pb-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="footer-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent pr-10 text-[length:var(--wiro-body)] text-[var(--wiro-cod-gray)] outline-none placeholder:text-[var(--wiro-cod-gray)]/60"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 flex size-6 items-center justify-center"
                    aria-label="Subscribe"
                  >
                    <span className="text-xl leading-none" aria-hidden>
                      →
                    </span>
                  </button>
                </form>
              </div>
              <ShopifyPremierBadge size="lg" />
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Full-width marquee — no horizontal padding, bleeds edge-to-edge */}
      <div className="relative mt-20 w-full overflow-x-clip py-6">
        <div className="flex h-[120px] w-max animate-marquee-left items-stretch gap-10 md:h-[220px] md:gap-8">
          {[0, 1, 2, 3].map((i) => (
            <HoahwaFooterWordmark key={i} />
          ))}
        </div>
      </div>

      {/* Bottom copyright row — respects page padding */}
      <div className="px-[var(--wiro-page-pad)]">
        <PageContainer>
          <div className="mt-10 flex flex-col gap-4 text-base tracking-[-0.03em] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-8">
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:opacity-70">
                  {link.label}
                </Link>
              ))}
            </div>
            <p>© 2026, Hoahwa Agency Limited</p>
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
