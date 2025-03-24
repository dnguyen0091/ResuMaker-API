const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  resumes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Resume',
    default: [] },
  chatHistory: {
    type: [String],
    default: []
  }
}, {timestamps: true, collection: 'Users' });

module.exports = mongoose.model('User', UserSchema);