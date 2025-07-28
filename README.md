# Sistema de Estimulación de Colaboradores

## Descripción General

Sistema web completo para la gestión y estimulación de colaboradores según su presencia en el país durante un mes de conciliación. Incluye sistema de autenticación JWT con roles de usuario, gestión de colaboradores, cálculos automáticos, filtrado avanzado y exportación de datos.

## Características Principales

### 🔐 Sistema de Autenticación
- **Autenticación JWT** con tokens seguros
- **Sistema de Roles**: admin, editor, viewer con permisos específicos
- **Interfaz de Login** elegante con modal atractivo
- **Sesión Persistente** con opción "Recordar sesión"
- **Cambio de Contraseña** mensual obligatorio
- **Rate Limiting** para prevenir abuso
- **Auditoría Completa** de sesiones y cambios

### 👥 Gestión de Usuarios
- **Usuario Admin**: Acceso total, puede crear otros usuarios
- **Usuario Editor**: Puede crear y editar colaboradores
- **Usuario Viewer**: Solo puede ver y exportar datos
- **Gestión de Sesiones** con tokens de acceso y refresh
- **Historial de Cambios** de contraseña

### 📊 Gestión de Colaboradores
- Agregar nuevos colaboradores con sus datos personales
- Editar información existente de manera intuitiva
- Eliminar colaboradores del sistema (solo admin)
- Reordenar colaboradores mediante arrastrar y soltar

### 📈 Seguimiento de Presencia
- Registro de fechas de salida y entrada del país
- Cálculo automático de días de presencia
- Validación de fechas para evitar entradas incorrectas

### 🧮 Cálculos Automáticos
- Determinación de derecho a estimulación basado en días de presencia
- Cálculo de estado de vacaciones
- Gestión de fin de misión

### 🔍 Filtrado y Búsqueda
- Filtrado por ubicación/estado
- Búsqueda rápida por nombre
- Contadores en tiempo real para diferentes estados

### 📤 Exportación de Datos
- Exportar a Excel con un solo clic
- Opciones para exportar todos los datos o solo los filtrados

### 🎨 Interfaz Moderna
- Diseño responsivo y atractivo
- Codificación visual por colores
- Fondo animado con gradientes
- Modal de login elegante
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

3. **Configurar variables de entorno**
   - Crear archivo `config.env` con las siguientes variables:
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
   MIN_PASSWORD_LENGTH=6
   ```

4. **Configurar la base de datos**
   - Asegúrate de tener MySQL en ejecución
   - El sistema creará automáticamente la base de datos y las tablas necesarias
   - Las credenciales por defecto son:
     - Usuario: root
     - Contraseña: Cuba123456
     - Base de datos: colaboradores_db

5. **Iniciar el servidor**
   ```bash
   node server.js
   ```

6. **Abrir la aplicación**
   Abre tu navegador y navega a:
   ```
   http://localhost:3001
   ```

## Usuarios del Sistema

### Usuarios de Prueba Disponibles:

1. **Administrador** - `admin` / `admin123`
   - Acceso total a todas las funcionalidades
   - Puede crear, editar, eliminar colaboradores
   - Puede crear otros usuarios
   - Gestión completa del sistema

2. **Editor** - `editor` / `editor123`
   - Puede crear y editar colaboradores
   - No puede eliminar colaboradores
   - No puede crear usuarios
   - Acceso a exportación de datos

3. **Viewer** - `viewer` / `viewer123`
   - Solo puede ver colaboradores
   - No puede crear, editar o eliminar
   - Puede exportar datos
   - Acceso de solo lectura

## Uso del Sistema

### 🔐 Autenticación
1. **Iniciar Sesión**
   - Ingresa con tus credenciales en el modal de login
   - Marca "Recordar sesión" si deseas mantener la sesión activa
   - El sistema te redirigirá automáticamente según tu rol

2. **Gestión de Sesión**
   - La sesión se mantiene activa según tu configuración
   - Puedes cerrar sesión desde el botón en la parte superior
   - Los tokens se renuevan automáticamente

3. **Cambio de Contraseña**
   - El sistema te notificará cuando debas cambiar tu contraseña
   - Las contraseñas deben tener al menos 6 caracteres
   - Se requiere cambio mensual por seguridad

### 📊 Gestión de Colaboradores

1. **Agregar un nuevo colaborador**
   - Completa el formulario en la sección superior
   - Especifica nombre, estado, ubicación y fechas relevantes
   - Haz clic en "Agregar" para guardar

2. **Editar información**
   - Haz clic en el ícono de edición junto al colaborador
   - Modifica los campos necesarios en el modal
   - Guarda los cambios

3. **Eliminar colaborador** (solo admin)
   - Haz clic en el ícono de eliminar
   - Confirma la acción

### 🔍 Filtrado y Búsqueda
- Usa los botones de filtro para ver colaboradores por estado
- Utiliza la barra de búsqueda para encontrar colaboradores específicos
- Los contadores se actualizan en tiempo real

### 📤 Exportación de Datos
- Haz clic en el botón "Exportar a Excel"
- Elige si deseas exportar todos los datos o solo los filtrados
- Descarga el archivo generado

## Estructura del Proyecto

- `index.html` - Página principal de la aplicación
- `styles.css` - Estilos CSS con diseño moderno
- `app.js` - Lógica principal del frontend con autenticación
- `logic.js` - Funciones auxiliares
- `server.js` - Servidor Node.js/Express con autenticación JWT
- `config.env` - Variables de entorno y configuración
- `package.json` - Dependencias y scripts
- `tests/` - Pruebas unitarias y de integración

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con animaciones y gradientes
- **JavaScript (ES6+)**: Lógica de aplicación y autenticación

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **MySQL**: Base de datos relacional

### Autenticación y Seguridad
- **JWT (jsonwebtoken)**: Tokens de autenticación
- **bcryptjs**: Hash seguro de contraseñas
- **express-rate-limit**: Protección contra ataques de fuerza bruta
- **dotenv**: Gestión de variables de entorno

### Dependencias Principales
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "express-rate-limit": "^6.10.0",
  "dotenv": "^16.3.1",
  "jest": "^29.5.0",
  "supertest": "^6.3.3"
}
```

## Estructura de la Base de Datos

### Tabla `colaboradores`
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

### Tabla `usuarios`
| Campo                | Tipo         | Descripción                           |
|--------------------- |------------- |---------------------------------------|
| id                   | INT          | Identificador autoincremental (PK)    |
| username             | VARCHAR(50)  | Nombre de usuario único               |
| password_hash        | VARCHAR(255) | Hash de la contraseña                 |
| email                | VARCHAR(100) | Email del usuario                     |
| rol                  | ENUM         | admin, editor, viewer                 |
| fecha_creacion       | TIMESTAMP    | Fecha de creación del usuario         |
| ultimo_login         | TIMESTAMP    | Último acceso al sistema              |
| ultimo_cambio_password| TIMESTAMP    | Último cambio de contraseña           |
| activo               | BOOLEAN      | Estado del usuario (activo/inactivo)  |

### Tabla `sesiones`
| Campo        | Tipo         | Descripción                           |
|------------- |------------- |---------------------------------------|
| id           | INT          | Identificador autoincremental (PK)    |
| usuario_id   | INT          | ID del usuario (FK)                   |
| token        | VARCHAR(500) | Token de sesión                       |
| fecha_inicio | TIMESTAMP    | Fecha de inicio de sesión             |
| fecha_fin    | TIMESTAMP    | Fecha de fin de sesión                |
| activa       | BOOLEAN      | Estado de la sesión                   |

### Tabla `cambios_password`
| Campo        | Tipo         | Descripción                           |
|------------- |------------- |---------------------------------------|
| id           | INT          | Identificador autoincremental (PK)    |
| usuario_id   | INT          | ID del usuario (FK)                   |
| fecha_cambio | TIMESTAMP    | Fecha del cambio                      |
| ip_address   | VARCHAR(45)  | Dirección IP del cambio               |

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/create-user` - Crear usuario (solo admin)

### Colaboradores
- `GET /api/colaboradores` - Obtener todos los colaboradores
- `POST /api/colaboradores` - Crear colaborador
- `PUT /api/colaboradores/:id` - Actualizar colaborador
- `DELETE /api/colaboradores/:id` - Eliminar colaborador

## Seguridad

### Autenticación JWT
- Tokens de acceso con expiración de 24 horas
- Tokens de refresh con expiración de 7 días
- Verificación automática de tokens en cada petición

### Protección de Rutas
- Middleware de autenticación para rutas protegidas
- Verificación de roles para operaciones específicas
- Rate limiting para prevenir ataques

### Hash de Contraseñas
- Uso de bcryptjs con 12 rondas de hash
- Contraseñas nunca se almacenan en texto plano
- Cambio obligatorio cada 30 días

## Testing

### Tests Unitarios (Frontend)
```bash
npm test
# o
npx jest app.test.js
```

### Tests de Integración (Backend)
```bash
npx jest server.test.js
```

### CI/CD
- GitHub Actions ejecuta tests automáticamente
- Workflow en `.github/workflows/nodejs.yml`

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

---

**¡Sistema completo y listo para producción!** 🚀
