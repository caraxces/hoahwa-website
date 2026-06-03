import { DecorativeBorderMarquee } from "@/components/layout/DecorativeBorderMarquee";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <DecorativeBorderMarquee />
      <SiteFooter />
    </>
  );
}
