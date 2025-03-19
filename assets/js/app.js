let carrito = [];

async function obtenerProductos() {
    try {
        const response = await fetch('/api/productos/obtener-productos');
        const data = await response.json();
        if (data.success) {
            mostrarProductos(data.productos);
        } else {
            console.error("No se recibieron productos.");
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
}

function mostrarProductos(productos) {
    const tabla = document.getElementById('productos-lista');
    tabla.innerHTML = ''; // Evitar duplicados
    
    productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.Nombre}</td>
            <td>$${producto.Precio.toFixed(2)}</td>
            <td><button onclick="agregarAlCarrito(${producto.ID_Producto}, '${producto.Nombre}', ${producto.Precio})">Añadir</button></td>
        `;
        tabla.appendChild(fila);
    });
}

function agregarAlCarrito(id, nombre, precio) {
    let productoEnCarrito = carrito.find(producto => producto.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1; 
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 }); 
    }

    actualizarCarrito();
}



function actualizarCarrito() {
    const tablaCarrito = document.getElementById('carrito-lista');
    tablaCarrito.innerHTML = '';

    carrito.forEach((producto, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>${producto.cantidad}</td>
            <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
            <td>
                <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                <button onclick="aumentarCantidad(${index})">+</button>
                <button onclick="disminuirCantidad(${index})">-</button>
            </td>
        `;
        tablaCarrito.appendChild(fila);
    });
}

function aumentarCantidad(index) {
    carrito[index].cantidad += 1;
    actualizarCarrito();
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
    } else {
        carrito.splice(index, 1); // Elimina el producto si la cantidad llega a 0
    }
    actualizarCarrito();
}


function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

async function finalizarPedido() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const descripcion = carrito.map(prod => `${prod.nombre} x${prod.cantidad}`).join(', ');
    const total = carrito.reduce((sum, prod) => sum + (prod.precio * prod.cantidad), 0);
    const id_cliente = localStorage.getItem('id_cliente');

    if (!id_cliente) {
        alert("Error: No hay cliente registrado.");
        return;
    }

    const pedido = { descripcion, total, id_cliente };

    console.log("📦 Enviando pedido:", pedido);

    try {
        const response = await fetch('/api/cliente/agregar-pedido-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido)
        });

        const data = await response.json();
        console.log("📩 Respuesta del servidor:", data);

        if (data.success) {
            const idPedido = data.id_pedido; // Asegúrate de que el backend devuelva el ID
            mostrarModalPago(idPedido);

            carrito = [];
            actualizarCarrito();
        } else {
            alert("Error al realizar el pedido.");
        }
    } catch (error) {
        console.error("❌ Error al finalizar el pedido:", error);
    }
}

// Función para mostrar el modal de pago
function mostrarModalPago(idPedido) {
    const modalPago = document.getElementById('modalPago');
    const detallesPago = document.getElementById('detallePago');

    detallesPago.innerHTML = `
        <p><strong>Transferencia:</strong> 23456788765432234</p>
        <p><strong>Enviar al número:</strong> 5565544395</p>
        <p><strong>Colocar el ID del pedido en Concepto:</strong> <span style="color: red;">${idPedido}</span></p>
        <p><em>Se puede visualizar en "Ver Pedido".</em></p>
    `;

    modalPago.style.display = 'block';
}

// Función para cerrar el modal
function cerrarModalPago() {
    document.getElementById('modalPago').style.display = 'none';
}





obtenerProductos();

async function verPedido() {
    const id_cliente = localStorage.getItem('id_cliente');

    if (!id_cliente) {
        alert("Error: No hay cliente registrado.");
        return;
    }

    try {
        const response = await fetch(`/api/cliente/obtener-pedidos-cliente/${id_cliente}`);
        const data = await response.json();

        if (data.success) {
            mostrarPedidosEnModal(data.pedidos);
        } else {
            alert("No se encontraron pedidos.");
        }
    } catch (error) {
        console.error("❌ Error al obtener pedidos:", error);
    }
}


function mostrarPedidosEnModal(pedidos) {
    const detallePedido = document.getElementById('detallePedido');
    
    if (pedidos.length === 0) {
        detallePedido.innerHTML = "<p>No hay pedidos registrados.</p>";
    } else {
        let contenido = "<ul>";
        pedidos.forEach(pedido => {
            contenido += `<li><strong>ID:</strong> ${pedido.ID_Pedido} | <strong>Descripción:</strong> ${pedido.Descripcion} | <strong>Total:</strong> $${pedido.Total.toFixed(2)} | <strong>Estado:</strong> ${pedido.Estado} | <strong>Fecha:</strong> ${pedido.Fecha}</li>`;
        });
        contenido += "</ul>";
        detallePedido.innerHTML = contenido;
    }

    document.getElementById('modalPedido').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalPedido').style.display = 'none';
}
