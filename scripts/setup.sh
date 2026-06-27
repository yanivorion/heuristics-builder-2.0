#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Heuristics Builder 2.0 setup"
echo "    Project: $ROOT"
echo ""

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo "0")"
if [[ "$NODE_MAJOR" != "20" ]]; then
  echo "WARNING: Node 20 LTS is required (you have Node $(node -v 2>/dev/null || echo 'unknown'))."
  if command -v nvm >/dev/null 2>&1; then
    echo "       Trying: nvm install 20 && nvm use 20"
    # shellcheck disable=SC1090
    source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm install 20
    nvm use 20
  else
    echo ""
    echo "Install Node 20, then re-run this script:"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash"
    echo "  source ~/.zshrc"
    echo "  nvm install 20 && nvm use 20"
    echo "  bash scripts/setup.sh"
    exit 1
  fi
fi

echo "==> Node $(node -v), npm $(npm -v)"

echo "==> Resetting npm registry and cache"
npm config set registry https://registry.npmjs.org/
npm cache clean --force

echo "==> Removing old install artifacts"
rm -rf node_modules

echo "==> Installing dependencies (this can take a few minutes)"
npm install --no-audit --no-fund --loglevel=error

if [[ ! -d node_modules ]]; then
  echo "ERROR: npm install finished but node_modules is missing."
  exit 1
fi

echo ""
echo "==> Setup complete."
echo ""
echo "Next steps:"
echo "  1. Create .env.local (see README.md)"
echo "  2. npx base44 login"
echo "  3. npm run dev"
