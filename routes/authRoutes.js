const express = require("express");
const router = express.Router();
const db = require("../models/config/db"); // Conexión correcta a la base de datos
const bcrypt = require("bcrypt"); // Importa bcrypt para comparar contraseñas hashadas

// Ruta para login de empleados y clientes
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta en la tabla clientes
        const clienteResult = await db.query(
            'SELECT "ID_Cliente", "Correo", "Contrasena" FROM clientes WHERE "Correo" = $1',
            [email]
        );

        if (clienteResult.rows.length > 0) {
            const cliente = clienteResult.rows[0];

            // Verificar si la contraseña coincide (si está usando bcrypt)
            const isMatch = await bcrypt.compare(password, cliente.Contrasena);
            
            if (isMatch) {
                return res.json({
                    success: true,
                    redirect: "/views/usuario.html",
                    id_cliente: cliente.ID_Cliente
                });
            } else {
                return res.status(401).json({ error: "Correo o contraseña incorrectos" });
            }
        }

        // Si no se encuentra en clientes, buscar en empleados
        const empleadoResult = await db.query(
            'SELECT "ID_Empleado", "Correo", "Contrasena" FROM empleados WHERE "Correo" = $1',
            [email]
        );

        if (empleadoResult.rows.length > 0) {
            const empleado = empleadoResult.rows[0];

            // Verificar si la contraseña coincide (si está usando bcrypt)
            const isMatch = await bcrypt.compare(password, empleado.Contrasena);
            
            if (isMatch) {
                return res.json({
                    success: true,
                    redirect: "/views/empleado.html",
                    id_empleado: empleado.ID_Empleado
                });
            } else {
                return res.status(401).json({ error: "Correo o contraseña incorrectos" });
            }
        }

        // Si no se encontró ni en clientes ni en empleados
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });

    } catch (error) {
        console.error("Error en la consulta de autenticación:", error.message);
        return res.status(500).json({ error: "Error en la base de datos" });
    }
});

// Ruta para el registro de nuevos usuarios (clientes)
router.post("/registro", async (req, res) => {
    const { nombre, telefono, correo, contrasena } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingCliente = await db.query(
            'SELECT "Correo" FROM clientes WHERE "Correo" = $1',
            [correo]
        );

        if (existingCliente.rows.length > 0) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Insertar nuevo cliente en la base de datos
        const newCliente = await db.query(
            'INSERT INTO clientes ("Nombre", "Telefono", "Correo", "Contrasena") VALUES ($1, $2, $3, $4) RETURNING "ID_Cliente"',
            [nombre, telefono, correo, hashedPassword]
        );

        return res.json({ success: true, id_cliente: newCliente.rows[0].ID_Cliente });
    } catch (error) {
        console.error("Error en el registro:", error.message);
        return res.status(500).json({ error: "Error al registrar el cliente" });
    }
});

module.exports = router;
