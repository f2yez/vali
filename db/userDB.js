const mongoose = require('./db');
const userSchema = new mongoose.Schema({
  userID: Number,
  userType: Number,           //1 means admin        2 means user
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;