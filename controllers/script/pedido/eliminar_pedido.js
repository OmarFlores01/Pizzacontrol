// script.js
function mostrarPedidos() {
    fetch('/api/pedidos/obtener-pedidos')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tablaPedidos = document.getElementById('tablaPedidos');
                tablaPedidos.innerHTML = '';
                data.pedidos.forEach(pedido => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${pedido.ID_Pedido}</td>
                        <td>${pedido.Descripcion}</td>
                        <td>${pedido.Estado}</td>
                        <td>${pedido.Total}</td>
                        <td><button onclick="eliminarPedido(${pedido.ID_Pedido})">Eliminar</button></td>
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

function eliminarPedido(id_pedido) {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        return;
    }

    fetch('/api/pedidos/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pedido })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido eliminado correctamente');
            mostrarPedidos();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al eliminar el pedido.');
    });
}

window.onload = mostrarPedidos;
