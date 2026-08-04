#!/usr/bin/env bash
# Deploy the static export to Hostinger over SSH with rsync.
#
# Why this exists, and why not the API deploy:
#   scripts/deploy-hostinger-api.mjs (and the Hostinger MCP static deploy) WIPE
#   public_html before extracting the archive, and their upload endpoint rejects
#   large archives with HTTP 429. This project's out/ is ~825 MB because the
#   /editions/winter2026 mirror ships very heavy PNGs, so the API route cannot
#   deliver a complete site in one archive.
#
#   rsync merges instead of wiping, transfers only what changed, and resumes
#   after a dropped connection — which makes it the only sane option here.
#
# Usage:
#   export SSHPASS='…'          # hPanel → Advanced → SSH Access
#   ./scripts/deploy-rsync.sh                 # merge (safe default)
#   ./scripts/deploy-rsync.sh --dry-run       # show what would transfer
#   ./scripts/deploy-rsync.sh --only-assets   # just assets/ (media restore)
#   ./scripts/deploy-rsync.sh --delete        # also remove remote extras (DANGER)
#
# SSHPASS is also read from .env.local (gitignored) if present, so the password
# never has to be typed into a shell history.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${HOSTINGER_SSH_PORT:-65002}"
USER="${HOSTINGER_SSH_USER:-u525593444}"
HOST="${HOSTINGER_SSH_HOST:-145.79.28.234}"
REMOTE_DIR="${HOSTINGER_REMOTE_DIR:-domains/hoahwa.com/public_html}"

DRY_RUN=0
DELETE=0
SUBPATH=""

for arg in "$@"; do
  case "$arg" in
    --dry-run)     DRY_RUN=1 ;;
    --delete)      DELETE=1 ;;
    --only-assets) SUBPATH="assets/" ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

# Pull SSHPASS out of .env.local if it is not already exported.
if [[ -z "${SSHPASS:-}" && -f .env.local ]]; then
  line="$(grep -E '^[[:space:]]*SSHPASS=' .env.local | tail -1 || true)"
  if [[ -n "$line" ]]; then
    value="${line#*=}"
    value="${value%\"}"; value="${value#\"}"
    value="${value%\'}"; value="${value#\'}"
    export SSHPASS="$value"
  fi
fi

if [[ -z "${SSHPASS:-}" ]]; then
  cat >&2 <<'MSG'
SSHPASS is not set.

  Get it from: hPanel → Advanced → SSH Access → (Change) SSH password
  Then either:
    echo "SSHPASS='your-password'" >> .env.local     # gitignored
  or:
    export SSHPASS='your-password'
MSG
  exit 1
fi

if ! command -v sshpass >/dev/null; then
  echo "sshpass is required: brew install sshpass" >&2
  exit 1
fi

if [[ ! -d out ]]; then
  echo "Missing out/ — run: npm run build" >&2
  exit 1
fi

SSH_CMD="sshpass -e ssh -p ${PORT} \
  -o StrictHostKeyChecking=accept-new \
  -o ConnectTimeout=30 \
  -o ServerAliveInterval=15 \
  -o ServerAliveCountMax=8 \
  -o PreferredAuthentications=password \
  -o PubkeyAuthentication=no"

echo "→ Testing SSH…"
eval "$SSH_CMD ${USER}@${HOST} 'echo ssh-ok'"

# Kept to options that both GNU rsync and macOS openrsync (protocol 29) accept:
# --info=progress2, --append-verify, --no-perms and --omit-dir-times are all
# GNU-only. Using -rlz rather than -a already means perms, times, owner and
# group are not preserved, which is what shared hosting needs anyway.
RSYNC_OPTS=(
  -rlz        # recurse, keep symlinks, compress in transit
  --partial   # keep partial files so an interrupted run resumes
  --progress
  --stats
)

# Filenames containing ";" or "&" are Shopify CDN query strings that were saved
# as literal files by the mirror script. They are duplicates of the plain file,
# the server 301s them, and they account for ~3.3 GB. Never upload them.
RSYNC_OPTS+=( --exclude '*;*' --exclude '*&*' )

(( DRY_RUN )) && RSYNC_OPTS+=( --dry-run )
if (( DELETE )); then
  echo "⚠  --delete: remote files missing locally WILL be removed."
  RSYNC_OPTS+=( --delete )
fi

SRC="out/${SUBPATH}"
DEST="${USER}@${HOST}:${REMOTE_DIR}/${SUBPATH}"

echo "→ rsync ${SRC} → ${DEST}"
rsync "${RSYNC_OPTS[@]}" -e "$SSH_CMD" "$SRC" "$DEST"

echo ""
echo "Done. Verify with: npm run verify:live"
