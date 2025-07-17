# Sistema de Estimulación de Colaboradores

Este sistema permite importar, visualizar, editar y exportar datos de colaboradores desde un archivo Excel, así como limpiar la base de datos para reiniciar el proceso.

## Funcionalidades principales

- **Importar colaboradores** desde un archivo Excel (.xlsx, .xls).
- **Visualizar y editar** fechas de salida y entrada directamente en la tabla.
- **Cálculo automático** de estimulación y vacaciones según las reglas de negocio.
- **Filtrado y contadores** por ubicación y estado.
- **Exportar datos** a Excel.
- **Limpiar la base de datos** para reiniciar la carga de colaboradores.
- **Sincronización automática** con el backend tras cada cambio.
- **Mensajes de éxito y error** en la interfaz.

## Flujo de uso

1. **Importar archivo**
   - Selecciona un archivo Excel válido.
   - El botón "Importar" se habilita.
   - Al importar, tanto el input de archivo como el botón quedan deshabilitados hasta limpiar la base de datos.

2. **Visualización y edición**
   - Los colaboradores se muestran en una tabla editable.
   - Puedes modificar fechas de salida y entrada.
   - Los campos de estimulación y vacaciones se recalculan automáticamente.

3. **Filtrado y contadores**
   - Puedes filtrar por ubicación usando los botones generados.
   - Los contadores se actualizan en tiempo real.

4. **Exportar a Excel**
   - Haz clic en "Exportar a Excel" para descargar los datos actuales.

5. **Limpiar base de datos**
   - Haz clic en "Limpiar Base de Datos" para borrar todos los colaboradores y volver a habilitar la importación.

## Consideraciones técnicas

- El input de archivo y el botón de importar solo se habilitan/deshabilitan en los siguientes casos:
  - **Se habilitan** al limpiar la base de datos.
  - **Se deshabilitan** inmediatamente después de importar.
- No se reactivan tras editar la tabla ni tras otros eventos.
- El backend debe estar corriendo en `http://localhost:3001`.

## Estructura de archivos relevante

- `index.html`: Contiene la estructura de la interfaz y los elementos con los IDs requeridos.
- `app.js`: Lógica principal del frontend, control de importación, edición, exportación y sincronización.
- `server.js` (o similar): Backend para almacenar y servir los datos de colaboradores.

## Requisitos

- Node.js y npm instalados.
- Backend corriendo (`node server.js` o el comando correspondiente).
- Navegador moderno.

## Instalación y ejecución

1. Clona el repositorio.
2. Instala dependencias y ejecuta el backend.
3. Abre `index.html` en tu navegador.

## Notas

- El input de archivo puede parecer habilitado visualmente en algunos navegadores, pero estará realmente deshabilitado y no permitirá seleccionar archivos hasta limpiar la base de datos.
- Si ves algún error en consola, revisa que los IDs en el HTML coincidan con los usados en el JS y que el backend esté activo.

---

**¡Listo para usar!**
