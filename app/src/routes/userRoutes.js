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

// Rota para curtir uma imagem da galeria
router.post(
  "/:ownerId/gallery-image/:imageUrl/like/:userId",
  middleware.checkAuthMiddleware,
  userController.likeGalleryImage
);


// Rota para remover o like de uma imagem da galeria
router.delete(
  "/:ownerId/gallery-image/:imageUrl/unlike/:userId",
  middleware.checkAuthMiddleware,
  userController.unlikeGalleryImage
);

// Rota para verificar se o usuário curtiu uma imagem da galeria
router.get(
  "/:ownerId/gallery-image/:imageUrl/check-like/:userId",
  middleware.checkAuthMiddleware,
  userController.checkUserLikedImage
);

// Rota para obter os likes de uma imagem da galeria
router.get(
  "/:userId/gallery-image/:imageUrl/likes",middleware.checkAuthMiddleware,
  userController.getGalleryImageLikes
);

// Rota para encontrar todos os usuários
router.get("/find/:username", middleware.checkAuthMiddleware, userController.findAllUsers);

// Rota para encontrar as top 10 imagens mais curtidas
router.get(
  "/gallery-image/top-liked-images",
  middleware.checkAuthMiddleware,
  userController.getTopLikedImages
);

// Rota para obter todas as fotos de perfil por ID do usuário
router.get("/:id/profile-images", middleware.checkAuthMiddleware, userController.getAllProfileImagesById);

module.exports = router;
