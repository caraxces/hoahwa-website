import { PORTFOLIO_AUTH_API_URL, PORTFOLIO_PAGES_API_URL } from "@/lib/portfolio-api-urls";

const AUTH_URL = PORTFOLIO_AUTH_API_URL;
const PAGES_URL = PORTFOLIO_PAGES_API_URL;

const TOKEN_KEY = "hoahwa_portfolio_token";

export type PortfolioUser = {
  id: number;
  username: string;
  full_name: string;
  whatsapp: string;
};

export type PortfolioPageSummary = {
  id: number;
  slug: string;
  title: string;
  status: "draft" | "published";
  expires_at: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function parseResponse(res: Response) {
  let data: { ok?: boolean; error?: string } = {};
  const contentType = res.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      if (res.status === 404) {
        return {
          ok: false as const,
          error: "Portfolio API not found. Deploy the latest site to hoahwa.com first.",
        };
      }
      return { ok: false as const, error: text.slice(0, 120) || "Unexpected server response." };
    }
  } catch {
    return { ok: false as const, error: "Unexpected server response." };
  }
  if (!res.ok || !data.ok) {
    return { ok: false as const, error: data.error ?? "Request failed." };
  }
  return { ok: true as const, data };
}

const NETWORK_ERROR = {
  ok: false as const,
  error: "Cannot reach Hoahwa API. Check your connection or try again shortly.",
};

async function portfolioFetch(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch {
    return null;
  }
}

export async function registerUser(payload: {
  username: string;
  password: string;
  full_name: string;
  whatsapp: string;
  privacy_accepted: boolean;
}) {
  const res = await portfolioFetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", ...payload }),
  });
  if (!res) return NETWORK_ERROR;
  const result = await parseResponse(res);
  if (!result.ok) return result;
  const token = (result.data as { token: string }).token;
  setAuthToken(token);
  return { ok: true as const, user: (result.data as { user: PortfolioUser }).user, token };
}

export async function loginUser(payload: { username: string; password: string }) {
  const res = await portfolioFetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", ...payload }),
  });
  if (!res) return NETWORK_ERROR;
  const result = await parseResponse(res);
  if (!result.ok) return result;
  const token = (result.data as { token: string }).token;
  setAuthToken(token);
  return { ok: true as const, user: (result.data as { user: PortfolioUser }).user, token };
}

export async function fetchMe() {
  const token = getToken();
  if (!token) return { ok: false as const, error: "Not signed in." };

  const res = await portfolioFetch(AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "me" }),
  });
  if (!res) return NETWORK_ERROR;
  const result = await parseResponse(res);
  if (!result.ok) {
    setAuthToken(null);
    return result;
  }
  return { ok: true as const, user: (result.data as { user: PortfolioUser }).user };
}

export async function submitPasswordTicket(payload: {
  username: string;
  whatsapp: string;
  note?: string;
}) {
  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "password_ticket", ...payload }),
  });
  return parseResponse(res);
}

export async function listMyPages() {
  const token = getToken();
  if (!token) return { ok: false as const, error: "Not signed in." };

  const res = await portfolioFetch(PAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "list" }),
  });
  if (!res) return NETWORK_ERROR;
  const result = await parseResponse(res);
  if (!result.ok) return result;
  return {
    ok: true as const,
    pages: (result.data as { pages: PortfolioPageSummary[] }).pages,
  };
}

export async function savePage(payload: {
  slug: string;
  title: string;
  config: unknown;
  publish?: boolean;
}) {
  const token = getToken();
  if (!token) return { ok: false as const, error: "Not signed in." };

  const res = await portfolioFetch(PAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action: "save", ...payload }),
  });
  if (!res) return NETWORK_ERROR;
  return parseResponse(res);
}

export async function fetchPublishedPage(slug: string) {
  const res = await portfolioFetch(`${PAGES_URL}?slug=${encodeURIComponent(slug)}`, {
    method: "GET",
  });
  if (!res) return NETWORK_ERROR;
  const result = await parseResponse(res);
  if (!result.ok) return result;
  return {
    ok: true as const,
    page: (result.data as { page: { slug: string; title: string; config: unknown } }).page,
  };
}

export function logoutUser() {
  setAuthToken(null);
}
