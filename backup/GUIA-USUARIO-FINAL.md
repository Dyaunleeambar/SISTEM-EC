# 🚀 Guía del Usuario Final - Sistema de Estimulación

## **📋 Instalación Rápida**

### **Paso 1: Ejecutar el Instalador**
1. Haga doble clic en `instalador-completo.bat`
2. Siga las instrucciones en pantalla
3. El instalador verificará y configurará todo automáticamente

### **Paso 2: Crear Acceso Directo**
1. Ejecute `crear-acceso-directo.bat`
2. Se creará un acceso directo en su escritorio
3. También se creará un archivo de instrucciones

## **🎯 Cómo Iniciar la Aplicación**

### **Opción 1: Acceso Directo (Recomendado)**
1. Haga doble clic en `Sistema de Estimulación.bat` en su escritorio
2. Espere a que se abra la aplicación (puede tomar unos segundos)
3. Inicie sesión con las credenciales por defecto

### **Opción 2: Desde la Carpeta del Proyecto**
1. Abra la carpeta del proyecto
2. Haga doble clic en `iniciar-aplicacion.bat`
3. La aplicación se abrirá automáticamente

## **🔐 Credenciales por Defecto**

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Administrador |

## **⚙️ Roles de Usuario**

### **👑 Administrador (admin)**
- ✅ Crear y gestionar usuarios
- ✅ Acceso completo a todas las funciones
- ✅ Panel de configuración del sistema
- ✅ Cambiar contraseñas de usuarios

### **✏️ Editor**
- ✅ Agregar y editar colaboradores
- ✅ Reordenar la lista de colaboradores
- ✅ Exportar datos

### **👁️ Viewer**
- ✅ Ver la lista de colaboradores
- ✅ Filtrar y buscar
- ✅ Solo lectura

## **🎨 Características de la Aplicación**

### **📊 Gestión de Colaboradores**
- ✅ Agregar nuevos colaboradores
- ✅ Editar información existente
- ✅ Reordenar lista con drag & drop
- ✅ Filtros por ubicación y estado
- ✅ Búsqueda avanzada

### **📈 Cálculos Automáticos**
- ✅ Estimulación por días de presencia
- ✅ Evaluación de vacaciones
- ✅ Contadores automáticos
- ✅ Exportación a Excel

### **🔒 Seguridad**
- ✅ Autenticación JWT
- ✅ Timeout por inactividad (5 minutos)
- ✅ Roles de usuario
- ✅ Contraseñas encriptadas

## **🛠️ Solución de Problemas**

### **❌ Error: "Node.js no está instalado"**
**Solución:**
1. Descargue Node.js desde: https://nodejs.org/
2. Instale la versión LTS (Long Term Support)
3. Reinicie su computadora
4. Ejecute el instalador nuevamente

### **❌ Error: "MySQL no está instalado"**
**Solución:**
1. Descargue MySQL desde: https://dev.mysql.com/downloads/
2. Instale MySQL Server
3. Configure la contraseña como: `Cuba123456`
4. Agregue MySQL al PATH del sistema

### **❌ Error: "Puerto 3001 en uso"**
**Solución:**
1. Cierre todas las ventanas de la aplicación
2. Abra el Administrador de tareas
3. Finalice procesos de `node.exe`
4. Intente iniciar la aplicación nuevamente

### **❌ La aplicación no se abre**
**Solución:**
1. Verifique que MySQL esté ejecutándose
2. Asegúrese de que las credenciales en `config.env` sean correctas
3. Ejecute `npm install` para reinstalar dependencias
4. Intente iniciar con `npm run electron-dev`

## **📱 Características de la App de Escritorio**

### **✅ Ventajas:**
- **Instalación nativa** en Windows
- **Acceso directo** desde el escritorio
- **Funciona offline** con base de datos local
- **Mejor rendimiento** que la versión web
- **Interfaz nativa** con menús del sistema
- **Seguridad mejorada** con navegación bloqueada

### **🎯 Funciones Específicas:**
- **Menú nativo** con opciones del sistema
- **Navegación segura** (bloqueo de sitios externos)
- **Gestión de ventanas** optimizada
- **Actualizaciones automáticas** (configurable)

## **📞 Soporte Técnico**

### **Información del Sistema:**
- **Versión:** 1.0.0
- **Plataforma:** Windows 10/11
- **Base de datos:** MySQL 8.0+
- **Framework:** Electron + Node.js

### **Archivos Importantes:**
- `config.env` - Configuración del sistema
- `iniciar-aplicacion.bat` - Script de inicio
- `instalador-completo.bat` - Instalador automático
- `crear-acceso-directo.bat` - Creador de accesos directos

## **🎉 ¡Listo para Usar!**

Su Sistema de Estimulación de Colaboradores está completamente configurado y listo para usar. Disfrute de todas las funcionalidades:

- ✅ **Gestión completa** de colaboradores
- ✅ **Cálculos automáticos** de estimulación
- ✅ **Interfaz moderna** y responsiva
- ✅ **Seguridad robusta** con autenticación
- ✅ **Exportación de datos** a Excel
- ✅ **Filtros avanzados** y búsqueda

¡Que tenga mucho éxito con su sistema! 🚀✨ 
