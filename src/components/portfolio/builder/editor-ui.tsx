"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--wiro-mauve)]">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-[var(--wiro-mauve)]">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-[var(--wiro-romance)]/20 bg-transparent p-3 text-sm outline-none"
      />
    </label>
  );
}

export function SectionPanel({
  title,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  enabled?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-[var(--wiro-romance)]/20" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium">
        <span className="flex items-center gap-3">
          {onToggle ? (
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : null}
          {title}
        </span>
        <span className="text-[var(--wiro-romance)]/40 group-open:rotate-180">▼</span>
      </summary>
      <div className="space-y-4 border-t border-[var(--wiro-romance)]/10 px-4 py-4">{children}</div>
    </details>
  );
}
