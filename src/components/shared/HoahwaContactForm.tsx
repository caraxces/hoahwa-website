"use client";

import { useState, type FormEvent } from "react";
import { submitContactForm } from "@/lib/contact-api";

type HoahwaContactFormProps = {
  services: string[];
  budgets?: string[];
  showBudget?: boolean;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  company: string;
  objectives: string;
  referral_source: string;
  service: string;
  budget: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  company: "",
  objectives: "",
  referral_source: "",
  service: "",
  budget: "",
};

export function HoahwaContactForm({
  services,
  budgets = [],
  showBudget = false,
}: HoahwaContactFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    if (!form.service) {
      setStatus("error");
      setErrorMessage("Please select a service.");
      return;
    }

    if (showBudget && budgets.length > 0 && !form.budget) {
      setStatus("error");
      setErrorMessage("Please select a budget.");
      return;
    }

    const result = await submitContactForm({
      name: form.name,
      phone: form.phone,
      email: form.email,
      company: form.company,
      objectives: form.objectives,
      referral_source: form.referral_source,
      service: form.service,
      budget: form.budget || undefined,
    });

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("success");
    setForm(emptyForm);
  }

  const inputClass =
    "border-b border-[var(--wiro-romance)] bg-transparent py-2 text-[length:var(--wiro-body)] text-[var(--wiro-romance)] outline-none placeholder:text-[var(--wiro-romance)]/20 disabled:opacity-50";

  return (
    <form
      data-testid="hoahwa-contact-form"
      className="flex flex-col gap-0"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 border-b border-[var(--wiro-romance)]/20 pb-6 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Name*"
          required
          value={form.name}
          disabled={status === "submitting"}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone*"
          required
          value={form.phone}
          disabled={status === "submitting"}
          onChange={(e) => updateField("phone", e.target.value)}
          className={inputClass}
        />
      </div>

      {(
        [
          ["email", "Email Address*", "email"],
          ["company", "Company*", "text"],
          ["objectives", "Objectives/Project Goals*", "text"],
          ["referral_source", "Where did you hear about us?*", "text"],
        ] as const
      ).map(([key, placeholder, type]) => (
        <input
          key={key}
          type={type}
          name={key}
          placeholder={placeholder}
          required
          value={form[key]}
          disabled={status === "submitting"}
          onChange={(e) => updateField(key, e.target.value)}
          className={`mt-6 ${inputClass}`}
        />
      ))}

      <fieldset className="mt-10 border-0 p-0" disabled={status === "submitting"}>
        <legend className="mb-4 text-[length:var(--wiro-body)] text-[var(--wiro-romance)]">
          Services*
        </legend>
        <div className="flex flex-col gap-4">
          {services.map((service) => {
            const selected = form.service === service;
            return (
              <label key={service} className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name="service"
                  value={service}
                  checked={selected}
                  onChange={() => updateField("service", service)}
                  className="sr-only"
                />
                <span
                  className={`size-3 shrink-0 rounded-sm border ${
                    selected
                      ? "border-[var(--hoahwa-accent)] bg-[var(--hoahwa-accent)]"
                      : "border-[var(--wiro-romance)]/30"
                  }`}
                  aria-hidden
                />
                <span className="text-base tracking-[-0.03em] text-[var(--wiro-romance)]">
                  {service}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {showBudget && budgets.length > 0 ? (
        <fieldset className="mt-10 border-0 p-0" disabled={status === "submitting"}>
          <legend className="mb-4 text-[length:var(--wiro-body)] text-[var(--wiro-romance)]">
            Budget*
          </legend>
          <div className="flex flex-col gap-4">
            {budgets.map((budget) => {
              const selected = form.budget === budget;
              return (
                <label key={budget} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="budget"
                    value={budget}
                    checked={selected}
                    onChange={() => updateField("budget", budget)}
                    className="sr-only"
                  />
                  <span
                    className={`size-3 shrink-0 rounded-sm border ${
                      selected
                        ? "border-[var(--hoahwa-accent)] bg-[var(--hoahwa-accent)]"
                        : "border-[var(--wiro-romance)]/30"
                    }`}
                    aria-hidden
                  />
                  <span className="text-base tracking-[-0.03em] text-[var(--wiro-romance)]">
                    {budget}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {status === "success" ? (
        <p
          role="status"
          className="mt-10 text-base tracking-[-0.03em] text-[var(--hoahwa-accent)]"
        >
          Thank you — we received your message and will be in touch soon.
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p role="alert" className="mt-10 text-base tracking-[-0.03em] text-red-400">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-10 inline-flex w-fit items-center justify-center rounded-full bg-[var(--hoahwa-accent)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Get Started"}
      </button>
    </form>
  );
}
