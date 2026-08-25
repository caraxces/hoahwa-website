import QRCode from "qrcode";
import type { TreePaletteId, TreeSeason } from "@/content/tree";

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
};

const QUIET_ZONE = 3;

function mulberry32(seed: number): () => number {
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

function rotateY(
  dir: Vec3,
  angle: number,
): Vec3 {
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

function growTree(
  seed: number,
  world: number,
): { branches: QrBranch[]; blossoms: QrBlossom[] } {
  const rng = mulberry32(seed);
  const cx = world / 2;
  const cz = world / 2;
  const height = world * 0.52;
  const branches: QrBranch[] = [];
  const blossoms: QrBlossom[] = [];

  const fork = (
    origin: Vec3,
    dir: Vec3,
    radius: number,
    depth: number,
  ) => {
    if (depth <= 0 || radius < 0.035) {
      blossoms.push({
        position: origin,
        size: 0.1 + rng() * 0.08,
      });
      return;
    }
    const length = (0.28 + rng() * 0.34) * height * (depth / 5);
    const end: Vec3 = {
      x: origin.x + dir.x * length,
      y: origin.y + dir.y * length,
      z: origin.z + dir.z * length,
    };
    branches.push({ start: origin, end, radius });
    const count = depth > 3 ? 3 : 2;
    for (let i = 0; i < count; i += 1) {
      const yaw = (rng() - 0.5) * 1.35;
      const pitch = (rng() - 0.35) * 0.7;
      const next = normalize(rotatePitch(rotateY(dir, yaw), pitch));
      fork(end, next, radius * (0.58 + rng() * 0.12), depth - 1);
    }
    if (rng() > 0.55) {
      blossoms.push({
        position: end,
        size: 0.08 + rng() * 0.07,
      });
    }
  };

  const trunkTop: Vec3 = { x: cx, y: height * 0.28, z: cz };
  branches.push({
    start: { x: cx, y: 0, z: cz },
    end: trunkTop,
    radius: 0.22 + rng() * 0.06,
  });
  fork(trunkTop, { x: 0, y: 1, z: 0 }, 0.16, 4);

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
      const dark = inside ? modules[mz][mx] : false;
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
      if (modules[nz][nx]) {
        edge = true;
        break;
      }
    }
    if (edge && rng() > 0.28) {
      grass.push({
        x: voxel.x + (rng() - 0.5) * 0.35,
        z: voxel.z + (rng() - 0.5) * 0.35,
        h: 0.18 + rng() * 0.22,
        phase: rng() * Math.PI * 2,
      });
    }
  }

  const { branches, blossoms } = growTree(hashSeed(payload), world);
  const petals: QrPetal[] = blossoms.slice(0, 48).map((b, i) => ({
    origin: b.position,
    speed: 0.12 + (i % 7) * 0.03,
    phase: i * 0.47,
    drift: 0.35 + (i % 5) * 0.08,
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
