import Link from "next/link";
import type { ServicePlan } from "@/content/service";
import { cn } from "@/lib/cn";

function CheckIcon({ light }: { light: boolean }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg",
        light ? "bg-[var(--wiro-cod-gray)]" : "bg-[var(--wiro-chenin)]",
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 18 13"
        className={cn("h-3 w-4", light ? "text-[var(--wiro-romance)]" : "text-[var(--wiro-cod-gray)]")}
        fill="none"
      >
        <path
          d="M1 6.5L6.5 12L17 1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ServicePlanCard({ plan }: { plan: ServicePlan }) {
  const light = plan.variant === "light";
  const showCta = plan.showCta !== false;

  return (
    <article
      id={plan.id}
      className={cn(
        "flex min-h-[469px] flex-col gap-8 rounded-lg p-8",
        light
          ? "bg-[var(--wiro-spring-wood)] text-[var(--wiro-cod-gray)]"
          : "bg-[#212121] pb-16 text-[var(--wiro-romance)]",
      )}
    >
      <div className="min-h-[140px]">
        {plan.step ? (
          <p className="text-base tracking-[-0.03em] opacity-90">{plan.step}</p>
        ) : null}
        <h3
          className={cn(
            "text-[length:40px] leading-[44px] tracking-[-0.04em]",
            plan.step ? "mt-2" : "",
          )}
        >
          {plan.title}
        </h3>
        <p className="mt-4 text-base tracking-[-0.03em] opacity-60">{plan.subtitle}</p>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-4">
            <CheckIcon light={light} />
            <span className="text-base tracking-[-0.03em]">{feature}</span>
          </li>
        ))}
      </ul>

      {showCta ? (
        <Link
          href="/contact"
          className={cn(
            "flex w-full items-center justify-center rounded-[20px] px-4 py-2.5 text-center text-base tracking-[-0.03em] transition-opacity hover:opacity-90",
            plan.ctaVariant === "mauve"
              ? "bg-[var(--wiro-mauve)] text-[var(--wiro-cod-gray)]"
              : "bg-[var(--wiro-cod-gray)] text-[var(--wiro-romance)]",
          )}
        >
          Get Started
        </Link>
      ) : null}
    </article>
  );
}
