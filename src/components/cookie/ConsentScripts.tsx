"use client";

import { useEffect } from "react";
import {
  readCookieConsent,
  type CookieConsentChoices,
  type CookieConsentRecord,
} from "@/lib/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  void args;
  window.dataLayer = window.dataLayer ?? [];
  // gtag.js requires the Arguments object, not a spread array
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

function consentStates(choices: CookieConsentChoices) {
  const marketing = choices.marketing && !choices.doNotSell;
  return {
    analytics_storage: choices.analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
    functionality_storage: choices.functional ? "granted" : "denied",
    security_storage: "granted",
  };
}

let gaLoaded = false;

function loadGaOnce() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

/**
 * Consent Mode v2 gate: every signal defaults to denied, and gtag.js is only
 * injected after the visitor opts in to Analytics or Marketing. Set
 * NEXT_PUBLIC_GA4_ID to activate; without it this renders nothing.
 */
export function ConsentScripts() {
  useEffect(() => {
    if (!GA_ID) return;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      security_storage: "granted",
    });

    const apply = (choices: CookieConsentChoices) => {
      gtag("consent", "update", consentStates(choices));
      if (choices.analytics || (choices.marketing && !choices.doNotSell)) {
        loadGaOnce();
      }
    };

    const stored = readCookieConsent();
    if (stored) apply(stored.choices);

    const onConsent = (event: Event) => {
      const record = (event as CustomEvent<CookieConsentRecord>).detail;
      if (record?.choices) apply(record.choices);
    };

    window.addEventListener("hoahwa:cookie-consent", onConsent);
    return () => window.removeEventListener("hoahwa:cookie-consent", onConsent);
  }, []);

  return null;
}
