export type VibeId = "sunny" | "windy" | "raining";

/** @deprecated migrate from legacy storage */
const LEGACY_VIBE_MAP: Record<string, VibeId> = {
  happy: "windy",
  rainy: "raining",
};

export const DEFAULT_VIBE: VibeId = "sunny";
export const VIBE_STORAGE_KEY = "hoahwa-vibe";

export const VIBE_PALETTES: Record<
  VibeId,
  { c1: string; c2: string; c3: string; c4: string; mood: string }
> = {
  sunny: {
    c1: "#5C3D1E",
    c2: "#D4A04A",
    c3: "#F0D4A8",
    c4: "#FFF8ED",
    mood: "Golden hour — warm amber & cream",
  },
  windy: {
    c1: "#3E5F44",
    c2: "#5E936C",
    c3: "#93DA97",
    c4: "#E8FFD7",
    mood: "Fresh breeze — cool mint green",
  },
  raining: {
    c1: "#41431B",
    c2: "#AEB784",
    c3: "#E3DBBB",
    c4: "#F8F3E1",
    mood: "Rainy day — olive sage & beige",
  },
};

export const VIBE_LABELS: Record<VibeId, { title: string; tooltip: string }> = {
  sunny: {
    title: "Sunny",
    tooltip: "For the sunny vibe",
  },
  windy: {
    title: "Windy",
    tooltip: "For the windy vibe",
  },
  raining: {
    title: "Raining",
    tooltip: "For your raining day",
  },
};

export const VIBE_ORDER: VibeId[] = ["sunny", "windy", "raining"];

/** Friendly line shown when switching to each vibe (grammar-checked). */
export const VIBE_TOAST_MESSAGES: Record<VibeId, string> = {
  sunny: "Hope you have many good days!",
  windy: "Enjoy your days!",
  raining: "You're good!",
};

/** Shown once per session on first visit, below the vibe toggle. */
export const VIBE_WELCOME_TOAST = VIBE_TOAST_MESSAGES.sunny;
export const VIBE_WELCOME_SESSION_KEY = "hoahwa-vibe-welcome-shown";

export function isVibeId(value: string | null | undefined): value is VibeId {
  return value === "sunny" || value === "windy" || value === "raining";
}

export function normalizeVibeId(value: string | null | undefined): VibeId {
  if (isVibeId(value)) return value;
  if (value && value in LEGACY_VIBE_MAP) return LEGACY_VIBE_MAP[value]!;
  return DEFAULT_VIBE;
}

export function readVibe(): VibeId {
  if (typeof window === "undefined") return DEFAULT_VIBE;
  try {
    const stored = localStorage.getItem(VIBE_STORAGE_KEY);
    return normalizeVibeId(stored);
  } catch {
    return DEFAULT_VIBE;
  }
}

export function writeVibe(vibe: VibeId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VIBE_STORAGE_KEY, vibe);
  document.documentElement.setAttribute("data-vibe", vibe);
  window.dispatchEvent(new CustomEvent("hoahwa:vibe-change", { detail: vibe }));
}

export function applyVibeToDocument(vibe: VibeId): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-vibe", vibe);
}

export function nextVibe(current: VibeId): VibeId {
  const i = VIBE_ORDER.indexOf(current);
  return VIBE_ORDER[(i + 1) % VIBE_ORDER.length]!;
}
