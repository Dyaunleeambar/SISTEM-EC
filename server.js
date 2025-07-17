const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Inicializar base de datos
const db = new sqlite3.Database('./colaboradores.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS colaboradores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  estado TEXT,
  fecha_salida TEXT,
  fecha_entrada TEXT,
  fin_mision INTEGER,
  ubicacion TEXT
)`);

// Obtener todos los colaboradores
app.get('/api/colaboradores', (req, res) => {
  db.all('SELECT * FROM colaboradores', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Agregar un colaborador
app.post('/api/colaboradores', (req, res) => {
  const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
  db.run(
    `INSERT INTO colaboradores (nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, estado, fecha_salida, fecha_entrada, fin_mision ? 1 : 0, ubicacion],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Actualizar un colaborador
app.put('/api/colaboradores/:id', (req, res) => {
  const { nombre, estado, fecha_salida, fecha_entrada, fin_mision, ubicacion } = req.body;
  db.run(
    `UPDATE colaboradores SET nombre=?, estado=?, fecha_salida=?, fecha_entrada=?, fin_mision=?, ubicacion=? WHERE id=?`,
    [nombre, estado, fecha_salida, fecha_entrada, fin_mision ? 1 : 0, ubicacion, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// Eliminar un colaborador
app.delete('/api/colaboradores/:id', (req, res) => {
  db.run(`DELETE FROM colaboradores WHERE id=?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Eliminar todos los colaboradores
app.delete('/api/colaboradores', (req, res) => {
  db.run('DELETE FROM colaboradores', [], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar colaboradores' });
    } else {
      res.json({ message: 'Todos los colaboradores eliminados' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
