import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Determina la IP de las cámaras según la IP de acceso
 */
function getCameraIP(accessIP: string): string {
  if (accessIP === "192.168.10.225") {
    // Red VPN
    return "192.168.10.182";
  } else if (accessIP === "192.168.20.150") {
    // Red local
    return "192.168.20.182"; // Ajustar según la IP real de las cámaras en red local
  } else if (accessIP.match(/^192\.168\.(\d+)\./)) {
    // Red genérica 192.168.x.x
    const segment = accessIP.split('.')[2];
    return `192.168.${segment}.182`;
  } else {
    // Desarrollo local u otros casos
    return "192.168.10.182"; // IP por defecto
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessIP, targetAddress } = await request.json();

    if (!accessIP) {
      return NextResponse.json(
        { error: "IP de acceso requerida" },
        { status: 400 }
      );
    }

    const cameraIP = getCameraIP(accessIP);
    
    const templatePath = path.join(process.cwd(), "mediamtx", "mediamtx.template.yml");
    const outputPath = path.join(process.cwd(), "mediamtx", "mediamtx.yml");

    // Verificar si la plantilla existe
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "No se encontró la plantilla de configuración" },
        { status: 500 }
      );
    }

    // Leer la plantilla
    let config = fs.readFileSync(templatePath, "utf8");

    // Reemplazar los placeholders
    config = config.replace(/\{\{CAMERA_IP\}\}/g, cameraIP);

    // Escribir el archivo final
    fs.writeFileSync(outputPath, config);

    return NextResponse.json({
      message: "Configuración generada exitosamente",
      accessIP,
      cameraIP,
      targetAddress,
    });
  } catch (error) {
    console.error("Error generando configuración:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}