document.getElementById('pedidoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const descripcion = document.getElementById('descripcion').value.trim();
    const total = parseFloat(document.getElementById('total').value);
    const id_empleado = localStorage.getItem('id_empleado');
    const id_cliente = localStorage.getItem('id_cliente'); // Obtener el id_cliente desde localStorage o donde lo tengas almacenado

    // Verifica que el id_cliente y id_empleado no sean nulos
    if (!id_empleado || !id_cliente) {
        alert('Error: No hay un empleado o cliente identificado.');
        return;
    }

    if (!descripcion || isNaN(total) || total <= 0) {
        alert('Error: Descripción o total inválido');
        return;
    }

    console.log('Estado enviado: ', 'En preparación');
    console.log('id_empleado: ', id_empleado);
    console.log('id_cliente: ', id_cliente);
    console.log('descripcion: ', descripcion);
    console.log('total: ', total);

    // Realizamos la llamada fetch para agregar el pedido
    fetch('/api/pedidos/agregar-pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, total, id_empleado, id_cliente }) // Incluir id_cliente aquí
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Pedido agregado correctamente');
            window.location.href = '/views/empleado.html'; // Redirigir a la página de empleado
        } else {
            alert('Error al agregar el pedido: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al agregar el pedido.');
    });
});
