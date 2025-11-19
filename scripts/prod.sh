#!/usr/bin/env bash
set -euo pipefail

# Production runner con gunicorn
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACK_DIR="$ROOT_DIR/backend"
PORT=${PORT:-5050}
WORKERS=${WORKERS:-4}

cd "$BACK_DIR"

echo "Starting production server on :$PORT with $WORKERS workers..."
gunicorn \
  --bind 0.0.0.0:$PORT \
  --workers $WORKERS \
  --timeout 120 \
  --access-logfile - \
  --error-logfile - \
  app:app
