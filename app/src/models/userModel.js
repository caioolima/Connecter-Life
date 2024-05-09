const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  dob: Date,
  gender: String,
  biography: String,
  profileImageUrl: String,
  galleryImageUrl: [{
    url: String, // URL of the gallery image
    postedAt: { type: Date, default: Date.now }, // Timestamp of image addition
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs who liked the image
  }],  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
