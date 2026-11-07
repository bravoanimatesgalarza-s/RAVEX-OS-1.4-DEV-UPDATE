# RAVEX OS 0.5

**RAVEX OS** es una experiencia de escritorio para Windows creada con Electron y Chromium. No reemplaza Windows ni es una distribución Linux: se instala y se ejecuta como una aplicación normal de Windows.

## Aplicaciones incluidas

- Launchpad
- RAVEX Explorer (archivos virtuales de demostración)
- RAVEX Browser (motor Chromium integrado)
- Notas con guardado local
- Ajustes y tema visual

## Requisitos para desarrollar

- Windows 10/11 de 64 bits
- Node.js 22 o compatible
- Conexión a internet para instalar dependencias

## Ejecutar desde el código

```bash
npm install
npm start
```

## Crear el instalador de Windows

```bash
npm install
npm run dist
```

El instalador `.exe` se genera dentro de `dist/`. Está configurado con un asistente NSIS en español, instalación por usuario, selección de carpeta, acceso directo en el escritorio y acceso desde el menú Inicio.

## Publicar en GitHub

1. Crea un repositorio llamado `RAVEX-OS`.
2. Sube el contenido de esta carpeta al repositorio, conservando `.github/workflows/windows.yml`.
3. En GitHub, abre **Actions** y ejecuta **Build RAVEX OS for Windows**.
4. Descarga el artefacto `RAVEX-OS-Windows-Installer`, que contiene el `.exe`.

También puedes crear un tag como `v0.5.0` para iniciar el flujo de compilación.

## Importante

- El usuario final de Windows no necesita instalar Linux ni abrir una terminal: recibirá un instalador `.exe` cuando se compile el proyecto.
- Para desarrollar o compilar localmente sí se necesita Node.js.
- El navegador usa Chromium integrado en Electron.
- Explorer todavía usa archivos de demostración guardados en el almacenamiento local. Aún no gestiona libremente el disco real de Windows.
- Esta versión no es un sistema operativo arrancable desde USB ni reemplaza Windows; es una aplicación de escritorio con una interfaz inspirada en un sistema operativo.
