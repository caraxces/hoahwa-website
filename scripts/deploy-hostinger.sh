#!/usr/bin/env bash
# Deploy static export to Hostinger via SSH/rsync.
# Usage (from repo root):
#   export HOSTINGER_SSH_PORT=65002
#   export HOSTINGER_SSH_USER=u525593444
#   export HOSTINGER_SSH_HOST=145.79.28.234
#   export HOSTINGER_REMOTE_DIR=domains/YOUR_DOMAIN/public_html
#   ./scripts/deploy-hostinger.sh
#
# Password: use SSH key (recommended) or sshpass:
#   export SSHPASS='your-password'
#   sshpass -e ./scripts/deploy-hostinger.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${HOSTINGER_SSH_PORT:-65002}"
USER="${HOSTINGER_SSH_USER:-u525593444}"
HOST="${HOSTINGER_SSH_HOST:-145.79.28.234}"
REMOTE_DIR="${HOSTINGER_REMOTE_DIR:-domains/hoahwa.com/public_html}"

if [[ -z "$REMOTE_DIR" ]]; then
  echo "Set HOSTINGER_REMOTE_DIR, e.g. domains/hoahwa.com/public_html"
  echo "Tip: ssh -p $PORT $USER@$HOST 'ls domains'"
  exit 1
fi

REMOTE="${USER}@${HOST}:${REMOTE_DIR}"
SSH_OPTS=(-p "$PORT" -o StrictHostKeyChecking=accept-new)

echo "→ Building static site…"
pnpm build

if [[ ! -d out ]]; then
  echo "Build failed: out/ not found"
  exit 1
fi

RSYNC_SSH="ssh ${SSH_OPTS[*]}"
RSYNC=(rsync -avz --delete -e "$RSYNC_SSH" "out/" "${REMOTE}/")

echo "→ Uploading to ${REMOTE} …"
if [[ -n "${SSHPASS:-}" ]] && command -v sshpass >/dev/null; then
  sshpass -e "${RSYNC[@]}"
else
  "${RSYNC[@]}"
fi

echo "Done. Open your domain in the browser."
