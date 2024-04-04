const express = require("express");
const router = express.Router();
const relationshipController = require("../controllers/followController");

// Rota para seguir um usuário
router.post("/relationship", relationshipController.followUser);

// Rota para deixar de seguir um usuário
router.delete(
  "/relationship/:follower_id/:following_id",
  relationshipController.unfollowUser
);

// Rota para verificar a relação entre dois usuários
router.get(
  "/relationship/:follower_id/:following_id",
  relationshipController.verifyRelationship
);

// Rota para obter o número de seguidores de um usuário
router.get(
  "/relationship/:following_id",
  relationshipController.updateUserFollowersCount
);

// **Nova rota: Obter o número de usuários que o usuário está seguindo**
router.get(
  "/user/:follower_id/following-count",
  relationshipController.getUserFollowingCount
);


module.exports = router;