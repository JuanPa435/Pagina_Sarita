#!/bin/bash
# Script para iniciar el backend automáticamente

echo "🚀 Iniciando backend..."
cd "$(dirname "$0")"
node backend/save-data.js &
echo "✅ Backend iniciado en segundo plano (PID: $!)"
