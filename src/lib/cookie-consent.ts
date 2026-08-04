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

/* -------------------------------------------------------------------------- */
/*  useSyncExternalStore adapters                                             */
/* -------------------------------------------------------------------------- */

/**
 * `readCookieConsent` parses JSON, so it returns a fresh object every call —
 * passing it straight to useSyncExternalStore would re-render forever. These
 * cache the parsed record against the raw string and only re-parse when the
 * stored value actually changes, giving a referentially stable snapshot.
 */
let cachedRaw: string | null = null;
let cachedRecord: CookieConsentRecord | null = null;
let cachePrimed = false;

export function getCookieConsentSnapshot(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (cachePrimed && raw === cachedRaw) return cachedRecord;

  cachedRaw = raw;
  cachedRecord = readCookieConsent();
  cachePrimed = true;
  return cachedRecord;
}

/** Server/prerender snapshot: nothing is stored yet at build time. */
export function getCookieConsentServerSnapshot(): CookieConsentRecord | null {
  return null;
}

export function subscribeCookieConsent(onStoreChange: () => void): () => void {
  window.addEventListener("hoahwa:cookie-consent", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("hoahwa:cookie-consent", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

/* -------------------------------------------------------------------------- */
/*  Hydration gate                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Lets a component render nothing during prerender and only appear on the
 * client, without a setState-in-effect. Snapshot is `false` on the server and
 * `true` on the client; the store never emits, so this settles after hydration
 * and never changes again.
 */
const noopSubscribe = (): (() => void) => () => {};
const getHydratedSnapshot = () => true;
const getHydratedServerSnapshot = () => false;

export const hydrationStore = {
  subscribe: noopSubscribe,
  getSnapshot: getHydratedSnapshot,
  getServerSnapshot: getHydratedServerSnapshot,
};
