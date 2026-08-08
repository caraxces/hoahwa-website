"use client";

import { useId, useState } from "react";
import {
  DateField,
  SelectField,
  fieldClass,
  labelClass,
} from "@/components/shared/FormFields";
import { bookingFormCopy } from "@/content/booking";
import { submitBookingRequest } from "@/lib/booking-api";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingRequestForm({ className }: { className?: string }) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    preferred_date: "",
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
      /* color-scheme keeps the leftover native chrome — caret, autofill,
         textarea scrollbar — dark like the surface it sits on. */
      className={cn("flex flex-col gap-5 [color-scheme:dark]", className)}
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
        <DateField
          label="Preferred date *"
          value={form.preferred_date}
          disablePast
          onChange={(value) => set("preferred_date", value)}
          disabled={status === "submitting"}
        />
        <SelectField
          label="Preferred time"
          value={form.preferred_window}
          options={bookingFormCopy.timeWindows}
          onChange={(value) => set("preferred_window", value)}
          disabled={status === "submitting"}
        />
      </div>

      <SelectField
        label="What's it about?"
        value={form.topic}
        options={bookingFormCopy.topics}
        onChange={(value) => set("topic", value)}
        disabled={status === "submitting"}
      />

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
