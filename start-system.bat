@echo off
REM Script de inicio completo para EFA Cámaras (Windows)
REM Este script inicia MediaMTX y la aplicación web automáticamente

echo === Iniciando Sistema EFA Camaras ===

REM Verificar si estamos en el directorio correcto
if not exist "package.json" (
    echo Error: Ejecutar desde el directorio raiz del proyecto
    pause
    exit /b 1
)

REM Generar configuración de MediaMTX
echo 1. Generando configuracion de MediaMTX...
call npm run generate-config

REM Verificar que MediaMTX existe
if not exist "mediamtx\mediamtx.exe" (
    echo Error: MediaMTX no encontrado en mediamtx/
    pause
    exit /b 1
)

echo 2. Iniciando MediaMTX...

REM Iniciar MediaMTX en una nueva ventana
start "MediaMTX Server" /D "mediamtx" mediamtx.exe

REM Esperar un momento para que MediaMTX se inicie
timeout /t 3 /nobreak >nul

echo 3. Iniciando aplicacion web...
echo    Aplicacion web estara en: http://localhost:3001
echo.
echo Para detener el sistema, cierra ambas ventanas

REM Iniciar aplicación web
npm run dev

pause