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
      "We use cookies to improve your experience, analyse traffic, and personalise content. You can choose which categories to allow.",
    customize: "Customize",
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
          duration: "12 months",
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
          name: "Embedded media (e.g. YouTube, Vimeo)",
          provider: "Google / Vimeo (third party)",
          purpose:
            "Set only when you play embedded video; remembers player settings.",
          duration: "Session – 6 months",
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
            "Distinguishes visitors and sessions to measure how the site is used. Loads only after you opt in.",
          duration: "Up to 24 months",
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
          name: "_fbp / li_sugr (when enabled)",
          provider: "Meta / LinkedIn (third party)",
          purpose:
            "Measures ad campaigns and builds audience insights. Loads only after you opt in.",
          duration: "3 – 12 months",
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
