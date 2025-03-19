// Cargar productos en la tabla
function cargarProductos() {
    fetch('/api/productos/obtener-productos')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tabla = document.getElementById('tablaProductos');
                tabla.innerHTML = '';
                data.productos.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.ID_Producto}</td>
                        <td>${producto.Nombre}</td>
                        <td>${producto.Precio}</td>
                        <td><button onclick="editarProducto(${producto.ID_Producto})">Actualizar</button></td>
                    `;
                    tabla.appendChild(row);
                });
            } else {
                alert('No se encontraron productos.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
            alert('Hubo un error al obtener los productos.');
        });
}

// Cargar producto en el formulario para actualizarlo
function editarProducto(id_producto) {
    fetch(`/api/productos/obtener-producto/${id_producto}`)
    .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('id_producto').value = data.producto.ID_Producto;
                document.getElementById('nombre_producto').value = data.producto.Nombre;
                document.getElementById('precio').value = data.producto.Precio;

                document.getElementById('formActualizar').classList.remove('hidden');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener el producto.');
        });
}

// Actualizar el producto
document.getElementById('formActualizar').addEventListener('submit', function(event) {
    event.preventDefault();

    const id_producto = document.getElementById('id_producto').value;
    const nombre_producto = document.getElementById('nombre_producto').value;
    const precio = document.getElementById('precio').value;

    fetch('/api/productos/actualizar-producto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_producto, nombre_producto, precio })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto actualizado correctamente');
            document.getElementById('formActualizar').classList.add('hidden');
            cargarProductos(); // Recargar la lista de productos
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el producto.');
    });
});

// Cargar productos al iniciar
window.onload = cargarProductos;
