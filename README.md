# Sistema de Estimulación de Colaboradores

## Criterios de Validación

**Estimulación**

- Un colaborador tiene derecho a estimulación si el campo "Días de Presencia" es mayor o igual a 15 en el mes de conciliación.
- Si los días de presencia son menores a 15, no tiene derecho a estimulación.
- Si el campo de días de presencia es '-' o no es un número, no tiene derecho a estimulación.

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
- **Codificación visual por colores** en la tabla:
  - Celdas con valor "Si": Color de fondo verde claro (#cadfcb)
  - Celdas con valor "No": Color de fondo rojo claro (#f5b3ac)

## Flujo de uso

1. **Seleccionar mes de conciliación**
   - El input de mes de conciliación es obligatorio para habilitar la edición de la tabla y los formularios.
   - Al seleccionar o cambiar el mes, la tabla se regenera automáticamente y los campos de edición y botones se habilitan según las reglas.
   - **No se puede seleccionar un mes futuro**: El sistema valida que el mes de conciliación no sea mayor al mes actual.

2. **Agregar colaborador**
   - Completa el formulario con los datos requeridos.
   - Haz clic en "Agregar" para guardar el colaborador.

3. **Visualización y edición**
   - Los colaboradores se muestran en una tabla editable con codificación visual por colores.
   - Puedes modificar fechas de salida y entrada.
   - **El campo de fecha de entrada está deshabilitado hasta que se establezca la fecha de salida para cada colaborador.**
   - Los campos de estimulación, vacaciones y fin de misión se recalculan automáticamente.
   - **No se puede marcar 'Fin de Misión' sin haber seleccionado el mes de conciliación.**

4. **Filtrado y contadores**
   - Puedes filtrar por ubicación usando los botones generados.
   - Los contadores se actualizan en tiempo real.

5. **Exportar a Excel**
   - Haz clic en "Exportar a Excel" para descargar los datos actuales.

6. **Limpiar base de datos**
   - Haz clic en "Limpiar Base de Datos" para borrar todos los colaboradores y volver a habilitar la carga manual.

## Validaciones implementadas

- **Mes de conciliación**: No puede ser un mes futuro.
- **Fecha de entrada**: No se puede establecer sin tener una fecha de salida previa.
- **Fin de Misión**: 
  - No se puede marcar si existe una fecha de entrada (contradicción lógica).
  - No se puede marcar sin haber seleccionado el mes de conciliación.
  - No se puede marcar si la fecha de salida está vacía o es futura.
- **Fechas coherentes**: La fecha de entrada no puede ser anterior a la fecha de salida.

## Consideraciones técnicas

- El sistema está optimizado y el código limpio, sin logs de depuración innecesarios.
- **Codificación visual automática**: Las celdas de la tabla se colorean automáticamente según su valor ("Si" en verde, "No" en rojo).
- El mes de conciliación no puede ser mayor al mes actual. Si el usuario intenta seleccionar un mes futuro, el sistema muestra un mensaje de error y no permite la selección.
- No se puede marcar 'Fin de Misión' si existe una fecha de entrada para el colaborador, ya que esto contradice el concepto de fin de misión. El sistema muestra un mensaje de error y no permite marcar el checkbox en ese caso.

## Estructura de archivos relevante

- `index.html`: Contiene la estructura de la interfaz y los elementos con los IDs requeridos.
- `styles.css`: Estilos visuales de la aplicación, incluyendo los colores para la codificación visual de celdas.
- `app.js`: Lógica principal del frontend, incluyendo la función `applySiCellStyles()` para aplicar colores automáticamente.
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
- Los colores de las celdas se aplican automáticamente cada vez que se actualiza la tabla.

---

**¡Listo para usar!**
