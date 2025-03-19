router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Consulta en clientes
        const clienteResult = await db.query(
            'SELECT "id_cliente", "correo", "contrasena" FROM clientes WHERE "correo" = $1',
            [email]
        );

        if (clienteResult.rows.length > 0) {
            const cliente = clienteResult.rows[0];

            // Verificar la contraseña (compara el texto plano si no usas bcrypt)
            const isMatch = password === cliente.contrasena; // Aquí debes usar bcrypt si las contraseñas están cifradas

            if (isMatch) {
                return res.json({
                    success: true,
                    redirect: "/views/usuario.html",
                    id_cliente: cliente.id_cliente
                });
            } else {
                return res.status(401).json({ error: "Correo o contraseña incorrectos" });
            }
        }

        // Si no se encontró en clientes, buscar en empleados
        const empleadoResult = await db.query(
            'SELECT "id_empleado", "correo", "contrasena" FROM empleados WHERE "correo" = $1',
            [email]
        );

        if (empleadoResult.rows.length > 0) {
            const empleado = empleadoResult.rows[0];

            // Comparación de contraseñas
            const isMatch = password === empleado.contrasena;

            if (isMatch) {
                return res.json({
                    success: true,
                    redirect: "/views/empleado.html",
                    id_empleado: empleado.id_empleado
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
