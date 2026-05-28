#!/usr/bin/env bash
# SSH wrapper for Hostinger (port 65002). Used by rsync/scp; reads SSHPASS from env.
set -euo pipefail
PORT="${HOSTINGER_SSH_PORT:-65002}"
exec sshpass -e ssh \
  -p "$PORT" \
  -o StrictHostKeyChecking=accept-new \
  -o ConnectTimeout=30 \
  -o ServerAliveInterval=10 \
  -o ServerAliveCountMax=6 \
  -o PreferredAuthentications=password \
  -o PubkeyAuthentication=no \
  "$@"
