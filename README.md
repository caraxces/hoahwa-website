# Hoahwa

Marketing site for **Hoahwa** — eCommerce Growth Agency (Shopify Plus). Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion.

**Repository:** https://github.com/caraxces/hoahwa-website  
**Local path:** `/Volumes/SDD1000-TrucMT/CursorProjects/hoahwa-website/source` (client documents live next to it in `../_client-docs/`, archives in `../_archives/`)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/audits` | CX, CRO + Tech audits |
| `/shopify-theme-builds` | Shopify builds + migrations |
| `/growth-retainers` | Growth retainers |
| `/case-studies` | Case studies grid (006: `/case-studies/notch-agent-train`) |
| `/build-log` | Weekly build log across our own projects |
| `/insights` | eCommerce insights / blog index |
| `/careers` | Careers |
| `/contact` | Contact |
| `/tree` | HoaHwa Links: `hoahwa.com/<code>` shortener. A colored QR starts flat; its own cubes lift, tumble and assemble into a voxel cherry tree on an ivory stone court. Fold reverses those same cubes into their exact QR cells. Generated blossom details decorate the canopy; API click counts control growth. Responsive orthographic framing, touch/keyboard controls, reduced motion, idle rendering and a 2D QR fallback. `npm run test:tree:morph` verifies the deterministic mapping and QR palettes; `npm run test:tree` decodes real browser renders and downloads and checks the UI with a mocked PHP API. PHP API `public/api/short-links.php`, redirector `public/api/go.php` |
| `/tree/market` | Tree market: one isometric island where every link is a tree — category picks the species colour, clicks pick the size, the most-clicked stand at the heart |
| `/apps/bloombound` | BloomBound 3D game (built from `wallbreaker/`, online at play.hoahwa.com) |

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
```

Static export (`output: 'export'`) writes to `out/`.

## Deploy (`hoahwa.com`)

The only production deploy is **rsync over SSH**:

```bash
npm run build                 # static export → out/
npm run deploy:rsync          # merge out/ into public_html (never deletes remote files)
npm run verify:live           # smoke the live site
```

- Do **not** use the Hostinger API / `deploy:hostinger` / File Manager zips for this site: the API wipes `public_html` (which also holds `/canomod` WordPress and the Kể installers) and 429s on the ~870 MB tree. The old helper scripts (`deploy-hostinger*.sh`, `package-hostinger*.sh`, `deploy-hostinger-api.mjs`) are kept only for reference.
- A single `Permission denied` right after another SSH attempt is Hostinger throttling: wait a minute and retry, do not change the password.
- New files that are mode 0600 locally land 0600 and return 403: `find public out -type f ! -perm -o=r -exec chmod go+r {} +` before deploying.
- The BloomBound room server (`play.hoahwa.com`) is a separate Node.js app deployed through the Hostinger Node.js build API, see `wallbreaker/README.md`.

## Weekly traffic report

`npm run report:weekly` pulls Search Console + GA4 (last 7 days vs previous 7) and tracks the +60% WoW target. One-time setup: `docs/analytics-api-setup.md`. `npm run report:weekly -- --dry-run` checks the maths without credentials.

## Build log

Add one entry per week to `src/content/build-log.ts` (newest first). It feeds `/build-log`.

## Visual smoke (optional)

```bash
npm run build
npm start -- -p 3010
npm run smoke
```

## Design tokens

Brand tokens live in `src/styles/figma-tokens.css` (accent `#CD9D65`, Romance, Cod Gray, etc.).

## Structure

- `src/app/` — App Router pages
- `src/components/` — UI (layout, home, service pages)
- `src/content/` — Copy and navigation data
- `public/figma/` — Static assets
- `scripts/` — Hostinger packaging / rsync helpers

## Related repos

- **This repo** — marketing website only.
- **`caraxces/hoahwa`** — older remote name; use **`hoahwa-website`** going forward.
- Shopify themes and other Hoahwa assets may live under `~/Documents/hoahwa/` separately.
