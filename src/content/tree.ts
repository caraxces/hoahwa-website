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
  title: "Tree QR",
  kicker: "A living grove that hides a scannable code",
  placeholder: "Paste a URL to plant",
  generate: "Plant",
  planting: "Rooting…",
  /** Label shown while the grove stands — pressing it folds the tree back down into the code. */
  scanView: "Fold it back into a QR",
  /** Label shown while the code lies flat — pressing it stacks the grove back up. */
  groveView: "Hatch the tree",
  copy: "Copy short link",
  copied: "Copied",
  hint: "Drag to spin the grove · Tap it to fold the tree back into a scannable QR",
  emptyHint: "Every link grows a unique tree. The soil is the QR.",
  fallbackTitle: "This grove prefers a simpler drawing",
  privacy:
    "The grove is a QR. Short links are stored so scans can redirect — original URLs are not shown on shared scenes.",
  back: "Back to Hoahwa",
};

export const DEFAULT_TREE_PAYLOAD = "https://hoahwa.com";
export const DEFAULT_TREE_SEASON: TreeSeason = "spring";
export const DEFAULT_TREE_PALETTE: TreePaletteId = "gold";

export const TREE_CATEGORIES = [
  { id: "general", label: "General" },
  { id: "brand", label: "Brand" },
  { id: "shop", label: "Shop" },
  { id: "event", label: "Event" },
  { id: "music", label: "Music" },
  { id: "food", label: "Food & drink" },
  { id: "travel", label: "Travel" },
  { id: "education", label: "Education" },
  { id: "creator", label: "Creator" },
  { id: "personal", label: "Personal" },
] as const;
export type TreeCategoryId = (typeof TREE_CATEGORIES)[number]["id"];
export const DEFAULT_TREE_CATEGORY: TreeCategoryId = "general";
export function isCategory(value: string | null | undefined): value is TreeCategoryId {
  return TREE_CATEGORIES.some((c) => c.id === value);
}
export function categoryLabel(id: string): string {
  return TREE_CATEGORIES.find((c) => c.id === id)?.label ?? "General";
}

/** Growth stages by human clicks. Mirrors SHORT_LINKS_STAGES in the PHP API. */
export const TREE_STAGES = [
  { id: "seed", label: "Seed", min: 0 },
  { id: "sprout", label: "Sprout", min: 5 },
  { id: "sapling", label: "Sapling", min: 25 },
  { id: "young", label: "Young tree", min: 100 },
  { id: "mature", label: "Mature tree", min: 500 },
  { id: "ancient", label: "Ancient tree", min: 2000 },
] as const;
export function stageForHits(hits: number) {
  let index = 0;
  TREE_STAGES.forEach((s, i) => {
    if (hits >= s.min) index = i;
  });
  const stage = TREE_STAGES[index];
  const next = TREE_STAGES[index + 1];
  return { ...stage, index, next: next?.min ?? null, nextLabel: next?.label ?? null };
}

/** Crawlable page copy for /tree and /tree/market (static HTML shell). */
export const treePageSeo = {
  h1: "HoaHwa Links",
  intro:
    "HoaHwa Links is a short-link tool from Hoahwa: paste any http or https URL and plant a link at the root of hoahwa.com, either with your own code or an auto-generated one. Every tap and scan is counted on the server before the visitor is redirected, so you can see growth over time without exposing the original destination on shared scenes. Each link also gets a living QR grove on this page—the same modules can stay flat for scanning or unfold into a cherry tree you can spin, recolor by season, and fold back into code for print. Share /tree/?c=your-code so others see the same scene while clicks keep adding branches through seed, sprout, sapling, young, mature, and ancient stages. When you want the wider grove, open the tree market to browse every planted link ranked by clicks and filtered by category. Hoahwa publishes case studies on eCommerce design and development when you want the studio story behind the product.",
  metaDescription:
    "Plant root-level hoahwa.com short links with click tracking and a QR that grows into a cherry tree. Browse the tree market or read Hoahwa case studies.",
};

export const marketPageSeo = {
  h1: "Tree market",
  intro:
    "The tree market is the public grove for HoaHwa Links: every short link planted from the workshop appears here as its own tree, with height and canopy reflecting real clicks over time. Browse all links or filter by category such as brand, shop, music, travel, and creator to see which codes are seedling-sized and which have grown into mature or ancient trees. Sort by most clicked or newest, select a tree in the forest to inspect its visit count and scannable QR, then open the same living scene on /tree/?c=code. Links stay at hoahwa.com/your-code with server-side click tracking before redirect. Plant a new link from the workshop when you are ready to add another tree to the island. For Hoahwa agency work beyond Links, read our case studies on Shopify storefronts, programmatic SEO, and interactive landing pages.",
  metaTitle: "Tree market · HoaHwa Links",
  metaDescription:
    "Browse every HoaHwa short link as a tree in the public market. Filter by category, sort by clicks or recency, preview each QR grove, and jump to /tree/?c=code.",
};

export const linksCopy = {
  brand: "HoaHwa Links",
  tagline: "Short links that grow into trees.",
  pitch:
    "Paste any URL and get hoahwa.com/your-code with a scannable QR grove. Every click adds branches and blossoms; the busiest links become ancient trees in the market.",
  titlePlaceholder: "Title (optional) — what is this link?",
  aliasPlaceholder: "custom-code",
  aliasPrefix: "hoahwa.com/",
  category: "Category",
  market: "Tree market",
  marketKicker: "Every planted link, ranked by clicks. Pick a category to browse its grove.",
  clicks: "clicks",
  stage: "Growth",
  nextStage: (n: number, label: string) => `${n} more to ${label.toLowerCase()}`,
  topStage: "Fully grown",
  last14: "Last 14 days",
  referrers: "Where clicks come from",
  devices: "Devices",
  direct: "direct",
  live: "Live — the tree grows as people click",
  openTree: "Open tree",
  sortHits: "Most clicked",
  sortNew: "Newest",
  empty: "No trees here yet. Plant the first one.",
  totals: (links: number, hits: number) => `${links.toLocaleString("en-US")} trees · ${hits.toLocaleString("en-US")} clicks`,
};


/** Leaf palettes for the hero tree on /tree — several shades per season so the canopy reads as foliage. */
export const SEASON_LEAVES: Record<TreeSeason, string[]> = {
  spring: ["#f9c5d8", "#ffd7e6", "#f4aec8", "#ffe3ee", "#f9c5d8", "#f4aec8", "#dfeccd", "#ffd7e6"],
  summer: ["#4f9b3f", "#5aa746", "#68b44f", "#74be58", "#4a9439", "#5aa746", "#7fc75f", "#43893a"],
  autumn: ["#dd9a36", "#e8a83f", "#d97c31", "#c9572c", "#e8b04a", "#d98f33", "#f0c14a", "#b9622c"],
};

/** Daylight ground and sky for the garden, tinted by the chosen palette. */
export const PALETTE_DAY: Record<TreePaletteId, { sky: string; stone: string; stoneDark: string; accent: string }> = {
  gold: { sky: "#f4ece0", stone: "#e9e3d6", stoneDark: "#d2c9b8", accent: "#cd9d65" },
  lavender: { sky: "#f1edf5", stone: "#e7e3ee", stoneDark: "#cfc8dd", accent: "#a985c9" },
  coral: { sky: "#f7ece7", stone: "#efe1da", stoneDark: "#dcc4b9", accent: "#e08a72" },
  sky: { sky: "#e9f1f5", stone: "#e0e9ee", stoneDark: "#c6d5dd", accent: "#5fa3c4" },
  snow: { sky: "#f4f4f2", stone: "#ebebe8", stoneDark: "#d4d4cf", accent: "#9aa0a0" },
};
