# Sistema de Evaluación de Estado de Colaboradores

## Descripción
Sistema para evaluar y determinar el estado de los colaboradores en una misión, incluyendo su derecho a estimulación, estado de vacaciones o fin de misión.

## Reglas de Evaluación

### Estimulación
Un colaborador tiene derecho a estimulación si:
1. Se encuentra en el país
2. O sale del país después del día 15 del mes

### Fin de Misión
Un colaborador está en estado de Fin de Misión si:
1. Sale del país
2. Y tiene término de misión

### Vacaciones
Un colaborador está en estado de Vacaciones si:
1. Sale del país
2. Y no tiene término de misión

## Flujo de Decisión
1. Verificar si el colaborador está en el país
   - Si SÍ: Tiene derecho a estimulación
   - Si NO: Continuar al paso 2
2. Verificar si el colaborador sale del país
   - Si SÍ: Continuar al paso 3
   - Si NO: No aplica ninguna condición
3. Verificar la fecha de salida
   - Si es después del día 15: Tiene derecho a estimulación
   - Si es antes del día 15: Continuar al paso 4
4. Verificar si es término de misión
   - Si SÍ: Estado Fin de Misión
   - Si NO: Estado Vacaciones

## Consideraciones Técnicas

### Estructura de Datos
- Cada colaborador debe tener un registro con los siguientes campos:
  - ID único del colaborador
  - Nombre completo
  - Estado actual (En país/Salida)
  - Fecha de salida (opcional)
  - Estado de misión (Activa/Término)
  - Estado actual (Estimulación/Vacaciones/Fin de Misión)
  - Fecha de última actualización
  - Historial de cambios

### Validaciones
- Verificar que la fecha de salida no sea anterior a la fecha actual
- Validar que el estado de misión sea consistente con el tipo de salida
- Mantener consistencia en los estados históricos

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
