// communityModel.js
const mongoose = require('mongoose');

const CommunityUserSchema = new mongoose.Schema({
  country: String,
  userCountry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      media: String,
      timestamp: { type: Date, default: Date.now } // Adiciona um campo de timestamp
    }
  ]
});


module.exports = mongoose.model('CommunityUser', CommunityUserSchema);


