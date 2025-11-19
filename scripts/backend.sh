#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACK_DIR="$ROOT_DIR/backend"
PORT_DEFAULT=5050
PIDFILE="$ROOT_DIR/.backend.pid"
LOGFILE="$ROOT_DIR/backend.log"

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

start_backend() {
  local port=${PORT:-$PORT_DEFAULT}
  if is_running; then
    echo "Backend ya está corriendo (PID $(cat "$PIDFILE")) en puerto $port."
    exit 0
  fi
  mkdir -p "$BACK_DIR"
  cd "$BACK_DIR"
  echo "Iniciando backend en :$port ... logs -> $LOGFILE"
  nohup env PORT="$port" python app.py > "$LOGFILE" 2>&1 &
  echo $! > "$PIDFILE"
  sleep 1
  if is_running; then
    echo "✅ Backend iniciado (PID $(cat "$PIDFILE"))"
  else
    echo "❌ No se pudo iniciar el backend. Revisa $LOGFILE"; exit 1
  fi
}

stop_backend() {
  if is_running; then
    local pid
    pid=$(cat "$PIDFILE")
    echo "Deteniendo backend (PID $pid) ..."
    kill "$pid" 2>/dev/null || true
    sleep 1
    if ps -p "$pid" > /dev/null 2>&1; then
      echo "Forzando stop..."
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
    echo "✅ Backend detenido"
  else
    echo "Backend no está corriendo"
  fi
}

status_backend() {
  if is_running; then
    echo "✅ Backend corriendo (PID $(cat "$PIDFILE"))"
  else
    echo "❌ Backend detenido"
  fi
}

logs_backend() {
  touch "$LOGFILE"
  tail -n 100 -f "$LOGFILE"
}

health_backend() {
  local port=${PORT:-$PORT_DEFAULT}
  curl -s "http://127.0.0.1:${port}/api/health" || true
}

case "${1:-}" in
  start) start_backend ;;
  stop) stop_backend ;;
  restart) stop_backend || true; start_backend ;;
  status) status_backend ;;
  logs) logs_backend ;;
  health) health_backend ;;
  *)
    echo "Uso: $0 {start|stop|restart|status|logs|health}"
    exit 1
    ;;
 esac
