const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const middleware = require("../middleware/check-auth-middleware");

// Rota para encontrar usuário por ID
router.get("/:id", middleware.checkAuthMiddleware, userController.findUserById);

// Rota para adicionar a biografia
router.post(
  "/:id/biography",
  middleware.checkAuthMiddleware,
  userController.addUserBiography
);

// Rota para atualizar a biografia
router.put(
  "/:id/biography",
  middleware.checkAuthMiddleware,
  userController.updateUserBiography
);

// Rota para deletar a biografia
router.delete(
  "/:id/biography",
  middleware.checkAuthMiddleware,
  userController.deleteUserBiography
);

// Rota para atualizar o nome de usuário, biografia e nome completo
router.put(
  "/:id/edit",
  middleware.checkAuthMiddleware,
  userController.updateUserProfile
);

// Rota para adicionar a imagem de perfil do usuário
router.post(
  "/:id/profile-image",
  middleware.checkAuthMiddleware,
  userController.addUserProfileImage
);

// Rota para atualizar a imagem de perfil do usuário
router.put(
  "/:id/edit",
  middleware.checkAuthMiddleware,
  userController.updateUserProfile
);

// Rota para excluir a imagem de perfil do usuário
router.delete(
  "/:id/profile-image",
  middleware.checkAuthMiddleware,
  userController.deleteUserProfileImage
);

// Rota para adicionar uma imagem da galeria ao perfil do usuário
router.post(
  "/:id/gallery-image",
  middleware.checkAuthMiddleware,
  userController.addGalleryImage
);

// Rota para obter as URLs das imagens da galeria do usuário
router.get(
  "/:id/gallery-image",
  middleware.checkAuthMiddleware,
  userController.getGalleryImages
);

// Rota para excluir uma imagem da galeria de um usuário
router.delete(
  "/:userId/gallery-image/:imageUrl",
  middleware.checkAuthMiddleware,
  userController.deleteGalleryImage
);

// Rota para encontrar todos os usuários
router.get(
  "/find/:username",
  userController.findAllUsers
);

// Rota para dar like em uma imagem da galeria do usuário
router.post(
  "/:userId/gallery-image/:imageUrl/like",
  middleware.checkAuthMiddleware,
  userController.likeGalleryImage
);

// Rota para remover o like de uma imagem da galeria do usuário
router.post(
  "/:userId/gallery-image/:imageUrl/unlike",
  middleware.checkAuthMiddleware,
  userController.unlikeGalleryImage
);

router.get(
  "/:userId/gallery-image/:imageUrl/verify",
  middleware.checkAuthMiddleware,
  userController.getLikes
);

// Rota para encontrar as top 10 imagens mais curtidas
router.get(
  "/gallery-image/top-liked-images",
  middleware.checkAuthMiddleware,
  userController.getTopLikedImages
);

module.exports = router;
