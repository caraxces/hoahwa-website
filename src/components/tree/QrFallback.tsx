"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { treeCopy } from "@/content/tree";

type QrFallbackProps = {
  payload: string;
  shortUrl?: string;
};

export function QrFallback({ payload, shortUrl }: QrFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    void QRCode.toCanvas(canvas, payload, {
      width: 280,
      margin: 2,
      color: { dark: "#1a120c", light: "#fffdfa" },
    });
  }, [payload]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#151515] px-6 text-center">
      <p className="max-w-sm text-sm text-[var(--wiro-romance)]/70">
        {treeCopy.fallbackTitle}
      </p>
      <canvas
        ref={canvasRef}
        className="rounded-lg bg-[var(--wiro-romance)] p-3"
      />
      {shortUrl ? (
        <p className="break-all text-sm text-[var(--hoahwa-accent)]">{shortUrl}</p>
      ) : null}
    </div>
  );
}
