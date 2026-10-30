export const COOKIE_CONSENT_VERSION = 1;

export type CookieDetail = {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
};

export const cookieConsentCopy = {
  bar: {
    message:
      "We use essential local storage for your preferences and optional technologies for analytics and features such as the booking calendar and embedded videos. You can choose which categories to allow.",
    customize: "Customize",
    rejectAll: "Reject all",
    acceptAll: "Accept all",
  },
  panel: {
    title: "Cookie preferences",
    intro:
      "Manage how Hoahwa uses cookies and similar technologies. Strictly necessary cookies are always active so the site works. Other categories are optional and align with GDPR and CCPA requirements.",
    necessaryLabel: "Always on",
    rejectAll: "Reject non-essential",
    save: "Save preferences",
    acceptAll: "Accept all",
    close: "Close",
  },
  ccpa: {
    title: "California privacy (CCPA)",
    description:
      "If you are a California resident, you may opt out of the sale or sharing of personal information used for cross-context behavioural advertising.",
    doNotSell: "Do Not Sell or Share My Personal Information",
  },
  detailsToggle: {
    show: "View cookie details",
    hide: "Hide cookie details",
  },
  emptyCategoryNote:
    "No cookies in this category are set today. Any future tools will be listed here and will only load after you opt in.",
  categories: [
    {
      id: "necessary" as const,
      label: "Strictly necessary",
      description:
        "Required for core site functions, security, and remembering your consent choices. Cannot be disabled.",
      required: true,
      details: [
        {
          name: "hoahwa-cookie-consent",
          provider: "Hoahwa (first party, localStorage)",
          purpose: "Stores your cookie preferences so we don't ask again.",
          duration: "Until you clear site data or we change the consent-record version",
        },
        {
          name: "hoahwa-vibe",
          provider: "Hoahwa (first party, localStorage)",
          purpose: "Stores your selected site visual theme.",
          duration: "Until you clear site data or change the theme",
        },
      ] as CookieDetail[],
    },
    {
      id: "functional" as const,
      label: "Functional",
      description:
        "Enable enhanced features such as saved preferences, chat widgets, and embedded media.",
      required: false,
      details: [
        {
          name: "Google Calendar booking page (when available)",
          provider: "Google Calendar (third party)",
          purpose:
            "Loads only after you allow Functional cookies or choose to load the calendar for this visit; Google may set its own cookies.",
          duration: "Set by Google; see Google's policies",
        },
        {
          name: "YouTube privacy-enhanced player (where present)",
          provider: "YouTube (third party)",
          purpose:
            "Article videos stay behind a placeholder and never load with the page. A video loads only after you allow Functional cookies or click \"Load video\" on that video; from that point YouTube may receive request data and set its own storage.",
          duration: "Set by YouTube; see YouTube's policies",
        },
      ] as CookieDetail[],
    },
    {
      id: "analytics" as const,
      label: "Analytics & performance",
      description:
        "Help us understand how visitors use the site (e.g. page views, errors) so we can improve performance.",
      required: false,
      details: [
        {
          name: "_ga, _ga_*",
          provider: "Google Analytics 4 (third party)",
          purpose:
            "When Analytics is allowed, distinguishes visitors and sessions. Before consent, Google Consent Mode is denied and GA4 sends cookieless measurement pings without analytics cookies or identifiers.",
          duration: "Set by Google; see Google's policies",
        },
      ] as CookieDetail[],
    },
    {
      id: "marketing" as const,
      label: "Marketing & targeting",
      description:
        "Used to deliver relevant ads, measure campaigns, and build audience insights across platforms.",
      required: false,
      details: [
        {
          name: "Google Tag Manager container",
          provider: "Google (third party)",
          purpose:
            "Loads after Analytics or Marketing is allowed. Tags configured in the container may set their own cookies.",
          duration: "Varies by configured tag",
        },
      ] as CookieDetail[],
    },
  ],
  footer: {
    privacyLabel: "Privacy policy",
    privacyHref: "/privacy",
    cookieLabel: "Cookie policy",
    cookieHref: "/cookie-policy",
  },
  reopenLabel: "Cookie settings",
};
