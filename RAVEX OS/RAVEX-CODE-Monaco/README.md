# RAVEX CODE — Monaco Edition

Proyecto web con **Monaco Editor real**, el motor de edición usado por Visual Studio Code.

## Requisitos
- Node.js 20.19+ o 22.12+
- npm

## Ejecutar
1. Extrae el ZIP.
2. Abre una terminal dentro de la carpeta `RAVEX-CODE-Monaco`.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.
5. Abre la dirección local que Vite indique (normalmente http://localhost:5173).

## Crear versión de producción
Ejecuta `npm run build`. El resultado queda en `dist`.

## Incluye
- Monaco Editor real y resaltado de HTML, CSS y JavaScript.
- Explorador con archivos de ejemplo.
- Panel lateral Code Helper con respuestas simuladas.
- Propuestas de cambios que requieren tu aprobación.
- Vista previa HTML/CSS/JS en un iframe con sandbox.

## Limitaciones de esta versión
Code Helper todavía no está conectado a una IA real. Los archivos son ejemplos en memoria y no tienen guardado permanente ni cuentas. `hello.au` es una muestra de texto: aún no incluye intérprete Aurora.

Monaco se instala como dependencia npm. No necesitas una cuenta de GitHub ni pagar GitHub Copilot para utilizarlo.
