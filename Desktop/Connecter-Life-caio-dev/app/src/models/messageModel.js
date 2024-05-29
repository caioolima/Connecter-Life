// messageModel.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  media: String,
  timestamp: { type: Date, default: Date.now } // Adiciona um campo de timestamp
});

module.exports = mongoose.model('Message', MessageSchema);
