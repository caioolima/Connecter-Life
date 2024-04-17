// communityRoutes.js
const express = require('express');
const router = express.Router();
const usuarioPaisController = require('../controllers/communityController');

// Desestruture a função verificarMembroDaComunidade
const { verificarMembroDaComunidade, contarMembrosDaComunidade } = usuarioPaisController;
// Rota para entrar na comunidade
router.post('/comunidade/entrar/:userId/:communityId', async (req, res) => {
    const { userId, communityId } = req.params;

    try {
        const result = await usuarioPaisController.entrarNaComunidade(userId, communityId);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para sair da comunidade
router.post('/comunidade/sair/:userId/:communityId', async (req, res) => {
    const { userId, communityId } = req.params;

    try {
        const result = await usuarioPaisController.sairDaComunidade(userId, communityId);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para criar uma nova comunidade
router.post('/comunidade/criar/:country', async (req, res) => {
    const { country } = req.params;

    try {
        const newCommunityId = await usuarioPaisController.criarComunidade(country);
        res.status(201).json({ message: 'Comunidade criada com sucesso', communityId: newCommunityId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para listar todas as comunidades
router.get('/comunidade/listar', async (req, res) => {
    try {
        const comunidades = await usuarioPaisController.listarComunidades();
        res.status(200).json(comunidades);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para verificar se o usuário está na comunidade
router.get('/comunidade/verificar/:userId/:communityId', async (req, res) => {
    const { userId, communityId } = req.params;

    try {
        // Verifica se o usuário está na comunidade
        const isMember = await verificarMembroDaComunidade(userId, communityId);
        if (isMember) {
            res.status(200).json({ message: 'Usuário está na comunidade' });
        } else {
            res.status(200).json({ message: 'Usuário não está na comunidade' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para obter o número de membros da comunidade
router.get('/comunidade/contarMembros/:communityId', async (req, res) => {
    const { communityId } = req.params;

    try {
        // Conte o número de membros na comunidade
        const numberOfMembers = await contarMembrosDaComunidade(communityId);
        res.status(200).json({ numberOfMembers });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
