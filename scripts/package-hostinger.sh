#!/usr/bin/env bash
# Build and zip static export for Hostinger File Manager (public_html).
# Do NOT upload this zip via "Node.js Web App" — that flow expects package.json.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
pnpm build
rm -f hoahwa-static-deploy.zip
(cd out && zip -r -q "$ROOT/hoahwa-public_html.zip" .)
ln -sf hoahwa-public_html.zip hoahwa-static-deploy.zip
echo "Created: $ROOT/hoahwa-public_html.zip"
echo ""
echo "Upload path (static site — no Node.js wizard):"
echo "  hPanel → Websites → hoahwa.com → File Manager → public_html"
echo "  → Upload zip → Extract (index.html must be inside public_html)"
echo ""
echo "If you used 'Node.js Web App' upload and saw 'Unsupported framework',"
echo "  that is the wrong screen. Use File Manager above, or run:"
echo "  ./scripts/package-hostinger-nodejs.sh"
