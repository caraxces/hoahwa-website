import { cn } from "@/lib/cn";

/** Shared Hoahwa tokens for cookie consent (matches contact, team, build CTAs). */
export const cookieUi = {
  shell:
    "rounded-lg border border-[var(--wiro-cod-gray)]/10 bg-[var(--wiro-spring-wood)] text-[var(--wiro-cod-gray)] shadow-[0_16px_48px_rgba(0,0,0,0.14)]",
  sectionX: "px-[var(--wiro-gutter)] sm:px-8",
  sectionY: "py-6 sm:py-8",
  eyebrow: "text-sm tracking-[-0.02em] text-[var(--wiro-mauve)]",
  title: "text-[length:var(--wiro-h6)] leading-7 tracking-[-0.03em] text-[var(--wiro-cod-gray)]",
  body: "text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/75",
  bodyMuted: "text-base leading-6 tracking-[-0.03em] text-[var(--wiro-cod-gray)]/65",
  label: "text-base font-medium tracking-[-0.03em] text-[var(--wiro-cod-gray)]",
  divider: "border-[var(--wiro-cod-gray)]/10",
  btnPrimary: cn(
    "inline-flex w-full items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5",
    "text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90",
  ),
  btnSecondary: cn(
    "inline-flex w-full items-center justify-center rounded-full border border-[var(--wiro-cod-gray)]/20 px-6 py-2.5",
    "text-base tracking-[-0.03em] transition-colors hover:border-[var(--wiro-cod-gray)]/40",
  ),
  link: "text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/60 underline-offset-2 hover:text-[var(--wiro-cod-gray)] hover:underline",
};
