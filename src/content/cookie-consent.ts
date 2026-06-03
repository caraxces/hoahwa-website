export const COOKIE_CONSENT_VERSION = 1;

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
  categories: [
    {
      id: "necessary" as const,
      label: "Strictly necessary",
      description:
        "Required for core site functions, security, and remembering your consent choices. Cannot be disabled.",
      required: true,
    },
    {
      id: "functional" as const,
      label: "Functional",
      description:
        "Enable enhanced features such as saved preferences, chat widgets, and embedded media.",
      required: false,
    },
    {
      id: "analytics" as const,
      label: "Analytics & performance",
      description:
        "Help us understand how visitors use the site (e.g. page views, errors) so we can improve performance.",
      required: false,
    },
    {
      id: "marketing" as const,
      label: "Marketing & targeting",
      description:
        "Used to deliver relevant ads, measure campaigns, and build audience insights across platforms.",
      required: false,
    },
  ],
  footer: {
    privacyLabel: "Privacy policy",
    privacyHref: "#",
  },
  reopenLabel: "Cookie settings",
};
