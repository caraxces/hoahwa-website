"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_TREE_CATEGORY,
  DEFAULT_TREE_PALETTE,
  DEFAULT_TREE_PAYLOAD,
  DEFAULT_TREE_SEASON,
  isCategory,
  type TreePaletteId,
  type TreeSeason,
} from "@/content/tree";
import { isPalette, isSeason, normalizeHttpUrl } from "@/lib/qr-tree";
import { createShortLink, fetchShortLink, type ShortLinkRecord } from "@/lib/short-links-api";
import { QrFallback } from "./QrFallback";
import { TreeOverlay, type TreeFormState } from "./TreeOverlay";

const GroveCanvas = dynamic(() => import("./GroveCanvas").then((mod) => ({ default: mod.GroveCanvas })), { ssr: false });

const POLL_MS = 12000;

export function TreePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryCode = (searchParams.get("c") ?? "").replace(/[^A-Za-z0-9]/g, "");
  const qSeason = searchParams.get("season");
  const qPalette = searchParams.get("palette");
  const qCategory = searchParams.get("category");

  const [form, setForm] = useState<TreeFormState>({ url: "", title: "", category: isCategory(qCategory) ? qCategory : DEFAULT_TREE_CATEGORY, alias: "" });
  const [link, setLink] = useState<ShortLinkRecord | undefined>();
  const [payload, setPayload] = useState(DEFAULT_TREE_PAYLOAD);
  const [season, setSeason] = useState<TreeSeason>(isSeason(qSeason) ? qSeason : DEFAULT_TREE_SEASON);
  const [palette, setPalette] = useState<TreePaletteId>(isPalette(qPalette) ? qPalette : DEFAULT_TREE_PALETTE);
  const [scanView, setScanView] = useState(true);
  const [status, setStatus] = useState<"idle" | "planting" | "ready" | "error">(queryCode.length >= 4 ? "planting" : "idle");
  const [error, setError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const codeRef = useRef<string | undefined>(queryCode.length >= 4 ? queryCode : undefined);

  const applyLink = (record: ShortLinkRecord) => {
    setLink(record);
    setPayload(record.shortUrl);
    setSeason(record.season);
    setPalette(record.palette);
    codeRef.current = record.code;
    setStatus("ready");
  };

  // Shared link (?c=code): load it, then keep polling so the tree grows while people click.
  useEffect(() => {
    if (queryCode.length < 4) return;
    let cancelled = false;
    void fetchShortLink(queryCode).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return;
      }
      const record = result.data;
      setLink(record);
      setPayload(record.shortUrl);
      setSeason(record.season);
      setPalette(record.palette);
      codeRef.current = record.code;
      setStatus("ready");
      setForm((f) => ({ ...f, url: record.shortUrl, title: record.title ?? "", category: record.category }));
    });
    return () => {
      cancelled = true;
    };
  }, [queryCode]);

  const linkCode = link?.code;
  useEffect(() => {
    if (!linkCode) return;
    const timer = window.setInterval(() => {
      void fetchShortLink(linkCode).then((result) => {
        if (result.ok && codeRef.current === result.data.code) setLink(result.data);
      });
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [linkCode]);

  const writeQuery = (next: { code?: string; season: TreeSeason; palette: TreePaletteId }) => {
    const params = new URLSearchParams();
    if (next.code) params.set("c", next.code);
    params.set("season", next.season);
    params.set("palette", next.palette);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const plant = async () => {
    const normalized = normalizeHttpUrl(form.url || DEFAULT_TREE_PAYLOAD);
    if (!normalized) {
      setStatus("error");
      setError("Enter a valid http(s) URL.");
      return;
    }
    setError(undefined);
    setStatus("planting");
    setScanView(true);
    const result = await createShortLink({ url: normalized, title: form.title.trim() || undefined, category: form.category, alias: form.alias.trim() || undefined, season, palette });
    if (!result.ok) {
      setStatus("error");
      setError(result.error);
      return;
    }
    applyLink(result.data);
    setForm((f) => ({ ...f, alias: "" }));
    writeQuery({ code: result.data.code, season, palette });
  };

  const onSeason = (next: TreeSeason) => {
    setSeason(next);
    writeQuery({ code: codeRef.current, season: next, palette });
  };
  const onPalette = (next: TreePaletteId) => {
    setPalette(next);
    writeQuery({ code: codeRef.current, season, palette: next });
  };
  const onCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy. Select the short link instead.");
    }
  };

  return (
    <div className="tree-app tree-workshop bg-[#f4ece0]" data-scan={scanView} data-stage={link?.stage.id ?? "preview"} data-hits={link?.hits ?? 0}>
      <TreeOverlay
        interactive={webgl}
        form={form}
        season={season}
        palette={palette}
        scanView={scanView}
        link={link}
        status={status}
        error={error}
        copied={copied}
        onForm={(patch) => setForm((f) => ({ ...f, ...patch }))}
        onSeason={onSeason}
        onPalette={onPalette}
        onPlant={() => void plant()}
        onToggleScan={() => setScanView((v) => !v)}
        onCopy={() => void onCopy()}
      >
        {status === "planting" || (queryCode.length >= 4 && !link && status === "error") ? (
          <div className="tree-loading" role="status">{status === "planting" ? "Preparing your QR…" : "This link could not be loaded. Please try again."}</div>
        ) : webgl ? (
          <GroveCanvas payload={payload} hits={link?.hits ?? 0} preview={!link} season={season} palette={palette} scanView={scanView} onToggleScan={() => setScanView((v) => !v)} onUnsupported={() => setWebgl(false)} />
        ) : (
          <QrFallback payload={payload} shortUrl={link?.shortUrl} season={season} palette={palette} />
        )}
      </TreeOverlay>
    </div>
  );
}
