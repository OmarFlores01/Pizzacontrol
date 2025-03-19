require('dotenv').config();  // Asegúrate de que esta línea esté al principio del archivo

const express = require('express');
const cors = require('cors'); // Middleware que permite hacer peticiones
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos y directorios.
const bodyParser = require('body-parser'); // Middleware para procesar cuerpos de solicitudes

// Cada archivo en routes/ contiene las definiciones de las rutas para diferentes partes del sistema
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Usar puerto definido en el archivo .env si está presente

// Middleware
app.use(cors());
app.use(express.json()); // Esto permite que las solicitudes JSON sean procesadas correctamente

// Middleware para procesar solicitudes con bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve archivos estáticos para que sean accesibles
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// Cuando el usuario visita la raíz, se envía el archivo login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/cliente', clienteRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
