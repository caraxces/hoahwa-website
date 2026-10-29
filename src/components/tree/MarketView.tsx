"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { TREE_CATEGORIES, categoryLabel, linksCopy, type TreeCategoryId } from "@/content/tree";
import { fetchCategories, fetchMarket, type CategoryCount, type ShortLinkRecord } from "@/lib/short-links-api";
import { createGardenQrCanvas } from "@/lib/qr-garden-art";
import { TreeThumb } from "./TreeThumb";

const ForestCanvas = dynamic(() => import("./ForestCanvas").then(m => m.ForestCanvas), { ssr: false });
const REFRESH_MS = 12000;

function SelectedQr({ tree }: { tree: ShortLinkRecord }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    void createGardenQrCanvas(tree.shortUrl, tree.season, tree.palette, 8).then(canvas => {
      if (cancelled) return;
      canvas.setAttribute("aria-label", "QR for " + tree.shortUrl);
      ref.current?.replaceChildren(canvas);
    });
    return () => { cancelled = true; };
  }, [tree.shortUrl, tree.season, tree.palette]);
  return <div ref={ref} className="forest-selected-qr" data-testid="market-qr" data-payload={tree.shortUrl} />;
}

export function MarketView() {
  const [category, setCategory] = useState<TreeCategoryId | null>(null);
  const [sort, setSort] = useState<"hits" | "new">("hits");
  const [counts, setCounts] = useState<CategoryCount[]>([]);
  const [webgl, setWebgl] = useState(true);
  const [focusCode, setFocusCode] = useState<string | null>(null);
  const key = (category ?? "all") + ":" + sort;
  const [loaded, setLoaded] = useState<{ key: string; trees: ShortLinkRecord[]; totals: { links: number; hits: number }; error?: string; refreshed?: number }>({ key: "", trees: [], totals: { links: 0, hits: 0 } });
  const state = loaded.key !== key ? "loading" : loaded.error && !loaded.trees.length ? "error" : "ready";
  const trees = loaded.key === key ? loaded.trees : [];
  const card = trees.find(t => t.code === focusCode) ?? trees[0];

  useEffect(() => {
    let cancelled = false, pending = false;
    async function refresh() {
      if (pending || document.hidden) return;
      pending = true;
      try {
        const [result, categories] = await Promise.all([fetchMarket({ category, sort, limit: 60 }), fetchCategories()]);
        if (cancelled) return;
        if (categories.ok) setCounts(categories.data.categories);
        if (result.ok) setLoaded({ key, trees: result.data.trees, totals: result.data.totals, refreshed: Date.now() });
        else setLoaded(previous => ({ ...previous, key, trees: previous.key === key ? previous.trees : [], error: result.error }));
      } finally { pending = false; }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), REFRESH_MS);
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", visible);
    return () => { cancelled = true; window.clearInterval(timer); document.removeEventListener("visibilitychange", visible); };
  }, [category, sort, key]);

  const select = useCallback((record: ShortLinkRecord) => setFocusCode(record.code), []);
  const unsupported = useCallback(() => setWebgl(false), []);
  const countFor = (id: string) => counts.find(c => c.category === id)?.links ?? 0;

  return (
    <div className="forest-market" data-testid="forest-market">
      <header className="forest-header">
        <Link href="/tree" className="forest-brand">
          <Image src="/logo-hoahwa/hoahwa_logo_board-07.png" alt="HoaHwa" width={36} height={36} />
          <span><strong>{linksCopy.market}</strong><span data-testid="market-totals">{linksCopy.totals(loaded.totals.links, loaded.totals.hits)}</span></span>
        </Link>
        <p>Every link takes root.<br /><span>Every visit helps it grow.</span></p>
        <Link href="/tree" className="forest-plant">Plant a link ↗</Link>
      </header>

      <nav className="forest-filters" aria-label="Forest categories" data-testid="category-chips">
        <button type="button" aria-pressed={category === null} onClick={() => { setCategory(null); setFocusCode(null); }}>All · {counts.reduce((s, c) => s + c.links, 0)}</button>
        {TREE_CATEGORIES.map(c => <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => { setCategory(c.id); setFocusCode(null); }}>{c.label} · {countFor(c.id)}</button>)}
      </nav>

      <div className="forest-body">
        <section className="forest-view" aria-label="Interactive link forest" aria-busy={state === "loading"}>
          {webgl && state === "ready" && trees.length > 0 ? <ForestCanvas trees={trees} selectedCode={card?.code} onSelect={select} onUnsupported={unsupported} /> : null}
          {state === "loading" ? <p className="forest-state" role="status">Growing the forest…</p> : null}
          {state === "ready" && !trees.length ? <p className="forest-state" data-testid="market-empty">{linksCopy.empty}</p> : null}
          {state === "error" ? <p className="forest-state" role="alert">{loaded.error}</p> : null}
          {!webgl && state === "ready" ? (
            <ul className="forest-fallback" data-testid="forest-fallback">
              {trees.map(tree => <li key={tree.code}><button type="button" onClick={() => select(tree)}>
                <TreeThumb seedText={tree.shortUrl} hits={tree.hits} season={tree.season} palette={tree.palette} />
                <span>{tree.title ?? tree.targetHost}</span><small>{tree.hits.toLocaleString("en-US")} visits · {tree.stage.label}</small>
              </button></li>)}
            </ul>
          ) : null}
          <p className="forest-hint">{webgl ? "Drag to explore · Pinch to zoom · Select a tree for its QR" : "Select a tree to see its QR and visits"}</p>
        </section>

        {card ? <aside className="forest-panel">
          <div className="forest-panel-heading"><span>Your living forest</span><span className="forest-live" role="status">{loaded.error ? "Reconnecting" : "Live"}</span></div>
          <label className="forest-chooser">Explore a tree
            <select aria-label="Choose a tree" data-testid="forest-choose" value={card.code} onChange={e => setFocusCode(e.target.value)}>
              {trees.map(tree => <option key={tree.code} value={tree.code}>{tree.title ?? tree.targetHost}</option>)}
            </select>
          </label>
          <article data-testid="tree-info">
            <p className="forest-stage-label">{card.stage.label} · {categoryLabel(card.category)}</p>
            <h2 className="mt-1 text-lg font-medium leading-snug [overflow-wrap:anywhere]">{card.title ?? card.targetHost}</h2>
            <p className="forest-short-url">{card.shortUrl.replace(/^https?:\/\//, "")}</p>
            <p className="forest-visits"><strong data-testid="forest-visits">{card.hits.toLocaleString("en-US")}</strong><span>visits</span></p>
            <p className="forest-growth-copy">More visits. Taller branches. A wider canopy.</p>
            <SelectedQr key={card.code} tree={card} />
            <p className="forest-scan-label">Scan to visit this link</p>
            <Link href={"/tree/?c=" + card.code} className="forest-open">{linksCopy.openTree} ↗</Link>
          </article>
        </aside> : null}
      </div>

      <footer className="forest-footer">
        <p>One tree per link. Height and canopy grow with its visits.</p>
        <div><span>{trees.length} trees in this grove</span><select aria-label="Sort forest" value={sort} onChange={e => setSort(e.target.value as "hits" | "new")}><option value="hits">Most visited</option><option value="new">Newest</option></select></div>
      </footer>
      <ul data-testid="forest-index" className="sr-only">
        {trees.map(tree => <li key={tree.code}><Link href={"/tree/?c=" + tree.code}>{tree.title ?? tree.targetHost} — {tree.hits} visits, {tree.stage.label}</Link></li>)}
      </ul>
    </div>
  );
}
