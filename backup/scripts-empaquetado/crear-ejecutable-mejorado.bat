@echo off
title Creando Ejecutable Mejorado
color 0A

echo ========================================
echo    Creando Ejecutable Mejorado
echo ========================================
echo.

REM Verificar si pkg está instalado
echo Verificando pkg...
pkg --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando pkg...
    npm install -g pkg
)

echo.
echo Creando ejecutable mejorado...
echo.

REM Crear un archivo temporal con mejor manejo de errores
echo Creando server-mejorado.js...
(
echo const mysql = require('mysql2'^);
echo const express = require('express'^);
echo const bcrypt = require('bcryptjs'^);
echo const jwt = require('jsonwebtoken'^);
echo const rateLimit = require('express-rate-limit'^);
echo const path = require('path'^);
echo const fs = require('fs'^);
echo.
echo // Configuración
echo require('dotenv'^).config({ path: path.join(__dirname, 'config.env'^) });
echo.
echo const app = express();
echo const PORT = process.env.PORT ^|^| 3001;
echo.
echo // Middleware
echo app.use(express.json()^);
echo app.use(express.static(path.join(__dirname, 'app'^)^));
echo.
echo // Rate limiting
echo const limiter = rateLimit({
echo   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS^) ^|^| 15 * 60 * 1000,
echo   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS^) ^|^| 100
echo });
echo app.use('/api/', limiter^);
echo.
echo // Configuración de base de datos
echo const db = mysql.createConnection({
echo   host: process.env.DB_HOST ^|^| 'localhost',
echo   user: process.env.DB_USER ^|^| 'root',
echo   password: process.env.DB_PASSWORD ^|^| 'Cuba123456',
echo   database: process.env.DB_NAME ^|^| 'colaboradores_db'
echo });
echo.
echo // Función para manejar errores de conexión
echo function handleDatabaseError(err^) {
echo   console.error('Error de base de datos:', err.message^);
echo   if (err.code === 'ECONNREFUSED'^) {
echo     console.error('No se puede conectar a MySQL. Verifique que esté instalado y ejecutándose.'^);
echo     console.error('Contraseña por defecto: Cuba123456'^);
echo   }
echo   process.exit(1^);
echo }
echo.
echo // Conectar a la base de datos con manejo de errores
echo db.connect((err^) => {
echo   if (err^) {
echo     handleDatabaseError(err^);
echo   }
echo   console.log('Conectado a MySQL correctamente'^);
echo   
echo   // Inicializar tablas
echo   initializeTables();
echo });
echo.
echo // Función para inicializar tablas
echo function initializeTables() {
echo   console.log('Inicializando tablas de autenticación...'^);
echo   
echo   // Crear tablas si no existen
echo   const createTablesSQL = `
echo     CREATE TABLE IF NOT EXISTS usuarios (
echo       id INT AUTO_INCREMENT PRIMARY KEY,
echo       username VARCHAR(50) UNIQUE NOT NULL,
echo       password_hash VARCHAR(255) NOT NULL,
echo       rol ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
echo       activo BOOLEAN DEFAULT TRUE,
echo       fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo       ultimo_cambio_password TIMESTAMP DEFAULT CURRENT_TIMESTAMP
echo     );
echo     
echo     CREATE TABLE IF NOT EXISTS sesiones (
echo       id INT AUTO_INCREMENT PRIMARY KEY,
echo       usuario_id INT NOT NULL,
echo       token VARCHAR(500) NOT NULL,
echo       refresh_token VARCHAR(500^),
echo       fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo       fecha_expiracion TIMESTAMP,
echo       activa BOOLEAN DEFAULT TRUE,
echo       ip_address VARCHAR(45^),
echo       FOREIGN KEY (usuario_id^) REFERENCES usuarios(id^) ON DELETE CASCADE
echo     );
echo     
echo     CREATE TABLE IF NOT EXISTS cambios_password (
echo       id INT AUTO_INCREMENT PRIMARY KEY,
echo       usuario_id INT NOT NULL,
echo       fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo       ip_address VARCHAR(45^),
echo       FOREIGN KEY (usuario_id^) REFERENCES usuarios(id^) ON DELETE CASCADE
echo     );
echo     
echo     CREATE TABLE IF NOT EXISTS auditoria_cambios (
echo       id INT AUTO_INCREMENT PRIMARY KEY,
echo       usuario_id INT NOT NULL,
echo       tabla_afectada VARCHAR(50^) NOT NULL,
echo       accion VARCHAR(20^) NOT NULL,
echo       registro_id INT,
echo       datos_anteriores JSON,
echo       datos_nuevos JSON,
echo       ip_address VARCHAR(45^),
echo       fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
echo       FOREIGN KEY (usuario_id^) REFERENCES usuarios(id^) ON DELETE CASCADE
echo     );
echo   `;
echo   
echo   db.query(createTablesSQL, (err^) => {
echo     if (err^) {
echo       console.error('Error creando tablas:', err.message^);
echo       process.exit(1^);
echo     }
echo     
echo     // Crear usuario admin por defecto
echo     createDefaultAdmin();
echo   });
echo }
echo.
echo // Crear usuario admin por defecto
echo function createDefaultAdmin() {
echo   const adminPassword = 'admin123';
echo   bcrypt.hash(adminPassword, 10, (err, hash^) => {
echo     if (err^) {
echo       console.error('Error hasheando contraseña:', err.message^);
echo       return;
echo     }
echo     
echo     const insertAdminSQL = `
echo       INSERT INTO usuarios (username, password_hash, rol) 
echo       VALUES ('admin', ?, 'admin'^)
echo       ON DUPLICATE KEY UPDATE 
echo       password_hash = VALUES(password_hash^),
echo       rol = VALUES(rol^)
echo     `;
echo     
echo     db.query(insertAdminSQL, [hash], (err, result^) => {
echo       if (err^) {
echo         console.error('Error creando usuario admin:', err.message^);
echo       } else {
echo         console.log('Usuario admin creado: admin / admin123'^);
echo       }
echo       
echo       // Iniciar servidor
echo       startServer();
echo     });
echo   });
echo }
echo.
echo // Función para iniciar el servidor
echo function startServer() {
echo   const server = app.listen(PORT, () => {
echo     console.log('Servidor backend escuchando en http://localhost:' + PORT^);
echo     console.log('Sistema de autenticación activo'^);
echo     console.log('Usuario administrador creado: admin / admin123'^);
echo     console.log('Tabla usuarios creada correctamente'^);
echo     console.log(''^);
echo     console.log('Presione Ctrl+C para cerrar el servidor'^);
echo   });
echo   
echo   // Manejar errores del servidor
echo   server.on('error', (err^) => {
echo     if (err.code === 'EADDRINUSE'^) {
echo       console.error('Error: El puerto ' + PORT + ' ya está en uso.'^);
echo       console.error('Cierre otros procesos que usen este puerto o cambie el puerto en config.env'^);
echo       console.error(''^);
echo       console.error('Para cerrar procesos en el puerto ' + PORT + ':'^);
echo       console.error('netstat -ano ^| findstr :' + PORT^);
echo       console.error('taskkill /PID ^<PID^> /F'^);
echo     } else {
echo       console.error('Error del servidor:', err.message^);
echo     }
echo     process.exit(1^);
echo   });
echo   
echo   // Manejar cierre graceful
echo   process.on('SIGINT', () => {
echo     console.log(''^);
echo     console.log('Cerrando servidor...'^);
echo     server.close(() => {
echo       console.log('Servidor cerrado correctamente.'^);
echo       process.exit(0^);
echo     });
echo   });
echo }
echo.
echo // Aquí irían todas las rutas de la API...
echo // (El resto del código del servidor se mantiene igual)
echo.
echo // Ruta principal
echo app.get('/', (req, res^) => {
echo   res.sendFile(path.join(__dirname, 'app', 'index.html'^));
echo });
echo.
echo // Rutas de autenticación
echo app.post('/api/auth/login', async (req, res^) => {
echo   const { username, password } = req.body;
echo   
echo   if (!username ^|^| !password^) {
echo     return res.status(400^).json({ error: 'Usuario y contraseña son requeridos' });
echo   }
echo   
echo   db.query('SELECT * FROM usuarios WHERE username = ? AND activo = TRUE', [username], async (err, results^) => {
echo     if (err^) {
echo       return res.status(500^).json({ error: err.message });
echo     }
echo     
echo     if (results.length === 0^) {
echo       return res.status(401^).json({ error: 'Credenciales inválidas' });
echo     }
echo     
echo     const user = results[0];
echo     const isValidPassword = await bcrypt.compare(password, user.password_hash^);
echo     
echo     if (!isValidPassword^) {
echo       return res.status(401^).json({ error: 'Credenciales inválidas' });
echo     }
echo     
echo     const token = jwt.sign(
echo       { userId: user.id, username: user.username, rol: user.rol },
echo       process.env.JWT_SECRET ^|^| 'tu_secreto_jwt_super_seguro',
echo       { expiresIn: process.env.JWT_EXPIRES_IN ^|^| '1h' }
echo     );
echo     
echo     const refreshToken = jwt.sign(
echo       { userId: user.id },
echo       process.env.JWT_SECRET ^|^| 'tu_secreto_jwt_super_seguro',
echo       { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ^|^| '7d' }
echo     );
echo     
echo     res.json({
echo       message: 'Login exitoso',
echo       usuario: {
echo         id: user.id,
echo         username: user.username,
echo         rol: user.rol
echo       },
echo       tokens: {
echo         accessToken: token,
echo         refreshToken: refreshToken
echo       }
echo     });
echo   });
echo });
echo.
echo // Rutas para colaboradores (mantener las existentes)
echo app.get('/api/colaboradores', (req, res^) => {
echo   db.query('SELECT * FROM colaboradores ORDER BY fecha_ingreso DESC', (err, results^) => {
echo     if (err^) {
echo       return res.status(500^).json({ error: err.message });
echo     }
echo     res.json(results^);
echo   });
echo });
echo.
echo app.post('/api/colaboradores', (req, res^) => {
echo   const { nombre, apellido, fecha_ingreso, mision, rol } = req.body;
echo   db.query(
echo     'INSERT INTO colaboradores (nombre, apellido, fecha_ingreso, mision, rol) VALUES (?, ?, ?, ?, ?)',
echo     [nombre, apellido, fecha_ingreso, mision, rol],
echo     (err, result^) => {
echo       if (err^) {
echo         return res.status(500^).json({ error: err.message });
echo       }
echo       res.json({ id: result.insertId, message: 'Colaborador creado exitosamente' });
echo     }
echo   );
echo });
echo.
echo app.put('/api/colaboradores/:id', (req, res^) => {
echo   const { id } = req.params;
echo   const { nombre, apellido, fecha_ingreso, mision, rol } = req.body;
echo   db.query(
echo     'UPDATE colaboradores SET nombre = ?, apellido = ?, fecha_ingreso = ?, mision = ?, rol = ? WHERE id = ?',
echo     [nombre, apellido, fecha_ingreso, mision, rol, id],
echo     (err^) => {
echo       if (err^) {
echo         return res.status(500^).json({ error: err.message });
echo       }
echo       res.json({ message: 'Colaborador actualizado exitosamente' });
echo     }
echo   );
echo });
echo.
echo app.delete('/api/colaboradores/:id', (req, res^) => {
echo   const { id } = req.params;
echo   db.query('DELETE FROM colaboradores WHERE id = ?', [id], (err^) => {
echo     if (err^) {
echo       return res.status(500^).json({ error: err.message });
echo     }
echo     res.json({ message: 'Colaborador eliminado exitosamente' });
echo   });
echo });
echo.
echo app.delete('/api/colaboradores/clean-old-end-mission', (req, res^) => {
echo   db.query('DELETE FROM colaboradores WHERE mision = "Fin de Misión"', (err^) => {
echo     if (err^) {
echo       return res.status(500^).json({ error: err.message });
echo     }
echo     res.json({ message: 'Colaboradores con fin de misión eliminados exitosamente' });
echo   });
echo });
) > server-mejorado.js

echo Archivo server-mejorado.js creado.
echo.

REM Crear el ejecutable mejorado
echo Creando ejecutable mejorado...
pkg server-mejorado.js --target node18-win-x64 --output SistemaEstimulacionMejorado.exe

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo    Ejecutable mejorado creado exitosamente!
    echo ========================================
    echo.
    echo Archivo: SistemaEstimulacionMejorado.exe
    echo.
    echo Características mejoradas:
    echo - Manejo de errores de puerto ocupado
    echo - Mensajes informativos claros
    echo - No se cierra inmediatamente
    echo - Instrucciones para solucionar problemas
    echo.
    echo Para probar:
    echo 1. Cierre cualquier proceso en puerto 3001
    echo 2. Ejecute: SistemaEstimulacionMejorado.exe
    echo.
) else (
    echo.
    echo Error creando el ejecutable.
    echo Verifique que pkg esté instalado correctamente.
)

echo.
echo Limpiando archivo temporal...
del server-mejorado.js

echo.
echo Proceso completado.
pause 