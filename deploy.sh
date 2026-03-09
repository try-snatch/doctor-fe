#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
SERVER="${DEPLOY_HOST:-65.0.132.181}"
REMOTE_DIR="/var/www/ref-ezeehealth-ai"
SSH_KEY="${SSH_KEY_PATH:-~/.ssh/id_rsa}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "==> Installing dependencies"
npm ci

echo "==> Building production bundle"
npm run build

echo "==> Syncing dist/ to $SERVER:$REMOTE_DIR"
rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  dist/ \
  "ubuntu@$SERVER:$REMOTE_DIR/"

echo "==> Reloading Nginx"
ssh -i "$SSH_KEY" "ubuntu@$SERVER" "sudo nginx -t && sudo systemctl reload nginx"

echo "==> Done! https://ref.ezeehealth.ai"
