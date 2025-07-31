const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Cuba123456',
    database: process.env.DB_NAME || 'colaboradores_db'
});

async function crearUsuariosTest() {
    try {
        await connection.promise().connect();
        console.log('Conectado a la base de datos');

        // Crear usuario editor
        const passwordHashEditor = await bcrypt.hash('editor123', 12);
        await connection.promise().query(
            'INSERT INTO usuarios (username, password_hash, email, rol) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?, rol = ?',
            ['editor', passwordHashEditor, 'editor@sistema.com', 'editor', passwordHashEditor, 'editor']
        );
        console.log('Usuario editor creado/actualizado');

        // Crear usuario viewer
        const passwordHashViewer = await bcrypt.hash('viewer123', 12);
        await connection.promise().query(
            'INSERT INTO usuarios (username, password_hash, email, rol) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?, rol = ?',
            ['viewer', passwordHashViewer, 'viewer@sistema.com', 'viewer', passwordHashViewer, 'viewer']
        );
        console.log('Usuario viewer creado/actualizado');

        // Verificar usuarios
        const [usuarios] = await connection.promise().query('SELECT username, rol FROM usuarios WHERE activo = TRUE');
        console.log('Usuarios disponibles:');
        usuarios.forEach(user => {
            console.log(`- ${user.username} (${user.rol})`);
        });

        await connection.promise().end();
        console.log('Usuarios de prueba creados exitosamente');
    } catch (error) {
        console.error('Error:', error);
    }
}

crearUsuariosTest(); 
