"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cookieConsentCopy } from "@/content/cookie-consent";
import { CookieIcon } from "@/components/cookie/CookieIcon";
import { GradientScrollArea } from "@/components/cookie/GradientScrollArea";
import { cookieUi } from "@/components/cookie/cookie-ui";
import { cn } from "@/lib/cn";
import {
  acceptAllCookieChoices,
  defaultCookieChoices,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentChoices,
} from "@/lib/cookie-consent";
import { lockDocumentScroll } from "@/lib/scroll-lock";

type View = "bar" | "panel" | "dismissed";

function ConsentToggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        disabled ? "cursor-not-allowed bg-[var(--wiro-cod-gray)]/12" : "cursor-pointer",
        !disabled && checked && "bg-[var(--wiro-mauve)]",
        !disabled && !checked && "bg-[var(--wiro-cod-gray)]/18",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-[var(--wiro-romance)] shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function CookieConsentBanner() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>("bar");
  const [choices, setChoices] = useState<CookieConsentChoices>(defaultCookieChoices);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = readCookieConsent();
    if (stored) {
      setChoices(stored.choices);
      setView("dismissed");
    }
  }, []);

  useEffect(() => {
    if (view !== "panel") return;
    return lockDocumentScroll();
  }, [view]);

  const persist = useCallback((next: CookieConsentChoices) => {
    setChoices(next);
    writeCookieConsent(next);
    setView("dismissed");
  }, []);

  const handleAcceptAll = () => persist(acceptAllCookieChoices());
  const handleRejectNonEssential = () => persist(defaultCookieChoices());
  const handleSave = () => persist(choices);

  const setCategory = (key: keyof CookieConsentChoices, value: boolean) => {
    if (key === "necessary") return;
    setChoices((prev) => ({ ...prev, [key]: value }));
  };

  if (!mounted) return null;

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36 };

  return (
    <>
      <AnimatePresence mode="wait">
        {view === "panel" ? (
          <motion.button
            key="cookie-backdrop"
            type="button"
            aria-label={cookieConsentCopy.panel.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[199] bg-[var(--wiro-black)]/50"
            onClick={() => setView("bar")}
          />
        ) : null}
        {view !== "dismissed" ? (
          <motion.div
            key="cookie-banner"
            role="dialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-desc"
            aria-modal={view === "panel"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={transition}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[200] flex justify-center px-[var(--wiro-gutter)] pb-4 sm:px-[var(--wiro-page-pad)] md:pb-6"
          >
            <motion.div
              layout
              transition={transition}
              className={cn(
                "pointer-events-auto w-full max-w-[min(100%,var(--wiro-container))] overflow-hidden",
                cookieUi.shell,
                view === "panel" ? "max-h-[min(85dvh,720px)]" : "max-w-[640px]",
              )}
            >
              {view === "bar" ? (
                <div
                  className={cn(
                    "flex flex-col gap-6",
                    cookieUi.sectionX,
                    "py-6 sm:py-8",
                  )}
                >
                  <div className="flex flex-col gap-4">
                    <CookieIcon size={22} />
                    <p id="cookie-consent-desc" className={cookieUi.body}>
                      {cookieConsentCopy.bar.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setView("panel")}
                      className={cookieUi.btnSecondary}
                    >
                      {cookieConsentCopy.bar.customize}
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className={cookieUi.btnPrimary}
                    >
                      {cookieConsentCopy.bar.acceptAll}
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  key="panel"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex max-h-[inherit] min-h-0 flex-col"
                >
                  <header
                    className={cn(
                      "shrink-0 border-b",
                      cookieUi.divider,
                      cookieUi.sectionX,
                      cookieUi.sectionY,
                    )}
                  >
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <CookieIcon size={24} />
                        <button
                          type="button"
                          onClick={() => setView("bar")}
                          className="shrink-0 text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/45 transition-colors hover:text-[var(--wiro-cod-gray)]"
                          aria-label={cookieConsentCopy.panel.close}
                        >
                          Close
                        </button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className={cookieUi.eyebrow}>Privacy</p>
                        <h2 id="cookie-consent-title" className={cookieUi.title}>
                          {cookieConsentCopy.panel.title}
                        </h2>
                        <p className={cookieUi.body}>{cookieConsentCopy.panel.intro}</p>
                      </div>
                    </div>
                  </header>

                  <GradientScrollArea fadeFrom="var(--wiro-spring-wood)">
                    <ul className={cn("flex flex-col", cookieUi.sectionX)}>
                      {cookieConsentCopy.categories.map((cat) => {
                        const isRequired = cat.required;
                        const checked =
                          cat.id === "necessary"
                            ? true
                            : Boolean(choices[cat.id as keyof CookieConsentChoices]);
                        const isExpanded = expandedCategory === cat.id;

                        return (
                          <li
                            key={cat.id}
                            className={cn(
                              "flex flex-col gap-4 border-b py-6 last:border-b-0",
                              cookieUi.divider,
                            )}
                          >
                            <div className="flex items-start justify-between gap-6">
                              <div className="flex min-w-0 flex-col gap-1">
                                <p className={cookieUi.label}>{cat.label}</p>
                                {isRequired ? (
                                  <span className={cookieUi.eyebrow}>
                                    {cookieConsentCopy.panel.necessaryLabel}
                                  </span>
                                ) : null}
                              </div>
                              <ConsentToggle
                                checked={checked}
                                disabled={isRequired}
                                label={cat.label}
                                onChange={(next) =>
                                  setCategory(cat.id as keyof CookieConsentChoices, next)
                                }
                              />
                            </div>
                            <p className={cookieUi.bodyMuted}>{cat.description}</p>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedCategory(isExpanded ? null : cat.id)
                              }
                              aria-expanded={isExpanded}
                              className={cn(
                                "self-start text-sm tracking-[-0.02em] underline-offset-2",
                                "text-[var(--wiro-cod-gray)]/55 transition-colors hover:text-[var(--wiro-cod-gray)] hover:underline",
                              )}
                            >
                              {isExpanded
                                ? cookieConsentCopy.detailsToggle.hide
                                : cookieConsentCopy.detailsToggle.show}
                            </button>

                            {isExpanded ? (
                              <ul className="flex flex-col gap-3">
                                {cat.details.length === 0 ? (
                                  <li className={cookieUi.bodyMuted}>
                                    {cookieConsentCopy.emptyCategoryNote}
                                  </li>
                                ) : (
                                  cat.details.map((cookie) => (
                                    <li
                                      key={cookie.name}
                                      className={cn(
                                        "flex flex-col gap-1 rounded-lg border p-4",
                                        cookieUi.divider,
                                      )}
                                    >
                                      <p className="text-sm font-medium tracking-[-0.02em] text-[var(--wiro-cod-gray)]">
                                        {cookie.name}
                                      </p>
                                      <p className="text-sm leading-5 tracking-[-0.02em] text-[var(--wiro-cod-gray)]/65">
                                        {cookie.purpose}
                                      </p>
                                      <p className="text-sm tracking-[-0.02em] text-[var(--wiro-cod-gray)]/50">
                                        {cookie.provider} · {cookie.duration}
                                      </p>
                                    </li>
                                  ))
                                )}
                              </ul>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>

                    <section
                      className={cn(
                        "flex flex-col gap-4 border-t bg-[var(--wiro-romance)]",
                        cookieUi.divider,
                        cookieUi.sectionX,
                        cookieUi.sectionY,
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <p className={cookieUi.eyebrow}>{cookieConsentCopy.ccpa.title}</p>
                        <p className={cookieUi.bodyMuted}>
                          {cookieConsentCopy.ccpa.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 border-t border-[var(--wiro-cod-gray)]/8 pt-6">
                        <p className={cookieUi.label}>
                          {cookieConsentCopy.ccpa.doNotSell}
                        </p>
                        <div className="flex justify-start">
                          <ConsentToggle
                            checked={choices.doNotSell}
                            label={cookieConsentCopy.ccpa.doNotSell}
                            onChange={(next) => setCategory("doNotSell", next)}
                          />
                        </div>
                      </div>
                    </section>
                  </GradientScrollArea>

                  <footer
                    className={cn(
                      "flex shrink-0 flex-col gap-6 border-t",
                      cookieUi.divider,
                      cookieUi.sectionX,
                      cookieUi.sectionY,
                    )}
                  >
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <Link
                        href={cookieConsentCopy.footer.privacyHref}
                        className={cookieUi.link}
                      >
                        {cookieConsentCopy.footer.privacyLabel}
                      </Link>
                      <Link
                        href={cookieConsentCopy.footer.cookieHref}
                        className={cookieUi.link}
                      >
                        {cookieConsentCopy.footer.cookieLabel}
                      </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleAcceptAll}
                        className={cookieUi.btnPrimary}
                      >
                        {cookieConsentCopy.panel.acceptAll}
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className={cookieUi.btnSecondary}
                      >
                        {cookieConsentCopy.panel.save}
                      </button>
                      <button
                        type="button"
                        onClick={handleRejectNonEssential}
                        className={cookieUi.btnSecondary}
                      >
                        {cookieConsentCopy.panel.rejectAll}
                      </button>
                    </div>
                  </footer>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {view === "dismissed" ? (
        <button
          type="button"
          onClick={() => setView("panel")}
          className={cn(
            "fixed bottom-4 left-4 z-[199] flex h-11 w-11 items-center justify-center rounded-full",
            "border border-[var(--wiro-cod-gray)]/10 bg-[var(--wiro-spring-wood)] text-[var(--wiro-cod-gray)]",
            "shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-90 md:bottom-6 md:left-6",
          )}
          aria-label={cookieConsentCopy.reopenLabel}
        >
          <CookieIcon size={18} />
        </button>
      ) : null}
    </>
  );
}
