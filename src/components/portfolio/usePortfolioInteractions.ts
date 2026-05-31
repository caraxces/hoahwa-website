"use client";

import { useEffect } from "react";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";

export function usePortfolioInteractions(
  config: PortfolioPageConfig,
  options?: { embedded?: boolean },
) {
  const embedded = options?.embedded ?? false;
  const heroWords = config.sections.hero?.rotatingWords ?? [];
  const testimonials = config.sections.testimonials?.items ?? [];
  const hiwSteps = config.sections.howItWorks?.steps?.length ?? 0;

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;

    const scrollRoot = embedded
      ? header.closest(".portfolio-preview-embedded")?.querySelector(".overflow-auto")
      : null;

    const onScroll = () => {
      const y = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
      header.classList.toggle("scrolled", y > 60);
    };

    const target = scrollRoot ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener("scroll", onScroll);
  }, [embedded]);

  useEffect(() => {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    let open = false;
    const setOpen = (next: boolean) => {
      open = next;
      menu.style.opacity = open ? "1" : "0";
      menu.style.pointerEvents = open ? "all" : "none";
      menu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };

    const onToggle = () => setOpen(!open);
    toggle.addEventListener("click", onToggle);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

    return () => {
      toggle.removeEventListener("click", onToggle);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll(
      ".portfolio-page .anim-reveal, .portfolio-page .anim-reveal-up, .portfolio-page .anim-reveal-delay, .portfolio-page .anim-fade-up, .portfolio-page .anim-fade-in, .portfolio-page .anim-fade-in-delay, .portfolio-page .anim-slide-left",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el) => observer.observe(el));

    setTimeout(() => {
      document
        .querySelectorAll(".portfolio-page .hero-section .anim-fade-up, .portfolio-page .hero-section .anim-fade-in")
        .forEach((el) => el.classList.add("in-view"));
    }, 100);

    return () => observer.disconnect();
  }, [config.slug]);

  useEffect(() => {
    const container = document.getElementById("hero-word");
    if (!container || heroWords.length === 0) return;

    const colors = [
      ["#eca8d6", "#a78bfa", "#67e8f9", "#fbbf24", "#eca8d6"],
      ["#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#34d399"],
    ];
    let wordIndex = 0;

    const renderWord = (word: string, palette: string[]) => {
      container.innerHTML = "";
      const charCount = word.length;
      [...word].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.filter = "blur(20px)";
        span.style.color = palette[i % palette.length];
        span.style.transition = `opacity 0.4s ease ${i * 60}ms, filter 0.4s ease ${i * 60}ms, color 0.6s ease`;
        container.appendChild(span);
      });
      requestAnimationFrame(() => {
        container.querySelectorAll("span").forEach((span) => {
          const el = span as HTMLElement;
          el.style.opacity = "1";
          el.style.filter = "blur(0)";
        });
        const settleMs = (charCount - 1) * 60 + 450;
        setTimeout(() => {
          container.querySelectorAll("span").forEach((span) => {
            (span as HTMLElement).style.color = "#ffffff";
          });
        }, settleMs);
      });
    };

    const exitWord = (cb: () => void) => {
      container.querySelectorAll("span").forEach((span, i) => {
        (span as HTMLElement).style.transition = `opacity 0.3s ease ${i * 30}ms, filter 0.3s ease ${i * 30}ms`;
        (span as HTMLElement).style.opacity = "0";
        (span as HTMLElement).style.filter = "blur(20px)";
      });
      setTimeout(cb, 500);
    };

    renderWord(heroWords[0], colors[0]);
    const interval = setInterval(() => {
      exitWord(() => {
        wordIndex = (wordIndex + 1) % heroWords.length;
        renderWord(heroWords[wordIndex], colors[wordIndex % colors.length]);
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [heroWords]);

  useEffect(() => {
    const steps = document.querySelectorAll(".portfolio-page .hiw-step");
    if (!steps.length) return;

    let current = 0;
    let timer: ReturnType<typeof setInterval>;

    const activate = (index: number) => {
      steps.forEach((step, i) => {
        const numEl = step.querySelector("span.text-4xl") as HTMLElement | null;
        const descEl = step.querySelector(".hiw-desc") as HTMLElement | null;
        const bars = step.querySelectorAll('[style*="bottom:0"]');

        step.classList.remove("hiw-step-active");
        (step as HTMLElement).style.background = "#000";
        (step as HTMLElement).style.borderColor = "rgba(255,255,255,.25)";
        if (numEl) numEl.style.color = "rgba(255,255,255,.2)";
        if (descEl) descEl.style.opacity = ".6";
        bars.forEach((b) => {
          (b as HTMLElement).style.transform = "scaleX(0)";
        });

        if (i === index) {
          step.classList.add("hiw-step-active");
          (step as HTMLElement).style.borderColor = "rgba(255,255,255,.6)";
          if (numEl) numEl.style.color = "#eca8d6";
          if (descEl) descEl.style.opacity = "1";
          bars.forEach((b) => {
            (b as HTMLElement).style.transform = "scaleX(1)";
          });
        }
      });
      current = index;
    };

    steps.forEach((step, i) => {
      step.addEventListener("click", () => {
        clearInterval(timer);
        activate(i);
        timer = setInterval(() => activate((current + 1) % steps.length), 6000);
      });
    });

    activate(0);
    timer = setInterval(() => activate((current + 1) % steps.length), 6000);

    return () => clearInterval(timer);
  }, [hiwSteps]);

  useEffect(() => {
    if (testimonials.length === 0) return;

    let current = 0;
    const DURATION = 8000;
    const quoteEl = document.getElementById("testimonial-quote");
    const nameEl = document.getElementById("testimonial-name");
    const roleEl = document.getElementById("testimonial-role");
    const avatarEl = document.getElementById("testimonial-avatar");
    const indicators = document.querySelectorAll(".portfolio-page .testimonial-indicator");
    if (!quoteEl || !nameEl || !roleEl || !avatarEl) return;

    const goTo = (index: number) => {
      current = (index + testimonials.length) % testimonials.length;
      const t = testimonials[current];
      quoteEl.style.opacity = "0";
      setTimeout(() => {
        quoteEl.textContent = t.quote;
        nameEl.textContent = t.name;
        roleEl.textContent = t.role;
        avatarEl.textContent = t.avatar;
        quoteEl.style.opacity = "1";
      }, 300);

      indicators.forEach((ind, i) => {
        const bar = ind.querySelector("div") as HTMLElement | null;
        if (!bar) return;
        bar.style.animation = "none";
        bar.style.width = "0%";
        if (i === current) {
          void bar.offsetWidth;
          bar.style.animation = `progress ${DURATION}ms linear forwards`;
        }
      });
    };

    const prev = document.getElementById("testimonial-prev");
    const next = document.getElementById("testimonial-next");
    let timer = setInterval(() => goTo(current + 1), DURATION);

    const reset = (fn: () => void) => {
      clearInterval(timer);
      fn();
      timer = setInterval(() => goTo(current + 1), DURATION);
    };

    prev?.addEventListener("click", () => reset(() => goTo(current - 1)));
    next?.addEventListener("click", () => reset(() => goTo(current + 1)));
    indicators.forEach((ind, i) => {
      ind.addEventListener("click", () => reset(() => goTo(i)));
    });

    goTo(0);
    return () => clearInterval(timer);
  }, [testimonials]);

  useEffect(() => {
    document.querySelectorAll('.portfolio-page a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    document.querySelectorAll("#nav-cta, #hero-start-routing, #cta-start-free").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }, [config.slug]);
}
