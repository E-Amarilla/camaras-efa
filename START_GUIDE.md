# 🚀 Guía de Inicio - EFA Cámaras

## 📋 Pre-requisitos

- Node.js instalado
- MediaMTX ejecutable en la carpeta `mediamtx/`
- Cámaras accesibles en la red configurada

## ⚡ Inicio Rápido

### Opción 1: Script Automático (Recomendado)

#### Windows:

```bash
# Doble clic en el archivo o desde terminal:
start-system.bat
```

#### Linux/Mac:

```bash
# Hacer ejecutable (solo primera vez)
chmod +x start-system.sh

# Ejecutar
./start-system.sh
# O usando npm
npm run start-system
```

### Opción 2: Inicio Manual

#### Paso 1: Preparar configuración

```bash
npm install
npm run generate-config
```

#### Paso 2: Iniciar MediaMTX (Terminal 1)

```bash
cd mediamtx

# Windows
./mediamtx.exe

# Linux/Mac  
./mediamtx
```

> **Nota:** MediaMTX debe iniciarse PRIMERO antes que la aplicación web.

#### Paso 3: Iniciar aplicación web (Terminal 2)

```bash
npm run dev
```

## 🌐 URLs de Acceso

| **Entorno**    | **URL**                    |
| -------------- | -------------------------- |
| **Desarrollo** | http://localhost:3001      |
| **VPN**        | http://192.168.10.225:3001 |
| **Local**      | http://192.168.20.150:3001 |

## 🔧 Comandos Útiles

### Configuración

```bash
# Regenerar configuración automática
npm run generate-config

# Configuración para IP específica
npm run generate-config:ip 192.168.10.225
```

### Desarrollo

```bash
# Solo aplicación web (MediaMTX debe estar corriendo)
npm run dev

# Compilar para producción
npm run build

# Servidor de producción
npm start
```

## 📊 Verificación de Estado

### MediaMTX (Puerto 8888)

- HLS Streams: `http://localhost:8888/cam1/index.m3u8`
- WebRTC: `http://localhost:8889`
- RTSP: `rtsp://localhost:8554/cam1`

### Aplicación Web (Puerto 3001)

- Interfaz principal: `http://localhost:3001`

## 🐛 Solución de Problemas

### MediaMTX no inicia

**Error común:** `ERR: json: cannot unmarshal bool into Go struct field`

**Solución:**
```bash
# Regenerar configuración con plantilla corregida
npm run generate-config

# Verificar que el puerto 8888 esté libre  
netstat -an | grep 8888

# Verificar configuración generada
cat mediamtx/mediamtx.yml
```

**Si persiste el error:**
1. El proyecto incluye una plantilla minimal optimizada para MediaMTX v1.14.0
2. La configuración se regenera automáticamente usando la plantilla correcta

### Las cámaras no cargan

1. Verificar que MediaMTX esté corriendo
2. Verificar conectividad con las cámaras
3. Revisar IP de cámaras en la configuración:
   ```bash
   grep -A 2 "cam1:" mediamtx/mediamtx.yml
   ```

### Error de red/IP

1. Regenerar configuración:
   ```bash
   npm run generate-config:ip TU_IP_AQUI
   ```
2. Reiniciar MediaMTX
3. Limpiar cache del navegador

### Puerto en uso

```bash
# Windows - Liberar puerto 3001
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Linux/Mac - Liberar puerto 3001
sudo lsof -ti:3001 | xargs kill -9
```

## 🔄 Proceso de Inicio Completo

1. **Generar configuración** → Detecta IP y configura MediaMTX
2. **Iniciar MediaMTX** → Servidor de streaming de cámaras
3. **Iniciar aplicación web** → Interfaz de usuario
4. **Acceder desde navegador** → Visualizar cámaras

## 📝 Logs Importantes

### MediaMTX iniciado correctamente:

```
[HLS] listener opened on :8888
[RTSP] listener opened on :8554
[WebRTC] listener opened on :8889
```

### Aplicación web lista:

```
Ready - started server on 0.0.0.0:3001
Local: http://localhost:3001
```

## 🆘 Comandos de Emergencia

### Parar todo

```bash
# Windows
taskkill /IM mediamtx.exe /F
taskkill /IM node.exe /F

# Linux/Mac
pkill -f mediamtx
pkill -f "next dev"
```

### Reinicio completo

```bash
# Parar servicios, limpiar, reiniciar
npm run generate-config
./start-system.sh  # o start-system.bat
```

---

## ✅ **ESTADO ACTUAL: SISTEMA FUNCIONANDO**

**Última actualización:** Error de configuración MediaMTX **SOLUCIONADO** ✓

### ✅ Servicios Activos:
- **MediaMTX v1.14.0:** ✓ Funcionando sin errores
- **4 Cámaras:** ✓ Conectadas y streaming (H265)
- **Aplicación Web:** ✓ Disponible en http://localhost:3001
- **Red dinámica:** ✓ Detecta automáticamente VPN/Local

### 🔧 Solución Aplicada:
- Creada plantilla minimal optimizada para MediaMTX v1.14.0
- Sintaxis actualizada (sin parámetros deprecados)
- Configuración automática funcionando
- Sistema listo para uso en producción

### 🚀 Para Iniciar Ahora:
```bash
# Terminal 1: MediaMTX
cd mediamtx && ./mediamtx.exe

# Terminal 2: Aplicación Web  
npm run dev
```

**URL de acceso:** http://localhost:3001
