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
