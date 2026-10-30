"use client";

import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import {
  getCookieConsentServerSnapshot,
  getCookieConsentSnapshot,
  subscribeCookieConsent,
} from "@/lib/cookie-consent";

/**
 * YouTube embed behind functional-cookie consent.
 *
 * The iframe is third-party and lets YouTube set storage, so it never ships in
 * the page: the static HTML carries only a placeholder. A visitor who has not
 * opted in to Functional cookies can load just this video for the current
 * visit without changing their stored consent. The placeholder fills the same
 * aspect-video box as the player, so nothing shifts when it swaps.
 */
export function YouTubeConsentEmbed({
  youtubeId,
  caption,
  poster,
}: {
  youtubeId: string;
  caption: string;
  poster?: string;
}) {
  const stored = useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot,
  );
  // Session-only override: load this one video without touching stored consent.
  const [loadedThisVisit, setLoadedThisVisit] = useState(false);

  const consented = stored?.choices.functional === true;
  const canEmbed = consented || loadedThisVisit;

  if (!canEmbed) {
    return (
      <div
        role="group"
        aria-label={caption}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-[var(--wiro-cod-gray)]/55" />
        <div className="relative flex max-w-[420px] flex-col items-center gap-4 px-8 text-center">
          <p className="text-base leading-6 tracking-[-0.03em] text-[var(--wiro-romance)]">
            Load video from YouTube — this sets YouTube cookies.
          </p>
          <button
            type="button"
            onClick={() => setLoadedThisVisit(true)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--wiro-mauve)] px-6 py-2.5 text-base tracking-[-0.03em] text-[var(--wiro-cod-gray)] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--wiro-romance)]"
          >
            Load video
          </button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
      title={caption}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="absolute inset-0 h-full w-full"
    />
  );
}
