"use client";

import { useEffect } from "react";
import {
  readCookieConsent,
  type CookieConsentChoices,
  type CookieConsentRecord,
} from "@/lib/cookie-consent";

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "G-XW4CF8R5QJ";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MXMNQ7CL";

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

function injectScript(src: string) {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

let gaLoaded = false;

function loadGaOnce() {
  if (gaLoaded || !GA_ID) return;
  gaLoaded = true;
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

let gtmLoaded = false;

// Standard GTM bootstrap, deferred until consent is granted. The Consent Mode
// "default denied" signal is pushed to dataLayer before this runs, so any tag
// GTM fires already inherits the visitor's choices.
function loadGtmOnce() {
  if (gtmLoaded || !GTM_ID) return;
  gtmLoaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  injectScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
}

/**
 * Consent Mode v2, "advanced" implementation.
 *
 * gtag.js loads on every page view with every consent signal defaulted to
 * denied. In that state Google sets no cookies and stores no identifiers, but
 * it does receive cookieless pings, which is what lets GA4 model the traffic
 * of visitors who never touch the banner. (The previous "load nothing until
 * opt-in" gate meant those visitors were simply invisible — typically 40–70%
 * of sessions.) Consent is upgraded via `consent update` the moment a visitor
 * opts in, and the GTM container — which may carry non-Google tags that do not
 * honour Consent Mode — is still only injected after an opt-in.
 *
 * GA4 defaults to the G-XW4CF8R5QJ property and GTM to the GTM-MXMNQ7CL
 * container; override either with NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID.
 */
export function ConsentScripts() {
  useEffect(() => {
    if (!GA_ID && !GTM_ID) return;

    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      functionality_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });
    // url_passthrough keeps click/session context across pages without cookies.
    gtag("set", "url_passthrough", true);
    loadGaOnce();

    const apply = (choices: CookieConsentChoices) => {
      gtag("consent", "update", consentStates(choices));
      if (choices.analytics || (choices.marketing && !choices.doNotSell)) {
        loadGtmOnce();
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
