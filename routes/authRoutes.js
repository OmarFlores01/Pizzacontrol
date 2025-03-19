const express = require('express');
const router = express.Router();
const db = require('../models/config/db'); 

// Ruta para login de empleados y clientes
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el usuario es un cliente
        const clienteResult = await db.query(
            'SELECT "ID_Cliente", "Correo" FROM clientes WHERE "Correo" = $1 AND "Contrasena" = $2',
            [email, password]
        );

        if (clienteResult.rows.length > 0) {
            return res.json({
                success: true,
                redirect: '/views/usuario.html',
                id_cliente: clienteResult.rows[0].ID_Cliente
            });
        }

        // Verificar si el usuario es un empleado
        const empleadoResult = await db.query(
            'SELECT "ID_Empleado", "Correo" FROM empleados WHERE "Correo" = $1 AND "Contrasena" = $2',
            [email, password]
        );

        if (empleadoResult.rows.length > 0) {
            return res.json({
                success: true,
                redirect: '/views/empleado.html',
                id_empleado: empleadoResult.rows[0].ID_Empleado
            });
        }

        // Si no se encuentra ni un cliente ni un empleado
        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });

    } catch (err) {
        console.error('❌ Error en la consulta de login:', err.message);
        return res.status(500).json({ error: 'Error en la base de datos' });
    }
});

// Ruta para manejar el registro de clientes
router.post('/registro', async (req, res) => {
    const { nombre, correo, contrasena, numero } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const result = await db.query('SELECT * FROM clientes WHERE "Correo" = $1', [correo]);

        if (result.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Correo ya registrado' });
        }

        // Insertar nuevo cliente
        const query = 'INSERT INTO clientes ("Nombre", "Correo", "Contrasena", "Numero") VALUES ($1, $2, $3, $4)';
        await db.query(query, [nombre, correo, contrasena, numero]);

        res.json({ success: true });

    } catch (err) {
        console.error('❌ Error al registrar el cliente:', err.message);
        return res.status(500).json({ success: false });
    }
});

module.exports = router;

