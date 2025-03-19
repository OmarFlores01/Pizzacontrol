const { Pool } = require('pg');

// Usamos async/await para mejorar el manejo de la conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usa la URL de la base de datos de Render desde las variables de entorno
  ssl: { rejectUnauthorized: false }  // Asegura la conexión segura
});

// Función para verificar la conexión de la base de datos
const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Conectado a la base de datos PostgreSQL.');
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
};

connectToDatabase();

module.exports = pool;

