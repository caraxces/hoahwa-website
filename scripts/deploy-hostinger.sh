#!/usr/bin/env bash
# Deploy static export to Hostinger via SSH (chunked SCP + unzip).
#
#   export SSHPASS='your-ssh-password'   # hPanel → Advanced → SSH Access
#   ./scripts/deploy-hostinger.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PORT="${HOSTINGER_SSH_PORT:-65002}"
USER="${HOSTINGER_SSH_USER:-u525593444}"
HOST="${HOSTINGER_SSH_HOST:-145.79.28.234}"
REMOTE_DIR="${HOSTINGER_REMOTE_DIR:-domains/hoahwa.com/public_html}"
ZIP_NAME="hoahwa-public_html.zip"
REMOTE_ZIP="~/${ZIP_NAME}"
CHUNK_BYTES=300000
MAX_RETRIES=3

SSH_OPTS=(
  -p "$PORT"
  -o StrictHostKeyChecking=accept-new
  -o ConnectTimeout=60
  -o ServerAliveInterval=20
  -o ServerAliveCountMax=8
  -o PreferredAuthentications=password
  -o PubkeyAuthentication=no
)

run_ssh() {
  local attempt=1
  while (( attempt <= MAX_RETRIES )); do
    if [[ -n "${SSHPASS:-}" ]] && command -v sshpass >/dev/null; then
      sshpass -e ssh "${SSH_OPTS[@]}" "$USER@$HOST" "$@" && return 0
    else
      ssh "${SSH_OPTS[@]}" "$USER@$HOST" "$@" && return 0
    fi
    echo "   SSH retry ${attempt}/${MAX_RETRIES}…"
    sleep 3
    attempt=$((attempt + 1))
  done
  return 1
}

run_scp() {
  local src=$1 dest=$2 attempt=1
  while (( attempt <= MAX_RETRIES )); do
    if [[ -n "${SSHPASS:-}" ]] && command -v sshpass >/dev/null; then
      sshpass -e scp -P "$PORT" \
        -o StrictHostKeyChecking=accept-new \
        -o ConnectTimeout=90 \
        -o ServerAliveInterval=20 \
        -o PreferredAuthentications=password \
        -o PubkeyAuthentication=no \
        "$src" "${USER}@${HOST}:${dest}" && return 0
    else
      scp -P "$PORT" -o ConnectTimeout=90 "$src" "${USER}@${HOST}:${dest}" && return 0
    fi
    echo "   SCP retry ${attempt}/${MAX_RETRIES}…"
    sleep 3
    attempt=$((attempt + 1))
  done
  return 1
}

if [[ -z "${SSHPASS:-}" ]]; then
  echo "Set SSHPASS (hPanel → Advanced → SSH Access → SSH password)."
  exit 1
fi

echo "→ Testing SSH…"
run_ssh 'echo ssh-ok && pwd'

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "→ Building static site…"
  pnpm build
fi

if [[ ! -d out ]]; then
  echo "Missing out/ — run: pnpm build"
  exit 1
fi

echo "→ Creating ${ZIP_NAME}…"
rm -f "$ZIP_NAME"
(cd out && zip -r -q "$ROOT/$ZIP_NAME" .)

chunk_dir="$(mktemp -d)"
cleanup() { rm -rf "$chunk_dir"; }
trap cleanup EXIT

echo "→ Uploading in ~300KB chunks…"
split -b "$CHUNK_BYTES" "$ROOT/$ZIP_NAME" "${chunk_dir}/part."
run_ssh "rm -rf ~/deploy-chunks && mkdir -p ~/deploy-chunks"

n=0
total="$(find "${chunk_dir}" -name 'part.*' | wc -l | tr -d ' ')"
for part in "${chunk_dir}"/part.*; do
  n=$((n + 1))
  base="$(basename "$part")"
  echo "   chunk ${n}/${total}: ${base}"
  run_scp "$part" "~/deploy-chunks/${base}"
done

echo "→ Assembling zip on server…"
run_ssh "cat ~/deploy-chunks/part.* > ${REMOTE_ZIP} && rm -rf ~/deploy-chunks"

echo "→ Extracting into ${REMOTE_DIR}…"
run_ssh "mkdir -p ${REMOTE_DIR} && unzip -o -q ${REMOTE_ZIP} -d ${REMOTE_DIR} && rm -f ${REMOTE_ZIP} && ls ${REMOTE_DIR} | head -5"

echo ""
echo "Done. Open https://hoahwa.com/ (hard-refresh if needed)."
