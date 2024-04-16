const mongoose = require('mongoose');

const CommunityUserSchema = new mongoose.Schema({
  country: String,
  userCountry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('CommunityUser', CommunityUserSchema);
