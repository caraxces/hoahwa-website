"use client";

import { useId, useState } from "react";
import { bookingFormCopy } from "@/content/booking";
import { submitBookingRequest } from "@/lib/booking-api";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

/** Local YYYY-MM-DD — avoids toISOString(), which shifts across UTC midnight. */
function localDateInputValue(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const fieldClass =
  "w-full rounded-md border border-current/25 bg-transparent px-4 py-3 text-base tracking-[-0.02em] outline-none transition-colors focus:border-current/60 disabled:opacity-60";
const labelClass = "mb-2 block text-sm tracking-[-0.02em] opacity-70";

export function BookingRequestForm({ className }: { className?: string }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    preferred_date: localDateInputValue(1),
    preferred_window: bookingFormCopy.timeWindows[0]!,
    topic: bookingFormCopy.topics[0]!,
    notes: "",
  });

  const set = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status === "error") setStatus("idle");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    if (!form.name.trim() || !form.email.trim() || !form.preferred_date) {
      setStatus("error");
      setMessage("Please fill in your name, email, and a preferred date.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    // Captured so we can tell you which timezone the requester meant.
    const timezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";

    const result = await submitBookingRequest({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      notes: form.notes.trim(),
      timezone,
      website,
    });

    if (result.ok) {
      setStatus("success");
      setMessage(bookingFormCopy.success);
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "rounded-lg border border-current/25 p-8 md:p-10",
          className,
        )}
        role="status"
      >
        <p className="text-[length:var(--wiro-h4)] tracking-[-0.04em]">
          Request received
        </p>
        <p className="mt-4 text-base leading-6 tracking-[-0.03em] opacity-75">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("flex flex-col gap-5", className)}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Your name *
          </label>
          <input
            id={`${uid}-name`}
            className={fieldClass}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            disabled={status === "submitting"}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={labelClass}>
            Email *
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={status === "submitting"}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-company`} className={labelClass}>
          Company or store URL
        </label>
        <input
          id={`${uid}-company`}
          className={fieldClass}
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          disabled={status === "submitting"}
          autoComplete="organization"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-date`} className={labelClass}>
            Preferred date *
          </label>
          <input
            id={`${uid}-date`}
            type="date"
            className={fieldClass}
            value={form.preferred_date}
            min={localDateInputValue(0)}
            onChange={(e) => set("preferred_date", e.target.value)}
            disabled={status === "submitting"}
            required
          />
        </div>
        <div>
          <label htmlFor={`${uid}-window`} className={labelClass}>
            Preferred time
          </label>
          <select
            id={`${uid}-window`}
            className={fieldClass}
            value={form.preferred_window}
            onChange={(e) => set("preferred_window", e.target.value)}
            disabled={status === "submitting"}
          >
            {bookingFormCopy.timeWindows.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${uid}-topic`} className={labelClass}>
          What&apos;s it about?
        </label>
        <select
          id={`${uid}-topic`}
          className={fieldClass}
          value={form.topic}
          onChange={(e) => set("topic", e.target.value)}
          disabled={status === "submitting"}
        >
          {bookingFormCopy.topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${uid}-notes`} className={labelClass}>
          Anything we should know beforehand?
        </label>
        <textarea
          id={`${uid}-notes`}
          rows={4}
          className={cn(fieldClass, "resize-y")}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          disabled={status === "submitting"}
        />
      </div>

      {/* Honeypot — hidden from users, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input
          id={`${uid}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-3 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting"
            ? bookingFormCopy.submitting
            : bookingFormCopy.submit}
        </button>
        <p
          role="status"
          aria-live="polite"
          className="text-sm tracking-[-0.02em] opacity-80"
        >
          {message}
        </p>
      </div>
    </form>
  );
}
