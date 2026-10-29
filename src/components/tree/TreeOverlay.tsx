"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { downloadGardenQr } from "@/lib/qr-garden-art";
import {
  TREE_CATEGORIES,
  categoryLabel,
  linksCopy,
  treeCopy,
  type TreeCategoryId,
  type TreePaletteId,
  type TreeSeason,
} from "@/content/tree";
import { cn } from "@/lib/cn";
import type { ShortLinkRecord } from "@/lib/short-links-api";

const SEASONS: { id: TreeSeason; label: string }[] = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
];

const PALETTES: { id: TreePaletteId; swatch: string; label: string }[] = [
  { id: "gold", swatch: "#cd9d65", label: "Gold" },
  { id: "lavender", swatch: "#a985c9", label: "Lavender" },
  { id: "coral", swatch: "#e08a72", label: "Coral" },
  { id: "sky", swatch: "#5fa3c4", label: "Sky" },
  { id: "snow", swatch: "#9aa0a0", label: "Snow" },
];

export type TreeFormState = {
  url: string;
  title: string;
  category: TreeCategoryId;
  alias: string;
};

type TreeOverlayProps = {
  children: ReactNode;
  interactive: boolean;
  form: TreeFormState;
  season: TreeSeason;
  palette: TreePaletteId;
  scanView: boolean;
  link?: ShortLinkRecord;
  status: "idle" | "planting" | "ready" | "error";
  error?: string;
  copied: boolean;
  onForm: (patch: Partial<TreeFormState>) => void;
  onSeason: (season: TreeSeason) => void;
  onPalette: (palette: TreePaletteId) => void;
  onPlant: () => void;
  onToggleScan: () => void;
  onCopy: () => void;
};

const panel = "rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md shadow-[0_10px_30px_rgba(60,50,35,0.08)]";
const field = "min-w-0 rounded-xl border border-black/10 bg-white/85 px-3 py-2 text-sm text-[#2b241d] outline-none placeholder:text-black/35 focus:border-[var(--hoahwa-accent)]";
const pill = "rounded-full border border-black/10 bg-white/80 backdrop-blur-md";

export function TreeOverlay({ children, interactive, form, season, palette, scanView, link, status, error, copied, onForm, onSeason, onPalette, onPlant, onToggleScan, onCopy }: TreeOverlayProps) {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const exportQr = async () => {
    if (!link) return;
    setExporting(true);
    setExportError("");
    try { await downloadGardenQr(link.shortUrl, season, palette); }
    catch { setExportError("Could not download. Please try again."); }
    finally { setExporting(false); }
  };
  const stage = link?.stage;
  const progress = stage ? (stage.next ? Math.min(1, (link!.hits - stage.min) / Math.max(1, stage.next - stage.min)) : 1) : 0;
  const daily = link?.daily ?? [];
  const dailyMax = Math.max(1, ...daily.map((d) => d.count));
  const devices = link?.devices;
  const deviceTotal = devices ? devices.mobile + devices.desktop : 0;
  return (
    <div className="tree-layout text-[#2b241d]">
      <header className="pointer-events-auto flex items-start justify-between gap-4">
        <Link href="/" className={cn(pill, "flex items-center gap-3 px-3 py-2")}>
          <span className="relative h-8 w-8 shrink-0">
            <Image src="/logo-hoahwa/hoahwa_logo_board-07.png" alt="HoaHwa" fill className="object-contain" sizes="32px" />
          </span>
          <span className="pr-1">
            <span className="block text-sm">{linksCopy.brand}</span>
            <span className="block text-[11px] text-black/50">{linksCopy.tagline}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <p className="hidden max-w-xs text-right text-xs text-black/50 lg:block">{link ? treeCopy.kicker : "One QR. A thousand little possibilities."}</p>
          <Link href="/tree/market" data-testid="market-link" className={cn(pill, "px-4 py-2 text-xs text-[#8a6a2f] hover:border-[var(--hoahwa-accent)]")}>
            {linksCopy.market} →
          </Link>
        </div>
      </header>

      <main className="tree-main">
        <div className="tree-stage-frame" aria-busy={status === "planting"}>{children}</div>
        <button data-testid="morph-toggle" type="button" disabled={!interactive || status === "planting"} onClick={onToggleScan} className="tree-morph-toggle" aria-label={!interactive ? "QR ready to scan" : scanView ? "Grow the cherry tree" : "Fold the tree into a QR"}>
          {interactive ? scanView ? "Grow the cherry tree ↗" : "Fold back into QR ↙" : "Your QR is ready to scan"}
        </button>
        <p className="tree-mode-hint">{!interactive ? "Scan this QR or download it below." : scanView ? "Scan the colors. Tap to watch them grow." : "The same QR blocks, now in bloom. Drag to explore."}</p>
      </main>

      <div className="tree-garden-controls flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="tree-season-controls pointer-events-auto flex flex-wrap items-center gap-2 md:items-start">
          <span className="hidden w-full text-[11px] uppercase tracking-[0.18em] text-black/40 md:block">Season</span>
          <div className={cn(pill, "flex gap-1 p-1")}>
            {SEASONS.map((item) => (
              <button key={item.id} type="button" aria-pressed={season === item.id} onClick={() => onSeason(item.id)} className={cn("rounded-full px-3 py-1.5 text-xs transition-colors", season === item.id ? "bg-[var(--hoahwa-accent)] text-white" : "text-black/60 hover:text-black")}>
                {item.label}
              </button>
            ))}
          </div>
          <div className={cn(pill, "flex gap-2 px-3 py-2")}>
            {PALETTES.map((item) => (
              <button key={item.id} type="button" aria-label={item.label} aria-pressed={palette === item.id} title={item.label} onClick={() => onPalette(item.id)} className={cn("h-5 w-5 rounded-full border transition-transform", palette === item.id ? "scale-110 border-black/40" : "border-black/10 hover:scale-105")} style={{ backgroundColor: item.swatch }} />
            ))}
          </div>
        </div>

        {link ? (
          <section data-testid="link-stats" className={cn(panel, "pointer-events-auto w-full max-w-sm p-4")}>
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm">{link.title ?? link.targetHost}</p>
                <p className="text-[11px] text-black/45">{categoryLabel(link.category)} · {link.targetHost}</p>
              </div>
              <p className="shrink-0 text-right">
                <span data-testid="link-hits" className="block text-2xl leading-none">{link.hits.toLocaleString("en-US")}</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-black/45">{linksCopy.clicks}</span>
              </p>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px]">
                <span data-testid="link-stage" className="text-[#8a6a2f]">{linksCopy.stage} · {stage?.label}</span>
                <span className="text-black/45">{stage?.next ? linksCopy.nextStage(stage.next - link.hits, stage.nextLabel ?? "") : linksCopy.topStage}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-[var(--hoahwa-accent)] transition-[width] duration-700" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            </div>
            <details className="tree-analytics mt-2">
              <summary className="cursor-pointer text-[11px] text-black/50">Link insights</summary>
            {daily.length ? (
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">{linksCopy.last14}</p>
                <div className="mt-1 flex h-10 items-end gap-[3px]" aria-label={linksCopy.last14}>
                  {daily.map((d) => (
                    <span key={d.day} title={`${d.day}: ${d.count}`} className="flex-1 rounded-sm bg-[var(--hoahwa-accent)]" style={{ height: `${Math.max(6, (d.count / dailyMax) * 100)}%`, opacity: d.count ? 0.9 : 0.25 }} />
                  ))}
                </div>
              </div>
            ) : null}
            {(link.referrers?.length || deviceTotal) ? (
              <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">{linksCopy.referrers}</p>
                  {(link.referrers ?? []).slice(0, 4).map((r) => (
                    <p key={r.host} className="flex justify-between gap-2"><span className="truncate">{r.host}</span><span className="text-black/45">{r.count}</span></p>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-black/40">{linksCopy.devices}</p>
                  {devices ? (
                    <>
                      <p className="flex justify-between"><span>Mobile</span><span className="text-black/45">{deviceTotal ? Math.round((devices.mobile / deviceTotal) * 100) : 0}%</span></p>
                      <p className="flex justify-between"><span>Desktop</span><span className="text-black/45">{deviceTotal ? Math.round((devices.desktop / deviceTotal) * 100) : 0}%</span></p>
                      <p className="flex justify-between text-black/40"><span>Bots (not counted)</span><span>{devices.bot}</span></p>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
            <p className="mt-3 text-[10px] text-black/40">{linksCopy.live}</p>
            </details>
          </section>
        ) : null}
      </div>

      <form
        data-testid="plant-form"
        data-options={showOptions}
        className={cn(panel, "pointer-events-auto mt-4 grid gap-2 p-3 md:grid-cols-[1.6fr_1fr_auto]")}
        onSubmit={(event) => {
          event.preventDefault();
          onPlant();
        }}
      >
        <input data-testid="url-input" value={form.url} onChange={(e) => onForm({ url: e.target.value })} placeholder={treeCopy.placeholder} autoCapitalize="off" autoCorrect="off" spellCheck={false} className={cn(field, "md:col-span-2")} />
        <div className="flex flex-wrap items-center gap-2">
          <button data-testid="plant-button" type="submit" disabled={status === "planting"} className="rounded-full bg-[var(--hoahwa-accent)] px-4 py-2 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60">
            {status === "planting" ? treeCopy.planting : treeCopy.generate}
          </button>
          <button data-testid="scan-toggle" type="button" disabled={!interactive} aria-pressed={scanView} onClick={onToggleScan} className="rounded-full border border-black/15 px-4 py-2 text-sm hover:border-[var(--hoahwa-accent)]">
            {scanView ? treeCopy.groveView : treeCopy.scanView}
          </button>
          <button data-testid="link-options" type="button" aria-expanded={showOptions} onClick={() => setShowOptions((v) => !v)} className="text-xs text-black/60">{showOptions ? "Less options" : "Link options"}</button>
        </div>
        <input data-testid="title-input" aria-label="Link title" value={form.title} onChange={(e) => onForm({ title: e.target.value })} maxLength={120} placeholder={linksCopy.titlePlaceholder} className={cn(field, "tree-extra-field")} />
        <select data-testid="category-select" value={form.category} onChange={(e) => onForm({ category: e.target.value as TreeCategoryId })} aria-label={linksCopy.category} className={cn(field, "tree-extra-field appearance-none")}>
          {TREE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <label className={cn(field, "tree-extra-field flex items-center gap-1 py-0 pr-2")}>
          <span className="text-black/40">{linksCopy.aliasPrefix}</span>
          <input data-testid="alias-input" value={form.alias} onChange={(e) => onForm({ alias: e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16) })} placeholder={linksCopy.aliasPlaceholder} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-black/30" />
        </label>
        <div className="flex flex-wrap items-center gap-2 md:col-span-3">
          {link ? (
            <>
              <a data-testid="short-url" href={link.shortUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-[#8a6a2f] underline-offset-4 hover:underline">{link.shortUrl.replace(/^https?:\/\//, "")}</a>
              <button data-testid="copy-button" type="button" onClick={onCopy} className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-[#8a6a2f] hover:border-[var(--hoahwa-accent)]">
                {copied ? treeCopy.copied : treeCopy.copy}
              </button>
              <button data-testid="qr-button" type="button" disabled={exporting} onClick={() => void exportQr()} className="rounded-full border border-black/15 px-3 py-1.5 text-xs hover:border-[var(--hoahwa-accent)] disabled:opacity-50">
                {exporting ? "Preparing…" : "Download QR"}
              </button>
              <span className="tree-form-note text-xs text-black/45">{scanView ? "Ready to scan." : "Fold back into QR to scan."}</span>
            </>
          ) : (
            <span className="tree-form-note text-xs text-black/55">{scanView ? "Point your camera at the blossoms to open hoahwa.com." : linksCopy.pitch}</span>
          )}
          {error ? <span data-testid="plant-error" className="text-xs text-red-600">{error}</span> : null}
          {exportError ? <span role="alert" className="text-xs text-red-600">{exportError}</span> : null}
        </div>
      </form>
      <p className="pointer-events-none mt-2 text-[11px] text-black/40">{treeCopy.hint} · {treeCopy.privacy}</p>
    </div>
  );
}
