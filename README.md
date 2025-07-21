# Sistema de Estimulación de Colaboradores

## Descripción General

Sistema web para la gestión y estimulación de colaboradores según su presencia en el país durante un mes de conciliación. Permite agregar, editar, filtrar y exportar datos de colaboradores, calculando automáticamente derechos a estimulación, vacaciones y fin de misión según reglas de negocio.

---

## Criterios de Validación

**Estimulación**
- Un colaborador tiene derecho a estimulación si el campo "Días de Presencia" es mayor o igual a 15 en el mes de conciliación.
- Si los días de presencia son menores a 15, no tiene derecho a estimulación.
- Si el campo de días de presencia es '-' o no es un número, no tiene derecho a estimulación.

> **Nota:** El cálculo es robusto ante formatos y zonas horarias, y siempre refleja fielmente los días reales de presencia en el país durante el mes de conciliación.

---

## Funcionalidades principales

- **Agregar colaboradores** manualmente mediante un formulario.
- **Visualizar y editar** fechas de salida y entrada directamente en la tabla.
- **Cálculo automático** de estimulación, vacaciones y fin de misión según las reglas de negocio.
- **Filtrado y contadores** por ubicación y estado, con botones dinámicos y contadores en tiempo real.
- **Exportar datos a Excel**:
  - Opción de exportar toda la base de datos o solo los datos visibles (filtrados) mediante un modal interactivo.
- **Limpiar la base de datos** para reiniciar la carga de colaboradores.
- **Sincronización automática** con el backend tras cada cambio.
- **Mensajes de éxito y error** en la interfaz.
- **Codificación visual por colores** en la tabla:
  - Celdas con valor "Sí": Color de fondo verde claro (#cadfcb)
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
   - **No se puede marcar 'Fin de Misión' si existe una fecha de entrada o si la fecha de salida está vacía o es futura.**

4. **Filtrado y contadores**
   - Puedes filtrar por ubicación usando los botones generados dinámicamente.
   - Los contadores generales y por estado se actualizan en tiempo real.

5. **Exportar a Excel**
   - Haz clic en "Exportar a Excel" para abrir un modal y elegir entre exportar toda la base de datos o solo los datos visibles en la tabla.

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
- **Codificación visual automática**: Las celdas de la tabla se colorean automáticamente según su valor ("Sí" en verde, "No" en rojo).
- El mes de conciliación no puede ser mayor al mes actual. Si el usuario intenta seleccionar un mes futuro, el sistema muestra un mensaje de error y no permite la selección.
- No se puede marcar 'Fin de Misión' si existe una fecha de entrada para el colaborador, ya que esto contradice el concepto de fin de misión. El sistema muestra un mensaje de error y no permite marcar el checkbox en ese caso.
- **Contadores y filtros dinámicos**: El sistema muestra contadores generales y por estado/ubicación, y permite filtrar la tabla dinámicamente.
- **Exportación avanzada**: El usuario puede elegir exportar toda la base de datos o solo los datos filtrados/visibles mediante un modal.
- **Backend Express + MySQL**: El backend crea automáticamente la base de datos y la tabla si no existen, y expone endpoints REST para CRUD de colaboradores.
- **Dependencia SQLite3**: Está incluida en `package.json` pero no se utiliza actualmente.

## Estructura de archivos relevante

- `index.html`: Estructura de la interfaz y elementos con los IDs requeridos.
- `styles.css`: Estilos visuales de la aplicación, incluyendo los colores para la codificación visual de celdas.
- `app.js`: Lógica principal del frontend, manejo de eventos, validaciones, filtros, exportación, etc.
- `server.js`: Backend Express para almacenar y servir los datos de colaboradores, con creación automática de la base de datos y tabla.

## Requisitos

- Node.js y npm instalados.
- Backend corriendo (`node server.js`).
- Navegador moderno.
- MySQL corriendo en localhost (usuario: root, password: Cuba123456, base: colaboradores_db).

## Instalación y ejecución

1. Clona el repositorio.
2. Instala dependencias con `npm install`.
3. Ejecuta el backend con `node server.js`.
4. Abre `index.html` en tu navegador.

## Notas

- Si ves algún error en consola, revisa que los IDs en el HTML coincidan con los usados en el JS y que el backend esté activo.
- Los colores de las celdas se aplican automáticamente cada vez que se actualiza la tabla.
- El backend crea la base de datos y la tabla automáticamente si no existen.
- La exportación a Excel permite elegir entre toda la base o solo los datos filtrados.

---

**¡Listo para usar!**
