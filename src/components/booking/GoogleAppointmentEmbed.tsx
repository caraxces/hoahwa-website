"use client";

import { useState, useSyncExternalStore } from "react";
import { bookingConsentNotice, toEmbeddableAppointmentUrl } from "@/content/booking";
import {
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
} from "@/lib/cookie-consent";

/**
 * Google Calendar booking page, embedded.
 *
 * The iframe is third-party and sets Google cookies, so it stays behind the
 * site's functional-cookie consent. A visitor who has not opted in sees a
 * placeholder and can either load it for this visit only or fall back to the
 * request form — the calendar is never loaded silently.
 */
export function GoogleAppointmentEmbed({
  url,
  onUseFormInstead,
}: {
  url: string;
  onUseFormInstead?: () => void;
}) {
  const stored = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot,
  );
  // Session-only override: "load it this once" without changing stored consent.
  const [allowedThisVisit, setAllowedThisVisit] = useState(false);

  const consented = stored?.choices.functional === true;
  const canEmbed = consented || allowedThisVisit;

  if (!canEmbed) {
    return (
      <div className="rounded-lg border border-[var(--wiro-romance)]/25 bg-[var(--wiro-romance)]/5 p-8 md:p-10">
        <h3 className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
          {bookingConsentNotice.title}
        </h3>
        <p className="mt-4 max-w-[560px] text-base leading-6 tracking-[-0.03em] opacity-75">
          {bookingConsentNotice.body}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setAllowedThisVisit(true)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-5 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
          >
            {bookingConsentNotice.loadLabel}
          </button>
          {onUseFormInstead ? (
            <button
              type="button"
              onClick={onUseFormInstead}
              className="inline-flex items-center justify-center rounded-full border border-current px-5 py-2.5 text-base tracking-[-0.03em] transition-opacity hover:opacity-70"
            >
              {bookingConsentNotice.formLabel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white">
      <iframe
        src={toEmbeddableAppointmentUrl(url)}
        title="Book a meeting with Hoahwa"
        // Google's booking page is tall; it scrolls internally below this.
        className="block h-[720px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
