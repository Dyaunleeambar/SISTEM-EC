# Sistema de Estimulación - Versión de Escritorio

Esta es la versión de escritorio del Sistema de Estimulación de Colaboradores, construida con **Electron** para funcionar como una aplicación nativa en Windows, macOS y Linux.

## 🚀 Características de la Versión de Escritorio

### ✅ **Ventajas de la Aplicación de Escritorio:**
- **Instalación nativa** en el sistema operativo
- **Acceso directo** desde el menú de inicio
- **Funciona offline** (con base de datos local)
- **Mejor rendimiento** que una aplicación web
- **Interfaz nativa** con menús del sistema
- **Actualizaciones automáticas** (configurable)
- **Icono personalizado** en el escritorio

### 🛡️ **Seguridad Mejorada:**
- **Navegación bloqueada** a sitios externos
- **Ventanas emergentes deshabilitadas**
- **Contexto aislado** del sistema
- **Validaciones de seguridad** nativas

## 📋 Requisitos Previos

### **Sistema Operativo:**
- **Windows 10/11** (64-bit)
- **macOS 10.14+** (Mojave o superior)
- **Linux** (Ubuntu 18.04+, CentOS 7+, etc.)

### **Software Requerido:**
- **Node.js 16+** (https://nodejs.org/)
- **MySQL 8.0+** (https://dev.mysql.com/downloads/)
- **Git** (opcional, para clonar el repositorio)

## 🛠️ Instalación y Configuración

### **1. Clonar/Descargar el Proyecto:**
```bash
git clone <url-del-repositorio>
cd SistemaEstimulación01
```

### **2. Instalar Dependencias:**
```bash
npm install
```

### **3. Configurar Base de Datos:**
- Asegúrate de que MySQL esté ejecutándose
- Verifica que las credenciales en `config.env` sean correctas
- El sistema creará automáticamente la base de datos y tablas

### **4. Configurar Variables de Entorno:**
Crea o edita el archivo `config.env`:
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Cuba123456
DB_NAME=colaboradores_db
JWT_SECRET=tu_secreto_jwt_muy_seguro
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PASSWORD_EXPIRY_DAYS=30
MIN_PASSWORD_LENGTH=8
```

## 🚀 Comandos de Desarrollo

### **Desarrollo (con recarga automática):**
```bash
npm run electron-dev
```
Este comando:
- Inicia el servidor backend en puerto 3001
- Espera a que el servidor esté listo
- Abre la aplicación Electron
- Habilita las herramientas de desarrollo

### **Solo Electron (servidor ya ejecutándose):**
```bash
npm run electron
```

### **Solo Servidor Backend:**
```bash
npm start
```

### **Desarrollo con Nodemon:**
```bash
npm run dev
```

## 📦 Construcción de la Aplicación

### **Construir para Windows:**
```bash
npm run build-win
```

### **Construir para macOS:**
```bash
npm run build-mac
```

### **Construir para Linux:**
```bash
npm run build-linux
```

### **Construir para todas las plataformas:**
```bash
npm run build
```

## 📁 Estructura de Archivos de Electron

```
SistemaEstimulación01/
├── electron/
│   ├── main.js          # Proceso principal de Electron
│   └── server.js        # Servidor Express integrado
├── assets/
│   ├── icon.ico         # Icono para Windows
│   ├── icon.icns        # Icono para macOS
│   └── icon.png         # Icono para Linux
├── dist/                # Archivos de distribución (generados)
├── package.json         # Configuración del proyecto
└── config.env           # Variables de entorno
```

## 🎯 Características Específicas de la App de Escritorio

### **Menú Nativo:**
- **Archivo → Salir** (Ctrl+Q / Cmd+Q)
- **Ver → Herramientas de Desarrollo** (F12)
- **Ayuda → Acerca de** (información de la aplicación)

### **Navegación Segura:**
- ✅ Bloqueo de navegación a sitios externos
- ✅ Prevención de ventanas emergentes
- ✅ Aislamiento del contexto web

### **Gestión de Ventanas:**
- ✅ Tamaño mínimo: 1200x800
- ✅ Tamaño inicial: 1400x900
- ✅ Redimensionable y maximizable
- ✅ Icono personalizado

## 🔧 Configuración Avanzada

### **Personalizar el Icono:**
1. Coloca tu icono en la carpeta `assets/`
2. Nombres requeridos:
   - `icon.ico` (Windows)
   - `icon.icns` (macOS)
   - `icon.png` (Linux, 512x512px)

### **Modificar el Tamaño de Ventana:**
Edita `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
    width: 1400,        // Ancho inicial
    height: 900,        // Alto inicial
    minWidth: 1200,     // Ancho mínimo
    minHeight: 800,     // Alto mínimo
    // ... otras opciones
});
```

### **Configurar Actualizaciones Automáticas:**
Agregar en `package.json`:
```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "tu-usuario",
      "repo": "tu-repositorio"
    }
  }
}
```

## 🐛 Solución de Problemas

### **Error: "Cannot find module 'electron'":**
```bash
npm install electron --save-dev
```

### **Error: "Port 3001 already in use":**
```bash
# Cambiar puerto en config.env
PORT=3002
```

### **Error: "MySQL connection failed":**
- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en `config.env`
- Asegúrate de que el usuario tenga permisos

### **La aplicación no se abre:**
```bash
# Verificar logs
npm run electron-dev
# Revisar la consola para errores
```

### **Problemas de construcción:**
```bash
# Limpiar cache
npm run build -- --force
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📊 Comparación: Web vs Escritorio

| Característica | Versión Web | Versión Escritorio |
|----------------|-------------|-------------------|
| **Instalación** | Navegador | Sistema operativo |
| **Acceso** | URL | Menú de inicio |
| **Offline** | ❌ | ✅ |
| **Rendimiento** | Medio | Alto |
| **Seguridad** | Básica | Avanzada |
| **Actualizaciones** | Manual | Automática |
| **Recursos** | Limitados | Nativos |

## 🎉 ¡Listo para Usar!

Tu Sistema de Estimulación ahora está disponible como una aplicación de escritorio nativa con todas las funcionalidades:

- ✅ **Autenticación JWT** con roles
- ✅ **Gestión de colaboradores** completa
- ✅ **Panel de administración** avanzado
- ✅ **Interfaz moderna** y responsiva
- ✅ **Base de datos MySQL** integrada
- ✅ **Seguridad robusta** nativa

¡Disfruta de tu aplicación de escritorio! 🚀✨ 
