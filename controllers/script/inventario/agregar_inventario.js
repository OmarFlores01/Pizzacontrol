document.getElementById("inventarioForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita la recarga de la página

    // Obtener valores del formulario
    const nombre_producto = document.getElementById("nombre_producto").value;
    const cantidad = document.getElementById("cantidad").value;
    const id_empleado = localStorage.getItem("id_empleado"); // Obtener ID del empleado desde localStorage

    // Validar que todos los campos estén llenos
    if (!nombre_producto || !cantidad || !id_empleado) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Enviar datos al servidor con Fetch
    fetch('/api/inventario/agregar-inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Nombre: nombre_producto, Cantidad: cantidad, ID_Empleado: id_empleado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Inventario agregado correctamente."); // Mostrar ventana emergente
            document.getElementById("inventarioForm").reset(); // Limpiar formulario
        } else {
            alert("Error al agregar inventario.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Ocurrió un error al conectar con el servidor.");
    });
});
