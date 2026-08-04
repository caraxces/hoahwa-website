"use client";

import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter-api";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Footer newsletter signup. Previously this form called preventDefault() and
 * discarded the address — it now posts to /api/newsletter.php and reports the
 * real outcome to the subscriber.
 */
export function FooterNewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const result = await subscribeToNewsletter({
      email: trimmed,
      source: "footer",
      website,
    });

    if (result.ok) {
      setStatus("success");
      setMessage("You're on the list. Thanks!");
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  }

  return (
    <form
      className="relative border-b border-[var(--wiro-cod-gray)] pb-4"
      onSubmit={handleSubmit}
      noValidate
    >
      <label htmlFor="footer-email" className="sr-only">
        Email
      </label>
      <input
        id="footer-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
        disabled={status === "submitting"}
        aria-describedby="footer-email-status"
        aria-invalid={status === "error"}
        className="w-full bg-transparent pr-10 text-[length:var(--wiro-body)] text-[var(--wiro-cod-gray)] outline-none placeholder:text-[var(--wiro-cod-gray)]/60 disabled:opacity-60"
      />

      {/* Honeypot — hidden from users, tempting to bots. */}
      <div aria-hidden className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
        <label htmlFor="footer-website">Leave this field empty</label>
        <input
          id="footer-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="absolute right-0 top-0 flex size-6 items-center justify-center disabled:opacity-50"
        aria-label="Subscribe"
      >
        <span className="text-xl leading-none" aria-hidden>
          {status === "submitting" ? "…" : "→"}
        </span>
      </button>

      <p
        id="footer-email-status"
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm tracking-[-0.02em] ${
          status === "error"
            ? "text-[var(--wiro-cod-gray)]"
            : "text-[var(--wiro-cod-gray)]/70"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
