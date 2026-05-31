export const HOSTINGER_REFERRAL_URL =
  "https://www.hostinger.com?REFERRALCODE=J5JLARISAI6H";

export const PORTFOLIO_RETENTION_DAYS = 100;

/** WhatsApp IT support (Truc Mai) — password recovery opens wa.me directly */
export const WHATSAPP_SUPPORT_NUMBER = "84924769556";

export const builderCopy = {
  title: ["Create your", "landing page"] as const,
  lead:
    "Build a personal portfolio page with the Hoahwa layout. Your images and videos stay on your CDN or Google Drive — we never host your media files.",
  hostinger: {
    title: "Get your domain & hosting",
    body:
      "Use your own domain with Hostinger from $40/year (referral link below). Or register via WhatsApp to keep your page published on Hoahwa after the 100-day period — $1/month so we can cover hosting maintenance.",
    cta: "View Hostinger plans",
    whatsappCta: "Publish renewal via WhatsApp",
    note: "After Hostinger purchase, point your domain and publish your slug. WhatsApp renewal keeps your page live on hoahwa.com after 100 days.",
  },
  privacy: {
    title: "Your data stays yours",
    points: [
      "We do not sell or share your personal information with third parties for marketing.",
      "We do not use email marketing — account recovery is via WhatsApp support tickets only.",
      "WhatsApp is used only for password recovery and IT support you request.",
      "Landing pages are stored for 100 days, then removed unless you renew by saving again.",
    ],
  },
  auth: {
    registerTitle: "Create account",
    loginTitle: "Sign in",
    forgotTitle: "Forgot password?",
    forgotBody:
      "We don't send reset emails. Send a WhatsApp message with your username — our IT team will verify and help you.",
  },
};
