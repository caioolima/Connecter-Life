// communityController.js
const CommunityUser = require('../models/communityModel');

// Função para adicionar um usuário a uma comunidade
async function entrarNaComunidade(userId, communityId) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        // Verifica se o usuário já está na comunidade
        if (community.userCountry.includes(userId)) {
            throw new Error('Usuário já está na comunidade');
        }

        // Adiciona o usuário à comunidade
        community.userCountry.push(userId);
        await community.save();
        
        return 'Usuário adicionado à comunidade com sucesso';
    } catch (error) {
        return error.message;
    }
}

// Função para remover um usuário de uma comunidade
async function sairDaComunidade(userId, communityId) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        // Verifica se o usuário está na comunidade
        const index = community.userCountry.indexOf(userId);
        if (index === -1) {
            throw new Error('Usuário não está na comunidade');
        }

        // Remove o usuário da comunidade
        community.userCountry.splice(index, 1);
        await community.save();

        return 'Usuário removido da comunidade com sucesso';
    } catch (error) {
        return error.message;
    }
}

// Função para criar uma nova comunidade
async function criarComunidade(country) {
    try {
        const novaComunidade = new CommunityUser({ country });
        await novaComunidade.save();
        return novaComunidade._id; // Retorna o ID da nova comunidade criada
    } catch (error) {
        return error.message;
    }
}

// Função para listar todas as comunidades
async function listarComunidades() {
  try {
      // Busca todas as comunidades no banco de dados
      const comunidades = await CommunityUser.find();
      return comunidades;
  } catch (error) {
      throw new Error('Erro ao listar as comunidades: ' + error.message);
  }
}


module.exports = { entrarNaComunidade, sairDaComunidade, criarComunidade, listarComunidades };
