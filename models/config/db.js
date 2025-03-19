const mysql = require('mysql'); // carga el paquete mysql

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // usuario de MySQL
    password: '',      // contraseña 
    database: 'pizzacontrol' // nombre de bd
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;
