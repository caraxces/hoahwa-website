import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { ConsentScripts } from "@/components/cookie/ConsentScripts";
import { CookieConsentBanner } from "@/components/cookie/CookieConsentBanner";
import { FloatingVibeToggle } from "@/components/vibe/FloatingVibeToggle";
import { VibeProvider } from "@/components/vibe/VibeProvider";
import { vibeInitScript } from "@/lib/vibe-init-script";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const darleySans = localFont({
  src: "../../DarleySans-Regular.otf",
  variable: "--font-darley",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-hoahwa/hoahwa_logo_board-07.png",
    shortcut: "/logo-hoahwa/hoahwa_logo_board-03.png",
    apple: "/logo-hoahwa/hoahwa_logo_board-07.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "01deUYm_lrwd2GNfsvqNU--OOSgnQrgce04B-p_uW6Y",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-vibe="sunny"
      suppressHydrationWarning
      className={`${inter.variable} ${darleySans.variable} h-full`}
    >
      <head>
        {/* Warm up the analytics origin so consent-gated tags load faster. */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Script id="hoahwa-vibe-init" strategy="beforeInteractive">
          {vibeInitScript}
        </Script>
      </head>
      <body className="antialiased">
        <VibeProvider>
          <div className="site-shell">
            {children}
            <CookieConsentBanner />
            <ConsentScripts />
            <FloatingVibeToggle />
          </div>
        </VibeProvider>
      </body>
    </html>
  );
}
