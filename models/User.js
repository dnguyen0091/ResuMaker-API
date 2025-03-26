import mongoose from 'mongoose';

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
}, {
  timestamps: true,
  collection: 'Users'
});

const User = mongoose.model('User', UserSchema);

export default User;