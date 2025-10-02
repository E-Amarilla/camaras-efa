#!/bin/bash

# Script para generar configuración dinámica de mediamtx basada en la IP de acceso

# Función para determinar la IP de las cámaras según la red
get_camera_ip() {
    local access_ip="$1"
    
    if [[ "$access_ip" == "192.168.10.1" ]]; then
        # Red VPN
        echo "192.168.10.160"
    elif [[ "$access_ip" == "192.168.20.41" ]]; then
        # Red local
        echo "192.168.20.41"  # Ajustar según la IP real de las cámaras en red local
    elif [[ "$access_ip" =~ ^192\.168\.([0-9]+)\..*$ ]]; then
        # Red genérica 192.168.x.x
        local segment="${BASH_REMATCH[1]}"
        echo "192.168.${segment}.41"
    else
        # Desarrollo local u otros casos
        echo "192.168.10.160"  # IP por defecto
    fi
}

# Función para detectar la IP de acceso
detect_access_ip() {
    # Si se pasa como parámetro
    if [ "$1" ]; then
        echo "$1"
        return
    fi
    
    # Intentar detectar desde hostname/IP local
    local hostname=$(hostname -I | awk '{print $1}')
    if [[ "$hostname" =~ ^192\.168\. ]]; then
        echo "$hostname"
    else
        echo "localhost"
    fi
}

# Función principal
generate_config() {
    local access_ip=$(detect_access_ip "$1")
    local camera_ip=$(get_camera_ip "$access_ip")
    
    echo "Generando configuración para acceso desde: $access_ip"
    echo "IP de cámaras configurada: $camera_ip"
    
    # Reemplazar la plantilla
    sed "s/{{CAMERA_IP}}/$camera_ip/g" "mediamtx.template.yml" > "mediamtx.yml"
    
    echo "Configuración generada exitosamente en mediamtx.yml"
}

# Verificar si la plantilla existe
if [ ! -f "mediamtx.template.yml" ]; then
    echo "Error: No se encontró el archivo mediamtx.template.yml"
    exit 1
fi

# Ejecutar función principal con el parámetro pasado (opcional)
generate_config "$1"