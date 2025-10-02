import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Determina la IP de las cámaras según la IP de acceso
 * @param {string} accessIP - IP desde donde se accede a la aplicación
 * @returns {string} - IP de las cámaras
 */
function getCameraIP(accessIP) {
  if (accessIP.match(/^192\.168\.(\d+)\./)) {
    // Extraer el segmento de red
    const segment = accessIP.split(".")[2];
    return `192.168.${segment}.160`;
  } else {
    // Desarrollo local u otros casos
    return "192.168.10.160"; // IP por defecto
  }
}

/**
 * Detecta la IP de acceso
 * @param {string} providedIP - IP proporcionada como parámetro (opcional)
 * @returns {string} - IP de acceso detectada
 */
function detectAccessIP(providedIP) {
  if (providedIP) {
    return providedIP;
  }

  // En entorno de desarrollo, usar IP por defecto
  return "localhost";
}

/**
 * Genera la configuración de mediamtx
 * @param {string} accessIP - IP de acceso (opcional)
 */
function generateConfig(accessIP) {
  const minimalTemplatePath = path.join(
    __dirname,
    "mediamtx.minimal.template.yml",
  );
  const basicTemplatePath = path.join(__dirname, "mediamtx.basic.template.yml");
  const originalTemplatePath = path.join(__dirname, "mediamtx.template.yml");
  const outputPath = path.join(__dirname, "mediamtx.yml");

  // Usar la plantilla minimal primero, luego básica, luego original
  let actualTemplatePath;
  if (fs.existsSync(minimalTemplatePath)) {
    actualTemplatePath = minimalTemplatePath;
    console.log("Usando plantilla minimal");
  } else if (fs.existsSync(basicTemplatePath)) {
    actualTemplatePath = basicTemplatePath;
    console.log("Usando plantilla básica");
  } else if (fs.existsSync(originalTemplatePath)) {
    actualTemplatePath = originalTemplatePath;
    console.log("Usando plantilla original");
  } else {
    console.error("Error: No se encontró ningún archivo de plantilla");
    process.exit(1);
  }

  const detectedAccessIP = detectAccessIP(accessIP);
  const cameraIP = getCameraIP(detectedAccessIP);

  console.log(`Generando configuración para acceso desde: ${detectedAccessIP}`);
  console.log(`IP de cámaras configurada: ${cameraIP}`);

  // Leer la plantilla
  let config = fs.readFileSync(actualTemplatePath, "utf8");

  // Reemplazar los placeholders
  config = config.replace(/\{\{CAMERA_IP\}\}/g, cameraIP);

  // Escribir el archivo final
  fs.writeFileSync(outputPath, config);

  console.log("Configuración generada exitosamente en mediamtx.yml");
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const providedIP = process.argv[2];
  generateConfig(providedIP);
}

export {
  generateConfig,
  getCameraIP,
  detectAccessIP,
};
