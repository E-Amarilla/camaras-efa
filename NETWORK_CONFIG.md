# Configuración Dinámica de Red - EFA Cámaras

## Descripción

Este sistema permite que la aplicación de cámaras EFA funcione tanto en acceso local como mediante VPN, detectando automáticamente la configuración de red apropiada.

## Funcionamiento

### Detección Automática de Red

La aplicación detecta automáticamente desde qué IP se está accediendo y configura las URLs correspondientes:

- **192.168.10.114**: Red VPN (VLAN)
- **192.168.20.150**: Red Local
- **192.168.x.x**: Red genérica (ajusta automáticamente el segmento)
- **localhost**: Desarrollo local

### Configuración Automática

#### URLs de Servicios

- **Base URL**: `http://[IP_DETECTADA]`
- **Login URL**: `http://[IP_DETECTADA]:3000`
- **Redirect URL**: `http://[IP_DETECTADA]:3001`
- **MediaMTX URL**: `http://[IP_DETECTADA]:8888`

#### IP de Cámaras

- **Red VPN (192.168.10.114)**: Cámaras en `192.168.10.160`
- **Red Local (192.168.20.150)**: Cámaras en `192.168.20.160`
- **Red genérica**: Cámaras en `192.168.[segmento].160`

## Archivos Modificados

### Contextos

- `contexts/NetworkContext.tsx`: Context principal para manejo de configuración de red
- `contexts/AuthContext.tsx`: Actualizado para usar URLs dinámicas

### Componentes

- `app/page.tsx`: Actualizado para usar URLs dinámicas de MediaMTX
- `hooks/useAuth.tsx`: Actualizado para usar URLs dinámicas de login
- `components/ConfigGenerator.tsx`: Nuevo componente para regenerar configuración

### APIs

- `app/api/get-ip/route.ts`: Endpoint para obtener IP del cliente
- `app/api/generate-mediamtx-config/route.ts`: Endpoint para generar configuración MediaMTX

### Configuración MediaMTX

- `mediamtx/mediamtx.template.yml`: Plantilla de configuración
- `mediamtx/generate-config.js`: Script Node.js para generar configuración
- `mediamtx/generate-config.sh`: Script Bash alternativo

## Uso

### Desarrollo

```bash
npm run dev
```

La configuración se genera automáticamente al iniciar.

### Producción

```bash
npm run build
npm start
```

### Generar configuración manualmente

```bash
# Detectar IP automáticamente
npm run generate-config

# Especificar IP manualmente
npm run generate-config:ip 192.168.10.114
```

### Desde la interfaz web

Usar el componente `ConfigGenerator` para regenerar la configuración dinámicamente.

## Estructura de Archivos

```
/
├── contexts/
│   └── NetworkContext.tsx          # Context de red dinámico
├── app/
│   ├── api/
│   │   ├── get-ip/route.ts        # API detección IP
│   │   └── generate-mediamtx-config/route.ts  # API gen. config
│   ├── page.tsx                    # Página principal (URLs dinámicas)
│   └── providers.tsx              # Providers actualizados
├── components/
│   └── ConfigGenerator.tsx        # Componente config. dinámica
├── hooks/
│   └── useAuth.tsx                # Auth con URLs dinámicas
├── mediamtx/
│   ├── mediamtx.template.yml      # Plantilla configuración
│   ├── mediamtx.yml              # Configuración generada
│   ├── generate-config.js        # Script Node.js
│   └── generate-config.sh        # Script Bash
└── package.json                   # Scripts actualizados
```

## Logs y Debugging

Para verificar qué configuración se está usando:

1. Abrir Developer Tools del navegador
2. Revisar localStorage para ver las URLs detectadas:
   - `baseURL`
   - `loginURL`
   - `redirectURL`
   - `mediaMTXBaseURL`
   - `clientIP`
   - `targetAddress`

## Troubleshooting

### La aplicación no detecta la IP correctamente

1. Verificar que se está accediendo desde la URL correcta (no localhost en producción)
2. Usar el componente `ConfigGenerator` para regenerar configuración
3. Limpiar localStorage y recargar la página

### Las cámaras no cargan

1. Verificar que la IP de las cámaras esté configurada correctamente en el script
2. Regenerar la configuración de MediaMTX
3. Reiniciar el servidor MediaMTX

### Errores de CORS

Verificar que MediaMTX esté configurado con:

```yaml
hlsAllowOrigin: "*"
webrtcAllowOrigin: "*"
```

## Cómo Ejecutar el Proyecto Completo

### Paso 1: Preparar el Entorno

1. **Instalar dependencias de Node.js:**

   ```bash
   npm install
   ```

2. **Generar configuración inicial de MediaMTX:**
   ```bash
   npm run generate-config
   ```

### Paso 2: Iniciar MediaMTX (Servidor de Streaming)

1. **Abrir una terminal separada** y navegar al directorio de MediaMTX:

   ```bash
   cd mediamtx
   ```

2. **Ejecutar MediaMTX:**

   ```bash
   # En Windows
   ./mediamtx.exe

   # En Linux/Mac
   ./mediamtx
   ```

3. **Verificar que MediaMTX esté funcionando:**
   - Deberías ver logs indicando que los servidores HLS, RTSP y WebRTC están activos
   - Por defecto escucha en:
     - HLS: puerto 8888
     - RTSP: puerto 8554
     - WebRTC: puerto 8889

### Paso 3: Iniciar la Aplicación Web

1. **En otra terminal**, desde la raíz del proyecto:

   ```bash
   npm run dev
   ```

2. **La aplicación estará disponible en:**
   - Desarrollo: http://localhost:3001
   - Producción VPN: http://192.168.10.114:3001
   - Producción Local: http://192.168.20.150:3001

### Paso 4: Verificar Funcionamiento

1. **Verificar streams de cámaras:**

   - Navegar a la aplicación web
   - Las 4 cámaras deberían aparecer en la interfaz
   - URLs de streams: `http://[IP_MEDIAMTX]:8888/cam[1-4]/index.m3u8`

2. **Verificar detección de red:**
   - Abrir Developer Tools (F12)
   - Revisar localStorage para confirmar IPs detectadas
   - Verificar que no hay errores en consola

### Comandos Rápidos

#### Inicio Completo del Sistema

```bash
# Terminal 1: MediaMTX
cd mediamtx && ./mediamtx.exe

# Terminal 2: Aplicación Web
npm run dev
```

#### Regenerar Configuración para Nueva Red

```bash
# Detectar automáticamente
npm run generate-config

# Especificar IP manualmente
npm run generate-config:ip 192.168.10.114

# Reiniciar MediaMTX después de regenerar config
```

#### Producción

```bash
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Orden de Ejecución Recomendado

1. **Primero:** Generar configuración MediaMTX
2. **Segundo:** Iniciar MediaMTX
3. **Tercero:** Iniciar aplicación web
4. **Cuarto:** Acceder desde el navegador

### Estados de los Servicios

| **Servicio**    | **Puerto** | **URL de verificación**               |
| --------------- | ---------- | ------------------------------------- |
| Aplicación Web  | 3001       | http://localhost:3001                 |
| MediaMTX HLS    | 8888       | http://localhost:8888/cam1/index.m3u8 |
| MediaMTX RTSP   | 8554       | rtsp://localhost:8554/cam1            |
| MediaMTX WebRTC | 8889       | http://localhost:8889                 |

### Notas Importantes

- **MediaMTX debe iniciarse ANTES que la aplicación web**
- **La configuración se regenera automáticamente** al ejecutar `npm run dev`
- **Para cambios de red**, regenerar configuración y reiniciar MediaMTX
- **Las cámaras deben estar accesibles** en las IPs configuradas en el template
