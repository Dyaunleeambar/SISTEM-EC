# 📋 Guía de Usuario - Sistema de Estimulación de Colaboradores

## 🎯 Propósito del Sistema

El **Sistema de Estimulación de Colaboradores** es una aplicación completa diseñada para gestionar y calcular la estimulación de colaboradores basada en su presencia en el país durante un mes de conciliación. El sistema automatiza los cálculos, gestiona usuarios con diferentes niveles de acceso y proporciona una interfaz moderna y fácil de usar.

### 🎯 Objetivos Principales

- **Gestión de Colaboradores**: Registrar, editar y eliminar información de colaboradores
- **Cálculo Automático**: Determinar derecho a estimulación basado en días de presencia
- **Control de Acceso**: Sistema de roles (admin, editor, viewer) con permisos específicos
- **Exportación de Datos**: Generar reportes en Excel para análisis
- **Interfaz Moderna**: Diseño responsivo y atractivo para una mejor experiencia de usuario

## 🚀 Instalación y Configuración

### 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **MySQL** (versión 5.7 o superior)
- **Navegador web moderno** (Chrome, Firefox, Edge, Safari)

### 🔧 Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/SistemaEstimulacion.git
   cd SistemaEstimulacion
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   copy config.env.example config.env
   ```
   
   Editar `config.env` con tus valores:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_NAME=colaboradores_db
   JWT_SECRET=tu_secreto_jwt_muy_seguro_y_largo
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   PASSWORD_EXPIRY_DAYS=30
   MIN_PASSWORD_LENGTH=6
   ```

4. **Configurar la base de datos**
   - Asegúrate de tener MySQL en ejecución
   - El sistema creará automáticamente la base de datos y las tablas necesarias

## 🖥️ Ejecutar la Aplicación

### 🌐 Opción 1: Aplicación Web

```bash
npm start
```

Luego abre tu navegador en: `http://localhost:3001`

### 🖥️ Opción 2: Aplicación de Escritorio (Recomendado)

```bash
npm run electron-dev
```

Esta opción abre la aplicación como una aplicación nativa de escritorio con todas las funcionalidades.

## 👥 Usuarios del Sistema

### 🔐 Credenciales de Acceso

| Rol | Usuario | Contraseña | Permisos |
|-----|---------|------------|----------|
| **Administrador** | `admin` | `admin123` | Acceso total |
| **Editor** | `editor` | `editor123` | Crear y editar |
| **Viewer** | `viewer` | `viewer123` | Solo visualización |

### 📊 Descripción de Roles

#### 🔑 **Administrador**
- ✅ Crear, editar y eliminar colaboradores
- ✅ Crear otros usuarios del sistema
- ✅ Acceso a todas las funcionalidades
- ✅ Gestión completa del sistema

#### ✏️ **Editor**
- ✅ Crear y editar colaboradores
- ✅ Limpiar fin de misión antiguos
- ❌ No puede eliminar colaboradores individuales
- ❌ No puede crear usuarios
- ✅ Acceso a exportación de datos

#### 👁️ **Viewer**
- ✅ Solo puede ver colaboradores
- ❌ No puede crear, editar o eliminar
- ✅ Puede exportar datos
- ✅ Acceso de solo lectura

## 🎯 Lógica de Negocio

### 📅 Cálculo de Estimulación

El sistema calcula automáticamente el derecho a estimulación basado en:

1. **Días de Presencia**: Número de días que el colaborador estuvo en el país
2. **Período de Conciliación**: Mes específico para el cálculo
3. **Estado del Colaborador**: Activo, vacaciones, fin de misión, etc.

### 🧮 Criterios de Cálculo

- **Mínimo 15 días**: Para tener derecho a estimulación
- **Cálculo proporcional**: Basado en días de presencia
- **Validación de fechas**: Evita entradas incorrectas
- **Estados especiales**: Considera vacaciones y fin de misión

### 📊 Estados de Colaboradores

- 🟢 **Activo**: Colaborador en servicio
- 🟡 **Vacaciones**: En período de descanso
- 🔴 **Fin de Misión**: Terminó su servicio
- ⚪ **Inactivo**: No disponible temporalmente

## 🎨 Interfaz de Usuario

### 🔐 Pantalla de Login

1. **Acceder al sistema**
   - Ingresa tu usuario y contraseña
   - Marca "Recordar sesión" si deseas mantener la sesión activa
   - Haz clic en "Iniciar Sesión"

2. **Gestión de sesión**
   - La sesión se mantiene activa según tu configuración
   - Puedes cerrar sesión desde el botón en la parte superior
   - Los tokens se renuevan automáticamente

### 📊 Panel Principal

#### 🎯 **Barra de Navegación**
- **Logo del sistema**: En la esquina superior izquierda
- **Información del usuario**: Nombre y rol actual
- **Botón de cerrar sesión**: En la esquina superior derecha

#### 📈 **Estadísticas en Tiempo Real**
- **Total de colaboradores**: Número total registrado
- **Con derecho a estimulación**: Colaboradores que cumplen criterios
- **Sin derecho**: Colaboradores que no cumplen criterios
- **En vacaciones**: Colaboradores en período de descanso

### 👥 Gestión de Colaboradores

#### ➕ **Agregar Nuevo Colaborador**

1. **Completar formulario superior**
   - **Nombre completo**: Nombre y apellidos
   - **Estado**: Activo, vacaciones, fin de misión, inactivo
   - **Ubicación**: País o región de servicio
   - **Fecha de salida**: Cuándo salió del país
   - **Fecha de entrada**: Cuándo regresó al país

2. **Hacer clic en "Agregar"**
   - El sistema validará los datos
   - Calculará automáticamente los días de presencia
   - Determinará el derecho a estimulación

#### ✏️ **Editar Colaborador**

1. **Localizar el colaborador** en la lista
2. **Hacer clic en el botón "Editar"**
3. **Modificar los datos necesarios**
4. **Guardar cambios**

#### 🗑️ **Eliminar Colaborador** (Solo Admin)

1. **Localizar el colaborador** en la lista
2. **Hacer clic en el botón "Eliminar"**
3. **Confirmar la eliminación**

#### 🔄 **Reordenar Colaboradores**

- **Arrastrar y soltar**: Mover colaboradores en la lista
- **Orden personalizado**: Mantener orden preferido

### 🔍 Filtros y Búsqueda

#### 📍 **Filtro por Estado**
- **Todos**: Mostrar todos los colaboradores
- **Activo**: Solo colaboradores en servicio
- **Vacaciones**: Solo en período de descanso
- **Fin de Misión**: Solo que terminaron servicio
- **Inactivo**: Solo no disponibles

#### 🔎 **Búsqueda por Nombre**
- **Campo de búsqueda**: En la parte superior
- **Búsqueda en tiempo real**: Resultados instantáneos
- **Combinar con filtros**: Búsqueda + filtro de estado

### 📤 Exportación de Datos

#### 📊 **Exportar a Excel**

1. **Seleccionar tipo de exportación**
   - **Todos los datos**: Exportar completa
   - **Datos filtrados**: Solo los visibles actualmente

2. **Hacer clic en "Exportar a Excel"**
   - Se descargará automáticamente
   - Archivo con formato `.xlsx`
   - Incluye todos los datos relevantes

#### 📋 **Información Exportada**
- Datos personales del colaborador
- Fechas de salida y entrada
- Días de presencia calculados
- Estado actual
- Derecho a estimulación
- Fecha de cálculo

### 🧹 Limpieza de Fin de Misión Antiguos

#### 🗑️ **Funcionalidad de Limpieza**

Esta funcionalidad permite eliminar colaboradores que están en "Fin de Misión" y cuya fecha de salida es anterior al mes de conciliación seleccionado.

**Permisos requeridos**: Administrador o Editor

#### 📋 **Proceso de Limpieza**

1. **Seleccionar mes de conciliación**
   - Debe estar seleccionado antes de proceder
   - El sistema validará que el mes sea válido

2. **Hacer clic en "Limpiar Fin de Misión antiguos"**
   - El sistema mostrará un modal con la lista de colaboradores a eliminar
   - Se pueden seleccionar/deseleccionar colaboradores individualmente

3. **Confirmar eliminación**
   - Revisar la lista de colaboradores seleccionados
   - Hacer clic en "Confirmar" para proceder
   - La acción no se puede deshacer

#### ⚠️ **Consideraciones Importantes**
- **Acción irreversible**: Los colaboradores eliminados no se pueden recuperar
- **Validación automática**: Solo se muestran colaboradores que cumplen los criterios
- **Auditoría**: La acción queda registrada en el sistema
- **Permisos**: Solo administradores y editores pueden ejecutar esta función

## 🔧 Funcionalidades Avanzadas

### 🔐 Gestión de Contraseñas

#### 🔄 **Cambio Obligatorio**
- **Cada 30 días**: El sistema requiere cambio de contraseña
- **Notificación automática**: Te avisa cuando debes cambiar
- **Mínimo 6 caracteres**: Requisito de seguridad

#### 🔒 **Requisitos de Seguridad**
- **Longitud mínima**: 6 caracteres
- **Combinación de caracteres**: Letras y números
- **No repetir contraseñas**: Historial de cambios

### 📊 Auditoría del Sistema

#### 📝 **Registro de Actividades**
- **Inicios de sesión**: Cuándo y desde dónde
- **Cambios realizados**: Qué se modificó y cuándo
- **Exportaciones**: Quién exportó datos y cuándo
- **Creación de usuarios**: Nuevos usuarios del sistema

### 🛡️ Seguridad

#### 🔐 **Autenticación JWT**
- **Tokens seguros**: Autenticación robusta
- **Renovación automática**: Sesiones persistentes
- **Rate limiting**: Protección contra abuso

#### 🚫 **Rate Limiting**
- **Máximo 100 requests**: Por ventana de tiempo
- **Ventana de 15 minutos**: Período de control
- **Protección contra spam**: Evita sobrecarga del sistema

## 🎨 Características de la Interfaz

### 🌈 **Diseño Moderno**
- **Gradientes animados**: Fondo atractivo
- **Colores por estado**: Codificación visual
- **Interfaz responsiva**: Se adapta a diferentes pantallas
- **Animaciones suaves**: Transiciones elegantes

### 📱 **Responsividad**
- **Desktop**: Optimizado para pantallas grandes
- **Tablet**: Adaptado para dispositivos medianos
- **Mobile**: Funciona en dispositivos móviles

### 🎯 **Experiencia de Usuario**
- **Navegación intuitiva**: Fácil de usar
- **Feedback visual**: Confirmaciones claras
- **Mensajes de error**: Información útil
- **Carga rápida**: Respuesta inmediata

## 🚨 Solución de Problemas

### ❌ **Problemas Comunes**

#### 🔑 **No puedo iniciar sesión**
- Verificar usuario y contraseña
- Comprobar que la base de datos esté activa
- Revisar configuración en `config.env`

#### 💾 **Error de base de datos**
- Verificar que MySQL esté ejecutándose
- Comprobar credenciales en `config.env`
- Revisar permisos de la base de datos

#### 🌐 **No se conecta al servidor**
- Verificar que el puerto 3001 esté libre
- Comprobar firewall y antivirus
- Revisar logs del servidor

#### 📊 **No se calculan los días correctamente**
- Verificar formato de fechas (YYYY-MM-DD)
- Comprobar que la fecha de entrada sea posterior a la de salida
- Revisar zona horaria del sistema

### 🔧 **Comandos de Diagnóstico**

```bash
# Verificar estado del servidor
npm start

# Verificar logs
tail -f logs/app.log

# Probar conexión a base de datos
node -e "require('./server.js')"

# Verificar dependencias
npm audit
```

## 📞 Soporte Técnico

### 📧 **Contacto**
- **Email**: soporte@sistemaestimulacion.com
- **Teléfono**: +58-xxx-xxx-xxxx
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

### 📋 **Información para Reportes**
- **Versión del sistema**: 1.0.0
- **Navegador utilizado**: Chrome, Firefox, Edge, Safari
- **Sistema operativo**: Windows, macOS, Linux
- **Descripción del problema**: Detalle específico
- **Pasos para reproducir**: Secuencia exacta

## 📚 Recursos Adicionales

### 📖 **Documentación Técnica**
- **README.md**: Documentación del desarrollador
- **API Documentation**: Endpoints del servidor
- **Database Schema**: Estructura de la base de datos

### 🎥 **Videos Tutoriales**
- **Instalación**: Guía paso a paso
- **Primer uso**: Configuración inicial
- **Funcionalidades**: Uso avanzado

### 📊 **Reportes y Estadísticas**
- **Uso del sistema**: Métricas de utilización
- **Rendimiento**: Tiempos de respuesta
- **Errores**: Logs de problemas

---

## 🎯 Conclusión

El **Sistema de Estimulación de Colaboradores** es una herramienta completa y profesional diseñada para simplificar la gestión de colaboradores y automatizar los cálculos de estimulación. Con su interfaz moderna, sistema de roles robusto y funcionalidades avanzadas, proporciona una solución integral para las necesidades de gestión de personal.

### 🚀 **Próximas Mejoras**
- **Notificaciones push**: Alertas en tiempo real
- **Reportes automáticos**: Generación programada
- **Integración con otros sistemas**: APIs externas
- **Aplicación móvil**: Versión para smartphones

---

**© 2025 Sistema de Estimulación de Colaboradores. Todos los derechos reservados.**
