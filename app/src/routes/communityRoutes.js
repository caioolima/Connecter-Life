const express = require('express');
const router = express.Router();
const usuarioPaisController = require('../controllers/communityController');

// Rota para adicionar um usuário a uma comunidade
router.post('/comunidade/:country/:userId', usuarioPaisController.addUserCommunity);

// Rota para verificar se o usuário faz parte da comunidade
router.get('/checkUserInCommunity/:country/:userId', usuarioPaisController.addUserCommunity);

// Rota para criar uma nova publicação
router.post('/community/:country/posts', usuarioPaisController.createPost);

// Rota para obter todas as publicações da comunidade de um país
router.get('/community/:country/posts', usuarioPaisController.getAllPosts);

// Rota para obter uma única publicação
router.get('/community/:country/posts/:postId', usuarioPaisController.getPostById);

// Rota para adicionar um comentário a uma publicação
router.post('/community/:country/posts/:postId/comments', usuarioPaisController.addCommentToPost);

// Rota para adicionar/remover curtida de uma publicação
router.post('/community/:country/posts/:postId/like', usuarioPaisController.toggleLikeOnPost);

// Rota para excluir uma publicação
router.delete('/community/:country/posts/:postId', usuarioPaisController.deletePost);


module.exports = router;
