#!/usr/bin/env bash
# ZIP full source for Hostinger "Node.js Web App" upload (builds on server).
# After upload, set in hPanel: Framework = Next.js, Output directory = out,
# Build = npm install && npm run build
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
OUT_ZIP="$ROOT/hoahwa-nodejs-deploy.zip"
rm -f "$OUT_ZIP"
zip -r -q "$OUT_ZIP" . \
  -x 'node_modules/*' \
  -x '.next/*' \
  -x 'out/*' \
  -x '.git/*' \
  -x 'hoahwa-*-deploy.zip' \
  -x '.cursor/*' \
  -x 'coverage/*'
echo "Created: $OUT_ZIP"
echo "Use only in hPanel → Websites → Add Website → Node.js → Upload (not File Manager)."
