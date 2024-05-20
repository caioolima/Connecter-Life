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
  profileImageUrl: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
