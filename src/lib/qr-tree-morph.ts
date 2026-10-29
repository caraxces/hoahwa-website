import type { TreePaletteId, TreeSeason } from "@/content/tree";
import { encodeQrMatrix, growthFromHits, hashSeed, isFinderCell, QR_QUIET_ZONE } from "./qr-tree";

export type Point3 = { x: number; y: number; z: number };
export type MorphRole = "stone" | "wood" | "blossom" | "grass";
export type MorphCell = {
  id: number; row: number; col: number; dark: boolean; finder: boolean;
  flat: Point3; grown: Point3; role: MorphRole; size: number;
  delay: number; arc: number; spin: number; shade: number;
  direction?: Point3; length?: number;
};
export type TreeMorph = { payload: string; size: number; world: number; height: number; cells: MorphCell[] };
type Part = { centre: Point3; radius: Point3; end?: Point3; role: "wood" | "blossom" };
type TreeVoxel = { position: Point3; role: "wood" | "blossom"; direction?: Point3; length?: number; width?: number };

const point = (x: number, y: number, z: number): Point3 => ({ x, y, z });
const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
export const smoothMorph = (t: number) => { const p = clamp(t, 0, 1); return p * p * (3 - 2 * p); };
export const hashUnit = (seed: number, index: number) => ((Math.imul(seed ^ Math.imul(index + 1, 374761393), 668265263) >>> 0) % 100000) / 100000;

function partsForTree(seed: number): Part[] {
  const parts: Part[] = [];
  const branch = (a: Point3, b: Point3, r: number) => parts.push({ centre: a, end: b, radius: point(r, r, r), role: "wood" });
  const bloom = (p: Point3, r = 1) => parts.push({ centre: p, radius: point(0.25 * r, 0.16 * r, 0.23 * r), role: "blossom" });
  branch(point(0, 0, 0), point(-0.08, 0.65, 0.015), 0.085);
  branch(point(-0.08, 0.65, 0.015), point(0.04, 1.28, -0.04), 0.065);
  branch(point(0.04, 1.28, -0.04), point(-0.04, 1.94, 0), 0.042);
  // Long, tiered limbs with separate sprays at their tips leave daylight through the crown.
  for (let i = 0; i < 7; i++) {
    const a = i * Math.PI * 2 / 7 + 0.2 + hashUnit(seed, i + 40) * 0.16;
    const reach = 1.08 + hashUnit(seed, i) * 0.19;
    const level = 1.03 + i % 3 * 0.28;
    const fork = point(Math.cos(a) * reach * 0.56, level - 0.12, Math.sin(a) * reach * 0.5);
    branch(point(-0.025, 0.57 + i % 3 * 0.27, 0), fork, 0.045);
    for (let j = 0; j < 3; j++) {
      const angle = a + (j - 1) * 0.3;
      const radius = reach * (j === 1 ? 1.1 : 0.95);
      const tip = point(Math.cos(angle) * radius, level + (j === 1 ? 0.2 : -0.02) + hashUnit(seed, i * 3 + j + 60) * 0.12, Math.sin(angle) * radius * 0.87);
      branch(fork, tip, 0.027);
      bloom(point(tip.x, tip.y + 0.07, tip.z), 0.88 + hashUnit(seed, i * 3 + j + 90) * 0.25);
    }
  }
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + 0.4;
    const tip = point(Math.cos(a) * 0.5, 1.97 + i % 2 * 0.2, Math.sin(a) * 0.45);
    branch(point(0.015, 1.43 + i % 2 * 0.2, 0), tip, 0.026);
    bloom(point(tip.x, tip.y + 0.06, tip.z), 0.85);
  }
  return parts;
}

function contains(p: Point3, part: Part, step: number) {
  const a = part.centre;
  if (!part.end) return ((p.x - a.x) / part.radius.x) ** 2 + ((p.y - a.y) / part.radius.y) ** 2 + ((p.z - a.z) / part.radius.z) ** 2 <= 1;
  const b = part.end;
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
  const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy + (p.z - a.z) * dz) / (dx * dx + dy * dy + dz * dz), 0, 1);
  return (p.x - a.x - t * dx) ** 2 + (p.y - a.y - t * dy) ** 2 + (p.z - a.z - t * dz) ** 2 <= Math.max(part.radius.x, step * 0.62) ** 2;
}

/** Sample the surface of a branching sakura sculpt, rather than a random point cloud. */
function voxelize(parts: Part[], step: number) {
  const bounds = parts.map(part => {
    const r = part.end ? point(Math.max(part.radius.x, step * 0.62), Math.max(part.radius.y, step * 0.62), Math.max(part.radius.z, step * 0.62)) : part.radius;
    const b = part.end ?? part.centre, a = part.centre;
    return { min: point(Math.min(a.x, b.x) - r.x, Math.min(a.y, b.y) - r.y, Math.min(a.z, b.z) - r.z), max: point(Math.max(a.x, b.x) + r.x, Math.max(a.y, b.y) + r.y, Math.max(a.z, b.z) + r.z) };
  });
  const extent = Math.ceil(Math.max(...bounds.flatMap(b => [Math.abs(b.min.x), Math.abs(b.max.x), Math.abs(b.min.z), Math.abs(b.max.z)])) / step) + 1;
  const height = Math.ceil(Math.max(...bounds.map(b => b.max.y)) / step) + 1, width = extent * 2 + 1;
  const solid = new Int8Array(width * width * height);
  const index = (x: number, y: number, z: number) => (y * width + z + extent) * width + x + extent;
  // Sample only each limb/spray's local bounds; a wider crown should not cost a dense 3D search.
  parts.forEach((part, i) => {
    const { min, max } = bounds[i];
    for (let y = Math.max(0, Math.floor(min.y / step)); y <= Math.min(height - 1, Math.ceil(max.y / step)); y++)
      for (let z = Math.floor(min.z / step); z <= Math.ceil(max.z / step); z++)
        for (let x = Math.floor(min.x / step); x <= Math.ceil(max.x / step); x++) {
          const p = point(x * step, (y + 0.5) * step, z * step);
          if (contains(p, part, step)) solid[index(x, y, z)] = part.role === "wood" ? 1 : 2;
        }
  });
  const voxels: TreeVoxel[] = [];
  for (let y = 0; y < height; y++) for (let z = -extent + 1; z < extent; z++) for (let x = -extent + 1; x < extent; x++) {
    const k = index(x, y, z), kind = solid[k];
    if (kind !== 2) continue;
    const buried = y > 0 && y < height - 1 && solid[k - 1] && solid[k + 1] && solid[k - width] && solid[k + width] && solid[k - width * width] && solid[k + width * width];
    if (!buried) voxels.push({ position: point(x * step, (y + 0.5) * step, z * step), role: "blossom" });
  }
  // Each wood cube becomes a slim, oriented section of a continuous limb.
  for (const part of parts) {
    if (!part.end) continue;
    const a = part.centre, b = part.end, direction = point(b.x - a.x, b.y - a.y, b.z - a.z);
    const length = Math.hypot(direction.x, direction.y, direction.z), count = Math.ceil(length / (step * 1.2));
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      voxels.push({ position: point(a.x + direction.x * t, a.y + direction.y * t, a.z + direction.z * t), role: "wood", direction, length: length / count * 1.06, width: part.radius.x * 2 * (1 - t * 0.15) });
    }
  }
  return voxels;
}

export function buildTreeMorph(payload: string, hits: number, preview = false): TreeMorph {
  const modules = encodeQrMatrix(payload), size = modules.length, world = size + QR_QUIET_ZONE * 2;
  const seed = hashSeed(payload), centre = (size - 1) / 2;
  const cells: MorphCell[] = [];
  for (let row = -QR_QUIET_ZONE; row < size + QR_QUIET_ZONE; row++) for (let col = -QR_QUIET_ZONE; col < size + QR_QUIET_ZONE; col++) {
    const inside = row >= 0 && col >= 0 && row < size && col < size;
    const flat = point(col - centre, 0, row - centre);
    cells.push({ id: cells.length, row, col, dark: inside && modules[row][col], finder: inside && isFinderCell(col, row, size), flat, grown: { ...flat }, role: "stone", size: 1, delay: 0, arc: 0, spin: 0, shade: hashUnit(seed, cells.length) });
  }
  const lights = cells.filter(c => !c.dark && c.row >= 0 && c.col >= 0 && c.row < size && c.col < size);
  const radial = (c: MorphCell) => Math.hypot(c.flat.x, c.flat.z);
  lights.sort((a, b) => radial(a) - radial(b) || a.id - b.id);
  const risers = cells.filter(c => c.dark).concat(lights.slice(0, Math.floor(lights.length * 0.45)));
  risers.sort((a, b) => radial(a) - radial(b) || a.id - b.id);
  const budget = Math.floor(risers.length * 0.93), parts = partsForTree(seed);
  let low = 0.06, high = 0.24, step = high, model = voxelize(parts, high);
  for (let i = 0; i < 9; i++) {
    const candidate = (low + high) / 2, voxels = voxelize(parts, candidate);
    if (voxels.length <= budget) { high = candidate; step = candidate; model = voxels; } else low = candidate;
  }
  // Keep adjacent branch blocks intact; assign central QR modules to the trunk first.
  model.sort((a, b) => (a.role === "wood" ? 0 : 1) - (b.role === "wood" ? 0 : 1) || Math.hypot(a.position.x, a.position.z) - Math.hypot(b.position.x, b.position.z));
  const growth = preview ? 1 : growthFromHits(hits);
  const scale = size * (0.23 + growth * 0.14);
  for (let i = 0; i < risers.length; i++) {
    const cell = risers[i], voxel = model[i];
    cell.delay = radial(cell) / (size * 0.72) * 0.32;
    cell.arc = size * (0.06 + hashUnit(seed, i + 100) * 0.075);
    cell.spin = (hashUnit(seed, i + 200) - 0.5) * Math.PI * 2;
    if (voxel) {
      cell.grown = point(voxel.position.x * scale, voxel.position.y * scale - 0.47, voxel.position.z * scale);
      cell.role = voxel.role;
      cell.size = (voxel.width ?? step * 0.64) * scale;
      if (voxel.direction && voxel.length) { cell.direction = voxel.direction; cell.length = voxel.length * scale; }
    } else {
      const edge = i % 4, along = (hashUnit(seed, i + 300) - 0.5) * (size - 1), rim = size / 2 + 1.1;
      cell.size = 0.42 + hashUnit(seed, i + 500) * 0.25;
      cell.grown = point(edge < 2 ? along : (edge === 2 ? -rim : rim), 0.4825 + cell.size / 2, edge >= 2 ? along : (edge === 0 ? -rim : rim));
      cell.role = "grass";
    }
  }
  return { payload, size, world, height: Math.max(...cells.map(c => c.grown.y + c.size / 2)), cells };
}

/** Reversible absolute-time interpolation: interruption never accumulates positional error. */
export function sampleMorphCell(cell: MorphCell, progress: number) {
  const t = smoothMorph((progress - cell.delay) / (1 - cell.delay));
  return { x: cell.flat.x + (cell.grown.x - cell.flat.x) * t,
    y: cell.grown.y * t + Math.sin(t * Math.PI) * cell.arc,
    z: cell.flat.z + (cell.grown.z - cell.flat.z) * t,
    size: 1 + (cell.size - 1) * t, tumble: Math.sin(t * Math.PI) * cell.spin, blend: t };
}

const BLOSSOMS: Record<TreePaletteId, string[]> = {
  gold: ["#f5adc9", "#ffd9e8", "#ec90b8", "#f9c4d9"],
  lavender: ["#c5a0df", "#e4ccf2", "#b388cc", "#d1afe4"],
  coral: ["#f0a296", "#ffd4bf", "#e88e92", "#f7bdb0"],
  sky: ["#99c4dc", "#c8e7ef", "#87b2d4", "#b3d6e8"],
  snow: ["#e7d8df", "#fff1f3", "#cdbecb", "#eee0e4"],
};
const FLAT: Record<TreePaletteId, string[]> = {
  gold: ["#973c64", "#a64c73"], lavender: ["#67448b", "#785294"],
  coral: ["#9a473e", "#ab554b"], sky: ["#315d79", "#426d88"], snow: ["#65566b", "#756479"],
};
export function morphColors(cell: MorphCell, size: number, season: TreeSeason, palette: TreePaletteId) {
  const shade = Math.min(3, Math.floor(cell.shade * 4));
  const flora = season === "summer" ? ["#77a556", "#a4c678", "#568744", "#8ab360"] : season === "autumn" ? ["#d99547", "#f1bf68", "#c97741", "#e6ab51"] : BLOSSOMS[palette];
  const inQuiet = cell.row < 0 || cell.col < 0 || cell.row >= size || cell.col >= size;
  const leaf = cell.finder || Math.hypot(cell.flat.x, cell.flat.z) > size * 0.56;
  const dark = leaf || season === "summer" ? ["#466837", "#537642"][shade % 2] : season === "autumn" ? ["#8b4f27", "#9b602f"][shade % 2] : FLAT[palette][shade % 2];
  const flat = cell.dark ? dark : inQuiet ? "#fcf8f0" : ["#faf3e8", "#f3eadd", "#fbf4eb", "#f6eee3"][shade];
  const grown = cell.role === "wood" ? ["#754d3e", "#90634b", "#634237", "#ad7960"][shade] : cell.role === "blossom" ? flora[shade] : cell.role === "grass" ? ["#729356", "#93b172", "#607f44", "#aec689"][shade] : flat;
  return { flat, grown };
}
