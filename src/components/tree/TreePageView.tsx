"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_TREE_PALETTE,
  DEFAULT_TREE_PAYLOAD,
  DEFAULT_TREE_SEASON,
  type TreePaletteId,
  type TreeSeason,
} from "@/content/tree";
import { isPalette, isSeason, normalizeHttpUrl } from "@/lib/qr-tree";
import {
  createShortLink,
  fetchShortLink,
  publicShortUrl,
} from "@/lib/short-links-api";
import { QrFallback } from "./QrFallback";
import { TreeOverlay } from "./TreeOverlay";

const TreeCanvas = dynamic(
  () => import("./TreeCanvas").then((mod) => ({ default: mod.TreeCanvas })),
  { ssr: false },
);

export function TreePageView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryCode = (searchParams.get("c") ?? "").replace(/[^A-Za-z0-9]/g, "");
  const qSeason = searchParams.get("season");
  const qPalette = searchParams.get("palette");
  const sharedShort =
    queryCode.length >= 4 ? publicShortUrl(queryCode) : undefined;

  const [url, setUrl] = useState(sharedShort ?? "");
  const [payload, setPayload] = useState(sharedShort ?? DEFAULT_TREE_PAYLOAD);
  const [season, setSeason] = useState<TreeSeason>(
    isSeason(qSeason) ? qSeason : DEFAULT_TREE_SEASON,
  );
  const [palette, setPalette] = useState<TreePaletteId>(
    isPalette(qPalette) ? qPalette : DEFAULT_TREE_PALETTE,
  );
  const [scanView, setScanView] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | undefined>(sharedShort);
  const [status, setStatus] = useState<"idle" | "planting" | "ready" | "error">(
    sharedShort ? "ready" : "idle",
  );
  const [error, setError] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    if (queryCode.length < 4) return;
    let cancelled = false;
    void fetchShortLink(queryCode).then((result) => {
      if (cancelled || !result.ok) return;
      setSeason(result.data.season);
      setPalette(result.data.palette);
      setShortUrl(result.data.shortUrl);
      setPayload(result.data.shortUrl);
      setUrl(result.data.shortUrl);
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
  }, [queryCode]);

  const writeQuery = (next: {
    code?: string;
    season: TreeSeason;
    palette: TreePaletteId;
  }) => {
    const params = new URLSearchParams();
    if (next.code) params.set("c", next.code);
    params.set("season", next.season);
    params.set("palette", next.palette);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const plant = async () => {
    const normalized = normalizeHttpUrl(url || DEFAULT_TREE_PAYLOAD);
    if (!normalized) {
      setStatus("error");
      setError("Enter a valid http(s) URL.");
      return;
    }

    setError(undefined);
    setStatus("planting");
    setPayload(normalized);
    setScanView(false);

    const result = await createShortLink({
      url: normalized,
      season,
      palette,
    });

    if (!result.ok) {
      setStatus("error");
      setError(`${result.error} QR still encodes your original URL.`);
      return;
    }

    setShortUrl(result.data.shortUrl);
    setPayload(result.data.shortUrl);
    setStatus("ready");
    writeQuery({
      code: result.data.code,
      season,
      palette,
    });
  };

  const onSeason = (next: TreeSeason) => {
    setSeason(next);
    const code = shortUrl?.split("/r/")[1]?.replace(/\/$/, "");
    writeQuery({ code, season: next, palette });
  };

  const onPalette = (next: TreePaletteId) => {
    setPalette(next);
    const code = shortUrl?.split("/r/")[1]?.replace(/\/$/, "");
    writeQuery({ code, season, palette: next });
  };

  const onCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy. Select the short link instead.");
    }
  };

  return (
    <div className="tree-app relative h-[100dvh] w-full overflow-hidden bg-[#151515]">
      {webgl ? (
        <TreeCanvas
          key="grove"
          payload={payload}
          season={season}
          palette={palette}
          scanView={scanView}
          onToggleScan={() => setScanView((v) => !v)}
          onUnsupported={() => setWebgl(false)}
        />
      ) : (
        <QrFallback payload={payload} shortUrl={shortUrl} />
      )}

      <TreeOverlay
        url={url}
        season={season}
        palette={palette}
        scanView={scanView}
        shortUrl={shortUrl}
        status={status}
        error={error}
        copied={copied}
        onUrlChange={setUrl}
        onSeason={onSeason}
        onPalette={onPalette}
        onPlant={() => void plant()}
        onToggleScan={() => setScanView((v) => !v)}
        onCopy={() => void onCopy()}
      />
    </div>
  );
}
