const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'prueba_react',
  password: 'lucas2201',
  port: 5432,
});

// Registrar usuario
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Asegúrate de devolver el nombre
    const userData = {
      id: user.rows[0].id,
      nombre: user.rows[0].nombre,  // ← Usa el nombre de columna correcto
      email: user.rows[0].email
    };

    const token = jwt.sign({ userId: user.rows[0].id }, 'tu_secreto_jwt', { expiresIn: '1h' });
    
    res.json({ 
      token, 
      user: userData  // ← Esto es lo que recibe React
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};


// Obtener datos del perfil
const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Esto viene del middleware de autenticación
    
      const result = await pool.query(
      'SELECT id, nombre, email, created_at FROM usuarios WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, 'tu_secreto_jwt', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.userId = decoded.userId;
    next();
  });
};



// En authController.js, modifica createReport:
const createReport = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body); // Debug
    console.log('Usuario autenticado ID:', req.userId); // Debug

    const { tipo_alerta, descripcion, referencia, direccion, latitud, longitud } = req.body;
    
    const result = await pool.query(
      `INSERT INTO reportes (
        usuario_id, 
        tipo_alerta, 
        descripcion, 
        referencia, 
        direccion, 
        latitud, 
        longitud
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, tipo_alerta, descripcion, referencia, direccion, latitud, longitud] // Usa req.userId
    );
    
    res.status(201).json({ reporte: result.rows[0] });
  } catch (err) {
    console.error('Error detallado:', err); // Debug detallado
    res.status(500).json({ 
      error: 'Error al crear reporte',
      detalle: err.message // Envía el mensaje de error real
    });
  }
};

// Subir archivo asociado a un reporte
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    console.log('Archivo recibido:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      filename: req.file.filename
    });

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const result = await pool.query(
      `INSERT INTO archivos (reporte_id, archivo_url, archivo_tipo)
       VALUES ($1, $2, $3) RETURNING *`,
      [
        req.params.id,
        fileUrl,
        req.file.mimetype.startsWith('image') ? 'imagen' : 'video'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Archivo subido correctamente',
      file: result.rows[0]
    });

  } catch (err) {
    console.error('Error en uploadFile:', err);
    
    // Limpieza en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo',
      error: err.message
    });
  }
};

// Actualizar module.exports
module.exports = { 
  register, 
  login, 
  getProfile,
  authenticateToken,
  createReport,
  uploadFile,
  
};



