const mongoose = require('mongoose');

const CommunityUserSchema = new mongoose.Schema({
  country: String,
  userCountry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  posts: [{
    text: String,
    image: String, // Aqui você pode armazenar o caminho da imagem no sistema de arquivos ou uma URL
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }]
});


module.exports = mongoose.model('CommunityUser', CommunityUserSchema);
