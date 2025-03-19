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
                        <button onclick="editarInventario(${item.ID_Inventario}, '${item.Nombre}', ${item.Cantidad})">Actualizar</button>
                    </td>
                `;
                tabla.appendChild(row);
            });
        })
        .catch(error => console.error("Error al cargar inventario:", error));
}

function editarInventario(id, nombre, cantidad) {
    document.getElementById('idInventario').value = id;
    document.getElementById('nombre').value = nombre;
    document.getElementById('cantidad').value = cantidad;
    document.getElementById('formActualizar').style.display = 'block';
}

document.getElementById('formActualizar').addEventListener('submit', function(event) {
    event.preventDefault();
    const id = document.getElementById('idInventario').value;
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseInt(document.getElementById('cantidad').value, 10);

    fetch('/api/inventario/actualizar-inventario', {
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre, cantidad })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Inventario actualizado correctamente');
            cargarInventario();
            document.getElementById('formActualizar').style.display = 'none';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error("Error al actualizar inventario:", error));
});


window.onload = cargarInventario;
