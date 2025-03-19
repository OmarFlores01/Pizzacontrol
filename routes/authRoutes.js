const express = require("express");
const router = express.Router();
const db = require("../models/config/db"); // Conexión correcta
const bcrypt = require("bcrypt");

// Ruta para login de empleados y clientes
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta en clientes
        const clienteResult = await db.query(
            'SELECT "ID_Cliente", "Correo", "Contrasena" FROM clientes WHERE "Correo" = $1',
            [email]
        );

        if (clienteResult.rows.length > 0) {
            const cliente = clienteResult.rows[0];

            // ⚠️ Verificar si la contraseña está hasheada o en texto plano
            const isMatch = password === cliente.Contrasena; // Temporal (solo si no usas bcrypt)
            
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

        // Si no se encontró en clientes, buscar en empleados
        const empleadoResult = await db.query(
            'SELECT "ID_Empleado", "Correo", "Contrasena" FROM empleados WHERE "Correo" = $1',
            [email]
        );

        if (empleadoResult.rows.length > 0) {
            const empleado = empleadoResult.rows[0];

            // ⚠️ Comparación temporal sin bcrypt (usa bcrypt solo si las contraseñas están encriptadas)
            const isMatch = password === empleado.Contrasena;
            
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

module.exports = router;
