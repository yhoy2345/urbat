const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importa controladores
const { 
  register, 
  login, 
  getProfile,
  authenticateToken,
  createReport,
  uploadFile 
} = require('./controllers/authController');


// Rutas de autenticación
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/profile', authenticateToken, getProfile);

// Rutas de reportes (protegidas por autenticación)
app.post('/api/reportes', authenticateToken, createReport);
app.post('/api/reportes/:id/archivos', authenticateToken, uploadFile);

app.listen(5000, () => {
  console.log('Servidor listo en http://localhost:5000');
});