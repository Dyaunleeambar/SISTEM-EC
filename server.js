const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());

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

    // Obtener todos los colaboradores
    app.get('/api/colaboradores', (req, res) => {
        db.query('SELECT * FROM colaboradores', (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    });

    // Agregar un colaborador
    app.post('/api/colaboradores', (req, res) => {
        const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
        db.query(
            `INSERT INTO colaboradores (nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: result.insertId, nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion });
            }
        );
    });

    // Actualizar un colaborador
    app.put('/api/colaboradores/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
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

    // Eliminar todos los colaboradores
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
