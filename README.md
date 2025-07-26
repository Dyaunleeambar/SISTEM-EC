# Sistema de Estimulación de Colaboradores

## Descripción General

Sistema web para la gestión y estimulación de colaboradores según su presencia en el país durante un mes de conciliación. Permite agregar, editar, filtrar y exportar datos de colaboradores, calculando automáticamente derechos a estimulación, vacaciones y fin de misión según reglas de negocio.

## Características Principales

- **Gestión de Colaboradores**
  - Agregar nuevos colaboradores con sus datos personales
  - Editar información existente de manera intuitiva
  - Eliminar colaboradores del sistema
  - Reordenar colaboradores mediante arrastrar y soltar

- **Seguimiento de Presencia**
  - Registro de fechas de salida y entrada del país
  - Cálculo automático de días de presencia
  - Validación de fechas para evitar entradas incorrectas

- **Cálculos Automáticos**
  - Determinación de derecho a estimulación basado en días de presencia
  - Cálculo de estado de vacaciones
  - Gestión de fin de misión

- **Filtrado y Búsqueda**
  - Filtrado por ubicación/estado
  - Búsqueda rápida por nombre
  - Contadores en tiempo real para diferentes estados

- **Exportación de Datos**
  - Exportar a Excel con un solo clic
  - Opciones para exportar todos los datos o solo los filtrados

- **Interfaz Intuitiva**
  - Diseño responsivo
  - Codificación visual por colores
  - Mensajes de retroalimentación claros

## Requisitos del Sistema

- Node.js (v14 o superior)
- MySQL (v5.7 o superior)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd SistemaEstimulación01
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar la base de datos**
   - Asegúrate de tener MySQL en ejecución
   - El sistema creará automáticamente la base de datos y las tablas necesarias
   - Las credenciales por defecto son:
     - Usuario: root
     - Contraseña: Cuba123456
     - Base de datos: colaboradores_db

4. **Iniciar el servidor**
   ```bash
   node server.js
   ```

5. **Abrir la aplicación**
   Abre tu navegador y navega a:
   ```
   http://localhost:3000
   ```

## Uso

1. **Agregar un nuevo colaborador**
   - Completa el formulario en la sección superior
   - Especifica nombre, estado, ubicación y fechas relevantes
   - Haz clic en "Agregar" para guardar

2. **Editar información**
   - Haz clic en el ícono de edición junto al colaborador
   - Modifica los campos necesarios en el modal
   - Guarda los cambios

3. **Filtrar colaboradores**
   - Usa los botones de filtro para ver colaboradores por estado
   - Utiliza la barra de búsqueda para encontrar colaboradores específicos

4. **Exportar datos**
   - Haz clic en el botón "Exportar a Excel"
   - Elige si deseas exportar todos los datos o solo los filtrados
   - Descarga el archivo generado

## Estructura del Proyecto

- `index.html` - Página principal de la aplicación
- `styles.css` - Estilos CSS
- `app.js` - Lógica principal del frontend
- `logic.js` - Funciones auxiliares
- `server.js` - Servidor Node.js/Express
- `package.json` - Dependencias y scripts
- `tests/` - Pruebas unitarias y de integración

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Base de Datos**: MySQL
- **Dependencias Principales**:
  - express: Para el servidor web
  - mysql2: Cliente MySQL para Node.js
  - cors: Para permitir solicitudes entre dominios
  - jest: Para pruebas unitarias
  - supertest: Para pruebas de integración

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Haz commit de tus cambios (`git commit -am 'Añade nueva característica'`)
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para consultas o soporte, por favor contacta al equipo de desarrollo.
- **Tests automáticos:**
  - Tests unitarios para la lógica de negocio (frontend) con Jest (`logic.js`).
  - Tests de integración para la API backend con Jest + Supertest (`server.test.js`).
- **CI/CD:**
  - GitHub Actions ejecuta los tests automáticamente en cada push/pull request.

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
   - **El cambio de 'Fin de Misión' se refleja inmediatamente tras la confirmación del backend, sin necesidad de recargar.**

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
- **Fechas coherentes**: La fecha de entrada no puede ser anterior a la fecha de salida. El mensaje de error es siempre claro y consistente.

## Consideraciones técnicas

- El sistema está optimizado y el código limpio, sin logs de depuración innecesarios ni duplicados.
- **Codificación visual automática:** Las celdas de la tabla se colorean automáticamente según su valor ("Sí" en verde, "No" en naranja).
- El mes de conciliación no puede ser mayor al mes actual. Si el usuario intenta seleccionar un mes futuro, el sistema muestra un mensaje de error y no permite la selección.
- No se puede marcar 'Fin de Misión' si existe una fecha de entrada para el colaborador, ya que esto contradice el concepto de fin de misión. El sistema muestra un mensaje de error y no permite marcar el checkbox en ese caso.
- **Contadores y filtros dinámicos:** El sistema muestra contadores generales y por estado/ubicación, y permite filtrar la tabla dinámicamente.
- **Exportación avanzada:** El usuario puede elegir exportar toda la base de datos o solo los datos filtrados/visibles mediante un modal.
- **Backend Express + MySQL:** El backend crea automáticamente la base de datos y la tabla si no existen, y expone endpoints REST para CRUD de colaboradores.
- **Favicon:** El sistema usa una estrella SVG como favicon.
- **Listeners centralizados:** Todos los listeners de eventos de la tabla están centralizados en `updateTable` para evitar duplicados y fugas de memoria.
- **Tests automáticos:**
  - Tests unitarios en `logic.js` (ver sección de testing).
  - Tests de integración en `server.test.js`.
- **CI/CD:**
  - Workflow de GitHub Actions en `.github/workflows/nodejs.yml`.

## Estructura de archivos relevante

- `index.html`: Estructura de la interfaz y elementos con los IDs requeridos.
- `styles.css`: Estilos visuales de la aplicación, incluyendo los colores para la codificación visual de celdas.
- `app.js`: Lógica principal del frontend, manejo de eventos, validaciones, filtros, exportación, etc.
- `logic.js`: Funciones puras de lógica de negocio, testeables de forma aislada.
- `server.js`: Backend Express para almacenar y servir los datos de colaboradores, con creación automática de la base de datos y tabla.
- `app.test.js`: Tests unitarios para la lógica de negocio (frontend).
- `server.test.js`: Tests de integración para la API backend.
- `.github/workflows/nodejs.yml`: Workflow de GitHub Actions para CI.

## Requisitos

- Node.js y npm instalados.
- Backend corriendo (`node server.js`).
- Navegador moderno.
- MySQL corriendo en localhost (usuario: root, password: Cuba123456, base: colaboradores_db).

## Instalación y ejecución

1. Clona el repositorio.
2. Instala dependencias con `npm install`.
   - Esto generará el directorio `node_modules`, que contiene todas las dependencias necesarias para el backend y los tests.
3. Ejecuta el backend con `node server.js`.
4. Abre `index.html` en tu navegador.

> **Nota:** El directorio `node_modules` no se incluye en el repositorio y se genera automáticamente al instalar las dependencias.

## Testing

### Tests unitarios (frontend)

- Las funciones de lógica de negocio están en `logic.js` y se testean con Jest en `app.test.js`.
- Para correr los tests unitarios:
  ```bash
  npm test
  # o
  npx jest app.test.js
  ```

### Tests de integración (backend)

- Los endpoints principales de la API se testean con Jest + Supertest en `server.test.js`.
- Para correr los tests de integración:
  ```bash
  npx jest server.test.js
  ```

### CI/CD con GitHub Actions

- El workflow `.github/workflows/nodejs.yml` ejecuta automáticamente todos los tests en cada push o pull request a la rama `main`.
- Puedes ver los resultados en la pestaña "Actions" de tu repositorio en GitHub.

## Estructura de la base de datos

La tabla principal es `colaboradores`:

| Campo         | Tipo         | Descripción                                 |
|-------------- |------------- |---------------------------------------------|
| id            | INT          | Identificador autoincremental (PK)          |
| nombre        | VARCHAR(255) | Nombre y apellidos del colaborador          |
| estado        | VARCHAR(255) | Ubicación/estado actual                     |
| fecha_salida  | VARCHAR(20)  | Fecha de salida (YYYY-MM-DD)                |
| fecha_entrada | VARCHAR(20)  | Fecha de entrada (YYYY-MM-DD)               |
| fin_mision    | TINYINT      | 1 = Sí, 0 = No                              |
| ubicacion     | VARCHAR(255) | Ubicación (igual a estado)                  |
| orden         | INT          | Orden personalizado para drag & drop        |

- La base de datos y la tabla se crean automáticamente al iniciar el backend.
- El campo `orden` permite reordenar los colaboradores en la tabla.
- Hay una restricción UNIQUE en (nombre, estado) para evitar duplicados.

## Restauración de backups

- Puedes hacer un backup de la base de datos MySQL usando:
  ```bash
  mysqldump -u root -p colaboradores_db > backup.sql
  ```
- Para restaurar:
  ```bash
  mysql -u root -p colaboradores_db < backup.sql
  ```
- Si usas SQLite3, puedes copiar el archivo `.db` directamente.

---

**¡Listo para usar y mantener!**

---

## Tareas pendientes / Futuras mejoras

- Migrar a un ORM como Sequelize para mayor flexibilidad y mantenibilidad si la lógica de base de datos crece.
- Implementar autenticación y control de acceso si el sistema se expone a internet.
- Agregar paginación y/o virtualización en la tabla y endpoints si el volumen de datos crece.
- Preparar el frontend para internacionalización (i18n) si se usará en otros países.
- Automatizar backups de la base de datos.
- Mejorar el cierre del servidor en los tests de integración para evitar mensajes de Jest sobre handles abiertos.
- Agregar más tests de validación y casos de error en frontend y backend.
