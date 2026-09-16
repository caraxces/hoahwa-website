import QRCode from "qrcode";
import type { TreePaletteId, TreeSeason } from "@/content/tree";
import {
  type FoliageShape,
  type ForestSlot,
  type TreeSpeciesRules,
  hashSeed,
  mulberry32,
  planForestSlots,
} from "@/lib/forest-rules";

export type Vec3 = { x: number; y: number; z: number };

export type QrVoxel = {
  x: number;
  z: number;
  dark: boolean;
  finder: boolean;
};

export type QrBranch = {
  start: Vec3;
  end: Vec3;
  radius: number;
};

export type QrBlossom = {
  position: Vec3;
  size: number;
  shape: FoliageShape;
};

export type QrGrass = {
  x: number;
  z: number;
  h: number;
  phase: number;
};

export type QrPetal = {
  origin: Vec3;
  speed: number;
  phase: number;
  drift: number;
};

export type QrTreeLayout = {
  payload: string;
  size: number;
  quiet: number;
  world: number;
  voxels: QrVoxel[];
  branches: QrBranch[];
  blossoms: QrBlossom[];
  grass: QrGrass[];
  petals: QrPetal[];
  forest: ForestSlot[];
};

const QUIET_ZONE = 3;

export { hashSeed };

export function isFinderCell(x: number, y: number, size: number): boolean {
  const inFinder = (ox: number, oy: number) =>
    x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  return inFinder(0, 0) || inFinder(size - 7, 0) || inFinder(0, size - 7);
}

export function encodeQrMatrix(text: string): boolean[][] {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const modules: boolean[][] = [];
  for (let y = 0; y < size; y += 1) {
    const row: boolean[] = [];
    for (let x = 0; x < size; x += 1) {
      row.push(Boolean(qr.modules.get(y, x)));
    }
    modules.push(row);
  }
  return modules;
}

function rotateY(dir: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: dir.x * c - dir.z * s,
    y: dir.y,
    z: dir.x * s + dir.z * c,
  };
}

function rotatePitch(dir: Vec3, angle: number): Vec3 {
  const len = Math.hypot(dir.x, dir.z) || 1;
  const yaw = Math.atan2(dir.x, dir.z);
  const pitch = Math.atan2(dir.y, len);
  const nextPitch = pitch + angle;
  const xz = Math.cos(nextPitch);
  return {
    x: Math.sin(yaw) * xz,
    y: Math.sin(nextPitch),
    z: Math.cos(yaw) * xz,
  };
}

function normalize(v: Vec3): Vec3 {
  const len = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function growSpeciesTree(
  slot: ForestSlot,
  world: number,
): { branches: QrBranch[]; blossoms: QrBlossom[] } {
  const rng = mulberry32(slot.seed);
  const rules = slot.species;
  const height = world * rules.heightMul * slot.scale;
  const branches: QrBranch[] = [];
  const blossoms: QrBlossom[] = [];
  const leanX = (rng() - 0.5) * rules.lean;
  const leanZ = (rng() - 0.5) * rules.lean;

  const addBlossom = (position: Vec3, mul = 1) => {
    if (rng() > rules.blossomDensity) return;
    blossoms.push({
      position,
      size: (rules.blossomSize + rng() * rules.blossomSize * 0.45) * slot.scale * mul,
      shape: rules.foliageShape,
    });
  };

  const fork = (
    origin: Vec3,
    dir: Vec3,
    radius: number,
    depth: number,
  ) => {
    if (depth <= 0 || radius < 0.025 * slot.scale) {
      addBlossom(origin);
      return;
    }
    const length =
      (rules.lengthMul + rng() * rules.lengthMul * 0.6) *
      height *
      (depth / (rules.branchDepth + 1));
    const end: Vec3 = {
      x: origin.x + dir.x * length,
      y: origin.y + dir.y * length,
      z: origin.z + dir.z * length,
    };
    branches.push({ start: origin, end, radius });
    const count =
      depth > rules.branchDepth - 1
        ? rules.forksMax
        : rules.forksMin + Math.floor(rng() * (rules.forksMax - rules.forksMin + 1));
    for (let i = 0; i < count; i += 1) {
      const yaw = (rng() - 0.5) * rules.yawSpread;
      let pitch = (rng() - 0.5) * (rules.pitchUp + rules.pitchDown);
      if (rules.droop > 0) {
        pitch -= rng() * rules.droop;
      } else if (rng() > 0.45) {
        pitch += rules.pitchUp * 0.35;
      }
      const next = normalize(rotatePitch(rotateY(dir, yaw), pitch));
      fork(
        end,
        next,
        radius * (rules.radiusDecay + rng() * 0.1),
        depth - 1,
      );
    }
    if (rng() > 0.4) addBlossom(end, 0.85);
  };

  const trunkCount = rules.multiTrunk;
  for (let t = 0; t < trunkCount; t += 1) {
    const spread = trunkCount > 1 ? (t - (trunkCount - 1) / 2) * 0.14 * slot.scale : 0;
    const base: Vec3 = {
      x: slot.x + spread + leanX * height,
      y: 0,
      z: slot.z + spread * 0.6 + leanZ * height,
    };
    const trunkTop: Vec3 = {
      x: base.x,
      y: height * (rules.id === "baobab" ? 0.22 : 0.28 + rng() * 0.08),
      z: base.z,
    };
    branches.push({
      start: base,
      end: trunkTop,
      radius: (rules.trunkRadius + rng() * 0.04) * slot.scale,
    });
    const startDir =
      rules.id === "willow"
        ? normalize({ x: leanX * 0.2, y: 0.85, z: leanZ * 0.2 })
        : rules.id === "pine" || rules.id === "bamboo"
          ? { x: leanX * 0.15, y: 1, z: leanZ * 0.15 }
          : { x: leanX * 0.25, y: 1, z: leanZ * 0.25 };
    fork(
      trunkTop,
      normalize(startDir),
      rules.trunkRadius * 0.72 * slot.scale,
      rules.branchDepth,
    );
  }

  if (rules.id === "baobab" && blossoms.length < 3) {
    addBlossom(
      {
        x: slot.x,
        y: height * 0.34,
        z: slot.z,
      },
      1.4,
    );
  }

  return { branches, blossoms };
}

function growForest(
  slots: ForestSlot[],
  world: number,
): { branches: QrBranch[]; blossoms: QrBlossom[] } {
  const branches: QrBranch[] = [];
  const blossoms: QrBlossom[] = [];
  for (const slot of slots) {
    const tree = growSpeciesTree(slot, world);
    branches.push(...tree.branches);
    blossoms.push(...tree.blossoms);
  }
  return { branches, blossoms };
}

export function buildQrTreeLayout(payload: string): QrTreeLayout {
  const modules = encodeQrMatrix(payload);
  const size = modules.length;
  const quiet = QUIET_ZONE;
  const world = size + quiet * 2;
  const voxels: QrVoxel[] = [];
  const grass: QrGrass[] = [];
  const rng = mulberry32(hashSeed(payload) ^ 0x9e3779b9);

  for (let z = 0; z < world; z += 1) {
    for (let x = 0; x < world; x += 1) {
      const mx = x - quiet;
      const mz = z - quiet;
      const inside = mx >= 0 && mz >= 0 && mx < size && mz < size;
      const dark = inside ? modules[mz]![mx]! : false;
      const finder = inside ? isFinderCell(mx, mz, size) : false;
      voxels.push({ x, z, dark, finder });
    }
  }

  for (const voxel of voxels) {
    if (voxel.dark) continue;
    const mx = voxel.x - quiet;
    const mz = voxel.z - quiet;
    const inside = mx >= 0 && mz >= 0 && mx < size && mz < size;
    if (!inside) continue;
    let edge = false;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const nx = mx + dx;
      const nz = mz + dz;
      if (nx < 0 || nz < 0 || nx >= size || nz >= size) continue;
      if (modules[nz]![nx]) {
        edge = true;
        break;
      }
    }
    if (edge && rng() > 0.22) {
      grass.push({
        x: voxel.x + (rng() - 0.5) * 0.35,
        z: voxel.z + (rng() - 0.5) * 0.35,
        h: 0.16 + rng() * 0.24,
        phase: rng() * Math.PI * 2,
      });
    }
  }

  const forest = planForestSlots(payload, world, quiet, modules);
  const { branches, blossoms } = growForest(forest, world);
  const petals: QrPetal[] = blossoms.slice(0, 72).map((b, i) => ({
    origin: b.position,
    speed: 0.1 + (i % 9) * 0.025,
    phase: i * 0.41,
    drift: 0.3 + (i % 6) * 0.07,
  }));

  return {
    payload,
    size,
    quiet,
    world,
    voxels,
    branches,
    blossoms,
    grass,
    petals,
    forest,
  };
}

export function isSeason(value: string | null): value is TreeSeason {
  return value === "spring" || value === "summer" || value === "autumn";
}

export function isPalette(value: string | null): value is TreePaletteId {
  return (
    value === "gold" ||
    value === "lavender" ||
    value === "coral" ||
    value === "sky" ||
    value === "snow"
  );
}

export function normalizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export type { TreeSpeciesRules, ForestSlot, FoliageShape };
