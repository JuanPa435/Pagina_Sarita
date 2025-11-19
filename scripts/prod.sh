#!/usr/bin/env bash
set -euo pipefail

# Production runner: backend con gunicorn
# Los archivos estáticos se sirven desde Vercel/CDN

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACK_DIR="$ROOT_DIR/backend"
PORT=${PORT:-5050}
WORKERS=${WORKERS:-4}
TIMEOUT=${TIMEOUT:-120}

echo "Starting production backend with gunicorn..."
echo "  Port: $PORT"
echo "  Workers: $WORKERS"
echo "  Timeout: ${TIMEOUT}s"
echo ""

cd "$BACK_DIR"

# Usar gunicorn para producción
exec gunicorn \
  --bind "0.0.0.0:$PORT" \
  --workers "$WORKERS" \
  --timeout "$TIMEOUT" \
  --access-logfile - \
  --error-logfile - \
  --log-level info \
  app:app
