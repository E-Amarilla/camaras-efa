#!/bin/bash

# Script de inicio completo para EFA Cámaras
# Este script inicia MediaMTX y la aplicación web automáticamente

echo "=== Iniciando Sistema EFA Cámaras ==="

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "Error: Ejecutar desde el directorio raíz del proyecto"
    exit 1
fi

# Generar configuración de MediaMTX
echo "1. Generando configuración de MediaMTX..."
npm run generate-config

# Verificar que MediaMTX existe
if [ ! -f "mediamtx/mediamtx.exe" ] && [ ! -f "mediamtx/mediamtx" ]; then
    echo "Error: MediaMTX no encontrado en mediamtx/"
    exit 1
fi

echo "2. Iniciando MediaMTX..."

# Determinar el ejecutable correcto
if [ -f "mediamtx/mediamtx.exe" ]; then
    MEDIAMTX_CMD="./mediamtx.exe"
else
    MEDIAMTX_CMD="./mediamtx"
fi

# Iniciar MediaMTX en background
cd mediamtx
$MEDIAMTX_CMD &
MEDIAMTX_PID=$!
cd ..

# Esperar un momento para que MediaMTX se inicie
sleep 3

echo "3. Iniciando aplicación web..."
echo "   MediaMTX PID: $MEDIAMTX_PID"
echo "   Aplicación web estará en: http://localhost:3001"
echo ""
echo "Para detener el sistema, presiona Ctrl+C"

# Función para cleanup al salir
cleanup() {
    echo ""
    echo "Deteniendo servicios..."
    kill $MEDIAMTX_PID 2>/dev/null
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar aplicación web (esto bloquea hasta Ctrl+C)
npm run dev

# Si llegamos aquí, hacer cleanup
cleanup