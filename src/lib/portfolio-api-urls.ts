/** Production PHP APIs (static export / local dev never runs PHP in Next). */
export const PORTFOLIO_AUTH_API_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_AUTH_API_URL ??
  "https://hoahwa.com/api/portfolio-auth.php";

export const PORTFOLIO_PAGES_API_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_PAGES_API_URL ??
  "https://hoahwa.com/api/portfolio-pages.php";

export const SHORT_LINKS_API_URL =
  process.env.NEXT_PUBLIC_SHORT_LINKS_API_URL ??
  "https://hoahwa.com/api/short-links.php";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hoahwa.com"
).replace(/\/$/, "");
