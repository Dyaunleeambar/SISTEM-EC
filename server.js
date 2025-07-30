const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './config.env' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// Conexión inicial SIN database
// Se conecta solo al servidor MySQL para crear la base de datos si no existe
const dbInit = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cuba123456'
});

// Crea la base de datos si no existe y luego la tabla y restricciones necesarias
// Toda la inicialización de la base de datos y la tabla ocurre aquí
// Esto permite que el backend sea plug-and-play en un entorno limpio
// También agrega restricciones de unicidad y el campo de orden personalizado

dbInit.query(`CREATE DATABASE IF NOT EXISTS colaboradores_db`, (err) => {
    if (err) throw err;

    // Ahora conecta a la base de datos específica
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Cuba123456',
        database: 'colaboradores_db'
    });

    // Crea la tabla de colaboradores si no existe
    db.query(`
        CREATE TABLE IF NOT EXISTS colaboradores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255),
            estado VARCHAR(255),
            fecha_salida VARCHAR(20),
            fecha_entrada VARCHAR(20),
            fin_mision TINYINT,
            ubicacion VARCHAR(255),
            orden INT DEFAULT 0
        )
    `);

    // Forzar recreación de tablas de autenticación
    console.log('Inicializando tablas de autenticación...');
    
    // Eliminar tablas existentes si hay problemas
    db.query('DROP TABLE IF EXISTS cambios_password', (err) => {
        if (err) console.error('Error eliminando tabla cambios_password:', err);
    });
    
    db.query('DROP TABLE IF EXISTS sesiones', (err) => {
        if (err) console.error('Error eliminando tabla sesiones:', err);
    });
    
    db.query('DROP TABLE IF EXISTS usuarios', (err) => {
        if (err) console.error('Error eliminando tabla usuarios:', err);
    });
    
    // Crear tabla de usuarios
    db.query(`
        CREATE TABLE usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            email VARCHAR(100),
            rol ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ultimo_login TIMESTAMP NULL,
            ultimo_cambio_password TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activo BOOLEAN DEFAULT TRUE,
            INDEX idx_username (username),
            INDEX idx_rol (rol)
        )
    `, (err) => {
        if (err) {
            console.error('Error creando tabla usuarios:', err);
        } else {
            console.log('Tabla usuarios creada correctamente');
        }
    });

    // Crea la tabla de sesiones para auditoría
    db.query(`
        CREATE TABLE IF NOT EXISTS sesiones (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            token_id VARCHAR(255),
            fecha_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fecha_logout TIMESTAMP NULL,
            ip_address VARCHAR(45),
            user_agent TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);

    // Crea la tabla de cambios de contraseña
    db.query(`
        CREATE TABLE IF NOT EXISTS cambios_password (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);
    
    // Crea la tabla de auditoría de cambios
    db.query(`
        CREATE TABLE IF NOT EXISTS auditoria_cambios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            tabla_afectada VARCHAR(50) NOT NULL,
            accion VARCHAR(20) NOT NULL,
            registro_id INT,
            datos_anteriores JSON,
            datos_nuevos JSON,
            ip_address VARCHAR(45),
            fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
        )
    `);

    // Agrega restricción UNIQUE a (nombre, estado) para evitar duplicados
    db.query(
        `ALTER TABLE colaboradores ADD CONSTRAINT unique_nombre_estado UNIQUE (nombre, estado)`,
        (err) => {
            if (err && err.code !== 'ER_DUP_KEYNAME' && !/Duplicate.*unique_nombre_estado/.test(err.message)) {
                // Solo loguea si el error no es por existencia previa
                console.error('Error añadiendo restricción UNIQUE:', err.message);
            }
        }
    );

    // ===== FUNCIONES DE AUTENTICACIÓN =====
    
    // Función para crear un usuario administrador por defecto
    function crearUsuarioAdmin() {
        const adminPassword = 'admin123'; // Contraseña temporal
        bcrypt.hash(adminPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12).then(hash => {
            db.query(
                `INSERT IGNORE INTO usuarios (username, password_hash, email, rol) 
                 VALUES (?, ?, ?, ?)`,
                ['admin', hash, 'admin@sistema.com', 'admin'],
                (err, result) => {
                    if (err) {
                        console.error('Error creando usuario admin:', err);
                    } else if (result.affectedRows > 0) {
                        console.log('Usuario administrador creado: admin / admin123');
                    }
                }
            );
        });
    }

    // Crear usuario admin al inicializar
    crearUsuarioAdmin();

    // Middleware para verificar JWT
    function verificarToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }
            req.usuario = decoded;
            next();
        });
    }

    // Middleware para verificar roles
    function verificarRol(roles) {
        return (req, res, next) => {
            if (!req.usuario) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }
            
            if (!roles.includes(req.usuario.rol)) {
                return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
            }
            
            next();
        };
    }

    // Función para registrar auditoría
    function registrarAuditoria(usuarioId, tabla, accion, registroId, datosAnteriores, datosNuevos, ip) {
        db.query(
            `INSERT INTO auditoria_cambios (usuario_id, tabla_afectada, accion, registro_id, datos_anteriores, datos_nuevos, ip_address) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [usuarioId, tabla, accion, registroId, JSON.stringify(datosAnteriores), JSON.stringify(datosNuevos), ip]
        );
    }
    
    // Función para generar tokens
    function generarTokens(usuario) {
        const accessToken = jwt.sign(
            { 
                id: usuario.id, 
                username: usuario.username, 
                rol: usuario.rol 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        const refreshToken = jwt.sign(
            { 
                id: usuario.id, 
                username: usuario.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
        );

        return { accessToken, refreshToken };
    }

    // ===== ENDPOINTS DE AUTENTICACIÓN =====

    // Endpoint: Login
    app.post('/api/auth/login', (req, res) => {
        console.log('Login attempt:', { username: req.body.username, hasPassword: !!req.body.password });
        const { username, password, rememberMe } = req.body;
        
        if (!username || !password) {
            console.log('Login failed: Missing username or password');
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        db.query(
            'SELECT * FROM usuarios WHERE username = ? AND activo = TRUE',
            [username],
            async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length === 0) {
                    console.log('Login failed: User not found:', username);
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }

                const usuario = results[0];
                const passwordValida = await bcrypt.compare(password, usuario.password_hash);
                
                if (!passwordValida) {
                    console.log('Login failed: Invalid password for user:', username);
                    return res.status(401).json({ error: 'Credenciales inválidas' });
                }

                // Verificar si la contraseña ha expirado
                const ultimoCambio = new Date(usuario.ultimo_cambio_password);
                const diasTranscurridos = (new Date() - ultimoCambio) / (1000 * 60 * 60 * 24);
                const diasExpiracion = parseInt(process.env.PASSWORD_EXPIRY_DAYS) || 30;
                
                if (diasTranscurridos > diasExpiracion) {
                    return res.status(401).json({ 
                        error: 'Contraseña expirada. Debe cambiarla.',
                        passwordExpired: true 
                    });
                }

                // Generar tokens
                const tokens = generarTokens(usuario);
                
                // Actualizar último login
                db.query(
                    'UPDATE usuarios SET ultimo_login = CURRENT_TIMESTAMP WHERE id = ?',
                    [usuario.id]
                );

                // Registrar sesión
                const tokenId = jwt.sign({ id: usuario.id, timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1h' });
                db.query(
                    `INSERT INTO sesiones (usuario_id, token_id, ip_address, user_agent) 
                     VALUES (?, ?, ?, ?)`,
                    [usuario.id, tokenId, req.ip, req.headers['user-agent']]
                );

                console.log('Login successful for user:', {
                    id: usuario.id,
                    username: usuario.username,
                    rol: usuario.rol
                });
                
                res.json({
                    message: 'Login exitoso',
                    usuario: {
                        id: usuario.id,
                        username: usuario.username,
                        email: usuario.email,
                        rol: usuario.rol
                    },
                    tokens,
                    passwordExpired: false
                });
            }
        );
    });

    // Endpoint: Logout
    app.post('/api/auth/logout', verificarToken, (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        
        // Marcar sesión como cerrada
        db.query(
            'UPDATE sesiones SET fecha_logout = CURRENT_TIMESTAMP WHERE token_id = ?',
            [token]
        );

        res.json({ message: 'Logout exitoso' });
    });

    // Endpoint: Cambiar contraseña
    app.post('/api/auth/change-password', verificarToken, async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const usuarioId = req.usuario.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
        }

        if (newPassword.length < (parseInt(process.env.MIN_PASSWORD_LENGTH) || 8)) {
            return res.status(400).json({ error: `La contraseña debe tener al menos ${process.env.MIN_PASSWORD_LENGTH || 8} caracteres` });
        }

        // Verificar contraseña actual
        db.query(
            'SELECT password_hash FROM usuarios WHERE id = ?',
            [usuarioId],
            async (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                const passwordValida = await bcrypt.compare(currentPassword, results[0].password_hash);
                if (!passwordValida) {
                    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
                }

                // Hash de nueva contraseña
                const newPasswordHash = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_ROUNDS) || 12);

                // Actualizar contraseña
                db.query(
                    `UPDATE usuarios 
                     SET password_hash = ?, ultimo_cambio_password = CURRENT_TIMESTAMP 
                     WHERE id = ?`,
                    [newPasswordHash, usuarioId],
                    (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        
                        // Registrar cambio de contraseña
                        db.query(
                            'INSERT INTO cambios_password (usuario_id, ip_address) VALUES (?, ?)',
                            [usuarioId, req.ip]
                        );

                        res.json({ message: 'Contraseña actualizada exitosamente' });
                    }
                );
            }
        );
    });

    // Endpoint: Verificar token
    app.get('/api/auth/verify', verificarToken, (req, res) => {
        res.json({
            usuario: {
                id: req.usuario.id,
                username: req.usuario.username,
                rol: req.usuario.rol
            }
        });
    });

    // Endpoint: Crear usuario (solo admin)
    app.post('/api/auth/create-user', verificarToken, verificarRol(['admin']), async (req, res) => {
        const { username, password, email, rol } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
        }

        if (password.length < (parseInt(process.env.MIN_PASSWORD_LENGTH) || 8)) {
            return res.status(400).json({ error: `La contraseña debe tener al menos ${process.env.MIN_PASSWORD_LENGTH || 8} caracteres` });
        }

        try {
            const passwordHash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
            
            db.query(
                `INSERT INTO usuarios (username, password_hash, email, rol) 
                 VALUES (?, ?, ?, ?)`,
                [username, passwordHash, email || null, rol || 'viewer'],
                (err, result) => {
                    if (err) {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({ error: 'El usuario ya existe' });
                        }
                        return res.status(500).json({ error: err.message });
                    }
                    
                    res.json({
                        message: 'Usuario creado exitosamente',
                        usuario: {
                            id: result.insertId,
                            username,
                            email,
                            rol: rol || 'viewer'
                        }
                    });
                }
            );
        } catch (error) {
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    });

    // Endpoint: Obtener lista de usuarios (solo admin)
    app.get('/api/auth/users', verificarToken, verificarRol(['admin']), (req, res) => {
        db.query('SELECT id, username, email, rol, fecha_creacion, ultimo_login, activo FROM usuarios ORDER BY username', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });
    
    // Endpoint: Obtener auditoría de cambios (solo admin)
    app.get('/api/auth/audit', verificarToken, verificarRol(['admin']), (req, res) => {
        const limit = parseInt(req.query.limit) || 50;
        db.query(`
            SELECT ac.*, u.username 
            FROM auditoria_cambios ac 
            JOIN usuarios u ON ac.usuario_id = u.id 
            ORDER BY ac.fecha_cambio DESC 
            LIMIT ?
        `, [limit], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    });

    // ===== ENDPOINTS EXISTENTES (PROTEGIDOS) =====

    // Endpoint: Obtener todos los colaboradores ordenados
    // Devuelve la lista completa de colaboradores, ordenados por el campo personalizado 'orden' y luego por id
    app.get('/api/colaboradores', verificarToken, (req, res) => {
        db.query('SELECT * FROM colaboradores ORDER BY orden ASC, id ASC', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Middleware: Valida que req.body exista y sea un objeto
    // Se usa en los endpoints POST y PUT para evitar peticiones malformadas
    function validateBody(req, res, next) {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Cuerpo de la petición vacío o inválido' });
        }
        next();
    }

    // Endpoint: Agregar un colaborador
    // Valida campos obligatorios y unicidad antes de insertar
    app.post('/api/colaboradores', verificarToken, verificarRol(['admin', 'editor']), validateBody, (req, res) => {
        const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
        if (!nombre || !estado) {
            return res.status(400).json({ error: 'Faltan datos obligatorios' });
        }
        // Validación de duplicados en backend
        db.query(
            'SELECT COUNT(*) as count FROM colaboradores WHERE LOWER(TRIM(nombre)) = ? AND LOWER(TRIM(estado)) = ?',
            [nombre.trim().toLowerCase(), estado.trim().toLowerCase()],
            (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
                if (results[0].count > 0) {
                    return res.status(409).json({ error: 'Ya existe un colaborador con el mismo nombre y ubicación.' });
                }
                // Obtener el siguiente valor de orden
                db.query('SELECT MAX(orden) as maxOrden FROM colaboradores', (err, results2) => {
                    if (err) return res.status(500).json({ error: err.message });
                    const nextOrden = (results2[0].maxOrden || 0) + 1;
                    // Si no existe, insertar
                    db.query(
                        `INSERT INTO colaboradores (nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion, orden)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion, nextOrden],
                        (err, result) => {
                            if (err) return res.status(500).json({ error: err.message });
                            res.json({ id: result.insertId, nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion, orden: nextOrden });
                        }
                    );
                });
            }
        );
    });

    // Endpoint: Actualizar el orden de los colaboradores
    app.put('/api/colaboradores/orden', verificarToken, verificarRol(['admin', 'editor']), (req, res) => {
        // Validación manual sin usar el middleware validateBody
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Cuerpo de la petición vacío o inválido' });
        }
        
        if (!req.body.orden || !Array.isArray(req.body.orden)) {
            return res.status(400).json({ error: 'Formato inválido. Se espera un array de objetos {id, orden}' });
        }
        
        // Crear consultas para actualizar cada colaborador
        const updates = req.body.orden.map(item => {
            return new Promise((resolve, reject) => {
                if (!item.id || typeof item.orden !== 'number') {
                    reject(new Error('Formato inválido en algún elemento del array'));
                    return;
                }
                
                db.query(
                    'UPDATE colaboradores SET orden = ? WHERE id = ?',
                    [item.orden, item.id],
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
            });
        });
        
        // Ejecutar todas las actualizaciones
        Promise.all(updates)
            .then(() => res.json({ message: 'Orden actualizado correctamente' }))
            .catch(err => res.status(500).json({ error: err.message }));
    });

    // Endpoint: Eliminar un colaborador individual por id
    // Devuelve 404 si el colaborador no existe
    app.delete('/api/colaboradores/:id', verificarToken, verificarRol(['admin']), (req, res) => {
        const id = parseInt(req.params.id);
        db.query('DELETE FROM colaboradores WHERE id=?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Colaborador no encontrado' });
            }
            res.json({ message: 'Colaborador eliminado', id });
        });
    });

    // Endpoint: Eliminar colaboradores en fin de misión antiguos (para limpieza)
    // Permite a administradores y editores eliminar colaboradores específicos
    app.delete('/api/colaboradores/clean-old-mission/:id', verificarToken, verificarRol(['admin', 'editor']), (req, res) => {
        const id = parseInt(req.params.id);
        
        // Verificar que el colaborador existe y está en fin de misión
        db.query('SELECT * FROM colaboradores WHERE id=?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.length === 0) {
                return res.status(404).json({ error: 'Colaborador no encontrado' });
            }
            
            const colaborador = result[0];
            if (colaborador.fin_mision !== 1) {
                return res.status(400).json({ error: 'Solo se pueden eliminar colaboradores en fin de misión' });
            }
            
            // Eliminar el colaborador
            db.query('DELETE FROM colaboradores WHERE id=?', [id], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Colaborador no encontrado' });
                }
                
                // Registrar la auditoría
                registrarAuditoria(
                    req.user.id,
                    'colaboradores',
                    'DELETE_CLEAN_OLD_MISSION',
                    id,
                    colaborador,
                    null,
                    req.ip
                );
                
                res.json({ message: 'Colaborador en fin de misión eliminado', id });
            });
        });
    });

    // Endpoint: Eliminar todos los colaboradores (limpieza total)
    // Seguridad: solo borra filas completas, nunca actualiza nombre/estado a NULL o vacío
    app.delete('/api/colaboradores', verificarToken, verificarRol(['admin']), (req, res) => {
        db.query('DELETE FROM colaboradores', (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('ALTER TABLE colaboradores AUTO_INCREMENT = 1');
            res.json({ message: 'Base de datos limpiada' });
        });
    });

    // Endpoint: Actualizar un colaborador existente
    // Valida campos obligatorios antes de actualizar
    app.put('/api/colaboradores/:id', verificarToken, verificarRol(['admin', 'editor']), validateBody, (req, res) => {
        const id = parseInt(req.params.id);
        const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
        if (!nombre || !estado) {
            return res.status(400).json({ error: 'Faltan datos obligatorios para actualizar' });
        }
        db.query(
            `UPDATE colaboradores SET nombre=?, estado=?, fecha_salida=?, fecha_entrada=?, fin_mision=?, ubicacion=?
             WHERE id=?`,
            [nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion, id],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Colaborador no encontrado' });
                }
                res.json({ id, nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion });
            }
        );
    });

    // Inicia el servidor en el puerto configurado
    // El backend queda escuchando para peticiones del frontend y de los tests
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
        console.log(`Sistema de autenticación activo`);
        console.log(`Usuario admin creado: admin / admin123`);
    });
});
