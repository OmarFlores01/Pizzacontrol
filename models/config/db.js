const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Esto usa la URL de la base de datos de Render
  ssl: { rejectUnauthorized: false }  // Esto asegura la conexión segura
});

pool.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos PostgreSQL.');
  }
});

module.exports = pool;
