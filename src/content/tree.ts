export const TREE_SEASONS = ["spring", "summer", "autumn"] as const;
export type TreeSeason = (typeof TREE_SEASONS)[number];

export const TREE_PALETTES = ["gold", "lavender", "coral", "sky", "snow"] as const;
export type TreePaletteId = (typeof TREE_PALETTES)[number];

export type TreeColors = {
  sky: string;
  fog: string;
  light: string;
  dark: string;
  lightFlat: string;
  darkFlat: string;
  trunk: string;
  blossom: string;
  grass: string;
  petal: string;
  accent: string;
};

const PALETTE_BASE: Record<
  TreePaletteId,
  Pick<TreeColors, "sky" | "fog" | "light" | "dark" | "lightFlat" | "darkFlat" | "trunk" | "accent">
> = {
  gold: {
    sky: "#1a1410",
    fog: "#1a1410",
    light: "#f7f1e6",
    dark: "#2a1a0c",
    lightFlat: "#ffffff",
    darkFlat: "#050505",
    trunk: "#5c4030",
    accent: "#cd9d65",
  },
  lavender: {
    sky: "#16121c",
    fog: "#16121c",
    light: "#f4eef8",
    dark: "#241428",
    lightFlat: "#ffffff",
    darkFlat: "#050505",
    trunk: "#4a3a52",
    accent: "#c4a0d8",
  },
  coral: {
    sky: "#1c1210",
    fog: "#1c1210",
    light: "#f8eee8",
    dark: "#3a1814",
    lightFlat: "#ffffff",
    darkFlat: "#050505",
    trunk: "#6a3c32",
    accent: "#e08a72",
  },
  sky: {
    sky: "#101820",
    fog: "#101820",
    light: "#eef4f8",
    dark: "#102430",
    lightFlat: "#ffffff",
    darkFlat: "#050505",
    trunk: "#3a4a52",
    accent: "#7eb8d4",
  },
  snow: {
    sky: "#141618",
    fog: "#141618",
    light: "#f7f7f4",
    dark: "#1c1e20",
    lightFlat: "#ffffff",
    darkFlat: "#050505",
    trunk: "#5a5854",
    accent: "#d8d2c8",
  },
};

const SEASON_FLORA: Record<
  TreeSeason,
  Pick<TreeColors, "blossom" | "grass" | "petal">
> = {
  spring: { blossom: "#f4b6c8", grass: "#7d9b5a", petal: "#ffd6e3" },
  summer: { blossom: "#7cb87c", grass: "#4f7a3c", petal: "#c5e8b0" },
  autumn: { blossom: "#e0a84a", grass: "#8a6a32", petal: "#f0c878" },
};

export function resolveTreeColors(
  season: TreeSeason,
  palette: TreePaletteId,
): TreeColors {
  return { ...PALETTE_BASE[palette], ...SEASON_FLORA[season] };
}

export const treeCopy = {
  title: "Forest",
  kicker: "A living forest — each link grows its own ecosystem",
  placeholder: "Paste a URL to plant in the forest",
  generate: "Plant forest",
  planting: "Growing…",
  scanView: "Scan view",
  groveView: "Forest view",
  copy: "Copy short link",
  copied: "Copied",
  hint: "Click the forest to flatten the canopy and reveal the QR code",
  emptyHint:
    "Every URL sprouts a unique forest — cherry, pine, willow, oak, and more. The soil is the QR.",
  fallbackTitle: "This forest prefers a simpler drawing",
  privacy:
    "The forest is a QR. Short links are stored so scans can redirect — original URLs are not shown on shared scenes.",
  back: "Back to Hoahwa",
};

export const DEFAULT_TREE_PAYLOAD = "https://hoahwa.com";
export const DEFAULT_TREE_SEASON: TreeSeason = "spring";
export const DEFAULT_TREE_PALETTE: TreePaletteId = "gold";
