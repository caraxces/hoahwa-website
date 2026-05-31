"use client";

import { useState } from "react";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";
import { getEnabledNavLinks } from "@/content/portfolio/schema";
import { normalizeMediaUrl } from "@/lib/media-url";
import { PoweredByHoahwa } from "@/components/portfolio/PoweredByHoahwa";
import { HoahwaLogo } from "@/components/portfolio/HoahwaLogo";
import { usePortfolioInteractions } from "@/components/portfolio/usePortfolioInteractions";

function MediaImage({ src, alt, className, style }: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={normalizeMediaUrl(src)} alt={alt ?? ""} className={className} style={style} />
  );
}

function MediaVideo({ src, className, style }: { src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <video autoPlay muted loop playsInline aria-hidden className={className} style={style}>
      <source src={normalizeMediaUrl(src)} type="video/mp4" />
    </video>
  );
}

export function PortfolioPageClient({
  config,
  embedded = false,
}: {
  config: PortfolioPageConfig;
  /** When true, header/menu stay inside scroll container (builder preview). */
  embedded?: boolean;
}) {
  const { sections } = config;
  const navLinks = getEnabledNavLinks(sections);
  const [pricingTab, setPricingTab] = useState<"bundle" | "payg">("bundle");

  usePortfolioInteractions(config, { embedded });

  const header = sections.header;
  const hero = sections.hero;
  const features = sections.features;
  const howItWorks = sections.howItWorks;
  const infra = sections.infra;
  const stats = sections.stats;
  const integrations = sections.integrations;
  const testimonials = sections.testimonials;
  const pricing = sections.pricing;
  const cta = sections.cta;
  const footer = sections.footer;

  return (
    <div
      className={`portfolio-page relative min-h-screen overflow-x-hidden bg-black text-white antialiased${
        embedded ? " portfolio-page--embedded" : ""
      }`}
    >
      {header?.enabled ? (
        <header
          id="site-header"
          className={
            embedded
              ? "sticky top-0 z-20 w-full transition-all duration-500"
              : "fixed left-0 right-0 top-0 z-50 transition-all duration-500"
          }
        >
          <nav className="mx-auto max-w-[1400px] bg-transparent transition-all duration-500">
            <div className="flex h-20 items-center justify-between px-6 transition-all duration-500 lg-px-8">
              <a href="#" className="group flex items-center gap-2">
                <span className="font-display text-2xl tracking-tight transition-all duration-500">
                  <span className="text-pink">{header.brandPrimary}</span>
                  {header.brandAccent ? (
                    <span className="text-white">{header.brandAccent}</span>
                  ) : null}
                </span>
                {header.brandSuffix ? (
                  <span className="font-mono text-xs text-white-60 transition-all duration-500">{header.brandSuffix}</span>
                ) : null}
              </a>

              {header.statusText ? (
                <div className="status-pill hidden items-center gap-1-5 rounded-full border border-white-20 bg-white-5 px-3 py-1 text-11px font-mono text-white-50 transition-all duration-500 lg-flex">
                  <span className="text-emerald">●</span>
                  {header.statusText}
                  {header.statusSubtext ? <span style={{ opacity: 0.6 }}>{header.statusSubtext}</span> : null}
                </div>
              ) : null}

              <div className="nav-links hidden items-center gap-10 md-flex">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="nav-link group relative text-sm text-white-70 transition-colors duration-300">
                    {link.label}
                    <span className="nav-underline" />
                  </a>
                ))}
              </div>

              <div className="hidden items-center gap-4 md-flex">
                {header.langLabel ? (
                  <button type="button" className="lang-btn rounded-full border border-white-20 px-2-5 py-1 text-xs font-mono text-white-75 transition-all">
                    {header.langLabel}
                  </button>
                ) : null}
                <button type="button" className="cta-btn" id="nav-cta">
                  {header.ctaLabel}
                </button>
              </div>

              <button type="button" className="mobile-menu-btn p-2 text-white transition-colors duration-500 md-hidden" aria-label="Toggle menu" id="mobile-menu-toggle">
                ☰
              </button>
            </div>
          </nav>

          <div
            className={`mobile-menu pointer-events-none inset-0 z-40 bg-black opacity-0 transition-all duration-500 md-hidden ${
              embedded ? "absolute" : "fixed"
            }`}
            id="mobile-menu"
          >
            <div className="flex h-full flex-col px-8 pb-8 pt-28">
              <div className="flex flex-1 flex-col justify-center gap-8">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="mobile-nav-link font-display text-5xl text-white">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>
      ) : null}

      <main>
        {hero?.enabled ? (
          <section className="hero-section relative flex min-h-screen flex-col items-start justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
              <MediaVideo src={hero.videoUrl} className="h-full w-full object-cover object-center" style={{ opacity: 0.8 }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,.8), rgba(0,0,0,.4), transparent)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.3), transparent, rgba(0,0,0,.7))" }} />
            </div>

            <div className="relative z-10 w-full max-w-1400 px-6 py-32 lg-px-12 lg-py-40">
              <div style={{ maxWidth: "60%" }}>
                <div className="hero-badge anim-fade-up mb-8" style={{ animationDelay: ".1s" }}>
                  <span className="inline-flex items-center gap-3 font-mono text-sm text-white-60">
                    <span style={{ width: "2rem", height: "1px", background: "rgba(236,168,214,.6)", display: "inline-block" }} />
                    {hero.badge}
                  </span>
                </div>

                <h1 className="hero-title anim-fade-up mb-8 text-left font-display leading-none tracking-tight text-white" style={{ fontSize: "clamp(2rem,6vw,7rem)", lineHeight: 0.92, animationDelay: ".2s" }}>
                  <span className="block whitespace-nowrap">{hero.headline[0]}</span>
                  <span className="block whitespace-nowrap">
                    {hero.headline[1]}
                    <span className="blurred-text" id="hero-word">
                      {hero.rotatingWords[0]}
                    </span>
                  </span>
                  <span className="block whitespace-nowrap text-pink-80">{hero.headline[2]}</span>
                </h1>

                <p className="anim-fade-up mb-4 max-w-md text-lg leading-relaxed text-white-60" style={{ animationDelay: ".4s" }}>
                  {hero.body}
                </p>

                <div className="anim-fade-up code-block mt-10 max-w-lg overflow-hidden rounded-xl border border-white-10 bg-white-5 font-mono text-sm" style={{ animationDelay: ".6s", backdropFilter: "blur(8px)" }}>
                  <div className="flex items-center gap-2 border-b border-white-10 px-4 py-2" style={{ background: "rgba(255,255,255,.03)" }}>
                    <span className="ml-2 text-xs text-white-30">{hero.codeFileName}</span>
                  </div>
                  <div className="flex flex-col gap-1 px-5 py-4">
                    {hero.codeLines.map((line) => (
                      <div
                        key={line.text}
                        className="flex items-center gap-3"
                        style={{
                          color: line.type === "remove" ? "rgba(248,113,113,.8)" : line.type === "add" ? "#34d399" : "rgba(255,255,255,.3)",
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,.2)", userSelect: "none" }}>
                          {line.type === "comment" ? " " : line.type === "remove" ? "-" : "+"}
                        </span>
                        <span>{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="anim-fade-up mt-8 flex items-center gap-4" style={{ animationDelay: ".8s" }}>
                  <a id="hero-start-routing" href={hero.primaryCta.href} className="btn-primary group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black">
                    {hero.primaryCta.label} →
                  </a>
                  <a href={hero.secondaryCta.href} className="text-sm text-white-60 transition-colors hover-white">
                    {hero.secondaryCta.label}
                  </a>
                </div>
              </div>
            </div>

            <div className="anim-fade-in absolute bottom-12 left-0 right-0 px-6 lg-px-12" style={{ animationDelay: "1s" }}>
              <div className="max-w-1400 mx-auto flex items-start gap-10 lg-gap-20">
                {hero.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-2">
                    <span className="font-display text-4xl text-white">{stat.value}</span>
                    <span className="text-xs leading-tight text-white-50">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {features?.enabled ? (
          <section id="features" className="relative overflow-hidden bg-section-dark py-24 lg-py-32">
            <div className="max-w-1400 mx-auto px-6 lg-px-12">
              <div className="relative mb-24 lg-mb-32">
                <div className="grid items-end gap-8 lg-grid-cols-12">
                  <div style={{ gridColumn: "span 7" }}>
                    <span className="mb-6 inline-flex items-center gap-3 font-mono text-sm text-muted">
                      <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.3)", display: "inline-block" }} />
                      {features.eyebrow}
                    </span>
                    <h2 className="section-title anim-reveal" style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
                      {features.title}
                      <br />
                      <span className="text-muted">{features.titleMuted}</span>
                    </h2>
                  </div>
                  <div style={{ gridColumn: "span 5", paddingBottom: "1rem" }}>
                    <p className="anim-reveal-delay text-xl leading-relaxed text-muted">{features.lead}</p>
                  </div>
                </div>
              </div>

              <div className="features-grid grid gap-4 lg-grid-cols-2 lg-gap-6">
                {features.items.map((item, i) => (
                  <div key={item.number} className="feature-card anim-reveal-up group relative min-h-320 overflow-hidden border border-foreground-10 bg-black" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative z-10 flex h-full flex-col p-8 lg-p-10">
                      <div className="mb-6 flex items-start justify-between">
                        <span className="font-mono text-xs text-muted">{item.number}</span>
                        <span className="feature-tag">{item.tag}</span>
                      </div>
                      <h3 className="font-display mt-2 mb-4 text-2xl lg-text-3xl">{item.title}</h3>
                      <p className="flex-1 leading-relaxed text-muted">{item.body}</p>
                      <div className="mt-8 border-t border-foreground-10 pt-6">
                        <span className="font-display text-5xl text-pink">{item.statValue}</span>
                        <span className="mt-1 block font-mono text-sm text-muted">{item.statLabel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {howItWorks?.enabled ? (
          <section id="how-it-works" className="relative overflow-hidden py-24 lg-py-32" style={{ background: "oklch(0.09 0.01 260)", color: "white" }}>
            <div className="relative z-10 max-w-1400 mx-auto px-6 lg-px-12">
              <div className="mb-0 grid items-end gap-4 lg-grid-cols-2 lg-gap-12">
                <div style={{ paddingBottom: "8rem", overflow: "hidden" }}>
                  <span className="mb-8 inline-flex items-center gap-3 font-mono text-sm" style={{ color: "rgba(255,255,255,.4)" }}>
                    <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.2)", display: "inline-block" }} />
                    {howItWorks.eyebrow}
                  </span>
                  <h2 className="anim-reveal font-display tracking-tight" style={{ fontSize: "clamp(3rem,10vw,8rem)", lineHeight: 0.85 }}>
                    {howItWorks.titleLines.map((line, i) => (
                      <span key={line} className="block" style={{ color: i === 0 ? "#fff" : i === 1 ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.1)" }}>
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>
                <div className="anim-fade-in-delay relative overflow-hidden" style={{ height: 640 }}>
                  <MediaImage src={howItWorks.imageUrl} alt="" aria-hidden style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} />
                </div>
              </div>

              <div className="hiw-grid grid gap-4 lg-grid-cols-3">
                {howItWorks.steps.map((step, i) => (
                  <button
                    key={step.number}
                    type="button"
                    className={`hiw-step relative border p-8 text-left transition-all duration-500 lg-p-12 ${i === 0 ? "hiw-step-active" : ""}`}
                    style={{ background: "#000", borderColor: i === 0 ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.25)" }}
                  >
                    <div className="mb-8 flex items-center gap-4">
                      <span className="text-4xl font-display" style={{ color: i === 0 ? "#eca8d6" : "rgba(255,255,255,.2)" }}>
                        {step.number}
                      </span>
                      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,.1)" }} />
                    </div>
                    <h3 className="font-display mb-2 text-3xl lg-text-4xl">{step.title}</h3>
                    <span className="font-display mb-6 block text-xl" style={{ color: "rgba(255,255,255,.4)" }}>
                      {step.subtitle}
                    </span>
                    <p className="hiw-desc leading-relaxed" style={{ color: "rgba(255,255,255,.6)", opacity: i === 0 ? 1 : 0.6 }}>
                      {step.body}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0" style={{ height: "4px", background: "#eca8d6", transformOrigin: "left", transform: i === 0 ? "scaleX(1)" : "scaleX(0)", transition: "transform .5s" }} />
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {infra?.enabled ? (
          <section id="infra" className="relative overflow-hidden bg-section-dark py-32 lg-py-40">
            <div className="max-w-1400 mx-auto px-6 lg-px-12">
              <div className="mb-20">
                <span className="anim-fade-in mb-8 inline-flex items-center gap-4 font-mono text-sm text-muted">
                  <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.2)", display: "inline-block" }} />
                  {infra.eyebrow}
                </span>
                <div className="grid items-stretch gap-8 lg-grid-cols-auto-1fr lg-gap-16">
                  <div className="anim-reveal-up" style={{ width: "clamp(12rem,20vw,20rem)", flexShrink: 0 }}>
                    <MediaImage src={infra.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="section-title anim-reveal" style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
                      {infra.title}
                      <br />
                      <span className="text-muted">{infra.titleMuted}</span>
                    </h2>
                    <p className="anim-fade-in-delay mt-8 max-w-lg text-xl leading-relaxed text-muted">{infra.lead}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg-grid-cols-3">
                <div className="anim-reveal-up relative overflow-hidden border border-foreground-10 p-8 lg-col-span-2 lg-p-12" style={{ background: "rgba(255,255,255,.02)" }}>
                  <div className="relative z-10">
                    <div className="mb-4 flex items-baseline gap-2">
                      <span style={{ fontSize: "10rem", fontFamily: "Instrument Serif, serif", lineHeight: 1 }}>{infra.mainStat.value}</span>
                      <span className="text-2xl text-muted">{infra.mainStat.unit}</span>
                    </div>
                    <p className="max-w-md text-muted">{infra.mainStat.label}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  {infra.sideStats.map((s, i) => (
                    <div key={s.label} className="anim-reveal-up border border-foreground-10 p-8" style={{ background: "rgba(255,255,255,.02)", transitionDelay: `${(i + 1) * 100}ms` }}>
                      <span className="font-display text-6xl">{s.value}</span>
                      <span className="mt-2 block text-sm text-muted">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="anim-fade-in-delay mt-12 grid grid-cols-2 gap-4 lg-grid-cols-4">
                {infra.regions.map((region) => (
                  <div key={region.name} className="region-card cursor-default border p-6" style={{ borderColor: region.active ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.1)", background: region.active ? "rgba(255,255,255,.04)" : undefined }}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`node-indicator ${region.active ? "active" : ""}`} />
                      <span className="font-mono text-xs uppercase tracking-wider text-muted">operational</span>
                    </div>
                    <span className="mb-1 block font-medium">{region.name}</span>
                    <span className="text-sm text-muted">{region.nodes}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {stats?.enabled ? (
          <section className="relative overflow-hidden bg-section-darker py-32 lg-py-40">
            <div className="relative z-10 max-w-1400 mx-auto px-6 lg-px-12">
              <div className="mb-20 grid gap-8 lg-mb-32 lg-grid-cols-12">
                <div style={{ gridColumn: "span 8" }}>
                  {stats.liveLabel ? (
                    <span className="mb-6 inline-flex items-center gap-2 px-3 py-1 font-mono text-xs" style={{ background: "rgba(236,168,214,.1)", color: "#eca8d6" }}>
                      ● {stats.liveLabel}
                    </span>
                  ) : null}
                  <h2 className="section-title anim-reveal" style={{ fontSize: "clamp(3rem,10vw,8.75rem)" }}>
                    {stats.title}
                    <br />
                    <span className="text-muted">{stats.titleMuted}</span>
                  </h2>
                </div>
              </div>

              <div className="anim-fade-in-delay mb-0 w-full">
                <MediaImage src={stats.graphImageUrl} alt="" aria-hidden style={{ width: "100%", height: "auto", objectFit: "cover" }} />
              </div>

              <div className="mt-6 grid gap-6 lg-grid-cols-3">
                {stats.blocks.map((block, i) => (
                  <div key={block.label} className="stats-card anim-reveal-up border border-foreground-10 p-8 lg-p-14" style={{ background: "rgba(255,255,255,.02)", transitionDelay: `${i * 100}ms` }}>
                    <div className="font-display mb-4 overflow-hidden whitespace-nowrap text-6xl tracking-tight">
                      {block.prefix ? <span className="mr-1 text-muted">{block.prefix}</span> : null}
                      <span className="stat-num tabular-nums">{block.value}</span>
                      {block.suffix ? <span className="text-muted">{block.suffix}</span> : null}
                    </div>
                    <div className="mb-2 text-lg">{block.label}</div>
                    <div className="font-mono text-sm text-muted">{block.sublabel}</div>
                  </div>
                ))}
              </div>

              <div className="anim-fade-in-delay mt-16 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-foreground-10 pt-8 font-mono text-sm text-muted">
                {stats.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {integrations?.enabled ? (
          <section id="integrations" className="relative overflow-hidden bg-section-dark">
            <div className="relative z-10 pt-32 text-center lg-pt-40">
              <span className="anim-fade-in mb-8 inline-flex items-center justify-center gap-4 font-mono text-sm text-muted">
                <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.2)", display: "inline-block" }} />
                {integrations.eyebrow}
                <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.2)", display: "inline-block" }} />
              </span>
              <h2 className="section-title anim-reveal mx-auto" style={{ fontSize: "clamp(3rem,10vw,8rem)" }}>
                {integrations.title}
                <br />
                <span className="text-muted">{integrations.titleMuted}</span>
              </h2>
              <p className="anim-fade-in-delay mx-auto mt-8 max-w-lg px-4 text-xl leading-relaxed text-muted">{integrations.lead}</p>
            </div>

            <div className="anim-fade-in-delay relative -mt-16 w-screen" style={{ left: "50%", transform: "translateX(-50%)" }}>
              <MediaImage src={integrations.bannerImageUrl} alt="" aria-hidden style={{ width: "100%", height: "auto", objectFit: "cover" }} />
            </div>

            <div className="relative z-10 -mt-24 max-w-1400 mx-auto px-6 pb-24 lg-px-12 lg--mt-24">
              <div className="mb-16 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {integrations.items.map((item, i) => (
                  <div
                    key={item.name}
                    className="integration-card anim-reveal-up group relative cursor-default overflow-hidden border p-4 sm:p-6 lg:p-8"
                    style={{ transitionDelay: `${300 + i * 30}ms` }}
                  >
                    <span className="integration-tag absolute right-3 top-3">{item.tag}</span>
                    <div className="integration-icon mb-4 flex h-12 w-12 items-center justify-center sm:mb-6 sm:h-14 sm:w-14">
                      {item.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={normalizeMediaUrl(item.logoUrl)}
                          alt=""
                          aria-hidden
                          className="integration-logo max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span aria-hidden>◆</span>
                      )}
                    </div>
                    <span className="block text-sm font-medium sm:text-base">{item.name}</span>
                    <div className="integration-bar-wrapper">
                      <div className="integration-bar" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {testimonials?.enabled ? (
          <section className="relative overflow-hidden py-32 lg-py-40" style={{ background: "#eca8d6", color: "black" }}>
            <div className="relative z-10 max-w-1400 mx-auto px-6 lg-px-12">
              <div className="mb-20 flex items-center justify-between">
                <div>
                  <span className="mb-4 inline-flex items-center gap-3 font-mono text-sm" style={{ color: "rgba(0,0,0,.4)" }}>
                    <span style={{ width: "3rem", height: "1px", background: "rgba(0,0,0,.2)", display: "inline-block" }} />
                    {testimonials.eyebrow}
                  </span>
                  <h2 className="anim-reveal font-display text-4xl lg-text-5xl" style={{ color: "black" }}>
                    {testimonials.title}
                    <span style={{ color: "rgba(0,0,0,.4)" }}>{testimonials.titleMuted}</span>
                  </h2>
                </div>
                <div className="hidden items-center gap-2 lg-flex">
                  <button type="button" className="testimonial-prev border p-4" style={{ borderColor: "rgba(0,0,0,.2)" }} id="testimonial-prev">
                    ←
                  </button>
                  <button type="button" className="testimonial-next border p-4" style={{ borderColor: "rgba(0,0,0,.2)" }} id="testimonial-next">
                    →
                  </button>
                </div>
              </div>

              <div className="grid gap-12 lg-grid-cols-12 lg-gap-20">
                <div className="relative lg-col-span-7">
                  <blockquote className="font-display text-3xl leading-tight tracking-tight lg-text-5xl" id="testimonial-quote">
                    {testimonials.items[0]?.quote}
                  </blockquote>
                  <div className="mt-12 flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(0,0,0,.1)" }}>
                      <span className="font-display text-xl" id="testimonial-avatar">
                        {testimonials.items[0]?.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-medium" id="testimonial-name">
                        {testimonials.items[0]?.name}
                      </p>
                      <p id="testimonial-role" style={{ color: "rgba(0,0,0,.6)" }}>
                        {testimonials.items[0]?.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6 lg-col-span-5">
                  <div className="anim-fade-in border p-10" style={{ background: "rgba(0,0,0,.05)", borderColor: "rgba(0,0,0,.2)" }}>
                    <span className="font-display mb-4 block text-8xl">{testimonials.sideStat.value}</span>
                    <span className="text-lg" style={{ color: "rgba(0,0,0,.6)" }}>
                      {testimonials.sideStat.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {testimonials.items.map((_, i) => (
                      <button key={i} type="button" className="testimonial-indicator h-1 flex-1 overflow-hidden border-0" style={{ background: "rgba(0,0,0,.2)" }}>
                        <div className="h-full" style={{ background: "black", width: i === 0 ? "100%" : "0%" }} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-6" style={{ borderColor: "rgba(0,0,0,.1)" }}>
                    <span className="mb-4 block font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(0,0,0,.3)" }}>
                      Featured companies
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {testimonials.companies.map((company, i) => (
                        <button key={company} type="button" className="border px-4 py-2 text-sm" style={{ borderColor: i === 0 ? "rgba(0,0,0,.4)" : "rgba(0,0,0,.1)", color: i === 0 ? "black" : "rgba(0,0,0,.4)" }}>
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {pricing?.enabled ? (
          <section id="pricing" className="relative bg-section-dark py-32 lg-py-40">
            <div className="max-w-1400 mx-auto px-6 lg-px-12">
              <div className="mb-16 grid gap-8 lg-grid-cols-12">
                <div style={{ gridColumn: "span 8" }}>
                  <span className="mb-8 inline-flex items-center gap-3 font-mono text-sm text-muted">
                    <span style={{ width: "3rem", height: "1px", background: "rgba(255,255,255,.3)", display: "inline-block" }} />
                    {pricing.eyebrow}
                  </span>
                  <h2 className="section-title anim-reveal" style={{ fontSize: "clamp(3rem,7vw,6.25rem)" }}>
                    {pricing.title}
                    <br />
                    <span className="text-stroke">{pricing.titleMuted}</span>
                  </h2>
                  <p className="anim-fade-in-delay mt-8 max-w-2xl text-xl text-muted">{pricing.lead}</p>
                </div>
                <div className="anim-fade-in-delay flex items-start justify-end" style={{ gridColumn: "span 4", paddingTop: "1rem" }}>
                  <div className="pricing-toggle inline-flex items-center gap-3 rounded-full border border-foreground-10 p-1" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" }}>
                    <button type="button" className={`pricing-tab rounded-full px-6 py-2-5 font-mono text-sm ${pricingTab === "bundle" ? "pricing-tab-active" : "text-muted"}`} onClick={() => setPricingTab("bundle")}>
                      {pricing.bundleTabLabel}
                    </button>
                    <button type="button" className={`pricing-tab rounded-full px-6 py-2-5 font-mono text-sm ${pricingTab === "payg" ? "pricing-tab-active" : "text-muted"}`} onClick={() => setPricingTab("payg")}>
                      {pricing.paygTabLabel}
                    </button>
                  </div>
                </div>
              </div>

              {pricingTab === "bundle" ? (
                <>
                  <div className="mb-12 rounded-2xl border border-foreground-10 p-6" style={{ background: "rgba(255,255,255,.05)" }}>
                    <h4 className="font-display mb-4 text-lg">{pricing.rulesTitle}</h4>
                    <ul className="grid gap-4 text-sm text-muted md-grid-cols-2">
                      {pricing.rules.map((rule) => (
                        <li key={rule} className="flex items-start gap-2">
                          <span className="text-emerald">✓</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-4 md-grid-cols-2 lg-grid-cols-5">
                    {pricing.bundlePlans.map((plan) => (
                      <div key={plan.name} className={`pricing-card relative flex flex-col overflow-hidden rounded-2xl border bg-background ${plan.popular ? "pricing-popular" : "border-foreground-10"}`} style={plan.popular ? { transform: "scale(1.05)", zIndex: 10, borderColor: "#eca8d6", boxShadow: "0 0 30px rgba(236,168,214,.15)" } : undefined}>
                        {plan.badge ? <div className="pricing-popular-badge flex items-center justify-center gap-1">{plan.badge}</div> : null}
                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="font-display mb-1 text-2xl">{plan.name}</h3>
                          <div className="mb-6 text-sm text-muted">{plan.duration}</div>
                          <div className="font-display mb-8 text-3xl text-pink">{plan.price}</div>
                          <ul className="pricing-features mb-8 flex-1 space-y-4">
                            {plan.features.map((f) => (
                              <li key={f.label} className="flex flex-col gap-1">
                                <span className="feature-label">{f.label}</span>
                                <span className="feature-value">{f.value}</span>
                              </li>
                            ))}
                            {plan.footnote ? (
                              <li className="flex flex-col gap-1 border-t border-foreground-10 pt-4">
                                <span className="text-xs leading-relaxed text-muted">{plan.footnote}</span>
                              </li>
                            ) : null}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="grid gap-4 md-grid-cols-2 lg-grid-cols-3">
                  {pricing.paygPlans.map((plan) => (
                    <div key={plan.name} className={`pricing-card relative flex flex-col overflow-hidden rounded-2xl border bg-background ${plan.popular ? "pricing-popular border-foreground-10" : "border-foreground-10"}`} style={plan.popular ? { borderColor: "#eca8d6", boxShadow: "0 0 30px rgba(236,168,214,.15)" } : undefined}>
                      {plan.badge ? <div className="pricing-popular-badge flex items-center justify-center gap-1">{plan.badge}</div> : null}
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display mb-1 text-2xl">{plan.name}</h3>
                        <div className="mb-6 text-sm text-muted">{plan.duration}</div>
                        <div className="font-display mb-8 text-3xl text-pink">{plan.price}</div>
                        <ul className="pricing-features mb-8 flex-1 space-y-4">
                          {plan.features.map((f) => (
                            <li key={f.label} className="flex flex-col gap-1">
                              <span className="feature-label">{f.label}</span>
                              <span className="feature-value">{f.value}</span>
                            </li>
                          ))}
                          {plan.footnote ? (
                            <li className="flex flex-col gap-1 border-t border-foreground-10 pt-4">
                              <span className="text-xs text-muted">{plan.footnote}</span>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="anim-fade-in-delay mt-24 flex flex-col items-center justify-between gap-8 border-t border-foreground-10 pt-12 md-flex-row">
                <div className="text-center md-text-left">
                  <h4 className="font-display mb-2 text-xl">{pricing.contactTitle}</h4>
                  <p className="text-sm text-muted">{pricing.contactLead}</p>
                </div>
                <div className="flex w-full flex-col gap-4 sm-flex-row md-w-auto">
                  {pricing.contactLinks.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={link.variant === "primary" ? "contact-btn-primary flex items-center justify-center gap-2 rounded-full px-8 py-4 text-center font-bold" : "contact-btn-secondary flex items-center justify-center gap-2 rounded-full px-8 py-4 text-center font-bold"}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {cta?.enabled ? (
          <section className="relative overflow-hidden bg-section-darker py-24 lg-py-32">
            <div className="max-w-1400 mx-auto px-6 lg-px-12">
              <div className="anim-reveal-up relative border border-foreground">
                <div className="relative z-10 px-8 py-16 lg-px-16 lg-py-24">
                  <div className="flex flex-col items-center justify-between gap-12 lg-flex-row">
                    <div style={{ flex: 1 }}>
                      <h2 className="font-display mb-8 text-6xl tracking-tight lg-text-7xl" style={{ lineHeight: 0.95, whiteSpace: "pre-line" }}>
                        {cta.title}
                      </h2>
                      <p className="mb-12 max-w-xl text-xl leading-relaxed text-muted">{cta.body}</p>
                      <div className="flex flex-col items-start gap-4 sm-flex-row">
                        <button type="button" className="btn-cta-primary group h-14 rounded-full px-8" id="cta-start-free">
                          {cta.primaryCta} →
                        </button>
                        <button type="button" className="btn-cta-secondary h-14 rounded-full px-8">
                          {cta.secondaryCta}
                        </button>
                      </div>
                      <p className="mt-8 font-mono text-sm text-muted">{cta.footnote}</p>
                    </div>
                    <div className="hidden items-end justify-center lg-flex" style={{ width: 600, height: 650, marginRight: "-4rem" }}>
                      <MediaImage src={cta.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {footer?.enabled ? (
          <footer className="relative bg-black">
            <div className="relative w-full overflow-hidden" style={{ height: "clamp(200px,30vw,420px)" }}>
              <MediaImage src={footer.bannerImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, transparent, black)" }} />
            </div>

            <div className="relative z-10 max-w-1400 mx-auto px-6 lg-px-12">
              <div className="py-16 lg-py-20">
                <div className="grid grid-cols-2 gap-12 md-grid-cols-6 lg-gap-8">
                  <div style={{ gridColumn: "span 2" }}>
                    <a href="#" className="mb-6 inline-flex items-center gap-2">
                      <span className="font-display text-2xl text-white">
                        <span className="text-pink">{footer.brandPrimary}</span>
                        {footer.brandAccent ? footer.brandAccent : null}
                      </span>
                      {footer.brandSuffix ? <span className="font-mono text-xs text-white-40">{footer.brandSuffix}</span> : null}
                    </a>
                    <p className="mb-8 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,.5)" }}>
                      {footer.description}
                    </p>
                    <div className="flex gap-6">
                      {footer.socialLinks.map((link) => (
                        <a key={link.label} href={link.href} className="footer-social-link">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {footer.linkGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="mb-6 text-sm font-medium text-white">{group.title}</h3>
                      <ul className="space-y-4">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="footer-link">
                              {link.label}
                              {link.badge ? (
                                <span className="ml-1 rounded-full px-2 py-0-5 text-xs text-black" style={{ background: "#eca8d6" }}>
                                  {link.badge}
                                </span>
                              ) : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 border-t py-8 md-flex-row" style={{ borderColor: "rgba(255,255,255,.1)" }}>
                <p className="text-sm" style={{ color: "rgba(255,255,255,.3)" }}>
                  {footer.copyright}
                </p>
                {footer.statusText ? (
                  <span className="flex items-center">
                    <HoahwaLogo className="h-7 w-auto opacity-70 sm:h-8" width={160} height={42} href="https://hoahwa.com/" />
                  </span>
                ) : null}
              </div>
            </div>
          </footer>
        ) : null}
      </main>

      <PoweredByHoahwa compact={embedded} />
    </div>
  );
}
