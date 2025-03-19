// Función para obtener los productos y mostrarlos en la tabla
function cargarProductos() {
    fetch('/api/productos/obtener-productos')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.getElementById('productosTabla');
                tbody.innerHTML = ''; // Limpiar tabla antes de cargar datos
                data.productos.forEach(producto => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${producto.ID_Producto}</td>
                        <td>${producto.Nombre}</td>
                        <td>$${producto.Precio}</td>
                        <td><button class="delete-btn" onclick="confirmarEliminar(${producto.ID_Producto})">Eliminar</button></td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                console.error('Error al obtener productos.');
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para confirmar y eliminar producto
function confirmarEliminar(id) {
    if (confirm(`¿Estás seguro de eliminar el producto con ID ${id}?`)) {
        fetch('/api/productos/eliminar-producto/' + id, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Producto eliminado correctamente.');
                    cargarProductos(); // Recargar la tabla
                } else {
                    alert('Error al eliminar el producto.');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}

// Cargar productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
