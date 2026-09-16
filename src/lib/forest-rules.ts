export type FoliageShape = "sphere" | "cone" | "disc" | "cluster";

export type TreeSpeciesId =
  | "cherry"
  | "pine"
  | "willow"
  | "oak"
  | "bamboo"
  | "baobab"
  | "maple"
  | "birch";

export type TreeSpeciesRules = {
  id: TreeSpeciesId;
  label: string;
  heightMul: number;
  trunkRadius: number;
  branchDepth: number;
  forksMin: number;
  forksMax: number;
  yawSpread: number;
  pitchUp: number;
  pitchDown: number;
  droop: number;
  radiusDecay: number;
  lengthMul: number;
  blossomSize: number;
  blossomDensity: number;
  foliageShape: FoliageShape;
  multiTrunk: number;
  lean: number;
};

export type ForestSlot = {
  x: number;
  z: number;
  scale: number;
  seed: number;
  species: TreeSpeciesRules;
  signature: boolean;
};

export const TREE_SPECIES: TreeSpeciesRules[] = [
  {
    id: "cherry",
    label: "Cherry",
    heightMul: 0.48,
    trunkRadius: 0.14,
    branchDepth: 4,
    forksMin: 2,
    forksMax: 3,
    yawSpread: 1.5,
    pitchUp: 0.55,
    pitchDown: 0.35,
    droop: 0,
    radiusDecay: 0.62,
    lengthMul: 0.32,
    blossomSize: 0.14,
    blossomDensity: 1.1,
    foliageShape: "disc",
    multiTrunk: 1,
    lean: 0.08,
  },
  {
    id: "pine",
    label: "Pine",
    heightMul: 0.62,
    trunkRadius: 0.12,
    branchDepth: 5,
    forksMin: 2,
    forksMax: 2,
    yawSpread: 0.55,
    pitchUp: 0.85,
    pitchDown: 0.15,
    droop: 0,
    radiusDecay: 0.72,
    lengthMul: 0.28,
    blossomSize: 0.18,
    blossomDensity: 0.85,
    foliageShape: "cone",
    multiTrunk: 1,
    lean: 0.04,
  },
  {
    id: "willow",
    label: "Willow",
    heightMul: 0.44,
    trunkRadius: 0.13,
    branchDepth: 4,
    forksMin: 2,
    forksMax: 4,
    yawSpread: 1.2,
    pitchUp: 0.25,
    pitchDown: 0.95,
    droop: 0.75,
    radiusDecay: 0.55,
    lengthMul: 0.38,
    blossomSize: 0.1,
    blossomDensity: 1.25,
    foliageShape: "cluster",
    multiTrunk: 1,
    lean: 0.12,
  },
  {
    id: "oak",
    label: "Oak",
    heightMul: 0.42,
    trunkRadius: 0.22,
    branchDepth: 3,
    forksMin: 2,
    forksMax: 3,
    yawSpread: 1.65,
    pitchUp: 0.45,
    pitchDown: 0.25,
    droop: 0.05,
    radiusDecay: 0.58,
    lengthMul: 0.36,
    blossomSize: 0.22,
    blossomDensity: 0.75,
    foliageShape: "sphere",
    multiTrunk: 1,
    lean: 0.06,
  },
  {
    id: "bamboo",
    label: "Bamboo",
    heightMul: 0.58,
    trunkRadius: 0.06,
    branchDepth: 2,
    forksMin: 1,
    forksMax: 2,
    yawSpread: 0.35,
    pitchUp: 0.95,
    pitchDown: 0.05,
    droop: 0,
    radiusDecay: 0.85,
    lengthMul: 0.22,
    blossomSize: 0.08,
    blossomDensity: 1.4,
    foliageShape: "disc",
    multiTrunk: 4,
    lean: 0.02,
  },
  {
    id: "baobab",
    label: "Baobab",
    heightMul: 0.32,
    trunkRadius: 0.28,
    branchDepth: 2,
    forksMin: 2,
    forksMax: 3,
    yawSpread: 1.8,
    pitchUp: 0.2,
    pitchDown: 0.15,
    droop: 0,
    radiusDecay: 0.5,
    lengthMul: 0.2,
    blossomSize: 0.26,
    blossomDensity: 0.65,
    foliageShape: "sphere",
    multiTrunk: 1,
    lean: 0.03,
  },
  {
    id: "maple",
    label: "Maple",
    heightMul: 0.46,
    trunkRadius: 0.15,
    branchDepth: 4,
    forksMin: 2,
    forksMax: 3,
    yawSpread: 1.35,
    pitchUp: 0.5,
    pitchDown: 0.4,
    droop: 0.1,
    radiusDecay: 0.6,
    lengthMul: 0.3,
    blossomSize: 0.16,
    blossomDensity: 1,
    foliageShape: "disc",
    multiTrunk: 1,
    lean: 0.1,
  },
  {
    id: "birch",
    label: "Birch",
    heightMul: 0.54,
    trunkRadius: 0.1,
    branchDepth: 4,
    forksMin: 2,
    forksMax: 3,
    yawSpread: 0.95,
    pitchUp: 0.65,
    pitchDown: 0.3,
    droop: 0.15,
    radiusDecay: 0.68,
    lengthMul: 0.26,
    blossomSize: 0.12,
    blossomDensity: 0.95,
    foliageShape: "cluster",
    multiTrunk: 1,
    lean: 0.14,
  },
];

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickSpecies(seed: number): TreeSpeciesRules {
  const idx = seed % TREE_SPECIES.length;
  return TREE_SPECIES[idx]!;
}

export function mixSeed(base: number, salt: number): number {
  return (Math.imul(base ^ salt, 0x85ebca6b) + 0xc2b2ae35) >>> 0;
}

type PlantCandidate = { x: number; z: number; weight: number };

export function planForestSlots(
  payload: string,
  world: number,
  quiet: number,
  modules: boolean[][],
): ForestSlot[] {
  const baseSeed = hashSeed(payload);
  const rng = mulberry32(baseSeed ^ 0x0f0e5700);
  const size = modules.length;
  const candidates: PlantCandidate[] = [];

  for (let z = 0; z < size; z += 1) {
    for (let x = 0; x < size; x += 1) {
      if (modules[z]![x]) continue;
      const wx = x + quiet + 0.5;
      const wz = z + quiet + 0.5;
      let darkNeighbors = 0;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const nz = z + dz;
        if (nx >= 0 && nz >= 0 && nx < size && nz < size && modules[nz]![nx]) {
          darkNeighbors += 1;
        }
      }
      if (darkNeighbors === 0) continue;
      const distCenter = Math.hypot(wx - world / 2, wz - world / 2);
      const weight = darkNeighbors * 2 + rng() + (distCenter < world * 0.22 ? 0.5 : 0);
      candidates.push({ x: wx, z: wz, weight });
    }
  }

  candidates.sort((a, b) => b.weight - a.weight);

  const moduleBits = size * size;
  const treeCount = Math.min(
    14,
    Math.max(5, 4 + Math.floor(moduleBits / 18) + (payload.length % 4)),
  );

  const primary = pickSpecies(baseSeed);
  const slots: ForestSlot[] = [
    {
      x: world / 2,
      z: world / 2,
      scale: 1,
      seed: baseSeed,
      species: primary,
      signature: true,
    },
  ];

  const used = new Set<string>();
  used.add(`${Math.floor(world / 2)},${Math.floor(world / 2)}`);
  const minDist = world * 0.11;

  for (const candidate of candidates) {
    if (slots.length >= treeCount) break;
    const key = `${Math.floor(candidate.x)},${Math.floor(candidate.z)}`;
    if (used.has(key)) continue;
    let tooClose = false;
    for (const slot of slots) {
      if (Math.hypot(slot.x - candidate.x, slot.z - candidate.z) < minDist) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;
    used.add(key);
    const slotSeed = mixSeed(baseSeed, slots.length * 7919 + Math.floor(candidate.x * 17));
    slots.push({
      x: candidate.x,
      z: candidate.z,
      scale: 0.42 + rng() * 0.38,
      seed: slotSeed,
      species: pickSpecies(slotSeed),
      signature: false,
    });
  }

  while (slots.length < Math.min(treeCount, 7)) {
    const slotSeed = mixSeed(baseSeed, slots.length * 104729);
    const angle = rng() * Math.PI * 2;
    const radius = world * (0.18 + rng() * 0.28);
    slots.push({
      x: world / 2 + Math.cos(angle) * radius,
      z: world / 2 + Math.sin(angle) * radius,
      scale: 0.35 + rng() * 0.3,
      seed: slotSeed,
      species: pickSpecies(slotSeed),
      signature: false,
    });
  }

  return slots;
}
