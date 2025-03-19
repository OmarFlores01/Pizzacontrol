document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registroForm = document.getElementById("registroForm");

    // Manejo del login
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    if (data.id_empleado) {
                        localStorage.setItem("id_empleado", data.id_empleado);
                    } else if (data.id_cliente) {
                        localStorage.setItem("id_cliente", data.id_cliente);
                    }
                    window.location.href = data.redirect;
                } else {
                    alert(data.error || "Hubo un error al iniciar sesión.");
                }
            } catch (error) {
                console.error("Error al enviar la solicitud:", error);
                alert("Hubo un problema con la conexión al servidor.");
            }
        });
    }

    // Manejo del registro
    if (registroForm) {
        registroForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nombre = document.getElementById("nombre").value;
            const telefono = document.getElementById("telefono").value;
            const correo = document.getElementById("correo").value;
            const contrasena = document.getElementById("contrasena").value;

            try {
                const response = await fetch("/api/auth/registro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, telefono, correo, contrasena }),
                });

                const data = await response.json();

                if (data.success) {
                    alert("Registro exitoso!");
                    window.location.href = "/views/login.html";
                } else {
                    alert("Hubo un error al registrar el usuario.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Hubo un problema con la conexión al servidor.");
            }
        });
    }
});
