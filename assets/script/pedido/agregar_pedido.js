document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion').value.trim();
    const total = parseFloat(document.getElementById('total').value);
    const id_empleado = localStorage.getItem('id_empleado');
    const id_cliente = localStorage.getItem('id_cliente'); // Obtener el id_cliente desde localStorage o donde lo tengas almacenado

    if (!id_empleado || !id_cliente) {
        alert('Error: No hay un empleado o cliente identificado.');
        return;
    }

    if (!descripcion || isNaN(total) || total <= 0) {
        alert('Error: Descripción o total inválido');
        return;
    }

    fetch('/api/pedidos/agregar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, total, id_empleado, id_cliente }) // Incluir id_cliente aquí
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
