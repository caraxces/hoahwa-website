"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  builderCopy,
  PORTFOLIO_RETENTION_DAYS,
  WHATSAPP_SUPPORT_NUMBER,
} from "@/content/portfolio/builder";
import { hoahwaPortfolioDemo } from "@/content/portfolio/hoahwa-portfolio-demo";
import type { PortfolioPageConfig } from "@/content/portfolio/schema";
import {
  fetchMe,
  listMyPages,
  loginUser,
  logoutUser,
  registerUser,
  savePage,
  type PortfolioPageSummary,
  type PortfolioUser,
} from "@/lib/portfolio-auth-api";
import { PageContainer, PageSection } from "@/components/shared/PageContainer";
import { PortfolioBuilderPreview } from "./PortfolioBuilderPreview";
import { PortfolioBuilderTopBar } from "./PortfolioBuilderTopBar";
import { PortfolioSectionEditor } from "./PortfolioSectionEditor";
import { Field } from "./editor-ui";

function cloneDemoConfig(): PortfolioPageConfig {
  return JSON.parse(JSON.stringify(hoahwaPortfolioDemo)) as PortfolioPageConfig;
}

export function PortfolioBuilderView() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [user, setUser] = useState<PortfolioUser | null>(null);
  const [pages, setPages] = useState<PortfolioPageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [ticketNote, setTicketNote] = useState("");

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("My Hoahwa Portfolio");
  const [config, setConfig] = useState<PortfolioPageConfig>(() => cloneDemoConfig());

  const previewConfig = useMemo(
    () => ({
      ...config,
      slug: slug.trim().toLowerCase() || user?.username || "preview",
      meta: { ...config.meta, title },
    }),
    [config, slug, title, user?.username],
  );

  const loadSession = useCallback(async () => {
    setLoading(true);
    const me = await fetchMe();
    if (me.ok) {
      setUser(me.user);
      const list = await listMyPages();
      if (list.ok) setPages(list.pages);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);

    if (mode === "forgot") {
      if (!username.trim() || !whatsapp.trim()) {
        setError("Username and WhatsApp are required.");
        setBusy(false);
        return;
      }
      const lines = [
        "Hi Hoahwa — I need help resetting my portfolio builder password.",
        `Username: ${username.trim()}`,
        `My WhatsApp: ${whatsapp.trim()}`,
      ];
      if (ticketNote.trim()) lines.push(`Note: ${ticketNote.trim()}`);
      window.open(
        `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noopener,noreferrer",
      );
      setBusy(false);
      setMessage("Opening WhatsApp…");
      return;
    }

    if (mode === "register") {
      if (!privacyAccepted) {
        setError("Please accept the privacy policy.");
        setBusy(false);
        return;
      }
      const res = await registerUser({
        username,
        password,
        full_name: fullName,
        whatsapp,
        privacy_accepted: privacyAccepted,
      });
      setBusy(false);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setUser(res.user);
      setMessage("Account created. Edit your page below.");
      return;
    }

    const res = await loginUser({ username, password });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setUser(res.user);
    await loadSession();
  }

  async function handleSave(publish: boolean) {
    if (!user) return;
    setError("");
    setMessage("");
    setBusy(true);

    const pageSlug = slug.trim().toLowerCase() || user.username;
    const nextConfig = {
      ...config,
      slug: pageSlug,
      meta: { ...config.meta, title },
    };

    const res = await savePage({ slug: pageSlug, title, config: nextConfig, publish });
    setBusy(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    const data = res.data as {
      page: { preview_url: string };
      retention_days: number;
    };
    setMessage(
      publish
        ? `Published (${data.retention_days} days): ${data.page.preview_url}`
        : `Draft saved (${data.retention_days}-day retention).`,
    );
    await loadSession();
  }

  if (loading) {
    return (
      <PageSection className="min-h-[60vh] bg-[var(--wiro-black)] py-32 text-[var(--wiro-romance)]">
        <PageContainer>
          <p className="text-[var(--wiro-mauve)]">Loading…</p>
        </PageContainer>
      </PageSection>
    );
  }

  return (
    <PageSection
      padX={false}
      className="bg-[var(--wiro-black)] px-[var(--wiro-page-pad)] pb-16 pt-[100px] text-[var(--wiro-romance)]"
    >
      <PageContainer className="max-w-[1600px]">
        <div className="mb-8">
          <h1 className="text-h2 tracking-[-0.04em]">
            {builderCopy.title[0]}{" "}
            <span className="text-[var(--wiro-mauve)]">{builderCopy.title[1]}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[var(--wiro-romance)]/70">{builderCopy.lead}</p>
        </div>

        <PortfolioBuilderTopBar
          user={user}
          onSignOut={() => {
            setUser(null);
            setPages([]);
          }}
          auth={
            user
              ? undefined
              : {
                  mode,
                  setMode,
                  username,
                  setUsername,
                  password,
                  setPassword,
                  fullName,
                  setFullName,
                  whatsapp,
                  setWhatsapp,
                  privacyAccepted,
                  setPrivacyAccepted,
                  ticketNote,
                  setTicketNote,
                  busy,
                  onSubmit: handleAuthSubmit,
                }
          }
        />

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-[var(--hoahwa-accent)]">{message}</p> : null}

        {!user ? (
          <div className="mt-12 rounded-lg border border-dashed border-[var(--wiro-romance)]/25 p-12 text-center">
            <p className="text-[var(--wiro-romance)]/60">Sign in above to edit your portfolio with live preview.</p>
            <Link href="/p/demo/" className="mt-4 inline-block text-sm text-[var(--hoahwa-accent)] underline">
              View demo layout →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 rounded-lg border border-[var(--wiro-romance)]/15 p-4">
              <div className="grid flex-1 gap-4 sm:grid-cols-3">
                <Field label="Page slug (URL)" value={slug} onChange={setSlug} placeholder={user.username} />
                <Field label="Page title" value={title} onChange={setTitle} />
                <Field
                  label="Meta description"
                  value={config.meta.description}
                  onChange={(v) => setConfig((c) => ({ ...c, meta: { ...c.meta, description: v } }))}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSave(false)}
                  className="rounded-full border border-[var(--wiro-romance)]/35 px-5 py-2 text-sm disabled:opacity-60"
                >
                  Save draft
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleSave(true)}
                  className="rounded-full bg-[var(--hoahwa-accent)] px-5 py-2 text-sm text-[var(--wiro-cod-gray)] disabled:opacity-60"
                >
                  Publish ({PORTFOLIO_RETENTION_DAYS}d)
                </button>
              </div>
            </div>

            {pages.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--wiro-romance)]/60">
                {pages.map((page) => (
                  <li key={page.id}>
                    {page.slug} · {page.status}
                    {page.status === "published" ? (
                      <>
                        {" · "}
                        <Link
                          href={`/portfolio/preview/?slug=${encodeURIComponent(page.slug)}`}
                          target="_blank"
                          className="text-[var(--hoahwa-accent)] underline"
                        >
                          live
                        </Link>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_400px]">
              <div className="min-w-0">
                <PortfolioBuilderPreview config={previewConfig} />
              </div>
              <div className="min-w-0 space-y-3 xl:sticky xl:top-24 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--wiro-mauve)]">
                  Edit content
                </p>
                <PortfolioSectionEditor config={config} onChange={setConfig} />
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </PageSection>
  );
}
