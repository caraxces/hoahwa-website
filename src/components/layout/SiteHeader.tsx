"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { pillars, headerLinks } from "@/content/navigation";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import { MegaMenu } from "./MegaMenu";
import { PageContainer } from "@/components/shared/PageContainer";
import { MenuButton } from "@/components/motion/MenuButton";
import { cn } from "@/lib/cn";

function HoahwaLogo() {
  return (
    <Link
      href="/"
      className="group flex h-[30px] items-center"
      aria-label="Hoahwa home"
    >
      <motion.span
        className="text-[22px] font-semibold tracking-[-0.06em] text-[var(--wiro-romance)] transition-colors group-hover:text-[var(--hoahwa-accent)]"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        Hoahwa
      </motion.span>
    </Link>
  );
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group relative py-1", className)}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--hoahwa-accent)]"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
    </Link>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { hidden, scrolled } = useHeaderScroll();

  const toggleMenu = () => setMenuOpen((o) => !o);

  return (
    <>
      <motion.header
        data-testid="site-header"
        data-node-id="1:1221"
        className={cn(
          "fixed left-0 right-0 top-0 z-50 px-[var(--wiro-page-pad)] py-6 backdrop-blur-md transition-[background,box-shadow]",
          scrolled
            ? "bg-[rgba(21,21,21,0.92)] shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
            : "bg-[rgba(21,21,21,0.78)]",
        )}
        initial={{ y: 0 }}
        animate={{ y: hidden && !menuOpen ? "-100%" : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <PageContainer>
          <div className="flex items-center justify-between" data-node-id="1:1224">
            <div className="flex items-center gap-7" data-node-id="1:1226">
              <HoahwaLogo />
              <nav className="hidden items-center gap-6 lg:flex" data-node-id="1:1237">
                {pillars.map((p) => (
                  <NavLink
                    key={p.id}
                    href={p.href}
                    className="px-3 text-base tracking-[-0.03em] text-[var(--wiro-romance)]"
                  >
                    {p.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-9" data-node-id="1:1244">
              <nav className="hidden items-center gap-9 lg:flex">
                {headerLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    href={link.href}
                    className="text-base tracking-[-0.02em] text-[var(--wiro-romance)]"
                  >
                    {link.label === "Careers" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                          <motion.span
                            className="absolute inset-0 rounded-full bg-[rgba(219,226,104,0.42)]"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <span className="relative h-2.5 w-2.5 rounded-full bg-[rgba(219,226,104,0.96)]" />
                        </span>
                        Careers
                      </span>
                    ) : (
                      link.label
                    )}
                  </NavLink>
                ))}
              </nav>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:block"
              >
                <Link
                  href="/contact"
                  data-node-id="1:1260"
                  className="rounded-full bg-[var(--hoahwa-accent)] px-4 py-2 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
                >
                  Contact
                </Link>
              </motion.div>
              <MenuButton open={menuOpen} onClick={toggleMenu} />
            </div>
          </div>
        </PageContainer>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-[88px]" aria-hidden />

      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
