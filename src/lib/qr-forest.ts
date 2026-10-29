import { hashSeed } from "./qr-tree";
import { buildTreeMorph, hashUnit, type TreeMorph } from "./qr-tree-morph";
import type { ShortLinkRecord } from "./short-links-api";

const models = new Map<string, TreeMorph>();

/** The exact QR-derived model used by the individual tree page, cached independently of visits. */
export function forestTreeModel(payload: string) {
  let model = models.get(payload);
  if (!model) {
    model = buildTreeMorph(payload, 0, true);
    models.set(payload, model);
    if (models.size > 96) models.delete(models.keys().next().value!);
  }
  return model;
}

/** Logarithmic, continuous growth: even an ancient tree continues growing beyond 2,000 visits. */
export function forestHeight(hits: number) {
  return 1.6 + 1.65 * Math.log10(1 + (Number.isFinite(hits) ? Math.max(0, hits) : 0));
}

/** Ranking changes never move a tree to another plot. Codes determine the arrangement. */
export function forestPlots(records: Pick<ShortLinkRecord, "code" | "shortUrl">[]) {
  return [...records].sort((a, b) => a.code.localeCompare(b.code)).map((record, i) => {
    const seed = hashSeed(record.shortUrl);
    const angle = i * Math.PI * (3 - Math.sqrt(5)) + (hashUnit(seed, 8) - 0.5) * 0.16;
    const radius = 4.2 * Math.sqrt(i);
    return { code: record.code, x: Math.cos(angle) * radius, z: Math.sin(angle) * radius, yaw: hashUnit(seed, 3) * Math.PI * 2 };
  });
}
