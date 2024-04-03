const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const middleware = require('../middleware/check-auth-middleware');

// Rota para encontrar usuário por ID
router.get('/:id', middleware.checkAuthMiddleware, userController.findUserById);

// Rota para adicionar a biografia
router.post('/:id/biography', middleware.checkAuthMiddleware, userController.addUserBiography);

// Rota para atualizar a biografia
router.put('/:id/biography', middleware.checkAuthMiddleware, userController.updateUserBiography);

router.delete('/:id/biography', middleware.checkAuthMiddleware, userController.deleteUserBiography);

// Rota para atualizar o nome de usuário, biografia e nome completo
router.put('/:id/edit', middleware.checkAuthMiddleware, userController.updateUserProfile);

// Rota para adicionar a imagem de perfil do usuário
router.post('/:id/profile-image', middleware.checkAuthMiddleware, userController.addUserProfileImage);

// Rota para atualizar a imagem de perfil do usuário
router.put('/:id/edit', middleware.checkAuthMiddleware, userController.updateUserProfile);

// Rota para excluir a imagem de perfil do usuário
router.delete('/:id/profile-image', middleware.checkAuthMiddleware, userController.deleteUserProfileImage);

// Rota para adicionar uma imagem da galeria ao perfil do usuário
router.post('/:id/gallery-image', middleware.checkAuthMiddleware, userController.addGalleryImage);

// Rota para obter as URLs das imagens da galeria do usuário
router.get('/:id/gallery-image', middleware.checkAuthMiddleware, userController.getGalleryImages);

module.exports = router;