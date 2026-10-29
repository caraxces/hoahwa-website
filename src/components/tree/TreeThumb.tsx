import type { TreePaletteId, TreeSeason } from "@/content/tree";
import { forestHeight, forestTreeModel } from "@/lib/qr-forest";
import { morphColors } from "@/lib/qr-tree-morph";

type Props = { seedText: string; hits: number; season: TreeSeason; palette: TreePaletteId; className?: string };

/** An SVG projection of the same QR-derived tree, including its visit-dependent size. */
export function TreeThumb({ seedText, hits, season, palette, className }: Props) {
  const model = forestTreeModel(seedText);
  const height = forestHeight(hits), span = Math.max(9, height * 1.3), scale = height / (model.height + 0.47);
  const branches = model.cells.filter(c => c.role === "wood" && c.direction);
  const flowers = model.cells.filter(c => c.role === "blossom").filter((_, i) => i % 4 === 0);
  const paths = branches.map(c => {
    const d = c.direction!, length = (c.length ?? c.size) / Math.hypot(d.x, d.y, d.z) / 2;
    const x = c.grown.x, y = c.grown.y + 0.47;
    return "M" + (x - d.x * length) * scale + "," + -(y - d.y * length) * scale + "L" + (x + d.x * length) * scale + "," + -(y + d.y * length) * scale;
  }).join(" ");
  return <svg viewBox={[-span * 0.65, -span, span * 1.3, span * 1.08].join(" ")} className={className} aria-hidden="true" style={{ background: "#eef2e3" }}>
    <path d={paths} fill="none" stroke="#795640" strokeWidth={height * 0.017} strokeLinecap="round" />
    {flowers.map(c => <circle key={c.id} cx={c.grown.x * scale} cy={-(c.grown.y + 0.47) * scale} r={c.size * scale * 1.55} fill={morphColors(c, model.size, season, palette).grown} />)}
    <ellipse cx="0" cy="0.09" rx="1.55" ry="0.13" fill="#adbe87" />
  </svg>;
}
