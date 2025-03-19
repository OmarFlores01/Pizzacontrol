CREATE DATABASE pizzacontrol;
USE pizzacontrol;

-- Tabla clientes
CREATE TABLE clientes (
    ID_Cliente INT(11) NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) DEFAULT NULL,
    Correo VARCHAR(100) DEFAULT NULL UNIQUE,
    Contrasena VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (ID_Cliente)
);

-- Tabla empleados
CREATE TABLE empleados (
    ID_Empleado INT(11) NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL UNIQUE,
    Contrasena VARCHAR(100) NOT NULL,
    Puesto VARCHAR(50) NOT NULL,
    Telefono VARCHAR(15) NOT NULL,
    PRIMARY KEY (ID_Empleado)
);

-- Tabla producto
CREATE TABLE producto (
    ID_Producto INT(11) NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (ID_Producto)
);

-- Tabla inventario
CREATE TABLE inventario (
    ID_Inventario INT(11) NOT NULL AUTO_INCREMENT,
    ID_Producto INT(11) NOT NULL,
    Cantidad INT(11) NOT NULL,
    ID_Empleado INT(11) NOT NULL,
    PRIMARY KEY (ID_Inventario),
    FOREIGN KEY (ID_Producto) REFERENCES producto(ID_Producto) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ID_Empleado) REFERENCES empleados(ID_Empleado) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla pedidos
CREATE TABLE pedidos (
    ID_Pedido INT(11) NOT NULL AUTO_INCREMENT,
    Descripcion VARCHAR(255) DEFAULT NULL,
    Estado ENUM('En preparación', 'Listo', 'Entregado') DEFAULT NULL,
    Fecha DATETIME DEFAULT NULL,
    Total DECIMAL(10,2) DEFAULT NULL,
    ID_Empleado INT(11) DEFAULT NULL,
    ID_Cliente INT(11) DEFAULT NULL,
    PRIMARY KEY (ID_Pedido),
    FOREIGN KEY (ID_Empleado) REFERENCES empleados(ID_Empleado) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ID_Cliente) REFERENCES clientes(ID_Cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insertar datos de clientes existentes
INSERT INTO clientes (ID_Cliente, Nombre, Correo, Contrasena) VALUES
(1, 'Mauro Ezequiel', 'duko10@gmail.com', 'duko10'),
(2, 'Adan Rojas Lara', 'rojas34@gmail.com', 'rojas34'),
(3, 'Alejandro CP', 'cpecito14@gmai.com', 'cpcito14');

-- Configurar auto_increment de clientes y pedidos
ALTER TABLE clientes AUTO_INCREMENT = 4;
ALTER TABLE pedidos AUTO_INCREMENT = 1;


