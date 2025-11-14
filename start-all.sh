#!/bin/bash
# Script para iniciar backend y frontend automáticamente

set -e

PROJECT_DIR="$(dirname "$0")"
cd "$PROJECT_DIR"

echo "🚀 Pagina Sarita - Iniciando servicios..."

# Iniciar backend en puerto 3000
echo "📝 Iniciando backend en puerto 3000..."
node backend/save-data.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend iniciado (PID: $BACKEND_PID)"

# Iniciar frontend en puerto 8080
echo "🌐 Iniciando servidor frontend en puerto 8080..."
python3 -m http.server 8080 --directory . > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"

echo ""
echo "════════════════════════════════════════════════"
echo "🎉 Servicios iniciados correctamente:"
echo "📝 Backend:   http://localhost:3000"
echo "🌐 Frontend:  http://localhost:8080"
echo "════════════════════════════════════════════════"
echo ""
echo "Para ver logs:"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""

# Mantener activo
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
