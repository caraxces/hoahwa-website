"use client";

import { cn } from "@/lib/cn";

type FilterBarProps = {
  filters: readonly string[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: "on-light" | "on-dark";
};

export function FilterBar({
  filters,
  active,
  onChange,
  className,
  variant = "on-light",
}: FilterBarProps) {
  const onDark = variant === "on-dark";

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 border-b pb-8",
        onDark ? "border-[var(--wiro-romance)]/20" : "border-[var(--wiro-cod-gray)]/20",
        className,
      )}
      role="tablist"
      aria-label="Filter"
    >
      {filters.map((filter) => {
        const selected = active === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter)}
            className={cn(
              "rounded-full px-4 py-2 text-sm tracking-[-0.03em] transition-colors",
              onDark
                ? selected
                  ? "bg-[var(--wiro-romance)] text-[var(--wiro-cod-gray)]"
                  : "border border-[var(--wiro-romance)]/30 text-[var(--wiro-romance)]/60 hover:border-[var(--wiro-romance)] hover:text-[var(--wiro-romance)]"
                : selected
                  ? "bg-[var(--wiro-cod-gray)] text-[var(--wiro-romance)]"
                  : "border border-[var(--wiro-cod-gray)]/30 text-[var(--wiro-cod-gray)]/70 hover:border-[var(--wiro-cod-gray)] hover:text-[var(--wiro-cod-gray)]",
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
