const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {timestamps: true, collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);