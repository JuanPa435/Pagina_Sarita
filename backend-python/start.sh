#!/bin/bash

echo "🚀 Iniciando Backend Flask..."

cd /workspaces/Pagina_Sarita/backend-python

# Matar procesos anteriores
pkill -9 -f "python3.*app.py" 2>/dev/null

sleep 1

# Iniciar backend
python3 app.py
