// Función para cargar el inventario en la tabla
function cargarInventario() {
    fetch('/api/inventario/obtener-inventario')
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos en frontend:", data);
            const tabla = document.getElementById('tablaInventario');
            tabla.innerHTML = '';
            data.inventario.forEach(item => {
                console.log("Fila:", item);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.ID_Inventario ?? "Sin ID"}</td>
                    <td>${item.Nombre ?? "Sin Nombre"}</td>
                    <td>${item.Cantidad ?? 0}</td>
                    <td>
                        <button onclick="eliminarInventario(${item.ID_Inventario})">Eliminar</button>
                    </td>
                `;
                tabla.appendChild(row);
            });
        })
        .catch(error => console.error("Error al cargar inventario:", error));
}

// Función para eliminar un producto del inventario
function eliminarInventario(id) {
    if (!confirm("¿Seguro que quieres eliminar este producto del inventario?")) return;

    fetch(`/api/inventario/eliminar-inventario/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Inventario eliminado correctamente');
            cargarInventario();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error("Error al eliminar inventario:", error));
}

// Llamamos a cargar el inventario al cargar la página
window.onload = cargarInventario;
