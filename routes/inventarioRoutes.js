const express = require('express');
const router = express.Router();
const db = require('../models/config/db');

// Ruta para agregar inventario
router.post('/agregar-inventario', (req, res) => {
    const { Nombre, Cantidad, ID_Empleado } = req.body;

    if (!Nombre || !Cantidad || !ID_Empleado) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO inventario (Nombre, Cantidad, ID_Empleado) VALUES (?, ?, ?)';
    db.query(query, [Nombre, Cantidad, ID_Empleado], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            return res.status(500).json({ error: 'Error al agregar inventario' });
        }
        res.json({ success: true, message: 'Inventario agregado con éxito' });
    });
});

// Ruta para obtener el inventario
router.get('/obtener-inventario', (req, res) => {
    const query = "SELECT * FROM inventario";
    db.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener inventario:", error);
            return res.status(500).json({ success: false, message: "Error al obtener inventario" });
        }
        res.json({ success: true, inventario: results });
    });
});

// Ruta para actualizar el inventario
router.put('/actualizar-inventario', (req, res) => {
    const { id, nombre, cantidad } = req.body;

    if (!id || !nombre || cantidad === undefined) {
        return res.status(400).json({ success: false, message: "ID, nombre y cantidad son requeridos" });
    }

    const cantidadInt = parseInt(cantidad, 10);
    if (isNaN(cantidadInt) || cantidadInt < 0) {
        return res.status(400).json({ success: false, message: "La cantidad debe ser un número válido" });
    }

    const query = "UPDATE inventario SET Nombre = ?, Cantidad = ? WHERE ID_Inventario = ?";
    db.query(query, [nombre, cantidadInt, id], (error, result) => {
        if (error) {
            console.error("Error al actualizar inventario:", error);
            return res.status(500).json({ success: false, message: "Error al actualizar inventario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "No se encontró el inventario para actualizar" });
        }
        res.json({ success: true, message: "Inventario actualizado correctamente" });
    });
});

// Ruta para eliminar un producto del inventario
router.delete('/eliminar-inventario/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ success: false, message: "ID es requerido" });
    }

    const query = "DELETE FROM inventario WHERE ID_Inventario = ?";
    db.query(query, [id], (error, result) => {
        if (error) {
            console.error("Error al eliminar inventario:", error);
            return res.status(500).json({ success: false, message: "Error al eliminar inventario" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "No se encontró el inventario para eliminar" });
        }
        res.json({ success: true, message: "Inventario eliminado correctamente" });
    });
});

module.exports = router;
