// Carga las variables de entorno
require('dotenv').config();

// Importa express y otros módulos necesarios
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3'); // Importa el módulo sqlite3

// Inicia la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Procesar JSON

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.db');

// Creación de la tabla de autos (si no existe)
db.run(`
  CREATE TABLE IF NOT EXISTS autos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    modelo TEXT,
    precio REAL,
    año INTEGER
  )
`);

// Rutas
// Importar rutas
const autosRoutes = require('./routes/autosRoutes');
app.use('/autos', autosRoutes);

// Ruta básica
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de la concesionaria');
});

// Ruta de autos
app.get('/autos', async (req, res) => {
  try {
    const autos = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM autos', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    res.json(autos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los autos' });
  }
});

// Manejo de rutas no existentes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

app.use('/images', express.static('public/imagenes'));


// Inicia el servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  }).on('error', (err) => {
    console.error('Error al iniciar el servidor:', err);
  });
  

// Cierre de la conexión a la base de datos
db.close();