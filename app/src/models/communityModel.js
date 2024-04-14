const mongoose = require('mongoose');

const CommunityUserSchema = new mongoose.Schema({
  country : String, // Nome do país
  userCountry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Lista de IDs de usuários associados a este país
});

module.exports = mongoose.model('CommunityUser', CommunityUserSchema);
