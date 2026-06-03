import { COOKIE_CONSENT_VERSION } from "@/content/cookie-consent";

export type CookieCategoryId = "necessary" | "functional" | "analytics" | "marketing";

export type CookieConsentChoices = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  /** CCPA — Do Not Sell or Share */
  doNotSell: boolean;
};

export type CookieConsentRecord = {
  version: number;
  updatedAt: string;
  choices: CookieConsentChoices;
};

const STORAGE_KEY = "hoahwa-cookie-consent";

export const defaultCookieChoices = (): CookieConsentChoices => ({
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  doNotSell: false,
});

export const acceptAllCookieChoices = (): CookieConsentChoices => ({
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
  doNotSell: false,
});

export function readCookieConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCookieConsent(choices: CookieConsentChoices): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    choices,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(
      new CustomEvent("hoahwa:cookie-consent", { detail: record }),
    );
  }
  return record;
}

export function hasStoredConsent(): boolean {
  return readCookieConsent() !== null;
}
