import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Determina la IP de las cámaras según la IP de acceso
 */
function getCameraIP(accessIP: string): string {
  if (accessIP.match(/^192\.168\.(\d+)\./)) {
    // Extraer el segmento de red
    const segment = accessIP.split(".")[2];
    return `192.168.${segment}.160`;
  } else {
    // Desarrollo local u otros casos
    return "192.168.10.160"; // IP por defecto
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessIP, targetAddress } = await request.json();

    if (!accessIP) {
      return NextResponse.json(
        { error: "IP de acceso requerida" },
        { status: 400 },
      );
    }

    const cameraIP = getCameraIP(accessIP);

    const templatePath = path.join(
      process.cwd(),
      "mediamtx",
      "mediamtx.template.yml",
    );
    const outputPath = path.join(process.cwd(), "mediamtx", "mediamtx.yml");

    // Verificar si la plantilla existe
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { error: "No se encontró la plantilla de configuración" },
        { status: 500 },
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
      { status: 500 },
    );
  }
}
