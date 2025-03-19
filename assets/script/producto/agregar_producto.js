document.getElementById("form-agregar-producto").addEventListener("submit", function(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre_producto").value.trim(); // Corregido el ID
    const precio = parseFloat(document.getElementById("precio").value);

    if (!nombre || precio <= 0) {
        alert("Por favor ingrese un nombre válido y un precio mayor a 0.");
        return;
    }

    fetch("/api/productos/agregar-producto", {  // Corregida la ruta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_producto: nombre, precio: precio })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("✅ Producto agregado correctamente.");
            document.getElementById("form-agregar-producto").reset();
        } else {
            alert("❌ Error: " + (data.message || "No se pudo agregar el producto."));
        }
    })
    .catch(error => alert("❌ Error de conexión con el servidor."));
});

// Corrección en el botón de regresar
document.querySelector(".btn-atras").addEventListener("click", function() {
    window.location.href = "/views/empleado.html";  // Asegurar que la ruta sea correcta
});
