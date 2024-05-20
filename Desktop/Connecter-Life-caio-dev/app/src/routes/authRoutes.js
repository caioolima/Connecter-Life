// Dentro do authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rotas de autenticação
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/checkAvailability', authController.checkFieldAvailability);

// Rota para buscar o nome de usuário pelo ID
router.get('/auth/user/:userId/username', authController.getUsernameById);

module.exports = router;