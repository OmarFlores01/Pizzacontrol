const express = require('express');
const router = express.Router();
const db = require('../models/config/db'); 
const bcrypt = require('bcrypt');


// Ruta para login de empleados y clientes
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query(
    'SELECT ID_Cliente, Correo, Contrasena FROM clientes WHERE Correo = ?',
    [email],
    (err, clienteResult) => {
        if (err) {
            console.error('Error en la consulta de clientes:', err.message);
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (clienteResult.length > 0) {
            // Verificar la contraseña
            bcrypt.compare(password, clienteResult[0].Contrasena, (err, isMatch) => {
                if (err) {
                    console.error('Error al comparar contraseñas:', err.message);
                    return res.status(500).json({ error: 'Error de servidor' });
                }
                if (isMatch) {
                    return res.json({
                        success: true,
                        redirect: '/views/usuario.html',
                        id_cliente: clienteResult[0].ID_Cliente
                    });
                } else {
                    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
                }
            });
        } else {
            // Verificar en empleados
            db.query(
                'SELECT ID_Empleado, Correo, Contrasena FROM empleados WHERE Correo = ?',
                [email],
                (err, empleadoResult) => {
                    if (err) {
                        console.error('Error en la consulta de empleados:', err.message);
                        return res.status(500).json({ error: 'Error en la base de datos' });
                    }
                    if (empleadoResult.length > 0) {
                        bcrypt.compare(password, empleadoResult[0].Contrasena, (err, isMatch) => {
                            if (err) {
                                console.error('Error al comparar contraseñas:', err.message);
                                return res.status(500).json({ error: 'Error de servidor' });
                            }
                            if (isMatch) {
                                return res.json({
                                    success: true,
                                    redirect: '/views/empleado.html',
                                    id_empleado: empleadoResult[0].ID_Empleado
                                });
                            } else {
                                return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
                            }
                        });
                    } else {
                        return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
                    }
                }
            );
        }
    }
);


module.exports = router;
