require('dotenv').config();  // Cargar variables de entorno

const express = require('express');
const cors = require('cors'); 
const path = require('path'); 
const bodyParser = require('body-parser'); 
const { Client } = require("pg"); // Importar PostgreSQL Client

// Configuración de la base de datos
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Necesario para Render
    },
});

client.connect()
    .then(() => console.log("🔗 Conectado a PostgreSQL"))
    .catch(err => console.error("❌ Error conectando a PostgreSQL:", err));

const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/views', express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/cliente', clienteRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
