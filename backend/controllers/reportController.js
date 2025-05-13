// controllers/reportController.js
const { Pool } = require('pg');
const pool = require('../db'); // Asumiendo que tienes un archivo db.js para la conexión

// Crear reporte
const createReport = async (req, res) => {
  try {
    const { usuario_id, tipo_alerta, descripcion, referencia, direccion, latitud, longitud } = req.body;
    
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
      [usuario_id, tipo_alerta, descripcion, referencia, direccion, latitud, longitud]
    );
    
    res.status(201).json({ reporte: result.rows[0] });
  } catch (err) {
    console.error('Error al crear reporte:', err);
    res.status(500).json({ error: 'Error al crear reporte' });
  }
};

// Subir archivo
const uploadFile = async (req, res) => {
  try {
    const { reporte_id, archivo_url, archivo_tipo } = req.body;
    
    const result = await pool.query(
      `INSERT INTO archivos (
        reporte_id, 
        archivo_url, 
        archivo_tipo
      ) VALUES ($1, $2, $3) RETURNING *`,
      [reporte_id, archivo_url, archivo_tipo]
    );
    
    res.status(201).json({ archivo: result.rows[0] });
  } catch (err) {
    console.error('Error al subir archivo:', err);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
};

// Obtener reportes
const getReports = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.nombre as usuario_nombre 
      FROM reportes r
      JOIN usuarios u ON r.usuario_id = u.id
      ORDER BY r.creado_en DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener reportes:', err);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
};

module.exports = {
  createReport,
  uploadFile,
  getReports
};