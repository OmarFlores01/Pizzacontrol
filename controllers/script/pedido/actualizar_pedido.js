document.addEventListener("DOMContentLoaded", function() {
    mostrarPedidos();
});

// Función para mostrar todos los pedidos
function mostrarPedidos() {
    fetch('/api/pedidos/obtener-pedidos')
    .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tablaPedidos = document.getElementById('tablaPedidos');
                tablaPedidos.innerHTML = ''; // Limpiar la tabla antes de llenarla
                data.pedidos.forEach(pedido => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pedido.ID_Pedido}</td>
                        <td>${pedido.Descripcion}</td>
                        <td>${pedido.Estado}</td>
                        <td>${pedido.Total}</td>
                        <td><button onclick="cargarPedido(${pedido.ID_Pedido})">Actualizar</button></td>
                    `;
                    tablaPedidos.appendChild(row);
                });
            } else {
                alert('No se encontraron pedidos.');
            }
        })
        .catch(error => {
            console.error('Error al obtener los pedidos:', error);
            alert('Hubo un error al obtener los pedidos.');
        });
}

// Función para cargar los datos del pedido a actualizar
function cargarPedido(id_pedido) {
    fetch(`/api/pedidos/obtener-pedidos/${id_pedido}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('descripcion').value = data.pedido.Descripcion;
                document.getElementById('estado').value = data.pedido.Estado;
                document.getElementById('total').value = data.pedido.Total;

                document.getElementById('formActualizar').style.display = 'block';
                document.getElementById('formActualizar').setAttribute('data-id-pedido', id_pedido); // Guardar ID
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al obtener el pedido.');
        });
}

// Función para actualizar el pedido
document.getElementById('formActualizar').addEventListener('submit', function(event) {
    event.preventDefault();

    const id_pedido = document.getElementById('formActualizar').getAttribute('data-id-pedido');
    const descripcion = document.getElementById('descripcion').value;
    const estado = document.getElementById('estado').value;
    const total = document.getElementById('total').value;

    fetch('/api/pedidos/actualizar-pedido', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pedido, descripcion, estado, total })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido actualizado correctamente');
            window.location.reload(); // Recargar la página para mostrar los cambios
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el pedido.');
    });
});
