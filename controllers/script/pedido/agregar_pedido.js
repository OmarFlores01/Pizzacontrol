document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion').value.trim();
    const total = parseFloat(document.getElementById('total').value);
    const id_empleado = localStorage.getItem('id_empleado'); 

    if (!id_empleado) {
        alert('Error: No se encontró el ID del empleado. Inicie sesión nuevamente.');
        return;
    }

    if (isNaN(total) || total <= 0) {
        alert('Error: El total debe ser un número válido mayor a 0.');
        return;
    }

    fetch('/api/pedidos/agregar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, total, id_empleado })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido agregado correctamente');
            window.location.href = '/views/empleado.html';
        } else {
            alert('Error al agregar el pedido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al agregar el pedido.');
    });
});
