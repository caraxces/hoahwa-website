import { SHORT_LINKS_API_URL, SITE_URL } from "@/lib/portfolio-api-urls";
import type { TreePaletteId, TreeSeason } from "@/content/tree";

export type ShortLinkRecord = {
  code: string;
  shortUrl: string;
  season: TreeSeason;
  palette: TreePaletteId;
};

function publicShortUrl(code: string): string {
  return `${SITE_URL}/r/${code}`;
}

async function readPayload(
  res: Response,
): Promise<{ ok?: boolean; error?: string } & Partial<ShortLinkRecord>> {
  try {
    return (await res.json()) as {
      ok?: boolean;
      error?: string;
    } & Partial<ShortLinkRecord>;
  } catch {
    return { ok: false, error: "Unexpected server response." };
  }
}

export async function createShortLink(input: {
  url: string;
  season: TreeSeason;
  palette: TreePaletteId;
}): Promise<{ ok: true; data: ShortLinkRecord } | { ok: false; error: string }> {
  try {
    const res = await fetch(SHORT_LINKS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await readPayload(res);
    if (!res.ok || !data.ok || !data.code) {
      return { ok: false, error: data.error ?? "Could not plant a short grove." };
    }
    return {
      ok: true,
      data: {
        code: data.code,
        shortUrl: data.shortUrl ?? publicShortUrl(data.code),
        season: (data.season as TreeSeason) ?? input.season,
        palette: (data.palette as TreePaletteId) ?? input.palette,
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the short-link grove." };
  }
}

export async function fetchShortLink(
  code: string,
): Promise<{ ok: true; data: ShortLinkRecord } | { ok: false; error: string }> {
  try {
    const url = `${SHORT_LINKS_API_URL}?code=${encodeURIComponent(code)}`;
    const res = await fetch(url);
    const data = await readPayload(res);
    if (!res.ok || !data.ok || !data.code) {
      return { ok: false, error: data.error ?? "Short grove not found." };
    }
    return {
      ok: true,
      data: {
        code: data.code,
        shortUrl: data.shortUrl ?? publicShortUrl(data.code),
        season: (data.season as TreeSeason) ?? "spring",
        palette: (data.palette as TreePaletteId) ?? "gold",
      },
    };
  } catch {
    return { ok: false, error: "Could not reach the short-link grove." };
  }
}

export { publicShortUrl };
