const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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

    // Crea la tabla si no existe
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

    // Endpoint: Obtener todos los colaboradores ordenados
    // Devuelve la lista completa de colaboradores, ordenados por el campo personalizado 'orden' y luego por id
    app.get('/api/colaboradores', (req, res) => {
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
    app.post('/api/colaboradores', validateBody, (req, res) => {
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
    app.put('/api/colaboradores/orden', (req, res) => {
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
    app.delete('/api/colaboradores/:id', (req, res) => {
        const id = parseInt(req.params.id);
        db.query('DELETE FROM colaboradores WHERE id=?', [id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Colaborador no encontrado' });
            }
            res.json({ message: 'Colaborador eliminado', id });
        });
    });

    // Endpoint: Eliminar todos los colaboradores (limpieza total)
    // Seguridad: solo borra filas completas, nunca actualiza nombre/estado a NULL o vacío
    app.delete('/api/colaboradores', (req, res) => {
        db.query('DELETE FROM colaboradores', (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('ALTER TABLE colaboradores AUTO_INCREMENT = 1');
            res.json({ message: 'Base de datos limpiada' });
        });
    });

    // Inicia el servidor en el puerto 3001
    // El backend queda escuchando para peticiones del frontend y de los tests
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
});
