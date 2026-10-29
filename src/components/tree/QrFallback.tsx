"use client";

import { useEffect, useRef } from "react";
import type { TreePaletteId, TreeSeason } from "@/content/tree";
import { createGardenQrCanvas } from "@/lib/qr-garden-art";

type QrFallbackProps = {
  payload: string;
  shortUrl?: string;
  season: TreeSeason;
  palette: TreePaletteId;
};

export function QrFallback({ payload, shortUrl, season, palette }: QrFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    void createGardenQrCanvas(payload, season, palette).then((art) => {
      if (cancelled) return;
      canvas.width = art.width;
      canvas.height = art.height;
      canvas.getContext("2d")?.drawImage(art, 0, 0);
    });
    return () => { cancelled = true; };
  }, [payload, season, palette]);

  return (
    <div className="tree-grove-stage tree-qr-fallback flex flex-col items-center justify-center gap-2 text-center">
      <canvas
        ref={canvasRef}
        className="max-h-full max-w-full object-contain"
        aria-label="Scannable botanical QR code"
      />
      {shortUrl ? (
        <p className="break-all text-sm text-[var(--hoahwa-accent)]">{shortUrl}</p>
      ) : null}
    </div>
  );
}
