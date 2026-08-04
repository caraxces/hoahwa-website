"use client";

import Link from "next/link";

import { VIBE_LABELS, VIBE_ORDER, VIBE_PALETTES } from "@/lib/vibe";
import { VibeToggleWithToast } from "./VibeToggleWithToast";
import { useVibe } from "./VibeProvider";

const SWATCH_ROLES = [
  { key: "c1" as const, label: "C1 Deep", token: "--surface-deep" },
  { key: "c2" as const, label: "C2 Accent", token: "--accent" },
  { key: "c3" as const, label: "C3 Muted", token: "--surface-muted" },
  { key: "c4" as const, label: "C4 Light", token: "--surface-light" },
];

export function VibeDemoView() {
  const { vibe } = useVibe();

  return (
    <div className="min-h-screen bg-[var(--surface-deep)] px-[var(--wiro-page-pad)] py-16 text-[var(--text-on-dark)]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="mb-2 text-sm uppercase tracking-widest text-[var(--accent-highlight)]">
              Color preview
            </p>
            <h1 className="text-h3">Weather vibes — {VIBE_LABELS[vibe].title}</h1>
            <p className="mt-3 max-w-lg text-[var(--hoahwa-muted)]">
              {VIBE_PALETTES[vibe].mood}. Toggle icons in header or below.
            </p>
          </div>
          <VibeToggleWithToast variant="floating" toastPlacement="above" />
        </div>

        {/* Active vibe — live tokens */}
        <section className="mb-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-dark)] p-8">
          <h2 className="mb-6 text-xl">Active vibe (live)</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SWATCH_ROLES.map(({ key, label, token }) => (
              <div key={key} className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                <div className="h-24" style={{ background: `var(${token})` }} />
                <div className="bg-[var(--surface-light)] p-3 text-[var(--text-on-light)]">
                  <p className="text-xs font-medium">{label}</p>
                  <p className="font-mono text-xs opacity-70">{VIBE_PALETTES[vibe][key]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-[var(--text-on-accent)]"
            >
              Primary CTA
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--border-subtle)] px-6 py-3 text-sm"
            >
              Outline
            </button>
          </div>
        </section>

        {/* All palettes side by side */}
        <section className="space-y-8">
          <h2 className="text-xl">All suggested palettes</h2>
          {VIBE_ORDER.map((id) => {
            const palette = VIBE_PALETTES[id];
            const label = VIBE_LABELS[id];
            const isActive = id === vibe;
            return (
              <div
                key={id}
                className={`rounded-2xl border p-6 ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--surface-dark)]"
                    : "border-[var(--border-subtle)] bg-[var(--overlay-glass)]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{label.title}</h3>
                    <p className="text-sm text-[var(--hoahwa-muted)]">{palette.mood}</p>
                  </div>
                  {isActive ? (
                    <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs text-[var(--text-on-accent)]">
                      Active
                    </span>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {SWATCH_ROLES.map(({ key, label: roleLabel }) => (
                    <div key={key} className="overflow-hidden rounded-lg">
                      <div className="h-16" style={{ background: palette[key] }} />
                      <p className="mt-1 font-mono text-xs opacity-80">
                        {roleLabel}: {palette[key]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* UI preview blocks */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[var(--surface-light)] p-6 text-[var(--text-on-light)]">
            <p className="text-sm opacity-60">Light section</p>
            <p className="mt-2 text-lg">About / Growth</p>
          </div>
          <div className="rounded-xl bg-[var(--surface-muted)] p-6 text-[var(--text-on-light)]">
            <p className="text-sm opacity-60">Muted section</p>
            <p className="mt-2 text-lg">Testimonials</p>
          </div>
          <div className="rounded-xl bg-[var(--accent)] p-6 text-[var(--text-on-accent)]">
            <p className="text-sm opacity-60">Accent / Footer</p>
            <p className="mt-2 text-lg">CTA band</p>
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-[var(--hoahwa-muted)]">
          <Link href="/" className="underline hover:text-[var(--accent-highlight)]">
            ← Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
