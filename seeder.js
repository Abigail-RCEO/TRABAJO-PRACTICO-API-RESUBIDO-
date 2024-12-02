const sqlite3 = require('sqlite3').verbose();

// Conecta a la base de datos
const db = new sqlite3.Database('./database.db');

// Datos de ejemplo
const autos = [
  { marca: 'Toyota', modelo: 'Corolla', año: 2020, precio: 20000 },
  { marca: 'Honda', modelo: 'Civic', año: 2021, precio: 22000 },
  { marca: 'Ford', modelo: 'Focus', año: 2019, precio: 18000 },
  { marca: 'Chevrolet', modelo: 'Malibu', año: 2018, precio: 15000 },
  { marca: 'Nissan', modelo: 'Sentra', año: 2022, precio: 23000 },
  { marca: 'Hyundai', modelo: 'Elantra', año: 2021, precio: 21000 },
  { marca: 'Mazda', modelo: 'Mazda3', año: 2020, precio: 19000 },
  { marca: 'Volkswagen', modelo: 'Jetta', año: 2019, precio: 17000 },
  { marca: 'Subaru', modelo: 'Impreza', año: 2021, precio: 25000 },
  { marca: 'Kia', modelo: 'Forte', año: 2022, precio: 24000 }
];

// Inserta datos en la base de datos
db.serialize(() => {
  db.run('DELETE FROM autos'); // Limpia la tabla antes de insertar
  const stmt = db.prepare('INSERT INTO autos (marca, modelo, año, precio) VALUES (?, ?, ?, ?)');

  autos.forEach(auto => {
    stmt.run(auto.marca, auto.modelo, auto.año, auto.precio);
  });

  stmt.finalize();
});

// Cerrar conexión
db.close(() => {
  console.log('Datos insertados correctamente en la tabla autos.');
});

