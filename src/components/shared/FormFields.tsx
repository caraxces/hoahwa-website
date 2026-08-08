"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/* ──────────────────────────────────────────────────────────────────────────
 * One skin for every control on a form.
 *
 * Native <select> and <input type="date"> render their own OS chrome — a black
 * calendar glyph, a white/blue picker popup — which sits badly next to our own
 * fields on a dark vibe surface. The controls below reimplement both so the
 * whole form reads as one system, in whichever vibe is active.
 * ────────────────────────────────────────────────────────────────────────── */

export const fieldClass =
  "w-full rounded-md border border-current/25 bg-transparent px-4 py-3 text-base tracking-[-0.02em] outline-none transition-colors focus:border-current/60 disabled:opacity-60";

export const labelClass = "mb-2 block text-sm tracking-[-0.02em] opacity-70";

/** Trigger buttons carry fieldClass plus this, so their box matches an input. */
const triggerClass = "flex items-center justify-between gap-3 text-left";

const panelClass =
  "absolute left-0 top-[calc(100%+6px)] z-40 w-full min-w-[17rem] rounded-md border border-current/25 bg-[var(--surface-raised)] p-2 shadow-[0_18px_44px_rgba(0,0,0,0.35)]";

const popIn = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.14, ease: [0.16, 1, 0.3, 1] as const },
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={cn("size-4 shrink-0 opacity-60", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6.5 8 10.5 12 6.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="size-4 shrink-0 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.25" y="3.75" width="11.5" height="10.5" rx="1.5" />
      <path d="M2.25 7h11.5M5.5 2v2.4M10.5 2v2.4" />
    </svg>
  );
}

/** Close on a pointer press outside the returned wrapper. */
function useOutsideDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, close]);

  return ref;
}

/* ── Select ─────────────────────────────────────────────────────────────── */

type SelectFieldProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  disabled = false,
  className,
}: SelectFieldProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const listId = `${uid}-list`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const close = useCallback(() => setOpen(false), []);
  const wrapRef = useOutsideDismiss(open, close);

  const openMenu = useCallback(() => {
    setActiveIndex(Math.max(0, options.indexOf(value)));
    setOpen(true);
  }, [options, value]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (index: number) => {
    const next = options[index];
    if (next !== undefined) onChange(next);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp": {
        event.preventDefault();
        if (!open) {
          openMenu();
          return;
        }
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((i) => (i + step + options.length) % options.length);
        return;
      }
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        return;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) commit(activeIndex);
        else openMenu();
        return;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        return;
    }
  };

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <span id={labelId} className={labelClass}>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${uid}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(fieldClass, triggerClass, open && "border-current/60")}
      >
        <span className="truncate">{value}</span>
        <ChevronIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <motion.ul
          {...popIn}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={cn(panelClass, "max-h-64 overflow-y-auto")}
        >
          {options.map((option, index) => {
            const selected = option === value;
            return (
              <li
                key={option}
                id={`${uid}-option-${index}`}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="option"
                aria-selected={selected}
                onClick={() => commit(index)}
                onPointerEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded px-3 py-2 text-base tracking-[-0.02em] transition-colors",
                  index === activeIndex && "bg-current/10",
                  selected && "text-[var(--wiro-mauve)]",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    selected ? "bg-[var(--wiro-mauve)]" : "bg-current/25",
                  )}
                />
                <span className="truncate">{option}</span>
              </li>
            );
          })}
        </motion.ul>
      ) : null}
    </div>
  );
}

/* ── Date ───────────────────────────────────────────────────────────────── */

const pad = (n: number) => String(n).padStart(2, "0");

/** Local YYYY-MM-DD — avoids toISOString(), which shifts across UTC midnight. */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Same day-of-month in a neighbouring month, clamped to that month's length. */
function shiftMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** Monday-first index, 0–6. */
function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

/** Always six rows, so the panel never changes height between months. */
function monthGrid(viewMonth: Date): Date[] {
  const first = startOfMonth(viewMonth);
  const start = addDays(first, -weekdayIndex(first));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

// Locale is pinned so the label is identical on the server and after hydration.
const monthLabelFormat = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});
const triggerFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const dayLabelFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const WEEKDAY_HEADS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

type DateFieldProps = {
  label: string;
  /** YYYY-MM-DD, or "" for nothing chosen yet. */
  value: string;
  onChange: (value: string) => void;
  /** YYYY-MM-DD — earliest selectable day, inclusive. */
  min?: string;
  /**
   * Block every day before today. Resolved in the browser, not at render time
   * of a prerendered page, so a statically exported page never goes stale.
   */
  disablePast?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function DateField({
  label,
  value,
  onChange,
  min,
  disablePast = false,
  placeholder = "Choose a date",
  disabled = false,
  className,
}: DateFieldProps) {
  const uid = useId();
  const labelId = `${uid}-label`;
  const monthId = `${uid}-month`;

  const selected = useMemo(() => parseDateKey(value), [value]);
  // Midnight today, so it compares cleanly against the midnight-based grid days.
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const todayKey = toDateKey(today);
  const minDate = useMemo(() => {
    const explicit = min ? parseDateKey(min) : null;
    const floor = disablePast ? today : null;
    if (!explicit) return floor;
    if (!floor) return explicit;
    return explicit > floor ? explicit : floor;
  }, [min, disablePast, today]);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Date>(() =>
    startOfMonth(selected ?? minDate ?? new Date()),
  );
  const [focusKey, setFocusKey] = useState(value);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dayRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const close = useCallback(() => setOpen(false), []);
  const wrapRef = useOutsideDismiss(open, close);

  const openPanel = () => {
    const start = selected ?? minDate ?? new Date();
    setViewMonth(startOfMonth(start));
    setFocusKey(toDateKey(start));
    setOpen(true);
  };

  // Move the DOM focus to whichever day is currently the arrow-key target.
  useEffect(() => {
    if (open) dayRefs.current[focusKey]?.focus();
  }, [open, focusKey]);

  const isBlocked = (day: Date) => minDate !== null && day < minDate;

  const moveFocus = (next: Date) => {
    if (isBlocked(next)) return;
    setFocusKey(toDateKey(next));
    if (!sameMonth(next, viewMonth)) setViewMonth(startOfMonth(next));
  };

  const commit = (day: Date) => {
    if (isBlocked(day)) return;
    onChange(toDateKey(day));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = parseDateKey(focusKey) ?? selected ?? new Date();
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        moveFocus(addDays(current, -1));
        return;
      case "ArrowRight":
        event.preventDefault();
        moveFocus(addDays(current, 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(addDays(current, -7));
        return;
      case "ArrowDown":
        event.preventDefault();
        moveFocus(addDays(current, 7));
        return;
      case "Home":
        event.preventDefault();
        moveFocus(addDays(current, -weekdayIndex(current)));
        return;
      case "End":
        event.preventDefault();
        moveFocus(addDays(current, 6 - weekdayIndex(current)));
        return;
      case "PageUp":
        event.preventDefault();
        moveFocus(shiftMonths(current, -1));
        return;
      case "PageDown":
        event.preventDefault();
        moveFocus(shiftMonths(current, 1));
        return;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      default:
        return;
    }
  };

  const days = useMemo(() => monthGrid(viewMonth), [viewMonth]);
  const prevBlocked =
    minDate !== null && startOfMonth(viewMonth) <= startOfMonth(minDate);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <span id={labelId} className={labelClass}>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={labelId}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPanel())}
        className={cn(fieldClass, triggerClass, open && "border-current/60")}
      >
        <span className={cn("truncate", !selected && "opacity-45")}>
          {selected ? triggerFormat.format(selected) : placeholder}
        </span>
        <CalendarIcon />
      </button>

      {open ? (
        <motion.div
          {...popIn}
          role="dialog"
          aria-labelledby={labelId}
          className={panelClass}
        >
          <div className="flex items-center justify-between gap-2 px-1 pb-2">
            <p
              id={monthId}
              aria-live="polite"
              className="text-sm tracking-[-0.02em]"
            >
              {monthLabelFormat.format(viewMonth)}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                disabled={prevBlocked}
                onClick={() => setViewMonth(shiftMonths(viewMonth, -1))}
                className="grid size-7 place-items-center rounded transition-colors hover:bg-current/10 disabled:opacity-25 disabled:hover:bg-transparent"
              >
                <ChevronIcon className="rotate-90 opacity-80" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setViewMonth(shiftMonths(viewMonth, 1))}
                className="grid size-7 place-items-center rounded transition-colors hover:bg-current/10"
              >
                <ChevronIcon className="-rotate-90 opacity-80" />
              </button>
            </div>
          </div>

          <div aria-hidden className="grid grid-cols-7 gap-0.5 px-1 pb-1">
            {WEEKDAY_HEADS.map((head) => (
              <span
                key={head}
                className="grid h-6 place-items-center text-xs tracking-[-0.01em] opacity-45"
              >
                {head}
              </span>
            ))}
          </div>

          <div
            role="group"
            aria-labelledby={monthId}
            onKeyDown={onGridKeyDown}
            className="grid grid-cols-7 gap-0.5 px-1 pb-1"
          >
            {days.map((day) => {
              const key = toDateKey(day);
              const isSelected = key === value;
              const blocked = isBlocked(day);
              return (
                <button
                  key={key}
                  ref={(el) => {
                    dayRefs.current[key] = el;
                  }}
                  type="button"
                  tabIndex={key === focusKey ? 0 : -1}
                  disabled={blocked}
                  aria-label={dayLabelFormat.format(day)}
                  aria-pressed={isSelected}
                  aria-current={key === todayKey ? "date" : undefined}
                  onClick={() => commit(day)}
                  className={cn(
                    "grid h-9 place-items-center rounded-md text-sm tracking-[-0.02em] transition-colors",
                    // Focus is a ring, not a tint — a tint would outrank the
                    // selected day's own background on specificity.
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-current/70",
                    !sameMonth(day, viewMonth) && "opacity-35",
                    key === todayKey &&
                      !isSelected &&
                      "ring-1 ring-inset ring-current/35",
                    !isSelected && "hover:bg-current/10",
                    isSelected &&
                      "bg-[var(--wiro-mauve)] text-[var(--wiro-cod-gray)]",
                    blocked && "cursor-not-allowed opacity-20 hover:bg-transparent",
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-1 flex justify-end border-t border-current/15 px-1 pt-2">
            <button
              type="button"
              onClick={() => commit(today)}
              disabled={isBlocked(today)}
              className="rounded px-2 py-1 text-sm tracking-[-0.02em] opacity-70 transition-opacity hover:opacity-100 disabled:opacity-25"
            >
              Today
            </button>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
