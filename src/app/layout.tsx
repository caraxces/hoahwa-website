import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DecorativeBorderMarquee } from "@/components/layout/DecorativeBorderMarquee";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hoahwa | eCommerce Growth Specialists",
  description:
    "Hoahwa is a multi-award-winning eCommerce Growth Agency specialising in Shopify Plus for ambitious home and lifestyle brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <DecorativeBorderMarquee />
        <SiteFooter />
      </body>
    </html>
  );
}
