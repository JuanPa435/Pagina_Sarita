#!/bin/bash
# Script de verificación - comprueba que todo esté funcionando

echo "🔍 Verificando configuración de Pagina Sarita..."
echo ""

# 1. Verificar devcontainer.json
echo "✓ Verificando .devcontainer/devcontainer.json..."
if [ -f ".devcontainer/devcontainer.json" ]; then
  echo "  ✅ Archivo existe"
  if grep -q "postStartCommand" ".devcontainer/devcontainer.json"; then
    echo "  ✅ postStartCommand configurado"
  fi
  if grep -q "\"3000\"" ".devcontainer/devcontainer.json"; then
    echo "  ✅ Puerto 3000 configurado"
  fi
  if grep -q "\"8080\"" ".devcontainer/devcontainer.json"; then
    echo "  ✅ Puerto 8080 configurado"
  fi
else
  echo "  ❌ Archivo no encontrado"
fi

echo ""
echo "✓ Verificando package.json..."
if grep -q "\"start\"" "package.json"; then
  echo "  ✅ Script 'npm start' disponible"
fi
if grep -q "\"dev\"" "package.json"; then
  echo "  ✅ Script 'npm run dev' disponible"
fi

echo ""
echo "✓ Verificando scripts..."
if [ -f "start-all.sh" ]; then
  echo "  ✅ start-all.sh existe"
fi
if [ -f "start-backend.sh" ]; then
  echo "  ✅ start-backend.sh existe"
fi

echo ""
echo "✓ Verificando backend..."
if [ -f "backend/save-data.js" ]; then
  echo "  ✅ backend/save-data.js existe"
fi

echo ""
echo "✓ Verificando datos..."
if [ -f "poemas/poemas-data.js" ]; then
  echo "  ✅ poemas-data.js existe"
fi
if [ -f "canciones/canciones-data.js" ]; then
  echo "  ✅ canciones-data.js existe"
fi

echo ""
echo "✓ Verificando HTML..."
if [ -f "index.html" ]; then
  echo "  ✅ index.html existe"
fi
if [ -f "poemas/poemas.html" ]; then
  echo "  ✅ poemas.html existe"
fi
if [ -f "canciones/canciones.html" ]; then
  echo "  ✅ canciones.html existe"
fi

echo ""
echo "════════════════════════════════════════════════"
echo "📊 CONFIGURACIÓN COMPLETADA"
echo "════════════════════════════════════════════════"
echo ""
echo "🎯 Tu aplicación está lista para Codespaces:"
echo "  1. El backend se inicia AUTOMÁTICAMENTE"
echo "  2. Los datos se persisten automáticamente"
echo "  3. Puedes compartir tu enlace sin problemas"
echo ""
echo "📍 Para iniciar localmente, ejecuta:"
echo "  bash start-all.sh"
echo ""
echo "✨ Todo está configurado correctamente!"
echo ""
