/** Production PHP APIs (static export / local dev never runs PHP in Next). */
export const PORTFOLIO_AUTH_API_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_AUTH_API_URL ??
  "https://hoahwa.com/api/portfolio-auth.php";

export const PORTFOLIO_PAGES_API_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_PAGES_API_URL ??
  "https://hoahwa.com/api/portfolio-pages.php";
