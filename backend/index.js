const express = require('express');
const cors = require('cors'); // Importante para React
const app = express();

// Middlewares (¡No olvides estos!)
app.use(cors()); // Permite peticiones desde React
app.use(express.json()); // Para parsear JSON

// Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Servidor listo en http://localhost:5000');
});