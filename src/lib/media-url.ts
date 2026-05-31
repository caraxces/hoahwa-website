/**
 * Normalize external media URLs (Google Drive, CDN, etc.) for portfolio pages.
 */
export function normalizeMediaUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  const driveFileMatch = trimmed.match(
    /(?:drive\.google\.com\/file\/d\/|docs\.google\.com\/uc\?id=)([a-zA-Z0-9_-]+)/,
  );
  if (driveFileMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveFileMatch[1]}`;
  }

  const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
  }

  return trimmed;
}

export function isValidMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url, "https://hoahwa.com");
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return url.startsWith("/");
  }
}
