const express = require("express");
const router = express.Router();
const middleware = require("../middleware/check-auth-middleware");
const relationshipController = require("../controllers/followController");

// Rota para seguir usuário

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

router.get(
  "/relationship/:following_id",
  relationshipController.updateUserFollowersCount
);

router.get(
  "/user/:follower_id/following-count",
  relationshipController.getUserFollowingCount
);

module.exports = router;
