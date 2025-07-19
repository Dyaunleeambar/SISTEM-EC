# Sistema de Estimulación de Colaboradores

## Criterios de Validación

**Días de Presencia**

Directivas para el cálculo del campo (Días de Presencia):

1. **Sin fechas de salida ni entrada:**
   - Presente todo el mes → días = total del mes.
2. **Solo fecha de salida:**
   - Presente desde el primer día del mes hasta la fecha de salida (inclusive). Si la salida es antes del mes, días = '-'. Si la salida es después del mes, días = total del mes.
   - Si la fecha de salida es el primer día del mes, días = 1.
3. **Solo fecha de entrada:**
   - Presente desde la fecha de entrada (inclusive) hasta el último día del mes. Si la entrada es después del mes, días = '-'. Si la entrada es antes del mes, días = total del mes.
4. **Ambas fechas:**
   - Presente desde el inicio del mes hasta la fecha de salida (inclusive) más presente desde la fecha de entrada (inclusive) hasta el último día del mes. Si ninguna fecha cae dentro del mes, días = '-'.
   - Si la fecha de salida es el primer día del mes, ese día cuenta como 1.
5. **Fechas fuera del mes:**
   - Si ninguna fecha cae dentro del mes, días = '-'.

> **Nota:** El cálculo es robusto ante formatos y zonas horarias, y siempre refleja fielmente los días reales de presencia en el país durante el mes de conciliación.

---

## Opinión y Sugerencias

- Los criterios son claros y prácticos, permitiendo una gestión transparente y flexible de los estados de los colaboradores.
- Recomiendo mostrar en la tabla el número de días de permanencia para mayor transparencia en la estimulación.
- **Considera agregar mensajes o tooltips explicativos en la interfaz para que los usuarios comprendan los criterios.**
- Valida en el frontend que las fechas sean coherentes (por ejemplo, la fecha de entrada no puede ser posterior a la fecha de salida).

---

## Funcionalidades principales

- **Agregar colaboradores** manualmente mediante un formulario.
- **Visualizar y editar** fechas de salida y entrada directamente en la tabla.
- **Cálculo automático** de estimulación, vacaciones y fin de misión según las reglas de negocio.
- **Filtrado y contadores** por ubicación y estado.
- **Exportar datos** a Excel.
- **Limpiar la base de datos** para reiniciar la carga de colaboradores.
- **Sincronización automática** con el backend tras cada cambio.
- **Mensajes de éxito y error** en la interfaz.

## Flujo de uso

1. **Seleccionar mes de conciliación**
   - El input de mes de conciliación es obligatorio para habilitar la edición de la tabla y los formularios.
   - Al seleccionar o cambiar el mes, la tabla se regenera automáticamente y los campos de edición y botones se habilitan según las reglas.

2. **Agregar colaborador**
   - Completa el formulario con los datos requeridos.
   - Haz clic en "Agregar" para guardar el colaborador.

3. **Visualización y edición**
   - Los colaboradores se muestran en una tabla editable.
   - Puedes modificar fechas de salida y entrada.
   - **El campo de fecha de entrada está deshabilitado hasta que se establezca la fecha de salida para cada colaborador.**
   - Los campos de estimulación, vacaciones y fin de misión se recalculan automáticamente.

4. **Filtrado y contadores**
   - Puedes filtrar por ubicación usando los botones generados.
   - Los contadores se actualizan en tiempo real.

5. **Exportar a Excel**
   - Haz clic en "Exportar a Excel" para descargar los datos actuales.

6. **Limpiar base de datos**
   - Haz clic en "Limpiar Base de Datos" para borrar todos los colaboradores y volver a habilitar la carga manual.

## Consideraciones técnicas

- El backend debe estar corriendo en `http://localhost:3001`.
- Los datos se sincronizan automáticamente tras cada cambio.
- El sistema valida que la fecha de entrada no sea anterior a la fecha de salida y muestra mensajes de error en caso de incoherencias.
- **Los campos de edición y los botones de la tabla solo se habilitan cuando se selecciona el mes de conciliación.**
- **El campo de fecha de entrada está deshabilitado hasta que se establezca la fecha de salida para cada colaborador.**
- Al cambiar el mes de conciliación, la tabla se regenera automáticamente para reflejar el estado correcto de los campos.

## Estructura de archivos relevante

- `index.html`: Contiene la estructura de la interfaz y los elementos con los IDs requeridos.
- `styles.css`: Estilos visuales de la aplicación.
- `app.js`: Lógica principal del frontend.
- `server.js`: Backend para almacenar y servir los datos de colaboradores.

## Requisitos

- Node.js y npm instalados.
- Backend corriendo (`node server.js` o el comando correspondiente).
- Navegador moderno.

## Instalación y ejecución

1. Clona el repositorio.
2. Instala dependencias y ejecuta el backend.
3. Abre `index.html` en tu navegador.

## Notas

- Si ves algún error en consola, revisa que los IDs en el HTML coincidan con los usados en el JS y que el backend esté activo.

---

**¡Listo para usar!**
