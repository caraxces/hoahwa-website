#!/usr/bin/env bash
# Deploy via FTP (works when SSH/rsync fails). Password from hPanel → Files → FTP Accounts.
#
#   export HOSTINGER_FTP_HOST=145.79.28.234
#   export HOSTINGER_FTP_USER=u525593444
#   export HOSTINGER_FTP_PASS='ftp-password-from-hpanel'
#   export HOSTINGER_REMOTE_DIR=domains/hoahwa.com/public_html
#   ./scripts/deploy-hostinger-ftp.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST="${HOSTINGER_FTP_HOST:-145.79.28.234}"
USER="${HOSTINGER_FTP_USER:-u525593444}"
PASS="${HOSTINGER_FTP_PASS:-}"
REMOTE_DIR="${HOSTINGER_REMOTE_DIR:-domains/hoahwa.com/public_html}"
ZIP_NAME="hoahwa-public_html.zip"

if [[ -z "$PASS" ]]; then
  echo "Set HOSTINGER_FTP_PASS (hPanel → Files → FTP Accounts — not always same as SSH)."
  exit 1
fi

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "→ Building…"
  pnpm build
fi

if [[ ! -d out ]]; then
  echo "Missing out/"
  exit 1
fi

echo "→ Creating ${ZIP_NAME}…"
rm -f "$ZIP_NAME"
(cd out && zip -r -q "$ROOT/$ZIP_NAME" .)

if command -v lftp >/dev/null; then
  echo "→ Uploading via FTP (lftp)…"
  lftp -u "$USER","$PASS" "ftp://${HOST}" <<EOF
set ftp:ssl-allow no
set net:timeout 30
cd ${REMOTE_DIR}
mput ${ZIP_NAME}
bye
EOF
  echo "Uploaded zip to ${REMOTE_DIR}/"
  echo "In hPanel File Manager: open ${REMOTE_DIR} → Extract ${ZIP_NAME}"
  echo "Or enable SSH and run: unzip -o ${ZIP_NAME} && rm ${ZIP_NAME}"
else
  echo "→ Uploading via curl FTP…"
  curl --ftp-pasv --ftp-create-dirs -T "$ZIP_NAME" \
    --user "${USER}:${PASS}" \
    "ftp://${HOST}/${REMOTE_DIR}/${ZIP_NAME}"
  echo "Uploaded. Extract ${ZIP_NAME} in File Manager → ${REMOTE_DIR}"
fi

echo "Open https://hoahwa.com/ after extract."
