const { Client } = require("pg");
require("dotenv").config(); // Cargar variables de entorno desde .env

const client = new Client({
    connectionString: process.env.DATABASE_URL, // Usa la URL externa correcta
    ssl: {
        rejectUnauthorized: false, // Necesario para Render
    },
});


// Conectar a la base de datos
client.connect()
    .then(() => console.log("✅ Conectado a la base de datos PostgreSQL"))
    .catch(err => console.error("❌ Error al conectar a PostgreSQL:", err));

module.exports = client;


