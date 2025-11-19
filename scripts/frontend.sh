#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT_DEFAULT=8080
BIND_DEFAULT=127.0.0.1
PIDFILE="$ROOT_DIR/.frontend.pid"
LOGFILE="$ROOT_DIR/frontend.log"

is_running() {
  if [[ -f "$PIDFILE" ]]; then
    local pid
    pid=$(cat "$PIDFILE" 2>/dev/null || echo "")
    if [[ -n "${pid}" ]] && ps -p "$pid" > /dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

start_frontend() {
  local port=${FRONT_PORT:-${PORT:-$PORT_DEFAULT}}
  local bind=${BIND_FRONT:-${BIND:-$BIND_DEFAULT}}
  if is_running; then
    echo "Frontend ya está corriendo (PID $(cat "$PIDFILE")) en http://$bind:$port/"
    exit 0
  fi
  cd "$ROOT_DIR"
  echo "Iniciando frontend en http://$bind:$port/ ... logs -> $LOGFILE"
  nohup env PORT="$port" BIND="$bind" python scripts/serve.py > "$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"
  sleep 1
  if is_running; then
    echo "✅ Frontend iniciado (PID $(cat "$PIDFILE"))"
  else
    echo "❌ No se pudo iniciar el frontend. Revisa $LOGFILE"; exit 1
  fi
}

stop_frontend() {
  if is_running; then
    local pid
    pid=$(cat "$PIDFILE")
    echo "Deteniendo frontend (PID $pid) ..."
    kill "$pid" 2>/dev/null || true
    sleep 1
    if ps -p "$pid" > /dev/null 2>&1; then
      echo "Forzando stop..."
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
    echo "✅ Frontend detenido"
  else
    echo "Frontend no está corriendo"
  fi
}

status_frontend() {
  if is_running; then
    echo "✅ Frontend corriendo (PID $(cat "$PIDFILE"))"
  else
    echo "❌ Frontend detenido"
  fi
}

logs_frontend() {
  touch "$LOGFILE"
  tail -n 100 -f "$LOGFILE"
}

health_frontend() {
  local port=${FRONT_PORT:-${PORT:-$PORT_DEFAULT}}
  local bind=${BIND_FRONT:-${BIND:-$BIND_DEFAULT}}
  curl -sI "http://${bind}:${port}/" | head -1 || true
}

case "${1:-}" in
  start) start_frontend ;;
  stop) stop_frontend ;;
  restart) stop_frontend || true; start_frontend ;;
  status) status_frontend ;;
  logs) logs_frontend ;;
  health) health_frontend ;;
  *)
    echo "Uso: $0 {start|stop|restart|status|logs|health}"
    exit 1
    ;;
 esac
