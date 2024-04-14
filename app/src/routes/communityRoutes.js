const express = require('express');
const router = express.Router();
const usuarioPaisController = require('../controllers/communityController');

// Rota para adicionar um usuário a uma comunidade
router.post('/comunidade/:country/:userId', usuarioPaisController.addUserCommunity);

// Rota para verificar se o usuário faz parte da comunidade
router.get('/checkUserInCommunity/:country/:userId', usuarioPaisController.addUserCommunity);

module.exports = router;
