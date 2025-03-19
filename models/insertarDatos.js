const mysql = require('mysql');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Cambia esta contraseña si es necesario
  database: 'pizzacontrol'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Insertar datos
const insertarDatos = async () => {
  const contrasenaEncriptada = await bcrypt.hash('contrasena123', 10);

  const empleado = {
    Nombre: 'Ana Gómez',
    Correo: 'empleado@example.com',
    Contrasena: contrasenaEncriptada,
    Puesto: 'Cocinero',
    Telefono: '1234567890'
  };

  connection.query('INSERT INTO empleados SET ?', empleado, (err, result) => {
    if (err) {
      console.error('Error al insertar empleado:', err);
      return;
    }
    console.log('Empleado insertado');
  });

  connection.end();
};

insertarDatos();
