"use client";

import Image from "next/image";
import Link from "next/link";
import { treeCopy, type TreePaletteId, type TreeSeason } from "@/content/tree";
import { cn } from "@/lib/cn";

const SEASONS: { id: TreeSeason; label: string }[] = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
];

const PALETTES: { id: TreePaletteId; swatch: string; label: string }[] = [
  { id: "gold", swatch: "#cd9d65", label: "Gold" },
  { id: "lavender", swatch: "#c4a0d8", label: "Lavender" },
  { id: "coral", swatch: "#e08a72", label: "Coral" },
  { id: "sky", swatch: "#7eb8d4", label: "Sky" },
  { id: "snow", swatch: "#d8d2c8", label: "Snow" },
];

type TreeOverlayProps = {
  url: string;
  season: TreeSeason;
  palette: TreePaletteId;
  scanView: boolean;
  shortUrl?: string;
  status: "idle" | "planting" | "ready" | "error";
  error?: string;
  copied: boolean;
  onUrlChange: (value: string) => void;
  onSeason: (season: TreeSeason) => void;
  onPalette: (palette: TreePaletteId) => void;
  onPlant: () => void;
  onToggleScan: () => void;
  onCopy: () => void;
};

export function TreeOverlay({
  url,
  season,
  palette,
  scanView,
  shortUrl,
  status,
  error,
  copied,
  onUrlChange,
  onSeason,
  onPalette,
  onPlant,
  onToggleScan,
  onCopy,
}: TreeOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 md:p-6">
      <header className="pointer-events-auto flex items-start justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md"
        >
          <span className="relative h-8 w-8 shrink-0">
            <Image
              src="/LOGO HOAHWA/hoahwa_logo_board-07.png"
              alt="Hoahwa"
              fill
              className="object-contain"
              sizes="32px"
            />
          </span>
          <span className="pr-1">
            <span className="block text-sm tracking-[-0.02em] text-[var(--wiro-romance)]">
              {treeCopy.title}
            </span>
            <span className="block text-[11px] text-[var(--wiro-romance)]/55">
              {treeCopy.back}
            </span>
          </span>
        </Link>
        <p className="hidden max-w-xs text-right text-xs tracking-[-0.02em] text-[var(--wiro-romance)]/60 md:block">
          {treeCopy.kicker}
        </p>
      </header>

      <div className="pointer-events-none flex flex-1 flex-col justify-end gap-4 md:flex-row md:items-end md:justify-between">
        <div className="pointer-events-auto flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--wiro-romance)]/45">
            Season
          </span>
          <div className="flex gap-1 rounded-full border border-white/10 bg-black/45 p-1 backdrop-blur-md">
            {SEASONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSeason(item.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs tracking-[-0.02em] transition-colors",
                  season === item.id
                    ? "bg-[var(--hoahwa-accent)] text-[var(--wiro-cod-gray)]"
                    : "text-[var(--wiro-romance)]/80 hover:text-[var(--wiro-romance)]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto flex flex-col items-start gap-2 md:items-end">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--wiro-romance)]/45">
            Palette
          </span>
          <div className="flex gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md">
            {PALETTES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                title={item.label}
                onClick={() => onPalette(item.id)}
                className={cn(
                  "h-5 w-5 rounded-full border transition-transform",
                  palette === item.id
                    ? "scale-110 border-white"
                    : "border-white/20 hover:scale-105",
                )}
                style={{ backgroundColor: item.swatch }}
              />
            ))}
          </div>
        </div>
      </div>

      <form
        className="pointer-events-auto mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur-md md:flex-row md:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          onPlant();
        }}
      >
        <input
          value={url}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder={treeCopy.placeholder}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[var(--wiro-romance)] outline-none placeholder:text-[var(--wiro-romance)]/35"
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={status === "planting"}
            className="rounded-full bg-[var(--hoahwa-accent)] px-4 py-2 text-sm text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === "planting" ? treeCopy.planting : treeCopy.generate}
          </button>
          <button
            type="button"
            onClick={onToggleScan}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--wiro-romance)] hover:border-[var(--hoahwa-accent)]"
          >
            {scanView ? treeCopy.groveView : treeCopy.scanView}
          </button>
          {shortUrl ? (
            <button
              type="button"
              onClick={onCopy}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-[var(--hoahwa-accent)] hover:border-[var(--hoahwa-accent)]"
            >
              {copied ? treeCopy.copied : treeCopy.copy}
            </button>
          ) : null}
        </div>
      </form>

      <div className="pointer-events-none mt-3 flex flex-col gap-1 text-xs tracking-[-0.02em] text-[var(--wiro-romance)]/55">
        {shortUrl ? (
          <p className="pointer-events-auto break-all text-[var(--hoahwa-accent)]">
            {shortUrl}
          </p>
        ) : (
          <p>{treeCopy.emptyHint}</p>
        )}
        <p>{treeCopy.hint}</p>
        {error ? <p className="text-red-300">{error}</p> : null}
        <p className="max-w-xl text-[var(--wiro-romance)]/35">{treeCopy.privacy}</p>
      </div>
    </div>
  );
}
