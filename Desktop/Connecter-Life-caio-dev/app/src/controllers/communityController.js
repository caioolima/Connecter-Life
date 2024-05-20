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

// Função para verificar se o usuário está na comunidade
async function verificarMembroDaComunidade(userId, communityId) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        // Verifica se o usuário está na comunidade
        const isMember = community.userCountry.includes(userId);

        return isMember;
    } catch (error) {
        throw new Error('Erro ao verificar a associação do usuário com a comunidade: ' + error.message);
    }
}

// Função para contar o número de usuários dentro de uma comunidade
async function contarMembrosDaComunidade(communityId) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        const numberOfMembers = community.userCountry.length;

        return numberOfMembers;
    } catch (error) {
        throw new Error('Erro ao contar os membros da comunidade: ' + error.message);
    }
}

async function enviarMensagem(userId, communityId, message, media) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        // Verificar se community.messages é definido antes de acessar a propriedade push
        if (!community.messages) {
            community.messages = []; // Inicialize messages como um array vazio se ainda não estiver definido
        }

        // Adiciona a mensagem à comunidade
        let mediaUrl = media; // Assume que a mídia é um nome de arquivo local
        if (media && media.startsWith('http')) {
            // Se a mídia já for uma URL (caso seja um link do Firebase Storage), use diretamente
            mediaUrl = media;
        }
        community.messages.push({ userId, message, media: mediaUrl }); // Aqui está a modificação
        await community.save();
        
        return 'Mensagem enviada com sucesso';
    } catch (error) {
        return error.message;
    }
}


async function listarMensagens(communityId) {
    try {
        const community = await CommunityUser.findById(communityId);
        if (!community) {
            throw new Error('Comunidade não encontrada');
        }

        // Retorna as mensagens da comunidade
        return community.messages;
    } catch (error) {
        throw new Error('Erro ao listar as mensagens da comunidade: ' + error.message);
    }
}

module.exports = { entrarNaComunidade, sairDaComunidade, criarComunidade, listarComunidades, verificarMembroDaComunidade, contarMembrosDaComunidade, enviarMensagem, listarMensagens   };
