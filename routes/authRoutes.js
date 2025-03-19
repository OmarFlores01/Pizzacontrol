const express = require('express');
const router = express.Router();
const db = require('../models/config/db'); 

// Ruta para login de empleados y clientes
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query(
        'SELECT ID_Cliente, Correo FROM clientes WHERE Correo = ? AND Contrasena = ?',
        [email, password],
        (err, clienteResult) => {
            if (err) {
                console.error('Error en la consulta de clientes:', err.message);
                return res.status(500).json({ error: 'Error en la base de datos' });
            }
            if (clienteResult.length > 0) {
                return res.json({
                    success: true,
                    redirect: '/views/usuario.html',
                    id_cliente: clienteResult[0].ID_Cliente
                });
            }
            
            db.query(
                'SELECT ID_Empleado, Correo FROM empleados WHERE Correo = ? AND Contrasena = ?',
                [email, password],
                (err, empleadoResult) => {
                    if (err) {
                        console.error('Error en la consulta de empleados:', err.message);
                        return res.status(500).json({ error: 'Error en la base de datos' });
                    }
                    if (empleadoResult.length > 0) {
                        return res.json({
                            success: true,
                            redirect: '/views/empleado.html',
                            id_empleado: empleadoResult[0].ID_Empleado
                        });
                    }
                    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
                }
            );
        }
    );
});

// Ruta para manejar el registro de clientes
router.post('/registro', (req, res) => {
    const { nombre, correo, contrasena, numero } = req.body;

    db.query('SELECT * FROM clientes WHERE Correo = ?', [correo], (err, result) => {
        if (err) {
            console.error('Error al verificar el correo:', err.message);
            return res.status(500).json({ success: false });
        }

        if (result.length > 0) {
            return res.status(400).json({ success: false, message: 'Correo ya registrado' });
        }

        const query = 'INSERT INTO clientes (Nombre, Correo, Contrasena, Numero) VALUES (?, ?, ?, ?)';
        db.query(query, [nombre, correo, contrasena, numero], (err, result) => {
            if (err) {
                console.error('Error al registrar el cliente:', err.message);
                return res.status(500).json({ success: false });
            }

            res.json({ success: true });
        });
    });
});

module.exports = router;
