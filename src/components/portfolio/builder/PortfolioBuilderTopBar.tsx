"use client";

import Link from "next/link";
import {
  builderCopy,
  HOSTINGER_REFERRAL_URL,
  WHATSAPP_SUPPORT_NUMBER,
} from "@/content/portfolio/builder";
import type { PortfolioUser } from "@/lib/portfolio-auth-api";
import { logoutUser } from "@/lib/portfolio-auth-api";

type AuthProps = {
  mode: "login" | "register" | "forgot";
  setMode: (m: "login" | "register" | "forgot") => void;
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (v: boolean) => void;
  ticketNote: string;
  setTicketNote: (v: string) => void;
  busy: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

export function PortfolioBuilderTopBar({
  user,
  onSignOut,
  auth,
}: {
  user: PortfolioUser | null;
  onSignOut: () => void;
  auth?: AuthProps;
}) {
  return (
    <div className="space-y-4 border-b border-[var(--wiro-romance)]/15 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {user ? (
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-[var(--wiro-mauve)]">Signed in as</p>
                <p className="text-lg font-medium">{user.full_name}</p>
                <p className="text-sm text-[var(--wiro-romance)]/60">@{user.username}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  onSignOut();
                }}
                className="text-sm text-[var(--wiro-mauve)] underline"
              >
                Sign out
              </button>
            </div>
          ) : auth ? (
            <div className="w-full max-w-xl">
              <div className="mb-4 flex flex-wrap gap-2">
                {(["login", "register", "forgot"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => auth.setMode(m)}
                    className={`rounded-full px-4 py-1.5 text-sm ${
                      auth.mode === m
                        ? "bg-[var(--hoahwa-accent)] text-[var(--wiro-cod-gray)]"
                        : "border border-[var(--wiro-romance)]/25 text-[var(--wiro-romance)]/70"
                    }`}
                  >
                    {m === "login" ? "Sign in" : m === "register" ? "Register" : "Forgot"}
                  </button>
                ))}
              </div>
              <form onSubmit={auth.onSubmit} className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Username*"
                  required
                  value={auth.username}
                  onChange={(e) => auth.setUsername(e.target.value)}
                  className="border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none sm:col-span-1"
                />
                {auth.mode !== "forgot" ? (
                  <input
                    type="password"
                    placeholder="Password*"
                    required
                    minLength={8}
                    value={auth.password}
                    onChange={(e) => auth.setPassword(e.target.value)}
                    className="border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none"
                  />
                ) : null}
                {auth.mode === "register" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Full name*"
                      required
                      value={auth.fullName}
                      onChange={(e) => auth.setFullName(e.target.value)}
                      className="border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp*"
                      required
                      value={auth.whatsapp}
                      onChange={(e) => auth.setWhatsapp(e.target.value)}
                      className="border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none"
                    />
                    <label className="flex items-start gap-2 text-xs leading-5 text-[var(--wiro-romance)]/70 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={auth.privacyAccepted}
                        onChange={(e) => auth.setPrivacyAccepted(e.target.checked)}
                        className="mt-0.5"
                      />
                      I agree — Hoahwa does not sell my data. No email marketing.
                    </label>
                  </>
                ) : null}
                {auth.mode === "forgot" ? (
                  <input
                    type="tel"
                    placeholder="WhatsApp*"
                    required
                    value={auth.whatsapp}
                    onChange={(e) => auth.setWhatsapp(e.target.value)}
                    className="border-b border-[var(--wiro-romance)]/30 bg-transparent py-2 text-sm outline-none sm:col-span-2"
                  />
                ) : null}
                <button
                  type="submit"
                  disabled={auth.busy}
                  className="rounded-full bg-[var(--hoahwa-accent)] px-5 py-2 text-sm text-[var(--wiro-cod-gray)] disabled:opacity-60 sm:col-span-2 sm:w-fit"
                >
                  {auth.busy ? "…" : auth.mode === "forgot" ? "Message on WhatsApp" : auth.mode === "register" ? "Create account" : "Sign in"}
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-[var(--wiro-romance)]/15 p-4">
          <h2 className="text-sm font-medium">{builderCopy.hostinger.title}</h2>
          <p className="mt-2 text-xs leading-5 text-[var(--wiro-romance)]/70">{builderCopy.hostinger.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={HOSTINGER_REFERRAL_URL}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex rounded-full bg-[var(--hoahwa-accent)] px-4 py-2 text-xs font-medium text-[var(--wiro-cod-gray)]"
            >
              {builderCopy.hostinger.cta}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(
                "Hi Hoahwa — I want to renew my portfolio page hosting ($1/month) after the 100-day period.",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-[var(--wiro-romance)]/30 px-4 py-2 text-xs text-[var(--wiro-romance)]"
            >
              {builderCopy.hostinger.whatsappCta}
            </a>
          </div>
          <p className="mt-2 text-xs text-[var(--wiro-romance)]/50">{builderCopy.hostinger.note}</p>
        </div>
        <div className="rounded-lg border border-[var(--wiro-romance)]/15 p-4">
          <h2 className="text-sm font-medium">{builderCopy.privacy.title}</h2>
          <ul className="mt-2 space-y-1 text-xs leading-5 text-[var(--wiro-romance)]/70">
            {builderCopy.privacy.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="text-[var(--hoahwa-accent)]">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
