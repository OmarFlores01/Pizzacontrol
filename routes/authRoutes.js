const express = require("express");
const router = express.Router();
const db = require("../models/config/db");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta en la tabla clientes
        const clienteResult = await db.query(
            'SELECT "ID_Cliente", "Correo", "Contrasena" FROM clientes WHERE "Correo" = $1',
            [email]
        );

        console.log("Resultado de la consulta en clientes:", clienteResult.rows);  // Debug

        if (clienteResult.rows.length > 0) {
            const cliente = clienteResult.rows[0];
            console.log("Cliente encontrado:", cliente);  // Debug

            // Si las contraseñas están en texto plano
            const isMatch = password === cliente.Contrasena;

            // Si las contraseñas están hashadas, usa bcrypt:
            // const isMatch = await bcrypt.compare(password, cliente.Contrasena);

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

        console.log("Resultado de la consulta en empleados:", empleadoResult.rows);  // Debug

        if (empleadoResult.rows.length > 0) {
            const empleado = empleadoResult.rows[0];
            console.log("Empleado encontrado:", empleado);  // Debug

            // Si las contraseñas están en texto plano
            const isMatch = password === empleado.Contrasena;

            // Si las contraseñas están hashadas, usa bcrypt:
            // const isMatch = await bcrypt.compare(password, empleado.Contrasena);

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

