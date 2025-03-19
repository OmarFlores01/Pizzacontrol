const express = require('express');
const cors = require('cors'); //Middleware que permite hacer peticiones   app.use()/Ejecuta código en cada petición    
const path = require('path'); // Módulo de Node.js para manejar rutas de archivos y directorios.

//Cada archivo en routes/ contiene las definiciones de las rutas para diferentes partes del sistema
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const productoRoutes = require('./routes/productoRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();
const PORT = 3000;

// Sirve archivos estáticos sean accesibles
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// Cuando el usuario visita la raíz, se envía el archivo login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

// permiten a los clientes/empleados interactuar con el servidor.
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/cliente', clienteRoutes);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
