import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { DecorativeBorderMarquee } from "@/components/layout/DecorativeBorderMarquee";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
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
  title: "Hoahwa | High-End Web Design & Development",
  description:
    "Hoahwa is a young, dynamic web design & development agency. We offer direct client collaboration, maximum cost-efficiency, and top-tier technical compatibility, aiming for prestigious global design awards.",
  icons: {
    icon: "/LOGO HOAHWA/hoahwa_logo_board-07.png",
    shortcut: "/LOGO HOAHWA/hoahwa_logo_board-03.png",
    apple: "/LOGO HOAHWA/hoahwa_logo_board-07.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${darleySans.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <DecorativeBorderMarquee />
        <SiteFooter />
      </body>
    </html>
  );
}
