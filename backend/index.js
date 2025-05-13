const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path'); // Añade esto para usar path.extname
const app = express();

// Configuración de Multer (asegúrate de tener esto)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

// 2. Crear carpeta uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// 3. Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Importar controladores
const authController = require('./controllers/authController');

// 5. Rutas
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile', authController.authenticateToken, authController.getProfile);
app.get('/api/reportes', authenticateToken, getReportes);

app.post('/api/reportes', authController.authenticateToken, authController.createReport);
app.post('/api/reportes/:id/archivos', 
  authController.authenticateToken, 
  upload.single('archivo'), 
  authController.uploadFile
);

// 6. Manejo de errores mejorado
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: 'Error al subir archivo',
      details: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// 7. Iniciar servidor
app.listen(5000, () => {
  console.log('Servidor listo en http://localhost:5000');
  console.log('Ruta de uploads:', path.join(__dirname, 'uploads'));
});