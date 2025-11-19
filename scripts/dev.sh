#!/usr/bin/env bash
set -euo pipefail

# Dev runner: backend (Flask) + frontend (custom server)
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACK_DIR="$ROOT_DIR/backend"
PORT_BACK=${PORT:-5050}
PORT_FRONT=${FRONT_PORT:-8080}
BIND_FRONT=${BIND_FRONT:-127.0.0.1}

# Stop children on exit
cleanup() {
  echo -e "\nShutting down..."
  [[ -n "${BACK_PID:-}" ]] && kill "$BACK_PID" 2>/dev/null || true
  [[ -n "${FRONT_PID:-}" ]] && kill "$FRONT_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Start backend
cd "$BACK_DIR"
echo "Starting backend on :$PORT_BACK ..."
PORT="$PORT_BACK" python app.py &
BACK_PID=$!

# Start frontend  
cd "$ROOT_DIR"
echo "Starting frontend on http://$BIND_FRONT:$PORT_FRONT ..."
PORT="$PORT_FRONT" BIND="$BIND_FRONT" python scripts/serve.py &
FRONT_PID=$!

sleep 1

echo -e "\nDev servers running:"
echo "  Backend:  http://127.0.0.1:$PORT_BACK/api/health"
echo "  Frontend: http://$BIND_FRONT:$PORT_FRONT/index.html"
echo -e "\nPress Ctrl+C to stop."

# Wait for any to exit
wait -n $BACK_PID $FRONT_PID
exit $?
