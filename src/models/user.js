const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: String,
  photoUrl: String,
  preferences: {
    theme: String,
    exportFormat: String,
  },
});

module.exports = mongoose.model('User', userSchema);
