"use client";

import { usePathname } from "next/navigation";
import { VibeToggleWithToast } from "./VibeToggleWithToast";

/** Fixed toggle for routes without SiteHeader (portfolio /p/*). */
export function FloatingVibeToggle() {
  const pathname = usePathname();
  const isPortfolioRoute =
    pathname?.startsWith("/p/") || pathname?.startsWith("/portfolio/");

  if (!isPortfolioRoute) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <VibeToggleWithToast variant="floating" toastPlacement="above" />
    </div>
  );
}
