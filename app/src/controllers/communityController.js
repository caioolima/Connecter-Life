const CommunityUser = require('../models/communityModel');

exports.addUserCommunity = async (req, res) => {
  const userId = req.params.userId;
  const country = req.params.country;

  try {
    // Verificar se o usuário já está na comunidade
    const existingCommunity = await CommunityUser.findOne({ country: country, userCountry: userId });
    if (existingCommunity) {
      console.log('O usuário já faz parte desta comunidade.');
      return res.status(400).send('O usuário já faz parte desta comunidade.');
    }

    // Encontrar ou criar a comunidade do país
    let community = await CommunityUser.findOne({ country: country });
    if (!community) {
      community = await CommunityUser.create({ country: country, userCountry: [userId] });
    } else {
      community.userCountry.push(userId);
      await community.save();
    }

    console.log('Usuário adicionado à comunidade do país com sucesso.');
    res.status(200).send('Usuário adicionado à comunidade do país com sucesso.');
  } catch (err) {
    console.error('Ocorreu um erro ao adicionar o usuário à comunidade do país:', err);
    res.status(500).send('Erro ao adicionar o usuário à comunidade do país.');
  }
};

exports.checkUserInCommunity = async (req, res) => {
  const userId = req.params.userId;
  const country = req.params.country;

  try {
    // Verificar se o usuário já está na comunidade
    const existingCommunity = await CommunityUser.findOne({ country: country, userCountry: userId });
    if (existingCommunity) {
      console.log('O usuário já faz parte desta comunidade.');
      res.status(200).send({ isInCommunity: true });
    } else {
      console.log('O usuário não faz parte desta comunidade.');
      res.status(200).send({ isInCommunity: false });
    }
  } catch (err) {
    console.error('Ocorreu um erro ao verificar se o usuário está na comunidade:', err);
    res.status(500).send('Erro ao verificar se o usuário está na comunidade.');
  }
};

exports.createPost = async (req, res) => {
  const country = req.params.country;
  const { text, image } = req.body;
  const userId = req.user.id; // Supondo que o ID do usuário esteja disponível no objeto de solicitação

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    community.posts.push({ text: text, image: image, createdBy: userId });
    await community.save();

    console.log('Publicação criada com sucesso na comunidade do país.');
    res.status(200).send('Publicação criada com sucesso na comunidade do país.');
  } catch (err) {
    console.error('Ocorreu um erro ao criar a publicação:', err);
    res.status(500).send('Erro ao criar a publicação na comunidade do país.');
  }
};

exports.getAllPosts = async (req, res) => {
  const country = req.params.country;

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    const posts = community.posts;
    res.status(200).json(posts);
  } catch (err) {
    console.error('Ocorreu um erro ao obter todas as publicações:', err);
    res.status(500).send('Erro ao obter todas as publicações da comunidade do país.');
  }
};

exports.getPostById = async (req, res) => {
  const country = req.params.country;
  const postId = req.params.postId;

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    const post = community.posts.id(postId);
    if (!post) {
      console.log('Publicação não encontrada.');
      return res.status(404).send('Publicação não encontrada.');
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Ocorreu um erro ao obter a publicação:', err);
    res.status(500).send('Erro ao obter a publicação da comunidade do país.');
  }
};

exports.addCommentToPost = async (req, res) => {
  const country = req.params.country;
  const postId = req.params.postId;
  const { text } = req.body;
  const userId = req.user.id; // Supondo que o ID do usuário esteja disponível no objeto de solicitação

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    const post = community.posts.id(postId);
    if (!post) {
      console.log('Publicação não encontrada.');
      return res.status(404).send('Publicação não encontrada.');
    }

    post.comments.push({ user: userId, text: text });
    await community.save();

    console.log('Comentário adicionado com sucesso à publicação.');
    res.status(200).send('Comentário adicionado com sucesso à publicação.');
  } catch (err) {
    console.error('Ocorreu um erro ao adicionar o comentário à publicação:', err);
    res.status(500).send('Erro ao adicionar o comentário à publicação.');
  }
};

exports.toggleLikeOnPost = async (req, res) => {
  const country = req.params.country;
  const postId = req.params.postId;
  const userId = req.user.id; // Supondo que o ID do usuário esteja disponível no objeto de solicitação

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    const post = community.posts.id(postId);
    if (!post) {
      console.log('Publicação não encontrada.');
      return res.status(404).send('Publicação não encontrada.');
    }

    const likedIndex = post.likes.indexOf(userId);
    if (likedIndex === -1) {
      // Se o usuário ainda não curtiu, adiciona a curtida
      post.likes.push(userId);
    } else {
      // Se o usuário já curtiu, remove a curtida
      post.likes.splice(likedIndex, 1);
    }

    await community.save();

    console.log('Curtida na publicação atualizada com sucesso.');
    res.status(200).send('Curtida na publicação atualizada com sucesso.');
  } catch (err) {
    console.error('Ocorreu um erro ao atualizar a curtida na publicação:', err);
    res.status(500).send('Erro ao atualizar a curtida na publicação.');
  }
};

exports.deletePost = async (req, res) => {
  const country = req.params.country;
  const postId = req.params.postId;

  try {
    const community = await CommunityUser.findOne({ country: country });
    if (!community) {
      console.log('Comunidade não encontrada.');
      return res.status(404).send('Comunidade não encontrada.');
    }

    const post = community.posts.id(postId);
    if (!post) {
      console.log('Publicação não encontrada.');
      return res.status(404).send('Publicação não encontrada.');
    }

    post.remove();
    await community.save();

    console.log('Publicação excluída com sucesso.');
    res.status(200).send('Publicação excluída com sucesso.');
  } catch (err) {
    console.error('Ocorreu um erro ao excluir a publicação:', err);
    res.status(500).send('Erro ao excluir a publicação.');
  }
};
