// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

// Protege todas las rutas con autenticación
router.use(authController.authenticateToken);

// Rutas para reportes
router.post('/', reportController.createReport);
router.post('/:id/archivos', reportController.uploadFile);
router.get('/', reportController.getReports);

module.exports = router;