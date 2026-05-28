# Hoahwa

Marketing site for **Hoahwa** — eCommerce Growth Agency (Shopify Plus). Next.js App Router, TypeScript, Tailwind CSS 4, Framer Motion.

**Repository:** https://github.com/caraxces/hoahwa-website  
**Local path:** `~/Documents/hoahwa-website` (standalone — not inside the `hoahwa` themes folder)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/audits` | CX, CRO + Tech audits |
| `/shopify-theme-builds` | Shopify builds + migrations |
| `/growth-retainers` | Growth retainers |
| `/case-studies` | Case studies grid |
| `/insights` | eCommerce insights / blog index |
| `/careers` | Careers |
| `/contact` | Contact |

## Develop

```bash
cd ~/Documents/hoahwa-website
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
pnpm build
```

Static export (`output: 'export'`) writes to `out/`.

## Deploy to Hostinger (`hoahwa.com`) via Git

Recommended: connect this repo in hPanel so each push to `main` rebuilds and deploys.

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Connect in hPanel

1. **Websites → hoahwa.com → Git** (or **Deploy → GitHub**).
2. Authorize GitHub and select **`caraxces/hoahwa-website`**, branch **`main`**.
3. If using **Node.js Web App** deploy, set:

   | Setting | Value |
   |---------|--------|
   | Framework | **Next.js** |
   | Node.js | **20.x** |
   | Install | `npm install` |
   | Build | `npm run build` |
   | Output directory | **`out`** |
   | Root directory | `/` (repo root) |

4. Deploy. Hostinger runs install + build on the server; static files land in `out/`.

> **Important:** Type the install command as `npm install` — do not leave the default/auto option. If `pnpm-lock.yaml` is present, Hostinger may run **pnpm** via Corepack, which fails on shared hosting with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`. This repo also includes `package-lock.json` for npm.

> Use the **Git** flow with the full repo — not a zip of `out/`. Pre-built zips are only for **File Manager** upload (`./scripts/package-hostinger.sh`).

### Hostinger build fails (`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`)

Hostinger’s alt-nodejs + Corepack **pnpm** often breaks. Fix in **hPanel → Node.js app → Settings**:

| Setting | Value |
|---------|--------|
| Install | `npm install` |
| Build | `npm run build` |
| Node.js | **20.x** |

Then **Redeploy**. Do not use `pnpm install` on the server.

**Fastest alternative (no server build):** build locally and upload static files only:

```bash
./scripts/package-hostinger.sh   # → hoahwa-public_html.zip → File Manager → public_html
# or
./scripts/deploy-hostinger.sh    # rsync out/ via SSH
```

### 3. After code changes

```bash
git add -A && git commit -m "your message" && git push
```

Redeploy from hPanel or wait for auto-deploy if enabled.

## Deploy via Hostinger API (recommended)

Fastest and most reliable for this static export (`out/`). No SSH/rsync timeouts.

```bash
export HOSTINGER_API_TOKEN='…'   # hPanel → Account → API
pnpm deploy:hostinger
# or: node scripts/deploy-hostinger-api.mjs
```

Uses the same flow as MCP tool `hosting_deployStaticWebsite` (upload zip → extract on server).

### Hostinger MCP in Cursor

1. Copy `.cursor/mcp.json.example` → merge into **Cursor Settings → MCP** (use `HOSTINGER_API_TOKEN`, not a file on disk).
2. Restart Cursor; enable **hostinger-api** (or `hostinger-hosting-mcp` only to save tool slots).
3. Ask the agent: *Deploy static site to hoahwa.com from `out/`* → it should call `hosting_deployStaticWebsite`.

| Tool | Use for Hoahwa site |
|------|---------------------|
| `hosting_deployStaticWebsite` | **Yes** — pre-built `out/` zip |
| `hosting_deployJsApplication` | No — builds on server (pnpm/Corepack issues) |
| SSH `deploy-hostinger.sh` | Fallback only — shared hosting often times out |

## Other deploy options

- **File Manager:** `./scripts/package-hostinger.sh` → upload `hoahwa-public_html.zip` to `public_html`.
- **SSH:** `./scripts/deploy-hostinger.sh` (often unstable on shared hosting).

## Visual smoke (optional)

```bash
pnpm build
pnpm start -p 3010
pnpm smoke
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
