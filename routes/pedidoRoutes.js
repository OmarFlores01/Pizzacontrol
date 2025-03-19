const express = require('express');
const router = express.Router();
const db = require('../models/config/db'); // Asegúrate de tener tu conexión a la BD en este archivo

// Ruta para agregar un pedido
router.post('/agregar-pedido', (req, res) => {
    const { descripcion, total, id_empleado, id_cliente } = req.body;

    // Validar estado
    const estado = 'En preparación';  // Asumiendo que el estado es "En preparación"

    // Verificar si los campos obligatorios están presentes
    if (!descripcion || !total || !id_empleado || !id_cliente) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    // Verificar si el estado es válido
    const estadosValidos = ['En preparación', 'Listo', 'Entregado'];
    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ success: false, message: 'Estado no válido' });
    }

    // Consulta SQL para insertar el nuevo pedido
    const query = `INSERT INTO pedidos (Descripcion, Estado, Fecha, Total, ID_Empleado, ID_Cliente) 
                   VALUES ($1, $2, NOW(), $3, $4, $5)`;

    db.query(query, [descripcion, estado, total, id_empleado, id_cliente], (err, result) => {
        if (err) {
            console.error('Error detallado al agregar pedido:', err);  // Esto nos dará más detalles sobre el error
            return res.status(500).json({ success: false, message: 'Error al agregar el pedido', error: err.message });
        }
        res.json({ success: true, message: 'Pedido agregado correctamente' });
    });
});

// Obtener todos los pedidos
router.get('/obtener-pedidos', (req, res) => {
    db.query('SELECT * FROM pedidos', (err, result) => {
        if (err) {
            console.error('Error al obtener pedidos:', err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }
        res.json({ success: true, pedidos: result.rows });
    });
});

// Obtener un pedido por ID
router.get('/obtener-pedidos/:id_pedido', (req, res) => {
    const { id_pedido } = req.params;
    db.query('SELECT * FROM pedidos WHERE ID_Pedido = $1', [id_pedido], (err, result) => {
        if (err) {
            console.error('Error al obtener el pedido:', err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }
        res.json(result.rows.length > 0 ? { success: true, pedido: result.rows[0] } : { success: false, message: 'Pedido no encontrado' });
    });
});

// Actualizar un pedido
router.put('/actualizar-pedido', (req, res) => {
    const { id_pedido, descripcion, estado, total } = req.body;
    if (!id_pedido || !descripcion || !estado || !total) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    const query = 'UPDATE pedidos SET Descripcion = $1, Estado = $2, Total = $3 WHERE ID_Pedido = $4';
    db.query(query, [descripcion, estado, total, id_pedido], (err, result) => {
        if (err) {
            console.error('Error al actualizar pedido:', err);
            return res.status(500).json({ success: false, message: 'Error en la base de datos' });
        }
        res.json({ success: true, message: 'Pedido actualizado correctamente' });
    });
});

// Eliminar un pedido
router.delete('/eliminar', (req, res) => {
    const { id_pedido } = req.body;
    if (!id_pedido) {
        return res.status(400).json({ success: false, message: 'ID de pedido requerido' });
    }

    db.query('DELETE FROM pedidos WHERE ID_Pedido = $1', [id_pedido], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al eliminar el pedido' });
        }
        res.json({ success: true, message: 'Pedido eliminado correctamente' });
    });
});

module.exports = router;
