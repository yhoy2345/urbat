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


// En tu authController.js o un nuevo controller
const getReportes = async (req, res) => {
  try {
    const userId = req.userId; // ID del usuario autenticado

    // Obtener reportes con información del usuario
    const reportesResult = await pool.query(`
      SELECT 
        r.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM reportes r
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.creado_en DESC
      LIMIT 20
    `);

    // Obtener archivos, comentarios, reacciones totales y reacciones del usuario
    const reportesCompletos = await Promise.all(
      reportesResult.rows.map(async (reporte) => {
        const [archivos, comentarios, reaccionesTotales, reaccionesUsuario] = await Promise.all([
          pool.query(
            `SELECT id, archivo_url as url, archivo_tipo as tipo, creado_en
             FROM archivos WHERE reporte_id = $1`,
            [reporte.id]
          ),
          pool.query(
            `SELECT 
               c.id,
               c.usuario_id,
               u.nombre as usuario_nombre,
               c.texto,
               c.creado_en
             FROM comentarios c
             JOIN usuarios u ON c.usuario_id = u.id
             WHERE c.reporte_id = $1
             ORDER BY c.creado_en DESC
             LIMIT 10`,
            [reporte.id]
          ),
          pool.query(
            `SELECT 
               tipo, 
               COUNT(*) as count
             FROM reacciones
             WHERE reporte_id = $1
             GROUP BY tipo`,
            [reporte.id]
          ),
          pool.query(
            `SELECT tipo
             FROM reacciones
             WHERE reporte_id = $1 AND usuario_id = $2`,
            [reporte.id, userId]
          )
        ]);

        // Formatear reacciones totales
        const reacciones = {
          confirm: 0,
          deny: 0,
          care: 0,
          emergency: 0
        };
        reaccionesTotales.rows.forEach(({ tipo, count }) => {
          reacciones[tipo] = parseInt(count, 10);
        });

        // Formatear reacciones del usuario
        const userReactions = reaccionesUsuario.rows.map(row => row.tipo);

        return {
          ...reporte,
          archivos: archivos.rows,
          comentarios: comentarios.rows,
          reacciones,
          userReactions // Lista de tipos de reacciones del usuario
        };
      })
    );

    res.json(reportesCompletos);
  } catch (err) {
    console.error('Error al obtener reportes:', err);
    res.status(500).json({ 
      error: 'Error al obtener reportes',
      detalle: err.message
    });
  }
};

const createComentario = async (req, res) => {
  const { id: reporte_id } = req.params;
  const usuario_id = req.user.id; // del token
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: 'El comentario no puede estar vacío' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO comentarios (reporte_id, usuario_id, texto)
       VALUES ($1, $2, $3)
       RETURNING id, texto, creado_en`,
      [reporte_id, usuario_id, texto]
    );

    res.status(201).json({
      mensaje: 'Comentario creado con éxito',
      comentario: result.rows[0],
    });
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
};

const crearReaccion = async (req, res) => {
  const { id: reporte_id } = req.params;
  const usuario_id = req.user.id;
  const { tipo } = req.body;

  const tiposValidos = ['confirm', 'deny', 'care', 'emergency'];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de reacción inválido' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO reacciones (reporte_id, usuario_id, tipo)
       VALUES ($1, $2, $3)
       ON CONFLICT (reporte_id, usuario_id, tipo)
       DO NOTHING
       RETURNING id, tipo, creado_en`,
      [reporte_id, usuario_id, tipo]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ mensaje: 'Ya habías reaccionado con ese tipo' });
    }

    res.status(201).json({
      mensaje: 'Reacción registrada',
      reaccion: result.rows[0],
    });
  } catch (err) {
    console.error('Error al registrar reacción:', err);
    res.status(500).json({ error: 'Error al registrar reacción' });
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
  getReportes,
  createComentario,
  crearReaccion,
};



