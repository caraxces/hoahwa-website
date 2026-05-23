"use client";

type HoahwaContactFormProps = {
  services: string[];
  budgets?: string[];
  showBudget?: boolean;
};

export function HoahwaContactForm({
  services,
  budgets = [],
  showBudget = false,
}: HoahwaContactFormProps) {
  return (
    <form
      data-testid="hoahwa-contact-form"
      className="flex flex-col gap-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid grid-cols-1 gap-4 border-b border-[var(--wiro-romance)]/20 pb-6 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Name*"
          required
          className="border-b border-[var(--wiro-romance)] bg-transparent py-2 text-[length:var(--wiro-body)] text-[var(--wiro-romance)] outline-none placeholder:text-[var(--wiro-romance)]/20"
        />
        <input
          type="tel"
          placeholder="Phone*"
          required
          className="border-b border-[var(--wiro-romance)] bg-transparent py-2 text-[length:var(--wiro-body)] text-[var(--wiro-romance)] outline-none placeholder:text-[var(--wiro-romance)]/20"
        />
      </div>
      {[
        "Email Address*",
        "Company*",
        "Objectives/Project Goals*",
        "Where did you hear about us?*",
      ].map((placeholder) => (
        <input
          key={placeholder}
          type="text"
          placeholder={placeholder}
          required
          className="mt-6 border-b border-[var(--wiro-romance)] bg-transparent py-2 text-[length:var(--wiro-body)] text-[var(--wiro-romance)] outline-none placeholder:text-[var(--wiro-romance)]/20"
        />
      ))}

      <fieldset className="mt-10 border-0 p-0">
        <legend className="mb-4 text-[length:var(--wiro-body)] text-[var(--wiro-romance)]">
          Services*
        </legend>
        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <label key={service} className="flex cursor-pointer items-center gap-2">
              <span className="size-3 shrink-0 rounded-sm border border-[var(--wiro-romance)]/30" />
              <span className="text-base tracking-[-0.03em] text-[var(--wiro-romance)]">
                {service}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {showBudget && budgets.length > 0 ? (
        <fieldset className="mt-10 border-0 p-0">
          <legend className="mb-4 text-[length:var(--wiro-body)] text-[var(--wiro-romance)]">
            Budget*
          </legend>
          <div className="flex flex-col gap-4">
            {budgets.map((budget) => (
              <label key={budget} className="flex cursor-pointer items-center gap-2">
                <span className="size-3 shrink-0 rounded-sm border border-[var(--wiro-romance)]/30" />
                <span className="text-base tracking-[-0.03em] text-[var(--wiro-romance)]">
                  {budget}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <button
        type="submit"
        className="mt-10 inline-flex w-fit items-center justify-center rounded-full bg-[var(--hoahwa-accent)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90"
      >
        Get Started
      </button>
    </form>
  );
}
