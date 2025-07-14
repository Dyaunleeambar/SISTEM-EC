# Sistema de Evaluación de Estado de Colaboradores

## Descripción
Sistema web para evaluar y gestionar el estado de colaboradores en misiones, incluyendo su derecho a estimulación, estado de vacaciones y fin de misión. La aplicación permite importar datos de colaboradores desde archivos Excel (.xlsx, .xls) y visualizar estadísticas en tiempo real con una interfaz responsive y moderna.

## Funcionalidades Implementadas

### Importación de Datos
- Importación de archivos Excel (.xlsx, .xls)
- Validación de formato de archivo
- Mensajes de éxito/error durante la importación
- Deshabilitación automática del botón de importación cuando no hay archivo seleccionado

### Visualización de Datos
- Tabla dinámica con información de colaboradores
- Campos editables para fechas de salida y entrada
- Indicadores de estado (estimulación, vacaciones, fin de misión)
- Formato de fecha flexible (YYYY-MM-DD, MM/DD/YYYY, ISO)

### Estadísticas y Contadores
- Contadores generales:
  - Total de colaboradores
  - Colaboradores con estimulación
  - Colaboradores en vacaciones
  - Colaboradores en fin de misión
- Contadores por ubicación:
  - Total de colaboradores por estado geográfico
  - Contadores detallados para cada estado
  - Botones dinámicos por estado con totales

### Interfaz de Usuario
- Diseño responsive y adaptable a diferentes tamaños de pantalla
- Tarjetas fijas para estadísticas que permanecen visibles durante el scroll
- Botones intuitivos con estados de hover y deshabilitado
- Mensajes informativos durante la importación de datos

## Reglas de Evaluación

### Estimulación
Un colaborador tiene derecho a estimulación si:
1. Se encuentra en el país
2. No tiene fecha de salida
3. O sale del país después del día 15 del mes

### Vacaciones
Un colaborador está en estado de Vacaciones si:
1. Tiene fecha de salida
2. No está en estado de Fin de Misión

### Fin de Misión
El estado de Fin de Misión se controla mediante un checkbox en la interfaz:
1. **Checkbox desmarcado**: El colaborador no está en Fin de Misión
2. **Checkbox marcado**: El colaborador está en Fin de Misión

Validaciones:
- Se requiere una fecha de salida válida para marcar el checkbox. Una fecha válida debe:
  - Existir (no ser vacía)
  - Ser una fecha válida según JavaScript (formato YYYY-MM-DD)
  - No contener caracteres inválidos
- Si se intenta marcar sin fecha de salida, se mostrará un mensaje de error
- Se deshabilita el input de fecha de entrada cuando se marca el checkbox
- No se puede marcar el checkbox si no hay una fecha de salida registrada

Cuando se marca el checkbox:
- Se deshabilita el input de fecha de entrada
- Se actualiza automáticamente el campo 'Fin de Misión' a 'Sí'
- Se recalcula el estado de estimulación basado en las reglas definidas
- Se actualizan los contadores generales y por ubicación

Cuando se desmarca el checkbox:
- Se habilita nuevamente el input de fecha de entrada
- Se actualiza el campo 'Fin de Misión' a 'No'
- Se recalcula el estado de estimulación
- Se actualizan los contadores

### Vacaciones
Un colaborador está en estado de Vacaciones si:
1. Sale del país
2. Y no tiene término de misión

## Estructura del Proyecto
```
SistemaEstimulación01/
├── index.html        # Archivo principal de la aplicación
├── app.js            # Lógica de la aplicación y manejo de datos
├── styles.css        # Estilos y diseño de la interfaz
├── README.md         # Documentación del proyecto
└── assets/
    └── xlsx.js      # Biblioteca para procesamiento de Excel
```

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript
- XLSX.js v0.18.5 (para procesamiento de archivos Excel)
- Modern CSS Grid y Flexbox para diseño responsive

## Consideraciones Técnicas

### Estructura de Datos
- Cada colaborador debe tener un registro con los siguientes campos:
  - Estado (En país/Salida)
  - Nombre del Colaborador
  - Fecha de Salida
  - Estimulación
  - Fecha de Entrada
  - Vacaciones
  - Fin de Misión

### Validaciones
- Formato de fecha flexible (YYYY-MM-DD, MM/DD/YYYY, ISO)
- Validación de fechas inválidas
- Consistencia en el estado de Fin de Misión
- Validación de estados de estimulación y vacaciones

### Seguridad
- Autenticación de usuarios con permisos de acceso
- Registro de auditoría de cambios
- Protección de datos personales

## Requisitos Técnicos

### Frontend
- [ ] Interfaz web responsive (HTML + CSS)
- [ ] Formulario de registro de colaboradores
- [ ] Tabla de visualización de estados
- [ ] Sistema de búsqueda y filtrado
- [ ] Notificaciones de cambios de estado
- [ ] Manejo de eventos y validaciones (JavaScript)

### Backend
- [ ] Manejo de fechas y tiempos
- [ ] Sistema de caché para consultas frecuentes

### Base de Datos (Excel)
- [ ] Hoja principal de colaboradores
- [ ] Hoja de estados históricos
- [ ] Hoja de auditoría
- [ ] Sistema de respaldo automático
- [ ] Validación de datos
- [ ] Fórmulas para cálculos automáticos
- [ ] Protección de hojas críticas

### Integración
- [ ] Sistema de importación/exportación de datos
- [ ] Sistema de reportes
- [ ] Sistema de notificaciones

## Diseño de Interfaz de Usuario

### Estructura General

#### Diseño Principal
- Layout en tres columnas con tarjetas principales
- Diseño responsive para escritorio y móvil
- Paleta de colores profesional y consistente
- Tipografía legible

#### Tarjeta Central (Importación y Tabla)
- [ ] Área de importación Excel
  - Botón "Importar archivo"
  - Indicador de estado de importación
  - Mensajes de validación
- [ ] Tabla principal de colaboradores
  - Columnas:
    - Estado
    - Nombre del Colaborador
    - Fecha de Salida
    - Estimulación
    - Fecha de Entrada
    - Vacaciones
    - Fin de Misión
  - Filtros por columna
  - Ordenamiento
  - Búsqueda por texto
  - Exportar tabla

#### Tarjeta Izquierda (Contadores Generales)
- [ ] Cantidad Total de Colaboradores
- [ ] Cantidad de Colaboradores con Estímulo
- [ ] Cantidad de Colaboradores en Vacaciones
- [ ] Cantidad de Colaboradores con Fin de Misión

#### Tarjeta Derecha (Contadores por Ubicación)
- [ ] Caracas
  - Total de colaboradores
  - Con estímulo
  - En vacaciones
  - Fin de misión
- [ ] Barinas
  - Total de colaboradores
  - Con estímulo
  - En vacaciones
  - Fin de misión
- [ ] Zulia
  - Total de colaboradores
  - Con estímulo
  - En vacaciones
  - Fin de misión
- [ ] [Otras Ubicaciones]
  - Total de colaboradores
  - Con estímulo
  - En vacaciones
  - Fin de misión

#### Estilo de Tarjetas
- [ ] Diseño card con sombras suaves
- [ ] Iconos representativos
- [ ] Colores consistentes con el estado
- [ ] Actualización automática
- [ ] Animaciones suaves en interacciones

### Componentes Principales

#### Menú Principal
- [ ] Inicio
- [ ] Registro de Colaboradores
- [ ] Consulta de Estados
- [ ] Reportes
- [ ] Configuración

#### Formulario de Registro
- [ ] Campo ID (autogenerado)
- [ ] Nombre completo
- [ ] Estado actual (radio buttons: En país/Salida)
- [ ] Fecha de salida (si aplica)
- [ ] Estado de misión (radio buttons: Activa/Término)
- [ ] Botón Guardar
- [ ] Validaciones en tiempo real

#### Tabla de Consulta
- [ ] Columnas:
  - ID
  - Nombre
  - Estado actual
  - Fecha de salida
  - Estado de misión
  - Estado final (Estimulación/Vacaciones/Fin de Misión)
  - Fecha de actualización
- [ ] Filtros por:
  - Estado actual
  - Estado de misión
  - Estado final
  - Fecha
- [ ] Ordenamiento por columnas
- [ ] Búsqueda por texto

#### Sistema de Notificaciones
- [ ] Mensajes de éxito/error
- [ ] Alertas de cambios de estado
- [ ] Indicadores visuales de estado

#### Estilos
- [ ] Diseño limpio y minimalista
- [ ] Colores:
  - Verde: Estimulación
  - Azul: Vacaciones
  - Rojo: Fin de Misión
  - Gris: En país
- [ ] Iconos intuitivos
- [ ] Animaciones suaves

## Próximos Pasos
1. Diseño de la base de datos
2. Implementación del backend
3. Desarrollo de la interfaz de usuario
4. Pruebas de integración
5. Implementación de sistema de reportes
6. Documentación final
