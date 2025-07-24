const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Conexión inicial SIN database
const dbInit = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cuba123456'
});

// Crea la base de datos si no existe
dbInit.query(`CREATE DATABASE IF NOT EXISTS colaboradores_db`, (err) => {
    if (err) throw err;

    // Ahora conecta a la base de datos
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
            ubicacion VARCHAR(255)
        )
    `);

    // Intentar agregar restricción UNIQUE a (nombre, estado) para máxima seguridad
    db.query(
        `ALTER TABLE colaboradores ADD CONSTRAINT unique_nombre_estado UNIQUE (nombre, estado)`,
        (err) => {
            if (err && err.code !== 'ER_DUP_KEYNAME' && !/Duplicate.*unique_nombre_estado/.test(err.message)) {
                // Solo loguea si el error no es por existencia previa
                console.error('Error añadiendo restricción UNIQUE:', err.message);
            }
        }
    );

    // Agregar campo 'orden' si no existe
    db.query(
        `ALTER TABLE colaboradores ADD COLUMN orden INT DEFAULT 0`,
        (err) => {
            if (err && !/Duplicate column name|already exists/.test(err.message)) {
                console.error('Error añadiendo columna orden:', err.message);
            }
        }
    );

    // Endpoint para actualizar el orden de los colaboradores
    app.put('/api/colaboradores/orden', (req, res) => {
        const { orden } = req.body; // [{id: 1, orden: 1}, ...]
        if (!Array.isArray(orden)) {
            return res.status(400).json({ error: 'Formato de orden inválido' });
        }
        const updates = orden.map(c => new Promise((resolve, reject) => {
            db.query('UPDATE colaboradores SET orden=? WHERE id=?', [c.orden, c.id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        }));
        Promise.all(updates)
            .then(() => res.json({ success: true }))
            .catch(err => res.status(500).json({ error: err.message }));
    });

    // Obtener todos los colaboradores
    app.get('/api/colaboradores', (req, res) => {
        db.query('SELECT * FROM colaboradores ORDER BY orden ASC, id ASC', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Agregar un colaborador
    app.post('/api/colaboradores', (req, res) => {
        // Validación robusta de cuerpo
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Cuerpo de la petición vacío o inválido' });
        }
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

    // Actualizar un colaborador
    app.put('/api/colaboradores/:id', (req, res) => {
        // Validación robusta de cuerpo
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Cuerpo de la petición vacío o inválido' });
        }
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
                res.json({ id, nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion });
            }
        );
    });

    // Eliminar un colaborador individual
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

    // Eliminar todos los colaboradores (limpieza total)
    // Seguridad: solo borra filas completas, nunca actualiza nombre/estado a NULL o vacío
    app.delete('/api/colaboradores', (req, res) => {
        db.query('DELETE FROM colaboradores', (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('ALTER TABLE colaboradores AUTO_INCREMENT = 1');
            res.json({ message: 'Base de datos limpiada' });
        });
    });

    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
    });
});
