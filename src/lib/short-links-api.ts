import { SHORT_LINKS_API_URL, SITE_URL } from "@/lib/portfolio-api-urls";
import type { TreeCategoryId, TreePaletteId, TreeSeason } from "@/content/tree";

export type TreeStage = {
  id: string;
  label: string;
  index: number;
  min: number;
  next: number | null;
  nextLabel: string | null;
};

export type ShortLinkRecord = {
  code: string;
  shortUrl: string;
  targetHost: string;
  title: string | null;
  category: TreeCategoryId;
  season: TreeSeason;
  palette: TreePaletteId;
  hits: number;
  stage: TreeStage;
  createdAt: string;
  lastHitAt: string | null;
  daily?: { day: string; count: number }[];
  referrers?: { host: string; count: number }[];
  devices?: { mobile: number; desktop: number; bot: number };
};

export type MarketResponse = {
  trees: ShortLinkRecord[];
  category: TreeCategoryId | null;
  totals: { links: number; hits: number };
};

export type CategoryCount = { category: TreeCategoryId; links: number; hits: number };

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

/** hoahwa.com/<code> — the public short URL, root level like bit.ly. */
export function publicShortUrl(code: string): string {
  return `${SITE_URL}/${code}`;
}

/** The code inside a short URL (hoahwa.com/abc123 or legacy hoahwa.com/r/abc123). */
export function codeFromShortUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const match = url.match(/\/(?:r\/)?([A-Za-z0-9]{4,16})\/?$/);
  return match?.[1];
}

async function request<T>(input: string, init?: RequestInit, fallback = "Could not reach HoaHwa Links."): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(input, { ...init, cache: "no-store" });
  } catch {
    return { ok: false, error: fallback };
  }
  // Read as text first: a firewall or captcha page answers with HTML, and the reason matters to the user.
  const body = await res.text().catch(() => "");
  let data: ({ ok?: boolean; error?: string } & Record<string, unknown>) | null = null;
  try {
    data = JSON.parse(body) as { ok?: boolean; error?: string } & Record<string, unknown>;
  } catch {
    return {
      ok: false,
      error:
        res.status === 403 || res.status === 429
          ? `The server refused the request (HTTP ${res.status}). Your network may be rate limited — try again in a few minutes.`
          : `The server answered HTTP ${res.status} instead of JSON. Try again in a moment.`,
    };
  }
  if (!res.ok || !data?.ok) {
    return { ok: false, error: (data?.error as string | undefined) ?? fallback };
  }
  return { ok: true, data: data as unknown as T };
}

export async function createShortLink(input: {
  url: string;
  title?: string;
  category?: TreeCategoryId;
  alias?: string;
  season: TreeSeason;
  palette: TreePaletteId;
}): Promise<ApiResult<ShortLinkRecord>> {
  const body = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (value) body.set(key, String(value));
  });
  return request<ShortLinkRecord>(SHORT_LINKS_API_URL, { method: "POST", body }, "Could not plant the link.");
}

export async function fetchShortLink(code: string): Promise<ApiResult<ShortLinkRecord>> {
  return request<ShortLinkRecord>(`${SHORT_LINKS_API_URL}?code=${encodeURIComponent(code)}`, undefined, "Short link not found.");
}

export async function fetchMarket(options: { category?: TreeCategoryId | null; sort?: "hits" | "new"; limit?: number } = {}): Promise<ApiResult<MarketResponse>> {
  const params = new URLSearchParams({ market: "1", sort: options.sort ?? "hits", limit: String(options.limit ?? 24) });
  if (options.category) params.set("category", options.category);
  return request<MarketResponse>(`${SHORT_LINKS_API_URL}?${params}`);
}

export async function fetchCategories(): Promise<ApiResult<{ categories: CategoryCount[] }>> {
  return request<{ categories: CategoryCount[] }>(`${SHORT_LINKS_API_URL}?categories=1`);
}
