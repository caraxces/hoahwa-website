import type { TreePaletteId, TreeSeason } from "@/content/tree";
import { encodeQrMatrix, hashSeed, isFinderCell, QR_QUIET_ZONE } from "./qr-tree";
import { hashUnit, morphColors, type MorphCell } from "./qr-tree-morph";

/** The print/fallback image uses the identical matrix and cell colors as the 3D cubes. */
export async function createGardenQrCanvas(payload: string, season: TreeSeason, palette: TreePaletteId, modulePixels = 28): Promise<HTMLCanvasElement> {
  const modules = encodeQrMatrix(payload), size = modules.length, quiet = QR_QUIET_ZONE, world = size + quiet * 2;
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = world * modulePixels;
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas is unavailable");
  const seed = hashSeed(payload); let id = 0;
  for (let row = -quiet; row < size + quiet; row++) for (let col = -quiet; col < size + quiet; col++) {
    const inside = row >= 0 && col >= 0 && row < size && col < size;
    const flat = { x: col - (size - 1) / 2, y: 0, z: row - (size - 1) / 2 };
    const cell: MorphCell = { id, row, col, flat, grown: flat, dark: inside && modules[row][col], finder: inside && isFinderCell(col, row, size), role: "stone", size: 1, delay: 0, arc: 0, spin: 0, shade: hashUnit(seed, id) };
    ctx.fillStyle = morphColors(cell, size, season, palette).flat;
    ctx.fillRect((col + quiet) * modulePixels, (row + quiet) * modulePixels, modulePixels, modulePixels); id++;
  }
  return canvas;
}

export async function downloadGardenQr(payload: string, season: TreeSeason, palette: TreePaletteId) {
  const canvas = await createGardenQrCanvas(payload, season, palette, 40);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not export QR");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `sakura-qr-${payload.replace(/^https?:\/\//, "").replace(/\W+/g, "-")}.png`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
